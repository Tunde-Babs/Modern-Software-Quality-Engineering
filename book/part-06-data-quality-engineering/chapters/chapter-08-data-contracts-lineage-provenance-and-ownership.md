# Chapter 8 — Data Contracts, Lineage, Provenance, and Ownership

## Metadata

| Field | Value |
|---|---|
| Part | Part VI — Data Quality Engineering |
| MQE-BOK domain | Domain 6 — Data Quality Engineering |
| Chapter | 8 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–7; Parts I–V, or equivalent experience |
| Estimated study time | 110 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE educational framing:** Data becomes more trustworthy when a consumer can inspect what it means, where it came from, what changed it, and who can resolve uncertainty.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. A new marketplace supplier begins sending a product category value of `PRE_ORDER`. The ingestion service accepts the event because the schema permits a string. The product dashboard groups unknown values into `Other`, while the inventory report excludes them from available-stock calculations.

Each consumer behaves according to a local rule, but no shared data expectation states whether `PRE_ORDER` represents a sellable item, an unavailable item, or a new lifecycle category requiring explicit treatment. A customer sees a product advertised as available while the warehouse cannot fulfil it. The source team says the event was valid; the consumers say they were not informed of the semantic change.

The investigation also reveals that the dashboard cannot show which supplier file, mapping version, or product-rule version produced a value. Engineers know the records passed through several transformations, but cannot quickly trace the specific path for an affected item.

The corrective action requires more than a schema change. Atlas Commerce needs explicit producer-consumer expectations, a traceable account of data origin and transformation, clear ownership of the definition, and an escalation path when evidence is insufficient.

## Why This Chapter Matters

Data crosses trust boundaries. A producer may know how a source field is created; a consumer may rely on a transformed representation without knowing its limitations. A schema can specify shape, but not necessarily business meaning, acceptable delay, ownership, correction policy, or consumer impact.

This chapter introduces bounded data contracts, lineage, provenance, ownership, and stewardship as tools for making those boundaries inspectable. It extends Part IV’s interface-contract thinking to data meaning and history without repeating API protocol strategy. It does not prescribe a lineage platform, enterprise data-governance programme, or organisation-wide operating model.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish structural schema expectations from semantic, temporal, and consumer expectations;
- describe a proportionate data contract between a producer and consumer;
- explain lineage and provenance and use W3C PROV concepts as transferable vocabulary where helpful;
- identify authoritative sources, transformation boundaries, ownership, stewardship, and escalation needs for a data claim;
- assess how change communication and evidence gaps affect consumer risk; and
- produce a Data Trust Boundary and Ownership Review that identifies sources, ownership, and actionable evidence gaps.

## Data Contracts Are Shared Expectations

A **data contract** is an explicit, reviewable agreement about data exchanged or relied on across a boundary. It may be documented in a specification, versioned schema, rule set, interface agreement, or operational record. The important point is not the format; it is that producers and consumers can inspect the expectations that support a decision.

### Structural expectations are necessary but incomplete

Structural expectations can specify field names, types, requiredness, identifier format, allowed values, and relationship shape. They are valuable for detecting incompatible or malformed data. The opening story demonstrates their limit: a field typed as string can accept a new value while breaking a consumer’s business interpretation.

Add the expectations that the consumer actually needs:

| Expectation type | Product-category example | Evidence question |
|---|---|---|
| Structural | `category_status` is present and from a controlled representation | Can producer and consumer parse it? |
| Semantic | `PRE_ORDER` means not currently fulfilment-eligible | Do consumers interpret the value consistently? |
| Temporal | A status change is available within the agreed operational window | Can inventory act before a customer-facing claim becomes stale? |
| Ownership | Marketplace domain owns category meaning; inventory owns fulfilment treatment | Who resolves an ambiguous or new value? |
| Evolution | New values require communication and consumer-impact review | How does a compatible change avoid semantic breakage? |
| Quality evidence | Unknown values are counted, retained, and classified | Can a team see whether the contract is being met? |

This is not a request for a lengthy contract for every field. Apply detail where ambiguous, changing, or consequential data crosses a boundary.

### Contract changes need consumer impact analysis

A change can be structurally compatible and semantically disruptive. Adding an optional field may be harmless. Adding a new enum value, changing a default, changing a unit, redefining a metric, or altering a freshness guarantee can change downstream decisions.

Before a material change, identify affected consumers, their representations, the source-of-truth rule, historical treatment, test or evidence plan, communication channel, and rollback or correction path. This is a data-quality review, not a requirement to centralise every team’s delivery process.

## Worked Example: A Compatible `PRE_ORDER` Change That Is Not Semantically Safe

The following illustrative example concerns Atlas Commerce, a fictional retailer. A marketplace supplier changes its product-status contract from Version N to Version N+1. The change does not alter the field type, so a structural compatibility check passes. The consumer question is whether that is enough to continue making the same product and fulfilment decisions.

| Contract element | Version N | Version N+1 |
|---|---|---|
| Structural representation | `category_status` is a non-null string. | Unchanged. Existing consumers can parse the field. |
| Published semantic values | `AVAILABLE` means sellable and fulfilment-eligible now; `UNAVAILABLE` means not sellable. | Adds `PRE_ORDER`: may be purchased for future delivery but is **not** fulfilment-eligible until its stated release condition. |
| Producer expectation | Supplier sends only the two established meanings. | Supplier sends `PRE_ORDER` with an expected release date and assumes consumers preserve the distinction. |
| Existing consumer assumption | Unknown strings are grouped into `Other`; storefront eligibility is derived from a separate `purchasable` flag. | This assumption is unsafe: grouping the value does not decide whether a customer may expect immediate shipment. |
| Required consumer treatment | Storefront and inventory share the established meanings. | Storefront must communicate future availability; inventory must exclude it from immediate allocation; reporting must define whether it belongs in available-product metrics. |

The compatibility question has two parts. **Can the consumer read Version N+1?** Yes: the string remains parseable. **Can the consumer preserve the intended business meaning?** Not without a new semantic rule and consumer-impact review. A schema registry, if one exists, may report compatibility while the customer experience remains misleading.

Before adoption, the Marketplace Product owner, Atlas catalogue-transformation owner, and consumer owners should agree the semantic rule, effective date, fallback, and communication route. Proportionate evidence includes a versioned supplier sample, a traceable mapping outcome for `PRE_ORDER`, consumer-view observations, an unknown-value count, and confirmation that the release-date representation supports the proposed fulfilment rule. The point is not to certify every field. It is to establish that the affected consumer decisions can distinguish a pre-order from an immediately shippable product.

### Trace a consumer-visible result through provenance

An investigator asks: *Why did product `P-440` appear available to a shopper while the fulfilment view excluded it?* The following trace uses W3C PROV concepts as vocabulary, not as a tooling requirement.

| PROV concept | Illustrative item | Investigation value |
|---|---|---|
| **Entity** | Supplier product event `E-supplier-440`, containing `category_status = PRE_ORDER`, source contract Version N+1, and release date. | Identifies the source representation that must be interpreted. |
| **Activity** | Ingestion activity `A-ingest-77` receives the event, retains the source identifier and contract version, and generates a canonical product record. | Establishes how and when Atlas obtained the source fact. |
| **Entity** | Canonical product entity `E-catalogue-440`, carrying the source version and mapped product state. | Connects the source fact to downstream transformation input. |
| **Activity** | Catalogue-mapping activity `A-map-3.2` applies mapping version `3.2`, setting `purchasable = true` while the inventory rule excludes `PRE_ORDER` from immediate allocation. | Makes the semantic split and applied rule reviewable. |
| **Entity** | Storefront listing `E-storefront-440` displays “Available”; fulfilment view displays “not allocatable.” | Shows the two consumer representations that require a decision. |
| **Agent** | Supplier catalogue team is responsible for the Version N+1 meaning; Atlas catalogue team is responsible for `A-map-3.2`; storefront and inventory owners are responsible for safe consumer treatment. | Makes the evidence gap and escalation route actionable. |

In W3C PROV terms, activities use and generate entities, while agents are associated with responsibility for activities. The trace does not prove that Version N+1 is the right business policy. It does show where the differing consumer outcomes arose and which version, owner, and decision must be reviewed.

The immediate engineering decision is to treat `PRE_ORDER` as a controlled semantic change: preserve it explicitly, prevent a generic fallback from implying immediate availability, communicate the rule to affected consumers, and retain an evidence trail for adoption. That response is more useful than either rejecting every unknown value forever or accepting every parseable value as safe.

## Lineage and Provenance

### Lineage explains the data path

**Lineage** describes how data moves through sources, transformations, stores, and consumers. It answers questions such as: Which source produced this report field? Which transformation selected it? Which version or rule was applied? Which downstream report uses it?

Lineage can be broad, such as a high-level map from supplier feed to dashboard, or narrow, such as a trace of one revenue figure through source, calculation, and report. The appropriate depth follows the decision risk. A finance correction may need narrow traceability; a low-risk exploratory dataset may need a concise source description.

### Provenance explains origin and derivation context

**Provenance** is information about the origin, derivation, and history of a data representation. W3C PROV supplies transferable concepts including **entities** (things such as data records), **activities** (processes that use or generate them), and **agents** (people, organisations, or software responsible for activities).[^w3c-prov]

These concepts can improve a review without imposing a particular tooling model. For the `PRE_ORDER` dashboard value, provenance may identify the supplier event entity, ingestion activity, product-classification transformation, mapping version, and responsible domain. The consumer can then investigate a surprising result without treating a dashboard label as an unexplained fact.

### Lineage and provenance do not prove correctness

Traceability can show how a result was produced. It does not establish that the source fact, mapping rule, or business interpretation is correct. A perfectly traceable defect remains a defect. Treat lineage and provenance as evidence-enabling capabilities: they make assumptions, change, and ownership easier to inspect and challenge.

## Authority, Ownership, and Stewardship

### Authority is claim-specific

An **authoritative source** is accepted as the source of a defined fact in a defined context. It may be the supplier for an original category designation, the product domain for internal sellability interpretation, or the inventory domain for fulfilment eligibility. One system is not necessarily authoritative for every consumer claim.

When sources disagree, do not resolve conflict by choosing the most convenient table. Record which fact each source owns, which transformation applies, which consumer decision is affected, and who is accountable for the decision or correction.

### Ownership makes uncertainty actionable

**Ownership** identifies who is accountable for defining, changing, operating, or resolving a data concern. **Stewardship** is the ongoing care that helps maintain understandable, usable data, often through definitions, quality rules, change communication, and issue coordination. One person or team may hold both roles; the terms need not create a new organisational hierarchy.

A bounded review should identify at least:

- producer owner for source meaning and emission;
- consumer owner for decision use and safe fallback;
- transformation or pipeline owner for mapping and exception path;
- business owner for material rule interpretation; and
- escalation route for an unresolved conflict or evidence gap.

This information prevents a quality finding from becoming an unowned cross-team discussion.

### Trust boundaries need visible assumptions

A **trust boundary** is a point at which a consumer relies on data, behaviour, or evidence produced by another system, team, or process. Trust is not binary. A consumer may trust a source for identifier format but not for currentness; trust a transformation for structural mapping but need independent reconciliation for financial totals.

State the assumption, evidence, limitation, owner, and action if the assumption fails. This makes a boundary review useful without demanding that a Quality Engineer certify every upstream system.

## Change, Evidence Gaps, and Escalation

### Change communication is a quality control

An uncommunicated semantic change is a common source of data harm. A producer can change a field while consumers continue to parse it successfully but make the wrong decision. Change communication should be proportionate to impact and include the change, effective time, affected population, consumer action, compatibility or fallback rule, evidence of safe interpretation, and contact or owner.

Consumer teams also have responsibility: a fallback that groups unknown values into a generic category may be safe for display but unsafe for fulfilment. The contract should make that limitation visible rather than imply that producer compatibility guarantees consumer correctness.

### Evidence gaps deserve an explicit state

An **evidence gap** is a material question that available sources, rules, or traces cannot answer. For example, Atlas Commerce may not know whether a historical `PRE_ORDER` record was intentionally excluded from fulfilment or dropped by a mapping. Do not invent certainty or silently classify it as normal. Record the gap, likely impact, owner, interim decision, and revision trigger.

An escalation is justified when the gap affects a consequential consumer decision, cannot be resolved within agreed ownership, or indicates a systemic contract or lineage weakness. Escalation is not blame; it is a way to make risk and accountability visible.

## A Data Trust Boundary and Ownership Review

The following is an **original MSQE educational framing**:

1. Name the consumer decision and data claim.
2. Identify producer, transformation, store, and consumer boundaries.
3. Record structural, semantic, temporal, ownership, and evolution expectations.
4. Identify authoritative sources, lineage/provenance evidence, and unsafe assumptions.
5. Define owners, stewardship activities, communication route, and escalation path.
6. State evidence gaps, interim limitation, residual risk, and revision trigger.

This review is not an enterprise governance assessment. It is a focused engineering artefact for a decision-relevant boundary.

> **Supporting asset (Pass 2, planned):** *Data Trust Boundary Review* will trace a fictional supplier category from producer through transformation to inventory and customer-facing consumers, showing contract and provenance questions.

## Engineering Perspective

Systems become easier to assess when they preserve version, source identifier, transformation context, meaningful error reasons, and safe links to ownership. These choices allow an investigation to move from “the dashboard is wrong” to an inspectable claim about source, mapping, consumer impact, and corrective action.

Quality Engineers do not need to own every data definition. They help identify where implicit contracts and unclear lineage create risk, ensure limitations reach decision makers, and facilitate proportionate evidence across team boundaries.

## Industry Perspective

W3C PROV provides a vendor-neutral data model for representing provenance and its core concepts.[^w3c-prov] ISO/TS 8000-82 supports data-quality assessment through explicit rules.[^iso-8000-82] These standards and specifications inform terminology; they do not prescribe an enterprise catalogue, governance structure, or technology selection.

## Common Misconceptions

### “A schema is the complete data contract.”

It captures structural expectations, not necessarily business meaning, freshness, ownership, consumer consequence, or change policy.

### “Lineage proves that data is correct.”

It explains origin and transformation history. It can make defects easier to diagnose, but it does not validate source truth or rule interpretation.

### “One team should own all data quality.”

Ownership must be explicit, but source meaning, transformation behaviour, consumer use, and decision accountability are distributed by nature.

### “A compatible change is safe for consumers.”

Adding a value or default can preserve parsing while breaking semantics. Assess consumer impact.

### “Governance means a large central programme.”

This chapter uses bounded ownership, definitions, evidence, and escalation to support a specific engineering decision.

## Summary

Data contracts make producer-consumer expectations explicit. Lineage and provenance make origin and derivation inspectable. Authority, ownership, stewardship, and escalation make evidence gaps actionable. Together, they help a consumer understand what data means, how it changed, who can resolve uncertainty, and what risks remain.

The next chapter applies the same reasoning to analytics, metrics, and reporting claims.

## Key Takeaways

- Structural compatibility is insufficient when semantic, temporal, or consumer expectations change.
- A data contract should make the expectations that matter to a consumer decision reviewable.
- Lineage describes data paths; provenance records origin and derivation context; neither proves correctness alone.
- Authority is claim-specific, and ownership should make ambiguity and correction actionable.
- Trust boundaries need explicit assumptions, evidence, limitations, and escalation routes.
- Change communication and evidence-gap records protect consumers from silent semantic failure.

## Review Questions

1. How does a data contract differ from a schema?
2. What does W3C PROV mean by entity, activity, and agent?
3. Why is an authoritative source claim-specific?
4. What ownership information is needed when a data-quality concern spans teams?
5. How can a compatible enum change create consumer harm?
6. Why is lineage useful even though it does not prove correctness?
7. What should an evidence-gap record contain?
8. How does a trust-boundary review avoid becoming a full governance programme?

## Interview Questions

1. How would you respond when a producer says a new field value is valid but a consumer reports harm?
2. What information would you want to trace a surprising dashboard value back to its source?
3. How do you establish ownership for a cross-system data-quality defect?
4. Describe an example of a semantic contract change that would not be caught by schema validation.
5. When should a data-quality evidence gap be escalated?

## Practical Exercise

### Data Trust Boundary and Ownership Review: Atlas Commerce Product Status

**Objective:** Make the `PRE_ORDER` consumer-impact problem inspectable without creating an enterprise governance programme.

**Scenario:** A marketplace supplier emits `category_status`; a product transformation maps it to internal values; the dashboard groups unknown values into `Other`; inventory excludes them. No consumer-impact analysis was performed for `PRE_ORDER`, and the affected records cannot currently be traced to transformation version.

**Tasks:**

1. State the relevant consumer decisions and quality claims for dashboard and inventory use.
2. Define structural, semantic, temporal, ownership, and evolution expectations for the boundary.
3. Identify authoritative sources, lineage/provenance information needed, and current evidence gaps.
4. Assign bounded producer, transformation, consumer, business-rule, and escalation responsibilities.
5. Propose a change-communication and fallback policy that preserves uncertainty safely.
6. Write a residual-risk statement and revision trigger.

**Expected artifact:** A two- to three-page **Data Trust Boundary and Ownership Review** containing expectation table, source/lineage map, ownership and escalation path, evidence gaps, consumer impact, and residual risk.

## Further Reading

- [W3C PROV-DM: The PROV Data Model](https://www.w3.org/TR/prov-dm/)
- [ISO/TS 8000-82:2022 — Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html)
- [Chapter 7 — Batch, Streaming, and Temporal Data Quality](chapter-07-batch-streaming-and-temporal-data-quality.md)
- [Chapter 9 — Analytics, Metrics, and Reporting Integrity](chapter-09-analytics-metrics-and-reporting-integrity.md)

## References

[^iso-8000-82]: International Organization for Standardization. [ISO/TS 8000-82:2022 — Data quality — Part 82: Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html). 2022; accessed 2026-08-11.
[^w3c-prov]: World Wide Web Consortium. [PROV-DM: The PROV Data Model](https://www.w3.org/TR/prov-dm/). W3C Recommendation, 30 April 2013; accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish structural schema, semantic, temporal, ownership, and evolution expectations.
- [ ] Explain lineage, provenance, authority, ownership, stewardship, and trust boundaries accurately.
- [ ] Identify consumer impact and evidence gaps for a data change.
- [ ] Define a proportionate communication and escalation path.
- [ ] Produce a Data Trust Boundary and Ownership Review with residual risk.
