import { ToolkitError } from "./errors.js";
import type { ExecutionRecord, QualitySummary } from "./models.js";

function countByKey(records: readonly ExecutionRecord[], selectKey: (record: ExecutionRecord) => string): Record<string, number> {
  const counts = new Map<string, number>();
  for (const record of records) {
    const key = selectKey(record);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return Object.fromEntries([...counts.entries()].sort(([left], [right]) => left.localeCompare(right)));
}

function assertSlowThreshold(slowThresholdMs: number): void {
  if (!Number.isFinite(slowThresholdMs) || slowThresholdMs < 0) {
    throw new ToolkitError(
      "invalid-input",
      "slowThresholdMs must be a non-negative finite number.",
      { operation: "summarise-executions", expected: "slowThresholdMs: non-negative finite number" },
    );
  }
}

/** Produces decision-oriented counts from a trusted, de-duplicated population. */
export function summariseExecutions(
  records: readonly ExecutionRecord[],
  slowThresholdMs: number,
): QualitySummary {
  assertSlowThreshold(slowThresholdMs);

  const failed = records.filter((record) => record.outcome === "failed");
  const slow = records.filter((record) => record.durationMs >= slowThresholdMs);

  return {
    executionCount: records.length,
    passedExecutionCount: records.filter((record) => record.outcome === "passed").length,
    failedExecutionCount: failed.length,
    skippedExecutionCount: records.filter((record) => record.outcome === "skipped").length,
    slowExecutionCount: slow.length,
    failedOperationCount: countByKey(failed, (record) => record.operation),
    executionCountByEnvironment: countByKey(records, (record) => record.environment),
    slowOperations: [...new Set(slow.map((record) => record.operation))].sort((left, right) =>
      left.localeCompare(right),
    ),
  };
}
