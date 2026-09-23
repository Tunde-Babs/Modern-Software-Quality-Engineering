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
PROFILES = ('batch', 'learning-ready', 'first-edition', 'baseline', 'fe3-historical')
REVIEW = 'docs/02-first-edition-review/'
CHAPTER_DIGEST = '3a56e89be75d9bfbe63a01a938fa44d6f7067814fc8029af33ace8b5a85b6102'
PART_DIGEST = 'eafd4ba0fc55275cf8bcd9094a225e408ab22d43e019d76319ce1897b1c11451'
PACKAGES = {'LR-1': 0, 'LR-2': 0, 'FE-1': 0, 'FE-2': 0, 'FE-3': 0}
# FE-J-001R records FE-AG1R1V2 acceptance; closure is not FE-AG1 acceptance.
GATE_FINDINGS = {'FE-J-001': ('CLOSED', 'VERIFIED')}
HISTORICAL_FINDINGS = ('FE-L1-001', 'FE-L1-002', 'FE-L1-003', 'FE-L1-004', 'FE-L1-005', 'FE-L1-006', 'FE-L1-007', 'FE-L2-001', 'FE-L2-002', 'FE-L2-003', 'FE-L2-004', 'FE-L2-005', 'FE-L3-001', 'FE-L3-002', 'FE-L3-003', 'FE-L3-004', 'FE-L3-005', 'FE-L4-001', 'FE-L4-002', 'FE-L5-001', 'FE-L5-002', 'FE-L5-003', 'FE-T3-001', 'FE-T5-001', 'FE-T2-001', 'FE-T2-002', 'FE-T6-001', 'FE-T6-002', 'FE-T4-001')
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


def finding_checks(text, admitted=None, historical_ids=None):
    admitted = admitted or {}
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
    expected = Counter({'CLOSED / VERIFIED': 29})
    expected.update(Counter(' / '.join(state) for state in admitted.values()))
    for fid, state in admitted.items():
        if records.get(fid) != state:
            errors.append('Admitted gate finding state differs: ' + fid)
    if historical_ids is not None and set(records) != set(historical_ids) | set(admitted):
        errors.append('Historical/admitted finding identity census differs')
    if len(headings) != 29 + len(admitted) or len(records) != 29 + len(admitted) or dict(distribution) != expected:
        errors.append('Post-FE-3 baseline finding census differs; investigate or separately authorise rebaselining')
    return records, check('finding_lifecycle', errors, {'total': 29 + len(admitted), 'distribution': expected},
                          {'total': len(headings), 'distribution': dict(sorted(distribution.items()))})


def allocation_check(text, records, admitted=None):
    admitted = admitted or {}
    admitted_open = {fid for fid, state in admitted.items() if state[0] == 'OPEN'}
    errors, packages, allocated = [], {}, []
    expected_packages = dict(PACKAGES)
    allocation = section(text, '### 8.2 Canonical current 0-finding allocation')
    if admitted:
        expected_packages['FE-AG1R1'] = len(admitted_open)
        heading = ('### 9.1 Current acceptance-gate allocation' if admitted_open
                   else '### 9.2 Current acceptance-gate allocation after FE-J-001 closure')
        allocation += section(text, heading)
    for row in table_rows(allocation):
        if row[0] == 'Package' or re.fullmatch(r'[- :]+', row[0]):
            continue
        package = row[0]
        if package not in expected_packages or package in packages:
            errors.append('Unknown or duplicate package row: ' + package)
        if len(row) != 5:
            errors.append('Malformed allocation row: ' + package)
            continue
        ids = [] if row[2] == '' else [x.strip() for x in row[2].split('·')]
        packages[package] = len(ids)
        if admitted and ((package == 'FE-AG1R1' and set(ids) != admitted_open)
                         or (package != 'FE-AG1R1' and set(ids) & set(admitted))):
            errors.append('Gate finding must belong only to FE-AG1R1')
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
    if packages != expected_packages:
        errors.append('Post-FE-3 package cardinalities differ; inspect canonical allocation')
    return check('fast_track_allocation', errors, expected_packages,
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


# FE-3F1 controls only. Pins identify original Git evidence and the semantic
# record independently inspected at FE-3V §§16–20 (not package acceptance).
# They are NOT website-preservation baseline evolution or numeric inputs.
FE3_SOURCE = 'd06fcec4bb4fe70eac40e66b5675e4ca285e4d18'
FE3_BASE = '8fa0389fc1ba7c40ee33bc408a739dd082fdbbcd'
FE3_OLD_TOOL = '3b1a2560d886c7227cbad61e24a7da8a36e10ea1'
FE3_RECORD_HASHES = {'correction_section': '65a2eba00cc072132954d98723ed74d079b20279837127f7ecfb6f68b3d432ba', 'owner_record': '3ab79df15698fe0ab494cbb5f2fc0a86ea98dc3b5e770a17f93c30607833d693', 'ledger_row': '7c8bbc4d5b4caecec8237c296c763a3f77c9f2f5665c3638381d48c5ae9fa633', 'ledger_interpretation': '3b992fdfd28021e20c9ccb404b7633e103ed1350ed37f69113d576b6af78c9b5', 'authorship_event': 'e1ee141aa62d47c538fcf2b5c299b2832765632849c7c83a8df0da02bf31694d'}


def historical_partx_inputs(root):
    """Reproduce old L4 candidates; never import the amended candidate tool.

    The pinned, hash-authenticated historical program is evaluated only from
    its immutable Git object. Its classifier is used on original IX/X blobs.
    Identifier context is independently recognized here, not read from the
    candidate's delta or E13 implementation. Counts are occurrence counts.
    """
    import tempfile
    import types
    tool = git(root, 'show', FE3_SOURCE + ':tools/quantitative_census.py')
    blob = git(root, 'hash-object', '--stdin', input_bytes=tool).decode().strip()
    if blob != FE3_OLD_TOOL:
        raise ConfigurationError('Historical classifier identity mismatch')
    old = types.ModuleType('fe3_authenticated_historical_census')
    exec(compile(tool, '<authenticated historical census>', 'exec'), old.__dict__)
    paths = git(root, 'ls-tree', '-r', '--name-only', FE3_SOURCE, '--', 'book').decode().splitlines()
    paths = [p for p in paths if re.fullmatch(r'book/part-(09|10)-[^/]+/chapters/chapter-[^/]+\.md', p)]
    if len(paths) != 24:
        raise EvidenceMissing('Historical IX/X chapter population is incomplete')
    denominator, occurrences = 0, []
    # These source labels identify the adjudicated bibliographic versions.
    # Numeric literals are captured from source, never supplied as test data.
    context = re.compile(r'(?:NIST (?:Cybersecurity Framework|CSF)|OAuth) (\d+\.\d+)\b')
    with tempfile.TemporaryDirectory(prefix='msqe-fe3-history-') as tmp:
        for path in sorted(paths):
            text = git(root, 'show', FE3_SOURCE + ':' + path).decode('utf-8')
            local = Path(tmp) / path
            local.parent.mkdir(parents=True, exist_ok=True)
            local.write_text(text, encoding='utf-8')
            denominator += old.classify_chapter(str(local))['tier1']
            prose, _ = old.separate_fenced_code(text)
            residue, _ = old.pass0(prose)
            candidates = {(a, b, cls) for a, b, cls in old.pass1(residue)}
            for match in context.finditer(residue):
                a, b = match.span(1)
                if (a, b, 'dec') in candidates:
                    occurrences.append({'path': path, 'line': text.count('\n', 0, a)+1,
                                        'offset': a, 'text': text[a:b]})
    return len(occurrences), denominator, occurrences


def fe3_historical_check(root):
    """Deterministic prerequisite; independent review/public evidence still required."""
    from decimal import Decimal, ROUND_HALF_UP, localcontext
    errors = []
    numerator, denominator, occurrences = historical_partx_inputs(root)
    if (numerator, denominator) != (8, 379):
        # Expected values are FE-3A1's independently reconstructed historical
        # decision, not a duplicate source used to manufacture the calculation.
        errors.append('Historical source does not reproduce FE-3A1 population')
    with localcontext() as ctx:
        ctx.prec = 28
        proportion = Decimal(numerator) / Decimal(denominator)
        percentage = proportion * 100
        rounded = percentage.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
    evidence = read_evidence(root, 'FE3_CORRECTION_EVIDENCE.md')
    correction = section(evidence, '## 4. Additive historical Part X correction')
    inputs = re.search(r'total historical L4 population \*\*(\d+)\*\*; contaminated population \*\*(\d+)\*\*', correction)
    percent = re.search(r'half-up to two decimal places = (\d+(?:\.\d+)?)%', correction)
    ratio = re.search(r'`(\d+)/(\d+) = ([0-9.]+)\u2026', correction)
    if not inputs or tuple(map(int, inputs.groups())) != (denominator, numerator):
        errors.append('Corrective numerator/denominator disagree with historical source')
    if not percent or Decimal(percent[1]) != rounded:
        errors.append('Corrective percentage disagrees with independently calculated half-up result')
    if not ratio or (int(ratio[1]), int(ratio[2])) != (numerator, denominator) or Decimal(ratio[3]) != proportion:
        errors.append('Corrective ratio disagrees with historical source arithmetic')
    rows = []
    for line in correction.splitlines():
        m = re.match(r'\| \[book/[^]]+\]\(../../(book/[^)]+)\) \| (\d+) \| `([^`]+)` \| (\d+) \|', line)
        if m:
            rows.append({'path': m[1], 'line': int(m[2]), 'text': m[3], 'offset': int(m[4])})
    if rows != occurrences:
        errors.append('Corrective occurrence table disagrees with historical spans')
    texts = {}
    for filename in ('FIRST_EDITION_VERIFICATION_LEDGERS.md', 'FIRST_EDITION_REVIEW_LOG.md'):
        current = read_evidence(root, filename)
        texts[filename] = current
        original = git(root, 'show', FE3_BASE + ':' + REVIEW + filename).decode()
        # Insert-only comparison protects every original historical line,
        # including zero/all-confirmed claims and dependent events.
        remaining = iter(current.splitlines(keepends=True))
        if not all(any(line == candidate for candidate in remaining)
                   for line in original.splitlines(keepends=True)):
            errors.append('Historical evidence deleted/rewritten: ' + filename)
    ledger = texts['FIRST_EDITION_VERIFICATION_LEDGERS.md']
    def unique_line(prefix):
        lines = [line for line in ledger.splitlines() if line.startswith(prefix)]
        if len(lines) != 1:
            raise EvidenceMissing('Missing/ambiguous corrective ledger evidence: ' + prefix)
        return lines[0]
    records = {
        'correction_section': correction,
        'owner_record': section(evidence, '## 1. Owner authority and frozen boundary').split('Exact authoring allow-list')[0],
        'ledger_row': unique_line('| NUM-FE3-HIST |'),
        'ledger_interpretation': unique_line('This supersedes the historical zero/all-confirmed'),
        'authorship_event': section(texts['FIRST_EDITION_REVIEW_LOG.md'], '## Event FE-EV-054'),
    }
    # Bind the independently derived numbers to FE-3V-inspected meaning:
    # historical zero is explicitly historical, current correction supersedes
    # it, and FE-3A/FE-3A1 ownership and non-acceptance limits stay intact.
    for name, text in records.items():
        if hashlib.sha256(text.encode()).hexdigest() != FE3_RECORD_HASHES[name]:
            errors.append('Inspected corrective interpretation/provenance changed: ' + name)
    paths = git(root, 'ls-tree', '-r', '--name-only', FE3_BASE, '--', 'book').decode().splitlines()
    for path in paths:
        if re.fullmatch(r'book/part-10-[^/]+/(README\.md|chapters/chapter-[^/]+\.md)', path):
            local = root / path
            if local.is_symlink() or not local.is_file() or local.read_bytes() != git(root, 'show', FE3_BASE + ':' + path):
                errors.append('Accepted current Part X content changed: ' + path)
    return check('FE3-HIST-PARTX', errors,
                 'Preserved history; source-derived 8/379; half-up percentage; owner-traceable correction; unchanged Part X',
                 {'numerator': numerator, 'denominator': denominator,
                  'proportion': str(proportion), 'percentage': str(percentage),
                  'rounded_percentage': str(rounded), 'occurrences': occurrences,
                  'semantic_or_public_acceptance': 'NOT CONFERRED'})


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
    if profile == 'fe3-historical':
        execute('FE3-HIST-PARTX', lambda: fe3_historical_check(root))
        return checks
    execute('controlled_manifests', lambda: manifests(root))
    execute('event_integrity', lambda: event_check(read_evidence(root, 'FIRST_EDITION_REVIEW_LOG.md')))
    def findings():
        text = read_evidence(root, 'FIRST_EDITION_FINDINGS.md')
        records, result = finding_checks(text, GATE_FINDINGS, HISTORICAL_FINDINGS)
        checks.append(result)
        return allocation_check(text, records, GATE_FINDINGS)
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
    if profile == 'first-edition':
        if any(state != ('CLOSED', 'VERIFIED') for state in GATE_FINDINGS.values()):
            checks.append(check('acceptance_gate_defects', ['Acceptance-gate defects remain unresolved.']))
        checks.append(check('FE-AG1-controlled-resumption',
                            ['FE-J-001 closure does not accept FE-AG1. Closure verification, checkpoint, deployment, live acceptance and controlled resumption remain required.'],
                            status='INCOMPLETE'))
        execute('FE3-HIST-PARTX', lambda: fe3_historical_check(root))
        checks.append(check('FE3-HIST-PARTX-independent-acceptance',
                            ['Fresh independent FE-3V2 acceptance and public/source semantic evidence have not been recorded as an authorised gate input. Author checks cannot satisfy this requirement.'],
                            expected='Independent accepted adjudication plus verification of all six affected public/source routes; evidence §8 obligations',
                            observed='NOT RECORDED; author quantitative PASS is insufficient', status='INCOMPLETE'))
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
