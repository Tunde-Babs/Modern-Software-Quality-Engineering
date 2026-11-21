# Lab 1 — Sign in and understand an assertion

## Metadata

Status: Draft · Companion: Atlas Playwright · Difficulty: Beginner · Time: 30–45 minutes. Related Part V topics: browser automation, deterministic state and diagnostic evidence.

## Objectives

Verify that valid credentials reach the signed-in state and invalid credentials do not.

## Expected Skills

Perform a customer action, select an observable outcome and explain a result's limitation.

## Prerequisites

Complete the [setup](../README.md) and [TypeScript bridge](../bridge/README.md). No browser automation experience is assumed.

## Environment Setup

Run commands from `labs/playwright-atlas`. Keep the manual shop open on port 4178 if needed. Tests own a separate server on port 4180 and use fresh browser contexts. Use Normal shop for manual exploration.

## Problem Statement

Verify that valid credentials reach the signed-in state and invalid credentials do not. Use only the supplied fictional data.

## Tasks

1. Run `npm test -- 01-login` once. Open and review the completed guided implementation in `exercises/01-login.spec.ts`.

2. Review the first completed test. Fill Email with `learner@atlas.test` and Password with `AtlasPractice123!`. Click Sign in. Assert `Welcome, Alex!` is visible and Sign in is hidden.

3. In the second test, use the same email and `incorrect-password`. Assert `Email or password is incorrect.` is visible and the welcome message is hidden.

4. Run both tests. Briefly change the successful expectation to `Welcome, Morgan!`; inspect the failure report, then restore the requirement.

5. Try an incorrect email with the valid password without consulting the solution.

<details>
<summary>Hint 1 — choosing the tool</summary>

Find inputs with `page.getByLabel('Email', { exact: true })` and `page.getByLabel('Password', { exact: true })`. Fill them with `await locator.fill(value)`.

</details>

<details>
<summary>Hint 2 — a concrete assertion</summary>

Click `page.getByRole('button', { name: 'Sign in', exact: true })`. For success use `await expect(page.getByText('Welcome, Alex!', { exact: true })).toBeVisible()`. Find the error with `page.getByRole('alert').filter({ hasText: 'Email or password is incorrect.' })`.

</details>

## Stretch Goals

Enable Sign-in service unavailable manually, then try valid credentials. Explain how its message differs from an incorrect password.

## Validation

Run `npm test -- 01-login`. Target: **2 passed** in the learner project. The supplied code is an authored example; repeat a variation independently before marking it practised. Calculate your variation's expectation before observing the shop. Explain a failure before declaring the lab done.

After attempting the work, compare [the solution](../solutions/01-login.spec.ts). Run `npm run test:solutions -- 01-login` only to check the environment. A passing solution does not complete your attempt.

## Troubleshooting

Run `npm run report` after a failure and inspect the failed action or assertion and trace. Check the accessible name, expected value and selected scenario. Do not hide the failure with fixed sleeps or retries.

## Expected Outcome

Two readable tests, one variation and a short explanation. The demo UI response for two inputs is checked; real authentication security and identity-provider integration are outside this simulator.

## Cleanup

The test runner closes its contexts and owned server. For manual exploration, Reset practice clears your session; Ctrl+C stops the server. Keep your exercise source.

## Reflection Questions

- Why does clicking Sign in alone fail to prove successful sign-in?
- What observation would suggest a test defect rather than a shop defect?
- What remains unknown after your tests pass?

## Next Steps

Continue to [Lab 2](02-search.md). If you needed the answer key, repeat the variation first.
