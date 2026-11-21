# Lab 7 — Wait for outcomes in a delayed interface

## Metadata

Status: Draft · Companion: Atlas Playwright · Difficulty: Beginner → browser foundations · Time: 30–45 minutes. Related Part V topics: browser interaction contracts, deterministic feedback and diagnostics.

## Objectives

Verify loading, successful completion, failure and recovery without fixed sleeps.

## Expected Skills

Select observable completion signals and explain the difference between action readiness and business completion.

## Prerequisites

Complete [the setup](../README.md), [TypeScript bridge](../bridge/README.md) and [the preceding lab](06-locators.md). Keep your own exercise attempts; worked solutions are for comparison after an attempt.

## Environment Setup

Run commands from `labs/playwright-atlas`. Stop any manually started simulator before testing; Playwright starts its own server and creates a fresh browser context per test. Normal shop and no added delay are the defaults. Use only the supplied fictional data.

## Problem Statement

Reload products can pause for 800 or 1600 milliseconds before fetching the local catalog. Catalog unavailable on reload instead produces a controlled browser-side failure. These practice controls model observable UI states; they are not a real remote service or a performance benchmark. The button becomes disabled while loading and is enabled again on success or failure.

## Tasks

1. Open `exercises/07-async.spec.ts`. In the first starter, wait for four initial articles. Open Practice controls and select Catalog delay `1600`, then click Reload products.
2. Assert Catalog status says `Loading products…`, Reload products is disabled and Product results has `aria-busy="true"`. Then use a retrying assertion to wait for `Products ready.`. Assert Reload products is enabled and four articles are present.
3. Add a Trail Mug and assert €15.00. This checks that loading completed into a usable shop. Do not add `waitForTimeout` or retries.
4. In the second starter, wait for four initial articles. Choose Scenario `catalog-unavailable` and Catalog delay `800`, then reload. Wait for `Products unavailable.`, assert the catalog error is visible and zero product articles remain.
5. Change Scenario to `normal` and reload again. Wait for `Products ready.`, assert the error is hidden and four articles return. Run `npm test -- 07-async`.
6. Repeat the success check with delay `800` without changing any waits. Explain why its completion condition still works.

<details>
<summary>Hint 1 — approach</summary>

Find the status with `page.getByRole('status', { name: 'Catalog status' })`. Select delays by value: `page.getByLabel('Catalog delay', { exact: true }).selectOption('1600')`.

</details>

<details>
<summary>Hint 2 — a concrete check</summary>

Use `await expect(status).toHaveText('Products ready.')` to wait for completion. Find `page.getByRole('group', { name: 'Product results' })` and assert its `aria-busy` attribute. Click readiness does not mean the catalog has completed; assert the business outcome afterwards.

</details>

## Stretch Goals

Start a delayed failing reload manually, then Reset practice before it finishes. Explain the expected state: normal scenario, no added delay, ready catalog and empty cart. The simulator cancels superseded loads so a stale failure cannot overwrite the reset.

## Validation

Run `npm test -- 07-async`. Target: **2 passed** in the learner project, plus an explanation and a variation completed without the answer key. A TODO failure means your starter is unfinished.

After attempting the work, compare [the worked solution](../solutions/07-async.spec.ts). `npm run test:solutions -- 07-async` checks that answer key; it does not complete or assess your attempt. Run `npm run check` to detect TypeScript errors.

## Troubleshooting

Select the delay before Reload products. Scenario changes alone do not start a reload. If the ready assertion times out, inspect the status and error first. The configured assertion timeout is 5 seconds; increasing it without understanding the failure does not repair the cause. Use `npm run report` after a failed run to inspect its screenshot and trace.

## Expected Outcome

Two checks that observe loading, usable completion and failure/recovery. The delay is deliberate local waiting; passing within the test timeout is not evidence of a production latency target or distributed-system reliability.

## Cleanup

The runner closes its contexts and owned server. For manual practice, Reset practice restores defaults and clears tab account/cart/query; Ctrl+C stops the server. Keep your exercise source and a short evidence note.

## Reflection Questions

- Why does a successful click not establish completed loading?
- What happens to a fixed sleep when the delay changes?
- Why must a failure path offer a recovery observation?

## Next Steps

Record your variation and evidence limits, then read [the roadmap](../ROADMAP.md). Labs 8–12 are the next planned slice. Official reading checked 2026-11-21: [Auto-waiting](https://playwright.dev/docs/actionability) and [retrying assertions](https://playwright.dev/docs/test-assertions).
