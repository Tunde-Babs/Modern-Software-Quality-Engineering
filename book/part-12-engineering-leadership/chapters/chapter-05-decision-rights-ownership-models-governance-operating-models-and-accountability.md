# Chapter 5 — Decision Rights, Ownership Models, Governance Operating Models, and Accountability

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 5 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapters 1–4; Parts VI, VIII, IX, X, and XI recommended |
| Estimated study time | 165 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Every component in a failing system usually has an owner. What rarely has an owner is the fact that it failed, and the signal that would have said so.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

The four-day finance understatement is discussed again, eighteen months after it happened, because the same shape has recurred in a smaller form.

The original mechanism is well documented. A status value was added to the `orders` table. The nightly finance reconciliation job counted `PAID` orders using a status list that predated the change, so the settlement figure was understated. It stayed wrong for four days.

The review at the time produced a sensible action: add the new status to the finance job's filter. That was done. What the review did not produce was an answer to a question nobody asked out loud — *who was supposed to notice?*

Walk the ownership out and every component has a name attached. The order-domain owner owns the `orders` table. The platform owner owns the scheduled job infrastructure. The finance function owns the reconciliation process. The delivery owner owns what ships. Every one of those roles is real, staffed, and would have acted if asked.

The settlement figure itself had no owner. Not the table it was computed from, not the job that computed it — the *number*, and the question of whether it was right. And the signal that would have revealed it — a settlement figure diverging from order volume — was not anybody's to watch, because it had never been described as a signal at all.

By the end of this chapter you should be able to distinguish three different things that all get called "ownership", and explain why an organisation can have complete component ownership and still lose four days.

## Why This Chapter Matters

Chapter 1 told you to name the accountable owner rather than a team. This chapter is about what to do when you try and find that nobody holds the thing you are pointing at.

That is not a rare edge case. It is the characteristic failure of organisations that have done ownership *well* by conventional standards: every service has a team, every repository has a code owner, every process has a function. The gaps are not in the components. They are between them, and in the class of things that are not components at all — facts, signals, policies, and decisions.

The chapter also has to discharge something the handbook has been deferring. Parts IX, X, and XI each stated that governance depth, governance operating models, policy ownership, and formal decision rights belong to Part XII. Those are published commitments and this chapter honours them — under a boundary that keeps them Quality Engineering rather than management consulting.

The question this chapter answers is narrow and practical:

> How do an organisation's decision and ownership arrangements affect whether quality evidence becomes action, accountability, and learning?

It is **not** about designing an organisation. It contains no reporting-line design, no headcount planning, no reorganisation playbook, no management hierarchy, and no executive governance theory. Those require different expertise and a context a handbook does not have.

## Learning Objectives

After completing this chapter you should be able to:

- distinguish ownership of a **component**, a **fact**, a **signal**, and a **policy**, and identify which is missing in a given failure;
- separate the **recommend / consult / approve / execute** roles for a single decision, and state which one you occupy;
- identify an unowned decision, fact, or signal and describe it as an organisational gap rather than as a disagreement;
- describe four common governance arrangements for quality capability, with the context each may fit, its coordination cost, and its characteristic failure mode — **without ranking them**;
- state what evidence would indicate that a given arrangement is not working, and what would trigger reassessment;
- explain why "every decision needs exactly one owner" is not a universal rule, and what the real failure mode is;
- reason about policy ownership, exceptions, and the policy nobody owns;
- explain why an AI capability contributing to a quality decision changes the evidence, uncertainty, boundary, and specialist input required — but not the accountable owner; and
- produce an Ownership and Accountability Model.

## Four Things Called Ownership

"Who owns this?" is four questions wearing one set of clothes. Separating them is the core diagnostic of the chapter.

| Kind | What is owned | Atlas example | Characteristic failure when absent |
| --- | --- | --- | --- |
| **Component ownership** | A service, module, table, pipeline, or repository | The order-domain owner owns the `orders` table | Change breaks; nobody can be found to fix it |
| **Fact ownership** | The correctness of a specific assertion the business relies on | Nobody owns whether the settlement figure is right | The fact is wrong and no one is answerable for its wrongness |
| **Signal ownership** | The obligation to notice a specific condition | Nobody owns watching settlement against order volume | The failure is real, detectable in principle, and undetected |
| **Policy ownership** | A stated rule, who may grant exceptions, and whether exceptions are recorded | No one owns "reconciliation must balance" as a rule | The rule exists in nobody's head and is violated without anyone violating anything |

Organisations invest heavily in the first row and almost nothing in the other three. This is understandable — components are visible, enumerable, and map onto teams — and it produces exactly the Atlas failure. Complete component ownership guarantees somebody can *fix* a problem. It guarantees nothing about whether anyone will *notice* one.

The distinction is not academic. It changes what you propose. If the finance understatement is read as a component-ownership gap, the fix is to assign the job to someone, which was already true. If it is read as a **signal**-ownership gap, the fix is to name the divergence as a signal, say who watches it, and say what they do when it fires — which is a much smaller piece of work and the only one that would have helped.

### The unowned signal

The unowned signal deserves separate treatment because it is the most consequential and the least visible.

A signal is unowned when all three of the following hold: the condition is detectable in principle from data the organisation already has; no role is responsible for observing it; and nothing happens automatically when it occurs. Atlas's settlement divergence met all three. So, arguably, does the drift between the two order stores during the fourteen-month dual-write — the comparison mechanism was never built, so the drift was neither observed nor observable.

Silent-failure classes concentrate here. A loud failure recruits its own owner: something crashes, someone is paged, the ownership question resolves itself. A silent failure has no such mechanism, which is why Chapter 4 identified **detectability** as the proportionality factor engineers systematically under-weight.

## Decision Rights: Four Roles, One Decision

Ownership answers *who holds this*. Decision rights answer *who does what when a specific decision is made*. Four roles recur, and confusing them is where most "I thought you were handling it" originates.

| Role | What it means | What it does not mean |
| --- | --- | --- |
| **Recommend** | Produce the analysis and propose a course of action | Not deciding. A recommendation can be declined. |
| **Consult** | Be asked before the decision, with a genuine opportunity to shape it | Not a veto, and not being told afterwards |
| **Approve** | Hold the right to say yes or no | Not necessarily having done the analysis |
| **Execute** | Carry out the decision once made | Not accountability for whether it was the right decision |

A Quality Engineer normally occupies **recommend** and sometimes **consult**. Being asked to *approve* something is worth noticing carefully: it either means the organisation has genuinely delegated a decision to you — in which case you now hold accountability, per Chapter 1 — or it means someone is distributing accountability for a decision they intend to make anyway. Those are different situations and only the first is real.

Two common malformations:

**Consultation theatre.** Being asked after the decision is made, or asked so late that no answer could change anything, is not consultation. It is a courtesy, and treating it as consultation means the organisation believes a check occurred that did not. The diagnostic is whether a different answer from you would have produced a different outcome.

**Approval without analysis.** An approver who has not seen the evidence, and cannot say what they are accepting, has approved nothing meaningful — they have transferred an unexamined risk into the record where it looks examined. Chapter 4's outcome 2 requires the owner to know what they accepted; this is the same requirement stated from the approver's side.

### On "every decision needs one owner"

This is widely repeated and is not true as a universal.

Some decisions are legitimately shared: a change affecting both the payment path and the fulfilment path may genuinely require the payment-domain owner and the delivery owner to agree, and forcing a single name onto it produces a fiction. Some decisions are legitimately escalated by design, because they cross a boundary neither party owns.

The failure mode Part XII cares about is not a decision with **two** owners. It is a decision, fact, or signal with **none**. Two owners produces friction, which is visible and gets resolved. Zero owners produces silence, which is invisible until an incident. When you are tempted to argue that a decision needs a single owner, check first whether the real problem is that it currently has zero.

## Governance Operating Models

How an organisation arranges quality capability affects what evidence gets produced, who sees it, and whether it reaches a decision. Four arrangements recur in practice. They are described here as a **vocabulary for recognising the arrangement you are in**, not as options to choose between.

Three things this section is explicitly not. It does **not** rank the arrangements. It does **not** present them as stages, levels, or a progression — there is no sequence in which one is more advanced than another, and reading them as a ladder is the specific misuse to avoid. And it does **not** produce a score, index, or assessment instrument of any kind.

### Centralised

A distinct quality function owns standards, methods, and often a sign-off point.

| Aspect | Content |
| --- | --- |
| **Context where it may fit** | Regulatory or safety obligations requiring demonstrable independence; organisations where consistency across many teams matters more than local speed; domains where the specialist skill is scarce and must be concentrated to exist at all |
| **Quality capability supported** | Deep specialist skill; consistent method; independence from delivery pressure; institutional memory that survives team churn |
| **Coordination cost** | A handoff boundary on every change; queueing at the sign-off point; the specialist is distant from the context in which the work was done |
| **Where ownership becomes ambiguous** | Delivery teams may conclude quality is the quality function's responsibility, which removes it from everyone else — the failure Part I named |
| **Evidence it is not working** | Findings arriving after the decision they bear on; rising proportion of exceptions granted; teams routing around the boundary; the function reporting on work rather than affecting it |
| **Revision trigger** | Queue time at the boundary exceeding the window in which findings can change a decision |

### Embedded

Quality engineers sit inside delivery teams.

| Aspect | Content |
| --- | --- |
| **Context where it may fit** | Fast-moving product work where context is expensive to transfer; teams with genuine end-to-end ownership; organisations where the quality question differs materially per team |
| **Quality capability supported** | Deep context; findings arrive while they can still change something; quality reasoning becomes part of the team's own work |
| **Coordination cost** | Divergence between teams; duplicated effort on shared problems; no route for a concern that crosses team boundaries |
| **Where ownership becomes ambiguous** | Cross-cutting concerns — a contract shared by four consumers, a system-wide reliability property — belong to no single embedded engineer |
| **Evidence it is not working** | The same problem being solved differently in several teams; concerns that cross boundaries going unraised; the embedded specialist absorbed into delivery work until the specialism stops happening |
| **Revision trigger** | A cross-boundary failure that every embedded engineer could see and none owned |

### Federated

Embedded practitioners with a shared community, common standards, and some collective ownership of cross-cutting concerns.

| Aspect | Content |
| --- | --- |
| **Context where it may fit** | Enough practitioners for a community to be viable; genuine cross-team concerns; an organisation willing to fund time that is not team-attributable |
| **Quality capability supported** | Local context with a route for shared problems; standards that practitioners had a hand in; a path for the cross-boundary concern |
| **Coordination cost** | Time spent in the community is time not spent in the team, and it is the first thing cut under delivery pressure; consensus is slow |
| **Where ownership becomes ambiguous** | The community may own standards without owning any decision, producing recommendations nobody is accountable for adopting |
| **Evidence it is not working** | Community meetings with declining attendance; standards nobody follows; cross-cutting concerns discussed and never assigned |
| **Revision trigger** | Standards being produced faster than they are adopted, or the community losing its funded time |

### Enabling

A small group builds capability in others rather than doing the work.

| Aspect | Content |
| --- | --- |
| **Context where it may fit** | Capability is the constraint rather than capacity; the organisation can tolerate a slow-appearing return; there is enough existing capability to build on |
| **Quality capability supported** | Leverage — capability that persists after the enabling group moves on; consistent reasoning without a central bottleneck |
| **Coordination cost** | Effect is indirect and slow to appear; the group produces little that is attributable to it |
| **Where ownership becomes ambiguous** | The enabling group owns no delivery outcome, so under pressure it may be pulled into doing the work, which ends the arrangement without a decision |
| **Evidence it is not working** | The group doing delivery work; capability not persisting after engagements end; teams waiting for the group rather than proceeding |
| **Revision trigger** | The group being asked to take delivery accountability, or engagements producing no durable change in the teams they touched |

**No arrangement here is a target state.** Each fits some contexts and fails in others; the failure modes are different rather than more or less severe. Atlas, with four engineers owning eight responsibilities, has none of these arrangements in a recognisable form — quality reasoning is distributed informally among four people, which is common in small organisations and is not a deficiency to be corrected by adopting a model. The useful question for a Quality Engineer is not *which model should we adopt* but *which of these failure modes are we currently experiencing, and what evidence would confirm it.*

## Policy Ownership

A policy is a stated rule intended to hold across cases. Four questions determine whether it functions:

- **Who owns it?** The role entitled to change it.
- **Who may grant an exception?** Often unstated, which means either nobody can or anybody does.
- **Are exceptions recorded?** An unrecorded exception is indistinguishable from the rule not existing.
- **What happens when it is violated?** If the answer is nothing, the policy is a preference.

The Atlas failure mode is the **unowned policy**. Nobody at Atlas ever wrote "the nightly reconciliation must balance against order volume" as a rule. Everyone assumed it. An assumed rule cannot be violated, because there is nothing to violate — which is precisely why a four-day divergence produced no alarm and no accountability.

A second pattern is worth naming: the policy that survives its owner. When the person who wrote a rule moves on and no successor is assigned, the rule continues to be enforced by habit while nobody is entitled to change it. It becomes a constraint the organisation cannot revisit, which is the same shape as Chapter 3's orphaned record.

## AI-Enabled Evidence Does Not Erase Decision Ownership

An AI capability inside a system changes several things about a quality decision. It does not change who owns it.

Atlas has one such capability: the Support Assistant introduced in [Part IX](../../part-09-ai-quality-engineering/README.md), which answers customer questions about deliveries and returns. Suppose it begins classifying incoming support contacts by urgency, and the classification determines which contacts a human sees first.

Four things change, and they are worth separating:

| What changes | What it means for the decision |
| --- | --- |
| **The evidence** | Some evidence is now model-produced rather than measured or observed. It has a provenance, an error profile, and conditions under which it degrades |
| **The uncertainty** | Model output carries uncertainty of a different shape — it can be confidently wrong in ways a failing check is not |
| **The system boundary** | The behaviour now depends on a component whose failure modes differ from deterministic code, which Part IX Chapter 2 develops as an architecture question |
| **The specialist input required** | Establishing whether the classification is good enough for its purpose is AI-quality evaluation work — Part IX's, not this chapter's |

What does **not** change is the fifth item, and it is the one this chapter is about: **the accountable owner**. If urgent contacts are missed, the accountability sits with whoever owns the support outcome. It does not sit with the model, and it does not move to the engineer who integrated it.

### Language discipline

Precision here is not pedantry — imprecise language is how accountability quietly relocates.

| Avoid | Use |
| --- | --- |
| "The AI decided to deprioritise it" | "The workflow classified it as low urgency, and no one reviewed the classification" |
| "The model approved the response" | "The model produced a response; the support operator sent it" |
| "The system chose not to escalate" | "The system did not flag it, and the escalation path depended on a flag" |

The right-hand column keeps a human or organisational actor in every sentence, which is accurate. The left-hand column does not, and a record written that way will be read later as though nobody was answerable.

### What a Quality Engineer records

Four additions to the ownership analysis when an AI capability contributes:

- **Provenance.** Which claims are model-produced, and which are measured or observed. This is an evidence-class judgement in Chapter 2's terms, and model output is not automatically *measured* — it is a system's output about something, with the same "measured about what?" question attached.
- **Limitations and uncertainty.** What the capability was evaluated on, under what conditions, and what it was not. If nobody can answer, that is the finding.
- **Whether specialist evidence is required.** Before an AI-derived claim carries weight in a decision, someone must establish that the capability is good enough for *that* purpose. That evidence is Part IX's, and requesting it is a legitimate and often the most useful contribution.
- **Whether a review step exists, and who owns it.** An AI capability that produces an output nobody reviews has created exactly the unowned signal this chapter opened with — detectable in principle, watched by nobody, nothing automatic.

Part IX makes the corresponding point from its own side, excluding *"replacing accountable domain review with a model evaluator"* and requiring evidence to be connected to a named accountable decision owner. The two parts agree, from different directions: **Part IX establishes whether an AI capability is good enough; Part XII establishes who is still answerable for the decision it informs.**

### The ambiguity case

Where the decision rights around an AI capability are genuinely unclear — nobody can say who owns the classification's consequences, or whether anyone is expected to review it — **the ambiguity is itself the finding**, and it is a governance risk rather than a technical one. It belongs in the unowned residue of the Ownership and Accountability Model below, alongside the settlement signal and the unowned shim. It is the same failure shape arriving through a newer mechanism.

## The Ownership and Accountability Model

The **Ownership and Accountability Model** is an original MSQE teaching artefact, not an industry standard and not a governance framework. It is a short analysis of ownership around one quality outcome.

| Field | What it records |
| --- | --- |
| **Quality outcome** | The outcome under analysis, bounded |
| **Owned components** | The services, stores, jobs, and pipelines involved, and their owning roles |
| **Owned facts** | The assertions the business relies on, and who is answerable for each being correct |
| **Owned signals** | The conditions someone is responsible for noticing, who notices, and what they do |
| **Owned policies** | The stated rules, their owners, and the exception path |
| **Decision rights** | For the decision at hand: who recommends, consults, approves, executes |
| **Unowned residue** | Every fact, signal, policy, or decision above that has no owner |
| **Consequence of each gap** | What would happen, and how long it would take to notice |
| **Smallest closing assignment** | The least expensive assignment that closes the most consequential gap |
| **What remains unowned** | What is deliberately left unowned, and who accepted that |

The artefact's output is the **unowned residue** row. Everything above it exists to make that row derivable rather than guessed.

The **smallest closing assignment** row matters because it is what makes the analysis usable. A model that concludes "seven things are unowned" invites the response that the team has four engineers and eight responsibilities. A model that concludes "of the seven, the settlement-divergence signal is the one that cost four days, and assigning it to the finance function's existing weekly check costs approximately nothing" invites a decision.

### Failure modes of the model

- **It becomes a RACI matrix.** Enumerating every role's relationship to every component produces a grid nobody reads. The model is scoped to *one outcome* and exists to expose gaps, not to document the org.
- **Unowned residue is left empty.** If nothing is unowned, either the outcome is unusually well covered or the analysis stopped at components. Check the facts and signals rows before believing it.
- **The closing assignment is expensive.** If the smallest assignment you can find requires headcount, you have probably identified a structural constraint rather than an ownership gap — which is Chapter 7's subject, and a different conversation.
- **The model assigns ownership.** It does not. It identifies gaps and proposes; someone with authority assigns.

## Engineering Perspective

The reframe worth carrying from this chapter is from *"who owns this component?"* to *"who owns noticing?"*

Component ownership is largely a solved problem in most engineering organisations, and asking about it produces an answer that is true and unhelpful. Signal ownership is almost never explicit, and asking about it produces either a name — in which case you have learned the system is better instrumented than you thought — or a silence, which is a finding you can act on cheaply.

The cost asymmetry is what makes this worth doing. Assigning a signal is usually a sentence in a runbook and a line in someone's weekly check. Discovering an unowned signal through an incident costs whatever the incident cost, plus the four days.

## Industry Perspective

Documented practice contains several mechanisms that exist specifically to attach ownership to things that are not components: on-call rotations attach ownership of *responding*; error budgets attach ownership of *a reliability property*; service-level objectives attach ownership of *a fact about behaviour*; incident review follow-ups attach ownership of *an action*. Each was developed because component ownership alone left something uncovered.

What these mechanisms share is not a governance model but a habit: they name the thing to be owned, and then name a role — and they are documented in enough detail that the assignment survives the person. Where they fail, the characteristic failure is an action item with no owner and no date, which is this chapter's subject in miniature.

## Common Misconceptions and Pitfalls

### "We have clear ownership — every service has a team."

Component ownership. The Atlas settlement figure sat inside owned components, computed by an owned job, from an owned table, and was wrong for four days. Ask what the *facts* and *signals* are before concluding ownership is clear.

### "Every decision should have exactly one owner."

Some decisions are legitimately shared or escalated by design. Two owners create friction, which is visible and resolvable. Zero owners create silence. Check which problem you actually have.

### "We should move to a federated model."

There is no ladder to move up. Each arrangement fits some contexts and fails in others, and Atlas — four engineers, eight responsibilities — fits none of them in recognisable form without that being a deficiency. The productive question is which failure mode you are currently experiencing.

### "Governance slows engineering down."

Some governance does. What this chapter describes is the opposite problem: the absence of stated ownership is what let a wrong number persist for four days without anyone being able to be asked about it. The cost of no governance is usually paid later and by someone else.

### "If I identify the gap, I've fixed it."

Identifying an unowned signal is a finding. It becomes a change when someone with authority assigns it, and remains a finding until then — which is Chapter 4's owned-versus-unowned distinction applied to your own analysis.

### "The quality function owns quality."

Rejected in Part I and again here. Under a centralised arrangement this belief is the characteristic failure mode, not an accurate description of the arrangement.

## QA → QE → Engineering-Leadership Transition

Consider what three engineers would produce after the finance understatement.

**QA contribution.** Reports the ownership gap accurately: the finance reconciliation job filtered on a status list that predated the new value, and the settlement figure was understated for four days. Identifies that the job now needs the new status added.

**QE contribution.** Establishes that the gap is not in the component. Every component had an owner and each would have acted if asked. What was missing was ownership of the *fact* — whether the settlement figure was correct — and of the *signal* that would have revealed it. Notes that the same shape recurs elsewhere: the drift between the two order stores during the dual-write was equally undetectable, for the same reason.

**Engineering-leadership contribution.** Analyses the decision rights around the recurrence: who recommends a change to the reconciliation check, who must be consulted, who approves, who executes — and finds that the finance function has never been consulted on a change to a status vocabulary it depends on, which is why the vocabulary keeps changing under it. Proposes the smallest closing assignment rather than a governance arrangement, states what evidence would show it working, and records who accepted the gaps left open.

## Summary

"Ownership" bundles four distinct things: components, facts, signals, and policies. Organisations invest almost entirely in the first and experience their characteristic failures in the other three — complete component ownership guarantees somebody can fix a problem and guarantees nothing about whether anyone notices one. Decision rights separate recommend, consult, approve, and execute; consultation theatre and approval without analysis are the common malformations. "Every decision needs one owner" is not a universal — the failure mode that matters is zero owners, not two. Four governance arrangements — centralised, embedded, federated, enabling — each fit some contexts and fail in others, form no progression, and are described here as a vocabulary rather than a menu. The Ownership and Accountability Model exists to make the unowned residue derivable, and to identify the smallest assignment that closes the most consequential gap.

## Key Takeaways

- Component, fact, signal, and policy ownership are four different things; naming which one is missing changes what you propose.
- **The unowned signal** is the most consequential and least visible gap: detectable in principle, nobody's to watch, nothing automatic.
- Loud failures recruit their own owners; silent failures do not, which is why detectability carries so much weight.
- Recommend, consult, approve, and execute are separate; consultation after the decision is a courtesy, and approval without evidence records an unexamined risk as examined.
- The failure mode is **zero owners, not two**. Friction is visible and resolves; silence does not.
- The four governance arrangements are a recognition vocabulary, **not a ladder, a maturity scale, or a menu** — none is a target state.
- An assumed policy cannot be violated, which is why nothing alarmed when Atlas's reconciliation stopped balancing.
- Ask "who owns noticing?" rather than "who owns this?" — the cost asymmetry between assigning a signal and discovering it through an incident is large.
- **An AI capability changes the evidence, the uncertainty, the system boundary, and the specialist input required — it does not change the accountable owner.** Say "the workflow classified", not "the AI decided"; imprecise language is how accountability quietly relocates.

## Review Questions

1. Every Atlas component involved in the settlement understatement had an owner. Explain in ownership terms why four days passed, and name which kind of ownership was missing.
2. Give an Atlas example of an unowned signal other than the settlement divergence, and state the three conditions that make it unowned.
3. You are asked to approve a release. Distinguish the two situations this could represent, and say how you would tell which one you are in.
4. A colleague argues that a shared decision between the payment-domain owner and the delivery owner is a governance defect requiring a single owner. Evaluate the argument.
5. For any two of the four governance arrangements, state a context where each may fit and the failure mode each carries. Do not rank them.
6. Atlas has no recognisable governance arrangement. Explain why this is not automatically a deficiency, and what would make it one.
7. Distinguish an unowned policy from a violated policy, and explain why the first produces no alarm.
8. Atlas's Support Assistant begins classifying support contacts by urgency, and an urgent contact is missed. Name what changed about the decision and what did not, and rewrite "the AI deprioritised it" so that an accountable actor remains in the sentence.
9. What specialist evidence would you request before an AI-derived classification carried weight in a quality decision, and whose evidence is it?

## Interview Questions

1. How do you determine who owns a quality outcome that spans several teams?
2. Describe a time you found that something important had no owner. How did you raise it?
3. What is the difference between being consulted on a decision and being informed of it, and why does it matter?
4. How would you assess whether your organisation's quality arrangement is working, without ranking it against other organisations?

## Practical Exercise

Produce an **Ownership and Accountability Model** for the following synthetic Atlas Commerce quality outcome, then complete the comparison task below.

*The quality outcome is: **the nightly finance reconciliation produces a settlement figure that matches the orders Atlas actually took**. The `orders` table is owned by the order-domain owner and written by checkout and order management. The reconciliation job runs on platform-owned infrastructure and reads a nightly snapshot that is deliberately up to 24 hours stale. The finance function consumes the output. Status values have been added to the `orders` table twice in eighteen months; the finance function was not consulted on either change. The analytics pipeline also produces order-level figures, is confirmed to exist, and its read behaviour is unknown. No comparison between the settlement figure and order volume is performed by anyone.*

Complete every field. Your submission must:

- populate the owned-components, owned-facts, owned-signals, and owned-policies rows separately, and show at least one row where a component is owned but the corresponding fact is not;
- state decision rights for one specific decision — changing the `orders` status vocabulary — naming who recommends, consults, approves, and executes;
- identify the unowned residue and state, for each item, how long it would take to notice;
- propose the smallest closing assignment for the most consequential gap, and state what it would cost;
- state what evidence would show the assignment is working; and
- name what you would deliberately leave unowned and who would need to accept that.

**Comparison task.** Atlas is considering two arrangements for the future: keeping quality reasoning distributed informally among the four engineers, or funding one person as an enabling specialist one day a week. For **each** arrangement, state the context where it may fit, the quality capability it supports, its coordination cost, where ownership could become ambiguous, the evidence that would show it is not working, and a revision trigger.

Do **not** recommend one over the other, and do not describe either as more mature or more advanced. In two or three sentences, explain what additional information you would need before a recommendation would be possible at all — and say who would own that decision.

Use only synthetic data.

## Further Reading

- [Part VIII — Observability & Reliability Engineering](../../part-08-observability-reliability/README.md) — signals, alerting, and on-call ownership, which this chapter draws on rather than re-teaches.
- [Part XI — System Design & Architecture](../../part-11-system-design-architecture/README.md) — decision ownership and residual risk in architecture decisions.
- [Part IX — AI Quality Engineering](../../part-09-ai-quality-engineering/README.md) — whether an AI capability is good enough for a purpose, which this chapter treats as specialist evidence rather than re-teaching.

## References

This chapter makes no external factual claim requiring citation. The four-kinds-of-ownership taxonomy, the four-role decision-rights treatment, the governance-arrangement comparison, and the Ownership and Accountability Model are **original MSQE teaching material**, not industry standards, governance frameworks, or maturity models. Atlas Commerce is a synthetic teaching baseline; all figures are carried unchanged from Part XI's evidence base and are illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish component, fact, signal, and policy ownership, and identify which is missing in a described failure.
- [ ] State the three conditions that make a signal unowned.
- [ ] Separate recommend, consult, approve, and execute for a single decision.
- [ ] Recognise consultation theatre and approval without analysis.
- [ ] Explain why zero owners is the failure mode rather than two.
- [ ] Describe each governance arrangement's context, coordination cost, and failure mode without ranking them.
- [ ] Explain why an assumed policy produces no alarm when it is broken.
- [ ] State what an AI capability changes about a quality decision and what it does not, and describe a model-produced classification without removing the human actor from the sentence.
- [ ] Complete an Ownership and Accountability Model and derive its unowned residue.

## Chapter Navigation

Previous: [Chapter 4 — Disagreement, Escalation, and Recording an Unheeded Concern](chapter-04-disagreement-escalation-and-recording-an-unheeded-concern.md) · Next: [Chapter 6 — Quality Culture: Claims, Evidence, and Limits](chapter-06-quality-culture-claims-evidence-and-limits.md)
