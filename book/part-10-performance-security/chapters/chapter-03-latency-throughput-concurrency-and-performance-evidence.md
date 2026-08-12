# Chapter 3 — Latency, Throughput, Concurrency, and Performance Evidence

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 3 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2 |
| Estimated study time | 210 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A percentile is not a verdict. It is a description of a measured population within a stated boundary.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce reports that average checkout time did not change during an elevated synthetic promotion run. A release summary therefore calls the candidate stable. A closer record shows that the average fell because more fast cache-hit requests completed, while the p95 for authenticated checkout rose and the timeout share doubled. The browser timing record is incomplete, and the payment dependency slowed during part of the window.

The lesson is not that averages are wrong. It is that aggregation can hide the population that matters to a decision. This chapter teaches readers to ask what was timed, who was included, how work completed, and which interpretation the evidence can support.

## Why This Chapter Matters

Teams often collect timing data before they have a disciplined way to interpret it. A single “response time” may refer to browser experience, edge processing, server work, dependency time, or a synthetic generator’s observation. Throughput may mean started work, completed work, or successful terminal outcomes. Concurrency may include queued requests, active requests, and retries. These terms are useful only when their boundary and denominator are stated.

This chapter develops distributional evidence for the experiment, capacity, and regression work that follows. It does not prescribe a dashboard, APM product, or universal percentile threshold.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish latency, response time, throughput, concurrency, completion, and timeout measures;
- interpret p50, p90, p95, and p99 as distribution summaries rather than universal quality ratings;
- identify client, network, server, queue, and dependency measurement boundaries;
- assess population, sampling, environmental validity, variability, and repeatability; and
- produce a Performance Evidence Interpretation Record.

## Measurements Need a Boundary

**Response time** is elapsed time between a stated start and end event. **Latency** is often used more broadly for delay, but teams should define the term rather than assume agreement. An API server may measure time from request receipt to response emission; a browser may measure a longer journey that includes network, rendering, and client work. Neither is automatically the other.

**Throughput** is completed work per unit time for a defined population. It is not the same as attempted requests. **Concurrency** is work simultaneously in a defined system boundary. It can include requests receiving service, queued work, or both. **Timeout proportion** is the number of outcomes classified as timeout divided by a declared population; it should not be silently mixed with all errors or all attempts.

| Measure | Useful question | Common overclaim |
| --- | --- | --- |
| p50 | What does the middle of the measured population experience? | “Most users are fine, so the release is safe.” |
| p95/p99 | How severe is the measured tail? | “The value proves every user experience.” |
| Throughput | How much defined work completed in the window? | “Higher throughput proves more capacity.” |
| Timeout share | How often did the stated population fail to receive a terminal response in time? | “It identifies the root cause.” |
| Concurrency | How much work was simultaneously in the stated boundary? | “It proves the bottleneck.” |

## Distributions, Averages, and Tail Latency

A mean answers a particular arithmetic question, but it can be unstable or unrepresentative when a distribution has a long tail. Percentiles summarize positions in an ordered set: a p95 near 2 seconds means that, for the stated measured population and method, approximately 95 percent of observations were at or below that value. It does not establish how a person perceived the interaction, why the tail occurred, or what threshold is acceptable.

Tail latency matters because queues, slow dependencies, retries, and resource contention often affect a subset of work disproportionately. A system may remain responsive for many requests while a smaller but important population waits, times out, or repeats an action. Report distributions with the population, window, completed versus timed-out classification, and measurement boundary.

### Worked Reasoning: Atlas Checkout Evidence

The following is an **illustrative, synthetic record** from **`PERF-OUTCOME-01 v1`**, a versioned Atlas checkout outcome ledger. Both baseline and candidate use a ten-minute, 600-second steady-state elevated-workload window. The server-side latency boundary is request acceptance to a successful terminal response; browser timing is sampled and incomplete. Values shown to one decimal place are conventionally rounded.

| Outcome ledger (`PERF-OUTCOME-01 v1`) | Baseline `b142` | Candidate `b151` |
| --- | ---:| ---: |
| Offered requests | 18,120 | 20,880 |
| Rejected before acceptance | 120 | 2,880 |
| Accepted requests | 18,000 | 18,000 |
| Completed successfully | 17,946 | 17,838 |
| Timed out after acceptance | 54 | 162 |
| Pending / unknown at window end | 0 | 0 |
| Total terminal / accounted outcomes | 18,120 | 20,880 |

The accounting invariant is explicit: `offered = rejected before acceptance + accepted`, and `accepted = completed successfully + timed out + pending / unknown`. Therefore, baseline is `18,120 = 120 + 18,000` and `18,000 = 17,946 + 54 + 0`; candidate is `20,880 = 2,880 + 18,000` and `18,000 = 17,838 + 162 + 0`.

| Evidence | Baseline | Candidate |
| --- | ---:| ---: |
| p50 response time for successful completions | 420 ms | 350 ms |
| p90 response time for successful completions | 710 ms | 790 ms |
| p95 response time for successful completions | 940 ms | 1,380 ms |
| p99 response time for successful completions | 1,600 ms | 3,100 ms |
| Offered rate | `18,120 ÷ 600 = 30.2` requests/s | `20,880 ÷ 600 = 34.8` requests/s |
| Accepted rate | `18,000 ÷ 600 = 30.0` requests/s | `18,000 ÷ 600 = 30.0` requests/s |
| Completed throughput (successful completions) | `17,946 ÷ 600 = 29.91`, shown as 29.9 requests/s | `17,838 ÷ 600 = 29.73`, shown as 29.7 requests/s |
| Successful-completion proportion among accepted | `17,946 ÷ 18,000 = 99.7%` | `17,838 ÷ 18,000 = 99.1%` |
| Timeout rate / proportion among accepted | `54 ÷ 600 = 0.09` requests/s; `54 ÷ 18,000 = 0.3%` | `162 ÷ 600 = 0.27` requests/s; `162 ÷ 18,000 = 0.9%` |
| Rejection rate / proportion among offered | `120 ÷ 600 = 0.2` requests/s; `120 ÷ 18,120 = 0.7%` | `2,880 ÷ 600 = 4.8` requests/s; `2,880 ÷ 20,880 = 13.8%` |
| Pending / unknown rate / proportion among accepted | `0 ÷ 600 = 0.0` requests/s; `0 ÷ 18,000 = 0.0%` | `0 ÷ 600 = 0.0` requests/s; `0 ÷ 18,000 = 0.0%` |
| Sampled payment-dependency p95 | 610 ms | 1,240 ms |

The candidate improves the median by 70 ms, but the p95 worsens by 440 ms and p99 nearly doubles. Its successful-completion throughput is slightly lower, its timeout proportion among accepted requests is higher, and more offered requests are rejected before acceptance. The appropriate interpretation is not “the candidate is slower” in every respect. It is that the evidence does not support a broad performance-improvement claim for the defined checkout population. The dependency timing is compatible with one explanation, but it does not prove causation.

| Required element | Evidence record |
| --- | --- |
| Population | `PERF-OUTCOME-01 v1`: offered and accepted synthetic authenticated checkout requests; successful completions are named separately |
| Window | Ten-minute (600-second) steady-state interval after the stated ramp and warm-up |
| Units | Milliseconds; requests per second; and proportions with stated offered or accepted denominators |
| Assumptions | Comparable environment and workload version; each accepted request reaches a successful, timed-out, or pending/unknown outcome by window end |
| Calculation | Candidate p95 delta: `1,380 ms − 940 ms = +440 ms` |
| Interpretation | Median improvement coexists with material tail and timeout deterioration |
| Limitation | Server timing and sampled dependency timing do not establish complete browser experience or root cause |
| Decision consequence | Investigate the tail and dependency path; do not promote on the basis of mean or median alone |

## Sampling, Variability, and Repeatability

Every measurement is a sample of a population observed through a method. Sampling can omit client regions, request categories, failed operations, or periods of degradation. A sampled trace may be useful corroboration, but it must not be presented as complete visibility. Repeated runs help distinguish a stable pattern from a one-off condition, but they do not turn a synthetic environment into production.

Record environmental validity: application/build version, configuration, workload mix, data state, dependency condition, region, cache state, measurement method, and window. If any changes, a comparison may be less meaningful. Chapter 4 turns this evidence discipline into an experiment design; Chapter 6 uses it for regression decisions.

## Client, Server, and Dependency Evidence

An end-to-end user journey crosses boundaries. A browser report can include connection setup, client rendering, network conditions, edge work, application processing, queue delay, and dependency calls. A server timer usually begins later and ends earlier. A dependency timer may identify slow work but not all waiting in the caller. Use multiple signals to form a bounded explanation, and preserve gaps instead of filling them with a preferred narrative.

## Interpreting Distribution Shape and Time Order

Distribution summaries are most useful when readers can see the question behind them. Consider two candidate interpretations of the checkout table:

1. “The candidate is faster because its p50 is lower.”
2. “For the stated authenticated checkout population and window, the candidate improves median time but degrades the high-latency tail and timeout share; the evidence does not yet support a broad improvement claim.”

The second statement is longer because it preserves population, boundary, and limitation. It prevents a local improvement from being used as a conclusion about a different group, journey, or production condition.

### Percentiles, Counts, and Outcome Classification

Percentiles depend on the number and kind of observations. A p99 from 100 requests describes a very small tail count. A p99 from a mixture of browse, checkout, success, timeout, and retry observations may have an unclear meaning even when there are many values. The chapter does not prescribe a universal minimum sample size; it requires counts, composition, and limitation.

| Reporting question | Why it matters |
| --- | --- |
| How many observations are in the population? | Tail values become unstable or poorly interpretable when counts are very small. |
| Are timeouts included, excluded, or capped? | Removing slow or incomplete outcomes can improve a distribution while hiding user impact. |
| Are requests grouped by journey, region, actor, or dependency path? | Aggregation can conceal a degraded but consequential slice. |
| Does the window include ramp, warm-up, or recovery? | A percentile may mix materially different system conditions. |
| Is the value client, server, or dependency timing? | The same number represents different boundaries and conclusions. |

### Throughput and Error Denominators

Throughput should name completed work and terminal state. In the candidate `PERF-OUTCOME-01 v1` record, 18,000 requests are accepted in 600 seconds; 17,838 complete successfully and 162 time out, with no pending or unknown outcomes. Its **completed throughput** means successful-completion throughput: `17,838 ÷ 600 = 29.73` requests/s, shown as 29.7 requests/s. Its timeout proportion is `162 ÷ 18,000 = 0.9%` among accepted requests. A report that says “30 requests per second” without indicating whether it means offered, accepted, successfully completed, or all terminal outcomes can conceal an important difference.

The same discipline applies to errors. If a retry creates multiple technical attempts for one checkout journey, calculate and label both attempt-level and journey-level measures when the decision needs them. Do not divide errors by successful completions in one table and accepted requests in another without noting the change.

## Comparing Slices Without Inventing a Population

An aggregate can be accurate and still fail to reveal a material subgroup. Atlas may need slices for authenticated versus anonymous flows, payment fallback versus primary path, cache hit versus cache miss, region, product mix, or dependency condition. A slice should be motivated by the claim, not mined until it produces a preferred result.

| Slice | Reason to inspect | Limitation |
| --- | --- | --- |
| Primary versus fallback payment | Routing change may affect dependency timing and retry behaviour | Sample size and dependency profile may differ |
| Authenticated versus anonymous search | Cache scope and account context can change path behaviour | Does not establish all identity states |
| Cache hit versus cache miss | Helps test a cache-related hypothesis | Cache classification may not explain downstream contention |
| Region or client category | Network and edge conditions may alter observed response time | Synthetic regions may not represent all real locations |
| Timeout versus completed outcome | Prevents removing slow or incomplete work from the narrative | Timeout cause may remain unknown |

When a slice differs materially, state whether it affects the decision. A worse fallback-path p95 might matter more than a modest aggregate change if the fallback activates during a payment incident. A worse result for a tiny synthetic segment might warrant more evidence before it drives a broad decision. Quality Engineering makes the judgment criteria visible.

## Measurement Reliability and Repeatability

Repeated runs are useful when they preserve enough conditions to compare. A repeat with a new build, cache population, dependency profile, request mix, or timer is a new observation, not necessarily confirmation. Conversely, identical runs can repeat the same blind spot. Maintain the measurement method as part of the versioned evidence record.

Use this interpretation sequence before reporting a number:

1. Name population and excluded outcomes.
2. Name start/end boundary and unit.
3. State window and whether it includes ramp, warm-up, or recovery.
4. Record workload, environment, dependency, cache, and sampling assumptions.
5. Compare distribution, throughput, errors, and relevant slices.
6. Separate fact from leading hypothesis.
7. State limitation, decision consequence, owner, and revision trigger.

This is not a mandate for bureaucratic reporting. It prevents a small number from carrying a larger claim than its method can support.

## Worked Comparison: Client and Server Evidence

The following is an **illustrative, synthetic comparison** for a payment-confirmation journey. Server p95 is 900 ms, sampled browser p95 is 1,550 ms, and the dependency p95 is 720 ms. These values cannot be added because their windows and scopes overlap. The gap does, however, justify a bounded question: what client, network, edge, queue, or rendering components are not represented by the server timer?

| Fact | Interpretation | Limitation | Decision consequence |
| --- | --- | --- | --- |
| Server p95 is lower than sampled browser p95 | Server timing is not a complete user-experience measure for this slice | Browser sample is incomplete and may not match all server requests | Preserve both boundaries and avoid using server p95 as a universal customer claim |
| Dependency p95 rises during tail growth | Dependency delay may contribute to caller delay | Does not prove all queue/retry/caller effects | Compare aligned dependency and fallback conditions in an experiment |
| Timeout proportion rises | More accepted requests lack a terminal response within the stated time | Does not identify why or whether final state later resolves | Include terminal-state/reconciliation evidence in decision record |

The goal is not to build an observability tutorial. It is to make sure that performance evidence does not silently substitute one boundary for another.

## Decision Consequences for Common Patterns

| Evidence pattern | Bounded conclusion | Proportionate next action |
| --- | --- | --- |
| p50 improves; p95/p99 and timeouts worsen | Broad performance-improvement claim is unsupported for stated population | Inspect path slices, queue/dependency evidence, and candidate conditions |
| Throughput increases; terminal errors/unknown states increase | More work may be started or completed, but journey integrity needs evidence | Add terminal-state/reconciliation classification |
| Server timing stable; client sample worsens | Server boundary does not represent complete observed journey | Preserve both measures and investigate missing boundary evidence |
| One dependency slows with tail growth | Dependency is plausible contributing evidence | Run controlled comparison; do not state sole cause |
| Results vary across repeats | Pattern may be sensitive to unrecorded condition | Compare versions, state, dependency, method, and windows |

The table links measurement interpretation to action. It avoids the equally unhelpful responses of ignoring a value or treating it as automatic release approval.

## Aggregation Across Time and Instances

An aggregate percentile can conceal changes in time. A candidate might have a stable p95 in the first five minutes, then degrade after a cache fills, a connection pool reaches a limit, or a dependency begins to delay. Combining the intervals into one value may be appropriate for a stated whole-window claim, but it should not replace phase-level evidence when the decision depends on degradation or recovery.

The same issue appears across instances. A fleet-wide p95 does not indicate whether every instance is similar, whether a small subset is overloaded, or whether traffic is unevenly routed. Preserve the aggregation rule: which instances, time intervals, and outcomes entered the calculation; whether each observation has equal weight; and what was excluded. This is especially important when the candidate changes routing, cache scope, regional distribution, or a dependency path.

| Aggregation choice | Useful question | Evidence limitation to record |
| --- | --- | --- |
| Whole-window distribution | What did the defined journey experience during the complete test window? | May hide warm-up, degradation, or recovery phases. |
| Phase distributions | Did behaviour change after a known workload or dependency transition? | Each phase has a smaller population. |
| Per-instance comparison | Is tail behaviour concentrated in a subset of the service? | Instance identity may not explain upstream routing or client effects. |
| Weighted journey result | What did a defined business journey mix experience? | The weights are assumptions, not a universal traffic forecast. |

An evidence record can include both a whole-window summary and phase-level summaries without treating them as competing truths. They answer different questions. The reviewer should be able to tell which one supports the stated decision.

## Outcome Reconciliation and Lost Work

Not every request yields a clean timing observation. An accepted operation may time out at the client while completing later, be cancelled, retry, fail before the server timer starts, or remain in an unknown terminal state. A reliable report connects timing data to outcome classification. It says whether the result measures technical attempts, accepted operations, completed operations, or a reconciled business journey.

For Atlas checkout, a client timeout is not automatically a failed payment and a successful response is not automatically a completed order. The decision may need a reconciliation category: completed, rejected, safely retried, cancelled, unresolved, or pending. This makes a difference when a candidate appears faster by excluding uncertain work. It also prevents latency evidence from being used to claim integrity that the measurement method did not assess.

## Measurement Drift and Reproducibility

Measurement drift occurs when the timer, sampling rule, dashboard query, or aggregation changes between observations. A change may be necessary, but it creates a new version of the measurement contract. Record the change, why it was made, the expected effect on comparability, and whether earlier data was recalculated or retained as a distinct series. Do not silently overwrite a historical baseline.

Reproducibility does not mean that every run must produce identical values. It means another engineer can recreate the stated method well enough to judge whether a difference is likely due to the candidate, normal variation, or a changed condition. This requirement supports decision quality even when the conclusion remains deliberately bounded.

## Linking a Measurement to a System Change

The most useful performance evidence describes the relationship between a named change and an observed behaviour without overstating causation. Begin with the change inventory: code or configuration version, feature condition, route selection, cache policy, dependency contract, and measurement method. Then name the population that could be affected. A cache adjustment for authenticated search may affect cache-miss work, backing-store demand, and a subset of authorization-sensitive paths; an aggregate dashboard may not show all three.

Next, write the prediction that makes the evidence informative. If the cache adjustment is intended to reduce backing-store work, comparable cache-miss timing and data-store observations should move in a compatible direction. If only the aggregate p50 improves while the cache-miss slice and tail worsen, the initial explanation is incomplete. The result still matters, but it directs investigation toward traffic composition, queueing, dependency behaviour, or a changed boundary rather than a simple success claim.

This is a practical form of engineering judgement. It asks whether the evidence would look different if the proposed mechanism were not involved, and it records the limits of the answer. It does not require a complete causal model or a specialised analysis platform.

| Change-evidence question | Example bounded record |
| --- | --- |
| What changed? | Candidate cache policy and named checkout routing condition. |
| Who or what can be affected? | Synthetic authenticated checkout requests on the stated fallback path. |
| What outcome was expected? | Reduced backing-store wait without worsening stated tail or timeout outcome. |
| What would challenge the explanation? | Tail growth in cache-hit and cache-miss slices, or unchanged backing-store timing. |
| What is the decision now? | Investigate, constrain, or compare again; do not announce a universal improvement. |

## Measurement Contract and Consumer Impact

A performance measurement is useful only when its contract is clear. Record the clock used, the start and end events, the unit, the sampling rule, treatment of retries and failures, and whether the result describes an attempt, a completed business operation, or a user-visible journey. A latency chart labelled only `response time` cannot tell a reviewer whether it includes client queuing, a gateway, an asynchronous hand-off, or a dependency call.

The contract also prevents false comparisons. A 120 millisecond server span can coexist with a 1.6 second user-visible completion time when the client waits for a queue, retry, or rendering work outside that span. Neither number is wrong; each answers a different question. The quality engineer connects them by declaring the boundary and then looks for the source of the difference rather than averaging them together.

Connect a distribution to a consequence. If the slowest one percent of checkout operations occurs during a promotion, quantify the affected population and journey stage before describing the result as a release blocker. If the same tail belongs to a background export with a published asynchronous completion expectation, the decision may be different. This is not permission to ignore tail latency. It is a requirement to explain whose experience and which service objective are represented by the tail.

For repeated runs, preserve time order as well as aggregate percentiles. A stable p95 can hide a ten-minute degradation that occurred after a cache warmed or a dependency rate limit began. A timeline, phase markers, and a count of completed operations let another engineer distinguish a stable population from a mixed run. Evidence becomes stronger when its construction is visible.

Before publishing a comparison, ask whether the slower result is distinguishable from normal run-to-run variation. The answer need not require advanced statistics, but it does require repeated observations and an explicit statement of the observed range. If a candidate falls within the established range, call the result inconclusive for the proposed threshold and choose the smallest additional measurement that could reduce uncertainty.

Counts matter alongside percentiles. A p99 calculated from a small or changing population may be volatile, while a lower percentile can conceal a smaller but important affected segment. Report the number of eligible observations, excluded observations and why, failures, retries, and the time window. These details let a reviewer judge whether a tail result is a signal, an artefact of population construction, or a reason to collect more evidence.

## Engineering Perspective

Design evidence records so that another engineer can reproduce the interpretation. Record raw counts where feasible, not only percentages; retain window and population definitions; version the workload and environment; and link a distribution to the change and decision it informed. A performance budget can be a local decision rule, but it must state the population, measure, threshold rationale, owner, and revision condition.

## Industry Perspective

The W3C Resource Timing specification describes browser measurement interfaces and their limits; it is a specification for a defined browser context, not a complete user-experience model.[^w3c-resource-timing] Use it when a browser measurement claim is relevant, and revalidate its current status at Final Gate.

## Common Misconceptions and Pitfalls

### “The average improved, so the release improved.”

An average can conceal tail deterioration, changed composition, or incomplete work. Inspect distributions, throughput, errors, and the affected population.

### “p99 is always the most important metric.”

A percentile becomes important through the claim and consequence. A p99 based on too few observations, an unclear population, or mixed windows can be less useful than a well-defined p95 and timeout record.

### “A dependency trace proves the bottleneck.”

It may support a hypothesis. Queueing, caller behaviour, cache state, database contention, and measurement scope can still contribute.

## QA → QE Transition

The transition is from reporting one response-time number to stating what a distribution supports, for whom, using which method, and with which limits. A Quality Engineer makes the resulting decision consequence visible.

## Summary

Performance evidence is distributional and bounded. Latency, throughput, concurrency, and error measures need a shared population, window, unit, and boundary. Averages and individual percentiles are useful summaries, not conclusions.

## Key Takeaways

- Define the measurement boundary before comparing numbers.
- Report distributions alongside population, window, completions, timeouts, and limitations.
- Tail behaviour can invalidate a broad improvement claim even when median latency improves.
- Sampled, server, client, and dependency evidence each have different blind spots.

## Review Questions

1. Why might a lower average coexist with a worse user-relevant outcome?
2. What must be stated when reporting a p95 result?
3. How does completed throughput differ from attempted request rate?
4. Why does sampled dependency timing not prove root cause?

## Interview Questions

1. How would you investigate a candidate with a better p50 and worse p99?
2. What evidence would you request before approving a performance budget?
3. How do you explain the difference between server timing and user experience?

## Practical Exercise

Create a **Performance Evidence Interpretation Record** for the synthetic table in this chapter. State the claim, population, window, units, evidence, calculation, competing explanations, limitation, decision consequence, owner, and revision trigger. Propose one additional evidence source without assuming production access.

## Further Reading

- [W3C Resource Timing](https://www.w3.org/TR/resource-timing/)
- [Google SRE Book: Addressing Cascading Failures](https://sre.google/sre-book/addressing-cascading-failures/)

## References

[^w3c-resource-timing]: World Wide Web Consortium. [Resource Timing](https://www.w3.org/TR/resource-timing/). Accessed 2026-08-12; revalidate specification status at Final Gate.

## Chapter Checklist

- [ ] I can define latency, throughput, concurrency, and timeout populations without mixing boundaries.
- [ ] I can explain why average and percentile results require interpretation.
- [ ] I can identify client, server, dependency, and sampling limitations.
- [ ] I can produce a decision-ready performance evidence record.

## Chapter Navigation

Previous: [Chapter 2 — Workload, Threat, and Measurement Models](chapter-02-workload-threat-and-measurement-models.md) · Next: [Chapter 4 — Performance Experiments: Load, Stress, Variability, and Validity](chapter-04-performance-experiments-load-stress-variability-and-validity.md)
