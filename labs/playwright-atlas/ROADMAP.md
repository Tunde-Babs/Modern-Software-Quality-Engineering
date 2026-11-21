# Atlas Playwright learning roadmap

**Status: Draft companion and roadmap.** The bridge and Labs 1–7 are authored with local author validation. Labs 8–24 are planned, not delivered or validated. This companion supplements the approved Part V curriculum; it does not replace it or claim advanced mastery from test counts.

Finished the first three labs? Continue with [Lab 4: navigation](lessons/04-navigation.md), then [Lab 5: validation](lessons/05-validation.md), [Lab 6: locator ambiguity](lessons/06-locators.md) and [Lab 7: asynchronous UI](lessons/07-async.md).

Run `npm start` and open `/learn` for the guided workspace: the same lesson briefs, hints, exercise source, terminal commands and browser-local practice notes. This facilitates implementing Labs 1–7; it does not add the planned advanced lessons or grade your work.

| Stage | Labs | Practice | Observable capability |
|---|---|---|---|
| Beginner — authored | 1 login; 2 search; 3 cart | Labels, roles, actions, assertions, outcome selection | Write and explain six small checks |
| Browser foundations — authored | 4 navigation; 5 validation; 6 locator ambiguity; 7 asynchronous UI | Customer flows and observable completion | Navigate history, separate validation boundaries, resolve ambiguity and observe delayed completion without fixed sleeps |
| Reliable automation — planned | 8 fixtures; 9 data factories; 10 authenticated state; 11 API setup; 12 cleanup | Ownership, lifecycle, boundaries | Run independent tests without shared data |
| Failure investigation — planned | 13 HTTP errors; 14 slow dependencies; 15 clock control; 16 trace triage | Controlled faults, evidence and root cause | Distinguish a product defect from a test defect |
| Advanced operation — planned | 17 parallelism; 18 browser projects; 19 CI artifacts; 20 visual checks; 21 accessibility | Feedback cost, diagnostic context, limitations | Choose proportionate execution and explain gaps |
| Capstone — planned | 22 risk-based selection; 23 maintenance/refactoring; 24 unfamiliar incident | Architecture, prioritisation and communication | Defend a solution using evidence and residual risk |

## How to move quickly

Use one simulator and one command pattern throughout. Spend roughly 10 minutes understanding a problem, 20–30 minutes attempting it, and 10 minutes explaining the evidence. Advance after you can repeat the skill with a new input without reading the solution. Revisit a weak skill rather than repeating material you can already demonstrate.

Use Part II for targeted programming gaps and Part V for the reasoning behind fixtures, determinism, diagnostics and maintenance. Reading the entire handbook is not a prerequisite to the first lab. Later CI implementation and specialist depth should link to the appropriate Parts rather than silently expanding Part V's scope.

## Assess progress

Record locally for each lab: attempted date, command, observed outcome, variation attempted, evidence limitation and next question. Passing the provided solutions checks the training environment; it does not assess the learner. For the capstone, use an unfamiliar scenario and obtain another person's review of your reasoning. Automated checks are useful evidence, not an independent judgement of mastery.

Next implementation slice: Labs 8–12, covering fixtures, data factories, authenticated state, API setup and cleanup. This requires a bounded simulator extension for test-data/state interfaces and explicit distinctions between UI simulation and backend evidence. Checkout, real server-side accounts and API mutation do not yet exist. Current delay and catalog failure controls simulate browser-side behaviour only.
