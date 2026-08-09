import { ToolkitError } from "./errors.js";
import type { Clock, EvidenceSnapshot, FailureKind, PollingResult, RetryResult } from "./models.js";

export class DeterministicClock implements Clock {
  private elapsedMs = 0;
  readonly sleepRequests: number[] = [];

  now(): number {
    return this.elapsedMs;
  }

  async sleep(milliseconds: number): Promise<void> {
    if (!Number.isFinite(milliseconds) || milliseconds < 0) {
      throw new Error("A deterministic clock cannot sleep for a negative or non-finite duration.");
    }

    this.sleepRequests.push(milliseconds);
    this.elapsedMs += milliseconds;
  }
}

export interface PollingOptions<T> {
  readonly operationName: string;
  operation(): Promise<T>;
  isComplete(value: T): boolean;
  describe(value: T): string;
  readonly timeoutMs: number;
  readonly intervalMs: number;
  readonly clock: Clock;
}

function assertPollingOptions(timeoutMs: number, intervalMs: number): void {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new ToolkitError("invalid-input", "timeoutMs must be a non-negative finite number.", {
      operation: "poll",
      expected: "timeoutMs: non-negative finite number",
    });
  }

  if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
    throw new ToolkitError("invalid-input", "intervalMs must be a positive finite number.", {
      operation: "poll",
      expected: "intervalMs: positive finite number",
    });
  }
}

export async function pollUntil<T>(options: PollingOptions<T>): Promise<PollingResult<T>> {
  assertPollingOptions(options.timeoutMs, options.intervalMs);

  const startedAtMs = options.clock.now();
  let attempts = 0;
  let lastObservedState = "No result was observed.";

  while (true) {
    attempts += 1;
    const value = await options.operation();
    const elapsedMs = options.clock.now() - startedAtMs;
    lastObservedState = options.describe(value);

    if (options.isComplete(value)) {
      return { value, attempts, elapsedMs };
    }

    if (elapsedMs >= options.timeoutMs) {
      throw new ToolkitError(
        "timeout",
        `Timed out waiting for ${options.operationName} after ${elapsedMs} ms.`,
        {
          operation: options.operationName,
          attempt: attempts,
          elapsedMs,
          expected: "completion condition",
          observed: lastObservedState,
        },
      );
    }

    await options.clock.sleep(Math.min(options.intervalMs, options.timeoutMs - elapsedMs));
  }
}

export interface RetryOptions<T> {
  readonly operationName: string;
  operation(): Promise<T>;
  shouldRetry(error: unknown): boolean;
  readonly maxAttempts: number;
  readonly delayMs: number;
  readonly clock: Clock;
}

function assertRetryOptions(maxAttempts: number, delayMs: number): void {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new ToolkitError("invalid-input", "maxAttempts must be an integer of at least 1.", {
      operation: "retry",
      expected: "maxAttempts: integer >= 1",
    });
  }

  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new ToolkitError("invalid-input", "delayMs must be a non-negative finite number.", {
      operation: "retry",
      expected: "delayMs: non-negative finite number",
    });
  }
}

function terminalKind(error: unknown): FailureKind {
  return error instanceof ToolkitError ? error.kind : "unexpected-result";
}

export async function retryBounded<T>(options: RetryOptions<T>): Promise<RetryResult<T>> {
  assertRetryOptions(options.maxAttempts, options.delayMs);

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    try {
      return { value: await options.operation(), attempts: attempt };
    } catch (error: unknown) {
      const retryable = options.shouldRetry(error);
      if (!retryable || attempt === options.maxAttempts) {
        const exhausted = retryable && attempt === options.maxAttempts;
        throw new ToolkitError(
          terminalKind(error),
          exhausted
            ? `${options.operationName} exhausted its bounded attempts at attempt ${attempt}.`
            : `${options.operationName} stopped because the failure is not retryable at attempt ${attempt}.`,
          { operation: options.operationName, attempt, retryExhausted: exhausted },
          error,
        );
      }

      await options.clock.sleep(options.delayMs);
    }
  }

  throw new Error("Unreachable retry state.");
}

export type ReadinessState = "pending" | "ready";

export function createScriptedReadiness(states: readonly ReadinessState[]): () => Promise<ReadinessState> {
  if (states.length === 0) {
    throw new Error("A scripted readiness operation needs at least one state.");
  }

  let index = 0;
  return async () => {
    const state = states[index] ?? states[states.length - 1];
    index += 1;
    if (state === undefined) {
      throw new Error("Unreachable scripted readiness state.");
    }

    return state;
  };
}

/**
 * Simulates an idempotent read of fixture evidence: retrying it does not create
 * or modify data. A real write must establish idempotency before using retry.
 */
export function createTransientSnapshotReader(snapshotId = "fixture-snapshot-001"): () => Promise<EvidenceSnapshot> {
  let invocationCount = 0;
  return async () => {
    invocationCount += 1;
    if (invocationCount === 1) {
      throw new ToolkitError(
        "dependency-failure",
        "Simulated evidence dependency is temporarily unavailable.",
        { operation: "read-evidence-snapshot", attempt: invocationCount },
      );
    }

    return { snapshotId };
  };
}
