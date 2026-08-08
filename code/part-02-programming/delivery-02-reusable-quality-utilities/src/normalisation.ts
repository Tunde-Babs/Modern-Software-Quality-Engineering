import type { QualityExecutionResult } from "./models.js";

/**
 * Returns new records with presentation-only whitespace removed. It never
 * changes the caller's array or record objects.
 */
export function normaliseQualityExecutionResults(
  results: readonly QualityExecutionResult[],
): QualityExecutionResult[] {
  return results.map((result) => ({
    ...result,
    endpoint: result.endpoint.trim(),
  }));
}
