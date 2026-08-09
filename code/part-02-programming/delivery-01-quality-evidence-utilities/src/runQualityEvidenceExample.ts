import { parseApiExecutionResults, summariseExecutionResults } from "./qualityEvidence.js";

const rawExecutionResults: unknown = [
  {
    executionId: "staging-orders-001",
    endpoint: "POST /orders",
    statusCode: 201,
    responseTimeMs: 185,
    environment: "staging",
    timestamp: "2026-08-08T09:00:00Z",
    validationPassed: true,
  },
  {
    executionId: "staging-orders-002",
    endpoint: "POST /orders",
    statusCode: 503,
    responseTimeMs: 1_240,
    environment: "staging",
    timestamp: "2026-08-08T09:01:00Z",
    validationPassed: false,
  },
  {
    executionId: "test-catalogue-003",
    endpoint: "GET /catalogue",
    statusCode: 200,
    responseTimeMs: 810,
    environment: "test",
    timestamp: "2026-08-08T09:02:00Z",
    validationPassed: true,
  },
  {
    executionId: "staging-orders-002",
    endpoint: "POST /orders",
    statusCode: 503,
    responseTimeMs: 1_240,
    environment: "staging",
    timestamp: "2026-08-08T09:01:00Z",
    validationPassed: false,
  },
];

const results = parseApiExecutionResults(rawExecutionResults);
const summary = summariseExecutionResults(results, 750);

console.log(JSON.stringify(summary, null, 2));
