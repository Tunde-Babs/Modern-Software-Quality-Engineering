# Playwright from zero to advanced: Atlas Commerce

**Status: complete 27-lab authored companion, Draft for review.** All 27 lesson briefs, learner-file implementations and separate worked solutions are supplied. Automated author checks establish the stated execution results; independent learner mastery, editorial/educational acceptance and live publication are separate. The approved handbook curriculum and edition-review work remain unchanged.

## Start the review

Use Node.js 24 or later. From the repository folder:

```sh
cd labs/playwright-atlas
npm ci
npx playwright install chromium firefox
npm run verify
npm run test:browsers
npm start
```

Open <http://127.0.0.1:4178/learn>. The complete default suite contains **162 checks**: 66 learner checks, 66 solution checks and 30 simulator/workspace regressions. The separate browser command runs eight Lab 18 checks across Chromium and Firefox. See [the recorded author results](VALIDATION.md) for actual execution evidence; these commands are not pre-credited learner achievement.

If a server was started before this update, stop your own old `npm start` process with Ctrl+C and start it again so the new API and lesson routes load. A page reload alone cannot replace a running Node server. Manual practice defaults to port 4178, tests to 4180. Keep the shop open while tests run in another terminal. Tests refuse to reuse an unknown server. `ATLAS_PORT` can explicitly choose a different unused port for either process.

## Target learning level

The target is **beginner → advanced practical Playwright automation engineering**. Read the [capability map](LEARNING_LEVELS.md) for explicit evidence by skill and [independent assessment](ASSESSMENT.md) for what you should implement without the answer key. The original 24 labs cover the broad progression; Labs 25–27 deepen API response control, fixture architecture and explicit POM/COM design. Advanced here describes the stated engineering scope, not exhaustive API coverage or a credential.

| Requested skill | Implementation and guide |
|---|---|
| API mocking | [Lab 25](lessons/25-api-mocking.md): successful JSON, route.fetch modification, aborts, scoped routes, cleanup, POST inspection and synthetic HAR replay |
| Fixtures | [Lab 26](lessons/26-advanced-fixtures.md): test/worker scope, typed options, dependencies, automatic evidence, lazy setup and inherited overrides |
| POM and COM | [Lab 27](lessons/27-page-component-models.md): ShopPage composes account/product/cart components, injected through typed fixtures |

COM means **Component Object Model** here. It is a scoped design pattern, distinct from Playwright's React/Vue component-testing feature. Fixtures own lifecycle; pages/components own interactions; tests keep business expectations visible.

## How to review a lab

1. Choose a stage and lab in the browser workspace. Begin with the TypeScript bridge if values, functions, locators or `await` are unfamiliar.
2. Predict the outcome before reading the completed exercise. Open its displayed `exercises/*.spec.ts` path in your editor.
3. Run that lab, inspect assertions and traces, then change an input or scenario without consulting the answer key.
4. Record the command, result, variation and evidence limit in your notes. Mark practised only when you can explain your own work.

The workspace renders the same canonical Markdown files linked below. It offers progressive hints, read-only current-exercise/solution views, copyable terminal commands and local notes. It never edits your tests, runs shell commands or grades your work. Practice stages are self-reported; the author has not marked them for you. Notes live only in this browser origin, including its port. If storage is unavailable, copy notes before leaving. Shop reset does not clear learning notes.

## Complete learning track

| Stage | Labs and guides | Evidence you practise |
|---|---|---|
| Beginner | [1 Login](lessons/01-login.md), [2 Search](lessons/02-search.md), [3 Cart](lessons/03-cart.md) | Actions, observable outcomes, independent arithmetic and removal |
| Browser foundations | [4 Navigation](lessons/04-navigation.md), [5 Validation](lessons/05-validation.md), [6 Locators](lessons/06-locators.md), [7 Async UI](lessons/07-async.md) | History, validation boundaries, meaningful scope, loading and recovery |
| Reliable automation | [8 Fixtures](lessons/08-fixtures.md), [9 Data factories](lessons/09-data-factories.md), [10 Auth state](lessons/10-authentication-state.md), [11 API setup](lessons/11-api-setup.md), [12 Cleanup](lessons/12-cleanup.md) | Ownership, explicit data, cookie reuse, composed boundaries and teardown |
| Failure investigation | [13 HTTP errors](lessons/13-http-errors.md), [14 Slow dependencies](lessons/14-slow-dependencies.md), [15 Clock](lessons/15-clock-control.md), [16 Traces](lessons/16-trace-triage.md) | Controlled faults, overall deadlines, timer ownership and diagnostic bundles |
| Advanced operation | [17 Parallelism](lessons/17-parallel-isolation.md), [18 Browser projects](lessons/18-browser-projects.md), [19 CI](lessons/19-ci-artifacts.md), [20 Visuals](lessons/20-visual-checks.md), [21 Accessibility](lessons/21-accessibility.md) | Isolation, real engine coverage, retained evidence and specialist limits |
| Capstone | [22 Risk selection](lessons/22-risk-selection.md), [23 Maintenance](lessons/23-maintenance.md), [24 Lost-response incident](lessons/24-incident-capstone.md) | Proportionate selection, small abstractions and idempotent retry investigation |
| Advanced framework design | [25 API mocking](lessons/25-api-mocking.md), [26 Advanced fixtures](lessons/26-advanced-fixtures.md), [27 POM/COM](lessons/27-page-component-models.md) | Network contracts, lifecycle architecture and reusable page/component composition |

Labs 1–24 each contain two completed learner-file tests and two solution-file tests. Labs 25, 26 and 27 contain eight, four and six checks respectively in each project: 66 learner and 66 solution checks overall. The same fixed scenario can be replayed while you study the code; successful execution of supplied implementations does not demonstrate independent ability. All lab guides use the repository's lab-template sections and include a new variation and reflection questions. The [roadmap](ROADMAP.md) explains the progression and review boundary.

## Run, investigate and select

Run from this companion folder:

```sh
npm run bridge
npm run check
npm test                         # All 66 learner checks
npm test -- 08-fixtures --headed
npm test -- 24-incident-capstone --debug
npm run test:solutions            # Separate answer-key checks
npm run test:simulator            # Shop, API and workspace regressions
npm run test:browsers             # Lab 18 in Chromium and Firefox
npm run test:critical             # Two explicitly tagged learner checks
npm run test:advanced             # 36 API-mocking/fixture/POM/COM checks
npm run test:ui
npm run report
```

Headed mode displays the browser; debug mode pauses for investigation. Reports include screenshots and traces for failures, plus explicit attachments. Lab 16 retains traces even on passing examples. There are zero retries. Full runs replace the local report, so preserve a report before running a different selection if you need it later. Reports, traces, generated screenshots and dependencies are ignored local outputs.

For installed Chrome instead of bundled Chromium, macOS/Linux users can run `ATLAS_BROWSER_CHANNEL=chrome npm test`. Firefox projects deliberately select Firefox and do not inherit the optional Chrome channel.

## Original shop: Labs 1–7

The ordinary `/` page keeps the original browser-only mode:

- Demo credentials: `learner@atlas.test` / `AtlasPractice123!`. This is fictional account behaviour.
- Four products: Atlas Backpack €49, Trail Mug €15, Field Notebook €9, Desk Lamp €35. Arithmetic uses whole cents.
- Search matches names, ignoring case and surrounding spaces. Clearing it restores the catalog.
- Repeated adds increase quantity; Remove deletes the entire product line. Shopping does not require sign-in.
- Account and cart use tab session storage and survive reload; sign out clears the account and keeps the cart.
- Collection/Account/Cart links create fragment history entries. Home reloads the page, clears search and keeps tab account/cart.
- Practice controls provide browser-side sign-in failure, a deliberately wrong €5 cart surcharge, catalog failure and 800/1600 ms catalog waiting. Controls return to defaults on full reload.
- Reset clears account/cart/query/fault/delay and cancels superseded catalog work. Reload products exposes loading, readiness and failure through named states.

## Advanced practice: Labs 8–27

From an advanced lab in `/learn`, choose **Create advanced practice**, then **Open your practice workspace**. Sign in with the demo credentials to enable practice checkout. This is a local, in-memory backend simulation; there is no real payment processing, identity provider, database, delivery or production data.

Each fixture creates a unique workspace at `/api/workspaces`, opens `/?workspace=<id>` and deletes that workspace in finally. Two tests can run in parallel without sharing a cart. Cookie state can be explicitly reused in Lab 10. It remains a teaching session, not production authentication or an authorization-hardening example.

| Interface | Behaviour |
|---|---|
| `POST /api/workspaces` | Create disposable state; optional label |
| `GET /api/workspaces/:id/state` | Observe cart, simulated session and orders |
| `DELETE /api/workspaces/:id` | Delete only that owned workspace and sessions |
| `POST .../login`, `POST .../logout` | Create/invalidate the fictional HttpOnly session cookie |
| `POST .../cart` | Add a known product with integer quantity 1–100; maximum 100 per line |
| `DELETE .../cart/:productId` | Remove the whole line |
| `POST .../reset` | Clear the workspace's cart/orders/fault and invalidate its sessions |
| `POST .../faults` | Choose normal/declined/unavailable/lost-response checkout and confirmation delay 0–10000 ms |
| `POST .../orders` | Require a simulated session, nonempty cart and Idempotency-Key; retain that key for retries |
| `GET .../orders`, `GET .../orders/:orderId` | Observe created orders and pending/confirmed state; confirmation consumes ordered quantities once |

A declined/unavailable checkout leaves the cart unchanged and creates no order. The lost-response challenge creates an order but returns 503; retrying the same key returns the original identity. A single four-second browser deadline covers submission, polling and pending fetches. Deadline expiry means **not confirmed**, not proof that no order exists. A separate browser-only 60-second reservation supports clock-control practice; advancing browser time does not advance the server clock.

State is deliberately temporary. Restarting the Node process clears it. Abandoned manual workspaces expire after an hour when another workspace is created; normal test teardown deletes its own state. The API does not write files or execute commands and the server binds only to loopback. Controls are teaching conveniences and are not a deployable production service.

## Visual, accessibility and CI review

Lab 20 compares committed, inspected 64 × 24 empty/filled quantity indicators and also asserts semantic totals. This limited two-colour image is not whole-page visual acceptance. A changed baseline requires human inspection before an explicit update; CI never auto-updates it.

Lab 21 uses the pinned official axe wrapper on the inspected main-region states and includes a keyboard input observation. Zero violations are not full accessibility conformance. Follow up with focus-order, zoom, screen-reader and unfamiliar-journey review.

See [CI review instructions](ci/README.md) and `.github/workflows/playwright-atlas.yml`. The workflow retains complete-track and browser-project evidence separately, with read-only repository permission and no deployment step. Actual CI results are distinct from local execution and from independent review.

## Troubleshooting and cleanup

| Symptom | Next action |
|---|---|
| `node`/`npm` missing | Install Node.js 24+, reopen Terminal and check the version |
| Download failure | Check npm/browser download access and retry |
| Missing browser | Run `npx playwright install chromium firefox` |
| Missing Linux libraries | Follow Playwright's official `install --with-deps` guidance |
| `/learn` or API returns 404 after update | Restart your own older Node server, then reload |
| Port occupied | Use another unused ATLAS_PORT; do not terminate unrelated processes |
| Workspace missing | Rerun the fixture or create a new manual workspace after server restart |
| Unexpected cart price | Check whether the deliberate incorrect-total challenge is active |
| Visual difference | Inspect expected/actual/diff before considering a baseline update |
| Assertion timeout | Inspect the named state, route and trace before changing the timeout |

Tests close their owned contexts/server and delete fixture workspaces. Ctrl+C stops a manually started server and clears its in-memory state. Keep your exercise edits and notes. Do not claim completion solely because the supplied examples run: repeat a variation, explain the limitations and seek review of the capstone reasoning.

Official references checked 2026-11-21: [fixtures](https://playwright.dev/docs/test-fixtures), [authentication](https://playwright.dev/docs/auth), [API testing](https://playwright.dev/docs/api-testing), [clock](https://playwright.dev/docs/clock), [projects](https://playwright.dev/docs/test-projects), [visual comparisons](https://playwright.dev/docs/test-snapshots), [accessibility](https://playwright.dev/docs/accessibility-testing) and [CI](https://playwright.dev/docs/ci-intro).
