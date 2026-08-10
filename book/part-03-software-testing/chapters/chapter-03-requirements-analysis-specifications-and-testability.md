# Chapter 3 — Requirements Analysis, Specifications, and Testability

## Metadata

| Field | Value |
|---|---|
| Part | Part III — Software Testing Engineering |
| MQE-BOK domain | Domain 3 — Software Testing Engineering |
| Chapter | 3 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2; Part I — Foundations; Part II — Programming for Quality Engineers |
| Estimated study time | 130 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** The cheapest ambiguous behaviour to investigate is the one clarified before implementation creates it.

## Opening Story

The following illustrative scenario concerns the fictional Atlas Commerce subscription service. Product proposes a new capability: “Customers can pause their subscriptions immediately and resume whenever they want. They should not be charged while paused.”

The statement sounds clear. During refinement, however, Lina, a Quality Engineer, asks what “immediately” means when an invoice is already being prepared, whether a customer retains paid access through the current billing period, how a paused subscription can be resumed, and what happens when the payment method expires before resume. The product manager assumes resumption restores access. A developer assumes resumption creates a new billing date. Support expects the customer’s account history to explain the state change. None of these assumptions appears in the requirement.

Lina does not turn the meeting into a test-case review. She helps the group make the behaviour observable: a subscription has named states, each state has allowed transitions, and each transition has a customer-facing outcome, billing consequence, and support record. The group writes examples for a customer who pauses before renewal, pauses during a grace period, resumes after the planned date, and attempts an invalid transition.

The result is not a guarantee that the feature will be defect-free. It is a better basis for design, implementation, testing, support, and later investigation. The team has prevented one class of avoidable misunderstanding while creating clearer evidence targets for the work that remains.

## Why This Chapter Matters

Testing often begins with a requirement, a story, a design note, an interface contract, or a conversation. If that input is ambiguous, contradictory, incomplete, or impossible to observe, downstream testing becomes slower and less trustworthy. A skilled tester can discover the resulting defects after implementation. A Quality Engineer also helps a team recognise and reduce the ambiguity before it becomes code, data, configuration, and customer impact.

This is not an argument that Quality Engineers own requirements or replace product, design, development, or domain expertise. It is an argument for earlier, explicit collaboration. The person most familiar with failure modes, boundaries, and evidence gaps can make a valuable contribution before a test environment exists.

Chapter 1 framed testing as evidence for decisions. Chapter 2 showed how risk determines which evidence deserves attention. This chapter asks whether the team has specified behaviour in a way that can be understood, implemented, controlled, observed, and diagnosed. Chapter 4 will introduce detailed test-design techniques; Chapter 7 will address deterministic checks, doubles, and isolation in more depth. Here the focus is the quality of the inputs to those activities.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify ambiguity, missing information, contradiction, hidden assumptions, and untestable claims in a requirement or specification;
- distinguish an outcome, acceptance criterion, example, counterexample, and executable automation;
- use examples and, where useful, Given/When/Then notation to clarify behaviour without turning collaboration into a BDD-tool tutorial;
- assess a proposed behaviour for observability, controllability, determinism, isolation, and diagnosability;
- distinguish product-quality characteristics from the engineering capabilities needed to obtain and interpret testing evidence;
- facilitate earlier questions with product, development, design, support, and specialist colleagues respectfully;
- explain how clarification can prevent defects without claiming that prevention removes the need for testing; and
- produce a testability and specification review that creates inspectable engineering evidence.

## Requirements Are Inputs to Quality Reasoning

Requirements come in many forms: a customer outcome, a backlog item, a policy rule, acceptance criteria, interface documentation, a design decision, a support need, or an example discussed in a meeting. None is automatically complete. The Quality Engineer’s task is not to demand a perfect document before work begins. It is to identify the information needed to make a meaningful quality decision.

Consider the statement from the opening story:

> Customers can pause their subscriptions immediately and resume whenever they want. They should not be charged while paused.

The statement gives intent but leaves important questions open. A useful review asks what outcome is intended, for whom, under which conditions, and how a team would know whether it happened.

| Concern | Question that reveals it | Why it matters |
|---|---|---|
| Ambiguity | Does “immediately” mean before the next invoice, before a current request completes, or within a stated time? | Different interpretations create different billing and customer outcomes. |
| Missing information | What happens to paid access during the already-paid period? | The team cannot evaluate entitlement without a rule. |
| Contradiction | Can a customer “resume whenever” they want if a payment method is invalid? | Two plausible statements may conflict in a realistic condition. |
| Hidden assumption | Is the subscription state shared consistently by billing, entitlement, notifications, and support exports? | A local feature rule may fail across system boundaries. |
| Untestable claim | What observation shows that a customer “should not be charged”? | The rule needs a measurable event, state, or record. |

These questions do not delay value by default. They often reduce rework by exposing decisions that would otherwise be made independently in code, tests, and support procedures.

## From Intent to Observable Behaviour

An **acceptance criterion** states a condition that helps a team decide whether an intended behaviour is acceptable. A useful criterion is specific enough to guide a decision, but it need not prescribe every implementation detail.

Compare the following versions.

| Intent-only statement | More observable acceptance condition |
|---|---|
| Customers should not be charged while paused. | When a subscription is paused before its next billing date, no invoice is created for the skipped billing cycle, and the account history records the pause date and planned resume date. |
| Customers can resume whenever they want. | A customer with a paused subscription can request resume. If the account has a valid payment method, the subscription enters `active` and the next billing date is calculated from the documented policy. If the payment method is invalid, the subscription remains `paused` and the customer receives a recovery action. |
| The experience should be clear. | Before confirming a pause, the interface states the effective date, access consequence, next billing consequence, and how to resume. |

The revised statements still need product and domain agreement. Their value is that they identify observable outcomes, state conditions, and failure behaviour that design, implementation, testing, and support can discuss.

### Examples and counterexamples

Examples make an abstract rule concrete. **Counterexamples** identify plausible situations in which a tempting interpretation must not apply. Both are useful because software often fails at boundaries, transitions, and exceptions rather than its central happy path.

| Example type | Subscription example | Question it clarifies |
|---|---|---|
| Representative example | Customer pauses two days before the billing date. | What state, billing, and customer message should result? |
| Boundary example | Customer pauses one minute before the billing job begins. | What is the effective-time rule? |
| Failure example | Customer resumes with an expired payment method. | What is the safe failure and recovery behaviour? |
| Counterexample | A customer cannot resume an already cancelled subscription through the pause flow. | Which state transitions are explicitly disallowed? |
| Data example | An account has two subscriptions with different billing dates. | Which subscription and records does the action affect? |

Examples do not replace a strategy. Chapter 2 still determines which risks deserve evidence and how much. Examples make the intended behaviour clearer enough to design and obtain that evidence.

## Collaborative Specification, Gherkin, and Automation

Collaborative specification is the work of reaching shared understanding about intended behaviour through discussion, examples, questions, and clarification. It can happen in refinement, design review, pair work, or an incident-learning discussion.

**Specification by example** is an established collaborative practice in which concrete examples clarify and communicate rules and expected outcomes.[^specification-by-example] **Gherkin** is a structured, readable notation that may express examples or specifications with `Given`, `When`, and `Then`.[^gherkin-reference] Gherkin text is not automatically executable merely because it uses that notation. It becomes executable only when a mechanism can evaluate it against the relevant system or component.

An **executable specification** uses such a mechanism to evaluate stated behaviour. An **automated test** produces repeatable evidence through code or tooling. Some automated tests serve as executable specifications; others investigate technical behaviour or regression risk without acting as a shared specification. Automation and specification are related concepts, not synonyms.

| Item | Primary purpose | Requires an executable mechanism? |
|---|---|---|
| Collaborative specification | Build shared understanding and make decisions visible | No |
| Specification by example | Use concrete examples to clarify and communicate expected behaviour | No |
| Gherkin notation | Express an example or specification in a structured, readable form | No |
| Executable specification | Evaluate stated behaviour through an executable mechanism | Yes |
| Automated test | Produce repeatable evidence through code or tooling | Yes; it is not necessarily an executable specification |

### Collaborative example using Gherkin notation

The following illustrative example uses Gherkin as a communication aid. It is not a claim that the scenario is automated or that automation is required.

```gherkin
Feature: Pause a subscription

  Scenario: Resume a paused subscription with a valid payment method
    Given a customer has a paused subscription and a valid payment method
    When the customer requests to resume the subscription
    Then the subscription becomes active
    And the customer sees the next billing date calculated by the agreed policy
    And the account history records the resume event
```

This example raises productive questions: What is the agreed billing policy? Is “valid payment method” a state owned by this service or a dependency response? Does “becomes active” happen synchronously? What happens if recording history fails after the billing update succeeds? The notation does not answer those questions automatically. The conversation and specification must do that work.

Avoid treating a large collection of Gherkin files as evidence of shared understanding. If the examples are copied after decisions are made, unclear to stakeholders, or disconnected from system behaviour, their format offers little value.

## Testability as an Engineering Property

**Testability** describes how feasibly and reliably a team can obtain useful evidence about a system or change. It is influenced by design, interfaces, data, configuration, time, dependencies, diagnostics, and team collaboration.

The term appears in established quality discussions, including product-quality models. This chapter does not use a testability checklist as an ISO/IEC 25010 score or claim that testability alone represents a product-quality characteristic. ISO/IEC 25010:2023 provides a reference model for product quality; teams may use it to make quality requirements explicit.[^iso-25010] The practical lens below concerns engineering conditions that make testing evidence obtainable and interpretable.

| Testability lens | Practical question | Subscription example |
|---|---|---|
| Observability | Can the team distinguish relevant outcomes from outside the implementation? | Can a reviewer see the subscription state, invoice decision, and customer notification result? |
| Controllability | Can relevant inputs and preconditions be set deliberately? | Can the team create a subscription one minute before a billing boundary? |
| Determinism | Do equivalent conditions lead to stable, explainable observations? | Can the billing-date rule be evaluated without hidden clock or shared-data variation? |
| Isolation | Can a concern be exercised without unrelated dependencies obscuring the result? | Can policy evaluation be examined separately from a live invoice provider? |
| Diagnosability | When behaviour differs, does evidence help locate the relevant condition or boundary? | Does a failure identify subscription state, policy version, dependency result, and correlation context without exposing sensitive data? |

These lenses overlap. A system may be observable but hard to control, or deterministic in a component check but difficult to diagnose across an integration. The point is to identify the next engineering question, not to assign a single maturity score.

### Observability is not the same as observability engineering

In this chapter, **observability** means that a relevant test outcome can be observed or inferred with sufficient clarity. It does not introduce the operational observability practices of logs, metrics, traces, service-level objectives, alerting, or incident response. Those are developed in Part VIII.

Likewise, a testability review may identify that a production signal would be valuable. It should state the evidence need and collaborate with the appropriate specialists; it should not attempt to design an observability platform inside a requirement review.

### Testability creates earlier design options

Testability is easier to improve before a system’s interfaces, data model, configuration, and dependencies become expensive to change. Examples include:

- defining a stable business identifier that connects a customer action to a support record without exposing personal data;
- making effective dates explicit rather than deriving them from an uncontrolled current time;
- separating policy evaluation from an external side effect where that separation clarifies responsibility;
- documenting dependency failure behaviour and recovery paths; and
- agreeing which states and transitions are externally meaningful.

These are not demands for a specific architecture. They are questions that help a team make evidence practical.

## Clarifying States, Boundaries, Errors, and Data

Requirements become difficult to test when they describe an action without its states, boundaries, error behaviour, or data assumptions.

### State transitions

State-oriented thinking is useful whenever an outcome depends on what happened before. For the subscription example, relevant states might include `active`, `paused`, `payment-recovery`, and `cancelled`. The team should agree which transitions are allowed, who initiates them, which transitions are invalid, and what observable record each produces.

Do not turn every requirement into a state-machine diagram. Use state reasoning when history changes the meaning of an action.

### Error and failure behaviour

“Handle errors gracefully” is rarely sufficient. Clarify the expected behaviour when validation fails, a dependency is unavailable, a request is repeated, data is inconsistent, or an operation completes partially. A useful specification identifies the customer outcome, the system state, the recovery path, and the diagnostic evidence needed for the relevant boundary.

Part II’s treatment of error handling, **idempotency**—the property that repeating the same operation has the intended effect without unintended additional effects—and controlled diagnostics provides useful technical context. Part III uses those concepts to ask better questions about the evidence a team needs; it does not repeat the implementation material.

### Data and dependency assumptions

Data can make a requirement appear simple while hiding critical conditions. Ask:

- Which records already exist, and which are created by the behaviour?
- Which data values are valid, missing, stale, duplicated, or inconsistent?
- Which system owns each source of truth?
- Which dependency responses, delays, or failures change the outcome?
- What information is safe and necessary for a tester or support engineer to observe?

Detailed data-quality engineering, SQL, reconciliation, lineage, and service implementation belong to later parts. Here, the objective is to expose assumptions that would otherwise weaken specification and testing evidence.

## Earlier Collaboration and Explicit Responsibilities

Earlier collaboration works when participants bring different knowledge and retain explicit responsibilities.

| Role or perspective | Valuable contribution during clarification |
|---|---|
| Product and domain | Customer outcome, policy intent, priority, and acceptable trade-offs |
| Design and research | Interaction clarity, recovery expectations, and accessible communication |
| Development | Feasible implementation boundaries, state ownership, dependency behaviour, and diagnostic options |
| Quality Engineering | Risk questions, examples, testability concerns, evidence needs, and limitations |
| Support and operations | Recoverability, customer-impact signals, and investigation needs |
| Security, privacy, legal, or compliance specialists | Relevant controls, obligations, and escalation criteria |

Shared ownership does not mean that a Quality Engineer becomes the product owner, architect, or operations lead. It means that quality questions are raised at a time when the team can still make informed design choices. The Quality Engineer remains accountable for their contribution: exposing evidence gaps, designing proportionate testing, and communicating what testing can and cannot establish.

## Clarification Prevents Some Defects; Testing Still Matters

Finding an ambiguous requirement before implementation can be more valuable than finding its resulting defect after release. It can prevent incompatible assumptions from becoming code and reduce the cost of rework. That value should not be overstated.

Clarification does not prove that an implementation follows the agreed behaviour. It does not reveal every integration, data, configuration, timing, usability, accessibility, performance, or production condition. Testing remains essential for observing implemented behaviour and learning about the system under relevant conditions.

Prevention and testing are complementary feedback loops. Better specifications make testing more purposeful; testing findings improve future specifications and design decisions.

## Engineering Perspective

Testability is a practical design concern. If a system cannot expose a meaningful outcome, establish a needed state, isolate a dependency, or explain an unexpected result, the team will spend more time producing ambiguous feedback and repeating investigation.

The right response is not always more instrumentation or a larger test harness. It may be a clarified business rule, a stable interface, a visible state transition, a controlled fixture, a better error contract, or an explicit decision that some evidence belongs in a later environment. The trade-off should be proportionate to the risk and expected lifespan of the capability.

Part I’s systems thinking helps identify interacting boundaries. Part II’s programming concepts help readers reason about configuration, data, deterministic behaviour, and diagnostics. Use those foundations to collaborate on testability; defer full automation architecture, API implementation, CI/CD, data engineering, and operational observability to their dedicated parts.

## Industry Perspective

ISO/IEC 25030:2019 provides a framework for eliciting, defining, using, and governing quality requirements.[^iso-25030] ISO/IEC 25010:2023 provides a product-quality model that can support the specification and evaluation of quality requirements.[^iso-25010] The ISO/IEC/IEEE 29119 series provides testing concepts, processes, documentation, and design-technique references.[^iso-29119-series]

Specification by example and Given/When/Then notation are widely used industry practices, but their value comes from the collaborative clarification they enable—not from a particular syntax or automation framework. ISTQB’s foundation syllabus includes testing across the software development lifecycle and test-analysis concepts, but it is not the governing definition of this chapter or of Modern Quality Engineering.[^istqb-ctfl]

## Common Misconceptions

### “Acceptance criteria are test cases.”

Acceptance criteria state conditions that help a team decide whether intended behaviour is acceptable. They can inspire tests, examples, reviews, and automation, but they do not replace risk analysis or detailed test design.

### “Gherkin means the requirement is automated.”

Gherkin is a notation. It may support collaboration, documentation, or executable automation. The notation alone does not guarantee shared understanding, implementation, or evidence.

### “Testability is the tester’s responsibility.”

Testability is shaped by product decisions, design, code, interfaces, data, configuration, environments, and diagnostics. Quality Engineers advocate for it; the relevant engineering responsibilities remain shared and explicit.

### “Preventing ambiguity removes the need for testing.”

Clarification prevents some defects and improves evidence quality. Testing is still required to observe implemented behaviour and relevant system conditions.

### “Observability in a requirement review means building an SRE platform.”

The immediate concern is whether a relevant outcome can be observed and diagnosed. Full telemetry, operational monitoring, and reliability practice belong to Part VIII.

## Summary

Requirements and specifications are inputs to quality reasoning. When a team makes outcomes, states, boundaries, assumptions, errors, and observations explicit, it creates better options for design, testing, support, and learning.

Testability is the practical ability to obtain useful, interpretable evidence. Observability, controllability, determinism, isolation, and diagnosability help a Quality Engineer identify where evidence will be weak or expensive. These are engineering prompts, not a universal score or a replacement for product-quality standards.

Earlier clarification can prevent defects, but it does not remove the need to test the implemented system. It makes that testing more purposeful.

## Key Takeaways

- A concise requirement can express useful intent while still leaving critical behaviour unspecified.
- Examples and counterexamples make rules, boundaries, and failure behaviour discussable.
- Collaborative specification, Gherkin notation, and executable automation are related but distinct.
- Testability concerns whether useful evidence can be controlled, observed, and interpreted reliably.
- Testability lenses are engineering prompts; they are not a claim of an ISO/IEC quality score.
- Earlier collaboration preserves explicit responsibilities while reducing avoidable ambiguity.
- Prevention and testing reinforce each other; neither replaces the other.

## Review Questions

1. What kinds of ambiguity are present in “customers can pause subscriptions immediately”?
2. How does a counterexample improve a specification?
3. Distinguish a collaborative example from executable automation.
4. What is the difference between observability in a testability review and operational observability engineering?
5. How can a requirement be clear to a product manager but still insufficiently testable?
6. Why should a testability assessment avoid producing a single universal score?
7. How do state transitions change the questions a tester should ask?
8. Why does earlier clarification not eliminate the need for testing?

## Interview Questions

1. How would you challenge an ambiguous requirement without slowing a team unnecessarily?
2. Describe a time when a clarification question prevented rework or a defect.
3. What do you look for when assessing whether a feature is testable?
4. How do you use Given/When/Then without turning collaboration into a tooling exercise?
5. How would you explain the difference between a requirement, acceptance criteria, and a test case to a stakeholder?

## Practical Exercise

### Testability and Specification Review: Pause Subscription

**Objective:** Turn an ambiguous feature statement into a reviewable set of clarified behaviours, examples, testability concerns, and open decisions.

**Scenario:** A fictional product brief states:

> Customers can pause a subscription immediately and resume whenever they want. They should not be charged while paused, and the experience should be clear.

The system includes an account service, an entitlement service, an invoicing dependency, customer notifications, and a support export. A customer may have an expired payment method or attempt the action close to a billing boundary.

**Constraints:** Do not design the implementation. Do not create a full test suite, an API client, or a BDD framework. Treat all information as fictional.

**Tasks:**

1. Identify ambiguities, missing information, contradictions, hidden assumptions, and untestable claims in the brief.
2. Write clarification questions grouped by customer outcome, state, billing, data, dependency, error behaviour, and support need.
3. Produce at least four representative examples, including one boundary, one invalid transition, and one recovery or failure example.
4. Express one example using Given/When/Then notation. State what collaborative decision the example is intended to clarify and what it does not establish.
5. Assess observability, controllability, determinism, isolation, and diagnosability. Recommend proportionate changes or questions that would improve evidence quality.
6. Record the remaining assumptions and identify which ones require product, development, support, or specialist input.
7. Write a short note explaining how the review prevents some defects while preserving the need for later testing.

**Expected artifact:** A two- to three-page Testability and Specification Review containing an issue log, clarified examples, a testability assessment, open decisions, and a collaboration plan.

**Reflection:** Which question changed the possible implementation most? Which concern would be cheapest to address before code exists and most expensive to discover after release?

**Portfolio relevance:** This artifact demonstrates earlier quality influence, testability advocacy, and evidence-oriented collaboration. Use fictional or safely anonymised examples; do not include customer data, proprietary policy rules, credentials, or internal architecture details.

## Further Reading

- [ISO/IEC/IEEE 29148:2018 — Requirements engineering](https://www.iso.org/standard/72089.html) — for a lifecycle-process view of requirements engineering.
- [IEEE Computer Society, *Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a*](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf) — consult the Software Requirements and Software Testing knowledge areas for broader context.
- [Chapter 1 — Testing as Evidence Engineering](chapter-01-testing-as-evidence-engineering.md)
- [Chapter 2 — Risk-Informed Test Strategy](chapter-02-risk-informed-test-strategy.md)
- [Chapter 4 — Test Design for Efficient Evidence](chapter-04-test-design-for-efficient-evidence.md)
- [Part II — Programming for Quality Engineers](../../part-02-programming/README.md)

## References

[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Product quality model](https://www.iso.org/standard/78176.html). 2023.
[^iso-25030]: International Organization for Standardization. [ISO/IEC 25030:2019 — Quality requirements framework](https://www.iso.org/standard/72116.html). 2019; confirmed 2025.
[^iso-29119-series]: ISO/IEC JTC 1/SC 7. [ISO/IEC/IEEE 29119 series — Software testing](https://committee.iso.org/sites/jtc1sc7/home/projects/flagship-standards/isoiecieee-29119-series.html). Accessed 2026-08-09.
[^istqb-ctfl]: International Software Testing Qualifications Board. [Certified Tester Foundation Level Syllabus v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf). Accessed 2026-08-09.
[^specification-by-example]: Adzic, Gojko. [*Specification by Example: How Successful Teams Deliver the Right Software*](https://www.manning.com/books/specification-by-example). Manning, 2011.
[^gherkin-reference]: Cucumber Open Source Project. [Gherkin Reference](https://cucumber.io/docs/gherkin/reference/). Accessed 2026-08-09. This is an implementation-community syntax reference, not a formal requirements or testing standard.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Identify ambiguity, assumptions, and untestable claims in a requirement.
- [ ] Use examples and counterexamples to clarify a rule or boundary.
- [ ] Distinguish collaborative specification, Gherkin notation, and executable automation.
- [ ] Assess a proposed change for observability, controllability, determinism, isolation, and diagnosability.
- [ ] Explain how earlier clarification and later testing reinforce each other.
