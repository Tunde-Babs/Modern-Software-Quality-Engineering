import { test, expect } from '@playwright/test';

test('reset clears account, cart, query and active fault', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('learner@atlas.test');
  await page.getByLabel('Password', { exact: true }).fill('AtlasPractice123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.getByRole('article', { name: 'Trail Mug', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('searchbox').fill('mug');
  await page.getByText('Practice controls', { exact: true }).click();
  await page.getByLabel('Scenario', { exact: true }).selectOption('cart-total-bug');
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€20.00');
  await page.getByRole('button', { name: 'Reset practice' }).click();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(4);
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await expect(page.getByLabel('Scenario', { exact: true })).toHaveValue('normal');
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€0.00');
  await page.reload();
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€0.00');
});

test('sign-in service failure does not create a signed-in account', async ({ page }) => {
  await page.goto('/');
  await page.getByText('Practice controls', { exact: true }).click();
  await page.getByLabel('Scenario', { exact: true }).selectOption('login-unavailable');
  await page.getByLabel('Email', { exact: true }).fill('learner@atlas.test');
  await page.getByLabel('Password', { exact: true }).fill('AtlasPractice123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Sign-in is temporarily unavailable.' })).toBeVisible();
  await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeHidden();
});

test('cart persists through reload and sign-out clears the account', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Trail Mug', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  await page.getByLabel('Email', { exact: true }).fill('learner@atlas.test');
  await page.getByLabel('Password', { exact: true }).fill('AtlasPractice123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await page.reload();
  await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
  await page.getByRole('button', { name: 'Sign out', exact: true }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
});

test('separate browser contexts have independent carts', async ({ page, browser, baseURL }) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Trail Mug', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  const other = await browser.newContext();
  try {
    const otherPage = await other.newPage();
    await otherPage.goto(baseURL!);
    await expect(otherPage.getByRole('article')).toHaveCount(4);
    await expect(otherPage.getByLabel('Cart total', { exact: true })).toHaveText('€0.00');
    await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
  } finally { await other.close(); }
});

test('catalog failure shows an actionable error', async ({ page }) => {
  await page.route('**/products.json', (route) => route.fulfill({ status: 503, body: 'Unavailable' }));
  await page.goto('/');
  await expect(page.getByRole('alert').filter({ hasText: 'Products could not be loaded.' })).toBeVisible();
});

test('search can be cleared without changing cart contents', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Trail Mug', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('searchbox').fill('unknown');
  await expect(page.getByRole('article')).toHaveCount(0);
  await page.getByRole('searchbox').fill('');
  await expect(page.getByRole('article')).toHaveCount(4);
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
});

test('shop fits a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.screenshot({ path: 'artifacts/atlas-mobile.png', fullPage: true });
});

test('desktop shop renders without browser errors', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  expect(errors).toEqual([]);
  await page.screenshot({ path: 'artifacts/atlas-desktop.png', fullPage: true });
});

test('reset cancels a pending delayed failure and restores controls', async ({ page }) => {
  await page.clock.install();
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  await page.getByText('Practice controls', { exact: true }).click();
  await page.getByLabel('Scenario', { exact: true }).selectOption('catalog-unavailable');
  await page.getByLabel('Catalog delay', { exact: true }).selectOption('1600');
  await page.getByRole('button', { name: 'Reload products', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Loading products…');
  await page.getByRole('button', { name: 'Reset practice' }).click();
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Products ready.');
  await page.clock.fastForward(2000);
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Products ready.');
  await expect(page.getByRole('article')).toHaveCount(4);
  await expect(page.getByLabel('Catalog delay', { exact: true })).toHaveValue('0');
  await expect(page.getByLabel('Scenario', { exact: true })).toHaveValue('normal');
  await expect(page.getByRole('alert').filter({ hasText: 'Products could not be loaded.' })).toBeHidden();
});

test('a delayed reload applies the latest query and keeps the cart', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Atlas Backpack', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  await page.getByText('Practice controls', { exact: true }).click();
  await page.getByLabel('Catalog delay', { exact: true }).selectOption('800');
  await page.getByRole('button', { name: 'Reload products', exact: true }).click();
  await page.getByRole('searchbox').fill('mug');
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Products ready.');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'Trail Mug', exact: true })).toBeVisible();
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€49.00');
});

test('search cannot restore stale cards after a catalog failure', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  await page.getByText('Practice controls', { exact: true }).click();
  await page.getByLabel('Scenario', { exact: true }).selectOption('catalog-unavailable');
  await page.getByRole('button', { name: 'Reload products', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Products unavailable.');
  await page.getByRole('searchbox').fill('mug');
  await expect(page.getByRole('article')).toHaveCount(0);
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Products unavailable.');
});
