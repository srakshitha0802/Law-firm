const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.eot': 'application/vnd.ms-fontobject'
};

// In-memory static cache for lightning-fast sub-millisecond responses
const fileCache = new Map();
const MAX_CACHE_SIZE = 8 * 1024 * 1024; // 8MB max cache per file

function getFileCache(filePath, stats, callback) {
  const cached = fileCache.get(filePath);
  if (cached && cached.mtime === stats.mtimeMs) {
    return callback(null, cached);
  }

  fs.readFile(filePath, (err, buffer) => {
    if (err) return callback(err);

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const isCompressible = /^(text\/|application\/(javascript|json)|image\/svg\+xml)/.test(contentType);

    if (isCompressible) {
      zlib.gzip(buffer, (zipErr, zipped) => {
        const item = {
          raw: buffer,
          gzip: zipErr ? null : zipped,
          mtime: stats.mtimeMs,
          etag: `W/"${stats.size}-${stats.mtimeMs}"`
        };
        if (stats.size < MAX_CACHE_SIZE) {
          fileCache.set(filePath, item);
        }
        callback(null, item);
      });
    } else {
      const item = {
        raw: buffer,
        gzip: null,
        mtime: stats.mtimeMs,
        etag: `W/"${stats.size}-${stats.mtimeMs}"`
      };
      if (stats.size < MAX_CACHE_SIZE) {
        fileCache.set(filePath, item);
      }
      callback(null, item);
    }
  });
}

function startServer(port) {
  const server = http.createServer((req, res) => {
    let reqPath = decodeURI(req.url.split('?')[0]);
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/index.html';
    }

    // Security: prevent directory traversal
    const safePath = path.normalize(reqPath).replace(/^(\.\.[\/\\])+/, '');
    let filePath = path.join(PUBLIC_DIR, safePath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        const fallbackPath = filePath + '.html';
        fs.stat(fallbackPath, (fbErr, fbStats) => {
          if (!fbErr && fbStats.isFile()) {
            serveFile(fallbackPath, fbStats, req, res);
          } else {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            res.end('404 Not Found: ' + reqPath);
          }
        });
        return;
      }

      serveFile(filePath, stats, req, res);
    });
  });

  function serveFile(filePath, stats, req, res) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    const etag = `W/"${stats.size}-${stats.mtimeMs}"`;

    // 304 Not Modified
    if (req.headers['if-none-match'] === etag) {
      res.writeHead(304);
      res.end();
      return;
    }

    // Cache headers
    let cacheControl = 'no-cache, must-revalidate';
    if (ext === '.jpg' || ext === '.png' || ext === '.webp' || ext === '.svg' || ext === '.ico' || ext === '.woff2' || ext === '.woff') {
      cacheControl = 'public, max-age=2592000, immutable'; // 30 days
    } else if (ext === '.css' || ext === '.js') {
      cacheControl = 'public, max-age=86400, stale-while-revalidate=604800'; // 1 day, stale 7 days
    }

    const acceptGzip = (req.headers['accept-encoding'] || '').includes('gzip');

    getFileCache(filePath, stats, (err, fileData) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Server Error');
        return;
      }

      const headers = {
        'Content-Type': contentType,
        'Cache-Control': cacheControl,
        'ETag': fileData.etag,
        'Access-Control-Allow-Origin': '*'
      };

      if (acceptGzip && fileData.gzip) {
        headers['Content-Encoding'] = 'gzip';
        res.writeHead(200, headers);
        res.end(fileData.gzip);
      } else {
        res.writeHead(200, headers);
        res.end(fileData.raw);
      }
    });
  }

  server.listen(port, () => {
    console.log(`\n==================================================`);
    console.log(`⚖️  Sekhar Associates Law Firm Website (High Performance)`);
    console.log(`⚡ In-memory cache + Gzip compression: ACTIVE`);
    console.log(`🌐 Local Server running at: http://localhost:${port}`);
    console.log(`📄 Open in browser: http://localhost:${port}/index.html`);
    console.log(`==================================================\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️  Port ${port} in use. Trying port ${Number(port) + 1}...`);
      startServer(Number(port) + 1);
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer(PORT);
