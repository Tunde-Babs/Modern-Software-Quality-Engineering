# Part VII — Cloud & DevOps

---

## Curriculum Status

**Accelerated Pass 1, consolidated independent review, and light P3 normalization are complete; the Final Part VII Quality Gate is next.** The consolidated review assessed Part VII at **96/100** with no P0, P1, or P2 findings. Chapters 1–11 remain `Status: Draft`. Delivery 1 (Chapters 1–3), Delivery 2 (Chapters 4–6), Delivery 3 (Chapters 7–9), and Delivery 4 (Chapters 10–11) are drafted and normalized. The focused Chapter 6 boundary checkpoint found no P0 or P1 overlap, tool-neutrality, or applied-reasoning defect. This state does not claim release readiness.

No Part VII laboratory, companion implementation, standalone diagram, case-study file, CI/CD configuration, cloud resource, or website asset has been created. The Atlas Commerce Local Delivery Simulator, Labs 1–3, and any diagrams remain recommended Pass 2 enrichment.

---

## Mission

Part VII helps experienced QA Engineers become Quality Engineers who can reason about the systems that build, configure, package, promote, deploy, verify, recover, and operate software changes.

The central question is not *which cloud product or pipeline tool should a team use?* It is:

> **What delivery-system evidence justifies promoting this change, and how can the team make a safe, explainable decision when the environment, configuration, infrastructure, or deployment does not behave as expected?**

Cloud and DevOps are treated as quality-relevant properties of a delivery system: the change path, its mutable state, its evidence, its approvals, and its recovery options. The part teaches principles before tooling and uses products only as bounded illustrations. It is not a cloud-certification course, an Infrastructure-as-Code syntax reference, a Kubernetes administration guide, or a CI/CD product tutorial.

---

## Intended Reader and Prerequisites

This part is for experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers who already understand testing and automated feedback but need to participate credibly in delivery, environment, and release decisions.

Readers should have completed, or have equivalent capability from:

- Part I — Foundations of Modern Software Quality Engineering, particularly systems thinking, shared ownership, and quality as an engineered system property;
- Part II — Programming for Quality Engineers, particularly configuration, asynchronous behaviour, defensive utilities, diagnostics, and reviewable change practices;
- Part III — Software Testing Engineering, particularly risk-informed evidence, testability, regression strategy, and production learning;
- Part IV — API Quality Engineering, particularly contracts, dependencies, state, identity boundaries, and asynchronous behaviour;
- Part V — Automation Engineering, particularly deterministic, diagnosable automated feedback, test selection, and environment strategy; and
- Part VI — Data Quality Engineering, particularly pipeline boundaries, provenance, ownership, reconciliation, and evidence limitations.

---

## Learning Outcomes

On completion, readers should be able to:

- explain how cloud and DevOps choices change the quality risks, evidence needs, and ownership of software delivery;
- distinguish a delivery-system concern from a product test, an automation-system concern, an operational-reliability concern, or a specialist security/performance concern;
- describe environment purpose, parity limits, configuration ownership, and safe secret-handling boundaries;
- evaluate whether a container artifact, runtime assumption, infrastructure change, or pipeline result supports a bounded delivery claim;
- design proportionate evidence for infrastructure-as-code changes, promotion, deployment verification, release readiness, and recovery;
- compare deployment strategies using risk, blast radius, observability needs, reversibility, and customer impact rather than tool preference;
- make a reasoned rollback, roll-forward, pause, or recovery recommendation with stated uncertainty and ownership; and
- communicate a vendor-neutral Cloud & DevOps Quality Strategy and Release Evidence Portfolio.

---

## Position in the MSQE Learning Journey

| Established capability | Part VII application | Explicit boundary |
|---|---|---|
| Part III — risk-informed testing and evidence | Select delivery evidence that can support promotion or recovery decisions. | Does not repeat the full test-design or exploratory-testing curriculum. |
| Part IV — API contracts, state, dependencies, and diagnostics | Identify how a deployed change can alter boundary behaviour and what verification is proportionate. | Does not reteach API semantics, contract strategy, or identity engineering. |
| Part V — trustworthy automation systems and continuous feedback | Treat automated checks as one input to a release decision and define how their outputs move through a delivery system. | Does not design automation frameworks, browser suites, or test-selection mechanisms. |
| Part VI — pipeline quality, provenance, ownership, and reconciliation | Apply evidence and ownership reasoning to build artifacts, configuration, infrastructure changes, and deployment promotion. | Does not teach data-platform implementation or data-quality measurement. |
| Part VII — Cloud & DevOps | Engineer the delivery-system conditions under which changes can be built, configured, promoted, deployed, verified, recovered, and learned from. | Does not provide deep observability/SRE, performance/security, or architecture-design curricula. |

**Part V / Part VII boundary:** Part V asks what quality checks should run, how automation remains deterministic and diagnosable, and how feedback should be selected. Part VII asks how the delivery system turns an approved change into a versioned artifact, applies controlled configuration and infrastructure, promotes and deploys it, gathers bounded release evidence, and recovers safely.

---

## Curriculum Architecture

Eleven chapters form a progression from delivery-system context and controlled state to infrastructure and pipeline evidence, then to deployment judgement, recovery, and a portfolio-ready strategy. The planned count is deliberately smaller than a vendor curriculum: it supports depth without treating every platform feature as a separate capability.

1. **Cloud & DevOps Quality Engineering: Delivery Systems, Evidence, and Boundaries**
2. **Environment Strategy, Configuration, and Secret Boundaries**
3. **Container Artifacts, Runtime Assumptions, and Reproducible Delivery**
4. **Infrastructure as Code: Change Evidence, Review, and Drift**
5. **Delivery Pipelines as Quality Systems**
6. **Deployment Strategies, Progressive Delivery, and Release Exposure**
7. **Deployment Verification and Release Evidence**
8. **Rollback, Roll-Forward, and Recovery Decisions**
9. **Release Readiness, Promotion, and Operational Handoffs**
10. **DevOps Collaboration, Delivery Learning, and Sustainable Change**
11. **Capstone: Cloud & DevOps Quality Strategy and Release Evidence Portfolio**

Each technical chapter contains at least one worked, clearly labelled **illustrative Atlas Commerce scenario**. The scenario makes the decision, evidence, limitation, owner, and residual risk explicit; it does not claim that a fictional result proves production readiness.

---

## Proposed Chapter Architecture

### Chapter 1 — Cloud & DevOps Quality Engineering: Delivery Systems, Evidence, and Boundaries

- **Mission:** Establish the delivery system as a quality-relevant system rather than treating cloud hosting or pipeline success as evidence of a safe release.
- **Major concepts:** Cloud service and deployment models; delivery-system boundaries; artifact, configuration, infrastructure, and environment state; shared responsibility; change path; quality claim; control; evidence; owner; residual risk.
- **QA → QE contribution:** Moves from verifying an application in a test environment to defining the system conditions and evidence needed to justify a delivery decision.
- **Practical artifact:** Cloud Delivery Risk and Evidence Map for an illustrative Atlas Commerce checkout change.
- **Scope boundary:** Does not teach cloud-account setup, provider comparison, platform certification, or deep system architecture.
- **Prerequisites:** Parts I, III, and V.
- **Later handoff:** Environment and configuration assumptions in Chapter 2; delivery-system risks recur in the capstone.

### Chapter 2 — Environment Strategy, Configuration, and Secret Boundaries

- **Mission:** Teach environment purpose, parity limits, effective configuration, and secret boundaries as controlled delivery-system state.
- **Major concepts:** Development, test, staging, production, and ephemeral environments; environment purpose; parity and intentional difference; configuration source and precedence; feature flags as release state; secret references; rotation and access boundaries; configuration drift; safe diagnostics.
- **QA → QE contribution:** Replaces “it passed in staging” with a bounded comparison of environment assumptions, configuration provenance, and remaining production uncertainty.
- **Practical artifact:** Environment and Configuration Assumption Register, including owner, source, validation, and escalation path.
- **Scope boundary:** Does not prescribe a secret manager, feature-flag product, cloud identity service, or configuration framework.
- **Prerequisites:** Chapter 1; Part II configuration and error-handling foundations.
- **Later handoff:** Container runtime inputs in Chapter 3, infrastructure declarations in Chapter 4, and release readiness in Chapter 9.

### Chapter 3 — Container Artifacts, Runtime Assumptions, and Reproducible Delivery

- **Mission:** Treat the packaged artifact and its runtime assumptions as inspectable evidence, without becoming a container-command reference.
- **Major concepts:** Immutable artifact; image, manifest, registry, digest, provenance; build context; runtime configuration; process lifecycle; health/readiness distinction; resource assumptions; compatibility; reproducibility; artifact promotion.
- **QA → QE contribution:** Moves from “the container started” to an explainable claim about what artifact ran, under which declared assumptions, and what a start signal does not prove.
- **Practical artifact:** Artifact-to-Runtime Evidence Brief that records identity, inputs, runtime assumptions, verification, limitations, and rollback compatibility.
- **Scope boundary:** Does not teach Dockerfile syntax exhaustively, registry operation, Kubernetes administration, or production capacity tuning.
- **Prerequisites:** Chapters 1–2; Part II modules and configuration concepts.
- **Later handoff:** Infrastructure declarations in Chapter 4 and pipeline artifact flow in Chapter 5.

### Chapter 4 — Infrastructure as Code: Change Evidence, Review, and Drift

- **Mission:** Establish infrastructure-as-code (IaC) as versioned, reviewable infrastructure intent whose applied state still needs evidence.
- **Major concepts:** Declarative and imperative intent; desired versus actual state; plan; apply; review; dependency ordering; immutable and mutable infrastructure; drift; idempotence; change impact; policy boundary; safe rollback assumptions; evidence limitations.
- **QA → QE contribution:** Shifts the reader from accepting an IaC tool’s successful execution to assessing what changed, which state is evidenced, who reviewed it, and what drift or dependency risk remains.
- **Practical artifact:** Infrastructure Change Evidence Record with a change hypothesis, review questions, expected state, verification boundary, and recovery decision points.
- **Scope boundary:** Does not teach Terraform, Pulumi, CloudFormation, Bicep, Kubernetes manifests, or cloud-provider provisioning syntax.
- **Prerequisites:** Chapters 1–3; Part II Git and review practices.
- **Later handoff:** Pipeline policy and promotion in Chapter 5; deployment blast radius and recovery in Chapters 6–8.

### Chapter 5 — Delivery Pipelines as Quality Systems

- **Mission:** Teach a pipeline as a release system that coordinates versioned inputs, automated evidence, approvals, artifacts, environments, and traceable decisions.
- **Major concepts:** Trigger; workflow; build; test; package; artifact repository; provenance; promotion; quality gate; approval; pipeline configuration; credential boundary; rerun; failure classification; reproducibility; evidence retention; delivery-system failure modes.
- **QA → QE contribution:** Moves from “the CI job is green” to judging whether a pipeline result is attributable, reproducible, appropriately gated, and sufficient for the specific promotion decision.
- **Practical artifact:** Delivery Evidence Flow and Gate Rationale, including inputs, outputs, decision owner, failure paths, and known blind spots.
- **Scope boundary:** Does not implement GitHub Actions, GitLab CI, Azure DevOps, Jenkins, a runner fleet, or a test framework.
- **Prerequisites:** Chapters 1–4; Part V continuous-feedback strategy.
- **Later handoff:** Exposure strategies in Chapter 6 and verification evidence in Chapter 7.

### Chapter 6 — Deployment Strategies, Progressive Delivery, and Release Exposure

- **Mission:** Compare deployment strategies through change exposure, reversibility, evidence latency, and customer impact rather than popularity or platform terminology.
- **Major concepts:** Deployment versus release; rolling, blue-green, canary, and staged delivery; progressive exposure; feature flags; blast radius; cohort; compatibility; stateful change; pause criteria; release hypothesis; decision threshold.
- **QA → QE contribution:** Replaces a deployment checklist with an explicit choice of exposure strategy and evidence plan appropriate to the risk and recovery options.
- **Practical artifact:** Deployment Strategy Decision Record for the Atlas Commerce checkout change, with rejected alternatives and pause/continue criteria.
- **Scope boundary:** Does not configure traffic routing, Kubernetes deployments, service mesh products, or feature-flag platforms.
- **Prerequisites:** Chapters 1–5; Part IV state and compatibility reasoning.
- **Later handoff:** Deployment verification in Chapter 7; recovery decisions in Chapter 8.

### Chapter 7 — Deployment Verification and Release Evidence

- **Mission:** Define what should be verified after deployment, how to avoid circular or insufficient evidence, and when evidence supports a release decision rather than a claim of universal health.
- **Major concepts:** Deployment verification versus general monitoring; smoke and synthetic checks; contract and workflow probes; version confirmation; configuration confirmation; data/state safeguards; independent oracle; timing window; evidence freshness; false assurance; limitation statement.
- **QA → QE contribution:** Moves from executing post-deploy checks to composing proportionate evidence that can support a go, pause, investigate, or recover decision.
- **Practical artifact:** Deployment Verification Plan and Evidence Log with claim, probes, owners, time window, limitations, and escalation conditions.
- **Scope boundary:** Does not teach observability platform configuration, SLO design, incident command, or long-term production monitoring.
- **Prerequisites:** Chapters 1–6; Part III evidence and regression strategy; Part V diagnostics.
- **Later handoff:** Rollback/roll-forward judgement in Chapter 8 and observability/reliability depth in Part VIII.

### Chapter 8 — Rollback, Roll-Forward, and Recovery Decisions

- **Mission:** Treat recovery as a planned delivery capability rather than an automatic rollback command or a retrospective blame exercise.
- **Major concepts:** Reversibility; backward and forward compatibility; rollback; roll-forward; disablement; restore; recovery point; recovery objective; data/schema compatibility; decision authority; time pressure; evidence preservation; customer impact; post-change learning.
- **QA → QE contribution:** Replaces “roll back if it fails” with an evidence-based recommendation that considers compatibility, data state, available recovery paths, ownership, and uncertainty.
- **Practical artifact:** Recovery Decision Record that compares rollback, roll-forward, pause, and containment options.
- **Scope boundary:** Does not provide disaster-recovery implementation, incident-command training, chaos engineering, or database restoration procedures.
- **Prerequisites:** Chapters 4–7; Part IV state and asynchronous behaviour; Part VI reconciliation concepts where data state is affected.
- **Later handoff:** Release readiness in Chapter 9; incident response and reliability engineering in Part VIII.

### Chapter 9 — Release Readiness, Promotion, and Operational Handoffs

- **Mission:** Make readiness a reviewable, context-sensitive decision that joins delivery evidence, operational context, ownership, and recovery preparation.
- **Major concepts:** Readiness claim; promotion criteria; change record; release evidence portfolio; acceptance and residual risk; ownership and on-call handoff; support readiness; change window; decision log; escalation; release communication; auditability.
- **QA → QE contribution:** Shifts the reader from completing a generic release checklist to assembling the evidence and accountability needed for a specific release decision.
- **Practical artifact:** Release Readiness Brief with evidence links, known limitations, decision authority, recovery readiness, and communication plan.
- **Scope boundary:** Does not create organisational change-management bureaucracy, implement compliance controls, or replace operational leadership.
- **Prerequisites:** Chapters 1–8.
- **Later handoff:** Sustainable delivery learning in Chapter 10 and final portfolio integration in Chapter 11.

### Chapter 10 — DevOps Collaboration, Delivery Learning, and Sustainable Change

- **Mission:** Connect shared ownership, review, delivery failures, and improvement work without reducing DevOps to a team name, culture slogan, or metric target.
- **Major concepts:** Shared responsibility; platform and product-team interfaces; ownership; service and delivery documentation; feedback loop; delivery-system defect; learning review; change failure; improvement hypothesis; delivery debt; safe experimentation; measurement limits.
- **QA → QE contribution:** Moves from reporting failed builds or releases to turning delivery evidence into a proportionate, owned improvement in the delivery system.
- **Practical artifact:** Delivery Learning Review and Improvement Proposal that distinguishes observed facts, interpretation, action, owner, and follow-up evidence.
- **Scope boundary:** Does not prescribe an operating model, mandate DORA metrics, teach SRE practice in depth, or make cultural claims unsupported by local evidence.
- **Prerequisites:** Chapters 1–9; Part I engineering culture and Part III production learning.
- **Later handoff:** The capstone in Chapter 11; continuous operational learning, SLOs, and incident practice in Part VIII.

### Chapter 11 — Capstone: Cloud & DevOps Quality Strategy and Release Evidence Portfolio

- **Mission:** Integrate Part VII into a portfolio-ready strategy for a fictional change that crosses code, configuration, artifacts, infrastructure, promotion, deployment, verification, and recovery.
- **Major concepts:** Delivery-system context; environment and configuration assumptions; artifact identity; IaC change evidence; pipeline gate rationale; deployment strategy; verification; recovery; readiness; ownership; residual risk; decision brief.
- **QA → QE contribution:** Demonstrates the ability to make a system-level delivery recommendation rather than merely execute test, pipeline, or deployment steps.
- **Practical artifact:** Cloud & DevOps Quality Strategy and Release Evidence Portfolio, plus a concise Release Decision Brief.
- **Scope boundary:** Does not require a cloud account, live credentials, actual deployment, executable IaC, vendor toolchain, production system, or companion application.
- **Prerequisites:** Chapters 1–10.
- **Later handoff:** Part VIII for ongoing operational evidence and reliability; Part X for deep performance/security concerns; Part XI for architecture decisions.

---

## Curriculum Progression

The sequence moves through four professional questions:

1. **What delivery system is making the change, and what state can affect its quality?** Chapters 1–3 establish delivery context, environments, configuration, artifacts, and runtime assumptions.
2. **How is delivery intent changed, evaluated, and promoted?** Chapters 4–6 make infrastructure and pipeline changes inspectable, then choose a proportionate release-exposure strategy.
3. **What evidence supports a release or recovery decision?** Chapters 7–9 distinguish deployment verification, recovery options, and readiness from unbounded assurance claims.
4. **How does the team sustain and demonstrate delivery-system quality?** Chapters 10–11 turn ownership and learning into an integrated evidence portfolio.

Normal chapters target **4,000–5,500 words**. Chapters 5, 7, 8, and 9 may target **4,500–6,000 words** because they integrate multiple decisions. The capstone may target **6,000–8,000 words** because it synthesizes previous artifacts; it should not introduce a new technical specialism.

---

## Cloud, Tool, and Technology Strategy

Part VII is vendor-neutral by design. Teaching will use this sequence:

1. delivery-system problem and quality risk;
2. transferable engineering principle and evidence boundary;
3. trade-offs and limitations;
4. optional, clearly labelled product-category illustration.

Examples may refer to a *CI orchestrator*, *artifact registry*, *container runtime*, *infrastructure-as-code engine*, *secret-management service*, *deployment controller*, or *observability signal* before naming a product. Docker, Kubernetes, Terraform, Pulumi, CloudFormation, Bicep, GitHub Actions, GitLab CI, Azure DevOps, Jenkins, AWS, Azure, Google Cloud, and similar technologies may appear only as bounded illustrations. No proficiency claim, setup guide, certification objective, or product comparison is part of the manuscript scope.

Container material uses the Open Container Initiative’s interoperable image, runtime, and distribution concepts. Kubernetes may illustrate declarative deployment intent, but cluster administration, networking, autoscaling, security hardening, and platform operations are excluded. Infrastructure-as-code examples will be pseudocode, diff-oriented declarations, or tool-neutral plans unless a separately approved and validated executable example becomes necessary.

---

## Scope Boundaries and Handoffs

| Part | Part VII responsibility | What remains outside Part VII |
|---|---|---|
| Part III — Software Testing Engineering | Use test and exploration evidence appropriately in a release decision. | Test-design methods, testing theory, and exploratory investigation depth. |
| Part IV — API Quality Engineering | Verify deployed API behaviour where it supports the release hypothesis. | Protocol semantics, API contracts, API security, and API strategy depth. |
| Part V — Automation Engineering | Route automation outputs through a delivery system and use them as bounded release evidence. | Automation architecture, selection, fixtures, browser/UI automation, and test execution design. |
| Part VI — Data Quality Engineering | Consider delivery effects on data change, compatibility, reconciliation, and ownership. | Data modelling, pipeline implementation, data-quality strategy, and analytics integrity. |
| Part VIII — Observability & Reliability Engineering | Hand off ongoing operation, SLOs, telemetry design, incident response, chaos, and resilience engineering. | Deep operational observability and reliability practice. |
| Part X — Performance & Security Engineering | Recognize release risks and request appropriate specialist evidence. | Load/performance engineering, threat modelling, vulnerability assessment, and security-control implementation. |
| Part XI — System Design & Architecture | State architectural constraints that affect delivery decisions. | Architecture design, distributed-system design, and scalability strategy. |

This part owns the **delivery pipeline as a release system**. It does not own every test that runs in it, every signal observed after release, or every infrastructure/security/performance design decision that affects it.

---

## Practical-Learning and Worked-Scenario Strategy

The recurring **Atlas Commerce** scenario is fictional and will be labelled as illustrative in every chapter. A checkout change combines a versioned application artifact, environment-specific configuration, an infrastructure declaration, a third-party payment dependency, a staged rollout, a deployment verification window, and a recovery choice. It gives every chapter a coherent but bounded decision context without claiming to model a real production system.

Each chapter artifact will be concise and inspectable. It must state:

- the decision, consumer, and accountable owner;
- the relevant change, environment, configuration, artifact, or infrastructure assumptions;
- the selected evidence and what it establishes;
- known limitations, uncertainty, and residual risk;
- escalation, pause, recovery, or review conditions; and
- how credentials, confidential configuration, customer data, and operationally sensitive information are omitted or safely abstracted.

The chapter artifacts and capstone are required manuscript learning activities. They do not imply that a standalone lab, executable repository, case study, or diagram set is required for the Part VII release.

---

## Companion, Laboratory, and Asset Classification

Quality Gates v1.1 requires explicit classification of every planned standalone practical asset. Part VII’s manuscript can meet its learning outcomes through reviewed scenarios, exercises, professional artifacts, and the capstone without requiring access to a cloud account, credentials, paid service, or a particular toolchain.

| Planned asset | Classification | Rationale and release treatment |
|---|---|---|
| Atlas Commerce Local Delivery Simulator | **Recommended Pass 2 enrichment** | A deterministic local simulator could let learners rehearse artifact, configuration, promotion, verification, and recovery decisions without live cloud access. It is not required for the manuscript release and must have its own reproducibility, safety, and executable validation if later approved. |
| Lab 1 — Environment and Configuration Drift Investigation | **Recommended Pass 2 enrichment** | Reinforces environment/parity and configuration evidence using safe synthetic inputs. It is deferred and not represented as delivered. |
| Lab 2 — Infrastructure Change and Deployment Evidence | **Recommended Pass 2 enrichment** | Reinforces review of an IaC-like change and a deployment evidence record without provisioning infrastructure. It is deferred and not represented as delivered. |
| Lab 3 — Progressive Delivery and Recovery Decision | **Recommended Pass 2 enrichment** | Reinforces exposure, pause, and recovery judgement through a deterministic scenario. It is deferred and not represented as delivered. |
| Delivery-system state, evidence-flow, and recovery-decision diagrams | **Recommended Pass 2 enrichment** | Diagrams are useful where a visual relationship materially improves understanding. They are not required for the manuscript release and require accessibility/render validation if later added. |
| Standalone case study or executable IaC example | **Not planned for Pass 1; any future asset is Pass 2 and requires separate classification** | Chapter scenarios and non-executable, tool-neutral examples serve the planned learning objectives. A future asset may not be introduced or reclassified without approval and applicable validation. |

**Required practical-asset determination:** No standalone companion, laboratory, diagram set, case study, or executable IaC example is required for the Part VII manuscript release. This is not a validation bypass: the manuscript must still provide and validate the chapter exercises, worked scenarios, professional artifacts, capstone, technical claims, references, Markdown, and independent quality review required by the Manuscript Quality Gate. Any future Pass 2 asset must be validated before publication.

---

## Capstone Design

The capstone uses the fictional Atlas Commerce checkout change. The learner proposes—not implements—a Cloud & DevOps Quality Strategy and Release Evidence Portfolio for a release that changes an application artifact, configuration, an infrastructure declaration, and payment-flow behaviour.

The portfolio must include:

- a delivery-system context and risk map;
- environment, configuration, secret, artifact, and IaC assumptions;
- pipeline gates and promotion rationale;
- a deployment strategy with exposure and pause criteria;
- deployment verification evidence, limitations, and escalation conditions;
- recovery options with rollback, roll-forward, and compatibility considerations;
- a release-readiness decision, accountable owners, and residual risk; and
- a concise Decision Brief that separates facts, interpretation, recommendation, and unresolved uncertainty.

No real cloud infrastructure, production data, credential, deployment, monitoring account, or live incident is required.

---

## Reference and Research Strategy

The chapters distinguish authority from MSQE teaching interpretation. Source selection follows this hierarchy: formal standards and interoperable specifications first; primary project documentation and empirical research second; narrowly relevant vendor documentation only for labelled illustrations; and original MSQE teaching models only when explicitly identified as such.

- **Cloud concepts:** [NIST SP 800-145](https://csrc.nist.gov/pubs/sp/800/145/final) provides stable cloud-computing terminology. It informs definitions; it does not prescribe a cloud vendor or architecture.
- **Cloud-native and container concepts:** [Cloud Native Computing Foundation definitions](https://github.com/cncf/toc/blob/main/DEFINITION.md), [Open Container Initiative specifications](https://opencontainers.org/), and [Kubernetes concepts](https://kubernetes.io/docs/concepts/) provide primary vocabulary for bounded examples. They do not become certification syllabi or required implementations.
- **Delivery and DevOps research:** [DORA’s documented DevOps capabilities](https://cloud.google.com/architecture/devops) and the [State of DevOps research](https://cloud.google.com/resources/state-of-devops) can inform discussions of delivery capabilities, culture, and measurement limitations.
- **Version-control and software-delivery foundations:** [Git documentation](https://git-scm.com/docs) and primary standards or official documentation appropriate to a focused claim.
- **Security-sensitive delivery boundaries:** [NIST SP 800-218, Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) and [OpenSSF best-practice resources](https://openssf.org/best-practices/) may inform a narrow supply-chain or credential-boundary claim. Security control design remains Part X.
- **Original MSQE framing:** The delivery evidence flow, portfolio, decision brief, and artifact templates are MSQE teaching models and will be labelled as such. They are not presented as industry standards.

### DORA treatment

DORA research is used as contextual, empirical research about delivery capabilities and outcomes—not as a universal scorecard, a four-metric target, proof of causation for a single intervention, or a basis for comparing unrelated teams. The chapters state the measurement context, avoid metric theatre, and distinguish delivery throughput, stability, reliability, and local decision evidence.

---

## MQE-BOK and QA → QE Transition Mapping

**Primary MQE-BOK domain:** **Domain 7 — Cloud & DevOps.** The part develops the Domain 7 outcome: integrating Quality Engineering practices into modern cloud platforms.

**Contributing MQE-BOK domains:** Domain 1 (shared ownership and systems thinking), Domain 2 (configuration, diagnostics, and collaborative code), Domain 3 (risk-informed evidence), Domain 4 (service boundaries), Domain 5 (automation feedback systems), Domain 6 (pipeline and provenance reasoning), Domain 8 (operational handoff), Domain 10 (specialist security/performance escalation), and Domain 11 (architecture constraints).

**QA → QE transition:** The learner progresses from validating a deployed application and reporting a pipeline result to reasoning about the delivery system as a controlled, socio-technical system. The intended capability is practitioner-to-engineer judgement: selecting evidence proportionate to a change, stating what it cannot prove, assigning ownership, and recommending promotion, pause, recovery, or learning action without claiming universal readiness.

---

## Delivery Structure and Accelerated Production Model

| Delivery | Chapters | Capability focus | Cumulative professional artifacts |
|---|---:|---|---|
| Delivery 1 — Delivery Context and Controlled State | 1–3 | **Drafted and normalized; all chapters Draft.** Delivery-system quality, environments, configuration, secrets, artifacts, and runtime assumptions. | Cloud Delivery Risk and Evidence Map; Environment and Configuration Assumption Register; Artifact-to-Runtime Evidence Brief. |
| Delivery 2 — Versioned Delivery Intent and Exposure | 4–6 | **Drafted and normalized; all chapters Draft.** IaC evidence, pipeline design, promotion, and release exposure. | Infrastructure Change Evidence Record; Delivery Evidence Flow and Gate Rationale; Deployment Strategy Decision Record. |
| Delivery 3 — Verification, Recovery, and Readiness | 7–9 | **Drafted and normalized; all chapters Draft.** Deployment verification, recovery choices, promotion, and operational handoff. | Deployment Verification Plan; Recovery Decision Record; Release Readiness Brief. |
| Delivery 4 — Sustainable Delivery and Integration | 10–11 | **Drafted and normalized; all chapters Draft.** Collaboration, learning, and system-level delivery judgement. | Delivery Learning Review; Cloud & DevOps Quality Strategy and Release Evidence Portfolio. |

The accelerated model preserves depth and independent review:

1. **Architecture approval:** completed before manuscript drafting.
2. **Accelerated Pass 1 drafting:** completed across the four coherent delivery batches using the approved chapter template, established terms, and Atlas Commerce scenarios.
3. **Early boundary checkpoint after Chapter 6:** completed with no P0/P1 concern. Chapters 1–6 retain delivery-system focus, limited data/schema examples to compatibility, defer Part VIII operational depth, avoid Part X/XI specialist depth, and keep tools illustrative.
4. **Consolidated independent review:** completed at **96/100** with no P0, P1, or P2 findings.
5. **Light P3 normalization:** completed for citation precision and repeated phrasing; all chapters remain Draft.
6. **Final Part VII Quality Gate:** **next gate.** It remains separate from release administration and any later release baseline.

The architecture decision itself did not constitute drafting. The completed Pass 1 chapters use the approved template, including Metadata, Opening Quote or Motivating Scenario, Why This Chapter Matters, Learning Objectives, Engineering Perspective, Industry Perspective, misconceptions/pitfalls where relevant, Practical Exercise, Further Reading, References, and Chapter Checklist.

---

## Definition of Done for Part VII Manuscript Work

Part VII may be considered ready for its planned manuscript release only when:

1. this curriculum architecture and its boundaries are approved;
2. all eleven chapters are drafted to the approved template and accurately retain `Status: Draft` until governance authorizes a later status;
3. every chapter includes its planned illustrative scenario, practical artifact, source-backed claims, stated limitations, and cross-part handoff;
4. the early Chapter 6 boundary checkpoint, consolidated independent review, targeted corrections, and comprehensive normalization are complete;
5. the Manuscript Quality Gate passes with no unresolved P0, P1, or release-blocking P2 findings;
6. all planned practical assets remain accurately classified, and any future required asset passes its applicable Required Practical Asset Gate; and
7. release administration, versioning, repository, and publication validation are completed only when separately authorized.

---

## Website Discovery and Future Assets

Part VII manuscript material is discoverable at:

- `book/part-07-cloud-devops/README.md`
- `book/part-07-cloud-devops/chapters/` for the Pass 1 Draft manuscripts
- `book/part-07-cloud-devops/labs/` only after separately authorized Pass 2 laboratory work
- `code/part-07-cloud-devops/` only after separately authorized companion work

The website is a separate parallel track and is not modified by this curriculum architecture.
