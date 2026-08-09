import assert from "node:assert/strict";
import { DeterministicClock } from "./deterministicClock.js";
import {
  describeObservation,
  matchesDocumentedCompletionState,
  matchesScenarioCompletionState,
} from "./debuggingScenario.js";
import { isRetryableDependencyFailure, QualityUtilityError } from "./errors.js";
import type { QualityCheckObservation } from "./models.js";
import { pollUntil } from "./polling.js";
import { retryBounded } from "./retry.js";
import { scriptedObservations, transientFailureThen } from "./scriptedOperations.js";
import { legacySummariseChecks, summariseChecks } from "./summary.js";

const completeObservation: QualityCheckObservation = {
  endpoint: "POST /orders",
  state: "complete",
  responseTimeMs: 420,
};

const pollingClock = new DeterministicClock();
const pollingSuccess = await pollUntil({
  operationName: "polling-success",
  operation: scriptedObservations([{ ...completeObservation, state: "pending" }, completeObservation]),
  isComplete: matchesDocumentedCompletionState,
  describe: describeObservation,
  timeoutMs: 500,
  intervalMs: 100,
  clock: pollingClock,
});
assert.equal(pollingSuccess.attempts, 2);
assert.equal(pollingSuccess.elapsedMs, 100);

const timeoutClock = new DeterministicClock();
await assert.rejects(
  () =>
    pollUntil({
      operationName: "timeout-scenario",
      operation: scriptedObservations([{ ...completeObservation, state: "pending" }]),
      isComplete: matchesDocumentedCompletionState,
      describe: describeObservation,
      timeoutMs: 200,
      intervalMs: 100,
      clock: timeoutClock,
    }),
  (error: unknown) =>
    error instanceof QualityUtilityError &&
    error.kind === "timeout" &&
    error.context.observedState === "POST /orders is pending after 420 ms",
  );

await assert.rejects(
  () =>
    pollUntil({
      operationName: "invalid-polling-options",
      operation: async () => completeObservation,
      isComplete: matchesDocumentedCompletionState,
      describe: describeObservation,
      timeoutMs: -1,
      intervalMs: 100,
      clock: new DeterministicClock(),
    }),
  (error: unknown) => error instanceof QualityUtilityError && error.kind === "invalid-input",
);

const retryClock = new DeterministicClock();
const retried = await retryBounded({
  operationName: "retry-scenario",
  operation: transientFailureThen(1, "received"),
  shouldRetry: isRetryableDependencyFailure,
  maxAttempts: 2,
  delayMs: 25,
  clock: retryClock,
});
assert.deepEqual(retried, { value: "received", attempts: 2 });

await assert.rejects(
  () =>
    retryBounded({
      operationName: "invalid-retry-options",
      operation: async () => "not-called",
      shouldRetry: () => false,
      maxAttempts: 1.5,
      delayMs: 0,
      clock: new DeterministicClock(),
    }),
  (error: unknown) => error instanceof QualityUtilityError && error.kind === "invalid-input",
);

const nonRetryableCause = new QualityUtilityError(
  "invalid-input",
  "Untrusted source text must not appear in terminal diagnostics.",
  { operation: "fixture-loader" },
);
await assert.rejects(
  () =>
    retryBounded({
      operationName: "non-retryable-input",
      operation: async () => {
        throw nonRetryableCause;
      },
      shouldRetry: () => false,
      maxAttempts: 2,
      delayMs: 0,
      clock: new DeterministicClock(),
    }),
  (error: unknown) => {
    assert.ok(error instanceof QualityUtilityError);
    assert.equal(error.kind, "invalid-input");
    assert.equal(error.context.attempt, 1);
    assert.equal(error.context.retryExhausted, false);
    assert.equal(error.cause, nonRetryableCause);
    assert.doesNotMatch(error.message, /Untrusted source text/);
    return true;
  },
);

const exhaustedCause = new QualityUtilityError(
  "dependency-failure",
  "Untrusted dependency detail must not appear in terminal diagnostics.",
  { operation: "local-dependency" },
);
let exhaustedAttempts = 0;
await assert.rejects(
  () =>
    retryBounded({
      operationName: "exhausted-retry",
      operation: async () => {
        exhaustedAttempts += 1;
        throw exhaustedCause;
      },
      shouldRetry: isRetryableDependencyFailure,
      maxAttempts: 2,
      delayMs: 10,
      clock: new DeterministicClock(),
    }),
  (error: unknown) => {
    assert.ok(error instanceof QualityUtilityError);
    assert.equal(error.kind, "dependency-failure");
    assert.equal(error.context.attempt, 2);
    assert.equal(error.context.retryExhausted, true);
    assert.equal(error.cause, exhaustedCause);
    assert.doesNotMatch(error.message, /Untrusted dependency detail/);
    return true;
  },
);
assert.equal(exhaustedAttempts, 2);

await assert.rejects(
  () =>
    retryBounded({
      operationName: "non-error-failure",
      operation: async () => {
        throw "Untrusted non-Error detail must not appear in terminal diagnostics.";
      },
      shouldRetry: () => false,
      maxAttempts: 1,
      delayMs: 0,
      clock: new DeterministicClock(),
    }),
  (error: unknown) => {
    assert.ok(error instanceof QualityUtilityError);
    assert.equal(error.kind, "unexpected-result");
    assert.equal(error.context.retryExhausted, false);
    assert.doesNotMatch(error.message, /Untrusted non-Error detail/);
    return true;
  },
);

const debuggingClock = new DeterministicClock();
await assert.rejects(
  () =>
    pollUntil({
      operationName: "debugging-scenario",
      operation: scriptedObservations([completeObservation]),
      isComplete: matchesScenarioCompletionState,
      describe: describeObservation,
      timeoutMs: 100,
      intervalMs: 100,
      clock: debuggingClock,
    }),
  (error: unknown) =>
    error instanceof QualityUtilityError &&
    error.kind === "timeout" &&
    error.context.observedState === "POST /orders is complete after 420 ms",
);

interface SummaryCharacterization {
  name: string;
  observations: QualityCheckObservation[];
  slowThresholdMs: number;
  expected: {
    executionCount: number;
    completedCount: number;
    failedCount: number;
    slowEndpointCount: number;
  };
}

const summaryCharacterizations: SummaryCharacterization[] = [
  {
    name: "no records",
    observations: [],
    slowThresholdMs: 750,
    expected: { executionCount: 0, completedCount: 0, failedCount: 0, slowEndpointCount: 0 },
  },
  {
    name: "one completed record at the threshold boundary",
    observations: [{ endpoint: "GET /health", state: "complete", responseTimeMs: 750 }],
    slowThresholdMs: 750,
    expected: { executionCount: 1, completedCount: 1, failedCount: 0, slowEndpointCount: 0 },
  },
  {
    name: "one failed and slow record",
    observations: [{ endpoint: "POST /orders", state: "failed", responseTimeMs: 751 }],
    slowThresholdMs: 750,
    expected: { executionCount: 1, completedCount: 0, failedCount: 1, slowEndpointCount: 1 },
  },
  {
    name: "multiple states with repeated slow endpoint",
    observations: [
      completeObservation,
      { endpoint: "GET /catalogue", state: "failed", responseTimeMs: 810 },
      { endpoint: "GET /catalogue", state: "pending", responseTimeMs: 100 },
      { endpoint: "GET /catalogue", state: "complete", responseTimeMs: 900 },
    ],
    slowThresholdMs: 750,
    expected: { executionCount: 4, completedCount: 2, failedCount: 1, slowEndpointCount: 1 },
  },
];

for (const characterization of summaryCharacterizations) {
  const legacySummary = legacySummariseChecks(
    characterization.observations,
    characterization.slowThresholdMs,
  );
  const refactoredSummary = summariseChecks(
    characterization.observations,
    characterization.slowThresholdMs,
  );

  assert.deepEqual(legacySummary, characterization.expected, characterization.name);
  assert.deepEqual(refactoredSummary, characterization.expected, characterization.name);
  assert.deepEqual(refactoredSummary, legacySummary, characterization.name);
}

for (const invalidThreshold of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
  assert.throws(
    () => legacySummariseChecks([], invalidThreshold),
    /slowThresholdMs must be a non-negative finite number/,
  );
  assert.throws(
    () => summariseChecks([], invalidThreshold),
    /slowThresholdMs must be a non-negative finite number/,
  );
}

console.log("All deterministic Delivery 3 validation scenarios passed.");
