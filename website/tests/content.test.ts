import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { chapterSource, diagramSource, chapterRoute, discoverChapters, createRegistry, readCanonical, registry, resolveSourceLink, chapterNeighbours } from '../src/lib/content/registry.ts';
import { loadDocuments, parseSource, prepare, serialize, transformLinks } from '../src/lib/content/loader.ts';
import { authenticateSources } from './preservation.ts';
const markdown = readCanonical(chapterSource);
const documents = loadDocuments();
const chapter = documents.find(doc => doc.source === chapterSource)!;
const diagram = documents.find(doc => doc.source === diagramSource)!;

test('discovers 137 canonical chapters across 12 Parts; selects exactly two source files', () => {
  const all = discoverChapters();
  assert.equal(all.length, 137);
  assert.equal(new Set(all.map(path => path.split('/')[1])).size, 12);
  assert.ok(all.includes(chapterSource));
  assert.equal(registry.size, 2);
});
test('extracts all eight metadata fields from the original table', () => {
  assert.deepEqual(chapter.metadata, {
    Part: 'Part I — Foundations of Modern Software Quality Engineering',
    'MQE-BOK domain': 'Domain 1 — Foundations of Modern Software Quality Engineering',
    Chapter: '1', Audience: 'Software Testers, QA Engineers, Automation Engineers, SDETs, Software Engineers, Product Managers, and Engineering Managers',
    Prerequisites: 'None', 'Estimated study time': '90 minutes, plus the practical exercise', Version: '0.1.0', Status: 'Draft',
  });
});
test('rejects filename, H1, chapter metadata and Part numbering disagreements', () => {
  for (const source of [chapterSource.replace('chapter-01-', 'chapter-02-'), chapterSource.replace('part-01-', 'part-02-')]) assert.throws(() => parseSource(source, markdown, 'chapter'), /numbering disagree/);
  for (const text of [markdown.replace('# Chapter 1', '# Chapter 2'), markdown.replace('| Chapter | 1 |', '| Chapter | 2 |')]) assert.throws(() => parseSource(chapterSource, text, 'chapter'), /numbering disagree/);
});
test('rejects missing, duplicate metadata and malformed heading hierarchy', () => {
  assert.throws(() => parseSource(chapterSource, markdown.replace('| Status | Draft |', ''), 'chapter'), /missing metadata field Status/);
  assert.throws(() => parseSource(chapterSource, markdown.replace('| Status | Draft |', '| Status | Draft |\n| Status | Draft |'), 'chapter'), /duplicate metadata/);
  assert.throws(() => parseSource(chapterSource, markdown + '\n# Another H1\n', 'chapter'), /exactly one/);
  assert.throws(() => parseSource(chapterSource, markdown.replace('## Opening Quote', '#### Opening Quote'), 'chapter'), /skipped heading/);
});
test('generates clean routes and rejects duplicate routes and source registrations', () => {
  assert.equal(chapterRoute(chapterSource), '/handbook/part-01/chapter-01-what-is-modern-software-quality-engineering/');
  const entry = registry.get(chapterSource)!;
  assert.throws(() => createRegistry([entry, entry]), /Duplicate source/);
  assert.throws(() => createRegistry([entry, { source: diagramSource, route: entry.route, kind: 'diagram' }]), /Duplicate route/);
  assert.throws(() => chapterRoute('book/bad.md'), /Invalid chapter/);
});
test('preserves source heading order, paragraph text, emphasis, lists, tables, code and references', () => {
  const $ = load(chapter.html);
  const tree = parseSource(chapterSource, markdown, 'chapter').tree;
  const headings: string[] = [], code: string[] = [], inline: string[] = [];
  visit(tree, 'heading', node => { headings.push(toString(node)); });
  visit(tree, 'code', node => { code.push(node.value); });
  visit(tree, 'inlineCode', node => { inline.push(node.value); });
  assert.deepEqual($('h1,h2,h3,h4,h5,h6').not('#footnote-label').map((_, el) => $(el).text()).get(), headings);
  assert.deepEqual($('pre code').map((_, el) => $(el).text().replace(/\n$/, '')).get(), code);
  assert.deepEqual($('code').not('pre code').map((_, el) => $(el).text()).get(), inline);
  const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();
  // Every original paragraph without a rewritten link or footnote marker appears
  // intact, in source order. Linked paragraphs are covered by link assertions.
  const paragraphs: string[] = [];
  visit(tree, 'paragraph', node => {
    let linked = false;
    visit(node, child => { if (['link', 'linkReference', 'footnoteReference'].includes(child.type)) linked = true; });
    if (!linked) paragraphs.push(normalize(toString(node)));
  });
  const output = normalize($.root().text());
  let position = -1;
  for (const paragraph of paragraphs) { position = output.indexOf(paragraph, position + 1); assert.ok(position >= 0, paragraph); }
  for (const tag of ['p','strong','em','ul','ol','blockquote','table','thead','th','td','pre','code','a']) assert.ok($(tag).length, tag);
  const sourceTables: string[][][] = [];
  visit(tree, 'table', node => { sourceTables.push(node.children.map(row => row.children.map(cell => toString(cell)))); });
  assert.deepEqual($('table').toArray().map(table => $(table).find('tr').toArray().map(row => $(row).find('th,td').toArray().map(cell => $(cell).text()))), sourceTables);
  assert.equal($('[data-footnote-ref]').length, 4);
  assert.equal($('[data-footnotes] li').length, 4);
  assert.ok(chapter.html.includes('ISO/IEC 25010:2023'));
});
test('footnotes, backlinks and TOC all target real unique IDs', () => {
  for (const doc of documents) {
    const $ = load(doc.html);
    const ids = $('[id]').map((_, el) => $(el).attr('id')!).get();
    assert.equal(new Set(ids).size, ids.length);
    for (const href of $('a[href^="#"]').map((_, el) => $(el).attr('href')!).get()) assert.ok(ids.includes(decodeURIComponent(href.slice(1))), href);
    for (const entry of doc.toc) assert.ok(ids.includes(entry.id));
  }
});
test('source-relative links resolve from the chapter directory and rewrite to resource routes', () => {
  assert.deepEqual(resolveSourceLink(chapterSource, '../../../diagrams/chapter-01-quality-engineering-model.md'), { source: diagramSource, hash: '' });
  assert.ok(chapter.html.includes('href="/resources/quality-system-model/"'));
  assert.equal(chapter.issues.length, 4);
  assert.equal(new Set(chapter.issues.map(issue => issue.target)).size, 3);
  assert.equal(load(chapter.html)('.unavailable-link').length, 4);
  assert.ok(!/href="[^\"]*(?:\.md|\/book\/|\/chapters\/)/.test(chapter.html));
});
test('unreviewed links, missing targets, fragments, unsafe URLs and boundaries fail clearly', () => {
  const anchors = new Map([[chapterSource, new Set(['section-metadata'])]]);
  const check = (href: string) => transformLinks(prepare(chapterSource, `# Example\n\n[Link](${href})`, 'diagram').tree, chapterSource, anchors);
  for (const href of ['javascript:alert%281%29','data:text/html,test','//evil.example','../missing.md','../../../../LICENSE','chapter-03-understanding-software-quality.md','#missing','https://user:pass@example.com']) assert.throws(() => check(href));
  const doc = prepare(chapterSource, '# Example\n\n[Metadata](#metadata)', 'diagram');
  transformLinks(doc.tree, chapterSource, anchors);
  assert.ok(serialize(doc.tree).includes('href="#section-metadata"'));
  assert.throws(() => readCanonical('docs/02-first-edition-review/FIRST_EDITION_FINDINGS.md'), /boundary/);
});
test('reference-style links resolve and raw HTML cannot execute', () => {
  const doc = prepare(chapterSource, '# Example\n\n[Model][model]\n\n[model]: ../../../diagrams/chapter-01-quality-engineering-model.md\n\n<script>alert(1)</script>\n\n<img src=x onerror=alert(2)>\n\nText <b onclick="alert(3)">safe</b>.', 'diagram');
  transformLinks(doc.tree, chapterSource, new Map());
  const html = serialize(doc.tree);
  assert.ok(html.includes('href="/resources/quality-system-model/"'));
  assert.ok(!/script|onclick|onerror|<img/.test(html));
  assert.ok(html.includes('Text safe.'));
});
test('diagram contract preserves Mermaid source and its textual interpretation without execution', () => {
  assert.equal(diagram.mermaid, true);
  assert.ok(diagram.html.includes('language-mermaid'));
  assert.ok(diagram.html.includes('The arrows describe connected influence, not a one-way project sequence.'));
  assert.ok(!diagram.html.includes('<script'));
  assert.equal(diagram.issues.length, 0);
});
test('table headers and overflow regions are accessible, code remains selectable text', () => {
  for (const doc of documents) {
    const $ = load(doc.html);
    assert.equal($('th:not([scope="col"])').length, 0);
    assert.equal($('.table-scroll[tabindex="0"][role="region"][aria-label]').length, $('table').length);
    assert.equal($('pre[tabindex="0"][aria-label]').length, $('pre').length);
  }
});
test('previous/next respects discovery order without skipping omitted chapters', () => {
  const neighbours = chapterNeighbours(chapterSource);
  assert.equal(neighbours.previous, null);
  assert.equal(neighbours.next?.available, null);
  assert.ok(neighbours.next?.label.startsWith('chapter 02'));
  const nextSource = discoverChapters()[1];
  const expanded = new Map(registry).set(nextSource, { source: nextSource, route: chapterRoute(nextSource), kind: 'chapter' });
  assert.equal(chapterNeighbours(chapterSource, discoverChapters(), expanded).next?.available?.route, chapterRoute(nextSource));
});
test('all protected canonical files match exact base Git blobs after rendering', () => {
  const evidence = authenticateSources();
  assert.ok(evidence.files > 137);
  assert.equal(evidence.unauthorizedModifications, 0);
  console.log('SOURCE PRESERVATION', JSON.stringify(evidence));
});
