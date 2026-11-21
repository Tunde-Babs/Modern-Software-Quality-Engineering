// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('API setup prepares data while the UI supplies the observation', async ({ workspace, request, page }) => {
  expect((await request.post(`${workspace.api}/cart`, { data: { productId: 'lamp', quantity: 1 } })).ok()).toBe(true);
  expect((await request.post(`${workspace.api}/cart`, { data: { productId: 'notebook', quantity: 2 } })).ok()).toBe(true);
  await page.goto(workspace.url);
  await expectTotal(page, '€53.00');
  await expect(page.getByLabel('Cart quantity', { exact: true })).toHaveText('3');
});
test('invalid API setup is rejected without silently changing state', async ({ workspace, request }) => {
  const response = await request.post(`${workspace.api}/cart`, { data: { productId: 'mug', quantity: -1 } });
  expect(response.status()).toBe(400);
  expect((await (await request.get(`${workspace.api}/state`)).json()).cart).toEqual({});
});
