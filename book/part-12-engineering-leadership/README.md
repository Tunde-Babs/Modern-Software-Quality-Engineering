# Part XII — Engineering Leadership & Career Growth

---

## Curriculum Status

**Curriculum architecture COMPLETE and independently VERIFIED. Accelerated Pass 1 is COMPLETE: Batches A, B, and C are drafted and Checkpoints A, B, and the Batch C integration checkpoint passed.** Part XII is planned for **v0.15.0 — Engineering Leadership & Career Growth Complete**. All twelve chapters exist and carry `Status: Draft`. **No manuscript review or Final Quality Gate has been run.** No Part XII laboratory, diagram, worksheet, simulator, dataset, companion implementation, case-study file, website asset, CI/CD configuration, or infrastructure has been created.

The architecture passed through two independent review events, targeted corrections C1–C13, and independent closure verification. **All three P1 findings and all seven P2 findings are closed**, all sixteen load-bearing strengths were preserved, and the closure review found no material generic-management drift and no composite-scoring regression.

### Part XII review-event ledger

Two separate review events produced two separate scores. **They are distinct events and must not be collapsed, and the second does not replace the first**: 83/100 describes the architecture *before* correction; 97/100 describes independently verified closure *after* correction.

| # | Review event | Score | Result |
| --- | --- | --- | --- |
| 1 | Independent curriculum-architecture review | **83/100** | B — targeted architecture corrections required before Pass 1. No P0; **3 P1**; **7 P2**; **5 P3**. No redesign required. |
| 2 | **Focused independent architecture-closure review** | **97/100** | **A — corrections verified and closed; Pass 1 may be authorized.** P0 = 0; P1 = 0 open (all 3 CLOSED); P2 = 0 open (all 7 CLOSED); P3 = 0 blocking. |

Event 1 recorded three P1 findings — MQE-BOK Domain 12 traceability; unhonoured cross-part deferrals from Parts V, IX, X, and XI; and source insufficiency across seven chapters — alongside seven P2 and five P3 findings. The 12-chapter progression, four-stage structure, chapter sequencing, authority discipline, career-claim discipline, Atlas continuity, central model, capstone design, and Pass 2 classification were accepted at event 1 and are unchanged.

Event 2 verified the corrections independently rather than confirming the correction report: both governance sources were re-read directly, the cross-part deferrals were re-derived from released-part text with three quotations checked verbatim, the segment-mix arithmetic was recomputed with exact rational arithmetic, Goodhart's lineage was confirmed in all three parts, DORA terminology was verified against official DORA material, and Kaner & Bond's construct-validity claim was verified from the primary text.

Part XII's 97/100 is unrelated to Part XI's 97/100 architecture-review score; they are different reviews of different parts at different lifecycle stages. Neither is a Final Quality Gate result. **The Final Part XII Quality Gate is a separate, later event that has not been run.**

This document is the verified curriculum architecture. It defines the intended manuscript, its learning progression, scope boundaries, professional artefacts, source strategy, and Pass 2 classification, and it is authoritative for manuscript production once Pass 1 is separately authorized. It does **not** by itself authorize manuscript production. Any future Part XII chapter begins with `Status: Draft` under manuscript-status governance.

Part XI — System Design & Architecture is the latest released handbook part, as **v0.14.0**. Part XII is the final planned handbook part; after it, the project moves to v0.16.0 — First Edition Review.

---

## Mission

Part XII develops the ability to make Quality Engineering **count inside an organisation**. It helps experienced Quality Engineers move beyond the question, *“Is my analysis correct?”*, to a harder one:

> Which decision is at stake, who owns it, what does that person need in order to decide well, what can my evidence honestly support, and what capability remains in the organisation after I have moved on?

The part is not a management textbook, a leadership-philosophy survey, an agile transformation programme, an HR or performance-management curriculum, a certification syllabus, an interview-preparation course, or a promotion playbook. It teaches a Quality Engineer to communicate evidence credibly, disagree productively, grow quality reasoning in other people, measure practice without corrupting it, and develop a career on the same evidence discipline the rest of this handbook applies to software.

Leadership here is treated as **influence exercised without claiming authority**. Every earlier part ends by naming an accountable decision owner and stopping. Part XII is about what a Quality Engineer does in that gap: making the evidence usable, the uncertainty legible, the disagreement safe, and the capability durable — while the decision continues to belong to someone else.

---

## Intended Reader and Prerequisites

Part XII is for experienced QA Engineers, Test Automation Engineers, SDETs, software engineers, and Quality Engineers who want their technical work to change decisions and outlast their own involvement. It is equally intended for individual contributors with no direct reports and for those moving toward formal leadership; **it does not assume, require, or aim at a management title.**

Completion of Parts I–XI is recommended. Part XII draws on all of them, because its raw material is the evidence those parts teach readers to produce:

- Part I for quality characteristics, systems thinking, and shared quality ownership;
- Part III for risk-informed evidence, testability, and investigation;
- Part IV for contract and interface evidence;
- Part V for automated feedback and its trustworthiness;
- Part VI for data ownership, reconciliation, and decision integrity;
- Part VII for delivery constraints and release evidence;
- Part VIII for operational evidence, reliability claims, and incident learning;
- Part IX for uncertainty, evidence boundaries, and limitation language;
- Part X for performance and security claims and specialist-evidence handoffs; and
- Part XI for architecture decisions, decision ownership, residual risk, and revision triggers.

Readers do not need a team to lead, a budget, a title, direct reports, or authority to change an organisation. Atlas Commerce scenarios and all evidence described here will be synthetic and clearly labelled as illustrative.

---

## MQE-BOK and QA → QE → Leadership Mapping

Part XII must remain traceable to the repository's own body of knowledge. `docs/00-project/MQE-BOK.md` defines **Domain 12 — Engineering Leadership** with eight topics and the learning outcome *“Lead engineering teams that build quality into software systems.”* Every topic has a chapter home.

| MQE-BOK Domain 12 topic | Chapter home | Scope in Part XII | Explicit boundary |
| --- | --- | --- | --- |
| Technical Leadership | 1 | Influence exercised without claiming authority; locating the Quality Engineer's contribution to a decision owned by someone else. | No leadership-style taxonomy, motivational content, or persuasion technique. |
| **Engineering Management** | **5 and 7** | **The Quality Engineering consequences of engineering-management decisions**: ownership, decision rights, resource and capability constraints, organisational structure, quality responsibilities, escalation, quality operating models, capability development, and policy ownership. | **Not people-management practice.** No hiring or firing, compensation, performance-review administration, HR policy, employment law, or people-management mechanics. |
| Quality Culture | 6 | Culture as a set of bounded, evidenced claims, and the limits of those claims. | No culture-change programme, survey instrument, or organisational-psychology curriculum. |
| Mentoring | 8 | Transferring quality reasoning; capability concentration; power asymmetry in the mentoring relationship. | No performance management, coaching certification, or HR development framework. |
| Communication | 2 | Evidence surviving translation across audience, format, and summarisation. | No presentation skills, slide design, storytelling framework, or negotiation technique. |
| Technical Writing | 3 | Durable records whose purpose is future challengeability: rationale, assumption, provenance, staleness, ownership. | No documentation-platform tutorial or mandated template. |
| Decision Making | 1, 4, 5, and 12 | The MSQE Quality Influence and Decision Model; disagreement and escalation; decision rights and governance operating models; the capstone brief. | No decision-theory curriculum; the Quality Engineer recommends, an accountable owner decides. |
| Career Development | 11 | Capability stated as bounded claims with inspectable evidence, and honest limits on what a handbook can predict. | No promotion guarantee, salary guidance, CV service, or interview coaching. |

### Engineering Management: what Part XII does and does not teach

Engineering Management is a named Domain 12 topic, and the earlier draft of this architecture excluded it without recording the decision. That gap is now closed by scoping rather than by omission.

Part XII teaches Engineering Management **as a source of conditions that a Quality Engineer must reason about**, not as a practice a Quality Engineer performs. A management decision about team boundaries, capability investment, policy ownership, or escalation routing changes what quality outcomes are achievable, and a Quality Engineer who cannot reason about that is limited to recommending things the organisation cannot do. What Part XII does **not** do is teach the reader to make those decisions, or to manage people.

The boundary is therefore between **the quality consequences of a management decision** (Part XII's, in Chapters 5 and 7) and **the mechanics of managing people** (nobody's, in this handbook).

### Governance-document divergence

Two repository documents describe Part XII's topic set and they do not agree. This is recorded here rather than resolved by silent edit.

| Document | Topic set | Divergence |
| --- | --- | --- |
| `docs/00-project/MQE-BOK.md` (Domain 12) | Eight topics: Technical Leadership, Engineering Management, Quality Culture, Mentoring, Communication, Technical Writing, Decision Making, Career Development. | — |
| `docs/00-project/BOOK_BLUEPRINT.md` (Part XII) | Six topics: Technical Leadership, Communication, Mentoring, Quality Culture, **Career Planning**, Technical Writing. | Omits **Engineering Management** and **Decision Making**; says *Career Planning* where the BOK says *Career Development*. |

**Part XII treats `MQE-BOK.md` as authoritative for domain coverage**, because the BOK is the repository's body-of-knowledge specification and defines the domain's learning outcome, while `BOOK_BLUEPRINT.md` is a high-level publication blueprint carrying a narrower summary. Covering the BOK's eight topics also covers the Blueprint's six. **No governance file is modified by this architecture task**; the divergence is recorded for the v0.16.0 First Edition Review to reconcile.

### Learning-outcome interpretation

The Domain 12 learning outcome — *“Lead engineering teams that build quality into software systems”* — is **not** interpreted as “every learner becomes a line manager.”

Leadership in Part XII means technical and organisational influence directed at quality outcomes, exercised by senior individual contributors, Staff and Principal Quality Engineers, QE leads, specialists, and managers alike. A senior IC who changes what an organisation can decide well has led; a manager who does the same has led; the capability is the same and the reporting line is not part of it. Part XII therefore supports a management path without requiring one, and no chapter is structured around having direct reports.

---

## Scope, Boundaries, and Handoffs

| Part XII owns | Part XII does not own |
| --- | --- |
| Communicating quality evidence to decision owners: audience, framing, translation loss, and what survives summarisation | Persuasion technique for its own sake, negotiation training, or getting a preferred outcome adopted |
| Disagreement, escalation, dissent, and recording an unheeded concern proportionately | Grievance process, conflict-resolution counselling, or legal/whistleblowing procedure |
| Decision rights, ownership models, accountability, **policy ownership, and governance operating models** as they affect quality outcomes | Formal organisational authority, reporting lines, compensation, performance management, or a universal governance framework or maturity model |
| Quality culture as a set of bounded, evidenced claims — and the limits of those claims | Culture-change programmes, engagement surveys as instruments, or organisational psychology as a discipline |
| **Quality-engineering analysis of organisation design and its consequences**: boundaries, ownership gaps, Conway effects, capability placement, coordination cost, and **ownership-transfer reasoning** | Organisation-design *prescription*: restructuring playbooks, headcount design, reorganisation programmes, org charts, or generic consulting frameworks |
| Mentoring, coaching, and growing quality reasoning in others | Formal people management, HR development frameworks, or hiring/firing practice |
| Measuring engineering and quality practice, and the specific hazards of doing so | A metrics programme, a maturity model, a scorecard, or benchmarking against other organisations |
| Practice change: adoption, reversibility, and evidence that a change helped | Transformation methodology, agile framework adoption, or tool procurement |
| Career growth as evidence-led practice: capability, portfolio, roles, and honest limits | Promotion guarantees, salary guidance, résumé services, or interview coaching |

The handoffs below are deliberate. Part XII may use an adjacent-part concept only far enough to establish an organisational condition, decision, or capability boundary.

| Adjacent part | Part XII contribution | Remains with the adjacent part |
| --- | --- | --- |
| Part I — Foundations | Extend shared quality ownership from a principle into an ownership model with named accountability and observable gaps. | Quality models, quality characteristics, and foundational systems thinking. |
| Part III — Software Testing Engineering | Treat test evidence as something that must survive translation to a non-testing audience. | Test theory, design techniques, and investigation practice. |
| Part V — Automation Engineering | Reason about what automated feedback tells an organisation, and who acts on it. | Framework design, execution architecture, and tool implementation. |
| Part VI — Data Quality Engineering | Use data ownership and reconciliation as examples of accountability gaps with organisational causes. | Pipelines, lineage, and data-quality measurement. |
| Part VII — Cloud & DevOps | Use delivery constraints and release evidence as inputs to practice-improvement decisions. | Pipelines, environments, and release administration. |
| Part VIII — Observability & Reliability Engineering | Treat incident learning as an organisational capability and a source of practice evidence. | Telemetry, SLI/SLO design, alerting, and incident-response practice. |
| Part IX — AI Quality Engineering | State where an AI capability changes who is accountable for a quality outcome. | AI evaluation, model safety, and agentic-system quality. |
| Part X — Performance & Security Engineering | Use specialist findings as material that must reach an accountable owner intact. | Workload experiments, threat modelling, and security controls. |
| Part XI — System Design & Architecture | Use the Architecture Decision Brief and evidence portfolio as communication-and-influence artefacts; analyse the quality consequences of the organisational changes Part XI declined to design. | Architecture reasoning, boundaries, evidence selection, and decision records themselves. |

### Reconciliation of deferrals from released parts

Parts V, IX, X, and XI are released, and each deferred specific work to Part XII in published text. Those deferrals are obligations, and Part XII is the last substantive part — there is nowhere further to defer to. Each is reconciled below. **No released part is modified.**

| Deferring part | Published deferral | How Part XII honours it |
| --- | --- | --- |
| Part V — Automation Engineering | *“Engineering leadership and organisation design belong to Part XII”*; *“Organisation-wide leadership, staffing, and career-development practice.”* | Leadership across Chapters 1–4; organisation-design consequences in Chapter 7; capability development in Chapter 8; career development in Chapter 11. Staffing decisions themselves remain out of scope as people-management mechanics. |
| Part IX — AI Quality Engineering | *“Part XII owns engineering leadership and governance depth.”* | Governance depth is delivered in Chapter 5 as decision rights, policy ownership, and quality operating models — bounded to their quality consequences. |
| Part X — Performance & Security Engineering | Part X *“does not teach governance operating models, policy ownership, or leadership practice.”* | Governance operating models and policy ownership are delivered in Chapter 5; leadership practice across Chapters 1–4. |
| Part XI — System Design & Architecture (README) | Part XII owns *“Organisation design, governance operating models, leadership, career progression, and formal decision rights.”* | Formal decision-right systems and governance operating models in Chapter 5; organisation design in Chapter 7 (as analysis, see below); leadership in Chapters 1–4; career progression in Chapter 11. |
| Part XI Chapter 2 | *“organisation design is Part XII's territory and is not a Quality Engineering decision.”* | Chapter 7 delivers the analysis; the second clause is preserved — Part XII does not convert organisation design into a Quality Engineering decision. |
| Part XI Chapters 10 and 11 | *“Part XII territory for any ownership transfer”*; *“Designing the organisation is Part XII's”*; *“an organisational change (Part XII's to design).”* | Chapter 7 delivers ownership-transfer reasoning: its evidence gate, risk profile, and reversibility. |
| Part XI Chapter 5 | Ownership boundary is *“Organisational, not technical (Part XII).”* | Chapter 5's ownership model addresses it. |
| Part XI Chapter 12 | *“Part XII may use the portfolio as a communication-and-influence artefact; it does not convert the capstone into leadership/governance instruction.”* | Honoured as written: the Part XI portfolio is used as input to Chapters 2 and 12, and Part XI's capstone is not re-taught. |

**Resolving the wording “Part XII's territory to design.”** Part XI's phrasing, read literally, would make Part XII an organisation-design curriculum. That is not what Part XII delivers and would contradict its own Quality-Engineering specificity. The accurate statement of the boundary is:

> Part XII owns the **quality-engineering analysis of organisational design, decision rights, and governance arrangements, and of their consequences for achievable quality outcomes**. It does not own universal organisation-design prescription, and it does not teach a reader to restructure a company.

Under that reading every deferral above is honoured: the reader learns to reason about an ownership transfer, a governance arrangement, or a structural constraint — including what evidence would justify one and what risk it carries — without being handed a reorganisation playbook. **Part XII does not modify Part XI's published text**; this paragraph records how the deferral is discharged.

---

## Learning Outcomes

After completing the planned manuscript and exercises, readers should be able to:

- distinguish influence from authority, and contribute to a decision they do not own without either overstepping or disengaging;
- identify the actual decision owner and audience for a piece of quality evidence, and state what that audience needs in order to decide well;
- translate technical evidence for a non-specialist audience without losing its limitations, and recognise which parts do not survive summarisation;
- write durable records — briefs, decision records, incident write-ups, handovers — that remain challengeable after the author has left the context;
- raise disagreement proportionately, escalate on a stated condition rather than on frustration, and record an unheeded concern without either dramatising or abandoning it;
- describe ownership models, decision rights, policy ownership, and quality operating models, and identify accountability gaps such as a fact nobody owns or a signal nobody is responsible for noticing;
- distinguish consulting, recommending, approving, and executing a decision, and say which of those a Quality Engineer is doing in a given situation;
- state a quality-culture claim as a bounded, evidenced proposition, and say what culture evidence cannot establish;
- explain how organisation structure constrains achievable quality outcomes, using Conway-style reasoning without treating it as a law;
- analyse the quality consequences of an organisational change — including an ownership transfer — by naming its evidence gate, coordination cost, knowledge-concentration risk, and reversibility, without prescribing a restructuring;
- mentor by transferring reasoning rather than answers, and assess capability growth without reducing a person to a metric;
- select practice measures that are safe at team level, explain why individual-level productivity metrics are hazardous, trace a measure through the chain from measurement to decision, and recognise measure-becomes-target failure;
- identify a case where the arithmetic is correct and the conclusion drawn from it is not;
- plan a practice change with adoption evidence, a reversibility condition, and an honest account of what would show it had not helped; and
- produce a Quality Leadership and Career Strategy Portfolio that states capability with evidence, names its limitations, and makes no claim about outcomes the reader does not control.

---

## Curriculum Design Decision

### Recommended architecture: 12 chapters

The recommended architecture contains **12 chapters**. This is not a mechanical reuse of the Part IX–XI count. It separates four **influence** capabilities (leadership framing, communication, durable records, disagreement), four **organisational** capabilities (decision rights, culture, structure, mentoring), two **practice-measurement** capabilities (measuring, changing), one **career** capability, and one capstone.

Merging them would lose distinctions the part exists to teach. Communicating in a meeting and writing a record that survives the author are different skills with different failure modes. Culture and structure are routinely conflated, and separating them is what makes either actionable. Measuring practice and changing practice fail for different reasons — the first through corrupted measures, the second through unevidenced adoption. And career growth belongs at the end precisely because it should be the *consequence* of the preceding capabilities rather than a topic in its own right.

| Stage | Chapters | Central question | Cumulative learner output |
| --- | --- | --- | --- |
| Make evidence land | 1–4 | Who owns this decision, what do they need, and how does my evidence reach them intact? | Influence and Decision-Owner Map; Evidence Translation Record; Durable Decision Record; Disagreement and Escalation Record |
| Build organisational capability | 5–8 | What does this organisation make easy, hard, or impossible to decide well — and who grows next? | Ownership and Accountability Model; Quality-Culture Claim Set; Structure and Constraint Assessment; Capability Growth Plan |
| Measure and change practice | 9–10 | What can be measured safely, and what evidence would show a change actually helped? | Practice Measurement Plan; Practice Change and Adoption Strategy |
| Synthesize a career and a contribution | 11–12 | What can I evidence about my own capability, and what remains outside my control? | Career Evidence and Development Record; Quality Leadership and Career Strategy Portfolio |

### Central MSQE Quality Influence and Decision Model

Part XII will use the following **MSQE teaching model**, not an industry standard, competency framework, maturity model, or scoring system:

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

The model is directional and, as in Part XI, its main teaching value is **backward traversal**. When a well-founded recommendation is ignored, engineers usually re-examine the evidence. The model directs attention elsewhere first: to the decision owner (was the right person ever addressed?), the audience (was the constraint they actually face ever acknowledged?), and the communication choice (did the limitation survive, or did summarisation turn a bounded claim into an overclaim that a reasonable person discounted?).

**Most quality evidence fails at the audience and communication steps, not at the evidence step.** A Quality Engineer who only ever strengthens the evidence in response to being ignored is optimising the one element that was probably not the problem.

The model does not guarantee influence. Organisations decline good recommendations for reasons that are sometimes sound, sometimes political, and sometimes simply about money. What the model prevents is the specific failure of concluding that a decision was wrong because it disagreed with you.

### Relationship to the Part XI model

The handbook now contains two twelve-element MSQE reasoning models with deliberately overlapping vocabulary. They operate at different decision layers and neither replaces the other.

| | **MSQE Architecture Decision Reasoning Model** (Part XI) | **MSQE Quality Influence and Decision Model** (Part XII) |
| --- | --- | --- |
| Reasons about | Which architectural option is defensible under incomplete evidence | How quality evidence survives translation into an organisational decision |
| Distinctive elements | ARCHITECTURAL OPTION, FAILURE MODE, TRADE-OFF | DECISION OWNER, AUDIENCE, COMMUNICATION CHOICE, RESPONSE |
| Backward traversal diagnoses | Which assumption or decision needs revising after an observed failure | Why a well-founded recommendation did not reach or move the person who owns the decision |
| Terminates at | OWNER — naming who is accountable | REVISION TRIGGER — after the decision has been made by that owner |

Part XI's model stops where Part XII's becomes useful: at the moment the accountable owner is named. Where both apply — a learner carrying an architecture recommendation into an organisational decision — Part XI's model produces the content and Part XII's governs how it travels. **Part XII does not supersede, replace, or extend Part XI's model**, and no chapter will restate Part XI's architecture reasoning under a new name.

### Authority discipline

This discipline governs the whole part and every chapter will restate it where relevant.

**Influence is not authority.** A Quality Engineer contributes analysis, evidence, framing, limitation language, and options. An accountable owner — architecture, product, delivery, release, security, operational, engineering-management, or commercial — decides. Part XII teaches the reader to make a decision *better informed*, not to make it themselves or to route around the person who owns it.

Three specific things Part XII will therefore **not** teach:

- **How to get your way.** Techniques whose purpose is winning rather than informing are excluded. Where the manuscript describes framing or audience adaptation, it does so to reduce translation loss, not to increase compliance.
- **That a rejected recommendation is a failure.** A recommendation can be correct, well communicated, and correctly declined on grounds the Quality Engineer did not own — cost, timing, commercial commitment, or a competing risk. Part XII teaches how to record that outcome and its revision trigger, not how to relitigate it.
- **That seniority confers correctness.** Part XII will not assign authority by title in either direction: neither deferring to a title in place of evidence, nor treating a Quality Engineer's evidence as automatically overriding an accountable owner's judgement.

### Evidence discipline in soft domains

This is the discipline most likely to be violated and is the single greatest quality risk in the part.

Parts III–XI taught readers to bound a claim, name its population, and state what the evidence cannot establish. Those habits were formed in domains with relatively tractable measurement — latency distributions, contract compatibility, dependency direction. **Part XII operates in domains where measurement is far weaker: culture, capability, morale, influence, productivity, and career progression.**

The hazard is importing the confidence of a latency measurement into a culture claim. The manuscript will therefore hold three rules:

- **State the evidence class.** Part XII will distinguish *measured* evidence (a deployment count over a defined window), *observed* evidence (what happened in three retrospectives), *reported* evidence (what people said in a survey), and *inferred* evidence (what a structure makes likely). These carry different weight and are not interchangeable.
- **Never present a soft claim in hard language.** “Our culture is blameless” is not a claim; “no incident review in the last twelve months named an individual as a cause, across eleven reviews” is one, with a stated population and a stated limitation.
- **A number can still be weak evidence.** Numeric form confers precision, not strength. A percentage computed from a poorly defined denominator, a count of something that was never validated as a measure of the attribute it is used for, or a rate over a population that changed mid-window is weak evidence displayed in strong clothing. Part XII will treat *numeric appearance* and *evidential strength* as independent properties, and will require the second to be argued rather than inferred from the first.
- **Say when nothing can be established.** Some things a handbook reader will want to claim — that their mentoring caused someone's growth, that a practice change improved quality, that a team's culture is healthy — cannot be established at the confidence the claim implies. Part XII will say so plainly rather than supplying a proxy that looks rigorous.

**Classifying edge cases.** The four classes are a teaching aid, not an epistemology, and the manuscript will resolve the common ambiguities with a stated tie-break rule rather than leaving them to the drafter:

| Case | Classification | Rule |
| --- | --- | --- |
| A survey | **Both, separately.** Response counts and rates are *measured*; what respondents said is *reported*. | Classify the instrument and its content separately; never let a measured response rate lend its precision to the reported content. |
| An interview or a retrospective comment | *Reported* | A person's account is reported evidence regardless of how confidently it is expressed. |
| Repository or tooling activity | *Measured* — about **activity** | It is measured evidence about what was recorded, not about intent, quality, effort, or causality. Name the attribute the measure actually covers. |
| Observation by a Quality Engineer participating in the work | *Observed*, with a participant-observer limitation | Record that the observer was inside the system observed and may have influenced it. |
| A pattern seen repeatedly | *Inferred* | Repetition strengthens an inference; it does not convert inference into direct evidence. The class does not change with the count. |

The tie-break, where a case is genuinely ambiguous, is to **classify it as the weaker class and state why**.

### Career-claim discipline

Part XII discusses careers, and careers are where instructional material most often overclaims.

- **A handbook cannot promise an outcome.** Promotion, title, compensation, and role availability depend on organisational context, market conditions, timing, and other people's decisions. Part XII will describe capability and evidence, not results.
- **Role titles are not portable.** “Senior”, “Staff”, “Principal”, “QE”, “SDET”, and “Test Architect” denote different things in different organisations. Part XII will reason about *capabilities* and *evidence of them*, and will treat any specific progression ladder as an organisational artefact rather than a standard.
- **The portfolio is evidence, not a claim of seniority.** The capstone produces something a reader can show and defend. It does not certify a level, and the manuscript will say so.

---

## Atlas Commerce Organisational Baseline

Part XII continues **Atlas Commerce**, the fictional commerce platform used since Part I, but shifts the lens from the system to the organisation around it. It is an educational baseline, not a claim about a real company or a recommended operating model.

| Area | Stable teaching baseline |
| --- | --- |
| Team | A single engineering team of four engineers owns all eight Atlas responsibilities. Two have never operated a message broker. There is no second team, and no second team is funded. |
| Named roles | Order-domain owner, payment-domain owner, catalogue domain owner, platform owner, delivery owner, release authority, security owner, engineering director, and a commercial manager outside engineering. These are **roles carrying accountability**, not necessarily distinct people or job titles. |
| Adjacent functions | Support operators, a finance function running nightly reconciliation, merchandising operators, and an external partner logistics integration. |
| Inherited conditions | Part XI left real organisational residue: a fourteen-month dual-write whose shim has no owner; a finance reconciliation error that went unnoticed for four days because no one owned noticing; a consumer inventory that has never been completed; and several decisions deliberately left open with named owners. |
| Canonical statement of the unowned shim | **The temporary dual-write shim's original author is no longer with the team, and no successor owner was assigned.** Part XII uses this wording exactly and does not elaborate on how or why the author left, because Part XI does not establish it consistently. The teaching point is the unassigned succession, not the departure. |
| Evidence | All records, measurements, retrospectives, reviews, conversations, and survey results are synthetic and clearly labelled. No real person, team, performance record, or organisation is described. |
| Decision ownership | The Quality Engineer contributes analysis, evidence, and options. Named accountable owners decide. No chapter will resolve an Atlas decision by the Quality Engineer overriding an owner. |

The baseline deliberately supplies recurring organisational tensions: evidence that reaches the wrong audience; a correct recommendation declined for a sound commercial reason; a concern raised once and not recorded; an ownership gap that is nobody's fault and everybody's problem; a capability concentrated in one person; a metric that improves while the outcome worsens; a practice change adopted in name only; and a career decision between depth and breadth with no correct answer.

**One firm constraint on Atlas in Part XII:** no scenario will depict a named individual as incompetent, negligent, or a performance problem. Organisational failures in this part are failures of ownership, structure, communication, and evidence — which is both more accurate and safer as teaching material.

---

## Proposed Chapter Architecture

Every future chapter will use the approved MSQE chapter template, clearly label Atlas Commerce scenarios as illustrative, define specialised terms at first meaningful use, distinguish standards and research from MSQE teaching models, state limitations, and include a practical exercise, references, and a checklist. The following architecture defines scope; it is not manuscript prose.

### Chapter 1 — Engineering Leadership as Quality Engineering

- **Mission:** Establish leadership as influence exercised without authority, and locate the Quality Engineer's contribution precisely in the gap every earlier part stopped at.
- **Core concepts:** Influence, authority, accountability, decision owner, audience, stakeholder concern, contribution boundary, evidence class, limitation, residual risk, revision trigger; the MSQE Quality Influence and Decision Model; the authority discipline.
- **Illustrative Atlas scenario:** The Part XI checkout/fulfilment recommendation was delivered, technically sound, and quietly not acted on. Nobody disagreed with it; nothing happened.
- **QA → QE transition:** From “my analysis was correct” to identifying the decision, its owner, the constraint that owner actually faces, and what the evidence needed to become usable.
- **Worked reasoning:** Traverse the model backwards from the unacted recommendation. Show that the evidence was sound and that the failure was in audience identification and communication choice.
- **Professional artifact:** Influence and Decision-Owner Map.
- **Prerequisites:** Parts I and XI; Parts III and X recommended.
- **Explicit exclusions:** No leadership-style taxonomy, management theory survey, persuasion technique, or claim that a Quality Engineer should own the decision.
- **Handoff:** Supplies the model, vocabulary, and authority discipline used by every later chapter.

### Chapter 2 — Communicating Quality Evidence to Decision Owners

- **Mission:** Teach evidence to survive translation — across audience, format, and summarisation — without losing the limitations that make it honest.
- **Core concepts:** Audience analysis, decision-relevance, translation loss, summarisation risk, framing, overclaim and underclaim, uncertainty language, executive summary, the “so what” gap, and hostile-audience versus uninterested-audience failure modes.
- **Illustrative Atlas scenario:** A performance finding and a security finding from Part X reach the engineering director as a single slide. The limitation that made both bounded has been summarised away, and the director reasonably discounts the whole thing.
- **QA → QE transition:** From reporting complete technical accuracy to delivering the decision-relevant subset with its limitations intact.
- **Worked reasoning:** Take one Part X finding and produce three renderings — engineer, delivery owner, engineering director — showing what each keeps, what each drops, and which drop is a defect rather than a simplification.
- **Professional artifact:** Evidence Translation Record.
- **Prerequisites:** Chapter 1; Parts III, X, and XI recommended.
- **Explicit exclusions:** No presentation-skills training, slide-design instruction, storytelling framework, or negotiation technique.
- **Handoff:** Supplies the communication discipline used by disagreement, culture claims, measurement reporting, and the capstone.

### Chapter 3 — Written Records, Technical Writing, and Organisational Memory

- **Mission:** Show that a durable written record is an engineering artefact whose purpose is future challengeability, not present persuasion.
- **Core concepts:** Decision record, brief, incident write-up, handover, runbook rationale, **design rationale reconstructed and recorded after the fact**,[^parnas] assumption capture, provenance, staleness, temporal validity, orphaned artefact, discoverability, ownership of a record, records that become misleading after the system changes, and the difference between a document that exists and one that is used.
- **Illustrative Atlas scenario:** The fourteen-month dual-write. Its author wrote no record of why the shim existed or what would remove it. The shim's original author is no longer with the team and no successor owner was assigned, so the shim became permanent because nobody could establish its purpose.
- **QA → QE transition:** From documenting what was done to recording what was decided, on what evidence, under what assumption, and what would trigger revisiting it.
- **Worked reasoning:** Compare two records of the same Atlas decision — one that captures conclusion only, one that captures assumption, evidence class, limitation, owner, and revision trigger. Show which one is still usable eighteen months later and why.
- **Professional artifact:** Durable Decision Record.
- **Prerequisites:** Chapters 1–2; Part XI ADR treatment.
- **Explicit exclusions:** No documentation-platform tutorial, mandated template, wiki-governance process, or claim that a record proves a decision was good.
- **Handoff:** Supplies the record discipline used by escalation, ownership models, practice change, and the capstone portfolio.

**Rationale-source treatment:** Chapter 3's central claim — that the reasoning behind a decision must be reconstructed and recorded for future readers even though the work did not proceed in that order — will be attributed to Parnas and Clements.[^parnas] Part XII uses it for the *rationale-recording* argument only, not as a software design method. Parnas is already an established source in Part XI, so this is continuity rather than a new authority. The chapter distinguishes itself from Part XI's ADR material by treating durability, staleness, ownership, and discoverability of a record rather than the architectural content inside it.

### Chapter 4 — Disagreement, Escalation, and Recording an Unheeded Concern

- **Mission:** Teach productive disagreement as an evidence practice with proportionate stopping points, rather than as either capitulation or conflict.
- **Core concepts:** Disagree-and-commit, escalation condition, escalation path, proportionality, psychological safety, dissent record, unheeded concern, the difference between a risk owner declining and a risk being unowned, and when a concern is genuinely closed.
- **Illustrative Atlas scenario:** A Quality Engineer raises the incomplete consumer inventory before a contract change. The delivery owner accepts the risk to hit the campaign window. The change ships; the concern is not written down.
- **QA → QE transition:** From either escalating everything or accepting everything to defining in advance what would justify escalation, to whom, and what record remains if the concern is declined.
- **Worked reasoning:** Work the scenario through three legitimate outcomes — concern addressed, concern declined with the risk explicitly owned, concern declined with nobody owning the risk — and show that only the third justifies escalation.
- **Professional artifact:** Disagreement and Escalation Record.
- **Prerequisites:** Chapters 1–3.
- **Explicit exclusions:** No grievance procedure, whistleblowing guidance, conflict-resolution counselling, legal advice, or instruction on when to resign.
- **Handoff:** Supplies the dissent and ownership vocabulary used by accountability models and culture claims.

**Psychological-safety treatment:** Chapter 4 will introduce psychological safety narrowly and with attribution, as a researched team-level construct concerning whether members can raise concerns without adverse consequence.[^edmondson] It will not present it as a management programme, a survey instrument, or something a Quality Engineer can unilaterally create; and it will state that the construct is measured at team level and does not license claims about an individual's experience.

**Personal risk in escalation — required statement.** Chapter 4 will state plainly that raising, recording, or escalating an unheeded concern **may carry personal or organisational consequences**, and that those consequences vary by organisation, role, jurisdiction, context, and the seriousness of the issue. A chapter that teaches a reader to document dissent while implying the act is always cost-free would be dishonest.

The statement is bounded to that acknowledgement. Part XII provides **no legal advice, employment advice, whistleblowing guidance, grievance guidance, or resignation guidance**, and will say so in the same place. Its purpose is honesty about a limitation, not expansion into a legal or HR curriculum, and the chapter will direct a reader facing a serious situation to appropriate professional advice rather than attempting to supply it.

### Chapter 5 — Decision Rights, Ownership Models, Governance Operating Models, and Accountability

- **Mission:** Make ownership and decision rights explicit enough that a gap becomes visible before it produces an incident, and make the surrounding governance arrangement something a Quality Engineer can reason about rather than merely endure.
- **Core concepts:** Decision right, accountability, responsibility, the **consult / recommend / approve / execute** distinction, informed party, ownership gap, orphaned artefact, the unowned signal, **policy ownership**, **governance operating model**, escalation path, ownership of a *fact* versus ownership of a *component*, and the distinction between who decides and who is affected.
- **Illustrative Atlas scenario:** The finance reconciliation error that ran for four days. Every component had an owner; the *signal* had none, and no assignment of code ownership would have caught it. Atlas has no stated policy owner for reconciliation correctness and no stated escalation path for a silent failure.
- **QA → QE transition:** From escalating to “the team” to identifying the accountable role for a specific decision, fact, signal, or policy — and naming the gap when none exists.
- **Worked reasoning:** Build an ownership model for one Atlas quality outcome. Distinguish owned components, owned facts, owned signals, owned policies, and unowned residue; state for each whether the Quality Engineer consults, recommends, approves, or executes; propose the smallest assignment that closes the most consequential gap.
- **Professional artifact:** Ownership and Accountability Model.
- **Prerequisites:** Chapters 1–4; Parts VI, VIII, IX, X, and XI recommended.
- **Explicit exclusions:** No RACI-as-doctrine, reporting-line design, headcount planning, job-description writing, performance management, universal governance framework, or governance maturity model.
- **Handoff:** Supplies the accountability and governance vocabulary used by structure, measurement, and the capstone. Discharges the governance-depth, decision-rights, and policy-ownership deferrals from Parts IX, X, and XI.

**Governance operating models — bounded treatment.** Chapter 5 will describe how quality responsibility is commonly arranged, so that a reader can recognise the arrangement they are in and reason about its consequences:

| Arrangement | Where quality capability sits | Typical consequence a Quality Engineer must reason about |
| --- | --- | --- |
| **Centralised** | A separate quality function owning standards and sign-off | Consistency and specialist depth; a handoff boundary, queueing, and quality treated as someone else's responsibility |
| **Embedded** | Quality engineers inside delivery teams | Context and speed; divergence between teams and isolation of the specialist |
| **Federated** | Embedded practitioners with a shared community and common standards | Coordination without a bottleneck; requires deliberate maintenance and can decay into neither model |
| **Enabling** | A small group building capability in others rather than doing the work | Leverage and durability; slow to show effect and easy to defund |

Four firm constraints on this material. It is a **descriptive vocabulary, not a recommendation** — Part XII will not name a best model, because the right arrangement depends on organisation size, risk profile, regulatory context, and capability distribution. It will not present the arrangements as a **maturity ladder**; enabling is not more advanced than embedded. It will not produce a **governance score, index, or assessment instrument**. And it will not teach a reader to **implement** a governance arrangement — the reader analyses the one they have, and contributes evidence to whoever owns changing it.

Alongside this, the chapter will treat **policy ownership** narrowly: who owns a stated quality rule, who may grant an exception, whether exceptions are recorded, and what happens to a policy nobody owns. It will explicitly resist the assumption that **every decision needs exactly one owner** — some decisions are legitimately shared, and the failure mode Part XII cares about is a decision, fact, or signal with *no* owner, not one with more than one.

### Chapter 6 — Quality Culture: Claims, Evidence, and Limits

- **Mission:** Turn the most-asserted and least-evidenced topic in engineering into a set of bounded claims a reader can actually support or reject.
- **Core concepts:** Culture as observable behaviour rather than stated value; blameless review; information flow; evidence classes (measured, observed, reported, inferred); survey limitations; response bias; the gap between espoused and enacted practice; and what culture evidence cannot establish.
- **Illustrative Atlas scenario:** Atlas states that its incident reviews are blameless. Eleven synthetic review records are available, three retrospective observations, and one small survey with a partial response rate. The learner must say what can and cannot be claimed.
- **QA → QE transition:** From asserting that a culture is good or bad to stating a bounded culture claim with a population, an evidence class, and an explicit limitation.
- **Worked reasoning:** Convert three vague culture assertions into bounded claims; classify the available evidence; and identify the one assertion that cannot be evidenced at all with what exists.
- **Professional artifact:** Quality-Culture Claim Set.
- **Prerequisites:** Chapters 1–5; Part VIII incident-learning concepts recommended.
- **Explicit exclusions:** No culture-change programme, engagement-survey instrument, organisational-psychology curriculum, or maturity model.
- **Handoff:** Supplies the soft-evidence discipline used by measurement, mentoring, and the capstone.

**Culture-typology treatment:** Chapter 6 will reference Westrum's organisational typology — pathological, bureaucratic, and generative — as a researched framing for how organisations handle information, with attribution and bounded use.[^westrum] It will not present the typology as a diagnostic instrument, a score, or something a Quality Engineer can assign to their own organisation from the inside without evidence.

### Chapter 7 — Organisation Structure and Its Quality Consequences

- **Mission:** Explain how structure constrains achievable quality outcomes, so a reader can identify which problems are structural and stop attacking them as technical ones.
- **Core concepts:** Conway-style correspondence between communication structure and system structure; team boundaries versus system boundaries; communication boundaries; cognitive load; handoff and coordination cost; the cross-team change; bottlenecks; knowledge concentration; **quality capability placement — specialist centralisation versus embedding**; service and team boundary consequences; **ownership-transfer reasoning**; and structural problems misdiagnosed as skill or effort problems.
- **Illustrative Atlas scenario:** Atlas's four engineers own eight responsibilities. Part XI recommended options whose operational cost the team could not carry, and repeatedly noted that one option *“realistically invites a second team”* while declining to reason about what that would cost. That is a structural constraint, and no architecture choice removes it.
- **QA → QE transition:** From proposing a technical fix for a coordination problem to identifying the structural condition producing it, and naming what a Quality Engineer can and cannot change about it.
- **Worked reasoning:** Take two Atlas problems — one genuinely technical, one structural presenting as technical — and show what distinguishes them and what each requires. Then analyse the deferred ownership transfer: what evidence would show the receiving group can operate the responsibility, what coordination cost the transfer creates, what knowledge concentration it relieves or worsens, and how reversible it is.
- **Professional artifact:** Structure and Constraint Assessment.
- **Prerequisites:** Chapters 1–6; Part XI Chapter 2 boundary vocabulary; Part XI Chapters 10–11 for the deferred ownership transfer.
- **Explicit exclusions:** No organisation redesign or restructuring playbook, team-topology prescription, headcount design, reorganisation programme, org chart, generic consulting framework, or claim that a Quality Engineer should reorganise a company.
- **Handoff:** Supplies the structural constraint vocabulary used by capability growth, practice change, and the capstone. Discharges the organisation-design and ownership-transfer deferrals from Parts V and XI.

**Conway treatment:** Chapter 7 will use Conway's observation as a **diagnostic tendency, not a law**,[^conway] consistent with the treatment already established in Part XI Chapter 2. It will not present the inverse manoeuvre — restructuring teams to force an architecture — as a Quality Engineering action.

**Organisation design — analysis, not prescription.** Chapter 7 delivers what Parts V and XI deferred here, under a boundary that keeps it Quality Engineering. The reader learns to **analyse the quality consequences** of a structural arrangement or a proposed organisational change: what it makes cheap, what it makes expensive, which feedback loop it lengthens, which knowledge it concentrates, which boundary it creates, and what evidence would show it helped.

The reader does **not** learn to design an organisation. Part XI Chapter 2 states that organisation design *“is not a Quality Engineering decision,”* and Part XII preserves that. The distinction the chapter must hold is between:

| Part XII teaches | Part XII does not teach |
| --- | --- |
| *“Transferring fulfilment ownership would relieve this team's cognitive load and create a new cross-team boundary on the payment path; here is what evidence would show the receiving group can operate it, and here is what becomes harder.”* | *“Split into two teams organised this way.”* |

**Ownership transfer as an analysable change.** Part XI Chapter 10 records that ownership transfer *“is frequently the least reversible step in the plan”* and hands the design of it to Part XII. Chapter 7 treats a transfer as a change with an evidence gate (can the receiving group operate this, demonstrated how?), a risk profile, a coordination cost, and a reversibility condition — the same analytical frame Chapter 10 applies to practice change. It does not supply a transfer procedure, a target structure, or a staffing plan.

### Chapter 8 — Mentoring and Growing Quality Reasoning in Others

- **Mission:** Treat capability transfer as the mechanism by which quality reasoning outlives any individual, and teach it as reasoning transfer rather than answer supply.
- **Core concepts:** Mentoring versus coaching versus reviewing versus sponsorship; transferring reasoning rather than conclusions; making expert reasoning visible; supported practice and fading guidance;[^cognitive-apprenticeship] question design; feedback that is specific and evidence-linked; capability concentration and bus factor; deliberate under-specification; **power asymmetry**; and the limits of what a mentor can claim to have caused.
- **Illustrative Atlas scenario:** One Atlas engineer holds all the payment-reconciliation knowledge. Every incident routes to them, which looks like reliability and is actually a single point of organisational failure.
- **QA → QE transition:** From answering a colleague's question correctly to designing the exchange so the colleague can answer the next one without you.
- **Worked reasoning:** Compare two mentoring exchanges on the same Atlas problem — one supplying the answer, one supplying the reasoning path — and assess what capability each leaves behind and what neither can prove.
- **Professional artifact:** Capability Growth Plan.
- **Prerequisites:** Chapters 1–7.
- **Explicit exclusions:** No people management, performance review, coaching certification, HR development framework, hiring practice, psychometric instrument, or therapeutic or counselling practice.
- **Handoff:** Supplies capability evidence used by measurement, career reasoning, and the capstone.

**Power asymmetry — required treatment.** Mentoring is not a conversation between equals, and a chapter that ignores this produces the failure it intends to prevent. Chapter 8 will state explicitly that:

- **seniority does not prove correctness** — the mentor's reasoning is evidence, not authority, and is subject to the same claim-and-limitation discipline as everything else in this handbook;
- **mentors are sometimes wrong**, and a mentee who has learned to defer rather than to reason has been taught the opposite of the intended lesson;
- **mentees should be actively invited to challenge the reasoning**, and a mentor who is never challenged should treat that as a signal about the relationship rather than as confirmation;
- **the goal is transferable judgement, not a copy of the mentor** — reasoning style, tooling preference, and temperament are not the payload; and
- **the asymmetry can suppress disagreement**, which connects directly to Chapter 4: a mentoring relationship can quietly become one of the places where a concern goes unraised.

Preserved boundaries: **mentoring ≠ management**, **mentoring ≠ performance review**, **mentoring ≠ therapy**. The chapter assesses capability growth, never a person, and produces no record that evaluates a named individual.

**Capability-transfer source:** the chapter's central claim — that expertise transfers by making expert reasoning visible, then supporting practice and fading that support — will be attributed to the cognitive-apprenticeship literature[^cognitive-apprenticeship] and used narrowly for that mechanism. Part XII will not import an instructional-design curriculum, a learning-styles model, or a pedagogy framework alongside it.

### Chapter 9 — Measuring Engineering and Quality Practice

- **Mission:** Teach which practice measures are safe, at what level, and why measuring people is a distinct and serious hazard.
- **Core concepts:** **Construct validity** — whether a measure measures the attribute it is claimed to measure;[^kaner-bond] team-level versus individual-level measurement; the measurement-to-decision chain below; leading and lagging indicators; delivery-performance measures and their bounded interpretation; proxy risk; measure-becomes-target failure; gaming and displacement; the multi-dimensional principle; and measures that are diagnostic but not evaluative.
- **Illustrative Atlas scenario:** Atlas proposes tracking defects-found-per-engineer to “improve quality”. The learner must show what the measure would do to behaviour, whose behaviour, and what it would stop revealing.
- **QA → QE transition:** From reporting quality metrics to judging whether a measure is valid for the attribute claimed, safe to collect, at what level, for what decision, and what it will corrupt if it becomes a target.
- **Worked reasoning:** Assess four candidate Atlas measures against construct validity, level, decision relevance, gaming surface, and displacement risk. Reject at least one outright and bound the rest. Separately, work the aggregation example from the numerical strategy, where the arithmetic is correct and the conclusion is not.
- **Professional artifact:** Practice Measurement Plan.
- **Prerequisites:** Chapters 1–8; **Part I Chapter 7** for the Goodhart treatment; **Part XI Chapter 9** for fitness functions and the measure-becomes-target risk.
- **Explicit exclusions:** No metrics programme design, dashboard implementation, maturity model, cross-organisation benchmarking, or individual performance measurement.
- **Handoff:** Supplies measurement discipline used by practice change, career evidence, and the capstone.

**Required terminology chain.** Chapter 9 will teach the following chain explicitly, because most measurement failures are a silent change of role rather than a wrong number:

```text
MEASUREMENT
  → INDICATOR
  → PROXY
  → TARGET
  → EVIDENCE
  → INFERENCE
  → DECISION
```

| Step | Definition used in Part XII |
| --- | --- |
| **Measurement** | A recorded quantity with a defined unit, population, and window. It is a fact about what was counted. |
| **Indicator** | A measurement selected because it is believed to say something about a condition of interest. Selection is a judgement, not a property of the number. |
| **Proxy** | An indicator standing in for an attribute it does not directly measure. Every proxy carries a validity claim that is usually unstated. |
| **Target** | A proxy that behaviour is now expected to move. At this step the measure begins to change the thing it measures. |
| **Evidence** | A measurement or observation offered in support of a specific claim, with its population, limitation, and class stated. |
| **Inference** | The step from evidence to conclusion. **This is where most measurement failures happen, and it is invisible unless it is written down.** |
| **Decision** | The action taken by the accountable owner, which the inference informs but does not determine. |

Learners will be required to **identify where a measure changes role**. The worked example is deployment frequency: a legitimate *measurement* of deployments in a window; used as an *indicator* of delivery flow; treated improperly as a *proxy* for productivity; converted into a *target* by a mandate; then presented as *evidence* that a team improved — an *inference* the measurement cannot support, because deployment count says nothing about the value or quality of what was deployed. Naming the step at which the chain broke is the chapter's core skill.

**Measurement-source treatment.** Chapter 9 rests on three source types with different authority. **Construct validity** — the question of whether a metric measures the attribute claimed — is grounded in Kaner and Bond, who argue that few software attributes are simple enough to be measured directly and that all metrics therefore require validation; their worked critique of bug counts applies directly to the defects-per-engineer scenario.[^kaner-bond] **Delivery-performance measures and the SPACE framing** are cited as applied practitioner research with explicit bounds: validated at team or organisation level, correlational rather than causal, widely misapplied to individuals, and cautioned by their own authors against single-metric reduction.[^space][^dora] **The measure-becomes-target hazard** is treated as a predictable effect rather than a misuse, following Strathern,[^strathern] and connected to the handbook's existing Goodhart treatment in Part I Chapter 7, which qualifies Goodhart's law as a cautionary heuristic originating in monetary policy rather than a scientific law proving every target harmful.[^goodhart] Part XII does not restate or extend that qualification.

Part XII will not present any measure set as a maturity score or a benchmark.

**DORA currency control.** DORA's model has changed over time — both the number of metrics and their names — so Part XII pins every reference to a dated source rather than to a moving URL. As of the DORA guide accessed 2026-08-14, the model comprises **five** metrics: *change lead time*, *deployment frequency*, *failed deployment recovery time*, *change fail rate*, and *deployment rework rate*.[^dora-metrics] Earlier terminology, including *mean time to restore* and *time to restore service*, has been superseded by *failed deployment recovery time*.

Three constraints follow. The manuscript will **attach the source date wherever a metric list is given**, because the list is a moving target. It will **verify current terminology against official DORA material at drafting time** rather than reproducing this list unchecked. And it will **not use DORA as a universal scorecard** — a position DORA's own guidance supports, since that guidance warns against single-metric focus, against comparing metrics across dissimilar applications, and against isolating teams with specific metrics, and explicitly invokes Goodhart's law when cautioning against mandates that invite gaming.

### Chapter 10 — Changing Practice: Adoption, Evidence, and Reversibility

- **Mission:** Apply the handbook's evidence and reversibility discipline to organisational change, where both are usually absent.
- **Core concepts:** Practice change as a bounded proposal; **adoption as a social process distinct from mandate and compliance**;[^rogers] pilot scope; adoption evidence; the change that improved a measure and not the outcome; reversibility and the cost of reverting a practice; temporary process debt; ownership of a practice after rollout; and the decommissioning of a practice nobody needs.
- **Illustrative Atlas scenario:** A mandated review checklist is introduced after an incident. Compliance reaches 100% within a month; the failure class it targeted recurs.
- **QA → QE transition:** From proposing a better practice to specifying what adoption would look like, what evidence would show it helped, and what would trigger reverting it.
- **Worked reasoning:** Build a change plan for one Atlas practice with a pilot boundary, adoption evidence, a disconfirming observation, a reversibility condition, and a named owner — then state honestly what could not be attributed to the change.
- **Professional artifact:** Practice Change and Adoption Strategy.
- **Prerequisites:** Chapters 1–9; Part XI Chapter 10 reversibility treatment.
- **Explicit exclusions:** No transformation methodology, agile-framework adoption, tool procurement, change-management certification, or claim that a practice change caused an outcome without evidence.
- **Handoff:** Supplies the change and adoption reasoning used by the capstone.

**Adoption-source treatment:** the chapter's central distinction — that adoption is a social process that a mandate can compel compliance with but not substitute for — will be attributed to the diffusion-of-innovations literature[^rogers] and used **narrowly for that distinction only**. Part XII will not import adopter categories as a personality taxonomy, will not use them to label colleagues, and will not present diffusion as a change-management methodology.

### Chapter 11 — Career Growth as an Evidence-Led Practice

- **Mission:** Apply the same claim-and-evidence discipline to the reader's own capability, without promising outcomes the reader does not control.
- **Core concepts:** Capability versus title; evidence of capability; portfolio; depth and breadth trade-offs; the individual-contributor and management paths as different work rather than a ladder; feedback as evidence; self-assessment bias; visibility versus substance; and what a career plan cannot control.
- **Illustrative Atlas scenario:** Two Atlas engineers with comparable capability face different opportunities. One has an evidenced record of contribution; one has equivalent work that nobody outside the team can see.
- **QA → QE transition:** From listing tools, tenure, and job titles to stating bounded capability claims backed by inspectable evidence, with limitations and a revision trigger.
- **Worked reasoning:** Convert three résumé-style assertions into evidenced capability claims; identify which cannot be evidenced; and separate what the reader controls from what they do not.
- **Professional artifact:** Career Evidence and Development Record.
- **Prerequisites:** Chapters 1–10.
- **Explicit exclusions:** No promotion guarantee, salary guidance, CV or LinkedIn service, interview coaching, certification recommendation, or claim that following the part produces a specific role.
- **Handoff:** Supplies the personal evidence half of the capstone portfolio.

### Chapter 12 — Capstone: Quality Leadership and Career Strategy Portfolio

- **Mission:** Require the learner to act on a synthetic organisational situation with incomplete evidence and competing legitimate interests, and to produce both an influence recommendation and a personal capability record.
- **Core concepts:** All of the above, integrated: outcome at stake, claim, owner, audience, constraint, evidence class, communication choice, disagreement, ownership gap, structural constraint, capability risk, measurement hazard, change proposal, limitation, residual risk, revision trigger.
- **Illustrative Atlas scenario:** Atlas must decide how to carry the Part XI residue — an unowned dual-write, an incomplete consumer inventory, a single-point capability concentration, and a proposed measurement programme — into the next campaign, with four engineers, competing owner interests, and no additional funding.
- **QA → QE transition:** From producing correct technical analysis to producing a contribution that changes what an organisation can decide well, while stating plainly what remains outside the learner's control.
- **Worked reasoning:** The packet contains conflicting legitimate positions from at least three named owners. No option satisfies all of them, and the learner must recommend, record the disagreement, and name what they cannot resolve.
- **Professional artifact:** Quality Leadership and Career Strategy Portfolio, containing a **Quality Leadership Decision Brief** and a **Career Evidence Record**.
- **Prerequisites:** Chapters 1–11.
- **Explicit exclusions:** No real organisation, real person, real performance record, promotion claim, certification, or assertion that the learner owns the organisational decision.
- **Handoff:** Closes the handbook. Nothing is deferred to a later part.

---

## Worked-Reasoning and Numerical Strategy

Part XII contains fewer numbers than Parts X and XI, deliberately. Where numbers appear they concern **practice and organisation**, which is the domain in which quantitative overreach does the most damage. Every numerical example must state **context, population and level, assumptions, units, calculation, interpretation, limitation, and decision relevance**, and must additionally state **the level at which the measure is valid**. Each uses synthetic Atlas facts and is checked independently before manuscript review.

| Example | Planned chapter | Required discipline and limitation |
| --- | --- | --- |
| Capability concentration / bus factor | 8 | Simple count over a stated capability set. State that a count says nothing about depth, transferability, or how long transfer would take, and that low concentration is not automatically resolved by documentation. |
| Review or feedback latency | 9 | State the window, queue boundary, working-hours assumption, and units. Distinguish waiting time from effort and from quality of the review. |
| Delivery-performance measures | 9 | Use only at team level, over a stated window, as a **diagnostic** rather than an evaluation. State that these are correlational, validated at team or organisation level, and invalid as individual measures. |
| Defect attribution per engineer | 9 | **Behavioural and construct-validity hazard example.** Defect counts reflect assignment, area risk, and reporting behaviour rather than capability, so the measure lacks construct validity for the attribute it is used for. State what the measure would do to behaviour if adopted. This example demonstrates a *bad measure*; it is **not** the mandatory weak-inference example, because its arithmetic is trivial and nobody is genuinely tempted by it. |
| **Segment-mix aggregation** | **9** | **Mandatory weak-inference example.** Correct arithmetic, genuinely persuasive aggregate, invalid conclusion. Worked in full below. |
| Practice adoption and effect | 10 | State pilot boundary, adoption definition, observation window, and the confounders that prevent attributing an outcome change to the practice. Compliance is not adoption; adoption is not effect. |
| Escalation or decision latency | 5 or 12 | State from what event to what event, who was waiting, and whether the delay was decision-making or availability. Do not infer disengagement from delay. |

### Mandatory weak-inference example — segment-mix aggregation

This example exists to establish one proposition: **correct arithmetic does not make a conclusion valid.** It must be genuinely tempting, so a reader who dismisses the defects-per-engineer case as obviously foolish still gets caught by this one. The synthetic Atlas figures below are illustrative.

| Element | Content |
| --- | --- |
| **Context** | Atlas introduced a mandated pre-merge review checklist after an incident (the Chapter 10 scenario). The delivery owner asks whether it worked. |
| **Population and level** | All Atlas changes reaching production in two consecutive quarters, split by change type. Team level. No individual is measured. |
| **Assumptions** | An escaped defect is one found after production release and attributed to the change; classification is unchanged across quarters; both quarters are fully recorded. |
| **Units** | Escaped defects per 100 changes (percentage of changes producing an escaped defect). |
| **Calculation** | **Q1 (before):** routine catalogue changes 4 ÷ 200 = **2.0%**; payment-path changes 12 ÷ 100 = **12.0%**; overall 16 ÷ 300 = 5.333…% ≈ **5.33%**. **Q2 (after):** routine 12 ÷ 400 = **3.0%**; payment-path 8 ÷ 50 = **16.0%**; overall 20 ÷ 450 = 4.444…% ≈ **4.44%**. |
| **The tempting interpretation** | The escaped-defect rate fell from 5.33% to 4.44% — a 0.89 percentage-point improvement, roughly a sixth of the previous rate — across 450 changes. The checklist worked. |
| **Why the inference is invalid** | **Both segments got worse.** Routine rose from 2.0% to 3.0%; payment-path rose from 12.0% to 16.0%. The aggregate improved only because the **denominator composition shifted**: payment-path changes fell from 100 of 300 changes (33.3%) to 50 of 450 (11.1%) when the team was diverted to campaign work. Fewer high-risk changes were made, not better ones. |
| **Mix-adjusted comparison** | Applying Q2's segment rates to Q1's mix: (200 × 3.0%) + (100 × 16.0%) = 6 + 16 = 22 escaped defects over 300 changes = 7.333…% ≈ **7.33%**. Held at a constant mix, the rate **rose** from 5.33% to 7.33% — the opposite of the aggregate's direction. |
| **Interpretation** | The arithmetic is correct at every step and the aggregate figure is real. What fails is the step from *evidence* to *inference*: the aggregate answers "what proportion of changes escaped a defect," which is not the question "did the checklist improve our practice." |
| **Limitation** | This analysis cannot establish that the checklist made things *worse* either. Segment rates moved for reasons the data does not identify, campaign pressure is an obvious confounder, and two quarters is a short window. It establishes only that the aggregate improvement does not support the claim made from it. |
| **Decision relevance** | Supports rejecting the claim that the checklist is validated, and supports asking for segmented figures before any decision to extend it. Does not by itself decide whether to keep, revise, or withdraw the checklist — that is the delivery owner's decision. |

Chapter 9 will require learners to name the step at which the chain broke, using the terminology chain above: the measurement is sound, the indicator is defensible, and the failure is at **inference**. No composite score is introduced anywhere in this example.

**No composite leadership, culture, maturity, capability, or governance score will appear anywhere in Part XII.** This is a firm constraint, consistent with Part XI's prohibition on composite architecture scores and for the same reason: a single figure buries a judgement that belongs to a named person.

---

## Practical Artefacts and Capstone Strategy

Each chapter creates one concise, reviewable professional artefact. Artefacts make reasoning inspectable; they are not process bureaucracy and do not require a standalone lab or companion project. **No artefact in Part XII records an assessment of a named individual.**

| Chapter | Cumulative professional artefact |
| --- | --- |
| 1 | Influence and Decision-Owner Map |
| 2 | Evidence Translation Record |
| 3 | Durable Decision Record |
| 4 | Disagreement and Escalation Record |
| 5 | Ownership and Accountability Model |
| 6 | Quality-Culture Claim Set |
| 7 | Structure and Constraint Assessment |
| 8 | Capability Growth Plan |
| 9 | Practice Measurement Plan |
| 10 | Practice Change and Adoption Strategy |
| 11 | Career Evidence and Development Record |
| 12 | Quality Leadership and Career Strategy Portfolio |

### Capstone evidence packet

The capstone will provide deliberately incomplete synthetic evidence about the Atlas organisation, including: the inherited Part XI residue; named owner positions that legitimately conflict; a partial retrospective and incident-review record; a small survey with a stated response rate; delivery-performance figures at team level; a capability-concentration count; a proposed measurement programme including one hazardous measure; a practice change with compliance but ambiguous effect; structural constraints that no option removes; and explicit evidence gaps.

**The packet must make meaningful disagreement possible, and at least two named owners must hold defensible opposing positions.** It will not conceal a correct answer, will not depict any individual as the problem, and will not supply a metric that resolves the situation.

### Required Quality Leadership Decision Brief

The capstone brief must use these fields exactly:

| Field | Required purpose |
| --- | --- |
| CONTEXT | State the organisational situation and the decision scope. |
| QUALITY OUTCOME AT STAKE | State the outcome the decision affects. |
| CLAIM OR PROPOSAL | State what is being recommended, bounded. |
| DECISION OWNER | Identify the accountable role for this decision. |
| AUDIENCE | Identify who must understand it, and what constraint each faces. |
| CONSTRAINT | Record a limiting condition the proposal must respect. |
| FACT | State only what the evidence directly supports. |
| EVIDENCE AND CLASS | Identify each source and whether it is measured, observed, reported, or inferred. |
| **INFERENCE** | **State what you conclude from that evidence, and why the evidence supports it. This must be separate from `EVIDENCE AND CLASS`: what the evidence shows and what you conclude from it are different statements, and the step between them is where most reasoning in this domain fails.** |
| ASSUMPTION | Record an unverified condition the reasoning depends on. |
| **OPTION** | **Name and describe at least one defensible alternative to the proposal, stated fairly enough that a reader could prefer it.** |
| COMMUNICATION CHOICE | State how the claim will be delivered and what is deliberately omitted. |
| TRADE-OFF | State the benefit gained and what becomes harder or costlier. |
| LIMITATION | State what the analysis and evidence cannot establish. |
| **UNCERTAINTY** | **State what remains genuinely unknown and how that affects confidence in the inference. Required, not optional.** |
| DISAGREEMENT | Record any owner position that conflicts, stated fairly. |
| MITIGATION | Describe a proportionate risk-reduction action. |
| DECISION SCOPE | State what is being recommended and what is explicitly out of scope. |
| CONSEQUENCE | State expected and adverse consequences, including for other roles. |
| RESIDUAL RISK | Record risk remaining after the recommendation and mitigation. |
| REVISION TRIGGER | State the observation that would require reassessment. |
| OWNERSHIP STATEMENT | State that this is a recommendation, name who owns the decision, and state what the author does **not** have the authority to decide. |

Optional fields, used only where needed, are **EVIDENCE GAP**, **ESCALATION CONDITION**, and **UNOWNED RISK**.

Three properties of this brief are deliberate and must survive drafting. `EVIDENCE AND CLASS` and `INFERENCE` are separate fields, so the reasoning step is written down rather than assumed. `OPTION` prevents the brief from becoming single-recommendation advocacy. And `CLAIM OR PROPOSAL` plus `OWNERSHIP STATEMENT` together hold the line that **a recommendation is not a decision** and that **the author's authority is not the decision owner's authority**.

The capstone asks the learner to reason from the packet; it does not provide a solved portfolio, and it will not pre-populate `INFERENCE`, `DECISION SCOPE`, `CONSEQUENCE`, `RESIDUAL RISK`, or `REVISION TRIGGER`.

---

## Source, Authority, and Terminology Strategy

Part XII's source risk is different from earlier parts': its subject matter has abundant popular literature and comparatively little rigorous evidence. The manuscript will classify sources so that authority is not confused with popularity or with MSQE interpretation.

| Source class | Planned use | Boundary |
| --- | --- | --- |
| **Peer-reviewed research** | [Edmondson on psychological safety](https://doi.org/10.2307/2666999) (Ch 4); [Westrum's organisational typology](https://doi.org/10.1136/qshc.2003.009522) (Ch 6); [Strathern on measures becoming targets](https://doi.org/10.1002/%28SICI%291234-981X%28199707%295%3A3%3C305%3A%3AAID-EURO184%3E3.0.CO%3B2-4) (Ch 9); [Parnas & Clements on recorded design rationale](https://doi.org/10.1109/TSE.1986.6312940) (Ch 3); [Kaner & Bond on construct validity in software metrics](https://kaner.com/pdfs/metrics2004.pdf) (Ch 9); [Collins, Brown & Newman on cognitive apprenticeship](https://doi.org/10.4324/9781315044408-14) (Ch 8). | Cite for the specific construct only. Do not extend a team-level finding to an individual, or a study population to all organisations. |
| **Scholarly books** | [Rogers, *Diffusion of Innovations*](https://www.simonandschuster.com/books/Diffusion-of-Innovations-5th-Edition/Everett-M-Rogers/9780743222099) (Ch 10), for adoption as a social process distinct from mandate. | Used for that distinction only. Not a change-management methodology; adopter categories are not a personality taxonomy and will not be used to label colleagues. |
| **Applied research and practitioner-research reports** | [The SPACE framework](https://doi.org/10.1145/3454122.3454124) for multi-dimensional productivity framing (Ch 9); [DORA research](https://dora.dev/research/) and the [DORA metrics guide](https://dora.dev/guides/dora-metrics/) for delivery-performance measures (Ch 9). | Correlational, team- or organisation-level, survey-based. Not causal, not a maturity model, not a benchmark, and not valid for individuals. **Metric lists must carry the source date**, because DORA's model and terminology have changed. |
| **Existing repository sources reused** | [Conway on committees and system structure](https://www.melconway.com/Home/Committees_Paper.html) (Ch 7); [Goodhart via Part I Chapter 7](https://www.rba.gov.au/publications/rdp/1990/9013/conference-volumes.html) (Ch 9). | Reuse the established citation and its existing qualification. Part XII does not restate, extend, or re-derive Part I's Goodhart treatment, and does not attribute a Goodhart treatment to Part XI. |
| **International standards** | [ISO/IEC 25010:2023](https://www.iso.org/standard/78176.html) only where a product-quality characteristic is genuinely the subject. | Sparingly. ISO/IEC 25010 is a product-quality model; it says nothing about organisations, culture, or careers, and Part XII will not stretch it. No standard will be added for the appearance of authority. |
| **Official documentation and practitioner guidance** | Narrow factual clarification where no research applies. | Avoid vendor and framework prescription; label the authority type accurately. |
| **MSQE teaching models** | The Quality Influence and Decision Model, the evidence classes, the artefact set, the decision brief, and the QA → QE progression. | Clearly label as original MSQE educational models, not standards, competency frameworks, or validated instruments. |

### Source basis by chapter

No chapter may appear accidentally unsourced. Where a chapter rests on MSQE-original material or earlier-part precedent rather than external authority, that is a stated position, not an oversight.

| Ch | Primary basis | Named external sources |
| --- | --- | --- |
| 1 | **MSQE-original** — the Quality Influence and Decision Model and the authority discipline | None. The model is labelled original teaching material. |
| 2 | **MSQE-original**, derived from Parts III, X, and XI evidence practice | None required; the chapter's claims are about handling evidence the earlier parts already justify. |
| 3 | Source-backed | Parnas & Clements[^parnas] |
| 4 | Source-backed | Edmondson[^edmondson] |
| 5 | **MSQE-original**, derived from Part XI decision-ownership practice | None. Governance arrangements are described as an observational vocabulary, explicitly not as a validated model. |
| 6 | Source-backed | Westrum[^westrum] |
| 7 | Source-backed | Conway[^conway] |
| 8 | Source-backed | Collins, Brown & Newman[^cognitive-apprenticeship] |
| 9 | Source-backed | Kaner & Bond,[^kaner-bond] SPACE,[^space] DORA,[^dora][^dora-metrics] Strathern,[^strathern] Goodhart via Part I[^goodhart] |
| 10 | Source-backed | Rogers[^rogers] |
| 11 | **MSQE-original**, deliberately | None. Career levelling is organisation-specific; there is no authority that would generalise, and citing one would create the false precision the chapter exists to prevent. |
| 12 | **Synthesis** — no new sources | Draws only on sources already established in Chapters 1–11. |

Specialised terms — including influence, authority, accountability, decision right, policy ownership, governance operating model, ownership gap, psychological safety, evidence class, construct validity, indicator, proxy, target, inference, adoption, displacement, bus factor, and revision trigger — will be defined at first meaningful use. References will use the approved chapter-template citation format and be checked for currentness during drafting and review.

**Source strategy is not bibliography accumulation.** Every source above supports a specific material claim in a specific chapter. No source is added for volume, and no famous leadership book is cited on the strength of its reputation.

**Known source limitation to be stated in the manuscript:** several sources central to this part are behind publisher access controls and return HTTP 403 to automated clients. This is bot protection, **not link rot**, and no authoritative URL will be replaced because an automated client was blocked.

Verification status is recorded honestly and at two distinct levels:

| Source | Verification achieved at architecture stage |
| --- | --- |
| Kaner & Bond | **Primary full text inspected.** Title, both authors, venue (10th International Software Metrics Symposium, METRICS 2004), and the construct-validity argument were read directly from the paper. |
| Edmondson; Westrum; Strathern; Parnas & Clements; SPACE; Collins, Brown & Newman | **Bibliographic metadata verified via Crossref only.** Full text not inspected; publisher access returned HTTP 403 or was otherwise unavailable. |
| Conway; DORA; Goodhart | **Publisher or author-hosted page reachable**; Goodhart reuses the existing Part I citation and its qualification. |

Where full text has not been inspected, the manuscript will say so rather than implying primary verification, and any claim requiring the substance of an uninspected source must be upgraded to primary verification before that claim is made. This mirrors the ISO purchased-copy control carried through Part XI, which also remains open.

---

## Diagram, Laboratory, and Pass 2 Classification

Part XII's visual needs are modest and mostly relational — ownership maps, escalation paths, structure-to-boundary correspondence. Any diagram remains a **description** of an organisational arrangement, not evidence that the arrangement works, consistent with the architecture-versus-architecture-description discipline established in Part XI.

In accordance with Quality Gates v1.1, every standalone asset below is **recommended Pass 2 enrichment**, not a prerequisite for the Part XII manuscript release.

| Planned asset | Classification | Learning purpose and boundary |
| --- | --- | --- |
| Atlas Commerce Organisational Decision Simulator | Recommended Pass 2 enrichment | Lets learners explore conflicting owner positions and communication choices. Not created or required now. |
| Lab 1 — Evidence Translation and Audience | Recommended Pass 2 enrichment | Extends Chapters 2–3 with rendering the same finding for different decision owners. |
| Lab 2 — Ownership Gaps and Escalation | Recommended Pass 2 enrichment | Extends Chapters 4–5 with unowned-signal and escalation-condition practice. |
| Lab 3 — Culture Claims and Measurement Hazards | Recommended Pass 2 enrichment | Extends Chapters 6 and 9 with evidence-class classification and measure critique. |
| Lab 4 — Practice Change and Capstone Decision | Recommended Pass 2 enrichment | Extends Chapters 10–12 with adoption evidence and decision-brief practice. |
| Ownership, escalation, and structure diagrams | Recommended Pass 2 enrichment | Illustrate relationships only where a visual materially improves learning. |
| Worked artefact examples and blank templates | Recommended Pass 2 enrichment | Provide completed and blank examples after independent review for accuracy and accessibility. |
| Synthetic organisational datasets and case-study files | Recommended Pass 2 enrichment | Support extended synthetic practice if separately approved and validated. **Must contain no real person or organisation.** |

No standalone practical asset is classified as required for the Part XII manuscript release. This does not bypass practical learning: the manuscript must still validate its illustrative scenarios, worked reasoning, professional artefacts, practical exercises, references, Markdown, links, and independent review.

---

## Depth, Production, and Review Model

### Depth guidance

Normal conceptual chapters should target **3,800–5,200 words**. High-integration chapters — particularly Chapters 5, 6, 9, and 10, which must connect organisational reasoning to evidence discipline and cross-part handoffs — should normally target **4,300–5,800 words**. The capstone should target **6,000–7,500+ words**. Word count is not a quality gate; instructional completeness, technical accuracy, and evidence discipline are.

### Accelerated, quality-preserving workflow

| Batch | Chapters | Production focus | Mandatory checkpoint |
| --- | --- | --- | --- |
| A — Influence and communication | 1–4 | Establish the model, authority discipline, translation, durable records, and disagreement. | **Checkpoint A:** Verify authority discipline held throughout, no persuasion-technique drift, psychological-safety attribution and bounds, the Chapter 4 personal-risk statement present and bounded with no legal or HR drift, Parnas attribution scoped to rationale recording, evidence-class vocabulary including the edge-case tie-break, Atlas organisational baseline and the canonical unowned-shim wording, and Parts I–XI handoffs. |
| B — Organisational capability | 5–8 | Teach ownership, decision rights, governance operating models, culture claims, structure, and capability growth. | **Checkpoint B:** Verify soft-evidence discipline, culture-claim boundedness, Westrum and Conway attribution and bounds, **governance arrangements described but never ranked, scored, or recommended**, **organisation design delivered as analysis with no restructuring prescription**, ownership-transfer treated as an analysable change, mentoring power asymmetry present, cognitive-apprenticeship attribution scoped, no individual assessment, and no HR or performance-management drift. |
| C — Measurement, change, career, and synthesis | 9–12 | Resolve measurement hazards, practice change, career discipline, and capstone coherence. | **Checkpoint C:** Verify construct-validity treatment and Kaner & Bond attribution, the measurement-to-decision terminology chain taught explicitly, **the segment-mix aggregation example arithmetically re-verified as written**, DORA metric names carrying a source date, Goodhart attributed to Part I and not Part XI, Rogers scoped to adoption-as-social-process, measurement-level discipline, no composite score anywhere, career-claim discipline, capstone conflict genuineness, and Decision Brief field accuracy including required `OPTION`, `INFERENCE`, and `UNCERTAINTY`. |

After the batches, the approved path is: **one consolidated independent manuscript review; one targeted P1/P2 correction pass if required; a focused closure review only if the correction requires it; then one Final Part XII Quality Gate.** P0/P1 concerns interrupt the accelerated flow; P2/P3 concerns are handled proportionately without disguising scope expansion.

### Architecture-review scorecard

The independent architecture review assesses this plan against these 24 categories:

1. Part mission clarity; 2. MQE-BOK Domain 12 traceability; 3. Quality-Engineering specificity; 4. QA → QE → leadership progression; 5. chapter sequence and separability; 6. authority discipline; 7. influence-versus-authority boundary; 8. evidence-class discipline in soft domains; 9. career-claim discipline; 10. cross-part boundary and deferral discipline; 11. durable-record and communication treatment; 12. disagreement, escalation, and psychological-safety scope; 13. ownership, decision-rights, and governance reasoning; 14. culture-claim boundedness and Westrum scope; 15. organisation-design analysis and Conway treatment; 16. mentoring rigour, power asymmetry, and no individual assessment; 17. measurement-level discipline, construct validity, and individual-metric hazard; 18. DORA/SPACE scope and currency discipline; 19. practice-change and adoption evidence; 20. Atlas organisational baseline consistency and individual-safety constraint; 21. central reasoning-model quality and necessity; 22. capstone conflict genuineness and non-pre-solution; 23. source authority, sufficiency, and citation strategy; and 24. Pass 2 classification, depth, Markdown/template consistency, and repository/release-scope integrity.

**The review scorecard is a governance instrument, not a curriculum artefact.** It scores *this planning document* for the project's own quality gates. It is not a leadership score, a culture score, a maturity score, an organisational-effectiveness score, or anything a Part XII reader is taught to construct, and it will never appear inside a chapter as a technique. It does not conflict with the no-composite-score rule, which governs what the manuscript teaches learners to build about people, teams, and organisations.

---

## Definition of Done for Planned Part XII Manuscript Work

Part XII may advance from architecture planning to Pass 1 only after a focused independent architecture-closure review verifies the corrections applied to this document. **That condition is now satisfied** — the closure review returned 97/100, verdict A, with all P1 and P2 findings closed — so Pass 1 may be authorized as a separate task. A future manuscript release may be considered only when:

1. all 12 chapters are drafted using the approved template and retain `Status: Draft` until governance authorizes another status;
2. every chapter includes a labelled illustrative scenario, worked reasoning, practical artefact, source-backed or explicitly MSQE-original claims, limitations, and cross-part handoff;
3. no chapter depicts a named individual as incompetent, negligent, or a performance problem, and no artefact records an assessment of an individual;
4. Checkpoints A, B, and C, consolidated independent review, required correction/closure work, and the Final Part XII Quality Gate are completed;
5. no P0, P1, or release-blocking P2 finding remains;
6. all standalone practical assets remain accurately classified, and any future required asset passes its applicable Required Practical Asset Gate; and
7. release administration, versioning, repository validation, and publication steps are separately authorized and completed.

---

## Current State and Next Authorized Activity

- **Architecture status:** **COMPLETE and VERIFIED.** The curriculum architecture passed independent closure review and is authoritative for manuscript production once Pass 1 is separately authorized.
- **Review events:** Independent curriculum-architecture review **83/100 (verdict B)**; focused independent architecture-closure review **97/100 (verdict A)**. Two distinct events; the second does not replace the first.
- **Corrections:** All thirteen corrections **C1–C13 applied and independently verified as present and effective**.
- **Findings after closure:** **P0 = 0.** **P1 = 0 open — all three previous P1 findings CLOSED.** **P2 = 0 open — all seven previous P2 findings CLOSED.** **P3 = 0 blocking** — four closed, one accepted/deferred, two new non-blocking observations recorded below.
- **Regression state:** **16/16 load-bearing strengths preserved** (the composite-score prohibition was strengthened). **No material generic-management drift.** **No composite-scoring regression.**
- **Pass 1 state:** **COMPLETE.** Batches A (1–4), B (5–10), and C (11–12) are drafted; Checkpoints A, B, and the Batch C integration checkpoint passed. Pass 1 completion is **not** a manuscript review, a Final Quality Gate, a baseline, or release readiness.
- **Manuscript state:** **All twelve Part XII chapters exist**, all carrying `Status: Draft`. **No chapter is represented as reviewed, approved, complete, published, or final.** Total manuscript: approximately 65,900 raw words.
- **Checkpoint A result:** **Passed.** P0 = 0; P1 = 0 after correction; P2 = 0 after correction; P3 = 3 non-blocking. One arithmetic defect (a stated 78% survey response rate where 9 of 11 is ≈82%) and two anti-formulaic repetitions were found by the checkpoint and corrected before it closed. Independent recalculation covered every numerical claim in Batch A.
- **Checkpoint B result:** **Passed.** P0 = 0; P1 = 0; P2 = 0 after correction; P3 = 2 non-blocking. It verified governance arrangements described but never ranked or scored, organisation design delivered as analysis with no restructuring prescription, ownership transfer treated as an analysable change across eight dimensions, mentoring power-asymmetry controls, Westrum and Conway attribution and bounds, Collins/Brown/Newman scope, Kaner & Bond's construct-validity claim, SPACE not reduced to a score, current dated DORA terminology, no individual assessment, no HR or performance-management drift, no composite scoring, Atlas continuity, and Batch A byte-identical to its commit. Two defects were found and corrected before closure: a stated payment-path-to-routine defect ratio inconsistent with the chapter's own figures, and two repeated section openings. The mandated segment-mix example was recomputed independently with exact rational arithmetic and reconciles at every step.
- **Batch C integration checkpoint result:** **Passed.** P0 = 0; P1 = 0; P2 = 0; P3 = 2 non-blocking. It verified twelve chapters all `Status: Draft`, **Chapters 1–10 byte-identical to their committed states with zero edits**, career-claim discipline with zero deterministic career language, the capstone integrating Chapters 1–11 and Parts III–XI through a single decision problem rather than a sequential summary, a 73-identifier evidence packet spanning all nineteen required categories, three defensible options, two owners in genuine unresolved conflict, all 22 Decision Brief fields matching the architecture exactly, seven fields left unworked, portfolio-boundary statements, authority discipline, Atlas continuity, and independent recomputation of every numerical claim with no drift between chapters. Two structural defects were found and corrected before closure: a non-template capstone exercise heading and one repeated section opening.
- **Consolidated independent manuscript review result:** **97/100, verdict B — targeted manuscript corrections required before the Final Quality Gate.** It recorded **P0 = 0, P1 = 0, P2 = 1, P3 = 5**. The review recomputed every numerical chain with exact rational arithmetic (all reconcile, no drift between chapters), verified zero authority hits and zero deterministic career language across 65,864 words, confirmed claim strength tightens rather than drifts, validated all 73 capstone evidence IDs, and found template compliance at 204/204 section cells. It modified nothing; the chapter manifest hashed identically before and after.
- **P2-1 — declared Part IX cross-part handoff never delivered.** The architecture requires Part XII to state where an AI capability changes who is accountable for a quality outcome; Part IX was referenced zero times across all twelve chapters. **Correction applied; closure pending focused independent verification.** Chapter 5 gained a bounded subsection — *AI-Enabled Evidence Does Not Erase Decision Ownership* — covering what an AI capability changes (evidence, uncertainty, system boundary, specialist input required) and what it does not (the accountable owner), with a language-discipline table, four recording requirements, and the decision-rights ambiguity case. Chapter 12 gained a traceability paragraph placing AI-derived evidence in the packet as Part IX specialist evidence without altering the decision-owner model or the 73-ID packet. Part IX retains AI evaluation, model quality, safety, fairness, privacy, and agentic evaluation; Part XII retains organisational accountability. **No AI curriculum was introduced** — verified by a fifteen-term drift sweep returning zero whole-word matches.
- **P3 dispositions:** P3-1 **applied** (Chapter 4's *revision condition* normalised to *revision trigger*; the architecture does not mandate the original field name, and zero occurrences of the variant remain). P3-4 **applied** (Chapter 12's Option C is now explicitly defensible when bounded to a specific unresolved evidence condition, while an indefinite structural hold remains correctly discouraged). P3-2 (opener clusters), P3-3 (Chapter 12 table density), and P3-5 (zero-footnote position in Chapters 11–12) are **accepted as non-blocking** and carried forward for later editorial normalisation.
- **No finding is represented as formally closed.** Closure of P2-1 belongs to a focused independent manuscript-closure review, not to this correction task. **The Final Part XII Quality Gate has NOT been run**, no controlled manuscript baseline exists, and nothing is release-ready.
- **Source-control movement:** Two sources were **upgraded from metadata-only to primary full-text verified** during Batch A — Parnas & Clements and Edmondson — each against an institutionally hosted copy rather than the publisher's version of record. **The source-verification control remains OPEN** for Westrum, Strathern, SPACE, and Collins/Brown/Newman, none of which Batch A used substantively.
- **Practical assets:** None exist (0). No companion implementation, laboratory, diagram, worksheet, simulator, dataset, case study, website asset, CI/CD configuration, or infrastructure. All proposed standalone assets are recommended Pass 2 enrichment only; **Pass 2 has not started**.
- **Release state:** **v0.15.0 — Engineering Leadership & Career Growth Complete** remains planned and unreleased; no `v0.15.0` tag and no v0.15.0 CHANGELOG release entry exist. **v0.14.0 — System Design & Architecture Complete** is the latest stable release.
- **Part XIII:** not started.
- **Next authorized action:** Conduct one **focused independent manuscript-closure review** verifying that P2-1 is genuinely closed, that no P3 was silently upgraded or downgraded, and that no regression was introduced by the correction. Do not begin that review, the Final Quality Gate, practical assets, Pass 2 enrichment, or v0.15.0 release administration automatically. Part XII is **not** complete: **the Final Quality Gate has not been run**, no manuscript baseline exists, and nothing is release-ready.

### Non-blocking observations carried forward

| # | Observation | Disposition |
| --- | --- | --- |
| new-P3-1 | Part I Chapter 10 contains a roadmap-style forward reference mentioning *“strategy”*, which Part XII does not deliver as a named topic. Part VIII Chapter 10's forward reference to organisational leadership and culture is satisfied by Chapter 6. | Non-blocking; **v0.16.0 First Edition Review** item. |
| new-P3-2 | The Engineering Management mapping row lists *“capability development”* in its scope while the substantive capability-development treatment lives in Chapter 8. | Non-blocking; **drafting-time cross-reference precision** item. |

Neither is upgraded to P2 or P1 without new evidence.

### Quality controls carried forward — open, not closed

| Control | State |
| --- | --- |
| **Source verification level** | Six sources — Edmondson, Westrum, Strathern, Parnas & Clements, SPACE, and Collins, Brown & Newman — are **bibliographic-metadata verified only**; publisher access returned HTTP 403 (bot protection, not link rot). Kaner & Bond is the sole source with **primary full text inspected**. Any substantive manuscript claim relying on a metadata-only source must receive primary verification before that claim is finalised. **This control is open.** |
| **DORA terminology currency** | DORA's metric model is time-sensitive and has changed in both count and naming. Terminology must be **re-verified against official DORA material during drafting**, and any metric list must carry its source date. **This control is open.** |

Both controls sit alongside the Part XI ISO/IEC 25010:2023 and ISO/IEC/IEEE 42010:2022 purchased-copy control, which also remains open.

---

## References

[^edmondson]: Edmondson, A. [Psychological Safety and Learning Behavior in Work Teams](https://doi.org/10.2307/2666999). *Administrative Science Quarterly*, 44(2), pp. 350–383. June 1999. Accessed 2026-08-14.
[^westrum]: Westrum, R. [A typology of organisational cultures](https://doi.org/10.1136/qshc.2003.009522). *Quality and Safety in Health Care*, 13(suppl_2), pp. ii22–ii27. December 2004. Accessed 2026-08-14.
[^space]: Forsgren, N., Storey, M.-A., Maddila, C., Zimmermann, T., Houck, B., and Butler, J. [The SPACE of Developer Productivity](https://doi.org/10.1145/3454122.3454124). *ACM Queue*, 19(1), pp. 20–48. 2021. Accessed 2026-08-14.
[^dora]: DORA. [DORA Research Program](https://dora.dev/research/). Applied practitioner research; correlational and validated at team or organisation level, not for individual measurement. Accessed 2026-08-14.
[^strathern]: Strathern, M. ['Improving ratings': audit in the British University system](https://doi.org/10.1002/%28SICI%291234-981X%28199707%295%3A3%3C305%3A%3AAID-EURO184%3E3.0.CO%3B2-4). *European Review*, 5(3), pp. 305–321. July 1997. Accessed 2026-08-14.
[^dora-metrics]: DORA. [DORA's software delivery performance metrics](https://dora.dev/guides/dora-metrics/). Five-metric model as published at the accessed date: change lead time, deployment frequency, failed deployment recovery time, change fail rate, and deployment rework rate. Terminology has changed over time; cite with the access date. Accessed 2026-08-14.
[^conway]: Conway, M. E. [How Do Committees Invent?](https://www.melconway.com/Home/Committees_Paper.html) *Datamation*, 14(5), pp. 28–31. April 1968. Accessed 2026-08-14.
[^parnas]: Parnas, D. L., and Clements, P. C. [A Rational Design Process: How and Why to Fake It](https://doi.org/10.1109/TSE.1986.6312940). *IEEE Transactions on Software Engineering*, SE-12(2), pp. 251–257. February 1986. Bibliographic metadata verified; full text not inspected. Accessed 2026-08-14.
[^kaner-bond]: Kaner, C., and Bond, W. P. [Software Engineering Metrics: What Do They Measure and How Do We Know?](https://kaner.com/pdfs/metrics2004.pdf) In *10th International Software Metrics Symposium (METRICS 2004)*. 2004. Primary full text inspected. Accessed 2026-08-14.
[^cognitive-apprenticeship]: Collins, A., Brown, J. S., and Newman, S. E. [Cognitive Apprenticeship: Teaching the Crafts of Reading, Writing, and Mathematics](https://doi.org/10.4324/9781315044408-14). In Resnick, L. B. (ed.), *Knowing, Learning, and Instruction: Essays in Honor of Robert Glaser*, pp. 453–494. Originally published 1989; DOI resolves to the Routledge reissue. Bibliographic metadata verified; full text not inspected. Accessed 2026-08-14.
[^rogers]: Rogers, E. M. *Diffusion of Innovations*, 5th edition. Free Press, 2003. Scholarly book; no DOI. Used narrowly for adoption as a social process distinct from mandate and compliance. Accessed 2026-08-14.
[^goodhart]: Goodhart, C. A. E. *Problems of Monetary Management: The U.K. Experience*. In *Papers in Monetary Economics*, Reserve Bank of Australia, 1975. Bibliographic record: [Reserve Bank of Australia](https://www.rba.gov.au/publications/rdp/1990/9013/conference-volumes.html). Cited as established in Part I Chapter 7, which qualifies Goodhart's law as a cautionary heuristic originating in monetary policy rather than a scientific law. Accessed 2026-08-14.
