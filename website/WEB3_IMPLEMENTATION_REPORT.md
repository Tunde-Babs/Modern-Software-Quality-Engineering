# MSQE — WEB-3 Full Handbook Integration Report

## 1. Executive verdict

Implementation complete: 137 canonical chapter pages, 12 Part indexes, and 94
resource pages; 247 HTML pages overall. All required automated gates pass.
This is author validation, not fresh independent verification or publication approval.

## 2. Preflight

Before editing: branch `feature/web-3-full-handbook`, HEAD
`522723dcb6daf655a90c7b9e11f545d177df97ce`; clean working tree and index.
Required `npm --prefix website ci`, `check`, `build`, and `verify` all exited 0.
WEB-2 baseline reproduced exactly: 14 tests PASS, 5 static pages,
99 internal links/fragments, 0 broken destinations. MSQE regression:
35 PASS / 0 FAIL / 0 ERROR. Baseline profile: 7 PASS / 0 FAIL, exit 0.

## 3. Branch/base authentication

Read-only `git ls-remote` authenticated the live
`feature/first-edition-review` and `feature/web-3-full-handbook` remote heads at
`522723dcb6daf655a90c7b9e11f545d177df97ce`. Initial sandbox DNS failure was
resolved by an approved read-only network retry. The base is an ancestor of HEAD;
tracking divergence is 0 ahead / 0 behind. HEAD remains unchanged.

## 4. Exact changed paths

18 paths, all under `website/`:

- `website/README.md`
- `website/WEB3_IMPLEMENTATION_REPORT.md`
- `website/src/components/HandbookNavigation.astro`
- `website/src/layouts/Base.astro`
- `website/src/layouts/Part.astro`
- `website/src/layouts/Reading.astro`
- `website/src/lib/content/loader.ts`
- `website/src/lib/content/registry.ts`
- `website/src/pages/404.astro`
- `website/src/pages/handbook/[...slug].astro`
- `website/src/pages/handbook/index.astro`
- `website/src/pages/resources/index.astro`
- `website/src/pages/sitemap.xml.ts`
- `website/src/styles/global.css`
- `website/tests/build-smoke.ts`
- `website/tests/content.test.ts`
- `website/tests/full-handbook.test.ts`
- `website/tests/preservation.ts`

Ignored build output (`dist/`, `.astro/`), dependencies (`node_modules/`), and
regenerable evidence (`artifacts/`) are not repository changes. No dependency or
lockfile change was required. The WEB-2 implementation report remains unchanged.

## 5. Full chapter discovery

137 discovered sources and 137 unique chapter routes. Discovery follows sorted
canonical Part directories and two-digit chapter filenames. Runtime invariants
require Parts 01–12, contiguous chapter numbering within each Part, and the
137/12 census. Registry construction rejects duplicate source paths and routes.
Metadata additionally validates filename, H1, Chapter, and Part agreement.

## 6. Part discovery

All 12 Part READMEs are discovered through canonical chapter structure.

| Part | Chapters | Public index |
|---|---:|---|
| 01 | 10 | `/handbook/part-01/` |
| 02 | 12 | `/handbook/part-02/` |
| 03 | 12 | `/handbook/part-03/` |
| 04 | 10 | `/handbook/part-04/` |
| 05 | 12 | `/handbook/part-05/` |
| 06 | 11 | `/handbook/part-06/` |
| 07 | 11 | `/handbook/part-07/` |
| 08 | 11 | `/handbook/part-08/` |
| 09 | 12 | `/handbook/part-09/` |
| 10 | 12 | `/handbook/part-10/` |
| 11 | 12 | `/handbook/part-11/` |
| 12 | 12 | `/handbook/part-12/` |

## 7. Metadata census

137/137 chapters pass the original parser. Missing fields: 0; duplicate fields:
0; numbering mismatches: 0; unexpected fields: 0; unparsed study times: 0.
Status distribution: **Draft = 137**. All eight required fields retain their
canonical values. The adapter recognizes minute ranges and hour ranges.
Part XI Chapter 12 uses `6–10 hours across several sessions`, represented as
360–600 minutes for consumers while displaying the untouched source value.
No source was rewritten. Full per-source evidence: `artifacts/metadata-census.json`.

## 8. Route census

243 source-backed registry entries: 137 chapters + 12 Parts + 94 resources.
Home, handbook index, resources index, and 404 bring HTML output to 247 pages.
Chapter pattern: `/handbook/part-NN/chapter-NN-topic/`.
Public internal links never expose `/book/`, `/chapters/`, or `.md` destinations.
The WEB-2 chapter and `/resources/quality-system-model/` URLs remain stable.
Full mapping: `artifacts/route-census.json`.

## 9. Handbook index

`/handbook/` represents the whole curriculum with 12 ordered Part entries,
chapter counts, canonical descriptions, Draft manuscript status, and Start Part
links. The counts sum to 137. It avoids a 137-card overview.

## 10. Part indexes

Every Part index includes canonical title, Part number, a concise description,
ordered chapter titles, study time, status, version, prerequisites, handbook
return link, and previous/next Part navigation. Descriptions use the first
sentence of the first canonical Overview, Mission, or Purpose paragraph.
Part README governance and production-history bodies are not published.

## 11. Chapter rendering

All chapters use the existing Reading layout and sanitized Markdown pipeline.
Source headings, code, inline code, tables, prose, lists, references, footnotes,
and anchors remain canonical. Corpus inspection found no raw HTML nodes in the
published Markdown. Footnotes use citation order, as in WEB-2; tests distinguish
that from their definition order. Code assets are inert AST text nodes, not
executed code or dynamically constructed Markdown fences.

## 12. Previous/next navigation

All 136 sequential transitions are checked, including all 11 Part boundaries.
The first chapter has no previous link; the final chapter has no next link.
Labels use canonical chapter titles, links have `rel=prev/next`, and the final
boundary correctly says End of handbook. Every generated chapter page is
checked against the expected predecessor/successor.

## 13. Internal link resolution

Published chapter, resource, and Part README targets resolve through the route
registry. Registered code-project directory links resolve to their README page.
GitHub-style source fragments map to namespaced HTML heading IDs. Missing,
unsafe, unreviewed, or broken-fragment destinations fail explicitly.

Remaining unavailable references are rendered as labelled text, never fake
links. A target must be in the explicit reviewed omission map and must exist.

| Classification | Occurrences | Unique targets |
|---|---:|---:|
| A: Delivered but not yet routed | 14 | 7 |
| B: Planned / not delivered | 0 | 0 |
| C: Governance / internal-only | 10 | 1 |
| D: Broken source reference | 0 | 0 |

| Exact unavailable target | Category | Occurrences |
|---|---|---:|
| `code/part-02-programming/capstone-quality-engineering-toolkit/docs` | A | 3 |
| `code/part-02-programming/capstone-quality-engineering-toolkit/docs/limitations-and-residual-risk.md` | A | 1 |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/change-plan.md` | A | 3 |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/expected-commit-plan.md` | A | 1 |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/pull-request-description.md` | A | 3 |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/review-comments.md` | A | 2 |
| `code/part-02-programming/delivery-04-collaborative-tested-utilities/test` | A | 1 |
| `docs/00-project/QA_TO_QE_TRANSITION_FRAMEWORK.md` | C | 10 |

The `test` directory itself is unrouted, while its individual delivered test
files are available through the code-project page. Code companion documents
are classified A because they are delivered educational examples, but publishing
the project `docs` subtree (including review/validation evidence) was excluded.
The project transition framework remains category C under the current publication
boundary. None of these omissions is an unpublished chapter.

## 14. Resource discovery

94 static resource pages:

| Resource type | Pages |
|---|---:|
| Part I lab | 1 |
| Part I case studies | 3 |
| Part I worksheets / workshop | 8 |
| Diagrams | 11 |
| Part II code project READMEs | 5 |
| Part II source, tests, fixtures, configuration | 66 |

The 71 code pages comprise 6 Delivery 1, 15 Delivery 2, 13 Delivery 3,
13 Delivery 4, and 24 capstone pages. Inventory inspected `book`, `labs`,
`code`, and `diagrams`. Root `labs/README.md` and `code/README.md` are empty
placeholders. No standalone root labs are delivered. Of 90 tracked code files,
71 are routed; nine project `docs` files, five `.gitignore` files, four lockfiles,
and the empty root README are excluded. Dependencies and local build products
are excluded regardless of their presence on disk. No governance, review evidence,
or internal administration is published.

## 15. Resource index

`/resources/` groups the 28 activity, diagram, and code-project entry pages
under Labs, Case studies, Worksheets and workshops, Diagrams, and Code examples.
Five project pages expose the other 66 code files with project-return links.
Available resources and not-yet-published companions are distinguished. Exercises
inside chapters remain available as canonical chapter content.

## 16. Diagram/Mermaid treatment

Graphical Mermaid rendering is deferred to WEB-4. The existing pipeline has no
Mermaid/SVG rendering dependency; adding and validating a renderer, SVG
sanitization, fonts/layout determinism, and accessible graphical descriptions
would materially expand this bounded integration. No renderer was installed.
All 11 diagram pages retain Mermaid source, learning context, and canonical
textual interpretation. Chapter Mermaid blocks retain surrounding explanation.
The notice no longer assumes every block has a following dedicated interpretation.
No runtime Mermaid or browser JavaScript is shipped.

## 17. Accessibility at scale

All 247 HTML pages pass structural checks: one H1, no skipped heading levels,
unique IDs, valid ARIA label/description references, semantic landmarks, skip
links, no positive tabindex, and correctly labelled keyboard-focusable table/code
overflow regions. All table headers retain column scope.

Chrome browser checks covered Chapter 1 in Parts I, III, VI, IX, XII at desktop
1440×1000 and mobile 390×844. Screenshots and DOM measurements showed readable
layouts and no document-level horizontal overflow. Wide tables and code scroll
inside 350-pixel mobile regions. Keyboard Enter toggled the handbook disclosure;
TOC navigation reached `#section-metadata`; keyboard focus reached the table
region; the skip link moved focus to `main-content`. Resource index and Delivery 1
project-file discovery were also exercised at mobile width. These are representative
checks, not a complete assistive-technology audit. The viewport override was reset.

## 18. SEO/URL integrity

All HTML pages have unique titles, canonical URLs, descriptions, Open Graph URL
metadata, and `noindex, nofollow`. The 404 canonical is `/404.html`, matching
Astro's generated file despite its internal `/404/` render pathname. The static
sitemap contains 246 navigable URLs and excludes the 404. Semantic HTML and
`data-pagefind-body`/`data-pagefind-ignore` hooks support future Pagefind work.
No production indexing or hosting configuration changed.

## 19. Generated-page census

**247 HTML pages:** 137 chapters, 12 Parts, 94 resources, home, two global indexes,
and one 404. One additional sitemap XML file and one shared CSS asset are emitted.
No scripts, iframes, forms, source Markdown, TypeScript, or Python files are shipped.

## 20. Link/fragment census

**12,564 generated internal links/fragments validated; 0 broken destinations.**
Unavailable canonical links: 24 occurrences / 8 targets, separately classified in
section 13 and `artifacts/link-report.json`. Source preservation after rendering:
0 unauthorized modifications.

## 21. Performance/build measurements

Final explicit build: **4.82 seconds**. Final verify build: **4.53 seconds**.
Output size: **7,912,904 bytes** (about 7.55 MiB).
Initial full build took roughly two minutes because Part READMEs were parsed
repeatedly per page; process-local document/Part caching removed that overhead.
Two captured successful outputs, before and after a clean dependency reinstall,
matched byte-for-byte: 249 emitted files. No browser JavaScript is emitted.

Largest HTML pages:

| Generated path | Bytes |
|---|---:|
| `handbook/part-11/chapter-12-capstone-system-design-architecture-quality-strategy-and-evidence-portfolio/index.html` | 99,403 |
| `handbook/part-01/chapter-10-the-future-of-quality-engineering/index.html` | 83,152 |
| `handbook/part-12/chapter-12-capstone-quality-leadership-and-career-strategy-portfolio/index.html` | 81,494 |
| `handbook/part-02/chapter-12-capstone-quality-engineering-toolkit/index.html` | 79,317 |
| `handbook/part-01/chapter-09-the-modern-software-quality-engineering-framework/index.html` | 76,826 |

Non-HTML assets:

| Asset | Bytes |
|---|---:|
| `sitemap.xml` | 28,274 |
| `_astro/Base.BE4JFBc9.css` | 7,716 |

This growth is proportional to expanding five pages to 247; the largest page is
under 100 KB uncompressed. No client framework or runtime search was introduced.

## 22. Website tests

**20 PASS / 0 FAIL.** All 14 WEB-2 tests remain, with slice-specific expectations
updated for full publication. Six added tests cover full deterministic discovery,
all-chapter metadata, complete sequence/boundaries, resource exclusions, full-corpus
source rendering, and classified omissions. Build verification additionally checks
all route targets, Part/index consistency, page counts, previous/next links,
current chapter highlighting, unique titles, sitemap consistency, and accessibility.

Final `npm --prefix website ci`, `check`, `build`, and `verify` all exited 0.
Astro/TypeScript: 0 errors, 0 warnings, 0 hints. No dependency versions changed.

## 23. Existing MSQE regression results

`PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p test_first_edition_gate.py -v`:
**35 PASS / 0 FAIL / 0 ERROR**. Baseline profile:
**7 PASS / 0 FAIL, exit 0**. The checker and its tests are unchanged.
The existing batch allow-path bracket limitation still applies to Astro's
`[...slug].astro` filenames; no checker change or batch-profile workaround was made.
Baseline profile and explicit Git scope checks were used as requested.

## 24. Source preservation

All 275 protected files match the exact Git blobs at
`522723dcb6daf655a90c7b9e11f545d177df97ce`.

| Protected surface | Files | Unauthorized changes |
|---|---:|---:|
| `book` | 162 | 0 |
| `labs` | 1 | 0 |
| `code` | 90 | 0 |
| `diagrams` | 11 | 0 |
| `docs/02-first-edition-review` | 7 | 0 |
| `tools/first_edition_gate.py` | 1 | 0 |
| `tests/test_first_edition_gate.py` | 1 | 0 |
| `CHANGELOG.md` | 1 | 0 |
| `LICENSE` | 1 | 0 |

Protected manifest SHA-256:
`768c75522f5b55214a5076f36d265fd08e1cdf6ad48a521cefe288990104312c`.
No canonical educational content was changed or duplicated into website sources.

## 25. Deferred WEB-4 items

Graphical Mermaid rendering; Pagefind; curated learning paths; About content;
reviewed publication of remaining companion documents/directory indexes;
canonical dev-watch invalidation; broader accessibility and assistive-technology
verification. No backend was implemented. Production deployment, indexing,
Cloudflare, DNS, and publication remain WEB-5; license resolution is still required.

## 26. Risks/observations

All chapter statuses remain Draft; website availability does not advance manuscript
or edition governance. The 24 unavailable occurrences are intentional and visible.
Source-relative link checking does not verify external HTTP destinations. Resource
publication is explicitly bounded to currently reviewed roots and types. Caches
require restarting the dev server after separately authorized canonical edits.
Graphical diagrams and search remain absent by design. No favicon was added.
Automated checks and these author browser observations do not replace independent
semantic verification. No public deployment, DNS change, release, tag, production
workflow, staging, commit, push, checkpoint, or integration occurred.

## 27. Repository mutation state

Branch remains `feature/web-3-full-handbook`; HEAD remains
`522723dcb6daf655a90c7b9e11f545d177df97ce`. All 18 changed paths are under
`website/`. Index clean. **UNSTAGED / UNCOMMITTED / UNPUSHED**.

## 28. Final decision

**A — WEB-3 FULL HANDBOOK INTEGRATION COMPLETE;
137-CHAPTER / 12-PART CANONICAL PUBLICATION CONTRACT ESTABLISHED;
READY FOR FRESH INDEPENDENT WEB-3 VERIFICATION**

## 29. Exact recommended next action

Have a fresh independent verifier assess this unstaged WEB-3 diff against
`522723dcb6daf655a90c7b9e11f545d177df97ce`, reproduce the required commands and
censuses, inspect source preservation and the eight omission classifications,
and independently review representative learner flows. Do not stage, checkpoint,
integrate, push, or deploy before that verification and separate authorization.

STOP.


---

# WEB-3F1 Reference Rendering Correction

## 1. Executive verdict

**Correction implemented; required browser verification remains incomplete.**
All 12 known reference omissions are restored, all 378 canonical definitions are
preserved, and automated validation passes. The final successful F1 decision is
withheld until the remaining five browser samples can be completed. Fresh
independent WEB-3V2 remains required in all cases.

Historical sequence: **WEB-3 authored → WEB-3V Decision B (not accepted) → WEB-3F1
correction implemented, browser completion pending**. The preceding WEB-3 author
report is preserved byte-for-byte as historical claims, not rewritten as an
accepted result.

## 2. Preflight

Branch `feature/web-3-full-handbook`; HEAD
`522723dcb6daf655a90c7b9e11f545d177df97ce`; index clean; no WEB-3 commit.
`git diff --check` passed. All 18 incoming candidate paths and SHA-256 values
matched WEB-3V's `initial.json` exactly. Existing output also matched every one of
WEB-3V's 249 captured file hashes. No material drift.

## 3. WEB-3V defect reconstruction

Authority recovered from
`/tmp/msqe-web3v-evidence/MSQE-WEB-3V-Fresh-Independent-Verification-Report.md`
and `reference-audit.json`. Each missing identifier/text/source line was checked
against canonical AST nodes before editing. Total population: 378 definitions,
366 rendered entries, 12 omissions in five chapters.

The source-derived per-chapter counts below are authoritative. In particular,
Part II Chapter 11 had five definitions and three rendered entries; the verifier's
prose describing its entire bibliography as lost was broader than its exact
12-entry evidence. This does not change the defect population or Decision B.

## 4. Frozen 12-entry population

Frozen before implementation in
`/private/tmp/msqe-web3f1-evidence/frozen-population.json` and
`frozen-population.md`. Five unique canonical chapters, twelve rows:

| Chapter source | Public route | Canonical reference entry | Pre-fix rendered status |
|---|---|---|---|
| `book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md` | `/handbook/part-02/chapter-10-git-code-review-and-collaborative-engineering/` | `[^pro-git]: Scott Chacon and Ben Straub. [Pro Git, 2nd edition](https://git-scm.com/book/en/v2). Apress, 2014. Accessed 2026-08-09.` | Missing |
| `book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md` | `/handbook/part-02/chapter-10-git-code-review-and-collaborative-engineering/` | `[^git-rebase]: Git. [git-rebase Documentation](https://git-scm.com/docs/git-rebase). Accessed 2026-08-09.` | Missing |
| `book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md` | `/handbook/part-02/chapter-10-git-code-review-and-collaborative-engineering/` | `[^github-pr]: GitHub. [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests). Accessed 2026-08-09.` | Missing |
| `book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md` | `/handbook/part-02/chapter-10-git-code-review-and-collaborative-engineering/` | `[^google-review]: Google. [Engineering Practices: Code Review](https://google.github.io/eng-practices/review/). Accessed 2026-08-09.` | Missing |
| `book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md` | `/handbook/part-02/chapter-11-testing-quality-engineering-utilities/` | `[^meszaros]: Gerard Meszaros. [xUnit Test Patterns](https://xunitpatterns.com/). Addison-Wesley, 2007. Accessed 2026-08-09.` | Missing |
| `book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md` | `/handbook/part-02/chapter-11-testing-quality-engineering-utilities/` | `[^feathers]: Michael Feathers. [Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/). Prentice Hall, 2004. Accessed 2026-08-09.` | Missing |
| `book/part-03-software-testing/chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md` | `/handbook/part-03/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio/` | `[^istqb]: International Software Testing Qualifications Board. [Certified Tester Foundation Level Syllabus v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf). 2024. Accessed 2026-08-09.` | Missing |
| `book/part-03-software-testing/chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md` | `/handbook/part-03/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio/` | `[^google-sre]: Google. [Postmortem Culture: Learning from Failure](https://sre.google/workbook/postmortem-culture/). *The Site Reliability Workbook*. Accessed 2026-08-09.` | Missing |
| `book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md` | `/handbook/part-07/chapter-04-infrastructure-as-code-change-evidence-review-and-drift/` | `[^git]: Git. [Git documentation](https://git-scm.com/docs). Accessed 2026-08-11.` | Missing |
| `book/part-07-cloud-devops/chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md` | `/handbook/part-07/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio/` | `[^nist-cloud]: National Institute of Standards and Technology. [SP 800-145: The NIST Definition of Cloud Computing](https://csrc.nist.gov/pubs/sp/800/145/final). 2011.` | Missing |
| `book/part-07-cloud-devops/chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md` | `/handbook/part-07/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio/` | `[^oci]: Open Container Initiative. [Open Container Initiative specifications](https://opencontainers.org/). Accessed 2026-08-11.` | Missing |
| `book/part-07-cloud-devops/chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md` | `/handbook/part-07/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio/` | `[^dora]: Google Cloud. [DORA State of DevOps research](https://cloud.google.com/resources/state-of-devops). Accessed 2026-08-11.` | Missing |

## 5. Root cause

The raw Markdown parser retains all twelve `footnoteDefinition` nodes. The
installed `mdast-util-to-hast` default handler ignores definition nodes at their
source positions; its footer only emits definitions listed in `footnoteOrder`,
which is populated by citation markers. These twelve definitions have no citation
markers, so conversion omits them before link transformation, sanitization, or
serialization. Per-entry pre-fix traces confirm presence in Markdown/AST and
absence from converted HAST, prepared HAST, sanitized serialization, and generated
HTML. No sanitizer/traversal/list-boundary defect was found.

## 6. Correction design

One shared `remarkRehype` handler in `renderTree` preserves uncited definitions as
anchored block containers at their original source positions, rendering the
existing child nodes with `state.all`. Original paragraph/list/inline semantics
therefore pass through the existing link and sanitization pipeline. Cited
footnotes retain their existing footer, numbering, citation order, and backlinks.
No citation marker, backlink, bibliography wording, URL, or new instructional
content is invented. Canonical Markdown and the parsed source AST remain unchanged.

## 7. Exact F1 changed paths

The following five paths were frozen before the implementation edit:

- `website/src/lib/content/loader.ts`
- `website/tests/references.test.ts`
- `website/tests/reference-preservation.ts`
- `website/tests/build-smoke.ts`
- `website/WEB3_IMPLEMENTATION_REPORT.md`

Three incoming files modified; two test files added. No layout, style, registry,
route, resource exposure, dependency, or canonical content changes. Existing
WEB-3 tests are unchanged; the README's original 20-test description remains a
pre-F1 count, superseded here by 27 tests.

## 8. Five affected chapter results

Counts include both cited footnotes and uncited reference paragraphs, because
these are two rendering forms of canonical definition entries.

| Canonical chapter | Expected | Before | After | Restored |
|---|---:|---:|---:|---:|
| `book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md` | 4 | 0 | 4 | 4 |
| `book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md` | 5 | 3 | 5 | 2 |
| `book/part-03-software-testing/chapters/chapter-12-capstone-risk-informed-test-strategy-and-evidence-portfolio.md` | 5 | 3 | 5 | 2 |
| `book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md` | 2 | 1 | 2 | 1 |
| `book/part-07-cloud-devops/chapters/chapter-11-capstone-cloud-devops-quality-strategy-and-release-evidence-portfolio.md` | 3 | 0 | 3 | 3 |

All twelve specific identifiers occur exactly once. Text, inline emphasis,
links, publication/access details, and source order of the restored entries are
preserved. No existing cited entry was lost or duplicated.

## 9. Edition-wide same-pattern census

All 137 chapters plus every published Markdown resource were scanned by actual
`footnoteDefinition` / `footnoteReference` structure, not bibliography-like prose.
**378 canonical / 378 rendered entries**: 366 cited footer entries plus 12 uncited
entries at their source locations. Known omissions restored: **12/12**; affected
chapters: **5**; additional same-root-cause omissions: **0**; additional restored:
**0**; remaining known reference omissions: **0**. Evidence regenerates in
`website/artifacts/reference-census.json` during `verify`.

## 10. Reference preservation regression tests

Seven added tests: five exact affected-chapter cases, one full-corpus definition
preservation case, and one generalized fixture covering uncited definitions,
continuation paragraphs, nested lists, blockquotes, emphasis, strong text, inline
code, reference-style links, repeated/case-insensitive citations, source position,
and absence of fabricated backlinks. All seven failed against the authenticated
pre-F1 adapter (0 PASS / 7 FAIL), then passed after correction (7 PASS / 0 FAIL).

The shared assertion checks canonical/rendered counts, per-identifier uniqueness,
text, inline formatting, external URLs, and uncited source order. Build smoke
runs the same assertions against actual generated article HTML for the complete
published Markdown corpus. This closes the original coverage gap, where tests
only validated already-rendered footnote anchors.

## 11. Markdown fidelity regression

All 20 established tests still pass. Full-output comparison against WEB-3V shows
only the five affected chapter HTML files changed; **244/249 files are byte-identical**.
After removing only the twelve restored reference containers from those five
pages, their complete DOM signatures equal the pre-F1 pages, ignoring only
whitespace-only separator nodes. No surrounding prose, heading, table, list,
blockquote, code, link, footnote, metadata, navigation, or attribute changed.

## 12. Route/page preservation

137 chapter routes, 12 Part routes, 94 resource routes, and 247 HTML pages remain.
All 136 chapter transitions and 11 cross-Part boundaries pass. Part indexes,
handbook/resource indexes, CSS, sitemap, and all resource pages are byte-identical.

## 13. Link/fragment results

**12,564 internal links/fragments; zero broken destinations.** Delta: **0**.
The twelve restored bibliography links are external: generated external anchors
increase from **732 to 744**, exactly +12. No artificial internal citation/backlink
was introduced. Unavailable-source classification remains 24 occurrences across
eight targets: A=14/7, C=10/1, B=D=0.

## 14. Accessibility checks

Whole-build structural checks pass on all 247 pages: one H1, heading hierarchy,
unique IDs, ARIA targets, keyboard/skip-link structure, table/code overflow regions,
and valid internal anchors. Restored content uses normal paragraphs within divs;
no nested interactive content was introduced.

Part II Chapter 10 was opened in Chrome through a loopback-only static server.
The References anchor displayed all four restored entries before Chapter Checklist,
with readable paragraphs, visible links, and no apparent page-width overflow.

**Remaining browser samples: incomplete.** The browser connector was unavailable,
so native Chrome was used. Chrome's active app/page then changed. Automatic approval
review rejected reading its current accessibility state because that could expose
unrelated signed-in/private content. The action was not bypassed. Pending samples
are Part II Chapter 11, Part III Chapter 12, Part VII Chapters 4 and 11, and the
unaffected Part I Chapter 1 control. User confirmation is required to return to
and inspect the intended local preview before completing these checks.

## 15. Website tests/build

Required `npm --prefix website ci`, `check`, `build`, `verify`: all exit 0.
**27 PASS / 0 FAIL**. Astro/TypeScript: zero errors, warnings, hints.
Explicit build: **4.87 seconds**; verify build: **4.31 seconds**.
Output size: **7,915,170 bytes**, +2,266 bytes. Largest HTML remains 99,403 bytes;
CSS remains 7,716 bytes. Two post-F1 builds match all 249 output file hashes.
No material performance regression or dependency changes.

## 16. Existing MSQE regression

**35 PASS / 0 FAIL / 0 ERROR**; baseline profile **7 PASS / 0 FAIL**, exit 0.
The First Edition checker and tests remain unchanged. The known bracket-path
batch limitation is unchanged; the required baseline profile was used.

## 17. Protected-source preservation

All 275 protected files match baseline
`522723dcb6daf655a90c7b9e11f545d177df97ce`. Zero changes to book, labs, code,
diagrams, review governance, checker/tests, CHANGELOG, or LICENSE. Zero staged
changes. No educational source or reference correction was made upstream.

## 18. Previously accepted WEB-3 control preservation

Discovery, metadata, route uniqueness, Part indexes, sequence, resources,
resource exposure, Mermaid deferral, canonical URLs, sitemap, noindex,
build determinism, performance, license boundary, and WEB-4 boundaries pass
existing checks and output comparisons. All incoming candidate files outside
the frozen F1 scope remain byte-identical. No WEB-3 redesign or WEB-4 work.

## 19. Implementation-report update

This section is appended to the original WEB-3 author report. The original report
bytes remain intact, including its historical Decision A author claim. WEB-3V's
Decision B and this F1 correction/pending browser status are explicitly recorded.
No independent acceptance or governance closure is claimed.

## 20. Complete candidate scope

Incoming WEB-3 candidate: 18 paths:

- `website/README.md`
- `website/WEB3_IMPLEMENTATION_REPORT.md`
- `website/src/components/HandbookNavigation.astro`
- `website/src/layouts/Base.astro`
- `website/src/layouts/Part.astro`
- `website/src/layouts/Reading.astro`
- `website/src/lib/content/loader.ts`
- `website/src/lib/content/registry.ts`
- `website/src/pages/404.astro`
- `website/src/pages/handbook/[...slug].astro`
- `website/src/pages/handbook/index.astro`
- `website/src/pages/resources/index.astro`
- `website/src/pages/sitemap.xml.ts`
- `website/src/styles/global.css`
- `website/tests/build-smoke.ts`
- `website/tests/content.test.ts`
- `website/tests/full-handbook.test.ts`
- `website/tests/preservation.ts`

F1 adds `website/tests/reference-preservation.ts` and
`website/tests/references.test.ts`, and modifies the loader, build smoke, and this
report as listed in section 7. Complete resulting candidate: **20 paths**:

- `website/README.md`
- `website/WEB3_IMPLEMENTATION_REPORT.md`
- `website/src/components/HandbookNavigation.astro`
- `website/src/layouts/Base.astro`
- `website/src/layouts/Part.astro`
- `website/src/layouts/Reading.astro`
- `website/src/lib/content/loader.ts`
- `website/src/lib/content/registry.ts`
- `website/src/pages/404.astro`
- `website/src/pages/handbook/[...slug].astro`
- `website/src/pages/handbook/index.astro`
- `website/src/pages/resources/index.astro`
- `website/src/pages/sitemap.xml.ts`
- `website/src/styles/global.css`
- `website/tests/build-smoke.ts`
- `website/tests/content.test.ts`
- `website/tests/full-handbook.test.ts`
- `website/tests/preservation.ts`
- `website/tests/reference-preservation.ts`
- `website/tests/references.test.ts`

## 21. Repository mutation state

**UNSTAGED / UNCOMMITTED / UNPUSHED.** Branch and HEAD unchanged; index clean.
No checkpoint, integration, push, deployment, DNS/Cloudflare change, tag/release,
First Edition governance edit, or license change. A loopback preview remains
available solely for completing the pending browser checks.

## 22. Final decision

**Pending required browser completion.** The rendering correction is implemented
and automated evidence is green. The requested successful WEB-3F1 decision is not
yet issued because five of the six browser samples remain unchecked.

## 23. Exact recommended next action

Bring the local MSQE Chrome tab to the front and confirm that it may be inspected.
Complete the remaining five browser samples, then record the final F1 outcome.
After completion, obtain **fresh independent WEB-3V2** before any separately
authorized staging, checkpointing, integration, or deployment.


## WEB-3F1 browser completion addendum — 2026-09-10

This addendum supersedes the pending browser status and next action above, while
preserving the earlier implementation record. Following explicit user confirmation
and the supplied local-preview screenshot, inspection was limited to the authorized
local MSQE Chrome tab and the five affected chapters plus one unaffected control.
No unrelated tabs/windows or external bibliography destinations were accessed.

| Browser sample | Rendered reference entries | Result |
| --- | ---: | --- |
| Part II, Chapter 10 | 4 | All four restored entries visible |
| Part II, Chapter 11 | 5 | Two restored entries and three cited footnotes visible |
| Part III, Chapter 12 | 5 | Two restored entries and three cited footnotes visible |
| Part VII, Chapter 4 | 2 | Restored Git entry and cited OpenTofu footnote visible |
| Part VII, Chapter 11 | 3 | All three restored entries visible |
| Part I, Chapter 1 — unaffected control | 4 | Existing cited footnotes and four backlinks retained |

All six required browser samples are complete. Reference text and links were
readable, with no observed clipping or horizontal reference-layout overflow.
For the five samples inspected after browser-connector recovery, the DOM reported
viewport width and document scroll width both 2560 CSS pixels. Part II Chapter 10
was visually inspected earlier through native Chrome. This is a bounded desktop
browser check, not a claim of comprehensive accessibility or responsive testing.
The existing automated markup, fragment, fidelity, and corpus checks remain the
supporting evidence recorded above; no implementation changes followed those checks.

**A — WEB-3F1 REFERENCE RENDERING CORRECTION COMPLETE; CANONICAL REFERENCE
CONTENT RESTORED; READY FOR FRESH INDEPENDENT WEB-3V2.**

All 12 missing canonical entries are restored; the edition-wide census remains
378 canonical / 378 rendered references, with no remaining missing entries.
The candidate remains unstaged, uncommitted, and unpushed. No canonical source
changes, deployment, or WEB-4 work occurred. The next action is fresh independent
WEB-3V2 verification; this implementation result is not an independent acceptance.
