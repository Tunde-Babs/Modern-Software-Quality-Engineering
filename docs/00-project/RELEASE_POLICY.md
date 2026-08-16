# Release Policy

**Project:** Modern Software Quality Engineering (MSQE)

**Document Version:** 1.1

**Status:** Active

**Project Phase:** M1 – Governance

**Owner:** Tunde Ajala

---

# Executive Summary

This document defines the release policy for the Modern Software Quality Engineering (MSQE) project.

Its purpose is to establish a consistent, transparent, and repeatable process for publishing governance documents, handbook editions, practical laboratories, code examples, digital resources, and future educational products.

The release policy ensures that every published artefact meets the project's quality standards and remains aligned with the principles defined in the Project Charter, Editorial Style Guide, Architecture, and Versioning Policy.

---

# Objectives

The Release Policy aims to:

- Ensure consistent release quality.
- Establish repeatable publishing procedures.
- Define release readiness criteria.
- Minimise publication defects.
- Support long-term maintainability.
- Preserve traceability across releases.

---

# Release Principles

Every release should be:

- Planned
- Reviewed
- Traceable
- Repeatable
- Well documented
- Versioned
- Quality assured

No release should be published without satisfying the required quality gates.

---

# Release Types

The project recognises the following release types.

## Draft

Internal work in progress.

Characteristics

- Incomplete
- Subject to change
- Not intended for public consumption

---

## Preview

Early version intended for selected reviewers.

Characteristics

- Feature complete
- Open for feedback
- Not yet considered stable

---

## Release Candidate (RC)

Expected to become the next official release unless significant issues are identified.

Characteristics

- Complete
- Technically reviewed
- Editorially reviewed

---

## Stable Release

Official public release.

Characteristics

- Approved
- Version tagged
- Release notes published

---

## Maintenance Release

Provides:

- Editorial improvements
- Corrections
- Updated references
- Minor enhancements

No major structural changes should occur during maintenance releases.

---

# Release Workflow

Every release follows the same lifecycle.

```text
Development
      │
      ▼
Technical Review
      │
      ▼
Editorial Review
      │
      ▼
Quality Gates
      │
      ▼
Release Candidate
      │
      ▼
Final Approval
      │
      ▼
Git Tag
      │
      ▼
GitHub Release
      │
      ▼
Publication
```

---

# Quality Gates

A release must successfully pass every quality gate.

## Technical Quality

- Technical accuracy verified.
- Code examples validated.
- References checked.
- Diagrams reviewed.

---

## Editorial Quality

- Grammar verified.
- Formatting consistent.
- Terminology standardised.
- Cross-references validated.

---

## Educational Quality

- Learning objectives achieved.
- Exercises included.
- Review questions completed.
- Practical examples verified.

---

## Repository Quality

- Documentation organised.
- Links functional.
- Images available.
- Markdown rendering verified.

---

## Governance Quality

- Version updated.
- Changelog updated.
- Development Log updated.
- Relevant Decision Records referenced.

---

# Release Checklist

Before publishing, verify:

- [ ] Version number updated.
- [ ] CHANGELOG.md updated.
- [ ] DEVELOPMENT_LOG.md updated.
- [ ] Release notes prepared.
- [ ] All pull requests merged.
- [ ] All review comments resolved.
- [ ] Documentation complete.
- [ ] Diagrams verified.
- [ ] Code examples tested.
- [ ] References validated.
- [ ] Git tag prepared.
- [ ] Lifecycle state consistency sweep completed.

---

# Lifecycle State Consistency Sweep

A release or milestone transition changes the project's current state. The documents that describe that state are mutable and do not update themselves, so a transition is not governance-complete until they have been checked.

This section is the authoritative definition of that check. It is a consistency sweep, not a rewrite: surfaces are inspected, and only genuinely stale statements are corrected.

## When the Sweep Applies

Perform the sweep at a lifecycle transition:

- before merging a release branch into `main`;
- immediately after publishing a release and its tag;
- when advancing `CURRENT_SPRINT.md` to a new lifecycle phase or milestone;
- before declaring a handbook Part or milestone governance-complete.

The sweep is not required after ordinary chapter, laboratory, or editorial commits.

## Surfaces to Inspect

Inspect the mutable current-state surfaces that the transition could have invalidated:

- `README.md` — project status, release table, roadmap, and summary pointers.
- `CURRENT_SPRINT.md` — milestone, branch, active scope, and next authorized activity.
- `CHANGELOG.md` — released versus unreleased entries.
- `docs/00-project/ROADMAP.md` — where it carries current state rather than plan.
- The relevant Part README current-state sections.
- `docs/00-project/DEVELOPMENT_LOG.md` — for event-record consistency only.
- Release metadata where applicable — tags, release branches, and the GitHub Release.

Not every surface changes at every transition. The requirement is to check each one and update only what has become stale.

## Current State and Historical Record

The sweep distinguishes two kinds of statement.

**Mutable current-state prose** describes where the project is now — the latest stable release, the active milestone, the current lifecycle phase, and the next authorized activity. It must be corrected once it stops being true.

**Immutable historical and point-in-time records** describe what was true at a recorded moment — dated Development Log entries, review and gate outcomes, published release notes, and statements explicitly marked as point-in-time. These must not be rewritten merely because the project later advanced. Where such a record could be misread as a current-state claim, the remedy is to mark it as point-in-time, not to restate it.

## Minimum Consistency Questions

The sweep must answer, at minimum:

1. What is the latest stable release?
2. What is the active or planned milestone?
3. Is that milestone released or unreleased?
4. Which lifecycle phase or gate is complete?
5. Which phase or gate is currently active?
6. What is the next authorized activity?
7. Do `README.md` and `CURRENT_SPRINT.md` agree on answers 1 to 6?
8. Do the relevant Part README current-state sections agree?
9. Does `CHANGELOG.md` reflect released versions accurately, without implying that unreleased work is released?
10. Are tags and release branches consistent with what governance claims?
11. Are historical records clearly distinguishable from current-state statements?

Any disagreement is resolved in favour of verifiable repository state — tags, merged branches, and published releases.

## Responsibility

The **Project Founder** owns the sweep, consistent with the release responsibilities defined below. The sweep is complete when its owner has answered every question above and corrected any stale statement found.

## Evidence

Evidence should be lightweight and recorded in an artefact the transition already produces. Any one of the following is sufficient:

- the release pull request, with the sweep recorded in its checklist or description;
- the governance commit carrying the corrections;
- the Development Log entry for the transition.

No new permanent artefact is required, and no separate sweep report should be created.

## Relationship to Other Governance

This sweep is a release-administration control. It does not alter the quality gates defined in `docs/01-editorial/QUALITY_GATES.md`, which remain the standing authority on content quality and Part release readiness, and it does not alter the version semantics defined in `docs/00-project/VERSIONING.md`. It governs only whether the project's mutable current-state surfaces still describe the project accurately after the project has advanced.

---

# Release Responsibilities

## Project Founder

Responsible for:

- Final approval.
- Release decisions.
- Governance compliance.

---

## Future Technical Reviewers

Responsible for:

- Technical accuracy.
- Engineering best practices.
- Code review.

---

## Future Editorial Reviewers

Responsible for:

- Language quality.
- Consistency.
- Editorial standards.

---

# GitHub Releases

Every Stable Release should include:

- Version number
- Release title
- Summary
- Major additions
- Improvements
- Breaking changes (if any)
- Known limitations
- Contributors

---

# Release Naming Convention

Examples:

```
v0.1.0 – Project Foundation

v0.2.0 – Governance

v0.3.0 – Educational Architecture

v1.0.0 – First Edition
```

Release titles should clearly communicate the scope of the release.

---

# Publication Strategy

The project adopts an incremental publication model.

Small, well-reviewed releases are preferred over large, infrequent releases.

This approach:

- Encourages continuous improvement.
- Reduces publication risk.
- Simplifies review.
- Improves contributor confidence.

---

# Post-Release Activities

Following each release:

- Complete the lifecycle state consistency sweep.
- Update roadmap if necessary.
- Record lessons learned.
- Archive release notes.
- Monitor community feedback.
- Plan the next milestone.

---

# Future Evolution

The Release Policy will evolve alongside the project.

Future enhancements may include:

- Automated release pipelines.
- Continuous documentation deployment.
- Website release synchronisation.
- Companion resource version alignment.
- Multi-language publication workflows.

---

# Approval

| Role | Name |
|------|------|
| Project Founder | Tunde Ajala |

---

**Document Version:** 1.1

**Last Updated:** August 2026