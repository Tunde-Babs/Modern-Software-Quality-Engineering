# Lab 13 — HTTP failures are observable product states

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Verify controlled HTTP failures without misclassifying a failed dependency as a successful customer action.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](12-cleanup.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

The first scenario returns a real local 503 from checkout. The second intercepts a cart request in Playwright. Both should communicate a failure and preserve the previously known cart state.

## Tasks

1. Read the checkout-unavailable fault setup and the subsequent UI action. Require an alert, the retained €15 cart and zero created orders.

2. Read the cart route interception. Its controlled 503 should show Cart service unavailable and retain a zero total.

3. Run each test separately, then remove the route only in a temporary experiment to see which evidence boundary changes. Restore it afterwards.

4. Explain which response came from the simulator server and which was fulfilled by the test.

<details>
<summary>Hint 1 — the boundary</summary>

Route before triggering the request. Match the owned workspace path rather than every API request on the page.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

route.fulfill({ status: 503, contentType: 'application/json', body: JSON.stringify({ error: 'Cart service unavailable.' }) }) supplies a controlled response.

</details>

## Stretch Goals

Try a 400 cart response with a distinct message. Check that the UI does not announce a successful add.

## Validation

Run `npm test -- 13-http-errors`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/13-http-errors.spec.ts), then compare [the worked solution](../solutions/13-http-errors.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Write a defect note with the controlled response, expected user message and retained-state observation. A mock is not evidence that a real external service emits that response.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 14](14-slow-dependencies.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/mock).
