# Software Quality Profile Worksheet

## Metadata

| Field | Value |
|---|---|
| Worksheet title | Software Quality Profile Worksheet |
| Related chapter | Chapter 3 — Understanding Software Quality |
| Part | Part I — Foundations of Modern Software Quality Engineering |
| MQE-BOK domain | Domain 1 — Foundations of Modern Software Quality Engineering |
| Difficulty | Foundation |
| Estimated time | 30–45 minutes |
| Version | 0.1.0 |
| Status | Draft |

## Purpose

Turn a feature or service description into a context-specific quality profile before a team selects tests, metrics, or release criteria. The worksheet supports quality prioritisation and visible trade-offs rather than a universal scorecard.

## QE Capability Developed

Quality-attribute reasoning, risk prioritisation, measurable requirement design, and evidence planning.

## Prerequisites

- Read Chapter 3 and review the [Software Quality Perspectives diagram](../../../diagrams/chapter-03-software-quality-perspectives.md).
- Choose a familiar feature, service, or fictional scenario.

## Important Boundary

ISO/IEC 25010:2023 provides formal product-quality characteristics. This worksheet uses the characteristic names already introduced in Chapter 3: functional suitability, performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, and safety. Engineering capabilities such as observability, testability, deployability, and diagnosability are separate enabling capabilities; they are not additional ISO product-quality characteristics.

## Instructions

### 1. Establish product context

| Prompt | Your response |
|---|---|
| Product or feature |  |
| Primary users |  |
| Critical workflow |  |
| Intended business or operational outcome |  |
| Unacceptable failure |  |
| Relevant constraints: regulation, data sensitivity, availability, cost, or time |  |

### 2. Select and prioritise product-quality characteristics

Choose three to five characteristics that materially affect the outcome. Do not select every characteristic by default.

| Formal product-quality characteristic | Why it matters here | Priority rationale | Trade-off or tension to examine | Acceptance boundary |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### 3. Identify enabling engineering capabilities

Record the capabilities that help the team design, evaluate, deliver, or operate the selected qualities.

| Enabling engineering capability | Why it is needed | Evidence or control it enables | Owner or collaborator |
|---|---|---|---|
| Testability |  |  |  |
| Observability |  |  |  |
| Deployability or recoverability |  |  |  |

### 4. Define measurable indicators and evidence

| Priority quality concern | Requirement, indicator, or decision question | Evidence source | When evidence is used | Action if evidence is unsatisfactory |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### 5. Review the profile

Review the completed profile with a product, engineering, design, operations, security, data, or support colleague. Record the discussion.

| Review question | Finding or decision |
|---|---|
| Which user outcome or failure is missing? |  |
| Which priority is assumed rather than evidenced? |  |
| Which proposed indicator could mislead? |  |
| What should be observed after release? |  |

## Expected Outputs

- product context and critical workflow;
- prioritised product-quality characteristics;
- enabling engineering capabilities;
- measurable indicators and evidence sources; and
- explicit acceptance boundaries and trade-offs.

## Portfolio Relevance

**Portfolio Candidate:** A completed profile can demonstrate quality-strategy and risk-reasoning capability when it is based on a fictional, open-source, or safely anonymised system. Do not publish confidential thresholds, customer information, internal architecture, or employer-specific decisions.

## Reflection Questions

1. Which quality characteristic is most important to the customer outcome, and why?
2. Which trade-off would be harmful if it remained implicit?
3. What can observability or testability enable without becoming an ISO product-quality characteristic?
4. Which evidence source is strongest for a future decision, and what is its limitation?

## Completion Criteria

- [ ] Three to five product-quality characteristics are selected with contextual reasons.
- [ ] Engineering capabilities are clearly separated from formal product-quality characteristics.
- [ ] Each priority has an evidence source and an action boundary.
- [ ] A reviewer or simulated reviewer has challenged one assumption.

