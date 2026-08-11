# Chapter 7 — Batch, Streaming, and Temporal Data Quality

## Metadata

| Field | Value |
|---|---|
| Part | Part VI — Data Quality Engineering |
| MQE-BOK domain | Domain 6 — Data Quality Engineering |
| Chapter | 7 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–6; Parts I–V, or equivalent experience |
| Estimated study time | 115 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE educational framing:** Time is part of the data claim. A complete answer for one cutoff can be incomplete for another.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. Its fulfilment team receives a morning report showing that all weekend orders have been dispatched. The report has the correct count for events processed before 08:00. At 10:30, several customers contact support because their orders still show as unfulfilled.

The events were not lost. A carrier sent status updates late, and a corrected event for one order arrived after an earlier “dispatched” update. The warehouse report used processing time to define the weekend population. Operations assumed it represented events that occurred during the weekend. A replay then introduced a duplicate status event, which the dashboard treated as a second dispatch.

The report was accurate about the selected processing window. It was unfit for the claim its consumer inferred. The team needs to distinguish when an event occurred, when it arrived, when it was processed, when a business period closes, and when a result is sufficiently complete for a decision.

## Why This Chapter Matters

Many harmful data-quality failures are temporal rather than purely value-based. A correct event can arrive too late. A report can be complete for processed input but incomplete for the business period it claims to represent. A correction can change a previously trustworthy aggregate. A duplicate can be a retry, a replay, or a genuine new fact.

Batch and streaming are useful descriptions of how data is collected and processed, not separate quality disciplines. The transferable engineering question is how time, ordering, duplication, correction, and convergence affect the population and decision. This chapter avoids message-broker configuration, distributed-systems architecture, and SRE implementation; those remain later-Part concerns.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish event time, source-recorded time, receipt time, processing time, business time, and reporting time;
- define temporal completeness and freshness for a particular consumer decision;
- assess batch and streaming data for late arrival, duplicate, replay, ordering, correction, backfill, and window effects;
- explain eventual convergence without confusing it with immediate completeness;
- design evidence that records cutoff, population, unresolved range, and revision trigger; and
- produce a Temporal Data Quality Investigation that records temporal assumptions and a revision policy.

## Time Concepts Shape Population Meaning

An event can have several relevant times:

| Time concept | Example: carrier status | Quality question |
|---|---|---|
| Event time | The carrier marked a parcel dispatched at 23:55 | When did the business fact occur? |
| Source-recorded time | Carrier system stored the update at 23:57 | How does the producer represent the fact? |
| Receipt time | Atlas Commerce received the event at 01:20 | When did the pipeline obtain it? |
| Processing time | The report processed it at 01:25 | When did a target representation change? |
| Business time | Weekend fulfilment period closes in warehouse-local time | Which calendar and owner define the decision window? |
| Reporting time | Dashboard refreshed at 08:00 | When was the consumer view true? |

Do not assume that one timestamp can answer all questions. A date and time representation should include a clear convention for precision and offset where that matters; RFC 3339 is a widely used Internet timestamp profile, and RFC 9557 updates it.[^rfc-3339][^rfc-9557] Conformance to a format does not decide which time concept is appropriate for a report.

### Temporal completeness

**Temporal completeness** is the degree to which the expected population for a stated time boundary is represented. “All weekend dispatches” requires an event-time definition, time zone, cutoff, source scope, and policy for late events. “All events processed by 08:00” is a different, narrower claim.

Temporal completeness may be provisional by design. A near-real-time operational view can prioritise low latency and show an explicit delay window. A finance close can require a longer wait, reconciliation, or approval. The consumer decision determines the acceptable trade-off.

### Freshness is not merely recent processing

**Freshness** means sufficiently current for a defined purpose. A dashboard refreshed seconds ago can still be stale if no new source input arrived. A historical report can be fit even though it has not changed for days. State expected update cadence, source expectation, observed latest relevant fact, consumer cutoff, and consequence of delay.

## Batch, Streaming, and Windows

### Batch data needs a clear completion boundary

A **batch** is a bounded collection of data processed together according to a defined rule or schedule. The boundary may be a file, date range, source extract marker, or set of records. Batch processing is not inherently complete merely because a run completed. Evidence should show which expected population the batch represents and whether a partial extract, late file, or rejected record affects the decision.

Useful batch questions include:

- What source period and identifier range were expected?
- Has the source declared the extract complete?
- Which records were accepted, rejected, or deferred?
- Does rerunning the batch create duplicate target effects?
- How are corrected historical records incorporated?

### Streaming introduces continuing windows

A **streaming** flow processes or makes data available as events arrive rather than waiting for one complete batch. It often makes timeliness visible, but it does not remove population uncertainty. An event may arrive late, be repeated, be reordered, or represent a correction to prior state.

A **window** is the defined interval over which a system or decision groups or evaluates events. A daily report window, a five-minute operational view, and a settlement cutoff each need explicit start, end, time basis, and late-arrival policy. A **watermark** is a boundary or signal used by some systems to indicate how far event-time processing is believed to have progressed. Treat it as evidence about a system’s current completeness assumption, not proof that no earlier event can arrive.

## Late, Duplicate, Replayed, and Corrected Data

### Late data changes a previous conclusion

**Late data** arrives or becomes usable after the time at which a consumer expected it. It may be correct and legitimate. Its risk depends on whether an earlier decision, dashboard, or control treated the population as complete.

Define a late-data policy: accept and revise, hold for review, backfill a historical result, or exclude under an approved cutoff. The policy should state who sees the revision, how a difference is classified, and when a prior conclusion is no longer reliable.

### Duplicates and replay require identity plus effect

A **replay** is the deliberate or accidental reprocessing of previously received input. It can recover from a failure or correct a transformation. It can also duplicate a consumer-visible effect if identity and state handling are weak.

As Chapter 5 explained, idempotency is a scoped property: applying the same intended input again has the same relevant effect as applying it once. For temporal evidence, also ask whether a repeat has the same event identifier, business key, version, occurrence time, and correction semantics. A duplicate dispatch status may be harmless; a repeated refund may create a harmful financial effect.

### Corrections and backfills revise history

A **correction** changes the accepted representation of a prior fact. A **backfill** deliberately adds or recomputes historical data that was absent or incorrect. Both can improve quality, but they make a past report or reconciliation result time-dependent.

Record the original population, correction source, effective period, processing version, consumer impact, and revision trigger. Avoid overwriting history so completely that an investigator cannot explain why a previously issued report changed. This is not a prescription for a specific storage design; it is an evidence requirement for consequential changes.

## Ordering and Eventual Convergence

### Arrival order is not always business order

Ordering matters when state depends on sequence. A cancellation may arrive before an earlier dispatch event; a correction may arrive before the event it corrects. Some decisions can tolerate temporary disorder; others must wait for an expected state or surface a pending condition.

Define the relevant ordering attribute and consumer rule. It may be an event sequence, source version, effective date, or acknowledged business state. Processing order alone is often a weak proxy.

### Eventual convergence needs a decision limit

**Eventual convergence** means that independently processed representations are expected to become consistent after propagation, retry, or late data is resolved. It can be an appropriate design trade-off. It is not a promise that all interim views support final decisions.

State the expected convergence window, evidence that progress is occurring, what happens when it is exceeded, and which consumers may act before convergence. “Eventually consistent” without those details transfers uncertainty to the user without control.

## Worked Example: Two Timelines, Different Complete Answers

The following illustrative examples concern Atlas Commerce, a fictional retailer. They use the same discipline—event identity, time concepts, population, and decision closure—but lead to different appropriate conclusions.

### Timeline 1: a late dispatch before the operational decision closes

The warehouse needs a 10:30 local decision on whether all 100 orders expected for its morning dispatch wave have been dispatched. The operational report first refreshes at 10:00. One carrier event, `D-801`, occurred during the wave but arrives after that refresh.

| Time | Observation for `D-801` | Consequence for the dispatch claim |
|---|---|---|
| 09:45 | **Event time:** carrier marks `O-801` dispatched. | The business fact belongs to the morning-wave population. |
| 09:47 | **Source-recorded time:** carrier persists the update. | The producer can later supply independent evidence of occurrence. |
| 10:00 | **Reporting time:** Atlas dashboard reports 99 dispatches. | The result is **provisional**: it is complete only for data processed before 10:00, not necessarily for the event-time population. |
| 10:12 | **Receipt time:** Atlas receives `D-801`. | The gap is now known to be late arrival, not necessarily a lost order. |
| 10:14 | **Processing time:** the warehouse representation includes `D-801`. | The **current** view shows 100 dispatches, but the agreed late-arrival window has not yet closed. |
| 10:30 | **Decision close:** no further expected events remain unresolved. | The 100-dispatch result is **final/closed** for this operational decision, subject to the stated correction policy. |

At 10:00, “complete” means *complete for the processing snapshot*. At 10:30, it means *complete for the defined morning-wave event population after the agreed arrival window*. Both statements can be accurate, but they answer different questions. An operational consumer may act on the 10:00 provisional result only if its consequence of being one order short is acceptable and visible.

### Timeline 2: a correction after a reporting period was closed

Finance treats the 30 June revenue report as final at 09:00 on 1 July. It shows **€10,000.00** net revenue. On 3 July, a correction arrives for `O-802`: a €100.00 refund is business-effective on 30 June but was not represented when the report was closed.

| Time | Observation for `O-802` correction | Consequence for the June report |
|---|---|---|
| 30 June, 17:00 | **Business-effective time:** the refund should affect June net revenue. | The corrected business interpretation belongs to the June population. |
| 1 July, 09:00 | **Reporting time:** June report is issued at €10,000.00 under the then-known population. | The report is **final/closed** under its original close policy; that does not make it immutable truth. |
| 3 July, 09:55 | **Event and source-recorded time:** the correction is issued by the authoritative refund source. | The previously closed report becomes **stale** for a current historical-revenue question. |
| 3 July, 10:00 | **Receipt time:** Atlas receives the correction. | Evidence exists to investigate whether the correction belongs to the June close and whether it is unique. |
| 3 July, 10:10 | **Processing time:** a controlled backfill applies the approved correction. | The historical representation is revised. |
| 3 July, 10:15 | **Reporting time:** a corrected June report is published at **€9,900.00**. | This is the **corrected historical result**, with an explanation of the prior issued value and revision trigger. |

The right action depends on the consumer question. An audit of the 1 July issued report may need the original closed value and its close-time evidence. A current management analysis of June revenue needs the corrected value and an explicit restatement. Calling either result simply “the June number” conceals the time assumption.

### Make the temporal assumption part of the conclusion

| Consumer question | Appropriate result | Why |
|---|---|---|
| “What did the warehouse know at 10:00?” | 99 dispatches, provisional. | `D-801` had not been received or processed. |
| “Was the morning wave complete at the 10:30 decision boundary?” | 100 dispatches, final for the stated policy. | The late event arrived and was processed within the accepted window. |
| “What revenue did Finance issue on 1 July?” | €10,000.00, closed historical report. | It records the result and evidence available at the original close. |
| “What is the current corrected view of June revenue?” | €9,900.00, corrected historical report. | A later authoritative correction changes the business-effective June population. |

The examples do not require streaming infrastructure. They show why a data-quality conclusion must name its event, receipt, processing, business-effective, and reporting assumptions where they affect the decision. A final status is a governed decision state; it is not a claim that no future correction can exist.

## Temporal Evidence Strategy

The following is an **original MSQE educational framing** for a time-aware investigation:

1. State the consumer decision and the time-based claim.
2. Identify the required time concepts, time zone, period, cutoff, and expected population.
3. Compare expected, received, processed, and consumer-visible populations by a safe identifier.
4. Classify late, duplicate, replayed, corrected, backfilled, and unresolved records.
5. Define the convergence or revision policy and evidence limitation.
6. Communicate whether the current result is final, provisional, stale, or unsupported, with residual risk and trigger for reassessment.

A useful artifact can be concise. Its value is that another engineer understands what “current,” “complete,” and “late” mean for the decision.

> **Supporting asset (Pass 2, planned):** *Temporal Data Investigation Timeline* will compare event, receipt, processing, reporting, and correction times for fictional Atlas Commerce fulfilment events.

## Engineering Perspective

Temporal quality improves when systems retain stable event identity, source and receipt times, business-effective time where needed, version or correction context, and safe revision signals. These choices make it possible to explain why an aggregate changed or why a consumer view is provisional.

Quality Engineers should challenge the use of “real time,” “fresh,” and “complete” when they lack a consumer-specific definition. This complements later observability and reliability implementation; it does not replace it.

## Industry Perspective

Date and time representation standards can reduce ambiguity at interfaces, but they do not settle the business meaning of time. RFC 3339 provides a common timestamp profile and RFC 9557 updates it; teams should consult the current specification set when an interface conformance profile matters.[^rfc-3339][^rfc-9557] Formal data-quality models, including ISO/IEC 25012, provide relevant vocabulary for timeliness and related concerns.[^iso-25012] A team must still define the period, source, cutoff, exception policy, and decision impact.

## Common Misconceptions

### “Processed today” means “occurred today.”

Processing time and event time can differ materially. Choose the time concept that matches the claim.

### “A refreshed dashboard is fresh.”

It may display a recently refreshed view of old or incomplete input. Freshness needs source and consumer context.

### “Late data is automatically defective.”

It can be an expected condition. The quality concern is whether the consumer is told what the current population represents and how revision occurs.

### “Replay is the same as a duplicate defect.”

Replay can be a deliberate recovery mechanism. Its safety depends on identity, idempotent effect, version, and correction rules.

### “Eventual convergence is enough for every decision.”

Some decisions can wait; others need a final or explicitly provisional result. State the limit and consumer impact.

## Summary

Time is part of every data-quality claim. Batch and streaming flows need clear boundaries for event occurrence, receipt, processing, reporting, late arrival, correction, and convergence. A result can be accurate for a processing window while unfit for a business-period decision.

The next chapter examines how contracts, lineage, provenance, and ownership make these assumptions and trust boundaries inspectable across producers and consumers.

## Key Takeaways

- Event, receipt, processing, business, and reporting time answer different questions.
- Temporal completeness and freshness require a consumer, period, cutoff, source, and exception policy.
- Batch completion and streaming progress are bounded evidence, not universal completeness guarantees.
- Late, duplicate, replayed, corrected, and backfilled data need explicit identity and revision treatment.
- Eventual convergence needs a defined window, escalation condition, and consumer limitation.
- Temporal evidence should state whether a conclusion is final, provisional, stale, or unsupported.

## Review Questions

1. Why can processing time be a poor basis for a business report?
2. What must be defined before claiming temporal completeness?
3. How does a watermark differ from proof that no earlier event will arrive?
4. What evidence is needed to distinguish replay from a harmful duplicate?
5. How can a correction affect an earlier reconciliation conclusion?
6. What should an eventual-convergence policy say to a consumer?
7. Why does a recent dashboard refresh not prove freshness?
8. How would you classify a report whose late input is still within an agreed window?

## Interview Questions

1. How would you investigate a daily report that changes after it was declared complete?
2. What time concepts would you clarify before testing a fulfilment metric?
3. How would you design evidence for late and duplicate payment events?
4. Explain how you would communicate a provisional data result to a decision maker.
5. What does temporal Data Quality Engineering add beyond verifying a scheduler run?

## Practical Exercise

### Temporal Data Quality Investigation: Atlas Commerce Weekend Fulfilment

**Objective:** Assess whether the weekend fulfilment report supports an operations decision after late, duplicate, and corrected events appear.

**Scenario:** The 08:00 report selects events processed before 08:00. Carrier events include event time, receipt time, processing time, `event_id`, `order_id`, and status. Several weekend events arrive after 08:00, one prior event is corrected, and a replay contains duplicate identifiers.

**Tasks:**

1. State the operations decision and define the required event-time population, business time zone, and cutoff.
2. Create a time-concept table for the source, pipeline, and dashboard representations.
3. Define evidence for late arrivals, duplicate/replay handling, corrections, and consumer-visible freshness.
4. Classify the report as final, provisional, stale, or unsupported; justify the conclusion.
5. Propose a revision and escalation policy, including an eventual-convergence limit.
6. Write a residual-risk statement for the fulfilment lead.

**Expected artifact:** A two- to three-page **Temporal Data Quality Investigation** containing a time model, population comparison, exception classification, evidence limits, revision policy, and residual risk.

## Further Reading

- [RFC 3339 — Date and Time on the Internet: Timestamps](https://www.rfc-editor.org/rfc/rfc3339)
- [RFC 9557 — Date and Time on the Internet: Timestamps with Additional Information](https://www.rfc-editor.org/rfc/rfc9557)
- [ISO/IEC 25012:2008 — Data Quality Model](https://www.iso.org/standard/35736.html)
- [Chapter 6 — Reconciliation and Cross-System Consistency](chapter-06-reconciliation-and-cross-system-consistency.md)
- [Chapter 8 — Data Contracts, Lineage, Provenance, and Ownership](chapter-08-data-contracts-lineage-provenance-and-ownership.md)

## References

[^iso-25012]: International Organization for Standardization. [ISO/IEC 25012:2008 — Software engineering — Software product Quality Requirements and Evaluation (SQuaRE) — Data quality model](https://www.iso.org/standard/35736.html). 2008; confirmed current by ISO catalogue, accessed 2026-08-11.
[^rfc-3339]: G. Klyne and C. Newman. [RFC 3339 — Date and Time on the Internet: Timestamps](https://www.rfc-editor.org/rfc/rfc3339). IETF, July 2002; accessed 2026-08-11.
[^rfc-9557]: U. Sharma and C. Bormann. [RFC 9557 — Date and Time on the Internet: Timestamps with Additional Information](https://www.rfc-editor.org/rfc/rfc9557). IETF, 2024; accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish the time concepts that shape a data-quality claim.
- [ ] Define temporal completeness and freshness for a consumer decision.
- [ ] Assess late, duplicate, replayed, corrected, and backfilled data without overgeneralising.
- [ ] Explain eventual convergence and revision limits clearly.
- [ ] Produce a Temporal Data Quality Investigation with residual risk.
