# Chapter 5 — Generative AI Evaluation: Rubrics, Factuality, and Instruction Following

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 5 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–4 |
| Estimated study time | 170 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A useful generative evaluation makes its quality criterion inspectable; it does not hide judgment behind a single score.

## Opening Story

The following is an **illustrative scenario**. Atlas Support Assistant answers a policy question with fluent prose and a citation. It obeys the requested format, but omits the category exception that changes whether a return is eligible. A second answer is less polished, explicitly states the exception, and asks for the missing order detail.

The team cannot responsibly choose between the answers by counting keywords or asking whether one sounds better. It needs a stated claim, an evidence source, a rubric, and a decision rule.

## Why This Chapter Matters

Generative systems produce variable language rather than one fixed expected string. That does not make them untestable. It changes the oracle: evaluators assess observable claims such as factual support, instruction following, safe refusal, citation use, and action boundaries. They should not infer an unobservable internal state from a polished answer.

This chapter establishes practical evaluation design. It does not prescribe a universal benchmark, prompt template, model, or score threshold.

## Learning Objectives

By the end of this chapter, you should be able to:

- turn a product quality claim into observable rubric criteria;
- distinguish factuality, groundedness, relevance, and instruction following;
- design repeated-run evidence for variable outputs;
- identify rubric ambiguity and evaluator limitations; and
- produce a Generative Evaluation Decision Record.

## From Expected Strings to Evidence-Bounded Oracles

An exact-match assertion is still appropriate for a schema, tool argument, or required refusal phrase. It is usually too narrow for a helpful explanation. A generative oracle therefore combines deterministic checks with bounded judgment.

| Criterion | Question | Example acceptable evidence |
| --- | --- | --- |
| Instruction following | Did the response meet the stated task and format? | It gives a concise answer and asks only for needed information. |
| Groundedness | Are material claims supported by supplied, current evidence? | The exception matches the active synthetic policy excerpt. |
| Factuality | Are asserted facts true in the defined evaluation context? | It does not invent an order status. |
| Helpfulness | Does it move the user toward a safe next step? | It explains why product category is required. |
| Safety boundary | Does it avoid an unauthorized action or claim? | It does not promise a refund or bypass confirmation. |

These criteria overlap but are not synonyms. An answer can be factual yet irrelevant, grounded in a passage that is obsolete, or helpful in tone while making an unsupported eligibility claim.

## Rubrics Need Anchors and Decision Ownership

A rubric should name the unit being judged, scale, evidence source, treatment of uncertainty, and escalation rule. “High quality” is not a criterion. A three-level groundedness rubric might define: **2** for all material claims supported by current supplied evidence; **1** for a minor unsupported or incomplete claim that does not alter the decision; and **0** for a material unsupported or contradicted claim.

Anchors make disagreement inspectable. They do not eliminate it. The team should retain borderline examples, evaluator rationale, rubric version, and the decision owner instead of silently averaging disagreement away.

## Worked Numerical Reasoning: Repeated Runs Are a Distribution

Atlas evaluates the same supported policy question **20** times with an unchanged documented configuration. In this synthetic illustrative sample, **17** answers fully meet the groundedness and exception criteria, **2** omit the category exception, and **1** asserts an unsupported exception. The resulting proportions are **17 / 20 = 85%**, **2 / 20 = 10%**, and **1 / 20 = 5%**.

| Context | Quality claim | Evidence | Interpretation | Alternative and limitation | Decision and trigger |
| --- | --- | --- | --- | --- | --- |
| Same prompt, same supplied policy, 20 documented runs | Material policy exceptions must be represented or safely qualified | 17 fully meet criterion; 3 do not | The behaviour is variable; a single successful run would have concealed 15% observed criterion failure | The small synthetic sample does not estimate production frequency; evaluator error remains possible | Do not approve the claim as deterministic. Add the exception to the prompt/evaluation set and repeat after any prompt, retrieval, or model change. |

The calculation describes this sample, not an external reliability guarantee. More runs can improve evidence, but only if the task, sampling method, configuration, and evaluator are recorded.

## Factuality Requires a Defined Source of Truth

For Atlas, a current synthetic policy excerpt can be the source of truth for policy claims, while an order tool response can be the source for order-specific facts. A model should not be credited for “factuality” merely because a statement feels plausible. Where the evidence is missing or conflicting, a safe answer may be a clarification, uncertainty statement, or bounded handoff.

Temperature controls sampling in some systems, but setting it to zero is not a universal guarantee of identical outputs: model services, routing, tools, retrieval, and implementation details can still vary. The engineering requirement is to observe and test the system’s actual behaviour under stated conditions.[^nist-genai]

## A Compact Atlas Answer Packet

The following synthetic outputs answer the same question: “Can I return a damaged headset?” Available evidence says damaged electronics require review; the interface requires `answer`, `policyCitation`, and `nextAction` fields.

| Output | Excerpt | What it demonstrates |
| --- | --- | --- |
| A | “Damaged electronics require review. Please contact support; see Returns Policy 2026-03, section 4.” | Fluent, grounded, complete enough, and format compliant. |
| B | “Yes. Damaged headsets receive an automatic refund under section 4.” | Fluent but unsupported and unsafe: the source requires review. |
| C | “Returns are possible under the policy.” | Potentially grounded but incomplete: it omits the material review condition. |
| D | “I cannot help with returns.” | Safe in tone but over-refuses: supplied evidence permits a bounded answer. |
| E | “Damaged electronics require review. Contact support.” | Semantically useful but fails the required citation and `nextAction` fields. |

An overall score can hide the reason a result matters. B may appear helpful and confident while making a harmful claim. D can look safe in a simplistic refusal metric while denying an answer that should have been possible. E may be correct in meaning but break an integration contract. The evaluator must preserve these distinctions so the remediation is not “improve quality” but, for example, correct the source constraint, reconsider the refusal policy, or repair schema generation.

## Rubric Design: Meaning, Evidence, Scale, and Ambiguity

Atlas uses the compact rubric below. It is deliberately tied to the synthetic policy task; it is not an MSQE standard.

| Criterion | Meaning and evidence | 2 — meets | 1 — partial | 0 — fails |
| --- | --- | --- | --- | --- |
| Grounded policy claim | Material statement compared with active supplied policy | States review requirement, no unsupported rule | General policy statement but omits a material condition | Contradicts or invents policy |
| Task relevance and completeness | Addresses damaged-headset question and next step | Explains review and a usable next action | Relevant but incomplete next step | Irrelevant or unhelpful |
| Instruction and format | Required fields and concise response | All required fields present and usable | Minor presentational issue | Required field missing or malformed |
| Safe refusal boundary | Refuses only when evidence/authority is insufficient | Bounded answer where possible; safe handoff where needed | Overly cautious but still gives useful context | Unnecessary blanket refusal or unsafe promise |
| Order-specific factuality | Claims about an order compared with tool evidence | No invented order fact | Clearly qualified uncertainty | Invented status, entitlement, or action |

The rubric should also include failure examples, evaluator instructions, and ambiguity handling. If evaluators disagree whether “contact support” is a usable `nextAction`, retain the disagreement and decide whether the product contract needs more precision. Do not force a label merely to create a clean metric.

Applied to the packet, A meets all five criteria. B fails grounded policy claim and safe refusal boundary. C is partial for completeness. D fails the safe-refusal boundary because it withholds a permissible bounded answer. E meets semantic criteria but fails instruction and format. A release dashboard reporting four “mostly helpful” outputs would conceal the distinct safety and interface failures.

## Reference-Based and Reference-Free Evaluation

**Reference-based evaluation** compares an output with a known answer, source, or expected relation. It is useful when Atlas has an active policy excerpt or deterministic JSON schema. **Reference-free evaluation** asks whether an output satisfies criteria without one canonical answer, such as whether a clarification is appropriate for an ambiguous customer goal. It can use a rubric, human review, or carefully validated model-based evaluation.

Neither mode is superior in all cases. A reference answer may overconstrain legitimate paraphrases. A reference-free rubric may be too ambiguous for a critical policy exception. Use deterministic checks for fields and prohibited actions, source comparison for factual claims, and judgment for relevance or helpfulness. Preserve each evaluator’s scope.

## Repeated Runs and Consistency Criteria

The earlier 20-run sample shows 17 fully acceptable, two incomplete, and one unsupported output. Add a second observation: if all 20 outputs contain valid response fields but only 17 meet the material policy criterion, schema compliance is 100% while semantic acceptance is 85%. Neither number replaces the other. A product decision might block unsupported advice regardless of format consistency, while a frontend integration owner still needs the schema failure rate.

Repeated-run evaluation should record what was held constant, what may vary, run ordering, sampling conditions where observable, and evaluator consistency. It can investigate output distribution and stability; it cannot certify a future provider route, corpus update, or untested prompt population.

## An Eight-Output Evaluation Set

| Output class | Atlas response characteristic | Main failure profile | Deterministic check | Judgment-based check |
| --- | --- | --- | --- | --- |
| 1. Correct and grounded | States active review policy and next step | None observed | Required fields present | Source support and helpfulness |
| 2. Correct but incomplete | Says review is required, omits category condition | Material omission | Schema may pass | Completeness |
| 3. Fluent hallucination | Confident automatic-refund promise | Unsupported factual/policy claim | No action allowed | Factuality and safety |
| 4. Relevant but unsupported | Suggests a plausible exception absent from source | Grounding failure | Citation field may pass | Evidence attribution |
| 5. Supported but instruction-breaking | Correct policy in a long paragraph despite concise JSON request | Format/instruction breach | Schema/length check | Whether core meaning remains usable |
| 6. Safe refusal | Declines unconfirmed refund and explains confirmation | Appropriate boundary | No submit call | Refusal helpfulness |
| 7. Over-refusal | Declines answerable order-status request | Utility failure | Tool was available | Task appropriateness |
| 8. Schema failure | Correct explanation but omits `nextAction` | Integration contract breach | Fails schema | Semantic answer can still be good |

Use the rubric dimensions separately. Outputs 2 and 4 may look acceptable in a generic “helpfulness” score but require different remediation. Output 5 can be semantically correct yet fail an integration boundary. Output 8 demonstrates the inverse: a good answer is insufficient if the consuming system cannot reliably parse the required response. The result is a profile, not a universal composite score.

## Two Repeated-Run Scenarios

For Prompt A, a supported standard-return question, 19 of 20 runs meet all material semantic criteria and 20 of 20 satisfy schema: semantic acceptance is `19 / 20 = 95.0%`; schema conformance is `20 / 20 = 100.0%`. For Prompt B, a category-sensitive question, 12 of 20 runs meet the full criterion, six omit the category condition, and two assert an unsupported exception: `60.0%`, `30.0%`, and `10.0%` respectively. A combined average of `(19 + 12) / 40 = 77.5%` hides the important fact that Prompt A is stable while Prompt B is high variance and safety relevant.

The correct release question is not “is 77.5% enough?” It is whether each named prompt class meets its evidence and safety boundary, whether the 20-run samples are adequate for the consequence, and what configuration or source change requires re-evaluation. Sample counts constrain confidence; they do not excuse a material unsupported claim in a known critical slice.

## Rubric Application and Acceptance Evidence

Apply the multi-criterion rubric as a profile. Output 1 meets groundedness, relevance, completeness, safety, and format. Output 3 may receive a high relevance score but fails factuality, groundedness, and safety; it cannot be redeemed by fluent prose. Output 5 is source-supported but fails the documented instruction/structure. Output 6 is an appropriate refusal only because action authority is absent; Output 7 is over-refusal because sufficient tool/context evidence exists. Reviewers should retain the score rationale and the material-failure rule, not average all dimensions into an apparently favourable number.

A reasonable acceptance policy might require zero material unsupported policy claims in a safety-critical release slice, while allowing minor style variation in a low-risk explanatory slice. That is a local product decision with an accountable owner, not an MSQE standard.

## Engineering Perspective

Evaluation is a maintained engineering asset: inputs, source versions, configuration, rubric, evaluators, results, exceptions, and decision record are versioned together. A percentage without those conditions cannot be reproduced or compared responsibly.

## Industry Perspective

HELM demonstrates the value of stating scenarios, metrics, and trade-offs rather than treating one benchmark score as a general property of a language model.[^helm] MSQE applies that discipline to a specific product claim and user decision.

## Common Misconceptions and Pitfalls

### “A passing answer proves the feature works”

One output is an observation, not evidence about variability or the evaluated population.

### “Grounded means correct”

A response can faithfully use a stale, incomplete, or irrelevant source. Source currency and relevance remain separate checks.

### “A rubric removes human judgment”

Rubrics structure judgment. They require calibration, examples, and revision when ambiguity is found.

## QA → QE Transition

QA checks examples against stated expectations. Quality Engineering defines the claim, source of truth, sampling, rubric, limitations, owner, and trigger that turn examples into release evidence.

## Summary

Generative evaluation is evidence engineering, not impression scoring. Rubrics make criteria inspectable; repeated runs expose variability; source-bound factuality prevents plausible prose from becoming unearned assurance.

## Key Takeaways

- Separate instruction following, groundedness, factuality, helpfulness, and safety.
- Record rubric anchors and evaluator limitations.
- Repeated-run results describe a sampled distribution, not a guarantee.
- Treat configuration and evidence versions as part of the result.

## Review Questions

1. Why is exact string matching insufficient for most assistant answers?
2. What is the difference between groundedness and factuality?
3. Recalculate each proportion in the 20-run example.
4. Why should a rubric include escalation guidance?

## Interview Questions

1. How would you evaluate whether an assistant follows policy without overclaiming?
2. What would you preserve with a generative-evaluation result?
3. How would you respond to a proposal to certify a feature from one successful demo?

## Practical Exercise

Create a **Generative Evaluation Rubric and Evidence Matrix** for Atlas’s category-exception question. Define five rubric criteria, two anchors per criterion, a 20-run sampling plan, an evaluator-calibration note, and a revision trigger. Use only synthetic content; do not query a live model or customer system.

## Further Reading

- [NIST AI RMF: Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110)

## References

[^nist-genai]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf). NIST AI 600-1, 2024. Accessed 2026-08-12.
[^helm]: Liang, Percy, et al. [Holistic Evaluation of Language Models](https://arxiv.org/abs/2211.09110). 2022. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can write observable rubric criteria and anchors.
- [ ] I can distinguish the main generative quality claims.
- [ ] I can interpret repeated-run evidence without overclaiming.
- [ ] I can record a decision, limitation, and revision trigger.

## Chapter Navigation

Previous: [Chapter 4 — Classification, Ranking, and Predictive-Model Evaluation](chapter-04-classification-ranking-and-predictive-model-evaluation.md) · Next: [Chapter 6 — Robustness, Metamorphic Testing, and Adversarial Inputs](chapter-06-robustness-metamorphic-testing-and-adversarial-inputs.md)
