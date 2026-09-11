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
