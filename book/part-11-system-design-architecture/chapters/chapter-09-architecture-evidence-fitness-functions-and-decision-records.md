# Chapter 9 — Architecture Evidence, Fitness Functions, and Decision Records

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 9 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–8 |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** The question is never "is this evidence good?" It is "is this evidence about the claim?" Rigorous evidence for a claim nobody made is the most persuasive kind of nothing.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

The proposal to extract checkout into its own service comes back, and this time it has evidence. Two pieces.

The first is a container diagram. It shows checkout as a separate box with a labelled interface to order management, a labelled interface to the payment adapter, and its own deployment boundary. It is accurate, current, and clearly drawn. Someone spent real effort on it.

The second is a benchmark. Two hundred requests through the current in-process checkout path, and two hundred through a prototype of the extracted arrangement, both with the payment dependency stubbed. Mean response time falls from 250 ms to 190 ms. The proposal describes this as "a 24% latency improvement, measured."

The claims the proposal makes are: **checkout can be deployed independently**, and **failures in checkout will no longer propagate to order management**.

The benchmark is competently run. The arithmetic in the next section shows the difference is not noise — it is roughly six and a half standard errors, which is about as clear as a small experiment gets. The diagram is not wrong about anything it depicts.

And between them they provide no evidence for either claim. The diagram asserts the deployment boundary rather than demonstrating it. The benchmark measures latency, which appears in neither claim, under conditions — warm, single-instance, no concurrency, no dependency degradation — that exclude every situation in which Atlas has actually had an incident. Worse, the prototype it measured was two code arrangements inside one process, so it did not include the network hop the extraction would add. The measured improvement may reverse entirely once the boundary is real.

Nobody in this story is careless. The evidence is competent, and it is about the wrong things.

## Why This Chapter Matters

Chapters 1 through 8 have repeatedly ended with "the evidence needed is …". This chapter is about the judgement that phrase requires: what counts as evidence for an architecture decision, how much is proportionate, what any particular kind can and cannot establish, and how to record a decision so that it can be challenged later.

Three failures recur, and this chapter is organised around them.

**Evidence about the wrong claim.** The opening story. Rigour is irrelevant if the thing measured is not the thing asserted, and this failure is dangerous precisely because the evidence is good.

**Evidence treated as proof.** A passing check, a completed diagram, a signed-off review, or an Architecture Decision Record are all records of something having happened. None establishes that the decision is sound. Chapter 1 made this argument for diagrams; this chapter extends it to every artefact including the ADR itself.

**Evidence disproportionate to the decision.** Weeks of prototyping for a decision reversible in an afternoon; a diagram for a decision that commits the company for five years. Proportionality is the practical skill, and it is governed by one question: how expensive is it to be wrong here?

The chapter does not mandate an ADR template, prescribe an architecture-review ceremony, recommend a documentation platform, or teach automation implementation. Repeatable checks are introduced narrowly; building them is Part V's work.

## Learning Objectives

By the end of this chapter, you should be able to:

- test whether a piece of evidence is *about* the claim being made, before assessing its quality;
- describe what each common evidence type establishes, what it cannot, and roughly what it costs;
- choose an evidence level proportionate to the reversibility and consequence of a decision;
- classify evidence items as fact, interpretation, limitation, or evidence gap;
- state invalidation conditions — what would have to be observed for an option to be rejected;
- write and critique an Architecture Decision Record without treating it as proof;
- scope architecture fitness functions narrowly and explain three specific ways they mislead; and
- produce an Architecture Evidence Plan and ADR for a synthetic Atlas Commerce decision.

## Is This Evidence About the Claim?

This test comes first because it is cheap and it disqualifies most of what is presented in architecture discussions.

Take the claim. Take the evidence. Ask: *if the evidence had come out the other way, would the claim be in doubt?*

| Claim | Offered evidence | Would contrary evidence cast doubt? |
| --- | --- | --- |
| Checkout can be deployed independently | Container diagram showing a deployment boundary | **No.** A differently drawn diagram would change the picture, not the fact. |
| Checkout can be deployed independently | Benchmark showing lower latency | **No.** Latency has no bearing on deployability. |
| Checkout can be deployed independently | A record of checkout shipping while order management did not, with no coordinated release | **Yes.** |
| Failures in checkout will not propagate | Container diagram with separate boxes | **No.** Boxes are not containment. |
| Failures in checkout will not propagate | An experiment in which checkout is made to fail and order-management behaviour is observed | **Yes.** |

The third and fifth rows are what evidence for these claims actually looks like, and neither is what was offered. Notice that both are cheap — one is an observation of a deployment, the other a bounded failure experiment of the kind Chapter 7 described. The proposal did not lack the capacity to gather relevant evidence; it gathered available evidence instead of relevant evidence.

Two specific traps make this happen.

**The proxy slide.** Latency is measurable and deployability is not, so the measurable thing is offered and the audience accepts it because it looks like rigour. The correct response is not to reject the benchmark but to say what it is evidence *of* — a latency claim nobody has made — and to note that it therefore leaves both stated claims unevidenced.

**The existence proof.** "We have a diagram," "we have an ADR," "we held a review." Each records that an activity occurred. Chapter 1's architecture-versus-description distinction is the general form: the artefact expresses a decision; it does not establish that the decision is good.

## Evidence Types: What Each Establishes and Cannot

| Evidence type | Establishes | Cannot establish | Relative cost |
| --- | --- | --- | --- |
| **Static structure / dependency map** | Actual dependency direction, cycles, forbidden imports | Runtime coupling, temporal coupling, whether boundaries mean anything operationally | Very low |
| **Consumer inventory** | Who reads an interface or store, and which fields | Why they read it; consumers outside the searched scope | Low |
| **Change / co-change record** | Historical coordination cost between modules | Whether a boundary change reduces it (Chapter 5) | Low |
| **Contract check** | Structural compatibility between versions | Semantic, behavioural, temporal, operational compatibility (Chapter 8) | Low |
| **Prototype** | Feasibility; unknown-unknowns surfaced early | Operability, cost at scale, behaviour under degradation | Medium |
| **Benchmark** | Relative performance of what was measured, under measured conditions | Behaviour under different workload, concurrency, dependency state, or tail; anything not about performance | Medium |
| **Failure experiment** | System behaviour under a specific injected fault | Faults outside the seam's reach (Chapter 7); real dependency behaviour | Medium–high |
| **Deployment observation** | Whether independent release actually happens | Whether it will remain possible after contract change | Low, if you wait |
| **Operational / telemetry evidence** | How the system already behaves in production | How a proposed different system would behave | Low to obtain, high to instrument |
| **Architecture review** | Expert-identified risks, sensitivity points, trade-off points | That risks not raised do not exist | Medium |

Two properties of this table matter more than its contents.

**The cheapest rows are frequently the most decision-relevant.** Dependency maps, consumer inventories, and change records are hours of work and have repeatedly been the missing prerequisite in Chapters 2, 5, and 8. Expensive evidence is more persuasive and not more relevant.

**Every row's "cannot establish" column includes the conditions under which Atlas has actually failed.** Degradation, unknown outcomes, silent consumer failure. Selecting evidence with complementary blind spots is the practical response — a benchmark plus a failure experiment covers more than two benchmarks.

## Proportionality: How Expensive Is It to Be Wrong?

Evidence effort should scale with the cost of being wrong, which is dominated by reversibility.

| Decision | Reversibility | Proportionate evidence |
| --- | --- | --- |
| Cache TTL behind a stable interface | Minutes | Change it and observe; a measurement afterwards |
| Retry policy on an internal call | Hours | A bounded failure experiment |
| Module boundary within one artefact | Days | Dependency map; co-change read |
| Deployment boundary | Weeks | Prototype; deployment observation; operational-capacity assessment |
| Event contract with external consumers | Months to years — consumers must migrate | Consumer inventory; per-layer compatibility analysis; deprecation-window arithmetic |
| Data-store split | Years; partially irreversible once data diverges | All of the above, plus migration and reconciliation evidence (Chapters 4 and 10) |

The useful question in a design discussion is therefore not "what evidence do we have?" but "**how expensive is it to be wrong here, and does our evidence match that?**" A team can be simultaneously over-evidencing a reversible decision and under-evidencing an irreversible one — and this is common, because reversible decisions tend to be technically interesting and irreversible ones tend to be about data and contracts.

## Numerical Reasoning: The Benchmark

The following is a **bounded, synthetic worked example** demonstrating correct arithmetic that does not constitute architecture evidence.

| Field | Entry |
| --- | --- |
| Context | The checkout-extraction proposal offers a benchmark as evidence for independent deployment and reduced failure coupling. |
| Population and boundary | 200 requests per arm through a local prototype; single instance; warm caches; no concurrent load; **the payment dependency stubbed**; server-side timing only. Note that Chapter 3 measured the real server-side checkout path at roughly 295 ms with a healthy provider, of which the payment call was 180 ms — so this benchmark is not measuring that path. |
| Assumptions | Standard deviation of 90 ms in each arm; observations independent; the two arms differ only in the code arrangement under test. |
| Units | Milliseconds; standard errors. |
| Calculation | Standard error of each mean = 90 ÷ √200 = **6.364 ms**. Standard error of the difference = 90 × √(2 ÷ 200) = **9.0 ms**. Observed difference = 250 − 190 = 60 ms = 60 ÷ 9.0 = **6.67 standard errors**. |
| Interpretation | The difference is not measurement noise. Under the stated conditions the arrangement measured is genuinely faster, and it would be wrong to dismiss the benchmark as underpowered. |
| Limitation | **The arithmetic is correct and the evidence is not about the claim.** Four separate reasons, in increasing order of severity. (1) It reports means; Chapter 3 established that the tail and the unknown-outcome case determine the customer experience. (2) The conditions — warm, single-instance, unconcurrent, and with the payment dependency stubbed — exclude every situation in which Atlas has had an incident, and stub out the one component that Chapter 6 showed dominates both the latency and the availability of the real path. (3) The prototype compared two code arrangements **inside one process**, so it does not include the network hop the real extraction would add; the measured improvement could reverse once the boundary exists. (4) Decisively: **latency appears in neither claim.** Independent deployment and failure containment are not performance properties, and no latency result, however rigorous, bears on them. |
| Decision relevance | Supports a narrow claim about the relative speed of two in-process code arrangements under benign conditions. Supports **neither** stated claim. The two claims remain entirely unevidenced. |

Reason (4) is the one to internalise. Reasons (1) to (3) are fixable with a better experiment. Reason (4) is not fixable by improving the benchmark at all, because the instrument is pointed elsewhere. Asking "what would a better version of this evidence establish?" exposes it: a perfect latency benchmark would still say nothing about deployability.

## The Architecture Evidence Plan

An **Architecture Evidence Plan** is written *before* evidence is gathered. Its purpose is to prevent the opening story: it fixes what would count as relevant before anyone becomes attached to a result.

| Field | Content |
| --- | --- |
| Claim | One claim per plan, stated as in Chapter 1 — bounded, falsifiable. |
| Decision it informs | What action the evidence would change. If none, do not gather it. |
| Reversibility and consequence | How expensive it is to be wrong, setting the proportionate level. |
| Evidence items | For each: type, what it would establish, its blind spot, and its cost. |
| Classification | Each existing item as fact, interpretation, limitation, or evidence gap. |
| **Invalidation condition** | What observation would cause this option to be rejected. |
| Sufficiency judgement | Whether the planned set is proportionate, and who agrees. |
| Owner | Who decides once the evidence exists. |
| Residual uncertainty | What remains after all planned evidence is gathered. |

The four classifications are worth stating precisely, because items get promoted between them silently:

- **Fact** — directly observed, independently checkable, scope stated. *"Checkout and order management shipped in the same release on all 14 releases in the last quarter."*
- **Interpretation** — a conclusion drawn from facts, which someone could reasonably dispute. *"Therefore checkout is not independently deployable today."*
- **Limitation** — something the evidence cannot establish regardless of how much is gathered. *"A synthetic environment cannot establish the provider's behaviour under real degradation."*
- **Evidence gap** — something not yet known that *could* be. *"Nobody has measured whether order management stays serving when checkout is killed."*

The distinction between limitation and gap governs the response: gaps get a plan, limitations get recorded as residual risk. Conflating them either produces work that cannot succeed or quietly accepts a risk as though it had been closed.

**Invalidation conditions** are the field most often omitted and the one that most improves a plan. Writing "we would reject the extraction if order management cannot continue serving while checkout is unavailable" is a commitment made before the result, and it is what prevents an unfavourable outcome from being reinterpreted afterwards.

### Applied to the checkout extraction

| Item | Classification | Note |
| --- | --- | --- |
| The container diagram shows a deployment boundary | **Fact** about the diagram | Not a fact about the system; it asserts the boundary |
| The benchmark difference is 6.67 SE | **Fact**, narrowly scoped | About in-process code arrangements under benign conditions |
| "Extraction improves latency by 24%" | **Interpretation**, and unsupported | Omits the network hop the extraction adds, and the stubbed dependency that dominates the real path |
| Checkout and order management shipped together in 14 of 14 recent releases | **Fact** | Cheap; not yet gathered |
| No experiment has killed checkout and observed order management | **Evidence gap** | Directly addresses claim two; cheap |
| A synthetic environment cannot establish real provider degradation | **Limitation** | Residual risk, not backlog (Chapter 7) |
| Operational cost of a second deployed unit for four engineers | **Evidence gap**, partly a limitation | Estimable; not fully knowable before operating it |
| **Invalidation condition** | — | Reject if order management cannot continue serving while checkout is unavailable, or if the added network hop pushes p95 checkout latency past the agreed expectation under degraded payment |

The plan costs an afternoon, and it makes visible that the two cheapest available items — a release-history read and one failure experiment — address both claims, while the two expensive items already gathered address neither.

## Architecture Decision Records

An **Architecture Decision Record (ADR)** is a short document capturing a decision, its context, the alternatives considered, the rationale, the trade-offs and consequences, the evidence, its limitations, and the conditions under which it should be revisited.

ISO/IEC/IEEE 42010:2022 treats architecture decisions and their rationale as part of what an architecture description expresses.[^iso-42010] That framing carries Chapter 1's warning with it: **an ADR is part of the description, not of the architecture, and not evidence that the decision is good.** An ADR records that a decision was made, by whom, on what basis. A thorough ADR for a bad decision is a well-documented bad decision.

What an ADR is genuinely for is *future challengeability*. Its value is realised eighteen months later, when someone asks why the system is like this. Without the record, the answer is archaeology and the decision is either cargo-culted or reversed without understanding what it was protecting. With it, the assumptions are inspectable and the revision conditions can be checked against current reality.

| ADR field | Purpose | Common failure |
| --- | --- | --- |
| Context | The situation forcing a decision now | Written as background rather than as the forcing condition |
| Alternatives considered | Options genuinely evaluated | Straw alternatives that make the chosen one inevitable |
| Decision | What was chosen, and its scope | Scope omitted, so the decision is later applied where it was never intended |
| Rationale | Why, given the context and constraints | Restates the decision instead of justifying it |
| Trade-offs | What got worse | Omitted entirely — the most common defect |
| Consequences | Expected and adverse effects, including on other teams | Only positive consequences listed |
| Evidence | What supports it, with scope and classification | Evidence about a different claim (the opening story) |
| Limitations | What the evidence cannot establish | Omitted, so the decision reads as better supported than it is |
| Residual risk | What remains after deciding | Stated as "none," which is never true |
| Revision condition | What would require revisiting | Omitted, so the decision is revisited only after an incident |
| Owner | The accountable role | A team name, or absent |

**Critiquing an ADR** is a distinct skill and a realistic Quality Engineering contribution. Four questions do most of the work: Are the alternatives real, or built to lose? Is the evidence about the claim? Is there a trade-off section, and does it name something that actually got worse? Would the stated revision condition ever fire — is it an observable event, or an aspiration like "if requirements change"?

## Fitness Functions, Narrowly

An **architecture fitness function** is a repeatable check that a stated architectural property holds. The term is drawn from evolutionary-architecture practitioner literature, which proposes them as a mechanism for protecting architectural characteristics as a system changes.[^ford-evolutionary]

Part XI scopes them narrowly. Useful candidates are properties that are objective, cheap to evaluate, and meaningful when violated:

| Candidate | What it checks | What a pass means |
| --- | --- | --- |
| Forbidden dependency direction | Module A does not import module B's internals | That import does not exist today |
| Cycle absence | No dependency cycles across named boundaries | No cycles among the boundaries you named |
| Contract compatibility | New schema version is structurally compatible with the previous one | Structural layer only (Chapter 8) |
| Latency budget | A measured path stays within a stated bound under stated conditions | The path was within bound under those conditions |
| Deployment coupling | Two units do not require coordinated release | No coordination was required for the releases observed |

The right-hand column is the point. Each pass licenses a narrow statement, and the gap between that statement and "the architecture is fit" is the entire subject of this chapter.

Three specific ways fitness functions mislead:

**Not every quality concern can be automated.** Whether a boundary reflects a genuine responsibility, whether a trade-off favours the right side, whether a state model represents the business truthfully — none of these is machine-checkable, and they are where the consequential errors live. A suite of green checks over an architecture with the wrong boundaries is green.

**The measure becomes the target.** Once a check is enforced, behaviour adapts to satisfy the check rather than the property it stood for. Strathern's formulation of this effect — that a measure ceases to be a good measure once it becomes a target — is the general case.[^strathern] The concrete version: a forbidden-import check produces an interface package that everything imports, technically satisfying the rule while the coupling is unchanged and now harder to see.

**Passing is not fitness.** A fitness function checks the property you thought to encode, in the way you thought to encode it, at the moment it runs. It cannot see the property you did not think of, and — as Chapter 7 showed for fault-simulation coverage — a percentage over a self-selected enumeration measures agreement with your own list.

Fitness functions remain worth having, especially the cheap static ones Chapter 2 identified. They belong in a plan as one evidence item with a stated scope, alongside review and experiment, not as a substitute for them. Implementing them as automated feedback — where they run, how they fail a build, how flakiness is handled — is Part V's work.

## Engineering Perspective

**Write the invalidation condition before gathering evidence.** It is the cheapest available protection against motivated reasoning, and it converts a discussion about whether a result is good into one about whether the pre-agreed condition fired.

**Prefer two cheap evidence items with different blind spots to one expensive one.** A release-history read plus a failure experiment cost less than the benchmark already run and address both stated claims. Chapter 7's seam discussion is the same principle: coverage comes from complementary positions, not from depth in one.

**Say "this is evidence of X, and X is not the claim" out loud.** It is a more useful contribution than challenging the evidence's quality, and it is harder to argue with, because it concedes the rigour while relocating it.

**Record limitations as residual risk with an owner.** A limitation filed as backlog implies it will be closed. Modes that cannot be simulated (Chapter 7) and provider behaviour under real degradation (Chapter 3) will not be resolved by effort, and pretending otherwise removes them from the decision.

## Industry Perspective

The Architecture Tradeoff Analysis Method treats an architecture evaluation as producing risks, sensitivity points, and trade-off points rather than a verdict.[^sei-atam] That output shape is itself an evidence discipline: an evaluation that concludes "the architecture is sound" has produced an unfalsifiable statement, while one that produces "this decision is a trade-off point between three characteristics and its assumption is unverified" has produced something a team can act on and later check.

Evolutionary-architecture practitioner literature makes the complementary argument that architectural characteristics erode silently unless something checks them repeatedly.[^ford-evolutionary] Both are worth holding together, and neither is a standard: the first is a facilitated method with substantial overhead, the second a practitioner framework whose central mechanism has the three limitations described above. Part XI cites them for the specific claims attached and does not adopt either as a required process.

## Common Misconceptions and Pitfalls

### "We have an ADR, so the decision was made properly."

The ADR records that a decision was made and on what basis. Its value is that a future engineer can challenge it. It is part of the architecture description.

### "The benchmark was rigorous."

Rigour is the second question. The first is whether the measured quantity appears in the claim. A perfect measurement of an irrelevant quantity is not weak evidence; it is not evidence.

### "The fitness functions are green."

They check the properties someone encoded, as encoded, when they ran. Ask what a violation would have looked like and whether anything would have caught the last real architectural regression.

### "We need more evidence before deciding."

Sometimes. Often the honest position is that the remaining uncertainty is a limitation rather than a gap, and the decision must be made under it with the residual risk recorded and owned. "More evidence" can be a way of not deciding.

### "The review approved it."

A review surfaces risks the reviewers thought of. It cannot establish the absence of risks nobody raised, and the reviewers' blind spots correlate with the designers' when they share context.

### "Evidence gaps and limitations are both just unknowns."

Gaps can be closed and get a plan; limitations cannot and get recorded as residual risk. Treating a limitation as a gap generates work that cannot succeed; treating a gap as a limitation accepts a risk that was cheap to remove.

## QA → QE Transition

The transition in this chapter is from treating a test result or a design document as approval evidence to judging whether a body of evidence is relevant, sufficient, limited, and owned for the decision at hand.

A QA Engineer reviewing the extraction proposal would examine the benchmark: sample size, warm-up, environment, whether the arms are comparable. Every one of those questions is correct, and answering them all favourably still leaves both claims unevidenced. A Quality Engineer asks the prior question — whether latency bears on deployability or failure containment at all — finds that it does not, and then identifies the two cheap items that do: a release-history read and one bounded failure experiment. Then they write the invalidation condition down before either is run, classify what already exists as fact, interpretation, limitation, or gap, and name who decides.

The first review improves an experiment. The second changes what is being evidenced, and does so before anyone is invested in a result.

## Summary

The first test of architecture evidence is not quality but relevance: would contrary evidence cast doubt on the claim? Competent evidence about a different claim is the most persuasive form of nothing, and it cannot be repaired by improving the experiment. Evidence types each establish something narrow and are blind to something specific, and the cheapest types — dependency maps, consumer inventories, change records, release history — have repeatedly been the missing prerequisite. Evidence effort should scale with how expensive it is to be wrong, which is dominated by reversibility. Classifying items as fact, interpretation, limitation, or evidence gap keeps conclusions separable from observations, and distinguishes what can be closed from what must be carried as residual risk. An ADR is part of the architecture description: it records a decision and makes it challengeable later, and it is not proof. Fitness functions check encoded properties as encoded, are subject to the measure becoming the target, and cannot see what nobody thought to encode.

## Key Takeaways

- Ask whether contrary evidence would cast doubt on the claim; if not, the evidence is not about the claim.
- A perfect measurement of an irrelevant quantity is not weak evidence — improving it changes nothing.
- Every evidence type is blind to something; combine types with complementary blind spots.
- Scale evidence to reversibility: over-evidencing reversible decisions while under-evidencing irreversible ones is common.
- Fact, interpretation, limitation, and evidence gap are four different things; gaps get plans, limitations get residual-risk entries.
- Write the invalidation condition before gathering evidence.
- An ADR is part of the architecture description; its value is future challengeability, not proof.
- A missing trade-off section is the most common ADR defect; a revision condition that could never fire is the second.
- Fitness functions license narrow statements; the measure becoming the target is a predictable failure, not a misuse.

## Review Questions

1. The benchmark is statistically sound. Give the reason it fails that a better benchmark could not fix.
2. State the difference between an evidence gap and a limitation, and the different response each requires.
3. Why is "we have a diagram showing separate deployment units" not evidence of independent deployability, and what would be?
4. What does a passing forbidden-dependency check license you to say, precisely?
5. Give an Atlas example of a fitness function being satisfied while the property it stood for is unchanged.
6. Why is a revision condition such as "if requirements change" useless, and what would replace it?

## Interview Questions

1. A team presents a benchmark supporting an architecture change. What is your first question?
2. How do you decide how much evidence a design decision deserves?
3. How would you critique an ADR you disagreed with, without claiming to own the decision?
4. When is it right to decide under unresolved uncertainty, and what would you record?

## Practical Exercise

Produce an **Architecture Evidence Plan and ADR** for the following synthetic Atlas Commerce decision.

*Atlas proposes moving the order-status page to read from a dedicated read model, populated asynchronously from order events, instead of querying the order store directly. The stated claims are: (a) the status page stops contributing read load to the order store during promotions, and (b) the page can be changed without coordinating with the order-management team. The evidence offered is a load test showing the read model serves 8,000 requests per second on a single instance, and a diagram showing the new component.*

Your submission must contain **two parts**.

**Part 1 — Evidence Plan.**

- For each of the two claims, apply the relevance test and state whether each offered item is evidence for it, with reasoning.
- Identify **at least two cheap evidence items** that would bear directly on the claims, and state what each would establish and its blind spot.
- Classify every item — offered and proposed — as fact, interpretation, limitation, or evidence gap.
- State the reversibility of this decision and whether the proposed evidence level is proportionate.
- Write an **invalidation condition** for each claim: what observation would cause rejection.
- Name at least one **limitation** that will not be closed by any evidence, and record it as residual risk with an owner.

**Part 2 — ADR.**

- Write an ADR containing every field from the chapter's table.
- The **trade-offs** section must name at least two things that get worse, including at least one drawn from Chapters 3, 4, or 8.
- The **revision condition** must be an observable event, not an aspiration.
- The **residual risk** section must not say "none."

Then critique your own ADR in no more than 150 words using the four critique questions, and state which one it comes closest to failing. Do not implement anything. Use synthetic data only.

## Further Reading

- [R. Kazman, M. Klein, and P. Clements — ATAM: Method for Architecture Evaluation](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/) — SEI technical report.
- N. Ford, R. Parsons, and P. Kua — *Building Evolutionary Architectures: Support Constant Change*. O'Reilly Media, 2017 — practitioner literature, not a standard.
- [ISO/IEC/IEEE 42010:2022 — Architecture description](https://www.iso.org/standard/74393.html)

## References

[^iso-42010]: International Organization for Standardization, International Electrotechnical Commission, and Institute of Electrical and Electronics Engineers. [ISO/IEC/IEEE 42010:2022 — Software, systems and enterprise — Architecture description](https://www.iso.org/standard/74393.html). 2022. Accessed 2026-08-14.
[^sei-atam]: Kazman, R., Klein, M., and Clements, P. [ATAM: Method for Architecture Evaluation](https://www.sei.cmu.edu/library/atam-method-for-architecture-evaluation/). CMU/SEI-2000-TR-004, Software Engineering Institute, Carnegie Mellon University, 2000. Accessed 2026-08-14.
[^ford-evolutionary]: Ford, N., Parsons, R., and Kua, P. *Building Evolutionary Architectures: Support Constant Change*. O'Reilly Media, 2017. ISBN 978-1-4919-8636-3. Practitioner literature, not a standard. Accessed 2026-08-14.
[^strathern]: Strathern, M. ['Improving ratings': audit in the British University system](https://doi.org/10.1002/%28SICI%291234-981X%28199707%295%3A3%3C305%3A%3AAID-EURO184%3E3.0.CO%3B2-4). *European Review*, 5(3), pp. 305–321. July 1997. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Apply the relevance test before assessing evidence quality.
- [ ] State what each common evidence type cannot establish.
- [ ] Choose an evidence level proportionate to a decision's reversibility.
- [ ] Classify items as fact, interpretation, limitation, or evidence gap, and respond to each correctly.
- [ ] Write an invalidation condition before gathering evidence.
- [ ] Critique an ADR on alternatives, evidence relevance, trade-offs, and revision condition.
- [ ] State precisely what a passing fitness function licenses you to claim.

## Chapter Navigation

Previous: [Chapter 8 — Contracts, Compatibility, and Change Impact](chapter-08-contracts-compatibility-and-change-impact.md) · Next: [Chapter 10 — Evolution, Migration, Reversibility, and Architecture Debt](chapter-10-evolution-migration-reversibility-and-architecture-debt.md)
