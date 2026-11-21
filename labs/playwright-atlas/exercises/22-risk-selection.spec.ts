// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('@critical purchase feedback confirms the intended order total', async ({ authenticatedShop: page, workspace, request }) => {
  await addProduct(page, 'Atlas Backpack'); await expectTotal(page, '€49.00');
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('Order confirmed.');
  const orders = await (await request.get(`${workspace.api}/orders`)).json();
  expect(orders).toHaveLength(1); expect(orders[0].totalCents).toBe(4900);
});
test('@negative a decline never creates a confirmed order', async ({ authenticatedShop: page, workspace, request }) => {
  await addProduct(page); await request.post(`${workspace.api}/faults`, { data: { checkout: 'declined' } });
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Practice payment declined.' })).toBeVisible();
  expect(await (await request.get(`${workspace.api}/orders`)).json()).toEqual([]);
});
