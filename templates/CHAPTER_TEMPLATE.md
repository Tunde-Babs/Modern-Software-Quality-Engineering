# MSQE Chapter Template

Use this template for handbook chapters. It reflects the approved Part I structure and supports the MSQE Quality Gates. Keep the chapter focused: include the required sections, use conditional sections only when they strengthen the topic, and defer companion assets to Pass 2.

## Publishing Passes

### PASS 1 — Manuscript Development

Complete the chapter narrative and required core sections. Use clear, vendor-neutral technical writing; define specialised terms at their first meaningful use; distinguish recognised standards from original MSQE teaching models; and provide traceable references for technical claims.

### PASS 2 — Enrichment

Add and integrate diagrams, standalone labs, case studies, exercises, supporting code, and cross-links. Do not create a companion asset merely to fill a template section. Where a planned asset would help the reader, use the standard placeholder in the Pass 1 manuscript:

> **Supporting asset (Pass 2, planned):** Describe the planned asset, its learning purpose, and its intended title where known.

## Required Core Structure

```markdown
# Chapter N — Chapter Title

## Metadata

| Field | Value |
|---|---|
| Part | Part N — Part Title |
| MQE-BOK domain | Domain N — Domain Title |
| Chapter | N |
| Audience | ... |
| Prerequisites | ... |
| Estimated study time | ... |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> A short attributed quotation or clearly labelled MSQE principle.

## Opening Story

<!-- Use `## Motivating Scenario` instead when an opening story is not the most suitable form. Every chapter requires one of these opening forms. -->

State when a scenario is illustrative. Use it to introduce a concrete engineering problem that the chapter resolves.

## Why This Chapter Matters

Explain the reader's professional and engineering need for the chapter. State material boundaries with adjacent chapters where that prevents overlap.

## Learning Objectives

Use observable objectives that develop knowledge, engineering skill, and professional judgement.

## Main Instructional Sections

Use descriptive `##` and `###` headings. Build from concepts and principles to application. Explain standards accurately, and clearly label original MSQE frameworks or teaching models.

## Engineering Perspective

Connect the chapter's concepts to engineering decisions, evidence, risks, trade-offs, and implementation choices.

## Industry Perspective

Use authoritative, publicly documented practice to illustrate principles without prescribing a vendor or toolchain.

## Common Misconceptions or Common Pitfalls

Correct plausible misunderstandings that would lead to poor engineering decisions.

## Summary

## Key Takeaways

## Review Questions

Use questions that test understanding, analysis, application, and engineering judgement.

## Interview Questions

## Practical Exercise

Provide a self-contained, risk-appropriate exercise. Reference a separate lab or worksheet only when it is planned as Pass 2 work.

## Further Reading

List neutral, authoritative resources beyond the formal citations.

## References

[^source-id]: Organisation or author. [Title](https://example.com). Publication information where available. Accessed YYYY-MM-DD.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Apply the chapter's central concept to an engineering decision.
```

`Engineering Perspective`, `Industry Perspective`, and `Common Misconceptions or Common Pitfalls` are required when they are relevant to the chapter's subject. Omit a conditional section rather than adding generic filler. All other headings above are required.

## Optional Content Blocks

Use these blocks only when they advance the chapter's learning objectives. Place them where they support the narrative, rather than forcing a fixed order.

| Optional block | Use when | Pass |
|---|---|---|
| Architecture | The topic needs a focused explanation of structure, boundaries, or trade-offs. | Pass 1 narrative; visual asset in Pass 2 if needed. |
| Conceptual Diagram | A visual relationship materially improves understanding. | Pass 2 asset; use the standard placeholder in Pass 1. |
| Case Study | A real or clearly labelled illustrative case strengthens application. | Pass 1 narrative; supporting material in Pass 2 if needed. |
| Executable Specification | Behaviour is best expressed as an executable, tool-neutral specification, such as Gherkin. | Pass 1 when central to the lesson. |
| Code Example | Runnable code is necessary to explain implementation. | Pass 1 only when it can be validated; supporting project work is Pass 2. |
| Hands-on Lab Reference | A standalone lab reinforces the chapter. | Reference the planned or available lab; lab creation and integration are Pass 2. |
| Best Practices | Concise, context-sensitive practices add value beyond the main narrative. | Pass 1. |
| Performance Perspective | Performance-specific reasoning materially affects the topic. | Pass 1. |
| Security Perspective | Security-specific reasoning materially affects the topic. | Pass 1. |
| AI Perspective | AI-specific quality concerns materially affect the topic. | Pass 1. |

## Publishing Checks

Before advancing a chapter, confirm that it supports the applicable Quality Gates:

- technical claims and references are accurate;
- terminology, heading hierarchy, citations, and Markdown are consistent;
- learning objectives, examples, summary, takeaways, questions, and practical exercise support learning; and
- any deferred companion assets are explicitly marked as Pass 2 work.

Passing these manuscript checks does not mark a chapter as published. Technical, editorial, educational, practical, and publication review remain governed by the project Quality Gates.
