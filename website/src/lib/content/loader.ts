import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import GithubSlugger from 'github-slugger';
import { visit } from 'unist-util-visit';
import { toString as mdText } from 'mdast-util-to-string';
import { toString as htmlText } from 'hast-util-to-string';
import type { Root as MdRoot, Table } from 'mdast';
import type { Root as HtmlRoot, Element } from 'hast';
import { readCanonical, registry, resourceCollections, deferredSources, unavailableSources, partSources, partRoute, chapterSources, resolveSourceLink, type Entry } from './registry.ts';

const parser = unified().use(remarkParse).use(remarkGfm);
const fields = ['Part', 'MQE-BOK domain', 'Chapter', 'Audience', 'Prerequisites', 'Estimated study time', 'Version', 'Status'] as const;
export type Metadata = Record<typeof fields[number], string>;
export type TocEntry = { id: string; label: string; level: number };
export type LinkIssue = { source: string; href: string; target: string; reason: string; category: 'A' | 'B' | 'C' | 'D' };
export type Document = Entry & { title: string; metadata: Metadata | null; html: string; toc: TocEntry[]; issues: LinkIssue[]; mermaid: boolean };

export function parseSource(source: string, markdown: string, kind: Entry['kind']) {
  const tree = parser.parse(markdown);
  const headings = tree.children.filter(node => node.type === 'heading' && node.depth === 1);
  if (headings.length !== 1 || tree.children[0] !== headings[0]) throw new Error(`${source}: expected exactly one leading H1`);
  const title = mdText(headings[0]);
  let metadata: Metadata | null = null;
  if (kind === 'chapter') {
    const index = tree.children.findIndex(node => node.type === 'heading' && node.depth === 2 && mdText(node) === 'Metadata');
    const table = tree.children[index + 1];
    if (index < 0 || table?.type !== 'table') throw new Error(`${source}: missing Markdown metadata table`);
    const rows = (table as Table).children.slice(1).map(row => row.children.map(cell => mdText(cell).trim()));
    const data: Record<string, string> = {};
    for (const [key, value] of rows) {
      if (key in data) throw new Error(`${source}: duplicate metadata field ${key}`);
      data[key] = value;
    }
    for (const field of fields) if (!data[field]) throw new Error(`${source}: missing metadata field ${field}`);
    metadata = data as Metadata;
    const file = /\/chapter-(\d{2})-/.exec(source);
    const h1 = /^Chapter (\d+)\s+[—–-]\s+/.exec(title);
    if (!file || !h1 || !/^\d+$/.test(metadata.Chapter) || Number(file[1]) !== Number(h1[1]) || Number(file[1]) !== Number(metadata.Chapter)) throw new Error(`${source}: filename, H1 and metadata chapter numbering disagree`);
    const roman = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    const part = Number(/\/part-(\d{2})-/.exec(source)?.[1]);
    if (!roman[part] || !metadata.Part.startsWith(`Part ${roman[part]} — `)) throw new Error(`${source}: Part metadata and directory numbering disagree`);
  }
  let previous = 0;
  visit(tree, 'heading', node => {
    if (node.depth > previous + 1) throw new Error(`${source}: skipped heading level at ${mdText(node)}`);
    previous = node.depth;
  });
  return { tree, title, metadata };
}

function renderTree(tree: MdRoot): HtmlRoot {
  // Raw HTML is not enabled: content never becomes executable Astro/MDX.
  // remark-rehype normally drops uncited footnote definitions. In canonical
  // chapters these are bibliography entries, so retain their block content at
  // its source position. Cited definitions keep the existing footer/backlinks.
  const cited = new Set<string>();
  visit(tree, 'footnoteReference', node => { cited.add(node.identifier.toUpperCase()); });
  return unified().use(remarkRehype, {
    handlers: {
      footnoteDefinition(state, node) {
        if (cited.has(node.identifier.toUpperCase())) return;
        return {
          type: 'element', tagName: 'div',
          properties: { id: `user-content-fn-${encodeURIComponent(node.identifier.toUpperCase().toLowerCase())}` },
          children: state.all(node),
        };
      },
    },
  }).runSync(tree) as HtmlRoot;
}

export function prepare(source: string, markdown: string, kind: Entry['kind']) {
  const parsed = parseSource(source, markdown, kind);
  const tree = renderTree(parsed.tree);
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];
  visit(tree, 'element', node => {
    if (/^h[1-6]$/.test(node.tagName) && node.properties.id !== 'footnote-label') {
      const label = htmlText(node);
      node.properties.id = `section-${slugger.slug(label)}`;
      if (node.tagName !== 'h1') toc.push({ id: String(node.properties.id), label, level: Number(node.tagName[1]) });
    }
  });
  return { ...parsed, tree, toc };
}

export function transformLinks(tree: HtmlRoot, source: string, anchors: Map<string, Set<string>>, routes = registry, deferred = deferredSources): LinkIssue[] {
  const issues: LinkIssue[] = [];
  visit(tree, 'element', node => {
    if (node.tagName === 'img') throw new Error(`${source}: images require an explicitly registered asset contract`);
    if (node.tagName !== 'a') return;
    const href = String(node.properties.href ?? '');
    if (!href || /[\u0000-\u0020\u007f]/.test(href)) throw new Error(`${source}: unsafe URL ${JSON.stringify(href)}`);
    if (/^[a-z][a-z0-9+.-]*:/i.test(href)) {
      if (!/^https?:\/\//i.test(href)) throw new Error(`${source}: unsafe URL scheme ${href}`);
      const url = new URL(href);
      if (!url.hostname || url.username || url.password) throw new Error(`${source}: unsafe external URL ${href}`);
      return;
    }
    const target = resolveSourceLink(source, href);
    const entry = routes.get(target.source) ?? resourceCollections.find(collection => collection.source === target.source);
    if (!entry) {
      if (!deferred.has(target.source)) throw new Error(`${source}: unresolved internal link ${href}`);
      issues.push({ source, href, target: target.source, ...(unavailableSources.get(target.source) ?? { category: 'A' as const, reason: 'Delivered but not yet routed' }) });
      node.tagName = 'span';
      node.properties = { className: ['unavailable-link'] };
      node.children.push({ type: 'element', tagName: 'small', properties: {}, children: [{ type: 'text', value: ' (not available in this preview)' }] });
      return;
    }
    let hash = target.hash;
    if (hash && !anchors.get(target.source)?.has(hash)) {
      // Canonical GitHub-style fragments map to our namespaced heading IDs.
      if (anchors.get(target.source)?.has(`section-${hash}`)) hash = `section-${hash}`;
      else throw new Error(`${source}: unresolved heading fragment ${href}`);
    }
    node.properties.href = (target.source === source && hash ? '' : entry.route) + (hash ? `#${encodeURIComponent(hash)}` : '');
  });
  return issues;
}

function accessibleBlocks(tree: HtmlRoot) {
  // Retain canonical navigation visually, but keep it out of search snippets.
  let navigation = false;
  for (const node of tree.children) {
    if (node.type !== 'element') continue;
    if (/^h[12]$/.test(node.tagName)) navigation = htmlText(node).trim() === 'Chapter Navigation';
    if (navigation) node.properties.dataPagefindIgnore = true;
  }
  let tableNumber = 0;
  visit(tree, 'element', (node, index, parent) => {
    if (node.tagName === 'input' && node.properties.type === 'checkbox' && parent) {
      node.properties.ariaLabel = htmlText(parent).trim();
    }
    if (node.tagName === 'th') node.properties.scope = 'col';
    if (node.tagName === 'table' && parent && index !== undefined) {
      const label = `Table ${++tableNumber}: ${htmlText(node.children.find(child => child.type === 'element' && child.tagName === 'thead') ?? node)}`;
      parent.children[index] = { type: 'element', tagName: 'div', properties: { className: ['table-scroll'], tabIndex: 0, role: 'region', ariaLabel: label }, children: [node] };
      return [ 'skip', index + 1 ] as const;
    }
    if (node.tagName === 'pre') {
      node.properties.tabIndex = 0;
      node.properties.role = 'region';
      const code = node.children[0] as Element;
      const lang = String(code?.properties?.className ?? '').replace('language-', '') || 'text';
      node.properties.ariaLabel = `${lang} source code`;
    }
  });
  // Table wrapping skips descendants; assign headers in a separate traversal.
  visit(tree, 'element', node => { if (node.tagName === 'th') node.properties.scope = 'col'; });
}

export function serialize(tree: HtmlRoot): string {
  // Sanitization precedes trusted presentation attributes. Preserve generated
  // footnote IDs without double-prefixing; raw HTML and author IDs never enter.
  const sanitized = unified().use(rehypeSanitize, { ...defaultSchema, clobberPrefix: '', attributes: { ...defaultSchema.attributes, span: [...(defaultSchema.attributes?.span ?? []), ['className', 'unavailable-link']] } }).runSync(tree) as HtmlRoot;
  accessibleBlocks(sanitized);
  return unified().use(rehypeStringify).stringify(sanitized);
}

let cachedDocuments: Document[] | undefined;
export function loadDocuments(): Document[] {
  if (cachedDocuments) return cachedDocuments;
  const prepared = [...registry.values()].filter(entry => entry.kind !== 'part').map(entry => {
    const source = readCanonical(entry.source);
    // Code is inert text, constructed as an AST rather than interpolated fences.
    if (!entry.source.endsWith('.md')) {
      const title = entry.source.replace('code/part-02-programming/', '');
      const tree: MdRoot = { type: 'root', children: [
        { type: 'heading', depth: 1, children: [{ type: 'text', value: title }] },
        { type: 'code', lang: entry.source.endsWith('.ts') ? 'typescript' : 'json', value: source },
      ] };
      return { ...entry, title, metadata: null, tree: renderTree(tree), toc: [] as TocEntry[] };
    }
    return { ...entry, ...prepare(entry.source, source, entry.kind) };
  });
  const anchors = new Map(prepared.map(doc => {
    const ids = new Set<string>();
    visit(doc.tree, 'element', node => {
      if (node.properties.id) {
        const id = String(node.properties.id);
        if (ids.has(id)) throw new Error(`${doc.source}: duplicate anchor ${id}`);
        ids.add(id);
      }
    });
    return [doc.source, ids];
  }));
  cachedDocuments = prepared.map(doc => ({
    source: doc.source, route: doc.route, kind: doc.kind, title: doc.title, metadata: doc.metadata, toc: doc.toc,
    issues: transformLinks(doc.tree, doc.source, anchors),
    html: serialize(doc.tree),
    mermaid: readCanonical(doc.source).includes('```mermaid'),
  }));
  return cachedDocuments;
}

type Part = { source: string; route: string; number: number; title: string; description: string; chapters: Document[] };
let cachedParts: Part[] | undefined;
export function loadParts(): Part[] {
  if (cachedParts) return cachedParts;
  const documents = loadDocuments();
  cachedParts = partSources.map((source, index) => {
    const tree = parser.parse(readCanonical(source));
    const titleNode = tree.children[0];
    if (titleNode?.type !== 'heading' || titleNode.depth !== 1) throw new Error(`${source}: missing Part title`);
    const title = mdText(titleNode);
    const roman = ['I','II','III','IV','V','VI','VII','VIII','IX','X','XI','XII'][index];
    if (!title.startsWith(`Part ${roman} `)) throw new Error(`${source}: Part title mismatch`);
    const section = tree.children.findIndex(n => n.type === 'heading' && n.depth === 2 && ['Overview','Mission','Purpose'].includes(mdText(n)));
    const paragraph = tree.children[section + 1];
    const description = section >= 0 && paragraph?.type === 'paragraph' ? mdText(paragraph).split(/(?<=\.)\s+/)[0] : '';
    const chapters = documents.filter(doc => doc.kind === 'chapter' && doc.source.startsWith(source.replace('README.md', 'chapters/')));
    return { source, route: partRoute(source), number: index + 1, title, description, chapters };
  });
  return cachedParts;
}

export function metadataCensus() {
  const rows = chapterSources.map(source => {
    const { metadata } = parseSource(source, readCanonical(source), 'chapter');
    const time = metadata!['Estimated study time'];
    const match = /^(\d+)(?:[–-](\d+))? (minutes?|hours?)\b/.exec(time);
    const factor = match?.[3].startsWith('hour') ? 60 : 1;
    return { source, metadata: metadata!, estimatedMinutes: match ? { min: Number(match[1]) * factor, max: Number(match[2] ?? match[1]) * factor } : null };
  });
  return { chapters: rows.length, missing: [], duplicate: [], numberingMismatches: [],
    unexpectedFields: chapterSources.flatMap(source => {
      const { tree } = parseSource(source, readCanonical(source), 'chapter');
      const i = tree.children.findIndex(n => n.type === 'heading' && mdText(n) === 'Metadata');
      return (tree.children[i + 1] as Table).children.slice(1).flatMap(row => {
        const field = mdText(row.children[0]);
        return fields.includes(field as typeof fields[number]) ? [] : [{ source, field }];
      });
    }),
    estimatedTimeIssues: rows.filter(row => row.estimatedMinutes === null).map(row => ({ source: row.source, value: row.metadata['Estimated study time'] })),
    statuses: rows.reduce<Record<string, number>>((counts, row) => { counts[row.metadata.Status] = (counts[row.metadata.Status] ?? 0) + 1; return counts; }, {}), rows };
}
