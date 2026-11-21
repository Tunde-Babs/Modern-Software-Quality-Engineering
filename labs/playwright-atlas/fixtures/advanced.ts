import { test as base, expect } from './atlas.js';
import type { APIRequestContext, Page } from '@playwright/test';

type Product = 'notebook' | 'lamp';
type TestFixtures = { preferredProduct: Product; seededShop: Page; fixtureEvidence: void };
type WorkerFixtures = { workerApi: APIRequestContext };
export const test = base.extend<TestFixtures, WorkerFixtures>({
  preferredProduct: ['notebook', { option: true }],
  workerApi: [async ({ playwright }, use, workerInfo) => {
    const api = await playwright.request.newContext({ baseURL: String(workerInfo.project.use.baseURL) });
    try { await use(api); }
    finally { await api.dispose(); }
  }, { scope: 'worker' }],
  seededShop: async ({ shop, workspace, workerApi, preferredProduct }, use) => {
    // Shared transport, test-owned mutable data: never a shared global cart.
    const response = await workerApi.post(`${workspace.api}/cart`, { data: { productId: preferredProduct, quantity: 1 } });
    expect(response.ok()).toBe(true);
    await shop.reload();
    await use(shop);
  },
  fixtureEvidence: [async ({ workspace, preferredProduct }, use, testInfo) => {
    try { await use(undefined); }
    finally {
      await testInfo.attach('fixture-scope', {
        body: JSON.stringify({ workspace: workspace.id, product: preferredProduct, workerIndex: testInfo.workerIndex, status: testInfo.status }),
        contentType: 'application/json',
      });
    }
  }, { auto: true }],
});
export { expect };
