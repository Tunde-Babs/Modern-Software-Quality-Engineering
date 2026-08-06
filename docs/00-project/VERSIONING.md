# Versioning Policy

**Project:** Modern Software Quality Engineering (MSQE)

**Document Version:** 1.0

**Status:** Draft

**Project Phase:** M1 – Governance

**Owner:** Tunde Ajala

---

# Executive Summary

This document defines the versioning strategy for the Modern Software Quality Engineering (MSQE) project.

The objective is to provide a consistent and traceable approach for managing changes across governance documents, the handbook, laboratories, code examples, digital resources, and future educational products.

The project adopts **Semantic Versioning (SemVer)** where appropriate while also defining additional versioning rules for educational content.

---

# Objectives

The versioning strategy aims to:

- Provide consistency across all project assets.
- Track the evolution of documents and releases.
- Improve traceability.
- Support long-term maintenance.
- Simplify collaboration and review.

---

# Versioning Principles

The project follows these principles.

- Every significant artefact has a version.
- Major changes are documented.
- Breaking structural changes require a major version.
- Minor improvements receive minor versions.
- Editorial corrections receive patch versions.
- Version history should remain transparent.

---

# Semantic Versioning

The project follows Semantic Versioning.

```
MAJOR.MINOR.PATCH
```

Example

```
1.4.2
```

Where:

| Component | Meaning |
|-----------|---------|
| Major | Breaking or significant structural changes |
| Minor | New content or functionality added |
| Patch | Editorial fixes, corrections, clarifications |

---

# Project Versions

Project releases use Semantic Versioning.

| Version | Description |
|----------|-------------|
| v0.1.0 | Project Foundation |
| v0.2.0 | Governance |
| v0.3.0 | Educational Architecture |
| v0.4.0 | Foundations Complete |
| v0.5.0 | Programming Complete |
| v0.6.0 | Testing & Automation Complete |
| v0.7.0 | Data, Cloud & Reliability |
| v0.8.0 | AI Quality Engineering |
| v0.9.0 | First Edition Review |
| v1.0.0 | First Edition Published |

---

# Governance Document Versioning

Each governance document includes:

- Document Version
- Status
- Owner
- Last Updated

Example

```
Document Version: 1.2
Status: Active
```

Major revisions increase the major version.

Editorial corrections increase the patch version.

---

# Handbook Versioning

The handbook has its own version number.

Examples:

| Version | Meaning |
|----------|---------|
| 0.1 | Initial Draft |
| 0.5 | Technical Review |
| 0.9 | Publication Candidate |
| 1.0 | First Edition |
| 1.1 | Minor Revision |
| 2.0 | Second Edition |

---

# Chapter Versioning

Individual chapters may evolve independently.

Example

```
Chapter 5

Version 1.3
```

This enables continuous improvement without waiting for a complete book release.

---

# Laboratory Versioning

Labs are versioned independently.

Example

```
Lab-07

Version 2.1
```

Major updates indicate significant changes to learning objectives or implementation.

---

# Code Example Versioning

Code examples are maintained using Git history.

Where necessary, examples may include explicit version numbers for significant revisions.

---

# Website Versioning

The documentation website reflects the latest stable release.

Major releases may retain archived documentation for previous versions.

---

# Release Types

The project recognises several release types.

## Draft

Work in progress.

## Preview

Available for early review.

## Release Candidate

Expected to be publication-ready.

## Stable

Official release.

## Maintenance

Bug fixes and editorial improvements.

---

# Change Classification

Changes are classified as:

## Major

Examples:

- New project architecture.
- Major handbook restructuring.
- New MQE-BOK competency domains.

Version Increment

```
2.0.0
```

---

## Minor

Examples:

- New chapter.
- New laboratory.
- Additional examples.

Version Increment

```
1.4.0
```

---

## Patch

Examples:

- Grammar corrections.
- Code corrections.
- Improved explanations.
- Broken links.

Version Increment

```
1.4.3
```

---

# Git Tags

Every stable release should be tagged.

Examples

```
v0.1.0

v0.2.0

v1.0.0
```

Tags should correspond to GitHub Releases.

---

# Release Notes

Each official release should include:

- Summary
- Major additions
- Improvements
- Breaking changes
- Known limitations
- Contributors

Release notes are maintained in `CHANGELOG.md`.

---

# Backward Compatibility

Minor and patch releases should preserve compatibility wherever practical.

Major releases may introduce structural changes when justified.

---

# Review Process

Version changes should be reviewed through the standard pull request workflow.

Significant version changes should reference the relevant Architecture Decision Record (ADR).

---

# Future Evolution

The versioning policy will evolve alongside the project.

Future enhancements may include:

- Versioned online documentation.
- Multi-language editions.
- Companion publications.
- Certification syllabus versions.

---

# Approval

| Role | Name |
|------|------|
| Project Founder | Tunde Ajala |

---

**Document Version:** 1.0

**Last Updated:** August 2026