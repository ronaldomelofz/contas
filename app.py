from flask import Flask, render_template, request, jsonify
import datetime
import re

app = Flask(__name__)

bills = []
bank_balance = 0.0

# Função para calcular dias úteis (segunda a sábado)
def calculate_working_days(start_date_str, end_date_str):
    start_date = datetime.datetime.strptime(start_date_str, "%Y-%m-%d").date()
    end_date = datetime.datetime.strptime(end_date_str, "%Y-%m-%d").date()
    
    working_days = 0
    current_date = start_date
    while current_date <= end_date:
        # Monday (0) to Saturday (5) in Python's weekday()
        if 0 <= current_date.weekday() <= 5: 
            working_days += 1
        current_date += datetime.timedelta(days=1)
    return working_days

# Função para parsear o texto do arquivo contas.txt
def parse_bills_text(text_content):
    parsed = []
    lines = text_content.split('\n')
    for line in lines:
        line = line.strip()
        if not line or "TOTAL" in line or "DIAS" in line:
            continue

        parts = re.split(r'\t+', line) # Split by one or more tabs
        
        if len(parts) >= 4:
            try:
                full_name = parts[0].strip()
                parcels = parts[1].strip()
                date_str = parts[2].strip()
                value_str = parts[3].strip()

                # Extract name and number
                name_match = re.match(r'(.*)\s*-\s*(NF\s*\d+.*)', full_name)
                if name_match:
                    name = name_match.group(1).strip()
                    number = name_match.group(2).strip()
                else:
                    name = full_name
                    number = "" # No specific NF number found

                # Date format DD/MM/YYYY to YYYY-MM-DD
                date_parts = date_str.split('/')
                if len(date_parts) == 3:
                    formatted_date = f"{date_parts[2]}-{date_parts[1].zfill(2)}-{date_parts[0].zfill(2)}"
                else:
                    print(f"Skipping line due to invalid date format: {line}")
                    continue

                # Value format R$ 1.498,72 to 1498.72
                value = float(value_str.replace('R$', '').replace('.', '').replace(',', '.').strip())
                
                parsed.append({
                    "name": name,
                    "number": number,
                    "parcels": parcels,
                    "date": formatted_date,
                    "value": value
                })
            except (ValueError, IndexError) as e:
                print(f"Error parsing line: {line} - {e}")
                continue
    return parsed

# Carregar contas do arquivo
def load_bills_from_file():
    global bills
    try:
        with open("contas.txt", "r", encoding="utf-8") as f:
            content = f.read()
            bills = parse_bills_text(content)
        print(f"Carregadas {len(bills)} contas do arquivo contas.txt")
    except FileNotFoundError:
        print("Arquivo contas.txt não encontrado. Nenhuma conta carregada.")
        bills = []
    except Exception as e:
        print(f"Erro ao ler ou parsear contas.txt: {e}")
        bills = []

@app.route('/')
def index():
    global bank_balance
    # AJUSTADO: Data inicial para 17/09 (hoje) até 30/09
    start_date_filter = request.args.get('startDate', '2025-09-17')
    end_date_filter = request.args.get('endDate', '2025-09-30')
    
    filtered_bills = []
    if start_date_filter and end_date_filter:
        for bill in bills:
            if start_date_filter <= bill['date'] <= end_date_filter:
                filtered_bills.append(bill)
    else:
        filtered_bills = bills # If no filter, show all

    # Sort bills by date
    filtered_bills.sort(key=lambda x: x['date'])

    # Calcular total das contas
    total_bills_value = sum(bill['value'] for bill in filtered_bills)
    
    # NOVO: Somar saldo bancário ao total das contas
    total_with_balance = total_bills_value + bank_balance
    
    working_days = calculate_working_days(start_date_filter, end_date_filter)
    daily_amount = total_with_balance / working_days if working_days > 0 else 0

    return render_template('index.html', 
                        bills=filtered_bills, 
                        total_bills_value=total_bills_value,
                        total_with_balance=total_with_balance,  # Novo campo
                        daily_amount=daily_amount,
                        working_days=working_days,
                        bank_balance=bank_balance,
                        start_date_filter=start_date_filter,
                        end_date_filter=end_date_filter)

@app.route('/update_balance', methods=['POST'])
def update_balance():
    global bank_balance
    try:
        data = request.get_json()
        new_balance = float(data.get('balance', 0.0))
        bank_balance = new_balance
        return jsonify({"success": True, "balance": bank_balance})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 400

if __name__ == '__main__':
    print("Iniciando sistema de contas...")
    load_bills_from_file()
    print(f"Sistema carregado com {len(bills)} contas")
    print("Acesse: http://localhost:3000")
    app.run(debug=True, host="0.0.0.0", port=3000)


@app.route('/import_bills', methods=['POST'])
def import_bills():
    global bills
    try:
        # Get the uploaded file
        if 'file' not in request.files:
            return jsonify({'success': False, 'error': 'Nenhum arquivo enviado'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'success': False, 'error': 'Nenhum arquivo selecionado'}), 400
        
        if file and file.filename.endswith('.txt'):
            # Read file content
            content = file.read().decode('utf-8')
            
            # Parse the content
            new_bills = parse_bills_text(content)
            
            if new_bills:
                bills = new_bills
                return jsonify({
                    'success': True, 
                    'message': f'Importadas {len(bills)} contas com sucesso!',
                    'count': len(bills)
                })
            else:
                return jsonify({'success': False, 'error': 'Nenhuma conta válida encontrada no arquivo'}), 400
        else:
            return jsonify({'success': False, 'error': 'Formato de arquivo inválido. Use .txt'}), 400
            
    except Exception as e:
        return jsonify({'success': False, 'error': f'Erro ao importar: {str(e)}'}), 500

@app.route('/download_template')
def download_template():
    # Create a sample template file
    template_content = '''ARTECOLA - NF 6516301/316/09/2025R$ 1.498,72
EXEMPLO - NF 1234562/317/09/2025R$ 2.500,00
TESTE - NF 7890123/318/09/2025R$ 1.200,50'''
    
    return template_content, 200, {
        'Content-Type': 'text/plain; charset=utf-8',
        'Content-Disposition': 'attachment; filename=contas_template.txt'
    }

