# Chapter 4 — Distributed Tracing and Cross-Service Investigation

## Metadata

| Field | Value |
| --- | --- |
| Part | Part VIII — Observability & Reliability Engineering |
| MQE-BOK domain | Domain 8 — Observability & Reliability |
| Chapter | 4 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–3; service, contract, and asynchronous-boundary fundamentals from Part IV |
| Estimated study time | 185 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A trace can reconstruct part of a path. It cannot prove that every path, state transition, or customer outcome was captured.

## Opening Story

The following is an **illustrative scenario**. A customer’s Atlas Commerce checkout becomes slow after payment authorisation. A trace viewer shows a root `checkout` span, a child `payment` span, and a `fulfilment.publish` span. The trace ends there. The consumer that should initiate fulfilment is absent. A second trace for a successful order includes the consumer span, but its trace identifier has a different parent relationship because work moved through a queue.

It is tempting to conclude that the queue consumer failed. Yet the incomplete trace can also result from a missing propagation header, sampling, an uninstrumented consumer, delayed export, a search that uses the wrong link relationship, or a trace that does not model the asynchronous handoff as a parent-child relationship. The trace is valuable evidence. It is not a complete execution record.

## Why This Chapter Matters

Service-oriented systems distribute a user journey across process, network, queue, and dependency boundaries. A Quality Engineer investigating a cross-service condition needs a way to relate evidence without claiming that correlation alone proves cause. Distributed tracing can provide that relation when its context, coverage, timing, sampling, and semantic boundaries are understood.

This chapter treats traces as an investigation aid. It does not teach a collector, SDK, vendor interface, or complete tracing implementation. It builds from Chapters 2 and 3: logs provide event context, metrics establish population-level change, and traces can help reconstruct selected paths. The next chapter turns those evidence requirements into system design questions.

## Chapter Purpose

To use trace, span, propagation, timing, and sampling information to construct a bounded cross-service investigation while identifying what the trace cannot establish.

## Learning Objectives

By the end of this chapter, you should be able to:

- describe traces, spans, and causal or parent-child relationships at a conceptual level;
- distinguish context propagation from complete tracing coverage;
- assess an asynchronous boundary without forcing an invalid parent-child narrative;
- identify sampling and missing-span limitations;
- correlate traces with logs, metrics, and dependency evidence; and
- create a Cross-Service Investigation Timeline and Coverage Assessment.

## Trace, Span, and Context

A **trace** is a collection of related operations represented for a chosen request, workflow, or causal context. A **span** represents one operation or interval within that trace. A span can carry identifiers, timestamps, attributes, status, events, and a relationship to another span. The usefulness of these terms is not that every system must use a particular format; it is that the investigation can state which operation is represented and how it is related to others.

W3C Trace Context defines an interoperable format for propagating tracing context between services.[^w3c-trace-context] It supports a common way to carry trace identifiers and related state across boundaries. It does **not** define a complete distributed-tracing system, guarantee that every component creates a span, establish business semantics, or prove that an observed relationship is causal. A propagated identifier is a continuity mechanism, not a correctness certificate.

| Element | Investigation value | Boundary |
| --- | --- | --- |
| Trace ID | Groups related observations | Does not prove all relevant operations joined the trace |
| Span | Represents an operation or interval | Depends on accurate naming, timing, and coverage |
| Parent-child relation | Shows an intended nested relationship | May be unsuitable for detached or queued work |
| Link/association | Relates work without asserting direct nesting | Still requires semantic interpretation |
| Context propagation | Carries correlation state between boundaries | May be absent, overwritten, unsafe, or only partially adopted |

### Asynchronous work needs an honest relationship

An HTTP call often has a simple nested request relationship: checkout invokes payment and waits for a response. A queued consumer may process work later, in another process, possibly after retries or batching. Treating every consumer span as a child of the producer can imply a duration or control relationship that did not exist. The important teaching point is not one required relationship type; it is that the trace representation must not manufacture certainty about the workflow.

For an asynchronous handoff, record what is known: producer operation, message or workflow identifier, consumer receipt, consumer completion, and any relationship data. Then correlate with logs and event records. If the consumer is absent, the gap itself is evidence-quality information.

## Sampling and Coverage

Tracing can be sampled to control cost and volume. Sampling is a design choice that changes what an investigator can see. A trace sample that captures common successful requests may miss rare failures; a sample that retains errors may over-represent failures relative to normal traffic. Neither is inherently wrong if the coverage is understood.

Ask four coverage questions:

1. Which services and dependency boundaries create trace evidence?
2. Which paths, outcomes, and traffic populations are sampled or excluded?
3. Does the sampling decision happen before or after relevant outcome information is known?
4. Can an absent span be distinguished from a non-executed operation?

The last question is critical. A missing span can mean no call occurred, instrumentation was absent, propagation failed, sampling removed it, export failed, or the query did not include a related trace. A trace viewer usually cannot answer that by itself.

## Worked Reasoning: The Missing Fulfilment Consumer

The following Atlas Commerce trace fragments are synthetic.

| Time | Span/service | Parent or association | Observation |
| --- | --- | --- | --- |
| 14:03:11.100 | `checkout.submit` | trace `4bf9…` root | Customer request accepted. |
| 14:03:11.145 | `payment.authorise` | child of `checkout.submit` | Provider returns authorised. |
| 14:03:11.392 | `fulfilment.publish` | child of `checkout.submit` | Message publish reports accepted locally. |
| 14:03:11.401 | Queue metric | — | Publish retry rate rises for the region. |
| 14:03:12–14:08 | `fulfilment.consume` | absent from trace `4bf9…` | No consumer span found. |
| 14:06:20 | Dependency status | — | Queue broker reports available. |
| 14:07:05 | Log search | `order_id=ord-220` | No terminal fulfilment event. |

The directly supported facts are limited: the selected trace includes checkout, payment, and local publish spans; a regional publish retry metric rises; the selected query did not find a consumer span or terminal event; the broker status endpoint reported available.

One interpretation is that publish retries prevented delivery. Another is that the consumer is uninstrumented or samples differently. A third is that the message was delivered but used an association or identifier not queried. The broker’s availability provides no direct evidence about this message or the consumer’s processing state.

The evidence gap is trace coverage across the asynchronous boundary. The next decision is not to diagnose a root cause from the missing span. It is to preserve the available identifiers, examine producer acknowledgement and queue/dead-letter evidence, determine consumer instrumentation and sampling policy, and correlate a bounded set of workflow records. The limitation remains: even a complete trace shows an observed path; it may not prove business completion, data correctness, or customer notification.

### Timeline and coverage assessment

An investigation timeline separates facts from interpretation.

| Field | Example |
| --- | --- |
| Question | Did the checkout-to-fulfilment workflow reach its intended terminal state? |
| Observed trace path | Checkout → payment → local fulfilment publish |
| Supporting signals | Regional retry-rate increase; missing terminal event; support contact |
| Competing interpretations | Delivery failure, uninstrumented/sampled consumer, query boundary, delayed processing |
| Coverage gap | Consumer trace and its relationship to the producer are unknown |
| Decision | Hold affected cohort and gather queue, consumer, and terminal-state evidence |
| Limitation | The selected workflow cannot quantify population impact or prove a cause |

## Correlation Is Not Causation

Events with the same trace identifier can be related without one causing the other. A latency rise can begin near a dependency status change without that dependency being the only cause. A later span can follow an earlier span without representing its outcome. These distinctions matter in incidents, where pressure encourages a neat causal story.

Use trace evidence to formulate hypotheses that can be challenged. If a payment span is slow, ask whether the latency appears for the same population in metrics, whether provider evidence agrees, whether retries or queue depth change, and whether the user journey’s later state is affected. The conclusion can be proportionate: “the payment dependency is a plausible contribution to the observed delay; the available evidence does not establish it as the sole cause.”

### A cross-signal investigation matrix

Trace evidence becomes more useful when it is deliberately compared with signals that have different strengths and blind spots. The following matrix is a practical reasoning aid, not a required incident template.

| Investigation question | Trace contribution | Corroborating evidence | Reasoning limit |
| --- | --- | --- | --- |
| Did the selected request reach a dependency? | Client span may show an attempted call and duration | Dependency adapter log and request counter | A recorded attempt may not establish receipt or remote processing |
| Did a dependency delay coincide with user impact? | Span timing identifies selected slow paths | Segment latency distribution and support contacts | Coincidence does not prove that delay caused every outcome |
| Did asynchronous work begin? | Producer span may show a publish attempt | Message acknowledgement/event and queue metric | Local acknowledgement is not consumer completion |
| Did asynchronous work finish? | Consumer or associated span may show terminal processing | Consumer event, terminal state, reconciliation record | Missing coverage can make absence ambiguous |
| Is the condition widespread? | A trace illustrates individual or sampled paths | Metric population and SLI/alert view | A global metric can still hide the trace’s affected cohort |
| Has the system recovered? | New selected paths may appear normal | Backlog age, terminal-state rate, customer outcome evidence | A normal sample does not prove accumulated work is resolved |

The matrix avoids a common analytical mistake: moving from a detailed trace to a broad population statement. A trace can be an excellent explanation of one route taken by one workflow. It is often a poor estimator of frequency. A metric can reveal a population change while omitting the route-level context needed to understand it. Logs can show a reason category but not establish whether every service emitted comparable data. Each signal should challenge the conclusion suggested by the others.

Suppose a trace shows `payment.authorise` took nine seconds for one order. The engineer can make three statements of increasing strength:

1. *This selected trace recorded a nine-second payment span.*
2. *The trace is consistent with payment delay contributing to this order’s checkout experience.*
3. *Payment delay caused the regional checkout incident.*

Only the first is directly established. The second is a bounded interpretation that should be checked against time-aligned segment metrics, dependency outcomes, retry behaviour, and the rest of the workflow. The third requires wider causal evidence and may remain unsupported even after a good investigation. A Quality Engineer adds value by preserving the distinction rather than treating a visually compelling trace as a final explanation.

### Coverage is part of the trace contract

Teams frequently document a trace format but not a coverage expectation. A useful trace contract records which customer-critical boundaries should normally provide evidence, which operations are intentionally not traced, how sampling differs by path, and how a later investigator can recognise a change in coverage. This is especially important after a deployment, SDK update, collector change, or privacy policy revision.

For Atlas Commerce, a minimal contract might say that checkout acceptance, payment attempt/outcome, fulfilment publish, consumer receipt, terminal fulfilment state, and confirmation dispatch each have a documented evidence boundary. It does not require a span for every internal function. It lets the team detect that the consumer instrumentation changed at 13:05 and prevents an absent span from being silently reinterpreted as a business failure.

Coverage itself can be tested. Use controlled success, timeout, retry, and asynchronous scenarios to ask whether expected spans or associated events are visible; whether context survives a queue or callback; whether sampling makes an error path discoverable; and whether a deliberately absent component produces an explicit coverage signal rather than a misleading empty result. This is a testability and observability feedback loop, not an SDK compliance exercise.

## Engineering Perspective

Trace design should begin with a journey or decision question. Which boundaries must be visible to assess an outcome? What identifiers can be propagated safely? Which asynchronous paths need association rather than nested timing? What sampling and retention limitations need to be visible to investigators? What sensitive attributes must not enter spans?

Testing can expose trace-quality faults. A contract or integration test can check that a request carries expected context at a boundary. A controlled asynchronous failure can show whether producer, consumer, and terminal evidence can be correlated. A failure-path test can reveal that an error is recorded only in a local span while the user-facing outcome remains unknown. The objective is evidence design, not a tool compliance test.

## Industry Perspective

W3C Trace Context is the primary specification for the propagation concept used here.[^w3c-trace-context] OpenTelemetry provides a widely used ecosystem for trace concepts and instrumentation.[^otel-traces] Both inform transferable vocabulary. They do not mandate a platform, guarantee cross-service coverage, or replace application-level outcome semantics.

## Common Misconceptions and Pitfalls

### “A trace is a complete request history”

Coverage can be limited by propagation, instrumentation, sampling, export, retention, and query relationships.

### “A child span proves the parent caused the outcome”

It represents a chosen relationship model. Causation and business effect need additional evidence.

### “Missing span means missing call”

Absence is ambiguous until sampling and instrumentation coverage are known.

### “Tracing replaces logs and metrics”

Traces provide path detail. Logs and events provide local context; metrics show population-level patterns. Investigation is stronger when the signals challenge one another.

## QA → QE Transition

Testing often follows a request through expected integrations. Quality Engineering extends that path into operation: it asks whether relevant context survives real boundaries, whether an investigator can see missing coverage, and whether trace information can support a bounded customer-impact decision. The Quality Engineer becomes a steward of diagnosability, not merely a consumer of trace screenshots.

## Summary

Traces and spans can reconstruct useful cross-service paths, but their value depends on relationship semantics, propagation, sampling, coverage, and correlation with other evidence. W3C Trace Context supports propagation, not complete tracing or correctness proof. An honest investigation names missing coverage and maintains competing explanations until evidence supports a narrower conclusion.

## Key Takeaways

- A trace is selected evidence about a path, not a complete system history.
- Context propagation supports correlation but does not guarantee coverage or business correctness.
- Asynchronous work needs relationship semantics that do not invent a nested execution story.
- Sampling and missing spans are evidence limitations that should be visible to investigators.
- Correlation supports a hypothesis; it does not prove root cause.

## Review Questions

1. What does W3C Trace Context define, and what does it not define?
2. Why is a queued consumer not always a simple child of its producer span?
3. List four reasons a consumer span might be absent.
4. How should an investigator use a trace with a rising retry metric?
5. What additional evidence would strengthen the Atlas conclusion?

## Interview Questions

1. How would you review trace coverage for a new asynchronous workflow?
2. What would make you distrust a root-cause claim based on a single trace?
3. How can testing improve distributed-tracing quality?

## Practical Exercise

Create a **Cross-Service Investigation Timeline and Coverage Assessment** for the Atlas Commerce fragments. Identify direct facts, relationships, missing spans, sampling questions, two competing explanations, the next evidence request, and the boundary of the resulting reliability claim.

## Further Reading

- [W3C Trace Context](https://www.w3.org/TR/trace-context/)
- [OpenTelemetry: Traces](https://opentelemetry.io/docs/concepts/signals/traces/)
- [OpenTelemetry: Context propagation](https://opentelemetry.io/docs/concepts/context-propagation/)

## References

[^w3c-trace-context]: W3C. [Trace Context](https://www.w3.org/TR/trace-context/). Accessed 2026-08-12.

[^otel-traces]: OpenTelemetry. [Traces](https://opentelemetry.io/docs/concepts/signals/traces/). Accessed 2026-08-12.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish trace context propagation from tracing coverage;
- [ ] explain a span relationship without overclaiming causation;
- [ ] identify sampling and missing-span limitations;
- [ ] correlate traces with logs, metrics, and dependency evidence; and
- [ ] produce a bounded investigation timeline with competing explanations.
