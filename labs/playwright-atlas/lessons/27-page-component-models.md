# Lab 27 — POM and COM: compose pages from reusable components

## Metadata

Status: Draft authored example · Companion: Atlas Playwright · Difficulty: Advanced framework design · Time: 60–90 minutes. Related topics: dependency control, reusable test architecture and evidence limits.

## Objectives

Implement a Page Object Model composed from independently scoped Component Object Models, and inject it through typed fixtures.

## Expected Skills

Implement the patterns from a blank test or model, justify their boundaries, investigate a failure and explain what the supplied examples leave unknown.

## Prerequisites

Review [the preceding guide](26-advanced-fixtures.md), [the capability map](../LEARNING_LEVELS.md) and the earlier fixture/network/maintenance labs. Use the TypeScript bridge for unfamiliar syntax. The completed implementations are for review; an independent variation remains necessary to demonstrate skill.

## Environment Setup

Run from `labs/playwright-atlas` with Node.js 24+, installed dependencies and Chromium. Automated tests own port 4180; manual practice can remain on 4178 or the updated review preview. Test fixtures own and delete disposable server workspaces. No additional package or service is needed for these labs.

## Problem Statement

POM is the page-level interface. COM means Component Object Model here: a reusable object for a bounded UI region. These are design patterns built with Playwright locators, not mandatory Playwright framework APIs. COM is also distinct from Playwright component testing for frameworks such as React. The earlier CartPanel helper was a small abstraction; this lab makes the page/component boundary explicit.

## Tasks

1. Review [ShopPage](../models/shop.page.ts), [CartComponent](../models/cart.component.ts), [AccountComponent](../models/account.component.ts) and [ProductCardComponent](../models/product-card.component.ts). Each component receives a Locator root and scopes its children to that region.
2. Build the page composition. The page owns navigation and the catalog boundary; it creates components rather than inheriting a universal base-page hierarchy.

```ts
class ShopPage {
  readonly cart: CartComponent;
  constructor(private readonly page: Page) {
    this.cart = new CartComponent(
      page.getByRole('region', { name: 'Your cart', exact: true })
    );
  }
}
```

3. Read the cart component interface. It can find a line or remove a product inside its root. It does not click a catalog card elsewhere on the page or calculate expected prices.
4. Review [model fixtures](../fixtures/model-fixtures.ts). Fixtures create disposable workspaces and inject ready page models; models own interaction details. The authenticated variant prepares cookie state before opening the page.
5. Run the six checks: composed purchase, account sign-in, cart removal, separate page instances, sign-out with retained cart and authenticated model injection. Keep business assertions visible in the tests.

```ts
await shopModel.product('Trail Mug').addToCart();
await expect(shopModel.cart.quantity).toHaveText('1');
await expect(shopModel.cart.total).toHaveText('€15.00');
```

6. Compare this design with Lab 23's simpler helper. Explain when direct locators are clearer, when a component deserves extraction and what an abstraction must not hide.

<details>
<summary>Hint 1 — choosing the boundary</summary>

Use composition and scoped locators. A page can own several instances of a component; each instance must retain its own root and data owner.

</details>

<details>
<summary>Hint 2 — implementation details</summary>

`CartComponent` receives `Locator`, while `ShopPage` receives `Page`. The test still supplies expected values. A model may wait for a clear readiness condition; it should not silently manufacture the oracle, retry failures or own unrelated workspace cleanup.

</details>

## Stretch Goals

Extract a CheckoutComponent from the existing Practice checkout region and inject it into ShopPage. Add one decline and one lost-response test with independently chosen inputs, without changing the backend to make the tests pass.

## Validation

Run `npm test -- 27-page-component-models`: the supplied learner implementation should report **6 passed**. Compare [your exercise](../exercises/27-page-component-models.spec.ts) and [the separate solution](../solutions/27-page-component-models.spec.ts). `npm run test:advanced` runs all 36 new learner/solution checks; `npm run check` validates types. Inspect the report and repeat a variation without copying the answer key before claiming independent capability.

## Troubleshooting

Check the selected project, exact URL, request method, fixture scope and accessible region before changing a timeout. Install routes before actions and close contexts in finally. If a workspace disappeared after server restart, rerun its fixture. Use the trace/report to separate setup failures from application behaviour; keep retries at zero.

## Expected Outcome

You can design a page/component interface, compose it through fixtures, preserve test-level business assertions and explain one abstraction you rejected. Reusing a class is not proof that its boundary is useful; assess scope, lifecycle, diagnostics and maintenance cost.

## Cleanup

Fixtures delete their owned workspaces and dispose worker transports. Tests close additional contexts. HAR replay writes an origin-adapted file only to ignored test output; the committed fixture is synthetic and unchanged. No real account, production service or browser practice progress is modified.

## Reflection Questions

- Why is this boundary the smallest useful one for the evidence question?
- Which resources are shared, and which must remain isolated?
- What would you change for a new requirement, and what observation could falsify your design?

## Next Steps

Use the [independent assessment](../ASSESSMENT.md), then revisit the capstone with your own framework design. Official reference: [Playwright documentation](https://playwright.dev/docs/pom).
