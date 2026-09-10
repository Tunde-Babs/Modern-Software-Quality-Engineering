import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', workers: 1, timeout: 120000,
  reporter: [['list'], ['json', { outputFile: 'artifacts/browser-results.json' }]],
  outputDir: 'artifacts/browser-output',
  use: { baseURL: 'http://127.0.0.1:4324', channel: 'chrome', headless: true },
  webServer: { command: 'python3 -m http.server 4324 --bind 127.0.0.1 --directory dist', url: 'http://127.0.0.1:4324', reuseExistingServer: true },
});
