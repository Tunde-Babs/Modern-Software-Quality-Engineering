import type { FailureContext, FailureKind } from "./models.js";

/** A compact error model for the capstone's external and asynchronous boundaries. */
export class ToolkitError extends Error {
  readonly kind: FailureKind;
  readonly context: FailureContext;

  constructor(kind: FailureKind, message: string, context: FailureContext, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "ToolkitError";
    this.kind = kind;
    this.context = context;
  }
}

export function isRetryableDependencyFailure(error: unknown): boolean {
  return error instanceof ToolkitError && error.kind === "dependency-failure";
}

/**
 * Converts an unknown failure into a controlled capstone error. The unknown
 * cause is retained for local handling but is not included in the public text.
 */
export function toToolkitError(error: unknown, operation: string): ToolkitError {
  if (error instanceof ToolkitError) {
    return error;
  }

  return new ToolkitError(
    "unexpected-result",
    `An unexpected failure occurred while ${operation}.`,
    { operation },
    error,
  );
}

/** Produces a diagnostic record that never renders an arbitrary caught cause. */
export function toSafeDiagnostic(error: unknown): {
  readonly kind: FailureKind;
  readonly operation: string;
  readonly detail: string;
  readonly attempt?: number;
  readonly elapsedMs?: number;
  readonly expected?: string;
  readonly observed?: string;
} {
  const controlled = toToolkitError(error, "run-toolkit");
  return {
    kind: controlled.kind,
    operation: controlled.context.operation,
    detail: controlled.message,
    ...(controlled.context.attempt === undefined ? {} : { attempt: controlled.context.attempt }),
    ...(controlled.context.elapsedMs === undefined ? {} : { elapsedMs: controlled.context.elapsedMs }),
    ...(controlled.context.expected === undefined ? {} : { expected: controlled.context.expected }),
    ...(controlled.context.observed === undefined ? {} : { observed: controlled.context.observed }),
  };
}
