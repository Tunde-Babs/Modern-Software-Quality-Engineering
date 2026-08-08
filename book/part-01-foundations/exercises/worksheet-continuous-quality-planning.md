# Continuous Quality Planning Worksheet

## Metadata

| Field | Value |
|---|---|
| Worksheet title | Continuous Quality Planning Worksheet |
| Related chapters | Chapters 4 and 5 |
| Part | Part I — Foundations of Modern Software Quality Engineering |
| MQE-BOK domain | Domain 1 — Foundations of Modern Software Quality Engineering |
| Difficulty | Foundation |
| Estimated time | 35–50 minutes |
| Version | 0.1.0 |
| Status | Draft |

## Purpose

Plan quality activities and evidence across a meaningful change, from discovery through learning. The worksheet deliberately connects two distinct Chapter 4 and Chapter 5 questions:

- **Chapter 4:** Where does Quality Engineering happen across the lifecycle?
- **Chapter 5:** When is evidence obtained, and how does feedback change a future decision?

## QE Capability Developed

Lifecycle-wide quality planning, evidence timing, safe-change reasoning, and feedback-loop design.

## Prerequisites

- Read Chapters 4 and 5.
- Review the [Quality Throughout the Software Development Lifecycle diagram](../../../diagrams/chapter-04-quality-throughout-sdlc.md) and the [Continuous Quality Loop diagram](../../../diagrams/chapter-05-continuous-quality-loop.md).
- Choose a current, historical, hypothetical, or open-source change with customer impact.

## Instructions

### 1. Establish the change context

| Prompt | Your response |
|---|---|
| Change or customer outcome |  |
| Primary users or affected stakeholders |  |
| Most harmful plausible failure |  |
| Key dependency or operational constraint |  |
| Decision this plan must support |  |

### 2. Map quality work across the lifecycle

Complete the table for the level of risk in your chosen change. “Not applicable” is acceptable only after considering the stage and recording why.

| Lifecycle activity | Quality question or risk | What should happen earlier? | Evidence or control | Owner or collaborator | Decision informed |
|---|---|---|---|---|---|
| Discovery |  |  |  |  |  |
| Requirements |  |  |  |  |  |
| Design |  |  |  |  |  |
| Development |  |  |  |  |  |
| Verification |  |  |  |  |  |
| Deployment |  |  |  |  |  |
| Production |  |  |  |  |  |
| Learning |  |  |  |  |  |

### 3. Separate early prevention from later learning

Some risk is best reduced before implementation. Some uncertainty can only be evaluated after deployment under real conditions. Record the distinction.

| Concern | Prevent or clarify earlier | Verify before release | Learn responsibly after release | Safeguard or response path |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### 4. Design the feedback loop

A loop is complete only when evidence changes a future decision.

| Evidence from delivery or production | Interpretation or question | Future decision to revisit | Improvement action | Review point and owner |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### 5. Identify evidence limits

| Evidence source | What it can establish | What it cannot establish alone | Complementary evidence needed |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |

## Expected Outputs

- lifecycle quality map;
- early-prevention and later-learning decisions;
- evidence plan with owners and decision points;
- feedback-loop design; and
- stated evidence limitations.

## Portfolio Relevance

**Portfolio Candidate:** A completed plan can show lifecycle and systems reasoning when it describes a non-confidential system. Remove organisation names, customer data, deployment details, credentials, and operational thresholds before sharing it publicly.

## Reflection Questions

1. Which risk would become more expensive or harmful if it were discovered only after release?
2. Which question cannot be answered credibly until the system encounters production users, data, dependencies, or workload?
3. Does your production evidence represent a customer outcome or only technical activity?
4. What specific requirement, design, or delivery decision will change when the feedback arrives?

## Completion Criteria

- [ ] All eight lifecycle activities are considered.
- [ ] Early prevention is distinguished from pre-release verification and production learning.
- [ ] Every major evidence item informs a named decision.
- [ ] At least one feedback item changes a future engineering decision.

