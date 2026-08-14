# Chapter 8 — Contracts, Compatibility, and Change Impact

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 8 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 2–7; Part IV required, Part VI recommended |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A contract is everything a consumer relies on, not everything a provider wrote down. The gap between those two sets is where compatibility breaks, and it is invisible from the provider's side.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

Atlas is shipping partial shipment. The change to the `OrderStateChanged` event is, by every reasonable measure, careful. A new optional field `fulfilmentStatus` is added. No field is removed. No field changes type. The schema is published, the change is reviewed, and it is described in the pull request as "additive, backward compatible."

The description is accurate about the schema and wrong about the system.

Two new values are introduced into the existing `orderStatus` field: `PARTIALLY_SHIPPED` and `AWAITING_RESTOCK`. The field's type has not changed — it is still a string — so no schema check objects. The legacy notification consumer has the `switch` statement from Chapter 2, which treats an unrecognised status as "no notification required." It does not fail. It does not log. It silently stops sending dispatch emails for partially shipped orders.

Meanwhile a second problem develops that nobody attributes to the contract at all. The order-status page reads through a cache with a 300-second time-to-live. When the fulfilment worker retries a failed job and republishes a corrected event thirty seconds later, the cache is not invalidated. Customers refreshing the page see a state that was true five minutes ago and is now wrong. Support receives complaints that the site is "showing the wrong thing," and an engineer spends two days looking at the event pipeline, which is working perfectly.

Three contracts were broken by a change that broke no schema. The **semantic** contract — that `orderStatus` holds a value from a known set — was never written down, so it could not be versioned. The **behavioural** contract — that an unrecognised status is an error rather than a no-op — was decided implicitly by a `switch` statement's default branch. And the **temporal** contract — that the status page reflects the current state within some bounded interval — was never stated at all, so nobody noticed that a 300-second cache made it false.

## Why This Chapter Matters

Chapter 2 established that a boundary without a recorded contract is a contract nobody agreed to. This chapter is about what a contract actually contains, and about the fact that the schema is the smallest and least interesting part of it.

The practical problem is asymmetry of knowledge. A provider knows what it publishes. It does not know what consumers *rely on* — which fields they read, which values they enumerate, which ordering they assume, how quickly they expect to see a change, and what they do with something unexpected. Every compatibility break lives in that gap, and the gap is invisible from the side making the change.

For a Quality Engineer this is familiar territory in an unfamiliar setting. The discipline is the same one Part XI has used throughout: separate what is known from what is assumed, identify what evidence exists, and name what remains uncertain. Applied to a contract change, that discipline produces a change-impact record — an artefact that makes a deployment decision inspectable rather than confident.

The chapter does not teach protocol semantics, a schema-registry product, a consumer-driven-contract framework, or a versioning doctrine. Part IV owns API implementation depth, Part VI owns data implementation and governance, Part VII owns rollout mechanics. What belongs here is which contracts constrain safe change, and how to assess the impact of changing one.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify the five layers of a contract and explain why schema checks see only one of them;
- distinguish structural, semantic, behavioural, temporal, and operational compatibility;
- state compatibility directionally, and say what "backward compatible" does and does not claim;
- separate a compatibility **fact** from an **assumption**, a **compatibility claim**, **evidence**, and **uncertainty**;
- identify contract drift and explain why it accumulates without any change being made;
- reason about deprecation windows from consumer deployment cadence, and state what the arithmetic cannot see; and
- produce a Contract, Compatibility, and Change-Impact Record for a synthetic Atlas Commerce change.

## A Contract Has Five Layers

The word "contract" is usually used to mean "the schema." That is one layer of five, and it is the only one most tooling can see.

| Layer | What it fixes | Atlas example | Usually written down? |
| --- | --- | --- | --- |
| **Structural** | Shape: fields, types, cardinality, required versus optional | `OrderStateChanged` has `orderId: string`, `orderStatus: string`, optional `fulfilmentStatus: string` | Yes — this is "the schema" |
| **Semantic** | What values mean, and which values are possible | `orderStatus` ∈ {`PENDING`, `PAID`, `SHIPPED`, …}; `PAID` means the provider authorised, not that funds settled | Rarely |
| **Behavioural** | Error semantics, ordering guarantees, idempotency, duplicate handling, what an unexpected value implies | A duplicate event must be safe to process; an unrecognised status is an **error**, not a no-op | Almost never |
| **Temporal** | Timing: freshness, timeout expectations, retry behaviour, how quickly a change becomes visible | The status page reflects the latest event within *N* seconds | Almost never |
| **Operational** | Volume, availability, notice period for change, support expectations | Roughly 1.2 million events per day; six months' notice before a breaking change | Sometimes, for partners only |

Two consequences follow directly.

**A schema check validates one layer.** The Atlas change passed schema validation and broke the semantic layer. Automated compatibility checking is genuinely valuable and it is structurally scoped; treating a green check as compatibility evidence is a category error of the kind Chapter 1 warned about.

**Unwritten layers still bind.** The temporal contract in the opening story existed — customers and support both relied on it — and its absence from any document did not make it optional. It made it unnegotiable, because you cannot version something you have not stated.

The `orderStatus` case deserves a name because it is so common. An **open enumeration** permits values the consumer has not seen and requires consumers to define behaviour for them; a **closed enumeration** does not, and adding a value is a breaking change. Atlas never decided which it had. The provider treated it as open; the notification consumer's default branch treated it as closed and failed silently. The architectural requirement is to *decide*, state it in the contract, and — if open — state what a consumer must do with an unknown value.

## Compatibility Is Directional and Layered

"Backward compatible" is used loosely enough to be actively misleading. Two directions must be kept apart.

- **Backward compatible change (provider-side):** existing consumers, unchanged, continue to work correctly with the new provider version.
- **Forward compatible consumer (consumer-side):** a consumer is built to tolerate output from a *future* provider version — typically by ignoring unknown fields and defining behaviour for unknown values.

The second is a property a consumer must have been *built with*. A provider cannot make its consumers forward compatible by publishing a change; it can only find out whether they already were. Atlas's change assumed forward compatibility on the semantic layer that the notification consumer did not have.

Compatibility must then be assessed **per layer**, because a change can be compatible at one and breaking at another:

| Atlas change | Structural | Semantic | Behavioural | Temporal | Operational |
| --- | --- | --- | --- | --- | --- |
| Add optional `fulfilmentStatus` | Compatible | Compatible | Compatible | Compatible | Compatible |
| Add two `orderStatus` values | Compatible | **Breaking** for closed-enum consumers | **Breaking** where unknown → silent no-op | Compatible | Compatible |
| Introduce cache on status page | Compatible | Compatible | Compatible | **Breaking** for any consumer relying on freshness | Compatible |
| Increase event volume 4× in promotion | Compatible | Compatible | Compatible | Compatible | **Potentially breaking** for a rate-limited partner |

The last row matters and is routinely forgotten. A promotion that quadruples event volume is a contract change with respect to the operational layer, even though nothing about the event changed.

**Contract drift** is the accumulation of divergence between the stated contract and what is actually relied upon, without anyone making a change. Consumers begin depending on field ordering, on a value that "always" appears, on a latency that has been stable, or on a field's incidental correlation with something else. Drift is why a contract that has not changed can still break: the provider changes something it never promised, and a consumer had come to rely on it. The only defence is periodic re-establishment of what consumers actually read — which is Chapter 2's consumer inventory, repeated.

## Fact, Assumption, Compatibility Claim, Evidence, Uncertainty

This is the chapter's central discipline, and the distinctions are finer than they look. Applied to the Atlas change:

| Category | Definition | Atlas instance |
| --- | --- | --- |
| **Fact** | Directly established and independently checkable | The schema adds one optional field and removes none. Five consumers are registered in the service catalogue. |
| **Assumption** | An unverified condition the reasoning depends on | Consumers ignore unknown `orderStatus` values safely. The service catalogue lists all consumers. The partner deploys at least quarterly. |
| **Compatibility claim** | A statement about whether consumers keep working — a *conclusion*, not an observation | "This change is backward compatible." True structurally; false semantically for at least one consumer. |
| **Evidence** | What supports or challenges the claim, with its scope | A schema-compatibility check (structural layer only). A code read of two consumers (2 of 5, and only their parsing paths). |
| **Uncertainty** | What is not known and would change the conclusion | Whether the analytics job reads `orderStatus`. Whether the partner enumerates values. Whether any unregistered consumer exists. |

The failure in the opening story is precisely a category slip: a **fact** about the structural layer ("no field removed") was presented as a **compatibility claim** about the system, with **evidence** covering one layer, and the **uncertainty** — three unread consumers — recorded nowhere.

A useful test before accepting a compatibility claim: *which layer, for which consumers, established by what evidence, and what is the largest thing we do not know?* If the answer to the last part is "nothing," the analysis has not looked.

## Numerical Reasoning: Deprecation Window and Staleness Composition

### Example 1 — Minimum safe deprecation window

| Field | Entry |
| --- | --- |
| Context | Atlas wants to retire `OrderStateChanged` v1 after introducing v2 with a closed, versioned status enumeration. |
| Population and boundary | The five consumers registered in the service catalogue: three internal services deploying weekly, one internal batch job deploying monthly, one external partner integration deploying quarterly. |
| Assumptions | Each consumer migrates within one of its own deployment cycles once notified. Atlas needs one further full cycle of the slowest consumer to confirm migration before removing v1. The catalogue is complete. |
| Units | Days; counts of consumers. |
| Calculation | Slowest cadence = quarterly = **90 days**. Confirmation cycle = one further **90 days**. Minimum safe window = 90 + 90 = **180 days**. Consumers currently on v1 = 5 of 5; consumers Atlas has verified against v2 = 2 of 5, i.e. **40% verified, 60% unverified**. |
| Interpretation | A six-month deprecation window is not caution; it is arithmetic driven entirely by the single slowest consumer. Shortening it requires either changing that consumer's cadence or accepting that it may break. |
| Limitation | **The load-bearing assumption is the completeness of the catalogue, and Chapter 2 established it is not complete.** An unregistered consumer has an unknown cadence and therefore an unbounded window; the calculation cannot see it. The arithmetic also assumes each consumer *will* migrate when notified, which is an organisational fact rather than a technical one, and assumes the partner deploys at all — a partner integration that has not shipped in two years has an effectively infinite cadence. |
| Decision relevance | Supports planning a 180-day window and, more importantly, supports treating the consumer inventory as a prerequisite rather than a nicety. Does not establish that removing v1 after 180 days is safe. |

### Example 2 — Where customer-visible staleness actually comes from

| Field | Entry |
| --- | --- |
| Context | An engineer proposes optimising the event pipeline to fix the "site shows the wrong thing" complaints. |
| Population and boundary | The path from an order state change to what a customer sees on the order-status page. |
| Assumptions | Broker delivery p95 = 200 ms; consumer processing p95 = 1,800 ms; order-status page cache TTL = 300 s; the cache is not invalidated on event processing. Requests arrive uniformly across the TTL cycle. |
| Units | Milliseconds and seconds. |
| Calculation | Pipeline contribution = 200 ms + 1,800 ms = **2.0 s**. Worst-case customer-visible staleness = 300 s + 2.0 s = **302 s**. Cache share of worst case = 300 ÷ 302 = **99.3%**. Mean cache age under uniform arrival = 150 s, so mean staleness ≈ **152 s**. |
| Interpretation | The event pipeline contributes 0.7% of worst-case customer-visible staleness. Optimising it to zero would change the customer experience from 302 s to 300 s. The two days spent examining the pipeline were spent on the wrong 0.7%. |
| Limitation | Percentile figures for delivery and processing are from separate distributions and do not compose by addition (Chapter 3, Example 1) — the 2.0 s is indicative, not a p95 of the pipeline. The uniform-arrival assumption is unlikely to hold for a customer who has just placed an order and refreshes immediately. And the arithmetic entirely omits the case that generated the complaints: a **retry republishing a corrected event at t+30 s does not invalidate the cache**, so the customer sees a state that is not merely late but has been superseded. That is a correctness problem, not a latency one, and no staleness figure describes it. |
| Decision relevance | Redirects work from the pipeline to the cache-invalidation decision and to stating a temporal contract for the status page. Does not establish an acceptable TTL, which is the Chapter 6 trade-off point. |

## Worked Reasoning: Change Impact for the Order-Event Evolution

The change: `OrderStateChanged` gains an optional `fulfilmentStatus`, and `orderStatus` gains two values.

### Affected consumers

| Consumer | Reads `orderStatus`? | Unknown-value behaviour | Deploy cadence | Impact |
| --- | --- | --- | --- | --- |
| Notification service | Yes, `switch` with default | **Silent no-op** | Weekly | **Breaking** — dispatch emails stop for affected orders, with no error |
| Support console | Yes, via lookup map | Renders blank | Weekly | **Breaking, visibly** — agents see an empty status |
| Fulfilment worker | Yes | Explicit `default: throw` | Weekly | Fails loudly — which is better, because it is detected |
| Finance reconciliation job | Yes, in a `WHERE ... IN (...)` filter | **Silently excludes** | Monthly | **Breaking, silently** — settlement figures understate, as in Chapter 2 |
| Partner logistics integration | Unknown | Unknown | Quarterly | **Unknown** |
| Analytics pipeline | **Not in the catalogue** | Unknown | Unknown | **Unknown; not enumerated** |

The distribution of failure modes is the finding. One consumer fails loudly. Two fail silently, and one of those is financial. The loud failure is the one the team will notice in staging; the silent financial one is the one that cost four days in Chapter 2.

### The record

| Field | Entry |
| --- | --- |
| **Facts** | The schema adds one optional field and removes none. `orderStatus` gains two values; its type is unchanged. Four of six identified consumers read `orderStatus`. Notification's default branch is a no-op; finance's query filters on an explicit value list. |
| **Assumptions** | The service catalogue is complete (**unverified — Chapter 2 indicates it is not**). The partner enumerates status values (**unverified**). Each consumer migrates within one deployment cycle (**organisational, unverified**). |
| **Compatibility claim** | Structurally backward compatible. **Semantically breaking** for closed-enumeration consumers. Behaviourally breaking wherever unknown maps to a silent no-op. |
| **Evidence** | Schema-compatibility check — structural layer only. Code read of four consumers' parsing paths. **No evidence for the partner or the analytics pipeline.** |
| **Uncertainty** | Behaviour of two of six consumers; existence of any seventh; whether the partner's contract permits a value addition at all. |
| **Temporal assumptions** | Consumers see a state change within seconds. The status-page cache makes this false for customers by up to 300 s (Example 2). A republished corrected event does not invalidate the cache. |
| **State assumptions** | Consumers assume a linear order lifecycle. `PARTIALLY_SHIPPED` is not terminal and may be followed by `SHIPPED` — a transition no existing consumer's state machine expects. Chapter 3's out-of-order arrival makes this worse: `SHIPPED` arriving before `PARTIALLY_SHIPPED` is now possible and meaningful. |
| **Rollout condition** | Do not emit the new values until every identified consumer has shipped a defined unknown-value behaviour. Emit to one low-volume order type first. Keep the fraction of orders using new values controllable. |
| **Contract evidence needed** | A statement of whether `orderStatus` is an open or closed enumeration — currently undecided, and it determines whether this is a breaking change at all. A consumer inventory extending beyond the catalogue. Confirmation of the partner's tolerance. |
| **Deprecation signal** | If the enumeration is declared closed, v1 must be versioned and deprecated with the 180-day window from Example 1, with per-consumer migration confirmation rather than an announcement. |
| **Rollback / roll-forward** | Rolling back the *publisher* stops new values being emitted but does not remove values already written to `orders` rows, which consumers will continue to read. **Rollback is therefore not symmetric**, and roll-forward — shipping consumer fixes — is likely the only real recovery. This must be established before deployment, not during. |
| **Owner** | Order-domain owner for the enumeration decision; each consumer's owner for unknown-value behaviour; commercial owner for the partner contract. |
| **Residual risk** | Unenumerated consumers cannot be assessed. The finance job's silent failure mode will recur for any future value addition unless its query pattern changes. |
| **Revision trigger** | Any further value addition; a new consumer registering; the partner's integration version changing; a decision on open versus closed enumeration. |

### What the analysis produced

Not an approval or a rejection. It produced a **prior question**: is `orderStatus` an open or a closed enumeration? Until that is decided, "is this change breaking?" has no determinate answer — it is breaking for closed-enum consumers and compatible for open-enum ones, and Atlas has both. Deciding it is a half-hour conversation with an owner, and it converts an unanswerable question into two answerable ones.

It also produced the observation that **rollback is asymmetric**, which is the kind of thing teams discover during an incident. Chapter 10 develops reversibility as a first-class concern.

## The Contract, Compatibility, and Change-Impact Record

This chapter's professional artefact is the **Contract, Compatibility, and Change-Impact Record** — an MSQE teaching artefact, not a required template. Its fields are the record above. Four disciplines make it work.

**Assess every layer, and say so per layer.** A single "compatible / breaking" verdict conceals which layer was assessed. Structural compatibility is the easiest to establish and the least likely to be the problem.

**Classify each consumer's unknown-value behaviour, not just its existence.** A consumer list is inventory; a list annotated with failure mode is analysis. Silent failure modes should be marked, because they determine whether a staged rollout will actually reveal anything.

**Record unenumerated consumers as a line item.** "We know of six and believe there may be more" is a finding with an owner. A blank implies zero.

**State rollback symmetry explicitly.** Ask whether rolling back the provider restores the previous state for consumers. Where data written under the new version persists — as it does here — the answer is no, and the recovery plan is roll-forward.

## Engineering Perspective

Three practices repay their cost.

**Write down the semantic and behavioural layers, even informally.** A short note stating that `orderStatus` is an open enumeration and that consumers must treat unknown values as "no assumption; do not act" is worth more than an elaborate schema registry, because it makes the layer that actually breaks into something that can be reviewed and versioned. Tooling for the structural layer is Part IV's and Part V's; the decision about the semantic layer is architectural.

**Make silent failure loud at the consumer.** The single highest-value change available to Atlas is not in the event — it is replacing three `default:` no-ops with explicit, logged, alerting unknown-value handling. That converts three future silent breakages into detected ones, and it is a per-consumer change that does not require any contract decision.

**Treat the consumer inventory as perishable.** Chapter 2 called it the cheapest high-value architecture evidence. Chapter 8 adds that it decays: consumers appear, and drift accumulates. Re-establishing it before any contract change is proportionate.

## Industry Perspective

Two widely used references illustrate how narrow a formal contract usually is.

RFC 9110 defines HTTP semantics, including which request methods are idempotent and what status-code classes mean.[^rfc9110] It fixes the behavioural layer for the protocol — and only for the protocol. It says nothing about whether *your* `POST /orders` is idempotent in the business sense (Chapter 3), what your status values mean, or how quickly a change becomes visible. A team that has "followed the RFC" has satisfied one layer of one contract.

Semantic Versioning 2.0.0 is a community specification, not a formal standard, and it defines version-number semantics: a breaking change requires a major increment.[^semver] It is genuinely useful for signalling intent, and it does not determine whether a change is breaking — that determination requires exactly the per-layer, per-consumer analysis this chapter describes. Atlas's change would attract an argument about whether it is a minor or a major version, and the argument would be a proxy for the undecided open-versus-closed enumeration question. The version number is a communication of a conclusion, not a substitute for reaching one.

## Common Misconceptions and Pitfalls

### "The schema check passed, so it is compatible."

The check assessed the structural layer. The Atlas break was semantic and behavioural, and both are invisible to it.

### "Adding a field is always safe."

Adding a *field* is usually structurally safe. Adding a *value* to an existing field is a semantic change and is breaking for any consumer that enumerates values — which you cannot know without reading them.

### "We announced the deprecation."

Announcement is not migration. The useful signal is per-consumer confirmation that it has shipped against the new version, and the window is set by your slowest consumer, not by your notice period.

### "Rolling back the change undoes it."

Only if no state written under the new version persists. Where it does, rollback leaves consumers reading data the old code cannot interpret, and roll-forward is the real recovery path.

### "The contract has not changed, so nothing can break."

Contract drift means consumers come to rely on things never promised — ordering, a stable latency, a field that has always been present. Changing something you never promised is a break in practice.

### "Semantic versioning tells us if it is breaking."

It communicates a conclusion someone else reached. Reaching it requires the per-layer, per-consumer analysis.

## QA → QE Transition

The transition in this chapter is from checking a changed endpoint or schema in isolation to assessing which consumers, deployments, state transitions, temporal assumptions, and recovery paths could be affected.

A QA Engineer given the order-event change would validate that the new field is present and correctly typed, that existing fields are unchanged, and that the schema check passes. All correct, all necessary, and all confined to one of five layers. A Quality Engineer asks which consumers read `orderStatus`; what each does with a value it has not seen; which of those failure modes are silent; whether the enumeration is open or closed and who decides; whether the new state is terminal and what an out-of-order arrival now means; how quickly a customer sees the change and whether a cache makes that false; whether rolling back actually undoes anything; and how many consumers exist that nobody has listed. Then they say which of those are facts, which assumptions, and which the team simply does not know.

## Summary

A contract has five layers — structural, semantic, behavioural, temporal, and operational — and tooling generally sees only the first. Compatibility is directional: a provider cannot make its consumers forward compatible, only discover whether they were. It must be assessed per layer and per consumer, because a change can be structurally compatible and semantically breaking, as adding a value to an existing field usually is. Compatibility claims are conclusions and must be separated from the facts, assumptions, evidence, and uncertainty that support them; the most common failure is presenting a structural fact as a system-wide claim. Silent consumer failure modes matter more than loud ones, because a staged rollout will not reveal them. Rollback is frequently asymmetric where state persists, which makes roll-forward the real recovery path — a fact worth establishing before deployment rather than during an incident.

## Key Takeaways

- The schema is one of five contract layers; the unwritten layers still bind.
- Decide and state whether an enumeration is open or closed — it determines whether a value addition is breaking at all.
- Backward compatibility is a provider-side property of a change; forward compatibility is a consumer-side property it must already have been built with.
- Assess compatibility per layer and per consumer; a single verdict hides which layer was checked.
- Annotate consumers with their unknown-value failure mode; silent failures defeat staged rollout.
- Contract drift breaks systems with no change at all, because consumers rely on things never promised.
- A deprecation window is set by the slowest consumer's cadence, and the arithmetic cannot see consumers you have not enumerated.
- Ask whether rollback is symmetric; where state persists, it is not.
- A version number communicates a conclusion; it does not reach one.

## Review Questions

1. Name the five contract layers and state which layer the Atlas change broke.
2. Why can a provider not make its consumers forward compatible?
3. Three Atlas consumers fail silently and one fails loudly. Why does that distribution change how you plan the rollout?
4. In Example 2, the pipeline contributes 0.7% of worst-case staleness. What was the actual defect, and why does no staleness figure describe it?
5. Explain why the change-impact analysis produced a prior question rather than a verdict.
6. Give an Atlas example of contract drift and say how you would detect it.

## Interview Questions

1. A team says a change is backward compatible because no field was removed. What do you ask?
2. How would you determine a safe deprecation window, and what would you refuse to conclude from it?
3. How do you find consumers of an event that are not in any registry?
4. When is rollback not a recovery option, and what do you plan instead?

## Practical Exercise

Produce a **Contract, Compatibility, and Change-Impact Record** for the following synthetic Atlas Commerce change.

*Atlas is changing the inventory feed consumed by the partner logistics integration. Today the feed publishes `availableQuantity` as an integer. The change splits it into `onHandQuantity` and `reservedQuantity`, keeps `availableQuantity` as a computed field for compatibility, and changes its meaning: it will now exclude basket holds, where previously it did not. The feed is published hourly. The partner deploys quarterly. Two internal dashboards and a reordering job also consume the feed; the reordering job's behaviour when a field is absent is unknown.*

Your record must:

- assess compatibility **separately for each of the five layers**, with a per-layer verdict;
- identify the change that is structurally compatible and **semantically breaking**, and explain why no schema check will detect it;
- list every consumer with its unknown-value or missing-field failure mode, marking which failures are **silent**;
- separate **facts**, **assumptions**, **compatibility claims**, **evidence** (with its scope), and **uncertainty** into distinct sections — a statement in the wrong section invalidates the record;
- state the **temporal** assumptions the hourly publication creates, and whether any consumer relies on freshness;
- calculate a minimum safe deprecation window from the stated cadences, and state at least two things the arithmetic cannot see;
- determine whether **rollback is symmetric**, with reasoning about persisted state; and
- record at least one consumer or behaviour as **unknown**, with an owner and how you would resolve it.

Then answer, in no more than 150 words: `availableQuantity` keeps its name and changes its meaning. Explain why this is more dangerous than removing the field outright, and what single contract-layer decision would have prevented the risk. Do not design the feed. Use synthetic data only.

## Further Reading

- [RFC 9110 — HTTP Semantics (STD 97)](https://www.rfc-editor.org/rfc/rfc9110.html) — protocol specification; fixes the behavioural layer for HTTP only.
- [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html) — community specification, not a formal standard.
- [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html) — for compatibility and its interoperability subcharacteristic.

## References

[^rfc9110]: Fielding, R., Nottingham, M., and Reschke, J., eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). Internet Engineering Task Force, STD 97, June 2022. Accessed 2026-08-14.
[^semver]: Preston-Werner, T. [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html). Community specification; not issued by a formal standards body. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Name the five contract layers and say which one a schema check assesses.
- [ ] Decide and state whether an enumeration is open or closed, and why it determines breakage.
- [ ] State compatibility directionally and per layer.
- [ ] Separate a compatibility claim from the facts, assumptions, evidence, and uncertainty behind it.
- [ ] Annotate consumers with silent versus loud failure modes and adjust a rollout accordingly.
- [ ] Derive a deprecation window from consumer cadence and state what it cannot see.
- [ ] Determine whether rollback is symmetric for a given change.

## Chapter Navigation

Previous: [Chapter 7 — Architecture for Testability, Observability, Operability, and Recovery](chapter-07-architecture-for-testability-observability-operability-and-recovery.md) · Next: [Chapter 9 — Architecture Evidence, Fitness Functions, and Decision Records](chapter-09-architecture-evidence-fitness-functions-and-decision-records.md)
