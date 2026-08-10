# Chapter 6 — Test Levels, Boundaries, and Integration Evidence

## Metadata

| Field | Value |
|---|---|
| Part | Part III — Software Testing Engineering |
| MQE-BOK domain | Domain 3 — Software Testing Engineering |
| Chapter | 6 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–5; Part I — Foundations; Part II — Programming for Quality Engineers |
| Estimated study time | 145 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Place evidence where it can reveal the risk that matters, not where a familiar test-level label makes it easiest to count.

## Opening Story

The following illustrative scenario continues with Atlas Commerce, the fictional subscription service used in this part. The team has added a pause-subscription capability. Focused checks show that the pause rule rejects an ineligible request, records a planned resume date, and preserves the subscription state. The checks are fast and clear.

During a staged rollout, support reports a different concern. A valid pause appears in the customer account, but the billing export still lists the subscription as active until the next scheduled synchronization. The export is consumed by a support tool; a support representative may advise the customer from information that is temporarily out of date. No individual rule check was wrong. The uncertainty lies in the interaction among the subscription service, the data store, the export process, and the customer-support workflow.

Leah, the Quality Engineer, does not respond by declaring that all testing must now be end-to-end. She asks a narrower question: *which boundary can show whether the support-visible result becomes consistent with the pause decision within the agreed conditions?* The answer may require a focused integration check, controlled export timing, and an agreed observation of the resulting record. It does not require reproducing every browser, billing, or support action in one slow scenario. The team also records what that evidence will not establish, including live workload behaviour and every third-party failure mode.

## Why This Chapter Matters

Chapter 1 established that a result is bounded evidence, Chapter 2 used risk to decide which evidence matters, and Chapter 4 taught deliberate selection of test conditions. Those choices are incomplete until the team decides **where** to obtain the evidence. The same rule can be examined inside a module, across a service interface, through a system workflow, or from a customer-visible surface. Each location reveals something different and leaves something unknown.

Experienced QA Engineers often inherit labels such as unit, integration, system, or acceptance testing. These labels can be useful shorthand, but they become unhelpful when they replace reasoning. A “unit test” is not automatically better because it is fast; an end-to-end test is not automatically stronger because it touches more software. The useful question is: *what boundary exposes the failure mode that could undermine the decision we need to make?*

This chapter uses **test boundary** to mean the chosen edge of the system, component, dependency, or workflow that an evidence activity exercises or observes. It introduces common test-level vocabulary without treating those levels as a mandatory hierarchy. Chapter 7 then addresses how automated checks at a chosen boundary can be made trustworthy through isolation, controlled dependencies, and determinism. Chapter 9 later applies this reasoning more deeply to service and distributed-system strategy; this chapter does not teach API tooling, service virtualisation, or production topology.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why evidence obtained at different boundaries supports different claims;
- identify relevant function, component, service, datastore, external-dependency, subsystem, workflow, and user-visible boundaries without treating the list as universal;
- use common test-level terminology accurately while choosing boundaries from risk rather than habit;
- compare focused component evidence, integration evidence, system evidence, end-to-end evidence, and acceptance-oriented evidence;
- identify integration risks involving contracts, configuration, data, timing, ordering, transactions, versions, and failure behaviour;
- decide when a dependency should be exercised more realistically and when its behaviour can be controlled, without yet designing a double;
- distinguish evidence duplication from intentional overlap across boundaries; and
- produce a boundary map that states evidence value, dependencies, limitations, and residual risk.

## Evidence Placement Is an Engineering Decision

An **evidence boundary** is the point at which a team chooses to stimulate, observe, or control behaviour for a quality question. It might be a pure calculation, a module interface, a service endpoint, a database transaction, an event consumer, a user journey, or a report. Boundaries are properties of a particular system and question; they are not a fixed ladder that every product shares.

Choosing a boundary changes the evidence available:

| Evidence question | A focused boundary may reveal | A broader boundary may reveal | Important limitation |
|---|---|---|---|
| Is the pause eligibility rule applied correctly? | Rule and error handling with fast localization. | Whether the rule remains correct when reached through a workflow. | Neither result alone proves policy is complete. |
| Is the selected subscription state persisted? | Storage mapping and transaction outcome. | Whether other consumers receive and use the new state. | A passing write does not prove downstream consistency. |
| Does support see a usable record after a pause? | A consumer's interpretation of a defined contract. | The customer-to-support workflow and timing. | A test environment may not reproduce all operational delays. |
| Does a customer understand a declined pause request? | Message selection and accessibility properties. | A representative journey through the interface. | A single journey cannot establish usability for all users. |

The aim is not to find the smallest test in every situation. A smaller boundary is useful when it provides fast, controlled evidence about the risk. A broader boundary is justified when the risk resides in interaction, configuration, data movement, user flow, or a dependency that the smaller boundary cannot represent. In either case, a result supports only the claim that its conditions and observations make credible.

### From risk to boundary to evidence

The following is an **MSQE educational boundary-mapping model**, not a formal standard. It makes the selection reasoning inspectable:

```text
risk or decision
  → evidence question
  → relevant boundary
  → dependencies and controls
  → observation or oracle
  → limitation and residual risk
```

For the Atlas export concern, “the pause action succeeds” is too broad. A more useful framing is: *Can a support representative obtain a record consistent with a completed pause within the agreed synchronization conditions?* The selected boundary may include the subscription service's published record and the export consumer. The check needs a controllable pause event, a visible export result, an agreed time condition, and a way to distinguish a delayed update from an incorrect mapping. It cannot establish how a live support team will interpret every message or how the system behaves under an untested production load.

## What Is a Test Boundary?

Architectures vary. A monolith, a desktop application, a mobile client, a data product, and a distributed service may draw meaningful boundaries in different places. The following categories are useful prompts, not a taxonomy to impose on a system:

| Possible boundary | Useful question | Typical evidence value | What it can easily miss |
|---|---|---|---|
| Function or module | Does a calculation, validation rule, or transformation behave as specified? | Fast, localized rule evidence. | Wiring, configuration, and external behaviour. |
| Component | Does a cohesive part of the product behave through its public interface? | Interaction among nearby collaborators. | Behaviour of real remote dependencies. |
| Service or application boundary | Does a service honour a request, response, event, or contract? | Interface, serialization, authorization, and failure semantics. | Every consumer's use and deployment condition. |
| Datastore or transaction | Is data stored, retrieved, constrained, or changed consistently? | Persistence, transaction, and data-shape evidence. | User experience and downstream interpretation. |
| External dependency | Does the product interoperate with a payment, identity, notification, or supplier service? | Compatibility and real failure behaviour. | Control, speed, repeatability, and safe failure simulation. |
| Subsystem or workflow | Do several collaborating parts produce a meaningful business outcome? | Cross-component rules and orchestration. | Precise failure localization. |
| User-visible system behaviour | Can a representative user achieve and observe an intended outcome? | Broad customer-facing confidence. | Fast diagnosis and exhaustive variation. |

A boundary is not necessarily a network boundary. A clean module interface can be a valuable test boundary, and an in-process database can introduce an important persistence boundary. Conversely, a network call is not automatically an integration risk if no meaningful contract, configuration, data, or failure behaviour is exercised. Name the boundary from the system and evidence need rather than from a tool's folder structure.

## Test Levels Are Perspectives, Not a Mandatory Sequence

Industry literature commonly uses terms such as component testing, integration testing, system testing, and acceptance testing. ISO/IEC/IEEE 29119-2 describes generic processes applicable across lifecycle models; it does not turn one vocabulary or evidence distribution into a universal architecture.[^iso-29119-2] The ISTQB Foundation Level syllabus offers related testing-level terminology and distinctions.[^istqb-ctfl]

In this chapter, a **test level** is a customary way of describing the scope or boundary of an evidence activity. Teams may use the terms differently. A component check might include a real local database in one architecture and a controlled persistence seam in another. An “integration test” may mean two modules in one codebase, a deployed service interaction, or an end-to-end environment. Before comparing coverage or assigning ownership, agree what the local term includes.

The MSQE framing is more durable than a label: choose the boundary that can reveal the relevant risk with proportionate speed, controllability, diagnostic value, and representativeness. A product can sensibly have evidence at several levels, but no level is a completion badge.

### Component-level evidence

Component-level evidence examines a focused, cohesive part of the system through an interface that matters to its design. It can make a rule, state change, transformation, error response, or local collaboration visible with relatively fast feedback. It often supports precise diagnosis because fewer moving parts can explain the result.

For Atlas, component evidence can establish that the pause service rejects an invoice in a `finalized` state, persists the planned resume date, and emits a defined internal outcome. This is valuable before exercising a full customer workflow. It is also useful when a defect needs rapid reproduction with controlled data.

Its limitations matter. A passing component check may rely on an assumed data representation, serialization convention, clock, configuration value, or dependency response. It may not reveal that the export consumer expects another field name, that a real payment service rejects a request format, or that a deployed environment has an incompatible setting. Component evidence is strong for the claim it makes; it is weak evidence for claims outside its boundary.

### Integration evidence

**Integration evidence** examines whether collaborating parts behave compatibly across a meaningful boundary. Its purpose is not merely to prove that a request receives a response. It seeks evidence about the assumptions that one part makes about another: shape, meaning, timing, ownership, configuration, version, transaction, and failure behaviour.

For example, a pause workflow can pass all focused rule checks yet fail at integration because:

- a consumer expects `pausedUntil` in a different format or time zone;
- a configured feature flag selects an older event schema;
- a persistence transaction commits the subscription update but not the outbox record;
- an event arrives twice or after a cancellation has changed the state;
- an external entitlement provider returns a recoverable error that the caller treats as success; or
- a supplier upgrade changes a field's optionality or error representation.

These are not “integration bugs” because they happen after a component check. They are failures of a specific interaction assumption. State that assumption before choosing evidence. An integration check can then exercise the interface or data exchange that makes it observable, often with deliberately selected versions, configurations, data states, and failure responses.

## Integration Risk: Make Assumptions Visible

Integration risk rises where ownership, change cadence, protocol, data interpretation, or failure handling differs across a boundary. It is often hidden because each local component behaves plausibly in isolation.

| Risk dimension | Boundary question | Example Atlas concern |
|---|---|---|
| Ownership | Who can change this behaviour, and how will a change be communicated? | The export is owned by a reporting team. |
| Protocol or contract | What request, event, response, and error semantics are assumed? | A consumer interprets a missing resume date as “active now.” |
| Schema and data shape | Are names, types, defaults, precision, and null handling compatible? | A timestamp loses its time-zone offset in an export. |
| Persistence and transaction | Which changes succeed or fail together? | A pause state is committed without its corresponding audit record. |
| Ordering and asynchronous timing | What if messages are delayed, repeated, or observed out of order? | A resume event arrives before a previous pause event is processed. |
| Configuration and environment | Which flags, credentials, endpoints, or versions change behaviour? | Staging uses an inactive synchronization configuration. |
| Third-party behaviour | Which success, limit, timeout, or failure modes matter? | A payment provider accepts a request but completes later. |
| Version compatibility | Which producer and consumer versions must coexist? | A new field is emitted before a legacy consumer is updated. |

The table is a risk prompt, not an assertion that every integration needs every type of test. A simple stable interaction may need only focused confirmation. A customer-critical, changing, or weakly observable boundary can warrant broader evidence and explicit contingency planning.

## System, End-to-End, and Acceptance-Oriented Evidence

**System-level evidence** examines a larger configured system to establish a behaviour that crosses multiple internal parts. It may use real or representative dependencies, data, and user-facing interfaces. This is useful when the risk is inherently about orchestration: a subscription is paused, billing is adjusted, the customer account changes, and support can see the outcome.

**End-to-end evidence** follows an outcome through a broad path from a stimulus at one edge of the system to an observation at another. It can reveal wiring, deployment configuration, user-flow friction, authentication boundaries, data propagation, and collaboration defects that narrow checks do not exercise. Its cost is also real: it can be slower, harder to diagnose, dependent on environments or test data, more exposed to transient conditions, and expensive to maintain when a workflow changes.

More boundaries exercised do not automatically mean more confidence. A broad check can pass because it uses one ordinary data path while missing a high-consequence transition. A focused component or integration check may expose that transition much more clearly. Conversely, a large collection of focused checks can leave a customer journey untested. The appropriate distribution follows the risk, not a slogan about test counts.

**Acceptance-oriented evidence** asks whether a product outcome is sufficiently supported for a stakeholder, customer, policy, or business decision. It may include an agreed example, a user-visible workflow, a policy review, a demonstration, or evidence from several technical boundaries. It is not synonymous with a formal user-acceptance-testing process, and it does not transfer all quality responsibility to a business representative. It connects technical observations to the outcome that matters.

For Atlas, acceptance-oriented evidence might support the claim that an eligible customer can pause, receive understandable confirmation, retain the correct billing treatment, and be represented consistently in the support workflow under defined conditions. That claim is supported by a portfolio of evidence—not by one ceremonial test level.

## Pyramids and Other Distribution Heuristics

The testing pyramid and related shapes are commonly used to discuss feedback distribution. They can prompt a useful conversation: if most evidence is slow, brittle, and difficult to diagnose, are teams investing in the right boundaries? They become harmful when treated as universal numerical targets or proof that a product's evidence is well designed.

A product with complex local rules may benefit from many focused checks. A product that mainly composes external providers may need proportionately more integration evidence. A regulated customer journey may justify broader acceptance-oriented evidence. A small workflow may have no meaningful distinction between a component and a system boundary. Alternative shapes add vocabulary, but a catalogue of shapes does not answer the engineering question.

Ask instead:

- Which important risks have only slow or weakly diagnosable evidence?
- Which broad checks exist because a faster boundary was never made controllable or observable?
- Which narrow checks assume away a dependency behaviour that could harm a customer?
- Where would another check produce no material new information?

## Real and Controlled Dependencies

A dependency can be exercised in a more realistic form, controlled through a substitute or fixture, or omitted from a particular evidence activity. These are design choices, not moral categories. A real dependency may reveal compatibility, configuration, and failure semantics but increase cost and variation. A controlled dependency can make a condition repeatable and diagnosable but may hide a contract or production behaviour that matters.

At this stage, do not begin with “should we mock it?” Begin with the evidence question:

| Question | Boundary implication |
|---|---|
| Does the pause service react correctly to an expired-payment response? | A controlled response may efficiently expose local handling. |
| Is the request format still accepted by the payment provider version in use? | The real compatible boundary matters. |
| Can the support export interpret a completed pause record? | Exercise the producer-consumer contract and data representation. |
| Does the full customer journey remain coherent with configured identity and notification behaviour? | A broader representative path may be justified. |

Chapter 7 develops the mechanics and trade-offs of isolation and test doubles. Here, record what dependency behaviour is represented, what is controlled, and what has therefore not been established.

## Evidence Duplication, Intentional Overlap, and Missing Boundaries

The same business behaviour may appear at several boundaries. That is not automatically wasteful. A component check may demonstrate a pause rule quickly; an integration check may demonstrate the event contract; a system check may demonstrate a customer-visible outcome. They overlap in scenario language but answer different questions.

Duplication is wasteful when two activities exercise the same conditions, oracle, boundary, and failure assumptions without providing a materially different observation. Intentional overlap is justified when the same outcome must be protected against different risks: a focused check for a calculation, an integration check for data mapping, and a broader workflow for identity and configuration.

The opposite failure is **missing-boundary risk**: a team has many passing checks but none that exercises the interaction where an important assumption lives. Atlas might have rich coverage of pause rules and a customer interface, yet no evidence that an asynchronous export consumer handles a state change, no evidence that a configured payment response is interpreted correctly, or no observation that support data becomes usable. Counted checks can conceal this gap.

Review a boundary map when a feature changes, an incident exposes an assumption, a dependency version changes, a check becomes unreliable, or a release decision depends on a claim no existing evidence can support. The map is not a one-time architecture document; it is a compact way to keep evidence placement honest.

## Release Confidence Is an Evidence Portfolio

No test level establishes release confidence on its own. A release decision combines relevant evidence, known limitations, safeguards, reversibility, customer consequence, and accountable judgement. A fast component check may support a rule change, an integration check may support contract compatibility, a broad workflow may support a customer journey, and an exploratory investigation may expose questions not predicted by either. Their results must be interpreted together.

This does not require every release to assemble a large report. It requires the team to avoid claims such as “all levels passed” when the actual evidence did not include a changing supplier boundary, relevant data migration, customer journey, or quality concern. Where evidence is absent, say so and decide whether the residual risk is acceptable, mitigated, deferred, or a reason to obtain more information.

## Engineering Perspective

Boundary selection influences design. Hidden state, rigid coupling, unobservable asynchronous work, shared environments, and uncontrolled configuration can force teams toward slow, fragile, broad checks. A Quality Engineer can raise a constructive question: could a stable interface, explicit contract, controlled clock, visible state, safe fixture, or diagnostic improve the evidence without weakening the real behaviour that also needs testing?

The answer is rarely “test everything through the interface” or “move every test inward.” Engineering judgement balances feedback speed, representativeness, controllability, diagnostic value, maintenance cost, and the consequences of a wrong decision. The useful output is an explainable evidence portfolio and an identified gap, not a compliant pyramid diagram.

## Industry Perspective

ISO/IEC/IEEE 29119-2 provides generic test-process terminology applicable across lifecycle models.[^iso-29119-2] The ISTQB Foundation Level syllabus provides commonly used test-level vocabulary.[^istqb-ctfl] The SWEBOK Guide places testing alongside broader software-engineering concerns such as architecture, construction, configuration management, and operations.[^swebok]

These sources are useful references, not a prescription that every organisation use the same level names, team boundaries, test counts, or workflow. The boundary-mapping model in this chapter is MSQE educational framing that connects a risk to the most useful available evidence boundary and its limitations.

## Common Misconceptions

### “A lower-level check is always better because it is fast.”

Fast feedback is valuable, but it may not exercise the dependency, configuration, data shape, or workflow where the risk occurs. Use the fastest boundary that can support the claim; add broader evidence when the risk requires it.

### “End-to-end tests provide maximum confidence.”

They provide broad evidence about selected paths and conditions. They can still miss important local rules, failure responses, rare states, and higher-order interactions, while making failures hard to diagnose.

### “Every feature must be tested at every level.”

That creates repeated activity without necessarily adding information. Intentional overlap should answer a different question at a different boundary.

### “Integration testing just checks that systems can connect.”

Meaningful integration evidence examines assumptions about contracts, data, configuration, timing, version compatibility, transactions, and failure behaviour—not only reachability.

### “A test pyramid is a maturity model.”

It is a heuristic for discussing feedback distribution. It cannot determine the right evidence portfolio for a particular architecture or risk.

## Summary

Testing boundaries determine what an evidence activity can reveal and what it cannot. Common level names can help teams communicate, but they do not replace risk-based selection. Component evidence offers focused, fast feedback; integration evidence examines interaction assumptions; system and end-to-end evidence can reveal broader configured and customer-visible behaviour; acceptance-oriented evidence connects observations to stakeholder confidence.

Quality Engineers choose boundaries deliberately. They map a risk to an evidence question, dependencies, observations, limitations, and residual risk. They avoid both redundant repetition and the false confidence of a large suite that never crosses an important boundary. Release confidence comes from a proportionate portfolio of evidence, not from a completed hierarchy.

## Key Takeaways

- A test boundary determines both the evidence a result can support and the uncertainty it leaves.
- Test-level labels are useful local vocabulary, not a universal sequence or quality measure.
- Component, integration, system, end-to-end, and acceptance-oriented evidence answer different questions.
- Integration risk includes contracts, data shapes, transactions, timing, configuration, versions, and failure behaviour.
- A real dependency and a controlled dependency each reveal and hide different things.
- Evidence duplication is wasteful only when it adds no material new observation; overlap can be deliberate.
- Missing-boundary risk can leave important interactions untested despite a large suite.
- Release confidence requires an evidence portfolio with explicit limitations and residual risk.

## Review Questions

1. Why is “what test level should we use?” weaker than “what boundary will reveal this risk?”
2. What claim can a focused component check support, and what might it leave unknown?
3. Give three integration assumptions that a passing component check may not expose.
4. When is overlap between a component check and an end-to-end check justified?
5. Why can a broad workflow be difficult to use as the only evidence for a local rule?
6. What is missing-boundary risk? Provide an example.
7. How does an acceptance-oriented evidence question differ from a UAT process description?
8. What should a team record when it controls a dependency rather than exercising it realistically?

## Interview Questions

1. How would you decide whether a defect needs component, integration, or system-level evidence?
2. How would you challenge a proposal to test every feature at every level?
3. Describe an integration risk that might be missed by strong unit or component coverage.
4. How do you explain the limitations of an end-to-end result to a release stakeholder?
5. What information would you include in a risk-to-boundary map for a changing external dependency?

## Practical Exercise

### Build a Quality Evidence Boundary Map

**Objective:** Produce a proportionate evidence-placement rationale for a fictional customer journey rather than a list of tests grouped by level.

**Scenario:** Atlas Commerce is adding a pause-subscription option. A pause request updates subscription state, calculates the next billing date, writes an audit record, publishes a change for an entitlement service, and feeds a support export. A payment provider is consulted when a customer resumes. The customer account, support export, and billing record must not imply contradictory states. The team plans a 10% staged rollout and has two days to prepare release evidence.

**Constraints:** Treat all system details as fictional. Do not build an automation framework, an API client, a deployment environment, a diagram, or a production topology. Do not assume every dependency is available. State controlled assumptions rather than inventing implementation details.

**Tasks:**

1. Identify at least six customer, technical, financial, operational, or data risks.
2. Describe the relevant boundaries: local rule, persistence, event or service interaction, export, and one user-visible workflow.
3. For each selected risk, choose a proposed evidence boundary and explain why it is proportionate.
4. State which dependencies should be represented more realistically, which may be controlled for a focused question, and what evidence each choice removes.
5. Identify two apparent duplicate checks. Decide whether they are redundant or intentional overlap, and justify the decision.
6. Identify at least two missing-boundary risks that a large local test suite could conceal.
7. Record the observations or oracles needed, exclusions, limitations, and residual risk for a staged-rollout decision.
8. Write a short stakeholder summary explaining why the proposed portfolio is stronger than “test every level.”

**Expected artifact:** A three- to four-page **Quality Evidence Boundary Map** containing a risk-and-boundary table, dependency decisions, evidence rationale, duplication analysis, gaps, and residual-risk statement.

**Reflection:** Which selected boundary would become inadequate if the support export changed from a scheduled batch to an event-driven consumer? Which risk would justify a broader boundary despite slower feedback?

**Portfolio relevance:** This artifact demonstrates system-boundary reasoning, evidence placement, and risk communication. Use fictional or safely anonymised examples; do not publish customer data, credentials, supplier contracts, internal endpoints, proprietary topology, or confidential incident information.

## Further Reading

- [IEEE Computer Society, *Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a*](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf) — consult the Software Testing and Software Architecture knowledge areas for broader boundary and evidence context.
- [Chapter 2 — Risk-Informed Test Strategy](chapter-02-risk-informed-test-strategy.md)
- [Chapter 4 — Test Design for Efficient Evidence](chapter-04-test-design-for-efficient-evidence.md)
- [Chapter 7 — Reliable Automated Checks: Isolation, Doubles, and Determinism](chapter-07-reliable-automated-checks-isolation-doubles-and-determinism.md)

## References

[^iso-29119-2]: ISO/IEC/IEEE. [ISO/IEC/IEEE 29119-2:2021 — Software and systems engineering — Software testing — Part 2: Test processes](https://www.iso.org/standard/79428.html). 2021.
[^istqb-ctfl]: International Software Testing Qualifications Board. [Certified Tester Foundation Level Syllabus v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf). Accessed 2026-08-09.
[^swebok]: IEEE Computer Society. [*Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a*](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf). 2026.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Select a boundary from a risk and evidence question rather than a habitual test-level label.
- [ ] Explain what a focused, integration, and broad workflow result can and cannot establish.
- [ ] Identify important interaction assumptions and missing-boundary risk.
- [ ] Decide when overlap adds evidence and when it only duplicates activity.
- [ ] Communicate a boundary-based evidence portfolio with explicit limitations and residual risk.
