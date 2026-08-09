# Delivery 1 Quality Evidence Utilities

This small TypeScript project accompanies Part II, Delivery 1 of the MSQE handbook. It is intentionally bounded: it demonstrates code reading, typed quality results, runtime validation of untrusted data, and transformations that answer a quality question.

It is not an API-testing framework, a production service, or a schema-validation product.

## Contents

- `src/inheritedAccountRecoveryCheck.ts` is intentionally over-responsible code for Chapter 1's code-reading exercise. It compiles, but its design should be challenged before it is extended.
- `src/qualityEvidence.ts` contains the typed data model, all-or-nothing runtime validation, and transformations used in Chapters 2 and 3.
- `src/runQualityEvidenceExample.ts` runs the Chapter 3 example against local fixture data.

## Validation

Use Node.js 20 or later. Install the declared development dependency and run:

```bash
npm install
npm run check
npm run start
```

The example uses only in-memory fixture data. Do not add customer data, credentials, or live service calls to this introductory project.

## Evidence Semantics

The runner's `receivedRecordCount` is the number of validated input records before deduplication. `uniqueExecutionCount` and every outcome metric—failed and slow execution counts, endpoint failure counts, slow endpoints, and environment counts—are calculated from the deduplicated logical-execution population.

`parseApiExecutionResults` validates the complete input collection before a summary is produced. It fails fast on the first malformed record and does not return a partial summary or a rejected-record count.

## Learning Boundaries

The manual validation in `qualityEvidence.ts` is deliberately small and explicit so readers can see the runtime boundary. Later parts will cover API contracts, data-quality systems, test frameworks, and production observability in depth.
