# Chapter 1 — AI Quality Engineering: Behaviour, Evidence, and Boundaries

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 1 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Parts I and III; Part VIII evidence concepts recommended |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An AI output is an observation. It becomes evidence for a decision only when the task, population, oracle, uncertainty, and consequence are explicit.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce releases a support assistant that answers delivery and returns questions. A reviewer asks, “Does it answer correctly?” The assistant gives a fluent response: a customer may return an unopened item within 30 days. The response has the expected tone and passes a simple format check.

The answer is nevertheless unsafe to approve. The current policy permits a 30-day return only for one product category; the customer’s product is an excluded hygiene item. The assistant retrieved a general policy summary, not the category exception. A second run produces a cautious answer that asks for the product category. A third produces a confident but incomplete answer. The application, retrieval layer, prompt, model, policy corpus, and evaluation method could all have contributed.

The engineering question is not whether one string matches a preferred string. It is what behaviour matters, which population the claim covers, what evidence supports it, and what decision is justified while uncertainty remains.

## Why This Chapter Matters

AI-enabled systems retain conventional quality concerns: requirements, interfaces, data, state, privacy, security, observability, and delivery all still matter. What changes is the evaluation problem. A classifier can be wrong in ways that depend on threshold and population. A ranking system can serve one group well and another poorly. A generative system can produce multiple acceptable responses, or a fluent unsupported response.

This chapter establishes the vocabulary used throughout Part IX. It does not replace Part III testing strategy, Part VI data-quality engineering, or Part VIII operational evidence. It applies their evidence discipline to systems in which exact expected-output comparison is often useful but insufficient.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish an AI-system quality claim from a single output check;
- identify deterministic and variable behaviour within one system;
- define a useful AI system, population, evidence, and decision boundary;
- explain why an output can be plausible yet inadequate evidence; and
- create an AI Quality Claim Canvas for a bounded engineering decision.

## AI Quality Is System Quality Under Additional Uncertainty

An AI system is more than a model response. It can include a conventional application, API clients, prompt or instruction configuration, retrieval corpus, tool interfaces, user interface, telemetry, evaluation data, and human review. A defect in any of those components can produce an unacceptable result.

The NIST AI RMF is a risk-management framework, not an AI testing standard or a universal acceptance model.[^nist-rmf] It is useful here because it reinforces that AI risk is contextual and that technical evidence must be connected to intended use and affected people.

Three distinctions prevent shallow evaluation:

1. **Deterministic boundary versus variable component.** A schema validator, tool authorization check, or policy-version lookup may have deterministic expectations even when generation is variable.
2. **Output observation versus quality claim.** “This answer was helpful” is an observation or judgement. “For current returns-policy questions in the evaluated population, answers are grounded in the supplied policy and meet the agreed rubric at an acceptable rate” is a bounded claim.
3. **Model boundary versus system boundary.** A bad answer may result from stale retrieval, a missing product attribute, a prompt instruction, a model limitation, or an inadequate oracle. Calling every failure a model failure weakens diagnosis.

## Nondeterminism Is Not an Excuse for Weak Evaluation

**Nondeterminism** means that repeated executions under apparently similar conditions can produce different results. Sampling settings, model changes, hidden service behaviour, retrieval ordering, and time-varying dependencies can contribute. It does not mean that all variation is acceptable or that a successful run establishes quality.

Engineers should state the expected relation. A refund amount must not change when the same authorized tool call is repeated. A response may use different wording while still needing to be factually supported, safe, and complete enough for its purpose. Seeds and low-variation settings can assist investigation where available; they do not prove correctness, groundedness, fairness, or safety.

### An MSQE teaching model: the AI quality claim

The following is an **MSQE teaching model**, not an industry standard:

```text
Intended behaviour
    + population and context
    + evaluation method and evidence boundary
    + uncertainty and limitations
    + decision threshold and owner
    = bounded AI quality claim
```

Its purpose is to make a claim challengeable. If a team cannot state the population, evidence source, or action implied by a result, it is not ready to use the result as a release conclusion.

## Worked Reasoning: A Fluent Answer and a Missing Exception

| Element | Atlas Support Assistant evidence |
| --- | --- |
| System context | Assistant answers synthetic returns questions using a policy corpus. |
| Quality claim | Category-specific answers should cite applicable current policy and avoid unsupported eligibility advice. |
| Observed evidence | One answer states “30 days” without the hygiene-item exception; a second asks a clarifying question. |
| Interpretation | The first answer is incomplete for this case and may create a harmful customer expectation. |
| Competing interpretation | The model may have received incomplete context; the exception may be absent from the retrieved chunk rather than ignored. |
| Evidence limitation | Two runs do not estimate population behaviour or identify whether retrieval, prompt, policy version, or model behaviour caused the result. |
| Decision | Do not approve the broad policy-answer claim. Inspect retrieval evidence, add category slices to evaluation, and retain the clarification path. |
| Revision trigger | Re-evaluate when policy content, retrieval ranking, prompt, model, or category taxonomy changes. |

The decision is not “the assistant is bad.” It is a proportionate decision about a claim the current evidence cannot support.

## Deterministic Boundaries and Probabilistic Behaviour

An AI-enabled product usually combines deterministic and variable behaviour. The distinction is practical: it tells the team where an exact assertion is appropriate and where a bounded quality claim is required.

| System element | Suitable assertion | Why the distinction matters |
| --- | --- | --- |
| Request schema | A required `orderId` is present and has the expected format | The contract can be checked exactly. |
| Permission service | A refund-submission request without confirmation is denied | The application owns this safety boundary. |
| Retrieval metadata | The answer records the corpus and source version used | Version presence is deterministic even if ranking is variable. |
| Generated explanation | It states the current policy exception or asks a safe clarification | Multiple wordings may be acceptable. |
| Ranked result list | Compatible products appear above incompatible ones for a defined journey | Evaluation depends on relevance criteria and user context. |

Calling a response *probabilistic* is not a reason to relax every requirement. It means that a response may vary over runs and that the quality claim must identify the acceptable region. An **acceptable-output region** is the set of responses that meet the stated task, evidence, safety, and interface constraints. It is not an invitation to accept any plausible text.

For example, Atlas can require that a category-dependent return answer: uses active policy evidence; does not promise eligibility when category is unavailable; explains the next safe action; and returns the specified response fields. Within that region, “Please provide the product category so I can check the relevant exception” and “I need the product category before I can determine eligibility” can both be acceptable. Exact wording is not the intended product property.

## Worked Comparison: When Exact Matching Rejects a Good Answer

The following is an **illustrative scenario**. Atlas gives the Support Assistant a synthetic policy excerpt saying that damaged electronics require review and a prompt asking, “Can I return this headset?” The fixture’s historical expected string is: “Please contact support for review.”

| Candidate output | Exact-string result | Quality assessment |
| --- | --- | --- |
| “Please contact support for review.” | Pass | Acceptable, but terse. |
| “Damaged electronics require review. Please contact support so we can assess the return.” | Fail | Acceptable: grounded, relevant, and safely bounded. |
| “Yes, send it back for an automatic refund.” | Fail | Unacceptable: it asserts an unsupported automatic outcome. |
| “I cannot help with returns.” | Fail | Unacceptable over-refusal: enough policy evidence was available to provide a bounded answer. |

A deterministic assertion incorrectly rejects the second output because it tests wording rather than the claim. The revised quality claim is: *For a synthetic damaged-electronics return question with the cited active policy, the assistant must communicate the review requirement, avoid an automatic-refund promise, provide a usable next step, and conform to the response schema.* The oracle combines schema checks, source verification, a rubric for semantic content, and a defined escalation path for borderline answers.

This comparison also exposes uncertainty. A single acceptable output does not establish the rate at which the assistant remains within the acceptable region. Repeated runs, alternative phrasings, source variations, and evaluator calibration may be needed. The uncertainty belongs in the evidence record rather than in a vague disclaimer.

## Evidence Boundaries and Residual AI Risk

An evidence boundary states what a result covers. A result based on 20 synthetic policy prompts with one source version supports an observation about those prompts, that source, that configuration, and that evaluator. It does not automatically cover production traffic, new policies, other languages, tool calls, or a later model endpoint. Evidence becomes more useful when the boundary is explicit because a reviewer can decide whether it is proportionate to the intended release.

**Residual AI risk** is the remaining possibility of unacceptable behaviour after the available controls and evidence have been considered. It should be described in operational terms: for example, an ambiguous category can still produce an incomplete answer; a new corpus version can change retrieval ranking; or a rubric may miss a material policy nuance. A Quality Engineer does not eliminate this uncertainty by naming it. They connect it to scope, owner, monitoring, mitigation, and a revision trigger.

## From Output Checks to System Quality Claims

The system, not the model alone, produces the customer outcome. A fluent response can be caused or constrained by a stale policy corpus, an API omission, prompt context, response renderer, tool result, evaluation rubric, or an unobservable configuration change. The model boundary deserves evaluation, but it cannot carry the whole quality claim.

Use a claim canvas before choosing a metric:

1. **Decision and affected user:** What customer or operator decision will the output influence?
2. **Behaviour and boundary:** What must the system do, avoid, or safely defer?
3. **Evidence:** Which source, dataset, trace, evaluator, and configuration version are relevant?
4. **Uncertainty:** Which populations, conditions, or causal explanations remain untested?
5. **Decision rule:** Who decides whether the evidence is sufficient, and what blocks or limits release?
6. **Revision trigger:** Which model, prompt, corpus, tool, policy, or usage change invalidates the result?

## Engineering Perspective

Quality Engineers create useful pressure on ambiguous AI claims. They ask whether the task has a defined outcome, whether an evaluator can distinguish a safe answer from a fluent one, whether a data slice is missing, and whether a system trace can locate a failure boundary. The result is better testability and more reviewable change—not a promise that uncertainty disappears.

## Industry Perspective

NIST’s Generative AI Profile treats generative-AI risk management as context dependent and encourages organizations to consider the full system and its use conditions.[^nist-genai] Part IX applies that perspective as an engineering practice. It does not prescribe a vendor’s evaluation service or a particular governance model.

## Common Misconceptions and Pitfalls

### “An AI quality test needs one expected answer”

Exact comparison is appropriate for deterministic fields, tool arguments, schemas, and some reference answers. Many meaningful questions instead require a rubric, relation, population measure, or human judgement.

### “Different output means a defect”

Different wording can be acceptable. Different eligibility, unsupported attribution, unsafe advice, or unauthorized action may not be. The required relation must be stated before judging variation.

### “The model owns every failure”

Applications, data, prompts, retrieval, tools, and evaluation methods are all quality-relevant boundaries.

## QA → QE Transition

Traditional QA may ask whether a selected prompt received the expected answer. Quality Engineering asks what behaviour matters, which evidence can support a population-level claim, how the system exposes its boundaries, what uncertainty remains, and which owner should act.

## Summary

AI Quality Engineering extends established QE evidence practice to contextual and variable system behaviour. It begins with a bounded claim, not a vendor, model, or single response. The next chapter turns that claim into a map of conventional and AI-specific failure boundaries.

## Key Takeaways

- AI quality is system quality; model output is one boundary, not the whole system.
- Variable behaviour requires explicit acceptable relations, not lower standards.
- An exact expected answer is one oracle strategy, not the default for every AI behaviour.
- A useful claim states task, population, evidence, uncertainty, decision, and owner.

## Review Questions

1. Why can a fluent response be inadequate evidence of quality?
2. Which deterministic boundaries might surround a variable generative response?
3. What is the difference between an observation and a bounded quality claim?
4. Why should a Quality Engineer resist calling every unexpected result a model defect?

## Interview Questions

1. How would you test an AI assistant when several outputs may be acceptable?
2. What questions would you ask before approving a model evaluation result?
3. How do you explain nondeterminism without treating it as an excuse?

## Practical Exercise

Create an **AI Quality Claim Canvas** for one synthetic Atlas Commerce capability. State the intended behaviour, population, evidence sources, evaluator or oracle, unacceptable outcome, uncertainty, decision threshold, owner, and revision trigger. Do not use real customer data or a live AI service.

## Further Reading

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [NIST Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)

## References

[^nist-rmf]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1). 2023. Accessed 2026-08-12.
[^nist-genai]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf). NIST AI 600-1, 2024. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can distinguish a system boundary from a model boundary.
- [ ] I can state why one successful response is not a broad quality conclusion.
- [ ] I can define acceptable variation for a stated behaviour.
- [ ] I can write a bounded AI quality claim with a revision trigger.

## Chapter Navigation

Previous: [Part IX overview](../README.md) · Next: [Chapter 2 — AI System Architecture and Failure Boundaries](chapter-02-ai-system-architecture-and-failure-boundaries.md)
