import { test, expect } from '@playwright/test';

test('selects the mug despite repeated Add to cart names', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: 'Add to cart', exact: true })).toHaveCount(4);
  const mug = page.getByRole('article', { name: 'Trail Mug', exact: true });
  await mug.getByRole('button', { name: 'Add to cart', exact: true }).click();
  const cart = page.getByRole('region', { name: 'Your cart', exact: true });
  await expect(cart.getByRole('listitem', { name: 'Trail Mug', exact: true })).toHaveText(/Trail Mug × 1 — €15.00/);
  await expect(cart.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
});

test('a named locator finds the same product after the catalog changes', async ({ page }) => {
  await page.goto('/');
  const mug = page.getByRole('article', { name: 'Trail Mug', exact: true });
  await expect(page.getByRole('article')).toHaveCount(4);
  await page.getByRole('searchbox').fill('notebook');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(mug).toHaveCount(0);
  await page.getByRole('searchbox').fill('');
  await mug.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
  await page.getByRole('region', { name: 'Your cart', exact: true }).getByRole('button', { name: 'Remove Trail Mug', exact: true }).click();
  await expect(page.getByLabel('Cart quantity', { exact: true })).toHaveText('0');
});
