# Chapter 7 — SLIs, SLOs, Error Budgets, and Reliability Decisions

## Metadata

| Field | Value |
| --- | --- |
| Part | Part VIII — Observability & Reliability Engineering |
| MQE-BOK domain | Domain 8 — Observability & Reliability |
| Chapter | 7 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 3, 5, and 6; basic percentage and population reasoning |
| Estimated study time | 210 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A precise target is not a useful objective until the population, source, exclusions, decision, and limitation are explicit.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce reports a 99.95% checkout-success result for the last 30 days. The number appears to exceed its 99.9% objective. A Quality Engineer notices that the numerator counts completed orders and the denominator counts only requests that reached the checkout service after session and payment-method initialisation. Client-side failures, failed initialisation attempts, and some dependency-timeout abandons are not included.

The arithmetic may be correct for its stated denominator. The objective is misleading if stakeholders believe it represents the customer’s ability to complete checkout. Before using the result to continue a high-risk promotion, the team must decide whether it measures the intended outcome, what unreliability is allowed, and which evidence gaps make the result unsuitable for that decision.

## Why This Chapter Matters

Service-level indicators and objectives can create a shared language for reliability decisions. They can also create false confidence when a target is inherited from another service, a population is hidden, a window is arbitrary, or a measure is optimised without user relevance. Error budgets can help teams make trade-offs explicit, but they are not a universal management framework or a permission to ignore individual harmful failures.

This chapter uses SRE terminology carefully. Google’s SRE material is influential practitioner literature, not an ISO-like standard or a required organisational model.[^google-slo] The value for Quality Engineers is the discipline: define the service behaviour, population, source, target, allowed unreliability, and decision consequences before treating a percentage as a reliability truth.

## Chapter Purpose

To define and evaluate SLIs, SLOs, and error budgets as bounded measures and decision tools for user-relevant service behaviour.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish an SLI, an SLO, and an error budget;
- define a measurement population, numerator, denominator, source, window, and exclusion set;
- calculate allowed unreliability for a bounded synthetic objective;
- identify a misleading calculation caused by a flawed population or denominator;
- state the limits of an SLO and its relation to user impact; and
- create an SLI/SLO Decision Record.

## Indicator, Objective, and Allowed Unreliability

An **SLI** is a defined measurement of service behaviour relevant to an objective. An **SLO** is a target for that indicator over a stated period and population. An **error budget** is the permitted amount of unreliability implied by the objective and used to inform reliability decisions.

For a simple event-based success objective:

```text
SLI = successful eligible events / all eligible events
SLO = SLI ≥ target over a defined window
Error budget = 1 − target, applied to the same eligible population and window
```

The formula is simple; its inputs are not. “Eligible” carries the engineering meaning. If it excludes the very failures that matter to users, the result may be mathematically correct and operationally misleading.

| Element | Question | Example |
| --- | --- | --- |
| User outcome | What matters to the customer? | Start and complete an intended checkout attempt. |
| SLI event | What can be measured consistently? | A checkout journey reaches confirmed order creation. |
| Population | Which events are eligible? | Selected authenticated checkout attempts, excluding only documented probes. |
| Numerator | What counts as acceptable? | Eligible attempts completing within the defined condition. |
| Denominator | What counts as opportunity? | All eligible attempts, including failures and timeouts. |
| Window | Over what period? | Rolling 30 days, with a stated freshness limit. |
| Objective | What result is sought? | At least 99.9% for the defined population. |
| Budget | What unreliability is allowed? | At most 0.1% of that population in the window. |

## Worked Numerical Reasoning: Fixing a Misleading Checkout SLO

Assume a fictional 30-day Atlas Commerce measurement with 2,000,000 observed checkout requests: 1,999,400 customer attempts and 600 synthetic probe requests. The customer attempts are the candidate population for the journey SLI; the probes are retained as a separate operational signal and do not represent customer journeys.

| Outcome | Count | Included by flawed calculation? | Included by corrected calculation? |
| --- | ---: | --- | --- |
| Confirmed checkout within condition | 1,996,800 | Yes | Yes |
| Server-side checkout failure | 700 | Yes | Yes |
| Client/session initialisation failure | 1,000 | No | Yes |
| Payment-timeout abandonment | 900 | No | Yes |
| Synthetic probe traffic | 600 | No, excluded from the customer measure | No, by documented exclusion |

The flawed measure uses only the 1,997,500 **customer** requests that reached the server-side checkout flow: 1,996,800 confirmed checkouts and 700 server-side failures. It excludes the 1,000 initialisation failures and 900 payment-timeout abandonments, as well as the 600 synthetic probes. It counts 1,996,800 successes:

```text
Flawed SLI = 1,996,800 / 1,997,500 = 99.9650%
```

It appears to meet a 99.9% SLO. It is not necessarily dishonest; it describes a narrower server-side population. The problem is claiming it represents the entire customer checkout journey.

The corrected example includes all 1,999,400 eligible customer attempts and excludes the 600 documented probes:

```text
Eligible attempts = 2,000,000 − 600 = 1,999,400
Corrected SLI = 1,996,800 / 1,999,400 = 99.8700%
```

For a 99.9% SLO, the corrected 30-day error budget is:

```text
Allowed unreliability = 1,999,400 × 0.001 = 1,999.4 events
Observed unreliability = 1,999,400 − 1,996,800 = 2,600 events
Budget exceeded = 2,600 − 1,999.4 = 600.6 events
```

The correct conclusion is not “the service is bad.” It is that the stated customer-journey objective is not met in this synthetic window, assuming the events and exclusions are trustworthy. The result should lead to a decision: investigate initialisation and payment-timeout paths, consider limiting changes that increase reliability risk, and improve measurement coverage. It should not prove why those failures occurred or imply that a 99.9% target is appropriate for every user, business, or risk context.

### Missing telemetry changes confidence

Suppose a mobile client release temporarily stopped emitting the event used to count initialisation failures. The corrected denominator could then become incomplete. A team has options: mark the SLI as degraded or unknown for the affected period; use a corroborating source with stated limits; narrow the claim to the observable population; or delay a decision that depends on the unavailable evidence. Replacing missing data with assumed success is not a neutral choice.

## Choosing Measures That Matter

An SLI should have a plausible relationship to a user or service outcome. Internal resource measures can be valuable diagnostic signals, but “CPU below 60%” is usually not a customer-facing reliability objective. It may be an input to capacity or saturation reasoning. A meaningful objective might instead concern request completion, timely result availability, data freshness, or another bounded outcome.

Some outcomes require more than one indicator. Checkout can have correctness, latency, and completion dimensions. A single percentage can simplify a decision but can also hide a trade-off. Do not combine unlike dimensions into an opaque score merely to create one target. State which objective answers which question.

| Candidate | Strength | Limitation |
| --- | --- | --- |
| HTTP 2xx ratio | Easy to collect and trend | May classify stale or incomplete results as success |
| Journey completion ratio | Closer to customer outcome | Requires careful boundary, correlation, and missing-event handling |
| p99 completion latency | Represents a tail condition | Does not describe correctness or unobserved attempts |
| Freshness measure | Represents data timeliness | May not show user impact or applicability to every item |
| Composite score | Can summarise several signals | Can hide assumptions and make action unclear |

## An SLO Is a Decision Aid, Not a Universal Truth

The purpose of an objective is to guide attention and trade-offs. If an error budget is being consumed quickly, a team may decide to pause a risky rollout, prioritise reliability work, widen investigation, or accept a documented risk. The appropriate action depends on customer impact, severity, confidence in the measurement, and business context. An SLO cannot decide by itself.

The objective also has limits. A 30-day result may smooth a severe one-hour incident. A high aggregate result may hide an affected region. A service may meet an SLO while an individual customer experiences serious harm. A team should retain incident, safety, security, legal, and customer-care obligations outside any numerical budget.

### Windows, burn, and decision timing

The measurement window changes the question an SLO answers. A 30-day window can show whether a service is consuming its allowed unreliability over a sustained period. It may be too slow to communicate that a sharp current condition needs attention. A shorter window can reveal recent change but may overreact to a small population or normal variation. Neither window is inherently correct; the decision consumer and outcome determine which evidence is needed.

**Burn** describes the rate at which an error budget is being consumed relative to the rate that would exhaust it evenly across the stated window. It can be a useful way to recognise that a budget is being consumed unusually quickly. It is not a universal threshold or a replacement for impact assessment. A rapid burn from a low-impact, correctly excluded synthetic population is different from a slower burn that harms a critical customer journey.

For the Atlas example, suppose 420 currently observed unreliable events occur in 20 minutes and the apparent remaining budget is 369 events. The immediate decision is not to calculate a single universal burn threshold. It is to recognise that the available evidence shows a rate capable of exhausting the remaining apparent budget, while client-abandonment coverage is missing. The measurement uncertainty makes a conservative exposure decision more defensible, not less.

### A decision record prevents target theatre

An SLI/SLO Decision Record should show how a numerical result affects action.

| Field | Example question |
| --- | --- |
| Outcome and population | Does the indicator represent the customer journey and segment at risk? |
| Source health | Are collection, freshness, and coverage adequate for this decision? |
| Objective and window | What bounded service expectation is being evaluated? |
| Allowed unreliability | What amount of failure is implied for the same population? |
| Current evidence | Is the budget stable, consuming rapidly, exceeded, or unknown? |
| Decision and owner | What exposure, investigation, or reliability work follows, and who owns it? |
| Limitation | Which outcomes or failure paths do not enter this calculation? |
| Revision trigger | What change in data or population requires the record to be revisited? |

The record keeps an SLO from becoming a decorative status. A target with no decision use is a reporting number. A target with hidden exclusions is a misleading number. A target that forces a team to state its evidence, owner, trade-off, and limit can become a useful quality-engineering control.

## Engineering Perspective

Quality Engineers can challenge an SLO constructively by asking for the outcome, population, exclusions, source, freshness, ownership, window, error treatment, and revision trigger. They can create tests that ensure known failure paths enter the intended denominator, verify that synthetic probes are excluded deliberately rather than accidentally, and test whether missing telemetry produces an explicit unknown condition rather than silent success.

This work links test design to operations. A failure-path test can show whether a payment timeout appears as a failed customer attempt. Runtime evidence can reveal a new abandonment path that requires a test and a revised measure. The goal is a feedback system that explains its boundaries, not a perfect target.

## Industry Perspective

Google’s SRE Workbook describes implementation and evolution of service-level objectives and highlights the need to choose indicators that represent meaningful service behaviour.[^google-slo] It is practitioner guidance. The formulas and examples in this chapter are MSQE educational applications to synthetic evidence; teams must establish objectives appropriate to their context.

## Common Misconceptions and Pitfalls

### “An SLO is the same as a dashboard metric”

An SLO adds a target, window, population, decision purpose, and allowed unreliability to a defined indicator.

### “Exclude awkward failures so the measure is stable”

Exclusions can be valid when documented and user-irrelevant, such as certain probes. Excluding a meaningful customer failure changes the claim and must not be hidden.

### “The error budget allows us to ignore individual incidents”

The budget is a cumulative decision aid. Severe, safety-relevant, security-relevant, or customer-harmful events can require action regardless of aggregate consumption.

### “A met SLO proves reliability”

It supports a bounded statement about a selected outcome and measurement. Other outcomes, populations, and evidence gaps can still matter.

## QA → QE Transition

QA Engineers already reason about expected outcomes and pass/fail conditions. Quality Engineering extends that reasoning to operational populations, windows, missing evidence, and decision consequences. The result is not a ritual of percentages. It is a transparent agreement about what service behaviour is being watched, how it can fail, and what the team will do when evidence changes.

## Summary

SLIs measure defined service behaviour. SLOs set targets for that behaviour over a stated population and window. Error budgets express the allowed unreliability implied by an objective. Their usefulness depends on honest denominators, user relevance, source quality, and decision boundaries. The next chapter examines how alerts and incident evidence turn changing signals into proportionate operational action.

## Key Takeaways

- An SLI, SLO, and error budget are distinct but must share a clear population and window.
- Numerator and denominator choices can make a compliant-looking measure misleading.
- Missing telemetry should lower confidence or produce an explicit unknown state.
- SLOs guide decisions; they do not replace judgement or represent every form of customer harm.
- A useful SLI/SLO Decision Record states evidence, exclusions, limitations, ownership, and revision conditions.

## Review Questions

1. What population difference causes the flawed checkout SLI to look healthier?
2. Calculate the allowed unreliability for the corrected 99.9% example.
3. Why is it unsafe to assume missing client telemetry represents success?
4. When could excluding traffic from an SLO be appropriate?
5. Why can a service meet an SLO and still require incident action?

## Interview Questions

1. How would you evaluate whether a proposed SLO represents a user outcome?
2. What questions would you ask about a denominator before accepting a reliability report?
3. How should a team respond when an SLI source becomes incomplete?

## Practical Exercise

Create an **SLI/SLO Decision Record** for a fictional notification journey. Define its user outcome, eligible population, numerator, denominator, window, target, allowed unreliability, exclusions, missing-data policy, decision owner, limitation, and revision trigger. Include one deliberately flawed calculation and correct it.

## Further Reading

- [Google SRE Workbook: Implementing SLOs](https://sre.google/workbook/implementing-slos/)
- [Google SRE Book: Service Level Objectives](https://sre.google/sre-book/service-level-objectives/)

## References

[^google-slo]: Beyer, Betsy, et al. [Implementing SLOs](https://sre.google/workbook/implementing-slos/). *The Site Reliability Workbook*. Google. Accessed 2026-08-12.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish an SLI, SLO, and error budget;
- [ ] define a valid population, numerator, denominator, and window;
- [ ] identify a misleading exclusion or missing-data condition;
- [ ] calculate allowed unreliability for a bounded example; and
- [ ] state an SLO’s decision use and limitation.
