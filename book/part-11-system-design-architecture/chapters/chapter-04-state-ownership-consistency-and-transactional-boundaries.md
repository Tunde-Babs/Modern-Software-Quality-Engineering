# Chapter 4 — State Ownership, Consistency, and Transactional Boundaries

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 4 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–3; Parts IV and VI recommended |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** "What does the system say?" and "what actually happened?" are different questions. An architecture that cannot distinguish them forces support staff to guess, and forces customers to trust the guess.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

A customer contacts Atlas support. Their card statement shows a charge of €89.40. Her Atlas order page shows one order, status `PENDING`, placed at 14:02. She has received two dispatch notification emails, both referencing the same order, sent four minutes apart. She would like to know whether she has been charged once or twice, whether her order is being shipped once or twice, and when it will arrive.

The support agent opens the internal console. It shows:

- one row in `orders`, status `PAYMENT_PENDING`, created 14:02;
- two rows in `fulfilment_jobs`, both referencing that order, created 14:06 and 14:07, both status `DISPATCHED`;
- no row in `payment_records` — the payment call timed out at 14:04 and was recorded as `PAYMENT_UNKNOWN` rather than as a failure, Atlas having adopted the explicit unknown state that Chapter 3 identified as a prerequisite for either checkout option;
- two entries in the notification log, matching the two emails.

The agent can describe what each table contains. She cannot answer any of the customer's three questions.

Whether the customer was charged is known only to the payment provider; Atlas has an attempt record with a correlation identifier but has never queried it. Whether the order is being shipped twice depends on whether the two fulfilment jobs represent two physical picks or one job processed twice — and the fulfilment system deduplicates on a job identifier that was regenerated on retry, so it did not deduplicate. When the order will arrive is unanswerable until the first two questions are.

This is not a data-quality problem in Part VI's sense. The rows are internally consistent, correctly typed, and faithfully recorded. It is an architecture problem: three components each own a fragment of one business fact, no component owns the fact itself, and no process exists to reconcile the fragments into a statement anyone can stand behind.

## Why This Chapter Matters

Chapter 3 established that crossing a boundary introduces unknown outcomes. This chapter is about what an unknown outcome does to *state* — and about the decisions that determine whether an unknown can later be resolved or must be permanently guessed at.

State is where architecture decisions become irreversible. A communication choice can be changed in a sprint. A state-ownership choice — which component is the authority for a fact, which store holds it, what commits atomically with what — becomes embedded in every consumer, every report, every support workflow, and every migration. It is also where the largest gap sits between what a system displays and what is true.

Three questions organise the chapter. **Who owns this fact?** **What is guaranteed about reading it, and when?** **What is the process when the answer is contradictory or missing?** Most systems answer the first implicitly, the second by accident, and the third not at all.

The chapter holds a firm boundary with adjacent parts. It does not teach a database product, derive a consensus algorithm, prescribe event sourcing, or reproduce Part VI's data-quality, lineage, or governance curriculum. It reasons about *architectural* state decisions and the evidence they make possible or impossible.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify the owner of a fact and distinguish ownership from storage location and from read access;
- distinguish a transactional boundary from a service boundary and identify the partial-completion states that a divergence creates;
- reason about strong and eventual consistency as bounded, context-dependent guarantees rather than labels;
- state what a cache is, what staleness window it creates, and where cached data becomes an authorisation or correctness risk;
- explain the CAP result accurately, reject the "choose any two" shorthand, and describe what it does and does not decide;
- design a reconciliation path for an unknown or contradictory outcome, including its own failure modes; and
- produce a State Ownership and Consistency Decision Record for a synthetic Atlas Commerce decision.

## State Ownership

**State ownership** means: for a given fact, exactly one component is the authority. Others may hold copies, caches, projections, or derived views, but when copies disagree, the owner's value is correct by definition.

Ownership is distinct from two things it is routinely confused with.

**Ownership is not storage location.** Several components can write to one physical database while ownership of each fact remains clear — if there is an agreement about who may write what. Conversely, a component can have its own dedicated store and still not own the facts in it, if it holds a cached projection whose authority lives elsewhere. A shared database is a boundary problem (Chapter 2), not automatically an ownership problem.

**Ownership is not read access.** Many components may read a fact. Exactly one decides what it is.

The diagnostic question is: **when two components disagree, whose value is correct?** If the answer is "it depends," or "we'd have to look," the fact has no owner, and every contradiction becomes an investigation rather than a lookup.

In the opening story, the fact "was this customer charged" has no owner inside Atlas. The provider owns it. Atlas holds an attempt record, which is evidence *about* the fact rather than the fact itself. That distinction is the whole story: Atlas built a system that could display a state without being able to establish it.

### Shared versus isolated state

| | Shared store | Isolated state per component |
| --- | --- | --- |
| Transactional scope | Multiple facts can commit atomically; invariants across them are enforceable by the database. | Cross-component invariants must be maintained by application logic, compensation, or reconciliation. |
| Coupling | Data coupling (Chapter 2); schema becomes an implicit contract. | Contract coupling; schema changes are local. |
| Failure isolation | Store faults affect every component; noisy-neighbour effects are real. | A store fault affects one component; a partial system remains usable. |
| Evidence | One place to query; "what happened" is often answerable by one join. | Correlation across stores is required; a correlation identifier becomes essential infrastructure. |
| Operational cost | One store to operate, back up, monitor, and migrate. | N stores, N backup regimes, N migration paths. |
| Migration cost | Low now; the eventual split is expensive and touches every consumer. | Paid up front. |

Neither column is the right answer. The trade is between *transactional simplicity now* and *failure isolation plus independent evolution later*, mediated by how many components there are and how competent the team is at operating stores. A four-engineer team that splits its state into six stores has usually made its life worse, not better.

## Transactional Boundaries and Partial Completion

A **transaction boundary** is the scope within which a set of changes either all take effect or none do. Its architectural significance is that everything outside it can be partially complete.

In Atlas, the order row and its line items commit together. The payment record does not — it depends on a third party. The fulfilment job does not, if it is enqueued to a broker. The notification does not. So a single business operation, "place an order," spans one transaction and three things that can independently succeed, fail, or end up unknown.

Every place where the transactional boundary is narrower than the business operation creates a **partial-completion state**. These states are real, they occur, and they are customer-visible. The architectural question is whether they are *modelled* — given a name, a legitimate meaning, a defined exit, and a bounded lifetime — or whether they exist only as the absence of an expected row.

| Business operation | Transactional boundary | Partial-completion states created |
| --- | --- | --- |
| Place order | Order + lines | Order exists, payment unknown; order paid, fulfilment not enqueued; order paid and fulfilled, customer not notified |
| Issue refund | Refund record | Refund recorded, provider refund not confirmed; provider refunded, record not updated |
| Cancel order | Order status | Order cancelled, fulfilment already picked; order cancelled, refund not issued |

The **dual-write problem** is the general form: any operation that must change local state *and* communicate with an external party cannot make both atomic. Writing the row and then publishing the message can lose the message; publishing then writing can produce a message for a state that never committed. The standard architectural responses — writing the intended message into the same transaction as the state change and having a separate process deliver it, or deriving the message from a durable log of committed changes — are design commitments with real operational cost. What is not available is a version where the problem does not exist. Part XI's requirement is that the chosen response is explicit and that the partial-completion states it still permits are named.

## Consistency as a Bounded Guarantee

**Strong consistency**, in the sense relevant here, means a read returns the most recently committed write; a reader cannot observe an older value once a newer one is committed. **Eventual consistency** means that in the absence of new writes, replicas converge — with no guarantee about *when*, and no guarantee that intermediate reads are ordered sensibly.

Both terms are frequently used as labels for a system. They are more useful as statements about a specific **read path**, because one system routinely provides different guarantees on different paths:

| Atlas read path | Practical guarantee |
| --- | --- |
| Checkout reads the cart it just wrote, same transaction, primary | Strong |
| Order-status page reads from a read replica | Eventually consistent; bounded by replication lag |
| Catalogue search reads from a cache | Eventually consistent; bounded by TTL and invalidation correctness |
| Finance reconciliation reads a nightly snapshot | Consistent as of the snapshot; deliberately stale by up to 24 hours |

The useful architectural artefact is not the label but the **consistency window**: for this read path, how stale can the data be, and what is the customer or business consequence at that staleness? "The order-status page may be up to 400 ms behind" is a decision nobody needs to escalate. "The order-status page may be up to 90 seconds behind, and customers who refresh after paying will see `PENDING` and may pay again" is a decision that needs a name on it.

Note also that the *appearance* of inconsistency is often the more damaging problem. A customer who sees `PAID` and then, on refresh, sees `PENDING` has watched the system contradict itself. Read-your-own-writes — routing a user's reads to a path that reflects their own recent writes — is a targeted, cheaper answer than making the whole system strongly consistent, and it addresses the case customers actually notice.

## Caches, Staleness, and Correctness

A **cache** is a copy of a fact held closer to a reader, whose authority lies elsewhere. Every cache creates a staleness window and a set of correctness questions that are architectural rather than incidental.

**What is the invalidation strategy, and what happens when it fails?** Time-to-live expiry is simple and bounded. Event-driven invalidation is fresher and fails silently: a missed invalidation message produces indefinitely stale data with no error. A design that relies solely on event-driven invalidation should have a TTL as a backstop, so that the worst case is bounded rather than unbounded.

**What is the cache key's scope, and is it safe?** This is a security question, not a performance one. If a response varies by user, role, entitlement, or region, and the cache key does not include that dimension, one user's data will be served to another. This is a common and serious defect class, and it is created at architecture time. The Atlas rule stated in Part XI's baseline is that authorisation-sensitive data is excluded from shared-cache reuse.

**Is the cached value safe to act on, or only to display?** Showing a slightly stale catalogue price is a product decision. Making an authorisation decision from a cached entitlement is a security decision, because a revoked permission remains effective for the length of the staleness window. The two uses of the same cached value carry different consequences and warrant different windows.

## CAP as a Condition, Not a Slogan

The CAP result is widely cited and widely misused. Part XI treats it narrowly.

**What the result actually says.** Gilbert and Lynch proved a formalisation of Brewer's conjecture: in an asynchronous network model, no distributed system can simultaneously guarantee **consistency** (in the sense of linearizability — reads and writes appear to occur in a single, real-time-respecting order), **availability** (every request to a non-failing node eventually receives a non-error response), and tolerance of arbitrary **network partitions**.[^gilbert-lynch]

**Why "choose any two" is wrong.** Partition tolerance is not a design choice. A network partition is a *condition that occurs* — a switch fails, a link saturates, a region becomes unreachable. A distributed system does not elect whether partitions happen; it only determines what it does when one does. Presenting P as a selectable option implies you can build a distributed system that has decided partitions will not occur, which is not a design, it is an omission.

The real choice is narrower and more useful: **during a partition, does the system prefer to return a possibly-stale answer (favouring availability) or refuse to answer (favouring consistency)?** Both are legitimate. An Atlas catalogue page should almost certainly serve slightly stale product data during a partition rather than return errors. An Atlas payment authorisation should almost certainly refuse rather than authorise against state it cannot verify. The same system makes opposite choices on different paths, which is by itself enough to show that CAP does not classify systems.

**What CAP does not decide.** It says nothing about behaviour when there is no partition — which is nearly all of the time, and where the more common trade is between consistency and latency. Abadi's PACELC formulation makes this explicit: *if there is a Partition, trade Availability against Consistency; Else, trade Latency against Consistency.*[^abadi] Brewer himself later wrote that the "2 of 3" framing had been misleading and that the interesting engineering work is in partition detection, degraded-mode operation, and recovery.[^brewer] CAP also says nothing about durability, isolation levels, staleness bounds, operational complexity, or cost — all of which matter more to most architecture decisions than CAP does.

**How Part XI uses it.** Only to support one bounded question: *under a stated partition condition, on this specific read or write path, does the system prefer to answer possibly-stale or to refuse?* It is not an architecture-selection scorecard, not a way to classify databases into buckets, and not a substitute for stating a consistency window. This chapter does not derive consensus algorithms or develop distributed-systems theory further; that is outside Part XI's scope.

## Reconciliation, Duplication, and Out-of-Order Work

**Reconciliation** is the process by which a system establishes the authoritative value of a fact when its local record is unknown, contradictory, or suspected wrong. It is the exit path from the states Chapter 3 creates.

A reconciliation design needs five things, and the fifth is the one usually missing.

1. **A correlation identifier** generated by the caller *before* the operation, and carried through it. Without this there is nothing to reconcile against.
2. **A query interface** on the authoritative party, and confirmation that it exists and is contractually available.
3. **A trigger**: scheduled, event-driven, or operator-initiated.
4. **A resolution rule**: what happens for each possible provider answer, including "no record found," which is not the same as "not charged."
5. **A failure mode for reconciliation itself.** The reconciliation query usually goes to the same dependency that just failed. If the provider is degraded, the recovery mechanism is degraded too — precisely when it is needed. A design that assumes reconciliation always works has moved the unknown rather than resolved it.

**Duplicate processing** is the state consequence of Chapter 3's at-least-once delivery. The architectural defence is a deduplication key with a stated scope and retention, applied at the point where the *effect* occurs. In the opening story, the fulfilment system deduplicated on a job identifier that the retry regenerated — so the mechanism existed and was keyed on the wrong thing. The key must identify the *business operation* (this order's fulfilment), not the message or attempt.

**Out-of-order processing** produces states a component's own state machine considers impossible: a `SHIPPED` event arriving before `PAID`. Two architectural responses are available. Carry a monotonic version or sequence number on the entity and ignore updates older than the current version. Or make the handler compute state from the full set of known facts rather than applying deltas. Both are design commitments; the alternative — assuming arrival order — is an unrecorded assumption that will eventually be violated.

**Migration state** deserves naming here because Chapter 10 depends on it. During any state migration, the system occupies a temporary architecture in which a fact may exist in two places with different values, and the reconciliation question becomes "which store is authoritative *today*." That intermediate ownership rule is itself an architecture decision, and it must be written down before the migration starts rather than discovered during it.

## Numerical Reasoning About State

The following are **bounded, synthetic worked examples**.

### Example 1 — Replication and storage consequence of a state split

| Field | Entry |
| --- | --- |
| Context | Atlas is considering splitting checkout state out of the shared order store into an isolated store. |
| Population | The current order store, sized at a synthetic 400 GB of logical data. |
| Assumptions | Replication factor 3 (one primary, two replicas) in both the current and proposed designs; 25% of logical data belongs to checkout; incremental backups average 3% of logical volume per day with 14-day retention; index and write-amplification overheads are excluded. |
| Units | Gigabytes (GB). |
| Calculation | Current physical footprint = 400 × 3 = **1,200 GB**. Backup = 400 × 0.03 × 14 = **168 GB**. Total ≈ **1,368 GB**. After the split: checkout store 100 × 3 = 300 GB; order store 300 × 3 = 900 GB; **combined 1,200 GB — unchanged**. Backup volume is likewise unchanged at 168 GB in aggregate. |
| Interpretation | The storage arithmetic is neutral. Splitting the store does not, by itself, cost or save storage. |
| Limitation | **The arithmetic captures the least important part of the cost.** The split creates a second store to provision, secure, monitor, patch, back up, restore-test, and migrate; a second set of connection budgets; and a cross-store correlation requirement for any query that previously joined. It also removes the ability to enforce a cross-entity invariant in one transaction. None of that appears in a storage figure, and a proposal justified on storage grounds is being justified on the wrong axis. |
| Decision relevance | Neutralises a storage argument in either direction. Redirects the decision to failure isolation, independent evolution, and operational capacity. |

### Example 2 — Unknown-outcome accumulation and reconciliation lag

| Field | Entry |
| --- | --- |
| Context | During a payment-provider degradation, checkout produces orders in `PAYMENT_UNKNOWN`. A scheduled reconciliation job resolves them by querying the provider. |
| Population | A synthetic 40-minute degradation window. |
| Assumptions | Unknown outcomes accrue at a steady 6 per minute during the window and none afterwards. The reconciliation job runs every 15 minutes and can query the provider at 4 orders/second for up to 60 seconds per run. The provider answers reconciliation queries normally throughout. |
| Units | Orders; orders per minute; orders per second; minutes. |
| Calculation | Accumulated unknowns = 6 × 40 = **240 orders**. Reconciliation capacity per run = 4 × 60 = **240 orders**. So one full run can clear the accumulated backlog. Worst-case time from an order entering `PAYMENT_UNKNOWN` to resolution = up to 15 minutes waiting for the next run + up to 60 seconds of run time ≈ **16 minutes**; mean wait ≈ 7.5 minutes + run time. |
| Interpretation | With these figures the mechanism is adequate in throughput but not in latency: a customer whose payment outcome is unknown waits an average of roughly eight minutes, and up to sixteen, before Atlas itself knows what happened. Whatever the customer is told during that window must be true at a sixteen-minute staleness. |
| Limitation | **The load-bearing assumption is the one most likely to be false.** The reconciliation query goes to the same provider whose degradation created the unknowns; assuming it answers at 4/s while degraded is assuming the failure has conveniently spared the recovery path. If the provider throttles or is unavailable, the backlog does not clear and the calculation says nothing about when it will. The steady-rate assumption also understates a bursty window. |
| Decision relevance | Supports a decision about reconciliation frequency and about what the order-status page says during an unknown window. Does not establish that reconciliation will work under the conditions that require it. |

## Worked Reasoning: Shared Checkout/Order State Versus Isolated State With Reconciliation

**Option A — Shared store.** Checkout, order management, and payment records live in one relational store. Order creation and payment-attempt recording commit in one transaction. Fulfilment jobs and notifications are dispatched from that store.

**Option B — Isolated state plus reconciliation.** Checkout owns a checkout store; order management owns an order store; payment attempt records live with payments. A correlation identifier links them, and a reconciliation process resolves cross-store contradictions.

### Invariants and how each option maintains them

| Invariant | Option A | Option B |
| --- | --- | --- |
| An order has exactly one payment outcome, or an explicit unknown | Enforceable by schema constraint and transaction | Application-maintained; requires reconciliation to detect violation |
| A paid order is fulfilled exactly once | Enforceable by unique constraint on (order, fulfilment) | Requires a deduplication key at the fulfilment boundary; violation detectable only after the fact |
| A cancelled order is not fulfilled | Enforceable within one transaction if fulfilment reads the same store | Race window exists between cancellation and fulfilment read; requires a compensating action |
| Finance's paid-order total matches payment records | One query | Cross-store reconciliation; a discrepancy is a normal operating condition to be measured, not an alarm |

### Comparative assessment

| Dimension | Option A | Option B |
| --- | --- | --- |
| Failure modes | A store fault or a long-running query affects checkout, orders, and payments together. Contention between checkout writes and finance reads is real. | A store fault affects one domain. New failure modes: cross-store contradiction, reconciliation lag, correlation-identifier loss. |
| Testability | Cross-entity invariants are assertable in one place, deterministically. Realistic multi-store failure cannot be exercised because there is only one store. | Each store is testable in isolation. Cross-store behaviour requires a correlation-aware test setup and controllable partial-failure seams — an architecture requirement (Chapter 7), not a test-tooling one. |
| Observability needs | Moderate: one store's health, one set of query metrics. | Substantially higher: correlation identifiers on every path, contradiction counts as a first-class signal, reconciliation lag as a measured quantity. Telemetry implementation is Part VIII's. |
| Evidence for "what happened" | Usually one join. This is a genuine and underrated advantage for support workflows. | Requires correlation across stores; strictly harder, and only as good as the identifier discipline. |
| Migration implications | The eventual split is expensive: every consumer, report, and support query must move, and a dual-write or dual-read period is unavoidable. | Paid now. The intermediate states of the migration itself must be designed (Chapter 10). |
| Residual risk | Coupled failure and contended capacity; the split remains a future liability that grows with every new consumer. | Contradictions become a permanent operating condition requiring ongoing measurement; reconciliation depends on dependencies that may be degraded exactly when needed. |

### The decision record

| Element | Entry |
| --- | --- |
| Context | Support cannot answer basic customer questions about payment and fulfilment; one shared store; four unrecorded consumers (Chapter 2). |
| Quality claim | For any order, Atlas can determine the authoritative payment outcome and the number of fulfilments performed, within a stated window. |
| Characteristic | Functional suitability and reliability; maintainability cost on both options. |
| Constraint | Four engineers; no second store currently operated; promotion in eight weeks. |
| Assumption | The provider offers a reconciliation query with contractual availability. **Unverified, and it is a prerequisite for both options.** |
| Trade-off | A keeps transactional invariants and one-join evidence, and defers a growing split cost. B buys failure isolation and independent evolution at an operational cost the current team may not be able to carry. |
| Failure mode | A: coupled failure under contention. B: reconciliation unavailable during the degradation that requires it. |
| Evidence needed | Provider reconciliation contract; consumer inventory (Chapter 2); measured contention between finance reads and checkout writes; a bounded prototype of correlation-identifier propagation. |
| Limitation | Operational cost of a second store cannot be established before operating one. |
| Decision | Not made here. The evidence supports doing three things first, all of which serve either option: verify the provider reconciliation contract, introduce the correlation identifier, and model `PAYMENT_UNKNOWN` and fulfilment deduplication explicitly in the current shared store. |
| Owner | Order-domain owner; payment-domain owner for the provider contract; platform owner for any second store. |
| Residual risk | The two duplicate fulfilments in the opening story remain unexplained until deduplication keying is corrected and historical jobs are audited. |
| Revision trigger | Provider contract change; a second team taking ownership of a domain; store contention exceeding an agreed threshold; the promotion window. |

The pattern from Chapters 2 and 3 repeats deliberately: the strongest contribution is identifying work that both options require and that would have prevented the incident, rather than advocating a topology.

## The State Ownership and Consistency Decision Record

This chapter's professional artefact is the **State Ownership and Consistency Decision Record** — an MSQE teaching artefact. It is organised by *fact*, not by table, because facts are what customers and support ask about.

| Field | Content |
| --- | --- |
| Fact | The business fact in plain language: "whether this order was paid." |
| Owner | The single authority for it. If the authority is external, say so explicitly. |
| Store and representation | Where it lives and in what form; note copies, caches, and projections separately. |
| Transactional boundary | What commits atomically with it, and — explicitly — what does not. |
| Partial-completion states | Each named state, its meaning, its legitimate exit, and its expected lifetime. |
| Read paths and guarantees | Per path: consistency guarantee and stated staleness window. |
| Cache | Key scope, TTL, invalidation strategy, backstop, and whether the value may be acted on or only displayed. |
| Duplicate handling | Deduplication key, its scope, its retention, and the point at which it is applied. |
| Ordering assumption | Whether handlers assume arrival order; if so, that is a recorded assumption, not a design. |
| Unknown / contradiction path | Correlation identifier, query interface, trigger, resolution rules including "no record found," **and the failure mode of reconciliation itself**. |
| Evidence | What a support agent can establish today, and what they can only infer. |
| Migration state | If a migration is in progress, which store is authoritative today and when that changes. |
| Owner of the decision | The accountable role. |
| Residual risk and revision trigger | What remains, and what would require reassessment. |

The **evidence** row is the one that turns this from a design document into a quality artefact. Filling in "a support agent can establish X; they can only infer Y" for each fact produces, in most systems, an uncomfortable and immediately actionable list.

## Engineering Perspective

Three architectural requirements recur across every state decision in this chapter, and all three are cheap to add at design time and expensive to retrofit.

**Correlation identifiers, generated before the operation.** They are the precondition for reconciliation, for cross-store evidence, and for answering "what happened." Generating one after a response arrives is useless, because the case that matters is the one where no response arrives.

**Explicit unknown and pending states.** A state model with only success and failure will encode a guess. Naming the intermediate state costs a schema value and a display string; not naming it costs support workflows and customer trust.

**Deduplication keyed on the business operation.** The opening story turned on this. A key that changes on retry is not a deduplication key, and its presence in the design gives false assurance.

Contradiction rate and reconciliation lag deserve to be treated as measured quantities rather than incident triggers. In any multi-store design, some contradictions are normal; the useful signal is a change in the rate. Instrumenting them is Part VIII's work, but requiring them to be instrumentable is this chapter's.

## Industry Perspective

Brewer's 2012 reassessment of CAP is instructive precisely because it is a retraction of a simplification he originated: he wrote that the "2 of 3" formulation had been misleading, that the choice between consistency and availability applies only during a partition and can be made at fine granularity, and that the substantive engineering work lies in detecting partitions, entering an explicit partition mode, and recovering afterwards.[^brewer] Abadi's PACELC framing adds the else-case that CAP omits — the latency-versus-consistency trade that governs normal operation.[^abadi]

The pattern is worth noting beyond CAP. A compressed heuristic circulates, becomes a slogan, gets applied as a classification scheme, and outlives its accuracy. Part XI's response is not to avoid such results but to state what they establish and where they stop.

## Common Misconceptions and Pitfalls

### "CAP means we must choose two of three."

Partition tolerance is not selectable; partitions occur. The real choice is what a specific path does during a partition, and one system makes different choices on different paths.

### "Eventual consistency means it'll be right in a moment."

It means replicas converge in the absence of new writes, with no guaranteed bound. Without a stated staleness window and a consequence analysis, "eventual" is a word standing in for a decision nobody made.

### "The database enforces our invariants."

It enforces the invariants inside its transactional boundary. Any invariant spanning a service call, a message, or a third party is maintained by application logic, compensation, or reconciliation — or not at all.

### "We have deduplication."

Deduplication keyed on a message identifier, an attempt identifier, or anything regenerated on retry does not deduplicate the thing that matters. Check what the key identifies and when it is generated.

### "Reconciliation solves the unknown outcome."

Only if reconciliation works under the conditions that produced the unknown — which is usually a degradation of the same dependency it must query. Reconciliation has failure modes and needs them recorded.

### "Splitting the store improves the architecture."

It changes which failures are isolated and which invariants are enforceable, and it adds operational cost. Whether that is an improvement depends on the constraint, the team, and the failure that is actually hurting.

## QA → QE Transition

The transition in this chapter is from checking that data eventually matches a fixture to specifying the intended state transition, the consistency window, the evidence gap, the reconciliation path, the owner, and the customer-facing consequence.

A QA Engineer verifies that after a successful checkout the order row shows `PAID`. A Quality Engineer asks which component owns the fact that payment succeeded; what the order page shows in the interval before it does; how long that interval can be; what a customer refreshing during it will see and whether they might pay again; what happens if the fulfilment message is delivered twice; whether the deduplication key survives a retry; what a support agent can *establish* rather than infer; and what the exit path is when the answer is unknown. The fixture assertion remains correct and remains necessary. It simply never touches the conditions that produced the opening story.

## Summary

State is where architecture decisions become durable and where the gap between what a system displays and what is true is widest. Ownership means one authority per fact, distinct from storage location and read access; where no owner exists, every contradiction becomes an investigation. Transactional boundaries narrower than a business operation create partial-completion states, which are real whether or not they are modelled. Consistency is a property of a read path with a stated staleness window, not a label for a system, and caches make staleness a correctness and authorisation question as well as a performance one. CAP describes what a system does *during a partition*, rejects the "choose any two" shorthand, and decides far less than it is asked to. Reconciliation is the exit path from unknown outcomes, and it has its own failure modes — usually a dependence on the very dependency whose failure created the unknown.

## Key Takeaways

- Ownership means one authority per fact; ask whose value wins when two components disagree.
- Ownership is not storage location and not read access.
- Any business operation wider than its transactional boundary creates partial-completion states; name them or encode a guess.
- The dual-write problem has no version in which it does not exist; only design responses with stated costs.
- Consistency guarantees belong to read paths, with an explicit staleness window and a consequence.
- Cache key scope is a security decision; acting on a cached entitlement extends a revoked permission for the staleness window.
- Partition tolerance is not a choice; the choice is stale-answer versus no-answer, per path, during a partition.
- Deduplication must key on the business operation, not on a message or attempt identifier.
- Reconciliation needs a correlation identifier created before the operation, and a stated failure mode of its own.

## Review Questions

1. A fact is stored in one component's database but written by three. Who owns it, and what evidence would settle the question?
2. Name three partial-completion states created by Atlas's "place an order" operation and state a legitimate exit for each.
3. Why is "choose any two" an inaccurate reading of the CAP result, and what is the accurate question it supports?
4. Why is a cache key's scope a security concern rather than only a performance concern?
5. In Example 2, which assumption is most likely to be false, and what does its failure do to the conclusion?
6. In the opening story, deduplication existed and did not work. What exactly was wrong, and what is the corrected design?

## Interview Questions

1. How would you determine whether a customer was charged when your system holds no payment record?
2. A team proposes splitting a shared database to improve reliability. What would you want established first?
3. What does "eventually consistent" need to be accompanied by before you would accept it in a design?
4. Describe how you would design evidence so that support can establish, rather than infer, what happened to an order.

## Practical Exercise

Produce a **State Ownership and Consistency Decision Record** for the following synthetic Atlas Commerce situation.

*Atlas is introducing store credit. Credit is issued when a refund is approved, is owned by a new credit module with its own store, and can be spent at checkout. Checkout must reduce the credit balance and create the order. The order-confirmation page shows the remaining balance, read through the existing catalogue cache layer for speed. Refund approval happens in the support console and calls the third-party payment provider for the card portion.*

Complete the record for **at least three facts**, one of which must be "the customer's current credit balance." Your submission must:

- name a single owner for each fact, or state explicitly that the authority is external;
- identify the transactional boundary for spending credit and name **every** partial-completion state it creates;
- state a consistency guarantee and staleness window for each read path, including the confirmation page;
- assess the cache decision: state the key scope, whether the balance may be acted on or only displayed, and identify the risk if a stale balance is used to authorise a purchase;
- specify a deduplication key for credit spending, its scope, retention, and the point at which it is applied, and explain why it survives a retry;
- design the unknown-outcome path for a refund whose provider call times out, **including reconciliation's own failure mode**; and
- complete the evidence row: what could a support agent establish, and what could they only infer?

Then state one invariant that cannot be enforced transactionally in this design, and describe how you would detect its violation. Do not propose a target architecture. Use synthetic data only.

## Further Reading

- [S. Gilbert and N. Lynch — Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services](https://doi.org/10.1145/564585.564601)
- [E. Brewer — CAP Twelve Years Later: How the "Rules" Have Changed](https://doi.org/10.1109/MC.2012.37)
- [D. Abadi — Consistency Tradeoffs in Modern Distributed Database System Design](https://doi.org/10.1109/MC.2012.33)

## References

[^gilbert-lynch]: Gilbert, S. and Lynch, N. [Brewer's Conjecture and the Feasibility of Consistent, Available, Partition-Tolerant Web Services](https://doi.org/10.1145/564585.564601). *ACM SIGACT News*, 33(2), pp. 51–59. June 2002. Accessed 2026-08-14.
[^brewer]: Brewer, E. [CAP Twelve Years Later: How the "Rules" Have Changed](https://doi.org/10.1109/MC.2012.37). *Computer*, 45(2), pp. 23–29. IEEE, February 2012. Accessed 2026-08-14.
[^abadi]: Abadi, D. [Consistency Tradeoffs in Modern Distributed Database System Design: CAP is Only Part of the Story](https://doi.org/10.1109/MC.2012.33). *Computer*, 45(2), pp. 37–42. IEEE, February 2012. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Identify the owner of a fact and distinguish ownership from storage location and read access.
- [ ] Name the partial-completion states created when a business operation exceeds its transactional boundary.
- [ ] State a consistency guarantee as a property of a read path with an explicit staleness window.
- [ ] Assess a cache decision for authorisation risk as well as freshness.
- [ ] State the CAP result accurately and say what it does not decide.
- [ ] Design a reconciliation path including its own failure mode.
- [ ] Complete a State Ownership and Consistency Decision Record with a populated evidence row.

## Chapter Navigation

Previous: [Chapter 3 — Communication, Time, and Failure Across Boundaries](chapter-03-communication-time-and-failure-across-boundaries.md) · Next: Chapter 5 — Architectural Styles and Decomposition Trade-offs *(planned; not yet drafted)*
