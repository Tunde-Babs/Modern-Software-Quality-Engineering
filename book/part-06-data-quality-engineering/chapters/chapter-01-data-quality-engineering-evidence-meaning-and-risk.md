# Chapter 1 — Data Quality Engineering: Evidence, Meaning, and Risk

## Metadata

| Field | Value |
|---|---|
| Part | Part VI — Data Quality Engineering |
| MQE-BOK domain | Domain 6 — Data Quality Engineering |
| Chapter | 1 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Parts I–V, or equivalent experience in quality risk, testing evidence, programming, APIs, and automation |
| Estimated study time | 100 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE educational framing:** Trustworthy data is not a property of a field alone. It is a justified claim about data, its meaning, its journey, and the decision it informs.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. The finance team is about to use its daily revenue report to decide whether to pause a marketing campaign. The report shows revenue is 18% below the previous day. A dashboard check is green because every scheduled pipeline job completed successfully.

Noah, a QA Engineer who supports the checkout service, opens the reporting table and compares three recent orders with the application screen. Their values look correct. He concludes that the data pipeline is healthy.

Mina, the Quality Engineer, asks what claim the team needs to support. Finance does not need evidence that three rows can be found or that the scheduler returned success. It needs evidence that the report represents the intended population of completed, refundable orders for the stated business day, that currencies were converted consistently, and that the comparison with yesterday uses the same definition.

The investigation changes direction. Payment records show a delayed settlement feed. The pipeline processed the available input without errors, but the input excluded a material subset of orders. The dashboard was accurate about job completion and the sampled rows were accurate about their stored values. Neither observation established that the revenue report was complete for the decision at hand.

The team labels the report provisional, reconciles the delayed population when it arrives, and records the remaining uncertainty. The useful result is not a larger collection of row checks. It is a bounded, explainable conclusion that helps finance make a safer decision.

## Why This Chapter Matters

Data influences product behaviour, customer communication, operational control, financial reporting, experimentation, and engineering decisions. A defect in a stored value can be harmful, but a technically valid value can also support the wrong conclusion when its meaning, population, timing, source, or transformation is misunderstood.

Experienced QA Engineers often begin data work by asking whether a query returns an expected value. That skill remains useful. It is not enough by itself. Data Quality Engineering asks a broader sequence of questions: what claim matters, who will use it, what representation and population does it cover, what evidence can challenge it, and what uncertainty remains after the evidence is considered?

Part III established testing as evidence for a decision. Part IV examined API contracts and interface semantics. Part V examined how automation systems produce timely, diagnosable feedback. Part VI applies those foundations to data-bearing systems. This chapter establishes the meaning-and-risk foundation. Chapter 2 examines representation and contextual quality dimensions. Chapter 3 then uses queries, keys, and relationships as bounded evidence mechanisms. It does not teach database administration, SQL certification, data-platform implementation, or enterprise data-governance programmes.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain Data Quality Engineering as the disciplined production, interpretation, and communication of evidence about data fitness for a decision;
- distinguish a stored value, a data-quality claim, and the business or engineering decision that depends on that claim;
- identify a decision consumer, an authoritative source, a relevant population, and a suitable **oracle**—the rule, source, or independent mechanism used to judge an observation;
- explain why correct-looking rows, successful jobs, and passing checks do not by themselves establish a broader data claim;
- assess evidence for relevance, provenance, freshness, independence, and stated limitations;
- distinguish data defects from application defects while recognising that one can cause or reveal the other; and
- communicate residual uncertainty and **residual risk**—the remaining possibility and consequence of harmful error after proportionate controls or evidence have been applied.

## Data Quality Engineering Is Decision-Oriented Evidence Work

Data Quality Engineering is the practice of designing, evaluating, and improving trustworthy evidence about whether data is fit for the decisions and behaviours that depend on it. It includes checking data, but it is not equivalent to checking data.

The distinction matters because a value has no useful quality meaning in isolation. Consider the value `1200`. It might be a price in cents, a quantity in kilograms, a customer identifier, a status code, or an elapsed duration. A check can establish that `1200` is stored. It cannot establish what the value means, whether the appropriate population is represented, or whether a downstream decision should use it.

### From an observation to a data-quality claim

An **observation** is a fact collected from a defined source under stated conditions: “the `daily_revenue` table contains 4,281 rows for 2026-08-10.” A **data-quality claim** is an interpretation that connects observations to a decision: “the daily revenue report represents all completed and refundable Atlas Commerce orders for the finance close.”

The claim is wider than the observation. It carries assumptions about which orders count, which systems are authoritative, how time boundaries are applied, and whether transformations preserve intended meaning. A responsible engineer makes those assumptions inspectable instead of letting them remain implicit.

| Element | Example: daily revenue report | Why it matters |
|---|---|---|
| Decision | Pause, continue, or investigate a marketing campaign | A quality question should serve an accountable decision. |
| Decision consumer | Finance lead and campaign owner | Different consumers may need different definitions or timeliness. |
| Claim | The report represents recognised revenue for the stated business day | The claim sets a boundary wider than individual records. |
| Population | Completed, refundable orders in the specified market and time window | A row count is meaningless without a population definition. |
| Authoritative source | Settlement-confirmed payment records for recognised revenue | A convenient source is not necessarily authoritative for the claim. |
| Evidence | Reconciliation, transformation review, and exception analysis | Evidence should test the assumptions behind the claim. |
| Limitation | Settlement feed is delayed for one payment method | A useful conclusion states what it cannot establish. |
| Residual risk | A campaign decision may be based on an understated revenue figure | Risk describes the remaining consequence, not simply a failed check. |

This table is an **original MSQE educational framing**, not a formal standard or a universal template. Its purpose is to keep the decision, claim, evidence, and uncertainty connected.

### Decision consumers and fitness for purpose

A **decision consumer** is the person, team, service, or control that uses a data claim to choose or perform an action. A fraud-control service, a support agent, a finance close, and a product dashboard may all use information about an order. They do not necessarily require the same latency, granularity, completeness window, or interpretation.

For example, an operational fulfilment screen may be fit for purpose when it displays a newly accepted order within seconds, even if currency conversion occurs later. A daily finance report may be unfit for purpose if the same order is included before settlement or excluded after settlement. Neither system is simply “good” or “bad” data. Each must be evaluated against a stated decision and context.

This is why a universal data-quality score is usually less informative than a well-scoped claim. A score can hide which population, consumer, threshold, and trade-off it represents. A score may still be useful as a local monitoring signal, but it should not replace an explanation of fitness for purpose.

### Data is an engineering concern

Data quality belongs in Quality Engineering because data crosses boundaries. It is created by product behaviour, shaped by interfaces, transformed by code, stored in systems with constraints, consumed by services and people, and interpreted in decisions. Quality can be lost or distorted at any of those boundaries.

The ISO/IEC 25012 data-quality model provides recognised terminology for discussing structured-data quality.[^iso-25012] It is useful as a reference model, not as a substitute for a decision-specific analysis. This handbook uses terms such as correctness, completeness, consistency, and timeliness as contextual lenses. It does not claim that a system becomes trustworthy by checking every named characteristic or assigning a composite score.

## Meaning Before Stored Values

### Business meaning and representation are different things

Business meaning is what a fact represents in the relevant domain. A representation is how a system stores, transmits, or displays that fact. An Atlas Commerce order might appear as a JSON event, a relational row, a ledger entry, a dashboard aggregate, and a CSV export. Those representations may contain different fields, identifiers, rounding rules, update times, and purposes.

The value `order_status = "COMPLETE"` might mean that a shopper submitted an order, that payment was authorised, that fulfilment started, or that all business processes finished. The label alone does not decide its meaning. The engineer needs the relevant business definition, the producing system’s behaviour, and the consuming decision.

When a quality review jumps directly to stored values, it risks measuring structural conformance while missing semantic error. **Semantic fitness** is the suitability of data meaning for its intended use. A record can satisfy a schema and still be semantically unfit—for example, a `revenue` field that includes tax when finance expects net revenue.

### Population is usually more important than a memorable row

A **population** is the complete set of records, events, or entities to which a claim applies. It must be defined before a sample, count, or query result can be interpreted. “All orders” might mean all orders created today, all paid orders, all orders visible to a customer, or all orders eligible for revenue recognition. Each definition selects a different population.

Single-row checks help investigate examples and reproduce defects. They are weak evidence for a population-level claim unless the claim itself is only about that row. A sample can reveal a problem. It cannot normally establish absence of a problem across the whole population. Chapter 3 develops population reasoning, distinct counts, unmatched sets, and relationship analysis in more detail.

### Correctness and confidence are not the same

An observation can be correct while a conclusion based on it is overconfident. In the opening story, selected rows were accurate and the scheduler correctly reported completion. The conclusion that the finance report was ready did not follow because the evidence did not cover a delayed input population.

Confidence should therefore be treated as a reasoned assessment, not as a feeling produced by green indicators. Useful confidence is calibrated: it grows when evidence is relevant, fresh, traceable, appropriately independent, and sufficient for the decision. It decreases when important assumptions, populations, or boundaries remain unexamined.

### Claims need an accountable interpretation

Different people can contribute evidence without owning the same conclusion. A data engineer may explain an ingestion delay, a finance analyst may define recognised revenue, a software engineer may explain a transformation, and a Quality Engineer may expose an evidence gap. The accountable decision maker still needs a conclusion that says what the available evidence supports.

This separation is useful when evidence conflicts. One team should not silently change a population definition to make a result green; another should not reject a useful source merely because it is incomplete for a different purpose. Record the claim, decision owner, and interpretation rule early enough that disagreement improves the model rather than becoming a late dispute over a dashboard number.

## Sources, Oracles, and Evidence

### Identify the authoritative source for the claim

An **authoritative source** is the system, record, or controlled rule that has the accepted authority for a particular claim in a particular context. It is not necessarily the oldest system, the easiest table to query, or the service that first created an event.

For an Atlas Commerce shopper’s current delivery address, the account service may be authoritative. For payment settlement, the payment ledger may be authoritative. For a finance report, an approved business definition and settlement rules may be authoritative in addition to any one database table. Authority can be divided: a customer record may own contact details while a payment provider owns settlement state.

Authority should be stated and challenged. A team should ask:

- Who is accountable for defining the fact?
- Which source is expected to represent the current or historical value?
- What delay, transformation, or exception exists between that source and the decision consumer?
- What happens when two legitimate sources disagree?

These questions are not an invitation to create a governance programme. They are the minimum context needed to choose evidence responsibly.

### Oracles judge observations; they also have limits

An **oracle** is a source of expected behaviour or expected data against which an observation is compared. A schema constraint, a business rule, a source record, a calculation performed independently, an approved metric definition, or a reconciled total can all serve as an oracle.

No oracle is automatically strong. A copied business rule may encode an old policy. A source system may itself contain a defect. An expected value calculated by the same code path as the observed value creates **shared-logic risk**: agreement can reflect the same flawed assumption rather than independent confirmation.

| Oracle type | Useful for | Important limitation |
|---|---|---|
| Schema constraint | Shape, type, required fields, allowed values | Structural conformance does not establish business meaning. |
| Source record | Source-to-target comparison | The source may not be authoritative for the consumer’s decision. |
| Business rule | Domain-specific expectation | The documented rule may be incomplete, ambiguous, or stale. |
| Independent calculation | Challenging a transformation or aggregate | Independence must be real; duplicated logic can agree incorrectly. |
| Reconciled total | Detecting material population or amount differences | Equal totals can conceal offsetting record-level errors. |
| Downstream invariant | Detecting consequences visible to a consumer | It may reveal a problem late and not identify the cause. |

Selecting an oracle is an engineering decision. The question is not “what assertion can be written?” but “what comparison can credibly challenge the decision-relevant claim?”

### Evidence should make its boundary visible

Evidence is useful only when another engineer can understand what was observed, how it was obtained, and what conclusion it supports. A query result without its filter, time of execution, source, expected population, or interpretation is difficult to review and reproduce.

For a data claim, record at least:

1. the decision and consumer;
2. the claim and population boundary;
3. the representation and sources examined;
4. the oracle or comparison used;
5. the observed result and when it was collected;
6. material assumptions and exclusions; and
7. the supported conclusion, unresolved uncertainty, and residual risk.

This is a proportionate record, not a request for bureaucracy. A small change may need a short note. A finance close, safety control, or customer-impacting migration may need a more formal review. The required depth follows the consequence of being wrong.

> **Supporting asset (Pass 2, planned):** *Data Claim and Evidence Flow* will show the relationship among a decision consumer, claim, population, authoritative source, oracle, observation, limitation, and residual risk.

## Limitations, Uncertainty, and Residual Risk

### A successful pipeline run proves less than it appears to prove

A successful run can establish that a job executed according to the signal reported by its scheduler. It may not establish that every expected input arrived, that a mapping preserved meaning, that duplicates were handled as intended, that a consumer sees the result, or that the result is timely for the decision.

Similarly, a check that finds no null values may establish that the examined column contains no database nulls. It may not establish that placeholder values such as `UNKNOWN`, `0`, or an empty string are meaningful. A duplicate check can establish repeated keys in a selected scope; it may not establish whether repetition represents a defect, a legitimate history, or a retry.

Quality Engineering does not reject narrow evidence. It prevents narrow evidence from being described as a broad guarantee.

### Residual uncertainty and residual risk

**Residual uncertainty** is what the available evidence still does not establish. “The settlement feed may contain late records after the report cutoff” is an uncertainty. **Residual risk** connects that uncertainty to a possible harmful outcome: “Finance may act on an understated revenue figure until the late records are reconciled.”

The distinction helps teams make accountable decisions. An engineer should not claim that all uncertainty has been removed. Nor should uncertainty become an excuse to avoid a decision. The responsible next step is to state the uncertainty, assess its consequence and likelihood in context, select proportionate additional evidence or control, and identify the decision owner.

### Data defects and application defects

A **data defect** is a harmful problem in data value, meaning, population, relationship, timing, lineage, or usability for a defined purpose. An **application defect** is a harmful problem in software behaviour. They often interact but should not be collapsed into one category.

An application can calculate a discount incorrectly and write wrong values: the application defect causes a data defect. Conversely, a service can behave as designed while consuming stale reference data: the immediate behaviour may be correct relative to its input, while the data condition harms customers. A report can be wrong because its transformation is defective, because its input is incomplete, or because its metric definition is misunderstood.

Classification should help investigation, ownership, and prevention. It should not become an argument about which team receives a ticket. The useful question is which boundary allowed the harmful claim to reach a decision or behaviour, and what evidence or control could reduce recurrence.

## A Proportionate Data Quality Evidence Review

The following six-step review is an **original MSQE educational framing**. It helps a Quality Engineer turn a vague concern such as “validate the data” into an inspectable investigation.

1. **Name the decision.** What action, behaviour, or communication depends on the data?
2. **State the claim.** What needs to be true, for whom, and during what period?
3. **Define the population and meaning.** Which records count, which representation is relevant, and what terms require a business definition?
4. **Select sources and oracles.** Which source is authoritative, which comparison can challenge the claim, and where could shared logic weaken the result?
5. **Collect and interpret evidence.** Record the method, scope, result, freshness, exclusions, and whether the result supports, challenges, or leaves the claim unresolved.
6. **Communicate limits and action.** State residual uncertainty, residual risk, owner, and the smallest next action that could improve the decision.

The review does not prescribe a number of tests, queries, fields, or scorecards. It keeps investigation aligned with decision value.

## Engineering Perspective

Treat data quality as a property engineered across boundaries, not as a final inspection of a database. Product, data, software, platform, and quality roles contribute different knowledge: business definitions, source behaviour, transformations, constraints, deployment conditions, and evidence interpretation. Shared contribution does not remove accountability. It makes interfaces, assumptions, and decision ownership explicit.

For a small feature, this may mean agreeing on what “active customer” means before adding a dashboard card. For a migration, it may mean defining source-to-target populations, exception handling, and reconciliation before cutover. For a reporting incident, it may mean preserving evidence about the report’s definition and input timing rather than only patching an aggregate.

## Industry Perspective

Formal models can improve vocabulary, but they do not decide local fitness for purpose. ISO/IEC 25012 addresses a general data-quality model for structured data.[^iso-25012] ISO/TS 8000-82 addresses creating data rules for data-quality assessment.[^iso-8000-82] These sources are useful when a team needs precise terms or a reviewable rule. They do not remove the need to define a decision consumer, population, authoritative source, and evidence limitation.

In practical delivery work, data-quality evidence may appear in code review, a migration plan, a reconciliation record, a defect investigation, or a release decision. The artefact matters less than whether it allows an informed person to understand the claim, challenge the evidence, and act on the remaining risk.

## Common Misconceptions

### “If a row has the expected value, the data is correct.”

The row may be correct for its representation while the population, business meaning, timing, or downstream interpretation is wrong. Start with the claim and decision boundary.

### “A successful job proves the pipeline is healthy.”

It proves only the completion signal and conditions that the job reports. It does not prove input completeness, transformation meaning, consumer availability, or decision fitness.

### “The source system is always the oracle.”

The source may be authoritative for one fact and unsuitable for another. It can also contain defects. Authority is claim-specific and should be stated.

### “Data quality is just a data-team responsibility.”

Data is created and consumed across product, application, integration, platform, and reporting boundaries. Data specialists bring essential expertise, but data-quality risk is a shared engineering concern.

### “More checks eliminate residual risk.”

Additional checks can be redundant, stale, or aimed at the wrong boundary. Risk is reduced by relevant, interpretable evidence and proportionate controls—not by count alone.

## Summary

Data Quality Engineering turns data checking into decision-oriented evidence work. A useful data-quality conclusion identifies the consumer, claim, population, representation, source, oracle, observation, limitation, and residual risk. Correct values and successful jobs can provide evidence, but they do not justify claims wider than their scope.

The next chapter examines why that scope is shaped by representation: types, identifiers, nullability, units, timestamps, constraints, and contextual quality dimensions. Chapter 3 will then apply the same disciplined reasoning to queries, keys, and relationships.

## Key Takeaways

- A data-quality claim connects data to a decision; it is wider than an observed value or query result.
- Fitness for purpose depends on the decision consumer, population, meaning, timing, and acceptable uncertainty.
- An authoritative source and an oracle are selected for a particular claim; neither is automatically trustworthy in every context.
- A successful job, a correct-looking row, or a passing check is bounded evidence, not a universal guarantee.
- Residual uncertainty states what evidence does not establish; residual risk states the possible consequence.
- Data and application defects can interact, so investigation should examine the boundary that allowed harm rather than focus on labels.
- The value of data-quality work is measured by better decisions and learning, not by the number of rows or fields checked.

## Review Questions

1. What is the difference between an observation and a data-quality claim?
2. Why does a decision consumer matter when assessing data fitness for purpose?
3. Give an example in which an authoritative source for one claim would be a weak oracle for another.
4. What can a successful pipeline job establish, and what important things might it not establish?
5. How does shared-logic risk weaken an oracle?
6. Distinguish residual uncertainty from residual risk using a reporting example.
7. How can a data defect arise from application behaviour without being identical to an application defect?
8. Why is a universal data-quality score often less useful than a scoped claim?

## Interview Questions

1. A stakeholder says that the dashboard is accurate because the nightly job succeeded. How would you assess and communicate that claim?
2. How would you decide which system is authoritative for a cross-system reconciliation?
3. Describe how you would investigate a report that is structurally valid but appears semantically wrong.
4. How do you explain evidence limitations without preventing an accountable team from making a decision?
5. Give an example of a data-quality check that could create false confidence and how you would strengthen it.

## Practical Exercise

### Data Quality Evidence Review: Atlas Commerce Revenue Alert

**Objective:** Produce a decision-oriented evidence review for the revenue alert in the opening story.

**Scenario:** Atlas Commerce’s daily report shows a 18% revenue decrease for 2026-08-10. The team provides the following fictional evidence:

| Evidence item | Observation | Context and limitation |
|---|---|---|
| Scheduler status | Revenue job completed | Confirms execution, not source completeness. |
| Row sample | Ten reporting rows match selected order-screen values | All ten use card payments; no settlement comparison. |
| Payment feed note | Bank-transfer settlement file arrived four hours late | Population and amount affected are not yet quantified. |
| Transformation test | Net revenue calculation passed unit checks | The test uses the same tax-classification helper as the transformation. |
| Metric definition | “Revenue” is documented as recognised net revenue | The document does not state the report cutoff or refund treatment. |

**Constraints:** Do not invent data or recommend checking every record manually. Finance needs a decision within one working day.

**Tasks:**

1. State the decision consumer, decision, and bounded data-quality claim.
2. Define the likely population and identify terms that need clarification before a conclusion is made.
3. Assess each evidence item for relevance, freshness, independence, and limitation.
4. Identify the likely authoritative source or sources and propose one independent oracle or comparison.
5. Recommend the smallest next evidence activities that could reduce the most consequential uncertainty.
6. Write a short residual-risk statement for the finance lead.

**Expected artifact:** A one- to two-page **Data Quality Evidence Review** containing a claim statement, evidence table, source/oracle rationale, supported and unsupported conclusions, next actions, and residual-risk communication.

**Reflection:** Which observation initially looked most reassuring? What specific assumption prevented it from supporting the decision on its own?

**Portfolio relevance:** This artefact demonstrates data-quality judgement and risk communication. Use fictional or safely anonymised information only; exclude customer data, credentials, internal identifiers, and confidential business information.

## Further Reading

- [ISO/IEC 25012:2008 — Data Quality Model](https://www.iso.org/standard/35736.html)
- [ISO/TS 8000-82:2022 — Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html)
- [IEEE Computer Society, *Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a*](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf)
- [Part III — Software Testing Engineering](../../part-03-software-testing/README.md)
- [Part V — Automation Engineering](../../part-05-automation-engineering/README.md)
- [Chapter 2 — Data Representations, Models, and Contextual Quality Dimensions](chapter-02-data-representations-models-and-contextual-quality-dimensions.md)

## References

[^iso-25012]: International Organization for Standardization. [ISO/IEC 25012:2008 — Software engineering — Software product Quality Requirements and Evaluation (SQuaRE) — Data quality model](https://www.iso.org/standard/35736.html). 2008; confirmed current by ISO catalogue, accessed 2026-08-11.
[^iso-8000-82]: International Organization for Standardization. [ISO/TS 8000-82:2022 — Data quality — Part 82: Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html). 2022; accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] State a decision-oriented data-quality claim rather than only a field-level check.
- [ ] Identify the relevant population, decision consumer, authoritative source, and oracle.
- [ ] Explain what a successful job or correct-looking row does and does not establish.
- [ ] Record evidence limitations, residual uncertainty, and residual risk clearly.
- [ ] Distinguish a data defect from an application defect while investigating their relationship.
