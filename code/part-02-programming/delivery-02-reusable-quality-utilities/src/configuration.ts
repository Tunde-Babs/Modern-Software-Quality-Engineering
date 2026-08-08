import type { QualityEnvironment, QualityToolConfig } from "./models.js";

type EnvironmentSource = Readonly<Record<string, string | undefined>>;

const qualityEnvironments = new Set<QualityEnvironment>(["development", "test", "staging"]);
const defaultSlowResponseThresholdMs = 750;
const defaultOutputPath = ".build/quality-summary.json";

function readRequiredText(environment: EnvironmentSource, key: string): string {
  const value = environment[key]?.trim();
  if (!value) {
    throw new Error(`Missing required configuration value: ${key}.`);
  }

  return value;
}

function readQualityEnvironment(environment: EnvironmentSource): QualityEnvironment {
  const value = readRequiredText(environment, "QE_ENVIRONMENT");
  if (!qualityEnvironments.has(value as QualityEnvironment)) {
    throw new Error(`QE_ENVIRONMENT must be development, test, or staging; received ${value}.`);
  }

  return value as QualityEnvironment;
}

function readNonNegativeFiniteNumber(
  environment: EnvironmentSource,
  key: string,
  fallback: number,
): number {
  const externalValue = environment[key];
  if (externalValue === undefined) {
    return fallback;
  }

  const value = externalValue.trim();
  if (!value) {
    throw new Error(`${key} must not be blank when supplied.`);
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) {
    throw new Error(`${key} must be a non-negative finite number; received ${value}.`);
  }

  return parsed;
}

/**
 * Converts external string values into a trusted internal configuration. The
 * caller supplies the environment source so this module never reaches into
 * process.env itself.
 */
export function loadQualityToolConfig(environment: EnvironmentSource): QualityToolConfig {
  return {
    environment: readQualityEnvironment(environment),
    slowResponseThresholdMs: readNonNegativeFiniteNumber(
      environment,
      "QE_SLOW_RESPONSE_THRESHOLD_MS",
      defaultSlowResponseThresholdMs,
    ),
    inputPath: readRequiredText(environment, "QE_INPUT_PATH"),
    outputPath: environment.QE_OUTPUT_PATH?.trim() || defaultOutputPath,
  };
}
