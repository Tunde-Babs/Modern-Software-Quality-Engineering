# Atlas Playwright learning roadmap

**Status: Draft proposal.** The bridge and Labs 1–3 are authored in this slice. Labs 4–24 are planned, not delivered or validated. This companion supplements the approved Part V curriculum; it does not replace it or claim advanced mastery from test counts.

| Stage | Labs | Practice | Observable capability |
|---|---|---|---|
| Beginner — authored | 1 login; 2 search; 3 cart | Labels, roles, actions, assertions, outcome selection | Write and explain six small checks |
| Browser foundations — planned | 4 navigation; 5 validation; 6 locator ambiguity; 7 asynchronous UI | Customer flows and observable completion | Repair a changed UI without fixed sleeps |
| Reliable automation — planned | 8 fixtures; 9 data factories; 10 authenticated state; 11 API setup; 12 cleanup | Ownership, lifecycle, boundaries | Run independent tests without shared data |
| Failure investigation — planned | 13 HTTP errors; 14 slow dependencies; 15 clock control; 16 trace triage | Controlled faults, evidence and root cause | Distinguish a product defect from a test defect |
| Advanced operation — planned | 17 parallelism; 18 browser projects; 19 CI artifacts; 20 visual checks; 21 accessibility | Feedback cost, diagnostic context, limitations | Choose proportionate execution and explain gaps |
| Capstone — planned | 22 risk-based selection; 23 maintenance/refactoring; 24 unfamiliar incident | Architecture, prioritisation and communication | Defend a solution using evidence and residual risk |

## How to move quickly

Use one simulator and one command pattern throughout. Spend roughly 10 minutes understanding a problem, 20–30 minutes attempting it, and 10 minutes explaining the evidence. Advance after you can repeat the skill with a new input without reading the solution. Revisit a weak skill rather than repeating material you can already demonstrate.

Use Part II for targeted programming gaps and Part V for the reasoning behind fixtures, determinism, diagnostics and maintenance. Reading the entire handbook is not a prerequisite to the first lab. Later CI implementation and specialist depth should link to the appropriate Parts rather than silently expanding Part V's scope.

## Assess progress

Record locally for each lab: attempted date, command, observed outcome, variation attempted, evidence limitation and next question. Passing the provided solutions checks the training environment; it does not assess the learner. For the capstone, use an unfamiliar scenario and obtain another person's review of your reasoning. Automated checks are useful evidence, not an independent judgement of mastery.

Next implementation slice: Labs 4–7, including controllable asynchronous behaviour. Checkout, real server-side state and API setup require later simulator features; they do not exist in the first slice.
