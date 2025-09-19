console.log('🚀 Script carregado');

// Função para editar conta
function editBill(id) {
    console.log('🔍 EDITANDO CONTA - ID:', id);
    console.log('🔍 Modal editModal existe?', document.getElementById('editModal'));
    
    const bill = { id: id, company: 'TESTE', value: 1000.00 };
    
    // Preencher o modal de edição com os dados atuais
    document.getElementById('editId').value = bill.id;
    document.getElementById('editCompany').value = bill.company;
    document.getElementById('editValue').value = '1.000,00';
    
    // Abrir modal de edição
    document.getElementById('editModal').style.display = 'block';
    
    console.log('✅ Modal de edição aberto para conta:', bill);
}

// Função para fechar modal de edição
function closeEditModal() {
    console.log('=== FECHANDO MODAL DE EDITAR CONTA ===');
    
    const editModal = document.getElementById('editModal');
    if (editModal) {
        editModal.style.display = 'none';
    }
    
    console.log('✅ Modal de editar conta fechado');
}

// Função para salvar edição de conta
function saveEditBill(event) {
    event.preventDefault();
    console.log('=== SALVANDO EDIÇÃO DE CONTA ===');
    alert('Conta salva com sucesso!');
    closeEditModal();
}

// Tornar funções globais
window.editBill = editBill;
window.closeEditModal = closeEditModal;
window.saveEditBill = saveEditBill;

console.log('🔧 Funções globais configuradas');
