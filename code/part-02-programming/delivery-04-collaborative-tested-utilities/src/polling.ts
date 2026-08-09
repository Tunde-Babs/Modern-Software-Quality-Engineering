import { QualityUtilityError } from "./errors.js";
import type { Clock, PollingResult } from "./models.js";

export interface PollingOptions<T> {
  readonly operationName: string;
  operation(): Promise<T>;
  isComplete(value: T): boolean;
  describe(value: T): string;
  readonly timeoutMs: number;
  readonly intervalMs: number;
  readonly clock: Clock;
}

function validateTiming(timeoutMs: number, intervalMs: number): void {
  if (!Number.isFinite(timeoutMs) || timeoutMs < 0) {
    throw new QualityUtilityError("invalid-input", "timeoutMs must be a non-negative finite number.", {
      operation: "poll",
    });
  }

  if (!Number.isFinite(intervalMs) || intervalMs <= 0) {
    throw new QualityUtilityError("invalid-input", "intervalMs must be a positive finite number.", {
      operation: "poll",
    });
  }
}

/** Polls a named operation until its explicit completion condition or timeout. */
export async function pollUntil<T>(options: PollingOptions<T>): Promise<PollingResult<T>> {
  validateTiming(options.timeoutMs, options.intervalMs);

  const startedAtMs = options.clock.now();
  let attempts = 0;
  let lastObservedState = "No operation result was observed.";

  while (true) {
    attempts += 1;
    const value = await options.operation();
    const elapsedMs = options.clock.now() - startedAtMs;
    lastObservedState = options.describe(value);

    if (options.isComplete(value)) {
      return { value, attempts, elapsedMs };
    }

    if (elapsedMs >= options.timeoutMs) {
      throw new QualityUtilityError(
        "timeout",
        `Timed out waiting for ${options.operationName} after ${elapsedMs} ms. Last observation: ${lastObservedState}`,
        {
          operation: options.operationName,
          attempt: attempts,
          elapsedMs,
          observedState: lastObservedState,
        },
      );
    }

    await options.clock.sleep(Math.min(options.intervalMs, options.timeoutMs - elapsedMs));
  }
}
