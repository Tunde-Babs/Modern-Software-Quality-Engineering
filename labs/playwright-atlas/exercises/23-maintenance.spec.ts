// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';
import { CartPanel } from '../fixtures/cart-panel.js';

test('a small domain abstraction keeps the mixed-cart expectation visible', async ({ shop }) => {
  const cart = new CartPanel(shop);
  await cart.add('Desk Lamp'); await cart.add('Field Notebook'); await cart.add('Field Notebook');
  await cart.expectSummary(3, '€53.00');
});
test('the same abstraction supports whole-line removal', async ({ shop }) => {
  const cart = new CartPanel(shop);
  await cart.add('Trail Mug'); await cart.add('Trail Mug');
  await cart.expectSummary(2, '€30.00');
  await cart.remove('Trail Mug'); await cart.expectSummary(0, '€0.00');
});
