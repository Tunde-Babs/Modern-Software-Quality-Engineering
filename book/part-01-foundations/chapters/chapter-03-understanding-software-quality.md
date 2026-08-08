# Chapter 3 — Understanding Software Quality

## Metadata

| Field | Value |
|---|---|
| Part | Part I — Foundations of Modern Software Quality Engineering |
| MQE-BOK domain | Domain 1 — Foundations of Modern Software Quality Engineering |
| Chapter | 3 |
| Audience | Software Testers, QA Engineers, Automation Engineers, SDETs, Software Engineers, Product Managers, and Engineering Managers |
| Prerequisites | Chapters 1 and 2 |
| Estimated study time | 105 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Technical Review Ready |

## Opening Quote

> **MSQE principle:** Quality is not a property we discover at the end. It is a set of promises we design, measure, and sustain.

## Opening Story

The following illustrative scenario concerns a team responsible for a cloud-based appointment platform. The team has delivered a feature that lets patients reschedule an appointment. Its automated checks pass, the deployment completes successfully, and the service responds within its usual latency target.

On Monday morning, the support team discovers that some patients received two confirmation messages while the clinician's calendar showed only one appointment. The duplicate messages are inconvenient, but the calendar inconsistency is worse: a clinician may prepare for the wrong consultation or a patient may believe a booking is confirmed when it is not.

The feature has no obvious coding error in its visible user interface. Its failure emerges from the interaction among a retrying notification service, an eventually consistent scheduling store, and an ambiguous definition of when a reschedule is considered complete. The team now faces questions that a defect count alone cannot answer:

- Was the functional outcome correct for the patient and clinician?
- Was the system reliable when one dependency responded late?
- Was the workflow compatible with the notification service's delivery behaviour?
- Did the design make the state of a reschedule observable enough to diagnose the issue quickly?
- Were the response-time target and passing tests useful evidence, or only evidence about selected properties?

The incident illustrates a central point: software can be fast, available, and apparently defect-free in a narrow sense while still failing to provide an acceptable outcome. Understanding quality requires the team to reason about several properties at once and to decide which ones matter most in the context of the system.

## Why This Chapter Matters

Chapters 1 and 2 established that quality is engineered across the lifecycle and that Quality Engineering grew by connecting Quality Control, Quality Assurance, testing, automation, delivery, and operations. This chapter defines the object of that work: **software quality**.

The phrase is often reduced to "software without bugs." Defect prevention and detection are important, but they are not enough. A product can have few reported defects and still be inaccessible, insecure, slow under realistic demand, difficult to change, incompatible with a required integration, or unsuitable for the people who depend on it.

For Quality Engineers, a usable definition of quality must guide decisions. It must help a team move from statements such as "make it reliable" or "make it easy to use" to explicit requirements, design choices, evidence, and operational signals. It must also acknowledge trade-offs: improving one property may increase cost or place pressure on another.

## Learning Objectives

By the end of this chapter, you will be able to:

- Define software quality from engineering and business perspectives.
- Explain why software quality is multidimensional and context-dependent.
- Describe the current ISO/IEC 25010 product-quality model and relate it to the earlier 2011 model.
- Differentiate product quality, process quality, service quality, and engineering quality.
- Explain quality attributes, engineering capabilities, and their trade-offs.
- Select meaningful measures of software quality without treating a metric as the whole story.
- Apply systems thinking when evaluating software quality.

## What Does "Software Quality" Really Mean?

At its simplest, quality is the degree to which an object fulfils requirements. ISO 9000:2026 provides the foundational quality-management vocabulary used across the ISO 9000 family.[^iso9000] In software engineering, the word *requirements* must include more than listed features. It includes the user outcomes, constraints, legal or contractual obligations, quality attributes, and conditions of use that make a system fit for its intended purpose.

From a **business perspective**, quality is the system's ability to deliver value while managing unacceptable risk. A booking service that reliably lets patients make appointments may create value; the same service can destroy value if it exposes health information, frequently gives contradictory confirmations, or makes it impossible for staff to correct an error. The business view connects quality to customer trust, cost of failure, regulatory obligations, reputation, and sustainable delivery.

From an **engineering perspective**, quality is the extent to which the system exhibits the properties needed to meet those stakeholder needs in its specified context. This includes the behaviour visible to users and the internal qualities that determine whether engineers can evolve and operate the system safely.

For this handbook, the following is an **original MSQE working definition**:

> Software quality is the context-dependent ability of a software system to satisfy relevant stakeholder needs, manage the consequences of failure, and remain fit for use as it is changed and operated.

This is an MSQE teaching definition, not an ISO definition. Its purpose is to make three principles explicit:

1. **Quality is context-dependent.** The quality required of a disposable prototype differs from that required of a payment service or a safety-related system.
2. **Quality is multidimensional.** Correct functions alone do not establish security, maintainability, reliability, or effective interaction.
3. **Quality is sustained.** A system must remain fit for use as data changes, dependencies fail, traffic varies, and engineers modify it.

## The Evolution of Software Quality Thinking

Early discussions of software quality often concentrated on whether a program performed its specified function and whether defects could be found before release. Those concerns remain essential. As systems became networked, continuously delivered, data-dependent, and operationally complex, the definition of quality expanded because the consequences and sources of failure expanded.

Quality-management practice introduced the disciplines of planning, assurance, control, measurement, and improvement. Software testing made behaviour observable under selected conditions. Reliability engineering brought attention to service behaviour over time. Security engineering made confidentiality, integrity, and resilience against attack explicit. User-centred design made the effectiveness of interaction part of the definition of a successful product.

This is not a story in which one idea replaced another. It is an accumulation of perspectives. A production-quality system needs functional correctness, but it also needs the right response time, protection of sensitive data, a maintainable design, a usable interaction, and an operating model that can recover from failure. The more dependent a system is on external services, configuration, networks, and data, the more clearly these qualities interact.

The ISO/IEC SQuaRE family provides an organised set of standards for quality management, quality models, measurement, requirements, and evaluation.[^square] ISO/IEC 25030:2019, for example, provides a framework for eliciting, defining, using, and governing quality requirements for systems, software products, and data.[^iso25030] These standards are reference points for rigorous work; they do not remove the need for product judgment or choose the appropriate trade-off for a particular context.

> **Supporting asset (Pass 2, planned):** A *Software Quality Perspectives* diagram will show how stakeholder needs, product properties, delivery practices, and production evidence combine to shape quality.

## Quality as a System Property

Quality is not stored in a test plan or added by a release gate. It emerges from the interactions among requirements, architecture, implementation, data, infrastructure, deployment practices, user behaviour, and operating conditions. This makes quality a **system property**.

Consider the appointment example. A reliable calendar view depends not only on the scheduling code but also on message ordering, retry policies, data-consistency choices, time-zone handling, identity controls, interface contracts, monitoring, and support procedures. A check of the screen can be valuable evidence, but it cannot by itself establish that the distributed workflow behaves correctly under failure.

Systems thinking changes the question from "where is the defect?" to "which conditions and interactions allowed this outcome?" This does not avoid accountability. It improves accountability by identifying the decisions that created or failed to contain a risk. A useful investigation can therefore lead to a code change, a requirement clarification, a contract test, a safer deployment control, a production alert, and an ownership decision.

### Quality is designed, evaluated, and learned

Quality work has three complementary modes:

| Mode | Purpose | Examples |
|---|---|---|
| Design quality | Make relevant quality attributes and risk controls part of the system. | Explicit quality requirements, architecture decisions, safe defaults, recovery behaviour, access controls. |
| Evaluate quality | Gather evidence about whether the system meets stated expectations. | Reviews, automated checks, exploratory testing, performance experiments, acceptance evaluation. |
| Learn about quality | Use real outcomes to refine the product and the delivery system. | Telemetry, customer feedback, incident analysis, support trends, reliability reviews. |

Treating these as separate phases weakens feedback. An incident should improve the next design; an explicit quality requirement should influence what is measured; and production evidence should challenge assumptions made before release. This is why quality cannot be added at the end of development. An end-stage activity can evaluate selected outcomes, but it cannot retrospectively make an ambiguous requirement clear or an architecture resilient.

## Product Quality vs Process Quality vs Service Quality vs Engineering Quality

Quality is often discussed as if it were one thing. In practice, engineers need to reason across several related perspectives. In this chapter, **engineering quality** means the team's sustained ability to design, change, deliver, operate, and learn about a system safely. It is an MSQE teaching term, not an ISO/IEC 25010 product-quality characteristic. The following distinctions are an **MSQE teaching model**. They are not a replacement for the definitions in ISO standards.

| Perspective | Primary concern | Typical questions | Examples of evidence |
|---|---|---|---|
| Product quality | Properties of the product or system itself. | Does the software provide suitable functions, protect data, perform acceptably, and remain maintainable? | Requirement evaluation, test results, code and architecture review, product measures. |
| Process quality | Capability and effectiveness of the way work is performed. | Are requirements clarified, changes reviewed, risks managed, and improvements sustained? | Process observations, audit records, lead-time trends, retrospective actions. |
| Service quality | Quality experienced while a service is used and supported over time. | Can users obtain the intended outcome reliably, with suitable responsiveness and support? | Availability, latency, successful-journey rate, support contacts, service objectives. |
| Engineering quality | The team's sustained ability to design, change, deliver, operate, and learn about the system safely. | Can the team make a change with appropriate confidence and recover when reality differs from expectation? | Testability, observability, deployability, diagnostic quality, recovery exercises, change evidence. |

Product quality is not guaranteed by a mature process, and a high-quality product at one moment does not prove that the team can change it safely. Conversely, an effective engineering system does not excuse a product that fails its users. The perspectives reinforce one another and must be judged together.

### Product quality and quality in use

Product qualities describe properties of the software product or system. Quality in use concerns the outcome of using a system in a particular context. The distinction matters because a technically capable product can still fail a user who cannot understand its interaction, complete a task, or recover from an error. The Quality Engineer must therefore ask both: "does the system exhibit the required properties?" and "can the intended users achieve the intended outcome?"

## The ISO/IEC 25010 Software Product Quality Model

ISO/IEC 25010:2023 is the current product-quality model in the SQuaRE series. It defines nine product-quality characteristics, each with further subcharacteristics, as a reference model for specifying, measuring, and evaluating product quality.[^iso25010current] It applies to ICT products and software products, including elements such as software, data, infrastructure, and communications that form part of the product.

The model is valuable because it gives teams a shared vocabulary. It encourages questions that feature-focused requirements can omit: What reliability is needed? What security qualities matter? What does maintainability require? Which interaction capabilities must be supported? It does not say that every characteristic has equal priority, nor does it prescribe a universal metric or target.

### Current model and the 2011 model

Many experienced QA Engineers learned the eight-characteristic model from ISO/IEC 25010:2011: functional suitability, performance efficiency, compatibility, usability, reliability, security, maintainability, and portability. That edition has been withdrawn and replaced by ISO/IEC 25010:2023.[^iso25010legacy][^iso25010current]

The current edition has nine characteristics: functional suitability, performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, and safety. It uses **interaction capability** where the 2011 model listed usability, replaces the 2011 top-level **portability** characteristic with **flexibility**, and adds **safety** as a top-level characteristic. This chapter discusses the current model first, then uses the older terms where they remain useful for reading legacy material and job descriptions.

| Earlier 2011 term readers may encounter | Current 2023 top-level term | Practical continuity |
|---|---|---|
| Usability | Interaction capability | Both direct attention to whether specified users can achieve goals effectively, efficiently, and satisfactorily in context. |
| Portability | Flexibility | Both concern the system's capacity to work or adapt across changing operational environments; the current term makes evolution explicit. |
| — | Safety | The current model makes avoidance of unacceptable risk to people, business, property, or environment a top-level concern. |

The terminology update is not merely editorial. It reflects the need to evaluate modern systems that evolve across environments, involve complex human interaction, and can create consequences beyond an incorrect screen response.

## Quality Characteristics

The sections below discuss each current ISO/IEC 25010:2023 product-quality characteristic. The historical terms *usability* and *portability* are included where relevant because they remain common in software-quality discussions.

### Functional Suitability

**Functional suitability** is the degree to which the functions provided meet stated and implied needs when used under specified conditions. It is more demanding than "the feature exists." A rescheduling feature is functionally suitable only when it supports the relevant tasks correctly, completely, and appropriately for its users and business rules.

Functional suitability is often the most visible quality concern because stakeholders can directly observe whether the system performs the expected task. It still requires context. A function can return a technically valid result yet be unsuitable if it omits a necessary exception, applies the wrong precision, or forces users through an irrelevant workflow.

Useful evidence includes scenario-based acceptance criteria, examples that cover business rules and exceptions, interface-contract checks, exploratory testing, and production signals that show whether users complete intended journeys.

### Performance Efficiency

**Performance efficiency** concerns performance relative to the resources used under stated conditions. It includes response time, throughput, capacity, and resource utilisation. The phrase "the system must be fast" is not a quality requirement until the team identifies whose experience matters, which transaction is measured, at what workload, with what data, and under which constraints.

For a cloud-native service, a useful requirement might state that 95% of a defined class of booking requests complete within an agreed time under expected peak demand. The team should also consider queueing, retries, contention, dependency latency, and degraded behaviour. An impressive median response time can hide an unacceptable slow tail for a portion of users.

Performance efficiency is not simply an infrastructure concern. Architecture, algorithm choice, data access, caching, payload design, concurrency controls, and user experience all shape it.

### Compatibility

**Compatibility** concerns the ability to exchange information with other products, systems, or components and to perform required functions while sharing an environment. Modern systems are often integrations before they are applications: APIs, identity providers, mobile clients, event streams, payment services, analytics pipelines, and managed platforms all create compatibility concerns.

Compatibility failures commonly occur at boundaries. One service may change the meaning of an optional field, emit events in an unexpected order, handle retries differently, or depend on a version unavailable in a target environment. A unit test can confirm local behaviour while missing an incompatible contract.

Useful engineering responses include explicit interface contracts, versioning policies, representative integration environments, contract tests, schema validation, and production monitoring for failed interactions. These are not only test activities; they are decisions about how the system will evolve with its dependencies.

### Interaction Capability and the Earlier Term "Usability"

The current ISO/IEC 25010 model uses **interaction capability**. In the 2011 model, readers will often see the term **usability**. In both cases, the engineering concern is whether specified users can operate the product to achieve specified goals effectively, efficiently, and satisfactorily in a defined context of use.

Interaction capability includes more than visual polish. It involves learnability, operability, accessibility, user assistance, protection from user error, and whether the system supports the realities of a user's task. A patient who cannot understand why an appointment cannot be moved, or a clinician who cannot recover from a mistaken change, encounters a quality failure even if the backend rules are correct.

Evidence should include interaction design review, accessibility evaluation, task observation, exploratory testing, error-message review, and support data. Engineering teams should include these concerns before a user interface is complete; otherwise, they risk treating user understanding as cosmetic work added after the interaction model has hardened.

### Reliability

**Reliability** concerns the degree to which a system performs specified functions under specified conditions for a specified period. It includes considerations such as fault tolerance, recoverability, and the ability to continue providing the intended outcome when expected failures occur.

Reliability is not the same as availability. A service can accept connections and return responses while producing duplicate appointments, stale information, or corrupted business state. Availability is often one useful signal, but reliability must be evaluated against the user and business outcome that matters.

For distributed systems, reliability depends on choices about timeouts, retries, idempotency, data consistency, capacity, dependency isolation, recovery procedures, and operational readiness. An **idempotent** operation can be repeated without changing the result beyond the effect of the first successful operation; this is important when a client or service retries after an uncertain outcome.

### Security

**Security** concerns protection of information and systems so that authorised entities can access what they need, unauthorised entities cannot obtain or alter protected assets, and actions can be traced where appropriate. Security is a quality property because a product that exposes sensitive information or can be manipulated by an attacker fails its stakeholders even if its features otherwise work.

Security requirements must be tied to assets, actors, trust boundaries, and consequences. "The application must be secure" is not actionable. A more useful requirement identifies, for example, that only authorised clinical staff may view appointment details, that access decisions are enforced at the appropriate boundary, and that sensitive actions generate an auditable record.

Security cannot be delegated entirely to a final scan. Design choices, dependency management, identity architecture, secure defaults, deployment controls, monitoring, and incident response all affect it. Specialists provide essential expertise, while Quality Engineers help ensure that relevant security risks are represented in requirements, evidence, and production learning.

### Maintainability

**Maintainability** concerns the degree to which a product or system can be effectively and efficiently modified to correct defects, improve it, or adapt it to a changing environment. It is not synonymous with code style or a low count of static-analysis findings. It includes modularity, analysability, modifiability, and the ability to assess the effect of a change.

Maintainability is a business concern because systems are changed more often than they are initially written. A feature that is expensive or risky to change slows delivery, increases defect risk, and makes it harder to respond to a new regulation or customer need. It also affects the credibility of every future quality promise the team makes.

Evidence is necessarily indirect and contextual. Teams can examine dependency structure, review the scope of comparable changes, observe lead time, track repeated regression faults, assess diagnostic quality, and use code review to identify hidden coupling. No single maintainability metric should be treated as a final verdict.

### Flexibility and the Earlier Term "Portability"

The current model uses **flexibility**, while the 2011 model used **portability**. The practical question is whether the product can be adapted or used effectively as the relevant hardware, software, operational, or usage environment changes.

For a cloud-native system, flexibility may involve deploying across supported environments, changing capacity, adapting configuration without code duplication, moving a workload to a compatible execution environment, or supporting a new client interaction. It is not an argument for designing every component to run everywhere. Unnecessary abstraction can increase complexity and weaken maintainability.

The right flexibility requirement reflects a real expected change. A team that expects to support several regions, customer configurations, or deployment targets should make those assumptions explicit and evaluate them. A team that does not need those variations should avoid paying for flexibility it will not use.

### Safety

**Safety** is a top-level characteristic in ISO/IEC 25010:2023. It concerns freedom from unacceptable risk of harm to people, business, property, or the environment under specified conditions. The importance and formal treatment of safety depend heavily on the domain. For some systems it is a central engineering and regulatory concern; for others, its primary relevance may be preventing significant business or operational harm.

Safety should not be inferred from the presence of tests. It requires a clear understanding of hazardous outcomes, controls, assumptions, and evidence. When safety is material, teams need appropriate specialist expertise and must follow applicable domain standards and regulations.

### Engineering Capabilities Are Not Additional ISO Product-Quality Characteristics

**Observability**, **testability**, and **deployability** are essential to modern Quality Engineering, but this chapter treats them as engineering capabilities rather than additional top-level ISO/IEC 25010 product-quality characteristics.

- **Observability** is the ability to infer a system's internal state from its externally available signals, such as structured events, metrics, traces, and logs.
- **Testability** is the ability to set up, control, and assess a system efficiently in tests.
- **Deployability** is the ability to move a change into a target environment safely, repeatably, and with appropriate evidence.

These capabilities make quality easier to design, evaluate, and sustain. They influence product and service quality, but they answer a different question: can the team obtain trustworthy feedback and make safe changes? Treating them separately prevents a common mistake of assuming that a product-quality model alone describes everything needed to operate and evolve a system.

## Quality Trade-offs

Quality attributes are not a checklist to maximise independently. Decisions often improve one attribute while introducing cost, complexity, or pressure on another. A Quality Engineer makes these tensions visible so that teams can choose deliberately rather than discover the trade-off after a failure.

| Trade-off | Tension | Engineering response |
|---|---|---|
| Performance efficiency vs maintainability | An optimisation can add specialised code, caching, or concurrency control that is harder to understand and change. | Measure the relevant bottleneck, document the reason for the complexity, and design clear boundaries around it. |
| Security vs interaction capability | Stronger authentication or confirmation steps can increase protection but also add friction for legitimate users. | Base controls on risk, make safe paths understandable, and evaluate both attack resistance and task completion. |
| Reliability vs delivery speed | More validation, rollout safeguards, and recovery work can slow a change if designed as manual gates. | Automate proportionate controls, reduce batch size, use progressive exposure, and learn from delivery evidence. |
| Flexibility vs simplicity | Supporting multiple future environments or configurations can create abstraction and operational burden. | Build flexibility only for credible, stated variations; avoid speculative generality. |

The purpose of a trade-off discussion is not to seek a permanent balance. Context changes. A reliability target can become insufficient as a service becomes critical; a security control can need refinement as threats change; a performance constraint can become less important after an architecture decision. Quality requirements should be revisited when the context changes.

## Measuring Software Quality

Measurement turns quality conversations into evidence, but a metric is not quality itself. Every measure has a definition, a collection method, a time window, and a potential for misuse. A defect count may reflect product risk, but it can also reflect the number of people testing, the maturity of reporting, or the classification policy. A high deployment frequency may indicate healthy flow, or it may simply count low-risk configuration changes.

Start with a decision: what do we need to know, why does it matter, and what action will we take if the measure changes? ISO/IEC 25030:2019 connects quality requirements to the use of quality models and measurement as part of defining and governing expected quality.[^iso25030]

### Product and service measures

| Measure | What it can indicate | Definition and cautions |
|---|---|---|
| Defect density | Concentration of confirmed defects in a defined product area. | Count confirmed defects against a stated size unit, such as a component, function point, or code-volume measure. Useful only when the size and classification rules are stable; it is not a direct measure of user value. |
| Escaped defects | Problems discovered after a release or after a planned validation boundary. | Track the number, severity, and failure mode of defects found in production. Review the detection path rather than treating the count as an individual performance score. |
| Availability | Whether a service is usable for its intended requests over a stated period. | Define which requests count, what success means, and whether the measure reflects the user experience or only a server response. Availability does not by itself prove correct business outcomes. |
| Reliability metrics | Consistency of intended service behaviour over time. | Select measures that match the failure mode: successful workflow completion, data-correction rate, error rate, recovery success, or a service-level objective. Avoid a generic reliability number without context. |
| Customer satisfaction | Whether users perceive that the service meets their needs. | Use appropriately designed surveys, task feedback, support themes, retention signals, and qualitative research. Interpret alongside behaviour and context; survey scores alone are incomplete. |

### Delivery and recovery measures

| Measure | What it can indicate | Definition and cautions |
|---|---|---|
| Mean time to restore (MTTR) | How quickly a team restores service after a relevant failure. | Define the start and end points before comparing results. MTTR can hide variation, so review severity, cause, and distribution as well as the average. |
| Change failure rate | The proportion of deployments that require remediation because they impair service or require intervention. | Define a deployment and a failure consistently. Use it to improve delivery safety, not to penalise teams for surfacing problems. |
| Lead time for changes | How long it takes a change to travel from a defined starting point to production. | State the start point; DORA's current definition uses commit to successful production deployment. Long lead time can reveal queues, rework, or manual constraints, but not every slow change is poor practice. |
| Failed deployment recovery time | How quickly the team recovers when a production deployment fails and requires intervention. | DORA uses this current measure to focus recovery on impairment caused by a deployment, rather than every kind of operational incident.[^dora] |
| Deployment rework rate | The proportion of deployments that are unplanned work arising from a production incident. | DORA's current five-metric model includes this measure. Use it with the other delivery signals, not as an isolated target.[^dora] |

DORA's current guidance separates software-delivery throughput from instability and warns against using one measure as a universal target or comparing unrelated applications.[^dora] This reinforces a core MSQE principle: measures should inform improvement in the local system, not create a leaderboard detached from customer and engineering context.

### Build a balanced quality view

A balanced view combines measures from several perspectives:

- **Outcome:** task success, customer satisfaction, successful workflow completion, support contacts.
- **Product:** security findings, performance under defined load, accessibility evidence, defect and reliability patterns.
- **Delivery:** lead time, change failure rate, recovery time, deployment rework, validation evidence.
- **Engineering capability:** test feedback time, diagnosability, environment reproducibility, deployment safety, and time to understand a failure.

The right set is deliberately small. If a measure does not support a decision or an improvement action, it is probably creating reporting work rather than quality insight.

## Engineering Perspective

Quality is engineered continuously because every lifecycle decision constrains what can be achieved later. Requirements determine which outcomes and failure modes are visible. Architecture determines where dependencies, trust boundaries, and recovery paths exist. Implementation determines whether the design is realised clearly. Testability and automation determine how quickly selected behaviour can be evaluated. Deployment practices determine how safely a change reaches users. Operations determine whether the team can observe, diagnose, and recover from real conditions.

Inspection remains valuable, but it is a late and limited form of evidence. A final test can show that a selected condition passes; it cannot make a late design decision maintainable, reconstruct missing telemetry, or invent a recovery mechanism after an outage. The Quality Engineer helps the team identify these concerns while it still has meaningful design options.

For each significant quality requirement, connect four elements:

| Element | Question | Example: appointment rescheduling |
|---|---|---|
| Stakeholder outcome and risk | What must be true, and what harm follows if it is not? | Patient and clinician must share one accurate appointment state; incorrect state can lead to missed care. |
| Design control | What decision prevents, contains, or recovers from the failure? | Define idempotent reschedule commands, state transitions, and reconciliation behaviour. |
| Evaluation evidence | How will the team learn whether the control works? | Contract, workflow, and failure-mode checks exercise retries and delayed notifications. |
| Operational signal | How will the team know the control remains effective in use? | Monitor reconciliation mismatches and failed completion of the reschedule journey. |

This approach does not require excessive process. It makes the work proportionate: a low-risk internal change may need a brief discussion and focused checks; a high-consequence workflow may require formal analysis, specialist review, richer validation, and production safeguards.

## Industry Perspective

Modern engineering organisations increasingly treat quality as a cross-functional property of the product and the delivery system. Product, design, engineering, security, operations, data, and quality specialists contribute different expertise. The goal is not to dissolve professional boundaries; it is to avoid hand-offs that disconnect a decision from its operational consequences.

Publicly available practices illustrate this direction without prescribing a vendor-specific model. Google's SRE guidance uses service-level indicators—measures of user-relevant service behaviour—and objectives to connect that behaviour with measurable reliability targets; it treats error budgets as a way to make risk tolerance explicit.[^sre] DORA research treats delivery performance as a combination of throughput and instability and recommends using measures in the context of a particular application or service.[^dora] The IEEE Computer Society's SWEBOK Guide presents software quality, requirements, testing, maintenance, configuration management, and engineering management as related bodies of knowledge.[^swebok]

These are sources of principles, not a checklist to adopt wholesale. A team should choose methods, measures, and controls that match its domain, architecture, users, regulatory context, and consequences of failure. A safety-critical system may need independent assessment and formal assurance. A small internal reporting tool may need a lighter approach. Both still need an explicit understanding of what quality means for the people who rely on them.

## Common Misconceptions

### "More tests always mean better quality"

More tests can increase useful evidence, but only when they address meaningful risks and produce results the team can trust. A large suite of slow, brittle, redundant, or low-value checks can delay feedback and obscure the signals that matter.

### "Zero bugs means high quality"

Zero reported bugs may mean the product has few known defects. It does not establish that users can complete their goals, that quality attributes have been evaluated, that users report problems readily, or that the system will behave safely under changed conditions.

### "Testing guarantees quality"

Testing provides evidence about selected behaviours under selected conditions. It cannot guarantee that requirements are complete, that an architecture supports recovery, or that a service will meet every future operating condition. Testing is indispensable; it is not sufficient by itself.

### "Quality belongs only to QA"

Quality specialists bring valuable expertise, but the people who define requirements, design architecture, implement code, configure platforms, deploy changes, and operate services all influence quality. Shared ownership makes these contributions explicit without making accountability vague.

### "A quality model is a quality scorecard"

ISO/IEC 25010 is a reference model for thinking, specifying, measuring, and evaluating quality. It does not supply a universal score or tell a team which attribute matters most. The model must be applied to real stakeholder needs and trade-offs.

## Summary

Software quality is a multidimensional, context-dependent engineering property. It is not synonymous with low defect count, passing tests, or a single operational metric. Product quality, process quality, service quality, and engineering quality provide complementary perspectives on whether a system meets stakeholder needs and can continue to do so as it changes.

ISO/IEC 25010:2023 provides the current product-quality model with nine characteristics. Its earlier 2011 terms remain useful when reading legacy material, but they should not be taught as the current standard. Observability, testability, and deployability are cross-cutting engineering capabilities that help a team design, evaluate, and sustain quality; they are not additional top-level characteristics in the current ISO model.

Quality is engineered by making relevant outcomes, trade-offs, controls, evidence, and operational signals explicit throughout the lifecycle. The Quality Engineer helps turn broad expectations into decisions a team can design, evaluate, and improve.

## Key Takeaways

- Software quality is the context-dependent ability to satisfy relevant stakeholder needs and manage the consequences of failure over time.
- Quality is multidimensional: correct functionality alone does not establish performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, or safety.
- ISO/IEC 25010:2023 is the current product-quality model; its nine characteristics replace the withdrawn 2011 eight-characteristic model.
- Product, process, service, and engineering quality are related but distinct perspectives that must be considered together.
- Observability, testability, and deployability are engineering capabilities that support quality work, not additional top-level ISO product-quality characteristics.
- Metrics are decision aids. They need stable definitions, context, and an intended improvement action.
- Quality trade-offs should be made explicit and revisited as the system, its users, and its risks change.

## Review Questions

1. Why is "software without bugs" an incomplete definition of software quality?
2. How do product quality, process quality, service quality, and engineering quality differ?
3. Why should the ISO/IEC 25010:2011 model not be presented as the current product-quality model?
4. Which quality characteristics are most important for an online appointment service, and why?
5. Explain the difference between reliability and availability using an example.
6. Why are observability, testability, and deployability treated as engineering capabilities in this chapter?
7. What makes a quality metric useful rather than merely easy to collect?
8. Describe one quality trade-off that a team supporting your system must manage.

## Interview Questions

1. How would you define software quality to a product manager and to a software engineer?
2. Describe ISO/IEC 25010 and explain how you would use it when refining requirements.
3. A team reports high availability but receives complaints about incorrect customer balances. What would you investigate?
4. How would you choose quality metrics for a new cloud-native service?
5. Explain the difference between a product-quality characteristic and an engineering capability.
6. How do you make quality trade-offs visible before implementation?
7. Why is a green pipeline insufficient evidence that a production system is high quality?
8. How would you encourage shared ownership of quality while retaining clear accountability?

## Practical Exercise

Choose a system or feature you know well. Build a concise quality profile before proposing new tests or metrics.

### Step 1: Identify stakeholder outcomes and unacceptable failures

Complete the following statements:

- The primary user is trying to ________________.
- The business or operational outcome is ________________.
- An unacceptable failure would be ________________.
- The consequence of that failure would be ________________.

### Step 2: Prioritise quality characteristics

Select three to five quality characteristics that matter most for this feature. Include a reason and a trade-off to examine.

| Characteristic or capability | Why it matters | Likely trade-off | Evidence to seek |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

### Step 3: Define measures and actions

For each priority, choose a measure or evidence source. State what decision it will inform and what action the team would consider if the evidence is unsatisfactory.

| Priority | Measure or evidence | Decision informed | Possible action |
|---|---|---|---|
|  |  |  |  |
|  |  |  |  |
|  |  |  |  |

### Step 4: Review with the delivery team

Ask a product, engineering, operations, or support colleague:

- Which stakeholder outcome is missing?
- Which quality characteristic is being assumed rather than specified?
- Which measure could be misleading?
- What production signal would tell us that the feature remains fit for use?

> **Supporting asset (Pass 2, planned):** A practical worksheet will provide a printable quality-profile canvas for this exercise.

## Further Reading

- International Organization for Standardization. [ISO/IEC 25010:2023 — Product quality model](https://www.iso.org/standard/78176.html).
- International Organization for Standardization. [ISO/IEC 25030:2019 — Quality requirements framework](https://www.iso.org/standard/72116.html).
- International Organization for Standardization. [ISO 9000:2026 — Quality management — Fundamentals and vocabulary](https://www.iso.org/standard/9000).
- DORA. [Software delivery performance metrics](https://dora.dev/guides/dora-metrics/).
- Google. [Service Level Objectives](https://sre.google/sre-book/service-level-objectives/).
- IEEE Computer Society. [Guide to the Software Engineering Body of Knowledge (SWEBOK Guide), Version 4.0](https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics).

## References

[^iso9000]: International Organization for Standardization. [ISO 9000:2026 — Quality management — Fundamentals and vocabulary](https://www.iso.org/standard/9000). Published 2026. Accessed 2026-08-08.

[^square]: ISO/IEC JTC 1/SC 7. [ISO/IEC 25000 SQuaRE series](https://committee.iso.org/sites/jtc1sc7/home/projects/flagship-standards/iso-25000-square-series.html). Accessed 2026-08-08.

[^iso25030]: International Organization for Standardization and International Electrotechnical Commission. [ISO/IEC 25030:2019 — Systems and software engineering — Systems and software quality requirements and evaluation (SQuaRE) — Quality requirements framework](https://www.iso.org/standard/72116.html). Published 2019. Accessed 2026-08-08.

[^iso25010current]: International Organization for Standardization and International Electrotechnical Commission. [ISO/IEC 25010:2023 — Systems and software engineering — Systems and software Quality Requirements and Evaluation (SQuaRE) — Product quality model](https://www.iso.org/standard/78176.html). Published 2023. Accessed 2026-08-08.

[^iso25010legacy]: International Organization for Standardization and International Electrotechnical Commission. [ISO/IEC 25010:2011 — Systems and software engineering — Systems and software quality models (withdrawn)](https://www.iso.org/standard/35733.html). Published 2011. Accessed 2026-08-08.

[^dora]: Google Cloud. [DORA metrics](https://dora.dev/guides/dora-metrics/). Accessed 2026-08-08.

[^sre]: Google. [Service Level Objectives](https://sre.google/sre-book/service-level-objectives/). In *Site Reliability Engineering*. Accessed 2026-08-08.

[^swebok]: IEEE Computer Society. [Guide to the Software Engineering Body of Knowledge (SWEBOK Guide), Version 4.0](https://www.computer.org/education/bodies-of-knowledge/software-engineering/topics). Accessed 2026-08-08.

## Chapter Checklist

- [ ] I can define software quality from stakeholder, business, and engineering perspectives.
- [ ] I can distinguish the current ISO/IEC 25010 model from the withdrawn 2011 model.
- [ ] I can identify relevant quality characteristics and cross-cutting engineering capabilities for a feature.
- [ ] I can explain a quality trade-off and propose proportionate evidence for a decision.
- [ ] I can select measures that support improvement without treating metrics as a universal scorecard.
