// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('the selected browser project supports the cart interaction', async ({ shop, browserName }, testInfo) => {
  await addProduct(shop); await expectTotal(shop, '€15.00');
  await testInfo.attach('browser-evidence', { body: JSON.stringify({ browserName, project: testInfo.project.name }), contentType: 'application/json' });
});
test('a narrow viewport preserves a usable named search control', async ({ shop: page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('searchbox', { name: 'Search products' }).fill('lamp');
  await expect(page.getByRole('article', { name: 'Desk Lamp', exact: true })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
