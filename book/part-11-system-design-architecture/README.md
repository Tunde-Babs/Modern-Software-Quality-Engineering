# Part XI — System Design & Architecture

---

## Curriculum Status

**Final Part XI Quality Gate passed at 96/100 — verdict A. Controlled manuscript baseline `7067ebb54cba199a9215363188171d2e4966ed15`. Release-administration metadata for v0.14.0 is prepared.** Part XI is planned for **v0.14.0 — System Design & Architecture Complete**, which remains **planned and unreleased**. All twelve chapters carry `Status: Draft`. The Final Gate recorded **no P0, no P1, and no P2 finding**, with six non-blocking P3 items. No release branch, tag, or GitHub Release exists. No Part XI laboratory, diagram, ADR example, simulator, dataset, companion implementation, case-study file, website asset, CI/CD configuration, or infrastructure has been created.

The independent architecture review returned verdict **B — targeted architecture corrections required before Pass 1**, with no P0 finding, one P1 standards-accuracy finding on ISO/IEC 25010:2023 terminology, two bounded P2 architecture refinements, and one P3 source-label refinement. It did not require redesign: the 12-chapter progression, QA → QE progression, Atlas Commerce baseline, capstone, source strategy, accelerated workflow, and cross-part boundaries were accepted in principle. Those corrections have now been applied to this document and verified by a focused closure review. The 97/100 figure is an architecture-review score; it is **not** a Final Part XI Quality Gate result. The Final Gate is a separate, later event and is recorded in the ledger below.

### Part XI review-event ledger

Four separate review events produced four separate scores. **They are distinct events and must not be collapsed**; in particular the two 96/100 results are different reviews.

| # | Review event | Score | Result |
| --- | --- | --- | --- |
| 1 | Independent curriculum-architecture review | **97/100** | B — targeted corrections required before Pass 1. Corrections applied and **closed**. |
| 2 | Consolidated independent manuscript review (Chapters 1–12) | **94/100** | B — targeted corrections required before Final Quality Gate. No P0; 2 P1; 4 P2; 6 P3. |
| 3 | Focused P1/P2 closure review | **96/100** | P1/P2 closure confirmed. All 2 P1 and all 4 P2 corrected; no P0, P1, or P2 remaining. |
| 4 | **Final Part XI Quality Gate** | **96/100** | **A — FINAL QUALITY GATE PASSED; READY FOR PART XI MANUSCRIPT BASELINE.** P0 = 0, P1 = 0, P2 = 0, P3 = 6 non-blocking. |

Events 3 and 4 share a score of 96/100 by coincidence and are **not** the same review. Neither is related to Part VIII's 96/100 Final Quality Gate, which remains a separate historical result for a different part.

This document is the approved curriculum architecture. It defines the intended manuscript, its learning progression, scope boundaries, professional artefacts, source strategy, and Pass 2 classification, and it is authoritative for manuscript production. Every Part XI chapter carries `Status: Draft` under manuscript-status governance and retains it until governance authorizes another status.

Part X — Performance & Security Engineering is the latest released handbook part, as **v0.13.0**. Part XII — Engineering Leadership & Career Growth has not started.

---

## Mission

Part XI develops the ability to reason about **system design and architecture as Quality Engineering**. It helps experienced QA Engineers move beyond the question, *“Does this component work?”*, to a more useful series of questions:

> What system outcome is being claimed; which boundaries, constraints, assumptions, and architectural options shape that outcome; what evidence can support or invalidate the decision; and what residual risk remains?

The part is not a generic software-architecture textbook, a design-pattern catalogue, a distributed-systems theory survey, an interview-preparation syllabus, a certification course, a microservices advocacy programme, or an enterprise-governance curriculum. It teaches a Quality Engineer to contribute credible architectural reasoning and evidence without claiming to be the sole owner of an architecture decision.

Architecture is treated as a set of consequential choices about structure, responsibilities, interactions, state, deployment, failure containment, evolution, and evidence. The purpose is not to prescribe a universal topology. It is to teach readers to make assumptions and trade-offs visible, select proportionate evidence, communicate limitations, and revise decisions when the system or its context changes.

---

## Intended Reader and Prerequisites

Part XI is for experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and aspiring Quality Engineers who need to participate confidently in architecture conversations and quality decisions.

Completion of Parts I–X is recommended, particularly:

- Part I for systems thinking, quality characteristics, and shared quality ownership;
- Part III for risk-informed testing, testability, evidence, and investigation;
- Part IV for API contracts, interface semantics, asynchronous completion, state, and dependency behaviour;
- Part V for trustworthy automated feedback, determinism, diagnosability, and test-selection boundaries;
- Part VI for data ownership, provenance, reconciliation, data contracts, and decision integrity;
- Part VII for delivery-system constraints, deployment evidence, configuration, promotion, and recovery decisions;
- Part VIII for operational evidence, reliability claims, resilience, recovery, and observability limitations;
- Part IX for uncertainty, evidence boundaries, and explicit limitation/ownership language; and
- Part X for performance and security claims, workload/threat assumptions, trust boundaries, and specialist-evidence handoffs.

Readers do not need a production system, a commercial modelling tool, a cloud account, or authority to approve an architecture. Atlas Commerce scenarios and all evidence described here will be synthetic and clearly labelled as illustrative.

---

## Scope, Boundaries, and Handoffs

| Part XI owns | Part XI does not own |
| --- | --- |
| Architecture-quality reasoning: context, boundaries, constraints, alternatives, assumptions, trade-offs, evidence, decisions, residual risk, and revision triggers | A universal architecture, a mandatory microservices journey, a design-pattern catalogue, or a software-architecture certification syllabus |
| Structural, runtime, data, trust, deployment, ownership, failure, and transactional boundary analysis | Cloud provisioning, CI/CD implementation, production-operations process, or infrastructure administration |
| Style and decomposition trade-offs, coupling, dependency direction, state ownership, communication choices, and evolution paths | A distributed-systems mathematics course, vendor product tutorials, or a claim that one style is inherently superior |
| Architecture evidence, proportionate fitness functions, ADR reasoning, and Quality Engineer participation in review | Replacing the accountable architecture, product, release, security, or operational decision owner |
| Explicit handoffs for performance, security, reliability, observability, testability, data, and delivery implications | Deep implementation curricula already owned by Parts III–X |

The handoffs below are deliberate. A Part XI chapter may use an adjacent-part concept only far enough to establish an architectural condition, decision, or evidence boundary.

| Adjacent part | Part XI contribution | Remains with the adjacent part |
| --- | --- | --- |
| Part III — Software Testing Engineering | Make testability and architecture evidence design concerns; identify what a chosen boundary enables or prevents from being tested. | Test theory, test-design techniques, exploratory investigation, regression strategy, and detailed test implementation. |
| Part IV — API Quality Engineering | Treat APIs, events, schemas, error/timeout/retry semantics, and compatibility as architecture-relevant contracts. | Protocol semantics, API design curriculum, identity engineering, and contract-test implementation. |
| Part V — Automation Engineering | Identify repeatable architecture checks and feedback needs when they are decision-relevant. | Automation-framework design, execution architecture, fixtures, test selection, and tool implementation. |
| Part VI — Data Quality Engineering | Reason about state ownership, shared versus isolated stores, migration, reconciliation, and data-boundary consequences. | Data pipelines, lineage, data-product governance, data-quality measurement, and database implementation. |
| Part VII — Cloud & DevOps | Use deployment, configuration, promotion, and recovery constraints as architecture inputs. | Delivery pipelines, IaC, environment configuration, rollout implementation, and release administration. |
| Part VIII — Observability & Reliability Engineering | Identify observability, operability, recovery, and failure-containment needs at architecture time. | Telemetry implementation, SLI/SLO design, error budgets, alerting, incident practice, and fault-injection operations. |
| Part IX — AI Quality Engineering | State architecture boundaries where an AI capability creates a dependency, data, tool-use, or evaluation concern. | AI evaluation, model safety, prompt injection, RAG, and agentic-system quality. |
| Part X — Performance & Security Engineering | Use performance/security claims, workloads, assets, and trust boundaries as architecture constraints; request specialist evidence. | Workload experiments, threat modelling depth, security controls, vulnerability assessment, and performance testing implementation. |
| Part XII — Engineering Leadership & Career Growth | Record decision ownership, escalation, and collaboration needs without assigning authority by title. | Organisation design, governance operating models, leadership, career progression, and formal decision rights. |

---

## Learning Outcomes

After completing the planned manuscript and exercises, readers should be able to:

- define an architecture-quality claim with a context, stakeholder concern, system boundary, constraint, evidence boundary, owner, limitation, and revision trigger;
- distinguish an architecture from an architecture description, and explain why a diagram, view, or decision record expresses an architecture without demonstrating its quality;
- name the nine ISO/IEC 25010:2023 top-level product-quality characteristics accurately, keep interoperability within compatibility rather than treating it as top-level, use the current interaction capability and flexibility labels instead of the superseded usability and portability labels, and distinguish all of them from engineering capabilities such as testability, observability, deployability, operability, recoverability, and scalability;
- express a quality concern as a scenario with a source, stimulus, environment, affected system or artifact, response, and response measure, and connect it to constraints, sensitivity points, trade-off points, and residual risk;
- map system, service/component, process, data, trust, deployment, ownership, failure, and transactional boundaries and explain their quality implications;
- compare modular-monolith, layered, client/server, service-oriented, microservices, event-driven, message-based, pipeline, and serverless approaches as contextual trade-off sets;
- analyse coupling, cohesion, dependency direction, cycles, contract, runtime, temporal, deployment, and data coupling without treating “low coupling” as a universal answer;
- reason about synchronous and asynchronous communication, backpressure, ordering, duplicate delivery, idempotency, unknown state, and recovery evidence;
- evaluate state ownership, consistency choices, caching, retry behaviour, reconciliation, and migration conditions without making unsupported distributed-systems claims;
- identify how architecture affects testability, observability, security, performance, recoverability, deployability, operability, and system evolution;
- select proportionate architecture evidence, including prototypes, benchmarks, contract checks, dependency maps, failure experiments, telemetry, structure checks, and review records;
- write and critique an Architecture Decision Record (ADR) that records alternatives, consequences, evidence, limitations, and revision conditions; and
- produce a System Design & Architecture Quality Strategy and Evidence Portfolio that supports a bounded decision without claiming architectural ownership or certainty.

---

## Curriculum Design Decision

### Recommended architecture: 12 chapters

The recommended architecture contains **12 chapters**. This is not a mechanical reuse of earlier parts. It separates four foundational reasoning capabilities (claims, boundaries, communication, and state), six distinct decision capabilities (styles, quality implications, engineering capabilities, contracts/change, evidence/ADRs, and evolution), one integrated decision chapter, and one capstone. Combining these concerns would either collapse essential trade-offs into a generic survey or repeat the implementation curricula of Parts IV, VII, VIII, and X.

| Stage | Chapters | Central question | Cumulative learner output |
| --- | --- | --- | --- |
| Establish architecture context | 1–4 | What system claim, boundary, interaction, and state condition must be understood before selecting an option? | Architecture Claim Canvas; Boundary and Dependency Map; Interaction and Failure Analysis; State and Consistency Decision Record |
| Evaluate structure and quality consequences | 5–8 | Which structural and contract choices suit the stated quality concerns, and what do they make harder? | Style Trade-off Assessment; Quality-Attribute Scenario Set; Engineering-Capability Review; Contract and Change-Impact Record |
| Make evidence-led, evolvable decisions | 9–11 | What evidence, decision record, evolution path, and cross-quality judgement are credible now? | Architecture Evidence Plan and ADR; Evolution and Migration Strategy; Integrated Architecture Decision Brief |
| Synthesize a defensible recommendation | 12 | What option should be recommended under incomplete evidence, and how will it be revisited? | System Design & Architecture Quality Strategy and Evidence Portfolio |

### Central MSQE Architecture Decision Reasoning Model

Part XI will use the following **MSQE teaching model**, not an industry standard, maturity model, or scoring system:

```text
CONTEXT
  → QUALITY ATTRIBUTE / CLAIM
  → CONSTRAINT
  → ARCHITECTURAL OPTION
  → ASSUMPTION
  → TRADE-OFF
  → FAILURE MODE
  → EVIDENCE
  → DECISION
  → RESIDUAL RISK
  → REVISION TRIGGER
  → OWNER
```

The model is intentionally directional, not a checklist that guarantees a correct architecture. Its purpose is to prevent unsafe shortcuts such as treating a pattern name, a diagram, a benchmark, or an ADR as proof. A learner must be able to move both forward—from context to decision—and backward—from an observed failure or changed constraint to the assumption and decision that need revision.

### Quality-model discipline

[ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) defines a product-quality model with **nine top-level characteristics**. Part XI will use the standard as a reference model for framing **product-quality concerns** and will name those characteristics exactly as the current edition does:

| ISO/IEC 25010:2023 top-level characteristic | Typical architecture-relevant concern in Part XI |
| --- | --- |
| Functional suitability | Whether the intended system outcome is achieved correctly and appropriately under stated conditions. |
| Performance efficiency | Whether time and resource behaviour meets a stated expectation under a stated workload and dependency condition. |
| Compatibility | Whether components, consumers, and environments can coexist and exchange information as intended. **Interoperability is a subcharacteristic of compatibility**, not a top-level characteristic. |
| Interaction capability | Whether intended users can interact with the system effectively in the relevant context. This is the current top-level characteristic; **usability** is the former label and is used here only as plain-language shorthand. |
| Reliability | Whether the system performs and recovers appropriately under relevant conditions and failure modes. |
| Security | Whether information, operations, and trust boundaries are protected against relevant threats. |
| Maintainability | Whether the system can be analysed, modified, verified, and evolved at acceptable cost and risk. |
| Flexibility | Whether the system adapts appropriately to relevant changes in environment, configuration, or usage context. **Flexibility replaces the former top-level Portability characteristic**; portability concerns are framed as flexibility, and adaptability is one of its subcharacteristics. |
| Safety | Whether unacceptable risk of harm to people, property, the environment, or comparable interests is avoided or controlled. **Safety is a top-level characteristic in the 2023 edition**, added in that revision. |

Three terminology rules follow, and the manuscript will apply them consistently:

- **Do not mix editions.** Older material treats usability and portability as top-level characteristics. Part XI will not present them as current ISO/IEC 25010:2023 top-level characteristics, and it will not present the 2011 and 2023 vocabularies as interchangeable.
- **Do not conflate interaction capability with interoperability.** They are different concerns at different levels of the model: interaction capability is a top-level characteristic about users; interoperability sits within compatibility and concerns information exchange between elements.
- **Do not invent characteristics.** Part XI will not add an item to the nine, and it will not silently rename one.

Part XI will not claim that every characteristic matters equally to every decision. It selects only the characteristics relevant to the stated architecture claim, constraint, and decision.

**Testability, observability, deployability, operability, recoverability, and scalability are engineering capabilities or architecture-relevant properties** in this handbook's usage. They help a team create, assess, operate, and improve quality. They are not additional ISO/IEC 25010:2023 top-level product-quality characteristics, and Part XI will not present them as such. Several of these words also exist inside the standard at subcharacteristic level, with a different meaning, and the manuscript will name the level it means rather than blurring standard vocabulary into broader MSQE engineering usage:

| Word | Meaning inside ISO/IEC 25010:2023 | Meaning in Part XI engineering usage |
| --- | --- | --- |
| Testability | A subcharacteristic of maintainability. | The architectural conditions — seams, isolation, controllability, determinism, substitution — that make evidence obtainable at all. |
| Operability | A subcharacteristic of interaction capability, concerning whether a **user** can operate the product. | Whether a **team** can run, diagnose, and intervene in the system safely in production. |
| Scalability | A subcharacteristic of flexibility. | An architecture-relevant property assessed against a stated workload, boundary, and constraint. |
| Modifiability | A subcharacteristic of maintainability. | Used only in the standard's sense; Part XI otherwise speaks of evolution and change impact. |
| Recoverability | A subcharacteristic of **reliability**, concerning the product's ability to recover data and re-establish its state after an interruption or failure. | The architectural conditions that allow a system to return to a correct state after a partial failure, and that allow anyone to **verify** that it did. |

**Observability and deployability** are not ISO/IEC 25010:2023 characteristics or subcharacteristics at any level; Part XI uses those two purely as engineering capabilities and will say so. The remaining words in the table above do appear in the standard at subcharacteristic level, and the manuscript will name the level it means rather than denying the standard's usage. This mirrors the distinction already established in Part III.

**Verification limitation.** ISO/IEC 25010:2023 is a paywalled standard and `iso.org` returns HTTP 403 to automated clients, so its text has not been inspected directly. The characteristic and subcharacteristic placements recorded here are supported by multiple consistent secondary references and by the repository's already-reviewed Part III treatment. The Final Part XI Quality Gate re-attempted primary access and again received HTTP 403; no purchased copy was available to it either. **The gate therefore carried this control forward rather than closing it: direct verification against a purchased copy of ISO/IEC 25010:2023 — and of ISO/IEC/IEEE 42010:2022 on the same basis — remains outstanding.** Secondary verification has not been upgraded to primary.

### Architecture and architecture description

[ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) draws a distinction that Part XI depends on and will state explicitly in Chapter 1:

```text
ARCHITECTURE  ≠  ARCHITECTURE DESCRIPTION
```

The **architecture** comprises the fundamental concepts or properties of an entity — its structure, elements, relationships, and the principles of its design and evolution. An **architecture description (AD)** is the work product used to express that architecture: diagrams, views, viewpoints, models, and supporting records. The standard specifies requirements for architecture descriptions; it deliberately does not prescribe architectures themselves.

Two consequences shape the manuscript:

- A diagram, view, model, C4 sketch, or ADR **expresses or communicates** an architecture. It is not the architecture, and producing one is not evidence that the architecture is sound. A correct diagram of an unsuitable structure remains an unsuitable structure.
- An architecture description can be complete, current, and internally consistent while the deployed system behaves differently. Part XI therefore treats a description as one input to an evidence set, alongside prototypes, measurements, dependency analysis, failure experiments, and operational observation.

Part XI uses ISO/IEC/IEEE 42010:2022 for this vocabulary — architecture, architecture description, stakeholder, concern, view, and viewpoint — and for the discipline of tying a view to a stated concern. It does not teach the standard, require conformance to it, or convert Part XI into an architecture-description course.

---

## Atlas Commerce Architecture Baseline

All scenarios use **Atlas Commerce**, a fictional commerce platform. It is an educational baseline, not a claim about a real company or a recommended production architecture.

| Area | Stable teaching baseline |
| --- | --- |
| Customer surfaces | A storefront/web client supports browse, search, account access, checkout, order status, and support/refund interactions. |
| Core responsibilities | Account/identity, catalogue/search, checkout, payment, order management, fulfilment, notification, and support/refund responsibilities are distinguishable. They may initially be modules rather than independently deployable services. |
| System elements | Examples may include a frontend, API edge, core modules or services, relational state stores, a cache, a queue or broker, asynchronous workers, and bounded third-party identity and payment dependencies. |
| State and communication | The baseline includes request/response interactions and asynchronous work. It may expose delayed processing, retries, duplicate messages, out-of-order events, cache staleness, and unknown payment state. |
| Deployment and evidence | All environments, dependency behaviour, workload observations, failure records, and architecture evidence are synthetic. No production access or live third-party integration is required. |
| Decision ownership | The Quality Engineer contributes analysis and evidence. The relevant architecture, product, delivery, release, security, or operational authority owns the final decision. |

The baseline intentionally supports competing but defensible options:

- improve a **modular monolith** and strengthen internal module boundaries;
- extract a bounded responsibility or introduce an asynchronous boundary where a stated constraint justifies it; or
- propose a larger decomposition only when its benefits, costs, operational complexity, and migration evidence are explicit.

The curriculum will not imply that microservices are the destination. It will use the following recurring tensions: modular monolith versus service split; synchronous versus asynchronous checkout; shared versus isolated state; cache performance versus authorization/correctness; retries versus duplicates; isolation versus operational complexity; fan-out versus latency; and autonomy versus consistency.

---

## Proposed Chapter Architecture

Every future chapter will use the approved MSQE chapter template, clearly label Atlas Commerce scenarios as illustrative, define specialised terms at first meaningful use, distinguish standards from MSQE teaching models, state limitations, and include a practical exercise, references, and a checklist. The following architecture defines scope; it is not manuscript prose.

### Chapter 1 — System Design & Architecture as Quality Engineering

- **Mission:** Establish architecture as a quality-engineering concern: a set of decisions that shape outcomes, evidence, and future change rather than a diagram or a role title.
- **Core concepts:** Architecture, architecture description, stakeholder concern, view, viewpoint, context, quality claim, constraint, option, assumption, trade-off, evidence, limitation, residual risk, decision owner, and revision trigger; the MSQE Architecture Decision Reasoning Model; the nine ISO/IEC 25010:2023 top-level product-quality characteristics versus engineering capabilities such as testability, observability, deployability, operability, recoverability, and scalability.
- **Foundational distinction:** Architecture is not the same as an architecture description. Chapter 1 will state the ISO/IEC/IEEE 42010:2022 distinction, then show why a diagram, view, or ADR expresses an architecture without proving its quality.
- **Illustrative Atlas scenario:** Checkout works under a feature test but customers experience uncertain payment and delayed fulfilment after a dependency slowdown. The learner separates a component observation from a system claim.
- **QA → QE transition:** From “does the component work?” to defining the system outcome, architecture concern, evidence boundary, and accountable decision owner.
- **Worked reasoning:** Turn a vague “make checkout reliable and scalable” request into two bounded quality claims with a system boundary, population, constraint, missing evidence, and revision trigger.
- **Professional artifact:** Architecture Claim Canvas.
- **Prerequisites:** Parts I and III; Parts IV, VII, VIII, and X recommended.
- **Explicit exclusions:** No universal architecture definition, pattern catalogue, modelling-tool tutorial, ISO/IEC/IEEE 42010 conformance instruction, or claim that a Quality Engineer owns the architecture.
- **Handoff:** Supplies terms and the decision model used by every later chapter.

### Chapter 2 — Boundaries, Responsibilities, Coupling, and Dependencies

- **Mission:** Teach readers to map what a system is responsible for and where interactions, ownership, state, deployment, trust, and failure can diverge.
- **Core concepts:** System, service/component, process, data, trust, deployment, ownership, failure, and transactional boundaries; responsibility; coupling and cohesion; dependency direction; stable and volatile dependencies; cycles; contract, runtime, temporal, deployment, and data coupling.
- **Illustrative Atlas scenario:** Catalogue, checkout, payment, order management, and notification share database tables and call each other in ways that obscure ownership and failure propagation.
- **QA → QE transition:** From identifying a failing endpoint to revealing the boundary and dependency conditions that make a failure possible, hard to test, or hard to contain.
- **Worked reasoning:** Produce a boundary map, then compare a direct shared-table dependency with a versioned contract. State the testability, failure, deployment, data, and ownership consequences without declaring either universally correct.
- **Professional artifact:** Boundary, Responsibility, and Dependency Map.
- **Prerequisites:** Chapter 1; Part IV contract vocabulary and Part VI ownership/reconciliation concepts recommended.
- **Explicit exclusions:** No C4/UML notation training, enterprise-architecture taxonomy, database-normalisation course, or service-extraction mandate.
- **Handoff:** Establishes the structural vocabulary for communication, state, styles, contracts, evidence, and migration.

### Chapter 3 — Communication, Time, and Failure Across Boundaries

- **Mission:** Make communication choice an explicit architectural decision about time, availability, feedback, failure, and evidence.
- **Core concepts:** Request/response, command, event, queue, callback, polling, stream, synchronous and asynchronous interaction; latency, availability, temporal coupling, backpressure, ordering, retries, duplicate delivery, unknown state, and idempotency. **Idempotency** means that repeating an operation has no additional intended effect beyond the first successful application.
- **Illustrative Atlas scenario:** Checkout can wait synchronously for payment confirmation or accept an order and process a payment outcome asynchronously while customers need an honest order state.
- **QA → QE transition:** From testing a happy-path API response to assessing how communication timing, loss, duplicate work, delayed failure, and user feedback affect a system claim.
- **Worked reasoning:** Compare the two checkout options. Trace timeout → retry → duplicate/unknown payment outcome → required evidence → recovery/communication decision. State what an API response alone cannot establish.
- **Professional artifact:** Interaction, Time, and Failure Analysis.
- **Prerequisites:** Chapters 1–2; Part IV asynchronous and API-boundary fundamentals.
- **Explicit exclusions:** No broker configuration, streaming-platform tutorial, delivery-guarantee marketing claim, or Part VIII telemetry implementation.
- **Handoff:** Provides the interaction assumptions used by state/consistency, style, reliability, and performance reasoning.

### Chapter 4 — State Ownership, Consistency, and Transactional Boundaries

- **Mission:** Teach readers to identify who owns state, which consistency guarantee is relevant, and what evidence is needed when distributed work is incomplete or contradictory.
- **Core concepts:** State ownership; shared database versus isolated state; transaction boundary; strong and eventual consistency; read/write path; cache; stale data; duplicate and out-of-order work; reconciliation; idempotency; migration state; unknown outcome.
- **Illustrative Atlas scenario:** Payment accepts a request, order status is temporarily pending, and a duplicate fulfilment message appears after a retry. Support needs an evidence-backed view of what happened.
- **QA → QE transition:** From checking that data eventually matches a fixture to specifying the intended state transition, consistency window, evidence gap, reconciliation path, owner, and customer-facing consequence.
- **Worked reasoning:** Compare a shared checkout/order store with isolated state plus a reconciliation process. State the invariants, failure modes, observability and testability needs, migration cost, and residual risk.
- **Professional artifact:** State Ownership and Consistency Decision Record.
- **Prerequisites:** Chapters 1–3; Parts IV and VI recommended.
- **Explicit exclusions:** No database product tutorial, consensus-algorithm derivation, event-sourcing prescription, or data-governance curriculum.
- **Handoff:** Supports styles, contract evolution, resilience/recovery, and the capstone evidence portfolio.

**CAP treatment:** Chapter 4 will include one limited, accurate section titled *“CAP as a condition, not a slogan.”* It will explain that a network partition is a condition a distributed system may need to handle; it will reject the “choose any two” shorthand and avoid using CAP as a general architecture-selection scorecard. The section will only support reasoning about availability and consistency choices under a stated partition condition.

### Chapter 5 — Architectural Styles and Decomposition Trade-offs

- **Mission:** Compare structural styles as contextual trade-off sets rather than rankings or destinations.
- **Core concepts:** Modular monolith, layered architecture, client/server, service-oriented architecture, microservices, event-driven, message-based, pipeline, and serverless approaches; decomposition; autonomy; boundaries; operational complexity; incremental extraction.
- **Illustrative Atlas scenario:** Atlas must reduce change coupling between checkout and fulfilment. The learner compares a strengthened modular-monolith boundary, a bounded extracted service, and an asynchronous process boundary.
- **QA → QE transition:** From associating quality with a named style to asking how a style changes coupling, communication, state, deployment, failures, testing, observability, security, performance, and evolution.
- **Worked reasoning:** Evaluate three options using the central model. For each, state the component/deployment boundary, contract and state effects, failure containment, required evidence, and a reason not to choose it now.
- **Professional artifact:** Architectural Style and Decomposition Trade-off Assessment.
- **Prerequisites:** Chapters 1–4.
- **Explicit exclusions:** No microservices advocacy, cloud topology design, domain-driven-design course, serverless platform tutorial, or pattern catalogue.
- **Handoff:** Supplies options to assess against quality scenarios, capability needs, evidence, and migration paths.

### Chapter 6 — Quality Attributes, Constraints, and Trade-off Scenarios

- **Mission:** Translate broad quality language into bounded architecture scenarios that can guide a decision and its evidence.
- **Core concepts:** Product-quality characteristics, quality-attribute scenario and its parts, constraint, sensitivity point, trade-off point, utility/priority context, and residual risk. ISO/IEC 25010:2023 is a product-quality reference model, not an architecture recipe.
- **Scenario anatomy:** Chapter 6 will teach a six-part scaffold, drawn from established architecture-evaluation practice, for making a quality concern concrete enough to guide a decision:

  ```text
  SOURCE
    → STIMULUS
    → ENVIRONMENT
    → AFFECTED SYSTEM / ARTIFACT
    → RESPONSE
    → RESPONSE MEASURE
  ```

  The scaffold is a reasoning aid, not a mandatory form. A scenario is useful when it identifies who or what initiates a condition, what condition arrives, under which system state and environment, which element absorbs it, what the system is expected to do, and how that expectation would be observed or measured. Parts may be omitted when they add no clarity; a learner should be able to say why a part was left out and what uncertainty that leaves. Each scenario is then connected to its constraints, sensitivity points, trade-off points, priority/utility context, and residual risk, so the scenario set feeds a decision rather than becoming a document.
- **Illustrative Atlas scenario:** A promotion campaign creates demand for fast catalogue search, dependable checkout, secure authorization, maintainable pricing changes, and graceful behaviour when payment is slow.
- **QA → QE transition:** From converting a quality attribute into an isolated non-functional test to making explicit which outcome, population, constraint, trade-off, and owner matter to an architectural choice.
- **Worked reasoning:** Formulate scenarios for performance efficiency, reliability, security, maintainability, flexibility, compatibility (including an interoperability concern within it), and interaction capability, using the six-part scaffold and current ISO/IEC 25010:2023 terminology. Identify at least one sensitivity point and one trade-off point across the set, then explain why one uniform score or threshold cannot decide the architecture.
- **Professional artifact:** Quality-Attribute Scenario Set and Trade-off Ledger.
- **Prerequisites:** Chapters 1–5; Parts I, VIII, and X recommended.
- **Explicit exclusions:** No universal SLOs, load-test plan, security threat-model exercise, or ISO conformance claim.
- **Handoff:** The scenarios become acceptance/evidence inputs for Chapters 7–12.

### Chapter 7 — Architecture for Testability, Observability, Operability, and Recovery

- **Mission:** Treat the system’s ability to be evaluated, understood, deployed, operated, recovered, and changed as architecture-relevant capabilities.
- **Core concepts:** Testability, isolation, controllability, determinism, substitution, environment seams, contract/component/end-to-end evidence, failure simulation, architecture assertions, observability, deployability, operability, recoverability, and safe degradation.
- **Illustrative Atlas scenario:** A payment fault can be observed only through a third-party health signal, cannot be safely simulated in a test environment, and leaves order state ambiguous after a timeout.
- **QA → QE transition:** From adding tests after a design is chosen to contributing requirements for controllable seams, meaningful state, diagnostics, recovery evidence, and bounded failure simulation.
- **Worked reasoning:** Compare two boundary designs for a payment adapter. Identify what each enables for substitution, deterministic checks, fault simulation, traces/events, recovery verification, and safe operation; state the cost and limitations.
- **Professional artifact:** Engineering-Capability Review.
- **Prerequisites:** Chapters 1–6; Parts III, V, VII, and VIII recommended.
- **Explicit exclusions:** No test-framework configuration, telemetry SDK instruction, SLO/alert implementation, chaos-engineering operations, or deployment-platform tutorial.
- **Handoff:** Names architectural requirements that later receive specialist implementation in Parts III, V, VII, and VIII.

### Chapter 8 — Contracts, Compatibility, and Change Impact

- **Mission:** Show how interface, schema, event, and behaviour contracts constrain safe system change and independent evolution.
- **Core concepts:** API, event, and schema contracts; compatibility; versioning; deprecation; error semantics; timeout/retry expectations; consumer/provider assumptions; change impact; migration condition; contract drift.
- **Illustrative Atlas scenario:** Order events add a fulfilment-status field while a legacy notification consumer assumes a different state lifecycle. A cache and retry policy make the visible customer state stale.
- **QA → QE transition:** From checking a changed endpoint or schema in isolation to assessing which consumers, deployments, state transitions, temporal assumptions, and recovery paths could be affected.
- **Worked reasoning:** Build a change-impact record for the event evolution. Separate compatibility fact from assumption; identify a contract check, consumer uncertainty, safe rollout condition, deprecation signal, and revision trigger.
- **Professional artifact:** Contract, Compatibility, and Change-Impact Record.
- **Prerequisites:** Chapters 2–7; Part IV required, Part VI recommended.
- **Explicit exclusions:** No protocol tutorial, schema-registry product, consumer-driven-contract framework, or API-versioning dogma.
- **Handoff:** Supplies bounded change evidence for ADRs, migration planning, delivery handoffs, and the capstone.

### Chapter 9 — Architecture Evidence, Fitness Functions, and Decision Records

- **Mission:** Teach readers to select proportionate evidence for a design decision and record what that evidence can and cannot establish.
- **Core concepts:** Prototype, benchmark, dependency map, contract check, failure experiment, telemetry, static structure check, deployment/operational evidence, architecture review, ADR, evidence gap, and decision revision. An **Architecture Decision Record (ADR)** records a decision’s context, alternatives, option, rationale, trade-offs, consequences, evidence, and revision condition; it is not proof that the decision is good.
- **Illustrative Atlas scenario:** A proposed checkout extraction promises independent deployment and lower failure coupling, but the supporting evidence consists only of a static diagram and a small latency benchmark.
- **QA → QE transition:** From treating test output or a design document as approval evidence to judging whether a collection of evidence is relevant, sufficient, limited, and owned for the decision at hand.
- **Worked reasoning:** Assemble an evidence plan and ADR for the extraction. Classify each evidence item as fact, interpretation, limitation, or gap; identify what would invalidate the option.
- **Professional artifact:** Architecture Evidence Plan and ADR.
- **Prerequisites:** Chapters 1–8.
- **Explicit exclusions:** No mandated ADR template, architecture-review ceremony, documentation platform, or claim that an evidence ledger replaces expert judgement.
- **Handoff:** Produces evidence and decision records for evolution, integrated trade-offs, and the capstone.

**Fitness-function treatment:** Chapter 9 will introduce architecture fitness functions narrowly as repeatable checks that help detect architecture drift or assess a stated property, such as a dependency rule, contract compatibility condition, latency budget, or forbidden deployment coupling. It will state that not every quality concern can be automated and that automated results do not replace contextual review. Implementation of automated feedback remains Part V work.

### Chapter 10 — Evolution, Migration, Reversibility, and Architecture Debt

- **Mission:** Help readers plan change as an evidence-led sequence rather than a one-time replacement decision.
- **Core concepts:** Change impact, compatibility, migration, incremental modernization, strangler approach, temporary architecture debt, reversibility, rollback/roll-forward condition, decommissioning, ownership transfer, and revision trigger.
- **Illustrative Atlas scenario:** Atlas needs to separate fulfilment from a tightly coupled checkout module while preserving existing order status, payment uncertainty handling, and support workflows.
- **QA → QE transition:** From validating a final cutover to evaluating a sequence of safe intermediate states, required evidence, compatibility conditions, failure paths, and customer-impact signals.
- **Worked reasoning:** Compare a modular refactor, a bounded extraction, and a larger decomposition. State migration steps, compatibility/shadow conditions, evidence gates, recovery condition, cost, temporary debt, and reasons to defer.
- **Professional artifact:** Evolution, Migration, and Reversibility Strategy.
- **Prerequisites:** Chapters 1–9; Parts IV, VI, and VII recommended.
- **Explicit exclusions:** No transformation programme, cloud-migration playbook, organization redesign, or mandate to use a strangler pattern.
- **Handoff:** Supplies the evolution conditions used by Chapter 11 and the capstone option set.

### Chapter 11 — Integrated Architecture Decisions: Scale, Security, Reliability, and Residual Risk

- **Mission:** Integrate competing quality concerns without re-teaching the specialist practices from Parts VIII and X.
- **Core concepts:** Fan-out, latency allocation, availability dependency, queue/backlog pressure, retry amplification, blast radius, isolation, trust boundary, cache correctness, degraded mode, ownership, residual risk, and decision escalation.
- **Illustrative Atlas scenario:** A promotion drives catalogue fan-out and checkout traffic while payment is slow. A proposed asynchronous split improves isolation but introduces pending state, duplicate work, cache/authorization risk, and operational complexity.
- **QA → QE transition:** From reporting separate performance, reliability, and security findings to framing a single architecture decision with competing concerns, evidence limits, option consequences, and accountable ownership.
- **Worked reasoning:** Use the approved numerical strategy to interpret an explicitly synthetic call chain, dependency risk, backlog, retries, and blast radius. Make a bounded recommendation and identify the specialist evidence still required.
- **Professional artifact:** Integrated Architecture Decision Brief.
- **Prerequisites:** Chapters 1–10; Parts VIII and X recommended.
- **Explicit exclusions:** No capacity plan, SLO programme, threat-model deep dive, security-control design, or incident-management process.
- **Handoff:** Consolidates reasoning for the capstone and makes unresolved specialist work visible rather than absorbing it into Part XI.

### Chapter 12 — Capstone: System Design & Architecture Quality Strategy and Evidence Portfolio

- **Mission:** Require learners to synthesize an architecture-quality decision using a bounded, incomplete evidence packet and three defensible options.
- **Core concepts:** Context, claim, boundary, constraint, evidence, uncertainty, option, trade-off, failure mode, limitation, mitigation, owner, decision, consequence, residual risk, and revision trigger.
- **Illustrative Atlas scenario:** A checkout/fulfilment change must improve the ability to evolve a high-traffic flow while payment is a bounded third-party dependency and the existing system has shared state and ambiguous retry outcomes.
- **QA → QE transition:** From assessing one architecture diagram or test result to contributing a transparent recommendation that another engineer can inspect, challenge, and revise.
- **Worked reasoning:** Compare: **Option A**, improve the modular monolith; **Option B**, extract a bounded responsibility or asynchronous boundary; and **Option C**, propose a larger decomposition. None is the presumed answer. The learner must explain why evidence could favour or reject each option.
- **Professional artifact:** System Design & Architecture Quality Strategy and Evidence Portfolio with an Architecture Decision Brief.
- **Prerequisites:** Chapters 1–11.
- **Explicit exclusions:** No real system design interview, production architecture review, code, cloud deployment, generated diagram set, or claim that the learner owns the final decision.
- **Handoff:** Part XII may use the portfolio as a communication-and-influence artefact; it does not convert the capstone into leadership/governance instruction.

---

## Worked-Reasoning and Numerical Strategy

Worked examples will support architecture judgement, not create false precision. Every numerical example must state **context, assumptions, units, calculation, interpretation, limitation, and decision relevance**. Each uses synthetic Atlas Commerce facts and is checked independently before manuscript review.

| Example | Planned chapter | Required discipline and limitation |
| --- | --- | --- |
| Call-chain latency allocation | 3 or 11 | State client/server and waiting boundaries, sequential versus parallel calls, units, and whether the path represents a user outcome. A sum of component times is not proof of end-to-end experience. |
| Fan-out failure probability | 3 or 11 | Calculate a simplified fan-out outcome from declared assumptions; state that shared dependencies and correlation can invalidate independent-event reasoning. |
| Availability composition | 6 or 11 | Use multiplication only as a thought experiment under an explicit independence assumption. Explain correlation, common-mode failure, maintenance, degraded outcomes, and why a percentage cannot decide the architecture alone. |
| Backlog and capacity | 3, 4, or 11 | State arrival/completion rate, time window, queue boundary, units, retry behaviour, and non-steady-state limitation. Distinguish backlog evidence from a capacity guarantee. |
| Retry amplification | 3 or 11 | Calculate how bounded retries can increase attempted work; state timeout, cancellation, idempotency, and dependency assumptions. Do not infer customer completion from attempts. |
| Replication or storage consequence | 4 or 10 | State replication factor, logical/physical storage boundary, consistency/migration assumption, and cost/failure limitation. |
| Migration split and blast radius | 10 or 11 | Use a simple, transparent affected-surface estimate to compare staged options; state that blast radius includes social, operational, and dependency conditions that arithmetic cannot capture. |

---

## Practical Artefacts and Capstone Strategy

Each chapter creates one concise, reviewable professional artefact. Artefacts make reasoning inspectable; they are not process bureaucracy and do not require a standalone lab or companion project.

| Chapter | Cumulative professional artefact |
| --- | --- |
| 1 | Architecture Claim Canvas |
| 2 | Boundary, Responsibility, and Dependency Map |
| 3 | Interaction, Time, and Failure Analysis |
| 4 | State Ownership and Consistency Decision Record |
| 5 | Architectural Style and Decomposition Trade-off Assessment |
| 6 | Quality-Attribute Scenario Set and Trade-off Ledger |
| 7 | Engineering-Capability Review |
| 8 | Contract, Compatibility, and Change-Impact Record |
| 9 | Architecture Evidence Plan and ADR |
| 10 | Evolution, Migration, and Reversibility Strategy |
| 11 | Integrated Architecture Decision Brief |
| 12 | System Design & Architecture Quality Strategy and Evidence Portfolio |

### Capstone evidence packet

The capstone will provide deliberately incomplete synthetic evidence about Atlas Commerce, including a context map, current responsibility/dependency view, change hypothesis, workload and call-path assumptions, latency/fan-out observations, state and consistency conditions, retry/duplicate/unknown-outcome evidence, a bounded payment-dependency condition, security/performance/reliability considerations, testability/observability/deployability/operability/recoverability implications, migration constraints, ownership boundaries, and cost/complexity constraints.

The learner compares the three options defined in Chapter 12. The packet must make meaningful disagreement possible. It will not hide a “correct” microservices answer, overstate a benchmark, or use an ADR as a proxy for evidence.

### Required Architecture Decision Brief

The capstone brief must use these fields exactly:

| Field | Required purpose |
| --- | --- |
| CONTEXT | State the relevant system, user outcome, and decision scope. |
| QUALITY CLAIM | State the outcome or quality concern under consideration. |
| CONSTRAINT | Record a limiting condition that options must respect. |
| FACT | State only what the evidence directly supports. |
| EVIDENCE | Identify the source, scope, and relevance of supporting material. |
| ASSUMPTION | Record an unverified condition on which the reasoning depends. |
| OPTION | Name and describe a defensible architectural alternative. |
| TRADE-OFF | State the benefit gained and cost, risk, or capability made harder. |
| FAILURE MODE | Describe how the option can fail or degrade. |
| LIMITATION | State what the analysis or evidence cannot establish. |
| MITIGATION | Describe a proportionate risk-reduction action. |
| OWNER | Identify the role accountable for the next decision or action. |
| DECISION | Record the recommended or chosen direction and its scope. |
| CONSEQUENCE | State expected and adverse consequences. |
| RESIDUAL RISK | Record risk that remains after the decision or mitigation. |
| REVISION TRIGGER | State the observation or changed condition that requires reassessment. |

Optional fields, used only where needed, are **EVIDENCE GAP**, **UNCERTAINTY**, **MIGRATION CONDITION**, and **ESCALATION**. The capstone asks the learner to reason from the packet; it does not provide a solved portfolio.

---

## Source, Authority, and Terminology Strategy

The manuscript will classify sources so that authority is not confused with MSQE interpretation.

| Source class | Planned use | Boundary |
| --- | --- | --- |
| **International standards** | [ISO/IEC/IEEE 42010:2022](https://www.iso.org/standard/74393.html) for architecture-description vocabulary — architecture, architecture description, stakeholder, concern, view, viewpoint — and for the distinction between an architecture and the architecture description that expresses it; [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) for the nine top-level product-quality characteristics, cited in its current edition only. | Standards inform precise claims; they do not prescribe a style, tool, or organisation model. ISO/IEC/IEEE 42010:2022 governs how an architecture is described, not whether an architecture is good; 2011-edition ISO/IEC 25010 vocabulary is not mixed with the 2023 edition. |
| **Protocol and interoperability specifications** | IETF specifications, such as [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html) (STD 97), where exact request/response, error, or retry semantics are material to an architectural claim. | Use only for the protocol claim in scope. RFC 9110 defines HTTP semantics; it is not an architecture standard and does not settle an architecture decision. Part XI does not repeat Part IV protocol instruction. |
| **Established research and technical reports** | SEI architecture-evaluation work, including [ATAM](https://www.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/), for trade-off and architecture-evaluation reasoning. | Do not present ATAM as the required MSQE process or as a lightweight substitute for stakeholder judgement. |
| **Established literature** | Carefully attributed architecture, distributed-systems, evolutionary-architecture, and integration-pattern literature for explanatory context. | A book or practitioner text is not a standard; claims remain bounded and independently supported where needed. |
| **Official documentation and practitioner guidance** | Narrow factual clarification where a standard does not apply. C4 may be referenced as a communication approach, not a mandated notation. | Avoid vendor/product prescription and label the authority type accurately. |
| **MSQE teaching models** | The Architecture Decision Reasoning Model, artefact set, decision brief, and QA → QE progression. | Clearly label as original MSQE educational models, not standards or universal methods. |

Specialised terms—including idempotency, backpressure, eventual consistency, reconciliation, blast radius, fitness function, ADR, residual risk, and revision trigger—will be defined at first meaningful use. References will use the approved chapter-template citation format and be checked for currentness during drafting and review.

---

## Diagram, Laboratory, and Pass 2 Classification

Architecture diagrams are architecture-description artefacts. They communicate an architecture and can support evidence; they are not the architecture and are not proof of its quality. A later chapter may refer to the purpose of a context, container, component, dynamic, deployment, sequence, state, data-flow, trust-boundary, dependency, or decision diagram, and to the concern each view is meant to address. It will not teach C4, UML, or a vendor tool as a prerequisite, and it will not treat notation quality as architecture quality.

In accordance with Quality Gates v1.1, every standalone asset below is **recommended Pass 2 enrichment**, not a prerequisite for the Part XI manuscript release.

| Planned asset | Classification | Learning purpose and boundary |
| --- | --- | --- |
| Atlas Commerce Architecture Decision Simulator | Recommended Pass 2 enrichment | Lets learners inspect synthetic constraints, evidence gaps, and option consequences. It is not created or required now. |
| Lab 1 — Boundary and Dependency Investigation | Recommended Pass 2 enrichment | Extends Chapters 2–3 with a controlled boundary, failure, and evidence exercise. |
| Lab 2 — Asynchronous and Consistency Trade-offs | Recommended Pass 2 enrichment | Extends Chapters 3–4 with duplicate, ordering, retry, and reconciliation reasoning. |
| Lab 3 — Architecture Trade-off and Evidence Review | Recommended Pass 2 enrichment | Extends Chapters 5–9 with quality scenarios, evidence selection, and ADR critique. |
| Lab 4 — Evolution and Capstone Decision | Recommended Pass 2 enrichment | Extends Chapters 10–12 with staged migration and decision-brief practice. |
| C4/UML-style conceptual diagrams | Recommended Pass 2 enrichment | Illustrate boundaries, interactions, state, deployment, trust, and decision views only where a visual materially improves learning. |
| ADR examples and architecture-evaluation worksheets | Recommended Pass 2 enrichment | Provide completed and blank examples after independent review for accuracy and accessibility. |
| Executable fitness-function and dependency-analysis examples | Recommended Pass 2 enrichment | Demonstrate selected repeatable checks without making automation implementation part of this manuscript. |
| Standalone case-study files, datasets, or migration simulations | Recommended Pass 2 enrichment | Support extended, synthetic practice if separately approved and validated. |

No standalone practical asset is classified as required for the Part XI manuscript release. This does not bypass practical learning: the manuscript must still validate its illustrative scenarios, worked reasoning, professional artefacts, practical exercises, references, Markdown, links, and independent review.

---

## Depth, Production, and Review Model

### Depth guidance

Normal conceptual chapters should target **3,800–5,200 words**. High-integration chapters—especially Chapters 2–11—should normally target **4,300–5,800 words**, because they must connect decisions, evidence, limitations, and cross-part handoffs. The capstone should target **6,000–7,500+ words** because it synthesizes a substantial evidence packet and three options. Word count is not a quality gate; instructional completeness, technical accuracy, and evidence discipline are.

### Accelerated, quality-preserving workflow

| Batch | Chapters | Production focus | Mandatory checkpoint |
| --- | --- | --- | --- |
| A — Context, boundaries, communication, and state | 1–4 | Establish shared terminology, boundary maps, timing/failure, and consistency reasoning. | **Checkpoint A:** Verify ISO/IEC 25010:2023 terminology against the nine top-level characteristics with no edition mixing, the architecture versus architecture-description distinction, boundary taxonomy, synchronous/asynchronous accuracy, limited CAP treatment, state/consistency claims, numerical strategy, Atlas baseline, and Parts III–X handoffs. |
| B — Structure, quality implications, capabilities, contracts, evidence, and evolution | 5–10 | Teach neutral style trade-offs, quality scenarios, architecture capabilities, change impact, evidence/ADRs, and reversibility. | **Checkpoint B:** Verify style neutrality, quality/testability/observability distinctions, contract/change scope, evidence/ADR discipline, evolution/migration claims, and capstone-option readiness. |
| C — Integration and synthesis | 11–12 | Resolve cross-quality trade-offs and capstone portfolio coherence. | Confirm numerical limitations, specialist handoffs, decision-brief field accuracy, ownership language, and no implied correct topology. |

After the batches, the approved path is: **one consolidated independent manuscript review; one targeted P1/P2 correction pass if required; a focused closure review only if the correction requires it; then one Final Part XI Quality Gate.** P0/P1 concerns interrupt the accelerated flow; P2/P3 concerns are handled proportionately without disguising scope expansion.

### Architecture-review scorecard

The independent architecture review should assess the plan against these 27 categories:

1. Part mission clarity; 2. QA → QE progression; 3. chapter sequence; 4. boundary discipline; 5. ISO/IEC 25010 distinction; 6. MSQE-model labelling; 7. systems-boundary coverage; 8. style neutrality; 9. coupling/dependency reasoning; 10. communication/time/failure accuracy; 11. state/consistency accuracy; 12. CAP scope discipline; 13. contract/change handoff; 14. testability/observability/operability treatment; 15. performance/security/reliability handoff; 16. architecture-evidence discipline; 17. ADR treatment; 18. fitness-function boundary; 19. Atlas baseline consistency; 20. numerical-reasoning safeguards; 21. capstone quality; 22. practical-artefact progression; 23. source authority and citation strategy; 24. Pass 2 classification; 25. depth and instructional completeness; 26. Markdown/template consistency; and 27. repository/release-scope integrity.

---

## Definition of Done for Planned Part XI Manuscript Work

Part XI may advance from architecture planning to Pass 1 only after an independent architecture review accepts this plan or records approved corrections. **That precondition was met** and Pass 1 is under way. A future manuscript release may be considered only when:

1. all 12 chapters are drafted using the approved template and retain `Status: Draft` until governance authorizes another status;
2. every chapter includes a labelled illustrative scenario, worked reasoning, practical artefact, source-backed claims, limitations, and cross-part handoff;
3. Checkpoints A and B, consolidated independent review, required correction/closure work, and the Final Part XI Quality Gate are completed;
4. no P0, P1, or release-blocking P2 finding remains;
5. all standalone practical assets remain accurately classified, and any future required asset passes its applicable Required Practical Asset Gate; and
6. release administration, versioning, repository validation, and publication steps are separately authorized and completed.

---

## Current State and Next Authorized Activity

- **Current state:** The Part XI lifecycle through Pass 1 and review is complete. The curriculum architecture is approved, accelerated Pass 1 is complete, the consolidated manuscript review's P1 and P2 findings are corrected, the focused P1/P2 closure review confirmed them at **96/100**, and the **Final Part XI Quality Gate has passed at 96/100 with verdict A**. See the review-event ledger above for all four scores. **The controlled manuscript baseline is established at `7067ebb54cba199a9215363188171d2e4966ed15`.** No v0.14.0 release administration has begun.
- **Correction pass record (2026-08-14):** P1 — recoverability restated as an ISO/IEC 25010:2023 subcharacteristic of reliability in Chapters 1 and 6 and in this document's terminology table, resolving a factual error and a contradiction with Chapter 7. P1 — Chapter 3's fan-out arithmetic chain corrected so every displayed intermediate produces the displayed result, with the rounding rule stated. P2 — Chapter 12's ARCH-CHG-01 relabelled as reclassified evidence with an explicit provenance note reconciling it against Chapter 5. P2 — the decision-record endings in Chapters 3 and 10 normalised to demonstrate different legitimate decision shapes. P2 — Chapter 12 strengthened with six independent decision axes so the capstone cannot be solved by importing Chapter 11's pivot. P2 — this document's active-state wording corrected. P3 — fan-out page identity reconciled, availability compositions cross-referenced, and stale drafting-control language removed.
- **Pass 1 progress:** **Accelerated Pass 1 is complete.** Batch A (Chapters 1–4), Batch B (Chapters 5–10), and Batch C (Chapters 11–12) are drafted; Checkpoints A and B and the Batch C integration checkpoint have all passed, each with no P0 or P1 finding. Checkpoint A verified ISO/IEC 25010:2023 terminology and edition discipline, the architecture versus architecture-description distinction, boundary taxonomy coherence, synchronous/asynchronous and idempotency semantics, state/consistency and CAP accuracy, independent recalculation of all six Batch A numerical examples, Atlas Commerce continuity, cross-part boundaries, and repository integrity. Checkpoint B verified architectural-style neutrality, ISO quality-model discipline, the Chapter 6 scenario scaffold, discharge of the Chapters 2–6 capability handoffs in Chapter 7, contract/change scope against Parts IV, VI, and VII, ADR-is-not-proof and fitness-function boundaries, evolution and reversibility accuracy including strangler neutrality, independent recalculation of all seven Batch B numerical examples, Atlas continuity across Chapters 1–10, and repository integrity. The Batch C integration checkpoint verified the coherence of the Chapters 1–12 progression, that Chapter 11 integrates rather than summarises, that the capstone requires synthesis rather than pattern selection, that all three capstone options remain initially defensible with no microservices bias and no composite architecture score anywhere, independent recalculation of all 39 stated values across the eight Batch C numerical examples, internal consistency of the 34 capstone evidence identifiers with reused evidence retaining identical values and definitions, that the Decision Brief fields match this document exactly while `DECISION`, `CONSEQUENCE`, `RESIDUAL RISK`, and `REVISION TRIGGER` remain learner-completed, bounded specialist handoffs, and an intact architecture-versus-architecture-description distinction.
- **Correction record:** P1 — ISO/IEC 25010:2023 top-level characteristics restated accurately, with safety correctly recorded as a top-level characteristic of the 2023 edition, flexibility used in place of the superseded portability label, interaction capability used in place of the superseded usability label, and interoperability kept within compatibility. P2 — the architecture versus architecture-description distinction added under ISO/IEC/IEEE 42010:2022 and carried into Chapter 1 and the diagram policy. P2 — Chapter 6 strengthened with an explicit source → stimulus → environment → affected system/artifact → response → response measure scaffold. P3 — the source class renamed to "Protocol and interoperability specifications" with RFC 9110 bounded to protocol semantics.
- **Final Gate record (2026-08-14):** The Final Part XI Quality Gate independently re-verified the manuscript rather than confirming prior reports. It recalculated all 21 numerical examples testing every displayed chain **as written** (~80 values, zero failures), re-ran the ISO/IEC 25010:2023 controls at both characteristic and subcharacteristic level, re-verified all six DOI-registered citations against Crossref, re-tested the capstone for importable-pivot solvability, and validated repository structure, cross-part boundaries, and governance. Result: **96/100, verdict A**, with **P0 = 0, P1 = 0, P2 = 0** and six non-blocking P3 items. The Final Gate score is a manuscript-quality result; it does not authorize a baseline, a release, or any status change to the chapters.
- **Manuscript state:** All twelve chapters exist and carry `Status: Draft` and retain that status. The consolidated manuscript review and the Final Quality Gate are both complete; no chapter is represented as approved or published.
- **Practical assets:** No companion implementation, laboratory, diagram, ADR example, simulator, dataset, case study, website asset, CI/CD configuration, or infrastructure exists. All proposed standalone assets are recommended Pass 2 enrichment only.
- **Release state:** **v0.14.0 — System Design & Architecture Complete** remains planned and unreleased. Part XII — Engineering Leadership & Career Growth has not started.
- **Controlled manuscript baseline:** `7067ebb54cba199a9215363188171d2e4966ed15` — the authoritative Git state representing the reviewed Part XI manuscript. At that SHA all twelve chapters carry `Status: Draft`, eleven are byte-identical to the Final-Gate-reviewed state, and Chapter 1 differs only by the authorized two-line ATAM citation normalisation recorded above. The baseline is a version-control reference point; it does not release anything and does not change any chapter's status.
- **Release administration:** v0.14.0 release-administration metadata is prepared. The next step is a reviewed **feature → develop** pull request. No release branch, annotated tag, or GitHub Release has been created, and v0.14.0 remains planned and unreleased.
- **Next authorized action:** Open the reviewed **feature → develop** pull request after metadata approval. Do not create Part XI practical assets, begin Part XII work, or perform release administration automatically. One control remains open and is deliberately carried forward rather than closed: ISO/IEC 25010:2023 and ISO/IEC/IEEE 42010:2022 are paywalled and returned HTTP 403 to every access attempt, so their characteristic and subcharacteristic placements were verified against consistent secondary references and the repository's already-gated Part III precedent — **not** against a purchased copy. That verification has not been upgraded and should be completed when a copy is available.
