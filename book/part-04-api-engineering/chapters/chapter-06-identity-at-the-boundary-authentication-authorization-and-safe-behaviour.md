# Chapter 6 — Identity at the API Boundary: Authentication, Authorization, and Safe Behaviour

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 6 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–5 and familiarity with HTTP request and response semantics |
| Estimated study time | 175 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Access behaviour is correct only when the right caller can perform the intended action on the intended resource, while other callers receive a safe, interpretable outcome with no unintended effect.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. A support agent searches for an order by its identifier and can see the delivery address, payment status, and cancellation controls. A customer uses the same identifier in a mobile application. The API returns the order details even though the order belongs to another customer.

The request is authenticated. The token is valid. The response has a correct media type and contains a structurally valid order. The failure is that the API treated a valid credential as sufficient permission to observe a resource. In a second incident, a fulfilment service correctly reads an order but can also use its service identity to issue a customer refund. The problem is not simply that one role is misconfigured. The API has not made identity, ownership, permitted actions, visible data, and safe failure behaviour sufficiently explicit or observable.

A Quality Engineer frames the questions defensively: who or what is acting, in which tenant or organisational context, on which resource, for which action, under which state, and with which result? Just as importantly: what must not be disclosed or changed if the answer is no?

## Introduction

Identity and access behaviour are API-quality concerns because the same endpoint can legitimately produce different results for different callers. A request that is valid in structure and business meaning can still be rejected because its credential is missing, invalid, expired, unauthenticated, outside a required scope, unrelated to the resource owner, or not permitted to perform the selected action.

This chapter distinguishes **authentication** from **authorization**, then applies that distinction to resources, operations, fields, tenants, errors, side effects, and evidence. It is deliberately not an OAuth implementation guide, token-creation tutorial, identity-provider administration guide, penetration-testing manual, cryptography chapter, or complete security-assessment method. Part X owns deeper security engineering.

The goal is to give Quality Engineers enough vocabulary and judgement to make access rules testable as API behaviour, identify high-risk combinations, and state where security specialists, identity owners, or architecture owners must contribute. Chapter 5 asked whether the API data is trustworthy. This chapter asks whether a caller may observe or change that data at all.

## Why This Chapter Matters

Access-control defects can expose sensitive data, allow harmful state changes, create unauthorised side effects, or deny legitimate customer work. They can also be difficult to see when a team checks only one successful request and one generic failure response. An “admin” test and a “user” test do not establish whether ownership, tenant isolation, scopes, workflow state, operation type, or field-level visibility behave safely.

API access behaviour also affects usability and operations. A caller needs enough information to correct an expired credential, seek the right permission, or understand that an operation is unavailable. At the same time, an error must not reveal a resource, policy, identifier, or internal implementation detail to an unauthorised party. These are contract and evidence decisions, not merely status-code selections.

Quality Engineering helps a team make the rules inspectable. It connects protected customer outcomes to an identity context, a resource, an action, the expected observation, relevant side-effect constraints, evidence, and residual uncertainty. It does not claim that selected authorization evidence proves an entire identity system is secure.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish authentication from authorization without assuming every identity represents a human user;
- identify anonymous, missing, malformed, invalid, expired, and valid credential contexts as observable API conditions;
- reason about role, scope, permission, resource ownership, tenant, attribute, and workflow-state access conditions;
- identify horizontal and vertical authorization risks using defensive, evidence-oriented language;
- distinguish access to a resource from access to every field or operation on that resource;
- interpret 401, 403, and 404 responses contextually rather than as a universal access-control taxonomy;
- assess safe error behaviour, information-disclosure risk, and denied-request side-effect expectations;
- build an API Access Evidence Matrix for a risk-relevant set of caller/resource/action combinations; and
- explain why access-control checks are useful security evidence but not a complete security assessment.

## Identity Is Part of API Behaviour

An API boundary does not receive an abstract “authenticated user.” It receives a request in some **identity context**: perhaps an anonymous caller, customer account, support agent, service workload, partner integration, tenant administrator, or scheduled process. The context may contain credentials, a verified principal, roles, scopes, permissions, tenant membership, resource relationship, device or network attributes, and other policy inputs. Which of those inputs matter is a product and security-design question.

Two identical requests can therefore have different correct outcomes:

| Same request | Caller context | Legitimate difference |
|---|---|---|
| `GET /orders/ord-701` | Customer who owns the order | A representation limited to that customer's permitted fields. |
| `GET /orders/ord-701` | Support agent with a case assignment | A support representation with only operationally necessary fields. |
| `GET /orders/ord-701` | Another customer | A safely denied or concealed result. |
| `POST /orders/ord-701/refund` | Finance service with approved scope and state precondition | A permitted state-changing operation. |
| `POST /orders/ord-701/refund` | Fulfilment service | A safely denied result with no refund side effect. |

The table is an **MSQE educational access lens**, not a required identity architecture. Its value is that it changes the test question from “does the endpoint require a token?” to “does this context receive only the observation and action that the contract permits?”

## Authentication and Authorization Are Different Decisions

**Authentication** establishes or verifies an identity or credential context sufficiently for the system's purpose. It may concern a person, service, device, workload, or delegated client. It is not necessarily proof of a human's real-world identity, nor does it say what the authenticated context may do.

**Authorization** determines whether an authenticated or otherwise recognised context is permitted to perform a selected action or observe a selected resource or field. It is commonly based on more than an identity alone: ownership, role, scope, tenant, resource attributes, current workflow state, and policy can all matter.

| Question | Authentication | Authorization |
|---|---|---|
| Primary question | Is there an acceptable identity or credential context for this request? | Is this context allowed to perform this action or observation here? |
| Example failure | Credential is missing, malformed, expired, or invalid. | Customer is not the owner; scope is insufficient; state forbids the action. |
| Evidence focus | The API recognises or rejects the selected credential condition safely. | The API applies the intended resource/action/policy rule and prevents unauthorised effects. |
| What it does not prove | The caller may access every resource or operation. | The authentication system, credentials, and identity provider are comprehensively secure. |

Authentication can be absent by design. A public catalogue endpoint may intentionally permit anonymous reads, while a checkout operation requires a customer or service context. Avoid treating authentication as a universal quality requirement. Instead, make the public and protected boundary explicit.

### Credential conditions as observable behaviour

The API may need different contract behaviour for missing, malformed, invalid, expired, revoked, or otherwise unacceptable credentials. The details depend on its authentication scheme and security policy. For Bearer-token use, RFC 6750 defines an HTTP usage model and error conventions for access tokens; it does not make every API use the same identity or authorization design.[^rfc6750]

Quality evidence should ask what the API establishes and what it deliberately does not disclose. A safe failure can tell a legitimate client that it must authenticate or refresh a credential without revealing whether a particular customer, order, tenant, or permission exists.

## Authorization Is a Resource-and-Action Decision

Authorization is often mistakenly reduced to role membership. Roles can be useful policy inputs, but an API decision frequently also depends on the resource, action, relationship, tenant, and current state.

| Policy input | Illustrative question |
|---|---|
| Role | Is a support agent generally eligible to view support cases? |
| Permission or scope | Is the caller permitted to issue a refund or view financial detail? |
| Resource ownership | Does this customer own, share, or otherwise have a permitted relationship to this order? |
| Tenant or organisation | Does this identity belong to the organisation that owns this resource? |
| Attribute or context | Is the action permitted for this region, case assignment, device posture, or approval condition? |
| Workflow state | Is cancellation allowed before fulfilment is committed, and for this caller? |
| Field classification | May the caller view delivery instructions but not payment reference data? |

Role-based access describes decisions in terms of assigned roles. Permission- or scope-based access describes specific capabilities. Attribute- or context-based rules can use relationships and conditions. These labels are useful for discussion, not a taxonomy that every system must implement. The Quality Engineer needs to know which inputs change the expected outcome and which combinations create the greatest harm if misapplied.

### Resource ownership and horizontal access

**Resource ownership** describes the relationship that makes an action or observation legitimate for a particular identity context. A customer may be allowed to retrieve their own order but not another customer's order. A support agent may be allowed to access a case-assigned order but not every tenant's orders. A partner may be allowed to see records associated with a contract but not unrelated customers.

A **horizontal authorization failure** occurs when a caller at one peer level can access or act on another peer's resource without the required relationship. The phrase helps a team name a risk; it is not an invitation to probe real systems outside authorised work. In quality work, use synthetic identities and approved fixtures to test a selected ownership boundary.

The evidence must include both a positive and a negative relationship. Testing that Customer A can retrieve Customer A's order says little about Customer A's access to Customer B's order, a deleted order, a shared order, or an order in another tenant. The API may legitimately return different representations for each, but its behaviour should be deliberate, safe, and documented where consumers need to act on it.

### Privilege and vertical access

A **vertical authorization failure** occurs when a lower-privilege context can perform an action reserved for a higher-privilege or more specifically authorised context. A customer creating an order is not necessarily allowed to approve a refund. A fulfilment service reading shipping state is not necessarily allowed to change finance state. A tenant administrator is not necessarily allowed to access the platform operator's data.

The useful question is not simply “can user access admin endpoint?” It is which protected business action must be constrained, what permission and state conditions apply, what safe result is expected, and which harmful side effect must not occur. This keeps the focus on defensive verification and customer impact.

## Tenant Boundaries and Contextual Access

Multi-tenant APIs introduce an additional relationship: the same kind of resource can exist in more than one organisational boundary. A correct result for one tenant may be an information-disclosure failure for another. Tenant information can be explicit in a request, inferred from credential context, resolved through resource ownership, or supplied through a trusted service relationship. The chapter does not prescribe which.

Quality evidence should ask:

- Which tenant or organisation defines the resource's visibility and action boundary?
- If a request contains a tenant identifier, which source is authoritative when it disagrees with the credential context?
- Can a list, search result, count, page token, or aggregate expose cross-tenant membership?
- Are diagnostics, correlation identifiers, exports, and asynchronous outcomes subject to the same boundary?
- Does a shared or delegated relationship have explicit, testable rules?

Chapter 5's collection reasoning applies here. A list can be internally complete for its query but unsafe if its effective visibility rule includes another tenant's records. Conversely, an empty list might represent correct concealment or a valid lack of records; a consumer should not infer more than the contract permits.

## Resource, Field, Operation, and State Boundaries

Access control is not only a yes/no decision for one endpoint. The following boundaries can differ legitimately:

| Boundary | Example | Quality question |
|---|---|---|
| Resource-level | Customer reads an owned order. | Is ownership or another valid relationship enforced? |
| Field-level | Support can see delivery status but not payment reference. | Is sensitive or irrelevant information omitted, redacted, or represented according to policy? |
| Operation-level | Finance can approve a refund; support can request review only. | Is the protected transition blocked for the wrong context? |
| Collection-level | A manager sees their team's orders. | Do filters, totals, pages, and search results obey the same visibility rule? |
| State-dependent | A customer can cancel before fulfilment commitment. | Does authorization remain correct as resource state changes? |
| Delegated or service access | A fulfilment service reads an order for shipping. | Is its permission narrowly related to its function and auditable? |

Field-level authorization requires particular care. A caller may be permitted to retrieve a resource while not being permitted to observe every field. Omitting a field, returning a null, substituting a masked value, or using a distinct representation can each be valid designs if their semantics are clear. A Quality Engineer should not infer a security policy from one response shape. They should ask which observation is promised and what a consumer must do when selected information is unavailable.

State-dependent authorization connects directly to Chapter 4. A customer might have permission to request cancellation only while an order remains cancellable; a finance role might approve a refund only after a return is received. The API must evaluate the relevant permission and state safely enough that a denied or stale request does not create an unauthorised transition or side effect.

## Safe Failure Behaviour and HTTP Semantics

Access failures are still API contract outcomes. RFC 9110 defines 401 as a response indicating that a request lacks valid authentication credentials for the target resource and requires an origin server to send a `WWW-Authenticate` field; it defines 403 as a request understood but refused; and it defines 404 as an origin server not finding a current representation for the target resource or being unwilling to disclose that one exists.[^rfc9110]

These status semantics are useful, but they do not replace application policy. The appropriate response depends on the authentication scheme, whether a resource's existence should be disclosed, what a legitimate client needs to do next, and the API's documented contract.

| Situation | Possible API-quality question | Avoided oversimplification |
|---|---|---|
| Missing or unacceptable credential | Can a legitimate client discover that authentication is required or refreshable without resource disclosure? | Do not treat every authentication problem as an identical 401 body. |
| Authenticated but insufficient permission | Does the API refuse the protected action and prevent a harmful effect? | Do not assume all business denials use 403 regardless of the contract. |
| Inaccessible or concealed resource | Does the API avoid confirming another customer's resource where concealment matters? | Do not prescribe 404 for every denied request. |
| State or policy denial | Can the caller distinguish a permission denial from an invalid transition when that distinction is safe and needed? | Do not reveal protected state merely to provide a detailed error. |

### Information disclosure is part of the outcome

Error details, identifiers, field names, stack traces, policy descriptions, and resource-existence signals can disclose information to a caller who should not receive it. An error can also be too opaque for a legitimate integration to recover safely. The design objective is not “return as little information as possible”; it is to return the minimum safe, useful information for the caller and decision.

For example, a customer-facing API might return a stable problem type and correlation identifier for a denied action while withholding internal policy evaluation and payment details. A trusted service integration might receive a bounded reason code needed for recovery. The difference is part of the contract and must be reviewed with the relevant security and product owners.

RFC 9457 provides a standard problem-details representation for HTTP APIs.[^rfc9457] It can structure an error response, but it does not decide which details are safe, whether a resource should be concealed, or whether a denied request caused a state change. Those remain application and security decisions.

## Denied Requests Must Not Create Unauthorised Effects

An authorization check is incomplete if it observes only the response. A denied refund request that still creates a payment instruction, an event, an audit-visible customer notification, or a data mutation is not safe merely because it returns an error. Conversely, a secure audit record can be an intended internal consequence of a denied request, provided it does not create the forbidden customer or business effect.

| Protected action | Required safe property | Evidence question |
|---|---|---|
| Read an order | No unauthorised representation or sensitive field is revealed. | Which response, field, log, or export observations are permitted to the caller? |
| Change delivery address | No unauthorised state change is applied. | Does authoritative state remain unchanged after the denied request? |
| Approve a refund | No payment, event, or refund transition occurs. | Which downstream and state observations establish absence of the harmful effect? |
| Search a collection | No unauthorised membership, count, cursor, or aggregate is disclosed. | Does the effective visibility rule apply to items and collection metadata? |

The evidence should be proportionate and safe. It may use a controlled fixture, an authorised test tenant, a correlation identifier, an appropriate state observation, or a reviewed audit outcome. It must not require exposing production records, secrets, or privileged diagnostic access to every tester.

## An API Access Evidence Matrix

The following is an **MSQE educational API Access Evidence Matrix**. It helps turn an access rule into an inspectable claim:

~~~text
identity and context
  → resource and tenant relationship
  → action or requested observation
  → expected permission and safe outcome
  → state/side-effect observation
  → evidence limitation and residual risk
~~~

| Identity context | Resource relationship | Action | Expected outcome | Evidence boundary |
|---|---|---|---|---|
| Customer A | Owns Order A | View order | Permitted customer representation. | Response plus authorised fixture state. |
| Customer A | Does not own Order B | View order | Safely denied or concealed according to the contract. | Response and absence of unauthorised representation. |
| Support agent | Assigned case for Order A | View delivery status | Permitted limited representation. | Field-level response review and assignment fixture. |
| Fulfilment service | Order A shipping task | Mark shipment dispatched | Permitted only in defined state and scope. | State and event evidence under controlled conditions. |
| Fulfilment service | Order A | Approve refund | Denied; no financial effect. | Response, authoritative state, and selected side-effect observation. |

The matrix is not a replacement for policy specification, threat modelling, penetration testing, or identity-system review. It is a way for a Quality Engineer to select meaningful combinations. Risk helps decide breadth: high-value resources, cross-tenant relationships, privileged operations, sensitive fields, delegated services, and state-changing actions usually need more focused evidence than a low-risk public catalogue read.

### Avoid role-only testing

One administrator and one ordinary user rarely represent an access model. A useful evidence portfolio considers the combinations that materially change permission:

- owned, unowned, shared, and tenant-external resources;
- roles or service identities with overlapping and distinct permissions;
- required, absent, insufficient, expired, and malformed credential conditions;
- read, create, update, approve, cancel, export, and search actions;
- sensitive and non-sensitive fields;
- normal, pending, completed, cancelled, and otherwise relevant resource states; and
- direct API responses as well as relevant side effects, collection metadata, and safe diagnostics.

This does not require a combinatorial test inventory. It requires a risk-based selection that explains why each representative case matters and which combinations remain unobserved.

## Diagnostic and Audit Evidence, Safely Scoped

Access decisions can be difficult to investigate without correlation and audit evidence. A support or security owner may need to connect a denied operation to a request, a policy decision, a resource, and a later customer report. At the same time, logs and diagnostics can become an unprotected alternative API if they expose credentials, personal data, resource identifiers, or detailed policy rules broadly.

The Quality Engineer can ask for safe diagnostic properties without designing the audit platform:

- Is there a correlation identifier that a legitimate caller or support workflow can use?
- Is the audit event sufficient for an authorised investigation without recording secrets?
- Can the team determine whether a denied state-changing request created a harmful effect?
- Are access decisions attributable to a bounded identity context and resource relationship where policy requires it?
- Does diagnostic evidence obey tenant, role, retention, and privacy expectations?

These questions prepare later work on observability and security. They do not make a Quality Engineer the owner of production log design or incident response.

## Security Evidence Has Explicit Limits

Access-control evidence is valuable but bounded. A selected matrix can demonstrate that named identity, resource, action, and state combinations behaved as observed. It does not prove that every endpoint, policy path, identity-provider configuration, token validation rule, secret-handling practice, infrastructure boundary, or malicious technique is secure.

The OWASP API Security Project identifies object-level authorization as a significant API security risk area.[^owasp-api1] That guidance helps teams recognise a defensive review question; it is not a complete API-security programme or a substitute for approved security testing. NIST digital-identity guidance addresses assurance considerations for identity systems, but this chapter does not teach how to configure an identity provider or claim a selected API check achieves a particular assurance level.[^nist-63b]

Quality Engineering contributes by making access behaviour, evidence limits, and specialist hand-offs clear. A finding may require security, identity, privacy, platform, product, or legal collaboration. Saying that explicitly is more useful than either overclaiming security assurance or treating access control as someone else's opaque concern.

## QA → QE Transition

| Existing QA activity | Expanded API Quality Engineering practice |
|---|---|
| Send a request with and without a token. | Define the identity context, credential condition, protected resource, action, safe error outcome, and limitation. |
| Verify a user cannot access an admin endpoint. | Assess risk-relevant role, scope, ownership, tenant, field, operation, and state combinations. |
| Assert a 401 or 403 response. | Ask what a legitimate client can safely infer, what must remain concealed, and whether a harmful effect was prevented. |
| Check an authorised resource response. | Compare positive and negative ownership relationships, collection visibility, field exposure, and delegated-service boundaries. |
| Report an authorization defect. | State the affected customer outcome, permission rule, observation boundary, side-effect risk, evidence, and specialist hand-off. |

The transition is from authenticated-versus-unauthenticated checks to a reasoned access model. Quality Engineers do not certify an entire security posture. They help teams make identity, resource, permission, visibility, and safety rules explicit enough to challenge with proportionate evidence.

## Engineering Perspective

Reliable access behaviour begins with explicit product and security decisions: which resources exist, who can know about them, which relationships allow which operations, which fields are sensitive, how state affects permission, and which errors are safe to reveal. A test suite cannot repair an ambiguous ownership rule or a service identity granted broad financial privileges.

The highest-value improvement may be modest: define the tenant source of truth, distinguish a customer representation from a support representation, require an ownership check at a resource boundary, expose a safe correlation identifier, or document that a denied action must not publish a business event. Quality Engineering makes these decisions observable and connects them to customer and operational risk.

## Industry Perspective

RFC 9110 defines HTTP authentication challenges and the semantics of 401, 403, and 404 responses.[^rfc9110] RFC 6750 defines Bearer-token use and related error conventions for one token model.[^rfc6750] RFC 9457 defines a standard problem-details format for HTTP APIs.[^rfc9457] OWASP guidance provides defensive awareness of API authorization risks.[^owasp-api1]

These sources do not prescribe one authorization architecture, role model, error policy, or testing tool. The access lens and evidence matrix in this chapter are MSQE educational framing, intended to help readers connect an API access question to a consumer outcome, evidence boundary, and residual risk.

## Common Misconceptions

### “A valid token means the caller is authorised.”

A credential can establish an acceptable identity context without granting access to every resource, action, field, tenant, or workflow state.

### “401, 403, and 404 are a universal business-rule taxonomy.”

HTTP semantics matter, but the appropriate response depends on the authentication scheme, disclosure policy, resource context, and documented API contract.

### “A 404 response always means the resource does not exist.”

RFC 9110 permits an origin server to be unwilling to disclose that a current representation exists. Consumers must not infer more than the contract safely establishes.

### “One administrator and one customer are enough to test authorization.”

Meaningful evidence considers ownership, tenant, scope, operation, field, state, and delegated-service combinations based on risk.

### “An access-control test proves the API is secure.”

Selected checks can establish selected access behaviour. They do not replace security architecture review, specialist testing, identity-system assurance, secure configuration, or operational monitoring.

## Summary

Identity changes what an API should reveal and allow. Authentication establishes or verifies an identity or credential context; authorization determines whether that context may observe a resource, field, collection, or action under the relevant ownership, tenant, role, scope, and state conditions.

Quality Engineering treats access behaviour as a contract with side effects and evidence limits. It asks who is acting, what they can see or change, what must remain concealed, how safe failure is represented, whether denied requests leave protected state unchanged, and what a selected matrix cannot establish. This completes Delivery 3's progression from trustworthy data to the caller permitted to use it.

## Key Takeaways

- Authentication and authorization answer different questions.
- A valid credential does not prove permission for every resource, action, field, tenant, or state.
- Ownership, tenant, scope, role, permission, attributes, and workflow state can all affect an API decision.
- Resource-level permission is not automatically field-level or operation-level permission.
- 401, 403, and 404 must be interpreted in the API's authentication and disclosure context.
- Safe failure balances useful recovery information with controlled disclosure.
- A denied request must not create an unauthorised state change or harmful side effect.
- An API Access Evidence Matrix supports risk-based access evidence but does not prove complete security assurance.

## Review Questions

1. How do authentication and authorization differ for a service identity?
2. Why is a valid credential insufficient evidence that a caller may retrieve an order?
3. What is the difference between a resource-level and a field-level authorization decision?
4. Why should a collection's count, cursor, and search results be considered in tenant-boundary evidence?
5. When might a response conceal a resource's existence, and what must a consumer avoid inferring?
6. What evidence would show that a denied refund request created no harmful side effect?
7. Why is role-only testing insufficient for an ownership-based API?
8. What does a selected authorization matrix fail to establish about complete API security?

## Interview Questions

1. How would you design evidence for an API that allows customers to read only their own orders?
2. A service token can read shipment data and issue refunds. What questions would you raise?
3. How would you assess whether a `404` response is safe and useful for an inaccessible resource?
4. What access combinations would you select first for a multi-tenant API with sensitive account data?
5. How would you communicate the limitations of authorization testing to a release decision-maker?

## Practical Exercise

### Build an API Access Evidence Matrix

**Objective:** Produce an **API Access Evidence Matrix** for a fictional Atlas Commerce API. Model permitted and denied observations and actions without using live credentials, security tooling, or an implementation.

Atlas has these identity contexts:

- **Customer A** — owns Order A in Tenant North;
- **Customer B** — owns Order B in Tenant North;
- **Support agent** — assigned to Customer A's case and permitted to view delivery status but not payment references;
- **Fulfilment service** — permitted to read shipping details and mark dispatch for Tenant North orders in `accepted` state; and
- **Finance service** — permitted to approve refunds after a documented return condition.

The following requested operations are in scope:

~~~http
GET  /v1/orders/{orderId}
GET  /v1/orders?customerId={customerId}
POST /v1/orders/{orderId}/dispatch
POST /v1/orders/{orderId}/refund
~~~

**Tasks:**

1. Create rows for positive and negative ownership, role/scope, tenant, operation, field, and state conditions.
2. Define the expected permitted representation or action for each positive row.
3. Define the expected safe failure and controlled observation for each denied row, including whether the resource may be concealed.
4. Identify which fields, collection metadata, identifiers, error details, and diagnostics must not be disclosed to each context.
5. State the state and side-effect evidence needed to show that a denied dispatch or refund had no harmful effect.
6. Identify the highest-risk combinations and explain why one admin/user pair would be insufficient.
7. Write a residual-risk statement that distinguishes selected authorization evidence from a complete security assessment.

**Expected artifact:** A three- to four-page API Access Evidence Matrix containing context definitions, resource/action rules, permitted and denied observations, safe failure expectations, side-effect evidence, limitations, and specialist hand-off questions.

**Constraints:** Atlas Commerce is fictional. Do not obtain or create tokens, probe a live service, write an authentication implementation, create security scripts, or claim that the matrix proves complete security assurance.

## Further Reading

- [Chapter 4 — Stateful API Behaviour: Validation, Errors, Idempotency, and Concurrency](chapter-04-stateful-api-behaviour-validation-errors-idempotency-and-concurrency.md) — state and side-effect context for access decisions.
- [Part III, Chapter 9 — Service, API, and Distributed-System Testing Strategy](../../part-03-software-testing/chapters/chapter-09-service-api-and-distributed-system-testing-strategy.md) — complementary service-boundary and evidence context.

## References

[^rfc9110]: Fielding, R., Nottingham, M., and J. Reschke, eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). IETF, June 2022. Accessed 2026-08-10.
[^rfc6750]: Jones, M., and D. Hardt. [RFC 6750 — The OAuth 2.0 Authorization Framework: Bearer Token Usage](https://www.rfc-editor.org/rfc/rfc6750.html). IETF, October 2012. Accessed 2026-08-10.
[^rfc9457]: Nottingham, M., Wilde, E., and S. Dalal. [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html). IETF, July 2023. Accessed 2026-08-10.
[^owasp-api1]: OWASP Foundation. [API1:2023 — Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/). Accessed 2026-08-10.
[^nist-63b]: National Institute of Standards and Technology. [SP 800-63B — Digital Identity Guidelines: Authentication and Authenticator Management](https://pages.nist.gov/800-63-4/sp800-63b.html). Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish authentication from authorization for a person and a service identity;
- [ ] identify the resource, action, ownership, tenant, scope, and state conditions that affect an access decision;
- [ ] assess resource-, field-, collection-, and operation-level access separately;
- [ ] explain 401, 403, and 404 outcomes in a safe, contextual way;
- [ ] select evidence that a denied request revealed no protected data or harmful side effect; and
- [ ] state why a selected access matrix is not a complete security assessment.

**Next:** Chapter 7 will examine dependent and asynchronous APIs, including events, webhooks, third parties, and controlled evidence.
