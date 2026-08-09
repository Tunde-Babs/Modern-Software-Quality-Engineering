import assert from "node:assert/strict";
import test from "node:test";

import {
  DeterministicClock,
  pollUntil,
  retryBounded,
} from "../src/asyncUtilities.js";
import { ToolkitError, isRetryableDependencyFailure } from "../src/errors.js";

test("polls deterministically until a readiness condition is observed", async () => {
  const clock = new DeterministicClock();
  const states = ["pending", "pending", "ready"] as const;
  let index = 0;

  const result = await pollUntil({
    operationName: "wait-for-ready",
    operation: async () => states[index++] ?? "ready",
    isComplete: (state) => state === "ready",
    describe: (state) => state,
    timeoutMs: 200,
    intervalMs: 50,
    clock,
  });

  assert.deepEqual(result, { value: "ready", attempts: 3, elapsedMs: 100 });
  assert.deepEqual(clock.sleepRequests, [50, 50]);
});

test("reports a bounded polling timeout with safe state context", async () => {
  const clock = new DeterministicClock();

  await assert.rejects(
    pollUntil({
      operationName: "wait-for-ready",
      operation: async () => "pending",
      isComplete: (state) => state === "ready",
      describe: (state) => state,
      timeoutMs: 100,
      intervalMs: 50,
      clock,
    }),
    (error: unknown) => {
      assert.ok(error instanceof ToolkitError);
      assert.equal(error.kind, "timeout");
      assert.deepEqual(error.context, {
        operation: "wait-for-ready",
        attempt: 3,
        elapsedMs: 100,
        expected: "completion condition",
        observed: "pending",
      });
      return true;
    },
  );
  assert.deepEqual(clock.sleepRequests, [50, 50]);
});

test("retries a classified dependency failure and succeeds within its total attempt limit", async () => {
  const clock = new DeterministicClock();
  let calls = 0;

  const result = await retryBounded({
    operationName: "read-evidence",
    operation: async () => {
      calls += 1;
      if (calls === 1) {
        throw new ToolkitError("dependency-failure", "temporary service failure", {
          operation: "read-evidence",
        });
      }

      return "snapshot-001";
    },
    shouldRetry: isRetryableDependencyFailure,
    maxAttempts: 2,
    delayMs: 25,
    clock,
  });

  assert.deepEqual(result, { value: "snapshot-001", attempts: 2 });
  assert.deepEqual(clock.sleepRequests, [25]);
});

test("stops after the configured total retry attempts without exposing a raw cause", async () => {
  const clock = new DeterministicClock();

  await assert.rejects(
    retryBounded({
      operationName: "read-evidence",
      operation: async () => {
        throw new ToolkitError("dependency-failure", "private upstream marker", {
          operation: "read-evidence",
        });
      },
      shouldRetry: isRetryableDependencyFailure,
      maxAttempts: 3,
      delayMs: 25,
      clock,
    }),
    (error: unknown) => {
      assert.ok(error instanceof ToolkitError);
      assert.equal(error.kind, "dependency-failure");
      assert.equal(error.context.attempt, 3);
      assert.equal(error.context.retryExhausted, true);
      assert.doesNotMatch(error.message, /private upstream marker/);
      return true;
    },
  );
  assert.deepEqual(clock.sleepRequests, [25, 25]);
});

test("does not retry invalid input", async () => {
  const clock = new DeterministicClock();

  await assert.rejects(
    retryBounded({
      operationName: "read-evidence",
      operation: async () => {
        throw new ToolkitError("invalid-input", "fixture has an invalid shape", {
          operation: "read-evidence",
        });
      },
      shouldRetry: isRetryableDependencyFailure,
      maxAttempts: 3,
      delayMs: 25,
      clock,
    }),
    (error: unknown) => {
      assert.ok(error instanceof ToolkitError);
      assert.equal(error.kind, "invalid-input");
      assert.equal(error.context.attempt, 1);
      assert.equal(error.context.retryExhausted, false);
      return true;
    },
  );
  assert.deepEqual(clock.sleepRequests, []);
});

test("rejects invalid asynchronous utility options at their public boundary", async () => {
  const clock = new DeterministicClock();

  await assert.rejects(
    pollUntil({
      operationName: "wait-for-ready",
      operation: async () => "pending",
      isComplete: () => false,
      describe: () => "pending",
      timeoutMs: 10,
      intervalMs: 0,
      clock,
    }),
    (error: unknown) => error instanceof ToolkitError && error.kind === "invalid-input",
  );

  await assert.rejects(
    retryBounded({
      operationName: "read-evidence",
      operation: async () => "unused",
      shouldRetry: () => false,
      maxAttempts: 1.5,
      delayMs: 0,
      clock,
    }),
    (error: unknown) => error instanceof ToolkitError && error.kind === "invalid-input",
  );
});
