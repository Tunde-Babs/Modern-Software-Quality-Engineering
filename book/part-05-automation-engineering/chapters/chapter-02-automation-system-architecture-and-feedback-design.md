# Chapter 2 — Automation System Architecture and Feedback Design

## Metadata

| Field | Value |
|---|---|
| Part | Part V — Automation Engineering |
| MQE-BOK domain | Domain 5 — Automation Engineering |
| Chapter | 2 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapter 1; Parts II–IV, or equivalent experience with modular code, evidence boundaries, APIs, configuration, and diagnostics |
| Estimated study time | 165 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** An automation system is trustworthy when its purpose, state, dependencies, observations, and failure evidence are understandable to the people who must act on its results.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional online retailer.

After the address-transfer incident, Atlas creates a new browser-automation project. The first version is productive: one file signs in, creates a customer through the browser, renews a subscription, changes the address, opens an internal support screen, and compares several messages. The project stores environment values in multiple files, shares one test account, and captures only a pass or fail result.

Six weeks later, a product change alters the renewal form. Three checks fail. One failure is caused by an updated label, another by a stale account, and the third by an actual regression in address transfer. The report names the tests but does not show their preconditions, the account state, the selected environment, or the last observed operation. Two engineers make unrelated edits in the same file because it contains setup, workflow, assertions, and cleanup for every scenario.

Dev, the Automation Engineer, proposes a redesign. He does not start by choosing a fashionable folder layout or building a generic base class. He identifies the feedback consumers and their decisions. He separates account preparation, renewal interactions, state observation, configuration, and diagnostics into clear responsibilities. He records which dependency must remain representative and which can be controlled for a focused question. He designs failure output to show the operation, expected state, observed state, and safe context needed to investigate.

The resulting project is still small. Its improvement is not more layers. It is that a future reader can understand what the system is intended to prove, how it gets into the relevant state, and what a failure means.

## Introduction

Chapter 1 established that automation should exist to produce useful evidence for a decision. Once a team selects that evidence, the automation becomes software with its own design concerns. It has inputs, configuration, dependencies, state, execution paths, observations, reports, users, and maintenance costs. It can become hard to change, difficult to diagnose, or unsafe to trust if those concerns are allowed to accumulate by accident.

An **automation system** is the combination of checks, supporting code, fixtures, data, configuration, dependency controls, execution conventions, and diagnostic artifacts used to produce automated feedback. It may be a focused repository utility or a wider set of related projects. Its size does not decide whether architecture matters. A small suite with unclear responsibility and shared state can be harder to sustain than a larger system with explicit boundaries.

This chapter introduces an evidence-first way to reason about automation architecture. It does not prescribe one folder tree, naming convention, runner, browser tool, or enterprise framework. Instead, it asks which responsibilities must remain clear, where state is established, how dependencies are represented, what a result means, and how change or failure can be investigated. Chapter 3 applies the same reasoning to abstractions, fixtures, and test data. Chapter 4 focuses on deterministic execution and flakiness.

## Why This Chapter Matters

An automated check is often read as a small program. An automation system is read and used by many people over time: a developer diagnosing a pull-request failure, a reviewer assessing whether a change preserved useful evidence, a Quality Engineer deciding whether the evidence is sufficient, and a release owner interpreting an exception. Architecture affects whether those people can find the intended behaviour, identify dependencies, understand state, reproduce a failure, and make a proportionate decision.

Without deliberate architecture, teams commonly accumulate a file or helper layer that does everything: log in, create data, manipulate the UI, call services, decide expectations, configure environments, and report failure. Such designs can pass while the product is stable and become costly when it changes. They obscure whether a failure concerns a feature, test data, a dependency, configuration, environment, or the check itself.

Part II established the foundations for readable, modular, testable, diagnostic code. Part III established that evidence should be selected at a credible boundary. Part IV established that APIs and dependencies need explicit state, contract, and control decisions. Part V joins those capabilities to form a feedback system. This chapter does not teach a CI platform, secret implementation, cloud environment creation, service virtualization product, or Playwright project configuration. Those are implementation choices or later specialisms.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why automation code should be designed as maintainable software rather than treated as disposable test scripting;
- identify the core responsibilities of an automation system without prescribing a universal folder structure;
- describe feedback as a sequence of trigger, state preparation, interaction, observation, oracle, artifact, and consumer action;
- select boundaries for browser, API, data, environment, and external-provider interactions;
- distinguish a stable separation of responsibilities from layering or indirection created for its own sake;
- make and record architecture decisions about setup, state, dependencies, configuration, artifacts, and known limitations;
- identify warning signs of framework overengineering;
- distinguish configuration from test data and describe safe configuration boundaries;
- design failure output that identifies the operation, expectation, observation, relevant context, and artifact;
- evaluate whether a design contains the impact of a product or environment change;
- identify ownership, review, refactoring, and deletion responsibilities for automation code; and
- explain the transition from isolated scripts to intentional automation-system design.

## Automation Is Software

Automation code is production-adjacent engineering code. It may not serve a customer request directly, but it influences developer behaviour, release confidence, incident investigation, and the cost of change. It therefore benefits from the same disciplines that Part II introduced: clear names, coherent modules, explicit inputs, bounded errors, review, tests where appropriate, version control, diagnostics, and refactoring.

This does not mean automation must imitate application architecture or receive a large platform before it can be useful. The useful standard is proportionate design. A three-check utility may need only a clear module, explicit configuration, known data, and readable failures. A multi-boundary suite that supports daily delivery feedback may need more explicit fixture lifecycles, dependency choices, report contracts, and ownership. The architecture should make the important responsibilities visible at the system's actual scale.

| Automation as disposable scripting | Automation as software |
|---|---|
| The main goal is to make the current step execute. | The goal is to produce maintainable evidence over time. |
| State and configuration are often implicit. | Inputs, state ownership, and configuration boundaries are explicit. |
| A failure identifies a test name. | A failure identifies the operation, expectation, observation, context, and available artifact. |
| Duplication is tolerated until it becomes painful. | Repetition is reviewed for a meaningful shared responsibility. |
| Tool mechanics determine structure. | Evidence needs and stable responsibilities determine structure. |
| Maintenance is an interruption. | Maintenance, review, refactoring, and deletion are planned system responsibilities. |

Automation should also be testable where it has consequential logic. A domain-data builder, configuration parser, diagnostic formatter, or selector policy may deserve focused tests just as other utility code does. A broad browser journey should not be made the only way to validate every support component. The selected validation boundary follows the behaviour and risk.

## An Automation System and Its Responsibilities

An automation system commonly needs to address the following concerns. The list is conceptual; it does not require one module, directory, or class for each concern.

| Concern | Useful responsibility | Questions a reviewer should ask |
|---|---|---|
| **Check or scenario layer** | Express the evidence question and expected observable outcome. | Can a reader identify the risk, user or system action, and meaningful expectation? |
| **Domain interaction or abstraction** | Perform a stable, repeated domain interaction at a selected boundary. | Does it clarify intent, or merely hide a single tool call? |
| **Fixture and setup layer** | Provide known state, resources, and lifecycle management. | Who creates, owns, resets, and removes each resource? |
| **Test data** | Supply safe, interpretable, and suitably unique inputs. | Can a result be attributed to the intended data rather than prior history? |
| **Dependency boundary** | Keep required dependencies real or control selected conditions deliberately. | What evidence does the choice preserve, and what does it remove? |
| **Configuration** | Supply environment-specific, non-domain execution settings. | Is configuration explicit, validated, and separate from scenario data? |
| **Observation and oracle** | Compare an observation with a meaningful expectation. | Is the expectation visible and attributable to a credible source? |
| **Reporting and artifacts** | Preserve result and diagnostic context for the intended consumer. | Would another engineer know what happened and what to inspect next? |
| **Execution and orchestration** | Run selected feedback at a stated trigger and scope. | Is the execution purpose clear without embedding CI implementation? |

The responsibilities are connected. Configuration affects which environment is contacted. Environment affects data and dependency behaviour. Setup affects the credibility of an observation. A report must identify enough of that context to support investigation. Architecture should make these relationships discoverable without forcing every check to carry infrastructure detail.

### Feedback architecture

The following is an **MSQE feedback-architecture prompt**, not a standard or mandatory implementation sequence:

| Stage | Question | Example evidence need |
|---|---|---|
| **Trigger or input** | What change, request, or decision needs feedback? | A renewal-rule change requires focused regression evidence. |
| **Setup and state** | Which preconditions must be known or controlled? | A customer has an active subscription and no unresolved address update. |
| **Interaction** | Which user, component, or service behaviour is exercised? | The customer changes a delivery address during renewal. |
| **Observation** | What result or state is visible at the selected boundary? | The renewal record stores the intended address and exposes the correct status. |
| **Oracle** | Which rule or agreement judges the observation? | The approved renewal policy and address-transfer rule. |
| **Artifact or result** | What context should be retained? | The selected account/run identifier, observed state, and safe failure artifact. |
| **Consumer action** | Who uses the result, and what can they decide? | A developer investigates, or a release owner adds a safeguard. |

This prompt protects a system from producing pass/fail signals that no one can interpret. A report is not the end of the architecture. It is a hand-off from the automation system to a human or another decision process.

## Separation of Responsibilities Without Accidental Complexity

Separation of concerns is useful when it clarifies stable responsibility, contains the impact of change, or makes lifecycle and evidence decisions visible. It is not useful when it creates layers that every reader must traverse to understand a single interaction.

Consider a browser scenario that changes an address during renewal. The scenario should make the evidence question visible: a customer in a known renewal state changes an address, and the expected customer-visible or authoritative result is observed. A focused interaction abstraction may be useful when multiple scenarios perform the same stable renewal action. A fixture may be useful when it owns the account and cleanup lifecycle. A diagnostic component may be useful when every failure needs a safe state summary. None of these requires a generic base class that wraps every browser operation.

| Useful separation | Unhelpful indirection |
|---|---|
| A domain helper expresses “prepare a renewable customer” with documented state ownership. | A generic helper performs an opaque sequence of browser clicks whose domain effect is unknown. |
| A fixture creates and later cleans up an isolated account. | A global setup creates shared mutable accounts for unrelated scenarios. |
| A component abstraction encapsulates a stable address form interaction. | A page class exposes one method for every DOM locator and hides no meaningful behaviour. |
| A diagnostic formatter produces a consistent, redacted state summary. | A report wrapper relays a raw error while losing the operation and context. |
| A configuration module validates an environment URL and run option once. | Several helper layers read environment variables opportunistically. |

The question is not “how many layers should a framework have?” It is “which responsibility is stable enough to deserve a name, interface, owner, and test boundary?” Chapter 3 examines that question in depth.

## Selecting and Explaining Boundaries

An automation system often touches several boundaries. It might prepare state through an API, execute a browser-visible flow, observe an authoritative service result, and retain a diagnostic artifact. Each boundary must be chosen for an evidence reason rather than because it is convenient to script.

| Boundary | Architecture decision | Example trade-off |
|---|---|---|
| **Browser/UI** | Use a browser when the risk involves user-visible interaction, navigation, session, presentation, or composition. | It can reveal a real interaction but may be slower and more state-sensitive than a focused service observation. |
| **API/service** | Use a service interface for focused state setup, data control, or a contract/state observation. | It can speed preparation but does not prove the browser uses the interface as intended. |
| **Data/setup utility** | Use a controlled utility to establish safe preconditions. | It improves repeatability but must not bypass the exact boundary whose behaviour is at risk. |
| **Environment** | Use a representative environment where integration behaviour matters. | It can reveal composition risk but may introduce shared constraints and slower diagnosis. |
| **External provider** | Keep the provider real when its compatibility or behaviour is the evidence question; control it when a focused failure or state needs diagnosis. | A controlled substitute improves repeatability but removes evidence about the real provider. |

Architecture should record these decisions. “The test uses an API because it is faster” is incomplete. A better record says, for example: “The suite uses the Atlas setup API to create a unique active subscription because the browser form is not the subject of setup evidence. The browser scenario still observes the customer-visible renewal and address confirmation. A representative provider integration is exercised in a separate selected path because setup control does not establish provider compatibility.”

This description makes a limitation explicit and protects a useful focused check from overclaiming.

## Designing for Diagnosis

When an automated check fails, the most important question is not merely whether it is red. It is whether a person can distinguish a likely product condition from an automation, data, dependency, configuration, or environment problem. Architecture determines whether that distinction is feasible.

A useful failure report should make the following information available where it is safe and relevant:

| Diagnostic need | Example |
|---|---|
| **Operation** | “Renewal address submitted” rather than an internal helper name. |
| **Expected state** | “The selected renewal record should contain the newly submitted delivery address.” |
| **Observed state** | “The confirmation showed the new address; the inspected renewal state retained the prior value.” |
| **Relevant context** | Synthetic account/run identifier, selected non-secret environment, feature condition, or dependency mode. |
| **Artifact** | A trace, screenshot, response excerpt, state record, or structured log reference appropriate to the boundary. |
| **Limitation** | “This controlled dependency observation does not establish the live fulfilment provider outcome.” |

Diagnostics must be designed with security and privacy in mind. A report should not expose passwords, tokens, payment data, personal addresses, or unrestricted production records. The appropriate context is sufficient to correlate a fictional or safe test condition with the automation run and investigate the behaviour. Part VIII will address operational observability implementation; this chapter addresses the automation-system responsibility to retain interpretable run evidence.

### Failure semantics

An automation system should preserve the difference between facts and conclusions. “The feature is broken” is usually a conclusion that requires investigation. “The browser check expected renewal record `atlas-run-42` to contain address version 3; it observed version 2 after the recorded action” is an observation with context. The latter helps an engineer test hypotheses without overclaiming.

Failure semantics also affect code design. If a helper catches every error and returns `false`, it can hide the meaningful operation and cause. If a check combines setup, interaction, observation, cleanup, and reporting without boundaries, it can be difficult to preserve the relevant state when one stage fails. A small amount of explicit structure can make failure evidence much stronger.

## Configuration Is Not Test Data

**Configuration** supplies execution-specific information that changes how the automation system runs, such as a target environment URL, selected browser or project, timeout policy, safe feature mode, or reporting location. **Test data** represents the business inputs and state used to exercise a scenario, such as a synthetic customer, subscription plan, delivery address, or order history.

The distinction matters because configuration and test data have different owners, lifecycles, validation needs, and security concerns.

| Configuration | Test data |
|---|---|
| Defines where or how a check runs. | Defines the domain condition the check represents. |
| May be shared across a selected run. | Should usually be attributable to a test, worker, or known fixture lifecycle. |
| Needs explicit validation and safe defaults. | Needs domain meaning, uniqueness, cleanup, and representative constraints. |
| May reference a credential or secret through approved mechanisms. | Must never embed real customer or sensitive data for convenience. |

Configuration should be explicit rather than read opportunistically throughout the codebase. A future implementation may use a TypeScript configuration module and a runner-specific project definition, but the general principle is transferable: validate important run inputs early, surface selected non-sensitive settings in diagnostics, and avoid a hidden mix of local defaults and environment assumptions.

This chapter does not teach secret-storage implementation. Secret handling, access control, infrastructure configuration, and cloud environment management are Part VII concerns. An automation design can nevertheless record that a credential reference is required, that its value must not be logged, and that a missing required configuration should fail clearly before an unsafe or misleading run begins.

## Architecture for Change

Automation changes because systems change. Product language changes, rules evolve, interfaces are versioned, dependencies change, test data becomes unsuitable, environments are retired, and teams learn that an earlier evidence boundary was weak. Good architecture contains the impact of these changes without pretending that change can be eliminated.

| Change | Design response |
|---|---|
| A label or page layout changes while the user task remains stable. | Keep interaction contracts close to meaningful user or component intent; avoid incidental DOM paths. |
| A renewal rule changes. | Keep the rule's oracle visible and update the focused boundary that actually challenges it. |
| Test data becomes contaminated or shared. | Make ownership, uniqueness, cleanup, and reset responsibilities explicit. |
| A dependency is intermittently unavailable. | Distinguish representative integration evidence from controlled diagnostic paths; retain the limitation. |
| A report is too opaque to support triage. | Evolve the failure diagnostic contract rather than asking investigators to reconstruct context manually. |
| A check no longer informs a decision. | Delete or replace it; preservation is not a virtue when evidence has decayed. |

Impact containment does not require a class hierarchy or a framework layer for every anticipated change. It requires a design that makes the intended responsibility and dependency visible enough to change deliberately. Premature flexibility can create as much cost as duplication. Chapter 3 provides practical criteria for choosing reuse.

## Avoiding Framework Overengineering

Teams often begin with a legitimate wish for consistency and end with a framework whose indirection exceeds its evidence value. The symptoms are familiar:

- wrappers around every tool call, so a reader cannot tell what interaction occurred;
- generic base classes that accumulate unrelated state and lifecycle behaviour;
- configuration options that no current decision needs;
- a mandatory abstraction for every page, request, assertion, or data object before meaningful repetition exists;
- inheritance that couples unrelated workflows;
- helpers that hide the only assertion relevant to the evidence claim;
- global setup that creates state for every scenario whether it needs it or not; and
- reports that identify framework internals rather than the business operation or observed condition.

The remedy is not “never abstract.” It is to establish a concrete reason. A component abstraction may be justified when a stable address form appears in several user journeys. A fixture may be justified when several checks need an isolated authenticated account with known cleanup. A diagnostic utility may be justified when a consistent redacted context makes failures substantially easier to investigate. A generic layer that merely makes a familiar API less visible is usually a cost without a clear owner or benefit.

## Ownership and Review

Automation systems need explicit ownership. Shared quality responsibility does not mean an unattended suite owns itself. At minimum, a team should know who can review changes, who maintains data and dependency controls, who investigates recurring instability, who approves changes to the feedback contract, and who can remove obsolete checks.

Code review is an important automation-quality activity. A reviewer can ask:

- Does the check express a meaningful evidence question and an understandable oracle?
- Is the selected boundary proportionate to the risk?
- Are setup, data, dependency, and cleanup responsibilities visible?
- Does a new abstraction reduce meaningful duplication or conceal behaviour?
- Can a failure distinguish observed fact from a broad conclusion?
- Does the change introduce shared mutable state, unsafe configuration, or uncontrolled external dependence?
- Does the check retain a limitation and residual risk where appropriate?

Review should also support deletion. A check that no longer informs a decision, duplicates stronger evidence, encodes retired behaviour, or cannot be repaired proportionately should be removed deliberately. Automation debt includes obsolete checks as well as missing automation.

## A Compact Architecture Review Model

The following **MSQE Automation Architecture Review** is an educational review prompt, not a compliance standard:

| Review question | What a strong answer makes visible |
|---|---|
| **Purpose** | The decision, risk, feedback consumer, and evidence claim. |
| **Boundary** | Why UI, API, component, data, dependency, or hybrid observation is selected. |
| **State** | Setup, data ownership, cleanup, and the conditions that must be controlled. |
| **Responsibility** | Coherent ownership for interactions, fixtures, configuration, diagnostics, and assertions. |
| **Dependency** | What remains real, what is controlled, and the resulting evidence limitation. |
| **Diagnosis** | Operation, expectation, observation, safe context, and artifacts available on failure. |
| **Change** | Likely change points, ownership, review path, and deletion criteria. |
| **Limit** | What the system cannot establish and what complementary evidence remains. |

The model is useful before implementation, in code review, or when a suite becomes difficult to maintain. It does not replace design review, risk assessment, or specialist input. It makes the automation-specific questions visible enough to discuss.

## QA → QE Transition

The architecture transition expands an existing scripting skill into an engineering responsibility.

| Script-focused practice | Automation-system design practice |
|---|---|
| Put setup, interaction, assertions, and cleanup in one scenario because it works today. | Give state, interaction, observation, diagnostics, and cleanup coherent, visible responsibilities. |
| Add a helper when a line repeats. | Introduce an abstraction when it clarifies stable domain or lifecycle intent and contains meaningful change. |
| Read environment values where they are needed. | Validate and expose configuration at a clear boundary, separate from test data. |
| Treat a pass/fail result as the output. | Design artifacts for developers, reviewers, release owners, and investigators with clear facts and limits. |
| Build a generic framework before writing scenarios. | Start from selected evidence needs and add only the structure they justify. |

The learner should increasingly ask: *What evidence system am I building? What responsibility belongs here? Who owns this state? Which dependency choice does the evidence require? Can another engineer understand a failure and change the system safely?*

## Engineering Perspective

Automation architecture is engineering architecture at a smaller, feedback-focused scale. It exposes interaction contracts, state control, configuration, dependency seams, diagnostic paths, and maintenance ownership. Its quality is not measured by the number of directories or patterns adopted. It is measured by whether the system produces credible feedback that people can understand, change, and act on.

The best architectural improvement may be outside the automation repository. A team may need a stable test identifier, a safe setup interface, a clear completion state, a representative dependency environment, or a redacted diagnostic identifier. Automation Engineers should make these needs explicit. They should not compensate indefinitely with hidden waits, global accounts, or opaque helper layers.

## Industry Perspective

Playwright describes test fixtures as a way to establish the environment needed for a test and notes that fixtures can be isolated, composable, and on demand.[^playwright-fixtures] Those tool capabilities illustrate a transferable design concern: lifecycle and dependency ownership should be explicit. They do not require every automation system to use Playwright fixtures, nor do they decide the correct scope of a fixture.

Martin Fowler describes Page Objects as application-specific APIs that wrap page mechanics and can reduce brittleness from direct HTML manipulation.[^fowler-page-object] That pattern can be valuable when it expresses stable user or component behaviour. It does not justify a universal Page Object hierarchy, hidden assertions, or a method for every locator. The architecture review model in this chapter is MSQE educational framing, not a standard or a prescribed framework pattern.

## Common Misconceptions

### “Architecture means a fixed folder structure.”

Folders can communicate responsibility, but they do not create it. Architecture is the set of decisions about purpose, boundaries, state, dependencies, diagnostics, ownership, and change. A structure is useful only when it makes those decisions easier to maintain.

### “More abstraction always makes automation maintainable.”

Abstraction can remove meaningful duplication and contain unstable detail. It can also hide evidence, couple unrelated behaviours, and make failures opaque. The responsibility and trade-off must be clear.

### “A global setup is the simplest option.”

Global setup can be useful for a genuinely shared, carefully owned concern. It becomes dangerous when it creates hidden state, unnecessary work, coupled scenarios, or failures that are hard to attribute. Scope should follow lifecycle and evidence needs.

### “Configuration and test data are both just variables.”

They have different meanings and ownership. Configuration tells the system how and where to run. Test data represents the domain condition being evaluated. Mixing them makes runs harder to reproduce and review safely.

### “A detailed stack trace is enough diagnostic information.”

A stack trace may help the automation author. It often does not tell a developer or release owner which business operation was attempted, what state was expected, what was observed, or what dependency condition applied.

### “A framework must solve every future automation problem before the first check is written.”

Premature generality creates cost and hides learning. Begin with selected evidence needs, review actual repetition and change, and extend the design deliberately.

## Summary

Automation systems are software systems that create evidence for decisions. Their architecture should make purpose, state, interactions, observations, oracles, dependencies, configuration, diagnostics, consumers, and limitations clear. The appropriate design is proportional: enough structure to express stable responsibilities and contain change, but not generic layers that obscure behaviour.

Architecture begins with the feedback claim, not a folder structure or tool. It selects credible boundaries, records real-versus-controlled dependency choices, separates configuration from test data, and designs reports that support investigation. Ownership, review, refactoring, and deletion sustain the system as product behaviour and delivery needs evolve.

## Key Takeaways

- Automation code deserves readable, modular, diagnosable, reviewable, and maintainable software design.
- An automation system includes checks, fixtures, data, configuration, dependencies, observations, artifacts, execution conventions, and ownership—not just scenario files.
- Feedback architecture should connect a trigger to setup, interaction, observation, oracle, artifact, and consumer action.
- Separation is valuable when it clarifies stable responsibility; layers and indirection without a purpose increase cost.
- Boundary and dependency choices must state what evidence they preserve and what they leave unknown.
- Useful diagnostics identify the operation, expected state, observed state, safe context, relevant artifact, and limitation.
- Configuration is not test data; each has distinct meaning, lifecycle, validation, and security concerns.
- Maintainable architecture contains the impact of product, data, dependency, and environment change.
- Framework overengineering often appears as unnecessary wrappers, generic base classes, opaque helpers, and premature flexibility.
- Ownership, review, refactoring, and deletion are required to sustain trustworthy feedback.

## Review Questions

1. Why should an automation system be treated as software even when it is not customer-facing?
2. Name the core responsibilities an automation system commonly needs to address.
3. How does the feedback-architecture prompt connect a failing check to a delivery decision?
4. Give an example of useful separation of responsibility and an example of unhelpful indirection.
5. Why should a dependency decision record both what remains real and what is controlled?
6. Distinguish configuration from test data with an example from an automation scenario.
7. What diagnostic information would help distinguish a product failure from a setup or environment failure?
8. What are three warning signs of framework overengineering?
9. How does architecture contain change without attempting to predict every future requirement?
10. Why is deleting an obsolete check part of automation ownership?

## Interview Questions

1. How would you design a small automation project so that another engineer can diagnose a failed run?
2. What factors determine whether setup should happen through a browser, API, data utility, or controlled dependency?
3. How do you prevent an automation framework from becoming overengineered?
4. What should a code reviewer look for in a new fixture or Page Object?
5. How would you explain the difference between configuration and test data to a team?
6. Describe how you would redesign a suite whose failures cannot be attributed to product, data, dependency, or environment conditions.

## Practical Exercise

### Design a Small Automation Feedback System

**Objective:** Produce an **Automation Architecture Decision Record** for an illustrative Atlas Commerce renewal-address change. Design a small, understandable feedback system; do not write code, select a directory structure, or configure a runner.

**Scenario:** Atlas needs feedback for a change that allows a customer to update a delivery address during subscription renewal. A browser-visible confirmation must be accurate. The renewal service must retain the address change. Fulfilment receives the address later through a provider integration. Test environments contain synthetic data, but a shared demonstration account is sometimes changed by other teams. The product has a non-secret feature flag that exposes the new address form in the review environment. The release owner needs a concise report that distinguishes an address-transfer regression from an unavailable fulfilment provider.

**Constraints:** All people, systems, data, and behaviour are fictional. Do not use real credentials, customer data, provider accounts, browser tools, CI configuration, or cloud infrastructure. You may propose a controlled dependency, but you must state what representative evidence it removes. You may refer to a future TypeScript and Playwright implementation only as an implementation possibility, not as the architecture itself.

**Tasks:**

1. Name the feedback consumers and the decision each needs to make.
2. Define the selected evidence claim and identify the browser, API/service, data/setup, and provider boundaries that are relevant.
3. Propose responsibilities for the scenario/check layer, setup or fixture layer, domain interactions, test data, configuration, dependency boundary, observation/oracle, diagnostics, and execution.
4. Explain which setup can be controlled and which selected provider evidence should remain representative. State the limitation of each choice.
5. Separate configuration values from domain test data. Identify which values need validation, which must not be logged, and which safe values should appear in a diagnostic artifact.
6. Define a failure diagnostic contract: operation, expected state, observed state, safe context, artifact, and limitation.
7. Identify two likely product changes and two likely environment or dependency changes. Explain how your responsibilities contain their impact.
8. Identify one abstraction that is justified now and one generic framework feature that you would defer until meaningful repetition exists.
9. Complete the MSQE Automation Architecture Review for your design, including a residual-risk statement.

**Expected artifact:** A three- to four-page **Automation Architecture Decision Record** or **Automation System Map** with a responsibility table, boundary decisions, state/data/configuration notes, diagnostic contract, change-impact assessment, and limitations.

**Reflection:** If the browser confirmation is green but the representative provider integration is unavailable, what should the release owner be told? Which parts of the result are observed facts, and which require further evidence?

**Portfolio relevance:** This artifact demonstrates intentional automation-system design: it connects a business risk to boundaries, state, dependencies, diagnostics, and responsible decision support.

## Further Reading

- [Part II, Chapter 4 — Functions, Modules, and Composable Design](../../part-02-programming/chapters/chapter-04-functions-modules-and-composable-design.md) — modular responsibility and composition foundations.
- [Part II, Chapter 5 — Configuration, Files, Dependencies, and Test Data](../../part-02-programming/chapters/chapter-05-configuration-files-dependencies-and-test-data.md) — configuration and test-data foundations.
- [Part II, Chapter 8 — Debugging Quality Engineering Code](../../part-02-programming/chapters/chapter-08-debugging-quality-engineering-code.md) — diagnostic practice.
- [Part III, Chapter 6 — Test Levels, Boundaries, and Integration Evidence](../../part-03-software-testing/chapters/chapter-06-test-levels-boundaries-and-integration-evidence.md) — selecting boundaries for the risk.
- Playwright, [Fixtures](https://playwright.dev/docs/test-fixtures) — a tool-specific implementation reference for fixture lifecycle and composition.
- Martin Fowler, [Page Object](https://martinfowler.com/bliki/PageObject.html) — a practitioner discussion of page-oriented abstraction.

## References

[^playwright-fixtures]: Microsoft. [Fixtures](https://playwright.dev/docs/test-fixtures). Playwright documentation. Accessed 2026-08-10.
[^fowler-page-object]: Fowler, Martin. [Page Object](https://martinfowler.com/bliki/PageObject.html). September 10, 2013. Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Describe automation as a small software system with explicit responsibilities.
- [ ] Connect trigger, state, interaction, observation, oracle, artifact, and consumer action for a selected feedback need.
- [ ] Select boundaries and dependencies while stating the evidence each choice removes or preserves.
- [ ] Separate configuration from test data and identify their different ownership and safety needs.
- [ ] Design a failure diagnostic contract that supports investigation without exposing sensitive information.
- [ ] Identify when an abstraction or layer is justified and when it is premature framework complexity.

**Previous:** [Chapter 1 — Automation Engineering: Purpose, Evidence, and Boundaries](chapter-01-automation-engineering-purpose-evidence-and-boundaries.md)
**Next:** [Chapter 3 — Reusable Automation Design: Abstractions, Fixtures, and Test Data](chapter-03-reusable-automation-design-abstractions-fixtures-and-test-data.md).
