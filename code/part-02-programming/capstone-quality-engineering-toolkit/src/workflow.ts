import {
  pollUntil,
  retryBounded,
  type ReadinessState,
} from "./asyncUtilities.js";
import { loadToolkitConfig } from "./configuration.js";
import { isRetryableDependencyFailure } from "./errors.js";
import { loadExecutions } from "./loadExecutions.js";
import type { Clock, EvidenceSnapshot, FileSystem, QualityReport } from "./models.js";
import { normaliseAndDeduplicate } from "./normalisation.js";
import { formatReport } from "./reporting.js";
import { summariseExecutions } from "./analysis.js";

export interface ToolkitDependencies {
  readonly fileSystem: FileSystem;
  readonly clock: Clock;
  readinessOperation(): Promise<ReadinessState>;
  readEvidenceSnapshot(): Promise<EvidenceSnapshot>;
}

export async function runToolkit(
  configurationPath: string,
  dependencies: ToolkitDependencies,
): Promise<QualityReport> {
  const config = await loadToolkitConfig(configurationPath, dependencies.fileSystem);

  const readiness = await pollUntil({
    operationName: "wait-for-quality-evidence",
    operation: dependencies.readinessOperation,
    isComplete: (state) => state === "ready",
    describe: (state) => state,
    timeoutMs: config.pollingTimeoutMs,
    intervalMs: config.pollingIntervalMs,
    clock: dependencies.clock,
  });

  const snapshot = await retryBounded({
    operationName: "read-evidence-snapshot",
    operation: dependencies.readEvidenceSnapshot,
    shouldRetry: isRetryableDependencyFailure,
    maxAttempts: config.retryMaxAttempts,
    delayMs: config.retryDelayMs,
    clock: dependencies.clock,
  });

  const trustedRecords = await loadExecutions(config.inputPath, dependencies.fileSystem);
  const normalised = normaliseAndDeduplicate(trustedRecords);
  const summary = summariseExecutions(normalised.executions, config.slowThresholdMs);

  const report: QualityReport = {
    reportName: "quality-engineering-toolkit",
    targetEnvironment: config.environment,
    inputRecordCount: normalised.receivedRecordCount,
    duplicateExecutionCount: normalised.duplicateExecutionCount,
    summary,
    asynchronousEvidence: {
      readinessAttempts: readiness.attempts,
      readinessElapsedMs: readiness.elapsedMs,
      snapshotReadAttempts: snapshot.attempts,
      snapshotId: snapshot.value.snapshotId,
    },
    diagnostics: [
      {
        severity: "information",
        operation: "wait-for-quality-evidence",
        detail: "Readiness condition observed.",
        attempt: readiness.attempts,
        elapsedMs: readiness.elapsedMs,
        expected: "ready",
        observed: readiness.value,
      },
      {
        severity: "information",
        operation: "read-evidence-snapshot",
        detail: "Fixture evidence snapshot read after bounded attempts.",
        attempt: snapshot.attempts,
      },
      {
        severity: normalised.duplicateExecutionCount === 0 ? "information" : "warning",
        operation: "deduplicate-executions",
        detail:
          normalised.duplicateExecutionCount === 0
            ? "No replayed execution records were removed."
            : `${normalised.duplicateExecutionCount} replayed execution record(s) were removed.`,
      },
    ],
  };

  await dependencies.fileSystem.writeText(config.outputPath, formatReport(report), "quality report");
  return report;
}
