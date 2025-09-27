const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const root = path.resolve(__dirname);
const port = process.env.PORT || 8080;

const mime = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  let urlPath = decodeURI(req.url.split('?')[0]);
  if (urlPath === '/' || urlPath === '') urlPath = '/index.html';
  const filePath = path.join(root, urlPath);

  // security: prevent path traversal
  if (!filePath.startsWith(root)) {
    res.statusCode = 403;
    return res.end('Forbidden');
  }

  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) {
      res.statusCode = 404;
      return res.end('Not found');
    }

    const ext = path.extname(filePath).toLowerCase();
    const type = mime[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', type);

    // Cache policy: long cache for immutable assets, short for html
    if (ext === '.html') {
      res.setHeader('Cache-Control', 'no-cache');
    } else if (['.js', '.css', '.png', '.jpg', '.jpeg', '.webp', '.svg'].includes(ext)) {
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    }

    const acceptEncoding = (req.headers['accept-encoding'] || '').toLowerCase();
    const raw = fs.createReadStream(filePath);

    // Prefer Brotli, then gzip
    if (/\bbr\b/.test(acceptEncoding)) {
      res.setHeader('Content-Encoding', 'br');
      raw.pipe(zlib.createBrotliCompress()).pipe(res);
    } else if (/\bgzip\b/.test(acceptEncoding)) {
      res.setHeader('Content-Encoding', 'gzip');
      raw.pipe(zlib.createGzip({ level: 6 })).pipe(res);
    } else {
      raw.pipe(res);
    }
  });
});

server.listen(port, () => {
  console.log(`Serving ${root} on http://localhost:${port}`);
});

