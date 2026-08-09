# Chapter 5 — Configuration, Files, Dependencies, and Test Data

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 5 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–4: TypeScript fundamentals, runtime validation, and functions, modules, and composable design |
| Estimated study time | 130 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A quality utility is easier to trust when its code, configuration, data, and dependencies state where their assumptions begin and end.

## Opening Story

The following illustrative scenario concerns a team whose test-results utility works perfectly on the laptop of the QA Engineer who created it. It reads a fixture from `./data/results.json`, uses a threshold declared near the top of the source file, and writes a report into a folder that already exists on that laptop. The engineer shares the utility before a release review. A colleague runs the same command from a different directory and receives “file not found.” Another colleague changes the threshold in the source code to investigate a staging environment, then accidentally commits that local policy change. A third uses a fixture containing a real customer email copied from a failed test.

None of these people made an unreasonable individual decision. The utility simply left important environmental assumptions implicit. Its input path depends on the current working directory. Its threshold is mixed with program logic. Its fixture ownership and data-safety rules are unclear. Its result is influenced by installed package versions that are not recorded precisely enough to reproduce. The code may be well typed, yet the larger execution boundary is not understood.

The team does not need an enterprise configuration platform to improve this. It needs a small, explicit design: read external values at one boundary, parse and validate them, create a trusted configuration object, pass it into reusable code, treat file contents as untrusted until validated, and keep example data deterministic and safe. The same approach helps a quality utility give useful errors instead of silently producing a report from the wrong input.

## Why This Chapter Matters

Reusable code must interact with its environment. A Quality Engineering utility needs a threshold, an environment label, a fixture path, a report destination, or a package that provides a compiler or runtime capability. These concerns are not merely setup details. They affect whether two engineers can reproduce an outcome, whether a report represents the intended data, whether a check accidentally targets the wrong environment, and whether sensitive information enters source control or diagnostics.

Chapter 4 established how to separate responsibilities and compose focused modules. This chapter applies that design to external boundaries. It teaches an important flow:

```text
external values and file contents
  → parse
  → validate
  → trusted internal configuration or data
  → reusable Quality Engineering logic
```

The goal is not to turn a Quality Engineer into a Node.js package-maintenance specialist. It is to provide enough knowledge to make configuration, files, dependencies, and test data explicit in small utilities. This helps the learner distinguish a product failure from a malformed fixture, a missing environment variable, an outdated package, or an unsafe test-data assumption.

The chapter also establishes boundaries for later work. Chapter 6 covers asynchronous programming in depth; here, asynchronous file operations appear only because file reading and writing are environmental boundaries. Chapter 7 covers defensive error handling; here, errors are made useful enough to identify a failed boundary. Later parts explore CI/CD, cloud configuration, API integration, data systems, and secrets management in their specialist contexts.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why configuration, files, dependencies, and test data are Quality Engineering boundaries rather than incidental setup;
- convert external environment values from strings or absence into a validated, typed configuration object;
- decide when a default is safe and when failing fast protects a decision from a misleading assumption;
- read and write JSON files while distinguishing file access, parsing, runtime validation, and domain use;
- explain how relative paths, absolute paths, the current working directory, and text encoding affect repeatable execution;
- distinguish `dependencies`, `devDependencies`, version ranges, and lockfiles as parts of reproducible dependency state;
- choose among static fixtures, generated data, environment-owned data, and shared mutable data by considering determinism, realism, isolation, privacy, and cleanup;
- recognise common secret-exposure risks in source files, local environment files, fixtures, and output; and
- build a small configuration-and-fixture boundary that gives an actionable error for invalid input.

## Treat Configuration as an Input Boundary

**Configuration** is information supplied from outside a program that changes how it operates without changing its source code. A quality utility might need an environment label, a quality threshold, an input path, an output path, or a non-secret feature choice. Configuration is valuable because it keeps context-dependent policy out of reusable logic. It is risky when the program assumes external values are already valid.

In Node.js, environment variables are available through `process.env`. Their values are strings or absent; they are not automatically numbers, Booleans, arrays, or trusted configuration.[^node-environment] That matters because a string that visually resembles a number has not yet been established as a finite, acceptable number for the program’s purpose.

```ts
const timeout = Number(process.env.TIMEOUT_MS);
```

This line is a conversion attempt, not validation. If `TIMEOUT_MS` is absent, `Number(undefined)` is `NaN` (*Not a Number*), a special JavaScript numeric value that does not represent a usable duration. If the value is `"slow"`, the result is also `NaN`. If it is an empty string, `Number("")` returns `0`, which may be a valid number syntactically but a dangerous silent policy for a timeout. A TypeScript annotation such as `const timeout: number` cannot correct this because the value enters at runtime.

The preferred boundary is:

```text
read external values
  → parse text
  → validate required values and constraints
  → create typed configuration
  → pass trusted configuration inward
```

This is the same reasoning Chapter 3 applied to JSON records. The source is different, but the boundary is the same: external data must earn the right to be treated as the program’s expected model.

### A trusted configuration object

The Delivery 2 companion defines configuration as a small internal contract:

```ts
export interface QualityToolConfig {
  environment: "development" | "test" | "staging";
  slowResponseThresholdMs: number;
  inputPath: string;
  outputPath: string;
}
```

This type does not validate `process.env`. It describes the value that the program may use *after* validation. The loader receives an external source explicitly rather than reaching into global process state:

```ts
export function loadQualityToolConfig(
  environment: Readonly<Record<string, string | undefined>>,
): QualityToolConfig {
  return {
    environment: readQualityEnvironment(environment),
    slowResponseThresholdMs: readNonNegativeFiniteNumber(
      environment,
      "QE_SLOW_RESPONSE_THRESHOLD_MS",
      750,
    ),
    inputPath: readRequiredText(environment, "QE_INPUT_PATH"),
    outputPath: environment.QE_OUTPUT_PATH?.trim() || ".build/quality-summary.json",
  };
}
```

The helper names communicate the boundary rules. `readRequiredText` rejects a missing or blank required value. `readQualityEnvironment` accepts only the limited set used by this teaching utility. `readNonNegativeFiniteNumber` turns a string into a number and rejects `NaN`, infinity, and negative values. The rest of the program now receives `QualityToolConfig`, not an object full of optional text.

Passing a configuration object inward makes a function’s dependencies visible:

```ts
function createQualityReport(
  config: Pick<QualityToolConfig, "environment" | "slowResponseThresholdMs">,
  summary: QualityEvidenceSummary,
): QualityReport {
  return {
    environment: config.environment,
    slowResponseThresholdMs: config.slowResponseThresholdMs,
    summary,
  };
}
```

The report formatter does not need to know `process.env` exists. Its context is part of the call. This is basic dependency passing from Chapter 4: code receives the information it needs instead of discovering it from hidden external state.

### Defaults are policy decisions

A **default** is a value the program uses when a configuration value is absent. Defaults can make a teaching utility or a local command convenient, but each default is a policy decision. It should be safe, documented, and appropriate to the risk of proceeding with an assumption.

The companion uses a default of `750` milliseconds only for its fictional slow-response example. It records that threshold in the generated report so a reader can see the policy used. It does not default the environment or input path: reading the wrong fixture or labelling evidence for the wrong environment would be more harmful than stopping with a clear error.

Use the following questions before adding a default:

| Question | A default may be reasonable when | Failing fast is safer when |
|---|---|---|
| Is there a bounded, low-risk local convention? | The companion output folder is consistently `.build/`. | The target environment selects a customer-impacting system. |
| Will the output state the chosen value? | A report includes the illustrative threshold. | A silent value would make a reader believe a policy was explicitly selected. |
| Can a caller override it easily? | A local output path can be overridden without changing logic. | A missing API key, fixture path, or required data source would make the program incomplete. |
| Is the meaning stable across contexts? | A generated filename is a convenience only. | A timeout, test account, release rule, or data-retention value varies by context. |

Failing fast means stopping before the program performs an operation or produces an output based on an unsafe or ambiguous assumption. It is not a claim that every missing optional preference is an error. It is a judgement that a particular absence would make the utility’s result less trustworthy than an explicit failure.

### Environment variables are not a secret store by themselves

Environment variables are a delivery mechanism for configuration. They do not make a value safe merely by moving it out of source code. A process environment can be visible to debugging tools, child processes, command history, logs, or people with access to a runner. The appropriate handling depends on an organisation’s platform and security policies.

For this chapter, distinguish non-secret configuration—such as a fixture path or threshold—from a **secret**, a value whose disclosure could grant access or cause harm. Passwords, API tokens, client secrets, private keys, and connection credentials are secrets. Do not put them in source, fixtures, examples, screenshots, report output, or version control. Chapter 5 provides awareness, not a vendor-specific secret-management tutorial; later delivery and security material addresses platform controls in more depth.

## Files Are Runtime Boundaries

Files are convenient for fixtures, quality-result exports, configuration samples, and report output. They also introduce conditions a typed in-memory example does not have: the file may not exist, its path may resolve somewhere unexpected, its text may use an unexpected encoding, its JSON may be malformed, or its content may violate the program’s required model.

The program should make these conditions distinguishable enough for an engineer to act. “Failed” is weak evidence when the useful next action is different for a missing fixture, an invalid JSON document, and a malformed execution record.

### Relative paths depend on the current working directory

A **relative path** is interpreted from the process’s current working directory (CWD), not necessarily from the source file that contains the path. For example, `fixtures/quality-executions.json` identifies a different location when a command is run from the project root than when it is run from a parent directory. An **absolute path** identifies a location from the filesystem root or drive root and does not depend on the CWD in the same way.

The Node.js `path.resolve` API constructs a normalised absolute path from path segments and uses the current working directory when no earlier segment establishes an absolute location.[^node-path] This explains a frequent “works on my machine” failure: the code is correct for one invocation directory but the utility never declared that assumption.

There is no single correct path strategy. A repository tool may deliberately document that it must run from the project root. A command-line utility may accept an explicit absolute or relative path and report the resolved location on failure. A packaged application may derive paths from a carefully defined application location. The important practice is to choose and document the boundary rather than relying on an accidental CWD.

The companion’s illustrative runner is intentionally run from its project directory and passes `fixtures/quality-executions.json` as configuration. Its README documents that command and shows how to override the input path. It does not claim that this relative path is universally portable.

### Text encoding is part of input interpretation

Computers store bytes; a **text encoding** is the convention that maps those bytes to characters. UTF-8 is a common encoding for JSON and source files. When a Node.js program calls `readFile(path, "utf8")`, it asks the filesystem API to return text interpreted as UTF-8 rather than an opaque byte buffer.

Encoding is usually invisible until it is not. A fixture with an unexpected encoding can produce unreadable text or a parse failure. Names, messages, and examples containing non-ASCII characters can be corrupted if one tool writes a different encoding than another expects. For a small quality utility, choose an encoding deliberately, state it in the code, and use fixtures created and reviewed in that encoding. Do not claim that successful file reading proves that the content has the intended business meaning.

### Reading JSON is a sequence of boundaries

Chapter 3 established that JSON parsing yields a runtime value, not a trusted `ApiExecutionResult[]`. A file adds a step before that boundary:

```text
file path
  → UTF-8 text
  → JSON.parse result as unknown
  → runtime validation
  → trusted internal model
```

The companion’s workflow gives each stage a deliberate owner:

```ts
const sourceText = await fileSystem.readUtf8(config.inputPath);
const parsedInput: unknown = JSON.parse(sourceText);
const validatedResults = parseQualityExecutionResults(parsedInput);
const normalisedResults = normaliseQualityExecutionResults(validatedResults);
const summary = summariseQualityExecutionResults(
  normalisedResults,
  config.slowResponseThresholdMs,
);
```

The code treats `JSON.parse` as `unknown` immediately because TypeScript’s declared type for the result does not establish the file’s domain model. `parseQualityExecutionResults` is the same style of all-or-nothing runtime validation introduced in Chapter 3: it either returns a collection whose required fields have been checked or stops at the first invalid record with an index and reason. It does not produce a partial report that might be mistaken for complete evidence.

JSON itself is a text-based data interchange format with specified syntax and values; it does not define the schema or business meaning needed by a particular quality utility.[^rfc8259] A syntactically valid document can still contain a string where the tool requires a finite response time, an unsupported environment, or a missing identifier. The validation boundary belongs to the application’s own requirements.

### CSV is tabular text, not automatically simple data

Comma-separated values (CSV) are often useful when a quality tool needs a flat table of executions, identifiers, or expected outcomes. Unlike JSON, CSV has no nested object structure, and a header row may provide the field names a utility expects. It is still an external text format, not a typed model. A comma inside a quoted field, an embedded newline, an absent column, a duplicate header, a different delimiter, or an unexpected encoding can make a simplistic `line.split(",")` implementation incorrect.

For a bounded internal fixture with simple, controlled values, a small parser may be proportionate. For data shared across tools or containing quoted, internationalised, or user-entered values, choose and validate a parser appropriate to the actual CSV dialect. In either case, retain the same boundary: read text with a declared encoding, parse the format, treat the result as untrusted, validate the fields needed for the quality question, and then use the trusted internal model. This chapter’s companion uses JSON because Chapter 3 has already established that validation path.

### Read and write operations are effects

The `node:fs/promises` API provides asynchronous file operations that return promises.[^node-fs] The companion uses those methods because it needs to read a fixture and write a report without blocking the surrounding JavaScript thread. The full topic of promises, `async`/`await`, concurrency, and error propagation belongs to Chapter 6. In this chapter, the relevant design point is ownership: the filesystem adapter owns direct Node.js calls, while the workflow receives that adapter explicitly.

```ts
export interface TextFileSystem {
  readUtf8(path: string): Promise<string>;
  writeUtf8(path: string, contents: string): Promise<void>;
}

export const nodeTextFileSystem: TextFileSystem = {
  async readUtf8(path: string): Promise<string> {
    return readFile(path, "utf8");
  },
  async writeUtf8(path: string, contents: string): Promise<void> {
    await writeFile(path, contents, "utf8");
  },
};
```

This small interface does not make files disappear. It identifies the boundary and keeps the rest of the report logic independent of direct `node:fs/promises` imports. In Chapter 11, a focused test can pass an in-memory implementation that returns controlled text or simulates a write failure. That test will not prove that a production filesystem always behaves correctly, but it can test the utility’s own response to the boundary.

### Write output deliberately and own cleanup

Writing a report changes the environment. Decide where output belongs, whether it is temporary or retained evidence, who can read it, and whether the program or a pipeline owns cleanup. A generated output directory such as `.build/` is often appropriate for local teaching output because it can be ignored by source control and recreated. It is not an automatic retention strategy for a real quality record.

Do not create or delete broad paths based on unchecked configuration. A typo in an output path can overwrite an unrelated file or leave sensitive data in an unexpected location. This chapter’s companion writes only a fictional report to a known local output path. It does not recursively delete files. When a utility creates temporary fixtures or reports, make ownership and cleanup policy clear before it is used in a shared environment.

## Dependencies Describe More than a Package List

A **dependency** is software that a project needs from outside its own source. Dependencies can provide a compiler, runtime type declarations, parser, test framework, formatter, or production capability. They save time and can provide mature functionality, but they also introduce version, security, licensing, update, and reproducibility considerations.

In an npm-managed TypeScript project, `package.json` records the package metadata, scripts, and declared dependencies. The companion’s small declaration is intentional:

```json
{
  "private": true,
  "type": "module",
  "scripts": {
    "check": "tsc --noEmit",
    "build": "tsc --noEmit false --outDir .build"
  },
  "devDependencies": {
    "@types/node": "^22.14.0",
    "typescript": "^5.9.3"
  }
}
```

`typescript` and `@types/node` are development dependencies because this teaching project needs them to compile and type-check source, not because its emitted JavaScript must load them at runtime. npm documentation distinguishes `dependencies`, which an application requires in production, from `devDependencies`, which are needed only for development and testing.[^npm-dependencies] The exact classification depends on how a project is built and deployed; do not move a package merely to satisfy a convention without understanding its runtime use.

### Manifests, version ranges, and lockfiles

The project manifest states the allowed dependency range. A **semantic version** convention represents a version as `major.minor.patch`; at a high level, a major version may include incompatible changes, a minor version adds backwards-compatible functionality, and a patch version supplies backwards-compatible fixes. npm supports ranges such as `^5.9.3` in `package.json`, which allow compatible updates according to its semver rules.[^npm-package-json][^npm-semver]

A range answers “which versions are permitted?” It does not by itself record the exact dependency tree that was installed on one machine. A **lockfile**, such as `package-lock.json`, records a concrete dependency tree so that teammates and continuous-integration environments can install the same resolved versions. npm documents the lockfile’s purpose as enabling subsequent installs to reproduce the generated tree, independent of intervening dependency updates.[^npm-lockfile]

This distinction explains a common quality problem:

| Statement | What it actually establishes |
|---|---|
| “It works on my machine.” | One machine has a set of code, configuration, data, operating conditions, and installed dependencies that produced an outcome. |
| “The dependency state is reproducible.” | The project declares and records dependency versions in a way that another supported environment can resolve consistently. |
| “The utility is correct.” | More evidence is still needed: validated inputs, appropriate rules, tests, review, and context-specific judgement. |

Commit an intended lockfile with the project when the repository’s package-management policy requires it. Review dependency changes as code changes: identify why the package is needed, inspect version updates, understand install scripts, and use the organisation’s vulnerability and licence processes. Do not confuse a lockfile with a security guarantee; it improves reproducibility, not the inherent safety of every included package.

### Install scripts deserve attention

Package managers can run lifecycle or install scripts. Those scripts execute code supplied by a dependency or project configuration, so their presence affects the trust boundary. npm documentation describes scripts and their lifecycle behaviour.[^npm-scripts] For a small learning project, use only the dependencies that are necessary, inspect what commands the project runs, and avoid adding packages merely to remove a few lines of clear code.

This is an engineering-first lesson, not a directive to avoid all third-party software. Well-maintained dependencies are often safer and more maintainable than custom implementations. The Quality Engineer’s role is to make the dependency choice visible: what capability it supplies, where it runs, how it is versioned, and what evidence supports its use.

## Test Data Is Part of the Quality System

Test data determines which behaviour a check can exercise and what its outcome means. It can make a utility deterministic and easy to diagnose, or create collisions, privacy exposure, false confidence, and expensive cleanup. Treat it as a designed input rather than a collection of convenient values.

A **fixture** is a static, version-controlled example dataset used to create a known input for a test, exercise, or local utility. A fixture is usually **deterministic**, meaning the same declared input should produce the same result under the same program version and stated configuration. Determinism helps an engineer reproduce a failure and review a code change. It does not mean that every production situation is represented.

### Choose a test-data strategy by the quality question

Different work needs different data. The following categories are useful distinctions, not a maturity ladder:

| Strategy | Description | Strengths | Risks and limits |
|---|---|---|---|
| Static fixture | A small, reviewed dataset stored with the code. | Deterministic, readable, easy to run locally and in review. | Can become unrealistic, stale, or too narrow if not maintained. |
| Generated data | Data created by a program from rules, seeds, or templates. | Can cover variation and avoid storing many records. | Must control randomness, constraints, and reproducibility; generated output can still contain unsafe values. |
| Environment-owned data | Data managed by a dedicated test or staging environment. | May exercise realistic integration states and ownership rules. | Can drift, collide, be unavailable, or depend on environmental access and cleanup. |
| Shared mutable data | Records reused and changed by several people or checks. | May be convenient for a short-lived investigation. | Creates order dependence, collisions, unclear ownership, and hard-to-reproduce outcomes. |

Use static fixtures for the companion because its purpose is to teach a visible file and validation boundary. The fictional execution results have stable identifiers and no credentials or personal information. They can show one failed execution and two slow executions against the selected threshold. They cannot establish that a real service has production-scale latency, customer coverage, or realistic traffic.

### Balance determinism, realism, and isolation

The “most realistic” data is not always safest or most useful. Copying production data can expose personal, financial, or confidential information and may reproduce edge cases without documenting which rules matter. Conversely, a tiny fixture can be too tidy to reveal an important boundary condition.

Choose data with a stated purpose:

- **Determinism:** Can another engineer recreate the same input and outcome?
- **Realism:** Does the data represent the business, technical, or failure conditions relevant to this quality question?
- **Isolation:** Can one run alter another run’s state or create an order-dependent result?
- **Maintenance:** Who updates the data when a model or requirement changes?
- **Privacy and safety:** Does the data contain only information approved for this context?
- **Traceability:** Can a reader explain why each significant record exists and which rule it exercises?
- **Cleanup:** If the data is created in an environment, who removes it after success and failure?

No single strategy wins every trade-off. A test-data generator may be appropriate for many valid account combinations, while a static fixture is better for one malformed JSON case that must remain inspectable. An environment-owned record may be necessary for an integration scenario, but it needs an explicit uniqueness and cleanup policy. State the trade-off rather than declaring that fixtures, random data, or production-like copies are always best.

### Give generated and temporary data an owner

An owner is the person, process, or team responsible for creating, updating, retaining, and removing data. Ownership prevents an increasingly common automation failure: a test creates an account, message, file, or record but neither deletes it nor identifies who will. Over time, the shared environment becomes polluted, later checks interfere, and a product problem is confused with accumulated test state.

For a small local fixture, the repository owns the source file and the learner owns any generated `.build/` output. For an environment-based utility, a team should decide how data is uniquely identified, how long it may remain, what happens after a failed run, and who investigates failed cleanup. Do not add uncontrolled cleanup logic merely to make the repository look tidy; deletion is an effect that deserves the same validation and ownership as creation.

## Keep Secrets Out of Code, Data, and Evidence

Secrets are not ordinary configuration. They require restrictions on storage, access, rotation, use, and diagnostic output. At minimum, never commit passwords, API tokens, credentials, private keys, or customer connection strings. A `.gitignore` entry reduces the chance of adding a local `.env` file, but it is not a security control: a secret that was committed or pasted into a log remains exposed in repository history or external systems.

Local `.env` files are a common convenience for development. Node.js documents a `.env` format and options for loading values, but the format itself is still a source of external text that needs parsing and validation.[^node-environment] Use a local file only in accordance with project policy, keep it excluded from source control, supply a safe `.env.example` with placeholder names rather than real values, and avoid printing the full environment in troubleshooting output.

In a team or deployment environment, use the organisation’s approved secret-management mechanism rather than inventing one in a test utility. The mechanism may be a protected delivery platform, a dedicated secret store, or another governed service. The important principles are least privilege, limited exposure, rotation, revocation, and avoiding plaintext logging. OWASP’s guidance similarly emphasises secret lifecycle and warns that secrets should never be logged in plaintext.[^owasp-secrets]

If a secret appears in a commit, issue, chat, screenshot, log, or fixture, treat it as potentially exposed. Follow the organisation’s incident process and rotate or revoke it; deleting the current line is not enough. This is not a substitute for a security programme, but it is an essential Quality Engineering habit because diagnostic and automation code often crosses data and environment boundaries.

## The Delivery 2 Companion: A Safe Boundary in Practice

The [`Delivery 2 Reusable Quality Utilities`](../../../code/part-02-programming/delivery-02-reusable-quality-utilities/README.md) project turns the chapter’s design into a small executable example. It contains no network calls, customer data, secrets, or runtime package dependencies; its direct development dependencies are TypeScript and Node.js type declarations.

Its outer runner uses real process state only at the edge:

```ts
const config = loadQualityToolConfig(process.env);
const summary = await createQualityEvidenceReport(config, nodeTextFileSystem);

console.log(JSON.stringify(summary, null, 2));
```

The runner does not pass `process.env` into the summary function, and `summary.ts` does not import the filesystem. The workflow reads UTF-8 text from the configured fixture, parses its JSON, validates the value as `unknown`, normalises presentation details, calculates evidence, constructs a report, and writes it to the configured output path.

The project’s illustrative runner supplies a controlled mapping of string values so that the command is safe to execute locally. A separate `start:environment` command demonstrates the real outer environment boundary. The README documents expected output as well as useful failure paths:

- a missing `QE_ENVIRONMENT` or `QE_INPUT_PATH` is a configuration error;
- a non-numeric `QE_SLOW_RESPONSE_THRESHOLD_MS` is rejected before calculation;
- a missing fixture path reports the attempted file boundary;
- malformed JSON reports the source path and parse failure; and
- a malformed record reports the record index and violated constraint before any report is written.

These messages are intentionally useful without including secret values or full file contents. They help a Quality Engineer distinguish where a run failed while preserving the limit of the evidence: a successfully generated report summarises only the fixture records and threshold supplied to that run.

## Engineering Perspective

Configuration, files, dependencies, and test data influence the credibility of quality evidence. The code must make its boundaries visible, but the engineering decision remains broader than the syntax.

| Engineering question | Useful practice | Evidence limit to state |
|---|---|---|
| Did the intended policy apply? | Validate configuration once, pass a typed object inward, and include decision-relevant values in output. | A configured threshold is not proof that the threshold is appropriate. |
| Did the utility process the intended source? | Make the input path and encoding explicit; distinguish read, parse, and validation failures. | A readable file may still be incomplete or unrepresentative. |
| Can another engineer reproduce a result? | Use reviewed fixtures, declared packages, a lockfile where appropriate, and documented commands. | Reproducibility does not establish real-world coverage or product correctness. |
| Is test data safe and isolated? | Use fictional or approved data, unique ownership, and explicit cleanup rules. | A clean fixture set may not reveal integration conditions in a shared environment. |
| Can a diagnostic leak a secret? | Keep secrets out of source and fixtures; redact or avoid sensitive output. | Ignoring a local `.env` file does not revoke a value already exposed elsewhere. |

For a QA Engineer moving toward Quality Engineering, these practices extend existing test discipline. A test case already needs a stated precondition, controlled data, known environment, and observable result. A reusable utility makes those preconditions part of its design so that they can be reviewed, repeated, and changed safely.

## Industry Perspective

Node.js documentation describes `process.env` as the API for environment variables and notes that values parsed from `.env` files are interpreted as text.[^node-environment] This supports the chapter’s central rule: environment values are external strings, so program-specific parsing and validation must establish their meaning. The same documentation provides an implementation option for loading `.env` files, but it does not turn those values into a substitute for a typed internal model.

The Node.js filesystem documentation describes the promise-based filesystem APIs used by the companion, while its path documentation explains the current-working-directory behaviour of path resolution.[^node-fs][^node-path] These are platform mechanisms. MSQE’s teaching guidance is the engineering interpretation: identify filesystem interactions as effects, validate their inputs, and report failures in a way that distinguishes the boundary from a quality-rule outcome.

npm documentation describes package manifests, production and development dependency categories, semantic version ranges, lockfiles, and scripts.[^npm-dependencies][^npm-package-json][^npm-lockfile][^npm-scripts] These documents support reproducible dependency state but do not relieve a team of reviewing the necessity, update behaviour, and operational implications of its dependencies.

## Common Misconceptions and Pitfalls

### “An environment variable already has the type I need.”

Environment variables are text or absent. `"false"` is a non-empty string, not the Boolean `false`; `"750"` is not a number until the program parses and validates it. Treat every value as an external boundary.

### “A default is always friendlier than an error.”

A default can hide a missing required policy or make a report look deliberately configured when it is not. Use a default only when it is safe, documented, visible where relevant, and easy to override. Fail fast when continuing would create misleading or unsafe work.

### “A relative path is relative to the source file.”

It is usually relative to the process’s current working directory. A command may work in one terminal location and fail in another. Define, document, or explicitly resolve the path strategy.

### “`JSON.parse` validates my fixture.”

It validates JSON syntax. It does not establish required fields, supported environment values, numeric constraints, or the semantic meaning of a record. Treat the parsed value as `unknown` and validate the model you need.

### “A lockfile makes dependencies safe.”

A lockfile makes a resolved dependency tree more reproducible. It does not prove that packages are secure, licensed appropriately, compatible with every runtime, or necessary. Review dependency changes and use organisational controls.

### “Realistic data means copying production data.”

Production data can create privacy, legal, and operational risk. Start with fictional or approved data that represents the relevant condition. Increase realism only when its value justifies the controls required.

### “A `.gitignore` entry protects a secret.”

It only helps prevent a future untracked file from being added by ordinary Git operations. It does not protect a secret already committed, logged, shared, or visible in a process environment. Rotate or revoke suspected exposed secrets through the appropriate process.

### “The configuration loader should solve every deployment concern.”

A focused loader should establish the values its utility requires. It should not become an unbounded platform abstraction for every environment, authentication method, and feature flag. Keep the boundary proportionate to the program’s real use.

## Summary

Quality Engineering utilities do not operate only on typed values in memory. They receive configuration, read files, use packages, create outputs, and depend on data that may be malformed, unsafe, or different across environments. Treating these as explicit boundaries makes a utility more reproducible, diagnosable, and safe to change.

Environment variables are strings or absent, so read them at an outer boundary, parse and validate them, create a trusted configuration object, and pass that object to reusable logic. Files require equally deliberate treatment: path strategy, encoding, read failure, JSON parsing, runtime validation, output ownership, and cleanup all affect what a run means.

Dependencies and test data also contribute to quality. A manifest and lockfile can make installed software more reproducible, but require review. Static fixtures, generated data, environment-owned data, and shared mutable data have different trade-offs in determinism, realism, isolation, privacy, maintenance, and cleanup. Secrets deserve their own handling and must never be committed or logged.

These boundaries prepare the learner for Chapter 6, where the timing and failure behaviour of asynchronous work becomes an explicit programming concern.

## Key Takeaways

- Configuration is external input. Environment variables are strings or absent until a program parses and validates them.
- Convert external values into a trusted configuration object once, then pass that object inward rather than reading `process.env` throughout the codebase.
- Use defaults only for safe, documented, visible policies; fail fast when an absence would make an outcome misleading or unsafe.
- Files introduce path, CWD, encoding, read, parsing, validation, output, and cleanup concerns.
- A JSON file follows the same boundary as a service response: read text, parse to `unknown`, validate, then use a trusted internal model.
- `dependencies` and `devDependencies` express different needs; version ranges permit versions, while lockfiles record a concrete dependency tree.
- Static fixtures, generated data, environment-owned data, and shared mutable data must be chosen by their trade-offs, not habit.
- Deterministic, isolated, traceable, fictional or approved data supports review and diagnosis but does not prove production coverage.
- Secrets are not ordinary configuration: never commit, print, or put them in fixtures; use approved handling and rotate suspected exposed values.

## Review Questions

1. Why is `Number(process.env.TIMEOUT_MS)` a conversion attempt rather than validation?
2. What is the difference between a required configuration value and a value that may reasonably have a default?
3. Why should a summary function receive a typed configuration value rather than read `process.env` itself?
4. How do relative paths and the current working directory create a reproducibility risk?
5. What does specifying `"utf8"` when reading a file communicate?
6. List the stages between a JSON fixture path and a trusted internal data model.
7. What is the difference between a package version range and a lockfile?
8. When might a static fixture be a better choice than generated or environment-owned data?
9. Why is shared mutable test data difficult to diagnose?
10. Why is a `.gitignore` rule insufficient protection for a secret that was already exposed?

## Interview Questions

1. How would you design configuration loading for a TypeScript quality utility that uses an environment, a threshold, and a fixture path?
2. What failures would you distinguish when loading JSON test results from a file, and why?
3. Explain the difference between `dependencies` and `devDependencies` in an npm project.
4. How do lockfiles improve reproducibility, and what do they not guarantee?
5. A colleague says a utility works locally but fails in CI because it cannot find a fixture. How would you investigate the path boundary?
6. How would you choose between a static fixture, generated data, and shared staging data for an integration check?
7. What should happen when a required secret is unavailable to a quality utility?
8. How would you prevent a configuration change from silently altering the meaning of a quality report?

## Practical Exercise

### Build a Validated Configuration and Fixture Loader

Create a small TypeScript utility for a fictional quality-reporting workflow. Its responsibility is to establish trusted configuration and fixture data before a summary function uses either. Use fictional, non-sensitive data only.

1. **Define trusted contracts.** Create a `QualityToolConfig` interface with `environment`, `slowResponseThresholdMs`, and `inputPath`. Define the smallest `QualityExecutionResult` model your summary needs.
2. **Load configuration at the boundary.** Accept an object with `string | undefined` values, such as `process.env`. Require an environment and input path. Parse the slow threshold, reject `NaN`, infinity, and negative values, and document any default you choose.
3. **Load a JSON fixture.** Read UTF-8 file text from the configured path. Give a useful error for a missing or unreadable file. Parse JSON, treat the result as `unknown`, and reuse or adapt the runtime-validation approach from Chapter 3.
4. **Return trusted data.** Return a typed configuration object and typed execution records only after validation. Do not return partial records or substitute malformed values with a passing status.
5. **Demonstrate boundary failures.** Run the utility with a valid fixture, a missing required configuration value, a non-numeric threshold, malformed JSON, and a record with an invalid field. Record the useful error each case produces.
6. **State test-data and secret decisions.** Add a short note identifying fixture ownership, why the data is deterministic, what cleanup is needed for generated output, and how the project prevents local secrets from being committed.

### Expected Deliverables

- A reusable configuration-loader module with explicit validation and a documented default or fail-fast decision.
- A fixture-loader module that reads UTF-8 text, parses JSON to `unknown`, validates required structure, and returns trusted typed records.
- A small fictional JSON fixture and a `.gitignore` rule appropriate for generated output and local environment files.
- A run record showing successful output and each required error path.
- A one-page boundary note covering paths, encoding, dependency state, test-data ownership, determinism, cleanup, and secrets awareness.

### Stretch Challenge

Add a `QE_OUTPUT_PATH` setting and write a JSON report without overwriting a source fixture. Document whether the output is temporary or retained evidence, how a caller can change its location, and who owns cleanup after a failed run.

## Practical Resources

- Run the [`Delivery 2 Reusable Quality Utilities`](../../../code/part-02-programming/delivery-02-reusable-quality-utilities/README.md) companion with its illustrative fixture, then inspect `configuration.ts`, `fileSystem.ts`, and `workflow.ts` together.
- **Build from:** [Chapter 4 — Functions, Modules, and Composable Design](chapter-04-functions-modules-and-composable-design.md), especially explicit dependencies, effect ownership, and composition.
- **Reinforce:** [Chapter 3 — Quality Data: Structures, JSON, and Transformations](chapter-03-quality-data-structures-json-and-transformations.md), especially `unknown` at an external-data boundary and all-or-nothing runtime validation.
- **Continue:** Chapter 6 will explain how promises and `async`/`await` affect the timing, ordering, and failure behaviour of boundary operations. **Supporting asset (Pass 2, planned):** Lab 1 — Designing a Configurable Quality-Data Utility.

## Further Reading

- Node.js. [Environment Variables](https://nodejs.org/api/environment_variables.html).
- Node.js. [File System](https://nodejs.org/api/fs.html) and [Path](https://nodejs.org/api/path.html).
- npm. [package.json](https://docs.npmjs.com/cli/configuring-npm/package-json/), [About semantic versioning](https://docs.npmjs.com/about-semantic-versioning/), and [package-lock.json](https://docs.npmjs.com/cli/v6/configuring-npm/package-lock-json/).
- Internet Engineering Task Force. [The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259).
- OWASP. [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html).

## References

[^node-environment]: Node.js. [Environment Variables](https://nodejs.org/api/environment_variables.html). Accessed 2026-08-08.

[^node-fs]: Node.js. [File System](https://nodejs.org/api/fs.html). Accessed 2026-08-08.

[^node-path]: Node.js. [Path](https://nodejs.org/api/path.html). Accessed 2026-08-08.

[^rfc8259]: Bray, Tim, ed. [*The JavaScript Object Notation (JSON) Data Interchange Format*](https://www.rfc-editor.org/rfc/rfc8259). RFC 8259, IETF, 2017. Accessed 2026-08-08.

[^npm-dependencies]: npm. [Specifying dependencies and devDependencies in a package.json file](https://docs.npmjs.com/specifying-dependencies-and-devdependencies-in-a-package-json-file/). Accessed 2026-08-08.

[^npm-package-json]: npm. [package.json](https://docs.npmjs.com/cli/configuring-npm/package-json/). Accessed 2026-08-08.

[^npm-semver]: npm. [About semantic versioning](https://docs.npmjs.com/about-semantic-versioning/). Accessed 2026-08-08.

[^npm-lockfile]: npm. [package-lock.json](https://docs.npmjs.com/cli/v6/configuring-npm/package-lock-json/). Accessed 2026-08-08.

[^npm-scripts]: npm. [Scripts](https://docs.npmjs.com/cli/using-npm/scripts/). Accessed 2026-08-08.

[^owasp-secrets]: OWASP. [Secrets Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html). Accessed 2026-08-08.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain why an environment value is untrusted text until the program parses and validates it.
- [ ] Create a typed configuration object with explicit required values, constraints, and documented defaults.
- [ ] Decide when failing fast is safer than silently selecting a default.
- [ ] Explain how CWD, relative paths, absolute paths, and UTF-8 interpretation affect a file-based utility.
- [ ] Read JSON file text, treat parsed data as `unknown`, validate it, and use only the trusted internal model.
- [ ] Distinguish `dependencies`, `devDependencies`, version ranges, and lockfiles in a reproducible project.
- [ ] Select test-data strategy by considering determinism, realism, isolation, maintenance, privacy, traceability, and cleanup.
- [ ] Keep secrets out of source control, fixtures, diagnostics, and report output, and explain what to do after suspected exposure.
