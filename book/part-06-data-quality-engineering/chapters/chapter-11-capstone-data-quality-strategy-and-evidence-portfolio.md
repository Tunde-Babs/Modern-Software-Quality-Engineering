# Chapter 11 — Capstone: Data Quality Strategy and Evidence Portfolio

## Metadata

| Field | Value |
|---|---|
| Part | Part VI — Data Quality Engineering |
| MQE-BOK domain | Domain 6 — Data Quality Engineering |
| Chapter | 11 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–10; Parts I–V, or equivalent experience |
| Estimated study time | 180 minutes, plus the capstone exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE educational framing:** A data-quality strategy is credible when it connects a decision to evidence, names its limits, and makes the remaining risk actionable.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. Finance, operations, customer support, and product leadership disagree about whether a new marketplace integration is ready for a wider rollout. Finance sees a provisional revenue increase. Operations sees missing fulfilment statuses. Support sees refund records that appear late. Product sees a conversion dashboard whose definition changed during the rollout.

Each team has evidence, but it is fragmented. One report is current but excludes quarantined events. A reconciliation total is close but its unmatched population is not classified. A product-status contract accepts a new supplier value that some consumers interpret differently. A backfill corrected one historical period without showing whether the same condition affects current data.

The capstone does not ask the learner to declare the integration good or bad. It asks for a strategy that makes an accountable decision possible: which claims matter, which representations and populations are involved, what evidence is available, what is missing, what can be concluded now, and what must happen before the decision is revised.

## Why This Chapter Matters

Data Quality Engineering becomes professionally useful when it improves a decision across system boundaries. Individual checks, queries, maps, reconciliations, and investigations are valuable, but a decision maker needs a coherent view of their relevance, limits, ownership, and residual risk.

This capstone integrates Chapters 1–10 into a **Data Quality Strategy and Evidence Portfolio**. It deliberately reuses and refines prior artifacts rather than requiring duplicate documentation. The work remains tool-neutral and does not require production data, a warehouse, a pipeline platform, a companion application, or a deployed service.

## Learning Objectives

By the end of this chapter, you should be able to:

- construct a decision-oriented data-quality strategy across sources, representations, transformations, pipelines, reports, and consumers;
- select and connect proportionate evidence rather than accumulating disconnected checks;
- build an Evidence Matrix that records claims, populations, sources, oracles, limitations, ownership, and residual risk;
- distinguish fact, interpretation, recommendation, evidence gap, limitation, mitigation or acceptance, and revision trigger in a Data Quality Decision Brief;
- communicate data-quality trade-offs to technical and non-technical stakeholders; and
- demonstrate Practitioner-to-Engineer Data & Database Quality capability without overstating certainty or ownership.

## Capstone Purpose and Boundaries

The capstone is an integration exercise, not an implementation project. It asks the learner to make quality reasoning inspectable. It does not ask for:

- a production pipeline, database, dashboard, or cloud account;
- a specific ETL, warehouse, streaming, or BI product;
- a universal data-quality score or enterprise maturity assessment;
- a full organisational data-governance programme;
- a reliability, security, performance, AI, or architecture implementation; or
- use of real customer data, credentials, confidential reports, or proprietary schemas.

The product is a strategy and evidence portfolio. It should be credible enough that another engineer can challenge the scope, assumptions, sources, evidence, and recommendation.

## Atlas Commerce Capstone Scenario

Atlas Commerce is a fictional retailer expanding marketplace sales across two regions. The following simplified data journey supports operational and financial decisions:

```text
Marketplace supplier events
    → order and product ingestion
    → mapping, enrichment, and eligibility transformation
    → operational store and reporting warehouse
    → support dashboard, fulfilment view, and daily finance report
```

The scenario contains these deliberately mixed conditions:

| Area | Condition |
|---|---|
| Orders and payments | Orders, payment attempts, settlements, refunds, and reversals have different identifiers and lifecycle times. |
| Product data | A supplier introduced `PRE_ORDER`; consumers interpret it inconsistently. |
| Transformations | Supplier cost uses different currency scale for one provider; missing cost currently defaults to zero. |
| Pipeline | Some events are quarantined after a producer-version change; dashboard status does not expose their consumer impact. |
| Reconciliation | Ledger and report totals are close, but unmatched sets include late settlement, correction, and unexplained records. |
| Temporal behaviour | Carrier and refund events can arrive late, replay, or correct earlier state. |
| Analytics | Checkout conversion compares inputs with inconsistent event/processing time and a changed bot filter. |
| Production learning | A stale rate-table incident was corrected, but evidence of effective-date freshness remains weak. |

### Synthetic evidence packet

The following packet is intentionally small, fictional, and incomplete. It is not a hidden answer key. It gives the learner enough evidence to make bounded claims and enough uncertainty to practise stating what cannot yet be concluded.

**Decision context.** The 30 June legal-entity close uses `Europe/Berlin`; its event-time cutoff is `2026-06-30T21:59:59Z`. Finance needs a provisional revenue decision, Support needs a safe refund response, Operations needs a fulfilment status, and Product needs a marketplace-rollout decision.

| Identifier and evidence | Observation | Why it matters |
|---|---|---|
| `O-4101`, settlement `S-901` | Settled for €120.00 at `2026-06-30T21:40:00Z`; revenue entry `R-901` is €120.00. | A normal-looking source-to-report relationship within the local-close population. |
| `O-4102`, settlement `S-902` | Settled for €80.00 at `2026-06-30T22:30:00Z`—00:30 on 1 July in Berlin. Supplier cost is `3,000` in EUR minor units. Revenue entry `R-902` assigns 30 June and reports cost as €3,000.00. | A time-zone population error and a cost-scale transformation error can coexist. |
| `O-4103`, refund `RF-7002` | Refund of €49.99 is issued at 20:47. Atlas receives it at 20:49 but quarantines it because Version N+1 introduces `refund_reason = MERCHANT_CREDIT`. The support dashboard does not show it. | Consumer absence can result from received-but-rejected input rather than a missing source event. |
| `O-4104`, settlement `S-904` | Business event is at `2026-06-30T21:55:00Z`; receipt is at `2026-07-01T00:08:00Z`. It is absent from the initial revenue report. | A before-cutoff business fact may be pending because it arrives after the close snapshot. |
| Product `P-440` | Supplier contract Version N+1 emits `category_status = PRE_ORDER`. Storefront displays “Available”; fulfilment excludes it from immediate allocation. | Structural compatibility does not settle consumer meaning or ownership. |
| Checkout conversion | Dashboard shows 5 completed orders / 107 denominator rows = 4.67%. Evidence notes 100 intended qualified attempts and seven multiply joined attempts. | A technically calculated metric can have the wrong grain and cohort. |

The first reconciliation observation is deliberately uncomfortable:

| Comparison at the 30 June local close | Count | Amount (EUR) | Keyed observation |
|---|---:|---:|---|
| Expected ledger population | 2 | 190.00 | `S-901` (€120.00) and `S-904` (€70.00). |
| Revenue-report population | 2 | 200.00 | `R-901` (€120.00) and `R-902` (€80.00). |
| Immediate conclusion | Counts agree; totals differ by €10.00. | — | `S-904` is source-only; `R-902` is target-only for the local-close rule. |

The packet does **not** include a complete bank-provider extract, the full supplier-cost population, a final `PRE_ORDER` policy, or proof that every checkout outcome has arrived. Those omissions are intentional. A learner may make reasonable assumptions, but each must be labelled, tied to an owner or source, and assessed for decision impact. Do not invent evidence that the packet does not provide.

### Work from observation to a bounded conclusion

Begin by creating a short evidence register. For each observation, record whether it is a source fact, a derived result, a consumer-visible outcome, or an unverified assumption. For example, “`RF-7002` is absent from the dashboard” is an observed consumer outcome; “the refund was never received” is not supported because receipt and quarantine evidence say otherwise. This distinction prevents an investigation from converting a visible symptom into an untested explanation.

Then look deliberately for evidence that conflicts across boundaries. `S-904` is both an expected pre-close business event and an absent close-snapshot record. `R-902` is present in the report but outside the intended local-date population. The useful question is not which source is inconvenient. It is what each observation establishes, which population it represents, and whether the conflict changes a decision.

Finally, classify every major claim as one of the following before writing a recommendation:

- **supported within scope** — the supplied evidence and oracle support the claim for its stated population;
- **provisional** — the claim can guide a limited action, but a known window, exception, or evidence gap remains;
- **contradicted** — supplied evidence conflicts with the claim or its necessary rule; or
- **unsupported** — the evidence packet does not establish a material condition.

These classifications are not maturity labels. They are a disciplined way to stop a portfolio from treating incomplete evidence as failure, or treating a plausible recommendation as proof.

## The Data Quality Strategy

A **Data Quality Strategy** is a decision-oriented plan for selecting, interpreting, and improving evidence about data-quality risks. It is not a test plan expressed with different terminology. It connects consumer decisions, claims, representations, populations, evidence boundaries, limitations, ownership, and review triggers.

### Start with decisions and consumers

Choose two to four consequential decisions from the scenario. Examples include:

- whether finance may use the daily revenue report for a provisional close;
- whether customer support may rely on the refund dashboard for a customer conversation;
- whether operations may treat the fulfilment view as complete for a warehouse cutoff; and
- whether product may expand the marketplace rollout while `PRE_ORDER` semantics remain unresolved.

For each decision, name the decision consumer, time sensitivity, consequence of error, and accountable owner. A strategy that starts with “test all tables” has not yet identified what quality work matters.

### Define claims and populations

For each decision, write a bounded claim. For example: “For settled card payments before the legal-entity close cutoff, the daily revenue report contains one eligible recognised-revenue entry or a documented exception.”

Define population, source, representation, identifier, lifecycle rule, time basis, and material exclusions. Claims should be narrow enough to challenge and important enough to influence the decision.

### Select evidence portfolios, not isolated checks

Use complementary evidence where the risk requires it. A transformation claim might need source-to-target mapping review, an independent calculation, unresolved-cost exception analysis, and a reconciliation. A consumer-visibility claim might need ingestion/rejection population evidence, stage checkpoints, and a safe end-to-end observation.

Avoid claiming that a query, schema check, or green job independently proves an end-to-end business conclusion. Each evidence item should have a stated boundary and limitation.

## The Evidence Matrix

The **Evidence Matrix** is the central capstone artifact. It is an **original MSQE educational framing**, not a formal standard. It enables comparison of evidence by decision value rather than query or assertion count.

| Field | Purpose |
|---|---|
| Decision and consumer | Identifies why the claim matters and who acts on it. |
| Quality claim | States the bounded conclusion being evaluated. |
| Population and time boundary | Defines what records, events, and period are in scope. |
| Representations and sources | Identifies source, target, consumer view, and authority assumptions. |
| Risk and impact | Explains potential harm if the claim is wrong. |
| Evidence mechanism | Names query, rule, reconciliation, invariant, review, controlled observation, or other mechanism. |
| Oracle or comparison | States what judges the observation and whether shared-logic risk exists. |
| Observation and interpretation | Separates result from what it supports. |
| Limitation and evidence gap | Makes exclusions, staleness, incomplete source, or unknown semantics visible. |
| Owner and action | Makes response and accountability inspectable. |
| Residual risk and revision trigger | States what remains and when the conclusion must be reassessed. |

The matrix may contain a small number of high-value rows. Quality comes from clarity and decision relevance, not from volume.

### Partially completed Evidence Matrix

The following rows use the synthetic evidence packet. They are intentionally incomplete. Complete or challenge the blank fields; do not assume that a named source, a passing count, or a current dashboard answers the whole claim.

| Claim | Population | Consumer | Source | Evidence | Oracle | Result | Limitation | Residual risk | Action |
|---|---|---|---|---|---|---|---|---|---|
| The 30 June report represents each eligible settlement once or as an approved exception. | Local-close settlements before `21:59:59Z`, with documented late-arrival treatment. | Finance lead. | Ledger close snapshot and revenue report. | Keyed comparison: two source and two report records; €190.00 versus €200.00. | Local-close rule using `Europe/Berlin`; stable settlement/order mapping. | `S-904` is source-only; `R-902` is target-only under the local-close rule. | No provider confirmation or full bank-transfer extract is supplied. | Full close can omit or misdate revenue. | **Learner: propose containment, owner, and revision trigger.** |
| Eligible issued refunds are visible to Support or represented as a safe exception. | Refunds issued before the support cutoff. | Support lead and agents. | Refund event `RF-7002`, ingestion receipt, quarantine record, dashboard view. | Receipt proves arrival; quarantine reason records `MERCHANT_CREDIT`; dashboard omission is observed. | **Learner: identify the authoritative eligibility rule and consumer fallback.** | **Learner: classify whether the claim is contradicted, provisional, or unsupported.** | The packet does not supply the full refund population or final semantic treatment of `MERCHANT_CREDIT`. | **Learner: assess customer-conversation risk.** | **Learner: propose an action without assuming a platform change.** |
| `PRE_ORDER` is interpreted consistently for product and fulfilment decisions. | Products emitted as `PRE_ORDER` by supplier Version N+1. | Product and fulfilment owners. | Supplier event for `P-440`, contract version, storefront and fulfilment views. | Different consumer outcomes are observed for the same product state. | Versioned semantic contract and agreed release-date meaning. | Storefront and fulfilment meanings conflict. | No final product-policy decision or consumer communication record is supplied. | Customers may be promised immediate availability incorrectly. | **Learner: assign owner, communication, and adoption evidence.** |
| Checkout conversion is fit for the rollout decision. | Qualified human attempts initiated on 1 July and attributed outcomes within the agreed window. | Product leadership. | Attempt events, order events, segment history, dashboard definition. | Dashboard reports 5 / 107 = 4.67%; packet identifies 100 intended attempts and seven multiply joined attempts. | One attempt per `attempt_id`, event-time cohort, consistent human-traffic rule. | Metric definition is challenged; corrected value remains to be calculated and interpreted. | No compatible baseline or release-exposure evidence is supplied. | A rollback could be based on an unsupported trend. | **Learner: state the next evidence and decision limit.** |

The matrix is not a documentation template to complete mechanically. Its purpose is to make a decision-facing claim, its evidence boundary, and the next accountable action challengeable.

## Integrating Earlier Artifacts

The portfolio should reuse and refine the work produced in Chapters 1–10:

| Earlier artifact | Capstone contribution |
|---|---|
| Data Quality Evidence Review | Decision, claim, source/oracle, limitation, and residual-risk language |
| Representation and Quality-Dimension Analysis | Meaning, identifiers, null/default, unit, precision, and temporal assumptions |
| Data Integrity and Relationship Analysis | Population, keys, unmatched sets, and relationship evidence |
| Transformation Quality Evidence Plan | Mapping, business-rule, calculation, and independent-oracle evidence |
| Pipeline Quality Evidence Map | Stage boundaries, rejected records, partial processing, and consumer impact |
| Cross-System Reconciliation Strategy | Comparable populations, mappings, exception classification, and tolerance |
| Temporal Data Quality Investigation | Cutoff, late/replayed/corrected data, convergence, and revision policy |
| Data Trust Boundary and Ownership Review | Contract, lineage, provenance, authority, stewardship, and escalation |
| Analytics and Metric Integrity Review | Definition, numerator/denominator, grain, reporting period, and interpretation |
| Production Data Quality Learning Review | Change impact, controls, regression evidence, obsolete checks, and learning loop |

Reuse does not mean attach every artifact unchanged. Consolidate, remove duplication, and refine conflicting assumptions. A good capstone makes the relationships among artifacts clearer than they were in isolation.

## Data Quality Decision Brief

The **Data Quality Decision Brief** is a concise communication for an accountable stakeholder. It should distinguish the following elements explicitly:

| Element | Required statement |
|---|---|
| Fact | What was observed, in which source, population, period, and condition? |
| Interpretation | What does the observation reasonably indicate? |
| Recommendation | What action is proportionate now? |
| Evidence gap | What material question remains unanswered? |
| Limitation | What does the evidence not establish? |
| Residual risk | What harmful outcome remains possible if the decision proceeds? |
| Mitigation or acceptance | What control, limitation, or accountable acceptance is proposed? |
| Revision trigger | What new evidence, time, change, or threshold requires reassessment? |

Do not present a recommendation as fact. Do not use “data is clean” or “pipeline is healthy” without bounded claims. The brief should help a stakeholder understand what is safe to decide now and what is not.

### Annotated partial Decision Brief: 30 June revenue use

The following fictional example is intentionally partial. It models precise communication, not a final answer for every condition in the evidence packet.

**Decision and consumer:** Finance lead deciding whether the 30 June revenue report may be used for a full close.

- **Fact:** The local-close ledger snapshot contains `S-901` for €120.00 and `S-904` for €70.00, totalling €190.00. The revenue report contains `R-901` for €120.00 and `R-902` for €80.00, totalling €200.00. `S-904` occurred before the local close but was received after the report snapshot; `S-902` occurred after the local close when interpreted in `Europe/Berlin`.
- **Interpretation:** The report does not represent the defined local-close settlement population. Equal record counts do not indicate agreement because the two populations contain different keyed facts.
- **Recommendation:** Do not use the report for a full close. Correct the local-date rule, investigate and classify `S-904`, and issue a clearly labelled provisional view only if Finance's policy permits it.
- **Evidence gap:** The packet does not include bank-provider confirmation, reversal state, or a complete settlement extract for `S-904`.
- **Limitation:** The comparison evaluates the supplied close records. It does not establish completeness of all settlements, supplier-cost correctness, or the validity of unrelated report fields.
- **Residual risk:** Acting before the pending and target-only records are resolved could misstate revenue and lead to an inappropriate close decision.
- **Mitigation or acceptance:** Keep the report out of the full-close path; assign Finance and the settlement-source owner to the pending item; retain the mismatch as an explicit exception rather than offsetting it in a total.
- **Revision trigger:** Reassess when the agreed late-arrival window expires, provider evidence for `S-904` is available, the local-date correction is deployed, or the unmatched set changes.

The first sentence is a fact because it states observed records, amounts, and timing. “Do not use the report” is a recommendation, not a fact. “Could misstate revenue” is residual risk, not proof that an error has already reached every consumer. Keeping these categories separate enables a stakeholder to challenge the right part of the reasoning.

## Capstone Workflow

Use the following staged workflow. It is an **original MSQE educational framing** for integration, not a mandatory project lifecycle. Work from the supplied evidence toward a decision; do not begin by listing generic checks. A later stage may expose an earlier assumption that needs revision.

| Stage | Objective | Evidence available | Guiding questions | Expected output | Common weak approach | Quality indicators |
|---|---|---|---|---|---|---|
| 1 — Understand the decision context | Select the decisions that make the evidence consequential. | Close cutoff, Finance, Support, Operations, and Product needs in the packet. | Who acts? What can go wrong? What decision cannot wait? | A decision map with two to four consumers, consequence, time sensitivity, and owner. | Start with “test all tables.” | Decisions are bounded, accountable, and tied to the scenario. |
| 2 — Define claims and consumers | Turn decisions into challengeable data claims. | Consumer-facing report, dashboard, fulfilment, and rollout observations. | What must be true for each decision? Which consumer uses the result? | Two to four claims with consumer, representation, and decision limit. | Call a whole dataset “clean” or “healthy.” | Each claim says what is in scope and what action it supports. |
| 3 — Establish populations and authoritative sources | Define the records, time rules, and sources to compare. | Settlement/refund identifiers, event and receipt times, supplier event version. | Which local cutoff applies? Which source owns the fact? What is excluded or pending? | A population-and-source map with keys, lifecycle, time basis, and exclusions. | Compare visible target rows without defining expected population. | Source authority and temporal assumptions are explicit. |
| 4 — Assess representation and quality dimensions | Identify whether values retain the distinctions consumers need. | EUR minor-unit cost, local versus UTC date, `PRE_ORDER`, refund reason. | What does the value mean? Are units, nulls, enums, and time representations fit for use? | A concise representation profile and selected contextual dimensions. | Treat a parseable string or numeric field as semantically safe. | Dimensions illuminate a decision risk rather than form a generic scorecard. |
| 5 — Investigate integrity and relationships | Challenge identity, multiplicity, and cross-record consistency. | `order_id`, settlement IDs, refund ID, report IDs, attempt IDs. | Which identities are stable? Is the relationship one-to-one, one-to-many, or many-to-one? | An integrity note identifying expected matches, exceptions, and unknown relationships. | Use one inner join and infer that omitted rows do not matter. | Relationship cardinality and unmatched sets are inspectable. |
| 6 — Evaluate transformations | Test whether mapping and derivation preserve intended meaning. | `O-4102` cost scale and local-date result; default-cost condition from the scenario. | Which rule maps raw cost and business date? What independent calculation can challenge it? | A transformation evidence row with rule source, expected result, actual result, and exception path. | Reuse the production expression as the sole oracle. | Independent reasoning exposes unit, date, default, or aggregation assumptions. |
| 7 — Evaluate pipeline evidence | Locate the boundary between source occurrence and consumer absence. | `RF-7002` source event, receipt, quarantine reason, dashboard omission. | Was the record absent, rejected, delayed, transformed, stored, or hidden? | A source-to-consumer boundary map and an exception statement. | Investigate the dashboard first and infer a rendering defect. | The conclusion distinguishes receipt from processing and consumer visibility. |
| 8 — Reconcile systems | Explain agreement, pending differences, and unresolved differences. | Ledger €190.00, report €200.00, `S-904`, `R-902`, counts of two each. | Are populations comparable? Do equal counts hide different keys? Which differences are pending or unexplained? | A reconciliation result with matched, pending, and unresolved sets. | Accept matching counts or offsetting totals as a green result. | Keyed evidence, amount reasoning, exception owner, and close implication agree. |
| 9 — Resolve temporal ambiguity | State what was true at each decision moment and what requires revision. | Event, receipt, processing, and close times for `S-904`; report snapshot. | Is the result provisional, final for a policy, stale, or corrected? What makes it complete? | A time model and revision trigger for affected claims. | Treat a late arrival as automatically defective or automatically irrelevant. | The conclusion names time zone, cutoff, late-arrival policy, and consumer effect. |
| 10 — Evaluate contracts, provenance, and ownership | Make semantic change and accountability inspectable. | `PRE_ORDER`, Version N+1, storefront and fulfilment outcomes. | Who owns the new meaning? Which activity produced each view? How was change communicated? | A contract/provenance/ownership note with escalation route. | Assume schema compatibility proves consumer compatibility. | Entity, activity, agent, version, consumer impact, and owner are clear. |
| 11 — Validate analytics and reporting | Decide whether the metric supports the rollout decision. | Dashboard 5/107 = 4.67%; intended 100 attempts; multiply joined attempts. | What are numerator, denominator, grain, cohort, period, and filter rules? | A metric-integrity conclusion separating observation from decision use. | Treat a precise displayed percentage as causal evidence. | Corrected population/grain, limitations, and the next evidence need are stated. |
| 12 — Produce strategy and Decision Brief | Integrate selected evidence into proportionate action. | Completed or challenged prior artifacts and remaining evidence gaps. | What is supported now? What must not be decided? Who acts, and when is the conclusion revisited? | Evidence Matrix, risk/action plan, and concise Decision Brief. | Paste all chapter artifacts together without resolving contradictions. | Facts, interpretation, recommendation, uncertainty, ownership, and revision triggers remain distinct. |

The workflow is deliberately revisable. For example, the reconciliation stage may show that the population defined in Stage 3 omitted a timing condition, or the contract stage may show that a representation profile needs clarification. Record the change rather than silently rewriting the earlier conclusion.

## Quality Criteria for the Portfolio

Review the completed work against these qualitative questions:

- Does each major claim identify a consumer, population, time boundary, and representation?
- Are data-quality dimensions used as context-sensitive lenses rather than a scorecard?
- Do transformation, reconciliation, temporal, contract, and reporting concerns have distinct ownership and evidence?
- Are independent or complementary oracles selected where shared logic could create false confidence?
- Are late, rejected, missing, duplicated, corrected, and unknown populations visible rather than silently excluded?
- Does the portfolio distinguish observation from interpretation and action?
- Are limitations, residual risks, mitigation or acceptance, and revision triggers explicit?
- Could another engineer understand and challenge the strategy without access to a proprietary platform?

These criteria guide reflection and review. They do not convert the capstone into a numerical maturity score.

## Portfolio Presentation Guidance

Present the capstone as a concise engineering portfolio, not as a claim that a learner has certified a system or is ready for a particular role. The portfolio should make reasoning inspectable by a reviewer who was not present during the investigation.

### Disclose what the portfolio is based on

Include a short statement such as: *“This portfolio uses the fictional Atlas Commerce evidence packet and synthetic identifiers, amounts, timestamps, and events. It does not contain production data, customer information, credentials, or proprietary schemas.”* If a learner adapts the format for work they are authorised to discuss, they should still remove sensitive information and identify what has been safely represented.

Separate supplied evidence from assumptions. For each material assumption, state why it was needed, who could confirm it, and how the decision would change if it proved false. For example, a learner may assume that the ledger is authoritative for settlement occurrence, but should identify the missing provider confirmation for `S-904` and avoid treating that assumption as proof.

### Make provenance and scope reviewable

For each high-value claim, name the source representation, extraction or observation context, relevant version, time boundary, and transformation or comparison that produced the result. A reviewer should be able to answer:

- Which decision is this evidence intended to support?
- Which population, time rule, and representation are included or excluded?
- Which source is authoritative for this particular fact, and why?
- Is the result an observed fact, an interpretation, or a recommendation?
- What limitation, unresolved question, and remaining risk prevent a stronger conclusion?
- Who owns the next action, and what evidence will trigger revision?

Do not add fabricated screenshots, operational logs, customer stories, or sample queries merely to make the portfolio look more complete. A clearly stated evidence gap is stronger than an invented observation.

### Reuse artifacts with purpose

Use the Chapter 1–10 artifacts as source material, not as appendices to attach indiscriminately. The portfolio should cross-reference or refine them where they answer a capstone decision:

| Portfolio need | Earlier artifact to reuse or refine |
|---|---|
| Bounded claim, source, oracle, and uncertainty | Data Quality Evidence Review and Representation Analysis. |
| Population, identity, and exception reasoning | Integrity Analysis, Pipeline Map, and Reconciliation Strategy. |
| Mapping, time, and semantic-change evidence | Transformation Plan, Temporal Investigation, and Trust Boundary Review. |
| Consumer decision, metric interpretation, and sustainable action | Analytics Integrity Review and Production Learning Review. |

When two artifacts imply different populations or time rules, resolve the difference in the strategy and explain why. This is evidence integration, not inconsistency to hide.

### Offer defensible alternatives where evidence is incomplete

Some scenarios reasonably permit more than one action. A learner might recommend holding the full close, issuing a provisional close with explicit exceptions, or accepting a bounded operational risk while a source window remains open. Each choice must identify its consumer, evidence threshold, limitation, and accountable acceptance. The reviewer should be able to see why an alternative was not selected; the portfolio is assessed on the quality of reasoning, not on a single predetermined recommendation.

### Preserve the decision history

When new evidence changes a conclusion, retain a short record of the earlier claim, its time boundary, the new observation, and the revision trigger that was met. For example, a corrected historical revenue view should not erase the fact that Finance previously received a provisional close. This record helps a reviewer distinguish an explainable revision from an unexplained change in analysis, while avoiding the need for a production audit platform.

> **Supporting asset (Pass 2, planned):** *Atlas Commerce Evidence Matrix Workbook* will provide a reusable, synthetic template for the capstone without requiring production data or a companion implementation.

## Engineering Perspective

An integrated strategy demonstrates the Quality Engineer’s contribution across data boundaries: clarifying claims, exposing ambiguous representations, selecting meaningful evidence, connecting technical conditions to business decisions, and communicating residual risk. It does not mean that the Quality Engineer owns every source, transformation, or business decision.

The strongest portfolio is proportionate. It directs attention to the decisions and evidence gaps with the greatest consequence rather than attempting to measure every field or automate every rule.

## Industry Perspective

The capstone draws on formal and transferable vocabulary without claiming that any standard supplies a complete strategy. ISO/IEC 25012 informs structured-data quality concepts.[^iso-25012] ISO/TS 8000-82 informs explicit data rules for assessment.[^iso-8000-82] W3C PROV informs provenance concepts.[^w3c-prov] The portfolio’s decision, risk, evidence, and learning models are original MSQE teaching framings.

## Common Misconceptions

### “The capstone is a larger set of data checks.”

It is an integrated strategy. Checks are selected only when they support a decision-relevant claim and expose their limitations.

### “A complete Evidence Matrix removes residual risk.”

It makes risk and evidence more visible. It cannot prove universal correctness or eliminate every external uncertainty.

### “A Data Quality Decision Brief is a dashboard summary.”

It distinguishes facts, interpretation, recommendation, gaps, limitations, risk, action, and revision triggers. A dashboard may be an input, not the brief itself.

### “Using a framework means following every row for every dataset.”

The matrix is proportionate. Use it to select consequential claims and evidence, not to create documentation volume.

### “The Quality Engineer owns every correction.”

The strategy makes ownership and escalation explicit across producer, transformation, consumer, business, and decision roles.

## Summary

The Data Quality Strategy and Evidence Portfolio integrates the Part VI progression: claims, representations, dimensions, query evidence, transformations, pipelines, reconciliation, time, contracts, provenance, analytics, and production learning. Its professional value comes from connecting those capabilities to accountable decisions.

The final output is a concise, challengeable explanation of what evidence supports, what it does not, what action is recommended, who owns the next step, and when the conclusion must be revised.

## Key Takeaways

- A data-quality strategy connects decisions, claims, populations, evidence, ownership, limitations, and residual risk.
- The Evidence Matrix makes the purpose and limits of each evidence item inspectable.
- Earlier artifacts should be reused and refined into one coherent portfolio, not duplicated.
- A Decision Brief must distinguish fact, interpretation, recommendation, evidence gap, limitation, residual risk, mitigation or acceptance, and revision trigger.
- The capstone demonstrates system-level data-quality judgement without requiring a vendor platform or production data.
- A credible strategy supports accountable decisions while avoiding claims of universal data correctness.

## Review Questions

1. What makes a Data Quality Strategy different from a collection of checks?
2. Which fields must an Evidence Matrix include to support reviewable decision-making?
3. Why should the capstone reuse prior artifacts rather than reproduce them independently?
4. How do fact, interpretation, and recommendation differ in a Decision Brief?
5. What makes an oracle choice weak even when a check passes?
6. How should a strategy represent a known but unresolved population?
7. Why is a revision trigger essential for temporal or changing data claims?
8. How does the capstone demonstrate QA-to-QE progression?

## Interview Questions

1. How would you create a data-quality strategy for a new marketplace integration with finance and customer-support consumers?
2. What would you include in an Evidence Matrix for a provisional revenue decision?
3. How would you communicate a recommendation when evidence is incomplete but a decision cannot wait?
4. How do you avoid turning Data Quality Engineering into a universal scorecard or a tool project?
5. Describe how you would assign ownership for an unresolved data-quality risk that crosses several teams.

## Practical Exercise

### Capstone: Atlas Commerce Data Quality Strategy and Evidence Portfolio

**Objective:** Produce an integrated, decision-oriented strategy for the Atlas Commerce marketplace rollout.

**Scenario:** Use the conditions described in this chapter. You may reuse and refine prior Part VI artifacts. Treat all information as fictional. Do not introduce production data, credentials, vendor-platform configuration, or unsupported observations.

**Required deliverables:**

1. **Context and decision map** for two to four consequential decisions and consumers.
2. **Quality-claim and representation map** defining populations, time boundaries, authoritative sources, transformations, and material quality dimensions.
3. **Evidence Matrix** containing at least six high-value evidence rows across transformation, pipeline, reconciliation, temporal, trust-boundary, analytics, and production-learning concerns.
4. **Risk and action plan** identifying supported, provisional, unresolved, and contradicted claims; owners; mitigations or acceptance; and revision triggers.
5. **Data Quality Decision Brief** of no more than two pages, separating fact, interpretation, recommendation, evidence gap, limitation, residual risk, mitigation or acceptance, and revision trigger.

**Constraints:**

- Do not claim that any report, pipeline, or dataset is universally correct.
- Do not reward query count, assertion count, field count, or platform complexity.
- State meaningful populations, representations, oracle limitations, and residual risk.
- Use safe synthetic information only.

**Expected artifact:** A **Data Quality Strategy and Evidence Portfolio** plus concise **Data Quality Decision Brief**. The portfolio should be approximately 6,000–8,000 words when developed as a full standalone submission, excluding appendices or safely represented evidence tables.

**Reflection:** Which of your proposed evidence items most directly changes a decision? Which appears technically strong but remains weak because of its population, oracle, or semantic limitation?

**Portfolio relevance:** This capstone demonstrates applied Data & Database Quality capability at the Practitioner-to-Engineer transition. It should show judgement, trade-offs, boundaries, and learning—not a claim of sole ownership of an organisation’s data quality.

## Further Reading

- [ISO/IEC 25012:2008 — Data Quality Model](https://www.iso.org/standard/35736.html)
- [ISO/TS 8000-82:2022 — Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html)
- [W3C PROV-DM: The PROV Data Model](https://www.w3.org/TR/prov-dm/)
- [Part VI — Data Quality Engineering](../README.md)

## References

[^iso-25012]: International Organization for Standardization. [ISO/IEC 25012:2008 — Software engineering — Software product Quality Requirements and Evaluation (SQuaRE) — Data quality model](https://www.iso.org/standard/35736.html). 2008; confirmed current by ISO catalogue, accessed 2026-08-11.
[^iso-8000-82]: International Organization for Standardization. [ISO/TS 8000-82:2022 — Data quality — Part 82: Data quality assessment: Creating data rules](https://www.iso.org/standard/78707.html). 2022; accessed 2026-08-11.
[^w3c-prov]: World Wide Web Consortium. [PROV-DM: The PROV Data Model](https://www.w3.org/TR/prov-dm/). W3C Recommendation, 30 April 2013; accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Connect data-quality evidence to accountable consumer decisions.
- [ ] Build an Evidence Matrix with claims, populations, sources, oracles, limitations, ownership, and risk.
- [ ] Reuse and refine prior evidence artifacts without duplication.
- [ ] Write a Decision Brief that distinguishes facts, interpretation, recommendation, gaps, limitations, risk, action, and revision triggers.
- [ ] Explain how the strategy improves data-quality judgement without claiming universal correctness.
