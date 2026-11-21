# Lab 3 — Check quantities, totals and removal

## Metadata

Status: Draft · Companion: Atlas Playwright · Difficulty: Beginner · Time: 30–45 minutes. Related Part V topics: browser automation, deterministic state and diagnostic evidence.

## Objectives

Detect incorrect totals using expectations calculated independently of the shop.

## Expected Skills

Perform a customer action, select an observable outcome and explain a result's limitation.

## Prerequisites

Complete the [setup](../README.md) and [TypeScript bridge](../bridge/README.md). Complete the preceding lab.

## Environment Setup

Run commands from `labs/playwright-atlas`. Stop a manually running simulator before testing. Tests start the server automatically and use fresh browser contexts. Use Normal shop for manual exploration.

## Problem Statement

Detect incorrect totals using expectations calculated independently of the shop. Use only the supplied fictional data.

## Tasks

1. Open `exercises/03-cart.spec.ts`. Calculate two backpacks before using the shop: 2 × €49 = €98.

2. In the first test, replace the placeholder error. Find the Atlas Backpack article and click its Add to cart button twice. Assert Cart quantity `2` and Cart total `€98.00`.

3. Remove Atlas Backpack. Removal deletes the entire line. Assert `Your cart is empty.`, quantity `0` and total `€0.00`.

4. In the second test, add one backpack and one Trail Mug. Assert quantity `2` and total `€64.00`. Run `npm test -- 03-cart`.

5. Try one Desk Lamp and two Field Notebooks without consulting the solution. Predict €53 first, then check it.

<details>
<summary>Hint 1 — choosing the tool</summary>

Several buttons say Add to cart. First find `page.getByRole('article', { name: 'Atlas Backpack', exact: true })`, then find its button.

</details>

<details>
<summary>Hint 2 — a concrete assertion</summary>

Use `await expect(page.getByLabel('Cart total', { exact: true })).toHaveText('€98.00')`. Remove with `page.getByRole('button', { name: 'Remove Atlas Backpack', exact: true })`.

</details>

## Stretch Goals

Enable Incorrect cart total manually and add a mug. Record the steps, expected €15 and observed €20 in a defect note. Reset before running normal tests.

## Validation

Run `npm test -- 03-cart`. Target: **2 passed** in the learner project. A TODO failure means the exercise is unfinished. Calculate your variation's expectation before observing the shop. Explain a failure before declaring the lab done.

After attempting the work, compare [the solution](../solutions/03-cart.spec.ts). Run `npm run test:solutions -- 03-cart` only to check the environment. A passing solution does not complete your attempt.

## Troubleshooting

Run `npm run report` after a failure and inspect the failed action or assertion and trace. Check the accessible name, expected value and selected scenario. Do not hide the failure with fixed sleeps or retries.

## Expected Outcome

Two readable tests, one variation and a short explanation. These checks cover selected cart arithmetic and browser state. They do not verify tax, discounts, stock, checkout or real payments.

## Cleanup

The test runner closes its contexts and owned server. For manual exploration, Reset practice clears your session; Ctrl+C stops the server. Keep your exercise source.

## Reflection Questions

- Why would copying the displayed total into your expectation conceal a defect?
- What observation would suggest a test defect rather than a shop defect?
- What remains unknown after your tests pass?

## Next Steps

Continue to [the roadmap](../ROADMAP.md). If you needed the answer key, repeat the variation first.
