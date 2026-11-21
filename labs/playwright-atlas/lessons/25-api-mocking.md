# Lab 25 — API mocking: success, modification, failure and HAR replay

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced framework design · Time: 60–90 minutes. Related topics: dependency control, reusable test architecture and evidence limits.

## Objectives

Implement and explain deliberate API response control, including the difference between a browser observation and server persistence.

## Expected Skills

Implement the patterns from a blank test or model, justify their boundaries, investigate a failure and explain what the supplied examples leave unknown.

## Prerequisites

Review [the preceding guide](24-incident-capstone.md), [the capability map](../LEARNING_LEVELS.md) and the earlier fixture/network/maintenance labs. Use the TypeScript bridge for unfamiliar syntax. The completed implementations are for review; an independent variation remains necessary to demonstrate skill.

## Environment Setup

Run from `labs/playwright-atlas` with Node.js 24+, installed dependencies and Chromium. Automated tests own port 4180; manual practice can remain on 4178 or the updated review preview. Test fixtures own and delete disposable server workspaces. No additional package or service is needed for these labs.

## Problem Statement

The earlier HTTP-error lab introduced one fulfilled 503. This lab expands that boundary to successful JSON, a real response patched through route.fetch, aborted transport, context-specific routes, route cleanup, observed POST payloads, successful POST stubs and a synthetic HAR. Every mock controls a stated observation; none proves the real dependency behaves that way.

## Tasks

1. Open the completed exercise and identify the eight separate evidence questions. Start with a blank scratch test if you want an implementation attempt before reading the answer.
2. Build a successful GET stub before navigating. Give the product an explicit ID, name, category, priceCents, description and symbol, then assert its visible card and independently predicted total.

```ts
await page.route('**/products.json', route =>
  route.fulfill({ json: [mockProduct] })
);
await page.goto('/');
```

3. Modify a real response rather than replacing the entire API. Fetch it through the route, change only the selected product price and fulfill with the original response plus patched JSON. Assert both the original price captured at the boundary and the altered UI outcome.

```ts
const response = await route.fetch();
const products = await response.json();
const patched = products.map(product =>
  product.id === 'mug' ? { ...product, priceCents: 1900 } : product
);
await route.fulfill({ response, json: patched });
```

4. Abort the catalog request and require the application error state. Compare transport failure with the HTTP-error scenario in Lab 13.
5. Install a route on one browser context and prove that another context still receives the four real products. Remove a route with the same handler reference and reload to observe the real endpoint again.
6. Register waitForResponse before clicking Add to cart. Inspect the request method, URL, POST JSON and response state. Avoid setting up the waiter after the event may already have happened.
7. Review the method-aware POST stub. Its UI total passes while the API cart remains empty: explain why a successful stub is not persistence evidence.
8. Review the synthetic HAR fixture and replay test. The test adapts only its origin, scopes replay to products.json and keeps update false. Run all eight checks, then inspect the network entries in a trace.

<details>
<summary>Hint 1 — choosing the boundary</summary>

Use page.route for one page and context.route for a browser context. Install routes before triggering requests; route.fetch reaches the upstream response while route.fulfill supplies a response.

</details>

<details>
<summary>Hint 2 — implementation details</summary>

The success fixture is `fixtures/catalog.har`, explicitly authored rather than captured from a real session. `page.routeFromHAR(file, { url: '**/products.json', notFound: 'abort', update: false })` replays only that catalog request. HARs from real applications can contain credentials and personal data; the supplied fixture has none.

</details>

## Stretch Goals

Without the answer key, patch one different product to a reviewer-chosen price, observe the request body and prove the change affects only the intended context. Then remove the mock and show the original response.

## Validation

Run `npm test -- 25-api-mocking`: the supplied learner implementation should report **8 passed**. Compare [your exercise](../exercises/25-api-mocking.spec.ts) and [the separate solution](../solutions/25-api-mocking.spec.ts). `npm run test:advanced` runs all 36 new learner/solution checks; `npm run check` validates types. Inspect the report and repeat a variation without copying the answer key before claiming independent capability.

## Troubleshooting

Check the selected project, exact URL, request method, fixture scope and accessible region before changing a timeout. Install routes before actions and close contexts in finally. If a workspace disappeared after server restart, rerun its fixture. Use the trace/report to separate setup failures from application behaviour; keep retries at zero.

## Expected Outcome

You can explain the oracle, request scope and cleanup for each mock. You can also distinguish HTTP errors, transport aborts, HAR replay and a real request modified in flight. Service-worker interception, GraphQL and WebSockets remain distinct extensions, not evidence supplied by these HTTP examples.

## Cleanup

Fixtures delete their owned workspaces and dispose worker transports. Tests close additional contexts. HAR replay writes an origin-adapted file only to ignored test output; the committed fixture is synthetic and unchanged. No real account, production service or browser practice progress is modified.

## Reflection Questions

- Why is this boundary the smallest useful one for the evidence question?
- Which resources are shared, and which must remain isolated?
- What would you change for a new requirement, and what observation could falsify your design?

## Next Steps

Continue to [Lab 26](26-advanced-fixtures.md). Official reference: [Playwright documentation](https://playwright.dev/docs/mock).
