# WEB-5 production configuration — not deployed

**LICENSE DECISION REQUIRED BEFORE WEB-5 PRODUCTION LAUNCH**

The blank repository LICENSE is unchanged. No redistribution license is implied.
Resolve the external instructional references listed in WEB4_IMPLEMENTATION_REPORT.md
and obtain fresh independent WEB-4 verification before checkpointing or launching.

## Cloudflare Pages

- Repository root: repository top level; framework: Astro, static output.
- Build command: `npm --prefix website ci && npm --prefix website run build`.
- Output directory relative to repository root: `website/dist`.
- No adapter, Worker, backend, bindings, credentials or runtime environment is required.
- Package engine: Node >=22.12.0. WEB-4 validated Node 24.20.0 and npm 11.19.0;
  pin the tested versions in the build environment (Node `NODE_VERSION=24.20.0`,
  npm `NPM_VERSION=11.19.0`) and install dev dependencies for build-time tooling.
- `ASTRO_TELEMETRY_DISABLED=1` is included in Astro npm scripts.
- Set `MSQE_INDEXING=production` only for the authorized production build after
  launch blockers are resolved. Leave it unset for every preview. Default builds
  emit `noindex, nofollow` on every HTML page and `Disallow: /` in robots.txt.
- The production switch enables indexing on content pages and robots crawling;
  `/search/` and `/404.html` remain noindex and are excluded from the sitemap.
  Robots is an indexing instruction, not an access control or privacy boundary.
- Every canonical URL remains `https://msqe.dev/...` in both preview and production.
  WEB-5 must configure the custom domain and permanent `www.msqe.dev` → `msqe.dev`
  redirect, preserving path and query, and redirect or restrict duplicate production hosts.
- Serve `404.html` as the missing-route response with HTTP 404. Confirm trailing
  slash redirects, correct JS/WASM MIME types, HTTPS, and cache invalidation for
  Pagefind metadata. Do not cache a stale index across releases.
- Recommended response headers to validate in WEB-5: `X-Content-Type-Options: nosniff`,
  `Referrer-Policy: strict-origin-when-cross-origin`, and an appropriate CSP allowing
  same-origin scripts and Pagefind WebAssembly. Test the final policy before enabling it.

No account, Cloudflare project, DNS record, deployment, release or tag was created.
Official static Astro guidance: https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/.

## Local author checks

```sh
npm --prefix website ci
npm --prefix website run check
npm --prefix website run build
npm --prefix website run verify
npm --prefix website run test:browser
npm --prefix website run links -- --online
```

Browser checks use an installed Google Chrome and a Python 3 static server on
`127.0.0.1:4324`. They inspect the built output, including real Pagefind requests.
Reports and screenshots are generated in ignored `website/artifacts/`.
The 200% automated matrix uses CSS zoom to exercise layout scaling; report any
additional native zoom or assistive-technology checks separately.

`npm run dev` serves content but does not create a search index. Use a static build
and local static server for search testing. This limitation does not affect the
production output. Search uses the Pagefind keyword API, not semantic search:
https://pagefind.app/docs/api/ and https://pagefind.app/docs/running-pagefind/.
