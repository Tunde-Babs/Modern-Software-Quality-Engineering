import assert from "node:assert/strict";
import test from "node:test";

import { loadToolkitConfig } from "../src/configuration.js";
import { ToolkitError } from "../src/errors.js";
import { MemoryFileSystem } from "./support/memoryFileSystem.js";

const validConfiguration = JSON.stringify({
  environment: "Staging",
  inputPath: "fixtures/executions.json",
  outputPath: "output/report.json",
  slowThresholdMs: 500,
  pollingTimeoutMs: 100,
  pollingIntervalMs: 25,
  retryMaxAttempts: 2,
  retryDelayMs: 10,
});

test("loads a validated configuration and normalises its environment", async () => {
  const fileSystem = new MemoryFileSystem({ "config.json": validConfiguration });

  assert.deepEqual(await loadToolkitConfig("config.json", fileSystem), {
    environment: "staging",
    inputPath: "fixtures/executions.json",
    outputPath: "output/report.json",
    slowThresholdMs: 500,
    pollingTimeoutMs: 100,
    pollingIntervalMs: 25,
    retryMaxAttempts: 2,
    retryDelayMs: 10,
  });
});

test("rejects malformed configuration JSON with a controlled category", async () => {
  const fileSystem = new MemoryFileSystem({ "config.json": "{ not valid JSON" });

  await assert.rejects(loadToolkitConfig("config.json", fileSystem), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "invalid-input");
    assert.match(error.message, /malformed JSON/);
    return true;
  });
});

for (const invalidRetryAttempts of [0, 1.5, Number.NaN]) {
  test(`rejects retryMaxAttempts ${String(invalidRetryAttempts)}`, async () => {
    const config = JSON.parse(validConfiguration) as Record<string, unknown>;
    config.retryMaxAttempts = invalidRetryAttempts;
    const fileSystem = new MemoryFileSystem({ "config.json": JSON.stringify(config) });

    await assert.rejects(loadToolkitConfig("config.json", fileSystem), (error: unknown) => {
      assert.ok(error instanceof ToolkitError);
      assert.equal(error.kind, "invalid-input");
      assert.match(error.message, /retryMaxAttempts/);
      return true;
    });
  });
}

test("rejects a blank output path rather than relying on filesystem behaviour", async () => {
  const config = JSON.parse(validConfiguration) as Record<string, unknown>;
  config.outputPath = "   ";
  const fileSystem = new MemoryFileSystem({ "config.json": JSON.stringify(config) });

  await assert.rejects(loadToolkitConfig("config.json", fileSystem), (error: unknown) => {
    assert.ok(error instanceof ToolkitError);
    assert.equal(error.kind, "invalid-input");
    assert.match(error.message, /outputPath/);
    return true;
  });
});
