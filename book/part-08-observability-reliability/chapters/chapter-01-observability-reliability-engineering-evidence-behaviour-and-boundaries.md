# Chapter 1 — Observability & Reliability Engineering: Evidence, Behaviour, and Boundaries

## Metadata

| Field | Value |
| --- | --- |
| Part | Part VIII — Observability & Reliability Engineering |
| MQE-BOK domain | Domain 8 — Observability & Reliability |
| Chapter | 1 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Parts I, III, VI, and VII; systems thinking, testing as evidence, and delivery-system fundamentals |
| Estimated study time | 160 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A signal is an observation. It becomes evidence for a decision only when its context, limits, and relationship to the claimed outcome are understood.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce reports that its checkout service is available. Its synthetic availability check receives HTTP `200` responses, the deployment is stable, and the operations overview shows no critical alert. Later that morning, customer support reports that several customers paid for an order but did not receive a fulfilment confirmation.

The first response is predictable: inspect the logs. A payment service entry says `payment accepted`; the checkout service records `order submitted`; and the fulfilment service has no matching completion event. The teams now face several plausible explanations. A fulfilment request may never have been sent. It may have been sent with a correlation identifier that was lost at an asynchronous boundary. The event may have been delayed, sampled out of a trace, or retained in another system. A customer may have received a confirmation through a path the current search does not cover.

None of those explanations follows automatically from the green availability indicator. The immediate engineering question is not “which dashboard is wrong?” It is: *what behaviour is known, what remains uncertain, what reliability outcome may be affected, and which decision can the available evidence support?*

This part develops that question into an engineering practice. It does not require a particular observability product, an SRE organisational model, or production access. It teaches the Quality Engineer to design and interpret operational evidence without claiming more certainty than the system can provide.

## Why This Chapter Matters

Testing is necessary evidence, but it is selected evidence. A test exercises a chosen condition, with chosen data, environment, timing, and observation points. After release, a system encounters real traffic distributions, dependencies, partial failures, configuration combinations, and timing relationships that the team may not have represented completely before release. Runtime evidence does not replace testing; it extends the feedback system into operation.

Traditional QA work can unintentionally stop at a narrow question: “did the agreed scenario pass?” Quality Engineering adds questions about the feedback mechanism itself. Can the system reveal relevant state when a scenario fails? Can a team distinguish a user outcome from an internal response? Can it recognise a gap in telemetry before that gap becomes an unsupported incident conclusion? Can it make a proportionate decision while uncertainty remains?

Part VII asks whether deployment or promotion should proceed based on delivery evidence. Part VIII begins once a system is operating and asks what signals reveal its behaviour, degradation, recovery, and reliability over time. Part VI remains responsible for broad data-quality engineering. This part uses telemetry as operational evidence and examines whether that evidence is fit for a stated reliability decision.

## Chapter Purpose

To define Observability & Reliability Engineering as the disciplined design, interpretation, and improvement of operational evidence for user-relevant service decisions.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish a signal, an evidence claim, an interpretation, and an engineering decision;
- explain the overlap and difference between monitoring and observability without relying on simplistic slogans;
- distinguish observability capabilities from reliability outcomes;
- identify a bounded system and user-outcome boundary for an operational question;
- state what an availability observation can and cannot establish; and
- create an Operational Evidence Boundary Map for a fictional service condition.

## Operational Evidence Is Not a Dashboard Colour

An operational signal is a recorded observation about a system or its context. A log entry, counter, latency distribution, trace span, dependency status, support contact, and queue-depth measurement can all be signals. They differ in scope, timeliness, semantics, cost, and trustworthiness.

An evidence claim connects one or more signals to a decision-relevant statement. For example, “checkout availability was 99.95% in the stated window” may be a supported measurement claim if the population, numerator, denominator, source, and window are defined. “Customers can complete checkout reliably” is a wider claim. It includes a user journey and may involve latency, payment acceptance, inventory correctness, confirmation, fulfilment initiation, and recovery from partial failure. The first claim can support part of the second; it cannot silently become the second.

This distinction is useful because it separates four things that are often compressed into a status update:

| Element | Meaning | Atlas Commerce example |
| --- | --- | --- |
| Observation | What was directly recorded | The availability probe received HTTP `200` responses. |
| Evidence claim | What the observation supports within stated conditions | The endpoint responded successfully to the probe from the recorded location and window. |
| Interpretation | A plausible explanation of a wider condition | Checkout may be healthy for the sampled request path. |
| Decision | An action taken with explicit uncertainty | Keep the service available, investigate fulfilment correlation, and do not claim end-to-end recovery yet. |

The **Operational Evidence Model** used in this part is an original MSQE teaching model, not a standard:

```text
System condition or user outcome
        ↓
Intentional signals and contextual evidence
        ↓
Correlation and interpretation
        ↓
Bounded claim with limitations
        ↓
Decision, recovery check, and learning
```

Each transition can lose information. An event may not be emitted. A metric may aggregate unlike populations. A trace may be sampled. A recorded success may precede downstream completion. A decision can still be appropriate, but only if the gap is visible.

### Monitoring and observability overlap

Monitoring commonly evaluates known conditions: an error rate exceeds a threshold, a dependency is unavailable, a queue grows, or a latency measure changes. It is valuable because teams can define expected conditions and respond quickly when they are breached.

Observability concerns the extent to which available evidence allows engineers to investigate and understand relevant system behaviour, including behaviour that was not anticipated by a predefined check. It includes the quality of the signals, their context, their relationship across boundaries, and the limits of an investigation.

The difference is not “monitoring tells you what is wrong; observability tells you why.” Monitoring can provide rich diagnostic information, and an observability system can still fail to explain a condition. Both operate through incomplete observations. Both can be designed poorly. Neither proves correctness or root cause merely because it emits data.

A more useful comparison is:

| Question | Monitoring often contributes | Observability adds |
| --- | --- | --- |
| Is a known condition outside its expected range? | A signal, threshold, or health check | The context needed to understand who is affected and what the signal represents |
| Is a customer journey behaving acceptably? | A selected availability or latency measure | Correlated evidence across the journey and explicit gaps in coverage |
| What should the team do next? | Alert or status information | A bounded claim, competing explanations, limitations, and decision owner |

## Observability and Reliability Are Related, Not Synonyms

**Observability** is an engineering capability: the system and its surrounding operational practices make useful evidence available for understanding relevant behaviour. **Reliability** is an outcome-oriented concern: the system continues to provide acceptable, user-relevant service under the conditions that matter.

A service can be observable and unreliable. Clear traces may reveal a recurring dependency timeout that still harms users. A service can appear reliable while being weakly observable. A simple availability probe may pass while stale data, delayed fulfilment, or an unmeasured population causes customer harm. The second condition is especially dangerous because it can create confidence without evidence.

ISO/IEC 25010:2023 provides a product-quality model that includes reliability as a product quality characteristic.[^iso-25010] This chapter does not treat observability, testability, alert quality, or recovery evidence as additional ISO characteristics. They are engineering capabilities and practices that help a team assess and improve product outcomes.

Reliability must be contextual. Consider three statements:

1. “The checkout endpoint responded to the probe.”
2. “The checkout endpoint was available for the defined request population.”
3. “Customers could complete the intended checkout-to-fulfilment journey acceptably during the stated period.”

Each statement is broader than the previous one. The evidence for the first may be a single synthetic transaction. The second requires a defined population and measurement. The third requires outcome semantics and possibly evidence beyond the HTTP boundary. An engineer should choose the narrowest claim that the evidence can support, then state what would be needed to strengthen it.

### Boundaries make claims useful

Every operational question has at least four boundaries:

- **System boundary:** which components, dependencies, and asynchronous paths are in scope?
- **Outcome boundary:** which user-relevant result is being assessed?
- **Population and time boundary:** which users, requests, region, traffic type, and period does the claim cover?
- **Evidence boundary:** which observations are available, trustworthy, retained, and correlated?

Without those boundaries, “the service is healthy” cannot be challenged constructively. With them, a team can decide whether the available evidence is proportionate to the decision. A feature flag rollout for one region may need a different evidence boundary from an incident involving payments across all regions.

## Worked Reasoning: The Healthy Endpoint and the Missing Outcome

The following evidence is fictional and intentionally incomplete.

| Time (UTC) | Source | Observation |
| --- | --- | --- |
| 09:00–09:15 | Availability probe | 900 of 900 requests to `POST /checkout` received HTTP `200`. |
| 09:07 | Checkout log | `checkout.accepted`, `request_id=req-71`, `order_id=ord-814`, `status=accepted`. |
| 09:07 | Payment event | `payment.authorised`, `order_id=ord-814`, `payment_id=pay-9001`; no `request_id`. |
| 09:08 | Fulfilment event store | No completion event for `ord-814` by 09:15. |
| 09:12 | Support record | Customer reports payment accepted but no confirmation message. |
| 09:14 | Dependency status | Fulfilment broker reports available. |

The facts are limited. The endpoint responded to the probe. Checkout recorded an acceptance event. A payment event exists for the order. The queried fulfilment store has no completion event in the observed interval. A customer reported a missing confirmation. The broker status endpoint reported available.

Several interpretations remain plausible:

- the checkout service did not publish the fulfilment request;
- it published the request with an identifier not captured by the event query;
- the broker accepted the message but delivery was delayed;
- the fulfilment event exists in a partition or retention path not searched; or
- confirmation was delayed for a reason independent of fulfilment completion.

The evidence gap is not merely “we need more logs.” The team lacks a stable correlation path from checkout acceptance through payment, message publication, fulfilment processing, and customer confirmation. It also lacks a defined time objective for this outcome. The broker’s availability does not establish that the specific message was delivered or processed.

A proportionate decision is to maintain the current exposure, classify the condition as a possible customer-outcome degradation, and assign investigation ownership. The next evidence request is specific: recover or establish correlation for the affected order; check publication, queue, consumer, and confirmation records; and record whether the selected sample represents a wider population. The limitation must remain visible: even if this order is explained, the investigation may not establish the rate of the condition or its impact on other customers.

This reasoning is not an incident-management procedure. It is a way to prevent an endpoint-health signal, a log statement, and a dependency health check from being mistaken for proof of end-to-end reliability.

## Designing for Questions, Not Data Volume

Collecting every possible field is not observability. Excess data can be expensive, unsafe, difficult to interpret, and still fail to answer the relevant question. A Quality Engineer can improve the feedback system by asking before instrumentation or review:

1. What user or system condition must we be able to assess?
2. Which state transition would show that the condition occurred?
3. What context is needed to relate that transition to a request, journey, dependency, or population?
4. What information must not be recorded because it is sensitive or unnecessary?
5. How can the team recognise missing, delayed, duplicated, or contradictory evidence?
6. Which decision becomes possible if the evidence is present, and who owns it?

This question-led approach is central to QA → QE progression. A test finding can reveal that an asynchronous completion is invisible, that an error message lacks a meaningful category, or that an identifier is lost between services. Those are not merely test-report defects. They are opportunities to improve the system’s operational diagnosability. Conversely, runtime evidence can reveal a traffic segment, timing condition, or dependency interaction that should influence future testing.

## Engineering Perspective

Operational evidence has interfaces and failure modes like any other system. Event schemas change. Timestamps may be clock-dependent. Trace coverage may differ by service. Metric labels can make important populations invisible or create excessive cardinality. Data can arrive late, be sampled, be transformed, or expire before an investigation starts. The engineering goal is not perfect omniscience; it is sufficient, safe, and interpretable evidence for the decisions the service requires.

Quality Engineers contribute by making the decision path inspectable. They can challenge a vague health claim, identify a user outcome that has no evidence path, include diagnosability in acceptance discussions, test whether failure evidence appears as intended, and document limits instead of papering over them. They do not need to own production tooling to perform this work.

## Industry Perspective

OpenTelemetry documents logs, metrics, and traces as core telemetry signals and provides a common conceptual ecosystem for them.[^otel-signals] It is useful vocabulary, not a mandatory implementation choice. The Google SRE literature describes monitoring as a way to make a service’s state visible and discusses the importance of choosing signals that support actionable response.[^google-monitoring] These are influential practitioner resources, not universal standards or a required SRE operating model.

## Common Misconceptions and Pitfalls

### “A green availability check proves the service is reliable”

It proves only the health condition and population that the check represents. A customer outcome may include unobserved downstream work, freshness, latency, correctness, and recovery.

### “More telemetry always produces more certainty”

More telemetry can create noise, cost, privacy exposure, and contradictory interpretations. Evidence quality depends on semantics, context, coverage, and decision relevance.

### “Observability is owned by operations”

Operational teams may own platforms or response processes, but evidence quality is a shared engineering concern. Product, development, test, data, and dependency decisions all affect what can be known in operation.

### “A correlation identifier proves causation”

An identifier can connect records associated with a request or workflow. It does not establish that one observed event caused another, that every path was captured, or that the business outcome occurred.

## QA → QE Transition

The QA-oriented question is: *did the selected scenario behave as expected?* The Quality Engineering question is: *what evidence will reveal whether the user-relevant outcome continues to behave acceptably in operation, what can that evidence support, and how will it improve future engineering decisions?*

This is an expansion of responsibility, not a rejection of testing. Testing supplies carefully controlled evidence. Observability supplies runtime evidence. Quality Engineering connects both, identifies their blind spots, and avoids making a claim that either source cannot support alone.

## Summary

Observability & Reliability Engineering is evidence engineering for operating systems. Signals become useful only when their context, coverage, semantics, and limitations are visible. Monitoring and observability overlap; neither is a guarantee. Observability is a capability to investigate behaviour, while reliability concerns acceptable user-relevant outcomes over time.

The Atlas Commerce scenario demonstrated why an available endpoint, a logged success, and an available dependency can coexist with an uncertain customer outcome. Later chapters examine the quality of logs and events, metrics, traces, observable design, service objectives, alerts, resilience, recovery, and operational learning.

## Key Takeaways

- A recorded signal is not automatically evidence for a broad reliability claim.
- Monitoring and observability overlap; avoid reducing them to a simplistic what/why distinction.
- Reliability is more than uptime and must name a user outcome, conditions, and evidence boundary.
- Observability and testability are engineering capabilities, not ISO/IEC 25010 product quality characteristics.
- A useful operational decision states facts, interpretations, gaps, limitations, ownership, and revision triggers.

## Review Questions

1. What is the difference between an observation, an evidence claim, an interpretation, and a decision?
2. Why can a successful HTTP response coexist with an unacceptable customer outcome?
3. How do monitoring and observability overlap?
4. Which four boundaries should a reliability claim state?
5. Why is a correlation identifier useful but insufficient for a causal conclusion?

## Interview Questions

1. How would you explain observability to a team that believes logging is sufficient?
2. A dashboard is green but customers report failures. What would you ask before declaring either source incorrect?
3. How can a Quality Engineer improve observability without owning a monitoring platform?

## Practical Exercise

Create an **Operational Evidence Boundary Map** for the Atlas Commerce scenario or a familiar fictional service. Include:

- one user-relevant outcome;
- system, population, time, and evidence boundaries;
- three directly observed facts;
- two competing interpretations;
- one material evidence gap;
- a proportionate next decision and owner; and
- one revision trigger that would change the decision.

Do not use real customer data. This is a manuscript exercise; no standalone lab is required.

## Further Reading

- [OpenTelemetry observability primer](https://opentelemetry.io/docs/concepts/observability-primer/)
- [Google SRE Book: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)
- [ISO/IEC 25010:2023 product quality model](https://www.iso.org/standard/78176.html)

## References

[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). 2023. Accessed 2026-08-12.

[^otel-signals]: OpenTelemetry. [Signals](https://opentelemetry.io/docs/concepts/signals/). Accessed 2026-08-12.

[^google-monitoring]: Beyer, Betsy, et al. [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/). *Site Reliability Engineering*. Google. Accessed 2026-08-12.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish an operational observation from a reliability claim;
- [ ] state what an availability signal does and does not establish;
- [ ] describe monitoring and observability without a misleading slogan;
- [ ] define a system, outcome, population, time, and evidence boundary; and
- [ ] write a bounded next decision that names uncertainty and ownership.
