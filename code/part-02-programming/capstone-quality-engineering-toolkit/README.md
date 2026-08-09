# Quality Engineering Toolkit

**Reference Implementation** for Chapter 12 of *Modern Software Quality Engineering* Part II. It is a small, self-contained capstone that turns fictional execution evidence into a reviewable quality report.

Attempt the capstone from the chapter before consulting this implementation. Then compare designs, identify the trade-offs, and be prepared to explain why you would retain or change each boundary.

## What It Demonstrates

- strict TypeScript and `unknown` at JSON boundaries;
- configuration and execution-record validation before data becomes trusted;
- normalisation and conservative de-duplication of logical execution evidence;
- decision-oriented summary metrics;
- deterministic polling and bounded retry with explicit total-attempt semantics;
- controlled failure categories and safe diagnostics; and
- file output and lightweight automated tests.

The records and dependencies are fictional simulations. The project has no application-runtime network dependency, contains no credential, and uses no real quality-system data.

## Prerequisites

Use Node.js 20 or later. The package declares `"engines": { "node": ">=20.0.0" }` because the reference implementation uses Node's stable built-in test runner. This baseline applies to this capstone; it does not retroactively change the support policy of earlier learning projects.

## Run It

```bash
npm ci
npm run check
npm run build
npm test
npm start
```

`npm start` reads `fixtures/toolkit-config.json` and writes `.build/quality-report.json`. It also prints the same structured report to standard output. Compare the output with [fixtures/expected-quality-report.json](fixtures/expected-quality-report.json).

To provide another configuration file, first build and then pass its path to the compiled runner:

```bash
npm run build
node .build/src/runToolkit.js path/to/toolkit-config.json
```

## Design Boundaries

`src/models.ts` defines the trusted domain data and the small side-effect interfaces. `src/validation.ts` is the only route from parsed `unknown` JSON to trusted configuration and execution records. Execution timestamps use the explicit ISO 8601 UTC form `YYYY-MM-DDTHH:mm:ss.sssZ`; the fixtures and tests use that same contract. `src/normalisation.ts` rejects conflicting evidence rather than guessing which duplicate is correct. `src/asyncUtilities.ts` accepts a clock, so polling and retry advance virtual time in tests instead of sleeping.

The retry utility defines `maxAttempts` as the **total** number of calls, including the initial call. It retries only a classified `dependency-failure`. The capstone retries an idempotent simulated read: repeating it neither creates nor changes evidence. Do not apply the same policy to a write until its idempotency has been established.

The public runner converts unknown caught failures to controlled diagnostics. It does not serialize raw caught messages, stack traces, credentials, or dependency payloads.

## Project Map

```text
src/
  models.ts              trusted models and explicit boundaries
  validation.ts          parse/unknown/validate/trusted transition
  configuration.ts       validated configuration loading
  loadExecutions.ts      validated fixture loading
  normalisation.ts       normalisation and conservative de-duplication
  analysis.ts            quality-question-oriented summary
  asyncUtilities.ts      deterministic polling, retry, and simulations
  errors.ts              controlled categories and safe diagnostics
  reporting.ts           deterministic report formatting
  workflow.ts            composition root for the toolkit workflow
  runToolkit.ts          executable local runner
test/                    focused unit and workflow tests
fixtures/                fictional input, configuration, expected report
docs/                    learner planning and collaboration artifacts
```

## Learner Deliverables

Use the templates in [docs](docs) as references, not as evidence of actual Git history. A professional submission should include your own implementation plan, proposed commit sequence, PR/MR description, validation output, limitations, residual risks, and review focus.

This is a **Portfolio Candidate**. Remove all employer-confidential information and use synthetic data before publishing a portfolio version.

## Known Limits

The capstone intentionally does not implement real service calls, authentication, parallel processing, persistent storage, observability infrastructure, or deployment automation. It is an integration exercise in programming judgement, not a framework or production service.

See [docs/limitations-and-residual-risk.md](docs/limitations-and-residual-risk.md) for the complete, deliberately bounded assessment.
