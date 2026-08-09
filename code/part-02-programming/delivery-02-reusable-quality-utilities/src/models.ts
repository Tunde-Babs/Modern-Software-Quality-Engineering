export type QualityEnvironment = "development" | "test" | "staging";

export interface QualityExecutionResult {
  executionId: string;
  endpoint: string;
  statusCode: number;
  responseTimeMs: number;
  environment: QualityEnvironment;
  validationPassed: boolean;
}

export interface QualityToolConfig {
  environment: QualityEnvironment;
  slowResponseThresholdMs: number;
  inputPath: string;
  outputPath: string;
}

export interface QualityEvidenceSummary {
  executionCount: number;
  failedExecutionCount: number;
  slowExecutionCount: number;
  failureCountByEndpoint: Record<string, number>;
  slowEndpoints: string[];
}

export interface QualityReport {
  environment: QualityEnvironment;
  slowResponseThresholdMs: number;
  summary: QualityEvidenceSummary;
}
