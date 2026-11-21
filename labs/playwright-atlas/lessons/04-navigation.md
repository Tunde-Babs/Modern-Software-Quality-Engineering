# Lab 4 — Navigate and follow browser history

## Metadata

Status: Draft · Companion: Atlas Playwright · Difficulty: Beginner → browser foundations · Time: 30–45 minutes. Related Part V topics: browser interaction contracts, deterministic feedback and diagnostics.

## Objectives

Verify the destination of a link and distinguish fragment navigation from a full page load.

## Expected Skills

Use link roles, URL assertions and browser history while checking an observable destination.

## Prerequisites

Complete [the setup](../README.md), [TypeScript bridge](../bridge/README.md) and [the preceding lab](03-cart.md). Keep your own exercise attempts; worked solutions are for comparison after an attempt.

## Environment Setup

Run commands from `labs/playwright-atlas`. Stop any manually started simulator before testing; Playwright starts its own server and creates a fresh browser context per test. Normal shop and no added delay are the defaults. Use only the supplied fictional data.

## Problem Statement

Customers need to move between the collection, account and cart without losing their shopping state. The header links change the URL fragment (the part after `#`) and scroll within this page. The Atlas home link loads `/` again. The query is temporary; the cart belongs to the tab session.

## Tasks

1. Run `npm test -- 04-navigation`, then open `exercises/04-navigation.spec.ts`.
2. Replace the first TODO. Scope links to `page.getByRole('navigation', { name: 'Shop sections' })`. Click Account, assert the URL ends in `#account-title` and the Welcome back heading is in the viewport. Then click Cart and assert `#cart-title` and the Your cart heading in the viewport.
3. Call `await page.goBack()` and assert the Account fragment. Call `await page.goForward()` and assert the Cart fragment. These are same-document history entries; a new response is not the completion signal.
4. In the second starter, add a Trail Mug and search for `mug`. Assert one article remains. Navigate to Cart, then click the Atlas Commerce home link. Assert the root URL, an empty query, four articles and a cart total of €15.00.
5. Run both tests. Repeat manually with a backpack: which state survives Home, and which state survives a fresh tab?

<details>
<summary>Hint 1 — approach</summary>

Find links by role and accessible name. `await expect(page).toHaveURL(/#account-title$/)` waits for the Account fragment.

</details>

<details>
<summary>Hint 2 — a concrete check</summary>

Use `await expect(page.getByRole('heading', { name: 'Your cart', exact: true })).toBeInViewport()`. A URL alone does not prove the target is on screen. The root URL is `http://127.0.0.1:4178/`.

</details>

## Stretch Goals

Repeat the history test at a 390-pixel viewport. Explain why clicking a link is stronger evidence of navigation behaviour than setting `window.location` directly.

## Validation

Run `npm test -- 04-navigation`. Target: **2 passed** in the learner project, plus an explanation and a variation completed without the answer key. A TODO failure means your starter is unfinished.

After attempting the work, compare [the worked solution](../solutions/04-navigation.spec.ts). `npm run test:solutions -- 04-navigation` checks that answer key; it does not complete or assess your attempt. Run `npm run check` to detect TypeScript errors.

## Troubleshooting

If history differs, check that you started from `/` and clicked Account before Cart. Do not use a navigation-response wait for a fragment-only change. Read the trace to separate URL changes from scroll changes. Use `npm run report` after a failed run to inspect its screenshot and trace.

## Expected Outcome

Two navigation tests and an explanation of tab state. They cover local fragment/history behaviour and Home reload; external navigation, redirects and routing across multiple application pages remain unknown.

## Cleanup

The runner closes its contexts and owned server. For manual practice, Reset practice restores defaults and clears tab account/cart/query; Ctrl+C stops the server. Keep your exercise source and a short evidence note.

## Reflection Questions

- Why check both URL and viewport?
- Why does Home clear search but retain the cart?
- Would these checks prove that a payment page works?

## Next Steps

Continue to [Lab 5](05-validation.md). Official reading checked 2026-11-21: [Assertions](https://playwright.dev/docs/test-assertions).
