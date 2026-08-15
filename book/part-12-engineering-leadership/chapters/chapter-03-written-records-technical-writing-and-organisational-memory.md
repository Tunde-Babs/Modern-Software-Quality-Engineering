# Chapter 3 — Written Records, Technical Writing, and Organisational Memory

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 3 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapters 1–2; Part XI decision-record material |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A record is written for a reader who cannot ask you a question. Everything that only works because you are available to explain it is not yet in the record.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

An engineer joins Atlas and is asked to find out whether the dual-write can finally be removed.

The situation is well known internally. A migration planned for six weeks left a dual-write running for fourteen months, with no comparison mechanism and unmeasured drift between the two stores. The old table is still populated because the finance reconciliation job reads it, and nobody has ever fully enumerated what the finance job needs. **The temporary dual-write shim's original author is no longer with the team, and no successor owner was assigned.**

The engineer looks for a record. There is a pull request, merged, titled "add temporary dual-write for order migration." The description is one line: *"Temporary — will remove after cutover."* There is a wiki page describing the migration stages, last edited sixteen months ago, which describes stage 5 as upcoming. There is a chat thread, partially searchable, in which two people agree that the shim "should be fine for now."

None of this answers the question. The engineer can establish *what* the shim does by reading it. What cannot be recovered is why the old table was kept, what "after cutover" was supposed to mean, which consumers were known about at the time, what the author believed about drift, and what would have told anyone that removal was safe. The shim is not hard to delete. It is hard to *justify* deleting, and so it stays.

Fourteen months of an unintended architecture were preserved not by a technical constraint but by an absent paragraph. By the end of this chapter you should be able to name the specific fields whose absence caused that, and explain why writing them down is an engineering activity rather than an administrative one.

## Why This Chapter Matters

Chapter 2 was about evidence surviving translation to a reader who is present. This chapter is about evidence surviving to a reader who is not — one who arrives later, cannot ask you anything, and must decide whether your reasoning still holds under conditions you never saw.

That is a harder problem, and organisations are consistently bad at it. The characteristic failure is not that nothing was written; Atlas has a pull request, a wiki page, and a chat thread. It is that what was written recorded the **conclusion** and not the **reasoning** — and a conclusion without its reasoning cannot be revisited, only obeyed or ignored.

There is a second reason this chapter belongs in a Quality Engineering handbook rather than a writing guide. The things that make a record durable are the same things this handbook has been teaching throughout: population, condition, assumption, evidence class, limitation, owner, and revision trigger. Durable technical writing is evidence discipline applied to time.

This chapter is **not** about grammar, tooling, documentation platforms, or a mandated template. It does not tell you where to store records or which format to adopt.

## Learning Objectives

After completing this chapter you should be able to:

- explain why a record that captures only a conclusion cannot be revisited, and what fields make revisiting possible;
- distinguish **record** from **reality**, and connect this to Part XI's architecture-versus-architecture-description distinction;
- write a record that presents a defensible rational structure without claiming the work proceeded that way;
- identify the failure modes of organisational memory — staleness, orphaning, undiscoverability, and false authority;
- reason about record staleness as a population problem rather than a tidiness problem;
- recognise when a polished document is not evidence;
- produce a Durable Decision Record; and
- state what a record must contain to remain challengeable after its author has left the context.

## What Is Actually Lost

When an organisation loses decision quality through its records, the losses are specific. They are worth naming individually, because each has a different consequence and a different remedy.

| What is lost | Consequence when it is absent | Atlas instance |
| --- | --- | --- |
| **Context** | Later readers judge the decision against today's conditions instead of the ones it was made under | The six-week migration plan is invisible; the shim looks like negligence rather than an overrun |
| **Assumptions** | Nobody knows which beliefs the decision depended on, so nobody notices when one becomes false | That a comparison mechanism would not be worth building for a six-week window |
| **Rejected alternatives** | The same options are re-proposed and re-rejected, and the reasons must be reconstructed each time | Whether a bounded cutover was considered and why it was not chosen |
| **Evidence and its class** | The confidence behind the decision cannot be assessed | Whether "should be fine for now" rested on measurement, observation, or nothing |
| **Limitations** | Later readers treat the decision as better supported than it was | That drift between stores was never measured |
| **Rationale** | The conclusion survives and the reasoning does not, so it can only be obeyed or ignored | Why the old table was kept at all |
| **Ownership** | No one is answerable, and no one is entitled to change it | The shim's author left; no successor was assigned |
| **Consequences** | Effects on people outside the deciding group are invisible | The finance job's dependency on the old table |
| **Revision trigger** | Nothing ever causes a re-examination, so temporary states become permanent by default | What would have made removal safe |

The last row is the one that produced fourteen months. *"Temporary — will remove after cutover"* contains an intention and no trigger. An intention decays; a trigger fires. The difference between them is the difference between six weeks and fourteen months.

## Record Is Not Reality

Part XI established that `ARCHITECTURE ≠ ARCHITECTURE DESCRIPTION`: a diagram or an architecture decision record expresses an architecture without proving it sound, and without being necessarily current. The same distinction applies more broadly.

> `RECORD ≠ REALITY`

A record is a claim about a decision, made at a point in time, by someone with partial knowledge. It can be wrong at the moment it is written. It can become wrong afterwards while remaining unchanged. And it can be *more confident than the situation warranted*, which is the failure mode this handbook cares about most, because polish reads as authority.

This has three practical consequences.

**A well-written document is not evidence.** A record that states a system behaves in a certain way is a report of a belief. It has an evidence class — usually *reported* — and it does not become *measured* by being formatted well or by being stored in an official location. The Atlas wiki page describing migration stages is a confident, tidy, structured document that has been wrong for sixteen months. Nothing about its appearance signals that.

**Age is not staleness, and recency is not currency.** A five-year-old record of a decision about something that has not changed is current. A document edited last week describing a system that changed yesterday is stale. Currency is a relationship between the record and the thing, not a timestamp.

**The record's confidence must match the evidence's confidence.** If drift was never measured, the record must say drift was never measured. A record that omits this reads as though drift was acceptable, which is a stronger claim than anyone made.

## Reconstructed Rationale: What Parnas and Clements Actually Argued

There is a tension in everything written so far. Records should present reasoning clearly and in a defensible order — but real engineering does not proceed in a defensible order. Decisions are made under time pressure, revised, half-forgotten, influenced by who was in the room, and sometimes arrived at before the reasoning that supports them.

Parnas and Clements addressed this directly. Their argument is that a perfectly rational design process is unattainable — in their words, we will never find a process that allows software to be designed in a perfectly rational way — and that the useful response is not to abandon rational structure but to produce documentation *as if* an ideal process had been followed. They describe this explicitly as faking a rational design process: identifying an ideal process, following it as closely as possible, and writing the documentation that would have been produced had it been followed completely.[^parnas]

Applied to Part XII, the principle is narrow and useful: **a record may reconstruct a rational structure that the actual work did not have, because the structure is what serves the future reader.** Recording the reasoning in a defensible order is not dishonest, provided the record does not claim the process itself was orderly.

Two boundaries must be observed.

The first is a boundary on the source. Parnas and Clements argue about design documentation. They do **not** prescribe architecture decision records, modern agile documentation practice, a governance process, or any specific decision template — none of which existed in their form when the paper was written. Attributing those to the source would overclaim it. The principle borrowed here is the reconstruction argument only.

The second is a boundary on the practice. Reconstructing a rational *structure* is legitimate. Reconstructing a rational *basis* is not. If a decision was made because a campaign date was fixed and someone had to choose, the record may present that reasoning in an orderly way — context, constraint, options, decision — but it must not invent an analysis that never happened, or imply evidence that was never gathered. The honest version of that record says the constraint drove the decision and the analysis was not performed. That sentence is worth more to a future reader than a fabricated evaluation, because it tells them exactly what to re-examine.

## Records That Quality Engineers Write

Several artefact types recur. Each has an owner, and the ownership boundaries established in earlier parts continue to apply — writing a record does not confer authority over the thing it records.

| Artefact | What it records | Ownership note |
| --- | --- | --- |
| **Decision record** | A decision, its context, options, evidence, consequences, owner, and revision trigger | Written by whoever ran the analysis; the decision remains the accountable owner's |
| **Investigation summary** | What was investigated, what was found, what remains unknown | The finding belongs to the investigator; any resulting action does not |
| **Quality assessment** | The state of evidence about a bounded concern, with its limits | An assessment, not a verdict on release |
| **Release-risk record** | Known risks at a release point, their conditions, and who accepted them | The release authority owns acceptance; the record captures it (Part VII) |
| **Incident learning record** | Contributing conditions, what was learned, follow-up actions and owners | Owned per the organisation's incident practice (Part VIII) |
| **Architecture decision record** | An architecture decision and its reasoning | Part XI's territory; Part XII cares only that it remains usable later |
| **Evidence summary** | What testing or measurement established and did not (Parts III–X) | The evidence is the engineer's; the decision it informs is not |
| **Escalation record** | A raised concern, the response, and the residual risk | Chapter 4 develops this |

Part XII does not re-teach how to produce the technical content of any of these. It asks one question about all of them: **will this still be usable, and challengeable, by someone who arrives in eighteen months?**

## The Durable Decision Record

The **Durable Decision Record** is an original MSQE teaching artefact, not an industry standard, and not a required repository format. It is a minimal field set for a record intended to survive its author.

| Field | What it records |
| --- | --- |
| **Decision** | What was decided, stated so that it could be disagreed with |
| **Date and status** | When, and whether the decision is current, superseded, or unknown |
| **Context** | The situation at the time, including the constraints in force |
| **Constraint** | What could not be moved, and by whom |
| **Options considered** | Including those rejected, and the reason each was rejected |
| **Evidence and class** | What supported the decision, classified as measured, observed, reported, or inferred |
| **Assumptions** | Unverified beliefs the decision depends on, each marked verified or unverified |
| **Limitation** | What the evidence could not establish |
| **Decision owner** | The accountable role — not a team, not the author |
| **Consequences** | What follows, including for parties outside the deciding group |
| **Residual risk** | What risk remains after the decision |
| **Revision trigger** | The observation or condition that requires this to be reopened |

Two fields carry disproportionate weight.

**Assumptions, each marked verified or unverified.** An unverified assumption is a scheduled future surprise. Marking it explicitly means a later reader can check one thing rather than re-deriving everything. In the Atlas case, "we assume the finance job's requirements can be enumerated when needed — *unverified*" would have been worth more than the entire wiki page.

**Revision trigger.** This is what converts a temporary state into a bounded one. Compare:

| Wording | Effect |
| --- | --- |
| "Temporary — will remove after cutover" | An intention with no owner and no observable condition. Decays silently. |
| "Remove when the finance job's read requirements have been enumerated and a store comparison has run clean for two weeks. If either is not true by [date], reopen this decision with the platform owner." | A condition someone can check, a named role, and a date at which absence itself becomes the trigger |

The second is not longer because it is more bureaucratic. It is longer because it contains the information that was missing.

### Failure modes of the record

- **The record is written to protect the author.** A record that reads as a defence rather than an explanation will be discounted by exactly the readers it needs to convince. The audience is a future engineer, not a future tribunal.
- **Options considered is empty.** If no alternative was considered, write that, and say why — usually a constraint. An empty field implies analysis that did not happen.
- **The owner is a team.** "The platform team owns this" identifies nobody who can answer in eighteen months.
- **Status is never updated.** A record marked current that is not is worse than no record, because it carries false authority. If nobody owns updating status, the record has a limited useful life and should say so.
- **The record is complete and undiscoverable.** A perfect record nobody can find has the same effect as no record. Discoverability is part of the artefact, not an afterthought.

## Staleness Is a Population Problem

Organisations tend to treat documentation staleness as untidiness. It is more usefully treated as a question about a population, and treating it that way exposes how little most organisations actually know about their own records.

### Worked example: how stale is the decision record set?

The following is an **illustrative, synthetic example** using the Atlas baseline.

| Element | Content |
| --- | --- |
| **Context** | The platform owner asks whether the engineering wiki's decision records can be relied on when planning the dual-write removal. |
| **Population** | All 41 documents in the wiki's "decision records" section. The population is *documents in that section*, which is not the same as *decisions Atlas has made* — an unknown number of decisions were never recorded at all. |
| **Assumptions** | That a reviewer can correctly judge whether a record still describes current behaviour; that "still holds" is binary, which it is not for partially-superseded records. |
| **Units** | Count of documents; proportion of the sampled documents whose described behaviour no longer holds. |
| **Calculation** | An audit read 12 of the 41 records. **5** described behaviour that no longer holds. Sample proportion = 5 ÷ 12 = 0.41666… ≈ **41.67%**. Applied to the full set: 0.41666… × 41 = 17.083… ≈ **17** records. |
| **Interpretation** | If the 12 audited records were representative, roughly 17 of the 41 would be expected to describe behaviour that no longer holds. |
| **Limitation** | **The sample was not representative, and the bias runs in a known direction.** The 12 audited were the 12 most recently *edited* records — chosen because they were easiest to identify, not at random. Recently edited records are the ones someone is still maintaining, so they are more likely to be current than the set as a whole. The estimate of 17 is therefore likely an **under**estimate, and no figure here establishes by how much. Separately, the population omits decisions that were never recorded, which the Atlas dual-write demonstrates is not a small category. |
| **Decision relevance** | Supports the conclusion that the record set **cannot be relied on without per-record verification** for the dual-write planning. Does **not** support a numeric staleness figure, and does not identify which records are affected — which is the thing the platform owner actually needs. |

Every step of that arithmetic is correct. The number 17 is exact given its inputs, and it is not usable, because the sampling frame was chosen for convenience and biases the result in a direction that can be reasoned about but not quantified from what is available. The honest output of this analysis is a *bounded qualitative conclusion*, not a percentage — and stating that plainly is more useful to the platform owner than a figure that invites planning against it.

Notice that a record set with no staleness measurement at all is in a better epistemic position than one with a confident wrong figure, because the first invites the question and the second closes it.

## Discoverability, Orphaning, and False Authority

Three further failure modes deserve naming because they are invisible to the person who wrote the record.

**Undiscoverable.** The record exists, is accurate, and cannot be found by someone who does not already know it exists. The Atlas chat thread is the extreme case: the reasoning is genuinely in there, and it is not retrievable by anyone who does not know to look for it. Whether a record is discoverable is a property of the organisation's habits, not of the document.

**Orphaned.** The record has no owner, so nothing causes it to be revisited when the world changes. Orphaning is what turns an accurate record into a misleading one over time, without anyone acting. The Atlas migration wiki page is orphaned; its author moved on and the page kept asserting that stage 5 was upcoming.

**Falsely authoritative.** The record is confident, well-formatted, and stored somewhere official, and its content is *reported* evidence at best. This is the most dangerous of the three, because the presentation actively suppresses the question. The remedy is inside the record: state the evidence class, and state what was not established. A record that says "drift between stores has never been measured" cannot be mistaken for one that says drift is acceptable.

## Engineering Perspective

The engineering habit worth forming is to write the revision trigger *before* the decision is finalised, not afterwards.

The reason is that writing it changes the decision. Asking "what would tell us this needs reopening?" surfaces the assumptions the decision rests on, and it frequently reveals that the answer is *nothing would* — that there is no observable condition under which anyone would notice the decision had gone wrong. That is an important finding about the decision itself, available cheaply and early, and it is not available at all if the trigger is written afterwards as documentation.

The Atlas shim is the case in point. A six-week temporary measure with no stated condition for removal and no owner is not a temporary measure. It is a permanent one that has not been recognised as such, and the sentence that would have revealed this could have been written in the original pull request in under a minute.

## Industry Perspective

Documented practice converges on a small set of structural features rather than a format: a status field that can be marked superseded, an explicit record of options not taken, a named owner, and an entry that survives the tool it was written in. Architecture decision record practice, incident review conventions in operational engineering, and regulated-domain design history requirements differ in almost every particular and agree on those.

The agreement is telling. Each was developed by people who discovered independently that recording the decision alone was insufficient, and that what future readers needed was the reasoning, the alternatives, and a way to tell whether the record still applied.

## Common Misconceptions and Pitfalls

### "We have documentation."

Existence is not the property that matters. A record is useful if it is current, discoverable, owned, and honest about its evidence. Atlas has three documents about the dual-write and none of them can answer whether it can be removed.

### "Writing it down slows us down."

Writing the *conclusion* down is fast and nearly worthless. Writing the reasoning down is slower and is what makes the decision reversible later. The fourteen-month dual-write is what the fast version cost, and it was not paid by the person who saved the time.

### "The code is the documentation."

The code records what the system does. It does not record what was believed, what was rejected, what was assumed, what was measured, or what would make the arrangement removable. In the Atlas case the code is perfectly readable and answers none of the questions being asked.

### "A record proves the decision was sound."

It proves a decision was made and, if written well, shows the reasoning. `RECORD ≠ REALITY`: a record can be confident and wrong, and a polished one is more likely to be believed without checking.

### "The record should show how we actually worked."

Not necessarily. Reconstructing a rational structure is legitimate and is the useful thing to do. What is not legitimate is inventing an analysis that never happened. Present the reasoning in order; do not claim an orderly process or fabricate the evidence.

### "Someone will update it."

Records are updated by owners, not by the passage of time. If no role owns the record, it will drift, and the record should say so rather than implying a maintenance that nobody performs.

## QA → QE → Engineering-Leadership Transition

Consider what three different engineers would have written into that one-line pull-request description.

**QA contribution.** Records what was done and observed: a dual-write was added; both stores are written; the old table is still read by the finance reconciliation job. This is accurate and it is what most records contain.

**QE contribution.** Records what was decided and on what basis: that a comparison mechanism was judged not worth building for an expected six-week window; that drift was consequently never measured; that the consumer set for the old table was not enumerated; and that the evidence for "should be fine" was *reported* rather than measured. This makes the decision assessable.

**Engineering-leadership contribution.** Adds what makes the record survive its author: a named accountable role rather than a team; a revision trigger stating the observable condition under which removal is safe and the date at which its absence itself forces a reopening; an explicit statement that the drift limitation is unmeasured; and a status field somebody owns. The difference between the second and third contributions is fourteen months.

## Summary

Records lose decision quality through the loss of specific things — context, assumptions, rejected alternatives, evidence and its class, limitations, rationale, ownership, consequences, and above all the revision trigger. `RECORD ≠ REALITY`: a record is a claim made at a point in time, it can be wrong when written and can become wrong afterwards, and polish reads as authority whether or not the evidence supports it. Parnas and Clements' argument licenses reconstructing a rational structure for the future reader's benefit, but not reconstructing a rational basis that did not exist. Staleness is a population problem, and a confident staleness figure derived from a convenience sample is exact and unusable. The Durable Decision Record's most valuable fields are the marked assumptions and the revision trigger, because an intention decays and a trigger fires.

## Key Takeaways

- A conclusion without its reasoning can only be obeyed or ignored, not revisited.
- `RECORD ≠ REALITY`, extending Part XI's `ARCHITECTURE ≠ ARCHITECTURE DESCRIPTION`; a well-formatted document is not evidence, and its evidence class is usually *reported*.
- Currency is a relationship between record and thing, not a timestamp; age is not staleness and recency is not currency.
- Reconstructing a rational **structure** is legitimate; reconstructing a rational **basis** that never existed is not.
- "Temporary" without an owner and an observable condition is a permanent state that has not been recognised as one.
- Write the revision trigger before finalising the decision — discovering that no condition would reveal the decision had gone wrong is itself a finding.
- A staleness estimate from a convenience sample can be arithmetically exact and unusable; the honest output may be a bounded qualitative conclusion.
- Undiscoverable, orphaned, and falsely authoritative records fail in different ways and need different remedies.

## Review Questions

1. Name the three fields whose absence from the Atlas pull-request description most directly caused the fourteen-month dual-write, and say what each would have made possible.
2. Explain `RECORD ≠ REALITY` using the Atlas migration wiki page. Which evidence class does that page's content actually carry?
3. Parnas and Clements argue that documentation may present a rational structure the real process lacked. State precisely what that licenses and two things it does not license.
4. The staleness estimate of 17 records is arithmetically correct. Explain the sampling problem, state the direction of the bias, and say why the direction can be reasoned about but the magnitude cannot.
5. Rewrite "Temporary — will remove after cutover" as a revision trigger. Your version must contain an observable condition, a named role, and a date at which absence forces a reopening.
6. A record is accurate, current, and stored in the team wiki, and the engineer who needed it did not find it. Which failure mode is this, and whose problem is it to fix?

## Interview Questions

1. What do you write down after a technical decision, and what do you deliberately leave out?
2. How would you tell whether an existing decision record can still be relied upon?
3. Describe a time when a missing record cost your team time or an outcome. What specifically was missing?
4. How do you record a decision that was driven by a deadline rather than by analysis, without either fabricating a rationale or being dismissive of it?

## Practical Exercise

The record below was never written. Reconstruct it as a **Durable Decision Record** — the document that should have accompanied this synthetic Atlas Commerce decision fourteen months ago.

*Fourteen months ago, a migration of order data to a new service was planned to take six weeks. A dual-write shim was added so that both the old table and the new service would be written. The old table was retained because the nightly finance reconciliation job reads it, and the finance job's exact read requirements were never enumerated. No store-comparison mechanism was built, on the reasoning that it would not be worth the effort for a six-week window. The shim swallows duplicate-job errors returned by the new service, so the two stores have drifted by an unknown number of rows. The shim's original author is no longer with the team, and no successor owner was assigned.*

Complete every field. Your submission must:

- state the decision so that a reader could disagree with it;
- record at least three assumptions, each marked verified or unverified;
- classify the evidence available at the time, and state at least one thing it could not establish;
- record the rejected alternative and the reason it was rejected, distinguishing a reason that was given from one you are inferring;
- name an accountable role rather than a team; and
- write a revision trigger containing an observable condition, a named role, and a date at which absence itself forces a reopening.

Then answer in three or four sentences: your record is being written **retrospectively**, from evidence rather than from memory of the original reasoning. Identify which fields you were able to establish, which you inferred, and how you marked the difference — and explain why a record that silently blurs the two would be worse than one with several fields marked "not established."

Use only synthetic data. Do not propose a removal plan for the shim; the exercise is the record, not the migration.

## Further Reading

- [D. L. Parnas and P. C. Clements — A Rational Design Process: How and Why to Fake It](https://doi.org/10.1109/TSE.1986.6312940) — the reconstruction argument, in its original scope.
- [Part XI — System Design & Architecture](../../part-11-system-design-architecture/README.md) — architecture decision records, and the architecture-versus-architecture-description distinction this chapter extends.

## References

[^parnas]: Parnas, D. L., and Clements, P. C. [A Rational Design Process: How and Why to Fake It](https://doi.org/10.1109/TSE.1986.6312940). *IEEE Transactions on Software Engineering*, SE-12(2), pp. 251–257. February 1986. **Verification:** bibliographic metadata verified against Crossref; the reconstruction argument cited here was verified against the full text of an institutionally hosted copy of the paper, not against the IEEE version of record. Metadata accessed 2026-08-14; full text accessed 2026-08-15.

The `RECORD ≠ REALITY` formulation, the Durable Decision Record, and the failure-mode taxonomy in this chapter are **original MSQE teaching material**, not industry standards. Atlas Commerce is a synthetic teaching baseline and all figures are illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Name what is lost when a record captures a conclusion without its reasoning, and the consequence of each loss.
- [ ] Explain `RECORD ≠ REALITY` and identify the evidence class a typical internal document carries.
- [ ] State what the Parnas and Clements reconstruction argument licenses and what it does not.
- [ ] Distinguish a record's age from its currency.
- [ ] Convert an intention into a revision trigger with an observable condition, a named role, and a date.
- [ ] Explain why a staleness figure from a convenience sample may be exact and unusable.
- [ ] Distinguish undiscoverable, orphaned, and falsely authoritative records, and give the remedy for each.

## Chapter Navigation

Previous: [Chapter 2 — Communicating Quality Evidence to Decision Owners](chapter-02-communicating-quality-evidence-to-decision-owners.md) · Next: [Chapter 4 — Disagreement, Escalation, and Recording an Unheeded Concern](chapter-04-disagreement-escalation-and-recording-an-unheeded-concern.md)
