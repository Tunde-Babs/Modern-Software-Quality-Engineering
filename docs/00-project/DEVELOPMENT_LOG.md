# Development Log

This document records the significant milestones, deliverables, and progress of the **Modern Software Quality Engineering (MSQE)** project.

---

# 2026-08-07

## Milestone M1 – Governance ✅

### Objective

Establish the governance, educational architecture, editorial standards, and operational framework for the MSQE project.

### Deliverables Completed

- Authored and merged `PROJECT_CHARTER.md`
- Developed and merged `MQE_BOK.md`
- Developed and merged `BOOK_BLUEPRINT.md`
- Developed and merged `LEARNING_FRAMEWORK.md`
- Developed and merged `EDITORIAL_STYLE_GUIDE.md`
- Developed and merged `ARCHITECTURE.md`
- Developed and merged `ROADMAP.md`
- Developed and merged `VERSIONING.md`
- Developed and merged `RELEASE_POLICY.md`
- Developed and merged `DECISION_RECORDS.md`
- Developed and merged `QUALITY_GATES.md`

### Outcome

The governance foundation for the Modern Software Quality Engineering (MSQE) project has been successfully completed.

The project now has a comprehensive framework defining:

- Vision and mission
- Body of Knowledge (MQE-BOK)
- Educational architecture
- Learning framework
- Editorial standards
- Repository architecture
- Versioning strategy
- Release policy
- Decision records
- Quality assurance process

This milestone establishes the governance required to support the long-term development of the handbook, laboratories, companion website, and future learning ecosystem.

**Status:** ✅ Completed

---

## README Refresh

### Completed

- Updated repository status to **M2 – Handbook Development**
- Added Project Status section
- Added Governance overview
- Updated project roadmap
- Refreshed release information
- Updated Contributing section

### Outcome

The repository landing page now accurately reflects the completion of the Governance phase and the transition into handbook development.

---

## Next Milestone

### M2 – Handbook Development

#### Immediate Priorities

- Develop publishing infrastructure
- Create reusable chapter templates
- Create laboratory templates
- Create diagram templates
- Establish handbook structure
- Begin Part I – Foundations
- Write Chapter 1: *What is Modern Software Quality Engineering?*

---

**Last Updated:** 2026-08-07

---

# 2026-08-08

## Milestone M2 — Handbook Development: Part I Foundations

### Completed

- Completed the Part I manuscript and Pass 2 enrichment: diagrams, Lab 1, exercises, case studies, cross-links, and the QA to QE Transition Framework.
- Completed the Final Quality Gate Review: **92/100 — Excellent**.
- Closed the targeted P1 corrections: Lab 1 sequencing, Chapter 2 Engineering Perspective, and Mermaid render validation.

### Outcome

Part I remains **Technical Review Ready** and proceeds to merge preparation and final release validation.

### Version Sequencing

- v0.3.0 represented the Publishing Infrastructure development milestone but was not published as a standalone GitHub release.
- Consistent with the project versioning policy, v0.4.0 — Foundations Complete is the next planned public release.

**Status:** Final corrections completed

**Last Updated:** 2026-08-08

---

# 2026-08-09

## Milestone M2 — Handbook Development: Part II Programming for Quality Engineers

### Completed

- Completed Part II Chapters 1–12, its five planned deliveries, and the Quality Engineering Toolkit capstone.
- Completed the QA → QE programming progression from code-reading and typed utilities through debugging, collaboration, testing, and integrated evidence production.
- Completed the Part II normalization pass and Final Quality Gate Review: **95/100 — Exceptional / Reference Quality**.
- Closed the final P1 correction by aligning the Delivery 4 clean-install instruction with the committed lockfile.
- Validated documented companion installation, TypeScript checks, builds, deterministic tests, executable runs, Markdown, links, manifests, and repository hygiene.

### Outcome

Part II is ready for merge and release preparation as **v0.5.0 — Programming Complete**. The chapter manuscripts remain Draft; no approved release, Git tag, or publication has been created by this milestone record.

### Next Steps

- Commit the approved Part II change set and open a pull request from `feature/part-02-programming` to `develop`.
- Complete the approved release workflow through `main`, then create the v0.5.0 tag and GitHub release only after final approval.
- Do not begin Part III until explicitly authorized.

**Status:** Release preparation active

**Last Updated:** 2026-08-09

---

## Release Candidate v0.6.0 — Software Testing Complete

- Merged the approved Part III manuscript and release-administration work into `develop` and prepared `release/v0.6.0`.
- Corrected the canonical v0.6.0 governance title to **Software Testing Complete**, preserving Automation Engineering as the separate planned Part V scope.
- Finalized release-candidate metadata for Part III; the Final Part III Quality Gate remains **96/100**, the capstone quality gate remains **97/100**, and no P0 or P1 findings remain.
- Founder final approval, promotion to `main`, tag creation, and the GitHub Release remain pending.

**Status:** Release candidate prepared

**Last Updated:** 2026-08-10

---

## Release Candidate v0.5.0 — Programming Complete

- Merged the approved Part II change set into `develop` and prepared `release/v0.5.0`.
- Finalized release-candidate metadata for Part II; the Final Quality Gate remains **95/100**, with no P0 findings and the final P1 closed.
- Founder final approval, tag creation, and the GitHub Release remain pending.

**Status:** Release candidate prepared

**Last Updated:** 2026-08-09

---

## Milestone M2 — Handbook Development: Part III Software Testing

### Completed

- Completed Part III Chapters 1–12 and the QA → QE testing progression from evidence interpretation and risk-informed strategy through testability, test design, exploration, reliable feedback, distributed-system evidence, regression strategy, and production learning.
- Completed Delivery quality gates: Delivery 1 **94/100**, Delivery 2 **96/100**, Delivery 3 **94/100**, Delivery 4 **95/100**, and the Chapter 12 capstone **97/100**.
- Completed the Risk-Informed Test Strategy and Evidence Portfolio capstone, comprehensive normalization, and the Final Part III Quality Gate: **96/100 — Exceptional / Reference Quality**.
- Established the committed Part III manuscript baseline on `feature/part-03-testing`; no P0 or P1 findings remain.

### Outcome

Part III is ready for merge and release preparation. The chapter manuscripts remain Draft; no release branch, tag, GitHub Release, or publication is claimed by this record.

### Next Steps

- Commit and push approved release-administration changes, then open the pull request from `feature/part-03-testing` to `develop`.
- Complete the approved release workflow through the release branch and `main`, then create the tag and GitHub Release only after final approval.
- Do not begin Part IV until explicitly authorized.

**Status:** Release preparation active

**Last Updated:** 2026-08-09

---

## Milestone M2 — Handbook Development: Part IV API Quality Engineering

### Completed

- Completed Part IV Chapters 1–10 and the QA → QE API progression from boundary reasoning through interface semantics, contracts, state, data, identity, dependencies, reliability, change, and production learning.
- Completed Deliveries 1–5 quality gates at **96/100** each, comprehensive normalization, and the Final Part IV Quality Gate at **97/100**.
- Completed the API Quality Strategy and Evidence Portfolio capstone and established the committed Part IV manuscript/status baseline on `feature/part-04-api-quality-engineering`.
- Approved the canonical planned release mapping: **v0.7.0 — API Quality Engineering Complete**.

### Outcome

Part IV is complete at manuscript/content level and ready for release administration. Chapters remain Draft; no tag, GitHub Release, publication, or Part V work is claimed by this record.

### Next Steps

- Commit and push the approved governance-correction and release-administration changes, then open a pull request to `develop`.
- Complete the approved release workflow through `release/v0.7.0` and `main`; create the tag and GitHub Release only after final approval.
- Keep the deterministic companion API and Labs 1–2 deferred to later Pass 2 enrichment, and do not begin Part V automatically.

**Status:** Release preparation active

**Last Updated:** 2026-08-10

---

## Release Candidate v0.7.0 — API Quality Engineering Complete

- Merged the approved Part IV manuscript, governance correction, and release-administration work into `develop`, then prepared `release/v0.7.0`.
- Confirmed the canonical planned stable release mapping: **v0.7.0 — API Quality Engineering Complete**.
- Final Part IV Quality Gate: **97/100**; P0/P1/P2/P3 findings: none. Chapters 1–10 remain Draft.
- Main promotion, annotated tag creation, and GitHub Release publication remain pending. Pass 2 enrichment is deferred, and Part V has not started.

**Status:** Final release-candidate review active

**Last Updated:** 2026-08-10

---

## Milestone M2 — Handbook Development: Part V Automation Engineering

### Completed

- Completed Part V — Automation Engineering, Chapters 1–12, and its QA → QE progression from automating checks to engineering trustworthy, proportionate, and diagnosable feedback systems.
- Closed Delivery 1, Delivery 2, Delivery 3, comprehensive normalization, and the Final Part V Quality Gate at **98/100**; P0/P1/P2 findings: none.
- Established committed manuscript baseline `64a3c9f` and confirmed the canonical planned release mapping: **v0.8.0 — Automation Engineering Complete**.

### Outcome

Part V is complete at manuscript level and ready for release administration. All Chapters 1–12 remain Draft. The Quality Automation System companion and Labs 1–2 remain deferred Pass 2 enrichment; Part VI has not started.

### Next Steps

- Commit and push the approved release-administration changes, then open the pull request from `feature/part-05-automation-engineering` to `develop`.
- Prepare `release/v0.8.0` only after the feature pull request is approved and merged; do not create a tag, GitHub Release, companion implementation, or laboratory work without separate approval.

**Status:** Release preparation active

**Last Updated:** 2026-08-10

---

## Milestone M2 — Handbook Development: Part VI Data Quality Engineering

### Completed

- Completed accelerated Pass 1 production of Part VI — Data Quality Engineering, Chapters 1–11, followed by consolidated review, targeted expansion, and comprehensive normalization.
- Completed the Final Part VI Quality Gate at **96/100**; manuscript P0, P1, and P2 findings: none.
- Established and pushed manuscript baseline `6ca58c6` on `feature/part-06-data-quality-engineering`.
- Clarified practical-asset governance through Quality Gates v1.1: required assets require validation, while the Atlas Commerce Data Pipeline companion and Labs 1–3 remain recommended Pass 2 enrichment.

### Outcome

Part VI is complete at manuscript level. Its release administration was merged into `develop`, and `release/v0.9.0` is prepared for Release Candidate validation of planned **v0.9.0 — Data Quality Engineering Complete**. Chapters 1–11 remain Draft; no companion implementation or laboratories have been created, and Part VII has not started. Main promotion, tag creation, and GitHub Release publication remain pending.

### Next Steps

- Complete Release Candidate review, then open the release pull request to `main` after approval.
- Keep Pass 2 enrichment deferred and do not create a tag, GitHub Release, or Part VII work without separate authorization.

**Status:** Release Candidate validation active

**Last Updated:** 2026-08-11

---

## Release v0.9.0 — Data Quality Engineering Complete

- Completed Part VI release closure after the 96/100 Final Part VI Quality Gate, with no manuscript P0, P1, or P2 findings.
- Applied Quality Gates v1.1: the Atlas Commerce Data Pipeline companion and Labs 1–3 remain deferred Pass 2 enrichment rather than release requirements.
- Completed Release Candidate review, merged the release PR to `main`, created annotated tag `v0.9.0`, and published the GitHub Release.
- Chapters 1–11 remain Draft; no companion implementation or laboratories were created.

**Outcome:** Part VI is released. Part VII — Cloud & DevOps curriculum architecture/planning is the next authorized action; no Part VII work has begun.

**Status:** Released

**Last Updated:** 2026-08-11

---

## Milestone M2 — Handbook Development: Part VII Cloud & DevOps

### Completed

- Completed the accelerated Part VII curriculum architecture and Pass 1 manuscript for Chapters 1–11, followed by consolidated independent review and light normalization.
- Completed the Final Part VII Quality Gate at **97/100**; P0/P1/P2/P3 findings: none within the approved manuscript scope.
- Established and pushed the reviewed manuscript baseline `2da10fd` on `feature/part-07-cloud-devops`.
- Applied Quality Gates v1.1: the Atlas Commerce Local Delivery Simulator and Labs 1–3 remain recommended Pass 2 enrichment; no standalone practical asset is required for the manuscript release.

### Outcome

Part VII is complete at manuscript level and enters release administration for planned **v0.10.0 — Cloud & DevOps Complete**. Chapters 1–11 remain Draft; no companion implementation, laboratories, diagrams, case studies, CI/CD configuration, cloud infrastructure, or website asset has been created. Part VIII has not started.

### Next Steps

- Commit and push approved release-administration metadata, then open the pull request from `feature/part-07-cloud-devops` to `develop`.
- Keep Pass 2 enrichment deferred; do not create a release branch, tag, GitHub Release, or Part VIII work without separate authorization.

**Status:** Release preparation active

**Last Updated:** 2026-08-11

---

## Release Candidate v0.10.0 — Cloud & DevOps Complete

- Merged the approved Part VII manuscript and release-administration metadata into `develop`, then prepared `release/v0.10.0` from that updated state.
- The Final Part VII Quality Gate remains **97/100**; P0/P1/P2/P3 findings: none within the approved manuscript scope. Chapters 1–11 remain Draft.
- Release Candidate validation is active. Main promotion, annotated tag creation, and GitHub Release publication remain pending; the Local Delivery Simulator and Labs 1–3 remain deferred Pass 2 enrichment, and Part VIII has not started.

**Status:** Release Candidate validation active

**Last Updated:** 2026-08-11

---

## Release v0.10.0 — Cloud & DevOps Complete

- Completed Part VII release closure after the **97/100** Final Part VII Quality Gate, with no P0/P1/P2/P3 findings within the approved manuscript scope.
- Merged the release pull request to `main`, created annotated tag `v0.10.0`, and published the GitHub Release.
- Quality Gates v1.1 remains applied: the Atlas Commerce Local Delivery Simulator and Labs 1–3 remain deferred Pass 2 enrichment. Chapters 1–11 remain Draft.

**Outcome:** Part VII is released. Part VIII — Observability & Reliability Engineering curriculum architecture/planning is the next authorized activity; planning has not started.

**Status:** Released

**Last Updated:** 2026-08-11

---

## Milestone M2 — Handbook Development: Part VIII Observability & Reliability Engineering

- Completed Part VIII Chapters 1–11 and the observability-and-reliability QA → QE progression, culminating in the **Observability & Reliability Strategy and Evidence Portfolio** capstone and Reliability Decision Brief.
- Completed the Final Part VIII Quality Gate at **96/100**; manuscript P0, P1, and P2 findings: none.
- Established and pushed manuscript baseline `ee20d306b88b` on `feature/part-08-observability-reliability`; all chapters remain Draft.
- Applied Quality Gates v1.1: the Atlas Commerce Observability & Reliability Simulator, Labs 1–3, and conceptual diagrams remain deferred recommended Pass 2 enrichment.

**Outcome:** Part VIII is complete at manuscript level and release administration is active for planned **v0.11.0 — Observability & Reliability Engineering Complete**. No release branch, tag, GitHub Release, companion implementation, laboratory, diagram, or Part IX work is claimed.

**Next Steps:** Commit and push approved release-administration metadata, then open the feature-to-`develop` pull request. After merge to `develop`, create `release/v0.11.0` and conduct a separate Release Candidate review before promotion to `main`.

**Status:** Release preparation active

**Last Updated:** 2026-08-12

---

## Release Candidate v0.11.0 — Observability & Reliability Engineering Complete

- Merged the approved Part VIII release-administration metadata into `develop` and created `release/v0.11.0` from the merged state.
- Completed Release Candidate validation against manuscript baseline `ee20d306b88b`; all 11 chapters remain Draft, and the Final Part VIII Quality Gate remains **96/100** with no P0/P1/manuscript P2 findings.
- The Atlas Commerce Observability & Reliability Simulator, Labs 1–3, and conceptual diagrams remain deferred, non-blocking Pass 2 enrichment; Part IX has not started.

**Outcome:** The Release Candidate is validated. Promotion to `main`, annotated tag `v0.11.0`, and GitHub Release publication remain pending.

**Status:** Release Candidate validated; main promotion pending

**Last Updated:** 2026-08-12

---

## Release v0.11.0 — Observability & Reliability Engineering Complete

- Merged the approved release branch to `main`, created annotated tag `v0.11.0`, and published the GitHub Release on 2026-08-12.
- The Final Part VIII Quality Gate remains **96/100** with no P0/P1/manuscript P2 findings. Chapters 1–11 remain Draft under manuscript-status governance, and baseline `ee20d306b88b` remains preserved.
- The Atlas Commerce Observability & Reliability Simulator, Labs 1–3, and conceptual diagrams remain deferred, non-blocking Pass 2 enrichment.

**Outcome:** Part VIII is released. Part IX — AI Quality Engineering planning is the next authorized handbook activity; no Part IX manuscript has started.

**Status:** Released

**Last Updated:** 2026-08-12

---

## Milestone M2 — Handbook Development: Part IX AI Quality Engineering

- Completed Part IX — AI Quality Engineering, Chapters 1–12, spanning AI system and failure boundaries; evaluation data and oracles; predictive, generative, retrieval, evaluator, agent, safety, fairness, privacy, regression, and production-learning evidence; and the **AI Quality Strategy and Evaluation Portfolio** capstone with its Evidence Index and AI Quality Decision Brief.
- Completed the consolidated independent review at **89/100**, followed by the targeted P1/P2 evidence-traceability correction and focused closure review.
- Completed the Final Part IX Quality Gate at **97/100**; P0/P1/P2/P3 findings: none. Source-freshness and numerical validation controls are complete.
- Established and pushed manuscript baseline `4df2b8d2409cfa0fc474cad8e1bbdbe652eb9dd5`; all 12 chapters remain Draft under manuscript-status governance.
- Applied Quality Gates v1.1: the Atlas Commerce AI Evaluation Simulator, Labs 1–4, conceptual diagrams, standalone datasets, executable examples, and case-study files remain deferred recommended Pass 2 enrichment.

**Outcome:** Part IX is complete at manuscript level and release administration is active for planned **v0.12.0 — AI Quality Engineering Complete**. No Part X manuscript, companion implementation, or Pass 2 asset has been created.

**Status:** Release administration active

**Last Updated:** 2026-08-12

---

## Release v0.13.0 — Performance & Security Engineering Complete

- Closed the Part X release lifecycle after its **97/100** Final Quality Gate; P0/P1/P2 findings remain none, and non-blocking Gunther bibliographic refinement remains the only P3.
- Merged the approved `release/v0.13.0` branch to `main`, created annotated tag `v0.13.0`, and published the GitHub Release on 2026-08-12. Controlled manuscript baseline `3f7391b5fd939a5dd973d25386811031f3448180` remains preserved, and all 12 chapters remain Draft under manuscript-status governance.
- The Atlas Commerce Performance & Security Simulator; laboratories; conceptual diagrams; synthetic datasets; executable performance examples; safe security-testing examples; and case-study files remain deferred, non-blocking Pass 2 enrichment. Part XI has not started.

**Outcome:** Part X is released. v0.14.0 — System Design & Architecture Complete remains planned; no Part XI manuscript, architecture, or practical-asset work is represented as started.

**Status:** Released

**Last Updated:** 2026-08-12

---

## Release Candidate v0.13.0 — Performance & Security Engineering Complete

- Completed feature-to-`develop` integration and created `release/v0.13.0` from the merged state for consolidated Release Candidate validation.
- The Final Part X Quality Gate remains **97/100** with P0/P1/P2 findings: none; non-blocking Gunther bibliographic refinement remains the only P3. Baseline `3f7391b5fd939a5dd973d25386811031f3448180` is frozen, and all 12 chapters remain Draft.
- The Atlas Commerce Performance & Security Simulator; laboratories; conceptual diagrams; synthetic datasets; executable performance examples; safe security-testing examples; and case-study files remain deferred, non-blocking Pass 2 enrichment. Part XI has not started.

**Outcome:** v0.13.0 is the current unreleased Release Candidate. Release PR review to `main`, approval and merge, annotated tag creation, GitHub Release publication, and post-release reconciliation remain pending.

**Status:** Release Candidate validation active

**Last Updated:** 2026-08-12

---

## Release Candidate v0.12.0 — AI Quality Engineering Complete

- Completed feature-to-`develop` integration and aligned `release/v0.12.0` with `develop`.
- Performed current Release Candidate validation against frozen baseline `4df2b8d2409cfa0fc474cad8e1bbdbe652eb9dd5`; all 12 chapters remain Draft, the manuscript is frozen, and the Final Part IX Quality Gate remains **97/100** with P0/P1/P2/P3 manuscript findings: none.
- The Atlas Commerce AI Evaluation Simulator, Labs 1–4, conceptual diagrams, standalone datasets, executable examples, and case-study files remain deferred, non-blocking Pass 2 enrichment. Part X has not started.

**Outcome:** v0.12.0 is the current unreleased Release Candidate. Commit and push this metadata correction, then open the release pull request to `main`; promotion, annotated tag creation, and GitHub Release publication remain pending.

**Status:** Release Candidate validation current; main promotion pending

**Last Updated:** 2026-08-12

---

## Release v0.12.0 — AI Quality Engineering Complete

- Merged the approved `release/v0.12.0` branch to `main`, created annotated tag `v0.12.0`, and published the GitHub Release on 2026-08-12.
- The Final Part IX Quality Gate remains **97/100** with P0/P1/P2/P3 manuscript findings: none. Chapters 1–12 remain Draft under manuscript-status governance, and baseline `4df2b8d2409cfa0fc474cad8e1bbdbe652eb9dd5` remains preserved.
- The Atlas Commerce AI Evaluation Simulator, Labs 1–4, conceptual diagrams, standalone datasets, executable examples, and case-study files remain deferred, non-blocking Pass 2 enrichment.

**Outcome:** Part IX is released. Part X — Performance & Security Engineering architecture and curriculum planning are the next authorized handbook activity; no Part X manuscript or standalone practical asset has started.

**Status:** Released

**Last Updated:** 2026-08-12

---

## Milestone M2 — Handbook Development: Part X Performance & Security Engineering Planning

- Reconciled active project state after the v0.12.0 release and started a proposed, review-pending Part X architecture for planned **v0.13.0 — Performance & Security Engineering Complete**.
- The proposed curriculum joins performance and security through system boundaries, workload and threat assumptions, experiments, evidence, limitations, decisions, and residual risk. It does not treat load testing or vulnerability scanning as sufficient quality-engineering conclusions.
- No Part X chapter manuscript, laboratory, simulator, diagram, dataset, performance script, security tool, case-study file, companion implementation, website asset, CI/CD configuration, or infrastructure has been created. Part XI has not started.

**Outcome:** Architecture and curriculum planning are active and require independent approval before Pass 1 manuscript drafting. Proposed standalone practical assets are deferred, non-blocking Pass 2 enrichment.

**Status:** Architecture planning active; approval pending

**Last Updated:** 2026-08-12

---

## Milestone M2 — Handbook Development: Part X Performance & Security Engineering

- Completed Part X — Performance & Security Engineering, Chapters 1–12, following architecture approval, the **91/100** independent architecture review, focused architecture closure, Accelerated Pass 1, and Checkpoints A and B.
- Completed the **93/100** consolidated independent manuscript review, P1 correction and focused closure, then the **97/100** Final Part X Quality Gate; P0/P1/P2 findings are none, and non-blocking Gunther bibliographic refinement is the only P3.
- Established controlled manuscript baseline `3f7391b5fd939a5dd973d25386811031f3448180`; all 12 chapters remain Draft under manuscript-status governance.
- Applied Quality Gates v1.1: the Atlas Commerce Performance & Security Simulator; performance, workload-modelling, security-evidence/threat-modelling, and integrated regression/capstone labs; conceptual diagrams; synthetic datasets; executable performance examples; safe security-testing examples; and case-study files remain deferred recommended Pass 2 enrichment.

**Outcome:** Part X manuscript quality is accepted. Release administration is active for planned, unreleased **v0.13.0 — Performance & Security Engineering Complete**; Part XI has not started.

**Status:** Release administration active

**Last Updated:** 2026-08-12

---

## Milestone M2 — Handbook Development: Part XI System Design & Architecture

- Completed Part XI — System Design & Architecture, Chapters 1–12, following the **97/100** independent curriculum-architecture review, focused architecture-correction closure, Accelerated Pass 1 in three batches, Checkpoints A and B, and the Batch C integration checkpoint.
- Completed the **94/100** consolidated independent manuscript review, which recorded no P0, two P1 (recoverability misclassified against ISO/IEC 25010:2023 while Chapter 7 stated it correctly; an internally inconsistent fan-out arithmetic chain), four P2, and six P3 findings. All P1 and P2 findings were corrected and confirmed by a **96/100** focused P1/P2 closure review.
- Completed the **96/100** Final Part XI Quality Gate; P0/P1/P2 findings are none, and six residual P3 items are non-blocking. The gate independently re-verified rather than confirming prior reports: every numerical example was recalculated with each displayed chain tested as written, ISO/IEC 25010:2023 terminology was checked at characteristic and subcharacteristic level, all DOI-registered citations were re-verified against Crossref, and the capstone was re-tested for importable-pivot solvability.
- Established controlled manuscript baseline `7067ebb54cba199a9215363188171d2e4966ed15`; all 12 chapters remain Draft under manuscript-status governance.
- Applied Quality Gates v1.1: the Atlas Commerce Architecture Decision Simulator; boundary/dependency, asynchronous/consistency, trade-off/evidence, and evolution/capstone laboratories; conceptual diagrams; ADR examples and architecture-evaluation worksheets; executable fitness-function and dependency-analysis examples; and standalone case-study files, datasets, and migration simulations remain deferred recommended Pass 2 enrichment.
- Carried one residual non-blocking source-verification control: ISO/IEC 25010:2023 and ISO/IEC/IEEE 42010:2022 are paywalled and returned HTTP 403 to every access attempt, so their characteristic and subcharacteristic placements rest on consistent secondary references and the repository's already-gated Part III precedent rather than on a purchased copy. This was deliberately carried forward, not closed.

**Outcome:** Part XI manuscript quality is accepted and the controlled baseline is fixed. Release-administration metadata is prepared for planned, unreleased **v0.14.0 — System Design & Architecture Complete**; the next step is a reviewed feature → develop pull request. Part XII — Engineering Leadership & Career Growth has not started.

**Status:** Release administration active

**Last Updated:** 2026-08-14

---

## Release Candidate v0.14.0 — System Design & Architecture Complete

- Completed feature-to-`develop` integration via pull request #35 and created `release/v0.14.0` from the merged state for consolidated Release Candidate validation. That integration also carried the three v0.13.0 release-line commits (`e4fb016`, `3fee529`, `0d78303`) into `develop`, closing a pre-existing post-v0.13.0 reconciliation gap.
- The Final Part XI Quality Gate remains **96/100** with P0/P1/P2 findings: none; six residual P3 items remain non-blocking. Controlled manuscript baseline `7067ebb54cba199a9215363188171d2e4966ed15` is unchanged, and all 12 chapters remain Draft under manuscript-status governance.
- Release Candidate validation re-verified chapter freeze against the baseline blob-for-blob, release scope, canonical release identity, governance consistency, and merge readiness to `main`; targeted technical spot checks and numerical recalculation were repeated rather than assumed.
- The residual non-blocking source-verification control is carried unchanged: ISO/IEC 25010:2023 and ISO/IEC/IEEE 42010:2022 remain paywalled, so their characteristic and subcharacteristic placements rest on consistent secondary references and the repository's already-gated Part III precedent rather than on a purchased copy.
- The Atlas Commerce Architecture Decision Simulator; boundary/dependency, asynchronous/consistency, trade-off/evidence, and evolution/capstone laboratories; conceptual diagrams; ADR examples and worksheets; executable fitness-function and dependency-analysis examples; and case-study files, datasets, and migration simulations remain deferred recommended Pass 2 enrichment.

**Outcome:** v0.14.0 is the current unreleased Release Candidate. Release PR review to `main`, approval and merge, annotated tag creation, GitHub Release publication, and post-release reconciliation remain pending. v0.13.0 remains the latest stable release, and Part XII — Engineering Leadership & Career Growth has not started.

**Status:** Release Candidate validation active

**Last Updated:** 2026-08-14

---

## Release v0.14.0 — System Design & Architecture Complete

- Closed the Part XI release lifecycle after its **96/100** Final Quality Gate; P0/P1/P2 findings remain none, and six residual P3 items remain non-blocking.
- Merged the approved `release/v0.14.0` branch to `main` via pull request #36, created annotated tag `v0.14.0`, and published the GitHub Release on 2026-08-14. Controlled manuscript baseline `7067ebb54cba199a9215363188171d2e4966ed15` is preserved and reachable from `main`; all 12 chapters remain Draft under manuscript-status governance.
- The earlier feature-to-`develop` integration (pull request #35) also carried the three v0.13.0 release-line commits into `develop`, closing the pre-existing post-v0.13.0 reconciliation gap.
- The residual non-blocking source-verification control is carried unchanged: ISO/IEC 25010:2023 and ISO/IEC/IEEE 42010:2022 remain paywalled, so their characteristic and subcharacteristic placements rest on consistent secondary references and the repository's already-gated Part III precedent rather than on a purchased copy.
- The Atlas Commerce Architecture Decision Simulator; boundary/dependency, asynchronous/consistency, trade-off/evidence, and evolution/capstone laboratories; conceptual diagrams; ADR examples and worksheets; executable fitness-function and dependency-analysis examples; and case-study files, datasets, and migration simulations remain deferred recommended Pass 2 enrichment.

**Outcome:** Part XI is released and v0.14.0 is the latest stable release. v0.15.0 — Engineering Leadership & Career Growth Complete remains planned; no Part XII manuscript, architecture, or practical-asset work is represented as started.

**Status:** Released

**Last Updated:** 2026-08-14

---

## Part XII — Engineering Leadership & Career Growth — Manuscript Baseline and v0.15.0 Release Preparation

- Completed the Part XII lifecycle through five distinct scored review events: independent curriculum-architecture review **83/100 (verdict B)** with corrections C1–C13 closed; focused architecture-closure review **97/100 (verdict A)**; Accelerated Pass 1 Batches A–C with Checkpoints A, B, and the Batch C integration checkpoint; consolidated independent manuscript review **97/100 (verdict B)** recording one P2; focused manuscript-closure review **95.5/100 (verdict A)** closing that P2; and the **Final Part XII Quality Gate at 97/100 (verdict A)**. The three 97/100 results are unrelated reviews and must not be collapsed.
- **Final Gate result:** P0 = 0, P1 = 0, 0 release-blocking P2, six non-blocking P3. Thirty numerical chains were independently discovered and recomputed with exact rational arithmetic, every displayed intermediate chain tested as written, and all thirty passed. All 73 capstone evidence identifiers validated; authority discipline returned zero hits; career-claim discipline returned zero deterministic claims; no composite scoring exists.
- **Established the controlled Part XII manuscript baseline `839391e136ac00c757dded170ba8ed94a58ff41d`** — twelve chapters, all `Status: Draft`, 66,914 raw and 51,923 prose words — recorded by governance commit `f92df59538cabc71a69ef6c50c1fcee134a3ac86`. All twelve chapter blobs are frozen and verified identical to the baseline.
- **Closed the Final Gate's non-release-blocking governance P2** by recording the focused manuscript-closure review as a distinct review event across the authorized governance files and replacing stale current-state pointers with point-in-time records.
- **Prepared v0.15.0 release-administration metadata**: the CHANGELOG carries a planned, unreleased `v0.15.0 — Engineering Leadership & Career Growth Complete` entry, and governance records the Final Gate, the baseline, the six non-blocking P3 items, the open source controls, and deferred Pass 2 enrichment.
- Source-verification controls are carried forward honestly: Parnas & Clements, Edmondson, Kaner & Bond, Conway, and DORA are primary-verified, with DORA re-verified as current at Final Gate time and remaining time-sensitive; Westrum, SPACE, Collins/Brown/Newman, and Rogers remain metadata- or abstract-verified with claims narrowed accordingly. Part XI's ISO purchased-copy limitation remains open and unrelated to Part XII.

**Outcome:** The Part XII manuscript is complete, gated, and frozen at a controlled baseline, and v0.15.0 release-administration metadata is prepared. **No release workflow step has been executed** — no feature-to-`develop` merge, no `release/v0.15.0` branch, no `main` promotion, no `v0.15.0` tag, and no GitHub Release. Pass 2 enrichment remains deferred and Part XIII has not started.

**Status:** Manuscript baseline established; release administration prepared, not executed

**Last Updated:** 2026-08-15

---

## Release Candidate v0.15.0 — Engineering Leadership & Career Growth Complete

- Merged the Part XII feature branch into `develop` via **pull request #37** and created **`release/v0.15.0`** from the merged state. `origin/develop` and `release/v0.15.0` point to the same commit `a3dcc9d4e559e8121bc62129b3d2bbdf98bc45fd`, and `origin/main` is a clean ancestor with zero conflicts.
- Completed Release Candidate validation. The controlled manuscript baseline `839391e136ac00c757dded170ba8ed94a58ff41d` remains reachable and all twelve Part XII chapter blobs are byte-identical to it; twelve chapters remain `Status: Draft` at 66,914 raw and 51,923 prose words. The release diff against `main` contains exactly seventeen paths — the Part XII architecture, its twelve chapters, and release/governance metadata — with no Part XIII work, no Pass 2 assets, and no code, CI/CD, infrastructure, or website changes.
- Re-verified externally mutable sources at Release Candidate time. DORA's five-metric model, names, grouping, and definitions are unchanged since the Final Quality Gate, so Chapter 9 remains accurate. Publisher access controls returning HTTP 403 for Westrum, SPACE, and Edmondson are unchanged bot protection rather than link rot; Conway, Kaner & Bond, Parnas & Clements, and the cognitive-apprenticeship record all resolve.
- Reconciled release metadata to Release Candidate state: the CHANGELOG entry moved from *Planned* to **Release Candidate**, and the root README, `CURRENT_SPRINT.md`, and the Part XII README now record `release/v0.15.0` as the current Release Candidate with `main` promotion pending.

**Outcome:** `release/v0.15.0` is validated and ready for the release pull request to `main`. **Nothing has been released** — no `main` promotion, no `v0.15.0` tag, and no GitHub Release. Part XII's six non-blocking P3 observations and its open source-verification controls are carried forward unchanged, Pass 2 enrichment remains deferred, and Part XIII has not started.

**Status:** Release Candidate validated; promotion pending

**Last Updated:** 2026-08-15

---

## Release v0.15.0 — Engineering Leadership & Career Growth Complete

- Closed the Part XII release lifecycle after its **97/100 (verdict A)** Final Quality Gate; P0 and P1 findings remain none, no release-blocking P2 remains, and six residual P3 items remain non-blocking.
- Merged the validated `release/v0.15.0` branch to `main` via pull request #38, created annotated tag `v0.15.0` at `c599811d94ca87f9b3994ae213a34593d4733cc5`, and published the GitHub Release on 2026-08-15. Post-release reconciliation is complete: `origin/main` and `origin/develop` both resolve to `c599811d94ca87f9b3994ae213a34593d4733cc5` with zero divergence in either direction.
- Controlled manuscript baseline `839391e136ac00c757dded170ba8ed94a58ff41d` is preserved and reachable from `main`; all twelve Part XII chapter blobs remain byte-identical to it, and all twelve chapters remain `Status: Draft` under manuscript-status governance. The release does not change any chapter's status.
- Preserved the five distinct scored review events — curriculum-architecture review **83/100 (verdict B)**, architecture-closure review **97/100 (verdict A)**, consolidated manuscript review **97/100 (verdict B)**, manuscript-closure review **95.5/100 (verdict A)**, and Final Quality Gate **97/100 (verdict A)**. The three 97/100 results are unrelated reviews measuring different things at different lifecycle stages and must not be collapsed.
- The six residual non-blocking P3 observations are carried forward unchanged and are **not** closed: AI contribution modes not enumerated; Option C elaboration; opener clusters; Chapter 12 table density; the zero-footnote position in Chapters 11–12; and Chapter 5 density slightly above guidance.
- Source-verification controls are carried forward honestly and unchanged: Parnas & Clements, Edmondson, Kaner & Bond, Conway, and DORA are primary-verified, with DORA re-verified as current at Release Candidate time and remaining time-sensitive; Westrum, SPACE, Collins/Brown/Newman, and Rogers remain metadata- or abstract-verified with claims narrowed accordingly. Part XI's ISO/IEC 25010:2023 and ISO/IEC/IEEE 42010:2022 purchased-copy limitation remains open and unrelated to Part XII.
- The Atlas Commerce Organisational Decision Simulator; evidence-translation, ownership-and-escalation, culture-claim and measurement-hazard, and practice-change laboratories; ownership, escalation, and structure diagrams; worked artefact examples and blank templates; and synthetic organisational datasets remain deferred recommended Pass 2 enrichment.

**Outcome:** Part XII is released and **v0.15.0 is the latest stable release**. All twelve handbook parts are now complete and released. `v0.16.0 — First Edition Review` remains **planned**; no First Edition Review planning, finding, scorecard, branch, chapter change, or release metadata is represented as started, and Part XIII has not started. Pass 2 enrichment remains deferred.

**Status:** Released

**Last Updated:** 2026-08-15

---

## 2026-08-16 — v0.16.0 First Edition Review Architecture Accepted

- **Phase C4 — Final Focused Quantitative Architecture Re-Acceptance completed: 95.0/100, verdict A, Architecture Blockers = 0.** The review architecture for `v0.16.0 — First Edition Review` is accepted.
- Independent evidence: a classifier implemented fresh from the accepted plan's committed classification rules reproduced **all 36 quantitative census figures exactly** — Tier 1 **1,213**, Tier 2 **1,511**, code-fence **186**, **651,161** words, all twelve Part metrics and all seven Tier-1 class totals.
- The authoritative methodology is `docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md`. It complements `docs/01-editorial/QUALITY_GATES.md`, which remains the standing quality-gate authority; the plan does not replace or displace it.
- Preceded by five earlier architecture review events, which remain distinct: independent architecture review **80/100 (B)**, focused re-acceptance **89.5/100 (B)**, focused re-acceptance **89.0/100 (B)**, and the targeted correction passes between them.
- **Phase E — Governance Remediation Gate began after acceptance.** Its diagnostic returned **A — governance diagnosis complete; targeted remediation authorisable**, identifying exactly one Class-B Review-Execution Blocker: **E-02 — the accepted review architecture lacked governance discoverability**. Thirteen further findings (one P0 publication blocker, two P2, ten P3) were recorded as non-blocking or owner-decision items.
- **Phase E-A is the targeted remediation for E-02**, integrating the accepted review authority into `README.md` and `CURRENT_SPRINT.md` and recording its acceptance here.

**Outcome:** The v0.16.0 First Edition Review architecture is accepted and discoverable from repository governance. **Phase F — the edition-wide manuscript review — has not started**; no manuscript finding, verification ledger or review-event log exists. **v0.16.0 remains unreleased and v0.15.0 remains the latest stable release.** All 137 chapters are unmodified.

**Status:** Architecture accepted; Phase E governance remediation active

**Last Updated:** 2026-08-16

---

## 2026-08-16 — Phase E Governance Remediation Gate Complete

This entry is the **Governance Remediation Record** required by `docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md` §3 (Phase E exit) and §12. It records the disposition of every Phase E item. It is a new dated record: **no historical entry in this log has been rewritten.**

### Remediation batches

- **E-A** — closed **E-02** (review-authority discoverability) by integrating the accepted review authority into `README.md` and `CURRENT_SPRINT.md`. Independently verified against all eight closure conditions.
- **E-B** — closed **E-03**, **E-04** and **E-15**, normalising First Edition lifecycle state and correcting the duplicated, out-of-order `[0.4.0]` CHANGELOG heading named in review plan §12.1.
- **E-D** — closed **E-10** by establishing the **Lifecycle State Consistency Sweep** in `docs/00-project/RELEASE_POLICY.md` (v1.1), a prospective control defining the trigger, governed surfaces, mutable-versus-historical distinction, eleven minimum consistency questions, owner, and lightweight evidence expectation.
- **E-C/E-E** — dispositioned every remaining finding. **Open Class-B Review-Execution Blockers: 0.**

### Accepted items

Each record carries all seven fields required by review plan §12.2.

| Item | Accountable owner | Rationale | Consequence accepted | Revision trigger | Blocker class | Severity | Review event |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **E-05** — seven empty files in `docs/01-editorial/` (`CITATION_STYLE`, `DIAGRAM_GUIDELINES`, `EDITORIAL_STYLE_GUIDE`, `GLOSSARY_GUIDELINES`, `REFERENCES`, `RESEARCH_GUIDELINES`, `WRITING_GUIDELINES`) retained unpopulated | Project Founder | No review level or gate depends on any of them. The review plan names only `docs/00-project/EDITORIAL_STYLE_GUIDE.md`, `templates/CHAPTER_TEMPLATE.md` and `docs/01-editorial/QUALITY_GATES.md` as editorial authorities, and cites none of these seven | Empty files remain visible in the repository tree and may suggest planned standards that do not exist | A review level, gate or manuscript reference comes to depend on any one of them | C | P3 | Phase E-C/E-E, 2026-08-16 |
| **E-06** — `docs/00-project/REPOSITORY_STRUCTURE.md` retained empty | Project Founder | Zero inbound references repository-wide. Its subject is already delivered by `README.md` §Repository Structure and `docs/00-project/ARCHITECTURE.md` §Repository Architecture | An empty file remains in the governance directory | The file acquires an inbound dependency, or repository structure ceases to be documented elsewhere | C | P3 | Phase E-C/E-E, 2026-08-16 |
| **E-07** — `docs/00-project/LEARNING_FRAMEWORK.md` retained empty, and the 2026-08-07 log entry retained unmodified | Project Founder | Git history establishes the file was created empty as `CURRICULUM_FRAMEWORK.md` (`b75e77b`), renamed to `LEARNING_FRAMEWORK.md` (`c2f1822`) with zero content change, and has been 0 bytes throughout. No content was ever lost. The learning-design subject matter is delivered by `BOOK_BLUEPRINT.md` (Educational Philosophy, Learning Outcomes), `ARCHITECTURE.md` Layer 3, and `QA_TO_QE_TRANSITION_FRAMEWORK.md` | The 2026-08-07 entry's bullet *"Developed and merged `LEARNING_FRAMEWORK.md`"* is inaccurate for that one file and is left in place as a point-in-time record | Owner elects to populate or remove the file, or to annotate the historical entry | C | P3 | Phase E-C/E-E, 2026-08-16 |
| **E-09** — `v0.2.0` retained as the only lightweight tag | Project Founder | The tag resolves unambiguously to a single commit (`1c63f61d`). All twelve later tags are annotated. No release ambiguity, commit ambiguity, history corruption or review-execution risk was found | Tag-type inconsistency persists across release history | Release provenance becomes ambiguous, or publication requires uniform annotated or signed tags | C | P3 | Phase E-C/E-E, 2026-08-16 |
| **E-12** — Part I chapters retained at `Status: Technical Review Ready` | Project Founder | Both review plan §14 hypotheses were tested against the mandated reconciliation set. The status was authored at first commit (`cf13885`) and never changed, so it is historically legitimate and not a false promotion. **H2 is the better-supported reading**: `QUALITY_GATES.md` places *Technical Review* after *Draft*, `CHAPTER_TEMPLATE.md` mandates `Draft`, Parts II–XII all use `Draft`, and Part I's README records no Final Quality Gate — so Part I asserts greater maturity than Parts with gate evidence | Part I carries a stronger maturity claim than any gated Part, an inversion the edition should not publish uncorrected | Phase F Level 1 evidence shows status semantics materially impair edition-level assessment, or Level 13 requires uniform status before release | C | P3 | Phase E-C/E-E, 2026-08-16 |
| **E-14 / N-03** — `Status: Draft` retained on `EDITORIAL_STYLE_GUIDE.md`, `VERSIONING.md`, `ARCHITECTURE.md`, `BOOK_BLUEPRINT.md` and `MQE-BOK.md` | Project Founder | This is a consistent authored-state convention across five M1 documents, not a per-file slip. No authority ambiguity results for Phase F: review plan §9 names `docs/00-project/EDITORIAL_STYLE_GUIDE.md` as an existing standard for Level 11 regardless of its status field, and `VERSIONING.md` has governed thirteen releases in practice | Five operationally authoritative documents continue to describe themselves as Draft | Owner activates governance-document status (see owner-decision register), or a review level's exit criterion turns on a document's declared status | C | P3 | Phase E-C/E-E, 2026-08-16 |
| **N-01 / N-02** — `Project Phase: M1 – Governance` retained in governance front matter | Project Founder | The accepted review architecture rules on this directly: plan §12.1 **gov-P3-6** states the `Project Phase` header is a **document-provenance field and is not in scope**. Repository evidence confirms the convention — `QUALITY_GATES.md` was authored with `M2` at first commit (`e264b9f`) and its 1.0→1.1 revision did not touch the field | Front-matter phase values differ across documents and can be misread as current-state metadata | The repository redefines the field as current-state metadata | C | P3 | Phase E-C/E-E, 2026-08-16 |

### Deferred items

| Item | Reason for deferral | Destination | Trigger | Blocker effect |
| --- | --- | --- | --- | --- |
| **E-11** — `MQE-BOK.md` Domain 12 (eight topics) versus `BOOK_BLUEPRINT.md` Part XII (six topics) | The accepted architecture already governs this. Review plan **Level 2** requires coverage to be assessed against **both** documents with the divergence recorded as a Level 2 finding, and plan §14 open question 4 routes the authority question to Level 2 / owner. `book/part-12-engineering-leadership/README.md` already documents the divergence in full and designates `MQE-BOK.md` authoritative for domain coverage, with every Domain 12 topic mapped to a chapter home | Phase F Level 2 | Phase F Level 2 execution | **Not Class B.** Reviewers can determine what Part XII is intended to be from the Part XII README's Domain 12 mapping |
| **E-13** — no authoritative accessibility policy | Review plan §10 anticipates this exact gap: L11 performs objective accessibility checks across all 137 chapters (heading-order integrity, table-header presence, descriptive link text, image alt-text presence) as a named minimum, while judgement-dependent accessibility is explicitly out of scope while no standard exists. **This entry records the standard-gap disposition** that plan §7 scoring category 8 requires | v1.0.0 publication preparation | Publication preparation for v1.0.0, or a decision to score judgement-dependent accessibility | None for Phase F. Phase F has sufficient objective checks and an explicit scope boundary |
| **gov-P3-5 (Parts I–IX)** — Part README lifecycle-state drift | Plan §14 open question 7 records that the drift pattern is confirmed in Parts X, XI and XII only and that Parts I–IX are unassessed. Parts X–XII were normalised in `6385c29` and `0349176`. Assessing and correcting nine further Part READMEs is outside this task's authorised edit scope, and plan risk **R-11** makes churn minimisation an explicit Phase E exit constraint | Phase F Level 1 | Phase F Level 1 repository and governance integrity assessment | None. The E-D Lifecycle State Consistency Sweep now governs Part README current-state surfaces prospectively |

### Owner decisions required

| Item | Exact decision required | Required before | Current blocker effect |
| --- | --- | --- | --- |
| **E-08** — milestone-model divergence | Which milestone model is canonical. `ROADMAP.md` defines a seven-phase model (M3 Practical Laboratories, M4 Digital Learning Platform, M5 Video Masterclass, M6 Certification, M7 Community); `README.md` defines a five-phase model (M3 Digital Learning Platform, M4 Learning Ecosystem). **The two disagree at M3 and M4.** Separately, whether `ROADMAP.md` should mark M1 complete and M2 active — plan gov-P3-6 requires that any assertion about milestone completion be an explicit owner decision, never an automatic textual correction | v1.0.0 publication planning | None for Phase F. M1 is evidenced complete by this log, `README.md` and `CURRENT_SPRINT.md`; M2 is evidenced active. `v0.16.0` sits within M2 — Handbook Development, and no repository evidence supports inventing a new milestone |
| **E-05 / E-06** — empty-file removal | Whether to delete the seven empty `docs/01-editorial/` files and `REPOSITORY_STRUCTURE.md`, or retain them as declared placeholders. Under review plan §9 objective tests, `docs/01-editorial/EDITORIAL_STYLE_GUIDE.md` is **class B** (duplicates the populated `docs/00-project/EDITORIAL_STYLE_GUIDE.md` by name and scope); the other six are **class D** (no level, gate, manuscript or governance reference depends on them); `REPOSITORY_STRUCTURE.md` is **class C** (subject covered elsewhere). Deletion is a repository-structure decision and is therefore recommended, not executed | v1.0.0 publication preparation | None |
| **E-14 / N-03** — governance-document status | Whether to activate the five M1 documents still carrying `Status: Draft`, as a batch rather than individually | v1.0.0 publication preparation | None |
| **Plan §14 open question 2** — historical tags | Whether the absence of `v0.1.0` and `v0.3.0` tags is intentional or an omission. `VERSIONING.md` and `ROADMAP.md` list both as release milestones; `README.md` records v0.1.0 as Released and v0.3.0 as an internal milestone. Tags are not to be reconstructed | v1.0.0 publication preparation | None. Release provenance for every tagged release remains unambiguous |

### Publication blockers

| Item | Gate blocked | Explicit status |
| --- | --- | --- |
| **E-01** — `LICENSE` is empty (0 bytes since `b02fa05`) and no licence is declared anywhere in the repository; the five `package.json` files carry no `license` field | **v1.0.0 First Edition Published** | Accepted for **continuation of the v0.16.0 review**. **NOT closed for publication. Remains a publication blocker.** It does **not** block Phase F and does **not** block v0.16.0 review completion. Requires an owner legal decision; no licence has been selected or written by this task. Owner: Project Founder. Severity: P0. Blocker class: D |

### Corrections recorded forward

Consistent with the Lifecycle State Consistency Sweep established in `RELEASE_POLICY.md`, the following verified facts are recorded here rather than by editing historical entries:

- **`LEARNING_FRAMEWORK.md` was never populated.** The 2026-08-07 M1 deliverables list states *"Developed and merged `LEARNING_FRAMEWORK.md`"*. That file has been 0 bytes for its entire history. Every other document in that list is populated. The historical entry is preserved unmodified as a point-in-time record.
- **The `docs/01-editorial/` placeholder count is seven, not six** — the earlier Phase E diagnostic under-counted by omitting the duplicate `docs/01-editorial/EDITORIAL_STYLE_GUIDE.md`.
- **`Project Phase` front matter is a provenance field**, per plan gov-P3-6 and the `QUALITY_GATES.md` authoring evidence. The Phase E-D report's characterisation of these values as stale current-state metadata was incorrect and is superseded by this record.

### Phase E closure

All fifteen Phase E closure conditions pass. **E-02, E-03, E-04, E-10 and E-15 remain CLOSED. Open Class-B Review-Execution Blockers: 0.** Every remaining finding carries an explicit disposition with the fields review plan §12.2 requires. The accepted review architecture is unchanged: `docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md` remains at blob `a5385197a1b4b0e0e9323c5d1e6050f887acf389`, and the census figures — Tier 1 **1,213**, Tier 2 **1,511**, code-fence **186**, **651,161** words — are untouched.

**Outcome:** **Phase E — Governance Remediation Gate is COMPLETE.** **Phase F — the edition-wide Two-Axis Review — is READY FOR SEPARATE AUTHORISATION and has NOT started.** No manuscript finding, verification ledger, scorecard or review-event log exists, and none is authorized by this record. No chapter was modified: **137 chapters remain — 127 `Draft`, 10 `Technical Review Ready`.** **`v0.16.0` remains planned and unreleased; `v0.15.0` remains the latest stable release.**

**Status:** Phase E complete; Phase F ready for separate authorisation

**Last Updated:** 2026-08-16

---

## 2026-08-16 — Phase F0: First Edition Review Initiation

- **Phase F is INITIATED. Phase F substantive manuscript review has NOT started.** F0 establishes the controlled execution environment required before edition-wide review begins; it is an **unscored initiation event**, recorded as `FE-EV-001` in `docs/02-first-edition-review/FIRST_EDITION_REVIEW_LOG.md`.
- **Prerequisite satisfied.** Phase E — Governance Remediation Gate is COMPLETE (commit `d341a84`), with every item CLOSED or validly ACCEPTED under review plan §12.2 and **Open Class-B Review-Execution Blockers: 0**.
- **Review-execution baseline recorded.** Branch `feature/first-edition-review`, HEAD `d341a84925ba1344ffb81f0732931c663b1b88b1`, tree `84b165d67fb70db6b3279d513576a20b5a777fea`, 12 Parts, **137 chapters — 127 `Draft`, 10 `Technical Review Ready`**, manifest digest `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411`. A deterministic 137-row manifest recording each chapter's Part, number, title, path, status and Git blob SHA is embedded in the review log for manuscript-mutation detection. **This is the Phase F review-execution baseline — not the v0.16.0 release baseline and not the v1.0.0 publication baseline.** The controlled 141-object whole-edition baseline is a Phase K activity and does not exist.
- **The three required review artefacts were created**, completing the plan §13.1 four-artefact minimum: `FIRST_EDITION_FINDINGS.md` (defects), `FIRST_EDITION_VERIFICATION_LEDGERS.md` (evidence) and `FIRST_EDITION_REVIEW_LOG.md` (events). All three are **initialised and unpopulated**.
- **The accepted architecture was reproduced, not redesigned.** Five longitudinal batches (L1 Parts I–II · L2 III–V · L3 VI–VIII · L4 IX–X · L5 XI–XII), six transversals (T1–T6, with T5 scoped to Parts III–XII), the eight-category scorecard summing to 100, the P0–P3 severity model, the A–D blocker taxonomy, and the sixteen review dimensions — thirteen numbered levels plus supporting passes 15, 16 and 19, with **levels 14, 17 and 18 absent by design** — are all carried across verbatim. Every batch chapter count, word count, Tier-1, Tier-2, code-fence and citation figure reconciles exactly with the accepted census: **Tier-1 1,213 · Tier-2 1,511 · code-fence 186 · 651,161 words · 378 citations**. **No classifier was run and no census was recomputed.**
- **A finding-ID convention was established** — `FE-<CONTEXT>-<NNN>`, where context is a longitudinal batch `L1`–`L5`, a transversal `T1`–`T6`, or a gate phase `G`/`J`. IDs are immutable, encode no mutable attribute, and resolve the plan's dual use of `L` by fixing that **`L1`–`L5` in a finding ID always denote a longitudinal batch, never a review level**.
- **Carried-forward Phase E inputs were routed to their owning levels**: **E-11** → Level 2; **gov-P3-5 (Parts I–IX)** → Level 1; **E-13** → Level 11 via T6 and Level 12 criterion 8. **E-01 (empty `LICENSE`) is recorded as class D and must not deduct from the v0.16.0 manuscript score** — it blocks v1.0.0 publication only.
- **The manuscript-mutation rule is active.** The 137 chapter blobs are the Phase F baseline; the manifest digest is re-derived and compared at the start and end of every longitudinal and transversal task. Governance and review artefacts may evolve; **manuscript chapters may not.** Review and correction remain separate: a defect found in Phase F is recorded, classified and evidenced — never silently repaired. Corrections are Phase H, and Phase H is unscored.

**Outcome:** The Phase F execution environment is established and reproducible. **0 of 137 chapters inspected · 0 of 5 longitudinal batches complete · 0 of 6 transversals complete · 0 findings · 0 ledger rows · nothing scored.** No chapter was modified and no chapter status changed. The accepted architecture, `QUALITY_GATES.md` and `RELEASE_POLICY.md` are byte-identical. **`v0.16.0` remains planned and unreleased with no tag and no release branch; `v0.15.0` remains the latest stable release.** The next authorised activity is **F-L1 — Longitudinal Batch 1, Parts I–II (22 chapters)**, under separate authorisation.

**Status:** Phase F initiated; substantive review not started

**Last Updated:** 2026-08-16

---

## 2026-08-16 — Phase F-L1: Longitudinal Review of Parts I–II

- **The First Edition Review's first substantive batch is complete.** F-L1 reviewed **Parts I–II — 22 chapters, 125,017 words, 110 citations, 23 accepted Tier-1 quantitative claims** at the **Deep** verification tier, recorded as event `FE-EV-003` in `docs/02-first-edition-review/FIRST_EDITION_REVIEW_LOG.md`. **22 / 22 chapters carry a valid six-field inspection record.** The batch is **UNSCORED** — the accepted plan defines no batch-level score, and no edition verdict exists.
- **Seven findings were recorded: P0 = 0, P1 = 1, P2 = 2, P3 = 4. Class-B Review-Execution Blockers: 0.** No manuscript content was corrected; Phase F records and evidences defects, and Phase H corrects them.
- **FE-L1-001 (P1)** — the Part II README states that the v0.5.0 Git tag and GitHub Release *"remain pending"*, but tag `v0.5.0` exists at `f71d284` dated 2026-08-09 and the CHANGELOG carries a released entry. This is a materially false current-state claim and **confirms the gov-P3-5 lifecycle-drift pattern in Part II**, previously confirmed only in Parts X–XII.
- **FE-L1-002 (P2)** — all ten Part I chapters carry `Status: Technical Review Ready`, which is **not one of the seven stages** in the authoritative model, and the Part I README records no review event supporting any post-`Draft` stage. This **trips the revision trigger recorded for Phase E finding E-12**: E-12 tested whether the status was legitimate in origin and found it was; F-L1 applies the plan's objective conformance test and it fails. Both results stand.
- **FE-L1-005 (P2)** — a classifier implemented independently from the committed §6.1/§6.2 text reproduces **all twelve Part word counts and the 651,161 total exactly** but does **not** reproduce the accepted Tier-1, Tier-2 or code-fence counts (Part I 15 vs 18; edition 1,174 vs 1,213). The Part I difference is fully explained: three accepted matches are version strings inside footnote-definition lines, which exclusion **E5 removes in full**. **Two defects in the review's own instrument were found and corrected by the reflexive validation the plan mandates** before any conclusion was drawn from it. To avoid under-verification, Level 8 verified the **union** of both classifier runs.
- **FE-L1-003, -004, -006, -007 (P3)** — six Part II footnote definitions carry no in-body citation marker; five template section headings deviate in name while their content is present; Tier-1 contamination in L1 is **26%** against the 2.1% accepted edition-wide in observation C4-1, because L1 is the sparsest batch; and the Part I README labels ten delivered chapters *"Planned Chapters"* while recording no review evidence.
- **Substantial evidence verified clean.** All 22 chapters pass the objective structural and accessibility checks — one H1 each, zero heading-order jumps, zero malformed tables, balanced fences, every local link resolving, no vague link text, no TODO markers. The image alt-text check is recorded **NOT APPLICABLE** because L1 contains no images, not `PASS`. The ISO/IEC 25010:2023 treatment is accurate across seven chapters, including the nine-characteristic count and the correct 2023 names. **ISO 9000:2026 was investigated as a suspected fabricated edition and the hypothesis was falsified** — it is the real fifth edition published May 2026, and the manuscript reproduces its genuine title change correctly. ISO/IEC/IEEE 12207:2026 and SWEBOK v4.0 also verify. All 17 genuine Tier-1 claims pass both the arithmetic and the inference verdict. **All five Part II companion projects type-check cleanly and 39 / 39 tests pass.**
- **Manuscript integrity held throughout.** The Phase F baseline digest `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411` was re-derived and matched at both the start and the end of the batch.

**Outcome:** **F-L1 is COMPLETE. 22 of 137 chapters are inspected; batches L2–L5 and transversals T1–T6 have not started.** Zero manuscript files were modified and no chapter status changed. The accepted architecture, `QUALITY_GATES.md` and `RELEASE_POLICY.md` are byte-identical. **`v0.16.0` remains planned and unreleased; `v0.15.0` remains the latest stable release.** The next authorised activity is **F-L2 — Parts III–V**, under separate authorisation, with the standing condition that **FE-L1-005 be resolved before F-L3 is authorised** or it escalates to a Class-B blocker for the three high-density batches.

**Status:** F-L1 complete; F-L2 awaiting separate authorisation

**Last Updated:** 2026-08-16

---

## 2026-08-16 — Phase F-L2: Longitudinal Review of Parts III–V

- **The First Edition Review's second batch is complete.** F-L2 reviewed **Parts III–V — 34 chapters, 177,748 words, 125 citations, 29 accepted Tier-1 claims** at the **Deep** verification tier, recorded as event `FE-EV-005`. **34 / 34 chapters carry a valid six-field inspection record; cumulative longitudinal coverage is 56 / 137.** The batch is **UNSCORED**. Both the word count and the citation count reconciled **exactly** with the accepted census at the start of the batch.
- **Five findings were recorded: P0 = 0, P1 = 1, P2 = 1, P3 = 3. Class-B Review-Execution Blockers: 0.** Three are additional instances of existing systemic groups and carry **no separate deduction** under the plan's systemic root-cause rule; two are new deducting findings. No manuscript content was corrected.
- **FE-L2-001 (P1)** — all three Part READMEs assert an unreleased state for a released Part, and two also assert that the following Part has not started: **eight false statements** in total, against tags `v0.6.0`, `v0.7.0` and `v0.8.0` that all exist and are dated 2026-08-10. This joins **FE-L1-001** in the `SYS-LIFECYCLE-DRIFT` group, **scored once**. **gov-P3-5 is now discharged for Parts I–V: drift confirmed in Parts II, III, IV and V, and absent from Part I**, which makes no lifecycle claim. Parts VI–IX remain unassessed.
- **FE-L2-002 (P2)** — the test-design technique table in Part III Chapter 4 declares four columns but supplies only three delimiter cells. Under GitHub-Flavored Markdown the block **is not recognised as a table at all** and renders as literal text. It is the only such defect in 34 chapters, and the column it breaks carries each technique's stated limitations.
- **FE-L2-003 (P3)** — the Atlas Commerce recurring case enters the edition in this batch with **three different organisational descriptors**, one per Part: a *subscription service* in Part III, a *retailer* in Part IV, an *online retailer* in Part V. Each Part is internally 100% consistent and none reconciles with the others. Classified **AMBIGUITY** under Level 15 — the facts can both hold, so it is not a contradiction — and recorded rather than forced, as the plan directs. Persona continuity is partial, with Dele spanning Parts IV and V.
- **FE-L2-004 and FE-L2-005 (P3)** — two unused footnote definitions and two non-template section headings, both in the Part III capstone. **Neither revision trigger was tripped.** The unused-footnote pattern now spans two Parts, not the three its trigger requires; and the template-naming evidence **weakens** the case for escalation, since 33 of 34 L2 chapters use the template heading and two of the three L2 capstones conform.
- **Substantial evidence verified clean.** RFC 9110 and RFC 9457 were verified at **`PRIMARY-FULL`** level against rfc-editor.org: titles, dates and author lists are exact, and the manuscript's claims — that RFC 9110 defines method idempotency, ETags and 412 Precondition Failed, that **POST has no protocol-defined idempotent property**, and that RFC 9457 defines `application/problem+json` — all align with primary text. Five further RFCs are bibliographically correct. Terminology across the batch is consistent: *oracle* is defined verbatim identically in Parts IV and V, and an apparent drift in *escaped defect* between Parts III and IV **was investigated and falsified** — Part III's own definition supplies the bridge. All 20 genuine quantitative claims pass both arithmetic and inference verdicts, including an internal-consistency check showing 1,800 of 1,842 checks satisfies the story's "most". Every declared companion-asset deferral is accurate.
- **The FE-L1-005 instrument condition was assessed, not repaired.** L2 enumerated its Tier-1 population **independently of the unresolved instrument**, adjudicating 130 over-inclusive candidates by hand: **Parts IV and V reproduced the accepted census exactly, while Part III returned 14 against 23.** The nine unaccounted items cannot be genuine claims, because the sweep was wider than the accepted pipeline and every candidate was adjudicated — so L2's substantive obligation is discharged. **This evidence strengthens the requirement to resolve FE-L1-005 before F-L3**, since hand-adjudication does not scale to the 319, 390 and 452 Tier-1 claims in the remaining batches.
- **Manuscript integrity held.** The baseline digest `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411` matched at both the start and the end of the batch.

**Outcome:** **F-L2 is COMPLETE. 56 of 137 chapters are inspected; batches L3–L5 and transversals T1–T6 have not started.** Zero manuscript files were modified and no chapter status changed. The accepted architecture, `QUALITY_GATES.md` and `RELEASE_POLICY.md` are byte-identical. **`v0.16.0` remains planned and unreleased; `v0.15.0` remains the latest stable release.** **F-L3 is not authorised**: the next separately authorised task must resolve **FE-L1-005**, and must not correct manuscript findings.

**Status:** F-L2 complete; FE-L1-005 resolution required before F-L3

**Last Updated:** 2026-08-16

---

## 2026-08-16 — Phase F-IR1: Quantitative Review-Instrument Remediation

- **This is a review-instrument correction, not a manuscript review.** No chapter was read for review, no manuscript finding was corrected, and no batch or transversal ran. Recorded as event `FE-EV-006`.
- **The trigger was FE-L1-005**, raised at F-L1 and strengthened at F-L2, where independent enumeration of Parts III–V returned **20 genuine claims against an accepted 29** — matching Parts IV and V exactly while diverging by nine in Part III. L2 remained reviewable only because 130 over-inclusive candidates could be adjudicated by hand; **L3, L4 and L5 carry 302, 379 and 449 candidates**, where that method cannot prove completeness.
- **Root cause established.** A re-implementation with each PASS-0 exclusion independently switchable was searched against the five known Part values. **No configuration reproduces them** — Part III returns 14 under the full pipeline and 22 with E5 disabled, and 23 is not reachable. **The accepted census was therefore not derivable from the accepted specification under any interpretation of its ten documented exclusions.** Three architectural ambiguities were responsible: **E5 precedence** (the governing precedence rule reads as though it constrains PASS 0, when it governs PASS 2 only), **undefined code-fence semantics** (`186` was published with no statement of what was counted), and **silent inline-code suppression**.
- **Three defects in this task's own first implementation were caught by the plan's reflexive-validation discipline and corrected before any figure was published** — a newline-collapsing mask, an E4 pattern spanning newlines that thereby defeated E5, and a `ratio` class ignoring the four-digit-year exclusion that §6.2 already stated correctly. The last is a case where the architecture was right and the implementation was wrong.
- **The correction was specification-first.** `FIRST_EDITION_REVIEW_PLAN.md` §6.1.0 fixes input population, masking discipline, E4/E5/E7 precision and the scope of the precedence rule; §6.2.1–§6.2.4 fix occurrence semantics, the code-fence population, a new measured inline-code candidate population, and the **candidate-versus-confirmed-claim distinction** that structurally resolves the finding; §6.3.1 records the canonical implementation; §6.4 recomputes the census; §6.5, §6.6, §6.9, §5.2 and §16 follow.
- **A canonical reference implementation was added at `tools/quantitative_census.py`** — Python 3, standard library only, deterministic across runs, **no hard-coded totals**, with `--detail` and `--json` audit output. A 36-case adversarial suite spanning percentages, currency, every time unit, storage, rates, ratios, clock times, standards designators, versions, dates, DOIs, URLs, footnotes, metadata rows, ports, identifiers, inline and fenced code, compound durations and repeated claims returned **35 PASS / 1 FAIL on first run and 36/36 after the ratio defect was corrected**.
- **The census was recomputed rather than preserved: Tier-1 1,169 · Tier-2 1,516 · code-fence 310 · inline-code 366**, superseding Tier-1 1,213 / Tier-2 1,511 / code-fence 186. Word counts are unchanged at **651,161** and reconcile exactly for all twelve Parts. **Every §6.6 conclusion survives** — Part IX remains the densest Part, L4 remains the densest batch with L4/L3 moving 1.60× to 1.64×, and L1/L2 remain materially sparser.
- **L1 and L2 remain valid and their records are not rewritten.** In both batches the population actually adjudicated is a **superset** of the recomputed candidate population, so every recomputed candidate has already been inspected. The one substantive addition is Part V's inline-code `47 seconds`, which L2 verified as genuine and which the corrected method now surfaces explicitly instead of discarding.
- **The architecture status changed.** §6.1–§6.4 are **CORRECTED BUT UNACCEPTED**; every other section retains its Phase C4 acceptance, and the C4 event is preserved unmodified in the review history. **FE-L1-005 is `CORRECTION APPLIED — AWAITING INDEPENDENT VERIFICATION`** — a correction event does not close its own finding.

**Outcome:** The quantitative review instrument now has a specification, an implementation and an output that are mutually reproducible. **Manuscript integrity held**: the baseline digest `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411` matched at both ends, zero chapters and zero Part READMEs were modified, and `QUALITY_GATES.md`, `RELEASE_POLICY.md` and `CHANGELOG.md` are byte-identical. **`v0.16.0` remains planned and unreleased; `v0.15.0` remains the latest stable release.** **F-L3 is NOT authorised.** The next separately authorised task is **Phase F-IR2 — Independent Quantitative Instrument Verification**.

**Status:** Instrument correction applied; independent verification required before F-L3

---

## 2026-08-17 — Phase F-IR3: Genuinely Independent Quantitative Instrument Closure Review

- **A review event, not an acceptance event, and read-only.** No tracked file was modified. Recorded as event `FE-EV-007`. **Independence satisfied**: the reviewer authored neither F-IR1 nor F-IR1B, read plan §6 before the implementation, and froze its results before opening `tools/quantitative_census.py`.
- **The substance of the F-IR1 correction was confirmed.** The canonical implementation is deterministic in all three modes — the previously reported `--detail` digest `c84fe3df…66e5` was **recomputed rather than assumed**. **All 60 Part-level census fields reproduce exactly**, and a match-level comparison on the full tuple of Part, path, line, tier, class and text with occurrence multiplicity preserved returned **2,685 rows against 2,685 rows, zero differences in either direction**. Batch aggregates and densities reproduce, E11 passes 28/28 boundary tests with its repository-wide property intact, no accepted total is hard-coded, retrospective coverage is **L1 20/20 and L2 19/19**, and the manuscript baseline was unmutated.
- **The correction failed on specification completeness.** An implementation written from the committed §6.1–§6.2 text alone returned **Tier-1 1,179 · Tier-2 1,801 · inline-code 233** against the accepted 1,169 / 1,516 / 366. The accepted figures were reachable only by searching an interpretation space against the published totals, which is not reproduction. **Eight under-specified decision points each move the census**, jointly spanning Tier-1 1,154–1,231 and Tier-2 1,459–1,795: the `thou`/`dec` word boundaries, the unit separator, ratio whitespace, the Tier-2 boundary rule, inline-code deduplication, and the E9, E10 and E12 boundary and window semantics.
- **Secondary defects found:** §6.2's class-evidence counts were still C4-era and summed to the superseded 1,213; three of §6.4's four derived ratios did not follow from its own census and one was a superseded C4 figure republished as recomputed; §6.1.1's bounded-consequence note stated a mechanism that does not occur; and the **code-fence (310) and inline-code (366) populations were reported only as counts**, so plan §6.2.4's rule that a reviewer must never discover the candidate population by hand held for two of four populations.
- **Verdict: B — PARTIALLY VERIFIED. Closure table 25 PASS · 2 PARTIAL · 3 FAIL** against 30 conditions; closure requires 30/0/0. Targeted architecture **NOT YET ACCEPTABLE**; FE-L1-005 **PARTIALLY CLOSED**; open Class-B blockers **0**; **F-L3 blocked**.

**Outcome:** The instrument works; the committed text did not yet say why. **Manuscript integrity held** — digest `ec588eaa…f150a411` matched at both ends, zero chapters and zero Part READMEs modified, `QUALITY_GATES.md` and `RELEASE_POLICY.md` byte-identical.

**Status:** Independently reviewed; specification completeness defect recorded; correction required before re-acceptance

---

## 2026-08-17 — Phase F-IR4C: Quantitative Specification Completeness & Traceability Correction

- **A correction event, scoped strictly to the F-IR3 defect set.** No classification rule was altered, no new census was produced, and the task does not accept its own correction. Recorded as event `FE-EV-008`.
- **The specification now determines the behaviour the classifier already had.** `FIRST_EDITION_REVIEW_PLAN.md` gains **§6.1.2**, formalising **E9** (word-boundary requirement and single-whitespace separator, which is what keeps `EN` from matching inside `GEN-01`), **E10** (word boundaries on both sides, with trailing punctuation and sub-second precision handled explicitly) and **E12** (the ±25 window measured **from the nearest edge of the match**, over the PASS-2 working text). It gains **§6.2.0**, defining the `NUM` numeric token, the **single-whitespace separator rule**, and the **word-boundary asymmetry** under which only `thou` and `dec` are boundary-guarded — **the rule that makes Part III 14 rather than 23**, now derivable without opening the implementation.
- **§6.2 gained a normative pattern column** for all seven Tier-1 classes and an explicit **Tier-2 rule**, `(?<![\d.,])\d{2,}(?![\d.,])`, with a predicate, a worked table and its relationship to E11. **§6.2.3** states that **PASS-4 deduplication does not apply** to the inline-code population, because that population records what E2 removed rather than competing for tier membership. **§6.1.1's bounded-consequence mechanism is corrected**: retention by E11 does not imply Tier-2 admission — a year followed by a full stop is retained by E11 and then rejected by the Tier-2 rule, reaching neither tier.
- **Stale quantitative documentation refreshed.** §6.2 Evidenced counts moved to the active census (`thou` 126→**116**, `dec` 181→**147**, sum **1,169**); §6.4's derived ratios recomputed under a stated rounding convention to **L4/L3 1.64× · L4/L5 1.38× · L4/L1 26.84× · L4/L2 40.17×** and reconciled with §6.6. §6.8 records **C4-3 as RESOLVED** (0 clock forms survive PASS 0, against 40 at C4) and **C4-1 as PARTIALLY RESOLVED and still open** — 0 millisecond fragments remain and the letter-adjacent version class is gone, but **14 of 147 `dec` candidates** are still space-separated version numbers such as `Version 4.0` and `OAuth 2.0`. Both dispositions are recorded as unintended consequences of F-IR1, **not** as something Phase C4 repaired.
- **All four candidate populations are now enumerable.** `tools/quantitative_census.py --detail` emits **3,361 rows** — 1,169 Tier-1, 1,516 Tier-2, 310 code-fence, 366 inline-code — each carrying Part, path, line, population, class and matched text; `--json` carries the same under an additive `candidates` key; the aggregate mode is unchanged. Part V's inline `47 seconds` is now directly visible in normal output.
- **The census did not change: Tier-1 1,169 · Tier-2 1,516 · code-fence 310 · inline-code 366 · words 651,161**, every Part and batch figure identical. The **Tier-1/Tier-2-only detail digest is byte-identical at `c84fe3df…66e5`**; the new complete four-population digest is `f2bbbd4b…41ec`.

**Outcome:** The specification, the implementation and the output are now mutually derivable in both directions, and no population is auditable only by importing internal functions. **Manuscript integrity held** — digest `ec588eaa…f150a411` matched at both ends, zero chapters and zero Part READMEs modified, `QUALITY_GATES.md` and `RELEASE_POLICY.md` byte-identical. **`v0.16.0` remains planned and unreleased; `v0.15.0` remains the latest stable release.** **F-L3 is NOT authorised.** The next separately authorised task is **Phase F-IR4 — Fresh Independent Quantitative Instrument Re-Acceptance**, which must be performed by an actor who authored none of F-IR1, F-IR1B or F-IR4C.

**Status:** Specification completed and candidate traceability delivered; fresh independent re-acceptance required before F-L3

---

## 2026-08-18 — Phase F-IR4V3: Independent Condition-35 Final Closure Verification

- **A verification event, read-only, and the closure of the quantitative-instrument workstream.** No tracked file was modified by the verification itself. Recorded as event `FE-EV-009`, at HEAD `250cfe7`. **Independence satisfied:** the reviewer authored no part of F-IR4F and did not rely on its arithmetic as evidence.
- **The prior chain.** **F-IR4** performed the fresh independent re-acceptance and returned **39 PASS · 0 PARTIAL · 1 FAIL**, the single failure being **Condition 35 — active quantitative documentation consistency**. **F-IR4V2** independently established that the instrument is intact, that **E9 is correct** (removing `\b` alone produces **0 Tier-2 movement**), that the **E11 total is 51**, and that the sole remaining defect was the **active E11 decomposition**. **F-IR4F** then corrected that decomposition.
- **The decomposition was re-derived, not confirmed.** The E11 population was derived from the committed manuscript through the committed pipeline and **frozen before the active documentation was opened**: **51** retained four-digit-year Tier-2 occurrences, decomposing as **43 numeric-construct occurrences across 10 distinct forms** and **8 alphanumeric-identifier occurrences across 8 distinct forms, each occurring exactly once** — **`43 + 8 = 51`**. All ten numeric multiplicities and all eight alphanumeric forms and loci reproduced exactly, and the split proved **invariant under three independent construct-boundary definitions**, so it is not an artifact of the reviewer's classification choice.
- **The CMU/SEI diagnostic reproduced**, confirming the diagnosed cause of the superseded `40 + 11` split: `CMU/SEI-2000-TR-004` appears **6 times** textually, **5** sit on E5 footnote-definition lines that PASS 0 removes in full, and **exactly 1** reaches Tier-2. The **governing property holds** — across all 137 chapters **no standalone prose year appears in Tier 1 or Tier 2**.
- **Documentation is consistent and the rules are untouched.** `43 + 8` is the **only operational split**; `49 + 2`, `48 + 3` and `40 + 11` survive solely inside superseded/historical tables. The **E11 regex, the Tier-2 regex and the E9 designator rule are byte-identical** across F-IR4F, which touched **zero E9 lines**.
- **Verdict: A — CONDITION 35 INDEPENDENTLY VERIFIED. Closure table 25 PASS · 0 FAIL.** Therefore **Phase F-IR4 is FINAL at 40 PASS · 0 PARTIAL · 0 FAIL**; **FE-L1-005 is CLOSED**; the **targeted quantitative architecture is RE-ACCEPTED (verdict A)**; **open Class-B Review-Execution Blockers = 0**.

**Outcome:** The quantitative review instrument is finished — specified, implemented, enumerable, independently re-accepted and now independently closed. **Manuscript integrity held** — digest `ec588eaa…f150a411` matched at both ends, zero chapters and zero Part READMEs modified, and `tools/quantitative_census.py`, `QUALITY_GATES.md`, `RELEASE_POLICY.md` and `CHANGELOG.md` are byte-identical. The active census is unchanged at **1,169 / 1,516 / 310 / 366 / 651,161**. **`v0.16.0` remains planned and unreleased; `v0.15.0` remains the latest stable release.** **Phase F remains IN EXECUTION at 56 of 137 chapters.**

**Status:** Quantitative instrument remediation CLOSED; F-IR4 final 40/40; FE-L1-005 CLOSED; **F-L3 technically ready for separate authorisation — NOT STARTED and NOT AUTHORISED**

**Last Updated:** 2026-08-18

---

## 2026-08-21 — Phase F Consolidation and Closure

- **Phase F — First Edition Review execution is COMPLETE.** The longitudinal axis is complete at **137/137** chapters across F-L1–F-L5. All six transversals completed their authorised scopes: T1 **137/137**, T2 **137/137**, T3's **1,516/1,516** Tier-2 population (with Tier-1 **1,169/1,169** adjudicated longitudinally), T4 **137/137** for Levels 9, 10 and 16, T5 **115/115** Atlas-scoped chapters, and T6 **137/137**.
- Consolidated the immutable 29-ID finding register without altering any historical finding. Final severity distribution is **P0 = 0 · P1 = 6 · P2 = 4 · P3 = 19**; total blocker distribution is **A = 0 · B = 0 · C = 29 · D = 0**. `FE-L1-005` remains **CLOSED / VERIFIED**; the remaining **28** findings are open Class-C Final-Gate blockers. **Open Class-B Review-Execution Blockers: 0.**
- Reconciled five systemic root-cause groups — lifecycle drift, table delimiters, template naming, orphan footnotes and Tier-1 identifiers — and ten open standalone roots. The historical `SYS-UNUSED-FOOTNOTE` label is recorded as an alias of canonical `SYS-ORPHAN-FOOTNOTE`; no finding ID, severity, provenance or historical evidence was rewritten.
- Defined the ordered Phase-H remediation backlog and its verification/parallelisation controls in `docs/02-first-edition-review/FIRST_EDITION_FINDINGS.md` §6. `FE-T6-002` authority resolution precedes template normalisation. `FE-T6-001` is the high-impact, low-effort lead manuscript workstream and may proceed in parallel with that authority work. Quantitative-instrument changes remain separately authorised work requiring independent re-acceptance.
- Re-verified the frozen 137-chapter manifest digest at closure: `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411`. No manuscript chapter or Part README changed; no finding was corrected; no release metadata, tag, branch or release was created.

**Outcome:** **A — PHASE F COMPLETE; FIRST EDITION REVIEW EXECUTION COMPLETE; READY FOR PHASE H REMEDIATION SEPARATE AUTHORISATION.** Phase H has **not** started. `v0.16.0` remains planned and unreleased; v0.15.0 remains the latest stable release.

**Status:** Phase F closed; Phase H not started

**Last Updated:** 2026-08-21
