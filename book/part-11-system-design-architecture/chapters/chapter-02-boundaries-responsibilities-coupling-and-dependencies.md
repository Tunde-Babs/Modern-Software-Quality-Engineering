# Chapter 2 — Boundaries, Responsibilities, Coupling, and Dependencies

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 2 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapter 1; Part IV contract vocabulary and Part VI ownership/reconciliation concepts recommended |
| Estimated study time | 170 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A boundary is not where the diagram draws a line. It is wherever a change, a failure, a transaction, a deployment, or an authority actually stops — and those five rarely stop in the same place.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

An Atlas engineer changes one column. The `orders` table has a `status` column holding values like `PENDING`, `PAID`, and `SHIPPED`. To support partial fulfilment, the team adds two new values: `PARTIALLY_SHIPPED` and `AWAITING_RESTOCK`. The change is small, well-tested within the order-management module, and reviewed by the module's owners.

Within an hour of deployment, three things go wrong in places nobody consulted.

The notification module stops sending shipping emails for a subset of orders. It reads `orders.status` directly and has a `switch` statement that treats any unrecognised value as "no notification required." No error is raised; emails simply do not happen.

The support console shows a blank status field for affected orders, because it renders status through a lookup map that was never updated. Support agents begin telling customers that their orders "don't have a status," which is not a thing that should be sayable.

The nightly finance reconciliation job counts `PAID` orders to compute expected settlement. Orders that moved to `PARTIALLY_SHIPPED` are still paid, but the job's query filters on a status list that predates the change. The settlement figure is understated by an amount nobody notices for four days.

Ask where the boundary of the order-management module is, and you will get three different answers depending on which question you mean. Its **code** boundary is clear: one directory, one team, one set of tests. Its **data** boundary does not exist: four modules read its table. Its **contract** boundary is implicit and unversioned: the set of valid status values is a contract that was never written down, so it could not be versioned, deprecated, or negotiated. Its **failure** boundary turned out to include finance reporting.

Nobody made a bad decision here. Someone made a small decision inside a boundary that was smaller than they believed.

## Why This Chapter Matters

Chapter 1 established that architecture decisions constrain what a system can later do, be tested for, observed, and recovered from. This chapter supplies the structural vocabulary needed to say *where* those constraints live.

The core insight is that "boundary" is not one concept. Teams speak as though a service has *a* boundary, and then are repeatedly surprised when a change crosses one boundary while respecting another. Part XI distinguishes nine boundary types, because each has different quality consequences and each can be drawn in a different place in the same system.

This chapter also confronts the vocabulary of coupling, which is more abused than almost any other term in software. "Low coupling" is invoked as a universal good, "shared database" as a universal evil, and "microservices" as a mechanism that produces the former and eliminates the latter. None of these is reliable. Coupling is not a scalar to be minimised; it is a set of distinguishable relationships, each with a cost profile, and some of them are worth paying for.

Chapter 2 stays out of adjacent curricula. It does not teach C4 or UML notation, enterprise-architecture taxonomies, database normalisation, or contract-test implementation. It does not mandate service extraction. It establishes the structural vocabulary that Chapters 3–12 depend on.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish nine boundary types in a system and explain what each one determines;
- identify where two boundaries diverge and state the quality consequence of the divergence;
- describe responsibility and cohesion without reducing them to file organisation;
- distinguish contract, runtime, temporal, deployment, and data coupling, and state the different cost each imposes;
- reason about dependency direction, stable and volatile dependencies, and cycles without applying universal rules;
- compare a shared-table dependency with a versioned contract boundary on testability, failure propagation, deployment, state, trust, ownership, and evidence, without declaring either universally correct; and
- produce a Boundary, Responsibility, and Dependency Map for a synthetic Atlas Commerce situation.

## Nine Boundaries, Not One

A **boundary** is a line across which something stops. What stops determines which boundary you are talking about. Part XI uses nine types. They are a teaching taxonomy, not a standard, and their value is entirely in the divergences they expose.

| Boundary | What stops at it | Typical Atlas example |
| --- | --- | --- |
| **System** | The scope of the claim or system under consideration. | "Atlas checkout" including the payment adapter but excluding the provider's internals. |
| **Service / component** | A unit of code with a named responsibility and an interface. | The `notification` module. |
| **Process** | A unit of execution; an in-process call becomes a network call. | The asynchronous fulfilment worker runs in its own process; order management does not. |
| **Data** | Who may read and write a store directly. | Currently nothing stops at `orders` — four modules read it. |
| **Trust** | Where an assertion must be re-verified rather than assumed. | The API edge; the third-party payment provider; the support console's elevated role. |
| **Deployment** | What must be released together. | Checkout and order management ship as one artefact; the worker ships separately. |
| **Ownership** | Who is accountable for a change, an incident, and an on-call page. | The payments team owns the adapter; the platform team owns the queue. |
| **Failure** | Where a fault stops propagating. | A slow payment provider currently propagates all the way to the customer's browser. |
| **Transactional** | What commits or rolls back atomically. | Order row and payment row commit together; the outbound notification does not. |

The single most useful analytical move in this chapter is to draw two of these on the same system and look at where they differ.

### Where boundaries diverge

In the opening story, the service boundary and the data boundary diverge: order management is one component but four components read its store. That divergence is precisely what turned a local change into three remote failures.

Common divergences and what each produces:

| Divergence | Consequence |
| --- | --- |
| Service ≠ data | A "local" change has non-local effects. Ownership of the data's meaning is unclear. |
| Service ≠ deployment | Components can be reasoned about separately but cannot be released separately; independent-deployability claims are false. |
| Ownership ≠ failure | A team is paged for failures originating in code they do not own and cannot fix. |
| Transactional ≠ service | A business operation spans two commits; a partial-completion state exists and must be handled (Chapter 4). |
| Trust ≠ process | An in-process call carries an authorisation assumption that was only verified at the edge. |
| Failure ≠ system | The claim boundary excludes a dependency whose degradation determines the outcome. |

None of these divergences is inherently wrong. Every real system has several. The failure is not having them; it is not knowing you have them. An unrecorded divergence is an assumption nobody can challenge.

### Boundaries and evidence

Each boundary determines what evidence is obtainable. A process boundary makes an interaction observable on a network and injectable in a test; an in-process call is neither, without instrumentation. A data boundary determines whether you can assert on a store's state without reaching into someone else's implementation. A deployment boundary determines whether you can test a version combination that will actually exist in production. A failure boundary determines whether you can simulate a fault without taking down everything downstream of it.

This is why Chapter 7 treats testability and observability as architecture concerns rather than testing concerns. The boundaries chosen here decide what can be evidenced later.

## Responsibility and Cohesion

A **responsibility** is a reason for a component to change. This framing — rather than "what the component does" — is what makes it useful, because it connects structure to the thing that actually costs money: change.

**Cohesion** describes whether the things inside a boundary belong together, judged by whether they change together. High cohesion means most changes touch one component. Low cohesion means a typical change is scattered across several, or that a single component absorbs changes driven by unrelated concerns.

The practical test is not aesthetic. Take the last twenty changes to the system and ask, for each, how many components it touched. If pricing changes reliably touch catalogue, checkout, order management, and reporting, those four have low cohesion with respect to pricing — regardless of how tidy the directory structure looks.

Atlas's notification module illustrates the opposite failure. It is highly cohesive in code — one thing, one team, sends messages. But its *reason to change* includes every state model it observes. When order management adds a status, notification must change. It is cohesive by function and incohesive by change driver, which is why the opening story happened.

The classic articulation of the underlying principle is Parnas's argument that modules should be decomposed around the decisions they hide rather than around processing steps.[^parnas] The point survives translation to services: a boundary is valuable when it hides a decision that is likely to change, and weak when it exposes one.

## Coupling Is Not a Scalar

**Coupling** is the degree to which one element's correctness, behaviour, or ability to change depends on another. The mistake is treating it as a single quantity to be minimised. Part XI distinguishes five kinds, because they have genuinely different costs.

| Coupling type | What it means | What it costs | When it is worth paying |
| --- | --- | --- | --- |
| **Contract** | A depends on B's interface shape and semantics. | Changes to B's contract require coordination or versioning. | Almost always — this is the coupling you *want*, because it is explicit and negotiable. |
| **Runtime** | A cannot complete its work unless B responds. | B's availability becomes A's availability; B's latency becomes A's latency. | When the outcome genuinely requires B's answer before proceeding (Chapter 3). |
| **Temporal** | A and B must be available at the same moment. | Removes the ability to absorb B's downtime; forces synchronous design. | When the user outcome cannot be truthfully reported without a synchronous answer. |
| **Deployment** | A and B must be released together. | Eliminates independent release; enlarges the blast radius of every change. | When the versioning cost of independence exceeds its benefit — often true for small teams. |
| **Data** | A reads or writes B's store directly. | B's internal representation becomes A's contract, without anyone agreeing to it. | Rarely, and then only with an explicit, recorded agreement about what is stable. |

Two observations follow that contradict common slogans.

**Contract coupling is good coupling.** Reducing it is usually the wrong goal. A well-defined, versioned interface is a coupling you can see, negotiate, deprecate, and test. The failure in the opening story was not too much coupling — it was *data* coupling masquerading as no coupling, because nobody had written the contract down.

**Removing one coupling usually adds another.** Replacing a direct call with a message removes temporal coupling and adds ordering, duplicate-delivery, and eventual-consistency concerns (Chapters 3 and 4). Replacing a shared table with an API removes data coupling and adds runtime and contract coupling. The question is never "how do we reduce coupling?" but "which coupling do we prefer to hold, given this constraint and this failure mode?"

### Slogans this chapter rejects

**"Low coupling is always good."** Coupling is what makes a system a system rather than a pile of programs. Some couplings are unavoidable and some are desirable. The useful question is which kind, where, and at what cost.

**"A shared database is always bad."** A shared store inside a single ownership boundary, with one team accountable for the schema's meaning, is often the simplest correct answer. It becomes dangerous when the data boundary diverges from the ownership boundary — when the schema is a contract with parties who were never told they had one. That is a boundary problem, not a database problem.

**"Microservices create loose coupling."** Process boundaries convert in-process coupling into network coupling. They can reduce deployment coupling. They frequently *increase* runtime and temporal coupling, because a call that used to be a function invocation now has latency, partial failure, and an availability dependency. Whether the trade is favourable depends on which coupling was hurting you.

## Dependency Direction, Stability, and Cycles

A **dependency** is directional: if A depends on B, changes to B can force changes to A, and B's failures can affect A.

**Direction matters more than count.** A component with many dependents is expensive to change; a component with many dependencies is fragile. The useful design instinct is that things which change often should depend on things which change rarely, and not the reverse. Atlas's notification module depends on order management's status vocabulary — which changes with every new fulfilment feature. The direction is wrong for the change profile, and the opening story is the consequence.

**Stable and volatile dependencies.** A **stable** dependency changes rarely and is depended on widely; a **volatile** one changes often. Depending on something volatile means inheriting its change rate. When Atlas's promotions module depends directly on the catalogue's internal product representation, every catalogue refactor becomes a promotions change. The mitigation is not to eliminate the dependency but to depend on a narrower, more stable thing — an explicit interface that exposes only what promotions needs and is committed to remain stable.

**Cycles.** A dependency cycle exists when A depends on B and B depends, directly or transitively, on A. Cycles are worth identifying because they collapse boundaries: two components in a cycle cannot be changed, tested, deployed, or reasoned about independently, regardless of how they are organised in the repository. They also tend to make failures circular, so a fault in either propagates to both.

Cycles are not always defects requiring immediate repair. A cycle between two modules that are owned by one team, deployed together, and expected to change together may be a reasonable acknowledgement that they are really one thing. A cycle that crosses an ownership boundary or a deployment boundary is more serious, because it makes a claimed independence false.

**Evidence note.** Dependency direction and cycles are among the few architecture properties with cheap, repeatable evidence: static analysis of imports, call graphs, or build dependencies produces a real answer in minutes. This is the raw material for the architecture fitness functions Chapter 9 introduces. It is also strictly evidence about *static* structure — it says nothing about runtime coupling, temporal coupling, or whether the boundaries mean anything operationally.

## Worked Reasoning: Shared Table Versus Versioned Contract

Atlas must decide how the notification module obtains order state. The current design has notification reading `orders` directly. The proposed alternative is that order management publishes a versioned `OrderStateChanged` event, and notification consumes it.

Neither option is universally correct. The purpose of this analysis is to make the trade visible.

### Option A — Notification reads the `orders` table directly

| Dimension | Consequence |
| --- | --- |
| Testability | Notification can be tested by seeding rows, which is convenient and misleading: the test asserts against a representation that order management may change without notice. There is no artefact that expresses what notification is entitled to rely on. |
| Failure propagation | Store unavailability affects both modules identically. A slow query in notification consumes connections that order management needs — a failure boundary that does not exist. |
| Deployment | Order management cannot change the schema without a coordinated release. Deployment coupling exists but is not visible in either module's code. |
| State | Notification observes intermediate states, including states that exist only briefly during a transaction. It may act on a state the order never meaningfully occupied. |
| Trust / security | Notification holds credentials for the full `orders` table, including columns it has no business reading. The trust boundary is wider than the responsibility. |
| Ownership | Nobody owns the *meaning* of `status` as a cross-module contract, because no such contract is recorded. |
| Evidence | Cheap: schema inspection and static query analysis. Establishes structure, not agreement. |
| Cost | Zero to build. The cost arrives as coordination overhead and incidents. |

### Option B — Order management publishes a versioned `OrderStateChanged` event

| Dimension | Consequence |
| --- | --- |
| Testability | Notification can be tested against a contract artefact — a schema with a version. The test asserts against something order management has agreed to. Contract-check implementation belongs to Parts IV and V; Part XI's concern is that the artefact exists at all. |
| Failure propagation | Store faults no longer propagate directly. New failure modes appear: broker unavailability, delayed delivery, duplicate delivery, out-of-order arrival (Chapter 3). |
| Deployment | Order management can change internal schema freely while the event contract holds. A contract change now requires versioning and a deprecation path — real work that did not exist before. |
| State | Notification observes an intentional sequence of published states, not incidental intermediate ones. It does not observe state it was not told about, which may hide something it needed. |
| Trust / security | Notification receives only the fields on the event. Narrower trust boundary; new question about what belongs on an event that may be broadly readable. |
| Ownership | Order management explicitly owns the event contract, its versioning, and its deprecation. Ownership is now assignable. |
| Evidence | More expensive: contract checks, consumer inventory, delivery-behaviour experiments. |
| Cost | Substantial. Broker or outbox infrastructure, versioning discipline, duplicate handling, and operational surface. |

### Applying the reasoning model

| Element | Entry |
| --- | --- |
| Context | Four modules read `orders` directly; a small status change caused three remote failures including a four-day undetected finance error. |
| Quality claim | A change to order management's internal state representation can be made without silently altering the behaviour of another module. |
| Characteristic | Maintainability, with a compatibility component. |
| Constraint | No broker is currently operated. The team is four engineers. The promotion window is eight weeks away. |
| Option A | Keep the shared table; record the status vocabulary as an explicit, reviewed contract; add a compatibility check that fails a build when an unmapped status is introduced. |
| Option B | Publish a versioned event; migrate notification first, then support, then finance. |
| Assumption (A) | A recorded contract plus a build check changes behaviour without changing structure. **Unverified** — it depends on people respecting a check they can override. |
| Assumption (B) | The team can operate a broker reliably within the constraint window. **Unverified.** |
| Trade-off | A is cheap and preserves the divergence between data and ownership boundaries. B removes the divergence and adds delivery semantics the team has never operated. |
| Failure mode (A) | The check is bypassed under promotion pressure; the divergence recurs. |
| Failure mode (B) | Duplicate or out-of-order events produce incorrect notifications; the team debugs an unfamiliar failure class during the promotion. |
| Evidence needed | Consumer inventory of every reader of `orders` and every column read; change-frequency history for the status vocabulary; a bounded prototype of the outbox path if B is considered. |
| Limitation | Neither option's operational cost can be established before operating it. |
| Decision | Not made here. The evidence favours doing the consumer inventory first, because both options depend on it and neither can be scoped without it. |
| Owner | Order-management domain owner, with platform owner for any broker decision. |
| Residual risk | Finance's dependency is the least visible and the most consequential; it remains under-analysed. |
| Revision trigger | Any new consumer of `orders`; any change to the status vocabulary; the promotion window closing. |

Notice what the analysis produced: not a recommendation, but a **prerequisite**. The consumer inventory is cheap, is required by both options, and would have prevented the opening story. Identifying that is a better contribution than picking a side.

## The Boundary, Responsibility, and Dependency Map

The **Boundary, Responsibility, and Dependency Map** is this chapter's professional artefact. It is an MSQE teaching artefact, not a notation. It may be a table; it does not need to be a picture. Recall Chapter 1: it is an architecture *description*, and its accuracy is not evidence that the structure is sound.

A useful map has four parts.

**1. Components and responsibilities.** For each component: its name, its reason to change, and its accountable owner role. If you cannot state a reason to change that is different from its neighbour's, the boundary may not be real.

**2. The boundary grid.** For each component, where each of the nine boundaries falls — and explicitly, where two diverge.

| Component | Data boundary | Deployment boundary | Ownership | Divergence to flag |
| --- | --- | --- | --- | --- |
| Order management | `orders`, `order_lines` — **also read by 3 others** | Ships with checkout | Order domain | Data ≠ ownership: schema is an unrecorded contract |
| Notification | None of its own | Ships with checkout | Platform | Ownership ≠ failure: platform is paged for order-domain vocabulary changes |
| Fulfilment worker | `fulfilment_jobs` | Independent | Fulfilment domain | Transactional ≠ service: job creation is not atomic with order commit |

**3. The dependency list.** For each dependency: direction, coupling types present, whether the target is stable or volatile, and whether it participates in a cycle.

| From | To | Coupling types | Target volatility | In cycle? |
| --- | --- | --- | --- | --- |
| Notification | `orders` table | Data, deployment | Volatile — changes with each fulfilment feature | No |
| Checkout | Payment adapter | Contract, runtime, temporal | Stable interface, volatile behaviour | No |
| Finance job | `orders` table | Data | Volatile | No |

**4. The consequence column.** For each flagged divergence or high-cost dependency: what quality consequence follows, and what evidence would confirm or refute it. Without this, the map is inventory. With it, the map is analysis.

Two rules keep the map honest. State what you do not know — "unknown whether the analytics pipeline reads this table" is a finding, not a gap to be quietly left blank. And record the date and the source of each fact, because a map's currency is exactly as suspect as any other architecture description.

## Engineering Perspective

The cheapest high-value evidence in this chapter is the **consumer inventory**: for a given store, interface, or contract, who actually reads it and which fields do they use. It is usually obtainable from static analysis, query logs, or grep, and it is nearly always surprising. Most teams discover at least one consumer they had forgotten, and the forgotten one is disproportionately likely to be a reporting or reconciliation job whose failures are silent.

Silent consumers deserve specific attention. The finance job in the opening story failed for four days without an alert, because its failure mode was a wrong number rather than an exception. A boundary analysis should ask, for every dependency, not only "what breaks?" but "would we notice?"

Dependency direction and cycle checks are the natural first candidates for the repeatable architecture checks Chapter 9 develops, precisely because they are cheap, deterministic, and about static structure — which is the part of architecture that a machine can actually assess. Their implementation as automated feedback is Part V's concern.

## Industry Perspective

Conway's 1968 observation — that a system's structure tends to mirror the communication structure of the organisation that produced it — is relevant here as a diagnostic rather than a law.[^conway] When a component's boundary is hard to explain technically, it is often explicable organisationally: it is where two teams stopped talking. That is worth knowing when assessing whether a proposed boundary will hold, because a boundary that cuts against the ownership structure requires ongoing effort to maintain and frequently erodes.

Part XI uses this as a reason to record the ownership boundary explicitly alongside the technical ones. It does not follow that teams should be reorganised to match a desired architecture; organisation design is Part XII's territory and is not a Quality Engineering decision.

## Common Misconceptions and Pitfalls

### "We have a service boundary, so we have a data boundary."

These are independent. Services that share a store have a service boundary and no data boundary. The claim "our services are independent" is false in the way that matters most for change.

### "The shared table is fine because everyone only reads it."

Read access still makes the schema a contract. The opening story involved only reads, and it produced three failures and a four-day financial error. Reads couple you to representation and meaning just as writes do; they merely fail more quietly.

### "Adding an interface removes the coupling."

It changes its type. Contract coupling replaces data coupling — a good trade, usually — but the dependency remains, and now there is a versioning obligation that did not exist before. Interfaces relocate and formalise coupling; they do not delete it.

### "Cyclic dependencies are always a defect."

A cycle within one ownership and deployment boundary may be an honest admission that two modules are one thing. A cycle that crosses an ownership or deployment boundary invalidates a claimed independence and is far more serious. Judge cycles by which boundary they cross.

### "The map is the analysis."

A completed map with no consequence column is an inventory. The analytical work is identifying divergences and stating what follows from them.

## QA → QE Transition

The transition in this chapter is from identifying a failing endpoint to revealing the boundary and dependency conditions that made the failure possible, hard to test, or hard to contain.

A QA Engineer asked to investigate the missing shipping emails would find the `switch` statement in notification and file a defect against it. That defect is real and should be fixed. A Quality Engineer files it, and then asks a different set of questions: which boundary was crossed; which contract was never recorded; who else reads this store; what other change to this vocabulary would have the same effect; would we have noticed if the consumer had been the finance job; and what evidence — a consumer inventory, a change-frequency history, a compatibility check — would make the next occurrence visible before deployment rather than after.

The first response fixes an instance. The second addresses the class, and does so without claiming authority to restructure the system.

## Summary

"Boundary" is nine concepts, not one, and their divergences are where quality consequences originate. Responsibility is best understood as a reason to change, and cohesion as whether changes stay local. Coupling is not a scalar to minimise but a set of distinguishable relationships — contract, runtime, temporal, deployment, and data — each with a different cost and a different case for being accepted. Dependency direction should run from volatile towards stable; cycles matter most when they cross an ownership or deployment boundary. Comparing a shared table with a versioned contract shows that neither is universally correct: they trade coordination cost against operational cost, and the honest output of the analysis is often a cheap prerequisite rather than a recommendation.

## Key Takeaways

- System, service, process, data, trust, deployment, ownership, failure, and transactional boundaries can all fall in different places in one system.
- Divergences between boundaries are not defects; failing to record them is.
- Cohesion is measured by whether changes stay local, not by directory tidiness.
- Contract coupling is explicit and negotiable and is usually the coupling you want; data coupling is a contract nobody agreed to.
- Removing one coupling type reliably introduces another; choose which one to hold.
- Depend from volatile towards stable; judge cycles by which boundary they cross.
- A consumer inventory is the cheapest high-value architecture evidence available, and silent consumers are the most dangerous.

## Review Questions

1. Give an Atlas example in which the service boundary and the failure boundary fall in different places, and state the consequence.
2. Why is "the shared table is fine because everyone only reads it" wrong?
3. A team replaces a synchronous call with a message and reports that coupling has been reduced. Which coupling types decreased, and which increased?
4. When is a dependency cycle acceptable, and when is it serious?
5. In the worked reasoning, why was the recommended next action a consumer inventory rather than Option A or Option B?

## Interview Questions

1. How would you assess whether two services are genuinely independently deployable?
2. A colleague says a design has "low coupling." What would you ask to make that claim falsifiable?
3. How do you identify the consumers of an interface when there is no documentation?
4. Describe a change that respected one boundary while crossing another. What would have surfaced it earlier?

## Practical Exercise

Produce a **Boundary, Responsibility, and Dependency Map** for the following synthetic Atlas Commerce situation.

*Atlas wants to introduce a support-initiated partial refund. The support console currently writes directly to `orders` to set a refund flag. Payment refunds are issued by calling the third-party provider. The finance reconciliation job reads `orders` nightly. The notification module sends a refund confirmation email triggered by a database trigger on `orders`. Fulfilment must be prevented from shipping an already-refunded line.*

Your map must include:

- each component with a stated reason to change and an accountable owner role;
- the boundary grid, with **at least three explicitly flagged divergences** between boundary types;
- the dependency list with coupling types, target volatility, and cycle participation;
- a consequence column stating, for each flagged divergence, the quality consequence and the evidence that would confirm or refute it;
- at least one dependency whose failure would be **silent**, with a note on how it would be detected; and
- at least one "unknown" recorded as a finding rather than left blank.

Then answer, in no more than 150 words: which single piece of evidence would you gather first, and why does it serve more than one possible design direction? Do not propose a target architecture. Use synthetic data only.

## Further Reading

- [ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise — Architecture description](https://www.iso.org/standard/74393.html)
- [D. L. Parnas — On the Criteria To Be Used in Decomposing Systems into Modules](https://doi.org/10.1145/361598.361623)
- [M. E. Conway — How Do Committees Invent?](https://www.melconway.com/Home/Committees_Paper.html)

## References

[^parnas]: Parnas, D. L. [On the Criteria To Be Used in Decomposing Systems into Modules](https://doi.org/10.1145/361598.361623). *Communications of the ACM*, 15(12), pp. 1053–1058. December 1972. Accessed 2026-08-14.
[^conway]: Conway, M. E. [How Do Committees Invent?](https://www.melconway.com/Home/Committees_Paper.html) *Datamation*, 14(5), pp. 28–31. April 1968. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Name the nine boundary types and state what stops at each.
- [ ] Identify a divergence between two boundaries in a system and state its quality consequence.
- [ ] Distinguish contract, runtime, temporal, deployment, and data coupling by cost.
- [ ] Explain why "low coupling is always good" and "shared databases are always bad" are unreliable.
- [ ] Assess dependency direction against a component's change profile.
- [ ] Produce a Boundary, Responsibility, and Dependency Map with a consequence column and recorded unknowns.

## Chapter Navigation

Previous: [Chapter 1 — System Design & Architecture as Quality Engineering](chapter-01-system-design-architecture-as-quality-engineering.md) · Next: [Chapter 3 — Communication, Time, and Failure Across Boundaries](chapter-03-communication-time-and-failure-across-boundaries.md)
