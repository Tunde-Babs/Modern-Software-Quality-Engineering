# Lab 23 — Maintain a small domain abstraction

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Refactor repeated interactions while keeping the business expectation visible at the call site.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](22-risk-selection.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

A CartPanel object wraps stable product actions and summary checks. It should not compute expected prices from the application or become a universal framework for unrelated workflows.

## Tasks

1. Read fixtures/cart-panel.ts and identify the small interface and its dependencies.

2. Review the mixed-cart example with an explicit €53 expectation.

3. Review repeated mug additions and whole-line removal.

4. Compare these checks with Lab 3 and explain one benefit and one cost of the abstraction.

<details>
<summary>Hint 1 — the boundary</summary>

An abstraction should expose domain intent without hiding its oracle or cleanup lifecycle.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

await cart.expectSummary(3, '€53.00') keeps the independently calculated expected value visible.

</details>

## Stretch Goals

Add a method only if a new repeated behaviour justifies it. Document one abstraction you intentionally reject.

## Validation

Run `npm test -- 23-maintenance`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/23-maintenance.spec.ts), then compare [the worked solution](../solutions/23-maintenance.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Explain which UI changes the helper can absorb and which business changes must still update test expectations.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

This small helper is an introduction to abstraction. For explicit POM and root-scoped COM composition through fixtures, study [Lab 27](27-page-component-models.md). Continue to [Lab 24](24-incident-capstone.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/pom).
