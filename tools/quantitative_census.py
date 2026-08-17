#!/usr/bin/env python3
"""
MSQE First Edition Review — canonical quantitative-census reference implementation.

Implements, without deviation, the classification pipeline specified in
docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md sections 6.1 and 6.2.

The specification governs this file. This file does not define the specification.
No accepted or expected total is hard-coded; every figure is derived from the
manuscript at run time.

Python 3.8+, standard library only. Deterministic: identical input yields
identical output, and the ordering of every output row is fixed.

Usage:
    python3 tools/quantitative_census.py                 # aggregate report
    python3 tools/quantitative_census.py --detail        # every candidate, one per line
    python3 tools/quantitative_census.py --json          # machine-readable
    python3 tools/quantitative_census.py --part 3        # restrict to one Part

Output contract (specification section 6.3.1):

  default   Aggregate counts only: per-Part and per-batch chapters, Tier-1,
            Tier-2, code-fence, inline-code and words. No candidate rows.

  --detail  Complete, line-oriented enumeration of ALL FOUR candidate
            populations, six tab-separated fields:

                Part <TAB> path <TAB> Lnnn <TAB> population <TAB> class <TAB> text

            population is one of: T1, T2, code-fence, inline-code.
            class is the section 6.2 Tier-1 class for T1 and inline-code,
            "int" for T2, and "num" for code-fence numeric literals.
            Rows are emitted per chapter in the fixed order
            T1, T2, code-fence, inline-code; within each population the order
            is fixed. Selecting only the prose tiers is therefore
            `awk -F'\\t' '$4=="T1" || $4=="T2"'`.

  --json    Aggregates ("per_part", "per_batch", "chapters") plus a
            "candidates" array carrying every row of all four populations as
            {part, path, line, population, class, text}. The aggregate keys are
            unchanged from earlier revisions; "candidates" is additive.

No output file is written. Nothing is cached.
"""

import argparse
import glob
import json
import os
import re
import sys

# --------------------------------------------------------------------------
# Input population (specification section 6.1, "Input population")
# --------------------------------------------------------------------------

CHAPTER_GLOB = "book/part-*/chapters/chapter-*.md"

ROMAN = {1: "I", 2: "II", 3: "III", 4: "IV", 5: "V", 6: "VI",
         7: "VII", 8: "VIII", 9: "IX", 10: "X", 11: "XI", 12: "XII"}

BATCH = {1: "L1", 2: "L1", 3: "L2", 4: "L2", 5: "L2", 6: "L3", 7: "L3",
         8: "L3", 9: "L4", 10: "L4", 11: "L5", 12: "L5"}

# --------------------------------------------------------------------------
# Tier-1 inclusion classes (specification section 6.2)
# Order is significant: it is the PASS-4 tie-break order.
# --------------------------------------------------------------------------

UNIT_FORMS = [
    "milliseconds", "millisecond", "ms",
    "seconds", "second", "minutes", "minute",
    "months", "month", "hours", "hour", "days", "day", "min",
    "GB", "requests/s", "jobs/s", "s", "h",
]
_UNIT_ALT = "|".join(sorted((re.escape(u) for u in UNIT_FORMS), key=len, reverse=True))

TIER1_CLASSES = [
    ("pct",   r"\d[\d,]*(?:\.\d+)?\s?%"),
    ("cur",   r"[€$£]\s?\d[\d,]*(?:\.\d+)?"),
    ("unit",  r"\d[\d,]*(?:\.\d+)?\s?(?:" + _UNIT_ALT + r")\b"),
    # ratio: slash form only. The right operand must NOT be a four-digit year
    # 1900-2099, which would make the token a date rather than a ratio (6.2).
    ("ratio", r"\d[\d,]*(?:\.\d+)?\s?/\s?(?!(?:19|20)\d{2}(?!\d))\d+(?!\d)"),
    ("perN",  r"\d[\d,]*(?:\.\d+)?\s?per\s+\w+"),
    ("thou",  r"\b\d{1,3}(?:,\d{3})+\b"),
    ("dec",   r"\b\d+\.\d+\b"),
]

# E7 closed label set: a table row is chapter metadata when its first cell,
# lowercased with surrounding emphasis stripped, is a member of this set.
METADATA_LABELS = {
    "chapter", "part", "version", "status", "estimated study time",
    "prerequisites", "reading time", "difficulty",
}

E12_TRIGGERS = re.compile(r"HTTP|status|response|code|return|returns", re.IGNORECASE)
E12_WINDOW = 25

# Numeric literal, used only for the fenced-code population.
CODE_NUMERIC = re.compile(r"\d+(?:[.,]\d+)*")

# Tier-2 residue: bare integers of two or more digits.
TIER2_PATTERN = re.compile(r"(?<![\d.,])\d{2,}(?![\d.,])")


def _blank(match):
    """Length- and newline-preserving mask. Positions never shift."""
    return re.sub(r"[^\n]", " ", match.group(0))


def _blank_line(line):
    return " " * len(line)


def _is_footnote_definition(line):
    """E5 test, evaluated on the ORIGINAL line so it cannot depend on
    the order in which earlier exclusions ran."""
    return re.match(r"^\s*\[\^[^\]]+\]:", line) is not None


def _is_metadata_row(line):
    """E7 test: table row whose first cell is a closed-set metadata label."""
    if not line.strip().startswith("|"):
        return False
    cells = [c.strip() for c in line.strip().strip("|").split("|")]
    if not cells:
        return False
    return cells[0].strip("*_ ").lower() in METADATA_LABELS


def separate_fenced_code(text):
    """E1. Fenced code is SET ASIDE as its own population, never deleted.

    Returns (prose_stream, code_stream). Both preserve line count and every
    character position of the original, so a match offset is valid in either.
    """
    prose, code = [], []
    in_fence = False
    for line in text.split("\n"):
        if re.match(r"^\s*(```|~~~)", line):
            in_fence = not in_fence
            prose.append(_blank_line(line))
            code.append(line)
            continue
        if in_fence:
            prose.append(_blank_line(line))
            code.append(line)
        else:
            prose.append(line)
            code.append(_blank_line(line))
    return "\n".join(prose), "\n".join(code)


def pass0(prose):
    """PASS 0 — structurally unambiguous non-claims, E2 through E11.

    Every step is length- and newline-preserving and consumes the output of
    the previous step. E5 and E7 are decided on the ORIGINAL line text so the
    result is independent of the order of the character-level maskers.

    Returns (residue, inline_code_stream). Inline-code content is set aside as
    its own measured population rather than silently discarded.
    """
    original_lines = prose.split("\n")

    # E2 - inline code spans. Captured before masking so the suppressed
    # population remains measurable.
    inline_parts = []
    for line in original_lines:
        inline_parts.append(" ".join(re.findall(r"`([^`\n]*)`", line)))
    inline_code = "\n".join(inline_parts)
    s = re.sub(r"`[^`\n]*`", _blank, prose)

    # E3 - absolute URLs.
    s = re.sub(r"https?://\S+", _blank, s)

    # E4 - Markdown link and image targets, the "](...)" portion only.
    #      Must not span a newline: a link target never does, and allowing it
    #      lets one unclosed parenthesis mask unrelated later lines.
    s = re.sub(r"\]\([^)\n]*\)", _blank, s)

    # E5 - footnote definition lines, removed in their entirety.
    s = "\n".join(
        _blank_line(cur) if _is_footnote_definition(orig) else cur
        for orig, cur in zip(original_lines, s.split("\n"))
    )

    # E6 - footnote references.
    s = re.sub(r"\[\^[^\]]+\]", _blank, s)

    # E7 - chapter metadata rows, removed in their entirety.
    s = "\n".join(
        _blank_line(cur) if _is_metadata_row(orig) else cur
        for orig, cur in zip(original_lines, s.split("\n"))
    )

    # E8 - "Chapter N" / "Part N" ATX headings.
    s = "\n".join(
        _blank_line(cur) if re.match(r"^#{1,6}\s+(Chapter|Part)\s+[0-9IVXLC]+", orig) else cur
        for orig, cur in zip(original_lines, s.split("\n"))
    )

    # E9 - standards designators.
    s = re.sub(
        r"\b(ISO/IEC/IEEE|ISO/IEC|ISO/TS|ISO|IEC|IEEE|RFC|BS|EN)\s?\d+(\s?-\s?\d+)*(:\d{4})?",
        _blank, s)

    # E10 - time of day. Evaluated BEFORE E11 so a clock form is never
    #       re-read as a bare year.
    s = re.sub(r"\b([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?\b", _blank, s)

    # E11 - bare years standing alone.
    s = re.sub(r"(?<![\d.,/-])(19\d{2}|20\d{2})(?![\d.,/%-])", _blank, s)

    return s, inline_code


def pass1(residue):
    """PASS 1 - match and protect Tier-1 candidates.

    PASS 4 deduplication is applied here, in the same step that produces the
    matches, because leftmost-longest resolution cannot be deferred without
    changing the result.
    """
    spans = []
    for cls, pattern in TIER1_CLASSES:
        for m in re.finditer(pattern, residue):
            spans.append((m.start(), m.end(), cls))

    order = {c: i for i, (c, _) in enumerate(TIER1_CLASSES)}
    # leftmost first, then longest, then §6.2 class order.
    spans.sort(key=lambda t: (t[0], -(t[1] - t[0]), order[t[2]]))

    kept = []
    for a, b, cls in spans:
        if any(not (b <= x or a >= y) for x, y, _ in kept):
            continue
        kept.append((a, b, cls))
    kept.sort()
    return kept


def pass2_and_3(residue, protected):
    """PASS 2 - E12 identifier exclusion on unprotected tokens only.
       PASS 3 - Tier-2 residue.
    """
    chars = list(residue)
    for a, b, _ in protected:
        for i in range(a, b):
            chars[i] = " "
    work = "".join(chars)

    def e12(m):
        value = int(m.group(0))
        if not (100 <= value <= 599):
            return m.group(0)
        lo = max(0, m.start() - E12_WINDOW)
        hi = min(len(work), m.end() + E12_WINDOW)
        context = work[lo:m.start()] + work[m.end():hi]
        return " " * len(m.group(0)) if E12_TRIGGERS.search(context) else m.group(0)

    work = re.sub(r"\b\d{3}\b", e12, work)
    return [(m.start(), m.end(), m.group(0)) for m in TIER2_PATTERN.finditer(work)]


def classify_chapter(path):
    text = open(path, encoding="utf-8").read()
    prose, code = separate_fenced_code(text)
    residue, inline_code = pass0(prose)

    tier1 = pass1(residue)
    tier2 = pass2_and_3(residue, tier1)

    # Code-fence numerics (6.2.2). The code stream preserves every line and
    # character position of the original, so a match offset yields the true
    # source line. Neither Tier 1 nor Tier 2.
    code_numerics = [(m.start(), m.group(0)) for m in CODE_NUMERIC.finditer(code)]

    # Inline-code candidates: Tier-1 grammar applied to the E2-suppressed
    # population. Neither Tier 1 nor Tier 2; measured so that E2's suppression
    # is visible rather than silent. PASS-4 deduplication does NOT apply here
    # (6.2.3): this population records what E2 removed, and its members do not
    # compete for prose tier membership.
    # The inline stream carries one line per source line, so the newline count
    # before a match is that match's source line.
    class_order = {c: i for i, (c, _) in enumerate(TIER1_CLASSES)}
    inline_candidates = []
    for cls, pattern in TIER1_CLASSES:
        for m in re.finditer(pattern, inline_code):
            line = inline_code.count("\n", 0, m.start()) + 1
            inline_candidates.append((line, class_order[cls], cls, m.group(0)))
    inline_candidates.sort(key=lambda t: (t[0], t[1]))

    matches = []
    for a, b, cls in tier1:
        line = text.count("\n", 0, a) + 1
        matches.append({"pop": "T1", "class": cls, "line": line, "text": residue[a:b].strip()})
    for a, b, tok in tier2:
        line = text.count("\n", 0, a) + 1
        matches.append({"pop": "T2", "class": "int", "line": line, "text": tok})
    for start, tok in code_numerics:
        line = code.count("\n", 0, start) + 1
        matches.append({"pop": "code-fence", "class": "num", "line": line, "text": tok})
    for line, _, cls, tok in inline_candidates:
        matches.append({"pop": "inline-code", "class": cls, "line": line, "text": tok})

    return {
        "tier1": len(tier1),
        "tier2": len(tier2),
        "code": len(code_numerics),
        "inline": len(inline_candidates),
        "words": len(text.split()),
        "matches": matches,
    }


def run(root=".", only_part=None):
    parts = {}
    for pdir in sorted(glob.glob(os.path.join(root, "book", "part-*"))):
        base = os.path.basename(pdir)
        m = re.match(r"part-(\d+)", base)
        if not m:
            continue
        pnum = int(m.group(1))
        if only_part and pnum != only_part:
            continue
        chapters = []
        for path in sorted(glob.glob(os.path.join(pdir, "chapters", "chapter-*.md"))):
            r = classify_chapter(path)
            r["path"] = os.path.relpath(path, root)
            chapters.append(r)
        parts[pnum] = chapters
    return parts


def aggregate(parts):
    per_part, per_batch = {}, {}
    for pnum, chapters in parts.items():
        t1 = sum(c["tier1"] for c in chapters)
        t2 = sum(c["tier2"] for c in chapters)
        cf = sum(c["code"] for c in chapters)
        il = sum(c["inline"] for c in chapters)
        w = sum(c["words"] for c in chapters)
        per_part[pnum] = {"chapters": len(chapters), "tier1": t1, "tier2": t2,
                          "code": cf, "inline": il, "words": w}
        b = per_batch.setdefault(BATCH[pnum], {"parts": [], "chapters": 0, "tier1": 0,
                                               "tier2": 0, "code": 0, "inline": 0, "words": 0})
        b["parts"].append(ROMAN[pnum])
        for k in ("chapters", "tier1", "tier2", "code", "inline", "words"):
            b[k] += per_part[pnum][k] if k != "chapters" else len(chapters)
    return per_part, per_batch


def main():
    ap = argparse.ArgumentParser(description="MSQE quantitative-census reference implementation")
    ap.add_argument("--root", default=".", help="repository root")
    ap.add_argument("--detail", action="store_true", help="print every match")
    ap.add_argument("--json", action="store_true", help="machine-readable output")
    ap.add_argument("--part", type=int, default=None, help="restrict to one Part number")
    args = ap.parse_args()

    parts = run(args.root, args.part)
    per_part, per_batch = aggregate(parts)

    if args.json:
        candidates = [{"part": ROMAN[pnum], "path": c["path"], "line": m["line"],
                       "population": m["pop"], "class": m["class"], "text": m["text"]}
                      for pnum in sorted(parts) for c in parts[pnum] for m in c["matches"]]
        json.dump({"per_part": {ROMAN[k]: v for k, v in sorted(per_part.items())},
                   "per_batch": per_batch,
                   "chapters": {c["path"]: {k: c[k] for k in ("tier1", "tier2", "code", "inline", "words")}
                                for cs in parts.values() for c in cs},
                   "candidates": candidates},
                  sys.stdout, indent=2, sort_keys=True)
        print()
        return

    if args.detail:
        for pnum in sorted(parts):
            for c in parts[pnum]:
                for m in c["matches"]:
                    print(f"{ROMAN[pnum]}\t{c['path']}\tL{m['line']}\t{m['pop']}\t{m['class']}\t{m['text']}")
        return

    print(f"{'Part':<6}{'Ch':>4}{'Tier-1':>9}{'Tier-2':>9}{'code':>8}{'inline':>8}{'words':>10}")
    tot = {"chapters": 0, "tier1": 0, "tier2": 0, "code": 0, "inline": 0, "words": 0}
    for pnum in sorted(per_part):
        v = per_part[pnum]
        print(f"{ROMAN[pnum]:<6}{v['chapters']:>4}{v['tier1']:>9}{v['tier2']:>9}"
              f"{v['code']:>8}{v['inline']:>8}{v['words']:>10,}")
        for k in tot:
            tot[k] += v[k]
    print(f"{'TOTAL':<6}{tot['chapters']:>4}{tot['tier1']:>9}{tot['tier2']:>9}"
          f"{tot['code']:>8}{tot['inline']:>8}{tot['words']:>10,}")

    print()
    print(f"{'Batch':<7}{'Parts':<22}{'Ch':>4}{'Tier-1':>9}{'Tier-2':>9}{'code':>8}{'inline':>8}{'words':>10}")
    for b in ("L1", "L2", "L3", "L4", "L5"):
        if b not in per_batch:
            continue
        v = per_batch[b]
        print(f"{b:<7}{'-'.join(v['parts']):<22}{v['chapters']:>4}{v['tier1']:>9}{v['tier2']:>9}"
              f"{v['code']:>8}{v['inline']:>8}{v['words']:>10,}")


if __name__ == "__main__":
    main()
