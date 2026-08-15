# Chapter 7 — Organisation Structure and Its Quality Consequences

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 7 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapters 1–6; Part XI Chapter 2 boundary vocabulary; Part XI Chapters 10–11 for the deferred ownership transfer |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Some problems are technical, and the fix is a change to the system. Some problems are structural, and the same fix will be applied repeatedly, correctly, and to no lasting effect.

## Motivating Scenario

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

Atlas keeps solving the same problem.

Three times in eighteen months, a change to something one part of the system owns has broken something another part depends on: the status-value addition that silently stopped notification and understated the settlement figure; the event-schema change described as additive that consumers handled differently; and a cache-key composition that did not carry an identity dimension nobody had told the caching layer about.

Each was fixed properly. Each fix was correct. None of them prevented the next one.

An engineer proposes a technical answer: a contract-testing layer covering every consumer of the `orders` table. It is a reasonable proposal and it would help. It also cannot be built, because the consumer inventory has never been completed — the analytics pipeline is confirmed to exist with unknown read behaviour, and the partner logistics integration's read behaviour is likewise unknown. You cannot write contract tests for consumers you have not enumerated.

So why has the inventory never been completed? Not because it is hard. It is described in Part XI as the cheapest high-value evidence available. It has not been completed because it is nobody's feature, it spans every responsibility the team has, and four engineers who own all eight Atlas responsibilities have never had a week in which enumerating consumers was the most urgent thing.

That is not a technical problem with a technical fix. It is a structural condition, and the third correct technical fix will be followed by a fourth. By the end of this chapter you should be able to tell these two categories apart reliably, and to describe the structural one to someone who can act on it — without proposing a reorganisation.

## Why This Chapter Matters

Engineers are trained to produce technical solutions and are good at it. That training becomes a liability in a specific case: when the condition producing a problem is structural, a technical fix addresses the instance and leaves the generator intact. The work is real, the fix is correct, and the problem returns.

Recognising which category you are in is therefore a diagnostic skill with direct consequences for where effort goes. It is also the skill that makes a Quality Engineer's evidence useful to people making organisational decisions, because it converts "we keep having contract failures" into a statement about a condition that someone with authority could actually change.

This chapter also discharges deferrals that Parts V and XI placed on Part XII in published text — organisation design, and the design of an ownership transfer. It honours them under a boundary that keeps them Quality Engineering:

> Part XII owns the **quality-engineering analysis of organisational arrangements and their consequences**. It does not own organisation-design prescription, and it does not teach a reader to restructure a company.

Concretely: this chapter contains no reorganisation playbook, no team topology to adopt, no headcount design, no org chart, no reporting-line guidance, and no consulting framework. Part XI Chapter 2 states that organisation design is not a Quality Engineering decision, and that remains true here.

## Learning Objectives

After completing this chapter you should be able to:

- distinguish a technical problem from a structural condition presenting as a technical problem, and say what each requires;
- describe how communication boundaries, coordination cost, and feedback latency affect achievable quality outcomes;
- use Conway's observation with its original wording and its stated qualifications, without treating it as deterministic;
- classify inverse-Conway and team-topology ideas correctly as practitioner guidance rather than as law or standard;
- reason about capability placement — centralising specialists versus embedding them — in terms of consequences rather than preference;
- identify knowledge concentration and analyse it as a structural risk rather than an individual one;
- treat an ownership transfer as a system change requiring capability evidence, continuity, and a residual-risk statement; and
- produce a Structure and Constraint Assessment.

## Technical Problems and Structural Conditions

The diagnostic is not about difficulty. Many structural problems have easy fixes that never get applied, and many technical problems are extremely hard.

| | Technical problem | Structural condition |
| --- | --- | --- |
| **What it is** | A defect or design flaw in the system | A property of how work, ownership, or communication is arranged |
| **Effect of a correct fix** | Resolved | The instance resolves; the generator persists |
| **Recurrence pattern** | Does not recur in the same form | Recurs in different forms, each looking novel |
| **Atlas example** | The cache key omitted an identity dimension | Changes to shared vocabularies keep breaking unenumerated consumers |
| **What it needs** | Engineering work | A decision by someone with authority over the arrangement |

Three signals suggest you are looking at a structural condition rather than a technical one:

**The fix keeps being correct and the problem keeps returning in a new costume.** Three Atlas incidents share a shape — a change to something shared, breaking a consumer nobody had enumerated — while looking like three unrelated defects.

**The obvious cheap fix has been available for a long time and has not been done.** When something is agreed to be valuable, is not technically hard, and has still not happened, the explanation is usually not competence or will. It is that nothing in the arrangement makes it anyone's most urgent work.

**Every individual involved behaved reasonably.** If you cannot identify a person whose different behaviour would have prevented the outcome, you are almost certainly looking at a property of the arrangement. This signal is also the one that keeps the analysis honest, because it directs attention away from blame.

The consequence for a Quality Engineer is a change in what you propose. For a technical problem, propose the fix. For a structural condition, propose the fix **and** name the condition — because the fix is still worth doing, and the person who owns the arrangement cannot act on a condition nobody has described to them.

## Conway's Observation, With Its Qualifications

Conway's paper is routinely cited and rarely quoted, which is how it acquired the status of a law. Its actual claim is narrower and more interesting.

The paper's thesis, in Conway's own wording, is that *"organizations which design systems (in the broad sense used here) are constrained to produce designs which are copies of the communication structures of these organizations."*[^conway] The mechanism he describes is specific: subsystems that must interoperate require their design groups to negotiate an interface, so where no communication path exists between two groups, no negotiated interface appears between their subsystems either.

Two qualifications from the paper matter and are usually dropped. Conway notes the effect is **more pronounced in larger organisations**, where communication is less flexible; and he attributes the constraint to the design organisation's administrative structure limiting who talks to whom. The claim is about **communication structure**, not about org charts as such — those coincide only to the extent that the chart determines who communicates.

Part XII therefore treats this as a **diagnostic tendency, not a deterministic law**, consistent with Part XI Chapter 2. Communication structures can shape system-design pressures and coordination patterns. That is a different and weaker statement than "architecture mirrors the organisation", which is asserted far more often than it is evidenced, and which is straightforwardly false in many small organisations — including Atlas, where four engineers who all talk to each other own eight responsibilities that are nonetheless entangled in ways their communication structure does not explain.

### Inverse Conway and team topologies

The **inverse Conway manoeuvre** — restructuring teams to induce a desired architecture — is **practitioner guidance**, not a law, a standard, or a research finding. So are the various team-topology patterns in circulation. They may be useful; they are not established in the way Conway's observation is, and this handbook does not prescribe them.

Two boundaries follow. Part XII does not present restructuring teams to force an architecture as a Quality Engineering action — it is an organisational decision with its own risks, owned elsewhere. And where such ideas are referenced in your organisation, classify them accurately: a practitioner pattern that has worked in described contexts, not a principle that determines outcomes.

## Structural Properties That Affect Quality

Five properties recur. Each is analysable, and none of them prescribes an arrangement.

**Communication boundaries.** Where a boundary exists, information crosses it deliberately or not at all. Atlas's finance function consumes a status vocabulary it has never been consulted on; the boundary is not organisational hostility, it is that nothing in the arrangement puts finance in the room when the vocabulary changes.

**Coordination cost.** Every change spanning a boundary costs negotiation. This cost is usually invisible in planning and shows up as latency. A change requiring three groups to agree is not three times harder than one requiring one; it is harder by an amount that depends on how those groups already communicate.

**Feedback latency.** How long between an action and the information about whether it was right. Atlas's four-day finance divergence is a feedback-latency failure, and lengthening feedback loops degrades quality outcomes more reliably than almost any other structural property — because every decision made inside the loop is made without the information.

**Knowledge concentration.** When one person holds knowledge nobody else has, the arrangement has a single point of failure that looks like reliability. This is a structural property, not a fact about the person, and treating it as an individual issue is both unfair and ineffective. Chapter 8 develops the capability-transfer response.

**Capability placement.** Whether specialists are concentrated or distributed changes what evidence gets produced and where. Chapter 5 covered the arrangements; the structural point here is narrower — placement determines *proximity to the work*, and proximity determines whether findings arrive while they can still change something.

## Ownership Transfer as a System Change

Part XI Chapter 10 records that ownership transfer *"is frequently the least reversible step in the plan"* and hands its analysis to Part XII. Part XI Chapter 11 notes that one option *"realistically invites a second team, which is an organisational change"* — and declines to reason about what that would cost.

This section supplies that reasoning. It does **not** supply a transfer procedure, a target structure, or a staffing plan.

The core point: **"hand it to another team" is not a completed transfer.** It is the announcement of an intention. A transfer is complete when the receiving group can operate the responsibility without the originating group, and demonstrating that is the work.

Eight dimensions to analyse:

| Dimension | The question | Atlas instance |
| --- | --- | --- |
| **Capability readiness** | Can the receiving group operate this, demonstrated how? | Two of Atlas's four engineers have never operated a message broker |
| **Documentation** | Does the reasoning exist outside the originating group's heads? | The dual-write shim has a one-line description and no rationale |
| **Evidence continuity** | Do the signals, checks, and history transfer, or only the code? | The store-comparison mechanism was never built, so there is no drift history to hand over |
| **Operational ownership** | Who is called at 3am, from when, and do they know? | — |
| **Escalation** | Where does a problem go during and after transfer? | — |
| **Dependencies** | What else depends on this, including things not enumerated? | The consumer inventory is incomplete, so the dependency set is unknown |
| **Hidden knowledge** | What does the originating group know that is not written anywhere? | The finance job's exact read requirements were never enumerated |
| **Residual risk** | What remains after the transfer, and who holds it? | — |

The **hidden knowledge** row is the one that determines whether a transfer succeeds, and it is the hardest to assess because by definition nobody has written it down. A practical probe: ask the originating group what questions they get asked that are not answerable from the documentation. The answers to those questions are the hidden knowledge, and they are what the receiving group will be missing on day one.

**Reversibility** deserves separate emphasis. A code change can be reverted. An ownership transfer cannot be reverted in the same sense — the originating group's context decays, people move on, and the operational knowledge that made them capable does not persist unused. This is why Part XI describes it as frequently the least reversible step, and why analysing it before rather than during is worth the effort.

Atlas's specific case makes the point compactly. A second team would relieve the four-engineer capacity constraint and would create a new cross-team boundary on the payment path — the highest-consequence path in the system, with a dependency whose degraded behaviour has never been established. That is a genuine trade, it can be analysed, and **the decision belongs to whoever owns organisational arrangements at Atlas**, which is not the Quality Engineer.

## The Structure and Constraint Assessment

The **Structure and Constraint Assessment** is an original MSQE teaching artefact, not an industry standard or an organisational-design instrument. It analyses one recurring quality problem for structural causes.

| Field | What it records |
| --- | --- |
| **Recurring problem** | The pattern, with its instances |
| **Common shape** | What the instances share, stated so that it is checkable |
| **Technical component** | What is genuinely a defect, and what fixing it achieves |
| **Structural condition** | The arrangement property that generates the instances |
| **Evidence for the structural reading** | Which of the three signals apply, and how you know |
| **Affected properties** | Which of communication boundary, coordination cost, feedback latency, knowledge concentration, capability placement are implicated |
| **What a Quality Engineer can change** | Stated honestly, and often small |
| **What requires a decision elsewhere** | The condition, and the role that owns it |
| **Consequence of leaving it** | What the next instance looks like and roughly what it costs |
| **Limitation** | What this analysis cannot establish |

The last two rows keep the artefact useful. **Consequence of leaving it** converts an observation into something a decision owner can weigh — "the next instance is another silent consumer breakage, and the last one cost four days of wrong settlement figures" is actionable in a way that "we have a structural problem" is not. And **limitation** guards against the characteristic overreach of this chapter: structural explanations are satisfying, unfalsifiable if stated loosely, and can be attached to almost any recurring problem.

### Failure modes of the assessment

- **Everything becomes structural.** If no problem in your analysis is ever simply a defect, the category has stopped doing work. The three signals exist to discipline this.
- **It becomes a reorganisation proposal.** The artefact names a condition and its consequence. The moment it specifies a target structure it has left the boundary.
- **The technical fix is dismissed.** Structural does not mean the fix is pointless. Atlas should fix the cache key regardless; the point is that fixing it does not prevent the fourth incident.
- **Individuals appear in the analysis.** A structural assessment that names a person has misidentified its subject. Knowledge concentration is a property of the arrangement, not of the person who happens to hold the knowledge.

## Engineering Perspective

The practical value of this chapter is in what it stops you doing.

When a problem recurs, the engineering instinct is to solve it harder — better tests, more automation, a stronger check. If the condition is structural, that effort produces a correct fix and a fourth incident, and the engineer who proposed it may conclude the organisation is careless. Recognising the structural reading redirects the effort: do the fix, and separately describe the condition to the person who owns the arrangement.

The second thing it stops you doing is proposing reorganisations. This is a real temptation once the structural reading becomes visible, and it is where a Quality Engineer's credibility is most easily spent. The analysis is genuinely yours to produce; the arrangement is not yours to design, and the difference between "here is a condition and what it costs us" and "here is how we should be organised" is the difference between being consulted next time and not.

## Industry Perspective

Published engineering practice contains many claims about organisational structure and few controlled findings, and the asymmetry is worth holding onto. Conway's observation is a reasoned argument from a mechanism, not an experimental result. Team-topology patterns are described experience. Delivery-performance research reports associations at team and organisation level from survey populations.

What can be said with reasonable confidence is narrower than what is usually asserted: communication boundaries impose coordination cost; longer feedback loops degrade decision quality; and knowledge concentrated in one person is a risk to continuity. Those are defensible. "This structure produces better quality than that one" generally is not, at least not without the context that made it true somewhere.

## Common Misconceptions and Pitfalls

### "Architecture mirrors the organisation."

Stronger than Conway's claim and dropped of its qualifications. Conway argues that design groups are *constrained* to produce designs copying their communication structures, notes the effect is more pronounced in larger organisations, and grounds it in who negotiates interfaces with whom. Treat it as a tendency to check for, not a law to apply.

### "We should do an inverse Conway manoeuvre."

Practitioner guidance, not a law or standard, and an organisational decision rather than a Quality Engineering one. It may be a reasonable thing for an organisation to do; it is not something this handbook prescribes or that a Quality Engineer owns.

### "It's a structural problem, so there's nothing I can do."

Two errors. The technical fix is usually still worth doing. And describing the condition — with its consequence and its cost — to the person who owns the arrangement is itself the contribution, and is frequently the only route by which the condition ever gets addressed.

### "We just need to hand fulfilment to another team."

A transfer is complete when the receiving group can operate the responsibility without the originating one. Announcing it is not doing it, and the dimensions that determine success — hidden knowledge, evidence continuity, unenumerated dependencies — are exactly the ones an announcement does not address.

### "One person owning all the payment knowledge is a risk we should tell them about."

Knowledge concentration is a property of the arrangement, not a failing of the person. Framing it as an individual issue is unfair, and it also does not work: the concentration persists because nothing in the arrangement creates the time or the occasion to transfer it.

### "If we had the right team structure, quality would follow."

No structure produces quality. Structures make some things cheap and others expensive, and shorten some feedback loops while lengthening others. The useful analysis is which, for the outcome you care about.

## QA → QE → Engineering-Leadership Transition

Three superficially unrelated incidents share one shape.

**QA contribution.** Establishes the pattern across instances: three failures in eighteen months, each involving a change to something shared breaking a consumer that had not been enumerated. Reports the shape accurately, which required noticing that three superficially different incidents were the same incident.

**QE contribution.** Distinguishes the technical component from the structural condition. The cache key is a defect and should be fixed. The generator is that Atlas has a shared vocabulary with an incomplete consumer inventory, and the inventory is incomplete not because it is difficult but because it spans every responsibility and is nobody's most urgent work. Identifies feedback latency and communication boundaries as the implicated properties, and states what the analysis cannot establish — for instance, whether completing the inventory would have prevented all three.

**Engineering-leadership contribution.** Names the consequence of leaving the condition in terms the accountable role can weigh: the next instance is another silent consumer breakage, the last one produced four days of wrong settlement figures, and the exposure grows as consumers are added. Separates what a Quality Engineer can do — enumerate the consumers that *are* discoverable, and propose consulting finance before vocabulary changes — from what requires a decision elsewhere. Then stops, without proposing how Atlas should be organised.

## Summary

Some recurring problems are technical and some are structural conditions wearing technical clothes; the three signals are recurrence in new forms, a cheap fix that has never happened, and every individual having behaved reasonably. Conway's claim is that design groups are constrained to produce designs copying their communication structures, qualified as more pronounced in larger organisations and grounded in who negotiates interfaces — a tendency, not a law, and weaker than "architecture mirrors the organisation." Inverse Conway and team topologies are practitioner guidance. Communication boundaries, coordination cost, feedback latency, knowledge concentration, and capability placement are the structural properties that bear on quality outcomes. An ownership transfer is a system change requiring capability evidence, documentation, evidence continuity, dependency enumeration, and an account of hidden knowledge — and it is close to irreversible, because the originating group's context decays. Part XII analyses these consequences; it does not design organisations.

## Key Takeaways

- A correct technical fix applied repeatedly to a structural condition produces correct fixes and recurring incidents.
- The strongest structural signal is that **every individual behaved reasonably** — if no one's different behaviour would have prevented it, the arrangement produced it.
- Conway's claim is about **communication structures**, is qualified as stronger in larger organisations, and is a tendency rather than a deterministic law.
- **Inverse Conway and team topologies are practitioner guidance**, not law, standard, or research finding — and are organisational decisions, not Quality Engineering ones.
- Feedback latency degrades quality outcomes more reliably than most structural properties, because every decision inside the loop is made without the information.
- **Knowledge concentration is a property of the arrangement, not of the person**, and framing it individually is both unfair and ineffective.
- "Hand it to another team" is an intention. A transfer is complete when the receiving group can operate without the originating one — and hidden knowledge determines whether that happens.
- Ownership transfer is close to irreversible: the originating group's operational context decays and does not persist unused.
- Describe the condition and its cost to whoever owns the arrangement; do not propose the arrangement.

## Review Questions

1. Apply the three signals to Atlas's incomplete consumer inventory. Which apply, and what do they establish?
2. State Conway's claim in his own terms and identify two qualifications commonly dropped when it is cited.
3. Why is "architecture mirrors the organisation" a stronger statement than Conway's, and where does Atlas contradict the stronger version?
4. Classify the inverse Conway manoeuvre by authority class, and say who owns the decision to attempt one.
5. Atlas's fulfilment responsibility is proposed for transfer to a new team. Name the three dimensions you would assess first and say what evidence each requires.
6. Explain why an ownership transfer is less reversible than a code change.
7. A colleague says a structural analysis means nothing can be done. Give two things that can be done.

## Interview Questions

1. How do you tell whether a recurring problem is technical or structural?
2. Describe a situation where a correct fix did not prevent recurrence. What was the underlying condition?
3. How would you raise a structural concern with someone who owns the arrangement, without proposing a reorganisation?
4. What would you want to see before agreeing that a responsibility had been successfully transferred to another team?

## Practical Exercise

Produce a **Structure and Constraint Assessment** for the recurring Atlas contract-failure pattern, then complete the ownership-transfer analysis below.

*The pattern, all synthetic: (i) a status value was added to the `orders` table and the notification module stopped sending silently, the support console rendered blank, and the finance settlement figure was understated for four days; (ii) an event-schema change described in review as "additive, backward compatible" was handled differently by different consumers; (iii) an order-status cache key composed from the order identifier alone served one customer's order summary to a different customer. The consumer inventory for the `orders` table has never been completed — the analytics pipeline is confirmed to exist with unknown read behaviour, and the partner logistics integration's read behaviour is unknown. Four engineers own all eight Atlas responsibilities.*

Complete every field. Your submission must:

- state the common shape so that a fourth incident could be checked against it;
- separate the technical component from the structural condition, and say what fixing the technical component does and does not achieve;
- state which of the three signals apply and how you know;
- name the affected structural properties;
- separate what a Quality Engineer can change from what requires a decision elsewhere, naming the role for the latter;
- state the consequence of leaving the condition, in terms a decision owner can weigh; and
- state one thing this analysis cannot establish.

**Ownership-transfer task.** Atlas is considering transferring fulfilment — including the queue, the workers, and operational responsibility — to a newly formed second team. Analyse the transfer across all eight dimensions. For each, state what evidence would be required before the transfer could be considered complete, and mark any dimension where Atlas currently has *no* evidence at all.

Then answer in three or four sentences: identify the dimension you consider most likely to be underestimated, justify it from the Atlas evidence, and state the residual risk that would remain after a transfer that addressed every other dimension well.

Do **not** propose a team structure, a reporting arrangement, or a staffing plan. Use only synthetic data.

## Further Reading

- [M. E. Conway — How Do Committees Invent?](https://www.melconway.com/Home/Committees_Paper.html) — the original observation, its mechanism, and its qualifications.
- [Part XI — System Design & Architecture](../../part-11-system-design-architecture/README.md) — boundaries, coupling, and the migration and ownership-transfer material this chapter analyses rather than re-teaches.

## References

[^conway]: Conway, M. E. [How Do Committees Invent?](https://www.melconway.com/Home/Committees_Paper.html) *Datamation*, 14(5), pp. 28–31. April 1968. **Verification:** the thesis wording quoted here and the qualifications reported were verified against the author-hosted full text. Accessed 2026-08-15.

Inverse-Conway and team-topology ideas are referenced in this chapter as **practitioner guidance** and are deliberately not cited as standards or research findings. The technical-versus-structural diagnostic, the three signals, the five structural properties, the eight ownership-transfer dimensions, and the Structure and Constraint Assessment are **original MSQE teaching material**. Atlas Commerce is a synthetic teaching baseline and all figures are illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Apply the three signals to distinguish a structural condition from a technical problem.
- [ ] State Conway's claim in his own terms, with two qualifications usually dropped.
- [ ] Classify inverse Conway and team topologies by authority class and say who owns such decisions.
- [ ] Name the five structural properties and give an Atlas instance of each.
- [ ] Explain why knowledge concentration is an arrangement property rather than an individual one.
- [ ] Analyse an ownership transfer across all eight dimensions, including hidden knowledge.
- [ ] Explain why an ownership transfer is close to irreversible.
- [ ] Complete a Structure and Constraint Assessment without proposing an organisational arrangement.

## Chapter Navigation

Previous: [Chapter 6 — Quality Culture: Claims, Evidence, and Limits](chapter-06-quality-culture-claims-evidence-and-limits.md) · Next: [Chapter 8 — Mentoring and Growing Quality Reasoning in Others](chapter-08-mentoring-and-growing-quality-reasoning-in-others.md)
