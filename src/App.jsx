import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar as CalendarComponent } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { CalendarIcon, Plus, Edit, Trash2, Filter, Download, Upload, DollarSign, TrendingUp, Banknote, FileText, Search, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import './App.css'

function App() {
  const [contas, setContas] = useState([])
  const [saldoBancario, setSaldoBancario] = useState(11006.94)
  const [dataInicial, setDataInicial] = useState('')
  const [dataFinal, setDataFinal] = useState('')
  const [editandoConta, setEditandoConta] = useState(null)
  const [novaConta, setNovaConta] = useState({
    descricao: '',
    parcela: '',
    data: '',
    valor: ''
  })
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [filtroStatus, setFiltroStatus] = useState('todas')
  const [busca, setBusca] = useState('')
  const [dataInicialCalendar, setDataInicialCalendar] = useState()
  const [dataFinalCalendar, setDataFinalCalendar] = useState()
  const [mostrarFiltros, setMostrarFiltros] = useState(false)

  // Dados iniciais baseados no arquivo fornecido
  useEffect(() => {
    const contasIniciais = [
      { id: 1, descricao: 'FLORA - NF 130165', parcela: '3/3', data: '2025-09-17', valor: 33825.36, status: 'pago' },
      { id: 2, descricao: 'ROMETAL - NF 160349', parcela: '1/3', data: '2025-09-18', valor: 6279.72, status: 'pendente' },
      { id: 3, descricao: 'ROMETAL - NF 251614', parcela: '1/3', data: '2025-09-18', valor: 2848.22, status: 'pendente' },
      { id: 4, descricao: 'UNA - NF 184351', parcela: '2/3', data: '2025-09-18', valor: 2900.65, status: 'pendente' },
      { id: 5, descricao: 'BARZEL - NF 375509', parcela: '1/3', data: '2025-09-19', valor: 719.81, status: 'pendente' },
      { id: 6, descricao: 'EMPRÉSTIMO ITAÚ', parcela: '22/42', data: '2025-09-19', valor: 41345.46, status: 'pendente' },
      { id: 7, descricao: 'FLORA - NF 131545', parcela: '2/3', data: '2025-09-19', valor: 37085.94, status: 'pendente' },
      { id: 8, descricao: 'IBRAP - NF 664371', parcela: '3/5', data: '2025-09-19', valor: 225.76, status: 'pendente' },
      { id: 9, descricao: 'FGTS', parcela: 'MENSAL', data: '2025-09-20', valor: 1200.00, status: 'pendente' },
      { id: 10, descricao: 'FRETE - METALFIXE - NF 23848 - TRL', parcela: '1/1', data: '2025-09-20', valor: 425.41, status: 'pendente' },
      { id: 11, descricao: 'INSS', parcela: 'MENSAL', data: '2025-09-20', valor: 7000.00, status: 'pendente' },
      { id: 12, descricao: 'TEGUS - NF 26670', parcela: '1/3', data: '2025-09-20', valor: 2588.34, status: 'pendente' },
      { id: 13, descricao: 'FLORA - NF 133036', parcela: '1/3', data: '2025-09-22', valor: 34583.62, status: 'pendente' },
      { id: 14, descricao: 'ARTECOLA - NF 651630', parcela: '2/3', data: '2025-09-23', valor: 1498.72, status: 'pendente' },
      { id: 15, descricao: 'STAM - NF 392008', parcela: '1/4', data: '2025-09-23', valor: 1398.28, status: 'pendente' },
      { id: 16, descricao: 'ALTERDATA', parcela: 'MENSAL', data: '2025-09-26', valor: 870.31, status: 'pendente' },
      { id: 17, descricao: 'HELA - NF 117062', parcela: '4/4', data: '2025-09-26', valor: 417.50, status: 'pendente' },
      { id: 18, descricao: 'METALNOX - NF 1819', parcela: '2/3', data: '2025-09-27', valor: 2965.70, status: 'pendente' },
      { id: 19, descricao: 'FLORA - NF 132003', parcela: '2/3', data: '2025-09-28', valor: 39822.23, status: 'pendente' },
      { id: 20, descricao: 'FLORA - NF 132005', parcela: '2/3', data: '2025-09-28', valor: 466.73, status: 'pendente' },
      { id: 21, descricao: 'METALNOX -NF 1912', parcela: '1/3', data: '2025-09-28', valor: 2839.76, status: 'pendente' },
      { id: 22, descricao: 'BARZEL - NF 375509', parcela: '2/3', data: '2025-09-29', valor: 622.66, status: 'pendente' },
      { id: 23, descricao: 'ARTECOLA - NF 651630', parcela: '3/3', data: '2025-09-30', valor: 1499.17, status: 'pendente' },
      { id: 24, descricao: 'CONTADOR', parcela: 'MENSAL', data: '2025-09-30', valor: 2904.00, status: 'pendente' },
      { id: 25, descricao: 'FOLHA PAGAMENTO', parcela: 'MENSAL', data: '2025-09-30', valor: 9000.00, status: 'pendente' },
      { id: 26, descricao: 'MASUTTI - NF 117654', parcela: '2/3', data: '2025-09-30', valor: 1821.98, status: 'pendente' },
      { id: 27, descricao: 'METALNOX - NF 68272', parcela: '2/3', data: '2025-09-30', valor: 1762.17, status: 'pendente' },
      { id: 28, descricao: 'PRO-LABORE ARIOSTO 09/2025', parcela: 'MENSAL', data: '2025-09-30', valor: 10000.00, status: 'pendente' },
      { id: 29, descricao: 'PRO-LABORE RONALDO 09/2025', parcela: 'MENSAL', data: '2025-09-30', valor: 10000.00, status: 'pendente' },
      { id: 30, descricao: 'TEGUS - NF 26670', parcela: '2/3', data: '2025-09-30', valor: 2588.34, status: 'pendente' }
    ]
    setContas(contasIniciais)
  }, [])

  // Filtrar contas por data, status e busca
  const contasFiltradas = contas.filter(conta => {
    // Filtro por data
    const filtroData = !dataInicial && !dataFinal ? true : (() => {
      const dataConta = new Date(conta.data)
      const inicio = dataInicial ? new Date(dataInicial) : new Date('1900-01-01')
      const fim = dataFinal ? new Date(dataFinal) : new Date('2100-12-31')
      return dataConta >= inicio && dataConta <= fim
    })()

    // Filtro por status
    const filtroStatusAplicado = filtroStatus === 'todas' || conta.status === filtroStatus

    // Filtro por busca
    const filtroBusca = !busca || conta.descricao.toLowerCase().includes(busca.toLowerCase())

    return filtroData && filtroStatusAplicado && filtroBusca
  })

  // Calcular totais
  const totalContas = contasFiltradas.reduce((sum, conta) => sum + conta.valor, 0)
  const totalComSaldo = totalContas + saldoBancario

  // Calcular faturamento por dia (segunda a sábado)
  const calcularFaturamentoDiario = () => {
    if (!dataInicial || !dataFinal) return 0
    
    const inicio = new Date(dataInicial)
    const fim = new Date(dataFinal)
    let diasUteis = 0
    
    for (let d = new Date(inicio); d <= fim; d.setDate(d.getDate() + 1)) {
      const diaSemana = d.getDay()
      if (diaSemana >= 1 && diaSemana <= 6) { // Segunda (1) a Sábado (6)
        diasUteis++
      }
    }
    
    return diasUteis > 0 ? totalComSaldo / diasUteis : 0
  }

  const faturamentoDiario = calcularFaturamentoDiario()

  // Funções CRUD
  const adicionarConta = () => {
    if (novaConta.descricao && novaConta.data && novaConta.valor) {
      const conta = {
        id: Date.now(),
        descricao: novaConta.descricao,
        parcela: novaConta.parcela || '1/1',
        data: novaConta.data,
        valor: parseFloat(novaConta.valor),
        status: 'pendente'
      }
      setContas([...contas, conta])
      setNovaConta({ descricao: '', parcela: '', data: '', valor: '' })
      setMostrarFormulario(false)
    }
  }

  const editarConta = (conta) => {
    setEditandoConta(conta)
    setNovaConta({
      descricao: conta.descricao,
      parcela: conta.parcela,
      data: conta.data,
      valor: conta.valor.toString()
    })
    setMostrarFormulario(true)
  }

  const salvarEdicao = () => {
    if (editandoConta && novaConta.descricao && novaConta.data && novaConta.valor) {
      const contasAtualizadas = contas.map(conta =>
        conta.id === editandoConta.id
          ? {
              ...conta,
              descricao: novaConta.descricao,
              parcela: novaConta.parcela || '1/1',
              data: novaConta.data,
              valor: parseFloat(novaConta.valor)
            }
          : conta
      )
      setContas(contasAtualizadas)
      setEditandoConta(null)
      setNovaConta({ descricao: '', parcela: '', data: '', valor: '' })
      setMostrarFormulario(false)
    }
  }

  const excluirConta = (id) => {
    setContas(contas.filter(conta => conta.id !== id))
  }

  const cancelarEdicao = () => {
    setEditandoConta(null)
    setNovaConta({ descricao: '', parcela: '', data: '', valor: '' })
    setMostrarFormulario(false)
  }

  const alterarStatus = (id, novoStatus) => {
    setContas(contas.map(conta => 
      conta.id === id ? { ...conta, status: novoStatus } : conta
    ))
  }

  const formatarMoeda = (valor) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      pendente: { label: 'Pendente', variant: 'secondary' },
      pago: { label: 'Pago', variant: 'default' },
      vencido: { label: 'Vencido', variant: 'destructive' }
    }
    const config = statusConfig[status] || statusConfig.pendente
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const exportarContas = () => {
    const csvContent = [
      ['Descrição', 'Parcela', 'Data', 'Valor', 'Status'],
      ...contasFiltradas.map(conta => [
        conta.descricao,
        conta.parcela,
        conta.data,
        conta.valor.toString(),
        conta.status
      ])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'contas.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
                <DollarSign className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sistema de Gestão de Contas</h1>
                <p className="text-gray-600">Controle financeiro profissional e intuitivo</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button 
                onClick={exportarContas}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Exportar</span>
              </Button>
              <Button 
                onClick={() => setMostrarFormulario(true)}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Conta
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Saldo Bancário</p>
                  <p className="text-2xl font-bold">{formatarMoeda(saldoBancario)}</p>
                </div>
                <Banknote className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Total Contas</p>
                  <p className="text-2xl font-bold">{formatarMoeda(totalContas)}</p>
                </div>
                <FileText className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Total Geral</p>
                  <p className="text-2xl font-bold">{formatarMoeda(totalComSaldo)}</p>
                </div>
                <TrendingUp className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium opacity-90">Faturamento/Dia</p>
                  <p className="text-2xl font-bold">{formatarMoeda(faturamentoDiario)}</p>
                </div>
                <CalendarIcon className="h-8 w-8 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles e Filtros */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center space-x-2">
                  <Filter className="h-5 w-5" />
                  <span>Controles e Filtros</span>
                </CardTitle>
                <CardDescription>Configure o saldo bancário e filtre as contas</CardDescription>
              </div>
              <Button
                variant="outline"
                onClick={() => setMostrarFiltros(!mostrarFiltros)}
                className="flex items-center space-x-2"
              >
                {mostrarFiltros ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
                <span>{mostrarFiltros ? 'Ocultar' : 'Mostrar'} Filtros</span>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="saldo">Saldo Bancário</Label>
                <Input
                  id="saldo"
                  type="number"
                  step="0.01"
                  value={saldoBancario}
                  onChange={(e) => setSaldoBancario(parseFloat(e.target.value) || 0)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label>Data Inicial</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataInicialCalendar ? format(dataInicialCalendar, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dataInicialCalendar}
                      onSelect={(date) => {
                        setDataInicialCalendar(date)
                        setDataInicial(date ? format(date, "yyyy-MM-dd") : "")
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Data Final</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dataFinalCalendar ? format(dataFinalCalendar, "dd/MM/yyyy", { locale: ptBR }) : "Selecionar data"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <CalendarComponent
                      mode="single"
                      selected={dataFinalCalendar}
                      onSelect={(date) => {
                        setDataFinalCalendar(date)
                        setDataFinal(date ? format(date, "yyyy-MM-dd") : "")
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="pago">Pago</SelectItem>
                    <SelectItem value="vencido">Vencido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {mostrarFiltros && (
              <div className="mt-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="busca">Buscar por descrição</Label>
                  <Input
                    id="busca"
                    placeholder="Digite para buscar..."
                    value={busca}
                    onChange={(e) => setBusca(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Formulário de Nova Conta/Edição */}
        <Dialog open={mostrarFormulario} onOpenChange={setMostrarFormulario}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editandoConta ? 'Editar Conta' : 'Nova Conta'}
              </DialogTitle>
              <DialogDescription>
                {editandoConta ? 'Altere as informações da conta' : 'Adicione uma nova conta ao sistema'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Input
                  id="descricao"
                  value={novaConta.descricao}
                  onChange={(e) => setNovaConta({...novaConta, descricao: e.target.value})}
                  placeholder="Ex: FLORA - NF 130165"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parcela">Parcela</Label>
                <Input
                  id="parcela"
                  value={novaConta.parcela}
                  onChange={(e) => setNovaConta({...novaConta, parcela: e.target.value})}
                  placeholder="Ex: 1/3 ou MENSAL"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={novaConta.data}
                  onChange={(e) => setNovaConta({...novaConta, data: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="valor">Valor</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  value={novaConta.valor}
                  onChange={(e) => setNovaConta({...novaConta, valor: e.target.value})}
                  placeholder="0.00"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={cancelarEdicao}>
                Cancelar
              </Button>
              <Button onClick={editandoConta ? salvarEdicao : adicionarConta}>
                {editandoConta ? 'Salvar Alterações' : 'Adicionar Conta'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Lista de Contas */}
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Lista de Contas</CardTitle>
                <CardDescription>
                  Mostrando {contasFiltradas.length} de {contas.length} contas
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Parcela</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-center">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contasFiltradas.map((conta) => (
                    <TableRow key={conta.id}>
                      <TableCell className="font-medium">{conta.descricao}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{conta.parcela}</Badge>
                      </TableCell>
                      <TableCell>{formatarData(conta.data)}</TableCell>
                      <TableCell>{getStatusBadge(conta.status)}</TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatarMoeda(conta.valor)}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => editarConta(conta)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Select value={conta.status} onValueChange={(value) => alterarStatus(conta.id, value)}>
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pendente">Pendente</SelectItem>
                              <SelectItem value="pago">Pago</SelectItem>
                              <SelectItem value="vencido">Vencido</SelectItem>
                            </SelectContent>
                          </Select>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Tem certeza que deseja excluir a conta "{conta.descricao}"? Esta ação não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => excluirConta(conta.id)}>
                                  Excluir
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {contasFiltradas.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">Nenhuma conta encontrada para os filtros selecionados.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default App
