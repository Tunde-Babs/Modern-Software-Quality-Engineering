import test from 'node:test';
import assert from 'node:assert/strict';
import { load } from 'cheerio';
import { loadDocuments, prepare, serialize } from '../src/lib/content/loader.ts';
import { readCanonical, chapterSource } from '../src/lib/content/registry.ts';
import { assertReferencePreservation } from './reference-preservation.ts';

// FE-2V accepted 371 formal references and seven complete supplementary moves.
// Exact per-chapter expectations remain authenticated against canonical AST.
const affected = [
  ['book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md', 4, ['pro-git','git-rebase','github-pr','google-review']],
  ['book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md', 3, ['node-test','node-assert','typescript-docs']],
  ['book/part-03-software-testing/chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md', 3, ['iso-29119-2','iso-25010','swebok-v4-0a']],
  ['book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md', 2, ['git']],
  ['book/part-07-cloud-devops/chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md', 0, []],
] as const;
const supplementary: Record<string, { key: string; text: string; url: string }[]> = {
  "book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md": [
    {
      "key": "meszaros",
      "text": "Gerard Meszaros. xUnit Test Patterns. Addison-Wesley, 2007. Accessed 2026-08-09.",
      "url": "http://xunitpatterns.com/"
    },
    {
      "key": "feathers",
      "text": "Michael Feathers. Working Effectively with Legacy Code. Prentice Hall, 2004. Accessed 2026-08-09.",
      "url": "https://www.oreilly.com/library/view/working-effectively-with/0131177052/"
    }
  ],
  "book/part-03-software-testing/chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md": [
    {
      "key": "istqb",
      "text": "International Software Testing Qualifications Board. Certified Tester Foundation Level Syllabus v4.0.1. 2024. Accessed 2026-08-09.",
      "url": "https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf"
    },
    {
      "key": "google-sre",
      "text": "Google. Postmortem Culture: Learning from Failure. The Site Reliability Workbook. Accessed 2026-08-09.",
      "url": "https://sre.google/workbook/postmortem-culture/"
    }
  ],
  "book/part-07-cloud-devops/chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md": [
    {
      "key": "nist-cloud",
      "text": "National Institute of Standards and Technology. SP 800-145: The NIST Definition of Cloud Computing. 2011.",
      "url": "https://csrc.nist.gov/pubs/sp/800/145/final"
    },
    {
      "key": "oci",
      "text": "Open Container Initiative. Open Container Initiative specifications. Accessed 2026-08-11.",
      "url": "https://opencontainers.org/"
    },
    {
      "key": "dora",
      "text": "Google Cloud. DORA State of DevOps research. Accessed 2026-08-11.",
      "url": "https://cloud.google.com/resources/state-of-devops"
    }
  ]
};
const documents = loadDocuments();
for (const [source, count, identifiers] of affected) {
  test(`FE-2V accepted exact references: ${source}`, () => {
    const doc = documents.find(doc => doc.source === source)!;
    const census = assertReferencePreservation(source, readCanonical(source), doc.html);
    assert.equal(census.canonical, count);
    const $ = load(doc.html);
    for (const identifier of identifiers) assert.equal($(`[id="user-content-fn-${identifier}"]`).length, 1);
    const reading = $('#section-further-reading').nextUntil('#section-references');
    const readingText = reading.text().replace(/\s+/g, ' ').trim();
    for (const source of supplementary[doc.source] ?? []) {
      assert.ok(readingText.includes(source.text), `${doc.source}: complete supplementary attribution`);
      assert.ok(reading.find('a').toArray().some(el => $(el).attr('href') === source.url), `${doc.source}: supplementary URL`);
      assert.equal($(`[id="user-content-fn-${source.key}"]`).length, 0, 'No duplicate orphan definition');
    }
  });
}
test('all 137 chapters and published Markdown resources preserve every reference definition', () => {
  const census = documents.filter(doc => doc.source.endsWith('.md')).map(doc => assertReferencePreservation(doc.source, readCanonical(doc.source), doc.html));
  assert.equal(documents.filter(doc => doc.kind === 'chapter').length, 137);
  assert.equal(census.reduce((sum, row) => sum + row.canonical, 0), 371);
  assert.equal(census.reduce((sum, row) => sum + row.rendered, 0), 371);
  assert.equal(census.reduce((sum, row) => sum + row.uncited, 0), 0);
  assert.deepEqual(census.filter(row => row.uncited).map(row => row.source), []);
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
