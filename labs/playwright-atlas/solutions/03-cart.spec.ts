import { test, expect } from '@playwright/test';

test('adds two backpacks and removes the line', async ({ page }) => {
  await page.goto('/');
  const backpack = page.getByRole('article', { name: 'Atlas Backpack', exact: true });
  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByLabel('Cart quantity', { exact: true })).toHaveText('2');
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€98.00');
  await page.getByRole('button', { name: 'Remove Atlas Backpack', exact: true }).click();
  await expect(page.getByText('Your cart is empty.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Cart quantity', { exact: true })).toHaveText('0');
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€0.00');
});

test('combines different products', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Atlas Backpack', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('article', { name: 'Trail Mug', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  await expect(page.getByLabel('Cart quantity', { exact: true })).toHaveText('2');
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€64.00');
});
