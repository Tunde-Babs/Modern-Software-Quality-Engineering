# Chapter 6 — Performance Regression and Production-Evidence Handoff

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 6 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–5 |
| Estimated study time | 210 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A numerical difference becomes a regression claim only after the team establishes what changed, what remained comparable, and what uncertainty remains.

## Opening Story

The following is an **illustrative scenario**. Atlas changes a cache key for authenticated search. The candidate lowers median search latency, but its p95 rises for a customer segment and database reads increase. Two runs are available, yet the candidate run used a different cache population and a payment dependency was slower for part of the window.

The team can honestly report an observed difference. It cannot yet honestly attribute the difference to the cache-key change. This chapter provides a versioned comparison model and a limited handoff to runtime learning.

## Why This Chapter Matters

Performance regression work is often reduced to threshold comparison. That can hide changed workload, environment, dependency state, data, procedure, or measurement method. A regression decision needs a traceable baseline and candidate, a comparable population, an interpretation of practical significance, and an explicit uncertainty record.

Part X consumes runtime evidence after release decisions are made; Part VIII owns observability implementation, SLOs, alerting, and incident practice. This chapter does not teach CI/CD or production-monitoring configuration.

## Learning Objectives

By the end of this chapter, you should be able to:

- define versioned performance baselines and candidates;
- distinguish an observed difference from an attributed performance regression;
- calculate and interpret bounded latency and error-rate deltas;
- define a local performance decision rule, owner, and revision trigger; and
- create a Performance Regression Decision Record and runtime-evidence handoff.

## The Versioned Comparison Model

A **baseline** is the evidence record used for comparison. A **candidate** is the proposed changed state. Where several alternatives are evaluated, use Candidate A and Candidate B rather than silently combining results. Version what may affect the interpretation.

| Dimension | Why version it |
| --- | --- |
| Application/build | A code change can alter execution or instrumentation. |
| Configuration | Cache keys, timeouts, retries, and limits affect behaviour. |
| Workload model | Population, mix, arrival pattern, ramp, and duration determine demand. |
| Data/state assumptions | Cache population, account state, catalogue shape, and queue state can change results. |
| Environment | Region, capacity, isolation, and shared conditions affect comparability. |
| Dependencies | Latency, timeout, intermittent failure, and capacity assumptions affect end-to-end results. |
| Experiment procedure | Warm-up, run order, termination, and repeats affect the observed window. |
| Measurement method | Client/server boundary, sampling, timeout classification, and aggregation affect values. |

## Worked Reasoning: Search Candidate Comparison

The following is an **illustrative, synthetic comparison**. The claim is: *For authenticated search in the stated elevated workload, Candidate A does not create a practically significant degradation in tail response time or timeout share compared with the versioned baseline.*

| Field | Baseline | Candidate A |
| --- | --- | --- |
| Build/configuration | `b142`, cache-key v1 | `b151`, cache-key v2 |
| Population | Authenticated search requests | Same intended population |
| Workload/window | 25 requests/s, ten-minute steady state | Same intended model and window |
| Environment | Synthetic region A, cache precondition v1 | Synthetic region A, cache precondition v2 |
| Dependency assumption | Inventory p95 under 200 ms | Inventory slowed for three minutes |
| Result | p95 620 ms; timeout share 0.2% | p95 810 ms; timeout share 0.5% |
| Delta | — | `+190 ms`; `+0.3 percentage points` |
| Uncertainty | Baseline samples client timing incompletely | Candidate has changed cache population and a slower dependency |

The arithmetic is straightforward. The p95 delta is `810 − 620 = +190 ms`; timeout share rises by 0.3 percentage points. The interpretation is not that the cache-key change proved a regression. Dependency behaviour and cache state are material comparability gaps. The evidence supports a decision to repeat under aligned cache and dependency conditions, or to use a constrained mitigation while more evidence is gathered. It does not support a broad performance-improvement claim because the median improved.

## Practical Significance and Local Decision Rules

Statistical or arithmetic change is not automatically a decision. A 20 ms p95 delta may be material for a time-sensitive workflow and immaterial for another bounded claim. A local performance budget or decision rule should identify the population, measure, threshold rationale, owner, consequence, and revision condition. It should not be presented as a universal standard.

| Decision field | Question |
| --- | --- |
| Claim | What behaviour is assessed? |
| Baseline/candidate | Which versioned records are compared? |
| Population/workload/window | Which work and conditions make the comparison meaningful? |
| Result/delta | What changed numerically? |
| Uncertainty/limitation | What could invalidate or limit attribution? |
| Decision | Promote, constrain, mitigate, pause, or collect more evidence? |
| Owner/revision trigger | Who decides, and what future change requires reassessment? |

## Runtime-Evidence Handoff

Pre-production evidence can define what runtime learning should watch, but it cannot prescribe a production telemetry implementation. A handoff record may name the relevant journey, population, expected distribution boundary, dependency condition, uncertainty, owner, and revision trigger. Part VIII provides the engineering depth for instrumentation, SLIs, SLOs, alerts, and incident response.

For Atlas, the candidate's tail risk suggests preserving a runtime question: does authenticated search show a sustained p95 or timeout shift after the cache-key change, and does it correlate with the inventory dependency or cache state? The handoff does not declare that the release is safe; it preserves a testable learning question.

## Establishing Comparison Integrity Before Regression Language

The word *regression* can create unnecessary certainty. Use it only after deciding whether compared evidence is materially aligned. The following checklist helps distinguish a clean comparison, a limited comparison, and a new observation.

| Comparison dimension | Aligned example | Mismatch and consequence |
| --- | --- | --- |
| Build/configuration | Same build except named cache-key change | Retry timeout or identity configuration also changes; attribution is ambiguous |
| Population | Same authenticated search path and composition | Candidate includes anonymous cached requests; distribution is mixed |
| Workload | Same arrival model, ramp, duration, and window | Candidate has different spike profile or generator saturation |
| State/data | Same fixture version and cache precondition | Candidate cache is colder or account state differs |
| Environment | Same synthetic region and relevant capacity | Shared platform change introduces uncontrolled noise |
| Dependencies | Same stated profile | Inventory dependency degraded only for candidate |
| Procedure | Same warm-up, run order, completion rule, repeats | Candidate measured during different recovery period |
| Measurement | Same boundary, sampling, timeout classification | Server timing compared with browser timing |

An incomplete comparison can still support action. If a candidate has large tail deterioration and changed dependency conditions, a team may choose not to promote broadly while gathering aligned evidence. It cannot confidently attribute the full difference to code.

## Selecting a Baseline Family and Candidate Alternative

One historical run is often a weak baseline. A **baseline family** is a set of versioned observations whose relevant conditions are understood. It can show normal variability and help a team see whether a candidate sits within or outside a bounded pattern. Do not use it to calculate false precision or replace a decision rule.

Candidate A and Candidate B are useful when alternatives differ materially. Atlas might compare a cache-key adjustment with a cache-scope restriction, or two retry configurations. Name each candidate and retain its assumptions; do not average them into one result.

| Record field | Baseline | Candidate A | Candidate B |
| --- | --- | --- | --- |
| Change | Existing cache key | Revised lookup key | Revised key plus restricted cache scope |
| Performance claim | Existing search behaviour | Improve lookup without tail regression | Preserve usable evidence with restricted scope |
| Security claim | Existing authorization/cache evidence | No weaker cache scope | Authorization-sensitive data remains bounded |
| Evidence need | Versioned distribution/error record | Comparable performance/caching record | Comparable performance plus refreshed authorization record |
| Decision risk | Historical limitation remains | Tail or stale-scope risk | More misses may change capacity evidence |

## Practical Significance and Runtime Handoff

An observed p95 increase of 190 ms is arithmetic. Its significance depends on journey consequence: interactive search, account recovery, payment confirmation, or internal asynchronous work. State the consequence rather than claiming one change is universally acceptable or unacceptable.

A concise runtime handoff preserves a learning question without becoming an observability design:

| Handoff field | Atlas example |
| --- | --- |
| Change/claim | Cache-key v2 for authenticated search; claim concerns tail and timeout behaviour |
| Population/boundary | Authenticated search, stated client/server boundary, cache scope, dependency path |
| Pre-production evidence | Versioned distributions, errors, cache-state assumption, limitation |
| Runtime question | Does defined population show sustained tail or timeout shift after change? |
| Signals/limits | Use relevant Part VIII signals if available; do not claim root cause or full user experience |
| Owner/escalation | Responsible engineering/release role and reassessment condition |
| Revision trigger | Cache policy, dependency contract, workload mix, client boundary, configuration change |

The handoff maintains decision traceability. It neither replaces pre-production evidence nor imports Part VIII's implementation curriculum.

## Worked Regression Review: Candidate A and Candidate B

The following is an **illustrative extension** of the authenticated-search scenario. Candidate A changes the cache key. Candidate B changes the key and restricts cache scope to address a stale-authorization concern. The goal is not to select the best design; it is to show how versioned records prevent a misleading comparison.

| Field | Baseline | Candidate A | Candidate B |
| --- | ---:| ---:| ---: |
| p50 | 280 ms | 240 ms | 265 ms |
| p95 | 620 ms | 810 ms | 690 ms |
| Timeout proportion | 0.2% | 0.5% | 0.3% |
| Cache-hit rate | 91% | 96% | 89% |
| Authorization cache evidence | Existing scope v1 | Scope v2 has unrefreshed role-change evidence | Scope v3 passes stated role-change review |
| Dependency profile | Healthy | Three-minute degradation in candidate window | Aligned healthy synthetic profile |

Candidate A has an attractive p50 and hit rate, but it is not cleanly comparable because the dependency profile differs and authorization cache evidence is stale. Candidate B has a smaller median gain and a higher p95 than baseline, but its environment is aligned and its stated cache boundary has refreshed evidence. The correct record may say that Candidate B is more interpretable, not that it is universally superior.

### Calculation and Interpretation Record

| Required field | Candidate B record |
| --- | --- |
| Claim | Restricted cache scope maintains usable authenticated search without unacceptable stated tail/timeout or authorization-boundary regression. |
| Population | Synthetic authenticated search requests in named journey/state. |
| Workload/window | Versioned elevated workload, ten-minute steady-state window after warm-up. |
| Environment/dependency | Same synthetic region and healthy dependency profile as baseline. |
| Result/delta | p95 `690 − 620 = +70 ms`; timeout `0.3% − 0.2% = +0.1 percentage points`; hit rate decreases 2 points. |
| Interpretation | Candidate B has a measurable performance cost and refreshed security evidence; practical significance depends on stated journey consequence. |
| Uncertainty/limitation | Browser sample incomplete; other cache nodes and authorization routes remain outside current review. |
| Decision | Owner can compare constrained use, further tuning, or a different candidate; do not call the 70 ms difference a universal regression. |

The exercise demonstrates why a comparison table needs words. Numbers show observed change; interpretation ties it to a claim, limitation, and decision consequence.

## Regressions Across Different Evidence Types

Performance regression evidence may be numerical, while a security regression might be a changed authorization outcome, stale cache behavior, configuration finding, or remediation record. Do not force them into the same unit. Keep a shared change inventory and separate claims.

| Evidence type | Baseline question | Candidate question | Risk of poor comparison |
| --- | --- | --- | --- |
| Latency distribution | What did stated population experience? | Does same population/method show meaningful shift? | Changed window, workload, or client/server boundary |
| Timeout/error proportion | What terminal outcomes occurred? | Are outcomes classified consistently after change? | Excluding retries/unknown state from one side |
| Queue/recovery trend | Did work accumulate and recover under profile? | Did change alter accumulation/recovery? | Comparing different dependency/arrival schedules |
| Authorization matrix | Was actor/action/state denied/allowed as intended? | Did policy/cache/route change make prior result stale? | Calling one passing route proof of whole model |
| Finding/remediation | What was verified/rejected/limited? | Does remediation establish stated boundary? | Closing coverage gap as a false positive |

This distinction prepares the dual-regression approach in Chapter 11.

## Decision Records and Historical Learning

A regression record is useful later only if it preserves the decision context. Record not only whether a candidate passed a local rule, but why the rule mattered, who decided, and what change should reopen it. A later incident or release comparison can then distinguish “we did not know” from “we knew this was outside the evidence boundary.” That supports learning without retrospective blame.

## Regression-Record Review Questions

Before publishing a conclusion, ask whether a reviewer can reconstruct the baseline and candidate, whether the population and window match, whether a delta uses compatible units, whether dependency/cache/state differences are visible, whether practical consequence is stated, and whether a future change has a revision trigger. If not, call the result an observation or a limited comparison rather than a regression verdict.

## Handling Missing, Stale, and Conflicting Evidence

Comparison evidence is often uneven. A performance run may be current while authorization evidence applies to an older cache scope; a new dependency condition may be known while a browser sample is incomplete; a historical baseline may be valid for normal demand but not for a spike. Do not fill these gaps by treating the most recent or most convenient record as a complete comparator. Classify each evidence item as comparable, informative but limited, stale for the change, or missing.

| Evidence state | What can be said | Proportionate action |
| --- | --- | --- |
| Comparable | The result supports the defined baseline/candidate claim | Apply the agreed local decision rule and preserve limitations |
| Informative but limited | The observation indicates a risk or benefit under a different condition | Use it to constrain scope or choose the next comparison; do not attribute causation |
| Stale | A material change makes the previous evidence inapplicable | Refresh the relevant boundary before making the broader claim |
| Missing | The decision requires an unmeasured population, outcome, or condition | Record the gap, owner, and whether a conservative decision is needed |

Conflict is not a failure of the record. It may be the correct conclusion that one candidate improves a central measure while another result shows a tail, integrity, or security-boundary uncertainty. The report should identify which evidence has priority for the current decision and why, without inventing a single composite score.

## Baseline Retirement and Evidence Lineage

A baseline should be retired when it no longer represents a meaningful condition: the workload changed, a new measurement boundary was adopted, a dependency contract changed, the data state became materially different, or an architecture or configuration change altered the journey. Retiring a baseline does not mean deleting it. Preserve its applicability window, its limitations, and the record that superseded it.

Lineage allows a reader to travel from a decision back to the measurement contract, source evidence, calculation, interpretation, owner, and revision trigger. It is particularly valuable when a candidate appears later to perform differently: the team can ask whether the code changed, the world changed, or the method changed. This is historical learning, not a demand for a particular data platform or dashboard.

## Release Conditions and Learning Commitments

When evidence is incomplete, the choice is not limited to “approve” or “reject.” A decision owner might hold the candidate, allow a constrained rollout, accept a bounded local difference with monitoring, or choose a different candidate. The quality record should state the condition attached to the option.

| Option | Required clarity |
| --- | --- |
| Hold and repeat | Which comparability gap or adverse outcome must be resolved? |
| Constrained rollout | Which population, feature condition, reversibility path, guardrail, and owner limit the exposure? |
| Accept with follow-up | Which local claim is accepted, what remains uncertain, and when will it be revisited? |
| Select an alternative | Which evidence makes the alternative more decision-ready, and what trade-off remains? |

These commitments do not replace production operations. They allow a pre-production comparison to hand off a specific learning question to the appropriate runtime-evidence process while keeping the release decision traceable.

## Writing an Honest Regression Conclusion

The conclusion should use language that matches the evidence state. A **fact** can report a measured delta under the named comparison contract. An **interpretation** can say that the difference is material for a defined journey or that the evidence does not support broad promotion. A **hypothesis** can name a plausible cause such as dependency delay or cache state. A **decision** can constrain, pause, or permit a change with conditions. These statements are useful precisely because they are not collapsed into one sentence.

| Evidence state | Defensible conclusion form |
| --- | --- |
| Comparable repeated candidate shows adverse tail and timeout difference | “The observed difference exceeds the agreed local decision boundary for the stated population; do not recommend broad promotion.” |
| Candidate result differs but dependency profile also changed | “The candidate observation is adverse but attribution is limited; repeat under aligned conditions or use a conservative constraint.” |
| Candidate is within observed variation | “The comparison is inconclusive for the proposed threshold; retain the result and collect the smallest additional evidence that could decide it.” |
| Pre-production result is accepted with runtime learning | “The local claim is accepted for the stated scope, subject to the named guardrail, owner, and revision trigger.” |

This vocabulary makes uncertainty actionable. It protects a Quality Engineer from both overclaiming a regression and underreporting a decision-relevant risk. It also gives a later reviewer a clear reason for the action chosen at the time.

It also ensures that a later outcome can update the record without revising the original evidence into a more certain claim than the team actually had.

## Regression Decisions Need an Evidence Lifecycle

A regression result is not complete when a dashboard turns red. It enters an evidence lifecycle: capture the comparison contract, confirm the population and measurement method, investigate plausible causes, decide whether the difference is material for the stated objective, and preserve the decision with an owner and follow-up condition. This lifecycle prevents a noisy one-off result from becoming a permanent baseline and prevents a genuine degradation from being dismissed because the cause is not yet known.

For Candidate B, the initial record should distinguish three statements. First, the observed result: the defined p95 changed from the agreed baseline by the measured amount under the named conditions. Second, the attribution hypothesis: the search-index adjustment may be responsible. Third, the decision: constrain the candidate, investigate it, or accept it with monitoring. Keeping these statements separate lets the team act before root cause is proven without pretending the evidence proves causation.

Baseline maintenance is an engineering responsibility. Retire a baseline when the system, workload, data, dependency, hardware, or measurement contract has changed enough that it no longer represents a meaningful comparator. Do not silently replace it. Preserve why it was retired, what replaces it, and which historical comparisons are no longer valid. A baseline family can contain deliberately separate records for a representative normal condition, a bounded degraded dependency condition, and a known high-volume journey; it should not mix them into an unexplained average.

The runtime handoff turns a pre-release judgement into a learning loop. It specifies the release identifier, guardrail metric, expected range, time window, segment, alert owner, rollback or mitigation condition, and a review date. Production evidence is not a replay of a controlled experiment: users, traffic, and dependencies differ. It can nevertheless test whether the decision remains safe enough for its intended scope, and it can reveal when the comparison contract must be revisited.

Use one concise comparison table or record per decision rather than spreading evidence across unlinked dashboard screenshots. The record should link the raw or approved source, but its conclusion must remain understandable when the dashboard changes. This protects historical learning and lets a reviewer audit why a threshold, rollout condition, or follow-up was chosen.

Do not force every comparison into a single percentage threshold. A small change in a high-volume, user-critical tail may matter more than a larger change in an infrequent internal task; a changed failure mode may matter even when the central latency is stable. State the objective, population, and consequence that make the difference material. If no decision rule existed before the comparison, document the new rule and seek the appropriate agreement rather than presenting it as an established gate.

Regression evidence should also include a clear negative case: a relevant metric or segment that did not change when a proposed cause would predict it should. This does not prove the cause false, but it disciplines attribution and can direct the next investigation toward a different boundary.

If a release changes several conditions at once, acknowledge that causal isolation is limited. The handoff can still guard the user-relevant outcome, but a later improvement should be planned as a separate, comparable change when attribution matters.

The decision record should identify that limitation plainly, so a future reviewer does not mistake correlated release changes for a verified performance mechanism.

It should also state whether the planned follow-up is a controlled comparison, a production observation, or a different investigation, because these produce different levels of causal confidence.

## Engineering Perspective

Versioning protects decision integrity. Store the comparison record with the change, assumptions, and raw evidence where practical. If a later reader cannot determine whether the population or method changed, the result should be treated as a new observation rather than a clean regression comparison.

## Industry Perspective

DORA research emphasizes that delivery performance measures are contextual and should support improvement rather than simplistic ranking.[^dora] The same principle applies at a smaller scale: a delta supports engineering learning only with its system and decision context.

## Common Misconceptions and Pitfalls

### “Any delta is a regression.”

A delta is an observed difference. Attribution requires a credible comparison; significance requires a claim and consequence.

### “A baseline is a single historical number.”

A useful baseline is a versioned evidence record containing method, workload, environment, dependency, and limitations.

### “Runtime monitoring replaces pre-production evidence.”

Runtime learning complements a bounded decision. It does not justify releasing without appropriate prior evidence or replace Part VIII observability design.

## QA → QE Transition

The transition is from pass/fail threshold comparison to versioned, decision-ready reasoning that states what changed, what remained comparable, what cannot yet be attributed, and what evidence should trigger reassessment.

## Summary

Performance regression is an evidence claim, not a subtraction. Versioned baselines and candidates, comparable conditions, bounded calculations, limitations, and decision ownership protect teams from false certainty.

## Key Takeaways

- Version application, configuration, workload, data/state, environment, dependencies, procedure, and method.
- An observed difference is not automatically an attributed regression.
- Practical significance depends on the claim and consequence.
- A runtime handoff preserves learning questions without duplicating observability engineering.

## Review Questions

1. What should a baseline contain beyond one p95 value?
2. Why can a dependency slowdown invalidate a cache-change comparison?
3. What is the difference between an observed delta and a proven regression?
4. What belongs in a runtime-evidence handoff?

## Interview Questions

1. How would you evaluate a candidate with a faster median and slower tail?
2. Which changes make an old performance baseline stale?
3. How would you communicate uncertainty to a release owner?

## Practical Exercise

Create a **Performance Regression Decision Record** for the synthetic search comparison. Add a Candidate B with aligned dependency and cache assumptions, define a local decision rule, and state the runtime question that should be handed to Part VIII practice.

## Further Reading

- [DORA research program](https://dora.dev/)
- [Google SRE Book: Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/)

## References

[^dora]: Google Cloud. [DORA research program](https://dora.dev/). Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can create a versioned baseline/candidate comparison.
- [ ] I can distinguish observed difference from attributed regression.
- [ ] I can state delta, uncertainty, limitation, decision, owner, and revision trigger.
- [ ] I can define a runtime-evidence handoff without designing observability implementation.

## Chapter Navigation

Previous: [Chapter 5 — Capacity, Scalability, Queues, and Bottleneck Evidence](chapter-05-capacity-scalability-queues-and-bottleneck-evidence.md) · Next: [Chapter 7 — Security Quality: Assets, Trust Boundaries, and Threat Models](chapter-07-security-quality-assets-trust-boundaries-and-threat-models.md)
