# Atlas Playwright complete learning track

**Status: all 24 labs authored with runnable exercise and solution implementations, Draft for user review.** Completion here describes delivered teaching material and author execution. It does not establish independent learner mastery, handbook approval or live publication.

Run `npm start`, open `/learn`, choose a stage and review a lab. Each guide supplies the problem, implementation tasks, progressive hints, a variation, validation, limitations and reflection. Completed examples let you review the whole package now; reproduce a variation independently before marking your own progress.

| Stage | Delivered labs | Capability to review |
|---|---|---|
| Beginner | 1 login, 2 search, 3 cart | Actions, assertions, meaningful outcomes and independent price expectations |
| Browser foundations | 4 navigation, 5 validation, 6 locator ambiguity, 7 asynchronous UI | History, browser validation, stable scope and observable completion |
| Reliable automation | 8 fixtures, 9 factories, 10 auth state, 11 API setup, 12 cleanup | Test ownership, explicit data, deliberate session reuse and independent server state |
| Failure investigation | 13 HTTP errors, 14 slow dependencies, 15 clock control, 16 trace triage | Controlled faults, bounded waits, clock boundaries and diagnostic evidence |
| Advanced operation | 17 parallel isolation, 18 Chromium/Firefox projects, 19 CI artifacts, 20 visual baselines, 21 accessibility | Trustworthy execution and specialist evidence limits |
| Capstone | 22 risk-based selection, 23 maintenance, 24 lost-response incident | Execution decisions, small abstractions and an idempotent retry investigation |

## Review path

Start with the [setup and command guide](README.md). Run all learner tests with `npm test`, the whole package with `npm run verify`, and the two-engine Lab 18 selection with `npm run test:browsers`. The default completed examples have two tests per lab, 48 learner checks in total. Solutions are a separate 48-check project.

Use the original shop for Labs 1–7. For advanced manual exploration, select Create advanced practice in the workspace; tests create and clean up their own in-memory workspaces. Checkout, authentication and order faults are local simulations. No real payment, identity provider or production integration is claimed.

## Independent practice and assessment

For each lab, record the command, observed outcome, variation, evidence limit and next question. Review supplied code after predicting its behaviour, then change an input or scenario without reading the solution. A green supplied example is execution evidence, not an independent skill assessment. Keep your progress self-reported.

For the capstone, investigate the lost-response scenario before reading its implementation and ask another person to review your reasoning. Automation proves stated invariants; independent review evaluates meaning. Browser engines, tiny visual baselines, scanned accessibility states and a CI run each have distinct limits.

No further lab is represented as planned or delivered by this track. Possible later enrichment—real infrastructure, production identity, distributed payments, broader devices and specialist evaluation—would require a new bounded task rather than a silent extension of these simulations. All authorised 24 lab topics are now supplied.
