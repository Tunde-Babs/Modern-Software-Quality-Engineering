// Completed authored example for review; repeat with an independent variation.
import { test, expect } from '@playwright/test';

test('requires an email before accepting a sign-in', async ({ page }) => {
  await page.goto('/');
  const email = page.getByLabel('Email', { exact: true });
  await page.getByLabel('Password', { exact: true }).fill('AtlasPractice123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true);
  await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeHidden();
  await email.fill('learner@atlas.test');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeVisible();
});

test('rejects malformed email before checking credentials', async ({ page }) => {
  await page.goto('/');
  const email = page.getByLabel('Email', { exact: true });
  await email.fill('not-an-email');
  await page.getByLabel('Password', { exact: true }).fill('AtlasPractice123!');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.typeMismatch)).toBe(true);
  await expect(page.getByRole('alert').filter({ hasText: 'Email or password is incorrect.' })).toBeHidden();
  await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeHidden();
  await email.fill('unknown@atlas.test');
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();
  expect(await email.evaluate((input: HTMLInputElement) => input.validity.valid)).toBe(true);
  await expect(page.getByRole('alert').filter({ hasText: 'Email or password is incorrect.' })).toBeVisible();
});
