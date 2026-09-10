import { existsSync, readdirSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
export const chapterSource = 'book/part-01-foundations/chapters/chapter-01-what-is-modern-software-quality-engineering.md';
export const diagramSource = 'diagrams/chapter-01-quality-engineering-model.md';
export type Entry = { source: string; route: string; kind: 'chapter' | 'part' | 'diagram' | 'lab' | 'case-study' | 'exercise' | 'code' };

export function discoverChapters(root = resolve(repoRoot, 'book')): string[] {
  return readdirSync(root, { withFileTypes: true }).flatMap(part => {
    if (!part.isDirectory() || !/^part-\d{2}-/.test(part.name)) return [];
    return readdirSync(resolve(root, part.name, 'chapters'))
      .filter(name => /^chapter-\d{2}-.+\.md$/.test(name))
      .map(name => `book/${part.name}/chapters/${name}`);
  }).sort();
}

export function chapterRoute(source: string): string {
  const match = /^book\/part-(\d{2})-[a-z0-9-]+\/chapters\/(chapter-\d{2}-[a-z0-9-]+)\.md$/.exec(source);
  if (!match) throw new Error(`Invalid chapter source path: ${source}`);
  return `/handbook/part-${match[1]}/${match[2]}/`;
}

export function createRegistry(entries: Entry[]): Map<string, Entry> {
  const routes = new Set<string>();
  const registry = new Map<string, Entry>();
  for (const entry of entries) {
    if (registry.has(entry.source)) throw new Error(`Duplicate source: ${entry.source}`);
    if (routes.has(entry.route)) throw new Error(`Duplicate route: ${entry.route}`);
    if (!/^\/(?:handbook|resources)\/[a-z0-9/-]+\/$/.test(entry.route)
      || /\/(?:book|chapters)\//.test(entry.route)) throw new Error(`Invalid public route: ${entry.route}`);
    if (entry.kind === 'chapter' && chapterRoute(entry.source) !== entry.route) throw new Error(`Chapter route disagrees with source: ${entry.source}`);
    routes.add(entry.route);
    registry.set(entry.source, entry);
  }
  return registry;
}

export const chapterSources = discoverChapters();
export const partSources = [...new Set(chapterSources.map(source => source.split('/').slice(0, 2).join('/') + '/README.md'))];
if (chapterSources.length !== 137 || partSources.length !== 12) throw new Error('Expected 137 chapters in 12 Parts');
for (const [index, part] of partSources.entries()) {
  if (Number(/part-(\d+)/.exec(part)?.[1]) !== index + 1) throw new Error(`Invalid Part order: ${part}`);
  const chapters = chapterSources.filter(source => source.startsWith(dirname(part) + '/'));
  chapters.forEach((source, n) => { if (Number(/chapter-(\d+)/.exec(source)?.[1]) !== n + 1) throw new Error(`Non-contiguous chapter sequence: ${source}`); });
}
export const partRoute = (source: string) => `/handbook/part-${/part-(\d{2})-/.exec(source)![1]}/`;

// Only explicit learner directories are traversed. Dependencies, build products,
// governance, review records, and project administration never enter discovery.
function walk(source: string): string[] {
  if (!existsSync(resolve(repoRoot, source))) return [];
  return readdirSync(resolve(repoRoot, source), { withFileTypes: true }).flatMap(entry => {
    if (entry.name.startsWith('.') || entry.name === 'node_modules' || entry.name === 'docs') return [];
    const path = `${source}/${entry.name}`;
    return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : [];
  }).sort();
}
export function discoverResources(): Entry[] {
  const entries: Entry[] = [];
  for (const part of partSources) {
    for (const [folder, kind] of [['labs', 'lab'], ['case-studies', 'case-study'], ['exercises', 'exercise']] as const) {
      for (const source of walk(`${dirname(part)}/${folder}`).filter(p => p.endsWith('.md'))) {
        entries.push({ source, kind, route: `/resources/part-${/part-(\d{2})/.exec(part)![1]}/${folder}/${source.split('/').at(-1)!.slice(0, -3)}/` });
      }
    }
  }
  for (const source of walk('diagrams').filter(p => p.endsWith('.md'))) entries.push({ source, kind: 'diagram', route: source === diagramSource ? '/resources/quality-system-model/' : `/resources/diagrams/${source.split('/').at(-1)!.slice(0, -3)}/` });
  for (const source of walk('code').filter(p => /^code\/part-02-programming\/[^/]+\/(?:README\.md|(?:src|test|fixtures)\/.+\.(?:ts|json)|(?:package|tsconfig)\.json)$/.test(p))) {
    const slug = source.replace('code/part-02-programming/', '').replace(/README\.md$/, '').replaceAll('.', '-').replace(/\/$/, '').replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    entries.push({ source, kind: 'code', route: `/resources/code/part-02/${slug}/` });
  }
  return entries;
}
export const resourceEntries = discoverResources();
export const registry = createRegistry([
  ...chapterSources.map(source => ({ source, route: chapterRoute(source), kind: 'chapter' as const })),
  ...partSources.map(source => ({ source, route: partRoute(source), kind: 'part' as const })),
  ...resourceEntries,
]);
export const unavailableSources = new Map<string, { category: 'A' | 'B' | 'C' | 'D'; reason: string }>([
  ['docs/00-project/QA_TO_QE_TRANSITION_FRAMEWORK.md', { category: 'C', reason: 'Project framework is outside the learner publication boundary' }],
  ...['delivery-04-collaborative-tested-utilities/docs/pull-request-description.md', 'delivery-04-collaborative-tested-utilities/docs/review-comments.md', 'delivery-04-collaborative-tested-utilities/docs/change-plan.md', 'delivery-04-collaborative-tested-utilities/docs/expected-commit-plan.md', 'capstone-quality-engineering-toolkit/docs/limitations-and-residual-risk.md', 'capstone-quality-engineering-toolkit/docs', 'delivery-04-collaborative-tested-utilities/test'].map(path => [`code/part-02-programming/${path}`, { category: 'A' as const, reason: 'Delivered companion material; not yet routed' }] as const),
]);
export const deferredSources = new Set(unavailableSources.keys());

export function readCanonical(source: string): string {
  if (!/^(book|diagrams|code|labs)\/.+\.(md|ts|json)$/.test(source) || source.includes('..')) throw new Error(`Source outside content boundary: ${source}`);
  const path = realpathSync(resolve(repoRoot, source));
  const allowedRoot = realpathSync(resolve(repoRoot, source.split('/')[0]));
  if (!path.startsWith(allowedRoot + sep)) throw new Error(`Source escapes canonical root: ${source}`);
  return readFileSync(path, 'utf8');
}

export function resolveSourceLink(source: string, href: string): { source: string; hash: string } {
  if (href.includes('?') || href.startsWith('/') || href.includes('\\')) throw new Error(`Unsupported internal URL in ${source}: ${href}`);
  const hashAt = href.indexOf('#');
  const path = hashAt < 0 ? href : href.slice(0, hashAt);
  const hash = hashAt < 0 ? '' : decodeURIComponent(href.slice(hashAt + 1));
  const target = path ? relative(repoRoot, resolve(repoRoot, dirname(source), decodeURIComponent(path))).split(sep).join('/') : source;
  if (target.startsWith('../') || target === '..') throw new Error(`Source escapes repository: ${href}`);
  // Explicit omissions must still exist. No arbitrary docs or missing paths are accepted.
  if (unavailableSources.has(target)) {
    const actual = realpathSync(resolve(repoRoot, target));
    if (!actual.startsWith(realpathSync(repoRoot) + sep)) throw new Error(`Source escapes repository: ${href}`);
  } else if (registry.has(`${target}/README.md`)) {
    readCanonical(`${target}/README.md`);
    return { source: `${target}/README.md`, hash };
  } else readCanonical(target);
  return { source: target, hash };
}

// Neighbours are drawn from the full discovery order, never skip omitted chapters.
export function chapterNeighbours(source: string, all = discoverChapters(), routes = registry) {
  const index = all.indexOf(source);
  if (index < 0) throw new Error(`Undiscovered chapter: ${source}`);
  const neighbour = (path: string | undefined) => path ? { available: routes.get(path) ?? null, label: readCanonical(path).split('\n')[0].replace(/^# /, '') } : null;
  return { previous: neighbour(all[index - 1]), next: neighbour(all[index + 1]) };
}
