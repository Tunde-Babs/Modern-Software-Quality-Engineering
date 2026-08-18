# First Edition Findings

| Field | Value |
| --- | --- |
| **Project** | Modern Software Quality Engineering (MSQE) |
| **Milestone** | v0.16.0 — First Edition Review |
| **Document type** | Review artefact 2 of 4 — **Defects** |
| **Authority** | [`FIRST_EDITION_REVIEW_PLAN.md`](FIRST_EDITION_REVIEW_PLAN.md) §13.1 |
| **Lifecycle** | Mutable, Phases F→J |
| **State** | **F-L1, F-L2 and F-L3 complete — 17 findings recorded (Parts I–VIII). Batches L4–L5 and transversals T1–T6 not started.** FE-L1-005 independently reviewed at **F-IR3** (verdict B), corrected at **F-IR4C** and **F-IR4F**, and **CLOSED at F-IR4V3** on independent verification of Condition 35; **F-L3 is no longer blocked by it**. No new finding ID was raised by any of those events |
| **Owner** | Tunde Ajala |

> This is a **governance artefact**, not a manuscript chapter. It carries no chapter-style status.

> **Findings recorded to date: 17 — 7 from F-L1 (Parts I–II), 5 from F-L2 (Parts III–V) and 5 from F-L3 (Parts VI–VIII).** No transversal has run. Severity distribution: **P0 = 0 · P1 = 3 · P2 = 3 · P3 = 11.** Blocker classes: **A = 0 · B = 0 · C = 17 · D = 0.**
>
> **Three of the five L2 findings are additional instances of existing systemic groups and carry NO separate deduction** (plan §7.3 systemic root-cause rule). **Four of the five L3 findings likewise join existing systemic groups** — `SYS-LIFECYCLE-DRIFT`, `SYS-ORPHAN-FOOTNOTE`, `SYS-TIER1-IDENTIFIER` and `SYS-TEMPLATE-NAMING` — and carry no separate deduction; only **FE-L3-003** is a new root cause. Distinct deducting findings to date: **10**.

---

## 1. Finding-ID convention

The accepted plan does not fix an ID format, so F0 establishes the smallest stable convention that satisfies the plan's requirements.

```text
FE-<CONTEXT>-<NNN>
```

| Element | Values |
| --- | --- |
| `FE` | First Edition review — fixed prefix |
| `<CONTEXT>` | `L1`–`L5` longitudinal batch · `T1`–`T6` transversal · `G` Phase G consolidated review · `J` Phase J Final Gate |
| `<NNN>` | Zero-padded sequence within that context, assigned in ascending order, **never reused** |

Examples: `FE-L1-001` · `FE-T3-014` · `FE-J-002`.

**Binding rules:**

1. **`L1`–`L5` in a finding ID always denote a longitudinal batch, never a review level.** The plan uses `L` for both; the review level is carried in its own field on every finding.
2. **IDs are immutable once assigned.** A withdrawn or merged finding retains its ID with its status updated; the ID is never reissued.
3. **IDs encode no mutable attribute.** Severity, blocker class, status and disposition all change over a finding's life and are therefore fields, never part of the ID.
4. **Context is the axis where the finding was *discovered***, which may differ from the level that owns the defect class. Both are recorded.

---

## 2. Findings register — row schema

Every finding records all of the following. A row missing any mandatory field is not a valid finding.

| # | Field | Content |
| --- | --- | --- |
| 1 | **Finding ID** | `FE-<CONTEXT>-<NNN>` |
| 2 | **Phase / batch** | Phase F, G, H, I or J, with the longitudinal batch or transversal |
| 3 | **Part** | I–XII, or `edition` for edition-scope findings |
| 4 | **Chapter / path** | Repository path, or `n/a` for edition-scope |
| 5 | **Review level** | Level 1–13, 15, 16 or 19 (**14, 17 and 18 do not exist**) |
| 6 | **Defect class** | The named defect class from that level's plan definition |
| 7 | **PRIMARY score category** | Exactly one of the eight §7.3 categories, assigned by **root cause**, not consequence breadth |
| 8 | **Secondary categories** | Recorded for analysis; **never re-deducted** |
| 9 | **Severity** | P0 · P1 · P2 · P3 — by **defect impact**, never by willingness or ability to fix |
| 10 | **Blocker class** | A · B · C · D — orthogonal to severity; every finding carries **both** |
| 11 | **Finding** | What is wrong, stated as a falsifiable claim |
| 12 | **Evidence** | Part, chapter and **quotation**; ledger row ID where one exists |
| 13 | **Consequence** | What breaks for the reader or the edition |
| 14 | **Recommended action** | Proposed remedy — **recorded, not executed, during Phase F** |
| 15 | **Status** | `OPEN` · `ACCEPTED` · `DEFERRED` · `CLOSED` · `WITHDRAWN` |
| 16 | **Owner** | Accountable owner |
| 17 | **Revision trigger** | Mandatory for accepted P2; recommended for P3 |
| 18 | **Verification status** | `NOT VERIFIED` · `VERIFIED` · `RE-OPENED` — closure verified independently at Phase I |
| 19 | **Systemic root-cause group** | Group ID where multiple instances share one root cause |

### 2.1 Severity model (plan §7.1)

| Severity | Definition |
| --- | --- |
| **P0** | Materially false, unsafe, corrupt, legally problematic, or structurally invalid |
| **P1** | Must be corrected before the Final Gate |
| **P2** | Must be corrected **or validly accepted** before the Final Gate |
| **P3** | May remain if consciously accepted and documented |

**Severity is determined by defect impact, never by willingness or ability to fix it.**

**The P2 / P3 boundary.** An accepted **P2** requires all four: named accountable owner · written rationale · the consequence or risk accepted, stated explicitly · a **revision trigger**. A **P3** requires documented conscious acceptance only.

> **Operational test:** if a finding needs a named owner and a reopening condition to be tolerable, it is **P2**. If documenting it is sufficient, it is **P3**.

**Systemic escalation.** A P3 in one Part becomes P2 or P1 when systemic **across Parts**, not merely frequent within one Part. Every escalation records its Part-level origin and the evidence that made it systemic. **De-escalation on grounds of correction cost is prohibited.**

### 2.2 Blocker taxonomy (plan §7.2)

| Class | Definition | Stops |
| --- | --- | --- |
| **A — Architecture Blocker** | Prevents approval of the review architecture | Phase C2 |
| **B — Review-Execution Blocker** | Prevents reliable review of the edition | Phase F |
| **C — Final-Gate Blocker** | Prevents passing the Final First Edition Quality Gate | Phase J |
| **D — Publication Blocker** | Prevents v1.0.0 publication; does **not** prevent v0.16.0 review or gate passage | v1.0.0 |

**Severity and blocker class are orthogonal. Every finding carries both.**

**Class-D handling.** A class-D finding is recorded, carried forward, and reported at every gate, but **does not deduct from the v0.16.0 score and does not fail Phase J.**

**Tie-break.** Where a finding plausibly belongs to two classes, classify by the **earliest lifecycle point at which it must block**, recording later consequences as carried-forward consequences of the same finding. **Escalation is permitted with evidence; downgrade is prohibited.**

### 2.3 Severity, blocker class, status and disposition are four different things

| Concept | Answers | Changes when |
| --- | --- | --- |
| **Severity** | How bad is the defect? | Only on systemic escalation with evidence |
| **Blocker class** | What lifecycle point does it stop? | Only on escalation with evidence |
| **Status** | Where is it in its life? | As work proceeds |
| **Disposition** | Corrected, accepted, or deferred — and on what record? | On an owner decision meeting §12.2 |

> **Acceptance is never closure.** An accepted finding remains open against its blocker class. A class-D acceptance permits **continuation of the v0.16.0 review only** and **does not remove publication blocking**.

### 2.4 Scoring rules that bind this register (plan §7.3)

- **Primary-category rule.** Each finding receives **exactly one** PRIMARY category and **deducts exactly once**. Secondary categories are analysis only.
- **Systemic root-cause rule.** Multiple findings sharing one root cause score as **one systemic finding at the severity of the highest instance**, with all instances enumerated as evidence.
- **Deduction bands.** P1 = 25–40% of category weight · P2 = 10–20% · P3 = 0–5%. **P0 does not deduct — it triggers an override.** The value chosen within a range is stated with rationale.
- **Evidence expectation.** Every deduction cites Part, chapter and quotation.

---

## 3. Manuscript findings register

**7 findings, all from F-L1 (Parts I–II).** Recorded, classified and evidenced only — **no manuscript content was corrected.** Corrections are Phase H.

### FE-L1-001 — Part II README states the v0.5.0 tag and GitHub Release are still pending

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L1** |
| **Part / path** | II · `book/part-02-programming/README.md` line 123 (also line 115) |
| **Review level** | Level 1 — Repository and governance integrity |
| **Defect class** | False current-state claim; stale lifecycle sweep |
| **PRIMARY category** | **8 — Governance integrity** |
| **Secondary** | none |
| **Severity** | **P1** |
| **Blocker class** | **C — Final-Gate Blocker** |
| **Finding** | The Part II README asserts that v0.5.0 has not been released. Line 123: *"The v0.5.0 release candidate is prepared; final approval, the Git tag, and the GitHub Release remain pending."* Line 115: *"Part II is completed for the v0.5.0 — Programming Complete release candidate."* Both statements are false. |
| **Evidence** | Annotated tag `v0.5.0` exists at commit `f71d28458211488f5c876c492a574287d8002be7`, dated **2026-08-09**, created by merging PR #18 from `release/v0.5.0`. `CHANGELOG.md` line 236 carries a released entry `## [0.5.0] — Programming Complete — 2026-08-09`. `CURRENT_SPRINT.md` line 20 records Part II as released. The claim has been stale for one week at the F-L1 baseline date. |
| **Consequence** | A reader or reviewer consulting the Part II README is told the Part is unreleased. Plan §7.4 makes *"Governance-integrity failure (materially false current-state claim)"* a **BLOCK** override at gate evaluation, so this cannot be carried into Phase J unresolved. |
| **Recommended action** | Correct the two statements to the released state at Phase H. Not corrected here. |
| **Status** | `OPEN` |
| **Owner** | Project Founder |
| **Revision trigger** | n/a — P1 requires correction, not acceptance |
| **Verification** | `NOT VERIFIED` — closure verified independently at Phase I |
| **Note** | **This confirms the gov-P3-5 lifecycle-drift pattern in Part II.** Before F-L1 the pattern was confirmed only in Parts X, XI and XII (plan §14 open question 7). Parts III–IX remain unassessed and belong to their own batches. |

### FE-L1-002 — Ten Part I chapters carry a status value outside the authoritative status model

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L1** |
| **Part / path** | I · all ten chapters in `book/part-01-foundations/chapters/` |
| **Review level** | Level 1 and Level 4 |
| **Defect class** | Chapter status outside the authoritative model (L1); status nonconformance (L4) |
| **PRIMARY category** | **8 — Governance integrity** |
| **Secondary** | 7 — Editorial consistency (recorded for analysis; **not re-deducted**) |
| **Severity** | **P2** |
| **Blocker class** | **C — Final-Gate Blocker** |
| **Finding** | All ten Part I chapters carry `\| Status \| Technical Review Ready \|`. **`Technical Review Ready` is not one of the seven stages** in the authoritative model (plan §2.3, `QUALITY_GATES.md`): Draft → Technical Review → Editorial Review → Educational Review → Practical Validation → Publication Review → Approved. Separately, plan §4 Level 4 requires that the stage claimed be *"supported by the review evidence recorded for that Part"*; **the Part I README records no review event, no quality gate and no score.** |
| **Evidence** | `QUALITY_GATES.md` lines 42–62 define the seven stages; `templates/CHAPTER_TEMPLATE.md` line 33 mandates `\| Status \| Draft \|`. A repository-wide search finds `Technical Review Ready` defined in **no** governance document, template, or Part README — it occurs only in narrative records. `book/part-01-foundations/README.md` contains no gate or review record. By contrast `book/part-02-programming/README.md` line 123 records a completed gate at **95/100** while correctly keeping all twelve chapters at `Draft`. |
| **Consequence** | The Part with the **weakest recorded review evidence carries the strongest maturity claim**, inverting the edition's status semantics. Level 12 criterion 10 (manuscript completeness — 137/137 conformant) and Gate 5 (chapter status) cannot be evidenced clean while ten chapters sit outside the model. |
| **Recommended action** | Owner decision at Phase H: normalise to a defined stage, or define `Technical Review Ready` in `QUALITY_GATES.md`. **Not normalised here** — F-L1 records, it does not correct. |
| **Status** | `OPEN` |
| **Owner** | Project Founder |
| **Revision trigger** | n/a while P2 remains open; if accepted rather than corrected, acceptance requires all four §7.1 fields |
| **Verification** | `NOT VERIFIED` |
| **Note** | **This trips the revision trigger recorded for Phase E finding E-12**, which accepted the status on condition that it be reopened if *"Phase F Level 1 evidence shows status semantics materially impair edition-level assessment."* E-12 tested legitimacy of origin and found it genuine; F-L1 applies the plan's **objective conformance test** and it fails. The two results are compatible: the value was authored in good faith **and** is out of model. |

### FE-L1-003 — Six footnote definitions in Part II are never cited in the body

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L1** |
| **Part / path** | II · `chapter-10-git-code-review-and-collaborative-engineering.md` (4), `chapter-11-testing-quality-engineering-utilities.md` (2) |
| **Review level** | Level 4 (structure) with a Level 7 consequence |
| **Defect class** | Undefined or unused footnote |
| **PRIMARY category** | **3 — Evidence / citation integrity** |
| **Secondary** | 7 — Editorial consistency |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Finding** | Chapter 10 defines `[^pro-git]`, `[^git-rebase]`, `[^github-pr]`, `[^google-review]` (lines 367–373) and Chapter 11 defines `[^meszaros]`, `[^feathers]` (lines 424–426), but **none of the six appears as an in-body citation marker.** Chapter 10's entire reference list is unreferenced. |
| **Evidence** | Deterministic reconciliation of `^\[\^key\]:` definitions against `[^key]` occurrences outside definition lines, across all 22 L1 chapters: exactly these two chapters diverge; the other 20 reconcile with zero unused and zero undefined. Contrast `chapter-09-maintainable-code-and-refactoring.md` line 144, which attaches `[^fowler-refactoring]` and `[^google-code-review]` to the sentences they support. |
| **Consequence** | Six of L1's 110 citations support no claim, so **Level 7's primary test — claim–source alignment — cannot be applied to them.** They function as an uncited bibliography while being counted as citations. |
| **Recommended action** | Phase H: either attach each to the claim it supports, or move to *Further Reading*. Not corrected here. |
| **Status** | `OPEN` |
| **Owner** | Project Founder |
| **Revision trigger** | Escalate to P2 if the same pattern proves systemic across three or more Parts in later batches |
| **Verification** | `NOT VERIFIED` |

### FE-L1-004 — Template section naming varies from the required structure (systemic, 5 instances)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L1** |
| **Part / path** | I · `chapter-04-quality-throughout-the-sdlc.md` · II · `chapter-02-essential-typescript-for-quality-engineers.md`, `chapter-12-capstone-quality-engineering-toolkit.md` |
| **Review level** | Level 4 |
| **Defect class** | Missing required section (content present under a non-template heading) |
| **PRIMARY category** | **7 — Editorial consistency** |
| **Secondary** | none |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Systemic group** | `SYS-TEMPLATE-NAMING` — scored once at the highest instance severity, all five instances enumerated |
| **Finding** | `CHAPTER_TEMPLATE.md` requires *Common Misconceptions or Common Pitfalls*, *Opening Story*, *Why This Chapter Matters* and *Practical Exercise*. Five headings deviate: I-04 uses **"Common Anti-Patterns"**; II-02 uses **"Common QA Coding Problems"**; II-12 uses **"Opening Scenario"**, **"Why This Capstone Matters"** and **"Practical Capstone Tasks"**. |
| **Evidence** | Heading census across all 22 L1 chapters against the template's required-section list. **In every case the required content is present** — only the label differs. The other 19 chapters conform exactly. |
| **Consequence** | Navigation coherence is weakened: a reader or tool locating a required section by heading will miss it in these three chapters. No content is absent. |
| **Recommended action** | Phase H: rename to template headings, or record the capstone variant as an approved template exception. Not corrected here. |
| **Status** | `OPEN` |
| **Owner** | Project Founder |
| **Revision trigger** | Escalate to P2 if later batches show the edition has no consistent capstone-heading convention |
| **Verification** | `NOT VERIFIED` |

### FE-L1-005 — The accepted Tier-1 census is not reproducible from the committed classifier text

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L1** |
| **Part / path** | edition · `docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md` §6.1, §6.2, §6.4 |
| **Review level** | Level 1 — governance integrity (review-instrument validity, plan §6.3) |
| **Defect class** | Architecture-internal metric not independently reproducible |
| **PRIMARY category** | **8 — Governance integrity** |
| **Secondary** | 4 — Numerical / analytical integrity |
| **Severity** | **P2** |
| **Blocker class** | **C — Final-Gate Blocker** (see escalation note) |
| **Finding** | A classifier implemented independently from the committed §6.1/§6.2 text reproduces the **word counts exactly for all twelve Parts** (651,161 total) but **does not reproduce the Tier-1, Tier-2 or code-fence counts**. Part I returns **15** against the accepted **18**; the edition returns **1,174** against the accepted **1,213** (96.8%); Tier-2 returns 1,507 against 1,511; code-fence returns 262 against 186. |
| **Evidence** | The Part I difference is **fully explained**: three of the accepted Part I Tier-1 matches are the string `4.0`/`1.1` occurring **inside footnote-definition lines** (`chapter-02` line 363, `chapter-03` line 441, `chapter-10` line 519). **PASS-0 exclusion E5 removes lines beginning `[^key]:` in their entirety**, so these three cannot survive a correct E5. My own implementation reproduced 18 only while carrying two defects — a newline-collapsing mask and an E4 link-target pattern that spanned newlines and thereby defeated E5. **Both defects were found by the reflexive validation plan §6.3 mandates, and correcting them moved Part I from 18 to 15.** Code-fence divergence is a separate matter: §6.1 sets fenced content aside as a population but **never defines how its numerics are counted**, so the figure 186 is not derivable from the committed text. |
| **Consequence** | Level 8's exit criterion — *every confirmed Tier-1 claim recomputed* — cannot be demonstrated complete for any batch whose Tier-1 population cannot be regenerated. **For L1 the impact is nil**: the population is small enough to enumerate exhaustively, and this review verified the **union** of both runs (23 items), a superset of both. Phase C4 recorded that a fresh classifier reproduced *all 36 census figures exactly*; that result did not reproduce here. |
| **Recommended action** | Before **F-L3** — the first high-density batch — either publish the reference classifier implementation or specify E5 precedence and the code-fence counting rule in §6.1. **No architecture change was made by this task.** |
| **Status** | **`CLOSED`** — closed at **Phase F-IR4V3**, 2026-08-18, verification HEAD `250cfe7`. Prior states preserved below: correction applied at **F-IR1** (2026-08-16) · independently reviewed at **F-IR3** (verdict B) · specification completed at **F-IR4C** (2026-08-17) · E11 decomposition corrected at **F-IR4F** · independently verified and closed at **F-IR4V3** |
| **Owner** | Review architecture owner |
| **Revision trigger** | **Escalates to Class B — Review-Execution Blocker for F-L3, F-L4 and F-L5** if unresolved when those batches are authorised. **It is not a Class-B blocker for L1 or L2 and stopped neither batch.** **Spent at F-IR4V3:** the finding is CLOSED, so this escalation can no longer trigger and **open Class-B Review-Execution Blockers remain 0** |
| **Verification** | `VERIFIED` — **Phase F-IR4V3 (independent) returned 25 PASS · 0 FAIL against its Condition-35 closure table, completing Phase F-IR4 at 40 PASS · 0 PARTIAL · 0 FAIL.** Historical: F-IR3 confirmed the substantive population but not specification completeness (**25 PASS · 2 PARTIAL · 3 FAIL** against its 30 conditions); F-IR4C and F-IR4F were correction events and could not close this finding themselves |

#### FE-L1-005 — root cause established at Phase F-IR1

**Decisive evidence.** A re-implementation with each PASS-0 exclusion independently switchable was searched against the five known Part values (I = 18, II = 5, III = 23, IV = 2, V = 4). **No configuration reproduces them.** Part III returns 14 under the full pipeline and 22 with E5 disabled; 23 is not reachable. **The accepted §6.4 census was not derivable from the accepted §6.1/§6.2 text under any interpretation of the ten documented exclusions.**

**Three architectural ambiguities**, now closed: **E5 precedence** — the governing precedence rule read as though it constrained PASS 0, when it governs PASS 2 only (8 candidates in Part III alone); **code-fence semantics** — `code-fence = 186` was published with no definition of what was counted; **inline-code suppression** — E2 discarded a genuine claim in Part V Chapter 8 with no trace.

**Three implementation defects in F-IR1's own first attempt**, all caught by the §6.3 reflexive-validation discipline and corrected before any figure was published: a newline-collapsing mask; an E4 pattern spanning newlines and thereby defeating E5; and a `ratio` class ignoring §6.2's explicit four-digit-year exclusion. **The third was a defect against a rule the specification already stated correctly** — architecture right, implementation wrong.

**Correction applied.** `FIRST_EDITION_REVIEW_PLAN.md` §6.1.0 (input population, masking discipline, E4/E5/E7 precision, precedence scope), §6.2.1–§6.2.4 (occurrence, code-fence, inline-code, candidate-versus-claim), §6.3.1 (reference implementation), §6.4 (recomputed census), §6.5 (C4-era census superseded), §6.6 (conclusions restated), §6.9 (root-cause record), §5.2 (batch table), §16 (F-IR1 event).

**Implementation path.** [`tools/quantitative_census.py`](../../tools/quantitative_census.py) — deterministic, no hard-coded totals, `--detail` and `--json` audit output.

**Recomputed census.** Tier-1 **1,169** · Tier-2 **1,516** · code-fence **310** · inline-code **366** · words **651,161** unchanged. **Every §6.6 conclusion survives.**

**Independent verification required** *(requirement as recorded at F-IR1 — since satisfied; see the F-IR4V3 closure subsection below)*. The amended method is **not accepted**. **F-L3 must not be authorised** until a focused independent re-acceptance implements the corrected specification from its committed text, reproduces the recomputed census, re-tests the Part III discrepancy, and decides whether FE-L1-005 is CLOSED.

#### FE-L1-005 — independent review at Phase F-IR3

**Reviewer independence satisfied.** The actor authored neither F-IR1 nor F-IR1B, read §6 of the plan before the implementation, and froze its results before opening `tools/quantitative_census.py`.

**Verdict: B — PARTIALLY VERIFIED · FE-L1-005 REMAINS OPEN · F-L3 BLOCKED.** Closure table **25 PASS · 2 PARTIAL · 3 FAIL**; closure requires 30/0/0.

| Verified | Evidence |
| --- | --- |
| Canonical implementation sound and deterministic | Three runs per mode byte-identical; `--detail` digest independently recomputed to `c84fe3df…66e5` |
| **All 60 Part-level census fields reproduce exactly** | Tier-1, Tier-2, code-fence, inline-code and words, Parts I–XII |
| **All 2,685 Tier-1/Tier-2 match rows reproduce with zero differences** | Full tuple comparison on Part, path, line, tier, class and text, with occurrence multiplicity preserved |
| Batch aggregates and densities reproduce | L1 20 · L2 19 · L3 302 · L4 379 · L5 449 |
| E11 correct | 28/28 boundary tests; worked table reproduced; fragmentation property holds; 51 surviving years classified exactly as §6.1.1 states |
| No accepted total hard-coded | Every numeric literal in the tool is a specification constant |
| Part III resolved · Part IV stable · Part V handled | 14 · 2 · 3, with the inline `47 seconds` surfaced rather than lost |
| Retrospective coverage | **L1 20/20 · L2 19/19** — every current candidate maps to an existing ledger row |
| Manuscript baseline unmutated | `ec588eaa…a411` at start and end |

| Failed | Evidence |
| --- | --- |
| **Specification not implementation-complete** | An implementation written from §6.1–§6.2 alone returned Tier-1 **1,179** · Tier-2 **1,801** · inline-code **233**. The accepted figures were reachable only by searching an interpretation space against the published totals |
| **Material semantics existed only in code** | **Eight** under-specified decision points, each moving the census; jointly Tier-1 spans 1,154–1,231 and Tier-2 spans 1,459–1,795. Enumerated with measured effects in plan §6.9 |
| **Residual documentation defects** | Stale §6.2 class counts summing to the superseded 1,213; three incorrect §6.4 derived ratios, one of them a superseded C4 figure; an incorrect §6.1.1 consequence mechanism; §6.8 C4-1 silently affected by F-IR1 |
| **Two populations not auditable** | Code-fence (310) and inline-code (366) were reported as bare counts in every output mode, so §6.2.4's *never by hand* rule held for only two of four populations |

#### FE-L1-005 — correction at Phase F-IR4C

**Correction event — does not close this finding and does not self-accept.** Scope limited to the F-IR3 defect set.

**Specification completed.** Plan **§6.1.2** now formalises E9, E10 and E12; **§6.2.0** defines the `NUM` numeric token, the single-whitespace separator rule and the word-boundary asymmetry under which only `thou` and `dec` are boundary-guarded — the rule that makes Part III 14 rather than 23; **§6.2** gained a normative pattern column and the explicit Tier-2 rule `(?<![\d.,])\d{2,}(?![\d.,])`; **§6.2.3** states that PASS-4 deduplication does not apply to the inline-code population; **§6.1.1**'s bounded-consequence mechanism is corrected.

**Documentation corrected.** §6.2 Evidenced counts refreshed to the active census (`thou` 116, `dec` 147, sum 1,169); §6.4 ratios recomputed and reconciled with §6.6; §6.8 records C4-1 as **partially resolved** and C4-3 as **resolved**, both as consequences of F-IR1 rather than of C4.

**Traceability delivered.** `tools/quantitative_census.py` now enumerates **all four candidate populations** in `--detail` and `--json` with Part, path, line, population, class and matched text.

**No census figure changed** — 1,169 / 1,516 / 310 / 366 / 651,161 — and the **Tier-1/Tier-2 match population is byte-identical** (`c84fe3df…66e5`).

**Closure still requires a fresh independent re-acceptance (F-IR4)** by an actor who authored none of F-IR1, F-IR1B or F-IR4C, implementing §6.1–§6.2 from the committed text alone, freezing results before opening the implementation, reproducing all four populations, and comparing match-level populations. **F-L3 remains blocked.** *(Requirement as recorded at F-IR4C — since satisfied: F-IR4 returned 39 PASS · 1 FAIL, F-IR4F corrected the single remaining defect, and F-IR4V3 independently verified it. See the closure subsection below.)*

#### FE-L1-005 — CLOSED at Phase F-IR4V3

**Closure event.** **Phase F-IR4V3 — Independent Condition-35 Final Closure Verification.** **Verification HEAD `250cfe7`** (*fix(first-edition-review): correct final E11 occurrence decomposition*). **Read-only:** the verification made no repository change.

| Closure field | Value |
| --- | --- |
| **Active disposition** | **`CLOSED`** |
| **Closure event** | **F-IR4V3** |
| **Verification HEAD** | `250cfe7` |
| **Closure date** | 2026-08-18 |
| **Closure consequence** | **F-L3 is no longer blocked by FE-L1-005**; the Class-B escalation on this row can no longer trigger |

**Closure basis.** F-IR4V3 independently verified **Condition 35** — the last unresolved condition of Phase F-IR4 — returning **25 PASS · 0 FAIL**. Combined with the standing F-IR4 result on conditions 1–34 and 36–40, **Phase F-IR4 closes at 40 PASS · 0 PARTIAL · 0 FAIL**, and the **targeted quantitative architecture is RE-ACCEPTED**.

**What was independently re-derived.** The reviewer authored no part of F-IR4F and did not rely on its arithmetic. The E11 population was re-derived from the committed manuscript through the committed pipeline and frozen before the active documentation was opened: **51** retained four-digit-year Tier-2 occurrences, decomposing as **43 numeric-construct occurrences across 10 distinct forms** and **8 alphanumeric-identifier occurrences across 8 distinct forms, each occurring exactly once** — `43 + 8 = 51`. All ten numeric multiplicities and all eight alphanumeric forms and loci reproduced exactly. The decomposition was confirmed **invariant** under three independent construct-boundary definitions, so it is not an artifact of the reviewer's classification choice.

**CMU/SEI diagnostic reproduced.** `CMU/SEI-2000-TR-004` appears **6 times** textually; **5** sit on E5 footnote-definition lines that PASS 0 removes in full; **exactly 1** reaches Tier-2. This confirms the diagnosed cause of the superseded `40 + 11` split.

**Governing property confirmed.** Across all 137 chapters, **no standalone prose year appears in Tier 1 or Tier 2** — 0 standalone occurrences of 51.

**Immutability confirmed.** Manuscript digest `ec588eaa…f150a411` unchanged; **137 chapters — 127 `Draft`, 10 `Technical Review Ready`**; `tools/quantitative_census.py`, `QUALITY_GATES.md`, `RELEASE_POLICY.md` and `CHANGELOG.md` byte-identical; the active census remains **1,169 / 1,516 / 310 / 366 / 651,161**; the E11, Tier-2 and E9 normative rules are unchanged.

**Boundary.** Closure of this finding makes **F-L3 technically ready for separate authorisation**. It does **not** authorise F-L3, and **F-L3 has not started**.

### FE-L1-006 — Tier-1 contamination in L1 is an order of magnitude above the accepted edition-wide rate

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L1** |
| **Part / path** | I · chapters 1, 2, 3, 10 |
| **Review level** | Level 8 |
| **Defect class** | Identifier counted as a quantitative claim |
| **PRIMARY category** | **4 — Numerical / analytical integrity** |
| **Secondary** | 8 — Governance integrity |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Finding** | **Six of the 23 accepted L1 Tier-1 claims (26%) are software version strings, not quantitative claims** — five instances of `4.0` from *"SWEBOK Guide, Version 4.0"* and one of `1.1` from *"SSDF Version 1.1"*. **L1's genuine Tier-1 population is 17, not 23.** |
| **Evidence** | Enumerated with byte offsets: ch01 L435, ch02 L347, ch02 L363, ch03 L423, ch03 L441, ch10 L519. All are captured by the `dec` class from retained Markdown **link text** (E4 retains link text by design) or from footnote-definition lines. |
| **Consequence** | The plan's accepted observation **C4-1** measured this contamination at **26 of 1,213 = 2.1% edition-wide** and accepted it as P3 non-blocking on that basis. **The local rate in L1 is 26% — roughly twelve times the accepted figure** — because L1 is the sparsest batch (0.184 and 0.163 Tier-1 per 1k words). A rate accepted as immaterial edition-wide is not immaterial here. |
| **Recommended action** | Record only. C4-1 remains an accepted architecture observation with its own revision trigger; this finding supplies new evidence about its **local** distribution for the owner's consideration at Phase G. |
| **F-IR1 note** | The recomputed census (§6.4) changes L1's Tier-1 candidate count from 23 to 20, so the **local contamination ratio changes basis**. The three footnote-line version strings are now correctly excluded by E5; the three remaining version strings sit in retained Markdown **link text**, which E4 preserves by design. **The finding stands and is not closed** — the observation and its revision trigger are unaffected in substance. |
| **Status** | `OPEN` |
| **Owner** | Review architecture owner |
| **Revision trigger** | Reconsider C4-1's acceptance if a later sparse batch shows a comparable local contamination rate |
| **Verification** | `NOT VERIFIED` |

### FE-L1-007 — Part I README labels delivered chapters as "Planned" and records no review evidence

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L1** |
| **Part / path** | I · `book/part-01-foundations/README.md` |
| **Review level** | Level 3 — Part architecture |
| **Defect class** | README/manuscript divergence |
| **PRIMARY category** | **8 — Governance integrity** |
| **Secondary** | 7 — Editorial consistency |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Finding** | The Part I README heads its chapter list **"## Planned Chapters"** although all ten chapters are delivered, and the README records no review event, gate, score or release state anywhere. |
| **Evidence** | All ten chapter files exist and all ten README chapter links resolve (27/27 local links resolve overall). No gate or score string appears in the file. Part II's README, by contrast, carries a *Current Manuscript and Companion State* section with a recorded gate result. |
| **Consequence** | The two Parts in this batch use **incompatible Part-README conventions**, and Part I's provides no evidence base against which its chapters' status claims can be assessed — the condition that makes FE-L1-002 assessable only from outside the Part. |
| **Recommended action** | Phase H: retitle to *Chapters* and record Part I's review history, or state explicitly that none exists. Not corrected here. |
| **Status** | `OPEN` |
| **Owner** | Project Founder |
| **Revision trigger** | Escalate to P2 if Level 2/Level 3 in later batches find no consistent Part-README convention across the edition |
| **Verification** | `NOT VERIFIED` |

---

## 4. Carried-forward Phase E inputs

These are **not** manuscript findings and **do not** appear in the register above. They are Phase E dispositions whose declared destination is a Phase F review level, recorded here so the owning level receives them as explicit inputs. Their authoritative record is the Phase E closure entry in `docs/00-project/DEVELOPMENT_LOG.md`.

| Phase E item | Phase E disposition | Destination | Input to the owning level |
| --- | --- | --- | --- |
| **E-11** — `MQE-BOK.md` Domain 12 (eight topics) versus `BOOK_BLUEPRINT.md` Part XII (six topics) | DEFERRED — **not** Class B | **Level 2**, executed on the longitudinal axis | Plan §4 Level 2 requires coverage to be assessed against **both** documents, with the divergence recorded as a Level 2 finding. Plan §14 open question 4 additionally routes the authority question to Level 2 / owner. `book/part-12-engineering-leadership/README.md` already maps all eight Domain 12 topics to chapter homes and designates `MQE-BOK.md` authoritative for domain coverage |
| **gov-P3-5 (Parts I–IX)** — Part README lifecycle-state drift | DEFERRED | **Level 1**, executed on the longitudinal axis | Plan §14 open question 7: the drift pattern is confirmed in Parts X–XII only; **Parts I–IX are unassessed**. Level 1's defect classes include *false current-state claim* and *stale lifecycle sweep*. Parts X–XII were normalised at `6385c29` and `0349176`; the `RELEASE_POLICY.md` Lifecycle State Consistency Sweep governs these surfaces prospectively |
| **E-13** — no authoritative accessibility policy | DEFERRED to v1.0.0 publication preparation; **standard-gap disposition recorded at Phase E** | **Level 11** (via **T6**) and **Level 12 criterion 8** | Plan §10 governs: L11 runs the four objective checks as a census across all 137 chapters — heading-order integrity, table-header presence, descriptive link text, image alt-text presence — reported as a distinct subsection. **Judgement-dependent accessibility remains out of scope while no standard exists.** Plan §9: **Level 11 does not score against absent standards**; the standard's absence is Governance Integrity (category 8), not an editorial deduction |

### 4.1 Items that must NOT enter manuscript scoring

| Item | Reason |
| --- | --- |
| **E-01 — empty `LICENSE`** | **Class D, P0.** Plan §7.2: a class-D finding **does not deduct from the v0.16.0 score and does not fail Phase J**. It is reported at every gate and blocks **v1.0.0 publication only**. Plan §7.4 override *"Empty or absent `LICENSE` at v1.0.0 → BLOCK publication"* applies at v1.0.0, not at Phase F or Phase J. **It must not distort the Phase F manuscript score.** |
| **E-05, E-06, E-07, E-08, E-09, E-12, E-14, N-01/N-02/N-03** | Accepted or owner-decision governance items with no Phase F destination. Any Level 1 observation about them is scored under **category 8 — Governance integrity**, never as a manuscript defect. Plan §9: **GOVERNANCE STANDARD ABSENT → Governance Integrity; MANUSCRIPT VIOLATES AN EXISTING STANDARD → Editorial Consistency** |

> **Prior architecture findings are not manuscript findings.** The `ARC-*` architecture findings and the six carried-forward Phase C4 quantitative observations (plan §6.8) belong to the architecture review history and are **not** copied into this register.

---

## 4a. F-L2 findings — Parts III–V

### FE-L2-001 — Lifecycle drift in all three Part III–V READMEs (systemic with FE-L1-001)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L2** |
| **Part / path** | III, IV, V · `book/part-03-software-testing/README.md` L7 · `book/part-04-api-engineering/README.md` L7, L370 · `book/part-05-automation-engineering/README.md` L7, L463 |
| **Review level** | Level 1 |
| **Defect class** | False current-state claim; stale lifecycle sweep |
| **PRIMARY category** | **8 — Governance integrity** |
| **Severity** | **P1** — the systemic group's severity, set by its highest instance |
| **Blocker class** | **C** |
| **Systemic group** | **`SYS-LIFECYCLE-DRIFT`** — joins **FE-L1-001**. **Scored ONCE at the group level; FE-L2-001 adds instances as evidence and carries NO separate deduction.** |
| **Finding** | Every one of the three L2 Part READMEs asserts an unreleased state for a Part that is released, and two of them additionally assert that the following Part has not started. **Eight false statements**: <br>**Part III L7** — *"The release candidate is prepared as **v0.6.0**…; Part III **will be released** after promotion to `main` and creation of the annotated tag"* and *"**Part IV has not started**"*. <br>**Part IV L7 / L370** — *"`release/v0.7.0` is prepared for the **planned** stable release…; main promotion, annotated tag, and GitHub Release publication **remain pending**"* and *"**Part V — Automation Engineering has not started**"*. <br>**Part V L7 / L463** — *"**Release preparation is active** for the planned **v0.8.0**"*, *"**Part VI has not started**"*, and *"**Part V is not approved, published, or released**"*. |
| **Evidence** | Annotated tags `v0.6.0`, `v0.7.0`, `v0.8.0` all exist and are dated **2026-08-10**; `v0.9.0` (Part VI) is dated **2026-08-11**. `CHANGELOG.md` carries released entries at lines 209, 184, 160 and 137 respectively. Every one of the eight statements is falsified by repository state. |
| **Consequence** | The drift pattern is now confirmed in **four consecutive Parts (II, III, IV, V)** rather than the three (X, XI, XII) recorded when plan §14 open question 7 was written. Plan §7.4 makes a materially false current-state claim a **BLOCK** override at gate evaluation. |
| **Recommended action** | Phase H: correct all eight statements. **Not corrected here.** The `RELEASE_POLICY.md` Lifecycle State Consistency Sweep now governs these surfaces prospectively. |
| **Status** | `OPEN` |
| **Owner** | Project Founder |
| **Verification** | `NOT VERIFIED` |
| **Note** | **gov-P3-5 is now discharged for Parts I–V.** Confirmed in II, III, IV, V; **not present in Part I**, which makes no lifecycle claim. Parts VI–IX remain unassessed. |

### FE-L2-002 — Malformed table silently fails to render (Part III Chapter 4)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L2** |
| **Part / path** | III · `chapters/chapter-04-test-design-for-efficient-evidence.md` line 190 |
| **Review level** | Level 4 |
| **Defect class** | Malformed table |
| **PRIMARY category** | **7 — Editorial consistency** |
| **Secondary** | 1 — Technical correctness (content becomes unreadable) |
| **Severity** | **P2** |
| **Blocker class** | **C** |
| **Finding** | The table's header row declares **four** columns — *Problem characteristic · Useful reasoning approach · Expected evidence · Important limit* — but its delimiter row is `\|---\|---\|---\|`, only **three**. Under GitHub-Flavored Markdown the delimiter row must match the header row cell count or **the block is not recognised as a table at all**, so the entire block renders as literal text with visible pipe characters. |
| **Evidence** | Deterministic cell-count check across all 34 L2 chapters: this is the **only** table block in L2 whose header and delimiter rows disagree (widths `{4, 5}`). Body rows carry four columns, consistent with the header, confirming the delimiter is the defect. The affected table teaches the core test-design technique mapping, and its fourth column carries the *limitations* of each technique. |
| **Consequence** | A released chapter contains a table that does not render. Gate 2 (*Markdown renders correctly*) and Gate 5 (*Markdown rendering verified*) cannot be evidenced clean for Part III while it stands. |
| **Recommended action** | Phase H: add the fourth delimiter cell. **Not corrected here.** |
| **Status** | `OPEN` |
| **Owner** | Project Founder |
| **Revision trigger** | Phase G may reasonably escalate to P1: this is a visible rendering failure in released material, not a stylistic issue |
| **Verification** | `NOT VERIFIED` |

### FE-L2-003 — The Atlas recurring case changes organisational identity between Parts without signposting

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L2** (batch-local evidence for transversal **T5**) |
| **Part / path** | III, IV, V · across all 34 chapters |
| **Review level** | Level 15 (supporting pass) — evidence collected longitudinally, **T5 not executed** |
| **Defect class** | Recurring-case **AMBIGUITY** (plan L15 classification) |
| **PRIMARY category** | **2 — Cross-Part coherence** |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Finding** | Atlas Commerce is introduced to the edition in this batch and is given **three different organisational descriptors**, one per Part, with no text connecting them: **Part III — "a fictional subscription service"** (8 occurrences); **Part IV — "a fictional retailer"** (10 occurrences); **Part V — "a fictional online retailer"** (8 occurrences). |
| **Evidence** | Each Part is **internally 100% consistent** — no Part mixes descriptors. Part IV refers to *"the fictional retailer introduced in Chapter 1"* and Part III to *"the fictional subscription service from Chapter 1"*, each pointing at its own Chapter 1, so neither acknowledges the other's framing. Part III's scenarios are subscription renewals, grace periods and payment-method updates; Parts IV–V use orders, SKUs, checkout and fulfilment. Persona continuity is partial: Priya and Marcus appear in Part III only; **Dele carries across Parts IV and V**; Ravi appears once in Part V. |
| **Classification rationale** | **Not CONTRADICTION** — a retailer can operate a subscription programme, so the facts can both hold. **Not EVOLUTION** — no transition is signposted. Classified **AMBIGUITY**: the recurring case's basic organisational identity is under-specified at the exact point the case enters the edition. Plan L15 directs that ambiguity be **recorded, not forced**. |
| **Consequence** | A reader following Atlas across Parts III–V receives three different answers to what the company is. The teaching value of a recurring case depends on the reader believing it is one organisation. |
| **Recommended action** | Phase H or the T5 transversal: add one signposting sentence reconciling the descriptors. **Not corrected here.** |
| **Status** | `OPEN` |
| **Owner** | Project Founder |
| **Revision trigger** | **Escalate to P2 if T5 finds the descriptor continues to diverge across Parts VI–XII**, or if any Atlas fact is found that genuinely cannot hold under both framings |
| **Verification** | `NOT VERIFIED` |

### FE-L2-004 — Two unused footnote definitions in Part III Chapter 12 (systemic with FE-L1-003)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L2** |
| **Part / path** | III · `chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md` |
| **Review level** | Level 4, with a Level 7 consequence |
| **Defect class** | Unused footnote |
| **PRIMARY category** | **3 — Evidence / citation integrity** |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Systemic group** | **`SYS-UNUSED-FOOTNOTE`** — joins **FE-L1-003**. **Scored once at group level; no separate deduction.** |
| **Finding** | `[^google-sre]` and `[^istqb]` are defined in the References section but carry no in-body citation marker. |
| **Evidence** | Footnote reconciliation across all 34 L2 chapters: **33 of 34 reconcile exactly** with zero unused and zero undefined; this capstone is the sole exception. |
| **Consequence** | Two of L2's 125 citations support no claim, so Level 7's claim–source alignment test cannot be applied to them. |
| **Status** | `OPEN` · **Owner** Project Founder |
| **Revision trigger assessment** | FE-L1-003's trigger was *"escalate to P2 if the pattern proves systemic across three or more Parts"*. The population is now **two Parts (II and III)**. **The trigger is NOT tripped and severity is NOT escalated.** |
| **Verification** | `NOT VERIFIED` |

### FE-L2-005 — Template section naming deviates in Part III Chapter 12 (systemic with FE-L1-004)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L2** |
| **Part / path** | III · `chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md` |
| **Review level** | Level 4 |
| **Defect class** | Required section present under a non-template heading |
| **PRIMARY category** | **7 — Editorial consistency** |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Systemic group** | **`SYS-TEMPLATE-NAMING`** — joins **FE-L1-004**. **Scored once at group level; no separate deduction.** |
| **Finding** | Two headings deviate: **"Why This Capstone Matters"** for the template's *Why This Chapter Matters*, and **"Common Mistakes"** for *Common Misconceptions or Common Pitfalls*. Content is present in both cases. |
| **Evidence** | Heading census across all 34 L2 chapters: **33 of 34 use "Common Misconceptions"**; this capstone alone uses "Common Mistakes". The **Part IV and Part V capstones both use the conformant "Why This Chapter Matters"**. |
| **Consequence** | Navigation by heading fails for these two sections in one chapter. |
| **Status** | `OPEN` · **Owner** Project Founder |
| **Revision trigger assessment** | FE-L1-004's trigger was *"escalate to P2 if later batches show the edition has no consistent capstone-heading convention"*. **L2 evidence WEAKENS that case**: two of three L2 capstones conform, and 33 of 34 chapters use the template heading. **A consistent convention does exist; the deviations are isolated. Severity is NOT escalated.** |
| **Verification** | `NOT VERIFIED` |

### FE-L3-001 — Lifecycle drift in the Part VI and Part VII READMEs (systemic with FE-L1-001 and FE-L2-001)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L3** |
| **Part / path** | VI · `book/part-06-data-quality-engineering/README.md` L7 · VII · `book/part-07-cloud-devops/README.md` L7 |
| **Review level** | Level 1 |
| **Defect class** | False current-state claim in an active governance-adjacent artefact |
| **PRIMARY category** | **8 — Governance integrity** |
| **Secondary** | 2 — Cross-Part coherence |
| **Severity** | **P1** — the systemic group's severity, set by its highest instance (FE-L1-001) |
| **Blocker class** | **C — Final-Gate Blocker** |
| **Systemic group** | **`SYS-LIFECYCLE-DRIFT`** — joins **FE-L1-001** and **FE-L2-001**. **Scored once at group level; no separate deduction.** |
| **Finding** | Two Part READMEs assert forward-looking states that the repository has already overtaken. Part VI's Curriculum Status ends *"Part VII work has not begun."* Part VII's Curriculum Status ends *"Part VIII planning has not started."* |
| **Evidence** | Part VII's own README states *"Part VII — Cloud & DevOps is released as v0.10.0"* with baseline `2da10fd`; Part VIII's states release as **v0.11.0** on 2026-08-12 with baseline `ee20d306b88b`. Both Parts have 11 delivered chapters each. All three recorded baseline SHAs resolve (`git cat-file -t` → `commit` for `6ca58c6`, `2da10fd`, `ee20d306b88b`). |
| **Consequence** | A reader taking either README as current is told that work already released has not started. Identical mechanism to FE-L1-001 (Part II) and FE-L2-001 (Parts III–V): a status line written at authoring time and never revisited when the next Part shipped. |
| **Recommended action** | Phase H. Replace the trailing forward-looking sentence with the current state, or remove it and let the lifecycle artefacts carry sequencing. **No manuscript correction made by this task.** |
| **Status** | `OPEN` · **Owner** Project Founder |
| **Verification** | `NOT VERIFIED` |

---

### FE-L3-002 — Four unused footnote definitions in Part VII (systemic with FE-L1-003 and FE-L2-004)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L3** |
| **Part / path** | VII · `chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md` L291 · `chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md` L395–L397 |
| **Review level** | Level 4 |
| **Defect class** | Undefined or unused footnote |
| **PRIMARY category** | **3 — Evidence / citation integrity** |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Systemic group** | **`SYS-ORPHAN-FOOTNOTE`** — joins **FE-L1-003** and **FE-L2-004**. **Scored once at group level; no separate deduction.** |
| **Finding** | Four footnote definitions are declared but never referenced from the body: `[^git]` (ch04 L291), and `[^nist-cloud]` (L395), `[^oci]` (L396) and `[^dora]` (L397) in the ch11 capstone. |
| **Evidence** | Reference/definition census across all 33 L3 chapters: definitions **62**, undefined references **0**, unused definitions **4**, all four in Part VII. Each of the four keys occurs exactly once in its chapter, on its definition line, with no `[^key]` reference anywhere in the body. |
| **Consequence** | The four sources are carried as apparent citations but support no statement; a renderer emits an unreferenced footnote. **Ch11 is the capstone**, where the reader is most likely to follow references. |
| **Recommended action** | Phase H. Either cite each source at the claim it supports or move it to Further Reading. **No correction made by this task.** |
| **Status** | `OPEN` · **Owner** Project Founder |
| **Verification** | `NOT VERIFIED` |

---

### FE-L3-003 — Atlas settlement identifiers denote different settlements in Part VI Chapter 6 and the Part VI capstone

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L3** |
| **Part / path** | VI · `chapters/chapter-06-reconciliation-and-cross-system-consistency.md` L118–L123 · `chapters/chapter-11-capstone-data-quality-strategy-and-evidence-portfolio.md` L91–L104 |
| **Review level** | Level 4 (internal contradiction test, technique 3) |
| **Defect class** | Recurring-case identifier reused with different referents and values, without signposting |
| **PRIMARY category** | **2 — Cross-Part coherence** |
| **Secondary** | 5 — Pedagogical progression |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Related finding** | **FE-L2-003** (Atlas recurring case changes organisational identity between Parts). Same recurring-case control, **distinct root cause** — identifier-namespace reuse *within* a Part rather than identity drift *between* Parts — so this deducts in its own right. |
| **Finding** | Chapter 6 and the Chapter 11 capstone both stage an Atlas Commerce **30 June close** and both use the `S-9xx` / `R-9xx` settlement and report namespace, but bind the identifiers to different orders and amounts. |
| **Evidence** | Chapter 6 (L118–L123): `S-901` → order `O-100`, €100.00; `S-902` → `O-101`, €80.00; `S-904` → `O-103`, €50.00 with correction `C-904` −10.00; the €70.00 pending item is **`S-905`** for `O-105`. Capstone (L91–L104): `S-901` → order `O-4101`, €120.00; `S-902` → `O-4102`, €80.00; **`S-904`** → `O-4104`, €70.00 — the pending item, which Chapter 6 calls `S-905`. The capstone's order-level figures are consistent with Chapter 4 (`AC-4101` €120.00, `AC-4102` €80.00, `AC-4103` €49.99); the collision is confined to the settlement namespace. Both chapters are internally arithmetically correct — Chapter 6 recomputes to ledger €305.00 / report €305.00 / matched €280.00, and the capstone to ledger €190.00 / report €200.00 / difference €10.00. |
| **Consequence** | A learner arriving at the capstone directly from Chapter 6 may reasonably read `S-901` and `S-904` as the same settlements they have just reconciled. `S-904` is the sharpest case: a €50.00 corrected settlement in one chapter and the €70.00 pending item in the other. The defect is ambiguity, not arithmetic. |
| **Recommended action** | Phase H. Either use a distinct identifier range for the capstone packet or state explicitly that it is an independent scenario reusing the namespace. **No correction made by this task.** |
| **Status** | `OPEN` · **Owner** Project Founder |
| **Revision trigger** | Escalate to P2 if a later batch shows the same namespace reused a third time, or if T5 finds the reuse spans Parts. |
| **Verification** | `NOT VERIFIED` |

---

### FE-L3-004 — One version-string fragment is admitted as a Tier-1 candidate in Part VII (systemic with FE-L1-006)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L3** |
| **Part / path** | VII · `chapters/chapter-06-deployment-strategies-progressive-delivery-and-release-exposure.md` L176 |
| **Review level** | Level 8 candidate adjudication |
| **Defect class** | Identifier counted as a quantitative claim |
| **PRIMARY category** | **4 — Numerical / analytical integrity** |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Systemic group** | **`SYS-TIER1-IDENTIFIER`** — joins **FE-L1-006**. **Scored once at group level; no separate deduction.** |
| **Finding** | The `dec` class admits `2026.10` from the release identifier *"version `2026.10.4`"*. The fragment is an identifier component, not a quantity, and is adjudicated `NOT APPLICABLE`. |
| **Evidence** | Full adjudication of the bounded 302-candidate L3 Tier-1 population: **299 confirmed quantitative claims · 3 NOT APPLICABLE**. The three are this version fragment and the two authoring-specification figures `6,000` / `8,000` (capstone word budget, VI ch11 L407). L3 identifier contamination is therefore **1 of 302 = 0.33%**, against L1's rate that produced FE-L1-006 (6 of 23). **The instrument is unchanged and behaves exactly as §6.2 specifies**; this is an adjudication outcome, not an instrument defect. |
| **Consequence** | Negligible at L3's rate; recorded for group continuity and to keep the candidate-versus-claim distinction auditable per plan §6.2.4. |
| **Recommended action** | None at manuscript level. Retain as adjudication evidence. |
| **Status** | `OPEN` · **Owner** Review architecture owner |
| **Verification** | `NOT VERIFIED` |

---

### FE-L3-005 — Parts VII and VIII introduce a third variant of the misconceptions heading (systemic with FE-L1-004 and FE-L2-005)

| Field | Value |
| --- | --- |
| **Phase / batch** | Phase F · longitudinal **L3** |
| **Part / path** | VII and VIII · all 22 chapters |
| **Review level** | Level 4 |
| **Defect class** | Required section present under a non-template heading |
| **PRIMARY category** | **7 — Editorial consistency** |
| **Severity** | **P3** |
| **Blocker class** | **C** |
| **Systemic group** | **`SYS-TEMPLATE-NAMING`** — joins **FE-L1-004** and **FE-L2-005**. **Scored once at group level; no separate deduction.** |
| **Finding** | `CHAPTER_TEMPLATE.md` requires **"Common Misconceptions or Common Pitfalls"**. Part VI uses **"Common Misconceptions"** in 11 of 11 chapters — the convention Parts I–V follow. Parts VII and VIII use **"Common Misconceptions and Pitfalls"** in 22 of 22 chapters, a third variant. |
| **Evidence** | Heading census across all 33 L3 chapters: Part VI 11/11 `Common Misconceptions`; Part VII 11/11 and Part VIII 11/11 `Common Misconceptions and Pitfalls`. Each Part is internally consistent; the divergence is between Parts. Structural variation also recorded, non-defect: `Chapter Purpose` and `QA → QE Transition` appear in VII and VIII (22/22) but not VI, and `Navigation` appears only in VII (11/11). |
| **Consequence** | Navigation by exact heading fails across the batch boundary. No content is missing — all 15 required template sections are present in 33 of 33 chapters. |
| **Revision trigger assessment** | **FE-L1-004's trigger — *"escalate to P2 if later batches show the edition has no consistent capstone-heading convention"* — is NOT met by L3.** All three L3 capstones use the template heading `Why This Chapter Matters`, as do all 33 chapters. The trigger remains armed for L4 and L5. |
| **Status** | `OPEN` · **Owner** Project Founder |
| **Verification** | `NOT VERIFIED` |

---

## 5A. Standing-finding evidence recorded by F-L3

**FE-L1-005 (review-instrument reproducibility) — CLOSED at F-IR4V3; L3 is the first batch to consume the closed instrument.** The four L3 candidate populations were surfaced mechanically from `tools/quantitative_census.py` and reconciled **exactly** against plan §5.2 and §6.4 before adjudication began: **Tier-1 302 · Tier-2 198 · code-fence 100 · inline-code 54 · words 115,618 · citations 62**. No population was hand-discovered. **The instrument required no change and none was made.**

**FE-L1-002 (Part I chapter status)** — unchanged. All 33 L3 chapters carry `Status: Draft`, conforming to the plan §2.3 model.

**FE-L2-003 (Atlas recurring-case continuity)** — extended by new evidence at L3; see **FE-L3-003**, recorded as a distinct root cause within the same control.

---

## 5. Standing-finding evidence recorded by F-L2

**FE-L1-005 (review-instrument reproducibility) — new evidence, finding not modified.** L2 enumerated its Tier-1 population **without relying on the instrument**, using an over-inclusive sweep that removes only fenced code and therefore captures every numeric token in non-code prose, followed by manual adjudication of all **130 raw hits** against the PASS-0 exclusions. Result: **Part IV returns 2 and Part V returns 4 — both exactly matching the accepted census — while Part III returns 14 against the accepted 23.** The nine unaccounted Part III items **cannot be genuine quantitative teaching claims**, because the over-inclusive sweep captured every candidate in Part III prose and each was adjudicated; the excluded items are metadata rows (E7), footnote-definition lines (E5) and URL fragments inside link targets (E3/E4) — chiefly the ISTQB syllabus version string `v4.0.1` and the URL date fragment `2024/11`. Level 8's substantive obligation for L2 is therefore discharged, but **the accepted count remains non-reproducible**. See the F-L2 review-log event for the pre-L3 assessment.

**FE-L1-002 (Part I chapter status)** — unchanged. All 34 L2 chapters carry `Status: Draft`, which conforms to the plan §2.3 model. **The nonconformance remains confined to Part I.**

---

**Last Updated:** 2026-08-18 (F-L3)
