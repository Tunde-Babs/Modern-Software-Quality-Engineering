# Chapter 11 — Career Growth as an Evidence-Led Practice

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 11 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapters 1–10 |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** You can evidence what you did, what changed, and what you contributed. You cannot evidence that you deserve a title, and the organisations that hand them out are not applying your evidence anyway.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

Two Atlas engineers have comparable capability and very different visibility.

The first spent eight months on the fulfilment queue. She established that arrival during the promotional peak averaged 52 jobs per second against a completion capacity of 38, that the queue is unbounded with no dead-letter handling, and that failed jobs retry indefinitely. She wrote it up, took it to the platform owner, and the analysis is now the reference anyone uses when the queue comes up. Three people outside the team have read it.

The second did the payment-reconciliation work. When the promotion produced 340 orders in `PAYMENT_UNKNOWN`, he worked out which customers had actually been charged, reasoning from the provider's degraded behaviour against Atlas's ambiguous local records. It took two days and it was correct. He wrote nothing down, because he was resolving an incident and then the next thing started.

A year later, one of them can describe their contribution in terms someone outside Atlas could assess. The other cannot, and the work was not smaller.

There is a version of this chapter that concludes *therefore make your work visible*, and that version is mostly wrong — or at least, it is the least interesting thing that is true here. The more useful observation is that the first engineer can say what she established, over what population, with what limitation, and what remains unknown. The second can say he solved it. The difference is not publicity. It is that one of them produced evidence and the other produced an outcome.

By the end of this chapter you should be able to tell those apart in your own work, and to say what each does and does not support.

## Why This Chapter Matters

Every part of this handbook has asked you to bound a claim, name its population, classify its evidence, and state what it cannot establish. This chapter turns that discipline on the one subject where you have the strongest possible incentive for it to come out well: your own capability.

That is the whole argument for the chapter's existence. An engineer who applies evidence discipline to a latency measurement and then writes "owned quality for the checkout platform" on a CV has not internalised the discipline; they have applied it where it was comfortable. The same questions apply — what changed, over what window, compared to what, who else contributed, and what would make the claim false.

It matters practically too, because career evidence is used in consequential conversations by people who cannot verify it, and the engineer who can say precisely what they contributed is more useful in those conversations than the one making larger claims.

This chapter is **not** a CV-writing course, a LinkedIn guide, a personal-branding exercise, an interview-answer catalogue, salary-negotiation advice, or job-search tactics. It cannot and does not promise any career outcome.

## Learning Objectives

After completing this chapter you should be able to:

- distinguish **capability** from **title**, and explain why titles are not portable between organisations;
- convert a task-list or outcome assertion into a bounded capability claim with evidence and limitation;
- apply attribution discipline — distinguishing participated in, contributed to, influenced, led, owned, and delivered;
- state what a career plan controls and what it does not;
- reason about depth and breadth as a trade rather than a progression;
- describe the individual-contributor and management directions as different work rather than sequential steps;
- recognise self-assessment bias and the difference between visibility and substance; and
- produce a Career Evidence and Development Record.

## Five Things That Are Not the Same

These distinctions do the structural work of the chapter, and each is routinely collapsed.

> **CAPABILITY ≠ TITLE**
> **EVIDENCE ≠ PROMOTION**
> **SCOPE ≠ SENIORITY LABEL**
> **PORTFOLIO ≠ CERTIFICATION**
> **IMPACT ≠ GUARANTEED CAREER OUTCOME**

**Capability is not title.** A title is an organisational artefact recording a decision an organisation made, under its own levelling system, at a point in time, subject to budget and headcount. Capability is what you can actually do. They correlate loosely and diverge constantly in both directions.

**Evidence is not promotion.** Evidence can support a claim about what you contributed. Promotion is a decision made by someone else, under constraints that include available roles, business need, timing, and who else is being considered. Strong evidence makes the case easier to make; it does not make the decision.

**Scope is not a seniority label.** Working across four teams is a fact about your work. Whether an organisation calls that Senior, Staff, or nothing at all varies enormously.

**A portfolio is not a certification.** It is inspectable evidence of reasoning. It certifies nothing, and this handbook issues no credential.

**Impact is not a guaranteed career outcome.** This is the one the chapter must be most explicit about, and §"What a Career Plan Does Not Control" does that below.

## Titles Are Not Portable

A concrete illustration of why this chapter reasons about capabilities rather than levels.

Consider the label "Staff Quality Engineer". One organisation may use it for an individual contributor with deep specialist depth in one domain and no cross-team remit. Another may use it for someone whose primary work is cross-team influence and technical strategy with comparatively little hands-on depth. A third may not have the level at all, and a fourth may use "Principal" for what the first calls "Staff". The same is true of "Lead", which in some organisations carries people-management responsibility and in others does not.

The consequence is that **the title alone does not establish what someone can do**, in either direction. It tells you what one organisation decided, under its own system.

This is why the chapter uses dimensions rather than levels. Any role can be described along dimensions that *are* comparable:

| Dimension | The question |
| --- | --- |
| **Technical depth** | How deep in a specialism, and how far from the mainstream case does it hold? |
| **Scope** | How much of the system, and how many teams, does the work bear on? |
| **Cross-team influence** | Does the contribution change decisions outside your own team? |
| **Decision responsibility** | Which decisions are yours to make, versus recommend on? |
| **Strategy responsibility** | Are you shaping what gets worked on, or working on what was shaped? |
| **Specialist depth** | Reliability, data quality, AI quality, performance, security, architecture |
| **People responsibility** | Are you accountable for other people's work, development, and performance? |

Directions a Quality Engineering career commonly takes — senior and staff-level individual contribution, quality architecture, reliability or data-quality or AI-quality or performance and security specialism, quality-engineering platform and developer-productivity work, lead roles, and engineering or quality management — differ along these dimensions rather than along a single line. **They are not a ladder, and there is no ordering among them.** A specialist who goes deeper is not behind a generalist who went broader.

## Depth and Breadth Is a Trade

The depth-versus-breadth question is usually posed as though one answer were more advanced. It is a trade with real costs on both sides.

| | Depth | Breadth |
| --- | --- | --- |
| **What it buys** | Judgement in hard cases others cannot resolve; credibility in a specialism | Ability to see across boundaries; connecting evidence others hold separately |
| **What it costs** | Value tied to the specialism remaining relevant; fewer contexts where it applies | Rarely the person who can resolve the hardest case; credibility harder to establish |
| **Failure mode** | The specialism narrows or the organisation stops needing it | Never deep enough anywhere for the judgement to be trusted |
| **Atlas illustration** | The payment-reconciliation reasoning nobody else holds | The engineer who can connect the queue evidence, the consumer inventory, and the finance dependency |

Neither is the correct answer. Both are available, both have failure modes, and which serves you depends on what work you want to be doing — which is a preference, not a level.

## Career Evidence

Career evidence has a characteristic weak form: the **task list**. "Wrote 300 tests." "Ran the regression suite." "Owned quality for checkout."

Task lists fail for a specific reason: they describe activity rather than what changed, and activity is not assessable by anyone who was not there. A reader cannot tell whether 300 tests found anything, covered the risk, or were maintained. "Owned quality" is worse — it is an unbounded claim about responsibility that the reader has no way to interrogate, and Part I rejected the underlying idea anyway.

The stronger form states what changed, under what conditions, with what evidence and limitation:

| Weak | Stronger |
| --- | --- |
| "Wrote 300 tests" | "Introduced contract checks covering the four enumerated consumers of a shared order vocabulary; the two unenumerated consumers remained uncovered and I said so" |
| "Owned quality" | "Introduced a release-risk record used by three teams, which recorded who accepted each known risk at release; adoption outside my team was partial and I could not establish why" |
| "Mentored engineers" | "Developed a reasoning-transfer sequence after which two engineers independently applied the investigation method to unfamiliar cases with support withdrawn" |
| "Improved release speed" | See the worked example below |

Ten elements make a career claim assessable. Not every claim needs all ten, but the missing ones should be missing deliberately:

**Context · Baseline · Change · Evidence · Contribution · Other contributors · Limitation · Outcome · Scope · Time window**

**Confidential material is never required.** Every claim above can be stated without a real system name, a customer, a figure the organisation treats as sensitive, or an internal document. If a claim can only be made by disclosing something confidential, state the shape of the work and its scope and omit the specifics — that is a legitimate limitation, not a weakness in the claim.

### Worked example: from assertion to evidenced claim

The following is an **illustrative, synthetic example** using the Atlas baseline.

**The assertion:** *"I cut our pre-release feedback time in half."*

| Element | Content |
| --- | --- |
| **Context** | Atlas's pre-merge pipeline produced its first meaningful failure signal slowly enough that engineers context-switched away before results arrived. |
| **Population** | All merges to the main branch, both windows. **Not** all changes — work that never reached a merge is excluded. |
| **Window** | An eight-week window before the work and an eight-week window after, with a two-week gap during rollout excluded. |
| **Units** | Median minutes from merge to first meaningful failure signal. |
| **Baseline** | Median 42 minutes. |
| **After** | Median 23 minutes. |
| **Calculation** | Reduction = 42 − 23 = **19 minutes**. Relative reduction = 19 ÷ 42 = 0.452380… ≈ **45.2%**. |
| **Interpretation** | The median time to first meaningful failure signal fell by about 45% between the two windows. |
| **Contribution** | I identified the ordering problem, proposed the reordering, and implemented the change to the pipeline stages. |
| **Other contributors** | The platform owner approved and scheduled it; another engineer implemented the parallelisation of two stages. |
| **Limitation** | **A CI runner upgrade landed in the same window.** Its contribution cannot be separated from the reordering, and no measurement isolates them. The median also says nothing about the tail, which is where the worst experiences are. And "meaningful failure signal" is a definition I chose. |
| **Outcome** | Cannot be established. Whether faster feedback changed defect escape or engineer behaviour was not measured. |
| **Decision relevance** | Supports a claim that I contributed to a measured reduction in pipeline feedback latency. Does **not** support a claim that I caused it, or that quality improved. |

Two things are worth extracting.

The original assertion said "in half", which is 50%; the measurement gives 45.2%. That is a small overstatement and it is the least of the problems. **The real defect is attribution** — a concurrent change of unknown size sat in the same window, and the honest claim says so. An engineer who says "I contributed to a 45% reduction, alongside a runner upgrade whose effect I could not separate" is making a smaller claim and a more credible one, and is demonstrating exactly the judgement the role requires.

The second is that stating the limitation costs nothing with a competent reader and everything with an incompetent one. That is a real trade and this handbook takes a position on it: state the limitation.

## Attribution Discipline

Verbs carry claims. Six recur and are ordered here by what they assert, not by importance:

| Verb | Asserts | Requires |
| --- | --- | --- |
| **Participated in** | You were involved | Presence |
| **Contributed to** | You did some identifiable part | Ability to say which part |
| **Influenced** | The outcome differed because of you | Ability to say how, without claiming the decision |
| **Led** | You directed the work | An actual remit, and other people who would agree |
| **Owned** | You were accountable for it | Accountability, in Chapter 1's sense — answerability, not involvement |
| **Delivered** | You produced the outcome | The outcome to have been substantially yours |

**"Led" is the verb most often stretched.** It slides from "directed a piece of work" to "was present and had opinions". The test is Chapter 1's: could you name what you were accountable for, and would the other people involved describe it the same way? If several people would each say they led it, at most one of them is using the word as defined.

**Caused** is not on the list, and deliberately. Causal claims about organisational outcomes require evidence that is almost never available — Chapter 8 established this for mentoring, Chapter 9 for practice change, and the same applies to your own contribution. "Contributed to" is honest and is usually the strongest claim the evidence supports.

Where several people or teams contributed, **say so**. Not as modesty — as accuracy, and because a claim that omits obvious co-contributors is discounted entirely by anyone who knows the context.

## Self-Assessment, Visibility, and Substance

Two distortions run in opposite directions and both are worth naming.

**Self-assessment is unreliable in both directions.** You will over-weight work you found difficult and under-weight work you found easy, and difficulty is a property of you rather than of the work's value. The Atlas payment reasoning was difficult and valuable; some easy work is also valuable. **Feedback is evidence** — reported evidence, in Chapter 2's terms, with the usual limitations, and it is one of the few external checks available on a self-assessment.

**Visibility and substance are different, and both are real.** Work nobody can assess is hard to evidence; that is a fact about evidence, not a moral failing in either direction. But the opening story's lesson is not "make your work visible" — it is that the first engineer produced something inspectable and the second produced an outcome. Producing evidence as you go is a professional practice with its own value, which is most of what Chapter 3 was about; the fact that it also makes your contribution assessable is a consequence rather than a motive.

The failure mode to avoid is optimising for visibility over substance, which is Chapter 9's Goodhart-adjacent hazard applied to yourself: if being seen becomes the target, the work adapts to being seen.

## The Individual-Contributor and Management Directions

The MQE-BOK includes Engineering Management, and it is one direction a Quality Engineering career can take. Part XII treats it as **a different kind of work, not a later stage**.

The clearest distinction is what you are accountable for. An individual contributor is accountable for the quality of their own contribution — analysis, evidence, judgement, and what they make possible for others. A manager is additionally accountable for other people's work, development, and performance, and for organisational outcomes achieved through them. That is a change in the object of the work, not an increase in its difficulty.

Three consequences follow, and the third is the one people discover late:

- **The skills overlap less than expected.** Deep technical judgement does not confer the capability to develop people or to make allocation decisions under competing claims.
- **The evidence changes.** An IC evidences their own contribution; a manager evidences conditions created for others, which is harder to attribute and easier to overclaim.
- **The work you enjoy may not survive the move.** Engineers who liked solving hard technical problems frequently find that management contains few of them.

Part XII **does not teach management practice**. Hiring, firing, compensation, performance reviews, employment policy, disciplinary process, and HR administration are out of scope, require different expertise, and are dangerous to learn from a handbook.

What this chapter offers is narrower: **management is not the natural next step**, it is one direction among several, and choosing it should follow from wanting that work rather than from having run out of ladder.

## What a Career Plan Does Not Control

This section exists to bound every claim in the chapter.

Capability evidence is one input to career outcomes. The others are substantially outside your control:

- **Organisation structure** — whether a role of the shape you want exists at all;
- **Available roles** — whether one is open, and when;
- **Business need** — whether the organisation needs that capability now;
- **Sponsorship** — whether someone advocates for you when you are not present;
- **Opportunity** — whether the work that would evidence the capability is available to you;
- **Timing** — including reorganisations, funding, and events unrelated to you;
- **Labour market** — demand for the specialism, which moves;
- **Geography** — role availability and levelling conventions differ by location;
- **Local levelling systems** — what the organisation calls things, and its criteria.

The honest position, stated once and plainly:

> **Capability evidence may support a claim about what you can do within a particular role context. It does not determine title, promotion, compensation, or any career outcome, and this handbook makes no such promise.**

This is not discouragement. Evidence discipline is worth applying because it makes you better at the work and more credible in the conversations that do occur — both of which are real. It is simply not a mechanism for producing an outcome, and material that implies otherwise is selling something.

## The Career Evidence and Development Record

The **Career Evidence and Development Record** is an original MSQE teaching artefact, not an industry standard, competency framework, or assessment instrument. It supports reasoning about a development direction under uncertainty.

**It produces no score.** There is no career readiness score, promotion score, staff readiness score, management readiness score, weighted rubric, or numeric ranking of directions anywhere in it. Multidimensional reflection is the point; a scalar would destroy it.

| Field | What it records |
| --- | --- |
| **Desired work** | The work you want to be doing, described as work rather than as a title |
| **Current capability evidence** | Bounded claims with context, contribution, other contributors, and limitation |
| **Evidence class** | Measured, observed, reported, or inferred — per item |
| **Gaps** | Capabilities the desired work requires that you cannot currently evidence |
| **Uncertainty** | What you genuinely do not know about the work or your fit for it |
| **Role-context dependency** | What varies by organisation, and what would need to be true of a context |
| **Development action** | The specific thing that would produce the missing evidence |
| **Trade-off** | What that development costs, in time and in what it displaces |
| **Opportunity cost** | The direction not taken, stated fairly |
| **Outside your control** | The factors from the list above that bear on this |
| **Revision trigger** | What would make you reconsider the direction |

Two fields carry the artefact.

**Outside your control**, because a development record without it becomes a plan whose failure is read as personal failure. Many career outcomes turn on availability and timing, and recording that at the outset is what keeps the record honest.

**Revision trigger**, for the same reason it appears throughout Part XII. A direction chosen once and never revisited becomes a commitment by default rather than by decision, which is Chapter 3's temporary-shim problem applied to a career.

### Failure modes of the record

- **Desired work is a title.** "Become a Staff Engineer" is not a description of work and cannot be planned against, because different organisations would mean different things by it.
- **Gaps are listed without a development action.** A gap with no action is an anxiety, not a plan.
- **Every capability claim is unbounded.** If none of your evidence carries a limitation, you have written a CV rather than a record.
- **It becomes a rubric with a total.** Any scoring across dimensions defeats the artefact.
- **Opportunity cost is blank.** Choosing a direction forecloses others; stating which makes the choice a decision rather than a drift.

## Engineering Perspective

The habit worth carrying is to ask, of anything you might claim about your own work: **what would let someone else check this?**

For "improved release speed", the answer is a baseline, a window, a definition, and an account of what else changed. For "mentored engineers", it is what the mentee could subsequently do without support. For "owned quality", there is no answer, which is why the phrase should not appear.

This is the same falsifiability question Chapter 6 applied to culture claims, and it is uncomfortable in the same way — most career assertions are not designed to be checkable. The engineers who make checkable ones are more credible in exactly the situations where credibility matters, and they are also better at assessing their own work, which is the more durable benefit.

## Industry Perspective

Organisations that publish engineering career frameworks describe them in terms of scope, autonomy, technical depth, and influence rather than tenure — and the frameworks differ substantially from one another in where they place those dimensions and what they name the resulting levels.

That variation is the observation worth taking. Frameworks are **organisational artefacts** describing what one organisation values and how it allocates roles, and they are not portable instruments. Reading one closely tells you a great deal about that organisation and comparatively little about capability in general. A reader who finds one useful should use it as a description of a context they might work in, not as a measure of themselves.

## Common Misconceptions and Pitfalls

### "Management is the next step."

It is a different kind of work with a different object of accountability, not a later stage. Choosing it because the individual-contributor path appears to have run out is a poor reason and a common one.

### "I need to make my work more visible."

Sometimes true, and it is the wrong lesson from the opening story. The first engineer produced inspectable evidence; the second produced an outcome. Producing evidence is a professional practice whose value is mostly independent of who sees it.

### "I led that project."

Check against Chapter 1's definition. If several people would each say they led it, most of them are using the word loosely, and a reader who knows the context discounts all of them.

### "This portfolio proves I'm ready for a Staff role."

A portfolio is inspectable evidence of reasoning. It certifies nothing, "Staff" means different things in different organisations, and readiness is a judgement someone else makes under constraints you do not see.

### "Stating limitations makes me look weak."

With a reader who can assess the work, the opposite: an unbounded claim signals that you do not know its boundaries. With a reader who cannot, it may cost you something. This handbook takes the position that the trade is worth making, and is explicit that it is a trade.

### "If I do excellent work, the career will follow."

Sometimes, and not reliably. Available roles, business need, timing, sponsorship, and market conditions all bear on outcomes, and none is a function of your work quality. Excellent work is worth doing on its own terms.

## QA → QE → Engineering-Leadership Transition

Return to the first engineer in the opening story, and to what she can say about her own work.

**QA contribution.** Reports the work accurately: analysed the fulfilment queue, documented arrival and completion rates, wrote it up. Truthful, and it describes activity.

**QE contribution.** States what was established and what was not: that during a four-hour promotional peak, arrival averaged 52 jobs per second against a completion capacity of 38, over a stated window, at team level — and that the analysis does not establish customer impact, because it does not cover what the delayed jobs do. Names the evidence class and the limitation.

**Engineering-leadership contribution.** Adds contribution and attribution honestly: what part was theirs, who else contributed, what decision it informed, and what the platform owner decided. Records what the analysis has been used for since — which is the difference between work that happened and work that changed what an organisation could decide. Then states, without hedging or inflation, that this evidences a capability and determines no outcome.

## Summary

Capability is not title, evidence is not promotion, scope is not a seniority label, a portfolio is not a certification, and impact is not a guaranteed career outcome. Titles are not portable — the same label denotes materially different work in different organisations — so the chapter reasons about dimensions rather than levels, and the directions a Quality Engineering career can take differ along those dimensions rather than forming a ladder. Depth and breadth is a trade with failure modes on both sides. Career evidence in task-list form is not assessable; the stronger form states context, baseline, change, evidence, contribution, other contributors, limitation, outcome, scope, and window. Attribution discipline distinguishes participated in, contributed to, influenced, led, owned, and delivered — and *caused* is generally unsupportable. Management is a different kind of work rather than a later stage. Career outcomes depend substantially on factors outside the plan, and this handbook promises none of them.

## Key Takeaways

- **CAPABILITY ≠ TITLE · EVIDENCE ≠ PROMOTION · SCOPE ≠ SENIORITY LABEL · PORTFOLIO ≠ CERTIFICATION · IMPACT ≠ GUARANTEED CAREER OUTCOME.**
- Titles are organisational artefacts and are not portable; reason about dimensions — depth, scope, cross-team influence, decision and strategy responsibility, specialism, people responsibility.
- Career directions differ along those dimensions and **form no ordering**; a specialist who went deeper is not behind a generalist who went broader.
- Task lists describe activity and are not assessable. State what changed, under what conditions, with what limitation.
- **Attribution is where career claims usually fail**, not magnitude — a concurrent change of unknown size makes "I caused it" unsupportable while leaving "I contributed to it" intact.
- "Led" is the most-stretched verb; if several people would each claim it, most are using it loosely.
- Self-assessment over-weights difficulty, which is a property of you rather than of value. **Feedback is reported evidence** and is one of the few external checks available.
- **Management is a different kind of work, not a later stage**, and this handbook does not teach its practice.
- Career outcomes depend on structure, availability, business need, sponsorship, opportunity, timing, market, geography, and local levelling. **No handbook can promise one.**
- Confidential material is never required to make a strong career claim.

## Review Questions

1. Both engineers in the opening story did substantial work. State precisely what one can claim that the other cannot, and explain why "make your work visible" is not quite the lesson.
2. Convert "wrote 300 tests for the checkout service" into an evidenced capability claim. Identify which of the ten elements you cannot supply and say why that is acceptable.
3. In the worked example, the assertion said "in half" and the measurement gives 45.2%. Explain why the attribution problem matters more than the overstatement.
4. A colleague says they led the introduction of a release-risk record. What would you need to know before agreeing that "led" is the right verb?
5. Why does this chapter reason about dimensions rather than levels? Give an example of two organisations using the same title for different work.
6. State three factors outside a career plan's control that bear on whether a capability leads to a role.
7. Explain why "this portfolio proves I'm ready for a Staff role" fails on at least three separate grounds.

## Interview Questions

1. Describe a contribution you are proud of. What changed, and how would someone else verify it?
2. How do you distinguish work you led from work you contributed to?
3. What capability are you currently developing, and what evidence would show it had developed?
4. Describe a time your assessment of your own work turned out to be wrong in either direction.

## Practical Exercise

Produce a **Career Evidence and Development Record** comparing **two** plausible development directions.

Use your own situation if you have one, or the following synthetic Atlas engineer if you prefer: *an engineer with four years' experience who has done the fulfilment-queue analysis described in this chapter, contributed to the pipeline reordering in the worked example, and has begun transferring the payment-reconciliation reasoning to a colleague. The two directions under consideration are deeper specialism in reliability and operational evidence, or broader cross-team work on quality evidence across the eight Atlas responsibilities.*

Complete every field for **both** directions. Your submission must:

- describe each desired direction as **work**, not as a title;
- state at least three current capability claims with context, contribution, other contributors, and limitation;
- classify the evidence for each claim, and identify at least one claim that rests on **reported** evidence only;
- apply attribution discipline explicitly — use at least three different verbs from the table and justify each;
- identify one gap per direction with a specific development action that would produce the missing evidence;
- state the trade-off and opportunity cost of each direction fairly enough that a reader could prefer either;
- record what varies by organisational context;
- list what is outside your control; and
- give a revision trigger for each direction.

Then answer in three or four sentences: identify one capability claim you would be tempted to state more strongly than the evidence supports, say what the stronger version would assert, and state what evidence would be needed to justify it.

**Do not rank the two directions, score them, or conclude which is more senior.** The output is a comparison, not a verdict. Use only synthetic or non-confidential material.

## Further Reading

- [Part XII Chapter 8 — Mentoring and Growing Quality Reasoning in Others](chapter-08-mentoring-and-growing-quality-reasoning-in-others.md) — capability transfer, and the limits of what anyone can claim to have caused.
- [Part XII Chapter 9 — Measuring Engineering and Quality Practice](chapter-09-measuring-engineering-and-quality-practice.md) — construct validity and attribution, applied to practice rather than to a person.

## References

This chapter makes **no external factual claim requiring citation**, and no source has been added for it. That is a deliberate position rather than an omission: career levelling is organisation-specific, no external authority would generalise across contexts, and citing one would manufacture exactly the false precision the chapter exists to prevent. The five distinctions, the dimension set, the attribution verb table, the ten claim elements, and the Career Evidence and Development Record are **original MSQE teaching material**, not industry standards, competency frameworks, or validated instruments.

Atlas Commerce is a synthetic teaching baseline; all figures are illustrative and carried consistently with Part XI's evidence base and Part XII Chapters 1–10.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] State the five distinctions and explain why each is routinely collapsed.
- [ ] Explain why titles are not portable, with an example.
- [ ] Describe a career direction using dimensions rather than a level.
- [ ] Convert a task-list assertion into an evidenced capability claim with a limitation.
- [ ] Choose the correct attribution verb and justify it against Chapter 1's definition of accountability.
- [ ] Explain why attribution usually matters more than magnitude in a career claim.
- [ ] State what a career plan does not control.
- [ ] Complete a Career Evidence and Development Record with no score anywhere in it.

## Chapter Navigation

Previous: [Chapter 10 — Changing Practice: Adoption, Evidence, and Reversibility](chapter-10-changing-practice-adoption-evidence-and-reversibility.md) · Next: [Chapter 12 — Capstone: Quality Leadership and Career Strategy Portfolio](chapter-12-capstone-quality-leadership-and-career-strategy-portfolio.md)
