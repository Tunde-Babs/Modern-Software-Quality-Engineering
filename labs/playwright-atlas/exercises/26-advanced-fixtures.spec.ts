// Completed authored implementation for review; attempt an unseen variation independently.
import { test, expect } from '../fixtures/advanced.js';
import { addProduct } from '../fixtures/atlas.js';

test('test data is owned per test while the worker reuses its API transport', async ({ seededShop, workspace, workerApi, preferredProduct }) => {
  expect(preferredProduct).toBe('notebook');
  await expect(seededShop.getByLabel('Cart total', { exact: true })).toHaveText('€9.00');
  await addProduct(seededShop, 'Field Notebook');
  await expect(seededShop.getByLabel('Cart total', { exact: true })).toHaveText('€18.00');
  expect((await (await workerApi.get(`${workspace.api}/state`)).json()).cart).toEqual({ notebook: 2 });
});

test('another test starts from a fresh seeded workspace', async ({ seededShop, workspace, workerApi }) => {
  await expect(seededShop.getByLabel('Cart quantity', { exact: true })).toHaveText('1');
  expect((await (await workerApi.get(`${workspace.api}/state`)).json()).cart).toEqual({ notebook: 1 });
});

test.describe('override an option fixture', () => {
  test.use({ preferredProduct: 'lamp' });
  test('the dependent fixture uses the declared product option', async ({ seededShop, preferredProduct }) => {
    expect(preferredProduct).toBe('lamp');
    await expect(seededShop.getByLabel('Cart total', { exact: true })).toHaveText('€35.00');
    await expect(seededShop.getByRole('listitem', { name: 'Desk Lamp', exact: true })).toBeVisible();
  });
});

const filtered = test.extend({
  shop: async ({ shop }, use) => {
    await shop.getByRole('searchbox', { name: 'Search products' }).fill('BACKPACK');
    await use(shop);
  },
});
filtered('an inherited fixture can be overridden without duplicating its lifecycle', async ({ shop }) => {
  await expect(shop.getByRole('article')).toHaveCount(1);
  await expect(shop.getByRole('article', { name: 'Atlas Backpack', exact: true })).toBeVisible();
  // seededShop was not requested: its data mutation did not happen.
  await expect(shop.getByLabel('Cart total', { exact: true })).toHaveText('€0.00');
});
