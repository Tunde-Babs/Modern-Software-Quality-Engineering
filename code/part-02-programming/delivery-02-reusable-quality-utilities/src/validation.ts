import type { QualityEnvironment, QualityExecutionResult } from "./models.js";

const qualityEnvironments = new Set<QualityEnvironment>(["development", "test", "staging"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readNonEmptyString(record: Record<string, unknown>, key: string): string {
  const value = record[key];
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Expected a non-empty string for ${key}.`);
  }

  return value;
}

function readFiniteNumber(record: Record<string, unknown>, key: string): number {
  const value = record[key];
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(`Expected a finite number for ${key}.`);
  }

  return value;
}

function readBoolean(record: Record<string, unknown>, key: string): boolean {
  const value = record[key];
  if (typeof value !== "boolean") {
    throw new Error(`Expected a boolean for ${key}.`);
  }

  return value;
}

function readQualityEnvironment(record: Record<string, unknown>): QualityEnvironment {
  const environment = readNonEmptyString(record, "environment").trim();
  if (!qualityEnvironments.has(environment as QualityEnvironment)) {
    throw new Error(`Unexpected environment: ${environment}.`);
  }

  return environment as QualityEnvironment;
}

/**
 * Converts one untrusted runtime value into the trusted model used by the
 * remaining modules. It does not parse JSON or read a file; those are outer
 * boundary responsibilities.
 */
export function parseQualityExecutionResult(input: unknown): QualityExecutionResult {
  if (!isRecord(input)) {
    throw new Error("Expected a quality execution result object.");
  }

  const result: QualityExecutionResult = {
    executionId: readNonEmptyString(input, "executionId"),
    endpoint: readNonEmptyString(input, "endpoint"),
    statusCode: readFiniteNumber(input, "statusCode"),
    responseTimeMs: readFiniteNumber(input, "responseTimeMs"),
    environment: readQualityEnvironment(input),
    validationPassed: readBoolean(input, "validationPassed"),
  };

  if (!Number.isInteger(result.statusCode) || result.statusCode < 100 || result.statusCode > 599) {
    throw new Error("statusCode must be an integer between 100 and 599.");
  }

  if (result.responseTimeMs < 0) {
    throw new Error("responseTimeMs cannot be negative.");
  }

  return result;
}

/**
 * Uses an all-or-nothing policy: one malformed record prevents the caller
 * from receiving a partial collection that might be mistaken for complete
 * evidence.
 */
export function parseQualityExecutionResults(input: unknown): QualityExecutionResult[] {
  if (!Array.isArray(input)) {
    throw new Error("Expected an array of quality execution results.");
  }

  return input.map((value, index) => {
    try {
      return parseQualityExecutionResult(value);
    } catch (error: unknown) {
      const reason = error instanceof Error ? error.message : "Unknown validation error.";
      throw new Error(`Invalid quality execution result at index ${index}: ${reason}`);
    }
  });
}
