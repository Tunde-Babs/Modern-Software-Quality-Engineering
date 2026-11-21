import { test as base, credentials } from './atlas.js';
import { ShopPage } from '../models/shop.page.js';

// Fixtures own lifecycle; models own interactions. Neither calculates expected totals.
export const test = base.extend<{ shopModel: ShopPage; authenticatedShopModel: ShopPage }>({
  shopModel: async ({ page, workspace }, use) => {
    const shop = new ShopPage(page);
    await shop.open(workspace.url);
    await use(shop);
  },
  authenticatedShopModel: async ({ page, workspace }, use) => {
    const response = await page.request.post(`${workspace.api}/login`, { data: credentials });
    if (!response.ok()) throw new Error('Model fixture sign-in failed');
    const shop = new ShopPage(page);
    await shop.open(workspace.url);
    await use(shop);
  },
});
export { expect } from '@playwright/test';
