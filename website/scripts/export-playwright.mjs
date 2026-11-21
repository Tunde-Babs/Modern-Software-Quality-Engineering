import { mkdir, readFile, writeFile, rm } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { load } from 'cheerio';
import { learningManifest, learningSources } from '../../labs/playwright-atlas/learning-content.mjs';

// Export explicit teaching assets only. The Node simulator API is never published.
const companion = new URL('../../labs/playwright-atlas/', import.meta.url);
const output = new URL('../dist/labs/playwright/', import.meta.url);
const prefix = '/labs/playwright/';
const sourceRoute = route => `${prefix}sources${route}.txt`;
const write = async (path, content) => {
  const url = new URL(path, output);
  await mkdir(dirname(fileURLToPath(url)), { recursive: true });
  await writeFile(url, content);
};
const replace = (text, from, to) => {
  if (!text.includes(from)) throw new Error(`Companion export contract changed: ${from}`);
  return text.replaceAll(from, to);
};
await rm(new URL('sources/', output), { recursive: true, force: true });
const manifest = await learningManifest();
for (const lesson of manifest.lessons) {
  for (const key of ['document', 'starter', 'solution']) lesson[key] = sourceRoute(lesson[key]);
}
for (const doc of manifest.documents) doc.document = sourceRoute(doc.document);
for (const source of manifest.sources) source.route = sourceRoute(source.route);
await write('manifest.json', JSON.stringify(manifest));
for (const [route, source] of learningSources) await write(`sources${route}.txt`, await readFile(new URL(source, companion)));

for (const asset of ['styles.css', 'learn.css', 'lesson-renderer.js', 'products.json']) {
  await write(`assets/${asset}`, await readFile(new URL(`app/${asset}`, companion)));
}
let shop = await readFile(new URL('app/app.js', companion), 'utf8');
shop = replace(shop, "import { createWorkspaceClient } from '/workspace-client.js';", '');
shop = replace(shop, "const workspaceId = new URLSearchParams(location.search).get('workspace');", 'const workspaceId = null;');
shop = replace(shop, 'const backend = workspaceId ? createWorkspaceClient(workspaceId) : null;', 'const backend = null;');
shop = replace(shop, "'/products.json'", `'${prefix}assets/products.json'`);
await write('assets/app.js', shop);
let bench = await readFile(new URL('app/learn.js', companion), 'utf8');
bench = replace(bench, "'/lesson-renderer.js'", `'${prefix}assets/lesson-renderer.js'`);
bench = replace(bench, "'/learning/manifest.json'", `'${prefix}manifest.json'`);
bench = replace(bench, "'/learning/bridge.ts'", `'${sourceRoute('/learning/bridge.ts')}'`);
const start = bench.indexOf("$('create-practice').addEventListener");
const end = bench.indexOf("$('practice-state').addEventListener", start);
if (start < 0 || end < start) throw new Error('Advanced practice handler export contract changed');
bench = bench.slice(0, start) + bench.slice(end);
await write('assets/learn.js', bench);

for (const [name, file, title] of [
  ['learn', 'learn.html', 'Playwright lab bench'], ['shop', 'index.html', 'Playwright practice shop'],
]) {
  const $ = load(await readFile(new URL(`app/${file}`, companion), 'utf8'));
  const route = `${prefix}${name}/`;
  $('title').text(`${title} | MSQE`);
  $('head').append($('<meta name="robots" content="noindex, nofollow">'));
  $('head').append($('<meta name="description">').attr('content', `${title}. Read the 27 guides online; run Playwright and advanced API scenarios locally.`));
  $('head').append($('<link rel="canonical">').attr('href', `https://msqe.dev${route}`));
  $('head').append($('<meta property="og:url">').attr('content', `https://msqe.dev${route}`));
  $('head').append('<link rel="icon" href="/favicon.svg" type="image/svg+xml">');
  $('[src], [href]').each((_, element) => {
    const node = $(element);
    const attr = node.attr('src') ? 'src' : 'href';
    const value = node.attr(attr);
    if (value === '/') node.attr(attr, `${prefix}shop/`);
    else if (value?.startsWith('/learn#')) node.attr(attr, `${prefix}learn/${value.slice(6)}`);
    else if (value === '/learn') node.attr(attr, `${prefix}learn/`);
    else if (['/styles.css', '/learn.css', '/learn.js', '/app.js'].includes(value)) node.attr(attr, `${prefix}assets${value}`);
  });
  $('header').prepend('<a href="/labs/playwright/">MSQE Playwright labs</a> ');
  $('footer').empty().append('MSQE Playwright companion · Authored learning examples · <a href="/license/">CC BY 4.0 · Software: Apache-2.0</a>');
  if (name === 'learn') {
    $('#advanced-tools').empty().append('<p class="small">Advanced API scenarios run on your local simulator. Follow Setup, run <code>npm start</code>, then open <code>http://127.0.0.1:4178/learn</code> to create a workspace.</p>');
    $('#starter-details .small').text('Read-only published example. Edit your local checkout to practise.');
    $('.command-block').before('<p class="small">This site displays guides and examples. Playwright commands run in your local checkout, not in this browser.</p>');
  } else {
    $('.intro').append('<p class="notice">Browser practice: fictional sign-in, search and cart. Advanced API and checkout scenarios run locally; see <a href="/labs/playwright/learn/#setup">Setup</a>.</p>');
  }
  await write(`${name}/index.html`, $.html());
}
console.log(`Exported ${manifest.lessons.length} Playwright labs and ${learningSources.size} explicit teaching sources; no public API.`);
