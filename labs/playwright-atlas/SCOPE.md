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
