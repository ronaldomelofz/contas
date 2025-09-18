// SISTEMA DE CONTAS - VERSÃO SEM SALDO BANCÁRIO
// Dados padrão das contas (usados apenas na primeira vez)
const defaultBills = [
    {id: 1, company: 'FLORA', number: 'NF 130165', parcels: '3/3', date: '17/09/2025', value: 33825.36},
    {id: 2, company: 'ROMETAL', number: 'NF 160349', parcels: '1/3', date: '18/09/2025', value: 6279.72},
    {id: 3, company: 'ROMETAL', number: 'NF 251614', parcels: '1/3', date: '18/09/2025', value: 2848.22},
    {id: 4, company: 'UNA', number: 'NF 184351', parcels: '2/3', date: '18/09/2025', value: 2900.65},
    {id: 5, company: 'FRETE', number: 'TRL', parcels: '1/1', date: '18/09/2025', value: 449.83},
    {id: 6, company: 'BARZEL', number: 'NF 375509', parcels: '1/3', date: '19/09/2025', value: 719.81},
    {id: 7, company: 'EMPRÉSTIMO ITAÚ', number: '', parcels: '22/42', date: '19/09/2025', value: 41345.46},
    {id: 8, company: 'FLORA', number: 'NF 131545', parcels: '2/3', date: '19/09/2025', value: 37085.94},
    {id: 9, company: 'IBRAP', number: 'NF 664371', parcels: '3/5', date: '19/09/2025', value: 225.76},
    {id: 10, company: 'FGTS', number: '', parcels: 'MENSAL', date: '20/09/2025', value: 1200.00},
    {id: 11, company: 'FRETE - METALFIXE', number: 'NF 23848 - TRL', parcels: '1/1', date: '20/09/2025', value: 425.41},
    {id: 12, company: 'INSS', number: '', parcels: 'MENSAL', date: '20/09/2025', value: 7000.00},
    {id: 13, company: 'TEGUS', number: 'NF 26670', parcels: '1/3', date: '20/09/2025', value: 2588.34},
    {id: 14, company: 'FLORA', number: 'NF 133036', parcels: '1/3', date: '22/09/2025', value: 34583.62},
    {id: 15, company: 'ARTECOLA', number: 'NF 651630', parcels: '2/3', date: '23/09/2025', value: 1498.72},
    {id: 16, company: 'STAM', number: 'NF 392008', parcels: '1/4', date: '23/09/2025', value: 1398.28},
    {id: 17, company: 'ALTERDATA', number: '', parcels: 'MENSAL', date: '26/09/2025', value: 870.31},
    {id: 18, company: 'HELA', number: 'NF 117062', parcels: '4/4', date: '26/09/2025', value: 417.50},
    {id: 19, company: 'METALNOX', number: 'NF 1819', parcels: '2/3', date: '27/09/2025', value: 2965.70},
    {id: 20, company: 'FLORA', number: 'NF 132003', parcels: '2/3', date: '28/09/2025', value: 39822.23},
    {id: 21, company: 'FLORA', number: 'NF 132005', parcels: '2/3', date: '28/09/2025', value: 466.73},
    {id: 22, company: 'METALNOX', number: 'NF 1912', parcels: '1/3', date: '28/09/2025', value: 2839.76},
    {id: 23, company: 'BARZEL', number: 'NF 375509', parcels: '2/3', date: '29/09/2025', value: 622.66},
    {id: 24, company: 'ARTECOLA', number: 'NF 651630', parcels: '3/3', date: '30/09/2025', value: 1499.17},
    {id: 25, company: 'CONTADOR', number: '', parcels: 'MENSAL', date: '30/09/2025', value: 2904.00},
    {id: 26, company: 'FOLHA PAGAMENTO', number: '', parcels: 'MENSAL', date: '30/09/2025', value: 9000.00},
    {id: 27, company: 'MASUTTI', number: 'NF 117654', parcels: '2/3', date: '30/09/2025', value: 1821.98},
    {id: 28, company: 'METALNOX', number: 'NF 68272', parcels: '2/3', date: '30/09/2025', value: 1762.17},
    {id: 29, company: 'PRO-LABORE ARIOSTO 09/2025', number: '', parcels: 'MENSAL', date: '30/09/2025', value: 10000.00},
    {id: 30, company: 'PRO-LABORE RONALDO 09/2025', number: '', parcels: 'MENSAL', date: '30/09/2025', value: 10000.00},
    {id: 31, company: 'TEGUS', number: 'NF 26670', parcels: '2/3', date: '30/09/2025', value: 2588.34}
];

// Variáveis globais
let bills = [];
let filteredBills = [];
let selectedFile = null;
let isAdminLoggedIn = false;

// Chaves para localStorage
const STORAGE_KEYS = {
    BILLS: 'contas_bills',
    LAST_MODIFIED: 'contas_last_modified',
    ADMIN_LOGGED_IN: 'contas_admin_logged_in'
};

// Credenciais administrativas
const ADMIN_CREDENTIALS = {
    username: 'ADMIN',
    password: '1214'
};

// Função para salvar contas no localStorage
function saveBillsToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
        localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, new Date().toISOString());
        console.log('✅ Contas salvas no localStorage:', bills.length, 'contas');
    } catch (error) {
        console.error('❌ Erro ao salvar contas:', error);
        alert('Erro ao salvar as alterações. Tente novamente.');
    }
}

// Função para carregar contas do localStorage
function loadBillsFromStorage() {
    try {
        const savedBills = localStorage.getItem(STORAGE_KEYS.BILLS);
        if (savedBills) {
            bills = JSON.parse(savedBills);
            console.log('✅ Contas carregadas do localStorage:', bills.length, 'contas');
            return true;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar contas:', error);
    }
    return false;
}

// Função para inicializar contas
function initializeBills() {
    if (!loadBillsFromStorage()) {
        bills = [...defaultBills];
        saveBillsToStorage();
        console.log('🔄 Contas inicializadas com dados padrão');
    }
    filteredBills = [...bills];
}

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

// Função para obter o período de filtro atual
function getCurrentFilterPeriod() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    if (startDateInput && endDateInput && startDateInput.value && endDateInput.value) {
        return {
            start: startDateInput.value,
            end: endDateInput.value
        };
    }
    
    return {
        start: '2025-09-17',
        end: '2025-09-30'
    };
}

// Função para converter data DD/MM/AAAA para objeto Date
function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/');
    return new Date(year, month - 1, day);
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
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center; padding: 20px; color: #6c757d;">Nenhuma conta encontrada</td>';
        tbody.appendChild(row);
        return;
    }
    
    // ORDENAR CONTAS POR DATA EM ORDEM CRESCENTE
    const sortedBills = [...filteredBills].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA - dateB;
    });
    
    console.log('Contas ordenadas por data:', sortedBills.map(bill => ({ company: bill.company, date: bill.date })));
    
    sortedBills.forEach((bill, index) => {
        console.log('Renderizando conta:', bill.company, bill.value, 'ID:', bill.id, 'Data:', bill.date);
        
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>
                <div class="bill-company">${bill.company}</div>
                <div class="bill-number">${bill.number}</div>
            </td>
            <td>
                <span class="bill-parcels">${bill.parcels}</span>
            </td>
            <td class="bill-date">${bill.date}</td>
            <td>
                <div class="bill-value">${formatCurrency(bill.value)}</div>
            </td>
            <td>
                <div class="bill-actions">
                    <button class="btn btn-edit" onclick="editBill(${bill.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-delete" onclick="deleteBill(${bill.id})">
                        <i class="fas fa-trash"></i> Excluir
                    </button>
                </div>
            </td>
        `;
        
        tbody.appendChild(row);
    });
    
    console.log('=== RENDERIZAÇÃO CONCLUÍDA ===');
}

// Função para atualizar resumo
function updateSummary() {
    console.log('=== ATUALIZANDO RESUMO ===');
    
    const totalBills = filteredBills.reduce((sum, bill) => sum + bill.value, 0);
    
    // Calcular dias úteis baseado no período de filtro atual
    const filterPeriod = getCurrentFilterPeriod();
    const workingDays = calculateWorkingDays(filterPeriod.start, filterPeriod.end);
    const dailyAmount = workingDays > 0 ? totalBills / workingDays : 0;
    
    console.log('Período de filtro:', filterPeriod);
    console.log('Dias úteis calculados:', workingDays);
    console.log('Total contas:', totalBills);
    console.log('Valor por dia:', dailyAmount);
    
    const totalBillsEl = document.getElementById('totalBills');
    const totalGeneralEl = document.getElementById('totalGeneral');
    const dailyAmountEl = document.getElementById('dailyAmount');
    const workingDaysEl = document.getElementById('workingDays');
    const filteredCountEl = document.getElementById('filteredCount');
    
    if (totalBillsEl) {
        totalBillsEl.textContent = formatCurrency(totalBills);
        console.log('Total contas atualizado:', formatCurrency(totalBills));
    } else {
        console.error('Elemento totalBills não encontrado!');
    }
    
    if (totalGeneralEl) {
        totalGeneralEl.textContent = formatCurrency(totalBills);
        console.log('Total geral atualizado:', formatCurrency(totalBills));
    } else {
        console.error('Elemento totalGeneral não encontrado!');
    }
    
    if (dailyAmountEl) {
        dailyAmountEl.textContent = formatCurrency(dailyAmount);
        console.log('Valor por dia atualizado:', formatCurrency(dailyAmount));
    } else {
        console.error('Elemento dailyAmount não encontrado!');
    }
    
    if (workingDaysEl) {
        workingDaysEl.textContent = workingDays.toString();
        console.log('Dias úteis atualizado:', workingDays);
    } else {
        console.error('Elemento workingDays não encontrado!');
    }
    
    if (filteredCountEl) {
        filteredCountEl.textContent = `${filteredBills.length} contas`;
        console.log('Contador de contas atualizado:', filteredBills.length);
    } else {
        console.error('Elemento filteredCount não encontrado!');
    }
    
    console.log('=== RESUMO ATUALIZADO ===');
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
        console.log('Contas filtradas detalhes:', filteredBills.map(b => ({ company: b.company, date: b.date })));
    } else {
        filteredBills = [...bills];
        console.log('Filtro limpo, mostrando todas as contas');
    }
    
    // FORÇAR RENDERIZAÇÃO EM MOBILE
    setTimeout(() => {
        renderBills();
        updateSummary();
    }, 100);
    
    console.log('=== FILTRO APLICADO ===');
}

// Função para limpar filtro
function clearFilter() {
    console.log('=== LIMPANDO FILTRO ===');
    
    document.getElementById('startDate').value = '2025-09-17';
    document.getElementById('endDate').value = '2025-09-30';
    filteredBills = [...bills];
    
    setTimeout(() => {
        renderBills();
        updateSummary();
    }, 100);
    
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
        document.getElementById('modalMessage').textContent = `Deseja importar as contas do arquivo "${file.name}"?`;
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
                if (line.trim() && index > 0) {
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
                saveBillsToStorage();
                renderBills();
                updateSummary();
                alert(`Importadas ${newBills.length} contas com sucesso!`);
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
    
    const template = `EMPRESA - NF NUMERO\tPARCELA\tDATA\tVALOR
ARTECOLA - NF 651630\t1/3\t16/09/2025\tR$ 1.498,72
EXEMPLO - NF 123456\t2/3\t17/09/2025\tR$ 2.500,00
TESTE - NF 789012\t3/3\t18/09/2025\tR$ 1.200,50`;
    
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
        if (newCompany === null) return;
        
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
            
            saveBillsToStorage();
            
            // Reaplicar filtro se ativo
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
        
        // Reaplicar filtro se ativo
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
        
        if (bills.length < originalLength) {
            saveBillsToStorage();
            
            renderBills();
            updateSummary();
            console.log('Conta excluída com sucesso');
            alert('Conta excluída com sucesso!');
        } else {
            console.log('Conta não encontrada para exclusão');
        }
    }
}

// Funções para adicionar nova conta
function openAddModal() {
    console.log('=== ABRINDO MODAL DE ADICIONAR CONTA ===');
    
    document.getElementById('addBillForm').reset();
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('addDate').value = todayStr;
    
    document.getElementById('addModal').style.display = 'block';
    
    console.log('Modal de adicionar conta aberto');
}

function closeAddModal() {
    console.log('=== FECHANDO MODAL DE ADICIONAR CONTA ===');
    
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addBillForm').reset();
    
    console.log('Modal de adicionar conta fechado');
}

function addNewBill(event) {
    event.preventDefault();
    console.log('=== ADICIONANDO NOVA CONTA ===');
    
    const company = document.getElementById('addCompany').value.trim();
    const number = document.getElementById('addNumber').value.trim();
    const parcels = document.getElementById('addParcels').value.trim();
    const date = document.getElementById('addDate').value;
    const value = parseFloat(document.getElementById('addValue').value);
    
    console.log('Dados do formulário:', { company, number, parcels, date, value });
    
    if (!company) {
        alert('Por favor, informe a empresa!');
        document.getElementById('addCompany').focus();
        return;
    }
    
    if (!parcels) {
        alert('Por favor, informe as parcelas!');
        document.getElementById('addParcels').focus();
        return;
    }
    
    if (!date) {
        alert('Por favor, informe a data de vencimento!');
        document.getElementById('addDate').focus();
        return;
    }
    
    if (!value || isNaN(value) || value <= 0) {
        alert('Por favor, informe um valor válido!');
        document.getElementById('addValue').focus();
        return;
    }
    
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    
    const newId = Math.max(...bills.map(b => b.id), 0) + 1;
    
    const newBill = {
        id: newId,
        company: company,
        number: number,
        parcels: parcels,
        date: formattedDate,
        value: value
    };
    
    console.log('Nova conta criada:', newBill);
    console.log('Array bills antes da adição:', bills.length, 'contas');
    
    bills.push(newBill);
    console.log('Array bills após adição:', bills.length, 'contas');
    
    // Reaplicar filtro se ativo
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    
    if (startDate && endDate) {
        console.log('Aplicando filtro após adicionar nova conta');
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        filteredBills = bills.filter(bill => {
            const billDate = new Date(bill.date.split('/').reverse().join('-'));
            return billDate >= start && billDate <= end;
        });
    } else {
        console.log('Sem filtro ativo, mostrando todas as contas');
        filteredBills = [...bills];
    }
    
    console.log('Contas filtradas após adição:', filteredBills.length, 'contas');
    
    saveBillsToStorage();
    
    console.log('Chamando renderBills()...');
    renderBills();
    
    console.log('Chamando updateSummary()...');
    updateSummary();
    
    closeAddModal();
    
    alert(`Conta "${company}" adicionada com sucesso!`);
    
    console.log('=== NOVA CONTA ADICIONADA COM SUCESSO ===');
}

// SISTEMA DE ABAS
function switchTab(tabName) {
    console.log('=== TROCANDO ABA ===', tabName);
    
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    if (tabName === 'main') {
        document.getElementById('mainTab').classList.add('active');
        document.getElementById('mainTabContent').classList.add('active');
    } else if (tabName === 'admin') {
        if (isAdminLoggedIn) {
            document.getElementById('adminTab').classList.add('active');
            document.getElementById('adminTabContent').classList.add('active');
            updateAdminStats();
        } else {
            openAdminLogin();
        }
    }
    
    console.log('=== ABA TROCADA ===');
}

// SISTEMA DE LOGIN ADMINISTRATIVO
function openAdminLogin() {
    console.log('=== ABRINDO LOGIN ADMINISTRATIVO ===');
    
    document.getElementById('adminLoginModal').style.display = 'block';
    document.getElementById('adminUsername').focus();
    
    document.getElementById('adminUsername').value = '';
    document.getElementById('adminPassword').value = '';
    document.getElementById('loginError').style.display = 'none';
    
    console.log('Modal de login administrativo aberto');
}

function closeAdminLogin() {
    console.log('=== FECHANDO LOGIN ADMINISTRATIVO ===');
    
    document.getElementById('adminLoginModal').style.display = 'none';
    document.getElementById('adminLoginForm').reset();
    document.getElementById('loginError').style.display = 'none';
    
    console.log('Modal de login administrativo fechado');
}

function loginAdmin(event) {
    event.preventDefault();
    console.log('=== TENTATIVA DE LOGIN ADMINISTRATIVO ===');
    
    const username = document.getElementById('adminUsername').value.trim();
    const password = document.getElementById('adminPassword').value.trim();
    
    console.log('Credenciais fornecidas:', { username, password: '***' });
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        console.log('✅ Login administrativo bem-sucedido');
        
        isAdminLoggedIn = true;
        localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
        
        closeAdminLogin();
        switchTab('admin');
        
        alert('Login realizado com sucesso! Bem-vindo ao painel administrativo.');
    } else {
        console.log('❌ Login administrativo falhou');
        
        document.getElementById('loginError').style.display = 'block';
        document.getElementById('adminPassword').value = '';
        document.getElementById('adminPassword').focus();
        
        setTimeout(() => {
            document.getElementById('loginError').style.display = 'none';
        }, 3000);
    }
}

function logoutAdmin() {
    console.log('=== LOGOUT ADMINISTRATIVO ===');
    
    isAdminLoggedIn = false;
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    
    switchTab('main');
    
    alert('Logout realizado com sucesso!');
    
    console.log('Logout administrativo concluído');
}

// FUNÇÕES ADMINISTRATIVAS
function updateAdminStats() {
    console.log('=== ATUALIZANDO ESTATÍSTICAS ADMINISTRATIVAS ===');
    
    const totalBillsEl = document.getElementById('adminTotalBills');
    const lastUpdateEl = document.getElementById('adminLastUpdate');
    const dataSizeEl = document.getElementById('adminDataSize');
    
    if (totalBillsEl) {
        totalBillsEl.textContent = bills.length;
    }
    
    if (lastUpdateEl) {
        const lastModified = localStorage.getItem(STORAGE_KEYS.LAST_MODIFIED);
        if (lastModified) {
            const date = new Date(lastModified);
            lastUpdateEl.textContent = date.toLocaleString('pt-BR');
        } else {
            lastUpdateEl.textContent = 'Nunca';
        }
    }
    
    if (dataSizeEl) {
        const dataSize = JSON.stringify(bills).length;
        dataSizeEl.textContent = `${(dataSize / 1024).toFixed(2)} KB`;
    }
    
    console.log('Estatísticas administrativas atualizadas');
}

function exportData() {
    console.log('=== EXPORTANDO DADOS ===');
    
    const data = {
        bills: bills,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contas_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Dados exportados com sucesso!');
    console.log('Dados exportados com sucesso');
}

function resetAllData() {
    console.log('=== RESETANDO TODOS OS DADOS ===');
    
    if (confirm('ATENÇÃO: Esta ação irá resetar TODOS os dados do sistema para o estado inicial. Esta ação NÃO pode ser desfeita!\n\nTem certeza que deseja continuar?')) {
        if (confirm('ÚLTIMA CONFIRMAÇÃO: Todos os dados serão perdidos permanentemente!\n\nClique OK para confirmar o reset.')) {
            bills = [...defaultBills];
            filteredBills = [...bills];
            
            localStorage.removeItem(STORAGE_KEYS.BILLS);
            localStorage.removeItem(STORAGE_KEYS.LAST_MODIFIED);
            
            saveBillsToStorage();
            
            renderBills();
            updateSummary();
            updateAdminStats();
            
            alert('Sistema resetado com sucesso! Todos os dados foram restaurados ao estado inicial.');
            console.log('Sistema resetado com sucesso');
        }
    }
}

// Função para forçar inicialização em mobile
function forceMobileInit() {
    console.log('=== FORÇANDO INICIALIZAÇÃO MOBILE ===');
    
    const elements = [
        'totalBills', 'totalGeneral', 'dailyAmount',
        'workingDays', 'filteredCount', 'billsTableBody'
    ];
    
    elements.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            console.log(`✅ Elemento ${id} encontrado`);
        } else {
            console.error(`❌ Elemento ${id} NÃO encontrado!`);
        }
    });
    
    if (bills.length > 0) {
        renderBills();
        updateSummary();
        console.log('✅ Renderização forçada concluída');
    } else {
        console.log('⚠️ Nenhuma conta para renderizar');
    }
}

// REGISTRAR SERVICE WORKER PARA PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('✅ Service Worker registrado com sucesso:', registration.scope);
            })
            .catch(function(error) {
                console.log('❌ Falha ao registrar Service Worker:', error);
            });
    });
}

// Inicializar aplicação quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== INICIANDO APLICAÇÃO ===');
    console.log('DOM carregado, inicializando aplicação...');
    
    const adminLoggedIn = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    if (adminLoggedIn === 'true') {
        isAdminLoggedIn = true;
        console.log('Admin já estava logado');
    }
    
    initializeBills();
    
    filteredBills = [...bills];
    console.log('Contas filtradas inicializadas:', filteredBills.length);
    
    console.log('Chamando renderBills()...');
    renderBills();
    
    console.log('Chamando updateSummary()...');
    updateSummary();
    
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate) {
        startDate.addEventListener('change', applyFilter);
    }
    if (endDate) {
        endDate.addEventListener('change', applyFilter);
    }
    
    const addBillForm = document.getElementById('addBillForm');
    if (addBillForm) {
        addBillForm.addEventListener('submit', addNewBill);
        console.log('Event listener do formulário de adicionar conta configurado');
    }
    
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', loginAdmin);
        console.log('Event listener do formulário de login administrativo configurado');
    }
    
    console.log('=== APLICAÇÃO INICIALIZADA COM SUCESSO ===');
});

// Múltiplos fallbacks para garantir funcionamento em mobile
setTimeout(function() {
    console.log('=== FALLBACK 1: FORÇANDO RENDERIZAÇÃO ===');
    forceMobileInit();
}, 500);

setTimeout(function() {
    console.log('=== FALLBACK 2: FORÇANDO RENDERIZAÇÃO ===');
    forceMobileInit();
}, 1000);

setTimeout(function() {
    console.log('=== FALLBACK 3: FORÇANDO RENDERIZAÇÃO ===');
    forceMobileInit();
}, 2000);

// Debug: Verificar se as funções estão disponíveis globalmente
window.applyFilter = applyFilter;
window.clearFilter = clearFilter;
window.importBills = importBills;
window.confirmImport = confirmImport;
window.downloadTemplate = downloadTemplate;
window.closeModal = closeModal;
window.editBill = editBill;
window.deleteBill = deleteBill;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.addNewBill = addNewBill;
window.switchTab = switchTab;
window.openAdminLogin = openAdminLogin;
window.closeAdminLogin = closeAdminLogin;
window.loginAdmin = loginAdmin;
window.logoutAdmin = logoutAdmin;
window.exportData = exportData;
window.resetAllData = resetAllData;
window.forceMobileInit = forceMobileInit;

console.log('=== FUNÇÕES GLOBAIS DEFINIDAS ===');
console.log('applyFilter disponível:', typeof window.applyFilter);
console.log('clearFilter disponível:', typeof window.clearFilter);
console.log('openAddModal disponível:', typeof window.openAddModal);
console.log('closeAddModal disponível:', typeof window.closeAddModal);
console.log('addNewBill disponível:', typeof window.addNewBill);
console.log('switchTab disponível:', typeof window.switchTab);
console.log('openAdminLogin disponível:', typeof window.openAdminLogin);
console.log('loginAdmin disponível:', typeof window.loginAdmin);
console.log('exportData disponível:', typeof window.exportData);
console.log('resetAllData disponível:', typeof window.resetAllData);
console.log('forceMobileInit disponível:', typeof window.forceMobileInit);
