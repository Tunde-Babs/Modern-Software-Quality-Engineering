// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('delayed confirmation is observed through order state', async ({ authenticatedShop: page, workspace, request }) => {
  await addProduct(page);
  await request.post(`${workspace.api}/faults`, { data: { confirmationDelay: 800 } });
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('Order pending.');
  await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('Order confirmed.');
  await expectTotal(page, '€0.00');
});
test('a confirmation beyond the overall deadline remains unconfirmed', async ({ authenticatedShop: page, workspace, request }) => {
  await addProduct(page);
  await request.post(`${workspace.api}/faults`, { data: { confirmationDelay: 10000 } });
  await page.getByRole('button', { name: 'Place practice order', exact: true }).click();
  await expect(page.getByRole('alert').filter({ hasText: 'Confirmation deadline reached.' })).toBeVisible();
  await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('Order not confirmed.');
  await expectTotal(page, '€15.00');
});
