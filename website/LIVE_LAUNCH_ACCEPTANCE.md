# WEB-5L — Live Launch Acceptance & Production Evidence Record

## Current decision — WEB-5L1 authenticated reconciliation, 2026-09-14

**WEB-5LF1 correction-author status:** bounded preservation/status correction
complete after explicit status-hash authorization; final preview **49/49**,
production **49/49**, browser **2/2**, MSQE **35/35**, baseline **7/7**.
**Ready for fresh independent WEB-5LV2; correction acceptance remains pending.**

**32 PASS / 0 FAIL / 0 INCOMPLETE.**

**Decision A — WEB-5L LIVE LAUNCH ACCEPTANCE COMPLETE; MSQE v0.16.0
LEARNING-READY CONTROLLED RC PUBLICLY LAUNCHED; PRODUCTION EVIDENCE
AUTHENTICATED; FIRST EDITION REMAINS IN PROGRESS; READY FOR FRESH INDEPENDENT
WEB-5LV.**

The bounded signed-in Cloudflare inspection succeeded after the owner explicitly
authorized it in the message itself. The current decision and the final matrix in
[the authenticated reconciliation](#web-5l1--authenticated-cloudflare-evidence)
supersede the earlier 27/0/5 and Decision C evidence-access results preserved below.
Actual launch remains **2026-09-11**; record/inspection date is **2026-09-14**.
No Cloudflare mutation occurred. All 387 repository candidate files remained
byte-identical during inspection; only this report was updated afterward.
WEB-5LF1 reconciles the five current-facing status/runbook summaries to this
authenticated 32/32 result. Their earlier 27/0/5 Decision C remains explicitly
historical and superseded. FE-EV-049 retains its immutable point-in-time wording.

## Historical WEB-5L evidence before successful authorized inspection

The following original record and rejected-access addendum are preserved as
point-in-time evidence. Their incomplete verdicts and unavailable-evidence statements
are superseded by the authenticated reconciliation at the end of this document.


**MSQE v0.16.0 — LEARNING-READY — CONTROLLED RC**
**PUBLIC LEARNING-READY CONTROLLED RC** at <https://msqe.dev>.

| Identity | Value |
| --- | --- |
| Actual first public activation and validation | **2026-09-11**, supplied launch history |
| Durable acceptance-record authorship | **2026-09-14**, Codex acting on the WEB-5L request |
| Fresh public evidence | 2026-09-14, approximately 04:48–04:52 UTC |
| Repository production source baseline | `7028166b223322afc97af05d6ad6dfecef09dc8f` |
| Reported production branch | `feature/first-edition-review` |
| Acceptance branch | `feature/web-5-live-launch-acceptance` |
| Canonical host | `msqe.dev` |
| Final acceptance decision | **INCOMPLETE — 27 PASS / 0 FAIL / 5 INCOMPLETE** |

The public deployment is reachable and the demonstrated application checks pass.
Full 32/32 acceptance is withheld because authenticated Cloudflare deployment,
build-environment and custom-domain dashboard evidence remains unavailable.
This is a durable record of demonstrated results and explicitly outstanding evidence,
not a fabricated clean acceptance. No production configuration was changed in WEB-5L.

## Evidence provenance and preflight

The initial branch and HEAD matched the required values above. Worktree and index
were clean, with no nonignored untracked files; `git diff --check` passed.
Live `git ls-remote origin` returned the full required SHA for both
`feature/first-edition-review` and `feature/web-5-live-launch-acceptance`;
tracking divergence was zero. This authenticates repository source identity and
the current production-branch baseline, not Cloudflare's deployed commit.
The supplied history identifies the same origin baseline before branch creation;
this session's live remote check is not a retrospective observation of that operation.

The existing WEB-5D preparation report, toolchain guard, website implementation,
lockfile, tests and canonical sources are unchanged. Fresh local validation below
reproduced the baseline rather than relying solely on prior reported counts.

Evidence classes used throughout:

- **Observed:** fresh public HTTPS GETs using curl with ordinary certificate
  verification; HTML/XML parsing; isolated Chrome/Playwright live browser checks.
- **Local:** regenerated preview/production output and repository test suites.
- **Supplied history:** the owner's WEB-5L task statement about 2026-09-11 operations.
- **Outstanding infrastructure evidence:** authenticated Cloudflare dashboard/logs.
  Automatic approval review rejected reading the signed-in deployment tab because
  explicit authorization to access private account/deployment data was required.
  No private dashboard content was read and no deployment ID was inferred from a tab URL.

Raw captures and validation logs are outside the repository in
`/tmp/msqe-web5l/`; these temporary files are supplemental, not durable dependencies.
This document preserves sanitized results. No cookies, account identifiers,
credentials, unrelated DNS records or account-specific dashboard URLs are included.

## Cloudflare architecture and supplied launch chronology

Reported hosting architecture: Cloudflare Pages Git integration, Astro static,
repository-root build context, `website/dist` as the only published output,
production branch `feature/first-edition-review`. No application backend, accounts,
data store, runtime bindings or secrets are required by the repository implementation.
The actual production branch differs from the historical WEB-5D proposed branch;
the pre-launch documents are preserved and reconciled additively.

The owner reports that this exact build command succeeded:

```sh
node website/scripts/check-toolchain.mjs && npm --prefix website ci --include=dev && npm --prefix website run build
```

Required production build environment:

```text
NODE_VERSION=24.20.0
SKIP_DEPENDENCY_INSTALL=1
MSQE_INDEXING=production
```

The guard also requires npm **11.19.0**. Local invocation on 2026-09-14 printed
`Verified build toolchain: Node 24.20.0, npm 11.19.0` and exited 0.
This proves the local contract, not the remote environment.

Supplied 2026-09-11 history, pending authenticated infrastructure corroboration:

1. Cloudflare Build System Version 3 initially supplied Node **22.16.0**.
   The repository guard rejected the first build because the verified contract
   required **24.20.0**. This is successful production-environment validation,
   not a product defect.
2. The environment was corrected by adding `NODE_VERSION=24.20.0`; the guard
   was neither weakened nor modified.
3. The first successful deployment intentionally omitted `MSQE_INDEXING=production`.
   Ordinary pages retained `<meta name="robots" content="noindex, nofollow">`
   during live-domain validation. This temporary protection was intentional.
4. Apex and www were associated with Pages and reported **Active / SSL enabled**.
   Cloudflare created/used the appropriate Pages DNS association. These dashboard
   states and the specific association have not been independently read here.
5. The www → apex Redirect Rule is reported as **301, preserve query string**;
   its public path/query behavior is independently verified below.
6. `MSQE_INDEXING=production` was set and a fresh production deployment activated
   indexing. Current live metadata independently confirms the resulting state.

**Cloudflare deployed commit, production deployment identifier/URL, initial
protected pages.dev hostname, successful/failed build logs and environment scope:
INCOMPLETE.** Record these only after authenticated inspection. Public content
similarity, Git refs and discovered browser-tab addresses cannot authenticate them.
A known-good Cloudflare rollback target also remains unrecorded.

## Public HTTP, transport and routing evidence

All requests below used HTTPS with certificate verification enabled; no insecure
TLS override was used. Apex returned 200 and www returned 301 without a TLS error.
This establishes public HTTPS availability for both hosts; certificate internals
and dashboard SSL state are not inferred. The prepared application headers apply
to sampled apex pages/assets/404. The www edge redirect did **not** carry CSP,
nosniff, Referrer-Policy, Permissions-Policy, HSTS or X-Frame-Options; this distinction
is recorded, not silently counted as a matching application response.

| Requested route / URL | HTTP | Location or observation |
| --- | --- | --- |
| `/` | 200 | `index, follow` |
| `https://www.msqe.dev/` | 301 | `https://msqe.dev/` |
| `https://www.msqe.dev/search/?q=playwright` | 301 | `https://msqe.dev/search/?q=playwright` |
| `https://www.msqe.dev/handbook/?q=api` | 301 | `https://msqe.dev/handbook/?q=api` |
| `/robots.txt` | 200 | `text/plain; charset=utf-8` |
| `/sitemap.xml` | 200 | `application/xml` |
| `/search/` | 200 | `noindex, nofollow` |
| `/handbook/` | 200 | `index, follow` |
| `/paths/` | 200 | `index, follow` |
| `/resources/` | 200 | `index, follow` |
| `/license/` | 200 | `index, follow` |
| `/web5l-nonexistent/nested/` | 404 | `noindex, nofollow` |
| `/favicon.svg` | 200 | `image/svg+xml` |
| `/favicon.ico` | 200 | `image/vnd.microsoft.icon` |
| `/handbook/part-01/` | 200 | `index, follow` |
| `/handbook/part-01/chapter-01-what-is-modern-software-quality-engineering/` | 200 | `index, follow` |
| `/handbook/part-06/` | 200 | `index, follow` |
| `/handbook/part-06/chapter-01-data-quality-engineering-evidence-meaning-and-risk/` | 200 | `index, follow` |
| `/handbook/part-12/` | 200 | `index, follow` |
| `/handbook/part-12/chapter-01-engineering-leadership-as-quality-engineering/` | 200 | `index, follow` |
| `/paths/qa-foundations/` | 200 | `index, follow` |
| `/resources/code/part-02/capstone-quality-engineering-toolkit/` | 200 | `index, follow` |
| `/_astro/Base.BtmdYSN5.css` | 200 | `text/css; charset=utf-8` |
| `/pagefind/pagefind.js` | 200 | `application/javascript` |

The search redirect destination is exactly
`https://msqe.dev/search/?q=playwright`; `/handbook/?q=api` is also preserved.
The redirect behavior is observed independently of the reported rule configuration.
HTTP entry points, production pages.dev alias redirection and preview-host indexing
were not checked here and retain their historical unchecked checklist state.

## Live portal, handbook, learning paths and licensing

The browser-rendered homepage displayed MSQE, Modern Software Quality Engineering,
“Engineering Reliable Software, Data, Cloud & AI Systems”, and the styled status
“MSQE V0.16.0 · LEARNING-READY — CONTROLLED RC”. The qualification remains visible:
“First Edition remediation remains in progress; this is not the final published
First Edition.”

The handbook population is **137 chapters / 12 Parts**, supported by the sitemap
and complete generated-route checks. Parts I, VI and XII were browser-read;
their indexes and first chapter routes returned HTTP 200 as listed above.
This does not claim manual browser inspection of all 137 chapters.
Learning Paths, QA Foundations (ten chapters), Resources and the representative
Part II code-toolkit resource returned 200. No deferred career path was reopened.

The live `/license/` presentation preserves **Copyright © 2026 Babatunde Ajala**,
**CC BY 4.0** for original educational content, **Apache License 2.0** for original
software/tooling, and the separate third-party rights boundary. The linked CC BY
summary, CC BY legal code and Apache 2.0 terms each returned HTTP 200 on 2026-09-14.
No license policy was changed.

The deliberately missing nested route returned actual **HTTP 404**, “Page not
found”, and recovery links to Home, Handbook, Resources and Search. All four
destinations independently returned 200. This is both browser and HTTP evidence.
SVG/ICO favicons, shared CSS and Pagefind JavaScript returned 200 with appropriate
content types; the live browser loaded Pagefind worker, metadata, index, fragments
and WASM without failed requests.

## Search and privacy/runtime evidence

Live query **Playwright** produced **12 results. Showing 10.** Ten result items
were rendered initially; “more” rendered all twelve after asynchronous completion.
Representative titles included Browser Automation as an Engineering System;
Parallelism, Isolation, and Environment Strategy; and Deterministic Automation:
State, Synchronization, Dependencies, and Flakiness.

The fresh request `/search/?q=playwright` initially had an empty input and
“Enter a term to search the handbook.” Thus query preservation does not imply
query auto-population/execution. This known UX limitation is non-blocking under
WEB-5L requirements. Search remained functional after production indexing activation
and under the observed live CSP.

The sampled isolated Chrome session (home, search, three Part indexes, QA
Foundations, license and intentional 404) recorded **zero third-party runtime
requests, zero failed requests, zero CSP violations, zero cookies, zero localStorage
entries and zero sessionStorage entries**. The sole console error was the expected
HTTP 404 for the deliberately missing route; no script-breaking error was observed.
Requests were confined to apex HTML, shared CSS, favicon, `search.js` and Pagefind
JavaScript/worker/metadata/index/fragments/WASM. This is a bounded runtime sample,
not an account-wide audit. Repository implementation remains static, with no
accounts, analytics, tracking pixels, advertising, payments or learner-data collection.
Cloudflare's public responses expose NEL/Report-To infrastructure reporting; provider
logging/reporting is distinct from application tracking. Account-wide Analytics/Zaraz
settings have not been inspected.

## Indexing, sitemap and canonical evidence

Homepage and representative ordinary pages contain
`<meta name="robots" content="index, follow">`; the homepage has no
`noindex, nofollow`. Search and the live 404 each contain `noindex, nofollow`.
No sampled apex response supplied an `X-Robots-Tag` override.

Actual live `robots.txt` is:

```text
User-agent: *
Allow: /
Disallow: /search/
Sitemap: https://msqe.dev/sitemap.xml
```

**Production crawling is permitted.** This matches generated WEB-5D production
semantics. It differs textually from the empty `Disallow:` example in the task;
an empty Disallow would also allow crawling, whereas `Disallow: /` would block it.
The actual search-path exclusion is retained and is intentional.

XML parsing counted **260 URL entries / 260 unique locations**, all beginning
`https://msqe.dev/`; none use localhost, pages.dev or www. This is a programmatic
XML count, not a browser text-search count. Representative live canonicals use
apex URLs (404 canonical: `https://msqe.dev/404.html`). Complete generated production
checks verify all 262 HTML canonical/Open Graph URLs and the intended sitemap set;
this does not imply a fresh live GET of all 260 sitemap destinations.

## Security headers

Every sampled apex response, including static assets and actual 404, matched
these prepared values:

| Header | Observed value |
| --- | --- |
| Content-Security-Policy | `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; worker-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=()` |
| Strict-Transport-Security | `max-age=86400` |
| X-Frame-Options | `DENY` |

Frame protection is corroborated by `frame-ancestors 'none'`. No prepared header
was omitted or altered on sampled apex responses. The distinct www redirect
header omissions are recorded above. Live Pagefind worked with this policy.

## Reproduced repository validation

All commands ran from the required source baseline on Node 24.20.0/npm 11.19.0.

| Command / evidence | Result |
| --- | --- |
| `npm --prefix website ci` | PASS, exit 0; lockfile unchanged |
| `npm --prefix website run check` | PASS, 0 errors / 0 warnings / 8 hints |
| `npm --prefix website run build` | PASS, preview/default output |
| `npm --prefix website run verify` | **49 PASS / 0 FAIL**: 39 tests + 10 generated-output tests; link/fragment smoke PASS |
| `MSQE_INDEXING=production npm --prefix website run verify:production` | **49 PASS / 0 FAIL**: 39 tests + 10 production-output tests; link/fragment smoke PASS |
| `npm --prefix website run test:production-browser` | **2 PASS / 0 FAIL**, local production fixture |
| `node website/scripts/check-toolchain.mjs` | PASS, Node 24.20.0 / npm 11.19.0 |
| `PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p test_first_edition_gate.py -v` | **35 PASS / 0 FAIL / 0 ERROR** |
| `PYTHONDONTWRITEBYTECODE=1 python3 tools/first_edition_gate.py --profile baseline` | **7 PASS / 0 FAIL, exit 0**, before and after documentation edits |
| `git diff --check` and cached equivalent | PASS |

Generated production census remains 262 HTML pages, 258 indexed Pagefind documents,
260 sitemap URLs, 137 chapters and 12 Parts. The local browser suite is not a
Cloudflare emulator; its results are distinct from the live browser observations.

## Preservation, scope and residual boundary

Frozen edited-path allow-list:

- `website/LIVE_LAUNCH_ACCEPTANCE.md`
- `website/PRODUCTION_READINESS.md`
- `website/PRODUCTION_DEPLOYMENT_RUNBOOK.md`
- `website/PRODUCTION_ACCEPTANCE_CHECKLIST.md`
- `README.md`
- `CURRENT_SPRINT.md`
- `docs/02-first-edition-review/FIRST_EDITION_REVIEW_LOG.md`

No changes to `book/`, `labs/`, `code/`, `diagrams/`, chapter/Part manifests,
finding register, baseline checker/constants, implementation, lockfile or WEB-5D
report. Historical event bodies and index rows are preserved byte-for-byte;
maximum canonical heading ID was mechanically derived as FE-EV-048 and exactly
one event/index row, **FE-EV-049**, was added. No staging, commit, push, tag or
release was performed.

Manifest populations and digests remain identical in HEAD, index and worktree:

| Population | Count | Digest |
| --- | --- | --- |
| Chapters | 137 | `176539f62ef89a7d0fbc99ddb98d20b852eff18103d67dda4aab4b93f4d17f02` |
| Part READMEs | 12 | `eafd4ba0fc55275cf8bcd9094a225e408ab22d43e019d76319ce1897b1c11451` |

Accepted external-reference state is preserved: **0 confirmed materially broken
instructional URLs; 24 mechanically unverified references remain unverified**.
No full external-reference audit was reopened.

**First Edition: IN PROGRESS. v1.0.0: NOT YET RELEASED.** All 29 canonical findings
retain their lifecycle: **15 OPEN / NOT VERIFIED; 14 CLOSED / VERIFIED**.
Outstanding allocation: **LR-1=0; LR-2=0; FE-1=6; FE-2=5; FE-3=4**.
No FE finding is closed; this is not First Edition completion or publication-ready
First Edition approval. Public availability does not create a Git release.
This author records freshly observed operational facts, not independent semantic
re-acceptance of any authored correction or a replacement Learning-Ready gate.

## Live acceptance matrix

PASS means the stated scope was demonstrated by the evidence above. INCOMPLETE
is missing required evidence, not an observed product failure. Domain rows include
the requested Cloudflare Active/SSL/Pages-association state, hence remain incomplete
even though their public HTTPS endpoints work.

| ID | Condition | Result | Evidence / remaining gap |
| --- | --- | --- | --- |
| WEB5L-01 | Production source identity authenticated | INCOMPLETE | Repository SHA authenticated; Cloudflare deployed SHA uncorroborated |
| WEB5L-02 | Cloudflare production build succeeded | INCOMPLETE | Owner-reported success; authenticated build record unavailable |
| WEB5L-03 | Required Node 24.20.0 environment validated | INCOMPLETE | Local exact guard passes; remote Node/npm logs unavailable |
| WEB5L-04 | msqe.dev active | INCOMPLETE | Public apex 200; dashboard Active/SSL/Pages DNS association uncorroborated |
| WEB5L-05 | msqe.dev HTTPS valid | PASS | Verified HTTPS request succeeds |
| WEB5L-06 | www.msqe.dev active | INCOMPLETE | Public www HTTPS 301; dashboard Active/SSL/Pages association uncorroborated |
| WEB5L-07 | www→apex permanent redirect valid | PASS | Observed 301 to apex |
| WEB5L-08 | Path/query preservation valid | PASS | Search and handbook query/path retained |
| WEB5L-09 | Homepage live | PASS | Visible RC identity and qualification |
| WEB5L-10 | Handbook representative navigation live | PASS | Parts I/VI/XII browser; first chapters HTTP 200 |
| WEB5L-11 | Pagefind search live | PASS | 12 results / 10 initially / 12 after more |
| WEB5L-12 | Paths/resources live | PASS | Indexes, QA Foundations and representative resource 200 |
| WEB5L-13 | Licensing live | PASS | Live license presentation and three terms links 200 |
| WEB5L-14 | 404 recovery live | PASS | Real HTTP 404 and recovery links |
| WEB5L-15 | Production public pages indexable | PASS | Live ordinary metadata index, follow |
| WEB5L-16 | Search remains noindex | PASS | Live search metadata noindex, nofollow |
| WEB5L-17 | 404 remains noindex | PASS | Live missing-route metadata noindex, nofollow |
| WEB5L-18 | robots.txt permits crawling | PASS | Allow: /; Disallow: /search/ |
| WEB5L-19 | Production sitemap valid | PASS | 260 unique apex XML locations |
| WEB5L-20 | Canonical apex URLs valid | PASS | Representative live + all generated canonical population |
| WEB5L-21 | Security headers acceptable | PASS | Sampled apex headers exact; www omissions disclosed |
| WEB5L-22 | Privacy/tracking boundary preserved | PASS | Static source boundary + bounded live runtime sample |
| WEB5L-23 | External-reference accepted state preserved | PASS | 0 confirmed broken / 24 unverified unchanged |
| WEB5L-24 | Production website verification passes | PASS | 49/49 production; 49/49 preview |
| WEB5L-25 | Production browser verification passes | PASS | 2/2 local production browser tests; separate live evidence |
| WEB5L-26 | MSQE regression passes | PASS | 35/35 |
| WEB5L-27 | Baseline 7/7 passes | PASS | 7/7 exit 0 |
| WEB5L-28 | Canonical content preserved | PASS | Protected content and manifests unchanged |
| WEB5L-29 | Finding lifecycle preserved | PASS | 29 total; 15 open / 14 closed |
| WEB5L-30 | First Edition boundary preserved | PASS | FE in progress; v1.0.0 unreleased |
| WEB5L-31 | Durable launch record complete | PASS | Durable record includes provenance and unresolved acceptance |
| WEB5L-32 | Repository package scope valid | PASS | Seven documentation paths only; historical evidence preserved |

**Final result: 27 PASS / 0 FAIL / 5 INCOMPLETE.** To reach the requested 32/32,
authenticate Cloudflare's production deployment/source SHA, successful build and
Node/npm environment, apex/www Active + SSL states and Pages associations; retain
the deployment identifier/URL and corroborate the supplied protected-deployment
history. The broader historical checklist remains unchecked wherever WEB-5L did
not demonstrate its full scope (all live routes, nine live queries, cross-browser,
responsive/keyboard coverage, preview aliases and rollback operations).


## Historical WEB-5L1 bounded inspection access result — SUPERSEDED, 2026-09-14

The owner supplied a bounded read-only Cloudflare inspection authorization in the
WEB-5L1 attachment. The attempted read of the MSQE production deployment tab was
rejected by automatic approval review before dashboard content was returned.
The rejection stated that the attached authorization did not suffice because the
trusted user message did not explicitly direct the agent to follow it. This is an
access-approval limitation, not an observed deployment or product defect. No
alternative access route was attempted to bypass the rejection.

**Inspection result:** no authenticated Cloudflare evidence was available to inspect.
No Cloudflare mutation occurred. No repository mutation occurred during the attempted
inspection: SHA-256 snapshots of all 387 tracked/nonignored candidate files were
identical before and after the attempt, and the index remained clean. Only after
that check was this report addendum authored. No other candidate file was changed
by WEB-5L1. Existing WEB-5L changes remain unstaged, uncommitted and unpushed.

| Previously incomplete control | Evidence inspected in WEB-5L1 | Final state |
| --- | --- | --- |
| WEB5L-01 — Production source identity authenticated | No Cloudflare content returned; prior Git source authentication remains valid, deployed source identity remains uncorroborated | INCOMPLETE |
| WEB5L-02 — Cloudflare production build succeeded | No deployment status or build log returned; supplied successful-build history remains supplied evidence | INCOMPLETE |
| WEB5L-03 — Required Node 24.20.0 environment validated | No remote build log or environment configuration returned; prior local guard PASS does not authenticate remote Node/npm | INCOMPLETE |
| WEB5L-04 — msqe.dev active | No Pages Active/SSL/association status returned; prior public HTTPS 200 evidence remains valid | INCOMPLETE |
| WEB5L-06 — www.msqe.dev active | No Pages Active/SSL/association status returned; prior public HTTPS 301 evidence remains valid | INCOMPLETE |

Sanitized Cloudflare production evidence added by WEB-5L1: **none**. No account
identifiers, private metadata, cookies, tokens or credential-bearing URLs were
recorded. The supplied launch/build history and prior fresh public observations
are preserved without promotion to authenticated infrastructure evidence.
No additional live HTTP or implementation tests were necessary: the outstanding
gaps concern dashboard/build provenance, and no implementation bytes changed.

**Final result remains 27 PASS / 0 FAIL / 5 INCOMPLETE.**

**Decision C — WEB-5L ACCEPTANCE EVIDENCE INCOMPLETE; ADDITIONAL EVIDENCE REQUIRED.**
The next access attempt requires explicit authorization in the user's message
itself to read the signed-in MSQE Cloudflare deployment, build configuration/logs,
and apex/www domain evidence under the bounded WEB-5L1 attachment. Fresh independent
WEB-5LV remains required; no checkpoint is authorized or performed.


## WEB-5L1 — authenticated Cloudflare evidence

**Inspection date:** 2026-09-14, completed by approximately 05:10 UTC.
**Authority:** direct user message: “Follow the WEB-5L1 attachment. I authorize
read-only inspection of the signed-in MSQE Cloudflare deployment, build
logs/settings, and domain evidence.”
**Scope:** only the `modern-software-quality-engineering` Pages project, its three
relevant production deployments, deployment-specific build settings/logs, and its
`msqe.dev` / `www.msqe.dev` Pages custom-domain statuses. Supplemental public
HTTPS requests corroborated deployment metadata and the existing www redirect.

### Authenticated production identity and build contract

The project's **Production** summary identifies the current deployment as
`040f82f0-c9e8-45ac-99ca-01f1f8881088`, associated with apex and www, from
`feature/first-edition-review`. Its deployment detail reports **Status: success**
and links the full Git source commit
`7028166b223322afc97af05d6ad6dfecef09dc8f`. The build log independently records
fetching that exact SHA and checking out `7028166 web: prepare production deployment`.
This authenticates deployed source identity directly from Cloudflare, not inference
from public content or a browser-tab address.

Public infrastructure deployment URL:
<https://040f82f0.modern-software-quality-engineering.pages.dev>.
The success timestamp displayed is **10:18AM September 11, 2026**, with **42s**
duration. The timestamp's UI timezone is not assumed; UTC build-log timestamps
below are recorded separately. Production clone begins at
`2026-09-11T08:17:25.80642Z`.

Expanded **deployment-specific Build settings** show:

| Setting | Authenticated value |
| --- | --- |
| Build command | `node website/scripts/check-toolchain.mjs && npm --prefix website ci --include=dev && npm --prefix website run build` |
| Build output directory | `/website/dist` as displayed; repository-relative `website/dist` |
| Build system version | `3 (latest)` |
| Root directory | `/` |
| MSQE_INDEXING | `production` |
| NODE_VERSION | `24.20.0` |
| SKIP_DEPENDENCY_INSTALL | `1` |

The log records Node 24.20.0 detection/installation, suppression of automatic
installation because SKIP_DEPENDENCY_INSTALL is present, execution of the exact
command, and at `2026-09-11T08:17:37.221985Z`:
`Verified build toolchain: Node 24.20.0, npm 11.19.0`.
Astro's log explicitly reports output/mode **static** and directory
`/opt/buildhome/repo/website/dist/`. Thus Astro static is authenticated from the
actual build, without claiming inspection of a separate framework-preset selector.

### Authenticated three-deployment chronology

All three deployment details show production branch `feature/first-edition-review`
and the same full source commit above. Their build command/output/root and v3
configuration agree; the recorded environment snapshots establish the transitions.

| Stage | Cloudflare deployment ID | Status / evidence |
| --- | --- | --- |
| Initial guard rejection | `027ac394-27b1-47ef-a96b-9f99b29024ab` | **failure**; UI September 11, 7:20AM, duration 8s; UTC log starts `2026-09-11T05:20:41.092521Z` |
| First successful protected deployment | `75eddee8-6603-433b-9888-a5f022b14163` | **success**; UI September 11, 7:38AM, duration 48s; UTC log starts `2026-09-11T05:37:34.51487Z` |
| Current indexed production | `040f82f0-c9e8-45ac-99ca-01f1f8881088` | **success**; UI September 11, 10:18AM, duration 42s; UTC log starts `2026-09-11T08:17:25.80642Z` |

The initial environment snapshot contains only `SKIP_DEPENDENCY_INSTALL=1`.
At `2026-09-11T05:20:45.692265Z`, the log records the guard assertion
“WEB-5D requires tested Node 24.20.0”, actual **22.16.0**, expected **24.20.0**,
followed by Node.js v22.16.0 and build exit code **1**. This independently
corroborates the supplied account of successful infrastructure validation by the
repository guard; it is not a canonical product defect.

The protected successful deployment has exactly two displayed variables:
`NODE_VERSION=24.20.0` and `SKIP_DEPENDENCY_INSTALL=1`; **MSQE_INDEXING is absent**.
Its log confirms the Node/npm guard PASS at `2026-09-11T05:37:46.131751Z`.
Its observed public URL is
<https://75eddee8.modern-software-quality-engineering.pages.dev>.
Fresh HTTPS GET returned **200** and HTML robots **noindex, nofollow**.
The deployment is labeled Production in Cloudflare; “protected” describes its
intentional pre-activation indexing state, not a claim that it is a preview-branch build.

The current successful deployment adds `MSQE_INDEXING=production` as the third
variable. Fresh HTTPS GETs of its hashed URL and apex returned **200** and HTML
robots **index, follow**. Both successful hashed deployment URLs also return
**X-Robots-Tag: noindex** at the response level. This provider protection is distinct
from the HTML transition and does not override indexing on the apex, whose earlier
live responses had no X-Robots-Tag override. No indexing variable, toolchain guard,
branch or deployment was changed by this inspection.

### Authenticated custom domains and public corroboration

The **Custom domains** tab for this Pages project shows:

| Domain | Pages state | TLS indicator |
| --- | --- | --- |
| `msqe.dev` | **Active** | **SSL enabled** |
| `www.msqe.dev` | **Active** | **SSL enabled** |

This directly authenticates both Pages custom-domain associations and the requested
Active/SSL states. The production overview lists both domains and the current
production deployment. The task's founder-supplied DNS-creation history is preserved;
individual DNS records and unrelated zone data were not inspected because the
active Pages associations plus public HTTPS behavior resolve the domain controls.
No certificate internals are inferred.

A fresh request to `https://www.msqe.dev/search/?q=playwright` returned **301** with
exact Location `https://msqe.dev/search/?q=playwright`. Prior path/query tests remain
valid. Redirect-rule configuration itself was not opened; its conceptual description
remains supported by supplied history and observed behavior, not a newly claimed
configuration-screen inspection. No additional rule/DNS access was necessary to
resolve the five outstanding controls.

### Five-control reconciliation

| Control | Previous state | Newly inspected evidence | Final state |
| --- | --- | --- | --- |
| WEB5L-01 — Production source identity authenticated | INCOMPLETE | Current Production overview + success detail + full commit link + exact-SHA clone log | **PASS** |
| WEB5L-02 — Cloudflare production build succeeded | INCOMPLETE | Current Production deployment ID and success status; actual command/static-output log | **PASS** |
| WEB5L-03 — Required Node 24.20.0 environment validated | INCOMPLETE | Deployment variable snapshot and actual remote guard PASS for Node 24.20.0/npm 11.19.0; original Node 22.16.0 rejection corroborated | **PASS** |
| WEB5L-04 — msqe.dev active | INCOMPLETE | This project's Pages Custom domains: msqe.dev Active, SSL enabled; public HTTPS 200 | **PASS** |
| WEB5L-06 — www.msqe.dev active | INCOMPLETE | This project's Pages Custom domains: www.msqe.dev Active, SSL enabled; public HTTPS 301 with preserved query | **PASS** |

### Read-only and preservation confirmation

Only navigation, read-only expansion of build settings, and public HTTPS reads
were performed. **No Cloudflare mutation occurred:** no setting/variable/DNS/TLS/
redirect/security/header/branch changes, deployment retry/trigger, cache purge,
Worker change, token creation or access-policy change. No unrelated project/domain
was opened. Sanitized evidence above contains only relevant deployment IDs, public
deployment URLs, source identity, build variables and status/log facts; no account
IDs, account metadata, cookies, tokens or session credentials are recorded.

**No repository mutation occurred during inspection.** SHA-256 snapshots of all
387 tracked/nonignored candidate files before and after inspection matched exactly;
the index remained clean. The authorized report reconciliation began only after
that invariant passed. WEB-5L1 changes only `website/LIVE_LAUNCH_ACCEPTANCE.md`;
all other existing candidate bytes remain unchanged. No new governance event was
added or earlier event/index row edited in WEB-5L1. The original exactly-one-event
WEB-5L package remains intact, with its earlier verdict preserved as historical evidence.

The implementation and canonical-content bytes did not change, so the existing
49/49 preview, 49/49 production, 2/2 production browser and 35/35 MSQE results remain
applicable. Baseline 7/7 and diff hygiene were rerun after this documentation-only
reconciliation. Fresh independent WEB-5LV must assess this completed report/package;
these operational facts do not substitute for that independent review.

### Final current WEB-5L acceptance matrix

The following matrix supersedes the historical 27/0/5 matrix above. Previously
established public/repository checks retain their stated evidence scope and limits.

| ID | Condition | Result | Evidence / scope |
| --- | --- | --- | --- |
| WEB5L-01 | Production source identity authenticated | PASS | Cloudflare current Production, exact full SHA link and clone log |
| WEB5L-02 | Cloudflare production build succeeded | PASS | Deployment 040f82f0-c9e8-45ac-99ca-01f1f8881088: success |
| WEB5L-03 | Required Node 24.20.0 environment validated | PASS | Remote Node 24.20.0/npm 11.19.0 guard PASS and variable snapshot |
| WEB5L-04 | msqe.dev active | PASS | Pages custom domain Active / SSL enabled; apex HTTPS 200 |
| WEB5L-05 | msqe.dev HTTPS valid | PASS | Verified HTTPS request succeeds |
| WEB5L-06 | www.msqe.dev active | PASS | Pages custom domain Active / SSL enabled; www HTTPS 301 |
| WEB5L-07 | www→apex permanent redirect valid | PASS | Observed 301 to apex |
| WEB5L-08 | Path/query preservation valid | PASS | Search and handbook query/path retained |
| WEB5L-09 | Homepage live | PASS | Visible RC identity and qualification |
| WEB5L-10 | Handbook representative navigation live | PASS | Parts I/VI/XII browser; first chapters HTTP 200 |
| WEB5L-11 | Pagefind search live | PASS | 12 results / 10 initially / 12 after more |
| WEB5L-12 | Paths/resources live | PASS | Indexes, QA Foundations and representative resource 200 |
| WEB5L-13 | Licensing live | PASS | Live license presentation and three terms links 200 |
| WEB5L-14 | 404 recovery live | PASS | Real HTTP 404 and recovery links |
| WEB5L-15 | Production public pages indexable | PASS | Live ordinary metadata index, follow |
| WEB5L-16 | Search remains noindex | PASS | Live search metadata noindex, nofollow |
| WEB5L-17 | 404 remains noindex | PASS | Live missing-route metadata noindex, nofollow |
| WEB5L-18 | robots.txt permits crawling | PASS | Allow: /; Disallow: /search/ |
| WEB5L-19 | Production sitemap valid | PASS | 260 unique apex XML locations |
| WEB5L-20 | Canonical apex URLs valid | PASS | Representative live + all generated canonical population |
| WEB5L-21 | Security headers acceptable | PASS | Sampled apex headers exact; www omissions disclosed |
| WEB5L-22 | Privacy/tracking boundary preserved | PASS | Static source boundary + bounded live runtime sample |
| WEB5L-23 | External-reference accepted state preserved | PASS | 0 confirmed broken / 24 unverified unchanged |
| WEB5L-24 | Production website verification passes | PASS | 49/49 production; 49/49 preview |
| WEB5L-25 | Production browser verification passes | PASS | 2/2 local production browser tests; separate live evidence |
| WEB5L-26 | MSQE regression passes | PASS | 35/35 |
| WEB5L-27 | Baseline 7/7 passes | PASS | 7/7 exit 0 |
| WEB5L-28 | Canonical content preserved | PASS | Protected content and manifests unchanged |
| WEB5L-29 | Finding lifecycle preserved | PASS | 29 total; 15 open / 14 closed |
| WEB5L-30 | First Edition boundary preserved | PASS | FE in progress; v1.0.0 unreleased |
| WEB5L-31 | Durable launch record complete | PASS | Durable record includes provenance and unresolved acceptance |
| WEB5L-32 | Repository package scope valid | PASS | Seven documentation paths only; historical evidence preserved |

**Final result: 32 PASS / 0 FAIL / 0 INCOMPLETE.**

**A — WEB-5L LIVE LAUNCH ACCEPTANCE COMPLETE; MSQE v0.16.0 LEARNING-READY
CONTROLLED RC PUBLICLY LAUNCHED; PRODUCTION EVIDENCE AUTHENTICATED;
FIRST EDITION REMAINS IN PROGRESS; READY FOR FRESH INDEPENDENT WEB-5LV.**

Actual first public launch: **2026-09-11**. Durable record and authenticated
reconciliation: **2026-09-14**. **v1.0.0 NOT YET RELEASED.** Finding census unchanged:
**29 total; 15 OPEN / NOT VERIFIED; 14 CLOSED / VERIFIED**; outstanding
**LR-1=0, LR-2=0, FE-1=6, FE-2=5, FE-3=4**.
The broader historical pre-launch checklist is not retrospectively marked complete;
its unsampled checks remain distinct from the 32 WEB-5L controls.

**STOP — UNSTAGED / UNCOMMITTED / UNPUSHED. No checkpoint performed.
Fresh independent WEB-5LV remains required.**


## WEB-5LF1 — bounded correction authorship

The supplied independent **WEB-5LV** review returned **31 PASS / 3 FAIL /
0 INCOMPLETE, Decision B — live launch record not accepted; correction required**.
It accepted the public deployment and authenticated infrastructure evidence;
it rejected WEB5LV-24 preview verification, WEB5LV-25 production verification and
WEB5LV-32 current-status/runbook reconciliation. The preceding authored 32/32
operational acceptance result is preserved; it is not a claim that WEB-5LV accepted
the incoming repository record package.

The incoming preservation check returned **38 PASS / 1 FAIL**, stopping on the
old review-log SHA-256. FE-EV-049 is the only additive event/body-index change:
removing those additions reproduces the HEAD review log exactly. Its accepted
candidate SHA-256 is `b45af8d74845b06b637371d388f5311abd48e6c4d5e26212a9bcd4c4ef5b2595`;
the historical HEAD hash is
`ae98acfc9414671216e07d02792d67aaf166bb69796092d65df12ba5e96d7363`.
WEB-5LF1 preserves FE-EV-049 and all earlier events byte-for-byte; it adds no event.
The correction retains exact-byte preservation and reconciles current summaries
to **32 PASS / 0 FAIL / 0 INCOMPLETE, Decision A**, with initial 27/0/5 Decision C
explicitly historical. Authenticated Cloudflare evidence above is unchanged.

Earlier validation claims describe their original execution scope: the website
suites ran before the initial seven-path documentation package was authored.
WEB-5LV exposed that those results did not authenticate the final candidate's
preservation expectations. Fresh final-candidate validation is required for this
correction; prior PASS is not substituted for it. This is correction authorship,
not independent acceptance. **Fresh independent WEB-5LV2 is the next review.**
No infrastructure, canonical content, license, finding lifecycle or MSQE baseline
checker/constants change is authorized or performed.


### Historical WEB-5LF1 validation checkpoint — SUPERSEDED after explicit hash authorization

After evolving only the review-log hash, preservation exposes a second exact-byte
mismatch: `README.md`. `CURRENT_SPRINT.md` also has an unchanged earlier frozen
hash. Both files' current-status edits are authorized, but WEB-5LF1 §6 explicitly
limits expectation evolution to the review-log identity. Author clarification was
requested before evolving those additional two expected identities. No license-file
hash or broader preservation rule was changed. This checkpoint does not claim the
bounded correction complete.

- Incoming preview verification: **38 PASS / 1 FAIL**, review-log identity.
- Current preview verification: **38 PASS / 1 FAIL**, README identity, exit 1.
- Current production verification: **38 PASS / 1 FAIL**, README identity, exit 1.
  Both stop before the ten generated-output tests; neither is a 49/49 PASS.
- Locked installation, type checks, preview build and production build: exit 0.
- Production browser: **2 PASS / 0 FAIL**.
- MSQE regression: **35 PASS / 0 FAIL / 0 ERROR**; baseline **7 PASS / 0 FAIL**, exit 0.
- Disposable tests of the actual `assertAuthorizedSource` preservation function:
  **5/5 unauthorized changes rejected** (historical event body, FE-EV-049 body,
  FE-EV-049 deletion, extra event, canonical manuscript edit). The accepted bytes
  passed before each mutation and after restoration. No real source file was
  mutated for those negative cases.
- FE-EV-049 remains byte-identical; no FE-EV-050, canonical content, license,
  implementation, infrastructure or finding-lifecycle change occurred.

Current-status reconciliation and historical-evidence preservation are authored;
full preservation-expectation reconciliation remains pending the explicit scope
clarification. **No WEB-5LF1 Decision A or readiness for WEB-5LV2 is claimed at this
checkpoint.** The authenticated public-production 32/32 evidence remains unchanged.


## WEB-5LF1 — final authorized correction result

The owner explicitly authorized exact expected SHA-256 evolution for README.md
and CURRENT_SPRINT.md, conditional on proving that their HEAD deltas consist only
of the already-authorized WEB-5L status reconciliation. Before updating either
expectation, a separate byte comparison proved each file equals its HEAD bytes
with exactly the reviewed status block inserted after the first line. Removing
that block restores HEAD byte-for-byte; no unrelated line changed.

| Exact accepted identity | HEAD SHA-256 | Final SHA-256 |
| --- | --- | --- |
| README.md | `be4b17892bd42ba92b5332542d69ea35302445b84662bf6fd5aacc83c5d9fe8f` | `0b8d00e5b4616e936bbd012d8ff1c91bbd1c2021674d38ce384634fbdeb13f40` |
| CURRENT_SPRINT.md | `43180ae7d3705e4708487745b12b6ca1b44fca28e6b7532ab100867b8639b2fa` | `8c04c95e045fee7cc12dd1368ba59975a4ad92d681dfe14ded9c76cffe7f0bf6` |
| FIRST_EDITION_REVIEW_LOG.md | `ae98acfc9414671216e07d02792d67aaf166bb69796092d65df12ba5e96d7363` | `b45af8d74845b06b637371d388f5311abd48e6c4d5e26212a9bcd4c4ef5b2595` |

Only `website/tests/preservation.ts` gained these three exact expected-identity
overrides. The historical fixture files remain unchanged. Replacing that one
constant declaration with its HEAD declaration reproduces the entire original
preservation.ts file byte-for-byte: all assertions, function bodies, source/mode/
symlink checks, untracked/staging detection and protected paths are unchanged.
All three paths were already in the accepted license/closure identity sets, so
the effective path allow-list is unchanged. License-file hashes are unchanged.
Future mutations are still rejected rather than ignored or loosely matched.

Final validation after all three expected identities were authorized:

| Validation | Result |
| --- | --- |
| Preview `npm --prefix website run verify` | **49 PASS / 0 FAIL**, exit 0 (39 unit + 10 generated-output tests; full link/fragment smoke PASS) |
| Production `MSQE_INDEXING=production npm --prefix website run verify:production` | **49 PASS / 0 FAIL**, exit 0 (39 unit + 10 production-output tests; full link/fragment smoke PASS) |
| Production browser | **2 PASS / 0 FAIL**, exit 0 |
| MSQE regression | **35 PASS / 0 FAIL / 0 ERROR** |
| Baseline gate | **7 PASS / 0 FAIL**, exit 0 |
| Diff and cached diff hygiene | **PASS** |
| Full disposable `authenticateSources` negative validation | **7/7 mutations rejected**; accepted candidate passed before mutations and after restoration |

The seven disposable cases cover an earlier event body, FE-EV-049 mutation,
FE-EV-049 deletion, an unauthorized extra event, an unrelated canonical chapter,
README mutation and CURRENT_SPRINT mutation. Each failure named the altered path;
each disposable file was restored and checked byte-for-byte immediately after
its case. Final full preservation passed after all originals were restored.
No mutation was applied to the real repository for these negative tests.

This final checkpoint supersedes the earlier scope-pending 38/1 correction
checkpoint. The authenticated operational 32/32 evidence and historical 27/0/5
Decision C remain preserved. Five current-facing summaries now distinguish that
final operational result from the earlier incomplete infrastructure record and
from the independent review of this correction package. FE-EV-049 is unchanged;
FE-EV-001–048 are unchanged; no FE-EV-050 was added.

The final candidate has **eight paths**: the original seven WEB-5L documentation
paths plus `website/tests/preservation.ts`. No canonical source, license,
production implementation, external reference, Cloudflare setting or MSQE baseline
checker/constant changed. Findings remain **29 total; 15 OPEN / NOT VERIFIED;
14 CLOSED / VERIFIED**, with **LR-1=0, LR-2=0, FE-1=6, FE-2=5, FE-3=4**.
**First Edition IN PROGRESS; v1.0.0 NOT YET RELEASED.**

**A — WEB-5LF1 LIVE-LAUNCH RECORD CORRECTION COMPLETE; FE-EV-049 PRESERVED;
PRESERVATION EXPECTATION RECONCILED; CURRENT STATUS RECONCILED TO AUTHENTICATED
32/32; READY FOR FRESH INDEPENDENT WEB-5LV2.**

This is correction-author evidence only. The final raw-file fingerprint is supplied
separately to avoid self-reference; WEB-5LV2 must independently authenticate it.
**STOP — UNSTAGED / UNCOMMITTED / UNPUSHED. HEAD and index unchanged.**
