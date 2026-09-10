import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { load } from 'cheerio';
import { companionSources, resourceCollections, registry, resolveSourceLink } from '../src/lib/content/registry.ts';
import { loadDocuments, loadParts } from '../src/lib/content/loader.ts';
import { learningPaths } from '../src/lib/paths.ts';
import { inventory, classify } from '../scripts/external-links.ts';
const documents = loadDocuments();
test('all seven previously unavailable delivered targets have public destinations', () => {
  const targets = [
    ...companionSources.filter(source => source.includes('delivery-04') || source.endsWith('limitations-and-residual-risk.md')),
    ...resourceCollections.map(collection => collection.source),
  ];
  assert.equal(targets.length, 7);
  for (const source of targets) assert.ok(registry.has(source) || resourceCollections.some(collection => collection.source === source));
  assert.equal(documents.flatMap(doc => doc.issues).filter(issue => issue.category === 'A' || issue.category === 'D').length, 0);
});
test('both directory references resolve to indexes of delivered files', () => {
  for (const collection of resourceCollections) {
    const source = collection.source.split('/').slice(0, 3).join('/') + '/README.md';
    assert.equal(resolveSourceLink(source, collection.source.split('/').at(-1)!).source, collection.source);
    assert.ok(documents.filter(doc => doc.source.startsWith(collection.source + '/')).length > 0);
  }
});
test('reviewed companion allowlist includes nine teaching artifacts and no project governance', () => {
  assert.equal(companionSources.length, 9);
  for (const source of companionSources) {
    assert.ok(source.startsWith('code/part-02-programming/'));
    assert.ok(documents.some(doc => doc.source === source));
  }
  assert.ok(!registry.has('docs/00-project/QA_TO_QE_TRANSITION_FRAMEWORK.md'));
});
test('learning path uses canonical Part I sequence and study estimates without duplicate chapters', () => {
  assert.equal(learningPaths.length, 1);
  assert.deepEqual(learningPaths[0].chapters.map(doc => doc.source), loadParts()[0].chapters.map(doc => doc.source));
  for (const chapter of learningPaths[0].chapters) assert.ok(chapter.metadata?.['Estimated study time']);
});
test('external inventory preserves distinct URLs, fragments, occurrences and domains', () => {
  const report = inventory([{ route: '/a/', html: '<header><a href="https://ignore.test/">ignore</a></header><main><a href="https://example.org/a#one">One</a><a href="https://example.org/a#one">Again</a><a href="https://example.org/a#two">Two</a><a href="/local/">Local</a></main>' }]);
  assert.equal(report.length, 2);
  assert.equal(report[0].occurrences.length, 2);
  assert.equal(report[0].domain, 'example.org');
  assert.equal(report[0].occurrences[0].page, '/a/');
});
test('external HTTP classifications distinguish broken sources from blocked verification', () => {
  assert.equal(classify(200, false), 'VALID');
  assert.equal(classify(200, true), 'REDIRECT');
  assert.equal(classify(404, false), 'BROKEN');
  assert.equal(classify(410, false), 'BROKEN');
  for (const status of [401, 403, 429, 503]) assert.equal(classify(status, false), 'TIMEOUT/UNVERIFIED');
});
test('Pagefind is part of every build and uses only locally generated browser assets', () => {
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  assert.match(pkg.scripts.build, /astro build && pagefind --site dist/);
  const script = readFileSync('public/search.js', 'utf8');
  assert.match(script, /import\('\/pagefind\/pagefind.js'\)/);
  assert.ok(!/localStorage|sessionStorage|document.cookie|https:\/\//.test(script));
});
test('search has a label, live status, keyboard form and a non-JavaScript fallback', () => {
  const $ = load(readFileSync('src/pages/search.astro', 'utf8'));
  assert.equal($('form[role="search"] label').attr('for'), $('input[type="search"]').attr('id'));
  assert.equal($('button[type="submit"]').length, 1);
  assert.equal($('[role="status"][aria-live="polite"]').length, 1);
  assert.equal($('noscript').length, 1);
});
test('favicon is a static original SVG with no external dependencies', () => {
  assert.ok(existsSync('public/favicon.svg'));
  assert.ok(existsSync('public/favicon.ico'));
  const svg = readFileSync('public/favicon.svg', 'utf8');
  assert.match(svg, /viewBox="0 0 64 64"/);
  assert.ok(!/<script|href=/.test(svg));
});
test('SEO uses canonical domain and an explicit opt-in production indexing switch', () => {
  assert.match(readFileSync('astro.config.mjs', 'utf8'), /https:\/\/msqe.dev/);
  const base = readFileSync('src/layouts/Base.astro', 'utf8');
  assert.match(base, /MSQE_INDEXING === 'production'/);
  assert.match(base, /noindex, nofollow/);
  assert.match(readFileSync('src/pages/robots.txt.ts', 'utf8'), /Disallow: \/\\n/);
});
