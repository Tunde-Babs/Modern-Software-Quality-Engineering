# Chapter 2 — Essential TypeScript for Quality Engineers

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 2 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapter 1 — Programming as a Quality Engineering Practice |
| Estimated study time | 130 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Types make assumptions discussable. They do not make untrusted systems trustworthy by themselves.

## Opening Story

The following illustrative scenario concerns a release-summary utility used by a delivery team. The utility receives execution results from several checks and reports how many passed, failed, or were skipped. It began as a short JavaScript file and appeared to work until an integration returned a result without a `status` property. The utility counted the record as a pass because its conditional expression treated the missing value as harmless. The resulting dashboard did not show the missing evidence; it showed a reassuring total.

The immediate defect is small. The more important question is what the code promised about its input. Did it expect every result to have a name, a status, and a duration? Could the status be only `passed`, `failed`, or `skipped`? Was missing data acceptable, and if so, how would the utility report it?

A developer introduces a TypeScript model. The compiler now flags an attempt to treat an optional status as a definite value. The code becomes clearer to reviewers: it can express which values the utility is designed to handle and which outcome it returns. But when the integration sends a malformed JSON object, TypeScript still cannot inspect the remote response while the program runs. The team needs both a clear static model and a runtime boundary that validates external data before relying on it.

This chapter develops the TypeScript subset that makes these decisions visible. It is not a tour of every language feature. It is a way to write small Quality Engineering programs whose inputs, rules, and limitations can be understood and changed safely.

## Why This Chapter Matters

Quality Engineers work with information that is often partial, external, and consequential: test outcomes, service responses, environment values, execution timings, configuration, defect records, and user fixtures. Ambiguous code makes it easy to mistake an assumption for evidence. A type-aware language cannot remove all uncertainty, but it can make expected shapes and impossible combinations easier to see before a check runs.

TypeScript is JavaScript with a static type system. **Static type checking** analyses code before it executes and reports many mismatches between the values a program says it can handle and the operations it performs. The emitted program still runs as JavaScript. Types are not transmitted across a network, stored in JSON, or enforced automatically when a service returns data. That distinction is essential for Quality Engineering: compile-time feedback improves code, while runtime validation establishes whether untrusted data is safe to use.

The goal in this chapter is readable, idiomatic TypeScript that supports a quality question. It does not teach advanced type-level programming, language tricks, a browser framework, or full API testing. Chapter 3 uses these foundations to select data structures, validate runtime JSON, and transform execution data into evidence.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain the relationship between JavaScript runtime behaviour and TypeScript static type checking;
- use `const` and `let` to express whether a binding is intended to change;
- model Quality Engineering values with primitives, literal unions, arrays, objects, interfaces, and type aliases;
- write functions with clear parameters, return values, and explicit handling of optional values;
- use narrowing, conditionals, iteration, destructuring, and spread syntax to make control flow readable;
- introduce modules with imports and exports at an appropriate boundary;
- recognise common QA-code problems such as unsafe `any`, unclear return behaviour, unnecessary mutation, and ignored compiler feedback; and
- explain why a well-typed program can still fail when it receives malformed runtime data.

## TypeScript in the Quality Engineering Toolchain

TypeScript's purpose is to statically check JavaScript programs.[^typescript-handbook] It adds type information that the compiler can use while you write, build, and review code. If a function expects a result with a numeric duration and a caller provides a string, the compiler can identify the mismatch before the program runs.

This is valuable because many quality-tooling defects are assumption defects. A report processor assumes a field is present. A fixture builder assumes an environment value is valid. A check assumes a response has one shape. These assumptions may remain invisible in plain JavaScript until an unusual case reaches production or a pipeline.

### What TypeScript does and does not do

| TypeScript can help with | TypeScript cannot establish by itself |
|---|---|
| Inconsistent use of declared values in the code being checked. | Whether a remote API, file, or environment variable actually matches a declared type at runtime. |
| Access to an optional property without a check. | Whether an external dependency is available, timely, or semantically correct. |
| Passing an unsupported status to a typed function. | Whether a test covers the customer behaviour that matters. |
| A function that returns incompatible values on different paths. | Whether a business rule is correct or a threshold is appropriate. |
| Many errors caused by accidental `undefined`, incorrect property names, and mismatched values. | Whether a type assertion is truthful. Assertions can suppress useful compiler feedback. |

The second column is not a criticism. It is a reminder to use the right evidence for the question. Static checking, runtime validation, automated checks, logs, reviews, and operational signals each reveal different information.

### Concepts before syntax

Before choosing a type annotation, state the quality concept. For a result processor, the concept might be: “A completed test result has a name, one of three statuses, and a non-negative duration. A skipped result may include a reason.” The TypeScript syntax is then a precise way to represent the concept:

```ts
type TestStatus = "passed" | "failed" | "skipped";

interface TestResult {
  name: string;
  status: TestStatus;
  durationMs: number;
  skipReason?: string;
}
```

#### Context

The model supports a result processor, report, or small test utility. It deliberately does not try to model every possible test-management field.

#### What it does

`TestStatus` is a **literal union**: the value must be one of the three named strings. `TestResult` is an object shape with required properties and one optional property, marked by `?`.

#### Why it matters

The model prevents a misspelling such as `"passsed"` from being silently accepted by typed code. It also tells a reader that a skipped result may not have a reason. The type becomes part of the code's documentation and its feedback loop.

#### Engineering trade-off

Types add names and constraints that must evolve when the domain evolves. An overly broad model communicates little; an overly detailed model can make a small utility hard to change. Model the information needed for the current decision, then extend it deliberately when evidence requires it.

## Values, Variables, and Scope

Every program works with values. Common JavaScript values include strings, numbers, booleans, `null`, `undefined`, arrays, objects, and functions. TypeScript describes the values that a piece of code expects to receive and produce.

### Prefer `const`; use `let` when reassignment is part of the logic

Use `const` when the binding should not be reassigned. Use `let` when the variable must refer to a different value later. This does not make an object immutable; it only prevents rebinding the variable name.

```ts
const slowResponseThresholdMs = 750;
let remainingAttempts = 3;

remainingAttempts -= 1;

// slowResponseThresholdMs = 1_000;
// TypeScript reports an error because the binding is constant.
```

`const` communicates an intention: this threshold is stable within this operation. `let` communicates a different intention: the number of attempts changes as the operation proceeds. Prefer the narrower intention because it reduces the number of states a reader must consider.

Avoid both accidental mutation and performative immutability. A counter in a clear loop can be appropriate. A long function that changes one `let` variable in several branches may be difficult to reason about. Later chapters explore refactoring and functional transformations; for now, use mutation deliberately and keep its scope small.

### Type inference and explicit annotations

TypeScript can infer the type of a value from an initializer:

```ts
const environment = "staging";
const retryDelayMs = 250;
const shouldCaptureDiagnostics = true;
```

Explicit annotations help when they state a meaningful boundary, make a function's contract clear, or prevent a value from becoming too narrow or too broad:

```ts
const supportedEnvironments: string[] = ["development", "test", "staging"];
const responseTimeLimitMs: number = 750;
```

Do not add annotations mechanically to every local variable. An annotation that merely repeats what an obvious initializer says adds noise. Add it when it helps a reader understand the intended contract.

### Scope protects local reasoning

**Scope** is the region in which a name can be used. Keeping values near the code that uses them reduces accidental coupling. A module-level mutable variable that controls several tests can create order-dependent failures. A local value passed explicitly to a function makes the dependency easier to see and test.

```ts
function isSlowResponse(responseTimeMs: number, thresholdMs: number): boolean {
  return responseTimeMs > thresholdMs;
}

const isSlow = isSlowResponse(810, 750);
```

The function has no hidden dependency on a global threshold. Its caller can state the threshold that applies to a particular context. That does not make the threshold universally correct; it makes the policy visible.

## Model Quality Concepts with Types

### Primitives and literal unions

Use the primitive TypeScript types `string`, `number`, and `boolean` for ordinary values. A literal union is more useful when only a small, known set is valid.

```ts
type Environment = "development" | "test" | "staging";
type ValidationOutcome = "supported" | "failed" | "inconclusive";

function isReleaseBlocking(outcome: ValidationOutcome): boolean {
  return outcome === "failed";
}
```

This code does not decide what should block a release in every context. It demonstrates how a program can distinguish outcomes that an unstructured `string` would allow callers to misspell or misuse.

### Arrays and object shapes

An array models an ordered collection of values of the same conceptual kind. An object models a set of named properties. Use an array when order, iteration, or repeated records matter. Use an object when property names carry meaning.

```ts
interface TestResult {
  name: string;
  status: TestStatus;
  durationMs: number;
}

const results: TestResult[] = [
  { name: "password reset accepts a verified customer", status: "passed", durationMs: 185 },
  { name: "password reset rejects an expired token", status: "failed", durationMs: 420 },
];
```

The `TestResult[]` annotation says that every array member should satisfy the same object shape. It does not validate an array received from a file or API at runtime. That boundary belongs to Chapter 3.

### Type aliases and interfaces

Both a `type` alias and an `interface` can name an object shape. In this part, use whichever makes the domain clearer and follow the conventions of the codebase you are contributing to. A practical guideline is to use a `type` alias for a union or a compact composition and an `interface` for a named object contract that may be extended or implemented. The distinction is less important than a clear, stable model.

```ts
type TestStatus = "passed" | "failed" | "skipped";

interface ExecutionContext {
  environment: "development" | "test" | "staging";
  correlationId: string;
}
```

Avoid using types to encode every historical detail of a reporting system before you need it. A model should improve the next change and the next review.

## Functions Express Rules and Boundaries

A function should have a purpose that a reader can state. The most useful functions in Quality Engineering often answer a question, transform a value, validate a boundary, or perform one carefully named interaction.

### Parameters and return values

Function parameters name the required inputs. A return type tells the caller what result to expect. TypeScript can usually infer return types, but a visible annotation can document a boundary or prevent an accidental broadening of behaviour.

```ts
function classifyResponseTime(responseTimeMs: number, thresholdMs: number): "within-limit" | "slow" {
  return responseTimeMs > thresholdMs ? "slow" : "within-limit";
}

const classification = classifyResponseTime(810, 750);
```

#### Context

The function classifies one measured response against a threshold selected by the caller.

#### What it does

It returns only `"within-limit"` or `"slow"`. A caller cannot receive an unannounced third outcome without changing the function's declared contract.

#### Why it matters

The function separates a small mechanism from the policy that selected `750`. A report can count slow operations, while a separate quality strategy can explain why that threshold matters in its environment.

#### Engineering trade-off

The union is intentionally small. Real performance evidence often needs percentiles, workload context, error rates, and user outcomes; those concerns belong to later performance and reliability work. The narrow function is useful because its limitation is clear.

### Make every path communicate an outcome

A common automation problem is a function that sometimes returns a useful value and sometimes returns nothing. The caller must then guess whether `undefined` means “not found,” “not applicable,” “an error occurred,” or “the author forgot a return.”

```ts
function findFailedResult(results: readonly TestResult[]): TestResult | undefined {
  return results.find((result) => result.status === "failed");
}
```

The return type communicates a real possibility: no failed result may exist. The caller must narrow before using a property:

```ts
const failedResult = findFailedResult(results);

if (failedResult) {
  console.log(`Investigate: ${failedResult.name}`);
} else {
  console.log("No failed result was found in this data set.");
}
```

This is not needless ceremony. It makes an absence visible at the point where the code decides what to do about it.

## Optional Values, `null`, `undefined`, and Narrowing

An optional property may be absent. In JavaScript, reading a missing property yields `undefined`. Under strict TypeScript settings, the compiler asks you to account for that possibility before you use it as though it were definitely present.

```ts
interface FailureDetail {
  message: string;
  correlationId?: string;
}

function formatFailure(detail: FailureDetail): string {
  if (detail.correlationId !== undefined) {
    return `${detail.message} (correlation: ${detail.correlationId})`;
  }

  return detail.message;
}
```

**Narrowing** is TypeScript's process of using a runtime check to reduce a broader type to a safer one within a branch. Checks such as `value !== undefined`, `typeof value === "string"`, and a discriminating property can narrow a union. TypeScript's official guidance documents how these checks connect runtime control flow to the types available in each branch.[^typescript-narrowing]

Do not use non-null assertions (`value!`) merely to silence a compiler warning. They tell the compiler to trust you without adding a runtime check. Use one only when an invariant is already enforced in a nearby, obvious way and the assertion makes that invariant clearer rather than hiding a gap.

### `unknown` is an honest boundary; `any` disables one

`any` tells TypeScript to stop checking a value. It can be necessary in narrowly contained migration or interoperability code, but routine use turns type-aware code back into unverified JavaScript at the exact points where a Quality Engineer often needs clarity.

`unknown` is more honest for untrusted values. It says, “A value exists, but this code has not established what it is.” Before using it, the program must validate or narrow it.

```ts
function readExecutionId(input: unknown): string {
  if (
    typeof input === "object" &&
    input !== null &&
    "executionId" in input &&
    typeof input.executionId === "string"
  ) {
    return input.executionId;
  }

  throw new Error("Execution data did not contain a string executionId.");
}
```

This is a small form of runtime validation. Chapter 3 develops it into a repeatable way to cross JSON boundaries without making a vendor-specific schema library mandatory.

## Conditionals, Iteration, Destructuring, and Spread

Control flow should make the important cases easy to see. Prefer a clear `if` statement or loop over a clever expression that obscures a quality rule.

### Conditionals and early returns

An early return can prevent nested conditionals when an invalid or unsupported case should stop a function.

```ts
function reportValidationOutcome(result: TestResult): string {
  if (result.status === "skipped") {
    return `${result.name}: no evidence was produced because the check was skipped.`;
  }

  if (result.status === "failed") {
    return `${result.name}: investigate the failed evidence.`;
  }

  return `${result.name}: passed in ${result.durationMs} ms.`;
}
```

The branches do not claim that passed evidence proves quality. They communicate what the current result can support and direct the next action for a failure or a skipped check.

### Iteration chooses a readable route through data

Use `for...of` when you need a clear sequence, a `break`, or several steps per item. Use array methods when the transformation is direct and readable. Chapter 3 discusses `filter`, `map`, `find`, `reduce`, grouping, sorting, and deduplication in depth.

```ts
let totalDurationMs = 0;

for (const result of results) {
  totalDurationMs += result.durationMs;
}

const averageDurationMs = results.length === 0 ? 0 : totalDurationMs / results.length;
```

The empty-array condition is part of the quality rule. Without it, a report would produce `NaN`, which is technically a number in JavaScript but not meaningful evidence.

### Destructuring and spread clarify selected values

**Destructuring** extracts named values from objects or arrays. **Spread syntax** creates a shallow copy while adding or replacing properties. Both can improve clarity when used to state what changes.

```ts
const result: TestResult = {
  name: "customer can reset a password",
  status: "passed",
  durationMs: 185,
};

const { name, durationMs } = result;
const resultWithDiagnosticContext = {
  ...result,
  diagnosticLabel: `${name} completed in ${durationMs} ms`,
};
```

Spread is shallow: nested objects are still shared unless they are copied separately. Do not assume that `...value` makes arbitrary data safe or deeply immutable.

## Modules: Make a Useful Boundary Visible

A **module** is a file with its own scope that explicitly exports values for other files to import. Modules help a project show which code is a reusable boundary and which is an internal detail.

The Delivery 1 companion utility keeps its types and transformations in one module and its fixture-based execution in another:

```ts
// qualityEvidence.ts
export interface ApiExecutionResult {
  executionId: string;
  endpoint: string;
  responseTimeMs: number;
  validationPassed: boolean;
  // Additional fields are defined in the companion source.
}

export function summariseExecutionResults(
  results: readonly ApiExecutionResult[],
  slowResponseThresholdMs: number,
): QualityEvidenceSummary {
  // Implementation omitted here; see the companion code.
}
```

```ts
// runQualityEvidenceExample.ts
import { parseApiExecutionResults, summariseExecutionResults } from "./qualityEvidence.js";

const results = parseApiExecutionResults(rawExecutionResults);
const summary = summariseExecutionResults(results, 750);
```

#### Context

The runner owns sample data and output. The module owns the reusable model and transformations.

#### What it does

The import makes the dependency explicit. A reader can inspect `qualityEvidence.ts` to understand the contract rather than searching through a long script.

#### Why it matters

Separating a reusable rule from execution-specific setup makes both testing and change safer. A future API, pipeline, or report command can use the same transformation without duplicating it.

#### Engineering trade-off

Too many files can obscure a very small program. Extract a module when it represents a meaningful responsibility, is reused, needs separate testing, or benefits from a clear public boundary.

## Model Distinct Outcomes Without Losing Their Meaning

Booleans are useful when a question genuinely has two states. They become weak when a caller needs to distinguish several materially different outcomes. For example, `false` might mean that a validation rule failed, input was malformed, a dependency did not respond, or the utility did not attempt the check. Treating all of these as the same result can make a report simple but an investigation slow.

A discriminated union gives each outcome a stable `kind` value and allows the associated information to be different for each case.

```ts
type ValidationDecision =
  | { kind: "supported"; evidenceId: string }
  | { kind: "failed"; evidenceId: string; reason: string }
  | { kind: "inconclusive"; reason: string };

function describeDecision(decision: ValidationDecision): string {
  switch (decision.kind) {
    case "supported":
      return `Evidence ${decision.evidenceId} supports the selected rule.`;
    case "failed":
      return `Evidence ${decision.evidenceId} failed: ${decision.reason}`;
    case "inconclusive":
      return `No conclusion: ${decision.reason}`;
  }
}
```

#### Context

An evidence utility needs to communicate more than pass or fail. It must distinguish an observed failed rule from a situation where it cannot make a reliable conclusion.

#### What it does

The `kind` field allows TypeScript to narrow the union in each `case`. In the `supported` and `failed` branches, `evidenceId` is known to exist. In the `inconclusive` branch, the program cannot accidentally claim an evidence identifier that was never produced.

#### Why it matters

This model keeps uncertainty visible. An inconclusive check is not a passing check with an inconvenient note. It may need a different follow-up: restore an environment, collect missing data, investigate a dependency, or decide whether the absence blocks a release. Clear outcome modelling helps a Quality Engineer communicate what the code observed without overstating confidence.

#### Engineering trade-off

More outcome states require callers, reports, and tests to handle them. Add a state only when it represents a decision-relevant difference. A model with dozens of outcome labels can be just as opaque as a Boolean if nobody can explain which action each label should trigger.

### Treat compiler feedback as evidence about an assumption

Compiler feedback is not a verdict that a program is correct or incorrect. It is evidence that the code's declared model and its operations do not currently agree. A useful response is to identify the assumption behind the message.

For example, if TypeScript says that `result.skipReason` may be `undefined`, the code may have one of several legitimate designs:

- skipped results are expected to have a reason, so the model or runtime validator should enforce it;
- the reason is genuinely optional, so the output should handle its absence clearly; or
- the function should not accept skipped results because its responsibility concerns completed evidence only.

Silencing the feedback with `result.skipReason!` avoids the immediate message without choosing among those designs. The correct choice depends on the utility's purpose. This is a small example of engineering reasoning: use technical feedback to expose a decision, then make the decision in code and explain it to reviewers.

Strict compiler settings support this habit. Settings such as `strict`, `noImplicitAny`, and `noUncheckedIndexedAccess` increase the number of assumptions the compiler asks a program to address. They may require more explicit code, especially at array and external-data boundaries. That cost is worthwhile when it prevents an important absence or mismatch from being treated as ordinary success. It should be introduced with team agreement and readable patterns, not as a measure of engineering virtue.

## Write for the Next Reader and Reviewer

Types can make a program safer to change, but they do not remove the need for clear names, focused functions, and a reviewable story. A reviewer should be able to identify the quality question, relevant input model, decision rule, and evidence output without reconstructing the entire history of the utility.

Prefer names that reflect the domain decision. `findFailedResult` communicates more than `getData`; `slowResponseThresholdMs` communicates more than `limit`; `validationPassed` communicates more than `ok`. Avoid names that promise more than the code establishes. A variable called `releaseReady` is risky if it only means that one selected check passed.

Similarly, avoid making a type model look more authoritative than its source. `ApiExecutionResult` is a useful internal representation after validation. It is not proof that the remote API contract is complete, stable, or semantically correct. The Chapter 3 validation boundary makes that distinction operational.

## Common QA Coding Problems

### Excessive `any`

Using `any` for service responses, fixtures, or configuration avoids immediate compiler work but removes checks where assumptions are most fragile. Use a narrow type for known internal data and `unknown` plus validation for untrusted data.

### Mutable variables without a changing concept

If a variable changes only because the code is difficult to structure, a reader must reason about every reassignment. Prefer `const` for stable values and keep necessary `let` bindings local and purposeful.

### Functions with unclear return behaviour

A function that returns `true`, `false`, `undefined`, logs an error, and sometimes throws creates ambiguity for its caller. Choose and document a proportionate result model. Later chapters examine error-handling strategies in more depth.

### Deeply nested conditionals

Nested branches can hide the case that matters. Use early returns, named predicates, or a small helper when they make the decision path easier to inspect. Do not split code merely to satisfy a line-count rule.

### Assumptions about optional data

An optional response field, absent environment variable, or missing diagnostic identifier is a normal condition at many system boundaries. Decide what the code should do when it is absent; do not suppress the compiler's warning without evidence.

### Mixed test data and logic

Large literal objects inside a function can hide the rule the function is meant to express. Give fixtures and configuration an appropriate boundary so that a reader can distinguish input from behaviour. Chapter 5 treats configuration and test data in depth.

### Duplicated literals and ignored compiler feedback

Repeating endpoint strings, outcome labels, or thresholds invites inconsistent change. Give important concepts a name where it improves clarity. Treat compiler feedback as a prompt to understand an assumption, not as a set of warnings to silence.

## Engineering Perspective

TypeScript supports quality decisions when types are used to make a code boundary explicit. The following examples show the distinction between a technical mechanism and the engineering judgement around it.

| Engineering question | Useful TypeScript contribution | Still requires judgement or additional evidence |
|---|---|---|
| Which outcomes can this utility report? | A literal union and exhaustive handling of its known states. | Whether those states are sufficient for the product or release decision. |
| Can this function receive absent information? | Optional properties and narrowing before use. | Whether absence is acceptable, recoverable, or should block a workflow. |
| Can a caller misuse this rule? | Typed parameters and return values. | Whether the rule's threshold or business meaning is correct. |
| Can external data be trusted? | `unknown` at the boundary and runtime validation. | Which fields, constraints, and failure response are appropriate. |

TypeScript's value is not that it prevents all defects. Its value is that it moves certain misunderstandings into visible, reviewable code before execution. Quality Engineers should pair that feedback with deliberate examples, runtime checks, and evidence appropriate to the system's risk.

## Industry Perspective

The TypeScript Handbook describes TypeScript as a static type checker for JavaScript programs and positions its type system as feedback that occurs before code runs.[^typescript-handbook] Its guidance on everyday types covers primitive values, arrays, functions, object types, optional properties, and type inference—the limited, high-value subset used in this chapter.[^typescript-everyday-types]

The same documentation cautions that `any` effectively turns off checking for a value, while optional properties require code to account for `undefined` before use.[^typescript-everyday-types] These are not merely syntax details. In Quality Engineering code, they affect whether missing or malformed evidence becomes a visible failure, a handled condition, or a silent assumption.

TypeScript's narrowing guidance explains how runtime checks affect the types available in a branch.[^typescript-narrowing] That connection is especially useful at the boundary between typed program logic and data received from files, configuration, or services. Chapter 3 makes the boundary explicit.

## Summary

TypeScript helps Quality Engineers express and check assumptions in code before it executes. Values, literal unions, object shapes, functions, optional properties, control flow, and modules make a quality utility's intended inputs and outputs easier to inspect, review, and change.

Static types are valuable but bounded. A declared `ApiExecutionResult` does not verify that a remote service returned one. A compiler cannot decide whether a threshold represents an acceptable user outcome. A type assertion can hide a mismatch rather than establish a fact. Reliable Quality Engineering code combines static checking with runtime validation, focused tests, diagnostics, and clear evidence limits.

Chapter 3 applies this TypeScript foundation to arrays, objects, maps, sets, nested records, JSON parsing, and transformations that answer a quality question.

## Key Takeaways

- TypeScript statically checks JavaScript code before execution; it does not automatically validate external runtime data.
- Begin with a quality concept, then use types to make its valid states and expected shape clear.
- Prefer `const` for stable bindings and use `let` only when reassignment represents a real changing state.
- Literal unions, interfaces, type aliases, arrays, and object types can make Quality Engineering data more explicit and reviewable.
- Functions should communicate their inputs, outputs, possible absence, and important boundary conditions.
- Optional values require a deliberate runtime check or another explicit handling strategy.
- `unknown` is appropriate for untrusted input; routine `any` disables the compiler feedback that makes TypeScript valuable.
- Types improve code feedback, but runtime validation and engineering judgement remain necessary.

## Review Questions

1. What is the difference between TypeScript static checking and JavaScript runtime behaviour?
2. Why is a literal union useful for a test status or validation outcome?
3. When does an explicit type annotation improve a local variable, and when does it add noise?
4. Why might `const` improve local reasoning even when the object it references can still be mutated?
5. What question should a function's return type answer for its caller?
6. Why does a `TestResult` interface not prove that an API returned a valid test result?
7. What does narrowing accomplish when an optional property may be `undefined`?
8. Why is `unknown` often safer than `any` at an external-data boundary?
9. How can an early return improve a quality rule with several outcomes?
10. When should a function be extracted into a module rather than left in one small file?

## Interview Questions

1. What is the difference between JavaScript and TypeScript, and what does TypeScript not protect you from?
2. Why should a Quality Engineer avoid relying on a type assertion for an API response?
3. How would you model a test result with passed, failed, and skipped outcomes in TypeScript?
4. What is the difference between `null`, `undefined`, and an optional property in a practical utility?
5. How do you decide whether a function needs an explicit return type?
6. A compiler warns that a property may be undefined. How would you decide whether to narrow, return an absence, or treat it as an error?
7. Why can excessive `any` create a quality risk in automation code?
8. How would you organise a small TypeScript quality utility so that its reusable logic is separate from its fixture data and execution setup?

## Practical Exercise

### Typed Quality Result Processor

Create a small TypeScript module that processes test or quality results. Use fictional, non-sensitive data.

1. **Model the data.** Define a `TestStatus` literal union and a `TestResult` interface with `name`, `status`, `durationMs`, and one optional diagnostic field.
2. **Write three functions.** Create one function that classifies a duration against a supplied threshold, one that finds the first failed result, and one that produces a readable outcome message.
3. **Handle absence.** Make the failed-result function return `TestResult | undefined`. In the caller, narrow the value before reading its properties.
4. **Review the boundary.** Add one `unknown` input example and write a small guard that establishes only the property you need before using it.
5. **Explain the evidence.** Write three sentences: what the processor can report, what input assumptions it makes, and what it cannot establish about system quality.

### Expected Deliverables

- A TypeScript source file with typed models and functions.
- A small fixture array with at least one passed, failed, and skipped result.
- Console output or a short note showing the processor's outcomes.
- A brief explanation of one compiler error you encountered or could deliberately create, and how the type model prevents it.

### Stretch Challenge

Add an `environment` literal union and change the processor so that the duration threshold is supplied by the caller rather than hard-coded. Explain why the threshold remains a policy decision rather than a property of TypeScript.

## Practical Resources

- **Build from:** [Chapter 1 — Programming as a Quality Engineering Practice](chapter-01-programming-as-a-quality-engineering-practice.md), which establishes why types and boundaries matter for quality assets.
- Inspect [`qualityEvidence.ts`](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/src/qualityEvidence.ts) for a complete typed model with explicit runtime validation.
- **Continue:** [Chapter 3 — Quality Data: Structures, JSON, and Transformations](chapter-03-quality-data-structures-json-and-transformations.md) applies the same type-aware thinking to external execution data.

## Further Reading

- TypeScript. [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).
- TypeScript. [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
- TypeScript. [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html).

## References

[^typescript-handbook]: TypeScript. [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html). Accessed 2026-08-08.

[^typescript-everyday-types]: TypeScript. [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html). Accessed 2026-08-08.

[^typescript-narrowing]: TypeScript. [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). Accessed 2026-08-08.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain what TypeScript can check before code runs and what it cannot establish at runtime.
- [ ] Model a small Quality Engineering concept with primitives, literal unions, arrays, and object types.
- [ ] Use `const`, `let`, scope, functions, and return types to communicate intent.
- [ ] Handle optional values with a deliberate narrowing or absence strategy.
- [ ] Explain why `unknown` is a safer starting point than `any` for untrusted data.
- [ ] Use readable conditionals, iteration, destructuring, and spread syntax without hiding the quality rule.
- [ ] Separate reusable logic from execution-specific fixture data through a small module boundary.
- [ ] State the evidence and the limits of a typed quality utility.
