import assert from 'node:assert/strict';
import { readFileSync, readdirSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'cheerio';
import { registry, chapterSources, resourceEntries, partSources, resourceCollections } from '../src/lib/content/registry.ts';
import { loadDocuments, loadParts, metadataCensus } from '../src/lib/content/loader.ts';
import { authenticateSources } from './preservation.ts';
import { readCanonical } from '../src/lib/content/registry.ts';
import { learningPaths } from '../src/lib/paths.ts';
import { assertReferencePreservation } from './reference-preservation.ts';
const dist = resolve('dist');
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory() ? walk(resolve(dir, entry.name)) : [resolve(dir, entry.name)]);
const files = walk(dist);
const pages = files.filter(path => path.endsWith('.html'));
const searchEntry = JSON.parse(readFileSync(resolve(dist, 'pagefind/pagefind-entry.json'), 'utf8'));
assert.equal(searchEntry.languages.en.page_count, 258, 'Every intended search document indexed');
for (const asset of ['pagefind/pagefind.js', 'pagefind/wasm.en.pagefind', 'search.js', 'favicon.svg']) assert.ok(files.includes(resolve(dist, asset)), `Missing public asset ${asset}`);
assert.match(readFileSync(resolve(dist, 'robots.txt'), 'utf8'), /Disallow: \//);
assert.equal(pages.length, registry.size + resourceCollections.length + learningPaths.length + 6, 'All registered and standalone public pages');
assert.equal(pages.length, 261);
const urls = new Map(pages.map(path => ['/' + path.slice(dist.length + 1).replace(/index\.html$/, ''), load(readFileSync(path, 'utf8'))]));
const titles = new Set<string>();
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
  assert.ok(!titles.has($('title').text()), `Duplicate title: ${route}`);
  titles.add($('title').text());
  assert.ok($('meta[name="description"]').attr('content'));
  assert.equal($('meta[property="og:url"]').attr('content'), `https://msqe.dev${route}`);
  assert.equal($('iframe').length, 0);
  assert.equal($('script').length, route === '/search/' ? 1 : 0, 'JavaScript only on search');
  assert.equal($('form').length, route === '/search/' ? 1 : 0, 'Search is the only form');
  if (route === '/search/') assert.equal($('script').attr('src'), '/search.js');
  assert.equal($('link[rel="icon"]').attr('href'), '/favicon.svg');
  assert.equal($('img:not([alt])').length, 0);
  $('input[type="checkbox"]').each((_, element) => assert.ok($(element).attr('aria-label')?.trim(), `${route}: unlabeled task item`));
  assert.equal($('[tabindex]').filter((_, el) => Number($(el).attr('tabindex')) > 0).length, 0);
  assert.equal($('th:not([scope="col"])').length, 0, route);
  assert.equal($('.table-scroll[tabindex="0"][role="region"][aria-label]').length, $('table').length, route);
  assert.equal($('pre[tabindex="0"][aria-label]').length, $('pre').length, route);
  assert.equal($('.skip-link').attr('href'), '#main-content');
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
    if (/^https?:/.test(href)) {
      if ($(el).attr('target') === '_blank') assert.ok(/(?:noopener|noreferrer)/.test($(el).attr('rel') ?? ''));
      return;
    }
    assert.ok(!/^[a-z][a-z0-9+.-]*:/i.test(href), 'Unsafe link scheme');
    assert.ok(!/(?:\.md|\/book\/|\/chapters\/)/.test(href), href);
    const url = new URL(href, `https://msqe.dev${route}`);
    const target = urls.get(url.pathname);
    assert.ok(target, `${route}: missing page ${href}`);
    if (url.hash) assert.ok(target('[id]').toArray().some(node => target(node).attr('id') === decodeURIComponent(url.hash.slice(1))), `${route}: missing fragment ${href}`);
    internalLinks++;
  });
}
const references = [];
for (const document of loadDocuments()) {
  const $ = urls.get(document.route)!;
  if (document.source.endsWith('.md')) references.push(assertReferencePreservation(document.source, readCanonical(document.source), $('article.prose').html()!));
  assert.equal($('[data-pagefind-body]').length, 1);
  assert.equal($('nav[aria-label="Table of contents"]').length, 1);
  assert.equal($('nav[aria-label="Breadcrumb"] [aria-current="page"]').length, 1);
}
for (const entry of registry.values()) assert.ok(urls.has(entry.route), `Missing route ${entry.route}`);
for (const [index, source] of chapterSources.entries()) {
  const $ = urls.get(registry.get(source)!.route)!;
  for (const [rel, offset] of [['prev', -1], ['next', 1]] as const) {
    const expected = chapterSources[index + offset];
    assert.equal($(`nav[aria-label="Chapter navigation"] a[rel="${rel}"]`).attr('href'), expected ? registry.get(expected)!.route : undefined);
  }
  assert.equal($('nav[aria-label="Handbook navigation"] [aria-current="page"]').attr('href'), registry.get(source)!.route);
}
for (const part of loadParts()) {
  const $ = urls.get(part.route)!;
  assert.deepEqual($('.curriculum a').map((_, a) => $(a).attr('href')).get(), part.chapters.map(doc => doc.route));
  assert.ok(urls.get('/handbook/')!(`a[href="${part.route}"]`).length);
}
const sitemap = load(readFileSync(resolve(dist, 'sitemap.xml'), 'utf8'), { xml: true });
assert.deepEqual(sitemap('loc').map((_, el) => sitemap(el).text()).get().sort(), [...urls.keys()].filter(route => route !== '/404.html' && route !== '/search/').map(route => `https://msqe.dev${route}`).sort());
assert.ok(!files.some(path => /\.(?:md|ts|py)$/.test(path)), 'No canonical sources or governance files in output');
const issues = loadDocuments().flatMap(doc => doc.issues);
mkdirSync('artifacts', { recursive: true });
writeFileSync('artifacts/reference-census.json', JSON.stringify({ canonical: references.reduce((sum, row) => sum + row.canonical, 0), rendered: references.reduce((sum, row) => sum + row.rendered, 0), rows: references }, null, 2) + '\n');
writeFileSync('artifacts/link-report.json', JSON.stringify({ unresolvedOccurrences: issues.length, unresolvedTargets: new Set(issues.map(issue => issue.target)).size, issues }, null, 2) + '\n');
writeFileSync('artifacts/metadata-census.json', JSON.stringify(metadataCensus(), null, 2) + '\n');
writeFileSync('artifacts/route-census.json', JSON.stringify([...registry.values()], null, 2) + '\n');
const sizes = files.map(path => ({ path: path.slice(dist.length + 1), bytes: statSync(path).size })).sort((a, b) => b.bytes - a.bytes);
writeFileSync('artifacts/build-census.json', JSON.stringify({ pages: pages.length, chapters: chapterSources.length, parts: partSources.length, resources: resourceEntries.length + resourceCollections.length, resourceDocuments: resourceEntries.length, resourceCollections: resourceCollections.length, learningPaths: learningPaths.length, sitemapUrls: sitemap('loc').length, internalLinks, brokenDestinations: 0, distBytes: sizes.reduce((n, file) => n + file.bytes, 0), largestPages: sizes.filter(file => file.path.endsWith('.html')).slice(0, 5), assets: sizes.filter(file => !file.path.endsWith('.html')) }, null, 2) + '\n');
writeFileSync('artifacts/source-preservation.json', JSON.stringify(authenticateSources(), null, 2) + '\n');
console.log(`BUILD SMOKE PASS: ${pages.length} static pages; ${internalLinks} internal links and fragments checked; no broken public links; local search script only.`);
console.log(`LINK REPORT: ${issues.length} explicitly reported occurrences / ${new Set(issues.map(issue => issue.target)).size} deferred source targets. See artifacts/link-report.json.`);
