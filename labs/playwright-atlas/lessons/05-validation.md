# Lab 5 — Separate form validation from credential checks

## Metadata

Status: Draft · Companion: Atlas Playwright · Difficulty: Beginner → browser foundations · Time: 30–45 minutes. Related Part V topics: browser interaction contracts, deterministic feedback and diagnostics.

## Objectives

Distinguish a browser-rejected input from a validly shaped input that the demo account rejects.

## Expected Skills

Use native validity properties and controlled inputs to identify which validation boundary acted.

## Prerequisites

Complete [the setup](../README.md), [TypeScript bridge](../bridge/README.md) and [the preceding lab](04-navigation.md). Keep your own exercise attempts; worked solutions are for comparison after an attempt.

## Environment Setup

Run commands from `labs/playwright-atlas`. The manual shop can stay open on port 4178; Playwright starts its own server on port 4180 and creates a fresh browser context per test. Normal shop and no added delay are the defaults. Use only the supplied fictional data.

## Problem Statement

The login form has required fields and an email input. The browser prevents submission of blank or malformed email values before the simulator checks credentials. A well-formed but unknown email reaches the demo credential check. Browser validation messages differ by language and browser, so avoid matching their wording.

## Tasks

1. Open `exercises/05-validation.spec.ts`. In the first starter, leave Email blank, fill the valid demo password and click Sign in. Check `valueMissing` on the email input and that the welcome message remains hidden.
2. Fill `learner@atlas.test` and submit again. Assert the welcome message becomes visible. This successful control shows the first result was not simply a broken sign-in button.
3. In the second starter, use `not-an-email` and the valid password. Submit. Assert email `typeMismatch` is true, the welcome message is hidden and the application's incorrect-credentials alert is hidden.
4. Change Email to `unknown@atlas.test` and submit. Assert email `valid` is true and the application's `Email or password is incorrect.` alert is visible. A valid email shape does not prove a valid account.
5. Run `npm test -- 05-validation`. Try the valid email with a blank password as an unseen variation. Predict which input property explains the rejection.

<details>
<summary>Hint 1 — approach</summary>

Keep a locator: `const email = page.getByLabel('Email', { exact: true })`. Native validity is available on its DOM input; it is not an HTML attribute.

</details>

<details>
<summary>Hint 2 — a concrete check</summary>

Use `expect(await email.evaluate((input: HTMLInputElement) => input.validity.valueMissing)).toBe(true)`. `evaluate` reads the selected browser element; `HTMLInputElement` tells TypeScript its kind. For the second test read `typeMismatch`, then `valid`. Read these after `fill`/`click`; those actions have completed. Keep retrying Playwright assertions for messages that can change asynchronously.

</details>

## Stretch Goals

Check a blank password with `validity.valueMissing`. Explain why a browser-valid input still needs server-side validation in a real application.

## Validation

Run `npm test -- 05-validation`. Target: **2 passed** in the learner project, plus an explanation and a variation completed without the answer key. A TODO failure means your starter is unfinished.

After attempting the work, compare [the worked solution](../solutions/05-validation.spec.ts). `npm run test:solutions -- 05-validation` checks that answer key; it does not complete or assess your attempt. Run `npm run check` to detect TypeScript errors.

## Troubleshooting

Do not expect the custom credentials alert for malformed email: submission is blocked earlier. Avoid checking the text of the native popup. If `HTMLInputElement` is misspelled, `npm run check` identifies the type error. Use `npm run report` after a failed run to inspect its screenshot and trace.

## Expected Outcome

Two tests that distinguish native shape/required-field validation from the fictional account comparison. They do not prove server validation, identity-provider integration or authentication security.

## Cleanup

The runner closes its contexts and owned server. For manual practice, Reset practice restores defaults and clears tab account/cart/query; Ctrl+C stops the server. Keep your exercise source and a short evidence note.

## Reflection Questions

- Why can a hidden welcome message alone give weak evidence?
- What does `validity.valid` mean, and what does it leave unknown?
- Why is native popup wording a fragile expectation?

## Next Steps

Continue to [Lab 6](06-locators.md). Official reading checked 2026-11-21: [Locators](https://playwright.dev/docs/locators).
