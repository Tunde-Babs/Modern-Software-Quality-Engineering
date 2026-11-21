import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  timeout: 15_000,
  expect: { timeout: 5_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4178',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
    // Default: Playwright's bundled Chromium. Optional: installed Google Chrome.
    ...(process.env.ATLAS_BROWSER_CHANNEL ? { channel: process.env.ATLAS_BROWSER_CHANNEL } : {}),
  },
  webServer: {
    command: 'node server.mjs',
    url: 'http://127.0.0.1:4178',
    reuseExistingServer: false,
    timeout: 10_000,
  },
  projects: [
    { name: 'learner', testMatch: 'exercises/**/*.spec.ts' },
    { name: 'solutions', testMatch: 'solutions/**/*.spec.ts' },
    { name: 'simulator', testMatch: 'checks/**/*.spec.ts' },
  ],
});
