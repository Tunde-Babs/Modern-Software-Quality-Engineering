# Chapter 6 — Asynchronous Programming for Reliable Quality Feedback

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 6 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–5, especially explicit functions, modules, configuration boundaries, and deterministic fixtures |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Time is part of a quality check's contract. Treat it as evidence to reason about, not a delay to hide.

## Opening Story

The following illustrative scenario concerns a release-validation utility for an order service. A check creates a fictional order, waits five seconds, then asks whether the order appears in a fulfilment view. Most runs pass. Some fail in a busy environment; some pass only because five seconds is longer than necessary. When the team shortens the wait, failures increase. When it lengthens the wait, the pipeline becomes slower without becoming easier to trust.

The problem is not that the team used `await`. The check has no stated completion condition, no bounded explanation of how long it is willing to wait, and little evidence about the last state it observed. It also runs several dependent checks concurrently because that seemed faster, then treats their ordering as though it were guaranteed.

A Quality Engineer reframes the task. What operation is pending? What observation would establish completion? Which operations are independent? How long is an acceptable evidence window? What should a timeout report? Is retrying the operation safe, or could a duplicate order be created? These questions turn asynchronous code from a syntax topic into an engineering decision about trustworthy feedback.

## Why This Chapter Matters

Quality Engineering utilities rarely operate only on values already held in memory. They read files, wait for a workflow to progress, call services, collect browser or job results, and write evidence. Each interaction can complete later, fail independently, or reveal a state that is still changing. Code that ignores those facts may be fast on one machine yet give slow, misleading, or flaky feedback elsewhere.

This chapter develops the reasoning needed to work with pending operations. It covers promises, `async` and `await`, sequencing, concurrency, polling, timeouts, bounded retries, and timing assumptions. It does not attempt an event-loop internals course, distributed-systems design, SRE practice, or an API-automation framework. Chapter 7 owns the broader design of failure semantics; Chapter 8 owns systematic diagnosis; and Chapter 9 owns safe structural improvement.

The goal is not to eliminate uncertainty. It is to make the uncertainty that remains explicit, bounded, and useful to the next engineering decision.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish synchronous work from asynchronous work and explain what a pending promise represents;
- use `async` and `await` to make a required sequence visible without assuming that waiting makes a condition true;
- choose sequential or concurrent execution based on dependencies, ordering, resource use, and diagnostic needs;
- explain the different evidence contracts of `Promise.all` and `Promise.allSettled`;
- identify timing assumptions, race conditions, and arbitrary sleeps in a quality utility;
- design a bounded polling operation with an explicit completion condition, interval, timeout, and final diagnostic state;
- distinguish a retryable transient failure from a deterministic failure and define **idempotency** before recommending a retry; and
- explain how asynchronous design choices affect the reliability and interpretation of quality evidence.

## Time Changes the Meaning of a Check

### Synchronous and asynchronous execution

Synchronous code completes one operation before control proceeds to the next statement. A pure calculation such as `summariseQualityExecutionResults` from Chapter 5 is normally synchronous: it receives trusted values, returns a summary, and has no reason to wait for an external event.

An asynchronous operation starts work whose useful result is not available immediately. Reading a file, waiting for a background job, or requesting a service result may complete later. JavaScript represents the eventual outcome with a **promise**. A promise is pending while the outcome is unknown, fulfilled when it completes with a value, or rejected when it completes with a failure reason. These states describe one asynchronous result; they do not guarantee that the external system has reached a business state that a check needs.

```ts
async function readQualityFixture(fileSystem: { readUtf8(path: string): Promise<string> }): Promise<string> {
  return fileSystem.readUtf8("fixtures/quality-executions.json");
}
```

Calling `readQualityFixture` immediately returns a `Promise<string>`. The function has initiated or delegated the read; it has not yet supplied the text. Marking a function `async` also means that a thrown error becomes a rejected promise for its caller to await or handle.

The event loop is relevant only at this depth: JavaScript can continue with other eligible work while an asynchronous operation is pending, and later resumes the continuation associated with a settled promise. Do not infer a precise business ordering merely because two calls appear in source code. Make required ordering explicit.

### `await` is a dependency statement

`await` pauses the current `async` function until the named promise settles. It does not block the whole runtime in the same way as a busy loop, and it does not turn an unreliable external boundary into a reliable one. It tells a reader: this next statement needs the result or failure of this operation.

```ts
const sourceText = await fileSystem.readUtf8(inputPath);
const rawValue: unknown = JSON.parse(sourceText);
const results = parseQualityExecutionResults(rawValue);
```

This sequence is appropriate because parsing needs text and validation needs the parsed value. Reversing it would have no useful meaning. The `await` points make the dependencies reviewable.

The following pattern communicates a different, often accidental policy:

```ts
const serviceOne = await collectServiceOneResult();
const serviceTwo = await collectServiceTwoResult();
```

If the two collections are independent, the second cannot start until the first settles. That may be intentional when resources are constrained or when the first result determines whether the second collection is safe. If neither condition holds, the delay is unnecessary and the code has hidden a concurrency decision in its layout.

## Sequence, Concurrency, and Outcome Contracts

### Keep a required sequence sequential

Some operations must remain ordered. A check may create a fixture, receive its identifier, request a state transition, then verify the resulting state. Starting verification before the state-transition request can reach the dependency is a race condition: the observed result depends on the relative timing of independent execution paths rather than a stated order.

```ts
const createdOrder = await createFictionalOrder();
await requestFulfilment(createdOrder.id);
const fulfilment = await readFulfilment(createdOrder.id);
```

This example still does not prove that the fulfilment view is current. It does prove that the verification request follows the request that created the condition. A later polling loop can define the evidence needed for eventual completion.

### Start independent work concurrently

When validations do not depend on one another, start their promises before waiting for the combined outcome:

```ts
const cataloguePromise = validateCatalogue();
const ordersPromise = validateOrders();
const accountPromise = validateAccounts();

const results = await Promise.all([cataloguePromise, ordersPromise, accountPromise]);
```

The operations may now be in flight at the same time. This can reduce elapsed time, but it also changes resource use, failure handling, ordering, and diagnostic behaviour. A shared test account, a rate-limited dependency, or a database fixture that must be cleaned up in a particular order may make concurrent work unsafe or less interpretable.

`Promise.all` fulfills only if every input promise fulfills. It rejects when an input rejects; its array of values is ordered by the input array, not by completion time.[^mdn-promise-all] This is useful when the workflow cannot continue without every result. It is not a report of every outcome after the first rejection.

```ts
const outcomes = await Promise.allSettled([
  validateCatalogue(),
  validateOrders(),
  validateAccounts(),
]);
```

`Promise.allSettled` waits for every supplied promise to settle and reports each as fulfilled or rejected. Use it when the quality question requires a complete collection of independent outcomes, such as a diagnostic report across services. The caller must still decide what a rejected validation means; converting every rejection to a green result would destroy evidence. The choice is not “fast” versus “safe.” It is an evidence-contract decision.

### Ordering is not completion order

Concurrent operations can finish in any order. Code must not assume that the first completed request corresponds to the first input, or that a later service view already reflects an earlier write. Give observations stable identifiers, retain timestamps only when they help interpretation, and state the relationship being checked. A result collection should answer a question such as “did each named independent validation complete?” rather than “which promise happened to settle first?”

## Timing Assumptions Create Fragile Evidence

### The arbitrary-sleep anti-pattern

An arbitrary fixed wait is easy to write:

```ts
await sleep(5_000);
const fulfilment = await readFulfilment(orderId);
```

It also silently embeds a claim: five seconds is long enough in every relevant environment and short enough to keep feedback useful. That claim is rarely established. A fixed delay can create unnecessarily slow execution, false failures when a dependency needs longer, environment-sensitive behaviour, and hidden assumptions that reviewers cannot relate to a business condition.

Fixed waits are not universally forbidden. A deliberate delay may be appropriate when an external protocol requires a minimum interval, when an interface animation is the subject of a focused check, or when rate protection requires spacing. In those cases, document why the delay exists, make the duration a named policy value, and do not mistake it for evidence that a separate condition has completed.

### Replace waiting by time with waiting for evidence

For a state that becomes visible later, define a completion condition and repeatedly observe it within a bounded time window. This is **polling**. A useful polling contract states:

- the operation to observe;
- the predicate that means complete;
- the interval between observations;
- the timeout, which limits waiting; and
- the final observed state to report if the timeout expires.

The Delivery 3 companion project expresses that contract as a small reusable boundary:

```ts
const result = await pollUntil({
  operationName: "order-quality-check",
  operation: readOrderQualityState,
  isComplete: (observation) => observation.state === "complete",
  describe: (observation) => `${observation.endpoint} is ${observation.state}`,
  timeoutMs: 1_000,
  intervalMs: 100,
  clock,
});
```

The explicit predicate prevents a common mistake: treating “the request returned successfully” as “the required state is present.” The timeout turns an unbounded hang into an interpretable failure. The description supplies a useful diagnostic, such as `POST /orders is pending`, rather than only `timed out`.

The interval is a trade-off. A very short interval increases observation load; a very long interval delays evidence after the condition becomes true. The appropriate values depend on the operation, environment, impact, and dependency constraints. The companion uses virtual time so that it can demonstrate the reasoning repeatably; it does not propose `100 ms` or `1,000 ms` as universal production values.

### Eventual consistency is a condition to model, not an excuse

**Eventual consistency** means that related views of a system may temporarily show different states after a successful change and later converge. It can arise from asynchronous processing, replication, queues, caches, or deliberate workflow design. A Quality Engineer should not use the label to excuse every delayed result. Instead, identify the expected convergence condition, the ownership boundary, the acceptable evidence window, and the diagnostic information needed if convergence does not occur.

Polling is appropriate only when the system contract reasonably expects a state to become visible within a known bounded period. A permanent validation error, malformed request, or missing required configuration does not become correct because it is polled longer.

## Timeouts and Retries Have Different Jobs

### A timeout is an outcome with evidence

A timeout says that the utility did not establish its completion condition within its declared evidence window. It does not automatically say that the dependency is broken, that the product has failed, or that the check is wrong. Its value comes from the context preserved with it: operation name, elapsed time, attempts, last observed state, and a safe identifier where appropriate.

Do not catch a timeout and replace it with `false` unless the caller's contract explicitly says that a Boolean is sufficient and the diagnostic evidence is preserved elsewhere. Chapter 7 develops failure categories and propagation. Here, make the waiting boundary visible and bounded.

### Retry only a classified transient failure

A retry starts an operation again after a failure. It is not “run failed code again until it passes.” A transient failure may plausibly succeed on a later attempt—for example, a local dependency signals temporary unavailability. A deterministic failure, such as invalid input, an unsupported configuration, or a rejected business rule, will usually not improve by repetition.

Before retrying, ask whether the operation is **idempotent**. An operation is idempotent when performing it more than once has the same intended externally observable effect as performing it once. Reading a named result is typically idempotent. Creating an order, charging a payment, or sending a notification may not be unless the interface supplies a stable idempotency key or another duplicate-protection mechanism. A transport timeout can leave the caller uncertain whether the original request took effect; that uncertainty makes retry design especially important.

The companion makes the retry boundary explicit:

```ts
const result = await retryBounded({
  operationName: "local-result-store-read",
  operation: readEvidence,
  shouldRetry: isRetryableDependencyFailure,
  maxAttempts: 2,
  delayMs: 50,
  clock,
});
```

This code has a finite attempt limit and asks the caller to classify retryability. It does not pretend the helper can infer business safety. Production services may require exponential backoff, jitter, shared retry budgets, cancellation, and load-shedding decisions. Those are system-level concerns; Google SRE cautions that unbounded or layered retries can amplify load and contribute to cascading failure.[^google-sre-retries] The first responsibility of a Quality Engineering utility is to avoid masking deterministic defects or silently multiplying work.

### Backoff is a policy, not a magic formula

**Backoff** increases or otherwise spaces the delay between retry attempts. Its purpose is to reduce immediate repeat load and allow a transient condition time to clear. A constant delay can be appropriate in a deterministic teaching example. In a real shared dependency, retry policy must account for system load, caller population, deadlines, and service guidance. Do not add backoff merely because a generic helper offers it; first decide whether the failure is retryable and whether a retry belongs at this layer.

## Engineering Perspective

An asynchronous quality utility is an evidence pipeline across time. Its design should let a reviewer identify the source of pending work, the condition required for success, the resource and ordering assumptions, and the point at which waiting stops. Injecting a clock or sleep function, as the companion project does, separates timing policy from wall-clock execution. That makes polling and retry behaviour repeatable without claiming that virtual time proves a live system's timing.

The most useful design is often the smallest one that preserves the needed distinction. A polling function should not become a full resilience platform. A retry helper should not make every caller retry. A concurrent collection should not hide which check failed. Maintainability and reliability improve when the contract names these decisions instead of scattering sleeps, counters, and generic catches throughout a workflow.

## Industry Perspective

JavaScript's promise combinators express different failure and completion contracts: `Promise.all` is appropriate when all results are required, while `Promise.allSettled` supports collecting every individual settlement.[^mdn-promise-all] TypeScript supports `async` functions and `await` in the JavaScript model; its static types clarify the values a continuation expects but cannot establish external timing or service state at runtime.[^typescript-async-await]

At a larger operational scale, Google SRE documents how naive retries can intensify load and recommends distinguishing retryable from non-retryable conditions, limiting attempts, and considering backoff and retry budgets.[^google-sre-retries] This chapter applies the underlying reasoning to small quality utilities; it does not prescribe a production reliability policy.

## Common Misconceptions and Pitfalls

### “`await` makes the external state ready.”

`await` waits for one promise to settle. It does not establish that a separate projection, queue consumer, or dependent system has reached the state the check requires.

### “Concurrent execution is always faster and therefore better.”

Concurrency can reduce elapsed time for independent work, but it can increase resource use, make logs interleave, obscure causality, and violate shared-data or ordering constraints.

### “A longer sleep makes a flaky check reliable.”

It may reduce one visible symptom while increasing execution time and preserving the same unsupported timing assumption. Prefer a completion condition, bounded timeout, and useful last observation.

### “Retrying proves a failure was transient.”

A later success is evidence worth recording, not proof of the original cause. Repeated attempts can hide a deterministic defect, duplicate a non-idempotent action, or distort the failure rate that a team needs to see.

### “A timeout means the product definitely failed.”

A timeout means the utility did not obtain the stated evidence in time. The root cause could be product behaviour, environment capacity, an incorrect completion condition, a test-data conflict, or the utility itself. Chapter 8 provides the diagnostic method for investigating that distinction.

## Summary

Asynchronous programming is the discipline of making pending work and its outcomes explicit. Promises represent eventual fulfillment or rejection; `await` makes a dependency visible; and concurrency must be chosen based on evidence needs rather than speed alone. Quality feedback becomes more trustworthy when it replaces arbitrary sleeps with stated completion conditions, bounded polling, timeouts that retain diagnostics, and carefully classified retries.

The next chapter builds on these boundaries by examining what the utility should do with invalid input, dependency failures, timeouts, cleanup failures, and unexpected results.

## Key Takeaways

- A promise represents an eventual outcome, not proof that a business condition is true.
- Use sequential execution for genuine dependencies; use concurrent execution only when independence and evidence needs permit it.
- `Promise.all` and `Promise.allSettled` make different promises to the caller about failure and outcome collection.
- Fixed waits can be deliberate policy, but they are weak evidence of an external condition.
- Polling should state its operation, success predicate, interval, timeout, and last observed state.
- A timeout is a bounded evidence outcome that needs context, not a generic Boolean.
- Retry only classified transient failures and only when repeating the operation is safe; idempotency is central to that judgement.

## Review Questions

1. What is the difference between a pending promise settling and an external system reaching the state that a quality check requires?
2. When would sequential execution be safer than concurrent execution even if concurrent execution appears faster?
3. What information should a useful polling timeout preserve?
4. Compare the evidence produced by `Promise.all` with the evidence produced by `Promise.allSettled`.
5. Why can `await sleep(5_000)` create both false failures and unnecessarily slow feedback?
6. Define idempotency and explain why it matters before retrying an operation after a timeout.
7. Give one example of a failure that should not be retried and explain why.

## Interview Questions

1. A test passes after a five-second delay but fails when the delay is shortened. How would you investigate and redesign it?
2. How do you decide whether asynchronous validations should run sequentially or concurrently?
3. Explain the difference between a timeout, a retry, and a polling interval to a developer reviewing a quality utility.
4. A create request times out. What questions would you ask before automatically retrying it?
5. How would you prevent a polling helper from hiding evidence when it times out?

## Practical Exercise

### Replace Timing Assumptions with Bounded Evidence

An illustrative quality workflow creates a fictional order, waits for a fixed interval, runs three validations with accidental sequencing, and reports `false` whenever any operation throws. Redesign the workflow so it produces trustworthy timing evidence.

1. State the completion condition for the order workflow and the evidence that would show it is still pending.
2. Replace the fixed wait with a polling operation that has a named timeout, a stated interval, and a final diagnostic message.
3. Identify which validations can run concurrently and which must remain sequential. Explain the shared-data, ordering, and resource assumptions behind the decision.
4. Add one bounded retry only if the simulated operation is idempotent and returns a deliberately classified transient failure.
5. Record the remaining assumptions that the local simulation cannot establish about a real environment.

### Expected Deliverables

- Revised TypeScript using a visible polling contract.
- A short timing and failure-reasoning note.
- A sample timeout diagnostic that does not expose secrets or sensitive data.
- An explanation of the chosen concurrency and retry policy.

### Stretch Challenge

Inject a virtual clock or sleep function so the polling and timeout tests are deterministic and do not need real five-second waits.

## Practical Resources

- [Delivery 3 Reliable Quality Utilities](../../../code/part-02-programming/delivery-03-reliable-quality-utilities/README.md) — deterministic polling, timeout, retry, debugging, and refactoring scenarios.

## Further Reading

- MDN Web Docs. [Using promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises).
- MDN Web Docs. [Promise concurrency](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise#promise_concurrency).
- Google SRE. [Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/).
- TypeScript. [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html).

## References

[^mdn-promise-all]: MDN Web Docs. [Promise.all()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all). Accessed 2026-08-08.

[^typescript-async-await]: TypeScript. [TypeScript 1.7: `async`/`await` support](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-1-7.html). Accessed 2026-08-08.

[^google-sre-retries]: Google. [Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/). *Site Reliability Engineering*. Accessed 2026-08-08.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain what a promise represents and what it does not establish about an external system.
- [ ] Identify an operation that must remain sequential and an independent operation that may run concurrently.
- [ ] Choose between `Promise.all` and `Promise.allSettled` based on the needed evidence.
- [ ] Replace an arbitrary sleep with a bounded polling contract.
- [ ] Design a timeout diagnostic with the operation, elapsed time, attempt count, and safe last observation.
- [ ] Define idempotency and decide whether a proposed retry is safe and justified.
- [ ] Explain how timing assumptions could distort a release or quality decision.
