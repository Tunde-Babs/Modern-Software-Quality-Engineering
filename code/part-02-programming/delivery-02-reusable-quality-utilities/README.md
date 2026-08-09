# Delivery 2 Reusable Quality Utilities

This TypeScript project accompanies Part II, Delivery 2 of the MSQE handbook. It extends the Delivery 1 quality-evidence ideas without becoming an API-testing framework, a configuration framework, or a production reporting service.

It demonstrates how a small Quality Engineering utility can make its boundaries visible:

```text
external configuration
  → trusted QualityToolConfig
  → file read
  → JSON.parse as unknown
  → runtime validation of the source shape
  → canonical normalisation
  → pure summary
  → report formatting
  → file write
```

## Contents

- `src/models.ts` defines the trusted internal data and configuration contracts.
- `src/validation.ts` validates unknown runtime values before other modules use them.
- `src/normalisation.ts`, `src/summary.ts`, and `src/reporting.ts` contain focused, deterministic transformations.
- `src/configuration.ts` converts an explicitly supplied string environment into `QualityToolConfig`; it does not read `process.env` itself.
- `src/fileSystem.ts` is the Node.js filesystem adapter.
- `src/workflow.ts` composes the stages and receives its filesystem dependency explicitly.
- `src/runIllustrativeExample.ts` supplies safe local example values and runs against `fixtures/quality-executions.json`.
- `src/runFromProcessEnvironment.ts` is the outer process boundary for an actual environment-based run.

The fixture is fictional and contains no credentials, customer data, tokens, or private keys. The `.gitignore` excludes `.env` files and generated output; a real secret must never be committed to this repository or printed in an error message.

## Install and Validate

Use Node.js 20 or later with npm.

```bash
npm ci
npm run check
npm run build
npm run start
npm run validate
```

`npm run start` writes `.build/quality-summary.json` and prints this summary:

```json
{
  "executionCount": 3,
  "failedExecutionCount": 1,
  "slowExecutionCount": 2,
  "failureCountByEndpoint": {
    "POST /orders": 1
  },
  "slowEndpoints": [
    "GET /catalogue",
    "POST /orders"
  ]
}
```

## Run with Actual Environment Values

The outer runner is intentionally separate from the reusable configuration loader. Supply configuration before invoking it; the following syntax is suitable for a POSIX-compatible shell:

```bash
QE_ENVIRONMENT=staging \
QE_SLOW_RESPONSE_THRESHOLD_MS=750 \
QE_INPUT_PATH=fixtures/quality-executions.json \
QE_OUTPUT_PATH=.build/quality-summary-from-environment.json \
npm run start:environment
```

`QE_ENVIRONMENT` and `QE_INPUT_PATH` are required. `QE_SLOW_RESPONSE_THRESHOLD_MS` defaults to `750` only because this teaching utility has an explicitly documented local example threshold; a delivery decision should not silently inherit an unexplained default. `QE_OUTPUT_PATH` defaults to `.build/quality-summary.json` when it is absent or contains only whitespace.

The command above uses POSIX shell syntax. In PowerShell, set the values first, then run the command:

```powershell
$env:QE_ENVIRONMENT = "staging"
$env:QE_SLOW_RESPONSE_THRESHOLD_MS = "750"
$env:QE_INPUT_PATH = "fixtures/quality-executions.json"
$env:QE_OUTPUT_PATH = ".build/quality-summary-from-environment.json"
npm run start:environment
```

Environment values are external text, not trusted typed configuration. For example, `QE_SLOW_RESPONSE_THRESHOLD_MS=slow` produces a useful configuration error rather than allowing `NaN` into the summary rule. Records must contain an integer HTTP `statusCode` between 100 and 599. A missing fixture, malformed JSON, or malformed record also stops the workflow before a report is written. `npm run validate` checks the whitespace-normalisation boundary, the output-path default, and representative status-code failures.

## Learning Boundaries

The project uses `async` filesystem methods only because file reads and writes are the subject of Chapter 5. It does not teach concurrency, retries, timeouts, advanced error classification, test-framework design, CI/CD, live API calls, or secret-management products. Those concerns are addressed in later parts of the handbook.
