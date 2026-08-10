# Chapter 8 — API Reliability, Diagnostics, and Performance Evidence

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 8 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–7 and familiarity with API contracts, state transitions, dependencies, asynchronous completion, and retries |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Reliability evidence is credible only when a team can say what happened, under which conditions, how long it took, and what remains uncertain.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. Its order API usually confirms an order quickly. During a promotion, however, the payment provider becomes slow. Some callers end their requests before Atlas receives the provider response; a few retry. Atlas records a generic server error for several requests, while the payment provider records a successful charge for one of them. A support engineer has an order identifier but cannot connect it to the original request, the provider interaction, or the later fulfilment event.

The immediate question is not simply whether the API was available. Some requests received responses, some did not, and one may have produced a customer charge despite the caller seeing a timeout. The engineering questions are more precise: what was the observable contract behaviour, what timing condition applied, where did the operation spend time, which outcome is known, what can be reconstructed safely, and which uncertainty must be communicated?

Chapter 7 established that dependent and asynchronous work extends an API outcome beyond the first response. This chapter asks how dependable, timely, and diagnosable that resulting behaviour is. It treats measurement as evidence in context, not as a collection of universal thresholds or an operational-tooling exercise.

## Introduction

An API is reliable at its boundary when it provides useful outcomes, predictable and safe failure, appropriate timing, and enough evidence to investigate material problems. These qualities are related but not interchangeable: an API can be fast but semantically wrong, available but unusable, or apparently recovered while creating duplicate work.

ISO/IEC 25010 identifies **reliability** and **performance efficiency** as product quality characteristics.[^iso25010] It does not classify observability, correlation, logging, tracing, or testability that way. This chapter treats those as **engineering capabilities** for observing and investigating API behaviour, rather than proof that the interface is reliable.

This is not a load-testing, capacity-planning, observability-platform, or SRE-operations guide. It develops the preceding judgement: what expectation to clarify, condition to represent, and limitation to state.

## Why This Chapter Matters

A functional API check often asks whether a request receives the expected response. That question remains useful, but it is insufficient where timing, concurrency, dependency behaviour, retry, saturation, or incomplete diagnostic information can change the customer outcome. A release decision based only on a sequence of successful calls may fail to reveal whether an API remains understandable when it slows down, reaches a limit, receives an unavailable dependency response, or returns an uncertain result after a timeout.

The opposite mistake is to treat a dashboard, a single latency number, or a successful recovery demonstration as conclusive. Measurements without a defined scenario can be misleading. A fast request from a quiet test environment cannot establish peak-period behaviour. An average can conceal a smaller set of very slow customer experiences. A trace can reveal one path but cannot prove every failure is attributable. Quality Engineering makes these limits explicit so that evidence supports a proportionate decision rather than an overconfident claim.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish reliability, availability, performance efficiency, and diagnostic capability at an API boundary;
- identify timing, throughput, concurrency, timeout, and dependency assumptions relevant to an API-quality question;
- explain why an average response time is incomplete performance evidence;
- reason about timeout, retry, rate-limit, degraded-mode, and recovery behaviour without assuming a universal design;
- define diagnostic evidence that is detectable, distinguishable, attributable, correlated, and safe to retain;
- distinguish a public error contract from internal diagnostic evidence;
- formulate an API reliability and diagnostic evidence plan with explicit operating conditions and limitations; and
- communicate residual reliability and performance uncertainty to an accountable decision-maker.

## Reliability at an API Boundary

Reliability is not one number and it is not synonymous with a server process being reachable. At an API boundary, a useful reliability question joins several observable concerns:

| Concern | Boundary question | Example evidence | Important limitation |
|---|---|---|---|
| Expected outcome | Does the operation produce the stated result when its conditions hold? | Contract-conformant response and verified state transition. | One success does not represent relevant failure conditions. |
| Predictable failure | Does the API communicate a usable failure without misrepresenting the outcome? | Stable status, problem representation, and documented next action. | A well-formed error does not make the underlying condition harmless. |
| Timing | Is the outcome or failure returned within the expectation for this scenario? | Measured elapsed time with workload and environment recorded. | A measurement is not transferable to every environment. |
| Recovery | Can a transient or dependent failure be handled without unsafe duplicate effects? | Bounded retry/reconciliation evidence and final state. | One recovery path does not establish all recovery behaviour. |
| Consistency | Does equivalent context receive compatible contract behaviour? | Repeated observations across selected inputs and conditions. | Compatibility does not guarantee absence of all implementation defects. |

This chapter uses **reliability evidence** to mean observations that bear on such concerns under a stated context. It is not a claim that an API will never fail. It is also not a promise that every product needs the same recovery mechanism. A payment operation, a report export, a catalogue lookup, and a safety-relevant action can have different acceptable outcomes, timings, and uncertainty policies.

### Reliability and Availability

**Availability** concerns whether a service or function can be used when needed under an agreed definition. **Reliability** also asks whether that available behaviour is correct, predictable, and recoverable for its intended use. A generic error returned immediately may make an endpoint technically available while failing its consumer purpose.

State the boundary being considered: connection acceptance, authenticated response, completed order, accurate processing state, or safe recovery. Each needs different evidence. Google’s SRE guidance likewise connects monitoring to user-visible service behaviour.[^google-monitoring] It is practitioner guidance, not an MSQE requirement.

## Performance Evidence in Context

Performance is quality evidence when time, volume, or resource pressure affects an API’s intended outcome. It is not evidence merely because a tool produced a chart. A meaningful question specifies the interaction, the relevant timing boundary, the operating condition, and the decision the result will inform.

For example, “the endpoint is fast” is not a useful conclusion. “Under the recorded representative data set and selected concurrent request level, the order-status endpoint returned its defined terminal or pending representation within the agreed observation window” is narrower and auditable. It still does not establish behaviour under a different region, provider condition, production data distribution, or traffic shape.

The following MSQE educational framing makes that context visible: state the quality expectation, operating condition, API interaction, observed outcome and timing, diagnostic evidence, limitation, and residual risk.

This is an evidence model, not an ISO/IEC requirement, a performance benchmark, or a prescribed test process.

### Latency and Its Boundaries

**Latency** is elapsed time for a defined interaction or stage. At an API boundary, end-to-end latency may include request receipt, validation, work performed by the API, dependent calls, response construction, and network conditions visible to the chosen observer. A dependency’s latency is only one contributor. Asynchronous processing adds another distinction: the response latency for accepting work can be short while the business completion latency is much longer.

The team must state which timing is being considered. An operation that returns `202 Accepted` may meet its acceptance-time expectation while the later status transition fails an outcome-time expectation. Neither should be relabelled as the other. RFC 9110 defines `202 Accepted` as indicating that a request has been accepted for processing but has not been completed; it does not turn acceptance latency into proof of completed work.[^rfc9110]

### Why an Average Is Not Enough

An arithmetic average summarizes a set of values, but it can hide the experience of slower requests. If nine requests complete quickly and one waits much longer, the average may look acceptable while one customer-facing operation did not. **Percentile** thinking helps express distribution: a 95th-percentile latency is a value at or below which 95 percent of the recorded observations fell in the stated sample. It is not automatically the correct target, and a percentile without its scenario, sample, and measurement boundary is still weak evidence.

Use percentiles to ask a better question, not to decorate a report. A Quality Engineer should record the sample context, whether failures and timeouts are included or excluded, and whether the observed tail contains a meaningful pattern. A result from an isolated endpoint with synthetic data can help compare changes, but it cannot by itself represent a full customer journey or a production dependency.

### Throughput, Capacity, and Concurrency

**Throughput** is work processed per unit of time under a defined condition. The unit matters: accepted asynchronous requests are not necessarily completed and reconciled orders. Throughput alone establishes neither useful capacity nor correct outcomes.

**Capacity** is the ability to sustain a relevant workload while meeting its stated expectations. Workload shape, data, resource limits, dependency conditions, caching, concurrency, and failure handling all affect it. Avoid claims such as “the API handles 1,000 requests” without the endpoint, payload, duration, concurrency, and success definition.

**Concurrency** is overlapping work in progress. In addition to Chapter 4’s state concerns, concurrent calls can expose contention, rate limits, downstream quotas, and queueing. Evidence from one request may not represent concurrent use.

## Timeouts, Retries, and Unknown Outcomes

A timeout is an observation that a caller or component did not receive a result within its chosen waiting boundary. It is not automatically proof that no work occurred. A client can time out before the API completes; an API can time out while a provider continues; a provider can complete a charge but fail to return an acknowledgement in time. Calling all of these “failure” without further qualification erases the recovery question.

The Quality Engineer should identify at least four things:

1. Which participant timed out: caller, API, dependency, or later asynchronous observer?
2. What work may have occurred before the timeout?
3. What public response accurately represents the known state?
4. What safe recovery, status observation, or reconciliation evidence is available?

This is particularly important where an operation has a side effect. Retrying a request after uncertain completion may be safe only if the contract provides an idempotency key, a stable operation identity, a status resource, or another defined means of reconciling the outcome. Chapter 4 and Chapter 7 explain why retry alone is not a safety property.

### Retry Amplification

**Retry amplification** occurs when attempts to recover from slow or failed work increase the amount of work a struggling component receives. A caller retries, an API retries its provider call, a queue redelivers a message, and a webhook sender retries a callback; one original action can become many interactions. The risk is not that retries are always wrong. It is that a retry policy which ignores timing, ownership, and idempotency can worsen a partial outage or create repeated effects.

Evidence should distinguish an intentionally represented transient condition from a general claim of resilience. For a selected condition, record the retry owner, trigger, bound, delay policy where it is contractually relevant, expected state, duplicate-effect protection, and final observation. A successful retry at one layer does not prove that retries at every layer combine safely.

### Rate Limiting and Throttling

Rate limiting or throttling can protect an API, a dependency, or a shared resource from excess demand. It can also be an important consumer-facing contract condition. The relevant evidence questions are: under the selected quota condition, is the response distinguishable from an authorization or validation failure; does it state a safe next action where the contract supports one; and can a consumer avoid creating a retry storm?

HTTP defines status code `429 Too Many Requests` for a user who has sent too many requests in a given amount of time. A response can include `Retry-After` to indicate how long to wait before another request.[^rfc6585] That does not prescribe a rate-limit design, require every API to use HTTP, or make every repeated request safe. It does illustrate why a rate-limit condition needs deliberate public semantics rather than an unexplained generic error.

## Failure, Degradation, and Recovery Behaviour

An API may encounter dependency unavailability, saturation, invalid downstream data, a timeout, a transient network condition, or a failure after some work has already happened. A quality claim should identify the observable result rather than assume that a single error status captures the entire situation.

| Condition | Useful API-quality question | Unsafe shortcut |
|---|---|---|
| Dependency unavailable | Does the API distinguish a temporary inability to complete from invalid consumer input? | Treat every failure as a consumer error. |
| Dependency slow | Does the API preserve a meaningful result, pending state, or bounded failure without claiming completion? | Assume slow and failed are the same condition. |
| Invalid downstream response | Can the interface avoid converting unfamiliar dependency data into a false success? | Pass through an internal response without a contract decision. |
| Saturation or quota condition | Is the protected behaviour observable and recoverable in a documented way? | Encourage unbounded immediate retries. |
| Partial completion | Is the known state, recovery path, and reconciliation evidence available? | Report a binary success or failure without qualification. |

**Graceful degradation** means deliberately providing a reduced but still safe and useful behaviour when a full capability is unavailable. It is appropriate only when that reduced behaviour does not mislead the consumer or violate the operation’s intent. Returning a cached, clearly identified catalogue view may be useful; inventing a payment confirmation when the provider result is unknown is not. Failure can be the more reliable contract response when the API cannot safely provide a degraded result.

**Recovery evidence** concerns what happens after the represented condition changes. It might include a later successful status observation, safe replay with a stable operation identity, reconciliation of an uncertain side effect, or evidence that a retry was not needed. It should state the condition and boundary. One recovery demonstration cannot prove universal resilience, production availability, or the absence of data loss.

## Reliability Evidence and Its Limits

Reliability evidence is strongest when the claim is narrow enough to test and useful enough to inform a decision. The following record is often more valuable than a raw pass/fail result:

| Evidence element | Questions to record |
|---|---|
| Quality expectation | What outcome, failure behaviour, or timing matters to the consumer or business operation? |
| Operating condition | What workload, data, dependency state, concurrency, environment, and observation window apply? |
| Interaction | Which API operation and state transition were exercised? |
| Observation | What response, state, timing, recovery, and diagnostic signals were observed? |
| Interpretation | What does the observation support? |
| Limitation | What could the condition, environment, or instrument not represent? |
| Residual risk | What uncertainty remains relevant to the decision-maker? |

For example, a bounded test may support the claim that an endpoint returns its documented overload representation and correlation identifier while a dependency is represented as unavailable. It does not establish production frequency, alerting effectiveness, or untested provider behaviour. The limitation belongs beside the result.

## Diagnostic Evidence: Reconstructing What Happened

Diagnostics make an API failure or performance observation explainable enough for investigation. They are not decorative metadata and they are not permission to retain every request detail. Their purpose is to let an accountable team connect a consumer-visible outcome to safe supporting evidence across the relevant boundary.

A useful diagnostic design asks whether a material condition is:

- **detectable** — a relevant signal exists when it occurs;
- **distinguishable** — different meaningful conditions are not collapsed into an undifferentiated message;
- **attributable** — the evidence can identify the API component, dependency boundary, or stage that contributed, within its stated limits;
- **correlated** — related interactions can be connected for one business operation or request flow; and
- **reproducible enough for investigation** — the team retains safe context, timing, and condition information that can guide a controlled follow-up.

These are engineering capabilities and evidence-quality questions. They do not imply that every API must expose all internal details, retain unlimited data, or implement a particular observability framework.

### Request IDs and Correlation IDs

A **request ID** identifies one request or attempt. A **correlation ID** connects related requests, messages, callbacks, or service interactions belonging to a broader operation. The names and transport mechanisms vary; no universal header name is implied. In the Atlas scenario, a caller retry might receive a new request ID while retaining an operation or correlation identity that lets the team connect the original attempt, provider call, status record, and fulfilment event.

Correlation supports evidence reconstruction, especially when work crosses asynchronous boundaries. It does not prove causality by itself. A shared identifier can be missing, duplicated, incorrectly propagated, or insufficient to explain an independent dependency failure. The Quality Engineer should check whether correlation is present where it matters and whether it can be used without exposing personal data, credentials, or secrets.

### Logs, Traces, and Metrics

**Logs** are recorded event information that can preserve selected context about an interaction or condition. Useful API diagnostic records commonly include a timestamp, safe request or operation identifier, operation name, outcome classification, elapsed time, and dependency attribution where that attribution is known. A log message such as “error occurred” has little investigative value; one that distinguishes a validation rejection, a dependency timeout, and an unknown provider outcome may support a more accountable response. The exact logging format or framework is outside this chapter.

**Traces** conceptually represent related work across service and asynchronous boundaries. They can make a timing sequence or dependency contribution easier to inspect: an inbound request begins, an internal operation calls a provider, later work publishes an event, and a status update completes. OpenTelemetry provides a vendor-neutral framework for such observability signals, including traces, metrics, and logs.[^opentelemetry] Mentioning that framework does not require its use and does not make a trace an oracle of correct business behaviour. A trace can be incomplete or sampled, and it should be handled with the same data-minimization care as other records.

**Metrics** are aggregated signals, such as request count, latency distribution, error count, or a relevant saturation indicator. They can expose a changing condition and support comparisons across time or deployments. They cannot explain every individual outcome. A rising error rate may reveal a problem worth investigating; correlation, logs, controlled reproduction, and contract evidence may be needed to understand what failed and why.

Together these signals support investigation at different levels. They are not a requirement to create a dashboard, install an agent, or adopt an operations platform. The Quality Engineer's concern is whether the API-quality claim has enough safe, interpretable evidence to be challenged and followed up.

### Public Error Contracts and Internal Evidence

An API must offer consumers a stable, safe public error contract. The contract may describe the request condition, a meaningful problem type or code, a correlation value where appropriate, and a safe next action. It should not disclose credentials, access tokens, secrets, internal host names, raw stack traces, private upstream payloads, or personal data merely to make engineering diagnosis easier.

Internal diagnostic evidence can be more specific, subject to access control and data-retention policy. It may classify a dependency timeout, identify a safe provider operation reference, record an internal failure category, or preserve a trace link. The two audiences need not receive the same information.

| Audience | Needs | Should avoid |
|---|---|---|
| API consumer | Stable meaning, safe remediation or retry guidance where applicable, and a usable correlation value. | Internal topology, secrets, sensitive data, or unsupported speculation about root cause. |
| Support or operations team | Enough safe context to locate the relevant operation and determine known state. | Full payloads or credentials by default. |
| Engineering investigation | Attribution, timestamps, classified condition, represented dependency state, and reproducible context. | Treating internal diagnostic detail as a public API promise. |

An HTTP status such as `500` can be an appropriate high-level public classification in some cases, but by itself it is normally too coarse for an engineering investigation. Conversely, exposing the database exception or a provider response unchanged can create an unsafe public contract. The quality question is whether the public representation is honest and actionable while the internal evidence is sufficient and responsibly protected.

## Performance Expectations and Baselines

An API performance expectation should be tied to a purpose, not imported from an arbitrary industry slogan. “All APIs must respond within 200 milliseconds” is not a reliable requirement. A synchronous eligibility lookup, a report-generation acceptance request, a payment-confirmation outcome, and a bulk ingestion operation may have materially different timing boundaries and consumer needs.

A useful expectation records:

- the consumer or business scenario;
- the operation and completion boundary being measured;
- the workload, request mix, concurrency, and data assumptions;
- the environment and relevant dependency condition;
- the measurement method and which observations are included;
- the timing or capacity decision that the evidence will inform; and
- how timeouts, pending states, failures, and asynchronous completion are represented.

A **baseline** is a known comparison context, such as an approved previous observation for the same scenario. It can help a team detect a material change after a contract or implementation change. A baseline is not automatically a requirement and it is not a production promise. It can be stale, captured in an unrepresentative environment, or unsuitable after the workload changes. Its value lies in the explicit comparison, not the existence of a number.

### Limits of Performance and Reliability Observations

The same discipline that applies to dependencies applies to performance evidence:

- One fast request does not prove a timing expectation under relevant load.
- A small or isolated environment may not represent production topology, data distribution, network behaviour, or dependency contention.
- A high request count does not establish correct state transitions, useful outcomes, or sustainable capacity.
- A single recovery observation does not prove that all transient conditions will recover safely.
- Test-environment availability does not prove production availability.
- A missing diagnostic signal does not prove that a condition did not occur; it may reveal an evidence gap.

These statements are not reasons to avoid testing. They are reasons to state the claim accurately. Where an uncertainty matters to release risk, it should be escalated as a decision input, not concealed by a broad green status.

## Engineering Perspective

Reliable API behaviour is designed as a combination of contract, state, time, dependency handling, and diagnosability. Engineers need agreement on what the interface can promise when work is slow or uncertain: whether it can return a terminal response, a pending state, a clear retryable condition, or a safe failure. They also need a way to reconstruct selected material interactions without creating an unsafe data exhaust.

For the Quality Engineer, the engineering conversation begins with questions rather than a preferred tool:

- What is the user-visible completion or failure boundary?
- Which timing conditions are meaningful, and which are merely convenient to measure?
- When a timeout occurs, what remains known and how can it be reconciled?
- Which layer owns retry, and how are duplicate effects prevented?
- What public error information is safe and useful?
- Which request, operation, or correlation identifiers permit investigation across the path?
- Which represented dependency conditions are needed to make failure behaviour observable?

This is systems reasoning at an API boundary. It turns “the API responds” into a testable statement about outcome, timing, diagnostic evidence, limitation, and residual risk.

## QA to Quality Engineering: From Response Checks to Reliability Judgement

Traditional API QA may confirm that the endpoint returns a success status and expected body for representative input. That remains a necessary form of evidence. Quality Engineering expands the question: under the stated workload and dependency condition, did the operation produce an honest outcome or failure, within a meaningful time boundary, with enough safe evidence to investigate and recover?

The progression is not a rejection of existing test skill. A Quality Engineer still designs data, observes responses, compares outcomes, and reports defects. The expanded responsibility is to connect those observations to system conditions and decision risk. A slow dependency, a new correlation gap, an overloaded endpoint, or an ambiguous timeout is treated as an API-quality concern, not merely an operational issue to hand to another team.

## Industry Perspective

Industry guidance provides useful vocabulary but should not replace contextual engineering judgement. ISO/IEC 25010 provides a formal product-quality model in which reliability and performance efficiency are distinct characteristics.[^iso25010] RFC 9110 defines HTTP semantics that help an API state what a response means, including the distinction between a completed response and accepted processing.[^rfc9110] RFC 6585 specifies `429 Too Many Requests` for an HTTP rate-limit condition.[^rfc6585]

Google’s SRE literature explains monitoring and service-level thinking from an operational perspective, while OpenTelemetry describes common observability signal concepts. Those sources are valuable background for diagnostic and measurement vocabulary.[^google-monitoring][^opentelemetry] They are not universal latency targets, mandated technology choices, or evidence that an individual API has met its product-specific quality expectations. MSQE uses them here to support a narrower educational principle: quality claims need an observable condition, an interpretable result, and an honest limitation.

## Common Misconceptions

### “A successful response proves the API is reliable.”

It proves one observed response under one set of conditions. Reliability also concerns predictable failure, timing, recovery, and consistency in the contexts that matter.

### “Availability and reliability are the same thing.”

Availability addresses whether a capability can be used under an agreed definition. Reliability also asks whether the available behaviour is correct, understandable, and recoverable enough for its intended purpose.

### “The average latency is acceptable, so performance is acceptable.”

An average can hide slow tail observations. The scenario, distribution, failures, timeouts, workload, and measurement boundary need to be understood before interpreting a value.

### “A timeout means nothing happened.”

It means the observer did not obtain a result within its waiting boundary. Work may be pending, completed, failed, or genuinely unknown. The contract and reconciliation evidence must determine the next action.

### “More diagnostic data is always better.”

Diagnostic evidence that exposes tokens, credentials, secrets, personal data, or unsafe internal detail creates a different quality and security risk. Records should be sufficient, safe, and purpose-limited.

### “A trace tells us the root cause.”

A trace can support a timing and interaction reconstruction. It can be incomplete, sampled, incorrectly correlated, or unable to explain a semantic defect. It is evidence, not a final explanation.

## Summary

API reliability is an observable property of behaviour in context, not a single uptime, latency, or error-rate value. At the API boundary, Quality Engineers need to consider whether the operation produces an expected outcome, fails predictably when it cannot, fits the relevant timing expectation, can recover without unsafe repeat effects, and leaves enough safe evidence for investigation.

Performance evidence becomes useful only when it states the scenario, workload, completion boundary, environment, dependency assumptions, and limitations. Latency, throughput, capacity, and concurrency are related observations rather than interchangeable claims. A timeout requires particular care because it can leave a real operation in an unknown state. Rate limiting, transient dependency conditions, and degradation need a deliberate contract and recovery decision, not a generic assertion of resilience.

Diagnostic capabilities complete the evidence path. Request and correlation identifiers, safe structured records, traces, and metrics can help a team reconstruct relevant behaviour, but none is proof on its own. Public error contracts must stay honest and safe; internal evidence must be sufficient and responsibly controlled. Together, Chapters 7 and 8 move the Quality Engineer from checking an immediate response to judging a distributed API outcome, its timing, its diagnostic evidence, and its residual risk.

## Key Takeaways

- Reliability at an API boundary includes expected outcome, predictable failure, timing, recovery, and consistent contract behaviour; it is not a single metric.
- Availability is related to, but narrower than, reliable consumer-facing behaviour.
- ISO/IEC 25010 product quality characteristics are distinct from engineering capabilities such as correlation, observability, and testability.
- A latency result needs a defined observer, completion boundary, workload, environment, and dependency assumptions.
- Averages can conceal tail latency; percentile observations need their sample and scenario to be interpretable.
- Throughput and concurrency evidence does not by itself establish correct state, useful outcome, or sustainable capacity.
- A timeout may leave a completed, pending, failed, or unknown operation; safe recovery requires explicit evidence.
- Rate limiting and degraded behaviour need deliberate, consumer-safe semantics rather than generic failure handling.
- Diagnostics should make relevant conditions detectable, distinguishable, attributable, correlated, and safe to investigate.
- Every reliability or performance claim should state its limitation and residual risk.

## Review Questions

1. How do reliability and availability differ at an API boundary?
2. Why is a successful endpoint response insufficient reliability evidence?
3. What timing boundary would you use for an API that accepts report generation asynchronously, and what different boundary would apply to report completion?
4. Why can an average latency conceal a material customer experience?
5. What information should accompany a throughput observation before it can inform an engineering decision?
6. What possible operation states remain after a client times out?
7. How can retry amplification worsen a dependency failure?
8. What makes a rate-limit response diagnostically and contractually useful?
9. How do request IDs and correlation IDs support different evidence questions?
10. Why should a public error representation differ from internal diagnostic evidence?
11. What can a performance baseline support, and what can it not establish?
12. Which limitation would you include with a reliability observation made in a controlled test environment?

## Interview Questions

1. How would you define API reliability for a payment operation whose provider can time out after receiving a request?
2. An endpoint has a low average latency but intermittent very slow responses. What evidence would you seek before deciding whether there is a quality issue?
3. How would you distinguish a consumer-visible timeout from an internal dependency timeout during an investigation?
4. What public and internal information would you expect from an API failure that may have created a side effect?
5. How would you evaluate whether an API's rate-limit behaviour is suitable for its consumers?
6. How can a Quality Engineer assess diagnostic testability without choosing an observability platform?
7. What residual-risk statement would you make after timing evidence was collected only in a small, controlled environment?

## Practical Exercise

### Design an API Reliability and Diagnostic Evidence Plan

**Objective:** Produce an **API Reliability and Diagnostic Evidence Plan** for a fictional Atlas Commerce order API. The plan must define evidence and its limitations; do not create a load test, monitoring configuration, trace implementation, dashboard, or companion API.

Atlas Commerce exposes an authenticated order-submission API. Under normal operation, it validates the request, creates an order record, and calls a third-party payment provider. The provider can be slow, can time out after receiving an attempt, and can intermittently return a temporary failure. The API has a selected rate limit during promotion traffic. Its processing-status resource can show `pending`, `confirmed`, `rejected`, or `unknown`. The current public error representation includes a request identifier but not internal provider details. The team wants to decide whether its evidence is sufficient for a limited promotion release.

**Tasks:**

1. Write three reliability expectations. Include one about expected completion or known pending state, one about a dependency timeout or unknown outcome, and one about rate-limit behaviour. State why each matters to a consumer or decision-maker.
2. Define the timing boundary for initial order acceptance and for final payment outcome. Explain why they cannot use the same measurement interpretation.
3. Record workload, data, concurrency, environment, and dependency assumptions for a bounded performance observation. Identify at least two important conditions that the observation will not represent.
4. Specify the evidence you would collect for a slow provider, a provider timeout after request receipt, a rate-limit condition, and an intermittent downstream failure. Include the expected public result, internal diagnostic need, known state, and recovery or reconciliation question.
5. Identify where retry might occur. Explain one retry-amplification risk and one duplicate-effect risk, then state the evidence required to evaluate the selected retry policy safely.
6. Define a diagnostic minimum for this flow: request identifier, operation or correlation identity, timestamps, outcome classification, selected dependency attribution, and data that must not be recorded.
7. Separate information appropriate for the public API response from information reserved for controlled internal investigation. Explain how each supports a different audience.
8. Write a concise evidence limitation and residual-risk statement for the release decision-maker. It must not claim universal performance, production availability, or complete provider reliability.

**Expected artifact:** A three- to four-page API Reliability and Diagnostic Evidence Plan containing an expectation table, timing and workload model, selected failure-condition matrix, diagnostic-information design, evidence limitations, and residual-risk statement.

**Constraints:** Atlas Commerce is fictional. Do not prescribe a universal latency target, install monitoring software, write load scripts, configure tracing, or treat a generic `500` response as sufficient diagnostic evidence. Do not expose credentials, tokens, secrets, full sensitive payloads, or internal provider details in the proposed public error contract.

## Further Reading

- [Chapter 7 — Dependent and Asynchronous APIs: Events, Webhooks, Third Parties, and Controlled Evidence](chapter-07-dependent-and-asynchronous-apis-events-webhooks-third-parties-and-controlled-evidence.md) — completion and dependency context for reliability observations.
- [Part III, Chapter 8 — Functional, Quality-Attribute, and Data-Oriented Evidence](../../part-03-software-testing/chapters/chapter-08-functional-quality-attribute-and-data-oriented-evidence.md) — complementary quality-attribute evidence design.

## References

[^iso25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). ISO, 2023. Accessed 2026-08-10.
[^rfc9110]: Fielding, R., Nottingham, M., and J. Reschke, eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). IETF, June 2022. Accessed 2026-08-10.
[^rfc6585]: Nottingham, M., and R. Fielding. [RFC 6585 — Additional HTTP Status Codes](https://www.rfc-editor.org/rfc/rfc6585.html). IETF, April 2012. Accessed 2026-08-10.
[^google-monitoring]: Beyer, B., Jones, C., Petoff, J., and N. Murphy, eds. [Monitoring Distributed Systems](https://sre.google/sre-book/monitoring-distributed-systems/). *Site Reliability Engineering*. Google, 2016. Accessed 2026-08-10.
[^opentelemetry]: OpenTelemetry. [Observability Primer](https://opentelemetry.io/docs/concepts/observability-primer/). Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish reliability, availability, performance efficiency, and engineering diagnostic capabilities;
- [ ] state the completion and timing boundary for a selected API operation;
- [ ] explain why a latency, throughput, or recovery observation needs explicit context and limitations;
- [ ] reason about timeout, retry, rate-limit, degraded, and unknown-outcome behaviour without unsafe assumptions;
- [ ] separate a safe public error contract from internal diagnostic evidence;
- [ ] identify diagnostic information that is detectable, distinguishable, attributable, correlated, and safe; and
- [ ] communicate residual reliability and performance risk clearly.

**Next:** Chapter 9 will apply API-quality reasoning to the remaining Part IV boundary and change-management topics.
