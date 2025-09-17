// Dados das contas
let bills = [
    {id: 1, company: 'FLORA', number: 'NF 130165', parcels: '3/3', date: '17/09/2025', value: 33825.36},
    {id: 2, company: 'ROMETAL', number: 'NF 160349', parcels: '1/3', date: '18/09/2025', value: 6279.72},
    {id: 3, company: 'ROMETAL', number: 'NF 251614', parcels: '1/3', date: '18/09/2025', value: 2848.22},
    {id: 4, company: 'UNA', number: 'NF 184351', parcels: '2/3', date: '18/09/2025', value: 2900.65},
    {id: 5, company: 'BARZEL', number: 'NF 375509', parcels: '1/3', date: '19/09/2025', value: 719.81},
    {id: 6, company: 'EMPRÉSTIMO ITAÚ', number: '', parcels: '22/42', date: '19/09/2025', value: 41345.46},
    {id: 7, company: 'FLORA', number: 'NF 131545', parcels: '2/3', date: '19/09/2025', value: 37085.94},
    {id: 8, company: 'IBRAP', number: 'NF 664371', parcels: '3/5', date: '19/09/2025', value: 225.76},
    {id: 9, company: 'FGTS', number: '', parcels: 'MENSAL', date: '20/09/2025', value: 1200.00},
    {id: 10, company: 'FRETE - METALFIXE', number: 'NF 23848 - TRL', parcels: '1/1', date: '20/09/2025', value: 425.41},
    {id: 11, company: 'INSS', number: '', parcels: 'MENSAL', date: '20/09/2025', value: 7000.00},
    {id: 12, company: 'TEGUS', number: 'NF 26670', parcels: '1/3', date: '20/09/2025', value: 2588.34},
    {id: 13, company: 'FLORA', number: 'NF 133036', parcels: '1/3', date: '22/09/2025', value: 34583.62},
    {id: 14, company: 'ARTECOLA', number: 'NF 651630', parcels: '2/3', date: '23/09/2025', value: 1498.72},
    {id: 15, company: 'STAM', number: 'NF 392008', parcels: '1/4', date: '23/09/2025', value: 1398.28},
    {id: 16, company: 'ALTERDATA', number: '', parcels: 'MENSAL', date: '26/09/2025', value: 870.31},
    {id: 17, company: 'HELA', number: 'NF 117062', parcels: '4/4', date: '26/09/2025', value: 417.50},
    {id: 18, company: 'METALNOX', number: 'NF 1819', parcels: '2/3', date: '27/09/2025', value: 2965.70},
    {id: 19, company: 'FLORA', number: 'NF 132003', parcels: '2/3', date: '28/09/2025', value: 39822.23},
    {id: 20, company: 'FLORA', number: 'NF 132005', parcels: '2/3', date: '28/09/2025', value: 466.73},
    {id: 21, company: 'METALNOX', number: 'NF 1912', parcels: '1/3', date: '28/09/2025', value: 2839.76},
    {id: 22, company: 'BARZEL', number: 'NF 375509', parcels: '2/3', date: '29/09/2025', value: 622.66},
    {id: 23, company: 'ARTECOLA', number: 'NF 651630', parcels: '3/3', date: '30/09/2025', value: 1499.17},
    {id: 24, company: 'CONTADOR', number: '', parcels: 'MENSAL', date: '30/09/2025', value: 2904.00},
    {id: 25, company: 'FOLHA PAGAMENTO', number: '', parcels: 'MENSAL', date: '30/09/2025', value: 9000.00},
    {id: 26, company: 'MASUTTI', number: 'NF 117654', parcels: '2/3', date: '30/09/2025', value: 1821.98},
    {id: 27, company: 'METALNOX', number: 'NF 68272', parcels: '2/3', date: '30/09/2025', value: 1762.17},
    {id: 28, company: 'PRO-LABORE ARIOSTO 09/2025', number: '', parcels: 'MENSAL', date: '30/09/2025', value: 10000.00},
    {id: 29, company: 'PRO-LABORE RONALDO 09/2025', number: '', parcels: 'MENSAL', date: '30/09/2025', value: 10000.00},
    {id: 30, company: 'TEGUS', number: 'NF 26670', parcels: '2/3', date: '30/09/2025', value: 2588.34}
];

let bankBalance = 0.0;
let filteredBills = [...bills];
let selectedFile = null;

// Função para formatar moeda
function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Função para calcular dias úteis
function calculateWorkingDays(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    let workingDays = 0;
    const current = new Date(start);
    
    while (current <= end) {
        const dayOfWeek = current.getDay();
        if (dayOfWeek >= 1 && dayOfWeek <= 6) { // Segunda a sábado
            workingDays++;
        }
        current.setDate(current.getDate() + 1);
    }
    
    return workingDays;
}

// Função para renderizar contas na tabela
function renderBills() {
    const tbody = document.getElementById('billsTableBody');
    if (!tbody) {
        console.error('Elemento billsTableBody não encontrado');
        return;
    }
    
    tbody.innerHTML = '';
    
    filteredBills.forEach(bill => {
        const row = document.createElement('tr');
        
        const today = new Date();
        const billDate = new Date(bill.date.split('/').reverse().join('-'));
        const isOverdue = billDate < today;
        const isToday = billDate.toDateString() === today.toDateString();
        
        let statusClass = 'bill-status';
        let statusText = 'A pagar';
        
        if (isOverdue) {
            statusClass += ' bill-overdue';
            statusText = 'Vencida';
        } else if (isToday) {
            statusClass += ' bill-today';
            statusText = 'Hoje';
        }
        
        row.innerHTML = 
            <td>
                <div class="bill-company"></div>
                <div class="bill-number"></div>
            </td>
            <td>
                <span class="bill-parcels"></span>
            </td>
            <td class="bill-date"></td>
            <td>
                <span class=""></span>
            </td>
            <td>
                <div class="bill-value"></div>
            </td>
            <td>
                <div class="bill-actions">
                    <button class="btn btn-edit" onclick="editBill()">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-delete" onclick="deleteBill()">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </td>
        ;
        
        tbody.appendChild(row);
    });
}

// Função para atualizar resumo
function updateSummary() {
    const totalBills = filteredBills.reduce((sum, bill) => sum + bill.value, 0);
    const totalWithBalance = totalBills + bankBalance;
    const workingDays = 12; // Dias úteis de 17/09 a 30/09
    const dailyAmount = totalWithBalance / workingDays;
    
    const totalBillsEl = document.getElementById('totalBills');
    const bankBalanceEl = document.getElementById('bankBalanceDisplay');
    const totalGeneralEl = document.getElementById('totalGeneral');
    const dailyAmountEl = document.getElementById('dailyAmount');
    const workingDaysEl = document.getElementById('workingDays');
    const filteredCountEl = document.getElementById('filteredCount');
    
    if (totalBillsEl) totalBillsEl.textContent = formatCurrency(totalBills);
    if (bankBalanceEl) bankBalanceEl.textContent = formatCurrency(bankBalance);
    if (totalGeneralEl) totalGeneralEl.textContent = formatCurrency(totalWithBalance);
    if (dailyAmountEl) dailyAmountEl.textContent = formatCurrency(dailyAmount);
    if (workingDaysEl) workingDaysEl.textContent = workingDays.toString();
    if (filteredCountEl) filteredCountEl.textContent = ${filteredBills.length} contas;
    
    // Atualizar cor do saldo bancário
    if (bankBalanceEl) {
        bankBalanceEl.className = 'value';
        if (bankBalance > 0) {
            bankBalanceEl.style.color = '#dc2626';
        } else if (bankBalance < 0) {
            bankBalanceEl.style.color = '#16a34a';
        } else {
            bankBalanceEl.style.color = '#6b7280';
        }
    }
}

// Função para atualizar saldo bancário
function updateBalance() {
    const input = document.getElementById('balanceInput');
    const balance = parseFloat(input.value) || 0;
    
    bankBalance = balance;
    updateSummary();
    
    // Salvar no localStorage
    localStorage.setItem('bankBalance', balance.toString());
}

// Função para aplicar filtro de datas
function applyFilter() {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        filteredBills = bills.filter(bill => {
            const billDate = new Date(bill.date.split('/').reverse().join('-'));
            return billDate >= start && billDate <= end;
        });
    } else {
        filteredBills = [...bills];
    }
    
    renderBills();
    updateSummary();
}

// Função para limpar filtro
function clearFilter() {
    document.getElementById('startDate').value = '2025-09-17';
    document.getElementById('endDate').value = '2025-09-30';
    filteredBills = [...bills];
    renderBills();
    updateSummary();
}

// Função para importar contas
function importBills() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        selectedFile = file;
        document.getElementById('modalTitle').textContent = 'Importar Contas';
        document.getElementById('modalMessage').textContent = Deseja importar as contas do arquivo ""?;
        document.getElementById('modal').style.display = 'block';
    }
}

// Função para confirmar importação
function confirmImport() {
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const lines = content.split('\n');
            const newBills = [];
            
            lines.forEach((line, index) => {
                if (line.trim() && index > 0) { // Pular cabeçalho
                    const parts = line.split('\t');
                    if (parts.length >= 4) {
                        try {
                            const fullName = parts[0].trim();
                            const parcels = parts[1].trim();
                            const dateStr = parts[2].trim();
                            const valueStr = parts[3].trim();
                            
                            const nameMatch = fullName.match(/(.*)\s*-\s*(NF\s*\d+.*)/);
                            const company = nameMatch ? nameMatch[1].trim() : fullName;
                            const number = nameMatch ? nameMatch[2].trim() : '';
                            
                            const value = parseFloat(valueStr.replace('R$', '').replace('.', '').replace(',', '.').trim());
                            
                            newBills.push({
                                id: bills.length + newBills.length + 1,
                                company: company,
                                number: number,
                                parcels: parcels,
                                date: dateStr,
                                value: value
                            });
                        } catch (error) {
                            console.log('Erro ao processar linha:', line, error);
                        }
                    }
                }
            });
            
            if (newBills.length > 0) {
                bills = newBills;
                filteredBills = [...bills];
                renderBills();
                updateSummary();
                alert(Importadas  contas com sucesso!);
            } else {
                alert('Nenhuma conta válida encontrada no arquivo');
            }
        };
        reader.readAsText(selectedFile);
    }
    closeModal();
}

// Função para baixar template
function downloadTemplate() {
    const template = EMPRESA - NF NUMERO\tPARCELA\tDATA\tVALOR
ARTECOLA - NF 651630\t1/3\t16/09/2025\tR$ 1.498,72
EXEMPLO - NF 123456\t2/3\t17/09/2025\tR$ 2.500,00
TESTE - NF 789012\t3/3\t18/09/2025\tR$ 1.200,50;
    
    const blob = new Blob([template], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contas_template.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
}

// Função para fechar modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    selectedFile = null;
    document.getElementById('fileInput').value = '';
}

// Funções para editar e excluir
function editBill(id) {
    const bill = bills.find(b => b.id === id);
    if (bill) {
        const newCompany = prompt('Empresa:', bill.company);
        const newNumber = prompt('Número:', bill.number);
        const newParcels = prompt('Parcelas:', bill.parcels);
        const newDate = prompt('Data (DD/MM/AAAA):', bill.date);
        const newValue = prompt('Valor:', bill.value);
        
        if (newCompany && newDate && newValue) {
            bill.company = newCompany;
            bill.number = newNumber;
            bill.parcels = newParcels;
            bill.date = newDate;
            bill.value = parseFloat(newValue);
            
            renderBills();
            updateSummary();
        }
    }
}

function deleteBill(id) {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
        bills = bills.filter(bill => bill.id !== id);
        filteredBills = [...bills];
        renderBills();
        updateSummary();
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado, inicializando aplicação...');
    
    // Carregar saldo bancário do localStorage
    const savedBalance = localStorage.getItem('bankBalance');
    if (savedBalance) {
        bankBalance = parseFloat(savedBalance);
        const balanceInput = document.getElementById('balanceInput');
        if (balanceInput) {
            balanceInput.value = bankBalance;
        }
    }
    
    // Renderizar contas e atualizar resumo
    renderBills();
    updateSummary();
    
    console.log('Aplicação inicializada com sucesso!');
});
