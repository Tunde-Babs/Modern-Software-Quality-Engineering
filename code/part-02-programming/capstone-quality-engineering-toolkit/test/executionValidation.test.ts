import assert from "node:assert/strict";
import test from "node:test";

import { ToolkitError } from "../src/errors.js";
import { validateExecutionCollection } from "../src/validation.js";

const validExecution = {
  executionId: "exec-001",
  operation: "GET /catalogue",
  environment: "staging",
  outcome: "passed",
  durationMs: 500,
  timestamp: "2026-08-09T09:00:00.000Z",
};

test("accepts the documented ISO 8601 UTC timestamp form", () => {
  assert.deepEqual(validateExecutionCollection([{ ...validExecution }]), [validExecution]);
});

test("rejects timestamps outside the documented ISO 8601 UTC form", () => {
  assert.throws(
    () => validateExecutionCollection([{ ...validExecution, timestamp: "2026-08-09 09:00:00Z" }]),
    (error: unknown) => {
      assert.ok(error instanceof ToolkitError);
      assert.equal(error.kind, "invalid-input");
      assert.equal(error.context.recordIndex, 0);
      assert.match(error.message, /ISO 8601 UTC timestamp/);
      return true;
    },
  );
});

test("includes the record index for a malformed numeric duration", () => {
  assert.throws(
    () => validateExecutionCollection([{ ...validExecution, durationMs: "slow" }]),
    (error: unknown) => {
      assert.ok(error instanceof ToolkitError);
      assert.equal(error.kind, "invalid-input");
      assert.equal(error.context.recordIndex, 0);
      assert.match(error.message, /durationMs/);
      return true;
    },
  );
});

test("rejects a malformed execution outcome with its record index", () => {
  const malformed = { ...validExecution, outcome: "green" };

  assert.throws(() => validateExecutionCollection([malformed]), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "invalid-input");
    assert.equal(error.context.recordIndex, 0);
    assert.match(error.message, /outcome/);
    return true;
  });
});

test("rejects an execution fixture that is not an array", () => {
  assert.throws(() => validateExecutionCollection(validExecution), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "invalid-input");
    assert.match(error.message, /JSON array/);
    return true;
  });
});
