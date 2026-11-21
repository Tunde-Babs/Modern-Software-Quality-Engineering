# Lab 19 — CI feedback and useful artifacts

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Preserve a repeatable run and its decision context in CI without hiding failures behind retries.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](18-browser-projects.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

The root Playwright workflow installs pinned dependencies/browsers, runs the full authored package and uploads reports even if a test fails. It has no production deployment step.

## Tasks

1. Read ci/README.md and the root workflow. Locate triggers, read-only repository permission, timeout and artifact retention.

2. Run the lab and inspect the feedback-decision JSON and review-screen attachments.

3. Review why retry is asserted as zero. Reruns are not proof that an intermittent failure was repaired.

4. After the package is pushed, inspect the actual Actions run and record its URL/status separately from local execution.

<details>
<summary>Hint 1 — the boundary</summary>

Attachments should name the evidence boundary and intended decision, not just a test count.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

Upload the report with an always condition, but preserve the failing test exit status. Do not update visual baselines automatically in CI.

</details>

## Stretch Goals

Propose a minimal smoke selection and explain which omitted risks require another feedback path.

## Validation

Run `npm test -- 19-ci-artifacts`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/19-ci-artifacts.spec.ts), then compare [the worked solution](../solutions/19-ci-artifacts.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Distinguish a local PASS, a workflow definition and an observed CI PASS. No live deployment follows from any of them.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 20](20-visual-checks.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/ci-intro).
