# Part III — Software Testing Engineering

---

## Curriculum Status

**Curriculum approved.** Chapters 1–12 are Draft manuscripts. Delivery 1 Chapters 1–3 completed review and targeted correction (**94/100 — High Quality**). Delivery 2 Chapters 4–5 completed independent review (**96/100 — High Quality**; no open P0, P1, or P2 findings). Delivery 3 Chapters 6–8 completed review and targeted correction (**94/100 — Strong**; P0: none; P1: closed; P2: none). Delivery 4 Chapters 9–11 completed independent review (**95/100 — High Quality**; no open P0 or P1 findings). Delivery 5’s Chapter 12 capstone completed review (**97/100 — High Quality**; no open P0 or P1 findings). Part III manuscript drafting and normalization are complete; the Final Part III Quality Gate is next. Part III is not approved or released, Part IV has not started, and all Part III companion assets remain out of scope.

Part III continues the learning progression established in [Part I — Foundations](../part-01-foundations/README.md) and [Part II — Programming for Quality Engineers](../part-02-programming/README.md). It does not restart testing education from zero or present testing as a separate phase owned by a testing function.

---

## Overview

Part III develops Software Testing Engineering as a disciplined way to create, interpret, and improve evidence about product and system risk. Testing remains a vital Quality Engineering capability, but a completed test or a green result is not a statement that all relevant risk is controlled. Readers learn to connect testing work to customer outcomes, quality requirements, system boundaries, delivery decisions, and residual uncertainty.

The part is designed for experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers. It preserves their scenario thinking, user advocacy, defect investigation, and exploratory skill while extending those strengths into risk reasoning, strategy design, testability advocacy, feedback optimisation, and production learning.

---

## Purpose

To help readers design efficient, risk-informed, evidence-producing testing strategies as part of a wider Quality Engineering system.

The intended movement is:

```text
Execute a test
  → Explain the risk and decision it informs
  → Design proportionate evidence across system boundaries
  → Interpret limits and residual risk
  → Improve feedback, testability, and future quality decisions
```

---

## Design Principles and Industry Position

Part III follows the MSQE principle that quality is an engineered system property. Its central teaching perspective is therefore **testing as evidence for decisions and learning**, not test-case volume, tool proficiency, or certification recall.

Established industry concepts—including test processes, test documentation, and test-design techniques from the [ISO/IEC/IEEE 29119 series](https://committee.iso.org/sites/jtc1sc7/home/projects/flagship-standards/isoiecieee-29119-series.html)—provide useful vocabulary and reference points. The [ISTQB Certified Tester Foundation Level syllabus v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf) is a supplementary terminology and technique reference, not a curriculum to reproduce or an examination target. The part also uses quality requirements and product-quality concepts from [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) and [ISO/IEC 25030:2019](https://www.iso.org/standard/72116.html) where they help turn quality needs into test objectives.

These are external standards and industry sources. The MSQE framing—connecting evidence to engineering decisions, shared ownership, and lifecycle learning—is an educational perspective of this handbook, not a replacement standard or certification model.

---

## Learning Outcomes

Upon completing Part III, readers should be able to:

- explain the purpose and limits of testing as evidence rather than proof of complete quality;
- identify customer outcomes, quality requirements, and risks that warrant proportionate testing;
- produce a risk-informed test strategy that states scope, evidence, decision criteria, and residual risk;
- analyse requirements and specifications for ambiguity, observability, controllability, and testability concerns;
- select and justify test-design techniques instead of producing undifferentiated test-case inventories;
- conduct exploratory testing with clear charters, observations, and debrief evidence;
- choose appropriate test levels and boundaries across components, services, integrations, and system journeys;
- design deterministic, isolated, diagnosable automated checks without prematurely building an automation framework;
- reason about functional, quality-attribute, data-oriented, API, and distributed-system evidence within stated boundaries;
- design regression selection and feedback strategies for continuous delivery without implementing CI/CD pipelines;
- investigate defects and escaped defects as evidence for system improvement; and
- communicate testing confidence, limitations, and residual risk to support accountable engineering decisions.

---

## Prerequisites

- Completion of Part I, or equivalent understanding of quality as a system property, systems thinking, risk-based evidence, and shared ownership.
- Completion of Part II, or equivalent ability to read and reason about small Quality Engineering utilities, data, failure paths, and automated checks.

Part III uses programming fluency from Part II to discuss test isolation, doubles, deterministic checks, and diagnostic output. It does not require readers to build a browser, API, or CI/CD automation framework.

---

## Proposed Chapter Plan

### [Chapter 1 — Testing as Evidence Engineering](chapters/chapter-01-testing-as-evidence-engineering.md)

- **Purpose:** Establish what testing can reveal, what it cannot prove, and how testing contributes to customer- and risk-informed decisions.
- **Key concepts:** Testing purpose and limits; confidence versus certainty; evidence quality; oracle limits; false confidence; testing and prevention.
- **QA → QE contribution:** Extends competent test execution into evidence interpretation and shared quality responsibility.
- **Practical activity:** Analyse a fictional release dashboard and write an evidence statement that distinguishes supported claims, unknowns, and decision implications.
- **Dependencies:** Part I quality, risk, and systems-thinking concepts; Part II evidence-producing utilities.
- **Scope boundaries:** Does not teach test automation frameworks, release-pipeline implementation, or operational monitoring.
- **Professional evidence:** A concise evidence-and-limits note for a release decision.

### [Chapter 2 — Risk-Informed Test Strategy](chapters/chapter-02-risk-informed-test-strategy.md)

- **Purpose:** Teach readers to decide what deserves testing effort, where evidence should be gathered, and what risk will remain.
- **Key concepts:** Customer outcomes; risk identification and prioritisation; quality requirements; test objectives; scope; entry and exit considerations; residual risk; deciding what not to test.
- **QA → QE contribution:** Transforms a test plan into a quality strategy that connects risk, evidence, safeguards, and accountable decisions.
- **Practical activity:** Create a proportionate strategy for a change to a subscription-renewal journey, including exclusions and residual-risk communication.
- **Dependencies:** Chapter 1.
- **Scope boundaries:** Does not prescribe a universal risk matrix, governance process, or release-approval authority.
- **Professional evidence:** A risk-informed test strategy and explicit scope rationale.

### [Chapter 3 — Requirements Analysis, Specifications, and Testability](chapters/chapter-03-requirements-analysis-specifications-and-testability.md)

- **Purpose:** Help readers improve evidence before implementation by analysing requirements, examples, assumptions, and testability constraints.
- **Key concepts:** Ambiguity; acceptance criteria; examples and counterexamples; quality attributes; observability; controllability; diagnosability; seams and interfaces.
- **QA → QE contribution:** Moves QA involvement earlier, from receiving work to influencing whether meaningful evidence can be produced efficiently.
- **Practical activity:** Review a fictional requirement, identify testability risks, and facilitate a clarification proposal with observable acceptance examples.
- **Dependencies:** Chapters 1–2; Part I lifecycle and shared-ownership principles.
- **Scope boundaries:** Does not replace product discovery, architecture design, or formal requirements engineering.
- **Professional evidence:** A testability assessment and clarified specification examples.

### [Chapter 4 — Test Design for Efficient Evidence](chapters/chapter-04-test-design-for-efficient-evidence.md)

- **Purpose:** Build judgement in selecting test-design techniques that reveal important distinctions with proportionate effort.
- **Key concepts:** Equivalence partitioning; boundary value analysis; decision tables; state-transition reasoning; pairwise and combinatorial thinking; negative paths; test data selection; oracle design.
- **QA → QE contribution:** Replaces broad scenario accumulation with explainable design choices tied to risk and information value.
- **Practical activity:** Design a compact test set for a policy-calculation rule, defend the chosen techniques, and identify cases intentionally excluded.
- **Dependencies:** Chapters 1–3.
- **Scope boundaries:** Does not teach exhaustive testing, tool-specific test syntax, or domain-specific regulatory test suites.
- **Professional evidence:** A test-design rationale that traces each example to a risk or rule distinction.

### [Chapter 5 — Exploratory Testing and Adaptive Investigation](chapters/chapter-05-exploratory-testing-and-adaptive-investigation.md)

- **Purpose:** Position exploratory testing as structured learning under uncertainty, not unrecorded ad hoc clicking.
- **Key concepts:** Charters; missions; timeboxes; heuristics; note-taking; observation quality; debriefs; bias; exploratory evidence limits.
- **QA → QE contribution:** Preserves exploratory skill while making it inspectable, shareable, and useful for strategy and system learning.
- **Practical activity:** Execute an exploratory charter against a fictional workflow description, record observations, and conduct a short evidence-based debrief.
- **Dependencies:** Chapters 1–4.
- **Scope boundaries:** Does not prescribe a single exploratory-testing method or treat exploratory work as a substitute for risk strategy.
- **Professional evidence:** A charter, session notes, debrief, and follow-up evidence recommendation.

### [Chapter 6 — Test Levels, Boundaries, and Integration Evidence](chapters/chapter-06-test-levels-boundaries-and-integration-evidence.md)

- **Purpose:** Help readers choose the smallest useful boundary for evidence while understanding component, service, integration, system, and acceptance perspectives.
- **Key concepts:** Test levels as evidence perspectives rather than a rigid hierarchy; system boundaries; collaboration contracts; integration risk; end-to-end journey limits; test pyramids and portfolios.
- **QA → QE contribution:** Expands focus from individual features to dependencies, interfaces, and the cost and reliability of feedback across a system.
- **Practical activity:** Map a customer journey across components and dependencies, then justify where each important risk should be tested.
- **Dependencies:** Chapters 2–4; Part I systems thinking.
- **Scope boundaries:** Does not design a full automation architecture, API framework, service virtualisation solution, or production topology.
- **Professional evidence:** A boundary map and risk-to-evidence placement rationale.

### [Chapter 7 — Reliable Automated Checks: Isolation, Doubles, and Determinism](chapters/chapter-07-reliable-automated-checks-isolation-doubles-and-determinism.md)

- **Purpose:** Apply Part II programming capability to make automated checks trustworthy, diagnosable, and proportionate.
- **Key concepts:** Test isolation; deterministic data and time; test doubles; fixture boundaries; controlled dependencies; flaky-check diagnosis; readable assertions; feedback cost.
- **QA → QE contribution:** Turns automation from a collection of scripts into a maintained source of decision-relevant evidence.
- **Practical activity:** Review a fictional flaky check and propose a bounded redesign using a suitable double, deterministic inputs, and improved diagnostics.
- **Dependencies:** Chapter 6 and Part II Chapters 4–11.
- **Scope boundaries:** Does not implement browser, mobile, API, or CI automation frameworks; those belong to Parts IV, V, and VII.
- **Professional evidence:** A reliable-check design note with failure-mode and isolation rationale.

### [Chapter 8 — Functional, Quality-Attribute, and Data-Oriented Evidence](chapters/chapter-08-functional-quality-attribute-and-data-oriented-evidence.md)

- **Purpose:** Connect functional behaviour with selected quality requirements and data conditions without conflating product-quality characteristics with engineering capabilities.
- **Key concepts:** Functional suitability; selected ISO/IEC 25010 product-quality characteristics; error paths; accessibility and usability considerations; data validity, state, and transformation risks; evidence limits.
- **QA → QE contribution:** Enables readers to frame testing around customer outcomes and quality attributes rather than only happy-path feature behaviour.
- **Practical activity:** Turn a quality-requirement profile into test objectives, evidence sources, and a statement of risks deferred to specialist work.
- **Dependencies:** Chapters 2–4 and 6.
- **Scope boundaries:** Does not teach performance engineering, security testing, accessibility conformance testing, SQL, ETL validation, or data-quality frameworks.
- **Professional evidence:** A quality-attribute test-objective profile with specialist hand-off criteria.

### [Chapter 9 — Service, API, and Distributed-System Testing Strategy](chapters/chapter-09-service-api-and-distributed-system-testing-strategy.md)

- **Purpose:** Extend test strategy to service interactions, contracts, asynchronous behaviour, and partial-failure conditions common in modern systems.
- **Key concepts:** Service boundaries; contracts; compatibility; dependency failure; eventual consistency; idempotency; asynchronous outcomes; environment and test-data risk.
- **QA → QE contribution:** Builds system-level reasoning about where integration evidence is needed and what an isolated result cannot establish.
- **Practical activity:** Design an evidence plan for an order-confirmation workflow spanning a client, service, queue, and notification dependency.
- **Dependencies:** Chapters 2, 6, and 8; Part II asynchronous and failure-handling concepts.
- **Scope boundaries:** Does not implement HTTP clients, authentication flows, contract-testing tools, service virtualisation, or API automation; Part IV owns those practices.
- **Professional evidence:** A distributed-workflow risk map and integration-evidence strategy.

### [Chapter 10 — Regression Strategy, Test Selection, and Continuous Delivery Feedback](chapters/chapter-10-regression-strategy-test-selection-and-continuous-delivery-feedback.md)

- **Purpose:** Teach readers to optimise feedback by selecting, sequencing, and maintaining evidence rather than rerunning every check indiscriminately.
- **Key concepts:** Regression intent; change impact; test selection and prioritisation; feedback timing; confidence decay; suite health; test maintenance; release evidence.
- **QA → QE contribution:** Shifts attention from test-suite size to feedback usefulness, speed, reliability, and decision value.
- **Practical activity:** Rework a fictional slow regression portfolio into layered feedback for a change scenario, explaining coverage trade-offs and residual risk.
- **Dependencies:** Chapters 2, 6, and 7.
- **Scope boundaries:** Does not implement CI/CD pipelines, test sharding infrastructure, or automation-platform architecture.
- **Professional evidence:** A regression-selection policy and feedback-portfolio rationale.

### [Chapter 11 — Defect Investigation, Escaped Defects, and Production Learning](chapters/chapter-11-defect-investigation-escaped-defects-and-production-learning.md)

- **Purpose:** Treat defects and escaped defects as evidence that can improve requirements, design, testing, safeguards, and operational learning.
- **Key concepts:** Reproduction; triage evidence; causal factors; defect classification limits; escaped defects; blameless learning; corrective versus preventive action; production signals.
- **QA → QE contribution:** Extends defect reporting into cross-functional learning and quality-strategy improvement without transferring operational ownership to the tester.
- **Practical activity:** Analyse a fictional escaped defect and produce an investigation record covering evidence, contributing conditions, prevention, detection, and residual risk.
- **Dependencies:** Chapters 1–5 and 9–10; Part I systems-thinking principles.
- **Scope boundaries:** Does not teach incident command, production observability implementation, SRE practices, or root-cause-analysis certification methods.
- **Professional evidence:** A defect-learning record and proposed strategy improvement.

### [Chapter 12 — Capstone: Risk-Informed Test Strategy and Evidence Portfolio](chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md)

- **Purpose:** Integrate Part III into an inspectable strategy-and-evidence portfolio for a bounded modern-system change.
- **Key concepts:** Context framing; risk and quality requirements; testability; evidence placement; exploratory learning; deterministic-check design; release confidence; residual risk; production learning plan.
- **QA → QE contribution:** Demonstrates the ability to connect testing activity to engineering decisions, system boundaries, collaboration, and lifecycle learning.
- **Practical activity:** Produce the capstone evidence portfolio for a fictional product change.
- **Dependencies:** Chapters 1–11 and Parts I–II.
- **Scope boundaries:** Does not require a production implementation, automation framework, CI/CD pipeline, cloud environment, or live-system access.
- **Professional evidence:** A portfolio-ready test strategy and evidence pack with stated limits and safe fictional data.

---

## Curriculum Progression Rationale

The sequence begins with the purpose and limits of testing so readers do not mistake activity for confidence. Strategy and testability follow because they determine what evidence is worth producing before detailed design begins. Test design and exploratory work then develop complementary modes of learning: structured distinction-making and adaptive investigation.

The middle of the part places evidence at appropriate system boundaries and makes automated checks reliable enough to be trusted. Only then does it extend the learner’s reasoning to quality attributes, data conditions, services, and distributed behaviour. The final chapters optimise regression feedback and convert defects into learning. The capstone asks the learner to make and justify a coherent evidence strategy rather than merely demonstrate isolated techniques.

---

## QA → QE Transition Strategy

Part III expands valuable existing QA strengths rather than replacing them.

| Existing QA strength | Expanded Quality Engineering capability | Part III evidence | Prepares the learner for |
|---|---|---|---|
| Scenario thinking and test execution | Risk-informed evidence design and confidence communication | Strategy, test-design rationale, and residual-risk statement | Parts IV, V, VII, and XII |
| Requirements questioning | Testability advocacy and earlier collaboration | Testability assessment and clarified examples | Parts IV, VII, and XI |
| Exploratory testing | Structured investigation and system learning | Charter, notes, debrief, and evidence recommendation | Parts IV, VI, VIII, and XII |
| Automation experience | Deterministic, isolated, diagnosable feedback design | Reliable-check design note and regression-selection policy | Parts IV, V, and VII |
| Defect reporting | Defect learning and preventive quality improvement | Escaped-defect investigation and strategy update | Parts VII, VIII, XI, and XII |
| Release testing | Quality strategy and accountable confidence decisions | Capstone strategy and evidence portfolio | Quality Strategy & Risk Engineering capability |

This maps primarily to the Transition Framework’s **Quality & Testing Foundations** and **Quality Strategy & Risk Engineering** domains. It also strengthens Systems Thinking & Architecture, Programming Foundations, Communication, Leadership & Influence, and preparation for API, Automation, Data, Cloud/DevOps, and Observability/Reliability domains.

---

## Delivery Groups

| Delivery | Chapters | Drafting and review outcome | Planned applied work |
|---|---|---|---|
| Delivery 1 — Evidence, Risk, and Testability | 1–3 | Readers can frame testing as evidence, create a proportionate strategy, and identify testability concerns early. | Evidence statement, risk-informed strategy, and testability assessment. |
| Delivery 2 — Test Design and Exploratory Investigation | 4–5 | Readers can select efficient design techniques and carry out structured exploratory learning. | Test-design rationale, exploratory charter, session notes, and debrief. |
| Delivery 3 — Boundaries and Reliable Feedback | 6–8 | Readers can place evidence at suitable boundaries and design reliable checks for functional and selected quality-attribute risks. | Boundary map, reliable-check design, and quality-attribute profile. |
| Delivery 4 — Modern-System Evidence and Learning | 9–11 | Readers can reason about distributed interactions, regression feedback, escaped defects, and production learning. | Integration-evidence plan, regression-selection policy, and defect-learning record. |
| Delivery 5 — Capstone and Synthesis | 12 | Readers integrate strategy, design, investigation, evidence, and residual-risk communication. | Risk-Informed Test Strategy and Evidence Portfolio. |

---

## Practical Learning Strategy

Part III practical work is designed around judgement. Exercises must require learners to explain what to test, where to test it, how deeply to test, which evidence matters, what risk remains, and when prevention or production observation is more appropriate than another test.

Planned activities include:

- short evidence-analysis exercises using fictional release information and defect reports;
- requirement and specification reviews that surface testability and ambiguity before implementation;
- compact test-design work that justifies technique selection instead of creating large inventories;
- exploratory charters, notes, and debriefs;
- risk-to-boundary mapping for system journeys and dependencies;
- reliable-check reviews that use Part II concepts such as deterministic data, doubles, failure categories, and diagnostics;
- regression-selection decisions for continuous-delivery contexts;
- escaped-defect learning records; and
- portfolio-oriented strategy and evidence artifacts using fictional or safely anonymised contexts.

**Supporting assets (Pass 2, planned):** A standalone strategy-and-testability laboratory after Chapter 3, an integration-evidence and reliable-feedback laboratory after Chapter 8, and a release-evidence workshop after Chapter 11. These assets are planned only; no labs, diagrams, companion code, or case studies are created by this curriculum proposal.

The Part II [Quality Engineering Toolkit](../../code/part-02-programming/capstone-quality-engineering-toolkit/README.md) may be used as a bounded example of inspectable programmatic evidence. Part III will not extend it into a testing framework.

---

## Part III Capstone Decision

**A capstone is recommended.** It should be a strategy-and-evidence capstone, not an automation-framework project and not a duplicate of Part II’s programming capstone.

The learner will produce a **Risk-Informed Test Strategy and Evidence Portfolio** for a fictional, bounded product change. The pack should include:

- a customer-outcome and system-boundary summary;
- quality requirements, assumptions, and a ranked risk profile;
- a testability assessment and clarification questions;
- selected test-design examples and an exploratory charter;
- an evidence-placement and regression-selection rationale;
- a proposed deterministic-check boundary, without requiring framework implementation;
- an integration and distributed-failure evidence plan;
- a defect- or escaped-defect learning record;
- a release-confidence statement, known limitations, and residual-risk communication; and
- a production-learning question to be answered later by appropriate observability and reliability practices.

The capstone demonstrates strategy, evidence design, system thinking, collaboration, and judgement. It does not claim to demonstrate production automation, CI/CD implementation, API-framework expertise, performance testing, security testing, SRE, or data engineering.

---

## Scope Boundaries and Deferred Material

Part III introduces adjacent subjects only to decide what testing evidence is needed and when a specialist collaboration or later handbook part is appropriate.

| Deferred material | Owning handbook part |
|---|---|
| API implementation, authentication, contract-testing tooling, service virtualisation, and API automation | Part IV — API Quality Engineering |
| Browser, mobile, and API automation frameworks; automation architecture; framework-scale test-data management | Part V — Automation Engineering |
| SQL, data pipelines, reconciliation, lineage, and data-quality frameworks | Part VI — Data Quality Engineering |
| CI/CD implementation, deployment controls, infrastructure, containers, and cloud environments | Part VII — Cloud & DevOps |
| Logging, metrics, traces, SLOs, incident command, resilience implementation, and SRE practice | Part VIII — Observability & Reliability Engineering |
| AI-system testing, LLM evaluation, and AI governance | Part IX — AI Quality Engineering |
| Performance engineering, load and stress testing, security testing, threat modelling, and vulnerability assessment | Part X — Performance & Security Engineering |
| Deep distributed-system design and architecture governance | Part XI — System Design & Architecture |

---

## MQE-BOK and Transition Framework Mapping

**Primary MQE-BOK domain:** Domain 3 — Software Testing Engineering.

**Primary Transition Framework domains:** Quality & Testing Foundations; Quality Strategy & Risk Engineering.

**Contributing domains:** Programming Foundations, Systems Thinking & Architecture, Communication/Leadership/Influence, Test Automation Engineering preparation, API & Integration Engineering preparation, Data & Database Quality preparation, CI/CD & DevOps preparation, and Observability & Reliability preparation.

The target capability is not the ability to produce the largest test suite. It is the ability to design, obtain, interpret, and communicate proportionate evidence that improves a quality decision.

---

## Curriculum Approval Gate

Before Chapter 1 drafting begins, confirm that the curriculum:

- preserves testing expertise while extending it into evidence and quality-strategy capability;
- remains aligned with Parts I and II and uses their terminology consistently;
- distinguishes ISO/IEC quality characteristics from engineering capabilities such as testability and observability;
- avoids duplicating the dedicated API, automation, data, cloud, reliability, AI, performance, security, and architecture parts;
- supports the approved chapter template and Quality Gates; and
- has agreed delivery scope, practical assets, capstone boundaries, and authoritative reference strategy.
