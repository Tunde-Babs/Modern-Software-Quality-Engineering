import { QualityUtilityError } from "./errors.js";
import type { Clock, FailureKind, RetryResult } from "./models.js";

export interface RetryOptions<T> {
  operationName: string;
  operation(): Promise<T>;
  shouldRetry(error: unknown): boolean;
  maxAttempts: number;
  delayMs: number;
  clock: Clock;
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

function createTerminalRetryFailure(
  operationName: string,
  attempt: number,
  retryExhausted: boolean,
  error: unknown,
): QualityUtilityError {
  const terminalState = retryExhausted
    ? "exhausted its bounded attempts"
    : "stopped because the failure is not retryable";

  return new QualityUtilityError(
    terminalFailureKind(error),
    `${operationName} ${terminalState} at attempt ${attempt}.`,
    {
      operation: operationName,
      attempt,
      retryExhausted,
    },
    error,
  );
}

/**
 * Retries only when the caller classifies the failure as retryable. The caller
 * remains responsible for ensuring that a repeated operation is safe.
 * `maxAttempts` includes the initial attempt. Terminal errors retain the
 * original QualityUtilityError category when one exists and expose only
 * controlled retry metadata; their cause is preserved but not rendered here.
 */
export async function retryBounded<T>(options: RetryOptions<T>): Promise<RetryResult<T>> {
  validateRetryOptions(options.maxAttempts, options.delayMs);

  for (let attempt = 1; attempt <= options.maxAttempts; attempt += 1) {
    try {
      return { value: await options.operation(), attempts: attempt };
    } catch (error: unknown) {
      const retryable = options.shouldRetry(error);
      if (!retryable || attempt === options.maxAttempts) {
        throw createTerminalRetryFailure(
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
