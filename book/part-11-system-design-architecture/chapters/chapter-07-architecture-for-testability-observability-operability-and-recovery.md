# Chapter 7 — Architecture for Testability, Observability, Operability, and Recovery

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 7 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–6; Parts III, V, VII, and VIII recommended |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Testability is not a property of a test suite and observability is not a property of a dashboard. Both are decided by boundaries drawn before either exists, and both are expensive to retrofit precisely because they are structural.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

Atlas wants to verify the `PAYMENT_UNKNOWN` handling introduced after the Chapter 3 incident. The question is simple: when the payment provider times out, does the order reach a state that can later be reconciled, and does the customer see something true?

Nobody can answer it, and the reasons are all structural.

**The fault cannot be produced.** The payment provider's SDK is constructed inline in the checkout service and called directly. There is no seam at which a slow response can be introduced. The team's only lever is the network — they can block the provider's host, which produces a connection refusal, not a timeout after a partially-processed request. Those are different faults with different consequences, and the one they can produce is not the one that hurt them.

**The fault cannot be observed.** The only signal that the provider was degraded during the incident came from the provider's own public status page. Atlas logs the *outcome* of each payment call but not its latency distribution, and the correlation identifier introduced after Chapter 4 is generated inside the adapter, which means it does not exist for a call that fails before the adapter records anything.

**The resulting state cannot be inspected.** `PAYMENT_UNKNOWN` exists in the schema. There is no way to enumerate orders currently in it, no way to see how long they have been there, and no way for a test to assert that reconciliation moved them out, because reconciliation runs on a fifteen-minute schedule that cannot be triggered on demand.

A QA Engineer could reasonably conclude that the feature is untestable. That conclusion is correct and incomplete. It is untestable *because of three specific architectural decisions*, each of which was taken for a defensible local reason and none of which was taken with evidence in mind.

## Why This Chapter Matters

Chapters 2 through 6 kept deferring things to this chapter. That was deliberate, and it is worth collecting the debts explicitly, because discharging them is what this chapter is for.

| Deferred from | The question left open |
| --- | --- |
| Chapter 2 | Boundaries determine what evidence is obtainable — process boundaries make interactions observable and injectable; data boundaries determine what can be asserted. What must a boundary provide to be evidenceable? |
| Chapter 3 | A controlled experiment in which a dependency is made *slow* rather than made to fail is disproportionately valuable. What must the architecture provide for that to be possible at all? |
| Chapter 4 | Cross-store behaviour requires correlation-aware setup and controllable partial-failure seams. Where do those come from? |
| Chapter 5 | An asynchronous boundary needs a controllable seam for delivery timing, duplication, and ordering. Who provides it? |
| Chapter 6 | A response measure that nobody can observe is not a measure. What makes a measure obtainable? |

The common answer is that all five are **architecture decisions**, taken before any test, dashboard, or runbook exists, and expensive to reverse afterwards. That is the whole argument of this chapter, and it is why testability belongs in an architecture part rather than only in a testing part.

The chapter treats six capabilities: testability, observability, deployability, operability, recoverability, and safe degradation. It develops them as *architecture-relevant properties* — what the structure must provide — and hands implementation depth back to the parts that own it. It does not teach a test framework, a telemetry SDK, chaos-engineering operations, deployment tooling, or SLO design.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish the ISO/IEC 25010:2023 senses of testability and operability from the broader engineering senses used in Part XI, and say which level you mean;
- decompose testability into isolation, controllability, observability of state, determinism, and substitution, and identify which architectural decision supplies each;
- explain what an environment seam is and why a seam's *position* determines what evidence is obtainable;
- reason about bounded failure simulation, including the failure modes that no local seam can reproduce;
- describe observability, deployability, operability, recoverability, and safe degradation as architecture requirements rather than tooling choices;
- assess a fault-simulation coverage figure without treating it as a quality score; and
- produce an Engineering-Capability Review comparing two boundary designs.

## Naming the Level: ISO Vocabulary Versus Engineering Usage

Chapter 1 established this distinction, and this chapter is where it is most likely to be blurred, because four of its six subjects collide with standard vocabulary.

| Term | Inside ISO/IEC 25010:2023 | In Part XI engineering usage (this chapter) |
| --- | --- | --- |
| **Testability** | A subcharacteristic of **maintainability**: the degree to which test criteria can be established and tests performed.[^iso-25010] | The architectural conditions — isolation, controllability, state observability, determinism, substitution — that make evidence obtainable at all. |
| **Operability** | A subcharacteristic of **interaction capability**, concerning whether a **user** can operate the product. | Whether a **team** can run, diagnose, and intervene in the system safely in production. |
| **Recoverability** | Not a top-level characteristic. Recovery appears within reliability in the standard's structure. | The architectural conditions that allow a system to return to a correct state after a partial failure, and that allow anyone to *verify* that it did. |
| **Modifiability** | A subcharacteristic of maintainability. | Used only in the standard's sense. |

**Observability, deployability, and safe degradation are not ISO/IEC 25010:2023 characteristics or subcharacteristics at any level.** Part XI uses them purely as engineering capabilities and says so. This is not pedantry: a reviewer who believes "observability" is an ISO characteristic will look for it in the standard, not find it, and reasonably conclude the analysis is unreliable.

Throughout this chapter, the engineering sense is intended unless a sentence explicitly names the standard.

## Testability Is Five Things, Each Supplied by a Boundary

"Testable" is as unbounded a word as "reliable" was in Chapter 6. Decomposing it identifies which architectural decision supplies each part — and therefore which decision to argue about.

| Component | What it means | Which architectural decision supplies it |
| --- | --- | --- |
| **Isolation** | The element under evaluation can be exercised without its collaborators. | Module and process boundaries; dependency direction (Chapter 2). |
| **Controllability** | Inputs, dependency behaviour, time, and starting state can be set deliberately. | The existence and position of seams; whether time and identifiers are injected or ambient. |
| **State observability** | The resulting state can be inspected without reaching into an implementation. | Data ownership and whether a component exposes its state (Chapter 4). |
| **Determinism** | Repeating the same inputs under the same conditions produces the same result. | Whether behaviour depends on wall-clock time, ambient configuration, shared mutable state, or arrival order (Chapter 3). |
| **Substitution** | A collaborator can be replaced by something whose behaviour is chosen. | Whether the dependency is reached through an owned abstraction or called directly. |

Atlas's opening story fails on four of the five. Isolation is absent because checkout constructs the provider SDK inline. Controllability is absent for the same reason. State observability is absent because `PAYMENT_UNKNOWN` cannot be enumerated. Determinism is compromised because reconciliation is driven by a schedule that cannot be triggered.

Notice that none of those five is fixed by choosing a better test framework. Framework choice is Part V's concern and is downstream of all of them.

## Seams, and Why Position Determines Evidence

A **seam** is a place in a system where behaviour can be changed without changing the code around it. Seams are what make substitution and controllability possible, and their *position* determines what evidence is obtainable — which is the architectural decision, not the seam's existence.

Consider three possible positions for a seam between Atlas checkout and the payment provider:

| Seam position | What can be controlled | What cannot |
| --- | --- | --- |
| **Network** (proxy, DNS, firewall) | Connectivity, gross latency, TLS behaviour | Provider semantics; a response that is well-formed but represents an unexpected state; anything requiring the provider's own record |
| **HTTP client** (interceptor inside the SDK's transport) | Status codes, bodies, delays, malformed responses | The SDK's own parsing, retry, and error-mapping behaviour, which sits above the seam and is therefore untested |
| **Domain port** (an Atlas-owned interface in Atlas's vocabulary) | Every outcome Atlas's domain recognises, including "unknown" | Whether the real adapter maps real provider behaviour to those outcomes correctly — that requires a separate, narrower evidence path |

No position is best. Each makes a different band of behaviour controllable and pushes a different band out of reach. The architectural error is not choosing the wrong seam; it is having **only one** and assuming it covers everything. A domain port gives excellent coverage of Atlas's own logic and cannot tell you whether the adapter's mapping is right; an HTTP-client seam is the only thing that can, and it cannot exercise Atlas's unknown-outcome handling cleanly. Real coverage usually needs two seams at different levels, which is a cost to be stated rather than assumed.

## Bounded Failure Simulation

Chapter 3 argued that *slow* is the condition most systems handle worst and test least. Making it producible is an architecture requirement.

**Bounded** failure simulation means: a chosen fault, at a chosen seam, in a chosen environment, with a defined blast radius and a defined stop condition. That is a different activity from chaos engineering as an operational practice — which runs experiments against production systems, requires organisational readiness and safety mechanisms, and belongs to Part VIII. Part XI's concern is narrower and prior: **can the architecture produce the fault at all, safely, without a production system?**

Three architectural properties determine the answer.

**A seam at the right level exists.** Covered above.

**The fault can be scoped.** Injecting latency at the network level affects every call through that path. Injecting it at a domain port affects one dependency. A design where the only available lever is global has no bounded simulation — only an outage.

**The system's response is observable and reversible.** A simulated fault that leaves state nobody can inspect, or that requires a database restore to undo, will not be run twice. Repeatability is an architectural property here, not a discipline one.

### What no seam can simulate

This is the part most often missed, and it is the honest core of the chapter.

The two failure modes that produced the Chapter 3 and Chapter 4 incidents were: a response arriving *after* Atlas gave up, and the provider processing a request whose response never arrived. Both are characterised by **divergence between Atlas's belief and the provider's record**. No local test double can produce that divergence meaningfully, because a double has no independent record to diverge from — whatever it says is, by construction, the truth.

Addressing those requires something a seam cannot provide: a provider sandbox that maintains its own state, plus a reconciliation query against it. That is an architectural and contractual requirement on the *dependency*, not a testing technique. Recording it as such — and noting that Atlas has never confirmed the provider offers it — is the useful output.

## Numerical Reasoning: Fault-Simulation Coverage

The following is a **bounded, synthetic worked example**, and it demonstrates a headline figure that misleads.

| Field | Entry |
| --- | --- |
| Context | Atlas has enumerated the payment-dependency failure modes it needs to handle and wants to know how many each candidate adapter design makes simulable. |
| Population and boundary | Nine enumerated failure modes: (1) connection refused, (2) TLS failure, (3) slow response within timeout, (4) slow response exceeding timeout, (5) provider 5xx, (6) provider rate-limit response, (7) malformed response body, (8) response arriving after Atlas gave up, (9) provider processed the request but the response was lost. Scope is a non-production environment with no live provider integration. |
| Assumptions | "Simulable" means the fault can be produced deliberately, scoped to this dependency, and repeated. The enumeration is complete — itself an assumption. |
| Units | Counts of failure modes; percentage of the nine. |
| Calculation | **Design A** (SDK called inline, network-level lever only) simulates 1, 2, and 3: **3 of 9 = 33.3%**. **Design B** (domain port with an owned adapter) simulates 1 through 7: **7 of 9 = 77.8%**. |
| Interpretation | Design B roughly doubles the simulable surface. That is a real and substantial difference, and it is the strongest single argument for the port. |
| Limitation | **Correct arithmetic; a misleading headline.** The count treats nine failure modes as equally important, and they are not: modes 8 and 9 are the two that caused every incident in Chapters 3 and 4, and **neither design can simulate either**. A "77.8% coverage" figure therefore reports high coverage of the failure modes Atlas has already handled and zero coverage of the ones that have actually hurt it. Modes 8 and 9 are not seam problems; they require a provider sandbox with independent state and a reconciliation query — a contractual property of the dependency. The enumeration itself is also an assumption: a tenth mode nobody listed has 0% coverage in both designs and does not appear in the arithmetic at all. |
| Decision relevance | Supports the port on substitution and scoping grounds. Does **not** support a claim that payment failure handling is 78% covered, and specifically identifies the provider-sandbox question as the highest-value open item. |

The general lesson generalises past this example: a coverage percentage over a self-selected enumeration measures agreement with your own list. It cannot see what the list omits, and it weights a catastrophic mode identically to a trivial one.

## Worked Reasoning: Two Payment-Adapter Boundary Designs

**Design A — Direct SDK use.** The provider's SDK is imported into the checkout module. Its client is constructed at the call site from ambient configuration. Provider types appear in checkout's own code. This is Atlas's current design, and it was chosen for a good reason: it is the least code.

**Design B — Domain port with an owned adapter.** Checkout depends on an Atlas-owned `PaymentPort` expressed in Atlas's vocabulary — `authorize(correlationId, amount)` returning `Authorized | Declined | Unknown`, and `queryOutcome(correlationId)`. One adapter implements the port against the provider SDK. Provider types do not escape the adapter.

| Dimension | Design A | Design B |
| --- | --- | --- |
| **Substitution** | Only by replacing the SDK's transport or the network. Provider vocabulary is embedded in checkout, so a substitute must speak the provider's language. | The port is the substitution point, in Atlas's own vocabulary. A double returns `Unknown` directly — the case that matters most. |
| **Deterministic testing** | Poor. Checkout logic and provider-response parsing are entangled; a test of checkout is also a test of the SDK. | Good for checkout logic. The adapter's mapping still needs its own, narrower evidence path at a lower seam — a real cost, not a free win. |
| **Fault simulation** | 3 of 9 enumerated modes; global scope only. | 7 of 9; scoped to this dependency. Modes 8 and 9 out of reach for both. |
| **Diagnostics** | Provider error codes surface into checkout, where they carry no domain meaning. Failures read as "provider said 502." | The adapter translates provider conditions into domain outcomes, so a failure reads as "payment outcome unknown for correlation X" — which is what an operator needs. |
| **Traces / events** | The correlation identifier is generated inside the SDK call path, so it does not exist for a call that fails before the SDK records anything. | The correlation identifier is generated by the port's caller **before** the call, satisfying Chapter 4's precondition for reconciliation. |
| **State inspection** | `PAYMENT_UNKNOWN` exists but is not enumerable; the adapter holds no attempt record. | The port's contract requires an attempt record written before the call, which makes the unknown population queryable. |
| **Recovery verification** | Cannot be verified. Reconciliation is schedule-driven and cannot be triggered; there is nothing to assert against. | `queryOutcome` is an explicit port operation, so reconciliation becomes a callable, assertable path. |
| **Safe operation** | An operator facing a stuck order has provider error text and a schedule. | An operator can enumerate unknowns, see their age, and trigger resolution for one order. |
| **Independent change** | A provider SDK upgrade touches checkout. Changing provider is a checkout rewrite. | A provider change is confined to the adapter, **provided** the new provider's semantics fit the port. If they do not, the port leaked. |
| **Cost** | Zero. | An interface, an adapter, a mapping layer, and a second evidence path for the mapping. Plus the standing risk of an abstraction that fits one provider and no other. |
| **Limitation** | — | The port does not make the provider's behaviour knowable. It makes Atlas's *handling* of that behaviour evidenceable. That distinction is the honest boundary of the whole design. |

### The decision record

| Element | Entry |
| --- | --- |
| Context | `PAYMENT_UNKNOWN` handling cannot be verified: the fault cannot be produced, observed, or asserted against. |
| Quality claim | Atlas can demonstrate, before deployment, that a payment timeout produces a reconcilable order state and a truthful customer-visible state. |
| Characteristic | Reliability and functional suitability as the outcome; **testability in the engineering sense**, plus observability and recoverability, as the capabilities required to evidence it. |
| Constraint | Four engineers; eight weeks to the promotion; the provider's sandbox capabilities are unknown. |
| Option A | Keep direct SDK use; add latency injection at the network level. |
| Option B | Introduce the domain port and adapter. |
| Assumption | The provider offers a sandbox with independent state and a reconciliation query. **Unverified, and it bounds what either option can achieve.** |
| Trade-off | A is free and leaves the two consequential failure modes and all of state inspection unaddressed. B costs an abstraction and a second evidence path, and unlocks correlation identifiers, unknown enumeration, and callable recovery — but still cannot reach modes 8 and 9. |
| Failure mode | A: the team declares the feature verified on the strength of a connection-refusal test. B: the port is shaped around one provider's semantics and leaks at the first provider change. |
| Evidence needed | Confirmation of the provider's sandbox and reconciliation contract — cheap, and it constrains both options. A bounded prototype of the port for one operation. |
| Limitation | No design can establish real provider behaviour under real degradation without the provider's cooperation. |
| Decision | Not made here. The provider-sandbox question is a half-day of contractual investigation, it is required by both options, and a negative answer materially changes what either can claim. |
| Owner | Payment domain owner for the boundary; the same owner, with commercial support, for the provider contract question. |
| Residual risk | Modes 8 and 9 remain unsimulable locally under either option; that is a permanent condition, not a backlog item. |
| Revision trigger | Provider contract change; a second payment provider being considered; any change to the reconciliation schedule. |

## Observability, Deployability, Operability, Recoverability, and Safe Degradation

Testability has taken most of this chapter because it is the capability Quality Engineers are best placed to argue for. The other five are treated more briefly, as architecture requirements rather than practices.

**Observability** in this handbook's engineering usage is the degree to which a system's internal state can be understood from what it emits. Its architectural preconditions are narrow and specific: a correlation identifier created **before** the operation and propagated across boundaries; state transitions emitted as events rather than inferred from log text; and a component's important internal states being *enumerable* rather than only individually inspectable. Chapter 4's evidence row and this chapter's `PAYMENT_UNKNOWN` problem are the same problem. Telemetry implementation, instrumentation libraries, SLI/SLO design, and alerting all belong to Part VIII; what belongs here is requiring that the architecture make the signals *possible*.

**Deployability** is whether a change can be released independently, safely, and reversibly. Its architectural preconditions are the deployment boundary (Chapter 2), contract compatibility across versions (Chapter 8), and whether state changes are backward-compatible with the previous version — because a rollback that cannot read the data the new version wrote is not a rollback. Pipelines, environments, and rollout mechanics are Part VII's.

**Operability** in the engineering sense is whether a team can run, diagnose, and intervene safely. Its architectural preconditions are the existence of intervention points that do not require a database console: a way to trigger reconciliation for one order, retry one job, cancel one in-flight operation, or take one dependency out of the path. Systems where every intervention is a manual `UPDATE` statement are not operable, and that is a design outcome. Incident practice and runbooks are Part VIII's.

**Recoverability** is whether the system can return to a correct state after a partial failure, *and whether anyone can verify that it did*. The second clause is the one architectures omit. Chapter 4's reconciliation path is a recovery mechanism; without a way to enumerate what it acted on and assert the result, recovery is asserted rather than evidenced.

**Safe degradation** is the ability to lose a capability without losing correctness. It is a design decision taken per path, and Chapter 4's CAP treatment supplies the frame: catalogue can serve stale data when its dependency is unavailable; entitlement cannot. A system with one global degradation policy has not made this decision — it has defaulted.

**Architecture assertions** connect this chapter forward. Some structural properties can be checked repeatably: that no module imports another's internals, that a forbidden dependency direction does not appear, that a contract remains compatible. These are the raw material for Chapter 9's fitness functions. Chapter 2 already noted that dependency direction and cycles are the natural first candidates because they are cheap and deterministic. Their implementation as automated feedback is Part V's work.

## Engineering Perspective

Three positions follow.

**Argue for the seam, not for the test.** A Quality Engineer who says "we need better payment tests" will be told to write them. One who says "checkout constructs the provider client inline, which means we cannot produce a timeout, cannot generate a correlation identifier before the call, and cannot enumerate unknown orders — here is what each costs us" is describing an architecture requirement with three named consequences. The second is actionable at design time and the first is not.

**Ask what evidence each response measure requires.** This discharges Chapter 6's handoff. For every response measure in a scenario set, ask what the architecture must emit or expose for it to be obtainable. Measures that fail this test should be revised or explicitly marked unobtainable — a measure nobody can take is worse than no measure, because it looks like a commitment.

**Record permanently-unreachable evidence as residual risk, not as backlog.** Modes 8 and 9 will not become simulable through effort. Filing them as work implies they will be resolved; recording them as residual risk with an owner is truthful and keeps them visible in the decision.

## Industry Perspective

Distributed-tracing practice illustrates the architecture-versus-implementation split this chapter draws. The OpenTelemetry specification defines context propagation — the mechanism by which a trace identifier travels across service boundaries — as something each instrumented component must participate in.[^otel] The specification and its SDKs are implementation concerns and belong to Part VIII. What belongs to architecture is the prior condition: that boundaries are crossed in ways that *can* carry context, and that the identifier is created at the point where the business operation begins rather than deep inside a library. A system whose boundaries drop context cannot be instrumented into observability afterwards; the instrumentation will faithfully report disconnected fragments.

This is offered as an illustration of the boundary between architecture and implementation, not as a recommendation of a specific tool or vendor.

## Common Misconceptions and Pitfalls

### "Testability is a testing concern."

Isolation, controllability, state observability, determinism, and substitution are each supplied by an architectural decision. A test framework operates on whatever those decisions left available.

### "We'll add observability later."

Emission can be added later. Correlation identifiers created before an operation, enumerable state, and boundaries that carry context cannot — those are structural, and retrofitting them means changing call sites across the system.

### "Coverage of the failure modes is 78%."

Over a self-selected enumeration, weighting a catastrophic mode identically to a trivial one, and blind to whatever the enumeration omits. Ask which modes are uncovered before reading the percentage.

### "The abstraction makes us provider-independent."

It makes provider *change* cheaper if the new provider's semantics fit the abstraction. An abstraction derived from one provider usually encodes that provider's model, and the leak is discovered during the migration it was supposed to make easy.

### "Chaos engineering will find these problems."

Chaos engineering is an operational practice with prerequisites in safety, observability, and organisational readiness, and it belongs to Part VIII. It also cannot help if the architecture provides no scoped seam — the only available experiment is an outage. Producibility comes first.

### "Recovery works; we've seen it recover."

Recovery observed once is not recovery verified. Verification requires enumerating what needed recovery, triggering the mechanism, and asserting the resulting state — all three of which are architectural affordances.

## QA → QE Transition

The transition in this chapter is from adding tests after a design is chosen to contributing requirements for controllable seams, meaningful state, diagnostics, recovery evidence, and bounded failure simulation *while the design is still open*.

A QA Engineer given the `PAYMENT_UNKNOWN` feature would attempt to test it, discover it is untestable, and raise that as an impediment — correctly. A Quality Engineer decomposes the impediment: isolation is absent because the SDK is constructed inline; controllability is absent for the same reason and can be supplied by a port; state observability is absent because the unknown population is not enumerable; determinism is compromised by a schedule that cannot be triggered. Each is a named architectural decision with a named owner and a stated cost. Then they say the harder thing — that two of the nine failure modes will remain unsimulable whatever Atlas builds, because they depend on the provider's own record, and that this is residual risk rather than work.

The first response reports that testing is blocked. The second gives the architecture decision-maker four specific, costed changes and one honest limit.

## Summary

Testability, observability, operability, recoverability, and safe degradation are decided by boundaries drawn before any test, dashboard, or runbook exists. Testability decomposes into isolation, controllability, state observability, determinism, and substitution, each supplied by a specific architectural decision rather than by a framework choice. Seams make substitution possible, and a seam's position determines which band of behaviour is controllable and which is pushed out of reach — which is why one seam is rarely enough. Bounded failure simulation requires a scoped seam, an observable response, and reversibility; some failure modes, notably those involving divergence between a system's belief and a dependency's record, cannot be simulated locally at all and belong in residual risk. A fault-simulation coverage percentage measures agreement with a self-selected enumeration and can report high coverage of exactly the modes that have never caused an incident.

## Key Takeaways

- Testability is five distinguishable properties, each supplied by an architectural decision, none by a framework.
- A seam's position decides what evidence is obtainable; real coverage usually needs seams at two levels, which is a cost.
- Correlation identifiers must be created before the operation, or they do not exist for the failures that matter.
- Enumerable state is an architecture affordance: a state you cannot list is a state you cannot verify recovery from.
- Bounded failure simulation needs scope, observability, and reversibility; chaos engineering as an operational practice is Part VIII's and comes later.
- Divergence between a system's belief and a dependency's record cannot be simulated locally — record it as residual risk, not backlog.
- Deployability requires state changes that the previous version can still read, or rollback is not available.
- Operability means intervention points that are not manual database edits.
- Recoverability includes the ability to *verify* recovery, which architectures routinely omit.
- Safe degradation is decided per path; one global policy means the decision was defaulted.

## Review Questions

1. Atlas's `PAYMENT_UNKNOWN` feature is untestable. Name the three architectural decisions responsible and the testability component each removes.
2. Why does the position of a seam matter more than its existence, and why is one seam usually insufficient?
3. Design B simulates 7 of 9 failure modes. Explain precisely why that figure overstates the improvement.
4. Why can no local test double reproduce "the provider processed the request but the response was lost"?
5. What must the architecture provide before a response measure from Chapter 6 is obtainable?
6. Give an example of an intervention point that makes a system operable, and one that does not.

## Interview Questions

1. A team says a feature cannot be tested. How would you turn that into an architecture conversation?
2. What would you ask for at design time to make a third-party dependency's failures evidenceable?
3. How do you distinguish "we have not tested this" from "this cannot be tested as designed"?
4. What does it take to verify that a recovery mechanism worked, rather than to observe that it appeared to?

## Practical Exercise

Produce an **Engineering-Capability Review** for the following synthetic Atlas Commerce situation.

*Atlas is adding an inventory-hold service. When a customer adds an item to a basket, checkout calls the hold service to reserve stock for 20 minutes; holds expire automatically via a background sweeper that runs every 60 seconds. The hold service has its own store. Checkout calls it synchronously. If the hold call fails, checkout currently proceeds without a hold. Fulfilment reads holds to decide what may be picked. The partner inventory feed reflects unheld stock only.*

Your review must:

- decompose testability into the five components and state, for each, which architectural decision currently supplies or withholds it;
- identify **at least two candidate seam positions** and state what each makes controllable and what it pushes out of reach;
- enumerate **at least six failure modes** of the hold interaction, and classify each as simulable locally, simulable only with a cooperating dependency, or not simulable at all — with reasons;
- state what must be emitted or exposed for a "holds expire correctly under load" claim to be verifiable, and identify anything currently missing;
- assess **deployability**: state one way a hold-schema change could make rollback unavailable;
- assess **operability**: name one intervention an operator will need and say whether the design provides it;
- assess **recoverability**: state how you would verify, not merely observe, that expired holds were released;
- state a **safe degradation** decision for the case where the hold service is unavailable, and say which characteristic it trades against; and
- record at least one item as **residual risk rather than backlog**, with a reason it will not be resolved by effort.

Then answer, in no more than 150 words: checkout currently proceeds without a hold when the hold call fails. Using Chapter 6's vocabulary, state whether this is a safe-degradation decision or a defaulted one, and what evidence would tell you. Do not design the service. Use synthetic data only; no production system or live third-party integration.

## Further Reading

- [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html) — for the standard's senses of testability and operability.
- [OpenTelemetry specification](https://opentelemetry.io/docs/specs/otel/) — official project documentation, not a standard; cited here only for context propagation across boundaries.
- [SEI — The Architecture Tradeoff Analysis Method](https://www.sei.cmu.edu/library/the-architecture-tradeoff-analysis-method/)

## References

[^iso-25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). 2023. Accessed 2026-08-14.
[^otel]: OpenTelemetry Authors. [OpenTelemetry Specification](https://opentelemetry.io/docs/specs/otel/). Official project documentation; not a formal standard. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] State whether you mean the ISO or the engineering sense of testability and operability.
- [ ] Decompose testability into five components and name the architectural decision supplying each.
- [ ] Choose a seam position deliberately and state what it puts out of reach.
- [ ] Identify failure modes that no local seam can reproduce, and record them as residual risk.
- [ ] Read a fault-simulation coverage figure without treating it as a quality score.
- [ ] State the architectural preconditions for observability, deployability, operability, recoverability, and safe degradation.
- [ ] Produce an Engineering-Capability Review comparing two boundary designs on cost as well as benefit.

## Chapter Navigation

Previous: [Chapter 6 — Quality Attributes, Constraints, and Trade-off Scenarios](chapter-06-quality-attributes-constraints-and-trade-off-scenarios.md) · Next: [Chapter 8 — Contracts, Compatibility, and Change Impact](chapter-08-contracts-compatibility-and-change-impact.md)
