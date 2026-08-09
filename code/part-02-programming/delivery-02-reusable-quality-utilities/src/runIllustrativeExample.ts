import { loadQualityToolConfig } from "./configuration.js";
import { nodeTextFileSystem } from "./fileSystem.js";
import { createQualityEvidenceReport } from "./workflow.js";

const illustrativeExternalValues = {
  QE_ENVIRONMENT: "staging",
  QE_SLOW_RESPONSE_THRESHOLD_MS: "750",
  QE_INPUT_PATH: "fixtures/quality-executions.json",
  QE_OUTPUT_PATH: ".build/quality-summary.json",
};

const config = loadQualityToolConfig(illustrativeExternalValues);
const summary = await createQualityEvidenceReport(config, nodeTextFileSystem);

console.log(JSON.stringify(summary, null, 2));
