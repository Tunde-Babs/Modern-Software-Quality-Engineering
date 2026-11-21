# Lab 14 — Slow confirmation and an overall deadline

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Observe delayed completion and distinguish an unconfirmed order from a proven failed order.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](13-http-errors.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

The server can delay confirmation. The browser polls under one four-second overall deadline, including pending fetches. A deadline gives bounded feedback; it does not prove that an order was never created.

## Tasks

1. Review the 800 ms confirmation scenario. Assert pending before confirmed, then the consumed cart state.

2. Review the 10000 ms scenario. Require a deadline message, Order not confirmed and a retained cart.

3. Inspect the client’s AbortController and the one deadline covering submission and polling. Do not reset it for each poll.

4. Run both tests. Explain why the configured timeout is not a production latency target.

<details>
<summary>Hint 1 — the boundary</summary>

Wait for the named Order status or alert. Fixed sleeps conceal timing assumptions.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

await expect(page.getByRole('status', { name: 'Order status', exact: true })).toHaveText('Order confirmed.') waits for the business outcome.

</details>

## Stretch Goals

Change the successful delay to 1600 ms. Predict that the same outcome assertion should still pass.

## Validation

Run `npm test -- 14-slow-dependencies`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/14-slow-dependencies.spec.ts), then compare [the worked solution](../solutions/14-slow-dependencies.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Explain what is unknown at the deadline and why a blind retry with a new request identity can create duplicates.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 15](15-clock-control.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/test-assertions).
