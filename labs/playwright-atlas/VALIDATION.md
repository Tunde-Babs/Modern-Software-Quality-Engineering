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


## Guided workspace author validation — 2026-11-21

**Current author result: 35 passing solution/simulator/workspace checks; Draft companion.** All preceding evidence and source tables describe their historical authored packages. This section records the current extension, not independent review or a publication gate.

Pre-change baseline: `d1bbe28b58705ef731ffe1efbcb79c0201d4c0fd`, branch `feature/first-edition-review`, **38 companion source files**. Exact pre-change blob IDs are available with `git ls-tree -r d1bbe28b58705ef731ffe1efbcb79c0201d4c0fd -- labs/playwright-atlas`. The upstream branch was fetched and remained at the same commit, 0 ahead / 0 behind. Actual post-change population: **44 source files**, with **17 existing files changed / 6 added**, exactly the frozen 23-path allow-list in SCOPE.md. Dependencies remain pinned and unchanged; no learner exercise source changed.

| Check | Observed result |
|---|---|
| Final `npm run verify` on bundled Chromium | Exit 0; TypeScript check and executable bridge passed; **35 passed** in 10.3 seconds (14 solutions, 11 shop checks, 10 workspace checks) |
| `npm test -- 01-login --reporter=line --output=artifacts/workspace-learner-check` | Exit 1 as expected; exactly **2 TODO failures**, with screenshots, contexts and traces; no port conflict while the manual shop and preview were running |
| JavaScript syntax | `node --check` passed for the server, content manifest, workspace controller and Markdown renderer |
| Whitespace | `git diff --check` passed |
| Canonical lesson structure | **7/7** lessons retain the lab template's section order; their only changes concern separate local ports and the resulting navigation-test base URL |
| Relative Markdown links | **54** resolve to files |
| Preservation | **419/419** files outside the allow-list match the preflight SHA-256 snapshot, including all seven learner exercise files and all unrelated edition-review work |
| Layout and navigation | Desktop 1440-pixel and mobile 390-pixel workspace views inspected; no mobile horizontal overflow; keyboard skip link and named lesson navigation checked |

Workspace tests exercise every lesson and support guide, progressive hints, starter-source fidelity, answer-key reveal and deep-link reload, lesson-specific progress/notes through navigation and reload, corrupt/blocked browser storage, safe rendering of unexpected HTML/links, guide-load failure and recovery, and stale-request cancellation during lesson switching. Read-only route checks reject unlisted files and POST mutations. All existing shop/solution checks continue to pass, including fragment history and session state on the new configurable test origin.

Manual practice defaults to `127.0.0.1:4178`, tests own `127.0.0.1:4180`, and both support an explicit `ATLAS_PORT` override. The existing user-owned server on 4178 was left running. An updated preview was started on **4179** at `/learn`, so the user can open the workspace without stopping that server. Local progress belongs to each browser origin, including its port. When using the normal 4178 command after this update, restart the old Node process once to load the new server routes. No server is silently reused or terminated.

Ignored evidence: `playwright-report/index.html`, `artifacts/learning-desktop.png`, `artifacts/learning-mobile.png`, updated shop screenshots and `artifacts/workspace-learner-check/`. A later test run can replace the report. The workspace never writes test files or executes shell commands. It presents the canonical Markdown through a limited DOM-based renderer; notes/stages are explicitly self-reported local records, not test outcomes, grading or approval. Labs 8–24 remain planned. Automated author checks do not replace independent technical/editorial/learning review or live-release acceptance.

### Guided workspace exact source identity

The following **43 Git blob IDs**, excluding this validation record, identify the current 44-file package without self-reference. Manifest format: UTF-8 `blob-id`, two spaces, repository-relative path, LF; lexicographically sorted paths. Manifest SHA-256:

`4f06bc1a8bc135f78d25e2b9ce651b669c1cb839bf084f861040bf5fc66dff63`

| Path (relative to this companion) | Git blob ID |
|---|---|
| `.gitignore` | `50e16b7fc22dc01bd1b3c191fc8d008cc457e24a` |
| `README.md` | `19c653658cd5fc175a9cbf4b922288f703afa2cf` |
| `ROADMAP.md` | `34de89c7ebfc95883e8ac7c0deb3f23aa0ebe5ba` |
| `SCOPE.md` | `92dddd1377bd1846b9f37668a504bd78f202bf5e` |
| `app/app.js` | `846fc290c550689873d00501c4585911cccdbf14` |
| `app/index.html` | `c84636626a8793cf96cdcbe8c52c728441a6abe2` |
| `app/learn.css` | `3cf56786bf04ca9f21e2c097d96198bb043bd330` |
| `app/learn.html` | `50567d66d2003be0673e08625ce3a3391c3de28e` |
| `app/learn.js` | `8240b5562f19e08b323e907a5a9b64cc3fb56345` |
| `app/lesson-renderer.js` | `74b47fb6aae94e8f948f021decdd6ff78fbc01d2` |
| `app/products.json` | `0aad26ee6e5870ce39e74b721225ff98d74b2d5a` |
| `app/styles.css` | `d2cb54e67fb2f385260c0bdeeb966fa33718a120` |
| `bridge/README.md` | `ba4e1dc0db4add43e2dbc5b90c7e50853bf22fc2` |
| `bridge/essentials.ts` | `d858d012268300e58ac5a9d47b5a306e7ff63bf2` |
| `checks/learning.spec.ts` | `a6905d63227767da80750cadfc5bdc8595410448` |
| `checks/simulator.spec.ts` | `0c9ad2bce4eeeb2e029d52f2a10db7b112ae2f7e` |
| `exercises/01-login.spec.ts` | `cd5598c1c5b4236cbbe4950b7b8cc316430f5b1d` |
| `exercises/02-search.spec.ts` | `ba481a9e650dc0cc8a109cd742803f85b3df53de` |
| `exercises/03-cart.spec.ts` | `b64f01a398fe1320be8c968635196a012db3d334` |
| `exercises/04-navigation.spec.ts` | `7c4c0e7801e69b4c9c316a38910e72ef53568597` |
| `exercises/05-validation.spec.ts` | `bc7988099fe241d966f1bdb0aa73b540f80bb78b` |
| `exercises/06-locators.spec.ts` | `321e4de55e92c4663b41296c9ec0b44b7230da8c` |
| `exercises/07-async.spec.ts` | `d0bffe76586e264923ce3372d35845fa73d4914f` |
| `learning-content.mjs` | `dc290120519e1972d6718b865c95565c4e532508` |
| `lessons/01-login.md` | `f5acf4fbab0a07cf168e6c0d052d569b408d6b9c` |
| `lessons/02-search.md` | `02c4d75e5f42638a6c584dcc23ed74894596cdf7` |
| `lessons/03-cart.md` | `38447f342ae8da2b43ab077d6480aa4d1e1b3f0e` |
| `lessons/04-navigation.md` | `86f712f37409b1f747a291fb5f60a4eeca26c20c` |
| `lessons/05-validation.md` | `93d83ec9afcdc488ef0c9ab7c940dc7084174d00` |
| `lessons/06-locators.md` | `85877b3d88ad1e1c140f2c8d4c290dec787bb6d6` |
| `lessons/07-async.md` | `45279a2f57f1833cf0ef6732a7d585e8891d5b27` |
| `package-lock.json` | `2721ea1ad379a90a3eabb1496fa951a1eba2ebf4` |
| `package.json` | `11f0cae96f7dd30024efc86244160373b08c55db` |
| `playwright.config.ts` | `de390c709d3f9799b354443d387ef1b48b7732f6` |
| `server.mjs` | `4d722122d09944bc6bb4ebf0f3e1b443c79e7ffe` |
| `solutions/01-login.spec.ts` | `56b7a849b0a1b26ad977e5c727b435abe1766de9` |
| `solutions/02-search.spec.ts` | `6ff9a8e765d2003b9a6ae148d182350019046636` |
| `solutions/03-cart.spec.ts` | `72c25bbd69960d969d03160f4f24e4c78318cca5` |
| `solutions/04-navigation.spec.ts` | `63dcfa4893da0f1c807f5ff0c837d296fa2ec8a0` |
| `solutions/05-validation.spec.ts` | `ec76f5569b0ba59f0b354f7105d31a1082e8e823` |
| `solutions/06-locators.spec.ts` | `42a232fa6241e0230a3fa3a07c5ce66c3ef592cf` |
| `solutions/07-async.spec.ts` | `6bf3da9a505874c567e91e33589fee009bd60e7c` |
| `tsconfig.json` | `5b8385b00838317dfb72236e7255a9926f643d27` |

The prior user-authorised commit/push scope continues for this companion package, subject to exact explicit-path staging and final preservation checks. No root governance, manuscript, accepted review event, quantitative rule/tool, release artifact or website publication surface is included. This package establishes neither a live release nor independent acceptance.


## Guided Lab 1 author execution — 2026-11-21

**Assisted example implemented; two learner-project tests pass.** This is an authored teaching demonstration, not evidence of independent learner mastery. No browser progress, assessment, chapter/review status or publication gate was advanced.

Baseline: `e6df2fe540509dbea6b66adc63ae13cda24761ca`, branch `feature/first-edition-review`. The upstream branch was fetched and remained at that commit, 0 ahead / 0 behind. Actual source population **44 before / 44 after**; three existing files changed, no additions. The exact allow-list is SCOPE.md, this validation record and exercises/01-login.spec.ts. All **439/439** files outside that scope match the preflight SHA-256 snapshot, including the other six learner exercises and unrelated edition-review changes.

| Check | Observed result |
|---|---|
| `npm run check` | Exit 0; TypeScript check passed |
| `npm test -- 01-login --headed` | Exit 0; **2 passed** in 5.2 seconds, using the learner project in a visible browser |
| Temporary wrong-name assertion | The successful-login check was temporarily changed to expect `Welcome, Morgan!`; exactly one selected test failed at that visible-state assertion after its 5-second timeout. Screenshot, error context and trace were retained under `artifacts/lab1-negative-control/`. A `finally` block restored the correct source byte-for-byte |
| Final `npm test -- 01-login` | Exit 0; **2 passed** after restoring `Welcome, Alex!` |
| Whitespace and preservation | `git diff --check` passed; exact three-path package; 439 other files preserved |

The first control filter was overly anchored and matched no tests; it established no assertion evidence. The corrected filter `--grep 'accepts the demo account'` selected one test and produced the expected assertion failure above. The final report at `playwright-report/index.html` records the restored passing pair; the negative-control evidence remains separately retained. Tests own port 4180 and leave manual practice sessions running.

The two checks use labelled inputs, the named Sign in button and retrying assertions on the resulting success/rejection states. They demonstrate simulated account behaviour for two credential combinations, not real authentication security or identity-provider integration. A learner should next try the invalid-email/valid-password variation and explain the observation without consulting the answer key. That variation has not been performed or credited here.

Exact changed-source identities (this validation record is excluded to avoid self-reference; other package files retain the baseline's blob IDs):

| Companion path | Before Git blob ID | After Git blob ID |
|---|---|---|
| `SCOPE.md` | `92dddd1377bd1846b9f37668a504bd78f202bf5e` | `bfc1e6dd486711809d3c81a5998541e1c33dfeaf` |
| `exercises/01-login.spec.ts` | `cd5598c1c5b4236cbbe4950b7b8cc316430f5b1d` | `4b005cd5e984f951f54531b84df98f33b44f1dfb` |

Prior companion commit/push authorisation continues after explicit-path staging and final scope checks. No release, deployment, independent acceptance, finding closure or unrelated correction is included.


## Guided Lab 2 author execution — 2026-11-21

**Assisted search example implemented; two learner-project tests pass.** This is author execution, not independent learner mastery, assessment or publication acceptance. No browser practice progress was marked.

Pre-change baseline: `7bd3b4c71b5fe05331a996860ad08a2929be6ad7`, branch `feature/first-edition-review`. Upstream was fetched and remained at that commit, 0 ahead / 0 behind. Source population **44 before / 44 after**; exactly three existing files changed and none added. All **439/439** files outside the SCOPE.md / VALIDATION.md / exercises/02-search.spec.ts allow-list match the preflight SHA-256 snapshot, including Lab 1 and all unrelated edition-review work.

| Check | Observed result |
|---|---|
| `npm run check` | Exit 0; TypeScript check passed |
| `npm test -- 02-search --headed` | Exit 0; **2 passed** in 5.2 seconds, in a visible browser using the learner project |
| Search evidence | Four cards established before each query; uppercase BACKPACK yields exactly the named Atlas Backpack card; spaceship yields zero cards plus No products found.; clearing restores four cards and removes the empty-state message |
| Whitespace and preservation | `git diff --check` passed; exact three-path diff; 439 other files preserved |

Tests use the owned server on port 4180, without stopping manual practice. The current `playwright-report/index.html` records this run and is a replaceable ignored local artifact. No retries, fixed sleeps, DOM-position selectors, solution changes or new dependencies were introduced. The checks cover this fictional local catalog, not remote ranking, pagination or production catalog completeness. Trying the whitespace-padded ` mug ` variation independently remains a learner next step; it has not been credited here. Lab 3 is the next guided exercise.

Exact changed-source identities (the validation record is excluded to avoid self-reference; other package files retain the baseline's blob IDs):

| Companion path | Before Git blob ID | After Git blob ID |
|---|---|---|
| `SCOPE.md` | `bfc1e6dd486711809d3c81a5998541e1c33dfeaf` | `3b022b16939faf6ae628283ebd32d1070e673d27` |
| `exercises/02-search.spec.ts` | `ba481a9e650dc0cc8a109cd742803f85b3df53de` | `c5b02879122114e97bdeea1d4394fa53dad4d085` |

Prior companion commit/push authorisation continues after explicit-path staging and final scope checks. No edition finding, accepted review event, release, deployment or independent gate is changed.


## Guided Lab 3 author execution — 2026-11-21

**Assisted cart example implemented; two learner-project tests pass.** The user's supplied screenshot established two passing search tests; it did not establish independent mastery or completion of an unseen variation. No browser practice progress, assessment or review status is advanced here.

Baseline: `fcc42a593223751f49ccefa030e9eda778181f9b`, branch `feature/first-edition-review`. Upstream was fetched and remained at that commit, 0 ahead / 0 behind. Source population **44 before / 44 after**; exactly three existing files changed, none added. All **439/439** files outside SCOPE.md / VALIDATION.md / exercises/03-cart.spec.ts match the preflight SHA-256 snapshot, including the login/search exercises and unrelated edition-review work.

| Check | Observed result |
|---|---|
| `npm run check` | Exit 0; TypeScript check passed |
| `npm test -- 03-cart --headed` | Exit 0; **2 passed** in 5.0 seconds, in a visible browser using the learner project |
| Repeated product and removal | Two scoped backpack adds yield quantity 2 and €98.00; whole-line removal yields the empty message, quantity 0 and €0.00 |
| Mixed product total | Backpack plus mug yields two cart lines, quantity 2 and €64.00 |
| Whitespace and preservation | `git diff --check` passed; exact three-path diff; 439 other files preserved |

Expected values are calculated from the stated prices (2 × €49 = €98; €49 + €15 = €64), not copied or derived from the displayed cart total. Product names scope repeated Add to cart buttons. No fixed sleeps, retries, solution changes or dependencies were introduced. Tests use the owned server on port 4180 and leave manual sessions running. The replaceable ignored report is `playwright-report/index.html`.

These checks cover selected local cart arithmetic and browser state, not tax, discounts, stock, checkout or real payments. The independent learner variation remains one Desk Lamp and two Field Notebooks, expected €53; it has not been performed or credited here. The deliberate incorrect-total challenge and later navigation exercise remain available for further practice.

Exact changed-source identities (this validation record is excluded to avoid self-reference; other files retain the baseline's blob IDs):

| Companion path | Before Git blob ID | After Git blob ID |
|---|---|---|
| `SCOPE.md` | `3b022b16939faf6ae628283ebd32d1070e673d27` | `f2956707253fad37d1911d07c951ac39b854b895` |
| `exercises/03-cart.spec.ts` | `b64f01a398fe1320be8c968635196a012db3d334` | `2dc5657706575639d1459d322c2626c292026fbe` |

Prior companion commit/push authorisation continues after explicit-path staging and final scope checks. No edition finding, accepted event, quantitative rule, release, deployment or independent gate is included.


## Complete 24-lab track author validation — 2026-11-21

**All 24 labs delivered as authored examples for user review. Local full validation: 124 PASS / 0 FAIL; browser-project validation: 8 PASS / 0 FAIL.** These are author execution results, not independent learner mastery, educational/editorial acceptance, publication approval or an edition gate. No browser progress was marked for the user.

The user expressly selected **also build planned Labs 8–24** after requesting all labs be completed. Baseline: `215d3fa9fdd4fe93bc5fdfcc94fabdd159f6bc15`, branch `feature/first-edition-review`, 44 companion files. Upstream was fetched and stayed at that commit, 0 ahead / 0 behind. Actual post-change population: **104 companion files plus one root CI workflow**. Exact frozen scope including the two recorded pre-edit amendments: **88 paths, 27 modified / 61 added**. All **415/415** other tracked/untracked files retain their preflight SHA-256 bytes, including the unrelated 25 tracked edition-review modifications and untracked polling tests. No manuscript, Part README, quantitative rule/tool, accepted event or release artifact changed.

| Check | Observed result |
|---|---|
| Final `npm run verify` | Exit 0; type check and bridge passed; **124 passed in 40.6 seconds**: 48 learner tests, 48 solution tests, 11 shop checks, 11 learning-workspace checks, 6 API/deadline/reset checks |
| `npm run test:browsers` | Exit 0; **8 passed in 9.8 seconds**, exercising Lab 18 learner/solution files in Chromium and Firefox |
| `npm run test:critical` | Exit 0; **2 passed in 2.3 seconds**, selecting the intended @critical purchase and lost-response learner checks |
| Visual references | Explicit initial generation produced two 64 × 24 PNGs; both inspected as the intended empty/filled two-colour indicators; later default comparison runs passed without updating them |
| Accessibility | Pinned @axe-core/playwright **4.14.0** scans passed for both inspected main-region states in learner and solution projects; keyboard entry/empty-result observations also passed |
| JavaScript syntax | Server, practice API, browser controller, workspace client and learning controller passed `node --check` |
| Lesson consistency | **24/24** guides preserve the lab template's section order; **148** relative Markdown links resolve; no exercise TODO implementations remain |
| Workflow source | Ruby YAML parser accepted `.github/workflows/playwright-atlas.yml`; read-only contents permission, bounded job and no deployment operation verified from source |
| Dependency installation | The official axe wrapper and axe-core installed with pinned lockfile; npm reported zero vulnerabilities in the installed nine-package tree |
| Diff and preservation | `git diff --check` passed; exact 88-path scope and 415 unchanged files verified before staging |

Earlier incremental complete runs passed 117 checks and then 124 checks as the regression package grew. The final result above includes the completed-example wording updates to the seven original guides. The Firefox and selection commands ran before the final full run; the final local HTML report therefore contains the entire 124-check review package. Generated reports/attachments, traces, screenshots and runtime workspaces are excluded from commits. Lab 16 explicitly retains successful diagnostic traces, and all projects use zero retries.

### Delivered boundaries and review limits

Labs 4–7 now have completed learner implementations. Labs 8–24 each include a distinct lesson, two authored learner tests and separate solutions. Shared code adds test-scoped workspace ownership/teardown, typed factories and a deliberately small cart abstraction. The browser workspace exposes all 24 labs through collapsible stage groups and can create disposable advanced manual state.

The loopback server offers explicit in-memory workspace/cart/session/order/fault APIs; it does not write files or run shell commands through HTTP. Advanced sign-in uses a fictional HttpOnly cookie, with authentication-state reuse tested against a fresh-context counterexample. Checkout supports controlled 402/503 outcomes, delayed confirmation and ambiguous lost responses. One four-second deadline covers submission, pending fetches and polling. Reusing a request identity returns one order; confirmed quantity consumption occurs once and preserves later additions. Tests establish these stated invariants, including unresolved submission and reset cancellation.

The browser reservation clock is independent of the server order clock. Tiny solid-colour visual references do not establish whole-page design correctness. Axe results and one keyboard interaction are not full accessibility conformance. Chromium/Firefox coverage in Lab 18 is not real-device coverage or whole-suite cross-engine evidence. Simulated checkout does not prove real authentication, payments, tax, stock, distributed settlement or production idempotency. All capstone skill assessment and independent publication review remain outstanding.

### CI and local review delivery

The root workflow runs the complete authored track on Ubuntu 24.04 with Node.js 24.20.0 and Chromium/Firefox, uploads the full report before a browser selection can overwrite it, and retains evidence for 14 days even after failure. The official actions/checkout, setup-node and upload-artifact v7 documentation was checked. Workflow definition/local PASS are separate from a subsequently observed GitHub Actions result; **no remote CI outcome is pre-claimed in this pre-push record**.

The GitHub Actions public read API was reachable and showed no prior runs before this workflow was pushed. The old agent-owned preview on port 4179 was restarted with the new routes. The user's original port-4178 process was left running. Review URL: `http://127.0.0.1:4179/learn`; the ordinary setup remains `npm start` on 4178 after restarting an older server. In-memory workspaces are intentionally lost on restart; browser learning notes remain origin-local.

### Exact current source identity

The following **104 Git blob IDs** cover all 103 companion files other than this validation record plus the root CI workflow. This avoids self-reference. The pre-change companion identity is reproducible with `git ls-tree -r 215d3fa9fdd4fe93bc5fdfcc94fabdd159f6bc15 -- labs/playwright-atlas`; the root workflow did not exist there. Manifest format: UTF-8 `blob-id`, two spaces, repository-relative path, LF; sorted paths. SHA-256:

`e0b2772ea4c10f9baa3db6a96d3690104e57aa4234a02d753cfaffc0563ea254`

```text
878f3ae792b8706c15780ead50142b6f462fcb2c  .github/workflows/playwright-atlas.yml
50e16b7fc22dc01bd1b3c191fc8d008cc457e24a  labs/playwright-atlas/.gitignore
f17f3582b76851060752475dca60c403bc5313cc  labs/playwright-atlas/README.md
b9cfc96a44d91fc4907e2f35e7621847c3b67b96  labs/playwright-atlas/ROADMAP.md
de4e6ce106802ac00d6b38df2754535da1128cb0  labs/playwright-atlas/SCOPE.md
9ee44f93bea2c9fbca13e296c502f4c08de4adb6  labs/playwright-atlas/app/app.js
292fbb3ebf3457acdd79dc887a4fd82f0edce213  labs/playwright-atlas/app/index.html
638e96f8ce6c4229d39e5c5ff4b4c9d950bf47a4  labs/playwright-atlas/app/learn.css
36e9d0167812a49a33496b141fe95bc08cd84393  labs/playwright-atlas/app/learn.html
9c9cac71caf2e7cee066483c6747921f11fa0e05  labs/playwright-atlas/app/learn.js
74b47fb6aae94e8f948f021decdd6ff78fbc01d2  labs/playwright-atlas/app/lesson-renderer.js
0aad26ee6e5870ce39e74b721225ff98d74b2d5a  labs/playwright-atlas/app/products.json
7884feef3f5333b6c6755b254a7bcc2e357f36ea  labs/playwright-atlas/app/styles.css
d1444234b23ceef516ab3ec65a4fbaf0e120d50f  labs/playwright-atlas/app/workspace-client.js
ba4e1dc0db4add43e2dbc5b90c7e50853bf22fc2  labs/playwright-atlas/bridge/README.md
d858d012268300e58ac5a9d47b5a306e7ff63bf2  labs/playwright-atlas/bridge/essentials.ts
e3dc319474126787037752b1c32495336ab31990  labs/playwright-atlas/checks/learning.spec.ts
0c9ad2bce4eeeb2e029d52f2a10db7b112ae2f7e  labs/playwright-atlas/checks/simulator.spec.ts
4394c3fc84097c769642cc69ccbf17c79a731a8e  labs/playwright-atlas/checks/workspaces.spec.ts
1a05f0720341f6860dcd91db2bc28f591c791872  labs/playwright-atlas/ci/README.md
4b005cd5e984f951f54531b84df98f33b44f1dfb  labs/playwright-atlas/exercises/01-login.spec.ts
c5b02879122114e97bdeea1d4394fa53dad4d085  labs/playwright-atlas/exercises/02-search.spec.ts
2dc5657706575639d1459d322c2626c292026fbe  labs/playwright-atlas/exercises/03-cart.spec.ts
3054c807e4a451f702e49811b7b18f1038d426c9  labs/playwright-atlas/exercises/04-navigation.spec.ts
f0a56b5a4a98ee33131f13a2bd6f65d779cfa72c  labs/playwright-atlas/exercises/05-validation.spec.ts
5203566a4264b55ad3256ef356710fa7f5dde6a1  labs/playwright-atlas/exercises/06-locators.spec.ts
0c623eeec1389fda03809afa611250370bcbb101  labs/playwright-atlas/exercises/07-async.spec.ts
b889037a3eb0eccdd70b7b59be8fb9eafe0942a3  labs/playwright-atlas/exercises/08-fixtures.spec.ts
1b723fcd2bec53b8235f21c80e45e204c465a256  labs/playwright-atlas/exercises/09-data-factories.spec.ts
00d48ecd34a0d7536a46a671f0c5b1f865fa99c8  labs/playwright-atlas/exercises/10-authentication-state.spec.ts
5d807aecbc6da73c38003852f3a840cb7a2d8667  labs/playwright-atlas/exercises/11-api-setup.spec.ts
bbead03c306f09d945f1e8bf666a9e7aee40e52b  labs/playwright-atlas/exercises/12-cleanup.spec.ts
586406477a9da450aefc0dd6baa16df6816c83b7  labs/playwright-atlas/exercises/13-http-errors.spec.ts
dbda3152cd0a10360de99e6e656e26cd745fa469  labs/playwright-atlas/exercises/14-slow-dependencies.spec.ts
9a5e94a5b88441a3297aac17c823a8f1834111d0  labs/playwright-atlas/exercises/15-clock-control.spec.ts
d4ef719f79684aa807890770a0d7054fa434d92f  labs/playwright-atlas/exercises/16-trace-triage.spec.ts
f0f20597bad64fd2265ba079579d6bddb789a2d0  labs/playwright-atlas/exercises/17-parallel-isolation.spec.ts
0ad5eaa16e7427995bc4e84a4d9fdc7cce47b136  labs/playwright-atlas/exercises/18-browser-projects.spec.ts
265fe9d40792b27f9aab36c3125f6d2486d0445b  labs/playwright-atlas/exercises/19-ci-artifacts.spec.ts
7cca952e9ba953a428ed93ce60b2052f3dd10da9  labs/playwright-atlas/exercises/20-visual-checks.spec.ts
f6feab4ecc0de63547488502e08e6cfb41ef5409  labs/playwright-atlas/exercises/21-accessibility.spec.ts
c438de53fa1be066404fe9172d5e24c8bc88589a  labs/playwright-atlas/exercises/22-risk-selection.spec.ts
f301da4e709e44fc66deb7f422b765e03f060dc6  labs/playwright-atlas/exercises/23-maintenance.spec.ts
5d735f770547104c12d3cbb4b6d965e2d0bdf8e9  labs/playwright-atlas/exercises/24-incident-capstone.spec.ts
c10863c5d9b67085555d031b3ed4a24843489db6  labs/playwright-atlas/fixtures/atlas.ts
c3de225ed18ca5e6ff79143eabdd02c92a68e039  labs/playwright-atlas/fixtures/cart-panel.ts
287c1b7ece1e34185bf00b78ee76f506ef0dc74a  labs/playwright-atlas/fixtures/data.ts
26c49ecfe2f9235bd56f6a619ee05f557015cfa4  labs/playwright-atlas/learning-content.mjs
4eeaab117462658fe5ed00a668a569135a2ee843  labs/playwright-atlas/lessons/01-login.md
06bea1f9a6d7371f1b70f1d6747f6c4a868dbcc2  labs/playwright-atlas/lessons/02-search.md
1863fac161a4b2649dd4d17d540b7d215f08406b  labs/playwright-atlas/lessons/03-cart.md
45d30a8a3d0c3d6165228a59d5ea2e3256afbcf8  labs/playwright-atlas/lessons/04-navigation.md
e3e12a78efb2e60c49d8781d88384943bed6b7f1  labs/playwright-atlas/lessons/05-validation.md
09f21966eceef1810f0d085ea8b5612255ab3669  labs/playwright-atlas/lessons/06-locators.md
c72158b59455b08fa0ede7b95268d4c232e6ca52  labs/playwright-atlas/lessons/07-async.md
1a9370bbef2c903be943e98387c4a0d5c4d72911  labs/playwright-atlas/lessons/08-fixtures.md
ca7dfaeffe8b7d7701b49a13a08031a7c0d60811  labs/playwright-atlas/lessons/09-data-factories.md
0418a0543c882f003af5b74edf154993d1ed9355  labs/playwright-atlas/lessons/10-authentication-state.md
d7f1f14879e60b1dab0f75c5c9022300b0e8dcf9  labs/playwright-atlas/lessons/11-api-setup.md
3cd41b233e43bc8d4f3dfb03bd8a69d567d25e67  labs/playwright-atlas/lessons/12-cleanup.md
d27e7565ae86c069694978e58ed86e874a47bae8  labs/playwright-atlas/lessons/13-http-errors.md
45c5120ab44e2c5fa904b68997d2bb3bc511f0b9  labs/playwright-atlas/lessons/14-slow-dependencies.md
7b3d24b49b47eb0828f726c3c97bc20da4a1662b  labs/playwright-atlas/lessons/15-clock-control.md
566c7d99c7392f2655204fc0cd6ca6b6efa167dc  labs/playwright-atlas/lessons/16-trace-triage.md
9028c476d1c56bf9212f0aebc99ee55916d9f262  labs/playwright-atlas/lessons/17-parallel-isolation.md
cc4fa43849745169fa3fdeb59ca837c97d76a0ea  labs/playwright-atlas/lessons/18-browser-projects.md
0cfc8dd5e5d41c63d48a0f8eac18e38c7890a928  labs/playwright-atlas/lessons/19-ci-artifacts.md
055a8391d4a6217e7208bf401862e29676e86504  labs/playwright-atlas/lessons/20-visual-checks.md
b15abd9163907352c0c845ee6c66adc8715e4b5a  labs/playwright-atlas/lessons/21-accessibility.md
1fa7a1c1fd5da71aadb49c3184a7accd9d14a427  labs/playwright-atlas/lessons/22-risk-selection.md
0678f39cb12ede0b2fa7ebc1ac383dd073592f80  labs/playwright-atlas/lessons/23-maintenance.md
9dc9c1eb3276843f76349f428121308722b452d3  labs/playwright-atlas/lessons/24-incident-capstone.md
1f5614ac5d10f4f33ce796047d14ee4f550a8ada  labs/playwright-atlas/package-lock.json
a338bd0a6130899319f7c161ddbab0645ab5f9d9  labs/playwright-atlas/package.json
4f0a35192371a1c969e063af98b47237d2aef5be  labs/playwright-atlas/playwright.config.ts
8a20f1a345f513b1b823b572ae6024209ee589ee  labs/playwright-atlas/server-api.mjs
6b6515772de604bd0bc667882471a6f5faa72cd3  labs/playwright-atlas/server.mjs
56b7a849b0a1b26ad977e5c727b435abe1766de9  labs/playwright-atlas/solutions/01-login.spec.ts
6ff9a8e765d2003b9a6ae148d182350019046636  labs/playwright-atlas/solutions/02-search.spec.ts
72c25bbd69960d969d03160f4f24e4c78318cca5  labs/playwright-atlas/solutions/03-cart.spec.ts
63dcfa4893da0f1c807f5ff0c837d296fa2ec8a0  labs/playwright-atlas/solutions/04-navigation.spec.ts
ec76f5569b0ba59f0b354f7105d31a1082e8e823  labs/playwright-atlas/solutions/05-validation.spec.ts
42a232fa6241e0230a3fa3a07c5ce66c3ef592cf  labs/playwright-atlas/solutions/06-locators.spec.ts
6bf3da9a505874c567e91e33589fee009bd60e7c  labs/playwright-atlas/solutions/07-async.spec.ts
44bb7806571c910d083733e2d32a672cf4fae103  labs/playwright-atlas/solutions/08-fixtures.spec.ts
f80abf62b9208fdf4d32ec5bc996c137034f748d  labs/playwright-atlas/solutions/09-data-factories.spec.ts
0e1f5e74f19ccaffd06c559a3426d45f1aa6d062  labs/playwright-atlas/solutions/10-authentication-state.spec.ts
5d4bfdf5dfddf917e13a58677bdca4acca32b6a7  labs/playwright-atlas/solutions/11-api-setup.spec.ts
2e026ca84f8d10b84799b2c9d7d9d04288547aae  labs/playwright-atlas/solutions/12-cleanup.spec.ts
231ebb3fd542903a61f61d0b633989ec60401d78  labs/playwright-atlas/solutions/13-http-errors.spec.ts
e45bd17f40e688e32d77d7b1f024aa86c3a78390  labs/playwright-atlas/solutions/14-slow-dependencies.spec.ts
6d431ec0d2d9e52219de96f2dc0379e7b501dc16  labs/playwright-atlas/solutions/15-clock-control.spec.ts
c5bb756749860a763d813e6d808ae3607a01c103  labs/playwright-atlas/solutions/16-trace-triage.spec.ts
ed373657e81801ffde5b5d068dbe8e5df3dd1225  labs/playwright-atlas/solutions/17-parallel-isolation.spec.ts
cd5bb78b9422ba7015fe32eefd077f7e53718f89  labs/playwright-atlas/solutions/18-browser-projects.spec.ts
aebf21adec0b778fee30ecd3a1e0560ab5bfd093  labs/playwright-atlas/solutions/19-ci-artifacts.spec.ts
095909df427eafe59868b1e3d24345d22c7fe63a  labs/playwright-atlas/solutions/20-visual-checks.spec.ts
fca6f676783bb77ced2caadde0df8b0e561b7f58  labs/playwright-atlas/solutions/21-accessibility.spec.ts
7b715726e985b10f99db4c57a87181176f7393dd  labs/playwright-atlas/solutions/22-risk-selection.spec.ts
21628f23b7d78caafadb9616380f16f42a2de771  labs/playwright-atlas/solutions/23-maintenance.spec.ts
e236f7dc2834ff4ed07d986e448665e23847ef12  labs/playwright-atlas/solutions/24-incident-capstone.spec.ts
5b8385b00838317dfb72236e7255a9926f643d27  labs/playwright-atlas/tsconfig.json
b4f3199ddaa323be54d91aac5b9398613727919d  labs/playwright-atlas/visual/empty-indicator.png
78a300d82f4498e7f997b972a2d8c28162b57ae5  labs/playwright-atlas/visual/filled-indicator.png
```

Commit/push are authorised for this exact package after explicit-path staging and final preservation checks. No force push, release/tag, live deployment, finding closure or lifecycle advancement is included. User review follows delivery; author automation is not that review.
