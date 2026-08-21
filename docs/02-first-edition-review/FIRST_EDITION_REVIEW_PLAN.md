# First Edition Review Plan

| Field | Value |
| --- | --- |
| **Project** | Modern Software Quality Engineering (MSQE) |
| **Milestone** | v0.16.0 — First Edition Review |
| **Document type** | Review Architecture / Method |
| **Document status** | **ACCEPTED — TARGETED QUANTITATIVE ARCHITECTURE RE-ACCEPTED AT F-IR4V3.** Phase C4 accepted this architecture (95.0/100, verdict A, Architecture Blockers = 0) and that acceptance stands as a historical event. **Phase F-IR1 amended §6.1–§6.4 to close finding FE-L1-005; F-IR1B made E11 explicit in §6.1.1; F-IR3 reviewed the result genuinely independently and returned verdict B; F-IR4C completed the specification (§6.1.2, §6.2.0, the Tier-2 rule, the inline-dedup rule) and made all four candidate populations enumerable; F-IR4 re-accepted it at 39 PASS · 1 FAIL; F-IR4F corrected the single remaining defect — the E11 occurrence decomposition; and F-IR4V3 independently verified that correction (Condition 35 PASS, 25 PASS · 0 FAIL).** **Phase F-IR4 is FINAL at 40 PASS · 0 PARTIAL · 0 FAIL, FE-L1-005 is CLOSED, and the targeted quantitative architecture is RE-ACCEPTED (verdict A).** All non-quantitative sections are unchanged and remain accepted at C4 |
| **Latest stable release** | v0.15.0 — Engineering Leadership & Career Growth Complete |
| **Review scope** | Parts I–XII — 137 chapters — 651,161 words |
| **Phase** | **Phase F — First Edition Review execution is COMPLETE.** Phase C4 complete (architecture accepted) · **Phase E Governance Remediation Gate COMPLETE** · **F-L1–F-L5 COMPLETE — 137 of 137 chapters longitudinally reviewed** · **F-T1–F-T6 COMPLETE**. Quantitative-instrument remediation **CLOSED** (FE-L1-005 CLOSED; F-IR4 final **40 PASS · 0 PARTIAL · 0 FAIL**; targeted quantitative architecture **RE-ACCEPTED**). **Open Class-B Review-Execution Blockers = 0.** Phase-H remediation is the next separately authorised activity; **Phase H has not started**, and **v0.16.0 remains unreleased** |
| **Owner** | Tunde Ajala |

> This is a **governance artefact**, not a manuscript chapter. It deliberately does not carry a chapter-style status such as `Draft` or `Approved`.

> **Phase C4 accepted this architecture** — Final Focused Quantitative Architecture Re-Acceptance returned **95.0/100, verdict A, Architecture Blockers = 0**. That event is historical and is preserved in §16.
>
> **The quantitative method was subsequently corrected and has now been independently RE-ACCEPTED.** Phase F-L1 and F-L2 established that the §6.4 census could not be reproduced from the committed §6.1/§6.2 text (finding **FE-L1-005**). **Phase F-IR1 amended §6.1–§6.4 and recomputed the census; Phase F-IR1B replaced E11's "standing alone" wording with the formal definition in §6.1.1.**
>
> **Independent re-acceptance is complete.** F-IR2 reproduced the census exactly but was carried out by the same actor that authored the correction, so under §11 R3 and R5 it is **evidence, not acceptance**. **Phase F-IR3 then performed a genuinely independent review** and returned **verdict B — PARTIALLY VERIFIED**: it confirmed the substantive population at match level (2,685 rows, zero differences) but found the committed specification **not implementation-complete**, because eight material semantics existed only in the implementation. **Phase F-IR4C corrected exactly that defect set** — see §6.1.2, §6.2.0, the Tier-2 formal rule in §6.2, the inline-dedup rule in §6.2.3 and the output contract in §6.3.1 — **without changing any census figure**. F-IR4C is a correction event and does not accept itself. **Phase F-IR4 then performed the fresh independent re-acceptance and returned 39 PASS · 0 PARTIAL · 1 FAIL**, the single failure being Condition 35 — active documentation consistency for the E11 occurrence decomposition. **F-IR4F corrected that decomposition to `43 + 8 = 51`, and Phase F-IR4V3 independently re-derived the population, verified the correction and returned Condition 35 PASS at 25 PASS · 0 FAIL.** **Phase F-IR4 is therefore FINAL at 40 PASS · 0 PARTIAL · 0 FAIL: §6.1–§6.4 are CORRECTED AND RE-ACCEPTED, FE-L1-005 is CLOSED, and every other section retains its C4 acceptance.**
>
> **Acceptance is of the review architecture only.** It did **not** authorise manuscript-review execution, does **not** imply release readiness, and is not itself a release verdict. **Phase E Governance Remediation and Phase F review execution are COMPLETE — F-L1–F-L5 cover 137/137 chapters and F-T1–F-T6 have completed their authorised scope. Phase H has not started and requires separate authorisation.** This document contains method only — no manuscript findings, no verification data, no dispositions; those live in `FIRST_EDITION_FINDINGS.md`, `FIRST_EDITION_VERIFICATION_LEDGERS.md` and `FIRST_EDITION_REVIEW_LOG.md`.

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
| **Gate 4 — Practical and Learning Quality**<br>practical activities · exercises validated · interview questions · scenarios · required-asset validation · Pass 2 accurately recorded | L10, **L16 (executed via T4)**, L1 |
| **Gate 5 — Publication Quality**<br>chapter version · references complete · images verified · links functional · peer review | **L12**, L11, L7, L13 |

Every gate is covered and **every level and supporting pass has a declared execution route** (§5.3). L1, L3 and L15 support the Part-Level Quality Gate Model's completeness and scope-discipline requirements rather than a single numbered gate.

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
| **K** | J pass | **Controlled Whole-Edition Baseline** | 141-object baseline + manifest | separate | Baseline recorded; drift controls active (§13.4) |
| **L** | K | v0.16.0 release administration | Release metadata | separate | v0.16.0 released from the baselined state |

**Phase E may not begin until Phase C2 returns zero Architecture Blockers.**

---

## 4. Thirteen Numbered Review Levels and Three Supporting Passes

> **Count for execution purposes: 16 defined review dimensions.**
>
> **13 primary numbered review levels** (Levels 1–13) **+ 3 supporting passes** (Levels **15**, **16**, **19**) **= 16**.
>
> The supporting passes carry inherited identifiers from the architecture's origin. **L14, L17 and L18 do not exist and must not be invented**, and the supporting passes must not be renumbered for cosmetic contiguity. A supporting pass is *not* a lesser obligation: each has an execution route (§5.3), an exit criterion, and the same correctness threshold as a numbered level. **Any coverage structure built for only 13 dimensions is incomplete.**

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

- **Exit criterion:** every criterion **PASS**, or **ACCEPTED solely through the controlled acceptance record defined in §12.2** — all seven fields, without exception. **Rationale alone is never sufficient.** Acceptance is not closure. Where an accepted criterion carries a class-D publication blocker, acceptance permits continuation of the v0.16.0 review only and **does not remove publication blocking**.

### Level 13 — Final First Edition Quality Gate

- **Objective:** a single independent authoritative verdict on the edition.
- **Unit:** the edition.
- **Relationship to the standing framework:** Level 13 is an **edition-scope extension of the Part-Level Quality Gate Model** in `QUALITY_GATES.md`, standing in the same relation to the edition that the Manuscript Quality Gate stands to a Part. It inherits that model's release-readiness logic — *no P0 or P1 release blockers remain; any release-blocking P2 findings are resolved* — and adds edition-wide coherence criteria. **It does not supersede any Part's completed gate and does not reopen released Part decisions.**
- **Census/sampling:** declared independent sample across Levels 4, 7 and 8, under §8.
- **Method:** the gate **re-derives from primary evidence; it does not confirm prior reports.** Scorecard (§7.3) plus blocker overrides (§7.4).
- **Exit criterion:** verdict issued; no open Final-Gate Blocker.

### Supporting passes

**Level 15 — Recurring-case (Atlas) continuity.** Scope established by evidence: Atlas spans **Parts III–XII**; Parts I–II are legitimately outside the case and their absence is **not** a continuity failure. Dimensions: organisation, personas, system boundaries, services, architecture, currency, numerical facts, incidents, terminology, chronology, organisational structure, technical decisions. Classification: **EVOLUTION** (signposted) · **CONTEXTUAL VARIATION** (different lens, no conflict) · **AMBIGUITY** (under-specified — record, do not force) · **CONTRADICTION** (facts cannot both hold).

**Level 16 — Exercise progression.** *Executed through transversal **T4** (§5.3); supplies Gate 4's "exercises validated" evidence.* Classify every exercise on a cognitive ladder from recognition to leadership decision-making. Two required tests: the **copy-adjacent-prose test** (can it be answered by restating nearby text?) and the **untaught-capability test** (does it require a capability never taught, per Level 9?). **Census** of exercises across all 137 chapters; **exit criterion:** every exercise classified, both tests applied, and the distribution assessed for upward progression across Parts I–XII.

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

| Batch | Parts | Chapters | Words | Tier-1 candidates | Tier-1/1k | Citations | Verification tier |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **L1** | I–II — Foundations, Programming | 22 | 125,017 | 20 | 0.160 | 110 | **Deep** |
| **L2** | III–V — Testing, API, Automation | 34 | 177,748 | 19 | 0.107 | 125 | **Deep** |
| **L3** | VI–VIII — Data, Cloud/DevOps, Observability | 33 | 115,618 | 302 | 2.612 | 62 | **Deep** |
| **L4** | IX–X — AI Quality, Performance & Security | 24 | 88,258 | 379 | **4.294** | 42 | Standard, **elevated** (§13.3) |
| **L5** | XI–XII — Architecture, Leadership | 24 | 144,520 | 449 | 3.107 | 39 | Standard |
| | **Total** | **137** | **651,161** | **1,169** | | **378** | |

> **Tier-1 figures are candidate counts recomputed at Phase F-IR1 (§6.2.4, §6.4).** The chapter, word and citation columns are unchanged from Phase C4 and were independently reconciled during F-L1 and F-L2.

**Boundary rationale.** The **VIII | IX** boundary is the evidence-maturity boundary (§13.3) and is absolute — no batch mixes verification tiers. Sub-boundaries follow conceptual continuity: L1 conceptual and skill base (and the Atlas-absent zone); L2 core practice; L3 systems and operational; L4 specialist quantitative; L5 synthesis and capstone.

### 5.3 Axis 2 — Transversal (finds what Axis 1 cannot)

| ID | Transversal review | Levels |
| --- | --- | --- |
| **T1** | Concepts and terminology | L5, L6 |
| **T2** | Citations and sources | L7 |
| **T3** | Numerical and analytical | L8 |
| **T4** | QA → QE progression, dependencies, and **exercise progression** | L9, L10, **L16** |
| **T5** | Recurring-case continuity and contradictions | L15, L19 |
| **T6** | Editorial consistency and formulaic repetition | L11 |

**T5 is scoped to Parts III–XII** by evidence. Parts I–II therefore receive five of six transversal reviews, which is adequate and stated.

**Every level and supporting pass has exactly one declared execution route.** Levels 1–4 and 12–13 execute through the longitudinal axis and the gate phases; Levels 5–11 and supporting passes 15, 16 and 19 execute through the transversals mapped above. **No level or pass is unassigned.**

> **Transversal completion rule.** A transversal may not be recorded complete unless **every level mapped to it** has been inspected with a valid six-field record (§5.4). Completing T4 therefore requires L9, L10 **and L16** each to be inspected. It is not possible to claim transversal completion while a mapped level has never been inspected.

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

**Structural-scan evidence.** Where the method is a structural scan, the evidence field must identify enough to establish that **the scan actually ran against the named object**. Any one of the following is sufficient: tool or check name **with** its version or script revision · command or check identifier · output or saved-report reference · result digest or hash · a reproducible result summary tied to the inspected object (for example *"heading-order check v3, 0 jumps across 12 chapters"*).

> **A bare `scan clean` is explicitly insufficient**, as is any assertion that does not name what was run. This does not require quotation and adds no paperwork beyond identifying the check and its result.

---

## 6. Quantitative-Content Census

### 6.1 Classification pipeline — deterministic ordering

#### 6.1.0 Input population and masking discipline

**Input population.** The census reads exactly the **137 chapter files** matching `book/part-*/chapters/chapter-*.md`, as UTF-8 text, in sorted path order. No other file, directory or repository artefact contributes to any census figure. Part READMEs, governance documents, templates, diagrams and companion code are **out of population**.

**Word count** is `len(text.split())` over the unmodified file — whitespace-delimited tokens of the raw Markdown, before any exclusion.

**Masking discipline.** Every PASS-0 exclusion **masks** rather than deletes: matched characters are replaced by spaces and **newlines are always preserved**. Character offsets and line numbers are therefore identical in the original text and in the residue at every stage. An exclusion whose pattern could span a newline must be constrained so that it cannot, because a single unclosed delimiter would otherwise mask unrelated later lines.

**Line-scoped exclusions are decided on the original line.** E5, E7 and E8 remove whole lines. Whether a line qualifies is tested against the **original line text**, never against the partially masked text, so their behaviour does not depend on the order in which the character-level maskers ran.

> **Governing precedence rule.** **A recognised Tier-1 quantitative claim always takes precedence over an identifier exclusion.** No exclusion may delete a token already classified as a Tier-1 claim.
>
> **Scope of that rule — normative.** Tier-1 classification happens in PASS 1. The precedence rule therefore governs **PASS 2 (E12) only**, which is the sole exclusion running after protection. **It does not govern PASS 0.** PASS-0 exclusions run *before* any token is classified, so they can and do remove text that would otherwise have matched a Tier-1 class. That is intended: a bibliographic line, a metadata row or a URL is not a teaching claim regardless of the digits it contains. **Reading the precedence rule as constraining PASS 0 was the primary ambiguity behind finding FE-L1-005.**

Classification runs as five ordered passes. The ordering is normative: an independent implementation must reproduce the census without guessing.

| Pass | Input | Rule | Output | Precedence |
| --- | --- | --- | --- | --- |
| **PASS 0** | chapter source | Remove **structurally unambiguous non-claims** (E1–E11 below). Fenced-code content is set aside as a separate population, not deleted. | PASS-0 residue + code population | Runs first; nothing downstream can restore a PASS-0 removal |
| **PASS 1** | PASS-0 residue | **Match and protect Tier-1 quantitative claims** (§6.2). Protected spans are immutable for the rest of the pipeline. | Tier-1 set | **Highest precedence.** No later pass may delete a protected span |
| **PASS 2** | PASS-0 residue minus protected spans | Apply the **context-dependent identifier exclusion** (E12) **only to numeric tokens not protected in PASS 1** | reduced residue | Subordinate to PASS 1 |
| **PASS 3** | PASS-2 residue minus protected spans | Classify remaining **bare integers of two or more digits** as **Tier-2 candidates** | Tier-2 set | Lowest precedence; residue only |
| **PASS 4** | Tier-1 set | **Deduplicate** by leftmost-longest match; where two classes match the same span, the §6.2 class order is the tie-break | final counts | Applies within Tier 1 only |

**Why the split between PASS 0 and PASS 2.** An exclusion belongs in PASS 0 when its match is **structurally determined by its own form** and cannot hide a genuine claim. An exclusion belongs in PASS 2 when it depends on **surrounding context** and could therefore fire on a genuine claim. **E12 is the only context-dependent exclusion**, and placing it after Tier-1 protection is what prevents it destroying value-bearing claims.

**PASS 0 — structurally unambiguous non-claims:**

| # | Excluded | Form | Rationale |
| --- | --- | --- | --- |
| E1 | Fenced code blocks | ```` ``` ```` and `~~~` delimited | set aside as a separate population, never Tier 1 or Tier 2 |
| E2 | Inline code spans | backtick-delimited | identifiers, not prose claims |
| E3 | Absolute URLs | `http://`, `https://` | contain digits |
| E4 | Markdown link and image targets | the `](…)` portion only; **link text is retained**. The target **must not span a newline** | relative paths carry chapter and delivery numbers |
| E5 | Footnote definition lines | **the entire line**, where the *original* line matches `^\s*\[\^[^\]]+\]:` | bibliographic volumes, pages, years, edition and version strings. **E5 removes the whole line including any span that would otherwise match a Tier-1 class**, and it removes that content from the Tier-2 residue as well |
| E6 | Footnote references | `[^key]` | citation identifiers |
| E7 | Chapter metadata rows | **the entire row**, where the *original* row's first cell — lowercased, with surrounding emphasis stripped — is one of the closed set `chapter`, `part`, `version`, `status`, `estimated study time`, `prerequisites`, `reading time`, `difficulty` | metadata, not teaching claims. The set is closed; no other label qualifies |
| E8 | `Chapter N` / `Part N` headings | ATX headings | structural numbering |
| E9 | Standards designators | `ISO`, `ISO/IEC`, `ISO/IEC/IEEE`, `ISO/TS`, `IEC`, `IEEE`, `RFC`, `BS`, `EN` followed by digits, optional `-nnn` parts, optional `:YYYY`. Formally defined in **§6.1.2**; that definition is normative and this cell is a summary | reference identifiers |
| **E10** | **Time of day** | `HH:MM` and `HH:MM:SS`, `HH` 00–23, `MM`/`SS` 00–59. Formally defined in **§6.1.2**; that definition is normative and this cell is a summary | **timestamps are not ratios.** Evaluated **before** E11 so a clock form is never re-read as a bare year |
| E11 | Bare years | A four-digit year **1900–2099** that is **not part of a larger numeric construct**. Formally defined in **§6.1.1**; that definition is normative and this cell is a summary | bibliographic and timeline years |

**PASS 2 — context-dependent identifier exclusion, applied to unprotected tokens only:**

| # | Excluded | Rationale and constraint |
| --- | --- | --- |
| **E12** | Three-digit numbers **100–599** where a trigger word — `HTTP`, `status`, `response`, `code`, `return`, `returns` — occurs within **25 characters** before or after the match. The token form and the window's measurement basis are formally defined in **§6.1.2**; that definition is normative and this cell is a summary | HTTP status codes are technical identifiers, verified at Levels 4 and 6, not Level 8. **E12 may never remove a token protected in PASS 1.** Without that constraint, genuine latency claims such as `310 ms` in *"Average checkout **response** latency"* are destroyed by the word "response" falling inside the window. A token that E12 does not remove falls to **Tier-2 triage**, where a human decides — so the window errs toward triage rather than deletion. |

**E12 window — chosen empirically, not inherited.** Windows of ±25, ±50, ±75 and ±100 characters were measured against the edition. Precision of true HTTP identifiers among excluded tokens: **±25 → 66%**, ±50 → 55%, ±75 → 54%, ±100 → 51%. **±25 is the smallest window tested and the most precise**; wider windows pull in unrelated numbers through context bleed. Tokens a narrow window misses are not lost — they fall to Tier-2 triage.

#### 6.1.1 E11 — formal definition

The phrase *"standing alone"* previously carried the whole weight of E11 and was not implementation-complete: two defensible readings differed by **46 Tier-2 candidates**. The rule below replaces it. **This definition is normative.**

**Regular expression — normative:**

```text
(?<![\d.,/-])(?:19\d{2}|20\d{2})(?![\d.,/%-])
```

**Equivalent predicate.** A token *Y* is excluded by E11 when **all three** hold:

1. *Y* matches `19\d{2}` or `20\d{2}` — the closed range 1900–2099, exactly four digits;
2. the character immediately **before** *Y* is not a member of the **left-boundary set** `{digit, . , , , / , -}`;
3. the character immediately **after** *Y* is not a member of the **right-boundary set** `{digit, . , , , / , % , -}`.

Start-of-text and end-of-text satisfy conditions 2 and 3 respectively.

**Boundary sets, and why they differ.** The right set additionally contains `%`. A token such as `2026%` is a **percentage claim** and must reach PASS 1 as a `pct` candidate; without the `%` guard E11 would delete it before it could be classified. No comparable case arises on the left, so `%` is absent there.

**What the boundaries mean.** Numeric punctuation on either side signals that the year is a **component of a larger construct** — an ISO date, a version string, a report identifier — rather than a calendar year used on its own. E11 removes only the standalone case. A year inside a larger construct is **left in the residue and falls to Tier-2 triage**, which is where §6.2 routes ambiguous numerics by design.

> **Why the year is not removed from inside a construct.** Deleting a year mid-token **fragments** the token and causes its remainder to be re-read by later passes. Measured on this edition, the word-boundary reading deletes `2026` from `version 2026.10.4` and the residue `10.4` is then admitted as a new candidate that exists in no source sentence. **Silent reclassification of a fragment is exactly the failure class §6.3 exists to prevent.**

**Worked boundary table — every case is decided by the rule above:**

| Form | E11 excludes? | Governing condition |
| --- | --- | --- |
| `2026` | **Yes** | both boundaries clear |
| `(2026)` | **Yes** | `(` and `)` are in neither boundary set |
| `2026.` at end of a sentence | **No** | `.` is in the right set, so the year is **retained** — see the bounded-consequence note below |
| `2026,` | **No** | `,` is in the right set, so the year is **retained** — same note |
| `2026:` | **Yes** | `:` is in neither set |
| `2026;` | **Yes** | `;` is in neither set |
| `2026.10` | No | right character `.` — version construct |
| `10.2026` | No | left character `.` — version construct |
| `2026/10` | No | right character `/` — date construct |
| `10/2026` | No | left character `/` — date construct |
| `2026-10` | No | right character `-` — ISO date construct |
| `10-2026` | No | left character `-` — date construct |
| `v2026` | **Yes** | `v` is in neither set |
| `build2026` | **Yes** | `d` is in neither set |
| `2026x` | **Yes** | `x` is in neither set |
| `x2026` | **Yes** | `x` is in neither set |
| `2026%` | No | `%` is in the right set, so the token reaches PASS 1 as a `pct` candidate |

> **Known bounded consequence — corrected at F-IR4C.** A year immediately followed by a full stop or a comma is **retained by E11** rather than excluded. Lookahead alone cannot distinguish sentence punctuation from decimal punctuation, and narrowing the right set would re-introduce the fragmentation defect described above.
>
> **Retention by E11 does not imply admission to Tier-2.** E11 and the Tier-2 rule (§6.2) are independent gates that happen to share a boundary principle. A year such as `2018.` is retained here because its right neighbour is numeric punctuation, and is then **rejected by the Tier-2 rule for exactly the same reason** — so it reaches **neither tier**. F-IR3 established that the earlier wording of this note, which asserted that such years "therefore reach Tier-2", stated a mechanism that does not occur.
>
> **Measured across all 137 chapters the consequence costs nothing.** Of the **51** four-digit years that do reach Tier-2, **43 are embedded in a numeric construct** (ISO dates, version strings) and the remaining **8 are embedded in alphanumeric identifiers** — all of which a human should triage. **43 + 8 = 51.** Every one is hyphen- or slash-separated, which is why the Tier-2 rule admits it. **No standalone prose year appears in Tier 1 or Tier 2.** The consequence is recorded because it is a property of the rule, not because it has an observed cost.
>
> **Counting basis — normative. These are Tier-2 candidate OCCURRENCES, not distinct lexical forms and not raw textual occurrences.** The three are different objects and must never be interchanged. A figure on this basis counts only what **survives PASS 0 and Tier-1 removal and is emitted as a Tier-2 candidate**; it never counts a token that E5 or any other exclusion removed before Tier-2 was reached. This is the same occurrence basis §6.2.1 fixes for every census figure.
>
> **The 8 alphanumeric occurrences span 8 distinct forms, each occurring exactly once in the Tier-2 population:**
>
> | # | Form | Tier-2 occurrences | Locus |
> | --- | --- | --- | --- |
> | 1 | `CMU/SEI-2000-TR-004` | 1 | Part XI · `chapter-01-system-design-architecture-as-quality-engineering.md` L370 |
> | 2 | `v2026-03` | 1 | Part IX · `chapter-07-retrieval-augmented-generation-quality.md` L118 |
> | 3 | `v2025-01` | 1 | Part IX · `chapter-07-retrieval-augmented-generation-quality.md` L119 |
> | 4 | `v2026-03-EU` | 1 | Part IX · `chapter-07-retrieval-augmented-generation-quality.md` L120 |
> | 5 | `v2026-03-US` | 1 | Part IX · `chapter-07-retrieval-augmented-generation-quality.md` L121 |
> | 6 | `v2026-02-P` | 1 | Part IX · `chapter-07-retrieval-augmented-generation-quality.md` L122 |
> | 7 | `archive-2024` | 1 | Part IX · `chapter-07-retrieval-augmented-generation-quality.md` L123 |
> | 8 | `fulfilment-2026-02` | 1 | Part IX · `chapter-07-retrieval-augmented-generation-quality.md` L125 |
>
> **8 forms · 8 occurrences.** Because every form occurs exactly once here, forms and occurrences happen to coincide on the alphanumeric side of this edition — a coincidence of the current manuscript, **not** a licence to treat the two as the same object anywhere else.
>
> **The 43 numeric occurrences span 10 distinct ISO-date and version forms**, and these do **not** occur once each:
>
> | Form | Tier-2 occurrences |
> | --- | --- |
> | `2026-03` | 17 |
> | `2025-01` | 13 |
> | `2026-08-10` | 4 |
> | `2026-03-01` | 3 |
> | `2024-06-01` | 1 |
> | `2025-01-01` | 1 |
> | `2026-01-10` | 1 |
> | `2026-02-10` | 1 |
> | `2026-02-15` | 1 |
> | `2026-08-15` | 1 |
> | **Total** | **43** |
>
> `17 + 13 + 4 + 3 + 1 + 1 + 1 + 1 + 1 + 1 = 43`, and `43 + 8 = 51`.
>
> **Worked diagnostic — why a textual occurrence is not a Tier-2 occurrence.** `CMU/SEI-2000-TR-004` appears **6 times** in the manuscript text. **5 of those 6 sit on E5 footnote-definition lines**, which PASS 0 removes in their entirety, so they never enter the Tier-2 population at all. **Exactly 1 reaches Tier-2** — the prose reference at Part XI `chapter-01` L370. Counting the raw 6 against a denominator of Tier-2 occurrences is what produced the superseded alphanumeric figure below. **This is a diagnostic about counting, not a classifier rule**: E5 already behaves this way and is unchanged.
>
> **Superseded decompositions — historical, must not be used operationally.** Three earlier splits of this same 51 are on record and **all three are wrong**:
>
> | Split | Recorded at | Status | Why it was wrong |
> | --- | --- | --- | --- |
> | **49 + 2** | F-IR3, ledger NUM-IR3-02 | **SUPERSEDED — non-operational** | Counted distinct lexical forms against a denominator of occurrences; enumerated only `archive-2024` and `CMU/SEI-2000-TR-004`, omitting five further alphanumeric forms |
> | **48 + 3** | plan §6.1.1, introduced at commit `8fd5899` | **SUPERSEDED — non-operational** | Same form-versus-occurrence conflation; omitted the four `v2026-*` forms and `v2025-01` |
> | **40 + 11** | F-IR4E, plan §6.1.1 · §6.2 · ledger NUM-IR3-02 | **SUPERSEDED AT F-IR4F — non-operational** | Stated the occurrence basis correctly but did not apply it: the alphanumeric side counted all **6 raw textual** occurrences of `CMU/SEI-2000-TR-004`, of which 5 are E5-removed, and the numeric side was then obtained by subtraction (`51 − 11`) rather than measured. It also omitted `v2026-03` and `v2025-01` from its six-form list |
> | **43 + 8** | **F-IR4F** | **ACTIVE — the only operational split** | Measured directly on the Tier-2 candidate population emitted by the canonical implementation |
>
> **The total 51 was correct throughout**; only the decomposition moved. Corrected at **F-IR4F** on the independent occurrence-based measurement established at **F-IR4V2**. **No census figure changes, the E11 predicate and regular expression are unchanged, the Tier-2 rule is unchanged, and no classifier behaviour changes** — the correction is to the decomposition only. **F-IR4F does not verify itself.** **Independently verified at F-IR4V3**, which re-derived the population from the manuscript before reading this section and reproduced `43 + 8 = 51`, all ten numeric multiplicities and all eight alphanumeric forms exactly — **Condition 35 PASS**.

**Interaction with other exclusions.**

| With | Behaviour |
| --- | --- |
| **E10** | E10 runs **first**, so a clock form is never re-read as a year. Unchanged. |
| **E3, E4** | A year inside an absolute URL or a link target is already masked before E11 is evaluated; E11 neither sees nor needs it. |
| **E5, E7** | A year on a footnote-definition line or in a chapter metadata row is removed with the whole line. E11 never runs on that content. |
| **E12** | E12 operates on three-digit tokens only and cannot interact with a four-digit year. |
| **Code-fence population** | **E11 does not apply.** Fenced content is set aside by E1 and is counted only as numeric literals under §6.2.2. |
| **Inline-code population** | **E11 does not apply.** §6.2.3 applies Tier-1 grammar to the E2-suppressed text; PASS-0 exclusions are not re-run over it. |

**Tier interaction.** E11 removes text before PASS 1, so an excluded year enters **neither Tier 1 nor Tier 2**. A year the rule retains is available to both, and in practice reaches Tier 2, because no Tier-1 class matches a bare four-digit integer.

**ARC-C3-5 is unaffected.** The accepted observation that a bare 1900–2099 *quantity* would be suppressed concerns the standalone case, which this clarification does not alter.

#### 6.1.2 E9, E10 and E12 — formal definitions

E11 was made formal at F-IR1B. **F-IR3 found that E9, E10 and E12 still carried material semantics that existed only in the implementation.** The definitions below close that gap. **They are normative**, they describe behaviour the classifier already exhibits, and they change no census figure.

**E9 — standards designators. Regular expression — normative:**

```text
\b(?:ISO/IEC/IEEE|ISO/IEC|ISO/TS|ISO|IEC|IEEE|RFC|BS|EN)\s?\d+(?:\s?-\s?\d+)*(?::\d{4})?
```

| Element | Rule |
| --- | --- |
| **Designator boundary** | The designator must begin at a **word boundary**. The alternation is ordered longest-first, so `ISO/IEC/IEEE` is preferred over `ISO/IEC` and `ISO` |
| **Separator before the first digit group** | **At most one whitespace character**, or none. `ISO 25010` and `ISO25010` both match; **`ISO-25010` does not** — a hyphen is not a permitted separator before the *first* digit group |
| **Subsequent `-nnn` parts** | Optional and repeatable, each with at most one whitespace character either side of the hyphen |
| **Trailing `:nnnn`** | Optional; exactly four digits. It is a designator edition marker, not a year test, so no 1900–2099 range applies |

> **Why the word boundary is retained — prophylactic, not load-bearing on this edition.** Measured independently at F-IR4, **removing `\b` alone changes 0 Tier-2 candidates across all 137 chapters.** The boundary is retained because it is semantically defensive: it stops the short alternatives `EN` and `BS` matching **inside** a token that would otherwise satisfy the designator grammar, so forms such as `GEN 01`, `GEN01` or `TOKEN 25010` can never be read as standards designators. On the current edition the **separator rule already does that work** — a hyphen is not a permitted separator before the first digit group, so `GEN-01`, `REG-01`, `CLS-01` and `FAIR-01` are untouched **with or without** `\b`, and each `01` reaches Tier-2 correctly.
>
> **The 12-candidate figure — compound perturbation, precisely scoped.** The figure of **12 Tier-2 candidates** previously attributed here to removing `\b` **is not reproducible from that perturbation** and must not be attributed to it. It arises only when **both** guards are relaxed — `\b` dropped **and** a hyphen permitted before the first digit group — which surfaces `BS-01` inside `ARCH-OBS-01` (**Part XI, ×12**) and `EN-01` inside `GEN-01` (**Part IX, ×3**), suppressing **12** Tier-2 candidates net. Neither identifier is reachable under the committed grammar. Corrected at **F-IR4E**; the **normative E9 regular expression is unchanged** and no census figure changes.

**E10 — time of day. Regular expression — normative:**

```text
\b(?:[01]\d|2[0-3]):[0-5]\d(?::[0-5]\d)?\b
```

| Element | Rule |
| --- | --- |
| **Grammar** | `HH:MM` or `HH:MM:SS`. `HH` is `00`–`23`, `MM` and `SS` are `00`–`59`. `24:00` is **not** a clock form and is not excluded |
| **Boundaries** | **Word boundaries on both sides.** The exclusion covers the digits and colons only |
| **Trailing punctuation** | **Punctuation after the time is not part of the exclusion and does not defeat it.** `08:42.` and `10:02,` are excluded as `08:42` and `10:02`; the `.` and `,` remain in the residue as ordinary punctuation |
| **Sub-second precision** | `10:14:02.118` is excluded as `10:14:02`. The residue `.118` has no digit before the decimal point and therefore **cannot** be admitted by `dec` (§6.2.0) |
| **Ordering** | E10 runs **before** E11, so a clock form is never re-read as a bare year |

**E12 — window measurement basis. Normative:**

| Element | Rule |
| --- | --- |
| **Token form** | `\b\d{3}\b` — exactly three digits at word boundaries — whose integer value is in the closed range **100–599** |
| **Window basis** | **±25 characters measured from the nearest edge of the match, excluding the match itself.** The examined context is the **25 characters immediately preceding the match start**, concatenated with the **25 characters immediately following the match end**. It is not measured from the match start alone, not from a token midpoint, and never includes the matched digits |
| **Clipping** | The window is clipped at the start and end of the chapter text; no padding is added |
| **Text searched** | The window is read from the **PASS-2 working text** — the PASS-0 residue with PASS-1 protected spans already blanked. A trigger word inside a protected Tier-1 span therefore cannot trigger E12 |
| **Trigger matching** | `HTTP`, `status`, `response`, `code`, `return`, `returns`, matched **case-insensitively** as substrings |

### 6.2 Inclusion pass — two tiers

#### 6.2.0 Numeric-token semantics — normative

**What "a number" means.** Every Tier-1 class is built from one numeric-token form. **F-IR3 found that this form, and the boundaries around it, existed only in the implementation** — and that the boundary question alone moves the Tier-1 total by 25 candidates. The definitions below close that gap. They describe behaviour the classifier already exhibits and change no census figure.

```text
NUM  := \d[\d,]*(?:\.\d+)?          the common numeric token
SEP  := \s?                          at most ONE whitespace character, or none
```

| Element | Rule |
| --- | --- |
| **Digits and separators** | `NUM` is a leading digit, then any run of digits and commas, then an optional decimal part. It admits `7`, `250`, `43,200`, `0.99391` and `1,842` as a single token |
| **Separator** | Wherever a class joins a number to its marker — `%`, a currency sign, a unit word, `/`, `per` — **at most one whitespace character is permitted**. `50 %` and `50%` are both `pct`; **`50  %` (two spaces) is not**. This is a deliberate tightness: a marker separated by more than one space is not reliably bound to the number |
| **Left boundary** | **`thou` and `dec` require a word boundary**; the other five classes do not. Alphanumeric adjacency therefore invalidates a `thou` or `dec` candidate but not a `pct`, `cur`, `unit`, `ratio` or `perN` candidate |
| **Right boundary** | Same asymmetry. `thou` and `dec` close on `\b`; the other five close on their own marker |
| **Punctuation** | Sentence punctuation adjacent to a number is never part of a Tier-1 match. Numeric punctuation *inside* `NUM` — commas and one decimal point — is part of the token |
| **Markdown and link text** | Classification runs on the PASS-0 residue. **Link text is retained** (E4 masks only the `](…)` target), so a number inside link text is an ordinary candidate. Inline code and fenced code have already been set aside by E2 and E1 |

> **Why only `thou` and `dec` carry word boundaries.** The other five classes are disambiguated by their own marker: a `%`, a currency sign, a unit word, a slash or the word `per` is itself evidence that the digits are a quantity. `thou` and `dec` have no such marker — they are *shape* classes — so without a boundary they match inside identifiers and version strings. **This single rule is what makes the Part III count 14 rather than 23**, and it is derivable here without opening the implementation.

**Worked boundary cases — every one decided by the rules above:**

| Form | Result | Governing rule |
| --- | --- | --- |
| `v4.0a` | **no `dec`** | left `\b` fails between `v` and `4`; right `\b` fails between `0` and `a` |
| `4.0` standing alone | `dec` | both boundaries clear |
| `2026.10.4` | `dec` = `2026.10` | boundaries clear; the token is not extended past the second `.` |
| `abc123` | **no `thou`, no `dec`** | shape classes require `\b`; the `123` falls to Tier-2 |
| `v123%` | `pct` = `123%` | `pct` carries no left boundary; the `%` supplies the disambiguation |
| `30 seconds` · `30seconds` | `unit` | `SEP` is one space or none |
| `30-second` · `30  seconds` | **no `unit`** | a hyphen is not a separator; two spaces exceed `SEP` |

**Tier 1 — seven closed classes.** The set is finite and contains **no ellipsis and no open-ended extension**. Class order below is also the PASS-4 tie-break order. **The pattern column is normative.**

| # | Class | Definition | Formal pattern | Evidenced |
| --- | --- | --- | --- | --- |
| 1 | `pct` | number followed by `%`, separated by at most one space | `NUM SEP %` | 415 |
| 2 | `cur` | `€`, `$` or `£` followed by a number, separated by at most one space | `[€$£] SEP NUM` | 56 |
| 3 | `unit` | number followed by a member of the **closed unit set** below, separated by at most one space, unit closed at a word boundary | `NUM SEP UNIT \b` | 335 |
| 4 | `ratio` | **slash form only** — number `/` number, **where the right operand is not a four-digit year 1900–2099** (which would make it a date). At most one space either side of the slash. **The right operand is plain digits only** — no comma group and no decimal part | `NUM SEP / SEP (?!(?:19\|20)\d{2}(?!\d)) \d+ (?!\d)` | 84 |
| 5 | `perN` | number followed by `per` and a word | `NUM SEP per \s+ \w+` | 16 |
| 6 | `thou` | thousands-separated number, e.g. `43,200`, at word boundaries | `\b\d{1,3}(?:,\d{3})+\b` | 116 |
| 7 | `dec` | decimal number, e.g. `0.99391`, at word boundaries | `\b\d+\.\d+\b` | 147 |

> **`UNIT` is matched longest-first**, so `minutes` is preferred over `min` and `seconds` over `s` wherever both could apply.
>
> **The Evidenced column is the active census (§6.4) and sums to 1,169.** It was refreshed at F-IR4C; the C4-era per-class figures it replaced — `thou` 126 and `dec` 181, summing to the superseded 1,213 — are recorded in §6.5 and must not be used operationally.

**Closed unit set — 19 forms, every one evidenced in the edition:**

| Kind | Forms |
| --- | --- |
| Time | `ms` · `millisecond` · `milliseconds` · `s` · `second` · `seconds` · `min` · `minute` · `minutes` · `h` · `hour` · `hours` · `day` · `days` · `month` · `months` |
| Data | `GB` |
| Rate | `requests/s` · `jobs/s` |

**Short forms `s`, `min` and `h` ARE included** — repository evidence confirms them as teaching claims (`7.8 s`, `525 s`, `8 min 45 s`, `6h 12m`, `7 h`, `42s`). A unit must be matched at a word boundary; PASS-0 already removes code spans, URLs, link targets, version strings and standards designators, so no additional lexical guard is required and none is added.

**Units investigated and excluded for want of evidence:** `sec`, `secs`, `hr`, `hrs`, `week`, `weeks`, `B`, `KB`, `MB`, `TB`, `KiB`, `MiB`, `GiB`, `TiB`, `bytes`, `rps`, `qps`, `requests/sec`, `transactions/s`, `events/s`, `records/s`, `ops/s` — all return **zero** matches. Bare `B` was tested and rejected: its only three matches are option labels (`A 16, B 14`), not bytes.

**A multiplier class is deliberately absent.** Searches for `n×`/`nx` used as a multiplier (`3× faster`, `5-fold`) return **zero** matches; the 39 occurrences of `a × b` are arithmetic steps whose operands are already captured by `dec`, `thou` or `cur`. A class with no evidence is not carried.

**No colon-ratio class exists.** Every colon-separated numeral in the edition is a clock time or a standards designator; **not one genuine colon ratio was found across 137 chapters**. Colon forms are therefore removed in PASS 0 (E10, E9) rather than admitted and filtered.

**Tier 2 — candidates**

| Class | Treatment |
| --- | --- |
| bare integers of two or more digits · three-digit numbers E12 did not remove | **never counted as claims**; triaged per chapter into claim or identifier; confirmed claims join the Tier-1 ledger |

**Tier-2 formal definition — normative.** The phrase *"bare integers of two or more digits"* was not implementation-complete: F-IR3 measured the two defensible readings at **1,516 against 1,795 candidates**. The rule below replaces it.

```text
(?<![\d.,])\d{2,}(?![\d.,])
```

**Equivalent predicate.** A token *N* is a Tier-2 candidate when **all four** hold:

1. *N* is a run of **two or more digits**;
2. the character immediately **before** *N* is not a digit, `.` or `,`;
3. the character immediately **after** *N* is not a digit, `.` or `,`;
4. *N* lies in the PASS-2 working text — it survived PASS 0, was not protected in PASS 1, and was not removed by E12.

Start-of-text and end-of-text satisfy conditions 2 and 3 respectively. **The boundary set is `{digit, . , ,}` — it does not contain `-` or `/`**, so a hyphen- or slash-separated construct yields one candidate per digit group.

| Form | Tier-2 result | Governing condition |
| --- | --- | --- |
| `2026-03` | **`2026` and `03`** | `-` is in neither boundary set; each group qualifies separately |
| `CMU/SEI-2000-TR-004` | **`2000` and `004`** | same — `/` and `-` are not boundaries |
| `2026.` at end of a sentence | **neither tier** | condition 3 fails on `.` |
| `2026,` | **neither tier** | condition 3 fails on `,` |
| `2026.10` | **neither tier** | claimed earlier by `dec` as a Tier-1 candidate and protected in PASS 1 |
| `43,200` | **neither tier** | claimed earlier by `thou`; had it not been, conditions 2 and 3 would fail on the comma |
| `abc123` | **`123`** | `-`/letters are not boundaries; shape classes rejected it at PASS 1 |

> **Why numeric punctuation bounds a Tier-2 candidate.** A digit run touching a `.` or a `,` is a **fragment of a larger numeric construct**, not a bare integer. Admitting the fragment would put a number into the review population that appears in no source sentence — the same failure class §6.1.1 rejects for E11. Hyphens and slashes are excluded from the boundary set because a hyphen- or slash-separated construct is a *sequence of distinct integers* — an ISO date, a report number — each of which a human should see.

> **Relationship to E11 — this reconciles the §6.1.1 bounded consequence.** E11 and the Tier-2 rule are **two independent gates**, and retention by the first does not imply admission by the second. A year followed by `.` or `,` is **retained by E11** because its right neighbour is numeric punctuation, and is then **rejected by the Tier-2 rule** for exactly the same reason. Such a year therefore reaches **neither tier**. The 51 four-digit years that do reach Tier-2 are precisely those embedded in hyphen or slash constructs — **43 occurrences** in ISO-date and version forms, plus **8 occurrences** across the eight alphanumeric identifiers enumerated at §6.1.1. **These are Tier-2 candidate occurrences, not distinct lexical forms and not raw textual occurrences; 43 + 8 = 51.** §6.1.1 carries the full decomposition, the per-form multiplicities and the superseded splits; this locus states the totals only and must not restate the basis differently. **Corrected at F-IR4F.** **No standalone prose year appears in either tier**, which is the property §6.1.1 asserts; the mechanism is the pair of gates, not E11 alone.

**Code-fence numerics are a separate population.** They are counted separately, reviewed where technically relevant, and are **neither Tier 1 nor Tier 2**.

**Bare integers cannot be a primary signal.** They cannot be separated from identifiers by pattern alone — genuine values sit beside chapter cross-references, stage numbers, status codes and standards numbers. Tier 2 makes the ambiguity explicit and routes it to human triage rather than silently counting or silently dropping it.

**Tier membership, overlap and counting semantics:**

- **A token belongs to at most one tier.** Tier-1 membership is exclusive and is decided in PASS 1; a token protected as Tier-1 can never later become Tier-2 or be excluded.
- **Tier-2 is the residue only** — tokens surviving PASS 0 and PASS 2 that were not protected in PASS 1.
- **Overlap within Tier 1** is resolved by **leftmost-longest** match; where two classes match the same span, the **class order in §6.2** is the tie-break (`pct`, `cur`, `unit`, `ratio`, `perN`, `thou`, `dec`).
- **Counts are match occurrences, not distinct values.** The same figure appearing three times is three occurrences, because each is a separate claim requiring verification.
- **Code-fence numerics** are counted in their own population and are never added to Tier 1 or Tier 2.
- **A compound duration** such as `8 min 45 s` or `6h 12m` yields at least one Tier-1 claim; the whole compound is verified as one claim at Level 8.

#### 6.2.1 Occurrence semantics — normative

**A census figure counts textual match occurrences, not distinct values, not semantic claims, and not chapters.** The same figure appearing three times is **three** occurrences, because each is a separate span requiring verification. Occurrences are counted per chapter after PASS-4 deduplication and summed to Part, batch and edition totals. **No other counting basis is permitted anywhere in this plan.**

#### 6.2.2 Code-fence population — normative

`code-fence = N` means: **N is the number of numeric-literal occurrences inside fenced code blocks**, where a numeric literal is a maximal match of `\d+(?:[.,]\d+)*` and fenced code is the region set aside by E1.

It is **not** a count of code blocks, not a count of blocks containing numbers, and not a count of unique literals. The code-fence population is **neither Tier 1 nor Tier 2** and never contributes to either.

**The region set aside by E1 includes the fence delimiter lines**, so an info string such as ` ```text ` is inside the population; no info string in this edition carries a digit, so the figure is unaffected either way. **Every occurrence is individually enumerable** with its Part, path and line under the §6.3.1 output contract — a count alone would not let Level 8 decide where a fenced numeric is technically relevant.

#### 6.2.3 Inline-code candidate population — normative

E2 removes inline code spans on the rationale that they carry identifiers rather than prose claims. That rationale is sound in general but **not universal**: a code span is also used to quote a diagnostic message, and such a message can contain a genuine quantitative claim.

**E2's suppression is therefore measured rather than silent.** Tier-1 grammar is applied to the E2-suppressed text and the result reported as the **inline-code candidate population**. This population is **neither Tier 1 nor Tier 2**, contributes to no census total, and exists so that Level 8 can see what E2 removed and adjudicate it. A confirmed claim found there is verified at Level 8 and recorded in the Numerical Verification Ledger with its origin stated.

**PASS-4 deduplication does NOT apply to this population — normative.** Each of the seven §6.2 classes is applied independently to the suppressed text and **every match is reported, including overlapping matches of different classes**. A span such as `92.0%` therefore contributes **two** rows — one `pct` and one `dec` — where the same span in prose would contribute one.

> **Why the two populations count differently.** PASS 4 exists to decide **tier membership**, which must be exclusive: a prose span is one claim and may be counted once. The inline-code population decides nothing. It is an **observability record of what E2 removed**, and its members never compete for tier membership, never enter a census total and never reach a density figure. Collapsing overlaps here would hide part of what was suppressed, which is the one thing this population exists to prevent. F-IR3 measured the difference at **366 against 273 candidates**; the reported figure is **366**.

#### 6.2.4 Candidate versus confirmed claim — normative

The two counts are different objects and **must never be conflated**.

| | Definition | Determined by | Reproducible |
| --- | --- | --- | --- |
| **Tier-1 candidate** | A span surviving the §6.1 pipeline and matching a §6.2 class | The specification alone, mechanically | **Yes — exactly** |
| **Confirmed quantitative claim** | A Tier-1 candidate that adjudication confirms is a quantitative teaching claim | Human judgement against the surrounding text | No — it is a review judgement |

**The census in §6.4 reports candidates.** Level 8's exit criterion — *every confirmed quantitative claim recomputed* — is discharged by adjudicating the **complete candidate population** and recording, for each candidate, either a dual verdict or an explicit `NOT APPLICABLE` with its reason.

> **This is the structural resolution of FE-L1-005.** Completeness is proved mechanically at the candidate level, where reproducibility is achievable. Claimhood is decided by review, where it belongs. **A reviewer must never be required to discover the candidate population by hand**; hand-discovery does not scale to the 300–450 candidate batches and cannot demonstrate completeness.

**Accepted architecture observation — ARC-C3-5 (P3, non-blocking).** E11 removes bare years 1900–2099, so a quantity that happens to fall in that range and carries no unit — *"the batch contained 2000 records"* — would be suppressed. **Consequence:** one quantitative claim per occurrence would bypass Level 8. **Rationale for accepting rather than narrowing:** a repository-wide search for a bare 1900–2099 number followed by a quantity noun returns **zero instances**, and narrowing E11 would convert every publication and timeline year into Tier-2 noise — a larger, certain cost against a hypothetical one. **Revision trigger:** if any bare 1900–2099 quantity appears in manuscript text outside a calendar or date context, re-test E11 and narrow it. **Owner:** review architecture owner. **Blocker class:** C. **Severity:** P3.

### 6.3 Mandatory reflexive validation

> **Any metric used by the review architecture itself must be sampled against source text and validated before its output is used for review allocation or scoring.**

This rule exists because **three** successive versions of this metric failed construct validity — a percentage-only proxy, then a composite contaminated by file paths and status codes, then an exclusion ordering that silently destroyed 21 genuine claims. The architecture demands construct validity of the manuscript; it must apply the same discipline to itself.

**The rule applies to every individual exclusion and inclusion pattern, not only to the metric as a whole.** Each **exclusion** must be tested for *suppression* — whether it removes a genuine claim — and each **inclusion class** for *contamination* — whether it counts an identifier. Both tests are mandatory, and a class is not validated until both have been run.

**A regex running without error is not validation.** For every inclusion class the validator must: enumerate its matches repository-wide · inspect enough of them to identify false positives · test adversarial examples · record the result. Phase D2 tested exclusions for suppression but not inclusions for contamination, and a `ratio` class matching `HH:MM` consequently produced **144 false Tier-1 claims (10.7%)** that stood undetected until Phase C3. **Both directions, every class, every time.**

#### 6.3.1 Canonical reference implementation

The specification above is executable. Its canonical implementation is **[`tools/quantitative_census.py`](../../tools/quantitative_census.py)** — Python 3.8+, standard library only, deterministic.

| Property | Value |
| --- | --- |
| **Authority** | The **specification governs the implementation.** Where they disagree, §6.1–§6.2 are correct and the implementation is defective |
| **Inputs** | The 137 chapter files, read from the repository at run time |
| **Outputs** | Governed by the output contract below |
| **Constraints** | **No accepted or expected total is hard-coded.** Every figure is derived from manuscript content |
| **Determinism** | Verified: repeated runs are byte-identical, and row order is fixed |

**Output contract — normative.** F-IR3 found that two of the four candidate populations were reported as bare counts and could not be adjudicated without importing the module. **All four populations are now enumerable.**

| Mode | Contract |
| --- | --- |
| **default** | **Aggregate counts only** — per-Part and per-batch chapters, Tier-1, Tier-2, code-fence, inline-code and words. No candidate rows |
| **`--detail`** | **Complete line-oriented enumeration of all four populations**, six tab-separated fields: `Part · path · Lnnn · population · class · text`. `population` is one of `T1`, `T2`, `code-fence`, `inline-code`. `class` is the §6.2 Tier-1 class for `T1` and `inline-code`, `int` for `T2`, and `num` for a code-fence numeric literal. Rows are emitted per chapter in the fixed order `T1`, `T2`, `code-fence`, `inline-code` |
| **`--json`** | Aggregates under `per_part`, `per_batch` and `chapters`, **plus** a `candidates` array carrying every row of all four populations as `{part, path, line, population, class, text}`. The aggregate keys are unchanged; `candidates` is additive |
| **`--part N`** | Restricts every mode to one Part |

> **The prose tiers are separable.** `awk -F'\t' '$4=="T1" || $4=="T2"'` over `--detail` reproduces the Tier-1/Tier-2 stream exactly, so the prose match population has a stable digest independent of the two observability populations.
>
> **No output file is written.** The tool prints to standard output and caches nothing.

Its existence does not discharge §6.3. **Reflexive validation still applies to every class and every exclusion, in both directions, every time the method changes.**

### 6.4 Active census

Produced by the §6.1 pipeline as stated, and **recomputed at Phase F-IR1 by [`tools/quantitative_census.py`](../../tools/quantitative_census.py)**. **These are the only operational figures.** All are **Tier-1 candidate** counts in the §6.2.4 sense.

| Part | Tier 1 | Tier 2 | Code-fence | Inline-code | Words | **Tier-1 / 1k words** | Density rank |
| --- | --- | --- | --- | --- | --- | --- | --- |
| I | 15 | 13 | 2 | 0 | 64,921 | 0.23 | 9 |
| II | 5 | 16 | 112 | 5 | 60,096 | 0.08 | 10 |
| III | 14 | 20 | 0 | 0 | 52,741 | 0.27 | 8 |
| IV | 2 | 50 | 89 | 0 | 54,811 | 0.04 | 12 |
| V | 3 | 25 | 0 | 1 | 70,196 | 0.04 | 11 |
| VI | 143 | 63 | 20 | 6 | 45,206 | 3.16 | 4 |
| VII | 53 | 46 | 0 | 13 | 40,305 | 1.31 | 7 |
| VIII | 106 | 89 | 80 | 35 | 30,107 | 3.52 | 3 |
| **IX** | 222 | 415 | 0 | 135 | 35,028 | **6.34** | **1** |
| X | 157 | 185 | 7 | 171 | 53,230 | 2.95 | 5 |
| XI | 327 | 329 | 0 | 0 | 77,606 | 4.21 | 2 |
| XII | 122 | 265 | 0 | 0 | 66,914 | 1.82 | 6 |
| **Total** | **1,169** | **1,516** | **310** | **366** | **651,161** | | |

Batch aggregates: **L1** 20 · **L2** 19 · **L3** 302 · **L4** 379 · **L5** 449.

**Batch densities and derived ratios — corrected at F-IR4C.** F-IR3 found that three of the four ratios previously printed here did not follow from this census, and that one of them — `L4/L5 = 1.41×` — was the superseded Phase C4 figure carried forward unchanged. **Rounding convention: densities to three decimal places, ratios to two, each computed from unrounded values and rounded half-up.**

| Batch | Tier-1 | Words | Tier-1 / 1k words |
| --- | --- | --- | --- |
| L1 | 20 | 125,017 | **0.160** |
| L2 | 19 | 177,748 | **0.107** |
| L3 | 302 | 115,618 | **2.612** |
| **L4** | 379 | 88,258 | **4.294** |
| L5 | 449 | 144,520 | **3.107** |

**Derived ratios on the recomputed census: L4/L3 = 1.64× · L4/L5 = 1.38× · L4/L1 = 26.84× · L4/L2 = 40.17×.** These are the **only active ratios**; §6.6 states the same values and the two subsections must not diverge. The C4-era ratios they replace are recorded in §6.5.

**Every Part contains Tier-1 candidates** — the minimum is Part IV at 2, and **no Part has zero**, so the census requirement in §6.7 is enforceable everywhere.

**Superseded by this recomputation.** The Phase C4-era figures — Tier-1 **1,213**, Tier-2 **1,511**, code-fence **186**, and the per-Part values behind them — are recorded in §6.5 and **must not be used operationally**. They were not reproducible from the committed specification; see §6.9.

**Conclusion stability.** Every §6.6 conclusion survives the recomputation unchanged: **Part IX remains the densest Part** (6.34/1k, ahead of Part XI at 4.21); **L4 remains the densest batch**, and **L4/L3 moves 1.60× → 1.64×**, strengthening rather than weakening the "materially denser" reading; **L1 and L2 remain materially sparser**. The density ranks of Parts I–XII are unchanged except that Parts II and V exchange ranks 10 and 11 at the sparse tail — **Part II is the denser of the two at 0.08/1k and takes rank 10; Part V at 0.04/1k takes rank 11** — which carries no allocation consequence.

### 6.5 Superseded evidence

The following are recorded as **superseded** and must **not** be used operationally:

- the **percentage-only** density metric and every figure derived from it, including the claims that L4 was "2.4× the next densest" and ">30× L1–L2", and that Parts II, IV and V had "zero" numerical content;
- the **Phase C composite** metric and its figures (Part VI to rank 2, Part VII to rank 9, L1/L2 at 4.06/3.90 per 1k), which were inflated by uncorrected integer contamination;
- the **Phase D-era census** — Tier-1 total 1,301, Tier-2 total 1,480, Part VIII 198/6.58, and the ratio L4/L5 = 1.54× — produced before the §6.1 precedence rule existed and therefore missing genuine Tier-1 claims. Superseded;
- the **Phase D2-era census** — Tier-1 total 1,322, Tier-2 total 1,600, code-fence 197, Part VIII 203/**6.74**, Part XI 306/3.94, and the ratios **L4/L3 = 1.14×**, L4/L5 = 1.50× — which simultaneously **under-counted** by omitting the short time units `s`, `min` and `h` and **over-counted** by admitting **144 clock times** as ratios. Its claim that *"Part VIII is the densest Part in the edition"* and the density-based justification for L3 resourcing are both **withdrawn**; see §6.4 and §6.6. Superseded.

- the **Phase C4-era census** — Tier-1 total **1,213**, Tier-2 total **1,511**, code-fence **186**, and every per-Part figure behind them, together with the derived ratios **L4/L3 = 1.60×**, L4/L5 = 1.41×, L4/L1 = 24.0× and L4/L2 = 27.1×. **Superseded at Phase F-IR1**: these figures were not reproducible from the committed §6.1/§6.2 specification, which is finding **FE-L1-005**. The recomputed census is §6.4 and the root cause is §6.9.

**One active census only.** Where any figure in this document conflicts with §6.4, §6.4 governs. Superseded figures appear in this subsection and in the §16 review history and nowhere else.

### 6.6 Quantitative resourcing conclusion

Restated on the corrected census. **Density is no longer offered as the justification for L3, because the corrected evidence does not support it.**

| Claim | Status on corrected evidence |
| --- | --- |
| **L4 is the densest batch** | **Supported** — 4.294/1k, ahead of L5 at 3.107 and L3 at 2.612. **L4/L3 = 1.64×**, so L4 is *materially* denser than L3, not comparable to it |
| **Part IX is the densest Part** | **Supported** — 6.34/1k, ahead of Part XI at 4.21 and Part VIII at 3.52 |
| **L1 and L2 are materially sparser** | **Supported** — 0.160 and 0.107 per 1k. **L4/L1 = 26.84× · L4/L2 = 40.17×** |
| **L3 warrants numerical-verification resourcing comparable to L4** | **Supported, but on different grounds.** Density does **not** justify it. The justification is that **L3 is deep tier** — Parts VI–VIII are unbaselined legacy material (§13.3) — and that Part VIII (3.52/1k) and Part VI (3.16/1k) each carry substantial quantitative content in incident-timeline and data-quality chapters where inference validity is the dominant risk |

> **The allocation decision is not attributed to density where density does not support it.** L4 receives the heaviest numerical effort because it is the densest; L3 receives comparable effort because it is the least-verified evidence tier, not because it is equally dense.

### 6.7 Correctness threshold

> **Density controls review effort and sequencing only. It never changes the correctness threshold, which is identical in every Part.**
>
> **Every Part contains Tier-1 quantitative claims** — the minimum is Part IV at 2, and no Part has zero. **Every confirmed quantitative claim in every Part receives census verification.** No Part is exempt on density grounds.

### 6.8 Carried-forward quantitative observations (Phase C4)

Phase C4 accepted the architecture with **zero Architecture Blockers** and recorded six residual observations. **All six are P3, non-blocking, and carried forward.** None reopens the architecture, and **none is repaired here** — repairing them would constitute a further correction event requiring another independent acceptance review.

| ID | Observation | Measured impact |
| --- | --- | --- |
| **C4-1** | The `dec` class admits **15 millisecond-timestamp fragments** (`10:14:02.118` → `02.118`) and **11 version strings** (`v4.0a` → `4.0`) | **26 of 1,213 = 2.1%** contamination. Density ranks 1–6 unchanged; L4/L3 moves 1.60× → 1.68×, *strengthening* the §6.6 conclusion |
| **C4-2** | Spelled-out percentages (`8 percent`, `4 percentage points`) have no Tier-1 class | 18 observed; **15 handled** (4 Tier-1, 11 Tier-2 triage); **3 invisible** = **0.25%**. No rank, batch or allocation effect |
| **C4-3** | E10's time-of-day exclusion is defeated by trailing punctuation (`08:42.`, `10:02,`) | **40 clock forms** survive PASS 0. **Zero contaminate the ratio class** (removed in D3); 15 contribute to C4-1 through `dec` |
| **C4-4** | §6.4's statement *"no false positive was found"* in the sampled classes is no longer literally correct | Documentation accuracy only; C4-1 supplies the corrected figure |
| **C4-5** | §6.1's E12 precision table measures **pre-protection** candidates. C4's **post-protection** measurement is ±25 → **95.8%**, ±50 → 77.1%, ±75 → 70.2%, ±100 → 66.7% | The selected **±25 window remains correct** and is the best-supported choice under either basis |
| **C4-6** | D3 counted **132** colon forms (post-E9); C4 counted **237** (pre-E9) | Different counting bases. **Both independently support zero genuine colon ratios** |

> **These observations are below the threshold for changing the active review-planning census (§6.4).** C4 verified that adjusting for all of them leaves every §6.6 conclusion intact: Part IX remains the densest Part, L4 remains the densest batch, L1/L2 remain materially sparser, and the L3 resourcing justification remains grounded in evidence maturity rather than density.
>
> **Suggested disposition for a future maintenance pass, not now:** extend E10 to tolerate trailing punctuation and millisecond precision; exclude version strings from `dec`; consider a spelled-out-percentage class; correct the two documentation statements in §6.1 and §6.4.

**Disposition update — recorded at F-IR4C.** The six observations above were made at Phase C4 against the C4-era method and census, and **that record is not rewritten**. Two of them were **subsequently affected by the F-IR1 correction**, which was applied for a different reason and whose effect on them went unrecorded until F-IR3 measured it. The current state is:

| ID | Disposition | Measured on the active census |
| --- | --- | --- |
| **C4-1** | **PARTIALLY RESOLVED — remains open, P3, non-blocking** | The **millisecond-fragment half is resolved**: E10's word boundaries (§6.1.2) consume `10:14:02` and leave `.118`, which has no digit before the decimal point and cannot be admitted by `dec`. **0 millisecond fragments remain.** The **version-string half is reduced, not eliminated**: the `dec` word boundary (§6.2.0) removes the letter-adjacent class — `v4.0a` no longer yields `4.0`, which alone accounts for the nine-item Part III movement — but a version number written as a **separate token**, such as `Version 4.0`, `Framework 2.0` or `OAuth 2.0`, still carries no letter adjacency and remains a `dec` candidate. **14 of 147 `dec` candidates = 9.5% of the class, 1.2% of Tier-1.** These are adjudicated at Level 8 as `NOT APPLICABLE` with reason, exactly as NUM-L1-18..23 and NUM-L2-EXC already do |
| **C4-3** | **RESOLVED** | E10's boundary rule is not defeated by trailing punctuation: `08:42.` and `10:02,` are excluded as `08:42` and `10:02`. **0 clock forms survive PASS 0**, against the 40 recorded at C4 |
| C4-2 · C4-4 · C4-5 · C4-6 | **Unchanged — carried forward** | Not affected by the F-IR1 or F-IR4C corrections |

> **Neither disposition was produced by Phase C4.** C4 recorded the observations and explicitly declined to repair them. The change is an **unintended consequence of the F-IR1 quantitative-specification correction**, detected by the F-IR3 independent review and recorded here at F-IR4C so the carried-forward register states what is now true. **C4-1 is not closed** — its remaining half is a live, measured, non-blocking observation.

### 6.9 FE-L1-005 — why the census was not reproducible

Recorded so the correction can be independently checked rather than taken on trust.

**What was ambiguous.** Three things, in order of impact.

1. **E5 precedence.** §6.1's governing precedence rule — *"no exclusion may delete a token already classified as a Tier-1 claim"* — sits immediately above the PASS table and reads as though it governs the whole pipeline. Under that reading E5 must not remove a footnote-definition line containing a Tier-1-shaped span; under the opposite reading it removes the line whole. **The two readings differ by 8 candidates in Part III alone.** §6.1.0 now states that the rule governs PASS 2 only.
2. **Code-fence semantics.** §6.1 set fenced code aside as "a separate population" and §6.4 reported `code-fence = 186`, but **no sentence anywhere defined what was being counted** — tokens, literals, occurrences, blocks, or blocks-containing-numbers. The figure was therefore underivable. §6.2.2 now fixes one definition.
3. **Inline-code suppression.** E2 removed inline code spans silently, so a genuine quantitative claim quoted inside backticks left no trace. §6.2.3 now measures that population instead of discarding it.

**What was reproduction failure rather than architectural ambiguity.** Phase F-IR1's own first implementation carried three defects, all found by the §6.3 reflexive-validation discipline and all corrected before any figure was published: a mask that collapsed newlines; an E4 link-target pattern that spanned newlines and thereby defeated E5; and a `ratio` class that **ignored §6.2's explicit four-digit-year exclusion**, admitting date forms such as `12/2024`. The third was a defect against a rule the specification already stated correctly — the architecture was right and the implementation was wrong.

**The decisive evidence.** Phase F-IR1 re-implemented the pipeline with each PASS-0 exclusion independently switchable and searched the configuration space against the five known Part values (I = 18, II = 5, III = 23, IV = 2, V = 4). **No configuration reproduces them.** Single-toggle results for Part III are 14 with the full pipeline and 22 with E5 disabled; the nearest overall configuration leaves five Part-level discrepancies. **The accepted §6.4 census was therefore not derivable from the accepted §6.1/§6.2 text under any interpretation of the documented exclusions**, which is why F-L1 and F-L2 could not reproduce it and why F-L2 judged the finding to strengthen.

**Structural resolution.** Reproducibility is now guaranteed at the **candidate** level (§6.2.4), where a mechanical definition can be exact, and claimhood is decided by adjudication, where judgement belongs. This removes the requirement — impossible at 300–450 candidates per batch — that a reviewer discover the population by hand.

**What F-IR3 found still missing, and what F-IR4C corrected.** The genuinely independent review confirmed the *substance* of the F-IR1 correction — every Part-level field and all 2,685 Tier-1/Tier-2 match rows reproduce exactly — but found that the **committed text still did not determine that population**. An implementation written from §6.1–§6.2 alone returned Tier-1 **1,179**, Tier-2 **1,801** and inline-code **233**, and the accepted figures were reachable only by searching an interpretation space against the published totals. **That is the same defect class FE-L1-005 names, at reduced magnitude**: previously the census was unreachable under any reading; after F-IR1 it was reachable under exactly one reading among several defensible ones, and the text selected none.

| Semantic that existed only in code | Measured effect if read the other way |
| --- | --- |
| `thou`/`dec` word-boundary guards (§6.2.0) | Tier-1 1,169 → 1,194 |
| Single-whitespace separator, `unit` (§6.2.0) | Tier-1 1,169 → 1,231 |
| `ratio` whitespace around the slash (§6.2.0) | Tier-1 1,169 → 1,154 · inline 366 → 314 |
| Tier-2 boundary rule (§6.2) | Tier-2 1,516 → 1,795 |
| Inline-code PASS-4 dedup (§6.2.3) | inline 366 → 273 |
| E10 boundary semantics (§6.1.2) | Tier-1 1,169 → 1,184 · Tier-2 1,516 → 1,557 |
| E9 word boundary and separator (§6.1.2) | Tier-2 1,516 → 1,504 |
| E12 window measurement basis (§6.1.2) | Tier-2 1,516 → 1,517 |

**F-IR4C made every one of these explicit in the plan and changed no census figure.** It also made the code-fence and inline-code populations enumerable, so §6.2.4's rule that *a reviewer must never be required to discover the candidate population by hand* now holds for all four populations rather than two. **FE-L1-005 still cannot close on this record**: F-IR4C is a correction event, and closure requires a fresh independent re-acceptance that implements §6.1–§6.2 from the committed text alone.

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

**Automated tools and independence.** Independence is **procedural and evidentiary**, not a property of which tool or product performs the work.

- **Reusing the same deterministic structural checker across phases is permitted** for *fact production*. A deterministic check returns the same facts to anyone who runs it, so reuse creates no confirmation risk.
- **Deterministic tools never supply independent verdicts.** They establish facts; a reviewer supplies the judgement (see R-C).
- **Using a different AI or LLM system does not by itself establish independence**, and using the same one does not by itself destroy it. Neither substitutes for the procedural controls in R1–R5.
- **A correction author may not evade R3 or R5 by routing the scoring or gating through an automated tool.** The prohibition attaches to the work, not to the instrument.
- **Where an automated system materially contributes evaluative judgement** — classification, severity assignment, disposition, or scoring — the same human and procedural independence requirements apply as to any reviewer, including the declaration and compensating controls above.
- **R3 and R5 remain exceptionless** under every arrangement.

**General independence discipline.** Prior reports are evidence, not proof. Numerical claims are recomputed, citations re-verified, definitions re-read from the manuscript, governance verified against Git. **Prior Part scores are never inputs to the edition score.** Where evidence is insufficient, the uncertainty is stated.

---

## 12. Governance Remediation Gate (Phase E)

**Scope defined here. Not executed by this plan.**

### 12.1 Scope

| Item | Activity |
| --- | --- |
| **Part I chapter status** | Reconcile against **both** hypotheses stated in **§14, open question 1**. Reconciliation set: Git history · Part I README · `QUALITY_GATES.md` · `CHAPTER_TEMPLATE.md` · later Part conventions |
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
| **D.5** | **Architecture Materialisation** | This document created — resolves ARC-D-1 |
| **C2** | **Focused Independent Architecture Re-Acceptance** | **Score 89.5/100 · Verdict B · two Architecture Blockers.** **ARC-P1-2 CLOSED · ARC-P2-2 CLOSED · ARC-D-1 CLOSED · ARC-P1-1 PARTIALLY CLOSED.** Open: **ARC-C2-1** (Level 16 orphaned from the execution model, P1/class A) and **ARC-C2-2** (E11 suppressing 19–21 genuine Tier-1 claims, P2/class A), plus ARC-C2-6 (P2) and ARC-C2-3, -4, -5, -7, -8 (P3) |
| **D2** | **Targeted Post-Re-Acceptance Corrections** | Corrections applied for ARC-C2-1, -2, -3, -4, -5, -6, -7 and -8: L16 routed through T4 with a transversal-completion rule; §6.1 precedence pipeline added and the census recomputed (Tier-1 1,301 → **1,322**); Level 12 bound to the §12.2 acceptance record; cross-references, level-count terminology, tier ordering, structural-scan evidence and automated-tool independence all specified. **D2 is a correction event and does not close its own findings** |
| **C3** | **Focused Independent Re-Acceptance** | **Score 89.0/100 · Verdict B · three Architecture Blockers, all in the quantitative census.** **CLOSED:** ARC-C2-1, ARC-C2-3, ARC-C2-4, ARC-C2-6, ARC-C2-7, ARC-C2-8. **PARTIALLY CLOSED:** ARC-C2-2. **REOPENED:** ARC-C2-5, ARC-P1-1. New: **ARC-C3-1** (unit set not reproducible; 24 claims uncounted), **ARC-C3-2** (`ratio` class contaminated by 144 clock times, invalidating a stated conclusion), **ARC-C3-3** (code-fence Tier-2 contradiction), ARC-C3-4 (E12 window unspecified), ARC-C3-5 (theoretical bare-year suppression) |
| **D3** | **Targeted Quantitative Architecture Correction** | Closed unit set of 19 evidenced forms; colon-ratio class removed and time-of-day excluded in PASS 0; code-fence contradiction resolved; E12 window fixed at **±25** on measured precision; `mult` class removed for want of evidence; every inclusion class validated for contamination as well as suppression; census recomputed to **Tier-1 1,213 / Tier-2 1,511 / code-fence 186**; the density-based justification for L3 resourcing **withdrawn and restated** on evidence-tier grounds. **D3 is a correction event and does not close its own findings** |
| **C4** | **Final Focused Quantitative Architecture Re-Acceptance** | **Score 95.0/100 · Verdict A — ARCHITECTURE ACCEPTED · Architecture Blockers = 0.** Independent evidence: a classifier implemented **fresh from the committed §6.1/§6.2 text** reproduced **all 36 census figures exactly** — Tier-1 **1,213**, Tier-2 **1,511**, code-fence **186**, words **651,161**, all twelve Part metrics and all seven Tier-1 class totals. Full audits: `ratio` 84/84 genuine, `unit` 335/335 conforming, `perN` 16/16. **CLOSED:** ARC-C3-1, ARC-C3-2, ARC-C3-3, ARC-C3-4, **ARC-P1-1**, **ARC-C2-2**, **ARC-C2-5**. **ACCEPTED-P3:** ARC-C3-5 (zero-instance claim falsification-tested across 30+ quantity nouns). Six non-blocking P3 observations recorded in §6.8 |
| **F-IR1** | **Targeted Quantitative Review-Instrument Remediation** | **Correction event — does not close its own finding.** Triggered by **FE-L1-005**, raised at F-L1 and strengthened at F-L2 when independent enumeration returned 20 genuine claims against an accepted 29 for Parts III–V, matching Parts IV and V exactly while diverging by nine in Part III. A switchable re-implementation established that **no configuration of the ten documented PASS-0 exclusions reproduces the accepted per-Part census**. §6.1.0 fixed E5/E7 precedence and masking discipline; §6.2.1–§6.2.4 fixed occurrence, code-fence, inline-code and candidate-versus-claim semantics; §6.3.1 added the canonical reference implementation `tools/quantitative_census.py`; §6.4 recomputed the census to **Tier-1 1,169 / Tier-2 1,516 / code-fence 310 / inline-code 366**. Every §6.6 conclusion survives. **The amended method is NOT accepted and awaits focused independent re-acceptance** |
| **F-IR1B** | **E11 Quantitative-Specification Clarification** | **Correction event — does not close its own finding.** F-IR2 established that E11's sole specification — *"1900–2099 standing alone"* — was not implementation-complete: a word-boundary reading and a punctuation-aware reading differ by **46 Tier-2 candidates** (1,470 versus 1,516), with **Tier-1 unaffected at 1,169** under both. Independent enumeration showed the 47 distinguishing candidates are **entirely ISO dates and version identifiers** (`2026-08-10`, `2025-01`, `version 2026.10.4`), and that the word-boundary reading **fragments** those tokens — deleting `2026` from `2026.10.4` causes the residue `10.4` to be admitted as a candidate present in no source sentence. §6.1.1 now states E11 as an explicit regex with formal boundary sets, a seventeen-form worked table, interaction rules for E3/E4/E5/E7/E10/E12 and both auxiliary populations, and a measured bounded-consequence note. **No census figure changed and the reference implementation required no modification** — the clarification formalises behaviour it already had. **Still awaiting genuinely independent re-acceptance** |
| **F-IR3** | **Genuinely Independent Quantitative Instrument Closure Review** | **Verdict B — PARTIALLY VERIFIED · FE-L1-005 REMAINS OPEN · F-L3 BLOCKED. This is a review event, not an acceptance event.** Reviewer independence satisfied: the actor authored neither F-IR1 nor F-IR1B, read §6 before the implementation, and froze results before opening it. **Verified:** the canonical implementation is technically sound and deterministic in all three modes; **all 60 Part-level census fields reproduce exactly**; **all 2,685 Tier-1/Tier-2 match rows reproduce with zero differences**; batch aggregates and densities reproduce; E11 is correct on 28/28 boundary tests and its repository-wide property holds; no accepted total is hard-coded; L1 retrospective coverage **20/20** and L2 **19/19**; manuscript baseline unmutated. **Failed:** the committed specification is **not implementation-complete**. An implementation written from §6.1–§6.2 alone returned Tier-1 **1,179** / Tier-2 **1,801** / inline-code **233**; the accepted figures were reachable only by searching an interpretation space against the published totals. **Eight under-specified decision points each move the census**, jointly spanning Tier-1 1,154–1,231 and Tier-2 1,459–1,795. Also found: stale §6.2 class counts, three incorrect §6.4 ratios, an incorrect §6.1.1 consequence mechanism, and two candidate populations reported only as counts. **Closure table: 25 PASS · 2 PARTIAL · 3 FAIL** against the 30 conditions; closure requires 30/0/0 |
| **F-IR4C** | **Quantitative Specification Completeness & Traceability Correction** | **Correction event — does not close its own finding and does not self-accept.** Addresses only the F-IR3 defect set. §6.1.2 added: formal definitions for **E9** (word boundary, single-whitespace separator), **E10** (word boundaries, trailing-punctuation and sub-second behaviour) and **E12** (window measured ±25 from the nearest match edge over the PASS-2 working text). §6.2.0 added: the **`NUM` numeric token**, the **single-whitespace separator rule**, and the **word-boundary asymmetry** under which only `thou` and `dec` are boundary-guarded — the rule that makes Part III 14 rather than 23. §6.2 gained a **normative pattern column** and refreshed Evidenced counts (`thou` 126→**116**, `dec` 181→**147**); the **Tier-2 rule** is now the explicit regex `(?<![\d.,])\d{2,}(?![\d.,])` with its relationship to E11 stated. §6.2.3 states that **PASS-4 deduplication does not apply** to the inline-code population. §6.1.1's bounded-consequence **mechanism corrected**: retention by E11 does not imply Tier-2 admission. §6.4 ratios recomputed to **L4/L3 1.64× · L4/L5 1.38× · L4/L1 26.84× · L4/L2 40.17×** and reconciled with §6.6. §6.8 records the **C4-1 partial resolution and C4-3 resolution** as consequences of F-IR1, not of C4. `tools/quantitative_census.py` extended so **all four candidate populations are enumerable** in `--detail` and `--json`. **No census figure changed: 1,169 / 1,516 / 310 / 366 / 651,161, and the Tier-1/Tier-2 match population is byte-identical.** **Awaiting fresh independent re-acceptance (F-IR4)** |
| **F-IR4** | **Fresh Independent Quantitative Instrument Re-Acceptance** | **39 PASS · 0 PARTIAL · 1 FAIL against 40 conditions.** Performed by an actor who authored none of F-IR1, F-IR1B or F-IR4C. The substantive instrument verified; the single failure was **Condition 35 — active quantitative documentation consistency**, the E11 occurrence decomposition. **Not a closure event** while Condition 35 stood |
| **F-IR4V2** | **Independent Quantitative Instrument Verification** | **Established independently** that the quantitative instrument is intact, that **E9 is correct** — removing `\b` alone produces **0 Tier-2 movement** — that the **E11 total is 51**, and that the sole remaining defect was the **active E11 decomposition**. Evidence event, not an acceptance event |
| **F-IR4F** | **Final E11 Occurrence-Decomposition Correction** | **Correction event — does not verify itself.** Commit `250cfe7`. Corrected the active E11 decomposition to **43 numeric-construct + 8 alphanumeric-identifier = 51 Tier-2 candidate occurrences**, recorded the per-form multiplicities, the eight-form alphanumeric list and the CMU/SEI counting diagnostic, and marked `49 + 2`, `48 + 3` and `40 + 11` **superseded and non-operational**. Scope limited to §6.1.1, §6.2 and ledger `NUM-IR3-02`. **No normative rule, no classifier and no census figure changed** |
| **F-IR4V3** | **Independent Condition-35 Final Closure Verification** | **A — CONDITION 35 INDEPENDENTLY VERIFIED · 25 PASS · 0 FAIL.** Read-only, at HEAD `250cfe7`. The reviewer authored no part of F-IR4F and re-derived the E11 population from the manuscript **before** reading the active documentation, reproducing **51** retained four-digit-year Tier-2 occurrences as **43 numeric + 8 alphanumeric**, with all **10** numeric multiplicities and all **8** alphanumeric forms and loci matching exactly; the split is **invariant** under three construct-boundary definitions. The **CMU/SEI diagnostic** reproduced (6 textual · 5 E5-removed · 1 Tier-2), the **governing property** holds (no standalone prose year in either tier), `43 + 8` is the **only operational split**, and the **E11, Tier-2 and E9 normative rules are unchanged**. **Therefore: Phase F-IR4 FINAL 40 PASS · 0 PARTIAL · 0 FAIL · FE-L1-005 CLOSED · targeted quantitative architecture RE-ACCEPTED · open Class-B blockers 0 · F-L3 technically ready for separate authorisation, NOT STARTED and NOT AUTHORISED** |

> **The non-quantitative architecture remains ACCEPTED at C4.** Architecture design and independent re-acceptance were completed for it.
>
> **The quantitative method (§6.1–§6.4) is CORRECTED AND RE-ACCEPTED.** Phase F-IR1 amended it, F-IR1B made E11 explicit, **F-IR3 independently reviewed it and returned verdict B**, **F-IR4C completed the specification and made all four candidate populations enumerable**, **F-IR4 re-accepted it at 39 PASS · 1 FAIL**, **F-IR4F corrected the single remaining defect**, and **F-IR4V3 independently verified that correction — Condition 35 PASS**. **Phase F-IR4 is FINAL at 40 PASS · 0 PARTIAL · 0 FAIL**, **FE-L1-005 is CLOSED**, and the **targeted quantitative architecture is RE-ACCEPTED (verdict A)**. **Open Class-B Review-Execution Blockers = 0.** **F-L3 — Longitudinal First Edition Review, Parts VI–VIII — is TECHNICALLY READY FOR SEPARATE AUTHORISATION; it is NOT STARTED and NOT AUTHORISED.** Acceptance of the architecture does not authorise manuscript-review execution and does not imply release readiness.

Where a later phase changed an earlier rule, the later phase governs and only the corrected rule appears as active guidance. Superseded metrics — including the Phase D-era census — are recorded in §6.5 and must not be used operationally.

---

## 17. Scope Boundaries of This Plan

This document is method only. As of Phase C4 acceptance:

- **No First Edition Review execution has begun.**
- **Phase E Governance Remediation has not run.** No governance item has been remediated, dispositioned or closed.
- **No manuscript finding exists.** No chapter has been reviewed for First Edition quality.
- **No verification data exists.** No ledger, matrix or register is populated.
- **No whole-edition baseline exists.**
- **No v0.16.0 release metadata, branch or tag exists.**
- **All 137 chapters are unmodified**, and their statuses are unchanged.

**As of Phase F-IR4V3** the position has advanced: **Phase E is COMPLETE**; **Phase F is IN EXECUTION** with batches **L1 and L2 complete — 56/137 chapters inspected, 0 transversals**, and L3–L5 not started; and **§6.1–§6.4 have been corrected and independently RE-ACCEPTED** — FE-L1-005 **CLOSED**, F-IR4 final **40 PASS · 0 PARTIAL · 0 FAIL**, open Class-B Review-Execution Blockers **0**. **F-L3 is TECHNICALLY READY FOR SEPARATE AUTHORISATION — NOT STARTED and NOT AUTHORISED.** **No chapter has been modified at any point.**

Activities described here for phases and batches **not yet executed** — L3–L5, all transversals, and Phases G through L — are **descriptions of future authorised work**, not records of completed work.
