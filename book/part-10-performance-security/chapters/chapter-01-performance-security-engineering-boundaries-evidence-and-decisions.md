# Chapter 1 — Performance & Security Engineering: Boundaries, Evidence, and Decisions

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 1 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Parts I and III; Part VIII evidence concepts recommended |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A slow response and a security finding are observations. They become decision evidence only when their boundary, assumptions, method, limitation, consequence, and owner are explicit.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce changes its checkout flow to use a partner-payment fallback. In a synthetic elevated-workload experiment, median checkout latency falls from 420 ms to 350 ms. The result is encouraging, and a dashboard-style summary could easily label the change a performance improvement.

The same run contains a less comfortable signal. The p95 latency rises for customers whose payment requests use the fallback; a queue grows behind a constrained dependency; and a timeout causes a small number of payment attempts to enter an unknown state. Separately, a synthetic verification record shows that a support refund endpoint accepts a request from an authenticated user whose role should not permit the action. A scanner also reports a configuration concern, but the available evidence does not yet show whether that report applies to the current synthetic deployment.

No single observation authorizes a release conclusion. The median result does not establish the behaviour of the affected tail population. The authorization result requires a bounded verification and remediation decision. The scanner output is a lead, not a security truth. The engineering task is to decide what can be claimed, what remains uncertain, who must act, and which evidence would change the decision.

## Why This Chapter Matters

Performance and security are often treated as separate specialisms. One team reports response-time metrics; another files findings. That split can obscure a common engineering problem: both disciplines assess system behaviour under stated conditions and support decisions while evidence is incomplete.

A **performance quality claim** is a bounded statement about behaviour under a defined workload, population, environment, and measurement method. A **security quality claim** is a bounded statement about whether a relevant asset, trust boundary, or control has been verified against a defined threat or misuse assumption. Neither claim is established by one number, one test, or one tool result.

This chapter establishes the reasoning model for Part X. Chapters 2–6 build performance evidence; Chapters 7–10 build defensive security evidence; Chapters 11–12 reconcile trade-offs and conflicting evidence. Part X does not replace Part VIII observability implementation, Part VII delivery practice, Part XI architecture design, or security-governance and legal decision making.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish a measurement or finding from a bounded quality claim;
- define a useful system, population, workload, threat, and evidence boundary;
- explain why a slow response is not automatically a root cause and a scanner result is not automatically a vulnerability conclusion;
- identify limitations, decision owners, and residual risk for a performance or security decision; and
- create a Performance & Security Quality Claim Canvas for a synthetic Atlas Commerce change.

## Performance and Security as Quality Concerns

ISO/IEC 25010:2023 provides a product-quality model that includes performance efficiency and security characteristics.[^iso-25010] It is useful as a shared vocabulary, not as a universal acceptance threshold or an MSQE workflow. A product can meet a response-time target for an average request while leaving a material tail population waiting. It can reject one unauthorized request while leaving other objects, actions, identities, or states unverified.

Performance efficiency and security are product-quality concerns. **Observability**, testability, resilience, and automation are engineering capabilities that help a team understand, verify, or improve those concerns. The distinction matters. A trace can help localize an observed delay; it does not itself prove acceptable performance. A security test suite can provide evidence about a control; it does not itself prove that a system is secure.

Performance and security can also interact. Rate limiting can reduce an abuse pathway while rejecting legitimate traffic during a spike. Stronger authentication can improve confidence in identity while adding dependency calls and latency. Caching can lower read latency while creating stale-authorization or sensitive-data risk. An engineering decision must state both the intended benefit and the possible cost rather than assuming that one metric decides both.

## From Observation to a Bounded Claim

The following is an **MSQE teaching model**, not a standard:

```text
System boundary
    → workload and threat assumptions
    → experiment or defensive verification
    → evidence and interpretation
    → limitation and risk
    → decision, owner, and revision trigger
```

The model turns an observation into a claim that another engineer can challenge. A useful claim answers several questions.

| Element | Question it answers | Atlas checkout example |
| --- | --- | --- |
| Fact | What was observed? | Fallback-path p95 latency increased in one synthetic run. |
| Quality claim | What behaviour is assessed? | Checkout remains responsive for the defined elevated workload without creating unacceptable payment-state ambiguity. |
| Boundary | Which population and system path are included? | Authenticated customers using the partner fallback in the stated region and synthetic environment. |
| Assumption | What must be true for the evidence to apply? | The dependency delay and workload mix reasonably represent the intended experiment question. |
| Evidence | What supports the claim? | Latency distribution, timeout share, queue depth, dependency timing, and state-reconciliation record. |
| Interpretation | What does the evidence support? | The median improved, but tail behaviour and unknown-state handling require a constrained decision. |
| Limitation | What cannot be concluded? | The run does not establish production traffic, all regions, or all payment partners. |
| Decision consequence | What action follows now? | Investigate tail growth and state reconciliation before broad promotion. |
| Owner and residual risk | Who acts, and what remains? | The release owner decides rollout conditions; dependency and client-visibility uncertainty remain. |

This model prevents a familiar failure mode: treating an output as an explanation. A response time is a measurement of elapsed behaviour across a stated boundary. It may be affected by client conditions, network, edge, application, cache, database, queue, dependency, or measurement method. It is not automatically proof of one root cause. Similarly, a scanner result may identify a plausible issue, a configuration pattern, or a coverage gap; it needs validation, context, and ownership before it supports a security decision.

## System Boundaries, Workload Assumptions, and Threat Assumptions

A **system boundary** identifies the components, actors, data, and interactions included in the claim. It is not a diagram for its own sake. It limits what the evidence can establish. Atlas checkout includes a browser storefront, account context, checkout API, payment dependency, cache, queue-backed fulfilment, and relational store. A claim about checkout latency must specify whether it measures browser-to-response time, server handling time, or a dependency call. A claim about authorization must specify the actor, resource, action, state, and deny behaviour.

A **workload assumption** describes the demand conditions that make performance evidence meaningful: request mix, arrival pattern, concurrency, ramp, duration, dependency state, and environment. A **threat assumption** describes the actors, assets, trust changes, misuse possibilities, and control questions that make defensive evidence meaningful. They are not forecasts or exhaustive threat catalogues. They are testable statements about the question being investigated.

For example, “Atlas checkout is fast” is not a useful claim. A more useful claim is: *For synthetic authenticated checkout requests using the stated payment mix, after warm-up and during the defined steady-state window, the candidate configuration maintains the agreed evidence boundary without increasing timeout share beyond the local decision rule.* It still does not establish production capacity. It does make the method, limitation, and next decision inspectable.

## Worked Reasoning: The Fallback Decision

The following reasoning record separates fact from interpretation for the illustrative change.

| Field | Evidence-led record |
| --- | --- |
| Fact | In three comparable synthetic runs, median checkout time decreased; fallback-path p95 increased and queue depth grew during a dependency slowdown. |
| Quality claim | The candidate supports the defined elevated checkout workload without unacceptable tail latency, timeout, or payment-state risk. |
| Evidence | Request distributions, timeout proportion, queue observations, dependency timing, and synthetic reconciliation outcomes. |
| Interpretation | The evidence supports a median improvement but does not support a broad claim that checkout performance improved for the relevant population. |
| Limitation | The environment excludes production network variability and uses a bounded dependency-failure profile. |
| Performance risk | Tail latency and queue growth may increase abandonment or delay recovery. |
| Security risk | Unknown payment state can create authorization or support-handling risk if the recovery path is not constrained. |
| Decision | Do not use the median result as release approval. Compare a candidate with bounded retries, verify state reconciliation, and reassess the tail population. |
| Owner | The Quality Engineer maintains the evidence record; the designated release authority decides rollout scope. |
| Residual risk | Production workload variability and third-party behaviour remain unobserved. |
| Revision trigger | Reassess when payment routing, retry policy, cache configuration, dependency contract, or workload model changes. |

The record does not manufacture certainty. It makes uncertainty actionable. A team can decide to pause, mitigate, run another bounded experiment, or use a constrained rollout plan. The correct choice depends on consequences and accountable authority, not on a single metric.

## Testing and Engineering Judgement

Testing is indispensable. It can reveal slow responses, unexpected state transitions, rejected requests, access-control failures, and suspicious configurations. Quality Engineering adds the work required to decide what those observations mean for a system and its stakeholders.

| Testing activity | Engineering judgement added in Part X |
| --- | --- |
| Measure checkout response time | Define the population, measurement boundary, workload, distribution, limitation, and decision consequence. |
| Execute an authorization check | Identify the actor, resource, action, state, trust boundary, evidence gap, owner, and residual risk. |
| Run a scanner or rule set | Validate scope and context; distinguish a confirmed issue from a lead, false positive, or coverage limitation. |
| Compare two runs | Establish whether workload, environment, dependencies, data state, and method are comparable before attributing a regression. |

This does not make the Quality Engineer the release authority or security approver. The Quality Engineer supplies disciplined evidence and makes uncertainty visible. Ownership remains with the relevant engineering, product, security, platform, privacy, or release role.

## Building a Claim Canvas Step by Step

The Performance & Security Quality Claim Canvas is a compact way to make a proposed test or finding reviewable before effort is spent on it. The canvas does not replace a threat model, experiment plan, access-control matrix, or release decision. It identifies which of those artifacts are necessary and why.

### Step 1: Name the Behaviour, Not the Tool Output

Begin with an outcome that matters to a user, system, or asset. “p95 is under one second” is a measurement condition, not a complete quality claim. “Authenticated checkout requests receive a terminal, correctly bounded outcome under the defined elevated workload” identifies a behaviour. The associated measures might include p95, timeout share, queue trend, and payment-state reconciliation because each provides different evidence about that behaviour.

For security, “the scanner passes” is likewise not a claim. “A support operator may view permitted order data but cannot initiate a refund for the stated order state” identifies actor, resource, action, state, and expected boundary. The available scanner output can be one evidence source, but it cannot replace verification of the behaviour.

### Step 2: Draw the Smallest Useful Boundary

Do not start by including every Atlas component. Include the components and transitions that could affect the claim. For the checkout fallback, that could include the customer browser boundary only if browser experience is being claimed, checkout API, payment dependency, bounded retry handling, queue-backed fulfilment state, and the evidence source. For the support refund decision, include the support actor, support/refund API, order state, authorization policy, cache/view boundary where relevant, and resulting event or state record.

The smallest useful boundary is a discipline against two errors. An overly narrow boundary hides an important dependency or trust change. An overly broad boundary makes evidence impossible to interpret because every subsystem is treated as causal by default.

### Step 3: State Assumptions That Could Change the Result

Assumptions are not apologies written after a result. They are conditions the team expects to hold while collecting evidence. A performance assumption might identify the workload mix, arrival schedule, warm-up, cache state, dependency latency profile, and environment. A security assumption might identify a synthetic actor, role, asset, route, state, input category, dependency configuration, or cache scope.

An assumption should be challenged when it materially affects the decision. If the checkout result depends on a pre-populated cache but the planned change alters cache scope, the cache condition must be visible. If a support action is verified only after one role assignment, the matrix should not claim all support permissions are covered.

### Step 4: Select Evidence With Complementary Blind Spots

One measurement rarely supplies a sufficient explanation. Consider how evidence sources complement one another:

| Evidence source | Strength | Blind spot |
| --- | --- | --- |
| Latency distribution | Shows observed spread for the measured population | Does not identify cause or complete client experience |
| Queue observation | Shows accumulation in a defined boundary | Does not prove the original constraint |
| Dependency timing | Corroborates external delay | Does not account for all caller waiting or policy effects |
| Synthetic authorization outcome | Verifies one actor/action/state route | Does not cover every route, actor, or configuration |
| Finding report | Identifies a lead or possible coverage area | Requires context and verification |
| State-reconciliation record | Shows a terminal effect of a request | May omit routes or states outside the test |

Choosing sources with different blind spots improves the claim. It does not eliminate uncertainty. The canvas should state what the combined evidence still cannot establish.

### Step 5: Decide the Consequence Before Reading the Result

Evidence is more useful when the team knows what action each result might support. Possible consequences include gathering a comparable experiment, expanding an authorization matrix, tuning a control, applying a mitigation, constraining a rollout, pausing a change, or handing a bounded question to runtime learning. The consequence is not predetermined approval or rejection. It is the action that becomes proportionate if the evidence supports, challenges, or leaves the claim unresolved.

The decision owner should be named before the result arrives. A Quality Engineer can recommend a bounded action. A release owner, security owner, product owner, or other designated authority accepts the decision consequence appropriate to the organization. This separation prevents evidence work from silently becoming unauthorized approval.

### Example Canvas: Account Recovery Under Load

| Canvas field | Draft entry |
| --- | --- |
| Intended behaviour | Legitimate synthetic customers can recover an account through the stated path while excessive recovery requests are bounded. |
| System boundary | Browser/API recovery flow, identity dependency, rate-limit control, support path, diagnostic evidence. |
| Population | Legitimate synthetic recovery attempts and a separately defined excessive-request population. |
| Workload/threat assumptions | Five-minute spike, bounded dependency latency, stated rate-limit policy, no production traffic or real credentials. |
| Evidence | Legitimate latency/rejection distribution, accepted excessive-attempt proportion, dependency timing, support-path record. |
| Interpretation question | Does the control provide a proportionate defensive benefit without an unacceptable user-impact signal? |
| Limitation | Synthetic attempts do not estimate real abuse; support interaction is modeled, not observed in production. |
| Risk and consequence | If tail/rejection grows materially, tune or constrain the policy before broad use. |
| Owner and revision trigger | Release/risk owner decides; re-evaluate after policy, identity dependency, cache, or workload change. |

The canvas is deliberately incomplete as a release record. It tells the team which experiment and verification artifacts must be created next.

## Claim-Canvas Failure Modes

The canvas is weak when an important field is replaced with a slogan. “Performance is acceptable” omits population and consequence. “Security is covered” omits assets, actors, boundary, and method. “The tool passed” omits interpretation and limitation. Correct the canvas before collecting more evidence, because a precise experiment cannot rescue an imprecise claim.

| Weak entry | Better entry |
| --- | --- |
| “Checkout is fast.” | “The stated authenticated checkout population meets the bounded distribution, timeout, and state-reconciliation claim during the defined workload window.” |
| “Refund is protected.” | “The stated support role is denied refund initiation for the named order state and route; matrix coverage limits are recorded.” |
| “No risk.” | “The tested boundary has no verified issue in the current record; listed routes, states, and environment limits remain residual risk.” |

The correction is not semantic perfection. It ensures that later evidence can actually change or support a decision.

## Claim Confidence and Decision Scope

The same observation can justify different actions depending on the cost of being wrong. A one-run indication that an internal diagnostic is slow may justify investigation. It rarely justifies a broad rollout, a capacity purchase, or acceptance of a material security exposure. The evidence record should therefore state its **decision scope**: investigate, constrain a rollout, approve a bounded change, or defer a decision until evidence improves.

Confidence is not a score produced by a tool. It is a reasoned judgement about whether the measurement is representative, the boundary is known, competing explanations have been considered, and the result has been repeated or corroborated. A useful review question is: *what would have to be false for this recommendation to be unsafe?* The answer often reveals an unstated dependency, workload assumption, or trust-boundary condition that needs recording.

For the fallback example, a defensible record might say that the claim applies to signed-in checkout traffic in the measured region, with the named dependency in its observed degraded state. It does not establish behaviour for anonymous traffic, every region, or every failure mode. That limitation does not weaken the record; it prevents a local observation from being presented as a universal property.

## Engineering Perspective

An evidence record is most useful when it supports a decision that can later be revisited. Record the claim, source versions, environment, assumptions, results, limits, owner, and revision trigger near the change. This creates a trace from a quality concern to a proportionate action without pretending that a pre-production experiment is a production guarantee.

For security work, use the same discipline to avoid both complacency and alarmism. A defensive verification can show that a specific synthetic actor is denied a specific action. It cannot prove that every route is protected. A credible record identifies what was checked, what was not checked, remediation status, and the condition that would require reassessment.

## Industry Perspective

The NIST Cybersecurity Framework describes outcomes for managing cybersecurity risk rather than prescribing one implementation or testing product.[^nist-csf] The NIST Secure Software Development Framework similarly describes high-level secure-development practices, not a certification that a particular system is secure.[^nist-ssdf] These boundaries align with the Part X approach: use recognized guidance to frame questions and evidence, then make claims proportionate to the system and decision.

## Common Misconceptions and Pitfalls

### “A lower average proves performance improved.”

An average can hide a degraded tail, a changing request mix, or a smaller number of completed requests. Compare distributions, population, workload, errors, and method before making a claim.

### “A scanner finding is a vulnerability verdict.”

A tool result can be valuable evidence, but its scope, configuration, target, false-positive risk, and verification status matter. Treat it as a lead until the available evidence supports a bounded conclusion.

### “Security and performance are separate release checks.”

They may have separate evidence sources, but a control can affect both. Decisions should expose the trade-off rather than selecting the most convenient metric.

## QA → QE Transition

The transition in this chapter is from recording a symptom or defect to building a bounded quality claim. The Quality Engineer asks what was measured or verified, which population and threat matter, what the result cannot establish, who owns the next action, and when the decision must be revisited.

## Summary

Performance and security evidence is only useful when its boundaries are clear. Measurements, test outcomes, and findings are observations. They become engineering evidence when they are connected to an explicit claim, assumptions, method, interpretation, limitation, risk, owner, and decision.

## Key Takeaways

- Performance efficiency and security are product-quality concerns; observability and testability are engineering capabilities that support evidence.
- A slow response is not automatically a root cause, and a scanner output is not automatically a security conclusion.
- Workload and threat assumptions define what an experiment or verification can support.
- Quality Engineers provide decision-ready evidence; they do not substitute for accountable release, legal, or security authority.

## Review Questions

1. Why is a response-time measurement not automatically a root-cause explanation?
2. What makes a performance or security claim bounded?
3. How can a rate limit create both a security benefit and a performance risk?
4. Which fields would you add to an evidence record before recommending a release action?

## Interview Questions

1. How would you challenge a claim that a release is secure because a scanner reported no issues?
2. What information do you need before treating a latency change as a regression?
3. How do you communicate residual risk without blocking every change?

## Practical Exercise

Create a **Performance & Security Quality Claim Canvas** for a synthetic Atlas Commerce checkout change. State the system and population boundary, workload and threat assumptions, evidence source, limitation, performance and security risks, decision owner, residual risk, and revision trigger. Do not use production data, a live target, or a real customer record.

## Further Reading

- [ISO/IEC 25010:2023 product-quality model](https://www.iso.org/standard/78176.html)
- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20)
- [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## References

[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 Systems and software engineering — Product quality model](https://www.iso.org/standard/78176.html). 2023. Accessed 2026-08-12.
[^nist-csf]: National Institute of Standards and Technology. [NIST Cybersecurity Framework (CSF) 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20). 2024. Accessed 2026-08-12.
[^nist-ssdf]: National Institute of Standards and Technology. [Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final). SP 800-218, 2022. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can distinguish an observation from a bounded performance or security quality claim.
- [ ] I can state the system, workload, threat, and evidence boundaries for a decision.
- [ ] I can record a limitation, residual risk, owner, and revision trigger.
- [ ] I can explain why testing output alone does not determine an engineering decision.

## Chapter Navigation

Previous: [Part X overview](../README.md) · Next: [Chapter 2 — Workload, Threat, and Measurement Models](chapter-02-workload-threat-and-measurement-models.md)
