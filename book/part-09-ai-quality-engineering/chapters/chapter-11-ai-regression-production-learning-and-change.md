# Chapter 11 — AI Regression, Production Learning, and Change

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 11 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–10 and Part VIII observability foundations |
| Estimated study time | 175 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** AI change is a new evidence problem: compare behaviour, constraints, and decision impact under documented conditions.

## Opening Story

The following is an **illustrative scenario**. In evidence packet **REG-01**, Atlas compares its baseline Support Assistant with Candidate A after a model-endpoint update. On 100 synthetic supported-policy questions, grounded answers improve from 86 to 90. On 20 unsafe refund requests, safe, helpful refusals fall from 18 to 15. The release note celebrates the first figure and omits the second.

The system may have improved one claim while regressing another. A Quality Engineer needs an evidence portfolio that prevents average improvement from hiding a release-blocking boundary failure.

## Why This Chapter Matters

AI systems change through model versions, prompts, retrieval corpora, tools, data, evaluator logic, thresholds, service routing, and user behaviour. Traditional regression suites remain necessary, but they must be extended for probabilistic outputs, evolving source content, and multi-boundary evidence.

Production signals support learning but do not automatically become proof of quality. They can be delayed, biased, privacy-sensitive, or disconnected from user harm. This chapter does not prescribe online experimentation, a monitoring platform, or automatic deployment decisions.

## Learning Objectives

By the end of this chapter, you should be able to:

- define an AI change inventory and comparable baseline;
- design regression evidence across deterministic and generative claims;
- interpret improvements and regressions by slice and severity;
- distinguish monitoring signals from release proof; and
- produce an AI Change and Regression Decision Record.

## A Change Inventory Prevents Invisible Comparisons

Record what changed and what was held constant: model or endpoint, prompt, retrieval corpus/index, tools and schemas, application logic, safety policy, evaluation data, rubric/evaluator, sampling, and environment. If several elements change together, a comparison may support a release decision but not a causal explanation.

Maintain a deliberately chosen regression portfolio: deterministic contract checks; representative evaluation cases; safety and tool-denial paths; boundary/metamorphic cases; retrieval freshness cases; subgroup or impact slices where justified; and production-monitoring hypotheses. Version inputs and expected relations with the system.

## Worked Numerical Reasoning: Improvement Is Not a Pass

For **REG-01**, baseline groundedness is **86 / 100 = 86%** and Candidate A groundedness is **90 / 100 = 90%**, an observed increase of **4 percentage points**. For the unsafe-request slice, baseline safe, helpful refusal is **18 / 20 = 90%** and Candidate A is **15 / 20 = 75%**, an observed decrease of **15 percentage points**.

| Element | Evidence and reasoning |
| --- | --- |
| Context | REG-01 compares Baseline with Candidate A after `M1 → M2`; prompt, retrieval, tools, safety policy, rubric, and synthetic test sets are recorded as unchanged. |
| Quality claim | The candidate must improve supported advice without reducing the defined safe-refusal boundary below the release policy. |
| Evidence | Groundedness: 86% to 90%; safe helpful refusal: 90% to 75%. |
| Interpretation | The candidate improves one measured slice and regresses another materially. |
| Alternative | Small samples, evaluator error, or test-set composition can affect both results; the change may not be the sole causal factor. |
| Limitation | These results do not estimate live-user impact or establish root cause. |
| Decision | Hold the candidate from release pending investigation and an accountable decision on the safety regression; do not average the two measures into one score. |
| Revision trigger | Repeat REG-01 after retrieval, prompt, policy, evaluator, or model changes; review production signals against the same named claims. |

The arithmetic is simple. The release judgment depends on stated policy and harm: a score increase elsewhere cannot cancel an unacceptable safety degradation by averaging.

## A Baseline-to-Candidate Evaluation Matrix

**REG-01** is Atlas’s canonical release-comparison packet. It fixes the configuration, evaluation populations, and evaluator version for Baseline, Candidate A, and Candidate B. `S` denotes safety/refusal-policy wording. `C1` is the existing strict classifier configuration; the separately evaluated `C2` balanced threshold is **CLS-01**, not an unlabelled change within either assistant candidate.

| Release | Model | System instruction | RAG | Tools | Safety policy | Classifier configuration | Scope |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Baseline | M1 | P1 | R1 | T1 | S1 | C1 — strict | Established comparison point |
| Candidate A | M2 | P1 | R1 | T1 | S1 | C1 — strict | Model-endpoint change |
| Candidate B | M1 | P2 | R2 | T2 | S2 | C1 — strict | Instruction, corpus/ranking, tool-definition, and safety-wording bundle |
| CLS-01 option | Not applicable | Not applicable | Not applicable | Not applicable | Not applicable | C1 strict → C2 balanced | Separate classifier threshold decision |

The table below is the primary regression matrix. Every REG-01 row is a synthetic result under the named population and evaluation conditions; FAIR-01 is explicitly separated because the classifier is unchanged in the assistant comparison. Differences are observed changes, not claims of statistical significance.

| Evidence ID | Criterion and population | Baseline | Candidate A | Candidate B | Observed tension |
| --- | --- | ---:| ---:| ---:| --- |
| REG-01 | Task completion, 100 support prompts | 88/100 = 88.0% | 92/100 = 92.0% | 89/100 = 89.0% | A improves completion; B is near baseline. |
| REG-01 | Grounded answers, 100 sourced prompts | 86/100 = 86.0% | 90/100 = 90.0% | 91/100 = 91.0% | Both improve; B depends on R2 evidence. |
| REG-01 | Factual task facts, 60 tool-backed prompts | 55/60 = 91.7% | 54/60 = 90.0% | 56/60 = 93.3% | Small count differences need investigation, not certainty. |
| REG-01 | Safe helpful refusal, 20 unsafe requests | 18/20 = 90.0% | 15/20 = 75.0% | 18/20 = 90.0% | A regresses by 15 points. |
| REG-01 | Over-refusal, 20 answerable requests | 2/20 = 10.0% | 2/20 = 10.0% | 5/20 = 25.0% | B regresses by 15 points. |
| REG-01 | Retrieval success@3, 40 answerable queries | 35/40 = 87.5% | 35/40 = 87.5% | 30/40 = 75.0% | B’s R2 result is worse despite groundedness gain. |
| REG-01 | Tool-call correctness, 25 traces | 24/25 = 96.0% | 23/25 = 92.0% | 20/25 = 80.0% | B creates action-path concern. |
| FAIR-01 | Group B classifier recall, 30 high-risk cases under C1 strict | 18/30 = 60.0% | Not applicable | Not applicable | The classifier is unchanged in REG-01; evaluate subgroup and threshold evidence separately in CLS-01/FAIR-01. |
| REG-01 | Full criterion across 20 repeated runs | 17/20 = 85.0% | 14/20 = 70.0% | 16/20 = 80.0% | A stability/behaviour concern; samples are small. |

Candidate A might look attractive to a team focused on task completion and groundedness. Candidate B might look attractive to a team focused on groundedness and unchanged safe refusal. The release hierarchy resolves the tension: deterministic policy violations and material safety, retrieval, or action regressions cannot be traded for unrelated gains through a weighted average unless an accountable policy explicitly permits that decision.

### Compare two candidate changes

Candidate A improves task completion by **4 points** and groundedness by **4 points**, but safe helpful refusal falls by **15 points** and repeated-run success falls by **15 points**. Candidate B improves groundedness by **5 points** and preserves safe helpful refusal, but over-refusal rises by **15 points**, retrieval success@3 falls by **12.5 points**, and tool-call correctness falls by **16 points**.

Candidate A should be held for safety and stability investigation. Candidate B may be held or considered only for a constrained rollout that independently excludes category-sensitive advice and irreversible actions while its retrieval and tool regressions are investigated. REG-01 does not establish root cause or statistical significance; it makes the required evidence gaps explicit.

## Production-Learning Set Growth

Suppose sampled feedback identifies a new failure: customers ask a combined warranty-and-return question, and the assistant retrieves the return policy but omits warranty limits. Capture a minimised, authorised case; classify it as a multi-source query; check whether it is already represented; add a de-identified synthetic counterpart to the appropriate development, regression, safety, or adjudication set; and rerun the affected candidates. Avoid copying every incident into every suite. Duplicated incidents can overweight one failure mode, repeated tuning can contaminate hidden evidence, and a changing population can make historical rates incomparable.

## From Signal to Targeted Re-evaluation

Production learning begins with a signal, then creates a testable change hypothesis:

```text
Observed signal
  → safely sampled evaluation and context check
  → evidence and limitation record
  → change hypothesis
  → targeted regression and boundary test
  → accountable promote, hold, rollback, or monitor decision
```

For example, **PROD-01** is a rise in “assistant was not helpful” feedback after Candidate B’s P2/R2/S2 update. It is not proof that the model degraded: visibility, traffic mix, a more prominent feedback button, or a broken user interface may contribute. Atlas samples authorised, minimised cases; checks the named policy/corpus versions and the REG-01 refusal slice; states a hypothesis such as “the new safety instruction is causing answerable cases to be refused”; and reruns an evaluation that separates unsafe requests from answerable requests. The result may justify prompt revision, a rollback, more data collection, or a narrower launch scope.

## Production Learning Is Evidence With Biases

Production telemetry may reveal latency, tool failures, refusal frequency, retrieval-source drift, escalations, corrections, or user abandonment. These signals need definitions, privacy controls, sampling awareness, and investigation paths. For example, fewer complaints may reflect a harder-to-find support route rather than better answers.

Use safe feedback channels, review sampled traces under access controls, and distinguish a measurement signal from a confirmed quality conclusion. Define who can pause a rollout, how incidents are triaged, and what evidence is needed before a rollback or change.

## Regression Portfolio Design

Organise regression evidence by boundary and decision rather than one large prompt list. Keep deterministic API and policy-denial checks; source/currentness and retrieval cases; representative task cases; long-tail and ambiguity cases; metamorphic relations; evaluator-validation cases; tool traces; safe-refusal and over-refusal slices; justified subgroup checks; and a small, governed production-learning sample. Each case records its source, oracle, configuration, expected invariant or permitted change, severity, owner, and revalidation trigger.

A regression result is comparable only when its conditions are known. If evaluation data or the judge changes, report the comparison as a new evidence set or rerun the baseline under the new conditions. Avoid exact-text equality as a default generative oracle: compare the defined semantic, source, safety, and contract claims instead.

## Change Inventory and Selection

| Release or evidence packet | Configuration | Claims potentially affected | Required evaluation selection |
| --- | --- | --- | --- |
| Baseline / REG-01 | M1 + P1 + R1 + T1 + S1 + C1 strict | Established comparison point | Preserve versions and baseline evidence |
| Candidate A / REG-01 | M2 + P1 + R1 + T1 + S1 + C1 strict | Generated task completion, factuality, refusal, tool-call selection, stability | Generative, safety, agent, and repeated-run slices |
| Candidate B / REG-01 | M1 + P2 + R2 + T2 + S2 + C1 strict | Retrieval coverage, grounding, citation, tool arguments, safety prompt effects | RAG, source/currentness, tool, safety, regression slices |
| CLS-01 | C1 strict → C2 balanced; separate classifier decision | Detection, review capacity, local error-cost assumptions, subgroup outcomes | Classifier, capacity, and subgroup evidence; do not treat it as an assistant-candidate result |

Change-aware selection avoids rerunning every test blindly while preventing a narrow change from escaping relevant evidence. A revised tool description affects action selection and arguments even if its API schema is unchanged. A corpus change makes source-currentness, retrieval, citation, and relevant generative evidence stale. A model change may affect any probabilistic output, so retained baseline results should not be treated as evidence for the new endpoint.

## Escaped Cases and Suite Debt

Two synthetic production signals illustrate controlled learning. **PL-01** is a combined warranty-and-return question that retrieves a return policy and omits warranty limits. Classify it as a multi-source RAG investigation; after de-identification and deduplication, add a synthetic equivalent to a permanent RAG regression set if the use case is in scope. **PL-02** is a repeated refund proposal after an ambiguous timeout. Classify it as an agent/tool safety case; it belongs in a permanent action/retry suite, not a general prompt benchmark. Neither production-learning packet changes the REG-01 candidate results.

Other incidents may remain temporary investigation cases: a malformed internal test record, an unrepeatable external dependency outage, or a problem outside the supported product population. Suite growth without purpose creates maintenance debt, duplicates a failure mode, and encourages optimisation to a visible benchmark. Record why a case is retained, its population, owner, oracle, and retirement/revision conditions.

## Worked Release Decision: M1/P1/R1/T1 versus Two Candidates

Atlas applies the **REG-01** release identities defined above: **Baseline** is `M1 + P1 + R1 + T1 + S1 + C1`; **Candidate A** is `M2 + P1 + R1 + T1 + S1 + C1`, a model upgrade owned by the model-integration team; and **Candidate B** is `M1 + P2 + R2 + T2 + S2 + C1`, an instruction, corpus/ranking, tool-definition, and safety-wording bundle jointly owned by product, knowledge, and workflow teams. **CLS-01** remains a separate strict-to-balanced classifier threshold decision.

| Change | Affected assumption | Claim at risk | Evaluation to rerun | Old evidence still valid? | Owner |
| --- | --- | --- | --- | --- | --- |
| M1 → M2 | Generated behaviour and sampling pattern | Task completion, factuality, refusal, stability, tool selection | Generative, safety, repeated-run, tool-trace slices | Deterministic API evidence only | Model integration |
| P1/S1 → P2/S2 | Instruction priority and refusal wording | Instruction following, safe/over-refusal, tool planning | Generative, safety, agent traces | Source/corpus evidence only | Product/quality |
| R1 → R2 | Eligible sources, rank, chunk/context behaviour | Retrieval coverage, grounding, citations | RAG, source-currentness, generative cases | Model-only behaviour evidence only | Knowledge/retrieval |
| T1 → T2 | Tool descriptions and proposal constraints | Tool selection, arguments, authorisation | Tool/agent traces and policy-denial paths | API contract evidence only | Workflow/API |

The matrix teaches selection: a retrieval change does not require repeating an unchanged CSS test, but it invalidates every conclusion that relied on source rank, context, groundedness, or citation. A model change may require broader output evidence even when no prompt text changes.

### Evidence matrix

The primary **REG-01** regression matrix appears earlier in this chapter and is deliberately not duplicated here. Its documented population, configuration, and evaluator conditions are the only evidence used for the Candidate A/B comparisons below.

### Decision exercise

The complete REG-01 evidence does not support broad promotion of either candidate. A **hold** is defensible for Candidate A because its refusal and repeated-run regressions may be release-blocking for a safety-sensitive scope. A **constrained rollout** of Candidate B is potentially defensible only if independent controls genuinely exclude category-sensitive advice and irreversible actions while retrieval and tool regressions are investigated. The learner must compare benefit, regression severity, evidence quality, sample size, user impact, mitigation, reversibility, and residual risk rather than manufacture a generic acceptance threshold.

### Production learning and the reusable artifact

Two escaped cases enter the decision. **PL-01** is a combined warranty-and-return question that was absent from the suite; classify it as a RAG-specific, multi-source case, create a de-identified synthetic equivalent, and add it to permanent regression only if in scope. **PL-02** is a timeout after a refund proposal passed final-answer evaluation but left side-effect status unknown; add it to the permanent agent/tool safety set after verifying it is not a duplicate. The former does not belong in a subgroup set without a justified population claim; the latter is not a general language benchmark.

The **AI Regression and Re-evaluation Plan** records: change; affected claim; baseline; candidate; evaluation; population; sample size; observed difference; uncertainty; regression/improvement; mitigation; decision; revision trigger; and owner. This turns a dashboard into a controlled engineering decision.

## Engineering Perspective

An AI regression suite should make its decision hierarchy visible. A deterministic prohibition such as “no tool submission without confirmation” can block release even if every generative score rises. A threshold or rubric can trigger review without being a universal pass/fail rule. This protects engineering judgment from dashboard optimisation.

## Industry Perspective

NIST AI RMF promotes ongoing risk management across AI-system lifecycle activities.[^nist-rmf] In MSQE terms, production learning must feed a governed evidence and change process rather than becoming passive metric collection.

## Common Misconceptions and Pitfalls

### “A better overall score means ship”

Overall scores can conceal a severe regression in a protected or safety-critical slice.

### “Production feedback is ground truth”

Observed behaviour reflects instrumentation, exposure, selection, and reporting patterns as well as product quality.

### “Regression means the model changed”

Retrieval, tools, policy, data, evaluators, application logic, and operational configuration can all change behaviour.

## QA → QE Transition

QA compares expected results before and after a change. Quality Engineering maintains the change inventory, evidence portfolio, release hierarchy, production-learning loop, limitations, and accountable decision record.

## Summary

AI regression testing compares a named system under documented conditions. Improvements must be interpreted by claim and consequence, while production signals are investigated as evidence rather than mistaken for proof.

## Key Takeaways

- Version every boundary that can affect the comparison.
- Do not average away a material safety or policy regression.
- Treat monitoring as a source of hypotheses with privacy and sampling limits.
- Define release, rollback, and revalidation triggers before change.

## Review Questions

1. Recalculate the four rates and the two percentage-point changes.
2. Why is averaging the groundedness and refusal results inappropriate?
3. What belongs in an AI change inventory?
4. Why can lower complaint volume be an ambiguous signal?

## Interview Questions

1. How would you create a regression strategy for a RAG assistant?
2. What evidence would make you hold a model or retrieval release?
3. How would you connect production monitoring to change governance?

## Practical Exercise

Create an **AI Change Evaluation and Production-Learning Plan** for the Atlas retrieval change. Include the change inventory, baseline/candidate evidence, release hierarchy, production signals, privacy boundary, accountable owner, decision, limitation, and revalidation trigger. Use only synthetic data.

## Further Reading

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [DORA: Capabilities](https://dora.dev/capabilities/)

## References

[^nist-rmf]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1). 2023. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can create a change inventory and comparable baseline.
- [ ] I can identify a material regression hidden by an aggregate improvement.
- [ ] I can distinguish production signals from quality proof.
- [ ] I can state a release and revalidation trigger.

## Chapter Navigation

Previous: [Chapter 10 — Safety, Fairness, Privacy, and Responsible Quality Boundaries](chapter-10-safety-fairness-privacy-and-responsible-quality-boundaries.md) · Next: [Chapter 12 — Capstone: AI Quality Strategy and Evaluation Portfolio](chapter-12-capstone-ai-quality-strategy-and-evaluation-portfolio.md)
