import type { QualityEvidenceSummary, QualityExecutionResult } from "./models.js";

function isFailedExecution(result: QualityExecutionResult): boolean {
  return !result.validationPassed || result.statusCode >= 400;
}

function isSlowExecution(result: QualityExecutionResult, thresholdMs: number): boolean {
  return result.responseTimeMs > thresholdMs;
}

/**
 * Produces a summary from already trusted input. The selected threshold is an
 * explicit policy input, not a universal definition of acceptable latency.
 */
export function summariseQualityExecutionResults(
  results: readonly QualityExecutionResult[],
  slowResponseThresholdMs: number,
): QualityEvidenceSummary {
  if (!Number.isFinite(slowResponseThresholdMs) || slowResponseThresholdMs < 0) {
    throw new Error("slowResponseThresholdMs must be a non-negative finite number.");
  }

  const failureCountByEndpoint = new Map<string, number>();
  const slowEndpoints = new Set<string>();
  let failedExecutionCount = 0;
  let slowExecutionCount = 0;

  for (const result of results) {
    if (isFailedExecution(result)) {
      failedExecutionCount += 1;
      failureCountByEndpoint.set(
        result.endpoint,
        (failureCountByEndpoint.get(result.endpoint) ?? 0) + 1,
      );
    }

    if (isSlowExecution(result, slowResponseThresholdMs)) {
      slowExecutionCount += 1;
      slowEndpoints.add(result.endpoint);
    }
  }

  return {
    executionCount: results.length,
    failedExecutionCount,
    slowExecutionCount,
    failureCountByEndpoint: Object.fromEntries(failureCountByEndpoint),
    slowEndpoints: [...slowEndpoints].sort(),
  };
}
