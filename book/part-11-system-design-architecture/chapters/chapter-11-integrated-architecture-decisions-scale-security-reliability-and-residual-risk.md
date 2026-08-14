# Chapter 11 — Integrated Architecture Decisions: Scale, Security, Reliability, and Residual Risk

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 11 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–10; Parts VIII and X recommended |
| Estimated study time | 190 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Three correct findings, three correct fixes, three different desks. Each fix makes another finding worse. The architecture decision is the one nobody has been asked to make.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

The promotion ran for four days. It is now over, and three findings have landed on three desks.

**Performance.** During the payment provider's slowdown, checkout p95 reached 6.2 seconds against an expectation of under two. The ticket concludes: checkout does not meet its latency expectation under promotional load. The proposed fix is to shorten the payment timeout from five seconds to two.

**Security.** A verification record shows that the order-status page served a cached response containing one customer's order summary to a different customer. The cache key was composed from the order identifier alone and omitted the session dimension. The proposed fix is to disable the order-status cache.

**Reliability.** The fulfilment backlog reached seven hours at its peak. Three hundred and forty orders entered `PAYMENT_UNKNOWN`, and twelve orders were fulfilled twice. The proposed fix is to raise the retry count and add worker capacity.

Every finding is real. Every fix is a reasonable response to the finding it addresses. And every fix makes at least one of the other two worse.

Shortening the payment timeout reduces checkout latency by abandoning slow calls sooner — which produces *more* unknown payment outcomes, not fewer, because a timeout is not information (Chapter 3). The reliability finding gets worse in direct proportion to the performance fix.

Disabling the order-status cache eliminates the cross-customer exposure and removes a 300-second absorption layer in front of the order store during exactly the traffic conditions that produced the incident. The security fix is correct and it transfers load onto the performance problem.

Raising the retry count amplifies attempted work against a dependency that is already degraded (Chapter 3 established a 2.8× amplification at three attempts) and increases duplicate risk. Adding worker capacity increases the concurrency of calls into the same slow provider. The reliability fix pushes on both the performance problem and the duplicate-fulfilment problem it was partly meant to solve.

No individual is wrong. The architecture has three sensitivity points that are all the same trade-off point (Chapter 6), and no one has been given the job of deciding which side to favour.

## Why This Chapter Matters

Chapters 2 through 10 built the analysis one concern at a time. That was necessary and it is not how decisions arrive.

Real architecture decisions arrive as this chapter's opening story: several findings, each owned by a different specialism, each with a locally correct remedy, and an interaction structure that nobody owns. The specialist parts of this handbook are exactly the right place to learn how to produce those findings well. Part X teaches performance experiments and security verification; Part VIII teaches operational evidence and reliability practice. What neither can do — because it is not their subject — is reconcile findings that pull in opposite directions.

This chapter is about that reconciliation, at architecture level. It has three jobs.

**Show the interaction structure.** Fan-out, retries, queues, caches, and trust boundaries are not independent subsystems; they are coupled, and the couplings are where the surprises live.

**Keep the concerns separate while deciding.** The temptation under conflict is to collapse everything into one number and let the number decide. Part XI refuses this. Performance, security, and reliability are distinct concerns with distinct owners and distinct consequences of being wrong; a composite score buries the judgement instead of making it.

**Make the residual risk and the handoffs explicit.** An integrated decision does not resolve everything. It states what specialist evidence is still required, what risk remains, and who carries it.

The chapter does not teach load testing, capacity planning, SLO or error-budget design, alerting, threat modelling, vulnerability assessment, security-control design, or incident response. Those remain with Parts VIII and X, and this chapter's job is to consume their outputs and hand back the questions they should answer next.

## Learning Objectives

By the end of this chapter, you should be able to:

- recognise when several specialist findings share one underlying architectural trade-off point;
- reason about fan-out effects on latency and on percentile composition;
- identify a dependency wrongly treated as required, and quantify what it costs;
- explain how retry amplification, backlog, and recovery mechanisms interact under degradation;
- assess failure containment against the operational and contract surface that separation adds;
- reason about trust boundaries, identity propagation, and cache-key correctness as one concern;
- treat degraded mode as a per-path design decision rather than a default;
- produce an Integrated Architecture Decision Brief that keeps concerns separate rather than scoring them; and
- state which specialist evidence remains outstanding and who owns the residual risk.

## Three Findings, One Decision

The opening story's structure is worth naming because it recurs.

| Finding | Locally correct fix | What it makes worse | Underlying architectural decision |
| --- | --- | --- | --- |
| Checkout p95 6.2 s | Shorten payment timeout | Unknown-outcome volume rises (reliability, functional suitability) | Payment is on the synchronous path |
| Cross-customer cached response | Disable order-status cache | Origin read load rises under promotional traffic (performance) | Cache key scope, and what the cache is absorbing |
| Backlog 7 h; 340 unknowns; 12 duplicates | More retries, more workers | Amplified load on the degraded provider; more duplicates | Retry policy and deduplication keying |

Read down the right-hand column and the three findings become two architectural questions: **should the payment dependency be on the synchronous checkout path**, and **what is the cache actually for**. Neither question is answerable by any of the three teams alone, and neither appears in any of the three tickets.

This is the integration move. It is not "consider everything at once" — that produces paralysis. It is: for each finding, identify the architectural decision implicated, and check whether several findings implicate the same one. When they do, the decision is the unit of work, not the findings.

## Fan-out: Latency, and What Percentiles Do

Atlas's promotion landing page composes results from six catalogue backend calls — the same six-call fan-out established in Chapter 3, here examined for latency rather than failure probability.

### Numerical Example 1 — Fan-out latency and percentile composition

| Field | Entry |
| --- | --- |
| Context | The promotion landing page issues six catalogue calls. The team wants to know whether parallelising them resolves the page-latency concern. |
| Population and boundary | Server-side page composition only, for the promotional landing page. Excludes client network, render, and the checkout path. |
| Assumptions | Per-call median latencies are 40, 45, 52, 58, 61, and 180 ms — the last being a personalised-price call. Parallel issue has negligible dispatch overhead. Per-call p95 is 180 ms and p99 is 900 ms for each call. Calls are independent. |
| Units | Milliseconds; probabilities. |
| Calculation | **Sequential** composition = 40 + 45 + 52 + 58 + 61 + 180 = **436 ms**. **Parallel** composition = max(40, 45, 52, 58, 61, 180) = **180 ms**. Saving = **256 ms**. Under parallel issue, P(all six calls land under their own p95) = 0.95⁶ = **0.7351**, so **26.5%** of page compositions contain at least one call above its own p95. For the *page* to have a p95, each call must land under its own **99.15th** percentile, because 0.95^(1/6) = 0.99149. |
| Interpretation | Parallelising is worth 256 ms and does not fix the page. Two consequences follow. The page's latency is now governed entirely by the slowest call, so all improvement capacity sits in the personalised-price call. And a fan-out page's percentile is far stricter than its components': a page-level p95 requires per-call behaviour at roughly the 99th percentile, which is where most services are least characterised and least stable. |
| Limitation | Independence is the load-bearing assumption and is doubtful — the six calls likely share a connection pool and a store, so their tails will correlate, which changes the shape of the distribution rather than only its width. Medians do not compose into a median (Chapter 3, Example 1), so 436 ms is indicative rather than a measured sequential p50. The figure is server-side and is not a customer-experienced page load. |
| Decision relevance | Redirects effort to the personalised-price call and to whether it belongs in the composition at all. Does not establish that the page meets any latency expectation. |

The percentile result is the part worth carrying forward. Teams routinely set a page-level percentile target and then set component targets at the same percentile, which is arithmetically incoherent under fan-out. Part X owns how to measure and interpret those distributions; what belongs here is noticing that the *architecture* — how many calls, issued how — determines which percentile of each component matters.

## Dependency Chains and the Optional-as-Required Error

A **dependency chain** is the set of components whose behaviour a request depends on. The architectural question is not how long the chain is but which links are genuinely **required** for the user outcome and which are **optional** — where failure should degrade the outcome rather than fail it.

Getting this wrong is common, cheap to fix, and expensive to leave.

### Numerical Example 2 — What an optional dependency costs when treated as required

| Field | Entry |
| --- | --- |
| Context | **New synthetic fact for this chapter:** since Chapter 3, Atlas has adopted the synchronous loyalty-award proposal described in that chapter's exercise. Checkout now awards loyalty points synchronously before returning success; if the loyalty service fails, checkout returns an error and no order is created. This supersedes the earlier arrangement, in which points were awarded asynchronously after fulfilment. |
| Population and boundary | The synchronous checkout completion path. Excludes catalogue, search, and the asynchronous fulfilment path. |
| Assumptions | Component availabilities over a 30-day window: session validation 99.99%, cart/pricing 99.95%, payment provider 99.5%, order write 99.95%, loyalty award 99.0%. **Failures assumed independent.** All are currently treated as required. |
| Units | Dimensionless probability; minutes over a 30-day (43,200-minute) window. |
| Calculation | **Loyalty treated as required:** 0.9999 × 0.9995 × 0.995 × 0.9995 × 0.99 = **0.98397**, i.e. **98.397%**. **Loyalty treated as optional** (points awarded asynchronously; failure does not block the order): 0.9999 × 0.9995 × 0.995 × 0.9995 = **0.99391**, i.e. **99.391%**. Difference = **0.994 percentage points** = 0.00994 × 43,200 ≈ **429 minutes ≈ 7 h 9 min** per 30 days. |
| Interpretation | Roughly seven hours a month of "checkout unavailable" is not a reliability problem with the loyalty service. It is a design decision to make a non-essential capability blocking. No amount of investment in loyalty-service reliability recovers as much as moving the award off the completion path, and the move costs a queue entry rather than an engineering programme. |
| Limitation | **The arithmetic is correct and the architectural inference is weak in three distinct ways.** First, *independence is assumed and is probably false* — all five components share network and platform infrastructure, so a common-mode failure violates the multiplication and makes the composed figure optimistic about the pattern of outages even where it is roughly right about their total. Second, *"available" is the wrong predicate*: a 99.0% figure counts a loyalty service that is responding slowly as available, and Chapter 3 established that slow-but-responding is the condition that produces the worst customer outcomes — so the calculation is blind to the failure mode most likely to matter. Third, *service success is not user outcome*: making loyalty optional converts an outage into a silent non-award, and a customer who was promised points and did not receive them has a different problem, not no problem. The arithmetic supports moving the call; it does not describe what the customer then experiences. |
| Decision relevance | Supports moving the loyalty award off the synchronous path as a low-cost, high-return change, **and** requires a decision about what the customer is told when points are pending. Does not establish a checkout availability figure, and must not be used as one. |

The third limitation generalises. Every time a dependency is made optional, a new state appears — points pending, recommendation missing, estimate unavailable — and that state is customer-visible. Chapter 4's discipline applies: name the state, define its exit, bound its lifetime. Making something non-blocking without modelling the resulting state is how "graceful degradation" becomes "silently wrong."

## Retries, Backlog, and Recovery That Deepens the Problem

Chapter 3 established retry amplification and backlog accumulation as separate mechanisms. Under a real degradation they compose, and the composition is what surprises teams: retries tripled attempted work against a constrained dependency; timeouts produced non-terminal `PAYMENT_UNKNOWN` states; reconciliation queried the same degraded provider, so the recovery mechanism competed for the capacity whose shortage created the need for it; and fulfilment queued behind orders whose payment state was unresolved.

Three architectural properties determine whether that sequence is survivable.

**Whether retries are bounded by a budget rather than a count.** A count-based policy scales attempted work with arrival rate; a time-budget policy caps it. Under a fourfold traffic increase, the difference is the difference between a slowdown and an outage.

**Whether the recovery path is independent of the failed dependency.** Where it is not, recovery has a capacity ceiling exactly when demand for it peaks. This is not fixable by design alone; it is a residual risk to record and, where the contract permits, to negotiate.

**Whether the queue is bounded.** An unbounded queue converts a capacity problem into a delayed and larger one (Chapter 3, Example 4). A bounded queue with explicit rejection produces a worse immediate experience and a survivable system; choosing between them is a product decision to be made before the incident.

Part VIII owns incident practice, alerting, and error budgets. What belongs here is that all three properties are architectural, are decided in advance, and bound what any operational response can achieve.

## Failure Containment, Blast Radius, and the Surface Separation Adds

**Blast radius** is the set of things affected when one thing fails. Reducing it is the main reliability argument for separation, and it is a real argument. It is also routinely stated without its counterpart.

### Numerical Example 3 — Containment gain against contract surface

| Field | Entry |
| --- | --- |
| Context | Atlas is weighing whether extracting checkout improves failure containment enough to justify the separation. |
| Population and boundary | The eight distinguishable Atlas responsibilities: account/identity, catalogue/search, checkout, payment, order management, fulfilment, notification, support/refund. Boundary is process-level failure only; store-level failure is excluded and treated separately. |
| Assumptions | Today, catalogue, checkout, order management, and notification share one process; a process-level fault affects all four. After extraction, checkout runs alone. Contract surface is modelled as the worst case in which every unit must remain compatible with every other. |
| Units | Counts of responsibilities; counts of unit pairs. |
| Calculation | **Containment.** Today a checkout process fault affects 4 of 8 responsibilities = **50%**. After extraction it affects 1 of 8 = **12.5%**. **Contract surface**, worst case *N*(*N* − 1)/2: at *N* = 2 units, **1** pair; *N* = 3, **3**; *N* = 4, **6**; *N* = 5, **10**; *N* = 8, **28**. |
| Interpretation | Containment improves substantially at the first separation — 50% to 12.5% is the largest single gain available, and later separations yield progressively less. Contract surface grows quadratically in the worst case. The first extraction is therefore the best-value one, and the case for each subsequent extraction is weaker than the case for the one before it. |
| Limitation | The containment figure covers **process-level faults only**. Every option under consideration still shares the order store, so a store fault has an unchanged blast radius of 100% — the number improves precisely the failure class that separation addresses and says nothing about the one that has actually caused Atlas incidents. *N*(*N* − 1)/2 is a loose upper bound; real topologies are sparser, so it overstates. And a contract *count* is not a contract *cost*: one high-churn contract between two rapidly-changing units costs more than five stable ones, and the arithmetic cannot see churn. |
| Decision relevance | Supports the claim that a first extraction buys meaningful process-level containment. Does not support any claim about store-level failure, which is where Atlas's history lies. |

The limitation is the finding. A containment argument that excludes the shared store excludes the dominant failure mode, and Options A, B, and C in the worked reasoning below all retain it.

## Trust Boundaries, Identity Propagation, and Cache Correctness

The security finding in the opening story is a cache-key defect, and treating it as a caching problem is the error. It is a **trust-boundary** problem.

A **trust boundary** is where an assertion must be re-verified rather than assumed (Chapter 2). Atlas verifies identity at the API edge. Everything behind the edge treats the request as authenticated — reasonably, since the edge did the work. The question the architecture must answer is what happens to the *identity* of the requester as the request travels inward, and where any response derived from it may be stored.

**Identity propagation** is the mechanism by which a downstream component knows *who* a request is for. Where identity is propagated explicitly, a cache key can include it. Where identity is consumed at the edge and discarded, downstream components construct responses that are implicitly personal without any variable indicating so — which is precisely how a cache key composed of the order identifier alone came to be written. The engineer who wrote it had no personal dimension available to include.

Three architectural rules follow, and each is a decision rather than a coding standard.

**A response's cache key must include every dimension the response varies by.** If it varies by customer, role, region, or entitlement, the key includes it — and if that dimension is not available at the caching layer, the response must not be cached there. The unavailability is the finding.

**Distinguish what may be displayed from what may be acted on.** Chapter 4 drew this line; it is a trust-boundary line. A stale catalogue price displayed is a product decision; a stale entitlement used to authorise is a security decision, because a revoked permission remains effective for the staleness window.

**Cross a trust boundary and re-verify, or record that you did not.** An internal call that carries no identity is not an authenticated call; it is an unauthenticated call that happens to originate inside the network. Whether that is acceptable is a decision to record, not to assume.

Part X owns threat modelling depth, control design, and vulnerability assessment. What belongs here is that the defect was created by an architectural decision about identity propagation, and that the specialist finding cannot be closed by fixing one cache key.

## Degraded Mode as a Decision

**Degraded mode** is what the system does when it cannot do everything. Every system has one; most have it by accident.

Brewer's later reassessment of CAP makes the relevant point about partitions specifically: the substantive engineering work is detecting the condition, entering an explicit mode with known behaviour, and recovering afterwards.[^brewer] The generalisation to any degradation is straightforward, and Part XI's requirement is that the mode is **chosen per path**:

| Atlas path | Defensible degraded behaviour | Which characteristic is traded |
| --- | --- | --- |
| Catalogue search | Serve stale results; state the staleness | Functional suitability traded for availability |
| Order status | Serve last known state with an explicit "as of" time | Functional suitability traded for availability |
| Entitlement / authorization | **Refuse**; do not authorise from stale state | Availability traded for security |
| Payment authorisation | Refuse or defer; never assume an outcome | Availability traded for functional suitability |
| Loyalty award | Proceed without it; award asynchronously | Completeness traded for availability |

A single global degradation policy means the decision was defaulted, and defaults are almost always "serve something," which is right for catalogue and wrong for entitlement. The table also shows why this is architectural rather than operational: the ability to refuse on one path while serving on another requires those paths to be separable in the first place.

## Worked Reasoning: Three Integrated Responses

Atlas must respond to the promotion's findings before the next campaign. Three options are on the table. Each is assessed across all the concerns, and the concerns are kept apart.

**Option A — Strengthen the current architecture and reduce unnecessary fan-out.** Move the loyalty award off the synchronous path; remove the personalised-price call from the landing-page composition or make it non-blocking; add a retry budget with backoff and jitter; correct the cache key to include the session dimension; add deduplication keyed on the business operation.

**Option B — Introduce a bounded asynchronous boundary for payment.** Checkout validates, creates the order in an explicit pending state, and returns; a worker resolves payment asynchronously with reconciliation.

**Option C — Extract checkout as a separately deployed unit with stronger isolation.** Checkout becomes its own deployment and process, retaining the shared order store.

| Concern | Option A | Option B | Option C |
| --- | --- | --- | --- |
| **Scale / performance** | Landing-page latency governed by the remaining slowest call; checkout still includes the 180 ms payment call, so the 295 ms path is unchanged in health and unchanged in degradation. Loyalty removal buys availability, not latency. | Checkout sync path drops from 295 ms to **115 ms** by removing the payment call. Largest latency gain available. | No latency gain; adds a network hop where none existed. May be net worse. |
| **Security / trust** | Directly fixes the cache-key defect and forces the identity-propagation question. | Neutral on the cache defect. Adds a new question: what a pending-state event may contain, since events may be read by consumers not yet identified. | Adds an internal service-to-service trust boundary that does not exist today, requiring a decision about internal authentication. |
| **Reliability / recovery** | Retry budget reduces amplification; deduplication keying addresses the twelve duplicates directly. Unknown-outcome volume unchanged. | Removes temporal coupling; a slow provider becomes backlog rather than customer-facing failure. **Increases** the population of orders in a pending state and makes reconciliation load-bearing. | Process-level containment 50% → 12.5%. Store-level blast radius unchanged. |
| **Testability** | Improves modestly; a non-blocking loyalty call is easier to substitute. | Asynchronous flows are harder to test deterministically; needs controllable seams for delivery timing, duplication, and ordering (Chapter 7). | Improves substitution at the new boundary; adds a version-combination matrix. |
| **Observability / operability** | Small addition: retry-budget and deduplication metrics. | Substantial: backlog depth, consumer lag, pending-state age, reconciliation success rate all become signals someone must watch. Atlas operates no broker. | Second deployment unit: second build, deploy path, log stream, alert set, on-call surface. |
| **Operational complexity** | Lowest. No new infrastructure. | Highest new infrastructure burden. | Highest new process burden; contract surface goes from 0 pairs to 1. |
| **Ownership** | Unchanged; one team throughout. | Unchanged technically; the pending state creates a support-workflow obligation someone must own. | Realistically invites a second team, which is an organisational change (Part XII's to design). |
| **Reversibility** | Highest — each change is independently revertible in hours. | Moderate; reversible until consumers depend on the pending-state contract. | Moderate; reversible until the deployment split is depended upon operationally. |
| **Assumption** | The identity dimension is available at the caching layer. **Unverified.** | Product accepts a delayed payment confirmation. **Unverified, and it decides the option.** | The team can operate a second unit through a promotion. **Unverified.** |
| **Failure mode** | The retry budget is raised under pressure during the next incident. | Pending orders accumulate during a long outage and reconciliation cannot drain, because it queries the degraded provider. | Version skew produces a defect that cannot be reproduced locally, during a promotion. |
| **Reason it might be rejected** | It does not address the largest single latency contributor, and leaves payment on the synchronous path — so the next provider degradation reproduces the same incident with better bookkeeping. | It converts a latency problem into a state problem, and Chapter 4 established that Atlas's state problems have been the ones it could not answer customer questions about. | It buys process containment for a system whose incidents have been store-level and dependency-level, and adds operational surface during the period of highest load. |

### The integrated position

The options are not independent, and the honest reading of the table is that they sit at different levels.

Option A's changes are individually small, individually reversible, and address the security finding, the duplicate-fulfilment finding, and roughly seven hours a month of self-inflicted unavailability. They do not address the payment call's position on the synchronous path, which is the decision implicated by the performance finding *and* by the unknown-outcome finding.

Option B addresses that decision and is the only option that does. Its cost is that it moves Atlas's difficulty from a place it has evidence about (latency) to a place it has a documented history of handling badly (pending state, reconciliation, customer-facing truth). Whether that trade is good depends on a fact nobody in the story has established: **whether the provider's reconciliation query is contractually available and behaves under provider degradation.** If it is, Option B's principal failure mode has a mitigation. If it is not, Option B converts a visible failure into an unresolvable one, and should be rejected outright.

Option C addresses a failure class — process-level containment — that has not appeared in any of the three findings.

So the recommendation is conditional rather than ranked, and the condition is checkable within a day. That is a different shape of answer from "Option B is best," and it is the shape an integrated decision usually has: one option is dominated by evidence already in hand, one is unconditionally worth doing, and one turns on a single unverified fact whose resolution changes the recommendation.

## The Integrated Architecture Decision Brief

This chapter's professional artefact is the **Integrated Architecture Decision Brief** — an MSQE teaching artefact. It differs from the earlier chapters' records in one specific way: it carries **three separate implication fields** so that competing concerns cannot be averaged away.

| Field | Purpose |
| --- | --- |
| CONTEXT | The system, situation, and why a decision is needed now. |
| QUALITY CLAIM | The outcome under consideration, bounded as in Chapter 1. |
| CONSTRAINT | Limiting conditions every option must respect. |
| FACT | Only what the evidence directly supports. |
| EVIDENCE | Source, scope, and relevance of supporting material. |
| ASSUMPTION | Unverified conditions the reasoning depends on. |
| OPTION | A defensible architectural alternative. |
| TRADE-OFF | The benefit gained and the cost, risk, or capability made harder. |
| FAILURE MODE | How the option can fail or degrade. |
| LIMITATION | What the analysis or evidence cannot establish. |
| **PERFORMANCE / SCALE IMPLICATION** | Effect on latency, throughput, fan-out, and capacity — stated separately. |
| **SECURITY / TRUST IMPLICATION** | Effect on trust boundaries, identity propagation, and data exposure — stated separately. |
| **RELIABILITY / RECOVERY IMPLICATION** | Effect on failure containment, unknown outcomes, and recovery — stated separately. |
| MITIGATION | A proportionate risk-reduction action. |
| OWNER | The role accountable for the next decision or action. |
| DECISION | The recommended direction and its scope. |
| RESIDUAL RISK | Risk remaining after the decision and mitigation. |
| REVISION TRIGGER | The observation or changed condition requiring reassessment. |

Three rules govern its use.

**The three implication fields stay separate and are never summed.** They can conflict — that is their purpose. A brief in which all three improve has probably not been filled in honestly; a brief in which they are combined into a rating has hidden the decision.

**Each implication field names the concern's owner where it differs.** The security implication is the security owner's to accept, not the architecture author's. A brief that assigns all three implications to one role has quietly claimed authority it does not have.

**Outstanding specialist evidence is named, not deferred silently.** Part X's workload characterisation of the personalised-price call and Part VIII's view of the reconciliation path under degradation are both outstanding in the Atlas case. Naming them keeps the decision honest and keeps the handoff visible.

## Engineering Perspective

**Trace each finding to the architectural decision it implicates, and look for collisions.** Three tickets that all implicate "payment is on the synchronous path" are one piece of work. Doing this before allocating fixes is cheap and it prevents three teams from making each other's problems worse.

**Check for optional dependencies treated as required before doing anything expensive.** It is the highest return-per-hour change available in most systems, it needs no infrastructure, and it is invisible in every availability number until someone looks at the code path.

**When making something non-blocking, name the state it creates.** The loyalty award moved off the critical path produces "points pending," which is customer-visible and needs an exit, a bound, and a message.

**Ask what the recovery path depends on.** Recovery mechanisms that query the failed dependency have a ceiling exactly when they are needed. Where the dependency is a third party, this is often a contract question rather than a design one, and it should be raised commercially rather than absorbed as an engineering constraint.

## Industry Perspective

ISO/IEC 25010:2023 supplies the vocabulary that keeps this chapter's concerns distinguishable: performance efficiency, security, reliability, and functional suitability are separate characteristics, and the model does not rank them or provide a means of combining them.[^iso-25010] That absence is deliberate and useful. A standard that offered a composite score would be offering to make a business judgement that belongs to an accountable owner.

The Architecture Tradeoff Analysis Method takes the same position from the evaluation side: its outputs are sensitivity points, trade-off points, and risks, and it does not produce a verdict.[^sei-atam] An evaluation of the Atlas promotion findings that concluded "the architecture needs improvement" would have said nothing. One that concludes "three findings implicate one decision, one option turns on an unverified provider contract, and the security implication belongs to a different owner" has produced work with names attached.

## Common Misconceptions and Pitfalls

### "Fix the findings independently, then reassess."

Independent fixes can make the system worse, because they interact. Trace to the implicated decision first. Relatedly, scoring the options across the quality attributes converts a judgement into arithmetic and hides who made it — keep the implications separate and let the accountable owners see the conflict.

### "Parallelising the fan-out fixes the page."

It removes the sum and leaves the maximum, which means the slowest call now governs everything — and a page-level percentile requires a much stricter per-call percentile than teams usually specify.

### "The availability number says checkout is 98.4%."

It says so under an independence assumption, counting slow-but-responding as available, and treating an optional dependency as required. Two of those three are architectural errors, not measurement errors.

### "Extraction improves reliability."

It improves process-level containment. If the incidents have been store-level or dependency-level, it improves the failure class you do not have.

### "The cache bug is a caching bug."

It is an identity-propagation decision. The engineer who wrote the key had no personal dimension available to include, and fixing one key leaves the next one to be written the same way.

### "Graceful degradation means serving something."

It means choosing per path. Serving stale entitlement is not graceful; it extends a revoked permission.

## QA → QE Transition

The transition in this chapter is from reporting separate performance, reliability, and security findings to framing a single architecture decision with competing concerns, evidence limits, option consequences, and accountable ownership.

A QA Engineer reports that checkout p95 was 6.2 seconds, that a cached response leaked across customers, and that twelve orders were fulfilled twice. Three accurate findings, correctly raised, and each will be routed to the team that owns the symptom.

A Quality Engineer adds the layer that is otherwise missing. Which architectural decision does each finding implicate? Do any of them implicate the same one? What does each proposed fix do to the other two findings? Which dependency is being treated as required that need not be? What does the availability arithmetic conceal about slow-but-responding failure? Which concern's owner has to accept which implication, and are they in the conversation? What single unverified fact would change the recommendation, and how long would it take to check?

Neither role decides the architecture. The second one prevents three correct fixes from cancelling each other out.

## Summary

Findings arrive by specialism and interact by architecture. Several locally correct remedies routinely make each other worse, and the useful first move is to trace each finding to the architectural decision it implicates and look for collisions. Fan-out changes both latency composition and which component percentile matters, and a page-level target implies a far stricter per-call target than teams usually set. Dependencies wrongly treated as required are a common, cheap, high-value error that no reliability investment can offset. Retry amplification, unknown outcomes, and backlog compose under degradation, and recovery paths that query the failed dependency have a ceiling exactly when they are needed. Failure containment improves most at the first separation while contract surface grows quadratically, and containment figures that exclude a shared store exclude the dominant failure mode. Cache-key defects are trust-boundary and identity-propagation decisions. Degraded mode is chosen per path or defaulted. An integrated brief keeps performance, security, and reliability implications separate, because combining them into a score buries the judgement rather than making it.

## Key Takeaways

- Trace each specialist finding to the architectural decision it implicates; collisions identify the real unit of work.
- Parallel fan-out replaces a sum with a maximum and makes each component's high percentiles govern the page.
- A dependency treated as required when it is optional can cost hours of monthly availability that no reliability work recovers.
- Making a dependency non-blocking creates a customer-visible state that must be named, bounded, and exited.
- Retry budgets bound amplification; retry counts scale it with arrival rate.
- A recovery path that queries the failed dependency is capacity-limited exactly when it is needed.
- The first separation buys the largest containment gain; contract surface grows quadratically in the worst case.
- A containment figure that excludes a shared store excludes the failure class that has actually occurred.
- Cache-key correctness is an identity-propagation decision, not a caching detail.
- Degraded mode is a per-path decision; a single global policy means it was defaulted.
- Keep performance, security, and reliability implications separate; never combine them into one score.

## Review Questions

1. In the opening story, each of the three fixes worsens at least one other finding. Give the mechanism for each.
2. Under parallel fan-out across six calls, what per-call percentile is required for a page-level p95, and why does this matter for how component targets are set?
3. Loyalty is 99.0% available. Explain why the 7-hour monthly figure is an argument about design rather than about the loyalty service.
4. Give the three separate reasons Example 2's inference is weak despite correct arithmetic.
5. Why does the containment figure in Example 3 not support a general reliability claim for Atlas?
6. Why is the cross-customer cached response a trust-boundary finding rather than a caching finding?
7. The chapter's recommendation is conditional on one unverified fact. What is it, and how does each possible answer change the conclusion?

## Interview Questions

1. Performance, security, and reliability teams each propose a fix and the fixes conflict. How do you structure that conversation?
2. How would you identify a dependency that is blocking a user outcome unnecessarily?
3. What would you want to know before agreeing that extracting a service improves reliability?
4. How do you present competing quality implications to a decision owner without producing a scorecard?

## Practical Exercise

Produce an **Integrated Architecture Decision Brief** for the following synthetic Atlas Commerce situation.

*A second promotion is planned. Atlas has added a recommendations panel to the checkout confirmation page; it calls a recommendations service synchronously and renders nothing if the call fails. The confirmation page is cached for 120 seconds keyed on order identifier. During a load rehearsal, checkout p95 rose to 3.1 s, the recommendations service returned errors for 4% of calls, the fulfilment backlog reached 90 minutes, and a reviewer noted that the confirmation page contains the customer's delivery address.*

Your brief must use every field from the chapter's table, and must additionally:

- identify **which architectural decision each of the four observations implicates**, and state explicitly whether any two implicate the same decision;
- state, for at least two proposed fixes, what each would do to the *other* observations;
- determine whether the recommendations service is a **required or optional** dependency, what it currently is, and what the difference costs — with a bounded calculation stating context, population, assumptions, units, calculation, interpretation, and limitation;
- assess the confirmation-page cache as a **trust-boundary** question, not a caching one, and state what dimension the key omits and why the engineer may not have had it available;
- populate the **performance/scale, security/trust, and reliability/recovery implication fields separately**, naming a different owner for at least one of them, and **do not** produce a combined rating;
- state a **degraded-mode decision** for the recommendations panel and for the delivery-address display, and say which characteristic each trades;
- name at least one piece of **specialist evidence** still required, and say which part of this handbook owns producing it; and
- state a **residual risk** that will not be removed by any of your proposed changes, with an owner.

Then answer, in no more than 150 words: if you could verify exactly one currently-unverified fact before the promotion, which would it be, and how would each possible answer change your recommendation? Do not implement anything. Use synthetic data only; no production system or live third-party integration.

## Further Reading

- [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html)
- [R. Kazman, M. Klein, and P. Clements — ATAM: Method for Architecture Evaluation](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/) — SEI technical report.
- [E. Brewer — CAP Twelve Years Later: How the "Rules" Have Changed](https://doi.org/10.1109/MC.2012.37)

## References

[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). 2023. Accessed 2026-08-14.
[^sei-atam]: Kazman, R., Klein, M., and Clements, P. [ATAM: Method for Architecture Evaluation](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/). CMU/SEI-2000-TR-004, Software Engineering Institute, Carnegie Mellon University, 2000. Accessed 2026-08-14.
[^brewer]: Brewer, E. [CAP Twelve Years Later: How the "Rules" Have Changed](https://doi.org/10.1109/MC.2012.37). *Computer*, 45(2), pp. 23–29. IEEE, February 2012. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Trace separate specialist findings to the architectural decisions they implicate and identify collisions.
- [ ] Reason about fan-out effects on latency composition and on required component percentiles.
- [ ] Identify an optional dependency treated as required and quantify the cost with stated limitations.
- [ ] Explain how retries, unknown outcomes, backlog, and reconciliation compose under degradation.
- [ ] Assess a containment claim against the failure classes a system has actually experienced.
- [ ] Treat a cache-key defect as an identity-propagation decision.
- [ ] Choose degraded-mode behaviour per path and name the characteristic traded.
- [ ] Complete an Integrated Architecture Decision Brief with three separate implication fields and no composite score.

## Chapter Navigation

Previous: [Chapter 10 — Evolution, Migration, Reversibility, and Architecture Debt](chapter-10-evolution-migration-reversibility-and-architecture-debt.md) · Next: [Chapter 12 — Capstone: System Design & Architecture Quality Strategy and Evidence Portfolio](chapter-12-capstone-system-design-architecture-quality-strategy-and-evidence-portfolio.md)
