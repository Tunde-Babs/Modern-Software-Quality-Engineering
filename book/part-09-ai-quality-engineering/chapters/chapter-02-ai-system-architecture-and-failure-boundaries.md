# Chapter 2 — AI System Architecture and Failure Boundaries

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 2 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapter 1; Parts III, IV, VI, and VIII |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A poor AI outcome is a reason to investigate a system boundary, not permission to assume the model is the cause.

## Opening Story

The following is an **illustrative scenario**. Atlas Support Assistant tells a customer that a return is eligible, cites “Returns Policy, paragraph 4,” and offers an order lookup. The policy citation is real, but the passage is from a superseded policy version. The order lookup also omitted the product category because an API field was not mapped into the tool response.

Two teams reach different conclusions. One says the model hallucinated. The other says retrieval was stale. Both could be partly right, and neither conclusion identifies the next engineering action. The quality problem crosses document governance, retrieval, tool contract, prompt context, generation, and presentation.

## Why This Chapter Matters

Failure classification changes remediation. A stale corpus needs a source and indexing control. A malformed tool result needs an API contract correction. An unsupported model inference may need a system instruction, evaluator, or model-change decision. An evaluator that marks the answer correct despite the obsolete citation is itself a quality boundary.

Part IV established API and state boundaries; Part VI established data provenance; Part VIII established operational evidence. This chapter connects them in an AI system without becoming an architecture-design or vendor-integration tutorial.

## Learning Objectives

By the end of this chapter, you should be able to:

- map AI-system components and quality-relevant dependencies;
- classify an observed outcome by plausible failure boundaries;
- distinguish direct facts from causal hypotheses;
- identify evidence needed to discriminate competing explanations; and
- produce an AI Failure-Boundary Map and Investigation Record.

## An AI System Has Multiple Quality Boundaries

The following boundaries commonly coexist:

| Boundary | Typical question | Example failure |
| --- | --- | --- |
| Application | Did the product route, render, or preserve the request correctly? | User context or output schema is lost. |
| API/integration | Did a dependency honour its contract? | Order lookup omits product category. |
| Data | Is the value current, complete, and semantically usable? | Policy version is stale. |
| Retrieval | Was relevant evidence available, selected, and attributed? | Obsolete passage ranks first. |
| Prompt/instruction | Did the instructions constrain the task appropriately? | Assistant is told to answer without clarifying ambiguity. |
| Model behaviour | Did generated reasoning or text violate the stated criterion? | It invents an exception unsupported by context. |
| Tool use | Were tool selection, arguments, permissions, and confirmations correct? | Proposal tool receives the wrong order identifier. |
| Evaluation/oracle | Does the check distinguish acceptable from harmful behaviour? | Rubric rewards fluency but ignores policy version. |
| Observability | Can the team reconstruct the relevant path safely? | Retrieval version is absent from the trace. |

These are hypotheses, not a rigid taxonomy. A failure can cross boundaries. The objective is to make the investigation testable rather than to assign blame quickly.

## Build a Failure-Boundary Map

A useful map records the intended outcome, component path, contract or assumption, available evidence, owner, and open question. It should distinguish **fact** from **interpretation**. “The retrieved document has version 2025-01” is a fact if the record is trustworthy. “Retrieval caused the bad answer” is an interpretation until alternatives are investigated.

### Worked Reasoning: The Obsolete Citation

| Element | Evidence and reasoning |
| --- | --- |
| System context | Support Assistant retrieves policy text, calls an order-lookup API, and produces a response with citation metadata. |
| Quality claim | Category-specific returns advice must use the active policy and must not assert eligibility when required product data is absent. |
| Observed evidence | The displayed citation is version 2025-01; the active policy is 2026-03. Tool trace lacks `productCategory`. |
| Interpretation | Two direct defects are plausible: stale retrieval content and incomplete tool output. |
| Competing interpretation | A current document might have been retrieved but the renderer attached an old citation; a model may still have ignored an available category warning. |
| Evidence limitation | The trace does not retain ranked retrieval candidates or final prompt context, so source selection cannot yet be reconstructed. |
| Decision | Block the category-specific eligibility claim. Preserve a safe clarification response, investigate source-index versioning and API mapping, and add prompt-context observability. |
| Revision trigger | Reassess after corpus rebuild, tool-schema correction, or model/prompt change. |

The investigation yields more than a defect ticket. It specifies the evidence that a future change must provide.

## Boundary Evidence Is a Testability Requirement

An AI system should expose enough non-sensitive evidence to answer questions such as: which policy version was retrieved, which tool was called, which arguments were allowed, whether a confirmation occurred, which prompt configuration was active, and which evaluator version judged the output. This is an application of Part VIII’s evidence thinking. It does not require recording private prompts or customer data indiscriminately.

Useful observability is proportionate. Retain identifiers, versions, decisions, and safe summaries; protect confidential content through access controls, redaction, and explicit retention limits. A trace that includes every token but no retrieval version can be less useful than a concise trace with the right boundary evidence.

## An End-to-End Atlas Failure Path

The Support Assistant’s visible answer is the last event in a path. A useful failure-boundary map follows that path without assuming that each component has a single cause or owner.

| Stage | Atlas responsibility | Evidence to preserve safely | Example defect |
| --- | --- | --- | --- |
| UI/application | Capture intent, display uncertainty and citations, maintain selected order context | Request class, rendered citation ID, session-safe correlation ID | Renderer shows a citation from a previous answer. |
| API/integration | Fetch order facts and enforce contracts | Schema version, missing-field status, dependency outcome | `productCategory` is omitted in a successful response. |
| Retrieval | Select relevant, permitted, current policy content | Corpus/index version, ranked source IDs, score/rank summary | Superseded policy ranks first. |
| Prompt/instruction | Assemble constraints and supplied facts | Prompt-template version, context-manifest version, truncation flag | Required exception is omitted when context is truncated. |
| Model | Produce an answer within supplied evidence and task constraints | Model/endpoint version, generation configuration, safe output hash | It invents an exception absent from the context. |
| Tool | Propose or execute bounded actions | Tool name, safe argument summary, policy decision, result | It proposes lookup for an ambiguous order ID. |
| Data source | Govern policy content and order semantics | Effective date, approval state, source owner | An obsolete document remains marked active. |
| Evaluator | Judge the claim against an adequate oracle | Rubric and evaluator version, rationale category | Rubric rewards citation presence but ignores effective date. |
| Telemetry | Permit reconstruction without unnecessary retention | Correlation ID, component versions, redaction state | No retained candidate list distinguishes ranking from rendering. |

The table is an investigation aid, not a claim that every service must retain every input. It should use data minimisation, access control, and retention limits appropriate to the product.

## Same Symptom, Different Boundary: Case One

**Visible symptom:** The assistant says a category-specific return is eligible when it is not.

| Plausible boundary | Supporting observation | Discriminating evidence | Likely next action if confirmed |
| --- | --- | --- | --- |
| Source governance | Active corpus contains a superseded policy | Source effective date and approval record | Remove/deprecate source; rebuild index. |
| Retrieval/ranking | Current exception exists but ranks below top context | Ranked candidates and context manifest | Review retrieval query, ranking, chunking, and context budget. |
| Prompt assembly | Current exception was retrieved but not supplied | Prompt-context manifest and truncation reason | Correct context selection or instruction assembly. |
| Model behaviour | Exception was supplied but response contradicts it | Supplied context plus response and rubric | Improve constraint/evaluation; consider configuration change. |
| UI/application | Correct internal response was rendered with stale text | Internal response versus displayed content | Repair caching or response mapping. |

The same customer-visible symptom can therefore lead to five different remedies. Classifying it immediately as a model failure risks both ineffective remediation and a misleading regression suite.

## Same Symptom, Different Boundary: Case Two

**Visible symptom:** The assistant asks the customer to provide an order ID even though the order is displayed in the UI.

One hypothesis is that the model ignored available context. Another is that the UI stored the order only for display and the API payload did not include it. A third is that the order API rejected the identifier because the account association was absent. A fourth is that the evaluator marked any clarification as safe without checking whether required information was already present. The minimum evidence is the UI state, outbound API request, dependency response, assembled model context, response, and evaluator rationale. The correct decision may be to block repetitive clarification from the release scope until the application-context contract is verified.

## Evidence-Based Localisation Procedure

1. **Describe the observable outcome.** Avoid causal language: “the rendered answer cites version 2025-01” is better than “the model used stale data.”
2. **State at least two plausible boundaries.** Include conventional application and integration explanations where appropriate.
3. **Collect discriminating evidence.** Prefer existing versioned records and controlled reproductions over speculation.
4. **Check the oracle.** A test that passes on citation presence may be unable to detect source currency.
5. **Localise proportionately.** If evidence remains insufficient, record the uncertainty and restrict the decision rather than inventing certainty.
6. **Create a regression relation.** After remediation, add evidence that distinguishes the corrected boundary from nearby alternatives.

## Engineering Perspective

Failure-boundary maps improve collaboration. A Quality Engineer can turn “the assistant was wrong” into work owned by application, data, retrieval, ML, and evaluation teams without asserting a cause the evidence cannot establish. This enables targeted regression checks and makes operational diagnosis less dependent on memory.

## Industry Perspective

The AI RMF frames AI risk as socio-technical and context dependent.[^nist-rmf] In practical engineering, that means the model cannot be evaluated apart from the data, interface, deployment, and people who determine how its outputs are used.

## Common Misconceptions and Pitfalls

### “A citation proves the answer is grounded”

A citation can be obsolete, irrelevant, incorrectly attached, incomplete, or contradicted by another source. It is evidence to inspect, not proof by itself.

### “More telemetry automatically explains cause”

Telemetry helps only if it captures the relevant boundary with meaningful semantics and safe access. It does not remove the need for hypotheses.

### “A component owner can evaluate the whole system alone”

Owners need boundary evidence and collaboration. A model team cannot fix a missing API field; an application team cannot decide a model limitation without evaluation evidence.

## QA → QE Transition

QA reports an observed failure. Quality Engineering maps the system path, separates facts from hypotheses, identifies missing evidence, and designs a change that makes future evaluation and diagnosis more trustworthy.

## Summary

AI outputs emerge from a system of data, retrieval, prompts, models, tools, interfaces, evaluators, and operational evidence. Failure-boundary reasoning prevents premature attribution and creates better tests, better diagnostics, and clearer ownership.

## Key Takeaways

- A failure boundary is a testable hypothesis, not an automatic cause assignment.
- Retrieval, tool, application, data, and evaluator defects can resemble model failures.
- Facts, interpretations, and evidence gaps must remain visible.
- Boundary evidence should be designed safely and proportionately.

## Review Questions

1. Why is a stale citation not automatically a model hallucination?
2. What evidence would distinguish retrieval selection from citation-rendering failure?
3. How can an API contract change AI quality without changing the model?
4. Why is evaluator quality itself a boundary?

## Interview Questions

1. How would you investigate an AI response that contradicts policy?
2. What information would you include in an AI-system trace?
3. How do you prevent boundary mapping from becoming blame assignment?

## Practical Exercise

Create an **AI Failure-Boundary Map and Investigation Record** for the obsolete-citation scenario. Include at least six boundaries, direct facts, two competing explanations, missing evidence, owners, and a revision trigger. Do not use real policies or customer information.

## Further Reading

- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)
- [OpenTelemetry Signals](https://opentelemetry.io/docs/concepts/signals/)

## References

[^nist-rmf]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1). 2023. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can name multiple plausible boundaries for an observed AI failure.
- [ ] I can separate facts, interpretations, and missing evidence.
- [ ] I can specify evidence needed to test a causal hypothesis.
- [ ] I can design proportionate boundary observability.

## Chapter Navigation

Previous: [Chapter 1 — AI Quality Engineering: Behaviour, Evidence, and Boundaries](chapter-01-ai-quality-engineering-behaviour-evidence-and-boundaries.md) · Next: [Chapter 3 — Evaluation Data, Oracles, and Experimental Design](chapter-03-evaluation-data-oracles-and-experimental-design.md)
