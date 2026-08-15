# Chapter 10 — Changing Practice: Adoption, Evidence, and Reversibility

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 10 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapters 1–9; Part XI Chapter 10 reversibility treatment |
| Estimated study time | 165 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Compliance is what you can mandate. Adoption is what people do when nobody is checking. A practice change that achieved the first and not the second has produced activity, a cost, and no evidence.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

The mandated pre-merge review checklist reaches its first anniversary.

Its origin was reasonable. After the status-value addition silently stopped notification, rendered the support console blank, and understated the settlement figure for four days, the review asked what would have caught it. The answer was that somebody should have asked who reads this table. So a checklist item was added: *"Have downstream consumers been considered?"* — along with eleven other items, because once a checklist exists, adding to it is the cheapest available response to any incident.

Compliance was immediate and total. The checklist is a required field on every pull request; it cannot be merged unchecked. Twelve months of pull requests show it completed on every single one.

The failure class it targeted has recurred twice.

Nobody is cheating. Engineers tick the consumer box and, in most cases, genuinely think about consumers for a moment. What they cannot do is *enumerate* them, because the consumer inventory has never been completed — the analytics pipeline is confirmed to exist with unknown read behaviour, and the partner logistics integration's read behaviour is unknown too. The checklist asks a question the organisation cannot answer, so a careful response and a perfunctory one produce the same tick.

By the end of this chapter you should be able to say what evidence would have revealed this in month two rather than month twelve, and to design a change that could have been stopped.

## Why This Chapter Matters

Quality Engineers propose practice changes constantly — a check, a review step, a standard, a stage in the pipeline. Most are proposed on the strength of an incident, adopted by mandate, and never evaluated. The organisation accumulates practices the way Atlas accumulates checklist items: monotonically, because removing one requires an argument nobody has time to make.

This chapter applies the handbook's evidence and reversibility discipline to that process. It is the same discipline as everywhere else: state what you expect, state what would show it working, state what would show it failing, and state what would cause you to stop.

The reason it belongs here rather than in a change-management text is that the failure modes are evidential. Compliance is mistaken for adoption. Activity is mistaken for improvement. A metric that moved is mistaken for a practice that worked — which is Chapter 9's subject arriving in operational form.

This chapter is **not** a transformation programme, an agile-framework adoption guide, a change-management certification syllabus, or a summary of diffusion theory. It prescribes no named change framework.

## Learning Objectives

After completing this chapter you should be able to:

- state a practice change as a bounded hypothesis with an expected effect;
- distinguish **mandate**, **compliance**, and **adoption**, and identify which you have evidence for;
- design a pilot with a stated scope, window, and population;
- specify a **disconfirming observation** before the change is introduced;
- recognise local optimisation, compliance theatre, and cargo-culted practice;
- reason about the reversibility of a practice change, including what makes it harder to withdraw than to introduce;
- define stop conditions and a revision trigger that someone will actually check; and
- produce a Practice Change and Adoption Strategy.

## Mandate, Compliance, Adoption

Three different things, routinely conflated, with different evidence:

| | What it is | Evidence for it | Atlas checklist |
| --- | --- | --- | --- |
| **Mandate** | The practice is required | The rule exists | Yes — required field, cannot merge unchecked |
| **Compliance** | The required artefact is produced | Records show the artefact | Yes — 100%, twelve months |
| **Adoption** | The reasoning the practice was meant to produce actually happens | The reasoning is observable in outcomes or artefacts | **Unknown, and probably not** |

Compliance is measurable and cheap to observe, which is why organisations report it. Adoption is what the change was for, and is harder to see.

The Atlas case shows why the gap is not dishonesty. The checklist asks whether downstream consumers have been considered. An engineer considers them, for a moment, and ticks. The practice was intended to produce an *enumeration* and produces a *recollection* — and the artefact is identical either way. **A practice whose compliance artefact is indistinguishable between the intended behaviour and a plausible substitute cannot generate evidence about adoption.** That property is knowable at design time, and is the single most useful thing to check before introducing anything.

**Compliance theatre** is the state where everyone produces the artefact, nobody believes it does anything, and the practice cannot be removed because removing it would look like a reduction in rigour. Atlas is close to it. This is a predictable end state of any mandated practice that was never evaluated, and it has a real cost — every pull request carries twelve items of attention that could have been spent on one that mattered.

## A Practice Change Is a Hypothesis

The discipline is to state the change as something that could be wrong.

| Element | Weak form | Bounded form |
| --- | --- | --- |
| **Change** | "Add a consumer-check to the review checklist" | Same |
| **Failure class targeted** | "Contract breakages" | Changes to shared vocabularies breaking consumers that were not enumerated |
| **Mechanism** | "People will think about consumers" | Enumeration of readers of the changed structure occurs before merge, using a maintained inventory |
| **Expected effect** | "Fewer incidents" | No further instance of the class in the next two campaign cycles |
| **Precondition** | *(unstated)* | **A consumer inventory exists and is maintained** |
| **Disconfirming observation** | *(none)* | An instance of the class recurs, **or** a sample of completed checklists shows no enumeration occurred |
| **Cost** | *(unconsidered)* | One item of attention on every pull request, indefinitely |

The **precondition** row is what would have stopped the Atlas checklist before it was introduced. The mechanism depends on an inventory that does not exist. That is knowable at design time and costs one question: *what has to be true for this to work?*

The **disconfirming observation** is the field that makes the change evaluable. Note that the Atlas version has two parts, and the second is the useful one: waiting for recurrence takes as long as the failure class takes to recur — twelve months, in the event — while sampling completed checklists to see whether enumeration actually happened could have been done in month two, cheaply, by one person reading twenty pull requests.

## Piloting

A pilot bounds the cost of being wrong. Four elements:

**Scope.** Which work the change applies to. Narrow enough to withdraw without a negotiation, wide enough to encounter the conditions the change is for. A consumer-check piloted only on catalogue changes would never meet a shared-vocabulary change, which is the case it exists for.

**Window.** Long enough for the effect to be observable, and stated in advance. A window chosen after the results are known is not a window.

**Population.** What the change applies to, and what it is compared against. At Atlas — one team of four — there is no control group, and pretending otherwise would manufacture rigour that does not exist. The honest position is a before-and-after comparison with all its confounders stated, which is weaker and is what is available.

**Exit.** How the pilot ends: adopted, withdrawn, or extended, decided by a named role on stated evidence. A pilot with no exit becomes the practice by default, which is how most mandated practices actually originate.

The small-organisation caveat matters here. Atlas cannot run a controlled pilot. It can still state a hypothesis, a precondition, a disconfirming observation, and a stop condition — and that is most of the value. **Piloting is not primarily a statistical technique; it is a commitment to finding out.**

## Adoption Is a Social Process

A mandate can compel compliance. It cannot compel the reasoning the practice was meant to produce — that depends on whether people find the practice useful, understand what it is for, and can actually perform it.

This is the point at which diffusion-of-innovations reasoning is relevant: the adoption of a new practice proceeds through a social system over time rather than instantaneously on announcement, and the properties of the practice as perceived by the people adopting it affect whether it takes hold.[^rogers]

**Verification note and boundary.** The metadata for this source is verified; the full text was not accessed for this drafting. This chapter therefore uses it only for the general proposition that adoption is a social process distinct from mandate, and attributes no specific stage model, adopter categorisation, or rate prediction to it. Part XII does **not** use adopter categories to label colleagues, does not present diffusion as a change-management methodology, and does not turn this chapter into a summary of the source.

The practical questions a Quality Engineer can ask, which do not require any framework:

- **Can people actually perform it?** The Atlas checklist fails here — the enumeration it asks for is impossible with what exists.
- **Is the reason legible?** A practice whose purpose is understood survives pressure; one that is only required does not.
- **Who is it costly for?** Practices proposed by one group and paid for by another have a characteristic adoption profile, and it is not a good one.
- **What does it displace?** Attention is finite. Twelve checklist items do not receive twelve times the attention of one.

## Local Optimisation and Cargo Culting

Two recurring failure shapes.

**Local optimisation** is a change that improves the part it touches and degrades the whole. A pre-merge check that adds review latency improves pre-merge defect detection and lengthens the feedback loop — and Chapter 7 established that feedback latency degrades quality outcomes more reliably than most structural properties. Whether the trade is good is an empirical question; the failure is not making it a question.

**Cargo culting** is adopting the form of a practice without the conditions that made it work elsewhere. It is worth being precise about why this fails, because the usual explanation — that people copied blindly — is unfair and unhelpful. The real mechanism is that the practice's effectiveness depended on a precondition that was invisible in the description. Atlas's checklist item is a faithful copy of a practice that works in organisations with maintained consumer inventories. The copy is not stupid; the precondition was not stated, because in the source organisation it was ambient and unremarkable.

The defence against both is the precondition question, asked before adoption: **what has to be true here for this to work, and is it?**

## Reversibility

Part XI established reversibility for architecture. Practice changes are reversible in a different and less obvious way.

Introducing a practice is cheap and mostly technical. Withdrawing one is expensive and mostly social, for reasons unrelated to the practice's value:

- **Withdrawal reads as reduced rigour.** Removing a check introduced after an incident invites the question of what happens when the incident recurs, and answering it requires evidence the organisation usually does not have.
- **Nobody owns removal.** Practices are introduced by someone with a reason and removed by nobody, because removal is not anybody's work.
- **The counterfactual is unavailable.** You cannot show that incidents did not happen because of a practice, so you cannot show they would not increase without it.
- **Attention costs are invisible.** The cost is distributed across everyone, in small amounts, forever, and appears in no budget.

The consequence is that **practices accumulate monotonically** unless removal is designed in at introduction. This is the same shape as Part XI's fourteen-month dual-write: a temporary measure with no owner and no removal condition becomes permanent, not by decision but by default.

The remedy is the same as Chapter 3's: a **stated stop condition and a revision trigger at introduction**, when the practice has no constituency yet and removing it costs nothing. Afterwards is too late — not because the argument is harder, but because there is no longer an occasion on which to make it.

## The Practice Change and Adoption Strategy

The **Practice Change and Adoption Strategy** is an original MSQE teaching artefact, not an industry standard or change-management framework. It is completed **before** a practice change is introduced.

| Field | What it records |
| --- | --- |
| **Failure class targeted** | The specific class, stated so instances can be recognised |
| **Proposed change** | The practice, concretely |
| **Mechanism** | How the change is supposed to prevent the class — the causal story |
| **Precondition** | What must already be true for the mechanism to work, and whether it is |
| **Expected effect** | What should be observable, over what window |
| **Adoption evidence** | What would show the *reasoning* happened, not just the artefact |
| **Disconfirming observation** | What would show it is not working — including a cheap early one |
| **Cost** | Who pays, how often, and in what |
| **Displacement** | What this competes with for attention |
| **Reversibility** | What withdrawal would cost, socially and practically |
| **Stop condition** | What would end it, decided by whom |
| **Revision trigger** | What would require reassessment if it is kept |
| **Owner** | The accountable role for the change and for its withdrawal |

Three fields carry the artefact.

**Precondition.** The cheapest defect-finder in the set. Most failed practice changes fail here and could have been caught by one question at design time.

**Adoption evidence, distinct from compliance.** If you cannot describe evidence that the reasoning occurred — as opposed to the artefact being produced — the change cannot be evaluated, and that is worth knowing before introducing it rather than a year later.

**Stop condition, with a named decider.** A stop condition without a role attached will not be exercised, because exercising it is nobody's job. This is Chapter 5's unowned-signal problem in a different costume.

### Failure modes of the strategy

- **Adoption evidence equals compliance evidence.** The most common error, and it makes the artefact self-certifying. If the evidence is "the checklist is completed", it is compliance.
- **Disconfirming observation is only the failure recurring.** Technically valid and slow. Add a cheaper early one — sampling artefacts, asking three engineers what they did with the item.
- **Precondition is left blank.** Every mechanism has one; a blank field means it was not looked for.
- **Cost is stated once.** The cost of a per-change practice is per change, forever. State it as a recurring cost.
- **The strategy becomes a rollout plan.** Communications, training schedules, and adoption curves are a different document. This one is about whether the change is worth making and how you would know.

## Engineering Perspective

The most useful habit from this chapter is asking, before introducing anything: **what would make me withdraw this?**

If there is no answer, the practice is permanent from the moment it is introduced, whatever anyone intends. That is worth knowing while the decision is still open, and it frequently changes the proposal — narrowing scope, adding a precondition, or replacing a mandated artefact with something that produces observable reasoning.

The second habit is checking whether the compliance artefact can distinguish the intended behaviour from a plausible substitute. If it cannot — as with a tickbox asking whether something was considered — the practice will generate compliance data and no adoption evidence, permanently. That is a design property, knowable in advance, and it is the reason the Atlas checklist could never have been evaluated no matter how long it ran.

## Industry Perspective

Documented engineering practice shows a consistent asymmetry: organisations have well-developed mechanisms for introducing practices — post-incident actions, standards, pipeline gates — and almost none for removing them. Where removal mechanisms exist, they tend to be periodic reviews with an explicit mandate to withdraw, precisely because withdrawal does not happen spontaneously.

The transferable observation is not a particular review cadence. It is that the accumulation is structural rather than a failure of judgement, and that the effective countermeasures act at introduction — stated stop conditions, bounded pilots, sunset dates — rather than relying on someone later making the case for removal against a rhetorical disadvantage.

## Common Misconceptions and Pitfalls

### "Compliance is 100%, so the practice is working."

Compliance is evidence that the artefact is produced. The Atlas checklist has twelve months of complete compliance and two recurrences of the class it targeted.

### "We introduced the checklist and incidents went down."

Two problems. Post-incident periods often show reduced incidence regardless of intervention, because attention is elevated. And Chapter 9 established that an aggregate can move without the underlying thing changing — the Atlas escaped-defect rate improved while both segments worsened.

### "If people aren't following it, we need to enforce it harder."

Sometimes. First check whether people *can* follow it. The Atlas checklist asks for an enumeration that is impossible with the available inventory; enforcement would produce more ticking and no more enumeration.

### "We can always remove it later."

Removal is socially expensive, unowned, and lacks a counterfactual. Unless a stop condition is stated at introduction, "later" does not arrive.

### "It works at other companies."

It worked there under conditions that may not have been stated, because they were unremarkable to the people describing it. Ask what has to be true for the mechanism to work, and check.

### "This change is too small to need a hypothesis."

Small changes accumulate, and each carries a recurring attention cost that appears in no budget. Twelve individually reasonable checklist items produce a checklist nobody reads.

## QA → QE → Engineering-Leadership Transition

A year on, the same checklist is read three different ways.

**QA contribution.** Verifies process compliance accurately: the checklist item is present on every pull request over twelve months, with no exceptions. This is a real finding and it is the finding most organisations stop at.

**QE contribution.** Establishes that compliance evidence and adoption evidence are different, and that no adoption evidence exists. Identifies the mechanism's unmet precondition — the practice requires enumeration and the inventory has never been completed — and observes that the compliance artefact cannot distinguish enumeration from recollection, so the practice was never evaluable. Notes the recurrence of the targeted class and states what that does and does not establish, given the confounders Chapter 9 identified.

**Engineering-leadership contribution.** Names the decision and its owner: whether to keep, revise, or withdraw the item is the delivery owner's, not the Quality Engineer's. Supplies what that decision needs — the unmet precondition, the absent adoption evidence, the recurring attention cost, and the option that actually addresses the failure class, which is completing the inventory rather than asking people to consult one that does not exist. Then states the reversibility problem honestly: withdrawing a post-incident check will read as reduced rigour, and offers the framing that makes withdrawal defensible — replacing an unevaluable practice with one whose precondition is satisfied.

## Summary

Mandate, compliance, and adoption are three different things with different evidence, and a practice whose compliance artefact cannot distinguish the intended behaviour from a plausible substitute can never generate adoption evidence — a property knowable at design time. A practice change should be stated as a hypothesis with a mechanism, a precondition, an expected effect, and a disconfirming observation, including a cheap early one rather than waiting for recurrence. Piloting bounds the cost of being wrong; in a small organisation it cannot be controlled, but stating the hypothesis and the stop condition retains most of the value. Adoption is a social process that a mandate cannot compel. Local optimisation and cargo culting are both defended against by the precondition question. Practices accumulate monotonically because withdrawal is socially expensive, unowned, and lacks a counterfactual — so removal must be designed in at introduction, when the practice has no constituency.

## Key Takeaways

- **Compliance is measurable and cheap; adoption is what the change was for.** Reporting the first as the second is the characteristic failure.
- A compliance artefact that cannot distinguish intended behaviour from a plausible substitute **can never produce adoption evidence** — check this at design time.
- Every mechanism has a **precondition**. Most failed practice changes fail there, and one question at design time finds it.
- A disconfirming observation that is only "the failure recurs" is valid and slow. **Add a cheap early one.**
- Piloting is **a commitment to finding out**, not primarily a statistical technique — which is why a four-person team can still do it.
- **Cargo culting is a precondition problem, not a stupidity problem**: the condition that made the practice work was ambient and went unstated.
- Practices accumulate monotonically because withdrawal reads as reduced rigour, is nobody's job, and has no counterfactual.
- **Design removal in at introduction** — a stop condition with a named decider, stated while the practice has no constituency.
- Ask before introducing anything: *what would make me withdraw this?* No answer means permanent.

## Review Questions

1. Distinguish mandate, compliance, and adoption for the Atlas checklist, stating the evidence available for each.
2. Explain why the checklist could never have been evaluated, as a property of its compliance artefact rather than of anyone's behaviour.
3. State the unmet precondition for the checklist's mechanism and explain how one question at design time would have found it.
4. Give a disconfirming observation for the checklist that could have been checked in month two, and say what it would have cost.
5. Why is withdrawing a practice harder than introducing one? Give three reasons that are unrelated to the practice's value.
6. Explain cargo culting in terms of preconditions rather than blind copying, using the Atlas checklist.
7. A pre-merge check improves pre-merge detection and adds review latency. Name the failure shape and say what makes it a failure rather than a trade.

## Interview Questions

1. How would you evaluate whether a process change your team introduced actually worked?
2. Describe a practice your organisation follows that you believe adds no value. How would you go about establishing that?
3. How do you distinguish people not following a practice from people being unable to?
4. What would you put in place at the point of introducing a new practice, to make it possible to remove later?

## Practical Exercise

Design a reversible practice-change pilot for the following synthetic Atlas Commerce situation, producing a full **Practice Change and Adoption Strategy**.

*The pre-merge review checklist item — "Have downstream consumers been considered?" — has been completed on every pull request for twelve months, and the failure class it targeted has recurred twice. The consumer inventory for the `orders` table has never been completed: the analytics pipeline is confirmed to exist with unknown read behaviour, and the partner logistics integration's read behaviour is unknown. Atlas has four engineers owning all eight responsibilities. The next campaign is eleven weeks away. The delivery owner is willing to consider a change but is not willing to add work to the campaign window.*

Your submission must:

- state the failure class so that a future instance could be recognised against it;
- propose a change whose **precondition is actually satisfiable** with what Atlas has, and state the precondition explicitly;
- describe the mechanism as a causal story that could be wrong;
- specify adoption evidence that is **distinct from compliance evidence**, and explain how it distinguishes the reasoning from the artefact;
- specify **two** disconfirming observations — one cheap and early, one definitive and slow — with the cost and timing of each;
- state the recurring cost and what it displaces;
- state what withdrawal would cost socially and how you would make it defensible; and
- give a stop condition and a revision trigger, each with a named accountable role.

Then address the existing checklist item in three or four sentences: state what you would recommend happens to it, what evidence supports that, what your recommendation **cannot** establish, and who owns the decision.

Finally, answer in two sentences: the delivery owner will not add work to the campaign window. Explain how that constraint changes your proposal, and whether it changes your recommendation about the existing item.

Do not propose a transformation programme or a named change framework. Use only synthetic data.

## Further Reading

- [Part XI Chapter 10 — Evolution, Migration, Reversibility, and Architecture Debt](../../part-11-system-design-architecture/chapters/chapter-10-evolution-migration-reversibility-and-architecture-debt.md) — reversibility for architecture, which this chapter parallels for practice.
- [Part VII — Cloud & DevOps](../../part-07-cloud-devops/README.md) — delivery practice and pipeline stages, which this chapter reasons about rather than re-teaches.

## References

[^rogers]: Rogers, E. M. *Diffusion of Innovations*, 5th edition. Free Press, 2003. Scholarly book; no DOI. **Verification:** publisher and edition record verified; **full text not accessed**. Used **only** for the general proposition that adoption of a new practice is a social process distinct from mandate and compliance. No stage model, adopter categorisation, rate prediction, or change-management methodology is attributed to this source, and adopter categories are not used to characterise colleagues. Accessed 2026-08-15.

The mandate/compliance/adoption distinction, the practice-change hypothesis form, the precondition test, the compliance-artefact distinguishability property, and the Practice Change and Adoption Strategy are **original MSQE teaching material**, not industry standards or change-management frameworks. Chapter 9's measurement discipline is consumed here rather than restated. Atlas Commerce is a synthetic teaching baseline and all figures are illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish mandate, compliance, and adoption, and name the evidence for each.
- [ ] Determine at design time whether a compliance artefact can distinguish intended behaviour from a plausible substitute.
- [ ] State a practice change as a hypothesis with a mechanism and a precondition.
- [ ] Specify a cheap early disconfirming observation as well as a definitive slow one.
- [ ] Explain why withdrawal is harder than introduction, for reasons unrelated to value.
- [ ] Explain cargo culting as an unstated-precondition problem.
- [ ] Recognise local optimisation and state the trade it conceals.
- [ ] Complete a Practice Change and Adoption Strategy with a stop condition and a named decider.

## Chapter Navigation

Previous: [Chapter 9 — Measuring Engineering and Quality Practice](chapter-09-measuring-engineering-and-quality-practice.md) · Next: Chapter 11 — Career Growth as an Evidence-Led Practice *(not yet drafted)*
