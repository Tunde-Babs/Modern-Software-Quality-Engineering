# Lab 10 — Reuse authentication state deliberately

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Intermediate · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Restore simulated authenticated cookies into a new context without leaking them to an unrelated context.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](09-data-factories.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

The advanced simulator uses an HttpOnly session cookie tied to an in-memory workspace. This is a teaching identity, not a production identity provider. Authentication reuse can save setup time while hiding coverage if confused with testing login.

## Tasks

1. Review the API login and in-memory request.storageState call. No credentials or state files are written to the repository.

2. Follow browser.newContext with the saved state, then assert the welcome message in the browser.

3. Review the fresh-context counterexample: the same workspace ID does not itself authenticate the browser.

4. Run both tests and explain which one tests reuse and which earlier lab tests the UI sign-in flow.

<details>
<summary>Hint 1 — the boundary</summary>

An APIRequestContext can export cookie state. Pass it to a new browser context explicitly and close that context in finally.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

await browser.newContext({ baseURL, storageState: await request.storageState() }) restores the cookie; browser.newContext({ baseURL }) does not.

</details>

## Stretch Goals

Sign out in an authenticated context, reload and check that its welcome state disappears.

## Validation

Run `npm test -- 10-authentication-state`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/10-authentication-state.spec.ts), then compare [the worked solution](../solutions/10-authentication-state.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. Explain where the cookie lives and why saved state should be treated as sensitive in a real application. This simulator does not prove real authentication security.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 11](11-api-setup.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/auth).
