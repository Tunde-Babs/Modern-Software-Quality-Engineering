import type { QualityReport } from "./models.js";

/** Serialises a report deterministically for reviewable local evidence. */
export function formatReport(report: QualityReport): string {
  return `${JSON.stringify(report, null, 2)}\n`;
}
