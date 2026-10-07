require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const rootDir = __dirname;

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Express / Vercel compatibility helpers
  res.status = function(code) {
    res.statusCode = code;
    return res;
  };
  res.json = function(data) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(data));
  };
  res.send = function(data) {
    if (typeof data === 'object') return res.json(data);
    res.end(data);
  };

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    const apiRoute = pathname.replace('/api/', '').split('?')[0];
    const apiFilePath = path.join(rootDir, 'api', `${apiRoute}.js`);

    if (fs.existsSync(apiFilePath)) {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        if (body) {
          try {
            req.body = JSON.parse(body);
          } catch (e) {
            req.body = body;
          }
        } else {
          req.body = {};
        }
        req.query = parsedUrl.query;
        try {
          // Clear require cache for fast dev reload
          delete require.cache[require.resolve(apiFilePath)];
          const handler = require(apiFilePath);
          await handler(req, res);
        } catch (err) {
          console.error(`API Error in ${apiRoute}:`, err);
          if (!res.writableEnded) {
            res.status(500).json({ error: err.message });
          }
        }
      });
      return;
    } else {
      return res.status(404).json({ error: 'Endpoint not found' });
    }
  }

  // Static File Serving
  let filePath = path.join(rootDir, pathname === '/' ? 'index.html' : pathname);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(rootDir, 'index.html');
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log(`Apex Electro Platform live at http://localhost:${PORT}`);
});
