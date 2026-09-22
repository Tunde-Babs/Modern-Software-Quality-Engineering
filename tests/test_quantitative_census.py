"""FE-3 author regressions. These are not independent FE-3V acceptance."""
import importlib.util
import json
from pathlib import Path
import subprocess
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('census', ROOT / 'tools/quantitative_census.py')
q = importlib.util.module_from_spec(spec)
spec.loader.exec_module(q)


def classify(text):
    with tempfile.TemporaryDirectory() as folder:
        path = Path(folder) / 'chapter.md'
        path.write_text(text, encoding='utf-8')
        return q.classify_chapter(path)


def t1(text):
    return [(m['class'], m['text']) for m in classify(text)['matches'] if m['pop'] == 'T1']


class QuantityForms(unittest.TestCase):
    def test_hyphen_unit_numeric_shapes(self):
        for token in ['5-second', '1.2-second', '43,200-minute', '600-second', '30-day']:
            with self.subTest(token=token):
                self.assertEqual(t1(token), [('unit', token)])

    def test_all_closed_units_and_longest_match(self):
        for unit in q.UNIT_FORMS:
            with self.subTest(unit=unit):
                self.assertEqual(t1('30-' + unit), [('unit', '30-' + unit)])

    def test_percent_word_single_digit_and_decimal(self):
        for token in ['2 percent', '8 percent', '95 percent', '0.6 percent', '100%']:
            with self.subTest(token=token):
                self.assertEqual(t1(token), [('pct', token)])

    def test_percentile_and_case_not_widened(self):
        for text in ['95 percentile', '95 percentage', '95 percentiles', '95 Percent', '95 percentx']:
            with self.subTest(text=text):
                self.assertEqual(t1(text), [])

    def test_separator_boundary_not_global(self):
        for text in ['30  seconds', '30 -second', '30- second', '30–second', '30—second', '95  percent', '95-percent', '30-microseconds']:
            with self.subTest(text=text):
                self.assertEqual(t1(text), [])
        self.assertEqual(t1('30seconds'), [('unit', '30seconds')])
        self.assertEqual(t1('30\tseconds'), [('unit', '30\tseconds')])
        self.assertEqual(t1('95\npercent'), [('pct', '95\npercent')])
        self.assertEqual(t1('$-30'), [])

    def test_e12_cannot_remove_new_quantity(self):
        r = classify('HTTP response code after 200-millisecond timeout at 95 percent.')
        self.assertIn(('unit', '200-millisecond'), t1('HTTP response code after 200-millisecond timeout'))
        self.assertEqual(r['tier2'], 0)

    def test_repeated_same_line_positional_disambiguation(self):
        text = 'p95 is not 95 percent; 95 percent again.'
        r = classify(text)
        self.assertEqual([m['start'] for m in r['matches'] if m['pop'] == 'T1'], [11, 23])
        self.assertEqual([m['text'] for m in r['matches'] if m['pop'] == 'T2'], ['95'])

    def test_decimal_and_thousands_overlap_one_prose_match(self):
        self.assertEqual(len(t1('1.2-second 43,200-minute 0.6 percent')), 3)


class IdentifierRouting(unittest.TestCase):
    def test_known_version_contexts(self):
        for text, version in [('Version 4.0', '4.0'), ('version 2026.10.4.', '2026.10.4'),
                              ('NIST CSF 2.0', '2.0'), ('NIST Cybersecurity Framework 2.0', '2.0'),
                              ('OAuth 2.0', '2.0'), ('Semantic Versioning 2.0.0', '2.0.0'),
                              ('Syllabus v4.0.1', 'v4.0.1'), ('SWEBOK v4.0a', 'v4.0a')]:
            with self.subTest(text=text):
                r = classify(text)
                self.assertEqual([x['text'] for x in r['identifiers']], [version])
                self.assertEqual((r['tier1'], r['tier2']), (0, 0))

    def test_version_and_nearby_measurement(self):
        self.assertEqual(t1('OAuth 2.0 has latency 2.0 ms and error 0.6 percent'),
                         [('unit', '2.0 ms'), ('pct', '0.6 percent')])

    def test_explicit_quantity_suffix_protects_measurement(self):
        for text in ['version 4.0 ms', 'version 4.0%', 'version 4.0-second',
                     'version 4.0 percent', 'version 4.0 per second', 'version 4.0/2']:
            with self.subTest(text=text):
                self.assertEqual(classify(text)['identifiers'], [])
                self.assertEqual(len(t1(text)), 1)

    def test_plain_decimal_not_excluded(self):
        self.assertEqual(t1('4.0 and 2.0 and 2026.10.4'), [('dec', '4.0'), ('dec', '2.0'), ('dec', '2026.10')])

    def test_context_and_version_boundaries(self):
        for text in ['conversion 4.0', 'version  4.0', 'framework 2.0', 'av4.0.1', 'version 4.0alpha']:
            with self.subTest(text=text):
                self.assertEqual(classify(text)['identifiers'], [])
        self.assertEqual(classify('VERSION\t4.0')['identifiers'][0]['text'], '4.0')

    def test_labelled_prefixed_overlap_audited_once(self):
        r = classify('version v4.0.1')
        self.assertEqual(len(r['identifiers']), 1)
        self.assertEqual(r['identifiers'][0]['reason'], 'labelled-version')

    def test_e4_keeps_label_e5_excludes_definition(self):
        r = classify('[NIST CSF 2.0](https://example.org/v3.0)\n[^n]: NIST CSF 2.0\n')
        self.assertEqual([x['text'] for x in r['identifiers']], ['2.0'])
        self.assertEqual(r['tier1'], 0)

    def test_preserve_code_populations(self):
        r = classify('`version 4.0`\n```text\nOAuth 2.0\n```\n')
        self.assertEqual(r['identifiers'], [])
        self.assertEqual((r['tier1'], r['tier2'], r['code'], r['inline']), (0, 0, 1, 1))


class PopulationAndCoordinates(unittest.TestCase):
    def test_true_unicode_source_offsets_all_populations(self):
        text = 'é • 5-second `95 percent`\n```text\n36\n```\nversion 4.0\n42 items'
        r = classify(text)
        self.assertEqual({m['pop'] for m in r['matches']}, {'T1', 'T2', 'code-fence', 'inline-code'})
        for m in r['matches'] + r['identifiers']:
            self.assertEqual(text[m['start']:m['end']], m['text'])
            self.assertEqual(text.count('\n', 0, m['start']) + 1, m['line'])
            self.assertEqual(m['start'] - text.rfind('\n', 0, m['start']), m['column'])

    def test_inline_overlap_visible(self):
        r = classify('`1.2-second`')
        self.assertEqual([(m['class'], m['text']) for m in r['matches']], [('unit', '1.2-second'), ('dec', '1.2')])
        self.assertEqual((r['tier1'], r['tier2'], r['inline']), (0, 0, 2))

    def test_no_inline_cross_span_synthetic_claim(self):
        self.assertEqual(classify('`95` and `percent`')['inline'], 0)
        self.assertEqual(classify('`30` `seconds`')['inline'], 0)

    def test_original_exclusions_remain_scoped(self):
        r = classify('# Chapter 3\n| Version | 2.0 |\n[^n]: 30 seconds\nhttps://example.org/95\nRFC 9700\n10:14:02.118\n2026\n')
        self.assertEqual((r['tier1'], r['tier2']), (0, 0))
        self.assertEqual(t1('30 seconds vs 1/2 and $5'), [('unit', '30 seconds'), ('ratio', '1/2'), ('cur', '$5')])

    def test_e11_bounded_quantity_unchanged(self):
        # Preserve the accepted E11 limitation, not an incidental FE-3 repair.
        self.assertEqual(t1('2000 ms'), [])
        self.assertEqual(t1('2000-ms'), [('unit', '2000-ms')])

    def test_cli_backward_detail_and_identifier_json(self):
        with tempfile.TemporaryDirectory() as folder:
            p = Path(folder) / 'book/part-01-example/chapters'; p.mkdir(parents=True)
            (p/'chapter-01-example.md').write_text('Version 4.0 and 5-second', encoding='utf-8')
            cmd = [sys.executable, '-B', str(ROOT/'tools/quantitative_census.py'), '--root', folder]
            j = json.loads(subprocess.check_output(cmd + ['--json'], text=True))
            detail = subprocess.check_output(cmd + ['--detail'], text=True).strip().split('\t')
            self.assertEqual(len(detail), 6)
            self.assertEqual(j['per_part']['I']['tier1'], 1)
            self.assertEqual(len(j['identifiers']), 1)
            self.assertEqual(j['candidates'][0]['text'], '5-second')


if __name__ == '__main__':
    unittest.main()
