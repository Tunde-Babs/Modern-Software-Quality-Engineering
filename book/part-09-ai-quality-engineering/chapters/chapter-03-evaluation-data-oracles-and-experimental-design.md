# Chapter 3 — Evaluation Data, Oracles, and Experimental Design

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 3 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2; Parts III and VI |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An evaluation set is not a collection of examples; it is a claim about the population from which a decision will be made.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce evaluates its Support Assistant with 200 synthetic questions. It receives a 92% rubric pass rate. The evaluation set contains concise English questions about current standard returns, drawn from frequent customer journeys.

The proposed release will also serve long-tail return exceptions, older product lines, customers who write in fragmented language, and questions where the policy has changed recently. None is represented in the 200 questions. A subset of questions was copied from the same internal policy examples used to tune the system instruction. The score is real, but the release claim is much broader than its evidence.

## Why This Chapter Matters

Evaluation-data quality determines what an AI evaluation can honestly establish. Part VI covers provenance, representation, population, and data-quality evidence. Part IX focuses those concepts on evaluation: Is the set representative of the decision population? Is the label or rubric credible? Did information leak from training or development into evaluation? Which relevant cases are absent?

Without this discipline, teams often measure convenience: prompts that are easy to write, examples that resemble system demonstrations, or benchmark results whose population is unknown.

## Learning Objectives

By the end of this chapter, you should be able to:

- define a decision population and evaluation population;
- distinguish evaluation data, an oracle, and a decision threshold;
- identify leakage, benchmark contamination, and weak representativeness;
- select slices, edge cases, and long-tail cases proportionately; and
- create an Evaluation Dataset and Oracle Plan.

## Evaluation Is an Experiment With a Decision

An **oracle** is a method for determining whether observed behaviour is acceptable for a stated purpose. It may be an exact value, a schema, a reference answer, a domain rubric, a human evaluator, a relation between outputs, or a comparison against a baseline. No oracle is automatically sufficient.

An evaluation plan should state:

- the intended decision and affected population;
- input sources, provenance, inclusion and exclusion rules;
- target behaviour and acceptable failure types;
- oracle method, evaluator instructions, and ambiguity handling;
- slices and long-tail cases;
- versions of data, policy, prompt, model, retrieval, and evaluator; and
- limitations and conditions that trigger re-evaluation.

### Train, validation, test, and evaluation

The labels have different purposes. **Training data** influences model parameters or learned behaviour. **Validation data** commonly supports iterative model or configuration selection. **Test data** is held out for a final performance estimate. In AI applications, a separate **release evaluation set** may also assess the assembled system: prompt, retrieval, tools, policies, and interface.

The important question is not which label a folder carries. It is whether a result influenced a design decision and was later presented as independent evidence. If it did, independence is weakened.

## Leakage, Contamination, and Drift

**Data leakage** occurs when information unavailable at the intended decision point, or information that should be held out, improperly influences training, selection, or evaluation. A refund-risk label included in an input feature is a direct example.

**Benchmark contamination** is narrower: evaluation examples, answers, or close variants may have been encountered during model training, prompt development, or repeated tuning. A benchmark score can remain useful, but it may no longer estimate performance on independent future cases.

**Distribution shift** means the inputs, environment, or target relationship in use differs from the evaluation setting. **Concept drift** is a form of change in which the relationship between inputs and the target changes over time. A policy update is not necessarily concept drift, but it can make an evaluation set stale for a policy-answer task.

## Worked Reasoning: A High Score for the Wrong Population

| Element | Atlas Support evaluation |
| --- | --- |
| System context | Support Assistant answers policy questions with retrieval and an updated system instruction. |
| Quality claim | The assistant is suitable for the planned returns-support population. |
| Observed evidence | 184 of 200 evaluation prompts meet the rubric: 92.0%. All prompts are current standard-policy questions in concise English. |
| Interpretation | The result supports a narrower claim about that covered slice and rubric. |
| Competing interpretation | The prompts may be enough for the highest-volume journey, but not for exceptions, stale-policy questions, or fragmented language. |
| Evidence limitation | 40 prompts resemble examples used during prompt revision; no independent exception slice exists. |
| Decision | Do not use 92.0% as a broad launch claim. Version the set, remove or label influenced examples, add exception and language-form slices, then decide by slice and harm. |
| Revision trigger | Re-evaluate after policy, corpus, prompt, model, retrieval, or target-population changes. |

The calculation is simple: 184 divided by 200 equals 0.92, or 92.0%. Its interpretation is difficult: the denominator defines the population covered by the statement.

## Representative Does Not Mean Perfectly Random

Representativeness is contextual. A small synthetic evaluation set can be useful when it intentionally covers high-risk decisions, known edge conditions, relevant subgroups, and expected traffic patterns. It should not pretend to be a random sample of all customers if it is not.

Use **stratification** when a meaningful slice could be hidden in an aggregate result: product category, policy type, language form, customer journey, risk class, or tool-availability condition. Long-tail examples should be selected because their risk or consequence matters, not merely because unusual prompts are entertaining.

## Build an Evaluation Set by Decision Purpose

One collection should not silently serve every purpose. Development evaluation supports rapid learning and may contain examples that influenced prompt or configuration choices. Regression evaluation supports comparison with a recorded baseline. Safety evaluation concentrates on unacceptable outcomes and boundary conditions. An adjudication set contains cases on which evaluators have disagreed or where the expected outcome is intentionally qualified. Each can share a provenance system, but their decision roles should be explicit.

The following is a compact **illustrative** Atlas evaluation-set plan. The counts are a design proposal, not a claim about real traffic.

| Slice | Illustrative cases | Main decision use | Oracle | Important limitation |
| --- | ---: | --- | --- | --- |
| Common current-policy returns | 60 | Development and regression | Current-source rubric plus schema checks | Can dominate aggregate scores. |
| Category exceptions | 30 | Regression and safety | Policy excerpt, clarification/refusal boundary | Requires current source versions. |
| Fragmented or ambiguous requests | 20 | Safety and adjudication | Clarification rubric, human review for borderline cases | Not a linguistic-representativeness study. |
| Recent policy changes | 20 | Regression and source-governance checks | Effective-date and citation checks | Becomes stale when policy changes again. |
| Long-tail product or order states | 25 | Safety and regression | Tool/data contract plus semantic rubric | Synthetic cases may omit operational complexity. |
| Relevant subgroup or accessibility slices | 20 | Investigation and regression where justified | Same task criteria by slice | Requires a legitimate, governed definition of the slice. |
| Intentionally ambiguous cases | 15 | Adjudication | Human protocol and escalation rule | No single reference answer may exist. |
| Potentially contaminated demonstrations | 10 | Development only, labelled | Exploratory check | Must not be cited as independent release evidence. |

The table forces a decision. A policy question copied into a system-instruction workshop can be valuable for development, but it should not later be counted as independent evidence that the changed instruction generalises. A borderline ambiguity can be useful for calibration, yet it may be unsuitable for a binary pass-rate denominator until the product owner defines the safe behaviour.

## Sampling, Stratification, and Long-Tail Coverage

**Sampling** is the process for selecting cases from a defined source or constructing them against stated conditions. **Stratification** deliberately reserves coverage for meaningful slices so that common cases do not erase rare but consequential ones. A slice should be driven by a user journey, risk, policy distinction, data condition, or decision boundary—not an arbitrary demographic label or a search for a favourable number.

For Atlas Support Assistant, a common standard-return question might justify many cases because it represents frequent demand. That does not justify excluding a low-frequency category exception if an erroneous answer could cause an unsupported refund promise. A long-tail case is not merely unusual wording; it is a case for which low frequency, high consequence, or weak prior evidence warrants deliberate coverage.

Set selection includes trade-offs:

- More common cases can estimate consistency for a frequent journey but may drown out exceptions.
- More edge cases can improve boundary coverage but may overstate their expected production frequency.
- Synthetic cases can protect privacy and make source truth controllable but can reproduce the author’s assumptions.
- Carefully governed production samples can reveal real variation but require lawful purpose, minimisation, access controls, and de-identification appropriate to the context.

The evaluation plan should name these choices so a reviewer can challenge them. It should not manufacture a statistically representative claim from a convenient set.

## Oracle Strength, Partial Oracles, and Ambiguity

An oracle is strong only for the claim it can decide. A JSON-schema validator can establish that an output has required fields; it cannot establish that a cited policy is current. A reference answer can detect an exact required policy exception; it may reject a semantically correct paraphrase. A human evaluator can inspect contextual completeness; the evaluator can also disagree or lack required domain context.

| Oracle type | Good use | Weak use or failure mode | Complementary evidence |
| --- | --- | --- | --- |
| Exact assertion | Tool argument, confirmation flag, response schema | Treating prose wording as semantic truth | Rubric or relation for language content |
| Reference answer | Narrow factual or policy claim | Assuming one wording is the only acceptable answer | Source citation and semantic criteria |
| Rule or invariant | “No refund submission without confirmation” | Judging usefulness of a clarification | Workflow trace and usability evidence |
| Domain rubric | Groundedness, completeness, safe refusal | Masking an ambiguous criterion behind one score | Anchors, calibration, disagreement record |
| Human adjudication | Meaningful borderline or impact case | Calling one reviewer ground truth | Independent ratings and escalation path |
| Baseline comparison | Detecting change under fixed conditions | Assuming the baseline is good | Absolute safety and task-quality claims |

A **partial oracle** can decide one aspect of behaviour but not the whole outcome. Design with partial oracles deliberately: state what each check covers, combine them where necessary, and label the remaining evaluation gap. This is more reliable than an all-purpose “quality score.”

## Worked Expansion: The Easy-Case Trap

Atlas’s original 200-prompt set contains 170 common standard-return questions, 20 minor variations, and 10 category exceptions. It records 161 passes among the 170 common cases, 18 among the 20 variations, and 5 among the 10 exceptions. The aggregate is `(161 + 18 + 5) / 200 = 184 / 200 = 92.0%`. The exception slice is `5 / 10 = 50.0%`.

The aggregate is mathematically correct but decision-poor. It gives 95% of the denominator to common and near-common cases. If the release claim includes category-dependent eligibility, the 50.0% exception result is not an incidental detail. The immediate decision is not necessarily to reject every rollout; it is to narrow scope, strengthen the exception evidence, define safe clarification behaviour, and obtain ownership for the residual risk. A later result can be compared only if the slice definitions and source versions remain known.

## Professional Evaluation-Design Case

Atlas is preparing a Support Assistant release while changing the Refund Risk threshold. The learner receives the following inventory and assigns each case to a purpose; one case can be represented in more than one set, but its role and visibility must remain explicit.

| Case class | Development | Hidden release regression | Safety | Subgroup | Adjudication | Production sampling | Reasoned placement |
| --- | --- | --- | --- | --- | --- | --- |
| Frequent standard return | Yes | Yes | No | Optional | No | Yes | Measures ordinary task quality without becoming the whole release claim. |
| Long-tail category exception | Yes | Yes | Yes | Optional | Yes | Yes | Consequence justifies protected regression coverage. |
| Ambiguous policy/order conflict | Yes | No until resolved | Yes | No | Yes | Later, if authorised | Human/domain judgement establishes the acceptable boundary. |
| Safe-refusal request | Yes | Yes | Yes | Optional | No | Sampled | Must remain independent of routine prompt tuning. |
| Recent policy change | Yes | Yes | Yes | Optional | Yes | Yes | Source currency and retrieval behaviour are release dependencies. |
| Robustness perturbation | Yes | Yes | Yes where action can be affected | No | If relation is unclear | No by default | Tests an expected relationship, not traffic frequency. |
| Known escaped incident | Temporary investigation | Add only after deduplication | If harmful | If relevant | If ambiguity persists | No raw copy | Avoid duplicate weighting and incident overfitting. |
| Potentially contaminated demonstration | Yes, labelled | No | No | No | No | No | It influenced development and cannot be independent evidence. |

The matrix teaches separation of purpose. A hidden release set loses independence when it becomes a tuning dashboard. A production sample is not a free source of test data: it needs purpose limitation, minimisation, appropriate access, and a decision about whether a synthetic representation is enough. An adjudication set records difficult cases; it should not create a false binary label merely to inflate a pass rate.

## Oracle Failure Can Create False Confidence

Consider two Atlas failures. First, a reference answer says “damaged headsets receive an automatic refund” because it was written from superseded policy. A system that produces the current review requirement receives an apparent failure; a system that repeats obsolete advice passes. The reference answer is the defect. Second, a rubric gives two points for “complete explanation” but has no criterion for source support. A long, invented eligibility rationale can outrank a concise source-bound clarification. The rubric is a partial oracle used as if it were complete.

The correction is not to discard oracles. Version the policy/source, record oracle scope, retain calibrated failure examples, and combine checks: deterministic contracts for fields and actions; current-source comparison for material policy claims; rubric criteria for relevance/completeness; metamorphic relations for transformations; comparative/baseline evidence for change; human or model evaluators only within validated roles; and downstream outcomes as hypotheses rather than automatic truth.

Evaluation suites evolve. New cases should be classified, deduplicated, and versioned; a new incident does not automatically become a permanent gate. Repeatedly optimising against visible examples can create benchmark overfitting and contamination even when model weights never change.

## AI Evaluation Portfolio Design Exercise

Build an **AI Evaluation Portfolio Design** for Atlas. Allocate at least twelve synthetic cases into development, hidden release regression, safety, subgroup, robustness, adjudication, and production-sampling sets. Explain intentional overlap: a category exception may belong in safety and release regression because its boundary is consequential, but duplicating it ten times does not create ten independent observations. Record each case’s source/provenance, oracle, visibility, population, owner, and revision trigger. Hidden evaluation protects independent evidence; secrecy is not a quality mechanism if the data, oracle, or population is weak.

Add three bad-oracle controls: a stale reference answer; a completeness rubric that omits grounding; and an evaluator lacking the domain source needed to recognise a material exception. For each, write the false confidence it can create, the additional evidence needed, and who owns remediation.

## Engineering Perspective

Evaluation data is a versioned quality dependency. A model, prompt, or retrieval change assessed against an unversioned set cannot be compared reliably later. Quality Engineers should request provenance, access controls, change history, and a clear account of who wrote or revised examples. They should also protect sensitive data; synthetic examples are not automatically representative, while real data is not automatically safe to reuse.

## Industry Perspective

NIST’s Generative AI Profile identifies evaluation and measurement as context-dependent risk-management activities.[^nist-genai] Its relevance here is not a prescribed dataset template. It is the need to connect evidence to the actual system, use, and affected population.

## Common Misconceptions and Pitfalls

### “More prompts always mean a better evaluation”

More examples can repeat the same narrow population. Coverage, provenance, independence, and consequence matter as much as count.

### “Synthetic data has no quality risk”

Synthetic examples can omit important patterns, encode author assumptions, or accidentally reveal expected answers too clearly.

### “A held-out model test validates the application”

A model test may not cover prompt, retrieval, tool, policy, interface, or production configuration behaviour.

## QA → QE Transition

QA collects representative test cases. Quality Engineering treats the set itself as evidence that must be designed, versioned, challenged, and linked to a decision population.

## Summary

Evaluation is a structured experiment whose result cannot exceed the quality and scope of its data and oracle. Define the population, preserve independence, expose coverage gaps, and attach every score to a versioned decision context.

## Key Takeaways

- Evaluation data defines the scope of an AI quality claim.
- Oracles may be exact, rubric-based, relational, human, or comparative; each has limits.
- Leakage and contamination weaken independence in different ways.
- Versioning and slices make results reviewable and revisable.

## Review Questions

1. How do train, validation, test, and release evaluation purposes differ?
2. Why can 92.0% be both correct and misleading?
3. What is the difference between data leakage and benchmark contamination?
4. When would you add a slice instead of increasing the general prompt count?

## Interview Questions

1. How would you build an evaluation set for a RAG assistant?
2. What evidence would make you distrust a benchmark result?
3. How do you balance representative evaluation with privacy constraints?

## Practical Exercise

Create an **Evaluation Dataset and Oracle Plan** for Atlas Refund Risk or Atlas Support Assistant. Define population, slices, source/provenance, oracle, ambiguity handling, versions, limitations, and revision triggers. Label any synthetic assumption explicitly.

## Further Reading

- [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [HELM: Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)

## References

[^nist-genai]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf). NIST AI 600-1, 2024. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can define the population covered by an evaluation claim.
- [ ] I can distinguish a dataset from its oracle and decision rule.
- [ ] I can identify leakage, contamination, and evaluation-set drift.
- [ ] I can design meaningful slices and record evidence limitations.

## Chapter Navigation

Previous: [Chapter 2 — AI System Architecture and Failure Boundaries](chapter-02-ai-system-architecture-and-failure-boundaries.md) · Next: [Chapter 4 — Classification, Ranking, and Predictive-Model Evaluation](chapter-04-classification-ranking-and-predictive-model-evaluation.md)
