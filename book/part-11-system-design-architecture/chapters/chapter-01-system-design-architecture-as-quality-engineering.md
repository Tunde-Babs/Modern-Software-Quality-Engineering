# Chapter 1 — System Design & Architecture as Quality Engineering

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 1 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Parts I and III; Parts IV, VII, VIII, and X recommended |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An architecture decision is a claim about future system behaviour made under incomplete evidence. The diagram is not the claim, the pattern name is not the evidence, and the person who draws it is not always the person accountable for it.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

Atlas Commerce ships a checkout change. Every component test passes. The checkout service returns `201 Created` for a valid cart, the payment adapter returns a correctly shaped authorization response for each stubbed case, and the contract tests against the payment provider's published schema are green. On the strength of that evidence, the change is described in the release notes as "checkout hardened."

Two weeks later the third-party payment provider slows down. Its median response time rises from 180 ms to 4 s, and a proportion of requests never return before the checkout service's timeout. What customers experience is not a failed checkout. It is worse than that: a confirmation page that says the order is being processed, an email that does not arrive, an order-status page that shows `PENDING` for ninety minutes, and — for a small number of customers — a card charge with no corresponding order. Support cannot tell those customers whether they have been charged, because the only record Atlas holds is that the payment request was sent and no response was received.

Nothing in the component evidence was wrong. Each test asserted something true. The checkout service does return `201` for a valid cart. The payment adapter does parse the provider's response correctly. What the evidence never addressed was a different question: *when the payment dependency becomes slow rather than unavailable, what state does the system enter, who can observe it, and what can a customer be truthfully told?*

That question is not answered by a test. It is answered — or left unanswered — by a set of decisions taken before any test was written: that checkout would wait synchronously for payment confirmation; that the timeout would be treated as a failure rather than as an unknown outcome; that order state and payment state would live in the same table with no reconciliation path; and that no idempotency key would be carried through the payment call. Those are architecture decisions. They determined what the system could do under a condition nobody tested, and they determined what evidence was even available to answer the question afterwards.

## Why This Chapter Matters

Most QA Engineers encounter architecture as something that has already happened. A design is chosen, a diagram appears in a wiki, services exist, and testing begins downstream of decisions that have already fixed what is observable, what is isolatable, what can fail independently, and what can be recovered. By the time a defect is found, the cheapest moment to prevent its whole class has passed.

This part does not argue that Quality Engineers should own architecture. They should not, and Chapter 1 says so repeatedly and deliberately. It argues something narrower and more useful: that architecture decisions are quality claims, that quality claims require evidence, that Quality Engineers are unusually well trained in the discipline of asking what evidence supports a claim and what it cannot establish, and that this discipline is valuable in an architecture conversation *before* the decision is fixed.

The chapter establishes the vocabulary and the reasoning model used by every later chapter in Part XI. Chapter 2 applies it to boundaries and dependencies; Chapter 3 to communication, time, and failure; Chapter 4 to state and consistency. Chapters 5–11 apply it to styles, quality scenarios, engineering capabilities, contracts, evidence, evolution, and integrated trade-offs. Chapter 12 requires you to use all of it on an incomplete evidence packet.

Part XI stops where specialist parts begin. It does not teach test design (Part III), API protocol semantics (Part IV), automation implementation (Part V), data-quality engineering (Part VI), delivery pipelines (Part VII), telemetry implementation or SLO design (Part VIII), AI evaluation (Part IX), performance experiments or threat modelling depth (Part X), or organisational decision rights (Part XII). It consumes those disciplines only as far as needed to reason about structural quality.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish an architecture from an architecture description, and explain why a diagram or decision record expresses architecture without evidencing its quality;
- convert a vague quality request into one or more bounded architecture-quality claims with a system boundary, population, constraint, evidence boundary, limitation, owner, and revision trigger;
- name the nine ISO/IEC 25010:2023 top-level product-quality characteristics accurately and distinguish them from engineering capabilities such as observability, deployability, and recoverability;
- apply the MSQE Architecture Decision Reasoning Model forwards from context to decision and backwards from an observed failure to the assumption that needs revision; and
- produce an Architecture Claim Canvas for a synthetic Atlas Commerce change without claiming architectural ownership.

## Architecture as a Set of Consequential Decisions

It is tempting to define architecture and move on. Definitions of software architecture are numerous, contested, and — for this chapter's purpose — mostly interchangeable. Part XI takes a working position rather than a universal one.

**Architecture is the set of decisions about a system that are expensive to reverse and that constrain what the system can subsequently be made to do.** Which responsibilities live together. Which cross a process boundary. Which cross a trust boundary. What owns which state. Whether an interaction waits. What happens when a dependency is slow rather than absent. What can be deployed independently. What can be observed. What can be tested in isolation. What can be recovered after a partial failure.

Three properties of that set matter for Quality Engineering.

**They are decisions, not artefacts.** A decision exists whether or not anyone recorded it. Atlas decided that checkout would wait synchronously for payment; nobody wrote it down, and the decision was no less binding for that. An undocumented architecture is still an architecture. It is simply an architecture whose assumptions cannot be inspected or challenged.

**They are claims about the future.** "Extracting fulfilment will let us deploy it independently" is a prediction. "Adding a cache will make catalogue search fast enough" is a prediction. "This boundary will contain the failure" is a prediction. Predictions can be supported by evidence, weakened by evidence, or held without evidence — and the third case is far more common than teams like to admit.

**They have quality consequences that outlive the people who made them.** The Atlas engineer who put order state and payment state in one table was probably right at the time: it was simpler, and it was correct under the conditions then in view. The consequence arrived years later, under a condition that was never stated as an assumption.

This is why architecture belongs in a Quality Engineering handbook. Not because Quality Engineers should design systems, but because the discipline of separating fact from claim from assumption from evidence — the discipline Parts I through X have been building — is exactly the discipline an architecture conversation most often lacks.

## Architecture Is Not Architecture Description

This distinction is foundational, and confusing the two is the most common failure in architecture conversations.

ISO/IEC/IEEE 42010:2022 draws it explicitly.[^iso-42010] The **architecture** of a system comprises its fundamental concepts and properties: its elements, their relationships, and the principles of its design and evolution. An **architecture description (AD)** is the work product used to *express* that architecture — the diagrams, views, viewpoints, models, and supporting records. The standard specifies requirements for architecture descriptions. It deliberately does not prescribe architectures themselves, and it does not judge whether a given architecture is good.

```text
ARCHITECTURE  ≠  ARCHITECTURE DESCRIPTION
```

Written that way it looks obvious. In practice the conflation is constant, and it takes three recognisable forms.

**The diagram is treated as the system.** A context diagram shows checkout calling payment through a well-labelled adapter with a clean boundary. The diagram is accurate. It is also silent about timeout behaviour, retry policy, idempotency, and what state exists when the call does not return. A reviewer who approves the diagram has approved a picture of the boundary, not the behaviour at the boundary.

**The diagram is treated as current.** Architecture descriptions decay. The deployed system changes; the diagram does not. An AD can be complete, internally consistent, and beautifully rendered while describing a system that has not existed for eighteen months. Its consistency is not evidence of its currency.

**Producing the description is treated as doing the work.** A team asked to "document the architecture" produces a set of views and considers the architecture addressed. Nothing about the structure has been assessed, no assumption has been tested, and no consequence has been predicted. The description now exists. The architecture is exactly as it was.

The practical rule for Part XI: **a diagram, view, model, or Architecture Decision Record expresses an architecture; it is not evidence that the architecture is sound.** A correct diagram of an unsuitable structure remains an unsuitable structure. This does not devalue descriptions — they are how architecture becomes discussable, reviewable, and challengeable, which is most of why Part XI cares about them. It bounds what they establish.

Part XI uses ISO/IEC/IEEE 42010:2022 for vocabulary — architecture, architecture description, stakeholder, concern, view, viewpoint — and for one piece of discipline it makes explicit: a view exists to address a stated concern. A view that addresses no identified concern is decoration. This chapter does not teach the standard, require conformance to it, or reproduce its requirements.

## Product Quality and Engineering Capability

Architecture conversations use quality words loosely. "Scalable," "reliable," "maintainable," and "secure" arrive without population, condition, or threshold. Two moves help: use a precise vocabulary where one exists, and be explicit about where you have stepped outside it.

ISO/IEC 25010:2023 defines a product-quality model with **nine top-level characteristics**.[^iso-25010] Part XI uses the current edition and names them as the standard does:

| Characteristic | Architecture-relevant question it prompts |
| --- | --- |
| Functional suitability | Does the system produce the intended outcome correctly under the stated conditions? |
| Performance efficiency | Does time and resource behaviour meet a stated expectation under a stated workload and dependency condition? |
| Compatibility | Can components, consumers, and environments coexist and exchange information as intended? |
| Interaction capability | Can intended users interact with the system effectively in the relevant context? |
| Reliability | Does the system perform and recover appropriately under relevant conditions and failure modes? |
| Security | Are information, operations, and trust boundaries protected against relevant threats? |
| Maintainability | Can the system be analysed, modified, verified, and evolved at acceptable cost and risk? |
| Flexibility | Does the system adapt appropriately to relevant changes in environment, configuration, or usage context? |
| Safety | Is unacceptable risk of harm to people, property, or the environment avoided or controlled? |

Three terminology rules apply throughout Part XI.

**Do not mix editions.** Older material treats *usability* and *portability* as top-level characteristics. In the 2023 edition, interaction capability and flexibility occupy those positions, and safety was added as a top-level characteristic. Part XI uses usability and portability only as plain-language shorthand, never as current top-level labels.

**Do not confuse interaction capability with interoperability.** They sit at different levels and address different concerns. Interaction capability is a top-level characteristic about *users*. Interoperability is a subcharacteristic of *compatibility* and concerns information exchange between system elements. Architecture conversations reach for "interoperability" constantly; it belongs under compatibility.

**Do not invent characteristics.** Part XI does not add to the nine or silently rename one.

Separately from the standard, Part XI reasons about **engineering capabilities**: properties that determine how readily a team can create, assess, operate, and improve a system. Testability, observability, deployability, operability, recoverability, and scalability are used in this sense throughout the part. They are not additional ISO/IEC 25010:2023 top-level characteristics.

Several of those words also exist inside the standard at subcharacteristic level with a narrower meaning, so Part XI names the level it means:

| Word | Inside ISO/IEC 25010:2023 | In Part XI engineering usage |
| --- | --- | --- |
| Testability | A subcharacteristic of maintainability. | The architectural conditions — seams, isolation, controllability, determinism, substitution — that make evidence obtainable at all. |
| Operability | A subcharacteristic of interaction capability, concerning whether a **user** can operate the product. | Whether a **team** can run, diagnose, and intervene in the system safely in production. |
| Scalability | A subcharacteristic of flexibility. | An architecture-relevant property assessed against a stated workload, boundary, and constraint. |

Observability, deployability, and recoverability are not ISO/IEC 25010:2023 characteristics or subcharacteristics at any level. Part XI uses them purely as engineering capabilities and says so wherever it does. This mirrors the distinction Part III established for testing evidence.

Why insist on this? Because imprecise quality language produces unfalsifiable architecture claims. "This design is more maintainable" cannot be challenged. "This design reduces the number of modules a pricing-rule change must touch from four to one, at the cost of one additional deployment unit" can be challenged, checked, and found wrong.

## The MSQE Architecture Decision Reasoning Model

The following is an **original MSQE teaching model**. It is not an industry standard, a maturity model, a scoring system, or a checklist that guarantees a sound architecture.

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

Each element answers a question that architecture conversations routinely skip:

| Element | Question | Skipped-element symptom |
| --- | --- | --- |
| Context | What system, change, and situation are we deciding about? | Options are compared in the abstract, and the "best practice" wins. |
| Quality attribute / claim | What outcome are we claiming this will achieve? | Nobody can later say whether the change worked. |
| Constraint | What limiting condition must every option respect? | An option is chosen that the team cannot staff, fund, or operate. |
| Architectural option | What are the defensible alternatives? | The first idea becomes the decision. |
| Assumption | What must be true for this to work? | A silent assumption fails in production and looks like bad luck. |
| Trade-off | What gets worse? | The proposal reads as pure benefit, which is never true. |
| Failure mode | How does this degrade or break? | Failure is discovered by customers. |
| Evidence | What supports or challenges the claim? | Confidence rests on the seniority of whoever proposed it. |
| Decision | What is being chosen, and how broadly? | The decision is inferred later from the code. |
| Residual risk | What remains after we decide? | Risk is presented as eliminated. |
| Revision trigger | What would make us reconsider? | The decision is revisited only after an incident. |
| Owner | Who is accountable for this decision? | Everyone assumes someone else owns it. |

The model is directional but not one-way. Its value in Quality Engineering comes from traversing it **backwards**. Given the Atlas incident — customers charged with no order — you can walk back: *failure mode* (unknown payment outcome after timeout) → *assumption* (a timeout means the payment did not happen) → *decision* (treat timeout as failure, do not reconcile) → *quality claim* (checkout is reliable) → and find that the claim was never bounded in a way that would have exposed the assumption.

That backward traversal is the single most transferable skill in this part. It converts an incident from a story about what broke into a statement about which assumption was wrong and which decision now needs revisiting.

The model does not guarantee a good architecture. A team can complete every element and still choose badly, because judgement about consequences under uncertainty is irreducible. What the model prevents is a specific class of unsafe shortcut: treating a pattern name, a diagram, a benchmark, or an ADR as though it were proof.

## Worked Reasoning: From a Vague Request to Bounded Claims

Atlas leadership asks the team to "make checkout reliable and scalable." This is the normal form of an architecture request, and it is not yet decidable. It names no population, no condition, no threshold, no constraint, and no owner. Two engineers could satisfy it with opposite designs.

The Quality Engineer's contribution is not to answer it. It is to make it answerable by splitting it into bounded claims.

### Claim A — Terminal checkout outcome under payment-dependency slowdown

| Field | Entry |
| --- | --- |
| Context | Atlas checkout calls a bounded third-party payment provider synchronously. The provider has shown degraded latency in the last two quarters. |
| Quality claim | When the payment provider's response time degrades, every authenticated checkout attempt reaches a **terminal, truthfully reported state** — confirmed, declined, or explicitly pending-with-known-payment-status — within an agreed window. |
| Population and boundary | Authenticated customers in the checkout flow, from cart submission through order-state display. Includes the checkout service, payment adapter, order store, and the provider boundary. Excludes catalogue, search, and the fulfilment worker. |
| Relevant characteristic | Reliability, with a functional-suitability component (the reported state must be *correct*, not merely present). |
| Constraint | The payment provider is third-party; Atlas cannot change its timeout or retry semantics. Provider contract permits a documented reconciliation query. |
| Assumption | The provider's reconciliation query returns authoritative payment state within the agreed window. **Unverified.** |
| Evidence available | Synthetic dependency-slowdown runs; timeout counts; order-state distribution after the run. |
| Evidence missing | Whether a timed-out request was actually processed by the provider; whether the reconciliation query is accurate under provider degradation. |
| Limitation | Synthetic runs cannot establish provider behaviour under real degradation. |
| Owner | Payment domain owner decides the reconciliation approach; release authority decides rollout. |
| Revision trigger | Any change to provider timeout semantics, retry policy, or the reconciliation contract. |

### Claim B — Catalogue search under promotional demand

| Field | Entry |
| --- | --- |
| Context | A promotion is expected to increase catalogue search demand substantially over a bounded window. |
| Quality claim | Catalogue search returns results within the agreed response expectation for the stated elevated demand profile, without serving authorization-sensitive data from a shared cache. |
| Population and boundary | Anonymous and authenticated catalogue search requests, from API edge through search path and cache. Excludes checkout and payment entirely. |
| Relevant characteristic | Performance efficiency, with a security constraint on cache scope. |
| Constraint | No additional relational-store capacity is available in the promotional window. |
| Assumption | Search demand is read-dominated and cacheable at the assumed hit rate. **Unverified.** |
| Evidence available | Prior promotional traffic shape; synthetic load against the search path. |
| Evidence missing | Actual cache hit rate under the new promotional query mix; whether personalised results break the cacheability assumption. |
| Limitation | Prior traffic shape may not represent this promotion. |
| Owner | Catalogue domain owner; security owner approves cache scope. |
| Revision trigger | Introduction of personalised search results, or any change to cache key composition. |

### What the split achieved

The two claims have almost nothing in common. Different populations, different boundaries, different characteristics, different constraints, different owners, and — critically — different architectural options. Claim A points towards asynchronous acceptance, idempotency, and reconciliation. Claim B points towards caching, read paths, and cache-scope safety. A single design intended to satisfy "reliable and scalable" would have conflated them, and the cache decision taken for Claim B would have been made without anyone noticing that Claim A never depended on it.

Note also what the split did *not* do. It did not decide anything. It did not recommend a topology. It identified two answerable questions, the evidence each needs, the assumption each rests on, and who owns each. That is the deliverable.

## The Architecture Claim Canvas

The **Architecture Claim Canvas** is the professional artefact for this chapter. It is an MSQE teaching artefact, not a standard template, and it is deliberately short — one screen, not a document. Its purpose is to make a proposed architecture claim reviewable *before* design effort is spent on it.

| Canvas field | What it must contain |
| --- | --- |
| Context | The system, the change or situation, and why a decision is needed now. |
| Stakeholder concern | Whose outcome is at stake, stated as an outcome rather than a technology. |
| Quality claim | One bounded, falsifiable statement about system behaviour. |
| Relevant quality characteristic | The ISO/IEC 25010:2023 characteristic, named accurately, or an explicitly labelled engineering capability. |
| System boundary | What is inside the claim and — explicitly — what is outside it. |
| Population and condition | Which users, requests, or states, under what conditions. |
| Constraint | Limiting conditions every option must respect. |
| Assumption | Unverified conditions the claim depends on, each marked verified or unverified. |
| Evidence available | What already exists and what it supports. |
| Evidence missing | What would be needed and does not exist. |
| Limitation | What the available evidence cannot establish even if collected. |
| Owner | The role accountable for the resulting decision. |
| Residual risk | What remains if the claim is accepted as stated. |
| Revision trigger | The observation or changed condition that requires reassessment. |

Four disciplines make the canvas useful rather than ceremonial.

**Name the behaviour, not the mechanism.** "We should use a queue" is a mechanism. "A checkout attempt must reach a terminal state without holding the customer's browser connection open for the duration of a slow payment call" is a behaviour. Mechanisms are options; behaviours are claims. Starting from the mechanism forecloses the option set before it has been examined.

**Draw the smallest useful boundary.** Include what could affect the claim, and nothing else. An over-narrow boundary hides the dependency that actually matters. An over-broad boundary makes evidence uninterpretable, because every subsystem is treated as potentially causal. For Claim A, the fulfilment worker is outside the boundary — order state is the claim's terminus. For a different claim about delivery notification, it would be inside.

**State assumptions as conditions, not caveats.** An assumption written after a result is an excuse. An assumption written before is a testable statement about what must hold. "The reconciliation query returns authoritative state" is an assumption that can be verified, and its verification is a concrete piece of work someone can be assigned.

**Separate what evidence is missing from what evidence cannot establish.** These are different, and conflating them is a common failure. Missing evidence can be collected. A limitation cannot be collected away: a synthetic environment cannot establish real provider behaviour under real degradation, no matter how many runs you do. Both belong on the canvas, in separate fields, because they lead to different actions — one to a plan, the other to a risk acceptance.

### Canvas failure modes

| Weak entry | Why it fails | Stronger entry |
| --- | --- | --- |
| "Checkout must be reliable." | No population, condition, or falsifiable outcome. | "Every authenticated checkout attempt reaches a terminal, truthfully reported state under the stated dependency-slowdown condition." |
| "We assume the system works." | Not an assumption; a restatement of hope. | "We assume a provider timeout means the request was not processed. Unverified." |
| "Evidence: tests pass." | Test output about components, presented as evidence about a system claim. | "Evidence: component-level payment adapter tests; these establish response parsing, not dependency-slowdown state behaviour." |
| "Owner: the team." | No accountable role; the decision has no home. | "Owner: payment domain owner for reconciliation approach; release authority for rollout scope." |
| "Risk: none." | Residual risk is never zero after a real decision. | "Residual risk: provider behaviour under real degradation remains unobserved." |

## Decision Ownership and the Limits of This Role

Part XI is explicit and repetitive on this point because the failure it prevents is serious.

The Quality Engineer in an architecture conversation contributes analysis, evidence, boundary clarity, assumption discovery, failure-mode identification, and limitation language. The Quality Engineer does **not** own the architecture decision. That ownership sits with the accountable architecture, product, delivery, release, security, or operational authority, depending on the organisation and the decision.

This is not a statement about seniority or about who is permitted to have opinions. It is a statement about accountability. Someone must be answerable for the consequences of a structural choice — including its cost, its operational burden, and its effect on people who were not in the room. Evidence work that quietly becomes approval is a governance failure regardless of how good the evidence was.

Two practical consequences follow. First, the canvas has an owner field, and it is filled in with a role, before the analysis is circulated. Second, a Quality Engineer's recommendation is framed as a recommendation with its evidence and limitations attached — not as a verdict. "The evidence supports Option B for the stated claim, and does not address the operational cost that the platform owner must weigh" is a contribution. "We should do Option B" is an unowned decision.

Part XII addresses influence, escalation, and communication in a leadership context. Part XI restricts itself to recording ownership accurately and refusing to assign authority by job title.

## Engineering Perspective

Architecture evidence is not one thing, and its cost varies by orders of magnitude. A dependency map extracted from source is cheap and tells you about static structure only. A prototype costs days and tells you whether something is feasible, not whether it is operable. A failure experiment against a synthetic dependency costs setup effort and tells you about a specific failure mode under specific conditions. Operational history is nearly free and tells you about the system you already have, which may not be the system you are proposing.

Proportionality matters. A decision that is cheap to reverse — a caching strategy behind a stable interface — rarely justifies a large evidence investment; try it and watch. A decision that is expensive to reverse — splitting a data store, changing a trust boundary, committing to an event contract with external consumers — justifies more. The question "how expensive is it to be wrong here?" should determine how much evidence is proportionate, and it should be asked explicitly rather than settled by whoever has the most conviction.

Record decisions near the change, with their assumptions and revision triggers attached. Chapter 9 develops this into Architecture Decision Records and evidence plans. The point to establish now is that a record's value lies in what it makes challengeable later, not in its existence.

## Industry Perspective

The Software Engineering Institute's Architecture Tradeoff Analysis Method (ATAM) treats architecture evaluation as a structured examination of quality-attribute trade-offs, sensitivity points, and risks, conducted with stakeholders rather than by an individual reviewer.[^sei-atam] Part XI borrows the underlying idea — that architecture is evaluated against stated quality concerns, and that trade-offs and sensitivities are the useful output — without adopting ATAM as a required MSQE process. ATAM is a substantial, facilitated method with real overhead; presenting a lightweight canvas as an equivalent would misrepresent both.

The wider point is that architecture evaluation is an established discipline with a research literature behind it. A Quality Engineer contributing to an architecture conversation is not improvising a new practice. They are participating in one, with the specific contribution of evidence discipline.

## Common Misconceptions and Pitfalls

### "The architecture is the diagram."

It is not. The architecture is the set of decisions and their consequences in the deployed system. The diagram expresses some of them, at a chosen level of abstraction, as of whenever it was last updated. Approving a diagram approves a description.

### "Component tests passed, so the system works."

Component evidence supports component claims. The Atlas opening story contains no failing component test, because the failure lived in an interaction between a timeout policy, a state model, and a dependency condition that no component owned. Chapter 3 develops this specifically.

### "Choosing a well-known pattern is a justification."

A pattern name is a compression of a solution and its context. Invoking the name does not establish that your context matches. "We're using event-driven architecture" states a mechanism, not a claim, and answers no question about whether the resulting duplicate-delivery and ordering behaviour is acceptable for your outcome.

### "The senior engineer decided, so it has been evaluated."

Experience is genuinely valuable evidence about failure modes and consequences, and it should be weighted. It is not a substitute for stating the assumption that the judgement rests on. The useful question is not "are you sure?" but "what would have to be true for this to be wrong?"

### "Architecture is not a QA concern."

Testability, observability, and recoverability are determined at architecture time and are expensive to retrofit. Raising them after the structure is fixed is the most common way for a Quality Engineer's contribution to arrive too late to matter.

## QA → QE Transition

The transition in this chapter is from *"does this component work?"* to a different sequence of questions:

- What system outcome is being claimed, for whom, under what condition?
- Which architectural decisions determine whether that outcome is achievable?
- What assumptions does the claim rest on, and which are unverified?
- What evidence exists, what is missing, and what can no evidence establish?
- What failure mode remains, and what is the residual risk?
- Who owns the decision, and what should trigger reassessment?

A QA Engineer asks whether the thing that was built behaves as specified. A Quality Engineer asks whether the thing being proposed can be shown to produce the outcome anyone actually cares about — and says plainly when it cannot yet be shown.

## Summary

Architecture decisions are quality claims made under incomplete evidence, and they constrain what a system can later be made to do, tested for, observed, or recovered from. They exist whether or not they are recorded. An architecture description expresses an architecture; it does not evidence its quality, and it may not even be current. Precise quality vocabulary — the nine ISO/IEC 25010:2023 characteristics, kept distinct from engineering capabilities — makes architecture claims falsifiable rather than rhetorical. The MSQE Architecture Decision Reasoning Model provides a directional structure for moving from context to decision, and a backward path from an observed failure to the assumption that needs revision. The Quality Engineer's contribution is evidence discipline and boundary clarity, not ownership of the decision.

## Key Takeaways

- Architecture is the set of decisions that are expensive to reverse and that constrain future behaviour, evidence, and change.
- `ARCHITECTURE ≠ ARCHITECTURE DESCRIPTION`: a diagram, view, or ADR expresses architecture without proving it sound or current.
- ISO/IEC 25010:2023 defines nine top-level product-quality characteristics; interoperability sits within compatibility, interaction capability replaced usability, flexibility replaced portability, and safety is top-level.
- Observability, deployability, and recoverability are engineering capabilities, not ISO characteristics.
- A bounded architecture-quality claim names its population, condition, constraint, assumption, evidence boundary, limitation, owner, and revision trigger.
- Traversing the reasoning model backwards — from failure to assumption — is how an incident becomes an architecture correction rather than a story.
- The Quality Engineer supplies evidence and makes uncertainty visible; the accountable authority owns the decision.

## Review Questions

1. Why is an accurate, up-to-date architecture diagram insufficient evidence that an architecture is sound?
2. A colleague lists "observability" alongside reliability and security as ISO/IEC 25010 product-quality characteristics. What is wrong, and why does the distinction matter for an architecture claim?
3. Take the request "make the order-status page fast." Identify at least four pieces of information that must be added before it becomes a decidable architecture claim.
4. Using the MSQE reasoning model backwards, trace the Atlas charged-with-no-order failure to the assumption that needs revision.
5. Why does the Architecture Claim Canvas separate "evidence missing" from "limitation," and what different action does each imply?

## Interview Questions

1. How would you contribute to an architecture review without claiming to own the design decision?
2. A team proposes extracting a service and says the benefit is loose coupling. What would you ask before agreeing that the benefit is real?
3. How do you distinguish a component test result from evidence about a system-level quality claim?
4. Describe a time when a decision's assumption was never stated. What would have made it visible earlier?

## Practical Exercise

Create an **Architecture Claim Canvas** for the following synthetic Atlas Commerce situation.

*Atlas plans to add a loyalty-points balance to the order-confirmation page. Points are owned by a separate loyalty module that currently updates asynchronously after fulfilment. Product wants the balance to appear "immediately and correctly." The promotion window begins in six weeks.*

Complete every canvas field. Your submission must:

- state one bounded, falsifiable quality claim — not the mechanism you would use;
- name the relevant ISO/IEC 25010:2023 characteristic accurately;
- draw a system boundary that explicitly excludes something, and say why;
- record at least two assumptions and mark each verified or unverified;
- distinguish at least one piece of missing evidence from at least one limitation;
- name an accountable role for the decision, not a team; and
- state a revision trigger.

Then identify the tension in the phrase "immediately and correctly" and explain which architectural question it forces someone to answer. Do not propose a design. Use only synthetic data; no production system, real customer record, or live third-party integration.

## Further Reading

- [ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise — Architecture description](https://www.iso.org/standard/74393.html)
- [ISO/IEC 25010:2023 — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html)
- [SEI — The Architecture Tradeoff Analysis Method](https://www.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/)

## References

[^iso-42010]: International Organization for Standardization, International Electrotechnical Commission, and Institute of Electrical and Electronics Engineers. [ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise — Architecture description](https://www.iso.org/standard/74393.html). 2022. Accessed 2026-08-14.
[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). 2023. Accessed 2026-08-14.
[^sei-atam]: Software Engineering Institute, Carnegie Mellon University. [The Architecture Tradeoff Analysis Method](https://www.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/). Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain the difference between an architecture and an architecture description, and why the distinction changes what a review establishes.
- [ ] Name the nine ISO/IEC 25010:2023 top-level characteristics without mixing editions, and place interoperability correctly.
- [ ] Distinguish an engineering capability from a product-quality characteristic and say why the distinction matters.
- [ ] Convert a vague quality request into a bounded architecture claim with boundary, population, assumption, evidence limit, owner, and revision trigger.
- [ ] Traverse the MSQE Architecture Decision Reasoning Model backwards from an observed failure.
- [ ] State what a Quality Engineer contributes to an architecture decision and what remains with the accountable owner.

## Chapter Navigation

Previous: [Part XI overview](../README.md) · Next: [Chapter 2 — Boundaries, Responsibilities, Coupling, and Dependencies](chapter-02-boundaries-responsibilities-coupling-and-dependencies.md)
