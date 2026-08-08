# Chapter 11 — Testing Quality Engineering Utilities

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 11 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–10, especially explicit boundaries, asynchronous feedback, failure semantics, refactoring, and reviewable change |
| Estimated study time | 175 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Tests are evidence about a stated behaviour and risk; they are not a substitute for understanding the utility, its boundaries, or the decision it supports.

## Opening Story

The following illustrative scenario concerns a Quality Engineer who maintains a utility used to decide whether a release report is complete. The utility reads fixture data, summarizes results, polls for an export, and retries a temporary dependency failure. It has been used successfully for months, so a proposed refactor appears low risk. The engineer runs one happy-path example, sees “report ready,” and approves the change.

The next day, a configuration error is retried three times and becomes indistinguishable from a transient dependency failure. Another run times out but omits the last observed state. The utility has not simply “failed a test.” It has produced misleading evidence for people trying to make a delivery decision.

The problem is not that the team lacked a fashionable test framework. They lacked focused evidence for the utility's own contract: invalid input should remain invalid input; a threshold boundary should be explicit; a timeout should include safe context; retries should stop at the promised limit; and a refactor should preserve the observed behaviour it claims to preserve. This chapter teaches how to create that evidence for Quality Engineering code.

## Why This Chapter Matters

Quality Engineers often test products, services, pipelines, and automation. The utilities they write to create those tests and reports are also software. A parser can misclassify external data. A fixture loader can hide invalid configuration. A poller can turn a slow system into a false failure. A retry helper can suppress a permanent error. A reporting component can present counts that change a release decision.

Testing a Quality Engineering utility is therefore not a separate concern from its quality purpose. It establishes what the utility actually does under selected conditions, protects important behaviour during change, and makes residual uncertainty explicit. Good tests help an author and reviewer distinguish “the code ran” from “we have relevant evidence for this decision.”

This chapter focuses on testing TypeScript utilities owned by Quality Engineers: validators, parsers, pollers, retry helpers, transformations, configuration loaders, and report components. It does not replace Part III's broader Software Testing Engineering curriculum, nor does it teach browser automation, API testing, performance testing, security testing, or contract testing. It applies earlier programming concepts to the code that produces quality evidence.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why a Quality Engineering utility needs evidence for its own behaviour and limits;
- design code with explicit inputs, observable outputs, controlled dependencies, and deterministic behaviour where practical;
- select normal, invalid-input, boundary, error, asynchronous, and regression tests based on risk rather than implementation convenience;
- use unit and table-driven tests to express repeated behavioural cases clearly;
- test timeout and retry behaviour using an injected clock or other deterministic dependency seam;
- distinguish fakes, stubs, and mocks as dependency-control techniques and avoid over-mocking internal implementation details;
- use characterization tests to record observed behaviour before a bounded refactor; and
- interpret coverage and test failures as limited diagnostic evidence rather than universal measures of confidence.

## Quality Engineering Code Needs Its Own Evidence

The term **test** can refer to many activities: an exploratory session, a production check, a browser workflow, a code-level unit test, or a release evaluation. Here, a test is a repeatable execution that supplies controlled inputs or dependencies, observes a specified outcome, and reports a useful difference when the outcome is not met.

That definition matters because a Quality Engineering utility is often upstream of a larger quality decision. If the utility decides that a fixture is valid, whether a check is complete, or how a failure is classified, defects in the utility can create both false confidence and false alarms. Tests do not eliminate those risks, but they make selected contracts inspectable and protect them while the code evolves.

The right question is not “How do I maximize test count?” Ask instead:

- What customer, delivery, or engineering decision does this utility influence?
- Which wrong output would mislead that decision most seriously?
- Which inputs, boundaries, timing conditions, and failures make that outcome plausible?
- What small set of repeatable tests would expose those risks early?
- What important conditions remain outside this suite's evidence?

For a quality-summary utility, a boundary error may double-count endpoints and distort a release report. For a polling utility, a timeout without context may slow diagnosis. For a configuration loader, accepting malformed input may cause a check to run against the wrong environment. The tests should make those specific risks visible.

## Testable Design Makes Evidence Easier to Create

Tests become difficult when code hides the facts a test needs to control or observe. Chapters 4–9 introduced responsibilities, explicit dependencies, external boundaries, async timing, error categories, debugging, and refactoring. These design choices also create better test seams.

### Prefer explicit inputs and observable outcomes

An **observable outcome** is behaviour a caller or user can reasonably detect: a returned value, a controlled error category, a written file, a requested dependency action, or documented timing context. It is not the incidental local variable names or private helper calls used to achieve the outcome.

Compare a summary function that reads a global threshold and writes directly to the console with one that receives observations and a threshold and returns a typed summary. The second design allows a test to choose an exact input and assert an exact result. The first may require process-wide setup and output parsing before it can establish the same policy.

```ts
const summary = summariseQualityObservations(observations, 500);

assert.deepEqual(summary, {
  executionCount: 3,
  passedCount: 1,
  failedCount: 1,
  pendingCount: 1,
  slowEndpointCount: 1,
});
```

The example is intentionally small. It tests the observable summary, not whether the implementation used `filter`, a loop, or a particular helper. A later refactor can change the internal route while the useful behaviour remains protected.

### Separate policy, mechanism, and effects

Many QE utilities mix three concerns:

- **Policy:** the decision rule, such as “a response at or above this threshold is slow.”
- **Mechanism:** the calculation or control flow that applies the rule.
- **Effects:** reading a file, waiting, logging, or calling an external dependency.

Separating them does not require every function to be pure or every dependency to use a framework. It makes the smallest useful boundary visible. A pure transformation can be tested with data. A retry operation can accept a clock. A configuration loader can accept a file-reading boundary. An effect may still need an integration check later, but it no longer forces every unit test to depend on the operating system, network, or wall clock.

### Determinism is a property of the test setup

A **deterministic** test produces the same relevant result when run with the same controlled inputs and dependencies. Determinism is not a claim that the production system is perfectly predictable. It means the test deliberately controls sources of variation such as time, randomness, external data, network responses, shared state, and scheduling where they matter to the assertion.

Avoid real multi-second waits to test a timeout. They make feedback slow and can fail for reasons unrelated to the contract. The Delivery 4 companion passes a `DeterministicClock` to polling and retry code. The fake clock records requested delays and advances virtual time immediately. The test can then assert a timeout at 200 milliseconds of virtual time without waiting 200 milliseconds in the real world.

## Choose Tests by Risk and Behaviour

Every possible test is not equally useful. Begin with the utility's contract and the cost of being wrong. A compact test strategy for a quality utility might look like this:

| Risk or behaviour | Proportionate evidence |
|---|---|
| Expected transformation or summary | Unit test with a representative normal input and explicit output. |
| Rule at an inclusive or exclusive limit | Boundary test at the exact threshold, and adjacent values when risk justifies them. |
| Invalid configuration or data | Negative-path test that asserts a controlled failure category and useful safe context. |
| Repeated category or identity | Test duplicate handling and the meaning of “same.” |
| Polling reaches a completed state | Deterministic asynchronous test with a scripted sequence. |
| Polling never reaches completion | Deterministic timeout test that asserts attempts, elapsed time, and last observation. |
| Transient operation fails repeatedly | Bounded-retry test that asserts attempt count, delays, terminal category, and safe message policy. |
| Refactor of existing logic | Characterization comparison over stated representative behaviours. |

This is prioritisation, not a universal test catalogue. A small local formatter may not warrant async tests. A release-critical configuration boundary may warrant more malformed-input cases than its line count suggests. Test the decisions and failures whose absence would make the utility's evidence unsafe or hard to trust.

### Unit tests establish focused claims

A **unit test** evaluates a small unit of behaviour under controlled conditions. The unit is not necessarily one function; it is the smallest meaningful component for the claim. For a summary, the unit may include validation and aggregation because callers observe both. For a retry helper, the unit may include the injected clock and operation seam because retry timing is part of the behaviour.

The Delivery 4 companion uses Node's built-in test runner rather than a large additional framework. The runner provides test structure, discovery, reporting, and asynchronous support, while `node:assert/strict` expresses comparisons. This is a curriculum implementation choice, not a claim that every team should replace its existing test toolchain. The [Node.js test-runner documentation](https://nodejs.org/api/test.html) and [strict assertion documentation](https://nodejs.org/api/assert.html) describe the APIs used by the companion.

Test names should state the intended behaviour and context. Compare `works` with `reports timeout context at a bounded virtual deadline`. The latter is a better failure message before the assertion even runs because it tells a future reader what contract is at risk.

### Boundary tests make policy visible

A **boundary value** is a value at or near a point where a rule changes outcome. Boundaries matter because an inclusive `>=` and exclusive `>` differ at one important value even when every other example is identical.

The companion deliberately tests a duration equal to the slow threshold:

```ts
assert.deepEqual(
  summariseQualityObservations(
    [{ endpoint: "/checkout", state: "passed", durationMs: 500 }],
    500,
  ),
  { executionCount: 1, passedCount: 1, failedCount: 0, pendingCount: 0, slowEndpointCount: 1 },
);
```

This is not a claim that every threshold policy should be inclusive. It captures the stated policy and makes a future change visible to a reviewer. Where a rule has several boundaries—minimum, maximum, empty value, missing value, size, date, or count—select cases based on how the utility will actually be used and the consequence of misclassification.

### Table-driven tests reduce repeated ceremony

A **table-driven test** applies one behavioural pattern to several named inputs and expected outcomes. It is useful when the cases vary but the assertion structure is the same. It is not mandatory style; separate tests can be clearer when each case needs distinct setup or explanation.

For example, the three invalid thresholds below should all produce the same controlled error category:

```ts
for (const invalidThreshold of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
  test(`rejects invalid slow threshold ${String(invalidThreshold)}`, () => {
    assert.throws(() => summariseQualityObservations([], invalidThreshold));
  });
}
```

The companion's actual tests additionally assert the `invalid-input` category and a message that identifies the invalid field. That extra precision matters because merely proving that “something threw” can hide a change from an actionable validation failure to an unexpected exception.

## Test Failure Semantics, Not Only Failure Occurrence

Chapter 7 established that failures have different meanings. Tests should protect those meanings where callers, reports, or operators need the distinction. A test suite that accepts any thrown exception can allow a permanent configuration error to become a retried dependency failure, a timeout to become a generic error, or a raw service response to enter a public report.

### Preserve useful categories

The companion models `invalid-input`, `dependency-failure`, `timeout`, and `unexpected-result` as small controlled categories. Its tests establish several behaviour claims:

- an invalid configuration-like failure stops on the first attempt rather than being retried;
- bounded retry exhaustion preserves the `dependency-failure` category and records `attempt: 3` with `retryExhausted: true`;
- a timeout includes the operation, elapsed virtual time, attempt count, and last observed state; and
- a terminal retry message does not render a raw dependency marker.

The exact taxonomy is local to the companion. The design lesson transfers: choose categories that support a caller's decision, then test the category, relevant context, and disclosure boundary rather than only the existence of an exception.

### Make negative paths first-class evidence

Negative-path tests are not pessimism. A utility's failure output may be the most important thing it produces when a release decision is under pressure. Test what an invalid value, failed read, retry limit, or timeout means to the caller. Avoid asserting every wording detail when the wording is not part of the contract; assert enough to ensure the message identifies the operation or relevant context without exposing uncontrolled text.

For instance, a raw dependency response may be useful as a retained local cause for controlled investigation but unsafe or confusing to display directly. A public error assertion can check that the message says the operation exhausted bounded attempts and excludes a harmless test marker. This is a concrete disclosure policy, not a blanket rule that errors must never retain causes.

## Test Asynchronous Utilities Without Waiting

Asynchronous code changes what a test must control. The test needs to reason about eventual completion, elapsed time, retry attempts, ordering, and intermediate state—not simply whether a promise eventually resolves. Chapter 6 explained why arbitrary sleeps are fragile evidence. The same principle applies to tests.

### Inject time as a dependency seam

A **dependency seam** is a deliberate place where code receives a dependency rather than silently constructing or reading it. A clock interface is one seam:

```ts
export interface Clock {
  now(): number;
  sleep(milliseconds: number): Promise<void>;
}
```

Production code can supply a clock that uses real time. A test can supply a fake clock that records each delay and advances immediately. This gives the test control over time without making the polling algorithm unreal. It can assert that polling tries an operation three times, waits twice for the configured interval, and reports a 200-millisecond virtual timeout.

A clock seam does not prove that every real dependency behaves correctly. It makes the utility's own timing policy observable. Integration and operational evidence may still be necessary when a real environment, network, scheduler, or remote service influences the quality question.

### Test successful and unsuccessful progress

For a poller, success and timeout are different contracts. A success test should supply a scripted sequence such as `pending`, `pending`, `complete`, then assert the result, attempt count, and recorded delays. A timeout test should supply a sequence that never completes, then assert the controlled `timeout` category and last known state.

For retry, test both eventual success and exhaustion. Be exact about terminology: `maxAttempts` normally includes the initial attempt in the Delivery 4 companion. A test should make this visible, otherwise a later change can make three retries mean three total calls or four total calls without failing a vague assertion.

Do not test concurrency merely because the utility uses promises. Add a stable concurrency test only when ordering, shared state, or cancellation behaviour is part of the utility's actual contract. A nondeterministic test suite teaches the wrong lesson about reliable feedback.

## Control Dependencies with Appropriate Test Doubles

Tests often need a controlled substitute for a dependency. Terminology varies slightly across tools and communities, so use the labels to clarify intent rather than argue about taxonomy.

| Double | Useful meaning in this chapter | Example |
|---|---|---|
| **Fake** | A simplified working implementation of a dependency. | `DeterministicClock`, which implements the clock interface and advances virtual time. |
| **Stub** | A substitute that returns a predefined response. | A scripted operation that returns `pending` twice and then `complete`. |
| **Mock** | A double that verifies an expected interaction, depending on tooling terminology. | A boundary substitute that checks a report writer was called once with a safe result. |

The learning objective is dependency control. Use a fake, stub, mock, or simple callback when it makes a risk observable without depending on an external system. Do not introduce a framework only to replace a few explicit test values with opaque setup syntax.

### Avoid over-mocking

**Over-mocking** occurs when tests replace so many internal collaborators that they only prove the test's re-creation of the implementation. Such tests can remain green while the integrated behaviour is wrong. A test that asserts every private helper call in a summary function is fragile: a safe refactor can break it, while an incorrect final count might not.

Place doubles at meaningful boundaries: time, filesystem access, random generation, network clients, process environment, or a collaborator with a distinct contract. Within the utility's own logic, prefer observable inputs and outputs. If an interaction itself is the contract—such as a cleanup call or a single safe write—an interaction assertion can be appropriate. State why it matters.

## Characterization Tests Protect Change Without Pretending to Approve the Past

A **characterization test** records what existing code does for selected inputs before a change. It is especially useful when a Quality Engineer inherits a brittle utility or wants to refactor a confusing implementation from Chapter 9. It changes a vague claim—“I think this is how it works”—into an inspectable observed-behaviour claim.

The Delivery 4 companion retains `legacySummariseQualityObservations` only as a teaching fixture. Its characterization test compares that version and the current version over no observations, a threshold boundary, and mixed states with a repeated endpoint. The test says that the current implementation preserves those observed results over that stated set.

It does **not** prove that the legacy logic is correct, that every possible input is preserved, or that every caller expects the same policy. If discovery reveals a defect, document and test the intended correction separately. Characterization evidence is a starting point for safe change, not a reason to freeze all historical behaviour.

## Coverage Is Evidence of Execution, Not a Quality Score

**Code coverage** describes which code executed while a test suite ran. Line coverage asks whether lines ran; branch coverage asks, conceptually, whether alternative control-flow paths ran. Both can reveal an unexercised region worth investigating. Neither directly answers whether the utility is sufficiently tested, its assertions are meaningful, or the selected inputs represent the risk.

A test suite can report high coverage while asserting almost nothing useful, mocking away every boundary, or omitting the one configuration value that changes a release decision. A focused suite can have modest coverage while providing strong evidence for its highest-risk behaviour and clearly stating what remains untested. Use coverage to ask better questions:

- Which error or branch never executed, and is it a relevant risk?
- Did the tests reach the timeout path without using real time?
- Are the assertions specific enough to detect a harmful change?
- Does a newly covered line correspond to a decision we care about?
- What environmental or integration behaviour is deliberately outside this suite?

MSQE does not prescribe an arbitrary universal percentage target. The suitable evidence depends on the utility's decision impact, change frequency, failure modes, and available complementary validation.

## Maintain Tests as Deliberate Engineering Assets

Tests are code with dependencies, names, data, assumptions, and failure modes. A suite becomes less useful when its fixtures conceal the policy being checked, its setup is copied without ownership, its assertions are too broad to diagnose, or its examples depend on wall-clock timing and an accidental execution order. Maintain test code with the same proportionate discipline used for the utility.

Keep test data small enough to read while still representing the relevant risk. Name fixtures for the decision they express, such as `mixedObservationsAtSlowThreshold`, rather than `data1`. Prefer a local factory only when it exposes meaningful defaults or reduces duplicated policy; a generic builder with many optional fields can hide the very conditions a test needs to make visible. Do not make test data look realistic by copying production records or sensitive identifiers.

When a requirement, error category, threshold, or public output changes intentionally, update the test's stated claim in the same reviewable change. A failing test after a deliberate policy change is useful feedback, not an instruction to weaken the assertion until it turns green. Reconsider whether the old test should be updated, removed because the contract no longer exists, or retained as a separate regression for an unaffected property.

Flaky tests need investigation rather than repeated execution. First determine whether the cause is shared state, unordered data, real timing, an unowned external dependency, an incomplete cleanup path, or a product behaviour the test surfaced. Record the observation and make the smallest evidence-preserving correction. Deleting or permanently retrying a flaky test may hide an uncertainty that the utility or system still needs to expose.

Review test changes alongside implementation changes. Ask whether the test would fail for the harmful regression it is meant to prevent, whether its assertion is tied to an observable contract, and whether it remains clear after a future maintainer has forgotten the immediate change. Good tests stay valuable because their scope and evidence remain legible.

## Make Test Failures Useful to the Next Investigator

Tests are diagnostic artifacts. When one fails, its name, fixture, assertion, and message should help an engineer decide what to investigate next. A useful failure answers at least three questions:

1. What behaviour was expected?
2. What was observed instead?
3. Which input, boundary, operation, or context made the difference meaningful?

`assert.equal(result, true)` may be adequate for a very local predicate, but it is weak evidence for a retry policy. A better assertion establishes the final error category, attempt count, retry-exhaustion flag, and safe message policy. The failure tells the reader whether the utility retried too many times, lost a category, or exposed an uncontrolled value.

Avoid messages that merely restate a framework default, such as “expected true to be false,” when a domain-specific assertion can say more. Also avoid writing test names that promise more than the setup establishes. “Handles all network errors” is not credible when the test supplies one stubbed dependency failure. Name the actual claim.

## The Delivery 4 Companion: Tests as a Reviewable Change

The [Delivery 4 companion](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/README.md) keeps the tooling deliberately small:

- TypeScript compiles the source and tests with strict settings.
- Node's built-in `node:test` runner executes compiled test files.
- `node:assert/strict` supplies explicit assertions.
- `DeterministicClock` eliminates real waiting in polling and retry tests.
- The project has no real network calls, public APIs, credentials, or browser framework.

Its source and tests are intentionally reviewable together. The [change plan](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/change-plan.md) identifies the threshold policy and non-goals. The test suite covers normal aggregation, invalid input, the equality boundary, polling success, timeout, retry success, retry exhaustion, and characterization. The [illustrative PR description](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/pull-request-description.md) states what that evidence does and does not establish.

Run the project locally with:

```bash
npm install
npm run check
npm test
npm run start
```

The commands are local companion validation, not a prescribed organisation-wide dependency or CI policy. Read the test names and assertions after they pass. A green suite without an understood claim is less valuable than a smaller suite whose evidence and limitations are explicit.

## Engineering Perspective

Testing Quality Engineering utilities extends a QA Engineer's existing strengths into software contribution. Scenario thinking becomes controlled data and dependency setup. Boundary analysis becomes explicit threshold and configuration tests. Defect investigation becomes useful test failure design. Risk-based testing becomes a decision about which utility behaviours deserve the fastest, most repeatable evidence.

The result is not “tests for test code” as an isolated activity. It is a stronger quality system: the utility that creates or interprets evidence has its own observable contract, deterministic feedback, safe failure semantics, and regression protection. The engineer can explain what the suite establishes, what it does not establish, and what additional evidence a higher-risk decision needs.

## Industry Perspective

Node.js documents its built-in test runner and strict assertion APIs as part of its standard library.[^node-test][^node-assert] TypeScript's documentation explains the language and compiler options used to make contracts visible in the companion.[^typescript] These are tooling references, not a mandate to standardise on Node or TypeScript. The broader practices—controlled dependencies, focused assertions, risk-based selection, and honest evidence limits—transfer to other languages and test runners.

## Common Misconceptions and Pitfalls

### “Quality utilities do not need tests because they only support tests.”

They can affect data interpretation, test results, release evidence, diagnostics, and recovery. Their own failure modes deserve proportionate evidence.

### “A unit test must test exactly one function.”

A unit is the smallest meaningful behaviour for the claim. Validation and aggregation, or a retry operation and its clock seam, may belong together when callers observe them together.

### “A test that throws is good enough for an error path.”

An arbitrary exception may hide a lost category, wrong retry decision, missing context, or unsafe message. Test the relevant observable failure semantics.

### “Real sleeps make async tests more realistic.”

They usually make feedback slower and less deterministic. Use injected time or an equivalent seam to test the utility's timing policy; use separate integration evidence when the real environment matters.

### “Mocks are always more isolated and therefore better.”

Mocking internal details can make tests fragile and misleading. Control meaningful external boundaries and assert observable outcomes wherever possible.

### “Characterization tests prove legacy behaviour is correct.”

They document observed behaviour for selected cases. They do not approve that behaviour or prove universal equivalence.

### “A coverage target proves the suite is sufficient.”

Coverage reports execution, not assertion quality, scenario relevance, or residual risk. Use it to find questions, not as a universal quality score.

## Summary

Quality Engineering utilities need tests because they influence the evidence teams use to understand and decide about software quality. Testable design makes relevant behaviour easier to control and observe: explicit inputs, clear outputs, limited side effects, controlled dependencies, and deterministic time remove accidental obstacles without pretending that all production uncertainty disappears.

Choose tests by risk and contract. Unit, boundary, table-driven, error-path, asynchronous, and characterization tests each establish different claims. Test failure categories and context, not merely that an exception occurred. Use fakes, stubs, and mocks at meaningful boundaries; avoid tests that reproduce private implementation. Treat coverage as execution evidence and test failures as diagnostic evidence. These practices let a Quality Engineer explain the confidence and limits of the code they contribute before the capstone integrates the part's programming practices.

## Key Takeaways

- The utilities that produce quality evidence also need evidence for their own behaviour.
- Explicit inputs, observable outcomes, and controlled dependencies make tests more focused and deterministic.
- Select normal, invalid, boundary, asynchronous, error, and regression cases by decision risk, not by test-count goals.
- Test controlled error categories, safe context, and bounded retry or timeout semantics—not merely that a promise rejects.
- Use virtual time or an equivalent seam instead of real waiting for async policy tests.
- Fakes, stubs, and mocks are tools for dependency control; over-mocking internal details weakens useful evidence.
- Characterization tests preserve observed behaviour over a stated set; they do not prove that historical behaviour is correct.
- Coverage and passing tests are limited evidence that must be interpreted alongside assertions, risks, and residual uncertainty.

## Review Questions

1. Why can a defect in a Quality Engineering utility create both false confidence and false alarms?
2. What makes an outcome observable, and why should tests prefer observable behaviour to private implementation details?
3. How would you select a boundary test for a configuration or threshold rule?
4. What additional claims should an error-path test make beyond “an error was thrown”?
5. How does an injected clock improve the evidence from a timeout test?
6. Distinguish a fake, stub, and mock in terms of the dependency-control purpose they serve.
7. What does a characterization test establish, and what does it not establish?
8. Why is code coverage not a sufficient measure of confidence?

## Interview Questions

1. How would you decide what to test first in a utility that creates release-quality reports?
2. Describe a testable design change you would make to a utility that reads time or configuration implicitly.
3. How would you test retry exhaustion without waiting in real time or calling a real service?
4. When would you use a fake instead of a mock, and how would you avoid over-mocking?
5. How would you use characterization tests before refactoring unfamiliar automation code?
6. How do you explain the confidence and limits of a passing test suite to a reviewer or delivery team?

## Practical Exercise

### Build Confidence in a Quality Utility

Test a focused subset of the Delivery 3 reliable-quality-utilities companion, the Delivery 4 companion, or a comparable local TypeScript utility. Keep the work bounded to utility behaviour; do not turn it into a browser, API, performance, or security test project.

1. Write a short test strategy note that states the utility's purpose, the decision it influences, its most important observable contracts, the selected risks, and what the suite will not establish.
2. Add a normal-path test with an explicit input and expected result. Add an invalid-input test that verifies the controlled failure category and safe context.
3. Add at least one boundary test. State the inclusive or exclusive policy it captures and why that boundary matters.
4. Add a deterministic timeout test using injected virtual time, sleep, clock, or an equivalent seam. Do not use a real multi-second wait.
5. Add a bounded retry-failure test. Verify the attempt meaning, terminal category, and public diagnostic policy.
6. Before a small refactor, write a characterization test over representative existing behaviour. After the refactor, explain what the comparison protects and what it cannot prove.
7. Trigger one test failure safely during development, capture the useful failure output or describe it, then restore the expected behaviour. State the remaining risk after the suite passes.

### Expected Deliverables

- A test suite covering normal behaviour, invalid input, a boundary value, timeout, retry failure, and refactoring characterization.
- A concise test strategy note with selected risks, evidence, exclusions, and remaining-risk statement.
- A deterministic time or dependency seam where asynchronous behaviour is tested.
- A failure example that explains expected behaviour, observed behaviour, and relevant input or context.
- A short explanation of why the suite tests observable behaviour rather than implementation detail.

### Stretch Challenge

Identify one test that would become fragile after a safe refactor because it asserts a private helper or incidental call order. Redesign it to assert the public behaviour or a meaningful boundary interaction instead.

## Practical Resources

- [Delivery 4 Collaborative and Tested Quality Utilities](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/README.md) — strict TypeScript, Node test-runner setup, deterministic time, and evidence boundaries.
- [Delivery 4 tests](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/test/) — normal, boundary, invalid-input, asynchronous, retry, and characterization examples.
- [Delivery 3 Reliable Quality Utilities](../../../code/part-02-programming/delivery-03-reliable-quality-utilities/README.md) — a bounded utility set suitable for the exercise.

## Further Reading

- Node.js. [Test runner](https://nodejs.org/api/test.html) and [Assert](https://nodejs.org/api/assert.html) documentation.
- TypeScript. [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) and [TSConfig reference](https://www.typescriptlang.org/tsconfig/).
- Gerard Meszaros. [xUnit Test Patterns](https://xunitpatterns.com/).
- Michael Feathers. [Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/).
- Google Testing Blog. [Test Smarter](https://testing.googleblog.com/) — practitioner perspectives to evaluate alongside your local context.

## References

[^node-test]: Node.js. [Test runner](https://nodejs.org/api/test.html). Accessed 2026-08-09.

[^node-assert]: Node.js. [Assert](https://nodejs.org/api/assert.html). Accessed 2026-08-09.

[^typescript]: Microsoft. [TypeScript Documentation](https://www.typescriptlang.org/docs/). Accessed 2026-08-09.

[^meszaros]: Gerard Meszaros. [xUnit Test Patterns](https://xunitpatterns.com/). Addison-Wesley, 2007. Accessed 2026-08-09.

[^feathers]: Michael Feathers. [Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/). Prentice Hall, 2004. Accessed 2026-08-09.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain why a Quality Engineering utility needs tests for its own behaviour and failure modes.
- [ ] Identify an observable contract and distinguish it from an incidental implementation detail.
- [ ] Select normal, invalid-input, boundary, async, and regression cases by risk.
- [ ] Write a table-driven test when cases share a meaningful assertion pattern.
- [ ] Test a controlled error category, context, and disclosure boundary.
- [ ] Use a deterministic seam to test timeout and retry policy without real waiting.
- [ ] Choose a fake, stub, or mock that controls a meaningful dependency boundary.
- [ ] State what a characterization test and a coverage result do—and do not—establish.
- [ ] Explain a passing suite's evidence limits and remaining risk to a reviewer.
