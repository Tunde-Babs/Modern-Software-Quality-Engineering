import { test, expect } from '@playwright/test';

// Guided Lab 1 example. Try the lesson's variation yourself after this run.
test('accepts the demo account', async ({ page }) => {
  // Arrange: open a fresh page and find inputs through their visible labels.
  await page.goto('/');
  await page.getByLabel('Email', { exact: true }).fill('learner@atlas.test');
  await page.getByLabel('Password', { exact: true }).fill('AtlasPractice123!');

  // Act: perform the same sign-in action you tried manually.
  await page.getByRole('button', { name: 'Sign in', exact: true }).click();

  // Assert: checking the resulting state is what makes this a test.
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
