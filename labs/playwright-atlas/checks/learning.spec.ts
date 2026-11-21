import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';

const labNav = (page: import('@playwright/test').Page) => page.getByRole('navigation', { name: 'Lab navigation' });

test('opens the canonical login brief, progressive hints and the implementation command', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Start Lab 1 →', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lab 1 — Sign in and understand an assertion');
  await expect(page.getByRole('article', { name: 'Lesson guide' })).toContainText('Briefly change the successful expectation');
  await expect(page.locator('#exercise-file')).toHaveText('exercises/01-login.spec.ts');
  await expect(page.locator('#run-command')).toHaveText('npm test -- 01-login --headed');
  const hint = page.getByText('Hint 1 — choosing the tool', { exact: true });
  await hint.click();
  await expect(page.getByText("Find inputs with", { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Copy command', exact: true }).click();
  await expect(page.locator('#interaction-status')).toContainText(/Command copied|Copy this command/);
});

test('all seven lessons and supporting guides are reachable with correct commands', async ({ page }) => {
  await page.goto('/learn');
  await expect(labNav(page).locator('.lab-link')).toHaveCount(7);
  const ids = ['01-login', '02-search', '03-cart', '04-navigation', '05-validation', '06-locators', '07-async'];
  for (const [index, id] of ids.entries()) {
    await labNav(page).locator(`a[href="#${id}"]`).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(`Lab ${index + 1} —`);
    await expect(page.locator('#lesson-content')).toHaveAttribute('aria-busy', 'false');
    await expect(page.locator('#lesson-content').getByRole('heading', { name: 'Tasks', exact: true })).toBeVisible();
    await expect(page.locator('#run-command')).toHaveText(`npm test -- ${id} --headed`);
  }
  await page.getByRole('link', { name: 'Next: learning roadmap →', exact: true }).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('The learning roadmap');
  await expect(page.getByRole('heading', { name: 'Your implementation', exact: true })).toBeHidden();
  await labNav(page).getByRole('link', { name: '00 TypeScript bridge', exact: true }).click();
  await expect(page.locator('#lesson-content')).toContainText('No programming experience is assumed.');
  await page.getByRole('link', { name: 'Setup & troubleshooting', exact: true }).click();
  await expect(page.locator('#lesson-content')).toContainText('npm ci');
  await expect(page.locator('#lesson-content').getByRole('table').first()).toBeVisible();
});

test('notes and reported practice persist independently across labs and reloads', async ({ page }) => {
  await page.goto('/learn#01-login');
  await expect(page.locator('#exercise-file')).toHaveText('exercises/01-login.spec.ts');
  await page.getByLabel('What happened, and what remains unknown?', { exact: true }).fill('My variation rejected an unknown email; real authentication is untested.');
  await page.getByLabel('Your reported stage', { exact: true }).selectOption('practised');
  await expect(page.locator('#progress-count')).toHaveText('1 / 7');
  await labNav(page).locator('a[href="#02-search"]').click();
  await expect(page.getByLabel('Your reported stage', { exact: true })).toHaveValue('not-started');
  await expect(page.getByLabel('What happened, and what remains unknown?', { exact: true })).toHaveValue('');
  await page.reload();
  await labNav(page).locator('a[href="#01-login"]').click();
  await expect(page.getByLabel('What happened, and what remains unknown?', { exact: true })).toHaveValue(/unknown email/);
  await expect(page.getByLabel('Your reported stage', { exact: true })).toHaveValue('practised');
  await expect(page.getByText('Saved in this browser. Self-reported, not a test result.', { exact: true })).toBeVisible();
  await page.getByLabel('Your reported stage', { exact: true }).selectOption('in-progress');
  await expect(page.locator('#progress-count')).toHaveText('0 / 7');
});

test('source views are read-only and worked solutions load only after requesting them', async ({ page }) => {
  const solutions: string[] = [];
  page.on('request', request => { if (request.url().includes('/learning/solutions/')) solutions.push(request.url()); });
  await page.goto('/learn#01-login');
  await expect(page.locator('#lesson-content')).toHaveAttribute('aria-busy', 'false');
  expect(solutions).toEqual([]);
  await page.getByText('View starter / current exercise', { exact: true }).click();
  const source = await readFile(new URL('../exercises/01-login.spec.ts', import.meta.url), 'utf8');
  await expect(page.locator('#starter-code')).toHaveText(source);
  await page.getByRole('button', { name: 'Reveal worked solution', exact: true }).click();
  await expect(page.locator('#solution-code')).toContainText(".fill('learner@atlas.test')");
  expect(solutions).toHaveLength(1);
  await labNav(page).locator('a[href="#02-search"]').click();
  await expect(page.locator('#solution-panel')).toBeHidden();
  await expect(page.locator('#solution-code')).toHaveText('');
  expect(solutions).toHaveLength(1);
  await page.locator('#lesson-content').getByRole('link', { name: 'the solution', exact: true }).click();
  await expect(page.locator('#solution-code')).toContainText('spaceship');
  await page.reload();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lab 2 — Find products with stable locators');
  await expect(page.locator('#solution-code')).toContainText('spaceship');
});

test('corrupt or unavailable progress storage leaves the learning workflow usable', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('atlas-learning-progress-v1', '{invalid'));
  await page.goto('/learn#01-login');
  await expect(page.getByLabel('Your reported stage', { exact: true })).toHaveValue('not-started');
  await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('Storage blocked'); }; });
  await page.getByLabel('What happened, and what remains unknown?', { exact: true }).fill('Keep this note locally.');
  await expect(page.locator('#save-status')).toContainText('Browser storage unavailable');
  await labNav(page).locator('a[href="#02-search"]').click();
  await labNav(page).locator('a[href="#01-login"]').click();
  await expect(page.getByLabel('What happened, and what remains unknown?', { exact: true })).toHaveValue('Keep this note locally.');
});

test('lesson rendering treats unrecognised HTML as text and rejects executable links', async ({ page }) => {
  await page.route('**/learning/lessons/01-login.md', route => route.fulfill({
    contentType: 'text/plain',
    body: '# Fixture\n\n## Tasks\n\n<img src=x onerror="window.lessonInjected=true">\n\n[unsafe](javascript:alert)\n\n1. A safe task with `code`.\n',
  }));
  await page.goto('/learn#01-login');
  await expect(page.locator('#lesson-content')).toHaveAttribute('aria-busy', 'false');
  await expect(page.locator('#lesson-content')).toContainText('<img src=x');
  await expect(page.locator('#lesson-content img')).toHaveCount(0);
  await expect(page.locator('#lesson-content a')).toHaveCount(0);
  expect(await page.evaluate(() => Object.hasOwn(window, 'lessonInjected'))).toBe(false);
});

test('a failed guide load can recover by selecting the lesson again', async ({ page }) => {
  await page.route('**/learning/lessons/01-login.md', route => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/learn#01-login');
  await expect(page.getByRole('alert')).toContainText('This guide could not load');
  await expect(page.locator('#lesson-content')).toHaveAttribute('aria-busy', 'false');
  await page.unroute('**/learning/lessons/01-login.md');
  await labNav(page).locator('a[href="#02-search"]').click();
  await labNav(page).locator('a[href="#01-login"]').click();
  await expect(page.getByRole('alert')).toBeHidden();
  await expect(page.locator('#lesson-content')).toContainText('Briefly change the successful expectation');
});

test('a slow previous lesson cannot overwrite the newly selected guide', async ({ page }) => {
  let release!: () => void, started!: () => void, finished!: () => void;
  const gate = new Promise<void>(resolve => { release = resolve; });
  const observed = new Promise<void>(resolve => { started = resolve; });
  const done = new Promise<void>(resolve => { finished = resolve; });
  await page.route('**/learning/lessons/01-login.md', async route => {
    started(); await gate;
    try { await route.fulfill({ body: '## Tasks\n\nStale login fixture.' }); }
    catch { /* The superseded request may already be aborted. */ }
    finally { finished(); }
  });
  try {
    await page.goto('/learn#01-login');
    await observed;
    await labNav(page).locator('a[href="#02-search"]').click();
    await expect(page.locator('#lesson-content')).toContainText('BACKPACK');
    release(); await done;
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Lab 2 — Find products with stable locators');
    await expect(page.locator('#lesson-content')).not.toContainText('Stale login fixture');
  } finally { release(); }
});

test('learning workspace is readable on mobile and offers keyboard navigation', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/learn#01-login');
  await expect(page.locator('#lesson-content')).toHaveAttribute('aria-busy', 'false');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to lesson', exact: true })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
  await expect(page).toHaveURL(/#01-login$/);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  expect(errors).toEqual([]);
  await page.getByRole('heading', { level: 1 }).click();
  await page.screenshot({ path: 'artifacts/learning-mobile.png', fullPage: true });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.screenshot({ path: 'artifacts/learning-desktop.png', fullPage: true });
});

test('teaching routes expose only declared read-only content', async ({ request }) => {
  const manifest = await request.get('/learning/manifest.json');
  expect(manifest.ok()).toBe(true);
  expect((await manifest.json()).lessons).toHaveLength(7);
  for (const path of ['/learning/SCOPE.md', '/learning/../../AGENTS.md', '/learning/solutions/08-fixtures.spec.ts', '/server.mjs']) {
    expect((await request.get(path)).status()).toBe(404);
  }
  expect((await request.post('/learning/exercises/01-login.spec.ts', { data: 'replace' })).status()).toBe(405);
  expect((await request.head('/learn')).status()).toBe(200);
  expect((await request.get('/learning/exercises/01-login.spec.ts')).headers()['x-content-type-options']).toBe('nosniff');
});
