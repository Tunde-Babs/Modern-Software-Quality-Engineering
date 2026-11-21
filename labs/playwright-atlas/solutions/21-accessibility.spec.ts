import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';
import AxeBuilder from '@axe-core/playwright';

test('the loaded shop has no axe violations in the inspected main region', async ({ shop }) => {
  const results = await new AxeBuilder({ page: shop }).include('main').analyze();
  expect(results.violations).toEqual([]);
});
test('a search control is keyboard-operable and communicates an empty result', async ({ shop: page }) => {
  const search = page.getByRole('searchbox', { name: 'Search products' });
  await search.click(); await page.keyboard.type('spaceship');
  await expect(search).toBeFocused();
  await expect(page.getByText('No products found.', { exact: true })).toBeVisible();
  const results = await new AxeBuilder({ page }).include('main').analyze();
  expect(results.violations).toEqual([]);
});
