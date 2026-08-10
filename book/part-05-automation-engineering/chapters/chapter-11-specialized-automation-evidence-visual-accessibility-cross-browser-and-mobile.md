# Chapter 11 — Specialized Automation Evidence: Visual, Accessibility, Cross-Browser, and Mobile

## Metadata

| Field | Value |
|---|---|
| Part | Part V — Automation Engineering |
| MQE-BOK domain | Automation Engineering |
| Chapter | 11 |
| Audience | QA Engineers, Automation Engineers, SDETs, and Quality Engineers |
| Prerequisites | Chapters 1–10; browser boundaries and diagnostics from Chapters 5 and 8 |
| Estimated study time | 95 minutes |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Specialized automation extends an evidence portfolio; it does not turn a partial signal into complete assurance.

## Opening Story

The following illustrative scenario concerns Atlas Commerce. A redesigned checkout passes its browser and API checks. A visual comparison reports a changed button position, so a contributor accepts the new snapshot without review. An automated accessibility scan reports no detectable violations. Days later, customers using a narrow viewport cannot reach the payment action, keyboard focus disappears in a promotional panel, and one supported browser renders a discount label over the total.

Atlas did not lack automation. It misinterpreted specialized signals as approval. This chapter helps the team select visual, accessibility, browser, and mobile-oriented evidence for the risks they can address while preserving the human evaluation and real-device uncertainty they cannot remove.

## Introduction

Specialized automation often attracts absolute claims: visual comparison will protect the design, automated accessibility will make the page accessible, device emulation will cover mobile, or a browser matrix will establish compatibility. Each can provide valuable evidence. None establishes the whole quality attribute suggested by its name.

This chapter is a strategy chapter, not a tutorial for snapshot tooling, accessibility scanners, browser-cloud providers, or native mobile frameworks. It develops selection, baseline ownership, variance control, human review, and limitation awareness. Accessibility expertise, inclusive design, native mobile engineering, and complete usability evaluation remain broader disciplines.

## Why This Chapter Matters

Specialized evidence is expensive when it is run without purpose and dangerous when it is over-interpreted. Visual baselines can produce noise; automated accessibility findings can be mistaken for assurance; exhaustive compatibility matrices can become unmaintainable; emulation can hide device-specific behavior. A mature automation system chooses these methods because a known risk warrants their evidence and records what remains uncertain.

The chapter extends Chapter 5’s browser evidence boundary and Chapter 9’s feedback selection. It does not replace human accessibility review, product design review, usability research, or real-device investigation.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain what visual comparison, automated accessibility checks, browser coverage, and emulation can establish;
- define baseline ownership, review, masking, and variance controls for visual evidence;
- distinguish detectable accessibility issues from accessibility assurance;
- select a risk-based browser and device portfolio without Cartesian expansion;
- explain the difference between responsive emulation and real-device evidence; and
- communicate exclusions, false-positive risk, human-review needs, and residual uncertainty.

## Visual Automation Is Comparison Evidence

Visual automation compares a rendered result with an approved **baseline** or reference image. It can reveal an unexpected visible difference in a defined browser, viewport, rendering environment, and state. It does not establish semantic correctness, usability, accessible interaction, meaningful content, or that a change is wrong. A changed visual may be an intended product decision, an environment artifact, or a defect.

### Deterministic rendering and baselines

Visual comparison becomes useful when conditions are controlled: browser and version, viewport, fonts, theme, locale, content, time, network behavior, animation state, and dynamic data. Perfect determinism may be impossible, but unmanaged variance converts meaningful review into noise.

The baseline is a product-and-engineering decision artifact. Give it an owner, a source of approval, a rationale for the covered state, and a reviewable update path. Never teach “update snapshots until green.” A baseline update accepts a new reference; it must be reviewed as carefully as any other changed expectation.

### Thresholds, masking, and review

A **difference threshold** is the configured tolerance for rendering differences. Too strict a threshold produces alert noise from harmless variation. Too tolerant a threshold can hide a visible regression. There is no universal percentage because product risk, rendering control, and the relevant UI differ.

Mask genuinely dynamic regions only when their visual content is not the claim under review. Masking an advertisement timestamp may be reasonable; masking the total price or a status indicator could conceal the very defect the comparison should reveal. Store the reason with the mask and review it when the interface changes.

## Accessibility Automation Provides Partial Evidence

Automated accessibility checks can identify some detectable issues, such as certain missing names, roles, structural relationships, markup patterns, or contrast problems, depending on the rule set and rendered state. They are valuable early signals and useful regression controls for a known class of violation.

They do **not** provide accessibility assurance. Automated checks cannot replace keyboard evaluation, screen-reader evaluation, cognitive and usability judgement, examination of task completion, or human accessibility review. The W3C Web Content Accessibility Guidelines describe success criteria; conformance evaluation requires more than scanning.[^wcag]

### Accessible locators are not accessibility proof

Chapter 5 recommends user-facing locator contracts where appropriate. A locator that finds an accessible name can be a helpful signal that the name exists. It does not establish that the name is meaningful in context, that focus order works, that announcements are understandable, or that a user can complete a task. Do not convert a testing convenience into a claim about user experience.

## Cross-Browser Evidence Must Be Risk-Based

Browser coverage should represent the customers, platforms, features, and rendering or interaction risks relevant to the product. A representative matrix may include a small set of supported engines, versions, viewport categories, and critical journeys. It should state the decision it supports and how it will be revised when customer use or product technology changes.

Avoid an exhaustive Cartesian matrix of every browser, version, locale, viewport, feature flag, and account type. It usually creates slow, costly, and weakly interpreted results. Expand coverage where a known engine difference, new browser API, payment flow, design dependency, customer population, or incident history justifies it.

Cross-browser success establishes behavior for the selected matrix, not compatibility with every browser or device. Public compatibility data can inform selection, but it does not replace product-specific evidence.[^mdn-compat]

## Mobile and Responsive Evidence

Responsive browser automation can exercise layout and interaction assumptions at selected viewport dimensions. **Device emulation** simulates characteristics such as viewport, user agent, and touch-oriented settings in a browser environment. It can efficiently find many responsive regressions and is a valuable development signal.

Emulation is not complete real-device confidence. Real devices add operating-system behavior, input methods, browser versions, hardware, network conditions, accessibility settings, installation state, and device-specific rendering characteristics. Choose real-device evidence where those differences are material to the decision. Native mobile automation is a separate technical boundary and is mentioned here only to make that limitation visible, not to begin an Appium or platform-framework tutorial.

## Select Specialized Evidence by Risk

Use specialized evidence when it changes a decision that general automation cannot address as well. The following questions support selection:

| Evidence type | Useful question | Important limit |
|---|---|---|
| Visual comparison | Did the selected rendered state change unexpectedly under controlled conditions? | It does not establish usability or semantics. |
| Automated accessibility | Did tooling detect a known class of rules violation in this state? | It cannot establish accessible task completion. |
| Cross-browser | Does this critical behavior work in the selected representative matrix? | It does not prove all compatibility. |
| Emulation | Does the interface behave at selected responsive conditions? | It does not replace real-device evidence. |

Consider risk, customer impact, frequency of change, environment control, diagnostic value, maintenance cost, and available human evidence. Specialized evidence belongs in the wider feedback portfolio of Chapter 9; it may run on pull request, schedule, release candidate, or targeted investigation depending on its purpose.

## Human Review, False Positives, and Safety

False positives consume review capacity and make people ignore meaningful failures. Visual noise, unstable rendering, scanner limitations, unsupported browser assumptions, and overly broad matrices can all reduce trust. Improve the underlying evidence design rather than lowering every threshold, accepting every baseline, or suppressing all findings.

Human review should be intentional. A design owner might review approved visual changes; an accessibility specialist or users with relevant experience may evaluate keyboard and assistive-technology behavior; product and engineering owners may choose browser coverage. Automation should provide safe, minimal artifacts and must not include credentials, personal data, access tokens, or proprietary production content.

## Visual Comparison in Practice

Visual comparison is particularly useful for visible changes that a functional assertion may not notice: spacing that obscures a control, a missing element, a layout shift, an unexpected rendering change, a clipped total, or a style regression in a stable customer-facing state. It is less useful when the relevant question is a calculation, an authorization rule, a meaningful description, or a user’s ability to understand and complete a task. The selected claim should say which of these it is.

### Baseline governance is part of the evidence

Baseline creation begins with a defined state and an accountable reviewer. Record the feature state, relevant viewport and browser conditions, whether data is synthetic and stable, and why the state deserves visual coverage. Store the reference in a reviewable location alongside the change rationale where practical; a baseline that cannot be traced to a decision is difficult to trust later.

When a legitimate product change alters the view, the reviewer should compare the old and new state, confirm the intended outcome with the relevant design or product owner, and record why the new baseline is appropriate. A baseline update may be correct even when it reveals a large difference. It is the explanation, not the size of the diff, that makes the acceptance safe.

Rendering variance needs deliberate control. Fonts, browser versions, viewport size, localization, time, asynchronous data, animations, browser engine differences, and device pixel density can all produce change that is visible to a comparison but irrelevant to the product decision. Freeze or control these factors where feasible. If a condition cannot be controlled, decide whether the resulting noise makes visual comparison unsuitable for that state.

### Worked visual example: the Atlas order dashboard

Atlas adds a new order-status panel to its support dashboard. A visual comparison detects that the intended status badge moved below the total; the design review confirms that the new layout is legitimate, so the baseline is updated with a rationale. On another run, the price total is clipped at a narrow viewport. This is a meaningful rendering defect: it is not masked or accepted because the comparison is specifically intended to protect the visibility of the total.

The panel also displays “updated 14 seconds ago.” The timestamp causes an expected difference. Atlas masks that small region, documents the reason, and keeps the surrounding status content visible. It does not mask the entire panel. If a later change makes the timestamp overlap the order status, the overly broad mask would hide a defect; this is why masking requires review.

The team considers increasing its threshold because anti-aliasing creates a small variation after a browser update. It first verifies browser version and fonts, then constrains the environment. A threshold may be justified for the remaining harmless rendering noise, but it must not be chosen merely to turn the result green. The useful question is whether the threshold could hide a difference that matters to the selected customer outcome.

## Accessibility Evidence and Human Evaluation

Accessibility automation can examine programmatically exposed aspects of a rendered page. Depending on the tool and rule set, it may detect certain missing accessible names, invalid relationships, structural issues, or some contrast and markup problems. This can make recurring defects visible early and can prevent regression of previously addressed concerns.

The W3C explains that accessibility evaluation combines tools with human evaluation.[^wai-evaluation] WCAG defines success criteria, but a passing rule set is not a declaration of complete conformance. A scanner may not exercise every state, understand whether instructions are clear, determine whether focus order is meaningful, or know whether a screen-reader announcement helps a person accomplish a task.

### Names, roles, and keyboard behavior

Accessible names and roles matter because assistive technologies use them to communicate purpose and relationship. They also give automation a more user-facing interaction contract than a CSS class or DOM hierarchy. Yet a correctly named button can still be placed after a confusing focus jump, invoke an inaccessible modal, or present an error message that is technically exposed but incomprehensible.

Automated keyboard actions provide some evidence: a test can move focus, activate a control, and check for a selected visible result. It cannot fully evaluate practical keyboard access without judging focus order, focus visibility, traps, timing, unexpected context changes, and whether a real user can understand the interaction. Screen-reader evaluation remains important because announcements, mode changes, content order, and component behavior vary by assistive technology and user workflow.

### Worked accessibility example: Atlas checkout

Atlas checkout contains an unlabeled promotion-code field, an error modal that returns focus to the page rather than its heading, a low-contrast informational label, and a confusing tab sequence that reaches a hidden marketing link before the payment action. An automated rule may detect the unlabeled field and some contrast issues. A DOM or keyboard-oriented check may identify that focus moves unexpectedly after the modal opens. These findings are useful and should be repaired.

Whether the modal’s error text is understandable, whether the focus sequence is meaningful to a customer completing payment, and whether the experience works with a screen reader require human evaluation. The correct conclusion after the automated checks pass is therefore: “No configured detectable violations were found in these states,” not “checkout is accessible.”

## Representative Cross-Browser Coverage

A browser engine is the rendering and execution technology underneath one or more browser products. Product versions, operating systems, settings, extensions, and device conditions can add behavior beyond an engine-level difference. A representative strategy therefore considers supported customer environments, observed traffic or contractual commitments, critical workflows, platform-specific APIs, historical defects, and the rate of browser change.

Select a small matrix that corresponds to a meaningful decision. For example, an order-confirmation change may receive focused coverage in the engines and versions used by the product’s supported customer population, while a release candidate receives broader coverage for payment, authentication, and responsive checkout paths. Expand after browser-specific incidents or when a new web capability has uneven support. Do not infer universal compatibility from a representative result.

Matrix explosion is a design warning. Combining every engine, version, locale, viewport, account type, feature flag, and product workflow produces an opaque, expensive portfolio. Use sampling with explicit rationale and revise it when customer evidence or risk changes.

## Mobile Evidence Has Several Boundaries

Mobile-related questions are often collapsed into one term, even though they exercise different conditions:

| Boundary | Can provide evidence about | Important limit |
|---|---|---|
| Responsive desktop browser | Layout at chosen viewport widths | Does not represent mobile browser or device behavior fully |
| Viewport and touch emulation | Selected viewport, user agent, and touch-oriented interaction assumptions | Simulates conditions rather than real device and OS behavior |
| Real mobile browser | Supported browser behavior on a selected device/OS context | Represents only the selected device and conditions |
| Native application | Native platform interaction and integration | Is a different automation discipline, outside this chapter |

Real-device evidence may reveal browser chrome effects, input behavior, OS settings, device permissions, hardware constraints, network variation, virtual keyboards, and device-specific rendering. Emulation is still valuable because it provides rapid, repeatable responsive feedback; it should be chosen for that strength, not described as complete device confidence.

## An Integrated Specialized-Evidence Decision

The following **MSQE Specialized-Evidence Selection Record** is educational framing. It helps a team document why it chose an extension and what remains outside its claim.

| Risk or assumption | Evidence type and conditions | Human review need | Limitation and residual risk |
|---|---|---|---|
| Checkout total becomes visually obscured at narrow width | Visual comparison at selected viewport and stable data | Review intentional baseline changes | Does not show usability across all devices |
| Promotion field lacks exposed purpose | Automated accessibility rule in selected checkout state | Evaluate instructions and task completion | Scanner does not establish accessible experience |
| Payment action regresses in a supported browser | Focused representative browser run | Review support matrix after incident | Other versions and devices remain untested |
| Mobile customer cannot reach confirmation control | Emulation plus selected real-device evidence | Assess practical interaction where risk warrants | Not complete coverage of all hardware/network conditions |

The record links specialized evidence to feedback timing. A narrow visual comparison may run during pull-request review; a broader browser matrix may be scheduled or used for release evidence; human accessibility evaluation may be planned before a high-risk checkout change is released. The timing follows the decision rather than a tool’s default behavior.

### Visual evidence: a complete reasoning path

An Atlas checkout design change increases payment-button spacing. The changed spacing is legitimate and should be approved through design and product review before the visual baseline is updated. The page also contains a date value that changes every run, the CI environment initially uses a different font than local development, and a discount badge has accidentally disappeared.

The team first normalizes the environment it can control: selected browser version, viewport, font availability, synthetic data, locale, time, and animation behavior. It masks the date value because it is dynamic and outside the visual claim, but it does not mask the discount panel. The missing badge is then a real regression. Only after that defect is repaired and the approved spacing change is understood does the team update the baseline with a rationale. A small tolerance may remain necessary for harmless rendering variance, but it is not a substitute for controlling the environment.

Common failure modes are baseline churn, where frequent unexplained updates destroy the reference’s meaning; over-masking, where a broad region hides an important defect; broad tolerance, where a comparison stops noticing meaningful differences; platform variance, where a mixed environment creates noise; and ambiguous ownership, where no person can approve a visual expectation. Each is an evidence-design problem, not a reason to accept snapshots until green.

### Accessibility evaluation matrix

The following table distinguishes detectable conditions from the wider evaluation that remains necessary. Tool capability varies; the table does not claim that every scanner detects every listed issue.

| Issue | Can automation contribute? | Human evaluation still needed? | Why |
|---|---|---|---|
| Missing accessible name | Often, in rendered states | Yes | A name can exist while remaining unclear or misleading |
| Duplicate ID or invalid relationship | Often | Sometimes | Structural detection does not establish task understanding |
| Low contrast | Often, where colors are computable | Yes | Context, images, states, and actual readability matter |
| Keyboard trap | Partially, through focused keyboard flows | Yes | Practical navigation and escape behavior need judgement |
| Confusing focus order | Partially | Yes | Meaningful order depends on task and content context |
| Unclear form error | Rarely in a complete way | Yes | Helpful language and recovery are human concerns |
| Screen-reader announcement quality | Limited | Yes, with assistive technology | Exposed semantics do not predict understandable announcements |
| Cognitive complexity | No reliable complete automation claim | Yes | Cognitive load and comprehension require human judgement |

Good semantic markup can improve locator stability because roles and accessible names express user-facing intent. Poor semantics are therefore both an accessibility concern and an automation-maintainability signal. The inverse does not hold: a test that can find a role does not prove complete accessibility, WCAG conformance, or a successful user experience.

### Worked browser selection

Assume Atlas has observed customer context showing 70 percent Chromium-based use, 20 percent Safari/WebKit, 8 percent Firefox, and 2 percent other environments. Payment has a prior Safari defect, while an internal admin workflow is desktop-only. These numbers are context, not a universal allocation formula. The checkout and payment path needs representative evidence across the browser contexts that matter to customers, with additional attention to the historical Safari risk. The desktop-only support-agent workflow may need a narrower desktop matrix. A browser upgrade, payment-provider change, or new customer platform can trigger review of the selection.

Avoid multiplication without purpose. Five browsers × four viewports × three account types × three environments × two locales yields 360 combinations. Executing all combinations may delay feedback and obscure what each result means. Representative selection should state why a combination is included, which risk it protects, what it excludes, and when broader execution is warranted. Pairwise or other combinatorial techniques may help in a context; they are not automatic proof that all important interactions have been covered.

### Mobile conditions and constrained selection

Desktop responsive mode establishes layout behavior at chosen viewport widths. Mobile-browser emulation adds simulated user-agent and touch-oriented conditions. A real mobile browser on a selected device exercises browser chrome, input, device pixel ratio, virtual keyboard, permissions, OS settings, hardware, and network conditions that emulation cannot fully reproduce. A native app is a different interaction boundary and remains outside this chapter.

Suppose Atlas can maintain one visual suite, two browser projects per pull request, broader nightly execution, and limited real-device access. Its customer population is mobile-heavy and checkout is accessibility-sensitive. A defensible strategy prioritizes the high-risk checkout path in the selected pull-request browser projects, reserves real-device access for a representative payment and confirmation investigation or release question, uses nightly breadth for additional browsers, and gives the visual suite a narrowly owned dashboard or checkout claim. It documents excluded devices and the residual risk rather than pretending the budget does not exist.

### Operating specialized evidence over time

Specialized evidence needs maintenance decisions just like other automation. A visual baseline becomes stale when the product state it represents no longer matters; a browser matrix becomes stale when supported-customer context or incident history changes; an accessibility rule set may need revision when the application introduces new component patterns; a real-device allocation may need review after a change in customer device use. These are portfolio changes, not one-time setup tasks.

Define a review trigger for each selection. A new browser-specific defect can expand the matrix. A repeated visual false positive can trigger environment investigation before threshold change. A human accessibility finding can reveal a gap that a scanner should complement but cannot close. A shift in mobile customer behavior can make a previously deferred real-device question decision-relevant. The result is an evidence system that responds to new learning rather than preserving a fixed checklist.

### Reporting specialized results responsibly

Reports should name the selected condition. “Visual suite passed” is weaker than “the approved checkout states matched their baselines in the selected browser, viewport, font, and synthetic-data conditions.” “Accessibility scan passed” is weaker than “no configured detectable violations were found in these selected states; keyboard and assistive-technology evaluation remain required.” This wording is not caution for its own sake. It tells a reviewer what changed, what was actually exercised, and where to seek the next evidence.

If results are noisy, do not hide the instability through automatic acceptance or broad suppression. Classify the source: dynamic content, uncontrolled rendering, unsuitable assertion boundary, incomplete rule, or actual regression. Then correct the condition or revise the portfolio’s claim. A trusted specialized signal is usually narrower and more interpretable than a large collection of unreviewed results.

### Choosing frequency without over-running evidence

Specialized checks do not have to share one frequency. A stable, high-value visual comparison for checkout may be useful on a pull request when its environment is controlled. A broader browser selection may be more useful after merge or on a schedule because it consumes scarce capacity and is intended to reveal compatibility drift. Automated accessibility rules can run where they give early feedback, while planned keyboard and assistive-technology evaluation belongs at a meaningful change or release-review point. Real-device investigation may be reserved for customer-critical flows, device-specific incidents, or a release decision with significant mobile risk.

The choice should name the consumer and decision. Running a check rarely is not an admission that it lacks value; running it frequently is not proof that it is valuable. A low-frequency result can be essential to a release discussion, while a fast pull-request signal can protect a narrow change assumption. The portfolio becomes more trustworthy when this timing is explicit and revisited as customer behavior, product change, and maintenance capacity evolve.

### Specialized evidence hand-offs

Some findings require a hand-off rather than another automated retry. A visual difference may need a design decision; a scanner finding may need accessibility expertise; a browser failure may need investigation of support policy or customer impact; a real-device issue may need product and engineering collaboration. Record the hand-off, question, evidence, owner, and next decision. This preserves the value of automation without asking it to perform specialist judgement it cannot supply.

The hand-off itself is evidence of responsible scope control: it makes the next source of learning visible instead of allowing a green automated result to close an unanswered question.

Over time, this record also helps teams see recurring limits. Repeated human findings after scanner passes, for example, may indicate a systematic evidence gap worth addressing through design practice, additional evaluation, or a revised automation selection—not a reason to overstate the scanner.

## QA → QE Transition

| Execution framing | Quality Engineering framing |
|---|---|
| “Run the visual suite.” | “Select visual comparison for states where a reviewed rendered difference informs a decision.” |
| “The accessibility scan passed.” | “The scan found no configured detectable violations; human accessibility evidence is still required.” |
| “Test every browser.” | “Use a representative, risk-based compatibility matrix and state its exclusions.” |
| “Emulation covers mobile.” | “Emulation provides responsive evidence; real-device uncertainty remains where it matters.” |

## Engineering Perspective

Specialized automation is most reliable when the evidence contract is explicit: selected state, owner, baseline or rule set, conditions, execution timing, artifacts, human review point, exclusions, and revision trigger. This makes failures actionable and prevents a passing signal from claiming more than it can establish.

## Industry Perspective

WCAG is a W3C recommendation and provides internationally recognized accessibility guidance, but it should not be reduced to a scanner output.[^wcag] Playwright documents visual comparison and device-emulation capabilities; their availability does not change the limitation of the evidence.[^playwright-snapshots][^playwright-emulation]

## Common Misconceptions

### “A new snapshot should be accepted when it makes the suite green.”

A baseline update is a reviewed change to an expectation, not a mechanical repair.

### “Automated accessibility checks certify accessibility.”

They detect only some issues under selected conditions and cannot replace human evaluation.

### “More browsers always mean more confidence.”

Unjustified matrix expansion can dilute attention and delay useful evidence. Select coverage by risk.

### “Device emulation is the same as a real device.”

It is a useful simulation boundary with important differences in software, hardware, and user context.

## Summary

Visual, accessibility, cross-browser, and mobile-oriented automation are targeted extensions of an evidence system. Their value comes from controlled conditions, explicit selection, reviewed baselines, representative coverage, human collaboration, and honest limits. They should reveal uncertainty, not hide it behind a passing badge.

## Key Takeaways

- Visual comparison establishes a rendered difference under defined conditions, not usability or semantic correctness.
- Baselines, masks, and thresholds require ownership and review.
- Automated accessibility checks are useful partial evidence, not accessibility assurance.
- Accessible locator success does not prove accessible experience.
- Browser and device coverage should be representative and risk-based.
- Emulation is valuable responsive evidence but not a substitute for real-device evidence.
- Specialized results belong in a wider evidence portfolio with stated limitations.

## Review Questions

1. What claim can a visual comparison legitimately make?
2. Why does a baseline need ownership?
3. What human evidence remains necessary after an accessibility scan passes?
4. How would you choose a browser matrix for a checkout change?
5. When should a dynamic region be masked, and when should it not?
6. What uncertainty remains after responsive emulation passes?

## Interview Questions

1. How would you prevent snapshot testing from becoming “accept until green”?
2. How do you explain accessibility automation limits to a delivery team?
3. Describe a risk-based cross-browser strategy for a customer-critical flow.
4. When would you require real-device evidence instead of emulation?

## Practical Exercise

### Design a Specialized Automation Evidence Strategy

The following is an illustrative Atlas Commerce exercise. Atlas is redesigning its promotion and checkout experience. The team supports several browser engines, serves customers on narrow viewports, and has a prior incident involving an inaccessible payment-control focus order.

Create a **Specialized Automation Evidence Plan** that identifies what merits visual comparison, baseline ownership, controlled rendering conditions, automated accessibility checks, required human evaluation, browser coverage, mobile/emulation coverage, exclusions, false-positive risks, and residual uncertainty. Explain why each evidence type runs at its chosen feedback point. Do not propose implementation code.

## Further Reading

- [W3C Web Accessibility Initiative](https://www.w3.org/WAI/)
- [W3C: Evaluating Web Accessibility Overview](https://www.w3.org/WAI/test-evaluate/)
- [MDN Browser compatibility data](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Compatibility_tables)
- [Playwright: Visual comparisons](https://playwright.dev/docs/test-snapshots)

## References

[^wcag]: W3C. [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/). Accessed 2026-08-10.
[^wai-evaluation]: W3C Web Accessibility Initiative. [Evaluating Web Accessibility Overview](https://www.w3.org/WAI/test-evaluate/). Accessed 2026-08-10.
[^mdn-compat]: MDN Web Docs. [Browser compatibility data](https://developer.mozilla.org/en-US/docs/MDN/Writing_guidelines/Page_structures/Compatibility_tables). Accessed 2026-08-10.
[^playwright-snapshots]: Microsoft. [Playwright: Visual comparisons](https://playwright.dev/docs/test-snapshots). Accessed 2026-08-10.
[^playwright-emulation]: Microsoft. [Playwright: Emulation](https://playwright.dev/docs/emulation). Accessed 2026-08-10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] state the valid claim and limitation of each specialized evidence type;
- [ ] design reviewed visual baselines and variance controls;
- [ ] explain why automated accessibility is partial evidence;
- [ ] choose a representative browser and device portfolio; and
- [ ] make residual uncertainty visible to decision-makers.

**Next:** [Chapter 12 — Capstone: Quality Automation System](chapter-12-capstone-quality-automation-system.md)
