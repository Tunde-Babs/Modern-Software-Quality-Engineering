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

Part XI — System Design & Architecture has completed accelerated Pass 1. The curriculum architecture is approved, and Chapters 1–12 are drafted with Checkpoints A and B and the Batch C integration checkpoint all passed.

- **v0.13.0 — Performance & Security Engineering Complete** is the latest stable release. Its lifecycle is complete: `release/v0.13.0` was merged to `main`, annotated tag `v0.13.0` was created, and the GitHub Release was published on 2026-08-12. Its Final Quality Gate remains **97/100**; Chapters 1–12 remain **Draft** under manuscript-status governance, and the non-blocking Gunther bibliographic refinement remains its only P3.
- The Part XI architecture defines a 12-chapter, evidence-led System Design & Architecture curriculum for experienced QA Engineers progressing to Quality Engineers. It uses the fictional Atlas Commerce teaching baseline, a clearly labelled original MSQE Architecture Decision Reasoning Model, explicit Part III–XII boundaries, cumulative professional artefacts, an architecture-decision capstone, authoritative-source strategy, and recommended Pass 2 classification.
- The independent Part XI curriculum-architecture review scored **97/100** with verdict **B — targeted architecture corrections required before Pass 1**. It recorded no P0, one P1 (ISO/IEC 25010:2023 terminology accuracy), two P2 refinements (architecture versus architecture description under ISO/IEC/IEEE 42010:2022; Chapter 6 quality-scenario anatomy), and one P3 (source-class label). The 12-chapter progression, QA → QE progression, Atlas baseline, capstone, source strategy, accelerated workflow, and cross-part boundaries were accepted in principle; no redesign was required. This score is an architecture-review result, **not** a Final Part XI Quality Gate.
- All four corrections were applied to `book/part-11-system-design-architecture/README.md` on 2026-08-14 and confirmed by a focused closure review with no remaining P0, P1, or P2 finding. The architecture was approved on that basis and is authoritative for manuscript production.
- **Accelerated Pass 1 Batch A is complete.** Part XI Chapters 1–4 were drafted on 2026-08-14 — *System Design & Architecture as Quality Engineering*; *Boundaries, Responsibilities, Coupling, and Dependencies*; *Communication, Time, and Failure Across Boundaries*; and *State Ownership, Consistency, and Transactional Boundaries*. All four carry `Status: Draft` under manuscript-status governance.
- **Checkpoint A passed** with no P0 and no P1 finding. It verified ISO/IEC 25010:2023 terminology and edition discipline, the architecture versus architecture-description distinction, boundary-taxonomy coherence, synchronous/asynchronous and idempotency semantics, state/consistency and CAP accuracy, independent recalculation of all six numerical examples, Atlas Commerce continuity, cross-part boundaries, and repository integrity. Chapters 1–4 are not represented as reviewed, approved, or published; the consolidated independent manuscript review and Final Part XI Quality Gate have not been run.
- **Accelerated Pass 1 Batch B is complete.** Part XI Chapters 5–10 were drafted on 2026-08-14 — *Architectural Styles and Decomposition Trade-offs*; *Quality Attributes, Constraints, and Trade-off Scenarios*; *Architecture for Testability, Observability, Operability, and Recovery*; *Contracts, Compatibility, and Change Impact*; *Architecture Evidence, Fitness Functions, and Decision Records*; and *Evolution, Migration, Reversibility, and Architecture Debt*. All six carry `Status: Draft`.
- **Checkpoint B passed** with no P0 and no P1 finding. It verified architectural-style neutrality, ISO/IEC 25010:2023 quality-model discipline, the approved Chapter 6 scenario scaffold, Chapter 7's discharge of the Chapters 2–6 capability handoffs, contract/change scope against the Parts IV, VI, and VII boundaries, ADR-is-not-proof and narrowly scoped fitness functions, evolution and reversibility accuracy including strangler-approach neutrality, independent recalculation of all seven Batch B numerical examples, Atlas Commerce continuity across Chapters 1–10, and repository integrity. Chapters 1–10 are not represented as reviewed, approved, or published.
- **Accelerated Pass 1 Batch C is complete.** Part XI Chapters 11–12 were drafted on 2026-08-14 — *Integrated Architecture Decisions: Scale, Security, Reliability, and Residual Risk* and *Capstone: System Design & Architecture Quality Strategy and Evidence Portfolio*. Both carry `Status: Draft`.
- **The Batch C integration checkpoint passed** with no P0 and no P1 finding. It verified the coherence of the Chapters 1–12 progression, that Chapter 11 integrates rather than summarises, that the capstone requires synthesis rather than pattern selection, that all three capstone options remain initially defensible with no microservices bias and no composite architecture score, independent recalculation of all 39 stated values across the Batch C numerical examples, internal consistency of the 34 capstone evidence identifiers with reused evidence retaining identical values, that the Decision Brief fields match the approved architecture exactly while `DECISION`, `CONSEQUENCE`, `RESIDUAL RISK`, and `REVISION TRIGGER` remain learner-completed, bounded specialist handoffs to Parts VIII and X, ISO/IEC 25010:2023 terminology accuracy, Atlas Commerce continuity across all twelve chapters, and repository integrity.
- **Accelerated Pass 1 is complete.** All twelve chapters carry `Status: Draft` and none is represented as reviewed, approved, or published. The consolidated independent manuscript review has **not** been conducted and the Final Part XI Quality Gate has **not** been run. No Part XI laboratory, diagram, ADR example, companion implementation, simulator, dataset, case-study file, website asset, CI/CD configuration, or infrastructure has been created; every proposed standalone asset remains recommended Pass 2 enrichment.
- **v0.14.0 — System Design & Architecture Complete** remains planned and unreleased. Part XII has not started.

---

## Next Authorized Activity

- Obtain authorization to conduct one consolidated independent Part XI manuscript review of Chapters 1–12.
- Do not begin Part XI practical assets, Part XII, or release administration without separate authorization.
- Do not create serial per-chapter review loops; only P0/P1 findings interrupt accelerated drafting.

---

## Outcome

The Part XI curriculum architecture is approved following its **97/100** independent review and closed corrections, and **accelerated Pass 1 is complete**. Chapters 1–12 are drafted, carry `Status: Draft`, and passed Checkpoints A and B and the Batch C integration checkpoint with no P0 or P1 finding. No consolidated manuscript review or Final Quality Gate has been run, and no chapter is represented as reviewed, approved, or published. The latest stable release remains **v0.13.0 — Performance & Security Engineering Complete**. **v0.14.0 — System Design & Architecture Complete** remains planned and unreleased, no Part XI practical asset exists, and Part XII has not started. The next authorized activity is one consolidated independent Part XI manuscript review of Chapters 1–12.
