# Lab 2 — Find products with stable locators

## Metadata

Status: Draft · Companion: Atlas Playwright · Difficulty: Beginner · Time: 30–45 minutes. Related Part V topics: browser automation, deterministic state and diagnostic evidence.

## Objectives

Check matching and empty results without relying on product position.

## Expected Skills

Perform a customer action, select an observable outcome and explain a result's limitation.

## Prerequisites

Complete the [setup](../README.md) and [TypeScript bridge](../bridge/README.md). Complete the preceding lab.

## Environment Setup

Run commands from `labs/playwright-atlas`. Stop a manually running simulator before testing. Tests start the server automatically and use fresh browser contexts. Use Normal shop for manual exploration.

## Problem Statement

Check matching and empty results without relying on product position. Use only the supplied fictional data.

## Tasks

1. Open `exercises/02-search.spec.ts`. Replace the placeholder errors. In each test, first assert that four product articles are present, allowing the catalog to finish loading.

2. In the matching test, fill Search products with `BACKPACK`. Assert exactly one article remains and its accessible name is `Atlas Backpack`.

3. In the empty test, search for `spaceship`. Assert `No products found.` and zero articles.

4. Run `npm test -- 02-search`. Clear the query manually and observe all four products returning.

5. Try ` mug ` without looking at the solution. Predict the outcome before running.

<details>
<summary>Hint 1 — choosing the tool</summary>

Use `page.getByRole('searchbox', { name: 'Search products' })`. Product cards have role `article`; count them with a retrying assertion.

</details>

<details>
<summary>Hint 2 — a concrete assertion</summary>

Use `await expect(page.getByRole('article')).toHaveCount(1)` and locate the matching card with `page.getByRole('article', { name: 'Atlas Backpack', exact: true })`.

</details>

## Stretch Goals

Add a clear-query test and prove that search does not change an existing cart.

## Validation

Run `npm test -- 02-search`. Target: **2 passed** in the learner project. A TODO failure means the exercise is unfinished. Calculate your variation's expectation before observing the shop. Explain a failure before declaring the lab done.

After attempting the work, compare [the solution](../solutions/02-search.spec.ts). Run `npm run test:solutions -- 02-search` only to check the environment. A passing solution does not complete your attempt.

## Troubleshooting

Run `npm run report` after a failure and inspect the failed action or assertion and trace. Check the accessible name, expected value and selected scenario. Do not hide the failure with fixed sleeps or retries.

## Expected Outcome

Two readable tests, one variation and a short explanation. Search matches names in this browser only. Remote ranking, pagination and catalog completeness are outside the evidence.

## Cleanup

The test runner closes its contexts and owned server. For manual exploration, Reset practice clears your session; Ctrl+C stops the server. Keep your exercise source.

## Reflection Questions

- Why check both the count and the product name?
- What observation would suggest a test defect rather than a shop defect?
- What remains unknown after your tests pass?

## Next Steps

Continue to [Lab 3](03-cart.md). If you needed the answer key, repeat the variation first.
