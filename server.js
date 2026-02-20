const http = require('http');
const fs = require('fs');
const path = require('path');
const { MongoClient } = require('mongodb');

const PORT = process.env.PORT || 3000;
const MONGODB_URL = process.env.MONGODB_URL || 'mongodb+srv://gabriel:lovemall1@cluster0.llgibc1.mongodb.net/oficina?retryWrites=true&w=majority';

let db;

// Conectar ao MongoDB
MongoClient.connect(MONGODB_URL)
  .then(client => {
    db = client.db('oficina');
    console.log('✅ Conectado ao MongoDB!');
  })
  .catch(err => {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
  });

async function lerDados() {
  try {
    const doc = await db.collection('dados').findOne({ _id: 'principal' });
    if (doc) {
      delete doc._id;
      return doc;
    }
    return { clientes: [], servicos: [], pagamentos: [], gastos: [] };
  } catch {
    return { clientes: [], servicos: [], pagamentos: [], gastos: [] };
  }
}

async function salvarDados(dados) {
  await db.collection('dados').updateOne(
    { _id: 'principal' },
    { $set: { ...dados, _id: 'principal' } },
    { upsert: true }
  );
}

const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  // API GET
  if (req.method === 'GET' && req.url === '/api/dados') {
    const dados = await lerDados();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(dados));
    return;
  }

  // API POST
  if (req.method === 'POST' && req.url === '/api/dados') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', async () => {
      try {
        const dados = JSON.parse(body);
        await salvarDados(dados);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400); res.end('Erro ao salvar: ' + e.message);
      }
    });
    return;
  }

  // Servir arquivos estáticos
  if (req.method === 'GET') {
    let filePath = req.url === '/' ? 'index.html' : req.url.replace(/^\//, '');
    filePath = path.join(__dirname, filePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath);
      const types = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css',
        '.js': 'application/javascript',
        '.json': 'application/json'
      };
      res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
      res.end(fs.readFileSync(filePath));
    } else {
      const indexPath = path.join(__dirname, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(fs.readFileSync(indexPath));
      } else {
        res.writeHead(404);
        res.end('index.html não encontrado');
      }
    }
    return;
  }

  res.writeHead(404); res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`✅ Oficina do Abel rodando em http://localhost:${PORT}`);
});
