// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test.describe.configure({ mode: 'parallel' });
for (const product of [{ id: 'mug', name: 'Trail Mug', total: '€15.00' }, { id: 'lamp', name: 'Desk Lamp', total: '€35.00' }]) {
  test(`parallel owner adds only ${product.name}`, async ({ shop, workspace, request }) => {
    await addProduct(shop, product.name); await expectTotal(shop, product.total);
    expect((await (await request.get(`${workspace.api}/state`)).json()).cart).toEqual({ [product.id]: 1 });
  });
}
