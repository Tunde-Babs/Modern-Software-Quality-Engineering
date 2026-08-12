# Chapter 5 — Capacity, Scalability, Queues, and Bottleneck Evidence

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 5 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–4; Part VIII measurement concepts recommended |
| Estimated study time | 210 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A busy component is evidence of load. A bottleneck is a bounded explanation that survives competing evidence.

## Opening Story

The following is an **illustrative scenario**. Atlas checkout throughput flattens during an elevated synthetic workload. Application CPU remains moderate, so one engineer concludes that the application cannot be the problem. Another sees a payment queue grow and declares the partner dependency the bottleneck. A third points to a falling cache-hit rate and increased database reads.

Each observation may be relevant. None proves the explanation by itself. Capacity reasoning requires the team to distinguish arrival pressure from completed work, utilization from saturation, and correlation from causal localization.

## Why This Chapter Matters

Capacity is the amount of defined work a system can process under stated conditions while meeting a stated quality claim. It is not a number that can be read from CPU alone. **Saturation** occurs when a constrained resource cannot keep up with relevant demand; queues and waiting can grow. **Headroom** is the difference between observed demand or use and a locally defined constraint, but its meaning depends on the boundary and assumption.

This chapter connects experiments to bounded hypotheses about queues, caches, databases, asynchronous processing, dependencies, and scaling. It does not provide infrastructure-sizing recipes or architecture-design instruction.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish capacity, utilization, saturation, queue depth, backpressure, and headroom;
- compare arrival rate, completion rate, in-flight work, and queue growth;
- formulate competing bottleneck hypotheses without treating correlation as proof;
- explain how cache, database, async, and dependency conditions affect evidence; and
- create a Capacity and Bottleneck Evidence Record.

## Capacity and Queue Reasoning

When arrival rate exceeds sustainable completion rate for a bounded period, in-flight work or a queue often grows. That observation matters even when CPU is not high. A remote dependency, connection pool, lock, database contention, queue consumer, rate limit, or cache miss path can constrain the relevant flow. **Backpressure** is a controlled response intended to prevent unlimited accumulation, such as rejecting, delaying, or limiting work according to an explicit policy.

| Signal | What it can support | What it cannot prove alone |
| --- | --- | --- |
| Arrival rate above completion rate | Work may accumulate in the defined boundary | Which component causes the imbalance |
| Increasing queue depth | Waiting work is growing in that queue | Whether the queue is the original constraint |
| High utilization | A resource may be near a stated limit | That it is the bottleneck or capacity limit |
| Moderate CPU | CPU may not be the immediate constraint | That application logic is irrelevant |
| Falling cache hit rate | More work may reach a backing store | That cache behaviour alone caused the tail |

## Worked Reasoning: Atlas Checkout Plateau

The following is an **illustrative, synthetic observation** during a ten-minute elevated workload. The population is checkout work accepted by the API; the queue boundary is payment-authorisation tasks waiting for the third-party dependency.

| Measure | Earlier window | Later window |
| --- | ---:| ---: |
| Arrival rate | 42 requests/s | 48 requests/s |
| Completion rate | 41 requests/s | 39 requests/s |
| Average in-flight checkout work | 54 | 126 |
| Payment queue depth | 18 | 190 |
| Payment-dependency p95 | 480 ms | 1,460 ms |
| Application CPU | 58% | 63% |
| Cache-hit rate | 93% | 84% |
| Database read latency p95 | 22 ms | 47 ms |

During the later window, arrivals exceed completions by about nine requests per second. The queue and in-flight work grow, while dependency timing deteriorates. The cache and database observations are plausible contributors. CPU does not eliminate application or coordination cost, but it weakens a simplistic “CPU saturation” explanation.

| Required element | Evidence-led interpretation |
| --- | --- |
| Population/window | Accepted checkout work and payment tasks in two comparable ten-minute windows |
| Calculation | Later imbalance: `48 − 39 = 9` requests/s; the positive imbalance is consistent with growing work |
| Hypothesis | Payment dependency delay is constraining completion and increasing queue waiting |
| Competing hypotheses | Cache misses and database reads increase service demand; retry behaviour may amplify work |
| Limitation | Synthetic signals do not prove causal ordering or production capacity |
| Decision consequence | Investigate dependency behaviour, retry bounds, cache population, and queue recovery before recommending a scale or configuration change |

The calculation does not prove a bottleneck. It gives the team a bounded reason to gather evidence that could reject the leading explanation. For example, if the dependency recovers while queue growth continues, the team must investigate other constraints.

## Caches, Databases, Async Work, and Dependencies

A cache can improve a read path when the cached value is appropriate for the actor and state. It can also create stale data, authorization-sensitive leakage, or misleading synthetic performance if its population differs from the intended workload. A database may show contention, lock waits, or read/write latency; it is not automatically the bottleneck because it appears in a trace. Queue-backed asynchronous processing can absorb short bursts, but it transfers delay and creates a requirement to observe backlog, terminal state, retry bounds, and recovery.

Scaling is a hypothesis about a constraint. Adding consumers may increase throughput when consumption is the constrained component, but it may worsen a shared dependency, database, or rate limit. Vertical or horizontal changes belong to system-design and platform decisions; Part X contributes evidence about the stated behaviour and risk.

## Headroom and Decision Boundaries

Headroom is useful only with a declared constraint. “Thirty percent CPU headroom” says little about a checkout journey if dependency concurrency, queue wait, or database capacity dominates. A local decision rule might state that the candidate must maintain a bounded queue trend and timeout proportion at the selected elevated workload. It should name the owner and revision trigger rather than imply a universal safety margin.

## Distinguishing a Queue Signal from Its Cause

Queues can make invisible waiting visible, but they can mislead when boundaries are unclear. A queue depth may include work waiting for a consumer, work assigned but not complete, delayed retries, scheduled messages, or dead-lettered messages. Define the queue population before using depth as evidence. The same discipline applies to connection pools, thread pools, database waiting, and client-side retry buffers.

| Hypothesis | Evidence consistent with it | Evidence that could weaken it | Decision consequence |
| --- | --- | --- |
| Payment dependency constrains completion | Dependency p95 rises; payment queue grows; completions fall below arrivals | Dependency recovers while queue growth continues | Compare fallback/routing and dependency profiles; bound retry behaviour |
| Cache misses increase backing-store work | Hit rate falls while database reads and request time rise | Cache-hit slice has same tail, or database timing stays stable | Review cache population, key scope, invalidation, authorization boundary |
| Retry policy amplifies queue work | Attempts or queued work grow faster than logical journeys | Retries remain bounded and growth tracks only new arrivals | Review retry classification, terminal state, and backoff assumptions |
| Database contention limits work | Database latency/lock evidence rises with queue pressure | Database evidence stable while dependency/queue evidence changes | Gather data-store evidence before scaling recommendation |
| Generator/measurement path is constrained | Intended arrivals are not achieved | Generator preserves schedule and independent evidence confirms pressure | Limit workload claim or improve method |

A hypothesis can be credible without being proven. The aim is to choose the next observation or mitigation that most changes the decision.

## Capacity Claims Need Time and Population Bounds

Teams sometimes say “the service handles 50 requests per second.” In practice, a capacity claim has population, workload mix, data state, dependency profile, environment, quality boundary, and duration. Atlas might support 50 simple cached searches per second in one condition while failing to complete 35 checkout requests per second when payment fallback, retry, and dependency degradation are present.

| Weak statement | Bounded claim |
| --- | --- |
| “Checkout capacity is 35 requests/s.” | “In stated synthetic region, workload version, payment profile, and ten-minute window, baseline completed approximately 35 checkout requests/s while meeting its local distribution and timeout boundary.” |
| “Queue has enough capacity.” | “For defined arrival and consumer profile, queue depth recovered within stated window after bounded dependency delay.” |
| “Scaling fixes problem.” | “Evidence supports testing whether more consumers reduce defined queue wait without moving constraint to dependency or database.” |

## Feedback Loops and Amplified Demand

Backpressure protects a system by making a bounded response when it cannot accept unlimited work. The response might be delay, rejection, queue limit, or alternative workflow. It becomes a quality question when the population, message, retry behavior, and recovery path are considered.

| Outcome | Performance interpretation | Security or integrity consideration |
| --- | --- | --- |
| Accepted and completed | Contributes to completed throughput | Confirm resulting state is authorized and expected |
| Rejected by a limit | May reduce throughput or protect queue health | Assess legitimate-user path and excessive-request boundary |
| Timed out with unknown state | May be excluded incorrectly from completed measure | Requires reconciliation; avoid duplicate or unauthorized action |
| Queued for later work | Transfers latency to another boundary | Verify actor, event provenance, retry, and state transition |

Part X evaluates a scale or configuration hypothesis; it does not prescribe architecture or platform implementation. The evidence may support a follow-up experiment, constrained capacity assumption, or pause until the leading constraint is clearer.

## Worked Capacity Decision: What Can Be Recommended?

The Atlas plateau record supports several possible next actions, but not every recommendation has equal evidence. A useful decision record distinguishes an observation from a proposed intervention.

| Proposed action | Evidence that supports considering it | Evidence still needed | Risk if treated as proven |
| --- | --- | --- | --- |
| Tune or bound retry policy | Queue and in-flight work grow while dependency delay occurs | Attempt/journey classification, terminal-state and recovery comparison | May reduce recovery or move failure to customer/support path |
| Constrain fallback route | Fallback-path tail/dependency evidence is concerning | Aligned primary/fallback comparison and business consequence | Could defer a beneficial resilience path without proof |
| Add consumer capacity | Queue/consumer wait appears material | Dependency, database, downstream rate-limit and state evidence | May shift load to external dependency or data store |
| Adjust cache behavior | Hit rate falls and backing-store activity rises | Cache-scope, authorization/freshness, and slice evidence | May improve latency while weakening a trust boundary |
| Hold and gather evidence | Leading cause/attribution remains unclear | Controlled comparison designed to reject leading hypothesis | May delay a change unnecessarily if risk is bounded |

This table is not a system-design exercise. It shows the Quality Engineer's contribution: state why an option is under consideration, what evidence remains missing, and what could go wrong if the team treats a hypothesis as a fact.

### Capacity Evidence Over Time

Capacity is rarely one momentary sample. Examine whether arrival/completion imbalance, queue depth, latency tail, dependency delay, and resource signals change together across the selected window. A queue that spikes and drains quickly under stated conditions presents a different decision from one that grows throughout the window. A moderate CPU reading may be stable while a connection pool or external dependency approaches a constraint.

| Time pattern | Interpretation question | Decision relevance |
| --- | --- | --- |
| Queue grows only during planned spike then recovers | Is recovery within stated boundary and are terminal outcomes correct? | May support controlled spike behavior, subject to user impact |
| Queue grows through steady state | Are arrivals persistently above completions? | Challenges capacity claim for that workload |
| Tail rises before queue depth | Is dependency/service time increasing first, or are boundaries misaligned? | Guides next hypothesis/evidence source |
| Throughput plateaus while arrivals rise | Is a limiter, dependency, pool, or generator constraining completion? | Prevents equating arrival with delivered work |
| Resource use rises without queue/tail change | Is it leading evidence or normal variation? | Needs trend/claim context before action |

### Queue Boundaries and State Integrity

An asynchronous queue can improve resilience by decoupling work. It can also hide time and state. A checkout may receive an accepted response while fulfilment remains pending; a payment timeout may place an item in unknown state; a retry may produce several events for one logical action. Performance evidence must state whether it measures API completion, business completion, or queue acceptance. Security/integrity evidence must state whether event provenance, authorization, state transition, and duplicate handling are within scope.

For Atlas, an evidence record might say: *For accepted checkout requests in the stated window, checkout API completion is measured separately from payment reconciliation and fulfilment completion. Queue depth and event provenance are observed as supporting evidence, not as proof that every order reaches correct terminal state.* That limitation makes later investigation possible.

## Capacity-Record Review Checklist

Before handing a capacity record to a decision owner, verify that it states the workload and population, time window, queue/system boundary, units and calculations, leading/competing hypotheses, evidence gaps, user/state consequence, mitigation or next experiment, owner, residual risk, and revision trigger. If the record only says “CPU is high” or “queue is growing,” it is an observation, not yet a capacity decision artifact.

## Capacity Claims and Release Scope

A release owner may need a scoped answer even when a broad capacity conclusion is unavailable. For example, evidence might support use of a feature for a bounded traffic category with a stated dependency condition, queue limit, reversibility mechanism, and runtime handoff. That is different from declaring that the system has sufficient capacity generally. The record should make the scope, owner, residual risk, and revision trigger explicit.

## Propagation Paths and Service-Demand Boundaries

When demand exceeds a local service rate, work does not simply disappear; it moves or changes form. It may wait in a queue, occupy a connection, consume a retry budget, receive a rejection, enter a delayed workflow, or create an unknown terminal state. Map that propagation path for the defined journey before proposing a capacity action. The purpose is to locate the boundary where user or system consequence becomes material, not to produce an infrastructure design.

| Observed transition | Question to ask | Evidence needed before a decision |
| --- | --- | --- |
| Request becomes queued work | Which population and state are represented by queue depth? | Enqueue, consume, terminal-state, and expiry/retry classification |
| Queue work is retried | Does one logical journey create additional service demand? | Attempt-to-journey relationship and bounded retry policy |
| Work is rejected or deferred | Is the outcome protective, user-visible, and recoverable? | Denial message/path, legitimate-user consequence, and recovery owner |
| Downstream work slows | Is waiting attributable to dependency, data store, or a local limit? | Aligned timing, completion, and resource evidence across boundaries |
| Work later completes | Did a timeout represent failed, delayed, or duplicated business work? | Safe reconciliation and final-state evidence |

This map helps prevent an improvement at one boundary from being reported as an end-to-end gain when it merely transfers delay or risk elsewhere.

## Evaluating an Intervention Without Prescribing Design

Capacity evidence often leads to proposals such as a tighter admission rule, different retry condition, additional consumer capacity, cache change, or dependency fallback constraint. The Quality Engineer evaluates the claim each proposal makes; architecture and platform teams choose its design and implementation. For a proposed change, state the expected mechanism, the observed outcome that would support it, the outcome that would weaken it, and the risk it might introduce at another boundary.

| Intervention claim | Supporting observation | Counter-evidence or trade-off to inspect |
| --- | --- | --- |
| Additional consumers reduce waiting | Queue wait falls while comparable completion rises | Dependency, database, or external-service pressure may move upward |
| Retry bounding reduces amplified work | Attempts per logical journey and backlog growth fall | Legitimate recovery or terminal-state completion may worsen |
| Cache change reduces service demand | Comparable backing-store work and tail latency reduce | Freshness and authorization-sensitive scope may be weakened |
| Admission limit protects a dependency | Dependency pressure and unknown state reduce | Legitimate rejection, fairness, and alternate path need evidence |

The table supports a proportionate next experiment or release condition. It does not establish that any intervention is universally scalable or safe.

## Capacity Evidence Across Change

Treat capacity observations as versioned evidence. If workload mix, data volume, dependency profile, resource allocation, retry policy, cache policy, measurement boundary, or completion definition changes, a previous result may no longer answer the same question. Preserve the old record and state why a new one is needed. This makes capacity learning cumulative without presenting a historical number as a standing production guarantee.

## Capacity Decision Record: From Observation to Action

A capacity record should help a decision owner choose a proportionate action without making the Quality Engineer an infrastructure approver. Start with the observed condition: for example, a growing payment queue during the defined checkout workload. Then identify the affected journey, the time and system boundary, the competing explanations, and the user or state consequence. Finally, state the supported options and the evidence each option still needs.

| Record field | Atlas example |
| --- | --- |
| Claim | Under the stated synthetic checkout mix, the candidate does not sustain queue growth or unacceptable terminal-state uncertainty. |
| Population and unit | Accepted checkout journeys and associated payment work; attempts are recorded separately. |
| Condition | Named workload, dependency profile, cache state, window, and measured service/queue boundary. |
| Observation | Arrival exceeded completion during the later window; queue wait and dependency timing increased. |
| Competing explanations | Dependency delay, retry amplification, backing-store work, consumer limit, or generator limitation. |
| Decision consequence | Do not present a broad capacity guarantee; select a controlled comparison or constrained operating condition. |
| Owner and trigger | Named engineering/release owner; revisit if workload, dependency, policy, or queue contract changes. |

This record supports a careful statement such as “the evidence justifies a bounded operating condition while the dependency hypothesis is tested.” It does not justify “the system is scalable.” The distinction is essential because a capacity decision includes uncertainty, reversibility, and operational consequence as well as a throughput number.

Before closing the record, check whether the proposed action changes fairness between traffic classes or actors. A limit that protects a shared dependency may have unequal effects across legitimate journeys; that consequence belongs in the decision evidence, not only in an implementation discussion.

State the affected class and duration explicitly, because a short protective rejection and a sustained denial have different user, operational, and risk consequences.

## Capacity Planning as a Sequence of Bounded Decisions

Capacity planning should produce successive, bounded decisions rather than a single assertion that a system “scales.” First identify the operating envelope: the measured journey mix, data shape, dependency behaviour, region, concurrency, and duration. Then state the safe condition supported by evidence, the observable that signals movement toward its boundary, the action to take, and the uncertainty that remains. A result may justify a launch constraint or a further experiment without proving a future peak is safe.

For example, the Atlas record could state: “Under the defined checkout mix, completed demand remained below the observed worker-service ceiling and queue growth stabilised for 30 minutes. At the next offered-load step, the queue grew and user-visible latency increased. The recommended operating limit is therefore the lower measured step, pending validation with a representative dependency response profile.” This is more honest and useful than “checkout supports 42 requests per second.”

Separate *provisioned capacity* from *effective capacity*. Adding workers may not help when a shared dependency, database pool, serialized partition, or external service is the limiting resource. Conversely, a single slow queue may reflect deliberate admission control rather than under-provisioning. Tie every bottleneck hypothesis to a predicted observation: if the hypothesis is correct, what should change when the constrained resource is altered or the offered workload is reduced? That prediction makes investigation testable.

Finally, include recovery and degradation in the plan. A system can have sufficient steady-state throughput yet create an unsafe experience if it cannot drain accumulated work after a transient dependency failure. The evidence packet should say how backlog is observed, what expiry or rejection policy protects users, who owns the intervention, and how the organisation will learn whether the limit still applies after architecture or traffic changes.

Capacity evidence should also name the unit of work. A request, transaction, message, job, or completed user journey has a different service cost and failure consequence. A capacity claim that does not name its unit is usually too vague to plan against or to compare after change.

Observe resource saturation with the same caution as throughput. A high CPU, pool, disk, connection, or queue value can be a useful leading signal, but it becomes a bottleneck claim only when correlated with the affected work and a plausible mechanism. Preserve the relationship over time, including recovery, rather than relying on a single peak screenshot.

When capacity is shared, state the allocation assumption. One tenant, job type, or priority class can consume headroom that aggregate averages hide. Segmented evidence makes it possible to recommend a fair and operationally safe limit rather than an attractive total that only applies to an uncongested population.

## Engineering Perspective

Use a Capacity and Bottleneck Evidence Record to keep fact, claim, competing hypotheses, evidence, limitation, and decision separate. A record should include the workload version, environment, dependency condition, queue boundary, units, and any control changes. This supports a later regression comparison without turning an incomplete diagnosis into a fixed narrative.

## Industry Perspective

Queueing concepts are useful because they make waiting and service imbalance visible. They do not remove the need for measurement boundaries, workload validity, or domain consequences. Google SRE guidance on overload similarly emphasizes controlled load shedding and protection of critical work rather than unlimited acceptance.[^sre-overload]

## Common Misconceptions and Pitfalls

### “CPU is not high, so there is no capacity problem.”

The relevant constraint may be a queue, dependency, connection pool, data-store contention, or policy boundary.

### “The longest trace span is the bottleneck.”

A long span is evidence. It needs population, timing, queue, and competing-hypothesis context before it supports a causal conclusion.

### “A bigger queue solves overload.”

It may delay failure while increasing waiting, memory pressure, recovery time, or user uncertainty. Backpressure and bounded retry policies can be more appropriate depending on the claim.

## QA → QE Transition

The transition is from naming the visibly busy component to triangulating evidence, recording alternatives, and recommending a proportionate next experiment or mitigation.

## Summary

Capacity and bottleneck reasoning connects demand, completion, queues, resources, dependencies, and consequences. An imbalance or high utilization is evidence to investigate, not a complete causal diagnosis. Good records preserve competing hypotheses and limitations.

## Key Takeaways

- Capacity is bounded by workload, system, evidence, and decision context.
- Arrival/completion imbalance and queue growth can reveal accumulation without proving cause.
- Caches, databases, async processing, and dependencies can shift rather than remove constraints.
- Scaling is a hypothesis that requires evidence and may create a new constraint.

## Review Questions

1. Why does a growing queue not by itself prove the source of a bottleneck?
2. What is the difference between utilization and saturation?
3. Why might a cache improvement create a security-relevant boundary concern?
4. Which evidence would you request before recommending a scaling change?

## Interview Questions

1. How would you investigate throughput plateau with moderate application CPU?
2. What do arrival and completion rates tell you about a queue?
3. How do you communicate a bottleneck hypothesis without overclaiming?

## Practical Exercise

Create a **Capacity and Bottleneck Evidence Record** for the Atlas table. State the population, windows, units, leading and competing hypotheses, calculation, limitation, risk, owner, and revision trigger. Propose a safe follow-up experiment that could weaken the leading hypothesis.

## Further Reading

- [Google SRE Book: Handling Overload](https://sre.google/sre-book/handling-overload/)
- [Google SRE Book: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)

## References

[^sre-overload]: Beyer, B., Jones, C., Petoff, J., and N. Murphy, eds. [Site Reliability Engineering: Handling Overload](https://sre.google/sre-book/handling-overload/). Google. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can distinguish capacity, utilization, saturation, queue growth, and backpressure.
- [ ] I can compare arrival and completion rates without claiming causation.
- [ ] I can record competing bottleneck hypotheses and evidence gaps.
- [ ] I can explain why cache and dependency decisions have quality boundaries.

## Chapter Navigation

Previous: [Chapter 4 — Performance Experiments: Load, Stress, Variability, and Validity](chapter-04-performance-experiments-load-stress-variability-and-validity.md) · Next: [Chapter 6 — Performance Regression and Production-Evidence Handoff](chapter-06-performance-regression-and-production-evidence-handoff.md)
