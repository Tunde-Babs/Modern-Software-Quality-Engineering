import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

// Serve only this explicit local simulator asset list; no repository file access.
const assets = new Map([
  ['/', ['index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['app.js', 'text/javascript; charset=utf-8']],
  ['/products.json', ['products.json', 'application/json; charset=utf-8']],
]);
const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }
  const asset = assets.get(new URL(request.url, 'http://127.0.0.1').pathname);
  if (!asset) { response.writeHead(404).end('Not found'); return; }
  try {
    const body = await readFile(new URL(`./app/${asset[0]}`, import.meta.url));
    response.writeHead(200, { 'Content-Type': asset[1], 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(500).end('Simulator asset unavailable');
  }
});
server.listen(4178, '127.0.0.1', () => console.log('Atlas Commerce: http://127.0.0.1:4178'));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
