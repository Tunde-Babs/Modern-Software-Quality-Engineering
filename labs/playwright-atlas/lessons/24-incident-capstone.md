# Lab 24 — Capstone: a lost response and a safe retry

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced · Time: 30–60 minutes. Related Part V topics: isolation, evidence boundaries, diagnostics and maintainability.

## Objectives

Investigate an ambiguous checkout outcome and verify idempotent retry using both UI and API evidence.

## Expected Skills

Implement, run and explain the checks for this specific boundary, including a counterexample or limitation.

## Prerequisites

Read [the preceding lab](23-maintenance.md) and [the setup guide](../README.md). Understand labelled locators, assertions and async/await. The completed exercise is supplied for later review; try a variation without looking at the answer key.

## Environment Setup

Run commands from `labs/playwright-atlas`. Use Node.js 24+, `npm ci` and Playwright's installed Chromium. Automated tests own port 4180 while the manual shop can stay open on 4178. Advanced fixtures create disposable in-memory workspaces; restarting the server clears them. The optional Firefox command is described in Lab 18.

## Problem Statement

The lost-response scenario creates an order but returns HTTP 503. Treating the error as proof that nothing happened risks a duplicate. The browser retains its request key across the retry, and the server returns the original order identity.

## Tasks

1. Before reading the implementation, write a hypothesis for a customer who sees an error but might already have an order.

2. Review the UI scenario: require the error and retained cart, retry, then require confirmation and exactly one €15 order.

3. Review the API countercheck: send the same Idempotency-Key twice and compare order IDs.

4. Run the capstone, inspect incident-decision in the report and explain which evidence would reveal a duplicate-order defect.

5. Write your own incident note with risk, reproduction, boundary, observations, decision and residual uncertainty before marking this lab practised.

<details>
<summary>Hint 1 — the boundary</summary>

Observe creation state separately from response delivery. A retry needs a stable operation identity, not a new key for each network attempt.

</details>

<details>
<summary>Hint 2 — an implementation detail</summary>

After the retry, assert orders has length 1 and the same order ID; a green confirmation banner alone cannot prove absence of duplicates.

</details>

## Stretch Goals

Try the scenario with a backpack, then with a delayed confirmation. Keep expected prices independent and preserve the request identity.

## Validation

Run `npm test -- 24-incident-capstone`. The supplied implementation should report **2 passed**. Inspect [your exercise](../exercises/24-incident-capstone.spec.ts), then compare [the worked solution](../solutions/24-incident-capstone.spec.ts) after forming your own explanation. Run `npm run check` for types. Passing supplied code establishes execution, not your independent ability. Record the command, outcome, variation and limits in your browser notes.

## Troubleshooting

Check the exact workspace ID, response status and named UI state before changing a timeout or assertion. Use `npm run report` for attachments and traces. Keep retries at zero. If a workspace is missing after a server restart, rerun the test fixture or create a new manual workspace; old in-memory data cannot be recovered.

## Expected Outcome

Two runnable checks for the stated evidence question, a reviewed implementation and one independently attempted variation. An authored solution is not an unseen assessment. Obtain another person’s review of your investigation; this local order simulator does not prove payment-provider settlement or production idempotency.

## Cleanup

The fixture deletes its own workspace in finally and Playwright closes owned contexts. Tests that create additional contexts/workspaces close or delete them explicitly. Reports and traces remain ignored local artifacts. No real accounts, payments or production state are modified.

## Reflection Questions

- What observation makes this check useful for the stated decision?
- Which state, clock, data or dependency did the test control?
- What remains unproven, and what additional evidence would address it?

## Next Steps

Review your evidence across the full track and revisit a lab with unfamiliar inputs. The authored package is complete; independent mastery and publication review are separate. Official reference checked 2026-11-21: [Playwright documentation](https://playwright.dev/docs/api-testing).
