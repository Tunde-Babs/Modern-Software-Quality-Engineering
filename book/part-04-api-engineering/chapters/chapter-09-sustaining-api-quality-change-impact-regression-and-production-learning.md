# Chapter 9 — Sustaining API Quality: Change Impact, Regression, and Production Learning

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 9 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–8 and familiarity with API contracts, state, data, identity, dependencies, diagnostics, and evidence limits |
| Estimated study time | 170 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Confidence in an API must evolve when the assumptions behind its behaviour evolve.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. A team makes five changes before a promotion: it adds an optional response field for delivery preference; moves payment review to a new provider version; gives support agents a new order-search scope; changes pagination to use a cursor; and reduces a timeout for an asynchronous review request.

Every change seems local. The schema accepts the new field. A provider sandbox call succeeds. The new role can find a test order. A collection response contains a cursor. The API returns more quickly after the timeout adjustment. In production, an older consumer treats the new field as a known enum and rejects the response; a support agent can search a neighbouring tenant; a delayed payment review triggers retries; and a cursor created before a data refresh omits an expected order. None of these outcomes is explained by “the regression suite passed.”

The Quality Engineer asks what assumption changed, which consumer or boundary relies on it, what evidence must be renewed, which uncertainty remains, and what the production outcome should teach the team. This chapter develops that discipline. The capstone in Chapter 10 then integrates it into an API Quality Strategy and Evidence Portfolio.

## Introduction

API quality is not a one-time assessment. The confidence produced by a contract check, state observation, authorization matrix, provider interaction, or timing measurement is tied to assumptions. Those assumptions change as interfaces evolve, consumers deploy at different times, data distributions shift, access rules change, providers alter behaviour, and workload or operating conditions move.

Regression is therefore not simply the act of rerunning every available endpoint check. It is **risk-informed evidence selection after change**. It asks what changed, what the change could affect, which existing evidence remains relevant, which evidence must be renewed, and where a known gap deserves an explicit decision rather than a silent omission.

Production learning completes the feedback path. An escaped API defect is evidence about an interface, an assumption, an observation boundary, and the strategy that selected prior evidence. It is not automatically proof that an individual “forgot a test.” This chapter applies Part III's defect-learning and regression principles to API contracts, consumers, state, data, identity, dependencies, and runtime behaviour. It does not teach CI/CD implementation, incident command, or monitoring-platform configuration.

## Why This Chapter Matters

An API can remain syntactically valid while becoming unsafe for an existing consumer. A structurally additive field can carry a new semantic meaning. A retry policy can become unsafe after a provider changes its acknowledgement behaviour. A new search capability can cross a tenant boundary. A latency result can cease to be representative when a dependency, workload, or data volume changes.

Teams need a way to turn such changes into proportionate engineering questions. Without it, regression grows into a slow collection of historical checks, while important changed assumptions remain unchallenged. The goal is neither minimal testing nor exhaustive rerunning. It is a defensible evidence portfolio: early feedback for clear local risk, broader evidence when uncertainty or shared behaviour demands it, and production learning that improves the next decision.

## Learning Objectives

By the end of this chapter, you should be able to:

- identify API assumptions affected by a proposed change;
- perform API-specific change-impact reasoning across contract, state, data, identity, dependency, and operating-condition boundaries;
- distinguish targeted regression from broader regression and select each according to risk;
- identify when consumer compatibility evidence, live integration evidence, or production signals are needed;
- assess regression-suite health in terms of relevance, semantics, reliability, and feedback value;
- analyse an escaped API defect as evidence of system conditions and strategy gaps rather than individual blame;
- formulate a change-to-learning loop with explicit evidence limits and revision triggers; and
- communicate release confidence as evidence, gaps, residual risk, and recommendation.

## API Quality Changes Over Time

The same API operation can become a different quality question when one of its assumptions changes. The relevant change is not restricted to source code. A consumer deployment, a provider deprecation notice, a new identity rule, a data migration, a traffic pattern, or a support report can all require renewed evidence.

| Change source | Assumption that may change | Example API-quality question |
|---|---|---|
| Interface contract | A field or error representation has the same consumer meaning. | Which consumer treats an optional field, absent value, enum, or problem type as behaviour it depends on? |
| State and side effect | The transition, retry, or idempotency rule still produces one logical outcome. | Does a changed cancellation rule alter repeat, timeout, or reconciliation behaviour? |
| Data or query | The collection remains complete, ordered, current, and interpretable. | Does a new cursor or filter alter traversal, freshness, or aggregate meaning? |
| Identity and access | A caller remains limited to the intended resource and action. | Does a role or ownership change expose a neighbouring tenant or enable a prohibited side effect? |
| Dependency | An external contract, timing, or delivery condition remains compatible. | Does a provider version or webhook change alter completion, retry, or error semantics? |
| Operating condition | A previous timing or capacity observation remains representative. | Does a workload or timeout change invalidate the earlier performance claim? |

The table is not a complete inventory. It is a prompt to find the assumptions that matter to the decision. Chapter 1 framed an API boundary as an evidence boundary; the same idea applies over time. A change can shift the boundary at which an old result stops being persuasive.

## Change as an Evidence Trigger

The following is an **MSQE educational change-to-evidence prompt**: identify the change; name the assumptions and boundaries it affects; select evidence suited to those assumptions; interpret the result with its limits; then communicate residual risk and a revision trigger. It is not a mandatory workflow or a substitute for team governance.

This approach avoids two weak responses. The first is “the change is small, so existing checks are enough.” The second is “everything changed, so run everything.” A small field can be semantically significant to a consumer. Conversely, a broad rerun can consume time while leaving a new third-party or ownership assumption unexamined.

### Change-Impact Analysis

Change-impact analysis identifies plausible effects before selecting evidence. For an API, inspect the request and response representations, method and status meaning, headers and metadata, error contract, state transition, side effect, authorization decision, data/query semantics, consumer expectation, dependency interaction, and operating condition. The purpose is not to predict every defect. It is to state the assumptions worth challenging.

| API aspect | Useful impact questions |
|---|---|
| Request or response field | Is the structural shape, default, absence, nullability, enum meaning, or consumer parsing assumption affected? |
| Semantics or status behaviour | Does a success, pending, validation, conflict, rate-limit, or failure response now mean something different? |
| State and side effect | Has a transition, precondition, compensating action, idempotency rule, or duplicate-effect risk changed? |
| Query and representation | Can pagination, filtering, sorting, aggregation, freshness, or cross-endpoint consistency change? |
| Access control | Do role, scope, tenant, ownership, field, or state conditions lead to a different permitted action? |
| Dependency and asynchrony | Has a provider contract, event, callback, retry, delivery, ordering, or completion condition changed? |
| Reliability condition | Have timeout, concurrency, workload, rate-limit, diagnostic, or recovery assumptions changed? |

### Consumers Are Partly Known

Some APIs have documented consumers, version telemetry, partner contacts, or a managed client ecosystem. Others have unknown integrations, copied examples, archived clients, or consumers that do not report their version. A consumer inventory can improve a compatibility decision, but it is rarely complete enough to justify a universal claim.

Treat a known consumer as evidence of a particular dependency, not proof that there are no others. For an uncertain consumer population, a team may combine contract review, compatibility safeguards, deprecation communication, representative client evidence, and a stated residual risk. Chapter 3's central question still applies: compatibility is a consumer question, not merely a schema comparison.

## Contract, State, Data, and Access Change

### Contract and Consumer Compatibility

A contract change can be structural, semantic, or both. Adding an optional field may be structurally compatible for a tolerant parser yet semantically disruptive if an older consumer assumes a closed set of values. Replacing a problem type, changing an absent value to a default, or changing a `202 Accepted` workflow to immediate completion alters consumer reasoning even when the JSON remains valid.

For a proposed change, ask what changed structurally, what changed in meaning, which consumer assumption relies on the former behaviour, and what evidence can challenge compatibility. An interface description, schema comparison, and selected consumer observation can each help. None alone establishes universal compatibility. OpenAPI and JSON Schema describe valuable interface constraints, but they do not fully specify business semantics or every consumer's tolerance.[^openapi][^json-schema]

### Stateful and Side-Effect Change

Chapter 4 established that a valid request can create risky behaviour when state, retries, idempotency, or concurrency are involved. A change to a state rule can alter which transitions are legal, when a side effect occurs, what a repeat request returns, or how an uncertain outcome is reconciled. A new provider callback can add an effect that must not occur twice.

Evidence should follow the changed state assumption: relevant precondition, competing action, repeat intent, side-effect observation, pending or terminal representation, and recovery rule. Do not automatically add a case to every regression suite. A targeted state-transition observation may be enough for a well-bounded change; a shared idempotency or transaction boundary can justify broader evidence.

### Data and Query Change

Query changes are contract changes with data consequences. A cursor, filter, sort order, aggregation, or freshness policy can affect traversal and customer decisions even where individual records remain valid. A collection that omits a newly created order after a projection delay may be acceptable only if the contract and support experience make the delay interpretable.

Renew evidence around the changed semantic boundary: collection membership, stable traversal, ordering ties, filter definition, duplicate identity, snapshot or time boundary, aggregate population, and read-after-write expectation. Do not treat a page of plausible records as proof that the collection contract remains intact.

### Identity and Access Change

An access change affects a protected outcome, not merely a token. A new support-agent scope may permit a search but not an update; a new ownership rule may change whether a customer can view an order after fulfilment; a tenant migration may alter which resource identity is authoritative. Evidence should connect identity and context to resource, action, expected permission, returned representation, and prohibited side effect.

The result must remain safely communicated. A more informative support error might help an operator while exposing a protected tenant boundary to a customer. Chapter 6's distinction between public behaviour and controlled diagnostic evidence remains relevant when access rules change.

## Dependency, Reliability, and Operating-Condition Change

Dependencies change independently of the API team. A provider can deprecate a version, add a status, narrow a quota, alter timing, change a callback representation, or expose a different failure condition. A change may also occur inside the API: a timeout is shortened, a retry owner moves, a status endpoint reads a different projection, or a rate-limit policy changes.

Chapter 7's real-versus-controlled boundary decision should be reviewed whenever the represented behaviour stops matching the dependency risk. A controlled substitute can exercise a newly known malformed response or timeout repeatedly. A selected real interaction can challenge actual compatibility. Neither answer replaces the other, and neither establishes all future provider behaviour.

Chapter 8 adds the operating condition. A timing result is not durable merely because an endpoint implementation did not change. Different request volume, data shape, dependency latency, concurrency, or rate limit can invalidate the prior claim. When a change touches one of those assumptions, renew the relevant performance or reliability evidence with the condition clearly stated.

## Regression as Risk-Informed Evidence Selection

An **API regression strategy** selects evidence after change to challenge the assumptions most relevant to the decision. It is a portfolio of complementary observations, not a test-count target and not necessarily a permanent suite of endpoint scripts.

### Targeted and Broader Regression

Targeted evidence is appropriate when the change and affected boundary are understood well enough that a focused observation can meaningfully challenge the risk. A corrected error representation may call for contract, consumer, and safe-disclosure evidence. A revised ownership predicate may call for focused identity/resource/action observations. Targeted does not mean shallow; it means deliberately connected to the change.

Broader evidence may be warranted when the change affects a shared representation, common authorization middleware, persistence path, event contract, provider version, runtime configuration, or another area with uncertain reach. It can include related contract checks, selected state transitions, representative consumer flows, live integration observations, or a broader set of production signals. Broader does not mean “run everything by habit.” It needs a stated reason and limit.

| Evidence source | Best suited to | Important limit |
|---|---|---|
| Contract and schema evidence | Structural interface changes and selected compatibility assumptions. | Does not establish business meaning or every client reaction. |
| State-transition evidence | Changed preconditions, side effects, repeats, and recovery states. | Does not represent every concurrent or dependent condition. |
| Query/data evidence | Collection membership, traversal, filtering, freshness, and aggregate meaning. | May not represent production data distribution or lag. |
| Access-control evidence | Role, scope, ownership, tenant, field, and action boundaries. | Is not a complete security assessment. |
| Controlled dependency evidence | Repeatable failures, unusual provider results, delayed delivery, and diagnostics. | Does not establish live compatibility or production timing. |
| Live integration evidence | Selected real contract, credentials, network, and provider behaviour. | Does not efficiently cover rare failure paths or future change. |
| Production signals | Actual consumer, runtime, compatibility, and support evidence. | May detect a problem after impact and require safe interpretation. |

### Regression Layers and Timing

Evidence timing is a design choice. A clear structural or semantic question should receive feedback early enough to change the implementation or release plan. State and access questions may need controlled data and a stable boundary. A selected live-provider observation may be later or less frequent because it is slower or constrained. Production signals continue after release because some consumer, workload, and dependency conditions cannot be fully represented beforehand.

This is not CI/CD design. It is a decision about which evidence is needed early, which belongs near an integration boundary, and which must be monitored as residual risk. A team should be able to explain why a result runs when it does, what it protects, and what it leaves unobserved.

### Consumer Compatibility Regression

Consumer compatibility regression asks whether selected existing expectations still hold after change. It might examine a representation, error condition, pagination rule, method outcome, or deprecation path. A named consumer may provide a valuable observation, but unknown consumers require a more cautious conclusion.

Avoid treating a consumer inventory as a binary gate. Instead, identify high-consequence or representative consumers, select relevant evidence, communicate a migration path where appropriate, and record remaining uncertainty. The important claim is bounded: the team has evidence about stated consumer assumptions, not proof that all integrations are unaffected.

### Regression-Suite Health

An API evidence portfolio decays when it keeps obsolete checks, duplicated assertions, brittle implementation details, slow feedback, unreliable external dependencies, or a large set of green responses that no longer challenge current risk. It can also decay by omission: semantics, side effects, access behaviour, or data consistency might lack evidence while structural checks multiply.

Review a portfolio when an API changes or an escaped defect occurs:

- Which result still informs a decision, and which only repeats low-value history?
- Are several checks proving the same narrow transport fact while a semantic or state assumption remains unchallenged?
- Does an assertion depend on an unstable generated identifier, current timestamp, or uncontrolled provider condition rather than the intended behaviour?
- Is a controlled dependency hiding a compatibility question that should remain real, or is a live dependency making a focused failure condition unreliable?
- Is feedback slow because the evidence is broad by habit rather than selected by risk?

The answer may be to clarify an oracle, retire an obsolete check, move an observation to a more suitable boundary, improve testability, or add a targeted regression. It is not automatically “add one more test.”

## Production API Failures as Learning Evidence

An **escaped defect** is a material problem discovered after the evidence available for a decision did not prevent or reveal it. In an API context, examples include a semantic change that breaks a consumer, a pagination cursor that skips records, an authorization condition that exposes a neighbouring tenant, a duplicate side effect after a timeout, or a dependency-version change that invalidates an assumed result.

The first task is to establish facts: what interaction occurred, which consumer or customer outcome was affected, which representation or state was observed, when it happened, and what evidence is available. Then distinguish facts from hypotheses about causes. A provider status may have been undocumented; the system may have lacked a safe operation identity; a compatibility assumption may have been unrepresented; a test environment may have omitted the workload or consumer context that mattered.

**Blameless learning** examines contributing technical and delivery conditions without making an individual person the explanation for a system outcome. It does not remove accountability for decisions; it makes improvement possible by asking what made the outcome likely, hard to see, or difficult to recover. Google SRE's postmortem guidance similarly treats blamelessness as a condition for learning from failure rather than an avoidance of responsibility.[^google-postmortem]

| Production observation | Questions that improve API strategy |
|---|---|
| Consumer rejects a valid new response | Which semantic or compatibility assumption was missing? Which consumers were known, unknown, or insufficiently represented? |
| Customer sees duplicate fulfilment | Which logical intent or delivery identity was ambiguous? Which side effect was not safely deduplicated? |
| Support agent sees another tenant's order | Which identity, ownership, resource, or query boundary changed? What evidence should have challenged it? |
| API times out after provider completion | What was known at each boundary? Who owned retry and reconciliation? What diagnostic evidence was missing? |
| Cursor skips or repeats records | Which traversal, ordering, freshness, or snapshot assumption was not made explicit? |

### Updating the Strategy After Failure

The purpose of a learning review is a proportionate strategy update. Possible actions include clarifying a contract, improving consumer communication, making a completion state observable, adding a safe correlation signal, representing a dependency failure, adding lower-boundary evidence, selecting a live compatibility check, revising a regression set, or documenting a risk that needs specialist ownership.

Each action should identify the assumption it addresses and the evidence it will produce. “Add a regression test” is an incomplete action because it says neither what future condition will be detected nor whether the selected boundary can reveal it. A mature response can deliberately decide not to automate a rare or expensive observation while recording the safeguard, owner, and revision trigger.

### API Quality Debt

**API quality debt** is the accumulated risk and future cost created when API behaviour remains ambiguous, stale, hard to observe, or difficult to change safely. It can appear as undocumented semantics, outdated schema descriptions, inconsistent errors, fragile provider assumptions, unbounded compatibility uncertainty, missing diagnostics, or a regression portfolio that no longer matches the interface.

The term is a discussion aid, not a maturity model or a claim that every imperfection must be fixed immediately. Use it to make trade-offs visible: what customer or delivery risk is being carried, why it is being accepted now, which safeguard limits it, and what event should force review.

## Communicating Release Confidence

A release-confidence statement should separate evidence from interpretation. The following is **MSQE educational framing** for an API change decision:

| Element | Question for the decision-maker |
|---|---|
| Strongest evidence | Which observed contract, state, access, dependency, or timing result most directly supports the decision? |
| Known gap | Which relevant consumer, operating condition, or failure path was not represented? |
| Change risk | What new or altered assumption could change the customer outcome? |
| Residual risk | What uncertainty remains after the selected evidence? |
| Recommendation | What action, safeguard, staged release, communication, or acceptance is proposed? |
| Revision trigger | Which support signal, provider change, consumer report, or operating condition requires the strategy to be revisited? |

This is a decision brief, not a way to claim certainty. It gives product, engineering, and operational stakeholders a basis for deciding whether the known risk is acceptable and who owns the next learning step.

## The MSQE API Change-to-Learning Loop

The following **MSQE educational API Change-to-Learning Loop** connects sustained API quality work: change → affected assumptions → selected evidence → release decision → production outcome → learning → strategy update. It is deliberately compact. The value lies in discussing each transition: which assumption changed, why the evidence was selected, how the result informed a decision, and what production evidence changed the future portfolio.

## QA to Quality Engineering Transition

| Existing QA activity | Sustaining API Quality Engineering practice |
|---|---|
| Rerun the API regression suite. | Select and explain evidence based on changed assumptions, boundaries, consumer impact, and uncertainty. |
| Add a test after a defect. | Analyse facts, contributing conditions, evidence gaps, recovery, and the proportionate strategy update. |
| Check a schema change. | Assess structural and semantic compatibility, named and unknown consumers, safeguards, and residual risk. |
| Report a production failure. | Connect the failure to contract, state, data, identity, dependency, or operating-condition assumptions and improve the portfolio. |

Quality Engineering does not replace regression work; it makes its purpose and limitations inspectable. The learner moves from maintaining a collection of checks to sustaining a changing argument for API confidence.

## Engineering Perspective

Sustainable API quality needs explicit ownership of assumptions. Teams benefit from contract-change review, a way to identify consumer reliance, meaningful state and recovery models, safe diagnostic information, and feedback that connects runtime outcomes to earlier decisions. The Quality Engineer contributes by making those needs visible and helping select proportionate evidence; they do not need to own every deployment, provider relationship, or monitoring platform.

## Industry Perspective

OpenAPI and JSON Schema support interface description and structural validation, while RFC 9110 defines HTTP semantics; none defines every semantic, compatibility, or release decision.[^openapi][^json-schema][^rfc9110] ISO/IEC 25010 provides a product-quality model, not a regression-suite prescription.[^iso25010] Google SRE's postmortem guidance illustrates blameless learning as practitioner guidance, not a universal incident process.[^google-postmortem]

## Common Misconceptions

### “Regression means rerun every check.”

Broader evidence can be justified, but it needs a risk and uncertainty rationale. Repetition alone may not challenge the changed assumption.

### “An additive response field cannot break consumers.”

It can affect parsing, enum handling, defaulting, semantic interpretation, or client logic. Structural additivity is not universal compatibility.

### “A production defect proves someone missed a test.”

It proves that prior evidence did not reveal or prevent a material condition. The useful investigation identifies assumptions, boundaries, contributing conditions, and strategy improvements.

### “A green live-provider check proves the integration is safe.”

It supports one selected observation. It does not prove future provider behaviour, rare failure recovery, every consumer configuration, or production workload conditions.

## Summary

API quality must be sustained as contracts, consumers, state, data, identity, dependencies, and operating conditions change. Change-impact analysis identifies affected assumptions; risk-informed regression selects evidence that can challenge them; production learning updates the strategy when the evidence was incomplete.

The objective is not a larger permanent suite. It is an evolving API evidence portfolio that states what it covers, what it does not, and what production outcome will trigger revision. Chapter 10 integrates this approach with the earlier Part IV capabilities into one professional API Quality Strategy and Evidence Portfolio.

## Key Takeaways

- A change is an evidence trigger when it alters a customer-relevant assumption or evidence boundary.
- Contract, state, data, identity, dependency, and operating-condition changes can all require renewed API evidence.
- Targeted and broader regression are context-sensitive choices, not opposing doctrines.
- Consumer inventories inform compatibility decisions but rarely establish universal consumer knowledge.
- Regression-suite health depends on relevance, semantics, reliability, and feedback value, not volume.
- Escaped defects are system-learning evidence, not automatic tester-blame evidence.
- A proportionate strategy update may clarify a contract, improve testability, revise evidence, or communicate residual risk.
- Release confidence should state strongest evidence, gaps, risk, recommendation, and revision trigger.

## Review Questions

1. Why is an API change an evidence trigger rather than only an implementation event?
2. How can an optional response field create consumer risk without violating a schema?
3. When does a targeted regression observation provide stronger value than a broad rerun?
4. Which uncertainty might justify broader API regression after a provider version change?
5. What distinguishes a known consumer from proof of a complete consumer inventory?
6. How can a timeout-policy change affect state, retry, and performance evidence?
7. What makes a regression check obsolete, brittle, or duplicative?
8. How should a team learn from a duplicate side effect discovered in production?
9. What information belongs in a release-confidence statement?

## Interview Questions

1. How would you assess the API impact of adding an optional field to a response used by external partners?
2. A payment provider changes its callback status values. Which evidence would you select and why?
3. How would you decide between targeted and broader regression after changing shared authorization logic?
4. What would you investigate after an API timeout causes a customer to retry and receive a duplicate outcome?
5. How do you apply blameless learning while still improving a concrete API-quality decision?
6. Which production signals might cause you to revise an API regression strategy?

## Practical Exercise

### Build an API Change and Regression Strategy

**Objective:** Create an **API Change and Regression Strategy** for a fictional Atlas Commerce release. The work should support an engineering decision; do not create CI/CD configuration, a test suite, a monitoring platform, or a companion API.

Atlas plans to: add `deliveryPreference` to selected order responses; move asynchronous payment review to a provider version with one new intermediate status; grant support agents a search scope; replace offset pagination with an opaque cursor; and shorten the timeout for initial payment-review acceptance. The order API serves a mobile client, a support portal, two known partner integrations, and an unknown set of reporting consumers. A previous promotion produced a duplicate fulfilment after a client retry timed out.

**Tasks:**

1. Record the decision, change context, known constraints, affected consumers, and uncertainties.
2. Identify contract, state, data/query, access, dependency, and reliability assumptions affected by each change.
3. Select early, later, and production evidence. Explain why each source is appropriate and what it cannot establish.
4. Choose targeted versus broader regression for each high-risk assumption. State the trigger for broader evidence.
5. Define consumer-compatibility evidence without claiming the consumer inventory is complete.
6. Identify regression-suite health concerns: obsolete, duplicate, brittle, slow, uncontrolled, or missing-semantic evidence.
7. Analyse the earlier duplicate-fulfilment defect using facts, hypotheses, contributing conditions, evidence gaps, and a proportionate strategy update.
8. Produce a release-confidence statement containing strongest evidence, known gaps, residual risk, recommendation, and revision triggers.

**Expected artifact:** A three- to four-page API Change and Regression Strategy containing an impact map, selected evidence portfolio, timing rationale, deliberate exclusions, production-learning record, and release-confidence statement.

**Constraints:** Atlas Commerce is fictional. Do not require all endpoint checks to be rerun, claim universal consumer compatibility, implement a pipeline, prescribe a monitoring tool, or treat “add one more test” as the only learning action.

## Further Reading

- [Part III, Chapter 10 — Regression Strategy, Test Selection, and Continuous Delivery Feedback](../../part-03-software-testing/chapters/chapter-10-regression-strategy-test-selection-and-continuous-delivery-feedback.md) — general regression-selection context.
- [Part III, Chapter 11 — Defect Investigation, Escaped Defects, and Production Learning](../../part-03-software-testing/chapters/chapter-11-defect-investigation-escaped-defects-and-production-learning.md) — complementary production-learning context.

## References

[^openapi]: OpenAPI Initiative. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html). Accessed 2026-08-10.
[^json-schema]: JSON Schema. [Specification](https://json-schema.org/specification). Accessed 2026-08-10.
[^rfc9110]: Fielding, R., Nottingham, M., and J. Reschke, eds. [RFC 9110 — HTTP Semantics](https://www.rfc-editor.org/rfc/rfc9110.html). IETF, June 2022. Accessed 2026-08-10.
[^iso25010]: International Organization for Standardization. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). ISO, 2023. Accessed 2026-08-10.
[^google-postmortem]: Google. [Postmortem Culture: Learning from Failure](https://sre.google/workbook/postmortem-culture/). *The Site Reliability Workbook*. Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] identify changed API assumptions and their affected boundaries;
- [ ] select targeted or broader regression evidence for a stated risk;
- [ ] explain what selected consumer, dependency, and production evidence cannot establish;
- [ ] assess regression-suite health beyond execution volume;
- [ ] analyse an escaped API defect without individual-blame framing; and
- [ ] communicate release confidence, residual risk, and a revision trigger.

**Next:** [Chapter 10 — Capstone: API Quality Strategy and Evidence Portfolio](chapter-10-capstone-api-quality-strategy-and-evidence-portfolio.md).
