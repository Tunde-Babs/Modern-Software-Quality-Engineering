import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('an HTTP 503 checkout response is visible and preserves the cart', async ({ authenticatedShop: page, workspace, request }) => {
  await addProduct(page);
  await request.post(`${workspace.api}/faults`, { data: { checkout: 'unavailable' } });
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Practice checkout unavailable.' })).toBeVisible();
  await expectTotal(page, '€15.00');
  expect(await (await request.get(`${workspace.api}/orders`)).json()).toEqual([]);
});
test('a controlled cart HTTP error does not report a successful add', async ({ shop: page, workspace }) => {
  await page.route(`**${workspace.api}/cart`, route => route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Cart service unavailable.' }) }));
  await addProduct(page);
  await expect(page.getByRole('alert').filter({ hasText: 'Cart service unavailable.' })).toBeVisible();
  await expectTotal(page, '€0.00');
});
