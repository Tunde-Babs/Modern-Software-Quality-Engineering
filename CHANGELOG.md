# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Planned v0.10.0 — Cloud & DevOps Complete

#### Added

- Completed Part VII — Cloud & DevOps, Chapters 1–11, including Cloud & DevOps Quality Engineering, controlled delivery systems, environment and configuration quality, container/runtime consistency, Infrastructure-as-Code (IaC) change evidence, delivery pipelines, deployment strategies, deployment verification, recovery decisions, release readiness, operational handoff, and delivery learning.
- Added the **Cloud & DevOps Quality Strategy and Release Evidence Portfolio** capstone, including a concise Release Decision Brief.

#### Changed

- Established the Part VII QA → QE progression from validating a deployed application or pipeline result to making bounded, evidence-led delivery-system decisions about promotion, pause, recovery, and learning.
- Applied Quality Gates v1.1 to distinguish the complete manuscript from approved deferred Pass 2 enrichment.

#### Validation

- Final Part VII Quality Gate: **97/100**.
- P0/P1/P2/P3 findings: none within the approved manuscript scope.
- Markdown structure, local links, navigation, references, chapter-status consistency, and repository-scope validation passed.

#### Deferred Pass 2 Enrichment

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
