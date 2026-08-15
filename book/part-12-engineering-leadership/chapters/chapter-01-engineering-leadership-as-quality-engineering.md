# Chapter 1 — Engineering Leadership as Quality Engineering

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 1 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Parts I and XI; Parts III and X recommended |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Leadership in Quality Engineering is the ability to improve the quality of a decision you do not own. The moment it becomes the ability to make that decision instead, it has stopped being leadership and become a transfer of accountability nobody agreed to.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline. No real organisation, team, or person is described.

Eleven weeks before the next campaign, a Quality Engineer at Atlas Commerce finishes a piece of analysis she is confident in. Checkout retries the payment call up to twice after the initial attempt, immediately, with no backoff and no overall time budget. The deduplication key at the fulfilment boundary is regenerated on retry, so it deduplicates nothing. During the last promotion this combination produced 340 orders in `PAYMENT_UNKNOWN` and 12 duplicate fulfilments. The provider's median response is 180 ms when healthy and was observed at roughly 4,000 ms while degraded, against a 5-second client timeout.

She writes it up accurately. She posts it in the engineering channel. Three people react with a thumbs-up. The delivery owner replies, "Good catch — let's look at this after the campaign."

Nothing happens.

Eight weeks later the campaign runs. The same failure recurs at a smaller scale: 60 orders in `PAYMENT_UNKNOWN`, four duplicate fulfilments, and two days of manual reconciliation by the finance function. In the review afterwards, someone asks why nobody had flagged the retry behaviour. She says she had. She produces the message. Everyone agrees it was a good analysis.

It is tempting to read this as an organisation that ignored good evidence, and to conclude that the lesson is to escalate harder next time. That reading is available, common, and mostly wrong. The analysis was correct and it still failed to change anything — and the reasons it failed are not in the analysis. They are in who was addressed, what that person was deciding at the time, what constraint they were under, and what the message asked them to do. By the end of this chapter you should be able to re-read this scenario and name the specific step at which the contribution stopped being usable, without concluding that anyone behaved badly.

## Why This Chapter Matters

Every part of this handbook so far ends in the same place. Part III produces test evidence and hands it to someone. Part VIII produces operational evidence about reliability and hands it to someone. Part X produces performance and security findings and hands them to specialists and owners. Part XI produces an architecture recommendation, names the accountable decision owner, and stops.

That stopping point is deliberate and correct. It is also where a great deal of Quality Engineering work quietly dies.

Part XII is about the gap between producing sound evidence and that evidence changing what an organisation is able to decide well. Chapter 1 establishes the vocabulary and the discipline for working in that gap: what leadership means when quality is shared and authority is distributed, what a Quality Engineer contributes, what remains with the accountable owner, and why the difference matters more here than anywhere else in the handbook.

This chapter does **not** teach management. It does not assume you have direct reports, a budget, a title, or the authority to change anything. It assumes the opposite: that you have evidence that matters and no authority over the decision it bears on, which is the ordinary condition of most engineers most of the time.

## Learning Objectives

After completing this chapter you should be able to:

- distinguish leadership from authority, seniority, and management, and say which of them a given situation actually requires;
- distinguish **influence**, **recommendation**, **decision**, **authority**, and **accountability** as five separate things, and identify which one you hold in a given situation;
- identify the accountable decision owner for a specific decision — not a team, not "the business" — and state the constraint that owner is actually working under;
- apply the MSQE Quality Influence and Decision Model forwards from context to revision trigger;
- traverse the same model **backwards** from an unacted recommendation, and locate the step at which the contribution stopped being usable;
- explain why a correct recommendation that was declined is not necessarily a failure of the recommendation, the recommender, or the decider;
- produce an Influence and Decision-Owner Map for a real quality concern; and
- describe career growth in terms of the scope and quality of contribution rather than title accumulation.

## Leadership Without Authority

Start with what leadership is not, because the false definitions are the ones people act on.

Leadership is not **seniority**. Seniority is a statement about time, level, or organisational position. It correlates with experience and often with judgement, but it is not evidence about any particular claim. A staff engineer's assertion about payment idempotency is not more likely to be true because of the title attached to it; it is more likely to be true if the reasoning holds and the evidence supports it, which is a property anyone in the room can check.

Leadership is not **authority**. Authority is the right to decide, granted by the organisation and attached to a role. The release authority may hold a release. The security owner may accept a security risk. A Quality Engineer without those roles may do neither, and pretending otherwise creates a specific harm: it moves accountability to someone who cannot carry it, and away from someone who was supposed to.

Leadership is not **management**. Management is a role with responsibilities — staffing, prioritisation, performance, budget — that this handbook does not teach. Some leaders are managers. Most engineers who lead are not, and the assumption that leadership begins at the manager boundary removes the possibility of leading from everyone below it, which is where most of the technical judgement lives.

Leadership is not **winning arguments**. An engineer who is very effective at getting agreement, applied to a wrong conclusion, has produced a worse outcome faster. This handbook is not interested in techniques whose purpose is winning rather than informing. Where later chapters discuss framing and audience adaptation, it is to reduce what gets lost in translation, not to increase compliance.

What leadership *is*, for the purposes of Part XII:

> **Engineering leadership** is improving the quality of engineering decisions, evidence, collaboration, and learning — without pretending to own decisions that belong elsewhere.

Note what that definition contains. It is about **decision quality**, which is measurable in reasoning even when the outcome is not. It is about **evidence**, which is the material this handbook has spent eleven parts teaching you to produce. It is about **learning**, which is what makes the improvement outlast you. And it carries an explicit boundary, because a definition of leadership without a boundary is a definition of overreach.

### Technical authority and organisational authority

Two different things are often called authority, and conflating them causes a specific error.

**Technical authority** is credibility earned by demonstrated judgement: the engineer whose analyses have held up, whose limitations turned out to be the real ones, whose predictions about failure modes were borne out. It is granted informally, by the people who have watched the work, and it can be lost.

**Organisational authority** is the right to decide, granted formally by role.

They are independent. A person can have deep technical authority and no organisational authority — this is the ordinary condition of a senior individual contributor. A person can hold organisational authority over a domain in which they have little technical authority — this is ordinary too, and is not a scandal; a delivery owner is not required to be the best available judge of payment idempotency.

The error is treating technical authority as though it conferred organisational authority. It does not, and the belief that it should is the root of a recognisable failure pattern: the technically excellent engineer who concludes that because they understand the system best, the decision should have gone their way, and who therefore reads every declined recommendation as organisational dysfunction. That belief is corrosive, it is usually wrong, and it makes the engineer progressively less useful to the people who actually have to decide.

## Five Things That Are Not the Same

The following five terms are used interchangeably in ordinary conversation and must be kept separate for the rest of Part XII.

| Term | Definition used in Part XII | Held by |
| --- | --- | --- |
| **Influence** | The capacity to change how a decision is understood, framed, or evidenced. Informal, earned, revocable. | Anyone whose contribution is credible to the people deciding |
| **Recommendation** | A bounded proposal, with stated evidence and limitations, that a specific owner should do a specific thing. | The person who produced the analysis |
| **Decision** | The commitment to a course of action, taken by the person entitled to take it. | The accountable owner |
| **Authority** | The organisationally granted right to make a particular decision. | The role, not the person |
| **Accountability** | Answerability for the consequences of the decision, including the consequences nobody predicted. | The accountable owner, and it does not transfer with advice |

The last row carries the weight. **Accountability does not transfer with advice.** If a Quality Engineer recommends an approach and the delivery owner adopts it, the delivery owner remains accountable for the outcome. If the same engineer's recommendation is declined and the predicted failure occurs, the delivery owner is still accountable — the engineer does not acquire retrospective authority by having been right.

This cuts in both directions, and the second direction is the one engineers dislike. Being right does not make you the decision owner. It makes you someone whose next contribution should be easier to hear, which is a real and cumulative thing, but it is not authority and it does not entitle you to relitigate a closed decision.

### What a Quality Engineer may do

Within this frame, the contribution is substantial rather than passive. A Quality Engineer may:

- surface evidence the decision owner did not have;
- state what the evidence does and does not establish;
- make uncertainty explicit rather than letting it be assumed away;
- identify a risk, its conditions, and its plausible consequences;
- name an assumption nobody had noticed they were making;
- propose options, including ones nobody had considered;
- recommend a course of action;
- ask for a review by someone with relevant expertise;
- record a disagreement so that it survives the meeting;
- escalate proportionately when a risk has no owner; and
- make the decision easier to revisit later by recording what would change it.

That list is not small. It is most of what determines whether a decision is well made. What it does not include is deciding, approving, blocking, mandating, or overriding — and a Quality Engineer who quietly begins doing those things has not been promoted; they have taken accountability that someone else is still carrying.

## The MSQE Quality Influence and Decision Model

The following is an **original MSQE teaching model**. It is not an industry standard, a competency framework, a maturity model, or a scoring system, and no organisation is expected to recognise it by name.

```text
CONTEXT
  → QUALITY OUTCOME AT STAKE
  → CLAIM OR PROPOSAL
  → DECISION OWNER AND AUDIENCE
  → CONSTRAINT
  → EVIDENCE AND LIMITATION
  → COMMUNICATION CHOICE
  → RESPONSE
  → DECISION
  → CONSEQUENCE
  → RESIDUAL RISK
  → REVISION TRIGGER
```

Read forwards, the model describes how a quality contribution travels from a situation to a decision that can later be revisited. Each element is a distinct question:

| Element | The question it forces |
| --- | --- |
| **Context** | What situation is this, and what is already true about it? |
| **Quality outcome at stake** | Which outcome that someone cares about does this decision affect? |
| **Claim or proposal** | What specifically am I asserting or proposing, bounded? |
| **Decision owner and audience** | Who is entitled to decide this, and who else must understand it? |
| **Constraint** | What limiting condition is the owner actually working under? |
| **Evidence and limitation** | What supports the claim, and what can it not establish? |
| **Communication choice** | How is this being delivered, in what form, and what is being left out? |
| **Response** | What actually came back — including silence? |
| **Decision** | What was committed to, by whom, and with what scope? |
| **Consequence** | What follows, including for people who were not in the room? |
| **Residual risk** | What risk remains after the decision and any mitigation? |
| **Revision trigger** | What observation would require reopening this? |

The model does not guarantee influence, and it is important to say so plainly. Organisations decline well-founded recommendations for reasons that are sometimes sound, sometimes political, and sometimes simply about money. What the model prevents is a narrower and more common failure: concluding that a decision was wrong because it disagreed with you.

### Traversing the model backwards

The model's main teaching value is in the other direction.

When a recommendation is ignored, engineers characteristically re-examine the **evidence**. They gather more data, tighten the analysis, add a chart. This is the natural response and it is usually an investment in the one element that was probably not the problem.

Backward traversal directs attention differently. Starting from the response and working left:

1. **Response.** What actually came back? Silence is a response and carries information.
2. **Communication choice.** In what form did this arrive, and what did that form omit? Did a bounded claim survive summarisation, or did it arrive as something a reasonable person would discount?
3. **Evidence and limitation.** Did the limitation travel with the claim, or did the claim arrive sounding stronger than it was?
4. **Constraint.** What is this person actually under? A recommendation that ignores the constraint the owner cannot move is not a recommendation; it is a complaint.
5. **Decision owner and audience.** Was the person entitled to decide this ever addressed? Was the message sent to a channel, or to a person?
6. **Claim or proposal.** Was there a specific ask, or only an observation?

Apply this to the opening story. The analysis was sound; the evidence step is not where it failed. The message went to a **channel**, not to a named owner. It contained an observation about retry behaviour, not a proposal that a specific person do a specific thing. It did not acknowledge the constraint — a campaign eleven weeks out with four engineers who own all eight Atlas responsibilities — and so offered no bounded action that fit inside it. The delivery owner's reply, "let's look at this after the campaign," is a perfectly rational response to a message with no ask, no owner, and no stated consequence of waiting.

**Most quality evidence fails at the audience and communication steps, not at the evidence step.** An engineer whose only response to being ignored is to strengthen the evidence will keep producing better and better analyses that keep not landing.

This is a diagnostic aid, not an accusation. Sometimes backward traversal reveals that every step was done well and the recommendation was declined anyway, on grounds the engineer did not own. That is a legitimate outcome and Chapter 4 deals with what to do about it.

## The Influence and Decision-Owner Map

The **Influence and Decision-Owner Map** is an original MSQE teaching artefact, not an industry standard. It is a short working document — normally under a page — that a Quality Engineer completes *before* deciding how to raise a concern.

| Field | What it records |
| --- | --- |
| **Concern** | The quality concern, stated in one sentence, bounded |
| **Quality outcome at stake** | The outcome affected, and for whom |
| **Decision to be made** | The specific decision this bears on, phrased as a decision and not a topic |
| **Accountable owner** | The role entitled to make that decision |
| **Audience** | Others who must understand it, and what each of them is deciding or doing |
| **Owner's constraint** | The limiting condition that owner is working under, as best you can establish it |
| **Evidence and class** | What you have, and whether it is measured, observed, reported, or inferred |
| **Limitation** | What your evidence cannot establish |
| **Ask** | The specific thing you are asking the owner to do |
| **If declined** | What you will record, and what would justify revisiting |
| **What you do not own** | An explicit statement of the decision that is not yours |

Two fields do most of the work and both are routinely skipped.

**Accountable owner** must be a role, not a group. "The team should look at this" identifies nobody. "The delivery owner decides whether campaign-window scope changes" identifies someone who can act. If you cannot name the owner, that is itself a finding — an unowned decision — and Chapter 5 takes it up.

**Owner's constraint** requires you to know something about the other person's position before you ask them for anything. It is the field engineers most often leave blank, and leaving it blank is how a recommendation becomes a complaint.

### Failure modes of the map

- **The map becomes a stakeholder chart.** Listing everyone with an interest is not the exercise; identifying who *decides* is. A long audience list with an empty owner field is a map that has failed.
- **The ask is a topic.** "Consider the retry behaviour" is not an ask. "Add an overall time budget to the payment call before the campaign, or record that we are accepting the duplicate-authorisation risk for this campaign" is an ask, because it can be accepted, declined, or modified.
- **The constraint is guessed and then treated as known.** If you infer the owner's constraint rather than establishing it, say so and mark it inferred. Chapter 2 develops the evidence classes that make this distinction routine.
- **"What you do not own" is left implicit.** Writing it down is a discipline against your own drift. It is also, in practice, the field that makes the rest of the document easier for the owner to receive.

## Evidence, Judgement, and Decision Quality

A decision can be good and still turn out badly. A decision can be poor and still turn out well. If you evaluate decisions only by outcome, you will learn very little, and most of what you learn will be wrong.

Part XII therefore evaluates decisions by their **quality as decisions**: whether the relevant evidence was available and understood, whether uncertainty was visible, whether the assumptions were stated, whether the consequences were considered for people not in the room, and whether the decision recorded what would cause it to be revisited.

This is what a Quality Engineer can actually affect. You cannot guarantee outcomes; you do not control the market, the campaign date, the provider's stability, or what the commercial function has already committed to. You can substantially affect whether the person deciding knows what they are deciding.

There is a corollary that experienced engineers find harder than it sounds. **A declined recommendation is not automatically a failure.** A recommendation can be correct, well evidenced, well communicated, addressed to the right owner — and correctly declined, because the owner was weighing a cost, a commercial commitment, or a competing risk that was not yours to weigh. Part XII teaches you to record that outcome and its revision trigger, not to relitigate it.

The distinction that matters is not *accepted* versus *declined*. It is whether the risk ended up **owned** or **unowned**. A delivery owner who says "I understand the duplicate-authorisation exposure and I am accepting it for this campaign, revisit in January" has made a decision with an owner. Silence, or "let's look at it after the campaign" with nothing recorded, leaves the same risk with nobody holding it. Those two outcomes look similar in a chat thread and are entirely different in an incident review. Chapter 4 builds on this distinction directly.

## Systems Thinking as a Leadership Behaviour

Part I introduced systems thinking and shared quality ownership as principles. Part XII asks what they look like as behaviour.

The Atlas evidence base has a recurring shape. The four-day finance understatement happened because a status value was added and a downstream query filtered on a list that predated it. Every component had an owner. Nobody owned *noticing*. The fourteen-month dual-write persisted because the temporary dual-write shim's original author is no longer with the team, and no successor owner was assigned. The consumer inventory has never been completed, so the analytics pipeline — confirmed to exist, behaviour unknown — sits outside anyone's model of who reads the `orders` table.

None of these is a technical defect in isolation. Each is a gap between things that individually have owners. The leadership behaviour is not heroically fixing them; four engineers who own eight responsibilities cannot absorb that. It is making the gap **visible and attributable**, so that someone with authority can decide whether to close it, and so that the decision to leave it open is at least a decision.

That is a modest description of leadership, and it is deliberately modest. It is also the thing that most reliably changes what an organisation is able to decide well.

## Career Growth as Scope of Contribution

Career growth appears here only as far as Chapter 1 requires; Chapter 11 develops it properly.

The relevant claim is narrow. Career growth in Quality Engineering is better described as **increasing scope and quality of contribution** than as accumulating titles. Concretely, it tends to look like:

- judgement that holds under conditions you have not seen before;
- the ability to work usefully with weaker evidence, and to say so;
- contributions that continue to be useful after you have moved on;
- making it easier for other people to reason, decide, and continue the work.

Two boundaries apply, and both are firm. **This handbook cannot promise outcomes.** Promotion, title, compensation, and role availability depend on organisational context, market conditions, timing, and other people's decisions — none of which a book controls. And **titles are not portable**: "Senior", "Staff", "Principal", "QE", and "SDET" denote materially different things in different organisations, so a progression ladder is an organisational artefact rather than a standard. Part XII reasons about capabilities and evidence of them, not about levels.

## Engineering Perspective

From an engineering standpoint, the practical shift this chapter asks for is small and consequential: before raising a concern, spend five minutes establishing who decides and what they are under, rather than spending an hour strengthening evidence that was already sufficient.

That is not a communication tip. It is the same evidence discipline the handbook applies everywhere else, turned on a different object. When you assess a system you ask what is being claimed, for whom, under what conditions, on what evidence, with what limitation. The Influence and Decision-Owner Map asks the same questions about the decision rather than the system. The owner's constraint is a fact about the situation, and treating it as unknowable — or as an inconvenience — is the same error as treating an untested dependency as fine because you did not measure it.

## Industry Perspective

Publicly documented engineering practice tends to encode this distinction in artefacts rather than slogans. Architecture decision records name a decider and a status. Incident reviews distinguish contributing conditions from an accountable owner of a follow-up action. Change-approval processes exist precisely because organisations found that "everyone agreed in the meeting" is not a durable record of who decided.

The common pattern is that mature practice makes decision ownership **explicit and recorded**, rather than leaving it to be inferred from seniority. Where organisations differ enormously is in how those roles are named and distributed, which is why this handbook reasons about roles and accountability rather than prescribing an operating model.

## Common Misconceptions and Pitfalls

### "Leadership means getting people to agree with you."

This defines leadership by compliance and is indifferent to whether you are right. It also gives you no way to distinguish a good outcome from a persuasive one. Part XII defines leadership by improvement in decision quality, which can occur even when your recommendation is declined — if the owner declined it knowing what they were declining.

### "Senior engineers make the decisions."

Some do, for some decisions, because a role grants it. Seniority itself does not. Treating it as though it did produces two failures at once: deferring to a title in place of evidence, and expecting one's own evidence to override an accountable owner's judgement.

### "Quality owns quality."

Part I rejected this and Part XII depends on the rejection. If a quality function owns quality, every other function is relieved of it, and the Quality Engineer becomes a bottleneck with responsibility and no authority — the worst available position. Quality is a property of what the organisation builds and decides; the Quality Engineer owns evidence, analysis, and clarity about it.

### "A Quality Engineer should block a risky release."

Whether a release proceeds is a decision with an accountable owner, and in most organisations that is a release authority, not a Quality Engineer. What a Quality Engineer owes is that the release authority knows what they are releasing: the risk, its conditions, the evidence, and what the evidence cannot establish. If the release authority proceeds with that understanding, the risk is owned. If they proceed without it, the failure was in the contribution.

### "Leadership begins when you become a manager."

This removes the possibility of leading from everyone who is not a manager, which is most engineers and nearly all of the deep technical judgement in an organisation. Nothing in this chapter requires direct reports.

### "If they had listened to me, this wouldn't have happened."

Occasionally true, and almost never useful. It skips the diagnostic question — why did a correct analysis fail to become usable? — in favour of an attribution. The backward traversal exists to replace this sentence with a specific, actionable finding.

## QA → QE → Engineering-Leadership Transition

The progression this chapter introduces is concrete rather than a general upgrade in seniority.

**QA contribution.** Establishes that checkout retries the payment call twice with no backoff, that the deduplication key is regenerated on retry, and that the last promotion produced 340 `PAYMENT_UNKNOWN` orders and 12 duplicate fulfilments. This is credible, bounded quality information, and it is genuinely difficult to produce.

**QE contribution.** Connects that behaviour to system risk and decision context: the failure mode is duplicate card authorisation under provider degradation; the exposure is a function of provider latency against the 5-second client timeout; the mechanism that was supposed to prevent it does not; and the condition that triggers it — a degraded provider during high volume — is precisely the condition a campaign produces. It states what the evidence cannot establish, such as whether the provider's reconciliation query is contractually guaranteed while the provider is degraded.

**Engineering-leadership contribution.** Establishes that the delivery owner decides campaign-window scope and is working under a fixed date with four engineers; makes a bounded ask that fits that constraint; states plainly what happens if the ask is declined; and, if it is declined, records that the duplicate-authorisation exposure is being accepted for this campaign, by whom, with what revision trigger — so that the risk has an owner either way.

The third step is not more senior than the second. It is a different contribution, and it is the one that determines whether the first two mattered.

## Summary

Engineering leadership in Quality Engineering means improving the quality of decisions, evidence, collaboration, and learning without claiming ownership of decisions that belong elsewhere. It is not seniority, authority, management, or winning arguments. Influence, recommendation, decision, authority, and accountability are five distinct things, and accountability does not transfer with advice. The MSQE Quality Influence and Decision Model runs from context to revision trigger, and its main use is backwards: when a sound recommendation fails to land, the fault is usually at the audience or communication step rather than the evidence step. A declined recommendation is not automatically a failure; the outcome that matters is whether the residual risk ended up owned or unowned. The Influence and Decision-Owner Map makes the owner, the constraint, the ask, and the boundary explicit before a concern is raised.

## Key Takeaways

- Leadership is improving the quality of a decision you do not own; the moment it becomes making that decision, accountability has moved without agreement.
- Technical authority and organisational authority are independent, and treating the first as conferring the second is a recognisable and corrosive failure pattern.
- Influence, recommendation, decision, authority, and accountability are five different things; **accountability does not transfer with advice**, in either direction.
- The Quality Engineer's contribution — evidence, uncertainty, assumptions, options, records, proportionate escalation — is substantial and does not include deciding, approving, blocking, or overriding.
- Traverse the reasoning model backwards from silence: response, communication choice, limitation, constraint, owner, ask. The evidence step is usually not where it failed.
- The meaningful distinction is not accepted versus declined, but whether the residual risk ended up **owned or unowned**.
- Career growth is better described as increasing scope and quality of contribution than as title accumulation; this handbook cannot promise outcomes and titles are not portable.

## Review Questions

1. A colleague argues that because they have the deepest knowledge of the payment path, the decision about retry behaviour should be theirs. Which two forms of authority are being conflated, and what is the consequence of accepting the argument?
2. Explain why "accountability does not transfer with advice" constrains the Quality Engineer in *both* directions.
3. A recommendation was correct, well evidenced, addressed to the right owner, and declined. Under what circumstances is that a good outcome, and under what circumstances is it a finding?
4. Using backward traversal, work from "three thumbs-up reactions and no action" to a specific, actionable finding about the opening scenario. Name the step and say what would have been different.
5. Why does the Influence and Decision-Owner Map require the owner's *constraint* rather than only the owner's identity?
6. Distinguish a decision that was well made from a decision that turned out well. Which can a Quality Engineer affect, and why does the distinction change what you should record?

## Interview Questions

1. Describe a situation where you influenced a technical decision you did not own. What did you contribute, and what remained with the decision owner?
2. How do you decide whether a quality concern warrants raising, and to whom?
3. A recommendation of yours was declined and the risk you predicted later materialised. How did you handle it at the time, and what did you record?
4. How would you tell the difference between an organisation that ignores evidence and a contribution that was not usable?

## Practical Exercise

Produce an **Influence and Decision-Owner Map** for the following synthetic Atlas Commerce situation.

*The order-status page is served from a cache with a 300-second time-to-live and TTL-only invalidation: a republished corrected event does not invalidate it. During the last promotion, one customer's order summary was served to a different customer, because the cache key was composed from the order identifier alone and identity is verified at the API edge but not propagated to the caching layer. The cache was disabled as an interim measure. The permanent design is undecided. The next campaign is eleven weeks away, and the team of four engineers owns all eight Atlas responsibilities. With the cache disabled, the order store carries read load that the cache previously absorbed; the exact share was never measured.*

Complete every field of the map. Your submission must:

- state the concern in one bounded sentence, distinguishing the confidentiality exposure from the read-load consequence;
- identify **two** distinct decisions at stake and name a different accountable role for each;
- state each owner's constraint, and mark it established or inferred;
- classify each piece of evidence and identify at least one thing the available evidence cannot establish;
- state an ask for each owner that can be accepted, declined, or modified as written;
- record what you would write down if each ask is declined, including who would then hold the residual risk; and
- state explicitly what you do not own.

Then answer this in two or three sentences: if you raised only the confidentiality exposure and said nothing about the read-load consequence of the interim mitigation, what would you have done to the decision owner's position? Use only synthetic data. Do not propose a caching design — the exercise is about the decision, not the mechanism.

## Further Reading

- [Part XI — System Design & Architecture](../../part-11-system-design-architecture/README.md) — the MSQE Architecture Decision Reasoning Model, decision ownership, residual risk, and revision triggers, which Part XII consumes rather than restates.
- [Part I — Foundations](../../part-01-foundations/README.md) — shared quality ownership and systems thinking, extended here into named accountability.

## References

This chapter makes no external factual claim requiring citation. The MSQE Quality Influence and Decision Model, the five-term distinction, and the Influence and Decision-Owner Map are **original MSQE teaching material** and are labelled as such wherever they appear. Atlas Commerce is a synthetic teaching baseline; all figures used here are carried unchanged from Part XI's evidence base and are illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Define engineering leadership without using seniority, title, authority, or management.
- [ ] Separate influence, recommendation, decision, authority, and accountability, and identify which you hold in a given situation.
- [ ] Explain why accountability does not transfer with advice, in both directions.
- [ ] Name an accountable role — not a team — for a specific decision, and state that role's constraint.
- [ ] Traverse the MSQE Quality Influence and Decision Model backwards from an unacted recommendation to a specific finding.
- [ ] Distinguish a declined recommendation from an unowned risk, and say why only one of them is a finding.
- [ ] Complete an Influence and Decision-Owner Map, including the "what you do not own" field.

## Chapter Navigation

Previous: [Part XII overview](../README.md) · Next: [Chapter 2 — Communicating Quality Evidence to Decision Owners](chapter-02-communicating-quality-evidence-to-decision-owners.md)
