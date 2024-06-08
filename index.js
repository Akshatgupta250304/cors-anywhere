const { createServer } = require('http');
const { createProxyServer } = require('http-proxy');

const proxy = createProxyServer({});

const server = createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }
  proxy.web(req, res, { target: req.url.slice(1) });
});

module.exports = server;
