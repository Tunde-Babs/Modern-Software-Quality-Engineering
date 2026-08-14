# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Release Candidate — v0.14.0 — System Design & Architecture Complete

#### Added

- Completed Part XI — System Design & Architecture, Chapters 1–12, establishing architecture as a Quality Engineering concern: architecture-quality claims and the architecture-versus-architecture-description distinction; nine boundary types with responsibilities, cohesion, coupling, and dependency direction; communication, time, timeout-as-unknown-outcome, retries, idempotency, ordering, duplicates, and backpressure; state ownership, transactional boundaries, consistency windows, caches, reconciliation, and a bounded CAP treatment; architectural styles and decomposition as contextual trade-off sets; quality-attribute scenarios with sensitivity and trade-off points; testability, observability, operability, recoverability, and safe degradation as architecture-supplied capabilities; contracts, compatibility layers, and change impact; architecture evidence, fitness functions, and Architecture Decision Records; and evolution, migration, reversibility, and temporary architecture debt.
- Added integrated architecture decision-making across scale, security, and reliability with separated implication fields and no composite score, culminating in the **System Design & Architecture Quality Strategy and Evidence Portfolio** capstone and its **Architecture Decision Brief**, built on a 34-item identified synthetic evidence packet with deliberately conflicting signals and six independent decision axes.

#### Changed

- Established the Part XI QA → QE progression from asking whether a component works to contributing bounded architecture-quality decisions using context, claims, constraints, options, assumptions, trade-offs, failure modes, evidence, limitations, decisions, residual risk, revision triggers, and explicit ownership — without claiming ownership of the architecture decision itself.

#### Validation

- Final Part XI Quality Gate: **96/100**; P0/P1/P2 findings: none. Six residual P3 items are non-blocking.
- Preceded by an independent curriculum-architecture review at **97/100** with corrections closed, a consolidated independent manuscript review at **94/100**, and a focused P1/P2 closure review at **96/100**. These are four distinct review events; the two 96/100 results are different reviews and neither is Part VIII's separate historical 96/100 Final Quality Gate.
- All 12 chapters remain **Draft** under manuscript-status governance. Controlled manuscript baseline `7067ebb54cba199a9215363188171d2e4966ed15` is established; feature-to-`develop` integration is complete, and the current Release Candidate is under validation on `release/v0.14.0`. Every numerical example was recalculated with each displayed chain tested as written; ISO/IEC 25010:2023 terminology was verified at characteristic and subcharacteristic level; all DOI-registered citations were verified against Crossref; Markdown structure, tables, footnotes, local links, navigation, and repository-scope validation passed.
- One residual non-blocking source-verification control is carried forward: ISO/IEC 25010:2023 and ISO/IEC/IEEE 42010:2022 are paywalled and returned HTTP 403 to every access attempt, so their characteristic and subcharacteristic placements rest on consistent secondary references and the repository's already-gated Part III precedent rather than on a purchased copy.

#### Deferred Pass 2 Enrichment

- The Atlas Commerce Architecture Decision Simulator; boundary/dependency, asynchronous/consistency, architecture trade-off and evidence review, and evolution/capstone laboratories; C4/UML-style conceptual diagrams; ADR examples and architecture-evaluation worksheets; executable fitness-function and dependency-analysis examples; and standalone case-study files, datasets, or migration simulations remain recommended Pass 2 enrichment under Quality Gates v1.1. No standalone practical asset is required for the Part XI manuscript release.

## [0.13.0] — Performance & Security Engineering Complete — 2026-08-12

#### Added

- Completed Part X — Performance & Security Engineering, Chapters 1–12, establishing a shared performance-and-security evidence model across workload and threat assumptions, Little’s Law, latency distributions and percentiles, coordinated omission, capacity, saturation, queues, bottlenecks, performance regression, assets and trust boundaries, authentication, authorization, API quality, input/output/dependency trust, and the security finding and remediation lifecycle.
- Added integrated performance × security trade-off and dual-regression reasoning, culminating in the **Performance & Security Engineering Strategy and Evidence Portfolio** and its **Performance & Security Decision Brief** capstone.

#### Changed

- Established the Part X QA → QE progression from checking response-time results or security defects to making bounded performance and security engineering decisions using workloads, threats, measurement validity, evidence limitations, residual risk, and explicit ownership.

#### Validation

- Final Part X Quality Gate: **97/100**; P0/P1/P2 findings: none. The only P3 is non-blocking Gunther bibliographic polish.
- All 12 chapters remain **Draft** under manuscript-status governance. Controlled manuscript baseline `3f7391b5fd939a5dd973d25386811031f3448180` is established; the release branch was merged to `main`, annotated tag `v0.13.0` was created, and the GitHub Release was published on 2026-08-12. Numerical reasoning, defensive-security safety, source-currentness, Markdown structure, local links, navigation, and repository-scope validation passed.

#### Deferred Pass 2 Enrichment

- The Atlas Commerce Performance & Security Simulator; performance, workload-modelling, security-evidence/threat-modelling, and integrated regression/capstone labs; conceptual diagrams; synthetic datasets; executable performance examples; safe security-testing examples; and case-study files remain recommended Pass 2 enrichment under Quality Gates v1.1.

## [0.12.0] — AI Quality Engineering Complete — 2026-08-12

#### Added

- Completed Part IX — AI Quality Engineering, Chapters 1–12, covering AI system and failure boundaries; evaluation data and oracles; classical ML, generative AI, nondeterministic, robustness, and metamorphic-testing evidence; RAG quality; human and model-based evaluators; bounded agent and tool-use quality; safety, fairness, and privacy boundaries; and AI regression and production learning.
- Added the **AI Quality Strategy and Evaluation Portfolio** capstone, including its Evidence Index and AI Quality Decision Brief.

#### Changed

- Established the Part IX QA → QE progression from checking expected AI outputs to making bounded AI-quality decisions using evidence, populations, uncertainty, system boundaries, safety and fairness considerations, and explicit ownership.

#### Validation

- Final Part IX Quality Gate: **97/100**; P0/P1/P2/P3 findings: none.
- All 12 chapters remain **Draft** under manuscript-status governance. Controlled baseline `4df2b8d2409cfa0fc474cad8e1bbdbe652eb9dd5` is frozen; source-currentness, numerical reasoning, Markdown structure, local links, navigation, and repository-scope validation passed.
- Release administration completed: the approved release branch was merged to `main`, annotated tag `v0.12.0` was created, and the GitHub Release was published on 2026-08-12.

#### Deferred Pass 2 Enrichment

- The Atlas Commerce AI Evaluation Simulator, Labs 1–4, conceptual diagrams, standalone datasets, executable examples, and case-study files remain recommended Pass 2 enrichment under Quality Gates v1.1; no standalone practical asset is required for the Part IX manuscript release.

## [0.11.0] — Observability & Reliability Engineering Complete — 2026-08-12

### Added

- Completed Part VIII — Observability & Reliability Engineering, Chapters 1–11, covering operational evidence and telemetry quality, metrics, distributed tracing, observable-system design, reliability outcomes, SLIs/SLOs/error budgets, alert and incident evidence, resilience, fault injection, recovery learning, and the **Observability & Reliability Strategy and Evidence Portfolio** capstone with its Reliability Decision Brief.

### Changed

- Established the Part VIII QA → QE progression from inspecting isolated runtime signals to making bounded, evidence-led reliability decisions with explicit populations, limitations, ownership, recovery conditions, and residual risk.
- Applied Quality Gates v1.1 to distinguish the accepted manuscript from deferred Pass 2 enrichment.

### Validation

- Final Part VIII Quality Gate: **96/100**.
- P0/P1/manuscript P2 findings: none remaining. Chapters 1–11 remain **Draft** under manuscript-status governance.
- Markdown structure, local links, navigation, references, numerical reasoning, chapter status, and repository-scope validation passed.

### Deferred Pass 2 Enrichment

- The Atlas Commerce Observability & Reliability Simulator, Labs 1–3, and conceptual diagrams remain recommended Pass 2 enrichment under Quality Gates v1.1; no standalone practical asset is required for the Part VIII manuscript release.

## [0.10.0] — Cloud & DevOps Complete — 2026-08-11

### Added

- Completed Part VII — Cloud & DevOps, Chapters 1–11, including Cloud & DevOps Quality Engineering, controlled delivery systems, environment and configuration quality, container/runtime consistency, Infrastructure-as-Code (IaC) change evidence, delivery pipelines, deployment strategies, deployment verification, recovery decisions, release readiness, operational handoff, and delivery learning.
- Added the **Cloud & DevOps Quality Strategy and Release Evidence Portfolio** capstone, including a concise Release Decision Brief.

### Changed

- Established the Part VII QA → QE progression from validating a deployed application or pipeline result to making bounded, evidence-led delivery-system decisions about promotion, pause, recovery, and learning.
- Applied Quality Gates v1.1 to distinguish the complete manuscript from approved deferred Pass 2 enrichment.

### Validation

- Final Part VII Quality Gate: **97/100**.
- P0/P1/P2/P3 findings: none within the approved manuscript scope.
- Markdown structure, local links, navigation, references, chapter-status consistency, and repository-scope validation passed.

### Deferred Pass 2 Enrichment

- The Atlas Commerce Local Delivery Simulator and Labs 1–3 remain recommended Pass 2 enrichment under Quality Gates v1.1; no standalone practical asset is required for the Part VII manuscript release.

## [0.9.0] — Data Quality Engineering Complete — 2026-08-11

### Added

- Completed Part VI — Data Quality Engineering, Chapters 1–11, including decision-oriented data-quality evidence, representations, contextual dimensions, query and integrity evidence, transformations, pipeline quality, reconciliation, temporal data, contracts, lineage, provenance, ownership, analytics, reporting integrity, and production learning.
- Added the **Data Quality Strategy and Evidence Portfolio** capstone, including an Evidence Matrix and Decision Brief.

### Changed

- Established the Part VI QA → QE progression from checking data values to making bounded, decision-oriented data-quality claims with explicit evidence, limitations, ownership, and residual risk.
- Clarified Quality Gates v1.1: required practical assets must be validated, while explicitly deferred Pass 2 enrichment remains planned and is not represented as delivered.

### Validation

- Final Part VI Quality Gate: **96/100**.
- P0/P1/manuscript P2: none.
- Markdown structure, local links, references, navigation, worked-example calculations, and repository-scope validation passed.

### Known Limitations

- The Atlas Commerce Data Pipeline companion and Labs 1–3 remain deferred as recommended Pass 2 enrichment under Quality Gates v1.1.
- Part VI is a Data Quality Engineering curriculum; cloud and DevOps implementation remains in Part VII.

## [0.8.0] — Automation Engineering Complete — 2026-08-10

### Added

- Completed Part V — Automation Engineering, Chapters 1–12, the **Trustworthy Feedback Systems** curriculum.
- Added the Quality Automation System capstone and practical artifacts that develop evidence-led automation-system design.
- Added coverage of automation selection, architecture, abstractions, fixtures, test data, deterministic feedback, browser evidence, boundary composition, isolation, diagnostics, continuous feedback, sustainability, and specialized evidence.

### Changed

- Established the Part V QA → QE progression from automating checks to engineering trustworthy, proportionate, and diagnosable feedback systems.
- Normalized Part V terminology, references, cross-chapter boundaries, and navigation.

### Validation

- Final Part V Quality Gate: **98/100**.
- P0/P1/P2: none.
- Markdown structure, local links, references, navigation, and repository-scope validation passed.

### Known Limitations

- The Quality Automation System companion and Labs 1–2 remain deferred to future Pass 2 enrichment.
- Part V teaches automation-system engineering; CI/CD platform implementation remains in Part VII.

## [0.7.0] — API Quality Engineering Complete — 2026-08-10

### Added

- Completed Part IV — API Quality Engineering, Chapters 1–10.
- Added the API Quality Strategy and Evidence Portfolio capstone.
- Added practical engineering artifacts covering boundaries, semantics, contracts, state, data, identity, dependencies, reliability, change, regression, and production learning.

### Changed

- Added Part IV navigation and its QA → QE progression from endpoint checking to API-quality judgement.
- Normalized protocol/application semantics, references, and cross-chapter terminology.
- Clarified REST, `If-Match`, asynchronous completion, ordering, and related evidence semantics.

### Validation

- Final Part IV Quality Gate: **97/100**.
- P0/P1/P2/P3: none remaining.
- Markdown structure, links, references, navigation, and repository-scope validation passed.

### Known Limitations

- The deterministic companion API and two laboratories remain deferred to future Pass 2 enrichment.
- Part IV develops API-quality judgement and evidence strategy; automation-framework architecture remains in Part V.

## [0.6.0] — Software Testing Complete — 2026-08-10

### Added

- Part III — Software Testing Engineering, Chapters 1–12.
- A risk-informed testing and evidence-engineering curriculum for QA Engineers progressing into Quality Engineering.
- Practical exercises and the Risk-Informed Test Strategy and Evidence Portfolio capstone.
- Testing-strategy coverage across testability, test design, exploration, evidence boundaries, reliable feedback, distributed systems, regression, and production learning.

### Changed

- Updated project status and Part III navigation for release preparation.
- Normalized Part III terminology and references.
- Added Chapter 10's worked change-impact and regression-feedback example.
- Completed final ISO/IEC 25010:2023 terminology alignment.

### Validation

- Final Part III Quality Gate: **96/100 — Exceptional / Reference Quality**.
- No P0 or P1 findings.
- All 12 chapters validated, including Markdown structure and local links.
- Final capstone quality gate: **97/100 — High Quality**.

### Known Limitations

- Part III is a strategy-and-evidence curriculum. Companion laboratories, diagrams, case studies, and implementation-heavy assets remain intentionally deferred to a later enrichment pass; it does not provide automation frameworks, live integrations, or production tooling.

## [0.4.0] — Foundations Complete — 2026-08-08

## [0.5.0] — Programming Complete — 2026-08-09

### Part II — Programming for Quality Engineers

#### Added

- Completed Part II — Programming for Quality Engineers: a TypeScript-based Quality Engineering curriculum spanning Chapters 1–12 and the integrated Quality Engineering Toolkit capstone.
- Added four delivery companions and the capstone companion with documented TypeScript, build, executable, validation, and test workflows.
- Added deterministic tests and fixtures, practical code-reading, debugging, refactoring, collaboration, and utility-testing learning evidence across the Part II progression.

#### Changed

- Updated Part II navigation and the QA → QE programming learning progression.
- Normalized the Node.js 20+ baseline, reproducible-install guidance, and cross-platform usage guidance.
- Closed the final targeted P1 correction by aligning the Delivery 4 clean-install instruction with its committed lockfile: `npm ci`.

#### Validation

- Final Part II Quality Gate Review: **95/100 — Exceptional / Reference Quality**.
- No P0 findings; the final P1 finding is closed.
- All documented companion type checks, builds, deterministic tests, executable runs, and validation workflows passed; Delivery 4 has 13 passing tests and the capstone has 26.
- Markdown structure, local links, JSON manifests, repository hygiene, and companion consistency checks completed.

#### Known Limitations

- Part II companions are deterministic local learning utilities using fictional data; they are not production services, automation frameworks, or live integrations.

## [0.4.0] — Foundations Complete — 2026-08-08

### Part I — Foundations

#### Added

- Completed Part I — Foundations, including Chapters 1–10.
- Added eleven reusable Mermaid diagrams.
- Added Lab 1 and eight practical worksheets/workshops.
- Added three integrated Quality Engineering case studies.
- Added the QA to Quality Engineering Transition Framework.

#### Changed

- Added Part I learning-path navigation and cross-chapter links.
- Integrated diagrams, practical resources, case studies, and transition resources across the Part I learning experience.
- Completed final quality-gate corrections covering Lab 1 sequencing, Chapter 2 Engineering Perspective, and diagram readability.

#### Validation

- Final Part I Quality Gate Review: 92/100 — Excellent.
- All P1 findings closed.
- Markdown structure validated.
- Internal links validated.
- Mermaid diagrams render-validated.
- Reference and repository consistency checks completed.

#### Known Limitations

- Supporting executable code is intentionally deferred to later technical handbook parts where programming and engineering implementation are primary learning objectives.
