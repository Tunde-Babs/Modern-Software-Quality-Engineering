# Lab 21 — Accessibility checks and their limits

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Combine an automated accessibility scan with an explicit keyboard interaction.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](20-visual-checks.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

An axe scan can identify supported rule violations in the inspected region. A clean result is not full accessibility conformance, a screen-reader evaluation or proof that all user journeys are usable.

## Tasks

1. Review the loaded-main-region scan and inspect any violation nodes before changing an assertion.

2. Review the search interaction: focus the named control, type through the keyboard, and observe the empty-state message.

3. Run both checks and compare the scanned states before and after search.

4. Write a manual follow-up plan for keyboard traversal, focus order, zoom and screen-reader announcements.

<details>
<summary>Hint 1 — the boundary</summary>

Use the official @axe-core/playwright wrapper and keep the inspected region explicit.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

new AxeBuilder({ page }).include('main').analyze() returns violations; inspect them rather than excluding failing rules.

</details>

## Stretch Goals

Test tab navigation through account and checkout controls, recording one observation beyond the automated rules.

## Validation

Run `npm test -- 21-accessibility`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/21-accessibility.spec.ts), then compare [the worked solution](../solutions/21-accessibility.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. State the scanned scope and remaining manual evaluation. No zero-violation result grants a conformance claim.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 22](22-risk-selection.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/accessibility-testing).
