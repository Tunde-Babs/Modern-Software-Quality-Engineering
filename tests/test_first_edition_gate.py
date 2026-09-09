"""FTR-2 author tests. All negative mutations are in memory or temporary repos."""
import contextlib
import hashlib
import importlib.util
import io
import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('gate', ROOT / 'tools/first_edition_gate.py')
gate = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gate)


def events(ids=('001', '002')):
    return ('\n'.join('## Event FE-EV-' + i + ' — example\n| **Event ID** | `FE-EV-' + i + '` |' for i in ids)
            + '\n## 4. Event index\n| Event ID | Date |\n| --- | --- |\n'
            + '\n'.join('| `FE-EV-' + i + '` | 2026-09-06 |' for i in ids) + '\n')


def findings(open_count=15):
    text = ''
    for i in range(1, 30):
        status, verification = ('OPEN', 'NOT VERIFIED') if i <= open_count else ('CLOSED', 'VERIFIED')
        text += ('### FE-G-%03d — Example\n| **Status** | `%s` |\n| **Verification** | `%s` |\n' % (i, status, verification))
    text += '### 8.2 Canonical current 15-finding allocation\n| Package | Historical origin | Finding IDs | Execution disposition | Dependency / verification retained |\n| --- | --- | --- | --- | --- |\n'
    cursor = 1
    for package, count in gate.PACKAGES.items():
        ids = ' · '.join('FE-G-%03d' % i for i in range(cursor, cursor+count))
        text += '| **%s** | H | %s | FE-REQUIRED | evidence |\n' % (package, ids)
        cursor += count
    return text


class IntegrityTests(unittest.TestCase):
    def assertFails(self, result, fragment=None):
        self.assertEqual(result['status'], 'FAIL', result)
        if fragment:
            self.assertIn(fragment, result['message'])

    def test_events_pass_and_dynamic_maximum(self):
        result = gate.event_check(events(tuple('%03d' % i for i in range(1, 42))))
        self.assertEqual(result['status'], 'PASS')
        self.assertEqual(result['observed']['maximum_id'], 'FE-EV-041')

    def test_duplicate_event_body(self):
        self.assertFails(gate.event_check(events().replace('## 4.', '## Event FE-EV-002 — duplicate\n| **Event ID** | `FE-EV-002` |\n## 4.')), 'Duplicate body')

    def test_missing_event_index_row(self):
        self.assertFails(gate.event_check(events().replace('| `FE-EV-002` | 2026-09-06 |', '')), 'missing index')

    def test_duplicate_event_index(self):
        self.assertFails(gate.event_check(events() + '| `FE-EV-002` | date |\n'), 'Duplicate index')

    def test_missing_event_body(self):
        self.assertFails(gate.event_check(events() + '| `FE-EV-003` | date |\n'), 'missing body')

    def test_malformed_event_ids(self):
        for ids in [('001', '02'), ('001', '000'), ('001', 'ABC'), ('001', '0002')]:
            with self.subTest(ids=ids):
                self.assertFails(gate.event_check(events(ids)), 'Malformed')

    def test_non_contiguous_and_reordered_events(self):
        for ids in [('001', '003'), ('002', '001')]:
            self.assertFails(gate.event_check(events(ids)), 'continuous')

    def test_event_field_disagrees(self):
        self.assertFails(gate.event_check(events().replace('| **Event ID** | `FE-EV-002` |', '| **Event ID** | `FE-EV-003` |')), 'field')

    def test_missing_event_section(self):
        with self.assertRaises(gate.EvidenceMissing):
            gate.event_check('')

    def test_findings_and_allocation_pass(self):
        records, result = gate.finding_checks(findings())
        self.assertEqual(result['status'], 'PASS', result)
        self.assertEqual(result['observed'], {'total': 29, 'distribution': {
            'OPEN / NOT VERIFIED': 15, 'CLOSED / VERIFIED': 14}})
        allocation = gate.allocation_check(findings(), records)
        self.assertEqual(allocation['status'], 'PASS', allocation)
        self.assertEqual(allocation['observed'], {'packages': {
            'LR-1': 0, 'LR-2': 0, 'FE-1': 6, 'FE-2': 5, 'FE-3': 4},
            'total': 15, 'open_count': 15})

    def test_preclosure_finding_census_rejected(self):
        for stale_count in (18, 20):
            with self.subTest(stale_count=stale_count):
                self.assertFails(gate.finding_checks(findings(open_count=stale_count))[1], 'census')

    def test_finding_count_mismatch(self):
        text = findings().replace('### FE-G-029', '### Removed')
        self.assertFails(gate.finding_checks(text)[1], 'census')

    def test_invalid_lifecycle(self):
        for original, replacement in [('`OPEN`', '`CLOSED`'), ('`NOT VERIFIED`', '`VERIFIED`')]:
            self.assertFails(gate.finding_checks(findings().replace(original, replacement, 1))[1], 'Invalid lifecycle')

    def test_missing_duplicate_unknown_fields_and_ids(self):
        for text in [findings().replace('| **Verification** | `NOT VERIFIED` |', '', 1),
                     findings().replace('`OPEN`', '`UNKNOWN`', 1),
                     findings().replace('### FE-G-002', '### FE-G-001', 1),
                     findings().replace('### FE-G-002', '### FE-Z-002', 1),
                     findings().replace('| **Status** | `OPEN` |', '| **Status** | `OPEN` |\n| **Status** | `OPEN` |', 1)]:
            self.assertFails(gate.finding_checks(text)[1])

    def allocation(self, old, new):
        text = findings()
        prefix, table = text.split('### 8.2', 1)
        modified = prefix + '### 8.2' + table.replace(old, new, 1)
        records, _ = gate.finding_checks(modified)
        return gate.allocation_check(modified, records)

    def test_duplicate_allocation(self):
        self.assertFails(self.allocation('FE-G-002', 'FE-G-001'), 'multiplicity')

    def test_omitted_allocation(self):
        self.assertFails(self.allocation(' · FE-G-002', ''), 'FE-G-002 observed 0')

    def test_closed_finding_allocated(self):
        self.assertFails(self.allocation('FE-G-002', 'FE-G-029'), 'Non-open')

    def test_closed_finding_in_completed_package(self):
        self.assertFails(self.allocation('**LR-1** | H |  |',
                                         '**LR-1** | H | FE-G-029 |'), 'Non-open')

    def test_stale_lr2_allocation_rejected(self):
        self.assertFails(self.allocation('**LR-2** | H |  |',
                                         '**LR-2** | H | FE-G-016 · FE-G-017 · FE-G-018 |'),
                         'package cardinalities differ')

    def test_empty_and_malformed_outstanding_allocation(self):
        ids = ' · '.join('FE-G-%03d' % i for i in range(1, 7))
        self.assertFails(self.allocation(ids, ''), 'FE-G-001 observed 0')
        for replacement in [ids + ' · ', ' · ' + ids, '—']:
            with self.subTest(replacement=replacement):
                self.assertFails(self.allocation(ids, replacement), 'Unknown/malformed')

    def test_unknown_finding_allocated(self):
        self.assertFails(self.allocation('FE-G-002', 'FE-G-099'), 'Unknown')

    def test_unknown_package(self):
        self.assertFails(self.allocation('**LR-1**', '**LR-9**'), 'Unknown')

    def test_manifests_success_and_mismatches(self):
        records = {'book/b.md': 'b'*40, 'book/a.md': 'a'*40}
        expected = hashlib.sha256(('book/a.md:' + 'a'*40 + '\nbook/b.md:' + 'b'*40 + '\n').encode()).hexdigest()
        self.assertEqual(gate.digest(records), expected)
        for name in ('chapter_manifest', 'part_readme_manifest'):
            with self.subTest(name=name):
                self.assertEqual(gate.manifest_check(name, {'index': records}, 2, expected)['status'], 'PASS')
                self.assertFails(gate.manifest_check(name, {'index': records}, 2, '0'*64))
                self.assertFails(gate.manifest_check(name, {'index': records}, 3, expected))

    def test_baseline_evolution_preserves_all_layer_checks(self):
        old = {'book/a.md': 'a'*40}
        accepted = {'book/a.md': 'b'*40}
        layers = {'HEAD': old, 'index': old, 'working_tree': accepted}
        result = gate.manifest_check('chapter_manifest', layers, 1, gate.digest(accepted))
        self.assertFails(result, 'HEAD population/blob identity mismatch')
        self.assertIn('index population/blob identity mismatch', result['message'])
        self.assertNotIn('working_tree population/blob identity mismatch', result['message'])
        for layer in layers:
            with self.subTest(layer=layer):
                drift = {name: accepted for name in layers}
                drift[layer] = old
                self.assertFails(gate.manifest_check('chapter_manifest', drift, 1,
                                                     gate.digest(accepted)), layer + ' population/blob identity mismatch')

    def test_protected_scope(self):
        self.assertEqual(gate.scope_check(['tools/a.py'], ['tools/a.py'])['status'], 'PASS')
        self.assertFails(gate.scope_check(['book/protected.md'], ['tools/a.py']), 'book/protected.md')

    def test_all_exit_codes_and_precedence(self):
        for statuses, expected in [(['PASS'], 0), (['FAIL'], 1), (['ERROR'], 2), (['INCOMPLETE'], 3),
                                   (['FAIL', 'INCOMPLETE'], 1), (['FAIL', 'ERROR'], 2)]:
            self.assertEqual(gate.report('baseline', [gate.check('x', status=s) for s in statuses])['exit_code'], expected)

    def invoke(self, args):
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            code = gate.main(args)
        return code, json.loads(output.getvalue())

    def test_invalid_cli_arguments(self):
        for args in [[], ['--profile', 'wrong'], ['--profile', 'batch', '--wat'],
                     ['--prof', 'batch'], ['--profile', 'batch', '--allow-path', '../book'],
                     ['--profile', 'batch', '--allow-path', 'book/*'],
                     ['--profile', 'batch', '--allow-path', '/book/a'],
                     ['--profile', 'batch', '--format', 'yaml']]:
            code, result = self.invoke(['--format', 'json'] + args)
            self.assertEqual(code, 2)
            self.assertIn('DOES NOT', result['semantic_acceptance_disclaimer'])

    def test_unexpected_exception_is_error_json(self):
        with patch.object(gate, 'run', side_effect=RuntimeError('fixture error')):
            code, result = self.invoke(['--profile', 'baseline', '--format=json'])
        self.assertEqual(code, 2)
        self.assertEqual(result['overall_deterministic_result'], 'ERROR')

    def test_incomplete_profiles_and_batch_scope(self):
        with patch.object(gate, 'manifests', return_value=[]), patch.object(gate, 'read_evidence', side_effect=lambda r, f: events() if 'LOG' in f else findings()):
            for profile in gate.PROFILES:
                result = gate.report(profile, gate.run(ROOT, profile, []))
                self.assertEqual(result['exit_code'], 0 if profile == 'baseline' else 3, result)

    def test_missing_evidence_returns_three(self):
        with patch.object(gate, 'manifests', return_value=[]), patch.object(gate, 'read_evidence', side_effect=gate.EvidenceMissing('missing')):
            self.assertEqual(gate.report('baseline', gate.run(ROOT, 'baseline', []))['exit_code'], 3)


class TemporaryGitTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='msqe-ftr2-test-')
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.git('init', '-q')
        self.git('config', 'user.email', 'fixture@example.invalid')
        self.git('config', 'user.name', 'FTR-2 fixture')
        self.git('config', 'commit.gpgsign', 'false')
        self.git('config', 'core.autocrlf', 'false')
        self.write('tracked.txt', 'initial\n')
        self.write('rename me.txt', 'rename\n')
        self.write('book/part-01-test/chapters/chapter-01-test.md', 'chapter\n')
        self.write('book/part-01-test/README.md', 'part\n')
        self.git('add', '--', 'tracked.txt', 'rename me.txt', 'book')
        self.git('commit', '-qm', 'fixture only')

    def git(self, *args):
        return gate.git(self.root, *args)

    def write(self, name, text):
        path = self.root / name
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text)

    def test_staged_unstaged_untracked_and_rename(self):
        self.assertEqual(gate.changed_paths(self.root), [])
        self.write('tracked.txt', 'staged\n')
        self.git('add', '--', 'tracked.txt')
        self.write('tracked.txt', 'initial\n')
        self.git('mv', '--', 'rename me.txt', 'renamed.txt')
        self.write('new folder/untracked.txt', 'new\n')
        expected = ['new folder/untracked.txt', 'rename me.txt', 'renamed.txt', 'tracked.txt']
        actual = gate.changed_paths(self.root)
        self.assertEqual(actual, expected)
        self.assertEqual(gate.scope_check(actual, ['tracked.txt'])['status'], 'FAIL')

    def test_manifest_working_and_index_drift_are_visible(self):
        before = gate.manifests(self.root)
        chapter = 'book/part-01-test/chapters/chapter-01-test.md'
        self.write(chapter, 'changed\n')
        changed = gate.manifests(self.root)
        self.assertNotEqual(before[0]['observed']['working_tree'], changed[0]['observed']['working_tree'])
        self.assertEqual(before[0]['observed']['index'], changed[0]['observed']['index'])
        self.git('add', '--', chapter)
        self.write(chapter, 'chapter\n')
        staged = gate.manifests(self.root)
        self.assertNotEqual(before[0]['observed']['index'], staged[0]['observed']['index'])
        self.assertEqual(before[0]['observed']['working_tree'], staged[0]['observed']['working_tree'])
        self.write('book/part-01-test/README.md', 'changed part\n')
        self.assertNotEqual(before[1]['observed']['working_tree'], gate.manifests(self.root)[1]['observed']['working_tree'])

    def test_deleted_and_added_controlled_files(self):
        (self.root / 'book/part-01-test/README.md').unlink()
        self.write('book/part-02-test/chapters/chapter-02-test.md', 'extra\n')
        results = gate.manifests(self.root)
        self.assertEqual(results[0]['observed']['working_tree']['count'], 2)
        self.assertEqual(results[1]['observed']['working_tree']['count'], 0)

    def test_git_diff_hygiene_staged_and_unstaged(self):
        self.write('tracked.txt', 'trailing   \n')
        results = gate.run(self.root, 'batch', ['tracked.txt'])
        self.assertEqual(next(c for c in results if c['name'] == 'diff_hygiene')['status'], 'FAIL')
        self.git('add', '--', 'tracked.txt')
        results = gate.run(self.root, 'batch', ['tracked.txt'])
        self.assertEqual(next(c for c in results if c['name'] == 'diff_cached_hygiene')['status'], 'FAIL')

    def test_symlink_controlled_path_rejected(self):
        path = self.root / 'book/part-01-test/README.md'
        path.unlink()
        path.symlink_to(self.root / 'tracked.txt')
        with self.assertRaises(gate.ConfigurationError):
            gate.manifests(self.root)


if __name__ == '__main__':
    unittest.main()
