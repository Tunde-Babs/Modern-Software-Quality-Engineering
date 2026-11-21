// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('browser clock advances a reservation without a real-minute wait', async ({ workspace, page }) => {
  await page.clock.install(); await page.goto(workspace.url);
  await page.getByRole('button', { name: 'Start 60-second reservation', exact: true }).click();
  await expect(page.getByRole('status', { name: 'Reservation status', exact: true })).toHaveText('Reservation active.');
  await page.clock.fastForward(60001);
  await expect(page.getByRole('status', { name: 'Reservation status', exact: true })).toHaveText('Reservation expired.');
});
test('reservation stays active before its expiry boundary', async ({ workspace, page }) => {
  await page.clock.install(); await page.goto(workspace.url);
  await page.getByRole('button', { name: 'Start 60-second reservation', exact: true }).click();
  await page.clock.fastForward(59000);
  await expect(page.getByRole('status', { name: 'Reservation status', exact: true })).toHaveText('Reservation active.');
});
