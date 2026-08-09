import { QualityUtilityError } from "./errors.js";
import type { Clock, FailureKind, RetryResult } from "./models.js";

export interface RetryOptions<T> {
  readonly operationName: string;
  operation(): Promise<T>;
  shouldRetry(error: unknown): boolean;
  readonly maxAttempts: number;
  readonly delayMs: number;
  readonly clock: Clock;
}

function validateRetryOptions(maxAttempts: number, delayMs: number): void {
  if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
    throw new QualityUtilityError("invalid-input", "maxAttempts must be an integer of at least 1.", {
      operation: "retry",
    });
  }

  if (!Number.isFinite(delayMs) || delayMs < 0) {
    throw new QualityUtilityError("invalid-input", "delayMs must be a non-negative finite number.", {
      operation: "retry",
    });
  }
}

function terminalFailureKind(error: unknown): FailureKind {
  return error instanceof QualityUtilityError ? error.kind : "unexpected-result";
}

function terminalRetryFailure(
  operationName: string,
  attempt: number,
  retryExhausted: boolean,
  error: unknown,
): QualityUtilityError {
  const outcome = retryExhausted
    ? "exhausted its bounded attempts"
    : "stopped because the failure is not retryable";

  return new QualityUtilityError(
    terminalFailureKind(error),
    `${operationName} ${outcome} at attempt ${attempt}.`,
    { operation: operationName, attempt, retryExhausted },
    error,
  );
}

/**
 * Retries only a caller-classified failure. `maxAttempts` includes the first
 * attempt; the terminal message deliberately excludes raw dependency details.
 */
export async function retryBounded<T>(options: RetryOptions<T>): Promise<RetryResult<T>> {
  validateRetryOptions(options.maxAttempts, options.delayMs);

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    try {
      return { value: await options.operation(), attempts: attempt };
    } catch (error: unknown) {
      const retryable = options.shouldRetry(error);
      if (!retryable || attempt === options.maxAttempts) {
        throw terminalRetryFailure(
          options.operationName,
          attempt,
          retryable && attempt === options.maxAttempts,
          error,
        );
      }

      await options.clock.sleep(options.delayMs);
    }
  }

  throw new Error("Unreachable retry state.");
}
