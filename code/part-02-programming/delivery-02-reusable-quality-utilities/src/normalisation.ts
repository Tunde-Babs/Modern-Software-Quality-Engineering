import type { QualityExecutionResult } from "./models.js";

/**
 * Returns new records with presentation-only endpoint whitespace removed. The
 * validation boundary accepts non-empty source text; this stage owns the
 * canonical representation used by summaries. It never changes the caller's
 * array or record objects.
 */
export function normaliseQualityExecutionResults(
  results: readonly QualityExecutionResult[],
): QualityExecutionResult[] {
  return results.map((result) => ({
    ...result,
    endpoint: result.endpoint.trim(),
  }));
}
