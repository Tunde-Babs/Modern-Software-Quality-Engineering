# First Edition Findings

| Field | Value |
| --- | --- |
| **Project** | Modern Software Quality Engineering (MSQE) |
| **Milestone** | v0.16.0 — First Edition Review |
| **Document type** | Review artefact 2 of 4 — **Defects** |
| **Authority** | [`FIRST_EDITION_REVIEW_PLAN.md`](FIRST_EDITION_REVIEW_PLAN.md) §13.1 |
| **Lifecycle** | Mutable, Phases F→J |
| **State** | **Initialised at F0 — no manuscript finding exists** |
| **Owner** | Tunde Ajala |

> This is a **governance artefact**, not a manuscript chapter. It carries no chapter-style status.

> **No manuscript finding has been recorded.** Phase F substantive review has not started. The registers below are structure only.

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

**0 findings. Phase F substantive review has not started.**

| Finding ID | Phase/batch | Part | Chapter/path | Level | Defect class | Primary category | Severity | Blocker | Finding | Evidence | Consequence | Recommended action | Status | Owner | Revision trigger | Verification |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| *(none)* | | | | | | | | | | | | | | | | |

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

**Last Updated:** 2026-08-16
