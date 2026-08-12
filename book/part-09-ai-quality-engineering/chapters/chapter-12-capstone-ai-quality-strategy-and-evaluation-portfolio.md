# Chapter 12 — Capstone: AI Quality Strategy and Evaluation Portfolio

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 12 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–11 |
| Estimated study time | 240 minutes, plus the capstone exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An AI quality strategy is credible when it makes claims, evidence, ownership, limits, and decisions coherent across the whole system.

## Opening Story

The following is an **illustrative scenario**. Atlas plans a limited rollout of its Support Assistant, Refund Risk Classifier, and Discovery ranking experience. Each team supplies a dashboard: model metrics, prompt examples, retrieval counts, and API checks. No document explains which claims are release-blocking, how evidence connects to user decisions, who owns residual risk, or what change would require re-evaluation.

The portfolio is busy but not decision ready. The capstone brings the preceding chapters together into a concise strategy that can guide release, learning, and accountable change without pretending to certify every unknown.

## Why This Chapter Matters

AI quality is cross-functional. A model score, a passing API test, or a safe demo cannot substitute for an evidence portfolio spanning product requirements, data, retrieval, model behaviour, tools, evaluation, observability, responsible boundaries, and change control. The portfolio turns that work into an inspectable decision brief.

This capstone is a synthetic planning exercise. It does not create a live AI service, production data set, simulator, lab, certification, or legal assessment.

## Learning Objectives

By the end of this chapter, you should be able to:

- assemble a system-level AI quality strategy;
- prioritise claims by user impact and decision consequence;
- connect evidence to accountable owners and release decisions;
- state residual risks and re-evaluation triggers; and
- produce an AI Quality Strategy and Evaluation Portfolio.

## The Portfolio Structure

| Portfolio section | Decision-oriented content |
| --- | --- |
| System and scope | Intended users, decisions, excluded uses, component and data boundaries |
| Claims and harm | Observable quality, safety, privacy, fairness, accessibility, and authority claims; affected parties |
| Evaluation design | Test data provenance, oracles, rubrics, sampling, evaluators, and limitations |
| Evidence register | Results by slice, versions, calculations, exceptions, and source links |
| Operational controls | Observability, access, incident, rollback, escalation, appeal, and recovery paths |
| Change control | Change inventory, regression portfolio, owner, release hierarchy, and revalidation triggers |
| Decision brief | Recommendation, residual risks, accountable sign-off, and follow-up dates |

The portfolio need not be long. It must be specific enough that another responsible reviewer can understand what was evaluated, what was not, and why the stated decision follows.

## Worked Numerical Reasoning: Do Not Aggregate Away a Boundary Failure

The Atlas evidence register contains the following synthetic results from the named packets below: **CLS-01** strict-threshold precision is `68 / 104 = 65.4%` and recall is `68 / 100 = 68.0%`; its balanced threshold has a modeled local error cost of **EUR9,360** compared with **EUR13,520** at the strict threshold. In **REG-01**, Candidate A improves groundedness from **86 / 100 = 86%** to **90 / 100 = 90%**, while safe, helpful refusal falls from **18 / 20 = 90%** to **15 / 20 = 75%**.

| Element | Evidence and reasoning |
| --- | --- |
| Context | Atlas seeks a limited rollout decision across classifier, ranking, RAG assistant, and bounded tools. |
| Quality claim | Each component must meet its defined decision boundary; a consequential regression cannot be neutralised by a different metric. |
| Evidence | CLS-01 and REG-01 metrics and calculations above, plus source versions, evaluator limitations, and workflow traces in the evidence register. |
| Interpretation | The lower classifier threshold merits domain review; Candidate A must be held because safe-refusal evidence regressed by 15 percentage points despite groundedness improvement. |
| Alternative | Small synthetic samples and evaluator error limit inference; the change may involve several boundaries. |
| Limitation | The portfolio does not establish live impact, regulatory compliance, or universal AI safety. |
| Decision | Do not approve Candidate A. Continue controlled investigation, preserve the baseline, and obtain accountable domain and responsible-AI review before reconsideration. |
| Revision trigger | Any model, prompt, corpus, tool, policy, evaluator, threshold, workflow, or affected-population change. |

This is a **decision brief**, not a scorecard. It names why a result matters, what it cannot prove, and what happens next.

## Atlas Evidence Packet: Release Decision Under Uncertainty

The following synthetic packet deliberately contains conflicting evidence. It consumes the Baseline, Candidate A, and Candidate B identities from **REG-01** in Chapter 11; it does not introduce an unnamed fourth candidate. It supports more than one defensible recommendation—a limited Candidate B rollout that excludes consequential refund action, or a hold while the relevant regressions are investigated—but not unqualified approval.

### Capstone Evidence Index

| Evidence ID | Release/configuration and population | Result used in the capstone | Claim and limitation |
| --- | --- | --- | --- |
| REG-01 | Baseline, Candidate A, and Candidate B; named 60–100-case slices, 20 runs, and 25 traces | Canonical regression matrix in Chapter 11 | Compares named releases; small synthetic samples do not establish causality or production rates. |
| CLS-01 | C1 strict, C2 balanced, and broad classifier thresholds; 1,000 synthetic refunds | Threshold costs and review-volume trade-off | Supports a local operational decision, not a universal harm model. |
| FAIR-01 | Synthetic Groups A, B, and C | Recall/FPR patterns by group | Signals investigation; does not establish discrimination or legal impact. |
| GEN-01 | Twenty repeated runs for each named prompt profile | Prompt A: 19/20 acceptable; Prompt B: 12/20 acceptable | Shows slice-specific variation, not population-wide reliability. |
| RAG-01 | D1–D8 synthetic corpus; four answerable queries | Recall@3: 3/4; precision@3: 6/12 | Localises retrieval/context/source failures; does not establish answer quality alone. |
| EVAL-01 | Thirty human/judge answer pairs | Agreement: 21/30; order check: 12/15 and 9/15 | Bounds judge use; agreement is not factuality or safety. |
| ROB-01 | Metamorphic policy cases | Required and invalid relations are distinguished | Relations test stated claims, not universal robustness. |
| AGENT-01 | Candidate B / T2; one denied ambiguous-proposal trace with stable retry key | No side effect; wrong lookup/proposal remains a failure | A guard can succeed while agent execution is inadequate. |
| AGENT-02 | Candidate B / T2; one separate confirmed-proposal trace with ambiguous timeout and new retry key | Side effect may have occurred; retry is unsafe | Requires reconciliation, not blind retry. |
| PROD-01 | Candidate B P2/R2/S2; access-controlled feedback sample | Three “not helpful” reports | A signal requiring investigation, not causal proof. |

### A. System-change inventory and evaluation design

REG-01 defines the Support Assistant releases: Baseline is `M1 + P1 + R1 + T1 + S1 + C1`; Candidate A is `M2 + P1 + R1 + T1 + S1 + C1`; Candidate B is `M1 + P2 + R2 + T2 + S2 + C1`. CLS-01 separately considers C1 strict versus C2 balanced for Refund Risk. The evaluation set contains 100 common policy prompts, 20 unsafe requests, 20 answerable status requests, 40 answerable retrieval queries, 25 tool traces, 30 human/judge pairs, and subgroup slices. Forty development examples influenced prompt revisions and are excluded from the hidden regression subset. Long-tail multi-source questions remain underrepresented. These conditions support comparison, but not a broad production-generalisation claim.

### B. Classifier and threshold evidence

**CLS-01** compares the three threshold options on the same synthetic population.

| Threshold | TP | FP | TN | FN | Precision | Recall | Local modeled cost |
| --- | ---:| ---:| ---:| ---:| ---:| ---:| ---:|
| Strict | 68 | 36 | 864 | 32 | `68 / 104 = 65.4%` | `68 / 100 = 68.0%` | EUR13,520 |
| Balanced | 82 | 108 | 792 | 18 | `82 / 190 = 43.2%` | `82 / 100 = 82.0%` | EUR9,360 |
| Broad | 90 | 240 | 660 | 10 | `90 / 330 = 27.3%` | `90 / 100 = 90.0%` | EUR8,800 |

The broad threshold minimises the stated modelled cost but exceeds the synthetic review capacity of 250 cases. A learner must decide whether the balanced threshold is a controlled operational compromise, whether the local cost model is inadequate, or whether no threshold should be promoted until capacity evidence improves.

### C. Subgroup and safety slices

**FAIR-01** supplies the subgroup slices; **REG-01** supplies the named refusal and over-refusal results.

| Slice | Evidence | What is known | What remains uncertain |
| --- | --- | --- | --- |
| Classifier Group A | TP 32, FN 8, FP 18, TN 342; recall 80.0%, FPR 5.0% | Group A has 20.0% FN rate | Cause, population appropriateness, and impact are not established. |
| Classifier Group B | TP 18, FN 12, FP 14, TN 256; recall 60.0%, FPR 5.2% | Group B has 40.0% FN rate | Small synthetic sample; further governed investigation is needed. |
| Unsafe refund prompts | Candidate A safe helpful refusal 15/20; Candidate B 18/20 | A regresses from the 18/20 baseline; B preserves this slice | Whether the model, prompt, source, or policy change is causal. |
| Answerable status prompts | Candidate A over-refusal 2/20; Candidate B 5/20 | B unnecessarily denies more authorised requests | Production frequency and user impact remain unmeasured. |

### D. Support Assistant source and output evidence

**RAG-01** contains current Returns Policy 2026-03 (damaged electronics require review), superseded Returns Policy 2025-01 (automatic refund wording), a general seller-help article, and an irrelevant setup guide. For a damaged-headset query, retrieval ranks 2025-01 first and 2026-03 fourth. The context budget includes only the top two items.

The generated answer says, “Your damaged headset is eligible for an automatic refund,” citing 2025-01. It is fluent and apparently cited, but unsafe for the current policy decision. A competing trace retrieves 2026-03 but omits it during context truncation; another trace supplies it but produces a response omitting the review condition. Learners must distinguish source governance, retrieval/ranking, context assembly, model behaviour, citation rendering, and evaluator weakness instead of assigning one generic cause.

### E. Evaluation and evaluator evidence

GEN-01 records 17 of 20 outputs meeting the material criterion, two omitting the exception, and one asserting an unsupported exception: 85.0%, 10.0%, and 5.0%. In EVAL-01, human adjudication prefers A in 16 of 30 answer pairs and B in 14; a model judge prefers A in 21 and B in 9, agreeing on 21 pairs (70.0%). In an order check, the judge prefers A in 12 of 15 original-order comparisons and 9 of 15 reversed-order comparisons.

In EVAL-01, the concise Candidate A response says eligibility is likely; the Candidate B response requests the necessary category and states the general process. The judge and one human reviewer prefer A’s style, while source-bound task evidence supports B. This does not establish that the judge is useless. It limits its use to triage with sampled calibrated review for this decision class.

### F. Robustness and agent trace evidence

A punctuation-only variation preserves the expected policy conclusion. Removing the category changes a correct answer into a clarification, as required. Inserting an unapproved conflicting source should preserve reliance on the current approved source; one candidate instead uses the conflict without qualification.

**AGENT-01** is a Candidate B/T2 trace with an ambiguous customer reference. The assistant looks up order 412-A although context suggests 412-B, proposes a refund review, lacks a confirmation token, is denied by the independent policy layer, repeats the denied request with the same stable idempotency key, and finally tells the customer that review and order confirmation are required. No side effect occurs. The final answer is correct; the intermediate lookup and proposal are not. The denial guard is a control success, while agent execution remains a release concern.

**AGENT-02** is a separate Candidate B/T2 trace. A customer has confirmed a permitted proposal, but the tool times out after accepting the request; the side-effect state is unknown. The assistant creates a new idempotency key and retries. That is unsafe because it can duplicate an action. The required response is to verify and reconcile the action state, then stop or hand off if it remains ambiguous.

### G. Regression and limited production evidence

In REG-01, Candidate A raises grounded policy answers from 86/100 to 90/100 but reduces safe helpful refusal from 18/20 to 15/20. Candidate B raises grounded answers to 91/100 and preserves safe helpful refusal at 18/20, but increases over-refusal from 2/20 to 5/20, reduces retrieval success@3 from 35/40 to 30/40, and reduces tool correctness from 24/25 to 20/25. PROD-01 is a small, access-controlled sample with more “not helpful” feedback after Candidate B’s P2/R2/S2 update. The signal is ambiguous: traffic mix and feedback placement changed at the same time. It requires targeted re-evaluation rather than a causal assertion.

### H. Portfolio presentation standard

Present the portfolio as an evidence-led assessment, not a product demonstration. Disclose that all Atlas material is synthetic; list assumptions in the cost model and relevance labels; identify source provenance and corpus authority; distinguish model, retrieval, tool, and evaluator dependencies; retain alternative interpretations; and name unresolved risks. The artifact demonstrates AI Quality Engineering judgement, evaluation design, evidence analysis, and uncertainty communication. It does not demonstrate ownership of a production AI system, legal compliance, safety certification, or ML research expertise.

## The Learner’s Decision Brief

The portfolio should contain evidence, but its purpose is a bounded decision. Complete the following outline with an accountable product, domain, data, privacy, and risk owner. Do not manufacture precision that the packet cannot support.

| Brief field | Partial annotated example |
| --- | --- |
| Fact | The candidate ranks a superseded policy above the current policy for a category-sensitive query. |
| Quality claim | Advice must use current authoritative policy or safely qualify the missing evidence. |
| Evidence | RAG-01 ranked source IDs and effective dates, context manifest, response, rubric, and EVAL-01 evaluator version. |
| Interpretation | At least one source/ranking/context boundary is inadequate for this decision. |
| Evaluation gap and uncertainty | The packet does not isolate causality or estimate live prevalence. |
| Safety/fairness concern | Unsafe eligibility advice and a subgroup recall signal require accountable review. |
| Recommendation | **Learner to complete:** choose and justify a hold, a narrowly limited rollout, or another bounded action. |
| Limitation and residual risk | State what the recommendation leaves unresolved. |
| Mitigation/acceptance, trigger, owner | Name the control, change that forces re-evaluation, and accountable decision owner. |

The partial example deliberately stops before solving the capstone. A defensible recommendation should explain which boundary blocks or limits release, what evidence would change the decision, and why an apparently positive metric does not resolve a material counterexample.

## Staged Professional Investigation

Use the evidence packet in a deliberate investigation, recognising that real teams may order the work differently.

1. Establish the release change and system boundary: classifier threshold, M/P/R/T changes, current sources, bounded tools, evaluators, and observability.
2. Define claims before scoring: which outputs, actions, user groups, and sources must be correct, safe, current, or suitably qualified?
3. Audit evaluation data: identify development influence, missing long-tail cases, subgroup coverage, ambiguity, and source/version limitations.
4. Analyse classifier matrices and threshold/capacity trade-offs, then separate subgroup signals from causal conclusions.
5. Analyse generated and RAG answers against source authority, retrieval/context evidence, rubrics, and citations.
6. Compare human/domain and model-evaluator results, preserving disagreement and deterministic constraints.
7. Inspect metamorphic relations, agent traces, refusals, privacy minimisation, and regression comparison.
8. Integrate limited production feedback as a hypothesis, not as a causal conclusion.
9. Compare constrained Candidate B rollout and hold alternatives; explain why the current packet does not support broad release, then state the residual risk and trigger for each remaining option.
10. Produce the Decision Brief with named owners and an explicit revision path.

## Capstone Evidence Inventory and Release Alternatives

The packet contains: the REG-01 release configuration and regression matrix; CLS-01 classifier thresholds; FAIR-01 subgroup slices; GEN-01 repeated-run evidence; RAG-01 D1–D8 corpus metadata and ranked retrieval; EVAL-01 human/domain/judge ratings and order reversal; ROB-01 relations; AGENT-01 and AGENT-02 traces; safety/privacy packets; and PROD-01 limited feedback. All values are synthetic and must be disclosed as such.

**Broad release** is not supported: Candidate A has material refusal and stability regressions, while Candidate B has retrieval and tool-action regressions. **Constrained Candidate B rollout** can preserve ordinary policy assistance and classifier review while independently excluding category-sensitive eligibility and irreversible refund submission. **Hold** remains defensible for Candidate A and may be chosen for Candidate B when the retrieval, tool, group-B, and capacity concerns cannot be bounded. The learner must decide which claims are strong, which gaps block scope, which mitigation changes the decision, and which uncertainty remains after mitigation.

## Inspectable Atlas Release-Candidate Packet

### 1. Change and evaluation inventory

| Component | Baseline | Candidate A | Candidate B | Claim potentially affected |
| --- | --- | --- | --- | --- |
| Refund Risk | C1 strict | C1 strict | C1 strict; CLS-01 separately evaluates C2 balanced | Detection, review workload, subgroup outcomes |
| Support model | M1 | M2 | M1 | Completion, factuality, refusal, stability |
| System instruction | P1 | P1 | P2 | Instruction following, over-refusal, tool plan |
| Retrieval | R1 | R1 | R2 | Freshness, coverage, grounding, citations |
| Tools | T1 | T1 | T2 | Selection, arguments, confirmation, retries |
| Safety wording | S1 | S1 | S2 | Safe refusal and over-refusal |

| Evaluation population | Cases | Important limitation |
| --- | ---:| --- |
| Common support prompts | 100 | 40 cases influenced earlier prompt development and are excluded from hidden regression. |
| Safety-sensitive requests | 20 | Limited coverage of newer policy exception. |
| Answerable status requests | 20 | Over-refusal sample is small. |
| RAG answerable queries | 40 | One recent EU scenario has only three cases. |
| Agent/tool traces | 25 | Synthetic state may omit production concurrency. |
| Human/judge pairs | 30 | Policy ambiguity remains in four pairs. |
| Subgroup slices | A: 40, B: 30, C: 10 high-risk cases | Group C is too small for strong comparison. |

### 2. Classifier and subgroup evidence

| Threshold | TP | FP | TN | FN | Precision | Recall | Specificity | Modeled cost |
| --- | ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:|
| Strict | 68 | 36 | 864 | 32 | 65.4% | 68.0% | 96.0% | EUR13,520 |
| Balanced | 82 | 108 | 792 | 18 | 43.2% | 82.0% | 88.0% | EUR9,360 |
| Broad | 90 | 240 | 660 | 10 | 27.3% | 90.0% | 73.3% | EUR8,800 |

Costs assume FN = EUR400 and FP = EUR20. The broad threshold has the lowest local modeled cost but creates 330 reviews, exceeding synthetic capacity of 250. The learner must decide whether the balanced option is an acceptable operational compromise or whether capacity/cost evidence is incomplete.

| Group | TP | FN | FP | TN | Precision | Recall | FNR | FPR |
| --- | ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:|
| A | 32 | 8 | 18 | 342 | 64.0% | 80.0% | 20.0% | 5.0% |
| B | 18 | 12 | 14 | 256 | 56.3% | 60.0% | 40.0% | 5.2% |
| C | 7 | 3 | 6 | 84 | 53.8% | 70.0% | 30.0% | 6.7% |

These unequal samples expose observed patterns, not discrimination or legal conclusions. Validate group definitions, labels, task relevance, and threshold effects before drawing stronger inferences.

### 3. Generative, repeated-run, and RAG evidence

| Prompt/output class | Rubric profile | Interpretation |
| --- | --- | --- |
| Current policy answer | Factual, grounded, relevant, complete, format pass | Positive evidence |
| Fluent automatic-refund answer | Relevant but unsupported; safety fail | Material generation/source failure |
| Grounded short answer | Grounded but incomplete | Material exception omitted |
| Answerable status refusal | Over-refusal | Utility failure |
| Unconfirmed refund promise | Unsafe helpfulness | Action-boundary failure |
| Correct answer, missing `nextAction` | Semantic pass; format fail | Contract failure |

Prompt A has 19 acceptable results in 20 runs (95.0%) and one incomplete answer. Prompt B has 12 acceptable, six incomplete, and two unsupported results in 20 runs (60.0%, 30.0%, 10.0%). Decide whether Prompt B can be placed in a constrained scope or requires correction.

| Source | Status/authority | Query result and localisation |
| --- | --- | --- |
| D1 global policy 2026-03 | Current primary | Required for global damaged headset; omitted from top three: retrieval/corpus issue |
| D2 global policy 2025-01 | Superseded | Ranks first and generates fluent obsolete answer: source/ranking issue |
| D3 EU policy 2026-03 | Current EU authority | Retrieved rank three; context truncation may omit it |
| D4 US policy 2026-03 | Current US authority | Retrieved rank one, but model invents automatic refund: generation issue |
| D5 premium exception | Current scoped authority | Requires verified premium status |
| D6 archive / D7 setup | Archived or irrelevant | Citation to either is mapping/evaluation defect |

Retrieval recall@3 is 3/4 = 75.0%, precision@3 is 6/12 = 50.0%. A correct answer cannot establish good retrieval; a faithful answer cannot establish source correctness.

### 4. Evaluators, robustness, and tools

Human A, Human B, and a domain specialist prefer the source-complete candidate in category-sensitive cases; a model judge prefers the more fluent alternative in seven such cases. Across 30 pairs, judge/adjudicated-human agreement is 21/30 = 70.0%; order evaluation selects A 12/15 when shown first and 9/15 when shown second. The learner must decide whether a rubric, judge, or candidate boundary is inadequate; majority preference is not ground truth.

Metamorphic evidence: punctuation and paraphrase preserve the material policy decision; removing a category must change a determination to clarification; inserting an unapproved conflicting document must not override current authority. Changing a jurisdiction is an invalid invariance assumption because policy applicability legitimately changes.

**AGENT-01** covers an ambiguous order “412”: Candidate B selects 412-A although UI context suggests 412-B, proposes refund review without confirmation, is denied by policy, and repeats the denied request with the same key. The final answer is bounded, but the lookup and proposal fail. **AGENT-02** is not the same event: after a separate confirmed proposal times out with side-effect state unknown, Candidate B retries with a new key. It requires verification/reconciliation and state/confirmation remediation before any retry.

### 5. Safety, privacy, regression, and feedback

In REG-01, Candidate A safe refusal is 15/20 versus the 18/20 baseline; Candidate B safe refusal is 18/20, while its over-refusal is 5/20 versus 2/20. A raw support prompt with pasted contact data appears in an offline evaluation sample and an archived transcript is retrieval-eligible. Fact: unnecessary sensitive content is present. Limitation: synthetic evidence cannot establish legal exposure. Engineering action: minimise/redact, remove archive eligibility, govern access/retention. Escalation: privacy/security owner.

| Criterion | Baseline | Candidate A | Candidate B | Decision concern |
| --- | ---:| ---:| ---:| --- |
| Task completion, n=100 | 88.0% | 92.0% | 89.0% | A benefit |
| Groundedness, n=100 | 86.0% | 90.0% | 91.0% | Both benefits |
| Safe refusal, n=20 | 90.0% | 75.0% | 90.0% | A regression |
| Tool correctness, n=25 | 96.0% | 92.0% | 80.0% | B regression |
| Retrieval@3, n=40 | 87.5% | 87.5% | 75.0% | B regression |

PROD-01 contains three “not helpful” reports after Candidate B’s P2/R2/S2 update and one AGENT-02 proposal-timeout anomaly. It is a signal, not causal proof; classify the reports into safe-sampling investigation and the anomaly into agent/tool evaluation before changing release scope.

## Portfolio Presentation Guidance

Present the portfolio with synthetic-data disclosure; assumptions; evaluation and source versions; provenance; evaluator limitations; unresolved disagreement; alternative decisions considered; residual risk; and revision conditions. It demonstrates AI Quality Engineering judgment, evidence design, and uncertainty communication. It does not demonstrate production ML ownership, legal compliance, AI certification, safety certification, or research expertise.

## Build the Atlas Portfolio in Stages

1. **Frame the system.** Draw the boundaries for Refund Risk, Discovery, Support Assistant, retrieval corpus, order lookup, refund tools, evaluators, and observability. State excluded uses explicitly.
2. **Write claims before measures.** Examples include: no category-dependent refund determination without required facts; retrieved policy advice cites active support; a refund submission requires independent confirmation; classifier trade-offs are approved by accountable domain owners.
3. **Choose evidence and oracles.** Combine deterministic contracts, synthetic scenario/rubric evaluations, metamorphic relations, evaluator validation, subgroup investigation where justified, and safe operational signals.
4. **Make ownership and decisions visible.** Identify who owns source content, tool policy, data quality, product decision, privacy, responsible-AI escalation, and release/rollback.
5. **Record residual risk and triggers.** A limitation is not a footnote; it is an input to release scope, monitoring, follow-up, and re-evaluation.

## Engineering Perspective

The quality strategy should make handoffs explicit. Part III supplies evidence-engineering principles; Part IV supplies API and state boundaries; Part VI supplies data quality; Part VIII supplies observability and reliability. Part IX applies them to AI-specific uncertainty without replacing the earlier disciplines. Planned later handbook parts may deepen lifecycle governance, but this portfolio remains scoped to the currently defined system.

## Industry Perspective

NIST AI RMF provides a risk-management framework that can help organise AI governance and measurement in context.[^nist-rmf] A framework is not a release decision: the Atlas portfolio must still state its own evidence, limitations, and accountable owners.

## Common Misconceptions and Pitfalls

### “The capstone needs one master score”

Different claims have different error consequences and evidence types. A release hierarchy is more honest than an arbitrary aggregate.

### “A portfolio is paperwork after testing”

It is the engineering structure that makes testing purposeful, comparable, and actionable.

### “Residual risk means the strategy failed”

Residual risk is unavoidable. Hidden or unowned residual risk is the failure.

## QA → QE Transition

QA may present test results. Quality Engineering delivers a coherent, evidence-bounded decision portfolio that connects technical outcomes to user impact, accountable ownership, operational controls, and change management.

## Summary

An AI Quality Strategy and Evaluation Portfolio makes complex systems governable. It aligns claims, evidence, boundaries, limitations, decisions, and triggers so teams can learn without converting uncertainty into unsupported assurance.

## Key Takeaways

- Build a portfolio around decisions and harms, not a universal AI score.
- Preserve evidence conditions, limitations, and owners with each result.
- Use a release hierarchy to prevent an average from hiding a boundary failure.
- Treat residual risk and re-evaluation triggers as first-class outputs.

## Review Questions

1. Why should Atlas hold Candidate A despite its groundedness increase?
2. Recalculate the strict and lower classifier cost values from the stated assumptions.
3. Which components and owners must appear in the Atlas boundary map?
4. What makes a portfolio a decision brief rather than a dashboard?

## Interview Questions

1. How would you present AI release evidence to product, engineering, and risk stakeholders?
2. What would you include in an AI quality strategy for a tool-using assistant?
3. How would you explain residual risk without making an unsupported safety claim?

## Practical Exercise

Create an **AI Quality Strategy and Evaluation Portfolio** for the synthetic Atlas environment. Include the seven portfolio sections, at least eight scoped claims, their evidence and limitations, accountable owners, a release hierarchy, residual risks, and re-evaluation triggers. Do not build an application, use live models, process real data, or create companion assets.

## Further Reading

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST AI RMF: Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)

## References

[^nist-rmf]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1). 2023. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can structure an AI quality portfolio around claims and decisions.
- [ ] I can connect evidence to accountable owners and limitations.
- [ ] I can prevent an aggregate score from concealing a release blocker.
- [ ] I can define residual risks and re-evaluation triggers.

## Chapter Navigation

Previous: [Chapter 11 — AI Regression, Production Learning, and Change](chapter-11-ai-regression-production-learning-and-change.md) · Next: [Part IX overview](../README.md)
