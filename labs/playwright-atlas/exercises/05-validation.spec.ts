import { test, expect } from '@playwright/test';

test('requires an email before accepting a sign-in', async ({ page }) => {
  await page.goto('/');
  // Follow lessons/05-validation.md. Replace this error with your actions and assertions.
  throw new Error('TODO: implement this lab before claiming it passes.');
});

test('rejects malformed email before checking credentials', async ({ page }) => {
  await page.goto('/');
  // Follow lessons/05-validation.md. Replace this error with your actions and assertions.
  throw new Error('TODO: implement this lab before claiming it passes.');
});
