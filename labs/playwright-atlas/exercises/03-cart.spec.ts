import { test, expect } from '@playwright/test';

// Guided Lab 3 example. Calculate expected totals before observing the shop.
test('adds two backpacks and removes the line', async ({ page }) => {
  await page.goto('/');
  // Scope the repeated button name to the intended product.
  const backpack = page.getByRole('article', { name: 'Atlas Backpack', exact: true });
  await backpack.getByRole('button', { name: 'Add to cart', exact: true }).click();
  await backpack.getByRole('button', { name: 'Add to cart', exact: true }).click();

  // Independent expectation: two backpacks at €49 each cost €98.
  await expect(page.getByLabel('Cart quantity', { exact: true })).toHaveText('2');
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€98.00');

  // Remove deletes the whole line, including both units.
  await page.getByRole('button', { name: 'Remove Atlas Backpack', exact: true }).click();
  await expect(page.getByText('Your cart is empty.', { exact: true })).toBeVisible();
  await expect(page.getByLabel('Cart quantity', { exact: true })).toHaveText('0');
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€0.00');
});

test('combines different products', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Atlas Backpack', exact: true })
    .getByRole('button', { name: 'Add to cart', exact: true }).click();
  await page.getByRole('article', { name: 'Trail Mug', exact: true })
    .getByRole('button', { name: 'Add to cart', exact: true }).click();

  // Two different product lines, two units, €49 + €15 = €64.
  const cart = page.getByRole('region', { name: 'Your cart', exact: true });
  await expect(cart.getByRole('listitem')).toHaveCount(2);
  await expect(page.getByLabel('Cart quantity', { exact: true })).toHaveText('2');
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€64.00');
});
