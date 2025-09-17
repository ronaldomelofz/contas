# Sistema de Contas - Python

Sistema web para gerenciamento de contas a pagar com funcionalidades de importação e filtros.

## Funcionalidades

- ✅ Visualização de contas em formato compacto
- ✅ Cálculo automático de totais e valores por dia útil
- ✅ Filtro por período de datas
- ✅ Saldo bancário integrado
- ✅ Importação de contas via arquivo .txt
- ✅ Download de template para importação
- ✅ Interface responsiva e moderna

## Deploy no Netlify

### Opção 1: Deploy via GitHub

1. Faça upload do projeto para um repositório GitHub
2. Acesse [Netlify](https://netlify.com)
3. Conecte seu repositório GitHub
4. Configure as seguintes opções:
   - **Build command**: `pip install -r requirements.txt && python app.py`
   - **Publish directory**: `.`
   - **Python version**: `3.9`

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
├── app.py                 # Aplicação Flask principal
├── requirements.txt       # Dependências Python
├── netlify.toml          # Configuração do Netlify
├── _redirects            # Redirecionamentos do Netlify
├── Procfile              # Configuração do Heroku
├── templates/
│   └── index.html        # Template HTML principal
└── contas.txt            # Arquivo de contas (opcional)
```

## Desenvolvimento Local

```bash
# Instalar dependências
pip install -r requirements.txt

# Executar aplicação
python app.py

# Acessar: http://localhost:3000
```

## Tecnologias Utilizadas

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Deploy**: Netlify
- **Estilo**: Inter Font, FontAwesome Icons
