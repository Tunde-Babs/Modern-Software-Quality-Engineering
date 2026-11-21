// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('the empty quantity indicator matches its reviewed baseline', async ({ shop }) => {
  await expect(shop.getByRole('img', { name: 'Cart quantity indicator', exact: true })).toHaveScreenshot('empty-indicator.png');
  await expectTotal(shop, '€0.00');
});
test('a full quantity indicator has a distinct visual baseline', async ({ workspace, request, page }) => {
  await request.post(`${workspace.api}/cart`, { data: { productId: 'mug', quantity: 4 } });
  await page.goto(workspace.url); await expectTotal(page, '€60.00');
  await expect(page.getByRole('img', { name: 'Cart quantity indicator', exact: true })).toHaveScreenshot('filled-indicator.png');
});
