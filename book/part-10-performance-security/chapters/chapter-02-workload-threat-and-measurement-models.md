# Chapter 2 — Workload, Threat, and Measurement Models

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 2 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapter 1 and basic quantitative reasoning |
| Estimated study time | 210 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A workload profile and a threat model are not decorations around a test. They state the conditions under which evidence can mean anything.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce expects a seasonal promotion. A team proposes “500 virtual users for ten minutes” as its performance test. A second team proposes to verify account recovery because an excessive-request pattern has been observed in a synthetic exercise. Both plans sound concrete, yet neither explains the system question.

Are 500 users browsing, signing in, or checking out? Do they arrive at once or over time? What delay do users introduce between journeys? Is the payment dependency healthy? Does the account-recovery verification consider an anonymous shopper, a legitimate customer who forgot a password, and an automated actor making excessive requests? Without those distinctions, the result might be repeatable but irrelevant.

This chapter turns vague demand and security concerns into models that another engineer can inspect. It also introduces Little's Law as a consistency aid, not a shortcut to a capacity promise.

## Why This Chapter Matters

Performance evidence depends on a workload model; defensive security evidence depends on an asset, actor, trust-boundary, and misuse model. A generic profile or generic checklist can produce activity without establishing that the activity represents the engineering decision at hand.

This chapter supplies the assumptions used by Chapters 3–6 performance evidence and Chapters 7–11 security evidence. It does not teach production traffic generation, attack simulation, enterprise threat governance, or capacity guarantees.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish open arrival-rate workloads from closed virtual-user workloads;
- define workload population, composition, concurrency, think time, ramp, duration, and measurement windows;
- describe assets, actors, trust boundaries, attack surface, and misuse assumptions as evidence context;
- use Little's Law to cross-check a bounded steady-state observation; and
- produce a Workload, Threat, and Measurement Assumptions Register.

## A Model Is a Claim About Conditions

A **workload model** states how demand reaches a defined system boundary. It identifies the request population, journey mix, arrival or user behaviour, timing, state, dependency condition, and environment. It is not an assertion that production will behave exactly that way.

A **threat model** in this chapter is a defensive model of assets, actors, trust boundaries, misuse possibilities, assumptions, and evidence gaps. It is not an attack playbook. It helps a Quality Engineer decide which verification questions are proportionate. For Atlas, a payment token, customer account, order state, and support refund action are assets. Browser, API, payment partner, queue consumer, and support workflow can be trust boundaries. An authenticated customer, anonymous shopper, support operator, and service account can have different relevant permissions and risks.

| Model element | Performance question | Security question |
| --- | --- | --- |
| Population | Which requests or journeys count? | Which actors, assets, and states are in scope? |
| Boundary | Where is time measured? | Where does trust or authorization change? |
| Assumption | What workload, dependency, and data state apply? | What misuse or failure assumption is being verified? |
| Evidence | Which timings, completions, and errors are collected? | Which allow/deny outcomes, records, and limitations are collected? |
| Limitation | What production variation is excluded? | Which actor, route, or control coverage is not established? |

## Open and Closed Workload Models

An **open workload model** specifies arrivals independently of completed responses. For example, Atlas may model 40 checkout requests per second arriving during a sustained promotion window. A delayed response does not stop the intended arrivals; queues and in-flight work can grow.

A **closed workload model** specifies a fixed number of active users or workers. Each waits for a response and often waits again for **think time** before beginning another action. It can represent an interactive journey, but the achieved arrival rate depends on response time and think time. When the system slows, the generator may create fewer new operations. This is not inherently wrong; it answers a different question.

Neither model is universally realistic. Use an open model to examine a stated arrival pressure or event-driven demand. Use a closed model when the question concerns a bounded population of interactive users with credible think-time assumptions. Record why the choice may misrepresent queues, retries, automated abuse, or a dependency slowdown.

## Little's Law as a Consistency Aid

For a bounded population observed in a stable system, **Little's Law** is:

```text
L = λW
```

`L` is the average number of items, users, or requests in the defined system. `λ` is the average arrival or completion rate for the same defined steady-state population. `W` is the average time that population spends in the same system boundary. The equation is useful for cross-checking observations. It is not a universal performance oracle, a capacity formula, or proof that a model is valid.

The terms must match. If `W` measures checkout API handling only, `L` cannot represent browser users from page view through order confirmation. If `λ` is completions, its population and window must match the completions represented by `W`. Units must be compatible: requests per second multiplied by seconds produces requests. A ramp, queue growth, retried request, or unknown-state payment attempt can make a simple steady-state interpretation misleading.

### Worked Reasoning: Atlas Checkout Consistency Check

The following is an **illustrative, synthetic example**. During a ten-minute steady-state window, Atlas records 30 completed checkout requests per second. For the same successful-checkout population and boundary—from checkout API acceptance to terminal response—the mean time in system is 1.2 seconds.

```text
L = λW
L = 30 completed checkouts/second × 1.2 seconds
L = 36 average in-flight checkout requests
```

The request-level telemetry reports an average of 37 in-flight checkout requests. That is close enough to prompt investigation of rounding and sampling, not a claim of perfect agreement. If telemetry instead reports 110 in-flight requests, the team should not “fix” the equation. It should ask whether the systems differ: perhaps the in-flight gauge includes queued payment attempts, retries, unfinished timeouts, or a different request population.

| Required element | Record for this example |
| --- | --- |
| Population | Successful synthetic checkout requests using the stated payment mix |
| Window | Ten-minute steady-state interval after warm-up |
| Units | Requests; completed requests per second; seconds |
| Assumptions | Same boundary for all terms; approximately stable arrivals/completions; bounded retry behaviour |
| Calculation | `30 requests/s × 1.2 s = 36 requests` |
| Interpretation | Observed and implied concurrency are broadly consistent, but not a capacity conclusion |
| Limitation | Excludes abandoned client flows, unknown-state attempts, and non-steady ramps |
| Decision consequence | Investigate material mismatch before using concurrency evidence in a capacity or release decision |

In a closed model, user think time matters. Ten users who wait 20 seconds after each successful action do not generate the same arrival pressure as ten users who immediately repeat a request. Retries can also distort naïve reasoning: a logical checkout journey may create several technical requests, while a queue can retain work after a client timeout. Define the population before calculating.

## Workload Windows and Validity

An experiment typically contains a ramp, a warm-up, a steady-state interval, and a cooldown. A **measurement window** is the interval whose population, units, and results support the stated claim. Including warm-up cache fills or a ramp in the same distribution as steady-state demand can make a result hard to interpret. A brief stable interval cannot establish endurance behaviour. A long run with changing dependency behaviour cannot be summarized as one homogeneous condition.

Atlas uses four synthetic workload profiles:

| Profile | Intended question | Boundary to record |
| --- | --- | --- |
| Normal | Does a representative baseline journey behave as expected? | Mix, state, dependency condition, and sample window |
| Elevated | How does the system behave at higher planned demand? | Arrival/user model, ramp, duration, and queue behaviour |
| Spike | What happens when demand changes sharply? | Arrival schedule, rate-limit or backpressure response, and recovery |
| Sustained | Does behaviour remain stable over a longer bounded interval? | Duration, resource trend, dependency behaviour, and sampling limits |

## Workload Composition and Journey State

Request rate alone is rarely enough to describe an application workload. A commerce journey has composition and state. Browse/search may be cache-heavy, checkout may call a payment dependency, and account recovery may call an identity dependency and apply a protective control. A profile that uses a single endpoint at a fixed rate can be valuable for isolating a bounded question, but it should not be described as an end-to-end promotion model.

The Atlas baseline uses a normal, elevated, spike, and sustained profile. Each profile must identify the journey mix and state assumptions. A checkout request without a product, account, cart, payment method, and order-state boundary may exercise a different path from the one the decision concerns. Conversely, a highly realistic workflow with unrecorded state becomes impossible to compare across runs.

| Workload design question | Example decision consequence |
| --- | --- |
| Which journeys are in the population? | A search-heavy mix cannot alone establish checkout capacity. |
| What is the composition? | A rise in payment fallback share can change dependency and queue evidence. |
| Which requests are successful, timed out, retried, or unknown state? | Completed throughput must not hide accumulated or abandoned work. |
| What state is preconditioned? | A warm cache may answer a cache-hit question but not a cold-start or invalidation question. |
| How does demand arrive? | Independent arrival pressure and response-paced users can produce different queue behaviour. |
| How long does the condition last? | A ten-minute steady window cannot establish sustained recovery over hours. |

### Open Workload Example

Assume the promotion hypothesis is that Atlas receives 36 checkout arrivals per second for ten minutes after a two-minute ramp. An open model preserves that intended arrival schedule regardless of whether some earlier requests become slow. It is useful when the team needs to observe how the checkout, queue, payment dependency, and retry policies respond to arrival pressure.

The evidence record should distinguish intended arrivals, accepted requests, completions, timeouts, rejected requests, retries, and queued work. If 36 requests per second are intended but only 30 complete per second while a payment queue grows, the difference is meaningful evidence. It does not identify why the system cannot keep up, and it does not forecast production demand.

### Closed Workload Example

Assume a separate question concerns 120 synthetic customers completing a browse-to-checkout journey. Each customer has a stated think-time range between search, cart, and checkout. The rate produced by this model changes if checkout slows. That is useful for examining a bounded interactive journey, but it does not establish that independent arrivals would remain at the original rate during a stall.

Think time must be treated as an assumption, not a random cosmetic delay. State whether it represents a user action interval, a workflow wait, or a generator artifact. When a closed model includes retries, decide whether the retry is part of the same user journey, a separate technical request, or an unknown-state recovery. That choice affects population and Little's Law terms.

## Little's Law Mismatch Investigation

A mismatch between implied and observed concurrency is a starting point for diagnosis. Use a structured check before concluding that a metric is wrong.

| Check | Question | Possible explanation |
| --- | --- | --- |
| Population | Do `L`, `λ`, and `W` include the same requests or journeys? | Gauge includes queued payment work while timing excludes it. |
| Boundary | Do all terms begin and end at the same events? | Timer begins at API receipt; in-flight gauge begins at browser initiation. |
| Window | Do the averages use the same steady-state interval? | Rate includes a ramp or recovery period. |
| Unit | Are seconds, milliseconds, rates, and counts compatible? | Mean time is read as milliseconds without conversion. |
| Arrival/completion semantics | Does `λ` represent arrivals or completions, and is the system stable? | Arrivals exceed completions while a queue grows. |
| Retries | Are repeated technical requests counted once or several times? | Logical journeys and HTTP attempts are mixed. |
| Think time | Does a closed-user count include people between operations? | User population is substituted for in-system request population. |

The correct response to a mismatch may be to improve telemetry, choose a clearer boundary, separate queues from service, or revise the workload model. It is not to choose whichever number supports a preferred conclusion.

## Threat Models as Measurement Models

Threat assumptions also benefit from careful population and window design. An excessive-request pattern is not the same population as legitimate customers. A support role is not the same actor as a service account. A malformed input record is not a claim about every output context. State which action, resource, state, request rate, and evidence window matter.

For example, an account-recovery control can be assessed with two paired but distinct models:

| Model | Population | Measurement question | Important limitation |
| --- | --- | --- | --- |
| Legitimate recovery | Synthetic customers with stated recovery state | What latency, rejection, and terminal outcome occur under the spike profile? | Does not represent every accessibility or support condition. |
| Excessive request | Synthetic repeated attempts under a bounded policy | Does the control reduce accepted attempts according to the defined rule? | Does not estimate real attackers or their adaptation. |

Keeping the models separate prevents a common error: treating a reduced count of excessive attempts as proof that legitimate customers are safe, or treating a legitimate latency metric as a security-control outcome.

## Threat and Misuse Assumptions

Threat assumptions should be concrete enough to guide verification and bounded enough to avoid invented certainty. “Security is important” does not identify an asset, actor, or question. “A support operator may view an order but must not initiate a refund” identifies an actor, resource, action, state, and expected denial boundary. “Account recovery must remain usable for a legitimate customer while excessive requests receive a proportionate control response” identifies a performance-security interaction to examine later.

| Atlas assumption | Defensive verification question | Limitation to record |
| --- | --- | --- |
| Anonymous actor sends malformed catalogue filters | Does input handling preserve the expected boundary without exposing sensitive diagnostic detail? | Does not establish every input context or parser path. |
| Authenticated customer requests another customer's order | Is the request denied across the stated API and cached-view boundaries? | Does not establish all roles, resources, or states. |
| Excessive account-recovery requests occur during a spike | Does the control protect the flow while preserving an evidence-based legitimate-user path? | Synthetic rate does not quantify real abuse prevalence. |
| Partner dependency intermittently times out | Are retries bounded and is unknown state handled without unsafe authorization or duplicate action? | Does not establish the partner's production behaviour. |

## Worked Register: Promotion and Recovery Assumptions

The following is an **illustrative Workload, Threat, and Measurement Assumptions Register**. It is specific enough to challenge, but it does not claim to represent production Atlas traffic.

| Field | Checkout promotion entry | Account-recovery entry |
| --- | --- | --- |
| Decision question | Does the candidate checkout path provide sufficient evidence for the selected elevated synthetic workload? | Does the proposed control bound the defined excessive-request pattern while retaining a credible legitimate-user path? |
| Population | Authenticated synthetic checkout requests, classified by primary and fallback payment path | Legitimate synthetic recovery attempts and a separate excessive-request population |
| Journey mix | 70% browse/search, 20% checkout, 10% account/recovery at part level; checkout evidence contains only checkout population | Recovery path only, with a stated session/account condition |
| Arrival/user model | Open 36-checkout-arrivals/s after ramp; separate closed journey model where stated | Spike arrival schedule for excessive attempts and closed-user legitimate recovery journey |
| State/data | Synthetic catalogue, account, cart, payment, cache, and queue fixtures at named version | Synthetic account state, rate-limit policy version, identity-dependency profile |
| Dependency assumption | Payment partner may degrade or time out within bounded profile | Identity dependency is available within stated latency range unless experiment changes it |
| Security assumption | Customer cannot access another customer's order; payment state is reconciled after unknown result | Excessive attempts receive proportionate control response; legitimate user has stated recovery/support path |
| Evidence | Arrival, completion, timing distribution, queue, retry, dependency, and terminal state records | Latency, rejection/acceptance proportion, control outcome, session/cache boundary, and support-path records |
| Blind spot | No production browser/region mix; synthetic partner behaviour | No real abuse prevalence, accessibility evaluation, or all identity-provider paths |
| Owner/revision trigger | Quality Engineer owns evidence; reassess after workload, fallback, retry, cache, or dependency change | Quality Engineer owns evidence; reassess after policy, identity, cache/session, or workload change |

The register prevents a workload plan and a security plan from drifting apart. It makes clear that a rate-limit decision cannot reuse checkout throughput as its only evidence, and a payment experiment cannot reuse an identity-control result as a capacity estimate.

### Register Review Questions

Before approving a register for an experiment or verification, ask whether another engineer could generate the intended population from the description; whether performance and security populations have distinct denominators; whether retries and unknown states are classified; whether the time window matches the claim; and whether a changed assumption would reopen the evidence. If an answer is unclear, add an assumption rather than allowing a vague test profile to decide the boundary.

## Choosing a Model for the Decision

No workload model is more realistic in the abstract. The useful model is the one whose simplifying assumptions are acceptable for the decision.

| Decision need | Usually useful model | Reason | Limitation to state |
| --- | --- | --- | --- |
| Assess queue response to stated external demand | Open arrival model | Preserves arrival pressure while responses slow | Does not model user abandonment or think time by itself |
| Assess a bounded interactive journey | Closed-user model with stated think time | Models response-paced users and sequence/state | May suppress arrivals during stalls and understate independent demand |
| Assess spike protection | Schedule-preserving arrival profile | Makes demand change and recovery observable | Generator capacity and intended schedule require validation |
| Assess sustained drift | Long bounded profile based on claim | Allows a trend to be observed over chosen duration | Cannot prove all long-term or production behaviour |
| Assess rate-limit boundary | Separate legitimate and excessive synthetic populations | Preserves distinct quality and security claims | Does not quantify real attackers or all legitimate-user contexts |

The explanation matters as much as selection. An engineer should be able to say: “We selected a closed model because the question is an interactive support journey with stated think time; it does not establish incoming traffic pressure during a dependency stall.” That sentence is evidence discipline in action.

## Assumption Drift During a Test

Assumptions can drift even during a synthetic run. A cache can warm, a queue can grow, a dependency can recover, a generator can slow, or a rate-limit counter can accumulate. If the change affects the claim, split the window or label the run as limited. Do not average the drift away.

| Drift | Effect on interpretation |
| --- | --- |
| Cache warm-up | May improve a later interval relative to startup path |
| Dependency degradation/recovery | Can change latency, queue, and completion evidence across same run |
| Growing queue | Violates simple steady-state assumption for arrival/completion interpretation |
| Generator saturation | Reduces achieved arrivals; no longer answers planned arrival question |
| Policy/configuration change | Makes one window a different candidate from another |

This check reinforces Little's Law's boundary: it is most useful for matching, approximately stable observations, not for smoothing a changing system into one number.

## Model Review Through Contradiction

Before accepting a workload or threat model, try to disprove its most consequential assumptions. Compare planned arrivals with completed work, offered load with accepted load, and the expected journey mix with the telemetry that defines the population. A mismatch does not automatically invalidate the run; it changes what can be claimed. For example, a system that completes 28 requests per second while the driver offers 35 may be demonstrating admission control, saturation, or an instrumentation gap. Those alternatives must be separated before reporting throughput.

Apply the same discipline to a threat model. If a boundary assumes that only a service identity can call an operation, ask what establishes that identity, where the decision is enforced, how configuration is changed, and what evidence would reveal a failed assumption. The aim is not to enumerate every imaginable misuse. It is to make the assumptions that matter to a quality decision observable and reviewable.

A concise model-review record includes the decision, population, arrival or actor model, state and data conditions, dependencies, exclusions, observables, and invalidation conditions. It gives a later reviewer enough context to decide whether two results are comparable without asking the original author to reconstruct the test from memory.

## Engineering Perspective

Version a workload-and-threat assumption register alongside the change or evidence record. A changed checkout mix, cache policy, identity flow, dependency contract, or environment can invalidate a comparison that otherwise looks rigorous. A versioned register helps the team see whether a performance result and a defensive verification still answer the same question.

## Industry Perspective

NIST's Cybersecurity Framework frames cybersecurity risk management as outcomes and context, rather than a fixed catalogue of technical tests.[^nist-csf] OWASP's application and API materials are influential practitioner guidance; they support coverage questions but are not a universal risk analysis or legal obligation.[^owasp-api] Part X uses those sources to inform bounded verification, not to turn a workload or threat model into compliance training.

## Common Misconceptions and Pitfalls

### “Virtual users are the workload.”

Virtual users describe one generator behaviour. The journey mix, think time, response dependence, arrival pattern, state, duration, and dependency condition determine what the result can mean.

### “Little's Law gives capacity.”

It cross-checks a defined steady-state observation. It cannot choose an acceptable latency, prove a queue is healthy, or predict an unmeasured workload.

### “A threat model must enumerate every attack.”

A useful engineering model identifies the relevant assets, actors, boundaries, assumptions, and evidence gaps for a decision. Exhaustive enumeration without prioritization can hide rather than reduce uncertainty.

## QA → QE Transition

The transition is from reusing a generic test profile or checklist to designing an assumption set that another engineer can critique. The Quality Engineer makes the population, system boundary, workload, threat, evidence, limitation, and decision consequence explicit before running an experiment or verification.

## Summary

Workload and threat models establish the conditions under which performance and security evidence can be interpreted. Open and closed models answer different questions. Little's Law provides a bounded consistency check only when its population, units, system boundary, and steady-state assumptions match. Security assumptions identify defensive verification questions, not offensive procedures.

## Key Takeaways

- A workload model is an explicit claim about demand conditions, not a generic user count.
- A threat assumption identifies an asset, actor, boundary, and verification question.
- Little's Law is a consistency aid; mismatches are evidence to investigate, not arithmetic to suppress.
- Ramps, retries, queues, think time, and non-steady behaviour limit simplistic conclusions.

## Review Questions

1. When is an open workload model more useful than a closed model?
2. What must match before applying Little's Law?
3. Why can retries make a simple arrival-rate interpretation misleading?
4. What turns an abuse assumption into a useful defensive verification question?

## Interview Questions

1. How would you challenge a request to test “500 users” without more context?
2. What does a large mismatch between implied and observed concurrency suggest?
3. How do workload and threat models help a Quality Engineer make a release decision?

## Practical Exercise

Create a **Workload, Threat, and Measurement Assumptions Register** for Atlas checkout and account recovery. Define normal, elevated, spike, and sustained profiles; identify the population, boundary, method, threat assumption, evidence source, blind spot, owner, and revision trigger. Include one Little's Law consistency check using clearly synthetic values.

## Further Reading

- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20)
- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x03-introduction/)
- Neil J. Gunther, *Analyzing Computer System Performance with Perl::PDQ* (for queueing-model concepts)

## References

[^nist-csf]: National Institute of Standards and Technology. [NIST Cybersecurity Framework (CSF) 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20). 2024. Accessed 2026-08-12.
[^owasp-api]: OWASP Foundation. [OWASP API Security Top 10 — 2023](https://owasp.org/API-Security/editions/2023/en/0x03-introduction/). 2023. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can distinguish open and closed workload models and state their limitations.
- [ ] I can apply Little's Law only to matching, bounded, approximately steady-state observations.
- [ ] I can define a threat assumption without creating an offensive test plan.
- [ ] I can create a versioned workload, threat, and measurement assumptions register.

## Chapter Navigation

Previous: [Chapter 1 — Performance & Security Engineering: Boundaries, Evidence, and Decisions](chapter-01-performance-security-engineering-boundaries-evidence-and-decisions.md) · Next: [Chapter 3 — Latency, Throughput, Concurrency, and Performance Evidence](chapter-03-latency-throughput-concurrency-and-performance-evidence.md)
