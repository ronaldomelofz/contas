// Constantes para localStorage
const STORAGE_KEYS = {
    BILLS: 'bills',
    ADMIN_LOGGED_IN: 'adminLoggedIn',
    LAST_MODIFIED: 'lastModified'
};

// Dados padrão das contas (atualizados com valores corretos)
const defaultBills = [
    { id: 1, company: 'FGTS', number: 'N/A', parcels: '1/1', date: '15/07/2024', value: 1399.43 },
    { id: 2, company: 'UNA', number: 'NF 184351', parcels: '1/3', date: '19/09/2025', value: 719.81 },
    { id: 3, company: 'FRETE', number: 'TRL', parcels: '2/3', date: '19/09/2025', value: 37085.94 },
    { id: 4, company: 'BARZEL', number: 'NF 375509', parcels: '22/42', date: '19/09/2025', value: 41345.46 },
    { id: 5, company: 'EMPRÉSTIMO ITAÚ', number: 'N/A', parcels: '3/5', date: '19/09/2025', value: 225.76 },
    { id: 6, company: 'FLORA', number: 'NF 131545', parcels: 'MENSAL', date: '20/09/2025', value: 425.41 },
    { id: 7, company: 'IBRAP', number: 'NF 664371', parcels: 'V/1', date: '20/09/2025', value: 89.43 },
    { id: 8, company: 'FRETE - METALFIXE', number: 'NF 23048 - TRL', parcels: 'V/1', date: '21/09/2025', value: 87.35 }
];

// Variáveis globais
let bills = [];
let filteredBills = [];

// Função para inicializar as contas
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

// Função para carregar contas do localStorage
function loadBillsFromStorage() {
    try {
        const savedBills = localStorage.getItem(STORAGE_KEYS.BILLS);
        if (savedBills) {
            bills = JSON.parse(savedBills);
            console.log('📥 Contas carregadas do localStorage:', bills.length);
        } else {
            console.log('📝 Nenhuma conta no localStorage, usando dados padrão');
            initializeBills();
        }
        filteredBills = [...bills];
    } catch (error) {
        console.error('❌ Erro ao carregar contas do localStorage:', error);
        initializeBills();
    }
}

// Função para salvar contas no localStorage
function saveBillsToStorage() {
    try {
        localStorage.setItem(STORAGE_KEYS.BILLS, JSON.stringify(bills));
        localStorage.setItem(STORAGE_KEYS.LAST_MODIFIED, new Date().toISOString());
        console.log('💾 Contas salvas no localStorage');
    } catch (error) {
        console.error('❌ Erro ao salvar contas no localStorage:', error);
    }
}

// Função para formatar moeda
function formatCurrency(value) {
    return 'R$ ' + value.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2});
}

// Função para aplicar máscara de valor (XX.XXX,XX)
function applyValueMask(input) {
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito

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
    const cleanValue = maskedValue.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
}

// Função para converter número para máscara
function formatValueToMask(value) {
    if (!value || value === 0) return '0,00';
    
    const str = value.toFixed(2).replace('.', ','); // Garante 2 casas decimais e substitui ponto por vírgula
    const parts = str.split(',');
    
    let integerPart = parts[0];
    const decimalPart = parts[1];
    
    // Adiciona pontos para milhares
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    return integerPart + ',' + decimalPart;
}

// Função para parsear data
function parseDate(dateStr) {
    const parts = dateStr.split('/');
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

// Função para renderizar contas
function renderBills() {
    const tbody = document.getElementById('billsTableBody');
    if (!tbody) {
        console.error('❌ Elemento billsTableBody não encontrado');
        return;
    }
    
    tbody.innerHTML = '';
    
    console.log('🔄 Renderizando contas. Total de contas filtradas:', filteredBills.length);
    
    if (filteredBills.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = '<td colspan="5" style="text-align: center; padding: 20px; color: #666;">📋 Nenhuma conta encontrada para o período selecionado</td>';
        tbody.appendChild(row);
        return;
    }
    
    // Ordenar contas por data
    const sortedBills = [...filteredBills].sort((a, b) => {
        const dateA = parseDate(a.date);
        const dateB = parseDate(b.date);
        return dateA - dateB;
    });
    
    console.log('📅 Contas ordenadas por data:', sortedBills.map(bill => ({ company: bill.company, date: bill.date, value: bill.value })));
    
    // Renderizar cada conta
    sortedBills.forEach((bill, index) => {
        console.log('🏢 Renderizando conta:', bill.company, formatCurrency(bill.value), 'ID:', bill.id, 'Data:', bill.date);
        
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
    
    console.log('✅ Renderização concluída:', sortedBills.length, 'contas exibidas');
}

// Função para editar conta - MODAL COMPLETO
function editBill(id) {
    console.log('🔍 EDITANDO CONTA - ID:', id);
    console.log('🔍 Modal editModal existe?', document.getElementById('editModal'));
    
    const bill = bills.find(b => b.id === id);
    if (!bill) {
        console.error('❌ Conta não encontrada com ID:', id);
        return;
    }
    
    console.log('📝 Dados da conta encontrada:', bill);
    
    // Verificar se o modal existe
    const editModal = document.getElementById('editModal');
    if (!editModal) {
        console.error('❌ Modal de edição não encontrado!');
        alert('Erro: Modal de edição não encontrado!');
        return;
    }
    
    // Preencher o modal de edição com os dados atuais
    const editId = document.getElementById('editId');
    const editCompany = document.getElementById('editCompany');
    const editNumber = document.getElementById('editNumber');
    const editParcels = document.getElementById('editParcels');
    const editDate = document.getElementById('editDate');
    const editValue = document.getElementById('editValue');
    
    if (editId) editId.value = bill.id;
    if (editCompany) editCompany.value = bill.company;
    if (editNumber) editNumber.value = bill.number;
    if (editParcels) editParcels.value = bill.parcels;
    
    // Converter data do formato DD/MM/AAAA para AAAA-MM-DD
    const dateParts = bill.date.split('/');
    const formattedDate = dateParts[2] + '-' + dateParts[1].padStart(2, '0') + '-' + dateParts[0].padStart(2, '0');
    if (editDate) editDate.value = formattedDate;
    
    // Aplicar máscara de valor
    if (editValue) editValue.value = formatValueToMask(bill.value);
    
    // Abrir modal de edição
    editModal.style.display = 'block';
    
    console.log('✅ Modal de edição aberto para conta:', bill);
}

// Função para fechar modal de edição
function closeEditModal() {
    console.log('=== FECHANDO MODAL DE EDITAR CONTA ===');
    
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
    
    const editBillForm = document.getElementById('editBillForm');
    if (editBillForm) {
        editBillForm.reset();
    }
    
    console.log('✅ Modal de editar conta fechado');
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
    
    console.log('📝 Dados do formulário de edição:', { id, company, number, parcels, date, value });
    
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
        
        console.log('✅ Conta editada com sucesso:', bill);
        alert('Conta editada com sucesso!');
    }
}

// Função para excluir conta
function deleteBill(id) {
    if (confirm('Tem certeza que deseja excluir esta conta?')) {
        bills = bills.filter(bill => bill.id !== id);
        filteredBills = filteredBills.filter(bill => bill.id !== id);
        saveBillsToStorage();
        renderBills();
        updateSummary();
    }
}

// Função para atualizar resumo
function updateSummary() {
    const totalBills = filteredBills.length;
    const totalValue = filteredBills.reduce((sum, bill) => sum + (bill.value || 0), 0);
    
    const totalBillsEl = document.getElementById('totalBills');
    const totalValueEl = document.getElementById('totalValue');
    
    if (totalBillsEl) totalBillsEl.textContent = totalBills;
    if (totalValueEl) totalValueEl.textContent = formatCurrency(totalValue);
}

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Aplicação inicializando...');
    
    // Carregar dados
    loadBillsFromStorage();
    
    // Renderizar interface
    renderBills();
    updateSummary();
    
    // Configurar máscara de valor para campo de editar
    const editValueField = document.getElementById('editValue');
    if (editValueField) {
        editValueField.addEventListener('input', function() {
            applyValueMask(this);
        });
        console.log('✅ Máscara de valor configurada para campo de editar');
    }
    
    // Configurar formulário de edição
    const editBillForm = document.getElementById('editBillForm');
    if (editBillForm) {
        editBillForm.addEventListener('submit', saveEditBill);
        console.log('✅ Event listener do formulário de editar conta configurado');
    }
    
    console.log('✅ Aplicação inicializada com sucesso!');
});

// Tornar funções globais
window.editBill = editBill;
window.closeEditModal = closeEditModal;
window.saveEditBill = saveEditBill;
window.deleteBill = deleteBill;

console.log('🔧 Funções globais configuradas');
