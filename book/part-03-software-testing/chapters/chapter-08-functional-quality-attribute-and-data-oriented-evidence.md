# Chapter 8 — Functional, Quality-Attribute, and Data-Oriented Evidence

## Metadata

| Field | Value |
|---|---|
| Part | Part III — Software Testing Engineering |
| MQE-BOK domain | Domain 3 — Software Testing Engineering |
| Chapter | 8 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–7; Part I — Foundations; Part II — Programming for Quality Engineers |
| Estimated study time | 145 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Functional correctness matters, but it is only one kind of evidence about whether a product can achieve an intended outcome.

## Opening Story

The following illustrative scenario continues with Atlas Commerce, the fictional subscription service used in this part. The team has evidence that an eligible customer can pause a subscription, receive a confirmation, and later resume with a valid payment method. The rule checks are clear, the service interaction has been examined, and the customer workflow passes in the representative environment.

The product manager asks whether the change is ready for a wider rollout. A support lead raises a different concern: customers use the account page on mobile devices, the pause history feeds a monthly finance report, and an entitlement delay can leave a customer unsure whether paid access is available. The existing functional checks do not answer whether the page remains understandable, whether the report totals are trustworthy after a corrected pause, or how the journey behaves when a dependency fails and recovers.

Amara, the Quality Engineer, does not respond by proposing a generic “non-functional test phase.” She asks which quality dimensions could undermine the outcome, what criteria make the concern testable, what evidence boundary is appropriate, and when specialist collaboration is needed. Some questions can be clarified and investigated by the delivery team; others need performance, security, accessibility, data, or operational expertise. The result is a small multi-dimensional evidence plan with explicit exclusions, not an assertion that one team has proved every quality attribute.

## Why This Chapter Matters

Functional testing asks whether a selected behaviour produces an expected result. It is essential, but it cannot by itself establish that a product is usable, secure, dependable, compatible, efficient, maintainable, portable, or trustworthy in its use of data. A system can calculate a subscription pause correctly while being too slow at a consequential moment, difficult to understand, unsafe to operate, inconsistent in a report, or unable to recover from a dependency failure.

Chapter 3 explained why vague quality goals make evidence difficult. Chapter 6 showed that a quality question needs an appropriate boundary, and Chapter 7 showed that automated feedback must be reliable enough to support a decision. This chapter expands the question: *what dimensions of product quality need evidence beyond functional examples, and what can each evidence activity legitimately establish?*

The chapter introduces breadth, not specialist implementation. It does not teach load generation, security testing, accessibility conformance, SQL, ETL validation, data-pipeline engineering, observability implementation, or a performance/security toolchain. Those practices belong to later parts. A Quality Engineer does not need to be the sole specialist in every dimension; they need to recognize relevant risks, make quality questions testable, help select proportionate evidence, and communicate what remains uncertain.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain what functional evidence can establish and where its limits begin;
- distinguish ISO/IEC 25010 product-quality characteristics from engineering capabilities such as testability and observability;
- turn vague quality goals into contextual evidence questions and criteria;
- identify selected functional, quality-attribute, and data-oriented risks for a product change;
- explain data quality as both a testing input concern and a product-evidence concern;
- select proportionate evidence sources and boundaries without prescribing specialist tools;
- identify interactions and trade-offs among quality attributes;
- decide when to investigate directly, clarify requirements, collaborate with a specialist, or escalate uncertainty; and
- build an evidence portfolio that states exclusions, limitations, and residual risk.

## Functional Evidence Is Necessary but Bounded

**Functional evidence** supports claims about what a product does: it accepts or rejects a request, calculates an outcome, changes a state, applies a rule, returns information, or completes a specified workflow. Chapter 4's test-design techniques help select meaningful functional conditions; Chapters 5–7 add adaptive investigation, boundary placement, and reliable automated feedback.

Functional evidence is sometimes mistaken for evidence of all quality. Consider a passing pause-subscription flow:

| Functional claim supported | Important question still open |
|---|---|
| An eligible customer can request a one-cycle pause. | Can intended customers understand the consequences before confirming? |
| A non-reversible invoice prevents a pause. | Is the denial prompt, accessible, timely, and diagnostically useful? |
| A resumed subscription records the intended state. | Is state consistent across the customer view, support export, and financial report? |
| A dependency error returns a defined message. | Does the product recover safely, protect customer data, and communicate an appropriate next action? |
| A report total equals the selected records in a fixture. | Are source data complete, fresh, semantically appropriate, and represented consistently? |

This does not reduce the value of functional checks. It prevents an overclaim. A functional result supports the behaviour and conditions actually exercised. It may contribute to other quality questions, but it is not automatically evidence that their criteria have been met.

## Product Quality Characteristics and Engineering Capabilities

ISO/IEC 25010:2023 defines a product-quality model with nine characteristics and related subcharacteristics.[^iso-25010] It is a formal reference model for specifying, measuring, and evaluating product quality. This chapter uses selected characteristics as prompts for evidence questions; it does not reproduce the standard or claim that every product needs identical treatment.

It is important to distinguish product characteristics from **engineering capabilities**. Testability and observability, for example, describe how readily a team can create, control, observe, diagnose, and learn from system behaviour. They can enable better evidence about product quality, but they are not presented here as ISO/IEC 25010 product characteristics. Chapter 3 addressed testability in this engineering sense; Part VIII later addresses observability and reliability engineering more deeply.

| Current ISO/IEC 25010:2023 product-quality characteristic | Educational evidence question inspired by the characteristic |
|---|---|
| Functional suitability | Does the product provide the required functions correctly and appropriately under stated conditions? |
| Performance efficiency | Does it meet relevant performance expectations under stated conditions? |
| Compatibility | Can it coexist or interoperate appropriately in the intended context? |
| Interaction capability | Can intended users interact with it effectively in the relevant context? |
| Reliability | Does it perform consistently and recover appropriately under relevant conditions? |
| Security | Does it protect information and operations appropriately against relevant threats? |
| Maintainability | Can it be analysed, modified, tested, and evolved with acceptable effort and risk? |
| Flexibility | Can it adapt appropriately to relevant changes in environment, configuration, or usage context? |
| Safety | Does it avoid or control unacceptable risk of harm in relevant situations? |

These are educational evidence questions, not ISO definitions. Use the current formal terminology when referring to the model, and choose only the characteristics relevant to the product, change, users, obligations, and decision.[^iso-25010]

| Category | Examples | Purpose in this chapter |
|---|---|---|
| Engineering capabilities | Testability, observability, controllability, diagnosability, deployment practice, and collaboration. | Help a team obtain and interpret evidence; they are not a substitute product-quality model. |
| MSQE educational framing | Risk → quality question → boundary → evidence mechanism → limitation → residual risk. | Connects product concerns to practical Quality Engineering decisions. |

## From Quality Labels to Evidence Questions

Words such as “fast,” “secure,” “scalable,” “reliable,” and “user-friendly” are intentions, not testable criteria. They become useful when a team defines context: whose outcome, which conditions, what threshold or comparison, what observation, what consequence, and what limitation.

| Broad label | Evidence question | Context needed before evidence is meaningful |
|---|---|---|
| Functional suitability | Does a customer receive the correct pause outcome for a stated subscription and invoice state? | Rule, preconditions, expected state and message, oracle. |
| Performance efficiency | Does the pause confirmation become usable within the agreed time for a representative workload and dependency condition? | Workload, latency definition, environment, measurement method, threshold. |
| Reliability | What customer-visible outcome occurs when entitlement is delayed, unavailable, or later recovers? | Failure model, recovery expectation, observation window, safeguards. |
| Plain-language usability concern | Can intended users understand the billing consequence and recover from an error? | User group, task, context, success criteria, evaluation method. |
| Security | Which protection or misuse assumptions could expose an account or subscription state? | Assets, trust boundary, authorization rules, relevant threats, specialist input. |
| Compatibility | Does the changed record remain usable by named consumer versions and supported environments? | Versions, interfaces, data representation, support policy. |
| Data quality | Is the monthly pause total complete, unique, correctly transformed, and fresh enough for its financial use? | Source of truth, business definitions, cutoff, tolerance, lineage. |

A criterion does not need a single numerical target to be meaningful, but it needs an agreed observation and decision context. “Customers should not wait too long” may start a useful product discussion; it is not yet enough to decide what evidence would support release. Chapter 3's clarification work is often the first necessary action.

## Selected Quality Attributes: Questions, Not a Catalogue

The following sections introduce evidence reasoning for selected quality concerns. They do not create a mandatory checklist or specialist testing curriculum.

### Performance efficiency

Performance evidence examines whether the product uses time and resources appropriately for a stated workload and outcome. For Atlas, the relevant question might be whether an entitled customer can obtain a usable pause confirmation within an agreed period during a seasonal campaign—not whether a single local test completes quickly.

Functional checks can reveal an obvious performance regression, but they do not establish realistic latency, throughput, capacity, saturation, or workload behaviour. Evidence needs a representative workload, an environment, a measurement definition, and interpretation by people who understand the system. Part X owns detailed performance engineering; this chapter asks the Quality Engineer to make the evidence need visible.

### Reliability

Reliability concerns whether a product continues or recovers appropriately when conditions vary or fail. A useful Atlas question is: *when entitlement confirmation is delayed after a resume request, what customer state is shown, what retry or recovery outcome is expected, and when should support intervene?*

Reliability evidence may include selected failure and recovery conditions, state transitions, diagnostic observations, and safeguards. It does not mean that a test suite proves production availability or establishes an operational reliability target. A controlled error response can show local handling; a broader boundary may be needed for integration and recovery assumptions. Part VIII develops operational evidence and reliability engineering further.

### Interaction Capability and Accessibility-Related Evidence

**Interaction capability** is the current ISO/IEC 25010:2023 product-quality characteristic for evidence about how intended users interact with a product in context. Older material often uses **usability** as the former top-level label. In this chapter, usability remains useful plain-language shorthand for concerns such as understanding, completing, and recovering from a task; it is not presented as the current formal ISO top-level characteristic.

An interface can be functionally correct yet use unclear language, obscure a consequential billing state, or make recovery difficult. Accessibility-related concerns can similarly affect whether people can perceive, operate, and understand an outcome. These concerns deserve early product and design collaboration, not a late visual review.

This chapter does not claim conformance to an accessibility standard or teach a usability-research method. A Quality Engineer can identify a consequential task, seek agreed success criteria, include representative users or specialist colleagues, and avoid treating a passing automated interface check as proof of usability or accessibility.

### Security

Security is a product-quality concern with high consequence and specialist depth. Functional evidence may establish that an authorized customer can pause an account; it does not establish that unauthorized access, information disclosure, misuse, or a flawed trust boundary cannot occur. A security-relevant evidence question should identify the asset or outcome at risk, the protection assumption, the relevant boundary, and the specialist collaboration required.

Do not invent a threat model in a test plan or run a generic scan as a claim of complete security. Part X owns deep security engineering. In this part, raise the concern early, avoid unsafe testing, preserve scope, and ensure release stakeholders understand what has and has not been assessed.

### Safety

Safety concerns whether a product avoids or controls unacceptable risk of harm in relevant situations. For many business applications, safety may not be a primary release question; for products that can influence people, equipment, health, finances, or other consequential operations, it may be material. A Quality Engineer should make the potential harm and evidence gap visible, identify the appropriate specialist or governance collaboration, and avoid treating ordinary functional checks as sufficient safety evidence.

This chapter does not teach safety engineering, hazard analysis, functional-safety certification, or regulation. Its purpose is to ensure that safety is not omitted from a current product-quality conversation when it is relevant.

### Compatibility, Maintainability, and Flexibility

Compatibility evidence can concern supported client versions, interface consumers, data representations, or environmental assumptions. Maintainability concerns whether the product can be understood, changed, and verified without disproportionate cost. Flexibility concerns whether the product can adapt appropriately when relevant environments, configurations, or usage contexts change. These are product-quality concerns in the ISO/IEC 25010:2023 model; their evidence must be connected to an actual product decision.

Older material may use **portability** as a reader-facing concern about operating across environments. This chapter does not list it as a current ISO/IEC 25010:2023 top-level characteristic or infer a detailed subcharacteristic mapping from it. Where a concern is about adaptation to a relevant change, frame the evidence question in terms of the current formal characteristic, flexibility.

For example, a change to the pause export may be functionally correct for one reporting consumer but incompatible with a supported older version. A tightly coupled implementation may pass today while making future change and evidence difficult. Neither concern is resolved by simply adding “compatibility” or “maintainability” to a test-plan heading. State the affected consumer, environment, change, or maintenance activity and choose evidence that can reveal it.

## Data-Oriented Evidence

Data has two roles in testing. **Testing with data** uses data as an input, fixture, configuration, or expected result to examine product behaviour. **Testing the quality and behaviour of data** asks whether data itself is fit for a particular use: complete, correct, consistent, unique, valid, timely, and appropriately transformed or represented.

The distinction matters. A perfectly designed pause rule can pass with a small fixture while a financial report omits records, duplicates a resume event, applies an obsolete business definition, or presents stale totals. Conversely, a data-quality check can establish a structural rule while leaving the semantic meaning of a field uncertain.

| Data evidence concern | Useful evidence question | Limitation to state |
|---|---|---|
| Completeness | Are all pause events in the defined source and period represented in the report? | Requires an agreed source of truth and cutoff. |
| Correctness | Do reported pause durations match the authoritative subscription state? | The authority itself may be wrong or delayed. |
| Consistency | Do customer, support, and finance representations agree where they should? | Some views may intentionally have different timing or purpose. |
| Uniqueness | Is one business event counted once according to the agreed identity rule? | Duplicate-looking records may represent valid retries or corrections. |
| Validity | Do dates, states, and amounts conform to agreed rules and representation? | Structural validity does not prove business meaning. |
| Timeliness | Is the report current enough for the decision it supports? | Fresh data can still be incomplete or incorrect. |
| Lineage or provenance | Can the team explain where a value came from and which transformation changed it? | Traceability does not prove the transformation is correct. |

These terms are working evidence prompts. The right definitions are domain-specific. “Complete” for a near-real-time support view can mean something different from “complete” for a month-end report. Before testing, agree the intended consumer, source, transformation, latency, tolerance, and decision consequence.

### Transformations, reports, and analytical outputs

Reports and analytical outputs often turn operational events into decisions. Quality evidence may need to examine filters, groupings, totals, transformations, missing data, duplicated data, stale data, and presentation consistency. The question is not merely whether a query returns rows; it is whether the output is suitable for the decision a customer, support colleague, finance team, or product leader will make.

For the Atlas monthly report, a focused evidence plan could compare a deliberately selected set of pause, resume, cancellation, correction, and late-arriving events with the agreed report definition. It could look for double counting, missing records, incorrect cutoffs, and inconsistent labels. It should not claim that a few examples establish every source condition, production volume, data pipeline failure, or future schema change. SQL, pipeline design, reconciliation implementation, and data-quality platforms belong to Part VI.

## Quality Attributes Interact

Quality concerns are not independent columns in a spreadsheet. A security control can increase authentication friction; a resilience mechanism can add latency; caching can improve response time while making information less fresh; stricter data validation can protect correctness while reducing throughput or accepting fewer historic records. A change that improves one outcome may introduce a different risk.

The following illustrative questions make the interaction visible:

| Change or safeguard | Intended benefit | Interaction to investigate |
|---|---|---|
| Cache subscription status | Faster account display. | Can a customer see stale entitlement after resume or cancellation? |
| Add step-up verification before pause. | Better protection for a consequential account change. | Can intended users complete the action accessibly and recover from failure? |
| Reject incomplete export records. | Prevent misleading finance totals. | What happens to timeliness and support visibility while records await correction? |
| Retry an entitlement request. | Improve recovery from transient failure. | Can retries duplicate an event, delay a customer message, or increase load? |

This is systems thinking applied to evidence. It does not require the Quality Engineer to solve every trade-off alone. It requires them to expose the decision, invite the right expertise, and avoid declaring a benefit without examining a foreseeable consequence.

## Risk-Based Depth and Specialist Collaboration

Not every change needs the same depth of evidence for every quality attribute. Chapter 2's risk reasoning still applies. A cosmetic wording change may need focused usability review; a payment-state change may need stronger reliability, security, data, and integration consideration. Select depth using customer consequence, uncertainty, novelty, exposure, legal or policy obligations, history, safeguards, reversibility, and decision timing.

| Situation | Appropriate Quality Engineering action |
|---|---|
| The quality concern is clear and within the team's capability. | Design or improve focused evidence and state its limit. |
| The intended outcome is vague. | Facilitate clarification of users, conditions, criteria, and decision. |
| The concern crosses a specialist domain. | Frame the evidence question and collaborate with performance, security, accessibility, data, or operations specialists. |
| The risk is consequential and evidence is weak or unavailable. | Escalate uncertainty to accountable stakeholders; propose safeguards, staged rollout, or deferred work. |
| Existing evidence no longer matches a change. | Reassess boundary, data, oracle, and quality dimension rather than relying on stale green checks. |

Collaboration is not a hand-off of responsibility. The Quality Engineer contributes product context, risk reasoning, evidence design, and honest limits. The specialist contributes domain depth and appropriate methods. Together they can decide what evidence is sufficient for the current decision and what must remain visible as residual risk.

## A Multi-Dimensional Evidence Portfolio

The following is an **MSQE educational evidence-portfolio model**, not a standard. It brings together Delivery 3's progression:

```text
risk
  → evidence question
  → relevant quality dimension
  → system boundary
  → dependency strategy
  → evidence mechanism
  → reliability and diagnostics
  → limitation and residual risk
```

For a pause-subscription release, the portfolio might include functional rule evidence, a controlled failure-handling check, integration evidence for the export contract, a representative customer-flow observation, a data-quality question about report totals, a usability question about the confirmation, and a security question for specialist review. It does not need every form of evidence for every change. It needs an explicit connection between the outcomes at risk and the evidence chosen.

A portfolio also prevents category overclaiming. A load experiment cannot establish business correctness. A security scan cannot establish complete security. A data validation can confirm a selected rule but not semantic meaning without a domain expectation. A functional suite cannot establish performance, usability, or resilience confidence merely because it completes. The team should treat these as complementary evidence sources with stated boundaries.

## Engineering Perspective

Quality attributes often become expensive to address when they are discovered only after a feature appears functionally complete. Clear quality requirements, controllable states, observable outcomes, representative data, safe diagnostics, and stable interfaces make evidence possible earlier. They are engineering capabilities that help teams evaluate product quality; they should not be confused with product-quality characteristics themselves.

The Quality Engineer's contribution is to make a quality concern concrete enough for an engineering decision. That may mean challenging a vague goal, identifying a boundary, selecting a representative condition, surfacing a data definition, or bringing a specialist into a discussion before the team relies on weak evidence. It does not mean becoming the organization’s lone performance, security, accessibility, or data expert.

## Industry Perspective

ISO/IEC 25010:2023 provides a formal product-quality model with nine characteristics that can inform quality requirements, objectives, and evaluation.[^iso-25010] ISO/IEC/IEEE 29119-2 provides generic testing-process context across lifecycle models.[^iso-29119-2] The SWEBOK Guide connects software testing to broader requirements, architecture, data, maintenance, and operational concerns.[^swebok]

These sources provide vocabulary and reference models. They do not determine a universal quality-attribute checklist, a threshold, a toolchain, or a release decision. The evidence-portfolio progression in this chapter is MSQE educational framing for making selected product-quality questions, boundaries, and limitations explicit.

## Common Misconceptions

### “Functional tests prove that a feature is high quality.”

They provide useful evidence about selected behaviour. They do not automatically establish performance, reliability, usability, security, compatibility, data quality, or the suitability of the product for every user and condition.

### “Non-functional testing is a separate final phase.”

Quality concerns should influence requirements, design, evidence placement, and release decisions throughout delivery. The depth and method vary; the concern should not appear only after functional work is declared complete.

### “ISO/IEC 25010 is a test checklist.”

It is a product-quality reference model. A team still needs to identify relevant characteristics, contextual criteria, evidence, and limits for its product and decision.

### “Testability and observability are ISO/IEC 25010 quality characteristics.”

They are engineering capabilities used here to describe how evidence can be obtained and interpreted. They should be distinguished from the product-quality characteristics of the formal model.

### “A data check proves that a report is correct.”

A data check supports a selected rule or comparison. Report correctness also depends on agreed business definitions, sources, transformations, timing, and the intended use of the output.

### “Quality Engineering must test every quality attribute personally.”

Quality Engineers coordinate evidence and recognize risks. Deep performance, security, accessibility, data, and operational work often requires specialist collaboration.

## Summary

Functional evidence is fundamental but bounded. Quality Engineering broadens the question from “does this feature work?” to “which product-quality dimensions could undermine the intended outcome, what evidence can address them, and what remains uncertain?” ISO/IEC 25010:2023 offers a useful formal product-quality reference model; testability and observability remain engineering capabilities that help teams obtain and interpret evidence.

Data-oriented evidence examines not only how software uses data but whether data and outputs are fit for a defined decision. Quality attributes interact, so evidence must consider trade-offs rather than isolated labels. A proportionate portfolio combines functional, quality-attribute, data, integration, and specialist evidence according to risk, boundaries, and stated limitations.

## Key Takeaways

- Functional evidence supports selected behavioural claims; it does not establish every relevant quality concern.
- ISO/IEC 25010:2023 product-quality characteristics are distinct from engineering capabilities such as testability and observability.
- Broad quality labels need context, criteria, boundaries, observations, and decision consequences before they are testable.
- Data can be an input to testing and a product-quality concern requiring its own evidence.
- Completeness, correctness, consistency, uniqueness, validity, timeliness, and provenance are contextual data-evidence questions.
- Quality attributes interact; an improvement in one dimension can create risk in another.
- Risk determines the appropriate depth of evidence and the need for specialist collaboration.
- An evidence portfolio is stronger when it states what each activity supports, excludes, and leaves uncertain.

## Review Questions

1. What can a functional result establish, and what might it leave unknown?
2. Why must testability be distinguished from ISO/IEC 25010 product-quality characteristics in this handbook?
3. Turn “the feature must be fast” into a contextual evidence question.
4. Distinguish testing with data from testing the quality of data.
5. Why can a data validation check be structurally correct but semantically insufficient?
6. Give an example of an interaction between two quality concerns.
7. When should a Quality Engineer seek specialist collaboration rather than attempt a deep test alone?
8. Why cannot a security scan, load experiment, or functional suite establish complete confidence on its own?

## Interview Questions

1. How would you turn a vague quality goal into an evidence plan for a product change?
2. How do you decide which quality attributes deserve attention for a release?
3. Describe how you would communicate the difference between functional evidence and performance confidence.
4. What questions would you ask before trusting a report used for a financial or operational decision?
5. How do you collaborate with a specialist while retaining ownership of quality-risk communication?

## Practical Exercise

### Build a Multi-Dimensional Quality Evidence Plan

**Objective:** Create a proportionate plan that extends functional evidence to selected product-quality and data concerns for a fictional change.

**Scenario:** Atlas Commerce will expand pause subscriptions to more customers. The feature changes customer account behaviour, entitlement updates, billing records, support exports, and a monthly finance report. Product requires that customers can understand the effect of pausing, that paid access is restored appropriately after resumption, and that finance totals remain usable. An external entitlement dependency can be delayed. The team has evidence for the ordinary functional paths but has not agreed criteria for customer-visible delay, report freshness, or the supported consumer versions of the export.

**Constraints:** Treat the system and information as fictional. Do not implement a performance test, security scan, accessibility conformance review, API suite, SQL query, data pipeline, or monitoring system. Do not claim that the exercise proves production quality. State when a question needs specialist input or clarification.

**Tasks:**

1. Identify functional risks, at least three relevant product-quality concerns, and at least three data-oriented concerns.
2. For each selected concern, write an evidence question with a customer or stakeholder outcome, conditions, observation, and known limitation.
3. Identify which questions require clarification because terms such as “fast,” “usable,” “secure,” or “current” are not yet meaningful criteria.
4. Select an appropriate evidence boundary and mechanism for each question. State which dependencies should be real or controlled and why.
5. Identify at least two interactions or trade-offs among quality concerns.
6. Specify which evidence can be produced by the team and which requires product, design, performance, security, accessibility, data, or operations collaboration.
7. Record exclusions, safeguards, assumptions, and residual uncertainty for a staged-rollout decision.
8. Write a concise stakeholder summary that distinguishes supported claims from proposed future or specialist evidence.

**Expected artifact:** A three- to four-page **Multi-Dimensional Quality Evidence Plan** containing a risk-and-quality profile, evidence questions, boundary and dependency decisions, collaboration needs, exclusions, and residual-risk statement.

**Reflection:** Which quality concern is easiest to state but hardest to make measurable in this scenario? Which functional result could create false confidence if presented without its quality-attribute limitations?

**Portfolio relevance:** This artifact demonstrates breadth of quality reasoning, contextual evidence design, and responsible specialist collaboration. Use fictional or safely anonymised examples; do not publish customer information, security details, internal report definitions, proprietary data models, credentials, or confidential operational evidence.

## Further Reading

- ISO. [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html) — the current formal reference for product-quality characteristics.
- [IEEE Computer Society, *Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a*](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf) — consult the Software Requirements, Software Testing, Software Engineering Models and Methods, and Software Engineering Professional Practice areas for wider context.
- [Chapter 3 — Requirements Analysis, Specifications, and Testability](chapter-03-requirements-analysis-specifications-and-testability.md)
- [Chapter 6 — Test Levels, Boundaries, and Integration Evidence](chapter-06-test-levels-boundaries-and-integration-evidence.md)
- [Chapter 9 — Service, API, and Distributed-System Testing Strategy](chapter-09-service-api-and-distributed-system-testing-strategy.md)

## References

[^iso-25010]: ISO/IEC. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). 2023.
[^iso-29119-2]: ISO/IEC/IEEE. [ISO/IEC/IEEE 29119-2:2021 — Software and systems engineering — Software testing — Part 2: Test processes](https://www.iso.org/standard/79428.html). 2021.
[^swebok]: IEEE Computer Society. [*Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a*](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf). 2026.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] State what a functional result supports and what it cannot establish.
- [ ] Distinguish product-quality characteristics from engineering capabilities that enable evidence.
- [ ] Turn a broad quality goal into a contextual evidence question and decision.
- [ ] Identify data-oriented evidence needs separately from test data needs.
- [ ] Build a proportionate, multi-dimensional evidence portfolio with specialist collaboration and residual risk.
