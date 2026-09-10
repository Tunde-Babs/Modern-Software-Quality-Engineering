# MSQE local handbook portal — WEB-4

The existing Astro static portal now reads all 137 canonical chapters directly
from `../book`, generates 12 Part indexes, and publishes 103 delivered resource
documents plus two collection indexes. Manuscript bodies are not copied into this directory.

This is a local preview. Every HTML page retains `noindex, nofollow`; nothing in
WEB-4 deploys the site or configures hosting, DNS, or production workflows.

## Validation

Run from the repository root:

```sh
npm --prefix website ci
npm --prefix website run check
npm --prefix website run build
npm --prefix website run verify
PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p test_first_edition_gate.py -v
PYTHONDONTWRITEBYTECODE=1 python3 tools/first_edition_gate.py --profile baseline
```

`verify` runs type checks, 37 website tests, the static build, and whole-output
link, accessibility-structure, SEO, route, and source-preservation checks.
It writes reproducible evidence to ignored `website/artifacts/`:

- `route-census.json`: source, route, and kind for every published entry.
- `metadata-census.json`: all chapter metadata, study-time ranges, and anomalies.
- `link-report.json`: each intentionally unavailable link and its classification.
- `build-census.json`: page, link, size, and asset measurements.
- `source-preservation.json`: exact protected Git blob authentication.

See [WEB4_IMPLEMENTATION_REPORT.md](WEB4_IMPLEMENTATION_REPORT.md) for the current
implementation results. [IMPLEMENTATION_REPORT.md](IMPLEMENTATION_REPORT.md)
remains the historical WEB-2 implementation record.

## Content contract

`src/lib/content/registry.ts` discovers chapters in lexical Part/chapter order,
checks exact counts and contiguous numbering, and rejects duplicate paths/routes.
`registry`, `chapterSources`, `partSources`, `resourceEntries`, and
`chapterNeighbours` expose stable canonical source and public route identifiers.
Chapter routes use `/handbook/part-NN/chapter-NN-topic/`.

`src/lib/content/loader.ts` parses the original metadata tables, checks chapter
and Part numbering and heading hierarchy, renders sanitized Markdown, resolves
source-relative links and footnotes, and adds accessible table/code overflow
regions. `loadDocuments`, `loadParts`, and `metadataCensus` supply WEB-4 learning
path and search integrations without a parallel manuscript store. Part summaries
use the first sentence of the canonical Overview, Mission, or Purpose paragraph;
Part README governance bodies are not published.

Documents and Part summaries are cached for one build/server process. Restart
the dev server after changing canonical sources in a separately authorized task.

The resource boundary includes Part I labs, case studies, and exercises; the
11 delivered diagrams; and five Part II code projects. Code README pages link
to inert text views of delivered source, tests, fixtures, and configuration.
Nine explicitly reviewed code-project `docs` teaching artifacts are included.
Dependency trees, generated builds, lockfiles, hidden files, unreviewed `docs`,
and repository governance are excluded. `labs/README.md` and `code/README.md`
are empty placeholders and are not published. New resource roots or kinds
require an explicit adapter change and review.

Unpublished targets are explicitly enumerated in `unavailableSources`:
A = delivered but not routed; B = planned/not delivered; C = governance/internal;
D = broken source reference. Missing or unreviewed links and invalid fragments
fail the build; they are never silently treated as planned. Directory links to
registered code projects resolve to the project's README-derived public page.

Mermaid remains selectable source with surrounding canonical explanation.
Graphical rendering remains explicitly deferred; there is no runtime Mermaid.
Pagefind indexes the static output after every build; only `/search/` loads search
JavaScript, and only a submitted query loads the Pagefind engine. One foundations
path references Part I in canonical order. The sitemap includes 259 URLs, excluding
search and 404. Preview builds remain noindex by default.

See [PRODUCTION_READINESS.md](PRODUCTION_READINESS.md) for the indexing switch,
Cloudflare output settings and local browser/external-link validation commands.
## Licensing — WEB-5B

Copyright © 2026 Babatunde Ajala. Original learning content is CC BY 4.0;
original software/tooling is Apache-2.0. See [root scope](../LICENSE),
[content terms](../LICENSE-CONTENT), [software terms](../LICENSE-CODE) and
`/license/` for learner attribution and third-party exclusions.

WEB-5B adds one non-search licensing page (262 HTML pages, 260 sitemap URLs).

## Active closure state — WEB-5BR

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

See [WEB5_BLOCKER_RESOLUTION_REPORT.md](WEB5_BLOCKER_RESOLUTION_REPORT.md) for
the preserved B → BV → BF1 → BV2 → BR evidence chain.
