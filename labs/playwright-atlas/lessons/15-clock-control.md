# Lab 15 — Control the browser clock

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Test a reservation expiry boundary without waiting a real minute.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](14-slow-dependencies.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

The reservation is a browser timer and can be controlled by page.clock. The server’s order clock is a different boundary and is not advanced by this browser-only control.

## Tasks

1. Install the clock before navigating, then start the 60-second reservation.

2. Review the expiry case: advance 60001 ms and assert Reservation expired.

3. Review the before-boundary case: advance 59000 ms and require Reservation active.

4. Run the lab and explain why changing browser time is valid for this timer but not proof of server expiry.

<details>
<summary>Hint 1 — the boundary</summary>

Install the clock before application timer use. Advancing controlled time is different from sleeping the test process.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

await page.clock.install(); await page.goto(workspace.url); then page.clock.fastForward(60001).

</details>

## Stretch Goals

Add a boundary observation at exactly 60000 ms, explaining the timer’s 250 ms observation interval.

## Validation

Run `npm test -- 15-clock-control`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/15-clock-control.spec.ts), then compare [the worked solution](../solutions/15-clock-control.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Name the clock owner, its expiry rule and the limits of the simulated time evidence.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 16](16-trace-triage.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/clock).
