import { test, expect } from '@playwright/test';

test('accepts the demo account', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('learner@atlas.test');
  await page.getByLabel('Password', { exact: true }).fill('AtlasPractice123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeHidden();
});

test('rejects an incorrect password', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('learner@atlas.test');
  await page.getByLabel('Password', { exact: true }).fill('incorrect-password');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Email or password is incorrect.' })).toBeVisible();
  await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeHidden();
});
