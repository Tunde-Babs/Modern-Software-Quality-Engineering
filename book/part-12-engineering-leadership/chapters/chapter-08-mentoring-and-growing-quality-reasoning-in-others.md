# Chapter 8 — Mentoring and Growing Quality Reasoning in Others

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 8 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapters 1–7 |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** If your colleague can answer the next question without you, you transferred reasoning. If they can only answer this one, you transferred an answer — and you will be asked again.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

At Atlas, every payment-reconciliation question goes to the same engineer.

This is not a complaint about anyone. He is good at it, he answers quickly, and the answers are right. When 340 orders ended in `PAYMENT_UNKNOWN` during the promotion, he was the one who worked out which of them had actually been charged, by reasoning about the provider's behaviour under degradation, the retry pattern, and what the deduplication key does and does not do. Nobody else could have done it that fast.

The organisation reads this as a strength. Payment problems get solved quickly, and there is a clear person to ask.

Read structurally, it is a single point of failure that has been mistaken for reliability. If he is unavailable during the next campaign, Atlas cannot answer the question of whether a customer was charged — a question whose authoritative answer lives with the payment provider, not with Atlas, and which therefore requires exactly the reasoning he holds.

The obvious response is documentation, and documentation is worth having. It also will not fix this. What the other three engineers lack is not a document describing the payment path; it is the *reasoning* — how to work out which evidence bears on the question when the provider is degraded and the local records are ambiguous. That is not a fact to be written down. It is a way of approaching a problem, and it transfers differently.

By the end of this chapter you should be able to design an exchange that transfers it, and to say honestly what you could and could not claim about the result.

## Why This Chapter Matters

Everything in this handbook so far produces reasoning that lives in one person. Chapter 3 addressed making a *decision's* reasoning durable in writing. This chapter addresses making a *person's* reasoning reproducible in someone else — which is the only mechanism by which quality reasoning outlives any individual, including you.

That gives it a practical claim on a Quality Engineer's attention independent of any interest in developing people. Chapter 7 identified knowledge concentration as a structural risk. This chapter is the response to it, and it is one of the few structural conditions an individual contributor can actually act on without anyone's authority.

The chapter is Quality Engineering-specific throughout. It is about transferring investigation reasoning, evidence judgement, uncertainty handling, and risk communication — not about mentoring in general. It is **not** people management, performance review, coaching certification, an HR development framework, hiring practice, a psychometric instrument, or therapeutic or counselling practice, and it assesses capability rather than people.

## Learning Objectives

After completing this chapter you should be able to:

- distinguish mentoring, coaching, teaching, sponsorship, management, and performance management, and say which a situation calls for;
- design an exchange that transfers reasoning rather than an answer;
- make your own reasoning visible, including the parts you normally skip;
- structure supported practice and reduce support deliberately as capability develops;
- give feedback that is specific, evidence-linked, and about reasoning rather than about a person;
- recognise and counteract the power asymmetry in a mentoring relationship;
- state honestly what a mentor can and cannot claim to have caused; and
- produce a Capability Growth Plan.

## Six Things That Are Not the Same

These are used interchangeably and carry different obligations, boundaries, and risks.

| Activity | What it is | Who it serves | Where it sits in Part XII |
| --- | --- | --- | --- |
| **Mentoring** | Transferring reasoning and judgement over time, in a relationship the mentee can leave | The mentee | This chapter |
| **Coaching** | Helping someone find their own answer through questioning, without supplying expertise | The coachee | Referenced, not taught |
| **Teaching** | Conveying content that is known and transferable as content | The learner | Not this chapter's subject |
| **Reviewing** | Assessing a specific artefact against expectations | The work | Parts III–XI |
| **Sponsorship** | Advocating for someone's opportunities when they are not present | The person sponsored | Named for contrast only |
| **Management** | Direction, prioritisation, performance, and organisational accountability for someone's work | The organisation | **Out of scope** |
| **Performance management** | Formal assessment of an individual against role expectations | The organisation | **Out of scope** |

Two boundaries need stating plainly.

**Sponsorship is named here for contrast, not taught.** Advocating for someone's opportunities is a real and consequential activity, and it is distinct from mentoring in that it happens without the person present and concerns access rather than capability. Part XII does not teach it, because doing so responsibly requires organisational context — who allocates opportunities, on what basis — that a handbook does not have.

**Mentoring and management must not merge.** When a manager mentors someone they also assess, the mentee is reasoning in front of a person who decides things about them. That does not make it impossible, and it is extremely common. It does mean the power asymmetry discussed below is sharper, and that the mentee's willingness to say "I don't understand" is under pressure that neither party may notice.

## Transferring Reasoning, Not Answers

The mechanism this chapter relies on comes from the cognitive-apprenticeship literature: expertise transfers when expert reasoning is made **visible**, then practised with support, and the support is **faded** as capability develops.[^cognitive-apprenticeship] The reason it matters for engineering is that expert reasoning is normally invisible — the expert produces a conclusion, and the steps that produced it were internal and fast.

**Verification note:** the metadata for this source is verified and the mechanism described above is its widely reported core. The full text was not accessible for this drafting, so this chapter attributes only the general mechanism — visible reasoning, supported practice, fading support — and does **not** attribute to the source any specific instructional sequence, technique catalogue, or claim about software engineering, none of which it addresses.

The applied form is a contrast worth working through carefully.

### Two exchanges, same problem

**Exchange A — the answer.**

> *"Which of these 340 orders were actually charged?"*
> "Pull the provider's settlement report for that window and match on the order reference. Anything in the report was charged. For the ones that aren't, check whether we got a timeout rather than a decline — timeouts are the ambiguous ones."

Accurate, fast, and useful. The colleague now knows how to resolve *these* 340 orders.

**Exchange B — the reasoning.**

> *"Which of these 340 orders were actually charged?"*
> "Before I answer — where does the authoritative record of whether a customer was charged actually live?"
> *"...the provider, not us."*
> "Right. So what does that make our local records?"
> *"Evidence about what we attempted, not about what happened."*
> "Good. Now: we retry the payment call up to twice with no backoff and the deduplication key regenerates on retry. What does that do to the relationship between our records and theirs?"
> *"We might have attempted the same payment three times and have no way of telling from our side whether they were treated as one or three."*
> "That's the whole problem. So what do you need from the provider, and what will still be ambiguous after you get it?"

Slower. The colleague now knows something more general: that when the authoritative record lives elsewhere, local records are evidence about attempts rather than outcomes — which applies to the fulfilment boundary, the partner integration, and the next dependency Atlas adds.

The difference is not that Exchange B uses questions. It is that B makes the *structure* of the reasoning visible — locate the authoritative record, characterise what local evidence can establish, identify what the mechanism does to that relationship — rather than the conclusion the structure produced.

### Making reasoning visible

The parts experts skip are the parts worth saying aloud:

- **What you noticed first, and why that.** "The first thing I looked at was the timeout behaviour, because ambiguity in payment almost always comes from a boundary where we lost the response rather than got a bad one."
- **What you ruled out immediately.** Experts discard whole branches without conscious thought; the discarded branches are where novices spend days.
- **Where you were uncertain.** "I don't actually know whether their reconciliation query is guaranteed while they're degraded — that's an assumption I'm making."
- **What would have changed your mind.** The falsifier, which Chapter 6 established is what makes a claim a claim.

The uncertainty item is the most valuable and the most often omitted, because admitting it feels like a poor demonstration. It is the opposite: a mentee who never sees their mentor uncertain learns that competence means certainty, which is the single most damaging thing this handbook could teach.

### Fading support

Support that never reduces produces dependence, which is the failure this chapter exists to prevent. A workable progression:

| Stage | Mentor does | Mentee does | Move on when |
| --- | --- | --- | --- |
| **Visible reasoning** | Works the problem aloud, including uncertainty | Observes, asks | The mentee can predict the next question |
| **Shared work** | Works alongside, prompting at decision points | Drives, with support at the hard steps | Prompts are being anticipated |
| **Supported independence** | Available, reviews afterwards | Works it alone, brings the reasoning | Review finds reasoning sound, not just conclusions |
| **Independence** | Not involved | Owns it, including judging when to ask | Sustains across an unfamiliar case |
| **Reversal** | Asks the mentee to explain their reasoning to a third person | Teaches it | — |

**Deliberate under-specification** is the technique that makes the middle stages work: give the problem without the frame. "Work out whether these orders were charged" transfers more than "pull the settlement report and match on order reference", because constructing the frame is the capability being developed. This has a cost in time and produces worse first attempts, which is what makes it hard to do under delivery pressure — and worth naming as a trade rather than pretending it is free.

## Power Asymmetry

Mentoring is not a conversation between equals, and a chapter that ignored this would produce the dependence it intends to prevent.

Five controls, all of which must be explicit:

**Seniority does not prove correctness.** The mentor's reasoning is evidence and is subject to the same claim-and-limitation discipline as everything else in this handbook. A mentee who accepts a conclusion because of who said it has learned the opposite of the intended lesson — and has learned it from you, by example.

**Mentors are sometimes wrong.** Not as a humility formula but as a fact with consequences. The Atlas engineer's reasoning about provider behaviour under degradation rests on an assumption Part XI records as never established. If he presents it as knowledge, the mentee inherits both the reasoning and the unmarked assumption.

**Mentees must be able to challenge the reasoning.** The operative question is: *can this person disagree with my reasoning without paying a social or career cost?* If the honest answer is no — because you review their work, influence their opportunities, or are simply much more senior — then their agreement carries no information, and you should stop treating it as confirmation.

**A mentor who is never challenged should treat that as a signal.** Not as evidence of being right. Over months, some of your reasoning was wrong; if none of it was ever questioned, the relationship is suppressing disagreement rather than lacking occasion for it.

**The goal is transferable judgement, not a copy of you.** Reasoning style, tooling preference, risk appetite, and temperament are not the payload. A mentee who reaches sound conclusions by a route you would not have taken has succeeded, and treating that as a deviation to be corrected is how mentoring becomes cloning.

### Authority leakage

There is a specific failure worth naming, because it connects directly to Chapter 4.

A mentoring relationship creates standing influence. That influence does not confine itself to the mentoring context — when the mentor expresses a view in a design review, the mentee weighs it differently than they would a peer's. This is **authority leakage**: informal authority acquired in one context operating in another where it was never granted.

The consequence is that a mentoring relationship can quietly become one of the places where a concern goes unraised. The mentee sees a problem with the mentor's proposal and does not say it, not from fear but because the habit of the relationship is that the mentor's reasoning is the one being learned from.

Counteracting it is mostly about being explicit: separating "here is how I would reason about this" from "here is what I think we should do", asking for the mentee's assessment before giving yours, and treating their disagreement in public as a good outcome rather than an awkward one.

## What a Mentor Cannot Claim

Capability growth has multiple causes and mentoring is one of them, usually not separable from the others.

A mentee who becomes a better investigator over six months has also done six months of work, seen incidents, read code, talked to other colleagues, and simply had more time. **No mentor can establish that their contribution caused the growth**, and the honest evidence class for the claim "my mentoring developed this capability" is *inferred*, with a confound so large that the inference is weak.

What can be evidenced is narrower and still worth recording: that a capability which was absent is now demonstrable, on stated evidence, across stated cases. That is a claim about the mentee's capability, not about your causal contribution to it — and it is the more useful claim anyway, because it is the one that bears on whether the knowledge concentration has actually been reduced.

This is not false modesty. It is the same discipline Chapter 6 applied to culture claims, applied where the person making the claim has an obvious interest in it being true.

## The Capability Growth Plan

The **Capability Growth Plan** is an original MSQE teaching artefact, not an industry standard, competency framework, or development instrument. It plans the transfer of a specific capability and records what would count as evidence that it transferred.

**It assesses a capability, never a person.** It contains no rating, no level, no readiness judgement, and no statement about an individual's performance, potential, or worth. If a completed plan could be used in a performance discussion, it has been filled in wrongly.

| Field | What it records |
| --- | --- |
| **Capability** | The reasoning capability, stated as something someone does, not knows |
| **Why it matters** | The concentration or continuity risk it addresses |
| **Currently held by** | Roles, and how many people — a count, not an assessment |
| **Observable now** | What the recipient can already do, from evidence |
| **Target** | What they would be able to do, stated observably |
| **Visible-reasoning cases** | Specific problems the mentor will work aloud, including the uncertainty |
| **Supported-practice cases** | Cases the recipient drives, with support named |
| **Fading plan** | What support is withdrawn, when, on what signal |
| **Evidence of transfer** | What would demonstrate the capability, on an unfamiliar case |
| **Challenge check** | How the recipient is invited to disagree, and whether they have |
| **Limitation** | What this plan cannot establish, including attribution |
| **Revision trigger** | What would indicate the plan is not working |

Two fields distinguish this from a training plan.

**Evidence of transfer must involve an unfamiliar case.** A recipient who can resolve the *same* problem has learned an answer. The capability is demonstrated when the reasoning transfers to a case the mentoring did not cover — which is why the Atlas plan should test on the fulfilment boundary rather than on another payment incident.

**Challenge check.** Recording whether the recipient has actually disagreed with the mentor's reasoning, and how they were invited to, is the only practical guard against the asymmetry. A plan in which nobody ever disagreed over months is reporting something, and it is not agreement.

### Failure modes of the plan

- **It becomes a curriculum.** A list of topics to cover is a teaching plan. The capability is a way of reasoning, and it develops on cases.
- **Evidence of transfer is the original case.** Solving the problem they were shown is not evidence.
- **It drifts into assessment of the person.** "Ready for more responsibility" is a performance judgement in a document that is not one, and does not belong in this artefact.
- **Fading is never executed.** The plan describes withdrawal and the mentor keeps answering, usually because answering is faster. The revision trigger should catch this.
- **Attribution is claimed.** "This plan developed the capability" overstates. The plan records that the capability is now demonstrable.

## Engineering Perspective

The practical test to carry from this chapter: after an exchange, ask whether the colleague can now answer the **next** question, or only this one.

It is answerable, cheap, and diagnostic. If you have been asked variations of the same question three times by the same person, the earlier exchanges transferred answers. That is not a failing on their part; it is information about how you responded.

The second thing worth carrying is that this is one of the few structural conditions an individual contributor can act on without authority. You cannot reorganise Atlas. You can change what happens the next time someone asks you a payment question, and if the reasoning transfers, the concentration genuinely reduces — which is a structural improvement produced by an individual with no organisational authority whatsoever.

## Industry Perspective

Documented engineering practice contains several mechanisms that transfer reasoning as a side effect of doing work: pairing, code review that asks why rather than what, incident reviews that reconstruct what people knew at each point, and rotations that deliberately move people through unfamiliar areas. Where these work as capability transfer, the common feature is that the reasoning becomes **visible in the course of real work** rather than being described separately.

Where they fail, the failure is usually the same: the mechanism is retained and the visibility is dropped. A review that only records approval, a pairing session where one person types and narrates nothing, an incident review that lists causes without reconstructing what was known — each preserves the form and loses the transfer.

## Common Misconceptions and Pitfalls

### "We should document it."

Worth doing and insufficient. Documentation transfers facts well and reasoning poorly. What the other Atlas engineers lack is not a description of the payment path but the approach to reasoning about ambiguous evidence when the authoritative record lives outside the system.

### "Mentoring is for junior engineers."

Capability transfer runs in every direction and the concentration risk is usually held by senior people. The Atlas case is a senior engineer holding knowledge nobody else has; the mentoring need is his, and it is about transferring outward.

### "If they're not asking questions, it's going well."

Or the asymmetry is suppressing them. Absence of questions is compatible with understanding and with not wanting to appear lost, and you cannot distinguish these by waiting.

### "I'll just tell them the answer this time — we're under pressure."

Frequently correct, and worth doing consciously. The cost is that the next occasion will also be under pressure. Naming it as a trade — "I'm going to give you the answer now because of the campaign; let's work through the reasoning next week" — is the difference between a decision and a habit.

### "My mentoring developed this engineer."

Unsupportable, and the confound is enormous. What can be evidenced is that a capability is now demonstrable. That claim is both defensible and more useful.

### "They should approach it the way I do."

Reasoning style is not the payload. A mentee reaching sound conclusions by a different route has succeeded.

## QA → QE → Engineering-Leadership Transition

Take the payment-reconciliation knowledge concentration.

**QA contribution.** Answers the colleague's question correctly and quickly, and does so reliably enough that people know to ask. This is genuinely valuable and it is why the concentration formed.

**QE contribution.** Recognises the concentration as a structural risk rather than a personal strength: if one person is unavailable, Atlas cannot answer whether a customer was charged during a campaign — and the authoritative record lives with the provider, so the question cannot be resolved by inspecting Atlas's own systems. Identifies that the transferable asset is the reasoning about ambiguous evidence, not the facts about the payment path.

**Engineering-leadership contribution.** Designs the transfer: works the reasoning aloud on a real case including the assumption Part XI records as never established; hands over an unfamiliar case with deliberate under-specification; fades support on a stated signal; and records what would demonstrate the capability on the fulfilment boundary rather than on another payment incident. Then states honestly that the plan cannot establish that the mentoring caused the growth, only that the capability is now demonstrable — and checks whether the recipient has ever disagreed with him.

## Summary

Mentoring transfers reasoning; documentation transfers facts; the Atlas concentration needs the former. Mentoring, coaching, teaching, reviewing, sponsorship, management, and performance management are distinct, and the last two are out of scope. Reasoning transfers when it is made visible — including what was noticed first, what was ruled out, where the mentor was uncertain, and what would change their mind — then practised with support that is deliberately faded. Power asymmetry is real: seniority does not prove correctness, mentors are sometimes wrong, a mentee who cannot disagree without cost provides no confirmation, never being challenged is a signal rather than a vindication, and the goal is transferable judgement rather than a copy. Authority leakage extends the mentor's informal influence into contexts where it was never granted, and can quietly make the relationship a place where concerns go unraised. No mentor can establish that their mentoring caused capability growth; what can be evidenced is that the capability is now demonstrable on an unfamiliar case.

## Key Takeaways

- Documentation transfers facts; **reasoning transfers through visible practice and fading support**.
- The parts experts skip — what they noticed first, what they ruled out, where they were uncertain — are the parts worth saying aloud. **Concealing uncertainty teaches that competence means certainty.**
- **Deliberate under-specification** develops frame-construction, at a real cost in time and first-attempt quality; name it as a trade.
- Ask: *can this person disagree with my reasoning without paying a social or career cost?* If not, their agreement carries no information.
- **Never being challenged is a signal about the relationship**, not evidence of being right.
- **Authority leakage** carries informal influence into contexts where it was never granted, and can turn a mentoring relationship into a place where concerns go unraised.
- The goal is transferable judgement, **not a copy of the mentor**; a sound conclusion reached by a different route is a success.
- No mentor can establish causation for capability growth; evidence that the capability is **demonstrable on an unfamiliar case** is both defensible and more useful.
- Capability transfer is one of the few structural conditions an individual contributor can act on with no organisational authority.

## Review Questions

1. Distinguish mentoring, coaching, and sponsorship. Which does the Atlas payment concentration require, and why not the others?
2. Rewrite an answer-giving exchange as a reasoning-transfer exchange, and identify the general principle the second version conveys that the first does not.
3. Why is concealing your own uncertainty from a mentee actively harmful rather than merely incomplete?
4. State the operative question for power asymmetry and explain what a mentee's agreement establishes when the answer is "no".
5. Explain authority leakage using an Atlas design review, and connect it to Chapter 4's three outcomes.
6. Why must evidence of transfer involve an unfamiliar case? Give an Atlas example of a suitable one.
7. A mentor claims their mentoring developed an engineer's investigation capability. Classify the evidence, name the confound, and state what can be claimed instead.

## Interview Questions

1. How do you help a colleague develop judgement rather than just answering their question?
2. Describe a time you were wrong about something you had advised someone on. How did you handle it?
3. How would you tell whether someone feels able to disagree with you?
4. How do you know whether knowledge you hold has actually transferred to someone else?

## Practical Exercise

Produce a **Capability Growth Plan** for the following synthetic Atlas Commerce capability concentration, then design the mentoring sequence.

*One Atlas engineer holds the reasoning required to determine, after a payment-provider degradation, which customers were actually charged. The authoritative record of whether a customer was charged lives with the payment provider, not with Atlas. Checkout retries the payment call up to twice with no backoff, and the deduplication key at the fulfilment boundary is regenerated on retry, so it does not deduplicate. Whether the provider's reconciliation query is contractually guaranteed, and how it behaves while the provider is degraded, has never been established. The last promotion produced 340 orders in `PAYMENT_UNKNOWN`. Of the four engineers, two have never operated a message broker. The next campaign is eleven weeks away.*

Complete every field. Your submission must:

- state the capability as something a person **does**, not something they know;
- distinguish the transferable reasoning from the facts that documentation would cover;
- specify visible-reasoning cases including **at least one point where the mentor must expose an unverified assumption**;
- design a fading sequence with a stated signal for each withdrawal of support;
- specify evidence of transfer on an **unfamiliar** case — not another payment incident — and justify your choice;
- state a challenge check: how the recipient is invited to disagree, and what you would conclude if they never did; and
- state what the plan cannot establish, including attribution.

Then answer in three or four sentences: the campaign is eleven weeks away and the team has four engineers owning eight responsibilities. Explain what you would legitimately reduce in this plan under that constraint, what you would refuse to reduce and why, and who owns the decision about whether the plan happens at all.

Your plan must contain no assessment of the individual, no rating, no level, and no readiness judgement. Use only synthetic data.

## Further Reading

- [A. Collins, J. S. Brown, and S. E. Newman — Cognitive Apprenticeship: Teaching the Crafts of Reading, Writing, and Mathematics](https://doi.org/10.4324/9781315044408-14) — the visible-reasoning, supported-practice, and fading mechanism, in its original educational context.
- [Part XI — System Design & Architecture](../../part-11-system-design-architecture/README.md) — the payment-path evidence this chapter's scenario reasons about.

## References

[^cognitive-apprenticeship]: Collins, A., Brown, J. S., and Newman, S. E. [Cognitive Apprenticeship: Teaching the Crafts of Reading, Writing, and Mathematics](https://doi.org/10.4324/9781315044408-14). In Resnick, L. B. (ed.), *Knowing, Learning, and Instruction: Essays in Honor of Robert Glaser*, pp. 453–494. Originally published 1989; DOI resolves to the Routledge reissue. **Verification:** bibliographic metadata verified against Crossref. **Full text not accessed**; this chapter attributes only the general mechanism of making expert reasoning visible, supporting practice, and fading support, and attributes no specific instructional sequence, technique catalogue, or software-engineering claim to the source. Metadata accessed 2026-08-14.

The six-activity distinction, the fading progression, the power-asymmetry controls, authority leakage, and the Capability Growth Plan are **original MSQE teaching material**, not industry standards or validated development frameworks. Atlas Commerce is a synthetic teaching baseline and all figures are illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish mentoring, coaching, teaching, reviewing, sponsorship, management, and performance management.
- [ ] Convert an answer-giving exchange into one that transfers reasoning.
- [ ] Say aloud what you noticed first, what you ruled out, where you were uncertain, and what would change your mind.
- [ ] Design a fading sequence with a stated signal for each withdrawal of support.
- [ ] State the operative question for power asymmetry and act on a "no" answer.
- [ ] Recognise authority leakage and connect it to unraised concerns.
- [ ] Specify evidence of transfer on an unfamiliar case.
- [ ] Complete a Capability Growth Plan that assesses a capability and never a person.

## Chapter Navigation

Previous: [Chapter 7 — Organisation Structure and Its Quality Consequences](chapter-07-organisation-structure-and-its-quality-consequences.md) · Next: [Chapter 9 — Measuring Engineering and Quality Practice](chapter-09-measuring-engineering-and-quality-practice.md)
