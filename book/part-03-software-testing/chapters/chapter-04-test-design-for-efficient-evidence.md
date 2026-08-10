# Chapter 4 — Test Design for Efficient Evidence

## Metadata

| Field | Value |
|---|---|
| Part | Part III — Software Testing Engineering |
| MQE-BOK domain | Domain 3 — Software Testing Engineering |
| Chapter | 4 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–3; Part I — Foundations; Part II — Programming for Quality Engineers |
| Estimated study time | 140 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A well-designed test is selected because of the distinction it can reveal, not because it adds another row to a test-case inventory.

## Opening Story

The following illustrative scenario continues with Atlas Commerce, the fictional subscription service used in earlier chapters. A team is refining a pause-subscription change. A customer may pause an active subscription for one, two, or three billing cycles, but not if an invoice is already in a non-reversible stage. Resumption has different outcomes depending on payment status, the planned resume date, and whether the subscription was cancelled while paused.

The first draft of the test list has 86 cases. Several test the same valid one-cycle pause through slightly different screens. Others list dates without explaining why a date matters. No case clearly addresses the instant at which the invoice process becomes non-reversible, the interaction between an expired payment method and resumption, or the invalid attempt to resume a cancelled subscription.

Marta, the QA Engineer, does not begin by asking which cases to delete. She asks which distinctions could change an important outcome. She separates conditions from examples, identifies the relevant partitions and boundaries, uses a decision table for the eligibility rules, and traces state transitions that depend on history. The result is a smaller, explainable evidence set. It does not prove every subscription path correct. It makes the important rules, risks, and remaining gaps visible.

## Why This Chapter Matters

Chapter 1 established that a test result is bounded evidence rather than proof. Chapter 2 showed that risk helps a team decide where evidence matters most. Chapter 3 improved the requirements, examples, states, and testability conditions from which tests are designed. This chapter turns those inputs into deliberate selection.

Test design is necessary because a system usually has more possible inputs, states, histories, environments, and dependency responses than a team can test individually. A large test-case inventory can still miss an important distinction, while a compact set of carefully selected examples can expose the rule or boundary that matters to a decision. The goal is not minimal test count. It is proportionate, decision-relevant evidence.

The techniques in this chapter are reasoning tools, not mechanical recipes or certification answers. They help a team make a model of behaviour explicit, choose representative examples, and state the limits of that choice. Chapter 5 complements this work with exploratory investigation when questions, behaviours, or risks cannot be fully anticipated in advance. Chapters 6 and 7 later address where evidence belongs in a system and how automated checks can be made reliable; neither topic is implemented here.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish a test condition from a concrete test case or check;
- explain why finite test selection is necessary and why additional test cases do not automatically provide stronger evidence;
- use equivalence partitioning and boundary reasoning to select representative examples with stated assumptions;
- use decision tables and state-transition reasoning when rules or history affect an outcome;
- identify interacting dimensions and explain when a combinatorial selection approach may be useful;
- use defect history, domain knowledge, architecture knowledge, and incidents as inputs to test selection without treating experience as proof;
- combine techniques to produce a compact, risk-informed evidence set; and
- document the rationale, limitations, and residual uncertainty of a test-design decision.

## Test Design Is a Selection Problem

For a non-trivial feature, testing every possible input and history is normally infeasible. Consider only a pause request with three durations, several account states, several invoice states, payment conditions, timestamps near a billing boundary, and dependency outcomes. Each additional dimension multiplies the possible combinations. The system may also behave differently after retries, configuration changes, concurrent activity, or a delayed dependency response.

Exhaustive testing is possible for some small, controlled rules, but it is not a sensible default claim for a product behaviour or customer journey. The relevant question is therefore not “How many test cases do we have?” It is “Which distinctions must this evidence set make visible for the decision we are supporting?”

Test design starts with a model: a rule, condition, transition, classification, relationship, or risk hypothesis. The model is an abstraction. It is useful because it exposes what the team believes matters, but it can be wrong or incomplete. Chapter 1's evidence discipline still applies: a passing selection supports only the conditions exercised and the **test oracle**, the source or mechanism used to judge whether observed behaviour is acceptable.

### Test conditions and test cases

A **test condition** is something that warrants investigation: a rule, risk, event, state, input class, interface behaviour, or quality concern. A **test case** or **check** is one concrete way of investigating a condition with chosen data, preconditions, actions, observations, and an oracle.

| Test condition | Possible concrete example | What it can help establish |
|---|---|---|
| A pause duration must be one, two, or three billing cycles. | Request a two-cycle pause for an active subscription with no pending invoice. | A representative valid duration is accepted under stated conditions. |
| A pause cannot be applied after an invoice becomes non-reversible. | Request a one-cycle pause after the invoice state is `finalized`. | The specified restriction is enforced for that invoice state. |
| Resumption with an expired payment method must preserve a recoverable state. | Resume a paused subscription with an expired payment method. | The system follows the selected recovery rule rather than silently activating access. |

One condition may need several examples. One example may illuminate several conditions. The purpose of the distinction is not bureaucracy; it prevents a list of concrete cases from concealing the rule, risk, or uncertainty each one is intended to address.

## Equivalence Partitioning: Select Meaningful Classes

**Equivalence partitioning** groups values or conditions that the team expects the system to treat similarly for a particular rule. A representative from a meaningful partition can often provide more efficient evidence than testing every member of that group.

For the Atlas duration rule, an initial model might be:

| Partition | Representative value | Expected treatment | Assumption to challenge |
|---|---:|---|---|
| Below the supported range | 0 cycles | Reject with a clear explanation. | All non-positive values are handled consistently. |
| Valid range | 2 cycles | Accept when other eligibility rules are met. | One, two, and three cycles have the same eligibility rule. |
| Above the supported range | 4 cycles | Reject with a clear explanation. | Values above three do not trigger a different workflow. |
| Invalid representation | `two` or missing value | Reject or request correction without changing state. | Validation behaves safely across input formats. |

The partitions are not facts discovered by the technique. They are a model of expected similarity. If a two-cycle pause has a special billing or notification policy, it is not equivalent to one or three cycles and should be separated. Likewise, an invalid value may be handled differently when supplied through a user interface, service request, import, or restored state. The chosen boundary and evidence target determine whether those are the same partition for this decision.

### Valid and invalid partitions

“Valid” and “invalid” are not merely happy-path and error labels. A valid partition describes values expected to satisfy a rule under stated preconditions. An invalid partition may describe an unsupported value, an inconsistent state, a missing field, an unauthorized request, or a policy conflict. Both deserve purposeful evidence when their consequences differ.

Avoid selecting one value from every apparent group by habit. Ask instead:

- What rule makes these values meaningfully similar?
- Could a change in type, representation, origin, or state invalidate that similarity?
- What consequence follows if this partition is handled incorrectly?
- Which representative value would best reveal the rule or its failure behaviour?

## Boundary Value Analysis: Investigate Changes in Treatment

Boundary value analysis focuses on values or moments near a point at which the system's treatment may change. Defects often emerge where one rule becomes another: a maximum amount, a date cutoff, a retry limit, a permission threshold, or the transition from one state to the next.

For a rule allowing a pause only before an invoice is finalized, the important question is not simply whether a pause works on a normal day. It is what defines the boundary, which clock or event establishes it, and what outcome should occur immediately before, at, and after it.

| Boundary question | Useful examples | Evidence limitation |
|---|---|---|
| Duration is limited to one through three cycles. | 0, 1, 3, and 4 cycles. | Does not establish behaviour for every input representation or channel. |
| A request is allowed until an invoice reaches `finalized`. | Request before finalization, at the state change, and after finalization. | Requires a controllable, observable invoice state. |
| A customer may resume on the planned date. | Resume just before, on, and just after that date. | Does not establish all time-zone, clock, or dependency conditions. |

“At the boundary” is not always a single number. A date may involve time zones, scheduled jobs, clock sources, queues, and eventual state propagation. Test design should expose that ambiguity rather than invent a false precision. When the boundary cannot be controlled or observed, Chapter 3's testability questions return: what needs clarification, a controllable fixture, a visible state, or another suitable evidence boundary?

## Decision Tables: Make Rule Combinations Visible

A **decision table** is useful when outcomes depend on combinations of conditions. It makes combinations visible so that a team can identify missing rules, inconsistent outcomes, impossible states, and groups of rules that have the same result.

The following illustrative table concerns whether Atlas accepts a pause request. It is deliberately compact; a production rule may need more conditions and agreed definitions.

| Condition or outcome | Rule 1 | Rule 2 | Rule 3 | Rule 4 |
|---|---:|---:|---:|---:|
| Subscription is active | Yes | Yes | Yes | No |
| Requested duration is supported | Yes | Yes | No | — |
| Invoice is reversible | Yes | No | Yes | — |
| Accept and record pause | Yes | No | No | No |
| Explain invoice restriction | No | Yes | No | No |
| Explain duration restriction | No | No | Yes | No |
| Explain invalid subscription state | No | No | No | Yes |

The dash means the condition is not needed for that rule because an inactive subscription already prevents the request. That is not an invitation to ignore the condition everywhere. It documents that, for this outcome, further evaluation is unnecessary.

Before deriving checks, review the table with product and development colleagues:

- Are all condition values meaningful and observable?
- Are any combinations impossible, or merely rare?
- Which rules have the same outcome and can be collapsed without losing an important distinction?
- Does the table describe intended policy, current implementation, or an unresolved disagreement?

A decision table can uncover a specification problem before a test is written. It does not guarantee complete interaction coverage, usability, data integrity, or deployed integration behaviour.

## State-Transition Reasoning: History Can Change Meaning

State-transition reasoning is useful when the meaning of an action depends on what happened before. A subscription is not only an object with fields; it has a history that determines whether pausing, resuming, cancelling, or billing is valid.

| Current state | Event | Expected next state or outcome |
|---|---|---|
| `active` | Pause request with eligible conditions | `paused` and a recorded planned resume date |
| `paused` | Resume with valid payment method | `active` with the agreed billing-date outcome |
| `paused` | Resume with expired payment method | `payment-recovery` or another agreed recoverable state |
| `cancelled` | Resume through the pause flow | Reject; no unintended reactivation |
| `paused` | Pause request | Reject, no-op, or another agreed policy outcome |

The table gives a first model, not a full state-machine specification. For a high-consequence transition, the team may also need to consider transition history: repeated requests, delayed events, a cancellation between request and completion, or recovery after a partial failure. Those questions can inform Chapter 5 exploration now and later Parts III and IV work on integration and distributed behaviour.

## Classification and Combinatorial Reasoning

Features often vary along multiple dimensions: subscription state, plan type, duration, invoice state, payment state, customer region, feature flag, and request channel. Testing every combination may be infeasible. **Combinatorial reasoning** makes the dimensions and selected interaction strength explicit rather than accidentally sampling them.

For example, a team might classify the pause change as follows:

| Dimension | Selected values |
|---|---|
| Subscription state | `active`, `paused`, `cancelled` |
| Duration | 1, 2, 3 cycles |
| Invoice state | reversible, finalized |
| Payment state at resume | valid, expired |
| Request channel | customer interface, support-assisted request |

Pairwise selection aims to cover every selected pair of values at least once. It can reduce the number of combinations substantially, but it is not a proof that all important interactions are covered. NIST guidance specifically cautions against assuming that two-way coverage is always enough; the appropriate strength depends on risk, the interaction model, and available evidence.[^nist-combinatorial]

Use combinatorial selection when dimensions are understood, values are meaningful, and interaction risk warrants it. Do not use it to avoid thinking about impossible combinations, dominant risks, or a high-consequence three-way interaction that deserves direct evidence. The method helps choose among modeled combinations; it cannot repair a weak model.

## Experience-Based Selection: Use Knowledge Without Worshipping It

Systematic techniques make assumptions inspectable. Experience adds information that specifications may not contain. Useful inputs include previous defects, customer complaints, incident learning, architecture changes, domain policy, difficult data states, dependency history, and known failure patterns.

For example, Atlas has previously produced duplicate invoices after retrying a timeout near a billing boundary. That history is a reason to design focused evidence for repeated requests and invoice-state transitions, even if the happy-path requirement says nothing about retries. It is not proof that the same failure will recur or that every timeout requires the same response.

Experience-based selection is strongest when the team records why a concern matters and combines it with a visible model. “Test this because it feels risky” can become “The invoice boundary and retry path receive focused evidence because a prior incident showed duplicate billing when those conditions interacted.” That statement can be challenged, improved, and revisited.

## Positive, Negative, and Edge Conditions

Positive, negative, and edge conditions are useful descriptions only when connected to a rule or risk.

- A **positive condition** demonstrates a selected intended outcome under stated conditions.
- A **negative condition** examines an invalid, disallowed, failed, or unexpected condition and its safe handling.
- An **edge condition** examines a point where treatment may change, such as a limit, transition, or timing boundary.

They are not three mandatory labels for every feature. A negative condition may be the most important customer-protection evidence. An edge condition can be a valid request at a policy boundary. A positive case can be weak evidence if it exercises a low-consequence path while leaving the changed risk unexamined.

## Choosing and Combining Techniques Deliberately

The following is an **MSQE educational selection model**, not a standard or universal mapping. Start from the condition or risk, choose a reasoning tool that makes the relevant distinction visible, define the expected evidence, and state the limitation.

| Problem characteristic | Useful reasoning approach | Expected evidence | Important limit |
|---|---|---|
| A rule divides values into meaningful classes. | Equivalence partitioning. | Representative values show the selected treatment of each class. | Similarity assumptions may be wrong. |
| Treatment changes at a threshold or time. | Boundary value analysis. | Evidence near the rule change. | A boundary may depend on hidden clocks, state, or configuration. |
| Several conditions determine an outcome. | Decision table. | Rules and missing combinations become visible. | The table may omit a relevant condition. |
| Prior history changes an action's meaning. | State-transition reasoning. | Valid, invalid, and recovery transitions are examined. | The model may not capture all histories or concurrent events. |
| Multiple dimensions interact. | Classification and proportionate combinatorial selection. | Chosen interactions are covered deliberately. | Pairwise coverage is not universal sufficiency. |
| A concern comes from previous learning or domain knowledge. | Experience-based selection, made explicit. | Known failure modes receive focused investigation. | History can bias attention away from novel risks. |

One feature commonly needs more than one technique. For the pause change, equivalence partitions help select durations; boundary analysis examines invoice finalization; a decision table exposes eligibility rules; state transitions cover resumption and cancellation history; and targeted exploration can investigate recovery paths or surprising interactions. Combining techniques is not overengineering when each adds a distinct evidence value.

### Test-case economy and traceability

Test-case economy means removing or avoiding cases that produce no material new evidence for the decision. It does not mean selecting the fewest possible checks. A case may be redundant when it exercises the same rule, conditions, boundary, observation, and risk as another case. It is not redundant merely because it has a similar title.

Keep lightweight traceability. A reviewer should be able to see:

- the condition, risk, or question that motivated an example;
- the technique or model that informed its selection;
- the important preconditions, data, and observation;
- the evidence the result can support; and
- the conditions it intentionally does not cover.

This rationale can be a concise table, an issue reference, a decision record, or well-named test documentation. The format matters less than the ability to explain and review the selection.

## Engineering Perspective

Test design changes engineering work before execution begins. A boundary that cannot be controlled, an outcome that cannot be observed, or a state that cannot be reproduced is not just a testing inconvenience. It is evidence about design, configuration, data, or diagnostic limitations that may need a proportionate engineering response.

Good design also protects feedback speed. A small set of deterministic, readable checks can be more useful than a large, fragile regression collection when it makes a changed rule visible early. Part II's programming practices help readers reason about data, configuration, failure handling, and diagnostics. They do not make a test technique automatically executable or sufficient. Chapter 7 will return to reliable automated checks after Chapter 6 establishes evidence boundaries.

## Industry Perspective

ISO/IEC/IEEE 29119-4:2021 defines test-design techniques for use with the test-design and implementation process described in ISO/IEC/IEEE 29119-2.[^iso-29119-4] The ISTQB Foundation Level syllabus also presents equivalence partitioning, boundary value analysis, decision tables, state-transition testing, and experience-based techniques as established testing vocabulary.[^istqb-ctfl]

These sources provide useful terminology and techniques. They do not prescribe one test inventory, risk model, or evidence threshold for every product. The selection model in this chapter is MSQE educational framing: it connects known techniques to the decision, risk, evidence value, and stated limitation that matter in a particular context.

## Common Misconceptions

### “One test per partition proves the whole partition.”

A representative supports the model only to the extent that the partition's similarity assumption is valid. New information, data origins, channels, or hidden rules can justify further selection.

### “Boundary analysis means test the minimum and maximum only.”

The useful boundary is the point where treatment changes. It may involve state, time, configuration, or a dependency response rather than a simple numeric limit.

### “A decision table means every theoretical combination must be tested.”

It first makes combinations and rules visible. A team can identify impossible combinations and collapse equivalent outcomes with stated reasoning.

### “Pairwise testing is enough for all interaction risk.”

Pairwise selection can be valuable, but it does not cover every higher-order interaction or substitute for domain and risk judgement.

### “Exploration is what happens when design techniques fail.”

Exploration and structured design answer different questions. Chapter 5 shows how adaptive investigation can challenge, extend, and improve a model rather than compete with it.

## Summary

Test design turns risk, requirements, examples, and system knowledge into a purposeful selection of evidence activities. Equivalence partitions, boundaries, decision tables, state transitions, classifications, and experience-based insights help teams expose different kinds of distinctions. None is a proof mechanism or a universal recipe.

The strongest designs explain why each example exists, what it can establish, and what it leaves uncertain. A compact evidence set can be stronger than a long list when it deliberately addresses the changed rules, consequential boundaries, interaction risks, and known failure patterns. Exploration then provides an adaptive way to investigate the questions that structured design reveals or cannot yet answer.

## Key Takeaways

- Test design is deliberate selection under finite time, knowledge, and feedback constraints.
- A test condition identifies what warrants investigation; a test case or check is one concrete investigation.
- Partitions and boundaries are models with assumptions, not proof of complete behaviour.
- Decision tables and state transitions make rule combinations and history-dependent behaviour visible.
- Combinatorial selection can reduce infeasible combinations, but its interaction strength must fit the risk.
- Experience is valuable when its rationale is explicit and open to challenge.
- Combining techniques can create stronger evidence than applying one technique mechanically.
- Test-case economy means removing redundant evidence, not claiming that the smallest suite is sufficient.

## Review Questions

1. Why is a test condition different from a test case?
2. What assumption makes equivalence partitioning useful, and how might it fail?
3. How does boundary value analysis apply to a state or timing transition rather than a number?
4. When would a decision table be more useful than an ordinary scenario list?
5. What does state-transition reasoning reveal that a single happy-path test can miss?
6. Why can pairwise selection be useful without being a universal stopping rule?
7. How should incident history influence test selection without becoming an unquestioned rule?
8. What information should a lightweight test-design rationale preserve?

## Interview Questions

1. How would you reduce a large test-case list without reducing important evidence?
2. Describe a situation in which boundary analysis found, or could have found, a meaningful defect.
3. How do you choose between a decision table and state-transition reasoning?
4. How would you explain the limits of pairwise testing to a stakeholder?
5. How do you demonstrate that a test case exists for a risk rather than merely for coverage count?

## Practical Exercise

### Design Efficient Evidence for a Risky Feature

**Objective:** Produce a compact, explainable Test Design Evidence Pack for a fictional customer-impacting change.

**Scenario:** Atlas Commerce will introduce the pause-subscription capability. A customer can request a pause of one, two, or three cycles only when the subscription is `active` and the current invoice is reversible. A paused subscription may be resumed only with a valid payment method. A cancelled subscription must not be reactivated through the pause flow. Requests close to the invoice-finalization boundary have caused support incidents in a previous release. The team has two days to prepare evidence for a 10% staged rollout.

**Constraints:** Use fictional information only. Do not create an automation framework, a complete test plan, or a claim that the selection proves release readiness. You may state questions that need product or development clarification.

**Tasks:**

1. Identify at least eight important test conditions and connect each to a customer, technical, financial, or operational risk.
2. Select and justify at least four techniques or reasoning approaches from this chapter.
3. Derive a compact set of representative examples. Include valid, invalid, boundary, transition, and history-dependent conditions where relevant.
4. Create one decision table and one concise state-transition view for the most consequential rules.
5. Identify examples that would be redundant for the stated evidence goal and explain why.
6. Record assumptions, untested conditions, and residual uncertainty.
7. Write a short stakeholder summary explaining what the pack can and cannot establish before the rollout decision.

**Expected artifact:** A three- to four-page Test Design Evidence Pack containing a risk-and-condition map, selected techniques, representative examples, rationale, exclusions, and a residual-risk statement.

**Reflection:** Which selected example would be least defensible if its risk or technique rationale were removed? Which assumption about equivalence, state, or timing would you validate next?

**Portfolio relevance:** This artifact demonstrates explainable test-design judgement and evidence selection. Keep all examples fictional or safely anonymised; do not publish employer policy rules, customer data, system identifiers, or confidential incident details.

## Further Reading

- [IEEE Computer Society, *Guide to the Software Engineering Body of Knowledge (SWEBOK Guide) v4.0a*](https://ieeecs-media.computer.org/media/education/swebok/swebok-v4.pdf) — consult the Software Testing knowledge area for broader testing-design context.
- [NIST Automated Combinatorial Testing for Software](https://csrc.nist.gov/projects/automated-combinatorial-testing-for-software) — practical background on modeling interaction coverage and its limits.
- [Chapter 2 — Risk-Informed Test Strategy](chapter-02-risk-informed-test-strategy.md)
- [Chapter 3 — Requirements Analysis, Specifications, and Testability](chapter-03-requirements-analysis-specifications-and-testability.md)
- [Chapter 5 — Exploratory Testing and Adaptive Investigation](chapter-05-exploratory-testing-and-adaptive-investigation.md)

## References

[^iso-29119-4]: International Organization for Standardization. [ISO/IEC/IEEE 29119-4:2021 — Software and systems engineering — Software testing — Part 4: Test techniques](https://www.iso.org/standard/79430.html). 2021.
[^istqb-ctfl]: International Software Testing Qualifications Board. [Certified Tester Foundation Level Syllabus v4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf). Accessed 2026-08-09.
[^nist-combinatorial]: Kuhn, D. R., Kacker, R. N., and Lei, Y. [*Practical Combinatorial Testing*](https://doi.org/10.6028/NIST.SP.800-142). NIST Special Publication 800-142, 2010.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain why a selected test is relevant to a condition, risk, or decision.
- [ ] Select partitions, boundaries, rules, transitions, or interactions with stated assumptions.
- [ ] Combine techniques when one model cannot reveal every important distinction.
- [ ] Identify redundant examples without confusing a small suite with sufficient evidence.
- [ ] Communicate the evidence limits and residual uncertainty of a test design.
