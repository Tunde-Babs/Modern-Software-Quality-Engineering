import { defineConfig, devices } from '@playwright/test';

// Manual practice uses 4178; tests own a separate server and browser state.
const port = Number(process.env.ATLAS_PORT ?? 4180);
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 2,
  timeout: 15_000,
  expect: { timeout: 5_000 },
  snapshotPathTemplate: '{testDir}/visual/{arg}{ext}',
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    ...devices['Desktop Chrome'],
    // Default: Playwright's bundled Chromium. Optional: installed Google Chrome.
    ...(process.env.ATLAS_BROWSER_CHANNEL ? { channel: process.env.ATLAS_BROWSER_CHANNEL } : {}),
  },
  webServer: {
    command: 'node server.mjs',
    url: baseURL,
    env: { ATLAS_PORT: String(port) },
    reuseExistingServer: false,
    timeout: 10_000,
  },
  projects: [
    { name: 'learner', testMatch: 'exercises/**/*.spec.ts' },
    { name: 'solutions', testMatch: 'solutions/**/*.spec.ts' },
    { name: 'simulator', testMatch: 'checks/**/*.spec.ts' },
    { name: 'firefox-learner', testMatch: 'exercises/18-browser-projects.spec.ts', use: { ...devices['Desktop Firefox'], channel: undefined } },
    { name: 'firefox-solutions', testMatch: 'solutions/18-browser-projects.spec.ts', use: { ...devices['Desktop Firefox'], channel: undefined } },
  ],
});
