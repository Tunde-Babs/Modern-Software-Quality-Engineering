const form = document.querySelector('#search-form');
const input = document.querySelector('#search-query');
const searchStatus = document.querySelector('#search-status');
const list = document.querySelector('#search-results');
const more = document.querySelector('#search-more');
let engine, generation = 0, matches = [], shown = 0;
async function appendResults(token) {
  const batch = await Promise.all(matches.slice(shown, shown + 10).map(result => result.data()));
  if (token !== generation) return;
  for (const result of batch) {
    const url = new URL(result.url, location.origin);
    if (url.origin !== location.origin || !['http:', 'https:'].includes(url.protocol)) continue;
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = url.pathname + url.hash;
    link.textContent = result.meta.title;
    const excerpt = document.createElement('p');
    // Index content is sanitized at build time; treat even snippets as inert text.
    const parsed = new DOMParser().parseFromString(result.excerpt, 'text/html');
    excerpt.textContent = parsed.body.textContent;
    const destination = document.createElement('small');
    destination.textContent = url.pathname;
    item.append(link, excerpt, destination);
    list.append(item);
  }
  shown += batch.length;
  more.hidden = shown >= matches.length;
  searchStatus.textContent = matches.length ? `${matches.length} results. Showing ${shown}.` : 'No results. Try fewer words or a different term.';
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  const token = ++generation;
  const query = input.value.trim();
  list.replaceChildren(); more.hidden = true; shown = 0;
  if (!query) { searchStatus.textContent = 'Enter a term to search the handbook.'; return; }
  searchStatus.textContent = 'Searching…';
  try {
    engine ??= import('/pagefind/pagefind.js');
    const result = await (await engine).search(query);
    if (token !== generation) return;
    matches = result.results;
    await appendResults(token);
  } catch {
    if (token === generation) searchStatus.textContent = 'Search could not load. Please try again, or browse the handbook using the navigation above.';
    engine = undefined;
  }
});
more.addEventListener('click', async () => {
  more.disabled = true;
  const firstNew = list.children.length;
  try {
    await appendResults(generation);
    const link = list.children[firstNew]?.querySelector('a');
    link?.focus();
  } catch { searchStatus.textContent = 'More results could not load. Please try again.'; }
  finally { more.disabled = false; }
});
