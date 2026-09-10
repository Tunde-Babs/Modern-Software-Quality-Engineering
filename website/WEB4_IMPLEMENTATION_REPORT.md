# MSQE — WEB-4 Public Learning Experience & Launch Hardening Report

Author implementation evidence — 2026-09-10. This is not independent verification,
publication approval, or a checkpoint. No deployment occurred.

## 1. Executive verdict

WEB-4 implementation is complete and ready for fresh independent verification.
The static portal now offers Pagefind search, all appropriate delivered companions,
one defensible learning path, accessibility fixes, canonical metadata and indexing
configuration, favicon assets, and an external-reference census.

Production remains blocked for WEB-5 by the unresolved license and material external
references requiring source-owner disposition. Native browser zoom confirmation has
an explicit tooling limitation; the automated 200% layout matrix passed.

## 2. Preflight

Required branch `feature/web-4-learning-experience`; HEAD
`89e8b65cb2e96d77103292d5bba119304602c04b`. Working tree and index were clean.
All four baseline commands (`ci`, `check`, `build`, `verify`) exited 0.
27/27 tests; 137 chapters; 12 Part indexes; 94 resources; 247 HTML pages;
12,564 internal links/fragments; zero broken destinations; 378/378 references.
MSQE regression: 35 PASS / 0 FAIL / 0 ERROR. Baseline: 7 PASS / 0 FAIL, exit 0.
No material baseline drift was found.

## 3. Branch/base authentication

Read-only live `git ls-remote` authenticated WEB-4, WEB-3, and
`feature/first-edition-review` at the exact required baseline. Local WEB-4 tracking
divergence was 0 ahead / 0 behind; equal commit identity establishes ancestry.
No branch switch, fetch-based ref update, commit, merge, rebase, push, tag, or release
was performed. The initial sandbox DNS restriction was resolved with an approved
read-only network invocation.

## 4. Exact changed paths

- `website/PRODUCTION_READINESS.md`
- `website/README.md`
- `website/WEB4_IMPLEMENTATION_REPORT.md`
- `website/package-lock.json`
- `website/package.json`
- `website/playwright.config.ts`
- `website/public/favicon.ico`
- `website/public/favicon.svg`
- `website/public/search.js`
- `website/scripts/external-links.ts`
- `website/scripts/prune-search.mjs`
- `website/src/components/Navigation.astro`
- `website/src/layouts/Base.astro`
- `website/src/layouts/Part.astro`
- `website/src/layouts/Reading.astro`
- `website/src/lib/content/loader.ts`
- `website/src/lib/content/registry.ts`
- `website/src/lib/paths.ts`
- `website/src/pages/404.astro`
- `website/src/pages/index.astro`
- `website/src/pages/paths/[slug].astro`
- `website/src/pages/paths/index.astro`
- `website/src/pages/resources/[...slug].astro`
- `website/src/pages/resources/index.astro`
- `website/src/pages/robots.txt.ts`
- `website/src/pages/search.astro`
- `website/src/pages/sitemap.xml.ts`
- `website/src/styles/global.css`
- `website/tests/browser/experience.spec.ts`
- `website/tests/build-smoke.ts`
- `website/tests/full-handbook.test.ts`
- `website/tests/preservation.ts`
- `website/tests/web4.test.ts`

Generated `dist/`, `.astro/`, `node_modules/`, and validation `artifacts/` remain
ignored. Historical WEB-2/WEB-3 reports are unchanged.

## 5. Pagefind implementation

Pinned Pagefind 1.5.2 runs after every Astro build. It indexes 258 English pages and
11,915 words from `data-pagefind-body`: all 137 chapters, 12 Part summaries,
103 resource documents, two resource collections, handbook/resources indexes,
and two learning-path pages. Home, search and 404 are not indexed.

`/search/` has an explicit label, keyboard-submittable form, polite status region,
results with titles/snippets/destinations, ten-result pagination, empty/no-results
states, and load-failure/no-JavaScript guidance. Pagefind loads only after a query;
there is no backend or external search provider. DOM text rendering keeps snippets
inert; destinations are checked for same origin. Search does not persist queries.

Header/footer/breadcrumb/TOC/readiness/navigation boilerplate is excluded where
practical. Canonical Chapter Navigation blocks remain visible but are excluded
from the index. Optional stock Pagefind UI/highlight assets are removed after build;
core JS, worker, WASM, metadata, indexes and fragments remain.

Implementation follows the [Pagefind API](https://pagefind.app/docs/api/) and
[static indexing workflow](https://pagefind.app/docs/running-pagefind/).

## 6. Search quality

Real Chrome searches against the generated static index passed:

| Query | Results | First result |
|---|---:|---|
| Playwright | 12 | Chapter 5 — Browser Automation as an Engineering System |
| API testing | 101 | Chapter 1 — API Quality Engineering: Boundaries, Outcomes, and Evidence |
| data quality | 171 | Chapter 8 — Functional, Quality-Attribute, and Data-Oriented Evidence |
| observability | 180 | Chapter 5 — Designing Observable Systems for Quality Engineering |
| AI quality | 79 | Chapter 1 — AI Quality Engineering: Behaviour, Evidence, and Boundaries |
| metamorphic testing | 5 | Chapter 6 — Robustness, Metamorphic Testing, and Adversarial Inputs |
| security | 93 | Chapter 10 — Security Evidence: Findings, Verification, and Residual Risk |
| performance | 111 | Chapter 11 — Performance–Security Trade-offs, Regression, and Decision Readiness |
| quality engineering | 209 | Chapter 1 — Engineering Leadership as Quality Engineering |
| "metamorphic testing" | 2 | Part IX — AI Quality Engineering |

Relevant chapters appear in the first ten results for every representative query.
The exact phrase also returns the relevant Part IX chapter. Nonsense input returns
no results, clearing returns the empty state, and blocked index requests show an
actionable error. Keyboard submission/result navigation, mobile overflow, and
result-state axe checks passed. Requests observed during search were same-origin.
This is keyword/phrase search, not semantic search; broad queries naturally match
many chapters. Reproducible evidence: `artifacts/search-quality.json` and the browser
JSON attachment named `search-evidence`.

## 7. Delivered-resource routing

Reconstructed from the baseline renderer's actual issues: 14 Class A occurrences,
seven targets. Each target exists and is a teaching fixture or teaching directory,
not repository administration. Four further capstone documents were reviewed and
included so the delivered docs directory is complete.

| Original target | Occurrences | Disposition | Public route |
|---|---:|---|---|
| `code/part-02-programming/capstone-quality-engineering-toolkit/docs` | 3 | PUBLIC LEARNING RESOURCE | `/resources/code/part-02/capstone-quality-engineering-toolkit/docs/` |
| `code/part-02-programming/capstone-quality-engineering-toolkit/docs/limitations-and-residual-risk.md` | 1 | PUBLIC LEARNING RESOURCE | `/resources/code/part-02/capstone-quality-engineering-toolkit/docs/limitations-and-residual-risk/` |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/change-plan.md` | 3 | PUBLIC LEARNING RESOURCE | `/resources/code/part-02/delivery-04-collaborative-tested-utilities/docs/change-plan/` |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/expected-commit-plan.md` | 1 | PUBLIC LEARNING RESOURCE | `/resources/code/part-02/delivery-04-collaborative-tested-utilities/docs/expected-commit-plan/` |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/pull-request-description.md` | 3 | PUBLIC LEARNING RESOURCE | `/resources/code/part-02/delivery-04-collaborative-tested-utilities/docs/pull-request-description/` |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/review-comments.md` | 2 | PUBLIC LEARNING RESOURCE | `/resources/code/part-02/delivery-04-collaborative-tested-utilities/docs/review-comments/` |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/test` | 1 | PUBLIC LEARNING RESOURCE | `/resources/code/part-02/delivery-04-collaborative-tested-utilities/test/` |

Final Class A = 0; Class B = 0; Class D = 0. Class C remains ten occurrences of the
single intentionally non-public `docs/00-project/QA_TO_QE_TRANSITION_FRAMEWORK.md`.
Missing targets/fragments still fail rather than silently becoming omissions.
The code-project docs allowlist is explicit; arbitrary docs remain excluded.

## 8. Resource experience

105 resource pages = 103 canonical resource documents + two collection indexes,
up from 94 documents. Nine new Markdown teaching artifacts retain their canonical
content. Every resource has its type and use guidance; direct chapter backlinks
are derived from rendered canonical references, and code artifacts link back to
their project. Project overviews list all delivered routed files. The two collection
indexes list their real members. No inferred career or chapter relationships were
invented. All 103 documents participate in preservation checks.

## 9. Learning paths

`/paths/` and `/paths/qa-foundations/` are implemented with a website-local definition.
QA Foundations follows all ten Part I chapters in canonical order, supplies purpose,
intended audience, chapter-level study estimates, and continuation to Part II.
It does not duplicate instructional prose or promise occupational readiness.
The five other proposed career paths are deferred pending pedagogical sequencing
review; speculative routes were not created.

## 10. Mermaid/diagram decision

Graphical Mermaid is EXPLICITLY DEFERRED / NON-BLOCKING. The eleven diagram resources
retain selectable Mermaid source and surrounding canonical explanation. Build-time
SVG generation would add a rendering/sanitization/accessibility pipeline and
browser/font determinism requirements beyond this bounded package. Runtime Mermaid
was not added. The learner-facing note states that graphical rendering is unavailable.
Dark mode is also deferred; the established light theme remains supported.

## 11. Accessibility hardening

Axe exposed missing accessible names on rendered Markdown checklist checkboxes.
The renderer now assigns the existing checklist text as the accessible name after
sanitization, without changing source prose. Focus-visible styling now covers input
and button controls as well as links, summaries and overflow regions.

Every generated page is checked for one H1, heading progression, language, main/header/
footer landmarks, skip destination, unique IDs, ARIA references, non-positive tabindex,
accessible tables and code regions, named task checkboxes, image alt contracts,
valid navigation destinations, and metadata. Part breadcrumbs now include the current
Part. Reduced-motion support is retained. Axe checks include WCAG 2.2 AA tags and
color contrast. This is architecture/test evidence, not formal WCAG certification
or a substitute for assistive-technology user testing.

## 12. Browser accessibility/responsive results

43/43 Chrome tests passed: forty matrix cases (ten page samples × four configurations)
and three interaction/search/error suites. Samples: home, handbook, search, resources,
QA Foundations, and Chapter 1 from Parts I, III, VI, IX and XII.

Configurations: 1440×1000, 768×1024, 375×812, and 1440×1000 with 200% CSS layout zoom.
No material page-level horizontal overflow; every matrix axe scan passed. Keyboard
checks reached the skip link/main, primary search navigation, query/results, TOC,
next chapter, resource links and learning-path chapters. Screenshots were inspected
for mobile search/results and enlarged homepage layout.

**Limit:** 200% here is automated CSS zoom, explicitly not an assertion of native
browser zoom equivalence. The native Chrome connector timed out and later returned
incomplete zoom/menu state and no screenshot; native zoom percentage could not be
reliably confirmed. Native zoom and screen-reader spot checks should be included in
fresh independent verification. Browser results are in `artifacts/browser-results.json`;
tests use local Chrome and a static Python server, not a deployed environment.

## 13. SEO hardening

All 261 pages have unique titles, nonempty descriptions, absolute canonical URLs,
Open Graph title/description/URL/type/site name, and semantic headings. Resource
descriptions now explain their learning role. Sitemap equality with public content
routes is tested. The sitemap contains 259 URLs, excluding search and 404.
Additional schema was considered but not added: no unverified publication/license
claims or redundant structured data were needed for this bounded launch surface.

`MSQE_INDEXING=production` is an explicit build-time opt-in. Default builds emit
`noindex, nofollow` on every page and `Disallow: /` in robots.txt. A separate local
production-mode build validated all 261 metadata decisions: content becomes indexable,
search/404 remain noindex. The retained `website/dist` remains the preview build.

## 14. Canonical-domain preparation

Every canonical uses `https://msqe.dev/...`. WEB-5 must configure HTTPS, host redirects
and duplicate-host handling, including `www.msqe.dev` → `msqe.dev` with path/query
preservation. No DNS or host settings were changed.

## 15. External-link inventory/validation

210 unique exact HTTP(S) URLs; 60 domains;
744 rendered learner-facing anchor occurrences. Main-content anchors
are counted; duplicated visible references remain separate occurrences. Fragments
are retained in the inventory but omitted from HTTP probes; remote fragment validity
is not claimed. Latest probe: `2026-09-10T15:00:09.945Z`.

| Classification | Unique URLs |
|---|---:|
| VALID | 161 |
| REDIRECT | 19 |
| BROKEN | 5 |
| TIMEOUT/UNVERIFIED | 25 |

Bounded concurrency, 12-second request timeouts, redirects followed, HEAD with GET
fallback for error responses. Authentication denial, throttling, server errors and
transport failures remain unverified rather than being called broken. GET rechecking
resolved initial NIST false negatives. Five URLs still returned HTTP 404:

| URL | GET status | Occurrences | Affected Part / chapter |
|---|---:|---:|---|
| https://openssf.org/best-practices/ | 404 | 1 | part-07 / 04 |
| https://owasp.org/API-Security/editions/2023/en/0x03-introduction/ | 404 | 4 | part-10 / 02, part-10 / 09 |
| https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/ | 404 | 1 | part-04 / 06 |
| https://owasp.org/www-project-api-security/ | 404 | 1 | part-04 / 10 |
| https://owasp.org/www-project-application-security-verification-standard/ | 404 | 5 | part-10 / 08, part-10 / 10, part-10 / 12 |

These are material instructional references and are **BLOCKED FOR WEB-5** pending
source-owner verification and authorized correction or documented disposition.
No canonical URL was rewritten or hidden. The complete per-URL/per-page inventory,
statuses, redirect destinations and errors are in `artifacts/external-links.json`;
regenerate with `npm --prefix website run links -- --online`. External HTTP health
is time-sensitive; passing responses do not establish source authority or access
for every reader. The 25 unverified URLs require follow-up, especially standards
publishers that deny automated requests.

## 16. Favicon/basic branding

Small original MSQE M marks are supplied as SVG and ICO. Shared metadata points to
the SVG; both `/favicon.svg` and conventional `/favicon.ico` return HTTP 200 in the
static browser tests. No third-party artwork or broader brand redesign was introduced.

## 17. Homepage/learner navigation

Start Learning and Explore Handbook remain primary. Home and header now link to
Search, Learning Paths and Resources. The unavailable About placeholder was removed.
All 136 canonical chapter transitions remain reciprocal; Part/index navigation
continues across the full handbook.

## 18. Status/readiness communication

The exact status configuration remains `MSQE v0.16.0` and
`LEARNING-READY — CONTROLLED RC`. Existing concise copy states productive-learning
suitability, ongoing First Edition remediation, and that this is not final First
Edition publication. No v1.0.0 claim or governance mechanics were added.

## 19. 404/error experience

The static 404 gives a clear missing-address message and home, search, handbook and
resource links. Search has a retry/browse error message and no-JavaScript fallback.
WEB-5 must verify its host serves the custom 404 with the correct status code.

## 20. Performance/static architecture

| Measure | Final |
|---|---:|
| HTML pages | 261 |
| Total dist bytes | 11,587,784 |
| HTML bytes | 8,016,244 |
| Largest HTML | 100,256 bytes |
| CSS | 8,274 bytes |
| All shipped JS files | 89,438 bytes |
| Pagefind bundle, including indexes | 3,529,487 bytes |
| Search controller | 2,628 bytes |
| Pagefind core JS | 45,555 bytes |
| English WASM | 72,740 bytes |

Baseline dist was 7,915,170 bytes: final growth is 46.4%, chiefly the static search
index. This is a material, expected artifact-size increase, not a page-load transfer
on every visit. Normal reading pages load zero JS; only search loads its 2,628-byte
controller, then Pagefind and query-relevant chunks. Optional unused stock Pagefind
assets were removed, saving 418,109 bytes. Largest HTML remains the Part XI capstone.
A measured full Astro+Pagefind build took 7.38 seconds wall time before the negligible
pruning step; final verify reported Astro/Pagefind success. The preflight Astro build
was about 4.8 seconds. No backend or hydration framework was added.

## 21. Security/privacy

No login, learner account, payment, analytics, ads, tracking cookie, personal-data
collection, credential or runtime service. Source Markdown remains sanitized;
code and teaching documents are inert. HTTP(S) URLs are validated and unsafe schemes
rejected. External links use the current tab; future `_blank` links are tested for
rel protection. No tracking parameters were introduced.

New pinned dependencies: Pagefind 1.5.2; test-only @playwright/test 1.63.0 and
@axe-core/playwright 4.13.0. npm install audited 342 packages with zero reported
vulnerabilities. Existing esbuild/fsevents install-script notices were observed;
no broad script-approval policy was changed. Browser dependencies are test tooling
and do not enter the public build. Network probes are author tooling only.

## 22. License boundary

**LICENSE DECISION REQUIRED BEFORE WEB-5 PRODUCTION LAUNCH**

LICENSE remains blank and unchanged. No license, redistribution permission, Creative
Commons designation or manuscript open-source claim was invented. License readiness
is **BLOCKED FOR WEB-5** until founder decision and separately authorized implementation.

## 23. Cloudflare production preparation

See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md). Repository-root build:
`npm --prefix website ci && npm --prefix website run build`; output `website/dist`.
Node >=22.12.0 required; tested Node 24.20.0 / npm 11.19.0. Configure production-only
indexing after blockers, serve JS/WASM correctly, set HTTPS/host redirects, custom
404 status, cache invalidation and validated response headers in WEB-5.
The static-output approach matches [Cloudflare's Astro guidance](https://developers.cloudflare.com/pages/framework-guides/deploy-an-astro-site/).
No infrastructure was configured.

## 24. Website tests

37/37 unit tests passed: all 27 existing test cases retained and ten WEB-4 tests
added. Existing census assertions were updated for the explicitly approved companions.
New coverage includes seven-target reconciliation, collection membership, allowlist,
path sequence, external inventory/classification, Pagefind build contract, accessible
search structure, favicon, and preview/production indexing architecture.

Build-smoke verifies index/assets, every page's metadata/accessibility/link contract,
sitemap coverage, checkboxes and source/reference preservation. Browser suite: 43/43.

## 25. Complete website validation

`npm --prefix website ci`, `run check`, `run build`, and `run verify` all exited 0.
Final verify: 37 tests, zero type errors/warnings/hints, 261 HTML pages,
258 search-indexed pages, 13,319 checked internal links/fragments, zero broken
public destinations, 105 resource pages, one path, 259 sitemap URLs, 378/378 references.
The final distribution-pruning change was followed by verify and the full browser suite.

## 26. Existing MSQE regression

The exact requested Python unittest command passed 35/35 with zero failures/errors.
`first_edition_gate.py --profile baseline` passed all seven checks, exit 0, both at
preflight and after implementation. First Edition tools/tests were not modified.
Automation is not semantic acceptance or First Edition approval.

## 27. Source preservation

Authenticated against `89e8b65cb2e96d77103292d5bba119304602c04b`: all 276 protected
files match exact baseline Git blobs. This expands the older 275-file census to
include all of `tools/`, rather than only the gate script. Protected manifest SHA-256:
`aecdad3ed906a4221b108237bdd82eabe682128f6c75dd9d055208cfb744ce52`.
Tracked and nonignored untracked changes outside website are both asserted absent.
Canonical reference count remains 378/378. No source prose, findings/events,
CHANGELOG, LICENSE, First Edition checker/tests, labs, code, diagrams or Part README
was edited. All source transformations remain website-local presentation/indexing.

## 28. Launch-readiness matrix

| Area | Classification | Evidence or remaining limit |
|---|---|---|
| Content completeness | READY | 137 chapters; 378/378 references preserved |
| Internal navigation | READY | 13,319 validated links/fragments; zero broken |
| Search | READY | Static Pagefind; ten representative query cases; keyboard/mobile/error states |
| Resource routing | READY | Class A/D zero; 105 public resource pages; explicit governance exclusion |
| Learning paths | READY WITH NON-BLOCKING LIMITATION | One canonical foundations path; career paths deferred |
| Diagram usability | READY WITH NON-BLOCKING LIMITATION | Mermaid source/explanation retained; graphics deferred |
| Accessibility | READY WITH NON-BLOCKING LIMITATION | Whole-site structural checks and representative axe pass; no certification/screen-reader claim |
| Responsive design | READY WITH NON-BLOCKING LIMITATION | 40 matrix cases pass; native zoom confirmation limited by connector |
| SEO | READY | Canonical metadata and preview/production switch checked |
| Sitemap | READY | 259 exact public content URLs |
| External links | BLOCKED FOR WEB-5 | Five 404 URLs / 12 occurrences; 25 further URLs unverified |
| Performance | READY WITH NON-BLOCKING LIMITATION | Search adds static artifact size; zero JS on reading pages |
| Security/privacy | READY | Static, same-origin search; no accounts/tracking/backend |
| Status truthfulness | READY | v0.16.0 controlled RC wording retained |
| License | BLOCKED FOR WEB-5 | Founder license decision required |
| Deployment configuration | READY WITH NON-BLOCKING LIMITATION | Commands/output/switch documented; host behavior awaits authorized WEB-5 validation |

## 29. Remaining WEB-5 blockers

1. Founder license decision and separately authorized license implementation.
2. Source-owner disposition of the five materially broken external instructional URLs;
   follow up on the 25 unverified URLs without treating blocked probes as confirmed failures.
3. Fresh independent WEB-4 verification before checkpoint, then separately authorized
   WEB-5 host/DNS/HTTPS/indexing/cache/response-header/404 validation.

## 30. Risks/observations

Graphical Mermaid, dark mode and five speculative career paths are intentionally
deferred. Native zoom and screen-reader checks remain a verification limitation.
External results are time-sensitive and HTTP success does not validate remote fragments.
Pagefind requires a static build and same-origin asset serving; Astro dev does not
create the index. Preview noindex/robots do not provide access control. Full index
size grew materially, while ordinary chapter pages retain zero JavaScript.
The local-only package does not prove production MIME, headers, DNS, redirect or
cache behavior. An early browser run found the checklist label defect; the corrected
final suite is green. One early run overlapped a rebuild and observed an intermediate
directory listing; final tests ran only against the completed static distribution.

## 31. Repository mutation state

UNSTAGED / UNCOMMITTED / UNPUSHED. HEAD and branch unchanged. Index empty.
Changes restricted to website/. No deployment, DNS/Cloudflare changes, production
release/tag, main/develop mutation, account, payment or tracking implementation.

## 32. Final decision

**A — WEB-4 PUBLIC LEARNING EXPERIENCE COMPLETE; PORTAL LAUNCH-HARDENED;
READY FOR FRESH INDEPENDENT WEB-4 VERIFICATION.**

This author decision includes the explicit non-blocking limitations above and is
not permission to launch. License and external-reference decisions remain WEB-5 blockers.

## 33. Exact recommended next action

Run fresh independent WEB-4 verification against this exact unstaged website diff
and unchanged baseline. Reproduce unit/build/link/source checks and search/browser
samples, include native zoom and screen-reader spot checks, and independently assess
the external-reference and license blockers. Do not stage, commit, push or deploy
before the separately authorized checkpoint/launch workflow. STOP.
