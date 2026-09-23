# FE-AG1R1 — Gate-defect correction authorship evidence

## Authority and boundary

User authorization: FE-AG1R1, 2026-09-22; incoming branch feature/first-edition-review, SHA `48c9f0aae867e50bfe9a7c94e57c74a98bdf592b`. FE-AGP §§26–29 and unknown-defect protocol §27 separate admission/correction from fresh independent verification, closure and resumption. FE-AG1 Decision B report SHA-256 `6e8b75ed31cf35996924284e6abe99ba23374e58e1b07a23269face61405b28d`; original external evidence manifest `0d5660a58a6b47d2bb27ea0767100040a7d5c08d7e1923e6bddc833ce5ae11c0`. Originals remain under `/tmp/msqe-fe-ag1/`; gate plan under `/tmp/msqe-fe-agp/`.

AG-CAND-FE-AG1-R1-002 maps to **FE-J-001, P2 / class C / OPEN / NOT VERIFIED**, root group AG-CASE-VERSION-01. One defect covers the common omission in the complete three-case family (Findings §2.4). AG-CAND-FE-AG1-R1-001 is the separate nonblocking Part V label observation and is untouched. Owner: Founder / Editor, Tunde Ajala; delegated author: Codex. Level 4 missing-required-section taxonomy is applied to the missing required metadata field through AGV-A's explicit practical-asset population; primary category 7 follows Plan §9's existing-standard rule. No score assigned.

## Reproduction, population and Version derivation

PROJECT_RULES rule 4 requires publishing templates; `templates/CASE_STUDY_TEMPLATE.md` requires Version; `docs/00-project/VERSIONING.md` requires versions on significant artefacts using MAJOR.MINOR.PATCH independently of project releases. All tracked case-study assets, corroborated by filename inventory and dynamic website resource discovery, are the three below. Template is a schema, not a published case study. All three original metadata tables end with `| **Status** | Draft |` and have no Version row. No malformed/ambiguous/additional case-study asset was found.

Each case was introduced at `2dd310d94f62b1c680707fbc75945652f0ea9f63` and is byte-identical to its creation blob at the incoming baseline. The template already required Version then. At that same commit all 30 versioned Part I sibling assets (10 chapters, 8 worksheets/workshop, 1 lab, 11 diagrams) declare **0.1.0**. Thus **0.1.0** initializes the omitted revision field of these untouched Draft assets using their contemporaneous Part convention. Confidence: high, convention-derived; no pre-existing case-specific value or project release bump is claimed. Full sibling inventory/history is in `/tmp/msqe-fe-ag1r1/version-derivation.json`.

Evidence supports an initial authoring omission, not an older-template or later-migration loss. Human intent is unknown. Existing loader validates chapter metadata only; byte-preservation and regression checks faithfully retained the pre-existing omission. Required new guard follows FE-AGP's separately authorized deterministic-dependency correction, not a new manuscript standard.

| Path | Original raw SHA-256 | Content body SHA-256 | Derived Version |
| --- | --- | --- | --- |
| `book/part-01-foundations/case-studies/case-study-01-quality-beyond-test-execution.md` | `305a393060b5177944edd94ff448604470f55b7d1569310f45d8638a06b749d2` | `17ed664d073f071d59ca3b56eedc39a661927e7673409acd395ff9e4024e2012` | 0.1.0 |
| `book/part-01-foundations/case-studies/case-study-02-shared-ownership-and-engineering-culture.md` | `da55044199be59fd4b63c5c02a7de174f435c744c8c0ecf1991c34dc78aa716e` | `0e4f99e54f94b93132d4a90981bab8be898ae4aae6e5ae0e958f0289a8039f69` | 0.1.0 |
| `book/part-01-foundations/case-studies/case-study-03-qa-to-quality-engineering-transition.md` | `e05b762e00f80fc1c0a4b9bd788e07de40cf0ff23a93016c69bc0268bed8119e` | `a4e1a5adbfc53ae6c8f9234474bc714eb34adb60f684e12d38d174c091e827d6` | 0.1.0 |

Body is the exact suffix after the first `\n## ` delimiter (the delimiter is unchanged). Only `| **Version** | 0.1.0 |` plus LF is inserted immediately before Status. Removing that one row reproduces each incoming file exactly, including metadata, links and body.

## Frozen authoring scope

- `CURRENT_SPRINT.md` — GATE-DEFECT GOVERNANCE
- `README.md` — GATE-DEFECT GOVERNANCE
- `book/part-01-foundations/case-studies/case-study-01-quality-beyond-test-execution.md` — CASE-STUDY METADATA CORRECTION
- `book/part-01-foundations/case-studies/case-study-02-shared-ownership-and-engineering-culture.md` — CASE-STUDY METADATA CORRECTION
- `book/part-01-foundations/case-studies/case-study-03-qa-to-quality-engineering-transition.md` — CASE-STUDY METADATA CORRECTION
- `docs/02-first-edition-review/FE_AG1R1_CORRECTION_EVIDENCE.md` — GATE-DEFECT GOVERNANCE
- `docs/02-first-edition-review/FIRST_EDITION_FINDINGS.md` — GATE-DEFECT GOVERNANCE
- `docs/02-first-edition-review/FIRST_EDITION_REVIEW_LOG.md` — GATE-DEFECT GOVERNANCE
- `docs/02-first-edition-review/FIRST_EDITION_VERIFICATION_LEDGERS.md` — GATE-DEFECT GOVERNANCE
- `tests/test_first_edition_gate.py` — COUPLED TEST
- `tools/first_edition_gate.py` — DETERMINISTIC STRUCTURAL CONTROL
- `website/evidence/fe-ag1r1/source-transition.json` — COUPLED TEST
- `website/src/lib/content/loader.ts` — DETERMINISTIC STRUCTURAL CONTROL
- `website/tests/case-study-metadata.test.ts` — COUPLED TEST
- `website/tests/preservation.ts` — COUPLED TEST

Current banners are additive supersessions; historical records/counts remain point-in-time evidence. FE-EV-056 is the next unique event and appends authorship only. The baseline checker admits exactly FE-J-001 OPEN / NOT VERIFIED alongside the historical 29 CLOSED / VERIFIED; historical package allocation remains zero and new allocation remains one. This deterministic health expectation conveys no gate acceptance. All original chapter/Part and quantitative identities remain frozen.

## Recurrence control and exact preservation

The Markdown loader checks the leading metadata table of every dynamically discovered case study: exactly one Version with a valid semantic version. Tests cover the complete discovered population and missing, blank, malformed, duplicate and misplaced rows. Disposable real-file mutations must be rejected directly by the loader, independently of exact-hash guards.

The FE-AG1R1 source-transition fixture binds exact authored source bytes to the incoming baseline and replays the unchanged WEB-5/FE-1/FE-2/FE-3 preservation chain. It is explicitly an UNVERIFIED AUTHOR CANDIDATE, not an accepted baseline. It neither replaces historical fixtures nor exempts arbitrary changed files. The external package manifest binds all 15 files, including the fixture and coupled guard.

## Verification handoff and acceptance boundary

Author logs, complete population checks, body comparison, negative controls, historical immutability checks, regression counts, raw lexical candidate manifest and PACKAGE_SHA256 belong to `/tmp/msqe-fe-ag1r1/MSQE-FE-AG1R1-STRUCTURAL-DEFECT-CORRECTION-REPORT.md`. They establish author evidence only.

Fresh independent FE-AG1R1V must re-derive Version values and population, reproduce the exact package digest, verify all metadata/body/governance/control manifestations and regressions, and assess preservation evolution. Public rendering remains on the unchanged incoming production baseline; live correction verification follows only a separately authorized deployment. Any closure recording and any FE-AG1 resumption require separate authorization after independent verification. Do not reuse old PASS results for changed units.

**First Edition IN PROGRESS; FE-AG1 NOT ACCEPTED / REMEDIATION PENDING; FE-AG2 NOT STARTED; v1.0.0 NOT YET RELEASED. FE-J-001 remains OPEN / NOT VERIFIED. Historical 29 remain CLOSED / VERIFIED. UNSTAGED / UNCOMMITTED / UNPUSHED; no deployment.**

## FE-J-001R — Additive independent acceptance and closure preparation

**FE-J-001 CLOSED / VERIFIED** under independently supplied **FE-AG1R1V2: 36 PASS / 0 FAIL / 0 INCOMPLETE, Decision A**, accepted correction package `07b6ff0c5a50c0584ede8da193bb354a5d874992e3d491afb3f81d0773a028dc`. Authority: `/tmp/msqe-fe-ag1r1v2/MSQE-FE-AG1R1V2-VERIFICATION-REPORT.md` (SHA-256 `2280ee2cd20c4a84625dd76a6b3827391b064233ecc1b29e65a04ba18b3f5818`) and its `accepted-package-manifest.txt`. FE-AG1 discovered the three Version omissions; FE-AG1R1 added Version 0.1.0 and the recurrence guard; initial FE-AG1R1V returned B (33 PASS / 1 FAIL) for the guard's template-separator false rejection; FE-AG1R1F1 corrected that guard; FE-AG1R1V2 independently accepted the exact final correction. No discovery evidence or accepted correction bytes are rewritten.

Historical remediation: **29 total / 29 CLOSED / VERIFIED**. Acceptance-gate defects: **1 total / 1 CLOSED / VERIFIED / 0 OPEN / NOT VERIFIED**. Current unresolved known defects: **0**. FE-1/FE-2/FE-3 remain COMPLETE / CLOSED / VERIFIED.

**FE-AG1: NOT YET ACCEPTED / READY FOR CONTROLLED RESUMPTION AFTER CHECKPOINT, DEPLOYMENT AND LIVE ACCEPTANCE. First Edition: IN PROGRESS. Comprehensive acceptance: IN PROGRESS / FE-AG1 PAUSED. FE-AG2: NOT STARTED. v1.0.0: NOT YET RELEASED.** Closing FE-J-001 does not retroactively accept FE-AG1. Fresh independent **FE-J-001CV** must verify this closure-only package before any separately authorized checkpoint. **UNSTAGED / UNCOMMITTED / UNPUSHED; no deployment.**

The earlier authoring statuses and handoff describe their historical point in time. This addendum records independent acceptance and supersedes them as current state. The three case-study files, loader and six direct contract test groups remain frozen. The explicit preservation transition retains the accepted package manifest, authenticates its digest and separately pins closure-output identities. Baseline lifecycle expectation becomes historical 29 CLOSED / VERIFIED plus one gate defect CLOSED / VERIFIED; current gate allocation becomes zero. No historical manifest or quantitative expectation changes. External closure drift inventory, negative controls, layer models, raw final package fingerprint and author report: `/tmp/msqe-fe-j001r/MSQE-FE-J-001R-CLOSURE-PREPARATION-REPORT.md`.
