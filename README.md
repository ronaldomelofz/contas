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
contas/
├── index.html          # Página principal
├── styles.css          # Estilos CSS
├── app.js             # Lógica JavaScript
├── manifest.json      # Configuração PWA
├── sw.js             # Service Worker
├── netlify.toml      # Configuração Netlify
├── _redirects        # Regras de redirecionamento
├── contas.txt        # Arquivo de exemplo
└── README.md         # Este arquivo
```

## Desenvolvimento Local

1. Clone o repositório
2. Abra o arquivo `index.html` em um navegador
3. Ou use um servidor local:

```bash
# Python
python -m http.server 8000

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos modernos com Grid e Flexbox
- **JavaScript ES6+**: Lógica da aplicação
- **PWA**: Progressive Web App
- **Service Worker**: Cache offline
- **LocalStorage**: Persistência de dados

## Funcionalidades Detalhadas

### Gerenciamento de Contas
- Visualização de todas as contas em tabela
- Ordenação automática por data
- Edição inline de contas
- Exclusão com confirmação
- Adição de novas contas

### Filtros e Relatórios
- Filtro por período de datas
- Cálculo automático de dias úteis
- Valor por dia útil
- Total geral das contas

### Importação e Exportação
- Importação via arquivo .txt
- Download de template
- Exportação de dados em JSON
- Backup completo do sistema

### Interface Responsiva
- Design mobile-first
- Layout adaptativo
- Touch-friendly
- PWA instalável

## Uso

1. **Visualizar Contas**: As contas são exibidas automaticamente na tabela
2. **Filtrar por Data**: Use os campos de data para filtrar contas
3. **Adicionar Conta**: Clique em "Adicionar Nova Conta" e preencha os dados
4. **Editar Conta**: Clique em "Editar" na linha da conta desejada
5. **Excluir Conta**: Clique em "Excluir" e confirme a ação
6. **Importar Contas**: Acesse a aba "Administrador" e use a função de importação

## Administração

- **Login**: ADMIN / 1214
- **Importar Dados**: Upload de arquivo .txt
- **Exportar Dados**: Download em formato JSON
- **Reset Sistema**: Restaurar dados padrão
- **Estatísticas**: Informações do sistema

## Suporte

Para dúvidas ou problemas, consulte a documentação ou entre em contato com o desenvolvedor.
