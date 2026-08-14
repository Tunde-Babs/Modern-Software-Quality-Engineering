# Chapter 6 — Quality Attributes, Constraints, and Trade-off Scenarios

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 6 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–5; Parts I, VIII, and X recommended |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** "Fast," "reliable," and "secure" are intentions. A scenario is what an intention becomes when someone has been forced to say who, under what conditions, and how anyone would know.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

Six weeks before the promotion, Atlas holds a planning session. The requirements that emerge, verbatim, are:

- catalogue search must be fast;
- checkout must be reliable;
- pricing must be secure;
- promotional pricing rules must be easy to change;
- the partner integration must keep working;
- the system must degrade gracefully.

Everyone agrees. The session ends early, and everyone leaves with a different system in mind.

The catalogue engineer hears "fast" and plans a longer cache TTL. The pricing engineer hears "easy to change" and plans to move pricing rules into a table that can be edited without a release. The security-minded engineer hears "secure" and asks that entitlement checks not be cached. The platform engineer hears "degrade gracefully" and plans to serve stale catalogue data during a dependency failure.

Three of these four plans are in direct conflict, and the conflict is invisible because none of the four requirements says anything about *conditions*. A longer cache TTL improves search response and makes an edited pricing rule take up to the TTL to become visible — so "easy to change" and "fast" now fight. Serving stale data during failure is graceful for catalogue and unacceptable for entitlement — so "degrade gracefully" and "secure" fight. Nobody is wrong. Nobody has stated enough for anybody to be wrong.

Six weeks later, during the promotion, a customer sees a promotional price on the listing page and a different price at checkout. The listing came from a cache with a 300-second TTL; checkout reads the authoritative price. Both behaved exactly as designed.

## Why This Chapter Matters

Chapter 5 produced an option set. This chapter produces the thing options are evaluated against.

The recurring failure is not that teams ignore quality attributes. It is that they name them without bounding them, and an unbounded quality word cannot discriminate between options. "Checkout must be reliable" is satisfied by every option and therefore selects none of them. Worse, it hides conflicts: two people can agree on the sentence while holding incompatible designs, and the disagreement surfaces in production.

A **quality-attribute scenario** is the repair. It converts an intention into a statement concrete enough that you could tell whether it held — which means concrete enough to distinguish between architectural options, and concrete enough to reveal that two requirements are in conflict *before* someone builds both.

This chapter also introduces the vocabulary for reasoning about conflict: constraints, sensitivity points, trade-off points, priority context, and residual risk. That vocabulary is what turns a list of scenarios into a decision input.

The chapter is not an ISO tutorial, an SLO chapter, a load-testing chapter, or a threat-modelling chapter. It does not set targets, design experiments, or model threats. Parts VIII and X own those. It produces bounded scenarios that make an architectural trade-off visible and decidable.

## Learning Objectives

By the end of this chapter, you should be able to:

- name the nine ISO/IEC 25010:2023 top-level product-quality characteristics accurately and select only those relevant to a decision;
- express a quality concern using the six-part scenario scaffold, and justify omitting a part by stating the uncertainty the omission leaves;
- distinguish a constraint from a quality requirement;
- identify sensitivity points and trade-off points in an architecture and explain why they are different;
- use priority context without converting it into a score that decides the architecture;
- perform and critique an availability-composition calculation, including why the resulting percentage cannot decide a design; and
- produce a Quality-Attribute Scenario Set and Trade-off Ledger for a synthetic Atlas Commerce situation.

## Selecting Characteristics, Accurately and Sparingly

Chapter 1 established the vocabulary. ISO/IEC 25010:2023 defines a product-quality model with **nine top-level characteristics**: functional suitability, performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, and safety.[^iso-25010]

Three rules carry forward unchanged, and this chapter is where they are exercised hardest, because a scenario set is exactly where sloppy terminology enters.

- **Do not mix editions.** Usability and portability are not current top-level characteristics; interaction capability and flexibility occupy those positions, and safety was added in the 2023 revision.
- **Do not conflate interaction capability with interoperability.** Interaction capability is top-level and concerns *users*. Interoperability is a subcharacteristic of *compatibility* and concerns information exchange between elements. A partner-integration scenario is a compatibility scenario with an interoperability concern inside it — not an interaction-capability scenario.
- **Do not invent characteristics.** Observability, deployability, and recoverability are engineering capabilities in this handbook's usage, not ISO characteristics; Chapter 7 develops them as architecture concerns in their own right.

The standard is a **reference model for framing concerns**, not an architecture recipe and not a checklist to complete. A scenario set that covers all nine characteristics for every decision is not thorough; it is unfocused. Select the characteristics that the decision actually turns on, and be able to say why the others were excluded. For Atlas's promotion, safety is not material and saying so explicitly is better practice than silently omitting it.

## The Six-Part Scenario Scaffold

A quality concern becomes decidable when it identifies who or what initiates a condition, what condition arrives, under what circumstances, which element absorbs it, what the system is expected to do, and how anyone would know. Architecture-evaluation practice at the Software Engineering Institute expresses this as a small set of scenario parts, and Part XI teaches the following presentation of it:[^sei-atam]

```text
SOURCE
  → STIMULUS
  → ENVIRONMENT
  → AFFECTED SYSTEM / ARTIFACT
  → RESPONSE
  → RESPONSE MEASURE
```

| Part | Question it answers | Why teams skip it, and what breaks |
| --- | --- | --- |
| **Source** | Who or what initiates this? | Skipped because "traffic" feels sufficient. Breaks because a legitimate customer surge and an abusive request pattern demand opposite responses. |
| **Stimulus** | What condition arrives? | Skipped because the stimulus seems obvious. Breaks because "load" hides whether demand rose, a dependency slowed, or a component failed — three different designs. |
| **Environment** | Under what system state does it arrive? | Most commonly skipped. Breaks because a stimulus during normal operation and the same stimulus during a degraded dependency or a deployment are different problems. |
| **Affected system / artifact** | Which element absorbs it? | Skipped because "the system" feels adequate. Breaks because it is the part that ties the scenario to an architectural decision rather than to a symptom. |
| **Response** | What is the system expected to do? | Usually present, but often stated as a metric rather than a behaviour. Breaks because a metric without a behaviour cannot be evaluated for correctness. |
| **Response measure** | How would anyone know? | Skipped because agreeing a number is contentious. Breaks because without it the scenario cannot discriminate between options. |

**This is a reasoning scaffold, not a mandatory form.** Parts may be omitted, and often should be. The discipline is not completeness — it is that an omission must be a decision you can defend. Whenever you leave a part out, state why and what uncertainty the omission leaves:

| Omitted part | Defensible reason | Uncertainty it leaves |
| --- | --- | --- |
| Source | The response is identical regardless of who initiates it. | If that assumption is wrong — abuse versus legitimate demand — the design will be wrong for one of them. |
| Environment | The scenario is explicitly about normal operation only. | Says nothing about behaviour during degradation or deployment, which is often when the concern actually bites. |
| Response measure | Early framing; the measure is a later negotiation. | The scenario cannot yet discriminate between options, so it cannot be used to decide. Record it as unresolved rather than treating the scenario as complete. |

A scenario missing its response measure is not useless — it may be exactly the right artefact for an early conversation. It is simply not yet a decision input, and saying so prevents it from being treated as one.

## Constraints Are Not Quality Requirements

A **constraint** is a limiting condition that every option must respect, and which is not itself negotiable in this decision. "Atlas cannot change the payment provider's timeout semantics." "No additional relational-store capacity is available in the promotional window." "The team is four engineers."

Constraints and quality requirements are routinely mixed, and separating them changes what the analysis produces:

| | Quality requirement | Constraint |
| --- | --- | --- |
| Nature | A desired outcome, expressed as a scenario | A boundary on the solution space |
| Negotiable? | Yes — priority and measure are both negotiable | Not within this decision |
| Effect on options | Discriminates between them | Eliminates some of them |
| If violated | The system is worse than intended | The option is not available |

Recording a constraint as a quality requirement produces endless argument about a fixed condition. Recording a quality requirement as a constraint smuggles a preference in as a fact — "the response must be under 200 ms" stated as a constraint removes the ability to ask what 300 ms would actually cost.

## Sensitivity Points and Trade-off Points

These two terms are the analytical payoff of a scenario set, and they are not the same thing.

A **sensitivity point** is an architectural decision where a small change materially affects one quality attribute's response. The Atlas payment timeout is a sensitivity point for checkout performance efficiency: moving it from 5 s to 2 s changes the response-time distribution substantially.

A **trade-off point** is a decision that is a sensitivity point for **two or more** quality attributes, moving them in opposing directions. The payment timeout is also a trade-off point, because shortening it improves the latency distribution *and* increases the rate of `PAYMENT_UNKNOWN` states (Chapter 3), which degrades reliability and functional suitability. There is no setting that optimises both; there is only a choice about which to favour and a statement of what the choice costs.

The Atlas catalogue cache TTL is the clearest trade-off point in this chapter's material, because it is a sensitivity point for four things at once:

| Direction | Performance efficiency | Functional suitability | Security | Flexibility |
| --- | --- | --- | --- | --- |
| Longer TTL | Better — fewer origin reads | Worse — edited prices take longer to appear | Worse — a revoked entitlement stays effective for the window | Worse — pricing changes take longer to take effect |
| Shorter TTL | Worse — more origin load during the promotion | Better | Better | Better |

Finding the trade-off points is the most valuable output of a scenario set, and it is a different activity from writing the scenarios. Scenarios are written per-concern; trade-off points appear only when you look across them and ask which single decision several scenarios depend on. In the opening story, all four engineers had opinions about the cache TTL and none of them knew they were discussing the same decision.

**Priority context** — sometimes called utility — is the acknowledgement that scenarios are not equally important. Atlas may reasonably decide that during the promotion window, checkout reliability outranks catalogue performance, and that entitlement correctness outranks both. That ordering is a business judgement made by an accountable owner. It is not a score, it does not sum, and it does not compute an architecture. Its role is to say which side of a trade-off point to favour when the evidence does not settle it — which is most of the time.

## Six Bounded Scenarios for the Atlas Promotion

The following are **illustrative synthetic scenarios**. Each names the relevant ISO/IEC 25010:2023 characteristic accurately.

### Scenario 1 — Performance efficiency: catalogue search under promotional demand

| Part | Entry |
| --- | --- |
| Source | Anonymous and authenticated shoppers arriving from the promotion campaign. |
| Stimulus | Search request rate rises to four times the ordinary weekday peak for a sustained two-hour window. |
| Environment | Normal operation; all dependencies healthy; cache warm; no deployment in progress. |
| Affected artifact | API edge → catalogue search path → cache → relational store. |
| Response | Search returns a complete, correctly priced result page. |
| Response measure | The agreed response-time expectation is met for the stated population; origin read rate stays within the store's available headroom. |

*Note:* the environment deliberately excludes degradation, which makes this scenario silent about the case Scenario 6 covers. That is a bounded scope, not an oversight.

### Scenario 2 — Reliability: terminal checkout outcome under payment degradation

| Part | Entry |
| --- | --- |
| Source | Authenticated customers submitting checkout. |
| Stimulus | The third-party payment provider's response time rises from a 180 ms median to several seconds, without failing outright. |
| Environment | Elevated promotional demand; provider degraded but reachable; reconciliation available. |
| Affected artifact | Checkout → payment adapter → provider boundary; order store; `PAYMENT_UNKNOWN` handling. |
| Response | Every checkout attempt reaches a terminal, truthfully reported state — confirmed, declined, or explicitly pending with a known reconciliation path. No customer is told a payment failed when its outcome is unknown. |
| Response measure | Proportion of attempts reaching a terminal state within the agreed window; time from `PAYMENT_UNKNOWN` to resolution; count of customer-visible statements later found untrue. |

The last measure is unusual and deliberate. Counting untrue statements is a functional-suitability measure sitting inside a reliability scenario, and it is the one that would have caught the Chapter 3 incident.

### Scenario 3 — Security: authorization-sensitive data and cache scope

| Part | Entry |
| --- | --- |
| Source | An authenticated customer whose promotional entitlement has just been revoked. |
| Stimulus | The customer requests a page whose content varies by entitlement. |
| Environment | Promotional load; cache populated; entitlement service healthy. |
| Affected artifact | Cache key composition; entitlement read path; the decision of whether a cached value may be *acted on* or only *displayed*. |
| Response | The revoked entitlement is not honoured. No cached response constructed for one customer is served to another. |
| Response measure | Entitlement decisions are made from a non-cached authoritative read; the staleness window for any entitlement-derived display value is bounded and stated. |

This is a security scenario, not a performance one, even though the mechanism under discussion is a cache. Chapter 4 established the distinction between displaying a cached value and acting on one.

### Scenario 4 — Maintainability and flexibility: promotional pricing rule change

| Part | Entry |
| --- | --- |
| Source | A merchandising operator, not an engineer. |
| Stimulus | A promotional pricing rule must change mid-campaign. |
| Environment | Live promotional traffic; no deployment window available. |
| Affected artifact | Pricing rule storage; catalogue read path; cache invalidation; checkout price authority. |
| Response | The changed rule takes effect consistently across listing, basket, and checkout, with no interval in which two surfaces show different prices for the same product. |
| Response measure | Number of components requiring change (**maintainability**); time from rule change to consistent visibility across all surfaces (**flexibility**, and directly bounded by the cache TTL trade-off point). |

Two characteristics appear because two distinct concerns are present: the cost of making the change, and the system's ability to adapt without a release. Splitting them keeps the trade-off point visible.

### Scenario 5 — Compatibility, with an interoperability concern

| Part | Entry |
| --- | --- |
| Source | A partner logistics integration consuming Atlas order events. |
| Stimulus | Atlas adds a fulfilment-status field to the order event to support partial shipment. |
| Environment | Partner deploys on its own schedule, unknown to Atlas; promotional volume. |
| Affected artifact | Order event contract and its version; the partner consumer; any consumer Atlas has not inventoried. |
| Response | Existing consumers continue to process events correctly without coordinated deployment. Consumers that cannot interpret the new field ignore it rather than failing or mis-handling it. |
| Response measure | Number of known consumers verified against the changed contract; a stated deprecation window; **the number of consumers Atlas cannot enumerate, recorded as a known gap rather than assumed to be zero**. |

This is **compatibility**, and the exchange-of-information concern inside it is **interoperability** — a subcharacteristic. It is not an interaction-capability scenario; no user interacts with it. Chapter 8 develops this scenario in full.

### Scenario 6 — Interaction capability, and graceful degradation

| Part | Entry |
| --- | --- |
| Source | A customer whose order is in `PAYMENT_PENDING` after a provider timeout. |
| Stimulus | The customer opens the order-status page during the reconciliation window. |
| Environment | Provider degraded; reconciliation running on its schedule; support queue elevated. |
| Affected artifact | Order-status page; the state vocabulary exposed to customers; the support console. |
| Response | The customer can understand what is known, what is not yet known, whether they may have been charged, and what to do next — and is not invited to retry in a way that could double-charge. |
| Response measure | The displayed state is truthful at the stated staleness; the page contains an accurate next action; the proportion of such customers who contact support, and the proportion who retry payment. |

**Interaction capability** is genuinely the relevant characteristic here: this is about whether an intended user can understand and act in context. Note that it is largely determined by an architectural decision — whether `PAYMENT_UNKNOWN` is representable at all (Chapter 3). An interface cannot communicate a state the architecture cannot hold.

Part XI does not design the interface, run usability research, or claim accessibility conformance. It records that the architectural decision has an interaction consequence and names the owner.

## Numerical Reasoning: Availability Composition

The following is a **bounded, synthetic worked example**.

| Field | Entry |
| --- | --- |
| Context | Atlas wants a figure for checkout availability during the promotion, to decide whether the synchronous payment path is acceptable. |
| Population and boundary | The synchronous checkout path only: API edge → checkout service → order store → payment provider. Excludes catalogue, search, notification, and the asynchronous fulfilment path. |
| Assumptions | Component availabilities over a 30-day window are: API edge 99.95%, checkout service 99.9%, order store 99.95%, payment provider 99.5%. **All four are assumed to fail independently.** All four must be available for a checkout to complete. |
| Units | Dimensionless probability; minutes over a 30-day (43,200-minute) window. |
| Calculation | Composed availability = 0.9995 × 0.999 × 0.9995 × 0.995 = **0.99301**, i.e. **99.301%**. Unavailable time = (1 − 0.99301) × 43,200 = **≈ 302 minutes ≈ 5 h 2 min** per 30 days. The payment provider alone contributes 0.005 × 43,200 = **216 minutes**, about 72% of the total. |
| Interpretation | Under the stated assumptions, no component is the problem and the composition is: four individually respectable numbers produce a path that is materially worse than any of them. The dominant term is the third party, which Atlas cannot improve. That is a genuine architectural finding — it points at removing the provider from the synchronous path (Chapter 5, Option C) rather than at hardening Atlas components. |
| Limitation | **Correct arithmetic; weak evidence.** Three problems. *Independence is almost certainly false*: shared network, shared platform, and correlated demand mean failures cluster, and clustering changes the shape of the outage rather than only its total. *"Available" is the wrong predicate*: Chapter 3's incident occurred while the provider was 100% "available" and slow — a degraded-but-responding dependency counts as up in this arithmetic and produces the worst customer outcome in the chapter. *Composed availability is not a user outcome*: it says nothing about which customers, at what point in the flow, or whether the failure was recoverable. Neither does it account for planned maintenance or partial degradation. |
| Decision relevance | Supports the argument that the third-party dependency dominates the synchronous path and that removing it from that path is worth evaluating. Does **not** support a checkout availability commitment, and must not be used as one. |

The most important sentence in that table is that the Chapter 3 incident is invisible to this calculation. A number that cannot see the worst thing that has actually happened to the system is not a sufficient basis for the decision, however correct its arithmetic.

## The Quality-Attribute Scenario Set and Trade-off Ledger

This chapter's professional artefact is the **Quality-Attribute Scenario Set and Trade-off Ledger** — an MSQE teaching artefact. It has two halves, and the second is where the value is.

**Half one: the scenario set.** Each scenario records the six parts where used, the ISO/IEC 25010:2023 characteristic named accurately, any omitted part with its reason and residual uncertainty, and its priority relative to the others in this decision.

**Half two: the trade-off ledger.** This is built by reading *across* the scenarios and asking which single architectural decisions several of them depend on.

| Ledger field | Content |
| --- | --- |
| Decision | The architectural decision under examination — a cache TTL, a timeout, a boundary, a consistency choice. |
| Scenarios affected | Which scenarios depend on it. |
| Sensitivity or trade-off | Sensitivity point if it materially affects one attribute; trade-off point if two or more move in opposing directions. |
| Direction of conflict | For a trade-off point: which attribute improves and which degrades as the decision moves. |
| Priority context | Which side the accountable owner favours in this window, and why. |
| Evidence | What would inform the setting, and what evidence does not exist. |
| Owner | The accountable role. |
| Residual risk | What remains once the decision is taken. |
| Revision trigger | What would require revisiting it. |

Worked for the Atlas cache TTL:

| Field | Entry |
| --- | --- |
| Decision | Catalogue cache TTL and key scope. |
| Scenarios affected | 1 (performance efficiency), 3 (security), 4 (maintainability/flexibility) — and indirectly the price-mismatch incident in the opening story. |
| Sensitivity or trade-off | **Trade-off point**, affecting three characteristics in opposing directions. |
| Direction of conflict | Longer TTL improves performance efficiency; degrades functional suitability, security, and flexibility. |
| Priority context | During the promotion window, entitlement correctness outranks search latency; a promotional price mismatch is a commercial and possibly regulatory concern, not only a defect. |
| Evidence | Measured origin read rate at candidate TTLs; the actual frequency of mid-campaign rule changes; whether entitlement-derived values are currently cached at all. The last is unknown and cheap to determine. |
| Owner | Catalogue domain owner for the TTL; security owner for key scope and entitlement caching. |
| Residual risk | Any TTL greater than zero leaves a window in which a changed price is not consistently visible. |
| Revision trigger | Introduction of personalised pricing or search results; any change to cache key composition; a second mid-campaign rule change. |

Two disciplines make the ledger honest. **Separate the cache-scope question from the TTL question** — they look like one decision and are two, and only one of them is a security decision. And **record the unknown as a line item**: "we do not know whether entitlement-derived values are cached" is a finding with an owner and a two-hour resolution, not a blank.

## Engineering Perspective

Three practices make scenario work pay for itself.

**Write the response measure last, and expect the argument.** The disagreement that surfaces when someone proposes a number is the useful part. If four people agreed on "checkout must be reliable" and cannot agree on a measure, they never agreed on the requirement. Surfacing that in a planning session is cheap; surfacing it in production is not.

**Write at least one scenario whose environment is degraded.** Scenario sets drift towards normal operation because normal operation is easier to describe. Every architecture failure in Chapters 2–4 occurred under a degraded or unusual condition. A set with no degraded environment is a set that cannot discriminate between designs on the axis that matters most.

**Treat the trade-off ledger as the deliverable.** A scenario set alone is a requirements document, and requirements documents are read once. The ledger names specific decisions with owners, conflicts, and revision triggers, which is a thing a team can act on.

Scenarios also connect forward. Chapter 7 asks what the architecture must provide for each response measure to be *obtainable* — a measure nobody can observe is not a measure. Chapter 9 uses the scenarios to decide what evidence is proportionate. Chapter 12 uses them as the acceptance frame for the capstone options.

## Industry Perspective

The Architecture Tradeoff Analysis Method, developed at the Software Engineering Institute, is built on the premise that architecture is evaluated against elicited quality-attribute scenarios, and that the useful outputs of an evaluation are the sensitivity points, trade-off points, and risks it exposes rather than a verdict.[^sei-atam] Part XI borrows that premise and the scenario vocabulary. It does not adopt ATAM as a required process: ATAM is a facilitated, multi-day, multi-stakeholder method with substantial overhead, and presenting a lightweight scenario set as equivalent would misrepresent both.

The relevant lesson for a Quality Engineer is the shape of the output. An architecture evaluation that produces "the architecture is good" has produced nothing actionable. One that produces "this cache TTL is a trade-off point between three characteristics, the priority context favours correctness in this window, and nobody currently knows whether entitlement values are cached" has produced work.

## Common Misconceptions and Pitfalls

### "We covered all nine characteristics."

Coverage is not the goal and is usually a symptom of not having identified what the decision turns on. Select the characteristics the decision depends on and state which you excluded and why.

### "The scenario needs all six parts."

It does not. It needs the parts that make it decidable, plus an explicit note of what each omission leaves uncertain. A scenario with a defended omission is stronger than one with a fabricated environment.

### "This is a non-functional requirement, so it's a testing concern."

Response measures are often obtainable only if the architecture makes them observable, and the trade-off points are architectural decisions. Deferring scenarios to a testing phase means discovering the conflicts after the decisions are fixed.

### "Interoperability is a quality characteristic."

It is a subcharacteristic of compatibility. Interaction capability is the top-level characteristic, and it concerns users. Conflating them puts a partner-integration concern into a scenario that no user participates in.

### "The availability number tells us if the design is good."

Composed availability rests on an independence assumption that is usually false, treats a degraded-but-responding dependency as available, and does not describe a user outcome. It can indicate where to look. It cannot decide.

### "Priority ranking gives us a score."

Priority says which side of a trade-off to favour when evidence does not settle it. Converting it into a weighted score that computes an architecture manufactures a decision out of a judgement and hides who made it.

## QA → QE Transition

The transition in this chapter is from converting a quality attribute into an isolated non-functional test to making explicit which outcome, population, condition, trade-off, and owner matter to an architectural choice.

A QA Engineer given "catalogue search must be fast" would design a load test, choose a threshold, and report a result — necessary work, and Part X owns doing it well. A Quality Engineer first asks who is searching, under what demand and what dependency state, which element absorbs it, what response is expected, and how anyone would know. Then they read across the other scenarios and notice that the cache TTL that makes search fast is the same decision that determines how long a revoked entitlement stays effective and how long a promotional price takes to appear — that this is one decision, not three, that it has no setting which satisfies everyone, and that somebody with a name has to choose which side to favour and say what it costs.

## Summary

Unbounded quality words satisfy every option and therefore select none, and they hide conflicts until production. The six-part scaffold — source, stimulus, environment, affected artifact, response, response measure — converts an intention into something that can discriminate between designs, and omitting a part is acceptable when the reason and the residual uncertainty are stated. Constraints eliminate options; quality requirements discriminate between them, and mixing the two either freezes an argument or smuggles a preference in as a fact. Sensitivity points affect one characteristic; trade-off points affect several in opposing directions and are found only by reading across scenarios. Priority context says which side to favour when evidence does not settle a trade-off; it is a judgement with an owner, not a score. Composed availability arithmetic can indicate where a path is dominated by a dependency, and cannot decide a design — not least because it treats a degraded-but-responding dependency as available.

## Key Takeaways

- Select the ISO/IEC 25010:2023 characteristics the decision turns on and state which you excluded.
- Interoperability sits within compatibility; interaction capability is top-level and concerns users.
- The six-part scaffold is a reasoning aid; defend omissions by naming the uncertainty they leave.
- A scenario without a response measure is a valid early artefact and not yet a decision input.
- Constraints eliminate options; quality requirements discriminate between them.
- Sensitivity points affect one characteristic; trade-off points affect several in opposing directions.
- Trade-off points are found by reading across scenarios, not by writing them.
- Priority context is an owned judgement, not a weighted score that computes an architecture.
- Write at least one scenario whose environment is degraded — that is where designs differ.
- Composed availability assumes independence, treats "slow" as available, and is not a user outcome.

## Review Questions

1. Four Atlas engineers agreed on six requirements and left with incompatible designs. Which scaffold part, absent from all six, would have surfaced the conflict earliest?
2. State the difference between a sensitivity point and a trade-off point, and give an Atlas example of each.
3. Why is the partner-integration scenario a compatibility scenario rather than an interaction-capability one?
4. The availability composition is arithmetically correct. Give three separate reasons it cannot decide whether the synchronous payment path is acceptable.
5. When is it legitimate to omit the response measure, and what must you record instead?
6. Why does Scenario 6 belong to interaction capability, and which earlier architectural decision determines whether it can be satisfied at all?

## Interview Questions

1. A stakeholder says the system must be "highly available." How do you turn that into something that can guide a design decision?
2. How do you identify that two requirements are in conflict before anything is built?
3. What would you do if the team cannot agree on a response measure?
4. How do you use a priority ranking without letting it pretend to compute the architecture?

## Practical Exercise

Produce a **Quality-Attribute Scenario Set and Trade-off Ledger** for the following synthetic Atlas Commerce situation.

*Atlas is adding a "reserve stock at basket" feature: adding an item to a basket holds inventory for 20 minutes. Merchandising wants held stock released promptly so it can be resold. Customer support wants holds extended when a customer is mid-checkout with a slow payment. Finance wants the inventory figure in the nightly report to reflect real availability. The partner logistics integration reads an inventory feed. The promotion begins in four weeks and the payment provider has a history of degradation under load.*

Your submission must:

- contain **at least five scenarios**, using the six-part scaffold, covering at minimum performance efficiency, reliability, functional suitability, compatibility (with the interoperability concern placed correctly), and one further characteristic you justify;
- include **at least one scenario whose environment is degraded**, not normal operation;
- include **at least one deliberately omitted scaffold part**, with the reason and the residual uncertainty stated;
- separate at least two **constraints** from the quality requirements, and say why each is a constraint in this decision;
- name the ISO/IEC 25010:2023 characteristic for each scenario accurately, and state one characteristic you excluded and why;
- produce a trade-off ledger identifying **at least one sensitivity point and at least one trade-off point**, with the direction of conflict, the priority context, the owner, the residual risk, and the revision trigger; and
- record at least one **unknown as a ledger line item** with an owner, rather than leaving a blank.

Then answer, in no more than 150 words: the hold duration is a single number. List every scenario it affects and state whether it is a sensitivity point or a trade-off point, with reasoning. Do not design the feature. Use synthetic data only.

## Further Reading

- [ISO/IEC 25010:2023 — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html)
- [R. Kazman, M. Klein, and P. Clements — ATAM: Method for Architecture Evaluation](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/) — SEI technical report; a facilitated evaluation method, not an MSQE requirement.
- [SEI — The Architecture Tradeoff Analysis Method](https://www.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/)

## References

[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). 2023. Accessed 2026-08-14.
[^sei-atam]: Kazman, R., Klein, M., and Clements, P. [ATAM: Method for Architecture Evaluation](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/). CMU/SEI-2000-TR-004, Software Engineering Institute, Carnegie Mellon University, 2000. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Select ISO/IEC 25010:2023 characteristics accurately and justify exclusions.
- [ ] Express a quality concern with the six-part scaffold and defend any omission.
- [ ] Distinguish a constraint from a quality requirement and say what each does to the option set.
- [ ] Identify a sensitivity point and a trade-off point, and explain why they differ.
- [ ] Use priority context without converting it into a score.
- [ ] Read across a scenario set to find the single decisions several scenarios depend on.
- [ ] State three reasons a composed availability figure cannot decide a design.

## Chapter Navigation

Previous: [Chapter 5 — Architectural Styles and Decomposition Trade-offs](chapter-05-architectural-styles-and-decomposition-trade-offs.md) · Next: [Chapter 7 — Architecture for Testability, Observability, Operability, and Recovery](chapter-07-architecture-for-testability-observability-operability-and-recovery.md)
