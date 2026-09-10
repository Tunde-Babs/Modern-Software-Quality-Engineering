import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { repoRoot } from '../src/lib/content/registry.ts';
import { assertAuthorizedSource, base } from './preservation.ts';

test('WEB-5B accepts exact frozen substitutions and rejects prose or URL drift', () => {
  const changes = JSON.parse(readFileSync(resolve(repoRoot, 'website/evidence/web5/canonical-mutations.json'), 'utf8'));
  for (const change of changes) {
    const original = execFileSync('git', ['show', `${base}:${change.path}`], { cwd: repoRoot, encoding: 'utf8' });
    const actual = readFileSync(resolve(repoRoot, change.path), 'utf8');
    assert.doesNotThrow(() => assertAuthorizedSource(change.path, original, actual));
    assert.throws(() => assertAuthorizedSource(change.path, original, actual + '\nUnauthorized prose\n'));
    assert.throws(() => assertAuthorizedSource(change.path, original, original));
  }
  assert.throws(() => assertAuthorizedSource('book/unlisted.md', 'unchanged', 'changed'));
});

test('licensing states founder identity, split scope, official terms and third-party boundary', () => {
  const read = (path: string) => readFileSync(resolve(repoRoot, path), 'utf8');
  const scope = read('LICENSE');
  assert.match(scope, /Copyright © 2026 Babatunde Ajala/);
  assert.match(scope, /CC-BY-4\.0/);
  assert.match(scope, /Apache-2\.0/);
  assert.match(scope, /They do not relicense third-party/);
  assert.match(scope, /Mixed files and generated views/);
  assert.match(read('LICENSE-CONTENT'), /https:\/\/creativecommons.org\/licenses\/by\/4\.0\/legalcode.en/);
  assert.match(read('LICENSE-CODE'), /TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION/);
  assert.match(read('LICENSE-CODE'), /END OF TERMS AND CONDITIONS/);
  assert.doesNotMatch(read('website/src/pages/license.astro'), /Tunde Ajala|Reuse terms are being finalized/);
});
