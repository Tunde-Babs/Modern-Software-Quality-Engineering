# Chapter 6 — Composing UI, API, Component, and Service Automation

## Metadata

| Field | Value |
|---|---|
| Part | Part V — Automation Engineering |
| MQE-BOK domain | Domain 5 — Automation Engineering |
| Chapter | 6 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–5; Parts I–IV, or equivalent experience with evidence boundaries, automation architecture, deterministic feedback, and API quality |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Select each automation boundary for the evidence it can credibly provide, then make the gaps between boundaries visible rather than accidental.

## Opening Story

The following illustrative scenario concerns Atlas Commerce, a fictional online retailer.

Atlas wants release feedback for subscription renewal. One team proposes a single browser journey: create a customer through the UI, choose a plan, enter payment details, wait for the order to process, open the account history, and confirm the renewal. It reflects a recognisable customer journey, but it takes twelve minutes and fails for reasons that are hard to separate: test-data preparation, account state, payment-provider behaviour, client rendering, service rules, or cleanup.

Another team proposes the opposite: replace every browser check with direct service requests because they are fast. Their checks create renewals and verify returned status values, but a recent browser change made the confirmation panel unreachable for keyboard users. The service suite stayed green because it did not claim to observe the customer interaction.

Ravi, the Automation Engineer, frames the decision differently. The customer-visible renewal journey needs a small amount of browser evidence. The prerequisite customer and plan can be established through a controlled API path. Focused service evidence can challenge renewal-state rules and provider error handling. A component boundary can challenge the confirmation panel’s rendering for controlled inputs. The browser scenario can then exercise the meaningful interaction and verify that the unique renewal is visible to the customer. Each check has a distinct claim, setup mechanism, observation, artifact, and limitation.

The team does not create four copies of the same assertion. It builds a deliberate evidence portfolio. When the next failure appears, the result indicates whether the problem is likely in service state, component rendering, browser composition, data setup, or a dependency—not merely that “renewal failed.”

## Introduction

Automation systems often become fragile when one execution boundary is asked to answer every question. The browser suite turns into a slow, state-heavy monoculture. A fast API suite begins to make claims about user experience that it cannot observe. Component checks become substitutes for integration evidence. Service-level checks duplicate contracts rather than clarifying a specific behaviour. The problem is not the use of any boundary. It is an unclear allocation of responsibility.

This chapter teaches **automation composition**: the deliberate use of UI, API, component, service, setup, and verification boundaries to produce a more credible and maintainable set of evidence than a single boundary could provide alone. It builds on Chapter 5’s browser-evidence design and Chapter 3’s fixture, data, and lifecycle thinking. It uses API and service interactions as parts of an automation system, while respecting Part IV’s ownership of API-quality strategy, protocol semantics, contracts, and stateful API behaviour.

The central question is not which level is highest on a diagram. It is: *Which boundary should perform this responsibility, what evidence will it produce, and what remains unproven?*

## Why This Chapter Matters

An automation system needs both credible evidence and sustainable feedback. A browser-only approach can make routine setup costly, broaden every failure, and delay diagnosis. An API-only approach can miss routing, rendering, client state, and interaction failures. A component-only approach can offer fast, controlled observations while leaving integration assumptions untouched. A service-only approach can provide focused state evidence without proving that any customer can access it through the application.

Composition is how a Quality Engineer avoids making these false choices. It makes setup, interaction, verification, cleanup, and diagnostic roles explicit. It also prevents accidental overclaiming. Creating an account through an API before opening a browser does not turn the scenario into an API test. Verifying a browser action through an authoritative service observation does not make the browser interaction irrelevant. Each boundary contributes evidence about a different part of the claim.

Part IV remains responsible for determining whether an API is well designed, semantically correct, contractually compatible, secure, and reliable. This chapter does not repeat those topics. Its concern is the automation-system decision to use API or service calls for setup, teardown, controlled state, focused verification, or a hybrid flow. Nor does it prescribe a frontend framework, a test-pyramid percentage, or a universal suite shape. Chapter 7 will address whether the resulting composition can run concurrently without contaminating its own evidence.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain why no automation boundary is universally best;
- distinguish UI, API, component, and service automation by the evidence each can and cannot provide;
- distinguish setup, interaction, evidence, verification, and cleanup boundaries;
- design a hybrid automation flow without treating it as an end-to-end default;
- allocate automation responsibilities from a risk and evidence need rather than tool convenience;
- explain how API or service setup can improve browser evidence without duplicating Part IV API strategy;
- identify evidence duplication and integration gaps across a multi-boundary portfolio;
- choose controlled dependencies while stating their representativeness limits;
- assess trade-offs involving runtime, diagnosability, test data, dependency breadth, and maintenance;
- use test-pyramid or test-shape models as contextual heuristics rather than laws; and
- explain the shift from single-boundary scripting to deliberate evidence composition.

## Boundaries Are Choices, Not Rankings

A **boundary** is the point at which automation stimulates, controls, or observes a system. Calling one boundary “higher” or “lower” can be useful shorthand, but it can obscure the evidence decision. A narrower boundary is not automatically more valuable, and a broader boundary is not automatically more realistic. The right selection depends on the risk, the decision consumer, the observable outcome, the required timing, and the limits that can be accepted.

| Boundary | Useful contribution | Frequent cost | Important limit |
|---|---|---|---|
| **UI or browser** | User-visible interaction, navigation, rendering, client state, and selected integration behaviour. | Slower feedback, broad dependencies, and harder diagnosis. | Does not prove every rule, service state, or production condition. |
| **API** | Controlled setup and teardown, focused request/response or state evidence, and faster post-condition observation. | Can bypass user-visible paths and depend on permissions or environment data. | Does not prove the browser flow or presentation is usable. |
| **Component** | Controlled rendering and interaction of a UI unit with small feedback scope. | Framework-specific harnesses and limited composition. | Does not establish the deployed application’s full route, services, or browser conditions. |
| **Service** | Focused behaviour and state at a backend or service boundary. | Dependency representation and service setup can still be complex. | Does not prove the client’s interaction, presentation, or complete distributed outcome. |
| **Hybrid** | A purposeful combination of setup, interaction, and verification evidence. | More design decisions, artifact needs, and possible coupling. | Can become synthetic or broad if its claims are not separated. |

The table is a decision aid, not a test taxonomy. A browser flow may be the smallest credible boundary for a session-loss risk. A service check may be broad when it triggers a complex asynchronous workflow. A component check can be highly consequential when a pricing panel must render an explanation accurately. The essential discipline is to describe the claim before choosing the mechanism.

### Start with the evidence question

For every automation candidate, begin with a small set of questions:

1. What customer, business, or engineering risk needs evidence?
2. Who will use the result, and when?
3. Which observation would most directly challenge the risk?
4. What setup is required, and does performing it through the same boundary strengthen or merely slow the scenario?
5. What integration assumption remains if each narrower boundary passes separately?
6. What artifact will explain a failure at this boundary?

This sequence discourages boundary selection by habit. “We use Playwright” is a tool choice, not a boundary rationale. “The UI is what the customer sees” is true but insufficient if the risk is a server rule that can be challenged more rapidly and clearly elsewhere. “The API is fast” is likewise insufficient if the decision concerns an inaccessible browser interaction.

## UI Automation: Valuable, but Not Obligatory

UI automation is appropriate where user-visible behaviour is part of the evidence claim. Chapter 5 established its strengths: it can observe interaction, route behaviour, browser state, rendering, and selected cross-system outcomes. Its costs include runtime, setup, dependency breadth, state sensitivity, and diagnostic ambiguity.

Do not use the UI simply because it can create all the prerequisite state. Registering a customer, creating an order, changing account status, and uploading a document through the UI may exercise a real journey, but those preparatory actions can obscure the scenario’s actual question. If the claim is “a renewal customer can view an accurate confirmation,” creating the renewal customer through a controlled data or API mechanism can make the browser evidence quicker and easier to interpret. It also removes the claim that the registration journey itself worked. That removed claim must be covered elsewhere if it matters.

A browser check can still be the correct setup route when setup is part of the risk. An account-recovery journey, for example, may need browser evidence from the initial request through the recovery UI. The decision is contextual. Separate “it is possible to use the UI” from “using the UI is necessary to establish this claim.”

## API and Service Automation in Part V

An **API boundary** exposes a software interface through which a client requests or observes behaviour. A **service boundary** is a focused boundary around a service or backend capability; in a particular architecture it may be exposed through an API, a message, a function, or another integration mechanism. The distinction matters less here than the evidence and ownership decision.

Part IV teaches whether API behaviour is correct and dependable. Part V uses API and service automation for system composition:

- establish a known account, order, entitlement, or feature state before a browser interaction;
- remove data after a run so later checks do not inherit it;
- observe a focused server-side post-condition after a browser action;
- create a controlled dependency condition that the browser needs to render or handle;
- obtain quick feedback for a focused rule while a thin browser journey protects user-visible integration; and
- make diagnostic context available without walking through unrelated UI screens.

Playwright’s official API-testing guidance gives a practical example: requests can prepare server-side state before a UI scenario or validate server-side post-conditions after browser actions.[^playwright-api] That is a capability, not an architecture prescription. The automation designer must still decide whether the API state is authoritative for the claim, how authentication and data ownership work, and which user-visible evidence is absent.

### Setup boundary versus evidence boundary

A **setup boundary** is the mechanism used to establish preconditions. An **evidence boundary** is the point at which the scenario makes the observation that supports its stated claim. They can be the same, but they need not be.

| Scenario responsibility | Illustrative boundary | What the choice means |
|---|---|---|
| Create a uniquely identified renewal account. | API or service setup. | The browser scenario starts with known state; it does not establish account-creation UX. |
| Select a delivery option and submit renewal. | Browser interaction. | The scenario observes a meaningful customer action. |
| Confirm an order reference and displayed renewal status. | Browser evidence. | The scenario establishes the selected user-visible outcome. |
| Confirm that the order entered an authoritative state. | API or service verification. | The scenario adds focused state evidence; it still does not establish every downstream effect. |
| Remove the created renewal. | API or service cleanup. | Cleanup protects later evidence; it is not proof of the primary workflow. |

Calling the whole flow an “API test” because API setup was used loses this distinction. Calling it a “browser-only test” because the customer interaction happened in a browser also loses useful information. Describe the composed claim and each boundary’s contribution.

### Verification boundary versus interaction boundary

The **verification boundary** is where the check makes the observation it uses to judge an expectation. It too may differ from the interaction boundary. A customer may submit a renewal through the browser, receive a confirmation in the browser, and have the authoritative order state checked through a service query. This can be responsible when the risk includes both customer feedback and persisted state.

Avoid turning every browser action into a second API assertion. Duplicate verification has a cost. It can create brittle coupling, slower feedback, and a false belief that two observations prove the same thing. Add a verification boundary only when it challenges a distinct, consequential assumption. For example:

- UI confirmation checks what the customer is told;
- service verification checks whether the selected order reached a defined state;
- a payment-provider callback check may challenge a separate external integration assumption.

The final item may be unnecessary in routine feedback if a controlled provider response provides enough focused evidence and representative integration is exercised at a different cadence. State the limitation instead of pretending one hybrid flow answers every question.

## Component Automation: Controlled UI Evidence

**Component automation** exercises an isolated or deliberately composed user-interface component with controlled inputs, dependencies, and rendered output. It can give fast evidence that a component represents selected states correctly and handles specified interactions. It is particularly useful when a UI concern is important but does not require a full route, account session, or integrated backend.

For Atlas, a renewal-status panel could be rendered with a paid, pending, rejected, or delayed payment state. A component check can establish that the panel communicates the selected state, exposes a meaningful control, or handles a retry action in a defined way. This can be quicker and clearer than creating every condition through a representative payment provider and navigating a full browser journey.

The limitation must remain explicit. The component may receive a controlled input that the deployed service never sends because of a mapping error. It may render correctly while routing, authentication, feature configuration, styles, or browser-specific behaviour fail in the running application. Component automation is not a miniature E2E test. It is a focused evidence boundary.

Do not prescribe a frontend framework or component-testing harness. The transferable design questions are:

- What component responsibility matters to a user-visible outcome?
- Which input states are controlled, and which real integration behaviours are thereby excluded?
- Which interaction is meaningful at this scope?
- What accessibility, visual, or browser evidence still requires another form of evaluation?

## Service-Level Automation: Focused Behaviour and State

Service-level automation can establish a focused rule, state transition, integration-handling path, or observable service outcome. It often gives clearer diagnosis than a browser path because it eliminates client rendering and UI setup from the immediate result. It can be a strong place to challenge renewal eligibility, address-transfer behaviour, idempotent processing, or defined handling of a dependency failure.

This chapter uses **idempotent** in its common engineering sense: repeating an operation with the same intended input does not create an unintended additional effect after the first successful application. Whether a particular API or service is idempotent, and under which contract, is Part IV territory. Part V asks how an automation system can use a known service behaviour without making unsupported assumptions about it.

Focused service evidence does not remove the need for browser evidence when the risk is user-visible. A service can return an eligible-renewal state while the UI hides the renewal option, fails to render the reason, or loses the selected account after navigation. The two boundaries complement each other when they challenge different assumptions.

## Designing Hybrid Workflows

A **hybrid workflow** is an automation flow that deliberately combines more than one boundary for setup, interaction, observation, verification, or cleanup. It should not be a vague synonym for “end-to-end.” Its value comes from explicit allocation.

Two compact patterns are often useful:

| Pattern | Illustrative flow | Evidence contribution | Stated limitation |
|---|---|---|---|
| **API setup → browser action → browser verification** | Create a renewal-ready customer; submit renewal through the UI; observe a customer confirmation. | Efficient state preparation plus user-visible evidence. | Does not establish the registration UI or authoritative post-condition unless separately observed. |
| **Service setup → component or browser evidence → service cleanup** | Create a controlled payment response; render or exercise the renewal UI; remove the owned data. | Controlled handling of a meaningful UI condition. | Does not establish representative provider behaviour. |
| **Browser action → API verification** | Submit an address change in the UI; observe that the authoritative order state changed. | User interaction plus focused persisted-state evidence. | May still exclude downstream fulfilment or notification outcomes. |

These patterns are examples, not required architectures. A hybrid flow becomes harmful when it carries unrelated setup, has an unclear primary claim, duplicates assertions without new information, or hides the fact that a dependency is controlled. A flow should be readable enough that an engineer can point to each boundary and explain why it exists.

### The MSQE Boundary Composition Matrix

The following **MSQE Boundary Composition Matrix** is an educational framing, not an industry standard or a tool configuration:

| Decision element | Question to answer |
|---|---|
| **Risk and decision** | What failure or uncertainty could influence a product, delivery, or engineering decision? |
| **Primary evidence boundary** | Where can the key outcome be observed credibly? |
| **Setup mechanism** | What creates the required precondition, and what evidence does that mechanism not provide? |
| **Interaction boundary** | Where is the meaningful user or system action performed? |
| **Verification boundary** | Where is each distinct expectation observed? |
| **Dependency mode** | Which dependencies are real, controlled, represented, or absent? |
| **Artifacts** | What will help explain an unexpected result? |
| **Limitation and residual risk** | What important behaviour or condition remains unchallenged? |

Use the matrix to make a composition review specific. It prevents a team from adding APIs, components, and browser checks simply because the tools are available. It also makes the portfolio more maintainable: a changed service state can be traced to the checks that intentionally depend on it, rather than causing a broad, mysterious E2E failure.

## Evidence Duplication and Boundary Gaps

Evidence duplication is not always waste. A browser confirmation and an API post-condition can challenge different assumptions. It becomes waste when two checks repeat the same observation at different boundaries without a reason, or when one expensive check contains a long chain of assertions already challenged more clearly elsewhere.

Ask what each item adds:

| Portfolio pattern | Potential value | Potential problem |
|---|---|---|
| Focused service rule plus one browser journey. | Rule feedback is quick; browser integration remains visible. | The browser journey may repeat every rule rather than retain its distinct user-visible claim. |
| API setup plus browser assertion. | Faster, attributable preconditions. | The API setup can hide a broken customer path that still matters. |
| Component rendering plus browser flow. | Controlled UI-state evidence and selected integrated evidence. | Controlled inputs can diverge from live service mapping. |
| Separate UI and API suites. | Each can be clear at its own boundary. | A hand-off assumption between them may never be challenged. |

A **boundary gap** is an untested or unobserved assumption at the connection between otherwise tested boundaries. For example, service tests can show that an order is created and component tests can show that a confirmation panel renders a given model, while no evidence establishes that the running browser route receives the created order and supplies the right model to the panel. A thin integrated scenario may be appropriate to challenge that gap.

Do not respond by joining every check into a full-system journey. Identify the specific hand-off, select a credible integration observation, and decide how frequently that evidence is needed. That is more sustainable than treating “end-to-end” as a synonym for complete.

## Controlled Dependencies and Representativeness

Composition often uses **controlled dependencies**: deliberately predictable substitutes, responses, or states used to exercise a condition. A controlled payment rejection can make a browser error message deterministic. A represented inventory service can make a component state repeatable. Such control is valuable when it isolates a hypothesis or allows a consequential user-visible condition to be observed safely.

Control changes the evidence. It may show that the application handles the selected response as designed, but it does not show that the real provider’s authentication, latency, data quality, or failure mode behaves the same way. A representative dependency path may challenge those assumptions, but it can be slower, costlier, less deterministic, and constrained by third-party limits.

The appropriate portfolio can include both. State when each is used, which decision it supports, and what it does not prove. This avoids two familiar errors: dismissing controlled evidence as useless because it is not fully realistic, or using it to claim that every integrated condition has passed.

## Test Pyramids and Shapes as Contextual Heuristics

Test pyramids, honeycombs, trophies, and other visual suite models can stimulate useful conversation about feedback cost and boundary breadth. They are heuristics: simplified ways to reason about a portfolio. They are not standards, maturity scores, or universal percentage targets.

An architecture with a small browser layer and many focused checks may be sensible for a frequently changing web product. Another system may need a different distribution because its main risk is cross-system workflow, hardware interaction, client rendering, regulation, or dependency behaviour. The decision should follow evidence needs, not an image of the “correct” shape.

When a team uses a model, ask what it hides. Does it show which checks are consequential? Does it distinguish setup from evidence? Does it represent exploratory and production evidence that automation cannot replace? Does it make dependency and environment cost visible? If not, treat it as a conversation starter, not a design verdict.

## Maintainability Trade-offs

Boundary choice changes the cost of an automation system. The following trade-offs should be made explicit:

- **Runtime:** Browser journeys commonly cost more than focused API, component, or service observations; long setup increases this further.
- **Diagnosis:** A narrow failure may isolate a rule; a hybrid failure may need artifacts showing which boundary first diverged.
- **Data:** API or service setup can create owned state quickly, but needs permissions, cleanup, and realistic enough data assumptions.
- **Dependency breadth:** Real integrated paths can increase confidence for a selected risk while also increasing environmental and third-party failure modes.
- **Maintenance:** A stable interaction contract and clear composition can reduce repair cost; unowned helpers that silently span boundaries increase it.
- **Representativeness:** Controlled inputs improve determinism but may exclude production variability that requires selected representative evidence.

There is no automatic winner. An Automation Engineer communicates these trade-offs to the people making product and delivery decisions. The goal is not maximum speed or maximum realism in isolation. It is timely, credible, understandable feedback for the decision at hand.

## QA → QE Transition

The script-focused question is, “How can I automate this scenario from beginning to end?” The engineering question is, “Which parts of this scenario need user-visible evidence, which setup and verification boundaries make the result interpretable, and which integration assumption remains?”

| Single-boundary habit | Deliberate evidence composition |
|---|---|
| Use the UI to create every precondition. | Use the UI where the setup itself is a risk; otherwise choose a controlled, attributable setup boundary. |
| Call an API because it is faster. | Use an API when its setup or verification contribution is explicit and its limitation is stated. |
| Repeat the same expected result at every layer. | Add a boundary only when it challenges a distinct consequential assumption. |
| Treat a hybrid flow as proof of everything. | Record its setup, interaction, verification, dependency mode, artifacts, and residual risk. |
| Pick a suite shape by convention. | Select a portfolio based on risk, decision timing, diagnosis, and maintainability. |

This is an expansion of existing QA skill, not a rejection of it. Engineers who know how to test a browser workflow, call an API, and diagnose a service failure already possess important ingredients. Quality Engineering adds the ability to allocate those ingredients deliberately and communicate the resulting evidence limits.

## Engineering Perspective

Composition is an architectural decision. It should be reviewed with the same care as an interface or dependency choice because it affects runtime, state ownership, failure attribution, artifact policy, and maintenance. A well-composed scenario can fail with an intelligible message: “The UI accepted renewal order `R-4821`; the customer confirmation was visible; the authoritative renewal remained pending under a controlled payment delay.” A poorly composed scenario reports only “checkout failed,” leaving every boundary suspect.

Keep cross-boundary helpers narrow. A helper that secretly creates data, changes a feature flag, opens a browser, calls three services, asserts a response, and deletes a record may reduce visible lines while obscuring the evidence architecture. Prefer explicit lifecycle responsibilities and a readable scenario that reveals its primary claim. Chapter 3’s abstraction rule applies: create an abstraction only when it makes a repeated responsibility clearer and safer.

## Industry Perspective

Current Playwright documentation provides one practical example of composition: its API request facilities can establish server-side preconditions before browser activity and validate post-conditions after it.[^playwright-api] Its component-testing documentation shows a separate, controlled component boundary for supported front-end environments.[^playwright-components] These capabilities make hybrid designs feasible, but they do not decide whether a hybrid design is justified.

The transferable industry practice is separation of responsibilities. Mature automation systems use focused boundaries to improve feedback and retain selected integrated evidence for the assumptions only a broader flow can challenge. The result should be a portfolio of claims, not a contest between UI, API, and component tools.

## Common Misconceptions

### “UI automation is the only evidence that matters because users do not call APIs.”

Users experience the UI, but customer risk can arise from rules, data, or service state that a focused lower boundary can challenge faster and more clearly. Retain browser evidence where it is necessary; do not burden it with every rule.

### “API setup makes the test an API test.”

Setup and evidence are different responsibilities. An API-created precondition can support a browser claim without establishing that the API’s customer-facing behaviour is correct.

### “A browser action verified by an API proves the whole workflow.”

It adds a distinct observation, but can still omit downstream effects, external dependencies, user comprehension, and conditions outside the selected scope.

### “Component tests replace integrated UI automation.”

Component checks can provide fast controlled rendering evidence. They do not prove the deployed route, authentication, service mapping, browser behaviour, or customer workflow.

### “The test pyramid tells us the right number of tests at each level.”

It is a contextual heuristic. A defensible portfolio follows the system’s risks, evidence needs, feedback costs, and constraints—not a fixed ratio.

### “Controlled dependencies make the evidence invalid.”

They make a focused condition interpretable. Their limitation is that representative dependency behaviour is not being observed, which should be covered or accepted explicitly elsewhere.

## Summary

No automation boundary is universally best. UI, API, component, and service boundaries each provide different evidence and impose different costs. A sustainable automation system composes them deliberately: it separates setup from the primary evidence claim, chooses a verification boundary when it adds distinct value, exposes dependency modes, avoids unnecessary duplication, and identifies integration gaps that need thin broader evidence.

Composition does not mean turning every scenario into a complex multi-tool flow. It means allocating responsibility so that each check is clearer, faster where appropriate, and more diagnosable. The next challenge is whether those carefully composed checks remain independent when they execute together against imperfect environments.

## Key Takeaways

- UI, API, component, service, and hybrid automation are evidence choices, not a universal hierarchy.
- State the risk and evidence claim before choosing a boundary.
- Setup, interaction, evidence, verification, and cleanup may occur at different boundaries.
- API or service setup can strengthen browser feedback without turning a browser scenario into an API-quality test.
- Add a verification boundary only when it challenges a distinct consequential assumption.
- Component and service checks provide focused evidence but leave integration and user-visible gaps that should be explicit.
- Hybrid workflows are valuable when their responsibilities and limitations are clear; they are not a default meaning of end-to-end.
- Controlled dependencies improve focused, deterministic evidence but reduce representativeness in stated ways.
- Test shapes are contextual heuristics, not mandated coverage ratios.
- Deliberate composition improves runtime, diagnosis, data ownership, and maintenance when it remains readable.

## Review Questions

1. Why is no automation boundary universally best?
2. Distinguish setup, interaction, evidence, verification, and cleanup boundaries using one customer scenario.
3. What browser evidence might be lost when all setup moves to an API?
4. When is API or service verification after a browser action justified, and when is it duplication?
5. What can a component check establish that a service check cannot? What does it still leave unknown?
6. Define a boundary gap and give an example where separate UI and API suites could miss one.
7. How does a controlled dependency change the evidence claim?
8. Why should test-pyramid models not be used as universal percentage targets?
9. Which maintainability trade-offs should be reviewed before creating a hybrid flow?
10. What is the difference between a long E2E scenario and a deliberately composed automation workflow?

## Interview Questions

1. How would you reduce a browser-only suite that takes hours to run without losing essential customer evidence?
2. How do you decide whether data should be created through a UI, API, service, or fixture?
3. Describe a case where API verification after a UI action improves evidence rather than just adding duplication.
4. How would you explain a component test’s limits to a release owner?
5. What would you look for when a service suite and browser suite both pass but a customer integration problem still occurs?
6. How would you review an abstraction that silently crosses UI, API, and service boundaries?

## Practical Exercise

### Design a Multi-Boundary Automation Strategy

**Objective:** Produce an **Automation Boundary Composition Matrix** for an illustrative Atlas Commerce change. Allocate evidence responsibilities without implementing a test suite.

**Scenario:** Atlas is changing subscription renewal. Candidate scenarios include: customer login and access to renewal; creation of a renewal-ready order; payment status handling; rendering of a pending or rejected renewal; a support-agent change to customer eligibility; customer confirmation after a browser action; and cleanup of generated state. The payment provider can be represented for focused handling evidence, but a separate representative integration path exists with limited availability. The customer’s browser route sometimes displays a different state from the service record after asynchronous processing.

**Constraints:** All Atlas systems, accounts, providers, and outcomes are fictional. Do not write automation code, make an API call, create fixtures, configure a framework, or prescribe a fixed test-pyramid ratio. Part IV remains responsible for API-quality strategy. State the limitation of every controlled or represented dependency.

**Tasks:**

1. For each candidate scenario, identify the risk, decision consumer, primary evidence boundary, and why that boundary is credible.
2. Choose a setup, interaction, verification, and cleanup boundary where relevant. State which responsibilities deliberately remain at the browser boundary.
3. Identify two focused service or component checks that reduce unnecessary browser work, and state the browser or integration evidence each does not provide.
4. Design one thin hybrid flow using API or service setup, a meaningful browser action, and a justified verification boundary. Define its artifacts and limitations.
5. Identify two examples of harmful evidence duplication and two boundary gaps the portfolio must still challenge.
6. Decide which payment-provider conditions should be controlled and which should use representative integration evidence. State timing, diagnostics, and residual risk.
7. Assess runtime, data ownership, dependency breadth, diagnosis, and maintenance trade-offs. Explain one decision that you would revisit if the product’s risk changed.
8. Write a concise portfolio rationale for a release owner that distinguishes what the composition establishes from what still requires exploratory, specialist, or representative evidence.

**Expected artifact:** A four-page **Automation Boundary Composition Matrix** with a scenario allocation table, one hybrid-flow rationale, dependency-mode decisions, evidence gaps, artifact policy, maintenance trade-offs, and residual-risk statement.

**Reflection:** Which boundary choice appears fastest but would make a misleading claim? Which additional observation gives genuinely new evidence rather than an expensive duplicate?

**Portfolio relevance:** This artifact demonstrates that you can allocate automation responsibilities across boundaries while protecting both evidence credibility and maintainability.

## Further Reading

- [Chapter 1 — Automation Engineering: Purpose, Evidence, and Boundaries](chapter-01-automation-engineering-purpose-evidence-and-boundaries.md) — evidence selection and automation limits.
- [Chapter 3 — Reusable Automation Design: Abstractions, Fixtures, and Test Data](chapter-03-reusable-automation-design-abstractions-fixtures-and-test-data.md) — lifecycle and setup design.
- [Chapter 5 — Browser Automation as an Engineering System](chapter-05-browser-automation-as-an-engineering-system.md) — user-visible browser evidence and interaction contracts.
- [Part IV — API Quality Engineering](../../part-04-api-engineering/README.md) — API-quality strategy, contracts, and stateful API behaviour.
- Playwright, [API testing](https://playwright.dev/docs/api-testing) and [Component testing](https://playwright.dev/docs/test-components) — bounded tool-specific material for future practical work.
- Google Testing Blog, [Just Say No to More End-to-End Tests](https://testing.googleblog.com/2015/04/just-say-no-to-more-end-to-end-tests.html) — an industry perspective on the cost of broad test paths.

## References

[^playwright-api]: Microsoft. [API testing](https://playwright.dev/docs/api-testing). Playwright documentation. Accessed 2026-08-10.
[^playwright-components]: Microsoft. [Component testing](https://playwright.dev/docs/test-components). Playwright documentation. Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Select UI, API, component, service, or hybrid boundaries from an explicit evidence need.
- [ ] Distinguish setup, interaction, evidence, verification, and cleanup responsibilities.
- [ ] Use API or service setup without overclaiming API-quality evidence.
- [ ] Identify evidence duplication and boundary gaps in an automation portfolio.
- [ ] Explain the representativeness limit of controlled dependencies.
- [ ] Design a thin hybrid flow with a clear claim, artifacts, and residual risk.

**Previous:** [Chapter 5 — Browser Automation as an Engineering System](chapter-05-browser-automation-as-an-engineering-system.md)
**Next:** [Chapter 7 — Parallelism, Isolation, and Environment Strategy](chapter-07-parallelism-isolation-and-environment-strategy.md)
