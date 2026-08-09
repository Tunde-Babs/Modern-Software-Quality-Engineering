# Chapter 4 — Functions, Modules, and Composable Design

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 4 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–3: code-reading, TypeScript fundamentals, structured data, runtime validation, and transformations |
| Estimated study time | 125 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A useful Quality Engineering utility makes its decision, its dependencies, and its effects understandable to the next engineer who must change it.

## Opening Story

The following illustrative scenario concerns a team that produces a daily summary from fictional service-check results. A QA Engineer wrote a small script to read a JSON file, remove surrounding whitespace from endpoint names, count failed and slow checks, print a report, and save that report for a release discussion. Initially, the script was useful because it replaced a manual spreadsheet step.

Three months later, the script is used by several people. One team wants a different slow-response threshold. Another wants to run it against a fixture before changing a service. A developer needs the same summary in a pull-request check. When a record is malformed, the script sometimes writes an incomplete report before failing. The output looks authoritative, but nobody can immediately tell which rule selected the threshold, which code read the file, or whether the summary operated on validated data.

The first response might be to make one large `processResults` function more elaborate. That would retain the central problem: many independent decisions and effects remain hidden behind a vague name. The more useful question is: *which responsibilities need to be understood, reused, tested, or changed independently?*

The answer is not “one function per line” or “one module per noun.” The team can identify a small sequence: obtain external input, validate it, normalise a presentation detail, calculate a summary, format the summary, and write it. Some stages are deterministic decisions; some interact with the environment. That distinction gives the program a shape that an engineer can inspect. The result is still a small utility, but it has become an engineering asset rather than an accumulation of commands.

## Why This Chapter Matters

Chapters 1–3 established the first habits of programming for Quality Engineering: read code before changing it, use types to make assumptions visible, and validate and transform structured evidence deliberately. Those habits are necessary but not sufficient when a utility is reused. A program may have correct individual lines and still be difficult to modify because it mixes unrelated responsibilities, reads hidden state, mutates input unexpectedly, or exposes every internal detail to callers.

Quality Engineers often work in exactly this middle ground. They may improve an automation helper, a test-data generator, an evidence processor, a configuration loader, or a diagnostic script. These are usually smaller than product services, but their design still affects delivery confidence. A confusing utility can produce misleading results, delay investigation, or make a safe change expensive. Conversely, a clear utility can let a team reuse a quality rule without re-implementing it in every check.

This chapter teaches software design only to the degree needed to make those utilities understandable and maintainable. It does not introduce a catalogue of architectural patterns, a dependency-injection framework, or a universal code-style rule. The goal is practical judgement: identify a meaningful responsibility, give it an explicit contract, distinguish decision logic from external effects, and compose a few focused modules into a useful workflow.

Chapter 5 builds directly on this design. It treats environment variables, files, dependencies, and fixture data as external boundaries that should be made explicit. Chapter 6 then explains the asynchronous behaviour that file and network boundaries can introduce. This chapter uses a small asynchronous filesystem call only to show composition at a boundary; it does not teach concurrency, polling, retries, or timeout design.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify the separate responsibilities and reasons to change within a Quality Engineering utility;
- design a function with a name, inputs, outputs, and behaviour that form an explicit contract;
- distinguish pure functions from functions with observable external side effects without treating either as inherently superior;
- use composition to connect validation, transformation, summary, reporting, and external interactions;
- choose module boundaries that expose a small public interface and keep implementation details internal;
- explain how explicit dependency passing improves local reasoning and replacement of an external boundary;
- recognise when a generic helper module or abstraction makes a program less understandable; and
- refactor a small monolithic quality utility while preserving its observable behaviour and stating what you deliberately did not abstract.

## Begin with Responsibilities, Not with Files

A **responsibility** is a coherent purpose that an engineer can name and explain. It is usually associated with a reason to change: a validation rule changes because the expected input changes; a report formatter changes because its consumer needs a different representation; a filesystem adapter changes because the program’s storage boundary changes. A responsibility is not simply a block of code that happens to be adjacent to another block.

This idea helps a Quality Engineer resist two common but opposite mistakes. The first is keeping everything in one routine because splitting code feels like unnecessary formality. The second is extracting every operation into a separate function until the reader must navigate a dozen files to understand a simple calculation. The useful unit is the smallest boundary that makes a decision or an effect clearer.

Consider this intentionally compressed example:

```ts
async function processResults(): Promise<void> {
  const text = await readFile(process.env.QE_INPUT_PATH!, "utf8");
  const records = JSON.parse(text) as ApiExecutionResult[];
  const slowThreshold = Number(process.env.QE_SLOW_RESPONSE_THRESHOLD_MS ?? "750");
  const failed = records.filter((record) => !record.validationPassed || record.statusCode >= 400);
  const slow = records.filter((record) => record.responseTimeMs > slowThreshold);

  await writeFile(
    "quality-summary.json",
    JSON.stringify({ failed: failed.length, slow: slow.length }),
    "utf8",
  );
}
```

The code is short, but it performs at least six distinct things:

| Concern | Question an engineer needs to answer | Why a separate boundary can help |
|---|---|---|
| Configuration | Which path and threshold apply, and are they valid? | External values are strings or absent; the rest of the program should not repeatedly parse them. |
| File access | Can the source be read, and where is output written? | Filesystem failures and working-directory assumptions are environmental concerns. |
| JSON parsing | Is the input syntactically valid JSON? | A parsing failure is different from a domain-data failure. |
| Runtime validation | Does the parsed value have the fields and constraints this utility requires? | Type assertions do not validate a runtime value. |
| Quality policy | What counts as failed or slow for this report? | The rule should be inspectable and receive its threshold explicitly. |
| Reporting | Which structure should a human or another tool receive? | Formatting often changes independently of the underlying summary. |

The example also has hidden dependencies: `process.env`, a current working directory, the filesystem, and a particular output filename. `Number` can produce `NaN`, and `as ApiExecutionResult[]` tells the compiler to trust an unverified value. Chapter 5 addresses those boundaries in detail. For now, notice that a reader cannot identify the utility’s contract by reading its function name. `processResults` does not say which results, which decision, or which effects it owns.

### A responsibility map is a design aid

Before extracting code, build a responsibility map. Chapter 1 introduced this as a code-reading technique; it is equally valuable when designing a new utility. The map asks what each concern requires, what it produces, and what would cause it to change.

| Responsibility | Inputs | Output or effect | Likely reason to change |
|---|---|---|---|
| Validate execution records | unknown runtime value | trusted `QualityExecutionResult[]` or a clear validation failure | Fixture or source contract changes. |
| Normalise display values | trusted records | new, normalised records | A presentation rule changes. |
| Summarise evidence | records and a selected threshold | counts and endpoint lists | A quality question or policy changes. |
| Create and format a report | summary and report context | serialised report text | A report consumer changes. |
| Read and write text | paths and text | filesystem effects | Storage location or boundary implementation changes. |
| Coordinate the workflow | configuration and collaborators | report written or a clear failure | Workflow order or an external integration changes. |

The map is not a demand to create six files. A small program may keep two closely related pure operations together. It is a way to make design choices visible. If validation and normalisation must evolve together and are only used once, keeping them together may be clearer. If report formatting is used by several commands, it deserves a boundary. The decision should follow the code’s purpose and likely change, not a naming convention alone.

### Cohesion and coupling are questions, not scores

**Cohesion** describes how strongly the responsibilities inside a function or module belong together. A `summariseQualityExecutionResults` function that accepts trusted records and a threshold has high cohesion: each line helps answer one quality question. A `helpers.ts` file that contains date formatting, HTTP retry loops, fixture parsing, random ID generation, and release-note text has low cohesion: its contents are related only by convenience.

**Coupling** describes how much one part depends on details of another. Some coupling is necessary—composition is a sequence of dependencies. The concern is unnecessary coupling, such as a summary function that reads environment variables, writes a file, and depends on a global logger. That function cannot be understood from its parameters, and a change in the environment or logger can affect a calculation that ought to be deterministic.

Do not treat cohesion and coupling as metrics to optimise in isolation. A very tiny module can create navigation cost; a shared data model naturally connects several modules. Use the terms to ask practical questions: “Do these lines serve one purpose?” and “Does this caller need to know this internal detail?”

## Functions Make Contracts Visible

A function is useful when its name, parameters, return value, and documented behaviour let a reader predict what calling it means. The contract need not be formal legal language. It should make the responsibilities that matter to a caller clear: valid inputs, expected result, important absence or failure behaviour, and intentional effects.

Prefer a name that answers a domain question:

```ts
function calculateFailureRate(results: readonly QualityExecutionResult[]): number | undefined {
  if (results.length === 0) {
    return undefined;
  }

  const failedCount = results.filter(
    (result) => !result.validationPassed || result.statusCode >= 400,
  ).length;

  return failedCount / results.length;
}
```

`calculateFailureRate` communicates more than `process`, `handleData`, or `run`. It says that the output is derived from a supplied collection rather than obtained from a hidden service. Its `number | undefined` result makes the zero-observation case visible: there is no rate to calculate when no executions were observed. Another valid design might return a discriminated outcome containing an evidence limitation. What matters is that the caller does not mistake an absence of observations for a zero failure rate.

The `readonly` parameter communicates that the function does not need permission to reorder, add, or remove records. It is not a runtime lock, but it prevents accidental array mutation in TypeScript and tells a reviewer that calculation is the function’s purpose. Chapter 3 covered transformations and data structures; here the focus is the contract around them.

### Inputs and outputs should explain the rule

Parameters are not only a way to give code values. They make dependencies visible. Compare these two designs:

```ts
function isSlowResponse(responseTimeMs: number): boolean {
  return responseTimeMs > Number(process.env.SLOW_RESPONSE_THRESHOLD_MS);
}
```

```ts
function isSlowResponse(responseTimeMs: number, thresholdMs: number): boolean {
  return responseTimeMs > thresholdMs;
}
```

The second function has a clearer contract. A caller sees that the threshold is a policy choice. It can choose the threshold based on the relevant environment and quality requirement, and the function can be exercised with simple values. The first function has a hidden dependency on process state, an unvalidated conversion, and an unclear result when the variable is absent or non-numeric. Reading configuration at the application boundary and passing a trusted configuration object inward is the subject of Chapter 5.

Predictable return behaviour matters just as much. A function that sometimes returns a summary, sometimes logs an error and returns `undefined`, and sometimes throws makes every caller reconstruct its logic. Choose an outcome model that matches the decision. A pure calculation might return `undefined` for no data. A configuration loader might stop with a descriptive error because proceeding without a required path would create an unsafe or misleading result. Later chapters cover controlled error handling in depth; this chapter’s principle is that a caller should not have to guess the possible channels.

### Boolean flags often reveal two responsibilities

Boolean parameters are appropriate when they truly select one small, obvious variation. They are a warning sign when they turn a function into two unrelated workflows:

```ts
function createReport(results: QualityExecutionResult[], writeToFile: boolean): string {
  // Calculate, format, and optionally write a file.
  return "...";
}
```

The flag invites further flags: `includeFailures`, `useCompactFormat`, `sendNotification`. Soon a caller cannot infer which combinations are valid. The design is often clearer when calculation and formatting return values, while a separate outer function decides whether and where to write. That does not make every optional parameter wrong. It asks whether the same named responsibility still exists for both values. If it does not, name the separate operations.

### Deliberate mutation is sometimes the clearest option

Mutation means changing an existing object, array, or shared value. It is not automatically a defect. A `Map` used locally to accumulate failure counts is a straightforward and efficient form of mutation because the map is created, updated, and converted into output within one function. The caller cannot observe the intermediate state.

Mutation is riskier when a function changes an object supplied by its caller without making that behaviour clear. For example, calling `results.sort(...)` changes the caller’s array. If a later report expects the original execution order, a seemingly harmless summary can alter its evidence. A function that needs a sorted view can return `[...] .sort(...)` or document that it deliberately sorts in place when that is justified. The question is not “never mutate”; it is “can the next reader predict what changes, and is that change appropriately contained?”

## Pure Logic and External Effects

A **pure function** returns the same output for the same inputs and has no observable external side effects. It does not read a file, send a request, inspect the current environment, write a log, update a database, alter mutable shared state, or depend on the current time unless that value is passed as input. A pure function may use local variables and local mutation; those are not observable once it returns.

An **impure function** performs or depends on an observable effect. Common effects in Quality Engineering code include network calls, file reads and writes, environment access, logging, database updates, random-value generation, and mutable shared state. Effects are how useful programs interact with the world. A utility that never reads evidence or reports a result may be beautifully pure and completely useless.

The engineering principle is therefore not “eliminate effects.” It is: **keep decision logic easier to reason about by separating it from external effects where practical.** This reduces the number of things a reader must simulate at once. It also lets the same calculation be reused when the source changes from a local fixture to another safe, approved boundary.

### Separate the calculation from its acquisition

The following summary function is pure. Its only inputs are validated records and an explicit threshold:

```ts
export function summariseQualityExecutionResults(
  results: readonly QualityExecutionResult[],
  slowResponseThresholdMs: number,
): QualityEvidenceSummary {
  if (!Number.isFinite(slowResponseThresholdMs) || slowResponseThresholdMs < 0) {
    throw new Error("slowResponseThresholdMs must be a non-negative finite number.");
  }

  // Count failed and slow records, then return a new summary object.
}
```

It can be read as a rule: given this evidence and this threshold, what summary follows? It cannot establish that the evidence file existed, that an environment variable was correct, or that the result should approve a release. Those are deliberately outside its contract.

In contrast, the workflow that reads input and writes a report has effects. The Delivery 2 companion makes that boundary explicit:

```ts
export async function createQualityEvidenceReport(
  config: QualityToolConfig,
  fileSystem: TextFileSystem,
): Promise<QualityEvidenceSummary> {
  const sourceText = await fileSystem.readUtf8(config.inputPath);
  const parsedInput: unknown = JSON.parse(sourceText);
  const validatedResults = parseQualityExecutionResults(parsedInput);
  const normalisedResults = normaliseQualityExecutionResults(validatedResults);
  const summary = summariseQualityExecutionResults(
    normalisedResults,
    config.slowResponseThresholdMs,
  );

  await fileSystem.writeUtf8(config.outputPath, formatQualityReport(createQualityReport(config, summary)));
  return summary;
}
```

The `await` expressions make filesystem work visible, but the function is not an asynchronous-programming lesson. Its contribution is organisational: the workflow owns sequence and effects; the inner modules own parsing, validation, normalisation, summary, and formatting. The full companion adds useful boundary-specific errors around file reads, JSON parsing, and writes. Chapter 5 explains those errors and the filesystem interaction.

### Effects need names and ownership

An effect is easier to manage when its owning function makes it clear. `writeQualityReport` signals a file effect. `loadQualityToolConfig(process.env)` signals that an outer runner reads process state. A method called `calculateSummary` should not silently send a message or delete a fixture as a side effect.

This does not mean every function must declare every implementation detail in its name. A `createQualityEvidenceReport` workflow can legitimately coordinate several named effects. It does mean that callers should not be surprised by an effect that changes data, exposes information, or makes a result depend on external state. This is particularly important in quality tooling, where a failed check may already be difficult to distinguish from a fixture, environment, or utility failure.

## Composition Turns Focused Parts into a Useful Workflow

**Composition** is combining focused functions and modules so that the output of one forms the input of another. It is the alternative to a single function accumulating every step. Composition is not advanced functional programming; it is a readable way to show a workflow.

For the evidence utility, the composition is:

```text
read fixture text
  → parse JSON as unknown
  → validate required record structure
  → normalise trusted records
  → calculate a quality summary
  → create and format a report
  → write report text
```

Each arrow gives a reviewer a diagnostic question. Did the file read fail? Was the JSON malformed? Did a record violate the required model? Did a normalisation rule change the endpoint label? Did the summary apply the selected threshold? Did writing the report fail? A monolithic `processResults` function can perform these operations, but it is much harder to locate the relevant responsibility when one of them changes or fails.

### A composed Quality Engineering utility

The companion project at [`delivery-02-reusable-quality-utilities`](../../../code/part-02-programming/delivery-02-reusable-quality-utilities/README.md) applies the same data-boundary concepts as Delivery 1 without duplicating its code. Its modules are deliberately small:

| Module | Public responsibility | Important internal detail it hides |
|---|---|---|
| `models.ts` | Shared trusted contracts | No runtime validation claim. |
| `validation.ts` | Convert unknown values into trusted execution records. | Property-reading helpers and error construction. |
| `normalisation.ts` | Return records with an intentional presentation normalisation. | The record-copy implementation. |
| `summary.ts` | Calculate failed and slow execution evidence. | Local counting maps and predicates. |
| `reporting.ts` | Construct and serialise the report representation. | JSON formatting detail. |
| `configuration.ts` | Convert supplied string values into trusted configuration. | Required-value and numeric parsing helpers. |
| `fileSystem.ts` | Provide Node.js UTF-8 file effects behind a small interface. | Direct `node:fs/promises` calls. |
| `workflow.ts` | Coordinate the stages in order. | No duplicate policy or validation logic. |

The benefit is not the number of files. It is that a reader who wants to alter the failure rule can go to `summary.ts` without risking a filesystem change, while a reader who needs a different storage mechanism can reason about `TextFileSystem` without rewriting the summary. A later test can replace `TextFileSystem` with a small in-memory implementation; Chapter 11 covers testing utility code in depth.

### Composition improves several kinds of work

Composition supports more than unit testing.

- **Readability:** Named stages communicate the path from external input to evidence.
- **Reuse:** A different command can reuse validation and summary logic without copying the file-reading code.
- **Debugging:** A failure can be classified by stage before an engineer changes a rule blindly.
- **Replacement:** A local fixture reader can later be replaced by an approved source adapter while retaining the inner decision logic.
- **Review:** A focused change produces a smaller, more meaningful diff. A reviewer can ask whether a rule changed without scanning unrelated output code.

These are potential benefits, not guarantees. A chain of tiny wrapper functions with obscure names can be worse than one direct implementation. The purpose of composition is to expose a meaningful flow, not to maximise indirection.

## Modules Define a Public Boundary

In TypeScript, a file containing a top-level `import` or `export` is a module. Its declarations are scoped to that module unless they are explicitly exported.[^typescript-modules] This language feature supports an important design choice: callers should receive only the public behaviour they need, while helpers that exist only to implement that behaviour remain internal.

For example, `validation.ts` exports `parseQualityExecutionResults`, because a workflow needs to validate an external collection. It does not export `readNonEmptyString` or `isRecord`. Those helpers are implementation details. Exporting them would increase the public surface that future changes must preserve, even though no caller has a meaningful reason to depend on them.

```ts
// validation.ts
function readNonEmptyString(record: Record<string, unknown>, key: string): string {
  // Internal parsing detail.
}

export function parseQualityExecutionResults(input: unknown): QualityExecutionResult[] {
  // Public runtime-validation boundary.
}
```

“Public” does not mean published to the internet. It means available to another module in this project. Treating exports as a deliberate interface helps a team ask whether a caller truly needs a capability or merely needs a shortcut into an implementation.

### Choose boundaries that match responsibility

Useful modules often correspond to stable concepts in a quality utility: validation, evidence calculation, configuration, reporting, or a filesystem adapter. They do not need to reflect every object in the domain. For a very small utility, one `qualityEvidence.ts` module may reasonably contain its data model, validation, and summary, as the Delivery 1 companion does. When the module begins to have unrelated reasons to change, splitting can improve focus.

One tempting answer is a universal `helpers.ts` file. A small helper module can be appropriate when it contains genuinely related, stable utilities with a clear ownership boundary. The risk is gradual accumulation: an engineer cannot decide where a new function belongs, imports pull unrelated concepts into a file, and a change for one consumer affects many others. Prefer a domain-oriented name when possible: `validation.ts` communicates a responsibility that `helpers.ts` does not.

### Keep dependency direction understandable

Avoid circular dependency thinking. A circular dependency occurs when module A imports module B and module B, directly or through another path, depends on module A. It makes initialisation and ownership harder to reason about. The first response should not be a complicated workaround. Reconsider the direction of responsibilities.

For example, `workflow.ts` may import validation, normalisation, summary, reporting, and a filesystem interface because it coordinates them. The lower-level modules should not need to import `workflow.ts` in return. Shared types can live in `models.ts`, which has no dependency on the workflow. This direction mirrors the conceptual flow: reusable rules do not need to know which command happened to compose them.

The goal is understandable dependency direction, not an ideal diagram. If two modules always change together and depend on each other’s internals, they may be one responsibility that was split too early.

## Make Dependencies Explicit

A **dependency** is anything a function needs that is not created entirely from its own inputs: a filesystem, a clock, a random-number source, a logger, configuration, another module, or an external service. Dependencies are not bad; programs cannot do meaningful work without them. Hidden dependencies make local reasoning difficult because a reader must search beyond the function to find the conditions that affect its outcome.

Configuration is a familiar example:

```ts
function createReport(): string {
  const environment = process.env.TEST_ENV;
  return `Report for ${environment}`;
}
```

The function’s input is empty, but its behaviour depends on an external process value. It is harder to reuse in a different environment, and a missing value can produce an unhelpful report. A clearer design passes the required information:

```ts
interface ReportContext {
  environment: string;
}

function createReport(context: ReportContext): string {
  return `Report for ${context.environment}`;
}
```

The outer application is still responsible for reading and validating `process.env`. Chapter 5 establishes that boundary. The inner function can now be understood from `context`, and a caller makes its environmental choice visible.

### Basic dependency injection without a framework

**Dependency injection** means supplying a dependency to code rather than having the code create or discover it internally. The phrase can suggest a framework, but the basic form is simply a parameter.

The companion workflow receives a `TextFileSystem`:

```ts
export interface TextFileSystem {
  readUtf8(path: string): Promise<string>;
  writeUtf8(path: string, contents: string): Promise<void>;
}

export async function createQualityEvidenceReport(
  config: QualityToolConfig,
  fileSystem: TextFileSystem,
): Promise<QualityEvidenceSummary> {
  // Coordinate the workflow using the supplied dependency.
}
```

The workflow does not have to know whether the supplied implementation uses Node.js files, an in-memory replacement, or another approved mechanism. That is valuable because the workflow’s purpose is not “know Node.js APIs”; it is “create a quality-evidence report from a trusted configuration and file-text boundary.” Do not introduce an interface for every local function. Dependency passing earns its value when it separates a meaningful external or variable collaborator from decision logic.

## Avoid Abstraction for Its Own Sake

Abstraction removes detail from a caller’s view. It is helpful when the hidden detail is stable enough that callers should not manage it, and harmful when it hides decisions callers need to make. A generic `runQualityTask<TInput, TOutput>` function may look reusable, yet require callbacks, flags, and type parameters that obscure the simple report workflow it replaced.

Before creating an abstraction, ask:

1. What real duplication or instability does this solve?
2. Do the current cases have the same responsibility, inputs, outputs, and failure behaviour?
3. Can I give the abstraction a name that explains its policy without reading all callers?
4. Will the next likely change become easier, or will it require learning an extra mechanism?

If the answer is uncertain, keep the concrete code. Repeated code is a signal to investigate, not automatic proof that a shared helper exists. Two validation rules can look similar while differing in safety requirements, evidence meaning, or ownership. Premature unification can make later change more dangerous than a small amount of local duplication.

This is especially relevant for Quality Engineering. A generic “assert response” helper may hide whether a caller needs contract evidence, customer-outcome evidence, fixture validation, or a diagnostic message. Reuse the mechanics only after the quality question and evidence meaning are genuinely shared.

## Engineering Perspective

Function and module design are quality decisions because they affect how safely a team can interpret, modify, and rely on quality tooling. The design does not make evidence true by itself. It makes the rules, assumptions, and boundaries around that evidence easier to inspect.

| Engineering question | Design contribution | Limit to state |
|---|---|---|
| Can a reviewer understand the quality rule? | Give the calculation a domain name, typed inputs, and predictable output. | Clear code does not prove that the selected rule or threshold is appropriate. |
| Can the same rule be used with a different source? | Keep validation and summary logic separate from file or process effects. | Reuse still requires checking that the new source and context are compatible. |
| Can a failure be located quickly? | Name stages and make external effects explicit. | A named stage is not a full diagnosis or root-cause analysis. |
| Can a change stay bounded? | Group code by responsibility and expose only needed exports. | Module boundaries must be reviewed as product needs evolve. |
| Can a test or runner replace an external collaborator? | Pass a focused dependency such as a filesystem interface. | Replacement code must still model the relevant boundary behaviour honestly. |

For a transitioning QA Engineer, this is a practical extension of familiar skills. Test design separates setup, action, observation, and cleanup because those concerns have different evidence and failure implications. Function and module design apply the same reasoning to the utility itself. Instead of accepting a script as an opaque test asset, the Quality Engineer can identify where a misleading outcome, hidden environment assumption, or risky change is likely to originate.

## Industry Perspective

TypeScript’s module documentation explains that a module has its own scope and that declarations must be exported to be consumed elsewhere.[^typescript-modules] This supports the language-level mechanism used in this chapter: imports and exports can make a dependency and a public boundary visible. The mechanism does not prescribe a universal folder structure or architecture; those remain context-sensitive design choices.

The TypeScript module reference also explains why Node.js-oriented TypeScript projects often use `.js` in relative import specifiers even when their source files are `.ts`: the emitted program is resolved by the runtime, while TypeScript resolves the source appropriately during compilation.[^typescript-module-reference] The companion uses this convention so its compiled examples run as ECMAScript modules. It is an implementation detail of this teaching project, not a requirement for every TypeScript codebase.

Established software-design literature has long treated modularity, information hiding, and dependency direction as ways to reduce the cost of understanding and changing systems.[^parnas] The enduring lesson for Quality Engineering is proportionate rather than ceremonial: make the boundary clear enough for the risk, expected reuse, and likely change.

## Common Misconceptions and Pitfalls

### “A function must be short to be good.”

Length can reveal accumulated responsibilities, but it is not a reliable rule by itself. A long, linear calculation with one clear purpose may be easier to understand than five functions that each hide a fragment of one decision. Extract when a responsibility, contract, or change boundary becomes clearer.

### “Pure functions are production code; impure functions are bad code.”

Pure functions are easier to reason about in many cases. Useful programs must also read inputs, produce diagnostics, and change the world. Keep effects deliberate and well owned; do not pretend they can disappear.

### “A module should export every useful helper.”

Every export becomes a dependency another file may rely on. Keep helpers internal until another module has a real, stable need for them. A small public interface gives future changes more freedom.

### “Dependency injection requires a framework.”

Passing configuration, a logger, or a filesystem collaborator as a parameter is dependency injection in its simplest form. Use this technique when it makes a meaningful external dependency visible; do not introduce ceremony for local helpers that are already clear.

### “A giant `helpers.ts` module is convenient.”

It can be convenient at first. It becomes a problem when unrelated concerns accumulate and nobody can identify ownership or a safe place for a change. Group helpers by a coherent responsibility instead.

### “Duplicate-looking code must be abstracted immediately.”

Similar syntax can conceal different policies, failure behaviour, or quality questions. State what is truly shared before creating a generic helper. A little local duplication is often safer than a misleading abstraction.

### “Composition means a chain of clever one-line expressions.”

Composition is valuable when a reader can follow named stages and their data. Prefer intermediate names or a direct loop when they explain the decision better than a dense chain.

## Summary

Reusable Quality Engineering code begins with understandable responsibilities. Functions should state a meaningful purpose through their names, inputs, outputs, and predictable behaviour. Modules should expose the small public capabilities callers need while keeping parsing details, local helpers, and implementation choices internal.

Pure functions make calculations and transformations easier to inspect because their outputs follow from their explicit inputs. External effects such as filesystem access, configuration lookup, logging, and service calls are necessary, but should be owned by deliberate boundary functions rather than silently mixed into every calculation. Composition connects these focused parts into a readable workflow.

The objective is not maximum abstraction, maximum file count, or a prescribed architecture. It is proportionate design: make a small quality utility clear enough that another engineer can reuse, investigate, test, and safely change it. Chapter 5 extends this principle to configuration, files, dependencies, and test data.

## Key Takeaways

- A responsibility is a coherent purpose and often a distinct reason for code to change.
- Use a responsibility map before refactoring; it reveals boundaries without dictating an architecture.
- A useful function name, explicit inputs, predictable outputs, and deliberate mutation form a practical contract.
- Pure functions have the same output for the same input and no observable external side effects; effects remain necessary at program boundaries.
- Separate decision logic from file, environment, network, logging, and other effects where doing so improves reasoning.
- Composition connects named stages into a readable workflow and can improve reuse, debugging, review, and replacement of an external collaborator.
- Exports are public commitments. Keep implementation helpers internal unless callers have a stable reason to use them.
- Pass meaningful dependencies explicitly when it makes a boundary visible; a framework is not required.
- Avoid giant helper modules and premature abstractions. Reuse should make a real quality decision clearer, not merely reduce lines of code.

## Review Questions

1. What makes a responsibility different from a block of adjacent code?
2. How would you identify the responsibilities in a utility that reads a fixture, filters results, and sends a report?
3. Why is `calculateFailureRate` a more useful name than `process`?
4. When might `number | undefined` be more honest than returning `0` from a failure-rate calculation?
5. What makes a function pure, and which Quality Engineering operations commonly make a function impure?
6. Why is reading `process.env` inside a calculation function a hidden dependency?
7. What information should a module export, and why should internal helpers usually remain private to the module?
8. How can a Boolean parameter signal that a function has more than one responsibility?
9. When does passing a dependency as a parameter improve a design?
10. What questions should you ask before extracting a generic helper from two similar code blocks?

## Interview Questions

1. How would you refactor a test utility that creates data, calls an API, evaluates results, logs, and cleans up in one function?
2. Explain the difference between a pure function and an impure function using a Quality Engineering example.
3. How do you decide whether to create a new module in a TypeScript utility?
4. A summary function reads a threshold from an environment variable. What risks does that introduce, and how would you improve it?
5. What is dependency injection, and when is passing a dependency directly more useful than introducing a framework?
6. How would you preserve behaviour while decomposing a monolithic quality-reporting script?
7. Why can a generic helper make automation code harder to maintain?
8. How would you explain cohesion and coupling to a teammate reviewing a quality utility?

## Practical Exercise

### Refactor a Monolithic Quality Utility

The following illustrative utility represents the kind of script that becomes difficult to change after repeated additions. Do not treat its direct environment access, type assertion, or mixed responsibilities as a production pattern.

```ts
async function processQualityFile(): Promise<void> {
  const inputPath = process.env.QE_INPUT_PATH!;
  const threshold = Number(process.env.QE_SLOW_RESPONSE_THRESHOLD_MS ?? "750");
  const content = await readFile(inputPath, "utf8");
  const results = JSON.parse(content) as ApiExecutionResult[];
  const failed = results.filter((result) => result.statusCode >= 400 || !result.validationPassed);
  const slow = results.filter((result) => result.responseTimeMs > threshold);

  console.log(`Failed: ${failed.length}; slow: ${slow.length}`);
  await writeFile("quality-report.json", JSON.stringify({ failed, slow }), "utf8");
}
```

1. **Map the responsibilities.** Identify the distinct responsibilities, hidden dependencies, side effects, assumptions, and possible failure paths. State which observations concern the product and which concern the utility or its environment.
2. **Propose boundaries.** Define focused functions and modules. For each, state inputs, output or effect, and one reason it may change. Do not create a separate abstraction merely because a line can be moved.
3. **Refactor the utility.** Create a TypeScript implementation that validates parsed JSON as `unknown`, obtains a trusted configuration at an outer boundary, and composes validation, normalisation if justified, summary, formatting, and file effects.
4. **Preserve observable behaviour deliberately.** Decide which aspects are behaviour: the selected failure rule, slow threshold semantics, output location, output format, and error handling. Record any intentional change and why it was necessary to make the boundary safe.
5. **Justify restraint.** Identify at least one abstraction you considered but did not create. Explain why the current evidence does not justify it.

### Expected Deliverables

- A responsibility map identifying responsibilities, hidden dependencies, side effects, and risks.
- A proposed module layout with a short explanation of each public boundary.
- Refactored TypeScript source that preserves the stated behaviour and avoids `any`.
- A short design note explaining the dependency direction, policy inputs, and one deliberately avoided abstraction.
- Example input and output using fictional, non-sensitive data only.

### Reflection Questions

1. Which extracted boundary made the utility easier to understand, and what evidence supports that judgement?
2. Which effect remains necessary, and where is its ownership visible?
3. If another consumer needed the same summary but not file output, which module could it reuse?
4. What would you inspect before making the utility generic for a second report format?

## Practical Resources

- Read the Delivery 1 [`qualityEvidence.ts`](../../../code/part-02-programming/delivery-01-quality-evidence-utilities/src/qualityEvidence.ts) to see a focused validation-and-summary module before its responsibilities are separated further.
- Run the [`Delivery 2 Reusable Quality Utilities`](../../../code/part-02-programming/delivery-02-reusable-quality-utilities/README.md) companion and inspect its `validation.ts`, `summary.ts`, `reporting.ts`, and `workflow.ts` modules together.
- **Build from:** [Chapter 3 — Quality Data: Structures, JSON, and Transformations](chapter-03-quality-data-structures-json-and-transformations.md), especially runtime validation, evidence transformations, and their stated limits.
- **Continue:** Chapter 5 makes configuration, files, dependencies, and fixture data explicit outer boundaries. **Supporting asset (Pass 2, planned):** a code-review workshop in which learners compare alternative module boundaries for a quality-reporting utility.

## Further Reading

- TypeScript. [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html).
- TypeScript. [Modules — Reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html).
- Parnas, David L. [On the Criteria To Be Used in Decomposing Systems into Modules](https://doi.org/10.1145/361598.361623). *Communications of the ACM*, 1972.

## References

[^typescript-modules]: TypeScript. [Modules](https://www.typescriptlang.org/docs/handbook/2/modules.html). Accessed 2026-08-08.

[^typescript-module-reference]: TypeScript. [Modules — Reference](https://www.typescriptlang.org/docs/handbook/modules/reference.html). Accessed 2026-08-08.

[^parnas]: Parnas, David L. [On the Criteria To Be Used in Decomposing Systems into Modules](https://doi.org/10.1145/361598.361623). *Communications of the ACM*, 15(12), 1972. Accessed 2026-08-08.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Identify meaningful responsibilities, hidden dependencies, and side effects in a small Quality Engineering utility.
- [ ] Define a function with a clear domain name, explicit inputs, and predictable result behaviour.
- [ ] Explain why a pure calculation and a necessary external effect should often have different owners.
- [ ] Compose validation, transformation, summary, reporting, and boundary operations into a readable workflow.
- [ ] Choose a module’s public exports deliberately and keep implementation helpers internal.
- [ ] Explain how dependency passing can make configuration or filesystem boundaries easier to reason about.
- [ ] Recognise when a helper module or generic abstraction would obscure rather than simplify the code.
- [ ] Refactor a monolithic utility while preserving behaviour and stating the evidence limits of its output.
