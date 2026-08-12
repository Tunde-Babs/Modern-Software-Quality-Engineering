# Chapter 7 — Retrieval-Augmented Generation Quality

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 7 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–6; Part IV API boundaries and Part VI data-quality foundations |
| Estimated study time | 170 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Retrieval quality is not proved by a citation; it is evidence that the system selected current, relevant support for a defined decision.

## Opening Story

The following is an **illustrative scenario**. Atlas Support Assistant cites a returns-policy paragraph for a customer’s question. The paragraph is genuine and the response paraphrases it accurately. The passage, however, is a general rule; a current category-specific exception exists elsewhere in the policy corpus and was not retrieved.

The answer may be grounded in its supplied context yet still be unsafe for the customer decision. Retrieval-Augmented Generation (RAG) quality must therefore inspect corpus governance, retrieval, context assembly, generation, citation presentation, and user impact.

## Why This Chapter Matters

RAG systems place a retrieval system between the product question and generated response. The model can only use what the system provides, but provided text does not guarantee a correct response. Evaluation must make the retrieval and generation claims separable so a team can act on the right failure boundary.

This chapter is vendor neutral. It does not select embeddings, a vector store, chunk size, or a universal retrieval metric.

## Learning Objectives

By the end of this chapter, you should be able to:

- define separate corpus, retrieval, grounding, and citation claims;
- design a retrieval test set with current, relevant evidence;
- interpret retrieval results alongside answer quality;
- identify version, access, and source-governance risks; and
- produce a RAG Quality Evidence Record.

## The RAG Evidence Chain

| Boundary | Claim to evaluate | Example evidence |
| --- | --- | --- |
| Source governance | The approved corpus contains the active policy and excludes superseded content | Source identifier, version, approval state, effective date |
| Indexing and retrieval | Relevant current evidence is available in the retrieved set | Ranked candidates, query version, corpus/index version |
| Context assembly | The supplied context preserves source and boundary information | Prompt-context manifest and truncation decision |
| Generation | Material claims are supported or safely qualified | Rubric result with cited evidence |
| Citation/presentation | Citation points to the support actually used and is understandable | Rendered answer and citation mapping |

These claims cannot be collapsed into “RAG works.” A high retrieval score does not establish that a generated answer is grounded; a grounded answer does not prove the corpus is current for all queries.

## Retrieval Evaluation Needs Known-Relevant Evidence

Create synthetic or authorised evaluation questions with one or more designated current passages and documented relevance rationale. The question should represent decision types—not merely phrases copied from a source. Include questions whose safe answer is uncertainty or escalation because the corpus lacks sufficient evidence.

For a small synthetic probe, suppose **40** of **50** policy questions have an approved supporting passage in the test corpus. The retrieval component returns a designated supporting passage in its top set for **35** of those **40** questions. The observed retrieval recall for the answerable subset is `35 / 40 = 87.5%`. It says nothing about the other ten questions, citation accuracy, response quality, or production prevalence. The denominator and exclusions are part of the claim.

## Worked Reasoning: A Correct Passage Is Not Enough

| Element | Evidence and reasoning |
| --- | --- |
| Context | A customer asks whether a category-specific item is returnable. |
| Quality claim | The answer must use the current category exception or state that eligibility cannot be determined. |
| Evidence | Top retrieval candidate contains the general policy; candidate five contains the current category exception; source metadata shows both are active. |
| Interpretation | Retrieval ranking may be insufficient for this decision type. |
| Alternative | The context window or prompt may discard candidate five; generation may ignore it even when present. |
| Limitation | One trace cannot estimate retrieval quality across the corpus or demonstrate a causal ranking defect. |
| Decision | Mark the claim unproven, preserve the trace, add this question type to the test set, and investigate ranking, context assembly, and rubric evidence separately. |
| Revision trigger | Re-run after corpus, retrieval, chunking, prompt-context, or model configuration changes. |

## A Synthetic Policy Corpus and Retrieval Result

For one Atlas query—“Can I return a damaged headset bought 20 days ago?”—the synthetic corpus contains four deliberately different documents.

| Document | Status | Relevant content | Quality risk |
| --- | --- | --- | --- |
| Returns Policy 2026-03, section 4 | Current and approved | Damaged electronics require review; do not promise automatic refund | Designated current support |
| Returns Policy 2025-01, section 4 | Superseded | Damaged electronics are eligible for automatic refund | Stale but semantically similar |
| Seller Help Article, revision 2 | Active but not authoritative for returns | General 30-day return wording | Contradictory or incomplete for this decision |
| Headset Setup Guide | Active, irrelevant | Product setup and warranty overview | Similar vocabulary but no return authority |

The retrieval service returns the following ranked candidates for the query: 1) Returns Policy 2025-01; 2) Seller Help Article; 3) Headset Setup Guide; 4) Returns Policy 2026-03. If the context budget admits only the first two chunks, the model never receives the designated current passage. A fluent answer citing 2025-01 can be internally supported by its supplied context while still being wrong for the product decision.

The first defect to investigate is not automatically “generation.” Source governance may have left the superseded document searchable; ranking may overvalue semantic similarity; chunking may separate effective-date metadata from the rule; context assembly may discard rank four; citation presentation may attach a source unrelated to the final context; or the evaluator may reward citation presence instead of current authority. The evidence chain localises the claim.

### Multi-query retrieval evidence

The corpus can be exercised with more than one convenient policy question. The following results use a top-three retrieval cut-off and synthetic relevance labels defined by the active policy owner.

| Query | Required authoritative evidence | Top-three source IDs, in rank order | Required evidence retrieved? | Primary investigation |
| --- | --- | --- | --- | --- |
| Damaged headset, 20 days | 2026-03 section 4 | 2025-01, seller-help-2, setup-guide | No | Source governance and ranking |
| Standard return, 10 days | 2026-03 section 2 | 2026-03, seller-help-2, 2025-01 | Yes | Inspect generation and citation if answer fails |
| Region-specific exception | Region-EU addendum | 2026-03, archived-region, region-EU | Yes, but rank 3 | Context budget and authority conflict |
| Item condition unknown | No complete source; inspection fact required | 2026-03, seller-help-2, setup-guide | No complete evidence exists | Evaluate clarification/handoff, not retrieval failure |
| Warranty question phrased as return | Warranty guide | seller-help-2, 2026-03, warranty-guide | Yes, but rank 3 | Query interpretation and ranking |

For the four answerable queries above, the required source is retrieved in the top three for three: recall@3 is `3 / 4 = 75.0%`. Of the 12 returned results, six are labelled relevant to the stated query and source authority: precision@3 is `6 / 12 = 50.0%`. These calculations do not estimate customer usefulness or answer correctness. They make a narrow ranking claim visible: a system can retrieve supporting evidence somewhere in its result set yet spend most of the context budget on stale or irrelevant material.

## A Complete RAG Quality-Engineering Workflow

1. **Govern the corpus.** Give each source an owner, authority class, effective date, access rule, lifecycle state, and relationship to superseded or contradictory material. An archived document should not silently remain eligible for a current-policy answer.
2. **Define query classes and designated evidence.** Document why a source is required, merely relevant, contradictory, or intentionally absent. Include unanswerable questions; otherwise the assistant is rewarded for invented completion.
3. **Evaluate retrieval and ranking separately.** Record top-*k*, rank, authority, freshness, query version, filters, and the denominator of every result. A high recall@10 can be operationally weak if the relevant source arrives after the context cut-off.
4. **Inspect context assembly.** Preserve chunk identifiers, deduplication, truncation, ordering, and instruction/source separation. Evidence that was retrieved but not supplied cannot ground the response.
5. **Evaluate generation against supplied, current evidence.** Test supported claims, completeness, uncertainty, citation use, and unsupported synthesis. Do not blame the generator for a source it never received.
6. **Verify citation and presentation.** The displayed citation must identify the material source that supports the claim, be current and accessible to the user, and not conceal a conflicting authority.
7. **Decide and trigger.** State whether the fault blocks a release, narrows scope, or needs a source/ranking correction; re-run affected cases after corpus, index, chunking, prompt, or model changes.

## Atlas Knowledge Corpus: Authority Before Similarity

The compact corpus below is synthetic. It illustrates why semantic similarity cannot establish applicability.

| ID | Version/effective date | Scope and intended population | Status | Authority |
| --- | --- | --- | --- | --- |
| D1 | v2026-03 / 2026-03-01 | Global refunds; all customers | Current | Primary policy source |
| D2 | v2025-01 / 2025-01-01 | Global refunds; all customers | Superseded | Historical only |
| D3 | v2026-03-EU / 2026-03-01 | EU customer variant | Current | Primary within EU scope |
| D4 | v2026-03-US / 2026-03-01 | US customer variant | Current | Primary within US scope |
| D5 | v2026-02-P / 2026-02-15 | Verified premium customers | Current | Approved exception source |
| D6 | archive-2024 / 2024-06-01 | Legacy service process | Archived contradictory | Not eligible for current advice |
| D7 | help-setup-4 / 2026-01-10 | Headset setup and warranty | Current but irrelevant | Support article, not refund authority |
| D8 | fulfilment-2026-02 / 2026-02-10 | Delayed-fulfilment exception | Current | Primary only for delayed fulfilment |

For every result, the evaluator needs the requested population and jurisdiction. D3 and D4 can both be current while only one is applicable. D5 can be authoritative only after a verified premium status is present. D6 can be highly similar to a query but must not govern a current decision.

## Retrieval Investigation Record

| Query class | Expected support | Top-3 results | Evidence result | Dominant question |
| --- | --- | --- | --- | --- |
| EU damaged headset | D3 plus D1 condition | D2, D7, D3 | Required D3 arrives rank 3; D1 absent | Ranking and coverage |
| US standard return | D4 | D4, D1, D2 | Current applicable source rank 1 | Generation/citation if answer fails |
| Premium delayed delivery | D5 and D8 | D8, D1, D5 | Both required sources retrieved, D5 rank 3 | Context assembly |
| Global damaged headset | D1 | D6, D2, D7 | Correct source absent | Corpus governance/retrieval |

For these four query classes, required evidence is retrieved in three cases: recall@3 = `3 / 4 = 75.0%`. Of the 12 returned documents, six are relevant and authoritative for the stated query: precision@3 = `6 / 12 = 50.0%`. The EU result is a **hit** at three but can still fail if the context admits only two chunks. The global damaged-headset result is a miss even if D2 looks semantically convincing.

## Contradiction and Localisation Practice

For the EU query, D2 says an automatic refund is available while D3 requires review. The correct comparison is authority, jurisdiction, effective date, and customer applicability—not wording overlap. If D3 has no jurisdiction metadata, source governance is incomplete and a confident answer should be withheld or escalated.

Three localisation cases apply the same visible bad answer differently. First, D1 is absent and the assistant cautiously explains the old D2 context: retrieval/corpus quality dominates. Second, D4 is rank one and present, but the model invents an automatic-refund promise: generation dominates. Third, D4 is present and the response paraphrases it correctly, but the UI links to D2: citation mapping/presentation dominates. Each case needs ranked-source evidence, context manifest, output, and rendered citation before classification.

## Two Localisation Cases

In the standard-return query, 2026-03 is rank one and included in context, but the assistant says “30 days applies to all items” and omits the policy’s excluded categories. This is not a retrieval-recall failure. Candidate explanations include generation that ignored a supplied condition, a chunk that excluded the exception, or an evaluator whose reference answer omitted the exception. Compare context manifest, chunk boundary, response, and rubric before changing retrieval.

In the damaged-headset query, the assistant faithfully quotes 2025-01 and cites it accurately. Generation may be excellent relative to its bad context. The primary failure is likely source governance or ranking; a generation-only patch could produce a different but still unreliable answer. This distinction makes the correction and future regression evidence proportionate.

## Retrieval, Ranking, Context, Generation, and Citation Are Different Measures

**Retrieval relevance** asks whether a returned item can support the query. **Retrieval recall** asks whether designated evidence appears in the returned set at a stated cut-off. **Ranking quality** asks whether the usable current evidence appears early enough to survive the context budget. **Context assembly** asks what was actually supplied after chunking, filtering, and truncation. **Generation quality** asks whether the answer uses and qualifies that context correctly. **Citation correctness** asks whether the displayed citation identifies the source that supports the material claim.

For the four-document example, retrieval recall at four is 1/1 for the current designated passage, but recall at two is 0/1. A dashboard that reports only “a relevant document was returned” can conceal the ranking and context failure. Similarly, an answer evaluator that sees only the generated sentence cannot tell whether the model ignored current context or the current context was absent.

Chunking changes the unit of evidence. A passage can contain the phrase “damaged electronics” while its linked exception or effective-date header appears in a different chunk. The evaluation record should preserve the source ID, chunk ID, policy version, rank, filter decisions, assembled context order, and truncation state—not necessarily full customer prompts or full document contents.

## Missing, Conflicting, and Unanswerable Evidence

Some Atlas questions have no authoritative answer in the corpus. For example, an item’s condition may require inspection data that neither the policy nor the order lookup provides. The desired result may be a clarification or handoff, not a confident answer with a weak citation. A RAG evaluation set should contain these cases explicitly; otherwise an evaluator may reward unsupported completion.

Conflicting sources require governance, not semantic averaging. The system should know which source class and version is authoritative for the decision, how conflicts are surfaced, and when a human owner must resolve them. The model cannot infer organisational authority merely from wording similarity. Evaluation must check whether it uses the approved source or safely reports uncertainty.

## A Practical RAG Evidence Matrix

For each test case, maintain a narrow record: query class; expected decision boundary; designated authoritative sources; all eligible candidate sources; top-*k* results; source version and authority; context admitted after chunking and truncation; generated claim; rendered citation; rubric outcome; and the owner of any failure. This matrix lets a reviewer tell apart four outcomes that look alike to a customer: missing source, poor ranking, context loss, and unsupported generation. It also makes a useful regression relation: a source-version or index change requires rerunning cases whose authoritative passage, rank, or context budget could change.

Where an evaluation asserts retrieval recall, state the cut-off and answerability. Where it asserts citation accuracy, sample the material claims rather than simply checking that a link exists. Where it asserts groundedness, require that the cited/current material actually supports the conclusion. This layered approach is slower than one score, but it produces actionable evidence.

## Freshness, Access, and Citation Are Product Controls

An active source can become obsolete; an accessible source can be inappropriate for a requester; a citation can identify a document without proving the claim is supported. Define source ownership, effective-date handling, access policy, retention, and deprecation behaviour. These are data and application-quality responsibilities as much as AI responsibilities.

RAGAS offers a set of RAG-oriented evaluation concepts, but teams must still specify how a measure maps to their product claim and what decisions it may support.[^ragas]

## Engineering Perspective

Retain safe, proportionate evidence: query class, source and index versions, ranked-source identifiers, truncation state, citation mapping, rubric version, and result. Do not default to retaining customer prompts or document contents indefinitely. An evidence record should support diagnosis without expanding privacy exposure.

## Industry Perspective

NIST’s Generative AI Profile emphasises managing risks in context rather than treating model output as isolated from data and deployment.[^nist-genai] RAG makes this especially visible: content governance and retrieval quality are part of the delivered behaviour.

## Common Misconceptions and Pitfalls

### “A citation proves the answer is safe”

The source may be stale, irrelevant, incomplete, or misattached.

### “Retrieval recall is answer quality”

It is evidence about retrieval for a defined set. Generation and presentation remain separate boundaries.

### “More documents always improve RAG”

Additional sources can introduce conflict, staleness, access issues, and ranking complexity.

## QA → QE Transition

QA verifies answers and links. Quality Engineering maintains a chain from governed source through retrieval and context to generated claim, with evidence, ownership, and release triggers at each boundary.

## Summary

RAG quality is a system claim, not a model trait. It requires separately evaluated source governance, retrieval, context, generation, citation, and operational evidence.

## Key Takeaways

- Define RAG claims at distinct system boundaries.
- Record denominators and exclusions for retrieval metrics.
- Test current, relevant support for a decision—not citation presence alone.
- Treat source freshness, access, and deprecation as quality controls.

## Review Questions

1. Why can a grounded answer still be unsafe?
2. What does the synthetic 87.5% retrieval result include and exclude?
3. Which evidence would distinguish ranking failure from context truncation?
4. Why is source version a RAG quality control?

## Interview Questions

1. How would you design an evaluation set for a policy RAG system?
2. What would you trace for a disputed cited answer?
3. How would you handle an unanswerable question safely?

## Practical Exercise

Create a **Retrieval-and-Generation Evidence Matrix** for six synthetic Atlas policy questions, including designated evidence, corpus version, expected safe answer boundary, retrieval result, answer-rubric result, limitation, owner, and revision trigger. Do not use real policies or customer data.

## Further Reading

- [RAGAS: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217)
- [NIST AI RMF: Generative AI Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf)

## References

[^ragas]: Es, Shahul, et al. [RAGAS: Automated Evaluation of Retrieval Augmented Generation](https://arxiv.org/abs/2309.15217). 2023. Accessed 2026-08-12.
[^nist-genai]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile](https://nvlpubs.nist.gov/nistpubs/ai/NIST.AI.600-1.pdf). NIST AI 600-1, 2024. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can separate corpus, retrieval, generation, and citation claims.
- [ ] I can state a retrieval metric’s denominator and exclusions.
- [ ] I can identify safe evidence needed to diagnose a RAG failure.
- [ ] I can define a source-freshness and access boundary.

## Chapter Navigation

Previous: [Chapter 6 — Robustness, Metamorphic Testing, and Adversarial Inputs](chapter-06-robustness-metamorphic-testing-and-adversarial-inputs.md) · Next: [Chapter 8 — Human Evaluation and Model-Based Evaluators](chapter-08-human-evaluation-and-model-based-evaluators.md)
