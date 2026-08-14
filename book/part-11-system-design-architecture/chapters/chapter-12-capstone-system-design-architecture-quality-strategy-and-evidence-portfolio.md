# Chapter 12 — Capstone: System Design & Architecture Quality Strategy and Evidence Portfolio

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 12 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–11 |
| Estimated study time | 6–10 hours across several sessions |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** The evidence will not tell you what to do. It will tell you what you would have to believe in order to do each thing. Say which of those beliefs you hold, and why, and you have made an architecture contribution.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform. Every figure, record, and observation in this chapter is synthetic and is provided for teaching. None of it describes a real company, product, or system.

Atlas Commerce has a decision to make about checkout and fulfilment, and it has run out of ways to defer it.

The immediate trigger is a request from the fulfilment side of the business. They want to ship changes to how partial shipments are grouped, and they want to do it during campaign periods rather than between them. Today that is impossible: fulfilment ships inside the same deployment artefact as checkout, and no one will release checkout during a campaign.

Behind that request sit a year of accumulated conditions. Checkout and fulfilment share the `orders` table with four other consumers, at least one of which nobody has fully enumerated. The payment provider degrades under load and has twice produced orders whose payment outcome Atlas could not establish. A promotion three weeks ago produced a seven-hour fulfilment backlog, three hundred and forty orders in `PAYMENT_UNKNOWN`, twelve duplicate fulfilments, and a cached order-status response served across customers. And fourteen months ago a migration that was planned for six weeks left a dual-write running that nobody owns.

The engineering director has asked for a recommendation. Not a design — a recommendation, with the reasoning attached, that another engineer can inspect and disagree with.

You have been given an evidence packet. It is incomplete. Parts of it conflict. Some of the most decision-relevant material is a measurement of something adjacent to what anyone actually wants to know. Two of the three options on the table are supported by different subsets of it.

There is no correct answer waiting to be found. There is a defensible recommendation to be constructed, and an indefensible one, and the difference between them is entirely in whether the reasoning survives inspection.

## Why This Chapter Matters

Every chapter in Part XI has ended with a decision that someone else owned. This one ends with a recommendation that you own — its scope, its evidence, its limitations, and its residual risk.

That is the shape of the work at the level this part is aimed at. Nobody hands a Quality Engineer an architecture decision. What they hand over is a situation, a partial evidence base, several people with incompatible confident views, and a deadline. The contribution is not to be right. It is to produce something that makes the decision inspectable: what is known, what is assumed, what the evidence cannot reach, what each option would require you to believe, and what would change your mind.

Three things distinguish this capstone from an exercise.

**The evidence conflicts.** Not because it is faulty, but because real evidence about a real system does. Two competent measurements can support opposite conclusions when they measure different things under different conditions, and reconciling that is the work.

**No option is the intended answer.** Option C is not the advanced choice, Option A is not the timid one, and Option B is not the balanced compromise. Each is defensible on some readings of the packet and rejectable on others.

**The brief is not solved for you.** This chapter demonstrates how to fill in `FACT`, `EVIDENCE`, `ASSUMPTION`, and `LIMITATION`, because those are craft skills with right and wrong answers. It deliberately does not fill in `DECISION`, `CONSEQUENCE`, `RESIDUAL RISK`, or `REVISION TRIGGER`. Those are yours.

## Learning Objectives

By the end of this capstone, you should be able to:

- define a bounded architecture-quality claim and a decision scope from an ambiguous business request;
- read an evidence packet critically, classifying items as fact, interpretation, limitation, or gap;
- identify where evidence conflicts, and determine whether the conflict is real or an artefact of differing boundaries;
- state what each architectural option requires you to believe, and which of those beliefs is unverified;
- integrate performance, security, reliability, testability, operability, and evolution consequences without combining them into a score;
- design a migration sequence with intermediate architectures, evidence gates, and honest reversibility;
- name the specialist evidence still required and the part of the discipline that owns producing it;
- write an Architecture Decision Brief using the required fields, with a decision scope you can defend; and
- assemble a portfolio that another engineer can inspect, challenge, and revise.

## What This Capstone Is and Is Not

| It is | It is not |
| --- | --- |
| An exercise in reasoning from incomplete, conflicting evidence to a bounded recommendation | A system-design interview question |
| A test of whether you can state what you do not know | A test of whether you can name patterns |
| An architecture-quality contribution with a named owner elsewhere | An architecture approval |
| Work you could show a colleague as an example of your reasoning | A production architecture review |
| Grounded in a synthetic scenario, clearly labelled | A description of any real system |

You will not draw a target architecture. You may sketch boundaries if it helps you think, but a diagram is an architecture *description* (Chapter 1) and no diagram is part of the required submission. Nothing in this capstone requires code, cloud access, a modelling tool, or a real system.

## The Decision

The request as received is: *"Let fulfilment ship independently of checkout, without breaking anything."*

That sentence is not yet decidable (Chapter 1). Before anything else, it needs a scope, a bounded claim, and a set of things it is explicitly not about.

The engineering director has provided one constraint on scope: **whatever is recommended must be safe to begin before the next campaign**, which is eleven weeks away. Work may extend past it; irreversible steps taken before it require justification.

Your first task in the workflow below is to convert the request into one or more bounded claims. The packet is arranged to support that work, not to pre-empt it.

## The Evidence Packet

Every item carries a stable identifier. Use the identifier when citing evidence in your brief, so that a reviewer can check what you relied on. Where an item repeats a measurement from an earlier chapter, that is stated, and **the value is identical** — reused evidence is the same evidence, not a new observation.

Items are grouped for readability. The grouping is not a priority order.

### Context, responsibilities, and structure

| ID | Evidence |
| --- | --- |
| **ARCH-CTX-01** | Atlas Commerce is a synthetic commerce platform with eight distinguishable responsibilities: account/identity, catalogue/search, checkout, payment, order management, fulfilment, notification, and support/refund. Customer surfaces are a storefront/web client behind an API edge. Third-party dependencies are an identity provider and a payment provider, both bounded. |
| **ARCH-RESP-01** | Catalogue/search, checkout, order management, notification, and fulfilment are separate modules within one deployment artefact. The fulfilment *worker* — which executes queued picking jobs — runs as a separate process. The fulfilment *module* — which decides what jobs to create — does not. |
| **ARCH-DEP-01** | Consumer inventory for the `orders` table, as of the most recent audit: notification module (reads `orderStatus` via a `switch` whose default branch is a no-op); support console (reads via a lookup map; renders blank on unknown values); fulfilment worker (reads; throws on unknown values); finance reconciliation job (reads via a `WHERE ... IN (...)` value list; silently excludes unknown values); partner logistics integration (read behaviour unknown); analytics pipeline (**not in the service catalogue; existence confirmed, behaviour unknown**). |
| **ARCH-DEPLOY-01** | Checkout, order management, catalogue, notification, and the fulfilment module ship as one artefact. Over the last 14 releases, checkout and order management shipped together on all 14. The fulfilment worker ships separately. |
| **ARCH-OWN-01** | One engineering team of four owns all eight responsibilities. There is no second team. Payment-provider commercial ownership sits with a commercial manager outside engineering. |

### State, consistency, and caching

| ID | Evidence |
| --- | --- |
| **ARCH-STATE-01** | The `orders` and `order_lines` tables are written by checkout and order management and read by five other consumers. Payment attempt records live in `payment_records`. Fulfilment jobs live in `fulfilment_jobs`. The authoritative record of *whether a customer was charged* is held by the payment provider, not by Atlas. |
| **ARCH-TXN-01** | Order row and order lines commit atomically. The payment call, the fulfilment job enqueue, and the notification dispatch do not participate in that transaction. Partial-completion states currently reachable: order exists with payment unknown; order paid with fulfilment job not created; order paid and fulfilled with customer not notified. |
| **ARCH-CONS-01** | Checkout reads its own writes from the primary. The order-status page reads from a read replica. The finance reconciliation job reads a nightly snapshot and is deliberately up to 24 hours stale. No staleness window has ever been stated for the order-status page. |
| **ARCH-CACHE-01** | The order-status page is cached with a 300-second TTL. Invalidation is TTL-only; a republished corrected event does not invalidate the cache. During the recent promotion this cache absorbed a substantial share of order-store read load; the exact share was not measured. |
| **ARCH-AUTHZ-01** | A verification record from the recent promotion shows one customer's order summary served to a different customer. The cache key was composed from the order identifier alone. Identity is verified at the API edge and is **not propagated** to the caching layer, so the personal dimension was not available to the engineer who wrote the key. Remediation status: cache disabled as an interim measure; permanent design undecided. |

### Communication, workload, and performance

| ID | Evidence |
| --- | --- |
| **ARCH-SYNC-01** | The synchronous checkout path issues calls sequentially: API edge, session validation, cart/pricing read, payment call, order write, own processing. |
| **ARCH-ASYNC-01** | Fulfilment work is queued and processed by workers. The queue is unbounded. There is no dead-letter handling; failed jobs are retried indefinitely. |
| **ARCH-LOAD-01** | Ordinary weekday peak checkout submissions: 260 per minute. Promotional peak: 400 per minute. Catalogue search rises to roughly four times ordinary weekday peak during a campaign. The promotional landing page composes results from six catalogue backend calls — the same six-call dependency set the catalogue search page uses, though the two pages are distinct and their traffic populations differ. |
| **ARCH-PERF-01** | Server-side checkout path timings with a healthy provider, per-call medians in milliseconds: edge 8, session validation 25, cart/pricing 40, payment call 180, order write 30, own processing 12. **Identical to the measurement introduced in Chapter 3.** Same measurement, same window, same boundary. |
| **ARCH-PERF-02** | A prototype benchmark comparing the current in-process checkout arrangement with an extracted arrangement, 200 requests per arm, **payment dependency stubbed**, warm, single-instance, no concurrency: means 250 ms and 190 ms respectively, standard deviation 90 ms in each arm. **Identical to the benchmark introduced in Chapter 9.** |

### Dependency behaviour and failure history

| ID | Evidence |
| --- | --- |
| **ARCH-PAY-01** | Payment provider median response 180 ms healthy; observed at approximately 4,000 ms during degradation. Client timeout 5 seconds. The provider's contract mentions a reconciliation query. **Whether it is contractually guaranteed, and how it behaves while the provider is degraded, has never been established.** |
| **ARCH-RETRY-01** | Checkout retries the payment call up to twice after an initial attempt, immediately, with no backoff, jitter, or overall time budget. Deduplication at the fulfilment boundary is keyed on a job identifier that is **regenerated on retry**, so it does not deduplicate. No idempotency key is carried on the payment call. |
| **ARCH-QUEUE-01** | During the recent four-hour promotional peak, fulfilment job arrival averaged 52 per second against a worker completion capacity of 38 per second. Post-campaign arrival returns to 30 per second. |
| **ARCH-FAIL-01** | Incident record, last 18 months. (i) A status-value addition caused notification to stop silently, the support console to render blank, and the finance settlement figure to be understated for four days before detection. (ii) A payment degradation produced duplicate card authorisations and orders Atlas could not answer questions about. (iii) The recent promotion: seven-hour fulfilment backlog, 340 orders in `PAYMENT_UNKNOWN`, 12 duplicate fulfilments, one cross-customer cached response. (iv) A migration planned for six weeks left a dual-write running for fourteen months with no owner, no comparison mechanism, and unmeasured drift between stores. |
| **ARCH-SEC-01** | Trust boundaries: the API edge (identity verified here); the payment provider; the support console's elevated role. Internal service-to-service calls carry no identity today, because there are no internal service-to-service calls — everything behind the edge is in-process. |

### Capability constraints

| ID | Evidence |
| --- | --- |
| **ARCH-TEST-01** | Nine payment failure modes are enumerated. With the provider SDK constructed inline as it is today, 3 of 9 can be produced deliberately. With a domain port and owned adapter, 7 of 9 could be. Modes 8 and 9 — a response arriving after Atlas gave up, and the provider processing a request whose response was lost — **cannot be produced by either design**, because they require divergence between Atlas's belief and the provider's record. **Identical to the assessment in Chapter 7.** |
| **ARCH-OBS-01** | The correlation identifier is generated inside the payment adapter, so it does not exist for a call that fails before the adapter records anything. Orders in `PAYMENT_UNKNOWN` cannot be enumerated. Reconciliation runs on a fixed 15-minute schedule and cannot be triggered on demand. No signal exists for cross-store drift, queue depth, or consumer lag. |
| **ARCH-OPS-01** | Operator interventions available today: redeploy; edit the database directly. There is no supported way to trigger reconciliation for one order, retry a single fulfilment job, cancel an in-flight operation, or remove a dependency from the path. |
| **ARCH-CONTRACT-01** | Consumer deployment cadences: three internal services weekly; the finance reconciliation job monthly; the partner logistics integration quarterly. A minimum safe deprecation window derived from these cadences is 180 days. Whether `orderStatus` is an open or a closed enumeration **has never been decided**. **Cadences and window identical to Chapter 8.** |

### Change, migration, and cost

| ID | Evidence |
| --- | --- |
| **ARCH-CHG-01** | **Reclassified evidence — read the provenance note.** Of the last 60 merged changes, 22 touched both the checkout and fulfilment modules — a 36.7% co-change rate. That rate is **reused evidence**, identical to Chapter 5. The breakdown of the 22 is **not**. Chapter 5 reported **14** of the 22 as fulfilment-only, classifying by *stated intent in the commit record*. A subsequent manual read of the same 22 changes, applying a tighter definition — work whose substance concerned fulfilment alone and which touched checkout only because the code required it — classified them as: **9** fulfilment-only work forced through checkout code; **8** single features genuinely spanning both responsibilities; **5** unclassifiable from the commit record alone. |
| **ARCH-CHG-01 provenance note** | **14 and 9 answer different questions and neither supersedes the other.** Chapter 5's 14 counts changes whose *stated intent* was fulfilment; ARCH-CHG-01's 9 counts changes whose *substance* was fulfilment-only under a stricter reading. The 5 unclassifiable changes are precisely where the two definitions diverge most. Chapter 5's figure must **not** be silently overwritten with 9 — it remains correct for the question it asked. The gap between the two counts is itself evidence: a co-change rate is highly sensitive to classification definition, which is a reason to treat any single figure derived from it with caution. A learner citing either number must say which definition it uses. |
| **ARCH-MIG-01** | Ten touchpoints are affected by a checkout/fulfilment separation: four direct consumers of order state, three support workflows, two reports, one partner integration. **Identical enumeration to Chapter 10**, and subject to the same caveat: ARCH-DEP-01 shows the enumeration is incomplete. |
| **ARCH-COST-01** | The order store holds 400 GB of logical data at replication factor 3, giving a 1,200 GB physical footprint, plus 168 GB of backup at the current retention. Splitting 25% of the logical data into a second store leaves the aggregate physical footprint unchanged at 1,200 GB. **Identical to the calculation in Chapter 4.** No figure exists for the operational cost of a second store, because Atlas has never operated one. |
| **ARCH-TEAM-01** | Four engineers. No second team is funded. Two of the four have never operated a message broker. The engineer who wrote the fourteen-month dual-write shim has left the team. |

### Option assumptions, gaps, risks, and triggers

| ID | Evidence |
| --- | --- |
| **ARCH-OPT-A-01** | Option A rests on **three** independent unverified beliefs. (i) That a build-time dependency check will not be bypassed under campaign pressure — no precedent either way at Atlas. (ii) That the domain port can be shaped from one payment provider's semantics without leaking them, which ARCH-TEST-01 assumes and no evidence supports. (iii) That the enumeration question in ARCH-CONTRACT-01 — open or closed — can be decided by the order-domain owner without partner negotiation. If (iii) is false, Option A's contract work is blocked behind a commercial conversation on ARCH-CONTRACT-01's quarterly cadence. |
| **ARCH-OPT-B-01** | Option B rests on **four** independent unverified beliefs, and no one of them is decisive on its own. (i) That product will accept a delayed payment confirmation. (ii) That the provider's reconciliation query is contractually available and functions while the provider is degraded. (iii) That Atlas can make the pending-order population *enumerable and interveneable* — ARCH-OBS-01 and ARCH-OPS-01 say it currently cannot do either, and Option B multiplies that population. (iv) That the fulfilment queue can be bounded, or that ARCH-QUEUE-01's seven-hour drain is acceptable when checkout no longer blocks and order volume through the queue therefore rises. Belief (ii) failing removes a mitigation; belief (iii) failing removes the ability to operate the design at all. |
| **ARCH-OPT-C-01** | Option C rests on **four** independent unverified beliefs. (i) That four engineers can operate two deployment units and two stores through a campaign — ARCH-FAIL-01 (iv) is the only precedent and it is unfavourable. (ii) That the consumer enumeration in ARCH-DEP-01 can be completed, without which its decommissioning stage has an unsatisfiable precondition. (iii) That a store comparison can be built and watched for the duration of a dual-write, which ARCH-FAIL-01 (iv) records Atlas failing to do. (iv) That cross-store reconciliation for `PAYMENT_UNKNOWN` works, which is a strictly harder version of Option B's belief (ii) because it must hold across two stores as well as against the provider. |
| **ARCH-GAP-01** | Known evidence gaps: the analytics pipeline's read behaviour; the partner integration's tolerance of new status values; the provider reconciliation contract; the cache's actual share of order-store read load; the operational cost of a second deployment unit; whether the identity dimension can be made available at the caching layer. |
| **ARCH-RISK-01** | Standing residual-risk indicators: payment failure modes 8 and 9 are unsimulable under any design; consumers outside the catalogue cannot be assessed; provider behaviour under real degradation cannot be established in a synthetic environment; the shared order store means store-level failure has 100% blast radius under every option currently proposed. |
| **ARCH-TRIG-01** | Conditions already identified as warranting reassessment of any decision taken: a change to the provider's timeout, retry, or reconciliation semantics; a second team becoming available; a new consumer of `orders` appearing; a further status-value addition; a decision on open versus closed enumeration; the campaign window closing. |

## Numerical Evidence

Each calculation below is inspectable and independently checkable. None produces a score, and none decides an option.

### N-1 — Synchronous checkout path composition (from ARCH-SYNC-01, ARCH-PERF-01, ARCH-PAY-01)

| Field | Entry |
| --- | --- |
| Context | What the payment call contributes to the synchronous checkout path, healthy and degraded. |
| Population and boundary | Server-side checkout path only; sequential calls; excludes client network and render. |
| Assumptions | Per-call figures are medians in the same window; calls strictly sequential; no retries. |
| Units | Milliseconds; percentages. |
| Calculation | Healthy: 8 + 25 + 40 + 180 + 30 + 12 = **295 ms**; payment share 180 ÷ 295 = **61.0%**. Degraded (payment 4,000 ms): 8 + 25 + 40 + 4,000 + 30 + 12 = **4,115 ms**; payment share **97.2%**. Path with the payment call removed from the synchronous sequence: 295 − 180 = **115 ms**. |
| Interpretation | The payment dependency dominates the healthy path and monopolises the degraded one. Removing it from the synchronous sequence is the only change with a large latency effect. |
| Limitation | A sum of medians is not the median of a sum. Excludes client-side time, so this is not customer-experienced latency. The 115 ms figure describes the *remaining* path, not the customer's total time to a confirmed order — under an asynchronous design the customer waits less and the order is confirmed later. |

### N-2 — Promotional fulfilment backlog (from ARCH-QUEUE-01, ARCH-ASYNC-01)

| Field | Entry |
| --- | --- |
| Context | How long the fulfilment backlog from the recent promotion persisted after demand normalised. |
| Population and boundary | The fulfilment job queue during and after a four-hour promotional peak. **This is a different window and different rates from the ten-minute example in Chapter 3; the figures are not interchangeable.** |
| Assumptions | Steady arrival at 52 jobs/s during the peak and 30 jobs/s afterwards; steady worker capacity of 38 jobs/s throughout; unbounded queue; retries contribute nothing to arrivals; worker throughput does not degrade as the queue grows. |
| Units | Jobs per second; jobs; hours. |
| Calculation | Imbalance during peak = 52 − 38 = **14 jobs/s**. Accumulated over 4 hours (14,400 s) = **201,600 jobs**. Drain rate afterwards = 38 − 30 = **8 jobs/s**. Drain time = 201,600 ÷ 8 = 25,200 s = **7.0 hours**. |
| Interpretation | A four-hour demand event produced seven hours of continued delay, which matches the observed incident in ARCH-FAIL-01 (iii). The customer-visible consequence outlasted its cause by nearly twice over. |
| Limitation | Steady-rate assumptions are the weakest part; real arrival is bursty. ARCH-RETRY-01 shows retries are unbounded and do feed back into arrivals, which the model excludes — so 7.0 hours is a floor, not an estimate. An unbounded queue is itself an assumption worth challenging. |

### N-3 — Change coupling, re-read (from ARCH-CHG-01)

| Field | Entry |
| --- | --- |
| Context | Whether checkout and fulfilment are coupled in a way a boundary change would relieve. |
| Population and boundary | The last 60 merged changes to the deployment artefact; a change "touches" a module if it modifies a file in that module's directory. |
| Assumptions | Directory membership represents module membership; the window is representative; the manual classification of intent is accurate. |
| Units | Counts of changes; percentages of 60. |
| Calculation | Co-change = 22 ÷ 60 = **36.7%**. Of the 22: fulfilment-only work forced through checkout = 9 ÷ 60 = **15.0%**; single features genuinely spanning both = 8 ÷ 60 = **13.3%**; unclassifiable = 5 ÷ 60 = **8.3%**. |
| Interpretation | **The re-read does not settle the question it was run to settle.** Only the 15.0% is coupling a boundary change would relieve. The 13.3% would survive a separation and become more expensive, since a cross-boundary feature requires coordinated release and compatibility management. The 8.3% is unknown. On the most favourable reading a separation addresses 15% of changes; on the least favourable it addresses 15% while making 13.3% worse. |
| Limitation | The classification is a judgement about intent made from commit records by one reader; it has not been independently repeated. Directory membership is a proxy. A 60-change window may not represent campaign-period work, which is the work the request is actually about. |

### N-4 — Canary detection floor for a staged rollout (from ARCH-LOAD-01, ARCH-MIG-01)

| Field | Entry |
| --- | --- |
| Context | Whether a small-percentage canary during a campaign could detect a new failure mode introduced by a boundary change. |
| Population and boundary | Checkout submissions at promotional peak; a routing split sending a fraction of traffic to a new path. |
| Assumptions | Promotional peak of 400 checkout submissions per minute; a canary at 5% of traffic; the failure mode in question occurs on 0.1% of affected checkouts; roughly five occurrences are needed before the signal is distinguishable from noise; occurrences are independent. |
| Units | Checkouts per minute; occurrences; minutes and hours. |
| Calculation | Canary volume = 400 × 0.05 = **20 checkouts/min**. Expected occurrences = 20 × 0.001 = **0.02/min**. Time to roughly five occurrences = 5 ÷ 0.02 = **250 minutes ≈ 4.2 hours**. |
| Interpretation | A 5% canary run for thirty minutes cannot detect a 0.1% failure mode; it would be expected to produce well under one occurrence. Either the canary percentage rises — increasing exposure — or it runs for hours, or the plan accepts that low-rate failure modes will reach full traffic undetected. |
| Limitation | The "five occurrences" threshold is a rule of thumb, not a statistical test, and a proper detection analysis is Part X's territory. The 0.1% rate is assumed, not measured — nobody knows the rate of a failure mode that has not occurred yet. The arithmetic also assumes the failure is *visible* when it occurs; ARCH-FAIL-01 (i) and ARCH-OBS-01 together indicate that Atlas's characteristic failure mode is silent, in which case the detection time is not 4.2 hours but unbounded. |

### N-5 — Storage consequence of a state split (from ARCH-COST-01)

| Field | Entry |
| --- | --- |
| Context | Whether splitting the order store carries a storage cost. |
| Population and boundary | The order store; logical data volume of 400 GB. |
| Assumptions | Replication factor 3 before and after; 25% of logical data moves; backup at 3% of logical volume daily with 14-day retention; index and write-amplification overheads excluded. |
| Units | Gigabytes. |
| Calculation | Current physical = 400 × 3 = **1,200 GB**; backup = 400 × 0.03 × 14 = **168 GB**. After split: 100 × 3 = 300 GB and 300 × 3 = 900 GB, **combined 1,200 GB — unchanged**. |
| Interpretation | Storage is neutral. Any argument for or against the split on storage grounds is arguing about the wrong quantity. |
| Limitation | The figure omits everything that actually costs: a second store to provision, secure, patch, monitor, back up, restore-test, and migrate; a second connection budget; cross-store correlation for queries that previously joined; and the loss of transactional enforcement for cross-entity invariants. ARCH-COST-01 records that Atlas has no figure for any of these because it has never operated a second store. |

## Where the Evidence Conflicts

This is the section to read twice. The conflicts below are not defects in the packet; they are what a real evidence base looks like when several competent measurements are placed side by side.

| # | Conflict | Supports | Opposes | What resolves it, or why nothing does |
| --- | --- | --- | --- | --- |
| 1 | N-1 shows removing payment from the synchronous path cuts 61% of the healthy path; ARCH-FAIL-01 (ii) and ARCH-OBS-01 show Atlas has repeatedly failed to manage pending state. | An asynchronous boundary (Option B) | An asynchronous boundary | Nothing in the packet. This is a judgement about whether Atlas's difficulty is better placed where it has measurement or where it has a poor record. |
| 2 | ARCH-PERF-02 favours extraction; it stubbed the payment dependency and measured two in-process arrangements. | Extraction (Options B, C) | — | The benchmark does not measure extraction. It cannot be repaired by rerunning it; the instrument is pointed elsewhere (Chapter 9). |
| 3 | N-3's 15.0% supports separation; its 13.3% is made *worse* by separation. | Separation | Separation | Independent re-classification of the 22 changes, and a separate read of campaign-period changes. Both are days of work. |
| 4 | ARCH-TEST-01 shows a domain port raises simulable failure modes from 3/9 to 7/9. | A stronger boundary (all options) | — | Nothing — but note that modes 8 and 9, the two implicated in every payment incident, remain unsimulable. The improvement is real and does not reach the failures that occurred. |
| 5 | A simplified availability composition improves when a dependency leaves the required path; ARCH-STATE-01 shows every option retains the shared order store. | Any option | All options equally | Nothing. Store-level failure is common-mode across A, B, and C, so availability arithmetic that varies by option is measuring the failure class Atlas has not had. |
| 6 | ARCH-CACHE-01 shows the cache absorbed substantial read load; ARCH-AUTHZ-01 required disabling it. | Restoring the cache | Restoring the cache | The share it absorbed was never measured (ARCH-GAP-01), so the performance cost of the security fix is unknown. This is a measurable gap, not a limitation. |
| 7 | ARCH-DEPLOY-01 shows checkout and order management shipped together on 14 of 14 releases; ARCH-CHG-01 shows only 36.7% of changes touch both modules. | Deployment coupling is the binding problem | Deployment coupling is the binding problem | These do not contradict — one measures release practice, the other code touch. Together they suggest releases may be coupled by process rather than by code, which no option currently addresses. |
| 8 | ARCH-MIG-01 enumerates 10 touchpoints; ARCH-DEP-01 shows the enumeration is incomplete. | A staged migration plan | Any migration plan with a decommissioning stage | Completing the consumer inventory. Until then, any plan's final stage has an unsatisfiable precondition. |

Conflict 7 deserves particular attention because it is the kind most often missed. Two measurements appear to disagree, and they do not — they have different boundaries. Reconciling them produces a hypothesis nobody had: that the release coupling may be organisational rather than architectural, in which case an architectural change addresses a symptom of something else. Checking that is cheap and it appears in none of the three options.

## The Three Options

Each option below is defensible on some reading of the packet. None is the intended answer, and the order is not a ranking.

### Option A — Improve the existing modular architecture

Enforce the fulfilment module boundary with a build-time dependency check; remove direct `orders` access from checkout; record the `orderStatus` enumeration as open or closed and define required unknown-value behaviour; introduce a domain port for the payment adapter; add a retry budget with backoff and jitter; correct deduplication keying to the business operation; generate the correlation identifier before the payment call; make `PAYMENT_UNKNOWN` enumerable. One artefact, one store, one deployment.

| Aspect | Position |
| --- | --- |
| Addresses | The 15.0% of changes in N-3; ARCH-TEST-01 (3/9 → 7/9); ARCH-OBS-01 and ARCH-OPS-01 substantially; ARCH-RETRY-01 entirely; the enumeration question in ARCH-CONTRACT-01. |
| Does not address | The stated request. Fulfilment still cannot ship independently. |
| Requires you to believe | ARCH-OPT-A-01, all three parts: that an enforced check survives campaign pressure; that a port shaped from one provider does not leak its semantics; and that the open/closed enumeration question is Atlas's alone to decide. |
| Strongest argument for | It removes the mechanisms behind three of the four incidents in ARCH-FAIL-01 and is reversible in hours. |
| Strongest argument against | It answers a question nobody asked while leaving the one they did ask untouched. |

### Option B — Extract a bounded responsibility and introduce a bounded asynchronous workflow

Checkout validates, creates the order in an explicit pending state, and returns; a worker resolves payment asynchronously with reconciliation. Fulfilment becomes a separately deployed unit consuming an order-ready event. Shared store retained.

| Aspect | Position |
| --- | --- |
| Addresses | N-1 (115 ms synchronous path); the stated request; failure isolation between checkout and a degraded provider; the seven-hour backlog becomes decoupled from customer-facing checkout. |
| Does not address | The shared store (conflict 5); store-level blast radius; the incomplete consumer inventory. |
| Requires you to believe | ARCH-OPT-B-01, all four parts. Note that (iii) — that the pending population can be made enumerable and interveneable — is load-bearing independently of the reconciliation contract: a working reconciliation query that nobody can trigger for a single order, against a population nobody can list, does not produce an operable system. |
| Strongest argument for | It is the only option that moves the payment dependency off the path that dominates both the latency and the incident history. |
| Strongest argument against | It expands the population of orders in pending state, and ARCH-OBS-01 and ARCH-OPS-01 show Atlas currently cannot enumerate, inspect, or intervene in that state at all. |

### Option C — Adopt a larger decomposition and migration

Fulfilment becomes a separately deployed unit with its own store; consumers migrate one at a time; the shared `orders` dependency is dissolved over a multi-stage migration with dual-write, comparison, authority transfer, per-consumer migration, and decommissioning.

| Aspect | Position |
| --- | --- |
| Addresses | Ownership of state; independent evolution; the data-coupling mechanism behind ARCH-FAIL-01 (i); the request, fully. |
| Does not address | Anything before its later stages complete. Its early stages leave Atlas in a worse intermediate architecture than it has today. |
| Requires you to believe | ARCH-OPT-C-01, all four parts. Belief (ii) — the completability of the consumer enumeration — is the one that gates the option's final stage, and it is a belief Options A and B do not require in the same form. |
| Strongest argument for | It is the only option that addresses the shared-store coupling that conflict 5 shows is common-mode across the others. |
| Strongest argument against | Its decommissioning stage has an unsatisfiable precondition (conflict 8), and Atlas has a documented fourteen-month failure to complete exactly this kind of migration. |

**A note on combination.** The options are not mutually exclusive, and a defensible recommendation may sequence them, take part of one, or reject all three in favour of something the packet supports better. If you propose a combination, the same discipline applies: what does each component require you to believe, and what does it cost.

### There is no single pivot

Chapter 11 worked a narrower decision — how to respond to three promotion findings — and reached a conditional position resting on one unverified fact: whether the provider's reconciliation query is contractually available and functions under degradation. That reasoning is sound for the decision it addressed, and **it does not transfer to this one.**

This decision is wider, and the packet is deliberately arranged so that **no single fact determines the recommendation**. Six substantially independent tensions are in play, each capable of changing the answer on its own:

| Axis | The tension | Which options it bears on |
| --- | --- | --- |
| **Provider reconciliation** | ARCH-PAY-01, ARCH-OPT-B-01 (ii). Governs whether an unknown outcome is resolvable. | B strongly; C in a harder cross-store form |
| **State ownership and common-mode failure** | Conflict 5 with ARCH-STATE-01 and ARCH-RISK-01. Every option retains the shared order store, so store-level blast radius stays at 100% under A, B, **and** C. Only C's later stages touch it, and only after the stages that are hardest to reverse. | All three, and it equalises them where they claim to differ |
| **Operability and observability floor** | ARCH-OBS-01 and ARCH-OPS-01. `PAYMENT_UNKNOWN` cannot be enumerated, reconciliation cannot be triggered per order, and the only interventions are redeploy and a database edit. Any option that increases pending state without raising this floor is unoperable regardless of its other merits. | B most acutely; C compounds it across two stores |
| **Compatibility and the unenumerable consumer** | ARCH-DEP-01, ARCH-CONTRACT-01, conflict 8. The enumeration is incomplete and the open/closed enumeration question is undecided, which leaves a 180-day deprecation window resting on a consumer list known to be short. | C's final stage cannot proceed; A's contract work may be gated commercially |
| **Team operating capacity** | ARCH-TEAM-01 with ARCH-FAIL-01 (iv). Four engineers, two of whom have never operated a broker, and one documented failure to complete a migration of exactly the proposed shape. | B and C; it is the axis on which C is most exposed |
| **Classification sensitivity of the core evidence** | ARCH-CHG-01 and its provenance note. The most-cited number in the packet yields 23.3% or 15.0% depending on definition, and 13.3% of changes would be made *worse* by separation. | The premise of separating at all |

Resolving the reconciliation question alone leaves five of these six untouched. A recommendation that treats it as decisive — including one imported from Chapter 11 — will be strong on one axis and silent on the rest, and stage 11 of the workflow exists to catch exactly that.

Two consequences for your work. **Test whether Chapter 11's conditional still holds under this packet**, rather than assuming it does; the wider evidence may support, qualify, or overturn it. And **state which axes your recommendation is exposed to and which it is not** — a recommendation that is robust on four axes and fragile on two is a better contribution than one that claims to have settled everything.

## The Investigation Workflow

Twelve stages. They are **revisitable**, not sequential: evidence found at stage 7 routinely invalidates work at stage 1, and a workflow that does not loop is a checklist pretending to be an investigation. Record when you return to an earlier stage and what caused it — that record is part of the portfolio.

| Stage | Work | Typical trigger to revisit |
| --- | --- | --- |
| 1 | **Define decision scope and claims.** Convert the request into bounded, falsifiable claims (Chapter 1). State what the decision is explicitly not about. | A later stage shows the claim was unfalsifiable or the scope excluded something material. |
| 2 | **Validate evidence boundaries.** For each packet item you intend to rely on, establish what it measures, under what conditions, and what it cannot reach. | Discovering two items have different boundaries (conflict 7). |
| 3 | **Map responsibilities and dependencies.** Use ARCH-RESP-01, ARCH-DEP-01, ARCH-OWN-01. Identify boundary divergences (Chapter 2). | A consumer surfaces that was not in the inventory. |
| 4 | **Examine communication and state conditions.** Use ARCH-SYNC-01, ARCH-ASYNC-01, ARCH-TXN-01, ARCH-STATE-01, ARCH-RETRY-01. Identify partial-completion states and unknown-outcome paths (Chapters 3–4). | An option introduces a state you had not modelled. |
| 5 | **Validate quality scenarios.** Express the concerns as scenarios with response measures (Chapter 6). Check each measure is obtainable given ARCH-OBS-01. | A measure turns out to be unobservable, requiring the scenario to be revised or marked. |
| 6 | **Compare option assumptions.** For each option, state what it requires you to believe and whether that belief is verified. | An assumption turns out to be checkable, changing its weight. |
| 7 | **Investigate conflicting evidence.** Work the conflict table. For each conflict, determine whether it is real, an artefact of differing boundaries, or a gap that could be closed. | Almost always sends you back to stage 2 or 6. |
| 8 | **Identify specialist evidence still required.** Name what Parts VIII and X would need to produce, and what remains unreachable. | A specialist question turns out to be architectural after all, or vice versa. |
| 9 | **Compare migration and reversibility conditions.** For each option, design the intermediate architectures, evidence gates, and reversibility with expiry (Chapter 10). | An intermediate turns out to be worse than either endpoint for longer than tolerable. |
| 10 | **Draft the decision brief.** Populate the required fields. | Populating `LIMITATION` honestly often invalidates a draft `DECISION`. |
| 11 | **Challenge the recommendation.** Argue the strongest case against your own conclusion. Work each of the six axes in turn and state which your recommendation is exposed to and which it is robust against. | This stage should send you back at least once. If it does not, you have not challenged hard enough. |
| 12 | **Define revision triggers.** State the observations that would require reassessment, as observable events (Chapter 9). | A trigger you write turns out to be unobservable given ARCH-OBS-01. |

## The Architecture Decision Brief

Your brief must use these fields, with these names. Four optional fields may be added where they carry information the required fields do not.

| Field | Required purpose |
| --- | --- |
| CONTEXT | State the relevant system, user outcome, and decision scope. |
| QUALITY CLAIM | State the outcome or quality concern under consideration. |
| CONSTRAINT | Record a limiting condition that options must respect. |
| FACT | State only what the evidence directly supports. |
| EVIDENCE | Identify the source, scope, and relevance of supporting material. |
| ASSUMPTION | Record an unverified condition on which the reasoning depends. |
| OPTION | Name and describe a defensible architectural alternative. |
| TRADE-OFF | State the benefit gained and cost, risk, or capability made harder. |
| FAILURE MODE | Describe how the option can fail or degrade. |
| LIMITATION | State what the analysis or evidence cannot establish. |
| MITIGATION | Describe a proportionate risk-reduction action. |
| OWNER | Identify the role accountable for the next decision or action. |
| DECISION | Record the recommended or chosen direction and its scope. |
| CONSEQUENCE | State expected and adverse consequences. |
| RESIDUAL RISK | Record risk that remains after the decision or mitigation. |
| REVISION TRIGGER | State the observation or changed condition that requires reassessment. |

Optional, used only where needed: **EVIDENCE GAP**, **UNCERTAINTY**, **MIGRATION CONDITION**, **ESCALATION**.

### Worked examples of four fields

The four fields below are demonstrated because they are craft skills with recognisably better and worse answers. **The remaining fields — and in particular `DECISION`, `CONSEQUENCE`, `RESIDUAL RISK`, and `REVISION TRIGGER` — are deliberately not filled in.** Those are the judgement the capstone exists to exercise, and a worked version would remove it.

**FACT** — only what the evidence directly supports, with its scope attached.

| Weak | Better |
| --- | --- |
| "Checkout is slow." | "With a healthy provider, the payment call is 180 ms of a 295 ms server-side sequential path (ARCH-PERF-01, N-1). This is a sum of per-call medians and is not a customer-experienced latency." |
| "The consumer inventory is complete." | "Six consumers of `orders` are identified; one of the six is not in the service catalogue and its read behaviour is unknown (ARCH-DEP-01)." |
| "Extraction improves performance." | "A prototype comparing two in-process arrangements with the payment dependency stubbed showed means of 250 ms and 190 ms (ARCH-PERF-02)." |

**EVIDENCE** — source, scope, and relevance, including relevance you are declining to claim.

| Weak | Better |
| --- | --- |
| "ARCH-PERF-02 supports extraction." | "ARCH-PERF-02 measures two in-process code arrangements with payment stubbed. It bears on neither independent deployment nor failure containment, and I am not relying on it for either. I cite it only to note that it has been offered as support for a claim it does not address." |
| "The co-change data supports separation." | "ARCH-CHG-01 and N-3 establish a 36.7% co-change rate. Only the 15.0% classified as fulfilment-forced-through-checkout bears on separation; the 13.3% classified as genuinely spanning bears against it. I treat this item as ambiguous and rely on it for neither direction." |

**ASSUMPTION** — an unverified condition stated as something checkable, with its status.

| Weak | Better |
| --- | --- |
| "We assume the migration will go well." | "I assume the provider's reconciliation query is contractually guaranteed and functions during provider degradation (ARCH-PAY-01, ARCH-OPT-B-01). **Unverified.** It is checkable within one day by the commercial owner. If false, Option B's principal failure mode has no mitigation." |
| "We assume the team can handle it." | "I assume four engineers can operate two deployment units through a campaign (ARCH-OPT-C-01). **Unverified, and the only precedent — ARCH-FAIL-01 (iv) — is unfavourable.** Not checkable in advance; it can only be estimated." |

**LIMITATION** — what no amount of evidence within reach will establish, distinguished from a gap that could be closed.

| Weak | Better |
| --- | --- |
| "We need more data." | "Payment failure modes 8 and 9 cannot be produced under any adapter design, because they require divergence between Atlas's record and the provider's (ARCH-TEST-01, ARCH-RISK-01). This is a limitation, not a gap: it will not be closed by effort, and it must be carried as residual risk with an owner." |
| "The cache impact is unknown." | "The cache's share of order-store read load was not measured (ARCH-CACHE-01, ARCH-GAP-01). This is a **gap**, not a limitation — it is measurable in the next campaign rehearsal — and I record it as work rather than as risk." |

The distinction in the final row is the one most often lost. A limitation carried as a gap generates work that cannot succeed; a gap carried as a limitation quietly accepts a risk that was cheap to remove.

## The Portfolio

Your submission is a **System Design & Architecture Quality Strategy and Evidence Portfolio**. It should be something you could show a colleague as an example of your reasoning, without either overstating it or apologising for it.

| Component | Requirement |
| --- | --- |
| **Synthetic-scenario disclosure** | An explicit statement, at the top, that Atlas Commerce is a fictional teaching scenario and that no figure describes a real system. |
| **Decision scope and claims** | The bounded claims from stage 1, and an explicit statement of what the decision is not about. |
| **Evidence register** | Every packet item you relied on, by identifier, with what you took from it and what you declined to take from it. |
| **Evidence provenance and version notes** | For each item: what it measured, under what conditions, when. Where an item is reused from an earlier chapter, note that it is the same measurement rather than a fresh one. |
| **Classification** | Each relied-upon item marked fact, interpretation, limitation, or evidence gap (Chapter 9). |
| **Conflict analysis** | For each conflict you engaged with: whether it is real, an artefact of boundaries, or a closeable gap — and how you handled it. |
| **Quality scenarios** | The scenarios from stage 5, with response measures marked obtainable or not (Chapter 6). |
| **Options considered** | All three, plus any combination you constructed, each with what it requires you to believe. |
| **Alternatives rejected, with reasons** | Including your reason for rejecting the option you came closest to choosing. |
| **Migration and reversibility** | For your recommendation: intermediate architectures, evidence gates, reversibility with expiry, and rollback symmetry (Chapter 10). |
| **Integrated implications** | Performance, security, and reliability stated **separately**, never combined into a rating (Chapter 11). |
| **Specialist handoffs** | What Parts VIII and X would need to produce, stated as questions they could answer. |
| **Decision brief** | All required fields, populated. |
| **Residual risk and owners** | What remains, and the accountable role for each item. |
| **Revision triggers** | Observable events, not aspirations. |
| **Ownership statement** | An explicit statement that you are contributing a recommendation and that the architecture, product, release, security, or operational authority owns the decision. |

### Completion criteria

A portfolio is complete when a reviewer who disagrees with your recommendation can nonetheless say: *I can see exactly what you relied on, what you assumed, what you could not establish, and what would change your mind.*

| Criterion | Met when |
| --- | --- |
| Traceability | Every claim cites a packet identifier or is marked as your own interpretation. |
| Honesty about conflict | At least three conflicts are engaged with, including one you could not resolve. |
| Ambiguity preserved | Evidence that is genuinely ambiguous (N-3) is not presented as supporting your conclusion. |
| No score | No composite rating, weighted total, or option ranking by number appears anywhere. |
| Falsifiability | You have named, for **each axis your recommendation is exposed to**, the fact whose falsity would damage it — and you have said which axes it is not exposed to. |
| Scope discipline | Your recommendation's scope is narrower than "the architecture" and you say what it excludes. |
| Ownership | You have not claimed to approve anything. |

### Common ways this capstone goes wrong

**Choosing an option and then reading the packet for support.** The tell is that ambiguous evidence — N-3, conflict 7 — appears on only one side of your analysis.

**Importing Chapter 11's conditional wholesale.** Chapter 11 reached a defensible position on a narrower decision by treating the provider reconciliation contract as pivotal. Carrying that conclusion here without testing it against the wider packet leaves five of the six axes unexamined — most consequentially the operability floor in ARCH-OBS-01 and ARCH-OPS-01, which can make an option unworkable even when its reconciliation question resolves favourably.

**Treating any one fact as decisive.** A submission whose entire case rests on a single unverified condition has usually found the axis it understands best rather than the one that matters most.

**Producing a score.** Weighting the options across quality attributes and totalling them. This looks rigorous and it converts your judgement into arithmetic while concealing whose judgement it was.

**Recommending Option C because it is the most sophisticated.** ARCH-TEAM-01 and ARCH-FAIL-01 (iv) exist in the packet specifically so that this reading has to be argued for rather than assumed.

**Recommending Option A because it is the safest.** It does not address the request. That may still be the right recommendation — but it requires you to tell the fulfilment side of the business that their problem is not being solved, and to say why that is right.

**Leaving `RESIDUAL RISK` empty or writing "none."** After a real decision it is never none. ARCH-RISK-01 alone supplies four items you cannot remove.

**Treating a limitation as a gap.** Filing payment failure modes 8 and 9 as future work implies they will be resolved.

## Engineering Perspective

Three habits distinguish a portfolio that holds up under challenge.

**Cite what you declined to rely on.** Stating that ARCH-PERF-02 was offered and does not bear on the claims is stronger than omitting it, because a reviewer who knows the benchmark exists will otherwise assume you missed it. The same applies to evidence that cuts against you.

**Write the strongest version of the case you are rejecting.** If your account of the option you did not choose is weaker than its advocates would give, you have not evaluated it — you have dismissed it. Stage 11 exists for this.

**Name the one fact.** Every recommendation rests more heavily on one belief than on the others. Identifying it, saying it is unverified, and saying how it could be checked converts a position into a proposal. It is also the single most useful sentence you can give a decision owner, because it tells them where to spend their attention.

## Industry Perspective

Architecture-evaluation practice at the Software Engineering Institute treats the output of an evaluation as risks, sensitivity points, and trade-off points elicited against stated quality scenarios — not as a verdict on the architecture.[^sei-atam] This capstone adopts that output shape deliberately. An evaluation concluding "Option B is best" is unfalsifiable and unusable; one concluding "Option B turns on a provider contract nobody has read, and here is what changes if it does not exist" gives a decision owner somewhere to act.

ISO/IEC/IEEE 42010:2022 supplies the frame for what you are producing: architecture decisions and their rationale are part of an architecture *description*, expressed for stakeholders with concerns.[^iso-42010] Your portfolio is a description. It communicates reasoning; it does not, by existing, establish that the reasoning is right. That is why its value lies in being challengeable, and why the completion criteria are about inspectability rather than about conclusions.

ISO/IEC 25010:2023 supplies the quality vocabulary, and — as Chapter 11 noted — pointedly does not supply a means of combining characteristics into a single figure.[^iso-25010] That absence is the standard declining to make a business judgement. Your portfolio should decline in the same way.

## Common Misconceptions and Pitfalls

### "The capstone has a correct answer."

It has defensible and indefensible reasoning. Two engineers can recommend different options from this packet and both produce excellent portfolios, provided each is explicit about what they believe and why.

### "More evidence would settle it."

Some of it, yes — ARCH-GAP-01 lists six closeable gaps. But ARCH-RISK-01 lists four things that no evidence will settle, and the decision must be made under them.

### "A recommendation needs certainty."

It needs a stated confidence, an identified load-bearing assumption, and a revision trigger. Certainty is not available and claiming it is the failure mode this whole part has been arguing against.

### "The three options are the option set."

They are three defensible starting points. Conflict 7 suggests a fourth line of enquiry that none of them addresses.

### "Recommending the cheapest option is conservative."

It is a position with consequences, like any other. Option A leaves the fulfilment request unmet, and that is a business cost that belongs in `CONSEQUENCE`.

## QA → QE Transition

The transition in this capstone is from assessing one architecture diagram or test result to contributing a transparent recommendation that another engineer can inspect, challenge, and revise.

A QA Engineer given this situation would test what exists, verify what changes, and report defects accurately against each. That work is necessary, and Parts III through X are where it is learned properly.

A Quality Engineer does something the packet cannot do for itself. They convert an undecidable request into bounded claims. They read a benchmark and say what it is evidence *of*. They notice that the most-cited number in the packet does not settle the question it was gathered to settle. They find the two measurements that appear to disagree and do not. They state, for each option, the belief it requires and whether anyone has checked it. They keep performance, security, and reliability apart when everyone wants a single answer. They say plainly which risks will still be there afterwards, and whose they are. And they hand the whole thing to the person who owns the decision, in a form that lets that person disagree with them intelligently.

That is the capability Part XI has been building, and it does not require owning the architecture. It requires being the person in the room who can say exactly what is known, exactly what is not, and exactly what would change their mind.

## Summary

This capstone provides a synthetic, incomplete, internally conflicting evidence packet about the Atlas Commerce checkout and fulfilment boundary, together with three initially defensible options and a twelve-stage revisitable investigation workflow. The work is to convert an undecidable request into bounded claims, read each evidence item for what it actually measures, engage with the conflicts rather than selecting around them, state what each option requires you to believe, keep the quality implications separate rather than scoring them, design a migration with honest reversibility, and produce an Architecture Decision Brief and portfolio that another engineer can inspect and challenge. No option is the intended answer, the strongest evidence in the packet is genuinely ambiguous, and several risks cannot be removed by any amount of further work. The recommendation you produce is yours; the decision belongs to an accountable owner elsewhere.

## Key Takeaways

- Convert the request into bounded claims before evaluating any option.
- Read each evidence item for what it measures, not for what it is offered as supporting.
- Ambiguous evidence stays ambiguous; presenting it as support is the most common failure.
- Two measurements that appear to conflict may have different boundaries — reconciling them can produce a hypothesis nobody held.
- State, per option, what it requires you to believe and whether anyone has checked it.
- Keep performance, security, and reliability implications separate; produce no composite score.
- Distinguish gaps, which get plans, from limitations, which get owned residual-risk entries.
- A wide decision rarely turns on one fact; name your exposure per axis and say which axes you are robust against.
- Argue the strongest version of the case you are rejecting.
- Contribute a recommendation with its reasoning attached; the decision belongs to an accountable owner.

## Review Questions

1. The request is "let fulfilment ship independently of checkout, without breaking anything." Identify four things that must be added before it is decidable.
2. N-3 was gathered to determine whether separation would relieve change coupling. Explain precisely why it does not settle that question, and what would.
3. ARCH-PERF-02 is a competently run benchmark. State what it is evidence of, and why rerunning it better would not help.
4. Conflict 5 says availability arithmetic that varies by option is measuring the wrong failure class. Explain.
5. Conflict 7 involves two measurements that appear to disagree and do not. What is the reconciliation, and what new line of enquiry does it open?
6. Distinguish, with an example from the packet, an evidence gap from a limitation, and state the different response each requires.
7. Why does N-4's detection-floor calculation matter more given ARCH-FAIL-01 (i) and ARCH-OBS-01?
8. What would have to be true for Option A to be the right recommendation despite not addressing the stated request?

## Interview Questions

1. Describe a time you recommended against the option you personally preferred. What changed your mind?
2. How do you present a recommendation when the evidence genuinely does not settle the question?
3. A stakeholder asks you to score three architecture options out of ten. How do you respond?
4. How do you distinguish a risk you can reduce from one you can only own?
5. What does a good architecture recommendation contain that a bad one omits?

## Practical Exercise

Complete the capstone.

Working from the evidence packet, the numerical evidence, and the conflict analysis in this chapter, produce a **System Design & Architecture Quality Strategy and Evidence Portfolio** containing an **Architecture Decision Brief**.

**Required.**

1. **Scope and claims.** Convert the request into at least two bounded, falsifiable quality claims. State explicitly what your recommendation is not about.
2. **Evidence register.** For every packet item you rely on, cite its identifier, state what you take from it, and state what you decline to take from it. Include at least two items you decline to rely on, with reasons.
3. **Classification.** Mark every relied-upon item fact, interpretation, limitation, or evidence gap.
4. **Conflict analysis.** Engage with **at least four** conflicts, including at least one you cannot resolve and at least one you determine is an artefact of differing boundaries rather than a real disagreement.
5. **Option analysis.** For each of A, B, and C — and any combination you construct — state what it requires you to believe, which of those beliefs is verified, its strongest argument for, and its strongest argument against. Your account of the option you reject most firmly must be one its advocates would recognise.
6. **Quality scenarios.** Produce at least four scenarios using the Chapter 6 scaffold, of which at least one has a degraded environment. Mark each response measure obtainable or not, given ARCH-OBS-01.
7. **Integrated implications.** State performance/scale, security/trust, and reliability/recovery implications **separately** for your recommendation. No combined rating.
8. **Migration and reversibility.** For your recommendation, define at least three stages with intermediate architectures, evidence gates, reversibility with an expiry per kind, rollback symmetry, and a decommissioning trigger with a named owner for any temporary debt.
9. **Numerical work.** Produce at least one new bounded calculation of your own, with context, population, assumptions, units, calculation, interpretation, and limitation. It must inform a decision you actually make.
10. **Specialist handoffs.** Name at least three questions for Parts VIII or X, phrased as questions those disciplines could answer.
11. **Decision brief.** All sixteen required fields. `RESIDUAL RISK` must contain at least three items, at least one drawn from ARCH-RISK-01 that no work will remove. `REVISION TRIGGER` entries must be observable events.
12. **Axis exposure.** Work all six axes from *There is no single pivot*. For each, state whether your recommendation is **exposed** or **robust**, and why. For every axis you are exposed to, name the unverified fact, say how it could be checked and by whom, and state what you would recommend instead if it proved false. A submission that names only one such fact has not engaged with the packet. Then state explicitly whether Chapter 11's conditional position survives this wider evidence base — and if it does not, what changed it.
13. **Ownership statement.** State that you are contributing a recommendation and name the role that owns the decision.

**Constraints.**

- No composite score, weighted total, or numeric option ranking anywhere.
- No target architecture diagram is required; if you draw one, label it as an architecture description and state what it does not establish.
- Do not present any figure in this chapter as describing a real system.
- Use only the packet, your own derived calculations, and clearly labelled assumptions.

**Self-challenge.** Before submitting, complete stage 11: write, in no more than 300 words, the strongest available argument that your recommendation is wrong. If you cannot construct one, you have not understood the packet.

## Further Reading

- [ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise — Architecture description](https://www.iso.org/standard/74393.html)
- [ISO/IEC 25010:2023 — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html)
- [R. Kazman, M. Klein, and P. Clements — ATAM: Method for Architecture Evaluation](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/) — SEI technical report; a facilitated method, not an MSQE requirement.

## References

[^iso-42010]: International Organization for Standardization, International Electrotechnical Commission, and Institute of Electrical and Electronics Engineers. [ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise — Architecture description](https://www.iso.org/standard/74393.html). 2022. Accessed 2026-08-14.
[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). 2023. Accessed 2026-08-14.
[^sei-atam]: Kazman, R., Klein, M., and Clements, P. [ATAM: Method for Architecture Evaluation](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/). CMU/SEI-2000-TR-004, Software Engineering Institute, Carnegie Mellon University, 2000. Accessed 2026-08-14.

## Chapter Checklist

Before considering this capstone complete, confirm that you can:

- [ ] Convert an ambiguous request into bounded, falsifiable architecture claims with an explicit scope.
- [ ] Cite evidence by identifier and state what you decline to take from it.
- [ ] Classify each item as fact, interpretation, limitation, or evidence gap, and respond to each correctly.
- [ ] Engage with a conflict you cannot resolve, without resolving it rhetorically.
- [ ] Distinguish a real conflict from an artefact of differing evidence boundaries.
- [ ] State what each option requires you to believe, and which belief is unverified.
- [ ] Keep performance, security, and reliability implications separate.
- [ ] Design intermediate architectures with evidence gates and reversibility that has an expiry.
- [ ] Identify, per axis, where a recommendation is exposed and where it is robust, rather than naming one decisive fact.
- [ ] Argue the strongest case against your own conclusion.
- [ ] Present a recommendation without claiming to approve an architecture.

## Chapter Navigation

Previous: [Chapter 11 — Integrated Architecture Decisions: Scale, Security, Reliability, and Residual Risk](chapter-11-integrated-architecture-decisions-scale-security-reliability-and-residual-risk.md) · Next: [Part XI overview](../README.md)
