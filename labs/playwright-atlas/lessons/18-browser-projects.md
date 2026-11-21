# Lab 18 — Browser projects and viewport evidence

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Execute a named browser project and distinguish browser-engine coverage from viewport emulation.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](17-parallel-isolation.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

The default learner project uses Chromium. The companion also provides Firefox projects for this lab. A narrow Chromium viewport checks layout conditions, not a physical mobile device or a different browser engine.

## Tasks

1. Run npm test -- 18-browser-projects to establish the Chromium result.

2. Install Firefox with npx playwright install firefox if needed, then run npm run test:browsers.

3. Inspect the browser-evidence attachment for browserName and project.

4. Review the narrow-viewport check and explain what the overflow and named-control observations cover.

<details>
<summary>Hint 1 — the boundary</summary>

Browser projects select an engine. setViewportSize changes layout dimensions within the already selected browser.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

npm run test:browsers runs the lab in both Chromium and Firefox, for learner and solution files.

</details>

## Stretch Goals

Try a 768-pixel viewport and compare the layout. Do not label viewport emulation as real-device testing.

## Validation

Run `npm test -- 18-browser-projects`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/18-browser-projects.spec.ts), then compare [the worked solution](../solutions/18-browser-projects.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. List the actual engine/project combinations executed and one device characteristic left untested.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Continue to [Lab 19](19-ci-artifacts.md). Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/test-projects).
