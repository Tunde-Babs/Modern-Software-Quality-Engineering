# Case Study 2: Shared Ownership and Engineering Culture

| Metadata | Detail |
|---|---|
| **Part** | Part I — Foundations of Modern Software Quality Engineering |
| **Related chapters** | [Chapter 4: Quality Throughout the SDLC](../chapters/chapter-04-quality-throughout-the-sdlc.md), [Chapter 5: Shift Left, Shift Right, Shift Everywhere](../chapters/chapter-05-shift-left-shift-right-shift-everywhere.md), [Chapter 6: Systems Thinking for Quality Engineers](../chapters/chapter-06-systems-thinking-for-quality-engineers.md), and [Chapter 7: Engineering Culture and DevOps Mindset](../chapters/chapter-07-engineering-culture-and-devops-mindset.md) |
| **MQE-BOK domain** | Domain 1 — Foundations |
| **Industry** | Digital claims processing |
| **Difficulty** | Foundation to intermediate |
| **Estimated time** | 60–90 minutes |
| **Status** | Draft |

## Purpose

Examine how unclear decision rights, weak feedback loops, and local incentives can turn a production incident into a blame cycle. The aim is not to declare that “everyone owns quality,” but to define specific contributions, accountabilities, and improvement actions across a delivery system.

## Quality Engineering Capability Developed

You will practise using systems thinking and culture evidence to create an actionable Quality Improvement Action Plan after an incident.

## Overview

The following is an **illustrative scenario**. No organisation, system, or incident in this case is real.

Meridian Claims allows policyholders to upload supporting documents for a claim. After a release, some documents remain in a “processing” state for hours. The first incident review becomes an argument: development says the release passed QA; QA says a production configuration change was outside the test scope; operations says the service-health alert did not fire; product says the release date could not move. Each statement contains some truth, but none establishes what the system needs next.

## Background

The product team introduced a new document-classification provider to reduce manual review time. The workflow accepts a file, stores it, publishes a classification request, invokes the provider through an integration service, and returns the resulting status to the claims application.

The release passed its planned checks. Two days later, a provider configuration update changes a callback route. Requests remain accepted, but asynchronous callbacks are rejected. The user interface continues to display “processing”; a support analyst notices a pattern only after several customers contact the help desk.

The immediate incident is restored by correcting the configuration. The harder problem is that the organisation has no shared, explicit answer to several questions: who defines quality risks for an asynchronous workflow, who owns a production signal for stalled claims, who can accept release risk, and how customer evidence changes the next design decision.

## System Context

| Boundary | Participants and components | Decision or feedback concern |
|---|---|---|
| Product discovery | Product manager, claims specialist, delivery team | Customer impact, policy constraints, and acceptable delay |
| Build and test | Developers, Quality Engineer, automated checks, test environment | Interface behaviour, failure states, and test-data coverage |
| Delivery | Delivery pipeline, feature configuration, release approver | Change traceability, rollout criteria, and risk acceptance |
| Operations | Platform team, dashboards, alerts, incident responders | Detection, diagnosis, recovery, and escalation |
| External dependency | Document-classification provider and callback configuration | Contract changes, error behaviour, and dependency communication |
| Customer support | Support analysts and claimants | Visible symptoms, case identifiers, and feedback into prioritization |

The service-health alert only checks whether the integration service is running. It does not measure callback failures, age of the oldest pending document, or the time a customer spends in the “processing” state.

> **[Supporting asset: use the Quality Culture Flywheel diagram to consider how learning from the incident can change behaviours and feedback loops.](../../../diagrams/chapter-07-quality-culture-flywheel.md)**

## Available Evidence

- The release pipeline completed successfully and recorded no failed automated checks.
- The classification-provider contract was tested for the original callback route, but the route was held in separately managed configuration.
- A deployment review verified the feature configuration but did not include the provider callback configuration.
- The quality strategy assigned QA responsibility for end-to-end acceptance testing; it did not name an owner for operational readiness or dependency monitoring.
- The platform dashboard contains CPU, memory, and service-availability measures, but no customer-journey or backlog-age signal.
- Support tickets describe the customer symptom but do not contain the correlation identifier used by the integration service.
- Team performance discussions focus on completing committed work and reducing escaped defects. They do not review time-to-detect stalled claims or evidence learned from incidents.

## Constraints

- The provider is a strategic external dependency and cannot be replaced in the current quarter.
- A regulatory commitment limits the time a claim may remain unprocessed, but the exact target varies by claim type.
- No additional headcount is available for a dedicated operations role.
- The team must retain an auditable record of production changes and risk-acceptance decisions.
- The next release includes a customer-visible improvement and is already in planning.

## Problem Statement

Meridian Claims has restored service, but its current response treats the incident as a hand-off failure between roles. The team needs an improvement plan that makes quality work explicit across discovery, delivery, operations, and learning—without collapsing accountability into a vague shared-ownership statement.

## Engineering Challenges

1. **Clarify contributions and accountabilities.** Separate the work that different roles contribute from the decisions that require a named owner.
2. **Make the system boundary visible.** Include the external provider, configuration, support, customer journey, and operational telemetry—not only application code.
3. **Design useful feedback.** Replace availability-only signals with evidence that reveals stalled customer outcomes early enough to act.
4. **Address incentives and learning.** Turn the incident into a repeatable improvement loop rather than a retrospective assignment of fault.

## Questions and Tasks

### 1. Analyse the Incident as a System

Create a simple map from the provider configuration change to customer impact. Include the technical flow, the production signals that were absent or insufficient, and the organisational hand-offs that delayed detection or response.

Use the [Quality System Map worksheet](../exercises/worksheet-quality-system-map.md) if useful.

### 2. Define Explicit Ownership

For each decision below, identify a proposed accountable role and the roles that must contribute evidence or expertise. Adapt the roles to your context; the aim is clarity, not a universal organisational chart.

- Defining acceptable customer delay and release risk.
- Establishing and testing the provider interaction contract.
- Verifying production configuration as part of release readiness.
- Monitoring stalled customer journeys and responding to a threshold breach.
- Recording incident learning and ensuring that a change is followed through.

Explain why “everyone owns quality” is incomplete unless these decision rights and actions are visible.

### 3. Assess the Feedback and Culture Signals

Assess the scenario using the following questions:

- Which behaviours are currently rewarded or measured?
- What information arrives too late, or does not return to the team that can act on it?
- Where does the team rely on a hand-off instead of a feedback loop?
- What would a blameless incident review examine that the current discussion ignores?

Use the [Quality Culture Assessment worksheet](../exercises/worksheet-quality-culture-assessment.md) to structure the assessment.

### 4. Design Production Evidence

Define three production signals that would help reveal a stalled claim before customers report it. For every signal, state:

- the customer or system outcome it represents;
- a threshold or trend that deserves action;
- the first responder and escalation route; and
- the decision or improvement it should inform.

An **error budget** is the amount of unreliability a service may consume while still meeting an agreed service objective. If your team uses error budgets, explain whether stalled-claim duration or callback failure could contribute to one. Do not introduce an error budget merely as a dashboard number: it must be tied to an explicit service objective and a decision.

### 5. Produce a Quality Improvement Action Plan

Create a plan with no more than three actions for the next 90 days. Each action must include:

| Field | Required content |
|---|---|
| Improvement | The concrete change to make |
| Quality risk addressed | The customer or system consequence it reduces |
| Accountable owner | The role accountable for completion and outcome |
| Contributors | Roles supplying expertise, implementation, or evidence |
| Evidence of completion | The observable proof that the action is working |
| Review point | When the team will inspect the result and adapt |

Use the [Continuous Quality Planning worksheet](../exercises/worksheet-continuous-quality-planning.md) to connect actions to the lifecycle.

## Expected Learner Outputs

- A system-and-feedback map of the incident.
- An explicit ownership and contribution model for key decisions.
- A culture and incentive assessment.
- Three operational signals tied to customer outcomes.
- A 90-day Quality Improvement Action Plan with evidence and review points.

## Illustrative Outcome

There is no single correct role model. One sound outcome makes the product manager accountable for customer-impact and risk-acceptance decisions; gives the delivery team explicit responsibility for the interface and configuration evidence needed for readiness; gives the platform or operations function clear responsibility for actionable production telemetry and response paths; and includes support evidence in the delivery team’s regular quality review.

The resulting plan might add callback-contract verification to the release evidence, monitor the age of pending claims with an escalation path, and review incident learning against the next planning cycle. The important change is not a new meeting or slogan. It is that quality decisions, evidence, and follow-through become visible.

## Facilitator Guidance

A strong response:

- avoids assigning all responsibility to QA, development, operations, or product;
- names accountabilities without denying the need for collaboration;
- treats provider configuration and customer support as parts of the quality system;
- selects signals that represent customer outcomes rather than infrastructure activity alone; and
- limits the action plan to improvements that can be evidenced and reviewed.

## Reflection Questions

1. Which production-quality decision in your team has no clear accountable owner?
2. What customer outcome could be delayed while all your current service-health checks remain green?
3. Which team incentive might unintentionally encourage a hand-off instead of learning?

## Key Learning Points

- Shared ownership requires explicit decision rights, contributions, and evidence; it is not an absence of accountability.
- Production incidents are often system failures involving technical, organisational, and feedback boundaries.
- Operational signals should represent customer-relevant outcomes and have a defined response path.
- A healthy quality culture learns from incidents and changes the conditions that made the incident possible.

## Portfolio Relevance

This case supports a portfolio artifact such as a sanitized incident learning brief or Quality Improvement Action Plan. It demonstrates that you can connect quality strategy, production evidence, and team collaboration without reducing the work to blame assignment.

## Related Practical Assets

- [Worksheet: Quality System Map](../exercises/worksheet-quality-system-map.md)
- [Worksheet: Quality Culture Assessment](../exercises/worksheet-quality-culture-assessment.md)
- [Worksheet: Continuous Quality Planning](../exercises/worksheet-continuous-quality-planning.md)
- [Case Study 1: Quality Beyond Test Execution](case-study-01-quality-beyond-test-execution.md)

## Further Reading

- [Chapter 6: Systems Thinking for Quality Engineers](../chapters/chapter-06-systems-thinking-for-quality-engineers.md) for boundaries, interactions, and feedback loops.
- [Chapter 7: Engineering Culture and DevOps Mindset](../chapters/chapter-07-engineering-culture-and-devops-mindset.md) for quality culture and shared ownership.

## Case Study Review Checklist

- [ ] I considered the technical system and the organisational system together.
- [ ] I assigned explicit accountability for decisions while retaining collaborative contributions.
- [ ] I chose production signals connected to customer outcomes and response paths.
- [ ] I produced a small, evidence-based action plan with review points.
- [ ] I described learning actions rather than a blame-based response.
