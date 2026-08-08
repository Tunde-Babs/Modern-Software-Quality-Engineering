# Lab 1 — From Testing a Feature to Engineering Quality

## Metadata

| Field | Value |
|---|---|
| Lab | 1 |
| Part | Part I — Foundations of Modern Software Quality Engineering |
| Related chapters | Chapters 1, 3, 4, 5, and 6 |
| MQE-BOK domain | Domain 1 — Foundations of Modern Software Quality Engineering |
| Difficulty | Foundation |
| Estimated completion time | 60–90 minutes |
| Version | 0.1.0 |
| Status | Draft |

## Purpose

Practise the central MSQE transition from testing a completed feature to engineering quality across its design, delivery, operation, and improvement. The lab uses a realistic feature scenario without requiring a specific tool, cloud provider, or programming language.

## QE Capability Developed

The learner practises risk-based quality strategy, quality-attribute reasoning, systems thinking, evidence planning, and production-oriented feedback design. These capabilities extend an experienced QA Engineer's testing strengths into a Quality Engineering contribution.

## Expected Skills

- turn a customer objective into risks, quality requirements, and evidence questions;
- communicate uncertainty and trade-offs across product, engineering, and operations; and
- produce a concise quality strategy rather than a list of test cases alone.

## Learning Objectives

After completing this lab, you should be able to:

- describe a customer outcome, system boundary, and unacceptable failure;
- distinguish risks to prevent through design from behaviour to verify through testing;
- select relevant quality characteristics and supporting engineering capabilities;
- define a proportionate verification, CI/CD, and production-evidence plan; and
- recommend feedback that improves a future engineering decision.

## Prerequisites

- Read Chapters 1, 3, 4, 5, and 6.
- Review the [MSQE Quality System Model](../../../diagrams/chapter-01-quality-engineering-model.md), [Continuous Quality Loop](../../../diagrams/chapter-05-continuous-quality-loop.md), and [Quality System Map](../../../diagrams/chapter-06-quality-system-map.md).
- No software installation or vendor-specific tooling is required.

## Environment Setup

Use a document editor, the tables in this lab, or the companion worksheets. The scenario is fictional, so no production access, credentials, test account, programming environment, or vendor tool is required.

## Scenario

The following is an illustrative scenario.

Northstar Accounts is adding account recovery to a customer portal. A customer who cannot sign in enters a verified email address, receives a recovery link, completes an identity-verification step, and chooses a new password. The product team wants recovery to feel quick and simple. The initial quality request is: “Test the happy path, invalid links, and password rules before release.”

The service depends on an identity provider, an email-delivery provider, an account database, configuration for recovery-link lifetime, and production monitoring. A recovery failure can lock out a legitimate customer. A weak or misrouted recovery flow can enable account takeover. The team needs a quality approach that is proportionate to both harms.

## Problem Statement

The initial request for functional checks does not make the recovery outcome, quality risks, design controls, delivery evidence, production signals, or improvement feedback explicit. Produce a concise Quality Engineering Strategy Pack that makes those decisions visible.

## Instructions

Complete the tasks in sequence. Use concise, context-specific reasoning rather than attempting exhaustive documentation. Where a decision is uncertain, record the assumption, the evidence needed, and the person or group who should help decide it.

## Tasks

### Task 1 — Understand the outcome and system boundary

Write a short outcome statement in this form:

> A _user type_ can _recover account access_ within _relevant security, time, and support constraints_.

Record what is inside the initial boundary and one important element deliberately outside it. State at least two unacceptable outcomes.

### Task 2 — Create a Quality Risk Map

Identify functional and non-functional risks. Do not treat every concern as equally important.

| Risk or failure mode | Customer or business impact | Likelihood or uncertainty | Existing control or assumption | Priority and rationale |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

Consider repeated requests, expired or replayed links, identity-provider failure, email delay, configuration errors, accessibility barriers, support recovery, and unusual traffic. Add only risks that matter in this context.

### Task 3 — Produce a Quality Attribute Profile

Select three to five relevant ISO/IEC 25010:2023 product-quality characteristics and state why they matter. Keep **product-quality characteristics** separate from supporting engineering capabilities such as testability and observability.

| Product-quality characteristic | Why it matters for recovery | Trade-off or constraint | Observable requirement or boundary |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

Then record the engineering capabilities that will help the team create and evaluate evidence.

| Engineering capability | Why it is needed | Example evidence it enables |
|---|---|---|
| Testability |  |  |
| Observability |  |  |
| Diagnosability or recoverability |  |  |

### Task 4 — Map the system and dependencies

Use the [Quality System Map Worksheet](../exercises/worksheet-quality-system-map.md) or create a concise map in this lab. Identify the users, interfaces, services, data, infrastructure, dependencies, operations, and feedback sources that shape the recovery outcome.

For one dependency, trace a failure path from trigger to customer impact. State one control that prevents or limits propagation.

### Task 5 — Decide what to prevent through design

For each high-priority risk, decide which condition should be designed out or contained before testing. Examples may include a single-use recovery token, an explicit expiry policy, rate limiting, a safe failure message, an auditable recovery event, or a support escalation path. These are examples to assess, not a universal design prescription.

| High-priority risk | Design decision or control | Assumption or trade-off | Design evidence needed |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |

### Task 6 — Define a Verification Strategy

Identify the evidence needed to evaluate the remaining risks. A test result is useful only when it answers a decision question.

| Question or risk | Verification approach | Why this level of evidence is useful | Limitation to state |
|---|---|---|---|
|  | Unit, integration, contract, workflow, exploratory, security, accessibility, or review |  |  |
|  |  |  |  |

### Task 7 — Decide what to automate

Select only checks that benefit from repeatability, speed, or controlled setup. State the ownership and diagnostic information needed to keep the automation trustworthy.

| Candidate check | Automate now, later, or not at all | Reason | Failure information required |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |

### Task 8 — Create a CI/CD Evidence Plan

Identify the evidence that should be available before or during deployment. Do not treat a green pipeline as proof that every risk is controlled.

| Delivery point | Evidence or control | Decision informed | Owner or collaborator |
|---|---|---|---|
| Build and review |  |  |  |
| Verification |  |  |  |
| Deployment |  |  |  |

### Task 9 — Create a Production Signal Plan

Define the small set of signals that would reveal whether customers are completing recovery safely and successfully.

| Signal or evidence source | Customer outcome or risk represented | Threshold, question, or trend to watch | Intended response |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

### Task 10 — Define the feedback and improvement loop

For each meaningful production finding, state which future decision it should inform. This completes the shift from a testing-only mindset to an engineering-quality mindset.

| Finding or feedback | Future requirement, design, verification, or operational decision to revisit | Improvement recommendation | Review owner |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |

## Expected Outputs

Complete a concise **Quality Engineering Strategy Pack** containing:

- Quality Risk Map;
- Quality Attribute Profile;
- Quality System Map or dependency boundary;
- Verification Strategy;
- CI/CD Evidence Plan;
- Production Signal Plan; and
- Improvement Recommendations.

## Expected Outcome

You will have a proportionate, reviewable strategy that connects customer outcome, risk, design, verification, delivery, production evidence, and continuous improvement. The result demonstrates a Quality Engineering mindset rather than a test-case inventory.

## Validation

Review your work against these questions:

- Does every significant recommendation connect to a customer outcome, risk, or decision?
- Have you distinguished product-quality characteristics from engineering capabilities?
- Have you stated what testing can establish and what it cannot establish alone?
- Does at least one production signal represent customer impact rather than only technical activity?
- Does each feedback item name a future decision that will change?

## Stretch Goals

Choose one high-consequence condition, such as an unavailable identity provider or suspected recovery-link replay. Extend the strategy pack with a controlled-response plan that states the customer-safe behaviour, evidence required before wider exposure, production signal, escalation owner, and recovery review.

## Troubleshooting

- If the analysis becomes a list of every possible risk, return to the customer outcome and prioritise by harm, uncertainty, and reversibility.
- If a proposed test is the only control for a high-consequence failure, ask which requirement, design, configuration, or operational control should prevent or contain the failure first.
- If a production signal measures only technical activity, restate the customer outcome and identify the observable behaviour that represents it.

## Portfolio Relevance

**Portfolio Candidate:** Refine the strategy pack for a fictional, open-source, or non-confidential system. Remove employer names, customer data, credentials, internal architecture details, and sensitive operational thresholds. In a portfolio, explain the risk, the decisions made, the evidence proposed, and the limitations of the analysis.

## Reflection Questions

1. Which initial testing request was too narrow for the risks in this scenario?
2. Which risk was best addressed through design rather than another test case?
3. Which evidence must be collected in production, and why cannot a pre-production environment establish it fully?
4. Which automation choice creates the most useful feedback for its maintenance cost?
5. How did the analysis change your understanding of a Quality Engineer's contribution?

## Completion Criteria

- [ ] The six required strategy-pack artefacts are complete.
- [ ] Risks are prioritised with explicit reasoning.
- [ ] Design prevention, verification, automation, CI/CD evidence, and production signals are distinguished.
- [ ] At least one dependency and one feedback loop are analysed.
- [ ] Reflection questions are answered using evidence from the lab.

## Cleanup

Keep only the completed fictional strategy pack or an appropriately anonymised version. Do not copy employer-specific customer data, credentials, configurations, operational thresholds, or incident details into a learning or portfolio artefact.

## Next Steps

Use the [Software Quality Profile Worksheet](../exercises/worksheet-software-quality-profile.md), [Continuous Quality Planning Worksheet](../exercises/worksheet-continuous-quality-planning.md), and [Quality System Map Worksheet](../exercises/worksheet-quality-system-map.md) to deepen individual parts of the strategy pack.
