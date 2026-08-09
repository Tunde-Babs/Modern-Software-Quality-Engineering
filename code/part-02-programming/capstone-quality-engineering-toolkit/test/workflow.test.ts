import assert from "node:assert/strict";
import test from "node:test";

import {
  DeterministicClock,
  createScriptedReadiness,
  createTransientSnapshotReader,
} from "../src/asyncUtilities.js";
import { ToolkitError, toSafeDiagnostic } from "../src/errors.js";
import { runToolkit } from "../src/workflow.js";
import { MemoryFileSystem } from "./support/memoryFileSystem.js";

const configuration = {
  environment: "staging",
  inputPath: "fixtures/executions.json",
  outputPath: "output/report.json",
  slowThresholdMs: 500,
  pollingTimeoutMs: 100,
  pollingIntervalMs: 25,
  retryMaxAttempts: 2,
  retryDelayMs: 10,
};

const records = [
  {
    executionId: "exec-001",
    operation: " GET /catalogue ",
    environment: "Staging",
    outcome: "passed",
    durationMs: 500,
    timestamp: "2026-08-09T09:00:00.000Z",
  },
  {
    executionId: "exec-002",
    operation: "POST /orders",
    environment: "staging",
    outcome: "failed",
    durationMs: 680,
    timestamp: "2026-08-09T09:01:00.000Z",
    diagnosticCode: "ORDER_VALIDATION_FAILED",
  },
  {
    executionId: "exec-003",
    operation: "GET /catalogue",
    environment: "staging",
    outcome: "passed",
    durationMs: 120,
    timestamp: "2026-08-09T09:02:00.000Z",
  },
  {
    executionId: "exec-002",
    operation: "POST /orders",
    environment: "staging",
    outcome: "failed",
    durationMs: 680,
    timestamp: "2026-08-09T09:01:00.000Z",
    diagnosticCode: "ORDER_VALIDATION_FAILED",
  },
];

function successfulDependencies(fileSystem: MemoryFileSystem) {
  return {
    fileSystem,
    clock: new DeterministicClock(),
    readinessOperation: createScriptedReadiness(["pending", "ready"]),
    readEvidenceSnapshot: createTransientSnapshotReader(),
  };
}

test("runs the complete workflow and writes a deterministic, decision-oriented report", async () => {
  const fileSystem = new MemoryFileSystem({
    "config.json": JSON.stringify(configuration),
    "fixtures/executions.json": JSON.stringify(records),
  });

  const report = await runToolkit("config.json", successfulDependencies(fileSystem));
  const persisted = fileSystem.writtenText("output/report.json");

  assert.equal(report.inputRecordCount, 4);
  assert.equal(report.duplicateExecutionCount, 1);
  assert.deepEqual(report.summary, {
    executionCount: 3,
    passedExecutionCount: 2,
    failedExecutionCount: 1,
    skippedExecutionCount: 0,
    slowExecutionCount: 2,
    failedOperationCount: { "POST /orders": 1 },
    executionCountByEnvironment: { staging: 3 },
    slowOperations: ["GET /catalogue", "POST /orders"],
  });
  assert.deepEqual(report.asynchronousEvidence, {
    readinessAttempts: 2,
    readinessElapsedMs: 25,
    snapshotReadAttempts: 2,
    snapshotId: "fixture-snapshot-001",
  });
  assert.ok(persisted?.endsWith("\n"));
  assert.deepEqual(JSON.parse(persisted ?? "{}"), report);
});

test("stops a workflow when fixture data does not pass runtime validation", async () => {
  const fileSystem = new MemoryFileSystem({
    "config.json": JSON.stringify(configuration),
    "fixtures/executions.json": JSON.stringify([{ ...records[0], outcome: "green" }]),
  });

  await assert.rejects(runToolkit("config.json", successfulDependencies(fileSystem)), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "invalid-input");
    assert.equal(error.context.recordIndex, 0);
    return true;
  });
  assert.equal(fileSystem.writtenText("output/report.json"), undefined);
});

test("reports malformed execution-fixture JSON through the parse boundary", async () => {
  const fileSystem = new MemoryFileSystem({
    "config.json": JSON.stringify(configuration),
    "fixtures/executions.json": "{ malformed JSON",
  });

  await assert.rejects(runToolkit("config.json", successfulDependencies(fileSystem)), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "invalid-input");
    assert.equal(error.context.operation, "parse-json");
    return true;
  });
  assert.equal(fileSystem.writtenText("output/report.json"), undefined);
});

test("reports a missing execution fixture as a controlled file-boundary failure", async () => {
  const fileSystem = new MemoryFileSystem({ "config.json": JSON.stringify(configuration) });

  await assert.rejects(runToolkit("config.json", successfulDependencies(fileSystem)), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "dependency-failure");
    assert.equal(error.context.operation, "read-file");
    assert.match(error.message, /execution fixture/);
    return true;
  });
  assert.equal(fileSystem.writtenText("output/report.json"), undefined);
});

test("returns a controlled write failure without persisting a partial report", async () => {
  const fileSystem = new MemoryFileSystem(
    {
      "config.json": JSON.stringify(configuration),
      "fixtures/executions.json": JSON.stringify(records),
    },
    { failWrites: true },
  );

  await assert.rejects(runToolkit("config.json", successfulDependencies(fileSystem)), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "dependency-failure");
    assert.match(error.message, /quality report/);
    return true;
  });
  assert.equal(fileSystem.writtenText("output/report.json"), undefined);
});

test("renders unknown causes as safe diagnostics", () => {
  const diagnostic = toSafeDiagnostic(new Error("private-token=not-for-output"));

  assert.deepEqual(diagnostic, {
    kind: "unexpected-result",
    operation: "run-toolkit",
    detail: "An unexpected failure occurred while run-toolkit.",
  });
  assert.doesNotMatch(JSON.stringify(diagnostic), /private-token/);
});
