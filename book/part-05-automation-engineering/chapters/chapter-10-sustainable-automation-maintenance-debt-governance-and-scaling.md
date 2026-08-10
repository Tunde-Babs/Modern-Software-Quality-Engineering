# Chapter 10 — Sustainable Automation: Maintenance, Debt, Governance, and Scaling

## Metadata

| Field | Value |
|---|---|
| Part | Part V — Automation Engineering |
| MQE-BOK domain | Automation Engineering |
| Chapter | 10 |
| Audience | QA Engineers, Automation Engineers, SDETs, and Quality Engineers |
| Prerequisites | Chapters 1–9; Part II maintainable-code and refactoring practices |
| Estimated study time | 95 minutes |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An automated check is an engineering product with a lifecycle, not a permanent asset because it once passed.

## Opening Story

The following illustrative scenario concerns Atlas Commerce. Its automation dashboard shows 4,000 checks, a number leaders proudly cite in planning meetings. The browser portfolio now takes five hours, 47 checks are quarantined, most failure reports lack useful context, and nobody knows whether a set of shared page objects is still used. A pricing team duplicates an API check in the browser suite because it seems safer than understanding the existing evidence. When a product team removes an old feature, its checks remain because no one owns their deletion.

The suite is large but not healthy. Its size conceals cost, duplicate evidence, stale assumptions, and a declining ability to influence delivery decisions. The problem is not that Atlas has automation; it is that the team has not treated the automation system as a product that must evolve.

## Introduction

Automation is changed by the same forces that change production software: product decisions, interfaces, dependencies, data, environments, security requirements, browsers, libraries, and team ownership. Useful automation therefore requires maintenance, review, deletion, and deliberate investment.

This chapter does not prescribe an enterprise governance program or an organizational chart. It explains lightweight decisions that keep automation evidence trustworthy as a product and its delivery context evolve. It builds on Part II’s maintainable-code practices, Chapter 3’s abstractions and fixtures, and Chapter 9’s feedback portfolio.

## Why This Chapter Matters

An automation system that nobody trusts is a liability even when it contains many checks. Its failures consume attention; its slowness delays feedback; its abstractions make simple changes expensive; and its stale coverage can communicate confidence about a risk that no longer exists. Conversely, a smaller, well-owned portfolio can produce more useful evidence because its checks remain purposeful, diagnosable, and proportionate.

The QA-to-QE transition is not from writing scripts to writing more sophisticated scripts. It is from maintaining individual checks to governing a sustainable feedback product: one with explicit ownership, useful health signals, transparent debt, and permission to remove low-value automation.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify common lifecycle costs and forms of automation debt;
- distinguish useful maintenance from growth in check count;
- decide when to retain, refactor, relocate, quarantine, investigate, or delete a check;
- define suite-health signals without inventing universal performance targets;
- assign and review ownership for checks, abstractions, state, and dependencies;
- apply lightweight governance that supports contribution and learning; and
- explain how automation architecture and portfolios should evolve with product risk.

## Automation Has Lifecycle Cost

Every automated check has a cost beyond its initial implementation. A product flow changes; a locator contract is renamed; a data rule evolves; a browser version changes; a dependency changes behavior; an environment gains a new control; a framework upgrade changes a default. These events can invalidate an automation assumption even when the product is behaving correctly.

Cost also includes execution capacity, test data, diagnostic storage, review effort, onboarding, and investigation time. A slow or unclear check taxes everyone who waits for it or interprets it. The right question is not “Can we afford to delete this?” but “What evidence does this continue to provide, at what cost, and what would replace it if removed?”

### Automation debt

**Automation debt** is the accumulated cost and risk created when automation design, evidence scope, ownership, or maintenance is deferred in ways that reduce future usefulness. It is related to technical debt but includes evidence-specific concerns: an obsolete check can be technically tidy while still asserting a requirement that no longer matters.

Common examples include brittle selectors, duplicated checks at the same boundary, unused helpers, oversized abstractions, hidden shared state, long-lived quarantines, stale reports, excessive end-to-end coverage, and suites whose duration makes results operationally irrelevant. These are signals to investigate, not a universal checklist of defects.

The following **MSQE Automation Sustainability Lens** is an educational framing, not a standard or scoring system. For a check or subsystem, ask:

1. What decision and risk does it support?
2. Is its evidence unique, timely, and understandable?
3. What state, dependency, ownership, and maintenance cost does it create?
4. What should change, be moved, be removed, or be made explicit?

## Maintain the Evidence, Not Just the Code

Product changes are an opportunity to revisit evidence selection. A change may require a new check, a modified oracle, different state setup, or no automation change at all. It can also make a check obsolete. Treating every product change as a reason to add tests creates a suite that remembers old product history rather than current risk.

Review maintenance at the boundary where evidence is strongest. A browser journey that verifies a calculation already covered by a focused API or component check may retain a user-visible purpose, or it may be duplicating evidence. The answer depends on the decision, not on a rule that UI checks are always bad or redundancy is always wasteful.

### Deleting automation is engineering work

Deletion is appropriate when a feature or risk no longer exists, evidence is duplicated without a distinct decision purpose, a boundary has been replaced, a check has become too costly for its value, or better evidence now exists elsewhere. Before deletion, record the evidence claim being removed, any replacement or remaining gap, the owner who accepts the decision, and whether a future review trigger applies.

Check count is not progress. A portfolio that removes obsolete or misleading checks can become safer because it reduces noise and makes the remaining claims easier to understand.

### Refactoring and migration

Refactor automation for the same reasons as production code: to improve readability, localize change, remove duplication, clarify ownership, and make safe behavior easier. Part II’s guidance on small modules, explicit contracts, tests, and review applies directly.

Avoid big-bang framework rewrites as a default response to pain. They can pause useful feedback, discard accumulated knowledge, and migrate defects into a new structure. Prefer incremental migration: identify a high-cost seam, introduce a narrow replacement, move one supported flow, validate its evidence and diagnostics, then retire the old path when the result is established.

## Suite Health Is Evidence About the Automation System

**Suite health** is the observable condition of an automation portfolio as a feedback product. It is not a single percentage and should not become a target that teams optimize without understanding.

Useful signals include:

| Signal | Question it supports | Misuse to avoid |
|---|---|---|
| Duration and queue time | Is evidence arriving in time for its decision? | A universal speed target detached from value |
| Failure stability | Are results repeatable enough to act on? | Hiding failures to improve a rate |
| Quarantine age | Are temporary exclusions being resolved? | Treating age alone as proof of priority |
| Maintenance effort | Where is the portfolio consuming disproportionate capacity? | Counting edits without examining value |
| Duplicate evidence | Are two checks serving distinct decisions? | Removing all overlapping evidence automatically |
| Diagnostic usefulness | Can a failure be reconstructed safely? | Collecting every artifact by default |

Use trends and concrete investigations. A long suite might be appropriate for a release candidate; a short suite may be unhelpful if it misses the decision’s primary risk.

## Ownership and Review

Ownership should make decisions and response paths visible, not create a single gatekeeper. A product team may own failures for its domain, a platform group may own shared runner behavior, and an automation contributor may own a fixture. The allocation needs to answer: who investigates a failure, reviews an abstraction, maintains test data, approves a quarantine, owns cleanup, and communicates an evidence gap?

Automation changes deserve engineering review. Review should consider the evidence claim, boundary, state isolation, synchronization, diagnostics, confidential-data exposure, maintainability, and impact on feedback timing—not only whether the syntax appears correct. A reviewer can ask whether a new page object explains a stable interaction contract or hides a product workflow behind a generic layer.

## Lightweight Governance That Enables Work

**Governance** here means the minimum shared decisions that make automation contribution and evidence use dependable. Useful examples include contribution expectations, required diagnostic context, ownership conventions, quarantine review points, deletion rules, and a way to record important architecture decisions.

Good governance is lightweight, visible, and revisable. It reduces repeated negotiation and helps a new contributor make a safe change. It becomes harmful when it rewards check count, mandates a framework without a decision need, treats all teams as identical, or requires documentation that cannot be used during review or investigation.

### Scaling teams and shared capability

Growing organizations commonly balance embedded domain ownership with central platform capability. Embedded ownership keeps automation close to product decisions; a shared platform can support common fixtures, diagnostics, standards, and upgrades. Neither model is universally right. A central team should not become the owner of all product evidence, and domain teams should not silently create incompatible infrastructure for every feature.

Shared libraries require particularly careful ownership. A helper used by many domains is a dependency with a change-management cost. Keep its contract small, document supported use, and resist extracting abstractions solely because two checks happen to look similar.

## Upgrades, Dependencies, and Portfolio Evolution

Tool, browser, and dependency upgrades are product changes to the automation system. Plan them as evidence work: identify the version change, likely affected boundaries, expected behavior changes, compatibility portfolio, diagnostics, rollback or containment approach, and accountable owner. A periodic compatibility run can reveal drift, but it does not remove the need to understand a known upgrade.

As product risk changes, the portfolio should change. A new payment method may justify focused service, API, browser, and accessibility evidence. A retired payment flow may justify removal. The decision is better made through explicit risk and feedback value than by preserving a historical suite indefinitely.

## The Automation Lifecycle

Sustainability becomes easier when a team treats a check as moving through a lifecycle rather than as a permanent object created on the day a defect was found:

> candidate → implementation → use → maintenance → refactoring → relocation or retirement → deletion

At the **candidate** stage, the team asks whether automation is proportionate and what decision it should support. At implementation, it chooses an evidence boundary, state model, oracle, diagnostics, and owner. During use, the check provides feedback and produces data about its own usefulness: duration, stability, failure patterns, and maintenance demand. Maintenance may clarify a locator, update a product rule, revise test data, or improve a report. Refactoring changes the implementation while preserving a justified evidence claim. Relocation moves evidence to a stronger or cheaper boundary. Retirement and deletion are legitimate outcomes when value has ended.

This lifecycle helps distinguish maintenance from accumulation. A team that adds a check after every incident but never evaluates existing coverage eventually owns history rather than a purposeful portfolio. A team that deletes blindly may remove useful safeguards. The lifecycle requires a decision at each transition.

### Where maintenance cost comes from

Maintenance is not one category of work. Product changes alter journeys, rules, content, and supported behavior. Browser and tool changes alter rendering, actionability, drivers, defaults, and compatibility. Data changes alter reference values, state setup, privacy constraints, and cleanup. Dependencies introduce version, contract, sandbox, availability, and quota concerns. Environments change through configuration, identity, feature flags, networking, or resource limits.

Design choices also create cost. An abstraction that hides a product concept can force unrelated teams to coordinate. A fixture with unclear teardown can contaminate later tests. An ownerless helper can become too risky to change. Weak diagnostics turn every failure into a slow reconstruction exercise. Maintenance planning should make the source of the cost visible before choosing a remedy.

### An automation-debt taxonomy

The following **MSQE Automation Debt Taxonomy** is educational framing, not a maturity model or a standard. It helps a team describe the kind of debt it sees so that it can choose an appropriate intervention.

| Debt type | Typical signal | Useful response |
|---|---|---|
| Evidence debt | A check asserts a removed or weakly relevant risk; important evidence is absent | Delete, replace, or record the evidence gap |
| Design debt | Oversized page objects, duplicated helpers, unclear contracts | Simplify, refactor, or localize the abstraction |
| Reliability debt | Intermittent results, fixed waits, hidden dependencies | Investigate cause, control state, and validate the repair |
| Data and state debt | Shared accounts, non-unique records, fragile cleanup | Create explicit ownership, uniqueness, reset, or isolation |
| Diagnostic debt | Stack traces without relevant run context | Add safe first-failure artifacts and reporting context |
| Ownership debt | No clear responder for failures, utilities, or quarantines | Assign and document accountable ownership |

Categories may overlap. A permanently quarantined browser flow can be reliability debt, diagnostic debt, and ownership debt at once. The purpose is to guide inquiry, not to make a single label appear definitive.

## Worked Sustainability Review

An illustrative Atlas review contains five representative items. The first is a high-value checkout confirmation check that is stable, quick enough for pull requests, and the only evidence that a selected customer-visible total appears after controlled API setup. **Keep** it, retain its clear owner, and improve only if product change alters its claim.

The second is an oversized page object shared by checkout, support, and catalog tests. It contains navigation, data setup, assertions, and hidden retries. **Refactor** it into small domain helpers and fixture-owned setup, keeping user-visible assertions close to the checks that need them. The object is not valuable merely because many tests use it.

The third is a slow browser journey that creates an order through the UI and then verifies the same pricing calculation already exercised by focused API evidence. Its remaining browser claim is unclear. **Move the calculation evidence** to the focused boundary and retain only a thin browser outcome if that outcome supports a distinct decision.

The fourth is a long-quarantined test for a removed loyalty feature. It has no owner and no compensating evidence. **Delete** it after recording that the feature and risk are retired. The historic investment does not create future value; this is a sunk-cost decision, not an indictment of the original work.

The fifth is an intermittent support-agent check whose first failures show a shared account unexpectedly changed by a parallel run. **Investigate** the state collision; use a temporary quarantine only if an owner, compensating evidence, and review date are recorded. A retry that passes may be evidence of the collision’s intermittence, but it is not a solution.

## Refactoring for Explainable Evidence

Refactoring should make the evidence easier to understand and change. Extract a domain helper when several checks genuinely need the same stable business interaction, not merely similar syntax. Simplify a page object when it has become a second application layer that hides assertions, data creation, and navigation behind generic verbs. Move setup into a fixture when its lifecycle, state contract, and teardown are shared and visible. Eliminate shared state when a test’s result depends on the order or timing of another run. Improve artifact context when a failure cannot tell an investigator which user, order, environment, or selected condition mattered.

These are not arguments for a particular pattern. The review question is whether the structure makes a valid evidence claim easier to inspect, diagnose, and evolve. A smaller local helper may be preferable to a shared framework abstraction whose contract is broader than any supported use.

## Trust Is Built and Lost Through Experience

Teams stop trusting automation when failures are frequently unexplained, results arrive after decisions are made, green runs contradict user experience, quarantines never leave, ownership is unclear, or reports require a specialist to interpret. Trust is not restored by asking people to believe the dashboard. It is restored through visible repairs: preserving first failures, resolving or deleting unstable checks, reducing known duplication, making state control explicit, and reporting limitations alongside results.

Treat cost qualitatively. A check may be expensive yet essential because it informs a high-consequence release risk. A fast check may be cheap yet low value because it duplicates a stronger signal. Discuss cost in terms of engineering attention, execution capacity, maintenance effort, environment exposure, and decision value rather than inventing a precise return-on-investment formula unsupported by the available data.

### Useful and harmful governance in practice

Useful lightweight rules include: a quarantine has an owner and review date; a new end-to-end check states why a narrower boundary is insufficient; shared-utility changes receive review from an affected owner; and failures preserve minimum safe diagnostic context. These rules make existing decisions visible.

Harmful rules include coverage-percentage quotas, mandatory Page Object use, a no-deletion policy, and a requirement that every test runs everywhere. Each rewards compliance or volume over evidence value. It also hides the trade-off that competent engineers must be able to explain.

### Shared libraries and organizational trade-offs

Shared libraries offer consistency, leverage, and a common place to improve diagnostics or state handling. They also create coupling: a release can affect many domains, version migration can be costly, and ownership can become ambiguous. Publish narrow contracts, make version impact visible, and resist adding a shared utility until a stable supported use exists.

Central platform ownership can provide standards and capability; embedded ownership keeps evidence close to the product decision. Many organizations combine them. The suitable arrangement depends on team boundaries, change rate, expertise, and the cost of coordination. The requirement is not a particular structure but an answer to who will act when shared behavior, test data, or diagnostic capability changes.

### Lifecycle decision example: the evolving checkout journey

An Atlas browser check originally protects a high-risk checkout interaction. It creates a customer through the UI, applies a discount, waits for payment status, and verifies confirmation. At first, the check is useful because it establishes a customer-visible path the team cannot otherwise observe. Over time, service-level pricing evidence becomes stronger, an API fixture provides controlled orders, and product flows stabilize. Meanwhile the browser check takes several minutes and duplicates calculation assertions that fail more quickly elsewhere.

The lifecycle question is not whether the original check was a mistake. It was justified by the earlier risk and available evidence. The question is what it should become now. Atlas can retain a thinner browser journey that confirms the selected visible outcome, move calculation assertions to the service and API boundaries, and remove UI-based setup. If the customer-visible risk disappears with a retired flow, deletion is defensible. If the check remains the only realistic evidence of a customer interaction, retain it even if it is expensive, then invest in making its state and diagnostics more reliable.

This reasoning applies at each lifecycle point. During adoption, ask whether the team can act on the result. During normal operation, inspect whether the check remains timely and stable. During product change, re-evaluate the claim. During maintenance, compare the cost of repair with alternative evidence. During retirement, state what evidence is lost and who accepts any resulting residual risk.

### Deletion is an evidence decision

Teams often resist deletion because effort has already been invested, an old metric rewards check count, or someone says, “we might need it someday.” This is a sunk-cost bias: a past investment cannot by itself establish future value. Keeping a check consumes future capacity, and it may hide a more useful opportunity to strengthen another boundary.

Before deleting, ask five questions. What evidence disappears? Is the same evidence available elsewhere for the same decision? Has the product risk, user path, or supporting architecture changed? Does the check still influence a real engineering decision? Could its maintenance cost be redirected to a more valuable evidence gap? Document the result, including an owner and revision trigger. Deletion is not loss of quality when it removes obsolete, misleading, or redundant evidence; it is portfolio maintenance.

### A compact portfolio review

Consider six Atlas items. The checkout happy-path browser journey is the only evidence that the selected discount and confirmation are visible together: **retain**, but refactor UI setup into controlled API state. The focused checkout API validation catches pricing and contract errors quickly: **retain** as early feedback. A second visual snapshot of the same unchanged checkout state has no decision purpose beyond the first: **delete** or replace it with a selected visual risk. A payment test quarantined for six months has no owner and hides first-failure data: **investigate**, assign ownership, and either repair, replace, or delete; temporary quarantine is not an outcome. The critical support-agent access flow represents a distinct authorization risk: **retain** and improve artifacts. A removed-feature test has no remaining product risk: **delete** after recording its retirement.

For each decision, a sustainability plan should show the issue, evidence of impact, retain/refactor/delete/relocate choice, owner, priority, risk if unchanged, risk introduced by the change, and success indicator. “Suite duration falls” may be useful but is not enough: the success indicator should show whether the intended evidence remains available and actionable.

### When a shared helper amplifies risk

Suppose a shared authentication helper is used by 80 percent of Atlas checks. An update makes tests pass by silently reusing a cached administrative session. The suite appears healthier while masking an application-state problem: ordinary customers may not have the same authorization state. The helper’s blast radius makes its contract, version compatibility, review, diagnostics, and rollback considerations unusually important.

Reuse is valuable, but it can amplify a mistaken assumption. Require affected ownership review for a shared contract change, exercise representative dependent behavior, and make compatibility impact visible. If the helper grows into wrappers around stable APIs, generic base classes, a custom DSL with poor diagnostics, or a prerequisite change for every new test, the framework is becoming the product. Simplification may mean deleting wrappers, returning assertions to domain-level checks, splitting a helper, or documenting a smaller contract.

### Evolving rather than rewriting

A team moving a Selenium portfolio gradually toward Playwright, for example, should not assume the rewrite is automatically superior. Identify valuable existing evidence, select the first migration by risk and boundary, establish comparable diagnostics and state control, run limited overlap where it answers a transition question, and deliberately remove old duplicates after confidence is established. The aim is continuity of trustworthy feedback, not tool replacement for its own sake.

### Upgrade evidence and controlled evolution

Browser, runner, framework, and library upgrades deserve the same disciplined treatment as other automation changes. Begin with the changed dependency and its published compatibility or behavior notes, then ask which evidence boundaries, fixture contracts, rendering states, reporters, or environments are likely to be affected. A change in browser behavior may require focused compatibility evidence; a change in a reporting library may require a check that first-failure diagnostics remain readable and safe; a change in an authentication client may require review of every fixture that depends on its session semantics.

An upgrade plan need not become a separate bureaucracy. It can be a small record: change, owner, affected assumptions, selected validation, known exclusions, containment or rollback option, and review result. The record matters most for shared dependencies with a large blast radius. It also prevents a team from calling an upgrade “maintenance” while silently changing the meaning of its evidence.

### Prioritizing work without false precision

When several improvements compete, prioritize with qualitative questions: Which issue affects a high-consequence decision? Which one produces the most wasted investigation? Which repair enables other teams? Which evidence gap is currently hidden by a green or quarantined result? Which action reduces an irreversible or hard-to-diagnose failure mode? These questions can support transparent trade-offs without inventing an ROI number that implies more precision than the evidence supports.

For example, reducing a broad suite by deleting a harmless duplicate might save capacity, but repairing an ownerless checkout fixture may deserve priority because it blocks investigation for a customer-critical path. A healthy portfolio does not optimize a single dashboard metric; it invests where confidence, learning, and engineering attention improve together.

Revisit priorities after incidents, major product changes, sustained queue pressure, or a change in the customer risk profile. These events are evidence that the cost-and-value assumptions behind the current portfolio may no longer hold.

Reviewing them deliberately turns maintenance from reactive cleanup into an engineering investment decision.

The review should also confirm that a previously useful control has not become a misleading source of confidence after its product context changed.

## QA → QE Transition

| Script-maintenance framing | Sustainable QE framing |
|---|---|
| “Fix the failing test.” | “Determine whether the failure is product evidence, automation debt, or an environment signal, then restore trustworthy feedback.” |
| “Add a test for every defect.” | “Select the most proportionate enduring evidence and retire obsolete coverage.” |
| “The framework team owns quality.” | “Make ownership of evidence, dependencies, and decisions explicit across the system.” |
| “More checks mean better coverage.” | “Maintain a portfolio whose evidence remains useful, timely, and trusted.” |

## Engineering Perspective

Sustainable automation is a socio-technical system. Its health depends on architecture, change boundaries, review practice, team incentives, environment quality, and the willingness to make evidence limitations visible. A dashboard cannot repair unclear ownership; a new framework cannot create a missing decision model.

Allocate maintenance by risk and feedback value. Fixing a flaky check that blocks a customer-critical change may be more valuable than adding a new low-risk scenario. Deleting a misleading report may be more valuable than redesigning its colors.

## Industry Perspective

Maintainability is a recognized software-quality concern in ISO/IEC 25010; it is not an argument for a universal automation architecture.[^iso25010] Modern automation tools also evolve, so teams should treat their documented upgrade and compatibility behavior as inputs to an evidence plan rather than assuming tool stability.[^playwright-release-notes]

## Common Misconceptions

### “Deleting checks reduces quality.”

Deletion can remove misleading, duplicated, or obsolete evidence. The decision should state the resulting evidence gap or replacement.

### “A central framework team should own every automation failure.”

Platform ownership and product-risk ownership differ. Centralizing all failures can detach evidence from the team able to act.

### “Governance means mandatory process.”

Useful governance makes decisions repeatable and visible. Bureaucracy that cannot improve a decision is not an engineering control.

### “A framework rewrite is the fastest path to maintainability.”

Incremental change usually preserves feedback and allows claims to be validated while the system evolves.

### “A quarantine makes a flaky check harmless.”

It creates or exposes an evidence gap and needs an owner, compensating control, and review point.

## Summary

Automation stays useful when teams manage it as an evolving evidence product. Lifecycle cost, automation debt, refactoring, deletion, health signals, ownership, review, and lightweight governance are not overhead around the “real” work; they are the work that keeps feedback trustworthy. Sustainable growth optimizes evidence value, not test volume.

## Key Takeaways

- Every automated check has product, dependency, state, execution, and maintenance cost.
- Automation debt includes stale evidence and unclear ownership as well as poor code.
- Retain, refactor, relocate, delete, quarantine, or investigate checks according to their evidence value and risk.
- Suite health is a collection of decision-supporting signals, not a universal KPI.
- Ownership should clarify response paths for failures, abstractions, data, dependencies, and cleanup.
- Lightweight governance enables contribution; bureaucracy and check-count targets undermine it.
- Incremental migration usually protects feedback better than a default big-bang rewrite.

## Review Questions

1. What distinguishes automation debt from ordinary technical debt?
2. When is it responsible to delete an automated check?
3. Which suite-health signals would you investigate before setting a target?
4. How can duplicate evidence be useful, and when is it wasteful?
5. What decisions should ownership make clear?
6. Why are framework rewrites risky for a feedback system?

## Interview Questions

1. How would you improve a large suite that teams no longer trust?
2. Describe how you would decide between refactoring, relocating, and deleting a browser check.
3. What lightweight automation governance would you introduce to a growing team?
4. How do you prevent temporary quarantines from becoming permanent?
5. How would you manage a shared automation helper used by several product teams?

## Practical Exercise

### Perform an Automation Sustainability Review

The following is an illustrative Atlas Commerce exercise. The Atlas suite has slow browser coverage, duplicated UI and API checks, 18 long-lived quarantines, unused page objects, a shared customer account, unclear ownership, and reports that show only a stack trace. A product flow for an old loyalty program is being removed.

Produce an **Automation Sustainability Improvement Plan**. For each relevant item, recommend one of: retain, refactor, relocate boundary, delete, quarantine temporarily, investigate, or assign ownership. Explain the evidence claim, cost, risk, compensating evidence, and next review point. Include a small set of suite-health signals and avoid numerical targets that you cannot justify.

## Further Reading

- [ISO/IEC 25010:2023 product quality model](https://www.iso.org/standard/78176.html)
- [Martin Fowler: Technical Debt Quadrant](https://martinfowler.com/bliki/TechnicalDebtQuadrant.html)
- [Playwright: Release notes](https://playwright.dev/docs/release-notes)
- [Part II, Chapter 9 — Maintainable Code and Refactoring](../../part-02-programming/chapters/chapter-09-maintainable-code-and-refactoring.md)

## References

[^iso25010]: ISO. [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html). Accessed 2026-08-10.
[^playwright-release-notes]: Microsoft. [Playwright Release Notes](https://playwright.dev/docs/release-notes). Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] identify lifecycle cost and automation debt in a feedback portfolio;
- [ ] justify retaining, changing, or deleting automation evidence;
- [ ] select useful suite-health signals without treating them as universal targets;
- [ ] define lightweight ownership and governance decisions; and
- [ ] explain how a sustainable suite evolves with product risk.

**Next:** [Chapter 11 — Specialized Automation Evidence: Visual, Accessibility, Cross-Browser, and Mobile](chapter-11-specialized-automation-evidence-visual-accessibility-cross-browser-and-mobile.md)
