import { test as base, expect, type Page } from '@playwright/test';

type Workspace = { id: string; api: string; url: string };
export const credentials = { email: 'learner@atlas.test', password: 'AtlasPractice123!' };
export const test = base.extend<{ workspace: Workspace; shop: Page; authenticatedShop: Page }>({
  workspace: async ({ request }, use, testInfo) => {
    const response = await request.post('/api/workspaces', { data: { label: `${testInfo.parallelIndex}: ${testInfo.title}` } });
    expect(response.status()).toBe(201);
    const { id } = await response.json();
    const api = `/api/workspaces/${id}`;
    try { await use({ id, api, url: `/?workspace=${id}` }); }
    finally { expect((await request.delete(api)).status()).toBe(204); }
  },
  shop: async ({ page, workspace }, use) => {
    await page.goto(workspace.url);
    await expect(page.getByRole('article')).toHaveCount(4);
    await use(page);
  },
  authenticatedShop: async ({ page, workspace }, use) => {
    expect((await page.request.post(`${workspace.api}/login`, { data: credentials })).ok()).toBe(true);
    await page.goto(workspace.url);
    await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeVisible();
    await use(page);
  },
});
export { expect };
export async function addProduct(page: Page, name = 'Trail Mug') {
  await page.getByRole('article', { name, exact: true }).getByRole('button', { name: 'Add to cart', exact: true }).click();
}
export async function expectTotal(page: Page, total: string) {
  await expect(page.getByLabel('Cart total', { exact: true })).toHaveText(total);
}
