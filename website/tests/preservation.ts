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
const closureSources: Record<string, string> = {
  ...evidence('br-source-hashes.json'),
  // WEB-5LF1: exact WEB-5LV-accepted FE-EV-049 body/index addition;
  // removing those additions reproduces the accepted FE-EV-001–048 bytes.
  'docs/02-first-edition-review/FIRST_EDITION_REVIEW_LOG.md': 'b45af8d74845b06b637371d388f5311abd48e6c4d5e26212a9bcd4c4ef5b2595',
  // Explicitly authorized WEB-5LF1 status identities. Removing only the
  // reviewed WEB-5L status block from each file reproduces HEAD exactly.
  'README.md': '0b8d00e5b4616e936bbd012d8ff1c91bbd1c2021674d38ce384634fbdeb13f40',
  'CURRENT_SPRINT.md': '8c04c95e045fee7cc12dd1368ba59975a4ad92d681dfe14ded9c76cffe7f0bf6',
};
function assertWeb5Source(path: string, original: string, actual: string) {
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
// FE-1R is an exact transition from the integrated WEB-5 baseline. The
// historical URL-only and closure guards above remain the incoming contract.
// FE-1V accepted manuscript bytes; closure-only hashes still require FE-1CV.
type SourceTransition = { baselineBlob: string; fe1vSha256: string; sha256: string; kind: string };
const transitionBytes = readFileSync(resolve(repoRoot, 'website/evidence/fe1/source-transition.json'));
assert.equal(createHash('sha256').update(transitionBytes).digest('hex'), '9cabc171ab12de90fe981fad2ae397bb2507014cc111b733a9e143dba98d9fa2', 'Frozen FE-1 source-transition fixture');
const transition: { sourceBase: string; sources: Record<string, SourceTransition>; preserved: Record<string, string> } = JSON.parse(transitionBytes.toString('utf8'));
assert.equal(transition.sourceBase, '1cf371e1be74cf58ceff0940573a51dd20d717f5');
const transitionedHashes = Object.fromEntries(Object.entries(transition.sources).map(([path, entry]) => [path, entry.sha256]));
function assertFe1Source(path: string, original: string, actual: string) {
  const accepted = transition.sources[path];
  if (!accepted) return assertWeb5Source(path, original, actual);
  const incoming = git('show', `${transition.sourceBase}:${path}`);
  assert.equal(git('rev-parse', `${transition.sourceBase}:${path}`).trim(), accepted.baselineBlob, `FE-1 incoming blob: ${path}`);
  assertWeb5Source(path, original, incoming);
  assert.equal(createHash('sha256').update(actual).digest('hex'), accepted.sha256, `FE-1 exact candidate bytes: ${path}`);
}
// FE-2V accepted the semantic correction; FE-2R closure-only bytes await FE-2CV.
// Authenticate incoming bytes through WEB-5 and FE-1 before accepting exact FE-2 bytes.
type Fe2SourceTransition = { baselineBlob: string; fe2vSha256: string | null; sha256: string; kind: string };
const fe2Bytes = readFileSync(resolve(repoRoot, 'website/evidence/fe2/source-transition.json'));
assert.equal(createHash('sha256').update(fe2Bytes).digest('hex'), '8c5c3c844cdae81d6e14dff6758321c2bf3a981f8503aa5749d0efe70df021e5', 'Frozen FE-2 source-transition fixture');
const fe2: { sourceBase: string; acceptedCorrectionPackageSha256: string; sources: Record<string, Fe2SourceTransition> } = JSON.parse(fe2Bytes.toString('utf8'));
assert.equal(fe2.sourceBase, 'c2175c2e3ae111acfa615bbda19ea8ba53fea201');
assert.equal(fe2.acceptedCorrectionPackageSha256, '2f5cc5c78e1b658982f5a179dd7dffb7831333caa195b1462a6a167a52425244');
const fe2AcceptedManifest = Object.keys(fe2.sources).filter(path => fe2.sources[path].fe2vSha256 !== null).sort().map(path => `${path}:${fe2.sources[path].fe2vSha256}\n`).join('');
assert.equal(createHash('sha256').update(fe2AcceptedManifest).digest('hex'), fe2.acceptedCorrectionPackageSha256, 'Exact FE-2V accepted package');
const fe2Hashes = Object.fromEntries(Object.entries(fe2.sources).map(([path, entry]) => [path, entry.sha256]));
export function assertAuthorizedSource(path: string, original: string, actual: string) {
  const accepted = fe2.sources[path];
  if (!accepted) return assertFe1Source(path, original, actual);
  const incoming = git('show', `${fe2.sourceBase}:${path}`);
  assert.equal(git('rev-parse', `${fe2.sourceBase}:${path}`).trim(), accepted.baselineBlob, `FE-2 incoming blob: ${path}`);
  assertFe1Source(path, original, incoming);
  assert.equal(createHash('sha256').update(actual).digest('hex'), accepted.sha256, `FE-2 exact candidate bytes: ${path}`);
}
export function authenticateSources() {
  // WEB-5B's explicit URL-only authorization is checked as a transformation of
  // immutable Git content, never as a blanket exemption for a changed chapter.
  // This website check does not alter the separate first_edition_gate baseline.
  const allowed = new Set([...mutations.map(item => item.path), ...Object.keys(licenses), ...Object.keys(closureSources), ...Object.keys(transition.sources)]);
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
      // The reviewed WEB-5 output is now the FE-1 input, still checked exactly.
      assert.equal(transition.sources[entry.path]?.baselineBlob ?? git('hash-object', entry.path).trim(), change.afterBlob);
    } else if (!closureSources[entry.path] && !transition.sources[entry.path]) assert.equal(git('hash-object', entry.path).trim(), entry.blob);
  }
  for (const [path, expected] of Object.entries({ ...licenses, ...closureSources, ...transitionedHashes, ...transition.preserved, ...fe2Hashes })) {
    const file = resolve(repoRoot, path);
    assert.ok(lstatSync(file).isFile() && !lstatSync(file).isSymbolicLink());
    assert.equal(createHash('sha256').update(readFileSync(file)).digest('hex'), expected, `Reviewed licensing bytes: ${path}`);
  }
  return { base, files: entries.length, manifestSha256: createHash('sha256').update(manifest).digest('hex'), groups: Object.fromEntries(protectedPaths.map(path => [path, entries.filter(entry => entry.path === path || entry.path.startsWith(path + '/')).length])), authorizedCanonicalFiles: mutations.length, authorizedUrlSubstitutions: mutations.reduce((sum, item) => sum + item.substitutions.reduce((n, change) => n + change.count, 0), 0), acceptedFe1Chapters: Object.keys(transition.sources).filter(path => path.startsWith('book/')).length, exactTransitionSources: Object.keys(transition.sources).length, acceptedFe2Chapters: Object.keys(fe2.sources).filter(path => path.startsWith('book/')).length, exactFe2TransitionSources: Object.keys(fe2.sources).length, unauthorizedModifications: 0 };
}
