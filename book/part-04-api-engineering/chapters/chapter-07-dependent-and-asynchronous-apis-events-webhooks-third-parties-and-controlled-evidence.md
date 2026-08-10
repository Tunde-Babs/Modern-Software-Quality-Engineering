# Chapter 7 — Dependent and Asynchronous APIs: Events, Webhooks, Third Parties, and Controlled Evidence

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 7 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–6 and familiarity with API contracts, state transitions, retries, and correlation concepts |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A successful request is not a completed outcome when another system, later process, or callback still decides what the customer will experience.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. Checkout submits an order and receives `202 Accepted`. The API records the request, sends the order to a payment-review provider, and returns a location that the client can use to follow progress. Several minutes later, the payment provider accepts the review, but the event that should start fulfilment is delayed. A webhook to the customer-notification service is retried after the first delivery endpoint times out.

Each local interaction can look reasonable. The initial API returned an accepted response. The payment provider received a request. The webhook sender made an attempt. Yet the customer has no reliable answer to a simple question: is the order confirmed, pending, rejected, or known to be stuck? Repeating the original request could create duplicate work. Treating the first successful webhook delivery as proof could conceal a duplicate notification. Waiting ten seconds and checking again would be an arbitrary observation, not completion evidence.

The Quality Engineer asks which dependency contributes to the customer outcome, what each response establishes, how a caller can observe completion or failure, what repeats safely, and what evidence remains missing when an external system is involved.

## Introduction

API outcomes commonly depend on systems beyond the immediate request handler: another internal service, data store, queue, event consumer, identity service, payment provider, notification provider, or partner API. Some dependencies are synchronous. Others cause work that completes later, possibly after the originating connection has closed. These arrangements are normal engineering choices, but they change what an API response can truthfully claim.

Chapter 4 introduced partial success, retries, duplicate delivery, state transitions, and evidence boundaries. This chapter applies that reasoning where an API interacts with dependent or asynchronous systems. It examines completion signals, eventual consistency, polling, events, webhooks, third parties, controlled substitutes, and dependency-specific failure evidence.

This is not a message-broker tutorial, webhook-server implementation guide, provider sandbox manual, or service-virtualization product course. It does not teach queue configuration, cryptographic signature verification, chaos engineering, or a particular mock framework. Its purpose is to help a Quality Engineer select proportionate evidence and state what a controlled or live boundary cannot establish.

## Why This Chapter Matters

An API can be syntactically correct, structurally valid, and immediately successful while the customer outcome remains pending, partially applied, duplicated, delayed, or dependent on a system outside the team's control. This is particularly important for payments, fulfilment, reporting, identity, notifications, external data, and workflow orchestration.

Weak evidence often arises from collapsing distinct states: accepted is treated as completed; a received event is treated as consumed correctly; a simulated dependency is treated as a live integration; a provider success is treated as proof of failure recovery; a fixed sleep is treated as evidence that eventual work has completed. Each shortcut can create unjustified release confidence.

Quality Engineering does not remove the uncertainty created by distributed work. It makes the dependency assumption, completion condition, observation boundary, failure behaviour, and residual risk explicit enough for a team to make a better decision.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify the dependencies that materially contribute to an API outcome;
- distinguish synchronous completion from acceptance, deferred processing, and later reconciliation;
- select meaningful completion signals without relying on arbitrary waits;
- reason about events, webhooks, retries, duplicate delivery, delayed delivery, and ordering assumptions;
- distinguish dependency-contract evidence, controlled dependency evidence, and live integration evidence;
- make a context-sensitive real-versus-controlled dependency decision;
- identify partial-failure and unknown-outcome risks across API and dependency boundaries;
- formulate a dependency and asynchronous evidence strategy with explicit limitations; and
- communicate residual dependency risk to an accountable decision-maker.

## APIs Depend on Other Systems

An API boundary often represents a collaboration rather than one isolated computation. A request may consult an internal catalogue, persist a record, call a fraud service, publish an event, await a payment provider, update a search view, or send a callback to a partner. The implementation topology is not the main lesson. The quality question is which dependency assumptions affect the requested outcome.

| Dependency type | Illustrative API consequence | Evidence question |
|---|---|---|
| Internal service | Order API relies on inventory allocation. | What happens if allocation is slow, unavailable, or reports an unexpected result? |
| Data store or read model | A status endpoint reads a delayed projection. | Which state is authoritative, and what does a lagging read mean? |
| Event or queue path | Order acceptance produces a fulfilment event. | Was the event published, delivered, consumed, and reflected in the intended outcome? |
| External provider | Payment review determines whether fulfilment may proceed. | Which provider response and recovery behaviour does the API promise? |
| Identity service | Credential verification controls access to an action. | How does unavailability differ from an invalid or insufficient credential? |
| Notification or webhook consumer | A later message tells a customer or partner an outcome. | What establishes delivery, processing, duplicate handling, or safe retry? |

A dependency is also an **evidence boundary**. A request response may establish that the API attempted an outbound call. It may not establish how a provider processed it, whether a callback was delivered, or whether a downstream customer action occurred. This builds on Chapter 1's boundary reasoning and Part III's controlled-dependency guidance.

## Synchronous Dependency Behaviour

In a synchronous interaction, the API validates the request and state, awaits a dependent call, interprets its result or timeout, then determines its response and any selected state change.

The simplification does not make the outcome simple. A dependency might return slowly, reject a request, respond with malformed or semantically unexpected data, apply work but lose its acknowledgement, or succeed while a later local action fails. The API contract needs to distinguish conditions that matter to its consumers.

| Observation | Plausible underlying conditions | Useful next evidence |
|---|---|---|
| API success | Dependency responded; primary state changed; a later side effect may still be pending. | Defined state and selected downstream-effect observation. |
| API timeout | Dependency or API may be slow; request may be in flight, applied, or not received. | Correlation, authoritative state, and safe retry rule. |
| Dependency error | No work, partial work, or recoverable pending work may exist. | Error classification, state observation, and recovery condition. |
| Invalid dependency response | Contract mismatch, provider defect, or translation defect may exist. | Bounded payload/contract evidence and safe error outcome. |

The goal is not to force every dependency into one error taxonomy. It is to state what an API response establishes about the customer-relevant state and what still requires later observation.

## Asynchronous APIs: Acceptance Is Not Completion

An **asynchronous API operation** accepts or records work whose business outcome may be completed later. Payment review, document processing, fulfilment, account verification, report generation, and external provisioning are common examples.

HTTP `202 Accepted` indicates that a request has been accepted for processing but that processing has not completed; the request might or might not eventually be acted on.[^rfc9110] It is therefore useful for some asynchronous contracts, but it is not mandatory for every deferred operation and it does not define an application's completion model.

| Result a consumer sees | What it can establish | What it cannot establish without more evidence |
|---|---|---|
| Accepted or queued | The provider accepted responsibility for selected processing. | Final success, final failure, customer notification, or downstream effect. |
| Pending status | Work is represented as not yet terminal under the contract. | That it will complete by a particular time or without intervention. |
| Completed status | A defined operation reached its stated terminal outcome. | Every external consumer's processing unless the contract includes that boundary. |
| Failed status | A defined operation failed according to its state model. | That no preceding partial effect requires reconciliation. |
| No response at client | The caller lacks an outcome. | Whether the provider received, accepted, completed, or rejected the request. |

The contract should make terminal and non-terminal states meaningful. A word such as `accepted`, `processing`, `completed`, or `failed` is useful only when a consumer can determine what action, state, and follow-up it represents.

## Completion Evidence and Bounded Waiting

Completion evidence is the observation that supports a defined claim that a process has reached an outcome. Depending on the contract, it can be:

- a follow-up status or processing resource;
- a state change in an authoritative representation;
- a recorded event with an applicable identity and outcome;
- a webhook received and safely processed by the intended consumer;
- a downstream representation whose relationship to the original operation is explicit; or
- a safe diagnostic or reconciliation signal for a supported operator workflow.

No single signal is inherently strongest. A webhook receipt may show delivery to an endpoint but not business processing. A status endpoint may show a completed internal workflow but not whether a third party acted. A persisted record may show an intended state but not whether a notification was issued. Select the signal that represents the decision at hand.

An **asynchronous test oracle** is the rule used to decide whether the observed later outcome supports the expected result. It must name the operation identity, meaningful terminal or pending state, observation boundary, and condition that counts as success, failure, or unresolved work. “No error appeared after a delay” is not an oracle: it does not distinguish delayed processing, an unobserved failure, or a completed outcome outside the chosen boundary.

### Polling is an observation strategy, not a sleep

**Polling** means repeatedly requesting a status or representation until a defined completion predicate, terminal failure, or bounded timeout is reached. A good polling observation specifies:

- the operation or correlation identity being observed;
- the pending and terminal states that have defined meaning;
- an interval and maximum wait chosen for the workflow, not convenience alone;
- the last observed state and diagnostic information when the limit is reached; and
- what a timeout leaves unknown and which recovery or escalation path remains.

Polling does not make an asynchronous API synchronous. It makes a bounded observation of a clearly defined condition. A fixed wait followed by “green if no error appeared” is weak because it obscures the completion predicate, the last state, and the uncertainty when processing is slow.

### Eventual consistency requires a meaningful boundary

**Eventual consistency** describes a situation in which related views or replicas can differ temporarily and are expected to converge under stated conditions. It does not mean “wait until a check passes.” An evidence strategy should identify the relevant source or state, the completion condition, the permissible delay or timeout, and the action when the condition does not converge.

For example, an order might be recorded immediately while a customer-history view is updated later. A support interface needs to distinguish “not yet visible in this view” from “no order exists” when that distinction affects the customer. Quality evidence may observe the known order, the projection status, a bounded later read, and the stated limitation that the selected condition does not represent every production lag or failure path.

## Events and Messages

An **event** communicates that something of interest happened. A message can command, request, notify, or carry state; terminology differs across systems. At this level, the important questions are the payload meaning, producer, intended consumer, identity, delivery conditions, and effect of repeated or delayed delivery.

AsyncAPI provides a specification for describing event-driven APIs,[^asyncapi] and CloudEvents defines a common format for describing event data.[^cloudevents] These specifications can help participants describe interfaces. They do not prove that a consumer processed an event once, in order, or with the intended business meaning.

| Event evidence question | Why it matters |
|---|---|
| What event or message represents the operation? | A generic “message sent” claim may not identify the business occurrence. |
| Which fields establish identity, version, time, and payload meaning? | Consumers need to relate, validate, and evolve the event safely. |
| Who is expected to consume it, and what effect follows? | Publication is not the same as consumption or customer outcome. |
| What acknowledgement or observation is meaningful? | Transport acknowledgement may not establish business processing. |
| Can delivery be delayed, repeated, or reordered? | Consumer state and duplicate effects depend on the answer. |

The chapter does not prescribe an event schema or broker. It asks whether the event contract and evidence make the risk visible.

### Duplicate and delayed delivery

Repeated delivery can result from producer retries, consumer retries, acknowledgement uncertainty, redelivery rules, manual replay, or a callback sender retrying after a timeout. Chapter 4 distinguished HTTP method idempotency from application-level repeatability. The same principle applies here: an event consumer needs an explicit rule for what counts as the same logical occurrence and which effects must remain unique.

Do not promise exactly-once processing merely because an event has an identifier or an API call has an idempotency key. The useful question is narrower: under defined delivery conditions, how does the receiving operation deduplicate or safely handle repeats, and what evidence can reveal an ambiguous or partial effect?

Delayed delivery changes meaning too. A customer cancellation event arriving after fulfilment confirmation may be valid at transport level yet stale for a consumer's state. A payload timestamp can help interpretation, but a timestamp alone does not impose an ordering rule. For example, a payment provider and fulfilment service can independently publish `payment.reviewed` and `fulfilment.reserved`; without a documented causal or global ordering contract, a consumer must not infer which fact occurred first from arrival order. The consumer contract needs to say whether order is guaranteed, detectable, irrelevant, or reconciled.

## Webhooks: A Provider Becomes a Caller

A **webhook** is a provider-initiated callback to a consumer-supplied endpoint, usually to report a later event or outcome. It reverses the familiar request direction: the original consumer becomes the receiver of an incoming API interaction.

Useful webhook evidence questions include:

- Was the configured destination correct for the intended tenant or subscriber?
- Does the callback payload identify the event, subject, version, and correlation safely?
- What establishes that the receiver accepted delivery versus completed business processing?
- How are retry, duplicate, delayed, and out-of-order callbacks handled?
- What does a receiver response mean to the sender, and when does the sender stop retrying?
- Where relevant, is callback authentication or signature verification treated as an explicit security requirement rather than assumed from a URL?

The last question is awareness only. This chapter does not teach cryptographic verification or webhook-server design. The Quality Engineer needs to identify the contract and evidence boundaries so security and platform owners can provide the appropriate implementation and review.

## Partial Failure and Recovery

Dependent work creates more opportunities for partial outcomes. An API might persist an order but fail before publishing an event. A payment provider might accept a charge but the acknowledgement might time out. A provider might complete work while the webhook receiver is unavailable. One internal service might succeed while another rejects the same business operation.

| Partial condition | Incorrect shortcut | Better evidence question |
|---|---|---|
| API state changed; event not observed | “The API returned success, so fulfilment will happen.” | Is publication, retry, reconciliation, or interim state defined and observable? |
| Provider acknowledgement timed out | “The charge failed.” | Which correlated state, provider record, or supported recovery process can distinguish unknown outcome? |
| Webhook delivery fails | “The customer was never notified.” | Does the provider record attempts, retry conditions, terminal delivery failure, and customer-facing alternative? |
| One dependency succeeds and another fails | “The transaction rolled back.” | Which effects are atomic, pending, compensating, or subject to reconciliation? |

**Recovery** is the defined way a system, consumer, or operator resolves a known failed, pending, or partial outcome. It can involve a retry, idempotent replay, reconciliation, manual review, alternative notification, or a new supported operation. Recovery is not automatic merely because an error was returned. Its correctness depends on the state, duplicate-handling rule, ownership, and evidence available.

### Failure injection as bounded evidence

**Failure injection** deliberately represents a selected dependency failure so that a team can observe the API's safe response, recovery rule, or diagnostic behaviour. For this chapter, it means controlled, authorised simulation of conditions such as a timeout, unavailable provider, malformed response, rejected callback, or delayed event. It is not a chaos-engineering programme or permission to disrupt shared environments.

The test question should state the represented failure, expected API state, side-effect constraint, diagnostic signal, and limitation. A controlled timeout can establish a selected path; it cannot prove that a third party will behave the same way in every real outage.

## Third-Party APIs and Dependency Change

Third-party APIs introduce a boundary over which a team may have limited control. A sandbox can have different data, rate limits, timing, versions, certificates, and failure behaviour from production. A provider can change an enum, error condition, quota, response timing, deprecation policy, or operational status without matching the team's internal release cadence.

| Third-party concern | Quality Engineering question |
|---|---|
| Sandbox representativeness | Which production behaviour does the sandbox represent, and which conditions remain unrepresented? |
| Availability and rate limit | What does the API do under provider refusal, throttling, or delayed response? |
| Contract evolution | How will provider schema, semantic, version, or error changes be detected and assessed? |
| Dependency-specific errors | Can the API preserve a safe public error while retaining bounded internal diagnostic attribution? |
| Quotas and usage | Which workload or retry pattern can trigger a provider constraint? |
| Provider support and recovery | Who owns reconciliation, escalation, and customer communication when an external outcome is uncertain? |

Live integration evidence has particular value here because it exposes real compatibility, credentials, network path, and provider behaviour under selected conditions. It remains bounded: a live success does not establish an outage response, all rate limits, every customer configuration, or future provider behaviour.

## Real and Controlled Dependencies

A **controlled dependency** is a deliberately represented dependency condition used to make a question repeatable, observable, or safely difficult to exercise. It can be a deterministic sandbox, narrowly scoped test double, simulated provider response, controlled callback receiver, or virtualised service. **Service virtualization** is one way of representing dependency behaviour for such controlled evidence; it is a concept here, not a tooling prescription.

| Evidence choice | It can support | It cannot establish alone |
|---|---|---|
| Real dependency | Selected real compatibility, authentication, network, and integration behaviour. | Safe repeatability, rare failures, every external condition, or convenient state control. |
| Controlled dependency | Deterministic responses, represented failures, edge cases, safe replay, and focused diagnosis. | Actual provider compatibility, production latency, credentials, or undocumented behaviour. |
| Both, selected by risk | A more balanced argument: controlled failure evidence plus representative live checks. | Universal assurance across all environments and consumers. |

Neither option is universally superior. A payment-provider contract change may require a live boundary check. A callback timeout that must be repeated safely may require controlled representation. The decision follows the risk, the question, the ability to control state safely, and the limitation a decision-maker needs to know.

### Dependency testability

**Dependency testability** is the extent to which a team can observe and deliberately represent the dependency conditions needed to answer a quality question. Helpful capabilities include deterministic sandbox or substitute behaviour, stable request and operation correlation, inspectable event or callback status, configurable represented failures, and safe replay where the contract supports it. They do not eliminate the need for selected real-boundary evidence; they make focused evidence and investigation possible without treating an uncontrolled external system as the only source of truth.

### Contract evidence and live integration evidence

Contract evidence checks that selected participants agree on a described interface or event expectation. Live integration evidence observes selected behaviour across an actual boundary. Both matter, but they answer different questions. A structured event example may catch a version mismatch early; it cannot prove production routing or provider availability. A live call may show one compatible exchange; it cannot efficiently represent every malformed response, timeout, or duplicate delivery.

## A Dependency and Asynchronous Evidence Strategy

The following is an **MSQE educational dependency and asynchronous evidence prompt**: begin with the customer outcome and dependency risk; state the dependency assumption and completion condition; choose a real or controlled boundary; select success, failure, retry, and duplicate scenarios; record the observation, diagnostic evidence, and limitation; then state the residual uncertainty and accountable action.

This prompt prevents a test plan from becoming a list of integrations. It requires each activity to name why the dependency matters, what the initial response does and does not prove, how an outcome is observed, and what remains outside the evidence boundary.

## QA to Quality Engineering Transition

| Existing QA activity | Expanded Dependency and Asynchronous Quality Engineering practice |
|---|---|
| Verify a dependency returns a successful response. | Identify the dependency assumption, customer outcome, completion signal, and unobserved failure conditions. |
| Wait after an accepted request. | Define a pending state, completion predicate, bounded observation, last state, and residual uncertainty. |
| Mock an external API. | State the controlled behaviour represented, why it improves evidence, and what live compatibility remains unknown. |
| Check one webhook receipt. | Consider destination, payload meaning, acknowledgement, duplicate delivery, ordering, retry, and business processing. |
| Retry an API request. | Define logical intent, provider retry behaviour, side-effect uniqueness, and recovery evidence. |

The transition is from asking whether an integration works in one moment to designing evidence about dependency assumptions, delayed outcomes, control-versus-representativeness trade-offs, and recovery risk.

## Engineering Perspective

Dependency quality is often improved through clearer contracts and observability rather than more test cases. A team may need an explicit pending state, stable operation identifier, completion resource, event identity, duplicate-handling rule, callback delivery record, safe diagnostic category, or recovery owner. These make customer outcomes less ambiguous and evidence more actionable.

The right intervention depends on the boundary. A controlled provider response can make a rare timeout repeatable; a real-provider check can challenge compatibility; a reconciliation record can reveal a partial outcome; a documented retry rule can prevent duplicate customer effects. Quality Engineering helps select and communicate those trade-offs without owning the whole distributed architecture.

## Industry Perspective

RFC 9110 defines HTTP `202 Accepted` as acceptance for processing rather than completed processing.[^rfc9110] AsyncAPI and CloudEvents provide specifications for describing event-driven interactions and event data.[^asyncapi][^cloudevents] The Amazon Builders’ Library illustrates one organisation's idempotency approach for retry-safe operations.[^aws-idempotency]

These sources do not define a universal event-delivery guarantee, callback model, retry schedule, service-virtualization method, or recovery design. The dependency evidence prompt is MSQE educational framing for selecting and communicating proportionate evidence.

## Common Misconceptions

### “A `202 Accepted` response means the business operation succeeded.”

It establishes acceptance for processing, not completed processing. The contract needs a meaningful completion or failure observation.

### “A successful mock proves the integration works.”

A controlled substitute can establish the represented interaction. It cannot establish real-provider compatibility, credentials, network behaviour, or production timing.

### “A live provider success proves dependency reliability.”

It supports one live observation. It does not represent selected outages, quota conditions, malformed responses, duplicate delivery, or future provider changes.

### “A webhook was delivered once, so duplicate handling is unnecessary.”

Retries, lost acknowledgements, redelivery, and manual replay can make repeated logical events normal conditions.

### “Eventual consistency means sleep until the test passes.”

An evidence strategy needs a defined completion predicate, bounded wait, last observed condition, and stated uncertainty.

## Summary

Dependent and asynchronous APIs make a response only one part of the evidence. The customer outcome can depend on later state, event consumption, provider work, callback delivery, retry behaviour, ordering, recovery, and a boundary outside the originating service.

Quality Engineering makes these dependencies explicit. It distinguishes acceptance from completion, selects meaningful completion signals, represents failures safely, chooses real and controlled dependencies according to the question, and states what each observation cannot establish. Chapter 8 builds on this foundation by examining whether the resulting API behaviour is dependable, timely, and diagnosable.

## Key Takeaways

- A dependency is an evidence boundary as well as a technical component.
- Acceptance, pending work, completion, failure, and unknown outcome are different contract states.
- Polling needs a completion predicate and bounded observation; it is not an arbitrary wait.
- Events and webhooks require explicit thinking about identity, delivery, duplicate handling, ordering, and business processing.
- Partial failure requires state, recovery, and reconciliation evidence rather than a binary success/failure claim.
- Real and controlled dependencies answer different questions; neither is universally superior.
- Failure injection can provide safe, bounded evidence of a represented dependency condition.
- Dependency evidence should state the completion condition, boundary, limitation, and residual risk.

## Review Questions

1. What can a `202 Accepted` response establish, and what does it leave unknown?
2. How does a meaningful polling observation differ from a fixed sleep?
3. Why can a webhook receipt fail to prove a customer-facing outcome?
4. What causes duplicate event or callback delivery, and what must a consumer define?
5. When is controlled dependency evidence more appropriate than live integration evidence?
6. What partial outcomes might follow a provider acknowledgement timeout?
7. How can delayed or out-of-order delivery alter an event's business meaning?
8. What should a dependency evidence strategy state about residual uncertainty?

## Interview Questions

1. How would you test an API that returns immediately but starts payment review asynchronously?
2. How would you decide which payment-provider scenarios must remain live and which may be controlled?
3. What evidence would you seek after a webhook receiver returns a timeout?
4. How do you communicate a third-party dependency risk in a release decision?
5. How would you distinguish an API timeout, a provider timeout, and an unknown final outcome?

## Practical Exercise

### Design a Dependency and Asynchronous Evidence Strategy

**Objective:** Produce a **Dependency and Asynchronous Evidence Strategy** for a fictional Atlas Commerce order-confirmation flow. Explain completion, control, evidence, and residual risk; do not implement a service or test suite.

Atlas accepts an order, requests asynchronous payment review from a third-party provider, publishes an `order.reviewed` event, asks an internal fulfilment service to reserve stock, and sends a webhook to a customer-notification partner. The payment provider can be slow, timeout after receiving a request, reject the order, or return an unfamiliar status. The notification partner retries after a receiver timeout and may deliver a duplicate callback. The order API can return `202 Accepted` with a processing-status location.

**Tasks:**

1. List the dependencies, their assumptions, their customer contribution, and their principal uncertainty.
2. Distinguish the initial acceptance, pending state, terminal completion, terminal failure, and unknown-outcome conditions.
3. Choose a completion signal for payment review, stock reservation, and customer notification. State what each signal cannot prove.
4. Identify retry, duplicate-delivery, ordering, and partial-failure risks, including at least one side effect that must not occur twice.
5. Decide which selected scenarios require a real boundary, which can use controlled representation, and why.
6. Define controlled failure-injection observations for a provider timeout, unfamiliar response, and webhook receiver timeout.
7. State diagnostic, reconciliation, and recovery evidence needed for an uncertain payment outcome.
8. Write a residual-risk statement for a release decision-maker that includes the third-party boundary.

**Expected artifact:** A three- to four-page Dependency and Asynchronous Evidence Strategy containing a dependency-assumption table, completion model, real/control decision record, selected failure and recovery scenarios, evidence limitations, and residual-risk statement.

**Constraints:** Atlas Commerce is fictional. Do not create a webhook receiver, queue consumer, provider mock, virtualized service, replay tool, or API tests. Do not claim exactly-once delivery or universal provider reliability.

## Further Reading

- [Chapter 4 — Stateful API Behaviour: Validation, Errors, Idempotency, and Concurrency](chapter-04-stateful-api-behaviour-validation-errors-idempotency-and-concurrency.md) — repeatability and side-effect context for asynchronous work.
- [Part III, Chapter 7 — Reliable Automated Checks: Isolation, Doubles, and Determinism](../../part-03-software-testing/chapters/chapter-07-reliable-automated-checks-isolation-doubles-and-determinism.md) — complementary context for controlled and deterministic evidence.

## References

[^rfc9110]: Fielding, R., Nottingham, M., and J. Reschke, eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). IETF, June 2022. Accessed 2026-08-10.
[^asyncapi]: AsyncAPI Initiative. [AsyncAPI Specification v3.1.0](https://www.asyncapi.com/docs/reference/specification/v3.1.0). Accessed 2026-08-10.
[^cloudevents]: CloudEvents. [CloudEvents Specification](https://cloudevents.io/). Accessed 2026-08-10.
[^aws-idempotency]: Featonby, M. [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/). Amazon Builders’ Library, 2021. Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] identify the dependency and completion condition that affect a customer outcome;
- [ ] distinguish acceptance, pending state, terminal outcome, and unknown outcome;
- [ ] choose a real or controlled dependency boundary and state its limitation;
- [ ] identify retry, duplicate-delivery, ordering, and partial-failure risks;
- [ ] define bounded completion evidence without an arbitrary wait; and
- [ ] communicate recovery and residual dependency risk.

**Next:** [Chapter 8 — API Reliability, Diagnostics, and Performance Evidence](chapter-08-api-reliability-diagnostics-and-performance-evidence.md).
