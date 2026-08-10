# Chapter 3 — Contract Quality: Schemas, Semantics, Compatibility, and Evolution

## Metadata

| Field | Value |
|---|---|
| Part | Part IV — API Quality Engineering |
| MQE-BOK domain | Domain 4 — API Quality Engineering |
| Chapter | 3 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–2 and familiarity with structured JSON data |
| Estimated study time | 165 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A contract is useful only when its consumers can rely on its meaning through change. A schema can describe structure; it cannot, by itself, preserve that reliance.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional retailer. The Order API has returned an **amount** object for two years:

~~~json
{
  "amount": {
    "value": 1250,
    "currency": "GBP"
  }
}
~~~

An internal proposal changes the representation to a single numeric **amount** field. The author calls it a simplification because the API still returns a number and all currently maintained clients can parse it after a small change. A reporting consumer, however, has been treating the existing amount as minor units in the stated currency. A checkout consumer displays the amount using its own locale. A reconciliation consumer needs the currency to distinguish otherwise identical values.

The proposal is not just a renamed field. It changes structure, removes meaning, and transfers an interpretation decision to every consumer. A Quality Engineer asks which consumers depend on the present promise, whether the new promise is explicit, what evidence represents those consumers, and which risk remains after a migration. This is contract-quality reasoning: treating an API description as a promise that must remain understandable as it evolves.

## Introduction

Chapter 2 separated protocol semantics from application semantics. This chapter focuses on the application and interface promises that consumers and providers make through an API contract. The central question is not whether a JSON document matches an example. It is whether an interface can evolve without silently changing a consumer’s understanding of structure, meaning, errors, timing, or compatibility.

An **API contract** is the set of explicit and implicit expectations that govern an interaction between participants. It can be represented in an interface description, schema, documentation, examples, consumer code, error handling, operational agreements, and observed behaviour. Those sources do not always agree. Contract Quality Engineering makes the important expectations visible enough to review, test, evolve, and communicate.

This chapter treats OpenAPI and JSON Schema as useful description and structural-validation mechanisms. It does not teach document authoring, client generation, a contract-testing framework, or a universal versioning policy. Chapter 4 addresses how a contract interacts with state, retries, side effects, and concurrent requests.

## Why This Chapter Matters

An API can remain reachable, return a valid media type, and satisfy a schema while still breaking a consumer. A status field can retain its allowed values while one value changes business meaning. An optional field can become required in practice. An error body can retain its JSON shape while its identifiers or recovery meaning change. These are contract failures even when an endpoint check remains green.

Contract reasoning matters because APIs outlive individual changes and often cross team, deployment, and organisational boundaries. A provider may release first; a consumer may upgrade later; an unknown consumer may interpret a field in an undocumented way. Compatibility is therefore not a label that a provider can declare alone. It is a contextual judgement about which consumers and behaviours must continue to work.

The goal is neither to promise permanent immutability nor to block useful change. It is to identify the promise, decide which change is acceptable, obtain proportionate evidence, and communicate what remains unknown.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why an API contract is broader than a schema or interface description;
- distinguish structural, semantic, behavioural, and compatibility expectations;
- identify when a structurally valid request or response can still violate a consumer-relevant contract;
- explain the structural role and limits of JSON Schema and OpenAPI;
- identify explicit and implicit consumer dependencies;
- distinguish likely breaking changes from changes whose compatibility depends on consumer context;
- reason about backward and forward compatibility without treating either as a universal binary;
- evaluate versioning and deprecation as evolution strategies rather than automatic solutions;
- select contract and compatibility evidence appropriate to a proposed change; and
- communicate migration risk and residual uncertainty to accountable decision-makers.

## What Constitutes an API Contract?

An API contract states, or causes participants to rely on, what an interface makes available and how it behaves. It includes more than a request and response body.

| Contract dimension | Questions that make the promise reviewable |
|---|---|
| Operation availability | Which operation, resource, event, or callback is available, and under what conditions? |
| Request structure | Which fields, types, formats, nesting, and collection rules are expected? |
| Response structure | Which fields can appear, be absent, be null, or be derived? |
| Meaning | What do names, values, defaults, timestamps, and enumerations mean in the domain? |
| Required and optional behaviour | Is a field required in the representation, required for a consumer decision, nullable, defaulted, or conditionally present? |
| Errors | Which protocol result, error representation, stable identifier, and safe next action can a consumer rely on? |
| State and timing | What state is represented or required, and is work complete, pending, or subject to later reconciliation? |
| Compatibility and evolution | Which changes are supported, deprecated, coordinated, or likely to break a named consumer? |

The table is an **MSQE educational contract lens**, not a formal standard. Its purpose is to prevent a schema file from being mistaken for the whole promise. A schema may declare a string; the contract must still establish whether the string is a customer identifier, a currency code, a trace token, or a free-form comment. A description may list an operation; the contract must still establish whether its response means accepted work, completed work, or a request that requires further action.

## Structural Contracts: Shape Matters

A **structural contract** describes the permitted form of an interaction. It commonly includes field names, types, required fields, constraints, formats, object nesting, arrays, and allowed values. Structural clarity improves interoperability because a consumer can determine whether it can parse and handle a representation before applying domain logic.

Consider this fictional representation:

~~~json
{
  "orderId": "ord-701",
  "status": "pending_payment",
  "total": {
    "value": 1250,
    "currency": "GBP"
  },
  "submittedAt": "2026-08-10T09:30:00Z"
}
~~~

A structural contract might say that **orderId** is a non-empty string, **status** is one of a defined set of strings, **total** is an object with numeric **value** and string **currency**, and **submittedAt** has a timestamp format. It can also describe whether an array may be empty, whether an object permits additional properties, and whether a field can be absent or null.

Those rules are valuable, but each has limits:

| Structural observation | It can support | It cannot establish |
|---|---|---|
| A required field is present. | The selected representation has the declared field. | The field means what a consumer assumes or is appropriate in this state. |
| A value matches an enumeration. | The provider used an allowed token. | The token’s business meaning, transition rule, or consumer action is correct. |
| A timestamp has the expected lexical form. | The value is representable in the declared form. | It represents the intended business event or is current enough for a decision. |
| A numeric field satisfies a range. | The selected syntactic or numeric constraint holds. | Currency, unit, rounding rule, entitlement, or business calculation is correct. |
| An object rejects unexpected properties. | The receiver is enforcing a chosen strictness rule. | Every valid future consumer or evolution path is compatible. |

Structural strictness is a design decision. A provider that rejects unknown fields can protect against typos and unintended input; it can also make additive change difficult for consumers that send forward-looking data. A consumer that ignores unknown response fields can tolerate some additions; it can also conceal a change that should have been reviewed. Neither posture is universally correct. The contract should state the intended tolerance where it matters.

## Semantic Contracts: Meaning Matters

A **semantic contract** defines what a structurally valid interaction means. It connects representation values to domain facts, operations, state, side effects, and consumer decisions.

The following changes can leave structure intact while breaking meaning:

- **amount.value** remains a number but changes from minor currency units to major currency units.
- **status: "accepted"** remains an allowed value but changes from “record created” to “work merely queued.”
- **submittedAt** remains an RFC 3339-compatible timestamp but moves from customer submission time to asynchronous ingestion time.
- a nullable **trackingNumber** remains present but now uses an empty string to mean “not yet allocated.”
- an error identifier remains a string but changes from a stable consumer-handling category to an internal diagnostic detail.

Schema validation cannot decide whether any of these changes is correct. It can confirm that a value has the permitted shape. It cannot determine what a customer may be told, whether a consumer’s business rule is still valid, or whether a provider has changed a state transition. That requires domain language, explicit consumer expectations, and evidence from the relevant interaction.

### Required, optional, absent, null, empty, and defaulted

These terms are often compressed into “optional,” which hides contract risk.

| Condition | Possible contract meaning | Consumer risk if unspecified |
|---|---|---|
| **Required** | The field must be supplied or returned in the defined context. | A missing value causes parsing or decision failure. |
| **Optional** | The field may be absent under stated conditions. | A consumer silently treats absence as a business approval, a default, or an error. |
| **Absent** | No member is included in this representation. | Absence is confused with unknown, unsupported, intentionally withheld, or not applicable. |
| **Null** | A member is present with no value, if the contract permits null. | Consumers treat null as equivalent to absent, empty, or an actual domain value. |
| **Empty** | A present value has no content, such as an empty string or collection. | Empty is mistaken for not yet known, not applicable, or valid zero quantity. |
| **Defaulted** | A provider or consumer supplies a value when none is expressed. | Different participants apply different defaults or cannot tell whether a value was explicit. |

The correct interpretation is domain-specific. A missing delivery estimate can mean “not calculated,” while a null estimate can mean “calculated and unavailable.” The contract should state the distinction if a consumer’s action, presentation, or retry depends on it.

## Schemas and Interface Descriptions: Valuable but Bounded

JSON Schema provides vocabularies for describing and validating JSON structure.[^json-schema-validation] OpenAPI is a language-agnostic interface description format for HTTP APIs.[^openapi] They can make operation structure, media types, parameters, request bodies, responses, and reusable schemas visible to people and tools.

They do not fully prove:

- that a provider’s running behaviour matches the published description;
- that field names and allowed values have the intended domain meaning;
- that a response reflects authoritative state;
- that a consumer handles absent, unknown, defaulted, or newly added values safely;
- that all error, timing, retry, authorization, or side-effect behaviour is compatible; or
- that a change is safe for every consumer.

An OpenAPI description can express a useful part of an HTTP contract; it is not a complete executable model of an organisation’s business semantics. A JSON Schema can reject a malformed representation; it is not a business-rule engine. These are limits to state honestly, not reasons to discard structured descriptions.

## Consumers, Providers, and Implicit Dependencies

An explicit contract is written down. An implicit dependency is behaviour a participant relies on without a clear supported promise. Both can affect compatibility.

| Consumer dependency | Why it can become hidden | Provider question |
|---|---|---|
| A field is always present. | Examples always include it, even if the description marks it optional. | Is presence guaranteed, conditional, deprecated, or merely common today? |
| Enumeration values stay stable. | Consumer code branches only over values it has seen. | What happens when a new value appears, an old one is retired, or meaning changes? |
| Array order is stable. | An example is sorted and consumers select the first entry. | Is ordering guaranteed, incidental, or supplied through an explicit sort rule? |
| An error has a particular shape. | A consumer parses body fields or maps an identifier to a user action. | Which fields and identifiers are stable enough to support that handling? |
| A nullable field is never null. | Production data has not yet exposed the permitted condition. | Is null actually valid, and can a consumer distinguish it from absence? |
| A timestamp denotes one event. | The name sounds self-explanatory. | Which event, clock, timezone, and update rule does it represent? |

Providers cannot discover every private use of an interface. Consumers should not convert observation into a permanent guarantee silently. Quality Engineers make named dependencies visible, challenge undocumented assumptions, and identify a reasonable evidence plan before a change becomes an outage.

## Compatibility Is a Consumer Question

**Compatibility** is the ability of participants to continue to work together for the contract and conditions that matter. It is not universally binary. A change can be compatible with an updated consumer, incompatible with an older consumer, structurally tolerable but semantically harmful, or safe only after a migration.

**Backward compatibility** commonly asks whether a newer provider remains usable by an existing consumer. **Forward compatibility** commonly asks whether an older participant can tolerate information or behaviour from a newer participant. These labels vary by ecosystem and direction of change; state the participants and versions rather than relying on the label alone.

Some ecosystems also use **source compatibility** to describe whether consumer source code or generated client code can continue to compile. That is related to, but not the same as, structural compatibility at a running API boundary. This chapter uses structural compatibility for the consumer’s ability to parse and handle the received interface representation.

| Compatibility lens | Example question |
|---|---|
| Structural compatibility | Can the consumer parse the representation, fields, types, and media type it receives? |
| Behavioural compatibility | Does the provider still perform the operation, error outcome, state transition, and timing a consumer relies on? |
| Semantic compatibility | Do values, defaults, ordering, and status meanings retain the consumer-relevant meaning? |
| Operational compatibility | Can consumers continue to use the interface under relevant limits, latency, credentials, and migration conditions? |

Compatibility evidence should name its scope. “The change is backward compatible” is weak unless it says for which provider release, consumer population, representation, operation, and behavioural assumption. A schema diff can reveal removed fields and changed types; it cannot expose every semantic or undocumented dependency.

## Change Analysis: Breaking and Conditionally Compatible Changes

A **breaking change** is a change that prevents a consumer from continuing to use the interface as a supported contract requires. The important word is consumer: a provider cannot determine breakage from a local schema diff alone.

| Proposed change | Likely risk | Why a simple label is insufficient |
|---|---|---|
| Remove a response field. | Existing consumers cannot parse or make a decision. | A field might be unused, derived elsewhere, or required only by one critical consumer. |
| Rename a field. | Parsers, mappings, documentation, and support procedures break. | An adapter or migration can make the change safe for a defined population. |
| Change a field type. | Parsing, range, precision, and equality assumptions fail. | Some consumers can handle both forms; others cannot. |
| Narrow an enumeration. | A consumer sends or expects a value no longer accepted. | The retired value might be historical, still active, or mapped by a migration. |
| Add an enumeration value. | Consumer code assumes it has handled every value. | Additive structure can still break exhaustive switches, user messages, or workflow rules. |
| Change a default. | Consumers that omit a value receive different behaviour. | The request structure is unchanged, but the behavioural contract changed. |
| Change nullability or absence behaviour. | Consumers misinterpret unknown, unavailable, or not-applicable data. | Structure may remain valid under a permissive schema while decisions change. |
| Change error behaviour. | A consumer retries, displays, or recovers incorrectly. | The successful path can remain unchanged while failure safety degrades. |
| Change ordering. | Consumers select a first result, page incorrectly, or compare lists. | Ordering might be documented, accidental, or already consumer-specific. |
| Change a field’s meaning. | A valid representation drives a wrong business decision. | No structural diff may detect the most consequential break. |

Terms such as “non-breaking” should therefore be qualified. Adding an optional response property often is compatible for consumers that ignore unknown fields; it can break strict deserializers, signed representations, generated clients, or consumers whose validation rejects additional properties. A provider should not call the addition universally safe without knowing the relevant consumer tolerance.

### Schema diff is an input, not a verdict

A schema or interface-description diff can efficiently expose explicit structural changes: removed operations, new required request fields, altered types, changed media types, removed response codes, or narrowed enumerations. It is useful evidence because it makes change review repeatable and visible.

It cannot establish semantic compatibility, actual deployment order, an undocumented consumer dependency, or whether an operational limit has changed. The Quality Engineer should use a diff to formulate questions, not to replace the answers:

- Which named consumers use this field or error?
- What meaning did they rely on?
- Does the changed default, ordering, or timing alter a decision?
- What consumer version or integration evidence is available?
- Which consumer population remains unobserved?

## Versioning and Deprecation Are Evolution Strategies

Versioning gives participants a way to distinguish or negotiate different interface contracts. Common approaches include version information in a URI, a request header or media type, a schema or representation identifier, and compatibility-first evolution that avoids a new externally visible version for supported changes.

No approach is universally best. URI versioning can make a major contract boundary obvious but may create parallel operating paths. Header or media-type versioning can preserve stable resource identifiers but be less visible to some clients and tools. Schema evolution can preserve one endpoint while changing optionality or descriptions. Compatibility-first evolution can reduce migration disruption but requires disciplined consumer awareness and clear behavioural promises.

The decision should name the problem it solves: incompatible representation, new capability, changed semantics, deprecated operation, staged migration, or consumer rollout. A version label does not make an ambiguous or undocumented change safe.

**Deprecation** is a communicated transition from a supported behaviour to a replacement or removal. A credible deprecation plan normally states:

- the affected operation, field, value, error, or behaviour;
- the supported replacement and its semantic differences;
- the migration window and any customer or regulatory constraints;
- how affected consumers will be informed or identified where appropriate;
- what evidence indicates adoption or remaining use; and
- what happens when the supported period ends.

Warnings, documentation, telemetry, and consumer communication can help, but none proves that every consumer has migrated. Treat a deprecation as a risk-managed change rather than a notice that transfers all responsibility to the consumer.

## Error Contracts Are Contracts

Chapter 2 established that HTTP status and error representation should agree. Contract quality adds the evolution question: can consumers continue to recognise an error, determine a safe next action, and correlate it with the relevant interaction after the provider changes?

| Error-contract element | Useful promise | Change risk |
|---|---|---|
| Protocol status | The immediate HTTP outcome. | A consumer’s handling changes from rejection to retry or from retry to customer correction. |
| Stable application identifier | A consumer-recognisable category or condition. | Replacing it with an internal message or silently changing its meaning breaks safe handling. |
| Structured details | Bounded context needed to locate a field, rule, or state conflict. | A consumer parses undocumented prose or sensitive diagnostic data is exposed. |
| Safe next-action guidance | A documented retry, correction, polling, or support action where applicable. | The consumer repeats an unsafe operation or abandons an operation that is pending. |
| Correlation information | A safe way to connect the error to later evidence. | A support or recovery workflow cannot distinguish one failed interaction from another. |

Problem Details provides one standard representation format for HTTP API error details.[^rfc9457] Its use does not make errors semantically stable by default. The contract still needs to define which fields, identifiers, and actions consumers may rely on, and what information must remain protected.

## Contract Evidence and Contract Drift

**Contract evidence** is evidence that a provider and relevant consumers agree on selected interface expectations. It can come from interface-description review, schema validation, representative consumer examples, compatibility checks, integration observations, migration exercises, change review, or safely interpreted production feedback.

**Contract drift** occurs when a documented or described contract and actual behaviour diverge, or when consumer reliance has moved beyond the documented promise. Drift can appear when an implementation changes without updating a description, documentation promises behaviour no longer implemented, an example becomes treated as a guarantee, or consumers evolve around a provider defect.

| Evidence source | Useful claim | Important limitation |
|---|---|---|
| Schema or interface-description diff | An explicit structural change was detected. | Meaning, actual runtime behaviour, and undocumented consumers remain unknown. |
| Provider structural validation | Selected input or output follows declared constraints. | Does not establish domain semantics or consumer handling. |
| Representative consumer example | A named consumer can interpret a selected supported interaction. | Does not represent every version, integration, or production configuration. |
| Consumer-provider contract check | The selected shared expectation holds in a controlled condition. | Does not prove broader workflow, performance, or all consumer populations. |
| Migration exercise | A selected path from old to new behaviour is usable. | Does not prove complete adoption or safe rollback in every environment. |
| Production or consumer feedback | A detected consumer condition or usage pattern exists. | Absence of a signal does not prove absence of a consumer. |

The evidence portfolio follows risk. Removing a price field used in invoicing calls for stronger consumer and migration evidence than adding an internal diagnostic property to an intentionally extensible representation. The goal is a proportionate, explicit decision—not an impossible claim of universal compatibility.

## Contract Evolution Questions

Before approving an API change, a Quality Engineer can use the following **MSQE educational contract-evolution prompt**:

~~~text
promised behaviour and consumer decision
  → proposed structural or semantic change
  → affected consumers and assumptions
  → compatibility and migration evidence
  → limitation and residual risk
~~~

For the Atlas amount change, the useful questions are not “does the new schema validate?” or “is the version number incremented?” They include:

- Which consumers need the currency and unit to make a correct decision?
- Is the new number unambiguously interpretable across currencies and locales?
- Can both representations coexist during a migration, and for whom?
- Which errors or defaults change if currency is absent?
- What evidence represents checkout, reporting, reconciliation, and unknown consumers?
- What decision-maker accepts the residual risk if a consumer cannot be identified?

These questions make contract work an engineering activity. They connect a change to a real consumer outcome, select evidence, and name the boundary of confidence.

## QA → QE Transition

| Existing QA activity | Expanded Contract Quality Engineering practice |
|---|---|
| Compare a response with a schema. | Ask what structural conformance proves and which semantic, state, or consumer claims remain open. |
| Test required and optional fields. | Examine absent, null, empty, defaulted, and conditionally present values as consumer decisions. |
| Record an API regression. | Classify the affected promise: structure, semantics, error, timing, compatibility, or migration. |
| Test a new API version. | Identify affected consumers, migration path, compatibility evidence, and residual population risk. |
| Check an error body. | Ask whether consumers can safely interpret the status, identifier, details, and recovery action through change. |

The Quality Engineer does not certify that every consumer is compatible. They make the contract, known consumers, evidence, exclusions, and residual risk clear enough for accountable people to decide.

## Engineering Perspective

Contract quality is a change-management capability. Clear structural descriptions reduce ambiguity, but stable software requires teams to preserve or deliberately revise the semantic and behavioural promises that consumers use. A version marker, generated client, or passing schema check does not remove the need for ownership, communication, migration planning, and evidence.

The highest-value intervention may be small: define what an absent field means, retain a deprecated error identifier for a transition, publish an explicit ordering rule, or identify one critical consumer before changing a default. Quality Engineers improve safety when they make these assumptions inspectable early, rather than discovering them after an integration incident.

## Industry Perspective

The OpenAPI Specification describes a standard, programming-language-agnostic interface-description format for HTTP APIs.[^openapi] JSON Schema provides structural-validation vocabularies for JSON instances.[^json-schema-validation] RFC 9457 defines a standard format for problem details in HTTP APIs.[^rfc9457] These are standards or specifications for describing and representing portions of an interface; none establishes an organisation’s full business semantics or proves compatibility.

The contract lens and evolution prompt in this chapter are MSQE educational framing. They are not a replacement for a standard, an API-governance process, or a contract-testing product.

## Common Misconceptions

### “The schema is the contract.”

A schema is an important structural part of many contracts. It does not, by itself, define domain meaning, complete state behaviour, timing, compatibility, or every consumer expectation.

### “Adding an optional field is always non-breaking.”

It is often compatible for tolerant consumers, but strict parsers, generated clients, unknown-field validation, signed representations, and business assumptions can make it harmful. State the consumer context.

### “A version number makes a breaking change safe.”

A version can distinguish contracts. It does not migrate consumers, clarify semantics, preserve data meaning, or establish that a consumer selected the intended version.

### “Documentation drift is only an editorial problem.”

When documentation, schema, examples, and runtime behaviour disagree, consumers can make wrong technical or business decisions. Drift is an interface-quality risk.

### “Contract testing proves every consumer remains compatible.”

Selected consumer-provider evidence can be strong for selected promises. It does not prove every unknown consumer, production configuration, or wider customer workflow.

## Summary

API contracts are multidimensional promises about structure, meaning, operation, errors, state, timing, and evolution. Structural descriptions make interactions easier to parse and validate, but semantic and behavioural contracts determine whether consumers can continue to act correctly.

Contract Quality Engineering makes those promises visible during change. It asks which consumers rely on the current behaviour, what a structural or semantic change alters, what migration and compatibility evidence is proportionate, and what remains unknown. That prepares the learner to examine the stateful consequences of requests in Chapter 4.

## Key Takeaways

- A contract is broader than a schema, example, or interface-description document.
- Structural validity does not establish semantic correctness, authoritative state, or consumer compatibility.
- Required, optional, absent, null, empty, and defaulted values can carry different contract meanings.
- Compatibility is contextual: structural, behavioural, semantic, and operational assumptions can differ.
- A schema diff is useful evidence of explicit change, not a verdict on safety.
- Additive changes can still harm strict or assumption-bound consumers.
- Versioning and deprecation are evolution strategies, not automatic compatibility guarantees.
- Contract evidence should name the consumer population, selected promise, limitation, and residual risk.

## Review Questions

1. Why is an API contract broader than an OpenAPI description or JSON Schema?
2. Give an example of a representation that is structurally valid but semantically incompatible with a consumer.
3. How can absent, null, and empty values create different API-quality risks?
4. Why can a newly added enumeration value break a consumer?
5. Distinguish structural, behavioural, semantic, and operational compatibility.
6. What can a schema diff establish, and what cannot it establish?
7. Why is a version label not a complete evolution strategy?
8. What contract evidence would you seek before changing a default relied on by a billing consumer?

## Interview Questions

1. How would you assess whether an API change is backward compatible?
2. A provider says an optional response field can be removed because it was never required. What would you ask?
3. How do you identify a semantic breaking change when the schema did not change?
4. What would a credible API deprecation plan include?
5. How do you communicate compatibility uncertainty when some consumers are unknown?

## Practical Exercise

### Review an API Contract Change

**Objective:** Produce an **API Contract Compatibility Review** for a fictional Atlas Commerce proposal. Explain why each change is acceptable, risky, or requires more evidence; do not merely label changes breaking or non-breaking.

**Current illustrative response:**

~~~json
{
  "orderId": "ord-701",
  "status": "accepted",
  "total": { "value": 1250, "currency": "GBP" },
  "deliveryEstimate": null
}
~~~

**Proposed changes:**

1. Replace **total** with a numeric **amount** field. The proposal does not state the currency unit.
2. Add **manual_review** to the allowed **status** values.
3. Make **deliveryEstimate** absent when no estimate is available, rather than present with null.
4. Replace the stable error field **code** with an unstructured **message** string.
5. State that response order is no longer stable, although one reporting consumer currently selects the first result.

**Tasks:**

1. Separate structural, semantic, behavioural, and compatibility changes.
2. Identify named and plausible implicit consumer dependencies.
3. Explain which changes are likely breaking, conditionally compatible, or require a migration decision, with reasons.
4. Identify the evidence needed from schema comparison, consumer examples, integration, migration, and production feedback.
5. Propose safe communication or deprecation actions without prescribing a universal versioning strategy.
6. State what the contract descriptions can establish and what they cannot.
7. Write a residual-risk statement for an accountable release decision-maker.

**Expected artifact:** A three- to four-page API Contract Compatibility Review containing a change inventory, consumer-assumption table, compatibility analysis, evidence plan, migration considerations, and residual-risk statement.

**Constraints:** Atlas Commerce is fictional. Do not write an OpenAPI document, JSON Schema, consumer test, client, or migration script. Do not claim that a schema diff or one consumer example proves universal compatibility.

## Further Reading

- [Chapter 2 — Interface Semantics: HTTP, Representations, and API Styles](chapter-02-interface-semantics-http-representations-and-api-styles.md) — protocol meaning that a structural contract alone cannot supply.
- [Part III, Chapter 9 — Service, API, and Distributed-System Testing Strategy](../../part-03-software-testing/chapters/chapter-09-service-api-and-distributed-system-testing-strategy.md) — complementary context for compatibility evidence across service boundaries.

## References

[^openapi]: OpenAPI Initiative. [OpenAPI Specification](https://spec.openapis.org/oas/latest.html). Accessed 2026-08-10.
[^json-schema-validation]: JSON Schema. [JSON Schema Validation: A Vocabulary for Structural Validation of JSON](https://json-schema.org/draft/2020-12/json-schema-validation). Draft 2020-12. Accessed 2026-08-10.
[^rfc9457]: Nottingham, M., Wilde, E., and S. Dalal. [RFC 9457 — Problem Details for HTTP APIs](https://www.rfc-editor.org/rfc/rfc9457.html). IETF, July 2023. Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] distinguish a structural description from the wider semantic and behavioural contract;
- [ ] identify a consumer assumption that a schema cannot reveal;
- [ ] assess compatibility in terms of named participants and their actual reliance;
- [ ] explain why an additive change can still create risk;
- [ ] select proportionate compatibility evidence and state its limitation; and
- [ ] communicate migration and residual risk without claiming universal compatibility.

**Next:** [Chapter 4 — Stateful API Behaviour: Validation, Errors, Idempotency, and Concurrency](chapter-04-stateful-api-behaviour-validation-errors-idempotency-and-concurrency.md).
