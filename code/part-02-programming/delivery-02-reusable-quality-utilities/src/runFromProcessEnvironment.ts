import { loadQualityToolConfig } from "./configuration.js";
import { nodeTextFileSystem } from "./fileSystem.js";
import { createQualityEvidenceReport } from "./workflow.js";

const config = loadQualityToolConfig(process.env);
const summary = await createQualityEvidenceReport(config, nodeTextFileSystem);

console.log(JSON.stringify(summary, null, 2));
