# Chapter 1 — API Quality Engineering: Boundaries, Outcomes, and Evidence

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 1 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Parts I–III, or equivalent experience with quality evidence, typed data, asynchronous behaviour, and service testing |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An API response is evidence about an observed interaction. API quality depends on the contract, state, side effects, and consumer outcome that interaction can—and cannot—establish.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. Its checkout application calls an order API after a customer confirms payment. The API responds with a successful result, returns an order identifier, and the checkout page displays “Order confirmed.”

Several minutes later, a customer contacts support. Payment was captured, but the warehouse never received a fulfilment instruction. Support can find the order record, yet its fulfilment state is pending. The team’s release evidence contains many successful requests with plausible, shape-valid responses.

Rina, the Quality Engineer, does not begin by asking how many more endpoint checks to add. She asks what the original result meant. Did the API create an order record, confirm payment, request fulfilment, or complete fulfilment? Which state transition was expected? Which event should have existed? Which consumer relied on the response, and which downstream effect remained unobserved?

The incident does not make API checks unhelpful. It shows that a successful request is useful only when its claim is clear. Rina separates the immediate acknowledgement from the later fulfilment outcome, identifies evidence at each boundary, and records the remaining uncertainty. That is API Quality Engineering: making an interface’s behaviour and limits visible enough to support a decision.

## Introduction

Many QA Engineers already use APIs: sending requests, inspecting responses, comparing JSON, and identifying failures before a user interface is complete. These skills become more valuable when an API is more than a fast route to a status code.

An **Application Programming Interface (API)** is an interface through which one software participant can request, receive, publish, or interpret behaviour from another. It can be an HTTP interface, a library boundary, a remote procedure call, an event stream, a file exchange, or a callback. In this part, API examples often use HTTP because it is familiar, but API is not a synonym for REST or for an HTTP endpoint.

API Quality Engineering asks what an interface promises, what assumptions cross it, what outcome matters to consumers and customers, and what evidence can challenge those assumptions. It begins before tooling and remains relevant after a request succeeds.

## Why This Chapter Matters

Part III established that tests and checks are bounded evidence, that risks determine which evidence matters, and that a system boundary should be chosen because it can reveal a consequential assumption. An API is one such boundary. It often connects teams, services, data stores, suppliers, and customer journeys with different ownership, deployment schedules, and failure modes.

The familiar question—“does this endpoint work?”—is too weak for many decisions. A response can be syntactically valid yet carry the wrong business meaning. A request can produce the expected immediate result while its state change, event, authorization decision, or downstream effect is wrong. Conversely, a focused API observation can be stronger than a broad user-interface journey when the risk lives in the interface contract.

This chapter establishes the API Quality Engineering mindset. Chapter 2 applies it to HTTP and interface semantics; later chapters address contracts, stateful behaviour, data, authorization, dependent systems, and sustainable feedback. This chapter does not teach HTTP mechanics, OpenAPI, schema validation, API clients, service virtualization, or framework architecture.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish an interface, API, service, endpoint, and operation without treating the labels as a universal taxonomy;
- explain why API quality is broader than checking request and response examples;
- identify an API boundary, its participants, assumptions, and customer-relevant outcome;
- describe a request in terms of validation, processing, state change, side effect, response, and later consequence;
- distinguish immediate response correctness from semantic, state, consumer, and downstream correctness;
- select functional, contractual, operational, and diagnostic evidence appropriate to an API-quality question;
- identify consumer and provider assumptions that can create quality risk;
- formulate API-quality questions that state an observation, an oracle, and a limitation;
- identify API-specific testability needs without repeating general testability theory; and
- explain how developers, Quality Engineers, consumers, product colleagues, and specialists share responsibility for API quality.

## What an API Means in Quality Engineering

Use these terms only when they clarify an engineering question.

| Term | Useful working meaning | Why it matters to Quality Engineering |
|---|---|---|
| **Interface** | An agreed way for one participant to interact with another. | The interaction carries assumptions about meaning, timing, errors, and ownership. |
| **API** | An interface intended for software participants to use programmatically. | Its behaviour can influence consumers without being visible in a user interface. |
| **Service** | A cohesive capability that may expose one or more interfaces. | A service can have APIs, events, data exchanges, and internal boundaries; none alone describes all of its quality. |
| **Endpoint** | A network-addressable target in a particular protocol, commonly an HTTP URI. | It identifies where a request is sent, not everything the request means or changes. |
| **Operation** | A particular requested action or interaction at an interface. | The operation’s contract, state transition, and outcome need evidence. |

Atlas’s order service exposes an HTTP API whose endpoint accepts order submission. It may also publish a fulfilment event and write an order record. Calling all of that “the endpoint” hides what a result can establish.

An API can be internal, shared among teams, external, or supplier-mediated. Its location does not decide its importance. An internal interface can create severe customer risk when it transfers a price, entitlement, identity, or safety-relevant state. The decision begins with context.

## API Quality Is Not Merely API Testing

**API testing** is an activity: a person or program stimulates or observes an API and compares the result with an expectation. API testing can produce valuable evidence about a selected request, response, state, error, or interaction.

**API Quality Engineering** is the broader engineering practice of making API behaviour understandable, controllable, compatible, observable, and fit for the outcomes it supports. It includes the evidence activity, but also the decisions that make useful evidence possible.

| Endpoint-checking question | API Quality Engineering question |
|---|---|
| Does this request return the expected status? | What does that status mean for this operation, and what important state or side effect might still be unknown? |
| Does the JSON match the expected example? | Can named consumers interpret the representation and its absence, defaults, errors, and timing safely? |
| Can I send an invalid payload? | Which invalid, conflicting, duplicate, or unauthorized conditions could cause harmful behaviour, and what error contract should make them clear? |
| Did the check pass? | Which claim does the result support, which condition did it represent, and what residual risk remains? |
| Which API tool should the team use? | Which boundary and observation can provide proportionate evidence for the decision? |

This distinction gives test execution a purpose. A short, controlled API check can be excellent evidence for a contract interpretation or negative condition. It is weak when treated as evidence of every consumer’s compatibility, downstream processing, load behaviour, or authorization correctness without observing those things.

### API-quality concerns

The following concerns commonly matter at an API boundary:

- **contract clarity:** whether participants can understand the structure, meaning, constraints, and lifecycle of an interaction;
- **semantic correctness:** whether the interface result means what the consumer reasonably relies on it to mean;
- **state and side effects:** whether the intended state changes occur once, at the appropriate time, and without harmful additional effects;
- **failure behaviour:** whether invalid, conflicting, unavailable, or partially completed conditions are represented predictably and safely;
- **compatibility:** whether consumers and providers can continue to work as versions, representations, defaults, and behaviours evolve;
- **diagnosability:** whether a team can safely distinguish an expected outcome from a product, dependency, configuration, or consumer-interpretation problem;
- **reliability and consumer impact:** whether the interaction supports the customer outcome under the relevant conditions; and
- **evidence limitation:** what the available observation does not establish.

Some are product-quality concerns; others are capabilities. In ISO/IEC 25010, observability and testability are not additional top-level product-quality characteristics.[^iso25010] Here they make API behaviour controllable, observable, and diagnosable.

## API Boundaries Are Evidence Boundaries

Part III Chapter 6 chose evidence boundaries for the risk that matters. An **API boundary** is an interface where one participant makes a request, receives a response, publishes a message, or interprets data from another. It exposes assumptions that may not be visible inside either participant.

At the Atlas order boundary, checkout assumes that:

- the order API will interpret the submitted items, price, customer identity, and payment reference as intended;
- a response status and representation describe the operation’s actual state;
- a returned order identifier refers to the expected customer order;
- a retry will not create a second charge or fulfilment instruction;
- the fulfilment consumer can use the event or state produced by the order API; and
- safe diagnostic information can connect a support investigation to the relevant interaction.

None of these assumptions is established merely because a network request completed. Each is a potential evidence question.

| API-boundary question | Observation that can help | Important limitation |
|---|---|---|
| Did the API reject a request that lacks a required order item? | A selected error status and representation. | Does not establish every business rule or consumer response. |
| Did the API create an order in the intended state? | A response plus an authoritative state observation. | Does not establish fulfilment, notification, or every concurrent update. |
| Can a known consumer interpret a changed field? | Compatible consumer/provider evidence. | Does not establish every consumer version or undocumented use. |
| Does a retry preserve one logical order? | Selected duplicate-request and state evidence. | Does not establish every network or supplier failure pattern. |
| Can support investigate an uncertain outcome? | A safe request or correlation identifier with relevant state. | Does not establish that every production signal is available or retained. |

The question is whether the observed boundary is sufficient for the claim. A validation check, contract check, consumer interaction, and customer workflow can each answer a different question.

## A General Model: Request to Outcome

The following is an **MSQE educational API-outcome model**, not an HTTP standard or a required system architecture:

```text
request or input
  → validation and authorization decision
  → processing
  → state transition and side effects
  → response or acknowledgement
  → downstream and customer-relevant outcome
```

The model is broader than a request/response exchange.

- **Request or input** is what a caller supplies: an HTTP request, an event, a command, a file, or an in-process invocation.
- **Validation and authorization decision** determine whether the input is structurally usable, permitted, and meaningful in the current context.
- **Processing** applies the operation’s behaviour. It might be immediate or it might begin later work.
- **State transition** changes an authoritative record or observable status. A **side effect** is an additional externally observable result, such as emitting an event, charging a payment method, sending a notification, or creating an audit record.
- **Response or acknowledgement** communicates the interface’s immediate outcome. It may say completed, created, accepted for later work, rejected, unavailable, or something else defined by the contract.
- **Downstream and customer-relevant outcome** is what other services, consumers, support colleagues, or customers can eventually observe.

Not every operation includes every step. The model prevents a response from being treated as evidence of unobserved steps.

### An API result needs an explicit claim

Suppose Atlas receives a successful response after submitting an order. The result might credibly support one of several claims:

- the API received a syntactically valid request;
- the API created an order record;
- the API accepted fulfilment work for later processing;
- the API completed all required downstream work; or
- the customer can now rely on a confirmed fulfilment outcome.

These claims are progressively stronger. The appropriate claim depends on the contract and observation. A response that says an operation is accepted can be useful and correct without proving downstream completion. A Quality Engineer helps the team name that distinction before an incident or release decision forces it into view.

## Response Correctness Is Not Enough

An API response can be correct within its immediate contract and still be insufficient evidence of the larger outcome.

| Observed response | Hidden or later concern | Better evidence question |
|---|---|---|
| A request returns 200, but the stored order has the wrong customer identifier. | The response does not establish authoritative state correctness. | Which record changed, and does it represent the submitted customer and order? |
| A JSON representation matches its expected shape, but a field says an order is fulfilled when it is only queued. | Structural validity does not establish semantic correctness. | What does each state value mean, and what customer action is safe in that state? |
| A request returns the expected response, but a retry creates two fulfilment events. | The immediate response does not establish repeatability or side-effect uniqueness. | What happens after duplicate submission or an unknown timeout outcome? |
| A request is acknowledged, but asynchronous payment review later fails. | An acknowledgement does not establish completed business workflow. | What event, state, or customer observation defines completion or failure? |

**Structural correctness** concerns agreed form, such as valid JSON with expected fields and types. **Semantic correctness** concerns business and interaction meaning. A representation can be structurally valid yet semantically wrong, stale, misleading, or incompatible with a consumer.

Chapter 3 will examine schemas, contracts, compatibility, and API evolution. For now, state whether a check examines form, meaning, state, side effect, or a larger outcome.

## Evidence at an API Boundary

API evidence can be grouped by the kind of claim it supports. The groups overlap; they are not a mandatory test-suite structure.

| Evidence type | API-focused question | Example observation | What it does not establish by itself |
|---|---|---|---|
| **Functional evidence** | Does this selected operation produce the expected immediate behaviour? | A valid order request receives the defined result. | Every contract version, consumer interpretation, or downstream outcome. |
| **Contractual evidence** | Do participants agree on representation, meaning, errors, and constraints? | A provider and named consumer handle an absent optional field as agreed. | All business workflows or production configurations. |
| **Operational evidence** | Does the interaction behave acceptably under a relevant real condition, such as delayed processing or a dependency limitation? | A selected timeout produces the documented pending or recovery state. | General production reliability or capacity. |
| **Diagnostic evidence** | Can the result be interpreted and investigated safely? | A request identifier connects the response, state transition, and support record. | Root cause, unless the available observation actually supports it. |

Functional evidence exercises a known operation. Contractual evidence makes interface expectations explicit. Operational evidence addresses time, dependencies, configuration, or recovery. Diagnostic evidence makes a result interpretable. One activity may support several groups but not silently claim all four.

Part III Chapters 8 and 9 introduced broader quality-attribute and distributed-system evidence. The API-specific question here is which representation, state, side effect, metadata, or consumer interaction is visible, and what that visibility cannot prove.

## Consumers, Providers, and Hidden Assumptions

An API contract exists between participants, not only in one service’s source code. A **consumer** relies on an API’s behaviour. A **provider** exposes that behaviour. One system can be both: Atlas checkout consumes the order API and provides information to the customer interface.

| Consumer may rely on | Provider should make clear | Risk when the assumption is hidden |
|---|---|---|
| A field’s presence, type, and meaning. | Whether it is required, optional, nullable, defaulted, or changing. | A consumer silently treats absence as approval or an empty value as a valid value. |
| A response status or error representation. | What the result means and which action is safe next. | A consumer retries a domain rejection or exposes an unsafe message. |
| The timing of an outcome. | Whether the operation is complete, pending, asynchronous, or subject to later reconciliation. | A customer is promised fulfilment before it is possible. |
| Repeatability of a request. | Whether duplicate submissions, retries, or repeated delivery are safe. | One logical action creates duplicate charges, messages, or records. |
| Compatibility across releases. | Which changes are supported, deprecated, or require coordination. | A deployed consumer breaks when a default, field, or error changes. |
| Diagnostic metadata. | Which identifiers are safe, stable, and meaningful for support or investigation. | A team cannot connect an uncertain customer outcome to the observed interaction. |

Providers cannot guess undocumented consumer use, and consumers should not silently accept ambiguity. API Quality Engineering makes assumptions discussable before changes make them harmful.

### Assumptions worth challenging

These common assumptions are risky when unexamined:

- “This field is always present.”
- “A duplicate request is harmless.”
- “Events arrive in the order we need.”
- “The error representation will never change.”
- “A timeout proves the provider did nothing.”
- “A successful response means downstream work is complete.”
- “A valid response is compatible with every consumer.”
- “A correlation identifier is enough to explain the cause.”

None is universally false. A request may be **idempotent**, meaning repeated delivery has an equivalent intended effect. Each statement needs a contextual contract, state rule, or evidence question. The risk is relying on a condition nobody specified, observed, or agreed to preserve.

## Formulating API-Quality Questions

Good API-quality questions connect a desired outcome to a boundary and an observation. The following is an **MSQE educational API-evidence prompt**, not an industry-standard template:

```text
customer or consumer outcome
  → API behaviour and assumption
  → evidence boundary and observation
  → limitation and residual risk
```

For Atlas, “test order creation” is an activity label, not a useful question. More useful questions include:

- What does a successful order-submission response mean: record created, payment authorized, fulfilment requested, or fulfilment completed?
- Which state should change, and which state must not change, when validation rejects the request?
- What happens if the same order submission is repeated after the caller loses the response?
- Which error representation distinguishes invalid input, conflicting order state, unavailable dependency, and pending completion?
- Which representation fields do checkout, warehouse, and support rely on?
- What evidence would expose a response that is structurally valid but semantically misleading?
- Which correlation information is safe and necessary to distinguish an order that is pending from one that is lost?

An **oracle** is the source of expectation used to judge an observation. At an API boundary it can be a documented state transition, consumer agreement, business rule, event contract, or authoritative record. “The response looked reasonable” is not an oracle. For one logical client intent, “a repeated submission must result in one order record and at most one fulfilment instruction” is an oracle because it specifies the observable state and side-effect limits that the evidence must challenge.

The question should also state its limit. A controlled duplicate request can support a selected repeatability rule. It does not establish every network retry pattern, supplier state, or production concurrency condition. That limit is not a weakness in the activity; it is information a decision-maker needs.

## API Testability: Making Useful Evidence Possible

Part III Chapter 3 introduced testability as the ability to make relevant behaviour controllable, observable, and diagnosable. At an API boundary, the same idea becomes concrete without requiring every interface to expose internal implementation detail.

| API testability capability | API-quality question it enables | Caution |
|---|---|---|
| Controllable non-sensitive inputs | Can a team represent valid, invalid, boundary, duplicate, or conflicting requests safely? | Control must not substitute for a real compatibility check when that is the risk. |
| Deterministic test data | Can a result be attributed to the intended order, account, or state rather than shared history? | Synthetic data may not represent production volume or every historical condition. |
| Clear error contracts | Can a consumer distinguish a rejected request from a pending or unavailable operation? | A detailed error must not disclose secrets, sensitive data, or internal attack information. |
| Inspectable state at an appropriate boundary | Can a team determine whether the intended state transition occurred? | Exposing a database directly may be neither safe nor the right contract boundary. |
| Safe request or correlation identifiers | Can related request, response, event, and support observations be connected? | An identifier supports investigation; it does not prove causation. |
| Stable representative environments | Can selected contract and dependency evidence be repeated with known configuration? | A test environment cannot automatically represent production conditions. |

These are design and collaboration questions. A Quality Engineer can identify an ambiguous API result caused by a missing completion state, safe identifier, or observable effect. The response may be a clarified contract, safer diagnostic field, agreed state model, controlled fixture, or evidence at another boundary.

## API Quality Is a Shared Engineering Concern

API quality is shared.

| Participant | Typical contribution |
|---|---|
| Developers and API providers | Define and implement stable semantics, validation, state behaviour, failure outcomes, safe diagnostics, and change communication. |
| Quality Engineers | Frame risks and evidence questions, identify hidden assumptions, challenge weak claims, select boundaries, and communicate limitations. |
| API consumers | Make their dependencies explicit, validate their interpretation, communicate compatibility needs, and avoid treating undocumented behaviour as guaranteed. |
| Product and domain stakeholders | Clarify customer outcomes, business meaning, policy rules, acceptable pending states, and harmful consequences. |
| Platform and service owners | Provide reliable environments, dependency information, operational constraints, and safe diagnostic support. |
| Security, data, performance, and reliability specialists | Contribute depth where identity, data integrity, workload, resilience, or operational risk requires specialist methods. |

Shared responsibility does not remove accountability. Providers remain accountable for exposed behaviour; consumers for their interpretation. The Quality Engineer does not unilaterally approve an API or accept residual risk; they make evidence and uncertainty clear enough for accountable people to act.

## QA → QE Transition

This transition preserves QA skill while expanding its purpose.

| Existing QA strength | Expanded API Quality Engineering capability |
|---|---|
| Send a request and compare a response. | State the claim the response supports and identify unobserved state, side effects, and consumer impact. |
| Create positive and negative API checks. | Select conditions from contract, state, repeatability, and outcome risk rather than endpoint enumeration. |
| Report an API defect. | Distinguish observed fact, consumer assumption, interface ambiguity, dependency condition, and residual uncertainty. |
| Use an API client efficiently. | Choose a tool or controlled mechanism only after defining the boundary, oracle, and decision need. |
| Verify a response schema. | Ask whether a structurally valid representation is semantically correct and compatible with named consumers. |

By the end of this chapter, the learner should increasingly ask: *What does this interaction mean? What state or side effect matters? What does this result prove? What remains unknown? Who relies on the answer?*

## Engineering Perspective

API evidence exposes design choices that affect safe change: ambiguous completion, undocumented defaults, duplicate side effects, hidden consumer dependencies, unobservable asynchronous work, unsafe errors, and missing correlation. These are interface-design and systems-thinking concerns.

The best improvement is not always another API check. A team may need an explicit state model, idempotency rule, compatible consumer agreement, safe identifier, or distinction between accepted and completed work. Quality Engineers add value by connecting consumer risk to that design decision without owning the architecture.

## Industry Perspective

HTTP provides a uniform interface with standardized request methods, status codes, metadata, and representation semantics.[^rfc9110] Those standards are useful because they make certain protocol expectations explicit, not because they make every application outcome automatic. The OpenAPI Specification provides a language-agnostic description format for HTTP APIs, which can help participants communicate an interface, but a description still needs semantic and consumer review.[^openapi]

ISO/IEC 25010 provides a product-quality reference model; ISO/IEC/IEEE 29119-2 provides generic testing-process context, while SWEBOK places interfaces and testing within wider software-engineering concerns.[^iso25010][^iso-29119-2][^swebok] None prescribes an API tool, framework, or the API-evidence questions in this chapter. The API-outcome model and API-evidence prompt are explicitly MSQE educational framing.

## Common Misconceptions

### “One successful request proves the API works.”

It supports the observed request under its conditions. It may not establish state, side effects, consumer interpretation, compatibility, authorization, downstream completion, or recovery behaviour.

### “An API is REST.”

REST is one architectural style relevant to some HTTP interfaces. APIs also include RPC, GraphQL, events, webhooks, callbacks, file exchanges, and in-process interfaces. The evidence question follows the interface behaviour, not the label.

### “A valid JSON response proves the contract is correct.”

Valid JSON can establish syntax and, with additional validation, selected structure. It does not establish business meaning, compatibility, state correctness, or a consumer’s safe interpretation.

### “A response is the outcome.”

A response may be the outcome for a simple read. For a state-changing or asynchronous operation, it might only acknowledge acceptance, creation, or pending work. The contract must say what it means.

### “The Quality Engineer owns API quality.”

API quality is shared among providers, consumers, product colleagues, and specialists. The Quality Engineer improves the evidence and decision process; they do not become the sole owner of every interface decision.

## Summary

APIs are Quality Engineering concerns because they are behavioural and integration boundaries. They connect consumers and providers through assumptions about representations, meaning, state, side effects, errors, timing, compatibility, and diagnostics. A successful request can be useful evidence, but it is not a universal claim about API quality.

API Quality Engineering applies Part III evidence discipline to API boundaries. It asks what outcome matters, what the interface promises, which assumption could fail, what observation can challenge it, and what remains unknown. The result is a proportionate evidence portfolio for the interface and its decisions.

## Key Takeaways

- An API is a programmatic interface, not REST or an HTTP endpoint.
- An API boundary exposes assumptions about meaning, state, side effects, timing, errors, ownership, and consumer use.
- API Quality Engineering is broader than executing API checks; it makes interface behaviour and evidence limits explicit.
- A response can be correct while the authoritative state, semantic meaning, side effect, or downstream outcome is wrong.
- Functional, contractual, operational, and diagnostic evidence answer different API-quality questions.
- Consumers and providers need explicit expectations about fields, errors, timing, repetition, compatibility, and diagnostics.
- API testability depends on safe controllability, deterministic data, observable state, clear errors, and interpretable identifiers.
- API quality is shared engineering work with explicit accountability and residual-risk communication.

## Review Questions

1. Why is an API boundary a Quality Engineering concern rather than simply a faster way to test a feature?
2. Distinguish an API, service, endpoint, and operation in a way that helps choose evidence.
3. What can a successful response establish, and what important outcomes might it leave unknown?
4. Give an example of a structurally valid representation that is semantically wrong.
5. How do functional, contractual, operational, and diagnostic evidence differ at an API boundary?
6. Why can a consumer dependency create API-quality risk even when the provider’s local checks pass?
7. What makes a duplicate request an evidence question rather than automatically a defect?
8. Which API testability capability would you request if a support team could not distinguish a pending operation from a failed one?

## Interview Questions

1. How would you explain the difference between API testing and API Quality Engineering to a delivery team?
2. How would you investigate an API request that returns success but does not produce the expected customer outcome?
3. How do you decide whether an API check should observe a response, a state change, an event, or a wider workflow?
4. What consumer assumptions concern you when an API field becomes optional?
5. How do you communicate the limitations of a passing API check to a release decision-maker?

## Practical Exercise

### Review an API Boundary as a Quality Engineer

**Objective:** Produce an API Boundary Evidence Review for a fictional order-submission interface. Focus on behaviour, assumptions, and evidence—not on a large test-case inventory.

**Scenario:** Atlas Commerce accepts customer orders through an order API. Checkout sends an order request after payment authorization. The API creates an order record and requests fulfilment asynchronously. The customer-facing application receives the API response immediately; warehouse work and customer notification occur later.

**Illustrative interface description:**

```http
POST /v1/orders HTTP/1.1
Content-Type: application/json
X-Client-Request-Id: checkout-481

{
  "customerId": "cust-042",
  "items": [{ "sku": "book-001", "quantity": 1 }],
  "paymentAuthorizationId": "pay-auth-720"
}
```

```http
HTTP/1.1 201 Created
Content-Type: application/json
Location: /v1/orders/ord-701
X-Request-Id: req-913

{
  "orderId": "ord-701",
  "orderStatus": "accepted",
  "fulfilmentStatus": "pending"
}
```

Checkout currently displays “Order confirmed” whenever it receives a 201 response. The warehouse consumer expects one fulfilment instruction for each logical order. Support can search by the returned order identifier but cannot currently search by the client request identifier. A customer can resubmit after a slow connection. A previous incident created two fulfilment instructions after a retry, although one order record was visible to checkout.

**Constraints:** Treat all identifiers, behaviour, and data as fictional. Do not write code, select an API client, create a test suite, inspect a real service, or claim that the supplied examples prove production behaviour. Do not propose logging payment data or customer information.

**Tasks:**

1. Identify the API boundary, its provider, its named consumers, and the customer-relevant outcome.
2. Describe what the 201 response can credibly establish and what it cannot establish.
3. Map the request through validation, processing, state transition, side effects, response, and downstream outcome.
4. Identify at least six assumptions about semantics, timing, data, repetition, consumer behaviour, or diagnostics.
5. Identify the state changes and side effects that matter, including one that must not occur twice.
6. Propose functional, contractual, operational, and diagnostic evidence questions. State the boundary and limitation for each.
7. Identify API-specific testability concerns, including safe correlation and state observation.
8. Write a short residual-risk statement for a decision-maker. Distinguish observed facts from assumptions and proposed evidence.

**Expected artifact:** A three- to four-page **API Boundary Evidence Review** containing a context map, request-to-outcome model, assumption and evidence table, testability concerns, and residual-risk statement.

**Reflection:** Which wording in the customer interface is least supported by the immediate API response? Which observation would most improve the team’s ability to investigate a repeated-submission concern without exposing sensitive data?

**Portfolio relevance:** This artefact demonstrates API-boundary reasoning, evidence design, consumer awareness, and honest residual-risk communication. Use fictional or safely anonymised material only.

## Further Reading

- [Part III, Chapter 6 — Test Levels, Boundaries, and Integration Evidence](../../part-03-software-testing/chapters/chapter-06-test-levels-boundaries-and-integration-evidence.md) — complementary guidance on selecting an evidence boundary.
- [Part III, Chapter 9 — Service, API, and Distributed-System Testing Strategy](../../part-03-software-testing/chapters/chapter-09-service-api-and-distributed-system-testing-strategy.md) — wider service and distributed-interaction context.

## References

[^iso25010]: International Organization for Standardization and International Electrotechnical Commission. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). Published 2023. Accessed 2026-08-10.
[^rfc9110]: Fielding, R., Nottingham, M., and J. Reschke, eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). IETF, June 2022. Accessed 2026-08-10.
[^openapi]: OpenAPI Initiative. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html). Accessed 2026-08-10.
[^iso-29119-2]: ISO/IEC/IEEE. [ISO/IEC/IEEE 29119-2:2021 — Software and systems engineering — Software testing — Part 2: Test processes](https://www.iso.org/standard/79428.html). 2021.
[^swebok]: IEEE Computer Society. [Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf).

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain why an API is an evidence boundary rather than merely a destination for a request.
- [ ] State what a response establishes and what state, side effect, or consumer outcome it leaves unknown.
- [ ] Identify consumer and provider assumptions that deserve evidence.
- [ ] Formulate an API-quality question with a boundary, oracle, limitation, and residual risk.
- [ ] Identify API-specific testability needs without exposing sensitive information.

**Next:** [Chapter 2 — Interface Semantics: HTTP, Representations, and API Styles](chapter-02-interface-semantics-http-representations-and-api-styles.md).
