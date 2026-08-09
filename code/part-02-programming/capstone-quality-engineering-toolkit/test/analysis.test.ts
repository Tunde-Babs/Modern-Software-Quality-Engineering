import assert from "node:assert/strict";
import test from "node:test";

import { summariseExecutions } from "../src/analysis.js";
import { ToolkitError } from "../src/errors.js";
import { normaliseAndDeduplicate } from "../src/normalisation.js";
import type { ExecutionRecord } from "../src/models.js";

const records: readonly ExecutionRecord[] = [
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
    executionId: "exec-002",
    operation: "POST /orders",
    environment: "staging",
    outcome: "failed",
    durationMs: 680,
    timestamp: "2026-08-09T09:01:00.000Z",
    diagnosticCode: "ORDER_VALIDATION_FAILED",
  },
];

test("normalises values and removes an exact replayed execution", () => {
  const normalised = normaliseAndDeduplicate(records);
  assert.equal(normalised.receivedRecordCount, 3);
  assert.equal(normalised.duplicateExecutionCount, 1);
  assert.deepEqual(normalised.executions.map((record) => record.operation), ["GET /catalogue", "POST /orders"]);
  assert.deepEqual(normalised.executions.map((record) => record.environment), ["staging", "staging"]);
});

test("rejects duplicate execution identifiers with conflicting evidence", () => {
  const conflicting = [...records.slice(0, 2), { ...records[1]!, durationMs: 681 }];

  assert.throws(() => normaliseAndDeduplicate(conflicting), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "invalid-input");
    assert.match(error.message, /conflicting evidence/);
    return true;
  });
});

test("treats a duration exactly at the slow threshold as slow", () => {
  const summary = summariseExecutions(normaliseAndDeduplicate(records).executions, 500);

  assert.deepEqual(summary, {
    executionCount: 2,
    passedExecutionCount: 1,
    failedExecutionCount: 1,
    skippedExecutionCount: 0,
    slowExecutionCount: 2,
    failedOperationCount: { "POST /orders": 1 },
    executionCountByEnvironment: { staging: 2 },
    slowOperations: ["GET /catalogue", "POST /orders"],
  });
});
