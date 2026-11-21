import { test, expect, credentials, addProduct, expectTotal } from '../fixtures/atlas.js';

test('workspace data is isolated and mutation validates its inputs', async ({ workspace, request }) => {
  await request.post(`${workspace.api}/cart`, { data: { productId: 'mug', quantity: 2 } });
  for (const data of [{ productId: 'missing', quantity: 1 }, { productId: 'mug', quantity: 0 }, { productId: 'mug', quantity: 101 }]) {
    expect((await request.post(`${workspace.api}/cart`, { data })).status()).toBe(400);
  }
  expect((await (await request.get(`${workspace.api}/state`)).json()).cart).toEqual({ mug: 2 });
});

test('reset invalidates authenticated state and clears only the owned workspace', async ({ workspace, request }) => {
  await request.post(`${workspace.api}/login`, { data: credentials });
  expect((await (await request.get(`${workspace.api}/state`)).json()).signedIn).toBe(true);
  await request.post(`${workspace.api}/cart`, { data: { productId: 'lamp', quantity: 1 } });
  await request.post(`${workspace.api}/reset`);
  const state = await (await request.get(`${workspace.api}/state`)).json();
  expect(state.signedIn).toBe(false); expect(state.cart).toEqual({}); expect(state.orders).toEqual([]);
});

test('order creation enforces a session and nonempty cart', async ({ workspace, request }) => {
  const options = { headers: { 'Idempotency-Key': 'preconditions' } };
  expect((await request.post(`${workspace.api}/orders`, options)).status()).toBe(401);
  await request.post(`${workspace.api}/login`, { data: credentials });
  expect((await request.post(`${workspace.api}/orders`, options)).status()).toBe(400);
  expect((await request.post(`${workspace.api}/orders`)).status()).toBe(400);
});

test('confirmed order consumption happens once and retains later additions', async ({ workspace, request }) => {
  await request.post(`${workspace.api}/login`, { data: credentials });
  await request.post(`${workspace.api}/cart`, { data: { productId: 'mug', quantity: 1 } });
  const order = await (await request.post(`${workspace.api}/orders`, { headers: { 'Idempotency-Key': 'consume-once' } })).json();
  expect((await (await request.get(`${workspace.api}/orders/${order.id}`)).json()).status).toBe('confirmed');
  await request.post(`${workspace.api}/cart`, { data: { productId: 'notebook', quantity: 2 } });
  await request.get(`${workspace.api}/orders/${order.id}`);
  expect((await (await request.get(`${workspace.api}/state`)).json()).cart).toEqual({ notebook: 2 });
});

test('an unresolved order submission is bounded by the overall deadline', async ({ authenticatedShop: page, workspace }) => {
  await addProduct(page);
  await page.route(`**${workspace.api}/orders`, () => { /* Intentionally unresolved: deadline must abort the fetch. */ });
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Confirmation deadline reached.' })).toBeVisible();
  await expectTotal(page, '€15.00');
});

test('reset aborts a pending confirmation without a stale error overwriting it', async ({ authenticatedShop: page, workspace, request }) => {
  await addProduct(page);
  await request.post(`${workspace.api}/faults`, { data: { confirmationDelay: 10000 } });
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('Order pending.');
  await page.getByText('Practice controls', { exact: true }).click();
  await page.getByRole('button', { name: 'Reset practice', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('No practice order yet.');
  await expect(page.locator('#order-error')).toBeHidden();
  await expectTotal(page, '€0.00');
});
