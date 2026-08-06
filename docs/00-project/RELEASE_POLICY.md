# Release Policy

**Project:** Modern Software Quality Engineering (MSQE)

**Document Version:** 1.0

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

**Document Version:** 1.0

**Last Updated:** August 2026