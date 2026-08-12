# Chapter 8 — Human Evaluation and Model-Based Evaluators

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 8 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–7 |
| Estimated study time | 175 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An evaluator is part of the quality system and must itself be evaluated before it is trusted with a release decision.

## Opening Story

The following is an **illustrative scenario**. Atlas compares two assistant configurations on policy answers. An LLM-based evaluator prefers configuration A because its prose is longer and more confident. A calibrated human panel prefers configuration B because it preserves a material exception and asks for missing category information.

Neither result should be dismissed. The disagreement exposes a quality boundary: the evaluator’s rubric, prompt, ordering, calibration, and use in a decision all require evidence.

## Why This Chapter Matters

Human evaluation can inspect contextual relevance and policy meaning that automated checks miss. It is costly, variable, and subject to disagreement. Model-based evaluators can scale some judgments but introduce position, verbosity, model-family, and rubric-following biases. The responsible question is not “human or judge model?” but what each method can validly support.

This chapter does not treat a judge-model score as ground truth or prescribe a particular annotation platform.

## Learning Objectives

By the end of this chapter, you should be able to:

- define an evaluation protocol with roles, criteria, and calibration;
- distinguish agreement from correctness;
- compare human and model-based evaluator evidence;
- test order and presentation sensitivity; and
- create an Evaluator Validation and Use Record.

## A Human Evaluation Protocol Is an Engineered Process

A protocol defines the task unit, evidence available to evaluators, rubric anchors, sampling, independent judgments, adjudication path, handling of uncertainty, conflicts of interest, data protection, and decision owner. Inter-rater agreement can reveal whether a rubric is applied consistently, but agreement alone does not prove the rubric measures the intended product quality.

Use human review where the claim needs contextual or normative judgment; use deterministic checks where a contract can be exact; use model-based evaluators only within evidence-backed boundaries. Blending methods does not remove the need to explain their limits.

## Worked Numerical Reasoning: Comparing an Evaluator with Human Adjudication

Atlas evaluates **30** synthetic answer pairs. After independent review and adjudication, the human panel prefers A in **16** pairs and B in **14**. The model-based evaluator prefers A in **21** and B in **9**. It agrees with the final human preference in **21 / 30 = 70%** of pairs: both prefer A in 14 pairs and both prefer B in 7; it prefers A where humans prefer B in 7 pairs and B where humans prefer A in 2.

| Element | Evidence and reasoning |
| --- | --- |
| Context | Two assistant configurations answer matched synthetic policy prompts. |
| Quality claim | A model-based evaluator may triage comparable answers but must not replace calibrated review for material policy decisions without validation. |
| Evidence | Human final preference: A 16, B 14. Judge preference: A 21, B 9. Agreement: 70%. |
| Interpretation | The judge has a detectable preference toward A in this sample and disagrees on 9 pairs. |
| Alternative | The human panel’s rubric or adjudication could be wrong; 30 pairs are a small, synthetic sample. |
| Limitation | Agreement is not accuracy, and pairwise preference does not measure factuality or safety on its own. |
| Decision | Use the judge only for assisted triage with sampled human audit; do not use it as sole release evidence for category-sensitive advice. |
| Revision trigger | Revalidate after rubric, judge prompt, model, answer format, or decision use changes. |

In a controlled order check, the same judge preferred the first-presented answer A in **12 of 15** original-order pairs but A in **9 of 15** reversed-order pairs. That difference is a signal to investigate presentation sensitivity, not proof of a universal position-bias rate.[^position-bias]

## A Synthetic Disagreement Packet

Atlas evaluates two responses to a category-exception question. The current synthetic policy says a product category is required before eligibility can be determined.

| Evidence item | Candidate A | Candidate B |
| --- | --- | --- |
| Response | “Your return is likely eligible. Contact support to continue.” | “I need the product category before I can determine eligibility. I can explain the general return process now.” |
| Grounding in active policy | Omits the material category requirement | States the material requirement |
| Helpfulness style | Direct and concise | Clarifies limitation and offers next step |
| Human evaluator 1 | Prefers B: safer and complete | Prefers B |
| Human evaluator 2 | Prefers A: shorter and less frustrating | Prefers A |
| Model-based judge | Prefers A, citing confidence and brevity | Prefers A |
| Task evidence | Category requirement makes A’s eligibility suggestion unsupported | B is the stronger task-bound answer |

The disagreement is productive. It demonstrates that “helpful” cannot be scored independently of the product safety claim. Human evaluator 2 may have a legitimate usability concern, but it does not make an unsupported eligibility suggestion acceptable. The judge’s preference may reveal a weighting problem in its rubric or prompt rather than a product-quality conclusion.

### A broader evaluator packet

| Case | Candidate A | Candidate B | Human A | Human B | Judge | Evidence-led interpretation |
| --- | --- | --- | --- | --- | --- | --- |
| Category required | “Likely eligible” | Requests category, gives general process | B | A | A | B is stronger: A makes an unsupported eligibility suggestion. |
| Current-policy citation | Cites active exception briefly | Longer answer cites archived policy | A | A | B | Both humans disagree with judge; verify verbosity/recency rubric. |
| Ambiguous delivery wording | Asks a clarification | Gives two conditional possibilities | A | B | Tie | Genuine task ambiguity; revise rubric or escalate. |
| Schema-constrained reply | Correct prose, missing `nextAction` field | Concise compliant answer | B | B | A | Deterministic contract should constrain judge use. |
| Safe refusal | Declines unsafe action and explains confirmation | Refuses all refund questions | A | A | A | Agreement does not remove need to test over-refusal population. |

The packet shows four different meanings of disagreement. In case one, the judge weights fluency over a material source condition. In case two, both domain-aware reviewers disagree with the judge: it is a potential judge limitation, not a vote that automatically proves the response safe. In case three, the humans disagree because the product’s acceptable clarification boundary is under-specified. In case four, a deterministic schema check resolves one criterion even if a judge likes the prose. Case five is agreement on a bounded behaviour, not an assurance that every refusal is appropriate.

## Evaluator Governance and Sufficiency

Evaluator quality is a release dependency. Define who has domain expertise, which sources reviewers can use, what they may infer, how conflicts are handled, and which evidence can override preference. A useful protocol keeps individual scores and rationales, then distinguishes:

- **Defect signal:** evaluators detect a material omission, wrong source, unsafe action, or contract breach.
- **Rubric defect:** equally reasonable ratings arise because anchors or allowed assumptions are missing.
- **Subjective variation:** more than one answer meets the defined boundary, but style preference differs.
- **Escalation need:** disagreement concerns policy, user harm, legal interpretation, or an unowned release criterion.

Majority voting is a weak substitute for this analysis. Two reviewers can agree for the wrong reason; one domain owner can identify a source condition neither reviewer saw; a judge can correlate with the same flawed reference used in the prompt. Confidence values supplied by a model evaluator are not calibrated probabilities unless separately validated for that task.

An evidence packet is sufficient for a bounded release decision only when its task coverage, rubric, evaluators, disagreements, source conditions, and decision use are visible. For Atlas category-dependent returns, the judge may triage ordinary examples, but an unresolved source-bound safety disagreement requires human adjudication and accountable review before promotion.

## Six-Response Adjudication Packet

| Case | Human A | Human B | Domain specialist | Model judge | Primary classification |
| --- | --- | --- | --- | --- | --- |
| Current-policy review answer | Pass | Pass | Pass | Pass | Human-human agreement; usable evidence |
| Category-required eligibility promise | Fail | Fail | Fail | Pass | Judge limitation or rubric/prompt defect |
| Concise clarification vs detailed conditional answer | A | B | B | A | Human-human disagreement; examine rubric ambiguity |
| Verbose archived-policy answer vs concise current-policy answer | B | B | B | A | Judge verbosity/source-authority failure |
| JSON schema breach with correct meaning | Fail | Fail | Fail | Pass | Deterministic contract overrides preference |
| Style-only wording variation | A | B | Tie | A | Genuine subjectivity if all constraints are met |

The evaluator record should retain the claim, rubric version, named qualifications, calibration status, individual results, disagreements, adjudication basis, limitation, permitted decision use, and revision trigger. A domain specialist is not a replacement for quality engineering; their source/policy interpretation can supply context that a generic reviewer or judge lacks.

## Calibration Workflow and Bounded Decision

Use the sequence: rubric → shared calibration examples → independent scoring → disagreement review → rubric refinement → bounded adjudication. Calibration reduces avoidable ambiguity, but it cannot turn subjective preference into objective truth. Blind evaluation can limit system-identity effects; it does not prevent fatigue, missing context, or a flawed rubric.

For a limited release of ordinary, source-complete policy explanations, combined evidence may be sufficient when deterministic schema and source checks pass, calibrated humans agree on sampled material cases, and the judge is used only for triage with audit. Neither human evidence alone nor judge evidence alone supports category-sensitive eligibility decisions where source authority or safety is disputed. Revalidate after changing evaluator instructions, model/judge, response format, rubric, source corpus, or decision use.

## Protocol, Calibration, and Adjudication

Before a larger evaluation, give evaluators the same task definition, source packet, rubric, examples of material and minor omissions, allowed use of tools, and escalation instructions. Ask them to score independently before discussing results. Calibration compares rationale as well as labels: two evaluators can choose the same score for incompatible reasons.

When ratings diverge, adjudication should record the disputed criterion, evidence considered, resolution, unresolved uncertainty, and whether the rubric needs revision. It should not merely replace two ratings with one apparently clean answer. A decision owner determines whether the residual disagreement is acceptable for the intended use.

| Evaluation activity | Purpose | Result that it can support | Result that it cannot support alone |
| --- | --- | --- | --- |
| Independent human ratings | Identify interpretation and rubric variation | Where humans disagree and why | Universal ground truth |
| Adjudication | Establish a documented reference for a bounded task | Release evidence for the adjudicated cases | Population-wide quality rate |
| Blind pairwise comparison | Reduce knowledge of system identity | Relative preference under stated rubric | Factuality unless source evidence is included |
| Model-based judge | Triage or scale a validated criterion | Prioritisation with audit | Autonomous release approval for material risk |
| Order reversal | Detect presentation sensitivity | Need for prompt/protocol investigation | A universal bias estimate |

## Judge Limitations Need Targeted Tests

Model-based evaluators can scale semantic comparison and apply structured rubrics. They may also favour first-presented answers, longer answers, answers matching their model family, or patterns present in their own training/evaluation history. These are hypotheses to test for the evaluator and task in use, not labels to attach to every result.

For Atlas, the original/reversed ordering result—A selected in 12 of 15 pairs when first and 9 of 15 when its position is reversed—suggests a presentation sensitivity worth investigating. The prior 30-pair aggregate still has 21/30 = 70% agreement with adjudicated human preference. The disagreement set matters: if it contains category-dependent safety advice, the judge is unsuitable as the sole gate even if it agrees on many ordinary questions.

Test verbosity explicitly. Pair a concise, source-complete answer with a longer answer that omits a material exception. If the judge repeatedly prefers length, revise its prompt/rubric or constrain its role. Do not compensate by asking it to “be objective”; the validation study and human audit define its operational boundary.

## Calibration, Adjudication, and Drift

Calibration asks evaluators to apply the rubric to shared examples, discuss ambiguity, and revise anchors before a larger study. Adjudication should preserve the reason for resolution, not merely the final label. Over time, new policy language, answer styles, and model behaviour can make an evaluator less valid; maintain a validation set that contains edge cases and known disagreements.

## When Is the Evidence Sufficient?

Evidence is sufficient only relative to a decision. For an internal comparison of harmless phrasing, a calibrated judge with a human audit may be enough to prioritise work. For category-sensitive refund advice, a judge/human disagreement and a material source omission make a sole automated approval inappropriate. The decision record should state the permitted use: triage, exploratory comparison, release evidence with independent review, or no use until revalidated.

Sample size also matters without becoming a statistical theatre exercise. The 30-pair sample exposes disagreement; it does not reliably describe all customer tasks, languages, or future model versions. Expand the set by decision slice, preserve observed disagreements, and revalidate after changing the rubric, answer format, judge prompt, evaluator model, or source context. Agreement should guide investigation, not replace task evidence.

## Engineering Perspective

An evaluator version includes its rubric, prompt, model or human protocol, examples, decision threshold, audit rate, and known limitations. Store enough evidence to reproduce the study safely. Do not use real customer content or sensitive attributes merely because it is convenient for calibration.

## Industry Perspective

Research identifies order and other biases in LLM-as-a-judge evaluation, reinforcing the need for controlled comparison and scoped use.[^position-bias] This is a reason to validate evaluator behaviour, not a reason to abandon structured evaluation.

## Common Misconceptions and Pitfalls

### “Human review is ground truth”

Humans can disagree, lack needed context, or apply an ambiguous rubric. Their protocol is evidence, not infallibility.

### “Seventy percent agreement means the judge is safe to automate release approval”

The result depends on sample, task, error severity, and decision use. Disagreement may concentrate in the most consequential cases.

### “Blind comparison eliminates every bias”

Blinding helps, but order, format, rubric, and selection effects can remain.

## QA → QE Transition

QA may use reviewer sign-off. Quality Engineering evaluates the reviewer system itself: criteria, calibration, disagreement, sampled audit, limitations, and the decisions the result is allowed to influence.

## Summary

Human and model-based evaluation are complementary, bounded sources of evidence. Their outputs are credible only when protocol, agreement, disagreement, bias checks, and intended decision use are explicit.

## Key Takeaways

- Evaluators are quality-system components, not neutral instruments.
- Agreement is informative but not equivalent to correctness.
- Validate judge models against an appropriate human protocol and task.
- Revalidate when the evaluator, rubric, answer format, or decision use changes.

## Review Questions

1. Recalculate the 70% agreement value.
2. Why does agreement not establish correctness?
3. What does the order-check result warrant, and what does it not prove?
4. When might human evaluation be essential?

## Interview Questions

1. How would you validate an LLM evaluator before using it in a release gate?
2. How would you calibrate a human evaluation panel?
3. What would you do when the judge and reviewers disagree on safety-critical cases?

## Practical Exercise

Create an **Evaluator Protocol and Judge-Validation Plan** for synthetic Atlas answer pairs. Include a rubric, calibration plan, blind-order plan, adjudication approach, audit rate, the permitted decision use, limitations, and revalidation triggers. Do not evaluate real customer conversations.

## Further Reading

- [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685)
- [Position Bias in LLM-as-a-Judge](https://arxiv.org/abs/2406.07791)

## References

[^position-bias]: Wang, Xinpeng, et al. [Position Bias in LLM-as-a-Judge](https://arxiv.org/abs/2406.07791). 2024. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can specify a human-evaluation protocol.
- [ ] I can distinguish agreement from correctness.
- [ ] I can calculate and interpret evaluator agreement.
- [ ] I can define a bounded use for a model-based evaluator.

## Chapter Navigation

Previous: [Chapter 7 — Retrieval-Augmented Generation Quality](chapter-07-retrieval-augmented-generation-quality.md) · Next: [Chapter 9 — Tool-Using and Agentic AI Systems](chapter-09-tool-using-and-agentic-ai-systems.md)
