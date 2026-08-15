# Chapter 4 — Disagreement, Escalation, and Recording an Unheeded Concern

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 4 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapters 1–3 |
| Estimated study time | 165 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** The question is not whether your concern was accepted. It is whether the risk ended up with an owner. A declined concern with a named owner is a decision; a declined concern with no owner is a gap that will be discovered by an incident.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

A Quality Engineer raises a concern about a contract change six weeks before the campaign. A new order status value is being introduced. Part XI's evidence base records what happened the last time this was done: a status-value addition caused the notification module to stop sending silently, the support console to render blank, and the finance settlement figure to be understated for four days before anyone noticed. The consumer inventory for the `orders` table has still never been completed — the analytics pipeline is confirmed to exist with unknown read behaviour, and the partner logistics integration's read behaviour is likewise unknown.

She raises it with the delivery owner, who listens properly, asks two good questions, and says: *"I hear you. We can't complete the inventory before the campaign — we have four engineers and eight responsibilities. We're shipping it. If it breaks, we'll fix it."*

She disagrees. She thinks the silent-failure class is worse than the delivery owner is treating it as, precisely because the last one took four days to detect. But the delivery owner is entitled to make this call, has heard the evidence, and has a real constraint.

She says "okay" and goes back to work. Nothing is written down.

Six weeks later the campaign runs. The analytics pipeline silently drops the new status from its order-completion figures, and the commercial function plans the following quarter against numbers that are wrong by an amount nobody can quantify afterwards. In the review, someone asks whether anyone had considered the consumer risk.

There are two failures here and only one of them is hers. The delivery owner made a decision he was entitled to make. What was missing is that nobody recorded which risk was being accepted, by whom, or what would have signalled that it had materialised — so when it did, there was no owner and no detection. By the end of this chapter you should be able to say what she should have written, in about six lines, without it reading as blame, self-protection, or an attempt to overturn the decision.

## Why This Chapter Matters

This is the chapter where the discipline of the previous three is tested, because it is where the engineer's judgement and the owner's decision come apart.

Two failure modes dominate, and they are mirror images. The first is **escalating everything**: treating every disagreement as a matter of principle, which exhausts the engineer's credibility and makes the genuinely serious concern indistinguishable from the routine one. The second is **accepting everything**: going quiet after the first "no", which leaves risks unowned and undetected and eventually leaves the engineer wondering why they bother producing evidence at all.

Both are avoidable, and the way to avoid them is not courage or diplomacy. It is deciding *in advance* what would justify escalation, and understanding that the outcome that matters is not agreement but ownership.

This chapter is also the one that must be honest about something the rest of the handbook can avoid: raising a concern can carry cost for the person raising it, and that cost varies enormously by organisation and context. A chapter that taught documented dissent while implying it is always safe would be dishonest. A chapter that offered legal or employment advice would be out of its depth. This one does neither, and says so explicitly.

## Learning Objectives

After completing this chapter you should be able to:

- treat disagreement as ordinary engineering activity rather than as conflict or disloyalty;
- distinguish disagreement, dissent, challenge, and escalation, and say which a situation calls for;
- define an escalation condition **before** it is needed, and apply proportionality factors to it;
- distinguish the three legitimate outcomes of a raised concern, and identify which one is a finding;
- explain why the meaningful distinction is **owned versus unowned risk**, not accepted versus declined;
- state the bounded relationship between psychological safety and speaking up, within the construct's actual scope;
- reason about the personal risk of escalation without expecting a handbook to resolve it;
- write a record of an unheeded concern that is neither blame, threat, self-protection theatre, nor an attempt to override ownership; and
- produce a Disagreement and Escalation Record.

## Disagreement Is Ordinary

Engineering disagreement is not a breakdown. It is the mechanism by which a group with distributed knowledge arrives at a better decision than any member would alone, and an engineering culture in which disagreement is rare is far more likely to be suppressing it than to have converged on truth.

Four things are commonly bundled together and are worth separating:

| Term | What it is | Where it goes |
| --- | --- | --- |
| **Disagreement** | Holding a different view about evidence, risk, or the right course | Stays with the people deciding |
| **Dissent** | Continuing to hold and state a different view after a decision has been made | Stays with the decision, and may be recorded |
| **Challenge** | Asking the questions that test whether a decision's basis holds | Part of the decision process, not opposed to it |
| **Escalation** | Bringing a concern to someone with broader authority than the current owner | Leaves the current decision loop |

Most of what engineers call escalation is actually challenge, and most of what feels like escalation to a decision owner is actually dissent. Naming them correctly lowers the temperature considerably, because *"I disagree and I want that recorded"* is a much smaller act than *"I am going over your head"* — and it is usually the one that is actually needed.

**Disagree and commit** deserves a precise treatment, because it is routinely used to mean "stop talking." Its legitimate form is: the decision is made, I will support its execution rather than undermine it, and my disagreement is on the record so that if the predicted problem occurs we learn from it rather than re-litigating who said what. Its illegitimate form is: the disagreement disappears, and with it any possibility of learning. The difference between the two is entirely whether anything was written down.

## Escalation Is Proportionate

Escalation is neither a virtue nor a betrayal. It is an instrument with a cost, and the discipline is matching the instrument to the situation.

The following factors determine proportionality. None of them is a score, and they are not weighted or combined into a number — they are the dimensions along which you reason.

| Factor | The question |
| --- | --- |
| **Evidence strength** | How strong is the evidence, and of what class? Is this measured, observed, reported, or inferred? |
| **Potential impact** | What is the worst plausible consequence, and for whom — including people outside the organisation? |
| **Reversibility** | If this goes wrong, can it be undone? At what cost? |
| **Detectability** | Would we notice if it went wrong, and how quickly? |
| **Urgency** | Is there a point after which raising it changes nothing? |
| **Uncertainty** | How much of my concern rests on inference rather than evidence? |
| **Decision ownership** | Does this risk have an owner who has heard it and accepted it? |
| **Available path** | Is there a review mechanism designed for exactly this, that I have not used? |
| **Obligation** | Do professional, safety, regulatory, or legal obligations apply? |

**Detectability** deserves emphasis, because engineers systematically under-weight it. A reversible failure that is detected in minutes is a very different proposition from a reversible failure that is detected in four days — and Atlas's history contains precisely that case. The finance understatement was individually recoverable; what made it serious was that nothing surfaced it. A concern about a silent failure class is stronger than the same concern about a loud one, and the argument for it is *detectability*, not severity.

**Available path** is the factor that most often shows escalation is premature. If the organisation has a design review, a risk register, an architecture forum, or a security review that has not been used, using it is not escalation and is usually more effective — it puts the concern in front of people whose role is to consider it.

**Obligation** is the factor that can override the others. Where safety, regulatory, legal, security-disclosure, or professional obligations apply, the proportionality reasoning above does not exhaust what is required, and formal or specialist channels may be mandatory rather than optional. This handbook does not enumerate those channels, because they depend on jurisdiction, sector, and employer, and getting them wrong has consequences a handbook cannot carry. Where an obligation may apply, obtain appropriate specialist guidance rather than reasoning it out from this chapter.

## The Three Legitimate Outcomes

When a concern is raised, exactly three outcomes are legitimate. Distinguishing them is the core skill of this chapter, because they look similar in the moment and behave completely differently afterwards.

### Outcome 1 — The concern is addressed

The owner agrees, and something changes: the work is done, deferred with a condition, or scoped differently.

This is the outcome engineers hope for and it needs the least discussion. One caution: verify that what was agreed is what happens. A concern that is accepted verbally and then not scheduled has produced outcome 3 while feeling like outcome 1.

### Outcome 2 — The concern is declined and the risk is explicitly owned

The owner has heard the evidence, understood it, and decided against acting — accepting the risk, by name, for a stated period, with the acceptance recorded.

**This is a good outcome.** It is worth stating plainly, because engineers frequently experience it as a failure. The delivery owner in the opening story is entitled to decide that the campaign date outweighs an unquantified consumer risk. That judgement involves commercial and delivery considerations the Quality Engineer does not own and may not be able to see. A recommendation can be correct, well evidenced, well communicated, addressed to the right person, and correctly declined.

What makes it outcome 2 rather than outcome 3 is that someone is holding the risk. The test is whether you could write this sentence and have it be true: *"[Role] has accepted [specific risk] until [condition or date]."*

### Outcome 3 — The concern is declined and nobody owns the risk

The concern was heard, or half-heard, and no one has accepted the risk. It has not been rejected on the merits; it has dissolved. Nothing is recorded, nobody is answerable, and nothing will detect the failure if it occurs.

**Only this outcome justifies escalation**, and even then, escalation is not the first move. The first move is to attempt to convert outcome 3 into outcome 2 — which is usually easier than it sounds, because it does not ask the owner to change their decision. *"That's fine — can I record that you're accepting the consumer-inventory risk for this campaign, and that we'll revisit in January?"* is a small request that most owners will grant, and it produces a legitimate outcome.

If the owner declines to accept the risk *and* declines to act on it, then a risk exists with no owner, and that is a gap in the organisation rather than a disagreement between two people. That is what escalation is for, and framing it that way — *"this risk has no owner"* rather than *"I disagree with the delivery owner"* — is both more accurate and considerably more likely to be heard.

Applied to the opening story: the delivery owner's response was closer to outcome 2 than outcome 3 in substance — he heard it, had a reason, and decided. It became outcome 3 in practice because nothing was recorded, so no one held the risk and nothing watched for it. **The gap between outcomes 2 and 3 was about six lines of writing.**

## Psychological Safety, Bounded

Psychological safety is relevant here and is routinely stretched beyond what the research supports.

Edmondson's construct is specific. Team psychological safety is defined as a **shared belief that the team is safe for interpersonal risk taking** — a belief held at the level of the team, which the paper notes tends to be tacit rather than explicitly discussed. It was introduced and tested in a multi-method field study of 51 work teams in a single manufacturing company, modelling the effects of team psychological safety and team efficacy on learning behaviour and performance.[^edmondson]

Four boundaries follow directly from that scope, and Part XII holds all of them.

**It is about interpersonal risk, not comfort.** A team where people can say "I think this is wrong" without damaging their standing is psychologically safe. A team where nobody is ever uncomfortable may simply be one where nothing difficult is discussed.

**It is a team-level construct.** It is a shared belief attributed to a team, not a property of an individual's experience. "I felt uncomfortable in that meeting" is not a measurement of psychological safety, and no individual's account establishes the team-level belief.

**It does not remove accountability.** Safety to raise concerns and mistakes is not the absence of consequences for outcomes. Nothing in the construct implies that decisions stop having owners.

**Disagreement is not proof of it.** Observing disagreement in a team does not establish psychological safety, and observing none does not establish its absence — silence is compatible with both agreement and suppression. This is an inference, in the terms of Chapter 2, and repetition does not convert it into a measurement.

Two further cautions apply to using it at all. The original study population was a single manufacturing company; applying the construct to software engineering teams is an extension beyond that population and should be stated as such rather than assumed. And a Quality Engineer cannot unilaterally create psychological safety in a team — it is a property of a group, not a technique an individual applies. What an individual can do is smaller and real: raise concerns in a way that makes them easy to engage with, respond to others' concerns without penalty, and avoid making being wrong expensive for the person who was wrong.

**A note on measuring it:** counting escalations, dissent records, or raised concerns does not measure psychological safety. A rising count is compatible with a healthier speak-up climate and with a deteriorating system producing more to speak up about; a falling count is compatible with improvement and with suppression. The measurement problems here are the subject of Chapter 9, which develops them properly; this chapter's point is only that such counts do not license the claim.

## Personal Risk — A Bounded Statement

This section states a limitation rather than offering guidance, and it is deliberately short.

**Raising, recording, or escalating an unheeded concern may carry personal or organisational consequences.** Those consequences vary by organisation, role, jurisdiction, employment context, power asymmetry, the seniority of the people involved, and the seriousness of the concern. In some organisations, recording a disagreement is unremarkable and expected. In others, it is not.

A chapter that taught you to document dissent while implying the act is always cost-free would be dishonest, and this one does not.

What this handbook does **not** provide, in plain terms:

- legal advice;
- employment advice;
- whistleblowing guidance;
- grievance guidance;
- guidance on whether or when to resign;
- any assurance of protection.

Where a concern involves safety, legal, regulatory, ethical, or serious security obligations, appropriate specialist or formal channels may be required, and identifying them correctly matters more than anything in this chapter. Obtain appropriate professional advice rather than reasoning from a handbook. If you are weighing personal consequences in a serious situation, that weighing is legitimate, it is yours to do, and no book can do it for you.

What the rest of this chapter offers is narrower and still useful: a way of recording a concern that is proportionate, factual, and unlikely to be read as an attack — which reduces, though it does not eliminate, the friction of raising it at all.

## The Disagreement and Escalation Record

The **Disagreement and Escalation Record** is an original MSQE teaching artefact, not an industry standard. It is short — normally under a page — and its purpose is to make the risk owned and detectable, not to establish that you were right.

| Field | What it records |
| --- | --- |
| **Fact** | What the evidence directly supports, with population and conditions |
| **Evidence and class** | The supporting material, classified as measured, observed, reported, or inferred |
| **Interpretation** | What you conclude, marked as your reasoning |
| **Assumption** | Unverified conditions your concern depends on |
| **Limitation** | What your evidence cannot establish |
| **Concern** | The specific risk, stated in one sentence |
| **Potential consequence** | What could follow, for whom, under what conditions |
| **Recommendation** | The specific thing you asked for |
| **Decision owner** | The accountable role |
| **Decision or response** | What was decided, in the owner's terms rather than yours |
| **Residual risk** | What risk remains, and **who holds it** |
| **Detection** | What would signal that the risk has materialised, and who would see it |
| **Follow-up or revision trigger** | What would justify reopening, and when |

### What the record must not be

This is the part that determines whether the artefact helps or harms.

**Not blame.** The record describes a risk and a decision, not a person's judgement. "The delivery owner disregarded the evidence" is blame. "The delivery owner accepted the consumer-inventory risk in order to hold the campaign date" is a decision, stated in the owner's own terms.

**Not a threat.** Anything that reads as *"I want this on record so it's clear whose fault it is"* converts a useful artefact into a hostile one, and it will be read that way regardless of intent. A useful diagnostic: if the decision goes well, is this record still worth having? If it only has value when things fail, it is a threat.

**Not self-protection theatre.** A record whose real audience is a future disciplinary process will be shaped by that audience and will be visibly defensive. The audience is the person who has to detect the risk, and the person who reopens the decision in January.

**Not an attempt to override ownership.** The record does not re-argue the decision. It states what was decided and what remains. If you find yourself adding evidence that was not presented at the time, you are relitigating rather than recording.

**Not a substitute for having raised it.** Writing a record instead of speaking to the owner is worse than doing neither. The record follows the conversation.

The best test is whether you would be comfortable sending the record to the decision owner and asking *"is this a fair statement of what you decided?"* — because you should, and because doing so is what converts an outcome 3 into an outcome 2. If the record is fair, that request is unremarkable. If you would rather they did not see it, the record is one of the four things above.

### Two fields that carry the weight

**Residual risk, and who holds it.** This is what distinguishes outcome 2 from outcome 3 in writing. If the field reads "unowned", that is the finding, and it is the thing to escalate.

**Detection.** Atlas's characteristic failure is not that things break; it is that things break silently. A record that names what would signal the risk had materialised — and who would see that signal — converts an accepted risk into a monitored one, often at near-zero cost. In the opening story, "the analytics order-completion figure diverging from the order store by more than a small margin, checked by whoever runs the quarterly commercial planning" would have caught the failure that occurred, and requires nobody to change the decision.

## Engineering Perspective

The reframe that does most of the work in practice is from *"do I escalate?"* to *"does this risk have an owner?"*

The first question is about you: your judgement, your standing, your willingness to create friction. It has no clear answer and it invites either heroism or silence. The second is about the organisation, it is answerable, and it produces a proportionate next action in every case. If the risk has an owner, you record it and move on. If it does not, the finding is a gap, and gaps are raised without anyone being opposed.

That reframe also removes most of the emotional load, which is not a trivial benefit. *"I disagree with the delivery owner and I'm considering going to the director"* is a personal confrontation. *"This risk currently has no owner, and I'd like to establish who holds it"* is an engineering observation that happens to require a conversation. They can lead to the same meeting, and they do not lead to the same meeting.

## Industry Perspective

Safety-critical and high-consequence domains have converged, independently and repeatedly, on the same structural conclusion: the mechanism must not depend on the courage of the person raising the concern.

Aviation and healthcare incident-reporting systems, and operational engineering's incident review practice, share a common design: a defined route for raising a concern, a record that survives the conversation, and an explicit distinction between the concern and the person who raised it. Where these systems work, they work by making raising a concern *procedurally ordinary* rather than by exhorting people to be brave. Where they fail, the characteristic failure is that the report is filed and nothing owns the follow-up — which is outcome 3 again, at institutional scale.

The transferable observation is not a particular process. It is that the durable fix is structural rather than dispositional.

## Common Misconceptions and Pitfalls

### "If it's important, escalate it."

Importance is one factor among nine. A high-impact concern that the accountable owner has already heard and explicitly accepted does not need escalation; it needs recording. Escalating it anyway spends credibility and communicates that being disagreed with is not an outcome you accept.

### "Escalation means going over someone's head."

Sometimes, but usually not. Asking for a design review, raising an item at an architecture forum, or requesting a security review are all routes that use mechanisms built for the purpose. Reaching for the hierarchy when a designed path exists is both less effective and more costly.

### "If I document it, I'm covered."

Records are not indemnity, and one written primarily to cover the author is visibly that. The purpose is that the risk is owned and detectable. If your record achieves that, it also happens to be a fair account of what you did — but that is a side effect, not the objective.

### "They didn't listen."

Often what happened is that a concern was raised without a specific ask, to a channel rather than a person, without acknowledging the constraint the owner was under. Chapter 1's backward traversal exists to check this before concluding that the organisation is at fault. Sometimes it is. Check first.

### "Disagreeing shows the team is psychologically safe."

It shows disagreement occurred. Psychological safety is a team-level shared belief about interpersonal risk, and neither the presence nor the absence of visible disagreement establishes it.

### "The engineer with the evidence should have the final say."

Evidence informs decisions; it does not confer authority over them. An engineer who believes their evidence entitles them to the decision has stopped contributing to decision quality and started competing for ownership, and will be treated accordingly.

## QA → QE → Engineering-Leadership Transition

Return to the opening story, where the same contract change is handled at three different levels of contribution.

**QA contribution.** Establishes and reports the risk: a new status value is being added; the last such change caused a silent notification failure, a blank support console, and a four-day finance understatement; the consumer inventory is incomplete.

**QE contribution.** Bounds the concern and its uncertainty: the failure class is silent consumer breakage; the exposure depends on consumers that have not been enumerated, so the impact cannot be quantified; the analytics pipeline's read behaviour is unknown; and the strength of the concern rests on *detectability* — the last occurrence took four days to surface — rather than on individual severity. States plainly that the evidence cannot establish how many consumers are affected.

**Engineering-leadership contribution.** Recognises that the delivery owner is entitled to decide and is under a real constraint; makes an ask that fits inside it; when declined, converts outcome 3 into outcome 2 by asking the owner to confirm what risk is being accepted and until when; records the decision in the owner's terms; and — the highest-value move available — names a detection signal and who would see it, so that an accepted risk becomes a monitored one without anybody changing their mind.

The third contribution does not require more seniority than the second. It requires having decided beforehand what "declined" would mean, and having a form of words ready that does not sound like a fight.

## Summary

Disagreement is ordinary engineering activity, and disagreement, dissent, challenge, and escalation are four different things that are usually bundled. Escalation is proportionate to evidence strength, impact, reversibility, detectability, urgency, uncertainty, ownership, available path, and obligation — reasoned across, never scored. Three outcomes are legitimate: the concern is addressed; the concern is declined and the risk is explicitly owned; or the concern is declined and nobody owns the risk. Only the third is a finding, and the first response to it is to convert it into the second, which does not require the owner to change their decision. Psychological safety is a team-level shared belief about interpersonal risk taking, bounded by its study population and not established by observed disagreement. Escalation can carry personal cost that varies by context, and this handbook states that limitation rather than offering legal or employment guidance. A record of an unheeded concern must name the residual risk, who holds it, and what would detect it — and must not be blame, threat, self-protection, or an attempt to override ownership.

## Key Takeaways

- Disagreement, dissent, challenge, and escalation are distinct; most of what feels like escalation is dissent, and naming it correctly lowers the cost.
- **Disagree and commit** only works if the disagreement is recorded; otherwise it is just the disagreement disappearing.
- Escalation is proportionate across nine factors and is never a score. **Detectability** is the factor engineers most often under-weight.
- The meaningful distinction is **owned versus unowned risk**, not accepted versus declined. Only unowned risk justifies escalation.
- Converting outcome 3 into outcome 2 asks the owner to record their decision, not to change it — and is usually granted.
- Psychological safety is a **team-level shared belief that the team is safe for interpersonal risk taking**; it is not comfort, not the absence of accountability, and not established by observing disagreement.
- Raising a concern can carry personal cost that varies by context; this handbook states that plainly and offers no legal, employment, whistleblowing, grievance, or resignation guidance.
- A record that only has value if things go wrong is a threat, not a record. The test is whether you would send it to the decision owner and ask if it is fair.
- Naming a **detection signal and who sees it** converts an accepted risk into a monitored one at near-zero cost, without anyone changing their decision.

## Review Questions

1. Distinguish disagreement, dissent, challenge, and escalation using the opening scenario. Which did the Quality Engineer actually need?
2. Why is outcome 2 a good outcome rather than a failure? State the sentence that tests whether an outcome is 2 rather than 3.
3. The opening scenario was substantively closer to outcome 2 and became outcome 3 in practice. Identify what was missing and estimate what it would have cost to supply.
4. Two concerns have identical severity and reversibility. One failure mode is detected in minutes; the other took four days last time. Which warrants stronger action, and which proportionality factor carries the argument?
5. A colleague says the team has strong psychological safety because people argue in design reviews. Identify two problems with the inference and state what the observation actually supports.
6. Rewrite this as a fair record entry: *"I warned the delivery owner about the consumer risk and he ignored it to hit the date."*
7. Why is "does this risk have an owner?" a more tractable question than "should I escalate?"

## Interview Questions

1. Describe a time you disagreed with a decision that was not yours to make. What did you do, and what did you record?
2. How do you decide whether a concern warrants escalation?
3. A decision owner declines your recommendation. What, if anything, do you write down, and who is it for?
4. How do you raise a concern in a way that does not put the decision owner on the defensive?

## Practical Exercise

Work the following synthetic Atlas Commerce situation through to a **Disagreement and Escalation Record**. Unlike the earlier exercises, this one asks you to prepare for two different outcomes rather than one.

*Two weeks before the campaign, the platform owner proposes re-enabling the order-status page cache to reduce read load on the order store, which has been carrying the cache's former load since the cache was disabled. The cross-customer response that caused the cache to be disabled was traced to a cache key composed from the order identifier alone, with identity verified at the API edge and not propagated to the caching layer. The proposal is to re-enable the cache with the identifier included in the key. No test currently exercises cross-customer cache keying. The share of read load the cache previously absorbed was never measured. You believe the change is probably correct and that the absence of any test for the failure mode that caused a confidentiality incident is the real concern.*

Complete every field of the record. Your submission must:

- separate at least one fact from your interpretation, such that the platform owner could accept the fact and reject the interpretation;
- classify each piece of evidence, and state one thing the available evidence cannot establish;
- state a concern that is about the **detection gap**, not about whether the proposed key is correct;
- make a recommendation specific enough to be accepted, declined, or modified as written;
- write two versions of the **Decision or response** field — one for an outcome 2 and one for an outcome 3 — and state what you would do next in each case;
- name the residual risk **and who holds it** in each version; and
- specify a detection signal and who would see it.

Then answer in three or four sentences: apply the test *"would I be comfortable sending this to the platform owner and asking whether it is a fair statement of what they decided?"* If any part of your record fails that test, identify it and say which of the four prohibited forms it drifted into. Use only synthetic data.

## Further Reading

- [A. Edmondson — Psychological Safety and Learning Behavior in Work Teams](https://doi.org/10.2307/2666999) — the construct in its original scope and study population.
- [Part VIII — Observability & Reliability Engineering](../../part-08-observability-reliability/README.md) — detection, signals, and incident learning, which this chapter's Detection field depends on rather than re-teaches.

## References

[^edmondson]: Edmondson, A. [Psychological Safety and Learning Behavior in Work Teams](https://doi.org/10.2307/2666999). *Administrative Science Quarterly*, 44(2), pp. 350–383. June 1999. **Verification:** bibliographic metadata verified against Crossref; the definition of team psychological safety and the study population cited here were verified against the full text of an institutionally hosted copy, not against the publisher’s version of record. Metadata accessed 2026-08-14; full text accessed 2026-08-15.

The three-outcome structure, the proportionality factors, and the Disagreement and Escalation Record are **original MSQE teaching material**, not industry standards. Atlas Commerce is a synthetic teaching baseline and all figures are illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Distinguish disagreement, dissent, challenge, and escalation, and say which a situation requires.
- [ ] Apply the nine proportionality factors without reducing them to a score.
- [ ] Identify which of the three legitimate outcomes has occurred, and which one is a finding.
- [ ] Convert an outcome 3 into an outcome 2 with a request that does not ask the owner to change their decision.
- [ ] State the definition and boundaries of team psychological safety, including its study population.
- [ ] State what this handbook does not provide regarding the personal risk of escalation.
- [ ] Write a record that passes the "would I send this to the decision owner?" test.
- [ ] Name a detection signal and who would see it, for a risk that has been accepted.

## Chapter Navigation

Previous: [Chapter 3 — Written Records, Technical Writing, and Organisational Memory](chapter-03-written-records-technical-writing-and-organisational-memory.md) · Next: Chapter 5 — Decision Rights, Ownership Models, Governance Operating Models, and Accountability *(not yet drafted)*
