import type { QualityCheckObservation } from "./models.js";

/**
 * Deliberately defective predicate for Chapter 8. The simulated dependency
 * returns `complete`; this predicate searches for `completed` and therefore
 * creates a reproducible timeout symptom.
 */
export function hasDefectiveCompletionPredicate(observation: QualityCheckObservation): boolean {
  return observation.state === ("completed" as QualityCheckObservation["state"]);
}

/** The bounded correction: use the actual state contract. */
export function hasExpectedCompletionPredicate(observation: QualityCheckObservation): boolean {
  return observation.state === "complete";
}

export function describeObservation(observation: QualityCheckObservation): string {
  return `${observation.endpoint} is ${observation.state} after ${observation.responseTimeMs} ms`;
}
