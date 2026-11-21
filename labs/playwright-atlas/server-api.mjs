import { randomUUID } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const products = JSON.parse(await readFile(new URL('./app/products.json', import.meta.url), 'utf8'));
const workspaces = new Map();
const sessions = new Map();
const prices = new Map(products.map(product => [product.id, product.priceCents]));
const faults = new Set(['normal', 'declined', 'unavailable', 'lost-response']);
const validSession = (request, id) => sessions.get(/(?:^|;\s*)atlas_session=([^;]+)/.exec(request.headers.cookie ?? '')?.[1]) === id;
const total = cart => Object.entries(cart).reduce((sum, [id, count]) => sum + prices.get(id) * count, 0);
const orderView = order => ({ id: order.id, status: Date.now() >= order.readyAt ? 'confirmed' : 'pending', totalCents: order.totalCents, items: order.items });
const stateView = (workspace, request) => ({ id: workspace.id, label: workspace.label, cart: { ...workspace.cart }, signedIn: validSession(request, workspace.id), orders: workspace.orders.map(orderView), fault: workspace.fault, confirmationDelay: workspace.confirmationDelay });

async function readBody(request) {
  let data = '';
  for await (const chunk of request) {
    data += chunk;
    if (data.length > 8192) throw new Error('Request too large');
  }
  return data ? JSON.parse(data) : {};
}
function send(response, status, value, headers = {}) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers });
  response.end(status === 204 ? undefined : JSON.stringify(value));
}
function deleteWorkspace(id) {
  workspaces.delete(id);
  for (const [token, owner] of sessions) if (owner === id) sessions.delete(token);
}

// In-memory, loopback-only training state. This is not production authentication.
export async function handlePracticeApi(request, response, pathname) {
  if (!pathname.startsWith('/api/')) return false;
  try {
    if (pathname === '/api/workspaces' && request.method === 'POST') {
      // Expire abandoned manual workspaces; test fixtures delete their own scope.
      for (const [id, workspace] of workspaces) if (Date.now() - workspace.createdAt > 3_600_000) deleteWorkspace(id);
      if (workspaces.size >= 500) { send(response, 429, { error: 'Too many practice workspaces. Restart the local server.' }); return true; }
      const body = await readBody(request);
      const id = randomUUID();
      const workspace = { id, label: String(body.label ?? 'Practice').slice(0, 120), cart: {}, orders: [], fault: 'normal', confirmationDelay: 0, createdAt: Date.now() };
      workspaces.set(id, workspace);
      send(response, 201, stateView(workspace, request)); return true;
    }
    const match = /^\/api\/workspaces\/([a-f0-9-]+)(?:\/(.*))?$/.exec(pathname);
    if (!match || !workspaces.has(match[1])) { send(response, 404, { error: 'Practice workspace not found.' }); return true; }
    const [, id, action = ''] = match, workspace = workspaces.get(id);
    if (action === '' && request.method === 'DELETE') { deleteWorkspace(id); send(response, 204); return true; }
    if ((action === '' || action === 'state') && request.method === 'GET') { send(response, 200, stateView(workspace, request)); return true; }
    if (action === 'login' && request.method === 'POST') {
      const body = await readBody(request);
      if (String(body.email ?? '').trim().toLowerCase() !== 'learner@atlas.test' || body.password !== 'AtlasPractice123!') { send(response, 401, { error: 'Email or password is incorrect.' }); return true; }
      const token = randomUUID(); sessions.set(token, id);
      send(response, 200, { signedIn: true }, { 'Set-Cookie': `atlas_session=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=3600` }); return true;
    }
    if (action === 'logout' && request.method === 'POST') {
      const token = /(?:^|;\s*)atlas_session=([^;]+)/.exec(request.headers.cookie ?? '')?.[1];
      if (sessions.get(token) === id) sessions.delete(token);
      send(response, 200, { signedIn: false }, { 'Set-Cookie': 'atlas_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0' }); return true;
    }
    if (action === 'cart' && request.method === 'POST') {
      const body = await readBody(request);
      if (!prices.has(body.productId) || !Number.isInteger(body.quantity) || body.quantity < 1 || body.quantity > 100) { send(response, 400, { error: 'Use a known product and quantity from 1 to 100.' }); return true; }
      const quantity = (workspace.cart[body.productId] ?? 0) + body.quantity;
      if (quantity > 100) { send(response, 400, { error: 'Maximum quantity is 100 per product.' }); return true; }
      workspace.cart[body.productId] = quantity;
      send(response, 200, stateView(workspace, request)); return true;
    }
    if (action.startsWith('cart/') && request.method === 'DELETE') {
      const productId = action.slice(5);
      if (!prices.has(productId)) { send(response, 404, { error: 'Product not found.' }); return true; }
      delete workspace.cart[productId]; send(response, 200, stateView(workspace, request)); return true;
    }
    if (action === 'reset' && request.method === 'POST') {
      workspace.cart = {}; workspace.orders = []; workspace.fault = 'normal'; workspace.confirmationDelay = 0;
      for (const [token, owner] of sessions) if (owner === id) sessions.delete(token);
      send(response, 200, stateView(workspace, request)); return true;
    }
    if (action === 'faults' && request.method === 'POST') {
      const body = await readBody(request);
      if (!faults.has(body.checkout ?? 'normal') || !Number.isInteger(body.confirmationDelay ?? 0) || (body.confirmationDelay ?? 0) < 0 || (body.confirmationDelay ?? 0) > 10000) { send(response, 400, { error: 'Unknown fault or confirmation delay outside 0–10000 ms.' }); return true; }
      workspace.fault = body.checkout ?? 'normal'; workspace.confirmationDelay = body.confirmationDelay ?? 0;
      send(response, 200, stateView(workspace, request)); return true;
    }
    if (action === 'orders' && request.method === 'GET') { send(response, 200, workspace.orders.map(orderView)); return true; }
    if (action === 'orders' && request.method === 'POST') {
      if (!validSession(request, id)) { send(response, 401, { error: 'Sign in before placing a practice order.' }); return true; }
      const key = request.headers['idempotency-key'];
      if (!key || key.length > 100) { send(response, 400, { error: 'An Idempotency-Key is required.' }); return true; }
      const existing = workspace.orders.find(order => order.key === key);
      if (existing) { send(response, 200, orderView(existing)); return true; }
      if (!Object.keys(workspace.cart).length) { send(response, 400, { error: 'Add an item before placing an order.' }); return true; }
      if (workspace.fault === 'declined') { send(response, 402, { error: 'Practice payment declined. Your cart is unchanged.' }); return true; }
      if (workspace.fault === 'unavailable') { send(response, 503, { error: 'Practice checkout unavailable. Your cart is unchanged.' }); return true; }
      const order = { id: randomUUID(), key, items: { ...workspace.cart }, totalCents: total(workspace.cart), readyAt: Date.now() + workspace.confirmationDelay };
      workspace.orders.push(order);
      if (workspace.fault === 'lost-response') { send(response, 503, { error: 'Order response lost. Retry with the same request key.' }); return true; }
      send(response, 201, orderView(order)); return true;
    }
    const orderMatch = /^orders\/([a-f0-9-]+)$/.exec(action);
    if (orderMatch && request.method === 'GET') {
      if (!validSession(request, id)) { send(response, 401, { error: 'Sign in to read the practice order.' }); return true; }
      const order = workspace.orders.find(row => row.id === orderMatch[1]);
      if (!order) { send(response, 404, { error: 'Order not found.' }); return true; }
      const view = orderView(order);
      if (view.status === 'confirmed' && !order.finalized) {
        for (const [productId, quantity] of Object.entries(order.items)) {
          const remaining = (workspace.cart[productId] ?? 0) - quantity;
          if (remaining > 0) workspace.cart[productId] = remaining;
          else delete workspace.cart[productId];
        }
        order.finalized = true;
      }
      send(response, 200, view); return true;
    }
    send(response, 405, { error: 'Method or practice action not supported.' }); return true;
  } catch {
    send(response, 400, { error: 'Invalid practice request.' }); return true;
  }
}
