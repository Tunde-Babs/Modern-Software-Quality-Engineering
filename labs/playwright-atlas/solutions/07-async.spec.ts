import { test, expect } from '@playwright/test';

test('waits for a slow catalog through visible completion', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  await page.getByText('Practice controls', { exact: true }).click();
  await page.getByLabel('Catalog delay', { exact: true }).selectOption('1600');
  const reload = page.getByRole('button', { name: 'Reload products', exact: true });
  await reload.click();
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Loading products…');
  await expect(reload).toBeDisabled();
  await expect(page.getByRole('group', { name: 'Product results' })).toHaveAttribute('aria-busy', 'true');
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Products ready.');
  await expect(reload).toBeEnabled();
  await expect(page.getByRole('article')).toHaveCount(4);
  await page.getByRole('article', { name: 'Trail Mug', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
});

test('reports delayed catalog failure and allows recovery', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  await page.getByText('Practice controls', { exact: true }).click();
  await page.getByLabel('Scenario', { exact: true }).selectOption('catalog-unavailable');
  await page.getByLabel('Catalog delay', { exact: true }).selectOption('800');
  await page.getByRole('button', { name: 'Reload products', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Products unavailable.');
  await expect(page.getByRole('alert').filter({ hasText: 'Products could not be loaded.' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(0);
  await page.getByLabel('Scenario', { exact: true }).selectOption('normal');
  await page.getByRole('button', { name: 'Reload products', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Catalog status' })).toHaveText('Products ready.');
  await expect(page.getByRole('alert').filter({ hasText: 'Products could not be loaded.' })).toBeHidden();
  await expect(page.getByRole('article')).toHaveCount(4);
});
