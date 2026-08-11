# Part VI – Data Quality Engineering

---

## Curriculum Status

**Curriculum complete. Chapters 1–11 are manuscript-complete and remain Draft.** The Final Part VI Quality Gate passed at **96/100** with no manuscript P0, P1, or P2 findings. The manuscript baseline is committed as `6ca58c6`; `release/v0.9.0` is prepared from `develop` and is undergoing Release Candidate validation for **v0.9.0 — Data Quality Engineering Complete**. Quality Gates v1.1 confirms that the Atlas Commerce Data Pipeline companion and Labs 1–3 are recommended Pass 2 enrichment, not release requirements. No companion code, laboratories, diagrams, case studies, website work, or CI/CD implementation has been created. Main promotion, tagging, and GitHub Release publication remain pending. Part VII has not started.

---

## Purpose

Part VI develops Data Quality Engineering as the practice of designing, evaluating, and improving trustworthy evidence about data as it moves through representations, transformations, storage, pipelines, interfaces, and business decisions.

The central question is not *does this field contain the expected value?* It is:

> **What data claim matters to this decision, which source and transformation assumptions must hold, and what evidence is sufficient to state the remaining uncertainty honestly?**

The curriculum moves experienced QA Engineers from isolated field checking toward reasoning about populations, transformations, time, provenance, reconciliation, consumer meaning, and residual risk. It is not a SQL textbook, database-administration course, data-engineering implementation course, BI-tool tutorial, or product-specific ETL training.

---

## Intended Reader and Prerequisites

This part is for experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers who need to evaluate data-bearing systems beyond interface behaviour alone.

Readers should have completed, or have equivalent capability from:

- Part I — Foundations, especially systems thinking, quality risk, and evidence limits;
- Part II — Programming, especially types, data structures, files, errors, and maintainable utilities;
- Part III — Software Testing Engineering, especially risk analysis, testability, evidence boundaries, reliable checks, and production learning;
- Part IV — API Quality Engineering, especially interface representations, contracts, state, asynchronous behaviour, and integration evidence; and
- Part V — Automation Engineering, especially proportionate feedback, deterministic state, diagnostics, and automation limitations.

---

## Scope and Boundaries

Part VI owns **data-quality evidence and data-system quality reasoning**. It teaches how to form and evaluate data claims, not how to administer an enterprise data estate or implement a specific platform.

| Concern | Part VI responsibility | Deferred ownership |
|---|---|---|
| General risk, testing strategy, exploration, and evidence principles | Apply them to data questions. | Part III owns the general theory. |
| API semantics, protocol contracts, and interface identity | Use an interface as a data boundary where relevant. | Part IV owns API-quality strategy. |
| Automation frameworks, runner design, and CI-oriented suite operation | Specify useful data evidence and automation limits. | Part V owns automation-system engineering. |
| SQL, transformations, reconciliation, lineage, and data contracts | Evaluate their quality implications and evidence. | Part VI owns this reasoning. |
| Pipeline orchestration, cloud infrastructure, secrets, and deployment controls | Identify constraints and collaboration needs. | Part VII owns implementation. |
| Telemetry platforms, SLOs, incident command, and SRE practice | Use production learning as an evidence input. | Part VIII owns implementation. |
| AI/ML evaluation and AI-data governance | Identify an upstream data-quality concern when relevant. | Part IX owns AI-system quality. |
| Performance, security, threat modelling, and penetration testing | State data-related limits and hand-offs. | Part X owns specialist engineering. |
| Deep distributed-system topology and enterprise data architecture | Reason about visible boundaries and assumptions. | Part XI owns deep architecture. |

---

## Curriculum Progression

The progression is deliberately evidence-led:

```text
Field and value checking
        ↓
Population, representation, and relationship reasoning
        ↓
Transformation and pipeline evidence
        ↓
Reconciliation and temporal data judgement
        ↓
Contracts, provenance, ownership, and reporting integrity
        ↓
Production learning, sustainability, and data-quality strategy
```

Two **original MSQE educational framings** support the part. They describe questions to ask; they do not prescribe a mandatory data architecture or maturity model.

```text
Source → ingestion → transformation → storage → serving/consumer

Risk → data expectation → evidence boundary → oracle/comparison
     → limitation → residual risk
```

---

## Proposed Chapter Architecture

### [Chapter 1 — Data Quality Engineering: Evidence, Meaning, and Risk](chapters/chapter-01-data-quality-engineering-evidence-meaning-and-risk.md)

- **Purpose:** Establish data quality as contextual evidence for a decision rather than a catalogue of field checks.
- **Primary concepts:** Data claim; consumer; authoritative source; population; data-quality risk; oracle; limitation; residual risk; quality dimensions as contextual lenses.
- **Learner outcome:** Frame a data-quality question in terms of decision, population, source, expectation, evidence, and uncertainty.
- **QA → QE contribution:** Moves from checking a value to explaining whether a data claim supports a business or engineering decision.
- **Dependency:** Parts I and III evidence foundations.
- **Practical activity and artifact:** Data Quality Evidence Review and a risk-to-evidence matrix.
- **Scope boundary and deferral:** Does not teach SQL syntax, a platform, a universal dimension scorecard, or enterprise data governance.
- **Likely references:** ISO/IEC 25012; ISO 8000 data-quality guidance; MSQE evidence framing.

### [Chapter 2 — Data Representations, Models, and Contextual Quality Dimensions](chapters/chapter-02-data-representations-models-and-contextual-quality-dimensions.md)

- **Purpose:** Examine how representation choices make data trustworthy, ambiguous, or misleading before any transformation begins.
- **Primary concepts:** Types; nullability; identifiers; enums; units; precision; rounding; dates and timestamps; time zones; normalization; correctness, completeness, consistency, uniqueness, validity, timeliness, integrity, and semantic fitness.
- **Learner outcome:** Define a context-specific representation profile and explain why structurally valid data may still be semantically wrong.
- **QA → QE contribution:** Replaces generic validation with explicit representation, consumer, and meaning assumptions.
- **Dependency:** Chapter 1.
- **Practical activity and artifact:** Representation and Quality-Dimension Profile for a fictional order dataset.
- **Scope boundary and deferral:** Does not become data modelling notation training, database design, or a standards recitation.
- **Likely references:** ISO/IEC 25012; ISO/TS 8000-82; Part II type and validation foundations.

### [Chapter 3 — Query-Based Data Evidence, Integrity, and Relationships](chapters/chapter-03-query-based-data-evidence-integrity-and-relationships.md)

- **Purpose:** Teach SQL and constraints as bounded mechanisms for answering data-quality questions.
- **Primary concepts:** Selection; filtering; joins; grouping; aggregates; comparison queries; constraints; referential integrity; parent/child relationships; cross-table consistency; independent oracles.
- **Learner outcome:** Write or review a focused query-evidence plan and state what its result does and does not establish.
- **QA → QE contribution:** Moves from executing queries to selecting a query, relationship, and oracle that can support a specific claim.
- **Dependency:** Chapter 2; Part II SQL foundations where needed.
- **Practical activity and artifact:** Integrity and Relationship Evidence Review.
- **Scope boundary and deferral:** Does not provide SQL certification, query-optimizer tuning, database administration, or an exhaustive language reference.
- **Likely references:** ISO/TS 8000-82; relevant database documentation as illustrative, non-authoritative examples.

### [Chapter 4 — Transformation Quality and Business Rules](chapters/chapter-04-transformation-quality-and-business-rules.md)

- **Purpose:** Evaluate whether mappings, derivations, filters, enrichments, and aggregations preserve intended business meaning.
- **Primary concepts:** One-to-one mapping; many-to-one aggregation; derivation; filtering; enrichment; unit conversion; precision; null/default handling; time-zone conversion; shared-logic oracle risk.
- **Learner outcome:** Produce an evidence plan that challenges a transformation independently of its implementation.
- **QA → QE contribution:** Develops transformation reasoning rather than asserting that a successful job proves correct data.
- **Dependency:** Chapters 1–3.
- **Practical activity and artifact:** Transformation Evidence Plan with independent calculations and stated assumptions.
- **Scope boundary and deferral:** Does not teach dbt, Spark, ETL tooling, or implementation patterns for a specific transformation engine.
- **Likely references:** ISO/IEC 25012; ISO 8000 data-rule guidance; practitioner literature on data testing and transformation assurance.

### [Chapter 5 — Pipeline Quality: Ingestion, Processing, Storage, and Consumers](chapters/chapter-05-pipeline-quality-ingestion-processing-storage-and-consumers.md)

- **Purpose:** Treat a pipeline as a chain of quality-relevant boundaries rather than a single successful run.
- **Primary concepts:** Source; ingestion; staging; transformation; storage; serving; consumer; hand-off assumptions; partial failure; idempotent reruns; dependency evidence; pipeline observability limits.
- **Learner outcome:** Map a pipeline’s evidence boundaries and identify where records may be lost, duplicated, delayed, or semantically changed.
- **QA → QE contribution:** Shifts attention from a job-status result to the integrity of the data journey and consumer impact.
- **Dependency:** Chapter 4; Part IV asynchronous and integration reasoning.
- **Practical activity and artifact:** Pipeline Quality Map with boundary-specific expectations and limitations.
- **Scope boundary and deferral:** Does not configure orchestration, cloud storage, secrets, runners, or delivery infrastructure.
- **Likely references:** ISO/IEC 25012; ISO 8000; MSQE pipeline and evidence framings.

### [Chapter 6 — Reconciliation and Cross-System Consistency](chapters/chapter-06-reconciliation-and-cross-system-consistency.md)

- **Purpose:** Make reconciliation a central capability for comparing data across sources, targets, and business views.
- **Primary concepts:** Counts; keyed matching; unmatched sets; totals; aggregates; business invariants; tolerances; sampling; expected discrepancies; partial reconciliation; source-to-target comparison.
- **Learner outcome:** Design a reconciliation strategy that can distinguish equal counts from meaningful agreement.
- **QA → QE contribution:** Enables readers to explain why equal counts do not prove equal data or correct business outcomes.
- **Dependency:** Chapters 3–5.
- **Practical activity and artifact:** Source-to-Target Reconciliation Strategy.
- **Scope boundary and deferral:** Does not create a reconciliation platform, prescribe a warehouse, or promise full comparison for every dataset.
- **Likely references:** ISO/IEC 25012; ISO 8000 data-rule guidance; domain-specific accounting or operational controls where applicable.

### [Chapter 7 — Batch, Streaming, and Temporal Data Quality](chapters/chapter-07-batch-streaming-and-temporal-data-quality.md)

- **Purpose:** Build practical judgement about time, completeness windows, reruns, and delayed or repeated data.
- **Primary concepts:** Batch population; partial load; cutoff window; freshness; event time; processing time; late arrival; duplicate; ordering; replay; backfill; historical correction; eventual state; watermark/window concepts.
- **Learner outcome:** Define a time-aware evidence strategy and distinguish a late or partial result from a simple data-value defect.
- **QA → QE contribution:** Moves from static snapshots to explainable claims about the population and time period represented.
- **Dependency:** Chapters 5–6; Part IV asynchronous behaviour.
- **Practical activity and artifact:** Temporal Data Investigation Record.
- **Scope boundary and deferral:** Does not teach broker configuration, stream-processing internals, distributed scheduling, or deep event-system architecture.
- **Likely references:** ISO/IEC 25012 for context; primary platform documentation only when used as a bounded illustration.

### [Chapter 8 — Data Contracts, Lineage, Provenance, and Ownership](chapters/chapter-08-data-contracts-lineage-provenance-and-ownership.md)

- **Purpose:** Make data expectations, evolution, origin, and accountability inspectable across producer and consumer boundaries.
- **Primary concepts:** Schema expectation; semantic contract; ownership; authoritative source; consumer impact; compatibility; lineage; provenance; transformation history; trust boundary; stewardship; escalation.
- **Learner outcome:** Create a concise data contract and provenance brief that identifies owners, assumptions, evolution risk, and unresolved uncertainty.
- **QA → QE contribution:** Extends interface-contract thinking to data meaning, history, and consumer decisions.
- **Dependency:** Chapters 2–7; Part IV contract concepts.
- **Practical activity and artifact:** Data Contract and Provenance Brief.
- **Scope boundary and deferral:** Does not repeat API-protocol contract strategy, prescribe a lineage platform, or establish an enterprise governance programme.
- **Likely references:** W3C PROV; ISO/IEC 5259 data-quality management guidance where analytics or ML context is relevant.

### [Chapter 9 — Analytics, Metrics, and Reporting Integrity](chapters/chapter-09-analytics-metrics-and-reporting-integrity.md)

- **Purpose:** Evaluate whether dashboards, KPIs, and reports are numerically and semantically trustworthy.
- **Primary concepts:** Metric definition; numerator; denominator; aggregation; grouping; dimensional consistency; filter; reporting period; time window; baseline; drill-down; business invariant; decision impact.
- **Learner outcome:** Review a reporting claim and identify the data definitions, aggregations, exclusions, and limitations that affect trust.
- **QA → QE contribution:** Develops evidence-based challenge of metrics rather than visual dashboard checking.
- **Dependency:** Chapters 4, 6, and 7.
- **Practical activity and artifact:** Analytics Integrity Review.
- **Scope boundary and deferral:** Does not teach BI tooling, dashboard design, data science, or organizational KPI management.
- **Likely references:** ISO/IEC 25012; data-management guidance; domain definitions and controlled business rules.

### [Chapter 10 — Production Data Learning, Change, and Sustainability](chapters/chapter-10-production-data-learning-change-and-sustainability.md)

- **Purpose:** Connect escaped defects, population shifts, change impact, ownership, and maintenance to continuous data-quality improvement.
- **Primary concepts:** Data defect; stale reference data; regression; backfill; schema evolution; drift; reconciliation failure; learning loop; quality debt; review point; ownership; safe diagnostic data.
- **Learner outcome:** Produce a data-defect learning record and a proportionate improvement proposal.
- **QA → QE contribution:** Treats a data defect as evidence about a data system and its controls, not merely a failed check.
- **Dependency:** Chapters 1–9; Part III production learning; Part V sustainable feedback.
- **Practical activity and artifact:** Data Defect Learning Record and Sustainability Plan.
- **Scope boundary and deferral:** Does not implement observability platforms, SLOs, incident command, or organisational data-governance bureaucracy.
- **Likely references:** ISO 8000 data-quality management guidance; Part VIII collaboration boundaries; MSQE learning framing.

### [Chapter 11 — Capstone: Data Quality Strategy and Evidence Portfolio](chapters/chapter-11-capstone-data-quality-strategy-and-evidence-portfolio.md)

- **Purpose:** Integrate Part VI into a portfolio-ready strategy that connects a data risk to suitable evidence, decisions, limitations, and improvement.
- **Primary concepts:** Data-risk profile; source/target map; quality dimensions; transformation evidence; reconciliation; temporal conditions; lineage; reporting integrity; residual risk; decision brief.
- **Learner outcome:** Present an integrated Data Quality Strategy and Evidence Portfolio that another engineer can inspect and challenge.
- **QA → QE contribution:** Demonstrates system-level data-quality judgement and clear communication of evidence limits.
- **Dependency:** Chapters 1–10.
- **Practical activity and artifact:** Data Quality Strategy and Evidence Portfolio plus concise Data Decision Brief.
- **Scope boundary and deferral:** Does not require production data, live infrastructure, a warehouse account, a data platform, a companion application, or Part VII implementation.
- **Likely references:** The Part VI reference set and explicitly labelled original MSQE portfolio framing.

---

## Delivery Structure

| Delivery | Chapters | Status | Capability focus | Cumulative professional artifacts |
|---|---:|---|---|---|
| Delivery 1 — Meaning, Representation, and Integrity | 1–3 | Complete; all chapters Draft. | Data claims, contextual dimensions, queries, and relationships. | Data Quality Evidence Review; Representation Analysis; Data Integrity and Relationship Analysis. |
| Delivery 2 — Transformation, Pipelines, and Reconciliation | 4–6 | Complete; all chapters Draft. | Transformations, data movement, and cross-system agreement. | Transformation Quality Evidence Plan; Pipeline Quality Evidence Map; Cross-System Reconciliation Strategy. |
| Delivery 3 — Time, Trust Boundaries, and Reporting | 7–9 | Complete; all chapters Draft. | Temporal data, provenance, contracts, ownership, and analytical integrity. | Temporal Data Quality Investigation; Data Trust Boundary and Ownership Review; Analytics and Metric Integrity Review. |
| Delivery 4 — Learning and Integrated Strategy | 10–11 | Complete; all chapters Draft. | Production learning, sustainability, and end-to-end data-quality judgement. | Production Data Quality Learning Review; Data Quality Strategy and Evidence Portfolio. |

---

## Practical-Learning Strategy

Practical work produces concise, inspectable engineering artifacts rather than query counts, test-case volume, or generic checklists. Each artifact must state:

- the decision and consumer it supports;
- the relevant population, source, and transformation assumptions;
- the selected evidence boundary and oracle;
- what the evidence does and does not establish;
- ownership, review point, and residual risk; and
- how sensitive data, credentials, and confidential business information are excluded or safely represented.

Chapter targets should usually be **4,500–6,500 words**. The capstone target is **6,000–8,000 words** because it integrates prior artifacts rather than introducing an additional technical specialism.

---

## SQL and Data-Platform Strategy

SQL is an **evidence mechanism**, not the subject of Part VI. Bounded examples may use `SELECT`, `WHERE`, joins, grouping, aggregates, comparisons, CTEs, and window functions only when they clarify the question, population, oracle, limitation, or residual risk.

Detailed SQL syntax belongs primarily to Part II foundations and, where justified, later Pass 2 practice. Future examples may use relational databases, document stores, warehouses, object storage, or event systems illustratively, but the curriculum requires no Snowflake, BigQuery, Databricks, Kafka, Airflow, dbt, PostgreSQL, or other vendor product.

---

## Companion and Laboratory Strategy

**Companion decision: RECOMMENDED PASS 2.** A later, separately authorised, small deterministic **Atlas Commerce Data Pipeline** companion may use synthetic orders, payments, refunds, fulfilment, and reporting data to support repeated evidence exercises. Quality Gates v1.1 confirms that it is not required for the Part VI manuscript release.

**Laboratory decision: RECOMMENDED PASS 2.** If separately authorised, the planned laboratories are:

1. **Lab 1 — Source-to-Target Reconciliation**
2. **Lab 2 — Transformation and Aggregation Quality**
3. **Lab 3 — Late, Duplicate, and Corrected Data Investigation**

No companion or laboratory is created by this planning document. Quality Gates v1.1 resolves the former policy ambiguity: these explicitly deferred Pass 2 assets do not block the Part VI manuscript release and must pass their own applicable quality validation if later published.

---

## Capstone Scenario

The capstone uses **Atlas Commerce**, a fictional retailer with orders, payments, refunds, customers, catalog data, fulfilment updates, and a daily finance report. The scenario includes asynchronous updates, duplicate or late events, currency or unit conversion, derived revenue fields, partial loads, and cross-system reconciliation differences.

The learner will propose—not implement—a Data Quality Strategy and Evidence Portfolio. It must distinguish facts, interpretations, recommendations, evidence gaps, automation limitations, residual risks, mitigation or acceptance, and revision triggers. Synthetic data and safe abstractions are mandatory; production data and infrastructure are not required.

---

## Reference Strategy

References will distinguish authority from teaching interpretation:

- **Formal standards:** [ISO/IEC 25012:2008 Data Quality Model](https://www.iso.org/standard/35736.html) for structured-data quality concepts; [ISO/TS 8000-82:2022](https://www.iso.org/standard/78707.html) for data rules; and, where analytics or ML context is directly relevant, the ISO/IEC 5259 data-quality series. Standards inform terminology and questions; they do not prescribe the curriculum or a universal scorecard.
- **Formal provenance specification:** [W3C PROV](https://www.w3.org/TR/prov-dm/) for transferable provenance concepts. It is a reference for modelling provenance, not a mandatory lineage implementation.
- **Industry and practitioner literature:** Vendor-neutral data-management, database, and data-engineering literature selected for specific claims, with product documentation used only for clearly labelled examples.
- **MSQE educational framing:** The evidence-flow, portfolio, and decision models above are original teaching framings and will be labelled as such in future chapters.

ISO/IEC 25010 remains relevant when a data concern is also a software-product quality concern; it does not replace a data-quality model.

---

## QA → QE Transition Framework Mapping

**Primary domain:** **Data & Database Quality** — the Transition Framework describes this capability as data models, SQL basics, integrity, migrations, data contracts, lineage, freshness, and reconciliation, with the expected ability to validate critical data rules and explain data-quality risks to a delivery team.

**Contributing domains:** Quality & Testing Foundations; Programming Foundations; API & Integration Engineering; Quality Strategy & Risk Engineering; Systems Thinking & Architecture; Observability & Reliability; and Communication, Leadership & Influence.

The capstone should demonstrate primarily **Practitioner-to-Engineer** evidence: an appropriate, context-sensitive data-quality strategy that states trade-offs and limitations, rather than a maturity score, certification claim, or universal mastery assertion.

---

## Definition of Done for Part VI Manuscript Work

Part VI will be ready for release preparation only when:

1. The curriculum architecture is approved.
2. All planned chapters are drafted with the approved chapter template and remain accurately statused.
3. Each delivery completes its independent review and targeted corrections.
4. A controlled normalization pass and Final Part VI Quality Gate are complete.
5. A stable Git manuscript baseline and release-administration record exist.
6. The release decision clearly separates manuscript readiness, optional Pass 2 enrichment, and formal publication approval.

Quality Gates v1.1 now provides that classification: the companion and Labs 1–3 are recommended Pass 2 enrichment, not required practical assets for v0.9.0. Formal release approval remains a separate decision.

---

## Website Discovery and Future Assets

Future Part VI material will remain discoverable at:

- `book/part-06-data-quality-engineering/README.md`
- `book/part-06-data-quality-engineering/chapters/` when drafting is authorised
- `book/part-06-data-quality-engineering/labs/` only after separate Pass 2 authorisation
- `code/part-06-data-quality-engineering/` only after separate companion authorisation

The website is a separate parallel track and is not modified by this curriculum plan.
