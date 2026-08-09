import {
  DeterministicClock,
  createScriptedReadiness,
  createTransientSnapshotReader,
} from "./asyncUtilities.js";
import { toSafeDiagnostic } from "./errors.js";
import { nodeFileSystem } from "./fileSystem.js";
import { runToolkit } from "./workflow.js";

const configurationPath = process.argv[2] ?? "fixtures/toolkit-config.json";

try {
  const report = await runToolkit(configurationPath, {
    fileSystem: nodeFileSystem,
    clock: new DeterministicClock(),
    readinessOperation: createScriptedReadiness(["pending", "ready"]),
    readEvidenceSnapshot: createTransientSnapshotReader(),
  });

  console.log(JSON.stringify(report, null, 2));
} catch (error: unknown) {
  console.error(JSON.stringify({ runStatus: "failed", diagnostic: toSafeDiagnostic(error) }, null, 2));
  process.exitCode = 1;
}
