import { rmSync } from 'node:fs';
// Our accessible search page uses the API, not Pagefind's optional stock UIs.
// Retain core JS, worker, WASM, metadata, fragments, and index chunks.
for (const asset of [
  'pagefind-ui.js', 'pagefind-ui.css', 'pagefind-modular-ui.js',
  'pagefind-modular-ui.css', 'pagefind-component-ui.js',
  'pagefind-component-ui.css', 'pagefind-highlight.js',
]) rmSync(new URL(`../dist/pagefind/${asset}`, import.meta.url), { force: true });
