# Chapter 4 — Stateful API Behaviour: Validation, Errors, Idempotency, and Concurrency

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 4 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–3 and familiarity with HTTP request and response semantics |
| Estimated study time | 175 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A state-changing request is not understood when its response is known. It is understood when the relevant precondition, resulting state, side effects, repetition rule, and remaining uncertainty are clear.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. A customer submits an order. Checkout loses the network response after sending the request, so it retries. The API has created one order record, but its payment-capture call and fulfilment message are separate effects. A support colleague can see the order but cannot tell whether payment was captured once, twice, or not at all.

Later, while the retry is being processed, a warehouse colleague cancels the same order because stock is unavailable. The cancellation and retry reach different API operations at nearly the same time. Each request is plausible on its own. Together, they create a question that no single response can answer: which state transition won, which side effects occurred, and what should the customer be told?

The issue is not merely that the system has a race condition. The interface needs clear validation, state preconditions, repeatability behaviour, error outcomes, and evidence. A Quality Engineer helps the team turn “the request returned success” into a more useful question: what transition and effects did this request cause, under which state, and how can we know safely?

## Introduction

HTTP is a stateless protocol, but HTTP APIs often operate on stateful applications. Orders change from pending to confirmed; reservations become unavailable; payments are captured; events are emitted; notifications are sent. A response describes an observed interaction, not necessarily every persistent or downstream consequence of that interaction.

Chapter 3 examined what an API contract promises and how it evolves. This chapter examines what happens when a request is accepted, rejected, repeated, delayed, or executed alongside another request. It treats an API operation as a state transition with possible side effects and evidence limits.

The chapter is deliberately conceptual. It does not prescribe database locks, transactions, queues, idempotency-storage designs, retry libraries, or a concurrency-control implementation. Its purpose is to give a Quality Engineer enough language to identify the stateful risk, select proportionate evidence, and collaborate with people who own the design.

## Why This Chapter Matters

Many damaging API failures occur after the request body has passed validation:

- an order is confirmed from an invalid current state;
- a timeout leaves the caller uncertain whether payment was captured;
- a retry duplicates a downstream message;
- two legitimate requests overwrite or contradict each other;
- an error response hides a state change that already occurred; or
- a consumer treats a pending acknowledgement as a completed outcome.

Endpoint checks can expose selected examples of these behaviours. They are insufficient when they observe only a response and not the relevant state, side effect, retry condition, or competing request. Stateful API Quality Engineering asks what must be true before an operation, what changes when it succeeds or fails, what may happen if it repeats, and what evidence can distinguish safe failure from partial success.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish protocol statelessness from stateful application behaviour;
- describe an API operation as a transition from a current state through preconditions to a new state and possible side effects;
- distinguish representation, field, business-rule, state-precondition, and authorization-related validation concerns;
- explain why validation order can affect diagnostics, consistency, side effects, and information disclosure;
- treat errors as first-class stateful contract behaviour;
- distinguish HTTP method idempotency from application-level idempotency strategies;
- identify retry and duplicate-request risks without assuming an exactly-once outcome;
- identify partial success, race conditions, lost updates, stale writes, and competing transitions;
- explain the role and limit of conditional operations such as ETag and If-Match; and
- select API-specific evidence for state, side effects, repetition, and concurrency risk.

## APIs Are Stateful Interfaces

An application can keep authoritative state while using a stateless request–response protocol. HTTP statelessness means that the protocol does not require a server to retain request context between messages; it does not mean a service has no orders, balances, reservations, policies, or history.[^rfc9110]

For Quality Engineering, distinguish the following:

| Concept | Meaning | Risk if confused |
|---|---|---|
| Protocol interaction | The request and response exchanged at an HTTP boundary. | A successful response is mistaken for every application consequence. |
| Application state | The authoritative facts, records, and allowed conditions that the service maintains. | A representation is treated as proof of the current authoritative state. |
| State transition | A permitted movement from one relevant state to another caused by an operation. | The team tests a request without defining the state it requires or produces. |
| Side effect | An additional externally observable consequence, such as publishing an event, capturing payment, or sending a notification. | One record is correct while a duplicate or missing external effect harms the customer. |
| Outcome | What a consumer or customer can legitimately rely on after the interaction. | Acceptance, completion, and later reconciliation are collapsed into one claim. |

The distinction does not require every API to expose its storage or internal workflow. It requires the contract to be clear enough for consumers and operators to know which state or consequence an API result represents.

## A State-Transition Model

The following is an **MSQE educational stateful-operation model**, not a protocol standard or required architecture:

~~~text
current relevant state
  + request or action
  + applicable preconditions
  → outcome
  → new state and possible side effects
  → response, acknowledgement, or error representation
  → follow-up evidence where the outcome is not immediately complete
~~~

The model is intentionally bounded. A read operation may have no state transition. A rejected operation may change no domain state but still create a safe audit record. An asynchronous operation can accept work, record an interim state, and complete or fail later. The quality question is whether the contract and evidence distinguish those possibilities.

For a fictional cancellation operation, a compact state model might be:

| Current order state | Requested operation | Precondition | Intended result |
|---|---|---|---|
| pending_payment | Cancel order | Order is not captured or fulfilled. | Order becomes cancelled; no payment capture or fulfilment instruction is created. |
| accepted | Cancel order | Fulfilment has not committed irreversibly. | Order becomes cancellation_pending or cancelled according to the contract. |
| fulfilled | Cancel order | None for ordinary cancellation. | Operation is rejected or routed to a distinct return process. |
| cancelled | Cancel order again | Cancellation is already represented. | Contract defines a stable result, rejection, or safe repeated outcome. |

The table does not prescribe the only valid order lifecycle. It shows why an operation name alone is weak evidence. The same cancellation request can be valid, invalid, a repeat, or a different business process depending on current state and contract.

## Validation Is More Than Schema Validation

Validation determines whether an operation may proceed under the relevant representation, business, state, and policy conditions. It is often discussed as one step, but different questions are involved.

| Validation concern | Example | Evidence question |
|---|---|---|
| Representation or schema validation | A required field is missing or the media type is unsupported. | Was the input readable and structurally acceptable under the declared interface? |
| Field validation | Quantity is negative or a supplied value has an invalid format. | Was the individual value within the operation’s declared constraint? |
| Business-rule validation | An order exceeds a customer’s permitted credit limit. | Does the request satisfy domain rules that apply independently of request syntax? |
| State-precondition validation | A payment capture is requested after cancellation. | Is the operation allowed from the current authoritative state? |
| Authorization-related validation | The caller attempts an operation outside its permitted scope. | Was a protected operation rejected safely without disclosing unnecessary detail? |

The layers can overlap. A value might be structurally a valid date but violate a booking window. An authenticated caller might be unauthorised for one order. A request can pass all representation checks but still conflict with state changed by another request.

### Validation order is a design decision

Teams often want one fixed validation order. In practice, the order depends on information-disclosure risk, dependency cost, consistency requirements, diagnostics, and the contract. A service may reject malformed input before consulting state. It may avoid revealing resource existence before checking caller credentials. It may check a state precondition before invoking a costly dependency. It may need to coordinate validation and state change closely enough that a competing request cannot invalidate a previously checked condition.

The Quality Engineer’s question is not “which validation layer is always first?” It is “which observable result is safe and correct when more than one condition fails, and what state or side effect must not occur?”

## Errors Are First-Class Stateful Behaviour

An error response is a contract outcome. It may say that an input was malformed, a value was invalid, a resource is absent or concealed, a precondition failed, current state conflicts, work is unavailable, or a dependency condition prevented completion. The status, representation, and any safe diagnostic metadata should support a consumer’s next action without overstating the underlying state.

| Condition | Example API concern | Stateful evidence question |
|---|---|---|
| Malformed or unsupported input | The body cannot be interpreted under the declared representation. | Was any domain state or side effect avoided? |
| Invalid business value | Quantity exceeds a policy limit. | Was the rejection based on the intended rule and did state remain unchanged? |
| Unsupported transition | A fulfilled order is sent through ordinary cancellation. | Which current state made the operation unavailable, and what alternative process is defined? |
| Missing or concealed resource | The caller cannot access an order representation. | Does the response reveal only information the contract permits? |
| Conflict or failed precondition | Another request changed the relevant order state. | Can the consumer recognise stale or competing state and decide safely? |
| Dependency failure or timeout | Payment service response is unavailable or delayed. | Did the API apply any state or side effect before reporting the condition? |

RFC 9457 defines a standard format for problem details in HTTP APIs.[^rfc9457] It can structure error details, but it does not prove whether an operation had no effect, partial effect, or a pending result. The error contract must say what the response establishes and where a consumer can obtain follow-up evidence.

## Idempotency: Protocol Property and Application Promise

Chapter 2 introduced HTTP method idempotency. At protocol level, an idempotent method has the same intended effect on the server when the same request is made more than once; response details can differ.[^rfc9110] That property applies to method semantics, not automatically to a customer operation, a message, or every downstream side effect.

**Application-level idempotency** is a contract and design property in which repeated delivery of the same logical client intent has an equivalent intended outcome. It must state what counts as the same intent, how long the rule applies, what result a repeat receives, and which side effects must not occur more than once.

| Question | HTTP method property | Application-level concern |
|---|---|---|
| What repeats? | An identical request using a method. | One logical customer action, possibly retried with the same intent identifier. |
| What must remain equivalent? | The intended effect requested by the method. | Relevant state, financial effect, event, notification, and consumer-visible outcome. |
| What can differ? | Logs, history, timestamps, and response details can differ. | The contract may return a stored result, a current state, or a pending outcome; it must define safe interpretation. |
| What establishes it? | RFC method semantics. | Explicit API contract, state model, duplicate handling, and evidence. |

An **idempotency key** is an application-defined identifier used to associate repeated submissions with one logical intent. It can help a provider recognise a retry after an unknown outcome. A key is not magic: a team must define its scope, caller binding, payload consistency rule, retention period, conflict behaviour, and response semantics. Those are implementation and product decisions, not rules imposed by HTTP.

The Amazon Builders’ Library describes one organisation’s practice for making retries safe with idempotent APIs.[^aws-idempotency] It is useful practitioner guidance, not a universal implementation requirement.

## Retries and Duplicate Requests

Duplicate requests arise from normal distributed-system conditions:

- a caller times out after sending a request;
- a client, gateway, or network component retries;
- a user resubmits after an ambiguous customer interface;
- a message is redelivered; or
- two client instances submit the same intended action.

The difficult condition is the **unknown outcome**: the caller cannot determine whether the provider received or applied the first attempt. Retrying can improve availability for a safely repeatable operation; it can also duplicate a payment, reservation, event, notification, or record.

Do not promise “exactly once” merely because an API accepts an idempotency key. The useful contract claim is narrower: which state changes and side effects are deduplicated for a defined client intent under defined conditions, and what evidence can detect an ambiguous or partial result?

## Partial Success and Side Effects

An operation can partly succeed when one consequence is applied and another fails, is delayed, or cannot be confirmed. For example, an order API might persist an order, fail before a fulfilment message is published, or send a payment request but lose the provider response. A binary “success or failure” response model can conceal these intermediate realities.

| Observed result | Possible underlying condition | Evidence needed before a stronger claim |
|---|---|---|
| 202 Accepted | Work was recorded for later processing. | A state, processing resource, or event that distinguishes pending, completed, and failed work. |
| Timeout at the caller | The provider might not have received, might have applied, or might still be processing the request. | Correlated authoritative state and applicable duplicate-handling evidence. |
| Error after a dependency call | Local state may be unchanged, partially changed, or awaiting reconciliation. | Defined state observation, dependency record where safe, and recovery rule. |
| Success response | Primary state might be applied while an event, notification, or downstream call fails later. | Evidence for the particular side effect and its reconciliation or retry behaviour. |
| Repeat response | The provider might have returned an earlier result, current state, or a conflict. | The application-level repeat contract and intent identifier. |

**Atomicity** is the property that a defined group of effects is treated as one indivisible unit from the relevant observer’s perspective. It is a useful concept, not a promise that every distributed API can make all downstream effects indivisible. Where an operation spans a database, payment provider, notification service, and event consumer, a team may need explicit interim states, reconciliation, and recovery evidence instead of claiming one universal transaction.

The Quality Engineer should identify the effect that matters to the customer or business, then ask whether the contract describes its relationship to the primary state. “Order record exists” is not interchangeable with “customer was charged once” or “warehouse was instructed once.”

## Concurrency: Valid Requests Can Conflict

**Concurrency** occurs when operations overlap in time or are observed without one total, agreed ordering. It is not limited to multiple threads in one process. Two browser sessions, a mobile client and support tool, an event redelivery and a retry, or two services acting on the same order can all create concurrent API behaviour.

A **race condition** exists when the result depends on the timing or ordering of such operations and the contract does not safely constrain that dependency. A **lost update** occurs when one accepted update overwrites another relevant update without the intended conflict detection or merge rule.

| Concurrent situation | Risk | Contract and evidence question |
|---|---|---|
| Two clients change the same delivery address. | One update silently replaces the other. | Is there a version, precondition, merge rule, or visible conflict outcome? |
| Retry and original request both reach payment capture. | Duplicate financial side effect. | How does the provider identify one client intent and which effect must be unique? |
| Cancellation overlaps fulfilment confirmation. | Contradictory states or an unsafe customer promise. | Which transition has priority, and what state represents a contested outcome? |
| Two customers reserve the last item. | Oversell or inconsistent availability. | What authoritative capacity rule is applied, and what does rejection or pending mean? |
| Event delivery follows a later state update. | Consumer applies stale information. | Is ordering guaranteed, detectable, irrelevant, or reconciled? |

The purpose is not to predict every interleaving. It is to identify operations whose combined timing could violate a state invariant, such as “a payment is captured at most once for one order” or “a fulfilled order cannot return to pending.” A **state invariant** is a condition that must remain true across allowed transitions. It provides a better oracle than “both requests returned a plausible response.”

### Optimistic concurrency and conditional operations

**Optimistic concurrency** is an approach in which a client acts using a version or validator it previously observed, and the provider rejects or otherwise handles the operation if the relevant state changed. For HTTP APIs, an ETag can identify a selected representation and If-Match can make a request conditional on a matching validator. A false condition normally produces 412 Precondition Failed; RFC 9110 also permits a 2xx response for a state-changing operation when the server can determine that the requested change has already succeeded.[^rfc9110]

This can make a stale assumption visible. It does not automatically choose a business merge, guarantee that all relevant state is covered by one validator, or replace a domain rule. A Quality Engineer should ask:

- What representation or state does the validator cover?
- Which operation must not apply to stale state?
- What does a failed condition establish for the consumer?
- Can a consumer refresh, merge, abandon, or ask for human review safely?
- What remains possible when two operations both pass a precondition before a later side effect?

These are stateful contract questions. Storage implementation and advanced concurrency algorithms are outside this chapter’s scope.

## Conditional Operations and Ordering Assumptions

A **precondition** is a condition that must hold before an operation is performed. It might be represented by an HTTP conditional field, a version value, current resource state, an expected order status, or a domain rule such as “payment has not already been captured.”

Preconditions and ordering are related but distinct. A request may have a valid precondition when received and still encounter a later competing action. An event may arrive in an order that is valid for transport but not sufficient for a consumer’s state model. Do not assume that request arrival order, response order, event order, and customer-observed order are identical unless the contract explicitly establishes that they are.

Useful questions include:

- Which state or version makes this operation valid?
- What response represents a stale, conflicting, duplicate, or already-completed request?
- Which effect must happen before another effect becomes visible?
- Is ordering guaranteed, detected, made irrelevant, or reconciled?
- What observation reveals that a state invariant was preserved under the selected competing conditions?

Chapter 7 will address dependent and asynchronous APIs in more depth. Here, ordering is included only where it changes the interpretation of a stateful API operation.

## Failure Evidence for Stateful Behaviour

Stateful evidence should connect an operation to the state and effects that matter. The following is an **MSQE educational stateful-evidence prompt**:

~~~text
initial state and invariant
  → operation and precondition
  → response or acknowledgement
  → authoritative new state and side effects
  → repeat, conflict, or recovery observation
  → limitation and residual risk
~~~

| Quality question | Useful observation | Important limitation |
|---|---|---|
| Did invalid input fail safely? | Selected error outcome plus authoritative unchanged state. | Does not establish every policy or concurrent input condition. |
| Did a retry create one logical outcome? | Correlated intent, authoritative state, and selected side-effect evidence. | Does not prove every client, network, or dependency retry path. |
| Did a conflict prevent a stale update? | Conditional failure or conflict response plus current representation. | Does not decide how the user should merge domain changes. |
| Did a partial failure remain recoverable? | Defined interim state, safe diagnostics, and recovery observation. | Does not establish every production outage or reconciliation delay. |
| Did competing requests preserve an invariant? | Controlled competing operations and authoritative resulting state. | Does not prove all schedules, load levels, or distributed participants. |

The method should be proportionate. A small API state check may be sufficient for a narrowly defined rejection rule. A payment or reservation risk may need evidence across state, deduplication, downstream effects, and a customer or support outcome. Passing activity must not be presented as proof of concurrency safety beyond the conditions observed.

## Stateful API Test Design

Part III introduced state-transition and boundary reasoning. At an API boundary, a useful test-design unit is not simply method plus status. It is:

~~~text
relevant initial state
  → operation and request condition
  → expected immediate outcome
  → expected state and side effect
  → follow-up or repeat observation
  → known limitation
~~~

For Atlas, a selected cancellation check might begin from a known pending-payment order, submit a cancellation request, observe the defined response, confirm the authoritative cancellation state, confirm that capture was not initiated, repeat the logical intent if the contract allows it, and state that the check does not prove every payment-provider or concurrent-fulfilment path.

This approach does not require a large end-to-end suite. It makes each selected activity honest about the state, operation, effect, and boundary it represents.

## QA → QE Transition

| Existing QA activity | Expanded Stateful API Quality Engineering practice |
|---|---|
| Send one valid request and assert success. | State the initial condition, expected transition, side effect, and unobserved outcome. |
| Verify invalid input returns an error. | Check whether relevant state and harmful side effects remained unchanged. |
| Re-run a request to see what happens. | Define one logical intent, repeatability rule, duplicate-effect risk, and expected recovery evidence. |
| Test two requests independently. | Consider their overlap, shared invariant, conflict outcome, and authoritative final state. |
| Report a timeout. | Distinguish not received, pending, partly applied, completed, and safely repeatable conditions. |

The transition is from testing isolated calls to reasoning about API behaviour over time. Quality Engineers help teams expose the state rules and evidence needed for reliable decisions; they do not become the sole owner of all concurrency design.

## Engineering Perspective

Stateful API quality is largely a design question made visible through evidence. Ambiguous preconditions, missing interim states, hidden side effects, unsafe retry behaviour, and undefined conflict handling create operational and customer risk before a tester writes a check.

The right improvement may be a clearer state model, an idempotency rule, an explicit pending outcome, a conditional operation, a safe diagnostic identifier, or a recovery path. It may also be a decision that a known limitation needs specialist review. Quality Engineering adds value by connecting the risk to the stateful contract and evidence boundary without claiming that one test can certify the whole system.

## Industry Perspective

RFC 9110 defines HTTP method idempotency, conditional requests, ETags, and 412 Precondition Failed semantics.[^rfc9110] RFC 9457 defines a standard problem-details format for HTTP APIs.[^rfc9457] The Amazon Builders’ Library provides practitioner guidance on retries and idempotent API operations.[^aws-idempotency]

The RFCs define protocol semantics; the Amazon article describes one organisation’s practice. None prescribes a universal idempotency key, transaction model, error design, or concurrency implementation. The stateful-operation and stateful-evidence models in this chapter are MSQE educational framing.

## Common Misconceptions

### “HTTP is stateless, so the API has no state.”

Protocol statelessness does not remove application state, state transitions, policies, history, or side effects. An API can be stateless at the protocol layer and intensely stateful in its business behaviour.

### “A valid request that returns success has completed safely.”

It may have completed a selected immediate operation. It does not automatically establish authoritative state, unique side effects, downstream completion, or a safe repeat after an unknown outcome.

### “POST cannot be idempotent.”

POST has no protocol-defined idempotent method property. A particular POST operation can still define application-level repeatability for the same client intent. The contract must make that rule explicit.

### “An idempotency key guarantees exactly once.”

A key can support a defined deduplication rule. It does not make every dependency, side effect, timeout, or concurrent action globally exactly once.

### “A 412 response solves concurrency.”

It can expose a false precondition for a defined validator. It does not decide domain merging, cover every shared resource, or replace a clear state model.

## Summary

Stateful API behaviour is the path from relevant current state through a request, preconditions, outcome, new state, and possible side effects. Validation, errors, retries, duplicates, partial success, and concurrency all change what a response can establish.

Quality Engineering makes this path explicit. It asks which invariant matters, what state must exist before and after the operation, which effects must be unique, what a retry means, how conflicts are represented, and what evidence reveals safe failure or residual uncertainty. The result is stronger than a collection of independent request/response checks.

## Key Takeaways

- Stateless HTTP can support stateful application behaviour.
- A state-changing API operation should state its relevant preconditions, transition, effects, and outcome.
- Validation includes structural, field, business, state, and awareness-level authorization concerns.
- Errors are stateful contract outcomes and may not prove that nothing changed.
- HTTP idempotency and application-level idempotency answer different questions.
- Retries and duplicate requests require an explicit logical-intent and side-effect rule.
- Partial success requires interim states, recovery, and evidence—not a misleading binary result.
- Concurrency reasoning begins with shared invariants, competing transitions, and authoritative final state.
- Conditional operations can expose stale assumptions but do not solve all domain conflicts.

## Review Questions

1. How can an HTTP API be protocol-stateless while its application behaviour is stateful?
2. What information should a state-transition model include for an API operation?
3. Why is structural validation insufficient before a state-changing operation?
4. How can validation order affect safe API behaviour?
5. Distinguish HTTP method idempotency from application-level idempotency.
6. What makes an unknown timeout outcome dangerous for a retry?
7. Give an example of partial success that a response alone cannot explain.
8. What is a lost update, and how can a contract make it visible?
9. What can an ETag and If-Match condition establish, and what does it not decide?

## Interview Questions

1. How would you investigate a request that timed out after a payment provider might have received it?
2. What should an API contract say about repeated order-submission requests?
3. How would you test a cancellation operation that can race with fulfilment?
4. When is a 412 response useful, and what additional information might a consumer need?
5. How do you communicate concurrency-test limitations to a release decision-maker?

## Practical Exercise

### Model a Stateful API Operation

**Objective:** Produce a **State and Side-Effect Evidence Model** for a fictional Atlas Commerce order-cancellation operation. Reason about transitions, side effects, retries, and concurrency; do not implement an API.

**Illustrative operation:**

~~~http
POST /v1/orders/ord-701/cancellation HTTP/1.1
Content-Type: application/json
Idempotency-Key: cancel-ord-701-01

{ "reason": "customer_request" }
~~~

Atlas documents these starting states: **pending_payment**, **accepted**, **fulfilment_committed**, and **cancelled**. Payment capture and fulfilment instruction are side effects that must not be created after a successful cancellation. The client may retry after a timeout. A warehouse action can commit fulfilment while cancellation is in progress.

**Tasks:**

1. Create a state and transition table for the listed starting states, including valid, invalid, pending, and repeated cancellation outcomes.
2. Identify representation, business-rule, state-precondition, and authorization-awareness validation concerns.
3. State which state and side effects must remain unchanged for each rejected transition.
4. Define the logical intent represented by the idempotency key and list the rule it must make explicit.
5. Identify duplicate-request, timeout, partial-success, and competing-transition risks.
6. Describe a controlled evidence sequence for selected state, side-effect, retry, and conflict questions. State the limitation of each.
7. Write a residual-risk statement for a release decision-maker, including the warehouse concurrency condition.

**Expected artifact:** A three- to four-page State and Side-Effect Evidence Model containing a state table, invariants, validation and error outcomes, repeatability rules, competing-operation analysis, evidence plan, and residual-risk statement.

**Constraints:** Atlas Commerce is fictional. Do not implement a database, queue, payment integration, lock, retry library, or API test. Do not claim that an idempotency key provides universal exactly-once processing.

## Further Reading

- [Chapter 2 — Interface Semantics: HTTP, Representations, and API Styles](chapter-02-interface-semantics-http-representations-and-api-styles.md) — protocol context for conditional operations and response meaning.
- [Part III, Chapter 9 — Service, API, and Distributed-System Testing Strategy](../../part-03-software-testing/chapters/chapter-09-service-api-and-distributed-system-testing-strategy.md) — complementary context for interaction and failure evidence.

## References

[^rfc9110]: Fielding, R., Nottingham, M., and J. Reschke, eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). IETF, June 2022. Accessed 2026-08-10.
[^rfc9457]: Nottingham, M., Wilde, E., and S. Dalal. [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html). IETF, July 2023. Accessed 2026-08-10.
[^aws-idempotency]: Featonby, M. [Making retries safe with idempotent APIs](https://aws.amazon.com/builders-library/making-retries-safe-with-idempotent-APIs/). Amazon Builders’ Library, 2021. Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish protocol statelessness from stateful application behaviour;
- [ ] model an operation using relevant state, preconditions, effects, outcome, and limitation;
- [ ] explain why an error or timeout does not necessarily prove that nothing changed;
- [ ] distinguish method idempotency from an application-level repeatability promise;
- [ ] identify a shared invariant and a competing-operation risk; and
- [ ] select evidence for a stateful claim without overstating concurrency or exactly-once assurance.

**Next:** Chapter 5 will examine API data quality, queries, collections, and representational integrity.
