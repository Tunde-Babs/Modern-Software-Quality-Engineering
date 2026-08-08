# Case Study 3: From Senior QA Engineer to Quality Engineer

| Metadata | Detail |
|---|---|
| **Part** | Part I — Foundations of Modern Software Quality Engineering |
| **Related chapters** | [Chapter 8: The Modern Quality Engineer](../chapters/chapter-08-the-modern-quality-engineer.md), [Chapter 9: The Modern Software Quality Engineering Framework](../chapters/chapter-09-the-modern-software-quality-engineering-framework.md), and [Chapter 10: The Future of Quality Engineering](../chapters/chapter-10-the-future-of-quality-engineering.md) |
| **MQE-BOK domain** | Domain 1 — Foundations |
| **Industry** | B2B SaaS |
| **Difficulty** | Foundation to intermediate |
| **Estimated time** | 60–90 minutes, plus personal follow-through |
| **Status** | Draft |

## Purpose

Translate established QA strengths into an intentional Quality Engineering development path. This case is designed for experienced practitioners who do not need to discard exploratory testing, test design, or automation expertise; they need to connect those strengths to broader systems, delivery, and operational capabilities.

## Quality Engineering Capability Developed

You will practise creating an evidence-based development plan, selecting a feasible specialty direction, and defining portfolio evidence for a transition from QA-focused work to Quality Engineering.

## Overview

The following is an **illustrative scenario**. The practitioner, organisation, role, and outcomes are fictional.

Amira is a senior QA Engineer on a B2B subscription platform. She is highly effective at exploratory testing, risk-based test design, UI automation, defect investigation, and helping product teams clarify acceptance criteria. Her work is trusted, but it is concentrated late in the delivery flow. She wants to contribute earlier and more broadly as a Quality Engineer, yet she has limited experience with APIs, databases, CI/CD pipelines, cloud infrastructure, observability, and architecture trade-offs.

Amira’s goal is not to become an expert in every technical domain at once. It is to make deliberate next-step choices that build on her current strengths and create useful evidence of expanded engineering contribution.

## Background

The platform provides subscription management, billing adjustments, and entitlement changes through a web application and public API. The team deploys frequently, uses feature flags, and relies on several managed cloud services. Production incidents are usually investigated by developers and platform engineers; QA is brought in when a customer workflow must be reproduced.

Amira has received informal feedback that she should “learn DevOps” and “be more technical.” These labels are too broad to guide investment. Her manager can support a small learning allocation and a scoped improvement project, but cannot promise a new job title or remove her current delivery responsibilities.

## System Context

| Current area | Amira's established contribution | Growth opportunity |
|---|---|---|
| Product discovery | Clarifies examples, ambiguity, and acceptance risks | Frame quality risks and evidence needs before implementation |
| Web application | Explores workflows and maintains UI regression automation | Balance UI coverage with lower-level API and contract evidence |
| Data and APIs | Reproduces defects through the interface | Read API contracts, query non-production data safely, and test boundary behaviour |
| Delivery pipeline | Consumes pipeline results | Understand quality gates, test execution, artifact traceability, and release signals |
| Production | Reproduces customer reports after escalation | Use logs, metrics, traces, and operational signals to form and test hypotheses |
| Architecture | Identifies symptoms across user flows | Map dependencies, failure modes, and quality trade-offs with the delivery team |

**Observability** is the capability to infer a system’s internal state from its externally available signals, such as logs, metrics, traces, and meaningful events. It supports diagnosis and learning; it is not a replacement for prevention or testing.

## Available Evidence

- Amira has maintained a reliable UI automation suite and can explain where it provides valuable customer-workflow coverage.
- She has examples of exploratory-test charters that found important usability and integration defects before release.
- She can read application logs with support from a developer but does not yet use query tools, traces, or dashboards independently.
- She understands feature intent and customer workflows but has not participated in architecture or operational-readiness discussions.
- Her team uses a CI/CD pipeline and feature flags, but quality gates are maintained by another engineer.
- She has four hours per week for structured learning and one small improvement project per quarter.

## Constraints

- No promotion, title change, or immediate move to a platform team is guaranteed.
- Customer data must not be copied into personal tools or unapproved environments.
- The team cannot pause delivery to create a broad training programme.
- Any portfolio evidence must be sanitized and must not expose company systems, customer information, or proprietary code.
- The plan must preserve the exploratory and automation work that continues to protect current releases.

## Problem Statement

Amira needs a practical transition plan that expands her Quality Engineering contribution without treating her QA experience as obsolete. The plan should identify capability gaps, select a realistic priority sequence, create evidence through work that benefits the team, and leave room for a longer-term specialization.

## Engineering Challenges

1. **Recognize transferable strengths.** Explain how exploratory testing, test design, defect investigation, and UI automation remain foundational in Quality Engineering.
2. **Prioritize rather than collect skills.** Choose a small set of adjacent capabilities that match the system and create immediate value.
3. **Connect learning to delivery outcomes.** Select projects that improve evidence, feedback, or risk management for the team.
4. **Show progress credibly.** Define portfolio evidence that demonstrates reasoning and outcomes without exposing sensitive information.

## Questions and Tasks

### 1. Establish a Current Capability Profile

Use the [Quality Engineer Competency Self-Assessment](../exercises/worksheet-quality-engineer-competency-self-assessment.md) to assess Amira’s current strengths and development areas. Record evidence for each assessment rather than treating the rating as a verdict.

Identify:

- three established strengths that transfer directly into Quality Engineering;
- three adjacent capability gaps with high relevance to the subscription platform; and
- one capability that is important but should not be the first priority.

### 2. Choose a Priority Sequence

Select a first capability sequence of no more than three areas. For each area, state:

- why it matters to the team’s current quality risks;
- what Amira already knows that gives her a starting point;
- a small, safe learning activity; and
- a delivery outcome that would show useful application.

For example, API and contract evidence, pipeline literacy, and production observability may form a coherent sequence. The exact sequence should follow the practitioner’s context, not a universal checklist.

### 3. Design a 90-Day and Six-Month Plan

Use the [QA to QE Personal Transition Plan](../exercises/worksheet-qa-to-qe-personal-transition-plan.md) to define:

- a 90-day goal, weekly learning cadence, and one team-facing improvement project;
- a six-month outcome that combines a technical capability with a quality-engineering practice; and
- risks to the plan, including workload, access, and insufficient feedback.

Do not prescribe a job title as the outcome. Focus on observable contribution and evidence.

### 4. Select an Improvement Project

Propose one scoped project that helps the current team while expanding Amira’s capability. It could, for example:

- map a critical subscription workflow and add focused API or contract evidence;
- improve a release-quality signal in the CI/CD pipeline; or
- work with developers and platform engineers to add a customer-relevant production diagnostic for a known failure mode.

Define the project’s quality claim, collaborators, boundaries, evidence of success, and how its value will be reviewed. If you propose **failure injection**—deliberately introducing a controlled fault to observe system behaviour—state the safety controls, scope, and approval required. Failure injection is not appropriate for every system or learning goal.

### 5. Create a Portfolio Evidence Map

Use the [Quality Engineering Portfolio Evidence Map](../exercises/worksheet-quality-engineering-portfolio-evidence-map.md) to identify what Amira can retain after each milestone. Include artifacts such as a sanitized system map, a quality-risk assessment, a test-strategy decision record, a pipeline improvement rationale, or a before-and-after operational signal.

For every artifact, explain what capability it demonstrates and how confidential information will be removed.

### 6. Identify a Long-Term Specialization Direction

Choose one or two possible directions for the next stage, such as test architecture, quality platforms, reliability and resilience, API and integration quality, data quality, security quality, accessibility, or developer experience. Explain what evidence from the first six months would help Amira decide whether the direction is a good fit.

## Expected Learner Outputs

- A current capability profile grounded in evidence.
- A prioritized gap analysis and learning sequence.
- A 90-day plan and a six-month outcome.
- One team-benefiting improvement project with collaborators and evidence of success.
- A portfolio evidence map and a tentative specialization direction.

## Illustrative Outcome

One credible outcome starts with Amira’s existing strength in workflow risk analysis. Over 90 days, she partners with a developer to map the subscription-change API, adds a small set of focused contract and boundary tests, learns to read the pipeline that runs them, and helps define a traceable identifier for failed entitlement updates. Over six months, she uses the resulting evidence to contribute to release-readiness and production-review discussions.

This is not a claim that UI automation or exploratory testing no longer matter. Those skills remain important sources of customer and risk insight. The change is that Amira can now influence quality evidence across more stages of the system.

## Facilitator Guidance

A strong response:

- identifies concrete, transferable QA strengths before listing gaps;
- prioritizes a coherent and feasible sequence instead of attempting all capabilities at once;
- links learning activities to current team needs and observable outcomes;
- plans collaboration with developers, product, and platform colleagues; and
- treats a portfolio as evidence of judgement and impact, not as a collection of tool badges.

## Reflection Questions

1. Which of your current QA strengths would be most valuable earlier in the lifecycle or closer to production feedback?
2. What capability would create the clearest new evidence for a current team risk?
3. What small project could demonstrate growth while still helping your team deliver safely?
4. Which specialization direction is attractive because of evidence, rather than job-title fashion?

## Key Learning Points

- QA experience is foundational to Quality Engineering; the transition extends its scope rather than discarding it.
- Useful capability growth is evidence-led, contextual, and sequenced.
- The most effective development projects improve the team’s quality system while building individual capability.
- A credible portfolio shows decisions, evidence, collaboration, and outcomes—not merely technologies used.

## Portfolio Relevance

This case is itself a portfolio-planning exercise. Keep a sanitized version of the capability assessment, transition plan, system or evidence map, and project reflection. Together, they show both a growth trajectory and the quality-engineering reasoning behind it.

## Related Practical Assets

- [Quality Engineer Competency Self-Assessment](../exercises/worksheet-quality-engineer-competency-self-assessment.md)
- [QA to QE Personal Transition Plan](../exercises/worksheet-qa-to-qe-personal-transition-plan.md)
- [Quality Engineering Portfolio Evidence Map](../exercises/worksheet-quality-engineering-portfolio-evidence-map.md)
- [QA to QE Transition Framework](../../../docs/00-project/QA_TO_QE_TRANSITION_FRAMEWORK.md)

## Further Reading

- [Chapter 8: The Modern Quality Engineer](../chapters/chapter-08-the-modern-quality-engineer.md) for the competency model.
- [Chapter 9: The Modern Software Quality Engineering Framework](../chapters/chapter-09-the-modern-software-quality-engineering-framework.md) for a systems-level view of Quality Engineering.
- [Chapter 10: The Future of Quality Engineering](../chapters/chapter-10-the-future-of-quality-engineering.md) for continuous career development and specialization.

## Case Study Review Checklist

- [ ] I identified transferable QA strengths and evidence for them.
- [ ] I prioritized a feasible sequence of capability development.
- [ ] I connected learning to a real quality improvement opportunity.
- [ ] I defined observable evidence for the 90-day and six-month outcomes.
- [ ] I protected confidential information in the proposed portfolio artifacts.
