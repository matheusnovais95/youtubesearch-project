const express = require('express');
const path = require('path');
const app = express();
const port = 8080;

// Servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Adicionar cabeçalhos de conteúdo correto para arquivos JS como módulos
app.get('*.js', (req, res, next) => {
    res.set('Content-Type', 'application/javascript');
    next();
});

// Sempre servir index.html para qualquer outra rota
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor frontend rodando em http://localhost:${port}`);
});
