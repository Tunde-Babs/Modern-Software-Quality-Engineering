import { ToolkitError } from "./errors.js";
import type { ExecutionRecord, NormalisedExecutions } from "./models.js";

function normaliseText(value: string): string {
  return value.trim().replaceAll(/\s+/g, " ");
}

function normaliseRecord(record: ExecutionRecord): ExecutionRecord {
  return {
    ...record,
    executionId: normaliseText(record.executionId),
    operation: normaliseText(record.operation),
    environment: normaliseText(record.environment).toLowerCase(),
    ...(record.diagnosticCode === undefined ? {} : { diagnosticCode: normaliseText(record.diagnosticCode) }),
  };
}

function isSameLogicalExecution(left: ExecutionRecord, right: ExecutionRecord): boolean {
  return (
    left.executionId === right.executionId &&
    left.operation === right.operation &&
    left.environment === right.environment &&
    left.outcome === right.outcome &&
    left.durationMs === right.durationMs &&
    left.timestamp === right.timestamp &&
    left.diagnosticCode === right.diagnosticCode
  );
}

/**
 * Normalises presentation-level values and removes exact replayed records.
 * A duplicate identifier with conflicting evidence is rejected rather than
 * silently choosing a record and distorting the resulting quality evidence.
 */
export function normaliseAndDeduplicate(
  records: readonly ExecutionRecord[],
): NormalisedExecutions {
  const logicalExecutions = new Map<string, ExecutionRecord>();
  let duplicateExecutionCount = 0;

  for (const rawRecord of records) {
    const record = normaliseRecord(rawRecord);
    const existing = logicalExecutions.get(record.executionId);
    if (existing === undefined) {
      logicalExecutions.set(record.executionId, record);
      continue;
    }

    if (!isSameLogicalExecution(existing, record)) {
      throw new ToolkitError(
        "invalid-input",
        "A duplicate executionId contains conflicting evidence.",
        {
          operation: "deduplicate-executions",
          executionId: record.executionId,
          expected: "identical replayed execution evidence",
        },
      );
    }

    duplicateExecutionCount += 1;
  }

  return {
    receivedRecordCount: records.length,
    executions: [...logicalExecutions.values()],
    duplicateExecutionCount,
  };
}
