export interface Clock {
  now(): number;
  sleep(milliseconds: number): Promise<void>;
}

export type FailureKind =
  | "invalid-input"
  | "dependency-failure"
  | "timeout"
  | "unexpected-result";

export interface DiagnosticContext {
  readonly operation: string;
  readonly attempt?: number;
  readonly elapsedMs?: number;
  readonly observedState?: string;
  /** True only when a retryable operation used every allowed total attempt. */
  readonly retryExhausted?: boolean;
}

export interface PollingResult<T> {
  value: T;
  attempts: number;
  elapsedMs: number;
}

export interface RetryResult<T> {
  value: T;
  attempts: number;
}

export interface QualityCheckObservation {
  endpoint: string;
  state: "pending" | "complete" | "failed";
  responseTimeMs: number;
}

export interface QualityCheckSummary {
  executionCount: number;
  completedCount: number;
  failedCount: number;
  slowEndpointCount: number;
}
