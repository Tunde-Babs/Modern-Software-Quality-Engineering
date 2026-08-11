# Chapter 6 — Reconciliation and Cross-System Consistency

## Metadata

| Field | Value |
|---|---|
| Part | Part VI — Data Quality Engineering |
| MQE-BOK domain | Domain 6 — Data Quality Engineering |
| Chapter | 6 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–5; Parts I–V, or equivalent experience |
| Estimated study time | 120 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE educational framing:** Reconciliation is not the search for equal totals. It is the explanation of whether two representations agree enough for a defined decision.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. At month end, finance compares the payment ledger with the revenue warehouse. Both show €2.4 million for the period. The team marks reconciliation complete.

An auditor asks for the unmatched records. The team finds none because it compared only aggregate totals. When it performs keyed matching, it discovers several categories of difference: payments settled after the report cutoff, refund corrections represented as separate ledger entries, two orders recorded in the wrong market, and a currency conversion defect whose overstatement offsets several missing records.

The totals matched by coincidence. The systems did not agree in the way finance needed. The right result is not necessarily “failed reconciliation”; some differences are explainable timing or lifecycle effects. The right result is a classified statement: which populations matched, which records remain unmatched, which differences are expected, which need correction, and what financial risk remains.

## Why This Chapter Matters

Reconciliation is a central Data Quality Engineering capability because important facts often appear in more than one system. Orders, payments, inventory, customer status, operational events, reports, and audits each use representations with different purposes and timing. A team needs disciplined evidence about whether they agree where agreement matters.

Chapter 3 introduced counts, keys, joins, unmatched sets, and aggregates as bounded query evidence. Chapter 5 mapped how populations change across pipeline stages. This chapter integrates those ideas into a strategy for cross-system consistency. It does not prescribe a financial-reconciliation product, warehouse, or data platform.

## Learning Objectives

By the end of this chapter, you should be able to:

- define reconciliation as a comparison of decision-relevant populations and representations;
- specify comparable source and target populations, keys, time windows, units, and lifecycle rules;
- use counts, keyed matching, unmatched sets, totals, balances, invariants, and exception classifications as complementary evidence;
- explain many-to-one and one-to-many relationships without producing misleading matches or totals;
- define and justify tolerances and partial-reconciliation conclusions;
- distinguish explainable differences from false agreement; and
- produce a Cross-System Reconciliation Strategy that distinguishes supported, pending, explainable, and unresolved differences.

## Reconciliation Begins With Comparable Claims

**Reconciliation** is the disciplined comparison of two or more data representations or calculations to determine whether they agree according to a defined rule. The word “agree” is intentionally contextual. A payment ledger and a daily dashboard may be expected to differ temporarily because they serve different cutoffs. A finance close may require stronger agreement before a decision can proceed.

### Define expected and observed populations

Use the same discipline as a data-quality claim:

| Element | Atlas Commerce month-end example |
|---|---|
| Decision | Finance close and investigation of material difference |
| Expected population | Settled payments before the legal-entity cutoff, with stated refund treatment |
| Observed population | Revenue records generated under the same inclusion and currency rules |
| Identity or mapping | Settlement identifier mapped to order and revenue entry; documented split/correction rules |
| Comparison | Keyed matches, unmatched sets, amounts, and aggregates by market/currency |
| Exceptions | Late settlement, approved reversal, correction, and known migration population |
| Conclusion | Matched, explainable difference, unresolved difference, or unsupported claim |

Equal row counts or equal totals cannot substitute for this definition. They are observations that may contribute to it.

### Comparable does not mean identical storage

Source and target may use different identifiers, grains, currencies, and update times. A payment ledger may have several records for one order, while a report has one recognised-revenue record. Reconciliation needs an explicit mapping and expected cardinality.

The mapping may be one-to-one, many-to-one, one-to-many, or conditional. For example, one settlement can be allocated across several report entries; several events can combine into one current state. Do not force a one-to-one match merely because it is easy to query. Document the relationship and use comparison methods compatible with it.

## Complementary Reconciliation Evidence

### Counts reveal scale, not identity

Counts are quick signals for population shifts. They can reveal that a source contains 10,000 expected records and a target contains 9,700. They cannot identify which records differ, whether record grain is equivalent, or whether differences offset.

Use counts by meaningful dimensions—market, currency, lifecycle state, source version, business date, or exception reason—rather than only one grand total. A count mismatch becomes more useful when it points to a bounded population for investigation.

### Keyed matching reveals unmatched sets

**Keyed matching** compares records through an agreed identifier or mapping. It produces matched, source-only, target-only, and sometimes ambiguous groups. An **unmatched set** is not automatically a defect. It is a population requiring classification.

Useful exception categories might include:

- expected late arrival within an agreed window;
- legitimate reversal or correction;
- mapping gap or unknown identifier;
- source record excluded by an approved target rule;
- target record with no source evidence;
- duplicate or multiplicity condition; and
- suspected defect pending ownership.

Preserve safe identifiers and relevant attributes so classifications can be reviewed. A percentage alone does not explain whether unmatched records are consequential.

### Totals and balances challenge value agreement

Totals, balances, and aggregates are important where quantities or money matter. They can detect errors that keyed matching misses, such as wrong amounts, conversion, or allocation. They can also agree while record-level differences offset.

Compare totals only after confirming unit, currency, rounding, population, grouping, and time treatment. A balance should be tied to a meaningful conservation rule—for example, recognised revenue plus approved reversals and adjustments should reconcile to the eligible settlement population under the stated accounting rule. The exact invariant belongs to the domain; the Quality Engineer ensures its assumptions are visible.

### Invariants provide a different challenge

An **invariant** is a relation expected to hold within a stated scope. For a stock movement process, opening balance plus receipts minus fulfilled quantity might equal closing balance after approved adjustments. For finance, one may compare sums across ledger categories under defined period and currency rules.

An invariant is not a universal truth. It needs population, exception, timing, and ownership. Its value comes from challenging a transformation or relationship from a perspective different from a direct copy comparison.

## Worked Example: A Close With Equal Counts and Equal Totals

The following illustrative example concerns Atlas Commerce, a fictional retailer. Finance is assessing whether the 30 June close can rely on the settlement ledger and the revenue report. Both use EUR for this example. The comparison is intentionally small, but it includes the relationship shapes and timing conditions that a grand total can hide.

The initial comparable population is the set of ledger entries available in the close snapshot. The report represents recognised revenue at a different grain. `S-905` is shown separately because its business event occurred before the close but its ledger receipt arrived after the snapshot; it is a pending temporal difference, not silently excluded evidence.

### Population and key strategy

| Ledger entry | Order | Lifecycle meaning | Amount (EUR) | Expected report relationship |
|---|---|---|---:|---|
| `S-901` | `O-100` | Normal settlement | 100.00 | One ledger entry to one report entry. |
| `S-902` | `O-101` | Normal settlement | 80.00 | One to one. |
| `S-903` | `O-102` | Split settlement allocation | 60.00 | One ledger entry to two report allocations totalling €60.00. |
| `S-904` | `O-103` | Original settlement | 50.00 | Combines with correction `C-904` into one net report entry. |
| `C-904` | `O-103` | Approved correction | -10.00 | Combines with `S-904`; net expected amount is €40.00. |
| `S-906` | `O-106` | Normal settlement | 25.00 | One to one; no approved exception is known. |

The close-snapshot ledger has **six entries totalling €305.00**. The expectation is not six report rows. It is a reviewable mapping: settlement identifier where available, order identifier, correction relationship, and allocation rule.

| Report entry | Order | Amount (EUR) | Observed relationship |
|---|---|---:|---|
| `R-901` | `O-100` | 100.00 | Maps to `S-901`. |
| `R-902` | `O-101` | 80.00 | Maps to `S-902`. |
| `R-903-A` | `O-102` | 30.00 | First allocation of `S-903`. |
| `R-903-B` | `O-102` | 30.00 | Second allocation of `S-903`. |
| `R-904` | `O-103` | 40.00 | Net representation of `S-904` plus `C-904`. |
| `R-999` | `O-999` | 25.00 | Has no corresponding ledger evidence in the close snapshot. |

The report also has **six rows totalling €305.00**. A count comparison and an amount comparison both pass. Neither result is sufficient.

### Match by the intended cardinality

| Comparison outcome | Entries | Amount effect | Classification |
|---|---|---:|---|
| One-to-one matches | `S-901 → R-901`; `S-902 → R-902` | 180.00 | Matched. |
| One-to-many allocation | `S-903 → R-903-A + R-903-B` | 60.00 = 30.00 + 30.00 | Matched when the approved allocation rule is applied. |
| Many-to-one correction | `S-904 + C-904 → R-904` | 40.00 = 50.00 - 10.00 | Matched when the correction lifecycle is applied. |
| Source-only | `S-906` | 25.00 | Unresolved: expected report entry is absent. |
| Target-only | `R-999` | 25.00 | Unresolved: target entry lacks ledger support. |

The matched component is €280.00. The remaining source-only and target-only amounts offset in the grand total, creating **false agreement**: an aggregate comparison reports a €0.00 difference while two distinct business facts remain unexplained. An inner join would make the result look even safer by removing both exceptions before the total is calculated.

### Treat timing as a visible exception

| Pending item | Event time | Ledger receipt time | Position at close | Appropriate statement |
|---|---|---|---|---|
| `S-905` for `O-105`, €70.00 | 30 June, 21:55 UTC | 1 July, 00:08 UTC | Not present in the 30 June close snapshot | A legitimate pending difference until the agreed late-arrival window expires; not evidence that the settlement never occurred. |

The timing observation does not justify ignoring `S-905`. It requires a separately quantified pending population, an owner, and a revision point. A daily operational comparison may classify it as pending. A final close may require its later inclusion or explicit approval of the outstanding difference.

### Use tolerances and invariants for the right question

The example has no currency conversion or fractional allocation, so the money amount tolerance for a matched mapping is €0.00. If an approved allocation produced sub-cent rounding, a narrowly scoped tolerance—such as €0.01 per documented allocation group—could be appropriate. It would not permit a €25.00 source-only item and a separate €25.00 target-only item to be accepted because their totals cancel.

Two useful invariants are:

1. `R-903-A + R-903-B = S-903` under the documented split-allocation rule.
2. `R-904 = S-904 + C-904` when the correction is approved and belongs to the same close population.

These invariants challenge the expected relationship shape. They do not establish that the ledger itself is complete or that the accounting rule is externally correct.

### Reconciliation conclusion

The conclusion is not “reconciled” and not simply “failed.” The evidence supports €280.00 of mapped agreement across the defined relationships. It identifies €70.00 as temporally pending and identifies two €25.00 entries as unresolved despite equal source and target counts and totals. Finance may use a clearly labelled matched subpopulation for investigation or a provisional internal view if its policy permits; the full close remains unsupported until the unmatched sets are classified and the pending window is resolved. This is an explainable reconciliation result, not a green aggregate.

## Timing, Partial Reconciliation, and Tolerances

### Time changes the comparison

The same business event can have source event time, settlement time, receipt time, processing time, report time, and correction time. A reconciliation can fail legitimately if the source and target are observed at different stages of convergence.

State the comparison window and treatment of late arrivals, backfills, corrections, and prior-period adjustments. A daily operational reconciliation might classify late records as pending. A financial close may require them to be quantified and approved before sign-off. Chapter 7 develops temporal concepts; this chapter applies them to explainable difference.

### Partial reconciliation can still support a decision

**Partial reconciliation** compares the subset that is currently comparable while explicitly excluding or separately classifying records outside that boundary. It can be the right approach when a source feed is delayed, a migration is in progress, or a known exception population cannot yet be matched.

Partial reconciliation is responsible only when it states what is excluded, why, how large or consequential it is, who owns it, and when it will be revisited. It becomes misleading when “reconciled” is used without the qualifier.

### Tolerances require rationale and review

A **tolerance** is an accepted difference under a defined rule, such as approved rounding variance or expected timing delay. It should be decided before a failure is inconvenient. Document the rationale, decision owner, calculation method, population, review trigger, and response when exceeded.

Avoid using a broad tolerance to make a comparison green. If a difference is material to a customer entitlement, compliance control, or financial outcome, even a small count or amount may be unacceptable. Risk, not convenience, determines the appropriate threshold.

## False Agreement and Reconciliation Limitations

### Agreement can be accidental

False agreement occurs when a comparison appears to confirm consistency while important differences are hidden. Common causes include:

- equal counts with different keys;
- offsetting amount errors;
- identical flawed transformations on both sides;
- comparison after unmatched records are removed by an inner join;
- aggregate agreement across inconsistent markets or currencies;
- shared stale business definitions; and
- source and target both missing the same upstream population.

Treat agreement as evidence to interpret, not as proof. Stronger reconciliation uses different comparison shapes and makes exception sets inspectable.

### Reconciliation has an evidence boundary

Even a careful strategy does not prove that either system represents external reality. A ledger-to-report comparison can show internal agreement while both omit a provider feed. A source-to-target match can show that a migration copied a defect faithfully. A sampled manual review can detect semantic issues but not establish full population coverage.

State what the strategy establishes: for example, “all comparable settled card payments before the cutoff matched one eligible report entry or an approved exception; bank-transfer settlements remain pending source receipt.” This conclusion supports a decision more honestly than an unqualified pass/fail label.

> **Supporting asset (Pass 2, planned):** *Cross-System Reconciliation States* will visualise matched, source-only, target-only, explained, pending, and unresolved populations without implying that every difference is a defect.

## Designing a Cross-System Reconciliation Strategy

The following is an **original MSQE educational framing** for a reviewable strategy:

1. **State the decision and agreement claim.** Identify consumers, materiality, and the meaning of “reconciled.”
2. **Define comparable populations.** Record sources, cutoff, lifecycle, units, currencies, and exclusions.
3. **Define identity and cardinality.** Specify keys, mappings, many-to-one or one-to-many relationships, and permitted duplicates.
4. **Use complementary comparisons.** Combine counts, keyed matching, unmatched sets, totals, invariants, and safe samples proportionately.
5. **Classify exceptions.** Distinguish expected, pending, explainable, and unresolved differences with ownership and due action.
6. **State limits and risk.** Explain source gaps, shared logic, tolerance, partial coverage, and the residual decision risk.

The strategy is not a fixed checklist. It should be as rigorous as the consequence of a wrong conclusion requires.

## Engineering Perspective

Reconciliation becomes maintainable when systems preserve stable keys, source context, lifecycle state, version, time, and exception reason. These are design choices that make later evidence possible. A team should decide what cross-system comparison will be needed before a migration, new report, or integration makes differences difficult to explain.

Quality Engineers can facilitate the agreement claim and evidence design. Domain owners define legitimate exceptions and materiality. Engineers explain transformations and timing. Accountable decision makers decide whether residual differences are acceptable. This shared work is more effective than assigning reconciliation to a single role after an incident.

## Industry Perspective

Formal data-quality guidance supports the use of explicit data rules and assessment criteria. ISO/TS 8000-82 addresses data rules for assessment, while ISO/IEC 25012 provides a structured-data quality model.[^iso-8000-82][^iso-25012] Neither source defines an organisation’s financial close, mapping, or tolerance. Those must be governed by the relevant domain and made visible in the reconciliation evidence.

Across domains, reconciliation commonly relies on layered comparison: record identity, aggregate value, expected exceptions, and investigation records. The transferable practice is not a particular platform report; it is the ability to explain agreement and difference accurately.

## Common Misconceptions

### “Matching totals mean reconciliation is complete.”

Totals can match while keys, classifications, currencies, or values differ. Use totals as one complementary comparison.

### “Every unmatched record is a defect.”

Some differences are expected because of timing, reversal, correction, or defined scope. Classify rather than conceal them.

### “A tolerance makes the comparison safe.”

A tolerance is a controlled acceptance rule, not evidence that a difference is harmless. It needs rationale, owner, scope, and review.

### “Reconciliation must be one-to-one.”

Business facts can legitimately split, combine, correct, or version. The comparison must model expected cardinality rather than force a simpler relationship.

### “A successful reconciliation proves the external truth.”

It proves bounded agreement among the compared representations. It cannot prove that both sources are complete or semantically correct.

## Summary

Reconciliation compares representations in support of a decision. Meaningful agreement requires comparable populations, identities, cardinality, time, units, rules, and exceptions. Counts, keyed matches, unmatched sets, totals, balances, invariants, and tolerances each contribute bounded evidence.

The valuable result is an explainable statement of matched, pending, explainable, and unresolved differences with residual risk—not a green total. Chapter 7 will add temporal reasoning for late, repeated, corrected, and converging data.

## Key Takeaways

- Reconciliation is an agreement claim about defined populations and decisions, not a synonym for equal totals.
- Comparable definitions of identity, grain, time, unit, lifecycle, and exception handling are essential.
- Counts, matches, unmatched sets, totals, and invariants are complementary evidence mechanisms.
- Many-to-one and one-to-many relationships must be explicit to avoid misleading comparisons.
- Partial reconciliation and tolerances can be useful only when exclusions, rationale, ownership, and review triggers are visible.
- False agreement is a material risk; agreement must be interpreted within its evidence boundary.

## Review Questions

1. What must be comparable before two systems can be meaningfully reconciled?
2. Why are unmatched sets more informative than a match percentage alone?
3. How can a one-to-many relationship mislead a reconciliation total?
4. What distinguishes an explainable difference from an unresolved one?
5. When is partial reconciliation appropriate?
6. Why should tolerances be decided before a discrepancy occurs?
7. Give two examples of false agreement.
8. What does a successful reconciliation still fail to prove?

## Interview Questions

1. How would you reconcile a payment ledger with a revenue report that has different record grains?
2. What evidence would you want before accepting a finance tolerance?
3. How would you communicate a reconciliation result with pending late-arrival records?
4. Describe how you would investigate equal totals with an unexpected unmatched set.
5. What design choices make future reconciliation easier?

## Practical Exercise

### Cross-System Reconciliation Strategy: Atlas Commerce Month-End Close

**Objective:** Design a reviewable strategy for comparing Atlas Commerce settlement and reporting representations.

**Scenario:** The payment ledger and revenue report both total €2.4 million. The ledger can contain corrections; the report has one eligible record per order; some settlements arrive after the daily cutoff; and amounts may be converted from several currencies.

**Tasks:**

1. State the month-end decision, agreement claim, comparable populations, and cutoff rules.
2. Define identifiers, mapping rules, cardinality, and known correction or reversal conditions.
3. Design complementary comparisons for counts, keyed sets, amounts, aggregate dimensions, and one invariant.
4. Create an exception taxonomy with expected, pending, explainable, and unresolved categories.
5. Propose a justified tolerance and explain when it would be unacceptable.
6. Write a conclusion format that distinguishes fact, interpretation, evidence gap, residual risk, owner, and revision trigger.

**Expected artifact:** A three-page **Cross-System Reconciliation Strategy** containing scope, mapping, comparison plan, exception taxonomy, tolerance rationale, limitations, and decision communication.

**Reflection:** How could equal totals conceal an error serious enough to change the close decision?

## Further Reading

- [ISO/IEC 25012:2008 — Data Quality Model](https://www.iso.org/standard/35736.html)
- [ISO/TS 8000-82:2022 — Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html)
- [Chapter 5 — Pipeline Quality: Ingestion, Processing, Storage, and Consumers](chapter-05-pipeline-quality-ingestion-processing-storage-and-consumers.md)
- [Part VI — Data Quality Engineering](../README.md)

## References

[^iso-25012]: International Organization for Standardization. [ISO/IEC 25012:2008 — Software engineering — Software product Quality Requirements and Evaluation (SQuaRE) — Data quality model](https://www.iso.org/standard/35736.html). 2008; confirmed current by ISO catalogue, accessed 2026-08-11.
[^iso-8000-82]: International Organization for Standardization. [ISO/TS 8000-82:2022 — Data quality — Part 82: Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html). 2022; accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Define reconciliation as an agreement claim with comparable populations and a decision owner.
- [ ] Specify identities, mappings, cardinalities, cutoff rules, and exceptions before comparing results.
- [ ] Combine counts, keyed sets, aggregates, invariants, and exception classifications appropriately.
- [ ] Explain partial reconciliation, tolerance, false agreement, and residual risk.
- [ ] Produce a Cross-System Reconciliation Strategy that another engineer can inspect.
