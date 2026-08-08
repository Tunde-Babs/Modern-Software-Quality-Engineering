export type TestStatus = "passed" | "failed" | "skipped";

export interface ApiExecutionResult {
  executionId: string;
  endpoint: string;
  statusCode: number;
  responseTimeMs: number;
  environment: "development" | "test" | "staging";
  timestamp: string;
  validationPassed: boolean;
}

export interface QualityEvidenceSummary {
  /** Validated input records before deduplication. */
  receivedRecordCount: number;
  /** Logical executions remaining after deduplication by executionId. */
  uniqueExecutionCount: number;
  /** Failed logical executions after deduplication. */
  failedUniqueExecutionCount: number;
  /** Slow logical executions after deduplication. */
  slowUniqueExecutionCount: number;
  /** Failure counts by endpoint, calculated from unique logical executions. */
  failureCountByEndpoint: Record<string, number>;
  /** Endpoints with at least one slow unique logical execution. */
  slowEndpoints: string[];
  /** Unique logical execution counts by environment. */
  uniqueExecutionCountByEnvironment: Record<string, number>;
}

const environments = new Set<ApiExecutionResult["environment"]>([
  "development",
  "test",
  "staging",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNonEmptyString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Expected a non-empty string for ${key}.`);
  }

  return value;
}

function readFiniteNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Expected a finite number for ${key}.`);
  }

  return value;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];
  if (typeof value !== "boolean") {
    throw new Error(`Expected a boolean for ${key}.`);
  }

  return value;
}

/**
 * Validates unknown runtime input before it is treated as an execution result.
 * A TypeScript assertion alone would not establish these checks at runtime.
 */
export function parseApiExecutionResult(input: unknown): ApiExecutionResult {
  if (!isRecord(input)) {
    throw new Error("Expected an execution result object.");
  }

  const environment = readNonEmptyString(input, "environment");
  if (!environments.has(environment as ApiExecutionResult["environment"])) {
    throw new Error(`Unexpected environment: ${environment}.`);
  }

  const result: ApiExecutionResult = {
    executionId: readNonEmptyString(input, "executionId"),
    endpoint: readNonEmptyString(input, "endpoint"),
    statusCode: readFiniteNumber(input, "statusCode"),
    responseTimeMs: readFiniteNumber(input, "responseTimeMs"),
    environment: environment as ApiExecutionResult["environment"],
    timestamp: readNonEmptyString(input, "timestamp"),
    validationPassed: readBoolean(input, "validationPassed"),
  };

  if (result.responseTimeMs < 0) {
    throw new Error("responseTimeMs cannot be negative.");
  }

  return result;
}

/**
 * Validates an input collection all-or-nothing.
 *
 * The first malformed record stops processing; this utility does not produce
 * a partial summary or a rejected-record count for mixed valid and invalid input.
 */
export function parseApiExecutionResults(input: unknown): ApiExecutionResult[] {
  if (!Array.isArray(input)) {
    throw new Error("Expected an array of execution results.");
  }

  return input.map((value, index) => {
    try {
      return parseApiExecutionResult(value);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown validation error.";
      throw new Error(`Invalid execution result at index ${index}: ${message}`);
    }
  });
}

export function uniqueExecutions(results: readonly ApiExecutionResult[]): ApiExecutionResult[] {
  const seenExecutionIds = new Set<string>();

  return results.filter((result) => {
    if (seenExecutionIds.has(result.executionId)) {
      return false;
    }

    seenExecutionIds.add(result.executionId);
    return true;
  });
}

/**
 * Summarises validated records. Outcome metrics are calculated from the
 * deduplicated logical-execution population, not from all received records.
 */
export function summariseExecutionResults(
  results: readonly ApiExecutionResult[],
  slowResponseThresholdMs: number,
): QualityEvidenceSummary {
  if (slowResponseThresholdMs < 0) {
    throw new Error("slowResponseThresholdMs cannot be negative.");
  }

  const uniqueResults = uniqueExecutions(results);
  const failedResults = uniqueResults.filter(
    (result) => !result.validationPassed || result.statusCode >= 400,
  );
  const slowResults = uniqueResults.filter(
    (result) => result.responseTimeMs > slowResponseThresholdMs,
  );

  const failureCountByEndpoint = new Map<string, number>();
  const uniqueExecutionCountByEnvironment = new Map<string, number>();

  for (const result of uniqueResults) {
    uniqueExecutionCountByEnvironment.set(
      result.environment,
      (uniqueExecutionCountByEnvironment.get(result.environment) ?? 0) + 1,
    );

    if (!result.validationPassed || result.statusCode >= 400) {
      failureCountByEndpoint.set(
        result.endpoint,
        (failureCountByEndpoint.get(result.endpoint) ?? 0) + 1,
      );
    }
  }

  return {
    receivedRecordCount: results.length,
    uniqueExecutionCount: uniqueResults.length,
    failedUniqueExecutionCount: failedResults.length,
    slowUniqueExecutionCount: slowResults.length,
    failureCountByEndpoint: Object.fromEntries(failureCountByEndpoint),
    slowEndpoints: [...new Set(slowResults.map((result) => result.endpoint))].sort(),
    uniqueExecutionCountByEnvironment: Object.fromEntries(uniqueExecutionCountByEnvironment),
  };
}
