import assert from 'node:assert/strict';

// A type describes the shape of a value. Money uses whole cents.
type Product = { name: string; priceCents: number };
const backpack: Product = { name: 'Atlas Backpack', priceCents: 4900 };
function lineTotal(product: Product, quantity: number): number {
  return product.priceCents * quantity;
}

// An async function returns a Promise: a result that becomes available later.
async function loadProduct(): Promise<Product> {
  return backpack;
}
const product = await loadProduct();
assert.equal(lineTotal(product, 2), 9800);
console.log(`${product.name}: two cost €${(lineTotal(product, 2) / 100).toFixed(2)}`);
console.log('Bridge check passed. Now explain what await and quantity do.');
