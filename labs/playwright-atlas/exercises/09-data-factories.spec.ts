// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';
import { cartItem, practiceLabel } from '../fixtures/data.js';

test('a typed factory creates explicit cart data', async ({ workspace, request, page }) => {
  const item = cartItem({ productId: 'backpack', quantity: 2 });
  expect((await request.post(`${workspace.api}/cart`, { data: item })).ok()).toBe(true);
  await page.goto(workspace.url);
  await expectTotal(page, '€98.00');
});
test('factory labels support independently owned test data', async ({ request }) => {
  const first = await (await request.post('/api/workspaces', { data: { label: practiceLabel('A') } })).json();
  let second;
  try {
    second = await (await request.post('/api/workspaces', { data: { label: practiceLabel('B') } })).json();
    expect(first.id).not.toBe(second.id);
    expect(first.label).not.toBe(second.label);
    expect(first.cart).toEqual({}); expect(second.cart).toEqual({});
  } finally {
    await request.delete(`/api/workspaces/${first.id}`);
    if (second) await request.delete(`/api/workspaces/${second.id}`);
  }
});
