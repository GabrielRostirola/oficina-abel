# 🔧 Oficina Mecânica do Abel — Sistema de Gestão

## Login
- **Usuário:** gabriel
- **Senha:** lovemall1

---

## Como hospedar (para salvar os dados na nuvem)

### ✅ Opção 1 — Railway (GRÁTIS e mais fácil)

1. Crie uma conta em https://railway.app
2. Clique em **"New Project" → "Deploy from GitHub"**
   - Ou use **"Deploy from local"** e envie estes 2 arquivos
3. O sistema vai rodar automaticamente na URL que o Railway gerar

### ✅ Opção 2 — Render (GRÁTIS)

1. Crie uma conta em https://render.com
2. Clique em **"New Web Service"**
3. Envie os arquivos e configure:
   - **Build Command:** (deixe vazio)
   - **Start Command:** `node server.js`
4. A URL gerada é o endereço do seu site

### ✅ Opção 3 — VPS própria (DigitalOcean, Hostinger VPS, etc.)

1. Envie os 2 arquivos para o servidor via FTP ou SSH
2. Instale Node.js: `sudo apt install nodejs`
3. Rode: `node server.js`
4. Para manter rodando sempre: instale o PM2
   ```
   npm install -g pm2
   pm2 start server.js
   pm2 startup
   ```

---

## Arquivos necessários

```
📁 sua-pasta/
├── server.js     ← Backend (salva os dados)
├── index.html    ← O site
└── dados.json    ← Criado automaticamente ao primeiro uso
```

---

## Rodando localmente (para testar)

1. Instale Node.js: https://nodejs.org
2. Abra o terminal nesta pasta
3. Execute: `node server.js`
4. Acesse: http://localhost:3000

---

## Funcionalidades

- 📊 **Dashboard** — Faturamento do mês, lucro, gastos, contas em aberto
- 👤 **Clientes** — Cadastro completo (nome, caminhão, placa, ano, telefone)
- 🔧 **Serviços** — Por cliente, com data, peças usadas, mecânico e valor
- 💰 **Pagamentos** — Controle do que foi pago e o que falta, histórico
- 📋 **Gastos** — Combustível, peças, funcionário, aluguel, etc.
- 🖨️ **Nota do Cliente** — Impressão com todos os dados do serviço