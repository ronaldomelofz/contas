# Sistema de Persistência - Sistema de Contas

Este documento descreve como o sistema de persistência funciona no Sistema de Contas.

## Visão Geral

O sistema utiliza o **localStorage** do navegador para persistir dados entre sessões, garantindo que as informações não sejam perdidas ao fechar e reabrir o navegador.

## Funcionalidades de Persistência

- ✅ **Adicionar conta** → Salva automaticamente no localStorage
- ✅ **Editar conta** → Salva automaticamente no localStorage
- ✅ **Excluir conta** → Salva automaticamente no localStorage
- ✅ **Importar contas** → Salva automaticamente no localStorage
- ✅ **Reset do sistema** → Limpa localStorage e restaura dados padrão

## Chaves de Armazenamento

| Chave | Descrição | Exemplo |
|-------|-----------|---------|
| `contas_bills` | Array de contas | `[{"id":1,"company":"FLORA",...}]` |
| `contas_last_modified` | Data da última modificação | `"2025-01-15T10:30:00.000Z"` |
| `contas_admin_logged_in` | Status de login administrativo | `"true"` |

## Funções de Persistência

### `saveBillsToStorage()`
Salva o array de contas no localStorage.

```javascript
function saveBillsToStorage() {
    try {
        localStorage.setItem('contas_bills', JSON.stringify(bills));
        localStorage.setItem('contas_last_modified', new Date().toISOString());
        console.log('✅ Contas salvas no localStorage:', bills.length, 'contas');
    } catch (error) {
        console.error('❌ Erro ao salvar contas:', error);
        alert('Erro ao salvar as alterações. Tente novamente.');
    }
}
```

### `loadBillsFromStorage()`
Carrega o array de contas do localStorage.

```javascript
function loadBillsFromStorage() {
    try {
        const savedBills = localStorage.getItem('contas_bills');
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
```

### `initializeBills()`
Inicializa as contas (carrega do localStorage ou usa dados padrão).

```javascript
function initializeBills() {
    if (!loadBillsFromStorage()) {
        bills = [...defaultBills];
        saveBillsToStorage();
        console.log('🔄 Contas inicializadas com dados padrão');
    }
    filteredBills = [...bills];
}
```

## Fluxo de Persistência

1. **Carregamento da Página**:
   - `initializeBills()` é chamada
   - Tenta carregar dados do localStorage
   - Se não houver dados, usa dados padrão
   - Salva dados padrão no localStorage

2. **Modificação de Dados**:
   - Usuário adiciona/edita/exclui conta
   - `saveBillsToStorage()` é chamada automaticamente
   - Dados são salvos no localStorage
   - Interface é atualizada

3. **Reset do Sistema**:
   - `resetAllData()` é chamada
   - localStorage é limpo
   - Dados padrão são restaurados
   - `saveBillsToStorage()` salva dados padrão

## Tratamento de Erros

O sistema inclui tratamento de erros para:
- Falhas ao salvar no localStorage
- Falhas ao carregar do localStorage
- Dados corrompidos no localStorage
- Limite de espaço do localStorage

## Limpeza de Dados

Para limpar todos os dados:

```javascript
// Limpar dados específicos
localStorage.removeItem('contas_bills');
localStorage.removeItem('contas_last_modified');
localStorage.removeItem('contas_admin_logged_in');

// Limpar todo o localStorage
localStorage.clear();
```

## Teste de Persistência

1. Adicione uma nova conta
2. Recarregue a página (F5)
3. Verifique se a conta ainda está lá
4. Edite uma conta existente
5. Recarregue a página
6. Verifique se a edição foi mantida
7. Exclua uma conta
8. Recarregue a página
9. Verifique se a conta foi removida

## Compatibilidade

- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers
- ✅ PWA (Progressive Web App)

## Limitações

- Dados são armazenados apenas no navegador atual
- Não há sincronização entre dispositivos
- Limite de ~5-10MB por domínio
- Dados podem ser perdidos se o usuário limpar o cache

## Backup e Restore

O sistema inclui funcionalidades de backup:

- **Exportar Dados**: Gera arquivo JSON com todos os dados
- **Importar Dados**: Restaura dados de arquivo JSON
- **Reset Sistema**: Restaura dados padrão

## Monitoramento

O sistema registra logs detalhados no console:

- ✅ Sucesso ao salvar/carregar
- ❌ Erros de persistência
- 🔄 Inicialização de dados
- 📊 Estatísticas de uso
