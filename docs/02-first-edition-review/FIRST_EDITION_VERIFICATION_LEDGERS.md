# First Edition Verification Ledgers

| Field | Value |
| --- | --- |
| **Project** | Modern Software Quality Engineering (MSQE) |
| **Milestone** | v0.16.0 — First Edition Review |
| **Document type** | Review artefact 3 of 4 — **Evidence** |
| **Authority** | [`FIRST_EDITION_REVIEW_PLAN.md`](FIRST_EDITION_REVIEW_PLAN.md) §13.1, §13.2 |
| **Lifecycle** | Populated Phase F |
| **State** | **Initialised at F0 — no verification record exists** |
| **Owner** | Tunde Ajala |

> This is a **governance artefact**, not a manuscript chapter. It carries no chapter-style status.

> **This artefact records all verification records, including passes** — not only defects. A passing verification is evidence and belongs here; a defect additionally receives a finding in `FIRST_EDITION_FINDINGS.md`.

> **Nothing has been verified.** Every ledger below is structure only, with zero rows. **No check is marked `PASS` at F0**, because no check has been run.

---

## 0. Verification status vocabulary

Every ledger row carries exactly one status from this closed set:

| Status | Meaning |
| --- | --- |
| **`NOT CHECKED`** | The item is in the population but has not been inspected. **The F0 initial state for every item.** |
| **`PASS`** | Inspected; no defect found. **Requires evidence that an inspection actually occurred.** |
| **`FAIL`** | Inspected; defect found. **Must carry a finding ID.** |
| **`NOT APPLICABLE`** | The check does not apply to this item, with the reason stated |
| **`DEFERRED`** | Inspection deliberately postponed, with destination and trigger |
| **`BLOCKED`** | Inspection attempted but impossible, with the obstacle stated |

> **A status is never `PASS` merely because no issue is currently known.** Plan §5.4: *"For a 'no defect found' outcome, the evidence field must demonstrate that an inspection actually occurred."* A bare *"reviewed / no defect"* does not satisfy the control and does not count toward coverage.

**Structural-scan evidence (plan §5.4).** Where the method is a structural scan, the evidence field must establish that **the scan actually ran against the named object**. Any one suffices: tool or check name **with** version or script revision · command or check identifier · output or saved-report reference · result digest or hash · a reproducible result summary tied to the inspected object. **A bare `scan clean` is explicitly insufficient.**

**Sampling (plan §8).** Where a ledger's population is sampled, all six controls are declared **before selection**: population and size · sample size · selection method (with seed or strata) · risk variables where risk-weighted · rationale · reproducibility. **No post-hoc sample justification.** A category may not score above 80% of its weight without a declared sample size.

---

## 1. Source Verification Ledger

**Level 7 · Transversal T2.** Population at plan time: **378 footnote definitions across 210 distinct URLs**. **Census — no sampling.**

**Verification levels:** `PRIMARY-FULL` (full text inspected) · `PRIMARY-PARTIAL` (abstract or excerpt) · `METADATA` (registry-confirmed) · `SECONDARY` (corroborated indirectly) · `UNVERIFIED`.

**Four binding rules (plan §7 / L7):**

1. **HTTP accessibility is not source validity.** A 200 proves a URL resolves, nothing more.
2. **A 403 is not link rot.** ISO, ACM, IEEE, JSTOR and BMJ block automated clients by design. **A valid publisher URL is never replaced on this basis.**
3. **Verification level is recorded as achieved, never as intended.**
4. **Claim–source alignment is the primary test** — a real, live, correctly cited source that does not support the sentence citing it is a defect invisible to every link checker.

A source is verified **once** and its result reused; **claim alignment is assessed per citation**, because the same source may be cited correctly in one Part and overreached in another.

| Row ID | Part | Chapter | Footnote key | Source | URL | Verification level | Access result | **Claim–source alignment** | Limitation | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| *(0 rows — `NOT CHECKED`)* | | | | | | | | | | | |

---

## 2. Numerical Verification Ledger

**Level 8 · Transversal T3.** Population: **1,213 Tier-1 claims** (census — **no Part exempt**) plus **1,511 Tier-2 candidates** triaged per chapter into claim or identifier; confirmed Tier-2 claims join this ledger. **Code-fence numerics (186) are a separate population**, reviewed where technically relevant, and are neither Tier 1 nor Tier 2.

**Method:** recompute with **exact rational arithmetic**; test **every displayed intermediate as written**; apply **rounding-aware comparison** (`ROUND_HALF_UP` to the displayed precision).

> **The dual verdict is mandatory.** `ARITHMETIC: PASS / INFERENCE: FAIL` must be expressible. **A correct calculation can support an invalid conclusion.**

**Inference tests:** is the denominator defined? did the population change mid-window? is a proxy treated as the construct? does a percentage change conceal a mix shift? is a correlation stated as cause?

| Row ID | Part | Chapter | Tier | Class (`pct`/`cur`/`unit`/`ratio`/`perN`/`thou`/`dec`) | Claim as written | Displayed chain | Recomputed value | **ARITHMETIC verdict** | **INFERENCE verdict** | Inference test applied | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| *(0 rows — `NOT CHECKED`)* | | | | | | | | | | | | |

---

## 3. Terminology Register

**Level 6 · Transversal T1.** **Census** of standards claims; census of terms appearing in **three or more Parts**.

**Bidirectional test:**

- **SAME TERM → DIFFERENT MEANING** — collect definitions across Parts; verdict `CONSISTENT` / `CONTEXTUAL` / **`INCONSISTENT`**.
- **DIFFERENT TERM → SAME CONCEPT** — cluster synonyms; verdict `INTENTIONAL` / **`UNDECLARED`**.

> Both are separated from legitimate contextual variation by one test: **is the variation stated in the text?** Stated is contextual; unstated is a defect.

**Only standards the repository actually cites are checked. No standards dependency is invented.** Each standards claim records standard, edition, claim, verification level and limitation; where only secondary verification is possible the claim is **narrowed** and the limitation carried openly.

| Row ID | Term or standard | Type (term / standards claim) | Parts of occurrence | Definitions collected | Verdict | Variation stated in text? | Standard + edition | Verification level | Limitation | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| *(0 rows — `NOT CHECKED`)* | | | | | | | | | | | |

---

## 4. Concept Consistency Matrix

**Level 5 · Transversal T1.** **Census** of every concept appearing in **three or more Parts** with definitional or instructional weight. **Concept selection is evidence-driven from occurrence data, not from a pre-supplied list.**

**Cell classification:**

| Class | Meaning | Evidence required |
| --- | --- | --- |
| **A** | progressive deepening | quote both; show the extension |
| **B** | intentional reinforcement | quote the signpost |
| **C** | contextual reinterpretation | quote both; show the lens is stated |
| **D** | harmless terminology variation | quote both; show semantic identity |
| **E** | unnecessary duplication | quote both; show no added value |
| **F** | contradictory definition | **quote both verbatim; state the logical conflict** |
| **G** | conceptual drift | quote three or more points showing the trajectory |
| **H** | later teaching invalidating earlier | quote both; show what breaks |

> **Every non-D cell carries a Part and chapter citation. F, G and H require verbatim quotation of both sides — no paraphrase.** Ownership is recorded per concept: which Part **owns** the definition, which merely **uses** it. **A concept with two owners is a candidate E or F.**

| Row ID | Concept | Owning Part | Using Parts | I | II | III | IV | V | VI | VII | VIII | IX | X | XI | XII | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| *(0 rows — `NOT CHECKED`)* | | | | | | | | | | | | | | | | | |

---

## 5. QA → QE Progression Matrix

**Level 9 · Transversal T4.** **Census — 19 capability dimensions × 12 Parts = 228 cells.**

Per cell: **level** (`Not addressed` / `Introduced` / `Developed` / `Applied` / `Integrated`), **evidence** (chapter plus quotation), **prerequisite**.

**Derived analyses, all required:** prerequisite trace · monotonicity · abandonment · difficulty gradient · circularity · **QA/QE dichotomy audit**.

| Row ID | Capability dimension | I | II | III | IV | V | VI | VII | VIII | IX | X | XI | XII | Prerequisite trace | Monotonic? | Abandoned? | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| *(0 of 19 dimensions traced — `NOT CHECKED`)* | | | | | | | | | | | | | | | | | | |

---

## 6. Cross-Part Dependency Matrix

**Levels 3, 10, 15, 19 · Transversals T4, T5.** Records every declared cross-Part handoff, deferral and dependency, and whether it was **delivered**.

> Plan §4 Level 3: **independently re-derive; never accept the README's self-description.** An **undelivered declared handoff** is a named defect class.

**Level 15 (Atlas continuity) classification — scope Parts III–XII:** **`EVOLUTION`** (signposted) · **`CONTEXTUAL VARIATION`** (different lens, no conflict) · **`AMBIGUITY`** (under-specified — record, do not force) · **`CONTRADICTION`** (facts cannot both hold).

**Level 19 (technical contradiction) classification:** **`CONTRADICTION`** — statements cannot both be true **under the same stated conditions** · **`CONTEXT-DEPENDENT TRADE-OFF`** — they hold under **different stated conditions**.

> **Operational test:** is the differentiating condition **stated in the text**? Stated is a legitimate trade-off. **Unstated is a contradiction in effect even if reconcilable in principle** — the defect is the missing condition, and the correction is usually to state it, not to delete one side.

| Row ID | Type (handoff / deferral / Atlas dimension / technical subject) | Source Part+chapter | Target Part+chapter | Declared where | Delivered? | Classification | Evidence (verbatim both sides where required) | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| *(0 rows — `NOT CHECKED`)* | | | | | | | | | |

---

## 7. Coverage Control Matrix

**Plan §5.4.** Not a seventh ledger — this is the **coverage exit control**, maintained throughout Phase F. Sections 1–6 above are the six ledgers required by plan §13.2 and are complete as specified.

> **137/137 chapter coverage on both axes is mandatory.**

**A cell counts as complete only when it records all six fields:**

| Field | Content |
| --- | --- |
| **Inspection status** | inspected / not-inspected / blocked |
| **Method** | e.g. recomputation, citation verification, standards cross-check, claim sampling, structural scan |
| **Object / population** | what was inspected and its size |
| **Evidence or reference** | recomputed value, verification level, claim inspected, or **ledger row ID** |
| **Result** | defect found / no defect found |
| **Finding ID** | where a defect was found |

> **The purpose is auditability, not paperwork volume.** A ledger row ID is sufficient where a ledger row exists. Quotation is required only where no other artefact captures the inspection.

**Axis coverage summary at F0:**

| Axis | Unit | Complete | Total | Note |
| --- | --- | --- | --- | --- |
| Longitudinal | chapters | **0** | **137** | L1 0/22 · L2 0/34 · L3 0/33 · L4 0/24 · L5 0/24 |
| Transversal T1 | chapters | **0** | 137 | |
| Transversal T2 | chapters | **0** | 137 | |
| Transversal T3 | chapters | **0** | 137 | |
| Transversal T4 | chapters | **0** | 137 | Requires L9, L10 **and L16** each inspected |
| Transversal T5 | chapters | **0** | **115** | **Parts III–XII only** — Parts I–II are legitimately outside the Atlas case |
| Transversal T6 | chapters | **0** | 137 | |

| Row ID | Part | Chapter | Axis | Batch/transversal | Inspection status | Method | Object / population | Evidence or ledger row | Result | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| *(0 of 137 chapters inspected on either axis)* | | | | | | | | | | |

---

## 8. Level execution routing (plan §5.3)

**Every level and supporting pass has exactly one declared execution route. No level or pass is unassigned.**

| Level | Route | Ledger section |
| --- | --- | --- |
| 1 — Repository and governance integrity | Longitudinal | §7 coverage; governance evidence in findings |
| 2 — Whole-book architecture | Longitudinal | §6 |
| 3 — Part architecture | Longitudinal | §6 |
| 4 — Chapter integrity | Longitudinal | §7 coverage |
| 5 — Cross-Part conceptual consistency | **T1** | §4 |
| 6 — Terminology and standards consistency | **T1** | §3 |
| 7 — Evidence and citation integrity | **T2** | §1 |
| 8 — Numerical and analytical integrity | **T3** | §2 |
| 9 — Pedagogical progression | **T4** | §5 |
| 10 — Professional applicability | **T4** | §6 |
| 11 — Editorial consistency and accessibility | **T6** | §7 coverage |
| 12 — Publication readiness | Gate phase | gate record |
| 13 — Final First Edition Quality Gate | Gate phase | gate record |
| **15 — Atlas continuity** (supporting) | **T5** | §6 |
| **16 — Exercise progression** (supporting) | **T4** | §5 |
| **19 — Technical contradiction** (supporting) | **T5** | §6 |

> **Levels 14, 17 and 18 do not exist and must not be invented.** A supporting pass is not a lesser obligation: each has an execution route, an exit criterion, and the same correctness threshold as a numbered level. **Any coverage structure built for only 13 dimensions is incomplete.**

---

## 9. Accessibility objective checks (plan §10)

Census across all 137 chapters, reported as a **distinct subsection** of the Editorial Consistency Report so accessibility receives a named minimum rather than competing informally for category 7's weight. Executed under **Level 11 / T6**; recorded in §7 above.

| Check | Population | Complete |
| --- | --- | --- |
| Heading-order integrity | 137 | **0** |
| Table-header presence | 137 | **0** |
| Descriptive link text | 137 | **0** |
| Image alt-text presence | 137 | **0** |

> **Judgement-dependent accessibility** — contrast, alt-text sufficiency, reading level — **remains out of scope while no authoritative accessibility standard exists.** Plan §9: **Level 11 does not score against absent standards.** The standard's absence is a **Governance Integrity** matter (category 8), dispositioned at Phase E, and is **never an editorial deduction**.

---

**Last Updated:** 2026-08-16
