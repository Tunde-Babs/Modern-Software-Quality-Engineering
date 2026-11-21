# Lab 6 — Resolve locator ambiguity by intent

## Metadata

Status: Draft · Companion: Atlas Playwright · Difficulty: Beginner → browser foundations · Time: 30–45 minutes. Related Part V topics: browser interaction contracts, deterministic feedback and diagnostics.

## Objectives

Choose the intended product when several controls have the same accessible name.

## Expected Skills

Compose locators by named region and article, and explain why a locator can find a newly rendered element.

## Prerequisites

Complete [the setup](../README.md), [TypeScript bridge](../bridge/README.md) and [the preceding lab](05-validation.md). Keep your own exercise attempts; worked solutions are for comparison after an attempt.

## Environment Setup

Run commands from `labs/playwright-atlas`. The manual shop can stay open on port 4178; Playwright starts its own server on port 4180 and creates a fresh browser context per test. Normal shop and no added delay are the defaults. Use only the supplied fictional data.

## Problem Statement

Every product has an Add to cart button. A page-wide click with that name is ambiguous. Choosing the first matching button silently depends on catalog order. Your check must identify the product through its customer-facing name and then select the action inside it.

## Tasks

1. Run `npm test -- 06-locators`. In the first test, wait for four Add to cart buttons with a count assertion. During a temporary experiment, attempt a page-wide Add to cart click and inspect the strict-mode failure. Remove that ambiguous action before completing the test.
2. Scope to the Trail Mug article, then click its Add to cart button. Scope assertions to the Your cart region. Check its Trail Mug line contains one mug at €15.00 and the cart total is €15.00.
3. In the second test, create a Trail Mug locator before searching. Wait for four articles, then search for `notebook`. Assert one article remains and the mug locator currently matches zero elements.
4. Clear the query. Use the same named mug locator to add the mug, without recreating it or choosing a positional index. Assert €15.00, then remove the mug by its named button inside Your cart. Assert quantity zero.
5. Try the same approach with Desk Lamp. Explain why a DOM rebuild does not require caching a browser element handle.

<details>
<summary>Hint 1 — approach</summary>

`page.getByRole('article', { name: 'Trail Mug', exact: true }).getByRole('button', { name: 'Add to cart', exact: true })` describes the intended card and action.

</details>

<details>
<summary>Hint 2 — a concrete check</summary>

The cart is `page.getByRole('region', { name: 'Your cart', exact: true })`. Its mug line has role `listitem` and name `Trail Mug`. Use `toHaveText(/Trail Mug × 1 — €15.00/)`; the line also contains a Remove button. A locator is a query evaluated when used, not a saved DOM element.

</details>

## Stretch Goals

Explain a case where `.first()` would be legitimate, then explain why the product-purchase check does not meet that condition. No arbitrary DOM reordering is needed to complete this lab.

## Validation

Run `npm test -- 06-locators`. Target: **2 passed** in the learner project, plus an explanation and a variation completed without the answer key. The supplied implementation is for review; its passing result is not independent learner assessment.

After attempting the work, compare [the worked solution](../solutions/06-locators.spec.ts). `npm run test:solutions -- 06-locators` checks that answer key; it does not complete or assess your attempt. Run `npm run check` to detect TypeScript errors.

## Troubleshooting

A strict-mode error names multiple matching elements. Inspect their names and ancestors, then add meaningful scope. Do not silence it with `.first()`, `.nth(0)` or a longer CSS path that still depends on ordering. Use `npm run report` after a failed run to inspect its screenshot and trace.

## Expected Outcome

Two checks that select the intended item through meaningful names across a catalog rebuild. Passing them does not establish that every label is accessible or that every catalog variation is covered.

## Cleanup

The runner closes its contexts and owned server. For manual practice, Reset practice restores defaults and clears tab account/cart/query; Ctrl+C stops the server. Keep your exercise source and a short evidence note.

## Reflection Questions

- What ambiguity does scoping resolve?
- Why does the same mug locator work after search is cleared?
- How could an order-dependent locator pass while buying the wrong item?

## Next Steps

Continue to [Lab 7](07-async.md). Official reading checked 2026-11-21: [Locators and strictness](https://playwright.dev/docs/locators#strictness).
