# WEB-5 production configuration — not deployed

WEB-4 remains integrated/accepted. WEB-5BV2 independently verified the final
35-path blocker-resolution candidate: 21 PASS / 0 FAIL / 0 INCOMPLETE, Decision A.
License blocker, original five reference blockers and the subsequent xUnit HTTPS
blocker are CLOSED / INDEPENDENTLY VERIFIED (16 URL substitutions / 11 files).
The 24 remaining mechanically unverified references are UNVERIFIED / NOT
ESTABLISHED BROKEN. Baseline evolution is independently approved and applied in
WEB-5BR to the final post-F1 digests. The unchanged all-layer gate still requires
matching HEAD/index identities; closure preparation is stopped for independent
checkpoint-layer adjudication, not reported as gate PASS.

WEB-5 DEPLOYMENT: NOT STARTED. msqe.dev is NOT yet live under this project launch;
this is the task's deployment-state record, not a live infrastructure audit.
Production indexing remains disabled; no release/tag, checkpoint or deployment
has occurred. MSQE v0.16.0 / LEARNING-READY — CONTROLLED RC remains distinct from
First Edition completion. Next: fresh narrow independent WEB-5BCV, including the
checkpoint-layer limitation. No checkpoint is authorized in WEB-5BR.

Copyright © 2026 Babatunde Ajala. Original educational content is CC BY 4.0;
original software/tooling is Apache-2.0. Third-party rights remain separate.
See WEB5_BLOCKER_RESOLUTION_REPORT.md for acceptance and closure evidence.

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
