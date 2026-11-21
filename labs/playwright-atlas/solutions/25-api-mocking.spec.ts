import { test, expect, addProduct, expectTotal } from '../fixtures/atlas.js';
import { readFile, writeFile } from 'node:fs/promises';

const mockProduct = { id: 'mug', name: 'Mock Trail Mug', category: 'Controlled catalog', priceCents: 1700, description: 'An explicit synthetic product.', symbol: '◡' };

test('fulfill a successful catalog without calling the real endpoint', async ({ page }) => {
  await page.route('**/products.json', route => route.fulfill({ json: [mockProduct] }));
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(1);
  await addProduct(page, 'Mock Trail Mug');
  await expectTotal(page, '€17.00');
});

test('fetch the real response and modify only the selected field', async ({ page }) => {
  let originalPrice = 0;
  await page.route('**/products.json', async route => {
    const response = await route.fetch();
    expect(response.ok()).toBe(true);
    const products = await response.json();
    originalPrice = products.find((product: { id: string }) => product.id === 'mug').priceCents;
    const patched = products.map((product: { id: string }) => product.id === 'mug' ? { ...product, priceCents: 1900 } : product);
    await route.fulfill({ response, json: patched });
  });
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(4);
  await addProduct(page); await expectTotal(page, '€19.00');
  expect(originalPrice).toBe(1500);
});

test('abort a request and observe the application error state', async ({ page }) => {
  await page.route('**/products.json', route => route.abort('failed'));
  await page.goto('/');
  await expect(page.getByRole('alert').filter({ hasText: 'Products could not be loaded.' })).toBeVisible();
  await expect(page.getByRole('article')).toHaveCount(0);
});

test('a browser-context mock does not affect another context', async ({ browser, baseURL }) => {
  const mocked = await browser.newContext({ baseURL });
  const real = await browser.newContext({ baseURL });
  try {
    await mocked.route('**/products.json', route => route.fulfill({ json: [mockProduct] }));
    const first = await mocked.newPage(), second = await real.newPage();
    await first.goto('/'); await second.goto('/');
    await expect(first.getByRole('article')).toHaveCount(1);
    await expect(second.getByRole('article')).toHaveCount(4);
    await expect(second.getByRole('article', { name: 'Mock Trail Mug', exact: true })).toHaveCount(0);
  } finally { await mocked.close(); await real.close(); }
});

test('removing a route restores real network behaviour', async ({ page }) => {
  const handler = async (route: import('@playwright/test').Route) => { await route.fulfill({ json: [mockProduct] }); };
  await page.route('**/products.json', handler);
  await page.goto('/'); await expect(page.getByRole('article')).toHaveCount(1);
  await page.unroute('**/products.json', handler);
  await page.reload(); await expect(page.getByRole('article')).toHaveCount(4);
});

test('register response observation before triggering a POST', async ({ shop, workspace }) => {
  const pending = shop.waitForResponse(response => response.url().endsWith(`${workspace.api}/cart`) && response.request().method() === 'POST');
  await addProduct(shop);
  const response = await pending;
  expect(response.status()).toBe(200);
  expect(response.request().postDataJSON()).toEqual({ productId: 'mug', quantity: 1 });
  expect((await response.json()).cart).toEqual({ mug: 1 });
  await expectTotal(shop, '€15.00');
});

test('a method-aware successful POST mock does not establish server persistence', async ({ shop, workspace, request }) => {
  let payload;
  await shop.route(`**${workspace.api}/cart`, async route => {
    if (route.request().method() !== 'POST') return route.continue();
    payload = route.request().postDataJSON();
    await route.fulfill({ json: { cart: { mug: 1 } } });
  });
  await addProduct(shop); await expectTotal(shop, '€15.00');
  expect(payload).toEqual({ productId: 'mug', quantity: 1 });
  expect((await (await request.get(`${workspace.api}/state`)).json()).cart).toEqual({});
});

test('replay a synthetic HAR catalog with an explicit URL scope', async ({ page, baseURL }, testInfo) => {
  const har = JSON.parse(await readFile(new URL('../fixtures/catalog.har', import.meta.url), 'utf8'));
  // Adapt only the origin to the owned test server; do not record live credentials.
  har.log.entries[0].request.url = `${baseURL}/products.json`;
  const file = testInfo.outputPath('synthetic-catalog.har');
  await writeFile(file, JSON.stringify(har));
  await page.routeFromHAR(file, { url: '**/products.json', notFound: 'abort', update: false });
  await page.goto('/');
  await expect(page.getByRole('article')).toHaveCount(1);
  await expect(page.getByRole('article', { name: 'HAR Trail Mug', exact: true })).toBeVisible();
  await addProduct(page, 'HAR Trail Mug'); await expectTotal(page, '€15.00');
});
