# Illustrative Implementation Plan

This is a reference planning artifact for the Chapter 12 capstone. It is not a record of actual work or an instruction to reproduce a specific commit history.

## Objective

Produce a locally runnable TypeScript utility that converts fictional, validated execution evidence into a safe, deterministic quality report.

## Boundaries and Decisions

| Decision | Reason | Evidence to seek |
| --- | --- | --- |
| Parse JSON as `unknown` | Static types do not validate a file at runtime. | Invalid JSON and malformed records fail with `invalid-input`. |
| Reject conflicting duplicate IDs | Selecting one record could corrupt evidence. | Exact replays are removed; conflicts are rejected. |
| Inject a clock | Polling and retry tests should not use real delays. | Tests assert attempts and virtual elapsed time. |
| Retry only classified dependency failures | Retrying bad input or a timeout without a recovery model wastes time and obscures cause. | Non-retryable failure stops at attempt one. |
| Keep diagnostics controlled | A caught dependency message might contain sensitive or irrelevant data. | Unknown cause text never appears in public diagnostics. |

## Delivery Sequence

1. Define trusted models, a small error taxonomy, and the configuration shape.
2. Implement file reading, JSON parsing, and runtime validation.
3. Normalise records, reject conflicting duplicates, and compute summaries that answer quality questions.
4. Add simulated readiness, polling, a transient read, and bounded retry.
5. Compose the workflow, report format, executable runner, and fixture output.
6. Add focused unit tests and an end-to-end workflow test.
7. Review names, responsibility boundaries, diagnostics, documentation, and residual risks.

## Acceptance Evidence

- `npm run check`, `npm run build`, `npm test`, and `npm start` complete successfully.
- The generated report equals the expected fixture in structure.
- Failure tests demonstrate invalid input, dependency failure, timeout, retry exhaustion, and non-retryable handling.
- No test calls a network service or depends on elapsed wall-clock time.
