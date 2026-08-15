# Chapter 9 — Measuring Engineering and Quality Practice

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XII — Engineering Leadership & Career Growth |
| MQE-BOK domain | Domain 12 — Engineering Leadership |
| Chapter | 9 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers |
| Prerequisites | Chapters 1–8; **Part I Chapter 7** for the Goodhart treatment; **Part XI Chapter 9** for fitness functions and the measure-becomes-target risk |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** The number is usually right. The question is what attribute it measures, over which population, and which step turned it into a conclusion nobody could have drawn from it.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce baseline.

Two quarters after the mandated pre-merge review checklist was introduced, the delivery owner asks the obvious question: did it work?

The figures are available and they look encouraging. In the quarter before the checklist, 16 of 300 changes reaching production produced an escaped defect — 5.33%. In the quarter after, 20 of 450 — 4.44%. A drop of nearly a percentage point, across half again as many changes.

Someone puts it on a slide as *escaped defect rate down 17%*, which is arithmetically defensible. The delivery owner is inclined to extend the checklist to the fulfilment work.

The arithmetic is correct. Every figure is real. And the conclusion is wrong in a way that will not be visible to anyone who checks the arithmetic, because the arithmetic is not where it failed.

By the end of this chapter you should be able to find the step where it failed, name it precisely, and explain why a reader who verifies every calculation will still be misled.

## Why This Chapter Matters

This is the chapter where Part XII's evidence discipline meets the domain most likely to corrupt it.

Measurement in engineering practice has three compounding hazards. The measures are usually *available* rather than *valid* — organisations measure what their tooling emits. The numbers carry precision that suppresses the question of what they measure. And once a measure is attached to a target, it begins to change the behaviour it was measuring, which is a predictable effect rather than a misuse.

For a Quality Engineer the stakes are specific. You will be asked for numbers about practice, by people entitled to ask. Supplying an available number that does not measure the attribute in question is worse than declining, because it closes the question with a wrong answer that looks rigorous.

This chapter is **not** a metrics programme design, a dashboard specification, a maturity model, a benchmarking exercise, or an individual performance-measurement method. It contains no composite score of any kind, and constructing one from its contents would defeat its purpose.

## Learning Objectives

After completing this chapter you should be able to:

- assess whether a measure has **construct validity** for the attribute it is being used to describe;
- trace a measure through the chain from measurement to decision and identify where it changes role;
- explain why individual-level productivity measurement is hazardous, in construct terms rather than moral ones;
- recognise a case where correct arithmetic supports an invalid inference, and name the failing step;
- use delivery-performance measures and multidimensional framings within their stated scope, at the level they were validated for;
- state current DORA terminology with its source date, and explain why the date is required;
- distinguish the repository's Goodhart lineage from Strathern's formulation and from casual attribution; and
- produce a Practice Measurement Plan.

## Construct Validity

The first question about any measure is not whether it is accurate. It is whether it measures the thing it is being used to describe.

This is **construct validity**, and Kaner and Bond put it as the question of how we know that we are measuring the attribute we think we are measuring. Their argument runs from a specific observation: while some measurement standards treat direct measures as needing no validation, few or no software engineering attributes or tasks are simple enough for measurement of them to be direct — so, as they put it, all metrics should be validated. They work this through on two uses of bug counts, concluding that bug counts capture only a small part of the meaning of the attributes they are used to measure, and suggest multidimensional analysis of attributes as more promising.[^kaner-bond]

The consequence for practice measurement is that a measure has no validity in itself. It has validity *for a claimed attribute*, and the same number can be valid for one and invalid for another:

| Measure | Valid for | Invalid for |
| --- | --- | --- |
| Deployments in a window | How often code reached production | How much value was delivered; how good the deployments were |
| Escaped defects per change | How often changes produced post-release defects **that were found and attributed** | The quality of the code; the diligence of anyone |
| Time from commit to production | Duration of a defined pipeline segment | Team speed; responsiveness; whether the work was worth doing |
| Review comments per pull request | Volume of recorded review commentary | Review thoroughness; code quality; reviewer skill |
| Incidents per quarter | Count of events classified as incidents | Reliability, unless classification is stable across the window |

Two properties recur in the invalid column. The measure often covers **only part** of the attribute — bug counts and code quality. And it is often **confounded by things unrelated** to the attribute — escaped defects reflect where changes were made and how hard anyone looked, not only how carefully they were made.

The practical test before offering any measure: complete the sentence *"this measures ___, which is part of ___, and omits ___."* If the third blank is large relative to the claim being made, the measure lacks validity for that claim regardless of how accurately it was collected.

## The Chain from Measurement to Decision

Most measurement failures are not wrong numbers. They are a measure silently changing role. The chain makes the change visible:

```text
MEASUREMENT
  → INDICATOR
  → PROXY
  → TARGET
  → EVIDENCE
  → INFERENCE
  → DECISION
```

| Step | Definition used in Part XII | What changes at this step |
| --- | --- | --- |
| **Measurement** | A recorded quantity with a defined unit, population, and window | Nothing yet — it is a fact about what was counted |
| **Indicator** | A measurement selected because it is believed to say something about a condition of interest | A **judgement** enters: someone chose this measurement as informative |
| **Proxy** | An indicator standing in for an attribute it does not directly measure | A **validity claim** enters, usually unstated |
| **Target** | A proxy that behaviour is now expected to move | The measure begins to **change the thing it measures** |
| **Evidence** | A measurement or observation offered in support of a specific claim, with population, limitation, and class stated | The measure is attached to a **claim** |
| **Inference** | The step from evidence to conclusion | **Where most failures happen — and it is invisible unless written down** |
| **Decision** | The action taken by the accountable owner | The inference informs it; it does not determine it |

### Worked chain: deployment frequency

Follow one measure through every step.

1. **Measurement.** Atlas deployed 47 times last quarter. Defined, countable, correct.
2. **Indicator.** Someone selects it as an indicator of delivery flow. Defensible — deployment frequency does say something about how work moves.
3. **Proxy.** It starts being used to stand in for *productivity*. A validity claim has now been made and not stated: that deployment count covers productivity. It does not — it says nothing about what was deployed or whether it was worth deploying.
4. **Target.** A goal is set: deploy more often. Behaviour adapts. Changes are split into smaller deployments, which may be good or may be splitting for the metric.
5. **Evidence.** The figure is presented as evidence that the team improved.
6. **Inference.** *The team is more productive.* This is the failing step. Deployment count cannot support it, and no amount of accuracy in step 1 repairs it.
7. **Decision.** Extend the practice; reward the team; apply it elsewhere.

Each step is individually reasonable. The chain is not. **Naming the step at which it broke — here, the proxy substitution at step 3, which made the inference at step 6 possible — is this chapter's core skill.**

## Correct Arithmetic, Invalid Inference

The following is an **illustrative, synthetic example** using the Atlas baseline. It exists to establish one proposition: **correct arithmetic does not make a conclusion valid.**

| Element | Content |
| --- | --- |
| **Context** | Atlas introduced a mandated pre-merge review checklist after an incident. The delivery owner asks whether it worked. |
| **Population and level** | All Atlas changes reaching production in two consecutive quarters, split by change type. **Team level. No individual is measured.** |
| **Assumptions** | An escaped defect is one found after production release and attributed to the change; classification is unchanged across quarters; both quarters are fully recorded. |
| **Units** | Escaped defects per 100 changes — the percentage of changes producing an escaped defect. |
| **Calculation** | **Q1 (before):** routine catalogue changes 4 ÷ 200 = **2.0%**; payment-path changes 12 ÷ 100 = **12.0%**; overall 16 ÷ 300 = 5.333…% ≈ **5.33%**. **Q2 (after):** routine 12 ÷ 400 = **3.0%**; payment-path 8 ÷ 50 = **16.0%**; overall 20 ÷ 450 = 4.444…% ≈ **4.44%**. |
| **The tempting interpretation** | The escaped-defect rate fell from 5.33% to 4.44% — a 0.89 percentage-point improvement, roughly a sixth of the previous rate — across 450 changes. The checklist worked. |
| **Why the inference is invalid** | **Both segments got worse.** Routine rose from 2.0% to 3.0%; payment-path rose from 12.0% to 16.0%. The aggregate improved only because the **denominator composition shifted**: payment-path changes fell from 100 of 300 changes (33.3%) to 50 of 450 (11.1%) when the team was diverted to campaign work. Fewer high-risk changes were made, not better ones. |
| **Mix-adjusted comparison** | Applying Q2's segment rates to Q1's mix: (200 × 3.0%) + (100 × 16.0%) = 6 + 16 = 22 escaped defects over 300 changes = 7.333…% ≈ **7.33%**. Held at a constant mix, the rate **rose** from 5.33% to 7.33% — the opposite of the aggregate's direction. |
| **Interpretation** | The arithmetic is correct at every step and the aggregate figure is real. What fails is the step from *evidence* to *inference*: the aggregate answers "what proportion of changes escaped a defect", which is not the question "did the checklist improve our practice". |
| **Limitation** | This analysis cannot establish that the checklist made things *worse* either. Segment rates moved for reasons the data does not identify, campaign pressure is an obvious confounder, and two quarters is a short window. It establishes only that the aggregate improvement does not support the claim made from it. |
| **Decision relevance** | Supports rejecting the claim that the checklist is validated, and supports asking for segmented figures before any decision to extend it. Does **not** by itself decide whether to keep, revise, or withdraw the checklist — that is the delivery owner's decision. |

Locate the failure on the chain. The measurement is sound. The indicator is defensible. The failure is at **inference**, and it is invisible to anyone checking arithmetic because every calculation is right.

Two features make this example worth more than a contrived one. The aggregate movement is **genuinely persuasive** — a reader has no reason to distrust it. And the mix change has an innocent cause: nobody manipulated anything, the team was simply pulled onto campaign work, which reduced the proportion of high-risk changes. **Segment-mix effects do not require anyone to be gaming a measure.**

## Individual Measurement

Individual-level productivity measurement is treated here as a construct-validity problem rather than a moral one, because the construct argument is the one that holds.

Take **defects per engineer**, the canonical case. Kaner and Bond's analysis of bug counts applies directly: the count captures only a small part of the attribute it is used for. An engineer's defect count is driven by which area they work in — Atlas's payment-path changes produce escaped defects at five to six times the routine rate — by how much of the risky work they were assigned, by how hard anyone looked in that area, and by whether problems in their area fail loudly or silently. Capability is somewhere in there and is not separable.

The arithmetic is trivial and correct. The inference — that a higher count indicates a less careful engineer — is invalid, and would remain invalid with perfect data.

Then there is the second-order effect. Attach the measure to consequences and behaviour adapts: engineers avoid risky areas, classification of what counts as a defect drifts, and problems become less likely to be reported. The measure improves. The thing it was standing in for does not, and the organisation has lost the reporting behaviour it depended on.

The same reasoning disqualifies **test cases per engineer** (rewards count over coverage of risk), **automation percentage as productivity** (a ratio whose denominator is a choice), **story points as productivity** (an estimate, and estimates inflate when measured), and **deployment frequency as individual performance** (attributing a team-level pipeline property to a person).

**Part XII does not endorse any of these as individual measures, and does not rank people.** The Practice Measurement Plan below records the level at which a measure is valid, and any measure whose valid level is the team cannot be reported per person.

## Delivery-Performance Measures, Within Scope

Two widely used framings appear here with their scope stated, because both are routinely used outside it.

### DORA

DORA's software delivery performance model currently comprises **five** metrics, grouped as three throughput and two instability measures, as published on DORA's metrics guide accessed **2026-08-15**:[^dora-metrics]

| Group | Metric | Definition as published |
| --- | --- | --- |
| Throughput | **Change lead time** | The amount of time it takes for a change to go from committed to version control to deployed in production |
| Throughput | **Deployment frequency** | The number of deployments over a given period, or the time between deployments |
| Throughput | **Failed deployment recovery time** | The time it takes to recover from a deployment that fails and requires immediate intervention |
| Instability | **Change fail rate** | The ratio of deployments that require immediate intervention following a deployment, likely resulting in a rollback or a hotfix |
| Instability | **Deployment rework rate** | The ratio of deployments that are unplanned but happen as a result of an incident in production |

**The access date is not a formality.** This model has changed in both count and naming — what was formerly discussed as mean time to restore or time to restore service has been superseded by *failed deployment recovery time*. Any manuscript, dashboard, or report reproducing a metric list must carry the date of the source it was taken from, and must not silently mix historical and current terminology. Where historical terms are discussed, date them.

DORA's own guidance is explicit about misuse, and it is worth reproducing rather than paraphrasing away: it warns against broad mandates such as deploying multiple times daily by year-end, on the grounds that these invite gaming — invoking Goodhart's law directly; it states the metrics are meant to be applied at the application or service level and that comparing them between very different applications can be misleading; it warns that isolating teams with specific metrics leads to friction and finger-pointing; and it states the objective is improvement over time rather than competing against other teams or organisations.

Part XII adds nothing to those warnings and does not weaken them. **DORA measures are not converted here into a quality score, team ranking, maturity score, leadership score, or developer productivity score.**

### SPACE

The SPACE framing is explicitly **multidimensional** — it exists to resist the reduction of developer productivity to a single measure, and treats it across several distinct dimensions that must be considered together.[^space]

**Verification note:** the metadata for this source is verified exactly, including all six authors and the publication record. The full text was not accessible for this drafting. This chapter therefore uses SPACE only for the proposition its title and framing directly support — that developer productivity is multidimensional and should not be collapsed — and attributes no specific dimension definitions, measurement guidance, or empirical finding to it.

The operative constraint: **collapsing multiple dimensions into one number defeats the purpose of the framing.** A composite "SPACE score" is not an application of the framework; it is the thing the framework was constructed to prevent. Likewise, SPACE is not an individual performance-ranking instrument, and this chapter does not use it as one.

## Measure and Target

When a measure becomes a target, behaviour adapts to satisfy the measure rather than the property it stood for. This is a **predictable effect, not a misuse**, and treating it as a failure of discipline in the people being measured misdiagnoses it.

The repository's lineage here is specific and worth keeping straight:

- **Part I Chapter 7** contains the handbook's Goodhart treatment, and qualifies Goodhart's law as a cautionary heuristic originating in monetary policy rather than a scientific law proving every target harmful. Part XII consumes that treatment and does not restate or extend it.
- **Part XI Chapter 9** contains the fitness-function and measure-becomes-target reasoning, drawing on Strathern's formulation — that a measure ceases to be a good measure once it becomes a target. **Part XI contains no Goodhart treatment**, and attributing one to it is an error.
- **Strathern** is a separate source with its own scope, and should be cited for her formulation rather than folded into a general "Goodhart's Law" attribution.

The discipline for a Quality Engineer: do not attribute every undesirable measurement effect to Goodhart's law. The Atlas segment-mix case involves **no target and no gaming at all** — the mix shifted because the team was pulled onto campaign work. Reaching for Goodhart there would misdiagnose a population problem as an incentive problem, and would point at the wrong remedy.

## The Practice Measurement Plan

The **Practice Measurement Plan** is an original MSQE teaching artefact, not an industry standard, metrics framework, or scorecard. It is completed **before** a measure is collected, for one measure at a time.

| Field | What it records |
| --- | --- |
| **Attribute of interest** | What someone actually wants to know, in plain terms |
| **Proposed measure** | The quantity, with unit, population, and window |
| **Construct validity** | *This measures ___, which is part of ___, and omits ___* |
| **Confounders** | What else moves this number besides the attribute |
| **Valid level** | Individual, team, service, or organisation — and the level it is **not** valid at |
| **Role on the chain** | Measurement, indicator, proxy, evidence — and whether a target is proposed |
| **If it becomes a target** | The behaviour change to expect, and what would be lost |
| **Segment sensitivity** | Whether the aggregate can move without any segment moving, and which segments to report |
| **What it cannot establish** | Stated explicitly |
| **Decision it supports** | The specific decision and its owner |
| **Stop condition** | What would cause this measure to be withdrawn |

Three fields distinguish this from a metric definition.

**Construct validity, in that sentence form.** Being forced to complete the *omits* clause is what surfaces the mismatch. Most rejected measures are rejected here.

**Valid level, including where it is not valid.** Recording that a measure is valid at team level and *not* at individual level is what prevents its later reuse in a performance context. Say it in the artefact rather than in the meeting.

**Segment sensitivity.** After this chapter's worked example, no aggregate practice measure should be planned without asking whether it can move on mix alone. If it can, the segments to report are part of the measure's definition, not an optional refinement.

### Failure modes of the plan

- **It is completed after collection.** Written afterwards it justifies; written first it filters.
- **Stop condition is left blank.** A measure with no withdrawal condition will be collected indefinitely and eventually reported by someone who does not know its limits.
- **Valid level is stated only positively.** "Valid at team level" is weaker than "valid at team level; **not valid per individual**", and the second is what survives being forwarded.
- **The plan becomes a dashboard specification.** One measure, one decision. A plan covering twelve measures has become a programme, which is out of scope.

## Engineering Perspective

The habit worth forming is to ask **"what would move this number without the underlying thing changing?"** before offering any measure.

For the escaped-defect rate the answer is: a shift in the mix of change types; a change in what counts as an escaped defect; a change in how hard anyone looks; and a change in release cadence altering the denominator. That is four ways to move the number without practice changing at all — and knowing them in advance turns a later movement from a conclusion into a question.

This is the same reasoning the handbook has applied throughout: name the population, name the conditions, and state what the evidence cannot establish. Practice measurement is where it is hardest to apply, because the numbers are easy to obtain and the attribute is hard to define — which is precisely the combination that produces confident wrong answers.

## Industry Perspective

Documented measurement practice in engineering has converged on a small set of defensive conventions rather than a standard metric set: report measures in groups rather than singly so that improvement in one is visible against degradation in another; apply them at the level they were validated for; avoid cross-team comparison where context differs; and treat trend within a context as more informative than a point value against an external benchmark.

The common thread is that each convention exists to prevent a specific known failure — single-metric optimisation, level misapplication, false comparison, and benchmark chasing. Where measurement programmes fail, the failure is usually not a bad metric but a good metric applied at the wrong level or reported without the segment that explains it.

## Common Misconceptions and Pitfalls

### "The numbers don't lie."

The numbers are usually right. What fails is the inference, and the failure is invisible to anyone who checks the arithmetic. The Atlas aggregate is correct and the conclusion drawn from it is not.

### "We just need a single number for engineering health."

A single number requires collapsing dimensions that move independently, which is the reduction SPACE's framing exists to resist. Any such number will improve while something it hid gets worse — and the fact that it is a single number is what makes that invisible.

### "Defects per engineer would show us who needs support."

The measure lacks construct validity for capability: it is dominated by area risk, work allocation, detection effort, and failure loudness. It would also change reporting behaviour, costing the organisation the visibility it currently has.

### "DORA metrics show which teams are performing."

DORA's own guidance states the metrics apply at application or service level, warns that comparing them between very different applications can be misleading, and warns that isolating teams with specific metrics produces friction and finger-pointing. Cross-team ranking is a use its publishers argue against.

### "That's just Goodhart's Law."

Sometimes. The Atlas segment-mix case involves no target and no gaming; the mix shifted because of campaign work. Attributing it to Goodhart misdiagnoses a population problem as an incentive problem and points at the wrong fix. The repository's Goodhart treatment is in Part I Chapter 7; Part XI Chapter 9 uses Strathern's formulation.

### "Deployment frequency is objective."

The count is objective. Its use as a proxy for productivity is a validity claim, and the claim is unsupported. Objectivity of measurement and validity for a purpose are separate properties.

## QA → QE → Engineering-Leadership Transition

Take the checklist evaluation.

**QA contribution.** Reports the metrics accurately: 16 escaped defects across 300 changes in Q1; 20 across 450 in Q2; the rate fell from 5.33% to 4.44%. Every figure correct and checkable.

**QE contribution.** Evaluates construct validity and population. Establishes that "escaped defects per change" measures post-release defects that were found and attributed — part of practice quality, omitting everything about what was not found. Disaggregates and finds both segments worsened while the aggregate improved, because the payment-path share fell from 33.3% to 11.1%. States the confounder — campaign diversion — and what the analysis cannot establish, including that the checklist made things worse.

**Engineering-leadership contribution.** Names the step at which the chain broke, so that the finding is transferable rather than a one-off correction: the measurement is sound and the failure is at inference. Establishes that the decision — whether to extend the checklist to fulfilment — belongs to the delivery owner, and supplies what that decision needs: segmented figures, the mix explanation, and an explicit statement that the evidence does not validate the checklist either way. Then records the segment sensitivity in the measurement plan so the next person to report this number reports the segments with it.

## Summary

A measure has validity for a claimed attribute, not in itself, and the test is completing *this measures ___, which is part of ___, and omits ___*. Most measurement failures are a measure silently changing role along the chain from measurement to decision, and naming the step is the core skill. The segment-mix example demonstrates correct arithmetic supporting an invalid inference: both Atlas segments worsened while the aggregate improved, because the payment-path share fell from 33.3% to 11.1% — and no gaming or target was involved. Individual productivity measurement fails on construct validity before it fails on ethics, and attaching consequences degrades the reporting behaviour the organisation depends on. DORA's five current metrics are recorded with their source date because the model has changed; SPACE's framing exists to resist collapsing dimensions into one number. Goodhart belongs to Part I Chapter 7 and Strathern's formulation to Part XI Chapter 9; not every measurement pathology is Goodhart.

## Key Takeaways

- **Construct validity comes first.** A measure is valid *for an attribute*, and the same number can be valid for one purpose and invalid for another.
- Most failures are a **role change on the chain**, not a wrong number — and they survive arithmetic review intact.
- The segment-mix case is correct at every calculation and wrong at **inference**; both segments worsened while the aggregate improved.
- **Segment-mix effects require no gaming and no target** — the Atlas mix shifted because of campaign work.
- Individual productivity measures fail on construct validity first; attaching consequences then degrades the reporting behaviour you relied on.
- **DORA currently has five metrics** — change lead time, deployment frequency, failed deployment recovery time, change fail rate, deployment rework rate — and any list must carry its **source date**.
- DORA's publishers warn against mandates, cross-application comparison, isolating teams by metric, and competition between teams. Part XII does not weaken those warnings.
- **A composite SPACE score is not an application of SPACE**; it is what the multidimensional framing exists to prevent.
- Goodhart is Part I Chapter 7; Strathern's formulation is Part XI Chapter 9. **Not every measurement pathology is Goodhart.**
- Ask what would move the number without the underlying thing changing — before offering it.

## Review Questions

1. Complete the construct-validity sentence for "review comments per pull request", and state one claim it can support and one it cannot.
2. Trace deployment frequency through all seven chain steps and identify the step at which a productivity claim becomes possible.
3. In the segment-mix example, both segments worsened and the aggregate improved. Explain the mechanism, and state why checking the arithmetic would not reveal the problem.
4. Why does the segment-mix case **not** illustrate Goodhart's law? What would have to be different for it to?
5. State the construct-validity objection to defects-per-engineer, then the separate behavioural objection. Which holds even with perfect data?
6. List the five current DORA metrics and explain why the source date must accompany them.
7. A colleague proposes a single "engineering health score" combining several SPACE-style dimensions. State the objection in terms of what the framing is for.
8. Give two ways the Atlas escaped-defect rate could move without engineering practice changing at all.

## Interview Questions

1. How would you assess whether a proposed metric measures what someone thinks it measures?
2. A stakeholder asks for a per-engineer quality metric. How do you respond?
3. Describe a time a metric improved while the underlying situation did not. How did you establish that?
4. How do you decide the level at which a measure should be reported?

## Practical Exercise

Diagnose the measurement misuse in the following synthetic Atlas Commerce proposal, then produce a **Practice Measurement Plan** for a replacement.

*Following the checklist evaluation, a proposal is circulated to track engineering quality using three figures reported monthly per team and per engineer: escaped defects, automation percentage, and deployment frequency. The proposal states that the three will be combined into a single "quality health" figure so that trends are easy to follow, and that teams below the organisational average will be offered support. Atlas has one engineering team of four. Payment-path changes produce escaped defects at roughly five to six times the rate of routine catalogue changes, and the share of payment-path work varies substantially between quarters with campaign load.*

Your diagnosis must:

- identify **every** distinct measurement defect in the proposal, and classify each as a construct-validity problem, a level problem, a composite-scoring problem, a comparison problem, or a target problem — several will be more than one;
- for at least two of the three figures, complete the construct-validity sentence;
- trace one of the three figures along the chain and name the step at which the proposal's inference becomes invalid;
- state what would happen to each of the three numbers if the proposal were adopted with consequences attached, and what the organisation would lose; and
- explain why the "below the organisational average" comparison is unsound at Atlas specifically, using a fact about Atlas.

Then produce a full **Practice Measurement Plan** for **one** measure you would actually propose, addressing the delivery owner's real question — whether the review checklist should be extended to fulfilment work. Complete every field, including segment sensitivity and a stop condition.

Finally, answer in two or three sentences: state what you would tell the delivery owner if the honest answer is that no available measure can settle the question in the time available, and say who owns the decision that follows.

Your submission must contain **no composite score and no per-individual measure**. Use only synthetic data.

## Further Reading

- [C. Kaner and W. P. Bond — Software Engineering Metrics: What Do They Measure and How Do We Know?](https://kaner.com/pdfs/metrics2004.pdf) — construct validity in software measurement.
- [DORA — Software delivery performance metrics](https://dora.dev/guides/dora-metrics/) — the current metric definitions and the publishers' own misuse warnings.
- [Part I Chapter 7 — Engineering Culture and DevOps Mindset](../../part-01-foundations/chapters/chapter-07-engineering-culture-and-devops-mindset.md) — the repository's Goodhart treatment and its qualification.

## References

[^kaner-bond]: Kaner, C., and Bond, W. P. [Software Engineering Metrics: What Do They Measure and How Do We Know?](https://kaner.com/pdfs/metrics2004.pdf) In *10th International Software Metrics Symposium (METRICS 2004)*. 2004. **Verification:** primary full text inspected; the construct-validity framing, the direct-measurement argument, and the bug-count analysis cited here were read from the paper. Accessed 2026-08-14.
[^dora-metrics]: DORA. [DORA's software delivery performance metrics](https://dora.dev/guides/dora-metrics/). Five-metric model and definitions as published at the accessed date, grouped as three throughput and two instability measures. Terminology has changed over time; cite with the access date. **Verification:** official DORA guidance page read directly. Accessed 2026-08-15.
[^space]: Forsgren, N., Storey, M.-A., Maddila, C., Zimmermann, T., Houck, B., and Butler, J. [The SPACE of Developer Productivity](https://doi.org/10.1145/3454122.3454124). *ACM Queue*, 19(1), pp. 20–48. 2021. **Verification:** bibliographic metadata verified against Crossref, including all six authors. **Full text not accessed** — publisher access returned HTTP 403. This chapter uses the source only for the proposition that developer productivity is multidimensional and should not be collapsed into a single measure, and attributes no dimension definitions, measurement guidance, or empirical findings to it.

Goodhart is cited as established in **Part I Chapter 7** and is not restated here; Strathern's formulation is used as established in **Part XI Chapter 9**. The measurement-to-decision chain, the construct-validity sentence form, the segment-sensitivity control, and the Practice Measurement Plan are **original MSQE teaching material**, not industry standards. Atlas Commerce is a synthetic teaching baseline and all figures are illustrative.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Complete the construct-validity sentence for a proposed measure and act on the *omits* clause.
- [ ] Trace a measure through all seven chain steps and name where it changes role.
- [ ] Explain a case where correct arithmetic supports an invalid inference, and locate the failing step.
- [ ] Explain why segment-mix effects require no gaming and no target.
- [ ] State the construct-validity objection to individual productivity measures, separately from the behavioural one.
- [ ] Name the five current DORA metrics with a source date, and say why the date is required.
- [ ] Explain why a composite score defeats a multidimensional framing.
- [ ] Keep the Goodhart, Strathern, and Part XI lineages distinct.
- [ ] Complete a Practice Measurement Plan including valid level, segment sensitivity, and a stop condition.

## Chapter Navigation

Previous: [Chapter 8 — Mentoring and Growing Quality Reasoning in Others](chapter-08-mentoring-and-growing-quality-reasoning-in-others.md) · Next: [Chapter 10 — Changing Practice: Adoption, Evidence, and Reversibility](chapter-10-changing-practice-adoption-evidence-and-reversibility.md)
