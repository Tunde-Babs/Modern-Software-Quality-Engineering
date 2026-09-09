#!/usr/bin/env python3
"""Read-only FTR-2 deterministic foundation; never a semantic gate verdict."""
import argparse
from collections import Counter
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys

VERSION = '1.0.0'
DISCLAIMER = ('EXIT 0 DOES NOT CONSTITUTE SEMANTIC ACCEPTANCE, LEARNING-READY '
              'APPROVAL, FIRST EDITION APPROVAL, OR RELEASE APPROVAL.')
MEANINGS = {0: 'implemented deterministic checks passed',
            1: 'deterministic invariant failure / gate blocker',
            2: 'invocation or configuration error',
            3: 'required deterministic evidence incomplete'}
PROFILES = ('batch', 'learning-ready', 'first-edition', 'baseline')
REVIEW = 'docs/02-first-edition-review/'
CHAPTER_DIGEST = 'cd0eea1a66d0bd9f5ea6ae8b27d782ec00ab1722d0d9af14b7ec828bb15d3a52'
PART_DIGEST = '11437d6981fa1c28555ef4ef42b2db9cb369df658d43cdd09f671d47d3d5f0d6'
PACKAGES = {'LR-1': 0, 'LR-2': 3, 'FE-1': 6, 'FE-2': 5, 'FE-3': 4}
FINDING_ID = r'FE-(?:L[1-5]|T[1-6]|G|J)-[0-9]{3}'
EVENT_ID = r'FE-EV-(?:[0-9]{3}|[1-9][0-9]{3,})'


class ConfigurationError(Exception):
    pass


class EvidenceMissing(Exception):
    pass


def check(name, errors=(), expected=None, observed=None, status=None):
    return {'name': name, 'status': status or ('FAIL' if errors else 'PASS'),
            'expected': expected, 'observed': observed,
            'message': '; '.join(errors) if errors else 'Implemented invariant satisfied.'}


def clean(value):
    return value.strip().strip('`*').strip()


def section(text, heading):
    matches = list(re.finditer(r'^' + re.escape(heading) + r'[^\n]*\n', text, re.M))
    if not matches:
        raise EvidenceMissing('Missing required section: ' + heading)
    if len(matches) != 1:
        raise ConfigurationError('Ambiguous repeated section: ' + heading)
    start = matches[0].end()
    level = len(heading.split(' ')[0])
    end = re.search(r'^#{1,' + str(level) + r'} ', text[start:], re.M)
    return text[start:start + end.start()] if end else text[start:]


def table_rows(text):
    for line in text.splitlines():
        if line.startswith('|'):
            yield [clean(c) for c in line.strip('|').split('|')]


def event_check(text):
    errors = []
    headings = list(re.finditer(r'^## Event (\S+)[^\n]*', text, re.M))
    bodies = [m.group(1) for m in headings]
    index = []
    for row in table_rows(section(text, '## 4. Event index')):
        if row[0] == 'Event ID' or re.fullmatch(r'[- :]+', row[0]):
            continue
        index.append(row[0])
    for label, ids in [('body', bodies), ('index', index)]:
        if not ids:
            errors.append('No event ' + label + ' IDs found')
        malformed = [x for x in ids if not re.fullmatch(EVENT_ID, x) or x == 'FE-EV-000']
        duplicates = sorted(x for x, n in Counter(ids).items() if n > 1)
        if malformed:
            errors.append('Malformed ' + label + ' IDs: ' + ', '.join(malformed))
        if duplicates:
            errors.append('Duplicate ' + label + ' IDs: ' + ', '.join(duplicates))
    if set(bodies) != set(index):
        errors.append('Body/index mismatch: missing index=' + str(sorted(set(bodies)-set(index)))
                      + ', missing body=' + str(sorted(set(index)-set(bodies))))
    numbers = [int(x[6:]) for x in bodies if re.fullmatch(EVENT_ID, x)]
    if numbers != list(range(1, len(numbers) + 1)):
        errors.append('Event bodies must be continuous and ascending from FE-EV-001')
    for i, match in enumerate(headings):
        block = text[match.end():headings[i+1].start() if i+1 < len(headings) else len(text)]
        fields = [r[1] for r in table_rows(block) if r[0] == 'Event ID' and len(r) > 1]
        # Index header is not an Event ID field (its second cell is Date).
        fields = [x for x in fields if x != 'Date']
        if fields != [match.group(1)]:
            errors.append('Event ID field must match heading once: ' + match.group(1))
    return check('event_integrity', errors, 'Unique equal body/index sets, continuous ascending IDs',
                 {'body_count': len(bodies), 'index_count': len(index),
                  'maximum_id': 'FE-EV-%03d' % max(numbers) if numbers else None})


def finding_checks(text):
    errors, records = [], {}
    headings = list(re.finditer(r'^### (FE-\S+)[^\n]*', text, re.M))
    for i, match in enumerate(headings):
        fid = match.group(1)
        block = text[match.end():headings[i+1].start() if i+1 < len(headings) else len(text)]
        # Stop at any peer/parent heading, so later summaries are never records.
        block = re.split(r'^#{1,3} ', block, maxsplit=1, flags=re.M)[0]
        if not re.fullmatch(FINDING_ID, fid) or fid.endswith('-000'):
            errors.append('Malformed finding ID: ' + fid)
        if fid in records:
            errors.append('Duplicate canonical finding: ' + fid)
        fields = {}
        for row in table_rows(block):
            if row[0] in ('Status', 'Verification', 'Verification status'):
                key = 'Verification' if row[0].startswith('Verification') else 'Status'
                if key in fields:
                    errors.append('Duplicate ' + key + ' field: ' + fid)
                # clean() removes a closing backtick only when it ends the cell.
                value = re.match(r'(OPEN|ACCEPTED|DEFERRED|CLOSED|WITHDRAWN|NOT VERIFIED|VERIFIED|RE-OPENED)(?:`|$|\s[—·])', row[1]) if len(row) > 1 else None
                fields[key] = value.group(1) if value else None
        state, verification = fields.get('Status'), fields.get('Verification')
        if state not in ('OPEN', 'ACCEPTED', 'DEFERRED', 'CLOSED', 'WITHDRAWN'):
            errors.append('Missing/invalid Status: ' + fid)
        if verification not in ('NOT VERIFIED', 'VERIFIED', 'RE-OPENED'):
            errors.append('Missing/invalid Verification: ' + fid)
        if (state == 'CLOSED' and verification != 'VERIFIED') or (state == 'OPEN' and verification == 'VERIFIED'):
            errors.append('Invalid lifecycle combination: ' + fid + ' ' + str((state, verification)))
        records[fid] = (state, verification)
    distribution = Counter(str(s) + ' / ' + str(v) for s, v in records.values())
    expected = {'OPEN / NOT VERIFIED': 18, 'CLOSED / VERIFIED': 11}
    if len(headings) != 29 or len(records) != 29 or dict(distribution) != expected:
        errors.append('Post-LR-1 baseline finding census differs; investigate or separately authorise rebaselining')
    return records, check('finding_lifecycle', errors, {'total': 29, 'distribution': expected},
                          {'total': len(headings), 'distribution': dict(sorted(distribution.items()))})


def allocation_check(text, records):
    errors, packages, allocated = [], {}, []
    for row in table_rows(section(text, '### 8.2 Canonical current 18-finding allocation')):
        if row[0] == 'Package' or re.fullmatch(r'[- :]+', row[0]):
            continue
        package = row[0]
        if package not in PACKAGES or package in packages:
            errors.append('Unknown or duplicate package row: ' + package)
        if len(row) != 5:
            errors.append('Malformed allocation row: ' + package)
            continue
        ids = [] if row[2] == '' else [x.strip() for x in row[2].split('·')]
        packages[package] = len(ids)
        for fid in ids:
            if not re.fullmatch(FINDING_ID, fid) or fid not in records:
                errors.append('Unknown/malformed allocated finding: ' + fid)
            elif records[fid][0] != 'OPEN':
                errors.append('Non-open finding allocated: ' + fid)
        allocated.extend(ids)
    open_ids = {fid for fid, state in records.items() if state[0] == 'OPEN'}
    counts = Counter(allocated)
    for fid in sorted(open_ids | set(allocated)):
        if counts[fid] != 1:
            errors.append('Allocation multiplicity must equal 1: %s observed %d' % (fid, counts[fid]))
    if packages != PACKAGES:
        errors.append('Post-LR-1 package cardinalities differ; inspect canonical allocation')
    return check('fast_track_allocation', errors, PACKAGES,
                 {'packages': packages, 'total': len(allocated), 'open_count': len(open_ids)})


def git(root, *args, input_bytes=None):
    env = dict(os.environ, GIT_OPTIONAL_LOCKS='0', LC_ALL='C')
    result = subprocess.run(['git', '-c', 'core.fsmonitor=false', '-C', str(root), *args],
                            input=input_bytes, stdout=subprocess.PIPE, stderr=subprocess.PIPE, env=env)
    if result.returncode:
        raise ConfigurationError('git ' + ' '.join(args) + ': ' + result.stderr.decode(errors='replace').strip())
    return result.stdout


def digest(records):
    return hashlib.sha256(''.join(p + ':' + records[p] + '\n' for p in sorted(records)).encode()).hexdigest()


def manifest_check(name, layers, count, expected_digest):
    observed, errors = {}, []
    for label, records in layers.items():
        observed[label] = {'count': len(records), 'digest': digest(records)}
        if len(records) != count or observed[label]['digest'] != expected_digest:
            errors.append(label + ' population/blob identity mismatch; inspect paths and authorised baseline')
    return check(name, errors, {'count': count, 'digest': expected_digest}, observed)


def manifests(root):
    index = {}
    for entry in git(root, 'ls-files', '--stage', '-z', '--', 'book').split(b'\0'):
        if not entry:
            continue
        info, path = entry.split(b'\t', 1)
        mode, sha, stage = info.decode().split()
        if stage != '0':
            raise ConfigurationError('Unmerged index path: ' + os.fsdecode(path))
        index[os.fsdecode(path)] = sha
    head = {}
    for entry in git(root, 'ls-tree', '-r', '-z', 'HEAD', '--', 'book').split(b'\0'):
        if entry:
            info, path = entry.split(b'\t', 1)
            head[os.fsdecode(path)] = info.decode().split()[2]
    # Include tracked/ignored/untracked on-disk candidates, not just index entries.
    patterns = [('chapter_manifest', 'book/part-*/chapters/chapter-*.md', 137, CHAPTER_DIGEST),
                ('part_readme_manifest', 'book/part-*/README.md', 12, PART_DIGEST)]
    results = []
    for name, pattern, count, expected in patterns:
        paths = sorted(root.glob(pattern))
        working = {}
        for path in paths:
            if path.is_symlink() or not path.is_file() or any(
                    p.is_symlink() for p in path.parents if root in p.parents):
                raise ConfigurationError('Controlled path must be a regular local file: ' + str(path.relative_to(root)))
            relative = path.relative_to(root).as_posix()
            working[relative] = git(root, 'hash-object', '--no-filters', '--stdin', input_bytes=path.read_bytes()).decode().strip()
        layers = {'HEAD': {p: sha for p, sha in head.items() if PurePosixPath(p).match(pattern)},
                  'index': {p: sha for p, sha in index.items() if PurePosixPath(p).match(pattern)},
                  'working_tree': working}
        results.append(manifest_check(name, layers, count, expected))
    return results


def changed_paths(root):
    paths = set()
    # Separate comparisons catch staged edits undone in the working tree; --no-renames
    # exposes both ends of renames. Untracked directories are expanded to exact files.
    for args in [('diff', '--name-only', '--no-renames', '-z'),
                 ('diff', '--cached', '--name-only', '--no-renames', '-z'),
                 ('ls-files', '--others', '--exclude-standard', '-z')]:
        paths.update(os.fsdecode(p) for p in git(root, *args).split(b'\0') if p)
    return sorted(paths)


def scope_check(actual, allowed):
    unexpected = sorted(set(actual) - set(allowed))
    return check('batch_scope', ['Unexpected changed path: ' + p for p in unexpected],
                 sorted(allowed), sorted(actual))


def allowed_path(value):
    path = PurePosixPath(value)
    if (not value or value != path.as_posix() or path.is_absolute() or '..' in path.parts
            or value == '.' or any(c in value for c in '*?[]\\\n\r\0')):
        raise argparse.ArgumentTypeError('Allowed paths must be exact repository-relative file paths: ' + repr(value))
    return value


class Parser(argparse.ArgumentParser):
    def error(self, message):
        raise ConfigurationError(message)


def run(root, profile, allowed):
    checks = []
    def execute(name, action):
        try:
            result = action()
            checks.extend(result if isinstance(result, list) else [result])
        except EvidenceMissing as exc:
            checks.append(check(name, [str(exc)], status='INCOMPLETE'))
        except (OSError, UnicodeError, ConfigurationError) as exc:
            checks.append(check(name, [str(exc)], status='ERROR'))
    execute('controlled_manifests', lambda: manifests(root))
    execute('event_integrity', lambda: event_check(read_evidence(root, 'FIRST_EDITION_REVIEW_LOG.md')))
    def findings():
        text = read_evidence(root, 'FIRST_EDITION_FINDINGS.md')
        records, result = finding_checks(text)
        checks.append(result)
        return allocation_check(text, records)
    execute('finding_allocation', findings)
    for cached in (False, True):
        def hygiene(cached=cached):
            args = ['diff', '--no-ext-diff', '--check'] + (['--cached'] if cached else [])
            result = subprocess.run(['git', '-C', str(root), *args], capture_output=True,
                                    env=dict(os.environ, GIT_OPTIONAL_LOCKS='0', LC_ALL='C'))
            if result.returncode not in (0, 2):
                raise ConfigurationError(result.stderr.decode(errors='replace'))
            return check('diff_cached_hygiene' if cached else 'diff_hygiene',
                         [result.stdout.decode(errors='replace').strip()] if result.returncode else [])
        execute('diff_hygiene', hygiene)
    if profile == 'batch' or allowed:
        if not allowed:
            checks.append(check('batch_scope', ['Supply repeatable --allow-path for the frozen authorised file inventory.'], status='INCOMPLETE'))
        else:
            execute('batch_scope', lambda: scope_check(changed_paths(root), allowed))
    if profile in ('learning-ready', 'first-edition'):
        requirement = ('Plan §18.3 expanded Learning-Ready candidate/freeze inventory and residual evidence'
                       if profile == 'learning-ready' else 'Plan §13.4 complete 141-object Phase K baseline and drift evidence')
        checks.append(check('candidate_baseline_evidence',
                            [requirement + ': validator not implemented in FTR-2. Separately authorise evidence and validator work before using this as a complete gate prerequisite suite.'],
                            expected=requirement, observed='NOT IMPLEMENTED', status='INCOMPLETE'))
    return checks


def read_evidence(root, filename):
    try:
        return (root / REVIEW / filename).read_text(encoding='utf-8')
    except FileNotFoundError:
        raise EvidenceMissing('Required canonical evidence missing: ' + REVIEW + filename)


def report(profile, checks):
    statuses = {c['status'] for c in checks}
    code = 2 if 'ERROR' in statuses else 1 if 'FAIL' in statuses else 3 if 'INCOMPLETE' in statuses else 0
    return {'tool': 'first_edition_gate', 'version': VERSION, 'profile': profile,
            'overall_deterministic_result': {0: 'PASS', 1: 'FAIL', 2: 'ERROR', 3: 'INCOMPLETE'}[code],
            'exit_code': code, 'exit_code_meaning': MEANINGS[code], 'checks': checks,
            'semantic_acceptance_disclaimer': DISCLAIMER}


def main(argv=None):
    argv = sys.argv[1:] if argv is None else argv
    output_format = 'json' if '--format=json' in argv or any(argv[i:i+2] == ['--format', 'json'] for i in range(len(argv))) else 'text'
    profile = None
    parser = Parser(description=__doc__, epilog=DISCLAIMER, allow_abbrev=False)
    parser.add_argument('--profile', required=True, choices=PROFILES)
    parser.add_argument('--format', choices=('text', 'json'), default='text')
    parser.add_argument('--allow-path', action='append', default=[], type=allowed_path,
                        help='Exact authorised repository-relative file; repeat for each file (required by batch).')
    try:
        args = parser.parse_args(argv)
        profile, output_format = args.profile, args.format
        root = Path(__file__).resolve().parents[1]
        actual_root = Path(os.fsdecode(git(root, 'rev-parse', '--show-toplevel')).strip()).resolve()
        if root != actual_root:
            raise ConfigurationError('Tool must be located in repository tools/ directory')
        checks = run(root, profile, args.allow_path)
    except Exception as exc:
        # Never convert an unexpected implementation/configuration failure to PASS.
        checks = [check('invocation_configuration', [type(exc).__name__ + ': ' + str(exc)], status='ERROR')]
    result = report(profile, checks)
    if output_format == 'json':
        print(json.dumps(result, indent=2, sort_keys=True, ensure_ascii=True))
    else:
        print('first_edition_gate ' + VERSION + ' | profile=' + str(profile))
        for item in result['checks']:
            print(item['status'] + ' ' + item['name'] + ': ' + item['message'])
            if item['expected'] is not None:
                print('  expected: ' + json.dumps(item['expected'], sort_keys=True))
            if item['observed'] is not None:
                print('  observed: ' + json.dumps(item['observed'], sort_keys=True))
        print(result['overall_deterministic_result'] + ' | exit ' + str(result['exit_code']) + ': ' + result['exit_code_meaning'])
        print(DISCLAIMER)
    return result['exit_code']


if __name__ == '__main__':
    sys.exit(main())
