# Current Sprint

---

## Milestone

M2 — Handbook Development

---

## Branch

`feature/part-11-system-design-architecture`

---

## Released Milestones

- Part I — Foundations released as **v0.4.0 — Foundations Complete**.
- Part II — Programming for Quality Engineers released as **v0.5.0 — Programming Complete**.
- Part III — Software Testing Engineering released as **v0.6.0 — Software Testing Complete**.
- Part IV — API Quality Engineering released as **v0.7.0 — API Quality Engineering Complete**.
- Part V — Automation Engineering released as **v0.8.0 — Automation Engineering Complete**.
- Part VI — Data Quality Engineering released as **v0.9.0 — Data Quality Engineering Complete**.
- Part VII — Cloud & DevOps released as **v0.10.0 — Cloud & DevOps Complete**.
- Part VIII — Observability & Reliability Engineering released as **v0.11.0 — Observability & Reliability Engineering Complete**. Its Final Quality Gate remains **96/100**; Chapters 1–11 remain **Draft** under manuscript-status governance, and Pass 2 enrichment remains deferred.
- Part IX — AI Quality Engineering released as **v0.12.0 — AI Quality Engineering Complete** on 2026-08-12. Its Final Quality Gate remains **97/100** with no P0, P1, P2, or P3 manuscript findings; Chapters 1–12 remain **Draft** under manuscript-status governance, and Pass 2 enrichment remains deferred.
- Part X — Performance & Security Engineering released as **v0.13.0 — Performance & Security Engineering Complete** on 2026-08-12. Its Final Quality Gate remains **97/100** with P0, P1, and P2 findings: none; non-blocking Gunther bibliographic refinement remains the only P3. Chapters 1–12 remain **Draft** under manuscript-status governance, and Pass 2 enrichment remains deferred.

---

## Active Scope

Part XI — System Design & Architecture has passed its **Final Quality Gate at 96/100 (verdict A)** and is ready for manuscript baseline. Chapters 1–12 are drafted and all remain `Status: Draft`. The baseline has not been established and no release administration has begun.

- **v0.13.0 — Performance & Security Engineering Complete** is the latest stable release. Its lifecycle is complete: `release/v0.13.0` was merged to `main`, annotated tag `v0.13.0` was created, and the GitHub Release was published on 2026-08-12. Its Final Quality Gate remains **97/100**; Chapters 1–12 remain **Draft** under manuscript-status governance, and the non-blocking Gunther bibliographic refinement remains its only P3.
- The Part XI architecture defines a 12-chapter, evidence-led System Design & Architecture curriculum for experienced QA Engineers progressing to Quality Engineers. It uses the fictional Atlas Commerce teaching baseline, a clearly labelled original MSQE Architecture Decision Reasoning Model, explicit Part III–XII boundaries, cumulative professional artefacts, an architecture-decision capstone, authoritative-source strategy, and recommended Pass 2 classification.
- The independent Part XI curriculum-architecture review scored **97/100** with verdict **B — targeted architecture corrections required before Pass 1**. It recorded no P0, one P1 (ISO/IEC 25010:2023 terminology accuracy), two P2 refinements (architecture versus architecture description under ISO/IEC/IEEE 42010:2022; Chapter 6 quality-scenario anatomy), and one P3 (source-class label). The 12-chapter progression, QA → QE progression, Atlas baseline, capstone, source strategy, accelerated workflow, and cross-part boundaries were accepted in principle; no redesign was required. This score is an architecture-review result, **not** a Final Part XI Quality Gate.
- All four corrections were applied to `book/part-11-system-design-architecture/README.md` on 2026-08-14 and confirmed by a focused closure review with no remaining P0, P1, or P2 finding. The architecture was approved on that basis and is authoritative for manuscript production.
- **Accelerated Pass 1 Batch A is complete.** Part XI Chapters 1–4 were drafted on 2026-08-14 — *System Design & Architecture as Quality Engineering*; *Boundaries, Responsibilities, Coupling, and Dependencies*; *Communication, Time, and Failure Across Boundaries*; and *State Ownership, Consistency, and Transactional Boundaries*. All four carry `Status: Draft` under manuscript-status governance.
- **Checkpoint A passed** with no P0 and no P1 finding. It verified ISO/IEC 25010:2023 terminology and edition discipline, the architecture versus architecture-description distinction, boundary-taxonomy coherence, synchronous/asynchronous and idempotency semantics, state/consistency and CAP accuracy, independent recalculation of all six numerical examples, Atlas Commerce continuity, cross-part boundaries, and repository integrity. *(Point-in-time record: at Checkpoint A, Chapters 1–4 were not represented as reviewed, approved, or published, and neither the consolidated manuscript review nor the Final Quality Gate had yet been run. Both have since completed — see the Final Gate record below.)*
- **Accelerated Pass 1 Batch B is complete.** Part XI Chapters 5–10 were drafted on 2026-08-14 — *Architectural Styles and Decomposition Trade-offs*; *Quality Attributes, Constraints, and Trade-off Scenarios*; *Architecture for Testability, Observability, Operability, and Recovery*; *Contracts, Compatibility, and Change Impact*; *Architecture Evidence, Fitness Functions, and Decision Records*; and *Evolution, Migration, Reversibility, and Architecture Debt*. All six carry `Status: Draft`.
- **Checkpoint B passed** with no P0 and no P1 finding. It verified architectural-style neutrality, ISO/IEC 25010:2023 quality-model discipline, the approved Chapter 6 scenario scaffold, Chapter 7's discharge of the Chapters 2–6 capability handoffs, contract/change scope against the Parts IV, VI, and VII boundaries, ADR-is-not-proof and narrowly scoped fitness functions, evolution and reversibility accuracy including strangler-approach neutrality, independent recalculation of all seven Batch B numerical examples, Atlas Commerce continuity across Chapters 1–10, and repository integrity. Chapters 1–10 are not represented as reviewed, approved, or published.
- **Accelerated Pass 1 Batch C is complete.** Part XI Chapters 11–12 were drafted on 2026-08-14 — *Integrated Architecture Decisions: Scale, Security, Reliability, and Residual Risk* and *Capstone: System Design & Architecture Quality Strategy and Evidence Portfolio*. Both carry `Status: Draft`.
- **The Batch C integration checkpoint passed** with no P0 and no P1 finding. It verified the coherence of the Chapters 1–12 progression, that Chapter 11 integrates rather than summarises, that the capstone requires synthesis rather than pattern selection, that all three capstone options remain initially defensible with no microservices bias and no composite architecture score, independent recalculation of all 39 stated values across the Batch C numerical examples, internal consistency of the 34 capstone evidence identifiers with reused evidence retaining identical values, that the Decision Brief fields match the approved architecture exactly while `DECISION`, `CONSEQUENCE`, `RESIDUAL RISK`, and `REVISION TRIGGER` remain learner-completed, bounded specialist handoffs to Parts VIII and X, ISO/IEC 25010:2023 terminology accuracy, Atlas Commerce continuity across all twelve chapters, and repository integrity.
- **Accelerated Pass 1 is complete.** All twelve chapters carry `Status: Draft` and none is represented as approved or published.
- **The consolidated independent manuscript review is complete**, scoring **94/100** with verdict **B — targeted corrections required before Final Quality Gate**. It recorded no P0; **two P1** (recoverability misclassified as absent from ISO/IEC 25010:2023 in Chapters 1 and 6 while Chapter 7 stated it correctly; an internally inconsistent fan-out arithmetic chain in Chapter 3); **four P2** (co-change provenance unreconciled between Chapters 5 and 12; a formulaic decision-record ending repeated across six chapters; the capstone pivot pre-supplied by Chapter 11; a self-contradicting status bullet); and **six P3**. This score is a manuscript-review result, **not** a Final Part XI Quality Gate.
- **The targeted P1/P2 correction pass is complete** (2026-08-14) and was confirmed by a focused closure review. All two P1 and all four P2 findings are corrected; no P0, P1, or P2 finding remains. Recoverability is now stated consistently as an ISO/IEC 25010:2023 subcharacteristic of reliability; Chapter 3's arithmetic chain is self-consistent with its rounding rule stated; ARCH-CHG-01 is labelled reclassified evidence with an explicit provenance note; Chapters 3 and 10 demonstrate different decision shapes; and Chapter 12 now turns on six independent decision axes. Residual P3 items are non-blocking and recorded.
- **The Final Part XI Quality Gate is complete: 96/100, verdict A — passed; ready for manuscript baseline.** It recorded **P0 = 0, P1 = 0, P2 = 0** and six non-blocking P3 items. The gate independently re-verified rather than confirming prior reports: all 21 numerical examples recalculated with every displayed chain tested as written (~80 values, zero failures), ISO/IEC 25010:2023 controls re-run at characteristic and subcharacteristic level, all six DOI-registered citations re-verified against Crossref, the capstone re-tested for importable-pivot solvability, and repository, cross-part, and governance checks completed.
- **Four distinct Part XI review events produced four scores and must not be collapsed:** architecture review **97/100**; consolidated manuscript review **94/100**; focused P1/P2 closure review **96/100**; Final Part XI Quality Gate **96/100**. The two 96/100 results are different reviews, and neither is Part VIII's separate historical 96/100 Final Quality Gate.
- **One control remains deliberately open.** ISO/IEC 25010:2023 and ISO/IEC/IEEE 42010:2022 are paywalled and returned HTTP 403 to every access attempt; no purchased copy was available. Their placements rest on consistent secondary references plus the repository's already-gated Part III precedent. This has **not** been upgraded to primary verification and should be completed when a copy is available.
- No Part XI laboratory, diagram, ADR example, companion implementation, simulator, dataset, case-study file, website asset, CI/CD configuration, or infrastructure has been created; every proposed standalone asset remains recommended Pass 2 enrichment.
- **v0.14.0 — System Design & Architecture Complete** remains planned and unreleased. Part XII has not started.

---

## Next Authorized Activity

- Establish the Part XI manuscript baseline.
- Do not begin Part XI practical assets, Part XII, or release administration without separate authorization.
- Drafting and review are complete. The remaining workflow is: manuscript baseline, then separately authorized v0.14.0 release administration. Part XII remains not started.

---

## Outcome

The Part XI curriculum architecture is approved following its **97/100** independent review and closed corrections, and **accelerated Pass 1 is complete**. Chapters 1–12 are drafted, carry `Status: Draft`, and passed Checkpoints A and B and the Batch C integration checkpoint with no P0 or P1 finding. No chapter is represented as approved or published. The latest stable release remains **v0.13.0 — Performance & Security Engineering Complete**. **v0.14.0 — System Design & Architecture Complete** remains planned and unreleased, no Part XI practical asset exists, and Part XII has not started. The consolidated independent manuscript review scored **94/100** with verdict **B**, recording no P0, two P1, four P2, and six P3 findings; all P1 and P2 findings were corrected on 2026-08-14 and confirmed by a **focused P1/P2 closure review at 96/100**. The **Final Part XI Quality Gate then passed at 96/100 with verdict A**, recording P0 = 0, P1 = 0, P2 = 0 and six non-blocking P3 items. All twelve chapters remain `Status: Draft`. The next authorized activity is to establish the Part XI manuscript baseline; **v0.14.0 remains planned and unreleased**, Pass 2 enrichment remains deferred, and Part XII has not started.
