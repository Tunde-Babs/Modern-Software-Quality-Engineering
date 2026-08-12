# Chapter 2 — Telemetry Quality: Logs, Events, and Context

## Metadata

| Field | Value |
| --- | --- |
| Part | Part VIII — Observability & Reliability Engineering |
| MQE-BOK domain | Domain 8 — Observability & Reliability |
| Chapter | 2 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapter 1; basic understanding of service interactions and asynchronous processing |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A log can record that a component emitted a message. It does not, by itself, prove that a customer outcome occurred.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce receives a checkout request at 10:14:02 UTC. The application log contains `checkout.completed` with severity `INFO`. A payment event reports authorisation. Five minutes later, the customer has no order-confirmation message and the fulfilment system has no completion record.

The first log looks reassuring. It is also ambiguous. “Completed” might mean that checkout accepted the request, that the payment provider replied, that a message was written to a local queue, or that the entire business workflow reached its intended state. The field names do not say. The checkout record has `request_id=req-428`; the payment record has `payment_id=pay-812` and `order_id=ord-220`; the fulfilment query uses `order_id`, but the checkout message omitted it. Its timestamp is also two seconds earlier than the payment event, although the checkout service clock is known to drift.

The useful question is not whether one team wrote a bad log. It is whether the available telemetry can support a safe conclusion about the business outcome, and how the evidence should be improved without exposing sensitive information or filling a production system with undifferentiated data.

## Why This Chapter Matters

Logs and events are often the first evidence a team reaches for. They can contain context that a metric cannot: a state transition, an actor, a correlation identifier, a failure category, a dependency response, or a decision made by a component. They can also be misleading. A success message can be emitted before downstream work completes. An error can be swallowed or reclassified. A duplicate event can resemble a retry. A missing event can mean that nothing happened, that a collector failed, that retention expired, or that the search boundary is wrong.

Quality Engineers need enough telemetry literacy to evaluate the evidence path, not merely to search a tool. This chapter develops a review method for logs and structured events. Chapter 3 turns to aggregate measurement. Chapter 4 adds cross-service tracing. Together, those chapters make it possible to decide when signals corroborate one another and when they share the same blind spot.

## Chapter Purpose

To assess logs and events as operational evidence by examining their semantics, context, timing, completeness, safety, and relationship to a user-relevant outcome.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish a log record, a structured event, and a business outcome;
- identify the contextual fields needed to investigate a cross-service condition;
- assess the limitations of severity, timestamps, and correlation identifiers;
- recognise missing, duplicated, delayed, and contradictory telemetry as evidence-quality risks;
- explain how safe telemetry differs from indiscriminate data capture; and
- create a Telemetry Quality Review for a fictional operational condition.

## What Logs and Events Establish

A **log record** is an observation emitted by a component. It often contains a message, severity, timestamp, source, and optional attributes. A **structured event** expresses a named occurrence with fields intended for consistent processing, such as `payment.authorised` or `fulfilment.completed`. The distinction is practical, not absolute: a structured log may represent an event, and an event stream may be rendered as logs.

Neither form automatically represents a business outcome. Consider the following progression:

| Statement | What it could establish | What it does not establish |
| --- | --- | --- |
| `checkout.request.accepted` was emitted | A component accepted a request under its local definition | Payment, order persistence, fulfilment, or customer confirmation |
| `payment.authorised` was emitted | A payment provider or adapter reported an authorisation outcome | Order fulfilment or the absence of later reversal |
| `fulfilment.completed` was emitted | A fulfilment component recorded its completion condition | That the customer received the intended external effect, unless the event semantics include that boundary |
| `customer.confirmation.delivered` was emitted | A delivery component recorded a delivery condition | That a customer read or understood the message |

The goal is not to demand an event for every conceivable state. It is to make event meaning explicit enough for the decisions the team needs to make. Terms such as *success*, *complete*, *processed*, and *failed* must be bound to a defined component and state transition. Without that boundary, the message can be technically true and operationally misleading.

### A minimum context model

The exact fields depend on the system and privacy constraints, but a useful telemetry review asks whether an event has enough context to answer these questions:

| Context question | Example evidence |
| --- | --- |
| What happened? | Stable event name and versioned or documented semantics |
| Where did it happen? | Service/component identity, deployment or environment context when safe |
| When did it happen? | Timestamp, clock assumptions, and ordering boundary |
| Which workflow is it associated with? | Request, trace, order, or workflow correlation identifier |
| What state changed? | Outcome category, dependency result, or transition name |
| Who or what is affected? | Safe, non-sensitive population or journey attributes |
| What can be correlated? | Identifier relationships across services and asynchronous boundaries |

Context is not an invitation to collect private data. A customer name, card number, session token, authentication credential, raw address, or unrestricted payload may be unnecessary and unsafe. A safe design records the minimum information needed for the stated diagnostic or reliability question, applies appropriate access and retention controls, and tests that redaction and omission behave as intended.

## Semantics Before Severity

Severity can help a person scan a stream, but it is a weak substitute for event semantics. One service might use `ERROR` for a retryable provider response; another might log the same condition at `WARN`; a third might log only a final failure. Those choices can be reasonable locally, yet an operational query based only on severity can mix unlike conditions.

Prefer an explicit outcome and reason category where the decision needs it. For example:

```text
event=fulfilment.dispatch_attempted
outcome=not_confirmed
reason=dependency_timeout
retryable=true
order_id=ord-220
trace_id=4bf92f3577b34da6a3ce929d0e0e4736
```

This is an illustrative field set, not a prescribed schema. It is more useful than `ERROR: dispatch failed` because it names a local action, local outcome, known reason, and correlation opportunity. It still does not prove why the dependency timed out, whether the next attempt will succeed, or whether the customer was harmed. Those claims require corroborating evidence.

### Timing is evidence with assumptions

Timestamps support ordering and duration analysis only within stated assumptions. Component clocks can drift. Events can be buffered, batched, retried, or ingested late. An event timestamp may represent occurrence time, emission time, collection time, or storage time. If a timeline does not distinguish these, it can create a confident but incorrect narrative.

For an asynchronous workflow, recording both the producer’s transition and the consumer’s receipt or completion can be more useful than assuming a single timestamp captures the whole handoff. The reader should ask: *does the order in this view represent system behaviour, transport delay, clock behaviour, or an unknown mixture?*

## Worked Reasoning: A Logged Checkout Is Not a Fulfilled Order

The following synthetic records concern one Atlas Commerce order.

| Time | Source | Record |
| --- | --- | --- |
| 10:14:02.118 | Checkout | `INFO checkout.completed request_id=req-428 cart_id=cart-19` |
| 10:14:02.406 | Payment | `payment.authorised payment_id=pay-812 order_id=ord-220 amount=84.00` |
| 10:14:03.021 | Checkout | `event=fulfilment.requested order_id=ord-220 trace_id=7a9...` |
| 10:14:03.028 | Message publisher | `WARN publish_retry event=fulfilment.requested retry=1` |
| 10:14:05.011 | Fulfilment | No record returned for `order_id=ord-220` |
| 10:18:17.900 | Support | “Payment accepted; no confirmation received.” |

The first record uses the word `completed` before the order identifier exists in the same record and before a downstream completion is visible. It is therefore evidence that the checkout component reached *its local completed state*, not evidence that the business workflow completed. The event at 10:14:03 supplies an order and trace identifier, but the publisher warning indicates a possible publication problem. The absence of a fulfilment record is a meaningful observation, but it could reflect delay, a different correlation key, retention, query scope, or an uninstrumented consumer path.

The competing explanations are:

1. the publish retry did not complete and fulfilment never received the request;
2. fulfilment received the request but emitted no searchable record;
3. fulfilment completed late, and the current query window is too short; or
4. confirmation delivery failed after fulfilment, which the selected evidence cannot see.

The evidence gap is specific: the system lacks a correlated publication acknowledgment and a consumer-side state transition that can be related safely to the same workflow. The decision should not be “rename the log.” A proportionate action is to change the local event name to represent its actual boundary, preserve correlation through the publish/consume path, and introduce an outcome record for the workflow state that the team needs to assess. The limitation is equally important: adding a record does not guarantee every event will arrive, be retained, or be safe to access.

### A telemetry-quality review

Use a review that makes quality risks visible rather than treating them as incidental logging defects.

| Review dimension | Question | Atlas finding | Improvement direction |
| --- | --- | --- |
| Meaning | Does the name describe a bounded state? | `checkout.completed` is broader than the local condition. | Rename or document the local transition. |
| Correlation | Can the evidence follow the workflow? | `request_id` and `order_id` are separated; consumer evidence is absent. | Carry safe workflow context across boundaries. |
| Time | Can ordering be interpreted? | Clocks and event/ingestion times are unspecified. | Record consistent occurrence semantics and known time limits. |
| Completeness | What expected record is absent? | No fulfilment completion or failure record is visible. | Instrument consumer receipt and terminal states. |
| Duplication | Could a retry look like two business outcomes? | A publish retry exists, but no outcome shows whether the operation is **idempotent**—whether repeating it produces additional unintended effects beyond its defined result. | Record attempt and deduplicated business-state semantics. |
| Safety | Does the record contain only needed information? | Amount may be needed; payment credentials are not. | Define a minimal safe field set and access boundary. |

## Missing, Duplicated, Delayed, and Incorrect Telemetry

Telemetry has its own failure modes. Treat them as inputs to the confidence of an operational conclusion.

- **Missing telemetry** may mean a state did not occur, instrumentation did not execute, collection failed, sampling excluded the record, retention expired, or the query omitted the relevant path.
- **Duplicated telemetry** may be caused by retries, at-least-once delivery, replay, or a component emitting the same transition twice. It can overstate error volume or falsely suggest duplicate customer actions.
- **Delayed telemetry** can make a current view look incomplete. The delay may occur at emission, buffering, transport, ingestion, indexing, or query time.
- **Incorrect telemetry** includes wrong field values, inconsistent units, misleading names, inaccurate timestamps, stale deployment context, and event semantics that diverge from actual code behaviour.

The correct response differs by condition. A missing consumer event may require coverage investigation; a duplicate record may require idempotency analysis; a delayed record may require a freshness boundary. All should reduce confidence in a conclusion that assumes complete, current, one-to-one evidence.

## Engineering Perspective

Telemetry design belongs in quality and design conversations because it changes what future engineers can know. Useful instrumentation begins with a decision-relevant question, a defined state transition, correlation requirements, and safety constraints. It is then validated like other behaviour: exercise a success path, an expected failure path, retries, asynchronous handoffs, malformed context, and intentional absence where appropriate.

This is not a requirement to build a logging platform. It is a requirement to avoid designing an opaque workflow and later treating a phrase in a log as proof. A Quality Engineer can ask whether acceptance criteria include diagnostic evidence, whether test data can be correlated safely, and whether a reported success names the same boundary as the user outcome.

## Industry Perspective

OpenTelemetry documents logs as one of its telemetry signals and provides conceptual guidance for correlating signal types.[^otel-logs] The project is a reference ecosystem, not a required SDK or schema. Its terminology is useful when a team wants common signal concepts, but an implementation must still define its own safe semantics and evidence boundaries.

## Common Misconceptions and Pitfalls

### “INFO means successful and ERROR means failed”

Severity is a local classification. It cannot reliably substitute for an explicit operation, outcome, reason, and scope.

### “No log means nothing happened”

Absence is ambiguous until coverage, collection, retention, and query boundaries are known.

### “Add every identifier and payload field”

This can increase privacy, security, cost, and interpretability risks. Record the minimum safe context required for a decision.

### “A complete trace ID in a log proves the workflow is complete”

It provides a correlation opportunity. Missing spans, asynchronous paths, sampling, and semantics can still limit the conclusion.

## QA → QE Transition

The QA-oriented response to an ambiguous failure is often to collect more screenshots, logs, and reproduction steps after the fact. The Quality Engineering response asks whether the system deliberately exposes safe, correlated, decision-relevant evidence before the failure occurs. It turns a diagnostic frustration into an engineering improvement: clearer state boundaries, explicit event semantics, safer context, and testable evidence paths.

## Summary

Logs and structured events are powerful evidence because they can represent local state and contextual detail. Their value depends on semantics, correlation, timing, completeness, and safety. A logged success is evidence of a bounded local observation, not proof of an end-to-end business outcome.

The next chapter examines metrics, where aggregation can hide the individual conditions that logs and events make visible.

## Key Takeaways

- Name the local state a log or event represents; do not let broad words such as “complete” silently expand its meaning.
- Correlation identifiers support investigation but do not establish causation or outcome completion.
- Timestamps require occurrence, collection, and clock assumptions to be interpretable.
- Missing, delayed, duplicated, and incorrect telemetry are evidence-quality risks.
- Safe telemetry captures enough context for a decision without exposing unnecessary sensitive information.

## Review Questions

1. Why is `checkout.completed` potentially misleading in the Atlas scenario?
2. Which contextual fields are most important for an asynchronous workflow, and why?
3. What are three explanations for a missing event?
4. How can duplicate telemetry distort a reliability conclusion?
5. Why should a timestamp’s meaning be stated?

## Interview Questions

1. How would you review logging requirements for a new payment workflow?
2. What evidence would make you challenge a team’s claim that an error was transient and harmless?
3. How do you balance diagnostic detail with sensitive-information risk?

## Practical Exercise

Create a **Telemetry Quality Review** for the Atlas Commerce records in this chapter. State the intended user outcome, event semantics, available correlations, timing assumptions, missing evidence, safety concerns, and the smallest improvement that would strengthen the next decision. Label each statement as fact, interpretation, or recommendation.

## Further Reading

- [OpenTelemetry: Signals](https://opentelemetry.io/docs/concepts/signals/)
- [OpenTelemetry: Logs](https://opentelemetry.io/docs/concepts/signals/logs/)
- [W3C Trace Context](https://www.w3.org/TR/trace-context/)

## References

[^otel-logs]: OpenTelemetry. [Logs](https://opentelemetry.io/docs/concepts/signals/logs/). Accessed 2026-08-12.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish a local event from a business outcome;
- [ ] identify a missing or unsafe correlation boundary;
- [ ] explain why severity and timestamps have limits;
- [ ] classify a telemetry gap as missing, duplicated, delayed, or incorrect; and
- [ ] recommend a proportionate, safe telemetry improvement.
