// SISTEMA DE CONTAS - VERSÃO COMPLETA E FUNCIONAL
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
    console.log('=== RENDERIZANDO CONTAS ===');
    console.log('Total de contas:', bills.length);
    console.log('Contas filtradas:', filteredBills.length);
    
    const tbody = document.getElementById('billsTableBody');
    if (!tbody) {
        console.error('Elemento billsTableBody não encontrado!');
        return;
    }
    
    tbody.innerHTML = '';
    
    if (filteredBills.length === 0) {
        console.log('Nenhuma conta para renderizar');
        return;
    }
    
    filteredBills.forEach((bill, index) => {
        console.log(Renderizando conta :, bill.company, bill.value);
        
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
        } else {
            statusClass += ' bill-to-pay';
            statusText = 'A pagar';
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
    
    console.log('=== RENDERIZAÇÃO CONCLUÍDA ===');
}

// Função para atualizar resumo
function updateSummary() {
    console.log('=== ATUALIZANDO RESUMO ===');
    
    const totalBills = filteredBills.reduce((sum, bill) => sum + bill.value, 0);
    const totalWithBalance = totalBills + bankBalance;
    const workingDays = 12; // Dias úteis de 17/09 a 30/09
    const dailyAmount = totalWithBalance / workingDays;
    
    console.log('Total contas:', totalBills);
    console.log('Saldo bancário:', bankBalance);
    console.log('Total geral:', totalWithBalance);
    console.log('Valor por dia:', dailyAmount);
    
    const totalBillsEl = document.getElementById('totalBills');
    const bankBalanceEl = document.getElementById('bankBalanceDisplay');
    const totalGeneralEl = document.getElementById('totalGeneral');
    const dailyAmountEl = document.getElementById('dailyAmount');
    const workingDaysEl = document.getElementById('workingDays');
    const filteredCountEl = document.getElementById('filteredCount');
    const balanceDisplayEl = document.getElementById('balanceDisplay');
    
    if (totalBillsEl) {
        totalBillsEl.textContent = formatCurrency(totalBills);
        console.log('Total contas atualizado:', formatCurrency(totalBills));
    }
    if (bankBalanceEl) {
        bankBalanceEl.textContent = formatCurrency(bankBalance);
        console.log('Saldo bancário atualizado:', formatCurrency(bankBalance));
    }
    if (totalGeneralEl) {
        totalGeneralEl.textContent = formatCurrency(totalWithBalance);
        console.log('Total geral atualizado:', formatCurrency(totalWithBalance));
    }
    if (dailyAmountEl) {
        dailyAmountEl.textContent = formatCurrency(dailyAmount);
        console.log('Valor por dia atualizado:', formatCurrency(dailyAmount));
    }
    if (workingDaysEl) {
        workingDaysEl.textContent = workingDays.toString();
        console.log('Dias úteis atualizado:', workingDays);
    }
    if (filteredCountEl) {
        filteredCountEl.textContent = ${filteredBills.length} contas;
        console.log('Contador de contas atualizado:', filteredBills.length);
    }
    if (balanceDisplayEl) {
        balanceDisplayEl.textContent = formatCurrency(bankBalance);
        console.log('Display do saldo atualizado:', formatCurrency(bankBalance));
    }
    
    // Atualizar cor do saldo bancário
    if (bankBalanceEl) {
        bankBalanceEl.className = 'card-value';
        if (bankBalance > 0) {
            bankBalanceEl.style.color = '#dc2626';
        } else if (bankBalance < 0) {
            bankBalanceEl.style.color = '#16a34a';
        } else {
            bankBalanceEl.style.color = '#6b7280';
        }
    }
    
    console.log('=== RESUMO ATUALIZADO ===');
}

// Função para atualizar saldo bancário - VERSÃO CORRIGIDA E FUNCIONAL
function updateBalance() {
    console.log('=== ATUALIZANDO SALDO BANCÁRIO ===');
    
    const input = document.getElementById('balanceInput');
    console.log('Campo balanceInput encontrado:', input);
    
    if (!input) {
        console.error('Campo balanceInput não encontrado!');
        alert('Erro: Campo de saldo não encontrado!');
        return;
    }
    
    const inputValue = input.value;
    console.log('Valor digitado no input:', inputValue);
    
    if (!inputValue || inputValue.trim() === '') {
        alert('Por favor, digite um valor para o saldo bancário!');
        return;
    }
    
    // Converter vírgula para ponto e processar
    const balance = parseFloat(inputValue.replace(',', '.')) || 0;
    console.log('Valor processado:', balance);
    
    if (isNaN(balance)) {
        alert('Por favor, digite um valor numérico válido!');
        return;
    }
    
    bankBalance = balance;
    console.log('Saldo bancário definido como:', bankBalance);
    
    // Atualizar resumo completo (isso já atualiza todos os campos)
    updateSummary();
    
    // Salvar no localStorage
    localStorage.setItem('bankBalance', balance.toString());
    console.log('Saldo bancário salvo no localStorage:', balance);
    
    // Mostrar feedback visual
    const button = document.querySelector('button[onclick="updateBalance()"]');
    if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Atualizado!';
        button.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
        
        setTimeout(() => {
            button.innerHTML = originalText;
            button.style.background = '';
        }, 2000);
    }
    
    console.log('=== SALDO BANCÁRIO ATUALIZADO COM SUCESSO ===');
}

// Função para aplicar filtro de datas
function applyFilter() {
    console.log('=== APLICANDO FILTRO ===');
    
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    console.log('Data inicial:', startDate);
    console.log('Data final:', endDate);
    
    if (startDate && endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        filteredBills = bills.filter(bill => {
            const billDate = new Date(bill.date.split('/').reverse().join('-'));
            return billDate >= start && billDate <= end;
        });
        
        console.log('Contas filtradas:', filteredBills.length);
    } else {
        filteredBills = [...bills];
        console.log('Filtro limpo, mostrando todas as contas');
    }
    
    renderBills();
    updateSummary();
    
    console.log('=== FILTRO APLICADO ===');
}

// Função para limpar filtro
function clearFilter() {
    console.log('=== LIMPANDO FILTRO ===');
    
    document.getElementById('startDate').value = '2025-09-17';
    document.getElementById('endDate').value = '2025-09-30';
    filteredBills = [...bills];
    
    renderBills();
    updateSummary();
    
    console.log('=== FILTRO LIMPO ===');
}

// Função para importar contas
function importBills() {
    console.log('=== INICIANDO IMPORTAÇÃO ===');
    
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    
    if (file) {
        selectedFile = file;
        document.getElementById('modalTitle').textContent = 'Importar Contas';
        document.getElementById('modalMessage').textContent = Deseja importar as contas do arquivo ""?;
        document.getElementById('modal').style.display = 'block';
        console.log('Arquivo selecionado:', file.name);
    } else {
        alert('Por favor, selecione um arquivo primeiro!');
    }
}

// Função para confirmar importação
function confirmImport() {
    console.log('=== CONFIRMANDO IMPORTAÇÃO ===');
    
    if (selectedFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            const lines = content.split('\n');
            const newBills = [];
            
            console.log('Processando arquivo...');
            console.log('Linhas encontradas:', lines.length);
            
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
                            
                            console.log('Conta processada:', company, value);
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
                console.log('Importação concluída:', newBills.length, 'contas');
            } else {
                alert('Nenhuma conta válida encontrada no arquivo');
                console.log('Nenhuma conta válida encontrada');
            }
        };
        reader.readAsText(selectedFile);
    }
    closeModal();
}

// Função para baixar template
function downloadTemplate() {
    console.log('=== BAIXANDO TEMPLATE ===');
    
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
    
    console.log('Template baixado com sucesso');
}

// Função para fechar modal
function closeModal() {
    console.log('=== FECHANDO MODAL ===');
    
    document.getElementById('modal').style.display = 'none';
    selectedFile = null;
    document.getElementById('fileInput').value = '';
}

// Funções para editar e excluir
function editBill(id) {
    console.log('=== EDITANDO CONTA ===', id);
    
    const bill = bills.find(b => b.id === id);
    if (bill) {
        const newCompany = prompt('Empresa:', bill.company);
        if (newCompany === null) return; // Usuário cancelou
        
        const newNumber = prompt('Número:', bill.number);
        if (newNumber === null) return;
        
        const newParcels = prompt('Parcelas:', bill.parcels);
        if (newParcels === null) return;
        
        const newDate = prompt('Data (DD/MM/AAAA):', bill.date);
        if (newDate === null) return;
        
        const newValue = prompt('Valor:', bill.value);
        if (newValue === null) return;
        
        if (newCompany && newDate && newValue) {
            bill.company = newCompany;
            bill.number = newNumber;
            bill.parcels = newParcels;
            bill.date = newDate;
            bill.value = parseFloat(newValue);
            
            renderBills();
            updateSummary();
            
            console.log('Conta editada com sucesso:', bill);
            alert('Conta editada com sucesso!');
        }
    }
}

function deleteBill(id) {
    console.log('=== EXCLUINDO CONTA ===', id);
    
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
        const originalLength = bills.length;
        bills = bills.filter(bill => bill.id !== id);
        filteredBills = [...bills];
        
        if (bills.length < originalLength) {
            renderBills();
            updateSummary();
            console.log('Conta excluída com sucesso');
            alert('Conta excluída com sucesso!');
        } else {
            console.log('Conta não encontrada para exclusão');
        }
    }
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO APLICAÇÃO ===');
    console.log('DOM carregado, inicializando aplicação...');
    
    // Carregar saldo bancário do localStorage
    const savedBalance = localStorage.getItem('bankBalance');
    if (savedBalance !== null) {
        bankBalance = parseFloat(savedBalance);
        const balanceInput = document.getElementById('balanceInput');
        if (balanceInput) {
            balanceInput.value = bankBalance;
        }
        console.log('Saldo bancário carregado do localStorage:', bankBalance);
    }
    
    // Garantir que as contas filtradas estejam corretas
    filteredBills = [...bills];
    console.log('Contas filtradas inicializadas:', filteredBills.length);
    
    // Renderizar contas e atualizar resumo
    console.log('Chamando renderBills()...');
    renderBills();
    
    console.log('Chamando updateSummary()...');
    updateSummary();
    
    // Adicionar event listeners
    const balanceInput = document.getElementById('balanceInput');
    if (balanceInput) {
        balanceInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                console.log('Enter pressionado no campo de saldo');
                updateBalance();
            }
        });
        
        balanceInput.addEventListener('input', function(e) {
            console.log('Valor digitado no campo de saldo:', e.target.value);
        });
    }
    
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate) {
        startDate.addEventListener('change', applyFilter);
    }
    if (endDate) {
        endDate.addEventListener('change', applyFilter);
    }
    
    console.log('=== APLICAÇÃO INICIALIZADA COM SUCESSO ===');
});

// Forçar renderização após 1 segundo (fallback)
setTimeout(function() {
    console.log('=== FALLBACK: FORÇANDO RENDERIZAÇÃO ===');
    if (document.getElementById('billsTableBody')) {
        renderBills();
        updateSummary();
    }
}, 1000);

// Debug: Verificar se as funções estão disponíveis globalmente
window.updateBalance = updateBalance;
window.applyFilter = applyFilter;
window.clearFilter = clearFilter;
window.importBills = importBills;
window.confirmImport = confirmImport;
window.downloadTemplate = downloadTemplate;
window.closeModal = closeModal;
window.editBill = editBill;
window.deleteBill = deleteBill;

console.log('=== FUNÇÕES GLOBAIS DEFINIDAS ===');
console.log('updateBalance disponível:', typeof window.updateBalance);
console.log('applyFilter disponível:', typeof window.applyFilter);
console.log('clearFilter disponível:', typeof window.clearFilter);
