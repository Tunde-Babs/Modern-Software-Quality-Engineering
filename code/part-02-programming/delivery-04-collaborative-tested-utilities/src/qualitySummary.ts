import { QualityUtilityError } from "./errors.js";
import type { CheckState, QualityObservation, QualitySummary } from "./models.js";

function validateSlowThreshold(slowThresholdMs: number): void {
  if (!Number.isFinite(slowThresholdMs) || slowThresholdMs < 0) {
    throw new QualityUtilityError(
      "invalid-input",
      "slowThresholdMs must be a non-negative finite number.",
      { operation: "summarise-quality-observations" },
    );
  }
}

function countState(observations: readonly QualityObservation[], state: CheckState): number {
  return observations.filter((observation) => observation.state === state).length;
}

/**
 * The current, reviewable implementation. It owns aggregation only; callers
 * retain ownership of acquisition and presentation.
 */
export function summariseQualityObservations(
  observations: readonly QualityObservation[],
  slowThresholdMs: number,
): QualitySummary {
  validateSlowThreshold(slowThresholdMs);

  const slowEndpoints = new Set(
    observations
      .filter((observation) => observation.durationMs >= slowThresholdMs)
      .map((observation) => observation.endpoint),
  );

  return {
    executionCount: observations.length,
    passedCount: countState(observations, "passed"),
    failedCount: countState(observations, "failed"),
    pendingCount: countState(observations, "pending"),
    slowEndpointCount: slowEndpoints.size,
  };
}

/**
 * Deliberately retained as a teaching fixture. It represents the observed
 * contract before a focused refactor; it is not a second preferred design.
 */
export function legacySummariseQualityObservations(
  observations: readonly QualityObservation[],
  slowThresholdMs: number,
): QualitySummary {
  validateSlowThreshold(slowThresholdMs);

  let passedCount = 0;
  let failedCount = 0;
  let pendingCount = 0;
  const slowEndpoints = new Set<string>();

  for (const observation of observations) {
    if (observation.state === "passed") {
      passedCount += 1;
    } else if (observation.state === "failed") {
      failedCount += 1;
    } else {
      pendingCount += 1;
    }

    if (observation.durationMs >= slowThresholdMs) {
      slowEndpoints.add(observation.endpoint);
    }
  }

  return {
    executionCount: observations.length,
    passedCount,
    failedCount,
    pendingCount,
    slowEndpointCount: slowEndpoints.size,
  };
}
