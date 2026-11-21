# Lab 22 — Select feedback by risk

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Choose a fast critical check while retaining negative-path evidence in the broader portfolio.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](21-accessibility.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

A selection tag names an execution decision. It does not change defect severity or turn omitted tests into covered risks. The critical purchase path and declined-payment case answer different questions.

## Tasks

1. Run the whole lab, then npm run test:critical. Identify which tests are selected by @critical.

2. Review the confirmed-order total and exact one-order observation.

3. Review the @negative decline case and its zero-order oracle.

4. Explain when the fast selection is useful and which negative, visual, accessibility and browser checks still need broader execution.

<details>
<summary>Hint 1 — the boundary</summary>

Use explicit tags in test titles and inspect the selected test list. Test count is not a risk score.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

npm run test:critical selects @critical from learner tests; npm run verify remains the complete default validation.

</details>

## Stretch Goals

Write a one-page selection rationale for a price-only change versus a session-handling change.

## Validation

Run `npm test -- 22-risk-selection`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/22-risk-selection.spec.ts), then compare [the worked solution](../solutions/22-risk-selection.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Name the decision, chosen boundary, cost and excluded risks. Do not turn the selection into a composite quality score.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 23](23-maintenance.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/test-annotations).
