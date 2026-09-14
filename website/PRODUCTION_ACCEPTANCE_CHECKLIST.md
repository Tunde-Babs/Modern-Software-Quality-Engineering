# MSQE future live acceptance checklist

**NOT EXECUTED — every item below requires live deployment validation.**
Do not convert local test results into live PASS. Record operator, UTC time,
reviewed commit, Pages deployment ID, toolchain and production environment scope.
Target `https://msqe.dev`; MSQE v0.16.0 / LEARNING-READY — CONTROLLED RC.

## Domain, routing and transport

- [ ] Apex HTTPS resolves with valid certificate/chain and expected deployment.
- [ ] HTTP apex redirects to HTTPS, with no loops or mixed content.
- [ ] HTTPS and HTTP www redirect permanently to apex; retain path/query. Test
      `/handbook/?q=api` and a nested chapter route.
- [ ] Production pages.dev alias redirects to apex; hash/branch previews remain
      noindex. No canonical host leakage or accidental preview indexing.
- [ ] Trailing slash and `.html` handling preserve working public navigation.
- [ ] Unknown nested URL returns real HTTP 404 with the MSQE recovery page;
      Home, Handbook, Resources and Search recovery links return 200.

## Content and search

- [ ] Homepage shows the controlled RC identity, with no First Edition completion claim.
- [ ] Handbook index, all 12 Part indexes and all 137 chapter routes respond.
- [ ] Read representative chapters from Parts I, III, VI, IX and XII; inspect
      headings, tables, code, references and cross-part links.
- [ ] Resources index and 105 resource pages (103 documents + two collections)
      respond; software examples remain inert and public teaching docs work.
- [ ] QA Foundations path follows the canonical Part I chapter sequence.
- [ ] `/license/` shows Copyright © 2026 Babatunde Ajala, CC BY 4.0 educational
      content, Apache-2.0 software and separate third-party rights; footer links work.
- [ ] Search works for Playwright, API testing, data quality, observability,
      AI quality, metamorphic testing, security, performance, quality engineering.
- [ ] Search results are relevant local public routes; follow results and test
      more results, empty input, no matches and actionable load failure.
- [ ] Favicon SVG/ICO, CSS, JS, Pagefind metadata/chunks and WASM load with correct
      MIME types; no missing assets or stale index after deployment.
- [ ] Complete internal link/fragment scan: zero broken generated destinations.
- [ ] Sample accepted external references by navigation; preserve the 24
      unverified references unless new material evidence supports a defect.

## Indexing and browser behavior

- [ ] Production robots.txt allows public crawling, disallows `/search/`, and
      advertises `https://msqe.dev/sitemap.xml`.
- [ ] Sitemap has exactly 260 unique intended apex URLs, no 404/search/governance
      routes, no localhost/pages.dev/www host leakage, and all URLs return 200.
- [ ] All 262 HTML canonical and Open Graph URLs use `https://msqe.dev/`.
- [ ] 260 content pages have `index, follow`; search/404 are noindex. No apex
      response-level noindex overrides; preview metadata and headers stay noindex.
- [ ] Desktop, tablet, mobile and 200% zoom layouts remain usable; inspect
      representative tables/code/search results for horizontal page overflow.
- [ ] Keyboard-only skip link, menus, TOC, chapter navigation, resources,
      search form/results/pagination and visible focus work.
- [ ] No console-breaking errors, CSP violations, failed module/WASM requests or
      mixed content; inspect both Chrome and another current browser.

## Headers, privacy and operations

- [ ] CSP, nosniff, Referrer-Policy, Permissions-Policy, X-Frame-Options and
      frame-ancestors match `website/public/_headers`; confirm edge parser success.
- [ ] HTTPS apex emits HSTS `max-age=86400`; no unintended subdomain/preload commitment.
- [ ] Record complete third-party runtime request inventory (expected zero).
      No analytics, pixels, advertising, authentication, payments, learner-data
      collection, cookies/storage or consent banner required by implemented code.
- [ ] Cloudflare account adds no Web Analytics, Zaraz or other tracking scripts;
      record hosting/provider logging separately from application behavior.
- [ ] No runtime key, token, binding, environment secret or source/governance file
      is exposed by static output. Only `website/dist` is served.
- [ ] Record known-good production deployment and rollback target; confirm first
      launch fallback if no prior production exists. Retain logs and QA evidence.

Outcome: **PENDING LIVE DEPLOYMENT**. This checklist is not deployment authorization.


## INITIAL WEB-5L LIVE RESULT — SUPERSEDED (2026-09-14)

Historical intermediate evidence only. The infrastructure-access limitations and
27/0/5 Decision C below were resolved by the final authenticated result following
this section; they are not the current production or acceptance state.

The preceding WEB-5D text is the **PRE-LAUNCH PLAN / point-in-time evidence**;
its unexecuted labels and unchecked boxes are preserved. Actual public activation
was **2026-09-11**, distinct from this record date. The live portal is publicly
available at <https://msqe.dev> as **MSQE v0.16.0 — LEARNING-READY — CONTROLLED RC**.
See [the canonical WEB-5L record](LIVE_LAUNCH_ACCEPTANCE.md) for the itemized
**INITIAL LIVE RESULT: 27 PASS / 0 FAIL / 5 INCOMPLETE — Decision C (SUPERSEDED)** and evidence provenance.

The reported actual production branch is `feature/first-edition-review`, source
`7028166b223322afc97af05d6ad6dfecef09dc8f`; the earlier proposed branch is historical.
The reported successful command is unchanged, with `NODE_VERSION=24.20.0`,
`SKIP_DEPENDENCY_INSTALL=1` and production-only `MSQE_INDEXING=production`.
Local Node 24.20.0/npm 11.19.0 validation passed. The supplied Node 22.16.0 guard
rejection, corrected environment and intentional first noindex deployment are
recorded as launch history, pending authenticated Cloudflare corroboration.

Fresh live checks demonstrate apex HTTPS, www 301 with path/query preservation,
RC identity, representative navigation, Playwright search (12 results / 10 initially),
licensing, custom HTTP 404, assets, apex headers, public indexing with search/404
exclusions, and 260 unique apex sitemap locations. Actual robots.txt is `Allow: /`
with `Disallow: /search/`, permitting public crawling. Local preview/production
verification passed 49/49 each; production browser 2/2; MSQE 35/35; baseline 7/7.

Cloudflare deployed identity/build logs, remote toolchain and dashboard domain
Active/SSL/Pages associations remain **INCOMPLETE** because private dashboard
access was rejected by automatic approval review pending explicit authorization.
Public behavior is not substituted for that infrastructure evidence. Broader
unchecked pre-launch items are not implicitly passed by these narrower live checks.
First Edition remains **IN PROGRESS**, 15 findings OPEN / NOT VERIFIED and 14
CLOSED / VERIFIED; FE-1=6, FE-2=5, FE-3=4 outstanding; v1.0.0 NOT YET RELEASED.


## FINAL WEB-5L LIVE ACCEPTANCE

**32 PASS / 0 FAIL / 0 INCOMPLETE — Decision A.**
**MSQE v0.16.0 — LEARNING-READY — CONTROLLED RC: PUBLICLY LAUNCHED / ACCEPTED.**
**Production evidence: AUTHENTICATED.** Public site: <https://msqe.dev>.
Actual first public activation: **2026-09-11**; durable acceptance record:
**2026-09-14**. The [canonical launch record](LIVE_LAUNCH_ACCEPTANCE.md) contains
Cloudflare's exact production source/deployment identity, successful build and
Node 24.20.0/npm 11.19.0 guard evidence, required production variables, and apex/www
Pages **Active / SSL enabled** states. The earlier 27/0/5 Decision C is preserved
above as superseded evidence, not an outstanding infrastructure gap.

WEB-5LV independently accepted the live production evidence. Its overall record
review was **31 PASS / 3 FAIL / 0 INCOMPLETE, Decision B**: preview preservation,
production preservation and current-status reconciliation required correction.
WEB-5LF1 addresses those bounded record/test defects; fresh independent **WEB-5LV2**
is required before accepting the corrected repository package. The public deployment
itself was not rejected. No redeployment or infrastructure change is required.

**First Edition: IN PROGRESS. v1.0.0: NOT YET RELEASED.** Findings remain
**29 total; 15 OPEN / NOT VERIFIED; 14 CLOSED / VERIFIED**. Outstanding allocation:
**LR-1=0; LR-2=0; FE-1=6; FE-2=5; FE-3=4**. No finding closes through WEB-5LF1.

The original pre-launch plan/checklist and operational deployment/rollback guidance
remain usable and preserved. Broader unperformed checklist items remain historical
unchecked items; they are not all marked PASS and do not invalidate the formal
32-control WEB-5L acceptance. The final result applies only to the controls actually
demonstrated in WEB-5L/WEB-5LV and their recorded scope.
