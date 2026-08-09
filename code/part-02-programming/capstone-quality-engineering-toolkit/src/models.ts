/** The clock boundary keeps time-dependent utility behaviour testable. */
export interface Clock {
  now(): number;
  sleep(milliseconds: number): Promise<void>;
}

/** Filesystem operations are explicit effects owned by the outer workflow. */
export interface FileSystem {
  readText(path: string, purpose: string): Promise<string>;
  writeText(path: string, content: string, purpose: string): Promise<void>;
}

export type ExecutionOutcome = "passed" | "failed" | "skipped";

export interface ExecutionRecord {
  readonly executionId: string;
  readonly operation: string;
  readonly environment: string;
  readonly outcome: ExecutionOutcome;
  readonly durationMs: number;
  readonly timestamp: string;
  readonly diagnosticCode?: string;
}

export interface ToolkitConfig {
  readonly environment: string;
  readonly inputPath: string;
  readonly outputPath: string;
  readonly slowThresholdMs: number;
  readonly pollingTimeoutMs: number;
  readonly pollingIntervalMs: number;
  readonly retryMaxAttempts: number;
  readonly retryDelayMs: number;
}

export type FailureKind = "invalid-input" | "dependency-failure" | "timeout" | "unexpected-result";

export interface FailureContext {
  readonly operation: string;
  readonly recordIndex?: number;
  readonly executionId?: string;
  readonly attempt?: number;
  readonly elapsedMs?: number;
  readonly expected?: string;
  readonly observed?: string;
  readonly retryExhausted?: boolean;
}

export interface NormalisedExecutions {
  readonly receivedRecordCount: number;
  readonly executions: readonly ExecutionRecord[];
  readonly duplicateExecutionCount: number;
}

export interface QualitySummary {
  readonly executionCount: number;
  readonly passedExecutionCount: number;
  readonly failedExecutionCount: number;
  readonly skippedExecutionCount: number;
  readonly slowExecutionCount: number;
  readonly failedOperationCount: Readonly<Record<string, number>>;
  readonly executionCountByEnvironment: Readonly<Record<string, number>>;
  readonly slowOperations: readonly string[];
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

export interface EvidenceSnapshot {
  readonly snapshotId: string;
}

export interface DiagnosticEntry {
  readonly severity: "information" | "warning";
  readonly operation: string;
  readonly detail: string;
  readonly attempt?: number;
  readonly elapsedMs?: number;
  readonly expected?: string;
  readonly observed?: string;
}

export interface QualityReport {
  readonly reportName: "quality-engineering-toolkit";
  readonly targetEnvironment: string;
  readonly inputRecordCount: number;
  readonly duplicateExecutionCount: number;
  readonly summary: QualitySummary;
  readonly asynchronousEvidence: {
    readonly readinessAttempts: number;
    readonly readinessElapsedMs: number;
    readonly snapshotReadAttempts: number;
    readonly snapshotId: string;
  };
  readonly diagnostics: readonly DiagnosticEntry[];
}
