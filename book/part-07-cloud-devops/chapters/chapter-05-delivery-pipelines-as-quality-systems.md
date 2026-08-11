# Chapter 5 — Delivery Pipelines as Quality Systems

## Metadata

| Field | Value |
|---|---|
| Part | Part VII — Cloud & DevOps |
| MQE-BOK domain | Domain 7 — Cloud & DevOps |
| Chapter | 5 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–4; Part V continuous-feedback strategy |
| Estimated study time | 200 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A delivery pipeline does not make a release safe by being green. It makes a release decision more trustworthy when its inputs, controls, outputs, failures, and limits are traceable.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce's release pipeline builds checkout version `2026.10.4`, runs selected checks, stores an artifact, and promotes it to the initial production cohort. Every stage is green. The release owner later discovers that the promotion used a configuration bundle produced by the previous run because a human reran only the final deployment stage after a transient infrastructure failure.

The pipeline did what its stages were asked to do. Its status does not show whether every input belonged to the same release claim. The problem is not “manual reruns are forbidden.” It is whether the pipeline preserves enough identity and evidence to determine what was built, tested, approved, promoted, and deployed.

## Why This Chapter Matters

Part V teaches how automated checks can produce trustworthy feedback. A delivery pipeline consumes that feedback alongside build, artifact, configuration, infrastructure, approval, and deployment state. It is therefore a release system: a mechanism that coordinates decisions, not merely a place where commands run.

Treating a pipeline as a sequence of green and red boxes encourages false conclusions. A green test stage can be valid evidence for the artifact it tested and still be irrelevant if a different artifact, configuration, or target was promoted. Conversely, a failed non-critical reporting step may need investigation without automatically proving that a release is unsafe. The meaningful question is what each stage establishes and how the pipeline preserves relationships among its inputs and outputs.

## Chapter Purpose

To teach delivery pipelines as traceable release systems that connect versioned inputs, controls, artifacts, environments, approvals, failures, and evidence to specific promotion decisions.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify the inputs, outputs, consumers, and failure paths of a delivery pipeline;
- distinguish a pipeline-stage result from the release claim it can support;
- describe artifact, configuration, infrastructure, and approval traceability through promotion;
- evaluate reruns, stale inputs, and partial success without simplistic rules;
- design proportionate pipeline gates and evidence retention; and
- create a Delivery Evidence Flow and Gate Rationale for a fictional release.

## A Pipeline Is a Release System

A delivery pipeline may trigger from a source change, then build, test, package, scan, publish, request approval, apply infrastructure, deploy, and verify. Product names differ; the underlying system problem is consistent. It transforms versioned intent into a customer-facing change and records some evidence along the way.

| Pipeline element | Delivery-system question |
|---|---|
| Trigger | What source, event, or approved change started this run? |
| Inputs | Which source revision, dependencies, configuration declarations, and infrastructure revisions are associated with it? |
| Controls | Which checks, reviews, policies, approvals, and segregation boundaries apply? |
| Outputs | Which artifact, reports, deployment records, and decision records result? |
| Promotion | How is a selected output associated with the target environment and cohort? |
| Failure path | What happens on timeout, retry, partial execution, cancelled work, or a manual intervention? |
| Evidence retention | Can a later reviewer reconstruct the conditions of the decision without accessing a secret or proprietary system? |

The pipeline need not solve every quality concern. It should make its own evidence boundary clear. A unit suite may not represent production dependency behaviour. An approval may not verify runtime configuration. A deployment step may not observe customer-facing functionality. The pipeline is valuable when it routes these different controls into an honest decision record rather than disguising their limits with one overall status.

## Traceability Through Promotion

Promotion means selecting an output that has met the evidence requirements for a new decision context. Promotion is not merely copying an artifact to another location or deploying it to a later-named environment. A useful promotion record links:

1. the source revision and build record;
2. the immutable artifact identity;
3. the relevant configuration and infrastructure declaration identities;
4. the checks and their execution context;
5. the approval or automated policy decision, where applicable;
6. the target environment and intended exposure; and
7. the post-deployment verification required before further promotion.

This does not require every organization to build an elaborate release ledger. The information may be distributed across version control, artifact metadata, workflow records, and deployment evidence. What matters is that an accountable person can establish the relationship without guessing from timestamps or mutable labels.

### The danger of independent green stages

Independent stages become misleading when their identities are not connected. Consider these statements:

- “Tests passed.” Which source revision, artifact, configuration, and dependency conditions did they use?
- “The image was approved.” Is that the image selected for the current deployment?
- “Infrastructure applied.” Which declaration and target state are associated with the promotion?
- “Deployment succeeded.” Did it use the intended configuration bundle and release-control state?

Each may be true. The release can still be unsupported if they concern different versions or contexts. This is why a pipeline's primary quality property is not speed alone; it is attributable, reviewable movement from inputs to decisions.

## Gates, Controls, and Decision Rights

A gate is a rule or review point that determines whether a pipeline may continue or whether an accountable person must decide. A gate should have a clear purpose, owner, input, output, failure path, and limitation.

| Gate type | Appropriate purpose | Common overclaim |
|---|---|---|
| Build and package | Establish that declared inputs produced an artifact. | “The artifact is ready for all environments.” |
| Automated quality evidence | Evaluate selected product or system claims. | “All product risk is covered.” |
| Configuration or infrastructure review | Challenge intended delivery state. | “Actual production state is proven.” |
| Policy check | Enforce encoded constraints. | “The policy captures all relevant risk.” |
| Human approval | Make accountable judgement under stated evidence. | “A signature guarantees correctness.” |
| Deployment verification | Support continuation, pause, or recovery after change. | “Production is universally healthy.” |

Gates can be automated, manual, or mixed. Automation is useful for repeatable evidence; human judgement is necessary when the decision involves incomplete evidence, trade-offs, customer impact, or a novel condition. The design question is not whether humans or automation are better. It is whether the gate's authority matches the claim it controls.

### Avoiding gate theatre

Gate theatre occurs when a pipeline displays many named controls but nobody can explain what they evaluate, what changed after they ran, who can override them, or what a green result means. It can create delay without improving decision quality.

Reduce gate theatre by recording a small rationale for material gates:

- decision supported;
- risk addressed;
- input identities;
- required observation or threshold;
- owner and override conditions;
- failure classification; and
- known evidence limits.

This makes it possible to remove redundant gates and strengthen missing ones without treating every check as sacred.

## Reruns, Partial Failures, and Stale State

Delivery systems must handle transient failures, cancelled runs, dependency outages, and human interventions. A blanket “never rerun” policy is impractical; a blanket “rerun until green” policy destroys evidence.

Before a rerun, ask:

1. Which inputs and outputs are reused, and are their identities still valid for the decision?
2. Did any configuration, infrastructure, dependency, or source condition change since the original run?
3. Is the operation safe to repeat, or can it create duplicate deployment, notification, migration, or data effects?
4. How will the record distinguish the original failure from the subsequent result?
5. Who has authority to choose partial continuation, clean rebuild, or pause?

The answer may be a clean rebuild when identities no longer align, a targeted retry when an idempotent evidence collection step failed, or an escalation when state cannot be safely reconstructed. The decision should be explainable after the fact.

## Worked Reasoning: The Green Pipeline with Stale Configuration

Atlas Commerce's pipeline provides this fictional evidence:

| Stage | Result | Relevant identity | Limitation |
|---|---|---|---|
| Build | Passed | Source `a81e9f2`, artifact `sha256:41c…` | Does not connect to the final configuration selection. |
| Automated checks | Passed | Artifact `sha256:41c…`, controlled test configuration `testcfg-18` | Does not represent production callback configuration. |
| Infrastructure review | Approved | Declaration revision `infra-92` | Actual target state has not yet been observed. |
| Deployment retry | Passed | Artifact `sha256:41c…`, configuration bundle identifier absent | A prior-stage bundle may have been reused. |
| Initial verification | Not yet run | — | No evidence for effective production configuration or cohort behaviour. |

The overall green state is insufficient for exposure expansion. The team should stop treating the deployment retry as a simple continuation and establish which configuration bundle was promoted. If that identity cannot be verified, a clean, traceable promotion is safer than assuming the result. The immediate decision is *hold the initial cohort*, not *declare the release failed*. A fresh deployment record and bounded verification may resolve the gap.

## Delivery Evidence Flow and Gate Rationale

The **Delivery Evidence Flow and Gate Rationale** is an original MSQE teaching artifact. It represents the path from change intent to a decision, not a universal workflow.

| Step | Input identity | Control/evidence | Output or decision | Owner | Limitation/failure path |
|---|---|---|---|---|---|
| Build | Source revision and declared dependencies | Build record | Immutable artifact identity | Build owner | Does not prove runtime behaviour. |
| Validate | Artifact and controlled configuration | Selected automated and human evidence | Evidence summary | Quality owner | Coverage is bounded by selected claims. |
| Prepare target | Config and infrastructure declaration revisions | Review, plan, policy result | Target-intent record | Platform owner | Intent may differ from actual state. |
| Promote/deploy | Artifact plus approved target inputs | Promotion and deployment record | Initial cohort | Release owner | May be affected by stale or partial input. |
| Verify | Effective target identities and probes | Deployment verification | Continue, pause, or recover decision | Release owner | Does not establish every production condition. |

The artifact should make a stale or mismatched input visible. If no row can state an identity or owner, the pipeline may have an evidence gap even when every visible stage is green.

## Pipeline Failure Semantics and Evidence Retention

Not every failed stage has the same delivery meaning. A useful pipeline distinguishes failure categories so that a team can choose a safe response rather than collapse every condition into “red.”

| Failure category | Example | Appropriate first question |
|---|---|---|
| Invalid input | Configuration declaration is missing a required identity. | Which approved input is incomplete, and must promotion stop? |
| Product-evidence contradiction | Selected contract check fails for the candidate artifact. | What claim is contradicted, and is the failure reproducible under recorded conditions? |
| Delivery-system failure | Runner loses connectivity before publishing artifact metadata. | Can the operation be safely retried, and which output identities are known? |
| Policy or approval condition | Required review is absent or an exception is unresolved. | Who has authority to resolve or reject the condition? |
| Verification contradiction | Post-deployment probe fails after a green pipeline. | Which exposure decision must pause while the evidence is classified? |

Classification does not mean hiding failure severity. It helps preserve evidence and route the right response. For example, a test failure may be a product signal, a nondeterministic automation issue, a stale dependency condition, or a runner failure. Part V develops automation diagnosis; Part VII determines whether the delivery system can still connect the result to a promotion decision.

### Evidence retention should serve reconstruction

A retained report is useful only if a later reviewer can connect it to the relevant inputs and decision. Retain or reference, as appropriate for risk and policy:

- source and build identity;
- artifact identity;
- configuration and infrastructure declaration identities;
- selected check and report identities;
- approval, exception, or override decision;
- target, cohort, and deployment identity; and
- verification outcome and time window.

The goal is not permanent retention of sensitive or voluminous logs in every system. It is sufficient traceability for the release's expected investigation and governance needs. Sensitive information should remain in controlled systems with appropriate access; the delivery record can retain safe references and classifications.

### Manual intervention can be a controlled interface

Pipelines sometimes require a person to choose a target, accept documented residual risk, or respond to incomplete evidence. The danger is not that a person acted. The danger is that the intervention severs the relationship among inputs, output, and authority.

A reviewable manual intervention records who acted, what input identities were selected, which evidence was considered, why the normal path could not complete, and whether the result is a clean promotion, controlled exception, or condition requiring later reconciliation. This is substantially different from a private command or a button click with no contextual record.

### Designing for failed verification

The pipeline should not treat deployment as its final success point when its release model requires verification. A failed post-deployment probe needs an explicit path: hold exposure, flag the release decision as incomplete, preserve identities and reports, notify the owner, and invoke the bounded recovery process. The delivery system should not automatically retry a customer-affecting deployment simply to restore a green overall status.

## Pipeline Design Questions for Quality Engineers

The following questions can improve a pipeline without turning a Quality Engineer into its sole designer or operator:

| Question | Why it matters |
|---|---|
| Can the release record show which exact inputs each gate evaluated? | Prevents a green result from being attached to the wrong artifact or configuration. |
| Does a gate fail with a useful category and preserve evidence? | Prevents destructive rerun-until-green behaviour. |
| Can a partial rerun create an untraceable promotion? | Identifies where a clean rebuild or explicit exception is safer. |
| Does a manual approval state the decision and residual risk? | Makes human judgement accountable rather than opaque. |
| Is post-deployment verification part of the release path? | Ensures deployment success is not mistaken for release success. |
| Which stage controls which decision? | Reveals redundant gates and unowned gaps. |

Answers can vary by system. A simple internal service may need a concise promotion record; a more consequential release may need clearer evidence retention and segregation. The principle is traceability proportional to decision consequence.

### Pipeline changes are delivery changes

Editing a workflow, approval rule, artifact retention setting, credential reference, or retry behaviour changes the delivery system's behaviour. Such changes need their own review and evidence. A pipeline change can make a future application release less trustworthy even when it does not modify product code.

For example, removing a configuration identity from a deployment record might speed a workflow while eliminating the team’s ability to detect stale state. Adding an automatic retry might reduce transient failure noise while also hiding duplicate side effects if the operation is not idempotent. Review the claim affected by the pipeline change itself.

### Fast feedback and safe promotion are complementary

Teams sometimes frame speed and control as opposites. A pipeline can provide rapid early feedback while reserving slower, decision-specific evidence for a material promotion. The goal is not to make every change wait for every observation; it is to arrange feedback so that a late discovery does not create avoidable customer exposure.

For Atlas Commerce, fast controlled checks can identify an obvious product contradiction before packaging. Artifact/configuration identity and a bounded production verification can support the later exposure decision. Each stage is timely for a different question.

## Engineering Perspective

Pipelines shape the quality of release decisions by determining which state is versioned, which evidence is retained, and which changes may proceed. A fast pipeline with weak traceability can create rapid uncertainty. A slow pipeline with redundant controls can create false ceremony. The goal is a proportionate system that produces evidence in time for the decision while preserving the relationships needed to challenge it.

Quality Engineers can improve the system by asking whether each material gate has a claim, whether controls are connected to the inputs they evaluate, whether failures preserve useful evidence, and whether post-deployment verification has authority to affect the next promotion.

## Industry Perspective

DORA research treats continuous delivery, cloud infrastructure, and related technical capabilities as areas of empirical investigation.[^dora] The research does not authorize a universal pipeline design or prove that one local stage causes a desired outcome. Use it to ask whether a delivery capability improves feedback and learning in context, not to convert metric thresholds into release gates.

Git's version-control concepts support traceable input and review records.[^git] CI/CD product documentation can explain a concrete retry, approval, or artifact mechanism, but it should be cited as product-specific and never presented as the general delivery model.

## Common Misconceptions and Pitfalls

### “Green means ready”

Green means only that recorded stages satisfied their conditions. It does not resolve mismatched identities, unverified target state, or known evidence gaps.

### “Manual promotion is always unsafe”

Manual action can be appropriate when accountability and incomplete evidence require human judgement. It becomes risky when it breaks traceability or hides changed inputs.

### “A rerun erases the earlier failure”

The earlier failure may contain useful evidence about a dependency, state transition, or retry risk. Preserve it and explain why the next action is safe.

### “More gates make a better pipeline”

Unexplained gates can slow delivery without improving evidence. Prefer controls with a defined decision purpose and limitation.

## QA → QE Transition

The QA-oriented conclusion is: *the CI pipeline passed.* The Quality Engineering conclusion is: *this pipeline linked the approved inputs to the artifact, target, evidence, and decision; its controls support these bounded claims; and this remaining gap requires a pause, a clean promotion, or additional verification.*

## Summary

A delivery pipeline is a quality system when it preserves traceable relationships among change inputs, controls, artifacts, environments, decisions, and failures. Its overall status is a summary, not a substitute for reasoning. Gates, reruns, and approvals become trustworthy when their scope and limitations are explicit.

Chapter 6 chooses how a traceable change should be exposed to customers and when the team should pause or expand it.

## Key Takeaways

- Pipelines coordinate release evidence; they do not make a release safe merely by reporting green stages.
- Promotion should connect source, artifact, configuration, infrastructure, checks, target, and verification evidence.
- Gates need a decision purpose, owner, failure path, and stated limitation.
- Reruns require identity, safety, and traceability reasoning rather than prohibition or blind repetition.
- A Delivery Evidence Flow makes mismatches and stale state visible before they become production ambiguity.

## Review Questions

1. Why can independently green pipeline stages fail to support one release claim?
2. What information should a promotion record preserve?
3. When might a clean rebuild be safer than a targeted retry?
4. How does gate theatre reduce delivery quality?
5. Which decision should post-deployment verification be allowed to influence?

## Interview Questions

1. How would you investigate a green pipeline that deployed the wrong configuration?
2. What is the difference between a pipeline gate and release approval?
3. How would you design a retry policy that preserves evidence?

## Practical Exercise

Create a **Delivery Evidence Flow and Gate Rationale** for Atlas Commerce checkout.

1. Map build, validation, target preparation, initial deployment, and verification.
2. Give each step an input identity, evidence/control, owner, output, and limitation.
3. Introduce a fictional stale configuration bundle at deployment and state how your flow detects it.
4. Identify one gate to remove or combine and justify the decision.

Do not configure a CI/CD product, runner, workflow file, or deployment pipeline.

## Further Reading

- [DORA DevOps capabilities](https://cloud.google.com/architecture/devops)
- [Git documentation](https://git-scm.com/docs)
- [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## References

[^dora]: Google Cloud. [DevOps capabilities](https://cloud.google.com/architecture/devops). Accessed 2026-08-11.
[^git]: Git. [Git documentation](https://git-scm.com/docs). Accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain why overall pipeline status does not replace traceable release evidence.
- [ ] Connect a promotion decision to artifact, configuration, infrastructure, and verification identities.
- [ ] Evaluate a rerun without losing the original failure's evidence.
- [ ] Create a concise Delivery Evidence Flow and Gate Rationale.

## Navigation

Previous: [Chapter 4 — Infrastructure as Code: Change Evidence, Review, and Drift](chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md)  
Next: [Chapter 6 — Deployment Strategies, Progressive Delivery, and Release Exposure](chapter-06-deployment-strategies-progressive-delivery-and-release-exposure.md)
