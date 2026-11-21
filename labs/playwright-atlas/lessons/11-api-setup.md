# Lab 11 — Compose API setup with UI evidence

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Use an API to prepare data and a browser to verify the customer-visible consequence.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](10-authentication-state.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

Entering every prerequisite through the UI slows feedback and broadens failure causes. Setup can use a narrower API boundary while the final observation remains the UI behaviour under review.

## Tasks

1. Read the seed calls for one lamp and two notebooks, then predict quantity 3 and €53.

2. Verify that page.goto uses the workspace returned by the fixture. A successful setup response alone does not prove correct UI rendering.

3. Review the negative-quantity request: require HTTP 400 and an unchanged empty cart.

4. Run both tests and distinguish setup contract evidence from the UI observation.

<details>
<summary>Hint 1 — the boundary</summary>

The workspace exposes api and url for the same owned state. Assert setup response status before relying on that data.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

POST workspace.api + /cart with { productId: 'notebook', quantity: 2 }; use page.goto(workspace.url) for the observation.

</details>

## Stretch Goals

Seed a backpack and notebook. Predict €58 without reading the shop total.

## Validation

Run `npm test -- 11-api-setup`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/11-api-setup.spec.ts), then compare [the worked solution](../solutions/11-api-setup.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Explain why the hybrid check does not replace the customer Add to cart test, and why invalid setup must fail loudly.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 12](12-cleanup.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/api-testing).
