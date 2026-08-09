import { DeterministicClock } from "./deterministicClock.js";
import { QualityUtilityError, isRetryableDependencyFailure } from "./errors.js";
import { pollUntil } from "./polling.js";
import { summariseQualityObservations } from "./qualitySummary.js";
import { retryBounded } from "./retry.js";

const summary = summariseQualityObservations(
  [
    { endpoint: "/catalogue", state: "passed", durationMs: 125 },
    { endpoint: "/checkout", state: "failed", durationMs: 650 },
    { endpoint: "/checkout", state: "pending", durationMs: 710 },
  ],
  500,
);

const pollClock = new DeterministicClock();
const states = ["pending", "complete"];
let stateIndex = 0;
const polling = await pollUntil({
  operationName: "report export",
  operation: async () => states[stateIndex++] ?? "complete",
  isComplete: (state) => state === "complete",
  describe: (state) => state,
  timeoutMs: 200,
  intervalMs: 100,
  clock: pollClock,
});

const retryClock = new DeterministicClock();
let attempts = 0;
const retried = await retryBounded({
  operationName: "quality summary read",
  operation: async () => {
    attempts += 1;
    if (attempts === 1) {
      throw new QualityUtilityError("dependency-failure", "Fixture is temporarily unavailable.", {
        operation: "quality summary read",
      });
    }

    return "summary-ready";
  },
  shouldRetry: isRetryableDependencyFailure,
  maxAttempts: 2,
  delayMs: 50,
  clock: retryClock,
});

console.log(JSON.stringify({ summary, polling, retried, virtualDelayMs: retryClock.now() }, null, 2));
