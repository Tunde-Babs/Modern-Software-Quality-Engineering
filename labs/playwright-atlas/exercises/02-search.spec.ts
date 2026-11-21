import { test, expect } from '@playwright/test';

// Guided Lab 2 example. Try another product/query without the answer key next.
test('finds only the matching product', async ({ page }) => {
  await page.goto('/');
  // Establish a loaded catalog before checking a filtered result.
  await expect(page.getByRole('article')).toHaveCount(4);

  await page.getByRole('searchbox', { name: 'Search products' }).fill('BACKPACK');

  // A count alone could pass while showing the wrong product.
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'Atlas Backpack', exact: true })).toBeVisible();
});

test('shows an empty search result', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);

  const search = page.getByRole('searchbox', { name: 'Search products' });
  await search.fill('spaceship');
  await expect(page.getByRole('article')).toHaveCount(0);
  await expect(page.getByText('No products found.', { exact: true })).toBeVisible();

  // Clearing the query should restore the catalog, not leave a stuck empty view.
  await search.fill('');
  await expect(page.getByRole('article')).toHaveCount(4);
  await expect(page.getByText('No products found.', { exact: true })).toBeHidden();
});
