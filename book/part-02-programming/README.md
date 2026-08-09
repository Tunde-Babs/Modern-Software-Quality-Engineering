# Part II – Programming for Quality Engineers

---

## Overview

Part II develops the programming capability that enables a Quality Engineer to read, write, debug, improve, and review code that produces quality evidence. It treats programming as an engineering practice: a small utility, automation component, data transformation, or diagnostic tool should be understandable, testable, maintainable, and connected to a real decision.

The part does not attempt to turn the reader into a general-purpose application developer. It builds the practical coding fluency required to contribute credibly to quality tooling, automation, diagnostics, test data, and future API, data, delivery, and reliability work.

---

## Purpose

To help experienced QA Engineers extend their testing and product knowledge into practical programming competence for Modern Quality Engineering.

The intended progression is:

```text
Understand
  → Write
  → Debug
  → Refactor
  → Design
  → Automate
  → Integrate
  → Produce engineering evidence
```

---

## Target Reader

This part is for experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers who may already modify scripts, use browser-automation tools, write simple JavaScript, TypeScript, or Python, or work with API clients, but want a more dependable engineering foundation.

It assumes familiarity with the Part I view of quality as a system property. It does not assume a computer-science degree, advanced mathematics, or prior experience designing production applications.

---

## Learning Outcomes

Upon completion of this part, readers will be able to:

- explain how programming improves quality-engineering contribution beyond test-script authoring;
- read unfamiliar code, identify responsibilities and dependencies, and make bounded changes safely;
- write clear TypeScript code using values, types, control flow, functions, and appropriate data structures;
- transform structured quality data such as JSON records, test results, and configuration safely;
- design reusable utilities with explicit inputs, outputs, boundaries, and side effects;
- work with files, configuration, dependencies, and deterministic test data without exposing secrets;
- reason about asynchronous work, polling, timeouts, retries, and race conditions;
- design defensive error handling and useful diagnostic output;
- debug, refactor, review, and test Quality Engineering utilities;
- use Git and pull-request practices to make changes reviewable; and
- assemble a small, tested Quality Engineering Toolkit that produces inspectable engineering evidence.

---

## Programming-Language Strategy

### Primary implementation language: TypeScript

Part II uses TypeScript as the primary implementation language. Its type system makes data contracts, nullability, function boundaries, and refactoring consequences visible; its asynchronous model is directly relevant to browser, API, event-driven, and automation work; and its JavaScript interoperability helps readers understand much of the existing test and quality-tooling ecosystem.

This is a curriculum implementation choice, not a claim that every Quality Engineer must use TypeScript or that one language guarantees quality. Concepts are introduced before syntax, and readers should be able to transfer the reasoning to the language used in their organisation.

### Comparative Python examples

Python may be used sparingly where a short comparison clarifies a concept or reflects a common quality-engineering context, such as a small data-processing or diagnostic utility. It will not create a parallel second implementation track, duplicate every exercise, or require learners to master two languages at once.

SQL, Bash, and Linux remain relevant MQE-BOK topics, but this part introduces only the programming reasoning needed to work with files, processes, and data safely. Their specialised application belongs primarily to later data and cloud/devops parts.

---

## Chapter Plan

| Chapter | Focus | Practical outcome |
|---|---|---|
| 1. Programming as a Quality Engineering Practice | Move from a test-script mindset to maintainable engineering contribution; read an unfamiliar repository, identify responsibilities, and reason about packages and dependencies. | A code-reading note and bounded change plan for a quality utility. |
| 2. Essential TypeScript for Quality Engineers | Use values, types, operators, control flow, functions, scope, and basic input/output to express quality rules. | A typed rule that evaluates realistic validation cases. |
| 3. Quality Data: Structures, JSON, and Transformations | Choose arrays, objects, maps, sets, and nested structures; parse and transform structured quality data. | A small transformation that turns raw test or API data into decision-relevant results. |
| 4. Functions, Modules, and Composable Design | Create cohesive functions and modules; distinguish pure and side-effecting code; use composition, interfaces, classes, immutability, and higher-order functions only where they improve clarity. | A reusable utility module with a documented boundary. |
| 5. Configuration, Files, Dependencies, and Test Data | Load and validate configuration; manage files and serialization; understand dependency and secret-handling boundaries; make test data repeatable. | A configuration and fixture loader with explicit validation and safe failure messages. |
| 6. Asynchronous Programming for Reliable Quality Feedback | Reason about promises, `async`/`await`, concurrency, polling, timeouts, retries, and race conditions. | A bounded asynchronous polling or retry operation with observable outcomes. |
| 7. Error Handling and Defensive Quality Utilities | Model invalid input, exceptions, error propagation, cleanup, failure classification, and actionable diagnostics. | A hardened utility that distinguishes transient, permanent, and configuration failures. |
| 8. Debugging Quality Engineering Code | Reproduce failures; read stack traces; use breakpoints, logs, and minimal experiments; separate test failure, utility defect, and system behaviour. | A concise debugging record that states evidence, cause, fix, and regression check. |
| 9. Maintainable Code and Refactoring | Improve names, duplication, cohesion, coupling, complexity, and testability without treating style rules as universal laws. | A behaviour-preserving refactor with before-and-after rationale and tests. |
| 10. Git, Code Review, and Collaborative Engineering | Use branches, commits, pull requests, reviews, and conflict resolution to make changes inspectable and recoverable. | A reviewable change set with a focused proposed commit sequence and pull-request description. |
| 11. Testing Quality Engineering Utilities | Test utility code with deterministic inputs, assertions, test doubles at boundaries, and proportionate coverage evidence. | A unit-tested utility with stated evidence and coverage limitations. |
| 12. Capstone: Quality Engineering Toolkit | Integrate the part's programming practices into a small, reusable, evidence-producing toolkit. | A maintainable toolkit, tests, documentation, and a portfolio-ready engineering evidence pack. |

This curriculum plan governs every manuscript. Each chapter follows the approved chapter template and uses supporting assets only where they improve a learning objective. Chapters 1–12 are Draft manuscripts; the completed delivery reviews and this normalization pass do not mark them Approved or published.

---

## Rationale for the Sequence

The sequence begins with professional intent and code reading because experienced QA Engineers often need confidence and a safe way to navigate existing code before they need more syntax. It then establishes TypeScript fundamentals and structured-data reasoning, which are the smallest useful foundations for utilities, diagnostics, and automated feedback.

Chapters 4 and 5 turn isolated code into reusable, configurable, and reproducible engineering assets. Chapters 6 through 9 address the conditions that make quality tooling unreliable or expensive to maintain: asynchronous behaviour, failure handling, diagnosis, and design debt. Chapters 10 and 11 make individual code contribution collaborative and trustworthy. The capstone requires the learner to integrate these practices, rather than treating each as a separate topic.

This progression prepares later parts without prematurely teaching their full specialisms: Part IV owns API Quality Engineering, Part V owns automation architecture and frameworks, Part VI owns data quality and SQL, Part VII owns cloud and CI/CD implementation, and Part VIII owns operational observability and reliability practice.

---

## Delivery Plan

| Delivery | Chapters | Outcome | Planned applied work |
|---|---|---|---|
| Delivery 1 — Programming Foundations | 1–3 | Readers can read code, write small typed functions, and transform structured quality data. | Code-reading, rule-writing, and data-transformation exercises. |
| Delivery 2 — Engineering Reusable Code | 4–5 | Readers can organise maintainable code and make its configuration, data, and dependencies explicit. | Utility-module and configuration-loader mini-projects. |
| Delivery 3 — Reliable and Maintainable Programming | 6–9 | Readers can build, diagnose, and improve code that handles asynchronous and failure-prone work. | Async-debugging, defensive-programming, and refactoring exercises. |
| Delivery 4 — Collaborative and Testable Contribution | 10–11 | Readers can contribute code through a reviewable workflow and validate their own utilities. | Git-review simulation and unit-testing mini-project. |
| Delivery 5 — Capstone and Review | 12 | Readers combine the curriculum into a portfolio-ready Quality Engineering Toolkit. | Capstone design, implementation, test, evidence, and reflection. |

Deliveries 1–5 are draft complete and reviewed or validated, including the validated capstone companion. The final cross-Part II quality gate is complete; Part II is completed for the v0.5.0 — Programming Complete release candidate. Diagrams, standalone labs, case studies, and repository-based projects remain Pass 2 enrichment and must be introduced only where their learning value is explicit.

---

## Current Manuscript and Companion State

All twelve chapter manuscripts remain **Draft**. Delivery 1 (Chapters 1–3), Delivery 2 (Chapters 4–5), Delivery 3 (Chapters 6–9), Delivery 4 (Chapters 10–11), and Delivery 5 (Chapter 12 and the Quality Engineering Toolkit) are draft complete and reviewed or validated. The Delivery 5 executable companion has passed its documented checks, build, tests, and local run.

The Part II normalization pass and final quality gate are complete: **95/100 — Exceptional / Reference Quality**, with no P0 findings and the final P1 finding closed. The v0.5.0 release candidate is prepared; final approval, the Git tag, and the GitHub Release remain pending. This is not a chapter-status decision; the manuscripts remain Draft.

### Local Tooling Baseline

Part II companions require Node.js 20 or later. Use `npm ci` where a committed lockfile is present (Deliveries 2–5 and the capstone); Delivery 1 has no committed lockfile and documents `npm install`. Examples have no application-runtime network dependency and use fictional local data. Environment-variable guidance includes POSIX and PowerShell forms where applicable.

---

## Practical Learning Strategy

Part II is deliberately more hands-on than Part I. Every major concept must eventually require the learner to read, write, modify, debug, or review code.

| Learning activity | Purpose | Evidence produced |
|---|---|---|
| Small coding exercises | Build fluency with one bounded concept at a time. | Source files and observable outputs. |
| Code-reading exercises | Develop confidence navigating existing utilities, automation code, and failures. | Responsibility map, assumptions, and change plan. |
| Debugging exercises | Practise diagnosis rather than trial-and-error editing. | Reproduction steps, evidence, cause, fix, and regression check. |
| Refactoring exercises | Make maintainability a behaviour-preserving engineering practice. | Before-and-after rationale, tests, and trade-offs. |
| Mini-projects | Connect related concepts into an inspectable utility. | Reusable module, documentation, test results, and review notes. |
| Planned labs | Apply several chapters to a realistic but bounded quality problem. | Strategy, source, diagnostics, and reflection. |
| Capstone portfolio | Demonstrate integrated capability without claiming production-scale system design. | Toolkit, tests, README, proposed collaboration artifacts, and evidence summary. |

Planned Pass 2 labs are: **Lab 1 — Designing a Configurable Quality-Data Utility** after Chapter 5, and **Lab 2 — Debugging and Hardening Asynchronous Quality Feedback** after Chapter 9. They are planning commitments only; no lab is created by this document.

---

## Capstone

### Quality Engineering Toolkit

The capstone is a small, reusable toolkit that demonstrates programming competence in a quality-engineering context. It is not a production service, a browser-automation framework, or a full API-testing product.

The toolkit should:

- load and validate non-secret configuration;
- consume fixture-based structured data;
- validate inputs and produce structured results;
- call or simulate a bounded asynchronous operation;
- apply explicitly configured timeout and retry behaviour for transient failure;
- produce useful, non-sensitive diagnostic output;
- separate reusable logic from file, configuration, and asynchronous boundaries;
- include unit tests for important success, failure, and boundary cases; and
- be maintained through a focused Git workflow and reviewable documentation.

The capstone evidence pack should include a short design note, source and tests, sample configuration and fixtures, representative output, a README with limits and safe-use notes, proposed collaboration artifacts, and a brief reflection on the risk, evidence, trade-offs, and next improvement. The learner must not use secrets, customer data, or unsupported production claims.

---

## QA → QE Competency Mapping

Part II primarily develops the **Programming Foundations** domain of the QA to Quality Engineering Transition Framework from Foundation toward Practitioner capability. It also creates prerequisites for Test Automation Engineering, API & Integration Engineering, Data & Database Quality, CI/CD & DevOps, Observability & Reliability, and Systems Thinking & Architecture. These are preparation links, not claims that Part II replaces the later domains.

| Chapter | QE competency developed and framework relationship | Practical evidence | Prerequisites | Prepares the learner for |
|---|---|---|---|---|
| 1 | Programming Foundations: read code, reason about dependencies, and plan bounded change. | Code-reading note and change plan. | Part I, especially Chapters 6 and 8. | Parts III–V, VII, and XI. |
| 2 | Programming Foundations: express rules in typed, reviewable code. | Typed validation rule and cases. | Chapter 1. | Parts III–VI. |
| 3 | Programming Foundations with Data & Database Quality preparation: reason about structured records and transformations. | Structured-data transformation. | Chapter 2. | Parts IV, V, and VI. |
| 4 | Programming Foundations: design reusable, testable code boundaries. | Reusable utility module. | Chapters 2–3. | Parts IV, V, VII, and XI. |
| 5 | Programming Foundations with Test Automation and CI/CD preparation: handle configuration, fixtures, dependencies, and repeatability. | Validated configuration and fixture loader. | Chapter 4. | Parts IV–VII. |
| 6 | Programming Foundations with API & Integration preparation: reason about asynchronous uncertainty and feedback timing. | Observable polling or retry operation. | Chapters 2–5. | Parts IV, V, VII, and VIII. |
| 7 | Programming Foundations with Reliability preparation: make failure paths controlled and diagnosable. | Failure-classifying utility. | Chapters 4–6. | Parts IV, V, VII, and VIII. |
| 8 | Programming Foundations with Observability preparation: investigate evidence and distinguish causes from symptoms. | Debugging record and regression check. | Chapters 2–7. | Parts III, V, VII, and VIII. |
| 9 | Programming Foundations: improve maintainability and testability through proportionate refactoring. | Tested refactor rationale. | Chapters 4–8. | Parts V and XI. |
| 10 | Programming Foundations with Communication, Leadership & Influence preparation: make change history and review evidence useful to others. | Focused commit history and pull-request description. | Chapters 1–9. | Parts V, VII, XI, and XII. |
| 11 | Programming Foundations with Software Testing Engineering preparation: test utility code and state evidence limits. | Unit-tested utility and evidence note. | Chapters 4–10. | Parts III–V. |
| 12 | Programming Foundations at Practitioner level: integrate code, data, async work, failures, tests, and collaboration into a coherent asset. | Quality Engineering Toolkit and evidence pack. | Chapters 1–11. | Parts III–VIII and the learner portfolio. |

---

## Skills Developed

- Code reading and engineering decomposition
- TypeScript fundamentals and type-aware programming
- Data-structure selection and JSON transformation
- Modular, composable, and testable utility design
- Configuration, dependency, file, and test-data handling
- Asynchronous programming and failure reasoning
- Debugging, logging, and diagnosis
- Refactoring and maintainability judgement
- Git, code review, and collaborative change practice
- Unit testing of Quality Engineering utilities
- Evidence-oriented technical documentation

---

## QA → QE Transition Relevance

Part II converts existing QA strengths—scenario thinking, edge-case awareness, defect investigation, and user advocacy—into technical contribution. The learner moves from executing or adapting scripts toward building and reviewing small engineering assets that make quality evidence faster, clearer, and more sustainable.

The target is not universal software-engineering expertise. It is the ability to create trustworthy utilities, collaborate effectively on code, state the limits of automated evidence, and use programming as leverage in quality decisions.

---

## MQE-BOK Mapping

**Primary domain:** Domain 2 — Programming for Quality Engineers

**Contributing domains:**

- Domain 3 — Software Testing Engineering
- Domain 4 — API Quality Engineering
- Domain 5 — Automation Engineering
- Domain 6 — Data Quality Engineering
- Domain 7 — Cloud & DevOps
- Domain 8 — Observability & Reliability Engineering
- Domain 11 — System Design & Architecture
- Domain 12 — Engineering Leadership

---

## Prerequisites

- Completion of Part I — Foundations, or equivalent demonstrated understanding of quality as a system property, risk-based evidence, systems thinking, and the Modern Quality Engineer role.
- Ability to use a code editor, terminal, and source-control client at a basic level. Chapter 1 establishes the working practices required for the remaining chapters.

---

## Scope Boundaries

Part II deliberately does not attempt to teach:

- deep algorithms, advanced data structures, or a general computer-science curriculum;
- full web, mobile, desktop, backend, or distributed-application development;
- a complete Python course or parallel multi-language implementations;
- advanced database engineering, SQL, data pipelines, or data-platform validation;
- full API testing, authentication, contract testing, service virtualisation, or browser-automation frameworks;
- cloud infrastructure, CI/CD implementation, containerisation, or platform engineering;
- production observability, SRE practice, performance engineering, security engineering, or chaos experimentation;
- AI-system implementation, model training, or AI evaluation; or
- universal design-pattern catalogues, language-specific tricks, or tool certifications.

Those topics have dedicated later handbook parts. Part II supplies the programming reasoning and code-quality habits needed to learn them effectively.

---

## Completion Criteria

- Pass 1: Twelve chapter manuscripts completed using the approved chapter template, each with explicit QE capability, code-oriented practice, review questions, interview questions, and references.
- Pass 2: Proportionate diagrams, two standalone labs, selected mini-projects, executable examples, capstone guidance, and cross-links integrated and validated.
- Every learner-facing activity results in inspectable code, a diagnosis, a reviewable decision, or another stated form of engineering evidence.
- The capstone demonstrates the part's integrated programming outcomes without exceeding the published scope boundaries.
