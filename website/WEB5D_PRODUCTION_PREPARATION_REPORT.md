# MSQE — WEB-5D Production Deployment Preparation Report

## 1. Executive verdict

Production preparation is complete; final preview and production validation passed.
MSQE v0.16.0 / **LEARNING-READY — CONTROLLED RC** is preserved. This is author
implementation/testing evidence, not independent WEB-5DV acceptance or permission
to deploy. No infrastructure mutation occurred.

## 2. Preflight

Required branch and HEAD matched; working tree and index were clean. Live
`git ls-remote` authenticated the same upstream commit; tracking divergence 0/0.
`npm ci`, `check`, `build`, `verify`: baseline 39 PASS / 0 FAIL, build smoke PASS.
MSQE: 35 PASS / 0 FAIL / 0 ERROR. Baseline: 7 PASS / 0 FAIL, exit 0.

## 3. Branch/base authentication

Branch: `feature/web-5-production-deployment`.
Base and unchanged HEAD: `10f1582ab3658ce77c0af500f220c95e31abb09d`.
Origin: `https://github.com/Tunde-Babs/Modern-Software-Quality-Engineering.git`.
All 310 tracked non-website blobs were authenticated byte-for-byte against base.

## 4. Exact changed paths

All 13 paths are under `website/`:

```text
website/PRODUCTION_READINESS.md
website/PRODUCTION_DEPLOYMENT_RUNBOOK.md
website/PRODUCTION_ACCEPTANCE_CHECKLIST.md
website/WEB5D_PRODUCTION_PREPARATION_REPORT.md
website/evidence/web5d/verification.json
website/package.json
website/playwright.production.config.ts
website/public/_headers
website/scripts/check-toolchain.mjs
website/tests/build-smoke.ts
website/tests/header-server.mjs
website/tests/production-browser/production.spec.ts
website/tests/production-output.ts
```

Three existing files modified; ten new files. Generated output, logs and browser
artifacts are ignored. No canonical content, license policy or lockfile change.

## 5. Cloudflare Pages build contract

Astro/static, Pages v3, repository root, output `website/dist`.
Node **24.20.0**, npm **11.19.0**; the repository preflight fails on drift.
Set `NODE_VERSION=24.20.0` and `SKIP_DEPENDENCY_INSTALL=1` in both environments.
Shared Pages command:

```sh
node website/scripts/check-toolchain.mjs && npm --prefix website ci --include=dev && npm --prefix website run build
```

Production-only `MSQE_INDEXING=production`; previews leave it unset. No runtime
variables or credentials. Node package compatibility remains >=22.12.0, but this
candidate pins the actually tested toolchain. Current v3 documentation does not
support assuming `NPM_VERSION` as an override; remote tool availability remains
an initial-build check, with fail-fast protection. See
[Cloudflare build image](https://developers.cloudflare.com/pages/configuration/build-image/).

## 6. Production build command

`npm --prefix website run build:production` deterministically selects production
metadata and runs Astro, Pagefind and optional search-UI asset pruning.
The exact Pages command above was separately executed locally with the
production variable, including `npm ci --include=dev`; it exited 0.
`verify:production` additionally ran source tests and production output checks.

## 7. Production indexing

Existing strict opt-in retained. Production: 260 pages `index, follow`; search
and 404 `noindex, nofollow`. Preview: all 262 pages `noindex, nofollow`.
No production flag was persisted or applied publicly.

## 8. Robots behavior

Production allows `/`, disallows `/search/`; preview disallows `/`.
Both advertise `https://msqe.dev/sitemap.xml`. Exact output tested in both modes.
Governance is excluded from publication by the source registry, not by robots.

## 9. Sitemap

**260 unique URLs**, matching all intended public HTML except search and 404.
No duplicate, internal governance, localhost, pages.dev or www URLs. Public
teaching documents under resource `/docs/` routes are intentional.

## 10. Canonical URLs

All 262 canonical and Open Graph URLs use `https://msqe.dev/` in both modes.
No canonical URL implementation or instructional reference was changed.

## 11. WWW redirect design

Cloudflare Bulk Redirect, **301**, `www.msqe.dev` → `https://msqe.dev`;
subpath matching, path suffix and query preservation, scoped to www only.
Example `/handbook/?q=api` retains its path/query. Proxied DNS and certificate
activation are future operations. See
[Cloudflare www guidance](https://developers.cloudflare.com/pages/how-to/www-redirect/).

## 12. HTTPS design

Require valid managed Pages edge certificates for apex/www and HTTP → HTTPS.
Always Use HTTPS, certificate activation, redirect loops and mixed-content
checks remain pending. No SSL/TLS setting changed.

## 13. Security headers

Prepared `public/_headers`: same-origin CSP with `wasm-unsafe-eval` for Pagefind,
inline CSS allowance for syntax highlighting, no arbitrary script eval or inline
scripts; nosniff; strict-origin-when-cross-origin referrer policy; device/payment
permissions denied; frame-ancestors none and X-Frame-Options DENY.
Apex-only HSTS `max-age=86400`, without includeSubDomains/preload.

Chrome successfully ran search/pagination with those headers: zero CSP violations
or console errors. The local HTTP fixture is not a Cloudflare emulator; actual
edge parsing, HTTPS HSTS enforcement and response coverage remain live-only.
Full policy rationale is in PRODUCTION_READINESS.md.

## 14. License production verification

All pages link to the working `/license/` route. Generated content preserves
Copyright © 2026 Babatunde Ajala, CC BY 4.0 educational material, Apache-2.0
software/tooling and third-party rights. Root license files are unchanged.

## 15. External-reference state

Preserved: **0 confirmed materially broken instructional URLs**; 24 mechanically
unverified references remain not established broken. No online re-audit or
canonical reference correction was performed. Source/reference preservation passed.

## 16. Pagefind production verification

258 documents indexed; home, license, search and 404 are intentionally excluded.
All Pagefind files are byte-identical to baseline. Chrome searches returned:

| Query | Results |
| --- | ---: |
| Playwright | 12 |
| API testing | 101 |
| data quality | 171 |
| observability | 180 |
| AI quality | 79 |
| metamorphic testing | 5 |
| security | 93 |
| performance | 111 |
| quality engineering | 209 |

Top results matched representative subject expectations, used existing public
relative routes, and pagination worked. Full observed titles/routes are recorded
in `evidence/web5d/verification.json`.

## 17. Production page/build census

| Measure | Production |
| --- | ---: |
| HTML pages | 262 |
| Pagefind indexed pages | 258 |
| Chapters / Parts | 137 / 12 |
| Resource pages | 105 (103 documents + 2 collections) |
| Sitemap URLs | 260 |
| Internal links/fragments, default DOM | 13,587 |
| Including no-JavaScript fallback | 13,588 |
| Broken generated destinations | 0 |
| Referenced browser assets checked | 525 |
| Output files | 579 |
| Dist size | 11,609,685 bytes |
| JavaScript size | 89,438 bytes |
| CSS size | 8,274 bytes |
| Pagefind directory | 3,529,487 bytes |
| Pagefind index + fragment payload | 3,298,802 bytes |

Sizes are uncompressed file-byte sums, not transfer estimates. Baseline dist:
11,610,192 bytes. Production changes by **−507 bytes**: header file +517,
260 robots meta values −1,040, robots.txt +16. Default preview adds only the
517-byte header file (11,610,709 bytes). No pages, navigation or search assets
were added/removed. The broader link count includes the existing noscript
fallback; it does not represent new navigation.

## 18. Internal-link validation

Existing complete smoke scan: 13,587 internal links/fragments, zero failures.
New check includes the noscript fallback: 13,588, zero broken destinations.
A separate Python HTML/XML parser reproduced 262 pages, 260 sitemap URLs,
13,588 links and 525 asset references with no broken or remote asset references.
This separate implementation is still author testing, not an independent reviewer.
The pre-existing ten deferred source-link occurrences / one target remain
explicitly reported inert content, not broken generated destinations.

## 19. 404/static assets

Top-level `404.html` exists; Home, Handbook, Resources and Search recovery links
work. favicon.svg, favicon.ico, CSS, search JS and Pagefind JS/WASM/index assets
are present. Local fixture returned 404 for a missing route. Actual Pages 404
status, MIME types and redirects remain future checks.

## 20. Privacy/tracking audit

Implemented integrations: zero analytics, tracking pixels, advertising,
authentication, payments and learner-data collection. No cookie banner is needed
by implemented functionality. Source/output audit and search browser session
observed zero third-party runtime requests, cookies and local/session storage.
Cloudflare-added scripts and provider logging require future account/live review.

## 21. Secrets/environment audit

No API key, credential, Cloudflare token or secret runtime variable is required.
Targeted credential/private-key signature scan of 376 tracked files found zero
hits; new files contain only non-secret configuration/testing/documentation.
This is a bounded signature audit, not a guarantee about every possible format.
`MSQE_INDEXING`, `NODE_VERSION` and `SKIP_DEPENDENCY_INSTALL` are non-secret build
configuration; Astro scripts disable telemetry.

## 22. Cloudflare documentation

PRODUCTION_READINESS.md now describes exact verified commands, version guard,
output, environment scopes, sitemap/canonical behavior, headers and domain design,
with current official Cloudflare references. It removes the stale npm override
and WEB-5BR next-step assumptions without changing historical governance.

## 23. Deployment runbook

PRODUCTION_DEPLOYMENT_RUNBOOK.md contains PRE-DEPLOYMENT, DEPLOY, DOMAIN, HTTPS,
INDEXING, POST-DEPLOYMENT QA and ROLLBACK. It explains restoring a known-good
production deployment without rewriting Git history, separately restoring
infrastructure settings, and agreeing a first-launch fallback when no previous
production deployment exists.

## 24. Live acceptance checklist

PRODUCTION_ACCEPTANCE_CHECKLIST.md covers every requested live surface, domain,
HTTPS, www, content/search/resources, licenses, 404, assets, robots/sitemap,
canonical URLs, mobile, keyboard, references, headers, privacy and console errors.
**All live-only items remain unchecked / PENDING.**

## 25. Website tests

Final result: **49 PASS / 0 FAIL per mode** (39 original + 10 output tests),
plus **2 PASS / 0 FAIL** dedicated production browser tests. Existing 39 tests
are preserved. Added checks cover indexing, robots, canonical host leakage,
sitemap, license output, build contract, assets, 404, full links and headers.
Both final default/preview and production runs exited 0.

## 26. Production build validation

Exact Pages install/build command: exit 0. `verify:production`: 49 PASS / 0 FAIL,
static build/smoke PASS. Header browser tests: 2/2 PASS. Production output is
retained locally, not published. Preview and production census/evidence are
recorded separately. An initial test implementation typing issue and noscript
count assumption were corrected before the final passing run; no product/content
change was needed for either.

## 27. MSQE regression

35 PASS / 0 FAIL / 0 ERROR. Unchanged baseline gate: 7 PASS / 0 FAIL, exit 0.
First Edition checker and constants were not modified.

## 28. Source preservation

All 310 tracked files outside `website/` match required base Git blob identities.
No manuscript, license policy, external-reference or governance mutation.
Index is clean; HEAD remains the required baseline.

## 29. Production-readiness matrix

| Area | Classification |
| --- | --- |
| Build contract | READY |
| Cloudflare compatibility | READY WITH NON-BLOCKING LIMITATION — actual v3 toolchain and edge execution pending |
| Production indexing | READY |
| Robots | READY |
| Sitemap | READY |
| Canonical URLs | READY |
| WWW redirect design | REQUIRES LIVE DEPLOYMENT VALIDATION |
| HTTPS design | REQUIRES LIVE DEPLOYMENT VALIDATION |
| Security headers | READY WITH NON-BLOCKING LIMITATION — Chrome fixture passed; edge/TLS validation pending |
| Search | READY |
| Resources | READY |
| Licensing | READY |
| Internal links | READY |
| External-reference state | READY WITH NON-BLOCKING LIMITATION — accepted 24 unverified references preserved |
| Privacy | READY WITH NON-BLOCKING LIMITATION — provider configuration not inspected |
| Secrets | READY |
| Rollback | READY WITH NON-BLOCKING LIMITATION — live target/fallback must be recorded |
| Live QA plan | READY |

No unresolved repository-level production blocker. Live infrastructure has not
been provisioned or independently validated.

## 30. Remaining live-only validations

Pages project/Git connection, remote toolchain, build execution, apex DNS/custom
domain, certificates, HTTPS/www/alias redirects, edge headers and HSTS, actual
404/MIME/cache behavior, public indexing, provider script injection, mobile and
cross-browser live QA, known-good rollback target. No live-only PASS is claimed.

## 31. Repository mutation state

**UNSTAGED / UNCOMMITTED / UNPUSHED**. No main/develop changes, merge, tag, release,
Cloudflare project, Git connection, DNS/nameserver, domain/redirect, deployment or
public indexing operation. Only website preparation files changed.

## 32. Final decision

**A — WEB-5D PRODUCTION DEPLOYMENT PREPARATION COMPLETE; STATIC PRODUCTION
CANDIDATE VERIFIED; READY FOR FRESH INDEPENDENT WEB-5DV.**

Here “verified” describes local author checks; fresh independent acceptance is
still required and has not been performed by the correction author.

## 33. Exact recommended next action

Run **fresh independent WEB-5DV** against these unstaged changes on the specified
branch/base, re-derive source and production evidence, and review live-only
limitations. Do not deploy, stage, commit, push, change DNS or mutate Cloudflare
as part of WEB-5D. **STOP.**
