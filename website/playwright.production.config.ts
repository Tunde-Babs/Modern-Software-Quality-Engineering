import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/production-browser', testMatch: 'production.spec.ts', workers: 1, timeout: 120000,
  reporter: [['list'], ['json', { outputFile: 'artifacts/production-browser-results.json' }]],
  outputDir: 'artifacts/production-browser-output',
  use: { baseURL: 'http://127.0.0.1:4325', channel: 'chrome', headless: true },
  webServer: { command: 'node tests/header-server.mjs', url: 'http://127.0.0.1:4325', reuseExistingServer: false },
});
