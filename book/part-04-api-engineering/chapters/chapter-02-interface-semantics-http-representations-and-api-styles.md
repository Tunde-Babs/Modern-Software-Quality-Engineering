# Chapter 2 — Interface Semantics: HTTP, Representations, and API Styles

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 2 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapter 1 and working familiarity with requests, responses, and structured data |
| Estimated study time | 170 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A status code, method, or JSON payload is not self-explanatory. Interface semantics make clear what participants may infer, what they must not infer, and what evidence is needed when the outcome matters.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, the fictional retailer introduced in Chapter 1. Its checkout application submits an order and receives a 202 response with a body that says “status: accepted.” The response also contains a location for tracking the submitted work and a Retry-After header.

The checkout team interprets the response as “the order is confirmed” and sends the customer a confirmation message. A support colleague later sees that payment review rejected the order. The order-tracking resource contains that outcome, but the customer-facing message has already made a stronger claim than the interface supported.

No HTTP request failed. The provider returned a valid response, and the consumer processed it successfully. The quality problem is semantic: the teams gave “accepted” and “confirmed” different meanings. A Quality Engineer helps them ask what the method, status, representation, headers, and later state actually promise. That question is more useful than deciding whether the 202 result should simply be asserted in another automated check.

## Introduction

Chapter 1 established that an API response is bounded evidence. This chapter examines the meanings that shape that evidence for HTTP APIs and introduces the equivalent questions for other API styles. The aim is not to memorize a catalogue of status codes or to turn HTTP into a CRUD mnemonic. It is to read an interface as a set of behavioural promises.

HTTP supplies standardized semantics for requests, responses, methods, status codes, and representation metadata.[^rfc9110] An application still defines its resource model, business rules, authorization policy, state transitions, and customer outcomes. Those two layers must remain distinct. A method name cannot tell a consumer whether a business workflow is complete; an application-specific status field cannot override what the HTTP response means.

The examples use HTTP because its protocol vocabulary is widely encountered. They do not imply that all APIs are HTTP, that all HTTP APIs are RESTful, or that every API should expose the same evidence. Chapter 3 will address contract structure and evolution. This chapter concentrates on the semantic questions that should exist before a test suite, an interface description, or a compatibility decision can be trustworthy.

## Why This Chapter Matters

Interface defects are often interpretation defects. A provider might return a technically valid response while a consumer assumes a different completion state, retry rule, caching behaviour, error action, or representation meaning. Local checks can pass on both sides while the integration still harms a customer.

HTTP gives teams a useful shared vocabulary, but it is easy to flatten that vocabulary into shorthand:

- treating **POST** as “create” in every case;
- treating every 2xx response as a completed business outcome;
- treating **PUT** as a generic partial update;
- treating “safe” as “causes no side effect at all”;
- treating “idempotent” as an automatic permission to retry any request; or
- treating JSON shape as the whole contract.

These shortcuts create weak or misleading evidence. A Quality Engineer needs enough protocol literacy to challenge them and enough systems thinking to ask what the application contract adds. The goal is precise shared meaning, not protocol pedantry.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why API semantics must be understood before an HTTP response can serve as evidence;
- distinguish an HTTP request target, method, header, representation, response, and application outcome;
- explain the intended semantics of GET, HEAD, POST, PUT, DELETE, and PATCH without reducing them to simplistic CRUD labels;
- distinguish safe and idempotent request semantics, including their limits for retries;
- select relevant HTTP success and error semantics for an API-quality question;
- explain how representation metadata, content negotiation, caching, validators, and conditional requests affect interpretation;
- distinguish structural representation correctness from semantic correctness;
- recognise how REST, GraphQL, RPC, gRPC, webhooks, and event interfaces change the evidence questions without creating a hierarchy of API styles;
- identify protocol assumptions that a consumer or provider should make explicit; and
- apply semantic reasoning to an API interface review.

## Interface Semantics Before Assertions

An assertion such as “the response status is 200” may be correct and still say little. Before selecting an expected result, a team should know what the interaction means to both participants.

For an HTTP API, an interface claim commonly includes:

| Element | Question a Quality Engineer should ask |
|---|---|
| Request target | What resource, capability, or processing target does this URI identify? |
| Method | What request semantics does the caller ask the target to apply? |
| Request headers | Which representation, credential, condition, preference, or correlation information changes interpretation? |
| Request representation | What data and intent does the provider receive, and what constraints make it meaningful? |
| Response status | What is the immediate protocol outcome of the request? |
| Response headers | What metadata changes how the response is interpreted, repeated, cached, or investigated? |
| Response representation | What state, result, error, or next action is represented—and what does it not say? |
| Application outcome | What provider, consumer, or customer state can be claimed after this interaction? |

The list is not a test-case template. It is a way to locate ambiguity. In Chapter 1’s terms, it helps turn an endpoint check into an evidence question with an observation, oracle, and limitation.

For example, a request may be syntactically valid while using an unacceptable representation type. A response may have a successful status yet explicitly say that the work is pending. A consumer may read an application field but ignore a response header that governs when it should next ask for progress. No single assertion covers all of those meanings.

## The HTTP Request–Response Model

HTTP is a stateless application protocol: each request carries the information needed for the server to understand that request, subject to the application’s wider authentication and state arrangements. It does not mean the application has no state. An order API can keep order state, use sessions or credentials, and start asynchronous work; HTTP’s request semantics still describe the interaction that occurred.[^rfc9110]

An HTTP request includes a method, target URI, header fields, and optional content. A response includes a status code, header fields, and optional content. HTTP calls message content a **representation** when it is intended to represent the current or desired state of a resource. A JSON document is therefore not “the resource” itself; it is one representation whose media type and meaning matter.

Consider this fictional Atlas request:

~~~http
GET /v1/orders/ord-701 HTTP/1.1
Accept: application/json
X-Correlation-Id: support-44
~~~

The target identifies the order resource that Atlas has chosen to expose. The GET method asks for its current selected representation. The Accept header says which response media types the client can process. The correlation header is an application-defined diagnostic convention, not an HTTP guarantee.

A possible response is:

~~~http
HTTP/1.1 200 OK
Content-Type: application/json
ETag: "order-701-v4"
Cache-Control: private, max-age=30
X-Correlation-Id: support-44

{
  "orderId": "ord-701",
  "orderStatus": "accepted",
  "fulfilmentStatus": "pending"
}
~~~

The response says more than “request worked.” Its status, media type, validator, cache directive, correlation convention, and fields each contribute meaning. It still does not automatically prove that payment review or fulfilment is complete. That depends on the contract for the represented state values and any later observations.

## Resources and Representations

A **resource** is a conceptual target of an HTTP request: for example, the current state of an order, a collection of orders, or a processing-status resource. A **representation** is information sent in a message to represent that target or express a desired state. One resource can have more than one representation, and a representation can change over time.

This distinction prevents several errors:

- A consumer should not infer that a JSON object is the provider’s stored data model.
- A field that is absent, null, defaulted, or derived can carry different meanings; its meaning is not supplied by JSON syntax.
- The same order might be represented differently for a customer, an internal operations screen, or a machine consumer, subject to the relevant authorization and contract.
- A representation that is current when sent can later become stale, particularly when caching is permitted.

JSON is a common interchange format, not a business contract by itself.[^rfc8259] JSON confirms syntax and data types only to the extent that the application has defined and validated them. Consumers should not infer meaning from member ordering, formatting, or an undocumented omitted value. Arrays are ordered; object-member order should not be treated as application behaviour unless the interface separately makes such an ordering meaningful.

The key question is not “does the JSON parse?” It is “what can this representation truthfully tell this consumer now, and what must the consumer obtain elsewhere?”

## Method Semantics Are Behavioural Promises

HTTP methods carry standardized request semantics. The resource owner defines the application behaviour within those constraints. A method should be selected because its semantics match the interface’s intended action, not because a CRUD table made it familiar.

| Method | Core HTTP meaning | Evidence questions and cautions |
|---|---|---|
| **GET** | Requests the current selected representation of the target resource. | Is the selected representation the right one for this consumer? Are cache and authorization semantics clear? A GET response can be correct while its represented business state is pending. |
| **HEAD** | Has the same request semantics as GET, but the server does not send message content in the response. | Does metadata such as content type, length, caching information, or validators correspond appropriately to GET? HEAD is not a substitute for proving representation meaning. |
| **POST** | Requests that the target resource process the enclosed representation according to the target’s own semantics. | The target may create a subordinate resource, submit work, append data, or perform another defined action. Do not assume POST always means “create” or always completes synchronously. |
| **PUT** | Requests that the state of the target resource be created or replaced with the enclosed representation. | Is the request a complete desired representation, and does the provider make its constraints clear? PUT is not a generic label for partial change. |
| **DELETE** | Requests removal of the association between the target resource and its current functionality. | Does success mean the association was removed, accepted for later removal, or represented with a result? Do not equate DELETE automatically with immediate erasure of every stored trace. |
| **PATCH** | Applies partial modifications to a target resource using a defined patch format and application semantics. | Which patch document is accepted, what does each operation mean, and what happens on conflict? PATCH is specified separately from core HTTP and is not automatically idempotent.[^rfc5789] |

The table deliberately avoids “GET = read, POST = create, PUT = update, DELETE = delete.” That mnemonic may be useful as a first exposure to CRUD, but it loses the semantics that determine evidence. A POST can create a resource, accept a command, or begin a workflow. A successful DELETE might use 202 when processing has been accepted but is not complete, 204 when no response content is needed, or 200 with a representation of the result.[^rfc9110]

### Safe and idempotent semantics

HTTP calls a method **safe** when the client does not request a state change by the target resource. A safe request can still cause incidental effects such as logging, accounting, rate limiting, or cache population. “Safe” therefore does not mean that the server does nothing or that a request has no observable operational effect. It means the requested semantics are retrieval or another non-state-changing interaction from the client’s perspective.[^rfc9110]

HTTP calls a method **idempotent** when repeating an identical request has the same intended effect as making it once. GET, HEAD, PUT, and DELETE are defined as idempotent methods; POST is not. An idempotent interaction can still produce different logs, timestamps, or response details on separate attempts. Its relevant intended effect is what stays equivalent.[^rfc9110]

This matters most when a caller has an uncertain outcome. If a connection fails after the caller sends a request, it may not know whether the provider received or completed it. Protocol-defined idempotency permits cautious retry reasoning for the relevant methods, but it does not prove that every application action is safe to repeat. A POST operation can be designed to be repeatable through an application-level rule, such as a documented client-intent key. That is an API contract decision, not a property inherited from the word POST. Conversely, a PATCH operation may be idempotent in a specific design but is not automatically so.

Quality Engineers should ask: What is the intended state and side-effect rule when the same client intent is delivered again? What evidence distinguishes “not received,” “received but pending,” and “completed”? Detailed idempotency design and concurrent-state control are addressed later in Part IV.

## Status Codes Express Protocol Outcomes

Status codes classify the response to the request; they do not replace an application’s state model. A 2xx status says that the request was successfully received, understood, and accepted according to the applicable HTTP semantics. It does not, on its own, say that a customer goal has been achieved. A 4xx or 5xx status should likewise be interpreted with the request, target, representation, and safe error information rather than as a universal diagnosis.[^rfc9110]

Use the most relevant status semantics for the interaction. The following table is intentionally selective; it is not a status-code catalogue.

| Status | Relevant semantic claim | Quality-engineering question |
|---|---|---|
| **200 OK** | The request succeeded; response content, if present, represents the result according to the method and contract. | What result does the representation describe, and is it current enough for the consumer’s decision? |
| **201 Created** | The request succeeded and resulted in creation of one or more resources; the primary resource is normally identified by Location or the target URI. | What was created, what state is it in, and does creation imply completion of later work? |
| **202 Accepted** | The request was accepted for processing but processing is not complete and might not ultimately be acted upon. | What tracking, pending, failure, or reconciliation behaviour allows a consumer to learn the eventual result? |
| **204 No Content** | The request succeeded and no response content is sent. | What changed, if anything, and what observation can establish it when no representation is supplied? |
| **400 Bad Request** | The server cannot or will not process the request because it is perceived as a client error. | Is the rejected condition understandable enough for the consumer to act safely without exposing internals? |
| **401 Unauthorized** | The request lacks valid authentication credentials for the target resource; a challenge is required. | Is authentication failure distinct from authorization policy and represented without leaking sensitive detail? |
| **403 Forbidden** | The server understood the request but refuses to fulfil it. | Is the application’s refusal clear enough for a permitted next action without revealing protected information? |
| **404 Not Found** | The origin server did not find a current representation for the target resource or is unwilling to disclose that one exists. | Does the consumer need to distinguish absence from concealment, and does the contract make that distinction safely? |
| **409 Conflict** | The request conflicts with the current state of the target resource. | Which state rule conflicts, and what recovery or refreshed representation is safe for the consumer? |
| **412 Precondition Failed** | A condition supplied in the request, such as If-Match, evaluated to false. | Does the failed condition protect against a stale assumption, and can the consumer obtain the state needed to decide next? |
| **422 Unprocessable Content** | The server understands the content type and syntax but cannot process the contained instructions. | Does the error distinguish a semantic request problem from a malformed representation when that distinction matters? |
| **429 Too Many Requests** | The user agent has sent too many requests in a given amount of time. | Is any retry guidance proportionate, and does the client avoid amplifying the limiting condition? |
| **500 Internal Server Error** | The server encountered an unexpected condition that prevented fulfilment. | Which safe diagnostic evidence can distinguish an application failure from an unobserved successful effect? |
| **502 Bad Gateway**, **503 Service Unavailable**, **504 Gateway Timeout** | A gateway or service condition prevented normal fulfilment; 503 can indicate temporary overload or maintenance. | What does the consumer know about whether the original operation was applied, and what recovery is safe? |

The table is not a rule that every API must expose every listed distinction. It is a prompt to make consequential distinctions explicit. For example, 202 is valuable precisely because it avoids falsely claiming completed processing. A consumer that displays “confirmed” after a 202 response is making an application claim that must come from some other contract or observation.

### Error representations are part of the interface

An error response is not merely a failed happy path. It is a representation that should help an authorised consumer interpret the condition and take a safe next action. Status, error content, and relevant headers should agree. A detailed body that contradicts the status code, includes secrets, or invents a retry instruction can be more harmful than a concise response.

RFC 9457 defines a standard format for problem details, including the media type application/problem+json.[^rfc9457] A team may use it when it fits the interface, but adopting its shape does not settle application semantics. The provider must still define which error conditions exist, what a consumer may rely on, and how much diagnostic information is safe to disclose. Chapter 7 addresses API security and authorization depth; this chapter’s concern is the semantic boundary.

## Headers and Representation Metadata

Headers often carry semantics that are invisible when a test looks only at a JSON body. Some are standardized HTTP fields; others are application conventions. A Quality Engineer should know which is which.

| Header or convention | Core purpose | Evidence concern |
|---|---|---|
| **Content-Type** | Identifies the media type of message content, such as application/json. | Does the provider label the representation it actually sends, and does the consumer support that media type? |
| **Accept** | Indicates response media types the client can accept. | When a response form matters, does the provider select an acceptable representation or explain why it cannot? |
| **Authorization** | Carries credentials used by an application’s authentication scheme. | Treat it as sensitive transport metadata; do not use logs, examples, or test artifacts that expose real credentials. |
| **Retry-After** | Gives a time after which a recipient may retry in selected response contexts. | Does client behaviour distinguish a suggested delay from proof that repetition is safe? |
| **ETag** | Supplies a validator for a selected representation. | Is the validator used only with the representation and conditions its contract defines? |
| **If-Match** | Makes a request conditional on a current validator matching one held by the client. | Does a failed precondition prevent a stale update and lead to an interpretable recovery path? |
| **X-Correlation-Id** or similar application field | Associates related observations across components or support interactions. | Is the convention documented, safe to expose, and sufficient to find evidence without being mistaken for a root-cause explanation? |

The Authorization field has no universal business meaning beyond carrying credentials; the selected authentication scheme and application policy determine the rest. Similarly, a correlation identifier is not a standard substitute for HTTP tracing, an entitlement, or a transaction identifier. Names such as X-Request-Id and X-Correlation-Id are common conventions, not guarantees that unrelated APIs interpret identically.

## Content Negotiation, Caching, and Conditional Requests

**Content negotiation** is the process of selecting a representation based on request information such as Accept. It matters when one resource can be represented in more than one media type, language, or format. The evidence question is not merely whether a server returns JSON. It is whether the consumer received a supported representation with the intended meaning and metadata.

HTTP caching permits a cache to reuse a stored response under defined conditions, reducing latency and load.[^rfc9111] This makes caching a quality concern because a consumer can receive a response that is valid for the applicable caching rules but no longer suitable for an unstated business assumption. Teams should specify freshness needs for consequential state rather than assume every GET reaches the origin service.

An **ETag** is a validator associated with a selected representation. A client can use **If-Match** to say, in effect, “perform this request only if the representation I know is still current enough under this validator.” If the condition evaluates to false, the normal result is 412 Precondition Failed. RFC 9110 also permits a 2xx response for a state-changing request when the server can determine that the requested change has already succeeded. This can support a contract that detects a stale assumption, but it does not by itself resolve the domain decision about what to merge, replace, abandon, or ask a user to review.[^rfc9110]

For API Quality Engineering, the useful questions are:

- Which representations may be cached, by whom, and for how long?
- What customer or consumer decision becomes unsafe if a representation is stale?
- Does an interface use validators and conditions consistently enough to make stale-state conflicts visible?
- Are conditional and cache-related behaviours observable in a controlled environment without claiming they prove production topology?

Detailed concurrency and state-management design belongs to later chapters. Here, retain the boundary: protocol metadata affects what a representation means at the moment a consumer uses it.

## REST Is an Architectural Style, Not a Synonym for API

REST is an architectural style described by constraints such as a uniform interface, client–server separation, stateless interaction, cacheability, and layered systems.[^fielding-rest] An HTTP API that returns JSON is not automatically RESTful, and RESTfulness is not a maturity score for an API.

Resource-oriented HTTP interfaces can benefit from clear method, representation, caching, and status semantics. That is a reason to understand HTTP, not a reason to force every business operation into a resource-shaped URI. A provider might expose a resource representation for an order and a separate processing target for a complex submission. The Quality Engineering question remains: can consumers understand the operation’s meaning, outcomes, errors, and change boundaries?

Avoid using “REST API” as a substitute for a contract statement. “The API is REST” does not say whether an order is created, accepted, payable, cancellable, or fulfilled; whether a request can be repeated; or what error a consumer should handle.

## Other API Styles Change the Evidence Questions

HTTP is not the only interface vocabulary. The same Chapter 1 discipline applies to GraphQL, RPC and gRPC, webhooks, and event-driven interfaces, but the observable unit and failure model can differ.

| Style | Typical interaction focus | Questions that deserve evidence |
|---|---|---|
| **Resource-oriented HTTP** | Resources, methods, representations, status, headers, and links or locations. | What does the method and status mean? Which representation, cache rule, condition, or state transition is relied on? |
| **GraphQL** | A client submits a typed query or mutation and receives selected fields, potentially with partial data and errors. | Which fields are authoritative for the decision? How are partial result and error semantics interpreted? Does the client rely on resolver behaviour not stated by the schema? |
| **RPC or gRPC** | A named operation with typed request and response messages, sometimes streaming. | What operation outcome, error model, deadline, stream termination, and retry rule does the caller rely on? |
| **Webhook** | A provider delivers a notification to a consumer-controlled endpoint. | What event occurred, how is delivery authenticated and correlated, what is the delivery and replay rule, and how is consumer acknowledgement interpreted? |
| **Event interface** | Producers publish facts or commands for independent consumers, often asynchronously. | What does delivery, ordering, duplication, schema meaning, and eventual processing establish for each consumer? |

This is awareness, not a comparative curriculum. Chapters 5, 8, and 9 will deepen the relevant patterns. The key lesson is that “API testing” cannot be one uniform set of request/response checks. The interface style changes what must be controlled, observed, and interpreted.

## Structural and Semantic Correctness

Structural correctness asks whether a representation has the agreed form: for example, valid JSON, expected media type, and values that can be parsed into the agreed data types. Semantic correctness asks whether the message means the right thing for this operation, state, consumer, and time. Neither makes the other unnecessary.

| Structurally plausible result | Semantic question still open |
|---|---|
| A 200 response contains a valid JSON order object. | Does its **orderStatus** mean complete, accepted, pending review, or something else? |
| A 204 response has no body after DELETE. | Was the requested association removed now, accepted for later work, or merely hidden from this consumer? |
| A 422 response has a well-formed problem-details body. | Which instruction cannot be processed, and can the consumer safely correct it? |
| A GET response carries a valid ETag. | Is the representation fresh enough for the business decision, and is the conditional-update rule clear? |

This distinction is a guard against shallow evidence. A schema-shaped payload, a standard status, or a correctly named header may establish an important protocol fact, but not the application claim a consumer needs. Chapter 3 develops contract structure and compatibility; do not solve those topics by adding undocumented semantics to examples.

## Challenge Protocol and Consumer Assumptions

Semantic defects often begin with a sentence that sounds reasonable but was never made explicit.

| Assumption | Question to make explicit |
|---|---|
| “A 200 means the customer’s goal is complete.” | Which business state does the representation confirm, and which work may still be pending? |
| “POST may be retried after any timeout.” | What happened if the provider received the request, and what repeatability rule covers the client intent? |
| “PUT changes only supplied fields.” | Does the interface define replacement, partial modification, or another operation? |
| “The JSON body is all the consumer needs.” | Which media type, cache, conditional, location, retry, or diagnostic header changes interpretation? |
| “A missing resource is always absent.” | Could authorization or concealment produce the same observed result, and how should the consumer behave safely? |
| “The callback was delivered once.” | What do acknowledgement, retry, ordering, and duplicate delivery mean in this interface? |

The goal is not to force every implementation to reveal internal decisions. It is to make the promised behaviour sufficient for a consumer to act safely, and to identify the observation needed when it is not.

## QA → QE Transition

| Existing QA activity | Expanded Quality Engineering practice |
|---|---|
| Assert a method and status code. | State the protocol and application claim that combination supports, plus what it leaves unknown. |
| Check a JSON response. | Review representation meaning, relevant metadata, consumer interpretation, and state freshness. |
| Add a retry test after a timeout. | Identify the uncertain outcome, idempotency rule, duplicate-side-effect risk, and safe recovery evidence. |
| Verify an error response. | Ask whether the status, body, headers, action, and diagnostic limit form a safe contract. |
| Label an API RESTful. | Examine its actual resource, operation, state, and consumer semantics. |

## Engineering Perspective

Protocol semantics are design constraints that affect safe change. Ambiguous completion, status-body disagreement, undocumented retry behaviour, cache-blind consumers, and unobservable conditional failures are interface-design risks, not merely missing assertions.

Quality Engineers contribute by connecting a consumer decision to the exact semantic promise it requires. The remedy may be a clarified state representation, a different operation contract, explicit retry guidance, a safe tracking resource, or evidence at a later boundary. It is not automatically another endpoint check.

## Industry Perspective

RFC 9110 is the primary source for HTTP method, status, field, and representation semantics; RFC 9111 specifies HTTP caching; RFC 5789 specifies PATCH; and RFC 9457 defines problem details.[^rfc9110][^rfc9111][^rfc5789][^rfc9457] RFC 6585 defines 429 Too Many Requests.[^rfc6585] These standards define protocol behaviour, not an organisation’s domain vocabulary, retry policy, or customer promise.

The API-semantic review prompts in this chapter are MSQE educational framing. They are vendor-neutral and intentionally precede OpenAPI, JSON Schema, compatibility, security, and tooling practices taught later in Part IV.

## Common Misconceptions

### “POST means create, and 200 means complete.”

POST asks the target to process a representation according to target-specific semantics. A successful status must be read with the operation’s contract and representation. Creation, acceptance, and complete customer outcome are different claims.

### “Safe means that no side effect occurs.”

Safe means the client did not request a state change. Incidental logging, accounting, and cache effects can still occur. Do not make a safe method carry an unsafe application action.

### “Idempotent means retry is always harmless.”

It concerns the intended effect of a repeated request, not every log or response detail. A retry after an unknown outcome still needs an application-aware rule and evidence.

### “An HTTP API that returns JSON is REST.”

REST is an architectural style. JSON and HTTP alone do not specify resource semantics, consumer compatibility, or application outcome.

### “A successful JSON response is enough evidence.”

It can establish a selected structural and immediate protocol result. It cannot automatically establish correct state, freshness, downstream processing, or consumer interpretation.

## Summary

Interface semantics turn protocol elements into usable evidence. HTTP methods, statuses, headers, representations, cache rules, and conditions say what occurred at the request boundary. Application contracts say what that result means for state and customer outcomes. Quality Engineering keeps those claims separate, then connects them deliberately.

The next step is not to memorize more HTTP. It is to make method, status, representation, error, retry, and freshness assumptions explicit enough that providers and consumers can act safely and evidence can challenge consequential ambiguity.

## Key Takeaways

- HTTP semantics and application semantics work together; neither replaces the other.
- GET, HEAD, POST, PUT, DELETE, and PATCH should be chosen and evaluated by their behavioural meaning, not a CRUD mnemonic.
- Safe methods can have incidental effects; idempotent methods have equivalent intended effects, not necessarily identical responses.
- A 202 response explicitly avoids claiming that processing is complete.
- Headers such as Content-Type, Accept, Retry-After, ETag, and If-Match can materially change how an API result is interpreted.
- JSON shape and status codes establish limited structural or protocol facts; semantic correctness needs an explicit contract.
- REST is one API style. GraphQL, RPC, gRPC, webhooks, and events require parallel evidence discipline with different observations.

## Review Questions

1. Why is an assertion against an HTTP status code insufficient without an interface claim?
2. What is the difference between a resource and a representation?
3. Why is POST not a universal synonym for creation?
4. Explain why a safe method can still have operational side effects.
5. What does idempotency establish, and what does it not establish after an uncertain request outcome?
6. How do 201, 202, and 204 support different claims?
7. What role can an ETag and If-Match pair play in exposing a stale assumption?
8. Give an example of a representation that is structurally valid but semantically misleading.

## Interview Questions

1. How would you explain the difference between a 202 response and a completed business outcome?
2. A client retries POST after a timeout and a duplicate side effect appears. What questions would you ask before proposing a fix?
3. How would you review a consumer that ignores Content-Type, Retry-After, and ETag?
4. When would a 412 response be useful evidence rather than merely a failed request?
5. How do HTTP quality questions differ from webhook or event-interface quality questions?

## Practical Exercise

### Interpret an API Contract Through Protocol Semantics

**Objective:** Produce an **Interface Semantics Review** for the fictional Atlas order-submission boundary. Assess meaning and evidence; do not write code or test cases.

**Illustrative interactions:**

~~~http
POST /v1/orders HTTP/1.1
Content-Type: application/json
Accept: application/json

{ "customerId": "cust-042", "items": [{ "sku": "book-001", "quantity": 1 }] }

HTTP/1.1 202 Accepted
Content-Type: application/json
Location: /v1/order-submissions/sub-88
Retry-After: 5

{ "submissionId": "sub-88", "status": "accepted" }
~~~

~~~http
GET /v1/orders/ord-701 HTTP/1.1
Accept: application/json
If-Match: "order-701-v4"

HTTP/1.1 412 Precondition Failed
Content-Type: application/problem+json
~~~

**Tasks:**

1. State what each method, target, success or error status, header, and representation can establish.
2. Identify ambiguous or missing semantics, especially around 202, the tracking location, the retry instruction, and the 412 result.
3. Determine which claims are structural, protocol-level, semantic, state-related, or downstream.
4. Identify at least six consumer or provider assumptions and propose proportionate evidence questions for each.
5. Explain the relevant safe and idempotent considerations without assuming that POST is automatically repeatable.
6. Record the information a customer-facing consumer may safely communicate after the 202 response.
7. Write a brief residual-risk statement that separates observed facts from proposed contract clarification.

**Expected artifact:** A two- to three-page Interface Semantics Review containing an interaction map, semantic-claim table, assumption and evidence table, safe communication recommendation, and residual-risk statement.

**Constraints:** All Atlas details are fictional. Do not select tools, create an API specification, design authentication, propose versioning, or infer that a status code alone proves a production outcome.

## Further Reading

- [Chapter 1 — API Quality Engineering: Boundaries, Outcomes, and Evidence](chapter-01-api-quality-engineering-boundaries-outcomes-and-evidence.md) — applies interface meaning to an API evidence boundary.
- [Part III, Chapter 9 — Service, API, and Distributed-System Testing Strategy](../../part-03-software-testing/chapters/chapter-09-service-api-and-distributed-system-testing-strategy.md) — complementary context for interface interactions across services.

## References

[^rfc9110]: Fielding, R., Nottingham, M., and J. Reschke, eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). IETF, June 2022. Accessed 2026-08-10.
[^rfc9111]: Nottingham, M., Fielding, R., and J. Reschke, eds. [RFC 9111 — HTTP Caching](https://www.rfc-editor.org/rfc/rfc9111.html). IETF, June 2022. Accessed 2026-08-10.
[^rfc5789]: Dusseault, L., and J. Snell. [RFC 5789 — PATCH Method for HTTP](https://www.rfc-editor.org/rfc/rfc5789.html). IETF, March 2010. Accessed 2026-08-10.
[^rfc9457]: Nottingham, M., Wilde, E., and S. Dalal. [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html). IETF, July 2023. Accessed 2026-08-10.
[^rfc6585]: Nottingham, M., and R. Fielding. [RFC 6585 — Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585.html). IETF, April 2012. Accessed 2026-08-10.
[^rfc8259]: Bray, T., ed. [RFC 8259 — The JavaScript Object Notation (JSON) Data Interchange Format](https://www.rfc-editor.org/rfc/rfc8259.html). IETF, December 2017. Accessed 2026-08-10.
[^fielding-rest]: Fielding, R. T. [Chapter 5 — Representational State Transfer (REST)](https://ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm). *Architectural Styles and the Design of Network-based Software Architectures*, University of California, Irvine, 2000. Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish protocol semantics from application and customer-outcome claims;
- [ ] explain safe and idempotent semantics without making unsafe retry assumptions;
- [ ] interpret relevant methods, statuses, headers, and representations together;
- [ ] identify structural correctness that is insufficient to establish semantic correctness;
- [ ] formulate evidence questions for HTTP and non-HTTP interface styles; and
- [ ] document API-semantic assumptions and residual risk without overstating a passing observation.

**Next:** Chapter 3 will examine API contracts, meaning, compatibility, and evolution.
