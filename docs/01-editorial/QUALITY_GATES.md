# Quality Gates

**Project:** Modern Software Quality Engineering (MSQE)

**Document Version:** 1.1

**Status:** Active

**Project Phase:** M2 – Handbook Development

**Owner:** Tunde Ajala

---

# Executive Summary

The Quality Gates define the minimum quality standards that every chapter, laboratory, diagram, code example, article, and learning resource must satisfy before publication.

These gates ensure that the MSQE project applies the same quality engineering principles to its educational content that it advocates for software systems.

No content should be considered complete until all applicable quality gates have been successfully passed. A handbook Part must distinguish its required manuscript from practical assets that are required for that Part's release and assets intentionally deferred as Pass 2 enrichment.

---

# Objectives

The Quality Gates aim to:

- Ensure technical accuracy.
- Maintain editorial consistency.
- Improve educational effectiveness.
- Validate practical exercises.
- Support continuous improvement.
- Establish a repeatable review process.

---

# Quality Gate Overview

Every deliverable progresses through the applicable quality gates.

```text
Draft
   │
   ▼
Technical Review
   │
   ▼
Editorial Review
   │
   ▼
Educational Review
   │
   ▼
Practical Validation
   │
   ▼
Publication Review
   │
   ▼
Approved
```

For a handbook Part, the release decision combines a required Manuscript Quality Gate with a Required Practical Asset Gate only for assets that the approved Part curriculum or Definition of Done explicitly classifies as required. Optional Pass 2 enrichment is governed separately below.

---

# Gate 1 — Technical Quality

Objective

Ensure technical correctness.

Checklist

- [ ] Concepts are technically accurate.
- [ ] Code examples execute successfully.
- [ ] Commands have been verified.
- [ ] Diagrams are technically correct.
- [ ] References are accurate.

---

# Gate 2 — Editorial Quality

Objective

Ensure consistency and readability.

Checklist

- [ ] Grammar checked.
- [ ] Terminology consistent.
- [ ] Formatting follows Editorial Style Guide.
- [ ] Cross references verified.
- [ ] Markdown renders correctly.

---

# Gate 3 — Educational Quality

Objective

Ensure learning effectiveness.

Checklist

- [ ] Learning objectives defined.
- [ ] Concepts build progressively.
- [ ] Examples support theory.
- [ ] Summary included.
- [ ] Key takeaways included.

---

# Gate 4 — Practical and Learning Quality

Objective

Ensure practical applicability.

Checklist

- [ ] Practical activities or artifacts enable the learner to apply the chapter's concepts.
- [ ] Exercises validated.
- [ ] Interview questions included.
- [ ] Real-world scenarios included.
- [ ] Best practices documented.
- [ ] A laboratory or other practical asset is completed and validated when it is explicitly required by the approved Part curriculum or Definition of Done.
- [ ] Any optional Pass 2 practical asset is accurately recorded as planned or deferred and is not represented as completed.

---

# Gate 5 — Publication Quality

Objective

Confirm release readiness.

Checklist

- [ ] Chapter version updated.
- [ ] References complete.
- [ ] Images verified.
- [ ] Links functional.
- [ ] Peer review completed.

---

# Part-Level Quality Gate Model

## Manuscript Quality Gate

The Manuscript Quality Gate is required for every handbook Part. It confirms that the approved curriculum is complete at the manuscript level and that the Part's chapters provide rigorous, practical learning without making unsupported delivery claims.

The gate requires, as applicable:

- curriculum and chapter completeness, including accurate manuscript status;
- technical accuracy, references, and scope discipline;
- editorial quality, navigation, links, and Markdown validation;
- progressive learning design and clear QA-to-QE development;
- practical learning through validated exercises, scenarios, and professional artifacts;
- independent quality review; and
- resolution of all P0 and P1 findings and any P2 finding designated as release-blocking.

The Manuscript Quality Gate does not make a standalone laboratory, companion implementation, diagram set, or other practical asset mandatory unless that asset has been explicitly classified as required for the Part.

## Required Practical Asset Gate

The Required Practical Asset Gate applies only to a laboratory, companion implementation, executable example, diagram set, case study, or other practical asset explicitly declared as required for a Part's release in its approved curriculum, Part README, or Definition of Done.

Each required asset must be completed and pass the quality checks appropriate to its form before release. These include, where relevant, technical correctness, safety, reproducibility, editorial quality, accessibility, learning effectiveness, executable validation, and link or render validation. A required laboratory must be completed and validated; a required executable example or companion must run through its documented validation path.

## Pass 2 Enrichment

Labs, companion implementations, diagrams, case studies, and other practical assets explicitly classified as **optional** or **recommended Pass 2 enrichment** do not block a Part's manuscript release. They must remain clearly recorded as planned or deferred and must not be represented as delivered, validated, or required for the released Part.

Optional does not mean unreviewed. If a Pass 2 asset is later added to the repository or publication, it must pass the applicable technical, editorial, safety, reproducibility, and learning-quality validation before publication.

## Asset Classification and Anti-Bypass Safeguard

Before a Part's final quality review, its approved curriculum, Part README, or Definition of Done must classify every planned practical asset as either **required for release** or **optional/recommended Pass 2 enrichment**. An ambiguous classification is a release blocker until resolved.

High-level references to laboratories, companion resources, or learning by building in project architecture establish an expectation of practical learning; they do not alone classify a standalone asset as required for a particular Part release. The approved Part curriculum, Part README, or Definition of Done provides that release classification.

An asset stated to be required, necessary to satisfy a stated release criterion, or included in a Part's Definition of Done cannot be reclassified as optional merely to bypass validation. Any genuine curriculum change must be explicitly approved, explain its impact on learning outcomes and release scope, receive independent review, and be recorded before release approval. It cannot retroactively remove an unresolved required-asset validation obligation.

This policy applies prospectively to Part-level release decisions and later asset publication. It does not recategorize practical assets already delivered in a released scope.

## Release Readiness

A handbook Part may be release-ready when:

- its Manuscript Quality Gate has passed;
- every practical asset explicitly classified as required for that Part has passed its Required Practical Asset Gate;
- no P0 or P1 release blockers remain;
- any release-blocking P2 findings are resolved; and
- repository, governance, versioning, and release validation pass.

Optional Pass 2 enrichment may remain outstanding when it is accurately recorded as deferred and has not been represented as delivered.

For release governance, “required quality gates” means every gate applicable under this Part-Level Quality Gate Model.

---

# Definition of Done

A chapter is considered complete when:

- All applicable quality gates have passed.
- Review comments have been resolved.
- The chapter has been approved for publication.
- The chapter is merged into `develop`.

A handbook Part is considered complete for its release when it satisfies the Part-Level Quality Gate Model. A standalone laboratory or other practical asset is required only when the approved Part curriculum or Definition of Done explicitly declares it required for that release.

---

# Quality Metrics

The project aims to achieve:

- 100% technical review completion.
- 100% editorial review completion.
- 100% validated required or published code examples.
- 100% validated required or published laboratories.
- 100% reference coverage.

---

# Continuous Improvement

Quality Gates should evolve as the project grows.

Future versions may introduce:

- Automated Markdown validation.
- Link checking.
- Code execution verification.
- Diagram validation.
- AI-assisted editorial review.

---

# Approval

| Role | Name |
|------|------|
| Project Founder | Tunde Ajala |

---

**Document Version:** 1.1

**Last Updated:** August 2026

# Additional Intermediate Gate — LEARNING-READY RC

**FTR-1 governance foundation COMPLETE / INDEPENDENTLY VERIFIED / ACCEPTED at FTR-1V2, recorded in FE-EV-039.** Learning-Ready RC itself is **NOT YET ASSESSED**. It adds an intermediate study gate; all existing Part and First Edition publication requirements remain in force.

LEARNING-READY RC permits productive professional study of the manuscript before publication-only remediation is complete. It is an edition-level readiness label, not a chapter status or the release-candidate stage in the release workflow.

The gate result is **PASS** only when independent evidence establishes every condition below; otherwise it is **BLOCKED**, with unmet conditions and owners recorded:

- All LR-BLOCKER findings are **CLOSED / VERIFIED** under the existing finding lifecycle.
- No unresolved material learner-facing P0/P1 defect, materially false technical claim, materially misleading engineering guidance, or broken teaching example required for learning remains.
- Curriculum navigation and prerequisites are usable.
- Required learning assets are available or their limitations are explicitly stated. Disclosure cannot excuse a broken required teaching example or an unmet learning outcome; those block PASS. Required-asset publication obligations and the anti-bypass safeguard above remain intact.
- Material source limitations are visible, and edition, chapter and Part maturity information is accurate.
- A fresh independent Learning-Ready review has assessed the actual manuscript and learning evidence, not only a manifest or automated output.
- The reviewed Learning-Ready baseline is frozen, with explicit scope and blob identities, and an explicit residual-finding inventory records every outstanding finding and its learning impact, accountable owner, rationale, destination and revision trigger.

Execution dispositions and review/baseline procedure are defined in [Review Plan §18](../02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md#18-learning-ready-fast-track-operating-model); the canonical allocation and owner decisions are in [Findings §8](../02-first-edition-review/FIRST_EDITION_FINDINGS.md#8-learning-ready-fast-track-execution-overlay).

PASS is **not Phase J approval, Phase K baseline approval, First Edition publication approval or a v1.0.0 release**. It neither completes nor waives Phase I/J/K/L, changes CLOSED / VERIFIED, accepts findings by implication, alters severity/classification, nor removes final blockers. Every residual remains governed at its original final-gate/publication boundary. **v0.16.0 remains the First Edition Review milestone; v1.0.0 remains formal First Edition publication.** FTR-1 grants no Learning-Ready PASS and creates no baseline or release.
