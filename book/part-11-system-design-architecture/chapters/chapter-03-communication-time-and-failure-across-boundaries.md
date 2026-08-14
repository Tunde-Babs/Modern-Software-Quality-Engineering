# Chapter 3 — Communication, Time, and Failure Across Boundaries

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 3 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2; Part IV asynchronous and API-boundary fundamentals |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A request that does not return has not told you that it failed. It has told you nothing. Designing for "nothing" is the difference between a system that can be recovered and a system that can only be apologised for.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

Atlas checkout calls its third-party payment provider synchronously. The client timeout is five seconds. The retry policy, added a year ago to improve success rates during brief network blips, allows two retries.

During a promotion, the provider's median response time rises from 180 ms to just over four seconds. Most calls now exceed the timeout. The retry policy does what it was told to do: each checkout attempt becomes up to three payment attempts.

Here is what the provider sees. It receives every attempt. It processes many of them successfully — the provider is slow, not broken. It authorises the card, records the transaction, and returns a response that arrives after Atlas has already given up and moved on.

Here is what Atlas sees: a timeout. Its code treats the timeout as a failure, marks the order `PAYMENT_FAILED`, and shows the customer an apologetic message suggesting they try again. Some customers do. Some customers now have three authorisations on one card for one basket.

The next morning, support has a queue of customers asking whether they have been charged. Atlas cannot answer. It holds no record of a successful payment, because it never received one. It holds no record of an *attempted* payment that might have succeeded, because a timeout was modelled as a failure rather than as an unknown outcome. The only party that knows what happened is the provider, and the only way to ask is a reconciliation query nobody built.

Every individual decision here was defensible. Five seconds is a reasonable timeout. Retrying transient failures is reasonable. Reporting a failure to the customer rather than hanging is reasonable. The architecture failure is in the seam between them: a timeout is not a failure, and a system that cannot represent "unknown" will lie.

## Why This Chapter Matters

Chapter 2 mapped where boundaries fall. This chapter is about what happens when something crosses one.

The moment a call crosses a process boundary, three properties appear that did not exist for an in-process function call. It takes measurable time. It can fail independently of its caller. And it can fail in a way that gives the caller no information — which is a genuinely different outcome from success or failure, and the one most systems are least equipped to represent.

Communication choice is therefore an architectural decision about time, availability, feedback, failure, and evidence — not a technology preference. Choosing synchronous request/response is choosing to make the caller's availability depend on the callee's. Choosing asynchronous messaging is choosing to accept ordering, duplication, and delayed-visibility concerns in exchange for that independence. Neither is free, and the trade is decided by which failure you can afford and what you can truthfully tell a customer.

This chapter stays within its scope. It does not configure brokers, teach a streaming platform, repeat Part IV's protocol curriculum, or implement Part VIII's telemetry. It supplies the interaction assumptions that Chapter 4 (state and consistency), Chapter 5 (styles), and Chapter 11 (integrated decisions) build on.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish request/response, command, event, queue, callback, polling, and stream interactions by what each commits the caller to;
- explain temporal coupling and its consequences for availability and latency;
- define idempotency precisely and distinguish delivery guarantees from business effects;
- reason about timeout, retry, ordering, duplicate delivery, backpressure, and unknown outcome as design conditions rather than incidents;
- perform and critique bounded numerical reasoning about latency, fan-out, retry amplification, and backlog, stating assumptions, units, and limitations; and
- produce an Interaction, Time, and Failure Analysis for a synthetic Atlas Commerce decision.

## Interaction Forms and What They Commit You To

The useful classification is not by technology but by what the caller commits to.

| Form | The caller… | Gains | Accepts |
| --- | --- | --- | --- |
| **Request/response (synchronous)** | waits for the answer before proceeding | An immediate, authoritative outcome it can report | Temporal coupling; callee latency and availability become its own |
| **Command (asynchronous)** | sends an instruction and does not wait | Independence from callee availability | No immediate outcome; must model in-flight state |
| **Event** | announces that something happened, to unknown consumers | Decoupling from consumers entirely | No knowledge of who acted, when, or whether |
| **Queue** | hands work to a durable buffer | Absorption of demand spikes and callee downtime | Backlog, delayed visibility, ordering questions |
| **Callback / webhook** | supplies an address to be called back | Immediate notification without holding a connection | An inbound trust boundary; delivery failure handling |
| **Polling** | asks repeatedly until state changes | Simplicity; no inbound endpoint | Wasted work; latency bounded by the poll interval |
| **Stream** | consumes an ordered, replayable sequence | Ordering within a partition; replay | Consumer position management; partition-scoped ordering only |

Two distinctions inside this table matter more than the rest.

**Command versus event.** A command names an intended effect and usually has one intended handler: *charge this payment*. An event states a fact about the past and has zero or more consumers: *payment was authorised*. Confusing them produces a specific architecture defect — an "event" that actually requires a particular consumer to act, which is a command with the accountability removed. If the publisher cares whether someone handled it, it is not an event.

**Queue versus stream.** A queue distributes work items, typically consumed once, and ordering is usually incidental. A stream is an ordered log that consumers read at their own position and can replay. Choosing a stream because it is fashionable, then treating it as a queue, produces surprise when a consumer's position resets and reprocesses a week of history.

## Temporal Coupling, Latency, and Availability

**Temporal coupling** exists when two components must be available at the same moment for work to complete. Synchronous request/response creates it by definition; asynchronous forms exist largely to remove it.

Its consequences are direct. The caller's **availability** is bounded by the callee's, because it cannot complete without it. The caller's **latency** includes the callee's, plus network time. And the caller's **failure modes** now include the callee's, plus a new one that belongs to neither: the timeout.

This is where the availability arithmetic in the Industry Perspective section belongs — and where it needs handling with care, which is why the numerical section below treats it explicitly rather than as a throwaway multiplication.

The important architectural question is not "how do we avoid temporal coupling?" It is: **does the user outcome genuinely require the answer before we can respond truthfully?** For Atlas checkout, the honest answer is contested. "Your payment succeeded" requires the answer. "We have accepted your order and will confirm payment shortly" does not. The design choice follows from which statement the business is willing to make — which is a product decision as much as a technical one.

## Timeout, Retry, and the Unknown Outcome

A **timeout** is a decision by the caller to stop waiting. It is not information about the callee. After a timeout the caller knows exactly one thing: it did not receive a response within the bound it chose. The request may have been lost in transit, may be queued at the callee, may have been fully processed with the response lost, or may still be executing.

Systems that model only success and failure cannot represent this, and so they guess. Atlas guessed "failed," and the guess was wrong often enough to charge customers for orders that do not exist.

The architectural requirement is a third terminal category: **unknown**, with a defined path out of it. That path is normally one of:

- **Reconciliation** — query the callee for the authoritative outcome, using a caller-generated correlation identifier.
- **Idempotent retry** — repeat the operation in a way that cannot cause a second effect.
- **Compensation** — perform an offsetting action once the true outcome is known.
- **Human resolution** — surface the ambiguity to an operator with enough evidence to resolve it.

Each is a design commitment with a cost. What is not acceptable is having none of them and reporting a guess as a fact.

**Retry** interacts with this badly when it is added without idempotency. A retry after a timeout is, by definition, a retry of an operation whose outcome is unknown. If the operation is not idempotent, the retry may duplicate an effect that already occurred. Atlas's retry policy was safe under its original assumption — brief network blips where the request never arrived — and unsafe under the condition that actually occurred, where the request arrived and was processed slowly. The assumption was never recorded, so it was never revisited.

Retries also need bounds beyond a count: a **budget** (total time across all attempts), **backoff** (increasing delay), and **jitter** (randomised delay to prevent synchronised retry waves). Without backoff and jitter, a dependency recovering from overload is immediately re-overloaded by every client retrying in unison.

## Idempotency, Delivery Guarantees, and Duplicate Effects

**Idempotency** means that performing an operation more than once has no additional intended effect beyond the first successful application. Reading a resource is naturally idempotent. Setting a value to `X` is idempotent. Incrementing a counter is not. Charging a card is not — unless the operation carries a key that lets the receiver recognise a repeat and return the original outcome instead of performing a new one.

That last mechanism is the practical one. An **idempotency key** is a caller-generated identifier for a *business operation*, not a message. The receiver stores the key with the outcome; a second request bearing the same key returns the stored outcome rather than acting again. The critical design details are the key's scope (one key per checkout attempt, not per HTTP request), its retention window, and what the receiver does when the same key arrives with a *different* payload.

Two conflations must be avoided.

**At-least-once delivery is not the same as duplicate business effect.** Delivery guarantees are properties of a transport: at-most-once may lose messages; at-least-once may deliver a message more than once. Whether a duplicate delivery produces a duplicate *effect* is a property of the **handler**, not the transport. An at-least-once transport with an idempotent handler produces one effect. An at-most-once transport with an application-level retry loop can still produce several. Blaming the broker for duplicate charges usually misattributes the defect.

**"Exactly-once" requires careful bounding.** Exactly-once *delivery* across an unreliable network between independently failing endpoints is not achievable in general; a sender that receives no acknowledgement cannot distinguish a lost message from a lost acknowledgement, and must choose between risking loss and risking duplication. What is achievable is **effectively-once processing**: at-least-once delivery combined with idempotent handling or deduplication. That guarantee is real but bounded — it holds only within the deduplication window, only for the scope of the key, and only while the deduplication store is available and consistent. A platform advertising "exactly-once" is describing effectively-once processing under stated conditions. Part XI requires those conditions to be stated whenever the property is claimed.

## Ordering, Duplication, and Backpressure

**Ordering** is not guaranteed by most asynchronous transports except within a defined scope — commonly a partition or a single-consumer queue. A design that requires global ordering across an entire event type is usually requiring something the transport does not provide. The architectural response is either to scope ordering to a key (all events for one order share a partition), or to make handlers order-insensitive by carrying a version or sequence number and ignoring stale updates.

Out-of-order arrival produces a distinctive class of defect: a `SHIPPED` event processed before the `PAID` event it logically follows leaves an order in a state its own state machine considers impossible. Handlers that assume arrival order will either crash or, worse, silently write an incorrect state.

**Backpressure** is the mechanism by which a system under load signals upstream that it cannot accept more work. Without it, a fast producer and a slow consumer produce one of three outcomes: unbounded queue growth until memory or storage is exhausted; silent message loss; or a cascade in which the producer's own resources are consumed by work that will never complete. Bounded queues with explicit rejection, consumer-driven pull, and rate limiting are all forms of backpressure. The architectural point is that **an unbounded queue does not remove the capacity problem; it relocates it and delays the symptom**, usually to a moment when the backlog is large enough to be its own incident.

## Numerical Reasoning About Interactions

The following are **bounded, synthetic worked examples**. Each states context, population, assumptions, units, calculation, interpretation, limitation, and decision relevance. They exist to structure judgement, not to produce precision the evidence cannot support.

### Example 1 — Call-chain latency allocation

| Field | Entry |
| --- | --- |
| Context | Atlas synchronous checkout, server-side path only, single request, calls issued sequentially. |
| Population | Authenticated checkout submissions in a synthetic steady-state window. |
| Assumptions | Calls are strictly sequential (no parallelism); figures are per-call medians in the same window; no retries occur. |
| Units | Milliseconds (ms). |
| Calculation | Edge 8 + session validation 25 + cart/pricing read 40 + payment call 180 + order write 30 + own processing 12 = **295 ms**. Payment share: 180 ÷ 295 = **61.0%**. Substituting a degraded payment median of 4,000 ms: 8 + 25 + 40 + 4,000 + 30 + 12 = **4,115 ms**; payment share 4,000 ÷ 4,115 = **97.2%**. |
| Interpretation | Under healthy conditions the payment dependency dominates but does not monopolise the path. Under the degraded condition, essentially all improvement capacity lies in the payment interaction; optimising any other hop is irrelevant. |
| Limitation | **A sum of medians is not the median of the sum** — percentiles do not compose by addition, and the true distribution of end-to-end time requires measuring end-to-end. The figure excludes client network, browser render, and any queueing at the edge, so it is not a user-experienced latency. The sequential assumption is a design fact that must be verified, not assumed. |
| Decision relevance | Supports scoping work to the payment interaction. Does not support a claim about customer-perceived checkout time. |

### Example 2 — Fan-out failure probability, and why the arithmetic can mislead

| Field | Entry |
| --- | --- |
| Context | The Atlas catalogue search page composes results from six backend calls; the page fails if any call fails. |
| Population | 200,000 synthetic page compositions in a defined one-hour window. |
| Assumptions | Each call succeeds with probability 0.999 in this window, and **failures are statistically independent**. The independence assumption is the load-bearing one. |
| Units | Dimensionless probability; counts of page compositions. |
| Calculation | P(all six succeed) = 0.999⁶ = 0.994014980… ≈ **0.99401**. P(at least one fails) = 1 − 0.999⁶ = 0.005985020… ≈ **0.00599**. Expected affected compositions = 0.005985020… × 200,000 = 1,197.004 ≈ **1,197**. Note that the multiplication uses the unrounded value: carrying the displayed 0.00599 through instead would give 1,198, and carrying a 5-decimal rounding of 0.00598 would give 1,196. Round once, at the end. |
| Interpretation | Under the stated assumptions, adding backend calls to a composed page degrades page-level success faster than any single call's reliability suggests. Six 99.9% calls do not yield a 99.9% page. |
| Limitation | **The arithmetic is correct and the inference is weak.** If all six calls share a connection pool, a service-discovery mechanism, a database cluster, or an availability zone, their failures are correlated, and the independence assumption is false. Correlation changes the *shape* of the failure, not only its rate: instead of ~1,200 scattered single-call failures, the real pattern is likely to be long intervals of zero failures punctuated by a common-mode event in which all six fail together for thousands of consecutive requests. A design tuned against the scattered model — per-call retries, for instance — can be actively harmful against the correlated one. |
| Decision relevance | Justifies asking what the six calls share before treating the number as a reliability estimate. Does not justify a page-level availability claim. |

### Example 3 — Retry amplification

| Field | Entry |
| --- | --- |
| Context | Atlas checkout retries the payment call up to twice after an initial attempt (maximum three attempts). |
| Population | 400 checkout submissions per minute during a degradation window. |
| Assumptions | 90% of calls time out and exhaust all three attempts; 10% succeed on the first. Retries are immediate, with no backoff, jitter, or overall time budget. The client does not cancel in-flight work on disconnect. |
| Units | Attempts per minute; concurrent connections; seconds. |
| Calculation | Attempted payment calls = 400 × [(0.10 × 1) + (0.90 × 3)] = 400 × (0.10 + 2.70) = 400 × 2.80 = **1,120 attempts/minute**. Amplification = 1,120 ÷ 400 = **2.8×**. With a 5-second timeout and immediate retries, a failing checkout occupies a connection for about 3 × 5 = 15 s. Failing checkouts = 400 × 0.90 = 360/minute = 6/second; concurrent held connections ≈ 6 × 15 = **90**. |
| Interpretation | A retry policy intended to improve success under brief blips nearly triples load on an already-degraded dependency and holds roughly 90 connections that produce no completed business outcome. This is the mechanism by which retries convert a slowdown into an outage. |
| Limitation | **Attempts are not customer completions.** The figure says nothing about how many customers received an order. It assumes the provider continues accepting connections rather than shedding load, and assumes no backoff — adding exponential backoff with jitter and a total time budget changes the arithmetic substantially. It also does not model the duplicate-charge risk, which is a correctness consequence rather than a load one. |
| Decision relevance | Supports a decision to add a retry budget, backoff with jitter, and an idempotency key before the next promotion. Does not establish a capacity figure. |

### Example 4 — Backlog and drain time

| Field | Entry |
| --- | --- |
| Context | Atlas fulfilment jobs are queued and processed by asynchronous workers. |
| Population | A 10-minute (600-second) synthetic promotional window followed by a return to normal demand. |
| Assumptions | Arrival is steady at 45 jobs/s during the window and 30 jobs/s after; worker completion capacity is a steady 38 jobs/s throughout; the queue is unbounded; retries add nothing to arrivals; workers do not degrade as the queue grows. |
| Units | Jobs per second; jobs; seconds. |
| Calculation | Imbalance during the window = 45 − 38 = **7 jobs/s**. Accumulated backlog = 7 × 600 = **4,200 jobs**. After the window, drain rate = 38 − 30 = **8 jobs/s**. Drain time = 4,200 ÷ 8 = **525 s ≈ 8 min 45 s**. |
| Interpretation | A ten-minute overload produces almost nine minutes of continued delay after demand returns to normal. The customer-visible consequence — orders showing as unfulfilled — outlasts the traffic event that caused it by nearly as long again. |
| Limitation | Steady-rate assumptions are the weakest part: real arrival is bursty, and per-job service time varies. **This is backlog evidence, not a capacity guarantee.** If retries feed back into arrivals, or if worker throughput drops as the queue grows, the drain time is understated — potentially without bound. An unbounded queue is itself an assumption that should be challenged. |
| Decision relevance | Supports a decision about queue bounding, customer-facing status messaging during backlog, and whether nine minutes of delayed fulfilment is acceptable. Does not support a worker-count decision without variance data. |

## Worked Reasoning: Synchronous Versus Asynchronous Checkout

Atlas must decide how checkout obtains a payment outcome. The two options are the ones in the opening story and its alternative.

**Option A — Synchronous confirmation.** Checkout calls payment and waits. The customer sees a confirmed or declined outcome before the page returns.

**Option B — Accept and resolve asynchronously.** Checkout validates the cart, creates the order in an explicit `PAYMENT_PENDING` state, enqueues the payment work, and returns immediately. A worker performs the payment call and transitions the order. The customer sees "order received; payment confirming."

### Tracing the failure path

The required trace, for each option, is: **timeout → retry → duplicate or unknown outcome → evidence gap → recovery requirement → customer-state consequence.**

| Stage | Option A (synchronous) | Option B (asynchronous) |
| --- | --- | --- |
| Timeout | Occurs on the request thread, with a customer waiting. The bound must be short — a customer will not wait 30 s — so timeouts are common under degradation. | Occurs in a worker with no customer waiting. The bound can be generous, so genuine timeouts are rarer. |
| Retry | Must complete inside the customer's patience. Little room for backoff; retries stack inside one request (Example 3). | Retries can use exponential backoff with jitter across minutes. Amplification is bounded by worker concurrency, not customer arrival rate. |
| Duplicate / unknown | Highly likely, and immediately customer-visible. Without an idempotency key, duplicate authorisation is possible. | Still possible; the worker faces the same third-party ambiguity. But the order already exists in a state that can *hold* the ambiguity. |
| Evidence gap | Atlas holds no record that an attempt may have succeeded, because a timeout was recorded as a failure. The gap is unrecoverable without a provider query. | The order row and an attempt record exist before the call is made, with a correlation identifier. The gap is narrower and queryable. |
| Recovery requirement | A reconciliation query and a compensating refund path, both of which must be built. Neither exists. | Reconciliation against the stored correlation identifier; the pending state is a legitimate resting place while it runs. |
| Customer-state consequence | The customer is told something definite and possibly false. Support cannot answer "was I charged?" | The customer is told something indefinite and true. Support can answer, because the record exists. Product must accept that "confirmed" is delayed. |

### Applying the reasoning model

| Element | Entry |
| --- | --- |
| Context | Payment provider degradation has produced duplicate authorisations and unanswerable support enquiries. |
| Quality claim | Every checkout attempt reaches a terminal, truthfully reported state, and Atlas can determine the authoritative payment outcome for any attempt. |
| Characteristic | Reliability, with functional suitability (the reported state must be correct) and a maintainability cost. |
| Constraint | The provider's timeout and retry semantics cannot be changed. Product currently requires an immediate confirmed/declined outcome on the confirmation page. |
| Option A | Keep synchronous; add idempotency key, retry budget with backoff and jitter, an explicit `PAYMENT_UNKNOWN` state, and a reconciliation job. |
| Option B | Accept and resolve asynchronously; order created before the payment call; worker performs payment with the same safeguards. |
| Assumption | The provider honours an idempotency key across retries with identical semantics. **Unverified — this is the single most consequential open question, and it applies to both options.** |
| Assumption | Product will accept a delayed confirmation. **Unverified for Option B.** |
| Trade-off | A preserves the immediate outcome and keeps the customer's connection hostage to a third party. B removes temporal coupling and introduces a pending state that support, notification, and fulfilment must all learn to handle correctly (Chapter 4). |
| Failure mode (A) | Under deeper degradation, the same failure recurs with better bookkeeping. |
| Failure mode (B) | Pending orders accumulate during a long outage; customers cannot tell a slow confirmation from a lost one; a duplicate `PAYMENT_PENDING` event produces a second charge if the worker is not idempotent. |
| Evidence needed | Provider documentation and a bounded test of idempotency-key behaviour; measured distribution of payment latency under degradation; a product decision on delayed confirmation. |
| Limitation | No synthetic experiment can establish the provider's real behaviour under real degradation; the reconciliation contract can only be verified against the provider's own record. |
| Decision | Two decisions, of different kinds. **Rejected outright:** the current unconditional retry policy — three immediate attempts with no budget, no backoff, and no idempotency key — is unsafe under the observed failure mode and should not survive the next release, whichever checkout design is chosen. **Deferred with a condition:** the synchronous-versus-asynchronous choice is a product trade-off about what Atlas is willing to tell a customer, and it is not the Quality Engineer's to settle; it should be taken once product has answered whether a delayed confirmation is acceptable. |
| Owner | Payment domain owner for the interaction design; product owner for the confirmation-timing decision; release authority for rollout. |
| Residual risk | Provider behaviour under sustained degradation remains unobserved in both options. |
| Revision trigger | Any change to provider timeout or idempotency semantics; any change to the retry policy; the next promotion window. |

Notice that the analysis produced two decisions of different shapes, and that only one of them was the Quality Engineer's to make. Rejecting the retry policy is squarely an evidence-led engineering conclusion: the policy is unsafe against the failure mode that actually occurred, and no further information would rescue it. Choosing between synchronous and asynchronous checkout is not, because it turns on what the business is prepared to say to a customer — and framing that question accurately is a more useful contribution than answering it.

The idempotency key and the explicit unknown state sit underneath both, required by either design.

## The Interaction, Time, and Failure Analysis

The **Interaction, Time, and Failure Analysis** is this chapter's professional artefact. It is an MSQE teaching artefact. For each interaction that crosses a boundary, it records:

| Field | Content |
| --- | --- |
| Interaction | Caller, callee, and form (request/response, command, event, queue, callback, polling, stream). |
| Purpose | The business outcome the interaction serves. |
| Temporal coupling | Whether the caller must wait, and why. |
| Timing | Expected latency, timeout bound, and the source of each figure. |
| Failure modes | Callee failure, callee slowness, **timeout with unknown outcome**, and transport failure — each listed separately. |
| Retry behaviour | Attempt count, budget, backoff, jitter, and whether retries can occur after an unknown outcome. |
| Idempotency | Whether the operation is idempotent, by what mechanism, with what key scope and retention. |
| Ordering and duplication | Ordering scope required and provided; duplicate handling. |
| Backpressure | What signals upstream when the callee cannot keep up; what happens when nothing does. |
| Customer-visible state | What the customer is told at each stage, and whether it can be untrue. |
| Evidence | What observation would show this interaction misbehaving, and whether it exists today. |
| Unknown-outcome path | Reconciliation, idempotent retry, compensation, or human resolution — and the owner of that path. |

Two fields carry disproportionate weight. **Customer-visible state** forces the analysis to connect a technical failure mode to something a person experiences, which is what makes it a quality artefact rather than a design note. **Unknown-outcome path** is the field most commonly left blank, and a blank is a finding.

## Engineering Perspective

Interaction failures are hard to evidence because the interesting conditions are rare and difficult to reproduce. Three practical positions help.

**Design the observation before the interaction.** If a timeout produces an unknown outcome, something must record that an attempt was made, with a correlation identifier, *before* the call is issued. This is an architecture requirement, not a logging preference: if it is not written before the call, it cannot exist after a crash. Telemetry implementation belongs to Part VIII; the requirement belongs here.

**Prefer bounded fault simulation over waiting for production.** A controlled experiment in which a dependency is made slow — rather than made to fail — is disproportionately valuable, because slow is the condition most systems handle worst and test least. Chapter 7 develops what an architecture must provide for such simulation to be possible at all.

**Treat the retry policy as a first-class artefact.** Retry counts are frequently set once, in a hurry, against an assumption about the failure mode that is never recorded. Every retry policy should carry the failure mode it assumes, because that assumption is what makes it safe or dangerous.

## Industry Perspective

RFC 9110 defines HTTP semantics, including the property that certain request methods are idempotent — a repeated request has the same intended effect as a single one — and that this is a property of the *method's semantics* rather than a guarantee about any particular implementation.[^rfc9110] The distinction is exactly the one this chapter draws: a specification can define what an operation is supposed to mean, but whether a specific handler behaves idempotently is a property of that handler.

The specification is used here only for that protocol claim. RFC 9110 is a protocol specification, not an architecture standard, and it does not settle an architecture decision. Part IV owns HTTP semantics as a curriculum.

## Common Misconceptions and Pitfalls

### "A timeout means the operation failed."

It means no response arrived within the chosen bound. The operation may have completed. This single misconception generates the largest class of correctness defects in distributed systems, including the Atlas duplicate charges.

### "At-least-once delivery causes duplicate charges."

Duplicate *delivery* causes duplicate *effects* only when the handler is not idempotent. The defect is in the handler. Conversely, at-most-once delivery does not prevent duplicate effects if the application retries.

### "Exactly-once is available; we just enable it."

Effectively-once processing is available, bounded by a deduplication window, key scope, and store availability. Those bounds must be stated. A design that assumes unbounded exactly-once semantics will fail at the edge of a window nobody wrote down.

### "Retries make the system more reliable."

Retries improve success against transient, non-duplicating failures. Against a slow dependency they amplify load (Example 3) and, without idempotency, duplicate effects. A retry policy is safe only relative to a stated failure mode.

### "Asynchronous means faster."

It means the caller does not wait. Total time to a completed business outcome is frequently longer. What asynchrony buys is availability independence and load absorption, not speed.

### "The queue will absorb it."

An unbounded queue relocates a capacity problem and delays its symptom (Example 4). Absorption is real and useful; it is not unlimited, and the backlog outlasts the event.

## QA → QE Transition

The transition in this chapter is from testing a happy-path API response to assessing how timing, loss, duplication, delayed failure, and user feedback affect a system claim.

A QA Engineer verifies that the payment adapter returns the right thing when the provider returns the right thing. A Quality Engineer asks what the system does when the provider returns nothing; whether "nothing" is representable in the state model; whether a retry after "nothing" can charge twice; what the customer is told while the answer is unknown; whether anyone can later determine the truth; and who owns the path from unknown to resolved. The first set of questions is necessary. The second set is where the Atlas incident lived.

## Summary

Crossing a boundary introduces time, independent failure, and — most consequentially — outcomes that carry no information. Communication choice is an architectural decision about temporal coupling, availability, feedback, and evidence, not a technology preference. A timeout is not a failure, and a system that cannot represent "unknown" will report a guess as a fact. Idempotency is a property of the handler, not the transport; delivery guarantees and business effects are different things, and exactly-once claims require explicit bounds. Bounded numerical reasoning about latency, fan-out, retry amplification, and backlog is useful for structuring judgement, provided each example states its assumptions and its limitations — including the case where correct arithmetic supports a weak inference because failures are correlated.

## Key Takeaways

- Classify interactions by what the caller commits to, not by the technology used.
- Temporal coupling makes the callee's availability and latency the caller's own.
- A timeout yields an unknown outcome; every design needs a defined path out of unknown — reconciliation, idempotent retry, compensation, or human resolution.
- Idempotency means repetition adds no further intended effect; an idempotency key is scoped to a business operation, with a stated retention window.
- At-least-once delivery does not by itself cause duplicate effects; a non-idempotent handler does.
- Effectively-once processing is achievable and bounded; unbounded exactly-once is not.
- Ordering is usually guaranteed only within a partition or single consumer; handlers should tolerate reordering.
- Unbounded queues relocate capacity problems rather than solving them, and backlogs outlast the events that create them.
- Correct arithmetic can support a weak inference: check what fan-out dependencies share before assuming independence.

## Review Questions

1. Why is a timeout not evidence that the operation failed, and what must the architecture provide instead?
2. Distinguish at-least-once delivery from duplicate business effect. Where does the defect live?
3. Under what conditions is "effectively-once" a defensible claim, and what must be stated alongside it?
4. In Example 2, the arithmetic is correct. Explain why the inference may still be wrong, and what you would ask to find out.
5. In Example 3, retry amplification is 2.8×. What would change if exponential backoff with jitter and a 20-second total budget were added?
6. Why does asynchronous checkout not make checkout faster, and what does it actually buy?

## Interview Questions

1. A service adds retries to improve reliability. What would you want to know before agreeing it is safe?
2. How would you design evidence that a payment attempt occurred, when the response never arrived?
3. What is the difference between a command and an event, and what goes wrong when they are confused?
4. A team says their queue means they cannot be overwhelmed. How would you test that claim?

## Practical Exercise

Produce an **Interaction, Time, and Failure Analysis** for the following synthetic Atlas Commerce interaction.

*Atlas is adding a loyalty-points award at checkout. When an order is paid, checkout calls the loyalty service to award points. The loyalty service is internally operated, occasionally restarts during deployment, and takes 40–90 ms normally. Product wants the points balance shown on the confirmation page. The team proposes a synchronous call with three retries.*

Complete every field of the analysis. Your submission must:

- list the timeout-with-unknown-outcome failure mode **separately** from callee failure and callee slowness;
- state whether the award operation is idempotent, by what mechanism, and with what key scope and retention;
- state what the customer is told at each stage and identify at least one point where the message could be untrue;
- fill in the unknown-outcome path with a named owner, or record its absence as a finding;
- state what backpressure exists, or that none does; and
- identify at least one piece of evidence that does not currently exist and would be needed.

Then perform **one** bounded numerical example of your choice — retry amplification during a loyalty-service restart, or the latency contribution of the synchronous call to the checkout path. State context, population, assumptions, units, calculation, interpretation, limitation, and decision relevance. Finally, in no more than 120 words, state whether the synchronous proposal should proceed, what you would need to know first, and who owns that decision. Use synthetic data only; no production system or live third-party integration.

## Further Reading

- [RFC 9110 — HTTP Semantics (STD 97)](https://www.rfc-editor.org/rfc/rfc9110.html) — protocol specification; see especially the treatment of idempotent and safe methods.
- [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html) — protocol specification; relevant where a staleness window is expressed through HTTP caching semantics.
- [Timeouts, retries, and backoff with jitter](https://aws.amazon.com/builders-library/timeouts-retries-and-backoff-with-jitter/) — vendor-published practitioner guidance, not a standard; useful for the mechanics of retry budgets, backoff, and jitter.

## References

[^rfc9110]: Fielding, R., Nottingham, M., and Reschke, J., eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Internet Engineering Task Force, STD 97, June 2022. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Classify an interaction by what the caller commits to and state the temporal coupling it creates.
- [ ] Explain why a timeout produces an unknown outcome and name four paths out of it.
- [ ] Define idempotency precisely and specify an idempotency key's scope and retention.
- [ ] Distinguish delivery guarantees from business effects, and bound an exactly-once claim.
- [ ] Perform a bounded numerical example with assumptions, units, interpretation, and limitation.
- [ ] Identify when correct arithmetic supports a weak inference because of correlated failure.
- [ ] Complete an Interaction, Time, and Failure Analysis including the unknown-outcome path and its owner.

## Chapter Navigation

Previous: [Chapter 2 — Boundaries, Responsibilities, Coupling, and Dependencies](chapter-02-boundaries-responsibilities-coupling-and-dependencies.md) · Next: [Chapter 4 — State Ownership, Consistency, and Transactional Boundaries](chapter-04-state-ownership-consistency-and-transactional-boundaries.md)
