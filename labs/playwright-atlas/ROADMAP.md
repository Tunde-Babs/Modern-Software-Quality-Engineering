# Atlas Playwright complete learning track

**Status: all 27 labs authored with runnable exercise and solution implementations, Draft for user review.** Completion here describes delivered teaching material and author execution. It does not establish independent learner mastery, handbook approval or live publication.

Run `npm start`, open `/learn`, choose a stage and review a lab. Each guide supplies the problem, implementation tasks, progressive hints, a variation, validation, limitations and reflection. Completed examples let you review the whole package now; reproduce a variation independently before marking your own progress.

| Stage | Delivered labs | Capability to review |
|---|---|---|
| Beginner | 1 login, 2 search, 3 cart | Actions, assertions, meaningful outcomes and independent price expectations |
| Browser foundations | 4 navigation, 5 validation, 6 locator ambiguity, 7 asynchronous UI | History, browser validation, stable scope and observable completion |
| Reliable automation | 8 fixtures, 9 factories, 10 auth state, 11 API setup, 12 cleanup | Test ownership, explicit data, deliberate session reuse and independent server state |
| Failure investigation | 13 HTTP errors, 14 slow dependencies, 15 clock control, 16 trace triage | Controlled faults, bounded waits, clock boundaries and diagnostic evidence |
| Advanced operation | 17 parallel isolation, 18 Chromium/Firefox projects, 19 CI artifacts, 20 visual baselines, 21 accessibility | Trustworthy execution and specialist evidence limits |
| Capstone | 22 risk-based selection, 23 maintenance, 24 lost-response incident | Execution decisions, small abstractions and an idempotent retry investigation |
| Advanced framework design | 25 API response mocking, 26 advanced fixture architecture, 27 POM/COM composition | Deliberate network control, test/worker lifecycle and root-scoped reusable components |

## Review path

Start with the [setup and command guide](README.md). Run all learner tests with `npm test`, the whole package with `npm run verify`, and the two-engine Lab 18 selection with `npm run test:browsers`. Labs 1–24 retain two checks each; Labs 25–27 add 18 checks per project, for 66 learner checks and a separate 66-check solution project. `npm run test:advanced` runs the 36 focused new checks. Study 8 → 26, 13 → 25 and 23 → 27, then return to the capstone with your own architecture.

Use the original shop for Labs 1–7. For advanced manual exploration, select Create advanced practice in the workspace; tests create and clean up their own in-memory workspaces. Checkout, authentication and order faults are local simulations. No real payment, identity provider or production integration is claimed.

## Level and scope

The target is beginner to advanced practical automation engineering. The original track reaches advanced topics, while the three framework labs explicitly deepen the requested API mocking, fixture, Page Object Model and Component Object Model skills. Use the [capability map](LEARNING_LEVELS.md) and [independent assessment tasks](ASSESSMENT.md) to distinguish authored coverage from demonstrated ability. POM/COM are design choices, not mandatory boilerplate or a claim to full framework component-testing coverage.

## Independent practice and assessment

For each lab, record the command, observed outcome, variation, evidence limit and next question. Review supplied code after predicting its behaviour, then change an input or scenario without reading the solution. A green supplied example is execution evidence, not an independent skill assessment. Keep your progress self-reported.

For the capstone, investigate the lost-response scenario before reading its implementation and ask another person to review your reasoning. Automation proves stated invariants; independent review evaluates meaning. Browser engines, tiny visual baselines, scanned accessibility states and a CI run each have distinct limits.

No further lab is represented as planned or delivered by this track. Possible later enrichment—real infrastructure, production identity, distributed payments, broader devices and specialist evaluation—would require a new bounded task rather than a silent extension of these simulations. All 27 currently authorised lab topics are supplied, including the three explicitly requested framework-depth extensions.
