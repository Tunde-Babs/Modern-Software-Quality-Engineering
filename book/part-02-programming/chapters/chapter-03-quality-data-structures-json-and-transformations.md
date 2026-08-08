# Chapter 3 — Quality Data: Structures, JSON, and Transformations

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 3 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2 |
| Estimated study time | 125 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A data transformation is useful when it makes a quality question easier to answer, not merely when it produces a new collection.

## Opening Story

The following illustrative scenario concerns a team preparing evidence for a release candidate. It has execution records from a service-check suite in test and staging environments. Each record includes an execution identifier, endpoint, status code, response time, timestamp, and a validation outcome. The team has hundreds of records, including a small number of duplicate events caused by a retry in its reporting path.

The initial report says that 98 percent of checks passed. That number sounds reassuring, but the release owner asks more useful questions. Which endpoints failed? Were failures isolated to one environment? Did any customer-critical request exceed the agreed response-time threshold? Are duplicate records inflating the apparent failure count? Did the report silently discard malformed data?

The answers are in the same data, but not in its current shape. A Quality Engineer needs to choose structures that represent the records clearly, validate what arrived, remove only the duplicates that are known to be duplicates, and produce a summary whose rules a reviewer can inspect.

The work is not “use `map` because arrays have a `map` method.” The work is to turn raw observations into bounded quality evidence. A transformation that hides uncertain input, counts the wrong thing, or loses the original records may be fast but misleading. A good transformation states the quality question, preserves the needed context, and makes its assumptions visible.

## Why This Chapter Matters

Modern Quality Engineering uses data constantly: execution records, API payloads, test fixtures, configuration, diagnostic events, report exports, and later, telemetry and data-quality signals. A QA Engineer who can read JSON but cannot reason about its shape or transform it safely is limited to the view offered by a tool's interface. A Quality Engineer can inspect the underlying information, ask whether it is trustworthy, and create a focused view that supports a decision.

This chapter introduces data structures and transformations in a deliberately bounded way. It prepares readers for API, automation, data-quality, observability, and AI-quality work, but it does not teach full API testing, SQL, data pipelines, or production monitoring. Its focus is the programming judgement required to choose an appropriate in-memory representation, validate external JSON, handle missing values, and derive evidence from a collection of records.

Chapter 2 introduced TypeScript types as a way to make code assumptions visible. This chapter adds the critical runtime boundary: a type declaration describes what the program expects; it does not prove that a file, service response, or environment value matches the description. External data should be treated as untrusted until the program validates the parts it needs.

## Learning Objectives

By the end of this chapter, you should be able to:

- choose among arrays, objects, records, maps, and sets based on the quality question and required operations;
- explain JSON as a data-interchange format and distinguish parsing from validation;
- treat external data as `unknown` until its relevant shape is established at runtime;
- traverse nested records and handle optional or missing values safely;
- use immutable transformations such as `filter`, `map`, `find`, `reduce`, sorting, and deduplication to answer a quality question;
- explain the purpose and limits of a summary derived from execution results; and
- produce a structured, reviewable evidence summary from a realistic Quality Engineering dataset.

## Data Structures Should Follow the Question

There is no universally best collection type. A useful choice starts with the questions the code must answer: Is order important? Do keys identify a record? Do we need fast membership checks? Must duplicate values be preserved? Does the result need to be serialised as JSON? Choose the simplest structure that makes the operation and its trade-offs clear.

### Arrays: ordered collections of similar records

Use an array when you have a sequence of executions, fixtures, failures, or observations that you will iterate, filter, transform, sort, or retain in order.

```ts
const executionIds: string[] = [
  "staging-orders-001",
  "staging-orders-002",
  "test-catalogue-003",
];
```

Arrays preserve insertion order and allow duplicates. That is often appropriate for raw execution data: two records might represent two different attempts, even if they concern the same endpoint. Do not deduplicate merely because duplicates are inconvenient. First establish what identifies the same logical execution.

### Objects and records: named properties and keyed values

Use an object when property names are part of a known model, such as an execution result. Use a `Record<string, T>` when dynamic string keys map to values of one kind.

```ts
interface ApiExecutionResult {
  executionId: string;
  endpoint: string;
  statusCode: number;
  responseTimeMs: number;
  environment: "development" | "test" | "staging";
  timestamp: string;
  validationPassed: boolean;
}

const failureCountByEndpoint: Record<string, number> = {
  "POST /orders": 2,
  "GET /catalogue": 1,
};
```

The object shape describes a known result. The `Record` describes a lookup-like summary whose keys are created from the data. A `Record` is especially convenient when the final summary will be serialised to JSON, as its keys are strings.

### Maps: explicit keyed collections

A `Map<K, V>` is useful when keys are not naturally object-property strings, when insertion order matters, or when an explicit collection API makes the operation clearer. The companion code uses a `Map<string, number>` while counting failures and then converts it with `Object.fromEntries` for a JSON-friendly summary.

```ts
const failureCountByEndpoint = new Map<string, number>();

failureCountByEndpoint.set("POST /orders", 1);
failureCountByEndpoint.set(
  "POST /orders",
  (failureCountByEndpoint.get("POST /orders") ?? 0) + 1,
);
```

The `?? 0` expression supplies a default only when `get` returns `undefined`. It does not hide a zero value. A `Map` can improve the counting mechanism; it does not decide whether an endpoint failure is important. That remains a quality and risk question.

### Sets: membership and uniqueness

A `Set<T>` stores unique values. Use it to track identifiers already seen, allowed environments, or endpoints already classified as slow. It does not preserve duplicate information, so only use it when the duplicate itself is not evidence you need.

```ts
const seenExecutionIds = new Set<string>();

function isFirstOccurrence(executionId: string): boolean {
  if (seenExecutionIds.has(executionId)) {
    return false;
  }

  seenExecutionIds.add(executionId);
  return true;
}
```

### A practical selection guide

| Need | Useful starting structure | Important caution |
|---|---|---|
| Keep each execution in received order. | `ApiExecutionResult[]` | A raw array can contain duplicates and malformed records. Validate before relying on it. |
| Represent one execution with named fields. | `interface ApiExecutionResult` and an object value | A TypeScript interface does not validate external data. |
| Count outcomes by endpoint or environment. | `Map<string, number>` or `Record<string, number>` | Decide whether endpoint paths are stable enough to be meaningful keys. |
| Check whether an identifier was already processed. | `Set<string>` | Define the identity rule before removing duplicates. |
| Preserve nested response context. | Nested objects and arrays | Traverse missing or optional paths defensively. |
| Produce JSON output. | Objects, arrays, strings, numbers, booleans, and `null` | Convert `Map` and `Set`; JSON does not preserve their semantics directly. |

## JSON Is a Format, Not Evidence

**JSON** (JavaScript Object Notation) is a text format for representing structured data. It can express objects, arrays, strings, numbers, booleans, and `null`; it does not carry TypeScript interface information with it.[^rfc8259] When JavaScript parses JSON, the resulting value can have many shapes. It may be an array, an object, a string, a number, `null`, or a nested combination.

`JSON.parse` confirms that text follows JSON syntax. It does not confirm that the parsed value is an `ApiExecutionResult`, that its fields have the expected types, that its timestamp is meaningful, or that the status code represents a valid business outcome.

### The fragile assertion

The following pattern is common and unsafe at a system boundary:

```ts
const response = JSON.parse(raw) as ApiExecutionResult;

console.log(response.endpoint.toUpperCase());
console.log(response.responseTimeMs.toFixed(0));
```

#### Context

The code receives text from a file, service, or report export and wants to process it as an execution result.

#### What it does

`JSON.parse` returns a JavaScript value. The `as ApiExecutionResult` assertion tells TypeScript to treat the value as that type, without performing a runtime check.

#### Why it matters

If `endpoint` is absent or `responseTimeMs` is a string, the program can compile and then fail or produce incorrect output at runtime. The assertion changed the compiler's view; it did not establish a fact about the data.

#### Engineering trade-off

Assertions can be appropriate for data created and controlled within a small, nearby boundary where the invariant is evident. They are a poor substitute for validation at an API, file, configuration, or integration boundary.

### Start external data as `unknown`

Treat parsed external data as `unknown` until code validates the properties it needs.

```ts
const parsed: unknown = JSON.parse(raw);
const execution = parseApiExecutionResult(parsed);
```

The first line acknowledges that parsing does not establish the business shape. The second line is a named validation boundary. A reader can inspect it, test it, and decide whether its rules are sufficient for the decision the utility supports.

### A small manual validation example

The companion utility uses small helpers rather than a mandatory schema library. This is not a claim that manual validation is always the best approach. It makes the runtime reasoning visible before later parts introduce more specialised tools.

```ts
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readFiniteNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];

  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Expected a finite number for ${key}.`);
  }

  return value;
}
```

#### Context

The utility needs to establish that a parsed value is a record and that a selected property is a usable number.

#### What it does

`isRecord` narrows `unknown` to a plain object-like record. `readFiniteNumber` verifies both the JavaScript type and a constraint that excludes `NaN` and infinite values.

#### Why it matters

The error message identifies the failed assumption. A caller can decide whether malformed input should halt a report, be recorded as an invalid item, or be handled through another policy. Silent coercion would create weaker evidence.

#### Engineering trade-off

Manual validation becomes repetitive as a model becomes large or widely shared. A later API or data-quality solution may use a schema or contract approach. The essential principle remains: external data is untrusted until validated against the requirements that matter.

## Work with Nested and Optional Data Deliberately

Nested data is common in service responses and test artifacts. A response might contain an optional error object, an array of validation messages, or a nested timing section. Do not assume every path exists merely because it appeared in one fixture.

```ts
interface ValidationMessage {
  field: string;
  message: string;
}

interface ValidationResponse {
  outcome: "accepted" | "rejected";
  errors?: ValidationMessage[];
}

function firstValidationMessage(response: ValidationResponse): string | undefined {
  const firstError = response.errors?.[0];
  return firstError ? `${firstError.field}: ${firstError.message}` : undefined;
}
```

Optional chaining (`?.`) is useful when absence is an expected possibility. It should not be used to make required evidence silently disappear. If an error list is mandatory when `outcome` is `rejected`, the data model or validator should express and enforce that relationship rather than allowing every missing value to flow through the program unnoticed.

## Transform Data to Answer a Quality Question

An array method is useful when it answers a question. Before writing a transformation, state the question in ordinary language. For the release-summary scenario, useful questions include:

- Which unique executions produced failed validation or an HTTP error?
- Which endpoints exceeded the response-time threshold selected for this context?
- How many unique executions occurred in each environment?
- Does the input collection validate completely, or does a malformed record stop this fail-fast utility before it produces a summary?

The following transformations operate on already validated `ApiExecutionResult` values. They do not replace the validation boundary.

### Filter: retain relevant evidence

`filter` returns a new array containing values that satisfy a predicate. It is useful for narrowing a large set of records to the ones relevant to a decision.

```ts
const failedResults = results.filter(
  (result) => !result.validationPassed || result.statusCode >= 400,
);
```

The condition is visible: a result is considered failed if its validation outcome is false or its HTTP status is an error. A team may choose a different rule, such as treating a 3xx response or a business warning as significant. The point is to make the rule inspectable rather than hiding it in a dashboard total.

### Map: project records into a different view

`map` returns a new array by applying a transformation to each value. It is useful when the next decision needs a smaller or differently shaped representation.

```ts
const failureEvidence = failedResults.map((result) => ({
  executionId: result.executionId,
  endpoint: result.endpoint,
  statusCode: result.statusCode,
  responseTimeMs: result.responseTimeMs,
}));
```

The transformation preserves identifiers and measured values that an investigator needs. It does not copy every property merely because it can. A useful output carries enough context to support the stated question while avoiding irrelevant or sensitive data.

### Find: identify one meaningful record

`find` returns the first matching value or `undefined`. Use it when one representative record is sufficient for a diagnostic next step, and handle the absence explicitly.

```ts
const firstSlowOrderRequest = results.find(
  (result) => result.endpoint === "POST /orders" && result.responseTimeMs > 750,
);

if (firstSlowOrderRequest) {
  console.log(`Inspect execution ${firstSlowOrderRequest.executionId}`);
}
```

`find` does not answer how widespread the problem is. It gives a concrete record to inspect. Use a count or a grouped summary when frequency matters.

### Reduce and grouping: accumulate transparent summaries

`reduce` can accumulate many values into one result. It is powerful but can become unreadable when it performs several responsibilities at once. Prefer a named loop or small helper if that makes the aggregation easier to audit.

The companion code uses a `Map` and a `for...of` loop to count failures by endpoint:

```ts
const failureCountByEndpoint = new Map<string, number>();

for (const result of uniqueResults) {
  if (!result.validationPassed || result.statusCode >= 400) {
    failureCountByEndpoint.set(
      result.endpoint,
      (failureCountByEndpoint.get(result.endpoint) ?? 0) + 1,
    );
  }
}

const jsonReadyCounts = Object.fromEntries(failureCountByEndpoint);
```

#### Context

The release owner needs to see whether failures cluster around particular endpoints.

#### What it does

The loop counts one failure per unique execution and stores the count under the endpoint key. `Object.fromEntries` converts the `Map` to a serialisable object.

#### Why it matters

Grouping makes a pattern visible that a single pass percentage obscures. It can direct the next investigation toward an integration, a changed workflow, or an environment condition.

#### Engineering trade-off

Grouping by endpoint can combine very different customer operations if endpoint naming is too broad, or split the same risk if identifiers contain variable path segments. Choose grouping keys that represent the question, and record the limitation.

### Sort: order evidence without changing the original collection

JavaScript's `sort` mutates its array. When retaining the original order matters for another analysis, make a copy first.

```ts
const slowestFirst = [...results].sort(
  (left, right) => right.responseTimeMs - left.responseTimeMs,
);
```

The copied array makes the mutation boundary visible. Sorting does not establish a performance conclusion; it creates a prioritised view for investigation.

### Deduplicate: define identity before removing evidence

The companion utility removes repeated execution records using `executionId`:

```ts
export function uniqueExecutions(results: readonly ApiExecutionResult[]): ApiExecutionResult[] {
  const seenExecutionIds = new Set<string>();

  return results.filter((result) => {
    if (seenExecutionIds.has(result.executionId)) {
      return false;
    }

    seenExecutionIds.add(result.executionId);
    return true;
  });
}
```

This is correct only if identical execution identifiers truly represent duplicate reports of one logical execution. If an identifier can be reused by an upstream system, deduplication would discard legitimate evidence. State the identity rule before implementing the `Set`.

## A Complete Delivery 1 Evidence Transformation

The companion [`qualityEvidence.ts`](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/src/qualityEvidence.ts) connects the preceding ideas. It defines an `ApiExecutionResult`, validates unknown records at a runtime boundary, removes duplicate execution reports, filters failed and slow results, counts failures by endpoint, and creates JSON-ready output.

Its runner uses fixture data only:

```ts
const results = parseApiExecutionResults(rawExecutionResults);
const summary = summariseExecutionResults(results, 750);

console.log(JSON.stringify(summary, null, 2));
```

The parser uses an all-or-nothing validation boundary: it validates the complete collection and fails fast with the index and reason for the first malformed record. It does not create a partial summary for a mixture of valid and invalid records.

When validation succeeds, `receivedRecordCount` reports the validated input records before deduplication. `uniqueExecutionCount`, `failedUniqueExecutionCount`, `slowUniqueExecutionCount`, `failureCountByEndpoint`, `slowEndpoints`, and `uniqueExecutionCountByEnvironment` all describe the deduplicated logical-execution population. The resulting summary can therefore answer bounded questions: how many source records were received, how many unique executions remained after the stated identity rule, which endpoints had failed or slow unique executions, and how unique executions were distributed by environment.

It cannot prove that the test suite represented all customer paths, that 750 milliseconds is an acceptable threshold, that a service is reliable in production, or that the source report contains every relevant execution. The code reports its processed evidence; a Quality Engineer must still communicate the context and limits of the decision it informs.

## Preserve Traceability Through a Transformation

A transformation is easier to trust when an engineer can trace an important summary item back to the records and rules that produced it. This does not require retaining every raw payload indefinitely; data retention, privacy, and operational cost are legitimate constraints. It does require the program to avoid presenting an aggregate as though its path were unknowable.

For the execution-summary example, a useful traceability chain is:

```text
raw report text
  → parsed unknown value
  → validated execution records, or one explicit validation failure that stops this fail-fast utility
  → deduplicated records using stated execution identity
  → filtered and grouped records using visible quality rules
  → summary for a named decision
```

Each arrow is a boundary where information can be lost, changed, or reinterpreted. A reviewer should be able to ask what happened there. Did validation stop the utility, and which record violated which rule? Were duplicates removed by identifier or by matching several fields? Was an operation called slow because it exceeded a contextual threshold or because it was simply in the top ten results? These questions make a report auditable enough to support an engineering conversation.

### Missing, invalid, and not-collected are different conditions

Treating every unavailable value as `undefined` makes it easy to lose the reason that evidence is absent. The distinctions below are often useful even in a small utility.

| Condition | Example | Useful response |
|---|---|---|
| Missing | An optional diagnostic correlation identifier was not supplied. | Preserve the absence and decide whether the summary can continue without it. |
| Invalid | `responseTimeMs` is the string `"fast"` instead of a finite number. | Reject or isolate the record with a clear validation failure. Do not coerce it silently. |
| Not collected | The suite did not record timing for this check. | Report an evidence gap; do not interpret it as a fast response. |
| Not applicable | A cached local calculation has no network response time. | Model the scope so it is excluded from a service-timing summary for a stated reason. |

This distinction prevents a common reporting error: an absence is converted to zero, empty text, or a passing value so that an aggregation can continue. The report may look complete while its most important uncertainty disappears. A utility that intentionally supports partial processing should count or list unprocessable records separately and state whether they affect the decision. The companion takes the different, explicit policy of stopping before it produces a summary.

### Keep validation and transformation as separate responsibilities

It is tempting to parse, validate, filter, group, and format a report in one chain. That can be concise, but it makes failures difficult to explain. A more reviewable design uses named stages:

```ts
const parsedInput: unknown = JSON.parse(rawReport);
const validatedResults = parseApiExecutionResults(parsedInput);
const summary = summariseExecutionResults(validatedResults, slowResponseThresholdMs);
```

The program can now say whether a failure came from invalid source data or from a transformation rule. The validator can be reused when the same data is consumed by a different report. The summary function can be tested with deliberately constructed valid results without involving JSON parsing. Later chapters will deepen module design and utility testing; the value here is already visible in the names.

### Choose an evidence-friendly output shape

The output of a transformation should support its consumer. A terminal-oriented diagnostic might keep a small list of representative failures. A machine-consumed summary may need stable object keys and explicit counts. A human review may need the threshold, scope, time range, and source limitation alongside the numbers.

For example, a utility that intentionally supports partial processing could use an output more interpretable than a bare `failureRate`:

```ts
interface EvidenceReport {
  sourceRecordCount: number;
  uniqueExecutionCount: number;
  rejectedRecordCount: number;
  slowResponseThresholdMs: number;
  failureCountByEndpoint: Record<string, number>;
  slowEndpoints: string[];
  limitations: string[];
}
```

This is not the current companion's output shape: its all-or-nothing validator has no `rejectedRecordCount` because it stops at the first malformed record. The report does not become truthful merely because it has more fields. Its values must still be produced by correct rules, and its limitations must be accurate. But the shape prompts the author and reviewer to include the context a decision-maker needs: source count, deduplication effect, rejected input, chosen threshold, and known boundary.

## Transformations Should Remain Proportionate

In-memory transformations are appropriate for a small fixture set, a focused diagnostic, or a bounded report. They are not a substitute for a data pipeline, durable storage, query engine, or organisation-wide quality metric system. As volume, frequency, privacy constraints, retention needs, and cross-team consumers grow, the implementation and governance need to change as well.

The Quality Engineer's first responsibility is not to build the largest possible processor. It is to make the immediate evidence reliable enough for the decision while recognising when the need has become a data-engineering or platform capability. This is the same proportionate reasoning introduced in Part I: improve the system where the risk and repeated cost justify the investment.

## Engineering Perspective

Data transformations are engineering decisions because they determine what a team sees, counts, and acts on. A report that silently turns malformed values into defaults can reduce a visible failure rate while increasing uncertainty. A transformation that preserves every raw record without a way to group or prioritise can make a critical pattern invisible.

| Quality question | Data approach | Evidence limit to state |
|---|---|---|
| Did the selected checks produce failures? | Validate records, deduplicate by stated identity rule, then filter failure conditions. | The result concerns received execution records, not all possible product behaviour. |
| Which area should be investigated first? | Group failures by an endpoint or domain key and inspect representative records. | Grouping keys can hide variation; correlation is not root cause. |
| Did response time exceed the chosen condition? | Filter or sort validated measurements against a supplied threshold. | A threshold and sample do not substitute for a representative performance workload. |
| Is evidence missing or malformed? | For this companion, fail fast with the record index and validation reason; a partial-report utility needs a deliberate rejected-record policy. | The validator enforces only the fields and constraints it knows. |

The key discipline is to preserve uncertainty. If the source is incomplete, say so. If the identity rule is assumed, state it. If the summary supports prioritisation but not release approval, do not present it as complete confidence.

## Industry Perspective

The JSON specification defines the format's values and structure but does not define an application's domain schema.[^rfc8259] A JSON document can therefore be syntactically valid while still being unsuitable for a particular Quality Engineering utility.

TypeScript's narrowing documentation describes how runtime checks let a program safely work with values whose type is initially broader or unknown.[^typescript-narrowing] The TypeScript Handbook also distinguishes static type checking from JavaScript runtime behaviour.[^typescript-handbook] Together, these sources support a practical boundary: parse external data, validate the properties and constraints relevant to the decision, then transform the resulting trusted internal representation.

Teams may later choose contract or schema tools based on system risk, interoperability needs, and maintenance cost. This chapter deliberately teaches the principle before a tool: external data must earn the right to be treated as an expected type.

## Common Misconceptions and Pitfalls

### “JSON.parse validates my response.”

It validates JSON syntax, not the business shape, required fields, value constraints, or semantics of the data. Start with `unknown` and establish the fields your program needs.

### “A TypeScript assertion validates external data.”

`as SomeType` changes the compiler's view of a value. It does not examine the value at runtime. Use an assertion only where the invariant is already established; use validation at an untrusted boundary.

### “An array is always the right data structure.”

Arrays are excellent for ordered sequences and transformations. A `Map` may be clearer for keyed accumulation, and a `Set` may be appropriate for membership or deduplication. The question should determine the structure.

### “Deduplication always improves report accuracy.”

Deduplication is correct only when the chosen identifier defines one logical observation. Removing records without an identity rule can hide repeated failures or discard valid events.

### “A summary is neutral.”

Every summary chooses fields, thresholds, groupings, and exclusions. Make those choices visible. A compact summary is valuable when a reviewer can understand what it represents and what it omits.

### “Functional transformations are automatically clearer.”

`filter`, `map`, and `reduce` can express intent well. A deeply chained expression can be harder to inspect than two named intermediate values or a straightforward loop. Choose the clearest code for the operation.

## Summary

Quality Engineers need to reason about data because quality evidence is often collected, transformed, and reported as structured records. Arrays, objects, records, maps, and sets are not competing syntax features; they make different operations and assumptions visible. Choose them according to the quality question and the identity, ordering, grouping, or serialisation needs of the evidence.

JSON parsing is not validation. TypeScript types describe the shape expected by code, but external files and service responses must be treated as `unknown` until runtime checks establish the required properties. Manual validation in this chapter makes the boundary visible without requiring a vendor-specific schema library.

Transformations such as filtering, mapping, finding, grouping, sorting, and deduplicating should answer named questions. A useful evidence summary preserves enough context to guide action and states the limits of what its data can establish.

## Key Takeaways

- Choose data structures according to the operations and quality question, not habit.
- Arrays preserve ordered records; objects model named fields; records and maps support keyed summaries; sets support membership and stated uniqueness rules.
- JSON is a serialisation format. Successful parsing does not prove that data matches an expected business shape.
- Treat external data as `unknown` until runtime validation establishes the fields and constraints the program needs.
- Type assertions do not validate data; they can conceal mismatches from the compiler.
- `filter`, `map`, `find`, loops, and grouping are valuable when their rules and output purpose are visible.
- Deduplication requires an explicit identity rule; otherwise it can remove valid evidence.
- A summary supports a bounded decision and must state its assumptions, exclusions, and uncertainty.

## Review Questions

1. When would an array be a better representation than a `Map` for execution data?
2. What question should you answer before using a `Set` to remove duplicate records?
3. Why can valid JSON still be invalid input for a Quality Engineering utility?
4. What is the difference between parsing, type assertion, and runtime validation?
5. How does `unknown` improve reasoning at an external-data boundary?
6. What information should a transformation preserve when it reports failed executions?
7. Why might grouping failures by endpoint be useful but insufficient for root-cause analysis?
8. When should you copy an array before sorting it?
9. What can a response-time threshold show, and what can it not establish?
10. How would you report malformed records without silently treating them as passed evidence?

## Interview Questions

1. How do you decide between an array, object, `Map`, and `Set` for Quality Engineering data?
2. Why should you not rely on TypeScript types to validate an API response?
3. How would you safely process a JSON report from an external system?
4. A dashboard shows a low failure rate, but its source records contain duplicates and missing fields. What would you investigate before using it for a release decision?
5. How would you explain the difference between `filter`, `map`, `find`, and `reduce` using an execution-results example?
6. What makes a data transformation maintainable and reviewable?
7. How can deduplication hide a real quality problem?
8. What evidence would you keep when summarising slow service responses for an engineering discussion?

## Practical Exercise

### Quality Evidence Data Transformation

Create a TypeScript program that turns fictional API execution records into a structured evidence summary. Use local fixture data only.

1. **Define the model.** Create an `ApiExecutionResult` interface with execution identifier, endpoint, status code, response time, environment, timestamp, and validation outcome.
2. **Validate the boundary.** Start with `unknown` input. Write manual checks that establish at least the execution identifier, endpoint, response time, and validation outcome before you transform the data.
3. **Choose identity.** State the rule used to determine whether two records are duplicates. Implement deduplication only if the fixture data supports that rule.
4. **Answer quality questions.** Produce separate outputs for failed executions, slow executions against a supplied threshold, and counts by endpoint or environment.
5. **Preserve limits.** Write a short evidence note explaining what your summary supports, which input assumptions it makes, and what it cannot establish.

### Expected Deliverables

- A TypeScript source file with a typed model and explicit validation boundary.
- A fixture dataset with at least six records, including a failure, a slow response, an optional or missing value case, and a justified duplicate or near-duplicate case.
- A JSON-ready evidence summary.
- A one-page explanation of the chosen structures, transformation rules, and evidence limits.

### Stretch Challenge

Add a nested optional diagnostic object. Update your validation and transformation so that a missing diagnostic is visible in the summary rather than causing a runtime exception or being silently ignored.

## Practical Resources

- Run the complete fixture-based example in [Delivery 1 Quality Evidence Utilities](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/README.md).
- Read [`qualityEvidence.ts`](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/src/qualityEvidence.ts) alongside [`runQualityEvidenceExample.ts`](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/src/runQualityEvidenceExample.ts) to distinguish reusable transformation logic from execution-specific fixtures.
- **Build from:** [Chapter 2 — Essential TypeScript for Quality Engineers](chapter-02-essential-typescript-for-quality-engineers.md), especially `unknown`, narrowing, types, and module boundaries.
- **Continue:** Chapter 4 will turn these transformations into reusable functions and modules. **Supporting asset (Pass 2, planned):** a runnable code-reading and transformation workshop that asks learners to investigate malformed and duplicate evidence records.

## Further Reading

- Internet Engineering Task Force. [The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259).
- TypeScript. [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html).
- TypeScript. [Everyday Types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html).
- MDN Web Docs. [Array](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array), [Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map), and [Set](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set).

## References

[^rfc8259]: Bray, Tim, ed. [*The JavaScript Object Notation (JSON) Data Interchange Format*](https://www.rfc-editor.org/rfc/rfc8259). RFC 8259, IETF, 2017. Accessed 2026-08-08.

[^typescript-handbook]: TypeScript. [The TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html). Accessed 2026-08-08.

[^typescript-narrowing]: TypeScript. [Narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html). Accessed 2026-08-08.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Choose an array, object, record, map, or set by explaining the operation and quality question it supports.
- [ ] Explain why JSON parsing, type assertions, and runtime validation are different activities.
- [ ] Treat external data as `unknown` until the relevant structure is validated.
- [ ] Traverse nested and optional data without hiding an important absence.
- [ ] Use transformations to identify failures, slow observations, and grouped evidence.
- [ ] State an identity rule before removing duplicate records.
- [ ] Produce a JSON-ready evidence summary and explain its assumptions and limits.
- [ ] Explain how structured-data reasoning prepares you for later API, automation, data-quality, and observability work.
