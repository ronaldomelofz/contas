# Sistema de Contas - Site Estático

Sistema web para gerenciamento de contas a pagar com funcionalidades de importação e filtros.

## Funcionalidades

- ✅ Visualização de contas em formato compacto
- ✅ Cálculo automático de totais e valores por dia útil
- ✅ Filtro por período de datas
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
.
├── index.html          # Página principal da aplicação
├── styles.css          # Estilos CSS
├── app.js              # Lógica JavaScript principal
├── manifest.json       # Manifest para PWA
├── sw.js               # Service Worker para PWA
├── README.md           # Este arquivo
├── netlify.toml        # Configuração de deploy para Netlify
├── _redirects          # Regras de redirecionamento para Netlify
├── .gitignore          # Arquivos e pastas a serem ignorados pelo Git
└── contas.txt          # Exemplo de arquivo para importação
```

## Desenvolvimento Local

Para rodar o projeto localmente, basta abrir o arquivo `index.html` em seu navegador.
Para um servidor local simples, você pode usar Python:

```bash
python -m http.server 8000
```
E acesse `http://localhost:8000` no seu navegador.

## Tecnologias Utilizadas

- **HTML5**: Estrutura da página
- **CSS3**: Estilização e responsividade
- **JavaScript (ES6+)**: Lógica da aplicação
- **FontAwesome**: Ícones
- **Netlify**: Plataforma de deploy

## Funcionalidades Detalhadas

### Gerenciamento de Contas
- **Visualização**: Todas as contas são exibidas em uma tabela, ordenadas por data.
- **Adicionar**: Botão "Adicionar Nova Conta" abre um modal para inserir novos lançamentos.
- **Editar**: Botão "Editar" em cada linha da tabela permite modificar os detalhes da conta.
- **Excluir**: Botão "Excluir" em cada linha da tabela remove a conta após confirmação.

### Filtros
- **Por Período**: Filtre as contas por uma data inicial e final.
- **Limpar Filtro**: Botão para remover o filtro e exibir todas as contas.

### Importação e Exportação
- **Importar Contas**: Na aba "Administrador", importe contas de um arquivo `.txt`.
- **Download Template**: Baixe um arquivo de template para facilitar a criação de arquivos de importação.
- **Exportar Dados**: Exporte todos os dados do sistema (contas) em formato JSON.

### Persistência
- Todos os dados (contas) são salvos automaticamente no `localStorage` do navegador.
- As alterações são mantidas mesmo após fechar e reabrir o navegador.

### Painel Administrativo
- **Login**: Acesso protegido por usuário e senha (ADMIN / 1214).
- **Funcionalidades**: Contém as opções de Importar Contas, Download Template, Exportar Dados e Resetar Sistema.
- **Estatísticas**: Exibe o número total de contas e o valor total.

### PWA (Progressive Web App)
- O sistema pode ser instalado como um aplicativo em dispositivos móveis e desktops.
- Funciona offline graças ao Service Worker e cache de assets.

## Como Usar

1. **Visualizar Contas**: Ao abrir a aplicação, você verá a lista de contas.
2. **Filtrar**: Use os campos "Data Inicial" e "Data Final" para filtrar as contas por período.
3. **Adicionar Conta**: Clique em "Adicionar Nova Conta" para inserir um novo lançamento.
4. **Editar/Excluir**: Use os botões "Editar" e "Excluir" na tabela para gerenciar as contas.
5. **Administração**: Acesse a aba "Administrador" e faça login para importar, exportar ou resetar dados.
