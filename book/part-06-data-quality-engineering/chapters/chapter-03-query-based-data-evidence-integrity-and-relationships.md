# Chapter 3 — Query-Based Data Evidence, Integrity, and Relationships

## Metadata

| Field | Value |
|---|---|
| Part | Part VI — Data Quality Engineering |
| MQE-BOK domain | Domain 6 — Data Quality Engineering |
| Chapter | 3 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2; Parts I–V, or equivalent experience in quality risk, testing evidence, programming, APIs, and automation |
| Estimated study time | 120 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE educational framing:** A query result answers only the question that its population, representation, comparison, and assumptions make answerable.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. A weekly finance reconciliation finds that the reporting warehouse contains 10,042 completed orders while the payment ledger contains 10,042 settled payments. The engineer assigned to investigate sees equal counts and reports that the systems reconcile.

Later that day, a support analyst identifies a refunded order that still contributes revenue to the report. A second investigation finds that two payment records have been associated with the wrong orders. The count remains equal because one duplicated payment and one missing payment offset each other. A third issue emerges: 83 settled payments have no report row, while 83 report rows represent payment attempts that never settled.

The original query was technically correct. It answered a narrow question: both selected tables had the same number of rows after the applied filters. It did not establish that the rows represented the same business population, that keys matched, that refund treatment was equivalent, or that the aggregate value agreed.

The team replaces the conclusion with a more useful evidence plan: define the finance population, examine unmatched sets by the appropriate identifiers, compare amounts under a shared time and currency rule, sample meaningful exceptions, and state the records excluded by timing or lifecycle conditions. The queries become more valuable because the claim becomes more precise.

## Why This Chapter Matters

Queries are one of the most useful tools available to a Quality Engineer working with data. They can reveal null patterns, duplicated identifiers, orphaned relationships, inconsistent values, unexpected populations, and reconciliation differences quickly. They can also produce false confidence when a technically correct query is asked at the wrong boundary or interpreted beyond its scope.

Chapter 1 established that a data-quality claim needs a decision, consumer, population, source, oracle, limitation, and residual-risk statement. Chapter 2 showed that types, identifiers, missingness, representations, and contextual quality dimensions shape what a claim can mean. This chapter applies those foundations to query-based evidence. Its purpose is not to teach a database product, query optimiser, administration practice, or SQL certification syllabus.

The reader should leave able to explain not merely “I ran a query,” but “I used this query and comparison to assess this claim about this population; here is what it supports, what it cannot establish, and what risk remains.” Chapters 4–6 will later examine transformations, pipeline boundaries, and reconciliation in greater depth.

## Learning Objectives

By the end of this chapter, you should be able to:

- formulate a data-quality question before selecting a query;
- define the population, representation, scope, and time boundary that a query is intended to examine;
- use counts, distinct values, null analysis, duplicate detection, joins, unmatched sets, and aggregates as bounded evidence mechanisms;
- explain the role of keys and referential integrity in relationship evidence;
- distinguish equal counts from meaningful agreement across systems;
- assess query results for assumptions, oracle strength, reproducibility, and independence;
- identify ways technically correct queries create false confidence; and
- produce a Data Integrity and Relationship Analysis that states evidence limitations and residual risk.

## Start With an Evidence Question, Not Query Syntax

SQL and equivalent query languages express operations over data. They do not decide which operation is meaningful. A Quality Engineer should start with a question that connects a data condition to a decision.

Compare these prompts:

| Weak prompt | Evidence-oriented question |
|---|---|
| “Check the orders table.” | “For the finance close, do all orders recognised as settled in the payment ledger have exactly one eligible reporting record for the defined business day?” |
| “Find duplicates.” | “Within today’s finalised payment population, are there multiple records for the same settled payment identifier, and are any repetitions legitimate history or retries?” |
| “Test the join.” | “Can every eligible order be related to the customer and payment facts required to support the customer-support workflow?” |
| “Compare totals.” | “After applying the approved refund, currency, and cutoff rules, does the reporting total agree with an independently derived ledger total within the stated tolerance?” |

The stronger question makes the likely population, identifier, lifecycle state, consumer, and comparison visible. It also makes it possible to decide that a query is not the right first source of evidence.

### Define the claim and population

A **population** is the complete set of records, entities, events, or relationships to which a claim applies. Query filters define a population operationally. Business definitions define it semantically. Both are needed.

For example, “all orders for 2026-08-10” is underspecified. Does it mean:

- orders created during a UTC day or a local business day;
- orders placed, paid, settled, fulfilled, or recognised for revenue;
- orders across every market or one legal entity;
- current records only, or all historical versions;
- records known at the cutoff, or records that occurred during the period but arrived later?

Every answer changes the query and the claim. Record the chosen definition with the result. A query that is reproducible technically but has an undocumented business scope is difficult to review and unsafe to reuse.

### Filtering selects a boundary

`WHERE` clauses, join conditions, time predicates, and source-table choices determine who or what is included. They are not incidental syntax. They are evidence boundaries.

Consider this generic query:

```sql
SELECT COUNT(*) AS completed_orders
FROM orders
WHERE order_status = 'COMPLETED'
  AND completed_at >= DATE '2026-08-10'
  AND completed_at < DATE '2026-08-11';
```

Before interpreting the result, ask:

- Does `COMPLETED` mean the business state needed by the decision?
- Is `completed_at` event time, processing time, or a later update time?
- Which time zone and calendar define the date literals?
- Does the table contain one current row per order, multiple versions, or events?
- Are cancelled, refunded, test, migrated, or cross-market orders deliberately included or excluded?

The query may be correct for one claim and irrelevant to another. The code block is illustrative generic SQL; exact date syntax and functions vary by database product. The transferable practice is to make selection semantics and assumptions explicit.

## Counts, Distinct Values, and Null Analysis

### Counts describe selected rows, not automatically business entities

`COUNT(*)` counts rows in the selected result. It does not necessarily count orders, customers, payments, or unique events. A table may contain line items, history, snapshots, retries, or duplicate deliveries. A join can multiply rows when one-to-many relationships are combined.

When a question concerns business entities, use a defined identifier and confirm the representation:

```sql
SELECT COUNT(DISTINCT order_id) AS distinct_orders
FROM order_events
WHERE event_type = 'PAYMENT_SETTLED'
  AND event_recorded_at >= :start_time
  AND event_recorded_at < :end_time;
```

This query can support a statement about distinct `order_id` values in the selected event records. It does not establish that every order has exactly one settlement, that `order_id` is the appropriate reconciliation key, that all events arrived, or that the event time reflects the finance cutoff. A distinct count is a useful observation, not a universal correctness claim.

### `COUNT(column)` and missingness need interpretation

In standard SQL semantics, `COUNT(column)` counts non-null values for the selected expression, whereas `COUNT(*)` counts rows. That difference can help reveal missingness:

```sql
SELECT
  COUNT(*) AS selected_rows,
  COUNT(promised_delivery_at) AS populated_promises,
  COUNT(*) - COUNT(promised_delivery_at) AS null_promises
FROM orders
WHERE order_status IN ('PAID', 'FULFILMENT_PENDING');
```

The result can show how many selected rows have a database null in `promised_delivery_at`. It cannot explain why the value is null, whether a sentinel value is used instead, whether the population should contain a promise at that lifecycle stage, or whether an optional field is appropriate. Chapter 2’s representation analysis is needed before treating null counts as a defect measure.

### Distinct-value profiles reveal questions, not conclusions

A grouped query can make unexpected codes, formats, or concentrations visible:

```sql
SELECT delivery_status, COUNT(*) AS order_count
FROM orders
WHERE created_at >= :start_time
  AND created_at < :end_time
GROUP BY delivery_status
ORDER BY order_count DESC;
```

This is often a useful exploratory observation. An unexpected value could reveal an unhandled producer version, a migration issue, a valid newly introduced state, or a filtering error. Do not label it invalid until an owned domain definition or business rule supports that judgement.

## Keys, Uniqueness, and Duplicate Evidence

### State the identifier and scope before searching for duplicates

Duplicates are not simply repeated values. They are unintended repetitions according to a defined identity, population, and lifecycle expectation. A history table can contain many rows for one customer by design. An event stream can contain a replayed event by design. A current payment ledger may require exactly one row per settlement identifier.

Start with a claim such as: “For finalised card settlements received during the finance period, each `settlement_id` appears at most once in the current payment ledger.” The claim identifies the key, scope, state, and expected cardinality.

```sql
SELECT settlement_id, COUNT(*) AS occurrence_count
FROM payment_ledger
WHERE settlement_state = 'FINAL'
  AND settled_at >= :start_time
  AND settled_at < :end_time
GROUP BY settlement_id
HAVING COUNT(*) > 1;
```

This query can identify repeated non-null `settlement_id` values in the selected ledger population. It does not decide whether the repeated records are defects. Investigate whether the table retains history, whether one row is a correction, whether the same identifier is valid across payment providers, or whether a technical import duplicated a record.

### Key quality includes more than uniqueness

A key should be stable enough for its consumer purpose, populated where required, scoped appropriately, and preserved across transformations. A generated identifier may be unique but not comparable across source and target systems. A natural business key may be meaningful but change when a customer updates an account. A composite key may be necessary where no single field identifies the fact.

Quality evidence should therefore document:

- the identity being asserted—order, order version, payment attempt, settlement, event, or report row;
- the key or key combination used;
- expected uniqueness or cardinality;
- the population and time boundary;
- known exception types; and
- how the key is preserved or mapped across systems.

This information allows another engineer to challenge whether the duplicate query assessed the intended entity rather than merely a convenient column.

## Relationships and Referential Integrity

### Relationships are evidence about connected facts

Data systems represent related facts through keys, references, mappings, and joins. **Referential integrity** is the condition that a child’s reference resolves to an appropriate parent according to the model’s rules. A relationship can be technically present but still unsuitable for the claim: the parent may be from a different tenant, wrong version, invalid lifecycle state, or mismatched currency.

For a support workflow, an order may need a customer, payment, shipment, and address context. For finance, an order may need an eligible payment settlement and refund treatment. The relationship requirements differ with the decision consumer.

### Use joins to ask a relationship question

An outer join can identify selected child records without a matching parent:

```sql
SELECT o.order_id, o.payment_id
FROM orders AS o
LEFT JOIN payments AS p
  ON p.payment_id = o.payment_id
WHERE o.order_status = 'COMPLETED'
  AND p.payment_id IS NULL;
```

This query can identify selected completed orders whose `payment_id` has no matching payment row under the join condition. It does not establish that every completed order should have a payment, that the payments table contains the appropriate historical snapshot, or that a matching row represents a settled and eligible payment. If `payment_id` can be null, that state requires separate interpretation rather than being treated automatically as an orphan.

### Unmatched sets are often more useful than a single percentage

Teams often report “99.8% match rate.” Such a measure can be useful, but it can obscure the business significance of the non-matching set. Ten unmatched high-value orders may matter more than thousands of low-risk test records. A percentage also hides whether records are late, filtered, mapped under a different identifier, duplicated, or genuinely absent.

An **unmatched set** is the defined collection of records that should relate under a stated rule but do not. Preserve enough information to classify it: identifiers, source and target states, relevant time values, amount or category where appropriate, and the reason code or investigation outcome. This converts a summary signal into evidence that can improve the system.

### Beware join multiplication and accidental loss

Joins can change the shape of a population. Joining orders to line items can produce multiple rows per order. An inner join removes unmatched rows, which may hide the very condition under investigation. Filtering a right-side table in a `WHERE` clause after a left join can unintentionally make the operation behave like an inner join in many SQL formulations.

These are not merely SQL mistakes. They are evidence-quality risks. Before comparing counts or totals after a join, inspect expected cardinality:

| Relationship | Expected cardinality for the claim | Evidence risk |
|---|---|---|
| Order to current customer | Many orders to one customer | A missing customer can be hidden by an inner join. |
| Order to line item | One order to many lines | Row counts and order totals can be multiplied. |
| Payment settlement to finance record | One settlement to one recognised entry, under stated rules | Corrections or split settlements require explicit exceptions. |
| Event to current order state | Many events to one order | Latest-state selection must define ordering and time. |

State the expected relationship before trusting an aggregate that follows it.

## Expected and Observed Populations

### Reconciliation begins with comparable definitions

Reconciliation compares two representations or calculations to determine whether they agree according to a defined rule. It is not the act of placing two counts beside each other. For the comparison to be meaningful, source and target need compatible population definitions, identifiers or mappings, time windows, units, lifecycle states, and exception handling.

Suppose finance expects all settled payments to appear once in the revenue report. The **expected population** might be payment-ledger records settled before the close cutoff, excluding explicit reversals. The **observed population** might be report records generated from eligible orders using the same cutoff and refund rule. If the target report uses order-created time instead of settlement time, equal counts do not establish equivalence.

### Use several complementary comparisons

Counts can detect large-scale differences. They are rarely sufficient alone. A proportionate reconciliation may use:

- **count comparison** to identify broad population differences;
- **keyed matching** to identify records that are missing, extra, or mapped differently;
- **amount or aggregate comparison** to detect financial or quantitative discrepancies;
- **business invariants** to test relationships or conservation rules; and
- **exception classification** to distinguish expected timing differences from defects.

For example, an aggregate comparison can be expressed generically as:

```sql
SELECT
  currency_code,
  SUM(recognised_amount) AS report_total
FROM daily_revenue_report
WHERE report_date = DATE '2026-08-10'
GROUP BY currency_code;
```

The query supports a total per `currency_code` for the selected report date. Before comparing it with a ledger total, establish whether amounts have the same currency treatment, rounding rule, inclusion criteria, cutoff, and duplication behaviour. Equal totals can conceal offsetting errors; unequal totals can represent expected late-arrival or adjustment rules.

### Tolerances must be justified

A **tolerance** is an explicitly accepted difference between expected and observed results. It may be appropriate for rounding, timing windows, known provider delays, or statistical sampling. A tolerance is not a way to make a failing comparison pass without investigation.

Document why the tolerance exists, which decision accepts it, how it is calculated, who owns it, and when it should be reviewed. For a customer entitlement, a tolerance of one missing record may be unacceptable. For an aggregate with defined rounding, a small amount tolerance may be appropriate. Context determines the trade-off.

## Query Results Need Interpretation and Independent Evidence

### A technically correct query can still answer the wrong question

False confidence commonly arises when:

- the query uses a convenient table rather than the authoritative source;
- filters select an unintended lifecycle state or time zone;
- a join removes unmatched records or multiplies rows;
- a distinct count substitutes for a business population definition;
- the expected result is generated by the same flawed transformation as the actual result;
- a snapshot is compared with a current-state table without accounting for time; or
- a green result is repeated after inputs, rules, or consumer needs have changed.

These failures are often quiet. The syntax is valid; the database returns rows; the total looks plausible. Quality Engineering adds the explanation that allows a reviewer to see whether the answer matches the claim.

### Strengthen evidence with independence

An **independent oracle** challenges an observation through a sufficiently separate source, rule, calculation, or reasoning path. Complete independence is not always possible. The aim is to identify shared assumptions and choose diversity that is proportionate to the risk.

If a reporting transformation and its automated check both call the same revenue-calculation helper, agreement is useful as a regression signal but weak evidence that the business formula is correct. An independently calculated sample, a controlled source-to-target reconciliation, a reviewed accounting rule, or a downstream invariant can provide additional challenge.

Independence should be described honestly. Rewriting the same flawed formula in a different query language may produce superficial diversity without changing the underlying business assumption.

### Reproducibility makes evidence reviewable

**Reproducibility** means that another engineer can rerun or inspect the evidence process with the relevant scope, source version, parameters, and interpretation. Reproducibility is not a promise that every rerun will return the same result in a changing production system. It is a record of enough context to explain why a result was obtained and how it can be reassessed.

For each material query-based result, preserve:

| Evidence element | Example |
|---|---|
| Claim and decision | Does the finance report represent settled revenue for the stated close? |
| Source and representation | Payment-ledger snapshot and report table, with extraction time recorded |
| Population definition | Settled payments before cutoff; reversals excluded by approved rule |
| Query or query reference | Versioned query with parameters and database dialect noted |
| Oracle or comparison | Ledger-to-report keyed match plus independent amount calculation |
| Observation | Unmatched set, total difference, or confirmed agreement |
| Limitations | Late provider files, unresolved currency exception, sampled mappings |
| Conclusion and risk | Supported decision, owner, next action, and residual risk |

Avoid recording sensitive production data in an unsafe location. Preserve parameterisation, aggregate results, safe identifiers, and access-controlled evidence according to organisational policy.

> **Supporting asset (Pass 2, planned):** *Query Evidence and Relationship Boundaries* will illustrate population selection, join cardinality, unmatched sets, oracle choice, and conclusion limits.

## A Data Integrity and Relationship Analysis

The following **original MSQE educational framing** provides a compact method for applying queries as evidence:

1. **State the consumer decision and claim.** Name the relevant business fact, lifecycle state, and time window.
2. **Define expected and observed populations.** Record sources, identifiers, inclusions, exclusions, and representation differences.
3. **Choose relationship and key expectations.** Specify cardinality, referential requirements, permitted exceptions, and lifecycle timing.
4. **Select complementary evidence.** Use counts, distinct values, null analysis, unmatched sets, aggregates, or samples only where each answers a needed question.
5. **Challenge the oracle.** Identify shared logic, stale definitions, source weaknesses, and conditions not represented by the query.
6. **Interpret and communicate.** Report supported conclusions, exception categories, limitation, residual uncertainty, residual risk, owner, and next action.

The method does not reward query volume. One well-scoped unmatched-set analysis may be more valuable than dozens of generic row checks.

## Engineering Perspective

Query-based evidence should be treated as a small, reviewable engineering artefact. It benefits from clear naming, version control where practical, parameterised boundaries, source traceability, peer review, safe handling of sensitive data, and explanation of assumptions. A query copied into a chat thread without context may help initial exploration but is weak evidence for a consequential decision.

Quality Engineers should collaborate with domain owners and data engineers rather than attempt to infer every business rule from table names. The Quality Engineer contribution is to make the evidence question, population, oracle, limitations, and decision implications clear. Deep data-platform operation, optimisation, scheduling, and cloud implementation remain outside this chapter and belong to the appropriate specialists and later handbook parts.

## Industry Perspective

Data rules are more useful when they are traceable to an agreed information need and can be evaluated consistently. ISO/TS 8000-82 addresses the creation of data rules for data-quality assessment.[^iso-8000-82] ISO/IEC 25012 provides a general model for structured-data quality.[^iso-25012] These sources support disciplined vocabulary and rule design; they do not prescribe a universal query suite, reconciliation threshold, or database technology.

Relational systems offer constraints and query operations that can contribute useful integrity evidence. Their effectiveness still depends on model, lifecycle, source, and consumer context. A foreign key, for example, can protect a defined relationship at one storage boundary but cannot by itself prove that every downstream representation or business interpretation is correct.

## Common Misconceptions

### “Equal counts mean the systems reconcile.”

Equal counts can hide missing, extra, duplicated, offsetting, or differently classified records. Meaningful reconciliation needs comparable populations, keys, and rules.

### “`COUNT(DISTINCT id)` proves there are no duplicates.”

It reports the number of distinct non-null identifier values in the selected result. It does not decide whether the identifier is the correct key, whether nulls are acceptable, or whether duplicates are legitimate history.

### “An inner join is the cleanest way to compare related data.”

An inner join omits unmatched records. That may be appropriate for a defined claim, but it can hide relationship failures when the question concerns missing matches.

### “A query result is objective, so interpretation is optional.”

The result is objective about the selected operation and returned data. Population definitions, sources, time boundaries, key semantics, and conclusions still require judgement.

### “More SQL proves stronger Data Quality Engineering.”

SQL fluency is valuable. Data Quality Engineering requires the additional ability to choose meaningful questions, sources, comparisons, limitations, and actions.

## Summary

Querying is a powerful way to obtain data-quality evidence when it begins with a decision-relevant claim. Counts, distinct values, null analysis, duplicate detection, joins, unmatched sets, and aggregates each answer bounded questions about a defined representation and population. They become misleading when their filters, keys, cardinality, time boundary, source, or oracle are assumed rather than stated.

The professional outcome is not a larger SQL script. It is a reproducible Data Integrity and Relationship Analysis that another engineer can inspect, challenge, and use in a decision. The next delivery will extend this reasoning to transformation quality, pipeline boundaries, and reconciliation.

## Key Takeaways

- Start with a data-quality claim and population definition before writing a query.
- Filters, source choices, time predicates, and joins are evidence boundaries, not incidental syntax.
- Counts and distinct values describe selected results; they do not automatically represent business entities or correctness.
- Uniqueness and referential integrity must specify the identity, scope, lifecycle, relationship, and permitted exceptions.
- Equal counts are insufficient evidence of cross-system agreement; use complementary comparisons and exception analysis.
- Query results need a suitable oracle, independence assessment, reproducibility record, and limitation statement.
- Technically correct SQL can create false confidence when it answers the wrong question or hides unmatched, multiplied, stale, or semantically different data.

## Review Questions

1. What information should be defined before a query result is used to support a data-quality claim?
2. Why does `COUNT(*)` not necessarily count business entities?
3. What can a null analysis establish, and what questions does it leave unanswered?
4. Why is duplicate detection incomplete without a key, scope, and lifecycle expectation?
5. How can an inner join hide the relationship condition you intend to investigate?
6. Explain why equal counts can coexist with meaningful reconciliation failures.
7. What makes an oracle independent enough to challenge a transformation result?
8. Which context should be retained so that a material query result is reproducible and reviewable?

## Interview Questions

1. How would you design evidence for a claim that every settled payment appears once in a daily report?
2. A database query shows no duplicate identifiers. What follow-up questions would you ask before declaring the data clean?
3. Describe a time when a join or aggregate could produce a plausible but misleading result.
4. How would you investigate an unmatched set without assuming it is automatically a defect?
5. How do you explain the difference between SQL skill and Data Quality Engineering capability?

## Practical Exercise

### Data Integrity and Relationship Analysis: Atlas Commerce Finance Close

**Objective:** Produce a bounded, query-based evidence plan for the reconciliation concern in the opening story.

**Scenario:** Atlas Commerce provides these fictional representations for the 2026-08-10 finance close:

| Representation | Key fields | Known condition |
|---|---|---|
| Payment ledger | `settlement_id`, `order_id`, `settled_at`, `settled_amount`, `currency_code`, `settlement_state` | A settlement may have later correction records. |
| Revenue report | `report_row_id`, `order_id`, `recognised_at`, `recognised_amount`, `currency_code`, `refund_state` | One row may be produced per eligible order. |
| Order history | `order_id`, `order_status`, `completed_at`, `market` | Contains several history versions for some orders. |
| Investigation note | Both ledger and report have 10,042 selected rows | 83 payment records and 83 report rows may not represent the same orders. |

**Constraints:** Use generic SQL or structured pseudocode only. Do not assume that equal counts prove reconciliation, that a missing match is automatically a defect, or that one table is authoritative for every fact.

**Tasks:**

1. State the finance decision, the reconciliation claim, and the expected and observed populations.
2. Define the candidate identifiers, expected cardinalities, time rules, and lifecycle conditions that must be clarified.
3. Propose concise queries or query outlines for: selected counts, distinct settlement/order identities, unmatched sets in both directions, duplicate or correction candidates, and an amount comparison.
4. For every query, state what it can support and one important thing it cannot prove.
5. Identify an independent oracle or complementary evidence source and explain any shared-logic risk.
6. Design an exception classification for the 83-versus-83 discrepancy and write a short residual-risk statement for finance.

**Expected artifact:** A two- to three-page **Data Integrity and Relationship Analysis** containing a claim, population definitions, key/relationship map, query-evidence table, exception taxonomy, oracle assessment, and residual-risk statement.

**Reflection:** Which proposed query would be easiest to write but weakest for the finance decision? What additional definition or comparison would strengthen it?

**Portfolio relevance:** This artefact demonstrates population reasoning, relationship analysis, and calibrated use of SQL. Use fictional or safely anonymised information only; do not expose production identifiers, payments, credentials, or confidential business data.

## Further Reading

- [ISO/IEC 25012:2008 — Data Quality Model](https://www.iso.org/standard/35736.html)
- [ISO/TS 8000-82:2022 — Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html)
- [IEEE Computer Society, *Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a*](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf)
- [Part III — Software Testing Engineering](../../part-03-software-testing/README.md)
- [Part VI — Data Quality Engineering](../README.md)

## References

[^iso-25012]: International Organization for Standardization. [ISO/IEC 25012:2008 — Software engineering — Software product Quality Requirements and Evaluation (SQuaRE) — Data quality model](https://www.iso.org/standard/35736.html). 2008; confirmed current by ISO catalogue, accessed 2026-08-11.
[^iso-8000-82]: International Organization for Standardization. [ISO/TS 8000-82:2022 — Data quality — Part 82: Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html). 2022; accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Formulate a decision-relevant data-quality question before selecting a query.
- [ ] Define the population, source, representation, key, time boundary, and lifecycle conditions for a query result.
- [ ] Explain what counts, distinct values, null analysis, joins, unmatched sets, and aggregates can and cannot establish.
- [ ] Identify join-cardinality, source, oracle, and shared-logic risks that can create false confidence.
- [ ] Produce a reproducible Data Integrity and Relationship Analysis with limitations and residual risk.
