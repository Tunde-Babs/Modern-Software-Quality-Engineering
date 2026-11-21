# Lab 8 — Fixtures own setup and teardown

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Use a test-scoped fixture to create, expose and delete an isolated practice workspace.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](07-async.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

A pair of tests must not depend on their execution order or share a cart. The workspace fixture provisions in-memory server state and deletes it in a finally block after use.

## Tasks

1. Read fixtures/atlas.ts from setup through use to teardown. Identify which object owns the workspace ID and which owns the browser page.

2. Review the first test: add a mug and check both the UI total and that workspace’s API cart. Review the second: its own cart must start empty.

3. Run both tests together, then individually with --grep. Predict why either order should work.

4. Explain how finally provides cleanup after a test failure, and why process termination still needs an expiry fallback.

<details>
<summary>Hint 1 — the boundary</summary>

Import test from fixtures/atlas.js, not the base Playwright package, when requesting shop or workspace.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

const response = await request.post('/api/workspaces'); creates data; await use(workspace) transfers temporary use to the test; finally returns ownership to cleanup.

</details>

## Stretch Goals

Add a third fixture-based test using a backpack. Keep the fixture lifecycle unchanged.

## Validation

Run `npm test -- 08-fixtures`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/08-fixtures.spec.ts), then compare [the worked solution](../solutions/08-fixtures.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Explain one resource owned by the fixture and one owned by Playwright. A green pair does not prove crash cleanup in every environment.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

For worker scope, options, automatic evidence and fixture overrides, continue with [Lab 26](26-advanced-fixtures.md) after studying this test-scoped foundation. Continue to [Lab 9](09-data-factories.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/test-fixtures).
