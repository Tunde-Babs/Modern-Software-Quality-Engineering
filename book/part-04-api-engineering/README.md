# Part IV – API Quality Engineering

---

## Curriculum Status

**Curriculum approved. Chapters 1–10 are Draft manuscripts; Part IV manuscript drafting and controlled normalization are complete. Deliveries 1–5 completed quality gates at 96/100 each, and the Final Part IV Quality Gate passed at 97/100, with no P0 or P1 findings. An intentional version-control baseline is next.** No Part IV laboratories, diagrams, case studies, companion code, or other learning assets have been created. Companion API and laboratory work remain recommended Pass 2 enrichment and have not started.

The canonical repository location remains `book/part-04-api-engineering/`; the folder name is not a direction to rename or move repository content. This curriculum uses **API Quality Engineering** to express the Domain 4 learning purpose: applying Quality Engineering judgement to interfaces and service interactions.

---

## Overview

Part IV develops API Quality Engineering from first principles. It treats an API as a boundary where customers, consumers, providers, data, identity, state, dependencies, and operational conditions meet. The central question is not *how do I send a request and check a response?* It is:

> **What contract, state transition, failure behaviour, or service interaction could undermine the intended outcome, and what proportionate evidence can challenge it?**

The curriculum builds on Part III's evidence, risk, testability, boundary, reliable-feedback, distributed-system, regression, and production-learning foundations. It applies them specifically to APIs without repeating their general theory. It also uses the TypeScript, JSON, runtime-validation, asynchronous-programming, error-handling, debugging, and utility-testing foundations from Part II without becoming a framework-automation course.

---

## Purpose

To help experienced QA Engineers become API Quality Engineers who can reason about interface contracts, semantics, state, side effects, identity, data, dependencies, resilience, diagnostics, compatibility, and residual risk as engineering concerns.

Part IV is not a Postman tutorial, REST reference, HTTP-status-code catalogue, CRUD test-case inventory, certification syllabus, or automation-framework course. Tools may support an evidence question, but no tool or protocol label substitutes for explaining the risk, observation, limitation, and decision it supports.

---

## Target Reader and Prerequisites

This part is for experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers who need to contribute more effectively to service and integration quality.

Readers should have completed:

- Part I — Foundations of Modern Software Quality Engineering;
- Part II — Programming for Quality Engineers, or equivalent practical fluency with typed code, JSON, asynchronous operations, errors, and small utility tests; and
- Part III — Software Testing Engineering, especially its treatment of testability, evidence boundaries, controlled dependencies, distributed interactions, regression strategy, and production learning.

---

## Learning Outcomes

Upon completion of this part, readers will be able to:

- explain API quality as an engineering concern rather than a request-execution activity;
- identify the contract, representation, state, side effect, timing, identity, and dependency assumptions at an API boundary;
- distinguish HTTP and REST concepts from the wider set of API styles, including RPC, GraphQL, events, webhooks, and asynchronous messaging;
- assess structural contract validity separately from semantic correctness and customer outcome;
- design proportionate evidence for validation, error behaviour, idempotency, retries, pagination, filtering, sorting, concurrency, and eventual consistency;
- evaluate authentication and authorization behaviour as API quality and security expectations without claiming to perform a full security assessment;
- select when a dependency should be real, simulated, stubbed, virtualised, or otherwise controlled, and state what each choice cannot establish;
- reason about compatibility, version evolution, API change risk, and consumer-provider expectations;
- use safe correlation and diagnostic information to interpret API-quality evidence;
- choose API-specific reliability, resilience, data-integrity, and performance evidence proportionate to the decision; and
- communicate an API Quality Strategy and Evidence Portfolio with explicit assumptions, exclusions, and residual risk.

---

## Position in the MSQE Learning Journey

| Established capability | Part IV application | Deferred depth |
|---|---|---|
| Part III — evidence boundaries and integration risk | Challenge the contract, representation, state transition, and failure semantics at an API boundary. | General test-level theory is not retaught. |
| Part III — deterministic checks and controlled dependencies | Decide what must remain real for compatibility evidence and what may be controlled for a focused API condition. | Framework architecture and platform-scale virtualization belong later. |
| Part III — distributed interactions and production learning | Apply the same reasoning to webhooks, events, third parties, retries, partial outcomes, diagnostics, and API change. | SRE implementation, incident command, and deep distributed-system design remain later specialisms. |
| Part II — TypeScript, JSON, validation, async work, and errors | Create small, bounded request, validation, and diagnostic examples when they improve an API-quality question. | Framework-scale API automation and CI/CD architecture belong to Part V and Part VII. |

**Part V boundary:** Part IV teaches what makes an API high quality and how to obtain trustworthy evidence about it. Part V — Automation Engineering will teach how to engineer scalable automation systems that repeatedly produce quality evidence. Part IV will not design enterprise frameworks, generalized automation platforms, Page/Service Object architectures, or CI/CD automation architecture.

---

## Curriculum Architecture

Ten chapters provide enough space to move from interface meaning to professional API-quality judgement without treating each protocol concern as a standalone course.

```text
API quality purpose and boundaries
  → interface semantics and representations
  → contracts and compatibility
  → state, errors, and repeatability
  → query and data integrity
  → identity and authorization expectations
  → asynchronous and dependent interactions
  → reliability, diagnostics, and performance evidence
  → sustainable API feedback and learning
  → API Quality Strategy and Evidence Portfolio
```

REST and HTTP are taught where they illuminate interface semantics. They are not treated as synonyms for APIs. GraphQL, RPC, event-driven interfaces, webhooks, and asynchronous messaging appear when their boundary, contract, state, or evidence implications differ materially.

---

## Proposed Chapter Plan

### Chapter 1 — API Quality Engineering: Boundaries, Outcomes, and Evidence

- **Purpose:** Establish APIs as engineering boundaries with customer, consumer, provider, data, and operational consequences; define API Quality Engineering's relationship to Part III evidence strategy.
- **Key concepts:** API boundary; interface participants; customer outcome; contract assumption; evidence question; API styles; ownership; API-quality risk; evidence limitation.
- **QA → QE transition contribution:** Moves the learner from checking endpoint availability to framing an interface risk, decision, boundary, oracle, and residual uncertainty.
- **Practical activity:** Create an API Quality Context Map for a fictional order-confirmation interaction, showing consumers, providers, data, identity, dependencies, and customer-visible outcomes.
- **Dependencies:** Parts I–III, especially Part III Chapters 1, 2, 6, and 9.
- **Scope boundary:** Does not teach HTTP syntax, API-client tools, contract-test tooling, or service architecture implementation.
- **Professional evidence:** A concise API boundary and risk map with an evidence-placement rationale.

### Chapter 2 — Interface Semantics: HTTP, Representations, and API Styles

- **Purpose:** Build the protocol and representation literacy required to reason about API behaviour without turning the part into an HTTP reference.
- **Key concepts:** Request and response meaning; methods; status and error semantics; headers; media types; representations; metadata; caching and conditional requests where relevant; REST constraints as context; RPC, GraphQL, event, and webhook contrasts.
- **QA → QE transition contribution:** Replaces status-code checking by habit with evidence questions about what an interface result actually means to a consumer and customer.
- **Practical activity:** Review fictional interface examples and distinguish structural validity, transport result, semantic outcome, pending state, and information still unknown.
- **Dependencies:** Chapter 1; Part II JSON and runtime-validation foundations.
- **Scope boundary:** Does not provide a protocol reference, prescribe REST, or teach GraphQL, gRPC, or message-broker tooling.
- **Professional evidence:** An Interface Semantics Review that names meaningful representations, metadata, state implications, and ambiguous outcomes.

### Chapter 3 — Contract Quality: Schemas, Semantics, Compatibility, and Evolution

- **Purpose:** Teach contract reasoning as a major API-quality capability, including the difference between a schema-valid message and a semantically correct interaction.
- **Key concepts:** OpenAPI and JSON Schema as description and validation mechanisms; required, optional, absent, null, empty, and defaulted values; semantic contracts; error contracts; consumer expectations; consumer-provider compatibility; versioning; deprecation; backward compatibility; change review.
- **QA → QE transition contribution:** Expands a schema assertion into an explicit, reviewable argument about consumer meaning, provider behaviour, and evolutionary risk.
- **Practical activity:** Perform a Contract and Compatibility Review for a fictional API change that modifies an optional field, default behaviour, enum value, and error representation.
- **Dependencies:** Chapters 1–2; Part III Chapters 3, 6, and 9.
- **Scope boundary:** Does not teach a specific contract-testing product, generate clients, or claim that an API description completely defines service behaviour.
- **Professional evidence:** A contract-diff assessment with compatibility assumptions, affected consumers, selected evidence, and release safeguards.

### Chapter 4 — Stateful API Behaviour: Validation, Errors, Idempotency, and Concurrency

- **Purpose:** Examine the path from request validation through state transition and side effect to response and downstream consequence.
- **Key concepts:** Validation; malformed and invalid representations; domain rejection; resource absence; conflicting state; error contracts; partial success; idempotency; retries; duplicate submission; idempotency keys where relevant; concurrency; race conditions; ordering; authoritative state.
- **QA → QE transition contribution:** Moves beyond “invalid payload returns 400” to evaluating whether the API safely communicates and preserves the intended customer and business outcome under repetition or contention.
- **Practical activity:** Create a State and Side-Effect Evidence Model for a fictional refund or order-cancellation API, including duplicate request and unknown-timeout outcomes.
- **Dependencies:** Chapters 1–3; Part II Chapters 6–7; Part III Chapters 4, 6, 7, and 9.
- **Scope boundary:** Does not prescribe one status-code taxonomy, distributed-transaction implementation, or chaos experiment.
- **Professional evidence:** A state-transition, negative-behaviour, and idempotency evidence plan with defined oracles and residual risk.

### Chapter 5 — API Data Quality: Queries, Collections, and Representational Integrity

- **Purpose:** Apply data-quality reasoning to API representations and collection behaviour, where apparently correct individual responses can still mislead consumers.
- **Key concepts:** Field correctness; representation integrity; pagination; cursors and offsets conceptually; filtering; sorting; aggregation; consistency between write and read paths; duplicate and stale records; data identity; snapshot and time boundaries; data provenance.
- **QA → QE transition contribution:** Shifts from checking a few response fields to challenging whether an API's data is complete, unique, current, consistently ordered, and fit for the consumer's decision.
- **Practical activity:** Produce a Collection and Query Integrity Review for a fictional orders API, including pagination stability, filter semantics, sorting ties, and read-after-write limits.
- **Dependencies:** Chapters 2–4; Part II Chapter 3; Part III Chapter 8.
- **Scope boundary:** Does not become a SQL, reconciliation, analytics, or data-pipeline curriculum; those belong to Part VI.
- **Professional evidence:** A query/data evidence matrix that states business definitions, selected boundary conditions, and unresolved consistency risk.

### Chapter 6 — Identity at the API Boundary: Authentication, Authorization, and Safe Behaviour

- **Purpose:** Teach authentication and authorization as observable API-quality and security expectations, grounded in resource ownership and intended access decisions.
- **Key concepts:** Authentication versus authorization; missing, invalid, expired, and scoped credentials; roles and permissions; resource ownership; tenant boundaries; least-privilege expectations; safe error disclosure; token and secret handling; escalation to security specialists.
- **QA → QE transition contribution:** Replaces a simple “authorized/unauthorized” request pair with a reasoned authorization evidence matrix tied to protected outcomes and trust boundaries.
- **Practical activity:** Build an Authorization Evidence Matrix for a fictional account API that includes role, ownership, scope, expired credential, and safe-error scenarios.
- **Dependencies:** Chapters 1–5; Part I systems thinking; Part III Chapter 8.
- **Scope boundary:** Does not teach offensive security, penetration testing, OAuth/OIDC implementation, cryptography, or a complete security assessment; Part X owns deep security engineering.
- **Professional evidence:** An authorization-behaviour review with assumptions, threat-aware questions, evidence limits, and specialist hand-off criteria.

### Chapter 7 — Dependent and Asynchronous APIs: Events, Webhooks, Third Parties, and Controlled Evidence

- **Purpose:** Apply service-boundary reasoning to APIs whose outcomes cross internal services, callbacks, webhooks, events, suppliers, or delayed processing.
- **Key concepts:** Accepted versus completed outcomes; event and webhook contracts; eventual consistency; duplicate, late, and reordered delivery; third-party API risk; service virtualization; real versus controlled dependencies; failure injection; recovery and reconciliation expectations.
- **QA → QE transition contribution:** Develops the judgement to choose a represented failure, a compatible real boundary, or broader workflow evidence—and to state what each leaves unknown.
- **Practical activity:** Design a Dependency and Asynchronous Evidence Strategy for a fictional payment-provider callback and fulfillment workflow.
- **Dependencies:** Chapters 3–6; Part III Chapters 6, 7, and 9.
- **Scope boundary:** Does not implement message brokers, provider sandboxes, service-virtualization products, or resilience infrastructure.
- **Professional evidence:** A dependency decision record that explains control-versus-representativeness trade-offs, recovery observations, and residual third-party risk.

### Chapter 8 — API Reliability, Diagnostics, and Performance Evidence

- **Purpose:** Establish API-specific questions about time, failure, recovery, observability support, and performance without claiming operational or specialist depth.
- **Key concepts:** Latency and throughput as contextual evidence; timeout and retry behaviour; rate limits; saturation and dependency impact; request and correlation identifiers; safe logs, traces, and diagnostic metadata; error context; health versus customer outcome; reliability and performance evidence limits.
- **QA → QE transition contribution:** Enables the learner to turn opaque API failures and broad claims such as “fast” or “reliable” into observable, decision-relevant questions and safe diagnostic needs.
- **Practical activity:** Produce an API Reliability and Diagnostic Evidence Plan for an account-update API with timeout, throttling, and delayed-completion conditions.
- **Dependencies:** Chapters 4, 6, and 7; Part II Chapters 6–8; Part III Chapters 7–9.
- **Scope boundary:** Does not build observability platforms, define SLOs, conduct load testing, or design resilience architecture; Parts VIII and X own those specialisms.
- **Professional evidence:** A reliability/evidence profile that distinguishes product-quality questions, engineering capabilities, diagnostic data, and specialist follow-up.

### Chapter 9 — Sustaining API Quality: Change Impact, Regression, and Production Learning

- **Purpose:** Apply Part III feedback selection and defect-learning practices specifically to evolving APIs, consumer changes, contract versions, and production API failures.
- **Key concepts:** Change impact; API regression portfolio; contract drift; consumer and provider release coordination; compatibility checks; focused versus broader feedback; API quality metrics as prompts, not targets; production API signals; defect learning; safe change communication.
- **QA → QE transition contribution:** Moves the learner from rerunning an endpoint collection to maintaining a decision-relevant API evidence portfolio that evolves when contracts, consumers, data, or incidents change.
- **Practical activity:** Create an API Change and Regression Plan for a fictional deprecation, including consumer communication, contract evidence, selected negative paths, production-learning question, and residual risk.
- **Dependencies:** Chapters 1–8; Part III Chapters 10–11.
- **Scope boundary:** Does not implement CI/CD pipelines, test selection platforms, operational monitoring, or automation-framework architecture.
- **Professional evidence:** A maintainable API regression and change-risk policy with explicit evidence decay and review triggers.

### Chapter 10 — Capstone: API Quality Strategy and Evidence Portfolio

- **Purpose:** Integrate Part IV into a portfolio-ready API-quality artefact that makes interface, state, identity, data, dependency, reliability, compatibility, and residual-risk decisions inspectable.
- **Key concepts:** API context and decision framing; contract and semantic review; state/side-effect model; negative and authorization evidence; data/query integrity; dependency and asynchronous strategy; diagnostic needs; compatibility; regression; production learning; Quality Decision Brief.
- **QA → QE transition contribution:** Demonstrates API-specific engineering judgement: connecting a customer outcome to interface assumptions, evidence boundaries, limitations, and accountable action.
- **Practical activity:** Produce an API Quality Strategy and Evidence Portfolio for a fictional Atlas Commerce order-confirmation API change.
- **Dependencies:** Chapters 1–9 and Parts I–III.
- **Scope boundary:** Does not require a production API, full automation framework, CI/CD implementation, live credentials, penetration test, performance campaign, or operational platform.
- **Professional evidence:** A safely shareable API Quality Strategy and Evidence Portfolio with a Quality Decision Brief, stated exclusions, and a learning plan.

---

## Curriculum Progression Rationale

The curriculum begins with API boundaries and interface semantics so the reader does not mistake a successful transport exchange for a completed customer outcome. Contract quality follows because structural conformance, meaning, compatibility, and evolution determine whether consumers can use an interface safely.

State, errors, repetition, and query/data behaviour then deepen the reader's ability to reason about what an API changes and represents. Identity expectations follow because authorization must be evaluated as behaviour at the boundary, not appended as a generic negative case. Dependent and asynchronous interactions extend the same approach to webhooks, events, third parties, partial completion, and controlled evidence. Reliability, diagnostics, and performance evidence prepare the reader to understand difficult API outcomes without consuming the later observability, resilience, or performance curricula.

The final chapter before the capstone applies regression and production learning to evolving contracts. The capstone then assembles one API-specific chain of reasoning. It deliberately differs from Part III's broad test-strategy capstone: it goes deeper into interface contract, semantic, state, identity, data, dependency, compatibility, and API-evolution decisions.

---

## API Tooling and Language Strategy

### Primary learning approach: TypeScript with standards-oriented primitives

Part IV should use small TypeScript examples where executable work clarifies an API-quality decision. This extends Part II's programming foundation and makes JSON, runtime validation, asynchronous completion, error handling, and diagnostic design directly applicable. Future examples should favour platform-standard, `fetch`-style requests and narrowly scoped validation utilities over a framework abstraction.

This is an educational implementation choice, not a claim that TypeScript is required for API Quality Engineering. It supports reproducibility, portability, and later transfer to other languages and toolchains. Any future executable companion should reuse the repository's established Node.js baseline unless a Part IV compatibility decision explicitly changes it.

### Supporting tools, kept subordinate to the concept

- Use `curl` selectively when the request/response exchange itself is clearer than code.
- Treat OpenAPI and JSON Schema as interface-description and validation standards, not proof of semantic correctness.
- Mention API-client tools, including graphical clients, only as optional exploratory aids; no workflow depends on a commercial or graphical client.
- Reserve Playwright API facilities, REST Assured, Pact, framework-specific virtualization, and suite architecture for examples only when a later approved learning objective requires them. Framework-scale design belongs to Part V.

The learning sequence remains: **risk and outcome → contract or state assumption → evidence boundary → bounded mechanism → observation and limitation**.

---

## Delivery Groups

| Delivery | Chapters | Drafting and review outcome | Planned applied work |
|---|---|---|---|
| Delivery 1 — API Foundations and Semantics | 1–2 | Readers can frame API-quality questions and interpret request, response, metadata, representation, and API-style meaning. | API Quality Context Map and Interface Semantics Review. |
| Delivery 2 — Contract and Stateful Behaviour | 3–4 | Readers can evaluate structural and semantic contracts, compatibility, validation, errors, state transitions, idempotency, and concurrency risk. | Contract and Compatibility Review; State and Side-Effect Evidence Model. |
| Delivery 3 — Data and Identity at the Boundary | 5–6 | Readers can reason about query/data integrity and authorization behaviour without overclaiming data or security assurance. | Collection and Query Integrity Review; Authorization Evidence Matrix. |
| Delivery 4 — Dependencies, Reliability, and Diagnostics | 7–8 | Readers can choose dependency strategies and frame API-specific asynchronous, reliability, diagnostic, and performance evidence. | Dependency and Asynchronous Evidence Strategy; API Reliability and Diagnostic Evidence Plan. |
| Delivery 5 — Sustainable API Quality and Capstone | 9–10 | Readers can sustain API evidence through change and production learning, then integrate the part into an inspectable API-quality strategy. | API Change and Regression Plan; API Quality Strategy and Evidence Portfolio. |

Each delivery is intentionally suitable for the established sequence: draft, independent technical/editorial/learning review, targeted correction, then the next delivery. No delivery implies chapter approval or publication; the Quality Gates govern those later decisions.

---

## Practical Learning Strategy

Part IV practical work should require engineering decisions rather than accumulation of API test cases. Each activity should ask the learner to explain:

- why the behaviour matters to a customer, consumer, provider, or decision-maker;
- which contract, state, data, identity, dependency, or timing assumption creates risk;
- what evidence is appropriate and which boundary should provide it;
- what must remain real, what may be controlled, and what the choice removes;
- what the evidence does not establish; and
- what residual risk, safeguard, specialist collaboration, or learning action remains.

Planned portfolio-quality artefacts are the API Quality Context Map, Interface Semantics Review, Contract and Compatibility Review, State and Side-Effect Evidence Model, Collection and Query Integrity Review, Authorization Evidence Matrix, Dependency and Asynchronous Evidence Strategy, API Reliability and Diagnostic Evidence Plan, API Change and Regression Plan, and API Quality Strategy and Evidence Portfolio.

### Practical-artifact reuse guidance

Exercises may be completed independently, and instructors may select a relevant subset. Where it improves learning, a learner may progressively reuse and refine one fictional Atlas Commerce evidence portfolio across chapters: retain earlier assumptions and limitations, then extend them as the later exercise introduces state, data, identity, dependencies, reliability, change, and decision communication. The objective is inspectable engineering judgement, not document volume or a mandatory instructional process.

**Pass 2 enrichment decision record:** The following future enrichment has been reviewed and recommended, subject to separate authorization: a small deterministic Atlas Commerce companion API; **Lab 1 — Contract and State Behaviour** after Chapter 4; and **Lab 2 — Dependencies and Reliability** after Chapter 8. These are not prerequisites for the Part IV manuscript quality gate or the Final Part IV Quality Gate. No lab, diagram, case study, or code asset is created by this curriculum design.

---

## Companion Code Recommendation

**A deliberately small, local, deterministic fictional service is recommended as Pass 2 enrichment, subject to separate authorization.** It should support a small number of concepts repeatedly rather than becoming a production application or an automation platform. It is not a prerequisite for the Part IV manuscript or Final Part IV Quality Gate.

The proposed setting is an **Atlas Commerce Order and Fulfilment API** with synthetic data only. Its conceptual capabilities are:

- JSON representations, meaningful headers, and safe diagnostic/correlation identifiers;
- request validation, documented domain and dependency error outcomes, and controlled error conditions;
- order submission, cancellation, and fulfilment state transitions with idempotent submission behaviour;
- paginated, filtered, and sorted order queries with defined data and consistency limits;
- fictional roles, ownership rules, and non-secret authorization fixtures;
- a controlled payment or fulfilment dependency, including timeout and delayed-completion conditions;
- a versioned response or contract change for compatibility review; and
- a simulated callback or event record for asynchronous-outcome reasoning.

The companion would be local, bounded, reproducible, and explicitly non-production. It would not implement a general test framework, browser automation, CI/CD pipeline, real identity provider, message broker, cloud deployment, performance harness, or security-testing platform.

---

## Capstone Decision

**A capstone is recommended.** Chapter 10 should be titled **API Quality Strategy and Evidence Portfolio**.

The learner will produce one concise, safely shareable portfolio for a fictional API change. It should include:

- API and customer-outcome context, decision owner, and scope;
- contract and semantic assumptions, including compatible consumer expectations;
- request-to-state-to-side-effect model;
- selected positive, negative, duplicate, timeout, and partial-outcome evidence questions;
- data/query integrity and authorization evidence;
- dependency, asynchronous, and controlled-versus-real evidence decisions;
- diagnostic and correlation-information needs;
- compatibility, regression, and production-learning plan;
- exclusions, specialist hand-offs, safeguards, and residual risk; and
- a concise API Quality Decision Brief.

The capstone demonstrates API Quality Engineering judgement. It does not claim framework engineering, production deployment, deep security assessment, load testing, SRE implementation, or data-engineering capability.

---

## Explicit Scope Boundaries

| Deferred material | Owning handbook part |
|---|---|
| Framework-scale API automation, automation architecture, suite/platform design, reusable framework abstractions, and CI-driven automation systems | Part V — Automation Engineering |
| SQL, database implementation, reconciliation engineering, pipelines, lineage platforms, and data-quality frameworks | Part VI — Data Quality Engineering |
| CI/CD implementation, deployment controls, infrastructure, containers, and cloud environments | Part VII — Cloud & DevOps |
| Logging, metrics, traces, SLOs, incident command, resilience implementation, and SRE practice | Part VIII — Observability & Reliability Engineering |
| Penetration testing, offensive security, threat-model implementation, vulnerability assessment, and deep identity/security engineering | Part X — Performance & Security Engineering |
| Deep distributed-system design, architectural governance, and service-platform topology | Part XI — System Design & Architecture |

Part IV may introduce these domains only to identify an API-quality question, boundary, collaboration need, or evidence limit. It does not transfer specialist ownership to the Quality Engineer.

---

## MQE-BOK and QA → QE Transition Framework Mapping

**Primary MQE-BOK domain:** Domain 4 — API Quality Engineering.

**Primary Transition Framework domain:** API & Integration Engineering.

**Contributing Transition Framework domains:**

- Quality & Testing Foundations — risk-informed evidence, oracles, exploratory learning, and evidence limits;
- Programming Foundations — bounded TypeScript, JSON, validation, asynchronous, error, and diagnostic capability;
- Quality Strategy & Risk Engineering — API-specific risk, evidence, release, and residual-risk decisions;
- Systems Thinking & Architecture — interfaces, ownership, dependencies, state, failure propagation, and trade-offs;
- Security Awareness — identity, authorization, trust boundaries, and specialist escalation;
- Observability & Reliability — safe diagnostic support, recovery questions, and runtime-learning preparation; and
- Communication, Leadership & Influence — contract review, cross-team clarification, consumer/provider communication, and accountable decision support.

The intended progression is from **Foundation** capability—recognising an API boundary and basic contract—to **Practitioner** capability—producing focused API or contract evidence with guidance—to **Engineer** capability—designing a proportionate API-quality strategy that states trade-offs and limitations. These are the framework's observable capability descriptions, not title, certification, or hiring claims.

---

## Reference Strategy

Chapter manuscripts should use primary standards and specifications for protocol and contract claims, then clearly distinguish those sources from MSQE educational framing. Likely core references include:

- IETF, [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html);
- IETF, [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html), where error-representation discussion needs a formal HTTP reference;
- OpenAPI Initiative, [OpenAPI Specification](https://spec.openapis.org/oas/latest.html);
- JSON Schema, [Specification](https://json-schema.org/specification);
- GraphQL Foundation, [GraphQL Specification](https://spec.graphql.org/), when a contrast with HTTP resource-oriented interfaces adds learning value;
- AsyncAPI Initiative, [AsyncAPI Specification v3.1.0](https://www.asyncapi.com/docs/reference/specification/v3.1.0), for event and asynchronous interface descriptions;
- OWASP Foundation, [OWASP API Security Project](https://owasp.org/www-project-api-security/), as security-awareness guidance rather than a complete security-testing method;
- ISO/IEC, [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html), with product-quality characteristics kept distinct from engineering capabilities such as testability and observability;
- ISO/IEC/IEEE, [ISO/IEC/IEEE 29119-2:2021 — Test processes](https://www.iso.org/standard/79428.html); and
- IEEE Computer Society, [SWEBOK Guide v4.0a](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf).

OAuth/OIDC and other identity specifications should be introduced only where the manuscript's security-boundary claim requires their primary sources. Practitioner literature may illustrate a bounded trade-off, but it must not be presented as a universal API rule or substitute for a standard.

---

## Curriculum Approval Record

The approved curriculum:

- advances Part III's evidence strategy into API-specific contract, state, and interaction reasoning without repeating its general theory;
- uses Part II programming fluency without becoming an automation-framework course;
- preserves the boundary between Part IV API Quality Engineering and Part V Automation Engineering;
- teaches HTTP and REST accurately without equating either with all APIs;
- distinguishes structural schema validity from semantic correctness, and ISO/IEC product-quality characteristics from engineering capabilities;
- includes state, side effects, identity, data, dependencies, failure behaviour, diagnostics, compatibility, regression, and residual risk in proportionate scope;
- supports the approved chapter template and Quality Gates; and
- has an agreed reference, practical-learning, companion-code, and capstone strategy.

Deliveries 1–5 quality reviews are complete at 96/100 each, and the Final Part IV Quality Gate passed at 97/100 with no P0 or P1 findings. Part IV manuscript drafting and normalization are complete; an intentional version-control baseline is next. Chapter metadata remains Draft, and companion API and laboratory enrichment remain future Pass 2 work.
