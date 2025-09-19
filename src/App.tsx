import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, Calendar, DollarSign, FileText, Building2, Filter, Download, Upload, Shield, LogOut } from 'lucide-react';
import './App.css';

interface Bill {
  id: number;
  company: string;
  number: string;
  parcels: string;
  date: string;
  value: number;
}

const defaultBills: Bill[] = [
  { id: 1, company: 'FGTS', number: 'N/A', parcels: '1/1', date: '15/07/2024', value: 1399.43 },
  { id: 2, company: 'UNA', number: 'NF 184351', parcels: '1/3', date: '19/09/2025', value: 719.81 },
  { id: 3, company: 'FRETE', number: 'TRL', parcels: '2/3', date: '19/09/2025', value: 37085.94 },
  { id: 4, company: 'BARZEL', number: 'NF 375509', parcels: '22/42', date: '19/09/2025', value: 41345.46 },
  { id: 5, company: 'EMPRÉSTIMO ITAÚ', number: 'N/A', parcels: '3/5', date: '19/09/2025', value: 225.76 },
  { id: 6, company: 'FLORA', number: 'NF 131545', parcels: 'MENSAL', date: '20/09/2025', value: 425.41 },
  { id: 7, company: 'IBRAP', number: 'NF 664371', parcels: 'V/1', date: '20/09/2025', value: 89.43 },
  { id: 8, company: 'FRETE - METALFIXE', number: 'NF 23048 - TRL', parcels: 'V/1', date: '21/09/2025', value: 87.35 }
];

function App() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [filteredBills, setFilteredBills] = useState<Bill[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [editingBill, setEditingBill] = useState<Bill | null>(null);
  const [formData, setFormData] = useState({
    company: '',
    number: '',
    parcels: '',
    date: '',
    value: ''
  });
  const [filterData, setFilterData] = useState({
    startDate: '',
    endDate: ''
  });
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  // Carregar dados iniciais
  useEffect(() => {
    const savedBills = localStorage.getItem('bills');
    const adminStatus = localStorage.getItem('adminLoggedIn');
    
    if (savedBills) {
      const parsedBills = JSON.parse(savedBills);
      setBills(parsedBills);
      setFilteredBills(parsedBills);
    } else {
      setBills(defaultBills);
      setFilteredBills(defaultBills);
      localStorage.setItem('bills', JSON.stringify(defaultBills));
    }
    
    if (adminStatus === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  // Aplicar máscara de valor (XX.XXX,XX)
  const applyValueMask = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 0) return '';
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 5) return numbers.slice(0, -2) + ',' + numbers.slice(-2);
    return numbers.slice(0, -5) + '.' + numbers.slice(-5, -2) + ',' + numbers.slice(-2);
  };

  // Converter valor da máscara para número
  const parseValueFromMask = (maskedValue: string) => {
    if (!maskedValue) return 0;
    const cleanValue = maskedValue.replace(/\./g, '').replace(',', '.');
    return parseFloat(cleanValue) || 0;
  };

  // Converter número para máscara
  const formatValueToMask = (value: number) => {
    if (!value || value === 0) return '0,00';
    const str = value.toFixed(2).replace('.', ',');
    const parts = str.split(',');
    let integerPart = parts[0];
    const decimalPart = parts[1];
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return integerPart + ',' + decimalPart;
  };

  // Formatar moeda
  const formatCurrency = (value: number) => {
    return 'R$ ' + value.toLocaleString('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    });
  };

  // Aplicar filtro por data
  const applyDateFilter = () => {
    if (!filterData.startDate || !filterData.endDate) {
      setFilteredBills(bills);
      setShowFilterModal(false);
      return;
    }

    const startDate = new Date(filterData.startDate);
    const endDate = new Date(filterData.endDate);

    const filtered = bills.filter(bill => {
      const [day, month, year] = bill.date.split('/').map(Number);
      const billDate = new Date(year, month - 1, day);
      return billDate >= startDate && billDate <= endDate;
    });

    setFilteredBills(filtered);
    setShowFilterModal(false);
  };

  // Limpar filtro
  const clearFilter = () => {
    setFilterData({ startDate: '', endDate: '' });
    setFilteredBills(bills);
    setShowFilterModal(false);
  };

  // Login de administrador
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === '1214') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setShowLoginModal(false);
      setLoginData({ username: '', password: '' });
      alert('Login de administrador realizado com sucesso!');
    } else {
      alert('Usuário ou senha incorretos!');
    }
  };

  // Logout de administrador
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    alert('Logout realizado com sucesso!');
  };

  // Importar contas do arquivo contas.txt
  const importBillsFromFile = async () => {
    try {
      const response = await fetch('/contas.txt');
      const text = await response.text();
      
      const lines = text.split('\n').filter(line => line.trim() && !line.includes('EMPRESA'));
      const importedBills: Bill[] = [];
      
      lines.forEach((line, index) => {
        if (line.trim()) {
          // Parse do formato: EMPRESA - NF NUMEROPARCELADATAVALOR
          const match = line.match(/^(.+?)\s*-\s*NF\s*(\S+)\s*(\d+\/\d+)\s*(\d{2}\/\d{2}\/\d{4})R\$\s*([\d.,]+)$/);
          
          if (match) {
            const [, company, number, parcels, date, valueStr] = match;
            const value = parseFloat(valueStr.replace(/\./g, '').replace(',', '.'));
            
            if (!isNaN(value)) {
              importedBills.push({
                id: Math.max(...bills.map(b => b.id)) + index + 1,
                company: company.trim(),
                number: NF ,
                parcels: parcels,
                date: date,
                value: value
              });
            }
          }
        }
      });

      if (importedBills.length > 0) {
        const updatedBills = [...bills, ...importedBills];
        setBills(updatedBills);
        setFilteredBills(updatedBills);
        localStorage.setItem('bills', JSON.stringify(updatedBills));
        alert(`${importedBills.length} contas importadas com sucesso!`);
      } else {
        alert('Nenhuma conta válida encontrada no arquivo!');
      }
    } catch (error) {
      console.error('Erro ao importar contas:', error);
      alert('Erro ao importar contas. Verifique se o arquivo contas.txt existe.');
    }
  };

  // Abrir modal de adicionar
  const openAddModal = () => {
    setFormData({ company: '', number: '', parcels: '', date: '', value: '' });
    setShowAddModal(true);
  };

  // Fechar modal de adicionar
  const closeAddModal = () => {
    setShowAddModal(false);
    setFormData({ company: '', number: '', parcels: '', date: '', value: '' });
  };

  // Abrir modal de edição
  const openEditModal = (bill: Bill) => {
    setEditingBill(bill);
    setFormData({
      company: bill.company,
      number: bill.number,
      parcels: bill.parcels,
      date: bill.date.split('/').reverse().join('-'),
      value: formatValueToMask(bill.value)
    });
    setShowEditModal(true);
  };

  // Fechar modal de edição
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingBill(null);
    setFormData({ company: '', number: '', parcels: '', date: '', value: '' });
  };

  // Salvar nova conta
  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.parcels || !formData.date || !formData.value) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    const newBill: Bill = {
      id: Math.max(...bills.map(b => b.id)) + 1,
      company: formData.company,
      number: formData.number,
      parcels: formData.parcels,
      date: new Date(formData.date).toLocaleDateString('pt-BR'),
      value: parseValueFromMask(formData.value)
    };

    const updatedBills = [...bills, newBill];
    setBills(updatedBills);
    setFilteredBills(updatedBills);
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    closeAddModal();
    alert('Conta adicionada com sucesso!');
  };

  // Salvar edição de conta
  const handleEditBill = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.parcels || !formData.date || !formData.value) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }

    if (!editingBill) return;

    const updatedBills = bills.map(bill => 
      bill.id === editingBill.id 
        ? {
            ...bill,
            company: formData.company,
            number: formData.number,
            parcels: formData.parcels,
            date: new Date(formData.date).toLocaleDateString('pt-BR'),
            value: parseValueFromMask(formData.value)
          }
        : bill
    );

    setBills(updatedBills);
    setFilteredBills(updatedBills);
    localStorage.setItem('bills', JSON.stringify(updatedBills));
    closeEditModal();
    alert('Conta editada com sucesso!');
  };

  // Excluir conta
  const handleDeleteBill = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta conta?')) {
      const updatedBills = bills.filter(bill => bill.id !== id);
      setBills(updatedBills);
      setFilteredBills(updatedBills);
      localStorage.setItem('bills', JSON.stringify(updatedBills));
      alert('Conta excluída com sucesso!');
    }
  };

  // Calcular totais
  const totalBills = filteredBills.length;
  const totalValue = filteredBills.reduce((sum, bill) => sum + bill.value, 0);

  return (
    <div className="app">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <h1>
            <DollarSign className="header-icon" />
            Sistema de Contas
          </h1>
          <div className="header-actions">
            <button 
              onClick={() => setShowFilterModal(true)} 
              className="btn-filter"
              title="Filtrar por data"
            >
              <Filter />
              <span className="btn-text">Filtrar</span>
            </button>
            {isAdminLoggedIn ? (
              <div className="admin-actions">
                <button 
                  onClick={() => setShowAdminModal(true)} 
                  className="btn-admin"
                  title="Painel Administrativo"
                >
                  <Shield />
                  <span className="btn-text">Admin</span>
                </button>
                <button 
                  onClick={handleAdminLogout} 
                  className="btn-logout"
                  title="Sair"
                >
                  <LogOut />
                  <span className="btn-text">Sair</span>
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowLoginModal(true)} 
                className="btn-login"
                title="Login Administrador"
              >
                <Shield />
                <span className="btn-text">Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Resumo */}
      <div className="summary">
        <div className="summary-card">
          <div className="summary-icon">
            <FileText />
          </div>
          <div className="summary-content">
            <h3>Total de Contas</h3>
            <p>{totalBills}</p>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">
            <DollarSign />
          </div>
          <div className="summary-content">
            <h3>Valor Total</h3>
            <p>{formatCurrency(totalValue)}</p>
          </div>
        </div>
      </div>

      {/* Botão Adicionar */}
      <div className="add-button-container">
        <button onClick={openAddModal} className="btn-add">
          <Plus />
          Adicionar Nova Conta
        </button>
      </div>

      {/* Tabela de Contas */}
      <div className="table-container">
        <table className="bills-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Parcelas</th>
              <th>Data</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.length === 0 ? (
              <tr>
                <td colSpan={5} className="no-bills">
                  Nenhuma conta encontrada.
                </td>
              </tr>
            ) : (
              filteredBills
                .sort((a, b) => {
                  const [dayA, monthA, yearA] = a.date.split('/').map(Number);
                  const [dayB, monthB, yearB] = b.date.split('/').map(Number);
                  const dateA = new Date(yearA, monthA - 1, dayA);
                  const dateB = new Date(yearB, monthB - 1, dayB);
                  return dateA.getTime() - dateB.getTime();
                })
                .map((bill) => (
                  <tr key={bill.id}>
                    <td>
                      <div className="bill-company" title={bill.company}>
                        {bill.company}
                      </div>
                      {bill.number && bill.number !== 'N/A' && (
                        <div className="bill-number" title={bill.number}>
                          {bill.number}
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="bill-parcels" title={bill.parcels}>
                        {bill.parcels}
                      </span>
                    </td>
                    <td className="bill-date" title={bill.date}>
                      {bill.date}
                    </td>
                    <td>
                      <div className="bill-value" title={formatCurrency(bill.value)}>
                        {formatCurrency(bill.value)}
                      </div>
                    </td>
                    <td>
                      <div className="bill-actions">
                        <button
                          onClick={() => openEditModal(bill)}
                          className="btn btn-edit"
                          title="Editar conta"
                        >
                          <Edit />
                          <span className="btn-text">Editar</span>
                        </button>
                        <button
                          onClick={() => handleDeleteBill(bill.id)}
                          className="btn btn-delete"
                          title="Excluir conta"
                        >
                          <Trash2 />
                          <span className="btn-text">Excluir</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Filtro por Data */}
      {showFilterModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                <Filter />
                Filtrar por Data
              </h2>
              <button onClick={() => setShowFilterModal(false)} className="close-btn">
                <X />
              </button>
            </div>
            <div className="modal-form">
              <div className="form-group">
                <label htmlFor="startDate">
                  <Calendar />
                  Data Inicial
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={filterData.startDate}
                  onChange={(e) => setFilterData({ ...filterData, startDate: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="endDate">
                  <Calendar />
                  Data Final
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={filterData.endDate}
                  onChange={(e) => setFilterData({ ...filterData, endDate: e.target.value })}
                />
              </div>
              <div className="form-actions">
                <button onClick={applyDateFilter} className="btn-save">
                  <Filter />
                  Aplicar Filtro
                </button>
                <button onClick={clearFilter} className="btn-cancel">
                  <X />
                  Limpar Filtro
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Login */}
      {showLoginModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                <Shield />
                Login Administrador
              </h2>
              <button onClick={() => setShowLoginModal(false)} className="close-btn">
                <X />
              </button>
            </div>
            <form onSubmit={handleAdminLogin} className="modal-form">
              <div className="form-group">
                <label htmlFor="username">
                  <Shield />
                  Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  placeholder="Digite o usuário"
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">
                  <Shield />
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                  placeholder="Digite a senha"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">
                  <Shield />
                  Entrar
                </button>
                <button type="button" onClick={() => setShowLoginModal(false)} className="btn-cancel">
                  <X />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Administração */}
      {showAdminModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                <Shield />
                Painel Administrativo
              </h2>
              <button onClick={() => setShowAdminModal(false)} className="close-btn">
                <X />
              </button>
            </div>
            <div className="modal-form">
              <div className="admin-section">
                <h3>Importação de Contas</h3>
                <p>Importar contas do arquivo contas.txt</p>
                <button onClick={importBillsFromFile} className="btn-import">
                  <Upload />
                  Importar Contas
                </button>
              </div>
              <div className="form-actions">
                <button onClick={() => setShowAdminModal(false)} className="btn-cancel">
                  <X />
                  Fechar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Adicionar */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                <Plus />
                Adicionar Nova Conta
              </h2>
              <button onClick={closeAddModal} className="close-btn">
                <X />
              </button>
            </div>
            <form onSubmit={handleAddBill} className="modal-form">
              <div className="form-group">
                <label htmlFor="addCompany">
                  <Building2 />
                  Empresa *
                </label>
                <input
                  type="text"
                  id="addCompany"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="form-group">
                <label htmlFor="addNumber">
                  <FileText />
                  Número da Nota
                </label>
                <input
                  type="text"
                  id="addNumber"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="Ex: NF 123456"
                />
              </div>
              <div className="form-group">
                <label htmlFor="addParcels">
                  <FileText />
                  Parcelas *
                </label>
                <input
                  type="text"
                  id="addParcels"
                  value={formData.parcels}
                  onChange={(e) => setFormData({ ...formData, parcels: e.target.value })}
                  required
                  placeholder="Ex: 1/3, 2/3, 3/3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="addDate">
                  <Calendar />
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  id="addDate"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="addValue">
                  <DollarSign />
                  Valor *
                </label>
                <input
                  type="text"
                  id="addValue"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: applyValueMask(e.target.value) })}
                  required
                  placeholder="0,00"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">
                  <Save />
                  Salvar
                </button>
                <button type="button" onClick={closeAddModal} className="btn-cancel">
                  <X />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal de Editar */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                <Edit />
                Editar Conta
              </h2>
              <button onClick={closeEditModal} className="close-btn">
                <X />
              </button>
            </div>
            <form onSubmit={handleEditBill} className="modal-form">
              <div className="form-group">
                <label htmlFor="editCompany">
                  <Building2 />
                  Empresa *
                </label>
                <input
                  type="text"
                  id="editCompany"
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  required
                  placeholder="Nome da empresa"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editNumber">
                  <FileText />
                  Número da Nota
                </label>
                <input
                  type="text"
                  id="editNumber"
                  value={formData.number}
                  onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                  placeholder="Ex: NF 123456"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editParcels">
                  <FileText />
                  Parcelas *
                </label>
                <input
                  type="text"
                  id="editParcels"
                  value={formData.parcels}
                  onChange={(e) => setFormData({ ...formData, parcels: e.target.value })}
                  required
                  placeholder="Ex: 1/3, 2/3, 3/3"
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDate">
                  <Calendar />
                  Data de Vencimento *
                </label>
                <input
                  type="date"
                  id="editDate"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editValue">
                  <DollarSign />
                  Valor *
                </label>
                <input
                  type="text"
                  id="editValue"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: applyValueMask(e.target.value) })}
                  required
                  placeholder="0,00"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn-save">
                  <Save />
                  Salvar
                </button>
                <button type="button" onClick={closeEditModal} className="btn-cancel">
                  <X />
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
