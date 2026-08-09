import assert from "node:assert/strict";
import test from "node:test";

import { DeterministicClock } from "../src/deterministicClock.js";
import { QualityUtilityError, isRetryableDependencyFailure } from "../src/errors.js";
import { pollUntil } from "../src/polling.js";
import { retryBounded } from "../src/retry.js";

test("polls to a successful state without real waiting", async () => {
  const clock = new DeterministicClock();
  const states = ["pending", "pending", "complete"];
  let index = 0;

  const result = await pollUntil({
    operationName: "fixture report export",
    operation: async () => states[index++] ?? "complete",
    isComplete: (state) => state === "complete",
    describe: (state) => state,
    timeoutMs: 500,
    intervalMs: 100,
    clock,
  });

  assert.deepEqual(result, { value: "complete", attempts: 3, elapsedMs: 200 });
  assert.deepEqual(clock.sleepRequests, [100, 100]);
});

test("reports timeout context at a bounded virtual deadline", async () => {
  const clock = new DeterministicClock();

  await assert.rejects(
    pollUntil({
      operationName: "fixture report export",
      operation: async () => "pending",
      isComplete: (state) => state === "complete",
      describe: (state) => state,
      timeoutMs: 200,
      intervalMs: 100,
      clock,
    }),
    (error: unknown) => {
      assert.ok(error instanceof QualityUtilityError);
      assert.equal(error.kind, "timeout");
      assert.deepEqual(error.context, {
        operation: "fixture report export",
        attempt: 3,
        elapsedMs: 200,
        observedState: "pending",
      });
      assert.match(error.message, /Last observation: pending/);
      return true;
    },
  );

  assert.deepEqual(clock.sleepRequests, [100, 100]);
});

test("rejects invalid polling options before calling the operation", async () => {
  let called = false;

  await assert.rejects(
    pollUntil({
      operationName: "invalid polling options",
      operation: async () => {
        called = true;
        return "complete";
      },
      isComplete: (state) => state === "complete",
      describe: (state) => state,
      timeoutMs: -1,
      intervalMs: 100,
      clock: new DeterministicClock(),
    }),
    (error: unknown) => error instanceof QualityUtilityError && error.kind === "invalid-input",
  );

  assert.equal(called, false);
});

test("retries a classified transient failure and records the attempted delay", async () => {
  const clock = new DeterministicClock();
  let attempts = 0;

  const result = await retryBounded({
    operationName: "fixture summary read",
    operation: async () => {
      attempts += 1;
      if (attempts === 1) {
        throw new QualityUtilityError("dependency-failure", "Fixture temporarily unavailable.", {
          operation: "fixture summary read",
        });
      }

      return "ready";
    },
    shouldRetry: isRetryableDependencyFailure,
    maxAttempts: 2,
    delayMs: 50,
    clock,
  });

  assert.deepEqual(result, { value: "ready", attempts: 2 });
  assert.deepEqual(clock.sleepRequests, [50]);
});

test("rejects invalid retry options before calling the operation", async () => {
  let called = false;

  await assert.rejects(
    retryBounded({
      operationName: "invalid retry options",
      operation: async () => {
        called = true;
        return "ready";
      },
      shouldRetry: () => false,
      maxAttempts: 1.5,
      delayMs: 0,
      clock: new DeterministicClock(),
    }),
    (error: unknown) => error instanceof QualityUtilityError && error.kind === "invalid-input",
  );

  assert.equal(called, false);
});
