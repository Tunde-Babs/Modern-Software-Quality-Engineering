import type { QualityCheckObservation } from "./models.js";

/** Provides the fixed-input completion rule used by Chapter 8's diagnosis scenario. */
export function matchesScenarioCompletionState(observation: QualityCheckObservation): boolean {
  return observation.state === ("completed" as QualityCheckObservation["state"]);
}

/** Applies the documented completion-state contract after the diagnosis. */
export function matchesDocumentedCompletionState(observation: QualityCheckObservation): boolean {
  return observation.state === "complete";
}

export function describeObservation(observation: QualityCheckObservation): string {
  return `${observation.endpoint} is ${observation.state} after ${observation.responseTimeMs} ms`;
}
