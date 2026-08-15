# Chapter 2 — Communicating Quality Evidence to Decision Owners

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 2 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapter 1; Parts III, X, and XI recommended |
| Estimated study time | 150 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** Evidence that arrives without its limitation is not a simplified version of the evidence. It is a different claim, and usually a stronger one than anybody was entitled to make.

## Motivating Scenario

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

Three days before a campaign readiness meeting, the engineering director asks for "a one-slide summary of where we are on quality." Four pieces of evidence are available.

A regression suite ran overnight: 1,847 of 1,862 tests passed. A prototype benchmark compared the current in-process checkout arrangement with an extracted arrangement — 200 requests per arm, payment dependency stubbed, warm, single instance, no concurrency — and produced means of 250 ms and 190 ms with a standard deviation of 90 ms in each arm. Fulfilment job arrival during the last four-hour promotional peak averaged 52 per second against a worker completion capacity of 38 per second. And the order-status cache remains disabled following the cross-customer response, with the permanent design undecided.

The slide that reaches the meeting says: *Quality: 99.2% tests passing. Checkout 24% faster in prototype. Fulfilment capacity being reviewed. Cache issue mitigated.*

Every number on that slide is arithmetically correct. The director, reading it, concludes that quality is in reasonable shape, that the extraction has demonstrated a performance benefit, and that the cache problem is behind them. All three conclusions are wrong, and none of them is wrong because a number was wrong.

By the end of this chapter you should be able to say precisely which transformations turned correct evidence into misleading conclusions, and which of them were legitimate simplifications rather than distortions.

## Why This Chapter Matters

Parts III through XI taught you to produce evidence that is bounded, populated, and honest about its limits. This chapter is about what happens to that evidence between your analysis and the moment somebody decides.

The default assumption is that this is a presentation problem, solvable with clearer writing. It is not. It is an evidence problem: the same underlying measurement supports different claims depending on what travels with it, and a summary that drops the population, the condition, or the limitation has not compressed the claim — it has replaced it with a stronger one. The engineer who produced the original analysis is usually the only person in the chain who can tell the difference, which makes this the engineer's responsibility rather than the reader's.

Chapter 1 established that most quality evidence fails at the audience and communication steps. This chapter is about those two steps specifically.

It is **not** a presentation-skills chapter. It contains nothing about slide design, storytelling, or how to be convincing. The objective is not *how do I get stakeholders to agree*; it is *how do I make this evidence understandable enough that the accountable person can make a defensible decision* — including the decision to do nothing.

## Learning Objectives

After completing this chapter you should be able to:

- state the decision a piece of evidence is meant to support, before choosing how to present it;
- distinguish **fact**, **interpretation**, **assumption**, **uncertainty**, and **limitation** in your own writing;
- classify evidence as **measured**, **observed**, **reported**, or **inferred**, and apply the tie-break rule when a case is genuinely ambiguous;
- distinguish **simplification** from **distortion** using a stated test rather than intuition;
- produce different renderings of the same evidence for different decision owners without changing what the evidence establishes;
- recognise when a correct number is decision-irrelevant, and say so;
- produce an Evidence Translation Record; and
- explain why numeric form confers precision but not evidential strength.

## Communication Is Decision-Shaped

The first question is not *what should I say* but *what is being decided, and by whom*.

Evidence has no natural presentation. The same fulfilment-queue measurement — arrival 52 per second against completion capacity 38 per second during a four-hour peak — supports genuinely different claims depending on the decision in front of the reader:

| Decision at stake | What this evidence establishes for that decision |
| --- | --- |
| Should we add worker capacity before the campaign? | Directly relevant: a sustained deficit of 14 jobs per second accumulates backlog for as long as the peak lasts |
| Should we extract fulfilment into a separate service? | Weakly relevant: the deficit is a capacity fact and says nothing about deployment topology |
| Is the queue an acceptable design? | Relevant only in combination with the unbounded queue and absent dead-letter handling |
| Are customers being harmed? | Does not establish it; backlog duration is not the same as customer-visible consequence, which depends on what the delayed job does |

An engineer who does not know which of these is being decided will present the measurement in a way that is accurate and, for three of the four decisions, unhelpful.

This has a practical consequence. Before writing anything for a decision owner, complete two sentences: *"[Role] is deciding whether to [specific action] by [when], under [constraint]."* and *"This evidence bears on that decision because [reason]."* If the second sentence is hard to write, the evidence may not bear on the decision — which is a legitimate and useful thing to discover before the meeting rather than during it.

## Five Things That Get Merged

The single most common defect in engineering communication is the silent merge of categories that should stay separate. Part XI required these distinctions in architecture reasoning; here they apply to anything you hand to a decision owner.

| Category | Definition | Atlas example |
| --- | --- | --- |
| **Fact** | What the evidence directly supports, with its population and conditions | Fulfilment job arrival averaged 52/s against a completion capacity of 38/s during a four-hour promotional peak |
| **Interpretation** | What you conclude from the fact, which is your reasoning and not the measurement | The queue accumulates backlog throughout any peak of that shape |
| **Assumption** | An unverified condition the reasoning depends on | That the next campaign produces a similar arrival profile |
| **Uncertainty** | What is genuinely unknown, and how that affects confidence | Whether the next campaign's promotional mix resembles the last one |
| **Limitation** | What this evidence cannot establish at all | Nothing here establishes customer-visible harm, because the measurement does not cover what the delayed jobs do |

Merging these produces sentences that sound like measurements and are actually predictions. *"Fulfilment can't handle the campaign"* merges all five and is not checkable. *"During a four-hour peak, arrival exceeded completion capacity by 14 jobs per second; if the next campaign has a similar profile, backlog accumulates for its duration. Whether that harms customers depends on what the delayed jobs do, which this measurement does not cover"* keeps them apart and can be argued with — which is the point.

The test for whether you have merged them is simple: **can the reader disagree with your interpretation while accepting your fact?** If not, they are fused.

## Evidence Classes

Part XII uses four evidence classes. They exist to prevent one specific error — importing the confidence of a measurement into a claim that does not have measurement behind it — and they are a teaching aid, not an epistemology.

| Class | What it is | Atlas example |
| --- | --- | --- |
| **Measured** | A recorded quantity with a defined unit, population, and window | Payment provider median response 180 ms, healthy, server-side |
| **Observed** | What was seen to happen, first-hand | The support console rendered blank for unknown status values during the incident |
| **Reported** | Someone's account of what happened or what is true | An engineer's recollection that the shim was intended to run for six weeks |
| **Inferred** | What conditions make likely, without direct evidence | That the analytics pipeline reads the `orders` table, since it produces order-level figures |

These are **not interchangeable and not ranked into a score.** There is no point value, grade, confidence percentage, or maturity level attached to them, and constructing one would defeat their purpose. A measured figure over a badly chosen population can be far weaker than a careful first-hand observation.

### Edge cases and the tie-break rule

Real evidence does not arrive pre-labelled. The following cases recur:

| Case | Classification | Rule |
| --- | --- | --- |
| A survey | **Both, separately** — response counts and rates are *measured*; what respondents said is *reported* | Classify the instrument and its content separately; never let a measured response rate lend its precision to the reported content |
| An interview or retrospective comment | *Reported* | A person's account is reported evidence regardless of how confidently it is expressed |
| Repository or tooling activity | *Measured* — about **activity** | It is measured evidence about what was recorded, not about intent, quality, effort, or causality; name the attribute the measure actually covers |
| Observation by a Quality Engineer participating in the work | *Observed*, with a participant-observer limitation | Record that the observer was inside the system observed and may have influenced it |
| A pattern seen repeatedly | *Inferred* | Repetition strengthens an inference; it does not convert inference into direct evidence, and the class does not change with the count |

Where a case is genuinely ambiguous, the tie-break is to **classify it as the weaker class and state why.** Classification follows the purpose the evidence serves in the decision, not whichever label lends it the most apparent authority.

The last row deserves emphasis because it is counter-intuitive. Seeing the same failure shape five times is better grounds for an inference than seeing it once — but it remains an inference. Five observations of a pattern do not become a measurement of a cause.

## A Number Can Still Be Weak Evidence

Numeric form confers precision, not strength. These are independent properties, and treating the first as evidence of the second is how correct arithmetic produces indefensible decisions.

### Worked example: a correct pass rate that answers nothing

The following is an **illustrative, synthetic example** using the Atlas baseline.

| Element | Content |
| --- | --- |
| **Context** | Three days before the campaign readiness meeting, the engineering director asks for a summary of quality. The decision in front of her is whether to proceed with the campaign scope as planned or to hold back a change. |
| **Population** | All automated tests in the Atlas regression suite as of the overnight run: 1,862 tests. The population is *tests in the suite*, not *behaviours of the system*. |
| **Assumptions** | That the suite ran to completion; that no test was skipped or quarantined; that a passing test indicates the behaviour it covers is intact. |
| **Units** | Count of tests; percentage of tests passed. |
| **Calculation** | 1,862 − 1,847 = **15** failures. Pass rate = 1,847 ÷ 1,862 = 0.9919441… = **99.19%**, which rounds to the 99.2% that appeared on the slide. |
| **Interpretation** | 99.19% of the tests in this suite passed. That is the entire interpretation the figure supports. |
| **Limitation** | **The figure cannot bear on the decision at hand.** The concern before the director is the `PAYMENT_UNKNOWN` reconciliation exposure and the disabled order-status cache. No test in the suite exercises payment-provider degradation, retry deduplication, or cross-customer cache keying — those failure modes require conditions the suite does not create. The pass rate is computed over a population that excludes the concern entirely. A suite that omits a failure mode cannot produce a low pass rate because of it; the number would read 99.19% whether or not the exposure existed. |
| **Decision relevance** | **None for the campaign decision.** It supports a narrow claim about regression coverage that was already known. Presenting it as "quality" in that meeting displaces the evidence that does bear on the decision. |

This is the pattern to internalise. The arithmetic is correct at every step. The failure is that the number was computed over a population chosen for availability rather than relevance, and then labelled with a word — "quality" — far broader than the population supports. **Correct arithmetic is not sufficient decision evidence.**

Note also what makes the number actively harmful rather than merely useless: it is *reassuring*. A director who reads "99.2%" and moves on has been given a reason not to ask the question that mattered.

## Simplification and Distortion

Different audiences need different renderings. Producing them is legitimate and necessary; a director does not need per-call medians and an engineer does not need a one-line summary. What makes the difference between compression and misrepresentation is not length.

> **The test:** a simplification omits detail that does not change the decision. A distortion omits something that does. If removing an element would cause a reasonable decision owner to choose differently, removing it is a distortion regardless of how much shorter it makes the document.

Applied to the benchmark from the motivating scenario:

| Rendering | Simplification or distortion? | Why |
| --- | --- | --- |
| "Means 250 ms and 190 ms, 200 requests per arm, SD 90 ms, payment stubbed, single instance, no concurrency" | Full statement | — |
| "Prototype benchmark suggests the extracted arrangement was faster in a stubbed, single-instance comparison; not a production estimate" | **Simplification** | Drops the exact figures; preserves that it is a prototype, stubbed, and not production-representative |
| "Checkout 24% faster in prototype" | **Distortion** | Drops that the payment dependency — the largest component of the real path at 180 ms median — was stubbed out. With payment included, the difference of 60 ms sits against a call that dominates the path. The omission converts a bounded prototype signal into an apparent performance result |
| "Extraction makes checkout faster" | **Distortion** | Additionally drops that it is a prototype at all |

The third row is the important one because it is the rendering most likely to be produced in good faith. Nobody lied. The percentage is arithmetically defensible: (250 − 190) ÷ 250 = 0.24 = 24%. It is a distortion because the stubbing is not detail — it is the condition under which the number means anything, and a decision owner weighing an extraction would choose differently knowing it.

### What must always survive

Three things must survive every level of compression, because their absence changes the claim:

- **The condition under which the evidence holds.** Stubbed, single-instance, healthy provider, four-hour peak.
- **The population.** Tests in a suite, not behaviours of a system. Server-side timings, not customer-experienced latency.
- **The limitation that would change the decision.** Not every limitation — the ones that matter to this decision.

Everything else — mechanism, methodology, intermediate figures, tooling — can be compressed or moved to an appendix without dishonesty.

## Rendering for Different Decision Owners

The same underlying evidence, rendered for four different roles. Note that what changes is *emphasis and depth*, never what the evidence establishes.

**Evidence:** the fulfilment queue is unbounded with no dead-letter handling; failed jobs retry indefinitely; during a four-hour promotional peak, arrival averaged 52/s against completion capacity of 38/s, returning to 30/s afterwards.

| Reader | What they are deciding | Rendering |
| --- | --- | --- |
| **Engineer** | How to change the worker or queue behaviour | Full statement including the retry-indefinitely behaviour and the absence of dead-letter handling, because both determine what a fix must address |
| **Delivery owner** | Whether to change campaign scope, and what to sequence | Deficit of 14 jobs/s sustained through the peak; backlog persists past the peak because post-peak arrival of 30/s leaves only 8/s of surplus drain capacity; the mechanism matters less than the duration |
| **Platform owner** | Whether to provision capacity | Capacity deficit and its duration; the unbounded queue as an operational risk under sustained deficit |
| **Engineering director** | Whether the campaign plan is sound | Fulfilment capacity is below peak demand by a known margin, so backlog is expected rather than exceptional; the open question is what the delayed jobs are and who is affected, which has not been established |

Every rendering above preserves the condition (four-hour promotional peak), the population (fulfilment jobs), and the limitation (customer impact not established). None of them is more persuasive than another; they differ in what the reader needs in order to act.

### Where this becomes persuasion, and why to stop

There is a boundary here that is easy to cross without noticing. Adapting to what a reader needs in order to decide is translation. Adapting to what a reader would find most agreeable, or ordering the evidence so that a preferred conclusion is the only visible one, is something else.

The diagnostic question is: **would I present it the same way if I preferred the opposite conclusion?** If the answer is no, the rendering is being shaped by your preference rather than by the reader's need. That is not a moral failing so much as a durable practical mistake — an engineer who is discovered to have done it once loses the credibility that made the previous ninety analyses useful, and credibility is the whole of an individual contributor's influence.

Selectively omitting material evidence is out of scope for this handbook in the plainest possible terms: it is not a communication technique, and it is not taught here.

## The Evidence Translation Record

The **Evidence Translation Record** is an original MSQE teaching artefact, not an industry standard. It is a short working document that records how a piece of evidence was rendered for a specific decision owner, and what was deliberately left out.

| Field | What it records |
| --- | --- |
| **Source evidence** | The full statement, with population, condition, and units |
| **Evidence class** | Measured, observed, reported, or inferred — with the tie-break reason if ambiguous |
| **Decision supported** | The specific decision, its owner, and the owner's constraint |
| **Fact** | What the evidence directly supports |
| **Interpretation** | What you conclude, marked as your reasoning |
| **Assumption** | Unverified conditions the reasoning depends on |
| **Uncertainty** | What remains genuinely unknown |
| **Limitation** | What this evidence cannot establish |
| **Rendering** | The compressed form as delivered |
| **Deliberately omitted** | What was left out, and why each omission does not change the decision |
| **Distortion check** | An explicit statement that no omitted element would change the owner's choice |

The **Deliberately omitted** field is the one that makes the artefact worth completing. Writing down what you removed forces you to justify each removal against the decision, which is exactly the check that distinguishes simplification from distortion. In practice, most distortions are discovered at the moment someone tries to write the justification and cannot.

The record is a working artefact, not a deliverable to the decision owner. It is written for you, and for whoever asks later why the summary said what it said.

### Failure modes of the record

- **"Deliberately omitted" is left blank.** Something was always omitted. A blank field means the omissions were not examined.
- **Interpretation is written in the Fact row.** If the row contains a causal word — "because", "causes", "means that" — check whether it belongs one row down.
- **The record is written after the summary.** Written afterwards it becomes a justification exercise. Written first it changes the summary.
- **Limitation lists everything.** A limitation list that includes every conceivable caveat is a way of hiding the one that matters. Name the limitation that bears on *this* decision.

## Engineering Perspective

The engineering discipline here is population reasoning, which the handbook has applied throughout: a measurement is about a population under conditions, and a claim that outruns either is not supported.

What Part XII adds is that **summarisation silently changes the population**. "99.2% tests passing" has a population — tests in a suite. Labelled "quality", it acquires a much larger implied population — behaviours of the system — without any measurement to support the expansion. No number changed. The claim did.

This is the same class of error as reporting a benchmark without its conditions, or a percentile without its window. The difference is that in this case the error is introduced by compression rather than by measurement, which is why it survives review by people who check the arithmetic.

## Industry Perspective

Documented practice in high-consequence domains tends to converge on the same structural answer: separate the finding from its interpretation, and require conditions to travel with results. Incident reports distinguish timeline from analysis. Clinical and safety reporting conventions require the population and the conditions alongside the effect. Engineering test reports that are used for decisions rather than dashboards typically carry the environment, the version, and the scope of what was exercised.

The common feature is not a particular template. It is that the condition and the population are treated as part of the result rather than as metadata — so that compressing them out is visibly an omission rather than a formatting choice.

## Common Misconceptions and Pitfalls

### "Executives only want the headline."

Decision owners want what lets them decide. A headline that omits the condition under which a result holds does not save their time; it costs them a decision they will have to revisit. The legitimate version of this instinct is that they do not need the mechanism — which is true, and different.

### "If I include all the caveats, nobody will act."

Sometimes true, and it is not a reason to remove them. If a decision would only be taken in the absence of a material limitation, then the limitation is decision-relevant by definition, and removing it manufactures an action the evidence does not support. What is legitimate is to state the limitation once, clearly, rather than repeatedly and defensively.

### "Numbers are objective."

Numbers are precise. Precision is a property of representation; strength is a property of what was measured, over what population, under what conditions. A percentage computed over a population chosen for availability is exact and weak simultaneously.

### "Different versions for different audiences means telling people different things."

It means giving people different depth. If two renderings would lead two reasonable owners to incompatible conclusions, they are not two renderings — they are two claims, and at most one of them is supported.

### "The evidence speaks for itself."

Evidence does not travel with its own conditions unless someone attaches them. In the motivating scenario, every number spoke for itself and each said something false about the decision at hand.

## QA → QE → Engineering-Leadership Transition

Taking the benchmark evidence — 250 ms and 190 ms, 200 requests per arm, payment stubbed, single instance, no concurrency:

**QA contribution.** Reports the result accurately and completely: both means, the sample size, the standard deviation, and the conditions. Nothing is wrong with this and it is the necessary foundation.

**QE contribution.** Establishes what the result can support. With payment stubbed, the comparison excludes the call whose 180 ms median dominates the real path; the standard deviation of 90 ms in each arm is large relative to the 60 ms difference; and single-instance, no-concurrency conditions do not represent campaign load. The finding is a bounded prototype signal about in-process overhead, not a performance estimate.

**Engineering-leadership contribution.** Establishes which decision this is meant to inform and who owns it; renders it so that the stubbing and the prototype status survive into the one-line version; records what was omitted and why; and, where the evidence does not bear on the decision at hand, says so rather than supplying it because it was available. The last of these is the hardest, because supplying an available number is always easier than explaining that the useful number does not exist yet.

## Summary

Communication of quality evidence is decision-shaped: the decision and its owner determine what rendering is honest, not the reader's seniority or the length of the document. Fact, interpretation, assumption, uncertainty, and limitation must stay separate, and the test is whether a reader can disagree with your interpretation while accepting your fact. Evidence classes — measured, observed, reported, inferred — prevent the import of measurement confidence into claims that lack it, with the tie-break rule that ambiguous cases take the weaker class. Numeric form confers precision, not strength: a correct pass rate computed over a population that excludes the concern is exact and decision-irrelevant. Simplification omits what does not change the decision; distortion omits what does, and the condition, the population, and the decision-relevant limitation must survive every level of compression.

## Key Takeaways

- Establish the decision and its owner before choosing a rendering; evidence has no natural presentation.
- If a reader cannot disagree with your interpretation while accepting your fact, the two have been fused.
- The four evidence classes are a reasoning aid, never a score, grade, or confidence percentage; ambiguous cases take the **weaker** class and say why.
- **A number can still be weak evidence.** Precision and strength are independent properties.
- Simplification omits what does not change the decision; distortion omits what does — length is not the test.
- Condition, population, and the decision-relevant limitation must survive into the shortest rendering.
- Ask whether you would present it the same way if you preferred the opposite conclusion; if not, the rendering is being shaped by preference rather than need.
- Saying "the evidence that would answer this does not exist yet" is a legitimate and often the most useful contribution.

## Review Questions

1. The pass rate of 99.19% is arithmetically correct. Explain, in terms of population, why it cannot bear on the campaign decision — and why it is more harmful than an absence of information.
2. "Checkout 24% faster in prototype" is defensible arithmetic and a distortion. State the test you applied and the specific element whose omission changes the decision.
3. A colleague reports that "the team says the shim was only meant to last six weeks." Classify this evidence and state what it can and cannot establish.
4. A survey of eleven engineers returns nine responses, of which seven say incident reviews feel blameless. Apply the evidence-class rules. Which part is measured, which is reported, and what does the response rate — 9 of 11, or roughly 82% — license you to claim?
5. You have seen the same silent-consumer failure shape four times across different systems. What is the evidence class, and does it change on the fifth occurrence? Why or why not?
6. Give an example of a limitation you would keep in a one-line summary, and one you would drop. Justify both against the same decision.

## Interview Questions

1. How do you decide what to leave out when summarising a technical finding for a non-specialist decision owner?
2. Describe a time when the most useful thing you could report was that the available evidence did not answer the question.
3. How would you tell whether a summary you wrote had crossed from simplification into distortion?
4. A stakeholder asks for "a single number for quality." How do you respond?

## Practical Exercise

Produce an **Evidence Translation Record** for the following synthetic Atlas Commerce evidence, and then produce two renderings from it.

*Server-side checkout path timings, healthy provider, per-call medians in milliseconds: edge 8, session validation 25, cart/pricing 40, payment call 180, order write 30, own processing 12. The payment provider's median response is 180 ms healthy and was observed at approximately 4,000 ms during degradation, against a 5-second client timeout. Checkout retries the payment call up to twice after the initial attempt, immediately, with no backoff and no overall time budget.*

The decision in front of the delivery owner is whether to add an overall time budget to the payment call before the campaign, eleven weeks away, with four engineers who own all eight Atlas responsibilities.

Your submission must:

- complete every field of the Evidence Translation Record, including **Deliberately omitted** and **Distortion check**;
- classify each piece of evidence and justify any ambiguous classification using the tie-break rule;
- separate at least one fact from at least one interpretation, such that a reader could accept the fact and reject the interpretation;
- state one thing this evidence **cannot** establish about customer experience, and say why;
- produce a rendering for the delivery owner and a two-sentence rendering for the engineering director, both preserving condition, population, and the decision-relevant limitation; and
- identify one plausible summarisation of this evidence that would be a **distortion**, and state which omitted element changes the decision.

Then answer in two or three sentences: the six per-call medians sum to 295 ms. Explain why presenting that sum as "checkout takes 295 ms" would be unsupported, and name what population the sum actually describes. Use only synthetic data.

## Further Reading

- [Part X — Performance & Security Engineering](../../part-10-performance-security/README.md) — workload and measurement models, and why conditions are part of a result rather than metadata attached to it.
- [Part XI — System Design & Architecture](../../part-11-system-design-architecture/README.md) — bounded architecture claims, evidence gaps versus limitations, and decision ownership.

## References

This chapter makes no external factual claim requiring citation. The four evidence classes with their tie-break rule, the simplification-versus-distortion test, and the Evidence Translation Record are **original MSQE teaching material**. All Atlas Commerce figures are synthetic, carried unchanged from Part XI's evidence base, and illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] State the decision, its owner, and the owner's constraint before choosing how to present evidence.
- [ ] Separate fact, interpretation, assumption, uncertainty, and limitation in your own writing.
- [ ] Classify evidence into the four classes and apply the tie-break rule to an ambiguous case.
- [ ] Explain why a correct number can be decision-irrelevant, using population reasoning.
- [ ] Apply the simplification-versus-distortion test to a specific omission.
- [ ] Name the three things that must survive into the shortest rendering.
- [ ] Complete an Evidence Translation Record, including what was deliberately omitted and why.

## Chapter Navigation

Previous: [Chapter 1 — Engineering Leadership as Quality Engineering](chapter-01-engineering-leadership-as-quality-engineering.md) · Next: [Chapter 3 — Written Records, Technical Writing, and Organisational Memory](chapter-03-written-records-technical-writing-and-organisational-memory.md)
