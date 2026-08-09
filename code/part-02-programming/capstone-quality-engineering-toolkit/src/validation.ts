import { ToolkitError } from "./errors.js";
import type { ExecutionOutcome, ExecutionRecord, ToolkitConfig } from "./models.js";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requireString(record: UnknownRecord, property: string, operation: string, recordIndex?: number): string {
  const value = record[property];
  if (typeof value !== "string" || value.trim() === "") {
    throw new ToolkitError(
      "invalid-input",
      `${property} must be a non-empty string.`,
      { operation, recordIndex, expected: `${property}: non-empty string` },
    );
  }

  return value;
}

function requireFiniteNumber(
  record: UnknownRecord,
  property: string,
  operation: string,
  recordIndex?: number,
): number {
  const value = record[property];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new ToolkitError(
      "invalid-input",
      `${property} must be a finite number.`,
      { operation, recordIndex, expected: `${property}: finite number` },
    );
  }

  return value;
}

function requireNonNegativeNumber(
  record: UnknownRecord,
  property: string,
  operation: string,
  recordIndex?: number,
): number {
  const value = requireFiniteNumber(record, property, operation, recordIndex);
  if (value < 0) {
    throw new ToolkitError(
      "invalid-input",
      `${property} must be a non-negative finite number.`,
      { operation, recordIndex, expected: `${property}: non-negative finite number` },
    );
  }

  return value;
}

function requirePositiveNumber(
  record: UnknownRecord,
  property: string,
  operation: string,
  recordIndex?: number,
): number {
  const value = requireFiniteNumber(record, property, operation, recordIndex);
  if (value <= 0) {
    throw new ToolkitError(
      "invalid-input",
      `${property} must be a positive finite number.`,
      { operation, recordIndex, expected: `${property}: positive finite number` },
    );
  }

  return value;
}

const iso8601UtcTimestampPattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

function requireIso8601UtcTimestamp(
  record: UnknownRecord,
  property: string,
  operation: string,
  recordIndex: number,
): string {
  const timestamp = requireString(record, property, operation, recordIndex);
  const parsedTimestampMs = Date.parse(timestamp);

  if (
    !iso8601UtcTimestampPattern.test(timestamp) ||
    Number.isNaN(parsedTimestampMs) ||
    new Date(parsedTimestampMs).toISOString() !== timestamp
  ) {
    throw new ToolkitError(
      "invalid-input",
      `${property} must be an ISO 8601 UTC timestamp in YYYY-MM-DDTHH:mm:ss.sssZ form.`,
      {
        operation,
        recordIndex,
        expected: `${property}: ISO 8601 UTC timestamp (YYYY-MM-DDTHH:mm:ss.sssZ)`,
      },
    );
  }

  return timestamp;
}

function requirePositiveInteger(record: UnknownRecord, property: string, operation: string): number {
  const value = record[property];
  if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
    throw new ToolkitError(
      "invalid-input",
      `${property} must be an integer of at least 1.`,
      { operation, expected: `${property}: integer >= 1` },
    );
  }

  return value;
}

export function parseJsonAsUnknown(text: string, sourceName: string): unknown {
  try {
    return JSON.parse(text) as unknown;
  } catch (error: unknown) {
    throw new ToolkitError(
      "invalid-input",
      `${sourceName} contains malformed JSON.`,
      { operation: "parse-json", expected: "valid JSON" },
      error,
    );
  }
}

export function validateToolkitConfig(value: unknown): ToolkitConfig {
  const operation = "validate-configuration";
  if (!isRecord(value)) {
    throw new ToolkitError("invalid-input", "Configuration must be a JSON object.", {
      operation,
      expected: "JSON object",
    });
  }

  return {
    environment: requireString(value, "environment", operation).trim().toLowerCase(),
    inputPath: requireString(value, "inputPath", operation),
    outputPath: requireString(value, "outputPath", operation),
    slowThresholdMs: requireNonNegativeNumber(value, "slowThresholdMs", operation),
    pollingTimeoutMs: requireNonNegativeNumber(value, "pollingTimeoutMs", operation),
    pollingIntervalMs: requirePositiveNumber(value, "pollingIntervalMs", operation),
    retryMaxAttempts: requirePositiveInteger(value, "retryMaxAttempts", operation),
    retryDelayMs: requireNonNegativeNumber(value, "retryDelayMs", operation),
  };
}

function validateOutcome(value: unknown, recordIndex: number): ExecutionOutcome {
  if (value === "passed" || value === "failed" || value === "skipped") {
    return value;
  }

  throw new ToolkitError(
    "invalid-input",
    "outcome must be passed, failed, or skipped.",
    { operation: "validate-execution-record", recordIndex, expected: "passed | failed | skipped" },
  );
}

export function validateExecutionRecord(value: unknown, recordIndex: number): ExecutionRecord {
  const operation = "validate-execution-record";
  if (!isRecord(value)) {
    throw new ToolkitError("invalid-input", "Each execution record must be a JSON object.", {
      operation,
      recordIndex,
      expected: "JSON object",
    });
  }

  const timestamp = requireIso8601UtcTimestamp(value, "timestamp", operation, recordIndex);

  const durationMs = requireFiniteNumber(value, "durationMs", operation, recordIndex);
  if (durationMs < 0) {
    throw new ToolkitError("invalid-input", "durationMs must be a non-negative finite number.", {
      operation,
      recordIndex,
      expected: "durationMs: non-negative finite number",
    });
  }

  const diagnosticCode = value.diagnosticCode;
  if (diagnosticCode !== undefined && (typeof diagnosticCode !== "string" || diagnosticCode.trim() === "")) {
    throw new ToolkitError("invalid-input", "diagnosticCode must be a non-empty string when present.", {
      operation,
      recordIndex,
      expected: "diagnosticCode: optional non-empty string",
    });
  }

  return {
    executionId: requireString(value, "executionId", operation, recordIndex),
    operation: requireString(value, "operation", operation, recordIndex),
    environment: requireString(value, "environment", operation, recordIndex),
    outcome: validateOutcome(value.outcome, recordIndex),
    durationMs,
    timestamp,
    ...(diagnosticCode === undefined ? {} : { diagnosticCode }),
  };
}

export function validateExecutionCollection(value: unknown): readonly ExecutionRecord[] {
  if (!Array.isArray(value)) {
    throw new ToolkitError("invalid-input", "Execution fixture must contain a JSON array.", {
      operation: "validate-execution-collection",
      expected: "JSON array",
    });
  }

  return value.map((record, index) => validateExecutionRecord(record, index));
}
