import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { loadDocuments, prepare, serialize } from '../src/lib/content/loader.ts';
import { readCanonical, chapterSource } from '../src/lib/content/registry.ts';
import { assertReferencePreservation } from './reference-preservation.ts';

// Frozen from WEB-3V reference-audit.json and authenticated against canonical AST.
const affected = [
  ['book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md', 4, ['pro-git','git-rebase','github-pr','google-review']],
  ['book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md', 5, ['meszaros','feathers']],
  ['book/part-03-software-testing/chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md', 5, ['istqb','google-sre']],
  ['book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md', 2, ['git']],
  ['book/part-07-cloud-devops/chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md', 3, ['nist-cloud','oci','dora']],
] as const;
const documents = loadDocuments();
for (const [source, count, identifiers] of affected) {
  test(`WEB-3F1 restores exact references: ${source}`, () => {
    const doc = documents.find(doc => doc.source === source)!;
    const census = assertReferencePreservation(source, readCanonical(source), doc.html);
    assert.equal(census.canonical, count);
    const $ = load(doc.html);
    for (const identifier of identifiers) assert.equal($(`[id="user-content-fn-${identifier}"]`).length, 1);
  });
}
test('all 137 chapters and published Markdown resources preserve every reference definition', () => {
  const census = documents.filter(doc => doc.source.endsWith('.md')).map(doc => assertReferencePreservation(doc.source, readCanonical(doc.source), doc.html));
  assert.equal(documents.filter(doc => doc.kind === 'chapter').length, 137);
  assert.equal(census.reduce((sum, row) => sum + row.canonical, 0), 378);
  assert.equal(census.reduce((sum, row) => sum + row.rendered, 0), 378);
  assert.equal(census.reduce((sum, row) => sum + row.uncited, 0), 12);
  assert.deepEqual(census.filter(row => row.uncited).map(row => row.source), affected.map(row => row[0]));
});
test('uncited definitions preserve position, continuation blocks, inline formatting and URLs without fake citations', () => {
  const markdown = '# Example\n\nBefore[^used] and again[^USED].\n\n## References\n\n[^unused]: First *emphasis* and **strong**, `code`, [link][url].\n\n    Second paragraph.\n\n    - First list item\n    - Second list item\n\n    > Quoted text.\n\n[^used]: Cited reference.\n\n[^last]: Last reference.\n\n[url]: https://example.com/source\n\n## After\n\nSurrounding content.\n';
  const html = serialize(prepare(chapterSource, markdown, 'diagram').tree);
  const $ = load(html);
  assert.equal($('[id^="user-content-fn-"]').length, 3);
  const unused = $('#user-content-fn-unused');
  assert.equal(unused.find('em').text(), 'emphasis');
  assert.equal(unused.find('strong').text(), 'strong');
  assert.equal(unused.find('code').text(), 'code');
  assert.equal(unused.find('a').attr('href'), 'https://example.com/source');
  assert.equal(unused.find('ul > li').length, 2);
  assert.equal(unused.find('blockquote').text().trim(), 'Quoted text.');
  assert.ok(unused.text().includes('Second paragraph.'));
  assert.equal(unused.prevAll('h2').first().text(), 'References');
  assert.equal($('#user-content-fn-last').nextAll('h2').first().text(), 'After');
  assert.equal($('[data-footnote-ref]').length, 2);
  assert.equal($('[data-footnote-backref]').length, 2);
  assert.equal($('[data-footnotes] li').length, 1);
  assert.equal($('#user-content-fn-used').length, 1);
  assert.equal(unused.find('[data-footnote-backref]').length, 0);
});
