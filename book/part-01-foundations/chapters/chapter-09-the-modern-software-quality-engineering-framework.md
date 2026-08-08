# Chapter 9 — The Modern Software Quality Engineering Framework

## Metadata

| Attribute | Detail |
|---|---|
| Part | Part I — Foundations of Modern Software Quality Engineering |
| MQE-BOK domain | Domain 1 — Foundations of Modern Software Quality Engineering |
| Chapter | 9 |
| Audience | Software Testers, QA Engineers, Automation Engineers, SDETs, Software Engineers, Product Managers, and Engineering Managers |
| Prerequisites | Chapters 1–8 |
| Estimated study time | 120 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Technical Review Ready |

---

## Opening Quote

> “Quality is not a department; it is a property of the system and the way the system is engineered.”
>
> — MSQE principle

---

## Opening Story

The following illustrative scenario shows why a broader framework is useful.

Northstar Benefits operated a digital claims platform used by employers, members, and internal case workers. Its quality group had invested heavily in end-to-end regression automation. Every release produced more passing tests, yet customers still experienced delayed claims, duplicate payments, and periods in which support staff could not explain why a claim had stopped progressing.

The immediate response was familiar: add more tests. The team added browser checks for the claims screens and expanded the regression suite. The additional checks found some defects, but they did not explain the operational failures. A later investigation showed that the largest sources of customer harm were distributed across the system. An event consumer could process a message more than once after a retry. A configuration change reduced the capacity of a downstream integration. The data pipeline contained a late reference-data feed. The service exposed technical logs but no useful business-level signal for claims waiting longer than the service target.

The organisation reframed the problem. Instead of asking only, “Which tests are missing?”, it asked a set of connected engineering questions:

- Are the business rules unambiguous and testable before implementation?
- Can the service safely handle a repeated request or message?
- Are data contracts, freshness, and reconciliation checks defined?
- Do deployment controls and runtime telemetry make failure visible early?
- Can the team make a risk-based release decision using evidence from several domains?

The answer involved testing, but it did not stop there. Developers improved idempotency—the property that repeated execution of an operation has the same intended effect as executing it once—for payment events. Platform engineers introduced safer configuration validation and progressive deployment controls. Data engineers added freshness and reconciliation checks. The product, operations, and quality disciplines agreed on a service-level indicator for claims pending beyond an agreed threshold, then used it to guide prioritisation. Regression testing became more targeted because the system provided better evidence about its real risks.

Northstar did not adopt a new testing tool or declare that “quality belonged to everyone” and leave the slogan unexplained. It used a shared map of engineering domains to identify missing capabilities and their relationships. That is the purpose of the framework in this chapter.

---

## Why This Chapter Matters

The earlier chapters establish the ideas behind Modern Software Quality Engineering (MSQE): quality is engineered into a system; software is best understood as a sociotechnical system; feedback must be used throughout the lifecycle; and quality work is a shared engineering responsibility. Those ideas are easy to agree with in principle and harder to apply when a delivery organisation is deciding what to improve next.

Teams often inherit labels rather than an integrated model. One group owns test automation, another owns cloud infrastructure, a third owns production monitoring, and a fourth owns data. Each group may do valuable work, yet gaps appear at the boundaries. A release can satisfy a test suite while using stale data. A service can pass performance checks while its operational alerts do not represent customer impact. A model can meet an offline accuracy target while exhibiting unfair or unsafe behaviour for an important user group. No single discipline can responsibly make all of these concerns disappear.

The **MSQE Educational Framework** is an original, vendor-neutral teaching model for connecting those concerns. It provides a common vocabulary for the capability domains that jointly influence software quality, the cross-cutting practices that connect them, and the lifecycle decisions in which the practices should be applied. It is not an industry standard, a certification scheme, or a replacement for a team’s domain-specific methods.

The word *framework* is used here in its practical sense: a structured way to organise related concepts and guide discussion. It is not a maturity model—a staged rating scheme that assigns an organisation to a level—and it should not be used as one. The framework helps a team reason about where quality evidence comes from, which disciplines need to collaborate, and where investment may reduce meaningful risk. It does not produce a universal score, prescribe a toolchain, or guarantee outcomes.

For an experienced QA Engineer, this chapter also changes the question from “What must I become instead of a tester?” to “How do my testing skills participate in a larger engineering system?” Test design, exploratory testing, automation, risk analysis, and clear defect communication remain valuable. They become more effective when joined to architecture, data, delivery, observability, reliability, security, and product decisions.

---

## Learning Objectives

By the end of this chapter, you should be able to:

- Explain why modern software quality requires an integrated framework rather than a testing-only view.
- Describe the purpose and boundaries of the MSQE Educational Framework.
- Identify the ten capability domains and the cross-cutting concerns that connect them.
- Map quality activities to high-level lifecycle decisions without treating the lifecycle as a linear handoff.
- Distinguish the original MSQE Educational Framework from established standards, research, and industry practices.
- Use the framework to identify strengths, gaps, dependencies, and improvement priorities in a delivery context.

---

## Why a Quality Engineering Framework Is Needed

Modern software is assembled from code, infrastructure, data, third-party services, deployment pipelines, operational procedures, and human decisions. These elements change at different rates and are managed by people with different roles. A narrow quality model can create a false sense of control: it measures the activity that is easiest to see while leaving the conditions of customer harm unexamined.

Consider a checkout service that occasionally creates duplicate orders. The failure might be described as a functional defect, but its causes and controls can span several domains. The product design may not state the expected behaviour after a customer refreshes a page. The service may lack an idempotency key. The client may retry an ambiguous request too quickly. A database or message consumer may not make duplicate handling visible. Monitoring may report elevated errors without showing duplicate-order rate. Customer support may have no safe recovery path. A useful response needs a connected view of requirements, design, code, tests, operational signals, and learning.

This does not mean every change requires every specialist. It means teams should know which concerns are relevant to a particular risk and should involve the appropriate expertise early enough to influence the design. The framework makes that reasoning explicit.

Four recurring pressures make the need especially visible.

### Interdependence Has Increased

Cloud services, APIs, asynchronous processing, feature flags, managed platforms, and continuous delivery shorten feedback cycles but also create more interactions. A team can deploy a small code change that changes load patterns, data retention, security exposure, operational cost, or a downstream service’s behaviour. Quality evidence must therefore be assembled from more than one test environment.

### Feedback Arrives from More Than One Place

Automated checks are important sources of feedback, but they are not the only sources. Production telemetry, customer support contacts, accessibility findings, security reviews, incident learning, data-quality checks, and product metrics each reveal different aspects of system behaviour. The task is not to gather every possible metric. It is to choose evidence that is sufficiently trustworthy and timely for the decision being made.

### Responsibilities Are Distributed

In a modern delivery organisation, engineering roles are specialised without being isolated. A platform team may provide deployment guardrails; application teams decide how to use them. Security practitioners may provide threat-modelling guidance; product and engineering teams make design decisions. Quality Engineers can help establish test strategy, observability expectations, and meaningful quality signals, but they cannot own every quality outcome alone. Shared ownership needs explicit interfaces, not vague encouragement.

### Improvement Requires Trade-offs

Quality is not maximised by applying every control at maximum intensity. A critical payment path justifies different evidence, resilience controls, and release safeguards from a low-risk internal report. A framework supports proportionate decisions by connecting customer value, risk, technical evidence, and operational consequences. It helps teams ask what to improve first and why.

---

## Design Principles of the MSQE Educational Framework

The framework is guided by principles rather than a mandated process. These principles are original MSQE guidance; they should not be confused with requirements from a formal standard.

| Design principle | Meaning in practice |
|---|---|
| Engineering first | Treat quality as a property shaped by design, implementation, operation, and learning—not as a final inspection activity. |
| Systems thinking | Consider interactions, dependencies, feedback loops, and unintended consequences as well as isolated components. |
| Vendor neutrality | Describe desired capabilities and evidence before selecting tools, cloud services, or products. |
| Evidence-based decisions | Use relevant, trustworthy evidence to make release, prioritisation, and improvement decisions; do not rely on a single vanity metric. |
| Continuous improvement | Use outcomes, incidents, experiments, and changing risks to improve the system and the way it is engineered. |
| Shared ownership | Make responsibilities and decision rights explicit across product, engineering, operations, security, data, and quality disciplines. |
| Lifecycle integration | Address quality concerns when decisions can still change the outcome, from idea through operation and learning. |
| Practical applicability | Prefer a usable, context-sensitive model over an exhaustive checklist that teams cannot sustain. |

These principles impose useful constraints. For example, vendor neutrality prevents a framework discussion from becoming a catalogue of tools. Evidence-based decision making prevents a quality dashboard from becoming a display of activity counts. Practical applicability prevents a team from claiming that every domain must receive the same investment on every piece of work.

The principles also make space for professional judgement. A framework can improve a conversation, but it cannot remove the need to understand the product, its users, its constraints, and the consequences of failure.

---

## Overview of the MSQE Educational Framework

The MSQE Educational Framework has three connected views:

1. **Core domains** describe the major engineering capability areas that contribute to quality.
2. **Cross-cutting concerns** describe considerations that apply across domains rather than belonging to one specialist group.
3. **Lifecycle mapping** shows where the domains inform decisions from idea to continuous improvement.

The framework is intentionally a map, not a hierarchy. The domains are shown as distinct to make responsibilities discussable; they are not a sequence, team structure, or list of job titles. An organisation may combine domains in one team, distribute them across several teams, or use different names. What matters is whether the relevant capability and accountability exist.

The framework also differs from the **Quality Engineer Competency Model** introduced in Chapter 8. The competency model describes the knowledge, skills, and behaviours an individual Quality Engineer may develop. The MSQE Educational Framework describes the organisational and technical capability areas that must work together. A Quality Engineer may contribute to several framework domains, but no individual is expected to be the sole expert in all of them.

The [Modern Software Quality Engineering Framework diagram](../../../diagrams/chapter-09-msqe-framework.md) shows the ten core domains, cross-cutting concerns, and continuous lifecycle feedback. It is an **MSQE Educational Framework**, not an industry standard, maturity model, or certification standard.

### Core Domains at a Glance

| Core domain | Primary question it helps answer | Typical evidence or outcome |
|---|---|---|
| Engineering Foundations | Is the system built on sound engineering practices and understandable design? | Maintainable code, clear interfaces, review evidence, manageable technical debt |
| Software Quality Engineering | Are quality risks, attributes, and acceptance evidence designed into delivery decisions? | Risk-based strategy, quality scenarios, release evidence, improvement priorities |
| Software Testing Engineering | Do purposeful investigations and checks reveal meaningful information about product behaviour? | Test design, exploratory findings, defect patterns, confidence boundaries |
| Automation Engineering | Are repeatable checks and feedback mechanisms reliable, maintainable, and valuable? | Fast feedback, stable automation, useful pipelines, reduced manual repetition |
| Data Quality Engineering | Is data accurate, complete, timely, consistent, and appropriately governed for its intended use? | Data contracts, reconciliation, freshness checks, lineage and quality signals |
| Cloud & DevOps | Can the system be built, deployed, configured, and operated safely and repeatably? | Reproducible delivery, controlled configuration, deployment evidence, recoverability |
| Observability & Reliability | Can teams understand runtime behaviour and sustain agreed service outcomes? | Useful telemetry, service indicators, resilience learning, effective response |
| AI Quality Engineering | Do AI-enabled behaviours meet defined performance, safety, fairness, and operational expectations? | Evaluation evidence, monitoring, human oversight, model-change controls |
| Performance & Security | Does the system remain responsive and protect assets under expected and adverse conditions? | Capacity evidence, threat analysis, vulnerability management, security controls |
| Engineering Leadership | Are direction, collaboration, learning, and investment decisions enabling sustained quality? | Clear priorities, healthy quality culture, capability growth, aligned incentives |

The table names the principal question, not an exclusive scope. For example, performance concerns affect architecture, test design, deployment, observability, and leadership investment. The named domain provides a focus for expertise; cross-cutting concerns ensure the focus is connected to the wider system.

---

## Core Domains

### Engineering Foundations

Engineering Foundations concerns the practices that make software understandable, changeable, and dependable. It includes design clarity, code quality, version control, code review, modularity, dependency management, interface design, configuration discipline, and the management of technical debt. These practices are not separate from quality; they shape how safely a team can change a system and how effectively it can diagnose problems.

For a Quality Engineer, this domain changes the quality conversation. Rather than receiving a build as an opaque object to test, the Quality Engineer can participate in discussions about testability, controllability, diagnosability, and failure handling. Testability is an engineering capability: the degree to which a system can be set up, observed, and exercised so that its behaviour can be evaluated. It is not an ISO/IEC 25010 product quality characteristic, although it can support the evaluation of product quality characteristics such as reliability and maintainability.[^iso25010]

### Software Quality Engineering

Software Quality Engineering connects customer value, quality attributes, risk, evidence, and delivery decisions. It asks what quality means for a particular product in a particular context, which failures matter most, how quality expectations become observable, and what evidence is sufficient for a decision. This domain includes quality strategy, risk modelling, quality scenarios, acceptance criteria, release readiness, and improvement work.

Its purpose is coordination, not centralised control. A quality strategy is useful when it helps developers, testers, operators, product managers, and other contributors make compatible decisions. It is not useful when it becomes a document that describes testing activity without influencing design or operations.

### Software Testing Engineering

Software Testing Engineering designs and performs purposeful investigations of software behaviour. It includes test analysis, test design, exploratory testing, checking, test data selection, environment reasoning, fault investigation, and communication of findings. ISO/IEC/IEEE 29119 provides internationally agreed concepts and processes for software testing; teams can use such standards where appropriate while retaining context-sensitive judgement.[^iso29119]

Testing remains central to MSQE because it provides unique evidence. A skilled tester can identify ambiguous requirements, formulate revealing experiments, recognise patterns that automation has not been designed to detect, and communicate uncertainty clearly. The framework does not reduce testing to one automated pipeline stage. It places testing alongside the other disciplines that make testing more effective.

### Automation Engineering

Automation Engineering concerns the design, operation, and maintenance of automated feedback and control mechanisms. It includes automated checks, test infrastructure, delivery-pipeline quality gates, environment provisioning, data setup, reporting, and the reliability of the automation itself. The goal is not the largest possible number of automated tests. The goal is repeatable, trustworthy feedback at a cost the team can sustain.

An automated check that is slow, unstable, hard to diagnose, or disconnected from a decision can create delay without confidence. Conversely, a small automated contract check can prevent a high-impact integration failure early. Automation therefore requires the same engineering care as product code: clear ownership, design, observability, maintenance, and assessment of value.

### Data Quality Engineering

Data Quality Engineering treats data as a product and a dependency with explicit expectations. It addresses accuracy, completeness, consistency, timeliness, uniqueness, validity, lineage, access controls, and fitness for intended use. The exact dimensions that matter depend on the domain. A financial balance may require reconciliation and precision controls; a delivery estimate may depend more on freshness and clear provenance.

Modern systems frequently exchange data through events, APIs, warehouses, feature stores, and analytics platforms. A functional test can confirm that an interface accepted a message while missing a late, duplicated, malformed, or semantically inconsistent record. Data contracts, validation, reconciliation, and operational quality signals allow teams to discover and prevent such failures. This domain is especially important where business decisions, reporting, or AI systems depend on data.

### Cloud & DevOps

Cloud & DevOps concerns the ability to build, deploy, configure, and operate software safely and repeatedly. It includes infrastructure as code, environment consistency, configuration management, deployment automation, rollback and recovery mechanisms, access controls, and operational collaboration. DevOps is not merely a toolchain or a platform-team responsibility; it is a way of reducing harmful handoffs between those who build and those who operate software.

The domain is relevant to quality because the delivered system includes its runtime configuration and operational environment. A correct build can fail after deployment because a secret is missing, a feature flag is misconfigured, capacity is constrained, or a downstream service behaves differently from the test double. ISO/IEC/IEEE 12207 defines software lifecycle processes; it provides an established reference for lifecycle concerns, whereas the MSQE framework provides an educational way to connect the quality-related capabilities that participate in those processes.[^iso12207]

### Observability & Reliability

Observability & Reliability concerns whether teams can infer meaningful internal system state from its outputs and sustain expected service behaviour over time. Observability is supported by useful logs, metrics, traces, events, dashboards, and business signals. Reliability includes the ability to prevent, withstand, detect, respond to, and learn from failure.

Monitoring and alerting should serve decisions. Google’s Site Reliability Engineering guidance distinguishes symptom-based signals from lower-level causes and emphasises service-level thinking rather than indiscriminate alerting.[^googlesre] In a quality context, the question is not simply whether a dashboard exists. It is whether the system supplies evidence that a team can use to understand customer-impacting behaviour and act before harm becomes widespread.

This domain connects directly to testing. Production signals can expose assumptions that test environments could not reproduce. Test findings can suggest telemetry that will make future failures diagnosable. The relationship is a feedback loop, not a replacement of one activity with another.

### AI Quality Engineering

AI Quality Engineering addresses the evaluation and operation of AI-enabled behaviour. Depending on the system, it may include data suitability, model evaluation, prompt and response evaluation, robustness, safety, fairness, privacy, explainability, human oversight, versioning, and monitoring for behavioural change. It is included as a separate domain because probabilistic or data-driven behaviour creates quality questions that cannot be answered solely by traditional deterministic functional checks.

The framework does not prescribe a universal set of AI metrics. A customer-support assistant, a fraud-detection model, and a code-completion tool have different harms, users, thresholds, and oversight needs. The discipline begins with intended use, unacceptable outcomes, evaluation methods, and operational controls. It should work with the data, security, observability, testing, and leadership domains rather than being treated as an isolated model-validation activity.

### Performance & Security

Performance & Security brings together two concerns that are often discovered too late: whether a system remains responsive under meaningful load, and whether it protects assets against relevant threats. They are related through architecture and risk, but they remain distinct engineering specialties. Performance work includes workload modelling, capacity, latency, throughput, resource contention, resilience under load, and analysis of bottlenecks. Security work includes threat modelling, secure design, identity and access management, dependency and vulnerability management, security testing, and incident preparedness.

The OWASP threat-modelling guidance frames threat modelling as a structured activity for identifying and addressing threats during design rather than only after implementation.[^owasp] The MSQE framework does not replace OWASP guidance or turn security into a testing checklist. It makes the dependency visible: a quality decision about a new capability may require both performance and security evidence because either weakness can cause customer harm.

### Engineering Leadership

Engineering Leadership enables the conditions in which the other domains can work together. It includes direction setting, investment decisions, role clarity, collaboration, psychological safety, capability development, governance proportionate to risk, and learning from outcomes. It is not limited to formal managers. Senior individual contributors, technical leads, Quality Engineers, product leaders, and operations leaders all exercise leadership when they improve how quality decisions are made.

This domain matters because improvements often span ownership boundaries. A team may know that its automation is flaky, its production signals are weak, or its data checks are absent, but be unable to act if time, incentives, and decision rights are misaligned. Leadership turns quality from a local optimisation into an engineering priority with sustainable follow-through.

---

## Cross-Cutting Concerns

The domains make capability visible. The following concerns connect them and should be considered wherever they are relevant. They are not another backlog of mandatory activities.

| Cross-cutting concern | Questions that connect the domains |
|---|---|
| Risk-based thinking | What could harm customers, the business, or other stakeholders, and which uncertainty deserves attention first? |
| Systems thinking | What interactions, dependencies, delays, and feedback loops could make a local change produce a wider effect? |
| Continuous feedback | Which signals from development, delivery, production, and users can improve the next decision? |
| Valuable automation | Which repeated activity should be automated, and is the resulting feedback trustworthy enough to guide action? |
| Meaningful metrics | Does a measure represent an outcome or decision, or merely record activity? What behaviour might it unintentionally encourage? |
| Collaboration | Who needs to contribute expertise, make a decision, or receive the resulting evidence? |
| Learning culture | Can people surface uncertainty, mistakes, near misses, and improvement opportunities without blame or concealment? |
| Ethical responsibility | Who could be harmed by failure, exclusion, misuse, privacy loss, biased behaviour, or unexamined trade-offs? |
| Customer value | How does this work improve the user’s ability to achieve an intended outcome safely, reliably, and with appropriate effort? |

Risk provides a useful starting point because it directs attention. It should not, however, be treated as an excuse to omit evidence. A risk-based approach makes assumptions explicit, considers likelihood and impact, and chooses controls that are proportionate to the consequences of failure. It also revisits those choices when evidence changes.

Metrics require similar care. Build-pass percentage, test count, deployment count, and mean time to resolve can all be useful in context, but none independently describes product quality. DORA research presents software delivery performance as a model of capabilities, metrics, and outcomes rather than a single universal score.[^dora] The MSQE framework adopts the same caution in principle: select measures to inform a decision, inspect their limitations, and combine them with qualitative evidence.

---

## Framework Mapping Across the Lifecycle

The framework is applied throughout the lifecycle, but it does not introduce a new lifecycle model. Chapter 4 explains how quality is engineered across lifecycle activities, and Chapter 5 explains how feedback operates before and after release. The mapping below is a concise integration aid: it shows the questions that the framework can bring to each high-level decision point.

| Lifecycle moment | Framework emphasis | Example question |
|---|---|---|
| Idea | Customer value, risk, leadership, ethical responsibility | Whose problem is being solved, what could cause harm, and what outcomes will show value? |
| Requirements | Quality Engineering, testing, data, security | Are rules, constraints, data expectations, and unacceptable outcomes clear enough to evaluate? |
| Design | Engineering Foundations, systems thinking, performance, security, reliability | How will components fail, recover, scale, protect assets, and provide evidence of their state? |
| Development | Engineering Foundations, testing, automation, collaboration | Are changes reviewable, testable, observable, and supported by useful automated feedback? |
| Verification | Testing, automation, data, performance, security | What evidence is needed for the risks of this change, and what uncertainty remains? |
| Deployment | Cloud & DevOps, observability, reliability, leadership | Can the change be released progressively, observed, recovered, and communicated safely? |
| Operations | Observability, reliability, customer value, learning culture | Are customers achieving expected outcomes, and can the team detect and respond to degradation? |
| Continuous improvement | All domains, feedback, risk, leadership | What did evidence reveal, and which systemic improvement will reduce future harm? |

This mapping should not be read left to right as a one-way process. Operations may reveal a design weakness. A data-quality alert may create a new acceptance scenario. A security review may alter the release approach. Continuous improvement returns learning to the next idea and requirement.

---

## Relationship to Standards, Research, and Established Practices

The MSQE Educational Framework is original MSQE content. It is intended to help readers organise learning and engineering discussions. It does not claim to define conformance, supersede established bodies of knowledge, or compete with standards and research.

| Established source | What it contributes | Relationship to the MSQE Educational Framework |
|---|---|---|
| ISO/IEC 25010 | A product quality model with defined product quality characteristics. | Helps teams discuss and evaluate product-quality characteristics. The framework connects that work to the wider engineering capabilities needed to achieve and sustain quality. |
| ISO/IEC/IEEE 29119 | Internationally agreed software-testing concepts, processes, and documentation guidance. | Informs the Software Testing Engineering domain; it is not replaced by the framework. |
| ISO/IEC/IEEE 12207 | Software lifecycle processes and related concepts. | Provides lifecycle-process reference material; the framework supplies a cross-domain educational view of quality work within and around those processes. |
| OWASP resources | Widely used practical guidance for application security, including threat modelling and secure development. | Informs the Performance & Security domain; teams should use relevant OWASP guidance for security work rather than treating the framework as a security standard. |
| DORA research | Empirical research into software delivery capabilities, metrics, and outcomes. | Helps teams reason about delivery performance and measurement. The framework does not turn DORA measures into quality scores. |
| Google SRE | Practices and concepts for operating reliable services, including service-level thinking and incident learning. | Informs Observability & Reliability; it is a body of practice, not a substitute for product and quality decisions. |
| IEEE and ACM bodies of knowledge | Professional and academic foundations for software engineering and computing disciplines. | Offer deeper, established terminology and learning resources for individual domains. |

The distinction is important in both directions. A team pursuing ISO conformance should consult the relevant standard and competent assessors; an MSQE framework workshop cannot establish compliance. A team using the framework should also avoid assuming that an external standard will decide its product-specific trade-offs. Standards and research provide durable references. The framework helps people connect those references to the engineering decisions in front of them.

---

## Applying the Framework: An Illustrative Example

The following illustrative example demonstrates a lightweight application of the framework. It is not a prescribed assessment method.

Harbour Market is preparing to expand a marketplace platform into a new region. The product change appears straightforward: support a new currency, local tax rules, and a new payment provider. The initial plan assigns the work to the application team and schedules a regression cycle. During planning, a Quality Engineer uses the framework to structure a cross-functional conversation.

The team identifies the following observations.

| Domain | Existing strength | Gap or uncertainty | First proportionate action |
|---|---|---|---|
| Engineering Foundations | Payments service has clear API boundaries. | Currency rounding rules are scattered across clients and services. | Define a single domain rule and representative boundary examples. |
| Software Quality Engineering | Teams understand the commercial launch date. | The highest-risk customer and regulatory failures are not ranked. | Run a short risk workshop with product, finance, security, and operations. |
| Software Testing Engineering | Regression coverage exists for the current provider. | Boundary conditions for taxes, rounding, refunds, and provider failures are incomplete. | Design focused examples and exploratory charters around those risks. |
| Automation Engineering | Contract checks run in continuous integration. | New-provider error and retry scenarios are only manual. | Add high-value contract and service-level checks before broad UI automation. |
| Data Quality Engineering | Transaction records reconcile overnight. | Currency conversion source, freshness, and rounding provenance are unclear. | Define data ownership, freshness expectations, and reconciliation controls. |
| Cloud & DevOps | Feature flags allow controlled exposure. | Rollback semantics for in-flight payments are not documented. | Validate deployment, rollback, and operational runbook behaviour. |
| Observability & Reliability | Technical error dashboards exist. | No signal shows customer-visible payment completion by region and currency. | Add an outcome-oriented service indicator and alerting response. |
| AI Quality Engineering | No AI component is in the payment path. | None for this change. | Record the domain as not applicable rather than manufacturing work. |
| Performance & Security | Existing penetration-test process is available. | New provider webhooks and regional data handling change the threat model. | Update threat model and test expected load and failure modes. |
| Engineering Leadership | Teams can make local implementation decisions quickly. | No one has agreed evidence required for a staged launch. | Name decision owners and agree launch, pause, and rollback criteria. |

This view does not make the release slower by definition. It makes uncertainty visible early enough to choose focused work. The team may decide that the AI domain is not relevant, that full load testing is unnecessary for the initial exposure, or that a particular automated check can wait. Those are legitimate decisions when risks, assumptions, and monitoring are clear.

The outcome is not “all domains are complete.” The outcome is a reasoned plan: important risks have owners; evidence is linked to decisions; and the team knows what to observe after release. If the staged launch reveals an unexpected payment-completion pattern, that operational learning returns to the framework and changes the next priority.

---

## Strengths and Limitations of the Framework

The framework is useful because it makes a broad quality landscape manageable without pretending that one practice is sufficient. It offers several strengths:

- It gives experienced testers a way to connect existing expertise with adjacent engineering disciplines.
- It reveals dependencies that team boundaries can hide.
- It supports risk-based discussion without prescribing a vendor, team topology, or maturity level.
- It makes room for data, operational, security, performance, and AI concerns alongside functional correctness.
- It can be used at several scales: a feature discussion, a service improvement, a programme roadmap, or a learning plan.

Its limitations are equally important.

First, it is conceptual. It cannot calculate whether a release is safe, prove regulatory compliance, or replace expert analysis. Second, the names and boundaries of domains can create an illusion of separation if users forget the cross-cutting concerns. Third, a broad framework can become performative if an organisation uses it to create inventories and scores without changing decisions. Finally, not every domain has equal relevance to every context. A small internal tool and a safety-critical, data-intensive public service require different depth of assessment.

Use the framework as a conversation and decision aid. Pair it with technical evidence, product knowledge, applicable standards, and appropriate specialists. Revise its application when the system or its risks change.

---

## Engineering Perspective

An engineering team can use the framework before implementation by selecting the domains that carry meaningful risk for a change. For example, a new asynchronous inventory-reservation workflow may require attention to domain rules, duplicate-message handling, contract tests, message-pipeline observability, capacity under replay, data reconciliation, and recovery procedures. The framework helps the team see these as connected design responsibilities, not a queue of tasks handed to separate groups after coding.

The most useful output is usually a small set of explicit decisions. What does correct behaviour mean if a reservation message is repeated? Which signal represents a customer unable to complete an order? Which data check detects divergence between inventory and reservation records? What release control limits exposure while evidence is still being gathered? Which person or role decides whether the residual risk is acceptable? These questions create testable and observable commitments.

The framework also helps prevent a common engineering mistake: treating an absence of test failures as evidence of an absence of risk. Passing checks are evidence about what was checked under stated conditions. They are not evidence that every dependency, workload, configuration, customer path, or future change is safe. Strong engineering makes the remaining uncertainty visible and proportionately managed.

---

## Industry Perspective

Industry practice increasingly treats quality as a delivery and operational capability, not an isolated test phase. ISO quality and testing standards provide structured terminology and models. DORA research connects technical and organisational capabilities to delivery performance. Site Reliability Engineering brings service-level objectives, monitoring, incident response, and learning into everyday engineering. OWASP guidance helps teams address security earlier in design and delivery. These sources address different problems and should be used for their stated purposes.[^iso25010][^iso29119][^dora][^googlesre][^owasp]

The MSQE Educational Framework does not combine them into a single universal doctrine. Its contribution is integrative: it helps a Quality Engineer understand why a data-quality concern may need an operational signal, why a security decision affects a release strategy, or why automation architecture is an engineering investment rather than a measure of testing effort. This framing is particularly useful in organisations where responsibilities have evolved faster than the shared language for connecting them.

---

## Common Misconceptions

### “The framework replaces ISO, OWASP, DORA, or Google SRE.”

It does not. Those sources have distinct scopes, authority, and evidence bases. The framework is original MSQE educational guidance for connecting relevant practices and discussions.

### “It is a maturity model.”

It is not. It does not assign levels, certify organisations, or imply that every team must progress through the same sequence. Teams should use context, risk, and outcomes to choose improvements.

### “Each domain requires a separate team or job title.”

It does not. A small team may cover several domains, while a large organisation may have dedicated specialists. The framework identifies capabilities and collaboration needs, not an organisational chart.

### “Every organisation needs equal depth in every domain.”

It does not. Relevance depends on product context, regulation, customer impact, technology, and risk. The goal is informed prioritisation, not symmetrical investment.

### “Quality Engineering is just the centre of the framework.”

Quality Engineering is an important integrating domain, but no single domain is the centre in every situation. A data incident, security risk, or reliability problem may require leadership from the domain with the closest expertise while still using cross-functional evidence.

### “The framework makes testing less important.”

It does not. It explains why skilled testing is necessary but insufficient on its own. Testing contributes unique evidence and works best when the system is designed, deployed, and operated to make quality observable and controllable.

---

## Practical Exercise: Framework Assessment Workshop

The following exercise is a facilitated, illustrative workshop. Use a fictional organisation or a non-sensitive service from your own context. Do not treat the result as a formal audit.

For a reusable, facilitated version with a Quality Engineering Improvement Plan, use the [MSQE Framework Assessment Workshop](../exercises/workshop-msqe-framework-assessment.md).

### Scenario

Atlas Learning provides an online learning platform. Over the last quarter it has experienced intermittent assessment-submission failures, slow page loads during enrolment peaks, and occasional discrepancies between teacher dashboards and exported reports. Its leadership has asked whether it should invest first in more UI automation, infrastructure capacity, or data controls.

### Instructions

1. Form a group representing product, development, testing, platform or operations, data, security, and customer support perspectives. If some roles are unavailable, record the missing perspective rather than guessing silently.
2. State the customer outcomes that matter for this service and the plausible harms if it fails.
3. For each framework domain, identify one existing strength, one uncertainty or gap, and one question that needs evidence.
4. Identify cross-cutting concerns. For example, determine where risk, customer value, feedback, and collaboration alter the initial technical recommendation.
5. Select no more than three improvement actions for the next planning period. State the decision each action will support and the evidence that would show progress.
6. Identify what will be observed after the change and when the group will review the outcome.

Use a working table such as the following.

| Domain or concern | Current evidence | Uncertainty or risk | Owner or collaborator | Candidate action |
|---|---|---|---|---|
| Software Testing Engineering | Submission regression checks pass. | Failure may occur only with session expiry or slow network conditions. | Test and application engineers | Design focused exploratory and service-level investigations. |
| Observability & Reliability | Error logs exist. | No signal distinguishes failed assessment submission from user abandonment. | Application and operations engineers | Define a business outcome signal and response path. |
| Data Quality Engineering | Nightly report reconciliation exists. | Dashboard data may be delayed during enrolment peaks. | Data and product engineers | Define freshness expectation and alerting threshold. |
| Performance & Security | Prior peak-load test is available. | New usage pattern and export workload may invalidate it. | Performance, platform, and security contributors | Model current workload and prioritise targeted capacity evidence. |

### Reflection Questions

- Did the group begin with a preferred solution before it understood the problem?
- Which domain supplied evidence that changed the proposed priority?
- Which concern could not be resolved without collaboration across roles?
- What is deliberately out of scope for the next planning period, and what evidence makes that an acceptable trade-off?
- How will customer-facing outcomes be distinguished from internal activity metrics?

---

## Summary

Modern Software Quality Engineering cannot be reduced to a test phase, a toolchain, or a single role. Quality emerges from related engineering capabilities: clear design, purposeful testing, valuable automation, trustworthy data, safe delivery, operational insight, performance and security work, responsible AI practices where relevant, and leadership that enables learning and collaboration.

The MSQE Educational Framework is an original teaching model that organises these capabilities into ten core domains, connects them through cross-cutting concerns, and maps them to lifecycle decisions. It helps teams use shared language to find gaps and dependencies without prescribing a universal process or maturity level.

The framework should be used with, not instead of, established standards, research, and practices. ISO/IEC standards, OWASP guidance, DORA research, Google SRE materials, and IEEE or ACM bodies of knowledge provide valuable depth and authority. The framework’s role is to help readers connect those sources to the quality decisions facing a real system.

---

## Key Takeaways

- The MSQE Educational Framework is original, vendor-neutral educational guidance; it is not a standard, certification, or maturity model.
- It connects ten core domains that jointly influence software quality: foundations, quality engineering, testing, automation, data, cloud and DevOps, observability and reliability, AI quality, performance and security, and leadership.
- Cross-cutting concerns such as risk, systems thinking, feedback, collaboration, ethics, and customer value prevent the domains from becoming isolated silos.
- The framework supports lifecycle decisions but does not replace the detailed lifecycle, shift-left/shift-right, systems-thinking, culture, or role guidance in earlier chapters.
- Testing remains essential, but quality evidence must also include design, data, delivery, runtime, security, and customer-outcome information.
- Apply the framework proportionately: select the domains and evidence relevant to the change and its risks.
- Use established standards and industry guidance for their intended purposes; use the framework to integrate the discussion.

---

## Review Questions

1. Why is a testing-only view of quality insufficient for modern software systems?
2. What is the stated purpose of the MSQE Educational Framework?
3. How does the framework differ from a maturity model?
4. What is the difference between a core domain and a cross-cutting concern?
5. How does the framework differ from the Quality Engineer Competency Model in Chapter 8?
6. Give an example of a quality risk that requires evidence from at least three framework domains.
7. Why should a team avoid using automated-test count as its primary quality measure?
8. How can the framework be applied without imposing the same depth of work on every change?
9. What is the relationship between the framework and ISO/IEC 25010?
10. How does operational feedback improve future lifecycle decisions?

---

## Interview Questions

1. A team has high automated-test coverage but recurring production incidents. How would you use the framework to investigate without assuming that testing is the only problem?
2. Describe a situation where a data-quality issue could appear to be a functional defect. Which disciplines would you involve and why?
3. How would you explain the difference between Quality Engineering and Software Testing Engineering to a senior stakeholder?
4. A product manager asks for a single quality score for every team. What would you recommend instead, and what are the trade-offs?
5. How would you decide whether an AI Quality Engineering assessment is relevant to a proposed feature?
6. What evidence would you expect before a high-risk change is deployed progressively?
7. How can a Quality Engineer influence observability without taking ownership of all operational monitoring?
8. How would you resolve disagreement between a delivery deadline and unresolved performance or security risks?
9. Which parts of this framework are most likely to expose an ownership gap in a DevOps organisation?
10. How would you use an incident review to improve more than one framework domain?

---

## Further Reading

- [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html)
- [ISO/IEC/IEEE 29119-1:2022 — Software testing concepts](https://www.iso.org/standard/81291.html)
- [ISO/IEC/IEEE 12207:2026 — Software lifecycle processes](https://www.iso.org/standard/90219.html)
- [DORA Research](https://dora.dev/research/)
- [Google SRE Book — Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [Google SRE Workbook — Postmortem Culture](https://sre.google/workbook/postmortem-culture/)
- [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html)
- [IEEE Computer Society — Guide to the Software Engineering Body of Knowledge](https://www.computer.org/education/bodies-of-knowledge/software-engineering)
- [ACM Code of Ethics and Professional Conduct](https://www.acm.org/code-of-ethics)

---

## References

[^iso25010]: International Organization for Standardization and International Electrotechnical Commission. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). Published 2023. Accessed 2026-08-08.

[^iso29119]: International Organization for Standardization, International Electrotechnical Commission, and IEEE. [ISO/IEC/IEEE 29119-1:2022 — Software and systems engineering — Software testing — Part 1: General concepts](https://www.iso.org/standard/81291.html). Published 2022. Accessed 2026-08-08.

[^iso12207]: International Organization for Standardization, International Electrotechnical Commission, and IEEE. [ISO/IEC/IEEE 12207:2026 — Systems and software engineering — Software life cycle processes](https://www.iso.org/standard/90219.html). Published April 2026. Accessed 2026-08-08.

[^owasp]: OWASP Foundation. [Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html). Accessed 2026-08-08.

[^dora]: DORA. [DORA Research](https://dora.dev/research/). Accessed 2026-08-08.

[^googlesre]: Beyer, Betsy, Chris Jones, Jennifer Petoff, and Niall Richard Murphy, eds. [*Site Reliability Engineering: How Google Runs Production Systems*, “Monitoring Distributed Systems”](https://sre.google/sre-book/monitoring-distributed-systems/). Google. Accessed 2026-08-08.

---

## Chapter Checklist

Before moving to the next chapter, confirm that you can:

- [ ] Explain why quality needs an integrated, cross-domain engineering view.
- [ ] State the purpose and boundaries of the MSQE Educational Framework.
- [ ] Name the ten core domains and describe how they interact.
- [ ] Use cross-cutting concerns to avoid treating quality domains as silos.
- [ ] Map a quality question to relevant lifecycle decisions and evidence.
- [ ] Distinguish the framework from ISO/IEC standards, DORA research, Google SRE practices, OWASP guidance, and maturity models.
- [ ] Apply the framework to identify proportionate strengths, gaps, and priorities for a fictional delivery context.
