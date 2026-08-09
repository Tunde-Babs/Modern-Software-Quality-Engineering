import assert from "node:assert/strict";

import { loadQualityToolConfig } from "./configuration.js";
import { normaliseQualityExecutionResults } from "./normalisation.js";
import { parseQualityExecutionResult } from "./validation.js";

const validExecution = {
  executionId: "exec-001",
  endpoint: " GET /catalogue ",
  statusCode: 200,
  responseTimeMs: 120,
  environment: "staging",
  validationPassed: true,
};

assert.deepEqual(normaliseQualityExecutionResults([parseQualityExecutionResult(validExecution)]), [
  { ...validExecution, endpoint: "GET /catalogue" },
]);

for (const statusCode of [99, 199.5, 600]) {
  assert.throws(
    () => parseQualityExecutionResult({ ...validExecution, statusCode }),
    /statusCode must be an integer between 100 and 599/,
  );
}

const defaults = loadQualityToolConfig({
  QE_ENVIRONMENT: "staging",
  QE_INPUT_PATH: "fixtures/quality-executions.json",
  QE_OUTPUT_PATH: "   ",
});
assert.equal(defaults.outputPath, ".build/quality-summary.json");

console.log("All deterministic Delivery 2 validation scenarios passed.");
