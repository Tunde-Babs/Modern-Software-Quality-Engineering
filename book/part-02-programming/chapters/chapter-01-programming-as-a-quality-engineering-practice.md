# Chapter 1 — Programming as a Quality Engineering Practice

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 1 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Part I — Foundations, or equivalent understanding of quality as a system property |
| Estimated study time | 100 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Code that produces quality evidence is part of the quality system. It deserves the same care as the product behaviour it helps assess.

## Opening Story

The following illustrative scenario concerns a team that maintains account-recovery checks for a customer platform. The check was originally written to verify one important outcome: a customer who completes identity verification can reset a password and sign in again. Over time, useful requests accumulated. The check now creates a user, requests recovery, retries a reset call, asserts the result, signs in, logs outcomes, and deletes the user. It also knows endpoint paths, test credentials, timeout behaviour, and parts of the environment configuration.

When the check fails, its output is unhelpful: `Account recovery failed`. One engineer adds an assertion. Another adds a retry. A third changes a selector in a related browser flow. The check becomes longer and slower while the team becomes less certain whether a failure represents the product, a test environment, test data, or the check itself.

Mina, a senior QA Engineer, is asked to make the check stable. Her first instinct is reasonable: inspect the failed assertion and add better waits. A teammate asks a different question: *what responsibilities has this one piece of code accumulated, and which of them can we understand or change independently?*

Mina maps the flow. User creation is test-data setup. Recovery and sign-in are service interactions. Retry behaviour is an operational policy. Assertions interpret evidence. Logging is diagnostic infrastructure. Cleanup is a safety concern. The test is not merely a sequence of commands; it is a small software system with inputs, dependencies, state changes, outputs, failure paths, and maintenance cost.

The immediate task may still include repairing an assertion. But the larger quality improvement is to make the test software understandable enough that the next failure can be investigated and changed safely. That is the transition this chapter begins.

## Why This Chapter Matters

Modern Quality Engineering requires more than the ability to run checks or change a line in an existing test. Quality Engineers regularly encounter automation suites, diagnostic scripts, test-data utilities, report processors, configuration loaders, and small internal tools. Each can influence a release decision. Each can fail, conceal useful evidence, expose sensitive data, or create delay if it is poorly designed.

Programming therefore expands a QA Engineer's contribution. It makes it possible to read code rather than treating it as a black box; to identify the boundary between a product failure and a tooling failure; to build small capabilities that remove repeated manual work; and to participate credibly in design and code-review discussions. It does not require every Quality Engineer to become a product application's primary developer. It requires enough engineering fluency to create and improve trustworthy quality assets.

Part I established that quality is a property of the wider system, not a final testing activity. Code that creates test data, gathers results, validates responses, or reports evidence belongs to that system. If the code is opaque, flaky, insecure, or difficult to change, it weakens the quality feedback it was intended to provide.

This chapter establishes the engineering mindset and code-reading method used throughout Part II. Chapter 2 provides the TypeScript language tools for expressing reliable logic. Chapter 3 applies those tools to structured quality data. Later chapters develop modular design, configuration, asynchronous work, failure handling, debugging, refactoring, collaboration, and testing of Quality Engineering utilities.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why Quality Engineering code is a quality asset rather than disposable test scaffolding;
- distinguish a bounded script from code that needs deliberate software-engineering design;
- read unfamiliar TypeScript by tracing entry points, inputs, dependencies, state changes, outputs, failure paths, and evidence;
- identify when a quality check contains too many responsibilities;
- propose a bounded, evidence-based change before attempting a refactor;
- describe how technical debt in automation or tooling affects delivery confidence; and
- connect existing QA skills to the existing QA to Quality Engineering Transition Framework's Programming Foundations domain.

## Programming Changes the Kind of Contribution You Can Make

Testing expertise remains central to Quality Engineering. A skilled QA Engineer can recognise an ambiguous acceptance criterion, formulate revealing examples, investigate surprising behaviour, and explain customer risk. Programming does not replace that expertise. It gives the expertise more places to operate.

For example, a tester may observe that a regression suite takes too long to provide useful feedback. A Quality Engineer with programming fluency can help determine whether the cause is duplicated setup, sequential work that could be safely isolated, poor test-data handling, an unnecessarily broad data query, or a diagnostic failure that forces repeated reruns. The answer is not automatically “write more automation.” It is to understand the code and the decision it supports well enough to improve the right constraint.

Programming also makes the boundaries of evidence more visible. A green check may show that a selected path behaved as expected under particular conditions. It does not prove that every user, dependency, configuration, or production workload is safe. Clear code can make its assumptions explicit: which environment it targets, which fixture it uses, which response it accepts, which timeout it applies, and what it reports when the assumption is not met.

### From script author to engineering contributor

The following progression uses the existing QA to Quality Engineering Transition Framework's capability language. It is not a new MSQE career ladder and does not imply that one title is superior to another.

| Capability position | Typical contribution | Useful next question |
|---|---|---|
| Test Script Author | Writes or modifies a check to exercise an expected behaviour. | Does this check provide meaningful evidence about the risk? |
| Automation Contributor | Improves shared checks, fixtures, reporting, or test data with awareness of maintainability. | Can another engineer understand, diagnose, and safely change this code? |
| Engineering Code Contributor | Designs and improves small quality capabilities with explicit boundaries, dependencies, failure behaviour, and evidence. | What decision will this code support, and what assumptions or limits should it expose? |

The progression is about widening responsibility, not abandoning hands-on testing. A Quality Engineer may still perform exploratory testing, analyse defects, and challenge assumptions. They increasingly treat the code around those activities as engineering infrastructure rather than a collection of temporary commands.

## Scripts, Utilities, and Engineering Assets

The word *script* is not an insult. A short, one-off program can be the most proportionate way to inspect a file, reproduce a problem, or transform a small dataset. The question is not whether code is called a script. The question is whether other people, repeated use, customer risk, or consequential decisions now depend on it.

An engineering asset needs more deliberate treatment when one or more of these conditions applies:

- it is executed repeatedly in a delivery pipeline or release process;
- several engineers depend on its output;
- it creates, changes, or deletes data;
- it calls external services or carries credentials;
- it influences a customer-facing or high-consequence decision;
- failures are costly to diagnose or can be confused with product failures; or
- the team expects to change it as the product evolves.

The appropriate response is not a heavyweight process for every ten-line utility. It is proportionate engineering discipline: name the purpose, keep the scope understandable, make dependencies visible, report meaningful failures, and preserve a safe path for change.

### Code is part of the quality system

Consider several common Quality Engineering assets:

| Asset | What it can improve | What poor design can conceal or create |
|---|---|---|
| API validation utility | Repeatable evidence about contracts and error paths. | False confidence if it silently accepts malformed or incomplete responses. |
| Test-data generator | Faster, safer setup for meaningful scenarios. | Data collisions, privacy exposure, or non-repeatable failures. |
| Result transformer | Clear release or quality evidence from many executions. | Misleading summaries, lost failures, or incorrect grouping. |
| Retry helper | Controlled handling of known transient conditions. | Masked defects, excessive delay, or uncontrolled repeated requests. |
| Diagnostic tool | Faster investigation and clearer handoff. | Missing context, sensitive logs, or a misleading root-cause claim. |
| Browser or service check | Evidence about a customer workflow. | Flakiness, hidden environment coupling, and expensive maintenance. |

These are all software. Their quality influences the credibility, speed, cost, and safety of the feedback they generate. This is why “test code does not need the same care as production code” is a dangerous shorthand. The level of care should be proportionate to the impact, but it should never be assumed to be irrelevant.

## Read Before You Modify

Reading unfamiliar code is a professional skill, not a delay before “real” programming begins. Editing without a model of the code can make a symptom disappear while preserving the cause, add a new dependency, or broaden a change beyond what the evidence supports.

The most useful first question is not “Which line should I change?” It is “What outcome is this code trying to produce, and how does it get there?”

### A repeatable code-reading method

Use the following method for a check, utility, module, or pull-request change. It is deliberately practical; it does not require you to understand every language feature before you begin.

1. **Identify the entry point.** Find the function, command, test case, or exported member that begins the work. What is its stated purpose?
2. **Identify inputs.** What arguments, configuration, environment values, fixture data, or external state affect behaviour?
3. **Trace important calls.** Follow the calls that create an outcome or explain a failure. Ignore minor implementation detail until it becomes relevant.
4. **Identify dependencies.** Which services, files, time sources, random values, credentials, libraries, or shared helpers does the code rely on?
5. **Identify state changes.** What is created, mutated, stored, retried, or cleaned up? What must be restored if the work fails?
6. **Identify outputs.** What does the caller receive: a return value, an assertion, a file, a log, a thrown error, or a changed system state?
7. **Identify failure paths.** Which expected and unexpected conditions can stop progress? Are failures distinguished, retried, hidden, or transformed?
8. **Identify evidence produced.** What would another engineer learn from a pass, a failure, or a log record? What remains unknown?

This sequence creates a working model. It is often more useful than reading a file from top to bottom while trying to memorise every line.

### Code-reading example: an inherited recovery check

The companion project's [`inheritedAccountRecoveryCheck.ts`](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/src/inheritedAccountRecoveryCheck.ts) is intentionally over-responsible. The shortened extract below is enough to begin the analysis.

```ts
export async function runInheritedAccountRecoveryCheck(
  input: AccountRecoveryCheckInput,
  dependencies: AccountRecoveryCheckDependencies,
): Promise<boolean> {
  let createdUserId: string | undefined;

  try {
    const createdUser = (await dependencies.fetchJson(`${input.environmentUrl}/test-users`, {
      method: "POST",
      body: JSON.stringify({ email: input.email, password: "TemporaryPassword1!" }),
    })) as { id: string };
    createdUserId = createdUser.id;

    const recoveryRequest = (await dependencies.fetchJson(`${input.environmentUrl}/recovery`, {
      method: "POST",
      body: JSON.stringify({ email: input.email }),
    })) as { token?: string };

    // The complete example retries a reset request, signs in, logs, and cleans up.
  } finally {
    if (createdUserId) {
      await dependencies.fetchJson(`${input.environmentUrl}/test-users/${createdUserId}`, {
        method: "DELETE",
      });
    }
  }
}
```

#### Context

The function is meant to assess a customer account-recovery outcome in one environment. It receives the environment URL, user details, and a group of dependencies that perform requests, logging, and waiting.

#### What the code does

The entry point creates data, requests recovery, retries a reset operation, signs in, emits logs, catches errors, and cleans up. Many failures inside its `try` block collapse into `false`, so the caller cannot tell whether setup, recovery, reset, authentication, or an unsafe type assertion caused the outcome. Cleanup runs in `finally` outside that `catch`: if its `DELETE` request rejects, it overrides an intended Boolean result and the returned promise rejects instead. The caller must therefore handle two inconsistent failure channels rather than one clear outcome model.

#### Why it matters

The code is not wrong merely because it is long. It is difficult because it mixes several reasons to change. A team may need different owners, evidence, safety rules, and tests for data creation, recovery behaviour, retry policy, authentication, logging, and cleanup. When they are combined, a small change in one area risks surprising another.

#### Engineering trade-off

Decomposition introduces more functions and names. That can make a very small, temporary experiment harder to scan. It becomes worthwhile when the code is shared, repeated, failure-prone, or consequential. Here, the check affects delivery confidence and changes test data, so the gain in diagnosability and safe change is likely worth the additional structure.

### Build a responsibility map before refactoring

Do not begin by extracting functions because “functions should be short.” First name the responsibilities and the questions each must answer.

| Responsibility | Useful question | Candidate boundary |
|---|---|---|
| Test-data setup | Can a known user be created safely and uniquely? | `createRecoveryUser` |
| Recovery request | Does the system accept a valid recovery request? | `requestPasswordRecovery` |
| Reset attempt | What response or state establishes a completed reset? | `resetPassword` |
| Retry policy | Which condition is transient, how long may we wait, and when do we stop? | `retryUntil` later in Part II |
| Sign-in verification | Can the new credential establish the expected session? | `signInWithPassword` |
| Diagnostic evidence | Which identifiers and outcomes help an engineer investigate without exposing secrets? | structured logging boundary |
| Cleanup | What data must be removed even after an earlier failure? | `deleteTestUser` in a `finally` path |

This map does not prescribe a final architecture. It exposes decisions. For example, retrying an ambiguous reset request may be unsafe unless the product's operation is designed to tolerate repeated requests. That is an idempotency and product-behaviour question, not merely a loop question. Part II will return to asynchronous work and failure handling later; this chapter's purpose is to notice the responsibility before adding another retry.

## Decomposition and Abstraction

**Decomposition** is breaking a problem into smaller, meaningful responsibilities. **Abstraction** is presenting the relevant behaviour of a responsibility while hiding details that the caller should not need to manage. Both are tools for reasoning, not goals measured by function count.

Good decomposition improves a reader's ability to answer four questions:

- What is this part responsible for?
- What information does it need?
- What result or failure can it produce?
- What can change here without unexpectedly changing something else?

A useful abstraction does not mean “make the code generic.” A generic helper that accepts many flags and opaque objects can hide the important conditions just as effectively as one large test. Prefer a small boundary whose name, inputs, outputs, and failure behaviour communicate a real responsibility.

### Separate policy from mechanism

A recurring source of Quality Engineering debt is mixing a policy decision with the mechanism that carries it out. A policy might say, “wait for a delivery signal for no more than thirty seconds, then report the evidence collected.” A mechanism might be a function that waits, measures time, and calls a supplied operation. Keeping the distinction visible makes later change safer: the team can adjust the decision without accidentally rewriting the waiting mechanism, or improve the mechanism without silently changing the decision.

The same pattern applies to data. A policy might say that an execution over 750 milliseconds is slow for a particular environment. The mechanism filters and counts results. Chapter 3 uses this distinction to transform execution records into evidence without pretending that one threshold is a universal definition of quality.

## Bounded Change and Technical Debt

A **bounded change** has a clear purpose, known affected area, explicit evidence of success, and a limit on what it will not attempt to solve. It is a practical defence against both risky edits and endless refactoring.

Before changing inherited quality code, write a short change statement:

> The recovery check collapses several setup and product-interaction failures into `false`, while an unhandled cleanup failure can reject and override a Boolean result. Add a structured outcome that distinguishes setup, recovery, reset, authentication, and cleanup outcomes. Do not alter product retry behaviour, endpoint contracts, or test-data retention policy in this change.

The statement is not bureaucracy. It gives reviewers and future maintainers a way to see whether the implementation matches the problem. It also protects a team from treating a narrow reliability issue as permission to redesign the whole automation suite.

**Technical debt** is the future cost created when a currently expedient design makes later change, understanding, or operation harder. It is not a synonym for code that looks unfamiliar or fails a style preference. In quality tooling, useful debt signals include repeated manual diagnosis, changes that break unrelated checks, unclear ownership, misleading failures, secrets in fixtures or logs, slow feedback, and code that few people can safely modify.

The right response is proportional. A ten-minute diagnostic script might need a clear header and safe data handling, not a framework. A shared release-report processor may need explicit types, tests, review, change history, and documented limits. The Quality Engineer's job is to make the trade-off visible and help the team choose the level of investment that the risk justifies.

## Engineering Perspective

Programming capability allows a Quality Engineer to connect a quality concern to a technical intervention and evidence. The goal is not to take ownership of every product component. It is to make a bounded contribution that improves a decision or a feedback loop.

| Quality concern | Programming contribution | Evidence and limit |
|---|---|---|
| A check fails with an unhelpful message. | Preserve the failing operation, relevant identifier, and safe diagnostic context. | Faster diagnosis; it does not prove the underlying product cause. |
| Test data collides between runs. | Encapsulate unique-data creation and cleanup with explicit ownership. | Repeatable setup; it does not replace domain data-governance controls. |
| A report hides important failed executions. | Model result states and transform records into a transparent summary. | Clearer evidence; the summary still depends on valid input and chosen rules. |
| A repeated manual investigation wastes time. | Build a small reusable parser or validator with documented inputs and output. | Repeatable analysis; it must still be reviewed as requirements evolve. |

The common pattern is engineering leverage: code makes a useful quality activity more repeatable, observable, or maintainable. The evidence must include its own boundaries. A utility that is easy to run but impossible to interpret is not a complete quality capability.

## Industry Perspective

TypeScript's stated purpose is static type checking for JavaScript programs: it can identify many mismatches before code executes, but it does not remove the need to understand runtime conditions.[^typescript-handbook] The TypeScript documentation also emphasises types, functions, object shapes, and modules as the building blocks of understandable programs.[^typescript-everyday-types]

Those language capabilities matter to Quality Engineering because automation and tooling operate at uncertain boundaries: configuration can be absent, a service can return unexpected data, and an environment can behave differently from the one assumed by a local check. Static feedback is valuable, but a mature engineering practice combines it with clear runtime behaviour, review, test evidence, and proportionate operational safeguards.

The Software Engineering Body of Knowledge treats software construction, configuration management, and engineering management as connected professional concerns rather than isolated coding activities.[^swebok] MSQE applies that principle to Quality Engineering assets: a test, utility, or report processor may be small, but if teams rely on it, its design and maintenance affect the wider delivery system.

## Common Misconceptions and Pitfalls

### “Test code is disposable.”

Some exploratory code is temporary. Shared, repeated, or decision-influencing code is not disposable merely because it does not ship to customers. Treat its quality proportionately to its impact and expected lifetime.

### “A passing check proves the product is safe.”

A pass is evidence about the conditions the check exercised. It cannot establish that all dependencies, data, users, or production conditions are safe. Clear code should make the exercised conditions and evidence limit easier to understand.

### “Refactoring means changing everything until it looks clean.”

Refactoring is a behaviour-preserving improvement made for a reason. Start with a named problem, preserve or add evidence, and keep the change bounded. Larger redesign may be justified, but it should be an explicit engineering decision.

### “More retries make automation reliable.”

Retries can address a known transient condition. They can also mask a defect, lengthen feedback, or repeat an unsafe operation. First identify what failed, whether repeating is safe, how long to wait, and what evidence should be retained.

### “I must understand the whole repository before I can contribute.”

You need a sufficient model of the affected path, not total knowledge. Start at the entry point, follow important calls, identify boundaries and assumptions, then ask a focused question or make a bounded change.

## Summary

Programming is a Quality Engineering capability because code creates much of the evidence, feedback, and leverage that teams use to understand quality. The relevant goal is not to become a generic application developer overnight. It is to read and improve engineering assets responsibly: understand their purpose, inputs, dependencies, state changes, outputs, failure paths, and evidence.

The account-recovery scenario demonstrates why a large check is not repaired only by adding assertions or waits. When setup, product interaction, retries, logging, and cleanup are mixed together, the test software itself becomes a quality risk. A responsibility map, bounded change statement, and proportionate decomposition turn an opaque failure into an engineering problem the team can reason about.

Chapter 2 now introduces the TypeScript subset needed to express those responsibilities clearly. Chapter 3 then uses typed structures and transformations to turn execution data into meaningful quality evidence.

## Key Takeaways

- Quality Engineering code includes tests, utilities, fixtures, validators, diagnostic tools, and report processors; its quality affects the credibility of the feedback it produces.
- A script becomes an engineering asset when repeated use, shared reliance, consequential decisions, data changes, or maintenance cost make its design matter.
- Read unfamiliar code by tracing entry points, inputs, calls, dependencies, state changes, outputs, failure paths, and evidence.
- Decomposition should expose meaningful responsibilities and change boundaries, not merely produce more functions.
- A bounded change states the problem, affected area, evidence of success, and what is intentionally out of scope.
- Technical debt is a future cost of constrained understanding or change, not simply code that violates a personal style preference.
- Static types, tests, logs, review, and production evidence each provide different information; none alone proves overall quality.
- Programming extends existing QA strengths into reusable engineering contribution.

## Review Questions

1. Why can a test-data generator be a quality-system component rather than incidental setup code?
2. Which conditions indicate that a small script needs more deliberate engineering treatment?
3. Apply the code-reading method to an unfamiliar check. Which two steps would you perform before editing an assertion, and why?
4. In the inherited recovery check, name three responsibilities that should be discussed separately before refactoring.
5. What is the difference between a bounded change and a broad cleanup motivated by discomfort with existing code?
6. How can technical debt in quality tooling affect a release decision even when product code has not changed?
7. Why might a retry hide useful evidence rather than improve a check?
8. What evidence would show that a proposed decomposition improved diagnosability?
9. How does programming capability extend rather than replace exploratory testing and risk analysis?
10. When would a one-off script be more proportionate than a reusable utility?

## Interview Questions

1. How would you approach an unfamiliar automation repository before making a requested change?
2. A critical end-to-end test is flaky and contains setup, assertions, retries, and cleanup. How would you decide what to change first?
3. How do you distinguish a product failure from a failure in the quality tooling that detected it?
4. Describe a time when you improved a recurring quality activity through code. What evidence showed that the improvement was useful?
5. What makes test code maintainable, and how does its required quality differ from customer-facing product code?
6. How would you explain the risk of adding an unconditional retry to a failing test?
7. What information should a useful test or utility failure report contain?
8. How do you keep a refactor proportionate when a team needs a defect fix quickly?

## Practical Exercise

### Code Reading and Decomposition

Use the companion [`inheritedAccountRecoveryCheck.ts`](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/src/inheritedAccountRecoveryCheck.ts), or a safe, non-confidential quality script from your work.

1. **State the purpose.** Write one sentence describing the customer or quality outcome the code is trying to evaluate. State one important limitation of the evidence it can produce.
2. **Create a reading map.** Identify the entry point, inputs, important calls, dependencies, state changes, outputs, failure paths, and evidence produced. Do not change the code yet.
3. **Identify responsibilities.** Mark every distinct responsibility. At minimum, distinguish setup, product interaction, evidence interpretation, retry or waiting policy, diagnostics, and cleanup where they exist.
4. **Choose one failure path.** Explain whether it currently produces `false` or rejects, what a caller can learn from that channel, and one piece of safe context that would improve diagnosis.
5. **Propose a bounded change.** Write a short change statement that includes the problem, affected scope, evidence of success, and explicitly deferred work.
6. **Sketch a decomposition.** Name candidate functions or modules and state their input, output, and responsibility. Do not implement them in this exercise.

### Expected Deliverables

- A one-page code-reading and responsibility map.
- One bounded change statement.
- A decomposition sketch with at least three named responsibilities.
- A short reflection explaining how the proposed change would make a future failure easier to interpret.

### Reflection Questions

- Which part of the code was easiest to misunderstand, and what information would make it clearer?
- Which change would improve evidence without changing product behaviour?
- What would you ask a developer, product manager, or platform engineer before changing the retry or cleanup behaviour?

## Practical Resources

- Run the [Delivery 1 Quality Evidence Utilities](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/README.md) after its declared dependency is installed. The inherited account-recovery example is intentionally fragile for this exercise.
- **Continue:** [Chapter 2 — Essential TypeScript for Quality Engineers](chapter-02-essential-typescript-for-quality-engineers.md) turns the responsibility map into typed, readable program logic.
- **Build from:** [Chapter 8 — The Modern Quality Engineer](../../part-01-foundations/chapters/chapter-08-the-modern-quality-engineer.md), especially its treatment of programming as a Quality Engineering competency.

## Further Reading

- TypeScript. [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html).
- Google. [Engineering Practices: Code Review Developer Guide](https://google.github.io/eng-practices/review/developer/).
- IEEE Computer Society. [Software Engineering Body of Knowledge topics](https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics).

## References

[^typescript-handbook]: TypeScript. [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html). Accessed 2026-08-08.

[^typescript-everyday-types]: TypeScript. [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html). Accessed 2026-08-08.

[^swebok]: IEEE Computer Society. [Software Engineering Body of Knowledge topics](https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics). Accessed 2026-08-08.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain why a quality check, utility, or fixture may need software-engineering discipline.
- [ ] Trace an unfamiliar code path from entry point to evidence produced.
- [ ] Identify inputs, dependencies, state changes, outputs, and failure paths in a quality asset.
- [ ] Distinguish a bounded change from an uncontrolled cleanup.
- [ ] Identify at least three responsibilities in an overgrown quality script.
- [ ] Explain why retries, logging, and cleanup are engineering decisions rather than incidental lines of code.
- [ ] Describe how programming extends your existing QA contribution toward Quality Engineering.
