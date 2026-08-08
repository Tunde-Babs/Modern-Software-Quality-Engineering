import type { TextFileSystem } from "./fileSystem.js";
import type { QualityEvidenceSummary, QualityToolConfig } from "./models.js";
import { normaliseQualityExecutionResults } from "./normalisation.js";
import { createQualityReport, formatQualityReport } from "./reporting.js";
import { summariseQualityExecutionResults } from "./summary.js";
import { parseQualityExecutionResults } from "./validation.js";

function parseJson(text: string, sourceName: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "Unknown JSON parsing error.";
    throw new Error(`Could not parse JSON from ${sourceName}: ${reason}`);
  }
}

/**
 * Coordinates effects at the edge of the program. Its collaborators are
 * passed in explicitly so the pure stages remain reusable and the filesystem
 * can be replaced in a focused test later in Part II.
 */
export async function createQualityEvidenceReport(
  config: QualityToolConfig,
  fileSystem: TextFileSystem,
): Promise<QualityEvidenceSummary> {
  let sourceText: string;
  try {
    sourceText = await fileSystem.readUtf8(config.inputPath);
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "Unknown file read error.";
    throw new Error(`Could not read quality-result fixture at ${config.inputPath}: ${reason}`);
  }

  const parsedInput = parseJson(sourceText, config.inputPath);
  const validatedResults = parseQualityExecutionResults(parsedInput);
  const normalisedResults = normaliseQualityExecutionResults(validatedResults);
  const summary = summariseQualityExecutionResults(
    normalisedResults,
    config.slowResponseThresholdMs,
  );
  const report = createQualityReport(config, summary);

  try {
    await fileSystem.writeUtf8(config.outputPath, formatQualityReport(report));
  } catch (error: unknown) {
    const reason = error instanceof Error ? error.message : "Unknown file write error.";
    throw new Error(`Could not write quality report to ${config.outputPath}: ${reason}`);
  }

  return summary;
}
