import assert from "node:assert/strict";
import test from "node:test";

import { QualityUtilityError } from "../src/errors.js";
import {
  legacySummariseQualityObservations,
  summariseQualityObservations,
} from "../src/qualitySummary.js";

const mixedObservations = [
  { endpoint: "/catalogue", state: "passed" as const, durationMs: 125 },
  { endpoint: "/checkout", state: "failed" as const, durationMs: 500 },
  { endpoint: "/checkout", state: "pending" as const, durationMs: 800 },
];

test("summarises execution states and unique slow endpoints", () => {
  assert.deepEqual(summariseQualityObservations(mixedObservations, 500), {
    executionCount: 3,
    passedCount: 1,
    failedCount: 1,
    pendingCount: 1,
    slowEndpointCount: 1,
  });
});

test("treats a duration exactly at the threshold as slow", () => {
  assert.deepEqual(
    summariseQualityObservations([{ endpoint: "/checkout", state: "passed", durationMs: 500 }], 500),
    {
      executionCount: 1,
      passedCount: 1,
      failedCount: 0,
      pendingCount: 0,
      slowEndpointCount: 1,
    },
  );
});

for (const invalidThreshold of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
  test(`rejects invalid slow threshold ${String(invalidThreshold)}`, () => {
    assert.throws(
      () => summariseQualityObservations([], invalidThreshold),
      (error: unknown) => {
        assert.ok(error instanceof QualityUtilityError);
        assert.equal(error.kind, "invalid-input");
        assert.match(error.message, /slowThresholdMs/);
        return true;
      },
    );
  });
}

test("characterizes the legacy summary contract across representative observations", () => {
  const cases = [
    { name: "no observations", observations: [], threshold: 500 },
    {
      name: "threshold boundary",
      observations: [{ endpoint: "/search", state: "passed" as const, durationMs: 500 }],
      threshold: 500,
    },
    { name: "mixed states and repeated endpoint", observations: mixedObservations, threshold: 500 },
  ];

  for (const example of cases) {
    assert.deepEqual(
      summariseQualityObservations(example.observations, example.threshold),
      legacySummariseQualityObservations(example.observations, example.threshold),
      `The current summary must preserve the observed legacy contract for ${example.name}.`,
    );
  }
});
