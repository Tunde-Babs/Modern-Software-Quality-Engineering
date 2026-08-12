# Chapter 9 — Tool-Using and Agentic AI Systems

## Metadata

| Field | Value |
| --- | --- |
| Part | Part IX — AI Quality Engineering |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Chapter | 9 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–8 and Part IV API Quality Engineering |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** When an AI system can act, correct language is insufficient evidence; authority, state transition, confirmation, and audit boundaries become part of quality.

## Opening Story

The following is an **illustrative scenario**. Atlas Support Assistant can retrieve an order, create a refund proposal, and submit a refund after explicit customer confirmation. It correctly tells the customer that a refund requires review, but first submits a refund proposal for the wrong order after an ambiguous reference. In a second run, it chooses the correct order but sends a submission request before confirmation is recorded.

The system is not merely answering. It is selecting tools, forming arguments, interpreting state, and potentially changing it. Tool success responses and fluent explanations do not prove that the action was authorised or correct.

## Why This Chapter Matters

Tool-using and agentic systems combine AI behaviour with API contracts, permissions, workflows, and side effects. An **agentic** system is one that may plan or select actions across steps; the term does not imply autonomy without controls. Quality engineering must make action authority and stop conditions explicit.

This chapter does not advocate unrestricted agents, autonomous refunds, or a particular orchestration framework.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish tool selection, argument formation, execution, and state-transition claims;
- define least-authority and confirmation boundaries;
- test multi-step workflows without triggering real effects;
- specify traces for safe diagnosis and audit; and
- produce a Tool-Use and Agent Workflow Safety Record.

## Action Boundaries Are Product Contracts

| Boundary | Required question | Atlas control |
| --- | --- | --- |
| Tool availability | Which tools can this task invoke? | Refund-submission tool is unavailable before a validated proposal. |
| Argument validity | Are identifiers, amounts, and policy fields valid? | API schema validates order ID and proposal identifier. |
| Authority | Is the actor allowed to request this action? | Role and order association are verified outside the model. |
| Confirmation | Has the required consent event occurred? | Submission requires a separate, recorded confirmation token. |
| Idempotency | Can retry duplicate a state change? | A stable request key makes repeated submission safe to detect. |
| Auditability | Can the path be reconstructed safely? | Trace stores tool, safe argument summary, decision, result, and versions. |

**Idempotency** means that repeating the same authorised request has the same intended effect as performing it once. It is an API/workflow property, not a promise that a model will avoid repetition.

## Model Planning Does Not Grant Authority

Treat model-generated tool calls as untrusted proposals. A deterministic policy layer should validate permissions, schemas, confirmation state, amount and policy constraints, and allowable sequence. The application, not the model, owns irreversible execution. When an input is ambiguous, the safe action may be clarification rather than tool use.

## Worked Reasoning: A Proposal Is Not a Refund

| Element | Evidence and reasoning |
| --- | --- |
| Context | The assistant receives two possible order references and may retrieve details or propose a refund. |
| Quality claim | It may retrieve the selected order after disambiguation; it may not submit a refund without an eligible proposal and recorded confirmation. |
| Evidence | Trace shows two candidate orders, a proposed tool call using one ID, no confirmation token, and a denied submission by policy layer. |
| Interpretation | The action guard worked; the assistant’s disambiguation behaviour remains a quality failure requiring improvement. |
| Alternative | The wrong order may originate in application entity resolution rather than model planning. |
| Limitation | A denied synthetic request does not prove the workflow handles every concurrency, permission, or retry path. |
| Decision | Keep execution denied, add ambiguous-reference and absent-confirmation cases to regression checks, and investigate entity resolution. |
| Revision trigger | Reassess after tool-schema, policy, orchestration, or confirmation-flow changes. |

The correct outcome is not a more persuasive apology. It is prevention of an unauthorised state transition plus evidence sufficient to repair the responsible boundary.

## A Complete Synthetic Action Trace

The following trace is a compact, **illustrative** evidence packet. It is deliberately incomplete: it has enough information to make an engineering decision, not enough to expose real customer data or operational controls.

| Step | Observed event | Expected boundary | Assessment |
| --- | --- | --- | --- |
| 1. Goal | Customer asks for a refund for “order 412,” but two synthetic orders partially match | Ambiguity requires clarification or safe disambiguation | The assistant identifies two candidates. |
| 2. Planning | Assistant plans order lookup before any refund proposal | Planning does not grant action authority | Acceptable plan. |
| 3. Lookup | Tool call uses `orderId=412-A`, but session context suggests 412-B | Tool arguments must be correct and attributable | Unsafe intermediate action; final answer cannot erase it. |
| 4. Policy retrieval | Current policy requires review for the category | Source version and policy condition must reach the workflow | Current source is retrieved. |
| 5. Proposal | Assistant proposes refund review for 412-A | Proposal must name correct order and policy basis | Proposal is wrong because lookup target is wrong. |
| 6. Permission | Policy layer checks association and denies submission | Model cannot grant authority | Deterministic guard succeeds. |
| 7. Confirmation | No confirmation token exists | Submission must remain blocked | Correct denial. |
| 8. Retry | Assistant retries the denied request with the same request key | Repeated request must not create a second action | Idempotency control records the repeat. |
| 9. Final answer | “Your refund requires review; please confirm the correct order.” | Explain safely without claiming execution | Customer-facing text is correct. |

The final sentence is not sufficient evidence of correct agent execution. Step 3 targeted the wrong order, and step 5 produced an invalid proposal. The independent policy layer prevented a state transition, which reduces harm but does not make the agent’s planning or entity-resolution behaviour acceptable. The decision is to retain the guard, investigate the application/entity boundary, and add this trace class to regression evaluation.

## Trace B: Retry, State, and Termination Failure

The following **illustrative** trace exercises a different failure mode. The customer has selected order 412-B and explicitly confirmed a permitted refund proposal.

| Step | Observed event | Required quality boundary | Assessment |
| --- | --- | --- | --- |
| 1. Goal | “Submit the approved refund for order 412-B.” | Goal is within the customer’s confirmed scope | Acceptable. |
| 2. State lookup | Memory contains a prior proposal ID for 412-A from an earlier session | State must be bound to current order and expiry | Unsafe stale-memory condition. |
| 3. Tool selection | Assistant selects refund submission | Tool is permitted only with current proposal and confirmation | Selection alone proves nothing. |
| 4. Arguments | Uses stale proposal ID with 412-B | Parameters must refer to the same authorised state | Invalid pairing. |
| 5. Tool response | Dependency times out after accepting the request | Ambiguous result requires reconciliation, not blind repeat | Side effect is unknown. |
| 6. Retry | Assistant repeats submission twice with new idempotency keys | Repeated action must not create duplicate effects | Unsafe retry design. |
| 7. Termination | No reconciliation call or human handoff occurs | Workflow must stop when state is ambiguous | Failure. |
| 8. Final response | “Your refund was submitted.” | Customer claim must match verified outcome | Unsupported final assertion. |

Trace B demonstrates that a retry is not automatically a recovery action. A known rejected request may be retried under documented conditions. An ambiguous side effect requires idempotent reconciliation using the same stable request identity, an API status check, or controlled human intervention. Generating new keys can defeat the very duplicate-prevention mechanism intended to make retries safe.

## Evaluate Five Separate Qualities

| Quality | Question | Trace A | Trace B |
| --- | --- | --- | --- |
| Outcome quality | Is the customer-facing response useful and correct? | Final answer is bounded and useful | Final claim is unsupported |
| Process quality | Did the workflow follow the permitted sequence? | Wrong-order lookup/proposal | Stale state and no reconciliation |
| Action safety | Could an unsafe side effect occur? | Guard prevented submission | Duplicate submission remains plausible |
| Authorization quality | Were actor, confirmation, and policy conditions enforced? | Confirmation guard works | Stale proposal breaks authorization binding |
| State quality | Is context current, scoped, and recoverable? | Ambiguous entity not resolved | Memory and retry state are invalid |

The learner should produce a trace review that identifies the first violated boundary, not merely the last visible error. This supports targeted correction: entity resolution for Trace A; session scoping, reconciliation, and idempotency design for Trace B; deterministic policy enforcement for both.

## Trace C: Cross-Interaction Memory Contamination

| Step | Trace event | Expected boundary | Assessment |
| --- | --- | --- | --- |
| User goal | A new customer asks only for return-policy information | No prior order is needed | Informational task. |
| Interpreted goal | Assistant uses a remembered “premium customer exception” from another synthetic interaction | Memory must be scoped to current actor and task | Contamination. |
| Plan/tool selection | It calls order lookup despite no identifier or user need | Tool use must be necessary and permitted | Unnecessary collection/action. |
| Authorization/confirmation | No order association or confirmation exists | Tool policy should deny call | Deterministic guard must intervene. |
| State mutation | Failed lookup is retained as a “customer preference” | Failed/irrelevant facts should not become memory | State-quality failure. |
| Final response | It states a premium exception is available | Claim is unsupported for this user | Outcome failure. |
| Termination | It continues proposing tools after denial | Stop or hand off when no action is permitted | Incorrect termination. |

Trace C makes memory a testable quality boundary rather than a convenience feature. The review must ask whether information is necessary, current, actor-scoped, authorised, and safe to retain. It also shows why a denied tool call does not fully resolve harm: the final answer can still leak an unsupported inference or create an unneeded trace.

## Agent Evaluation Matrix

| Dimension | Evidence | Trace A | Trace B | Trace C |
| --- | --- | --- | --- | --- |
| Goal quality | User goal and stated scope | Ambiguous order unresolved | Goal valid | Goal narrowed to policy information |
| Plan/tool selection | Tool sequence and necessity | Premature proposal | Appropriate tool, wrong reconciliation | Unnecessary lookup |
| Argument quality | IDs, amounts, source versions | Wrong order | Stale proposal ID | No valid identifier |
| Authorization/confirmation | Independent policy decision | Denied correctly | Binding stale | Should deny |
| Side-effect/retry safety | Idempotency/reconciliation evidence | No side effect | Duplicate risk | No side effect, but unnecessary trace |
| Final output | Source-bound response | Correct but path unsafe | Unsupported success claim | Unsupported exception |

Use the matrix for a professional Action-Trace Review: name the first failed boundary, affected state, evidence limitation, correction owner, and regression trigger. It avoids an agent-framework tutorial while making process quality inspectable.

For an ambiguous side effect, use the sequence **verify → reconcile → stop or escalate**. Do not retry merely because a timeout occurred: the tool may have acted after the client lost the response. Idempotency keys reduce duplicate risk only when the same stable key and server-side semantics are applied; they are not a universal exactly-once guarantee. An audit trail should retain the safe action identity, policy decision, result state, versions, and handoff without indiscriminately retaining private prompt content.

## State, Memory, Retries, and Termination

An agent workflow needs explicit state ownership. Customer-visible session state, model-provided memory, retrieved facts, tool results, confirmation tokens, and policy decisions are not interchangeable. The application should decide which state persists, how it expires, whether it is revalidated, and how it is associated with an actor and order.

Retries deserve separate tests. A transient tool failure may justify a bounded retry; an ambiguous action result may require reconciliation rather than repetition. **Termination** means that the workflow stops or hands off when it has no permitted safe action, not merely when a model emits a confident answer. Test loops, repeated proposals, stale confirmation, partial failure, and human takeover using resettable synthetic state.

## Action-Trace Review Questions

Review an action trace in order: Was the goal interpreted within scope? Was the selected tool permitted at that step? Were arguments valid, current, and associated with the correct subject? Did a deterministic policy layer validate authority and confirmation? Did the retry preserve idempotency and avoid duplicated side effects? Did the workflow terminate or hand off when information was insufficient? Could a reviewer safely reconstruct the answer without retaining more personal content than needed?

The answer to one question cannot compensate for another. A correct final sentence with an incorrect tool target remains an unsafe execution path. A denied submission can demonstrate a guard’s value while revealing that planner quality, entity resolution, or memory handling still needs correction. This is why tool-using evaluation must include intermediate artefacts rather than a final-response-only rubric.

## Multi-Step Tests Need Controlled State

Use a synthetic environment with resettable state, safe stubs, explicit preconditions, and observable effects. Test rejected calls as seriously as successful calls. Include retries, timeouts, partial tool failures, stale state, conflicting user instructions, and human handoff. Do not let a test run against a production refund interface merely because the system is “only proposing” an action.

ReAct illustrates a research pattern combining reasoning and actions, but product use still requires explicit authority, safety, and observability controls.[^react]

## Engineering Perspective

The primary oracle for a consequential action is often deterministic: was the tool available, was its input valid, did the policy layer permit it, was confirmation present, and did the system record the result? Generative evaluation complements—not replaces—those checks by assessing explanations, clarification, and action selection.

## Industry Perspective

The NIST AI RMF frames risk management as socio-technical and context-specific.[^nist-rmf] For tool use, that context includes user authority, workflow design, API semantics, operational recovery, and people affected by an erroneous action.

## Common Misconceptions and Pitfalls

### “The model chose the right tool, so the action is safe”

Selection is only one boundary. Arguments, permission, confirmation, state, and execution remain to be checked.

### “Human confirmation makes all agent actions acceptable”

Confirmation must be informed, bound to the intended action, resistant to stale context, and enforced by the application.

### “Agent trace means record every prompt and private value”

Trace the decision-relevant, safely redacted facts and versions. Retention and access limits remain necessary.

## QA → QE Transition

QA tests tool responses. Quality Engineering defines the permitted action graph, independent policy enforcement, state preconditions, recovery behaviour, evidence, and release gates for side effects.

## Summary

Tool-using AI systems are workflow systems. Their quality depends on bounded authority, deterministic enforcement, safe state handling, testable failure paths, and proportionate audit evidence.

## Key Takeaways

- Treat model tool calls as proposals, not authority.
- Enforce permissions, confirmation, and state transitions outside the model.
- Test denials, retries, and recovery paths in controlled synthetic environments.
- Trace action-relevant evidence safely and proportionately.

## Review Questions

1. Why is tool selection insufficient evidence for safe action?
2. Define idempotency in the Atlas workflow.
3. Which boundary owns refund submission permission?
4. Why should rejected calls be tested deliberately?

## Interview Questions

1. How would you test an AI workflow that can issue a refund?
2. What belongs in an agent-action trace?
3. How would you prevent a model from bypassing a confirmation step?

## Practical Exercise

Create a **Tool-Use Contract and Action-Trace Review** for Atlas’s order lookup, refund proposal, and refund submission path. Define tool authority, preconditions, confirmations, denied paths, resettable synthetic state, trace fields, and revision triggers. Do not access any live service.

## Further Reading

- [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629)
- [NIST AI Risk Management Framework](https://www.nist.gov/itl/ai-risk-management-framework)

## References

[^react]: Yao, Shunyu, et al. [ReAct: Synergizing Reasoning and Acting in Language Models](https://arxiv.org/abs/2210.03629). 2022. Accessed 2026-08-12.
[^nist-rmf]: National Institute of Standards and Technology. [Artificial Intelligence Risk Management Framework (AI RMF 1.0)](https://doi.org/10.6028/NIST.AI.100-1). 2023. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can distinguish planning, tool-call, execution, and state-transition claims.
- [ ] I can define an independent confirmation boundary.
- [ ] I can test a safe denial and recovery path.
- [ ] I can specify proportionate agent-action evidence.

## Chapter Navigation

Previous: [Chapter 8 — Human Evaluation and Model-Based Evaluators](chapter-08-human-evaluation-and-model-based-evaluators.md) · Next: [Chapter 10 — Safety, Fairness, Privacy, and Responsible Quality Boundaries](chapter-10-safety-fairness-privacy-and-responsible-quality-boundaries.md)
