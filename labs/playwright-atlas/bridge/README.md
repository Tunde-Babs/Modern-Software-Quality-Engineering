# Before your first browser test

**Status: Draft. Time: 20–30 minutes.** No programming experience is assumed. Work through this once, then return when a test contains an unfamiliar word.

## Understand a small program

Open `essentials.ts` beside this guide. Run `npm run bridge` from the companion folder. You should see `Atlas Backpack: two cost €98.00` and a success message.

- A **value** is information, such as `'Atlas Backpack'` (text) or `4900` (a number).
- `const` gives a value a name. An **object** groups related values, such as a product's name and price.
- A **type** describes the expected shape of a value. `Product` requires a text name and a numeric price. TypeScript can detect many mistakes before execution.
- A **function** is a named operation. `lineTotal(product, 2)` asks it to calculate the cost of two units. `return` supplies its answer.
- An **assertion** compares reality with an expectation. `assert.equal(..., 9800)` fails if the calculation produces a different number. Predict the expected result before running it.
- An `async` function returns a **Promise**, representing a result that becomes available later. `await` waits for that operation's result inside your function. Browser interactions use this pattern because the browser and application take time to respond.
- `import` brings in a tool from another module. A module is a file or package that exposes reusable code.

Try changing the quantity to `3` while leaving the expected value at `9800`. Run the bridge and read the assertion failure. Calculate the correct expectation (`14700`), change it and rerun. Restore the original example when finished. The exercise demonstrates an observable failure; do not change expectations merely to silence a real defect.

Run `npm run check`. The TypeScript compiler checks types; Playwright itself transforms TypeScript to execute it without doing this type check.

## Read a browser test

```ts
import { test, expect } from '@playwright/test';

test('shop has a collection', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'The collection' })).toBeVisible();
});
```

Read this aloud: “Define a test. Receive a fresh browser page. Navigate to the local shop. Find a heading called The collection. Expect it to become visible.”

`({ page })` receives a browser tool supplied by Playwright. `=> { ... }` defines the function that Playwright runs. A **locator**, such as `getByRole`, describes how to find an element. An accessible **role** describes its purpose (button, heading, searchbox); a label or visible name describes which one. This keeps intent readable.

`await expect(...).toBeVisible()` checks again until it succeeds or reaches the configured timeout. This is different from pausing for an arbitrary number of seconds. Use an observable outcome such as a message or total.

## Your first edit

Open `exercises/01-login.spec.ts`. Each starter already imports `test` and `expect`, defines a test, and opens the shop. Replace its `throw new Error(...)` line with actions and assertions from your own attempt. Do not paste a second complete test inside the existing one.

You are ready for [Lab 1](../lessons/01-login.md) when you can explain why an assertion can fail, what a locator selects, and why browser actions use `await`. You do not need to learn all of TypeScript first.

Further reading: [Playwright: Writing tests](https://playwright.dev/docs/writing-tests), [TypeScript support](https://playwright.dev/docs/test-typescript).
