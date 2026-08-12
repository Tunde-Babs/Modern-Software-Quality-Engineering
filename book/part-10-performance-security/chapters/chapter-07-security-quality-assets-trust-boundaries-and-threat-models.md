# Chapter 7 — Security Quality: Assets, Trust Boundaries, and Threat Models

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 7 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2 and Parts III–IV |
| Estimated study time | 170 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Security evidence begins with what must be protected, where trust changes, and what the available verification does not establish.

## Opening Story

The following is an **illustrative scenario**. Atlas lets customers view orders through a browser and mobile client, lets support operators inspect selected order details, and lets services process fulfilment asynchronously. A team receives a generic request to “test account security.” It starts by checking login success and collecting a scanner report.

Neither activity answers the central question. Which assets matter? Which actor is allowed to perform which action on which order state? Where does data cross a trust boundary? What evidence would show that a support operator can view an order but cannot initiate a refund? The answer is not an exploit demonstration. It is a defensible threat-informed verification model.

## Why This Chapter Matters

Security quality is contextual. A control can be appropriate for one asset, actor, and boundary yet inadequate for another. A threat model makes those distinctions visible so that defensive testing and remediation evidence address meaningful risk rather than an unbounded checklist.

This chapter establishes the assets, actors, boundaries, assumptions, and residual-risk vocabulary used by Chapters 8–11. It does not teach offensive exploitation, enterprise risk governance, legal assessment, or a claim of complete threat coverage.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify assets, actors, trust boundaries, attack surfaces, and misuse assumptions;
- distinguish a plausible threat from an evidenced security finding;
- formulate safe defensive verification questions;
- record severity, exposure, limitation, ownership, and residual risk in context; and
- create a Security Quality and Threat Evidence Model.

## Security Quality Is Evidence About Boundaries

Security quality concerns the protection of relevant assets and system behaviour across trust boundaries. Confidentiality, integrity, and availability provide useful context, but they do not create a universal test list. A quality claim should identify the asset, actor, action, state, boundary, evidence, limitation, and decision owner.

An **asset** is something whose unauthorized disclosure, modification, unavailability, or misuse matters: an account, session, payment state, order, support action, credential, configuration value, or audit record. A **trust boundary** is where the system changes how much it trusts an actor, process, data source, or service. An **attack surface** is the set of reachable interactions relevant to the stated context. These concepts guide defensive questions; they do not authorize unauthorized probing.

## Atlas Trust-Boundary Model

| Boundary | Asset/risk context | Defensive verification question |
| --- | --- | --- |
| Browser to account API | Account and session state | Does the API distinguish unauthenticated, authenticated, and expired-session requests as intended? |
| Customer to order resource | Order data and refund authority | Is a customer denied access to another customer's order and refund action? |
| Support role to refund operation | Financial and state-transition integrity | Can a support role view permitted data while being denied a refund action? |
| Checkout to payment dependency | Payment state and sensitive data | Are timeout and unknown-state paths bounded and recorded without exposing sensitive data? |
| Queue consumer to fulfilment store | Order state | Does asynchronous processing preserve authorized state transitions and bounded retries? |

## Worked Reasoning: Support Refund Boundary

The following is an **illustrative, synthetic exercise**. A support operator can view an order after authenticating through the support interface. The business rule says the operator may not initiate a refund. A defensive verification uses a synthetic support identity, a synthetic order, and an expected denial outcome.

| Element | Evidence record |
| --- | --- |
| Asset | Refund authority and order financial state |
| Actor | Authenticated support operator |
| Boundary | Support API to refund-action authorization decision |
| Quality claim | The stated support role is denied refund initiation for the defined order state. |
| Evidence | Synthetic request outcome, authorization record, and resulting unchanged order state. |
| Interpretation | The defined route and state enforce the expected denial. |
| Limitation | This does not establish all roles, order states, APIs, cache paths, or production configuration. |
| Decision consequence | Extend the access-control matrix to relevant roles and states; assign remediation if another route differs. |
| Residual risk | Coverage gaps remain until the defined matrix is complete. |

The evidence distinguishes a verified property from a broad security conclusion. It does not require a bypass technique, real account, or live target.

## Threat Assumptions and Misuse Cases

A useful threat assumption states the context that makes a control question relevant. “An actor might be malicious” is too vague. “An authenticated customer attempts to access an order identifier that does not belong to that customer” is a bounded misuse assumption. “An excessive account-recovery rate occurs while legitimate users need recovery” identifies a quality trade-off to examine later.

| Assumption | Evidence question | Boundary |
| --- | --- | --- |
| Customer changes a resource identifier | Does authorization depend on ownership and action, not just authentication? | Customer/order API boundary |
| Malformed filter reaches catalogue search | Does input handling preserve intended parsing and safe output behaviour? | Browser/API/query boundary |
| Dependency returns unexpected data or times out | Is trust re-established and retry/state behaviour bounded? | Third-party dependency boundary |
| Excessive recovery requests occur | Does the control protect the flow while preserving a legitimate path? | Account-recovery boundary |

## Severity, Context, and Residual Risk

Severity labels can help prioritize work, but a label alone does not determine decision. Exposure, exploitability context, affected asset, compensating controls, verification confidence, and owner matter. OWASP materials are influential practitioner guidance, not law or a universal security standard.[^owasp-top10] Use them to prompt questions, then document the evidence for the actual system boundary.

Residual risk is the unresolved exposure that remains after a decision or mitigation. It is not a euphemism for ignoring an issue. It should name the unverified boundary, limitation, owner, and reassessment trigger.

## Building a Defensive Threat Evidence Model

The threat evidence model is a structured way to connect a relevant asset to a safe verification question. It is deliberately smaller than an enterprise threat-management program. Start from a journey that matters and work outward only as far as the decision requires.

### Identify Assets and Undesired Outcomes

An asset can be data, authority, state, availability, or evidence. Atlas examples include customer order data, refund authority, account-recovery state, payment outcome, support permissions, queue event provenance, and diagnostic records. An undesired outcome describes what must not happen at the stated boundary: disclosure to an unauthorized actor, unauthorized state change, uncontrolled excessive request acceptance, unbounded retry, or unsafe diagnostic exposure.

| Asset | Undesired outcome | Contextual consequence |
| --- | --- | --- |
| Customer order | Another customer receives order data | Confidentiality and trust consequence |
| Refund authority | Support role initiates unauthorized refund | Financial/state-integrity consequence |
| Recovery flow | Legitimate user cannot recover during a spike | Availability and customer-support consequence |
| Payment state | Timeout results in unsafe duplicate or unknown action | Integrity and reconciliation consequence |
| Service account | Unbounded actor changes an unrelated order state | Authorization and audit consequence |
| Diagnostic event | Sensitive value is retained or exposed unnecessarily | Privacy/security evidence consequence |

### Identify Actors and Trust Changes

Actors should be more precise than “user” and “attacker.” The anonymous shopper has a different expected boundary from the authenticated customer. A support operator may need read access without refund authority. A fulfilment service account may process a valid event without becoming a general system administrator. A third-party payment dependency is not simply trusted or untrusted; it has an interface, contract, timeout, error, data, and state boundary.

Trust changes when the system accepts an identity, interprets a role, resolves ownership, accepts external data, reads configuration, processes a queue event, or emits diagnostic information. A boundary map need not draw every internal call. It must show enough to locate the verification question and limitation.

### Convert the Model to Questions

Use verbs that a defensive verification can answer. “Is the API secure?” cannot be completed. “For the synthetic customer-to-order boundary, is a request for a different customer's order denied and is no order data returned?” is observable. “For the support-refund boundary, is the stated role denied the action and is state unchanged?” is observable. “For the payment-timeout boundary, is an unknown state bounded and routed to reconciliation rather than silently repeated?” is observable.

| Asset/actor/boundary | Bounded quality claim | Evidence method | Limitation |
| --- | --- | --- |
| Customer, other customer's order, order API | Ownership is enforced for stated route/resource/action | Synthetic allow/deny matrix and returned-data observation | Other routes and state variants remain outside scope |
| Support operator, refund action, support API | Support role cannot initiate refund in stated state | Synthetic role/action/state verification and state record | Does not cover all support roles or API versions |
| Service account, fulfilment event, queue consumer | Valid event provenance is required for stated transition | Synthetic event and resulting state observation | Does not prove every event source or retry path |
| Anonymous request, recovery endpoint | Protective control responds proportionately to excessive pattern | Bounded rate-limit/control evidence | Does not estimate production abuse or legitimate-user accessibility |

### Record What the Model Cannot Cover

Coverage limitations are not a reason to avoid creating the model. They are why the model is useful. Explicitly record untested roles, routes, states, clients, dependencies, configuration paths, or measurement gaps. Then decide whether the gap is material to the current decision, needs a follow-up, or can be accepted by the accountable owner as residual risk.

## Threat Assumptions and Quality Consequences

Threat assumptions should connect to quality consequences, not merely a label. Consider account recovery under an excessive-request pattern. The defensive benefit may be reduced acceptance of repeated attempts. The quality cost may be greater latency or rejection for legitimate customers. The system boundary may also include identity dependency capacity, cache/session behavior, diagnostic privacy, support escalation, and retry. Chapter 11 uses such interactions for explicit trade-off reasoning.

The model remains defensive. It does not require demonstrating how a control might be bypassed, discovering live targets, or constructing payloads. A synthetic denied/allowed test, state observation, configuration review, or evidence-gap record is often enough to support the learning objective.

## Prioritizing Boundaries Without Becoming a Risk Program

Not every Atlas boundary deserves the same depth in one exercise. Prioritize according to the asset, reachable actor, action consequence, change under review, and available evidence. This is engineering prioritization, not a formal enterprise risk score.

| Priority cue | Example | Proportionate response |
| --- | --- | --- |
| High-consequence state transition | Support refund action changes financial order state | Verify actor, role, action, state, route, result, and remediation evidence first |
| Broadly reachable customer boundary | Customer/order API ownership check | Use representative ownership allow/deny cases and record route/state gaps |
| Changed dependency or configuration | Payment partner contract or cache scope changes | Refresh assumptions and trust evidence before reusing old result |
| Excessive-request condition | Account recovery receives a synthetic spike | Compare protective-control outcome with legitimate-user consequence |
| Low-consequence diagnostic detail | Non-sensitive internal label in synthetic event | Verify need and access boundary proportionately; avoid treating it as a release blocker by default |

Prioritization should be explainable. “We tested the refund path first because a support role changing financial state is a high-consequence authorization boundary” is more useful than “the scanner scored it high.” If the evidence later shows that the route is not reachable in the candidate, record that fact and revise the scope rather than hiding the original assumption.

### Threat Evidence and Change

Every material change can alter a threat evidence boundary. A new API method can create a new action/resource combination. A cache adjustment can change who sees a view and when it becomes stale. A retry policy can change the number of attempts, queue events, or unknown states. A new diagnostic field can change the sensitive-information boundary. The model should therefore have a revision trigger tied to the change inventory.

| Change | Evidence that may become stale | Refresh question |
| --- | --- | --- |
| New support API route | Existing role/action matrix | Does the route enforce the same role/resource/state decision? |
| Cache-key or scope update | Prior ownership/view evidence | Does a role or ownership change leave stale data/action? |
| Recovery rate-limit adjustment | Previous legitimate/excessive population result | Does changed policy preserve intended control and user path? |
| Dependency version/configuration | Prior trust/timeout evidence | Does receiving boundary still handle stated response/failure categories? |
| Queue consumer change | Service-account/state-transition record | Does event provenance and authorization remain bounded? |

This approach avoids treating a passing security check as permanent proof. It also avoids repeating every verification without reason: the revision trigger identifies the evidence that is likely to have changed meaning.

### Communicating the Model to Partners

A threat evidence model must be readable by partners who own implementation or decisions. Avoid unexplained labels such as “high risk” without asset, boundary, exposure, and limitation. A concise communication can say: *The synthetic support role can initiate a refund through route X in order state Y. The evidence is reproducible for this route; other routes remain unassessed. The application owner should remediate and the release owner should decide whether the unverified scope permits rollout.*

This communication is neither a legal finding nor a penetration-testing report. It is a bounded engineering record that supports the next proportionate action.

## Model Review Checklist

Before using the model, confirm that each important row has an asset, actor, action, state, trust boundary, defensive question, evidence source, limitation, owner, and revision trigger. A row without a limitation may be overclaiming; a row without an action/state may be too vague to verify; a row without an owner may identify risk without a path to action.

## Worked Boundary Prioritisation: Account Recovery

Consider an illustrative account-recovery journey. A person requests recovery, receives a one-time recovery step through an approved channel, establishes a new credential, and then reaches a signed-in session. The journey crosses a public-input boundary, an identity-service boundary, a notification dependency, a session-establishment boundary, and an audit boundary. A useful model does not assume that any one component is “the security system.” It records the protection and evidence expected at each transition.

The public-input boundary needs a defined request shape, resource controls, and observables that distinguish normal recovery demand from a surge or a repeated invalid attempt. The identity boundary needs evidence that the requested action is tied to the correct account and that policy changes are consistently enforced. The notification dependency needs a clear contract for availability, timeout behaviour, and what is recorded without exposing sensitive recovery material. The session boundary needs evidence that successful completion produces the intended scope and that later authorisation decisions do not rely on an unverified client assertion.

Prioritisation follows consequence and uncertainty. If a recovery decision could grant access to a protected account, the team should first ask which trust assertion, configuration, or dependency failure would make that consequence possible, which controls constrain it, and how those controls are independently evidenced. The result may be a targeted review of policy enforcement, a role/state matrix, a configuration-change check, and runtime signals that reveal unusual recovery outcomes. It is not a request to simulate unauthorised access or to publish attack instructions.

This framing also makes residual risk intelligible. A team might have strong evidence for the normal recovery path but incomplete confidence about notification delay during a regional disruption. The record can recommend a bounded release with an owner, a monitoring condition, and a follow-up validation rather than hiding the uncertainty in a broad “secure” claim.

## Asset Classification and Evidence Handling

Asset labels should help people make safe decisions, not merely populate a template. For each information asset or service capability, record the value it provides, the people or systems that rely on it, the boundary where its trust changes, and the consequences of incorrect disclosure, modification, unavailability, or loss of accountability. These are quality consequences. They guide what evidence must be retained and what should never be copied into a test artefact.

Use synthetic identifiers and deliberately non-sensitive values in examples, logs, and review packets. If a production-like record is needed to understand a data shape, reduce and protect it through the organisation's approved process; do not add it to a handbook exercise or a broadly shared evidence archive. Evidence is only useful when it is both interpretable and appropriately handled.

A model review is complete enough for the current decision when it identifies the important asset and boundary, the stated assumption, the expected control or behaviour, the evidence source, its limitation, and the accountable owner. It need not be a complete organisational threat catalogue. Precision about the scope is what makes the model defensible and keeps a quality-engineering activity aligned with the wider security governance process.

## Boundary-Change Review

Revisit the model when a change adds an interface, changes an identity or authorisation decision, alters a dependency, expands the data flow, or changes how configuration reaches a running service. The review starts with the existing boundary assumptions: which ones remain true, which are newly uncertain, and which evidence records no longer apply. This is more reliable than treating threat modelling as a ceremonial activity at the beginning of a project.

For each changed boundary, identify the normal and failure-state behaviour. A dependency timeout, unavailable identity assertion, stale configuration, or queued asynchronous action can change the trust decision as much as a new endpoint can. The evidence should demonstrate the intended safe outcome and the visibility of unexpected outcomes, while avoiding unnecessary sensitive detail.

Prioritise the review by user and system consequence, not by the apparent complexity of a diagram. A small privilege transition may deserve more careful evidence than a large low-impact data flow. The question is always: what valuable asset or decision relies on this boundary, and what would an incorrect outcome mean for the defined population?

The review should deliberately consider failure as well as success. If a control cannot obtain a dependency assertion, if policy configuration is unavailable, or if an asynchronous message is delayed, the designed outcome must remain bounded and visible. This is where security quality connects directly to reliability: ambiguous or unobservable failure handling prevents a team from proving that a protective decision persisted under realistic operating conditions.

Documenting this does not turn a quality chapter into a complete incident-response plan. It establishes the narrow, decision-relevant evidence needed to show that important trust-boundary assumptions have been considered and assigned to the people who own their resolution.

The resulting record remains useful when architecture, ownership, or operational conditions later change because its assumptions are explicit rather than embedded in a diagram alone.

## Engineering Perspective

The Security Quality and Threat Evidence Model should be small enough to use. Start with the critical journey, asset, actor, and boundary. Link each assumption to a verification question and each result to a limitation. This gives Chapter 8 a defensible basis for identity and authorization evidence rather than an inventory of generic controls.

## Industry Perspective

NIST CSF 2.0 frames risk management through outcomes and context; it does not prescribe a particular threat-model diagram or verification product.[^nist-csf] This supports an engineering approach in which evidence is proportional to asset and decision context.

## Common Misconceptions and Pitfalls

### “Authentication proves authorization.”

Authentication establishes an identity claim at one boundary. It does not establish that the identity may perform a particular action on a particular resource and state.

### “A threat model is an exploit catalogue.”

For Quality Engineering, it is a bounded reasoning artifact that guides safe verification and communicates assumptions and gaps.

### “No findings means no risk.”

It may mean no findings within the available scope and method. Coverage limits belong in the evidence record.

## QA → QE Transition

The transition is from collecting a vulnerability list to modelling a bounded security claim and choosing evidence proportionate to asset, actor, threat, and consequence.

## Summary

Security quality starts with assets and trust boundaries. Threat assumptions identify defensive verification questions, while findings require context and validation. A useful record makes limitations, ownership, and residual risk visible.

## Key Takeaways

- Assets, actors, actions, states, and trust boundaries make security claims testable.
- A plausible threat and a verified vulnerability are different kinds of evidence.
- Safe verification can establish a bounded denial or allow outcome without offensive instruction.
- Residual risk should be explicit, owned, and revisited when relevant conditions change.

## Review Questions

1. What makes a trust boundary useful for Quality Engineering?
2. How does an access-control verification differ from a broad security claim?
3. Why is a severity label insufficient for a decision?
4. What should a residual-risk record contain?

## Interview Questions

1. How would you begin a security-quality assessment of a new API?
2. How do you test authorization safely without attempting to bypass controls?
3. How do you explain coverage limitations after a security test pass?

## Practical Exercise

Create a **Security Quality and Threat Evidence Model** for the Atlas refund/support path. List assets, actors, trust boundaries, misuse assumptions, defensive verification questions, evidence sources, limitations, owner, residual risk, and revision trigger.

## Further Reading

- [NIST Cybersecurity Framework 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20)
- [OWASP Top 10](https://owasp.org/Top10/)

## References

[^nist-csf]: National Institute of Standards and Technology. [NIST Cybersecurity Framework (CSF) 2.0](https://www.nist.gov/publications/nist-cybersecurity-framework-csf-20). 2024. Accessed 2026-08-12.
[^owasp-top10]: OWASP Foundation. [OWASP Top 10](https://owasp.org/Top10/). 2025. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can identify assets, actors, trust boundaries, and misuse assumptions.
- [ ] I can formulate a defensive verification question without creating an exploit procedure.
- [ ] I can distinguish a threat, finding, limitation, and residual risk.
- [ ] I can create a security quality and threat evidence model.

## Chapter Navigation

Previous: [Chapter 6 — Performance Regression and Production-Evidence Handoff](chapter-06-performance-regression-and-production-evidence-handoff.md) · Next: [Chapter 8 — Authentication, Authorization, Sessions, and API Boundaries](chapter-08-authentication-authorization-sessions-and-api-boundaries.md)
