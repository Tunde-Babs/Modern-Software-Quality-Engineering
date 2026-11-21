import { test, expect } from '@playwright/test';

test('accepts the demo account', async ({ page }) => {
  await page.goto('/');
  // Follow lessons/01-login.md. Replace this error with actions and assertions.
  throw new Error('TODO: implement this lab before claiming it passes.');
});

test('rejects an incorrect password', async ({ page }) => {
  await page.goto('/');
  // Follow lessons/01-login.md. Replace this error with actions and assertions.
  throw new Error('TODO: implement this lab before claiming it passes.');
});
