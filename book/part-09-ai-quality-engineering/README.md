# Part IX — AI Quality Engineering

---

## Curriculum Status

**Part IX curriculum architecture is approved; accelerated Full Pass 1 and depth-completion work are complete, and the Final Part IX Quality Gate passed at 97/100.** P0, P1, P2, and P3 findings are **none**, and manuscript quality is accepted. All 12 chapters remain **Draft** under manuscript-status governance. No companion implementation, laboratory, diagram, dataset, evaluation code, case-study file, website asset, CI/CD configuration, or infrastructure has been created; these practical assets remain deferred to Pass 2 enrichment.

The planned release is **v0.12.0 — AI Quality Engineering Complete** and remains unreleased. The part has followed the MSQE accelerated workflow: architecture approval, one coherent Full Pass 1 across internal batches, one consolidated independent review, one targeted correction and normalization pass, one focused closure review, and one Final Part IX Quality Gate. Controlled manuscript baseline `4df2b8d2409cfa0fc474cad8e1bbdbe652eb9dd5` is established, and release administration is active.

The manuscript records the architecture, scope boundaries, and practical-asset classifications. It does not authorize practical assets or Part X work.

---

## Mission

Part IX develops the ability to evaluate AI-enabled systems as systems with uncertain, contextual, and sometimes probabilistic behaviour. It moves the reader from a narrow question—*“Did the AI give the expected answer?”*—to a decision-oriented question:

> What behaviour are we evaluating, for which input population, against which oracle or evaluation method, with what uncertainty, safety constraints, failure modes, evidence limitations, and decision threshold?

The part treats AI quality as an engineering concern that combines conventional software quality with model, data, retrieval, prompt, tool-use, evaluation, and operational evidence. It does not treat all failures as model failures, and it does not reduce AI Quality Engineering to testing prompts or comparing a few generated answers.

The purpose is not to prescribe an AI provider, evaluation platform, framework, vector database, or universal quality score. It is to teach Quality Engineers how to formulate bounded quality claims, select proportionate evidence, expose uncertainty, distinguish failure boundaries, and communicate residual AI risk.

---

## Intended Reader and Prerequisites

Part IX is for experienced QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers who need to evaluate AI-enabled and AI-native systems without losing the engineering discipline established in earlier parts.

Completion of Parts I–VIII is recommended, particularly:

- Part I for systems thinking and the principle that quality is engineered rather than inspected in;
- Part II for reading and reviewing executable quality utilities;
- Part III for evidence, risk, test design, oracles, investigation, and testability;
- Part IV for contracts, state, dependencies, and boundary behaviour;
- Part V for trustworthy automated feedback and its limits;
- Part VI for data quality, representativeness, lineage, provenance, and decision integrity;
- Part VII for delivery systems, controlled change, and operational readiness; and
- Part VIII for operational evidence, observability limits, reliability claims, and learning from runtime behaviour.

Readers do not need access to a production model, cloud AI platform, vector database, or commercial evaluation tool. All planned scenarios and evidence will be synthetic and clearly labelled as illustrative.

---

## Scope and Boundaries

| Part IX owns | Part IX does not own |
| --- | --- |
| AI-system quality claims, evaluation boundaries, uncertainty, and evidence limitations | A universal AI-certification scheme or a claim that one evaluation proves system safety or correctness |
| Evaluation data, oracle strategies, representative slices, leakage, contamination, and change-aware evaluation | General data-pipeline engineering and enterprise data governance, which remain Part VI concerns |
| Predictive, ranking, generative, retrieval-augmented, and bounded tool-using AI quality | Provider-specific SDK tutorials, model fine-tuning procedures, or mandatory use of an AI platform |
| Classification metrics, threshold decisions, calibration concepts, robustness, and regression evidence | A machine-learning mathematics course or universal performance targets |
| Generative-output criteria, rubric evaluation, human evaluation, and model-based evaluator limitations | Treating LLM-as-judge as objective truth or replacing domain accountability with an evaluator score |
| Retrieval quality, groundedness, citation correctness, and RAG failure boundaries | Vector-database operations or retrieval-infrastructure implementation tutorials |
| Tool-call, state, memory, permission, confirmation, retry, and termination evidence for bounded agentic systems | Unbounded autonomy, agent-framework implementation, or production-agent deployment |
| Quality-relevant safety, fairness, privacy, and transparency questions | Legal advice, enterprise Responsible AI governance, deep offensive security, or leadership-governance curricula |
| AI regression and production-learning evidence | Deep observability implementation, which remains Part VIII, or deep performance and security engineering, which remain Part X |

The boundaries with adjacent parts are deliberate:

- Part III owns general testing strategy, evidence, risk analysis, and testability. Part IX applies those foundations where deterministic expected-output checks may be insufficient.
- Part IV owns API quality and boundary contracts. Part IX uses interfaces, tools, and external services as AI-system boundaries; it does not repeat general API engineering.
- Part V owns automation-system design. Part IX specifies what trustworthy AI evaluation feedback should establish, not an automation framework or execution platform.
- Part VI owns data quality. Part IX uses its concepts to reason about evaluation-set representativeness, provenance, leakage, contamination, and drift without reteaching data engineering.
- Part VII owns CI/CD and controlled delivery. Part IX identifies AI changes that require re-evaluation but does not prescribe pipeline implementation.
- Part VIII owns observability and reliability engineering. Part IX consumes operational evidence for AI quality decisions and does not duplicate telemetry design or reliability practice.
- Part X owns deep performance and security engineering. Prompt injection, jailbreaks, and unsafe tool actions appear here only as bounded AI quality and security interfaces.
- Part XI owns system architecture. Part IX discusses architecture only far enough to establish evaluation and failure boundaries.
- Part XII owns engineering leadership and governance depth. Part IX identifies ownership and escalation needs without becoming a governance, legal, or management curriculum.

---

## Learning Outcomes

After completing the planned manuscript and its exercises, readers should be able to:

- distinguish deterministic software checks from AI-system evaluation under uncertainty;
- define an AI system boundary and separate application, integration, retrieval, model, prompt, tool-use, data, oracle, and observability failures;
- choose evaluation evidence appropriate to predictive, ranking, generative, RAG, and bounded agentic behaviours;
- design and critique evaluation data for population coverage, slices, provenance, leakage, contamination, privacy, and change;
- interpret confusion matrices, accuracy, precision, recall, specificity, F1, threshold trade-offs, class imbalance, and error cost without overclaiming;
- evaluate generative output through bounded criteria such as factuality, groundedness, relevance, completeness, instruction following, schema compliance, refusal quality, and safety;
- use human, reference-based, reference-free, rubric, pairwise, and model-based evaluators while stating their limitations;
- define valid metamorphic relations and property-oriented checks without assuming that every transformation should preserve output;
- assess robustness to noisy, malformed, conflicting, adversarial, and prompt-injection inputs within an explicit security boundary;
- distinguish retrieval quality from generation quality and investigate citation, grounding, freshness, ranking, and context failures;
- evaluate tool selection, tool arguments, permissions, confirmations, state, memory, retries, termination, and intermediate actions in bounded agentic systems;
- compare quality evidence across relevant subgroups and communicate fairness, privacy, safety, and transparency limitations without claiming a universal fairness result;
- define a change-aware AI regression strategy for model, prompt, retrieval, tool, data, policy, and configuration changes; and
- produce a transparent AI Quality Decision Brief that states facts, claims, evidence, uncertainty, limitations, owners, residual risk, and revision triggers.

---

## Curriculum Progression

The curriculum follows an evidence-to-decision path rather than a sequence of model families or tools.

| Stage | Chapters | Central question | Learner output |
| --- | --- | --- | --- |
| Establish the AI quality boundary | 1–2 | What is the system, what behaviour matters, and where can failure originate? | AI system boundary map and failure-classification record |
| Design valid evaluation | 3–4 | Which population, oracle, metric, and decision rule can support the claim? | Evaluation-data plan and metric/threshold decision record |
| Evaluate contextual and generative behaviour | 5–8 | How can variable output be assessed without pretending that a score is certainty? | Rubric, evaluation matrix, RAG investigation, and evaluator-validation plan |
| Probe failure and constrained action | 9–10 | What happens under perturbation, conflict, unsafe requests, and tool-use boundaries? | Metamorphic test charter, safety/fairness assessment, and tool-use evidence review |
| Learn across change and operation | 11 | What changed, what evidence shifted, and what decision is warranted? | Regression and production-learning plan |
| Synthesize a defensible decision | 12 | What can be recommended from incomplete, multi-source AI quality evidence? | AI Quality Strategy and Evaluation Portfolio with Decision Brief |

The progression preserves a central MSQE distinction: an AI output is an observation; it becomes decision evidence only when the task, population, evaluation method, limitations, and consequences are explicit.

---

## Atlas Commerce AI Environment

All planned scenarios use **Atlas Commerce**, a fictional commerce service. Every scenario will be labelled as illustrative and will use synthetic data and evidence only. The environment deliberately connects three capabilities so that the reader can compare system types rather than encounter unrelated examples.

| Capability | System type | Planned learning use |
| --- | --- | --- |
| **Atlas Refund Risk** | Predictive classification | Confusion matrices, class imbalance, thresholds, error costs, calibration concepts, subgroup analysis, regression comparison |
| **Atlas Discovery** | Product ranking and recommendation | Relevance, ranking quality, population slices, stale signals, metric boundaries, and user-impact interpretation |
| **Atlas Support Assistant** | RAG-backed generative assistant with bounded order-lookup and refund-proposal tools | Groundedness, citations, instruction following, refusal quality, retrieval versus generation, model-based evaluation, prompt sensitivity, tool-use evidence, and change-aware regression |

The support assistant may retrieve synthetic policy and product documents, look up a synthetic order, and propose—but never execute—a bounded refund action. This distinction supports a core lesson: a helpful final response does not prove that the retrieval, reasoning, permissions, or intermediate tool actions were correct.

---

## AI Quality Model

Part IX will not define a single universal AI quality score. Instead, it will teach a contextual quality model in which dimensions are selected because they matter to a stated user outcome and decision.

| Candidate dimension | Questions to establish before measuring it |
| --- | --- |
| Task correctness | What task, target, oracle, and error boundary make a result correct enough for this decision? |
| Factuality and groundedness | What source supports the claim, and what counts as unsupported inference or incorrect attribution? |
| Relevance and completeness | Which information is necessary, extraneous, omitted, or unsuitable for the user context? |
| Robustness and consistency | Which input variations should preserve, constrain, or deliberately change behaviour? |
| Calibration and confidence | Does a score or confidence estimate have a defined interpretation for this population and action? |
| Safety, refusal, and privacy | What harm, unsafe action, disclosure, or over-refusal is in scope, and who owns escalation? |
| Fairness and subgroup performance | Which groups and outcome differences are relevant, and what measurement limitations prevent a fairness claim? |
| Transparency and explainability | What can an explanation or trace establish, and what cannot it prove? |
| Latency and cost | How do these bounded system constraints affect the user outcome without turning the chapter into performance engineering? |
| User impact | Who is affected, how severely, and what action follows from the evidence? |

Any local scorecard introduced in a scenario will be explicitly framed as a decision-specific model, with weights, exclusions, owners, and limitations—not as an MSQE standard.

---

## Approved Chapter Architecture and Navigation

The approved architecture contains **12 chapters**. The Draft manuscript supports classical ML, generative, RAG, and bounded agentic quality while reserving synthesis for a distinct capstone.

1. AI Quality Engineering: Behaviour, Evidence, and Boundaries
2. AI System Architecture and Failure Boundaries
3. Evaluation Data, Oracles, and Experimental Design
4. Classification, Ranking, and Predictive-Model Evaluation
5. Generative AI Evaluation: Rubrics, Factuality, and Instruction Following
6. Robustness, Metamorphic Testing, and Adversarial Inputs
7. Retrieval-Augmented Generation Quality
8. Human Evaluation and Model-Based Evaluators
9. Tool-Using and Agentic AI Systems
10. Safety, Fairness, Privacy, and Responsible Quality Boundaries
11. AI Regression, Production Learning, and Change
12. Capstone: AI Quality Strategy and Evaluation Portfolio

| Chapter | Draft manuscript | Approximate words |
| --- | --- | ---: |
| 1 | [AI Quality Engineering: Behaviour, Evidence, and Boundaries](chapters/chapter-01-ai-quality-engineering-behaviour-evidence-and-boundaries.md) | 2,560 |
| 2 | [AI System Architecture and Failure Boundaries](chapters/chapter-02-ai-system-architecture-and-failure-boundaries.md) | 2,269 |
| 3 | [Evaluation Data, Oracles, and Experimental Design](chapters/chapter-03-evaluation-data-oracles-and-experimental-design.md) | 3,271 |
| 4 | [Classification, Ranking, and Predictive-Model Evaluation](chapters/chapter-04-classification-ranking-and-predictive-model-evaluation.md) | 2,130 |
| 5 | [Generative AI Evaluation: Rubrics, Factuality, and Instruction Following](chapters/chapter-05-generative-ai-evaluation-rubrics-factuality-and-instruction-following.md) | 2,810 |
| 6 | [Robustness, Metamorphic Testing, and Adversarial Inputs](chapters/chapter-06-robustness-metamorphic-testing-and-adversarial-inputs.md) | 2,072 |
| 7 | [Retrieval-Augmented Generation Quality](chapters/chapter-07-retrieval-augmented-generation-quality.md) | 3,308 |
| 8 | [Human Evaluation and Model-Based Evaluators](chapters/chapter-08-human-evaluation-and-model-based-evaluators.md) | 2,843 |
| 9 | [Tool-Using and Agentic AI Systems](chapters/chapter-09-tool-using-and-agentic-ai-systems.md) | 2,961 |
| 10 | [Safety, Fairness, Privacy, and Responsible Quality Boundaries](chapters/chapter-10-safety-fairness-privacy-and-responsible-quality-boundaries.md) | 2,721 |
| 11 | [AI Regression, Production Learning, and Change](chapters/chapter-11-ai-regression-production-learning-and-change.md) | 3,269 |
| 12 | [Capstone: AI Quality Strategy and Evaluation Portfolio](chapters/chapter-12-capstone-ai-quality-strategy-and-evaluation-portfolio.md) | 4,814 |

### Chapter 1 — AI Quality Engineering: Behaviour, Evidence, and Boundaries

- **Mission:** Establish why AI-system quality requires familiar QE principles applied to probabilistic, contextual, and incomplete evidence.
- **Key concepts:** AI system, model boundary, application boundary, nondeterminism, acceptable variation, quality claim, uncertainty, oracle problem, and residual risk.
- **QA → QE transition:** Move from checking a preferred answer to defining a user-relevant behaviour, evidence boundary, and decision rule.
- **Atlas Commerce scenario:** Atlas Support Assistant gives a fluent delivery-policy answer that is plausible but unsupported by the available policy evidence.
- **Worked reasoning:** Separate fluency, factuality, groundedness, relevance, and safety; state what the observed answer cannot establish.
- **Professional artifact:** AI Quality Claim Canvas.
- **Prerequisites:** Parts I and III; Part VIII operational-evidence vocabulary is recommended.
- **Explicit exclusions:** Model training, prompt-engineering recipes, and universal AI quality scoring.
- **Handoff:** Defines the system and claim boundaries used by Chapters 2–12.

### Chapter 2 — AI System Architecture and Failure Boundaries

- **Mission:** Teach the reader to locate an observed failure before calling it “an AI problem.”
- **Key concepts:** Application, API, model, prompt, retrieval, tool, data, evaluation/oracle, and observability boundaries; dependency contracts; state and configuration.
- **QA → QE transition:** Move from reporting a poor output to building a falsifiable failure-boundary hypothesis with evidence needs.
- **Atlas Commerce scenario:** A support answer cites an obsolete returns policy after a retrieval index update; the model, application, source corpus, and citation formatter are all plausible boundaries.
- **Worked reasoning:** Classify competing explanations, identify missing evidence, and select the next investigation rather than assigning blame.
- **Professional artifact:** AI Failure-Boundary Map and Investigation Record.
- **Prerequisites:** Parts III, IV, VI, and VIII.
- **Explicit exclusions:** Architecture design patterns and vendor integration tutorials.
- **Handoff:** Supplies the boundary model for evaluation data, RAG, tools, and production learning.

### Chapter 3 — Evaluation Data, Oracles, and Experimental Design

- **Mission:** Show how evaluation-set choices and oracle choices constrain every quality conclusion.
- **Key concepts:** Evaluation dataset, population, slice, stratification, edge and long-tail cases, provenance, synthetic and real-world data, train/validation/test distinctions, leakage, benchmark contamination, drift, reference-based and reference-free evaluation.
- **QA → QE transition:** Move from collecting example prompts to defining representative evidence, oracle limitations, and revision triggers.
- **Atlas Commerce scenario:** A support evaluation set contains only current-policy questions from high-volume regions, while low-volume returns cases and policy changes are absent.
- **Worked reasoning:** Assess whether an apparently high pass rate supports a release claim for the intended population.
- **Professional artifact:** Evaluation Dataset and Oracle Plan.
- **Prerequisites:** Parts III and VI.
- **Explicit exclusions:** Data-pipeline implementation and statistical-research methodology beyond practical evaluation design.
- **Handoff:** Provides the population and oracle assumptions used in metric, generative, and regression chapters.

### Chapter 4 — Classification, Ranking, and Predictive-Model Evaluation

- **Mission:** Ensure Part IX includes classical ML and ranking evidence rather than becoming an LLM-only curriculum.
- **Key concepts:** Confusion matrix, accuracy, precision, recall, specificity, F1, ROC-AUC and PR-AUC as contextual curves, threshold selection, class imbalance, error cost, calibration concepts, ranking relevance, and subgroup slices.
- **QA → QE transition:** Move from citing an aggregate score to selecting measures and thresholds that reflect user impact and the cost of false positives and false negatives.
- **Atlas Commerce scenario:** Atlas Refund Risk reports 95% accuracy but misses a substantial share of rare high-risk refunds; Atlas Discovery improves a generic ranking metric while degrading relevance for a key customer journey.
- **Worked reasoning:** Recalculate a confusion matrix, compare thresholds, expose the misleading accuracy claim, and state a bounded recommendation.
- **Professional artifact:** Metric, Threshold, and Error-Cost Decision Record.
- **Prerequisites:** Chapter 3 and basic quantitative reasoning.
- **Explicit exclusions:** Model-training optimisation, calculus derivations, and a claim that any one metric is universally preferred.
- **Handoff:** Establishes quantitative evidence for subgroup, regression, and capstone decisions.

### Chapter 5 — Generative AI Evaluation: Rubrics, Factuality, and Instruction Following

- **Mission:** Teach evaluation of variable outputs through explicit, task-appropriate criteria rather than exact-string matching by default.
- **Key concepts:** Factuality, groundedness, relevance, completeness, instruction following, semantic correctness, output schema compliance, refusal quality, safety, creativity where relevant, reference answers, rubrics, pairwise comparison, and repeated samples.
- **QA → QE transition:** Move from asking whether output matches one answer to assessing whether it satisfies bounded quality criteria for the task and audience.
- **Atlas Commerce scenario:** Two support answers are both fluent; one cites policy correctly but omits a required return condition, while the other is complete but attributes an unsupported policy exception.
- **Worked reasoning:** Apply a rubric, separate automatable checks from judgement-based criteria, and identify what remains uncertain.
- **Professional artifact:** Generative Evaluation Rubric and Evidence Matrix.
- **Prerequisites:** Chapters 1 and 3.
- **Explicit exclusions:** Prompt-writing recipes, provider-specific model controls, and a universal rubric.
- **Handoff:** Supplies quality criteria for robust, RAG, human-evaluation, and regression evidence.

### Chapter 6 — Robustness, Metamorphic Testing, and Adversarial Inputs

- **Mission:** Develop a major QE capability: testing meaningful relations between inputs and outcomes when an exact output oracle is incomplete.
- **Key concepts:** Metamorphic relation, property-oriented reasoning, sensitivity, robustness, perturbation, paraphrase, noisy input, malformed input, irrelevant and conflicting context, prompt sensitivity, bounded prompt injection, and jailbreak attempts.
- **QA → QE transition:** Move from accumulating example prompts to defining valid transformations, expected relations, and exceptions for a stated task.
- **Atlas Commerce scenario:** Equivalent customer wording changes refund-eligibility classification; removing a policy source still leaves an answer attributed to it; a malicious instruction appears inside retrieved content.
- **Worked reasoning:** Decide which transformations should preserve behaviour, which should change it, and which cannot support an invariance claim.
- **Professional artifact:** Metamorphic Relation Catalogue and Robustness Test Charter.
- **Prerequisites:** Chapters 1, 3, and 5.
- **Explicit exclusions:** Offensive-security techniques, red-team operations, and a claim that robustness testing proves security.
- **Handoff:** Provides perturbation methods for RAG, agent, safety, and regression analysis.

### Chapter 7 — Retrieval-Augmented Generation Quality

- **Mission:** Separate retrieval evidence from generation evidence so a RAG failure is neither overgeneralised nor misdiagnosed.
- **Key concepts:** Retrieval relevance and recall, ranking, chunking consequences, context windows, truncation, missing, stale, and contradictory sources, embeddings as a conceptual boundary, citation correctness, groundedness, answer completeness, and unsupported inference.
- **QA → QE transition:** Move from grading a final answer alone to tracing which evidence was available, selected, used, cited, and omitted.
- **Atlas Commerce scenario:** Atlas Support Assistant retrieves a highly similar but obsolete returns-policy passage and produces a confident, well-formatted answer with an incorrect citation.
- **Worked reasoning:** Distinguish retrieval defect, generation defect, source-governance defect, and citation-presentation defect; decide which evaluation evidence supports each claim.
- **Professional artifact:** Retrieval-and-Generation Evidence Matrix.
- **Prerequisites:** Chapters 2, 3, 5, and 6.
- **Explicit exclusions:** Vector-database selection, indexing implementation, and provider tutorials.
- **Handoff:** Supplies evidence requirements for tool-using assistants and AI change evaluation.

### Chapter 8 — Human Evaluation and Model-Based Evaluators

- **Mission:** Teach how to scale semantic evaluation without mistaking a human or model evaluator for ground truth.
- **Key concepts:** Rubric design, evaluator instructions, sampling, blind evaluation, inter-rater agreement conceptually, disagreement, adjudication, pairwise evaluation, model-based evaluation, LLM-as-judge, position and verbosity bias, self-preference, prompt sensitivity, inconsistency, correlated failure, and benchmark leakage.
- **QA → QE transition:** Move from accepting one reviewer or judge score to validating the evaluation process, disagreement pattern, and decision limitation.
- **Atlas Commerce scenario:** A model judge ranks a verbose support answer above a shorter answer that correctly identifies an omitted safety condition; two human evaluators also disagree on completeness.
- **Worked reasoning:** Compare human and judge evidence, reverse pair order, inspect rubric coverage, and decide whether a release claim is supportable.
- **Professional artifact:** Evaluator Protocol and Judge-Validation Plan.
- **Prerequisites:** Chapters 3 and 5.
- **Explicit exclusions:** Replacing accountable domain review with a model evaluator or conducting formal research studies.
- **Handoff:** Provides evaluator controls for capstone evidence and regression comparison.

### Chapter 9 — Tool-Using and Agentic AI Systems

- **Mission:** Evaluate intermediate actions and boundaries in systems that can plan, call tools, retain state, and act over multiple steps.
- **Key concepts:** Goal interpretation, plan/action boundaries, tool selection, arguments, permissions, confirmation, retries, idempotency, state, memory, termination, repeated actions, failure handling, and observable evidence.
- **QA → QE transition:** Move from checking the final response to assessing whether the system reached it through permitted, safe, and explainable actions.
- **Atlas Commerce scenario:** Atlas Support Assistant correctly tells a customer that a refund requires review, but it first calls a refund-proposal tool with an incorrect order identifier and retries after an ambiguous failure.
- **Worked reasoning:** Evaluate final-answer correctness separately from tool-call correctness, permission boundaries, retry behaviour, and residual operational risk.
- **Professional artifact:** Tool-Use Contract and Action-Trace Review.
- **Prerequisites:** Chapters 2, 5, 6, and 7; Part IV state and contract fundamentals.
- **Explicit exclusions:** Autonomous-agent framework implementation, production permission design, and unrestricted execution.
- **Handoff:** Supplies tool and state evidence for safety, production learning, and the capstone.

### Chapter 10 — Safety, Fairness, Privacy, and Responsible Quality Boundaries

- **Mission:** Equip QEs to identify and evaluate quality-relevant harm without claiming to own legal, ethical, or enterprise governance decisions.
- **Key concepts:** Harmful output, unsafe advice, safe and over-refusal, privacy-sensitive failure modes, subgroup performance, harmful bias, fairness limitations, transparency, explainability limits, escalation, ownership, and decision records.
- **QA → QE transition:** Move from treating safety checks as a fixed blacklist to reasoning about task context, affected populations, evidence limits, ownership, and residual risk.
- **Atlas Commerce scenario:** Atlas Refund Risk has strong aggregate performance but materially worse false-negative results for a relevant subgroup; the assistant also over-refuses safe order-status questions after a policy update.
- **Worked reasoning:** Compare subgroup slices, distinguish observed disparity from causal explanation, and write a proportionate escalation and mitigation recommendation.
- **Professional artifact:** Safety, Fairness, and Escalation Assessment.
- **Prerequisites:** Chapters 3–6 and 9 where tool actions are in scope.
- **Explicit exclusions:** Legal advice, compliance certification, universal fairness definitions, and deep security testing.
- **Handoff:** Supplies risk and ownership inputs for regression, operational learning, and the capstone.

### Chapter 11 — AI Regression, Production Learning, and Change

- **Mission:** Teach a controlled evidence loop for changes in models, prompts, data, retrieval, tools, safety policies, and configuration.
- **Key concepts:** Baseline, candidate, evaluation versioning, model and prompt versions, corpus and embedding changes, tool and tool-description changes, configuration, repeated runs, stability, uncertainty, distribution shift, concept drift where relevant, monitoring limits, user feedback, and revision triggers.
- **QA → QE transition:** Move from exact-output regression snapshots to change-aware comparisons that state differences, uncertainty, risk, and a promotion decision.
- **Atlas Commerce scenario:** A support-assistant prompt update improves helpfulness scores but worsens refusal quality and changes retrieval citation behaviour; a refund-classifier candidate improves overall F1 while reducing recall for a critical slice.
- **Worked reasoning:** Compare baseline and candidate evidence across measures and repetitions, separate statistically uncertain movement from material risk, and decide whether to promote, pause, or investigate.
- **Professional artifact:** AI Change Evaluation and Production-Learning Plan.
- **Prerequisites:** Chapters 3–10 and Part VIII evidence concepts.
- **Explicit exclusions:** CI/CD implementation, production observability deployment, and a claim that monitoring alone detects all quality regressions.
- **Handoff:** Provides the revision-trigger and evidence-history model required by the capstone.

### Chapter 12 — Capstone: AI Quality Strategy and Evaluation Portfolio

- **Mission:** Require synthesis of system boundaries, evaluation evidence, uncertainty, safety, fairness, regression, and ownership into a decision-ready professional portfolio.
- **Key concepts:** Quality strategy, evidence portfolio, decision threshold, limitation, residual risk, mitigation or acceptance, owner, revision trigger, and transparent recommendation.
- **QA → QE transition:** Move from a collection of test results to a bounded recommendation that makes uncertainty and accountability visible.
- **Atlas Commerce scenario:** The learner assesses a proposed release that changes the support assistant’s retrieval corpus and prompt, introduces a bounded refund-proposal tool, and updates the refund-risk threshold.
- **Worked reasoning:** Reconcile conflicting classifier, RAG, human-evaluator, model-judge, tool-trace, safety, subgroup, and repeated-run evidence without claiming certainty that the packet cannot support.
- **Professional artifact:** AI Quality Strategy and Evaluation Portfolio with AI Quality Decision Brief.
- **Prerequisites:** Chapters 1–11.
- **Explicit exclusions:** Production deployment, legal certification, and a guarantee of universal AI assurance competence.
- **Handoff:** Prepares the reader to apply AI Quality Engineering in a real team with domain, security, legal, privacy, and governance partners.

---

## Evaluation and Evidence Strategy

### Nondeterminism and Acceptable Variation

The manuscript will distinguish deterministic boundaries around an AI component from nondeterministic component behaviour. It will teach seeds, sampling and temperature concepts only where they are applicable, never as universal remedies. Planned exercises will use repeated runs, observed outcome distributions, stability criteria, acceptable variation, and simple confidence or uncertainty concepts.

Readers will learn to state whether a claim concerns repeatability, semantic acceptability, safety, or a decision threshold. A parameter setting that appears to reduce variation does not itself establish correctness, groundedness, fairness, or safety.

### Evaluation Data and Oracles

The evaluation-data strategy builds on Part VI without repeating general Data Quality Engineering. It will cover representative inputs, relevant slices, edge populations, long-tail cases, synthetic versus real-world evidence, privacy, provenance, train/validation/test conceptual distinctions, leakage, benchmark contamination, versioning, and dataset drift.

The oracle strategy will distinguish exact and schema checks, reference answers, rubric evaluation, pairwise comparison, human evaluation, model-based evaluation, metamorphic relations, and outcome-based evidence. Every method will be framed by the claim it can support and the limitations it leaves unresolved.

### Classical ML and Ranking Evaluation

Chapter 4 will provide carefully validated, decision-oriented numerical reasoning for confusion matrices, accuracy, precision, recall, specificity, F1, threshold trade-offs, class imbalance, and error costs. ROC-AUC and PR-AUC will be introduced conceptually, including situations in which a curve or aggregate metric can mislead.

Ranking and recommendation examples will focus on task relevance, affected populations, stale signals, and user impact. They will not require an information-retrieval or recommender-systems implementation.

### Generative, RAG, and Evaluator Evidence

Generative evaluation will distinguish automatable checks from judgement-based criteria. It will cover factuality, groundedness, relevance, completeness, instruction following, semantic correctness, refusal behaviour, output format, and creativity only when a task makes it relevant.

RAG coverage will separate retrieval relevance and recall from generation quality. It will use evidence of retrieved passages, versions, citations, missing context, outdated documents, contradictory sources, truncation, and unsupported inference rather than treating the final answer as the only observable output.

Model-based evaluators, including LLM-as-judge, will be treated as scalable but fallible instruments. The curriculum will require evaluator validation through controls such as rubric clarity, selected human comparison, reversed pair order where relevant, repeat assessment, disagreement inspection, and separation between the system under test and the evaluator when possible.

### Human Evaluation, Safety, and Fairness

Human-evaluation coverage will be proportionate: rubric design, evaluator instructions, sampling, blind comparison where useful, disagreement, adjudication, and domain expertise. It will not become a full research-methodology course.

Safety and fairness evidence will be contextual. The manuscript will teach relevant subgroup comparison, measurement limits, safe refusal and over-refusal, privacy-sensitive failures, unsafe tools, and escalation. It will not claim that one metric proves fairness or that a QE alone owns legal, compliance, ethical, security, or enterprise-governance outcomes.

### Regression and Production Learning

The change model will use:

```text
baseline
    → candidate
    → versioned evaluation evidence
    → difference and uncertainty analysis
    → risk decision
    → production-learning and revision trigger
```

Re-evaluation triggers will include model, prompt, system-instruction, retrieval corpus, chunking, embedding, tool, tool-description, safety-policy, evaluation-data, and generation-parameter changes. Runtime signals, user reports, sampled outcomes, and changed input distributions will be connected to Part VIII evidence principles without duplicating observability implementation.

---

## Worked-Reasoning and Numerical Strategy

Every technical chapter will contain an illustrative Atlas Commerce worked-reasoning scenario planned before drafting. Each will state:

1. system context;
2. quality claim;
3. observed evidence;
4. competing interpretation;
5. evaluation limitation; and
6. justified decision or next action.

Numerical examples will be independently recalculated during Full Pass 1 and again at both required internal checkpoints. The minimum numerical set is:

| Example | Planned chapter | Required reasoning |
| --- | --- | --- |
| Refund-risk confusion matrix | 4 | Accuracy, precision, recall, specificity, F1, and why accuracy is insufficient under imbalance |
| Threshold trade-off | 4 | False-positive versus false-negative cost and a bounded threshold recommendation |
| Subgroup comparison | 10 | Relevant slice comparison, measurement limitations, and no unsupported fairness conclusion |
| Repeated generative evaluation | 5 or 8 | Outcome stability, sample count rationale, and uncertainty-aware interpretation |
| Model-judge comparison | 8 | Pair-order control, human disagreement, and evaluator limitation |
| Regression comparison | 11 | Baseline/candidate measures, repeated-run change, uncertainty, and promotion decision |

No numerical illustration will be used as a decorative score. Each must affect the quality claim, explain an interpretation boundary, and support a professional decision artifact.

---

## Professional Artifacts and Capstone

The manuscript will provide practical learning through synthetic evidence, exercises, and reusable professional artifacts. These are required manuscript content, not standalone practical assets.

Planned artifacts include:

- AI Quality Claim Canvas;
- AI Failure-Boundary Map and Investigation Record;
- Evaluation Dataset and Oracle Plan;
- Metric, Threshold, and Error-Cost Decision Record;
- Generative Evaluation Rubric and Evidence Matrix;
- Metamorphic Relation Catalogue and Robustness Test Charter;
- Retrieval-and-Generation Evidence Matrix;
- Evaluator Protocol and Judge-Validation Plan;
- Tool-Use Contract and Action-Trace Review;
- Safety, Fairness, and Escalation Assessment; and
- AI Change Evaluation and Production-Learning Plan.

### Capstone: AI Quality Strategy and Evaluation Portfolio

The capstone will require a learner to synthesize a bounded release decision for the connected Atlas Commerce AI environment. It will cover:

- system and failure boundaries;
- quality claims and decision thresholds;
- evaluation population, data, and oracle limitations;
- classifier and ranking evidence where relevant;
- generative, RAG, human, and model-based evaluation evidence;
- metamorphic and robustness findings;
- tool-use, state, memory, permission, and confirmation evidence;
- safety, privacy, and subgroup considerations;
- baseline/candidate regression evidence;
- production-learning plan; and
- ownership, mitigation, acceptance, residual risk, and revision triggers.

### Capstone Evidence Packet

The planned packet is synthetic, internally consistent, and intentionally incomplete. It will include a classifier confusion matrix, subgroup slices, evaluation prompts, reference documents, retrieved passages, generated answers, rubric scores, human-evaluator disagreement, model-judge outcomes, tool-call traces, safety cases, regression comparisons, and repeated-run outcomes.

Its incompleteness is intentional: learners must explain what evidence supports, what it does not support, and which decision remains proportionate.

### AI Quality Decision Brief

The capstone decision brief will require the following fields:

| Field | Purpose |
| --- | --- |
| Fact | Separate observed evidence from interpretation. |
| Quality claim | State the bounded behaviour or outcome under assessment. |
| Evidence | Identify the relevant datasets, outputs, traces, and evaluation methods. |
| Interpretation | Explain what the evidence supports. |
| Evaluation gap | Identify missing coverage, weak oracles, or untested boundaries. |
| Uncertainty | State variance, sampling, evaluator, or measurement limitations. |
| Safety / fairness concern | Record relevant harm, subgroup, privacy, or unsafe-action evidence. |
| Recommendation | Recommend promotion, pause, mitigation, more evidence, or acceptance with limits. |
| Limitation | State what the recommendation cannot establish. |
| Residual risk | Make remaining risk explicit. |
| Mitigation / acceptance | Identify the selected treatment and rationale. |
| Revision trigger | Define the change or signal that requires reassessment. |
| Owner | Name the accountable engineering, product, domain, security, privacy, or governance role. |

The brief is a decision-support artifact. It does not imply legal certification, universal AI-assurance mastery, or transfer of accountability from responsible owners.

---

## Practical-Asset Strategy and Quality Gates v1.1 Classification

The Part IX manuscript will contain practical exercises and professional artifacts. The following are standalone assets and are explicitly classified before the final quality review, as required by Quality Gates v1.1.

| Asset | Classification | Purpose and release implication |
| --- | --- | --- |
| Atlas Commerce AI Evaluation Simulator | **Recommended Pass 2 enrichment** | Could later provide deterministic synthetic classifier outputs, a small RAG corpus, response fixtures, repeated samples, tool traces, and evaluator comparisons. It is not required for the manuscript release because the planned exercises and capstone evidence packet provide the required applied learning. |
| Lab 1 — Classification Metrics and Threshold Decisions | **Recommended Pass 2 enrichment** | Could extend Chapter 4 with interactive threshold and error-cost analysis. |
| Lab 2 — Generative AI Evaluation and Rubric Design | **Recommended Pass 2 enrichment** | Could extend Chapters 5 and 8 with synthetic outputs, rubrics, and evaluator comparison. |
| Lab 3 — RAG Groundedness and Retrieval Investigation | **Recommended Pass 2 enrichment** | Could extend Chapter 7 with a versioned synthetic corpus and retrieval evidence. |
| Lab 4 — Agent Tool-Use and Safety Evaluation | **Recommended Pass 2 enrichment** | Could extend Chapters 9 and 10 with bounded synthetic action traces and permission cases. |
| Conceptual diagrams | **Recommended Pass 2 enrichment** | Could illustrate failure boundaries, evidence flow, RAG, evaluator controls, and tool-use state without being required to understand the manuscript. |
| Standalone synthetic datasets | **Recommended Pass 2 enrichment** | Could support reproducible labs; embedded synthetic evidence remains required manuscript content. |
| Executable examples | **Recommended Pass 2 enrichment** | Could demonstrate selected evaluation mechanics but are not needed for the tool-neutral manuscript release. |
| Case-study files | **Recommended Pass 2 enrichment** | Could package extended evidence separately; the capstone packet remains within manuscript scope. |

No asset above may be represented as delivered or validated until it is separately created and passes the applicable technical, editorial, safety, reproducibility, accessibility, and learning-quality checks. If the approved curriculum later makes an asset required for release, the classification change must be explicitly approved, independently reviewed, and recorded before release approval.

---

## Tool-Neutrality Strategy

The curriculum will not require an OpenAI, Anthropic, Gemini, or other model API; LangChain, LlamaIndex, MLflow, a vector database, a cloud AI platform, or a commercial evaluation product.

Named technologies may appear only as carefully bounded, current examples during drafting. The enduring concepts are system boundaries, quality claims, evaluation data, oracles, metrics, uncertainty, evidence, and decisions. Readers must be able to apply the approach to hosted, self-managed, classical ML, retrieval-backed, or future AI systems.

---

## Reference and Source Strategy

AI technical claims change quickly. Each manuscript chapter will verify current claims before drafting and before Final Quality Gate review. Sources will be selected in the following order:

1. standards, specifications, and primary public guidance;
2. peer-reviewed or primary research;
3. official technical documentation for narrow implementation concepts; and
4. respected practitioner literature only when it adds clearly identified context.

The planned source map includes:

- NIST AI RMF and its Generative AI Profile for bounded risk, trustworthiness, and evaluation context;
- accessible ISO/IEC AI standards only where they directly support a defined term or boundary;
- primary research on model evaluation, calibration, robustness, RAG, benchmark contamination, and model-based evaluator limitations;
- primary sources such as HELM-style evaluation work where they support a chapter claim;
- official technical documentation only for time-sensitive concepts, and never as the sole authority for a general principle;
- ISTQB AI Testing material as limited practitioner and certification context; and
- primary EU sources only where a narrow regulation boundary helps explain engineering relevance.

Marketing blogs will not be treated as authority. Regulatory discussion will state its engineering relevance and limitation; it will not provide legal advice. Current source validity, publication date, authority, and relevance to the exact claim will be checked during manuscript drafting.

---

## MQE-BOK and QA → QE Mapping

| Dimension | Part IX mapping |
| --- | --- |
| MQE-BOK domain | Domain 9 — AI Quality Engineering |
| Entry point | Validating selected AI outputs or prompts against an expected result |
| Development | Designing population-aware evaluation, selecting adequate oracles, interpreting metrics and contextual criteria, and tracing system boundaries |
| Outcome | Making bounded, evidence-led AI quality decisions that state uncertainty, safety, fairness, ownership, limitations, residual risk, and revision triggers |
| Professional role | Quality Engineer collaborating with product, domain, data, ML, security, privacy, legal, and Responsible AI specialists without claiming to replace them |

---

## Internal Drafting Batches

The following batches support coherent production, not delivery-by-delivery approval gates.

| Batch | Chapters | Production focus |
| --- | --- | --- |
| **A — Foundations and evaluation methodology** | 1–4 | System boundaries, nondeterminism, oracles, evaluation data, classical ML, ranking, validated numerical examples |
| **B — Generative, robust, and retrieval quality** | 5–8 | Rubrics, factuality, instruction following, metamorphic relations, bounded adversarial inputs, RAG, human and model-based evaluation |
| **C — Action, safety, learning, and synthesis** | 9–12 | Tools and agents, safety/fairness/privacy boundaries, regression, production learning, capstone evidence packet, decision brief |

---

## Mandatory Internal Checkpoints

Exactly two internal checkpoints will be used during the later Full Pass 1 task.

### Checkpoint A — Evaluation Foundations and Generative Evidence

After Chapters 1–5 are drafted, validate:

- metrics arithmetic, thresholds, and error-cost reasoning;
- oracle framing and evaluation-data assumptions;
- nondeterminism and repeated-run claims;
- source authority and currentness;
- generative criteria and evaluator limitations; and
- tool neutrality and Part III–VIII boundaries.

### Checkpoint B — Action, Safety, and Synthesis Readiness

Before Chapter 12 is finalized, validate:

- RAG evidence and retrieval/generation separation;
- agent actions, permissions, state, retries, and termination boundaries;
- safety, privacy, and subgroup-evaluation claims;
- regression and production-learning scope;
- Part VIII and Part X–XII boundaries;
- capstone evidence-packet consistency; and
- all numerical examples and cross-chapter terminology.

Only P0 or P1 findings should interrupt Full Pass 1. P2 and P3 findings should normally be recorded for the consolidated independent review unless continuing would propagate a material defect.

---

## Accelerated Production and Review Model

The Part IX workflow is:

```text
Architecture approval
    ↓
One accelerated Full Pass 1 in three internal batches
    ↓
Two mandatory internal checkpoints
    ↓
One consolidated independent review
    ↓
One combined targeted correction and normalization pass, only if required
    ↓
One focused closure review, only if P1/P2 confirmation is needed
    ↓
One Final Part IX Quality Gate
    ↓
Controlled version-control baseline
    ↓
One consolidated v0.12.0 release-administration task
```

This model prevents unnecessary delivery-level approvals while retaining explicit controls for numerical correctness, current sources, boundaries, and capstone integrity.

---

## Depth Strategy

Instructional completeness takes priority over word count. The planned ranges are:

- standard chapters: **3,800–5,200 meaningful words**;
- high-integration chapters (3, 5, 7, 8, 9, 10, and 11): **4,300–5,800 meaningful words**; and
- capstone chapter: **5,500–7,500 meaningful words**.

Each chapter must develop concepts, worked reasoning, practical application, limitations, and QA → QE progression. Artificial expansion, unsupported claims, and tool-specific filler are prohibited.

---

## Current State and Next Action

- **Current state:** Part VIII is released as v0.11.0. Part IX passed its **97/100** Final Quality Gate with no P0, P1, P2, or P3 findings; the consolidated independent review, targeted P1/P2 evidence-traceability correction, and focused closure review are complete; manuscript quality is accepted; and all 12 chapters remain Draft. No standalone practical asset exists; Pass 2 assets are deferred.
- **Planned release:** v0.12.0 — AI Quality Engineering Complete, planned and unreleased.
- **Current workflow:** Controlled manuscript baseline `4df2b8d2409cfa0fc474cad8e1bbdbe652eb9dd5` is established. Release administration is active.
- **Final Gate findings:** P0, P1, P2, and P3: none. Source-freshness review is complete and closed.
- **Out of scope until separately authorised:** companion implementation; labs; diagrams; datasets; evaluation code; agents; Part X work; website, CI/CD, and infrastructure work.
