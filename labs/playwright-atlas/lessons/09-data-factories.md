# Lab 9 — Typed data factories

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Create explicit, distinct test data without concealing the values that drive expectations.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](08-fixtures.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

Copying setup data across tests hides intent and invites collisions. A small typed factory supplies defaults; each test overrides only values relevant to its evidence question.

## Tasks

1. Read fixtures/data.ts. Identify the default product and quantity, then the override for two backpacks.

2. Calculate the expected €98 before reviewing the first test. Check that API setup and UI observation use the same workspace.

3. Review the second test: labels and IDs must differ, and cleanup must name only the created workspaces.

4. Run the lab and explain why random labels aid ownership while fixed product/price expectations keep the oracle deterministic.

<details>
<summary>Hint 1 — the boundary</summary>

A factory returns plain data. It should not click the UI, send API requests or calculate the displayed total for the assertion.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

cartItem({ productId: 'backpack', quantity: 2 }) returns an explicit CartItem; practiceLabel uses a UUID to distinguish owned data.

</details>

## Stretch Goals

Seed three notebooks with the factory and independently predict €27.

## Validation

Run `npm test -- 09-data-factories`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/09-data-factories.spec.ts), then compare [the worked solution](../solutions/09-data-factories.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Name a useful default and an override that must remain visible to the reviewer. Distinguish uniqueness from reproducibility.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 10](10-authentication-state.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/test-parameterize).
