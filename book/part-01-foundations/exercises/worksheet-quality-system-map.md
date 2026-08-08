# Quality System Map Worksheet

## Metadata

| Field | Value |
|---|---|
| Worksheet title | Quality System Map Worksheet |
| Related chapter | Chapter 6 — Systems Thinking for Quality Engineers |
| Part | Part I — Foundations of Modern Software Quality Engineering |
| MQE-BOK domain | Domain 1 — Foundations of Modern Software Quality Engineering |
| Difficulty | Foundation |
| Estimated time | 40–60 minutes |
| Version | 0.1.0 |
| Status | Draft |

## Purpose

Guide a learner through a system-level quality analysis for any software system. The worksheet turns the [Quality System Map](../../../diagrams/chapter-06-quality-system-map.md) MSQE Educational Model into a reviewable, evidence-based artefact.

## QE Capability Developed

Systems thinking, boundary definition, dependency analysis, failure-propagation reasoning, and evidence selection.

## Prerequisites

- Read Chapter 6 and review the Quality System Map diagram.
- Choose a customer-critical flow, such as account recovery, checkout, appointment booking, data import, employee onboarding, or an internal approval workflow.

## Important Boundary

The Quality System Map is an original MSQE Educational Model. It is a discussion lens, not a complete architecture diagram, a formal notation, or a fixed sequence of components.

## Instructions

### 1. Define the outcome and boundary

| Prompt | Your response |
|---|---|
| User outcome |  |
| User or stakeholder affected |  |
| Unacceptable failure |  |
| Initial system boundary |  |
| Deliberately excluded element and reason |  |

### 2. Build the Quality System Map

Use “not applicable” only after considering the layer.

| Map layer | Element, interaction, or condition | Quality risk or assumption | Evidence source or control | Owner or collaborator |
|---|---|---|---|---|
| Users |  |  |  |  |
| Interfaces |  |  |  |  |
| Services |  |  |  |  |
| Data |  |  |  |  |
| Infrastructure |  |  |  |  |
| Dependencies |  |  |  |  |
| Operations |  |  |  |  |
| Feedback |  |  |  |  |

### 3. Trace failure propagation

Choose one dependency, shared resource, or condition that could fail.

| Failure trigger | First affected element | Propagation path | Customer impact | Detection point | Containment, recovery, or escalation action |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

### 4. Identify quality risks and evidence sources

| Quality risk | Preventive design or process control | Pre-release evidence | Production evidence | Residual uncertainty |
|---|---|---|---|---|
|  |  |  |  |  |
|  |  |  |  |  |
|  |  |  |  |  |

### 5. Check for local optimisation

| Local measure or healthy-looking result | Why it could hide a system problem | Better customer-outcome question or evidence |
|---|---|---|
|  |  |  |

## Expected Outputs

- completed Quality System Map;
- defined system boundary and exclusions;
- one failure-propagation path;
- risk and evidence plan; and
- one improvement to avoid local optimisation.

## Portfolio Relevance

**Portfolio Candidate:** A completed map can demonstrate systems thinking and quality strategy. Use a fictional, open-source, or anonymised system, and do not publish customer data, proprietary architecture, supplier details, operational controls, or confidential incidents.

## Reflection Questions

1. Which interaction would a component-only test approach be most likely to miss?
2. Where does a dependency alter customer impact without appearing in the feature's code?
3. Which failure is detected too late, and what evidence could reduce that delay?
4. Which feedback source should change a future design or test decision?

## Completion Criteria

- [ ] All eight map layers are considered.
- [ ] At least one boundary and exclusion are explicit.
- [ ] One failure-propagation path connects a technical condition to customer impact.
- [ ] Risks include both preventive controls and evidence sources.
- [ ] The final map identifies a future decision that feedback should influence.

