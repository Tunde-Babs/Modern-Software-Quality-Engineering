# Chapter 4 — Infrastructure as Code: Change Evidence, Review, and Drift

## Metadata

| Field | Value |
|---|---|
| Part | Part VII — Cloud & DevOps |
| MQE-BOK domain | Domain 7 — Cloud & DevOps |
| Chapter | 4 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–3; Part II Git, review, configuration, and error-handling foundations |
| Estimated study time | 190 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A declared infrastructure change describes intended state. Delivery evidence must still establish what changed, what did not, and what the decision can safely assume.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce plans to increase the checkout service's connection capacity for a staged release. The reviewed infrastructure change shows an intended runtime-policy adjustment and a new network rule for the payment callback. A planning command reports no destructive actions, so the team considers the infrastructure work complete.

On application, an older manual rule remains in the target environment and takes precedence over the declared one. The new workloads start, but payment callbacks reach only part of the intended path. The change record is accurate about desired state; it is incomplete about actual state and existing drift.

The lesson is not that declarative infrastructure is unreliable. It is that an infrastructure declaration, a plan, an apply result, and evidence of effective state make different claims. A Quality Engineer should be able to distinguish them before a successful command becomes a premature release conclusion.

## Why This Chapter Matters

Infrastructure as code (IaC) represents infrastructure intent in reviewable, version-controlled form. This can improve traceability, collaboration, repeatability, and change review. It can also create false confidence when a team assumes that a syntactically valid declaration, a clean plan, or a successful apply proves the target environment now has the intended behaviour.

Infrastructure has quality implications because it can affect runtime identity, networking, dependencies, data access, capacity, routing, and recovery options. Part VII does not teach infrastructure-provider syntax or prescribe an IaC product. It teaches the evidence questions needed to evaluate an infrastructure change as part of a release.

## Chapter Purpose

To treat IaC as reviewable infrastructure intent and to teach evidence-based reasoning about desired state, actual state, drift, dependencies, and safe change decisions.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish desired infrastructure state, planned change, applied change, and observed effective state;
- explain idempotence and drift in delivery-quality terms;
- identify review questions for material infrastructure changes;
- state what an IaC plan or apply result can and cannot establish;
- evaluate change impact, dependencies, and recovery assumptions; and
- create an Infrastructure Change Evidence Record for a fictional release.

## Infrastructure Intent Is Not Infrastructure State

Infrastructure intent is a representation of the state a team wants a system to have. It may be declarative, imperative, or a combination. A declarative form usually describes a desired result; an imperative form usually describes an ordered action. Both need review. Neither removes the need to understand the target, dependencies, or evidence after a change.

| Evidence stage | Example statement | What it supports | What it does not support |
|---|---|---|---|
| Reviewed intent | “The change declares the payment callback route and workload policy.” | A reviewer can assess stated intent and change scope. | That the target already matches the declaration. |
| Plan or preview | “The tool predicts these changes against its observed state.” | A forecast under the tool's model and current inputs. | That the model is complete, the target remains unchanged, or application is safe. |
| Apply result | “The tool reported successful execution.” | The tool completed its reported operations. | That every dependency is effective or customer behaviour is correct. |
| Observed state | “The target reports the expected route and policy identity.” | Selected effective state is present at the observation boundary. | That every workload, region, or customer path is covered. |
| Functional verification | “The bounded callback probe succeeds through the intended path.” | The selected outcome occurred under stated conditions. | That every external condition and traffic pattern is safe. |

The table is a reminder to avoid a common verbal shortcut: “the infrastructure is applied.” A more useful statement identifies the declaration version, target, evidence, boundary, limitation, and owner.

## Desired State, Actual State, and Drift

**Desired state** is the approved representation of intended infrastructure. **Actual state** is the condition that exists in the target environment. **Drift** is a meaningful difference between them, particularly when the difference is unreviewed, unexplained, or changes a decision.

Not every difference is a defect. A managed platform may add provider-owned fields; an emergency action may create a temporary, documented exception; a planned phased transition may intentionally retain both old and new resources. The delivery risk arises when a difference is material but lacks ownership, expiry, or evidence.

### Drift questions that improve decisions

Ask the following before treating drift as a generic cleanup task:

1. Which desired and actual conditions differ?
2. Does the difference affect this release claim, customer exposure, security boundary, cost, recovery path, or evidence interpretation?
3. Was it intentionally accepted, and is that decision still valid?
4. Who owns the difference and its expiry or resolution?
5. How will the team verify the target state after the next change?

This makes drift a context-sensitive engineering concern. A stale tag on an unused test resource may not block a checkout release. An unreviewed route precedence rule might.

### Idempotence as a recovery property

An idempotent operation can be applied more than once without changing the result beyond the intended first application. In infrastructure work, idempotence can make retries and reconciliation safer because a repeat does not continually create additional state. It is not a guarantee that every operation is reversible, harmless, or free of side effects.

For example, a declaration that ensures a policy has a specified value may be idempotent under its tool's model. Deleting and recreating a resource, rotating a credential, applying a data migration, or changing an external dependency can have consequences that are not safely repeated. When a plan says “replace,” ask what state is lost, recreated, redirected, or temporarily unavailable.

## Reviewing an Infrastructure Change

Infrastructure review is not a request to inspect every line of every provider declaration. It is a structured challenge of material change assumptions.

| Review dimension | Questions |
|---|---|
| Intent and scope | What outcome is intended? Which environment and resources are in scope? What is deliberately unchanged? |
| Dependency order | Which application, configuration, identity, data, or network conditions must exist first? |
| Change classification | Does the change create, modify, replace, remove, or merely observe state? |
| Customer impact | Could traffic, access, capacity, or a critical dependency be interrupted or redirected? |
| Evidence | Which plan, apply, target-state, and functional observations are needed? |
| Recovery | Can the state be reversed, rolled forward, disabled, or contained? What compatibility conditions apply? |
| Ownership | Who approves intent, applies it, verifies it, and decides whether to continue? |

Review needs proportionality. A low-risk non-production label change does not require the same evidence as a production route, database permission, or identity-policy modification. What matters is that the release record makes the rationale inspectable.

## Policy Checks Are Narrow Evidence

Teams may use policy-as-code or static rules to challenge prohibited configurations and required metadata. Such checks can improve consistency. They do not prove that the policy is complete, that all actual state is represented, or that a permitted change is safe for a particular customer path.

Use a policy result as one evidence item:

- name the policy and version if it affects the decision;
- state the target and declaration evaluated;
- record any exceptions and their owner;
- identify the risk the policy does not cover; and
- combine it with plan, target-state, and functional evidence where needed.

This avoids both extremes: dismissing policy checks as bureaucratic and treating them as a full production-readiness certificate.

## Worked Reasoning: An Unexpected Replace Action

Atlas Commerce's reviewed change is intended to add a callback route and adjust connection capacity. The fictional plan contains these observations:

| Observation | Interpretation | Alternative | Decision implication |
|---|---|---|---|
| The route declaration adds `payment-callback-v2`. | The intended new route is visible in desired state. | Route precedence may depend on an existing rule. | Review existing routing and expected traffic path. |
| The plan reports replacement of a shared policy rather than in-place modification. | A potentially disruptive operation is predicted. | The tool may require replacement for an implementation reason that has no customer effect. | Do not apply until replacement consequences and recovery are understood. |
| A policy check passes. | The declaration satisfies the implemented policy rules. | The rule set may not model route precedence or shared consumers. | Treat as supporting, not decisive, evidence. |
| The target contains a manually added older callback rule. | Actual state includes a relevant difference. | It may be intentional and still active. | Investigate ownership and precedence before release. |

The appropriate action is to pause the apply, identify whether the shared policy replacement can interrupt existing traffic, and compare the desired and actual route order. A revised plan might retain the old policy during a controlled transition or use a different change path. The decision is based on observed risk, not on a universal rule that replacement is always forbidden.

### An Infrastructure Change Evidence Record

The **Infrastructure Change Evidence Record** is an original MSQE teaching artifact. It should be short enough to use during review and rich enough to expose a material assumption.

| Field | Example prompt |
|---|---|
| Decision | What promotion, apply, or pause decision is needed? |
| Intended state | What outcome and declaration revision are approved? |
| Target and scope | Which environment, resources, and dependencies are included? |
| Change classification | Does the plan create, modify, replace, or remove state? |
| Evidence | What plan, policy, target-state, and functional observations are selected? |
| Drift and exception | Which known differences exist, and who owns them? |
| Recovery | What rollback, roll-forward, containment, or expiry conditions exist? |
| Limitation and residual risk | What remains unproven or potentially harmful? |
| Owners and trigger | Who acts, and what observation pauses or revises the decision? |

For Atlas Commerce, the record should identify that a changed route could affect a payment callback, that an existing manual route may take precedence, and that the release owner cannot rely on a successful plan alone.

## Infrastructure Changes at the Boundary of Other Parts

An infrastructure change can affect several kinds of quality evidence. Keep the ownership boundary clear:

- Part III helps design and assess product and test evidence, not infrastructure provisioning.
- Part IV helps reason about service contracts and dependencies, not provider routing implementation.
- Part V helps build reliable automation systems; its checks may run in a pipeline but it does not own the pipeline or target environment.
- Part VI helps reason about data quality; in this part, a data or schema example is limited to release compatibility and recovery risk.
- Part VIII develops operational telemetry, SLOs, and incident practice; this chapter uses only immediate target-state and release-verification evidence.

This distinction lets a Quality Engineer raise cross-system risk without turning one chapter into a replacement for four disciplines.

## Change Sequencing, State Observation, and Safe Exceptions

Infrastructure changes rarely occur in isolation. A route may require an identity policy; an identity policy may require a secret reference; a new workload may need the route before it can start; and an old path may need to remain until traffic and state transition safely. The exact sequence is product-specific, but the reasoning is transferable: identify the prerequisites, transitional state, verification point, and recovery condition.

| Sequence question | Example for the callback route | Risk if omitted |
|---|---|---|
| What must exist first? | The intended route and access boundary must be available before the new callback path receives traffic. | Workloads start but cannot complete the dependency interaction. |
| What must coexist temporarily? | Old and new route records may coexist while the cohort is limited. | Removal of the old path can strand an in-flight or prior artifact. |
| What state is safe to observe? | Route identity and precedence can be reported without revealing sensitive endpoint details. | Review relies on declaration rather than effective target state. |
| What changes last? | Wider exposure follows route and functional verification. | Customer traffic becomes the first evidence of a missing prerequisite. |
| What expires? | A manual exception or transition route needs an owner and removal condition. | Temporary state becomes unexplained drift. |

The purpose is not to impose a universal order. It is to ensure that an apply plan is understood as part of a larger delivery sequence, particularly where the application and infrastructure change must become compatible before exposure increases.

### Observing actual state without creating unsafe diagnostics

Actual-state evidence should be sufficient for the release claim but should not reveal credentials, internal network addresses, customer data, or privileged policy detail. A safe observation might record route identity, policy revision, workload access category, or a non-sensitive target label. A reviewer should be able to compare that identity with the approved declaration and recognise a mismatch.

If the only way to prove a route is active is to expose its full sensitive configuration in logs, the system lacks a safe verification boundary. The response is to improve controlled metadata or a bounded probe, not to normalize sensitive logging as an operational shortcut.

### Emergency changes and temporary drift

Emergency intervention can be justified when customer harm is occurring. It should still create a reviewable exception: what changed, why it was necessary, who approved it, which state now differs from declared intent, how it was verified, and when it will be reconciled. This protects the next release. Without the record, a future plan may interpret the emergency condition as an unexplained conflict or silently remove a control that is still protecting customers.

The Quality Engineer's role is not to block emergency action for lack of perfect paperwork. It is to help preserve the minimum facts and ownership needed to prevent a temporary containment action becoming permanent unowned state.

### Distinguishing destructive change from customer harm

A plan may label an operation destructive because it replaces a resource. That label deserves attention, but it is not a direct measure of customer impact. A replacement can be safe if it affects an unused isolated resource and has verified dependency order. An in-place edit can be harmful if it changes route precedence for a critical customer path. Review should connect the operation's mechanism to affected users, state, and recovery, rather than treating tool terminology as the decision.

## Evaluating Evidence Across the Change Lifecycle

An Infrastructure Change Evidence Record becomes more useful when it is updated at the decision points where state can change:

| Decision point | Evidence to review | Typical decision |
|---|---|---|
| Before apply | Approved declaration, impact analysis, plan, known drift, recovery assumption. | Apply, revise, or defer intent. |
| After apply | Tool result, safe target-state identities, exception record. | Continue to deployment verification or pause for mismatch. |
| Before exposure | Dependency and application prerequisites, selected actual state, rollout plan. | Expose a bounded cohort or hold. |
| After exposure | Functional verification and any changed target state. | Expand, contain, recover, or learn. |
| After recovery or exception | Reconciled desired/actual state and expiry status. | Close, retain a documented exception, or schedule correction. |

This lifecycle prevents an IaC review from becoming a one-time pre-deployment ceremony. It also avoids excessive repeated review: only evidence whose relevance changes needs renewal.

### Review comments should be testable questions

A valuable review comment states a question that can be answered through evidence. “This infrastructure seems risky” is too vague. “The plan replaces a shared callback policy; which customer paths use it, what state is preserved during replacement, and what evidence confirms the old route remains available until the new path is verified?” guides an accountable response.

Similarly, “why is this manual rule here?” becomes “is the manual rule intentional transition state, which declaration or owner records it, and when does it expire?” The quality of infrastructure review improves when concerns can be resolved, accepted with conditions, or escalated based on explicit risk.

## Engineering Perspective

IaC makes intent reviewable and repeatable, which is a significant quality capability. Its value increases when teams can connect a declaration to actual state and to a decision-relevant outcome. The improvement is not simply more tooling. It is traceable state transitions, explicit exceptions, safe recovery assumptions, and ownership at the interfaces.

For Quality Engineers, an effective contribution is to ask whether evidence is being confused with conclusion. A plan is valuable. A policy check is valuable. A successful apply is valuable. Each becomes stronger when placed in a delivery claim whose remaining uncertainty is visible.

## Industry Perspective

The principles in this chapter apply whether an organization uses a declarative or imperative infrastructure mechanism. OpenTofu documents one declarative implementation in which planning compares configured desired state with managed infrastructure and proposes changes without applying them.[^opentofu] This is an implementation example, not a platform-independent definition of IaC. Official product documentation can define a particular tool's planning, state, or replacement semantics; such semantics must not be generalized as universal facts.

Version-controlled review practices described in [Git documentation](https://git-scm.com/docs) support traceable change discussions, but a commit history alone does not prove target state. The [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) provides relevant guidance for protecting and maintaining software-release processes, while deep infrastructure security design remains outside this part.

## Common Misconceptions and Pitfalls

### “A clean plan proves the target will be safe”

A plan is a forecast based on a representation and observation at a point in time. It needs target-state and, when material, functional evidence.

### “Drift always means someone made a mistake”

Some differences are intentional or provider-managed. The issue is whether a material difference is explainable, owned, and bounded.

### “Idempotent means reversible”

Repeating an operation safely is different from undoing its effects safely. Replacement, deletion, and data-affecting changes require separate recovery reasoning.

### “Policy checks replace review”

Policy checks inspect the conditions their rules encode. They cannot evaluate an unmodelled dependency, customer impact, or evidence gap.

## QA → QE Transition

The QA-oriented conclusion is: *the infrastructure deployment command succeeded.* The Quality Engineering conclusion is: *the approved intent was reviewed, the material target-state and dependency conditions were observed, known drift is accounted for, and the remaining risk supports this specific apply or promotion decision.*

## Summary

IaC makes infrastructure intent inspectable, but intent is not actual state and an apply result is not customer-outcome evidence. Desired state, plans, applies, drift, and verification each answer different questions. Proportionate review connects them to a delivery decision with ownership and recovery conditions.

Chapter 5 examines the pipeline that coordinates these inputs and records its evidence.

## Key Takeaways

- Desired state, actual state, plan output, apply output, and functional verification are distinct evidence categories.
- Drift is a material, contextual difference that needs explanation and ownership.
- Idempotence can improve safe repetition but does not guarantee reversibility or harmless replacement.
- Policy checks are narrow controls, not universal readiness certificates.
- An Infrastructure Change Evidence Record exposes intent, target state, limitations, recovery, and decision authority.

## Review Questions

1. What can a successful IaC apply establish, and what can it not establish?
2. Why might a manual infrastructure change be relevant even when the desired declaration is correct?
3. How does idempotence differ from reversibility?
4. Which evidence would you seek before accepting an unexpected replacement action?
5. How should a Quality Engineer handle a policy check that passes but leaves a material dependency unmodelled?

## Interview Questions

1. How would you review an infrastructure change that affects a customer-facing route?
2. Explain desired state versus actual state to a team that trusts plan output uncritically.
3. What recovery considerations would you raise before a resource replacement?

## Practical Exercise

Create an **Infrastructure Change Evidence Record** for the fictional Atlas Commerce callback-route change.

1. State the intended route and connection-policy outcome without naming a provider or tool.
2. Identify two dependencies, one drift risk, and one potentially disruptive operation.
3. Select plan, target-state, and bounded functional evidence.
4. Propose a pause condition and a recovery option, including one limitation.

Use a synthetic change description. Do not write or execute IaC, provider configuration, or a deployment command.

## Further Reading

- [Git documentation](https://git-scm.com/docs)
- [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)
- [OpenSSF Best Practices](https://openssf.org/best-practices/)

## References

[^git]: Git. [Git documentation](https://git-scm.com/docs). Accessed 2026-08-11.
[^opentofu]: OpenTofu. [Provisioning Infrastructure with OpenTofu](https://opentofu.org/docs/v1.9/cli/run/). Accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish desired state, actual state, a plan, an apply result, and functional evidence.
- [ ] Identify material drift and explain why it does or does not affect a decision.
- [ ] Explain idempotence without confusing it with safe rollback.
- [ ] Create an Infrastructure Change Evidence Record with recovery and ownership.

## Navigation

Previous: [Chapter 3 — Container Artifacts, Runtime Assumptions, and Reproducible Delivery](chapter-03-container-artifacts-runtime-assumptions-and-reproducible-delivery.md)  
Next: [Chapter 5 — Delivery Pipelines as Quality Systems](chapter-05-delivery-pipelines-as-quality-systems.md)
