export function createWorkspaceClient(id) {
  const base = `/api/workspaces/${encodeURIComponent(id)}`;
  async function call(action, method = 'GET', body, options = {}) {
    const response = await fetch(`${base}/${action}`, {
      method, signal: options.signal,
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error ?? `Practice request failed (${response.status})`);
    return data;
  }
  return {
    state: signal => call('state', 'GET', undefined, { signal }),
    login: (email, password) => call('login', 'POST', { email, password }),
    logout: () => call('logout', 'POST'),
    add: (productId, quantity) => call('cart', 'POST', { productId, quantity }),
    remove: productId => call(`cart/${encodeURIComponent(productId)}`, 'DELETE'),
    reset: () => call('reset', 'POST'),
    faults: (checkout, confirmationDelay) => call('faults', 'POST', { checkout, confirmationDelay }),
    place: (key, signal) => call('orders', 'POST', undefined, { headers: { 'Idempotency-Key': key }, signal }),
    order: (id, signal) => call(`orders/${id}`, 'GET', undefined, { signal }),
  };
}
