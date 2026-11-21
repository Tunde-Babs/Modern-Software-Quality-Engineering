# First-slice scope and baseline

Date: 2026-11-21. User authorised the local Atlas simulator, TypeScript bridge and first three labs. Status: Draft author work, optional companion enrichment. No independent acceptance or publication is claimed.

## Recorded preflight

- Branch: `feature/first-edition-review`.
- HEAD: `8d4bf1ca0a028ae7b2c06664b792962b139c439e`.
- Tracking comparison: 0 ahead / 0 behind local `origin/feature/first-edition-review`; no fetch performed.
- Worktrees: current repository at that HEAD; MSQE-T1 (`review/phase-f-t1`) and MSQE-T6 (`review/phase-f-t6`) at `33a81ae`.
- Existing dirty work: 25 modified tracked paths plus untracked `tests/fixtures/` and `tests/test_polling_deadlines.py`. Empty index diff. Existing correction work is preserved.
- Preflight: 396 existing tracked files digested before authoring. Only the 26 new paths below are in scope.

## Frozen new-path allow-list

Allocated before edits; repository-relative paths:

- `labs/playwright-atlas/.gitignore`
- `labs/playwright-atlas/README.md`
- `labs/playwright-atlas/SCOPE.md`
- `labs/playwright-atlas/VALIDATION.md`
- `labs/playwright-atlas/ROADMAP.md`
- `labs/playwright-atlas/package.json`
- `labs/playwright-atlas/package-lock.json`
- `labs/playwright-atlas/tsconfig.json`
- `labs/playwright-atlas/playwright.config.ts`
- `labs/playwright-atlas/server.mjs`
- `labs/playwright-atlas/app/index.html`
- `labs/playwright-atlas/app/styles.css`
- `labs/playwright-atlas/app/app.js`
- `labs/playwright-atlas/app/products.json`
- `labs/playwright-atlas/bridge/README.md`
- `labs/playwright-atlas/bridge/essentials.ts`
- `labs/playwright-atlas/lessons/01-login.md`
- `labs/playwright-atlas/lessons/02-search.md`
- `labs/playwright-atlas/lessons/03-cart.md`
- `labs/playwright-atlas/exercises/01-login.spec.ts`
- `labs/playwright-atlas/exercises/02-search.spec.ts`
- `labs/playwright-atlas/exercises/03-cart.spec.ts`
- `labs/playwright-atlas/solutions/01-login.spec.ts`
- `labs/playwright-atlas/solutions/02-search.spec.ts`
- `labs/playwright-atlas/solutions/03-cart.spec.ts`
- `labs/playwright-atlas/checks/simulator.spec.ts`

Dependencies, reports and screenshots are ignored local outputs beneath the companion. No root README, sprint, manuscript, Part README, template, quantitative tool, accepted event, finding, baseline manifest, release or website source is edited. No staging, commit, push, new worktree, release or deployment is included.

## Review boundary

VALIDATION.md contains author execution evidence. Independent technical, editorial and learning review of the exact companion remains outstanding before publication. Later labs are proposals. The approved Part V curriculum and released manuscript evidence remain unchanged.

## Slice 2 — frozen before implementation, 2026-11-21

The user subsequently authorised committing and pushing the completed companion and proceeding with the planned labs. That instruction supersedes the initial no-stage/no-commit/no-push scope for companion files only. The first slice was committed as `b8f4576`; its evidence above remains a point-in-time record. This next bounded slice implements Labs 4–7: fragment navigation, native form validation, locator ambiguity and controllable asynchronous catalog loading.

Preflight: branch `feature/first-edition-review`, first-slice HEAD `b8f4576`; upstream was fetched before that checkpoint and had zero divergence. The same three worktrees remain. The 25 unrelated tracked modifications and untracked polling test work are excluded. A SHA-256 snapshot of 398 unrelated tracked/untracked files is retained at `/tmp/msqe-atlas-slice2-preservation.json`. No concurrent agent work is authorised or used.

Exact slice-2 allow-list, relative to `labs/playwright-atlas/`:

- `SCOPE.md`
- `VALIDATION.md`
- `README.md`
- `ROADMAP.md`
- `app/index.html`
- `app/app.js`
- `app/styles.css`
- `checks/simulator.spec.ts`
- `lessons/04-navigation.md`
- `lessons/05-validation.md`
- `lessons/06-locators.md`
- `lessons/07-async.md`
- `exercises/04-navigation.spec.ts`
- `exercises/05-validation.spec.ts`
- `exercises/06-locators.spec.ts`
- `exercises/07-async.spec.ts`
- `solutions/04-navigation.spec.ts`
- `solutions/05-validation.spec.ts`
- `solutions/06-locators.spec.ts`
- `solutions/07-async.spec.ts`

Eight existing companion paths may change and twelve may be added: expected post-slice source population 38. Dependency versions and execution configuration stay as recorded in the first slice. Commit and push are authorised after author validation and explicit-path staging checks. Publication, independent acceptance, releases and edition-review corrections remain outside this task. Labs 8–24 remain planned for later slices.

## Guided learning workspace — frozen before implementation, 2026-11-21

The user has tried the shop successfully and authorised the next work to facilitate implementing the labs. This bounded package adds a browser learning workspace for the seven authored labs, using their existing Markdown as the instruction source. It provides hints, read-only starter/solution views, terminal commands and learner-reported progress. It does not run shell commands from HTTP requests, grade learners, modify exercise files or deliver Labs 8–24. Tests get a separate local port so manual practice can remain open.

Preflight: `feature/first-edition-review`, HEAD `d1bbe28b58705ef731ffe1efbcb79c0201d4c0fd`, 0 ahead / 0 behind the locally recorded upstream; no fetch yet. The same three worktrees remain. Index and companion diffs are empty. The 25 unrelated tracked modifications and untracked polling tests are preserved. SHA-256 preservation snapshot: `/tmp/msqe-atlas-workspace-preservation.json`. No delegated agent work. Companion pre-population: 38 files; expected post-population: 44.

Exact allow-list, relative to `labs/playwright-atlas/` (17 existing and six new paths):

- `SCOPE.md`
- `VALIDATION.md`
- `README.md`
- `ROADMAP.md`
- `playwright.config.ts`
- `server.mjs`
- `app/index.html`
- `app/styles.css`
- `checks/simulator.spec.ts`
- `solutions/04-navigation.spec.ts`
- `lessons/01-login.md`
- `lessons/02-search.md`
- `lessons/03-cart.md`
- `lessons/04-navigation.md`
- `lessons/05-validation.md`
- `lessons/06-locators.md`
- `lessons/07-async.md`
- `app/learn.html` (new)
- `app/learn.js` (new)
- `app/learn.css` (new)
- `app/lesson-renderer.js` (new)
- `learning-content.mjs` (new)
- `checks/learning.spec.ts` (new)

Existing lessons change only their local-server instructions; the navigation solution and context-isolation check replace the hardcoded test origin with the configured base URL. All learner exercise source remains frozen. The seven lessons, bridge, setup and roadmap may be served read-only through explicit mappings; governance, dependencies and arbitrary repository paths are excluded. Dependency versions stay fixed. Prior companion commit/push authorisation continues after validation and explicit-path scope checks. No live release, publication acceptance or edition-review correction is authorised by this package.

## Guided Lab 1 implementation — frozen before implementation, 2026-11-21

The user asked to proceed from the Lab 1 implementation instructions. This bounded step implements the two login exercise checks as an explicitly assisted example and demonstrates that a deliberately incorrect expectation fails. It does not represent independent learner mastery or mark browser progress as practised. The earlier exercise freeze applied to the workspace package; this task explicitly permits editing Lab 1 only.

Preflight: `feature/first-edition-review`, HEAD `e6df2fe540509dbea6b66adc63ae13cda24761ca`, 0 ahead / 0 behind locally recorded upstream; same three worktrees; empty index and companion diff. Existing 25 modified tracked paths and untracked polling tests remain excluded. Preservation snapshot: `/tmp/msqe-atlas-lab1-preservation.json`. Source population remains 44 before and after; no new source files or dependencies.

Exact allow-list, relative to `labs/playwright-atlas/`:

- `SCOPE.md`
- `VALIDATION.md`
- `exercises/01-login.spec.ts`

Run the type check, the two learner-project tests, and a temporary wrong-expectation control, restoring the correct expectation before final validation/checkpoint. Other exercises, answer keys, app/lesson source and all edition-review surfaces remain frozen. Prior companion commit/push authorisation continues with explicit-path staging and preservation checks. No independent review, score, publication or release is implied.

## Guided Lab 2 implementation — frozen before implementation, 2026-11-21

The user asked to continue to the next steps after the guided login example. This bounded step implements the two search exercises as assisted examples: case-insensitive matching with product identity, and an empty result followed by clearing the query. No independent learner mastery or practice progress is recorded.

Preflight: branch `feature/first-edition-review`, HEAD `7bd3b4c71b5fe05331a996860ad08a2929be6ad7`, 0 ahead / 0 behind locally recorded upstream; same three worktrees; empty index and companion diff. The existing 25 tracked modifications and untracked polling tests remain excluded. Preservation snapshot: `/tmp/msqe-atlas-lab2-preservation.json`. Source population: 44 before / 44 after, with no new source or dependencies.

Exact allow-list, relative to `labs/playwright-atlas/`:

- `SCOPE.md`
- `VALIDATION.md`
- `exercises/02-search.spec.ts`

Run the TypeScript check and the two search tests. Other exercises, solutions, lessons, app source and edition-review surfaces stay frozen. Prior companion commit/push authorisation continues with explicit-path staging and preservation checks. This is author execution evidence only; no independent review, gate, release or deployment is implied.
