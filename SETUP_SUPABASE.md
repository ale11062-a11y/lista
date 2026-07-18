# 🚀 Guia de Setup - App de Orçamentos com Supabase

## Passo 1: Configurar Supabase

### 1.1 Criar Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com)
2. Faça login com sua conta
3. Clique em "New Project"
4. Preencha os dados:
   - **Project Name**: `app-orcamentos`
   - **Database Password**: Uma senha forte
   - **Region**: Escolha a mais próxima de você
5. Clique em "Create new project" e aguarde 2-3 minutos

### 1.2 Obter as Chaves de Acesso
1. Na página do projeto, clique em "Settings" (engrenagem no canto inferior esquerdo)
2. Clique em "API"
3. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** → `SUPABASE_ANON_KEY`
   - **service_role secret** → `SUPABASE_SERVICE_ROLE_KEY`

### 1.3 Criar as Tabelas
1. Na página do projeto, clique em "SQL Editor" (esquerda)
2. Clique em "New Query"
3. Copie todo o conteúdo do arquivo `database/schema.sql`
4. Cole na query
5. Clique em "Run" (ou Ctrl+Enter)
6. Aguarde a execução

✅ Suas tabelas estão criadas!

---

## Passo 2: Configurar Backend

### 2.1 Instalar Node.js
- Baixe em [nodejs.org](https://nodejs.org)
- Escolha a versão LTS (recomendado)
- Instale normalmente

### 2.2 Clonar e Configurar o Backend

```bash
# 1. Clonar o repositório
git clone https://github.com/castservicostecnicos-dev/list.git
cd list

# 2. Entrar na pasta do backend
cd backend

# 3. Instalar dependências
npm install

# 4. Copiar arquivo de ambiente
cp .env.example .env

# 5. Editar o .env com suas chaves do Supabase
# Abra o arquivo .env e preencha:
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - SUPABASE_SERVICE_ROLE_KEY
# - JWT_SECRET (qualquer string aleatória forte)
```

### 2.3 Criar Usuários Iniciais

```bash
# No diretório backend/
node setup.js
```

Você verá:
```
✅ Usuários criados com sucesso!

📋 Credenciais de acesso:
Usuário: admin | Senha: 123456
Usuário: operador | Senha: senha123
```

### 2.4 Iniciar o Backend

```bash
# Desenvolvimento (com auto-reload)
npm run dev

# Ou produção
npm start
```

Você verá:
```
🚀 Servidor rodando em http://localhost:3000
```

---

## Passo 3: Configurar Frontend

### 3.1 Atualizar URL da API

1. Abra o arquivo `js/api.js`
2. Na linha:
   ```javascript
   const API_BASE_URL = 'http://localhost:3000/api';
   ```

3. Mude para seu backend:
   - **Desenvolvimento local**: `http://localhost:3000/api`
   - **Produção (Render/Railway)**: `https://seu-backend.com/api`

### 3.2 Executar o Frontend

#### Opção A: Live Server (VSCode)
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Clique "Open with Live Server"

#### Opção B: Python
```bash
python -m http.server 5500
```

#### Opção C: Node.js
```bash
npx http-server -p 5500
```

Acesse: `http://localhost:5500`

---

## Passo 4: Fazer Login

1. Abra `http://localhost:5500` (ou sua URL)
2. Faça login com:
   - **Usuário**: `admin`
   - **Senha**: `123456`

✅ Pronto! Você está logado e pode criar orçamentos!

---

## Passo 5: Publicar Backend (Render)

### 5.1 Preparar Repositório
1. Commit suas mudanças:
   ```bash
   git add .
   git commit -m "Backend configurado com Supabase"
   git push origin app-orcamentos
   ```

### 5.2 Criar Conta no Render
1. Acesse [render.com](https://render.com)
2. Faça login com GitHub
3. Clique em "New +"
4. Escolha "Web Service"
5. Conecte seu repositório GitHub

### 5.3 Configurar Serviço
1. **Name**: `app-orcamentos-backend`
2. **Runtime**: `Node`
3. **Build Command**: `npm install`
4. **Start Command**: `npm start`
5. **Environment Variables**: Adicione todas as do seu `.env`

### 5.4 Deploy
Clique em "Create Web Service" e aguarde o deployment

---

## Endpoints da API

### Autenticação
```
POST /api/auth/login
Body: { "usuario": "admin", "senha": "123456" }
Response: { "token": "...", "usuario": "admin" }
```

### Clientes
```
GET /api/clientes                    # Listar clientes
POST /api/clientes                   # Criar cliente
PUT /api/clientes/:id                # Atualizar cliente
DELETE /api/clientes/:id             # Deletar cliente
```

### Orçamentos
```
GET /api/orcamentos                  # Listar orçamentos
GET /api/orcamentos/:id              # Obter orçamento específico
POST /api/orcamentos                 # Criar orçamento
PUT /api/orcamentos/:id              # Atualizar orçamento
DELETE /api/orcamentos/:id           # Deletar orçamento
```

---

## Troubleshooting

### ❌ Erro: "Cannot find module 'express'"
```bash
npm install
```

### ❌ Erro: "SUPABASE_URL is undefined"
- Verifique se o arquivo `.env` existe
- Verifique se as variáveis estão preenchidas
- Reinicie o servidor com `npm start`

### ❌ Erro: "CORS error"
- Verifique a URL do frontend no `FRONTEND_URL` do `.env`
- A URL deve ser exata (ex: `http://localhost:5500`)

### ❌ Erro: "Usuário ou senha inválidos"
- Execute novamente: `node setup.js`
- Verifique se os usuários foram criados no Supabase

---

## Dúvidas?

- Supabase Docs: https://supabase.com/docs
- Render Docs: https://render.com/docs
- Express Docs: https://expressjs.com

**Tudo funcionando? 🎉 Você tem um app profissional de orçamentos!**
