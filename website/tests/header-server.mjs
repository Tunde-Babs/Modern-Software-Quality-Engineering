// Local browser-test fixture for this repository's two _headers blocks only.
// This is not a Cloudflare emulator and is not shipped in dist.
import { createServer } from 'node:http';
import { readFileSync, statSync } from 'node:fs';
import { resolve, extname } from 'node:path';
const root = resolve('dist');
const headers = {};
let rule;
for (const line of readFileSync(resolve(root, '_headers'), 'utf8').split('\n')) {
  if (!line.trim()) continue;
  if (!/^\s/.test(line)) {
    rule = line.trim();
    if (!['/*', 'https://msqe.dev/*'].includes(rule)) throw new Error(`Unsupported fixture rule: ${rule}`);
  } else {
    const [name, ...value] = line.trim().split(':');
    headers[name] = value.join(':').trim();
  }
}
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.xml': 'application/xml', '.txt': 'text/plain' };
createServer((req, res) => {
  let path;
  try { path = decodeURIComponent(new URL(req.url, 'http://127.0.0.1').pathname); }
  catch { res.writeHead(400).end(); return; }
  let file = resolve(root, '.' + path);
  if (!file.startsWith(root + '/') && file !== root) { res.writeHead(403).end(); return; }
  let status = 200;
  try {
    if (statSync(file).isDirectory()) file = resolve(file, 'index.html');
    if (!statSync(file).isFile() || path === '/_headers') throw new Error('not public');
  } catch { file = resolve(root, '404.html'); status = 404; }
  const body = readFileSync(file);
  // Apply the apex HTTPS block locally solely to inspect its intended value.
  // A browser does not enforce HSTS over this fixture's plain HTTP transport.
  res.writeHead(status, { ...headers, 'Content-Type': mime[extname(file)] ?? 'application/octet-stream' });
  res.end(req.method === 'HEAD' ? undefined : body);
}).listen(4325, '127.0.0.1', () => console.log('Local header fixture http://127.0.0.1:4325'));
