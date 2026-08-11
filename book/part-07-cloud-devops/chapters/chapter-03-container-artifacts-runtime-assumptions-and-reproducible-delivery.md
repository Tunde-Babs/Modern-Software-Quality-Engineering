# Chapter 3 — Container Artifacts, Runtime Assumptions, and Reproducible Delivery

## Metadata

| Field | Value |
|---|---|
| Part | Part VII — Cloud & DevOps |
| MQE-BOK domain | Domain 7 — Cloud & DevOps |
| Chapter | 3 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2; Part II configuration and dependency foundations |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A running workload is evidence that a process started under some conditions. It is not yet evidence that the intended artifact is serving the intended behaviour.

## Opening Story

The following is an **illustrative scenario**. Atlas Commerce approves checkout version `2026.10.4`. The release record names image digest `sha256:41c…`, while a deployment summary shows tag `checkout:release`. The new workloads start successfully and report ready.

During a verification discussion, an engineer discovers that the tag was moved after the original approval. The currently running workload may still be compatible with the release, but the team cannot tell from the tag alone whether it is the approved artifact. A second concern follows: the workload started with a different runtime memory limit than staging, causing an asynchronous receipt-processing path to restart under peak traffic.

The useful question is not whether tags or containers are bad. It is whether the team can identify *what* ran, *under which assumptions*, and *what evidence supports the release decision*.

## Why This Chapter Matters

Containers can make packaging and deployment more consistent, but consistency is not automatic. A container image can contain a reproducible application filesystem while its runtime behaviour still depends on configuration, command arguments, permissions, network access, resource limits, dependency versions, platform characteristics, and lifecycle controls. A successful start or readiness result covers only part of that state.

Quality Engineers do not need to become container-runtime administrators to reason about this boundary. They need to distinguish a mutable label from an immutable artifact identity, understand which runtime assumptions affect a claim, and select verification that is proportionate to the release risk. This chapter uses container concepts as a transferable artifact-and-runtime model; it does not teach Dockerfile syntax, registry administration, or Kubernetes operations.

## Chapter Purpose

To make artifact identity and runtime assumptions inspectable so that a delivery decision can distinguish “a workload started” from “the approved artifact is operating under the intended conditions.”

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish a human-friendly artifact label from an immutable artifact identity;
- identify the build, artifact, runtime, and environment assumptions that affect a delivery claim;
- explain why reproducible packaging does not eliminate runtime variance;
- distinguish readiness, liveness, and bounded functional evidence without designing an observability platform;
- assess compatibility and rollback implications of artifact and runtime changes; and
- create an Artifact-to-Runtime Evidence Brief for a fictional release.

## Artifact Identity Is a Delivery Control

An artifact is a versioned output that can be promoted through environments. For containerized delivery, an image commonly contains filesystem layers and metadata that describe how a runtime can execute it. The Open Container Initiative defines interoperable image, runtime, and distribution specifications.[^oci] The detailed format is less important here than the quality implication: an artifact must be distinguishable from a convenient label that can change over time.

| Identifier type | Useful purpose | Limitation |
|---|---|---|
| Source revision | Connects a change to version-controlled intent. | Does not prove which build inputs or generated output ran. |
| Build record | Connects inputs, process, and output. | Does not prove where the output was deployed. |
| Artifact digest or immutable content identity | Distinguishes a specific packaged output. | Does not establish configuration, runtime state, or customer behaviour. |
| Human-readable tag | Supports communication, discovery, and policy. | May be moved or reused unless governed as immutable. |
| Runtime-reported identity | Helps confirm what a workload says it is running. | Requires trustworthy, controlled reporting and does not cover every dependency. |

None of these identifiers is sufficient alone. Together, they create traceability: source revision → build record → artifact identity → promotion record → deployed workload identity. A decision record should state which link has been observed and which remains an assumption.

### Tags are references, not evidence of immutability

A tag such as `release`, `stable`, or `2026.10.4` can be useful. It is not automatically immutable. A team can make tags immutable through policy and tooling, but the release claim should rely on the actual policy and evidence rather than the reassuring name. If the only deployment record says `checkout:release`, a reviewer should ask whether that label can refer to more than one artifact and how the effective digest is confirmed.

This is a traceability concern, not a demand for a specific registry. The same reasoning applies to packaged binaries, archives, mobile builds, and machine images.

## Runtime Assumptions Complete the Claim

The artifact is not the running system. A workload's effective behaviour can depend on inputs outside the artifact.

| Runtime assumption | Why it can affect quality | Example question |
|---|---|---|
| Effective configuration | Routes dependencies and changes behaviour. | Does the workload resolve the approved callback configuration identity? |
| Command and process lifecycle | Determines what starts and how it stops. | Does the shutdown path allow in-flight checkout receipts to complete? |
| Resource limits and concurrency | Can change latency, restart, and queue behaviour. | Is the production limit sufficient for the initial cohort's expected work? |
| Runtime identity and permissions | Determines accessible dependencies and secrets. | Can the intended workload access the required payment credential reference? |
| Platform and architecture | Can affect native dependencies or scheduling. | Was the artifact built and verified for the target execution platform? |
| Network and dependency reachability | Determines whether a healthy process can complete its critical path. | Can the workload reach the intended payment endpoint under the allowed policy? |

The goal is not to list every possible condition. Select the conditions whose difference would change the decision. A documentation page that declares all runtime values is not necessarily evidence that they were applied. Conversely, a safe runtime metadata endpoint can confirm selected non-sensitive identities without exposing configuration values or credentials.

## Reproducibility Is a Chain, Not a Slogan

Reproducible delivery means that a team can understand and repeat the transformation from approved inputs to the artifact and, as far as practical, recreate or verify the conditions under which it runs. It does not mean every execution will behave identically: customer traffic, third-party dependencies, clock time, capacity, and configuration can vary.

Break the chain into inspectable links:

1. **Build inputs:** source revision, declared dependencies, build configuration, and any generated inputs.
2. **Build output:** a recorded artifact identity and relevant metadata.
3. **Promotion:** a traceable decision that selects the artifact for an environment.
4. **Runtime intent:** configuration identities, infrastructure conditions, and deployment parameters that are reviewed for the target.
5. **Effective runtime state:** safe evidence that the workload uses the selected artifact and material inputs.
6. **Behavioural verification:** a bounded probe or workflow observation for the decision.

The first three links help explain what should run. The last three help evaluate what did run and whether it supports the release claim. Do not collapse them into an assertion that an immutable artifact makes a release reproducible by itself.

## Health, Readiness, and Functional Evidence

Runtime platforms often distinguish whether a workload is alive from whether it is ready to receive work. The precise mechanism differs across platforms. The conceptual distinction is valuable:

- **Liveness-like evidence** indicates that a process is running or can make progress according to a narrow condition.
- **Readiness-like evidence** indicates that a workload may receive a class of traffic according to a defined condition.
- **Functional delivery evidence** indicates that a selected business-relevant path performed as expected under a bounded context.

An HTTP response from a health endpoint may be appropriate for traffic routing. It does not establish that an authenticated checkout can create a payment confirmation. A full customer journey may be inappropriate as a frequent readiness check because it creates cost, side effects, or dependency risk. The Quality Engineering task is to choose complementary evidence and state its limits.

Deep telemetry design, long-term reliability measurement, and SLOs are not covered here. They are Part VIII concerns. This chapter only establishes the delivery decision's immediate evidence boundary.

## Worked Reasoning: The Moved Tag and Restarting Workload

Atlas Commerce is considering whether to expand the checkout cohort from 5% to 25%.

| Evidence item | Observation | Interpretation | Limitation |
|---|---|---|---|
| Approved release record | Digest `sha256:41c…` was approved for source revision `a81e9f2`. | Defines the intended artifact. | Does not show deployment state. |
| Deployment report | Workload uses tag `checkout:release`; no digest recorded. | The report is insufficient to confirm the intended artifact. | A tag may be governed as immutable, but no evidence of that policy is supplied. |
| Safe workload metadata | Three workloads report `sha256:41c…`. | The expected artifact appears to be running on the observed instances. | Does not prove every instance or future replacement uses it. |
| Readiness result | All instances report ready. | They meet the readiness condition. | Does not test checkout completion or receipt processing. |
| Cohort event log | Two receipt processors restarted after memory pressure while completing queued confirmations. | Runtime resource assumptions may be incompatible with current workload shape. | More evidence is needed to establish customer impact and cause. |

The correct decision is not necessarily rollback. First, the team can hold at 5%, confirm that replacement instances report the approved digest, investigate the resource-limit difference and receipt queue behaviour, and run a bounded confirmation probe. The artifact identity question is mostly resolved for observed workloads; the runtime-consistency question is not. Expansion would be unsupported until its effect on the critical path is understood.

### Compatibility and recovery implications

Artifact changes can interact with configuration, data state, and dependency contracts. A rollback to an earlier artifact may be unsafe when the later release has introduced a forward-only schema change, a new required configuration, or an incompatible external interaction. That does not make rollback impossible; it makes compatibility an explicit decision input.

Record at least these questions before a risky release:

- Can the prior artifact read and write the state created by the new artifact?
- Are both artifact versions compatible with the active configuration and flag state?
- Can a new workload be replaced without losing in-flight work or idempotency guarantees?
- What evidence distinguishes an artifact defect from an environment or dependency condition?

Chapter 8 develops recovery choices in depth. Here, the key idea is that immutable identity improves traceability, while compatibility analysis makes recovery realistic.

## The Artifact-to-Runtime Evidence Brief

The **Artifact-to-Runtime Evidence Brief** is an original MSQE teaching artifact. It gives a reviewer enough context to challenge an artifact and runtime claim without forcing a long platform document.

| Field | Example prompt |
|---|---|
| Decision | What promotion, expansion, or recovery decision needs support? |
| Intended artifact | Which source revision, build record, and immutable identity were approved? |
| Target runtime | Which environment, cohort, and workload class are in scope? |
| Material assumptions | Which configuration identities, permissions, resources, and dependencies matter? |
| Evidence | How will the team safely confirm artifact identity and selected runtime conditions? |
| Functional check | Which bounded probe complements health/readiness evidence? |
| Limitation | What customer paths, replacement behaviour, or dependency conditions remain unproven? |
| Compatibility and recovery | Which versions/configurations can coexist, and what would trigger a pause? |
| Owners | Who owns artifact, platform, dependency, and release decisions? |

Use the brief for material delivery decisions, not every routine workload restart. Its purpose is to expose the assumptions whose failure would alter the decision.

## Building an Artifact-to-Runtime Chain of Custody

Traceability becomes more useful when it answers an investigation question quickly. A chain of custody for a release artifact does not need legal terminology or a dedicated product. It needs stable relationships that a reviewer can inspect:

| Link | Question | Minimum useful record |
|---|---|---|
| Source to build | Which approved revision and dependency declaration started the build? | Revision identifier and build invocation identity. |
| Build to artifact | Which immutable output resulted? | Digest or other immutable content identity. |
| Artifact to promotion | Which output was selected for which target decision? | Promotion record with target and approval context. |
| Promotion to runtime | Which observed workload reports the selected output? | Safe runtime identity and observation time. |
| Runtime to behaviour | Which material conditions and probe connect the workload to the release hypothesis? | Configuration identity, selected probe, cohort/time boundary, limitation. |

This chain also improves failure classification. If a workload reports a different artifact, the problem is a promotion or deployment-identity issue before it is an application defect. If the artifact matches but the configuration differs, the team can focus on effective state. If both match and the critical path contradicts expectation, the evidence points to behaviour, dependency, or compatibility questions. The record does not solve the fault; it prevents speculative diagnosis from spanning every layer at once.

### Build reproducibility and dependency volatility

An artifact can be difficult to reproduce when its build consumes an unpinned dependency, a changing base image, a network-fetched generator, or a time-dependent input. This chapter does not prescribe a packaging tool or a universal lockfile policy. It does require the release record to state the inputs relevant to the claim. If a dependency can change between builds of the same source revision, a source revision alone is not enough to explain why two artifact digests differ.

The practical response is proportional. A high-impact service may retain detailed build metadata and verify a controlled rebuild. A low-risk internal utility may need only a documented build identity and input convention. The principle is that an unexpected artifact difference should be explainable by a recorded input or a clearly stated limitation, not by memory.

### Runtime assumptions can be release controls

Runtime resource settings are often described as operational tuning. They can be release controls when a change depends on throughput, shutdown, queue processing, or memory behaviour. For Atlas Commerce, confirmation processing that restarts under a lower production memory limit changes the validity of an initial cohort result. A successful startup establishes that the process can begin; it does not establish that it can complete the release-critical work under the target load shape.

This does not require a performance-engineering programme in every release. Deep load modelling belongs to Part X. The delivery question is narrower: has the team identified a resource or lifecycle assumption that could invalidate the specific rollout evidence, and is the selected observation sufficient for the decision?

### Safe replacement and lifecycle evidence

Workloads are often replaced during scaling, recovery, configuration refresh, or platform maintenance. A verification result obtained from three instances may become less relevant when a fourth starts later with different effective inputs. Where risk warrants it, define whether the release decision depends on observing replacement behaviour, verifying identity at admission, or re-running a bounded probe after material change.

Likewise, a graceful shutdown claim should be bounded. A runtime may signal termination while work remains queued, a dependency may be unavailable, or an operation may require idempotent retry. State what the lifecycle control observes and what later delivery/recovery decision would require stronger evidence.

## Artifact Promotion and Runtime Verification Scenarios

Consider how a single source revision can produce different delivery conclusions:

| Scenario | Observed condition | Appropriate conclusion |
|---|---|---|
| Same source, different digest | A dependency or build input changed between runs. | Investigate build-input traceability before assuming equivalent behaviour. |
| Same digest, different configuration identity | The packaged output is consistent but effective runtime state differs. | Treat configuration as the primary evidence gap; retest only the material delivery claim. |
| Same digest/configuration, failed functional probe | The intended state is present but the selected path contradicts expectation. | Pause or narrow exposure and investigate behaviour, dependency, or compatibility. |
| Ready workload, unobserved replacement | Current instances report expected identity but an autoscaled instance has not been checked. | State the observation boundary; decide whether replacement verification matters now. |
| Prior artifact incompatible with new state | Rollback would reintroduce an older reader or writer. | Select containment or compatible roll-forward rather than assuming a simple revert. |

These scenarios are useful because they prevent the same symptom—“checkout failed”—from being assigned to the wrong layer. They also show why an artifact digest is necessary but not sufficient evidence.

### Runtime defaults can hide risk

Platform defaults for resource limits, termination behaviour, locale, time zone, network resolution, or retry handling may be appropriate until a release depends on them. When a default becomes material, it should be identified as an assumption and either verified, deliberately overridden, or recorded as a limitation. A Quality Engineer need not tune the platform; they can ask whether the default's behaviour invalidates the release evidence.

For a confirmation flow, a default shutdown period may matter if new workloads are frequently replaced while processing asynchronous receipts. A release may be safe with the default, but that conclusion should follow from evidence about in-flight work and idempotent handling rather than an assumption that the container starts cleanly.

## Engineering Perspective

Artifact traceability can turn an ambiguous production investigation into a bounded comparison. Without it, teams may debate source branches, tags, and deployment timestamps while lacking evidence of what actually ran. With it, they can ask more productive questions: did the expected artifact run; did its material runtime inputs match; did the intended verification occur; and which decision is justified?

The best artifact strategy is proportionate. A small internal tool may need a simple, documented build identity. A high-impact service may need stronger provenance, promotion records, and compatibility controls. The principle is stable: identity should be sufficient for the release claim and recoverable by the people who must act.

## Industry Perspective

The Open Container Initiative defines open specifications for container images, runtimes, and distribution.[^oci] Those specifications provide shared terminology; they do not prescribe a release process or prove that an organization uses containers safely. The [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) can inform traceability and integrity discussions, but this chapter does not teach supply-chain security controls in depth.

Official documentation for a particular runtime may explain a readiness or resource setting. Use it only after first explaining the general claim, assumption, evidence, and limitation. Product-specific configuration is not transferable curriculum content.

## Common Misconceptions and Pitfalls

### “A tag uniquely identifies what is running”

A tag is only as stable as the policy and evidence behind it. Record the immutable artifact identity where traceability matters.

### “Containers eliminate environment differences”

They package some dependencies, but runtime configuration, resources, identity, networking, and external systems still vary.

### “Ready means the feature is ready”

Readiness is a deliberately narrow traffic-admission condition. It should be complemented by a bounded functional probe when the release decision requires it.

### “Reproducible means deterministic customer behaviour”

Reproducible build and promotion evidence reduce ambiguity. They do not eliminate variability in production dependencies, traffic, or state.

## QA → QE Transition

The QA-oriented question is: *did the new container start?* The Quality Engineering question is: *which immutable artifact is running for which cohort, under which material runtime assumptions, and what evidence is sufficient for the next promotion or recovery decision?*

This shift makes packaging and runtime conditions part of quality reasoning rather than platform detail that is somebody else's concern.

## Summary

An artifact identity, a running workload, and a customer-visible outcome are distinct observations. Traceable artifact-to-runtime links help a team evaluate what ran; explicit runtime assumptions and bounded functional evidence help it decide what to do next.

Chapter 4 applies the same desired-versus-actual-state reasoning to infrastructure changes.

## Key Takeaways

- Immutable artifact identity is stronger release evidence than a mutable label alone.
- Reproducible delivery is a chain from inputs through runtime evidence, not a claim that all conditions are identical.
- Container packaging does not remove configuration, resource, identity, dependency, or compatibility assumptions.
- Health and readiness evidence should be distinguished from bounded functional delivery evidence.
- Artifact traceability and compatibility analysis improve recovery decisions without prescribing a platform.

## Review Questions

1. What does an image digest establish that a mutable tag may not?
2. Which runtime assumptions could invalidate an otherwise correct artifact?
3. Why is readiness evidence insufficient for some release decisions?
4. How does artifact identity help distinguish a release defect from an environment issue?
5. What compatibility questions should precede a potential rollback?

## Interview Questions

1. How would you investigate a report that a new container is ready but a critical workflow fails?
2. What evidence would you request before expanding a containerized service rollout?
3. Explain why a rollback may be unsafe even when the new artifact appears problematic.

## Practical Exercise

Create an **Artifact-to-Runtime Evidence Brief** for Atlas Commerce checkout version `2026.10.4`.

1. Record an intended source revision, build record, and fictional immutable artifact digest.
2. Select three runtime assumptions that matter to the payment-confirmation path.
3. Define one safe artifact-identity check, one runtime-condition check, and one bounded functional probe.
4. State one limitation and one compatibility condition that would affect a rollback decision.

Use synthetic values. Do not write a Dockerfile, provision a runtime, or use a real registry account.

## Further Reading

- [Open Container Initiative](https://opencontainers.org/)
- [Kubernetes concepts](https://kubernetes.io/docs/concepts/)
- [NIST SP 800-218: Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)

## References

[^oci]: Open Container Initiative. [Open Container Initiative specifications](https://opencontainers.org/). Accessed 2026-08-11.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish a tag, build record, immutable artifact identity, and runtime-reported identity.
- [ ] Identify the runtime assumptions material to a delivery claim.
- [ ] Explain why readiness and functional evidence answer different questions.
- [ ] Create an Artifact-to-Runtime Evidence Brief with limitations and recovery considerations.

## Navigation

Previous: [Chapter 2 — Environment Strategy, Configuration, and Secret Boundaries](chapter-02-environment-strategy-configuration-and-secret-boundaries.md)  
Next: [Chapter 4 — Infrastructure as Code: Change Evidence, Review, and Drift](chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md)
