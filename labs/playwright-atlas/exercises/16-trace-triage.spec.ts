// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test.use({ trace: 'on' });
test('captures diagnostic evidence for a declined practice payment', async ({ authenticatedShop: page, workspace, request }, testInfo) => {
  await addProduct(page);
  await request.post(`${workspace.api}/faults`, { data: { checkout: 'declined' } });
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Practice payment declined.' })).toBeVisible();
  await testInfo.attach('decline-state', { body: JSON.stringify(await (await request.get(`${workspace.api}/state`)).json(), null, 2), contentType: 'application/json' });
  await testInfo.attach('decline-screen', { body: await page.screenshot(), contentType: 'image/png' });
  await expectTotal(page, '€15.00');
});
test('a trace investigation can establish successful recovery', async ({ authenticatedShop: page }, testInfo) => {
  await addProduct(page); await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('Order confirmed.');
  await testInfo.attach('observation', { body: 'Normal checkout confirms; inspect the trace before attributing a prior decline to a locator.', contentType: 'text/plain' });
});
