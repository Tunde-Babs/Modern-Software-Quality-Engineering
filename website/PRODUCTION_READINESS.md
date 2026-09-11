# WEB-5D production readiness — repository preparation only

MSQE v0.16.0 / **LEARNING-READY — CONTROLLED RC**. First Edition remains in
progress; this candidate is not v1.0.0 or the final published edition.
No Cloudflare project, Git connection, deployment, domain, DNS, redirect, SSL
setting, release or tag was created or changed in WEB-5D. Public indexing has
not been enabled by this work. Fresh independent WEB-5DV is required.

This document replaces the stale WEB-5BR next-step assumptions in its previous
version. It does not rewrite accepted governance events. Preparation starts at
`10f1582ab3658ce77c0af500f220c95e31abb09d` on
`feature/web-5-production-deployment`, authenticated against the live remote.
The accepted external-reference state remains **0 confirmed materially broken
instructional URLs**, with 24 mechanically unverified references not established
broken. No canonical source URL or license policy is changed.

## Exact build contract

| Setting | Required value |
| --- | --- |
| Provider | Cloudflare Pages, Git integration, static assets |
| Framework preset | Astro; override the preset command and output below |
| Repository root | Repository root (leave root-directory override empty) |
| Production branch | `feature/web-5-production-deployment`, only after independent verification and separately authorized checkpoint/push |
| Build image | v3 |
| Node | `NODE_VERSION=24.20.0` in both build environments |
| npm | Exactly `11.19.0`, verified by the build preflight below |
| Automatic installation | `SKIP_DEPENDENCY_INSTALL=1` in both environments |
| Install command | `npm --prefix website ci --include=dev` |
| Shared Pages build command | `node website/scripts/check-toolchain.mjs && npm --prefix website ci --include=dev && npm --prefix website run build` |
| Output directory | `website/dist` relative to repository root |
| Production-only build variable | `MSQE_INDEXING=production`, only at the authorized indexing step |
| Preview build variables | Leave `MSQE_INDEXING` unset; never copy the production value into preview scope |
| Runtime variables / secrets | None |

The repository-root context is necessary for canonical content outside `website/`.
Astro configuration explicitly sets `output: 'static'`, `site: 'https://msqe.dev'`
and `trailingSlash: 'always'`. There is no adapter, backend, Worker, Functions
entry point, account system or data store. Only `website/dist` is uploaded.
Development dependencies are required to build Pagefind and validate TypeScript.
The lockfile remains unchanged (format 3); `npm ci` installs its pinned versions.

The package's general engine compatibility is Node >=22.12.0. This exact
candidate was tested on Node 24.20.0 and npm 11.19.0; the build preflight rejects
other versions rather than silently accepting an untested contract. Current
Cloudflare v3 documentation associates npm with the selected Node version and
does not list `NPM_VERSION` as its override. Do not carry forward that old
assumption. Inspect the first remote build log: if its bundled npm differs,
stop and explicitly provision/revalidate the requested npm before deployment.
Do not silently weaken the toolchain check.

Cloudflare documents the root, command and output controls in
[build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/),
and Node selection, automatic-install suppression and v3 limitations in
[build image](https://developers.cloudflare.com/pages/configuration/build-image/).
Actual availability of the pinned toolchain on Pages remains a first-build check.

## Reproducible local commands

Default/preview validation from repository root:

```sh
npm --prefix website ci
npm --prefix website run check
npm --prefix website run build
npm --prefix website run verify
```

One explicit production build command after installation:

```sh
npm --prefix website run build:production
```

This sets `MSQE_INDEXING=production` only for the child build and runs the same
Astro → Pagefind (`--site dist`) → optional UI asset pruning pipeline. It does
not change the shell environment or publish anything. The shared Pages command
uses the same pipeline, with the variable set in production scope only.

Exact Pages production build reproduced locally:

```sh
MSQE_INDEXING=production sh -c 'node website/scripts/check-toolchain.mjs && npm --prefix website ci --include=dev && npm --prefix website run build'
```

Full production author validation:

```sh
npm --prefix website run verify:production
npm --prefix website run test:production-browser
```

`verify` retains the original 39 tests and adds ten generated-output checks.
`verify:production` runs the same 39 tests, builds production, then runs complete
link/fragment smoke validation and the ten output checks with production
expectations. `test:production-browser` uses installed Google Chrome and a local
Node HTTP fixture on port 4325. This test-only server applies the committed
headers; it is not a Cloudflare emulator, is not uploaded, and cannot validate
TLS, edge routing or Cloudflare header parsing. The original browser suite is
still available as `npm --prefix website run test:browser` on port 4324.

## Indexing, robots, sitemap and canonical URLs

No indexing implementation change was needed. The existing strict opt-in
`MSQE_INDEXING === 'production'` controls both metadata and robots.txt:

| Mode | HTML metadata | robots.txt |
| --- | --- | --- |
| Default / preview / development | All 262 pages: `noindex, nofollow` | `Disallow: /` |
| Production | 260 pages: `index, follow`; search and 404: `noindex, nofollow` | `Allow: /`, `Disallow: /search/` |

Both robots variants advertise `https://msqe.dev/sitemap.xml`. Its 260 unique
URLs are exactly the public HTML set minus `/search/` and `/404.html`. It contains
no internal governance route, localhost, preview hostname or duplicate URL.
All 262 canonical and Open Graph URLs use `https://msqe.dev/` in both modes.
Robots directives are crawler instructions, not access control; content exclusion
is enforced by the source registry and by uploading only static output.
Public teaching examples under resource `/docs/` paths are intentional, distinct
from repository governance under `docs/00-project` and `docs/02-first-edition-review`.

The first authorized Pages build should leave indexing unset until domain and
host controls are ready. Enable production indexing only in a separately
explicitly authorized production rebuild. Keep preview variables unset. Redirect
the production `PROJECT.pages.dev` alias to the apex using Cloudflare's supported
[Pages alias redirect](https://developers.cloudflare.com/pages/how-to/redirect-to-custom-domain/)
and verify hashed/branch previews remain nonindexable. Do not redirect all
preview hosts blindly. No host redirect is configured in this repository.

## Domain and HTTPS design — not applied

Preferred host: `msqe.dev`. For `www.msqe.dev`, use Cloudflare Bulk Redirects:
source `www.msqe.dev`, target `https://msqe.dev`, permanent **301**, subpath
matching, preserve path suffix, preserve query string; scope only this hostname
(no nested subdomains). Example: `https://www.msqe.dev/handbook/?q=api` becomes
`https://msqe.dev/handbook/?q=api`. Provision proxied www DNS and valid certificate
coverage in the future domain task. This follows the supported
[Pages www redirect mechanism](https://developers.cloudflare.com/pages/how-to/www-redirect/).
No `_redirects` catch-all is needed for this static multipage site.

Associate the apex via Pages custom domains before relying on its DNS target.
An apex Pages domain requires the zone in the same Cloudflare account and
Cloudflare nameservers. Inventory existing records before any future DNS change;
retain unrelated email and verification records. See
[custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/).

Require valid edge certificates for apex and www, and HTTP → HTTPS using
[Always Use HTTPS](https://developers.cloudflare.com/ssl/edge-certificates/additional-options/always-use-https/).
Use Cloudflare-managed Pages TLS; there is no application origin certificate to
configure here. Verify the zone's SSL/TLS state and certificate activation before
cutover; do not weaken it to Flexible or disable validation. Confirm certificate
chain, redirect location, loops and mixed content on the actual domain.

## Prepared security headers

`public/_headers` is copied unchanged to `dist/_headers` for Pages static-response
handling, as documented in [Pages headers](https://developers.cloudflare.com/pages/configuration/headers/).

| Header / directive | Chosen policy and rationale |
| --- | --- |
| CSP default-src | `'self'`: local assets only |
| script-src | `'self' 'wasm-unsafe-eval'`: local search module and Pagefind WASM; no arbitrary JavaScript eval or inline scripts |
| style-src | `'self' 'unsafe-inline'`: local CSS and generated syntax-highlighting style attributes |
| img-src | `'self' data:`: local icons and inline image data; no remote pixels |
| connect-src / worker-src | `'self'`: local index requests and same-origin workers |
| object-src / base-uri | `'none'`: disable plugins and base-URL rewriting |
| frame-ancestors / X-Frame-Options | `'none'` / `DENY`: no embedding |
| form-action | `'self'`: same-origin form fallback only |
| X-Content-Type-Options | `nosniff`: enforce declared content types |
| Referrer-Policy | `strict-origin-when-cross-origin`: limit outbound referrer detail |
| Permissions-Policy | Deny camera, microphone, geolocation, payment and USB |
| Strict-Transport-Security | Apex only, `max-age=86400`; initial one-day policy without includeSubDomains or preload |

HSTS does not provide an HTTP redirect or certificate. Its host-scoped application
and browser enforcement require HTTPS live verification; the HTTP fixture only
checks the intended value. Do not add a longer preload/subdomain commitment
without a separate domain-wide review. Keep Pages' normal caching defaults;
no long-lived custom cache rule for mutable Pagefind entry points is prepared.
Actual header parsing, 404 status and asset MIME types require live checks.
Cloudflare's [serving behavior](https://developers.cloudflare.com/pages/configuration/serving-pages/)
supports the existing top-level `404.html`; its presence avoids SPA fallback.

## Licensing, privacy and environment

Every page links to `/license/`. The generated license page preserves Copyright
© 2026 Babatunde Ajala, CC BY 4.0 educational content, Apache-2.0 software/tooling,
and the separate third-party rights boundary. Root license files remain unchanged.

Only search runs application JavaScript. It imports the local Pagefind bundle;
all CSS, favicons and search assets are local. No analytics, tracking pixels,
advertising, authentication, payments, learner-data collection or cookie consent
functionality is implemented. Search has no persistent browser storage. No
non-content third-party browser requests are expected; outbound reference/license
links are user navigation, not embedded runtime requests. Disable Cloudflare Web
Analytics, Zaraz and any script injection in the future account configuration.
Hosting access logs and any provider-added functionality require live review;
repository checks do not attest to an uninspected account.

No API key, runtime credential or Cloudflare token is needed. Build variables are
non-secret configuration only; Astro telemetry is disabled by the build scripts.
Git-provider authorization for future Pages setup is administrative, not a website
secret. Do not embed tokens or credentials in this public build.

## Future deployment checklist — all infrastructure steps pending

- [ ] Fresh independent WEB-5DV and explicit authorization for checkpoint/push and deployment.
- [ ] Create Pages project and connect the Git repository.
- [ ] Select the verified production branch/commit; do not select main/develop by assumption.
- [ ] Set exact root, build command, `website/dist`, v3 image and Node version above.
- [ ] Set non-secret environment per scope; confirm npm preflight and dev dependencies.
- [ ] Initially leave indexing disabled and validate generated output/preview headers.
- [ ] Configure apex custom domain, inspect/provision apex DNS and certificate.
- [ ] Configure www redirect and production pages.dev alias handling.
- [ ] Enable HTTP → HTTPS; confirm edge certificates and intended headers.
- [ ] Authorize production indexing, set its production-only variable, rebuild and verify.
- [ ] Complete every item in PRODUCTION_ACCEPTANCE_CHECKLIST.md with live evidence.
- [ ] Record deployment IDs and prove rollback procedure; retain known-good deployment.

See [deployment runbook](PRODUCTION_DEPLOYMENT_RUNBOOK.md),
[live acceptance checklist](PRODUCTION_ACCEPTANCE_CHECKLIST.md), and the
[WEB-5D report](WEB5D_PRODUCTION_PREPARATION_REPORT.md) for measured census,
validation results and readiness classifications. No unchecked live item is PASS.
