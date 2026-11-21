import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('CI evidence names the decision and its limits', async ({ shop }, testInfo) => {
  await addProduct(shop); await expectTotal(shop, '€15.00');
  const evidence = { decision: 'cart smoke feedback', outcome: 'one mug costs €15', boundary: 'local simulator only', retry: testInfo.retry, project: testInfo.project.name };
  await testInfo.attach('feedback-decision', { body: JSON.stringify(evidence, null, 2), contentType: 'application/json' });
  expect(testInfo.retry).toBe(0);
});
test('a run supplies a screenshot artifact for later review', async ({ shop }, testInfo) => {
  await expect(shop.getByRole('heading', { level: 1 })).toBeVisible();
  await testInfo.attach('review-screen', { body: await shop.screenshot(), contentType: 'image/png' });
});
