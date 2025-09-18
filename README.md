# Sistema de Contas - Site Estático

Sistema web para gerenciamento de contas a pagar com funcionalidades de importação e filtros.

## Funcionalidades

- ✅ Visualização de contas em formato compacto
- ✅ Cálculo automático de totais e valores por dia útil
- ✅ Filtro por período de datas
- ✅ Saldo bancário integrado
- ✅ Importação de contas via arquivo .txt
- ✅ Download de template para importação
- ✅ Interface responsiva e moderna
- ✅ Edição e exclusão de contas
- ✅ Persistência de dados no localStorage

## Deploy no Netlify

### Opção 1: Deploy via GitHub

1. Faça upload do projeto para um repositório GitHub
2. Acesse [Netlify](https://netlify.com)
3. Conecte seu repositório GitHub
4. Configure as seguintes opções:
   - **Build command**: `echo 'Site estático - sem build necessário'`
   - **Publish directory**: `.`
   - **Node version**: `18`

### Opção 2: Deploy via Netlify CLI

```bash
# Instalar Netlify CLI
npm install -g netlify-cli

# Fazer login
netlify login

# Deploy
netlify deploy --prod
```

## Formato do Arquivo de Importação

O arquivo deve estar no formato .txt com as seguintes colunas separadas por TAB:

```
EMPRESA - NF NUMERO    PARCELA    DATA        VALOR
ARTECOLA - NF 651630   1/3        16/09/2025  R$ 1.498,72
```

## Estrutura do Projeto

```
├── index.html          # Página principal
├── app.js             # Lógica JavaScript
├── styles.css         # Estilos CSS
├── package.json       # Configuração do projeto
├── netlify.toml       # Configuração do Netlify
├── _redirects         # Redirecionamentos do Netlify
├── requirements.txt   # Dependências Python (opcional)
├── contas.txt         # Arquivo de contas de exemplo
└── README.md          # Documentação
```

## Desenvolvimento Local

```bash
# Executar servidor local
python -m http.server 8000

# Ou usando Node.js
npx serve .

# Acessar: http://localhost:8000
```

## Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Deploy**: Netlify
- **Estilo**: CSS Grid, Flexbox, Gradientes
- **Ícones**: FontAwesome
- **Fonte**: Segoe UI

## Funcionalidades Detalhadas

### Gestão de Contas
- Visualização de todas as contas em tabela responsiva
- Status visual das contas (Vencida, Hoje, A pagar)
- Edição inline de contas
- Exclusão de contas com confirmação

### Filtros e Relatórios
- Filtro por período de datas
- Cálculo automático de totais
- Valor por dia útil
- Contador de contas filtradas

### Importação/Exportação
- Importação de arquivos .txt
- Download de template para importação
- Processamento automático de dados

### Saldo Bancário
- Inserção de saldo bancário
- Persistência no localStorage
- Cálculo de total geral incluindo saldo

## Como Usar

1. **Visualizar Contas**: As contas são carregadas automaticamente
2. **Filtrar por Data**: Use os campos de data inicial e final
3. **Atualizar Saldo**: Digite o saldo bancário e clique em "Atualizar"
4. **Importar Contas**: Use o botão "Escolher Arquivo" para importar um arquivo .txt
5. **Editar/Excluir**: Use os botões de ação na tabela de contas
6. **Download Template**: Baixe o template para criar arquivos de importação

## Licença

MIT License
