import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('authenticated state can be reused in a new browser context', async ({ workspace, request, browser, baseURL }) => {
  expect((await request.post(`${workspace.api}/login`, { data: credentials })).ok()).toBe(true);
  const context = await browser.newContext({ baseURL, storageState: await request.storageState() });
  try {
    const page = await context.newPage(); await page.goto(workspace.url);
    await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeHidden();
  } finally { await context.close(); }
});
test('a fresh context does not inherit another context authentication', async ({ workspace, request, browser, baseURL }) => {
  await request.post(`${workspace.api}/login`, { data: credentials });
  const context = await browser.newContext({ baseURL });
  try {
    const page = await context.newPage(); await page.goto(workspace.url);
    await expect(page.getByRole('button', { name: 'Sign in', exact: true })).toBeVisible();
    await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeHidden();
  } finally { await context.close(); }
});
