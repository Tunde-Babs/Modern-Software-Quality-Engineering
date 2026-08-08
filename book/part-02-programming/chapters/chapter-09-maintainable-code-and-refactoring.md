# Chapter 9 — Maintainable Code and Refactoring

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 9 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–8, especially functions, boundaries, diagnostics, and controlled investigation |
| Estimated study time | 145 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Make code easier to change only after you understand the behaviour that must not change.

## Opening Story

The following illustrative scenario concerns a working quality-summary utility. It counts completed checks, failed checks, and unique slow endpoints. The result is used by a release report, but the implementation has one long loop, repeated state comparisons, generic local names, and threshold validation buried among aggregation details. A developer proposes a complete rewrite while also adding a new reporting field and correcting an unrelated defect.

The pressure is understandable: the code is difficult to read. The combined change is difficult for a different reason. A reviewer can no longer separate intended structural improvement from new behaviour, bug repair, or accidental regression. A passing run shows only one sampled outcome, not that the existing contract was preserved.

The Delivery 3 companion takes a smaller route. It first establishes the shared precondition that a slow-response threshold is finite and non-negative, then characterizes known observations before introducing named validation and state-counting helpers. The legacy and refactored functions return the same summary over that valid input domain and reject the same invalid thresholds. That is not proof of universal equivalence; it is proportionate evidence for a bounded change.

## Why This Chapter Matters

Quality Engineering code becomes long-lived sooner than expected. A one-off report gains configuration. A utility gains a second consumer. A fixture builder is copied into several checks. An automation helper starts to encode release policy. If the code cannot be read, changed, and reviewed safely, it becomes a source of unreliable quality evidence rather than an enabler of it.

This chapter teaches maintainability as an engineering property and refactoring as a behaviour-preserving structural change. It synthesizes the earlier chapters: typed models make assumptions visible; modules make responsibilities visible; async and failure boundaries make timing and exceptions visible; debugging establishes observed behaviour before change. It does not replace Chapter 10's collaborative Git workflow or Chapter 11's broader testing strategy.

## Learning Objectives

By the end of this chapter, you should be able to:

- assess readability, naming, duplication, cohesion, coupling, and complexity in terms of future change risk;
- identify common code smells as investigation signals rather than automatic defects;
- define refactoring as a structural change that preserves externally observable behaviour;
- separate a refactor from a feature change or bug fix when doing so improves reasoning and reviewability;
- establish proportionate regression evidence before and after a bounded refactor;
- choose comments that explain why and constraints rather than repeat obvious code; and
- describe technical debt as a prioritisation and risk decision rather than a universal score.

## Maintainability Serves Future Evidence

Maintainability is the degree to which engineers can understand, correct, adapt, and verify code over time. It is not a synonym for a preferred formatting style, short functions, or maximal abstraction. A maintainable quality utility lets a reader answer practical questions: What evidence does this code produce? Which input and policy boundaries control it? Where do effects occur? What outcome changes if this branch is modified?

### Names, cohesion, and coupling

Names should reveal the domain decision, not merely the language mechanism. `summariseChecks` is more useful than `processData` because a reviewer can infer the responsibility. `slowThresholdMs` makes a policy value and unit visible. Names may become longer when the extra precision prevents a wrong interpretation; they should not become prose that obscures the code.

**Cohesion** asks whether a function or module has responsibilities that belong together. A function that validates a threshold, reads a file, retries a request, calculates a summary, and formats a report has several reasons to change. **Coupling** asks how strongly one part depends on another. Hidden environment reads, shared mutable state, and helpers that reach into unrelated modules make a change harder to isolate.

The aim is not to optimise abstract metrics. It is to reduce the number of unrelated facts a reader must hold while making a bounded change.

### Duplication needs interpretation

Duplicated code can signal a missing shared concept, but it can also show that two similar-looking rules are deliberately independent. Extract only after the common behaviour, input contract, and likely future changes are understood. Prematurely combining unrelated policies into a generic helper can increase coupling and make local reasoning worse.

For example, two checks may both validate a non-negative duration. A shared `validateDurationMs` helper may be justified if the same invariant and message policy apply. Two retry delays are not necessarily the same policy merely because both are numbers; a common helper should not erase the distinct reason each delay exists.

## Code Smells Are Questions

A **code smell** is an observable characteristic that invites investigation. It is not a verdict that the code is wrong. The following examples help a Quality Engineer identify possible change risk:

| Smell | Question to ask |
|---|---|
| Duplicated logic | Is the same domain rule evolving in more than one place? |
| Giant function | Can the responsibilities be named and separated without hiding the workflow? |
| Deeply nested branches | Would validation or early returns clarify the significant paths? |
| Boolean flag argument | Does one function actually perform two distinct responsibilities? |
| Hidden dependency | Can a caller see the configuration, clock, data source, or side effect that controls behaviour? |
| Mutable shared state | Can run order or concurrent activity alter another check's evidence? |
| Generic helper module | Does the module have a coherent responsibility or collect unrelated convenience functions? |
| Repeated primitive configuration | Would a named type make policy and units harder to misuse? |

Context determines whether a change is worthwhile. A short local script may safely contain duplicated setup that a reusable library should not. A deeply nested state machine may accurately reflect a complex domain. Improve code when the expected reduction in risk, review cost, or future change difficulty justifies the new structure.

## Refactoring Preserves a Contract

**Refactoring** changes a program's internal structure while preserving its externally observable behaviour. “Observable” includes values returned, errors and failure categories exposed to callers, persistent output, side effects, timing guarantees when documented, and public interfaces. It does not require every internal implementation detail to remain unchanged.

Refactoring differs from a feature change, which intentionally changes behaviour, and from a bug fix, which changes behaviour to correct it. These may be combined when necessary, but combining all three in one large change increases the reasoning burden. A reviewer must determine whether each difference is intentional, whether a new feature depends on the structural change, and whether an existing defect masks a regression.

### Establish behaviour before improvement

Before restructuring a utility, identify its current contract, valid input domain, expected outputs, and known limitations. Use existing tests where they are credible; add a focused characterization check where they are absent. A characterization check records what the system currently does, including perhaps an awkward edge case, without immediately declaring that behaviour desirable.

The companion's `legacySummariseChecks` and `summariseChecks` share the precondition that `slowThresholdMs` is finite and non-negative. Both enforce it before summarising. The validation runner checks their equality across no records, a threshold-boundary result, one failed result, and multiple states with a repeated slow endpoint; it also checks that both reject invalid thresholds. The refactored version adds `countState`; these helpers improve names and cohesion while retaining the returned shape over the shared contract.

```ts
assert.deepEqual(
  summariseChecks(observations, 750),
  legacySummariseChecks(observations, 750),
);
```

The checks are bounded claims: the shared precondition and these known behaviours are preserved. They are not evidence that every possible input, performance characteristic, or caller expectation is unchanged. Chapter 11 will expand how to choose a proportionate suite of utility tests.

### Use a bounded-change cycle

Use a repeatable sequence:

```text
understand behaviour
  → establish evidence
  → make one bounded structural change
  → validate
  → inspect the diff
  → repeat
```

The sequence reduces risk by keeping each diff explainable. Inspecting the diff is an engineering activity: check that generated files, unrelated formatting, configuration changes, and accidental API changes have not entered the change set. Future Chapter 10 discusses commits and review; the local discipline begins here.

## Comments and Abstractions

Comments are useful when they explain **why** code exists, a non-obvious constraint, an ownership decision, or a rejected alternative. A comment that restates obvious syntax usually becomes maintenance noise:

```ts
// Increase attempt by one.
attempt += 1;
```

The companion's comment explaining that `DeterministicClock` advances virtual time is useful because it records why the implementation does not use real sleeps. A comment on a deliberately defective predicate is useful because it prevents learners from copying it as a pattern. Code should still have names and structure that make its basic **what** legible.

An abstraction earns its place when it makes a rule, boundary, or change point clearer. It does not earn its place simply by eliminating repeated characters. Passing a `Clock` into polling makes timing control explicit and testable. Introducing a generic “everything helper” that accepts many optional callbacks could make the polling contract less clear.

## Technical Debt Is a Prioritisation Decision

Technical debt describes the future cost, risk, or constraint created by a current design decision. It can be deliberate—a small temporary shortcut with an owner and review point—or accumulated through changing requirements, dependency changes, missing tests, and deferred cleanup. The metaphor is useful only when it leads to a concrete decision: what risk is being carried, what evidence supports its priority, what work would reduce it, and what is the cost of waiting?

Do not turn debt into a moral judgement about code or a fabricated financial measurement. A minor duplication may be an acceptable cost. A hidden retry policy that distorts failure evidence may be a high-priority debt because it affects release decisions. The right action depends on impact, frequency of change, operational risk, and available evidence.

## Engineering Perspective

Maintainable Quality Engineering code preserves the connection between a utility and the decision it supports. Refactoring improves that connection when it clarifies responsibilities, makes policies explicit, and reduces accidental coupling without changing the utility's evidence contract. The safest change is not necessarily the smallest line count; it is the one whose behaviour, intent, and validation a reviewer can explain.

QA experience supports this work directly. Test design develops attention to cases and observable behaviour. Defect investigation develops hypothesis discipline. Refactoring adds the code-level habit of using those strengths before and after a structural change, rather than relying on visual improvement alone.

## Industry Perspective

Martin Fowler defines refactoring as changing a software system's internal structure without changing its observable behaviour, and emphasises small steps supported by tests.[^fowler-refactoring] Google Engineering Practices similarly recommends readable, focused changes that reviewers can understand and verify.[^google-code-review] These are established engineering practices, not a mandate that every change follow one prescribed pattern or metric.

## Common Misconceptions and Pitfalls

### “Refactoring means rewriting code until it looks cleaner.”

Refactoring preserves observable behaviour. A rewrite may be justified, but it is a larger design and migration decision that needs its own evidence.

### “Every smell must be fixed immediately.”

Smells are prompts for analysis. The cost and risk of change may exceed the benefit for stable, local, or intentionally simple code.

### “Comments are bad.”

Comments that preserve rationale, constraints, and ownership are valuable. Comments that narrate obvious syntax are usually not.

### “A passing run proves the refactor is safe.”

One run is limited evidence. Use characterization checks, relevant edge cases, focused validation, and diff inspection in proportion to the risk.

### “Technical debt is anything I dislike.”

Debt is a trade-off with future consequence. State the impact and evidence instead of treating personal preference as a priority system.

## Summary

Maintainability helps Quality Engineers change evidence-producing code without losing confidence. Names, cohesive responsibilities, visible dependencies, and proportionate abstractions make a utility easier to reason about. Refactoring is a structural change that preserves observable behaviour; it should begin with understanding and evidence, proceed through small bounded changes, and end with validation and diff inspection. Code smells and technical debt guide prioritisation rather than replace engineering judgement.

Delivery 3 has moved from time, to failure, to diagnosis, to safe change. The next delivery will make individual contribution collaborative and testable through Git, review, and utility-testing practices.

## Key Takeaways

- Maintainability is about safe understanding and change, not a universal style score.
- Code smells are investigation signals; context determines whether change is worthwhile.
- Refactoring preserves externally observable behaviour, unlike a feature change or bug fix.
- Establish characterization evidence before changing unfamiliar or brittle code.
- Make one bounded change, validate it, inspect the diff, and repeat.
- Comments should preserve rationale and constraints; abstractions should clarify a real boundary or rule.
- Technical debt should be prioritised by risk and evidence, not by aesthetic preference.

## Review Questions

1. How do cohesion and coupling affect the risk of changing a quality utility?
2. Why is a Boolean flag argument sometimes a code-smell signal?
3. Define refactoring and contrast it with a bug fix.
4. What is a characterization check, and what does it not prove?
5. When might duplicated code be preferable to a shared abstraction?
6. What makes a comment valuable to a future maintainer?
7. How would you explain the priority of a technical-debt item using evidence?

## Interview Questions

1. How would you refactor a difficult test utility without breaking its consumers?
2. Which code smells do you look for when reviewing automation or quality tooling?
3. How do you separate a refactor from feature work in a time-constrained change?
4. What evidence would you want before approving a behaviour-preserving refactor?
5. Tell us how QA skills help with maintainability and code review.

## Practical Exercise

### Refactor Without Losing Confidence

Use the working but difficult-to-maintain quality-summary utility in the Delivery 3 companion, or a comparable local utility. Preserve its documented result while improving only the specific risks you identify.

1. State the shared valid input domain, then characterize current behaviour with a small set of representative observations, including no records, a threshold boundary, a pending state, a failure, and a slow endpoint.
2. Identify at least three smells or maintenance risks. State why each matters in this utility rather than naming it as a rule violation.
3. Choose a bounded refactoring sequence: for example, extract threshold validation, name repeated state-counting logic, and make a hidden dependency explicit.
4. Validate after each change, compare output with the characterization evidence, and inspect the diff for unrelated changes.
5. Explain which imperfections remain and why they are intentionally deferred.

### Expected Deliverables

- A short refactoring plan and change sequence.
- Revised TypeScript with focused names and responsibilities.
- Regression evidence comparing before and after observable behaviour.
- An engineering rationale that distinguishes structural change from any feature or bug fix.

### Stretch Challenge

Identify a potential abstraction that would remove duplication but make the current utility less clear. Document why you chose not to introduce it.

## Practical Resources

- [Delivery 3 Reliable Quality Utilities](../../../code/part-02-programming/delivery-03-reliable-quality-utilities/README.md) — legacy and refactored summary implementations with behaviour-equality validation.

## Further Reading

- Martin Fowler. [Refactoring](https://martinfowler.com/books/refactoring.html).
- Google Engineering Practices. [Code Review Developer Guide](https://google.github.io/eng-practices/review/developer/).
- IEEE Computer Society. [Software Engineering Body of Knowledge topics](https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics).

## References

[^fowler-refactoring]: Martin Fowler. [Refactoring](https://martinfowler.com/books/refactoring.html). Addison-Wesley, 2018. Accessed 2026-08-08.

[^google-code-review]: Google. [Code Review Developer Guide](https://google.github.io/eng-practices/review/developer/). Accessed 2026-08-08.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain maintainability in terms of safe future change and quality evidence.
- [ ] Identify a code smell as a question for investigation rather than an automatic defect.
- [ ] Distinguish a refactor from a feature change and bug fix.
- [ ] State the input domain over which a behaviour-preservation claim applies.
- [ ] Establish characterization evidence before changing a utility's structure.
- [ ] Make and validate a bounded structural change.
- [ ] Use comments and abstractions to clarify rationale, constraints, and responsibilities.
- [ ] Prioritise a technical-debt item using risk, impact, and evidence.
