// Completed authored example. Review the matching lesson and try its variation.
import { test, expect, addProduct, expectTotal, credentials } from '../fixtures/atlas.js';

test('deleting owned data makes the workspace unavailable', async ({ request }) => {
  const { id } = await (await request.post('/api/workspaces', { data: { label: 'owned-cleanup' } })).json();
  try {
    expect((await request.delete(`/api/workspaces/${id}`)).status()).toBe(204);
    expect((await request.get(`/api/workspaces/${id}/state`)).status()).toBe(404);
  } finally { await request.delete(`/api/workspaces/${id}`); }
});
test('cleanup of one workspace preserves another owner data', async ({ workspace, request }) => {
  await request.post(`${workspace.api}/cart`, { data: { productId: 'mug', quantity: 1 } });
  const other = await (await request.post('/api/workspaces')).json();
  try { expect((await request.delete(`/api/workspaces/${other.id}`)).status()).toBe(204); }
  finally { await request.delete(`/api/workspaces/${other.id}`); }
  expect((await (await request.get(`${workspace.api}/state`)).json()).cart).toEqual({ mug: 1 });
});
