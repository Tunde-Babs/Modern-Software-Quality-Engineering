# Chapter 10 — Security Evidence: Findings, Verification, and Residual Risk

## Metadata

| Field | Value |
| --- | --- |
| Part | Part X — Performance & Security Engineering |
| MQE-BOK domain | Domain 10 — Performance & Security Engineering |
| Chapter | 10 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 7–9 |
| Estimated study time | 210 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A finding is a claim about evidence. Verification establishes what the finding means for the stated system boundary; it does not make uncertainty disappear.

## Opening Story

The following is an **illustrative scenario**. A synthetic security scan reports a possible authorization issue and a dependency concern for Atlas. A reviewer verifies the authorization report with a synthetic actor and finds that the stated route does permit an action that should be denied. The dependency report refers to a component not included in the current synthetic configuration. A third area has no finding, but the team has not exercised the relevant state transition.

Forwarding all three records as identical “vulnerabilities” would be misleading. One is a verified issue. One is rejected for the current boundary. One is a coverage limitation. Security evidence needs a lifecycle that preserves those differences and connects remediation to re-verification and residual risk.

## Why This Chapter Matters

Security evidence is incomplete by nature. A tool can generate leads; manual review can validate or reject them; a clean result can still leave false-negative or coverage risk. Severity and exploitability need affected-asset, exposure, control, and consequence context. Remediation needs evidence that the intended boundary now behaves differently, plus a regression plan.

This chapter does not disclose real vulnerabilities, prescribe offensive reproduction, or treat a scanner score as a universal decision rule. It prepares verified evidence for Chapter 11 trade-offs and Chapter 12 synthesis.

## Learning Objectives

By the end of this chapter, you should be able to:

- distinguish a finding, verified issue, rejected lead, evidence gap, and residual risk;
- assess severity, exploitability context, affected asset, and exposure without relying on one score;
- plan safe reproduction and remediation verification using synthetic evidence;
- define regression, ownership, escalation, and revision triggers; and
- create a Security Finding and Remediation Verification Record.

## The Security-Evidence Lifecycle

```text
Finding
    → evidence and scope check
    → interpretation and safe verification
    → remediation claim
    → re-verification
    → regression control
    → residual risk and decision
```

A **finding** is an observation or report requiring interpretation. A **verified issue** is supported by evidence for the stated boundary. A **rejected lead** does not apply under the available boundary and evidence; it is not proof that a whole class of issue is absent. A **false negative** is an issue not identified by the method. Teams cannot count all false negatives directly in ordinary practice, but they can record coverage limitations, assumptions, and independent evidence sources.

| Evidence state | Meaning | Appropriate action |
| --- | --- | --- |
| Verified | The stated control or boundary behaves contrary to the claim | Assign remediation owner; assess affected scope and decision consequence |
| Rejected | Available evidence does not support the report for this boundary | Record why; retain a revision trigger if configuration or scope changes |
| Unresolved | Evidence is insufficient or conflicting | Bound the risk, assign further verification, avoid unsupported closure |
| Coverage limitation | The method did not assess a relevant population, route, or state | Record residual risk and proportionate expansion or escalation |

## Worked Reasoning: Atlas Finding Lifecycle

The following is an **illustrative, synthetic record**. A scanner-like report suggests that a support role may initiate a refund. Safe verification uses a synthetic support identity and a synthetic order. The route returns success and changes the refund state. A separate dependency report names an unused synthetic component. A planned role/state combination has not yet been assessed.

| Field | Record |
| --- | --- |
| Finding | Possible support-role refund authorization issue |
| Fact/evidence | Synthetic support actor completed the stated refund action; order state changed |
| Interpretation | The defined route violates the intended support-role authorization claim |
| Severity/context | Financial state transition affects customer and business integrity; exposure is limited to the stated role/route pending scope assessment |
| Limitation | Does not establish every route, role, order state, or production configuration |
| Remediation claim | The authorization decision will enforce role/action/state rules at the relevant boundary |
| Re-verification | Repeat the defined deny case and relevant allowed cases; confirm unchanged state on denial |
| Regression control | Add the boundary to the versioned access-control evidence matrix |
| Owner/escalation | Application owner remediates; designated security/release role receives the decision record |
| Residual risk | Other untested routes and states remain outside the verified boundary |

The unused-component report is recorded as rejected for the current configuration, with its scope and revision trigger. The untested role/state combination is a limitation, not a clean result. This precision prevents both unnecessary alarm and premature closure.

## Worked Numerical Interpretation: A Bounded Finding Sample

The following is an **illustrative, synthetic sample** used only to show how to calculate and communicate verification outcomes. A review considers 12 scanner-reported items within one Atlas build, configuration, route set, and test window. Seven are verified for their stated boundaries, three are rejected for the current evidenced configuration, and two remain unresolved because a necessary synthetic dependency condition is not available.

| Calculation | Method | Result | What the result does and does not mean |
| --- | --- | --- |
| Verified share | `7 ÷ 12 × 100` | `58.3%` | Seven reports were verified in this bounded sample; it does not measure all issues in the product. |
| Rejected share | `3 ÷ 12 × 100` | `25.0%` | Three reports did not apply to the current evidenced boundary; they may become relevant after change. |
| Unresolved share | `2 ÷ 12 × 100` | `16.7%` | Two reports need further evidence; they are not automatically false positives or confirmed issues. |

The shares add to 100 percent after rounding. They are a summary of triage disposition, not a scanner-accuracy score, severity measure, vulnerability count, or security posture rating. The denominator is the reviewed sample, not every asset, route, state, dependency, or possible issue. A mature record preserves that limitation and uses the result to plan verification coverage, ownership, and decision conditions.

## Severity, Exploitability, and Context

Severity can describe potential impact, but a decision also needs exploitability context, affected population, exposure, existing controls, evidence confidence, and operational consequence. Do not use a severity label as the whole rationale. OWASP ASVS and OWASP materials can help structure verification questions, but they do not establish that a particular application is compliant or secure.[^owasp-asvs]

**Safe reproduction** means demonstrating the relevant behaviour in an authorized synthetic environment with the minimum evidence needed to support the claim. It does not mean publishing attack chains, scanning live targets, or handling real credentials. Preserve enough provenance to explain the result: build/configuration, synthetic actor, route, resource state, method, and window.

## Remediation Verification and Regression

Remediation verification asks whether the changed boundary now supports the intended claim. It should include expected deny and allowed behaviours where relevant, because a control that blocks everyone may “fix” one finding while breaking the legitimate journey. Version the remediation evidence and record what changed. A regression control identifies the assertion, matrix row, evidence record, or review trigger that should prevent a known boundary from silently reopening.

## Triage Without Treating a Tool as an Authority

Security tools, review procedures, and synthetic checks can all contribute evidence. Their output should be triaged in a way that keeps provenance and uncertainty intact. Do not begin by choosing a severity label. Begin by checking what system, version, configuration, actor, route, method, and evidence boundary the result actually names.

| Triage question | Why it matters | Example consequence |
| --- | --- | --- |
| What generated the finding? | A tool result, review observation, contract failure, or state record have different confidence and coverage | Preserve source/method rather than calling all outputs equivalent |
| Which version and configuration apply? | A finding can refer to an unused or changed component | Reject only for the evidenced current boundary; add revision trigger |
| Which asset and actor are affected? | Impact and urgency depend on the protected thing and reachable identity | Prioritize support refund authority differently from a non-sensitive display issue |
| Can the behaviour be verified safely? | Verification should produce the minimum synthetic evidence needed | Use synthetic role/resource/state evidence, not live or offensive procedure |
| Which controls or compensations exist? | Exposure may be narrowed but not eliminated | Record control scope and remaining gap |
| What is not covered? | A finding may not cover all routes, roles, clients, states, or versions | Record residual risk and follow-up ownership |

Triage can result in a verified issue, rejected lead, unresolved question, or coverage limitation. It should never silently erase the original report. A rejected lead remains useful provenance if a future configuration change makes it relevant again.

## Evidence Confidence and Decision Consequence

Evidence confidence is not a score that replaces professional judgement. It is a statement about method, repeatability, scope, corroboration, and limitation. A verified synthetic authorization violation may have high confidence for one route and low coverage for the broader access-control model. A dependency configuration report may have low relevance for the current environment but merit a revision trigger.

| Evidence characteristic | Stronger confidence for | Does not establish |
| --- | --- | --- |
| Reproducible synthetic actor/action/state result | The stated route and configuration | All related routes or production exposure |
| Re-verification after a code/policy change | The remediated bounded behaviour | Absence of other defects or design issues |
| Independent evidence sources | A converging explanation or priority | Complete coverage or causation by itself |
| Versioned environment and configuration | Applicability to the stated record | Continued applicability after later change |
| Explicit coverage map | Which boundaries were assessed | That unassessed boundaries are safe |

The decision consequence should match the confidence and impact. A high-consequence verified authorization issue can require immediate remediation or escalation even when its total scope is not yet known. A low-confidence configuration lead might justify a bounded check before it affects release scope. A coverage limitation may be accepted only when an accountable owner records the residual risk and reassessment condition.

## Remediation as a New Claim

“The defect is fixed” is not enough. A remediation claim states what changed and what evidence should now be true. For the Atlas support route, the claim might be: *Authorization v2 denies the synthetic support role's refund action for the stated order state, preserves state on denial, and continues to permit the scoped view action.*

Verification should then test the claim's positive and negative boundaries:

| Verification area | Expected evidence |
| --- | --- |
| Previously affected deny case | Support actor receives the defined denial; no refund state change or unauthorized event occurs |
| Legitimate allowed case | An appropriately authorized actor can perform the permitted action in the stated state |
| Scoped view | Support actor can still view minimum necessary order data where intended |
| Configuration/version | Build, policy/role configuration, route, cache assumption, and synthetic fixture are recorded |
| Regression control | Access-control matrix row or test charter is versioned and has a revision trigger |

An unsuccessful remediation result is valuable evidence. It may show that the rule is enforced only at one boundary, that a cache retains an action, or that the state transition remains reachable through another path. Record that outcome rather than closing the original finding prematurely.

## False Negatives and Coverage Strategy

False negatives cannot usually be counted directly because undiscovered issues are unknown. This does not make the concept useless. A team can reduce false-negative risk by using complementary evidence, reviewing assumptions, prioritizing high-consequence boundaries, revisiting changes, and recording coverage limits. It should not claim that multiple tools or tests prove absence of risk.

For Atlas, the support-refund verification can be complemented by role/action/state matrix review, route inventory, cache-boundary question, and service-account transition evidence. Each source has blind spots. Together they make the remaining gaps more visible.

## Escalation and Residual-Risk Communication

Escalation should present facts and choices, not merely a severity label. A concise escalation record includes the verified boundary, affected asset, evidence/source, scope and limitation, remediation status, possible decision consequence, owner, residual risk, and revision trigger. The recipient may be an engineering, security, product, release, privacy, or domain role depending on the decision. The Quality Engineer should avoid claiming legal or certification authority that the evidence does not grant.

### Example Escalation Record

| Field | Illustrative Atlas record |
| --- | --- |
| Fact | Synthetic support role initiated a refund through route R for paid order state S in candidate configuration v1. |
| Security claim | Support role must be denied this refund action while retaining its stated view permission. |
| Evidence/provenance | Synthetic role/action/state exercise, route/state observation, build and policy version. |
| Interpretation | A verified issue exists for the stated route and configuration. |
| Limitation | Other routes, service identities, cache nodes, and order states have not all been assessed. |
| Remediation status | Authorization v2 denies the stated action and preserves state in re-verification. |
| Residual risk | Coverage gaps remain; cache/route changes can reopen the conclusion. |
| Owner/decision | Application owner remediates; release/security owner decides required scope before promotion. |
| Revision trigger | Role, route, authorization policy, cache scope, state-transition, or configuration change. |

The record is actionable because it tells a recipient exactly what is known and unknown. It does not call the system secure or claim a severity score has made the decision automatically.

## Finding Scope and Affected-Population Reasoning

An evidence record should state the difference between a verified route and the potential affected scope. The original support-refund verification shows that one route permits an action contrary to the intended policy. The broader question—how many routes, identities, states, deployments, or customers are affected—may remain unresolved. It is tempting either to dismiss the issue as “only one route” or assume universal exposure. Both are unsupported without additional evidence.

| Scope question | Evidence that can help | Limitation |
| --- | --- | --- |
| Which routes expose the action? | Route inventory and bounded authorization matrix | Inventory may change; untested clients/services remain |
| Which actors are affected? | Synthetic roles, service identities, ownership cases | Does not enumerate production accounts or all delegated scopes |
| Which states permit the action? | State-transition evidence for selected order lifecycle values | New states/policies may change behavior |
| Which versions/configurations apply? | Build/policy/cache/deployment record | Cannot prove every environment is aligned |
| What consequence follows? | Asset, state, exposure, compensating control, and ownership analysis | Business/legal impact requires appropriate authority |

The purpose is to choose proportionate next evidence. For a high-consequence action, scope expansion may be required before a release decision. For a bounded low-consequence finding, a documented mitigation and revision trigger may be proportionate. The record makes the distinction reviewable.

## Evidence Preservation and Reproducibility

Security evidence can become difficult to review when provenance is lost. Preserve a safe, synthetic record of the method, source, environment, configuration version, actor role, resource state, outcome, and time/window. Do not preserve real credentials, customer data, exploit strings, or unnecessary sensitive diagnostics. The artifact needs enough information for a responsible reviewer to repeat the bounded verification, not enough information to create an operational attack guide.

| Preserve | Why | Avoid preserving |
| --- | --- | --- |
| Synthetic actor/role and scoped resource state | Makes authorization result reproducible | Real identity, token, customer record, or credential |
| Build/policy/configuration version | Establishes applicability and revision trigger | Secret values or connection details |
| Route/action/outcome and resulting state | Shows the claimed boundary behavior | Detailed exploitation steps or attack-chain instructions |
| Test window and method | Distinguishes repeatable evidence from anecdote | Unnecessary raw diagnostic payloads |
| Coverage and limitation statement | Makes residual risk visible | Unqualified “no issues” conclusion |

Reproducibility also protects remediation work. If a later reviewer cannot reproduce the synthetic role/action/state case, it is difficult to know whether the control changed, the test drifted, or the original result had a different boundary.

## Verification Coverage as a Portfolio

One security check becomes more useful when linked to complementary evidence. The following portfolio does not guarantee complete coverage; it illustrates how different sources answer different questions.

| Evidence artifact | Main value | Blind spot |
| --- | --- | --- |
| Threat evidence model | Identifies asset, actor, boundary, misuse assumption, and priority | Does not prove behavior |
| Authorization matrix | Tests selected allow/deny role/resource/action/state outcomes | Does not cover all paths or configurations |
| Input/output trust review | Assesses stated data and output boundaries | Does not establish identity/authorization model |
| Finding record | Preserves tool/review lead, verification, remediation, and ownership | May have narrow target scope |
| Dependency/configuration review | Reveals changed assumptions and supply/configuration boundary | Does not prove behavior of every dependency version |
| Regression record | Preserves known boundary across change | Can become stale after unrecorded change |

When sources disagree, state the conflict. A scanner lead may be rejected for the current configuration while a route verification remains a confirmed issue. A clean authorization row may coexist with an untested cache node. The portfolio supports a decision by exposing, rather than smoothing over, those differences.

## Decision Patterns for Findings

The following decision patterns are examples, not mandates:

| Evidence state | Possible proportionate action | Residual-risk statement |
| --- | --- | --- |
| High-consequence verified boundary issue | Remediate, re-verify, expand affected-scope evidence, escalate before release | Untested routes/states remain until coverage is expanded or accepted by owner |
| Verified issue with reversible feature scope | Constrain the feature while remediation/verification proceed | Scope limits exposure but does not remove underlying control risk |
| Rejected configuration lead | Record rejection evidence and revision trigger | Changed component/configuration may make the lead relevant again |
| Coverage limitation | Add bounded follow-up or explicitly accept with owner | No finding is not evidence of safety for unassessed boundary |
| Conflicting evidence | Preserve uncertainty; request complementary method or decision condition | Owner must decide whether current uncertainty is acceptable |

These patterns help a Quality Engineer turn findings into transparent engineering work. They do not replace an organization's security, legal, or release governance.

## Finding-Record Review Checklist

Before closing or escalating a record, verify source/method, version/configuration, asset/actor/boundary, fact, interpretation, affected scope, limitation, severity/context, remediation claim, re-verification, regression control, owner, residual risk, and revision trigger. The checklist protects against both premature closure and unbounded alarm.

## From Observation to a Governed Finding

Not every anomaly deserves the same handling, but every material observation should have a traceable path. Start with what was observed and the conditions under which it was observed. Preserve the relevant safe evidence, identify the affected asset, boundary, population, and version, and distinguish an observed outcome from an inference about cause or reachability. The next action may be reproduction in an authorised environment, comparison against the intended control, or consultation with the accountable engineering or security owner. It is not an invitation to continue probing a live system without a clear purpose and permission.

The finding record should be proportionate. A small configuration inconsistency may need a concise owner-and-deadline record; a potential account, payment, or trust-boundary issue may need stronger preservation, restricted handling, and a defined escalation route. In both cases, the record should make clear what was verified, what remains uncertain, and what decision is currently supported. Severity labels help prioritise, but they do not replace this reasoning.

## Verification Design After a Remediation

A remediation changes a system and therefore creates a new evidence obligation. Verify the intended protective behaviour at the relevant boundary, then check that the change has not broken adjacent normal behaviour, operational observability, availability expectations, or the authorisation and data-handling conditions that the control depends on. The test set should be guided by the original claim and affected population, not by an assumption that a single passing check proves the issue is closed.

For example, a correction to a policy decision might be verified with allowed and denied role/resource/action/state combinations, a configuration confirmation, and a runtime signal that indicates unexpected denial or failure without storing sensitive content. The result should state the version and configuration condition tested. If a condition cannot be reproduced safely or is outside the available environment, record that limit and set a follow-up action rather than implying full closure.

## Residual Risk as a Decision Record

Residual risk is the risk remaining after the controls and evidence currently available have been considered. It is not a euphemism for “we do not know,” nor is it evidence that a concern is accepted forever. A useful record says which condition remains, why it cannot yet be eliminated or further verified, the decision scope, compensating controls or rollout limits, accountable owner, review date, and the event that would require reassessment.

This structure allows a team to make a bounded decision while preserving accountability. It also prevents a quality engineer from silently becoming the risk owner. The engineer can provide evidence, explain its limits, and recommend conditions. The accountable decision maker accepts, mitigates, defers, or escalates the residual risk through the organisation's established governance.

## Evidence Retention and Access Boundaries

Retain enough evidence for an independent reviewer to understand the conclusion, but minimise what is stored and shared. Link to approved systems of record where necessary instead of copying sensitive logs, identifiers, or configuration values into a finding. State access restrictions and retention expectations where the organisation requires them. A report that is easy to distribute but exposes information unnecessarily is not a high-quality evidence artefact.

Evidence retention also includes negative and inconclusive results. A rejected hypothesis, an inconclusive reproduction, or a coverage gap can stop teams from repeating work and can explain why a later decision had limits. Mark these states clearly; do not promote absence of evidence into evidence of absence.

Close a finding only when the agreed closure condition is met. That condition may be a verified remediation, an accepted bounded residual-risk decision by the accountable owner, or a justified determination that the observation does not represent the claimed issue. “No longer visible in one run” is not, by itself, a closure condition.

Where a report groups several observations, preserve their individual evidence and affected conditions. A shared theme can help prioritisation, but it must not silently widen a verified local finding into a system-wide claim. Conversely, identify where the same assumption or control appears at multiple boundaries so that remediation verification is appropriately scoped.

Use review dates as active controls. A bounded acceptance or deferred verification should name when it will be reconsidered and what evidence is expected by then. Without that trigger, an explicitly temporary residual-risk decision can become an unexamined permanent state.

The final record should also identify who will confirm completion of the follow-up and where that confirmation will be retained. This turns a recommendation into an accountable learning loop rather than an unresolved note.

If the evidence source expires or access changes, record a safe replacement reference so the conclusion remains auditable within the authorised retention boundary.

## Engineering Perspective

Maintain a Security Finding and Remediation Verification Record that separates fact, claim, evidence, interpretation, limitation, risk, mitigation, owner, decision, residual risk, and revision trigger. This produces a useful engineering handoff without turning the Quality Engineer into a security-certification authority.

## Industry Perspective

NIST SSDF promotes integrating secure-development practices into the development lifecycle, while leaving implementation choices to organizations and systems.[^nist-ssdf] Its value here is the emphasis on evidence, ownership, and repeatable change handling—not a claim that one record establishes compliance.

## Common Misconceptions and Pitfalls

### “A rejected finding is a false positive everywhere.”

It is rejected only for the stated target, configuration, method, and evidence. A changed scope can require reassessment.

### “A fix is complete when the original request fails.”

Re-verification must also assess relevant allowed behaviour, state change, affected scope, and regression control.

### “No findings means the system is secure.”

It means the available method found no issues in its stated coverage. False-negative and scope limitations remain relevant.

## QA → QE Transition

The transition is from forwarding tool output to producing verified, decision-relevant evidence with context, limitations, remediation proof, ownership, and residual risk.

## Summary

Security findings begin an evidence lifecycle. Verification distinguishes confirmed issues, rejected leads, unresolved evidence, and coverage limitations. Remediation is an engineering claim that requires re-verification and regression control.

## Key Takeaways

- A finding, verified issue, rejected lead, and coverage gap are not interchangeable.
- Severity and exploitability must be interpreted in system context.
- Safe synthetic verification can provide useful evidence without offensive procedures.
- Remediation evidence needs an owner, regression control, residual risk, and revision trigger.

## Review Questions

1. Why is a rejected finding not proof that the risk category is absent?
2. What should remediation verification show beyond failure of the original case?
3. How do false negatives affect a security evidence record?
4. Which fields belong in a decision-ready finding record?

## Interview Questions

1. How would you triage a scanner result without dismissing or overclaiming it?
2. How do you verify an access-control remediation safely?
3. What does residual risk mean after a security fix?

## Practical Exercise

Create a **Security Finding and Remediation Verification Record** for the Atlas support-refund finding. Include a verified issue, a rejected synthetic lead, one coverage limitation, remediation evidence, regression control, owner, residual risk, and revision trigger.

## Further Reading

- [NIST Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final)
- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)

## References

[^nist-ssdf]: National Institute of Standards and Technology. [Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final). SP 800-218, 2022. Accessed 2026-08-12.
[^owasp-asvs]: OWASP Foundation. [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/). Accessed 2026-08-12.

## Chapter Checklist

- [ ] I can distinguish a verified issue, rejected lead, unresolved evidence, and coverage limitation.
- [ ] I can record severity and exploitability context without a score-only decision.
- [ ] I can plan safe remediation verification and regression control.
- [ ] I can communicate owner, escalation, residual risk, and revision trigger.

## Chapter Navigation

Previous: [Chapter 9 — Input, Output, Dependencies, Secrets, and Configuration Trust](chapter-09-input-output-dependencies-secrets-and-configuration-trust.md) · Next: [Chapter 11 — Performance–Security Trade-offs, Regression, and Decision Readiness](chapter-11-performance-security-trade-offs-regression-and-decision-readiness.md)
