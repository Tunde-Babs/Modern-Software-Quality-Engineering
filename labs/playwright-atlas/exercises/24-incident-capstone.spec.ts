// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('@critical retrying a lost order response creates only one order', async ({ authenticatedShop: page, workspace, request }, testInfo) => {
  await addProduct(page); await request.post(`${workspace.api}/faults`, { data: { checkout: 'lost-response' } });
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Order response lost.' })).toBeVisible();
  await expectTotal(page, '€15.00');
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('Order confirmed.');
  const orders = await (await request.get(`${workspace.api}/orders`)).json();
  expect(orders).toHaveLength(1); expect(orders[0].totalCents).toBe(1500);
  await testInfo.attach('incident-decision', { body: 'Response loss is not proof of non-creation. The retry reused the same idempotency key; one order was observed. Real payment processing remains outside this simulator.', contentType: 'text/plain' });
});
test('a repeated API request key returns the same order identity', async ({ workspace, request }) => {
  await request.post(`${workspace.api}/login`, { data: credentials });
  await request.post(`${workspace.api}/cart`, { data: { productId: 'mug', quantity: 1 } });
  const options = { headers: { 'Idempotency-Key': 'capstone-repeated-key' } };
  const first = await (await request.post(`${workspace.api}/orders`, options)).json();
  const second = await (await request.post(`${workspace.api}/orders`, options)).json();
  expect(second.id).toBe(first.id);
  expect(await (await request.get(`${workspace.api}/orders`)).json()).toHaveLength(1);
});
