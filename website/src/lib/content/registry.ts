import { readdirSync, readFileSync, realpathSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = fileURLToPath(new URL('../../../../', import.meta.url));
export const chapterSource = 'book/part-01-foundations/chapters/chapter-01-what-is-modern-software-quality-engineering.md';
export const diagramSource = 'diagrams/chapter-01-quality-engineering-model.md';
export type Entry = { source: string; route: string; kind: 'chapter' | 'diagram' };

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

export const registry = createRegistry([
  { source: chapterSource, route: chapterRoute(chapterSource), kind: 'chapter' },
  { source: diagramSource, route: '/resources/quality-system-model/', kind: 'diagram' },
]);

// Explicitly bounded omissions. A missing file is still an error. New omissions
// fail until reviewed; these entries do not invent public destinations.
export const deferredSources = new Set([
  'book/part-01-foundations/labs/lab-01-from-testing-a-feature-to-engineering-quality.md',
  'book/part-01-foundations/case-studies/case-study-01-quality-beyond-test-execution.md',
  'book/part-01-foundations/chapters/chapter-02-the-evolution-from-qa-to-quality-engineering.md',
]);

export function readCanonical(source: string): string {
  if (!/^(book|diagrams)\/.+\.md$/.test(source) || source.includes('..')) throw new Error(`Source outside content boundary: ${source}`);
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
  readCanonical(target); // Existence, canonical boundary and symlink checks.
  return { source: target, hash };
}

// Neighbours are drawn from the full discovery order, never skip omitted chapters.
export function chapterNeighbours(source: string, all = discoverChapters(), routes = registry) {
  const index = all.indexOf(source);
  if (index < 0) throw new Error(`Undiscovered chapter: ${source}`);
  const neighbour = (path: string | undefined) => path ? { available: routes.get(path) ?? null, label: path.split('/').at(-1)!.replace('.md', '').replaceAll('-', ' ') } : null;
  return { previous: neighbour(all[index - 1]), next: neighbour(all[index + 1]) };
}
