# Learning levels and capability map

**Target: beginner → advanced practical Playwright automation engineering.** The companion now contains 27 labs. The original 24 delivered the broad progression; Labs 25–27 deepen API mocking, fixture architecture and explicit Page Object Model / Component Object Model design. This is a scoped learning target, not a certification, an exhaustive API reference or proof that a learner is advanced because supplied tests pass.

## What the levels mean here

| Level | Expected capability | Main labs |
|---|---|---|
| Beginner | Run a test, use labels/roles, await actions, assert a customer-visible outcome and explain a failure | Bridge, 1–3 |
| Intermediate | Control data and sessions, choose UI/API boundaries, use fixtures, handle asynchronous states and investigate traces | 4–16 |
| Advanced practical | Design and justify isolated fixture/model architecture, control and inspect network traffic, choose execution/CI evidence, diagnose ambiguous outcomes and explain specialist limits | 17–27, with an independent capstone |

A learner may demonstrate different levels in different skills. Reviewing a completed example is useful study; independent implementation with unfamiliar inputs, diagnosis and explanation establish stronger evidence. Use [the assessment tasks](ASSESSMENT.md) after study.

## Explicit skill coverage

| Skill | Runnable coverage | What you should demonstrate independently |
|---|---|---|
| Locators and assertions | Labs 1–7: names, roles, scope, retrying assertions, history and native validity | Repair a changed interaction without positional selectors or fixed sleeps |
| API response mocking | Labs 13 and 25: fulfill JSON/errors, fetch and patch a real response, abort transport, context scope, unroute, inspect POST requests and synthetic HAR replay | Choose a mock boundary, validate its contract, clean it up and explain what real behaviour remains unproven |
| Test fixtures | Labs 8 and 26: typed test fixtures, setup/use/finally, worker transport, options, automatic evidence, dependencies, lazy setup and overrides | Create isolated data and a fixture graph that survives a failing test without sharing a global cart |
| Page Object Model (POM) | Lab 27: ShopPage owns navigation/readiness and composes component objects | Design a small page interface while keeping business expectations visible in tests |
| Component Object Model (COM) | Lab 27: AccountComponent, ProductCardComponent and CartComponent each own a Locator root | Reuse a bounded component across separate page instances without crossing into unrelated regions |
| Authentication and data | Labs 9–12: factories, cookie state reuse, fresh contexts, API setup and cleanup | Explain the session owner, state lifetime, collision risks and cleanup boundary |
| Synchronisation and investigation | Labs 7, 14–16: named states, overall deadlines, controlled browser clock, traces and attachments | Distinguish setup, test, dependency and product failures from primary run evidence |
| Execution and CI | Labs 17–19 and 22: parallel isolation, actual Chromium/Firefox selection, zero retries, artifacts and risk tags | Defend a fast selection and name omitted risks; inspect actual CI outcomes |
| Visual/accessibility evidence | Labs 20–21: small reviewed visual references, scoped axe scans and keyboard input | Inspect a diff and plan manual focus/zoom/screen-reader evaluation without claiming complete conformance |
| Maintenance and capstone | Labs 23–24 and 27: helpers, component composition and lost-response/idempotency investigation | Implement a change without hiding its oracle, then defend an incident decision and residual uncertainty |

## POM, COM and fixtures have different jobs

```text
Test: evidence question and explicit business expectation
  → typed fixture: setup, resources, authentication and teardown
    → ShopPage (POM): navigation, readiness and page composition
      → AccountComponent (COM): account-region interactions
      → ProductCardComponent (COM): one product card
      → CartComponent (COM): cart-region interactions
```

POM and COM are optional design patterns built using Playwright's Page/Locator APIs. COM here means Component Object Model, as confirmed for this task. It is not Playwright's separate React/Vue component-testing feature. Small tests may be clearer with direct locators; extract a model when it improves scope, reuse and maintenance, not merely to satisfy a pattern checklist. Avoid a universal base class that conceals actions, cleanup, retries or expected prices.

## Suggested route through the deeper material

Study Lab 8 before Lab 26, Lab 13 before Lab 25 and Lab 23 before Lab 27. Then return to Lab 24 and implement a new capstone variation using your own fixture/model design. Run `npm run test:advanced` to review the 36 new learner/solution checks, or select one lab with `npm test -- 25-api-mocking`.

## Deliberate limits

The target is advanced capability in the specified UI/API automation and framework-design scope. The current examples do not cover every Playwright feature: WebSocket/GraphQL-specific mocking, service-worker strategies, popup/frame/file workflows, exhaustive device coverage, every CI sharding topology or Playwright framework component testing need separate practice when relevant. The local simulator also does not prove production identity, payments, distributed settlement or security hardening.

Those boundaries do not change the delivered lab status. They prevent interpreting “advanced” as universal expertise. The next assessment should be chosen from the system and risks a learner will actually work on, not from a claim that an API catalogue has been exhausted.

Official primary references: [API mocking](https://playwright.dev/docs/mock), [network control](https://playwright.dev/docs/network), [fixtures](https://playwright.dev/docs/test-fixtures) and [page object models](https://playwright.dev/docs/pom).
