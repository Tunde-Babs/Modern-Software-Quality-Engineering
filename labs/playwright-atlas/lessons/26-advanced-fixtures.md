# Lab 26 — Fixture architecture: scopes, options, dependencies and overrides

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced framework design · Time: 60–90 minutes. Related topics: dependency control, reusable test architecture and evidence limits.

## Objectives

Build a typed fixture graph with explicit resource ownership, dependency order, lazy setup and worker/test separation.

## Expected Skills

Implement the patterns from a blank test or model, justify their boundaries, investigate a failure and explain what the supplied examples leave unknown.

## Prerequisites

Review [the preceding guide](25-api-mocking.md), [the capability map](../LEARNING_LEVELS.md) and the earlier fixture/network/maintenance labs. Use the TypeScript bridge for unfamiliar syntax. The completed implementations are for review; an independent variation remains necessary to demonstrate skill.

## Environment Setup

Run from `labs/playwright-atlas` with Node.js 24+, installed dependencies and Chromium. Automated tests own port 4180; manual practice can remain on 4178 or the updated review preview. Test fixtures own and delete disposable server workspaces. No additional package or service is needed for these labs.

## Problem Statement

The basic workspace fixture already owns per-test server data and cleanup. This lab adds a worker-owned API transport, an option fixture consumed by a seeded page, an automatic evidence fixture and an inherited fixture override. The worker shares transport, never a global mutable cart.

## Tasks

1. Read [the basic fixture](../fixtures/atlas.ts), then [the advanced fixture](../fixtures/advanced.ts). Draw which fixtures are test-scoped and which resource is worker-scoped.
2. Define the additional fixture types and extend the base test. Separate test fixtures from worker fixtures in the type parameters.

```ts
type TestFixtures = { preferredProduct: 'notebook' | 'lamp' };
type WorkerFixtures = { workerApi: APIRequestContext };
const test = base.extend<TestFixtures, WorkerFixtures>({
  preferredProduct: ['notebook', { option: true }],
  workerApi: [async ({ playwright }, use, workerInfo) => {
    const api = await playwright.request.newContext({
      baseURL: String(workerInfo.project.use.baseURL)
    });
    try { await use(api); }
    finally { await api.dispose(); }
  }, { scope: 'worker' }]
});
```

3. Follow seededShop's dependency chain: workspace ownership is test-scoped, workerApi supplies transport, preferredProduct selects data, and the page reload observes that data. Calculate €9 for one notebook independently.
4. Inspect the automatic fixture's try/finally. It attaches workspace/product/worker context after the test, including failed outcomes. Run the lab and inspect its fixture-scope attachments in the report.
5. Override the product option with test.use({ preferredProduct: 'lamp' }); require the dependent page to show €35. Explain why a fixture option is different from a global mutable variable.
6. Review the inherited shop override. It receives the base shop fixture, filters the catalog and preserves the original setup/cleanup lifecycle. seededShop is not requested, so its mutation must not happen.
7. Run the four checks with two workers, then explain which resources are created lazily and why a worker fixture must not depend on a test-owned browser page.

<details>
<summary>Hint 1 — choosing the boundary</summary>

Fixture dependencies determine setup and reverse teardown order. A worker resource can outlive several tests; mutable business data should still have a narrower owner.

</details>

<details>
<summary>Hint 2 — implementation details</summary>

The complete implementation is in `fixtures/advanced.ts`. `{ auto: true }` enables the evidence fixture without naming it in each test, `{ option: true }` makes the product configurable, and `test.extend({ shop: async ({ shop }, use) => ... })` can wrap the inherited fixture.

</details>

## Stretch Goals

Add a third product option and a dependent fixture without changing the base workspace lifecycle. Temporarily fail an assertion, inspect the automatic evidence and verify the owned workspace is deleted afterwards.

## Validation

Run `npm test -- 26-advanced-fixtures`: the supplied learner implementation should report **4 passed**. Compare [your exercise](../exercises/26-advanced-fixtures.spec.ts) and [the separate solution](../solutions/26-advanced-fixtures.spec.ts). `npm run test:advanced` runs all 36 new learner/solution checks; `npm run check` validates types. The full verification also includes a controlled child-test failure that checks teardown and automatic evidence. Inspect the report and repeat a variation without copying the answer key before claiming independent capability.

## Troubleshooting

Check the selected project, exact URL, request method, fixture scope and accessible region before changing a timeout. Install routes before actions and close contexts in finally. If a workspace disappeared after server restart, rerun its fixture. Use the trace/report to separate setup failures from application behaviour; keep retries at zero.

## Expected Outcome

You can implement and explain test/worker scope, typed options, automatic fixtures, dependencies, overrides and try/finally cleanup. Sharing a worker API context does not justify sharing authentication cookies or test data indiscriminately.

## Cleanup

Fixtures delete their owned workspaces and dispose worker transports. Tests close additional contexts. HAR replay writes an origin-adapted file only to ignored test output; the committed fixture is synthetic and unchanged. No real account, production service or browser practice progress is modified.

## Reflection Questions

- Why is this boundary the smallest useful one for the evidence question?
- Which resources are shared, and which must remain isolated?
- What would you change for a new requirement, and what observation could falsify your design?

## Next Steps

Continue to [Lab 27](27-page-component-models.md). Official reference: [Playwright documentation](https://playwright.dev/docs/test-fixtures).
