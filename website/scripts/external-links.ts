import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve, relative } from 'node:path';
import { pathToFileURL } from 'node:url';
import { load } from 'cheerio';

export type ExternalLink = { url: string; domain: string; occurrences: { page: string; label: string }[] };
export function inventory(pages: { route: string; html: string }[]): ExternalLink[] {
  const links = new Map<string, ExternalLink>();
  for (const { route, html } of pages) {
    const $ = load(html);
    $('main a[href]').each((_, element) => {
      const href = $(element).attr('href')!;
      if (!/^https?:\/\//i.test(href)) return;
      const url = new URL(href);
      if (url.hostname === 'msqe.dev') return;
      if (url.username || url.password) throw new Error('Credentials in public URL');
      const item = links.get(href) ?? { url: href, domain: url.hostname, occurrences: [] };
      item.occurrences.push({ page: route, label: $(element).text() });
      links.set(href, item);
    });
  }
  return [...links.values()].sort((a, b) => a.url.localeCompare(b.url));
}
export function classify(status: number, redirected: boolean) {
  if (status >= 200 && status < 300) return redirected ? 'REDIRECT' : 'VALID';
  // Access denial and throttling do not establish a broken instructional source.
  if ([401, 403, 407, 408, 429].includes(status) || status >= 500) return 'TIMEOUT/UNVERIFIED';
  if (status >= 300 && status < 400) return 'REDIRECT';
  return 'BROKEN';
}
async function probe(url: string) {
  const started = Date.now();
  try {
    let response = await fetch(url, { method: 'HEAD', redirect: 'follow', signal: AbortSignal.timeout(12000) });
    if (response.status >= 400) {
      response = await fetch(url, { method: 'GET', redirect: 'follow', signal: AbortSignal.timeout(12000) });
      await response.body?.cancel();
    }
    return { classification: classify(response.status, response.redirected), status: response.status, finalUrl: response.url, elapsedMs: Date.now() - started };
  } catch (error) {
    return { classification: 'TIMEOUT/UNVERIFIED', error: error instanceof Error ? error.message : String(error), elapsedMs: Date.now() - started };
  }
}
async function main() {
  const dist = resolve('dist');
  const walk = (directory: string): string[] => readdirSync(directory, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(resolve(directory, entry.name)) : [resolve(directory, entry.name)]);
  const links = inventory(walk(dist).filter(path => path.endsWith('.html')).map(path => ({ route: '/' + relative(dist, path).replace(/index\.html$/, ''), html: readFileSync(path, 'utf8') })));
  const online = process.argv.includes('--online');
  const pending = [...new Set(links.map(link => { const url = new URL(link.url); url.hash = ''; return url.href; }))];
  const checks = new Map<string, Awaited<ReturnType<typeof probe>>>();
  if (online) await Promise.all(Array.from({ length: 6 }, async () => {
    while (pending.length) { const url = pending.shift()!; checks.set(url, await probe(url)); }
  }));
  const rows = links.map(link => {
    const url = new URL(link.url); url.hash = '';
    return { ...link, ...(checks.get(url.href) ?? { classification: 'TIMEOUT/UNVERIFIED', error: 'Network validation not requested' }) };
  });
  const report = { checkedAt: new Date().toISOString(), online, scope: 'External HTTP(S) anchors in generated main content; exact URLs retained; HTTP probes omit fragments', uniqueUrls: links.length, uniqueDomains: new Set(links.map(link => link.domain)).size, occurrences: links.reduce((sum, link) => sum + link.occurrences.length, 0), counts: rows.reduce<Record<string, number>>((counts, row) => { counts[row.classification] = (counts[row.classification] ?? 0) + 1; return counts; }, {}), rows };
  mkdirSync('artifacts', { recursive: true });
  writeFileSync('artifacts/external-links.json', JSON.stringify(report, null, 2) + '\n');
  console.log(JSON.stringify({ ...report, rows: undefined }));
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
