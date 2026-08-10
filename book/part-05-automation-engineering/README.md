# Part V – Automation Engineering

---

## Curriculum Status

**Curriculum complete. Delivery 1 (Chapters 1–4), Delivery 2 (Chapters 5–8), Delivery 3 (Chapters 9–12), and the Final Part V Quality Gate each closed at 98/100 with no P0, P1, or P2 findings. All Chapters 1–12 remain Draft.** Part V manuscript drafting and its comprehensive normalization pass are complete at committed baseline `64a3c9f`. Release preparation is active for the planned **v0.8.0 — Automation Engineering Complete** release. Companion implementation, Lab 1, Lab 2, diagrams, case studies, CI configuration, and other Pass 2 learning assets remain deferred. Website work remains separate, Part VI has not started, and Part V is not approved, published, or released.

---

## Overview

Part V develops Automation Engineering as the practice of designing, operating, and improving maintainable automation systems that produce trustworthy, timely, and diagnosable quality evidence.

The central question is not *how do I automate this test case?* It is:

> **What evidence should be automated for this decision, and how can the automation system produce it reliably enough to be useful?**

Automation is an important Quality Engineering capability. It is not synonymous with Quality Engineering, and a large automated suite is not itself evidence that a product is high quality. The part therefore teaches selection, boundaries, engineering trade-offs, and evidence limitations before tool mechanics.

The proposed subtitle is **Trustworthy Feedback Systems**. The canonical part name remains **Part V – Automation Engineering**, consistent with the MQE-BOK and the wider handbook roadmap.

---

## Purpose

To help experienced QA Engineers progress from automating individual checks to engineering proportionate automation systems with clear ownership, controlled state, useful diagnostics, and an explicit relationship to product risk and delivery decisions.

Part V is not a Playwright API reference, a framework-brand comparison, a catalogue of Page Object patterns, a CI/CD implementation guide, or a claim that all testing should be automated. A mechanism is introduced only after the reader can explain the evidence question, its automation value and limits, and the design trade-off involved.

---

## Target Reader and Prerequisites

This part is for experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers who already write or review automated checks and want to develop system-level automation judgement.

Readers should have completed, or have equivalent capability from:

- Part I — Foundations of Modern Software Quality Engineering;
- Part II — Programming for Quality Engineers, especially TypeScript, modules, asynchronous behaviour, diagnostics, testing, and collaboration practices;
- Part III — Software Testing Engineering, especially risk, evidence selection, testability, boundaries, deterministic feedback, regression, and exploratory learning; and
- Part IV — API Quality Engineering, especially API boundaries, contracts, dependencies, state, diagnostics, and controlled-versus-real evidence decisions.

---

## Learning Outcomes

Upon completion of this part, readers should be able to:

- decide which questions are suitable for automation and which require exploratory, human, specialist, or production evidence;
- design automation architecture around an explicit quality decision, evidence boundary, and limitation;
- select and evolve abstractions, fixtures, test data, and shared utilities without creating unnecessary framework complexity;
- engineer deterministic execution through controlled state, dependency choices, synchronization, stable interaction contracts, and useful diagnostics;
- apply browser, UI, API, component, and service automation at proportionate boundaries;
- design for parallel execution, isolation, resource contention, and justified serial work;
- make automation failures diagnosable through reports, traces, screenshots, logs, and failure context;
- integrate automation into continuous feedback at a strategy level, including suite selection, artifacts, retries, quarantine policy, and release evidence;
- identify and reduce automation debt, including obsolete checks, brittle selectors, slow suites, duplication, broken abstractions, and unclear ownership; and
- communicate a maintainable automation-system design with stated exclusions, residual risk, and evidence limitations.

---

## Position in the MSQE Learning Journey

| Established capability | Part V application | Deferred depth |
|---|---|---|
| Part II — typed programming, modules, asynchronous work, errors, diagnostics, utility testing, and collaboration | Build small, readable automation components and reason about their lifecycle, failure modes, and maintainability. | General programming foundations and language breadth are not retaught. |
| Part III — strategy, risk, testability, boundaries, deterministic feedback, and exploratory learning | Select automation because it improves a defined feedback decision, while retaining non-automated evidence where it is stronger. | General testing theory and test-design catalogue are not duplicated. |
| Part IV — API contracts, state, dependencies, reliability, and diagnostics | Use API calls as setup, data control, boundary composition, and focused feedback mechanisms within an automation system. | API-quality strategy, protocol semantics, and contract-quality depth remain Part IV concerns. |
| Part V — automation architecture and feedback systems | Design maintainable UI, API, component, and service automation with fixtures, state control, diagnostics, and feedback orchestration. | CI/CD platform implementation, production observability, data-system engineering, and specialist performance or security work remain later disciplines. |

**Part V boundary:** Part V teaches how to engineer automation systems that repeatedly produce useful quality evidence. It does not teach that automation replaces exploratory evaluation, human judgement, product discovery, accessibility evaluation, production observation, or Quality Engineering as a whole.

---

## Curriculum Architecture

Twelve approved chapters create a deliberate progression from deciding whether automation is justified, through designing deterministic and diagnosable automation, to sustaining an evidence portfolio as systems and delivery needs evolve.

1. **Automation Engineering: Purpose, Evidence, and Boundaries**
2. **Automation System Architecture and Feedback Design**
3. **Reusable Automation Design: Abstractions, Fixtures, and Test Data**
4. **Deterministic Automation: State, Synchronization, Dependencies, and Flakiness**
5. **Browser Automation as an Engineering System**
6. **Composing UI, API, Component, and Service Automation**
7. **Parallelism, Isolation, and Environment Strategy**
8. **Diagnostics, Reporting, and Failure Investigation**
9. **Continuous Feedback: CI-Oriented Execution and Test Selection**
10. **Sustainable Automation: Maintenance, Debt, Governance, and Scaling**
11. **Specialized Automation Evidence: Visual, Accessibility, Cross-Browser, and Mobile**
12. **Capstone: Quality Automation System**

The sequence deliberately places determinism before broad browser-scale execution and places reporting before CI-oriented selection. Readers first learn to make feedback trustworthy and explainable; only then do they decide how to run, select, and sustain it at wider scope.

---

## Approved Chapter Plan

### Chapter 1 — Automation Engineering: Purpose, Evidence, and Boundaries

- **Purpose:** Establish automation as a means of obtaining repeatable evidence for a decision, not as a target measured by test count or percentage automated.
- **Major concepts:** Automation value; automation cost; repeatability; timeliness; evidence boundary; oracle; feedback decision; risk; automation limits; exploratory and human evaluation; ownership.
- **QA → QE transition contribution:** Moves the learner from “I can automate test cases” to “I can explain why a check should, should not, or cannot be automated for a particular decision.”
- **Dependencies:** Parts I–III; no Part V chapter dependency.
- **Practical activity:** Produce an Automation Opportunity and Limits Map for a fictional change, separating repeatable checks from exploratory, design-review, accessibility, production, and specialist evidence.
- **Expected professional artifact:** A one-page automation decision record that names the intended decision, chosen boundary, expected value, exclusions, and residual risk.
- **Explicit scope boundary:** Does not teach a browser tool, framework implementation, or automation metrics programme.
- **Deferred concepts:** Detailed automation architecture follows in Chapter 2; CI/CD platform implementation belongs to Part VII; production reliability evidence belongs to Part VIII.

### Chapter 2 — Automation System Architecture and Feedback Design

- **Purpose:** Teach the automation system as a small engineering product with consumers, interfaces, execution paths, dependencies, evidence outputs, and maintenance obligations.
- **Major concepts:** System context; feedback portfolio; test levels as evidence boundaries; automation layers; run lifecycle; configuration; dependency seams; artifact flow; ownership; design constraints; architecture decision records.
- **QA → QE transition contribution:** Shifts attention from a collection of scripts to an intentionally designed feedback system whose capabilities and limitations are inspectable.
- **Dependencies:** Chapter 1; Part II modules and configuration foundations; Part III testability and evidence boundaries.
- **Practical activity:** Create an Automation System Context Map for the fictional product used throughout the part, identifying users of evidence, change triggers, boundaries, dependencies, and diagnostic outputs.
- **Expected professional artifact:** An Automation Architecture Decision Record with the selected evidence boundaries and the reasons not to automate others.
- **Explicit scope boundary:** Does not prescribe a universal framework architecture or implement pipelines, containers, cloud environments, or platform services.
- **Deferred concepts:** Reusable component design follows in Chapter 3; CI orchestration follows in Chapter 9; infrastructure implementation remains Part VII.

### Chapter 3 — Reusable Automation Design: Abstractions, Fixtures, and Test Data

- **Purpose:** Develop judgement for creating abstractions that make meaningful repeated behaviour clearer and safer without hiding evidence, coupling unrelated concerns, or producing a framework for its own sake.
- **Major concepts:** Stable domain interactions; page and component abstractions; domain helpers; fixtures; dependency injection; factories and builders; setup and teardown; composability; configuration boundaries; shared utilities; lifecycle ownership.
- **QA → QE transition contribution:** Replaces pattern-by-default automation with explicit choices about what deserves encapsulation, what should remain visible in a test, and who owns shared behaviour.
- **Dependencies:** Chapters 1–2; Part II modules, types, JSON, errors, and tests.
- **Practical activity:** Refactor two fictional duplicated workflows into a small set of focused abstractions, then document one abstraction intentionally rejected as premature.
- **Expected professional artifact:** An abstraction and fixture design note that records interface, lifecycle, composition, ownership, and evidence visibility.
- **Explicit scope boundary:** Does not mandate Page Objects, dependency-injection containers, global fixtures, or test-data products.
- **Deferred concepts:** Deterministic data and environment constraints are applied in Chapters 4 and 7; database and pipeline engineering remain Part VI.

### Chapter 4 — Deterministic Automation: State, Synchronization, Dependencies, and Flakiness

- **Purpose:** Make deterministic feedback a core automation-system capability and teach investigation before mitigation.
- **Major concepts:** Test state; unique data; reset and cleanup; asynchronous completion; explicit business-condition waits; selector contracts; timing; hidden state; controlled dependencies; environment instability; retry policy; flaky-test taxonomy; repair validation.
- **QA → QE transition contribution:** Moves the learner from rerunning failures or adding delays to identifying an observable cause, choosing an appropriate control, and proving that the repair improved trustworthiness.
- **Dependencies:** Chapters 1–3; Part II asynchronous programming and diagnostics; Part III deterministic-feedback principles; Part IV dependency and state reasoning.
- **Practical activity:** Diagnose a fictional intermittent failure using run evidence, classify the likely cause, propose a controlled repair, and state how the repair will be evaluated without relying on retries as proof.
- **Expected professional artifact:** A Flakiness Investigation Record with reproduction conditions, root-cause hypothesis, evidence, repair, validation plan, and remaining uncertainty.
- **Explicit scope boundary:** Does not teach chaos engineering, production fault injection, distributed scheduling, or full environment provisioning.
- **Deferred concepts:** Parallel execution follows in Chapter 7; operational resilience implementation belongs to Part VIII; cloud/environment provisioning belongs to Part VII.

### Chapter 5 — Browser Automation as an Engineering System

- **Purpose:** Apply automation-engineering principles to browser-visible behaviour without becoming a reference manual for a specific browser automation product.
- **Major concepts:** User-visible behaviour; locator contracts; accessible names, roles, and labels; stable test identifiers; browser contexts; session state; navigation; forms; tables; uploads and downloads conceptually; browser lifecycle; controlled network awareness; screenshots and traces as diagnostic evidence.
- **QA → QE transition contribution:** Changes UI automation from fragile DOM scripting to evidence about a meaningful user interaction, with deliberate interaction contracts and diagnostic support.
- **Dependencies:** Chapters 1–4; Part III user-outcome and testability foundations.
- **Practical activity:** Review a fictional browser-flow design and improve its interaction contracts, boundary, diagnostic artifacts, and state-isolation plan.
- **Expected professional artifact:** A Browser Feedback Design Sheet that specifies the user outcome, locators/interaction contracts, state model, artifacts, and known limits.
- **Explicit scope boundary:** Does not teach each Playwright API, visual baseline management in depth, device-lab operation, or manual accessibility evaluation.
- **Deferred concepts:** UI/API composition follows in Chapter 6; specialized visual, accessibility, cross-browser, and mobile evidence follows in Chapter 11.

### Chapter 6 — Composing UI, API, Component, and Service Automation

- **Purpose:** Teach the learner to select the fastest credible boundary and to combine boundaries only when the evidence question requires it.
- **Major concepts:** Boundary composition; UI/API hybrid workflows; API setup and teardown; controlled test data; component and service checks; dependency seams; contract-aware setup; real versus represented dependencies; evidence overlap; false confidence from duplicated checks.
- **QA → QE transition contribution:** Moves beyond an end-to-end-only automation habit toward a portfolio of complementary feedback paths with explicitly different strength and cost.
- **Dependencies:** Chapters 1–5; Part III evidence boundaries; Part IV API contracts, state, dependencies, and diagnostics.
- **Practical activity:** Design a feedback portfolio for a fictional checkout change, explaining what belongs at UI, API, component, or service level and what should remain non-automated.
- **Expected professional artifact:** A Boundary Composition Matrix that records evidence question, selected mechanism, controlled dependencies, diagnostic output, and limitation.
- **Explicit scope boundary:** Does not repeat API-quality strategy, prescribe contract-testing products, or teach microservice topology.
- **Deferred concepts:** Part IV retains API quality and contract semantics; Part XI retains deep system design; Part VII retains platform-scale integration implementation.

### Chapter 7 — Parallelism, Isolation, and Environment Strategy

- **Purpose:** Show how concurrent execution changes data, state, session, dependency, and diagnostic design.
- **Major concepts:** Workers; independent browser and session state; unique run identifiers; independent data; ordering assumptions; resource contention; shared-environment constraints; justified serial tests; sharding concepts; cleanup ownership; environment fit for purpose.
- **QA → QE transition contribution:** Helps the learner treat parallelism as an architectural constraint rather than a speed switch applied after a suite becomes slow.
- **Dependencies:** Chapters 3–6, especially fixtures, state control, and browser lifecycle.
- **Practical activity:** Assess a fictional suite for unsafe shared state and redesign its data, context, and cleanup model for parallel execution, documenting the small set of justified serial constraints.
- **Expected professional artifact:** A Parallel Execution and Isolation Plan with data ownership, contention controls, serial rationale, and expected diagnostic correlation.
- **Explicit scope boundary:** Does not teach distributed-computing theory, dynamic infrastructure, cloud worker provisioning, or device-farm operation.
- **Deferred concepts:** CI worker provisioning and platform configuration belong to Part VII; deep distributed-system architecture belongs to Part XI.

### Chapter 8 — Diagnostics, Reporting, and Failure Investigation

- **Purpose:** Treat automation output as decision support and investigation material, not merely a pass/fail counter.
- **Major concepts:** Failure context; assertions and observations; structured run metadata; screenshots; traces; videos where useful; logs; correlation identifiers; report audiences; artifact retention; sensitive-data handling; triage flow; suspected automation failure versus suspected product failure.
- **QA → QE transition contribution:** Enables the learner to design evidence that lets another engineer understand a failed run, reproduce the relevant condition, and make an accountable next decision.
- **Dependencies:** Chapters 1–7; Part II diagnostics and error handling; Part IV diagnostic-context principles.
- **Practical activity:** Improve a fictional opaque failure report into a concise diagnostic package, then identify what additional signal would be needed before drawing a product-quality conclusion.
- **Expected professional artifact:** A Failure Diagnostic Contract defining required run context, artifacts, redaction rules, triage questions, and escalation criteria.
- **Explicit scope boundary:** Does not implement logging, metrics, tracing platforms, incident command, or SLOs.
- **Deferred concepts:** Production observability and reliability implementation belong to Part VIII; CI artifact plumbing belongs to Part VII.

### Chapter 9 — Continuous Feedback: CI-Oriented Execution and Test Selection

- **Purpose:** Apply automation-system design to timely delivery feedback while keeping platform implementation outside the part.
- **Major concepts:** Trigger intent; fast versus broad feedback; suite selection; change impact; execution tiers; risk-based selection; retries as a bounded policy; quarantine entry and exit criteria; artifacts; release evidence; feedback latency; evidence decay; manual gates and residual risk.
- **QA → QE transition contribution:** Replaces “run everything on every change” with a decision-aware feedback strategy that balances speed, credibility, breadth, cost, and diagnosability.
- **Dependencies:** Chapters 1–8; Part III regression and feedback strategy.
- **Practical activity:** Create a CI Feedback Portfolio for a fictional delivery path, including selected checks, escalation to broader evidence, artifact expectations, quarantine policy, and limitations.
- **Expected professional artifact:** A Continuous Feedback Decision Record that connects triggers and suite selection to risks, decisions, and evidence gaps.
- **Explicit scope boundary:** Does not configure a CI provider, write pipeline definitions, manage secrets, deploy environments, or implement release controls.
- **Deferred concepts:** CI/CD and cloud implementation belong to Part VII; release governance and delivery policy remain cross-project concerns.

### Chapter 10 — Sustainable Automation: Maintenance, Debt, Governance, and Scaling

- **Purpose:** Establish automation maintenance as deliberate engineering work rather than an afterthought after new checks are added.
- **Major concepts:** Automation debt; obsolete checks; duplication; brittle selectors; slow and flaky suites; broken abstractions; ownership; code review; refactoring; portfolio pruning; diagnostic quality; evidence decay; health measures as prompts rather than targets; investment decisions.
- **QA → QE transition contribution:** Moves the learner from measuring progress by scripts created to improving the long-term credibility, cost, and decision value of the automation portfolio.
- **Dependencies:** Chapters 1–9; Part II collaboration and code-review practices; Part III learning and regression strategy.
- **Practical activity:** Perform an Automation Portfolio Health Review for a fictional suite and propose prioritized interventions with expected benefit, cost, owner, and review point.
- **Expected professional artifact:** An Automation Debt Register and Maintenance Plan with evidence of the problem, decision criteria, ownership, and exit conditions.
- **Explicit scope boundary:** Does not prescribe organisation-wide metrics, staffing models, or a specific test-management product.
- **Deferred concepts:** Engineering leadership and organisation design belong to Part XII; platform-scale operational data belongs to Part VIII.

### Chapter 11 — Specialized Automation Evidence: Visual, Accessibility, Cross-Browser, and Mobile

- **Purpose:** Give specialist automation capabilities a proportionate place in an evidence portfolio without allowing them to displace general automation-system engineering.
- **Major concepts:** Visual comparison boundaries; baseline ownership; rendering determinism; thresholds; review of differences; false positives; automated accessibility-rule checks and their limits; risk-based browser coverage; viewport and device emulation limits; real-device and manual evaluation hand-offs.
- **QA → QE transition contribution:** Helps the learner select these mechanisms for the evidence they can credibly supply and communicate what still requires human, device, accessibility, performance, or security evaluation.
- **Dependencies:** Chapters 1, 4, 5, 7, and 8; Part III exploratory and evidence-limit principles.
- **Practical activity:** Build a specialized-evidence selection rationale for a fictional customer journey, choosing visual, accessibility, browser, and mobile evidence only where the decision requires it.
- **Expected professional artifact:** A Specialized Evidence Coverage Rationale with baseline/review ownership, platform assumptions, manual hand-offs, and limitations.
- **Explicit scope boundary:** Automated accessibility checks do not certify accessibility; emulation does not replace real-device evaluation; visual comparison does not prove product correctness.
- **Deferred concepts:** Deep accessibility practice is specialist collaboration; device-lab infrastructure and platform configuration belong to Part VII; performance and security testing belong to Part X.

### Chapter 12 — Capstone: Quality Automation System

- **Purpose:** Integrate Part V learning into a portfolio-ready automation-system proposal that is maintainable, deterministic, diagnosable, proportionate, and connected to decisions.
- **Major concepts:** Automation opportunity and limits; system architecture; feedback portfolio; reusable components; fixtures; data and dependency control; synchronization; browser/API composition; parallelism; diagnostics; CI-oriented selection; maintenance; specialized evidence; residual risk.
- **QA → QE transition contribution:** Demonstrates the intended shift: “I can engineer and maintain automation systems that provide trustworthy, diagnosable, proportionate feedback.”
- **Dependencies:** Chapters 1–11 and the relevant foundations from Parts I–IV.
- **Practical activity:** Produce a Quality Automation System portfolio for a fictional product change, with a selected automation scope and a justified non-automated evidence plan.
- **Expected professional artifact:** A Quality Automation System Design Portfolio and concise Quality Decision Brief.
- **Explicit scope boundary:** Does not require a production framework, deployed pipeline, cloud account, real credentials, performance campaign, penetration test, SRE platform, or device lab.
- **Deferred concepts:** Part VI data systems; Part VII platform implementation; Part VIII operations and SRE; Part IX AI quality; Part X deep performance/security; Part XI architecture; and Part XII organisational leadership.

---

## Curriculum Progression Rationale

The curriculum begins with purpose because automating the wrong question efficiently does not improve quality. Architecture then connects a chosen evidence need to execution, dependencies, artifacts, ownership, and system limits. Reusable design and determinism follow before browser automation so readers do not treat a tool's convenience features as a substitute for maintainability or reliable state control.

Browser automation and UI/API/component/service composition then apply the same engineering principles at useful evidence boundaries. Parallelism and diagnostics extend that design to realistic execution and investigation conditions. CI-oriented feedback, maintenance, and specialized evidence follow only after the reader can evaluate the credibility and cost of the underlying automation system. The capstone integrates these decisions into one inspectable professional artifact rather than a production framework.

### What to automate, and what to retain outside automation

Automation is strongest where a check is repeatable, has a sufficiently clear oracle, can run at a credible boundary, and provides feedback in time to influence a decision. It is particularly useful for stable rules, regression risks, deterministic state transitions, compatibility signals, and focused workflows whose failure needs timely diagnosis.

Automation should not displace exploratory investigation, product discovery, usability evaluation, manual accessibility evaluation, visual judgement, human review of ambiguous outcomes, specialist security assessment, realistic performance investigation, or production observation. The correct evidence portfolio may include automation, but it must state what automated results do not establish.

---

## Tool and Language Strategy

### Proposed primary implementation stack: TypeScript and Playwright

TypeScript and Playwright are recommended for future, separately authorized practical work. TypeScript extends the repository's established Part II programming foundation. Playwright offers a coherent browser-testing environment with isolated browser contexts, fixtures, parallel execution, API support, project configuration, and diagnostic artifacts. This makes it a practical way to demonstrate Part V concepts without requiring multiple toolchains.

This is an instructional implementation choice, not a claim that Playwright is universally superior or that Quality Engineering depends on it. The curriculum must express principles in tool-neutral terms first: evidence boundary, state ownership, abstraction choice, synchronization condition, diagnostic contract, and feedback decision. Cypress, Selenium, WebdriverIO, and other ecosystems remain valid ways to implement those concepts.

No comparison chapter should list framework features. When a future example uses a tool-specific mechanism, the text should first name the transferable problem and trade-off, then explain the selected mechanism and its limits.

### Reference strategy for future chapters

Tool-specific claims should be verified against primary project documentation at drafting time. Likely implementation references include:

- Microsoft, [Playwright documentation](https://playwright.dev/docs/intro);
- Cypress, [Why Cypress](https://docs.cypress.io/app/get-started/why-cypress);
- Selenium, [Selenium documentation](https://www.selenium.dev/documentation/); and
- WebdriverIO, [Getting Started](https://webdriver.io/docs/gettingstarted/).

Future chapters should use authoritative standards and guidance where they support claims about accessibility, web behaviour, or product quality, and should distinguish those sources from MSQE's educational framing.

---

## Automation Architecture Teaching Strategy

Part V should teach an automation system as a bounded product that has stakeholders, inputs, state, dependencies, execution environments, reports, and maintenance costs. Architecture teaching should use simple context maps, decision records, and feedback portfolios rather than a prescribed enterprise framework diagram.

The design heuristic is: introduce an abstraction only when it makes a stable, repeated domain interaction, resource lifecycle, or diagnostic responsibility clearer and safer. Keep one-off intent visible. Prefer small composable fixtures and domain helpers over global mutable setup or abstractions that merely rename a single tool call. Page and component objects are options, not rules; they help when they protect a meaningful UI interaction contract and become harmful when they hide the outcome, duplicate application structure, or couple unrelated workflows.

The smallest useful architecture teaches an executable test layer, focused UI/API boundary composition, deterministic local state, per-test or per-worker isolation, reusable fixtures, diagnostic artifacts, and CI-ready commands. It does not attempt to become a reusable production framework or platform.

---

## UI Automation Scope

UI automation should focus on evidence of meaningful user-visible behaviour. It should cover locator choice and interaction contracts, accessible roles and labels, stable test identifiers negotiated with product and engineering teams, browser contexts, state isolation, navigation, forms, tables, and file operations conceptually.

Synchronization should be framed as waiting for an observable business condition or browser state that matters to the outcome—not as inserting arbitrary delays. Network interception or stubbing is appropriate only when it controls a defined dependency or exposes a focused condition; it must state which integration evidence it removes. Screenshots, traces, and videos are diagnostic artifacts, not automatic proof that a user outcome is correct.

---

## API Automation Scope

Part IV remains responsible for deciding what constitutes high-quality API behaviour. Part V uses API automation only where it improves the automation system: setup and teardown, test-data control, hybrid UI/API workflows, faster focused feedback, dependency composition, and fixture orchestration.

The part must not repeat API protocol semantics, contract-quality strategy, or general API test design. A future example may use an API to establish preconditions for a browser scenario, but it should state the selected boundary and the API or UI evidence that remains unproven.

---

## Fixtures, Abstractions, and Test-Data Strategy

Fixtures should provide explicit resources with known ownership and lifecycle. A fixture is valuable when it expresses setup, cleanup, data ownership, dependency control, or a reusable capability without obscuring the evidence question. Factories and builders should make test inputs understandable and unique; they should not create vast fictional object graphs by default.

Test data and state should be owned at the narrowest practical scope: individual test, worker, run, or environment. The curriculum should compare reset, seeded data, API-created data, isolated accounts, and controlled dependencies in terms of cost, representativeness, cleanup, and parallel safety. It should not claim that any one pattern is universal.

---

## Determinism and Flakiness Strategy

Determinism is a major Part V capability. Future chapters should teach a flakiness investigation loop: retain evidence, classify the possible source, reproduce or narrow the condition, repair the cause or the evidence boundary, then validate the repair over appropriate repeated conditions. Likely causes include timing, hidden state, shared data, selectors, asynchronous UI, network/dependency instability, environment behaviour, and unsafe parallelism.

Retries may be used as a bounded signal-management or transient-risk policy, but never as the primary repair for a non-deterministic check. A retry should produce useful diagnostic context and have entry, review, and exit criteria. It is not proof that an automation system is trustworthy.

---

## Parallelism, Isolation, and Environment Strategy

Parallel execution should be introduced as a design constraint. Each worker needs independent browser/session state, data, run identity, cleanup responsibility, and diagnostic correlation where feasible. Tests should not rely on ordering. Serial execution is justified only where a documented, owned shared constraint cannot reasonably be removed; it must not become a default way to mask state coupling.

Environment strategy should address fit for the selected evidence, predictable reset/cleanup, known shared constraints, controlled dependencies, and the trade-off between representativeness and diagnosability. Dynamic environment creation, cloud workers, and device farms remain outside the part's implementation scope.

---

## Diagnostics, Reporting, and CI Feedback Scope

Reports should help a specific audience decide what happened and what to do next. Required run context should include the meaningful scenario, boundary, relevant state, configuration or project, diagnostic artifacts, correlation identifiers where available, and safe redaction of sensitive data. A failed automated check can indicate a product defect, automation defect, environment condition, test-data problem, or unknown state; reporting should not overstate the conclusion.

CI-oriented material belongs at the feedback-strategy level: trigger purpose, fast versus broad portfolios, change and risk-informed selection, artifacts, bounded retry and quarantine policies, escalation to broader evidence, and release evidence. Future Part V content must not teach pipeline syntax, secret management, container execution, deployment infrastructure, or CI provider administration; these belong to Part VII.

---

## Visual, Accessibility, Cross-Browser, and Mobile Scope

These capabilities deserve a single specialized-evidence chapter, not separate tool courses and not a dominant share of the part.

- **Visual evidence:** Use visual comparison only for decisions where appearance matters. Teach baseline ownership, deterministic rendering conditions, deliberate thresholds, review of meaningful differences, and false-positive management. A screenshot difference is evidence to investigate, not automatic proof of a product failure.
- **Accessibility:** Automated rule checks can reveal some detectable issues and support regression feedback. They do not establish accessibility or replace manual evaluation with people, assistive technologies, and relevant expertise.
- **Cross-browser:** Select browser coverage by product, customer, and risk evidence rather than by a maximal browser matrix.
- **Mobile:** Viewport and device emulation can provide bounded layout and interaction evidence. They do not substitute for real-device, platform, network, or assistive-technology evaluation.

---

## Practical Learning Strategy

Part V should include practical implementation after separate Pass 2 authorization because automation engineering requires hands-on design and diagnostic work. Manuscript exercises should remain useful without code: each should produce a concise professional artifact that names the decision, evidence boundary, selected mechanism, limitation, owner, and review point.

The recommended shared fictional context is **Atlas Commerce**, using synthetic data only. Learners may progressively refine one automation-system portfolio across chapters. Reuse should support coherent reasoning, not impose a mandatory document-production process.

### Companion-code recommendation

**Recommend one staged, local, deterministic companion: `Quality Automation System`.** It should be created only after separate authorization under `code/part-05-automation-engineering/`. A single companion avoids repeated framework setup while allowing each delivery to add a tightly bounded capability.

Its smallest useful shape is a fictional local web experience plus a narrow local API/test-control boundary, with TypeScript and Playwright used to demonstrate:

- focused user-visible browser evidence;
- API-assisted setup, teardown, and hybrid boundary composition;
- small composable fixtures and readable domain helpers;
- deterministic state, dependency controls, and an intentionally diagnosable failure condition;
- isolated browser contexts and parallel-safe synthetic data;
- traces, screenshots, reports, and safe diagnostic context; and
- CI-ready commands without creating a pipeline or deployment environment.

It must remain explicitly non-production. It should not include real credentials, external services, cloud infrastructure, message brokers, a reusable enterprise framework, a device lab, performance harnesses, security-testing tooling, or an operational observability platform.

### Laboratory recommendation

Recommend two standalone labs as future Pass 2 enrichment, subject to separate authorization:

1. **Lab 1 — Deterministic Browser Feedback**, after Chapter 4: identify state, timing, selector, or dependency causes of a controlled intermittent failure; repair it and validate the result.
2. **Lab 2 — Parallel, Diagnosable Automation**, after Chapter 8: make a bounded suite safe for concurrent execution and improve its failure artifacts for a second engineer's investigation.

These labs are not required for manuscript quality gates and are not created by this plan.

### Capstone recommendation

**Recommend Chapter 12 — Capstone: Quality Automation System.** The learner brief is to propose an automation system for a fictional product change that has customer-visible behaviour, an API boundary, controlled data/dependencies, and delivery-feedback needs.

The capstone portfolio should include:

- an automation opportunity and limits map;
- system context and feedback architecture;
- selected UI, API, component, and service evidence boundaries;
- fixture, abstraction, data, dependency, and synchronization decisions;
- parallelism and environment assumptions;
- diagnostics and report contract;
- CI-oriented feedback and suite-selection strategy;
- maintenance and automation-debt plan;
- specialized evidence selection where relevant; and
- a concise Quality Decision Brief, exclusions, hand-offs, and residual risk.

Its portfolio value is the learner's ability to explain design choices and limitations, not the size of a test suite. It excludes production deployment, enterprise framework delivery, performance/security campaigns, real-device infrastructure, SRE implementation, and specialist accessibility certification.

---

## Accelerated Delivery Plan

| Delivery | Chapters | Intended capability outcome | Planned professional artifacts |
|---|---|---|---|
| Delivery 1 — Automation Foundations and Determinism | 1–4 | Readers can select automation proportionately, design its feedback architecture, choose reusable components, and investigate non-deterministic feedback. | Automation Opportunity and Limits Map; Automation Architecture Decision Record; abstraction/fixture design note; Flakiness Investigation Record. |
| Delivery 2 — Execution Boundaries and Diagnostics | 5–8 | Readers can apply browser and API composition, engineer parallel-safe execution, and design useful diagnostic output. | Browser Feedback Design Sheet; Boundary Composition Matrix; Parallel Execution and Isolation Plan; Failure Diagnostic Contract. |
| Delivery 3 — Sustainable Feedback and Capstone | 9–12 | Readers can connect automation to delivery feedback, sustain its credibility, select specialized evidence, and propose a complete automation system. | Continuous Feedback Decision Record; Automation Debt Register; Specialized Evidence Coverage Rationale; Quality Automation System Design Portfolio. |

Each delivery should use the established mature workflow: draft, independent quality gate, and targeted P0/P1 correction if needed. P2/P3 findings should be recorded and carried into one controlled final normalization pass unless a finding creates a material cross-chapter inconsistency. Completion of a delivery does not by itself approve or publish its chapters.

---

## Explicit Scope Boundaries

| Deferred material | Owning handbook part |
|---|---|
| General testing strategy, broad test-design theory, exploratory investigation, and evidence-selection foundations | Part III — Software Testing Engineering |
| API semantics, contract-quality strategy, interface state/identity quality, and API-quality evidence principles | Part IV — API Quality Engineering |
| SQL, data pipelines, reconciliation systems, lineage, and data-quality platforms | Part VI — Data Quality Engineering |
| CI/CD provider implementation, deployment controls, cloud environments, containers, infrastructure as code, secrets, and platform engineering | Part VII — Cloud & DevOps |
| Production logging, metrics, tracing, SLOs, incident command, resilience implementation, and SRE practice | Part VIII — Observability & Reliability Engineering |
| AI-enabled system evaluation, AI-assisted testing governance, and AI-specific quality methods | Part IX — AI Quality Engineering |
| Deep performance, load, stress, security, threat modelling, penetration testing, and vulnerability assessment | Part X — Performance & Security Engineering |
| Deep distributed-system design, service topology, and architecture governance | Part XI — System Design & Architecture |
| Organisation-wide leadership, staffing, and career-development practice | Part XII — Engineering Leadership & Career Growth |

Part V may identify these as collaboration needs or evidence limits. It does not transfer specialist ownership to automation engineers or imply that automated checks establish specialist assurance.

---

## MQE-BOK and QA → QE Transition Framework Mapping

**Primary MQE-BOK domain:** Domain 5 — Automation Engineering.

**Primary Transition Framework domain:** Test Automation Engineering.

The Transition Framework defines useful automation as repeatable, timely feedback and describes Engineer capability as designing or improving automation that is stable, diagnosable, and connected to a decision. Part V maps directly to that progression:

| Capability stage | Part V contribution | Demonstrated through |
|---|---|---|
| Foundation | Recognise automation scope, evidence limits, test data, environments, maintainability, flakiness, and reporting concerns. | Chapters 1–2 decision and architecture artifacts. |
| Practitioner | Build or improve focused automation with guidance, using readable components, controlled state, boundary composition, and diagnostic output. | Chapters 3–8 design activities and future bounded companion work. |
| Engineer | Independently design context-sensitive automation systems, explain trade-offs, and sustain a decision-relevant evidence portfolio. | Chapters 9–12, especially the capstone portfolio. |

**Contributing domains:** Programming Foundations; Quality & Testing Foundations; Quality Strategy & Risk Engineering; API & Integration Engineering; Systems Thinking & Architecture; Observability & Reliability preparation; Communication, Leadership & Influence; and CI/CD & DevOps preparation.

These are educational capability descriptions, not certification, job-title, or hiring claims. The intended transition is from **“I can automate test cases”** to **“I can engineer and maintain automation systems that provide trustworthy, diagnosable, proportionate feedback.”** It does not equate automation with Quality Engineering.

---

## Website and Sprint-Tracking Considerations

Part V must not modify `website/` while the separate website-foundation worktree is active. Manuscripts and any separately authorized code should use predictable locations—`book/part-05-automation-engineering/chapters/`, a future `labs/` directory only if approved, and a future `code/part-05-automation-engineering/` companion only if approved—so the website can discover content later without duplicated source text.

`CURRENT_SPRINT.md` is a shared repository coordination record and could misrepresent concurrent website and content tracks if either worktree updates it independently. Its current entry records the Part V Delivery 3 content track and notes the separate website foundation worktree. A release or project coordinator should use one minimal, explicit multi-track entry when both tracks agree on later wording.

---

## Risks and Planning Controls

- **Tool-first drift:** Keep every future chapter's learning objective and artifact tool-neutral; introduce Playwright only after the transferable engineering problem is clear.
- **Framework overreach:** Keep the future companion local, staged, and intentionally incomplete; do not build a production or enterprise framework.
- **Boundary duplication:** Refer back to Parts III and IV for testing strategy and API quality rather than reteaching them.
- **False confidence from green runs:** Require evidence limitations, diagnostic context, non-automated evidence, and residual-risk statements throughout the part.
- **Flakiness normalization:** Treat retries and quarantine as managed policies with investigation and exit criteria, not as repairs.
- **CI scope creep:** Teach feedback design, not pipeline or platform implementation.
- **Parallel-worktree conflict:** Do not update the website or shared sprint record from this curriculum-planning branch without cross-track coordination.

---

## Curriculum Approval Record

Delivery 1, Delivery 2, Delivery 3, and the Final Part V Quality Gate closed at 98/100 with no P0, P1, or P2 findings. All Chapters 1–12 remain Draft. Part V manuscript drafting and normalization are complete at committed baseline `64a3c9f`; release preparation is active for planned **v0.8.0 — Automation Engineering Complete**.

The Quality Automation System companion, Lab 1, and Lab 2 are **recommended Pass 2 after the manuscript gate**, not prerequisites for it. Do not begin companion implementation or Part VI automatically.
