const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'dados.json');

// Inicializa o arquivo de dados se não existir
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ clientes: [], servicos: [], pagamentos: [], gastos: [] }, null, 2));
}

function lerDados() {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')); }
  catch { return { clientes: [], servicos: [], pagamentos: [], gastos: [] }; }
}

function salvarDados(dados) {
  fs.writeFileSync(DB_FILE, JSON.stringify(dados, null, 2));
}

const server = http.createServer((req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // Servir arquivos estáticos
  if (req.method === 'GET' && !req.url.startsWith('/api')) {
    let filePath = req.url === '/' ? '/index.html' : req.url;
    filePath = path.join(__dirname, filePath);
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript' };
      res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
      res.end(fs.readFileSync(filePath));
    } else {
      res.writeHead(404); res.end('Not found');
    }
    return;
  }

  // API GET - buscar todos os dados
  if (req.method === 'GET' && req.url === '/api/dados') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(lerDados()));
    return;
  }

  // API POST - salvar todos os dados
  if (req.method === 'POST' && req.url === '/api/dados') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const dados = JSON.parse(body);
        salvarDados(dados);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch {
        res.writeHead(400); res.end('Erro ao salvar');
      }
    });
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`✅ Oficina do Abel rodando em http://localhost:${PORT}`);
});