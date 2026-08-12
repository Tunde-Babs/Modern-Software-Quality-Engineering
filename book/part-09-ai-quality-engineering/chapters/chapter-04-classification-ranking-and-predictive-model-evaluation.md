# Chapter 4 — Classification, Ranking, and Predictive-Model Evaluation

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 4 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapter 3 and proportionate quantitative reasoning |
| Estimated study time | 190 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A metric is evidence about a defined decision boundary, not a substitute for deciding whose errors matter and why.

## Opening Story

The following is an **illustrative scenario**. Atlas Refund Risk flags refunds for manual review. The team reports 93.2% accuracy on 1,000 synthetic evaluation cases and proposes approval. Only 100 cases are truly high risk. The system correctly flags 68 of them and misses 32. A missed high-risk refund has a modeled cost of EUR400; an unnecessary review has a modeled cost of EUR20.

The aggregate number sounds strong. The decision is not. A Quality Engineer must decide which errors, population slices, and threshold trade-offs matter before treating accuracy as useful evidence.

## Why This Chapter Matters

Predictive and ranking systems are important AI-system types. They should not disappear behind LLM examples. Their evaluation requires familiar quantitative care plus context: the positive class, threshold, prevalence, affected users, error costs, and uncertainty in the labels.

This chapter explains metrics sufficiently to support engineering decisions. It is not a model-training course, mathematical proof course, or prescription to optimize one score.

## Learning Objectives

By the end of this chapter, you should be able to:

- construct and interpret a confusion matrix;
- calculate accuracy, precision, recall, specificity, and F1;
- explain why class imbalance can make accuracy misleading;
- compare threshold trade-offs using explicit local error costs; and
- create a Metric, Threshold, and Error-Cost Decision Record.

## The Confusion Matrix Makes Error Types Visible

For a binary classifier, a positive prediction can be correct (**true positive**, TP) or incorrect (**false positive**, FP). A negative prediction can be correct (**true negative**, TN) or incorrect (**false negative**, FN).

| Actual / predicted | Flag for review | Do not flag |
| --- | ---:| ---:|
| High risk | TP | FN |
| Not high risk | FP | TN |

The metrics below answer distinct questions:

- **Accuracy** = `(TP + TN) / total`: how often the classifier is correct overall.
- **Precision** = `TP / (TP + FP)`: of flagged cases, how many are actually high risk?
- **Recall** = `TP / (TP + FN)`: of actual high-risk cases, how many were flagged?
- **Specificity** = `TN / (TN + FP)`: of actual non-high-risk cases, how many were not flagged?
- **F1** = `2TP / (2TP + FP + FN)`: harmonic balance of precision and recall.

None says which trade-off is acceptable. That decision requires consequence, capacity, policy, and ownership.

## Worked Numerical Reasoning: Strong Accuracy, Weak Detection

Atlas evaluates 1,000 synthetic refunds at a stricter threshold.

| Actual / predicted | Flagged | Not flagged | Total |
| --- | ---:| ---:| ---:|
| High risk | TP = 68 | FN = 32 | 100 |
| Not high risk | FP = 36 | TN = 864 | 900 |
| Total | 104 | 896 | 1,000 |

The independently calculated metrics are:

- Accuracy = `(68 + 864) / 1,000` = `932 / 1,000` = **93.2%**.
- Precision = `68 / (68 + 36)` = `68 / 104` = **65.4%**.
- Recall = `68 / (68 + 32)` = `68 / 100` = **68.0%**.
- Specificity = `864 / (864 + 36)` = `864 / 900` = **96.0%**.
- F1 = `2 × 68 / (136 + 36 + 32)` = `136 / 204` = **66.7%**.

Accuracy is high partly because 900 cases are not high risk. The classifier misses 32 of the 100 high-risk cases. Whether that is acceptable depends on the decision, not a generic target.

## Thresholds Change the Decision Boundary

At a lower threshold, Atlas flags more cases:

| Actual / predicted | Flagged | Not flagged | Total |
| --- | ---:| ---:| ---:|
| High risk | TP = 82 | FN = 18 | 100 |
| Not high risk | FP = 108 | TN = 792 | 900 |
| Total | 190 | 810 | 1,000 |

At this threshold, precision is `82 / 190` = **43.2%**, recall is `82 / 100` = **82.0%**, specificity is `792 / 900` = **88.0%**, accuracy is `(82 + 792) / 1,000` = **87.4%**, and F1 is `164 / 290` = **56.6%**.

Suppose, for this illustrative decision only, that each FN costs EUR400 and each FP costs EUR20. The strict threshold’s modeled error cost is `(32 × 400) + (36 × 20)` = **EUR13,520**. The lower threshold’s is `(18 × 400) + (108 × 20)` = **EUR9,360**. The lower threshold creates more reviews but lower modeled error cost. Those costs are assumptions, not discovered facts; a domain owner must validate them.

## Three Thresholds, Three Operational Decisions

Threshold selection is a policy and capacity decision made with quantitative evidence. To make that explicit, Atlas compares three thresholds on the same 1,000 synthetic refunds. The local model assumes an FN costs EUR400 and an FP costs EUR20. It does **not** claim those values are universal or complete measures of harm.

| Threshold option | TP | FP | TN | FN | Precision | Recall | Estimated error cost | Review volume |
| --- | ---:| ---:| ---:| ---:| ---:| ---:| ---:| ---:|
| Strict | 68 | 36 | 864 | 32 | `68 / 104 = 65.4%` | `68 / 100 = 68.0%` | `(32 × 400) + (36 × 20) = EUR13,520` | 104 |
| Balanced | 82 | 108 | 792 | 18 | `82 / 190 = 43.2%` | `82 / 100 = 82.0%` | `(18 × 400) + (108 × 20) = EUR9,360` | 190 |
| Broad | 90 | 240 | 660 | 10 | `90 / 330 = 27.3%` | `90 / 100 = 90.0%` | `(10 × 400) + (240 × 20) = EUR8,800` | 330 |

The broad option has the lowest result under this intentionally narrow cost model, but it generates 330 reviews. If the review team can process only 250 safely in the decision period, the nominal cost comparison is incomplete. Delays, inconsistent review, customer disruption, and staff workload are additional operational evidence—not reasons to return to “highest accuracy wins.”

The relevant decision record therefore includes: current review capacity; queue-time and service-level evidence; the consequences of delayed review; who validates error-cost assumptions; affected customer journeys; subgroup results; and the conditions under which the threshold is revisited. A Quality Engineer can recommend the balanced option for a limited controlled period, for example, while recording why the broad option is not currently operationally safe and why the strict option misses too many costly cases. The domain owner approves the trade-off.

## Interpret Metrics by Failure Consequence

Precision answers whether a flag is useful to reviewers. Recall answers whether known high-risk cases are found. Specificity answers whether ordinary cases avoid unnecessary review. F1 balances precision and recall symmetrically; it does not know the manual-review capacity, customer effect, or regulatory obligation. Accuracy is especially vulnerable to class imbalance: predicting “not high risk” for all 1,000 cases would be 90% accurate here while recovering none of the 100 high-risk cases.

Metrics can also be unstable for small or changing slices. A 10-case subgroup with two errors does not support the same strength of conclusion as a 1,000-case population, but it may still be a safety signal. Report counts alongside rates, preserve label provenance, and avoid reporting unwarranted decimal precision.

## Calibration, Ranking, and Slice Evidence

Calibration supports a different operational question: whether a score can be interpreted as a probability-like estimate for a stated population and time period. A classifier can have acceptable discrimination yet be poorly calibrated, especially after population or policy changes. If Atlas uses a score to route a case into a different workflow, it needs calibration evidence for that route rather than an assumption based on F1.

For Atlas Discovery, ranking has a related but distinct problem. A product may be technically relevant but unsuitable because it conflicts with a selected item, a delivery need, or an accessibility constraint. A ranking evaluation should define the query or journey, candidate set, relevance judgment, position/exposure, and the failure consequences of placing an unsuitable item first. A click or purchase proxy can be useful operational evidence but may be affected by presentation, price, or availability.

### Ranking requires the same discipline

Atlas Discovery ranks products. A top-ranked product may be relevant on average yet unsuitable for a customer who needs a compatible accessory. Ranking measures must name the task, exposure, relevance signal, and population. A generic click measure may not establish purchase suitability, fairness, or customer benefit.

ROC and precision-recall curves can show performance across thresholds. Under class imbalance, precision-recall views often make positive-class trade-offs easier to inspect; neither curve chooses the business threshold for the team.[^davis-goadrich]

## Calibration Is a Separate Question

**Calibration** asks whether a predicted confidence has a meaningful relationship to observed frequency for a defined population. A score of 0.80 is not automatically an 80% probability merely because a product displays it. Calibration evidence needs its own method, data, and limitations; it should not be inferred from accuracy or F1.

## Engineering Perspective

Metrics should be reviewed with data provenance, label quality, population slices, and operational capacity. A lower threshold may reduce costly misses while overwhelming reviewers. A higher threshold may protect capacity while increasing harm. Quality Engineering makes the trade-off explicit, records who owns it, and defines a revision trigger.

## Industry Perspective

Precision-recall analysis is widely used to examine class-imbalanced decisions, but its interpretation remains task-specific.[^davis-goadrich] The metric is not the release policy; it is one input to a decision with operational and user consequences.

## Common Misconceptions and Pitfalls

### “Accuracy is the quality score”

Accuracy can be useful, but it can conceal a failure in a rare and consequential class.

### “F1 selects the threshold”

F1 weights precision and recall equally in its formula. A real decision may not value their errors equally.

### “A score is calibrated because it is high”

Calibration concerns the interpretation of probability-like scores, not whether a metric looks strong.

## QA → QE Transition

QA verifies expected classifications. Quality Engineering selects measures, slices, thresholds, and evidence boundaries that make error consequences visible and support a defensible decision.

## Summary

Confusion matrices expose the errors hidden in aggregate results. Accuracy, precision, recall, specificity, and F1 answer different questions. Threshold selection requires explicit local assumptions about harm, capacity, and ownership.

## Key Takeaways

- Always inspect the confusion matrix before relying on an aggregate metric.
- Class imbalance can make high accuracy compatible with poor positive-class detection.
- Thresholds trade false positives against false negatives; costs must be stated as assumptions.
- Calibration, ranking relevance, and subgroup performance require separate evidence.

## Review Questions

1. Why is 93.2% accuracy insufficient for the Atlas decision?
2. Recalculate the strict-threshold F1 score from the matrix.
3. Which threshold has lower modeled error cost under the stated assumptions?
4. Why can no metric choose a threshold by itself?

## Interview Questions

1. How would you evaluate a fraud or risk classifier with a rare positive class?
2. What would you ask before changing a decision threshold?
3. How do precision and recall affect a manual-review workflow?

## Practical Exercise

Create a **Metric, Threshold, and Error-Cost Decision Record** using the two Atlas matrices. Verify each metric, identify the assumptions in the cost model, propose a preliminary threshold recommendation, and state the missing evidence required before a production decision.

## Further Reading

- [The Relationship Between Precision-Recall and ROC Curves](https://dl.acm.org/doi/10.1145/1143844.1143874)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

## References

[^davis-goadrich]: Davis, Jesse, and Mark Goadrich. [The Relationship Between Precision-Recall and ROC Curves](https://dl.acm.org/doi/10.1145/1143844.1143874). *Proceedings of the 23rd International Conference on Machine Learning*, 2006. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can construct and calculate a confusion matrix.
- [ ] I can explain why accuracy can mislead under class imbalance.
- [ ] I can compare thresholds using explicit, local cost assumptions.
- [ ] I can distinguish calibration from classification accuracy.

## Chapter Navigation

Previous: [Chapter 3 — Evaluation Data, Oracles, and Experimental Design](chapter-03-evaluation-data-oracles-and-experimental-design.md) · Next: [Chapter 5 — Generative AI Evaluation: Rubrics, Factuality, and Instruction Following](chapter-05-generative-ai-evaluation-rubrics-factuality-and-instruction-following.md)
