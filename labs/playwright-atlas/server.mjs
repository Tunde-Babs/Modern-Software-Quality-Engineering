import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { learningManifest, learningSources } from './learning-content.mjs';
import { handlePracticeApi } from './server-api.mjs';

// Serve only the explicit simulator assets and read-only teaching-source list.
const assets = new Map([
  ['/', ['./app/index.html', 'text/html; charset=utf-8']],
  ['/styles.css', ['./app/styles.css', 'text/css; charset=utf-8']],
  ['/app.js', ['./app/app.js', 'text/javascript; charset=utf-8']],
  ['/workspace-client.js', ['./app/workspace-client.js', 'text/javascript; charset=utf-8']],
  ['/products.json', ['./app/products.json', 'application/json; charset=utf-8']],
  ['/learn', ['./app/learn.html', 'text/html; charset=utf-8']],
  ['/learn/', ['./app/learn.html', 'text/html; charset=utf-8']],
  ['/learn.css', ['./app/learn.css', 'text/css; charset=utf-8']],
  ['/learn.js', ['./app/learn.js', 'text/javascript; charset=utf-8']],
  ['/lesson-renderer.js', ['./app/lesson-renderer.js', 'text/javascript; charset=utf-8']],
  ...[...learningSources].map(([route, source]) => [route, [source, 'text/plain; charset=utf-8']]),
]);
const server = createServer(async (request, response) => {
  let pathname;
  try { pathname = new URL(request.url, 'http://127.0.0.1').pathname; }
  catch { response.writeHead(400).end('Invalid request'); return; }
  if (await handlePracticeApi(request, response, pathname)) return;
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end(); return;
  }
  const asset = assets.get(pathname);
  if (!asset && pathname !== '/learning/manifest.json') { response.writeHead(404).end('Not found'); return; }
  try {
    const body = asset ? await readFile(new URL(asset[0], import.meta.url)) : JSON.stringify(await learningManifest());
    response.writeHead(200, { 'Content-Type': asset?.[1] ?? 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch {
    response.writeHead(500).end('Simulator asset unavailable');
  }
});
const port = Number(process.env.ATLAS_PORT ?? 4178);
if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('ATLAS_PORT must be an integer from 1 to 65535');
server.listen(port, '127.0.0.1', () => console.log(`Atlas Commerce: http://127.0.0.1:${port} · Guided labs: http://127.0.0.1:${port}/learn`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close());
