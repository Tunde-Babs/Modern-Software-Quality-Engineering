import assert from 'node:assert/strict';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import { visit } from 'unist-util-visit';
import { toString } from 'mdast-util-to-string';
import { load } from 'cheerio';
import type { FootnoteDefinition } from 'mdast';

const parser = unified().use(remarkParse).use(remarkGfm);
const normalize = (text: string) => text.replace(/\s+/g, ' ').trim();

// Structural expectation comes from canonical AST definitions, including those
// without citation markers. It never derives expected entries from rendered HTML.
export function assertReferencePreservation(source: string, markdown: string, html: string) {
  const tree = parser.parse(markdown);
  const definitions: FootnoteDefinition[] = [];
  const citations = new Set<string>();
  visit(tree, 'footnoteDefinition', node => { definitions.push(node); });
  visit(tree, 'footnoteReference', node => { citations.add(node.identifier.toUpperCase()); });
  const $ = load(html);
  const entries = $('[id^="user-content-fn-"]');
  assert.equal(entries.length, definitions.length, `${source}: canonical/rendered reference count`);
  for (const definition of definitions) {
    const id = `user-content-fn-${encodeURIComponent(definition.identifier.toUpperCase().toLowerCase())}`;
    const entry = entries.filter((_, el) => $(el).attr('id') === id);
    assert.equal(entry.length, 1, `${source}: reference ${definition.identifier} must appear exactly once`);
    const body = entry.clone();
    body.find('[data-footnote-backref]').remove();
    assert.equal(normalize(body.text()), normalize(toString(definition)), `${source}: reference text ${definition.identifier}`);
    for (const [type, tag] of [['emphasis','em'], ['strong','strong'], ['inlineCode','code']] as const) {
      const values: string[] = [];
      visit(definition, type, node => { values.push(toString(node)); });
      assert.deepEqual(body.find(tag).map((_, el) => $(el).text()).get(), values, `${source}: ${type} in ${definition.identifier}`);
    }
    const links: { text: string; href: string }[] = [];
    visit(definition, 'link', node => { links.push({ text: toString(node), href: node.url }); });
    // The canonical bibliography uses external links. Internal destination
    // rewriting is separately enforced by the established link smoke check.
    for (const link of links.filter(link => /^https?:/.test(link.href))) {
      assert.ok(body.find('a').toArray().some(el => $(el).attr('href') === link.href && $(el).text() === link.text), `${source}: reference URL ${link.href}`);
    }
  }
  const uncited = definitions.filter(node => !citations.has(node.identifier.toUpperCase()));
  assert.deepEqual(entries.filter((_, el) => !$(el).closest('[data-footnotes]').length).map((_, el) => $(el).attr('id')).get(), uncited.map(node => `user-content-fn-${encodeURIComponent(node.identifier.toUpperCase().toLowerCase())}`), `${source}: uncited reference source order`);
  return { source, canonical: definitions.length, rendered: entries.length, cited: definitions.length - uncited.length, uncited: uncited.length };
}
