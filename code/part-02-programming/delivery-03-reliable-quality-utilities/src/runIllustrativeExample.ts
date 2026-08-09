import { DeterministicClock } from "./deterministicClock.js";
import { describeObservation, matchesDocumentedCompletionState } from "./debuggingScenario.js";
import { isRetryableDependencyFailure } from "./errors.js";
import type { QualityCheckObservation } from "./models.js";
import { pollUntil } from "./polling.js";
import { retryBounded } from "./retry.js";
import { scriptedObservations, transientFailureThen } from "./scriptedOperations.js";
import { summariseChecks } from "./summary.js";

const clock = new DeterministicClock();
const completeObservation: QualityCheckObservation = {
  endpoint: "POST /orders",
  state: "complete",
  responseTimeMs: 420,
};

const pollingResult = await pollUntil({
  operationName: "order-quality-check",
  operation: scriptedObservations([
    { endpoint: "POST /orders", state: "pending", responseTimeMs: 120 },
    completeObservation,
  ]),
  isComplete: matchesDocumentedCompletionState,
  describe: describeObservation,
  timeoutMs: 1_000,
  intervalMs: 100,
  clock,
});

const retryResult = await retryBounded({
  operationName: "local-result-store-read",
  operation: transientFailureThen(1, "quality evidence received"),
  shouldRetry: isRetryableDependencyFailure,
  maxAttempts: 2,
  delayMs: 50,
  clock,
});

const summary = summariseChecks(
  [
    pollingResult.value,
    { endpoint: "GET /catalogue", state: "failed", responseTimeMs: 840 },
  ],
  750,
);

console.log(
  JSON.stringify(
    {
      polling: { attempts: pollingResult.attempts, elapsedMs: pollingResult.elapsedMs },
      retry: { attempts: retryResult.attempts, value: retryResult.value },
      summary,
    },
    null,
    2,
  ),
);
