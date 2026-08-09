import type { QualityEvidenceSummary, QualityReport, QualityToolConfig } from "./models.js";

export function createQualityReport(
  config: Pick<QualityToolConfig, "environment" | "slowResponseThresholdMs">,
  summary: QualityEvidenceSummary,
): QualityReport {
  return {
    environment: config.environment,
    slowResponseThresholdMs: config.slowResponseThresholdMs,
    summary,
  };
}

export function formatQualityReport(report: QualityReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}
