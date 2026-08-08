# Delivery 3 Reliable Quality Utilities

This small TypeScript project accompanies Part II, Delivery 3 of the MSQE handbook. It demonstrates bounded asynchronous work, intentional failure semantics, diagnosis through safe context, and a behaviour-preserving refactor.

It is intentionally not a production resilience library, an API-testing framework, an observability platform, or a real-service integration. Every operation is local and deterministic.

## Contents

- `src/polling.ts` implements caller-defined polling with an explicit success condition, timeout, interval, and final diagnostic state.
- `src/retry.ts` retries only caller-classified retryable failures; terminal failures retain their category, record bounded retry metadata, and preserve a cause without rendering its message.
- `src/errors.ts` defines a small, contextual failure type and preserves a cause without printing sensitive data.
- `src/debuggingScenario.ts` contains a deliberately defective completion predicate and its bounded correction for Chapter 8.
- `src/summary.ts` contains a legacy reference implementation and a behaviour-preserving refactor over their shared valid threshold contract.
- `src/runIllustrativeExample.ts` runs the normal local scenario.
- `src/runValidationScenarios.ts` verifies all required deterministic scenarios.

## Install and Run

```bash
npm install
npm run check
npm run build
npm run start
npm run validate
```

The normal run produces a polling success after two observations, a retry that succeeds on its second bounded attempt, and a small quality summary. The validation run verifies:

- polling success with virtual time;
- timeout evidence with the last observed state;
- a bounded, classified retry;
- terminal retry category preservation and safe diagnostic behaviour;
- the reproducible debugging failure caused by the defective predicate; and
- equality between legacy and refactored summaries across a bounded characterization set, including shared invalid-threshold handling.

## Determinism and Safety

`DeterministicClock` advances virtual time rather than sleeping in real time. This makes the examples quick and repeatable without hiding the timeout or retry policy. The diagnostics contain fictional endpoint names, states, counts, and durations only. Do not extend them to print credentials, tokens, authorization headers, or sensitive payloads.

## Learning Boundaries

The project explains the engineering choices around a small utility. It does not decide retry policy for a real service, guarantee idempotency, implement exponential backoff, manage production incidents, or replace later chapters on testing, observability, reliability, or API engineering.
