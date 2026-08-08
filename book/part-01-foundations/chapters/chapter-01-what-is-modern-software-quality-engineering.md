# Chapter 1 — What Is Modern Software Quality Engineering?

## Metadata

| Field | Value |
|---|---|
| Part | Part I — Foundations of Modern Software Quality Engineering |
| MQE-BOK domain | Domain 1 — Foundations of Modern Software Quality Engineering |
| Chapter | 1 |
| Audience | Software Testers, QA Engineers, Automation Engineers, SDETs, Software Engineers, Product Managers, and Engineering Managers |
| Prerequisites | None |
| Estimated study time | 90 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Technical Review Ready |

## Opening Quote

> **MSQE principle:** Quality is not what we test. Quality is what we engineer.

## Opening Story

The following illustrative scenario begins at 09:15 on a Monday, when a customer-support team receives reports that subscription upgrades have been charged twice. The payment service is available, the deployment completed successfully, and every release check passed. The feature tests correctly in isolation. Yet the service retries a payment request after a network timeout without carrying an idempotency key—a unique value that lets the service recognise a retry and safely return its original result rather than creating an additional charge; the payment provider accepts both requests.

The immediate response is familiar: reproduce the defect, add a regression test, and patch the code. Those actions are necessary, but they are not sufficient. The incident also raises engineering questions:

- Why was a duplicate charge an acceptable failure mode in the design?
- Where was the reliability requirement expressed and reviewed?
- Did the integration contract make retry behaviour explicit?
- Could monitoring have detected an unusual duplicate-charge rate before customers reported it?
- Did the release process provide evidence that the system behaved safely under a transient failure?

Testing can reveal the defect. Quality Engineering asks how the system, the delivery process, and the operating model should work together so that this class of failure is less likely, easier to detect, and less harmful when it occurs.

## Why This Chapter Matters

Software quality is often discussed after something has gone wrong: a failed release, slow response time, data loss, an accessibility barrier, or a security incident. This creates a misleading impression that quality is a final inspection activity. By the time a defect is found in production, many earlier decisions have already shaped the outcome: what the team chose to build, how it designed the system, what it automated, how it deployed, and how it observed real behaviour.

Modern Software Quality Engineering treats quality as an intentional property of a socio-technical system. It is **socio-technical** because software quality depends on technical decisions and on the way people collaborate, make trade-offs, learn from evidence, and improve their delivery system.

This chapter establishes a practical definition of MSQE and a working model for applying it. It does not replace recognised standards or a team's domain-specific obligations. Instead, it provides an engineering lens for turning quality goals into design choices, executable checks, operational signals, and continuous learning.

## Learning Objectives

By the end of this chapter, you will be able to:

- Define Modern Software Quality Engineering (MSQE) in engineering terms.
- Distinguish Quality Engineering from testing, Quality Assurance, and Quality Control.
- Explain why quality is a system property rather than a final delivery activity.
- Translate a vague quality expectation into an observable, testable requirement.
- Identify the contribution of people, process, product, platform, and production operations to quality.
- Describe the responsibilities of a Quality Engineer in a cross-functional delivery team.

## Key Concepts

### Software quality

Software quality is the degree to which a system satisfies relevant stakeholder needs in its intended context of use, while managing the risks associated with failure. The word **relevant** matters. A hobby application, a hospital medication service, and a payment platform all need correct behaviour, but their consequences of failure, constraints, and evidence requirements differ substantially.

Quality is therefore neither a single score nor a synonym for "few bugs." A product can be feature-complete while being difficult to use, insecure, unreliable under load, expensive to change, or impossible to operate safely. Conversely, a technically elegant service that does not solve a meaningful user problem is not high quality for its stakeholders.

The ISO/IEC 25010:2023 product quality model provides a useful common vocabulary. It defines nine product-quality characteristics and is intended to support the specification, measurement, and evaluation of quality throughout the lifecycle. It is a reference model, not a substitute for product decisions: a team must still select the attributes that matter and define their required levels for a particular context.[^iso25010]

### Quality attributes and quality requirements

A **quality attribute** is a characteristic through which stakeholders judge a system. ISO/IEC 25010:2023 identifies functional suitability, performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, and safety as product-quality characteristics. These attributes can compete. Encrypting more data may increase protection but add latency; aggressive caching may improve response time but make freshness harder to guarantee.

Product-quality characteristics should be distinguished from **engineering capabilities** that help a team achieve and evaluate them. In this chapter, **observability** means the ability to infer a system's internal state from its externally available signals, while **testability** means the ability to set up, control, and assess a system efficiently in tests. These are cross-cutting capabilities that support quality evaluation; they are not additional top-level characteristics in the ISO/IEC 25010 product-quality model.

A **quality requirement** makes an attribute specific enough to guide decisions and evaluate outcomes. Compare these statements:

| Vague expectation | Engineering-quality requirement |
|---|---|
| The service must be fast. | For authenticated catalogue searches, the service shall complete 95% of requests within 300 ms at the agreed peak workload, excluding client-network time. |
| Payments must be reliable. | A retry of the same payment request shall not create an additional charge when it uses the same idempotency key. |
| The application must be secure. | Privileged administrative actions shall require a verified user identity, explicit authorisation, and an auditable event record. |
| The system must be easy to change. | A pricing-rule change shall be made in one independently tested module without modifying order-processing code. |

The right target, workload, and evidence depend on the product. The important shift is from adjectives to observable outcomes.

### Quality Engineering, Quality Assurance, Quality Control, and testing

The terms below are frequently used interchangeably. Their boundaries differ across organisations, so teams should establish shared meanings. The following distinctions are useful because they clarify the purpose of the work rather than the job title.

| Practice | Primary question | Typical activities | Limitation when used alone |
|---|---|---|---|
| Testing | Does this product or change reveal a problem under these conditions? | Exploratory testing, automated checks, integration testing, performance experiments | Shows evidence about selected scenarios; it cannot prove that all relevant risks are controlled. |
| Quality Control (QC) | Does the delivered work meet defined acceptance criteria? | Inspection, review, verification, release checks, defect classification | Focuses on detecting nonconformance in an output. |
| Quality Assurance (QA) | Does the process provide confidence that work will meet its requirements? | Process definition, audits, standards, prevention practices, quality planning | Can become procedural if it is disconnected from product and operational evidence. |
| Quality Engineering (QE) | How do we design, build, deliver, and operate systems so that desired quality is achieved and sustained? | Quality requirements, design review, test strategy, automation, observability, reliability analysis, learning from incidents | Requires collaboration across roles; it cannot be delegated entirely to one team. |

Quality Engineering includes testing and can include QA and QC practices. It broadens the focus from finding defects to engineering the conditions under which quality can be achieved, measured, and improved.

### Modern Software Quality Engineering (MSQE)

For this handbook, **Modern Software Quality Engineering (MSQE)** is an original MSQE framework:

> MSQE is the disciplined practice of engineering, evaluating, and continuously improving the quality of software systems across their design, delivery, operation, and evolution.

The definition has four deliberate parts:

1. **Engineering** means quality influences requirements, architecture, implementation, automation, deployment, and operations.
2. **Evaluating** means decisions are based on explicit criteria and evidence, not on confidence alone.
3. **Continuously improving** means production feedback, incidents, changes in risk, and user experience reshape future work.
4. **Across the lifecycle** means quality work does not begin when a feature is handed to a test team or end when a release is approved.

MSQE is not a claim that every team needs a new department, a particular toolchain, or a universal set of metrics. It is a way of organising responsibility. The practices should fit the product's risk profile, stage of development, regulation, team topology, and technical architecture.

## Theory: Quality as a System Property

### Quality emerges from interacting decisions

No single activity produces software quality. A reliable customer journey can be undermined by an ambiguous requirement, a fragile design, an unrepresentative test environment, an unsafe deployment, inadequate alerts, or an unclear incident response. These are interacting parts of one delivery system.

The following model is an MSQE teaching aid. It identifies five areas in which quality is designed and evidenced.

### Diagram: MSQE Quality System Model

```text
                         Stakeholder needs and risk
                                      │
                                      ▼
 ┌────────────┐    ┌────────────┐    ┌────────────┐
 │ People     │───▶│ Process    │───▶│ Product    │
 │ skills,    │    │ discovery, │    │ requirements,
 │ ownership, │    │ delivery,  │    │ architecture,
 │ culture    │    │ learning   │    │ code, data
 └────────────┘    └────────────┘    └────────────┘
                                      │
                                      ▼
                              ┌────────────┐
                              │ Platform   │
                              │ environments,
                              │ pipelines,
                              │ dependencies
                              └────────────┘
                                      │
                                      ▼
                              ┌────────────┐
                              │ Production │
                              │ telemetry,
                              │ support,
                              │ incidents
                              └────────────┘
                                      │
                                      ▼
                         Evidence and continuous improvement
```

The arrows do not describe a one-way phase sequence. Production evidence should influence all preceding areas. For example, a recurring support issue may trigger a design change, a new automated check, a clarified requirement, and a review of team ownership.

### Quality is built, assessed, and learned

An effective quality approach combines three modes of work:

| Mode | Purpose | Examples |
|---|---|---|
| Build quality in | Make desired behaviour and risk controls part of the system design. | Acceptance criteria, threat modelling, architecture decisions, idempotency, input validation, accessibility design, safe defaults. |
| Assess quality | Gather evidence that the system meets defined expectations. | Code review, automated checks, exploratory testing, contract tests, load experiments, release verification. |
| Learn and improve | Use real outcomes to improve the product and its delivery system. | Monitoring, customer feedback, incident reviews, defect trend analysis, reliability experiments, retrospective actions. |

Teams get into difficulty when one mode crowds out the others. A team that only assesses may discover defects too late. A team that only builds controls may not verify that those controls work. A team that does neither learning nor adaptation repeats preventable failures.

### The cost of late discovery

The often-repeated claim that defects cost a fixed multiple more to correct later is too simplistic; cost varies with the system, the change, and the consequence of failure. The more durable engineering insight is this: **late discovery usually removes options**. A misunderstood requirement is cheap to clarify before implementation. After release, the same misunderstanding may involve remediation, data repair, customer support, contractual obligations, and loss of trust.

Quality Engineering responds by seeking early feedback without assuming that all risk can be addressed early. Security, resilience, accessibility, performance, and behaviour under real workload also require validation after deployment. MSQE therefore uses both earlier and later feedback loops.

## Engineering Perspective

### Turn quality into architecture and delivery decisions

Quality requirements influence technical design. If the payment example must prevent duplicate charges, a possible design response is an idempotency key, durable request state, a clearly specified retry policy, and an audit trail. The response is not "write more tests"; it is a coherent set of controls that can then be tested and observed.

For each significant quality requirement, a Quality Engineer should help the team make four connections:

| Connection | Question to ask | Example: duplicate-payment prevention |
|---|---|---|
| Requirement to risk | What harm occurs if this expectation is not met? | Customers are overcharged and reconciliation becomes expensive. |
| Risk to design | What product or platform decision manages that harm? | Idempotency is enforced at the payment boundary. |
| Design to evidence | How will we know the control works? | Unit, integration, and failure-injection checks—which deliberately introduce controlled faults—exercise retried requests. |
| Evidence to operation | What signal shows the control remains effective in use? | A metric and alert track duplicate-payment attempts and outcomes. |

This traceability does not require heavy documentation for every minor change. It becomes more valuable as risk, complexity, and impact increase.

### Prefer a portfolio of evidence

No individual metric proves quality. Test-pass percentage, defect counts, code coverage, deployment frequency, and availability each tell a limited story. A Quality Engineer selects evidence that answers a specific decision question.

| Decision | Useful evidence | Common misuse to avoid |
|---|---|---|
| Is a change safe to expose? | Acceptance criteria, targeted automated checks, changed-area risk assessment, deployment signals | Treating a green pipeline as a guarantee. |
| Can users complete a critical journey? | Task-success observations, exploratory scenarios, accessibility evaluation, support contacts | Assuming a function is usable because it is technically correct. |
| Does the service meet its reliability objective? | Service-level indicators (measures of service behaviour), error budgets (the permitted amount of unreliability within an objective) where appropriate, incident data, recovery exercises | Measuring availability without considering correctness or user impact. |
| Is the system becoming harder to change? | Lead time for similar changes, code review observations, dependency analysis, escaped change defects | Treating a static code metric as the whole measure of maintainability. |

Evidence should be timely enough to influence a decision, trustworthy enough to support it, and connected to an explicit risk or goal.

### Build feedback loops into delivery

Fast feedback is valuable when it leads to a useful action. The following progression is common, although not every change needs every layer:

```text
Requirement example
      │
      ▼
Design review ──► clarify risks and trade-offs
      │
      ▼
Implementation checks ──► detect local defects quickly
      │
      ▼
Integration and workflow checks ──► verify collaborations and critical journeys
      │
      ▼
Deployment verification ──► confirm the change behaves in its target environment
      │
      ▼
Production telemetry ──► reveal behaviour, impact, and emerging risk
      │
      └────────────────────► improve the next requirement and design
```

Automation is important, but it is not the entire feedback system. Human review, exploratory investigation, user research, and incident analysis uncover classes of issues that scripted checks may not anticipate.

## Industry Perspective

### From specialist gatekeeping to shared ownership

Traditional delivery models often positioned testing as a phase and QA as a gate before release. That structure can create valuable independent assessment, especially in high-risk or regulated environments. The problem arises when it makes quality somebody else's responsibility.

Modern product delivery depends on close collaboration among product, design, software engineering, security, operations, data, and quality specialists. A Quality Engineer does not take accountability away from these disciplines. Instead, the role helps make quality concerns visible, testable, and actionable across their boundaries.

Shared ownership does not mean vague ownership. A mature team makes responsibilities explicit. For example:

| Role or group | Typical quality contribution |
|---|---|
| Product and domain experts | Clarify intended outcomes, user impact, priorities, and unacceptable failure modes. |
| Designers and researchers | Address interaction quality, accessibility, user understanding, and error recovery. |
| Software engineers | Build maintainable, secure, observable, and testable components. |
| Quality Engineers | Facilitate risk discovery, shape test strategy, improve feedback, assess evidence, and coach quality practices. |
| Platform, operations, and reliability specialists | Provide safe delivery mechanisms, operational capabilities, resilience practices, and production insight. |
| Security, privacy, and compliance specialists | Define and assess controls appropriate to the risk and applicable obligations. |

In smaller teams, one person may cover several of these contributions. The work still needs to happen.

### Standards are guides, not checklists for thinking

Standards and models help teams establish a shared vocabulary and disciplined evaluation approach. The SQuaRE family, for example, covers quality management, models, measurement, requirements, and evaluation.[^iso25000][^square] ISO/IEC 25041 provides guidance for product-quality evaluation by developers, acquirers, and independent evaluators.[^iso25041]

However, a standard does not choose the correct availability target, define a customer's workflow, or resolve a product trade-off. Professional Quality Engineering uses standards to improve reasoning and traceability, then adapts the resulting practice to the product context.

## Illustrative Example: Designing Quality into an Account-Recovery Journey

Consider this illustrative account-recovery feature for an online service. The initial user story is simple:

> As a customer who cannot sign in, I want to reset my password so that I can regain access to my account.

The story describes a function. A Quality Engineer helps the team expose the surrounding quality concerns.

| Concern | Questions that make it actionable | Possible evidence |
|---|---|---|
| Security | Can an attacker discover whether an account exists? Is a reset token protected, short-lived, single-use, and auditable? | Threat-model review, token tests, security logging checks. |
| Interaction capability | Can a legitimate user understand the recovery steps and recover from an expired link? Can assistive technology complete the journey? | Usability sessions, accessibility evaluation, exploratory testing. |
| Reliability | What happens if the email provider delays or duplicates delivery? Can the user safely retry? | Dependency simulations, end-to-end checks, delivery metrics. |
| Observability capability | Can support staff diagnose a failed recovery without exposing sensitive data? | Structured events, dashboards, support runbook review. |
| Maintainability | Can token policy change without modifying unrelated authentication code? | Clear module boundaries, automated regression coverage, change review. |

The result is not a larger test plan alone. It is a better-defined feature, a more deliberate design, and a set of meaningful checks and operational signals.

## Executable Specification (Gherkin Example)

The following Gherkin-style executable specification illustrates one small part of the duplicate-payment scenario. The important idea is that a quality requirement can lead to a testable system contract.

```gherkin
Given a payment request with idempotency key "order-1842-attempt-1"
And the first provider response is lost after the charge is accepted

When the client retries the same request with the same idempotency key

Then the system returns the original successful payment result
And the provider is charged exactly once
And an audit event records the retry as a duplicate request
```

This specification is valuable only if the architecture actually preserves idempotency state and uses it at the payment boundary. A test can guide implementation, but it does not replace the production design control.

## Illustrative Case Study: The Green Pipeline That Did Not Protect Customers

In this illustrative case study, a subscription-service team introduces a new discount rule. Its continuous-integration pipeline includes unit tests for pricing calculations and browser checks for the checkout page. Every check passes. After release, a subset of customers receives discounts they are not eligible for because a cached eligibility response remains valid after an account status changes.

### What went wrong?

The problem was not that the team lacked automated tests. The quality approach did not connect a business rule to its data freshness and cache-invalidation risks. The checks verified calculation logic with static test data, but not the behaviour of the system when account state changed across service boundaries.

### Engineering response

The team made four changes:

1. It recorded eligibility freshness as an explicit quality requirement for price-affecting decisions.
2. It changed the integration design so that account-status updates invalidated or versioned eligibility state.
3. It added contract and workflow checks covering the state transition.
4. It monitored discount application by account-status category and reviewed anomalous patterns after deployment.

### Lesson

Passing checks are evidence about the behaviours those checks represent. They are not a universal statement that a release is safe. Quality Engineering improves the connection among requirement, design, evidence, and operational feedback.

## Practical Exercise: Create a Quality Attribute Map

Choose a familiar feature: an online purchase, appointment booking, password reset, file upload, or internal approval workflow. Create a one-page quality attribute map before writing a test case.

### Step 1: Describe the outcome and the failure impact

Complete these statements:

- A user is trying to ________________.
- The product outcome is ________________.
- If this fails, the likely user or business impact is ________________.
- The most important failure modes are ________________.

### Step 2: Select relevant quality attributes

Choose three to five attributes that matter for this feature. Do not select everything by default. Explain why each attribute is relevant to the consequence of failure.

| Attribute | Why it matters here | What failure would look like? |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |

### Step 3: Write observable requirements

For each selected attribute, write one requirement that includes a condition, expected result, and evidence source.

| Quality requirement | Design implication | Evidence | Operational signal |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

### Step 4: Review the map with another engineer

Ask the reviewer:

- Which assumption is least explicit?
- Which failure would be most harmful?
- Is the proposed evidence sufficient for the risk?
- What will tell us in production that the feature is behaving as intended?

The goal is not to produce a perfect document. It is to practise moving from a feature description to a shared engineering model of quality.

## Lab

> **Supporting asset (Pass 2, planned):** **Lab 1 — Quality Engineering Discovery Workshop** will provide the complete problem statement, tasks, validation, and reflection questions for facilitating this workshop with a delivery team.

## Common Misconceptions and Pitfalls

### Treating testing as the definition of quality

A test suite describes only the conditions it exercises. Use its results within a wider strategy that also addresses requirements, architecture, operations, and learning.

### Writing unmeasurable quality requirements

Words such as *fast*, *secure*, *intuitive*, and *scalable* hide different expectations. Make the context, workload, thresholds, and evidence explicit enough to guide a decision.

### Measuring what is convenient rather than what matters

Teams sometimes elevate code coverage, test counts, or closed defects because they are easy to collect. These measures may be useful diagnostics, but they should not replace evidence about user outcomes and material risks.

### Assigning quality to one role

When quality becomes the sole responsibility of a QA or QE function, the people making product, design, implementation, and operational decisions can disengage from the consequences. Make contributions and decision rights explicit across the team.

### Adding controls without understanding trade-offs

Every check, approval, test environment, and dashboard has a cost. The goal is proportionate confidence, not maximum ceremony. Focus effort where uncertainty and impact are greatest.

## Best Practices

- Begin refinement with user outcomes, constraints, and unacceptable failure modes—not just happy-path behaviour.
- Make significant quality attributes visible in product requirements and architecture decisions.
- Design systems to be testable and observable; do not treat these as tasks added after implementation.
- Use multiple, complementary evidence sources for high-impact decisions.
- Analyse production incidents and customer feedback for improvements to the system, not only to the immediate defect.
- Review quality practices regularly as the product, architecture, team, and risk profile change.
- Keep quality requirements proportionate. A prototype, an internal reporting tool, and a safety-related system require different levels of control and evidence.

## Performance Considerations

Performance is a quality attribute that must be specified in context. A response-time target without workload, data volume, resource constraint, and user journey can lead to misleading tests. Useful performance work considers:

- the user or business operation being measured;
- realistic workload shape, including peaks and contention;
- dependent services and data stores;
- both response time and failure behaviour under pressure; and
- the degradation or recovery behaviour the team considers acceptable.

The broader lesson applies beyond performance: a measurement is meaningful only when its operating context and decision purpose are clear.

## Security Considerations

Security is part of software quality, not a late compliance add-on. Quality Engineers should help teams make security concerns testable and observable by asking questions such as:

- What assets or data require protection?
- Who are the users, actors, and trust boundaries?
- What are the consequences of unauthorised access, data corruption, or service disruption?
- Which security controls belong in the design, platform, delivery pipeline, and operational response?
- What evidence demonstrates that the controls work and remain effective?

Security specialists retain their specialised responsibilities. The Quality Engineering contribution is to integrate relevant security risks into everyday discovery, design, validation, and learning.

## AI Perspective

AI-enabled features add quality concerns that may not be captured by traditional functional checks alone. Depending on the use case, teams may need to consider the quality of training or reference data, harmful or inconsistent outputs, robustness to unexpected input, privacy, traceability, human oversight, and ongoing performance drift.

The same MSQE model applies: define intended outcomes and unacceptable harm, design appropriate controls, gather meaningful evidence, monitor real behaviour, and improve based on what is learned. Later parts of this handbook examine AI Quality Engineering in depth.

## Summary

Modern Software Quality Engineering is a systems-oriented discipline. It treats quality as a property created by decisions across requirements, design, implementation, delivery, operations, and continuous improvement. Testing, Quality Assurance, and Quality Control each contribute valuable evidence or controls, but none alone is equivalent to Quality Engineering.

The practical habit introduced in this chapter is simple: for every important quality expectation, connect the requirement to the risk it manages, the design decision that supports it, the evidence that evaluates it, and the operational signal that confirms it in use. This connection turns quality from an aspiration into engineering work.

## Key Takeaways

- Quality is context-dependent and extends beyond defect absence or feature completion.
- MSQE is an original framework for engineering, evaluating, and improving quality across the full software lifecycle.
- Quality Engineering includes testing but also addresses requirements, architecture, delivery, operations, and organisational learning.
- A quality requirement should express observable behaviour, conditions, and evidence rather than an ambiguous adjective.
- High-confidence decisions use a portfolio of evidence; no isolated metric or green pipeline proves quality.
- Quality is shared ownership with explicit contributions from product, design, engineering, operations, security, and quality specialists.
- Production feedback is part of Quality Engineering because real behaviour reveals risks that pre-release environments cannot fully reproduce.

## Review Questions

1. Why is a defect-free test run not sufficient evidence that a system is high quality?
2. Explain the difference between testing, Quality Control, Quality Assurance, and Quality Engineering in your own words.
3. Convert the statement "the application must be reliable" into an observable quality requirement for a feature of your choice.
4. What trade-off might arise between two quality attributes in the system you work on?
5. Why should production telemetry be considered part of quality work?
6. Which roles share responsibility for quality in a cross-functional team, and what does each contribute?
7. How would you decide whether a proposed quality control is proportionate to the risk?

## Interview Questions

1. How would you explain the difference between QA and Quality Engineering to a delivery team?
2. A team reports 95% automated-test coverage but customers still encounter critical failures. What would you investigate?
3. How do you turn a non-functional requirement into a testable and observable quality requirement?
4. Describe a time when production feedback changed your quality strategy. What did you change and why?
5. How do you encourage shared ownership of quality without making responsibility unclear?
6. What evidence would you seek before approving a high-risk change to a payment or identity system?
7. How would you balance the desire for fast delivery with the need for quality controls?

## Further Reading

- International Organization for Standardization. [ISO/IEC 25030:2019 — Quality requirements framework](https://www.iso.org/standard/72116.html). A framework for eliciting, defining, using, and governing quality requirements.
- IEEE Computer Society. [Guide to the Software Engineering Body of Knowledge (SWEBOK Guide), Version 4.0](https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics). See the software requirements and software quality knowledge areas.
- Guide to the Systems Engineering Body of Knowledge (SEBoK). [Quality Management](https://sebokwiki.org/wiki/Quality_Management). A systems-oriented treatment of quality attributes, trade-offs, measurement, and improvement.

## References

[^iso25010]: International Organization for Standardization and International Electrotechnical Commission. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). Published 2023. Accessed 2026-08-08.

[^iso25000]: International Organization for Standardization and International Electrotechnical Commission. [ISO/IEC 25000:2014 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Guide to SQuaRE](https://www.iso.org/standard/64764.html). Published 2014. Accessed 2026-08-08.

[^iso25041]: International Organization for Standardization and International Electrotechnical Commission. [ISO/IEC 25041:2012 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Evaluation guide for developers, acquirers and independent evaluators](https://www.iso.org/standard/35766.html). Published 2012. Accessed 2026-08-08.

[^square]: ISO/IEC JTC 1/SC 7. [ISO/IEC 25000 SQuaRE series](https://committee.iso.org/sites/jtc1sc7/home/projects/flagship-standards/iso-25000-square-series.html). Accessed 2026-08-08.

## Chapter Checklist

- [ ] I can explain why quality is a system property rather than a final delivery activity.
- [ ] I can distinguish testing, Quality Control, Quality Assurance, and Quality Engineering.
- [ ] I can identify the difference between product-quality characteristics and cross-cutting engineering capabilities.
- [ ] I can turn a quality expectation into a requirement, design decision, evidence source, and operational signal.
- [ ] I can describe how quality ownership is shared across a delivery team.
