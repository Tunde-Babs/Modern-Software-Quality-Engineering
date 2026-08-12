# Chapter 4 — Performance Experiments: Load, Stress, Variability, and Validity

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 4 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–3 |
| Estimated study time | 210 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An experiment supports a claim only when its method would have been capable of showing an inconvenient result.

## Opening Story

The following is an **illustrative scenario**. Atlas changes payment retries after a partner timeout. A short synthetic run reports a p95 of 780 ms and no unusual errors. The team concludes that the retry change is safe. When the dependency is slowed for a sustained interval, however, queued retries grow and the generator records fewer requests than intended because each virtual user waits for the previous response. The reported distribution looks better than the stalled service felt to the users it was intended to represent.

The error is not that the team used a test tool. The error is that its experiment design did not preserve the question it claimed to answer. This chapter makes method, validity, and decision consequence first-class evidence.

## Why This Chapter Matters

A performance experiment is a controlled way to evaluate a bounded claim. It is not a button labelled “load test.” The design must identify a hypothesis, workload, environment, measurement boundary, warm-up, ramp, window, duration, dependency state, completion rule, repeat strategy, and limitation.

This chapter does not teach production stress testing or a named tool. It explains how to assess load, stress, spike, and endurance questions safely in a synthetic environment. Chapter 5 uses valid experiments to investigate capacity and bottlenecks; Chapter 6 compares valid evidence across change.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish load, stress, spike, and endurance questions;
- formulate a falsifiable performance hypothesis and experiment plan;
- define warm-up, ramp, steady-state window, duration, repeatability, and environmental comparability;
- explain coordinated omission using a worked, tool-neutral comparison; and
- create a Performance Experiment Design and Validity Review.

## Experiments Answer Different Questions

| Experiment type | Bounded question | Misuse to avoid |
| --- | --- | --- |
| Load | How does the stated system behave under a representative defined demand? | Treating one profile as all expected demand. |
| Stress | What happens as demand or a constrained resource exceeds the intended operating range? | Calling failure a capacity estimate. |
| Spike | How does the system respond and recover when demand changes quickly? | Assuming a gradual ramp answers a burst question. |
| Endurance/soak | Does behaviour remain stable across a longer stated duration? | Inferring it from a short stable window. |

The experiment begins with a claim, not a number. For example: *Under the stated elevated checkout workload and bounded payment-dependency slowdown, the retry candidate does not increase timeout share or queue growth beyond the local decision rule during the defined steady-state interval.* The claim identifies what result could reject it.

## Designing a Valid Atlas Experiment

An experiment plan should record the control and candidate, application/build and configuration versions, workload model, state and data assumptions, environment, dependency behaviour, measurement method, and termination rules. Keep the decision rule local: it is a stated rule for this decision, not a universal performance standard.

| Plan element | Atlas retry experiment |
| --- | --- |
| Hypothesis | The candidate retry policy improves recovery without worsening tail latency, timeout share, or queue growth for the stated workload. |
| Control/candidate | Existing bounded retry versus candidate bounded retry configuration. |
| Workload | Synthetic arrival schedule, checkout mix, and stated authenticated population. |
| Dependency | Payment partner introduces a controlled latency degradation after warm-up. |
| Window | Exclude warm-up; analyse a ten-minute steady-state interval and recovery interval separately. |
| Evidence | Latency distribution, timeouts, completed throughput, queue depth, retry count, dependency timing, and terminal state. |
| Limit | Does not establish production dependency behaviour or all retry paths. |
| Decision | Promote, mitigate, pause, or gather more evidence under named conditions. |

Warm-up is the period in which caches, connections, queues, or runtime behaviour may be changing. A **ramp** changes demand gradually to avoid conflating sudden generator start with the intended workload. A **steady-state window** is a defined interval selected because the relevant experimental conditions are sufficiently stable for the stated question. It should never be selected only because it looks favourable.

## Coordinated Omission: A Worked Comparison

**Coordinated omission** occurs when a measurement process stops issuing expected work while the system is slow, causing it to under-sample the periods that users or arrivals would have encountered. It is a measurement-validity risk, not a property of any one tool.

The following is an **illustrative, synthetic experiment**. A payment dependency stalls for 20 seconds during an intended 40-checkout-requests-per-second window.

| Measurement approach | Method | Recorded observations during the degraded interval |
| --- | --- | --- |
| A. Response-blocked generation | Each virtual user waits for its response before issuing the next operation. | 420 completed observations; p95 1.2 s; 1.0% timeouts. |
| B. Schedule-preserving observation | Intended arrivals remain visible, or missed requested opportunities are accounted for while stalls occur. | 800 intended opportunities; p95 8.4 s; 12.5% timed-out or delayed opportunities. |

Approach A does not necessarily lie. It describes the work it observed. But it can under-sample the worst latency periods because blocked generators are not issuing or recording the operations that would have been attempted under the intended schedule. If the release decision concerns a continuing arrival pressure or user-impact opportunity, its p95 and timeout evidence can be deceptively favourable.

| Required reasoning step | Correct interpretation |
| --- | --- |
| Measurement method | State whether work waits for a response or preserves intended arrivals. |
| Observed distribution | Report the recorded population, not an unlabeled percentile. |
| Hidden limitation | Identify missed or suppressed opportunities during stalls. |
| Corrected interpretation | The blocked method understates tail delay and user-impact exposure for the stated schedule. |
| Decision consequence | Do not approve the retry change from Approach A alone; preserve the intended-arrival question and investigate queue/recovery evidence. |

This example does not prescribe a particular implementation. The essential lesson is to make the method capable of observing the condition that matters. A closed-user model can still be appropriate for a user journey; it must not be misrepresented as proof of an independent arrival-rate claim.

## Variability, Repeats, and Isolation

One run can be affected by cache state, scheduling, data distribution, connection reuse, dependency timing, resource contention, or measurement loss. Repeat comparable runs when the decision warrants it. Record what changed between runs. A repeated result may increase confidence in the observed pattern; it does not prove the cause or generalize automatically to production.

Isolation is proportional. A fully isolated system may remove the dependency behaviour relevant to the claim. A shared environment may introduce uncontrolled noise. State the trade-off and limit the conclusion accordingly.

## Claim, Control, and Failure-Criterion Review

An experiment is easier to review when it explains what would count as contrary evidence. “Run the checkout test and observe results” is activity. “Under the stated elevated workload and dependency profile, the candidate does not increase p95, timeout proportion, or queue recovery time beyond the local decision boundary” is a claim that can be challenged.

The decision boundary should not be smuggled in after a run completes. It may include a local p95 change, timeout proportion, queue-growth trend, recovery interval, or terminal-state rule. It should identify why that condition matters for this journey and who may accept an exception. It is neither an industry standard nor a promise that performance will be acceptable for every system.

| Experiment concern | Question before execution | Evidence if the result is adverse |
| --- | --- | --- |
| Control/candidate | Which build, configuration, and policy differ? | Versioned change inventory and rollback/mitigation option |
| Workload | Does the profile represent the decision question? | Arrival/user model, mix, state, ramp, and duration |
| Dependency | Is it healthy, degraded, intermittent, or capacity-limited? | Timings, timeout classification, and assumed failure profile |
| Window | Which intervals answer warm-up, steady-state, spike, and recovery questions? | Separate distributions and counts per interval |
| Completion | What counts as completion, timeout, rejection, retry, or unknown state? | Terminal-state record and denominator definitions |
| Repeatability | What must remain aligned across runs? | Environment, cache, data/state, workload, method, and procedure record |

### Designing Recovery Evidence

A system may survive a short stall but recover poorly. For Atlas payment retry, measure not only the degraded interval but also queue, timeout, and terminal-state recovery after the dependency returns to its stated synthetic profile. A queue that drains slowly can continue to affect customers after the original cause is gone. A retry policy can restore some requests while creating duplicate, unknown-state, or delayed work that needs its own evidence boundary.

Record the recovery question explicitly: *After the defined payment-dependency degradation ends, does the candidate return payment queue, timeout share, and terminal-state uncertainty to the stated bounded condition within the selected recovery window?* This does not impose a universal recovery target. It makes the consequence of a slow recovery inspectable.

### Experiment Design for a Spike and Endurance

A spike is not merely a high load. Its defining feature is a rapid demand change and the system's response to it. State the baseline rate, spike schedule, duration, expected protective behaviour such as queueing or rate limiting, and post-spike recovery window. If a team uses a gradual ramp to avoid destabilizing a synthetic environment, it should not call that result a spike test.

An endurance question needs duration chosen for the trend being investigated: resource accumulation, queue drift, connection reuse, cache churn, scheduled dependency behaviour, or data growth. “Run for an hour” is not a rationale. Record why that duration is relevant, which measurements are sampled, and what the run cannot establish. A stable ten-minute interval can be a useful intermediate result; it is not evidence that a long-running service has no drift.

## Interpreting Validity Threats Before Reporting

| Validity threat | How it can mislead | Proportionate response |
| --- | --- | --- |
| Changing cache state | Candidate appears faster because it starts warmer | Precondition or record cache state; compare intended condition |
| Test-generator saturation | Generator cannot produce intended work | Measure generator behaviour and reduce claims accordingly |
| Shared-environment noise | Another workload changes resource and timing evidence | Repeat or isolate where claim requires; record limitation |
| Different data/state | Candidate sees a different query, account, or queue population | Version fixtures and state assumptions |
| Dependency drift | External delay changes during one candidate run | Use controlled profile where feasible; mark attribution limit |
| Omitted errors | Slow or failed work disappears from distribution | Define timeout/error denominator and terminal outcome |
| Coordinated omission | Stalls suppress observations from a response-blocked process | Preserve intended schedule or account for missed opportunities |

An experiment can still be useful with one or more of these threats. The response is to bound the claim, gather complementary evidence, or change the decision—not to pretend the threat does not exist.

## Worked Experiment Review: Payment Retry Candidate

The following is an **illustrative review** of a proposed experiment. The candidate changes bounded payment retry timing after a dependency timeout. The team wants to know whether it improves terminal recovery without unacceptable tail, queue, or unknown-state consequences.

| Review field | Planned record |
| --- | --- |
| Claim | Under stated elevated workload and dependency degradation, candidate retry policy does not create unacceptable tail, timeout, queue-recovery, or unknown-state evidence. |
| Population | Synthetic authenticated checkout requests using primary/fallback payment path; retry attempts recorded separately from logical journeys. |
| Workload | Open arrival schedule after ramp, ten-minute steady state, followed by named recovery window. |
| Control/candidate | Build/configuration v1 retry policy versus v2 bounded retry policy. |
| Dependency | Payment profile includes a controlled degraded interval, timeout category, and recovery event. |
| Measures | p50/p95/p99, completed/accepted/timeout/retry counts, queue depth/wait, dependency time, terminal state. |
| Validity checks | Generator preserves intended arrivals; warm-up excluded; cache/data state recorded; repeated aligned runs planned. |
| Limitation | Synthetic dependency and client conditions do not establish production behavior. |
| Decision rule | Define conditions for further evidence, mitigation, constraint, or pause; name owner and revision trigger. |

### Interpret the Result in Order

First confirm that the generator achieved the intended schedule. If it did not, do not use the run as evidence of the stated arrival pressure. Second, separate the degraded and recovery windows. A result that looks stable before the dependency stall may not answer what happens during or after it. Third, compare terminal outcomes: a faster response that leaves more unknown payment states does not establish a better checkout experience. Fourth, inspect queue recovery and repeat behavior before attributing change to retry policy.

| Observation | Plausible interpretation | What it cannot prove |
| --- | --- | --- |
| Candidate completes more requests after transient timeout | Bounded retry may improve recovery for defined population | That retries are safe for every payment state or dependency |
| Candidate p99/queue wait grows | Retry work may amplify backlog during stall | That retry policy is sole cause |
| Blocked generator reports lower p95 | Measurement may suppress missed opportunities | That user-impact tail is acceptable |
| Queue drains after recovery | System may recover within stated window | That future/longer degradation is safe |
| Unknown state count rises | Terminal reconciliation boundary needs attention | Which subsystem created every unknown state |

The ordered review protects against a common anti-pattern: declaring a candidate successful because one headline value improved while the method or other outcome categories changed.

## Experiment Documentation as a Professional Artifact

A Performance Experiment Design and Validity Review should be usable by another engineer without a particular tool. Include the following headings or equivalent fields: decision question; quality claim; control/candidate; population and completion definition; workload/journey model; state/data/cache assumptions; environment/dependency profile; measurement boundary; ramp/warm-up/steady-state/recovery windows; evidence and calculations; limitations; decision consequence; owner; and revision trigger.

This artifact should make a failed or inconclusive experiment useful. An inconclusive run may show that the generator saturated, conditions drifted, windows mixed, evidence was insufficient, or the initial claim was too broad. The correct outcome can be a revised experiment rather than a pass/fail label.

## When to Stop or Repeat an Experiment

Stop when the planned safety or validity boundary is reached: the synthetic environment is no longer comparable, the generator cannot maintain the model, an unknown-state condition exceeds the exercise boundary, or the evidence is sufficient for the stated decision. Repeat when a material comparability issue prevents interpretation and an aligned run could change the decision. Do not repeat merely until a favourable number appears; record why a repeat is justified and what condition has changed.

## Evidence Capture During Execution

Experiment validity is not established only in planning. During the run, capture the conditions that prove whether the plan remained true: start and end times, build and configuration identifier, workload schedule, generator health, data and cache condition, dependency profile, relevant service state, and any deviation from the procedure. Capture a safe reference to raw evidence rather than relying on a later memory of the run.

| Execution record | Why retain it | What a reviewer can decide from it |
| --- | --- | --- |
| Driver offered and accepted work | Distinguishes intended pressure from work the generator actually emitted | Whether an arrival-rate claim remains valid |
| Phase markers | Separates warm-up, degradation, steady state, and recovery | Which distribution supports which question |
| Configuration and dependency condition | Makes changes outside the candidate visible | Whether comparison and attribution are limited |
| Terminal-outcome counts | Connects timing results to completion, timeout, rejection, and unknown state | Whether an apparent speed gain hides incomplete work |
| Deviations and interruptions | Preserves unexpected events without editing the narrative afterwards | Whether to qualify, repeat, or stop the run |

The record should be minimal enough to use consistently, but complete enough that a reviewer need not infer conditions from screenshots. It also helps distinguish a system signal from a driver or environment problem before people begin debating a result.

## Validity Disposition After a Run

At the end of an experiment, classify the result before interpreting it. A **decision-ready** run maintained its important conditions and provides evidence for the named claim. A **limited** run contains a known deviation but may still support a narrower conclusion or a conservative mitigation. An **inconclusive** run cannot answer the intended question because the method, population, or condition materially changed. These labels describe evidence fitness, not the worth of the people who ran the test.

For a limited run, state exactly what survives. For example, an unexpected dependency slowdown can still show that the candidate did not recover safely under that observed condition, while it prevents a clean code-to-code performance comparison. For an inconclusive run, preserve the safe facts and specify the smallest corrective step: align the dependency profile, reset data state, repair the generator measurement, or separate windows. Do not rerun until a preferred result appears.

## Experiment Evidence as a Handoff

The experiment record should leave a later engineer with a question they can continue to investigate. It might be: *under a preserved-arrival schedule, does the candidate return the payment queue and terminal-state uncertainty to the stated bounded condition after the controlled dependency delay ends?* This wording identifies the workload, outcome, and recovery boundary without imposing a universal target or prescribing operational tooling.

This handoff is especially valuable for endurance and spike concerns. A short run can identify a plausible queue or retry pattern; a later, deliberately designed experiment can ask whether that pattern persists, accumulates, or recovers. The evidence remains connected across runs because the claim and its changes are explicit.

## Phase-Specific Interpretation

Do not allow an overall pass/fail label to hide which phase produced the result. Warm-up can be useful for bringing caches, connections, and workers into the intended state, but it should not silently enter a steady-state percentile. A ramp can expose autoscaling or admission behaviour, but it does not have the same meaning as a stable arrival period. A controlled dependency degradation answers a resilience-related question only if its start, duration, and recovery are recorded. A cooldown can reveal whether queued work drains or whether an apparent recovery merely reflects the generator stopping.

Create a small phase record for every material experiment:

| Phase | Intended question | Minimum evidence |
| --- | --- | --- |
| Warm-up | Did the system reach the specified precondition? | State/cache/connection and exclusion rule |
| Ramp or spike transition | How does behaviour change as demand changes? | Offered work, accepted work, protection/rejection evidence |
| Steady state | Does the defined population meet the local claim under stable conditions? | Distribution, terminal outcomes, queue/dependency state |
| Degraded condition | What happens when the stated dependency or resource condition occurs? | Timing, backlog, retry, and unknown-state evidence |
| Recovery | Does the observed system return to the bounded condition? | Drain, terminal-state, and post-event window evidence |

The phases need not all exist in every experiment. Including only the phases relevant to the decision is better than collecting decorative charts. What matters is that the report tells readers exactly which interval supports each conclusion.

## Selecting a Test Shape for an Operational Question

Choose a test shape from the question rather than from a familiar test name. A load experiment can show whether the defined journey meets an objective under a representative offered workload. A stress experiment can reveal how the system fails as demand crosses a boundary. A spike experiment focuses on the transition itself: admission control, connection pools, autoscaling delay, and recovery. A soak experiment is appropriate when time-dependent states such as retained queues, scheduled work, memory pressure, or credential renewal could alter behaviour. Each can be valid, but each supports a different claim.

Make the transition conditions explicit. For a stress test, record the starting load, step size, duration per step, maximum planned offered load, stop conditions, and recovery observation. Without them, a conclusion such as “the service failed at 80 requests per second” is underspecified: it may mean offered or completed work, a single short step or a sustained condition, and any of several user-visible failure modes.

When a run terminates early, preserve that as data. State which stop condition fired, whether the driver, system, or dependency constrained the run, and whether recovery was observed. Do not delete failed runs merely because they are inconvenient. A bounded failure can provide valuable evidence about safe operating conditions, provided the record does not over-generalise beyond its controlled environment.

An experiment is reviewable when an independent reader can identify the intended claim, the controlled variables, the meaningful differences from baseline, the failure criteria, and the limitations. That standard is more useful than a binary pass/fail report because it supports later comparison and learning.

Use a pre-run review when the consequence of a misleading result is high. A second engineer can check that the driver population, data reset, dependency behaviour, stop conditions, and telemetry boundary match the stated decision. This modest control catches many problems before a long run turns a configuration mistake into a confident but invalid conclusion.

Keep an experiment diary for material deviations. Record unexpected configuration changes, dependency warnings, driver errors, late starts, data resets, or instrumentation gaps as they occur. The diary is not bureaucracy; it helps the team decide whether a result is comparable, needs qualification, or should be repeated under restored conditions.

## Engineering Perspective

Treat the experiment plan and the resulting evidence as a paired artifact. If a result loses its workload version, dependency condition, window, or measurement method, it becomes difficult to compare across change. Define a revision trigger: new retry semantics, a dependency-contract change, a cache change, or a different workload mix should reopen the claim.

## Industry Perspective

Performance-engineering research emphasizes measurement validity, workload definition, and repeatability because a number without a method is difficult to interpret. The IETF's framework for IP performance metrics similarly distinguishes a metric definition from a broad claim about service quality.[^rfc-2330]

## Common Misconceptions and Pitfalls

### “A successful load test proves capacity.”

It proves only that the measured system behaved as observed under the stated conditions. Capacity and scalability need broader evidence.

### “A blocked generator is always wrong.”

It can model a bounded interactive population. It becomes misleading when used to infer behaviour under an intended arrival schedule that it suppresses during stalls.

### “Warm-up data should always be discarded.”

Warm-up can be relevant if the decision concerns startup or cache-fill behaviour. Separate it from a steady-state claim instead of hiding it.

## QA → QE Transition

The transition is from running a load script to designing a method that could support or reject a bounded engineering claim. The Quality Engineer records what the method misses before using a result to advise a decision.

## Summary

Experiment validity is part of performance evidence. Load, stress, spike, and endurance tests answer different questions. Coordinated omission demonstrates why a favourable percentile can be an artifact of what the measurement method failed to observe.

## Key Takeaways

- Start with a claim and a decision, not a generic test type.
- Separate ramp, warm-up, steady state, recovery, and duration in the evidence record.
- Preserve workload and measurement methods across comparable runs.
- A response-blocked measurement can understate tail impact during stalls.

## Review Questions

1. Which question does an endurance experiment answer that a short load run does not?
2. Why can a response-blocked generator under-sample a stalled service?
3. What must be comparable before interpreting a repeated experiment?
4. How does an experiment plan limit an unsupported release claim?

## Interview Questions

1. How would you design a performance experiment for a degraded dependency?
2. What is coordinated omission, and why does it matter to a release decision?
3. How do you decide whether a synthetic environment is sufficiently valid?

## Practical Exercise

Create a **Performance Experiment Design and Validity Review** for the Atlas payment-retry scenario. Define the hypothesis, population, workload, method, window, dependency behaviour, evidence, limitations, and decision rule. Then explain how you would identify coordinated omission without using a named tool.

## Further Reading

- [RFC 2330: Framework for IP Performance Metrics](https://www.rfc-editor.org/rfc/rfc2330)
- [Google SRE Book: Handling Overload](https://sre.google/sre-book/handling-overload/)

## References

[^rfc-2330]: Paxson, V., Almes, G., Mahdavi, J., and M. Mathis. [Framework for IP Performance Metrics](https://www.rfc-editor.org/rfc/rfc2330). RFC 2330, 1998. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can distinguish load, stress, spike, and endurance questions.
- [ ] I can define a valid experiment window and state its limitations.
- [ ] I can explain coordinated omission using the measurement method and decision consequence.
- [ ] I can create a tool-neutral experiment design and validity review.

## Chapter Navigation

Previous: [Chapter 3 — Latency, Throughput, Concurrency, and Performance Evidence](chapter-03-latency-throughput-concurrency-and-performance-evidence.md) · Next: [Chapter 5 — Capacity, Scalability, Queues, and Bottleneck Evidence](chapter-05-capacity-scalability-queues-and-bottleneck-evidence.md)
