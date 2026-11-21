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
