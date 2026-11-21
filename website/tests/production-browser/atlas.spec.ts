import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('integrated bench loads all guides and advanced sources under production headers', async ({ page }) => {
  const errors: string[] = [], violations: string[] = [], requests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => requests.push(request.url()));
  await page.addInitScript(() => {
    document.addEventListener('securitypolicyviolation', event => { console.error(`CSP: ${event.blockedURI}`); });
  });
  page.on('console', message => { if (message.text().startsWith('CSP:')) violations.push(message.text()); });
  await page.goto('/labs/playwright/');
  await page.getByRole('link', { name: 'Open the lab bench', exact: true }).click();
  await expect(page.locator('#lesson-title')).toContainText('Lab 1');
  await expect(page.locator('[data-lesson]')).toHaveCount(27);
  for (let number = 1; number <= 27; number++) {
    const link = page.locator('[data-lesson]').nth(number - 1);
    await link.evaluate(node => (node.closest('details') as HTMLDetailsElement).open = true);
    await link.click();
    await expect(page.locator('#lesson-title')).toContainText(`Lab ${number} —`);
    await expect(page.locator('#lesson-content')).toHaveAttribute('aria-busy', 'false');
    await expect(page.locator('#workspace-error')).toBeHidden();
  }
  await page.getByRole('button', { name: 'Reveal worked solution' }).click();
  await expect(page.locator('#solution-code')).toContainText('shop');
  await expect(page.locator('#advanced-tools')).toContainText('Advanced API scenarios run on your local simulator');
  await expect(page.locator('#create-practice')).toHaveCount(0);
  await page.screenshot({ path: 'artifacts/atlas-bench-desktop.png' });
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  expect(violations).toEqual([]);
  expect(requests.every(url => url.startsWith('http://127.0.0.1:4325/'))).toBeTruthy();
  expect(requests.some(url => url.includes('/api/'))).toBeFalsy();
  await page.screenshot({ path: 'artifacts/atlas-bench-mobile.png' });
});

test('published browser shop supports sign-in, search and cart without public APIs', async ({ page }) => {
  const errors: string[] = [], apiRequests: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('request', request => { if (request.url().includes('/api/')) apiRequests.push(request.url()); });
  // A workspace query must never enable the unpublished server-backed path.
  await page.goto('/labs/playwright/shop/?workspace=untrusted');
  await page.getByLabel('Email', { exact: true }).fill('learner@atlas.test');
  await page.getByLabel('Password', { exact: true }).fill('AtlasPractice123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.locator('#welcome')).toHaveText('Welcome, Alex!');
  await page.getByLabel('Search products').fill('mug');
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
  await page.reload();
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
  await expect(page.locator('#checkout-panel')).toBeHidden();
  await page.setViewportSize({ width: 375, height: 812 });
  expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth)).toBeLessThanOrEqual(1);
  expect((await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()).violations).toEqual([]);
  expect(errors).toEqual([]);
  expect(apiRequests).toEqual([]);
  await page.screenshot({ path: 'artifacts/atlas-shop-mobile.png' });
});
