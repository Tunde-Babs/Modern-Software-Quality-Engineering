# Lab 16 — Investigate with traces and attachments

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Produce a diagnostic bundle that distinguishes expected rejection from an automation failure.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](15-clock-control.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

A green assertion can still describe a rejected customer action. The trace lab retains traces on successful tests so you can inspect a controlled decline, its request, browser state and explicit evidence note.

## Tasks

1. Review test.use({ trace: 'on' }) and the declined-payment setup.

2. Run the lab, open npm run report and inspect the decline-state JSON, screenshot and trace.

3. Find the checkout response and explain why the test can pass while payment is declined.

4. Review the normal checkout example and compare its order state. Do not infer a global product fix from two local observations.

<details>
<summary>Hint 1 — the boundary</summary>

TestInfo attachments keep the decision context beside the run. The artifact is evidence to inspect, not an automatic diagnosis.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

await testInfo.attach('decline-state', { body: JSON.stringify(state), contentType: 'application/json' }) retains the observed scope.

</details>

## Stretch Goals

Attach a short hypothesis and one observation that would falsify it. Keep secrets out of real diagnostic bundles.

## Validation

Run `npm test -- 16-trace-triage`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/16-trace-triage.spec.ts), then compare [the worked solution](../solutions/16-trace-triage.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Write three sentences: what failed for the customer, what the automation observed and what remains unknown.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 17](17-parallel-isolation.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/trace-viewer).
