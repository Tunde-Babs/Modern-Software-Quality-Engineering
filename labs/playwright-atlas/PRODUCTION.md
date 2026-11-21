# Playwright companion publication candidate

Prepared 2026-11-21 for integration with **msqe.dev**, as requested by the owner.
Status: **AWAITING INDEPENDENT PUBLICATION REVIEW — NOT DEPLOYED**.
This is a companion publication candidate, not a First Edition release or tag.

## Candidate and scope

Source baseline: `60bc19d93f05514e4dfe1a941ade1563eca8322d`.
Candidate branch: `codex/playwright-production-integration`. The exact 20-path
allow-list and its pre-edit amendments are recorded in [SCOPE.md](SCOPE.md).
The 27 authored labs target beginner-to-advanced practical automation engineering;
see [LEARNING_LEVELS.md](LEARNING_LEVELS.md) and [ASSESSMENT.md](ASSESSMENT.md).
API response mocking, advanced fixtures, POM and COM are delivered in Labs 25–27.
COM means Component Object Model, distinct from framework component testing.

No manuscript, edition-review record, release version, DNS, Cloudflare setting,
public API or production branch is changed by this candidate. The existing
unrelated 25 tracked corrections and two untracked polling-test files remain
outside the candidate. Never build the production artifact from that dirty tree.

## Integrated routes and execution

| Intended route | Delivered behavior |
| --- | --- |
| `/labs/playwright/` | Handbook entry, progression and local setup; indexed in local search |
| `/labs/playwright/learn/` | All 27 guides, supplied exercises, worked solutions and shared sources; browser-local evidence notes |
| `/labs/playwright/shop/` | Fictional browser-only sign-in, search, cart and controlled browser faults |

The bench and shop are nonindexable and excluded from the sitemap. All requests
and assets stay on the handbook origin. The export reads only the explicit
teaching-source map; source files are served as inert `.txt` content. Simulator
server code, governance records, secrets and arbitrary repository paths are not
exported. Published examples are read-only snapshots; editing happens locally.

Playwright execution, worker/test fixtures, stateful APIs, authentication-state
experiments, checkout and idempotency/failure scenarios run on the learner’s local
Node server. The online bench explains this and does not offer a broken public
workspace-creation button. A workspace query cannot enable a public backend.
No public multiuser simulator is claimed. Hosting that Node API would be a
separate architecture/security/operations scope.

Existing Cloudflare Pages remains a static Astro deployment. Its build invokes
the bounded exporter after Astro/Pagefind; output remains `website/dist`.
The existing Node 24.20.0 / npm 11.19.0 contract, headers, indexing switch and
handbook source-preservation rules remain applicable.

## Author validation evidence

| Check | Result |
| --- | --- |
| Complete local authored track after accessibility fixes | 162 passed, 43.2 seconds |
| Website TypeScript/Astro diagnostics | 0 errors, 0 warnings; 8 hints |
| Static production output and companion export | 13 passed |
| Chrome with production headers: all 27 guides, advanced source, mobile accessibility, shop behavior, handbook search and recovery | 4 passed, 10.4 seconds |
| Clean committed baseline plus only the integration files | Full `verify:production` passed: 45 unit checks, build smoke, 10 production checks and 3 companion export checks |
| Clean candidate production browser run | 4 passed, 11.1 seconds |
| Negative identity checks in a disposable snapshot | Changed byte, extra path and executable-mode change each rejected |

Output comprises 263 handbook/entry pages plus two interactive companion views;
261 sitemap URLs and 259 Pagefind documents. Existing 13,599 internal links plus
two discovery links and nine landing-page links are checked (13,610 total).
The two companion views have separate export/browser checks. All 95 explicit
teaching sources are present. No new runtime dependency is introduced.

Before the reconciliation, full website verification passed 44/45 unit checks
and failed the historical guard at the already committed companion workflow.
The candidate adds an exact companion SHA-256/path/mode transition while keeping
all historical manuscript checks. The clean candidate passes the reconciled guard. The transition remains
author-prepared evidence, not independent acceptance. Unrelated corrections must still be rejected.

Final author diagnostics on the clean snapshot: 0 errors, 0 warnings, 0 hints.
The snapshot was extracted from the committed baseline, overlaid with only the
frozen allow-list and checked against the existing Git objects read-only; it is
not an isolated worktree or a production deployment. Outside-scope preservation
checks cover 509 files. Independent acceptance remains outstanding.

The source transition freezes all 124 companion files and both dedicated root
workflows. Its own bytes are pinned by the preservation checker. An extra source,
changed byte, deletion or executable/symlink file must fail. Generated artifacts
are ignored. CI retains evidence and requires the full publication check; there
is no deployment step or permitted gate bypass.

## Required independent review and deployment handoff

The repository [Quality Gates](../../docs/01-editorial/QUALITY_GATES.md), § Part-level
asset classification, state: “Optional does not mean unreviewed.” Later asset
publication requires applicable technical, editorial, safety, reproducibility and
learning-quality validation. [AGENTS.md](../../AGENTS.md) §§5, 14–15 separate author
checks from independent verification. The correction author cannot supply that
independent decision. Nothing here advances a chapter, Part or edition gate.

An independent reviewer must assess the exact candidate commit and record their
evidence and publication decision, including:

1. Reproduce the full companion and website checks from a clean checkout; inspect
   the exact source transition and preservation of the incoming handbook baseline.
2. Re-derive the 27-lab learning progression, setup reproducibility, technical
   correctness and editorial/accessibility quality. Check mocking, fixture
   ownership/teardown and POM/COM boundaries with fresh inputs, using ASSESSMENT.md.
3. Check that online/local distinctions are truthful, no server API is exposed,
   approved teaching-source population is exact, and notes stay browser-local.
4. Review desktop/mobile behavior, production CSP/search, license attribution,
   keyboard access, direct links and error recovery across affected views.

After acceptance, the integration owner must identify the clean source commit,
authenticate the current Cloudflare production project/branch, build settings
and known-good rollback deployment, and deploy the accepted candidate through
the existing Pages integration. A candidate push is not a production release.
Verify the deployed source identity, all three routes, assets, security headers,
HTTPS/canonical/indexing behavior and a browser sign-in/search/cart smoke check.
Record the actual deployment URL/identity and results without modifying accepted
historical launch evidence. Roll back to the authenticated known-good Pages
deployment if those checks fail. No current rollback ID is inferred from Git.

Production remains blocked until that independent acceptance and authenticated
deployment verification exist. Automated passing checks alone do not remove it.
