# Chapter 10 — Evolution, Migration, Reversibility, and Architecture Debt

## Metadata

| Field | Value |
| --- | --- |
| Part | Part XI — System Design & Architecture |
| MQE-BOK domain | Domain 11 — System Design & Architecture |
| Chapter | 10 |
| Audience | Experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–9; Parts IV, VI, and VII recommended |
| Estimated study time | 180 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A migration plan describes two architectures people want and several they will actually run. The ones nobody planned are where the system lives longest and fails worst.

## Opening Story

The following is an **illustrative scenario** using the synthetic Atlas Commerce platform.

Atlas decides to separate fulfilment from checkout. The plan is sensible: introduce a fulfilment service, dual-write fulfilment jobs to both the old table and the new service for a period, migrate consumers one at a time, then decommission the old path. Three stages, six weeks, with a rollback at each stage.

Stage one goes well. Stage two goes well. Stage three is deferred because the promotion is approaching and nobody wants to touch fulfilment during it.

Fourteen months later, Atlas is still dual-writing.

The old table is still populated because the finance reconciliation job reads it, and nobody has ever fully enumerated what the finance job needs. The new service is authoritative for everything else. The dual-write is performed by a shim that was written in an afternoon and has no owner; the engineer who wrote it has moved teams. The shim has developed a quiet bug: when the new service returns a duplicate-job error, the shim swallows it, so the two stores have drifted by an unknown number of rows. Nobody knows the number because nobody built a comparison — the plan assumed the dual-write period would last six weeks and that a comparison would not be worth building.

Rolling back is now discussed occasionally and never seriously. Technically the old path still works. Practically, fourteen months of orders exist only in the new service's representation; support has retrained on the new console; the partner integration was pointed at the new service in stage two; and the person who understood the old path's edge cases has left.

The migration is not failing. It succeeded at everything it planned. What it did not plan was the architecture Atlas has actually been running for fourteen months — one with two stores, an unowned shim, unknown drift, and a rollback that exists only on paper.

## Why This Chapter Matters

Every previous chapter ended by identifying a change worth considering. This chapter is about the fact that a change is not an event.

Between the current architecture and the intended one lies a sequence of **intermediate architectures**. Each is a real system that must serve real customers, and each has its own boundaries, failure modes, consistency properties, and evidence needs. Teams plan endpoints carefully and intermediates casually, which is backwards: the endpoints are designed and reviewed, while the intermediate is the one that will be running when something goes wrong — and, as the opening story shows, is frequently the one that runs longest.

The second theme is that **reversibility is not one property**. "We can roll back" is usually a statement about deployment artefacts, and deployment is the easiest of five things to reverse. Data, operations, organisation, and commitments to third parties all reverse at different rates, and they decay from the moment a migration starts.

The third is **temporary architecture debt**: the shims, dual-writes, translation layers, and duplicated state that exist only to make a migration possible. They are legitimate and often unavoidable. They become permanent when nobody records what would trigger their removal or who owns it.

The chapter does not prescribe a transformation programme, a cloud-migration playbook, an organisation redesign, or the strangler pattern. It develops migration as an evidence-led sequence and supplies the evolution conditions used by Chapters 11 and 12.

## Learning Objectives

By the end of this chapter, you should be able to:

- treat each intermediate architecture as a system requiring its own boundaries, failure analysis, and evidence;
- distinguish five kinds of reversibility and explain how each decays over a migration;
- assess rollback symmetry, and identify when roll-forward is the only real recovery;
- recognise temporary architecture debt and specify its decommissioning trigger, evidence, and owner;
- design shadow or parallel-running evidence and state what it can and cannot establish;
- treat ownership transfer as a migration step with its own risk;
- assess a blast-radius calculation, including why reducing peak exposure can increase total exposure; and
- produce an Evolution, Migration, and Reversibility Strategy comparing staged options.

## The Intermediate Architecture Is a Real Architecture

A migration produces a sequence of states, and each state deserves the analysis Chapters 2 through 8 applied to the endpoints. The most useful discipline is to write down, for every intermediate:

| Question | Why it is asked of the *intermediate*, not the endpoint |
| --- | --- |
| Who owns which fact? | During dual-write, two stores hold the same fact. **Which is authoritative today** is an architecture decision that changes per stage, and must be written before the stage begins (Chapter 4). |
| What are the new failure modes? | Dual-write introduces the possibility of partial success — a failure mode neither endpoint has. |
| What invariants are no longer enforceable? | A transactional invariant enforced by one store is not enforceable across two. It becomes an application obligation for the duration. |
| What can go wrong that is silent? | Drift between stores is the archetype: nothing fails, the numbers diverge (Chapter 2's finance job). |
| How would we know it is working? | A comparison mechanism is itself work; if it is not built, the intermediate is unobserved. |
| How long will it run? | The planned duration and the *maximum tolerable* duration are different numbers, and the second is the one that matters. |

The opening story fails on the last three. No comparison was built because the intermediate was expected to be brief; no maximum tolerable duration was recorded; and the silent failure mode — a swallowed duplicate error — was exactly the kind a comparison would have caught.

**Intermediate architectures are often worse than both endpoints.** Dual-writing is worse than one store and worse than two clean stores. That is normal and acceptable *for a bounded period*. It becomes a problem when the period is not bounded, and the boundary is a decision someone must own.

## Reversibility Is Five Things

"Can we roll back?" is answered too quickly because it is heard as a question about deployment.

| Kind | What must be undone | How fast it decays |
| --- | --- | --- |
| **Deployment reversibility** | Redeploy the previous artefact | Does not decay, and is the least important |
| **Data reversibility** | The previous version must be able to read data written by the new one; new-only data must be representable in the old model | Decays with every write. After a week of new-format data, "rollback" means data loss or a backfill nobody has written |
| **Operational reversibility** | Runbooks, dashboards, alerts, and staff knowledge must still support the old path | Decays with retraining and with the old path's monitoring being switched off |
| **Organisational reversibility** | Team ownership, on-call rotations, and structures must be returnable | Decays fast and quietly; a team disbanded is not reassembled |
| **Commercial / external reversibility** | Third parties pointed at the new path must be pointed back | Often effectively irreversible — a partner that migrated will not migrate back on your schedule |

Atlas's fourteen-month intermediate is deployment-reversible and irreversible on the other four. Saying "we can roll back" is true of the artefact and false of the system, and the honest statement is: *"we can redeploy the old code; we cannot restore the state, the operational knowledge, or the partner integration."*

Two practical consequences.

**Reversibility has an expiry, and it should be stated.** "This stage is data-reversible for seven days, after which backfill would be required" is a fact worth writing in the plan, because it converts an assumed safety net into a scheduled decision.

**Some things should be made deliberately hard to reverse, late.** Pointing the partner at the new service (stage two in the story) is a near-irreversible step. Sequencing near-irreversible steps last, after cheap evidence has accumulated, is the core of an evidence-led migration.

## Rollback, Roll-Forward, and Asymmetry

Chapter 8 introduced rollback asymmetry for contract changes; it generalises.

**Rollback is symmetric** when reverting the change returns the system to its prior state with nothing left behind. This is true for stateless changes behind a stable interface and rarely true otherwise.

**Rollback is asymmetric** when reverting the code does not revert the consequences — state written in a new format, events published to consumers who already acted, external systems already notified. Here, reverting the deployment leaves a system the old code cannot correctly interpret.

**Roll-forward** — fixing forward rather than reverting — is the honest plan for asymmetric changes. It is not a lesser option; for most state-affecting migrations it is the only real one. What it requires is preparation: the ability to deploy a fix quickly, the ability to identify affected records, and a correction path for data written incorrectly.

The failure to avoid is a plan that names rollback as the recovery for a change where rollback is asymmetric. That is not a plan; it is an assumption that will be tested during an incident. The test is simple and should be applied to every stage: **if we revert this deployment, what remains that the old code cannot handle?** If the answer is anything at all, the recovery is roll-forward and the plan should say so.

## Temporary Architecture Debt

**Temporary architecture debt** is structure that exists only to enable a migration: dual-writes, shims, translation layers, compatibility endpoints, duplicated state, feature flags routing between old and new paths.

It is legitimate. Incremental migration is generally safer than a cutover, and incremental migration requires these mechanisms. The problem is not incurring the debt; it is that the mechanisms are written under time pressure, are nobody's product, and outlive their purpose by default.

Every piece of temporary architecture debt needs four things recorded when it is created:

| Field | Atlas dual-write example |
| --- | --- |
| **Purpose** | Keep the old fulfilment table populated while consumers migrate |
| **Decommissioning trigger** | Observable: "when the finance reconciliation job reads exclusively from the new service, verified over one full monthly cycle" — not "when migration completes" |
| **Evidence of safety to remove** | A store-comparison mechanism showing zero drift over the observation window |
| **Owner** | A named accountable role, which survives the author changing teams |

The opening story's shim had a purpose and none of the other three. That is the general failure: purpose is obvious, trigger is vague, evidence is unbuilt, and the owner is whoever wrote it.

Two further disciplines help. **Give temporary debt a visible expiry**, so that passing it is an event rather than a non-event — a dated entry in the plan, reviewed. And **build the comparison before the debt**, because a dual-write without a comparison is an unobserved intermediate, and unobserved intermediates drift silently.

## Shadow and Parallel-Running Evidence

**Shadow running** sends real traffic to the new path alongside the old, discards the new path's output, and compares. **Parallel running** uses both outputs, typically with the old path authoritative.

Both are strong evidence for a narrow question, and both are commonly over-read.

| Establishes | Cannot establish |
| --- | --- |
| The new path produces matching output for the traffic actually seen | Behaviour on traffic patterns not seen during the window |
| The new path handles production data shapes | Behaviour under failure — the old path was carrying the load, so the new one was never stressed |
| Rough performance under real load | Whether the new path's *side effects* are correct, if outputs are discarded |
| Divergence rate between the two | Whether divergences matter — that requires reading them |

The last row is where shadow running usually goes wrong. A divergence rate of 0.3% sounds tolerable and is meaningless until someone reads a sample: 0.3% of divergences that are timestamp formatting is fine, and 0.3% that are order totals is not. A shadow run without a divergence-triage step produces a number rather than evidence.

Shadow running also has real costs — doubled load on shared dependencies, and, if the new path has side effects that are not fully suppressed, duplicated external actions. Chapters 3 and 4 apply directly: a shadow path that calls the payment provider is not a shadow.

## Numerical Reasoning: Blast Radius and Exposure

The following is a **bounded, synthetic worked example** in which correct arithmetic supports a conclusion opposite to the one it appears to support.

| Field | Entry |
| --- | --- |
| Context | Atlas is comparing a single-cutover migration with a three-stage staged migration for the fulfilment separation. |
| Population and boundary | Ten identified touchpoints affected by the change: four direct consumers of order/fulfilment state, three support workflows, two reports, and one partner integration. Scope excludes any touchpoint not enumerated. |
| Assumptions | A single cutover exposes all ten for one day. The staged migration exposes 3, then 4, then 3 touchpoints, each stage running two weeks. All touchpoints are treated as equally consequential. Exposure risk is treated as proportional to touchpoints × duration. |
| Units | Touchpoints; weeks; touchpoint-weeks. |
| Calculation | **Peak exposure.** Cutover = 10 touchpoints at once. Staged = max(3, 4, 3) = **4**, i.e. 4 ÷ 10 = **40%** of the cutover's peak. **Total exposure.** Staged = (3 × 2) + (4 × 2) + (3 × 2) = **20 touchpoint-weeks**. Cutover = 10 × (1 ÷ 7) ≈ **1.43 touchpoint-weeks**. Ratio = 20 ÷ 1.43 ≈ **14×**. |
| Interpretation | Staging reduces the *peak* severity of a bad moment to 40% and increases *total* exposure roughly fourteenfold. Both figures are correct, and they point in opposite directions. Staging is not straightforwardly safer; it trades a short severe exposure for a long mild one, and which trade is better depends on whether Atlas's failure modes are catastrophic-and-fast or silent-and-slow. |
| Limitation | **The arithmetic quietly favours the cutover by omitting its tail.** The 1.43 figure assumes the cutover works; if it does not, exposure is all ten touchpoints for an unbounded period with no staged fallback, and that scenario appears nowhere in the calculation. The model also treats all touchpoints as equal — the finance report whose silent four-day error appeared in Chapter 2 is not equivalent to a support screen — and treats risk as linear in time, whereas it concentrates at transitions, so a three-stage migration has three risky moments rather than a smooth twenty-week smear. Most importantly, the enumeration of ten is itself the assumption: Chapter 2 established that Atlas's consumer inventory is incomplete, and an unenumerated touchpoint has zero weight in both columns. |
| Decision relevance | Supports asking *which* failure profile Atlas faces — fast and loud, or slow and silent — because that determines which figure matters. Given that Chapter 2's incident was silent and lasted four days, the total-exposure figure deserves more weight than the peak figure, which is the opposite of the usual reading. Does not select a migration approach. |

The general lesson: a blast-radius model that measures only the peak will always favour staging, and one that measures only the integral will always favour cutover. Choosing the metric chooses the answer, which is why the metric must be justified against the system's actual failure profile.

## Worked Reasoning: Three Migration Approaches

Atlas must separate fulfilment from checkout while preserving order status, `PAYMENT_UNKNOWN` handling, support workflows, contract compatibility, and customer-visible state.

### Option A — Modular refactor in place

Enforce the fulfilment module boundary; no deployment, process, or data change.

| Aspect | Entry |
| --- | --- |
| Migration sequence | Introduce the interface; migrate call sites; add a build-time dependency check; remove direct table access from checkout. |
| Intermediate architecture | Briefly, some call sites use the interface and some do not — a mixed state lasting days, with no new failure modes. |
| Temporary debt | Minimal. Possibly a temporary facade during call-site migration. |
| Compatibility condition | None external. No contract changes. |
| Shadow / parallel evidence | Not applicable and not needed. |
| State migration | None. |
| Recovery condition | Revert the commit. |
| Rollback / roll-forward | **Symmetric rollback.** Nothing persists that the old code cannot read. |
| Customer-impact signal | None expected; ordinary regression signals suffice. |
| Ownership transition | None. |
| Evidence gate | Dependency check passes; no direct table access remains; existing behaviour unchanged. |
| **Reason to defer** | It does not deliver independent deployment, which is the stated goal. Its real value is that it is a prerequisite for B and C — the boundary must exist before it can be moved. |

### Option B — Bounded extraction, shared store retained

Fulfilment becomes a separately deployed unit; the store stays shared.

| Aspect | Entry |
| --- | --- |
| Migration sequence | (1) Option A. (2) Deploy fulfilment as a second unit behind a flag, traffic still in-process. (3) Route a fraction of traffic to the new unit. (4) Route all traffic. (5) Remove the in-process path. |
| Intermediate architecture | Stages 3–4 run **both** paths against one store. Two code versions write the same tables; a schema change during this window must be compatible with both. Ownership of each fact is unchanged, which is the main simplification this option buys. |
| Temporary debt | The routing flag and the retained in-process path. Trigger for removal: one full week at 100% with no regression. Owner: order-domain owner. |
| Compatibility condition | The interface between checkout and fulfilment must tolerate version skew in both directions for the duration. |
| Shadow / parallel evidence | Useful at stage 3: compare outcomes for the same order across both paths. **Side effects must be suppressed in the shadow path** — a shadow that enqueues a real pick is not a shadow. |
| State migration | None. This is the option's principal advantage and the reason it is much cheaper than C. |
| Recovery condition | Flip the routing flag back. |
| Rollback / roll-forward | **Rollback symmetric while the flag exists** — the strongest reversibility property of any option here. Asymmetric once stage 5 removes the in-process path. |
| Customer-impact signal | Fulfilment job creation rate; duplicate-job rate; order-status transition latency. |
| Ownership transition | Optional. Can remain with one team, which removes an entire class of risk. |
| Evidence gate | Per stage: no duplicate jobs; latency within the agreed expectation; error rates unchanged; comparison clean at stage 3. |
| **Reason to defer** | It adds a second operational surface and a version-skew failure class for a four-engineer team. It also retains the shared-store coupling that produced the Chapter 2 incident, so it solves release coordination without solving the ownership problem. |

### Option C — Larger decomposition with a separate fulfilment store

Fulfilment becomes a separate unit **and** owns its own store.

| Aspect | Entry |
| --- | --- |
| Migration sequence | (1) Option A. (2) Option B through stage 4. (3) Introduce the new store; dual-write with the old table authoritative. (4) Build and run a comparison. (5) Switch authority to the new store, old table still written. (6) Migrate each consumer, one at a time. (7) Stop dual-writing. (8) Decommission the old table. |
| Intermediate architecture | Stages 3–7 are the fourteen-month architecture from the opening story: two stores, a dual-write, shifting authority, and a comparison mechanism. **Which store is authoritative changes at stage 5** and must be documented per stage (Chapter 4). |
| Temporary debt | Dual-write mechanism, comparison job, and per-consumer compatibility shims. Trigger for removal of the dual-write: every identified consumer reading from the new store, verified over one full monthly cycle to catch the finance job. Owner: named, and surviving staff changes. |
| Compatibility condition | Every consumer must be enumerated first — **including the ones Chapter 2 established are not in the catalogue**. This is the gating prerequisite. |
| Shadow / parallel evidence | Essential at stage 4, and its value depends entirely on a divergence-triage step, not on a divergence rate. |
| State migration | Substantial: historical fulfilment state must be migrated or made accessible; cross-store invariants become application obligations; `PAYMENT_UNKNOWN` reconciliation must work across two stores. |
| Recovery condition | Per stage. After stage 5, recovery requires reversing authority *and* backfilling anything written to the new store since. |
| Rollback / roll-forward | Symmetric through stage 4. **Asymmetric from stage 5 onward**, decaying by the day. From stage 6, external consumers have migrated and commercial reversibility is effectively gone. |
| Customer-impact signal | Order-status accuracy; duplicate fulfilments; support's ability to answer "what happened" (Chapter 4's evidence row) during the dual-store window. |
| Ownership transition | Realistically requires a second team, which is an organisational change with its own risk and is Part XII's territory to design. |
| Evidence gate | Per stage, with stage 5 gated on a clean comparison over a full monthly cycle and stage 7 gated on per-consumer confirmation rather than announcement (Chapter 8). |
| **Reason to defer** | The intermediate architecture is worse than both endpoints, will run for months, and is the one Atlas has historically failed to observe. The consumer enumeration is incomplete, which means the compatibility condition for stage 6 cannot currently be satisfied. And it is proposed by a team that has not yet built a store comparison. |

### The decision record

| Element | Entry |
| --- | --- |
| Context | Fulfilment changes require checkout releases; 36.7% co-change (Chapter 5); shared store with unenumerated consumers (Chapter 2). |
| Quality claim | A change confined to fulfilment can be released independently, without degrading order-status accuracy, `PAYMENT_UNKNOWN` handling, or support's ability to establish what happened. |
| Characteristic | Maintainability and flexibility as the goal; reliability and functional suitability as the things not to break. |
| Constraint | Four engineers; one team; promotion in eight weeks; no second store operated; consumer inventory incomplete. |
| Assumption | Consumers can be fully enumerated. **Unverified, and it is the gating condition for Option C's stage 6.** |
| Trade-off | A is symmetric-reversible and does not meet the goal. B meets the goal, keeps rollback symmetric for most of its life, and retains the store coupling. C addresses ownership and buys a long, poorly-reversible intermediate. |
| Failure mode | A: enforcement bypassed. B: version skew during the promotion. C: the opening story — an unbounded intermediate with unowned debt and unmeasured drift. |
| Evidence needed | The consumer enumeration; a store-comparison mechanism built *before* any dual-write; the co-change read from Chapter 5. |
| Limitation | The operational cost of a second store cannot be established before operating one. |
| Decision | Not made here. A is a prerequisite for both B and C and is symmetric-reversible, so it can proceed on its own merits while the enumeration is completed. The B-versus-C question should not be answered before the enumeration exists, because C's compatibility condition is currently unsatisfiable. |
| Owner | Order-domain owner; platform owner for a second store; delivery owner for the promotion constraint; Part XII territory for any ownership transfer. |
| Residual risk | Unenumerated consumers remain a risk under every option, and are the specific mechanism by which the opening story happened. |
| Revision trigger | Enumeration complete; comparison mechanism built; a second team available; promotion window closed. |

## The Evolution, Migration, and Reversibility Strategy

This chapter's professional artefact is the **Evolution, Migration, and Reversibility Strategy** — an MSQE teaching artefact. It is organised **by stage**, not by endpoint, and each stage records:

| Field | Content |
| --- | --- |
| Stage goal | What this stage achieves on its own |
| Intermediate architecture | Boundaries, authoritative store per fact, new failure modes, invariants no longer enforceable |
| Planned duration and **maximum tolerable duration** | Two different numbers; the second forces a decision |
| Temporary debt created | Each item with purpose, decommissioning trigger, safety evidence, and named owner |
| Evidence gate | What must be observed before proceeding, stated before the stage runs |
| Reversibility | Assessed across all five kinds, with the expiry of each |
| Recovery | Rollback if symmetric; otherwise the roll-forward plan and its prerequisites |
| Customer-impact signal | What a customer would experience if this stage went wrong, and how it would be detected |
| Ownership | Who owns the stage and whether ownership transfers |
| Reason to defer | Why this stage might reasonably not happen now |

Three rules keep it honest.

**Every stage must be independently defensible.** If a stage delivers nothing on its own and only makes sense as part of the whole, the plan is a cutover disguised as a sequence, and its stage gates will be skipped under pressure.

**Every temporary-debt item has a named owner and an observable trigger.** "When migration completes" is not a trigger. "When the finance job reads exclusively from the new store, verified over one monthly cycle" is.

**Reversibility is stated with an expiry.** "Data-reversible for seven days" is a plan. "We can roll back" is a hope.

## Engineering Perspective

**Build the comparison before the dual-write.** This inverts the usual order and is the single highest-value change to a migration plan. A dual-write without a comparison is an unobserved intermediate; the opening story's unknown drift is the predictable result. The comparison also has value after the migration, as a regression check.

**Sequence irreversible steps last.** Pointing an external consumer at the new path, deleting the old store, and disbanding the team that knew the old system are all near-irreversible. Each should come after cheap evidence has accumulated, and each should be an explicit decision rather than a consequence of a stage completing.

**Ask what the intermediate does under the failure you already know about.** Atlas knows about payment degradation. A migration plan should state what a dual-store intermediate does when `PAYMENT_UNKNOWN` reconciliation must run across two stores, because that condition will recur and the intermediate will be running when it does.

**Treat ownership transfer as a stage.** It has a risk profile, an evidence gate — can the receiving team operate it, demonstrated how? — and it is frequently the least reversible step in the plan. Designing the organisation is Part XII's; noticing that the transfer is a migration step with its own risk belongs here.

## Industry Perspective

The strangler-fig approach — incrementally replacing a system by routing functionality to new implementations until the old one can be retired — is widely used and widely cited.[^fowler-strangler] Its appeal is real: it avoids a single high-risk cutover and delivers value incrementally.

It is not universally correct, and this chapter declines to prescribe it. Its costs are precisely the ones this chapter is about: it *requires* a long-lived intermediate architecture, a routing mechanism that is temporary architecture debt, and a decommissioning phase that teams routinely fail to complete — the fourteen-month dual-write is a strangler migration that stopped at stage two. Where a system is small, where the cutover is genuinely reversible, or where the team lacks the capacity to operate two paths simultaneously, a bounded cutover can be the lower-risk option. The approach is a tool with a cost profile, not a default.

Evolutionary-architecture practitioner literature makes the complementary case that architecture should be designed for incremental change rather than for a target state.[^ford-evolutionary] Part XI takes the compatible position without the prescription: the intermediate states are the design problem, and a plan that has designed only its endpoint has designed the easy half.

## Common Misconceptions and Pitfalls

### "We can roll back."

Usually true of the deployment artefact and false of the data, operations, organisation, and external commitments. Ask what remains that the old code cannot handle.

### "It's temporary."

Temporary architecture debt becomes permanent by default. Without a named owner and an observable decommissioning trigger, "temporary" is a description of intent, not of duration.

### "The shadow run showed 0.3% divergence."

Meaningless without triage. Read a sample and classify: formatting divergences and total divergences are the same number and different findings.

### "Staged migration is safer."

It reduces peak exposure and increases total exposure, sometimes by an order of magnitude. Which is safer depends on whether your failure modes are fast and loud or slow and silent — and Atlas's have been slow and silent.

### "We'll enumerate the consumers during the migration."

The enumeration is the gating condition for the consumer-migration stage. Starting a migration whose compatibility condition cannot yet be satisfied means discovering the missing consumer at the decommissioning step, which is the most expensive possible moment.

### "The strangler pattern is the right way to do this."

It is one approach with a specific cost profile: a long intermediate, routing debt, and a decommissioning phase that is frequently abandoned. It is often right, and it is not a default.

## QA → QE Transition

The transition in this chapter is from validating a final cutover to evaluating a sequence of intermediate states, their evidence gates, their compatibility conditions, their failure paths, and their reversibility.

A QA Engineer given the fulfilment migration would plan regression coverage for the end state and a smoke check for each release — necessary, and not sufficient. A Quality Engineer asks what architecture runs between stage three and stage seven; which store is authoritative on each day of it; what invariant stops being enforceable and what replaces it; what silent divergence could accumulate and what would detect it; how long the intermediate is *tolerable* as distinct from planned; what remains after a rollback that the old code cannot read; which step is the one that cannot be undone and why it is not last; and who owns the shim after its author changes team.

Then they say the thing that prevents the opening story: build the comparison before the dual-write, and write down the trigger that removes it.

## Summary

A migration is a sequence of intermediate architectures, each of which is a real system with its own boundaries, failure modes, authoritative-store decisions, and evidence needs — and the intermediate frequently runs longest and is analysed least. Reversibility is five distinguishable properties: deployment, data, operational, organisational, and commercial. Only the first fails to decay, and it is the least important. Rollback is symmetric only when nothing persists that the old code cannot interpret; for most state-affecting changes, roll-forward is the honest recovery and requires its own preparation. Temporary architecture debt is legitimate and becomes permanent by default unless it carries a named owner and an observable decommissioning trigger. Shadow running establishes output agreement on the traffic seen and establishes nothing about failure behaviour or the significance of divergences without triage. A blast-radius model measuring peak exposure always favours staging and one measuring total exposure always favours cutover, so the choice of metric must be justified against the system's actual failure profile.

## Key Takeaways

- Design the intermediate architectures, not only the endpoint; they run longest and are analysed least.
- Record which store is authoritative for each fact, per stage, before the stage starts.
- Reversibility is five things; four of them decay from the moment a migration begins.
- Ask what remains after a rollback that the old code cannot handle; if anything does, plan roll-forward.
- Every temporary-debt item needs a purpose, an observable trigger, safety evidence, and a named owner.
- Build the store comparison *before* the dual-write, not after it goes wrong.
- A divergence rate without triage is a number, not evidence.
- Staging reduces peak exposure and increases total exposure; the metric you choose chooses the answer.
- Sequence near-irreversible steps last, and treat ownership transfer as a stage with its own risk.
- Every stage should be independently defensible, or the plan is a cutover in disguise.

## Review Questions

1. Atlas dual-wrote for fourteen months. Name the three things missing from the temporary-debt record that would have prevented it.
2. Which of the five kinds of reversibility did Atlas retain after fourteen months, and which had it lost?
3. In the blast-radius example, both figures are correct and point opposite ways. Which should Atlas weight more heavily, and why?
4. What does a shadow run establish, and what does it specifically fail to establish about failure behaviour?
5. Why is Option C's compatibility condition currently unsatisfiable, and what would satisfy it?
6. Give an example of a migration step that is deployment-reversible and commercially irreversible.

## Interview Questions

1. A team says a migration can be rolled back at any stage. How do you test that claim?
2. How would you decide between a staged migration and a bounded cutover?
3. What would you require before agreeing to a dual-write period?
4. How do you prevent a temporary compatibility shim from becoming permanent?

## Practical Exercise

Produce an **Evolution, Migration, and Reversibility Strategy** for the following synthetic Atlas Commerce migration.

*Atlas is replacing its pricing engine. Today, prices are computed inside the catalogue module from tables in the shared store. The new engine is a separate service with its own rules store and an API. Checkout, catalogue listing, the promotions module, the partner feed, and the nightly margin report all obtain prices today by reading the shared tables directly. The new engine changes how rounding is applied for multi-item discounts, so some prices will legitimately differ. The promotion begins in six weeks.*

Your strategy must:

- define **at least three stages**, each with a stage goal that is independently defensible;
- for each stage, describe the **intermediate architecture**, including which component is authoritative for price on each day of that stage;
- state a **planned duration and a maximum tolerable duration** for each stage, and say what happens when the second is reached;
- record every item of **temporary architecture debt** with purpose, observable decommissioning trigger, safety evidence, and a named owner role;
- assess **all five kinds of reversibility** per stage, with an expiry for each that decays;
- determine **rollback symmetry** per stage and give a roll-forward plan wherever it is asymmetric;
- design **shadow or parallel-running evidence**, state what it cannot establish, and specify a **divergence-triage step** — noting that some divergences are intended because rounding changed;
- identify the **near-irreversible step** and justify its position in the sequence;
- state a **customer-impact signal** per stage and how it would be detected; and
- give each stage a **reason to defer**.

Then answer, in no more than 150 words: the rounding change means the old and new engines will legitimately disagree. Explain what this does to shadow-run comparison as an evidence mechanism, and what you would do instead. Do not implement the migration. Use synthetic data only.

## Further Reading

- [M. Fowler — StranglerFigApplication](https://martinfowler.com/bliki/StranglerFigApplication.html) — practitioner guidance, not a standard; one approach with a specific cost profile.
- N. Ford, R. Parsons, and P. Kua — *Building Evolutionary Architectures: Support Constant Change*. O'Reilly Media, 2017 — practitioner literature.
- [ISO/IEC/IEEE 42010:2022 — Architecture description](https://www.iso.org/standard/74393.html)

## References

[^fowler-strangler]: Fowler, M. [StranglerFigApplication](https://martinfowler.com/bliki/StranglerFigApplication.html). 2004. Practitioner guidance, not a standard. Accessed 2026-08-14.
[^ford-evolutionary]: Ford, N., Parsons, R., and Kua, P. *Building Evolutionary Architectures: Support Constant Change*. O'Reilly Media, 2017. ISBN 978-1-4919-8636-3. Practitioner literature, not a standard. Accessed 2026-08-14.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Describe an intermediate architecture with its authoritative store, new failure modes, and lost invariants.
- [ ] State a maximum tolerable duration distinct from a planned one.
- [ ] Distinguish five kinds of reversibility and give each an expiry.
- [ ] Determine rollback symmetry and produce a roll-forward plan where it is absent.
- [ ] Record temporary architecture debt with an observable trigger and a named owner.
- [ ] Specify a divergence-triage step for shadow-run evidence.
- [ ] Explain why a blast-radius metric choice determines the migration conclusion.

## Chapter Navigation

Previous: [Chapter 9 — Architecture Evidence, Fitness Functions, and Decision Records](chapter-09-architecture-evidence-fitness-functions-and-decision-records.md) · Next: Chapter 11 — Integrated Architecture Decisions: Scale, Security, Reliability, and Residual Risk *(planned; not yet drafted)*
