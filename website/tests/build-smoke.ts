import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'cheerio';
import { loadDocuments } from '../src/lib/content/loader.ts';
import { authenticateSources } from './preservation.ts';
const dist = resolve('dist');
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
const files = walk(dist);
const pages = files.filter(path => path.endsWith('.html'));
assert.equal(pages.length, 5, 'Expected home, two indexes, chapter, and diagram only');
const urls = new Map(pages.map(path => ['/' + path.slice(dist.length + 1).replace(/index\.html$/, ''), load(readFileSync(path, 'utf8'))]));
let internalLinks = 0;
for (const [route, $] of urls) {
  assert.equal($('h1').length, 1, route);
  assert.equal($('main#main-content').length, 1, route);
  assert.equal($('header.site-header').length, 1);
  assert.equal($('footer.site-footer').length, 1);
  assert.equal($('html').attr('lang'), 'en');
  assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow');
  assert.equal($('link[rel="canonical"]').attr('href'), `https://msqe.dev${route}`);
  assert.ok($('title').text().endsWith(' | MSQE'));
  assert.ok($('meta[name="description"]').attr('content'));
  assert.equal($('meta[property="og:url"]').attr('content'), `https://msqe.dev${route}`);
  assert.equal($('script,iframe,form').length, 0, 'No executable content, collection forms or third-party browser dependencies');
  assert.equal($('[tabindex]').filter((_, el) => Number($(el).attr('tabindex')) > 0).length, 0);
  const ids = $('[id]').map((_, el) => $(el).attr('id')!).get();
  assert.equal(ids.length, new Set(ids).size, route);
  $('[aria-labelledby],[aria-describedby]').each((_, el) => {
    for (const attribute of ['aria-labelledby', 'aria-describedby']) {
      for (const id of ($(el).attr(attribute) ?? '').split(/\s+/).filter(Boolean)) assert.ok(ids.includes(id), `${route}: missing accessible label ${id}`);
    }
  });
  let previousLevel = 0;
  $('h1,h2,h3,h4,h5,h6').each((_, el) => { const level = Number(el.tagName[1]); assert.ok(level <= previousLevel + 1, `${route}: skipped heading`); previousLevel = level; });
  $('a').each((_, el) => {
    const href = $(el).attr('href');
    assert.ok(href, `${route}: missing link destination`);
    if (/^https?:/.test(href)) return;
    assert.ok(!/(?:\.md|\/book\/|\/chapters\/)/.test(href), href);
    const url = new URL(href, `https://msqe.dev${route}`);
    const target = urls.get(url.pathname);
    assert.ok(target, `${route}: missing page ${href}`);
    if (url.hash) assert.ok(target('[id]').toArray().some(node => target(node).attr('id') === decodeURIComponent(url.hash.slice(1))), `${route}: missing fragment ${href}`);
    internalLinks++;
  });
}
for (const document of loadDocuments()) {
  const $ = urls.get(document.route)!;
  assert.equal($('[data-pagefind-body]').length, 1);
  assert.equal($('nav[aria-label="Table of contents"]').length, 1);
  assert.equal($('nav[aria-label="Breadcrumb"] [aria-current="page"]').length, 1);
}
assert.ok(!files.some(path => /\.(?:md|ts|py)$/.test(path)), 'No canonical sources or governance files in output');
const issues = loadDocuments().flatMap(doc => doc.issues);
mkdirSync('artifacts', { recursive: true });
writeFileSync('artifacts/link-report.json', JSON.stringify({ unresolvedOccurrences: issues.length, unresolvedTargets: new Set(issues.map(issue => issue.target)).size, issues }, null, 2) + '\n');
writeFileSync('artifacts/source-preservation.json', JSON.stringify(authenticateSources(), null, 2) + '\n');
console.log(`BUILD SMOKE PASS: ${pages.length} static pages; ${internalLinks} internal links and fragments checked; no scripts or broken public links.`);
console.log(`LINK REPORT: ${issues.length} explicitly reported occurrences / ${new Set(issues.map(issue => issue.target)).size} deferred source targets. See artifacts/link-report.json.`);
