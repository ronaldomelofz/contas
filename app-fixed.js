// SISTEMA DE CONTAS - VERSÃO COMPLETA
console.log('🚀 Iniciando Sistema de Contas...');

// Dados das contas
let bills = [];
let filteredBills = [];

// Chaves do localStorage
const STORAGE_KEYS = {
    BILLS: 'contas_bills',
    LAST_MODIFIED: 'contas_last_modified',
    ADMIN_LOGGED_IN: 'contas_admin_logged_in'
};

// Dados padrão das contas
const defaultBills = [
    {
        id: 1,
        company: 'FGTS',
        number: 'NF 001',
        parcels: '1/1',
        date: '15/09/2025',
        value: 1399.43
    },
    {
        id: 2,
        company: 'INSS',
        number: 'NF 002',
        parcels: '1/1',
        date: '20/09/2025',
        value: 425.41
    },
    {
        id: 3,
        company: 'ENERGIA',
        number: 'NF 003',
        parcels: '1/1',
        date: '25/09/2025',
        value: 89.50
    }
];

// Função para salvar contas no localStorage
function saveBillsToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
        localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, new Date().toISOString());
        console.log('💾 Contas salvas no localStorage');
    } catch (error) {
        console.error('❌ Erro ao salvar no localStorage:', error);
    }
}

// Função para carregar contas do localStorage
function loadBillsFromStorage() {
    try {
        const stored = localStorage.getItem(STORAGE_KEYS.BILLS);
        if (stored) {
            bills = JSON.parse(stored);
            console.log('📂 Contas carregadas do localStorage:', bills.length);
            return true;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar do localStorage:', error);
    }
    return false;
}

// Função para inicializar contas
function initializeBills() {
    // Limpar localStorage para forçar uso dos dados atualizados
    localStorage.removeItem(STORAGE_KEYS.BILLS);
    localStorage.removeItem(STORAGE_KEYS.LAST_MODIFIED);
    
    // Sempre usar dados padrão atualizados para garantir valores corretos
    bills = [...defaultBills];
    saveBillsToStorage();
    console.log('🔄 Contas inicializadas com dados padrão atualizados');
    filteredBills = [...bills];
}

// Função para formatar moeda
function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Função para aplicar máscara de valor (XX.XXX,XX)
function applyValueMask(input) {
    let value = input.value.replace(/\\D/g, ''); // Remove tudo que não é dígito
    
    if (value.length === 0) {
        input.value = '';
        return;
    }
    
    // Converte para o formato XX.XXX,XX
    if (value.length <= 2) {
        input.value = value;
    } else if (value.length <= 5) {
        input.value = value.slice(0, -2) + ',' + value.slice(-2);
    } else {
        input.value = value.slice(0, -5) + '.' + value.slice(-5, -2) + ',' + value.slice(-2);
    }
}

// Função para converter valor da máscara para número
function parseValueFromMask(maskedValue) {
    if (!maskedValue) return 0;
    
    // Remove pontos e substitui vírgula por ponto
    const cleanValue = maskedValue.replace(/\\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
}

// Função para converter número para máscara
function formatValueToMask(value) {
    if (!value || value === 0) return '0,00';
    
    const str = value.toString().replace('.', ',');
    const parts = str.split(',');
    
    if (parts.length === 1) {
        parts.push('00');
    } else if (parts[1].length === 1) {
        parts[1] = parts[1] + '0';
    }
    
    const integerPart = parts[0];
    const decimalPart = parts[1];
    
    if (integerPart.length <= 2) {
        return integerPart + ',' + decimalPart;
    } else {
        return integerPart.slice(0, -3) + '.' + integerPart.slice(-3) + ',' + decimalPart;
    }
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

// Função para aplicar filtro
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
        console.log('Contas filtradas detalhes:', filteredBills.map(b => ({ company: b.company, date: b.date, value: b.value })));
    } else {
        filteredBills = [...bills];
        console.log('Filtro limpo, mostrando todas as contas');
    }
    
    // MÚLTIPLAS TENTATIVAS DE RENDERIZAÇÃO PARA MOBILE
    renderBills();
    updateSummary();
    
    // Forçar re-renderização com delays para dispositivos mais lentos
    setTimeout(() => {
        renderBills();
        updateSummary();
    }, 50);
    
    setTimeout(() => {
        renderBills();
        updateSummary();
    }, 200);
    
    console.log('=== FILTRO APLICADO ===');
}

// Função para renderizar contas
function renderBills() {
    console.log('=== RENDERIZANDO CONTAS ===');
    console.log('Total de contas:', bills.length);
    console.log('Contas filtradas:', filteredBills.length);
    
    const tbody = document.getElementById('billsTableBody');
    if (!tbody) {
        console.error('Elemento billsTableBody não encontrado!');
        return;
    }
    
    // Limpar conteúdo anterior
    tbody.innerHTML = '';
    
    if (filteredBills.length === 0) {
        console.log('Nenhuma conta para renderizar');
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center; padding: 20px; color: #6c757d;">Nenhuma conta encontrada no período selecionado</td>';
        tbody.appendChild(row);
        return;
    }
    
    // ORDENAR CONTAS POR DATA EM ORDEM CRESCENTE
    const sortedBills = [...filteredBills].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA - dateB;
    });
    
    console.log('Contas ordenadas por data:', sortedBills.map(bill => ({ company: bill.company, date: bill.date, value: bill.value })));
    
    // Renderizar cada conta
    sortedBills.forEach((bill, index) => {
        console.log(Renderizando conta :, bill.company, formatCurrency(bill.value), 'ID:', bill.id, 'Data:', bill.date);
        
        const row = document.createElement('tr');
        
        // Garantir que todos os campos sejam exibidos corretamente
        const companyName = bill.company || 'N/A';
        const billNumber = bill.number || '';
        const parcels = bill.parcels || 'N/A';
        const date = bill.date || 'N/A';
        const value = typeof bill.value === 'number' ? bill.value : 0;
        
        row.innerHTML = '<td><div class="bill-company" title="' + companyName + '">' + companyName + '</div>' + (billNumber ? '<div class="bill-number" title="' + billNumber + '">' + billNumber + '</div>' : '') + '</td><td><span class="bill-parcels" title="' + parcels + '">' + parcels + '</span></td><td class="bill-date" title="' + date + '">' + date + '</td><td><div class="bill-value" title="' + formatCurrency(value) + '">' + formatCurrency(value) + '</div></td><td><div class="bill-actions"><button class="btn btn-edit" onclick="editBill(' + bill.id + ')" title="Editar conta"><i class="fas fa-edit"></i><span class="btn-text"> Editar</span></button><button class="btn btn-delete" onclick="deleteBill(' + bill.id + ')" title="Excluir conta"><i class="fas fa-trash"></i><span class="btn-text"> Excluir</span></button></div></td>';
        
        tbody.appendChild(row);
    });
    
    console.log(=== RENDERIZAÇÃO CONCLUÍDA:  contas exibidas ===);
}

// Função para atualizar resumo
function updateSummary() {
    console.log('=== ATUALIZANDO RESUMO ===');
    
    const totalBills = filteredBills.length;
    const totalValue = filteredBills.reduce((sum, bill) => sum + (bill.value || 0), 0);
    
    console.log('Total de contas:', totalBills);
    console.log('Valor total:', totalValue);
    
    // Atualizar elementos do resumo
    const totalBillsElement = document.getElementById('totalBills');
    const totalValueElement = document.getElementById('totalValue');
    
    if (totalBillsElement) {
        totalBillsElement.textContent = totalBills;
    }
    
    if (totalValueElement) {
        totalValueElement.textContent = formatCurrency(totalValue);
    }
    
    console.log('=== RESUMO ATUALIZADO ===');
}

// Função para parsear data
function parseDate(dateStr) {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Função para editar conta
function editBill(id) {\n    console.log("🔍 EDITANDO CONTA - ID:", id);\n    console.log("🔍 Modal editModal existe?", document.getElementById("editModal"));
    console.log('=== EDITANDO CONTA ===', id);
    
    const bill = bills.find(b => b.id === id);
    if (bill) {
        // Preencher o modal de edição com os dados atuais
        document.getElementById('editId').value = bill.id;
        document.getElementById('editCompany').value = bill.company;
        document.getElementById('editNumber').value = bill.number;
        document.getElementById('editParcels').value = bill.parcels;
        
        // Converter data do formato DD/MM/AAAA para AAAA-MM-DD
        const dateParts = bill.date.split('/');
        const formattedDate = dateParts[2] + '-' + dateParts[1].padStart(2, '0') + '-' + dateParts[0].padStart(2, '0');
        document.getElementById('editDate').value = formattedDate;
        
        // Aplicar máscara de valor
        document.getElementById('editValue').value = formatValueToMask(bill.value);
        
        // Abrir modal de edição
        document.getElementById('editModal').style.display = 'block';
        
        console.log('Modal de edição aberto para conta:', bill);
    }
}

// Função para fechar modal de edição
function closeEditModal() {
    console.log('=== FECHANDO MODAL DE EDITAR CONTA ===');
    
    document.getElementById('editModal').style.display = 'none';
    document.getElementById('editBillForm').reset();
    
    console.log('Modal de editar conta fechado');
}

// Função para salvar edição de conta
function saveEditBill(event) {
    event.preventDefault();
    console.log('=== SALVANDO EDIÇÃO DE CONTA ===');
    
    const id = parseInt(document.getElementById('editId').value);
    const company = document.getElementById('editCompany').value.trim();
    const number = document.getElementById('editNumber').value.trim();
    const parcels = document.getElementById('editParcels').value.trim();
    const date = document.getElementById('editDate').value;
    const value = parseValueFromMask(document.getElementById('editValue').value);
    
    console.log('Dados do formulário de edição:', { id, company, number, parcels, date, value });
    
    if (!company) {
        alert('Por favor, informe a empresa!');
        document.getElementById('editCompany').focus();
        return;
    }
    
    if (!parcels) {
        alert('Por favor, informe as parcelas!');
        document.getElementById('editParcels').focus();
        return;
    }
    
    if (!date) {
        alert('Por favor, informe a data de vencimento!');
        document.getElementById('editDate').focus();
        return;
    }
    
    if (!value || isNaN(value) || value <= 0) {
        alert('Por favor, informe um valor válido!');
        document.getElementById('editValue').focus();
        return;
    }
    
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('pt-BR');
    
    const bill = bills.find(b => b.id === id);
    if (bill) {
        bill.company = company;
        bill.number = number;
        bill.parcels = parcels;
        bill.date = formattedDate;
        bill.value = value;
        
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
        
        closeEditModal();
        
        console.log('Conta editada com sucesso:', bill);
        alert('Conta editada com sucesso!');
    }
}

// Função para excluir conta
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

// Função para abrir modal de adicionar conta
function openAddModal() {
    console.log('=== ABRINDO MODAL DE ADICIONAR CONTA ===');
    
    document.getElementById('addBillForm').reset();
    
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    document.getElementById('addDate').value = todayStr;
    
    document.getElementById('addModal').style.display = 'block';
    
    console.log('Modal de adicionar conta aberto');
}

// Função para fechar modal de adicionar conta
function closeAddModal() {
    console.log('=== FECHANDO MODAL DE ADICIONAR CONTA ===');
    
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addBillForm').reset();
    
    console.log('Modal de adicionar conta fechado');
}

// Função para adicionar nova conta
function addNewBill(event) {
    event.preventDefault();
    console.log('=== ADICIONANDO NOVA CONTA ===');
    
    const company = document.getElementById('addCompany').value.trim();
    const number = document.getElementById('addNumber').value.trim();
    const parcels = document.getElementById('addParcels').value.trim();
    const date = document.getElementById('addDate').value;
    const value = parseValueFromMask(document.getElementById('addValue').value);
    
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
    
    alert(Conta "" adicionada com sucesso!);
    
    console.log('=== NOVA CONTA ADICIONADA COM SUCESSO ===');
}

// Função para fechar modal
function closeModal() {
    console.log('=== FECHANDO MODAL ===');
    
    document.getElementById('modal').style.display = 'none';
    
    console.log('Modal fechado');
}

// Função para login administrativo
function loginAdmin(event) {
    event.preventDefault();
    console.log('=== LOGIN ADMINISTRATIVO ===');
    
    const password = document.getElementById('adminPassword').value;
    
    if (password === 'admin123') {
        localStorage.setItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
        document.getElementById('adminLoginModal').style.display = 'none';
        alert('Login realizado com sucesso!');
        console.log('Login administrativo realizado com sucesso');
    } else {
        alert('Senha incorreta!');
        console.log('Tentativa de login com senha incorreta');
    }
}

// Função para logout administrativo
function logoutAdmin() {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
    alert('Logout realizado com sucesso!');
    console.log('Logout administrativo realizado');
}

// Função para abrir modal de login administrativo
function openAdminLogin() {
    console.log('=== ABRINDO MODAL DE LOGIN ADMINISTRATIVO ===');
    
    document.getElementById('adminLoginModal').style.display = 'block';
    
    console.log('Modal de login administrativo aberto');
}

// Função para fechar modal de login administrativo
function closeAdminLogin() {
    console.log('=== FECHANDO MODAL DE LOGIN ADMINISTRATIVO ===');
    
    document.getElementById('adminLoginModal').style.display = 'none';
    
    console.log('Modal de login administrativo fechado');
}

// Inicialização quando a página carrega
window.addEventListener('load', function() {
    console.log('=== INICIANDO APLICAÇÃO ===');
    
    // Verificar se é admin
    const isAdmin = localStorage.getItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
    console.log('Usuário é admin:', isAdmin);
    
    // Inicializar contas
    initializeBills();
    
    // Renderizar contas
    renderBills();
    updateSummary();
    
    console.log('=== APLICAÇÃO INICIALIZADA ===');
});

// Inicialização quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', function() {
    console.log('=== CONFIGURANDO EVENT LISTENERS ===');
    
    // Configurar filtros de data
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    
    if (startDate) {
        startDate.addEventListener('change', applyFilter);
    }
    if (endDate) {
        endDate.addEventListener('change', applyFilter);
    }
    
    // Configurar formulário de adicionar conta
    const addBillForm = document.getElementById('addBillForm');
    if (addBillForm) {
        addBillForm.addEventListener('submit', addNewBill);
        console.log('Event listener do formulário de adicionar conta configurado');
    }
    
    // Configurar máscara de valor para campo de adicionar
    const addValueField = document.getElementById('addValue');
    if (addValueField) {
        addValueField.addEventListener('input', function() {
            applyValueMask(this);
        });
        console.log('Máscara de valor configurada para campo de adicionar');
    }
    
    // Configurar máscara de valor para campo de editar
    const editValueField = document.getElementById('editValue');
    if (editValueField) {
        editValueField.addEventListener('input', function() {
            applyValueMask(this);
        });
        console.log('Máscara de valor configurada para campo de editar');
    }
    
    // Configurar formulário de edição
    const editBillForm = document.getElementById('editBillForm');
    if (editBillForm) {
        editBillForm.addEventListener('submit', saveEditBill);
        console.log('Event listener do formulário de editar conta configurado');
    }
    
    // Configurar formulário de login administrativo
    const adminLoginForm = document.getElementById('adminLoginForm');
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', loginAdmin);
        console.log('Event listener do formulário de login administrativo configurado');
    }
    
    console.log('=== APLICAÇÃO INICIALIZADA COM SUCESSO ===');
});

// Tornar funções globais
window.closeModal = closeModal;
window.editBill = editBill;
window.deleteBill = deleteBill;
window.openAddModal = openAddModal;
window.closeAddModal = closeAddModal;
window.closeEditModal = closeEditModal;
window.saveEditBill = saveEditBill;
window.openAdminLogin = openAdminLogin;
window.closeAdminLogin = closeAdminLogin;
window.logoutAdmin = logoutAdmin;

// Verificar se as funções estão disponíveis
console.log('openAddModal disponível:', typeof window.openAddModal);
console.log('closeAddModal disponível:', typeof window.closeAddModal);
console.log('editBill disponível:', typeof window.editBill);
console.log('closeEditModal disponível:', typeof window.closeEditModal);
console.log('saveEditBill disponível:', typeof window.saveEditBill);
console.log('applyValueMask disponível:', typeof window.applyValueMask);
console.log('parseValueFromMask disponível:', typeof window.parseValueFromMask);
console.log('formatValueToMask disponível:', typeof window.formatValueToMask);
