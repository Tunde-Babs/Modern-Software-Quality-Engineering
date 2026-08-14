# Chapter 5 — Architectural Styles and Decomposition Trade-offs

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 5 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–4 |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A style name compresses a solution together with the context that made it work. Invoking the name imports the solution. It does not import the context, and it does not check whether yours matches.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

Atlas has a problem that everyone agrees on and nobody has stated precisely. Changing anything in fulfilment requires a checkout release. The fulfilment module and the checkout module sit in the same deployment artefact, share the `orders` table, and call each other directly. A small change to how partial shipments are grouped took three weeks, most of which was spent coordinating a release window with a checkout change that had nothing to do with it.

A proposal document circulates. Its opening line is: *"Move Atlas to microservices to reduce coupling and improve scalability."* It contains a target diagram with nine services, a migration timeline, and a slide comparing "monolith" and "microservices" in two columns, in which the microservices column is uniformly better.

The document is not stupid. The pain it describes is real, measured, and expensive. But it does three things that Part XI treats as errors.

It names a destination rather than a decision. "Move to microservices" is not an option that can be evaluated; it is nine or more separate boundary decisions bundled into one word, each with its own cost profile.

It attributes the benefit to the style rather than to the boundary. The specific pain is *deployment coupling* between checkout and fulfilment. That coupling can be attacked by separating the deployment unit, by separating the process, by separating the store, by introducing an asynchronous boundary, or by simply enforcing a module boundary that already exists on paper. Only some of those are "microservices," and the cheapest of them is not.

And it compares against a caricature. The two-column slide compares a well-run microservices system with a badly-run monolith. The comparison that matters is between a *well-run* version of each, in Atlas's actual context: four engineers, no second store in operation, no broker in operation, and a promotion in eight weeks.

## Why This Chapter Matters

Chapters 2–4 built the analytical vocabulary: boundaries, coupling, interaction, and state. This chapter uses it to do the thing teams actually argue about — which structural shape the system should take.

The argument goes badly for a predictable reason. Style names are compressions. "Microservices," "event-driven," "layered," and "serverless" each bundle a set of structural decisions, an operating model, a set of assumptions about team size and platform maturity, and a set of failure modes. When someone says the name, all of that travels with it implicitly, and the parts that do not fit the current context travel silently.

This chapter therefore refuses to be a style catalogue. A catalogue invites selection, and selection from a catalogue is exactly the failure mode. Instead it treats each style as a **trade-off set**: a statement of what the shape optimises, what it costs, and the conditions under which the trade is favourable. The purpose is to let a Quality Engineer ask, of any proposal: *which specific coupling is this attacking, what does it add, and what evidence would tell us whether the trade is good here?*

The chapter does not advocate microservices, cloud topology design, domain-driven design, a serverless platform, or a pattern catalogue. It supplies the option set that Chapters 6–12 assess against quality scenarios, capability needs, evidence, and migration paths.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why a style name is not evidence of quality and what it does and does not establish;
- describe modular-monolith, layered, client/server, service-oriented, microservices, event-driven, message-based, pipeline, and serverless approaches as trade-off sets rather than rankings;
- separate a decomposition decision into its component boundary decisions and evaluate each;
- reason about autonomy and operational complexity as costs that scale with the number of independently operated units;
- reject five common style slogans with specific reasoning rather than contrarianism;
- assess a co-change measurement and state why correct arithmetic does not establish that a decomposition will help; and
- produce an Architectural Style and Decomposition Trade-off Assessment that includes, for each option, a reason not to choose it now.

## What a Style Name Does and Does Not Establish

An **architectural style** is a recurring structural arrangement together with the constraints that give it its properties. Layered architecture constrains dependency direction. Microservices constrain deployment and data boundaries. Event-driven architecture constrains how components learn about change.

Naming a style establishes three things, all useful:

- **Shared vocabulary.** "This is a pipeline" tells a colleague a great deal quickly.
- **Known failure modes.** Styles come with a literature of what goes wrong, which is genuinely valuable prior knowledge.
- **A starting constraint set.** The constraints are the point; a style without its constraints is just an arrangement.

Naming a style establishes none of the following:

- that the constraints are actually enforced in your system;
- that your context resembles the context where the style's benefits were observed;
- that the benefit you want is the benefit the style delivers;
- that you can operate it; or
- that the resulting quality outcome is better.

The last point is the one Chapter 1 already made in a different form. A style name is an element of an *architecture description*, and a description does not evidence the architecture. A system can be described as microservices and exhibit every coupling that a monolith has, plus network latency — this is common enough to have earned its own derisive name in practitioner discussion.

## Styles as Trade-off Sets

The following survey is deliberately compressed. Each entry states what the shape optimises, what it costs, and a condition under which it is a poor fit. None is ranked, and several combine — a modular monolith can contain layers and publish events.

| Approach | What it optimises | What it costs | Poor fit when |
| --- | --- | --- | --- |
| **Modular monolith** | Transactional simplicity, one-join evidence, single operational surface, cheap refactoring across module boundaries | Deployment coupling; module boundaries erode without enforcement; one failure surface | Teams need genuinely independent release cadence, or one module's resource profile starves others |
| **Layered** | Comprehensibility; constrained dependency direction; substitutable infrastructure | Change often cuts across layers, so a feature touches all of them; layers can become ceremony | The dominant change axis is a feature, not a technical concern — then layers fragment every change |
| **Client/server** | Clear trust boundary; independent client evolution; server-side authority | Client and server versions coexist indefinitely; every contract change is a compatibility problem | Clients cannot be updated on any known schedule and the contract must change |
| **Service-oriented** | Reusable capabilities behind explicit contracts; organisational alignment | Contract governance overhead; shared middleware becomes a bottleneck and a single failure point | Nobody owns contract governance, or "reuse" is asserted rather than demonstrated |
| **Microservices** | Independent deployment and scaling; failure isolation; small autonomous ownership | Network latency and partial failure everywhere; distributed state; N operational surfaces; cross-service change becomes a coordination problem | Team count is small, platform maturity is low, or the dominant changes span services anyway |
| **Event-driven** | Removal of temporal coupling; unknown-consumer extensibility; load absorption | Ordering, duplication, delayed visibility (Chapters 3–4); "who acted on this?" becomes hard | The publisher actually requires a specific consumer to act — that is a command, not an event |
| **Message-based (queues, commands)** | Backpressure absorption; retry and recovery; work distribution | Backlog outlasts the event; in-flight state must be modelled; delivery semantics must be handled | The outcome must be reported synchronously and truthfully to a waiting user |
| **Pipeline** | Composable stages; clear data flow; independently replaceable steps | Whole-pipeline latency is the sum of stages; partial failure mid-pipeline needs an explicit position and restart model | Stages need to interact rather than hand off, or a stage needs to reverse an earlier one |
| **Serverless (managed execution)** | No instance management; scale-to-zero; per-invocation cost | Cold-start latency; execution-duration and state limits; strong platform coupling; local reproduction is harder | Long-running or stateful work, tight latency budgets, or where the ability to move between execution platforms matters |

Two observations about how to read this table.

**Styles are not exclusive.** Atlas today is a modular monolith with a layered internal structure, a client/server boundary at the API edge, and a message-based fulfilment path. Adding one more asynchronous boundary does not make it "event-driven"; it makes it a modular monolith with two asynchronous boundaries. Insisting that a system *be* one style is usually a description problem masquerading as a design problem.

**The cost column scales differently from the benefit column.** Most benefits in this table are per-boundary: separating one thing gives you that thing's independence. Most costs are per-unit and cumulative: each independently deployed unit adds a build, a deploy path, a monitoring surface, an on-call consideration, a dependency version matrix, and a place for configuration to drift. That asymmetry — linear benefit, superlinear coordination cost — is the single most important thing to understand about decomposition, and it is why the right number of services is a function of team capacity, not of domain elegance.

## Decomposition Is Several Decisions, Not One

"Should we extract fulfilment?" bundles at least six separable decisions. Unbundling them is the most useful move available, because they have different costs and can be taken at different times.

| Sub-decision | Question | Can be taken independently? |
| --- | --- | --- |
| Module boundary | Does fulfilment have an enforced internal interface? | Yes — cheapest, and a prerequisite for the rest |
| Deployment boundary | Does fulfilment ship separately? | Yes, without splitting the store |
| Process boundary | Does fulfilment run in its own process? | Usually follows deployment |
| Data boundary | Does fulfilment own its own store? | Yes, and this is the expensive one |
| Communication boundary | Is the interaction synchronous or asynchronous? | Yes, independently of all the above |
| Ownership boundary | Does a different team own it? | Organisational, not technical (Part XII) |

The unbundling has direct consequences. Atlas's stated pain is deployment coupling. That is sub-decision two. It does not require sub-decision four, which is where most of the cost and nearly all of the risk lives (Chapter 4). A proposal that bundles them should be asked why.

**Autonomy** is the property this is all aimed at: a unit is autonomous to the degree it can change, deploy, fail, and scale without coordinating. It is not binary and it is not free. Every increment of autonomy is bought with an explicit contract, a compatibility obligation, and an operational surface. A useful diagnostic question for any proposal: *autonomy from what, for whom, and at what coordination cost?*

## Five Slogans, and Why Each Fails

### "Microservices scale better."

Scale *what*, against *which* constraint? Microservices allow independent scaling of units, which helps when one component's resource demand differs sharply from another's — Atlas catalogue search versus checkout, for example. They do not make code faster; they add network hops to paths that previously had none (Chapter 3, Example 1). If the binding constraint is a single database or a third-party dependency, splitting the compute layer moves the queue without removing it. The claim is meaningful only when it names the workload, the unit, and the constraint.

### "Monoliths are bad."

A modular monolith with enforced boundaries, one store, and one operational surface is the correct answer for a large number of systems, and it is very often the correct answer for a four-engineer team. What is bad is a *ball of mud* — a system with no enforced internal boundaries — and that is a property of boundary enforcement, not of deployment topology. A distributed ball of mud is strictly worse than a local one, because its coupling now also has latency and partial failure.

### "Event-driven means loosely coupled."

Event-driven removes *temporal* coupling. It typically leaves **contract** coupling fully intact — the event schema is a contract with every consumer, including the ones you have forgotten (Chapter 2) — and it adds ordering, duplication, and delayed-visibility concerns (Chapters 3–4). It can also create a subtler coupling: when a publisher must know that some consumer will act, the "event" is a command with the accountability removed, and the coupling is now invisible as well as present.

### "Serverless means no operations."

It means no *instance* operations. Cold starts, concurrency limits, execution-duration ceilings, retry semantics, per-invocation cost behaviour, observability into a short-lived execution context, and local reproducibility all remain operational concerns, and several of them are harder rather than easier. The operational work is relocated and changed in kind, not removed.

### "Independent deployment means independent change."

This is the most consequential of the five, because it is the one most often assumed rather than checked. A unit is independently deployable if it can ship on its own. It supports independent *change* only if a typical change is confined to it. If adding a field to Atlas's order lifecycle requires a coordinated change to checkout, fulfilment, notification, and the support console, then splitting those into four services has not reduced coordination — it has converted an in-repository change into a four-team, four-release, ordered rollout with compatibility windows. Deployment independence without change independence is a cost with no matching benefit, and it is a common outcome when boundaries are drawn along technical rather than change lines.

## Numerical Reasoning: Measuring Change Coupling

The following is a **bounded, synthetic worked example**. It also demonstrates a case where correct arithmetic does not establish the architectural conclusion it appears to support.

| Field | Entry |
| --- | --- |
| Context | Atlas wants to know whether checkout and fulfilment are genuinely change-coupled, or whether the perception comes from a few memorable incidents. |
| Population and boundary | The last 60 merged changes to the Atlas deployment artefact, over a synthetic six-month window. A change "touches" a module if it modifies a file within that module's directory. |
| Assumptions | Directory membership correctly represents module membership; the six-month window is representative; a merged change is the right unit of analysis; changes are of roughly comparable size. |
| Units | Counts of changes; percentages of the 60-change population. |
| Calculation | Changes touching both checkout and fulfilment = 22. Co-change rate = 22 ÷ 60 = **36.7%**. Of those 22, changes whose stated intent concerned fulfilment only = 14. Fulfilment-driven changes forced to touch checkout = 14 ÷ 60 = **23.3%** of all changes. |
| Interpretation | Better than an anecdote. Over a third of changes span both modules, and roughly a quarter of all changes are fulfilment work that has to disturb checkout. That is a real, quantified coordination cost and it justifies treating the boundary as a problem worth solving. |
| Limitation | **The arithmetic is correct; the architectural inference is not established by it.** Co-change is a symptom whose cause the count does not identify. If the 22 shared changes are shared because a *single feature genuinely spans both responsibilities* — partial shipment affects what a customer is charged and what is picked — then separating the modules does not reduce the coupling. It converts an in-repository co-change into a cross-boundary, cross-release, compatibility-managed co-change, which is more expensive. The count also cannot distinguish "these modules are wrongly divided" from "these modules are correctly divided but the boundary between them is badly specified." Directory membership is a proxy for module membership and may be wrong. And a co-change rate says nothing about whether the team can operate a second deployment unit. |
| Decision relevance | Justifies investigating **why** the 22 changes are shared — which is a different and cheaper piece of work than a decomposition. Does not justify a split, and specifically does not predict that a split reduces the 36.7%. |

The follow-up that the number earns is a read of those 22 changes: how many were one feature spanning two responsibilities, and how many were one responsibility forced through the other's code? Only the second category is reduced by a boundary change. If most of the 22 are in the first category, the correct conclusion may be that checkout and fulfilment are *less* separable than the team believes.

## Worked Reasoning: Three Options for Checkout–Fulfilment Change Coupling

Atlas's stated concern is that fulfilment changes require checkout releases. Three defensible options exist. Each is assessed on the same eleven dimensions, and each carries an explicit **reason not to choose it now**.

### Option A — Strengthen the modular-monolith boundary

Define an explicit internal interface for fulfilment, forbid direct cross-module calls and direct table access from checkout, and enforce both with a build-time dependency check. One artefact, one store, one deployment.

| Dimension | Consequence |
| --- | --- |
| Boundary | Module boundary enforced for the first time. Deployment, process, data, and ownership boundaries unchanged. |
| Contract | An internal interface becomes explicit and reviewable. It is not versioned, because both sides always ship together — which is a genuine simplification, not a shortcut. |
| State | Unchanged: shared store, transactional invariants still enforceable in one place (Chapter 4). |
| Deployment | **The stated pain is not removed.** Fulfilment still ships with checkout. |
| Failure | Unchanged. One failure surface; contention between modules persists. |
| Testability | Improves materially. An enforced interface is a substitution seam; fulfilment becomes testable against a stubbed checkout and vice versa. |
| Observability / operability | Largely unchanged; one operational surface, which is an advantage at this team size. |
| Security | Unchanged. Trust boundary still at the API edge. |
| Performance | Unchanged — in-process calls, no added network hops. |
| Migration cost | Lowest. Days to weeks, no data migration, no new infrastructure. |
| Evidence required | The co-change read described above; a dependency-direction check; confirmation that no consumer outside the module reads fulfilment tables (Chapter 2's consumer inventory). |
| **Reason not to choose it now** | It does not solve the problem the team actually reported. If release coordination is genuinely the dominant cost, Option A improves testability and defers the real question. |

### Option B — Extract fulfilment as a separately deployed unit, shared store retained

Fulfilment becomes its own deployment artefact and process, communicating with checkout over an explicit contract, while continuing to use the same relational store.

| Dimension | Consequence |
| --- | --- |
| Boundary | Deployment and process boundaries created. **Data boundary deliberately not created** — this is the load-bearing choice. |
| Contract | A versioned interface is now required, with compatibility obligations, because the two sides can ship at different times. |
| State | Shared store retained: cross-entity invariants remain enforceable transactionally, and Chapter 4's contradiction class is avoided. The data coupling from Chapter 2 remains and is now *across* a deployment boundary, which makes schema change harder than it is today. |
| Deployment | Solves the stated pain: fulfilment ships independently. |
| Failure | Partial isolation. A fulfilment crash no longer takes checkout down. Store faults still affect both. New failure mode: version skew between the two units. |
| Testability | Contract becomes assertable. Genuine cross-process integration testing is now required, and the version-combination matrix is new work. |
| Observability / operability | Second deployment unit: second build, deploy path, log stream, alert set, and on-call consideration. Correlation identifiers (Chapter 4) become mandatory rather than advisable. |
| Security | A new internal network boundary. Service-to-service authentication is now a decision that did not previously exist. |
| Performance | In-process calls become network calls: added latency and a new partial-failure mode on a previously reliable path (Chapter 3). |
| Migration cost | Moderate. No data migration. Deployment pipeline, service identity, and contract versioning are new. |
| Evidence required | A prototype of the extracted deployment path; measurement of the added latency on the checkout→fulfilment call; confirmation the team can operate a second unit; the consumer inventory. |
| **Reason not to choose it now** | It creates a versioned contract and a second operational surface for a four-engineer team eight weeks before a promotion, and it does so while retaining the shared-store coupling that caused the Chapter 2 incident. It solves release coordination and buys a version matrix. |

### Option C — Introduce an asynchronous process boundary

Checkout publishes an order-ready fact; fulfilment consumes it. The synchronous call between them is removed entirely.

| Dimension | Consequence |
| --- | --- |
| Boundary | Communication boundary changes from synchronous to asynchronous. Deployment boundary may or may not change — this is independent (see the unbundling table). |
| Contract | An event contract with a schema, a version, and — critically — unknown future consumers (Chapter 2). Harder to change than a point-to-point interface, not easier. |
| State | Chapter 4 applies in full: partial-completion states between publish and consume, deduplication keyed on the business operation, ordering assumptions, and a reconciliation path for the case where the event is published but never processed. |
| Deployment | Publisher and consumer can deploy independently **if** the contract holds. |
| Failure | Best isolation of the three: fulfilment downtime becomes backlog rather than checkout failure. New failure modes: broker unavailability, duplicate delivery, out-of-order arrival, and backlog that outlasts the incident (Chapter 3, Example 4). |
| Testability | Asynchronous flows are harder to test deterministically. Requires a controllable seam for delivery timing, duplication, and ordering — an architecture requirement, developed in Chapter 7. |
| Observability / operability | Highest new burden. Backlog depth, consumer lag, dead-letter handling, and duplicate rate all become signals someone must watch. Atlas operates no broker today. |
| Security | Event payload contents become a data-exposure question, because an event may be readable by consumers not yet identified. |
| Performance | Checkout latency improves — it no longer waits for fulfilment. End-to-end time to a fulfilled order may increase. |
| Migration cost | Highest of the three. New infrastructure the team has never operated, plus the Chapter 4 state work. |
| Evidence required | A bounded prototype of the outbox or equivalent dual-write response (Chapter 4); a duplicate- and ordering-behaviour experiment; evidence the team can operate a broker; the consumer inventory. |
| **Reason not to choose it now** | It introduces an unfamiliar failure class and an unoperated piece of infrastructure immediately before a promotion. It is also the option most likely to be adopted for the wrong reason — because "event-driven" sounds like decoupling — when the coupling it removes is temporal and the coupling causing Atlas's pain is deployment. |

### The decision record

| Element | Entry |
| --- | --- |
| Context | 36.7% of changes touch both modules; 23.3% are fulfilment work forced through checkout. Four engineers; one store; no broker; promotion in eight weeks. |
| Quality claim | A change confined to fulfilment responsibility can be released without coordinating a checkout release. |
| Characteristic | Maintainability, with a flexibility component. |
| Constraint | Team size; no second store or broker operated; promotion window; the Chapter 2 consumer inventory is still incomplete. |
| Assumption | The 22 co-changes are predominantly fulfilment work forced through checkout, rather than single features genuinely spanning both. **Unverified, and it decides the whole question.** |
| Trade-off | A improves testability and defers the stated problem. B solves it and buys a version matrix and a second operational surface. C solves it, adds the best failure isolation, and adds an unfamiliar failure class. |
| Failure mode | A: the enforcement is bypassed under pressure. B: version skew produces a defect nobody can reproduce locally. C: duplicate or lost events during the promotion, debugged by a team operating a broker for the first time. |
| Evidence needed | The read of the 22 changes; the consumer inventory; for B or C, a bounded prototype and honest assessment of operational capacity. |
| Limitation | No evidence available before the decision can establish the operational cost of a second unit or a broker for this team. |
| Decision | Not made here. The reading of the 22 changes is a two-day piece of work that all three options depend on and that could invalidate the premise of two of them. It should happen first. |
| Owner | Order-domain owner for the boundary decision; platform owner for any new operational surface; delivery owner for the promotion-window constraint. |
| Residual risk | If the co-change reading is skipped, Atlas may buy a distributed version of the same coupling. |
| Revision trigger | Completion of the co-change reading; a second team taking ownership of fulfilment; the promotion window closing; any change to team size. |

The pattern from Batch A holds. The strongest contribution is not choosing a style. It is identifying the cheap piece of evidence that could invalidate the premise, and noticing that Option A and Option B differ on a sub-decision (deployment) that the proposal document had welded to a different sub-decision (data) for no stated reason.

## The Architectural Style and Decomposition Trade-off Assessment

This chapter's professional artefact is the **Architectural Style and Decomposition Trade-off Assessment** — an MSQE teaching artefact, not a standard method. It is organised by **option**, and it has three rules.

**Rule 1: every option is unbundled.** State which of the six sub-decisions (module, deployment, process, data, communication, ownership) the option actually takes. An option that takes four sub-decisions at once must justify each.

**Rule 2: every option is assessed on the same eleven dimensions.** Boundary, contract, state, deployment, failure, testability, observability/operability, security, performance, migration cost, evidence required. Asymmetric assessment is how a preferred option wins without arguing.

**Rule 3: every option carries a reason not to choose it now.** This field is mandatory and it is the artefact's most valuable part. An option with no stated reason against it has not been analysed; it has been advocated. Writing this field for your own preferred option is the discipline the artefact exists to enforce.

A completed assessment also records what the options have in common. In the Atlas case, all three require the consumer inventory and none of them can be scoped without the co-change reading. Common prerequisites are frequently the only actionable output of a style comparison, and identifying them early is worth more than the comparison itself.

## Engineering Perspective

Two practical positions follow from this chapter.

**Attack the specific coupling, not the topology.** Chapter 2 distinguished contract, runtime, temporal, deployment, and data coupling. Each has a cheapest available remedy, and the cheapest remedy is rarely a style change. Deployment coupling is remedied by a deployment boundary. Temporal coupling is remedied by an asynchronous boundary. Data coupling is remedied by an owned contract — which may or may not require a separate store. Naming the coupling first prevents the common outcome of buying four remedies to fix one problem.

**Sequence by reversibility.** Among Atlas's three options, A is reversible in an afternoon, B in a sprint, and C substantially less so once consumers depend on the event contract. Where evidence is weak, taking the reversible step first is not timidity; it is buying information cheaply. Chapter 10 develops this into a migration discipline, and Chapter 9 into an evidence-proportionality argument.

A note on team size, because it is the constraint most often omitted from style discussions. The coordination cost of independently operated units scales with the number of units, while the benefit accrues per boundary. For a four-engineer team, the number of independently operated units that can be run well is small, and exceeding it degrades every quality characteristic simultaneously — not because the architecture is wrong in the abstract, but because nobody has time to operate it.

## Industry Perspective

The microservices literature is unusually explicit about its own preconditions, and the preconditions are routinely dropped when the style is invoked. Dragoni and colleagues survey the approach and situate it as an evolution of service-oriented ideas with specific costs in distribution, consistency, and operational complexity, rather than as a general improvement.[^dragoni] Practitioner guidance from the same period is equally explicit that the approach carries a prerequisite in deployment automation, monitoring, and team structure, and Fowler's widely cited "MonolithFirst" position argues that starting with a monolith and extracting later is frequently the better sequence precisely because boundaries are hard to identify in advance.[^fowler-microservices][^fowler-monolithfirst]

These are practitioner sources, not standards, and Part XI treats them as such: useful, attributable, contested, and bounded by the contexts their authors observed. The point of citing them is not that they settle the question. It is that even the advocacy literature states preconditions that proposal documents routinely omit.

## Common Misconceptions and Pitfalls

### "We need to pick a style."

Systems are usually several styles at once, and the question is which boundary to change, not which label to adopt. "What style are we?" is a description question; "which coupling is costing us?" is a design question.

### "The target diagram shows the benefit."

A target diagram shows an intended structure. It cannot show operational cost, version-matrix growth, cross-boundary change frequency, or whether the team can run it. Chapter 1's distinction applies directly: the diagram is architecture description.

### "We'll get the benefits and manage the costs."

The costs of decomposition are not managed by intention; they are paid by capacity. The honest form of this sentence names who will do the operating and what they will stop doing instead.

### "Extraction is reversible."

Technically, sometimes. Once other teams, consumers, or partners depend on the extracted unit's contract, reversal is a coordination problem rather than a code change. Chapter 10 treats reversibility honestly.

### "Our services are independent."

Check the change record, not the diagram. If a typical feature touches four services, they are independently deployable and not independently changeable, which is the expensive half of the trade without the valuable half.

## QA → QE Transition

The transition in this chapter is from associating quality with a named style to asking how a structural choice changes coupling, communication, state, deployment, failure, testing, observability, security, performance, and evolution.

A QA Engineer handed the microservices proposal would ask how the new services will be tested, and would be right to ask. A Quality Engineer asks a prior set of questions: which specific coupling is this attacking; which sub-decisions has the proposal bundled and why; what would the co-change record show; what does each option make harder to test, observe, and recover; what evidence exists that the team can operate the result; what is the reason not to choose each option now; and who owns the decision. Neither engineer decides the architecture. The second one changes what the decision is made from.

## Summary

A style name compresses a solution and its context, and only the solution travels when the name is invoked. Styles are best read as trade-off sets — what is optimised, what it costs, when it is a poor fit — rather than as a catalogue to select from. Decomposition is not one decision but six separable ones, and bundling them hides the fact that the cheapest sub-decision often addresses the stated pain. Benefits of decomposition accrue per boundary while costs accrue per operated unit, which makes team capacity a first-class architectural constraint. Five common slogans fail under examination, of which "independent deployment means independent change" fails most expensively. A measured co-change rate is real evidence of a coordination cost and is not evidence that a decomposition will reduce it.

## Key Takeaways

- A style name establishes vocabulary, known failure modes, and a constraint set — not that your context matches or that the constraints are enforced.
- Systems are usually several styles at once; insisting on one label is a description problem posing as a design problem.
- Unbundle decomposition into module, deployment, process, data, communication, and ownership decisions; each has a different cost.
- Decomposition benefits accrue per boundary; costs accrue per independently operated unit.
- Event-driven removes temporal coupling and leaves contract coupling fully intact.
- Independent deployment delivers value only when a typical change is confined to the unit.
- A co-change measurement identifies a cost, not its cause, and does not predict that a split reduces it.
- Every option in a trade-off assessment needs a stated reason not to choose it now.

## Review Questions

1. What does naming an architectural style establish, and what does it not?
2. Atlas's pain is deployment coupling. Which of the six sub-decisions addresses it, and which does the microservices proposal bundle with it unnecessarily?
3. Why is "independent deployment means independent change" the most expensive of the five slogans to believe?
4. The co-change rate is 36.7% and the arithmetic is correct. Explain precisely why this does not support a decomposition, and state the follow-up work it does support.
5. Why do decomposition costs scale differently from decomposition benefits, and what constraint does that make first-class?
6. Give an example of a system that is simultaneously three of the styles in the survey table.

## Interview Questions

1. A proposal says moving to microservices will reduce coupling. What do you ask first?
2. How would you determine whether two modules are genuinely change-coupled?
3. When would you recommend keeping a modular monolith, and what evidence would support that?
4. What does an asynchronous boundary make harder to test, and what would you need from the architecture to test it?

## Practical Exercise

Produce an **Architectural Style and Decomposition Trade-off Assessment** for the following synthetic Atlas Commerce situation.

*Atlas catalogue search is slow during promotions and is the most frequently changed area of the system: pricing rules, merchandising, and search ranking all change weekly and all touch it. Search shares the relational store with catalogue and reads product, price, and inventory tables directly. A proposal suggests extracting search into its own service with its own read-optimised store, populated by events from catalogue. A second suggestion is to add a cache. A third is to enforce a module boundary and leave the structure alone.*

Your assessment must:

- unbundle each of the three options into which of the six sub-decisions it takes, and flag any option that bundles sub-decisions without justification;
- assess all three on the same eleven dimensions — asymmetric assessment invalidates the artefact;
- give each option a **reason not to choose it now**, including your preferred one;
- identify at least one requirement that **all three** options share;
- state which coupling type each option actually attacks, using Chapter 2's vocabulary; and
- name one piece of evidence that could invalidate the premise of the whole comparison, and say how you would obtain it.

Then answer, in no more than 150 words: the cache option is the cheapest and addresses the stated performance pain. Explain why it may not address the *change* pain, and what that tells you about whether the team has stated one problem or two. Do not select a target architecture. Use synthetic data only.

## Further Reading

- [N. Dragoni et al. — Microservices: Yesterday, Today, and Tomorrow](https://doi.org/10.1007/978-3-319-67425-4_12) — peer-reviewed survey chapter.
- [J. Lewis and M. Fowler — Microservices](https://martinfowler.com/articles/microservices.html) — practitioner guidance, not a standard.
- [M. Fowler — MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html) — practitioner guidance; a contested position, presented as such.
- [ISO/IEC/IEEE 42010:2022 — Architecture description](https://www.iso.org/standard/74393.html)

## References

[^dragoni]: Dragoni, N., Giallorenzo, S., Lluch Lafuente, A., Mazzara, M., Montesi, F., Mustafin, R., and Safina, L. [Microservices: Yesterday, Today, and Tomorrow](https://doi.org/10.1007/978-3-319-67425-4_12). In *Present and Ulterior Software Engineering*, pp. 195–216. Springer International Publishing, 2017. Accessed 2026-08-14.
[^fowler-microservices]: Lewis, J. and Fowler, M. [Microservices: a definition of this new architectural term](https://martinfowler.com/articles/microservices.html). 2014. Practitioner guidance, not a standard. Accessed 2026-08-14.
[^fowler-monolithfirst]: Fowler, M. [MonolithFirst](https://martinfowler.com/bliki/MonolithFirst.html). 2015. Practitioner guidance, not a standard. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] State what a style name does and does not establish about a system's quality.
- [ ] Describe at least six approaches as trade-off sets rather than as ranked options.
- [ ] Unbundle a decomposition proposal into its component sub-decisions.
- [ ] Explain why decomposition costs scale with operated units while benefits accrue per boundary.
- [ ] Reject each of the five slogans with specific reasoning.
- [ ] Read a co-change measurement without inferring that a split will reduce it.
- [ ] Complete a trade-off assessment in which every option, including your preferred one, has a reason not to be chosen now.

## Chapter Navigation

Previous: [Chapter 4 — State Ownership, Consistency, and Transactional Boundaries](chapter-04-state-ownership-consistency-and-transactional-boundaries.md) · Next: [Chapter 6 — Quality Attributes, Constraints, and Trade-off Scenarios](chapter-06-quality-attributes-constraints-and-trade-off-scenarios.md)
