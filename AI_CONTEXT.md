# AI Context

Version: 1.0

Repository: Modern Software Quality Engineering (MSQE)

Status: Active Development

---

# Purpose

This document provides permanent context for AI assistants contributing to the Modern Software Quality Engineering (MSQE) repository.

Every AI assistant should read this file before making recommendations or modifying repository content.

The purpose is to ensure architectural consistency, maintainability, and high-quality educational content throughout the lifetime of the project.

---

# Project Vision

Modern Software Quality Engineering (MSQE) is an open, vendor-neutral initiative to define, document, and advance the discipline of Modern Software Quality Engineering.

The primary objective is to help Software QA Engineers successfully transition into modern Quality Engineers through a structured, practical, engineering-first learning experience.

The project is intended to become the definitive Body of Knowledge (MQE-BOK) for Modern Software Quality Engineering.

---

# Primary Products

The repository supports multiple educational products built from the same knowledge base.

These include:

- Professional Handbook
- Practical Laboratories
- Code Examples
- Engineering Diagrams
- Documentation Website
- Video Course
- Certification Programme
- Presentation Slides

The handbook is the primary product.

---

# Educational Philosophy

The handbook teaches engineering principles before technologies.

Quality is treated as an engineering property of software systems rather than a testing activity.

Every topic should help readers understand:

- What the concept is.
- Why it matters.
- How it works.
- Where it is applied.
- How it is implemented professionally.
- How it is validated.
- How it may be assessed during technical interviews.

The project emphasizes practical engineering over tool-specific instruction.

---

# Target Audience

The handbook is intended for:

- Software Testers
- QA Engineers
- Automation Engineers
- SDETs
- Software Engineers
- Quality Engineers
- Engineering Managers
- Computer Science students
- Engineering educators

The primary audience is Software QA Engineers transitioning into Quality Engineering roles.

---

# Repository Architecture

The repository architecture has been approved.

Architecture Status:

APPROVED

Architecture Version:

1.0

The architecture is considered stable.

Do not redesign or restructure the repository unless explicitly requested.

Current structure:

Modern-Software-Quality-Engineering/

book/
docs/
code/
diagrams/
labs/
research/
references/
slides/
templates/
tools/
website/

---

# Directory Responsibilities

book/

Contains all handbook content.

Each handbook part contains:

- README
- chapters
- labs
- code
- diagrams
- case-studies
- exercises
- assets
- references

docs/

Contains project documentation only.

Examples:

- Project Charter
- MQE-BOK
- Architecture
- Roadmap
- Editorial Standards
- Versioning
- Release Policy

No handbook chapters belong in docs.

code/

Executable source code and supporting projects.

labs/

Standalone practical laboratories.

diagrams/

Reusable engineering diagrams.

research/

Research notes and supporting material.

references/

Shared reference material.

website/

Future documentation website.

templates/

Publishing templates.

tools/

Project automation utilities.

---

# Handbook Structure

The handbook contains twelve parts.

Part I
Foundations of Modern Software Quality Engineering

Part II
Programming for Quality Engineers

Part III
Software Testing Engineering

Part IV
API Engineering

Part V
Automation Engineering

Part VI
Data Quality Engineering

Part VII
Cloud & DevOps

Part VIII
Observability & Reliability Engineering

Part IX
AI Quality Engineering

Part X
Performance & Security Engineering

Part XI
System Design & Architecture

Part XII
Engineering Leadership & Career Growth

---

# Writing Standards

Use professional technical writing.

Preferred style:

- Microsoft Press
- O'Reilly
- Addison-Wesley
- Google Engineering Documentation

Avoid:

- Marketing language
- AI clichés
- Excessive repetition
- Vendor bias

Write as a Principal Engineer teaching another engineer.

---

# Chapter Standard

Every chapter should include:

- Opening Quote
- Opening Story
- Learning Objectives
- Theory
- Engineering Perspective
- Industry Perspective
- Practical Examples
- Case Study
- Diagrams
- Code Examples (where applicable)
- Hands-on Exercise
- Practical Lab
- Review Questions
- Interview Questions
- Summary
- Key Takeaways
- References

---

# Engineering Principles

The project follows these principles.

- Engineering before tools.
- Principles before implementation.
- Vendor neutrality.
- Systems thinking.
- Production-first mindset.
- Evidence-based engineering.
- Practical learning.
- Continuous improvement.
- Long-term maintainability.
- Community-driven growth.

---

# Original MSQE Frameworks

The project may introduce original frameworks and conceptual models.

These should always be clearly identified as MSQE frameworks.

Established industry standards should always be distinguished from original MSQE concepts.

Examples of industry standards include:

- ISO/IEC 25010
- OWASP
- DORA
- SRE
- ISTQB

---

# AI Guidelines

When contributing to this repository:

- Respect existing architecture.
- Respect established naming conventions.
- Do not redesign the repository.
- Do not rename folders without approval.
- Do not move handbook content outside the book directory.
- Follow existing publishing templates.
- Prefer improving content over changing structure.
- Explain significant recommendations before implementing them.
- Maintain consistency across all handbook parts.

---

# Decision Policy

Architectural decisions are considered stable once approved.

Avoid revisiting previous decisions unless:

- A technical limitation has been identified.
- A maintainability issue exists.
- A new project requirement makes the current design unsuitable.

Suggestions are welcome, but stability takes priority over continual redesign.

---

# Long-Term Goal

The ambition of this project is to establish Modern Software Quality Engineering as the definitive professional reference for Quality Engineering.

The handbook should remain relevant for many years by emphasizing enduring engineering principles rather than transient technologies.

Every contribution should move the project closer to that goal.