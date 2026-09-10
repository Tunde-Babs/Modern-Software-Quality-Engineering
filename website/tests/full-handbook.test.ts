import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { chapterSources, partSources, registry, resourceEntries, chapterNeighbours, readCanonical, discoverChapters, resolveSourceLink, unavailableSources, companionSources } from '../src/lib/content/registry.ts';
import { loadDocuments, loadParts, metadataCensus, parseSource } from '../src/lib/content/loader.ts';
const documents = loadDocuments();
test('complete deterministic chapter and Part route contract', () => {
  assert.deepEqual(chapterSources, discoverChapters());
  assert.equal(chapterSources.length, 137);
  assert.equal(partSources.length, 12);
  assert.equal(new Set(chapterSources.map(source => registry.get(source)!.route)).size, 137);
  assert.equal(new Set(partSources.map(source => registry.get(source)!.route)).size, 12);
  assert.deepEqual(loadParts().flatMap(part => part.chapters.map(doc => doc.source)), chapterSources);
  assert.deepEqual(loadParts().map(part => part.number), Array.from({ length: 12 }, (_, i) => i + 1));
});
test('all metadata validates, including hours and minute ranges', () => {
  const census = metadataCensus();
  assert.equal(census.chapters, 137);
  for (const key of ['missing','duplicate','numberingMismatches','unexpectedFields','estimatedTimeIssues'] as const) assert.deepEqual(census[key], []);
  assert.deepEqual(census.statuses, { Draft: 137 });
  assert.deepEqual(census.rows.find(row => row.source.includes('part-11-') && row.metadata.Chapter === '12')!.estimatedMinutes, { min: 360, max: 600 });
});
test('all 136 sequential transitions, within and across Parts, are reciprocal', () => {
  let boundaries = 0;
  chapterSources.forEach((source, i) => {
    const n = chapterNeighbours(source);
    assert.equal(n.previous?.available?.source, chapterSources[i - 1]);
    assert.equal(n.next?.available?.source, chapterSources[i + 1]);
    if (i && source.split('/')[1] !== chapterSources[i - 1].split('/')[1]) boundaries++;
  });
  assert.equal(boundaries, 11);
  assert.equal(chapterNeighbours(chapterSources[0]).previous, null);
  assert.equal(chapterNeighbours(chapterSources.at(-1)!).next, null);
});
test('resource discovery excludes dependencies, generated output and governance', () => {
  assert.equal(resourceEntries.length, 103);
  assert.equal(resourceEntries.filter(e => e.kind === 'code' && e.source.endsWith('README.md')).length, 5);
  assert.equal(resourceEntries.filter(e => e.kind === 'diagram').length, 11);
  assert.equal(resourceEntries.filter(e => e.kind === 'lab').length, 1);
  assert.equal(resourceEntries.filter(e => e.kind === 'case-study').length, 3);
  assert.equal(resourceEntries.filter(e => e.kind === 'exercise').length, 8);
  assert.ok(resourceEntries.every(e => !/(node_modules|\.build|package-lock|gitignore)/.test(e.source) && (!e.source.includes('/docs/') || companionSources.includes(e.source))));
});
test('full corpus preserves headings, code and inline code without executing code assets', () => {
  for (const doc of documents) {
    const $ = load(doc.html);
    if (!doc.source.endsWith('.md')) {
      assert.equal($('pre code').text(), readCanonical(doc.source) + '\n');
      assert.equal($('script,iframe').length, 0);
      continue;
    }
    const tree = parseSource(doc.source, readCanonical(doc.source), doc.kind).tree;
    const headings: string[] = [], code: string[] = [], inline: string[] = [];
    visit(tree, 'heading', n => { headings.push(toString(n)); });
    visit(tree, 'code', n => { code.push(n.value); });
    // Footnotes render in citation order, not definition order. Preserve body
    // order and independently compare the complete inline-code population.
    visit({ ...tree, children: tree.children.filter(n => n.type !== 'footnoteDefinition') }, 'inlineCode', n => { inline.push(n.value); });
    assert.deepEqual($('h1,h2,h3,h4,h5,h6').not('#footnote-label').map((_, el) => $(el).text()).get(), headings, doc.source);
    assert.deepEqual($('pre code').map((_, el) => $(el).text().replace(/\n$/, '')).get(), code, doc.source);
    assert.deepEqual($('code').not('pre code, [data-footnotes] code').map((_, el) => $(el).text()).get(), inline, doc.source);
    const allInline: string[] = [];
    visit(tree, 'inlineCode', n => { allInline.push(n.value); });
    assert.deepEqual($('code').not('pre code').map((_, el) => $(el).text()).get().sort(), allInline.sort(), doc.source);
  }
});
test('unavailable links are bounded, classified, and never hide published chapters', () => {
  const issues = documents.flatMap(doc => doc.issues);
  assert.ok(issues.length > 0);
  for (const issue of issues) {
    assert.ok(unavailableSources.has(issue.target));
    assert.ok(!registry.has(issue.target));
    assert.ok(['A','B','C','D'].includes(issue.category));
    assert.equal(resolveSourceLink(issue.source, issue.href).source, issue.target);
  }
});
