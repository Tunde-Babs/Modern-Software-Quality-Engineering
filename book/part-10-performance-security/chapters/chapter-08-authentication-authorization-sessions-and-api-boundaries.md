# Chapter 8 — Authentication, Authorization, Sessions, and API Boundaries

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 8 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2 and 7; Part IV recommended |
| Estimated study time | 210 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A valid identity is evidence of authentication. It is not evidence that a requested action is authorized.

## Opening Story

The following is an **illustrative scenario**. Atlas Support lets an operator locate an order for customer assistance. The operator is authenticated and can view selected order details. A later API change uses the same session to call a refund endpoint. The endpoint returns success in one synthetic case, even though the support role is not permitted to initiate a refund. A cached account view also continues to display an action after the operator's role changes.

The problem is not “login failed.” It is an access-control boundary problem: actor, resource, action, state, route, and cache behaviour need evidence. This chapter develops that evidence without teaching credential bypass or token-forgery procedures.

## Why This Chapter Matters

Identity and access controls are common sources of material quality risk because application behaviour often crosses browser, API, session, cache, service, and dependency boundaries. A login test may be correct and still leave object-, function-, or property-level authorization unverified.

This chapter applies Part IV interface thinking to identity and access evidence. It does not teach identity-provider configuration, cryptographic implementation, or provider-specific SDKs.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish authentication, authorization, session state, and machine identity;
- model least privilege, default-deny, resource ownership, and action/state boundaries;
- create a safe authorization matrix for synthetic actors and resources;
- assess session, token, cache, and API evidence limits; and
- produce an Identity and Access-Control Evidence Matrix.

## Authentication Is Not Authorization

**Authentication** establishes an identity claim for a stated boundary. **Authorization** decides whether that identity may perform an action on a resource in a context and state. A valid session can therefore support a successful authentication result while a request is correctly denied. Conversely, a valid session plus a successful request may reveal an authorization defect if the actor, action, or ownership rule is violated.

**Least privilege** means granting only the access needed for the stated role and task. **Default deny** means an action is denied unless an explicit policy permits it. These are design and verification principles, not guarantees that a single route is correct. The evidence boundary must identify actor, resource, action, state, request path, expected outcome, and limitation.

## An Authorization Evidence Matrix

The following matrix uses synthetic Atlas actors and data. It is an evidence-planning artifact, not a policy specification for a real organization.

| Actor | Resource/action | State | Expected outcome | Evidence to collect |
| --- | --- | --- | --- | --- |
| Anonymous shopper | View another customer's order | Any | Denied | API response category, no order disclosure, audit/event evidence where available |
| Authenticated customer | View own order | Confirmed order | Allowed | Correct resource returned, ownership context recorded |
| Authenticated customer | Initiate refund for another customer's order | Any | Denied | Denial outcome and unchanged state |
| Support operator | View permitted order details | Eligible support state | Allowed | Minimum necessary fields and recorded role context |
| Support operator | Initiate refund | Any | Denied | Denial outcome through the stated API and UI boundary |
| Fulfilment service account | Update fulfilment state | Valid queued event | Allowed only for stated transition | Service identity, event provenance, resulting state |

The matrix deliberately includes allow and deny outcomes. A suite that only demonstrates successful paths cannot establish least privilege. It also separates object ownership from function access: an actor might be permitted to call a refund route in one role but not for every order or transition.

## Sessions, Tokens, and State Boundaries

A **session** represents an authenticated context whose lifecycle may include creation, expiry, revocation, renewal, or invalidation. A **token** is a credential artifact used at a boundary; its presence does not define the application's authorization decision. Avoid treating a session check as a substitute for resource-level authorization.

For evidence purposes, state the session or token boundary without documenting ways to defeat it. Examples include a synthetic expired-session request expected to be denied, a role-change case expected to remove an action, or a session-revocation case expected to prevent a further sensitive operation. NIST SP 800-63-4 provides identity guidance; it is not a universal application authorization model.[^nist-800-63]

Cache behaviour deserves the same discipline. A performance optimization may cache an account or order view, but authorization-sensitive data must not be reused across actors or remain actionable after a relevant role or state change. The question is not whether caching is good or bad; it is what the cache key, scope, invalidation, and evidence boundary permit.

## Worked Reasoning: Support Refund Matrix

The following is an **illustrative, synthetic verification**. A support operator is authenticated, views an order, then attempts the refund action through the stated UI/API boundary. The expected result is denial with no refund state transition. A customer owner may view the same order but cannot view another customer's order. A service account processes a valid queue event but cannot call the support UI route.

| Field | Evidence-led record |
| --- | --- |
| Fact | The support actor receives a deny outcome for refund initiation; the order remains unchanged. |
| Quality claim | The support role may view permitted data but cannot initiate refunds for the stated order state. |
| Evidence | Synthetic identity, role/action matrix, response outcome, state observation, and cache-state check. |
| Interpretation | The tested route enforces the expected action boundary. |
| Limitation | The result does not establish all roles, resource IDs, API versions, cache nodes, or production identity configuration. |
| Risk | A different route or stale cache could produce inconsistent authorization. |
| Decision consequence | Expand matrix coverage for relevant roles and state transitions; investigate any inconsistent path. |
| Owner/residual risk | Application and identity owners address differences; untested path coverage remains residual risk. |

## API and Machine-Identity Boundaries

APIs make boundaries explicit through methods, resources, fields, and status outcomes, but a status code alone may not show that the correct resource-level check occurred. Verify the behaviour and resulting state for the defined actor. For machine actors, include service identity, allowed event or resource, provenance, scope, and retry/state semantics. A queue consumer that receives a valid event should not become a general-purpose authority for unrelated actions.

## Designing Coverage Across Roles, Resources, Actions, and States

An access-control matrix becomes more useful when it exposes the dimensions that application tests often collapse. The same resource can have different rules for different actions. The same action can differ by resource ownership or lifecycle state. A refund request for an order that is pending payment may need a different rule from one for a fulfilled order. A support role may view masked information but not export it. A service account may update a fulfilment state only after a valid event is processed.

Use the following dimensions deliberately:

| Dimension | Question |
| --- | --- |
| Actor | Which human or machine identity is acting? |
| Authentication/session state | Is the context anonymous, valid, expired, revoked, changed, or otherwise bounded? |
| Resource | Which account, order, refund, configuration, event, or field is requested? |
| Ownership/scope | Does the actor own or have delegated scope for this resource? |
| Action | View, create, update, refund, export, transition, or administer? |
| Lifecycle state | Is the order pending, paid, fulfilled, cancelled, or otherwise constrained? |
| Route/boundary | Does UI, API, cache, queue, or service path produce the same intended rule? |
| Expected effect | Denial, allowed view, allowed state transition, or bounded error without disclosure? |

This is not an instruction to generate every mathematical combination. Prioritize the combinations with material asset, trust, and change relevance. Record why a row is selected and which combinations remain outside the evidence.

### State Changes Matter

An authorization decision is more than a response code. If a denied refund request returns an error but changes refund state, creates a queue event, or exposes a side effect, the boundary is not behaving as claimed. Conversely, an allowed request should be checked for the intended limited effect, not merely a success status. For Atlas, a valid support view may return a masked order record; a denied refund action should preserve the existing order state and avoid creating an authoritative refund event.

| Expected result | Evidence to preserve | Interpretation limit |
| --- | --- | --- |
| Denied request | Response category, no sensitive record, unchanged state, no unauthorized event | Does not prove denial across every route or cache node |
| Allowed view | Minimum necessary data, correct resource ownership, role context | Does not establish permission for write or export actions |
| Allowed transition | Authorized actor, valid prior state, resulting state and provenance | Does not establish all retry or concurrent-action behavior |
| Expired/revoked context | Bounded denial and no state change | Does not prove identity-provider configuration in all environments |

### Session and Role-Change Evidence

Session lifecycle creates a time dimension. A role may change, a session may expire, a token may be revoked, or a cache may retain an earlier view. The manuscript does not prescribe implementation mechanisms; it requires a testable evidence question. For example: *After a synthetic support role is removed, can the prior session or cached view still initiate the stated refund action?* A result should name the session/cache boundary, window, route, expected denial, resulting state, and limitation.

This is especially important for performance/security integration. A cache restriction can reduce stale authorization risk but change latency, throughput, or dependency work. A stronger identity check can improve an authentication boundary but add user friction or dependency capacity demand. Chapter 11 treats these as explicit trade-offs rather than assuming controls have no performance consequence.

## Evidence Matrix Maintenance

An evidence matrix should be versioned like any other decision artifact. Refresh it when a role, action, state, route, cache key/scope, session behavior, API version, service identity, or policy changes. A passing row can become stale. State this openly instead of representing an old result as continuing coverage.

The matrix also helps organize regression control. A verified authorization issue becomes a named row with the synthetic actor, resource, action, state, expected outcome, evidence source, owner, and revision trigger. This is more useful than relying on a vague statement that “access control was tested.”

## Worked Matrix Review: Order Support and Fulfilment

The following is an **illustrative review sequence** for three related Atlas boundaries. It demonstrates how an evidence matrix can reveal a missing dimension without trying to provide an exhaustive authorization test plan.

### Customer Order Access

The claim is that a customer may view their own order but not another customer's order. A valid check needs two synthetic orders with distinct ownership, one synthetic authenticated customer, stated API route, response/data observation, and resulting audit or event evidence where available. The expected denial must not return the other customer's order fields. A result that simply receives a denial status without checking disclosure is incomplete.

| Field | Own-order case | Other-order case |
| --- | --- | --- |
| Actor | Authenticated Customer A | Authenticated Customer A |
| Resource | Order A | Order B, owned by Customer B |
| Action/state | View confirmed order | View confirmed order |
| Expected outcome | Allowed, scoped order data | Denied, no Order B data |
| Evidence | Response/data boundary and ownership context | Denial plus no-data/state observation |
| Limitation | Does not cover export, refund, or every client route | Does not cover all identifiers, cache nodes, or service paths |

The two rows are paired. A suite with only the own-order case shows that a permitted journey works; it does not show that ownership is enforced.

### Support Role and Financial State

The support actor may need an allowed view while being denied a financial action. The test should also consider state. For example, a support operator may view a paid order to answer a customer question but must not initiate a refund through the stated support route. If a refund policy later permits a specialized finance role, that is a new actor/action/state row—not a reason to treat all support identities as equivalent.

The matrix should preserve the actor's expected minimum data view, route, state, denied action, resulting order state, and any queue/event side effect. This guards against a narrow implementation that denies the UI action while an API route, cached action, or asynchronous event remains inconsistent.

### Service Identity and Event Provenance

Machine identities introduce a different boundary. The evidence claim is not “the service account can call the API.” It is that the stated service identity can process a valid, provenance-bound fulfilment event and perform only the permitted transition. The record should specify event source/category, order state before/after, retry/unknown-state handling, and the action that must remain denied.

| Machine-identity question | Evidence to collect | Limit to state |
| --- | --- | --- |
| Is the stated fulfilment event accepted? | Synthetic valid event, service identity, resulting permitted state | Does not prove all event sources/configurations |
| Is unrelated order update denied? | Synthetic attempt/result and unchanged state | Does not prove every route or service account |
| Are retries bounded? | Attempt classification, queue/state record | Does not establish dependency behaviour outside profile |
| Does unknown state remain reconcilable? | Terminal-state/reconciliation evidence | Does not prove every downstream workflow |

The example remains defensive because it examines expected boundary behavior with synthetic identities and data. It does not instruct readers how to acquire or misuse credentials.

## Selecting Matrix Coverage

An evidence matrix can grow rapidly. Select rows based on consequence, change, and boundary diversity. Start with high-consequence actions, ownership boundaries, newly changed routes, identity/session transitions, cache-sensitive views, and machine actions. Then record the rows left outside the current scope.

| Selection principle | Example |
| --- | --- |
| Consequence | Refund initiation merits stronger state and ownership evidence than a low-impact display preference. |
| Change | A new cache key or session policy makes prior view/role evidence potentially stale. |
| Boundary diversity | One UI check does not establish corresponding API or queue-consumer behavior. |
| Actor diversity | Customer, support, finance, and service account can have different permitted scopes. |
| Lifecycle relevance | Pending, paid, fulfilled, and cancelled order states can alter rules. |

This prioritization supports disciplined review without pretending that the chapter has produced a complete access-control certification.

## Identity Evidence and Decision Consequence

When a matrix row fails, write a bounded conclusion. For example: *In build `b151`, the synthetic support role successfully initiated a refund through route R for a paid order; this contradicts the stated action boundary for that route and state. Other routes remain unassessed.* The evidence may justify remediation before release, a narrowed feature scope, or escalation to the relevant owner. It does not establish total exposure without additional evidence.

When a row passes, the conclusion is equally bounded: *The tested route denied the synthetic role and preserved state under the stated configuration.* The record should identify whether a cache, role change, API version, or service path could make the result stale.

## Authorization Evidence Review Checklist

Before interpreting an access-control result, check actor identity, session state, resource ownership, action, lifecycle state, route, expected data/state effect, cache/service boundary, synthetic evidence provenance, limitation, owner, and revision trigger. This prevents a status code or login result from carrying a broader claim than the method supports.

## Boundary Consistency Across Interfaces

The same authorization claim can be reached through more than one interface: browser interaction, public API, internal service endpoint, cached view, queue consumer, or support workflow. A system may correctly deny an action in one interface while another interface uses an inconsistent ownership or state check. The purpose of coverage is not to enumerate every implementation detail; it is to identify materially different paths that could make a previously passing result incomplete.

| Interface | Consistency question | Evidence limitation |
| --- | --- | --- |
| Browser/UI | Does the displayed action align with backend permission and state? | Hidden UI behavior does not prove API decision |
| Public API | Does route/action/resource enforce the stated actor/ownership rule? | Does not cover internal service path |
| Cached view | Does view/action remain appropriately scoped after role/ownership change? | Cache timing/nodes may vary |
| Queue consumer | Does service identity process only valid, authorized event transition? | Does not prove all message sources/retries |
| Support workflow | Do support permissions match UI/API and resulting order state? | Does not cover every support role/policy exception |

When two interfaces should enforce the same decision, write the expectation explicitly. When they intentionally differ, explain why. Otherwise a difference can be mistaken for either a defect or a feature after the fact.

## Session Lifecycle Evidence

Sessions and tokens have lifecycle conditions that affect authorization evidence. A test can use synthetic states such as valid, expired, revoked, changed-role, or missing context. The reader need not know how a provider implements those states to assess application behavior at the boundary.

| Synthetic session condition | Bounded verification | Expected outcome |
| --- | --- | --- |
| Valid customer context | View owned order | Allowed only for correct ownership and stated data scope |
| Expired context | Sensitive order/refund request | Denied without state change or sensitive disclosure |
| Role removed | Prior support refund action | Denied through stated route; cached action not reused |
| Service identity outside scope | Unrelated order transition | Denied or rejected according to stated event/role boundary |
| Unknown/invalid context | API request | Bounded error and no unauthorized action |

The evidence should state the synthetic fixture and configuration version. A passing expired-session check does not prove every session implementation property; it establishes one behavior for one boundary. This distinction allows the Quality Engineer to identify a meaningful regression when a session, cache, or authorization-policy change occurs.

## Least Privilege as an Evidence Claim

Least privilege is often stated as a principle without an observable claim. Make it specific: *For the stated support role, only the minimum order fields required for customer assistance are visible, and refund initiation is denied.* The claim has both a positive and a negative boundary. An overly broad response may disclose unnecessary information; an overly strict response may prevent an intended support action. Both require evidence.

| Least-privilege question | Evidence needed |
| --- | --- |
| Is intended data visible? | Scoped response/content observation for permitted action |
| Is unrelated sensitive data absent? | Field-level boundary review for stated role/context |
| Is unauthorized action denied? | Actor/resource/action/state outcome and unchanged state |
| Is system action appropriately scoped? | Service identity/event provenance and allowed transition evidence |
| Does change reopen evidence? | Versioned role, route, cache, session, or policy revision trigger |

This is not a request to create a provider-specific role system. It is a way to make the quality of an existing authorization boundary testable and decision-ready.

## Authorization Changes and Evidence Decay

Authorization evidence can decay without any change to the named endpoint. A new role, a delegated administrative action, a background worker, a configuration flag, a changed default, or a cache-policy adjustment can alter which decision is actually enforced. Treat the matrix as a living model of policy-relevant combinations, not a one-time set of assertions. For every material policy change, identify the affected role, resource, action, state, interface, and enforcement point; then decide which matrix rows must be revisited.

Evidence should show both allowed and denied outcomes, but neither outcome alone proves the policy is consistently enforced. An allowed action must correspond to the intended resource and state, not merely return a successful technical response. A denied action must be denied at the relevant boundary without disclosing unnecessary detail or causing an unintended state change. When the action is asynchronous, the review must follow the request through to the worker or downstream service that performs it.

This is also a performance concern. A policy decision that is correct but unexpectedly expensive can create pressure to introduce unsafe caching or bypasses. Record its normal and degraded dependency behaviour, cache scope, invalidation condition, and observability. The goal is not to optimise away a control; it is to design and verify a control whose enforcement remains explicit as the system evolves.

When an evidence gap remains, state it in the matrix. For example, an administrative state transition may be covered for a browser route but not yet for a machine interface. Naming the gap, owner, and boundary is stronger than marking the entire policy “verified” on the basis of a nearby test.

Session-state evidence should make expiration, renewal, sign-out, and privilege change visible without recording credential material. The expected result after a state transition matters as much as the initial sign-in result. A review that checks only the happy-path session may miss an inconsistent enforcement boundary after a policy or role changes.

For interfaces that expose the same capability, compare the policy outcome rather than assuming shared implementation implies shared enforcement. A browser route, API, worker, and support interface may reach different decision points; a concise cross-interface matrix makes that difference reviewable.

Where policy is intentionally different, state the reason and owner. An unexplained difference is an evidence gap, not a design conclusion.

This simple distinction prevents a future implementation shortcut from being mistaken for an approved access rule.

## Engineering Perspective

Keep identity evidence matrices versioned with role rules, resource states, routes, and cache assumptions. When a new API method, role, session rule, cache policy, or service actor is introduced, treat the existing evidence as potentially incomplete rather than assuming it covers the change.

## Industry Perspective

OWASP ASVS provides a widely used verification framework that can inform coverage questions around authentication and access control; it is an open verification standard, not a legal requirement or proof of system security.[^owasp-asvs] RFC 9700 provides OAuth security best-current-practice guidance where OAuth semantics are relevant; it does not replace application authorization decisions.[^rfc-9700]

## Common Misconceptions and Pitfalls

### “The user is logged in, so the request should be allowed.”

Authentication and authorization answer different questions. Access depends on role, ownership, action, state, and boundary.

### “A 403 response proves the whole access model.”

It supports a narrow observation. Confirm the actor, resource, action, state, resulting data/state, and routes that remain outside the check.

### “Caching and authorization are unrelated.”

Cache scope and invalidation can affect who sees data or actions after identity and state change.

## QA → QE Transition

The transition is from checking login success and one role path to designing an evidence matrix across actors, resources, actions, states, cache conditions, and denial behaviour.

## Summary

Authentication establishes an identity context; authorization determines what that context may do. Evidence must cover actor, resource, action, state, boundary, outcome, and limitation. Matrices make access-control assumptions inspectable and reusable.

## Key Takeaways

- Successful authentication does not establish authorized action.
- Allow and deny cases are both required evidence for least privilege.
- Sessions, tokens, APIs, caches, and service identities have distinct boundaries.
- Version the matrix when roles, routes, state transitions, or cache policy change.

## Review Questions

1. What fields make an authorization check decision-ready?
2. Why is resource ownership different from route access?
3. How can a cache create an authorization-sensitive boundary?
4. What should be recorded for a machine-identity verification?

## Interview Questions

1. How would you test that an authenticated user cannot access another customer's data?
2. What is the difference between authentication and authorization?
3. How do you validate an API access-control control without a bypass procedure?

## Practical Exercise

Create an **Identity and Access-Control Evidence Matrix** for Atlas browse, order, support, refund, and fulfilment journeys. Include synthetic actors, allowed and denied actions, resource ownership, state, evidence, limitation, owner, and revision trigger.

## Further Reading

- [NIST SP 800-63-4 Digital Identity Guidelines](https://www.nist.gov/publications/nist-sp-800-63-4-digital-identity-guidelines)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)
- [RFC 9700: OAuth 2.0 Security Best Current Practice](https://datatracker.ietf.org/doc/html/rfc9700)

## References

[^nist-800-63]: National Institute of Standards and Technology. [NIST SP 800-63-4: Digital Identity Guidelines](https://www.nist.gov/publications/nist-sp-800-63-4-digital-identity-guidelines). 2025. Accessed 2026-08-12.
[^owasp-asvs]: OWASP Foundation. [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/). Accessed 2026-08-12.
[^rfc-9700]: Lodderstedt, T., et al. [Best Current Practice for OAuth 2.0 Security](https://datatracker.ietf.org/doc/html/rfc9700). RFC 9700, 2025. Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can distinguish authentication, authorization, and session evidence.
- [ ] I can create an access-control matrix with allow and deny cases.
- [ ] I can state cache and API boundaries relevant to authorization.
- [ ] I can record limitations and residual risk without teaching a bypass.

## Chapter Navigation

Previous: [Chapter 7 — Security Quality: Assets, Trust Boundaries, and Threat Models](chapter-07-security-quality-assets-trust-boundaries-and-threat-models.md) · Next: [Chapter 9 — Input, Output, Dependencies, Secrets, and Configuration Trust](chapter-09-input-output-dependencies-secrets-and-configuration-trust.md)
