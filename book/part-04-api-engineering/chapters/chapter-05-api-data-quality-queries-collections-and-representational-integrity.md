# Chapter 5 — API Data Quality: Queries, Collections, and Representational Integrity

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 5 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–4 and familiarity with JSON representations and HTTP request/response semantics |
| Estimated study time | 170 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A collection is not trustworthy because one item looks correct. It is trustworthy only to the extent that its membership, meaning, time boundary, and limitations support the decision being made.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. A support analyst searches for a customer's orders with a status filter and sees one recent cancellation. The analyst tells the customer that no replacement is in progress. An hour later, fulfilment contacts the customer about a replacement order that was present in the order-detail API but absent from the first search page.

Nothing in the first response was malformed. Its JSON was valid, each returned order had the expected fields, and the status filter appeared to work for the visible records. The problem was a data-quality question at the API boundary. Was the collection complete for the analyst's decision? Was its order stable while records changed? Did the filter include all and only the intended states? Did a summary use the same population as the list? Could the analyst tell how fresh the result was?

A Quality Engineer does not assume that a list response is a complete view merely because it contains records. They ask what set is represented, which time or consistency boundary applies, which records belong in it, how it is ordered and paginated, and what evidence supports the customer-facing conclusion.

## Introduction

Chapters 3 and 4 established that an API contract includes meaning, compatibility, state, side effects, and evidence limits. This chapter applies that reasoning to data returned through an API. It examines representations, collections, queries, summaries, and relationships as observable behaviour rather than as a database implementation concern.

The central question is not *does this response contain the expected fields?* It is *can a consumer safely use this representation or collection for its stated decision?* A response can be structurally valid while returning an incomplete collection, a stale status, a duplicated logical entity, an incorrectly interpreted timestamp, or an aggregate calculated over the wrong population.

This chapter does not teach SQL, storage engines, reconciliation pipelines, data-lineage products, or an API-client tool. Part VI develops Data Quality Engineering in greater depth. Here, the focus is the API contract and evidence needed when data crosses an interface boundary. Chapter 6 then considers whether a particular caller is permitted to observe or change that data.

## Why This Chapter Matters

API data can drive customer communication, fulfilment, entitlement, financial decisions, operational work queues, and automated actions. A correct-looking individual record is weak evidence if the decision depends on all matching records, on the absence of a record, on stable ordering, or on an aggregate total.

Common API checks often assert one status code, several fields, and one selected item. Those checks can be useful. They do not establish that a collection has no duplicates, that a page traversal has no omissions, that a filter excludes all non-matching data, that a summary and detail view agree, or that a recently written value is visible within the stated consistency expectation.

Data quality at an API boundary is contextual. A stock indicator shown to a shopper may be deliberately approximate for a short period; a regulatory export may require a defined complete population at a documented cutoff time. Quality Engineering makes that context, evidence, and residual uncertainty explicit instead of using the word *correct* as an unsupported universal claim.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish structural validity from data correctness and decision fitness at an API boundary;
- assess representation integrity, including meaning, relationships, null handling, timestamps, and source context;
- define completeness, consistency, uniqueness, and freshness in terms of an intended consumer decision;
- reason about filtering, sorting, searching, and field selection without assuming one universal query syntax;
- assess pagination as a traversal contract rather than a sequence of isolated pages;
- identify duplicate, omitted, stale, and cross-endpoint-inconsistent data risks;
- evaluate totals, counts, and grouped summaries in terms of their population, unit, and temporal boundary;
- select proportionate API data-quality evidence and state what it cannot establish; and
- communicate data-quality uncertainty to a product, operational, or release decision-maker.

## API Data Quality Is Observable Behaviour

An API representation communicates selected information about a domain. That information has quality only in relation to a use. A courier allocation service may need the current delivery address; a customer-facing history screen may need a complete ordered sequence; an invoice process may need a precise amount, currency, and tax treatment. The same API field can be adequate for one use and insufficient for another.

For this chapter, **API data quality** means the degree to which a representation, collection, or summary is fit for the consumer decision it claims to support. This is an MSQE educational framing, not a replacement for a formal data-quality standard.

| Data concern | API-boundary question | A weak check that can mislead |
|---|---|---|
| Correctness | Does this value represent the intended domain fact? | The field exists and has the expected type. |
| Completeness | Does the response include the data needed for this decision? | The first page contains at least one expected item. |
| Consistency | Do related API representations agree within their stated boundary? | One endpoint gives a plausible answer. |
| Uniqueness | Does each returned item represent one logical entity as promised? | The collection has the expected length once. |
| Freshness | Is the data recent enough for the intended use? | The response has a recent transport timestamp. |
| Interpretability | Are unit, currency, status, timezone, and default meaning clear? | A consumer can parse the JSON. |

The terms overlap. A duplicated order can make an aggregate wrong; a stale state can make a membership decision wrong; an omitted relationship can make a structurally complete object operationally incomplete. The purpose is not to attach a label to every defect. It is to make the data expectation and its consequence reviewable.

## Representation Integrity: More Than Field Presence

**Representation integrity** is the extent to which an API representation faithfully communicates the state, relationship, or result it promises to represent. It concerns both the shape of the JSON and the meaning a consumer is entitled to infer.

Consider this fictional order representation:

~~~json
{
  "orderId": "ord-701",
  "status": "accepted",
  "total": { "value": 1250, "currency": "GBP" },
  "lastUpdatedAt": "2026-08-10T09:30:00Z",
  "customerId": "cus-44"
}
~~~

The response is structurally useful. It does not by itself establish that **status** reflects the authoritative fulfilment state, that **total.value** includes tax, that **lastUpdatedAt** identifies the business event a consumer assumes, or that **customerId** is a relationship the caller may observe. Chapter 3 established the distinction between structural and semantic contract. Data-quality reasoning asks how that distinction affects a decision made from the returned data.

| Representation issue | Why schema validity is insufficient | Consumer consequence |
|---|---|---|
| Wrong amount or unit | A number can satisfy a range while using an unintended currency, tax rule, or minor-unit convention. | A customer, invoice, or report is wrong. |
| Stale status | An allowed status token can describe an earlier state. | A workflow proceeds or stops incorrectly. |
| Missing relationship | An optional field can be absent where a consumer needs it to link records. | The consumer creates a false orphan or duplicate. |
| Duplicate logical object | Two different item identifiers can refer to one business entity, or one ID can appear twice across pages. | Counts and actions are repeated. |
| Inconsistent timestamp | A valid timestamp can denote processing time rather than customer event time. | Freshness or sequence is misinterpreted. |
| Misleading default | Zero, empty, null, or omission can conceal a value that is unknown, unavailable, or not applicable. | A consumer treats uncertainty as a fact. |

The Quality Engineer should name the intended representation claim. “The order detail endpoint returns a valid order” is too broad. “For a support cancellation decision, the returned status, fulfilment commitment, and payment state represent the latest authoritative facts within the documented read-consistency boundary” is testable in a proportionate way and makes its limitation visible.

## Validity, Correctness, and Fitness for Use

JSON Schema validation asserts constraints on the structure of JSON instance data.[^json-schema] OpenAPI can describe HTTP operations, parameters, responses, and reusable schemas.[^openapi] These mechanisms can make valuable structural expectations explicit. They do not establish that data is correct for its domain or fit for a consumer's decision.

For example, a response can validate while being wrong in several ways:

- a returned amount is correctly formatted but reflects a superseded price list;
- an order list includes all `accepted` records but omits `pending_review` records that the user-facing definition calls active;
- an aggregate count is mathematically correct for the page window but labelled as an account-wide total;
- a timestamp is in UTC and syntactically valid but represents ingestion rather than the event the consumer is ordering; or
- a read immediately after a write shows an earlier state under a documented asynchronous projection.

Correctness may require an authoritative business rule, a known source record, another compatible API boundary, or a controlled fixture. Even then, selected evidence does not prove that every record, historical state, tenant, or production condition is correct. State the claim at the level the evidence can support.

## Completeness and Collection Membership

**Completeness** means that a representation or collection contains the information required for a stated purpose. It does not always mean “every field in the system” or “every record ever created.” A collection can be complete for a tenant, filter, time range, visibility rule, and page traversal while correctly excluding other records.

For a list API, completeness has at least two questions:

1. **Membership:** Are all records that satisfy the documented query and visibility conditions included?
2. **Representation:** Does each returned record contain enough information for the intended decision, or does the contract require a detail lookup or a declared partial representation?

An API may intentionally return partial fields in a list representation to control size or exposure. That can be a sound contract. The problem begins when a consumer treats the list object as equivalent to the detail object without a promise that it is.

| Completeness question | Evidence that can help | Limitation to state |
|---|---|---|
| Are all intended records included? | Controlled fixture with known membership; comparison to an authoritative bounded source; complete traversal evidence. | A fixture cannot establish every production data condition or access rule. |
| Are non-matching records excluded? | Boundary records, conflicting attributes, and selected negative queries. | Does not establish all parser, collation, or historical-data cases. |
| Is the response truncated? | Declared limit, next-page indicator, cursor behaviour, and total-count semantics where provided. | A total count may be approximate, delayed, or scoped differently. |
| Is related data complete enough? | Explicit representation contract and selected detail/list comparison. | A comparison does not establish all consumer needs. |

The phrase “no results” requires care. It can mean no records match, the caller has no visibility, the query is incomplete, the read model is delayed, the requested page lies beyond the available range, or an error was represented incorrectly. The contract and error semantics must let a consumer distinguish the cases that matter.

## Consistency Across Operations and Representations

**Consistency** at an API boundary concerns whether related observations agree according to the promised model. It does not require every endpoint to return identical fields at every instant. It requires the API to make material differences interpretable.

Useful consistency questions include:

- Does a list item agree with the corresponding detail representation for shared fields at a stated observation boundary?
- After a successful write, when and where should the resulting state become visible?
- Does a customer summary use the same status definitions and population as its underlying order collection?
- Does a repeated query produce the same result when no relevant data has changed and stable ordering is promised?
- If a read model is eventually consistent, how does a consumer identify pending, delayed, or reconciled data?

Immediate read-after-write visibility is not a universal requirement. A service may accept an operation, create a pending state, and update an analytical or search view later. The quality requirement is that the API contract represents the difference safely. Calling every delayed read a defect would ignore legitimate architectures; treating every discrepancy as harmless would conceal customer risk.

### Cross-endpoint integrity

Cross-endpoint integrity compares promises that concern the same domain fact. A list endpoint and a detail endpoint can differ intentionally in field selection, freshness, or authorization scope. A summary can be calculated at a different cadence from a detail record. The reviewer should therefore first ask whether the endpoints claim to represent the same fact under the same conditions.

For Atlas, a support list might show `paymentStatus: "pending"` while a payment-detail endpoint shows `captureStatus: "submitted"`. That is not automatically inconsistent: the values may belong to different state models. It is a problem if both fields claim to be the current payment outcome and their relationship is undefined. Evidence should compare documented shared meaning rather than merely matching names.

## Uniqueness, Identity, and Duplicates

**Uniqueness** means that an API collection treats a logical entity once where the consumer's decision requires one occurrence. This is not the same as every JSON object having a distinct identifier. A reissued order, merged customer record, repeated page item, or duplicated aggregate contribution can create a logical duplicate even when technical IDs differ.

Duplicates can arise through retry behaviour, source reconciliation, delayed projection, unstable pagination, a join-like summary, or a contract that does not define identity clearly. Chapter 4 examined duplicate side effects. This chapter focuses on duplicate data returned to a consumer and the decision it distorts.

| Duplicate pattern | API-quality risk | Evidence question |
|---|---|---|
| Same identifier appears twice in a collection. | A consumer counts, displays, or processes one entity twice. | Is duplicate membership forbidden, tolerated with meaning, or a pagination artefact? |
| Distinct identifiers represent the same business entity. | A consumer sends two notices or calculates two contributions. | What is the logical identity and deduplication rule for this use? |
| An item repeats across pages. | A traversal overstates membership and may still omit another record. | Is ordering stable while the cursor or page token is valid? |
| Aggregate includes one event twice. | A total remains plausible but materially wrong. | What population and uniqueness rule contribute to the aggregate? |

Do not make “no duplicates” an unqualified rule. Some APIs intentionally show repeated events, revisions, or line items. The contract must say whether each item is a distinct event, a version, an occurrence, or a view of one logical entity.

## Query Semantics: Filters, Sorting, and Search

An API query is part of the contract. Its parameters express the consumer's requested set, order, or representation. HTTP defines request and representation semantics, but it does not impose one universal filter, sorting, or search syntax on application APIs.[^rfc9110] A Quality Engineer should examine the advertised query meaning rather than assume that similar parameter names behave alike across services.

### Filtering: all and only the intended records

A **filter** selects a collection according to a documented condition. Evidence should test both inclusion and exclusion:

- Are all records that satisfy the filter definition included within the stated consistency and visibility boundary?
- Are records that fail the condition excluded?
- How do null, absent, empty, unknown, or defaulted values participate?
- When multiple filters are supplied, are they combined as intersection, union, precedence, or another documented rule?
- Are date, locale, case, unit, tenant, or authorization constraints part of the effective filter?

For example, `status=active` may be ambiguous unless the API defines whether `pending_review`, `paused`, or `cancel_requested` qualify. A selected fixture should include boundary states and a record that must be excluded. Merely observing one active record does not prove the filter's population.

### Sorting: an order is a promise when consumers rely on it

Sorting determines the sequence in which a collection is returned. Its quality matters whenever a consumer selects the first item, uses pages sequentially, displays a ranked result, or relies on repeatable comparisons.

The contract should make material rules explicit:

- ascending or descending direction;
- field or fields used for ordering;
- null or missing-value placement;
- locale, case, and collation semantics when strings are involved;
- tie-breaking when primary values are equal; and
- whether the order is stable for a given traversal or merely incidental.

An order by `createdAt desc` can remain ambiguous when several orders share a timestamp. Without a tie-breaker, items can move between pages even if no record changes. That may be acceptable for an exploratory screen and unacceptable for a complete export. The evidence question is not “is the array sorted?” but “is the ordering sufficiently defined and stable for the consumer's pagination, selection, or audit decision?”

### Search and field selection

Search can be fuzzy, tokenised, relevance-ranked, delayed, or based on a separate index. Field selection can omit expensive, sensitive, or irrelevant data. Neither should be judged by assumptions borrowed from another API. Consumers need to know which fields are searchable, what match semantics apply, whether results are complete, which ranking factors are stable enough to rely on, and whether a selected representation is intentionally partial.

## Pagination Is a Traversal Contract

Pagination divides a collection into retrievable segments. It manages response size and can support incremental user interfaces, exports, and batch processing. It also introduces a quality risk: a sequence of successful page responses can contain duplicates, gaps, reordering, or a changing population.

Common conceptual approaches include:

| Approach | General idea | Important evidence question |
|---|---|---|
| Page or offset | Request a numbered segment or an offset and limit. | What happens when inserts, deletes, or changed ordering shift later positions? |
| Cursor or token | Continue from an opaque position or boundary supplied by the server. | What collection, order, scope, and validity period does the cursor represent? |
| Link or next indicator | The response points to another retrievable segment. | Does the indicator unambiguously establish another page, and what does its absence mean? |
| Total count | The response reports a count for a collection. | Is the count exact, scoped to visibility and filter, from the same time boundary, or approximate? |

No approach removes the need to define the contract. Offset pagination may be convenient for stable, small collections; it can move records when the dataset changes. Cursor pagination can reduce some movement by continuing from a defined boundary; it still depends on the cursor's scope, ordering, expiration, and mutation semantics. The Quality Engineer should not label one approach universally correct.

### Page one plus page two is not proof of complete traversal

Suppose an API returns two pages of ten orders. The consumer receives twenty unique IDs. That observation is useful, but it does not establish complete traversal unless the contract and evidence also address at least these questions:

- What filter, tenant, visibility rule, and time boundary define the collection?
- Is there another page, a `next` indicator, or a count with known semantics?
- Is the order stable for the traversal?
- Can a newly inserted or updated item move before or after the cursor?
- Can deletion cause an item to be skipped or a later offset to change?
- Is the collection a snapshot, a best-effort live view, or an eventually consistent index?

For a customer history screen, a best-effort live view may be appropriate if the UI communicates that records can update. For a financial batch, the API might need a documented cutoff, snapshot identifier, or reconciliation process. The required evidence follows the consequence of an omitted or duplicated record.

## Aggregations and Population Meaning

APIs often return counts, totals, averages, grouped summaries, and derived indicators. An aggregate can be mathematically valid and still semantically wrong if the population, unit, inclusion rule, or time boundary is unclear.

| Aggregate question | Example risk |
|---|---|
| What population contributes? | A `totalOrders` count includes archived or inaccessible records while the list does not. |
| What unit applies? | A monetary total combines currencies or minor and major units. |
| Which statuses qualify? | A revenue summary includes pending authorisations as completed captures. |
| What time boundary applies? | A daily total uses processing date while a consumer expects customer order date. |
| Are values deduplicated? | A retried event contributes twice to an average or count. |
| Is the aggregate exact? | An approximate count is presented as an audit-ready number. |

Matching a summary total to a small list fixture can provide useful evidence. It does not prove production-scale aggregation correctness, every currency condition, or every historical correction. A stronger exercise names the population rule and then selects boundary records that challenge it.

## Null, Missing, Empty, Defaults, and Time

Chapter 3 introduced the distinction among absent, null, empty, and defaulted values. Data-quality work makes their collection and temporal consequences visible. An empty array can truthfully mean no visible records for a filter; it can also conceal a failed downstream index if the contract gives no status, freshness, or diagnostic indication. A null delivery date can mean not yet calculated, unavailable, or not applicable. A default region can simplify a client while incorrectly assigning a customer to a geographic report.

**Temporal semantics** describe what time a value represents. Important distinctions include:

- **event time** — when the domain event occurred;
- **processing time** — when a system handled or recorded it;
- **last-updated time** — when a selected representation or source was changed; and
- **observation time** — when a consumer read the response.

Timestamps should include a clear timezone or offset representation where their instant matters, but a correctly formatted timestamp is not automatically a freshness guarantee. A consumer needs the event, update rule, consistency boundary, and acceptable delay that make the time useful.

### Provenance as a question, not a platform

**Data provenance** asks where a returned value came from and which transformation, source, or rule made it available. At an API boundary, the question can reveal a material limitation: is `availableBalance` drawn from an authoritative ledger, a delayed projection, a third-party feed, or a cached calculation?

This chapter does not teach lineage tooling or data-pipeline design. It asks teams to state source and freshness assumptions when they affect a consumer decision. That is enough to select a better oracle and to identify when a data specialist or service owner must contribute.

## Data-Quality Evidence and Its Limits

The following is an **MSQE educational API data-quality evidence prompt**:

~~~text
consumer decision and data risk
  → representation, collection, or aggregate expectation
  → query, operation, and observation boundary
  → oracle or comparison
  → observed result and limitation
  → residual uncertainty and decision
~~~

An oracle may be a defined business rule, a bounded authoritative fixture, a compatible detail representation, a known sequence of events, or a reviewed source record. The oracle must be appropriate to the claim. A list endpoint should not be declared complete merely because it agrees with another projection that has the same delayed source.

| Claim | Proportionate evidence | What it does not establish |
|---|---|---|
| Filter includes and excludes defined states. | Boundary fixture, selected positive and negative records, and documented filter rule. | Every historical value, locale rule, or production source delay. |
| Traversal avoids duplicate selected items. | Known collection, stable-order condition, full selected traversal, and identity comparison. | All mutation rates, cursor lifetimes, or consumer implementation defects. |
| Summary uses the intended population. | Fixture with inclusion/exclusion boundaries and explicit aggregate calculation. | All production corrections or delayed upstream events. |
| Read-after-write state is acceptable. | Controlled write, defined read boundary, and timed follow-up observation. | Every asynchronous failure or production replication condition. |
| Detail and list agree on shared fields. | Defined shared fact and selected paired observations. | Every field, authorization scope, or stale view. |

Evidence becomes stronger when it is connected to a decision. A customer-support queue may need a practical freshness indicator. An accounting workflow may need a controlled export boundary and reconciliation. The Quality Engineer identifies the claim, selects a feasible observation, and states what remains unobserved.

## QA → QE Transition

| Existing QA activity | Expanded API Data Quality Engineering practice |
|---|---|
| Assert selected response fields. | Define the domain fact, unit, source, temporal meaning, and consumer decision that make a value useful. |
| Check that a filter returns one expected record. | Challenge membership with both included and excluded boundary records, visibility rules, and an explicit population. |
| Iterate through pages. | Assess traversal scope, stable ordering, mutation behaviour, uniqueness, and evidence of omissions. |
| Compare a list with a detail response. | Establish whether the endpoints claim the same fact, time boundary, and authorization scope before calling a difference inconsistent. |
| Assert an aggregate total. | Define population, unit, status inclusion, time boundary, and deduplication rule. |

The transition is from verifying fields to engineering evidence about data a consumer can trust for a defined use. Quality Engineers do not promise omniscient data assurance; they expose the data promise, observation boundary, limitation, and residual risk.

## Engineering Perspective

API data quality is often improved before a check is written. A team may need to define the order tie-breaker, state that a count is approximate, expose a cursor's expiry and scope, distinguish pending from completed data, document an aggregate population, or make a partial representation explicit. These design choices reduce ambiguity for consumers and make proportionate evidence possible.

The right improvement depends on the consequence. A search result may tolerate a delayed index; an entitlement or billing decision may require an authoritative boundary or a confirmation operation. Quality Engineering connects the consumer outcome to those trade-offs without prescribing a storage technology or taking ownership of a data platform.

## Industry Perspective

OpenAPI defines a language-agnostic description format for HTTP APIs, including operation parameters, responses, and schemas.[^openapi] JSON Schema provides vocabularies for structural constraints on JSON instances.[^json-schema] RFC 9110 defines HTTP request and representation semantics.[^rfc9110] These specifications can make interface expectations explicit, but none proves that a collection contains the correct population, that an aggregate has the intended business meaning, or that a view is fresh enough for a consumer decision.

The data-quality evidence prompt in this chapter is MSQE educational framing. It is not a data-governance standard, a reconciliation method, or a promise that an API can expose every provenance detail.

## Common Misconceptions

### “If every returned record is valid, the collection is correct.”

Individual structural validity does not establish membership, completeness, uniqueness, ordering, freshness, or aggregate population.

### “Pagination is only a user-interface concern.”

Pagination changes what a consumer can infer from a collection. It can create duplicate or omitted records, especially when ordering or membership changes during traversal.

### “Eventual consistency means data quality does not matter.”

Delayed visibility can be a valid architectural choice. The API still needs a safe contract for what is pending, which view is authoritative for a decision, and how a consumer obtains follow-up evidence.

### “A total count proves the list is complete.”

A count may be delayed, approximate, differently scoped, or calculated over a different population. Its semantics need to be explicit.

### “One matching list and detail response proves cross-endpoint integrity.”

It supports one selected comparison. It does not establish every field, time boundary, tenant, visibility rule, or production data condition.

## Summary

API data quality is a property of representations, collections, queries, summaries, and their fitness for a consumer decision. Schema validity is useful evidence of structure, but it does not establish correct meaning, complete membership, unique logical entities, fresh state, stable pagination, or accurate aggregates.

Quality Engineering makes collection and query assumptions visible. It asks which records belong, which fields and timestamps mean what, how filters and ordering behave, what changes during pagination, how summaries relate to detail, and what observation can support the claim without overstating confidence. That prepares the learner to ask, in Chapter 6, whether a particular caller should be permitted to see or change the resulting data.

## Key Takeaways

- Data quality at an API boundary is defined by fitness for a stated consumer decision.
- A structurally valid representation can still be incorrect, stale, incomplete, duplicated, or semantically misleading.
- Collection completeness requires an explicit population, visibility rule, and observation boundary.
- Filters need evidence for both matching inclusion and non-matching exclusion.
- Ordering, ties, mutation, cursor scope, and page indicators determine whether pagination is a safe traversal.
- Aggregates need a defined population, unit, inclusion rule, temporal boundary, and uniqueness rule.
- Eventual consistency is not automatically a defect, but its state and limitation must be safe to interpret.
- API data evidence should state its oracle, boundary, limitation, and residual uncertainty.

## Review Questions

1. Why can a schema-valid order representation still be unfit for a support decision?
2. Distinguish collection membership completeness from representation completeness.
3. What filter conditions should a Quality Engineer clarify before judging a collection result?
4. Why can page one plus page two fail to establish a complete traversal?
5. How can unstable ordering create both duplicates and omissions across pages?
6. What should an aggregate contract state beyond its numeric value?
7. How can a timestamp be valid yet misleading about freshness?
8. When might a list and detail representation legitimately differ?
9. What limitations should accompany evidence that a write is visible through a later read?

## Interview Questions

1. How would you assess whether an API's pagination is safe for a financial export?
2. A team says a filter works because it returns one expected order. What would you ask next?
3. How would you investigate a list total that differs from a customer summary?
4. What data-quality risks do you consider when an API uses an eventually consistent search index?
5. How do you explain the difference between valid JSON and trustworthy API data to a product stakeholder?

## Practical Exercise

### Review Collection and Query Integrity

**Objective:** Produce an **API Data Integrity Review** for a fictional Atlas Commerce order-search API. Explain the data claim, evidence, and residual uncertainty; do not implement a service, query, or test suite.

**Illustrative collection response:**

~~~json
{
  "items": [
    { "orderId": "ord-710", "status": "accepted", "total": { "value": 1250, "currency": "GBP" }, "createdAt": "2026-08-10T09:00:00Z" },
    { "orderId": "ord-712", "status": "pending_review", "total": { "value": 1250, "currency": "GBP" }, "createdAt": "2026-08-10T09:00:00Z" }
  ],
  "next": "cursor:orders:710",
  "totalCount": 3
}
~~~

Atlas documents `status=active` as including `accepted` and `pending_review`. A second page later contains `ord-710` again and an order created while the first page was being processed. A customer summary says there are two active orders, while a detail endpoint reports `ord-712` as `cancelled`. The API does not state whether `totalCount` is exact, whether `next` represents a snapshot, or which event its `createdAt` field records.

**Tasks:**

1. Define the expected collection population for the `active` filter, including at least one inclusion and one exclusion boundary.
2. Identify representation-integrity, completeness, uniqueness, ordering, temporal, and cross-endpoint risks.
3. Explain how the duplicate page item and concurrent insertion affect a complete-traversal claim.
4. State the questions required to interpret `totalCount`, `next`, status values, and timestamps safely.
5. Propose proportionate evidence using a controlled fixture, selected detail/list comparisons, full traversal observations, and an aggregate comparison.
6. State what each proposed observation cannot establish about production data, mutation, or source freshness.
7. Write a residual-risk statement for a support workflow that tells customers whether an order remains active.

**Expected artifact:** A three- to four-page API Data Integrity Review containing a data-claim inventory, collection and query assumptions, selected evidence and oracle table, pagination analysis, cross-endpoint questions, and residual-risk statement.

**Constraints:** Atlas Commerce is fictional. Do not write SQL, an OpenAPI document, a client, a data pipeline, a reconciliation process, or API tests. Do not claim that a schema-valid response or selected page traversal proves universal data correctness.

## Further Reading

- ISO/IEC, [ISO/IEC 25012:2008 — Data quality model](https://www.iso.org/standard/35736.html) — a formal data-quality model that complements this chapter without extending it into data-governance practice.
- [Chapter 3 — Contract Quality: Schemas, Semantics, Compatibility, and Evolution](chapter-03-contract-quality-schemas-semantics-compatibility-and-evolution.md) — structural and semantic contract context for API data claims.
- [Part III, Chapter 8 — Functional, Quality-Attribute, and Data-Oriented Evidence](../../part-03-software-testing/chapters/chapter-08-functional-quality-attribute-and-data-oriented-evidence.md) — complementary evidence-design context.

## References

[^openapi]: OpenAPI Initiative. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html). Accessed 2026-08-10.
[^json-schema]: JSON Schema. [JSON Schema Validation: A Vocabulary for Structural Validation of JSON](https://json-schema.org/draft/2020-12/json-schema-validation). Draft 2020-12. Accessed 2026-08-10.
[^rfc9110]: Fielding, R., Nottingham, M., and J. Reschke, eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). IETF, June 2022. Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish structural validity from data correctness for a defined consumer decision;
- [ ] define the population, visibility rule, and boundary of a collection claim;
- [ ] assess filtering, ordering, and pagination without assuming one universal implementation;
- [ ] identify duplicate, omitted, stale, and cross-endpoint data risks;
- [ ] explain the population and temporal meaning of an aggregate; and
- [ ] select data-quality evidence while stating its limitation and residual uncertainty.

**Next:** [Chapter 6 — Identity at the API Boundary: Authentication, Authorization, and Safe Behaviour](chapter-06-identity-at-the-boundary-authentication-authorization-and-safe-behaviour.md).
