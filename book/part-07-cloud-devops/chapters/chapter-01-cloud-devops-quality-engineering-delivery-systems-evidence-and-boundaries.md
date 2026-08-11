# Chapter 1 — Cloud & DevOps Quality Engineering: Delivery Systems, Evidence, and Boundaries

## Metadata

| Field | Value |
|---|---|
| Part | Part VII — Cloud & DevOps |
| MQE-BOK domain | Domain 7 — Cloud & DevOps |
| Chapter | 1 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Parts I, III, and V; risk-informed testing and automated-feedback fundamentals |
| Estimated study time | 170 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A successful deployment is an observation about one step in a delivery system, not proof that a release is safe for every user and condition.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce plans to introduce a new checkout service version. The delivery pipeline reports that unit, API, and browser checks passed; the build produced an image identified by an immutable digest; and a deployment controller reports that all new instances are ready.

The QA Engineer records the release as passed. During the first customer cohort, however, the service uses the production payment endpoint while its configuration still selects a staging callback address. Payments are accepted, but a subset of confirmation messages is not delivered. The application code is not the only relevant change: artifact identity, runtime configuration, environment boundaries, deployment exposure, and the response plan all affect the release outcome.

No individual participant needs to have been careless for this to occur. The result exposes a delivery-system question: *what claim did the available evidence support, what did it leave unknown, and who owned the next safe decision?* This part develops the reasoning needed to answer that question.

## Why This Chapter Matters

A traditional QA workflow often begins with an executable build, a deployed test environment, and a question such as “does the feature work?” Those inputs remain valuable, but modern delivery makes them incomplete. A change may include application code, dependencies, generated artifacts, environment-specific configuration, infrastructure declarations, deployment rules, flags, credentials, and approvals. A failure or success at one boundary does not automatically describe the others.

Cloud & DevOps Quality Engineering does not mean that a Quality Engineer must operate a cloud account or own the deployment platform. It means that the engineer can make the delivery path inspectable: identify the decision at stake, the state that can affect it, the evidence available, the limits of that evidence, the accountable owner, and the next safe action.

This chapter establishes that mental model. Chapter 2 examines environment, configuration, and secret boundaries. Chapter 3 examines artifact and runtime consistency. Later chapters apply the model to infrastructure intent, pipelines, deployment exposure, verification, recovery, and release readiness.

## Chapter Purpose

To define Cloud & DevOps Quality Engineering as delivery-system reasoning: making bounded, evidence-based decisions about software changes as they move from versioned intent to operating behaviour.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish an application-quality question from a delivery-system-quality question;
- describe the delivery system and the state it carries across a change path;
- state a bounded delivery claim, its decision consumer, evidence, limitations, and owner;
- explain why cloud characteristics can change quality risks without making cloud a vendor-specific topic;
- identify where Parts III–VI contribute evidence and where they do not own delivery implementation; and
- create a concise Cloud Delivery Risk and Evidence Map for a fictional change.

## From Application Behaviour to Delivery-System Behaviour

An application is one component of a release decision. A delivery system is the wider set of people, policies, versioned inputs, environments, automation, and operational controls that transforms a proposed change into behaviour experienced by users.

For a checkout change, the relevant path can include:

1. a source revision and its review record;
2. declared dependencies and a build process;
3. a versioned artifact and its identity;
4. configuration references and resolved runtime values;
5. infrastructure intent and the applied environment state;
6. automated and human review evidence;
7. deployment and exposure rules;
8. post-deployment verification; and
9. a decision to continue, pause, recover, or learn.

The list is not a universal pipeline design. A small service may have fewer steps; a regulated or safety-sensitive change may need more. The important point is that quality-relevant state crosses boundaries. A green test run may say something useful about a source revision in a specified environment. It cannot, by itself, establish that the intended artifact is operating with the intended production configuration after a staged release.

### Product, automation, delivery, and operations questions

These questions often appear together, but they have different ownership and evidence needs.

| Question | Primary concern | Example evidence | This part's contribution |
|---|---|---|---|
| Does the refund rule calculate the intended outcome? | Product behaviour | Example-based, property-based, or exploratory test evidence | Uses the result as an input to a delivery decision; testing design remains Part III. |
| Does the automated suite give timely, diagnosable feedback? | Automation system | Run history, controlled state, reports, traces | Routes its evidence through delivery; automation architecture remains Part V. |
| Did the approved artifact, configuration, and infrastructure reach the intended cohort safely? | Delivery system | Artifact identity, promotion record, rollout and verification evidence | Primary Part VII concern. |
| Is the service meeting ongoing reliability objectives? | Operations and reliability | Telemetry, SLOs, incident evidence, capacity data | Part VII defines the handoff; deep practice belongs to Part VIII. |

This separation prevents a common failure mode: treating every green automation run as release approval. Automation may be excellent evidence for a defined behaviour and still be insufficient for a decision involving environment state, compatibility, or gradual customer exposure.

## Cloud Quality Implications Without Vendor Assumptions

Cloud computing is commonly described as on-demand access to configurable computing resources that can be provisioned and released with limited management interaction.[^nist-cloud] That definition is useful here because it draws attention to *changeability*. Resources, environments, and service relationships can be created, modified, scaled, or replaced rapidly. That capability can improve delivery speed, but it also makes configuration provenance, ownership, and evidence more important.

ISO/IEC 25010:2023 defines a product-quality model with nine characteristics; cloud is not one of those product-quality characteristics.[^iso-25010] In this handbook, cloud is treated as a delivery and operating context that can affect product qualities and the engineering capabilities used to support them. For example:

- elastic or replaced runtime instances can make hidden local state unsafe;
- managed dependencies can change the responsibility boundary for configuration and recovery;
- geographically distributed or multi-environment deployments can make a single “the environment” claim misleading;
- policy-controlled access can protect sensitive delivery state but can also block needed verification if ownership is unclear; and
- rapid provisioning can reduce manual delay while increasing the cost of unreviewed or untraceable change.

The conclusion is not that cloud delivery is inherently risky or inherently reliable. It is that a quality claim must name its context. “The service is deployed” is ambiguous until the artifact, effective configuration, target environment, exposure, and decision threshold are known.

### Shared responsibility is an evidence boundary

In a managed service, a provider may operate some underlying components while the consuming team controls application behaviour, configuration, identities, data classifications, and release decisions. The exact boundary differs by service and agreement. A Quality Engineer should not assume that a managed platform proves a customer-facing outcome, nor assume that the delivery team controls every lower-level condition.

Ask four questions instead:

1. What condition is relevant to this release claim?
2. Which team or provider can change or attest to that condition?
3. What evidence is available to the decision maker?
4. What remains outside the team's direct observation or control?

This produces a more useful statement than a generic shared-responsibility diagram. It identifies the evidence boundary for the decision at hand.

## The Delivery Claim Model

A delivery claim is a concise, challengeable statement about a change. It is not a promise that no defect exists. A useful claim contains the following elements.

| Element | Question it answers | Example |
|---|---|---|
| Decision and consumer | Who must act, and what do they need to decide? | Release owner deciding whether to expand checkout exposure. |
| Claim | What bounded condition is being evaluated? | Version `2026.10.4` is operating with the approved payment configuration for the first cohort. |
| Change and state | Which versions and conditions matter? | Image digest, configuration revision, infrastructure change, cohort, time window. |
| Evidence | What observations can support the claim? | Promotion record, resolved configuration identity, targeted payment probe, cohort result. |
| Limitation | What does the evidence not establish? | It does not establish behaviour for all regions or long-running retry paths. |
| Owner and action | Who decides or responds? | Release owner continues; payment owner investigates a mismatch. |
| Residual risk and trigger | What remains possible, and when must the decision be revisited? | Retry volume above an agreed condition pauses expansion. |

This is an **original MSQE teaching model**, not a formal standard. Its value is practical: it prevents an observed fact, an interpretation, and a recommendation from being silently merged into one reassuring status message.

### Worked reasoning: the Atlas Commerce checkout change

Atlas Commerce plans a 5% customer exposure for checkout version `2026.10.4`. The supplied fictional evidence is:

| Observation | What it directly establishes | What it does not establish |
|---|---|---|
| The pipeline selected source revision `a81e9f2` and produced image digest `sha256:41c…`. | A specific build output was recorded for that revision. | That the digest is the one running for the customer cohort. |
| Automated checks passed in the controlled delivery environment. | The selected checks passed under their recorded conditions. | That production configuration and third-party behaviour match those conditions. |
| The deployment controller reports three new instances ready. | The instances reached the controller's readiness condition. | That the critical checkout path succeeds for customers. |
| A configuration record names payment endpoint `payments.example`. | A declared configuration reference exists. | That the effective runtime value was resolved as intended or that callbacks succeed. |

The weak conclusion is: *the release is green; expand it.* The evidence supports only intermediate observations. A proportionate initial decision is: *hold exposure at 5% until the team confirms effective configuration identity and runs a targeted checkout probe for the cohort; if either differs from the approved release record, pause expansion and assign investigation ownership.*

This is not unnecessary caution. It is a distinction between evidence that has been observed and a broader claim that has not yet been established. It also avoids pretending that a probe proves every customer outcome. The decision can be narrow and still useful.

## Quality Controls Are Not Guarantees

A control is a mechanism intended to reduce uncertainty or risk. Examples include peer review, signed artifact metadata, configuration validation, infrastructure change review, automated tests, approval rules, progressive exposure, and recovery preparation. A control can fail, be misapplied, be bypassed, or cover a smaller scope than people assume.

Treat each control as evidence to inspect, not as a magic label. A required approval might show that an accountable person reviewed a documented change. It does not prove that the document was complete or that the environment cannot differ. A policy check might show that a declaration matched a rule. It does not prove the rule was sufficient for the user-impact risk.

This principle is especially important in delivery systems because control names can sound conclusive: *quality gate*, *production ready*, *deployment successful*, or *compliant*. Ask what the control evaluated, the version and conditions it used, and the decision it can responsibly support.

## Delivery-System Boundaries in Practice

The delivery system has several boundaries at which evidence can be lost, misattributed, or over-interpreted. The following table is not an architecture diagram; it is a reasoning aid for release conversations.

| Boundary | Typical weak statement | Better engineering question | Useful evidence |
|---|---|---|---|
| Source to build | “The code was merged.” | Which revision, dependency set, and build inputs produced the candidate artifact? | Reviewed revision and build record. |
| Build to artifact | “The image is available.” | Which immutable artifact represents the candidate, and can it be distinguished from a later build? | Artifact digest and build metadata. |
| Artifact to target | “The release was deployed.” | Which target, workload, configuration, and infrastructure identities received that artifact? | Promotion/deployment record and safe runtime identity. |
| Target to exposure | “Production has the change.” | Which users, regions, paths, or accounts can experience the new behaviour? | Cohort or release-control record. |
| Exposure to decision | “Nothing looks wrong.” | Which decision-relevant outcomes and time window have actually been observed? | Bounded probes, cohort evidence, limitations. |
| Decision to learning | “We fixed it.” | What control, ownership, or evidence condition changed, and how will its effect be assessed? | Improvement record and later review. |

The table explains why delivery quality cannot be inferred from a single system of record. Each system often sees only one boundary. Version control can show intent. A build service can show a transformation. A runtime can show selected state. A support team can observe customer impact. The release owner needs a coherent, bounded account across those observations.

### Claims should be falsifiable

A good delivery claim can be contradicted by meaningful evidence. “The release is sound” is too vague to challenge. “The approved checkout artifact and callback configuration are operating for the card cohort, and the selected confirmation path supports expanding exposure from 5% to 25%” can be challenged by a mismatched identity, a failed probe, a non-representative cohort, or a compatibility concern.

Falsifiability is not pessimism. It prevents the team from treating a claim as a social signal rather than an engineering conclusion. It also makes exit conditions clearer. If evidence is inconclusive, the outcome can be a narrower decision: maintain a cohort, obtain a specified observation, exclude a path, or prepare containment. A delivery claim earns trust by naming how it could be revised.

### A proportionate evidence budget

Evidence has cost. It consumes time, engineering attention, runtime capacity, and sometimes customer tolerance. The right response to an uncertain release is not automatically to add every available check. Consider three questions:

- **Decision value:** If this observation changes, would the release decision change?
- **Independence:** Does it challenge a different failure mode, or merely repeat the same implementation path?
- **Cost and risk:** Can it be performed safely within the time needed for the decision?

For Atlas Commerce, confirming the effective callback configuration identity has high decision value because a mismatch can invalidate test evidence. Re-running a large browser suite that already passed against the same artifact may have lower incremental value if it does not observe the production configuration. A narrowly scoped confirmation probe can add a different kind of evidence, but its synthetic account and dependency assumptions must remain visible.

### Accountability is not an approval queue

Every delivery claim needs a decision owner, but that does not require routing every change through a central Quality Engineering approval queue. The owner is the person or role able to choose the next action and accept its consequences. Other contributors can provide evidence, review assumptions, operate the platform, own a dependency, or communicate to customers.

For a small release, one person may hold several roles. For a more consequential release, separating artifact, platform, product, and release decisions may reduce blind spots. The important thing is not role names. It is that a contradictory observation reaches someone with authority to pause, narrow, or recover the change.

## A Release Conversation Pattern

When a delivery conversation becomes vague, use a short sequence to restore engineering focus:

1. **Name the decision.** Is the team deciding to build, promote, deploy, expose, pause, recover, or learn?
2. **Name the relevant state.** Which revision, artifact, configuration, infrastructure intent, environment, and cohort are in scope?
3. **Name the evidence.** Which observation supports each part of the claim, and when was it gathered?
4. **Name the gap.** Which material condition is still unknown, unobserved, or outside the selected boundary?
5. **Name the action and owner.** Who can continue, narrow, pause, or recover, and what revisits the decision?

For example, “Can we expand?” becomes: *The release owner is deciding whether to expand the card cohort. The approved digest and callback configuration are observed for the initial target. The probe covers confirmation for a synthetic card path. Bank transfer and delayed retry behaviour remain outside the claim. The owner holds at 5% until the stated window completes or a pause condition occurs.* The wording is not a template to recite. It is a way to stop a status colour from replacing a decision.

### Selecting a boundary with care

Every claim has a boundary. Too narrow a boundary produces evidence that cannot influence the decision; too broad a boundary produces a costly, vague exercise. An initial release may justify verifying one critical journey and one configuration identity rather than surveying every product feature. A change that touches customer identity or financial state may need a wider boundary or more conservative exposure. State why the chosen boundary is appropriate and what it excludes.

The boundary also protects cross-part coherence. Part III can help decide whether a business path has adequate test evidence. Part V can help make automated feedback deterministic. Part VII uses those results to decide whether a particular artifact and effective state may move to the next exposure. Part VIII takes responsibility for longer operational behaviour once the release decision has passed. The same customer journey can appear in each part without becoming duplicate curriculum because the decision changes.

## Engineering Perspective

The delivery system should be treated as a product with consumers. Its consumers include engineers who need feedback, release owners who need a promotion decision, support teams who need an accurate change record, and customers who experience the outcome. Like other products, it has interfaces, dependencies, failure modes, observability limits, maintenance costs, and owners.

For a Quality Engineer, the practical contribution is not to own every platform component. It is to improve the quality of decisions at the interfaces: articulate an evidence requirement, surface an unowned assumption, challenge a misleading green state, select a bounded verification, or make recovery criteria explicit before pressure increases.

## Industry Perspective

NIST SP 800-145 supplies a vendor-neutral vocabulary for cloud service and deployment concepts.[^nist-cloud] The DORA research programme discusses delivery capabilities such as continuous delivery, cloud infrastructure, and documentation as factors investigated in relation to delivery and organisational outcomes.[^dora-capabilities] These sources can inform questions about capabilities and context; they do not prescribe a universal pipeline, metric target, or release policy.

The Open Container Initiative provides interoperable specifications for image, runtime, and distribution concepts.[^oci] Later chapters use those concepts to distinguish an artifact from a running workload. A product name may help explain a local implementation, but it must not silently become the general model.

## Common Misconceptions and Pitfalls

### “A deployment is a single event”

Deployment is usually a sequence of state changes: selecting an artifact, applying configuration and infrastructure intent, starting workloads, exposing traffic, and collecting evidence. Treating it as one event hides the questions that determine whether expansion or recovery is justified.

### “Cloud removes responsibility”

Managed services change responsibility boundaries. They do not remove the team's responsibility to understand the conditions that affect its customers, configuration, data, and release decisions.

### “The Quality Engineer is the release approver”

Quality Engineering supplies evidence and judgement; decision authority should be explicit and context-dependent. Assigning one role a symbolic final sign-off can hide shared ownership and prevent the accountable release owner from confronting evidence limitations.

### “More checks always make the claim stronger”

More checks may add noise, duplicate shared logic, or obscure the actual decision. Prefer a small, traceable set of complementary evidence that addresses the material release risks.

## QA → QE Transition

The QA-oriented question is: *did the application work in the available environment?* The Quality Engineering question is: *what delivery claim is needed for this decision; which artifact, configuration, infrastructure, and exposure conditions affect it; what evidence supports it; and what remains uncertain?*

This transition preserves testing skill while placing it in a wider system. A test result becomes more valuable when its consumer, scope, limitations, and relationship to the release decision are explicit.

## Summary

Cloud & DevOps Quality Engineering concerns the delivery system through which a software change becomes customer-visible behaviour. The system includes more than a pipeline or cloud account: it includes versions, configuration, infrastructure intent, environments, controls, evidence, people, and recovery choices.

The appropriate outcome is not a universal declaration of readiness. It is a bounded, owned decision supported by evidence that states its limitations. This model anchors the remaining Part VII chapters.

## Key Takeaways

- A green pipeline, ready workload, or completed deployment is evidence about a bounded condition, not an automatic release decision.
- Cloud changes the context and speed of state change; it does not replace engineering judgement.
- Delivery claims should name the decision, relevant state, evidence, limitations, owner, residual risk, and revision trigger.
- Part VII owns delivery-system reasoning; Parts III–VI provide important but distinct capabilities.
- Quality controls reduce uncertainty only to the extent that their scope and evidence support the claim.

## Review Questions

1. What is the difference between a product-behaviour claim and a delivery-system claim?
2. Why is a cloud service model relevant to a Quality Engineer without requiring provider certification?
3. Which elements are missing from the statement “the release passed the pipeline”?
4. How can a ready workload and a failing customer journey both be true?
5. When should a Quality Engineer challenge a control labelled as a quality gate?

## Interview Questions

1. How would you explain the difference between deployment success and release success to a release owner?
2. Describe an evidence boundary you would establish before expanding a progressive rollout.
3. How do you avoid making Quality Engineering a final sign-off function?

## Practical Exercise

Create a **Cloud Delivery Risk and Evidence Map** for the illustrative Atlas Commerce checkout change.

1. Select three release decisions: initial deployment, exposure expansion, and recovery.
2. For each decision, identify the consumer, relevant state, two complementary evidence sources, one evidence limitation, and the accountable owner.
3. State one observation that may look green but is insufficient for the decision.
4. Define a revision trigger that would cause the team to pause or reassess.

Keep the artifact to one or two pages. Do not prescribe a cloud product, fabricate production telemetry, or claim that the map certifies the release.

## Further Reading

- [NIST SP 800-145: The NIST Definition of Cloud Computing](https://csrc.nist.gov/pubs/sp/800/145/final)
- [DORA DevOps capabilities](https://cloud.google.com/architecture/devops)
- [Open Container Initiative](https://opencontainers.org/)

## References

[^nist-cloud]: National Institute of Standards and Technology. [SP 800-145: The NIST Definition of Cloud Computing](https://csrc.nist.gov/pubs/sp/800/145/final). 2011.
[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Product quality model](https://www.iso.org/standard/78176.html). 2023.
[^dora-capabilities]: Google Cloud. [DevOps capabilities](https://cloud.google.com/architecture/devops). Accessed 2026-08-11.
[^oci]: Open Container Initiative. [Open Container Initiative specifications](https://opencontainers.org/). Accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] State a delivery claim without presenting a green status as proof of universal readiness.
- [ ] Identify the artifact, configuration, environment, and exposure assumptions that affect a release decision.
- [ ] Explain the delivery-system boundary between Parts V, VII, and VIII.
- [ ] Create a concise risk-and-evidence map with an owner and revision trigger.

## Navigation

Next: [Chapter 2 — Environment Strategy, Configuration, and Secret Boundaries](chapter-02-environment-strategy-configuration-and-secret-boundaries.md)
