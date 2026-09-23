import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseSource } from '../src/lib/content/loader.ts';
import { registry, readCanonical, repoRoot } from '../src/lib/content/registry.ts';

const fixture = (rows: string) => `# Example\n\n| Metadata | Detail |\n| --- | --- |\n${rows}\n\n## Purpose\n\nBody.\n`;
const parse = (markdown: string) => parseSource('future-case-study.md', markdown, 'case-study');
test('every dynamically discovered case study has valid Version metadata', () => {
  const cases = [...registry.values()].filter(entry => entry.kind === 'case-study');
  assert.ok(cases.length > 0, 'Case-study population must not silently disappear');
  for (const entry of cases) assert.doesNotThrow(() => parseSource(entry.source, readCanonical(entry.source), entry.kind));
});
test('case-study Version accepts semantic versions and an explicit Metadata heading', () => {
  for (const version of ['0.1.0', '1.2.3', '1.0.0-rc.1+build.2']) {
    const text = fixture(`| **Version** | ${version} |`);
    assert.doesNotThrow(() => parse(text));
    assert.doesNotThrow(() => parse(text.replace('# Example\n\n', '# Example\n\n## Metadata\n\n')));
  }
});
test('case-study Version rejects missing, blank, malformed and duplicate fields', () => {
  for (const rows of ['| Status | Draft |', '| Version | |', '| Version | latest |',
    '| Version | 1.2 |', '| Version | 01.2.3 |', '| Version | 1.2.3-01 |',
    '| Version | 0.1.0 |\n| **Version** | 0.1.0 |']) {
    assert.throws(() => parse(fixture(rows)), /case-study Version/);
  }
});
test('body Version cannot substitute for case-study metadata', () => {
  assert.throws(() => parse('# Example\n\n## Purpose\n\n' + fixture('| Version | 0.1.0 |').split('\n\n')[1]), /metadata table/);
  assert.doesNotThrow(() => parseSource('exercise.md', fixture('| Status | Draft |'), 'exercise'));
});

// Take the actual authoritative metadata prefix, including its separators,
// plain field labels and heading. The template body is authoring guidance;
// use a normal document body to isolate the metadata contract under test.
const templatePrefix = readFileSync(resolve(repoRoot, 'templates/CASE_STUDY_TEMPLATE.md'), 'utf8').split('# Overview')[0];
const templateCase = templatePrefix.replace('| Version | |', '| Version | 0.1.0 |') + '## Purpose\n\nBody.\n';
test('authoritative template separator and Metadata heading accept valid Version', () => {
  assert.match(templatePrefix, /\n---\n\n## Metadata\n/);
  assert.match(templatePrefix, /\| Version \| \|/);
  assert.doesNotThrow(() => parse(templateCase));
  // Reproduce AG1R1V-15 on every existing valid metadata table, unchanged.
  for (const entry of registry.values()) {
    if (entry.kind !== 'case-study') continue;
    const text = readCanonical(entry.source);
    const boundary = text.indexOf('\n\n');
    const templateLayout = text.slice(0, boundary) + '\n\n---\n\n## Metadata' + text.slice(boundary);
    assert.doesNotThrow(() => parseSource(entry.source, templateLayout, entry.kind));
  }
});
test('template layout still rejects missing, invalid, duplicate and body-only Version', () => {
  for (const value of [templateCase.replace('| Version | 0.1.0 |\n', ''),
    templateCase.replace('0.1.0', 'banana'),
    templateCase.replace('| Version | 0.1.0 |', '| Version | 0.1.0 |\n| Version | 0.1.0 |'),
    templateCase.replace('| Version | 0.1.0 |\n', '') + '\n| Field | Value |\n| --- | --- |\n| Version | 0.1.0 |\n']) {
    assert.throws(() => parse(value), /case-study Version/);
  }
  assert.throws(() => parse(templateCase.replace('## Metadata', '## Purpose')), /metadata table/);
});
