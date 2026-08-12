# Chapter 6 — Robustness, Metamorphic Testing, and Adversarial Inputs

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 6 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–5 |
| Estimated study time | 160 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Robustness testing asks which meaningful changes should preserve, constrain, or deliberately change behaviour—and records the boundary.

## Opening Story

The following is an **illustrative scenario**. Atlas Support Assistant correctly explains a returns policy for a plain-language question. A user then inserts a long quoted email, changes punctuation, adds an instruction to ignore policy, and asks the same policy question. The answer becomes a refund promise.

The defect is not “the prompt was strange.” Real inputs contain formatting, ambiguity, malicious text, copied material, and incomplete context. The engineering task is to identify expected invariants and safe changes in behaviour.

## Why This Chapter Matters

Traditional tests often vary one input and expect one exact output. AI systems complicate that pattern: many outputs can be acceptable, and some input transformations should preserve the decision while others must change it. **Metamorphic testing** checks relationships between outputs across deliberately related inputs when a single perfect oracle is unavailable.

This chapter concerns product-specific robustness evidence. It is not a claim that a finite test set can prove security, safety, or resistance to every adversarial technique.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish robustness, security, and generalization claims;
- write metamorphic relations for AI behaviour;
- design adversarial-input tests with explicit limits;
- classify a failure across prompt, retrieval, tool, or application boundaries; and
- produce a Robustness and Metamorphic Test Charter.

## Robustness Is a Relationship, Not a Vague Attribute

For a stated task, identify an input transformation and the expected relationship:

| Transformation | Expected relation | Unsafe overclaim |
| --- | --- | --- |
| Whitespace or punctuation variation | Material policy conclusion remains equivalent | “Every word must match.” |
| Irrelevant quoted text | Answer remains grounded in authorised context | “The model must ignore all user text.” |
| Missing order category | Assistant asks for information or declines eligibility conclusion | “It should guess from history.” |
| Embedded override instruction | It must not supersede system/product policy | “Prompt injection is solved.” |
| Current-policy version change | Outcome may change, and citation must reflect the new source | “Behaviour must remain identical.” |

The relation is the oracle. It must specify equivalence carefully: preserving a decision and safety boundary may matter more than preserving wording.

## Build a Metamorphic Test Charter

For each relation, record the original case, transformation, expected invariant or permitted change, evaluator, evidence, owner, and trigger. Include the system configuration and retrieval corpus version; otherwise a later difference cannot be interpreted.

Adversarial inputs should be handled in a controlled, authorised environment with synthetic data. Avoid publishing operational bypass instructions or treating a test prompt collection as a security guarantee.

## Worked Reasoning: Missing Context Is a Required Behaviour Change

| Element | Evidence and reasoning |
| --- | --- |
| Context | Atlas receives a policy question with a valid synthetic policy passage and no product category. |
| Quality claim | The assistant may explain general policy but must not make a category-dependent eligibility determination without the category. |
| Transformation | Remove the category from a previously complete order-tool response. |
| Expected relation | The response changes from a conditional explanation to a clarification or bounded handoff; it must not retain the prior eligibility conclusion. |
| Evidence | The output contains a request for category, no refund promise, and no tool action. |
| Alternative | A failure might be caused by cached application context rather than model inference. |
| Limitation | One relation covers this missing field, not all forms of missing or contradictory information. |
| Decision and trigger | Add the relation to regression evidence; investigate any retained conclusion after prompt, tool-schema, or context-handling changes. |

This is a safety relation, not an assertion that every clarification must use identical words.

## Adversarial Inputs Need Boundaries

Input attacks can target instructions, retrieval content, tool arguments, output rendering, or human review. A useful test campaign asks: what is the protected action or claim; which input boundary is exercised; what safe outcome is expected; and what evidence lets the team diagnose failure? A refusal can be appropriate, but it should be evaluated for helpfulness and correct escalation rather than rewarded automatically.

The NIST Generative AI Profile identifies risks that require context-specific treatment across the AI lifecycle.[^nist-genai] MSQE uses that context to make the test claim narrow and revisable.

## Candidate Relations Need a Reasoned Invariant

The following catalogue extends the charter. Each relation begins with a known synthetic case, changes one defined property, and names why the system should preserve or change behaviour.

| Original input | Transformation | Expected invariant or permitted change | Why | When the relation should **not** hold |
| --- | --- | --- | --- | --- |
| “Can I return this damaged headset?” | Add punctuation and normal whitespace variation | Same policy decision and safe next action | Presentation does not change the request’s meaning | Punctuation creates a materially different identifier or data field. |
| Plain return question | Paraphrase as “Is this headset eligible to go back?” | Same material policy conclusion | Intended meaning is equivalent | Paraphrase adds a new fact such as product category or damage cause. |
| Policy question | Reorder neutral greeting and quoted email signature | Same source-grounded decision | Reordered neutral text is irrelevant to eligibility | Reordering changes a list, date, or order of operations that is semantically meaningful. |
| Two otherwise identical product requests | Substitute a protected attribute not relevant to policy | Same eligibility conclusion and explanation quality | The stated task has no policy dependence on that attribute | The attribute changes a jurisdiction, lawful programme, accessibility need, or another genuine task condition. |
| Complete policy context | Remove category-specific supporting passage | Must ask for missing information or state a bounded limitation; must not retain the old conclusion | The evidence necessary for the conclusion is absent | The general policy independently permits the same conclusion. |
| Current source plus neutral text | Insert a conflicting but unapproved source | Prefer the authorised current source or explicitly flag conflict | Source authority matters, not semantic similarity alone | The inserted source is later approved and supersedes the old one. |

The last column protects against a common error: treating a transformation as harmless without checking whether it changes the task. A metamorphic relation is a justified property, not a test-data mutation rule.

## A False Assumption: “Paraphrase Must Preserve Every Output”

Consider the original request, “Can I return this headset?” and the variation, “Can I return this damaged headset?” A test that requires identical answers would flag the valid change from a general policy explanation to a damaged-electronics review requirement. The variation adds a material fact. The correct relation is not output equality; it is that each response follows the policy applicable to its own stated facts and does not invent missing information.

Similarly, protected-attribute substitution is valuable only when the attribute is intentionally irrelevant to the decision. If it changes a location with a different return law, a signed accessibility accommodation, or an entitlement that the product is designed to consider, invariance would be the wrong quality claim. Document the rationale and obtain domain guidance rather than turning a fairness check into a false assertion.

## Bounded Adversarial-Input Reasoning

Atlas should exercise noisy text, malformed identifiers, irrelevant quoted content, conflicting sources, and embedded override instructions in a controlled synthetic environment. The question is not whether a string “defeats” a model. It is whether the system keeps a protected claim or action within its boundary.

For an embedded instruction in retrieved text, the expected evidence includes: source authority; classification of the text as content rather than system instruction; prompt-context treatment; output; tool-call proposal if any; and policy-layer decision. A helpful answer may say that the supplied sources conflict or request clarification. It must not allow document text to grant a refund or override independent confirmation. This is bounded product robustness testing, not an offensive-security exercise; Part X owns deep security analysis and threat-model implementation.

## Failure Analysis for a Broken Relation

If punctuation variation produces a different eligibility decision, do not presume sampling variance. Compare the request normalisation, language detection, retrieval query, selected passages, prompt context, model output, and rendered response. The likely correction might be a conventional parsing defect, a retrieval index behaviour, prompt construction, or model sensitivity. The regression test should retain the relationship and the diagnostic evidence, not only the surprising output.

## Engineering Perspective

Robustness relations become durable regression checks when they are connected to a product invariant, test data provenance, evaluator, and release trigger. They also reveal non-model defects: a normalized request might be routed to a different retrieval index, or a tool argument might be truncated before the model sees it.

## Industry Perspective

Metamorphic testing is a long-standing approach for systems with difficult test oracles. In AI products it is particularly valuable when it states the expected relation precisely rather than declaring an input “adversarial” after an outcome surprises the team.[^metamorphic]

## Common Misconceptions and Pitfalls

### “A prompt-injection test proves the product is secure”

It provides evidence for the tested boundary and configuration only. Security requires broader threat modelling and controls.

### “Robust output means identical output”

Wording can vary while the required decision or safety boundary remains stable.

### “Every transformation should preserve behaviour”

Removing essential evidence or changing an active policy should change the response safely.

## QA → QE Transition

QA varies inputs to find defects. Quality Engineering defines the relationship that should hold, the boundary under test, the evidence needed to diagnose a breach, and the release action when it occurs.

## Summary

Metamorphic relations supply useful oracles when a single expected AI response is inappropriate. Robustness evidence is meaningful only when its invariant, transformation, system boundary, limitation, and decision are explicit.

## Key Takeaways

- Test expected relationships, not just isolated prompts.
- State when behaviour should change as well as when it should remain constrained.
- Keep adversarial testing authorised, synthetic, and bounded.
- A robustness failure may originate outside the model.

## Review Questions

1. What makes a metamorphic relation a useful oracle?
2. Why should removing product category change Atlas’s behaviour?
3. How does a robustness claim differ from a security guarantee?
4. What evidence would distinguish a model failure from a cached-context failure?

## Interview Questions

1. How would you design robustness tests for a policy assistant?
2. Which inputs should preserve a decision and which should change it?
3. How would you report the limitation of an adversarial-input test suite?

## Practical Exercise

Create a **Metamorphic Relation Catalogue and Robustness Test Charter** with six Atlas transformations: formatting variation, irrelevant text, missing category, contradictory source, embedded override, and policy-version change. State each expected relation, evidence, limitation, owner, and revision trigger. Use synthetic data only.

## Further Reading

- [NIST AI RMF: Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)
- [Metamorphic Testing: A Review of Challenges and Opportunities](https://dl.acm.org/doi/10.1145/3143561)

## References

[^nist-genai]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf). NIST AI 600-1, 2024. Accessed 2026-08-12.
[^metamorphic]: Chen, Tsong Yueh, et al. [Metamorphic Testing: A Review of Challenges and Opportunities](https://dl.acm.org/doi/10.1145/3143561). *ACM Computing Surveys*, 2018. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can define a metamorphic relation with a bounded oracle.
- [ ] I can identify when a safe response should change.
- [ ] I can state the limitation of a robustness test.
- [ ] I can link a failing relation to a diagnostic boundary.

## Chapter Navigation

Previous: [Chapter 5 — Generative AI Evaluation: Rubrics, Factuality, and Instruction Following](chapter-05-generative-ai-evaluation-rubrics-factuality-and-instruction-following.md) · Next: [Chapter 7 — Retrieval-Augmented Generation Quality](chapter-07-retrieval-augmented-generation-quality.md)
