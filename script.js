// Dados das contas (inicialmente vazios)
let bills = [];
let filteredBills = [];

// Elementos DOM
const billsContainer = document.getElementById("billsContainer");
const totalValue = document.getElementById("totalValue");
const dailyValue = document.getElementById("dailyValue");
const daysValue = document.getElementById("daysValue");
const billModal = document.getElementById("billModal");
const modalTitle = document.getElementById("modalTitle");
const billForm = document.getElementById("billForm");
const addBillBtn = document.getElementById("addBillBtn");
const clearAllBtn = document.getElementById("clearAllBtn");
const closeModal = document.getElementById("closeModal");
const cancelBtn = document.getElementById("cancelBtn");

// Elementos do filtro
const startDateInput = document.getElementById("startDate");
const endDateInput = document.getElementById("endDate");
const applyFilterBtn = document.getElementById("applyFilter");
const clearFilterBtn = document.getElementById("clearFilter");
const filterInfo = document.getElementById("filterInfo");
const filterText = document.getElementById("filterText");

// Contas iniciais fornecidas pelo usuário - DATAS CORRETAS
const initialBills = [
    { name: "ARTECOLA", number: "NF 651630", parcels: "1/3", date: "2025-09-16", value: 1498.72 },
    { name: "MASUTTI", number: "NF 117654", parcels: "1/3", date: "2025-09-16", value: 2001.40 },
    { name: "RENZEX", number: "NF 56851", parcels: "2/3", date: "2025-09-16", value: 9860.05 },
    { name: "FLORA", number: "NF 130165", parcels: "3/3", date: "2025-09-17", value: 33825.36 },
    { name: "ROMETAL", number: "NF 160349", parcels: "1/3", date: "2025-09-18", value: 6279.72 },
    { name: "ROMETAL", number: "NF 251614", parcels: "1/3", date: "2025-09-18", value: 2848.22 },
    { name: "UNA", number: "NF 184351", parcels: "2/3", date: "2025-09-18", value: 2900.65 },
    { name: "BARZEL", number: "NF 375509", parcels: "1/3", date: "2025-09-19", value: 719.81 },
    { name: "EMPRÉSTIMO ITAÚ", number: "22/42", parcels: "", date: "2025-09-19", value: 41345.46 },
    { name: "FLORA", number: "NF 131545", parcels: "2/3", date: "2025-09-19", value: 37085.94 },
    { name: "IBRAP", number: "NF 664371", parcels: "3/5", date: "2025-09-19", value: 225.76 },
    { name: "FGTS", number: "MENSAL", parcels: "", date: "2025-09-20", value: 1200.00 },
    { name: "FRETE - METALFIXE", number: "NF 23848 - TRL", parcels: "1/1", date: "2025-09-20", value: 425.41 },
    { name: "INSS", number: "MENSAL", parcels: "", date: "2025-09-20", value: 7000.00 },
    { name: "TEGUS", number: "NF 26670", parcels: "1/3", date: "2025-09-20", value: 2588.34 },
    { name: "FLORA", number: "NF 133036", parcels: "1/3", date: "2025-09-22", value: 34583.62 },
    { name: "ARTECOLA", number: "NF 651630", parcels: "2/3", date: "2025-09-23", value: 1498.72 },
    { name: "STAM", number: "NF 392008", parcels: "1/4", date: "2025-09-23", value: 1398.28 },
    { name: "ALTERDATA", number: "MENSAL", parcels: "", date: "2025-09-26", value: 870.31 },
    { name: "HELA", number: "NF 117062", parcels: "4/4", date: "2025-09-26", value: 417.50 },
    { name: "METALNOX", number: "NF 1819", parcels: "2/3", date: "2025-09-27", value: 2965.70 },
    { name: "FLORA", number: "NF 132003", parcels: "2/3", date: "2025-09-28", value: 39822.23 },
    { name: "FLORA", number: "NF 132005", parcels: "2/3", date: "2025-09-28", value: 466.73 },
    { name: "METALNOX", number: "NF 1912", parcels: "1/3", date: "2025-09-28", value: 2839.76 },
    { name: "BARZEL", number: "NF 375509", parcels: "2/3", date: "2025-09-29", value: 622.66 },
    { name: "ARTECOLA", number: "NF 651630", parcels: "3/3", date: "2025-09-30", value: 1499.17 },
    { name: "CONTADOR", number: "MENSAL", parcels: "", date: "2025-09-30", value: 2904.00 },
    { name: "FOLHA PAGAMENTO", number: "MENSAL", parcels: "", date: "2025-09-30", value: 9000.00 },
    { name: "MASUTTI", number: "NF 117654", parcels: "2/3", date: "2025-09-30", value: 1821.98 },
    { name: "METALNOX", number: "NF 68272", parcels: "2/3", date: "2025-09-30", value: 1762.17 },
    { name: "PRO-LABORE ARIOSTO 09/2025", number: "MENSAL", parcels: "", date: "2025-09-30", value: 10000.00 },
    { name: "PRO-LABORE RONALDO 09/2025", number: "MENSAL", parcels: "", date: "2025-09-30", value: 10000.00 },
    { name: "TEGUS", number: "NF 26670", parcels: "2/3", date: "2025-09-30", value: 2588.34 }
];

// Inicialização
document.addEventListener("DOMContentLoaded", function() {
    console.log("Inicializando sistema...");
    loadBills();
    setupEventListeners();
    setupFilterDefaults();
    renderBills();
    updateSummary();
    console.log("Sistema inicializado com", bills.length, "contas");
});

// Carregar contas do localStorage ou usar as iniciais
function loadBills() {
    const savedBills = localStorage.getItem("bills");
    console.log("Dados salvos encontrados:", savedBills);
    
    if (savedBills && JSON.parse(savedBills).length > 0) {
        bills = JSON.parse(savedBills);
        console.log("Carregando contas do localStorage:", bills.length);
    } else {
        // Adicionar IDs únicos às contas iniciais
        bills = initialBills.map((bill, index) => ({
            ...bill,
            id: Date.now() + index
        }));
        console.log("Carregando contas iniciais:", bills.length);
        saveBills();
    }
    filteredBills = [...bills];
    console.log("Contas filtradas:", filteredBills.length);
}

// Salvar contas no localStorage
function saveBills() {
    localStorage.setItem("bills", JSON.stringify(bills));
    console.log("Contas salvas no localStorage");
}

// Configurar valores padrão do filtro - MOSTRAR TODAS AS CONTAS
function setupFilterDefaults() {
    // Definir período para mostrar TODAS as contas (16/09 a 30/09/2025)
    startDateInput.value = "2025-09-16";
    endDateInput.value = "2025-09-30";
    console.log("Filtro padrão configurado: 16/09/2025 a 30/09/2025");
}

// Configurar event listeners
function setupEventListeners() {
    addBillBtn.addEventListener("click", () => openModal());
    clearAllBtn.addEventListener("click", clearAllBills);
    closeModal.addEventListener("click", closeModalHandler);
    cancelBtn.addEventListener("click", closeModalHandler);
    billForm.addEventListener("submit", handleFormSubmit);
    
    // Event listeners do filtro
    applyFilterBtn.addEventListener("click", applyFilter);
    clearFilterBtn.addEventListener("click", clearFilter);
    
    // Fechar modal clicando fora dele
    billModal.addEventListener("click", (e) => {
        if (e.target === billModal) {
            closeModalHandler();
        }
    });
}

// Aplicar filtro por data
function applyFilter() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    console.log("Aplicando filtro:", startDate, "a", endDate);
    
    if (!startDate || !endDate) {
        // Se não há datas, mostrar todas as contas
        filteredBills = [...bills];
        console.log("Sem filtro - mostrando todas as contas:", filteredBills.length);
    } else {
        if (new Date(startDate) > new Date(endDate)) {
            alert("A data inicial não pode ser maior que a data final.");
            return;
        }
        
        filteredBills = bills.filter(bill => {
            const billDate = new Date(bill.date);
            const start = new Date(startDate);
            const end = new Date(endDate);
            
            return billDate >= start && billDate <= end;
        });
        console.log("Contas filtradas:", filteredBills.length);
    }
    
    // Mostrar informação do filtro
    if (startDate && endDate) {
        filterText.textContent = `Mostrando ${filteredBills.length} conta(s) de ${formatDate(startDate)} a ${formatDate(endDate)}`;
        filterInfo.style.display = "block";
    } else {
        filterText.textContent = `Mostrando todas as ${filteredBills.length} conta(s)`;
        filterInfo.style.display = "block";
    }
    
    renderBills();
    updateSummary();
}

// Limpar filtro
function clearFilter() {
    console.log("Limpando filtro");
    filteredBills = [...bills];
    startDateInput.value = "";
    endDateInput.value = "";
    filterInfo.style.display = "none";
    
    renderBills();
    updateSummary();
}

// Abrir modal para adicionar/editar conta
function openModal(bill = null) {
    modalTitle.textContent = bill ? "Editar Conta" : "Adicionar Conta";
    
    if (bill) {
        document.getElementById("billName").value = bill.name;
        document.getElementById("billNumber").value = bill.number;
        document.getElementById("billParcels").value = bill.parcels;
        document.getElementById("billDate").value = bill.date;
        document.getElementById("billValue").value = bill.value;
        billForm.dataset.editingId = bill.id;
    } else {
        billForm.reset();
        delete billForm.dataset.editingId;
    }
    
    billModal.classList.add("show");
    document.getElementById("billName").focus();
}

// Fechar modal
function closeModalHandler() {
    billModal.classList.remove("show");
    billForm.reset();
    delete billForm.dataset.editingId;
}

// Manipular envio do formulário
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(billForm);
    const billData = {
        name: document.getElementById("billName").value.trim(),
        number: document.getElementById("billNumber").value.trim(),
        parcels: document.getElementById("billParcels").value.trim(),
        date: document.getElementById("billDate").value,
        value: parseFloat(document.getElementById("billValue").value)
    };
    
    if (billForm.dataset.editingId) {
        // Editar conta existente
        const billId = parseInt(billForm.dataset.editingId);
        const billIndex = bills.findIndex(bill => bill.id === billId);
        if (billIndex !== -1) {
            bills[billIndex] = { ...billData, id: billId };
        }
    } else {
        // Adicionar nova conta
        const newBill = {
            ...billData,
            id: Date.now()
        };
        bills.push(newBill);
    }
    
    saveBills();
    loadBills(); // Recarregar para atualizar filteredBills
    renderBills();
    updateSummary();
    closeModalHandler();
}

// Renderizar contas
function renderBills() {
    console.log("Renderizando contas. Total filtradas:", filteredBills.length);
    
    if (filteredBills.length === 0) {
        billsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: #7f8c8d;">
                <i class="fas fa-receipt" style="font-size: 3rem; margin-bottom: 20px; opacity: 0.5;"></i>
                <h3>Nenhuma conta encontrada</h3>
                <p>${bills.length > 0 ? "Tente ajustar o filtro de datas" : "Clique em "Adicionar Conta" para começar"}</p>
            </div>
        `;
        return;
    }
    
    // Ordenar contas por data
    const sortedBills = [...filteredBills].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    billsContainer.innerHTML = sortedBills.map(bill => createBillCard(bill)).join("");
    console.log("Contas renderizadas:", sortedBills.length);
}

// Criar card de conta
function createBillCard(bill) {
    const today = new Date();
    const billDate = new Date(bill.date + "T00:00:00"); // Adicionar horário para evitar problemas de fuso
    const isOverdue = billDate < today;
    const isDueToday = billDate.toDateString() === today.toDateString();
    
    const cardClass = isOverdue ? "overdue" : isDueToday ? "due-today" : "";
    
    return `
        <div class="bill-card ${cardClass}" data-id="${bill.id}">
            <div class="bill-header">
                <div>
                    <div class="bill-name">${bill.name}</div>
                    <div class="bill-number">${bill.number}</div>
                </div>
                <div class="bill-value">R$ ${formatCurrency(bill.value)}</div>
            </div>
            
            <div class="bill-details">
                <div class="bill-detail">
                    <span class="label">Parcelas</span>
                    <span class="value">${bill.parcels || "-"}</span>
                </div>
                <div class="bill-detail">
                    <span class="label">Vencimento</span>
                    <span class="value">${formatDate(bill.date)}</span>
                </div>
                <div class="bill-detail">
                    <span class="label">Status</span>
                    <span class="value">${getStatusText(billDate, today)}</span>
                </div>
            </div>
            
            <div class="bill-actions">
                <button class="btn btn-edit" onclick="editBill(${bill.id})">
                    <i class="fas fa-edit"></i> Editar
                </button>
                <button class="btn btn-delete" onclick="deleteBill(${bill.id})">
                    <i class="fas fa-trash"></i> Excluir
                </button>
            </div>
        </div>
    `;
}

// Editar conta
function editBill(id) {
    const bill = bills.find(b => b.id === id);
    if (bill) {
        openModal(bill);
    }
}

// Excluir conta
function deleteBill(id) {
    if (confirm("Tem certeza que deseja excluir esta conta?")) {
        bills = bills.filter(bill => bill.id !== id);
        saveBills();
        loadBills(); // Recarregar para atualizar filteredBills
        renderBills();
        updateSummary();
    }
}

// Limpar todas as contas
function clearAllBills() {
    if (confirm("Tem certeza que deseja excluir TODAS as contas? Esta ação não pode ser desfeita.")) {
        bills = [];
        saveBills();
        loadBills(); // Recarregar para atualizar filteredBills
        renderBills();
        updateSummary();
    }
}

// Atualizar resumo
function updateSummary() {
    const total = filteredBills.reduce((sum, bill) => sum + bill.value, 0);
    const workingDays = calculateWorkingDays();
    const dailyAmount = workingDays > 0 ? total / workingDays : 0;
    
    console.log("Atualizando resumo. Total:", total, "Dias úteis:", workingDays);
    
    totalValue.textContent = `R$ ${formatCurrency(total)}`;
    dailyValue.textContent = `R$ ${formatCurrency(dailyAmount)}`;
    daysValue.textContent = workingDays;
}

// Calcular dias úteis do período 16/09 a 30/09/2025
function calculateWorkingDays() {
    // Período: 16/09/2025 a 30/09/2025
    // Dias úteis: segunda a sábado (1 a 6)
    
    let workingDays = 0;
    
    // Setembro 2025: 16, 17, 18, 19, 20, 22, 23, 24, 25, 26, 27, 29, 30
    // Total: 12 dias úteis (segunda a sábado)
    
    for (let day = 16; day <= 30; day++) {
        const date = new Date(2025, 8, day); // Mês 8 = setembro (0-indexado)
        const dayOfWeek = date.getDay();
        // Segunda (1) a Sábado (6) são dias úteis
        if (dayOfWeek >= 1 && dayOfWeek <= 6) {
            workingDays++;
        }
    }
    
    return workingDays;
}

// Obter texto do status
function getStatusText(billDate, today) {
    const diffTime = billDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
        return "Vencida";
    } else if (diffDays === 0) {
        return "Vence hoje";
    } else if (diffDays === 1) {
        return "Vence amanhã";
    } else if (diffDays <= 7) {
        return `Vence em ${diffDays} dias`;
    } else {
        return `Vence em ${diffDays} dias`;
    }
}

// Formatar moeda
function formatCurrency(value) {
    return new Intl.NumberFormat("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(value);
}

// Formatar data - CORRIGIDO DEFINITIVAMENTE
function formatDate(dateString) {
    // Converter string YYYY-MM-DD para formato DD/MM/YYYY
    const parts = dateString.split("-");
    const year = parts[0];
    const month = parts[1];
    const day = parts[2];
    return `${day}/${month}/${year}`;
}

// Formatar data para input
function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

// Funções globais para uso nos botões
window.editBill = editBill;
window.deleteBill = deleteBill;
