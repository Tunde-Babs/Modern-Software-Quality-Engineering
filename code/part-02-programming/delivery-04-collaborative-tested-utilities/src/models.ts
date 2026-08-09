/** An explicit dependency seam makes time-controlled behaviour testable. */
export interface Clock {
  now(): number;
  sleep(milliseconds: number): Promise<void>;
}

export type CheckState = "passed" | "failed" | "pending";

export interface QualityObservation {
  readonly endpoint: string;
  readonly state: CheckState;
  readonly durationMs: number;
}

export interface QualitySummary {
  readonly executionCount: number;
  readonly passedCount: number;
  readonly failedCount: number;
  readonly pendingCount: number;
  readonly slowEndpointCount: number;
}

export type FailureKind = "invalid-input" | "dependency-failure" | "timeout" | "unexpected-result";

export interface DiagnosticContext {
  readonly operation: string;
  readonly attempt?: number;
  readonly elapsedMs?: number;
  readonly observedState?: string;
  readonly retryExhausted?: boolean;
}

export interface PollingResult<T> {
  readonly value: T;
  readonly attempts: number;
  readonly elapsedMs: number;
}

export interface RetryResult<T> {
  readonly value: T;
  readonly attempts: number;
}
