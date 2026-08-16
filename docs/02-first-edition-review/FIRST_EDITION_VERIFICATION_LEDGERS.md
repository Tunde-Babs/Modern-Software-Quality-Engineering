# First Edition Verification Ledgers

| Field | Value |
| --- | --- |
| **Project** | Modern Software Quality Engineering (MSQE) |
| **Milestone** | v0.16.0 — First Edition Review |
| **Document type** | Review artefact 3 of 4 — **Evidence** |
| **Authority** | [`FIRST_EDITION_REVIEW_PLAN.md`](FIRST_EDITION_REVIEW_PLAN.md) §13.1, §13.2 |
| **Lifecycle** | Populated Phase F |
| **State** | **F-L1 populated (Parts I–II). Batches L2–L5 and transversals T1–T6 not started** |
| **Owner** | Tunde Ajala |

> This is a **governance artefact**, not a manuscript chapter. It carries no chapter-style status.

> **This artefact records all verification records, including passes** — not only defects. A passing verification is evidence and belongs here; a defect additionally receives a finding in `FIRST_EDITION_FINDINGS.md`.

> **F-L1 evidence is recorded below for Parts I–II only.** All populations outside L1 remain `NOT CHECKED`. Transversal-owned ledgers (§1 Source, §2 Numerical, §3 Terminology, §4 Concept, §5 Progression, §6 Dependency) carry **batch-local L1 evidence only**; none is transversally complete, because T1–T6 have not run.

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

**L1 population reconciled: 110 footnote definitions across 22 chapters (Part I 66, Part II 44), 69 distinct URLs in definitions. This reconciles exactly with the plan §5.2 figure of 110 citations for L1.** Edition population 378/210 remains `NOT CHECKED` outside L1.

| Row ID | Scope | Source / claim | Verification level | Access result | Claim–source alignment | Limitation | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SRC-L1-01 | I ch01–03, 06, 08, 09 · `[^iso25010]`, `[^iso25010current]` | ISO/IEC 25010:2023 — Product quality model. Manuscript claims **nine** product-quality characteristics: functional suitability, performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, safety | `SECONDARY` | iso.org returns **HTTP 403** — bot protection, **not link rot** (plan L7 rule 2). URL form `standard/78176.html` well-formed and consistent with siblings | **ALIGNED** — the nine names and the count match the 2023 edition; *interaction capability* correctly replaces *usability* and *flexibility* replaces *portability*; *safety* correctly added | Full standard text is paywalled; not inspected. Verification recorded as achieved, not intended | `PASS` | — |
| SRC-L1-02 | I ch03 · `[^iso25010legacy]` | ISO/IEC 25010:2011 described as **withdrawn**, eight characteristics incl. usability and portability | `SECONDARY` | 403 as above | **ALIGNED** — the 2011 eight-characteristic set and its withdrawal are correctly stated | Paywalled | `PASS` | — |
| SRC-L1-03 | I ch02 L61, L90 · ch03 L58 · `[^iso9000]` | **ISO 9000:2026 — Quality management — Fundamentals and vocabulary** | `SECONDARY` | iso.org 403; corroborated via ANSI, BSI, CEN and iTeh catalogue records | **ALIGNED** — investigated as a suspected fabricated edition and the hypothesis was **falsified**. ISO 9000:2026 is the real **fifth edition**, published May 2026, cancelling and replacing ISO 9000:2015. The title change from *"Quality management **systems** — Fundamentals and vocabulary"* to *"Quality management — Fundamentals and vocabulary"* is a genuine change in this edition and the manuscript reproduces it correctly. The non-standard URL form `iso.org/standard/9000` is the form ISO itself publishes for this record | Paywalled; edition verified from catalogue records rather than standard text | `PASS` | — |
| SRC-L1-04 | I ch06 L347 · `[^iso12207]` | **ISO/IEC/IEEE 12207:2026**, "Published April 2026" | `SECONDARY` | iso.org 403; corroborated via ANSI, IEEE Xplore, IEC and iTeh records | **ALIGNED** — 12207:2026 is real, published **29 April 2026**, cancelling and replacing 12207:2017. URL `standard/90219.html` is correct | Paywalled | `PASS` | — |
| SRC-L1-05 | I ch01, 02, 03 · `[^swebok]` and Further Reading | SWEBOK Guide **v4.0**, IEEE Computer Society | `SECONDARY` | computer.org URL well-formed | **ALIGNED** — SWEBOK v4.0 released **15 October 2024** by IEEE CS, 18 knowledge areas | Guide text not inspected in full | `PASS` | — |
| SRC-L1-06 | I · `[^iso29119]`, `[^iso25030]`, `[^iso25041]`, `[^iso25000]` | ISO/IEC/IEEE 29119-1:2022 · ISO/IEC 25030:2019 · ISO/IEC 25041:2012 · ISO/IEC 25000:2014 | `METADATA` | All URLs use the well-formed `standard/<id>.html` catalogue pattern; iso.org 403 | Designator, edition year and title consistent with the SQuaRE/29119 series as cited | Registry-level confirmation only; claim-level alignment not individually verified against standard text | `PASS` | — |
| SRC-L1-07 | II ch10 (4 keys), ch11 (2 keys) | `pro-git`, `git-rebase`, `github-pr`, `google-review`, `meszaros`, `feathers` | `NOT APPLICABLE` | n/a | **CANNOT BE ASSESSED** — these definitions carry **no in-body citation marker**, so there is no claim to align a source to | Six of L1's 110 citations are unattached | `FAIL` | **FE-L1-003** |
| SRC-L1-08 | L1 remainder — 104 of 110 definitions | Non-standards sources (Fowler, Google eng-practices, MDN, TypeScript docs, NIST, OWASP, DORA, SRE book, etc.) | `NOT CHECKED` | — | — | Individual claim–source alignment for the non-standards population is **transversal T2 work** and was not completed by L1 | `NOT CHECKED` | — |

---

## 2. Numerical Verification Ledger

**Level 8 · Transversal T3.** Population: **1,213 Tier-1 claims** (census — **no Part exempt**) plus **1,511 Tier-2 candidates** triaged per chapter into claim or identifier; confirmed Tier-2 claims join this ledger. **Code-fence numerics (186) are a separate population**, reviewed where technically relevant, and are neither Tier 1 nor Tier 2.

**Method:** recompute with **exact rational arithmetic**; test **every displayed intermediate as written**; apply **rounding-aware comparison** (`ROUND_HALF_UP` to the displayed precision).

> **The dual verdict is mandatory.** `ARITHMETIC: PASS / INFERENCE: FAIL` must be expressible. **A correct calculation can support an invalid conclusion.**

**Inference tests:** is the denominator defined? did the population change mid-window? is a proxy treated as the construct? does a percentage change conceal a mix shift? is a correlation stated as cause?

**L1 population.** Accepted census: Tier-1 **23**, Tier-2 **43**, code-fence **32**. This review enumerated the **union** of two independent classifier runs — 23 spans — and verified all of them. **Six are version strings, not quantitative claims (FE-L1-006); the genuine Tier-1 population is 17, and all 17 were recomputed.**

| Row ID | Part·Ch·Line | Class | Claim as written | Recomputed / tested | **ARITHMETIC** | **INFERENCE** | Inference test applied | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NUM-L1-01 | I·1·73 | `pct` | "complete **95%** of requests within 300 ms at the agreed peak workload, excluding client-network time" | Proportion target, no computation | **PASS** | **PASS** | Population defined (*authenticated catalogue searches*); workload stated (*agreed peak*); exclusion stated (*client-network time*). No undefined denominator | `PASS` | — |
| NUM-L1-02 | I·1·73 | `unit` | "within **300 ms**" | Threshold, no computation | **PASS** | **PASS** | Bound to the same defined population as NUM-L1-01 | `PASS` | — |
| NUM-L1-03 | I·1·419 | `pct` | "A team reports **95%** automated-test coverage but customers still encounter critical failures" | No computation — interview prompt | **PASS** | **PASS** | Deliberately poses coverage-as-proxy invalidity; proxy is **not** treated as the construct | `PASS` | — |
| NUM-L1-04 | I·3·159 | `pct` | "**95%** of a defined class of booking requests complete within an agreed time under expected peak demand" | Proportion target | **PASS** | **PASS** | Population explicitly *"a defined class"*; workload stated | `PASS` | — |
| NUM-L1-05 | I·6·24 | `dec` | "a **1.2**-second timeout—the maximum wait" | 1.2 s vs observed 1.5 s | **PASS** | **PASS** | 1.5 > 1.2 ⇒ timeout fires. Consistent | `PASS` | — |
| NUM-L1-06 | I·6·24 | `unit` | "Some responses arrive at **1.5 seconds**" | See NUM-L1-05 | **PASS** | **PASS** | Retry-amplification chain checked: client timeout does **not** cancel server-side work; pool exhaustion follows; health checks pass while system fails. Causally sound. Explicitly framed *"illustrative scenario"*, so not presented as measurement | `PASS` | — |
| NUM-L1-07 | I·7·423 | `unit` | "move from QA gatekeeping to Quality Engineering enablement in **90 days**" | Interview prompt | **PASS** | **PASS** | No inference drawn | `PASS` | — |
| NUM-L1-08 | I·8·282 | `unit` | "A useful QA-to-QE roadmap spans **12–24 months**" | Range | **PASS** | **PASS** | Stated as *"useful"* guidance, not a measured finding; hedged | `PASS` | — |
| NUM-L1-09..12 | I·10·407–410 | `unit` ×4 | Time-horizon table: 0–**6 months** · 6–**18 months** · 18–**36 months** · 36–**60 months** | Boundary continuity checked | **PASS** | **PASS** | Contiguous, non-overlapping, monotonically increasing; shared endpoints are the conventional form. No gap | `PASS` | — |
| NUM-L1-13 | II·1·209 | `unit` | "a policy might say that an execution over **750 milliseconds** is slow for a particular environment" | Threshold | **PASS** | **PASS** | Explicitly framed as **policy, not fact** — the chapter's policy/mechanism distinction | `PASS` | — |
| NUM-L1-14 | II·3·379 | `unit` | "It cannot prove … that **750 milliseconds** is an acceptable threshold" | Threshold | **PASS** | **PASS** | Exemplary: states the limit of what the evidence supports | `PASS` | — |
| NUM-L1-15..16 | II·11·103 | `unit` ×2 | "assert a timeout at **200 milliseconds** of virtual time without waiting **200 milliseconds** in the real world" | Fake-clock semantics | **PASS** | **PASS** | Virtual vs wall-clock time correctly distinguished; no claim that real elapsed time is measured | `PASS` | — |
| NUM-L1-17 | II·12·121 | `unit` | "If an execution of exactly **500 milliseconds** is 'slow,' encode and test `durationMs >= slowThresholdMs`. If it is not slow, encode and test `>`" | Boundary logic evaluated both ways | **PASS** | **PASS** | Inclusive boundary ⇒ `>=`; exclusive ⇒ `>`. **Logically correct in both branches** | `PASS` | — |
| NUM-L1-18..23 | I·1·435 · I·2·347 · I·2·363 · I·3·423 · I·3·441 · I·10·519 | `dec` ×6 | `4.0` (SWEBOK Version 4.0) ×5 · `1.1` (SSDF Version 1.1) ×1 | Not quantitative claims | **NOT APPLICABLE** | **NOT APPLICABLE** | Version strings captured from retained link text and footnote-definition lines | `NOT APPLICABLE` | **FE-L1-006** |
| NUM-L1-T2 | L1 Tier-2 | — | 43 accepted Tier-2 candidates | Triage not completed | — | — | Tier-2 per-chapter triage is **transversal T3** work; L1 confirmed no Tier-2 candidate was promoted to a Tier-1 claim | `NOT CHECKED` | — |
| NUM-L1-CF | L1 code-fence | — | 32 accepted code-fence numerics | Reviewed as part of executable verification (see §6 note) rather than as claims | — | — | Plan §6.2: code-fence numerics are neither Tier 1 nor Tier 2 | `NOT APPLICABLE` | — |

---

## 3. Terminology Register

**Level 6 · Transversal T1.** **Census** of standards claims; census of terms appearing in **three or more Parts**.

**Bidirectional test:**

- **SAME TERM → DIFFERENT MEANING** — collect definitions across Parts; verdict `CONSISTENT` / `CONTEXTUAL` / **`INCONSISTENT`**.
- **DIFFERENT TERM → SAME CONCEPT** — cluster synonyms; verdict `INTENTIONAL` / **`UNDECLARED`**.

> Both are separated from legitimate contextual variation by one test: **is the variation stated in the text?** Stated is contextual; unstated is a defect.

**Only standards the repository actually cites are checked. No standards dependency is invented.** Each standards claim records standard, edition, claim, verification level and limitation; where only secondary verification is possible the claim is **narrowed** and the limitation carried openly.

**Batch-local L1 evidence only. The census of terms appearing in three or more Parts is transversal T1 work and has not run.**

| Row ID | Term / standards claim | Parts observed | Verdict | Variation stated in text? | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- |
| TRM-L1-01 | Quality Engineering · Quality Assurance · Quality Control · testing | I (ch01 table, ch02) | **CONSISTENT** within L1 — each defined by its *primary question*, *typical activities* and *limitation when used alone*; QE stated to include testing and possibly QA/QC | **Yes** — ch01 line 82 states explicitly *"Their boundaries differ across organisations, so teams should establish shared meanings."* Stated variation is contextual, not a defect (plan L6 test) | `PASS` | — |
| TRM-L1-02 | product-quality characteristic vs engineering capability (observability, testability, deployability) | I ch01, 02, 03, 04, 06, 08, 09 | **CONSISTENT** — every one of the seven occurrences keeps observability/testability/deployability **outside** the ISO/IEC 25010 characteristic set. ch06 additionally rules resilience out as *"not a tenth ISO/IEC 25010 characteristic"*, consistent with the stated count of nine | Yes | `PASS` | — |
| TRM-L1-03 | ISO/IEC 25010 characteristic count | I ch01, 03, 06 | **CONSISTENT** — "nine" stated in ch01 L61 and ch03 L125/L330/L338; the enumerated names match; the 2011 eight-characteristic set is contrasted, not conflated | Yes | `PASS` | — |
| TRM-L1-04 | `null` vs `undefined` vs omitted property | II ch02, 03, 07, 12 | **CONSISTENT** — omission means "not supplied", `null` means "known to have no value"; ch02 requires the domain meaning to be documented rather than used interchangeably | Yes | `PASS` | — |
| TRM-L1-05 | Cross-Part terminology census (terms in ≥3 Parts) | — | — | — | `NOT CHECKED` — **transversal T1** | — |

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

**Batch-local L1 evidence only. Concept selection must be evidence-driven from edition-wide occurrence data (transversal T1); that census has not run, so no cell is classified for Parts III–XII.**

| Row ID | Concept | Owning Part (observed) | I | II | Class within L1 | Evidence | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CON-L1-01 | Quality as a system property | I ch01 (owner) | defines | uses | **A — progressive deepening** | ch01 *"Quality as a System Property"*; ch06 extends it to cross-service failure propagation without redefining it | `PASS` | — |
| CON-L1-02 | Evidence (as distinct from test results) | I ch01 (owner) | defines | uses | **A — progressive deepening** | Part I frames evidence for decisions; Part II ch01/ch03 turn execution records into evidence and state explicitly what the code *cannot* prove | `PASS` | — |
| CON-L1-03 | Policy vs mechanism | II ch01 (owner) | — | defines and reuses | **B — intentional reinforcement** | ch01 L209 introduces it; ch03 L379 and ch12 L121 reuse it for threshold decisions with a signposted callback | `PASS` | — |
| CON-L1-04 | Observability | I ch02 (owner) | defines | — | **D — harmless variation** | ch02 L166 and ch01 L67 give semantically identical definitions in different words; both state it is a capability, not a 25010 characteristic | `PASS` | — |
| CON-L1-05 | Full concept census across Parts I–XII | — | — | — | — | — | `NOT CHECKED` — **transversal T1** | — |

---

## 5. QA → QE Progression Matrix

**Level 9 · Transversal T4.** **Census — 19 capability dimensions × 12 Parts = 228 cells.**

Per cell: **level** (`Not addressed` / `Introduced` / `Developed` / `Applied` / `Integrated`), **evidence** (chapter plus quotation), **prerequisite**.

**Derived analyses, all required:** prerequisite trace · monotonicity · abandonment · difficulty gradient · circularity · **QA/QE dichotomy audit**.

**Batch-local L1 evidence only. The 19-dimension × 12-Part census is transversal T4 and has not run; 0 of 19 dimensions are traced across all twelve Parts.**

| Row ID | Observation | Evidence | Status | Finding ID |
| --- | --- | --- | --- | --- |
| PRG-L1-01 | Part I establishes the QA→QE shift explicitly rather than assuming it | ch02 is dedicated to the evolution and states it is **not** a replacement sequence (first review question, ch02); ch08 defines the role by responsibilities rather than title | `PASS` | — |
| PRG-L1-02 | Part II builds engineering capability rather than teaching syntax for its own sake | Every chapter frames code as a quality instrument — ch01 *programming as a QE practice*; ch11 *testing the utility itself*; ch12 capstone produces a portfolio toolkit. Scope boundaries are stated (ch06: *"does not attempt an event-loop internals course, distributed-systems design, SRE practice, or an API-automation framework"*) | `PASS` | — |
| PRG-L1-03 | Prerequisite integrity across the I→II boundary | Part II README declares TypeScript as primary implementation language and states its own prerequisites; no Part II chapter was found to depend on a capability that neither Part I nor an earlier Part II chapter introduces | `PASS` | — |
| PRG-L1-04 | Exercise progression (Level 16) | Census: **197 review questions, 173 interview questions, 22/22 practical exercises**. Declared sample — first review question of each of the 22 chapters, stratified by chapter, deterministic, reproducible: **22/22 pass the copy-adjacent-prose test** (each requires a reason, distinction or judgement, not restatement) and **22/22 pass the untaught-capability test** | `PASS` | — |
| PRG-L1-05 | 19-dimension progression matrix | — | `NOT CHECKED` — **transversal T4**; L16 completion also requires T4 | — |

---

## 6. Cross-Part Dependency Matrix

**Levels 3, 10, 15, 19 · Transversals T4, T5.** Records every declared cross-Part handoff, deferral and dependency, and whether it was **delivered**.

> Plan §4 Level 3: **independently re-derive; never accept the README's self-description.** An **undelivered declared handoff** is a named defect class.

**Level 15 (Atlas continuity) classification — scope Parts III–XII:** **`EVOLUTION`** (signposted) · **`CONTEXTUAL VARIATION`** (different lens, no conflict) · **`AMBIGUITY`** (under-specified — record, do not force) · **`CONTRADICTION`** (facts cannot both hold).

**Level 19 (technical contradiction) classification:** **`CONTRADICTION`** — statements cannot both be true **under the same stated conditions** · **`CONTEXT-DEPENDENT TRADE-OFF`** — they hold under **different stated conditions**.

> **Operational test:** is the differentiating condition **stated in the text**? Stated is a legitimate trade-off. **Unstated is a contradiction in effect even if reconcilable in principle** — the defect is the missing condition, and the correction is usually to state it, not to delete one side.

**Batch-local L1 evidence only. Edition-wide pairwise contradiction analysis (L19) and Atlas continuity (L15) are transversal T5 and have not run.**

| Row ID | Type | Scope | Delivered / classification | Evidence | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-L1-01 | Part I declared assets | Part I README | **Delivered** | All declared assets exist: Lab 1, 3 case studies, 8 worksheets/workshop, diagram library. **27/27 local links in the README resolve.** Re-derived from the filesystem, not accepted from the README's self-description (plan L3) | `PASS` | — |
| DEP-L1-02 | Part I declared exclusion | Part I README *Supporting Code* | **Honoured** | *"Supporting code intentionally deferred to later technical parts."* No code directory exists for Part I; `code/` contains only `part-02-programming` | `PASS` | — |
| DEP-L1-03 | Part II declared companions | Part II README Delivery Plan, Deliveries 1–5 | **Delivered and executable** | Five companion projects present. **Executable verification: `tsc --noEmit` exit 0 on all five; `node --test` 13/13 pass (delivery-04) and 26/26 pass (capstone) = 39/39; deterministic validation suites pass for deliveries 02 and 03; delivery-01 runs and emits its documented report shape.** Run on Node v18.20.8 | `PASS` | — |
| DEP-L1-04 | Part II declared release state | Part II README lines 115, 123 | **NOT honoured** | README states the v0.5.0 tag and GitHub Release *"remain pending"*; tag `v0.5.0` exists at `f71d284`, dated 2026-08-09 | `FAIL` | **FE-L1-001** |
| DEP-L1-05 | Part I README chapter-list labelling | Part I README | **Divergent** | Heading *"## Planned Chapters"* lists ten delivered chapters; README records no review event or gate | `FAIL` | **FE-L1-007** |
| DEP-L1-06 | L19 technical-contradiction pass within L1 | Parts I–II | **No contradiction found** | Recurring subjects compared pairwise within the batch — ISO/IEC 25010 characteristic set and count; capability-vs-characteristic boundary; policy-vs-mechanism; `null`/`undefined`. Each pair holds under the same stated conditions. Edition-wide comparison is T5 | `PASS` | — |
| DEP-L1-07 | Atlas recurring-case continuity | — | — | `NOT APPLICABLE` — plan §4 L15 scopes Atlas to **Parts III–XII**; **Parts I–II are legitimately outside the case and their absence is not a continuity failure** | `NOT APPLICABLE` | — |

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
| Longitudinal | chapters | **22** | **137** | **L1 22/22 complete** · L2 0/34 · L3 0/33 · L4 0/24 · L5 0/24 |
| Transversal T1 | chapters | **0** | 137 | |
| Transversal T2 | chapters | **0** | 137 | |
| Transversal T3 | chapters | **0** | 137 | |
| Transversal T4 | chapters | **0** | 137 | Requires L9, L10 **and L16** each inspected |
| Transversal T5 | chapters | **0** | **115** | **Parts III–XII only** — Parts I–II are legitimately outside the Atlas case |
| Transversal T6 | chapters | **0** | 137 | |

**Longitudinal axis, batch L1: 22 / 22 chapters inspected with valid six-field records.** Transversal axis: 0 / 137 on every transversal.

| Row ID | Part | Ch | Inspection status | Method | Object / population | Evidence | Result | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L1-01 | I | 1 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 4,940 words, 4 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 4 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-02 | I | 2 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,720 words, 7 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 7 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-03 | I | 3 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,580 words, 8 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 8 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-04 | I | 4 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,948 words, 6 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 6 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-004 FE-L1-002 |
| L1-05 | I | 5 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,864 words, 6 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 6 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-06 | I | 6 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 7,037 words, 9 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 9 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-07 | I | 7 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,733 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 5 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-08 | I | 8 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,072 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 5 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-09 | I | 9 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 7,453 words, 6 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 6 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-10 | I | 10 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 7,574 words, 10 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 10 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-11 | II | 1 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 4,693 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-12 | II | 2 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,650 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | defect found | FE-L1-004 |
| L1-13 | II | 3 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,390 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-14 | II | 4 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,614 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-15 | II | 5 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,910 words, 10 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 10 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-16 | II | 6 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 3,653 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-17 | II | 7 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 3,211 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-18 | II | 8 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 2,681 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 2 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-19 | II | 9 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 2,774 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 2 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-20 | II | 10 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,046 words, 4 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 4 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | defect found | FE-L1-003 |
| L1-21 | II | 11 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,517 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 5 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | defect found | FE-L1-003 |
| L1-22 | II | 12 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 7,957 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | defect found | FE-L1-004 |

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

| Check | Population | Complete | L1 result (22 chapters) |
| --- | --- | --- | --- |
| Heading-order integrity | 137 | **22** | **PASS** — heading-order check v1: exactly 1 H1 per chapter, **0 level jumps** across all 22 |
| Table-header presence | 137 | **22** | **PASS** — table check v1: every table block carries a header separator row; **0 malformed tables** |
| Descriptive link text | 137 | **22** | **PASS** — vague-link-text check v1 (`here`/`click here`/`this`/`link`/`read more`/`more`): **0 occurrences** |
| Image alt-text presence | 137 | **0** | **NOT APPLICABLE** — the L1 image population is **zero**; no `![...]()` occurs in any of the 22 chapters. Recorded as N/A with reason, **not** as PASS |

> **Judgement-dependent accessibility** — contrast, alt-text sufficiency, reading level — **remains out of scope while no authoritative accessibility standard exists.** Plan §9: **Level 11 does not score against absent standards.** The standard's absence is a **Governance Integrity** matter (category 8), dispositioned at Phase E, and is **never an editorial deduction**.

---

**Last Updated:** 2026-08-16 (F-L1)
