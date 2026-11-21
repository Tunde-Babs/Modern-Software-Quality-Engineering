import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('a fixture owns an isolated shop and cleans up its workspace', async ({ shop, workspace, request }) => {
  await addProduct(shop);
  await expectTotal(shop, '€15.00');
  expect((await (await request.get(`${workspace.api}/state`)).json()).cart).toEqual({ mug: 1 });
});
test('a separate fixture starts with an empty cart', async ({ shop }) => {
  await expectTotal(shop, '€0.00');
  await expect(shop.getByLabel('Cart quantity', { exact: true })).toHaveText('0');
});
