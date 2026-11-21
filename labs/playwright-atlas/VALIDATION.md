# Author validation — first slice

Recorded 2026-11-21. **Author checks completed; Draft companion.** These results do not establish independent technical, editorial, educational or publication acceptance. See [SCOPE.md](SCOPE.md) for the frozen 26-path package and original repository baseline.

## Execution evidence

Environment: macOS, Node.js v24.20.0, npm 11.19.0, local dependencies from the pinned package lock. Commands run from this companion unless indicated otherwise.

| Check | Observed result |
|---|---|
| `npm run verify` using default bundled Chromium | Exit 0; TypeScript check and executable bridge passed; **14 passed** in 5.2 seconds: 6 solution tests and 8 simulator checks |
| `ATLAS_BROWSER_CHANNEL=chrome npm run verify` in the preceding interrupted session | Exit 0; bridge and type check passed; **14 passed** in 12.7 seconds |
| `npm test -- 01-login --reporter=line --output=artifacts/learner-check` | Exit 1 as expected; exactly **2 TODO failures** from the unfinished learner starters, with a screenshot, error context and trace for each |
| `node --check` on `server.mjs` and `app/app.js` | Exit 0 for both |
| `git diff --check` from the repository root | Exit 0 |
| Local Markdown link check | 21 relative links resolve to files |
| Lesson headings against `templates/LAB_TEMPLATE.md` | All 3 lessons match the template sections and order |
| Screenshot inspection | Desktop 1280-pixel and mobile 390-pixel layouts inspected; content and controls remain readable. Mobile overflow assertion passed |
| Existing tracked-file preservation | All **396/396** files match the original preflight SHA-256 snapshot; zero existing tracked byte changes caused by this companion |
| Frozen scope and staging | Exactly **26/26** companion source paths; zero missing or unexpected paths; index remains empty |

The initial browser attempt in the preceding session was blocked by sandbox `listen EPERM` at `127.0.0.1:4178`. Successful browser checks ran with permission outside the sandbox so the local server and browser could start. No test was waived. No retries were configured. The later learner run exercised only the `learner` project; its expected failures are not solution-suite regressions or completed learner work.

The simulator checks cover reset, controlled sign-in failure, reload persistence, sign-out, context isolation, catalog failure, search/cart independence, narrow layout and desktop browser errors. The six worked solutions cover successful/unsuccessful login, matching/empty search, repeated cart additions/removal and mixed-product totals. These checks cover the stated local simulator behaviour; they do not prove real authentication, payments, backend behaviour, full accessibility or browser compatibility beyond the executed configurations. Labs 4–24 remain planned.

## Local artifacts

Ignored outputs beneath this companion:

- `playwright-report/index.html`: successful default verification report.
- `artifacts/atlas-desktop.png` and `artifacts/atlas-mobile.png`: rendered simulator views.
- `artifacts/learner-check/`: expected Lab 1 failure screenshots, contexts and traces.

Use `npm run report` for the verification report. A later normal test run replaces that report with its own results. These generated outputs are local author evidence, outside the frozen source population.

## Exact authored source identity

The table below records Git blob IDs for the **25 source files other than this validation record**, in repository-relative path order. The complete authored source population is 26 files including this record. Excluding this record avoids a self-referential identity. The SHA-256 of the UTF-8 manifest formed as `blob-id`, two spaces, repository-relative path and LF for each row is:

`1596860936d21e014e1ed24e48b84221bf6e6ea7ce6f5643e4dfa784a1a54c08`

| Path (relative to this companion) | Git blob ID |
|---|---|
| `.gitignore` | `50e16b7fc22dc01bd1b3c191fc8d008cc457e24a` |
| `README.md` | `34f6a7ff9052d64c69b4543763fccfa90883a552` |
| `ROADMAP.md` | `1660300099e88f08143796f3ec762d84bcc22afb` |
| `SCOPE.md` | `038df85357ebe2020dcd3f1044df87359c250cc3` |
| `app/app.js` | `c273e16f1fdcd816bdfdaa105772b070caf5ba05` |
| `app/index.html` | `3918d4ee4a3ab9aac0a65516517e57e605726953` |
| `app/products.json` | `0aad26ee6e5870ce39e74b721225ff98d74b2d5a` |
| `app/styles.css` | `20cd00284c48d90f0ebd402b7106dfa57c66f073` |
| `bridge/README.md` | `ba4e1dc0db4add43e2dbc5b90c7e50853bf22fc2` |
| `bridge/essentials.ts` | `d858d012268300e58ac5a9d47b5a306e7ff63bf2` |
| `checks/simulator.spec.ts` | `ec85a8f13c52692143da0184bed27f78bfe76b90` |
| `exercises/01-login.spec.ts` | `cd5598c1c5b4236cbbe4950b7b8cc316430f5b1d` |
| `exercises/02-search.spec.ts` | `ba481a9e650dc0cc8a109cd742803f85b3df53de` |
| `exercises/03-cart.spec.ts` | `b64f01a398fe1320be8c968635196a012db3d334` |
| `lessons/01-login.md` | `54f3a34200f6a419bc05d552553693ad284fc01b` |
| `lessons/02-search.md` | `42f3f8f62cdf1c76b61af7845cd99f0d6e2e4e0f` |
| `lessons/03-cart.md` | `2cfa4da26ade661a8e02d22fe76d27424ffe5ece` |
| `package-lock.json` | `2721ea1ad379a90a3eabb1496fa951a1eba2ebf4` |
| `package.json` | `11f0cae96f7dd30024efc86244160373b08c55db` |
| `playwright.config.ts` | `bff395eca79eaae775ed4dc54410ab826edeed46` |
| `server.mjs` | `079e2db08224835d4710a09804564c5acb8f937d` |
| `solutions/01-login.spec.ts` | `56b7a849b0a1b26ad977e5c727b435abe1766de9` |
| `solutions/02-search.spec.ts` | `6ff9a8e765d2003b9a6ae148d182350019046636` |
| `solutions/03-cart.spec.ts` | `72c25bbd69960d969d03160f4f24e4c78318cca5` |
| `tsconfig.json` | `5b8385b00838317dfb72236e7255a9926f643d27` |

## Handoff boundary

The original 25 modified tracked paths and untracked polling-deadline test work remain untouched. Branch and HEAD remain `feature/first-edition-review` at `8d4bf1ca0a028ae7b2c06664b792962b139c439e`, 0 ahead / 0 behind the locally recorded upstream (no fetch). No staging, commit, push, deployment, release, finding closure or lifecycle advancement occurred. Fresh independent review remains outstanding before publication. For local learning, start with [the first-session guide](README.md) and [Lab 1](lessons/01-login.md).


## Slice 2 author validation — Labs 4–7, 2026-11-21

**Current author result: 25 passing solution/simulator checks; Draft companion.** The first-slice evidence above describes its original baseline and is preserved as historical author evidence. Its 25-file identity table is not a claim about the extended current source.

The user authorised committing/pushing the first slice and proceeding with the planned labs. The first-slice commit `b8f457610bd158a016ea338de776227555270736` was pushed to `origin/feature/first-edition-review`. It is the pre-slice-2 baseline: **26 source files**, with exact pre-change blob IDs obtainable from `git ls-tree -r b8f457610bd158a016ea338de776227555270736 -- labs/playwright-atlas`. The frozen slice-2 scope is 20 paths: eight existing companion files and twelve additions. Actual post-change source population: **38 files**. No dependency or runner configuration changed.

| Check | Observed result |
|---|---|
| `npm run verify`, default bundled Chromium | Exit 0; type check and executable bridge passed; **25 passed** in 9.1 seconds: 14 worked-solution tests and 11 simulator checks |
| `npm test -- '0[4-7]-' --reporter=line --output=artifacts/slice2-learner-check` | Exit 1 as expected; exactly **8 TODO failures** from new unfinished learners, each with screenshot, error context and trace |
| JavaScript syntax checks | `node --check` passed for `server.mjs` and `app/app.js` |
| Whitespace | `git diff --check` passed |
| Lesson template | All **7/7** lesson heading sequences match `templates/LAB_TEMPLATE.md` |
| Relative Markdown links | **54** resolve to files, excluding generated outputs |
| Render inspection | Updated desktop and 390-pixel mobile screenshots inspected; navigation, catalog status, cards and account/cart controls remain readable; automated mobile overflow check passed |
| Unrelated work preservation | **398/398** tracked/untracked files outside this companion match their pre-slice-2 SHA-256 snapshot; original edition-review changes preserved |
| Source scope | **38/38** source files, exactly the original 26 plus 12 declared additions; source changes limited to the frozen 20-path slice-2 list |

No retry or fixed sleep is used by the worked solutions. Existing Labs 1–3 continue to pass. New checks cover fragment/history navigation, Home session persistence, required/malformed email boundaries, scoped repeated-button interactions, locator use after a DOM rebuild, delayed completion, failure and recovery. Simulator regressions exercise reset while failure is pending (using the controlled browser clock), a query changed during loading, preservation of cart contents through reload, and prevention of stale product cards after failure.

Execution used the same local macOS / Node.js v24.20.0 / npm 11.19.0 environment and authorised server/browser permission as the first slice. The current verification report remains `playwright-report/index.html`; expected learner failures are separately retained in `artifacts/slice2-learner-check/`. Updated screenshots are `artifacts/atlas-desktop.png` and `artifacts/atlas-mobile.png`. Generated outputs remain ignored and are excluded from commits.

These are author checks of local simulation, not independent verification or proof of production authentication, backend reliability, performance targets, full accessibility or broad cross-browser support. Native validity properties avoid locale-dependent popup text. Delays/failures are browser-side practice controls, with a local JSON fetch on successful catalog loads. Labs 8–24 remain planned. No edition finding, accepted baseline, chapter status or release state changes.

### Slice 2 exact source identity

The following **37 Git blob IDs**, excluding this validation record, identify the current 38-file authored package without a self-reference. Manifest format is unchanged: UTF-8 `blob-id`, two spaces, repository-relative path, LF; paths sorted lexicographically. Manifest SHA-256:

`a0628499dd3744151f8489d4fb133ac8aa01546b24eed413a3f9a369df9b923e`

| Path (relative to this companion) | Git blob ID |
|---|---|
| `.gitignore` | `50e16b7fc22dc01bd1b3c191fc8d008cc457e24a` |
| `README.md` | `05dddf8df8ae183aa49ae1cc4b10a78ebf3b8e96` |
| `ROADMAP.md` | `340bb1a59a05239c332f2d678eb62d73723f9105` |
| `SCOPE.md` | `b1ef6900137f16a45b860170731afe4a44a82955` |
| `app/app.js` | `846fc290c550689873d00501c4585911cccdbf14` |
| `app/index.html` | `58c4e2218f915b0ebef6307898004f8e95311d9e` |
| `app/products.json` | `0aad26ee6e5870ce39e74b721225ff98d74b2d5a` |
| `app/styles.css` | `c9133ca344228d674f80e43ec15d1b537cea2a55` |
| `bridge/README.md` | `ba4e1dc0db4add43e2dbc5b90c7e50853bf22fc2` |
| `bridge/essentials.ts` | `d858d012268300e58ac5a9d47b5a306e7ff63bf2` |
| `checks/simulator.spec.ts` | `0761517319dea38532f5333b47870fe97e5fe3e8` |
| `exercises/01-login.spec.ts` | `cd5598c1c5b4236cbbe4950b7b8cc316430f5b1d` |
| `exercises/02-search.spec.ts` | `ba481a9e650dc0cc8a109cd742803f85b3df53de` |
| `exercises/03-cart.spec.ts` | `b64f01a398fe1320be8c968635196a012db3d334` |
| `exercises/04-navigation.spec.ts` | `7c4c0e7801e69b4c9c316a38910e72ef53568597` |
| `exercises/05-validation.spec.ts` | `bc7988099fe241d966f1bdb0aa73b540f80bb78b` |
| `exercises/06-locators.spec.ts` | `321e4de55e92c4663b41296c9ec0b44b7230da8c` |
| `exercises/07-async.spec.ts` | `d0bffe76586e264923ce3372d35845fa73d4914f` |
| `lessons/01-login.md` | `54f3a34200f6a419bc05d552553693ad284fc01b` |
| `lessons/02-search.md` | `42f3f8f62cdf1c76b61af7845cd99f0d6e2e4e0f` |
| `lessons/03-cart.md` | `2cfa4da26ade661a8e02d22fe76d27424ffe5ece` |
| `lessons/04-navigation.md` | `7be6f78061cf1fccc015cd903dbf789f1bf98236` |
| `lessons/05-validation.md` | `71624b17a9f56d20e564d4125896de866cf38b87` |
| `lessons/06-locators.md` | `ce757aff01a688695ea836cbe924bee179e4ff03` |
| `lessons/07-async.md` | `bc9b8104f20827cbe1be459a72a6aa7519f30424` |
| `package-lock.json` | `2721ea1ad379a90a3eabb1496fa951a1eba2ebf4` |
| `package.json` | `11f0cae96f7dd30024efc86244160373b08c55db` |
| `playwright.config.ts` | `bff395eca79eaae775ed4dc54410ab826edeed46` |
| `server.mjs` | `079e2db08224835d4710a09804564c5acb8f937d` |
| `solutions/01-login.spec.ts` | `56b7a849b0a1b26ad977e5c727b435abe1766de9` |
| `solutions/02-search.spec.ts` | `6ff9a8e765d2003b9a6ae148d182350019046636` |
| `solutions/03-cart.spec.ts` | `72c25bbd69960d969d03160f4f24e4c78318cca5` |
| `solutions/04-navigation.spec.ts` | `310611334a569f10d1c4d736282f91e8e0eeaf8e` |
| `solutions/05-validation.spec.ts` | `ec76f5569b0ba59f0b354f7105d31a1082e8e823` |
| `solutions/06-locators.spec.ts` | `42a232fa6241e0230a3fa3a07c5ce66c3ef592cf` |
| `solutions/07-async.spec.ts` | `6bf3da9a505874c567e91e33589fee009bd60e7c` |
| `tsconfig.json` | `5b8385b00838317dfb72236e7255a9926f643d27` |

The authorised checkpoint uses explicit path staging and a final scope/preservation check. Independent publication review remains outstanding; author execution does not advance it. No root README, sprint, manuscript, findings register, event log, quantitative tool or release artifact is included in either companion commit.
