# Playwright from zero: Atlas Commerce

**Status: Draft companion, first learning slice.** This optional Part V enrichment is authored for local practice. Author checks do not establish independent technical, editorial, educational or publication approval. The book's approved curriculum, findings and review stages remain separate.

Start here even if you have never written a browser test. You will use one fictional shop to learn how to describe a customer action, check an outcome and investigate a failure. This slice contains a TypeScript bridge and three labs; the advanced track is [planned](ROADMAP.md).

## Your first session (60–90 minutes)

1. Install Node.js 24 or later (includes npm). Open a terminal in the repository folder. A terminal runs commands; `cd` changes folder. Do not type the `$` prompt shown in some tutorials.
2. Run these commands, one line at a time:

   ```sh
   cd labs/playwright-atlas
   npm ci
   npx playwright install chromium
   npm run bridge
   npm run check
   npm run test:solutions
   ```

   Expected: a short price calculation, a clean type check, then **6 passed**. The solutions run checks against the simulator; this is an installation check, not credit for completing the labs. Playwright starts and stops the local server for test commands. Installation needs internet access; test runs use local assets.
3. Read [the beginner bridge](bridge/README.md). A text editor such as VS Code is useful. Open this companion folder in your editor; all later commands run from here.
4. Explore manually with `npm start`, then open <http://127.0.0.1:4178>. Stop the server with Ctrl+C before running tests; the configuration deliberately refuses to reuse an unknown server on that port.
5. Read [Lab 1: login](lessons/01-login.md). Edit `exercises/01-login.spec.ts`, then run:

   ```sh
   npm test -- 01-login
   ```

   The two starters initially fail with `TODO`. Replace each placeholder error with your test. These failures are intentional unfinished work, not installation failures.

## The learning loop

For each lab: predict the outcome, attempt the test, read the failure, use hints if needed, then explain what the result proves and what it leaves unknown. Try a variation before opening the worked solution. Budget 30–45 minutes per lab after setup; repeat at your own pace.

| Step | Guide | Run your attempt | Target |
|---|---|---|---|
| 0 | [TypeScript bridge](bridge/README.md) | `npm run bridge` | Explain values, functions, assertions and `await` |
| 1 | [Login](lessons/01-login.md) | `npm test -- 01-login` | 2 passing learner tests and an explanation |
| 2 | [Search](lessons/02-search.md) | `npm test -- 02-search` | 2 passing learner tests and an explanation |
| 3 | [Cart](lessons/03-cart.md) | `npm test -- 03-cart` | 2 passing learner tests and an explanation |

`npm test` runs only your six exercises. It never runs the answer key. `npm run test:solutions` runs the answer key only. `npm run verify` type-checks, runs the bridge, and runs the six solutions plus eight simulator checks. A passing answer key does not assess your independent ability.

## Useful commands

```sh
npm test -- 01-login --headed
npm test -- 01-login --debug
npm run test:ui
npm run report
npm run test:simulator
```

Headed mode displays the browser. Debug mode pauses for investigation. UI mode helps inspect and rerun your attempts. A failed run retains a trace and screenshot; open the report and select the failed test. Reports, screenshots and traces are ignored local outputs. There are no retries to hide first-run failures.

If you prefer an already installed Google Chrome, use this optional macOS/Linux command instead of bundled Chromium:

```sh
ATLAS_BROWSER_CHANNEL=chrome npm run verify
```

For your own exercise, use `ATLAS_BROWSER_CHANNEL=chrome npm test -- 01-login`. Default setup uses bundled Chromium; advanced cross-browser coverage is planned.

## Simulator rules

- Demo credentials: `learner@atlas.test` / `AtlasPractice123!`. This is a browser-side account simulation, with no real identity provider or access-control security.
- Four products: Atlas Backpack €49, Trail Mug €15, Field Notebook €9, Desk Lamp €35. Money is calculated in whole cents and displayed in euros.
- Search matches product names, ignoring case and surrounding spaces. No matches displays “No products found.” Clearing the search restores all products.
- Repeated adds increase quantity. Remove deletes the entire product line, including all its units. Shopping does not require sign-in.
- Account and cart use tab session storage and survive reload. Each fresh Playwright browser context starts independently. Sign out clears the account and keeps the cart.
- **Practice controls → Reset practice** clears account, cart, query and active fault. Fault choices return to normal on reload; they are intentionally not saved.
- **Sign-in service unavailable** rejects even valid demo credentials. **Incorrect cart total** adds an erroneous €5 to a nonempty cart. Both are deliberate training scenarios. Start the first three labs in Normal shop mode.
- There is no real checkout, payment, backend authentication or API mutation. These browser tests do not prove any of those capabilities.

## If something goes wrong

| Symptom | Next action |
|---|---|
| `node` or `npm` not found | Install Node.js 24+, reopen the terminal and check `node --version` |
| `npm ci` fails to download | Check your connection and npm registry access, then retry |
| Browser executable missing | Run `npx playwright install chromium` |
| Missing Linux browser system libraries | Follow Playwright's official installation instructions for your distribution |
| Port 4178 in use | Stop your manually started simulator with Ctrl+C; do not stop an unrelated process |
| `TODO` failure | Implement that exercise; installation is checked by the separate solutions command |
| Locator matches multiple elements | Scope it to a labelled article, or use an exact accessible name |
| Normal cart maths seems wrong | Open Practice controls and choose Normal shop, or reset |

## Next session

Once the three labs pass, repeat one with a different product or password without consulting the answer key. Write three sentences: the risk, the observation and one limitation. Continue through the [roadmap](ROADMAP.md) as later slices become available.

## References

Official documentation checked 2026-11-21: [Writing tests](https://playwright.dev/docs/writing-tests), [Web server](https://playwright.dev/docs/test-webserver), [TypeScript](https://playwright.dev/docs/test-typescript), [Trace Viewer](https://playwright.dev/docs/trace-viewer).
