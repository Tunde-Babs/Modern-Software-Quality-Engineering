# Chapter 8 — Rollback, Roll-Forward, and Recovery Decisions

## Metadata

| Field | Value |
|---|---|
| Part | Part VII — Cloud & DevOps |
| MQE-BOK domain | Domain 7 — Cloud & DevOps |
| Chapter | 8 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 4–7; Part IV state and asynchronous behaviour; Part VI reconciliation concepts where data state is affected |
| Estimated study time | 205 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Recovery is not a command selected after failure. It is a decision prepared by knowing what changed, what can coexist, what evidence is available, and what harm each option can create.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce's initial checkout cohort shows failed confirmation processing after a new release. A familiar response is proposed: roll back immediately. The team then learns that the release included a forward-only migration that adds a new confirmation-state value. The previous application version does not recognize that value. A direct rollback could convert a contained release issue into a broader processing failure.

The team has other options: disable the new checkout path with a release control, hold exposure, apply a small compatible correction, or restore a prior state through a controlled sequence. None is automatically correct. The right response depends on customer harm, state compatibility, the time needed for evidence, and the ability to preserve or repair in-flight work.

## Why This Chapter Matters

“Rollback” is often used as a synonym for safe response. It can be safe, but only when the prior artifact, configuration, infrastructure, dependencies, and data state remain compatible with the current system. A recovery decision can also involve roll-forward, feature disablement, traffic containment, pause, restore, or a carefully chosen no-change observation period.

This chapter develops the delivery reasoning for recovery. It does not teach disaster-recovery architecture, incident command, chaos engineering, database restoration, or a specific deployment platform. Part VIII develops operational reliability and incident practice; Part VI develops data-quality reasoning. Here, data and state appear only where they affect release compatibility and recovery evidence.

## Chapter Purpose

To choose and communicate rollback, roll-forward, containment, or recovery actions using compatibility, customer impact, evidence, ownership, and residual-risk reasoning.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish rollback, roll-forward, disablement, containment, and restoration as recovery options;
- identify compatibility conditions that can make direct rollback unsafe;
- reason about mixed-version and forward-only state during a progressive release;
- define recovery evidence and decision authority under time pressure;
- avoid assigning blame from incomplete release evidence; and
- create a Recovery Decision Record for a fictional delivery problem.

## Recovery Options Have Different Effects

Recovery is a change to a system already in motion. Each option has a different relationship to artifact, configuration, infrastructure, traffic, state, and customer impact.

| Option | What it can do | Important limitation |
|---|---|---|
| Rollback | Return selected workloads or traffic to a prior artifact/configuration state. | May be incompatible with current data, dependencies, flags, or infrastructure. |
| Roll-forward | Apply a compatible correction that addresses the observed issue. | Requires confidence that the correction can be delivered safely under pressure. |
| Disablement | Turn off a bounded behaviour through a release control. | Does not undo artifact, state, or side effects already created. |
| Containment | Restrict traffic, cohort, integration, or capability while evidence is gathered. | Can preserve harm if the affected condition exists outside the boundary. |
| Restore | Return a component or state to an earlier known condition. | May lose later valid changes and usually requires specialised operational procedure. |
| Pause and observe | Hold further exposure while verifying scope and cause. | Is inappropriate when customer harm is continuing or evidence is already decisive. |

The names are less important than their effects. A team should describe what the option changes, what it leaves changed, what it can make worse, and what evidence would show that it worked.

## Compatibility Makes Recovery Real

Compatibility is the ability of versions, configurations, data representations, interfaces, and dependencies to coexist or transition without unacceptable failure. It is often a release property, not just a code property.

### Common compatibility questions

- Can the prior artifact read state produced by the new artifact?
- Can the new artifact read state produced by the prior artifact during a mixed rollout?
- Does a configuration or flag change require the new artifact to remain active?
- Did an infrastructure change alter a route, identity, or dependency condition that the old artifact assumes differently?
- Can in-flight operations complete safely if traffic moves, a feature is disabled, or a workload is replaced?
- Are external effects idempotent, reversible, or only compensable?

For example, a new payment-confirmation status may be forward-compatible if the old version ignores unknown states safely. If the old version rejects or misclassifies it, a rollback needs a migration, compatibility shim, containment, or a roll-forward fix. The Quality Engineer need not implement the change; they should ensure the recovery claim does not ignore the state boundary.

### Mixed-version state is an active condition

Rolling and progressive deployment can create a period in which more than one artifact or configuration is effective. That condition is not necessarily wrong. It must be intentional, compatible, and observable enough for the decision.

| Mixed-state concern | Question |
|---|---|
| Request routing | Can a customer's related requests reach versions with incompatible assumptions? |
| Data/state transition | Can old and new versions read and write the same state safely? |
| Configuration | Does one effective configuration work for both versions, or is selection version-aware? |
| Dependency contract | Can both versions call the dependency under the current contract? |
| Recovery | What state remains after the new version is removed or disabled? |

This is not a lesson in distributed-system architecture. It is a practical release question: can the selected recovery option coexist with what the release has already changed?

## Evidence Under Time Pressure

Urgency can make teams overstate what they know. A Recovery Decision Record should separate observed facts from hypotheses and provide a reversible next action where possible.

| Evidence category | Example | Recovery use |
|---|---|---|
| Scope evidence | Confirmation errors appear only in the 5% cohort after the release-control change. | Supports containment to the cohort while investigation continues. |
| Identity evidence | Affected workloads report the approved digest and configuration identity. | Reduces ambiguity about what is running. |
| Compatibility evidence | Prior version rejects the new confirmation-state value in a controlled check. | Makes direct rollback unsafe without additional action. |
| Functional evidence | Disabling the flag returns the selected probe to the prior confirmation path. | Supports disablement as immediate containment. |
| Limitation | No complete customer-effect population is yet available. | Prevents claiming the issue is fully contained. |

The aim is not to delay response until perfect evidence exists. It is to choose the safest justified action while recording what would revise it.

## Worked Reasoning: Rollback Is Not the Safest Option

Atlas Commerce has these fictional conditions:

| Observation | Interpretation | Alternative | Decision consequence |
|---|---|---|---|
| A confirmation probe fails only when the new checkout flag is enabled. | The new behaviour is implicated at the selected boundary. | A shared dependency issue could still contribute. | Disablement may contain immediate exposure. |
| The initial cohort is 5%; no broader exposure has occurred. | Blast radius is bounded. | Some cohort customers may have in-flight operations. | Preserve and inspect affected records. |
| A migration introduced `confirmation_pending_v2`. | New state exists in the system. | It may be readable by the old version; compatibility must be tested. | Do not assume artifact rollback is safe. |
| Controlled compatibility check shows old version rejects that state. | Direct rollback can create a new processing failure. | A compatibility shim or forward correction may be possible. | Prefer disablement and a compatible roll-forward investigation. |
| Disabling the flag restores the prior path for a synthetic probe. | Immediate containment evidence is positive. | Existing pending items need separate handling. | Disable feature, pause expansion, assign remediation and reconciliation owners. |

The recommendation is: disable the new path for the cohort, keep the approved artifact in place while the team designs a compatible correction, and create an explicit plan for in-flight `confirmation_pending_v2` records. This is not a claim that all harm is gone. It is a proportionate containment decision based on the evidence supplied.

## Recovery Decision Record

The **Recovery Decision Record** is an original MSQE teaching artifact. It is deliberately shorter than an incident report and does not replace an operational response process.

| Field | Prompt |
|---|---|
| Trigger and decision | What observation requires a recovery or containment decision now? |
| Known facts | What is observed about scope, identities, state, and customer effect? |
| Material unknowns | Which causal, population, or compatibility questions remain open? |
| Options considered | Rollback, roll-forward, disablement, containment, restore, or pause. |
| Compatibility assessment | What can coexist; what becomes unsafe under each option? |
| Chosen action | What changes now, and what does it intentionally leave unchanged? |
| Evidence of effect | What confirms containment or recovery at the selected boundary? |
| Residual risk and owner | What harm remains possible, who acts, and when is the decision revisited? |

The record should be readable by the release owner, product/support stakeholders, and engineers who need to act. It should not imply certainty that the evidence does not support.

## Preparing Recovery Before Exposure

Recovery preparation starts when a change is designed for release, not when an alert arrives. A concise pre-release assessment can identify the options that become unsafe after state changes occur.

| Preparation question | Checkout example | Why it matters |
|---|---|---|
| What change is reversible? | A flag can return new requests to the prior confirmation path. | Enables immediate containment for new exposure. |
| What change is forward-only? | `confirmation_pending_v2` may be created before final outcome. | Direct artifact rollback may reject current state. |
| What must be preserved? | Pending confirmation identifiers and correlation evidence. | Allows reconciliation without losing customer context. |
| What can coexist? | Current artifact can coexist with disabled new behaviour while a correction is prepared. | Creates a safer roll-forward path. |
| Who decides? | Release owner decides exposure; Payments and data owners decide remediation/reconciliation. | Prevents a technically possible action from bypassing authority. |

The assessment should be revisited when a change acquires new state, a configuration control changes, or an infrastructure transition removes the previous path. Recovery readiness can decay over time.

### Recovery evidence is not root-cause proof

During response, the team often needs to know whether an action improved the situation before it knows every contributing cause. Flag disablement may restore a synthetic path; that is evidence of containment at a defined boundary. It does not prove that the flag caused every affected customer outcome. A compatible correction may clear a pending record; that is evidence for the selected record and path, not a universal guarantee.

Separate these levels in communication. This preserves the ability to act quickly without creating a false causal narrative that later constrains investigation or assigns blame incorrectly.

### State preservation and safe reconciliation

When a release creates or encounters uncertain state, preserve enough information to reconcile it later: an identifier, time, version/configuration context, status category, and responsible owner. Do not expose customer data unnecessarily. The goal is to avoid an irreversible recovery action that destroys the evidence needed to determine whether an operation completed, was duplicated, or needs compensation.

Part VI provides deeper data-quality techniques for reconciliation. In this chapter, the delivery focus is narrow: recovery decisions must not assume that a state transition has no customer consequence merely because a workload can be replaced.

### Escalation is a designed interface

Escalation should state who needs to decide, what safe facts they need, and how urgent the decision is. “Investigate payment issue” is weak. “The 5% card cohort shows a confirmation contradiction under digest `sha256:41c…` and configuration identity `pmt-cb-v7`; direct rollback is incompatible with pending state; decide whether to maintain flag disablement while the compatible correction is verified” enables action.

This degree of precision does not require a formal incident system. It gives the next owner a bounded decision rather than a vague alert.

## Comparing Recovery Options With a Decision Matrix

Before acting, a small matrix can prevent the team from choosing the most familiar recovery mechanism rather than the safest one.

| Criterion | Direct rollback | Flag disablement | Compatible roll-forward |
|---|---|---|---|
| Time to affect new requests | Potentially fast if prior artifact is deployable. | Often fast for the controlled behaviour. | Usually slower because a correction must be prepared. |
| Compatibility with `confirmation_pending_v2` | Poor in the Atlas scenario; prior artifact rejects the state. | Leaves state intact while changing future path. | Can be designed to handle pending state. |
| Ability to undo existing side effects | Limited; prior code may not understand them. | Does not undo effects already created. | May reconcile or compensate if designed and verified. |
| Evidence needed before action | Prior artifact/configuration compatibility and target identity. | Effective flag state and selected prior-path verification. | Correction identity, compatibility evidence, and targeted verification. |
| Residual risk | Can introduce a broader processing failure. | Pending records and deployed state remain. | Correction can introduce additional change risk. |

The matrix is not a formula. It makes trade-offs explicit so that the release owner can choose an action with the right technical contributors. In a fast-moving condition, the team may select flag disablement first and continue evaluating roll-forward rather than attempting a direct rollback whose compatibility evidence is negative.

### Recovery actions need scope control

State whether an action applies to new requests, the current cohort, all regions, a dependency, or existing records. “Disable checkout v2” can be dangerously ambiguous. Does it exclude only new card cohort requests? Does it prevent retries? Does it change background processing? Does it alter the route for a legacy artifact? Scope control protects customers and avoids accidental wider harm during a response.

For each action, record the observable expected effect and the population that may remain outside it. A flag disablement can be verified for a synthetic new request; it cannot be assumed to resolve a confirmation already accepted before the flag changed.

### Revision triggers protect against recovery drift

Recovery plans can become stale as new state, configuration, or infrastructure changes occur. Define a trigger to reassess: a pending item reaches a time threshold, a compatible correction is approved, a new workload identity appears, a dependency contract changes, or customer evidence indicates a wider scope. This avoids treating containment as a permanent solution merely because the immediate pressure decreased.

## Engineering Perspective

Reliable recovery is designed before a release, not improvised after a failure. That does not mean every change needs a complex rollback mechanism. It means each material change has an honest answer to: what is reversible, what is compatible, what can be contained, what evidence will guide the response, and who has authority to act?

Quality Engineers contribute by exposing the difference between a fast-looking action and a safe action. They can make mixed-state and compatibility assumptions visible, ask for evidence that containment worked, and prevent a recovery message from claiming more than the affected population or time window supports.

## Industry Perspective

DORA research includes recovery performance among delivery and operational measures, but it does not make a low time-to-recover result evidence that every rollback practice is safe or that a team should optimize for a single metric.[^dora] Product documentation may explain a particular platform's rollback mechanics; those mechanics must not be generalized beyond the product. Compatibility and decision reasoning are transferable.

## Common Misconceptions and Pitfalls

### “Rollback is always the safest action”

Rollback can be effective when the prior state is compatible. It can be harmful when a release has changed data, dependencies, or configuration assumptions that the prior version cannot handle.

### “A flag disablement undoes the release”

It can contain one behaviour. It may leave deployed artifacts, infrastructure, migrated state, and side effects in place.

### “A recovery decision needs root cause first”

Some actions cannot wait for full attribution. Use observed scope and compatibility evidence to select a reversible, proportionate next action, then continue investigation.

### “Containment proves customers are unaffected”

Containment evidence is bounded. In-flight work, delayed effects, and incomplete populations may remain.

## QA → QE Transition

The QA-oriented response is: *the release failed, so roll it back.* The Quality Engineering response is: *what state changed, which options are compatible, what does the evidence show about current harm, and which action contains risk while preserving a safe route to recovery?*

## Summary

Recovery is a delivery decision with compatibility, state, evidence, ownership, and customer-impact consequences. Rollback, roll-forward, disablement, containment, restore, and pause are different options, not interchangeable commands. A clear Recovery Decision Record turns uncertainty into an accountable next action without pretending that the system is already fully understood.

## Key Takeaways

- Recovery options differ in what they change, leave changed, and can make worse.
- Compatibility of artifacts, configuration, infrastructure, state, and dependencies determines whether rollback is safe.
- Mixed-version state is a deliberate condition that needs evidence and ownership.
- Under pressure, distinguish observed facts from hypotheses and choose proportionate, reversible action where possible.
- A Recovery Decision Record makes scope, limitations, residual risk, and revision triggers visible.

## Review Questions

1. What conditions can make direct rollback unsafe?
2. How does a flag disablement differ from rollback?
3. Why is mixed-version state relevant to a progressive release?
4. Which evidence would support containment when root cause is unknown?
5. What should a recovery record state about residual risk?

## Interview Questions

1. How would you respond when a production change fails but rollback may be incompatible with a migration?
2. What recovery evidence would you expect before declaring a feature contained?
3. How do you distinguish an observed failure from a causal conclusion during a release incident?

## Practical Exercise

Create a **Recovery Decision Record** for the Atlas Commerce confirmation failure.

1. Record the known 5% cohort scope, flag state, artifact/configuration identity, and migration concern.
2. Compare direct rollback, flag disablement, and compatible roll-forward.
3. Select one immediate action and state what it does not resolve.
4. Define evidence for containment, an owner for in-flight records, and a revision trigger.

Use a fictional state transition. Do not run a rollback, migrate data, restore infrastructure, or connect to a production system.

## Further Reading

- [DORA DevOps capabilities](https://cloud.google.com/architecture/devops)
- [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)
- [Kubernetes concepts](https://kubernetes.io/docs/concepts/)

## References

[^dora]: Google Cloud. [DevOps capabilities](https://cloud.google.com/architecture/devops). Accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish rollback, roll-forward, disablement, containment, restore, and pause.
- [ ] Identify compatibility conditions before recommending a recovery action.
- [ ] Explain what mixed-version state means for a release decision.
- [ ] Create a Recovery Decision Record with evidence, limitations, owners, and revision triggers.

## Navigation

Previous: [Chapter 7 — Deployment Verification and Release Evidence](chapter-07-deployment-verification-and-release-evidence.md)  
Next: [Chapter 9 — Release Readiness, Promotion, and Operational Handoffs](chapter-09-release-readiness-promotion-and-operational-handoffs.md)
