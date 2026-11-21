import { test, expect } from '@playwright/test';

test('finds only the matching product', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  await page.getByRole('searchbox', { name: 'Search products' }).fill('BACKPACK');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'Atlas Backpack', exact: true })).toBeVisible();
});

test('shows an empty search result', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  await page.getByRole('searchbox', { name: 'Search products' }).fill('spaceship');
  await expect(page.getByText('No products found.', { exact: true })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(0);
});
