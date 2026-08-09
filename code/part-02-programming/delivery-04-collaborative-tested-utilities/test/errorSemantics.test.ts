import assert from "node:assert/strict";
import test from "node:test";

import { DeterministicClock } from "../src/deterministicClock.js";
import { QualityUtilityError, isRetryableDependencyFailure } from "../src/errors.js";
import { retryBounded } from "../src/retry.js";

test("preserves invalid-input as a non-retryable category", async () => {
  const clock = new DeterministicClock();

  await assert.rejects(
    retryBounded({
      operationName: "configuration read",
      operation: async () => {
        throw new QualityUtilityError("invalid-input", "Config fixture has no report path.", {
          operation: "configuration read",
        });
      },
      shouldRetry: isRetryableDependencyFailure,
      maxAttempts: 3,
      delayMs: 10,
      clock,
    }),
    (error: unknown) => {
      assert.ok(error instanceof QualityUtilityError);
      assert.equal(error.kind, "invalid-input");
      assert.equal(error.context.attempt, 1);
      assert.equal(error.context.retryExhausted, false);
      return true;
    },
  );

  assert.deepEqual(clock.sleepRequests, []);
});

test("reports bounded retry exhaustion without exposing a raw dependency message", async () => {
  const clock = new DeterministicClock();
  const rawDependencyMarker = "internal-token=not-for-public-output";

  await assert.rejects(
    retryBounded({
      operationName: "fixture dependency",
      operation: async () => {
        throw new QualityUtilityError("dependency-failure", rawDependencyMarker, {
          operation: "fixture dependency",
        });
      },
      shouldRetry: isRetryableDependencyFailure,
      maxAttempts: 3,
      delayMs: 25,
      clock,
    }),
    (error: unknown) => {
      assert.ok(error instanceof QualityUtilityError);
      assert.equal(error.kind, "dependency-failure");
      assert.deepEqual(error.context, {
        operation: "fixture dependency",
        attempt: 3,
        retryExhausted: true,
      });
      assert.match(error.message, /exhausted its bounded attempts at attempt 3/);
      assert.doesNotMatch(error.message, /internal-token/);
      return true;
    },
  );

  assert.deepEqual(clock.sleepRequests, [25, 25]);
});
