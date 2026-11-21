// Completed authored implementation for review; attempt an unseen variation independently.
import { test, expect } from '../fixtures/model-fixtures.js';
import { credentials } from '../fixtures/atlas.js';
import { ShopPage } from '../models/shop.page.js';

test('POM composes a catalog card and a cart component', async ({ shopModel }) => {
  await shopModel.search('mug');
  await shopModel.product('Trail Mug').addToCart();
  await expect(shopModel.cart.quantity).toHaveText('1');
  await expect(shopModel.cart.total).toHaveText('€15.00');
  await expect(shopModel.cart.line('Trail Mug')).toContainText('× 1');
});

test('the account component owns sign-in interactions', async ({ shopModel }) => {
  await shopModel.account.signIn(credentials.email, credentials.password);
  await expect(shopModel.account.welcome).toBeVisible();
  await expect(shopModel.account.error).toBeHidden();
});

test('the cart component removes its own product line', async ({ shopModel }) => {
  const mug = shopModel.product('Trail Mug');
  await mug.addToCart(); await mug.addToCart();
  await expect(shopModel.cart.total).toHaveText('€30.00');
  await shopModel.cart.remove('Trail Mug');
  await expect(shopModel.cart.quantity).toHaveText('0');
  await expect(shopModel.cart.total).toHaveText('€0.00');
});

test('two page-model instances keep component scope and server state separate', async ({ shopModel, browser, baseURL, request }) => {
  const response = await request.post('/api/workspaces', { data: { label: 'second-model-owner' } });
  expect(response.status()).toBe(201);
  const { id } = await response.json();
  const context = await browser.newContext({ baseURL });
  try {
    const other = new ShopPage(await context.newPage());
    await other.open(`/?workspace=${id}`);
    await shopModel.product('Trail Mug').addToCart();
    await other.product('Desk Lamp').addToCart();
    await expect(shopModel.cart.total).toHaveText('€15.00');
    await expect(other.cart.total).toHaveText('€35.00');
  } finally { await context.close(); await request.delete(`/api/workspaces/${id}`); }
});

test('sign-out through one component retains the cart owned by another', async ({ authenticatedShopModel: shop }) => {
  await expect(shop.account.welcome).toBeVisible();
  await shop.product('Field Notebook').addToCart();
  await expect(shop.cart.total).toHaveText('€9.00');
  await shop.account.signOut();
  await expect(shop.account.welcome).toBeHidden();
  await expect(shop.cart.total).toHaveText('€9.00');
});

test('a fixture injects the authenticated POM and its composed components', async ({ authenticatedShopModel: shop, workspace, request }) => {
  await expect(shop.account.welcome).toBeVisible();
  await shop.product('Atlas Backpack').addToCart();
  await expect(shop.cart.total).toHaveText('€49.00');
  expect((await (await request.get(`${workspace.api}/state`)).json()).cart).toEqual({ backpack: 1 });
});
