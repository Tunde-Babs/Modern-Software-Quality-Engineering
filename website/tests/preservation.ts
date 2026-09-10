import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
import { repoRoot } from '../src/lib/content/registry.ts';
export const base = '89e8b65cb2e96d77103292d5bba119304602c04b';
export const protectedPaths = ['book', 'labs', 'code', 'diagrams', 'docs/02-first-edition-review', 'tools', 'tests', 'CHANGELOG.md', 'LICENSE'];
const git = (...args: string[]) => execFileSync('git', args, { cwd: repoRoot, encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
export function authenticateSources() {
  assert.equal(git('diff', '--name-only', base, '--', '.', ':(exclude)website'), '', 'Unauthorized tracked change outside website');
  assert.equal(git('ls-files', '--others', '--exclude-standard', '--', '.', ':(exclude)website'), '', 'Unauthorized untracked file outside website');
  const manifest = git('ls-tree', '-r', base, '--', ...protectedPaths);
  const entries = manifest.trimEnd().split('\n').map(line => {
    const [info, path] = line.split('\t');
    return { path, blob: info.split(' ')[2] };
  });
  const hashes = execFileSync('git', ['hash-object', '--stdin-paths'], { cwd: repoRoot, input: entries.map(entry => entry.path).join('\n') + '\n', encoding: 'utf8' }).trim().split('\n');
  assert.equal(hashes.length, entries.length);
  entries.forEach((entry, index) => assert.equal(hashes[index], entry.blob, `Canonical mutation: ${entry.path}`));
  assert.equal(git('diff', '--name-only', base, '--', ...protectedPaths), '', 'Protected tracked path or mode changed');
  assert.equal(git('ls-files', '--others', '--exclude-standard', '--', ...protectedPaths), '', 'Unexpected protected untracked source');
  return { base, files: entries.length, manifestSha256: createHash('sha256').update(manifest).digest('hex'), groups: Object.fromEntries(protectedPaths.map(path => [path, entries.filter(entry => entry.path === path || entry.path.startsWith(path + '/')).length])), unauthorizedModifications: 0 };
}
