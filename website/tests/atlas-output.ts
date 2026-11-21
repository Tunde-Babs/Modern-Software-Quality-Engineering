import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { load } from 'cheerio';

const root = resolve('dist');
const prefix = '/labs/playwright/';
const read = (path: string) => readFileSync(resolve(root, '.' + path), 'utf8');
const manifest = JSON.parse(read(`${prefix}manifest.json`));

test('static publication contains the complete explicit 27-lab teaching set', () => {
  assert.equal(manifest.lessons.length, 27);
  assert.equal(new Set(manifest.lessons.map((lesson: { id: string }) => lesson.id)).size, 27);
  for (const [index, lesson] of manifest.lessons.entries()) {
    assert.ok(lesson.id.startsWith(String(index + 1).padStart(2, '0') + '-'));
    assert.match(read(lesson.document), new RegExp(`^# Lab ${index + 1} `));
    assert.match(read(lesson.starter), /test\(/);
    assert.match(read(lesson.solution), /test\(/);
  }
  for (const source of manifest.sources) assert.ok(read(source.route).length > 0);
  for (const document of manifest.documents) assert.ok(read(document.document).length > 0);
});

test('interactive views retain metadata, inert source display and same-origin assets', () => {
  for (const name of ['learn', 'shop']) {
    const route = `${prefix}${name}/`;
    const $ = load(read(`${route}index.html`));
    assert.equal($('h1').length, 1);
    assert.equal($('meta[name="robots"]').attr('content'), 'noindex, nofollow');
    assert.equal($('link[rel="canonical"]').attr('href'), `https://msqe.dev${route}`);
    assert.equal($('meta[property="og:url"]').attr('content'), `https://msqe.dev${route}`);
    assert.equal($('script').length, 1);
    assert.equal($('script:not([src]),iframe,object,embed').length, 0);
    assert.equal($('footer a[href="/license/"]').length, 1);
    $('[src],link[rel="stylesheet"]').each((_, element) => {
      const value = $(element).attr('src') ?? $(element).attr('href')!;
      assert.ok(value.startsWith(prefix));
      assert.ok(read(value).length > 0);
    });
    for (const element of $('*').toArray()) assert.ok(Object.keys('attribs' in element ? element.attribs : {}).every(key => !/^on/i.test(key)));
  }
  assert.match(read(`${prefix}assets/learn.js`), /\.textContent = source/);
  assert.ok(!read(`${prefix}assets/learn.js`).includes("fetch('/api/"));
  assert.ok(!read(`${prefix}assets/app.js`).includes('createWorkspaceClient'));
  assert.match(read(`${prefix}assets/app.js`), /const backend = null;/);
});

test('export publishes only approved sources, assets and views, without simulator endpoints', () => {
  const walk = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap(e => e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]);
  const files = walk(resolve(root, '.' + prefix)).map(file => file.slice(root.length));
  const expected = [
    `${prefix}index.html`, `${prefix}learn/index.html`, `${prefix}shop/index.html`, `${prefix}manifest.json`,
    ...['styles.css', 'learn.css', 'lesson-renderer.js', 'products.json', 'app.js', 'learn.js'].map(name => `${prefix}assets/${name}`),
    ...new Set([...manifest.documents.map((doc: { document: string }) => doc.document),
      ...manifest.lessons.flatMap((lesson: { starter: string; solution: string }) => [lesson.starter, lesson.solution]),
      ...manifest.sources.map((source: { route: string }) => source.route), `${prefix}sources/learning/bridge.ts.txt`]),
  ];
  assert.deepEqual(files.sort(), expected.sort());
  assert.ok(!files.some(file => /server-api|server\.mjs|SCOPE|VALIDATION|\.env|node_modules|\/api\//.test(file)));
});
