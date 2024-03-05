const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mimeTypes = require('mime-types');
const app = express();
const port = 3000;

// Middleware para analisar corpos de solicitação
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota padrão que redireciona para o arquivo "cadastro.html.html"
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'cadastro.html'));
});

// Rota para lidar com solicitações para "/cadastro"
app.get('/cadastro', (req, res) => {
  res.sendFile(path.join(__dirname, 'cadastro.html'));
});

// Rota para o arquivo main.js
app.get('/main.js', (req, res) => {
  const filePath = path.join(__dirname, 'main.js');
  const contentType = mimeTypes.lookup(filePath);

  res.setHeader('Content-Type', contentType);
  res.sendFile(filePath);
});

// Rota para o arquivo Tela_poscadastro.html
app.get('/Tela_poscadastro.html', (req, res) => {
  const filePath = path.join(__dirname, 'Tela_poscadastro.html');
  res.sendFile(filePath);
});

app.get('/cadastro.html', (req, res) => {
  res.sendFile('cadastro.html', { root: __dirname });
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

