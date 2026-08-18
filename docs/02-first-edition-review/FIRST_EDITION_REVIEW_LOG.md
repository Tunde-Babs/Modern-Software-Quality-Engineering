# First Edition Review Log

| Field | Value |
| --- | --- |
| **Project** | Modern Software Quality Engineering (MSQE) |
| **Milestone** | v0.16.0 — First Edition Review |
| **Document type** | Review artefact 4 of 4 — **Events** |
| **Authority** | [`FIRST_EDITION_REVIEW_PLAN.md`](FIRST_EDITION_REVIEW_PLAN.md) §13.1 |
| **Lifecycle** | **Append-only, immutable** |
| **Owner** | Tunde Ajala |

> This is a **governance artefact**, not a manuscript chapter. It carries no chapter-style status.

> **Append-only.** Entries are never edited, reordered, or deleted once written. A superseded statement is corrected by a **new** entry, never by rewriting an old one.

> **Non-collapse warning (plan §13.1, R-7).** Every review event is a distinct measurement at a distinct lifecycle stage. **Identical scores never imply identical events.** Events must never be collapsed, merged, or summarised into one another.

---

## 1. How events are recorded

Each event is appended as a new `## Event <ID> — <name>` section carrying, at minimum:

| Field | Content |
| --- | --- |
| **Event ID** | `FE-EV-nnn`, assigned in strict ascending order, never reused |
| **Date** | ISO-8601 date of the event |
| **Phase** | Plan §3 lifecycle phase (E, F, G, H, I, J, K, L) |
| **Scope** | What was inspected, and its size |
| **Score / verdict** | The score and verdict, or **`UNSCORED`** where the phase is unscored (plan §3: Phase H is unscored; correction passes are **not** scored events) |
| **Independence** | The plan §11 rule satisfied, and any declared reuse with its four compensating controls |
| **Artefacts affected** | Which of the four artefacts the event wrote to |
| **Non-collapse note** | Which prior events this event must not be collapsed with |

---

## 2. Artefact register (plan §13.1)

| # | Artefact | Responsibility | Lifecycle | Exists |
| --- | --- | --- | --- | --- |
| 1 | `FIRST_EDITION_REVIEW_PLAN.md` | **Method** | Frozen after Phase C2 acceptance | **Yes** — accepted at Phase C4 |
| 2 | `FIRST_EDITION_FINDINGS.md` | **Defects** | Mutable, Phases F→J | **Yes** — initialised at F0, unpopulated |
| 3 | `FIRST_EDITION_VERIFICATION_LEDGERS.md` | **Evidence** — all verification records including passes | Populated Phase F | **Yes** — initialised at F0, unpopulated |
| 4 | `FIRST_EDITION_REVIEW_LOG.md` | **Events** | Append-only, immutable | **Yes** — this document |

---

## Event FE-EV-001 — Phase F0: First Edition Review Initiation

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-001` |
| **Date** | 2026-08-16 |
| **Phase** | F0 — execution initiation (precedes substantive Phase F review) |
| **Scope** | Establishment of the review-execution baseline and the three Phase F artefacts. **No manuscript content was reviewed.** |
| **Score / verdict** | **`UNSCORED`** — F0 is an initiation event, not a review event |
| **Independence** | No plan §11 rule is engaged. F0 produces no verdict, no score, and no finding, so no independence obligation arises. R1 is expressly preserved: **this event does not authorise Phase F substantive review.** |
| **Artefacts affected** | Created artefacts 2, 3 and 4 |
| **Non-collapse note** | F0 must not be collapsed with any Phase C architecture event, with the Phase E Governance Remediation Record, or with any future F-L or F-T review event |

### 2.1 Prerequisite satisfied

**Phase E — Governance Remediation Gate is COMPLETE.** Closure recorded in `docs/00-project/DEVELOPMENT_LOG.md` at commit `d341a84` — *docs(governance): close First Edition governance remediation*. Every Phase E item is CLOSED or validly ACCEPTED under plan §12.2. **Open Class-B Review-Execution Blockers: 0**, satisfying the plan §3 Phase E exit criterion and the plan §7.2 class-B condition that gates Phase F.

### 2.2 Governing authority

| Authority | Path | Blob SHA at F0 |
| --- | --- | --- |
| Review architecture (method) | `docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md` | `a5385197a1b4b0e0e9323c5d1e6050f887acf389` |
| Standing quality-gate authority | `docs/01-editorial/QUALITY_GATES.md` | `3915f0544d1a0eb89ab495e75e63d8324762ebb4` |
| Release governance | `docs/00-project/RELEASE_POLICY.md` | `caa01cf9a58533196ccb9c2669f76059bf6c8ca5` |

**F0 implements the accepted architecture. It does not amend it.** All three authorities are unmodified by this event.

### 2.3 Review-execution baseline identity

> **This is the PHASE F REVIEW-EXECUTION BASELINE.** It is **not** the v0.16.0 release baseline and **not** the v1.0.0 publication baseline. The controlled whole-edition baseline is the **141-object Phase K baseline** (plan §13.4), which does not yet exist. No Git tag and no release branch is created by this event.

| Property | Value |
| --- | --- |
| **Branch** | `feature/first-edition-review` |
| **HEAD commit** | `d341a84925ba1344ffb81f0732931c663b1b88b1` |
| **HEAD tree** | `84b165d67fb70db6b3279d513576a20b5a777fea` |
| **Baseline date** | 2026-08-16 |
| **Parts** | 12 (I–XII) |
| **Chapters** | **137** |
| **Chapter status distribution** | **127 `Draft`** · **10 `Technical Review Ready`** (all ten in Part I) |
| **Manifest digest** | `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411` |
| **Latest stable release** | v0.15.0 |
| **v0.16.0** | Unreleased — no tag, no release branch |

**Manifest digest definition (reproducible).** SHA-256 over the newline-terminated, path-sorted list of `<path>:<blob-sha>` for all 137 chapter files:

```text
git ls-files -s book | awk '$4 ~ /chapters\/chapter-.*\.md$/ {print $4":"$2}' | sort | shasum -a 256
```

### 2.4 Accepted quantitative census (plan §6.4 — reproduced, not recomputed)

| Measure | Value |
| --- | --- |
| Tier-1 quantitative claims | **1,213** |
| Tier-2 candidates | **1,511** |
| Code-fence numerics | **186** |
| Words | **651,161** |
| Footnote definitions | **378** across **210** distinct URLs |

> **One active census only (plan §6.5).** These figures are the plan's accepted census, reproduced verbatim. **F0 did not run a classifier and did not recompute the census.** Superseded censuses (Phase C composite, Phase D, Phase D2) must never be used operationally.

### 2.5 Chapter baseline manifest — 137 objects

Repository ordering. **Purpose: detection of manuscript mutation during Phase F.** Any divergence from a recorded blob SHA is a manuscript-mutation event under §3 of this log.

| # | Batch | Part | Ch | Title | Path | Status | Blob SHA |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | L1 | I | 1 | What Is Modern Software Quality Engineering? | `book/part-01-foundations/chapters/chapter-01-what-is-modern-software-quality-engineering.md` | Technical Review Ready | `9ff599e4764184cba3dc266f07f8709e296b1dc6` |
| 2 | L1 | I | 2 | The Evolution from QA to Quality Engineering | `book/part-01-foundations/chapters/chapter-02-the-evolution-from-qa-to-quality-engineering.md` | Technical Review Ready | `7aa866467fcdf8c08cb26bfff0a965b1a1f752c4` |
| 3 | L1 | I | 3 | Understanding Software Quality | `book/part-01-foundations/chapters/chapter-03-understanding-software-quality.md` | Technical Review Ready | `ba8c970d3dd578da729abc7a99c5efb53a6d01eb` |
| 4 | L1 | I | 4 | Quality Throughout the Software Development Lifecycle | `book/part-01-foundations/chapters/chapter-04-quality-throughout-the-sdlc.md` | Technical Review Ready | `36136c4c95c762ae41b58576c979bdfd0f98f6c9` |
| 5 | L1 | I | 5 | Shift Left, Shift Right & Shift Everywhere | `book/part-01-foundations/chapters/chapter-05-shift-left-shift-right-shift-everywhere.md` | Technical Review Ready | `d4a0c5806df8d3f7ad025e615fa4c4eeecc56e84` |
| 6 | L1 | I | 6 | Systems Thinking for Quality Engineers | `book/part-01-foundations/chapters/chapter-06-systems-thinking-for-quality-engineers.md` | Technical Review Ready | `784a49e3a4e39c5009210d1d5f21a5376a5f0df3` |
| 7 | L1 | I | 7 | Engineering Culture & DevOps Mindset | `book/part-01-foundations/chapters/chapter-07-engineering-culture-and-devops-mindset.md` | Technical Review Ready | `6ea0cf5b801bb0a8b118c71e963c009c743d4ae6` |
| 8 | L1 | I | 8 | The Modern Quality Engineer | `book/part-01-foundations/chapters/chapter-08-the-modern-quality-engineer.md` | Technical Review Ready | `adbd58f1fc413922ab7c2c112584c67783688ded` |
| 9 | L1 | I | 9 | The Modern Software Quality Engineering Framework | `book/part-01-foundations/chapters/chapter-09-the-modern-software-quality-engineering-framework.md` | Technical Review Ready | `322525584a00a70db6a8f142742cbb205d237aa4` |
| 10 | L1 | I | 10 | The Future of Quality Engineering | `book/part-01-foundations/chapters/chapter-10-the-future-of-quality-engineering.md` | Technical Review Ready | `d4d644ee2bd11a24d3efedef8245feb44f4e3d70` |
| 11 | L1 | II | 1 | Programming as a Quality Engineering Practice | `book/part-02-programming/chapters/chapter-01-programming-as-a-quality-engineering-practice.md` | Draft | `11d4df6f6057dea51d8782860639de1d063e33e5` |
| 12 | L1 | II | 2 | Essential TypeScript for Quality Engineers | `book/part-02-programming/chapters/chapter-02-essential-typescript-for-quality-engineers.md` | Draft | `6f6df0f28efdc1d858f9d5f604801f52dbd3d901` |
| 13 | L1 | II | 3 | Quality Data: Structures, JSON, and Transformations | `book/part-02-programming/chapters/chapter-03-quality-data-structures-json-and-transformations.md` | Draft | `6cdedc544e5fb52b7b2c778f2e1f418713971304` |
| 14 | L1 | II | 4 | Functions, Modules, and Composable Design | `book/part-02-programming/chapters/chapter-04-functions-modules-and-composable-design.md` | Draft | `0e6e5b215ab83de9b5a1c25fccf5bb0208accdcb` |
| 15 | L1 | II | 5 | Configuration, Files, Dependencies, and Test Data | `book/part-02-programming/chapters/chapter-05-configuration-files-dependencies-and-test-data.md` | Draft | `e5ee91e5ab21ae79db1bf102fb681ad699ba1d2a` |
| 16 | L1 | II | 6 | Asynchronous Programming for Reliable Quality Feedback | `book/part-02-programming/chapters/chapter-06-asynchronous-programming-for-reliable-quality-feedback.md` | Draft | `ad72f9a14afbd69548e07aa3823b3ba6c8e68bd7` |
| 17 | L1 | II | 7 | Error Handling and Defensive Quality Utilities | `book/part-02-programming/chapters/chapter-07-error-handling-and-defensive-quality-utilities.md` | Draft | `78ccaebc4d0f72468a4954d8fc6f38d64687b0b0` |
| 18 | L1 | II | 8 | Debugging Quality Engineering Code | `book/part-02-programming/chapters/chapter-08-debugging-quality-engineering-code.md` | Draft | `29ed5717e303fb53ce909ecb06107ce74a450c01` |
| 19 | L1 | II | 9 | Maintainable Code and Refactoring | `book/part-02-programming/chapters/chapter-09-maintainable-code-and-refactoring.md` | Draft | `6dec3c5ee1de9a8da00cd05d8e40324aa2c7a8c6` |
| 20 | L1 | II | 10 | Git, Code Review, and Collaborative Engineering | `book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md` | Draft | `cb104fd0373cfa58bc3b8d4e92cba330c237eeb0` |
| 21 | L1 | II | 11 | Testing Quality Engineering Utilities | `book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md` | Draft | `20a3d8ee426fb1da1dfb31d88b7c15dc1adab215` |
| 22 | L1 | II | 12 | Capstone: Quality Engineering Toolkit | `book/part-02-programming/chapters/chapter-12-capstone-quality-engineering-toolkit.md` | Draft | `e78503f1dfef9e3c8c434ea72d76198d329dc6bd` |
| 23 | L2 | III | 1 | Testing as Evidence Engineering | `book/part-03-software-testing/chapters/chapter-01-testing-as-evidence-engineering.md` | Draft | `61f9daadd74def04be73ac59d350fb5de76ccb92` |
| 24 | L2 | III | 2 | Risk-Informed Test Strategy | `book/part-03-software-testing/chapters/chapter-02-risk-informed-test-strategy.md` | Draft | `27d9eced97bf1f1793161e0968f2c90f048f31aa` |
| 25 | L2 | III | 3 | Requirements Analysis, Specifications, and Testability | `book/part-03-software-testing/chapters/chapter-03-requirements-analysis-specifications-and-testability.md` | Draft | `384711485b967defd5f809318fe8ad3e27333d7e` |
| 26 | L2 | III | 4 | Test Design for Efficient Evidence | `book/part-03-software-testing/chapters/chapter-04-test-design-for-efficient-evidence.md` | Draft | `c01620cdfd7fcfed24f9170370c78ba724f61798` |
| 27 | L2 | III | 5 | Exploratory Testing and Adaptive Investigation | `book/part-03-software-testing/chapters/chapter-05-exploratory-testing-and-adaptive-investigation.md` | Draft | `e0ead89be6f9f02efbb61bafafff141f48044bb5` |
| 28 | L2 | III | 6 | Test Levels, Boundaries, and Integration Evidence | `book/part-03-software-testing/chapters/chapter-06-test-levels-boundaries-and-integration-evidence.md` | Draft | `45b47e2641c045b3dca268e802f868da93bbc125` |
| 29 | L2 | III | 7 | Reliable Automated Checks: Isolation, Doubles, and Determinism | `book/part-03-software-testing/chapters/chapter-07-reliable-automated-checks-isolation-doubles-and-determinism.md` | Draft | `3884b4ca95d535bdaa5277a6128d3545ea28328f` |
| 30 | L2 | III | 8 | Functional, Quality-Attribute, and Data-Oriented Evidence | `book/part-03-software-testing/chapters/chapter-08-functional-quality-attribute-and-data-oriented-evidence.md` | Draft | `a476a3e32e9b6b99bc7f3d53ff48e635fdf47e2e` |
| 31 | L2 | III | 9 | Service, API, and Distributed-System Testing Strategy | `book/part-03-software-testing/chapters/chapter-09-service-api-and-distributed-system-testing-strategy.md` | Draft | `99ee60e3c42980912cf335e18a95a46340c567d4` |
| 32 | L2 | III | 10 | Regression Strategy, Test Selection, and Continuous Delivery Feedback | `book/part-03-software-testing/chapters/chapter-10-regression-strategy-test-selection-and-continuous-delivery-feedback.md` | Draft | `8789d18d12a7dc7ab209c4ea86de8e2c26bce8ee` |
| 33 | L2 | III | 11 | Defect Investigation, Escaped Defects, and Production Learning | `book/part-03-software-testing/chapters/chapter-11-defect-investigation-escaped-defects-and-production-learning.md` | Draft | `ac006584484fb505dffa359a8150c71ccc4d68f0` |
| 34 | L2 | III | 12 | Capstone: Risk-Informed Test Strategy and Evidence Portfolio | `book/part-03-software-testing/chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md` | Draft | `4f5c572f7ded1e5b22e58015f5223df7301bfa5e` |
| 35 | L2 | IV | 1 | API Quality Engineering: Boundaries, Outcomes, and Evidence | `book/part-04-api-engineering/chapters/chapter-01-api-quality-engineering-boundaries-outcomes-and-evidence.md` | Draft | `a37eb78f578dfe0def94daed7426b391be793979` |
| 36 | L2 | IV | 2 | Interface Semantics: HTTP, Representations, and API Styles | `book/part-04-api-engineering/chapters/chapter-02-interface-semantics-http-representations-and-api-styles.md` | Draft | `568af98ff0e04ede8ed510bedfa254fe958d9083` |
| 37 | L2 | IV | 3 | Contract Quality: Schemas, Semantics, Compatibility, and Evolution | `book/part-04-api-engineering/chapters/chapter-03-contract-quality-schemas-semantics-compatibility-and-evolution.md` | Draft | `adf58870b0c84ebd8e95f9c930e0ab7dfcbc4bcb` |
| 38 | L2 | IV | 4 | Stateful API Behaviour: Validation, Errors, Idempotency, and Concurrency | `book/part-04-api-engineering/chapters/chapter-04-stateful-api-behaviour-validation-errors-idempotency-and-concurrency.md` | Draft | `2eba05020c2fe13864de106b05de0ec7164d7ba6` |
| 39 | L2 | IV | 5 | API Data Quality: Queries, Collections, and Representational Integrity | `book/part-04-api-engineering/chapters/chapter-05-api-data-quality-queries-collections-and-representational-integrity.md` | Draft | `c46967424fc6263ade4b30568164d0800219b209` |
| 40 | L2 | IV | 6 | Identity at the API Boundary: Authentication, Authorization, and Safe Behaviour | `book/part-04-api-engineering/chapters/chapter-06-identity-at-the-boundary-authentication-authorization-and-safe-behaviour.md` | Draft | `3150773cb1d7dcb12d414b80c4bd21f95b8e8614` |
| 41 | L2 | IV | 7 | Dependent and Asynchronous APIs: Events, Webhooks, Third Parties, and Controlled Evidence | `book/part-04-api-engineering/chapters/chapter-07-dependent-and-asynchronous-apis-events-webhooks-third-parties-and-controlled-evidence.md` | Draft | `36b9dbc5008d8444a470ecd6d505163687facf0d` |
| 42 | L2 | IV | 8 | API Reliability, Diagnostics, and Performance Evidence | `book/part-04-api-engineering/chapters/chapter-08-api-reliability-diagnostics-and-performance-evidence.md` | Draft | `7bb352e6bbbb99415a02edca9eccfb9af934d2cf` |
| 43 | L2 | IV | 9 | Sustaining API Quality: Change Impact, Regression, and Production Learning | `book/part-04-api-engineering/chapters/chapter-09-sustaining-api-quality-change-impact-regression-and-production-learning.md` | Draft | `82f473e21b342e472d5672dadee2ff41351467ae` |
| 44 | L2 | IV | 10 | Capstone: API Quality Strategy and Evidence Portfolio | `book/part-04-api-engineering/chapters/chapter-10-capstone-api-quality-strategy-and-evidence-portfolio.md` | Draft | `9725be7fc1b04565f42d2054e9d263f772b32de9` |
| 45 | L2 | V | 1 | Automation Engineering: Purpose, Evidence, and Boundaries | `book/part-05-automation-engineering/chapters/chapter-01-automation-engineering-purpose-evidence-and-boundaries.md` | Draft | `6f55cf7d77b748325bc3d695a4cf874ee183776c` |
| 46 | L2 | V | 2 | Automation System Architecture and Feedback Design | `book/part-05-automation-engineering/chapters/chapter-02-automation-system-architecture-and-feedback-design.md` | Draft | `fc8915661ab55f3ddcc430c3d85839134584c9a0` |
| 47 | L2 | V | 3 | Reusable Automation Design: Abstractions, Fixtures, and Test Data | `book/part-05-automation-engineering/chapters/chapter-03-reusable-automation-design-abstractions-fixtures-and-test-data.md` | Draft | `2228eb18b652afc586ed01d22178972ac3816622` |
| 48 | L2 | V | 4 | Deterministic Automation: State, Synchronization, Dependencies, and Flakiness | `book/part-05-automation-engineering/chapters/chapter-04-deterministic-automation-state-synchronization-dependencies-and-flakiness.md` | Draft | `b766bc5499e2da9f4ff3f92d3dfc1996dc3a1e1f` |
| 49 | L2 | V | 5 | Browser Automation as an Engineering System | `book/part-05-automation-engineering/chapters/chapter-05-browser-automation-as-an-engineering-system.md` | Draft | `e38693afcb68a6cce35a70f5cb3362dee300cc9a` |
| 50 | L2 | V | 6 | Composing UI, API, Component, and Service Automation | `book/part-05-automation-engineering/chapters/chapter-06-composing-ui-api-component-and-service-automation.md` | Draft | `0e0f1650216ed031cdbf7e4c686befa6daa6c5bd` |
| 51 | L2 | V | 7 | Parallelism, Isolation, and Environment Strategy | `book/part-05-automation-engineering/chapters/chapter-07-parallelism-isolation-and-environment-strategy.md` | Draft | `99b47680f5bea8bd4263b7fb057b6db128cb3a8a` |
| 52 | L2 | V | 8 | Diagnostics, Reporting, and Failure Investigation | `book/part-05-automation-engineering/chapters/chapter-08-diagnostics-reporting-and-failure-investigation.md` | Draft | `220818e50e88fc0bb6df3021e03d677ab3aa8d3b` |
| 53 | L2 | V | 9 | Continuous Feedback: CI-Oriented Execution and Test Selection | `book/part-05-automation-engineering/chapters/chapter-09-continuous-feedback-ci-oriented-execution-and-test-selection.md` | Draft | `5c30a86b1a6ca7450e08918831eeee81c6f5feda` |
| 54 | L2 | V | 10 | Sustainable Automation: Maintenance, Debt, Governance, and Scaling | `book/part-05-automation-engineering/chapters/chapter-10-sustainable-automation-maintenance-debt-governance-and-scaling.md` | Draft | `0969271e68a8dea40b812b4716e2caa7285b59c2` |
| 55 | L2 | V | 11 | Specialized Automation Evidence: Visual, Accessibility, Cross-Browser, and Mobile | `book/part-05-automation-engineering/chapters/chapter-11-specialized-automation-evidence-visual-accessibility-cross-browser-and-mobile.md` | Draft | `d31276fcd8cba597dec4be91bf598908c4aa3de5` |
| 56 | L2 | V | 12 | Capstone: Quality Automation System | `book/part-05-automation-engineering/chapters/chapter-12-capstone-quality-automation-system.md` | Draft | `3fd07e259ba60a6fbdbc0f9628bcd7f41a5f8bca` |
| 57 | L3 | VI | 1 | Data Quality Engineering: Evidence, Meaning, and Risk | `book/part-06-data-quality-engineering/chapters/chapter-01-data-quality-engineering-evidence-meaning-and-risk.md` | Draft | `9864698623e1ef85a3d71678c719b57c092d69ab` |
| 58 | L3 | VI | 2 | Data Representations, Models, and Contextual Quality Dimensions | `book/part-06-data-quality-engineering/chapters/chapter-02-data-representations-models-and-contextual-quality-dimensions.md` | Draft | `73ce1909545ee8db3b9d9ececcdb43c1002c7f05` |
| 59 | L3 | VI | 3 | Query-Based Data Evidence, Integrity, and Relationships | `book/part-06-data-quality-engineering/chapters/chapter-03-query-based-data-evidence-integrity-and-relationships.md` | Draft | `bad5b90c3dbe4edee972c02e380c1ce076184145` |
| 60 | L3 | VI | 4 | Transformation Quality and Business Rules | `book/part-06-data-quality-engineering/chapters/chapter-04-transformation-quality-and-business-rules.md` | Draft | `57617c04c00ec573c38ba08b318168950e63b35f` |
| 61 | L3 | VI | 5 | Pipeline Quality: Ingestion, Processing, Storage, and Consumers | `book/part-06-data-quality-engineering/chapters/chapter-05-pipeline-quality-ingestion-processing-storage-and-consumers.md` | Draft | `24df82a5a67ffd0d7c0a0d1624dcd52248c9a417` |
| 62 | L3 | VI | 6 | Reconciliation and Cross-System Consistency | `book/part-06-data-quality-engineering/chapters/chapter-06-reconciliation-and-cross-system-consistency.md` | Draft | `885d7f5f481db4fbc6896ef96109d08d8fd240eb` |
| 63 | L3 | VI | 7 | Batch, Streaming, and Temporal Data Quality | `book/part-06-data-quality-engineering/chapters/chapter-07-batch-streaming-and-temporal-data-quality.md` | Draft | `362dfe532fe20982afee4725af980f497a45b5d8` |
| 64 | L3 | VI | 8 | Data Contracts, Lineage, Provenance, and Ownership | `book/part-06-data-quality-engineering/chapters/chapter-08-data-contracts-lineage-provenance-and-ownership.md` | Draft | `22a5bb4e779006a54ec4a10d7cebe40efeb01f6f` |
| 65 | L3 | VI | 9 | Analytics, Metrics, and Reporting Integrity | `book/part-06-data-quality-engineering/chapters/chapter-09-analytics-metrics-and-reporting-integrity.md` | Draft | `dc593559b45d137b6263cd956c100f8fe7b7c2a2` |
| 66 | L3 | VI | 10 | Production Data Learning, Change, and Sustainability | `book/part-06-data-quality-engineering/chapters/chapter-10-production-data-learning-change-and-sustainability.md` | Draft | `8273031f7fc26d7aac5ac5c2bbcc4c76a9598d70` |
| 67 | L3 | VI | 11 | Capstone: Data Quality Strategy and Evidence Portfolio | `book/part-06-data-quality-engineering/chapters/chapter-11-capstone-data-quality-strategy-and-evidence-portfolio.md` | Draft | `252c02d25799d97c641cefcb87a29bc65281d278` |
| 68 | L3 | VII | 1 | Cloud & DevOps Quality Engineering: Delivery Systems, Evidence, and Boundaries | `book/part-07-cloud-devops/chapters/chapter-01-cloud-devops-quality-engineering-delivery-systems-evidence-and-boundaries.md` | Draft | `553477e57471c72f10ab1c1f83d1a8f4938d05b9` |
| 69 | L3 | VII | 2 | Environment Strategy, Configuration, and Secret Boundaries | `book/part-07-cloud-devops/chapters/chapter-02-environment-strategy-configuration-and-secret-boundaries.md` | Draft | `94d059f16ca9cc5ff344613743d901e07498c2a1` |
| 70 | L3 | VII | 3 | Container Artifacts, Runtime Assumptions, and Reproducible Delivery | `book/part-07-cloud-devops/chapters/chapter-03-container-artifacts-runtime-assumptions-and-reproducible-delivery.md` | Draft | `65463bd479dfd867e68defdfe64f0ff20a33cc8f` |
| 71 | L3 | VII | 4 | Infrastructure as Code: Change Evidence, Review, and Drift | `book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md` | Draft | `b5789ea73776831f62e5d40646e9134981a65573` |
| 72 | L3 | VII | 5 | Delivery Pipelines as Quality Systems | `book/part-07-cloud-devops/chapters/chapter-05-delivery-pipelines-as-quality-systems.md` | Draft | `ec6d299e9f7f076f8160b4ce5b2c37b160a13e16` |
| 73 | L3 | VII | 6 | Deployment Strategies, Progressive Delivery, and Release Exposure | `book/part-07-cloud-devops/chapters/chapter-06-deployment-strategies-progressive-delivery-and-release-exposure.md` | Draft | `f078ef7de614ca464ebdeee932c9e5b7ec846124` |
| 74 | L3 | VII | 7 | Deployment Verification and Release Evidence | `book/part-07-cloud-devops/chapters/chapter-07-deployment-verification-and-release-evidence.md` | Draft | `8cee6c5ba40572d0ccbbfe69ff53e11aa4ea6c71` |
| 75 | L3 | VII | 8 | Rollback, Roll-Forward, and Recovery Decisions | `book/part-07-cloud-devops/chapters/chapter-08-rollback-roll-forward-and-recovery-decisions.md` | Draft | `f762586a29b5709fc8248a4d0bd78133cad1d5cf` |
| 76 | L3 | VII | 9 | Release Readiness, Promotion, and Operational Handoffs | `book/part-07-cloud-devops/chapters/chapter-09-release-readiness-promotion-and-operational-handoffs.md` | Draft | `c0988d6d0ea059a90f56d8a165230a6a59129f39` |
| 77 | L3 | VII | 10 | DevOps Collaboration, Delivery Learning, and Sustainable Change | `book/part-07-cloud-devops/chapters/chapter-10-devops-collaboration-delivery-learning-and-sustainable-change.md` | Draft | `d30ca79d807f01a1350c934f870a132c11838520` |
| 78 | L3 | VII | 11 | Capstone: Cloud & DevOps Quality Strategy and Release Evidence Portfolio | `book/part-07-cloud-devops/chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md` | Draft | `d6974f6aa14c5a05e57d6d3936a07af1176dada0` |
| 79 | L3 | VIII | 1 | Observability & Reliability Engineering: Evidence, Behaviour, and Boundaries | `book/part-08-observability-reliability/chapters/chapter-01-observability-reliability-engineering-evidence-behaviour-and-boundaries.md` | Draft | `b63fea5e0595905439a65544f7645085b8a8d813` |
| 80 | L3 | VIII | 2 | Telemetry Quality: Logs, Events, and Context | `book/part-08-observability-reliability/chapters/chapter-02-telemetry-quality-logs-events-and-context.md` | Draft | `0ac5e25e587ab9b1ea5b6b6753dea90f14f4d67f` |
| 81 | L3 | VIII | 3 | Metrics and Operational Measurement | `book/part-08-observability-reliability/chapters/chapter-03-metrics-and-operational-measurement.md` | Draft | `a8ac0ab82239732250c8cc223ab97548f8f41a7e` |
| 82 | L3 | VIII | 4 | Distributed Tracing and Cross-Service Investigation | `book/part-08-observability-reliability/chapters/chapter-04-distributed-tracing-and-cross-service-investigation.md` | Draft | `969cf50ad044024aff63592c3020657af94ddc27` |
| 83 | L3 | VIII | 5 | Designing Observable Systems for Quality Engineering | `book/part-08-observability-reliability/chapters/chapter-05-designing-observable-systems-for-quality-engineering.md` | Draft | `0e8765a43569e0aeb55a3b588c70a661aa135215` |
| 84 | L3 | VIII | 6 | Reliability, Service Behaviour, and User-Relevant Outcomes | `book/part-08-observability-reliability/chapters/chapter-06-reliability-service-behaviour-and-user-relevant-outcomes.md` | Draft | `484f40136166957f0726cfa47603c8916248b4ea` |
| 85 | L3 | VIII | 7 | SLIs, SLOs, Error Budgets, and Reliability Decisions | `book/part-08-observability-reliability/chapters/chapter-07-slis-slos-error-budgets-and-reliability-decisions.md` | Draft | `a2fe901a63c33a1146078fa95886f0670e20e7de` |
| 86 | L3 | VIII | 8 | Alert Quality, Incident Evidence, and Operational Diagnosis | `book/part-08-observability-reliability/chapters/chapter-08-alert-quality-incident-evidence-and-operational-diagnosis.md` | Draft | `4cc0a11c6625a9fb995162118bc008f86faf2d2a` |
| 87 | L3 | VIII | 9 | Resilience Patterns, Dependencies, and Failure Containment | `book/part-08-observability-reliability/chapters/chapter-09-resilience-patterns-dependencies-and-failure-containment.md` | Draft | `4dc47af0d27e2d14bb3c0ddd80abd061a4876b70` |
| 88 | L3 | VIII | 10 | Fault Injection, Recovery Evidence, and Reliability Learning | `book/part-08-observability-reliability/chapters/chapter-10-fault-injection-recovery-evidence-and-reliability-learning.md` | Draft | `9be33c74827053f997c5eeeb31baf34ba8011d4e` |
| 89 | L3 | VIII | 11 | Capstone: Observability & Reliability Strategy and Evidence Portfolio | `book/part-08-observability-reliability/chapters/chapter-11-capstone-observability-reliability-strategy-and-evidence-portfolio.md` | Draft | `be1d0c9feb1b8a992d9be648c4d01ac30fd234c4` |
| 90 | L4 | IX | 1 | AI Quality Engineering: Behaviour, Evidence, and Boundaries | `book/part-09-ai-quality-engineering/chapters/chapter-01-ai-quality-engineering-behaviour-evidence-and-boundaries.md` | Draft | `292591052d96d9508ca669743772ba6913e449ca` |
| 91 | L4 | IX | 2 | AI System Architecture and Failure Boundaries | `book/part-09-ai-quality-engineering/chapters/chapter-02-ai-system-architecture-and-failure-boundaries.md` | Draft | `0588a6945100835ec8ab76ea54744b62304013df` |
| 92 | L4 | IX | 3 | Evaluation Data, Oracles, and Experimental Design | `book/part-09-ai-quality-engineering/chapters/chapter-03-evaluation-data-oracles-and-experimental-design.md` | Draft | `c2126d3744770596987ef73dc76753abb78489fb` |
| 93 | L4 | IX | 4 | Classification, Ranking, and Predictive-Model Evaluation | `book/part-09-ai-quality-engineering/chapters/chapter-04-classification-ranking-and-predictive-model-evaluation.md` | Draft | `4abb5f22bd3c58e06064612e1df83bfd7ed975e8` |
| 94 | L4 | IX | 5 | Generative AI Evaluation: Rubrics, Factuality, and Instruction Following | `book/part-09-ai-quality-engineering/chapters/chapter-05-generative-ai-evaluation-rubrics-factuality-and-instruction-following.md` | Draft | `00dc278ec1d94c92fea918c8709263767f8a7e89` |
| 95 | L4 | IX | 6 | Robustness, Metamorphic Testing, and Adversarial Inputs | `book/part-09-ai-quality-engineering/chapters/chapter-06-robustness-metamorphic-testing-and-adversarial-inputs.md` | Draft | `14e10f95cee3c3540e44035b2a2264f20c7208b3` |
| 96 | L4 | IX | 7 | Retrieval-Augmented Generation Quality | `book/part-09-ai-quality-engineering/chapters/chapter-07-retrieval-augmented-generation-quality.md` | Draft | `314dea950fa6e8430b7d0af913d3c72be1869bf8` |
| 97 | L4 | IX | 8 | Human Evaluation and Model-Based Evaluators | `book/part-09-ai-quality-engineering/chapters/chapter-08-human-evaluation-and-model-based-evaluators.md` | Draft | `41cc23daea7beaeb175de8fb7843ecfed5480df7` |
| 98 | L4 | IX | 9 | Tool-Using and Agentic AI Systems | `book/part-09-ai-quality-engineering/chapters/chapter-09-tool-using-and-agentic-ai-systems.md` | Draft | `071fb291baebbbf601ea5ef33a0542afd0abc0da` |
| 99 | L4 | IX | 10 | Safety, Fairness, Privacy, and Responsible Quality Boundaries | `book/part-09-ai-quality-engineering/chapters/chapter-10-safety-fairness-privacy-and-responsible-quality-boundaries.md` | Draft | `cca62ff2ea597ecd1139330e900c3d2156a81a0f` |
| 100 | L4 | IX | 11 | AI Regression, Production Learning, and Change | `book/part-09-ai-quality-engineering/chapters/chapter-11-ai-regression-production-learning-and-change.md` | Draft | `f831784b46e71fce73d659205b95d6c7e077ef83` |
| 101 | L4 | IX | 12 | Capstone: AI Quality Strategy and Evaluation Portfolio | `book/part-09-ai-quality-engineering/chapters/chapter-12-capstone-ai-quality-strategy-and-evaluation-portfolio.md` | Draft | `631e8f8b58cae6c3664e14caa81e8a65fb2cc0d6` |
| 102 | L4 | X | 1 | Performance & Security Engineering: Boundaries, Evidence, and Decisions | `book/part-10-performance-security/chapters/chapter-01-performance-security-engineering-boundaries-evidence-and-decisions.md` | Draft | `2e13d963fc5a56b4a8fa339c5d134261906b61c9` |
| 103 | L4 | X | 2 | Workload, Threat, and Measurement Models | `book/part-10-performance-security/chapters/chapter-02-workload-threat-and-measurement-models.md` | Draft | `3b609546c25283f1417036c1ca3c8d12421ec784` |
| 104 | L4 | X | 3 | Latency, Throughput, Concurrency, and Performance Evidence | `book/part-10-performance-security/chapters/chapter-03-latency-throughput-concurrency-and-performance-evidence.md` | Draft | `ae00e076287ac48c229ae1c449b8833f2f34e160` |
| 105 | L4 | X | 4 | Performance Experiments: Load, Stress, Variability, and Validity | `book/part-10-performance-security/chapters/chapter-04-performance-experiments-load-stress-variability-and-validity.md` | Draft | `d852128d6a979d6d5695974fa2f6ceb8461d01a1` |
| 106 | L4 | X | 5 | Capacity, Scalability, Queues, and Bottleneck Evidence | `book/part-10-performance-security/chapters/chapter-05-capacity-scalability-queues-and-bottleneck-evidence.md` | Draft | `75c985b1742555d527b7cd0db3e9f4268e837874` |
| 107 | L4 | X | 6 | Performance Regression and Production-Evidence Handoff | `book/part-10-performance-security/chapters/chapter-06-performance-regression-and-production-evidence-handoff.md` | Draft | `6b297a3f4b99d018af287e40ca93923204fd7fb5` |
| 108 | L4 | X | 7 | Security Quality: Assets, Trust Boundaries, and Threat Models | `book/part-10-performance-security/chapters/chapter-07-security-quality-assets-trust-boundaries-and-threat-models.md` | Draft | `54f7b4994a5981f19c592779822c1e23669a7d9e` |
| 109 | L4 | X | 8 | Authentication, Authorization, Sessions, and API Boundaries | `book/part-10-performance-security/chapters/chapter-08-authentication-authorization-sessions-and-api-boundaries.md` | Draft | `a1e18ed2b14cc847fa90315ed748073aaf0dbbac` |
| 110 | L4 | X | 9 | Input, Output, Dependencies, Secrets, and Configuration Trust | `book/part-10-performance-security/chapters/chapter-09-input-output-dependencies-secrets-and-configuration-trust.md` | Draft | `b95a3acdeb3ec55f6cdfa918c2c76299c35cb735` |
| 111 | L4 | X | 10 | Security Evidence: Findings, Verification, and Residual Risk | `book/part-10-performance-security/chapters/chapter-10-security-evidence-findings-verification-and-residual-risk.md` | Draft | `65abe244cc6d2f84b6d743f43b4956442c52e14c` |
| 112 | L4 | X | 11 | Performance–Security Trade-offs, Regression, and Decision Readiness | `book/part-10-performance-security/chapters/chapter-11-performance-security-trade-offs-regression-and-decision-readiness.md` | Draft | `47f87f6744a221e10efef870a0aec2afe43b1213` |
| 113 | L4 | X | 12 | Capstone: Performance & Security Strategy and Evidence Portfolio | `book/part-10-performance-security/chapters/chapter-12-capstone-performance-security-strategy-and-evidence-portfolio.md` | Draft | `00da46f1b99de5d9a8b62ad4cefdb5b44486e977` |
| 114 | L5 | XI | 1 | System Design & Architecture as Quality Engineering | `book/part-11-system-design-architecture/chapters/chapter-01-system-design-architecture-as-quality-engineering.md` | Draft | `3519df6f6e82de9742de96fa5e898752c164ef28` |
| 115 | L5 | XI | 2 | Boundaries, Responsibilities, Coupling, and Dependencies | `book/part-11-system-design-architecture/chapters/chapter-02-boundaries-responsibilities-coupling-and-dependencies.md` | Draft | `107138bf61a0d45c2944da103269061e947dbc03` |
| 116 | L5 | XI | 3 | Communication, Time, and Failure Across Boundaries | `book/part-11-system-design-architecture/chapters/chapter-03-communication-time-and-failure-across-boundaries.md` | Draft | `503eda74a04a9f8fcb04231c79bd006aac8fb7c3` |
| 117 | L5 | XI | 4 | State Ownership, Consistency, and Transactional Boundaries | `book/part-11-system-design-architecture/chapters/chapter-04-state-ownership-consistency-and-transactional-boundaries.md` | Draft | `efb8be63376c62ad9d917c53f60a493a38b1a920` |
| 118 | L5 | XI | 5 | Architectural Styles and Decomposition Trade-offs | `book/part-11-system-design-architecture/chapters/chapter-05-architectural-styles-and-decomposition-trade-offs.md` | Draft | `874472ce1e7090822e7f6657c267c17e1859160c` |
| 119 | L5 | XI | 6 | Quality Attributes, Constraints, and Trade-off Scenarios | `book/part-11-system-design-architecture/chapters/chapter-06-quality-attributes-constraints-and-trade-off-scenarios.md` | Draft | `e3b2daa37dc56d253a73470a4ea4257c59a19138` |
| 120 | L5 | XI | 7 | Architecture for Testability, Observability, Operability, and Recovery | `book/part-11-system-design-architecture/chapters/chapter-07-architecture-for-testability-observability-operability-and-recovery.md` | Draft | `6c2dddfa11ac5fdcfedc9d0f7a34b245a4e5e772` |
| 121 | L5 | XI | 8 | Contracts, Compatibility, and Change Impact | `book/part-11-system-design-architecture/chapters/chapter-08-contracts-compatibility-and-change-impact.md` | Draft | `0e9bc5138fcb14beb48603c79af54a99ac12f476` |
| 122 | L5 | XI | 9 | Architecture Evidence, Fitness Functions, and Decision Records | `book/part-11-system-design-architecture/chapters/chapter-09-architecture-evidence-fitness-functions-and-decision-records.md` | Draft | `13aba31e7cf7eb86f4f5a2300677f836837bb336` |
| 123 | L5 | XI | 10 | Evolution, Migration, Reversibility, and Architecture Debt | `book/part-11-system-design-architecture/chapters/chapter-10-evolution-migration-reversibility-and-architecture-debt.md` | Draft | `98372b0e047fe6928e0f8c234e2f430c7052b843` |
| 124 | L5 | XI | 11 | Integrated Architecture Decisions: Scale, Security, Reliability, and Residual Risk | `book/part-11-system-design-architecture/chapters/chapter-11-integrated-architecture-decisions-scale-security-reliability-and-residual-risk.md` | Draft | `f0c53cae42f842f36ed4ba41be02543e439e301c` |
| 125 | L5 | XI | 12 | Capstone: System Design & Architecture Quality Strategy and Evidence Portfolio | `book/part-11-system-design-architecture/chapters/chapter-12-capstone-system-design-architecture-quality-strategy-and-evidence-portfolio.md` | Draft | `248ce3e817098136106468099088dddb1df8ef2b` |
| 126 | L5 | XII | 1 | Engineering Leadership as Quality Engineering | `book/part-12-engineering-leadership/chapters/chapter-01-engineering-leadership-as-quality-engineering.md` | Draft | `4e0d10a1d3201be8b4942aaade70ec456c75c3d8` |
| 127 | L5 | XII | 2 | Communicating Quality Evidence to Decision Owners | `book/part-12-engineering-leadership/chapters/chapter-02-communicating-quality-evidence-to-decision-owners.md` | Draft | `463ca77b2bc3a7ca1be118c0842bdb5c6f3c3504` |
| 128 | L5 | XII | 3 | Written Records, Technical Writing, and Organisational Memory | `book/part-12-engineering-leadership/chapters/chapter-03-written-records-technical-writing-and-organisational-memory.md` | Draft | `d3bee62ccdc1bab7514f2f4f8e07c1ffe614b9dd` |
| 129 | L5 | XII | 4 | Disagreement, Escalation, and Recording an Unheeded Concern | `book/part-12-engineering-leadership/chapters/chapter-04-disagreement-escalation-and-recording-an-unheeded-concern.md` | Draft | `cbc9ef3e7c951622417a6d7df08b7cdc405bc1c1` |
| 130 | L5 | XII | 5 | Decision Rights, Ownership Models, Governance Operating Models, and Accountability | `book/part-12-engineering-leadership/chapters/chapter-05-decision-rights-ownership-models-governance-operating-models-and-accountability.md` | Draft | `3ec7bd6ad85311f0aa056a77d9690b4f250652f4` |
| 131 | L5 | XII | 6 | Quality Culture: Claims, Evidence, and Limits | `book/part-12-engineering-leadership/chapters/chapter-06-quality-culture-claims-evidence-and-limits.md` | Draft | `76b1b0631ec23e41508154c8f3874c9bb846dfcc` |
| 132 | L5 | XII | 7 | Organisation Structure and Its Quality Consequences | `book/part-12-engineering-leadership/chapters/chapter-07-organisation-structure-and-its-quality-consequences.md` | Draft | `d2907e4b3984b81ce970de193c28ef0adbc07589` |
| 133 | L5 | XII | 8 | Mentoring and Growing Quality Reasoning in Others | `book/part-12-engineering-leadership/chapters/chapter-08-mentoring-and-growing-quality-reasoning-in-others.md` | Draft | `6d9ec8bf054684f80aa1b808e93a87c3b0530f27` |
| 134 | L5 | XII | 9 | Measuring Engineering and Quality Practice | `book/part-12-engineering-leadership/chapters/chapter-09-measuring-engineering-and-quality-practice.md` | Draft | `10e0ba36646926dc6212382b42c93e16af06cde4` |
| 135 | L5 | XII | 10 | Changing Practice: Adoption, Evidence, and Reversibility | `book/part-12-engineering-leadership/chapters/chapter-10-changing-practice-adoption-evidence-and-reversibility.md` | Draft | `d2780bccfe2a13388d3eb6e473bff170331b443c` |
| 136 | L5 | XII | 11 | Career Growth as an Evidence-Led Practice | `book/part-12-engineering-leadership/chapters/chapter-11-career-growth-as-an-evidence-led-practice.md` | Draft | `51acedc26307094ad30432e9c3f750a43cb0c0e9` |
| 137 | L5 | XII | 12 | Capstone: Quality Leadership and Career Strategy Portfolio | `book/part-12-engineering-leadership/chapters/chapter-12-capstone-quality-leadership-and-career-strategy-portfolio.md` | Draft | `01712cab922c44470a11d8232f03a0e8d77f7451` |

### 2.6 Longitudinal batch model (plan §5.2 — reproduced exactly)

Per-batch Tier-2 and code-fence figures are **summed from the plan §6.4 Part rows**; every batch total and every column total reconciles exactly with the accepted census. No new census was produced.

| Batch | Parts | Chapters | Words | Tier-1 | Tier-1/1k | Tier-2 | Code-fence | Citations | Verification tier |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **L1** | I–II — Foundations, Programming | 22 | 125,017 | 23 | 0.184 | 43 | 32 | 110 | **Deep** |
| **L2** | III–V — Testing, API, Automation | 34 | 177,748 | 29 | 0.163 | 94 | 66 | 125 | **Deep** |
| **L3** | VI–VIII — Data, Cloud/DevOps, Observability | 33 | 115,618 | 319 | 2.759 | 224 | 81 | 62 | **Deep** |
| **L4** | IX–X — AI Quality, Performance & Security | 24 | 88,258 | 390 | **4.419** | 550 | 7 | 42 | Standard, **elevated** |
| **L5** | XI–XII — Architecture, Leadership | 24 | 144,520 | 452 | 3.128 | 600 | 0 | 39 | Standard |
| | **Total** | **137** | **651,161** | **1,213** | | **1,511** | **186** | **378** | |

> **In a finding ID, `L1`–`L5` always denote a longitudinal batch, never a review level.** The plan uses `L` for both; this log fixes the convention. Review level is a separate field on every finding.

**Levels executing through the longitudinal axis (plan §5.3):** Levels 1, 2, 3, 4, and — at the gate phases — 12 and 13.

**Boundary rationale (plan §5.2).** The **VIII | IX** boundary is the evidence-maturity boundary (§13.3) and is **absolute — no batch mixes verification tiers.** Sub-boundaries follow conceptual continuity: L1 conceptual and skill base (and the Atlas-absent zone); L2 core practice; L3 systems and operational; L4 specialist quantitative; L5 synthesis and capstone.

**Per-batch entry and exit conditions:**

| Batch | Entry condition | Exit condition | Dependencies |
| --- | --- | --- | --- |
| **L1** | F0 complete; Phase E closed; separate authorisation granted | All 22 chapters inspected with valid six-field records (plan §5.4); Level 1–4 defect classes assessed; findings recorded | Level 1 carries the gov-P3-5 Parts I–IX input (§19 below) |
| **L2** | L1 complete; separate authorisation | All 34 chapters inspected with valid six-field records | none beyond L1 |
| **L3** | L2 complete; separate authorisation | All 33 chapters inspected with valid six-field records | none beyond L2 |
| **L4** | L3 complete; separate authorisation | All 24 chapters inspected with valid six-field records | none beyond L3 |
| **L5** | L4 complete; separate authorisation | All 24 chapters inspected with valid six-field records | none beyond L4 |

> **Resourcing note (plan §6.6, §6.7).** L4 receives the heaviest numerical-verification effort **because it is the densest batch**. L3 receives comparable effort **because it is the least-verified evidence tier**, not because it is equally dense. **Density controls effort and sequencing only. The correctness threshold is identical in every Part, and no Part is exempt on density grounds.**

### 2.7 Transversal model (plan §5.3 — reproduced exactly)

| ID | Transversal review | Levels | Scope | Inputs | Required evidence | Entry condition | Exit condition |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **T1** | Concepts and terminology | L5, L6 | Parts I–XII | all 137 chapters; term and concept occurrence data | Concept Consistency Matrix; Terminology Register | longitudinal coverage sufficient to supply occurrence data | every candidate concept classified with evidence; all F/G/H resolved or dispositioned; every standards claim verified or limitation-bounded |
| **T2** | Citations and sources | L7 | Parts I–XII | 378 footnote definitions across 210 URLs | Source Verification Ledger | as T1 | 100% of citations verified to a declared level; zero fabrications; every limitation explicit |
| **T3** | Numerical and analytical | L8 | Parts I–XII | 1,213 Tier-1 claims; 1,511 Tier-2 candidates triaged per chapter | Numerical Verification Ledger with **dual verdict** | as T1 | every confirmed quantitative claim recomputed with a dual verdict; zero unresolved arithmetic or inference failures |
| **T4** | QA → QE progression, dependencies, and **exercise progression** | L9, L10, **L16** | Parts I–XII | 19 capability dimensions × 12 Parts; artefact inventory; exercise census | QA → QE Progression Matrix; artefact inventory; exercise classification | as T1 | all 19 dimensions traced across all twelve Parts; every artefact classified and reconciled; **every exercise classified with both required tests applied** |
| **T5** | Recurring-case continuity and contradictions | L15, L19 | **Parts III–XII only** | Atlas occurrences; normative technical statements | continuity classification; pairwise contradiction analysis | longitudinal coverage of Parts III–XII | every Atlas dimension classified; every recurring technical subject compared pairwise |
| **T6** | Editorial consistency and formulaic repetition | L11 | Parts I–XII | all 137 chapters; `EDITORIAL_STYLE_GUIDE.md`; `CHAPTER_TEMPLATE.md` | mechanical, human and formulaic-repetition layers; accessibility subsection | as T1 | all 137 scanned; systemic patterns dispositioned |

> **T5 is scoped to Parts III–XII by evidence.** Atlas spans Parts III–XII; **Parts I–II are legitimately outside the case and their absence is not a continuity failure.** Parts I–II therefore receive **five of six** transversal reviews, which is adequate and stated.

> **Transversal completion rule (plan §5.3).** A transversal may not be recorded complete unless **every level mapped to it** has been inspected with a valid six-field record. **Completing T4 therefore requires L9, L10 and L16 each to be inspected.** Transversal completion cannot be claimed while a mapped level has never been inspected.

**Sixteen review dimensions (plan §4).** 13 primary numbered levels (1–13) **+ 3 supporting passes (15, 16, 19) = 16**. **Levels 14, 17 and 18 do not exist and must not be invented.** Supporting passes carry the same correctness threshold as numbered levels. **Any coverage structure built for only 13 dimensions is incomplete.**

### 2.8 Review state at the close of F0

| Item | State |
| --- | --- |
| Phase E | **COMPLETE** |
| Phase F | **INITIATED** |
| Phase F substantive review | **NOT STARTED** |
| Longitudinal batches complete | **0 of 5** |
| Transversals complete | **0 of 6** |
| Chapters inspected | **0 of 137** |
| Findings recorded | **0** |
| Ledger rows populated | **0** |
| Score | **none — nothing has been scored** |
| v0.16.0 | **unreleased** |

**Next authorised activity:** **F-L1 — Longitudinal Batch 1, Parts I–II (22 chapters)**, under separate authorisation. F0 does not authorise it.

---

## Event FE-EV-002 — Phase F-L1: Longitudinal Batch 1 START

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-002` |
| **Date** | 2026-08-16 |
| **Phase** | F — Two-Axis Review, longitudinal axis, batch **L1** |
| **Scope** | Parts I–II — 22 chapters — 125,017 words — 23 Tier-1 claims — 43 Tier-2 candidates — 32 code-fence numerics — 110 citations. **Deep** verification tier |
| **Score / verdict** | **START — no verdict issued at this event** |
| **Independence** | Plan §11 R1 preserved: this event does not authorise Phase G, F-L2, or any transversal. No prior Part score is an input; Part I and Part II release outcomes are evidence only, never proof |
| **Artefacts affected** | none at START |
| **Baseline digest at START** | `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411` — **matches the F0 baseline** |
| **Non-collapse note** | F-L1 must not be collapsed with F0 (`FE-EV-001`), with any Part I or Part II release gate, or with any future batch or transversal event |

**Levels executing in L1 (plan §5.3 longitudinal route):** Levels 1, 2, 3 and 4. Levels 5–11 and supporting passes 15, 16 and 19 execute through transversals T1–T6 and are **not** completed by this batch; where L1 observes evidence relevant to them, it is recorded as batch-local evidence and explicitly not claimed as transversal completion.


---

## Event FE-EV-003 — Phase F-L1: Longitudinal Batch 1 COMPLETE

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-003` |
| **Date** | 2026-08-16 |
| **Phase** | F — longitudinal batch **L1**, Parts I–II |
| **Scope** | 22 chapters · 125,017 words · 110 citations · 23 accepted Tier-1 claims · Deep verification tier |
| **Score / verdict** | **`UNSCORED`** — the accepted plan defines no batch-level score. Scoring occurs at Phase G and Phase J only. **No verdict on the edition is issued or implied.** |
| **Independence** | Plan §11 R1 preserved — this event does not authorise Phase G or F-L2. Prior Part gate outcomes (Part II's recorded 95/100) were **not** used as inputs; every conclusion was re-derived from primary evidence per §11 general independence discipline |
| **Baseline digest at START** | `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411` — matched |
| **Baseline digest at END** | `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411` — **matched; zero manuscript mutation** |
| **Chapter coverage** | **22 / 22** longitudinal, each with a valid six-field inspection record (§5.4) |
| **Findings** | **7** — P0 = 0 · **P1 = 1** · **P2 = 2** · P3 = 4. Blocker classes: A = 0 · **B = 0** · C = 7 · D = 0 |
| **Artefacts affected** | `FIRST_EDITION_FINDINGS.md` (7 findings), `FIRST_EDITION_VERIFICATION_LEDGERS.md` (all six ledgers plus coverage control), this log |
| **Non-collapse note** | F-L1 must not be collapsed with F0 (`FE-EV-001`), with `FE-EV-002` (its own START), with the Part I or Part II release gates, or with any future batch or transversal event |

### 3.1 Levels executed

| Level | Status | Basis |
| --- | --- | --- |
| **Level 1** — repository and governance integrity | **Executed** for Parts I–II | Status conformance against the §2.3 seven-stage model; Part README lifecycle-state assessment; gov-P3-5 input discharged for Parts I–II |
| **Level 2** — whole-book architecture | **Partially executed** — batch-local only | The I→II boundary, prerequisite seeding and handoffs were assessed. The **BOK-domain ↔ Part census in both directions is edition-scope** and is not completed by one batch. **E-11 was not touched** — it belongs to Part XII and is not owned by L1 |
| **Level 3** — Part architecture | **Executed** for Parts I–II | Declared architecture re-derived from the filesystem, never accepted from README self-description |
| **Level 4** — chapter integrity | **Executed** — full census, 22/22 | Structural scans; standards cross-check; internal-contradiction test; declared-sample claim reasoning; **executable verification of all five companion projects** |
| **Levels 5–11, 15, 16, 19** | **NOT executed** | These route through transversals T1–T6 (plan §5.3). Batch-local evidence is recorded in the ledgers and is explicitly **not** transversal completion |
| **Levels 12–13** | **NOT executed** | Gate phases |

### 3.2 Executable verification (Level 4, technique 5)

| Project | `tsc --noEmit` | Tests | Result |
| --- | --- | --- | --- |
| `delivery-01-quality-evidence-utilities` | exit **0** | — | runs; emits documented report shape |
| `delivery-02-reusable-quality-utilities` | exit **0** | validation suite | *"All deterministic Delivery 2 validation scenarios passed."* |
| `delivery-03-reliable-quality-utilities` | exit **0** | validation suite | *"All deterministic Delivery 3 validation scenarios passed."* |
| `delivery-04-collaborative-tested-utilities` | exit **0** | `node --test` | **13 / 13 pass** |
| `capstone-quality-engineering-toolkit` | exit **0** | `node --test` | **26 / 26 pass** |

**Totals: 5/5 clean type-checks, 39/39 tests passing.** Executed on Node v18.20.8; the Part II README documents a Node 20+ baseline, so this run does not verify the documented baseline itself — recorded as a limitation, not a defect. All build output is gitignored; no tracked file was altered.

### 3.3 Review-instrument validation (plan §6.3)

A classifier was implemented independently from the committed §6.1/§6.2 text. **Reflexive validation found two defects in the instrument itself** — a mask that collapsed newlines and an E4 link-target pattern that spanned newlines and thereby defeated E5 — **both corrected before any conclusion was drawn from it.** After correction it reproduces **all twelve Part word counts and the 651,161 total exactly**, but does **not** reproduce the accepted Tier-1, Tier-2 or code-fence counts. Recorded as **FE-L1-005**. To avoid any under-verification, Level 8 verified the **union** of the pre- and post-correction Tier-1 sets — 23 spans, a superset of both runs.

### 3.4 Deferred Phase E inputs discharged

| Input | Result |
| --- | --- |
| **gov-P3-5, Parts I–II** | **Discharged for this batch.** Drift **confirmed in Part II** (FE-L1-001) and **not present in Part I**, whose README makes no lifecycle claim at all — though it makes no review claim either (FE-L1-007). Parts III–IX remain unassessed and belong to their own batches |
| **E-12 (Part I status)** | Its recorded revision trigger is **tripped**; reopened as **FE-L1-002** on objective conformance evidence |
| **E-11** | **Not touched** — owned by Level 2 in the Part XII context, not by L1 |
| **E-01 (`LICENSE`)** | **Excluded from manuscript scoring** as required — class D, no deduction, not a Phase F concern |
| **E-13 (accessibility)** | Objective checks executed per plan §10; the image alt-text population in L1 is **zero**, recorded `NOT APPLICABLE` with reason rather than `PASS` |

### 3.5 Batch state

| Item | Value |
| --- | --- |
| L1 | **COMPLETE** |
| L2–L5 | not started |
| T1–T6 | not started |
| Chapters inspected | **22 / 137** |
| Manuscript mutations | **0** |
| Corrections applied | **0** — Phase F records; Phase H corrects |

**Next authorised activity:** **F-L2 — Longitudinal Batch 2, Parts III–V (34 chapters)**, under separate authorisation.

> **Gate condition on F-L3.** **FE-L1-005 must be resolved before F-L3 is authorised.** L2 carries 29 Tier-1 claims and remains exhaustively enumerable by inspection, as L1's 23 were; L3, L4 and L5 carry **319, 390 and 452**, which are not. If FE-L1-005 is still open when those batches are authorised, it **escalates to Class B — Review-Execution Blocker** for them.


---

## Event FE-EV-004 — Phase F-L2: Longitudinal Batch 2 START

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-004` |
| **Date** | 2026-08-16 |
| **Phase** | F — Two-Axis Review, longitudinal axis, batch **L2** |
| **Scope** | Parts III–V — Software Testing Engineering, API Quality Engineering, Automation Engineering |
| **Accepted census** | 34 chapters · 177,748 words · Tier-1 **29** · Tier-2 **94** · code-fence **66** · **125** citations · **Deep** verification tier |
| **Census reconciliation at START** | **Words 177,748 — matched exactly** (III 52,741 · IV 54,811 · V 70,196). **Citations 125 — matched exactly** (III 44 · IV 48 · V 33). Chapter count 34 — matched (12 · 10 · 12) |
| **Score / verdict** | **START — no verdict issued at this event** |
| **Independence** | Plan §11 R1 preserved — this event authorises neither Phase G nor F-L3 nor any transversal. Prior Part gate outcomes for Parts III, IV and V are **evidence only, never proof**, and are not inputs to any conclusion |
| **Baseline digest at START** | `ec588eaa1e61bd0f0fa8706f5cc3dd470b7caa67314df6f77f858425f150a411` — **matched** |
| **Standing findings relevant to execution** | **FE-L1-005** (P2, class C) remains open: the accepted Tier-1 census is not reproducible from the committed classifier text. **It does not block L2** — 29 Tier-1 claims remain exhaustively enumerable by independent inspection. L2 therefore enumerates its Tier-1 population **without relying on the unresolved instrument to prove completeness**, and reports that evidence for the pre-L3 decision. **FE-L1-001 … FE-L1-007 are standing findings and are not repaired, re-scored or re-opened by this batch** |
| **F-L3 condition** | **FE-L1-005 must be resolved before F-L3 is authorised**, or it escalates to Class B — Review-Execution Blocker for L3, L4 and L5 (319, 390 and 452 Tier-1 claims respectively) |
| **Non-collapse note** | F-L2 must not be collapsed with F0 (`FE-EV-001`), F-L1 (`FE-EV-002`, `FE-EV-003`), the Part III/IV/V release gates, or any future batch or transversal event |

**Levels executing in L2 (plan §5.3 longitudinal route, re-read and confirmed):** Levels **1, 2, 3, 4**. Levels 5–11 and supporting passes 15, 16 and 19 route through transversals T1–T6; L2 collects batch-local evidence for them and **does not mark any transversal complete**.


---

## Event FE-EV-005 — Phase F-L2: Longitudinal Batch 2 COMPLETE

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-005` |
| **Date** | 2026-08-16 |
| **Phase** | F — longitudinal batch **L2**, Parts III–V |
| **Scope** | 34 chapters · 177,748 words · 125 citations · 29 accepted Tier-1 claims · **Deep** verification tier |
| **Score / verdict** | **`UNSCORED`** — the accepted plan defines no batch-level score. Scoring occurs at Phase G and Phase J only. **No verdict on the edition is issued or implied.** |
| **Independence** | Plan §11 R1 preserved — this event authorises neither Phase G, F-L3, nor any transversal. The recorded Part III (96/100), Part IV (97/100) and Part V (98/100) gate outcomes were **not** inputs to any conclusion; every finding was re-derived from primary evidence |
| **Baseline digest at START / END** | `ec588eaa…f150a411` / `ec588eaa…f150a411` — **matched both times; zero manuscript mutation** |
| **Chapter coverage** | **34 / 34** longitudinal, each with a valid six-field record (§5.4). **Cumulative longitudinal coverage: 56 / 137** |
| **Findings** | **5 new** — P0 = 0 · **P1 = 1** · **P2 = 1** · P3 = 3. Blocker classes: A = 0 · **B = 0** · C = 5 · D = 0. **Three are non-deducting members of existing systemic groups**; new deducting findings: **2** |
| **Artefacts affected** | `FIRST_EDITION_FINDINGS.md`, `FIRST_EDITION_VERIFICATION_LEDGERS.md` (all six ledgers plus coverage control), this log |
| **Non-collapse note** | F-L2 must not be collapsed with F0, F-L1 (`FE-EV-002`/`FE-EV-003`), its own START (`FE-EV-004`), the Part III/IV/V release gates, or any future batch or transversal event |

### 5.1 Levels executed

| Level | Status |
| --- | --- |
| **Level 1** — repository and governance integrity | **Executed** for Parts III–V; gov-P3-5 discharged |
| **Level 2** — whole-book architecture | **Batch-local only** — the II→III→IV→V region assessed; the edition-scope BOK↔Part census is **not** completed by one batch. **E-11 not touched** |
| **Level 3** — Part architecture | **Executed** for Parts III–V, re-derived from the filesystem |
| **Level 4** — chapter integrity | **Executed** — full census 34/34 |
| **Levels 5–11, 15, 16, 19** | **NOT executed** — transversal-routed; batch-local evidence only |
| **Levels 12–13** | **NOT executed** — gate phases |

### 5.2 gov-P3-5 result — deferred Phase E input discharged for Parts I–V

| Part | Result |
| --- | --- |
| I | **NO CURRENT-STATE CLAIM TO ASSESS** (F-L1) |
| II | **LIFECYCLE DRIFT FOUND** — FE-L1-001 |
| III | **LIFECYCLE DRIFT FOUND** — FE-L2-001 |
| IV | **LIFECYCLE DRIFT FOUND** — FE-L2-001 |
| V | **LIFECYCLE DRIFT FOUND** — FE-L2-001 |

**Four consecutive Parts confirmed.** The systemic group `SYS-LIFECYCLE-DRIFT` now spans Parts II–V and is scored **once** at P1. Parts VI–IX remain unassessed.

### 5.3 FE-L1-005 — pre-L3 instrument evidence

L2 enumerated its Tier-1 population **without relying on the unresolved instrument**, by an over-inclusive sweep removing only fenced code — therefore capturing every numeric token in non-code prose — followed by manual adjudication of all **130 raw candidates** against the PASS-0 exclusions.

| Part | Independently enumerated | Accepted census | Agreement |
| --- | --- | --- | --- |
| III | **14** | 23 | **✗ −9** |
| IV | **2** | 2 | **✓ exact** |
| V | **4** | 4 | **✓ exact** |
| **L2** | **20** | **29** | **✗ −9** |

**Contamination observed:** version strings (`v4.0.1`, OAuth `2.0`, AsyncAPI `3.1.0`, WCAG `2.2`), URL date fragments (`2024/11`, `2016/05`, `2015/04`), a DOI (`10.6028`), and 34 metadata `Version 0.1.0` / `Estimated study time` rows. **Suppression observed: none** — no genuine quantitative teaching claim was found that the accepted pipeline would exclude.

**Why L2's substantive obligation is nevertheless discharged:** the sweep was deliberately *wider* than the accepted pipeline, so every genuine quantitative claim in Part III prose necessarily appears among the 130 candidates, and each was adjudicated. **The nine unaccounted Part III items cannot be genuine claims.** All 20 genuine claims were recomputed with dual verdicts.

> **Reproducibility assessment for the dense batches: this evidence STRENGTHENS the requirement to resolve FE-L1-005 before F-L3.** L2's method worked only because 130 candidates could be adjudicated by hand. Parts VI–VIII, IX–X and XI–XII carry **319, 390 and 452** accepted Tier-1 claims against far larger candidate pools; hand-adjudication does not scale, and an accepted count that exceeds what an independent implementation can enumerate cannot be shown complete at that scale. **FE-L1-005 was not repaired, no classifier was published, and neither the architecture nor the census was altered by this task.**

### 5.4 Batch state

| Item | Value |
| --- | --- |
| L1, L2 | **COMPLETE** |
| L3–L5 | not started |
| T1–T6 | not started |
| Chapters inspected | **56 / 137** |
| Manuscript mutations | **0** |
| Corrections applied | **0** |

**Next authorised activity:** a **separately authorised task that resolves FE-L1-005**. **F-L3 is NOT authorised while FE-L1-005 remains open**; if it is still open when F-L3 is proposed, it escalates to **Class B — Review-Execution Blocker** for L3, L4 and L5.


---

## Event FE-EV-006 — Phase F-IR1: Quantitative Review-Instrument Remediation

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-006` |
| **Date** | 2026-08-16 |
| **Phase** | F-IR1 — targeted review-instrument correction. **Not a manuscript review event** |
| **Scope** | The quantitative method only: `FIRST_EDITION_REVIEW_PLAN.md` §5.2 and §6.1–§6.9. **No chapter was read for review, no manuscript finding was corrected, and no transversal ran** |
| **Score / verdict** | **`UNSCORED` — correction event.** Per the plan's standing discipline a correction event **does not close its own finding** |
| **Trigger** | **FE-L1-005** (P2, class C), raised at F-L1 and strengthened at F-L2 |
| **Baseline digest at START / END** | `ec588eaa…f150a411` / `ec588eaa…f150a411` — **matched both times; zero manuscript mutation** |
| **Non-collapse note** | F-IR1 must not be collapsed with C4, with F-L1 or F-L2, or with the independent verification that must follow it |

### 6.1 Why the correction was required

F-L2 enumerated Parts III–V independently and returned **20 genuine claims against an accepted 29** — matching Parts IV (2) and V (4) exactly while diverging by **nine** in Part III. The divergence was neither uniform nor predictable, and L2 remained reviewable only because 130 over-inclusive candidates could be adjudicated by hand. **L3, L4 and L5 carry 302, 379 and 449 candidates**, where hand-discovery of the population cannot serve as a completeness proof.

### 6.2 Root cause

A re-implementation with each PASS-0 exclusion independently switchable was searched against the five known Part values. **No configuration reproduces them.** Three architectural ambiguities were identified — **E5 precedence**, **undefined code-fence semantics**, and **silent inline-code suppression** — and three defects in F-IR1's own first implementation were caught by reflexive validation and corrected before publication, one of them a violation of a rule §6.2 already stated correctly.

### 6.3 Correction applied

Specification first, implementation second. §6.1.0 fixes input population, masking discipline, E4/E5/E7 precision and the scope of the governing precedence rule. §6.2.1–§6.2.4 fix occurrence semantics, the code-fence population, the new inline-code candidate population, and the **candidate-versus-confirmed-claim** distinction that structurally resolves the finding. §6.3.1 records the canonical implementation **`tools/quantitative_census.py`**. §6.4 recomputes the census; §6.5 supersedes the C4-era figures; §6.6 restates the resourcing conclusions; §6.9 records the root cause; §5.2 and §16 follow.

### 6.4 Recomputed census

| | Tier-1 | Tier-2 | code-fence | inline-code | Words |
| --- | --- | --- | --- | --- | --- |
| **C4-era (superseded)** | 1,213 | 1,511 | 186 | — | 651,161 |
| **F-IR1 recomputed** | **1,169** | **1,516** | **310** | **366** | **651,161** |

Batches: L1 **20** · L2 **19** · L3 **302** · L4 **379** · L5 **449**. **Every §6.6 conclusion survives**: Part IX remains the densest Part, L4 remains the densest batch with L4/L3 moving 1.60× → 1.64×, and L1/L2 remain materially sparser.

### 6.5 Retrospective impact on L1 and L2

**Neither batch's completion is invalidated, and neither record is rewritten.** L1 verified a 23-span superset covering all 20 recomputed candidates; L2 verified 20 genuine claims from a 130-candidate over-inclusive sweep covering all 19 recomputed candidates. **In both batches the population actually adjudicated is a superset of the recomputed candidate population**, so every recomputed candidate has already been inspected. The one substantive addition is Part V's inline-code `47 seconds`, which L2 verified as a genuine claim and which the corrected method now surfaces explicitly. **FE-L1-006's contamination ratio changes basis and is noted in the register; the finding stands.**

### 6.6 Status after this event

| Item | Value |
| --- | --- |
| FE-L1-005 | **CORRECTION APPLIED — AWAITING INDEPENDENT VERIFICATION** |
| Architecture §6.1–§6.4 | **CORRECTED BUT UNACCEPTED** |
| Architecture, all other sections | Accepted at C4, unchanged |
| L1, L2 | COMPLETE, unchanged, 56/137 |
| L3, L4, L5 | not started · T1–T6 not started |
| Manuscript mutations | **0** |

**Next authorised activity:** **Phase F-IR2 — Independent Quantitative Instrument Verification.** **F-L3 remains NOT AUTHORISED** until that verification confirms FE-L1-005 resolved with no open Class-B blocker.


---

## Event FE-EV-007 — Phase F-IR3: Genuinely Independent Quantitative Instrument Closure Review

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-007` |
| **Date** | 2026-08-17 |
| **Phase** | F-IR3 — independent review of the corrected quantitative instrument. **Not a manuscript review event and not an acceptance event** |
| **Scope** | The corrected quantitative architecture only: `FIRST_EDITION_REVIEW_PLAN.md` §6.1–§6.4 and directly dependent batch, density and Level 8 mechanisms, plus `tools/quantitative_census.py`. Covers the corrections applied at **F-IR1** and at **F-IR1B**. **Read-only: no tracked file was modified.** No chapter was read for review; no transversal ran |
| **Score / verdict** | **B — PARTIALLY VERIFIED · FE-L1-005 REMAINS OPEN · F-L3 BLOCKED.** Closure table **25 PASS · 2 PARTIAL · 3 FAIL** against 30 conditions; closure requires 30/0/0 |
| **Independence** | **Satisfied.** The reviewer authored neither F-IR1 nor F-IR1B, read plan §6 before the implementation, and froze its results before opening `tools/quantitative_census.py` |
| **Baseline digest at START / END** | `ec588eaa…f150a411` / `ec588eaa…f150a411` — **matched both times; zero manuscript mutation** |
| **Non-collapse note** | F-IR3 must not be collapsed with F-IR2, which was performed by the author of the correction and is evidence rather than acceptance, nor with the F-IR4C correction that followed it, nor with the fresh re-acceptance that must still occur |

### 7.1 What was independently confirmed

| Property | Evidence |
| --- | --- |
| Canonical implementation deterministic | Three runs of each mode byte-identical; the `--detail` digest was **recomputed**, not assumed, to `c84fe3df…66e5` |
| **All 60 Part-level census fields reproduce** | Tier-1, Tier-2, code-fence, inline-code and words for Parts I–XII |
| **Match-level identity across 2,685 rows** | Full tuple comparison with occurrence multiplicity preserved: 0 canonical-only, 0 independent-only |
| Batch aggregates and densities reproduce | L1 20 · L2 19 · L3 302 · L4 379 · L5 449 |
| E11 correct | 28/28 boundary tests; fragmentation property holds; the 51 surviving years classify exactly as §6.1.1 states |
| No hard-coded totals | Every numeric literal in the tool is a specification constant |
| Retrospective coverage | **L1 20/20 · L2 19/19**, including the Part V inline `47 seconds` |

### 7.2 What failed

**The committed specification was not implementation-complete.** An implementation written from §6.1–§6.2 alone returned **Tier-1 1,179 · Tier-2 1,801 · inline-code 233**; the accepted figures were reachable only by searching an interpretation space against the published totals. **Eight under-specified decision points each move the census**, jointly spanning Tier-1 1,154–1,231 and Tier-2 1,459–1,795. Secondary defects: stale §6.2 class counts summing to the superseded 1,213; three incorrect §6.4 derived ratios, one carried over from the superseded C4 census; an incorrect §6.1.1 consequence mechanism; and **two candidate populations — code-fence 310 and inline-code 366 — reported only as counts**, so plan §6.2.4's *never by hand* rule held for two of four populations.

### 7.3 Status after this event

| Item | Value |
| --- | --- |
| FE-L1-005 | **PARTIALLY CLOSED — remains open** |
| Architecture §6.1–§6.4 | **CORRECTED BUT UNACCEPTED** — targeted re-acceptance **not** granted |
| Open Class-B blockers | **0** — FE-L1-005 is Class C and escalates only on F-L3 authorisation |
| L1, L2 | COMPLETE, unchanged, 56/137 · L3–L5 and T1–T6 not started |
| Manuscript mutations · corrections applied | **0** · **0** |

**Next authorised activity:** a **separately authorised correction task** addressing the F-IR3 defect set. **F-L3 remains NOT AUTHORISED.**


---

## Event FE-EV-008 — Phase F-IR4C: Quantitative Specification Completeness & Traceability Correction

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-008` |
| **Date** | 2026-08-17 |
| **Phase** | F-IR4C — targeted specification and traceability correction. **Not a manuscript review event** |
| **Scope** | The F-IR3 defect set only: `FIRST_EDITION_REVIEW_PLAN.md` §6.1–§6.9 and §16, and `tools/quantitative_census.py`. **No classification rule was altered and no census figure changed.** No chapter was read for review; no transversal ran |
| **Score / verdict** | **`UNSCORED` — correction event.** A correction event **does not close its own finding** and **may not accept its own architecture** |
| **Trigger** | **FE-L1-005**, via the F-IR3 independent review (`FE-EV-007`) |
| **Baseline digest at START / END** | `ec588eaa…f150a411` / `ec588eaa…f150a411` — **matched both times; zero manuscript mutation** |
| **Non-collapse note** | F-IR4C is a correction event and must not be collapsed with F-IR3, which found the defects, or with the fresh independent re-acceptance (F-IR4) that must still occur |

### 8.1 Specification completed

**§6.1.2 added** — formal definitions for **E9** (word-boundary requirement, single-whitespace separator before the first digit group, `-nnn` and `:nnnn` parts), **E10** (word boundaries on both sides, trailing punctuation and sub-second behaviour) and **E12** (window measured **±25 characters from the nearest edge of the match**, over the PASS-2 working text, case-insensitive triggers).

**§6.2.0 added** — the **`NUM` numeric token**, the **single-whitespace separator rule**, and the **word-boundary asymmetry** under which only `thou` and `dec` are boundary-guarded, with a worked case table. **This is the rule that makes Part III 14 rather than 23, and it is now derivable without opening the implementation.**

**§6.2** gained a **normative pattern column** for all seven classes and the explicit **Tier-2 rule** `(?<![\d.,])\d{2,}(?![\d.,])` with a predicate, a worked table and its relationship to E11. **§6.2.3** states that **PASS-4 deduplication does not apply** to the inline-code population, with the reason. **§6.1.1**'s bounded-consequence note is corrected: retention by E11 does **not** imply Tier-2 admission.

### 8.2 Documentation corrected

§6.2 Evidenced counts refreshed to the active census — `thou` **126 → 116**, `dec` **181 → 147**, sum **1,169**; the replaced pair summed to the superseded 1,213. §6.4 derived ratios recomputed to **L4/L3 1.64× · L4/L5 1.38× · L4/L1 26.84× · L4/L2 40.17×** under a stated rounding convention and reconciled with §6.6, which now carries the same values. §6.8 records **C4-1 as partially resolved** and **C4-3 as resolved**, both as unintended consequences of F-IR1 rather than of Phase C4, with C4-1's residual measured at **14 of 147 `dec` candidates**.

### 8.3 Traceability delivered

`tools/quantitative_census.py` now enumerates **all four candidate populations**. `--detail` emits **3,361 rows** — 1,169 Tier-1, 1,516 Tier-2, 310 code-fence, 366 inline-code — each with Part, path, line, population, class and matched text; `--json` carries the same under an additive `candidates` key. The aggregate mode is unchanged.

### 8.4 Census invariance

| | Tier-1 | Tier-2 | code-fence | inline-code | Words |
| --- | --- | --- | --- | --- | --- |
| **Before F-IR4C** | 1,169 | 1,516 | 310 | 366 | 651,161 |
| **After F-IR4C** | **1,169** | **1,516** | **310** | **366** | **651,161** |

Every Part and batch figure is unchanged. The **Tier-1/Tier-2-only detail digest is byte-identical at `c84fe3df90c114584c5454493156f4c6baed84ccd43f70e2e129e276b69066e5`**; the new **complete** four-population detail digest is `f2bbbd4bf59560aca6f97e2520310f923fb9bff54b5828ed9ccec228187b41ec`.

### 8.5 Status after this event

| Item | Value |
| --- | --- |
| FE-L1-005 | **CORRECTION APPLIED — PARTIALLY VERIFIED — AWAITING FRESH INDEPENDENT RE-ACCEPTANCE** |
| Architecture §6.1–§6.4 | **CORRECTED BUT UNACCEPTED** |
| Architecture, all other sections | Accepted at C4, unchanged |
| Open Class-B blockers | **0** |
| L1, L2 | COMPLETE, unchanged, 56/137 · L3–L5 and T1–T6 not started |
| Manuscript mutations · corrections applied | **0** · **0** |

**Next authorised activity:** **Phase F-IR4 — Fresh Independent Quantitative Instrument Re-Acceptance**, performed by an actor who authored none of F-IR1, F-IR1B or F-IR4C, implementing §6.1–§6.2 from the committed text alone and freezing results before opening the implementation. **F-L3 remains NOT AUTHORISED.**


---

## Event FE-EV-009 — Phase F-IR4V3: Independent Condition-35 Final Closure Verification

| Field | Value |
| --- | --- |
| **Event ID** | `FE-EV-009` |
| **Date** | 2026-08-18 |
| **Phase** | F-IR4V3 — independent closure verification of the last unresolved F-IR4 condition. **Not a manuscript review event** |
| **Scope** | Condition 35 only — active quantitative documentation consistency for the E11 occurrence decomposition. **READ-ONLY:** the verification made no repository change. No chapter was read for review; no transversal ran |
| **Score / verdict** | **A — CONDITION 35 INDEPENDENTLY VERIFIED · 25 PASS · 0 FAIL** against its 25-condition closure table |
| **Verification HEAD** | `250cfe7` — *fix(first-edition-review): correct final E11 occurrence decomposition* |
| **Trigger** | **FE-L1-005**, via the F-IR4 re-acceptance (39 PASS · 1 FAIL) and the F-IR4F correction |
| **Reviewer independence** | **Satisfied.** The reviewer authored no part of F-IR4F, did not rely on its arithmetic as evidence, and re-derived the population from the manuscript before opening the active documentation |
| **Baseline digest at START / END** | `ec588eaa…f150a411` / `ec588eaa…f150a411` — **matched both times; zero manuscript mutation** |
| **Non-collapse note** | F-IR4V3 is a verification event. It closes FE-L1-005 and completes F-IR4; it is **not** an F-L3 authorisation and must not be collapsed with one |

### 9.1 What was independently re-derived

The E11 population was re-derived from the committed manuscript through the committed pipeline and **frozen before the active documentation was read**.

| Measure | Independently derived | Claim under test | Result |
| --- | --- | --- | --- |
| Retained four-digit-year Tier-2 occurrences | **51** | 51 | ✅ |
| Numeric-construct occurrences | **43** | 43 | ✅ |
| Alphanumeric-identifier occurrences | **8** | 8 | ✅ |
| Numeric distinct forms | **10** | 10 | ✅ |
| Alphanumeric distinct forms | **8**, each ×1 | 8, each ×1 | ✅ |

Numeric multiplicities reproduced exactly: `2026-03` ×17 · `2025-01` ×13 · `2026-08-10` ×4 · `2026-03-01` ×3 · `2024-06-01`, `2025-01-01`, `2026-01-10`, `2026-02-10`, `2026-02-15`, `2026-08-15` ×1 each. `17 + 13 + 4 + 3 + 1 + 1 + 1 + 1 + 1 + 1 = 43`, and **`43 + 8 = 51`**.

The eight alphanumeric forms and their loci reproduced exactly: `CMU/SEI-2000-TR-004` · `v2026-03` · `v2025-01` · `v2026-03-EU` · `v2026-03-US` · `v2026-02-P` · `archive-2024` · `fulfilment-2026-02`.

**The decomposition is invariant** under three independent construct-boundary definitions, so it is not an artifact of the reviewer's classification choice.

### 9.2 Diagnostic and governing property

**CMU/SEI diagnostic reproduced.** `CMU/SEI-2000-TR-004` appears **6 times** textually; **5** sit on E5 footnote-definition lines removed in full by PASS 0; **exactly 1** reaches Tier-2. This confirms the diagnosed cause of the superseded `40 + 11` split.

**Governing property confirmed.** Across all 137 chapters, **no standalone prose year appears in Tier 1 or Tier 2** — 0 standalone occurrences of 51, and 0 standalone bare years among Tier-1 candidates. Every retained year belongs to a larger hyphen- or slash-separated construct.

**Documentation consistency confirmed.** `43 + 8` is the **only operational split**; `49 + 2`, `48 + 3` and `40 + 11` appear solely inside superseded/historical tables. Plan §6.1.1, plan §6.2 and ledger `NUM-IR3-02` all agree with the independently frozen result.

**Normative rules unchanged.** The E11 regex, the Tier-2 regex and the E9 designator rule are byte-identical across F-IR4F; **zero E9 lines were touched**, so F-IR4V2's E9 result carries forward unre-run.

### 9.3 Status after this event

| Item | Value |
| --- | --- |
| Condition 35 | **PASS** |
| Phase F-IR4 | **FINAL — 40 PASS · 0 PARTIAL · 0 FAIL** |
| FE-L1-005 | **CLOSED** |
| Targeted quantitative architecture | **A — RE-ACCEPTED** |
| Architecture, all other sections | Accepted at C4, unchanged |
| Open Class-B blockers | **0** |
| L1, L2 | COMPLETE, unchanged, 56/137 · L3–L5 and T1–T6 not started |
| Manuscript mutations · corrections applied | **0** · **0** |
| Active census | Tier-1 **1,169** · Tier-2 **1,516** · code-fence **310** · inline-code **366** · words **651,161** — unchanged |

**Next authorised activity:** **Phase F-L3 — Longitudinal First Edition Review, Parts VI–VIII.** **F-L3 is TECHNICALLY READY FOR SEPARATE AUTHORISATION** — it is **NOT STARTED** and **NOT AUTHORISED by this event**. Authorisation is a separate owner decision.


---

## 3. Manuscript-mutation control (plan §13.4 drift discipline, applied to Phase F)

**Rule.** The 137 chapter blobs recorded in §2.5 constitute the Phase F review-execution baseline. **Manuscript chapters must remain unmodified for the duration of Phase F.**

**At the start and at the end of every longitudinal and transversal task**, re-derive the manifest digest and compare against §2.5:

```text
git ls-files -s book | awk '$4 ~ /chapters\/chapter-.*\.md$/ {print $4":"$2}' | sort | shasum -a 256
```

| Outcome | Action |
| --- | --- |
| Digest matches | Record the comparison in the task's event entry and proceed |
| Digest differs | **STOP the affected scope.** Identify the exact files and the commit or diff; determine whether baseline invalidation occurred; append a mutation event to this log; report before proceeding |

**Governance and review artefacts may evolve during Phase F** — findings, ledgers and this log are written to by design. **Manuscript chapters may not.**

> **Review and correction are separate (plan §3).** Phase F is review execution; corrections are **Phase H**, and Phase H is **unscored**. A defect discovered during Phase F is **recorded, classified and evidenced — never silently repaired.** Plan §11 R3 and R5 admit no exception: a correction may never be scored or gated by the actor who made it. If a technical condition makes continued review impossible, record the blocker, stop the affected scope, and report; do not fix it inside the review task without separate authorisation.

---

## 4. Event index

| Event ID | Date | Phase | Scope | Score / verdict |
| --- | --- | --- | --- | --- |
| `FE-EV-001` | 2026-08-16 | F0 | Review-execution baseline and artefact initialisation | **`UNSCORED`** |
| `FE-EV-002` | 2026-08-16 | F — L1 | Longitudinal Batch 1, Parts I–II — START | START, no verdict |
| `FE-EV-003` | 2026-08-16 | F — L1 | Longitudinal Batch 1, Parts I–II — COMPLETE · 22/22 chapters · 7 findings | **`UNSCORED`** |
| `FE-EV-004` | 2026-08-16 | F — L2 | Longitudinal Batch 2, Parts III–V — START | START, no verdict |
| `FE-EV-005` | 2026-08-16 | F — L2 | Longitudinal Batch 2, Parts III–V — COMPLETE · 34/34 chapters · 5 findings | **`UNSCORED`** |
| `FE-EV-006` | 2026-08-16 | F-IR1 | Quantitative review-instrument remediation · census recomputed · FE-L1-005 correction applied | **`UNSCORED`** — correction event |
| `FE-EV-007` | 2026-08-17 | F-IR3 | Genuinely independent quantitative instrument closure review · 2,685 match rows reproduced · specification found not implementation-complete | **B — PARTIALLY VERIFIED** · 25 PASS / 2 PARTIAL / 3 FAIL |
| `FE-EV-008` | 2026-08-17 | F-IR4C | Quantitative specification completeness and candidate traceability correction · all four populations enumerable · census unchanged | **`UNSCORED`** — correction event |
| `FE-EV-009` | 2026-08-18 | F-IR4V3 | Independent Condition-35 final closure verification · E11 decomposition re-derived at `43 + 8 = 51` · FE-L1-005 CLOSED · F-IR4 final 40/40 | **A — CONDITION 35 VERIFIED** · 25 PASS / 0 FAIL |

> **Note on the FE-EV-008 → FE-EV-009 sequence — this is not a lost record.** Three quantitative-instrument events occurred between them — **F-IR4** (fresh independent re-acceptance, 39 PASS · 0 PARTIAL · 1 FAIL), **F-IR4V2** (independent verification establishing that the instrument is intact, that E9 is correct and that the E11 total is 51) and **F-IR4F** (the E11 occurrence-decomposition correction, commit `250cfe7`) — and **none was written to this log at the time it happened.** Their outcomes are recorded in the **plan §16 phase-history table**, and `FE-EV-009` states the chain it closes.
>
> **No standalone `FE-EV` events were created for them retroactively.** This log is **append-only**, and a historical event may not be reconstructed after the fact without its original evidence — reviewer identity, date, baseline digests at start and end, method, and scored verdict. Manufacturing those fields to fill a numbering gap would fabricate review evidence, which plan §11 forbids. **Event IDs are assigned in strict ascending order and never reused**, so the sequence is correct as it stands; the gap is a record of how the events were logged, not of what occurred.

---

**Last Updated:** 2026-08-18 (F-IR4V3)
