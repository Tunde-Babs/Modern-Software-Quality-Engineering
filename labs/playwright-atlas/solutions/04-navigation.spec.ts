import { test, expect } from '@playwright/test';

test('navigates between shop sections using browser history', async ({ page }) => {
  await page.goto('/');
  const navigation = page.getByRole('navigation', { name: 'Shop sections' });
  await navigation.getByRole('link', { name: 'Account', exact: true }).click();
  await expect(page).toHaveURL(/#account-title$/);
  await expect(page.getByRole('heading', { name: 'Welcome back', exact: true })).toBeInViewport();
  await navigation.getByRole('link', { name: 'Cart', exact: true }).click();
  await expect(page).toHaveURL(/#cart-title$/);
  await expect(page.getByRole('heading', { name: 'Your cart', exact: true })).toBeInViewport();
  await page.goBack();
  await expect(page).toHaveURL(/#account-title$/);
  await page.goForward();
  await expect(page).toHaveURL(/#cart-title$/);
});

test('home restores the collection while preserving the cart', async ({ page, baseURL }) => {
  await page.goto('/');
  await page.getByRole('article', { name: 'Trail Mug', exact: true }).getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('searchbox').fill('mug');
  await expect(page.getByRole('article')).toHaveCount(1);
  await page.getByRole('navigation').getByRole('link', { name: 'Cart', exact: true }).click();
  await page.getByRole('link', { name: 'Atlas Commerce home', exact: true }).click();
  await expect(page).toHaveURL(`${baseURL}/`);
  await expect(page.getByRole('searchbox')).toHaveValue('');
  await expect(page.getByRole('article')).toHaveCount(4);
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€15.00');
});
