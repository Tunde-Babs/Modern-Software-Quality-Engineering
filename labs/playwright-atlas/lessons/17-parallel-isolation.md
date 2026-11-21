# Lab 17 — Parallel tests need independent state

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Run two concurrent owners without sharing mutable cart data.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](16-trace-triage.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

Parallelism makes hidden dependencies visible. Each parameterized test gets its own fixture workspace and browser context; the expected cart contains only its named product.

## Tasks

1. Read the two product cases and the parallel describe configuration.

2. Identify the workspace fixture boundary and why a global shared workspace would invalidate the tests.

3. Run this lab with --workers=2, then with --workers=1. Compare outcomes, not just duration.

4. Confirm the UI total and exact API cart for each owner.

<details>
<summary>Hint 1 — the boundary</summary>

The fixture is test-scoped, not worker-scoped. Unique IDs are created even if tests use identical labels.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

Expect cart to equal { [product.id]: 1 }; a correct total alone could hide an extra unintended product.

</details>

## Stretch Goals

Add a notebook case and run with three workers. Keep the expected state explicit.

## Validation

Run `npm test -- 17-parallel-isolation`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/17-parallel-isolation.spec.ts), then compare [the worked solution](../solutions/17-parallel-isolation.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Explain which mutable objects are isolated and what a separate browser context alone would not isolate on a shared server.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 18](18-browser-projects.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/test-parallel).
