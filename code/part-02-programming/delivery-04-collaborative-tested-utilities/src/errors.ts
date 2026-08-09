import type { DiagnosticContext, FailureKind } from "./models.js";

/**
 * A small, boundary-specific error that carries a controlled category and
 * diagnostic context. It is not a replacement for every application error.
 */
export class QualityUtilityError extends Error {
  readonly kind: FailureKind;
  readonly context: DiagnosticContext;

  constructor(kind: FailureKind, message: string, context: DiagnosticContext, cause?: unknown) {
    super(message, cause === undefined ? undefined : { cause });
    this.name = "QualityUtilityError";
    this.kind = kind;
    this.context = context;
  }
}

export function isRetryableDependencyFailure(error: unknown): boolean {
  return error instanceof QualityUtilityError && error.kind === "dependency-failure";
}
