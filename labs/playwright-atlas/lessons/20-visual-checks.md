# Lab 20 — Visual baselines require review

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Compare a small stable visual component and keep its semantic oracle beside the pixel check.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](19-ci-artifacts.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

The quantity indicator uses two solid rectangles without text or platform fonts. Empty and filled baselines are committed for inspection. This narrow component avoids claiming that a tiny image validates the whole shop.

## Tasks

1. Review visual/empty-indicator.png and visual/filled-indicator.png alongside their expected states.

2. Run the lab without --update-snapshots and inspect any actual/expected/diff attachments.

3. Read the semantic total assertions: pixels alone do not establish the cart price.

4. If a deliberate design change is made later, inspect the diff before explicitly updating and committing a new baseline.

<details>
<summary>Hint 1 — the boundary</summary>

Keep the first run’s generated baseline separate from its later comparison run. Never accept an unexpected diff just to get green.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

await expect(indicator).toHaveScreenshot('empty-indicator.png') uses the committed visual directory shared by learner and solution projects.

</details>

## Stretch Goals

Change the indicator colour temporarily, observe the diff and restore the source. Do not update the baseline during that experiment.

## Validation

Run `npm test -- 20-visual-checks`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/20-visual-checks.spec.ts), then compare [the worked solution](../solutions/20-visual-checks.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Explain what the 64 × 24 indicator can prove and why text/layout, full-page design and other browser renderings remain separate review work.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 21](21-accessibility.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/test-snapshots).
