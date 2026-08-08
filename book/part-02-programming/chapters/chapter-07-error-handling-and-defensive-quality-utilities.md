# Chapter 7 — Error Handling and Defensive Quality Utilities

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 7 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 2–6, especially runtime validation, module boundaries, and bounded asynchronous work |
| Estimated study time | 145 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Failure is evidence. Preserve its meaning long enough for the right boundary to make the next decision.

## Opening Story

The following illustrative scenario concerns a utility that prepares a release-quality report. It loads a fixture, polls a local result store, writes a summary, and removes a temporary file. Its top-level `catch` returns `false` for every problem. A malformed fixture, a temporary dependency failure, a polling timeout, a file-write error, and a cleanup failure all reach the same dashboard as “report failed.”

The result is technically truthful only in the weakest sense. It does not tell the operator whether to correct configuration, investigate a service, retry an idempotent read, fix a programming defect, or preserve a report that was already written. Worse, when cleanup throws inside `finally`, it can obscure the primary failure that prompted cleanup.

A defensive redesign does not require a vast exception hierarchy. It requires decisions. Which boundary validates input? Which failures can the caller handle? Which context is safe to preserve? What resource does this code own? When should execution stop immediately, and when is a reduced but clearly labelled result useful? This chapter makes those questions part of the utility's contract.

## Why This Chapter Matters

Quality utilities sit at boundaries where failure is normal: files can be missing, configuration can be malformed, data can be incomplete, dependencies can reject a request, and an assertion can reveal unexpected product behaviour. Collapsing these conditions into `false`, `undefined`, or “something went wrong” produces weak evidence and often sends engineers toward the wrong response.

This chapter teaches deliberate failure semantics for small TypeScript utilities. It covers exceptions, rejected promises, propagation, validation, wrapping, causes, cleanup, defensive checks, and result-oriented outcomes. It does not define a general enterprise error platform, replace application-domain error design, or teach incident management. Chapter 6 owns timing and retry reasoning; Chapter 8 uses the evidence preserved here to diagnose a failure; Chapter 9 improves such code without altering its observable contract.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish invalid input, dependency failure, timeout, expected negative result, and programming defect;
- explain how `throw`, rejected promises, `try`, `catch`, and `finally` affect control flow;
- decide when an error should propagate, be translated at a boundary, or be represented as a normal result;
- create useful, safe error messages that identify an operation, relevant context, observed condition, and underlying cause where appropriate;
- validate external inputs at a proportionate boundary using `unknown` rather than assuming a caught value is an `Error`;
- assign cleanup ownership and preserve primary failure evidence when cleanup also fails; and
- apply defensive programming without duplicating checks or turning every utility into a framework.

## Failure Has More Than One Meaning

### A practical failure taxonomy

The following categories are teaching distinctions, not an industry standard or a mandatory class hierarchy. They help a caller decide what the evidence means and what response remains reasonable.

| Category | Example | Typical caller response |
|---|---|---|
| Invalid input | A required configuration value is blank; a JSON record has the wrong shape. | Correct the input; do not retry unchanged input. |
| Dependency failure | A fixture read fails, a local simulated store rejects, or a service boundary is unavailable. | Investigate the dependency; retry only when explicitly classified and safe. |
| Timeout | Polling did not observe its completion condition within the declared window. | Investigate the last state, timing assumption, dependency, and check design. |
| Expected negative result | A validation runs successfully and finds that a required condition is not met. | Report the failed evidence; it is not an exception in the utility's execution. |
| Programming defect | A supposedly exhaustive branch is missing or an invariant is violated. | Fix the utility; do not present it as ordinary product evidence. |

An expected negative result is particularly important for QA Engineers. A check may correctly complete and conclude that `POST /orders` returned an unacceptable response. That is quality evidence, not necessarily a failure of the checking utility. A malformed test fixture is different: the utility cannot honestly claim to have evaluated the intended evidence population.

### Exceptions and rejected promises

`throw` stops normal execution of the current path and searches for a matching handler. In an `async` function, a thrown error results in a rejected promise. A caller can use `await` inside `try`/`catch` to decide what to do at its own boundary.

```ts
try {
  const sourceText = await fileSystem.readUtf8(inputPath);
  return parseQualityExecutionResults(JSON.parse(sourceText));
} catch (error: unknown) {
  throw new QualityUtilityError(
    "dependency-failure",
    "Could not load quality evidence from the configured source.",
    { operation: "load-quality-evidence" },
    error,
  );
}
```

This wrapper adds operation and boundary context that the filesystem or parser may not know. It should not erase the underlying reason, but it also should not copy an arbitrary cause message into public diagnostics. Modern JavaScript's `cause` option supports retaining the original error object for programmatic debugging; a log or report still needs a deliberate safe representation rather than dumping arbitrary objects or messages.[^mdn-error-cause]

Do not catch an error merely to rethrow the same message. Catch where the code can add useful boundary context, release an owned resource, translate an implementation detail into a stable contract, or make a justified recovery decision. Otherwise, propagation preserves the original evidence for a higher-level caller.

## Design Boundaries That Make Failure Useful

### Validate before the trusted core

Chapter 3 established that JSON parsing produces `unknown`, not a trusted domain value. Continue that policy at every external boundary: configuration, files, environment text, responses, and untyped callbacks. Once a value has been validated, core functions can use a smaller, clearer internal type.

```ts
function readNonEmptyText(value: unknown, fieldName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new QualityUtilityError(
      "invalid-input",
      `${fieldName} must be a non-empty string.`,
      { operation: "read-quality-configuration" },
    );
  }

  return value.trim();
}
```

The validation protects a specific boundary. Repeating the same non-empty check in every downstream helper adds clutter and suggests that ownership is unclear. Defend an assumption where it first becomes the utility's responsibility, then document the trusted contract that follows.

### Keep error categories small and contextual

The companion project's `QualityUtilityError` has a small `kind` such as `invalid-input`, `dependency-failure`, or `timeout`, plus a context object containing an operation, attempt, elapsed time, observed state, or retry-exhaustion status. It is deliberately not a taxonomy for every HTTP code or business condition.

```ts
throw new QualityUtilityError(
  "timeout",
  `Timed out waiting for order-quality-check after 1,000 ms. Last observation: pending.`,
  {
    operation: "order-quality-check",
    attempt: 11,
    elapsedMs: 1_000,
    observedState: "POST /orders is pending",
  },
);
```

Useful context helps the next reader locate the failed boundary and compare expected with observed behaviour. It must not expose credentials, access tokens, authorization headers, private keys, customer payloads, or raw personally identifiable information. A correlation identifier may be appropriate if its handling is approved; its presence should not become a reason to log all request content.

A retry boundary should not erase this distinction. If an `invalid-input` failure is not retryable, the terminal result must remain `invalid-input`. If a retryable dependency failure uses every allowed **total attempt**, the terminal result can retain `dependency-failure` and state that retries were exhausted. In both cases, the utility can preserve the underlying cause object for programmatic inspection without copying its arbitrary message into user-facing output.

### Error message quality is a design concern

`Something went wrong` imposes a new investigation before the real investigation begins. A useful message answers enough of these questions to guide a safe next step:

- What operation failed?
- At what boundary did it fail?
- Which non-sensitive identifier or configuration name matters?
- What condition was expected and what was observed?
- Is there an underlying cause that a developer can inspect safely?

Avoid claiming more certainty than the utility has. “Timed out while waiting for fulfilment state; last observed state was pending” is more precise than “fulfilment service is down.” The latter might be true, but the timeout alone does not prove it.

## `finally`, Cleanup, and Resource Ownership

`finally` runs after a `try` path completes or throws, and after a `catch` path completes or throws. It is useful for cleanup of a resource the current function owns: a temporary fixture, an open handle, or an explicitly created fictional record. It is not a general place to perform unrelated work.

Chapter 1's inherited account-recovery example intentionally demonstrates a risk: an unguarded cleanup rejection in `finally` can override a pending Boolean result or obscure the original error. The lesson is not to avoid cleanup; it is to decide which failure is primary and what evidence must survive.

```ts
let primaryFailure: unknown;

try {
  return await runQualityCheck();
} catch (error: unknown) {
  primaryFailure = error;
  throw error;
} finally {
  try {
    await removeTemporaryFixture();
  } catch (cleanupError: unknown) {
    if (primaryFailure !== undefined) {
      // Preserve the primary failure; record cleanup evidence through an approved diagnostic path.
      logCleanupFailure(primaryFailure, cleanupError);
    } else {
      throw new Error("Quality check completed, but temporary-fixture cleanup failed.", {
        cause: cleanupError,
      });
    }
  }
}
```

The exact policy depends on impact. If failing cleanup makes subsequent evidence unsafe, the workflow may need to fail clearly even after the main check completed. The important point is that resource ownership, cleanup behaviour, and the primary-versus-secondary failure decision belong in the contract—not as accidental effects of language syntax.

## Fail Fast, Degrade Carefully, and Return Results Deliberately

Fail fast when continuing would create unreliable evidence: an invalid threshold, malformed fixture, missing required configuration, or violated internal invariant. Continuing with a guessed value may make a dashboard look complete while silently changing its population or policy.

Graceful degradation is different. It means deliberately returning a reduced, labelled result when a non-essential part is unavailable and the remaining evidence can still be interpreted honestly. For example, a reporting tool might publish validated execution totals while marking an optional trend comparison as unavailable. It must not quietly omit the trend and present the report as complete.

For an expected negative result, a result-oriented type can be clearer than throwing:

```ts
type ValidationOutcome =
  | { kind: "passed"; evidenceId: string }
  | { kind: "failed"; evidenceId: string; observedStatusCode: number };
```

This says the validation executed successfully and produced one of two evidence outcomes. A dependency failure that prevented execution is still a distinct error path. Use result-oriented outcomes when both results are ordinary domain possibilities that a caller should handle; use exceptions for failures that prevent the operation from honoring its normal contract. Do not force one style everywhere.

## Defensive Programming Without Defensive Clutter

Defensive programming protects real boundaries and invariants. Examples include validating external text, checking that a timeout is finite and non-negative, making a `switch` exhaustive over a small union, and refusing an operation that would exceed a known safe limit. These checks should state an assumption that matters to the current responsibility.

Over-defence duplicates validation in several layers, transforms every optional value into ceremony, or catches all errors “just in case.” That makes the actual ownership of a check harder to see and can hide programming defects. Prefer one named guard at the point an untrusted value enters, one explicit policy at the workflow boundary, and focused tests for the known failure paths. Chapter 11 will develop the testing evidence for such utilities.

## Engineering Perspective

Failure design determines whether a Quality Engineering utility produces an actionable signal or a generic red mark. Treat exceptions, result values, error categories, messages, and cleanup as part of the interface that other engineers use to decide what happened. Preserve the smallest safe set of facts needed to reproduce, classify, and route a problem.

This is also a maintainability decision. A single outer `catch` that returns `false` appears simple until a new caller needs to distinguish a timeout from invalid input. Explicit boundaries cost a few names and types now but prevent semantic repair work later. The best level of detail is proportionate: enough to guide a response, not an invented framework that every small script must adopt.

## Industry Perspective

JavaScript's `Error` options can preserve a causal error when one error is wrapped with more useful context.[^mdn-error-cause] TypeScript's `unknown` type requires code to establish what an untrusted value is before it uses it, supporting the boundary-validation approach introduced in Chapter 3.[^typescript-unknown] Node.js documentation similarly treats error handling and stack information as part of diagnosing runtime failures rather than a reason to discard context.[^node-errors]

These language facilities do not define an organisation's failure taxonomy. The MSQE teaching distinction in this chapter is a practical way to preserve evidence in small quality utilities.

## Common Misconceptions and Pitfalls

### “Every failure should be `false`.”

`false` can represent a successful negative validation result. It cannot by itself distinguish malformed input, a timeout, a dependency failure, or a utility defect.

### “Catching every error makes a utility resilient.”

An indiscriminate catch can discard a stack, hide a defect, mask a required cleanup failure, and prevent a caller from applying the correct response.

### “More context means log everything.”

Context must be relevant and safe. Credentials, secrets, private payloads, and raw customer information make diagnostics harmful rather than useful.

### “`finally` guarantees safe cleanup.”

It guarantees that the block is attempted. Cleanup can fail, and its failure can obscure the primary outcome unless the policy is deliberate.

### “Defensive programming means validating the same value everywhere.”

Repeated checks often indicate that the trusted boundary and ownership are unclear. Validate once at the appropriate boundary, then preserve a useful internal contract.

## Summary

Quality utilities need more than a catch-all error path. They need a failure contract that distinguishes invalid inputs, operational boundaries, timeouts, expected negative results, and programming defects. Wrap errors when a boundary can add context, preserve causes where useful, validate external values before the trusted core, and make cleanup ownership explicit. The result is evidence that can be investigated and acted on without leaking sensitive information.

Chapter 8 uses that evidence to move from a symptom to a disciplined diagnosis.

## Key Takeaways

- A utility failure and a negative quality result are not the same outcome.
- Catch errors where a boundary can add context, release an owned resource, translate a contract, or make a justified recovery decision.
- Preserve safe operation, boundary, expected-versus-observed, and cause information; never treat secrets as diagnostic context.
- `finally` needs an explicit policy for cleanup failure and for preserving a primary failure.
- Fail fast when continuing would make evidence unreliable; degrade only when the reduced result is clearly labelled and usable.
- Defensive checks should protect a known boundary or invariant, not create duplicated clutter.

## Review Questions

1. Why is a validation result of `false` different from a utility that cannot read its input fixture?
2. When is it useful to wrap an error with a new message and causal error?
3. What safe context should a polling timeout retain?
4. How can a cleanup failure obscure a primary failure?
5. Give an example of fail-fast behaviour and one of honest graceful degradation.
6. When would a result-oriented union be clearer than an exception?
7. Where should a utility validate an external configuration value, and why?

## Interview Questions

1. How would you redesign a test utility that turns every exception into `false`?
2. What makes an error message actionable without exposing sensitive data?
3. How would you handle a failure in cleanup after a test has already failed?
4. Which failures would you consider retryable, and which should fail immediately?
5. Explain the difference between an expected product failure and a defect in the quality utility.

## Practical Exercise

### Design Trustworthy Failure Semantics

An illustrative reporting utility uses `false` for a negative result, missing input, timeout, and cleanup failure. It catches unknown values as though they were always `Error` objects and writes the raw input payload into its logs. Redesign the utility without adding a large framework.

1. Define the failure categories and the caller's expected response to each.
2. Specify the boundary at which configuration and fixture input become trusted values.
3. Decide which conditions are normal validation outcomes and which should reject the workflow.
4. Define cleanup ownership, including the policy when both the primary operation and cleanup fail.
5. Implement useful, non-sensitive messages and demonstrate one invalid-input path, one timeout, one expected negative result, and one cleanup failure.

### Expected Deliverables

- A concise failure model and propagation diagram in prose or code comments.
- A TypeScript implementation with bounded error categories or result-oriented outcomes where appropriate.
- Example diagnostic evidence that contains no secret or customer data.
- A design rationale explaining validation, cleanup, and caller responsibilities.

### Stretch Challenge

Add a small `cause`-preserving wrapper at one external boundary and show how the caller can inspect the category without relying on a fragile message comparison.

## Practical Resources

- [Delivery 3 Reliable Quality Utilities](../../../code/part-02-programming/delivery-03-reliable-quality-utilities/README.md) — contextual errors, classified retries, and deterministic failure scenarios.

## Further Reading

- MDN Web Docs. [Error: `cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause).
- TypeScript. [The `unknown` type](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown).
- Node.js. [Errors](https://nodejs.org/api/errors.html).
- IEEE Computer Society. [Software Engineering Body of Knowledge topics](https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics).

## References

[^mdn-error-cause]: MDN Web Docs. [Error: `cause`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/cause). Accessed 2026-08-08.

[^typescript-unknown]: TypeScript. [More on Functions: `unknown`](https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown). Accessed 2026-08-08.

[^node-errors]: Node.js. [Errors](https://nodejs.org/api/errors.html). Accessed 2026-08-08.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish invalid input, a dependency failure, a timeout, an expected negative result, and a programming defect.
- [ ] Decide where an error should propagate and where it should gain contextual meaning.
- [ ] Produce a useful error message without exposing secrets or sensitive payloads.
- [ ] State who owns cleanup and what happens if cleanup also fails.
- [ ] Use `unknown` safely for untrusted values and caught errors.
- [ ] Explain when a result-oriented outcome is clearer than throwing an exception.
- [ ] Identify a defensive check that protects a real boundary without duplicating clutter.
