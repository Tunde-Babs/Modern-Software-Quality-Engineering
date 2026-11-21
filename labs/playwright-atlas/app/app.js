const $ = (id) => document.getElementById(id);
const money = (cents) => `€${(cents / 100).toFixed(2)}`;
const storageKey = 'atlas-practice-v1';
let products = [];
let cart = {};
let signedIn = false;
let scenario = 'normal';
let catalogController;

function waitForCatalogDelay(milliseconds, signal) {
  return new Promise((resolve, reject) => {
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('Catalog load cancelled', 'AbortError'));
    };
    const timer = setTimeout(() => {
      signal.removeEventListener('abort', onAbort);
      resolve();
    }, milliseconds);
    signal.addEventListener('abort', onAbort, { once: true });
  });
}

async function loadCatalog() {
  catalogController?.abort();
  const controller = new AbortController();
  catalogController = controller;
  const delay = Number($('catalog-delay').value);
  const unavailable = scenario === 'catalog-unavailable';
  $('catalog-error').hidden = true;
  $('catalog-status').textContent = 'Loading products…';
  $('product-count').textContent = '';
  $('products').replaceChildren();
  $('products').setAttribute('aria-busy', 'true');
  $('reload-catalog').disabled = true;
  try {
    await waitForCatalogDelay(delay, controller.signal);
    if (unavailable) throw new Error('Simulated catalog failure');
    const response = await fetch('/products.json', { signal: controller.signal });
    if (!response.ok) throw new Error('Catalog request failed');
    const nextProducts = await response.json();
    if (controller.signal.aborted) return;
    products = nextProducts;
    renderProducts(); renderCart();
    $('catalog-status').textContent = 'Products ready.';
  } catch (error) {
    if (controller.signal.aborted) return;
    $('catalog-error').hidden = false;
    $('catalog-status').textContent = 'Products unavailable.';
  } finally {
    if (!controller.signal.aborted) {
      $('products').setAttribute('aria-busy', 'false');
      $('reload-catalog').disabled = false;
    }
  }
}
try {
  const saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
  cart = saved.cart && typeof saved.cart === 'object' ? saved.cart : {};
  signedIn = saved.signedIn === true;
} catch { /* An invalid stored value starts a fresh practice session. */ }
function save() { sessionStorage.setItem(storageKey, JSON.stringify({ cart, signedIn })); }
function account() {
  $('login-form').hidden = signedIn;
  $('account').hidden = !signedIn;
  $('welcome').textContent = signedIn ? 'Welcome, Alex!' : '';
}
function renderProducts() {
  const query = $('search').value.trim().toLowerCase();
  const visible = products.filter((p) => p.name.toLowerCase().includes(query));
  $('product-count').textContent = `${visible.length} products`;
  $('products').replaceChildren();
  for (const product of visible) {
    const article = document.createElement('article');
    article.className = 'product';
    article.setAttribute('aria-label', product.name);
    // Only static, repository-owned catalog data is rendered through this template.
    article.innerHTML = `<div class="product-art" aria-hidden="true">${product.symbol}</div><div class="product-copy"><p class="category">${product.category}</p><h3>${product.name}</h3><p class="description">${product.description}</p><div class="buy"><span class="price">${money(product.priceCents)}</span><button type="button">Add to cart</button></div></div>`;
    article.querySelector('button').addEventListener('click', () => {
      cart[product.id] = (cart[product.id] || 0) + 1;
      save(); renderCart();
      $('cart-message').textContent = `${product.name} added to cart.`;
    });
    $('products').append(article);
  }
  if (!visible.length) {
    const empty = document.createElement('p');
    empty.textContent = 'No products found.';
    $('products').append(empty);
  }
}
function renderCart() {
  $('cart-items').replaceChildren();
  let quantity = 0, total = 0;
  for (const product of products) {
    const count = cart[product.id];
    if (!Number.isInteger(count) || count < 1 || count > 10000) continue;
    quantity += count;
    total += product.priceCents * count;
    const row = document.createElement('li');
    row.setAttribute('aria-label', product.name);
    const text = document.createElement('div');
    text.textContent = `${product.name} × ${count} — ${money(product.priceCents * count)}`;
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.className = 'secondary';
    remove.setAttribute('aria-label', `Remove ${product.name}`);
    remove.addEventListener('click', () => {
      delete cart[product.id]; save(); renderCart();
      $('cart-message').textContent = `${product.name} removed from cart.`;
    });
    row.append(text, remove); $('cart-items').append(row);
  }
  // Deliberate training defect, enabled only through the labelled practice control.
  if (scenario === 'cart-total-bug' && quantity > 0) total += 500;
  $('cart-count').textContent = String(quantity);
  $('cart-total').textContent = money(total);
  $('empty-cart').hidden = quantity > 0;
}
$('search').addEventListener('input', () => {
  if ($('catalog-status').textContent === 'Products ready.') renderProducts();
});
$('reload-catalog').addEventListener('click', loadCatalog);
$('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  let error = '';
  if (scenario === 'login-unavailable') error = 'Sign-in is temporarily unavailable. Please try again.';
  else if ($('email').value.trim().toLowerCase() !== 'learner@atlas.test' || $('password').value !== 'AtlasPractice123!') error = 'Email or password is incorrect.';
  $('login-error').textContent = error;
  $('login-error').hidden = !error;
  if (!error) {
    signedIn = true; $('password').value = ''; save(); account();
  }
});
$('sign-out').addEventListener('click', () => { signedIn = false; save(); account(); });
$('scenario').addEventListener('change', () => {
  scenario = $('scenario').value;
  $('practice-message').textContent = scenario === 'normal' ? 'Normal shop restored.' : 'Training fault enabled.';
  renderCart();
});
$('reset').addEventListener('click', () => {
  cart = {}; signedIn = false; scenario = 'normal';
  sessionStorage.removeItem(storageKey);
  $('scenario').value = 'normal'; $('search').value = '';
  $('catalog-delay').value = '0';
  $('login-form').reset(); $('login-error').hidden = true;
  $('cart-message').textContent = ''; $('practice-message').textContent = 'Practice reset. Ready to begin.';
  account(); renderCart();
  void loadCatalog();
});
account();
await loadCatalog();
