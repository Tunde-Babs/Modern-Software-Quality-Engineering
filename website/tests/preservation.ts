import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFileSync, lstatSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { repoRoot } from '../src/lib/content/registry.ts';
export const base = 'c2401d4a8a9164d71bfb160508df89957ecf5aec';
// Accepted file additions belong to this checkpoint. Keep `base` above for
// replaying the reviewed URL substitutions against their original source blobs.
const structuralBase = 'ce7acb06288d566ffdf4bcf13f442994c93bcde1';
export const protectedPaths = ['book', 'labs', 'code', 'diagrams', 'docs/02-first-edition-review', 'tools', 'tests', 'CHANGELOG.md', 'LICENSE'];
const git = (...args: string[]) => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
type Mutation = { path: string; beforeBlob: string; afterBlob: string; substitutions: { old: string; new: string; count: number }[] };
const evidence = (name: string) => JSON.parse(readFileSync(resolve(repoRoot, 'website/evidence/web5', name), 'utf8'));
const mutations: Mutation[] = [...evidence('canonical-mutations.json'), ...evidence('f1-canonical-mutations.json')];
const licenses: Record<string, string> = evidence('license-file-hashes.json');
const closureSources: Record<string, string> = evidence('br-source-hashes.json');
export function assertAuthorizedSource(path: string, original: string, actual: string) {
  if (closureSources[path]) {
    assert.equal(createHash('sha256').update(actual).digest('hex'), closureSources[path], `Authorized closure bytes: ${path}`);
    return;
  }
  let expected = original;
  for (const change of mutations.find(item => item.path === path)?.substitutions ?? []) {
    assert.equal(expected.split(change.old).length - 1, change.count, `Frozen URL population: ${path}`);
    expected = expected.replaceAll(change.old, change.new);
  }
  assert.equal(actual, expected, `Unauthorized canonical mutation: ${path}`);
}
export function authenticateSources() {
  // WEB-5B's explicit URL-only authorization is checked as a transformation of
  // immutable Git content, never as a blanket exemption for a changed chapter.
  // This website check does not alter the separate first_edition_gate baseline.
  const allowed = new Set([...mutations.map(item => item.path), ...Object.keys(licenses), ...Object.keys(closureSources)]);
  for (const command of [['diff', '--name-only', base], ['ls-files', '--others', '--exclude-standard']]) {
    const paths = git(...command, '--', '.', ':(exclude)website').trim().split('\n').filter(Boolean);
    paths.forEach(path => assert.ok(allowed.has(path), `Unauthorized path outside website: ${path}`));
  }
  assert.equal(git('diff', '--cached', '--name-only'), '', 'WEB-5B must remain unstaged');
  assert.equal(git('diff', '--summary', structuralBase, '--', '.', ':(exclude)website'), '', 'Unexpected source mode, deletion or rename');
  const manifest = git('ls-tree', '-r', base, '--', ...protectedPaths);
  const entries = manifest.trimEnd().split('\n').map(line => {
    const [info, path] = line.split('\t');
    return { path, blob: info.split(' ')[2] };
  });
  for (const entry of entries) {
    const path = resolve(repoRoot, entry.path);
    assert.ok(lstatSync(path).isFile() && !lstatSync(path).isSymbolicLink());
    if (entry.path === 'LICENSE') continue;
    const original = git('show', `${base}:${entry.path}`);
    assertAuthorizedSource(entry.path, original, readFileSync(path, 'utf8'));
    const change = mutations.find(item => item.path === entry.path);
    if (change) {
      assert.equal(entry.blob, change.beforeBlob);
      assert.equal(git('hash-object', entry.path).trim(), change.afterBlob);
    } else if (!closureSources[entry.path]) assert.equal(git('hash-object', entry.path).trim(), entry.blob);
  }
  for (const [path, expected] of Object.entries({ ...licenses, ...closureSources })) {
    const file = resolve(repoRoot, path);
    assert.ok(lstatSync(file).isFile() && !lstatSync(file).isSymbolicLink());
    assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), expected, `Reviewed licensing bytes: ${path}`);
  }
  return { base, files: entries.length, manifestSha256: createHash('sha256').update(manifest).digest('hex'), groups: Object.fromEntries(protectedPaths.map(path => [path, entries.filter(entry => entry.path === path || entry.path.startsWith(path + '/')).length])), authorizedCanonicalFiles: mutations.length, authorizedUrlSubstitutions: mutations.reduce((sum, item) => sum + item.substitutions.reduce((n, change) => n + change.count, 0), 0), unauthorizedModifications: 0 };
}
