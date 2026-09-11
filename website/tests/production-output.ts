import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';
import { load } from 'cheerio';

// Separate output checks: never rebuild or infer the expected mode from HTML.
const production = process.env.MSQE_TEST_MODE === 'production';
const root = resolve('dist');
const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]);
const files = walk(root);
const pages = new Map(files.filter(p => p.endsWith('.html')).map(p => ['/' + p.slice(root.length + 1).replace(/index\.html$/, ''), load(readFileSync(p, 'utf8'), { scriptingEnabled: false })]));
const read = (name: string) => readFileSync(resolve(root, name), 'utf8');

test(`${production ? 'production indexability' : 'preview noindex'} across every HTML page`, () => {
  let indexed = 0;
  for (const [route, $] of pages) {
    const expected = production && !['/404.html', '/search/'].includes(route) ? 'index, follow' : 'noindex, nofollow';
    assert.equal($('meta[name="robots"]').length, 1);
    assert.equal($('meta[name="robots"]').attr('content'), expected, route);
    if (expected === 'index, follow') indexed++;
  }
  assert.equal(indexed, production ? 260 : 0);
});

test('robots agrees with the selected mode and advertises the apex sitemap', () => {
  assert.equal(read('robots.txt'), `User-agent: *\n${production ? 'Allow: /\nDisallow: /search/\n' : 'Disallow: /\n'}Sitemap: https://msqe.dev/sitemap.xml\n`);
});

test('every canonical and Open Graph URL uses HTTPS apex without host leakage', () => {
  for (const [route, $] of pages) {
    assert.equal($('link[rel="canonical"]').length, 1);
    for (const value of [$('link[rel="canonical"]').attr('href'), $('meta[property="og:url"]').attr('content')]) {
      assert.equal(value, `https://msqe.dev${route}`);
      assert.ok(!/localhost|127\.0\.0\.1|pages\.dev|www\.msqe\.dev/.test(value!));
    }
  }
});

test('sitemap is the complete unique public page set, excluding search and 404', () => {
  const $ = load(read('sitemap.xml'), { xml: true });
  const urls = $('loc').map((_, el) => $(el).text()).get();
  assert.equal(urls.length, 260);
  assert.equal(new Set(urls).size, urls.length);
  assert.deepEqual(urls.sort(), [...pages.keys()].filter(p => !['/search/', '/404.html'].includes(p)).map(p => `https://msqe.dev${p}`).sort());
  assert.ok(urls.every(url => !/\/docs\/00-project\/|\/docs\/02-first-edition-review\/|localhost|pages\.dev/.test(url)));
});

test('generated license and site-wide attribution preserve the controlled RC and rights boundary', () => {
  const $ = pages.get('/license/')!;
  const text = $('main').text();
  for (const phrase of ['Copyright © 2026 Babatunde Ajala', 'CC BY 4.0', 'Apache-2.0', 'retain their respective rights', 'MSQE v0.16.0', 'LEARNING-READY — CONTROLLED RC']) assert.ok(text.includes(phrase), phrase);
  for (const [, page] of pages) {
    assert.equal(page('footer a[href="/license/"]').length, 1);
    assert.match(page('footer').text(), /CC BY 4\.0.*Apache-2\.0/s);
    assert.match(page('header').text(), /MSQE v0\.16\.0/);
  }
});

test('production build contract retains static Astro, locked dependencies, Pagefind and the verified toolchain', () => {
  execFileSync(process.execPath, ['scripts/check-toolchain.mjs']);
  const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
  const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
  assert.equal(lock.lockfileVersion, 3);
  assert.equal(pkg.scripts['build:production'], 'MSQE_INDEXING=production npm run build');
  assert.match(pkg.scripts.build, /astro build && pagefind --site dist && node scripts\/prune-search.mjs/);
  assert.match(readFileSync('astro.config.mjs', 'utf8'), /output: 'static'/);
  for (const path of ['_worker.js', '_routes.json', 'functions']) assert.ok(!existsSync(resolve(root, path)));
  assert.equal(JSON.parse(read('pagefind/pagefind-entry.json')).languages.en.page_count, 258);
});

test('all referenced browser assets are local, present, and contain no embedded executable integration', () => {
  for (const [route, $] of pages) {
    $('script[src],link[rel="stylesheet"],link[rel="icon"],img[src],source[src]').each((_, el) => {
      const href = $(el).attr('src') ?? $(el).attr('href')!;
      const url = new URL(href, `https://msqe.dev${route}`);
      assert.equal(url.origin, 'https://msqe.dev');
      assert.ok(existsSync(resolve(root, '.' + url.pathname)), `${route}: ${href}`);
    });
    assert.equal($('script:not([src]),iframe,object,embed').length, 0);
    assert.equal($('script').length, route === '/search/' ? 1 : 0);
    for (const el of $('*').toArray()) assert.ok(Object.keys('attribs' in el ? el.attribs : {}).every(key => !/^on/i.test(key)), `${route}: inline handler`);
  }
  for (const asset of ['favicon.svg', 'favicon.ico', 'search.js', 'pagefind/pagefind.js', 'pagefind/pagefind-worker.js', 'pagefind/wasm.en.pagefind']) assert.ok(existsSync(resolve(root, asset)));
  assert.ok(!files.some(p => /\.(?:map|md|ts|py)$/.test(p)));
});

test('static 404 has four valid recovery routes and remains nonindexable', () => {
  const $ = pages.get('/404.html')!;
  assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow');
  for (const route of ['/', '/handbook/', '/resources/', '/search/']) {
    assert.ok(pages.has(route));
    assert.ok($(`main a[href="${route}"]`).length);
  }
});

test('every internal link and fragment resolves, including noscript and absolute apex links', () => {
  let count = 0;
  for (const [route, $] of pages) {
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href')!;
      const url = new URL(href, `https://msqe.dev${route}`);
      if (url.origin !== 'https://msqe.dev') return;
      const target = pages.get(url.pathname);
      assert.ok(target, `${route}: missing ${href}`);
      if (url.hash) assert.ok(target('[id]').toArray().some(node => target(node).attr('id') === decodeURIComponent(url.hash.slice(1))), `${route}: missing fragment ${href}`);
      count++;
    });
  }
  assert.equal(count, 13588, '13,587 default-DOM links plus one noscript fallback link');
});

test('Pages headers are copied exactly and retain WASM support without script unsafe-eval', () => {
  assert.equal(read('_headers'), readFileSync('public/_headers', 'utf8'));
  const headers = read('_headers');
  assert.match(headers, /script-src 'self' 'wasm-unsafe-eval'/);
  assert.ok(!headers.includes("'unsafe-eval'"));
  for (const policy of ['X-Content-Type-Options: nosniff', "frame-ancestors 'none'", 'X-Frame-Options: DENY', 'Referrer-Policy:', 'Permissions-Policy:', 'https://msqe.dev/*\n  Strict-Transport-Security: max-age=86400']) assert.ok(headers.includes(policy), policy);
  assert.ok(!headers.includes('includeSubDomains') && !headers.includes('preload'));
});
