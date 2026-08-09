import type { QualityCheckObservation, QualityCheckSummary } from "./models.js";

/**
 * Shared precondition for the legacy and refactored implementations. A slow
 * threshold is a finite, non-negative duration in milliseconds.
 */
function validateSlowThreshold(slowThresholdMs: number): void {
  if (!Number.isFinite(slowThresholdMs) || slowThresholdMs < 0) {
    throw new Error("slowThresholdMs must be a non-negative finite number.");
  }
}

/**
 * A clear reference implementation used to characterize legacy behaviour over
 * the same valid input domain as `summariseChecks`.
 */
export function legacySummariseChecks(
  observations: readonly QualityCheckObservation[],
  slowThresholdMs: number,
): QualityCheckSummary {
  validateSlowThreshold(slowThresholdMs);

  let completedCount = 0;
  let failedCount = 0;
  const slowEndpoints = new Set<string>();

  for (const observation of observations) {
    if (observation.state === "complete") {
      completedCount += 1;
    }
    if (observation.state === "failed") {
      failedCount += 1;
    }
    if (observation.responseTimeMs > slowThresholdMs) {
      slowEndpoints.add(observation.endpoint);
    }
  }

  return {
    executionCount: observations.length,
    completedCount,
    failedCount,
    slowEndpointCount: slowEndpoints.size,
  };
}

function countState(
  observations: readonly QualityCheckObservation[],
  expectedState: QualityCheckObservation["state"],
): number {
  return observations.filter((observation) => observation.state === expectedState).length;
}

/**
 * Refactored equivalent of `legacySummariseChecks` over their shared valid
 * input domain. Its small helpers name the rules without changing the
 * externally observable summary contract.
 */
export function summariseChecks(
  observations: readonly QualityCheckObservation[],
  slowThresholdMs: number,
): QualityCheckSummary {
  validateSlowThreshold(slowThresholdMs);
  const slowEndpoints = new Set(
    observations
      .filter((observation) => observation.responseTimeMs > slowThresholdMs)
      .map((observation) => observation.endpoint),
  );

  return {
    executionCount: observations.length,
    completedCount: countState(observations, "complete"),
    failedCount: countState(observations, "failed"),
    slowEndpointCount: slowEndpoints.size,
  };
}
