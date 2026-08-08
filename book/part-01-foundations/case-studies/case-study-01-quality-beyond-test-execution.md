# Case Study 1: Quality Beyond Test Execution

| Metadata | Detail |
|---|---|
| **Part** | Part I — Foundations of Modern Software Quality Engineering |
| **Related chapters** | [Chapter 1: What Is Modern Software Quality Engineering?](../chapters/chapter-01-what-is-modern-software-quality-engineering.md), [Chapter 3: Understanding Software Quality](../chapters/chapter-03-understanding-software-quality.md), [Chapter 4: Quality Throughout the SDLC](../chapters/chapter-04-quality-throughout-the-sdlc.md), [Chapter 5: Shift Left, Shift Right, Shift Everywhere](../chapters/chapter-05-shift-left-shift-right-shift-everywhere.md), and [Chapter 6: Systems Thinking for Quality Engineers](../chapters/chapter-06-systems-thinking-for-quality-engineers.md) |
| **MQE-BOK domain** | Domain 1 — Foundations |
| **Industry** | B2B software as a service |
| **Difficulty** | Foundation to intermediate |
| **Estimated time** | 60–90 minutes |
| **Status** | Draft |

## Purpose

Apply the MSQE view that automated test execution is necessary evidence, but not sufficient evidence of fitness for use. This case connects a passing delivery pipeline to the wider product, operational, and socio-technical system in which customers experience quality.

## Quality Engineering Capability Developed

You will practise defining evidence boundaries, distinguishing product quality characteristics from engineering capabilities, and planning preventive, delivery-time, and production feedback interventions.

## Overview

The following is an **illustrative scenario**. No organisation, system, or incident in this case is real.

Harbour Desk is a B2B SaaS product used by finance teams to reconcile invoices and export monthly reports. A release has passed its automated UI, API, and regression suites. Within days of a controlled production rollout, several customers receive duplicate export notifications, and one customer discovers that a report was generated from stale account data. The team must decide whether its green test results are enough to continue rollout and what quality evidence is missing.

## Background

Harbour Desk releases a new report-export workflow. Customers request a report in the web interface; the workflow publishes an event, a reporting service reads account data, a worker creates a file, and a notification service sends the download link. The release adds a retry mechanism for failed export requests and moves one event subscription to environment-specific configuration.

The delivery team is proud of its test results:

- Unit tests cover the retry branch in the export service.
- API tests verify a successful export request and a successful download.
- UI tests verify that a user can request and download a report.
- A regression suite passes in the deployment pipeline.
- A manual exploratory session found no obvious usability problems.

The team treats this evidence as a release decision, not merely as one input to a release decision.

## System Context

The export workflow crosses several technical and organisational boundaries:

| Element | Role in the workflow | Quality concern |
|---|---|---|
| Customer web application | Submits export requests and displays status | Clear status, accessibility, and correct customer feedback |
| Export API | Accepts requests and publishes an export event | Input validation, authorization, and idempotency |
| Event broker | Delivers export events to downstream consumers | Duplicate delivery and delayed delivery are possible |
| Reporting service | Reads account data and generates reports | Data freshness, completeness, and response time |
| Notification service | Delivers report links | Duplicate notifications and link security |
| Configuration service | Supplies environment-specific event subscriptions | Correct binding and change traceability |
| Support and operations teams | Observe customer impact and respond | Useful signals, diagnostic access, and explicit escalation paths |

An **idempotent** operation can be performed more than once without changing the intended result after the first successful execution. The release team assumes the retry logic is idempotent because its unit test passes, but the test uses a local mock rather than the real event-delivery behaviour.

> **[Supporting asset: use the Quality System Map diagram and worksheet to map this workflow, its dependencies, and its feedback loops.](../../../diagrams/chapter-06-quality-system-map.md)**

## Available Evidence

The team has the following information before broadening the rollout:

- The deployment pipeline is green, including the UI, API, and regression suites.
- The new retry branch is covered by a unit test that simulates a timeout before the event is sent.
- Contract tests exist for the Export API, but not for the event consumed by the notification service.
- Staging uses a single worker and an in-memory event broker; production uses multiple workers and a managed broker that can deliver an event more than once.
- Production dashboards show request volume and HTTP error rates, but do not show duplicate exports, report age, queue delay, or notification count per export request.
- A feature flag can limit the rollout to selected customers, but it cannot reverse a notification already sent.
- Support has recorded two customer tickets with screenshots, but the tickets do not include a request identifier that engineering can trace through the workflow.

## Constraints

- A strategic customer is waiting for the feature before month-end reporting.
- The account-data source is maintained by another team and refreshes asynchronously.
- The team has two days before the next planned rollout decision.
- The team may pause or limit the feature flag, but may not make unreviewed production changes.
- Historical export records contain customer data and cannot be copied into an unrestricted test environment.

## Problem Statement

During the limited rollout, a transient broker delay causes selected messages to be delivered more than once. The export worker generates more than one file for the same request, and the notification service sends more than one email. Separately, the new environment configuration binds one reporting consumer to a stale-data topic. No pipeline check, release signal, or dashboard makes either condition visible before customers report it.

The question is not whether the automated tests were valuable. They were. The question is which important quality claims they did and did not support.

## Engineering Challenges

1. **Define the evidence boundary.** Identify what the current suite demonstrates and which customer, integration, data, configuration, and operational claims remain unproven.
2. **Use precise quality language.** Separate the current ISO/IEC 25010:2023 product-quality characteristics—functional suitability, performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, and safety—from engineering capabilities such as observability, testability, and deployability.
3. **Reason across the system.** Trace how a production event, configuration change, dependency behaviour, and support signal combine to create customer impact.
4. **Close the feedback loop.** Plan evidence and controls before release, during delivery, and in production rather than proposing a larger end-of-pipeline regression suite as the only response.

## Questions and Tasks

### 1. Establish the Evidence Boundary

Create a two-column table:

- Claims that the existing tests reasonably support.
- Important claims that are not supported, partially supported, or only assumed.

For every claim in the second column, name the boundary that makes it uncertain: environment, dependency, configuration, data, scale, user workflow, or operation.

### 2. Classify the Quality Concerns

Classify at least eight concerns from the scenario. For each, state whether it is primarily:

- a product quality characteristic described by ISO/IEC 25010;
- an engineering capability that helps the team create, assess, or operate quality; or
- a risk that requires evidence from both categories.

Explain why **observability** and **testability** should not be presented as additional ISO/IEC 25010 product quality characteristics. They are engineering capabilities that make relevant quality properties easier to establish and sustain.

### 3. Map Failure Propagation

Create a small Quality System Map that starts with the broker delay or stale-data binding and ends with the customer outcome. Include:

- the technical components and configuration involved;
- the team or role that can influence each boundary;
- the evidence currently available at each point; and
- one feedback path from customer impact to a release or design decision.

Use the [Quality System Map worksheet](../exercises/worksheet-quality-system-map.md) if useful.

### 4. Plan Lifecycle Interventions

Propose one intervention in each of the following moments:

| Moment | Question to answer |
|---|---|
| Discovery and design | What acceptance criteria, risk question, or design decision would expose the issue earlier? |
| Build and integration | What focused automated, contract, configuration, or data check would provide stronger evidence? |
| Delivery and release | What rollout guardrail or release decision rule would contain the risk? |
| Production | What signal and response path would tell the team that the quality claim is no longer holding? |

Use the [Continuous Quality Planning worksheet](../exercises/worksheet-continuous-quality-planning.md) to record the evidence plan.

### 5. Define Production Signals

Choose three signals that would give timely, actionable evidence. For each, specify:

- the signal and the quality claim it represents;
- the threshold or change that deserves investigation;
- who is expected to respond; and
- the immediate decision the signal can inform.

Avoid metrics that merely report activity, such as the number of tests run. Prefer signals tied to customer outcomes, duplicate processing, data freshness, or system behaviour.

### 6. Recommend a Prioritized Improvement Plan

Recommend no more than three improvements for the next delivery cycle. For each, explain the risk addressed, expected evidence, accountable role or team, and how the improvement will be checked after implementation.

## Expected Learner Outputs

- An evidence-boundary table.
- A quality-concern classification that distinguishes formal product quality characteristics from engineering capabilities.
- A Quality System Map with a failure-propagation path.
- A lifecycle evidence plan and three production signals.
- A concise, prioritized improvement recommendation.

## Illustrative Outcome

There is no single correct implementation. A defensible outcome limits the rollout while the team introduces a durable request identifier and idempotency control at the export boundary, verifies the event contract and production-like broker behaviour, adds a data-freshness check, and creates a dashboard for duplicate processing and report age. The next release decision uses those signals alongside test results.

This outcome does not treat testing as a failure. It treats passing tests as evidence with a defined scope, then adds the evidence required for a distributed, operated service.

## Facilitator Guidance

A strong response:

- acknowledges the value of unit, API, UI, and exploratory testing without assigning them claims they cannot support;
- distinguishes a reliability or functional-suitability concern from the observability or testability capability that helps reveal it;
- includes configuration and dependency behaviour in the system boundary;
- proposes a small number of interventions distributed across the lifecycle; and
- makes an explicit release or operational decision, rather than recommending generic “more testing.”

## Reflection Questions

1. Which quality claim in your own product is currently inferred from a green pipeline rather than directly evidenced?
2. Where could a configuration, data, or dependency boundary invalidate a passing test result?
3. What production signal would most change the quality conversation for your team?

## Key Learning Points

- Testing is essential, but it is one form of quality evidence rather than a complete definition of quality.
- Product quality characteristics and engineering capabilities are related but should not be conflated.
- Quality risks often emerge at boundaries between services, data, configuration, teams, and operating conditions.
- A continuous-quality approach connects prevention, verification, release controls, and production feedback.

## Portfolio Relevance

This case can become a portfolio example if you preserve the evidence-boundary table, a sanitized system map, and the before-and-after quality signals. The value is the reasoning: showing how you turned a test result into a broader, evidence-based engineering decision.

## Related Practical Assets

- [Lab 1: From Testing a Feature to Engineering Quality](../labs/lab-01-from-testing-a-feature-to-engineering-quality.md)
- [Worksheet: Software Quality Profile](../exercises/worksheet-software-quality-profile.md)
- [Worksheet: Continuous Quality Planning](../exercises/worksheet-continuous-quality-planning.md)
- [Worksheet: Quality System Map](../exercises/worksheet-quality-system-map.md)

## Further Reading

- [Chapter 3: Understanding Software Quality](../chapters/chapter-03-understanding-software-quality.md) for the distinction between quality perspectives and quality characteristics.
- [Chapter 5: Shift Left, Shift Right, Shift Everywhere](../chapters/chapter-05-shift-left-shift-right-shift-everywhere.md) for continuous feedback and production evidence.

## Case Study Review Checklist

- [ ] I identified both supported and unsupported quality claims.
- [ ] I distinguished ISO/IEC 25010 product quality characteristics from engineering capabilities.
- [ ] I included technical, data, configuration, and organisational boundaries in the system view.
- [ ] I proposed preventive, delivery-time, and production interventions.
- [ ] I connected each recommendation to explicit evidence and an accountable action.
