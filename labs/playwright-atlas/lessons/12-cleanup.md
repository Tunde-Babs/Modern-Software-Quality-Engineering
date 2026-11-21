# Lab 12 — Cleanup without deleting another owner’s data

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Demonstrate explicit resource ownership and verify cleanup by observing absence.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](11-api-setup.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

A cleanup operation that succeeds without checking its target can leave residue or delete another test’s state. Use returned IDs, finally blocks and a post-delete observation.

## Tasks

1. Review the first test’s create/delete/GET sequence. Explain why a 404 after deletion is useful evidence.

2. Identify the fallback deletion in finally. A repeated deletion may return 404 without harming another workspace.

3. Review the second test: delete a separate owned workspace and confirm the fixture workspace still contains its mug.

4. Run the tests and explain why cleanup must not enumerate and erase every workspace.

<details>
<summary>Hint 1 — the boundary</summary>

Name the resource created by this test; delete only that ID. Avoid broad reset-all endpoints.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

After DELETE /api/workspaces/:id, GET /api/workspaces/:id/state should return 404.

</details>

## Stretch Goals

Create two temporary workspaces, delete one, and observe the other before cleaning it up too.

## Validation

Run `npm test -- 12-cleanup`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/12-cleanup.spec.ts), then compare [the worked solution](../solutions/12-cleanup.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Explain the difference between ordinary teardown and crash recovery. The local server expires abandoned workspaces after an hour on a later creation request.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 13](13-http-errors.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/test-fixtures).
