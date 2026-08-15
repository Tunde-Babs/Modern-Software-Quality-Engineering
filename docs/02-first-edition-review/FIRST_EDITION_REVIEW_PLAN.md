# First Edition Review Plan

| Field | Value |
| --- | --- |
| **Project** | Modern Software Quality Engineering (MSQE) |
| **Milestone** | v0.16.0 — First Edition Review |
| **Document type** | Review Architecture / Method |
| **Document status** | Architecture Candidate — Awaiting Focused Independent Re-Acceptance |
| **Latest stable release** | v0.15.0 — Engineering Leadership & Career Growth Complete |
| **Review scope** | Parts I–XII — 137 chapters — 651,161 words |
| **Phase** | Phase D.5 — Architecture Materialisation |
| **Owner** | Tunde Ajala |

> This is a **governance artefact**, not a manuscript chapter. It deliberately does not carry a chapter-style status such as `Draft` or `Approved`.

> **This plan has not been independently accepted.** It is the corrected architecture materialised for focused independent re-acceptance (Phase C2). **No First Edition Review execution has begun. Phase E Governance Remediation has not run.** This document contains method only — no manuscript findings, no verification data, no dispositions.

---

## 1. Executive Purpose

### 1.1 The primary review question

> **Would the complete MSQE handbook, taken as one edition, form a coherent, technically rigorous, evidence-led, professionally useful and publication-ready First Edition?**

### 1.2 Why this differs from every Part gate

Each of the twelve Part gates asked a *vertical* question: *"Is this Part internally strong enough to complete its lifecycle?"* Every defect class that lives **between** Parts was structurally invisible to all twelve.

**Individual Part release success is prior evidence, not proof of edition-wide quality.** Twelve Parts each passing its own gate does not establish that they form one book. The edition review exists to test what no Part gate could.

### 1.3 What v0.16.0 means

**v0.16.0 — First Edition Review Complete** means the edition has been independently reviewed as a whole and found coherent, correct, evidence-sound and pedagogically valid, with every material finding resolved or consciously accepted.

It does **not** mean "all Parts have been released" — that was already true at v0.15.0 and proves nothing about coherence.

**v0.16.0 authorises controlled publication preparation. It is not publication.** v1.0.0 — First Edition Published is a separate, later milestone.

---

## 2. Authoritative Governance Relationship

### 2.1 The standing authority

[`docs/01-editorial/QUALITY_GATES.md`](../01-editorial/QUALITY_GATES.md) (v1.1) is the repository's **standing lifecycle and gate authority**. This plan does **not** create a competing gate model.

| | Quality Gates | First Edition Review Levels |
| --- | --- | --- |
| Abstraction | **lifecycle/governance checkpoints** | **inspection dimensions and methods** |
| Question | *What must be true to pass?* | *How is evidence produced to determine that?* |
| Scope in repository | explicitly **Part-level** | **edition-level** |
| Output | pass / not-ready | findings, evidence, score |

The review levels are the **method by which gate criteria are evidenced**, extended from Part scope to edition scope. `QUALITY_GATES.md` defines no edition-level gate, so no duplication exists.

### 2.2 Review levels → quality gates

| Gate and its scope | Levels producing the evidence |
| --- | --- |
| **Gate 1 — Technical Quality**<br>concepts accurate · code executes · commands verified · diagrams correct · references accurate | L4, L6, L7, L8, L19 |
| **Gate 2 — Editorial Quality**<br>grammar · terminology consistent · style guide · cross references · Markdown renders | L11, L6, L4 |
| **Gate 3 — Educational Quality**<br>objectives defined · concepts build progressively · examples support theory · summary · takeaways | L9, L5, L2 |
| **Gate 4 — Practical and Learning Quality**<br>practical activities · exercises validated · interview questions · scenarios · required-asset validation · Pass 2 accurately recorded | L10, L16, L1 |
| **Gate 5 — Publication Quality**<br>chapter version · references complete · images verified · links functional · peer review | **L12**, L11, L7, L13 |

Every gate is covered and no level is orphaned. L1, L3 and L15 support the Part-Level Quality Gate Model's completeness and scope-discipline requirements rather than a single numbered gate.

### 2.3 Authoritative chapter-status model

The authoritative status model is the seven-stage progression defined in `QUALITY_GATES.md`:

```text
Draft → Technical Review → Editorial Review → Educational Review
      → Practical Validation → Publication Review → Approved
```

together with [`templates/CHAPTER_TEMPLATE.md`](../../templates/CHAPTER_TEMPLATE.md), which mandates `| Status | Draft |` as the authored starting value.

**No new chapter status is invented by this plan.** Levels 1 and 4 check status values against this model and no other.

---

## 3. Review Lifecycle

Every phase requires separate explicit authorisation. The governing principle:

> **DEFINE the quality system → INDEPENDENTLY VERIFY the quality system → USE the verified system to modify and assess the product.**

Governance remediation (Phase E) modifies repository content; its authority derives from this plan, so this plan must be independently accepted first.

| Phase | Input | Activity | Output | Authorisation | Exit criterion |
| --- | --- | --- | --- | --- | --- |
| **A** | repository state | Design review architecture | Architecture proposal | granted | Architecture proposed |
| **B** | A + owner decisions | Resolve architecture decisions | Corrected architecture | granted | All decisions incorporated |
| **C** | B | Independent architecture review | Verdict, findings, score | granted | Verdict issued |
| **D** | C findings | Targeted architecture corrections | Corrections record | granted | Blockers corrected |
| **D.5** | A–D | **Materialise architecture** | **This plan** | granted | Plan exists as one versioned artefact |
| **C2** | D.5 | **Focused independent re-acceptance** | Re-acceptance verdict | separate | **Zero Architecture Blockers** |
| **E** | accepted plan | **Governance Remediation Gate** (§12) | Governance Remediation Record | separate | Every item CLOSED or validly ACCEPTED (§12.2) |
| **F** | remediated repository | **Two-Axis Review** — longitudinal L1–L5, transversal T1–T6, internal checkpoints | Populated ledgers, matrices, registers | separate | 137/137 chapters inspected on both axes with valid inspection records (§5.4) |
| **G** | F outputs | Consolidated independent review | Findings, score, verdict | separate | Review complete |
| **H** | G findings | Targeted corrections | Correction record (**unscored**) | separate | All P0/P1 closed |
| **I** | H | Focused closure review | Closure verdict, score | separate | Closures independently verified |
| **J** | I | **Final First Edition Quality Gate** | Gate report, score, verdict | separate | Verdict issued; no open Final-Gate Blocker |
| **K** | J pass | **Controlled Whole-Edition Baseline** | 141-object baseline + manifest | separate | Baseline recorded; drift controls active (§11) |
| **L** | K | v0.16.0 release administration | Release metadata | separate | v0.16.0 released from the baselined state |

**Phase E may not begin until Phase C2 returns zero Architecture Blockers.**

---

## 4. The Thirteen Review Levels

### Level 1 — Repository and governance integrity

- **Objective:** the repository truthfully describes itself and is structurally sound.
- **Unit:** repository; governance file.
- **Evidence:** Git refs, tags, history; `docs/00-project/`; `docs/01-editorial/`; root hygiene files; `CHANGELOG.md`.
- **Census/sampling:** **census** — no sampling permitted.
- **Method:** mechanical scans plus targeted reading. Reconcile CHANGELOG ↔ VERSIONING ↔ ROADMAP ↔ tags. Verify every recorded baseline SHA resolves. Classify every lifecycle statement as current, historical, or stale. **Authoritative status model: §2.3.**
- **Defect classes:** false current-state claim; empty required file; missing or duplicate release entry; tag–milestone mismatch; unresolvable baseline; stale lifecycle sweep; chapter status outside the authoritative model.
- **Exit criterion:** zero unresolved P0/P1; every P2 dispositioned; every Phase E item CLOSED or validly ACCEPTED.

### Level 2 — Whole-book architecture

- **Objective:** the twelve-Part sequence is the right decomposition, correctly ordered, with no gap or overlap.
- **Unit:** the edition.
- **Evidence:** `BOOK_BLUEPRINT.md`; `MQE-BOK.md`; `ARCHITECTURE.md`; twelve Part READMEs; `QA_TO_QE_TRANSITION_FRAMEWORK.md`.
- **Census/sampling:** **census** of BOK domains and Parts.
- **Method:** reconstruct the intended architecture from blueprint and BOK; compare against what the Parts deliver; verify **BOK domain → Part** coverage in both directions. Where `MQE-BOK.md` and `BOOK_BLUEPRINT.md` diverge, assess coverage against **both** and record the divergence as a Level 2 finding.
- **Defect classes:** uncovered BOK domain; Part delivering outside remit; misordered dependency; missing bridge; unjustified length asymmetry.
- **Exit criterion:** every BOK domain traced to at least one Part; every Part traced to at least one domain; ordering defensible on stated grounds.

### Level 3 — Part architecture

- **Objective:** each Part's internal chapter architecture is sound and matches its README.
- **Unit:** Part (×12).
- **Evidence:** Part README; its chapters; recorded review history.
- **Census/sampling:** **census** — all twelve.
- **Method:** verify README-declared architecture against delivered chapters — count, sequence, declared handoffs, declared exclusions. **Independently re-derive; never accept the README's self-description.**
- **Defect classes:** README/manuscript divergence; **undelivered declared handoff**; unhonoured exclusion; sequence break.
- **Exit criterion:** all twelve assessed; every declared handoff verified delivered or raised as a finding.

### Level 4 — Chapter integrity

- **Objective:** every chapter is complete, correct, and template-conformant.
- **Unit:** chapter (×137).
- **Census/sampling:** **full census — no sampling** for structural checks and for technique 1–3 and 5 below. Sampling permitted only for technique 4, under §8.
- **Evidence:** chapter text; `CHAPTER_TEMPLATE.md`; `QUALITY_GATES.md`; cited standards and authoritative documentation.
- **Authoritative status model:** §2.3. Level 4 checks that each chapter's status value is a defined stage **and** that the stage claimed is supported by the review evidence recorded for that Part.

**Technical-falsehood detection method.** Human reading alone is not a method specification. Level 4 combines five techniques:

1. **Standards cross-check** — every claim invoking a cited standard is checked against that standard at the level of specificity claimed. *Census.*
2. **Authoritative documentation cross-check** — claims about named tools, protocols or specifications checked against official documentation. *Census where the claim is load-bearing for a decision.*
3. **Internal contradiction test** — every technical claim is tested against other claims about the same object across the edition. This is the primary net for a *consistently repeated* falsehood, which Level 5 cannot catch because consistency is not correctness. *Census.*
4. **Claim sampling with domain reasoning** — for ordinary technical prose, a declared sample per chapter is assessed by domain reasoning against known-correct behaviour. *Sampling permitted under §8.*
5. **Executable or recomputable verification** — where a claim is testable (code, command, computation), it is executed or recomputed. *Census of testable claims.*

**Evidence recorded per claim:** claim, location, technique, reference consulted, result, finding ID where applicable.

**Citation is not required for every ordinary technical sentence.** The objective is reliable falsification, not citation inflation: a claim is a defect when it is wrong, not when it is uncited.

- **Defect classes:** technical error; missing required section; status nonconformance; heading-hierarchy break; broken local link; undefined or unused footnote; malformed table; unbalanced fence.
- **Exit criterion:** 137/137 inspected with valid inspection records; all P0/P1 resolved; every P2 dispositioned.

### Level 5 — Cross-Part conceptual consistency

- **Objective:** shared concepts are used consistently, or differ for stated reasons.
- **Unit:** concept.
- **Census/sampling:** **census** of every concept appearing in three or more Parts with definitional or instructional weight. Concept selection is evidence-driven from occurrence data, not from a pre-supplied list.
- **Evidence:** every occurrence across the 137 chapters.
- **Method:** Concept Consistency Matrix — rows are concepts, columns Parts I–XII, cells carry a classification plus evidence.

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

Every non-D cell carries a Part and chapter citation. **F, G and H require verbatim quotation of both sides — no paraphrase.** Ownership is recorded per concept: which Part *owns* the definition, which merely *uses* it. A concept with two owners is a candidate E or F.

- **Defect classes:** F, G, H, E as above.
- **Exit criterion:** every candidate concept classified with evidence; all F, G and H resolved or dispositioned.

### Level 6 — Terminology and standards consistency

- **Objective:** terminology is consistent and standards claims are accurate.
- **Unit:** term; standards claim.
- **Census/sampling:** **census** of standards claims; census of terms appearing in three or more Parts.
- **Evidence:** term occurrences; primary standards text where accessible.
- **Method:** Terminology Register with a bidirectional test:
  - **SAME TERM → DIFFERENT MEANING** — collect definitions across Parts; verdict CONSISTENT / CONTEXTUAL / **INCONSISTENT**.
  - **DIFFERENT TERM → SAME CONCEPT** — cluster synonyms; verdict INTENTIONAL / **UNDECLARED**.

Both are distinguished from legitimate contextual variation by one test: **is the variation stated in the text?** Stated is contextual; unstated is a defect.

Only standards the repository **actually cites** are checked. **No standards dependency is invented.** Each claim records standard, edition, claim, verification level, and limitation. Where only secondary verification is possible the claim is **narrowed** and the limitation carried openly.

- **Defect classes:** misattributed standard; superseded terminology; undeclared synonym; invented standards dependency.
- **Exit criterion:** every standards claim verified or explicitly limitation-bounded.

### Level 7 — Evidence and citation integrity

- **Objective:** every citation exists, is correctly attributed, and **supports the claim made**.
- **Unit:** citation. Population at plan time: **378 footnote definitions across 210 distinct URLs**.
- **Census/sampling:** **census** of all citations.
- **Evidence:** footnotes; bibliographic metadata; primary text where accessible.
- **Method:** Source Verification Ledger. **Claim–source alignment is the primary test, not link liveness.**

Verification levels: `PRIMARY-FULL` (full text inspected) · `PRIMARY-PARTIAL` (abstract or excerpt) · `METADATA` (registry-confirmed) · `SECONDARY` (corroborated indirectly) · `UNVERIFIED`.

**Four binding rules:**

1. **HTTP accessibility is not source validity.** A 200 proves a URL resolves, nothing more.
2. **A 403 is not link rot.** Publishers including ISO, ACM, IEEE, JSTOR and BMJ block automated clients by design. A valid publisher URL is never replaced on this basis.
3. **Verification level is recorded as achieved, never as intended.** Primary verification is never claimed where only secondary was achieved.
4. **Claim–source alignment is the primary test.** A real, live, correctly cited source that does not support the sentence citing it is a defect invisible to every link checker.

A source is verified **once** and its result reused; **claim alignment is assessed per citation**, because the same source may be cited correctly in one Part and overreached in another.

- **Defect classes:** fabricated citation; claim not supported by cited source; overstated verification level; metadata error.
- **Exit criterion:** 100% of citations verified to a declared level; zero fabrications; every limitation explicit.

### Level 8 — Numerical and analytical integrity

- **Objective:** every quantitative claim is arithmetically correct **and** supports the inference drawn.
- **Unit:** quantitative claim (see §6 census).
- **Census/sampling:** **census of every confirmed Tier-1 quantitative claim in every Part. No Part is exempt.** Tier-2 candidates are triaged per chapter.
- **Evidence:** the claim as written, with its full displayed chain.
- **Method:** Numerical Verification Ledger. Recompute with **exact rational arithmetic**; test **every displayed intermediate as written**, because a chain can reconcile end-to-end while an intermediate is wrong; apply **rounding-aware comparison** (`ROUND_HALF_UP` to the displayed precision) — a naive absolute tolerance produces false failures.

**The dual verdict is mandatory.** Arithmetic and inference are recorded separately:

> `ARITHMETIC: PASS / INFERENCE: FAIL` must be expressible. **A correct calculation can support an invalid conclusion.**

Inference tests: is the denominator defined? did the population change mid-window? is a proxy treated as the construct? does a percentage change conceal a mix shift? is a correlation stated as cause?

- **Defect classes:** arithmetic error; chain inconsistency; valid arithmetic supporting invalid inference; undefined denominator or population; rounding inconsistency.
- **Exit criterion:** every confirmed quantitative claim recomputed with a dual verdict; zero unresolved arithmetic or inference failures.

### Level 9 — Pedagogical progression

- **Objective:** the edition teaches in a learnable order and delivers the QA → QE promise.
- **Unit:** capability thread across Parts I–XII (19 dimensions).
- **Census/sampling:** **census** — 19 dimensions × 12 Parts.
- **Evidence:** learning objectives; chapter openings; exercises; `QA_TO_QE_TRANSITION_FRAMEWORK.md`.
- **Method:** QA → QE Progression Matrix. Per cell: level (Not addressed / Introduced / Developed / Applied / Integrated), evidence (chapter plus quotation), prerequisite. Derived analyses: prerequisite trace; monotonicity; abandonment; difficulty gradient; circularity; QA/QE dichotomy audit.
- **Defect classes:** missing prerequisite; unexplained difficulty jump; concept introduced then abandoned; beginner content too late; artificial QA/QE dichotomy.
- **Exit criterion:** all 19 dimensions traced across all twelve Parts.

### Level 10 — Professional applicability

- **Objective:** the edition produces capability a practising engineer can use.
- **Unit:** professional artefact; decision model.
- **Census/sampling:** **census** of artefacts.
- **Evidence:** artefact sections; capstones; decision briefs.
- **Method:** artefact inventory — Part, chapter, name, purpose, inputs, outputs, fields, prerequisite artefacts, real-world analogue. **Toolkit test:** taken together, do the artefacts form a portfolio a practitioner could carry into a role, or twelve disconnected exercises?
- **Defect classes:** artefact conflicting with an earlier one; non-accumulating artefact; artefact requiring untaught capability; unusable output.
- **Exit criterion:** every artefact classified and reconciled.

### Level 11 — Editorial consistency and accessibility

- **Objective:** the edition reads as one book and meets objectively checkable accessibility properties.
- **Unit:** chapter; edition-wide editorial property.
- **Census/sampling:** **census** for mechanical and accessibility checks; declared sampling permitted for tone and register.
- **Evidence:** all 137 chapters; `docs/00-project/EDITORIAL_STYLE_GUIDE.md`; `CHAPTER_TEMPLATE.md`.
- **Method:** three layers.
  - **Mechanical:** H1 count; heading hierarchy; required-section presence; table well-formedness; fence balance; footnote reconciliation; local link resolution; chapter status metadata; TODO/TBD/FIXME/XXX; credential-like patterns.
  - **Human:** tone and register; spelling convention; opening-section quality; navigation coherence; callout usage.
  - **Formulaic-repetition:** cluster opening sentences by n-gram similarity across all 137 chapters; compare section-shape sequences; sample transition phrasing.

> **Useful consistency** = the reader always knows where to find something.
> **Template fatigue** = every chapter feels like the same chapter with substituted nouns.
> The distinguishing test is whether the *content* varies while the *scaffold* repeats.

- **Standards discipline:** §9 governs. **Level 11 does not score against absent standards.**
- **Defect classes:** register inconsistency; template fatigue; objective accessibility failure.
- **Exit criterion:** all 137 scanned; systemic patterns dispositioned.

### Level 12 — Publication readiness

- **Objective:** determine whether controlled publication preparation may be authorised.
- **Unit:** the edition.
- **Census/sampling:** not applicable — this is a gate over Levels 1–11 outputs.
- **Relationship to Gate 5:** **Level 12 applies Gate 5 — Publication Quality at edition scope.** It does not replace or restate Gate 5; it evidences Gate 5's criteria across 137 chapters plus the edition-level criteria below that Gate 5, being Part-scoped, does not address. **Where they overlap, Gate 5 is authoritative on the criterion and Level 12 supplies the edition-wide evidence.**

**Publication-readiness criteria — a gate, never a scored category:**

| # | Criterion | Evidence |
| --- | --- | --- |
| 1 | Technical correctness | L4, L6, L19 — zero unresolved P0/P1 |
| 2 | Conceptual consistency | L5 — no unresolved F/G/H |
| 3 | Evidence integrity | L7 — zero fabrications; limitations explicit |
| 4 | Numerical integrity | L8 — arithmetic and inference both clear |
| 5 | Pedagogical coherence | L9 — no missing prerequisites |
| 6 | Editorial quality | L11 — no systemic template fatigue |
| 7 | Professional applicability | L10 — artefacts accumulate |
| 8 | Accessibility | L11 objective checks plus standard-gap disposition |
| 9 | Governance integrity | L1 |
| 10 | Manuscript completeness | L4 — 137/137 complete and conformant |
| 11 | Source-risk disposition | L7 — every open control CLOSED or ACCEPTED |
| 12 | Known-finding disposition | Phase E and §12 |
| 13 | Cross-Part coherence | L5, L10, L19 |

- **Exit criterion:** every criterion PASS or formally ACCEPTED with rationale.

### Level 13 — Final First Edition Quality Gate

- **Objective:** a single independent authoritative verdict on the edition.
- **Unit:** the edition.
- **Relationship to the standing framework:** Level 13 is an **edition-scope extension of the Part-Level Quality Gate Model** in `QUALITY_GATES.md`, standing in the same relation to the edition that the Manuscript Quality Gate stands to a Part. It inherits that model's release-readiness logic — *no P0 or P1 release blockers remain; any release-blocking P2 findings are resolved* — and adds edition-wide coherence criteria. **It does not supersede any Part's completed gate and does not reopen released Part decisions.**
- **Census/sampling:** declared independent sample across Levels 4, 7 and 8, under §8.
- **Method:** the gate **re-derives from primary evidence; it does not confirm prior reports.** Scorecard (§7) plus blocker overrides (§7.3).
- **Exit criterion:** verdict issued; no open Final-Gate Blocker.

### Supporting passes

**Level 15 — Recurring-case (Atlas) continuity.** Scope established by evidence: Atlas spans **Parts III–XII**; Parts I–II are legitimately outside the case and their absence is **not** a continuity failure. Dimensions: organisation, personas, system boundaries, services, architecture, currency, numerical facts, incidents, terminology, chronology, organisational structure, technical decisions. Classification: **EVOLUTION** (signposted) · **CONTEXTUAL VARIATION** (different lens, no conflict) · **AMBIGUITY** (under-specified — record, do not force) · **CONTRADICTION** (facts cannot both hold).

**Level 16 — Exercise progression.** Classify every exercise on a cognitive ladder from recognition to leadership decision-making. Two required tests: the **copy-adjacent-prose test** (can it be answered by restating nearby text?) and the **untaught-capability test** (does it require a capability never taught, per Level 9?).

**Level 19 — Technical contradiction pass.** For each recurring technical subject, extract every normative statement with its stated context and compare pairwise across Parts.

> **CONTRADICTION** — the statements cannot both be true **under the same stated conditions**.
> **CONTEXT-DEPENDENT TRADE-OFF** — they hold under **different stated conditions**.
>
> Operational test: **is the differentiating condition stated in the text?** Stated is a legitimate trade-off. Unstated is a contradiction in effect even if reconcilable in principle — the defect is the missing condition, and the correction is usually to state it, not to delete one side.

---

## 5. Two-Axis Coverage Model

### 5.1 Why two axes

A longitudinal-only review reproduces the Part gates and finds nothing new. A transversal-only review never reads a chapter whole, so chapter-level integrity is unverifiable. Only a two-axis model satisfies both the edition question and Level 4's census requirement.

### 5.2 Axis 1 — Longitudinal (guarantees complete coverage)

| Batch | Parts | Chapters | Words | Tier-1 claims | Tier-1/1k | Citations | Verification tier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **L1** | I–II — Foundations, Programming | 22 | 125,017 | 25 | 0.200 | 110 | **Deep** |
| **L2** | III–V — Testing, API, Automation | 34 | 177,748 | 30 | 0.169 | 125 | **Deep** |
| **L3** | VI–VIII — Data, Cloud/DevOps, Observability | 33 | 115,618 | 445 | 3.849 | 62 | **Deep** |
| **L4** | IX–X — AI Quality, Performance & Security | 24 | 88,258 | 388 | 4.396 | 42 | Standard, **elevated** (§6.4) |
| **L5** | XI–XII — Architecture, Leadership | 24 | 144,520 | 413 | 2.858 | 39 | Standard |
| | **Total** | **137** | **651,161** | **1,301** | | **378** | |

**Boundary rationale.** The **VIII | IX** boundary is the evidence-maturity boundary (§6.4) and is absolute — no batch mixes verification tiers. Sub-boundaries follow conceptual continuity: L1 conceptual and skill base (and the Atlas-absent zone); L2 core practice; L3 systems and operational; L4 specialist quantitative; L5 synthesis and capstone.

### 5.3 Axis 2 — Transversal (finds what Axis 1 cannot)

| ID | Transversal review | Levels |
| --- | --- | --- |
| **T1** | Concepts and terminology | L5, L6 |
| **T2** | Citations and sources | L7 |
| **T3** | Numerical and analytical | L8 |
| **T4** | QA → QE progression and dependencies | L9, L10 |
| **T5** | Recurring-case continuity and contradictions | L15, L19 |
| **T6** | Editorial consistency and formulaic repetition | L11 |

**T5 is scoped to Parts III–XII** by evidence. Parts I–II therefore receive five of six transversal reviews, which is adequate and stated.

### 5.4 Coverage exit rule — verifiable inspection record

**137/137 chapter coverage on both axes is mandatory.** A chapter-by-axis coverage matrix is maintained throughout Phase F.

**A cell counts as complete only when it records all six fields:**

| Field | Content |
| --- | --- |
| **Inspection status** | inspected / not-inspected / blocked |
| **Method** | e.g. recomputation, citation verification, standards cross-check, claim sampling, structural scan |
| **Object / population** | what was inspected and its size |
| **Evidence or reference** | recomputed value, verification level, claim inspected, or ledger row ID |
| **Result** | defect found / no defect found |
| **Finding ID** | where a defect was found |

> **For a "no defect found" outcome, the evidence field must demonstrate that an inspection actually occurred** — a recomputed result, a citation verification level, an inspected claim, or a standards cross-check reference. **A bare "reviewed / no defect" does not satisfy the control and does not count toward coverage.**
>
> **The purpose is auditability, not paperwork volume.** A ledger row ID is sufficient where a ledger row exists. Quotation is required only where no other artefact captures the inspection, and must not be demanded merely to satisfy the control.

---

## 6. Quantitative-Content Census

### 6.1 Exclusion pass — structural and reference numerals

Removed before counting, because they are identifiers rather than quantitative claims:

| # | Excluded | Rationale |
| --- | --- | --- |
| E1 | Fenced code blocks | counted separately as a distinct population |
| E2 | Inline code spans | identifiers, not prose claims |
| E3 | Absolute URLs | contain digits |
| E4 | Markdown link and image targets | relative paths contain chapter and delivery numbers |
| E5 | Footnote definition lines | bibliographic volumes, pages, years |
| E6 | Footnote references | citation identifiers |
| E7 | Chapter metadata rows | metadata |
| E8 | `Chapter N` / `Part N` headings | structural numbering |
| E9 | Standards designators (ISO/IEC, IEEE, RFC) | reference identifiers |
| E10 | Bare years 1900–2099 | bibliographic |
| E11 | Three-digit codes 100–599 where surrounding context establishes identifier use (HTTP, status, response, code, returns) | HTTP status codes are technical identifiers, verified at Levels 4 and 6, not Level 8 |

### 6.2 Inclusion pass — two tiers

| Tier | Classes | Treatment |
| --- | --- | --- |
| **Tier 1 — quantitative claims** | percentages · currency · value with unit (ms, s, min, h, day, week, month, GB, MB, rps, qps…) · multipliers (`n×`) · ratios and rates (`a:b`, `a/b`, `n per unit`) · thousands-separated numbers · decimals | **counted as claims; census verification** |
| **Tier 2 — candidates** | bare integers of two or more digits · residual three-digit codes · numerics inside code fences | **never counted as claims**; triaged per chapter into claim or identifier; confirmed claims join the Tier-1 ledger |

**Bare integers cannot be a primary signal.** They cannot be separated from identifiers by pattern alone — genuine values sit beside chapter cross-references, stage numbers, status codes and standards numbers. Tier 2 makes the ambiguity explicit and routes it to human triage rather than silently counting or silently dropping it.

### 6.3 Mandatory reflexive validation

> **Any metric used by the review architecture itself must be sampled against source text and validated before its output is used for review allocation or scoring.**

This rule exists because two successive versions of this metric failed construct validity — a percentage-only proxy, then a composite contaminated by file paths and status codes. The architecture demands construct validity of the manuscript; it must apply the same discipline to itself.

### 6.4 Corrected census

| Part | Tier 1 | Tier 2 | Code-fence | Words | **Tier-1 / 1k words** |
| --- | --- | --- | --- | --- | --- |
| I | 20 | 28 | 1 | 64,921 | 0.31 |
| II | 5 | 19 | 31 | 60,096 | 0.08 |
| III | 24 | 22 | 0 | 52,741 | 0.46 |
| IV | 2 | 33 | 62 | 54,811 | 0.04 |
| V | 4 | 22 | 0 | 70,196 | 0.06 |
| VI | 194 | 82 | 17 | 45,206 | 4.29 |
| VII | 53 | 23 | 0 | 40,305 | 1.31 |
| VIII | 198 | 97 | 55 | 30,107 | 6.58 |
| IX | 232 | 368 | 0 | 35,028 | **6.62** |
| X | 156 | 175 | 7 | 53,230 | 2.93 |
| XI | 297 | 349 | 0 | 77,606 | 3.83 |
| XII | 116 | 262 | 0 | 66,914 | 1.73 |
| **Total** | **1,301** | **1,480** | **173** | **651,161** | |

Batch aggregates appear in §5.2. Derived ratios: **L4/L3 = 1.14× · L4/L5 = 1.54× · L4/L1 = 22.0× · L4/L2 = 26.0×**.

**Consequence for batching.** L4 remains the densest batch, but at 1.14× L3 it is **not** an isolated extreme. **L3 receives numerical-verification resourcing comparable to L4.** Batch boundaries are unchanged, because they are driven by evidence maturity and conceptual continuity, neither of which the metric affects.

### 6.5 Superseded evidence

The following are recorded as **superseded** and must **not** be used operationally:

- the **percentage-only** density metric and every figure derived from it, including the claims that L4 was "2.4× the next densest" and ">30× L1–L2", and that Parts II, IV and V had "zero" numerical content;
- the **Phase C composite** metric and its figures (Part VI to rank 2, Part VII to rank 9, L1/L2 at 4.06/3.90 per 1k), which were inflated by uncorrected integer contamination.

### 6.6 Correctness threshold

> **Density controls review effort and sequencing only. It never changes the correctness threshold, which is identical in every Part.**
>
> **Every Part contains Tier-1 quantitative claims** — the minimum is Part IV at 2, and no Part has zero. **Every confirmed quantitative claim in every Part receives census verification.** No Part is exempt on density grounds.

---

## 7. Severity, Blockers and Scoring

### 7.1 Severity model

| | Definition |
| --- | --- |
| **P0** | Materially false, unsafe, corrupt, legally problematic, or structurally invalid |
| **P1** | Must be corrected before the Final Gate |
| **P2** | Must be corrected **or validly accepted** before the Final Gate |
| **P3** | May remain if consciously accepted and documented |

**Severity is determined by defect impact, never by willingness or ability to fix it.**

**The P2 / P3 boundary.** An accepted **P2** requires all four: named accountable owner · written rationale · the consequence or risk being accepted, stated explicitly · a **revision trigger** (the condition that reopens it). A **P3** requires documented conscious acceptance only.

> **Operational test:** if a finding needs a named owner and a reopening condition to be tolerable, it is **P2**. If documenting it is sufficient, it is **P3**.

**Systemic escalation.** A P3 in one Part becomes P2 or P1 when systemic **across Parts**, not merely frequent within one Part. Every escalation records its Part-level origin and the evidence that made it systemic. **De-escalation on grounds of correction cost is prohibited.**

### 7.2 Blocker taxonomy

| Class | Definition | Stops |
| --- | --- | --- |
| **A — Architecture Blocker** | Prevents approval of the review architecture | Phase C2 |
| **B — Review-Execution Blocker** | Prevents reliable review of the edition | Phase F |
| **C — Final-Gate Blocker** | Prevents passing the Final First Edition Quality Gate | Phase J |
| **D — Publication Blocker** | Prevents v1.0.0 publication; does **not** prevent v0.16.0 review or gate passage | v1.0.0 |

**Severity and blocker class are orthogonal.** Every finding carries both.

**Class-D handling.** A class-D finding is recorded, carried forward, and reported at every gate, but **does not deduct from the v0.16.0 score and does not fail Phase J.** Phase J's verdict states explicitly: *"First Edition Review complete; publication preparation authorised, subject to N open Publication Blockers listed below."*

**Tie-break rule.** Where a finding plausibly belongs to two classes, **classify by the earliest lifecycle point at which the finding must block**, and record later consequences as carried-forward consequences of the same finding.

**Escalation** between classes is permitted with evidence. **Downgrade is prohibited.**

### 7.3 Scorecard

| # | Category | Weight |
| --- | --- | --- |
| 1 | Technical correctness | **19** |
| 2 | Cross-Part coherence | **18** |
| 3 | Evidence / citation integrity | **14** |
| 4 | Numerical / analytical integrity | **12** |
| 5 | Pedagogical progression | **11** |
| 6 | Professional applicability | **9** |
| 7 | Editorial consistency | **8** |
| 8 | Governance integrity | **9** |
| | **Total** | **100** |

**Publication readiness is a gate (§4, Level 12), not a scored category.** All thirteen of its criteria map onto categories 1–8; scoring it would double-count them, and would let a Publication Blocker deduct from a review score.

**Deduction rules.** Each category starts at full weight. Per finding: **P1 = 25–40%** of category weight · **P2 = 10–20%** · **P3 = 0–5%**. **P0 does not deduct — it triggers an override.** The chosen value within a range must be stated with rationale. Deductions cannot take a category below zero.

**Primary-category rule.** **Each finding receives exactly one PRIMARY score category and deducts exactly once.** Secondary affected categories are recorded for analysis and **never re-deducted** for the same root defect. Primary category is assigned by **root cause**, not by consequence breadth.

**Systemic root-cause rule.** Multiple findings sharing one root cause are scored as **one systemic finding at the severity of the highest instance**, with all instances enumerated as evidence. Findings that merely resemble one another but have distinct root causes are scored independently. This prevents both score inflation and score suppression.

**Sample-size rule.** **A category cannot score above 80% of its weight without a declared sample size.** An unexamined category is unscored, not full-marks.

**Evidence expectation.** Every deduction cites Part, chapter and quotation.

**Granularity.** Scores are recorded to **0.5** at finest. **The band and verdict are the output; the number is supporting evidence.** Where evidence is insufficient, the report states the uncertainty rather than manufacturing a number.

| Score | Band | Verdict |
| --- | --- | --- |
| 95–100 | Exceptional | **A** — review complete; publication preparation authorised |
| 88–94 | Strong | **B** — targeted corrections required before the Final Gate |
| 78–87 | Adequate | **C** — substantive correction pass required |
| 65–77 | Weak | **D** — major rework required |
| < 65 | Failing | **E** — edition not review-ready |

### 7.4 Blocker overrides

**Score never overrides a blocker.** These are evaluated **before** the score and, when triggered, **replace** the verdict:

| Condition | Override |
| --- | --- |
| Any unresolved **P0** | **FAIL** — regardless of score |
| Any unresolved **P1** | **NOT READY FOR FINAL GATE** |
| Required **P2** unresolved and undispositioned | **CORRECTION OR DISPOSITION REQUIRED** |
| Manuscript-integrity failure (drift, unreachable baseline) | **BLOCK** |
| Governance-integrity failure (materially false current-state claim) | **BLOCK** |
| **Material citation fabrication** | **BLOCK** — non-negotiable |
| Material numerical error affecting teaching | **BLOCK until resolved** |
| Empty or absent `LICENSE` at v1.0.0 | **BLOCK publication** |

> A 97/100 edition with one fabricated citation is a **FAIL**, not an A. A manuscript cannot average out a critical defect.

---

## 8. Sampling Control

Where sampling is permitted, **all six** are required **before selection**:

1. **Population defined** — the full set and its size, stated before any item is drawn.
2. **Sample size declared.**
3. **Selection method declared** — random (with seed), stratified (with strata), risk-weighted, or another explicitly justified reproducible method.
4. **Risk variables identified before selection**, where risk-weighting is used.
5. **Rationale** for why the method suits the population.
6. **Reproducibility** — another reviewer can regenerate the same sample.

> **No post-hoc sample justification.** Selecting items and *then* describing the selection is not a declared sample. A category may not score above the §7.3 threshold using an undeclared or post-hoc sample.

---

## 9. Editorial Governance Treatment

> **GOVERNANCE STANDARD ABSENT** → Governance Integrity (category 8)
> **MANUSCRIPT VIOLATES AN EXISTING STANDARD** → Editorial Consistency (category 7)

**Manuscript defects are never generated from nonexistent standards.** Level 11 scores manuscript editorial quality only, against standards that exist: `docs/00-project/EDITORIAL_STYLE_GUIDE.md`, `CHAPTER_TEMPLATE.md`, and objective prose-independent checks.

**Editorial-file disposition rules for Phase E** (defined here; **executed only in Phase E**):

| Class | Objective test |
| --- | --- |
| **A — required, populate** | A review level's or gate's exit criterion depends on the standard |
| **B — duplicate, deprecate** | Duplicates an existing populated authority by name or scope |
| **C — consolidate** | Subject already covered by a populated document |
| **D — unnecessary, remove** | No level or gate depends on it and no manuscript or governance reference requires it |

Each disposition must cite the depending level or gate, or state that none exists.

---

## 10. Accessibility

**Objective checks applicable without a policy — census across all 137 chapters:**

- heading-order integrity;
- table-header presence;
- descriptive link text;
- image alt-text presence.

These are reported as a distinct subsection of the Editorial Consistency Report so accessibility receives a named minimum rather than competing informally for category 7's weight.

**Judgement-dependent accessibility** — contrast, alt-text sufficiency, reading level — **remains out of scope while no authoritative accessibility standard exists** in the repository.

**The absence of an accessibility standard is a Governance Integrity finding for Phase E**, not an editorial deduction.

---

## 11. Independence Rules

> **No single actor may execute, consolidate, correct, close and gate the same work without independent challenge.**

| Rule | Requirement |
| --- | --- |
| **R1** | Phase F execution must not self-authorise Phase G |
| **R2** | Phase G consolidated review is performed independently of Phase F execution |
| **R3** | Phase H corrections are **never scored by their author** (Phase H is an unscored event) |
| **R4** | Phase I closure verification is independent of the Phase H correction author wherever practicable |
| **R5** | Phase J Final Gate is independent of Phase H correction execution |

**R3 and R5 admit no exception.** A correction may never be scored or gated by the actor who made it.

**Unavoidable reviewer reuse** elsewhere is permitted only with all four compensating controls: the reuse is declared in `FIRST_EDITION_REVIEW_LOG.md` before the phase begins · the reviewer re-derives from primary evidence rather than reviewing their own report · a declared independent sample of the prior phase's conclusions is re-verified from source · the limitation is stated in the phase verdict.

**General independence discipline.** Prior reports are evidence, not proof. Numerical claims are recomputed, citations re-verified, definitions re-read from the manuscript, governance verified against Git. **Prior Part scores are never inputs to the edition score.** Where evidence is insufficient, the uncertainty is stated.

---

## 12. Governance Remediation Gate (Phase E)

**Scope defined here. Not executed by this plan.**

### 12.1 Scope

| Item | Activity |
| --- | --- |
| **Part I chapter status** | Reconcile against **both** hypotheses (§14.1). Reconciliation set: Git history · Part I README · `QUALITY_GATES.md` · `CHAPTER_TEMPLATE.md` · later Part conventions |
| **`QUALITY_GATES.md` integration** | Confirm the seven-stage status progression and five-gate model as the authorities named by Levels 1, 4, 12 and 13 |
| **Empty editorial files** | Disposition each as A/B/C/D per §9 |
| **Active editorial style guide** | Dispose of `docs/00-project/EDITORIAL_STYLE_GUIDE.md` carrying `Status: Draft` while serving as the de-facto editorial authority |
| **CHANGELOG duplicate `[0.4.0]`** | Correct the duplicated, out-of-order release heading |
| **gov-P3-5** | Part README lifecycle-state convention: assess **each** Part README for actual drift; apply procedural and automated controls; restructure only where evidence supports it. **Churn minimisation is an explicit constraint** |
| **gov-P3-6** | ROADMAP phase-marker convention. **Any assertion that M2 is Complete remains an explicit owner decision**, never an automatic textual correction. The `Project Phase` header field is a document-provenance field and is **not** in scope |
| **Historical tag reconciliation** | `v0.1.0` and `v0.3.0` are listed as milestones in `VERSIONING.md` but have no tags |
| **Other** | Any further governance inconsistency the gate discovers |

### 12.2 Controlled acceptance record

A formally accepted governance item requires **all seven fields**:

| Field |
| --- |
| Accountable owner |
| Rationale |
| Consequence or risk accepted |
| Revision or reopening trigger |
| Blocker class |
| Severity |
| Date and review event |

**For class-D publication blockers the record must state explicitly:** accepted for **continuation of the v0.16.0 review**; **NOT closed for publication**; **remains a publication blocker**.

> **Acceptance never means closure.** An item lacking any of the seven fields is not validly accepted and does not satisfy the Phase E exit criterion.

---

## 13. Review Artefacts and Whole-Edition Baseline

### 13.1 The four-artefact minimum

| # | Artefact | Responsibility | Lifecycle | Exists? |
| --- | --- | --- | --- | --- |
| 1 | `FIRST_EDITION_REVIEW_PLAN.md` | **Method** — this document | Frozen after Phase C2 acceptance | **Yes** |
| 2 | `FIRST_EDITION_FINDINGS.md` | **Defects** — ID, level, severity, blocker class, Part/chapter, evidence, quotation, disposition, status | Mutable, Phases F→J | Not yet — later phase |
| 3 | `FIRST_EDITION_VERIFICATION_LEDGERS.md` | **Evidence** — all verification records including passes | Populated Phase F | Not yet — later phase |
| 4 | `FIRST_EDITION_REVIEW_LOG.md` | **Events** — ID, date, scope, score, verdict, non-collapse warning | Append-only, immutable | Not yet — later phase |

Four is the minimum sufficient set: method, defects, evidence and events have incompatible lifecycles and cardinalities. Merging findings with events would mix mutable and immutable content — the documented root cause of gov-P3-5. Merging ledgers with findings would bury passing rows among defects and make severity counts unextractable.

**Review-event identity.** Each event is recorded with a unique ID, date, scope, score and verdict. **Identical scores never imply identical events.** Every event ledger carries the standing warning that events are distinct measurements at different lifecycle stages and must not be collapsed. Correction passes are **not** scored events.

### 13.2 Required sections of `FIRST_EDITION_VERIFICATION_LEDGERS.md`

Six top-level sections, each with a stable heading anchor and a declared row schema so evidence remains extractable and citable:

1. Source Verification Ledger
2. Numerical Verification Ledger
3. Terminology Register
4. Concept Consistency Matrix
5. QA → QE Progression Matrix
6. Cross-Part Dependency Matrix

### 13.3 Baseline evidence tiers

| Class | Parts | Evidence semantics | Verification tier |
| --- | --- | --- | --- |
| **Unbaselined legacy manuscript material** | I–VIII | No recorded controlled baseline | **Deep** |
| **Release-recorded baseline** | IX, X | SHA recorded during release preparation, pointing at the manuscript-completion commit | Standard, **elevated** |
| **Controlled-freeze baseline** | XI, XII | Dedicated baseline-establishment commit with explicit freeze semantics, recorded post-gate | **Standard** |

Recorded historical baselines, preserved unmodified:

| Part | Baseline SHA |
| --- | --- |
| IX | `4df2b8d2409cfa0fc474cad8e1bbdbe652eb9dd5` |
| X | `3f7391b5fd939a5dd973d25386811031f3448180` |
| XI | `7067ebb54cba199a9215363188171d2e4966ed15` |
| XII | `839391e136ac00c757dded170ba8ed94a58ff41d` |

> **Evidence maturity differs. The correctness standard does not.** Tier determines verification depth and sampling latitude only. No defect is acceptable in one Part that would be a finding in another.
>
> **No retrospective historical baseline may be manufactured.** Parts I–VIII have no baseline and none will be created for them; the manuscript itself is the evidence, and depth compensates.
>
> Parts IX–X receive census rather than sampling for Tier-1 quantitative claims and citations, because their baselines record *what was drafted* rather than *what a controlled freeze reviewed*. **Verification of Parts XI–XII is not weakened.**

### 13.4 Phase K — the 141-object controlled baseline

**Baseline scope — 141 objects:**

- **137 chapter files** across all twelve Parts;
- `FIRST_EDITION_REVIEW_PLAN.md`;
- `FIRST_EDITION_FINDINGS.md`;
- `FIRST_EDITION_VERIFICATION_LEDGERS.md`;
- `FIRST_EDITION_REVIEW_LOG.md`.

The manifest captures the **blob identity of every object in scope**.

| Property | Specification |
| --- | --- |
| **Trigger** | Phase J passed; zero open class-B and class-C blockers |
| **Self-reference** | A commit cannot record its own SHA. The baseline commit contains the reviewed state; a **subsequent governance commit records the SHA**. This follows established repository precedent |
| **Recorded in** | `FIRST_EDITION_REVIEW_LOG.md` (authoritative), referenced here |
| **Historical Part baselines** | Retained as historical evidence; never superseded, rewritten, or merged into the edition baseline |

**Drift control — every checkpoint verifies all 141 objects, not chapters only:**

1. **At K:** capture the 141-object blob manifest.
2. **Freeze declaration:** any post-baseline change to a manifest object invalidates the baseline and requires re-gating, subject only to §13.5.
3. **Release branch creation:** re-verify the full manifest; the branch must be created from a state whose manifest matches. Verified by direct comparison — **not** by branch name, commit message, or assumption.
4. **Release Candidate validation:** re-verify the full manifest.
5. **`main` promotion:** re-verify the full manifest.
6. **Tag creation:** the v0.16.0 tag must point at a commit whose manifest still matches.

**Scope guard at every commit:** explicit path staging only, with a scope check against the expected path set. Never `git add .` or `git add -A`.

### 13.5 Narrow editorial-only post-baseline exception

**Default: any post-baseline change to a manifest object invalidates the baseline and requires re-gating.**

A change may be classified **editorial-only** **only if it touches none of**: technical claims · numbers · formulas · citations · source interpretation · definitions · terminology meaning · examples whose behaviour changes · conclusions · governance evidence.

**All six controls are mandatory:**

1. declared changed paths;
2. declared diff;
3. explicit editorial-only classification with rationale;
4. **independent verification by someone other than the change author**;
5. regenerated and re-verified 141-object manifest;
6. immutable event recorded in `FIRST_EDITION_REVIEW_LOG.md`.

> **Any uncertainty about whether a change is substantive defaults to full re-gating.** The exception applies only to a declared, bounded set and cannot be used to accumulate substantive change through repeated small edits — the review log makes accumulation visible.

---

## 14. Known Open Questions

Preserved honestly. None is resolved by this plan.

| # | Question | Owner |
| --- | --- | --- |
| **1** | **Part I chapter status.** Two hypotheses must be tested, not presumed. **H1:** `Technical Review Ready` is historical or superseded terminology that should be normalised. **H2:** it is a maturity assertion under the documented progression and may overstate Part I's verified maturity, since `QUALITY_GATES.md` places *Technical Review* after *Draft*, `CHAPTER_TEMPLATE.md` mandates `Draft`, and Part I's README records no Final Quality Gate. **Severity remains undetermined until Phase E reports** | Phase E |
| **2** | `v0.1.0` and `v0.3.0` are listed as milestones in `VERSIONING.md` but no tags exist. Intentional or omission? | Phase E |
| **3** | Empty editorial-file dispositions (A/B/C/D per §9) | Phase E |
| **4** | `MQE-BOK.md` / `BOOK_BLUEPRINT.md` topic-list divergence: which is authoritative for coverage? Methodologically handled by assessing both (Level 2), but the owner may wish to designate one | Level 2 / owner |
| **5** | Chapter publication-status semantics at v1.0.0. No repository document currently defines a post-`Draft` state for publication | v1.0.0 governance |
| **6** | `LICENSE` content, and whether manuscript, code and diagram assets warrant different terms | Owner / legal |
| **7** | Whether Parts I–IX exhibit the gov-P3-5 lifecycle-drift pattern. Confirmed in Parts X, XI and XII only; the rest are unassessed | Phase E |

**CLOSED:** *Edition-gate placement.* Resolved in §2 — the review levels are reconciled with `QUALITY_GATES.md` as method-to-checkpoint, Level 12 maps to Gate 5, and Level 13 is an edition-scope extension of the Part-Level Quality Gate Model. **No competing gate authority is created.**

---

## 15. Architecture Risk Register

| ID | Risk | Failure mode | Mitigation | Residual | Owning control |
| --- | --- | --- | --- | --- | --- |
| **R-1** | Scale — 137 chapters, 651,161 words, 378 citations | Fatigue-driven superficial review | Two-axis batching; work-type-homogeneous batches; declared samples | Execution discipline | §5, §8 |
| **R-2** | Inherited-conclusion bias from twelve prior gates | Rubber-stamping | Prior scores excluded as inputs; re-derivation required | Reviewer discipline | §11 |
| **R-3** | Standards vacuum | Reviewer invents standards and scores against them | Standard-absent routed to Governance Integrity | Judgement at the margin | §9 |
| **R-4** | Governance defects pollute the manuscript score | Manuscript quality misrepresented | Phase E precedes Phase F | — | §3, §12 |
| **R-5** | Legacy-tier under-review — Parts I–VIII carry the weakest evidence and the most words | Weakest material least verified | Deep tier; census not sampling; absence of record is not absence of defect | Volume | §13.3 |
| **R-6** | Score-first reasoning | Blockers averaged away | Overrides evaluated before scoring; band is the output | — | §7.3, §7.4 |
| **R-7** | Review-event collapse | Corrupted review history | Immutable append-only log; non-collapse warning | — | §13.1 |
| **R-8** | Manuscript or artefact drift between Phase J and Phase L | Unreviewed content released | 141-object manifest re-verified at six checkpoints | Editorial exception misuse | §13.4, §13.5 |
| **R-9** | Mutable external sources drift between review and gate | Manuscript inaccurate at publication | Time-sensitive sources re-verified at Phase J | Source volatility | L7, Phase J |
| **R-10** | Artefact sprawl | Unmaintained governance | Four artefacts, each with a distinct necessity test | — | §13.1 |
| **R-11** | Scope creep in Phase E | Governance churn | Churn minimisation is an explicit exit constraint | — | §12 |
| **R-A** | **Architecture-internal metric validity** | A measurement used *by the review* fails construct validity, misdirecting effort | **Mandatory reflexive validation** (§6.3); two-tier design routes ambiguity to human triage | Novel numeric forms may be missed; Tier-2 triage is the backstop | §6.3, L8 |
| **R-B** | **Evidence-ledger integrity** | Ledgers or findings modified post-hoc; a finding silently downgraded or removed | Artefacts inside the 141-object manifest; immutable append-only log | Pre-baseline artefacts are not manifest-protected | §13.4 |
| **R-C** | **Automation false confidence** | A green structural scan is read as substantive review | Structural checks establish **facts only, never verdicts**; six-field record cannot be satisfied by a scan alone for claim-level cells | Reviewer discipline | §5.4, L4 |
| **R-D** | **Reviewer independence between phases** | One actor executes, consolidates, corrects, closes and gates their own work | R1–R5; R3 and R5 admit no exception; declared reuse with four compensating controls | Small-team reality may force reuse at R1, R2, R4 | §11 |

---

## 16. Architecture Review History

Immutable record. Each entry is a distinct event.

| Phase | Event | Result |
| --- | --- | --- |
| **A** | First Edition Review Architecture proposal | Architecture proposed; five repository conditions surfaced requiring owner decisions |
| **1B** | Targeted Architecture Decision Resolution | Eight owner decisions incorporated; publication readiness removed as a scored category; batching re-evaluated |
| **C** | **Independent Architecture Review** | **Score 80/100 · Verdict B — conditionally acceptable, corrections required · three Architecture Blockers: ARC-P1-1 (invalid numerical-density metric), ARC-P1-2 (`QUALITY_GATES.md` not integrated), ARC-P2-2 (coverage exit criterion administratively satisfiable)** |
| **D** | Targeted Architecture Corrections | All three blockers corrected; eleven further findings closed; two partially closed. **ARC-D-1 discovered:** the architecture had no persistent authoritative repository artefact |
| **D.5** | **Architecture Materialisation** | **This document — resolves ARC-D-1** |

> **This plan is awaiting focused independent re-acceptance (Phase C2). The architecture is not yet approved.**

Where Phase D changed an earlier rule, Phase D governs and only the corrected rule appears above as active guidance. Superseded metrics are recorded in §6.5 and must not be used operationally.

---

## 17. Scope Boundaries of This Plan

This document is method only. As of Phase D.5:

- **No First Edition Review execution has begun.**
- **Phase E Governance Remediation has not run.** No governance item has been remediated, dispositioned or closed.
- **No manuscript finding exists.** No chapter has been reviewed for First Edition quality.
- **No verification data exists.** No ledger, matrix or register is populated.
- **No whole-edition baseline exists.**
- **No v0.16.0 release metadata, branch or tag exists.**
- **All 137 chapters are unmodified**, and their statuses are unchanged.

Activities described here for Phases E through L are **descriptions of future authorised work**, not records of completed work.
