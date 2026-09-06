# Repository agent instructions

## 1. Purpose

Make bounded, traceable MSQE changes under the authorised task. This file is an operational index, not a replacement governance manual.

## 2. Authority hierarchy

Follow authorities by scope: [Quality Gates](docs/01-editorial/QUALITY_GATES.md) for lifecycle/gates; [Release Policy](docs/00-project/RELEASE_POLICY.md) and [Versioning](docs/00-project/VERSIONING.md) for release operations/versions; [Review Plan](docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md) for edition review method. The plan §13 separates method, findings, verification evidence and immutable events. Current sprint and README summarise state; they cannot override canonical records. Escalate unresolved authority conflicts rather than inventing precedence.

## 3. Manuscript authority

[CHAPTER_TEMPLATE.md](templates/CHAPTER_TEMPLATE.md) is the sole chapter-structure authority. [Editorial Style Guide](docs/00-project/EDITORIAL_STYLE_GUIDE.md) governs editorial principles; its historical structure list is not a checklist. Read approved Part curricula for scope. Do not recreate deleted editorial placeholders or shadow authorities.

## 4. Branch/worktree policy

Record branch, HEAD, worktree status and relevant tracking divergence before work. Respect the task's baseline and branch; stop on material unexpected drift, without discarding work. Use separately authorised isolated worktrees for concurrent corrections; one integration owner controls shared governance surfaces (Findings §7.6). Historical proposed branch names are not commands to execute.

## 5. Correction-author vs independent-reviewer separation

Correction authors cannot independently verify their own corrections. Follow Review Plan §11: corrections are unscored; scoring and gating cannot be performed by their author. Fresh review must re-derive primary evidence; a different tool alone does not establish independence.

## 6. Finding lifecycle

Use the [Findings register](docs/02-first-edition-review/FIRST_EDITION_FINDINGS.md) §2 and §7.9: OPEN, ACCEPTED, DEFERRED, CLOSED, WITHDRAWN; verification NOT VERIFIED, VERIFIED, RE-OPENED. “Correction applied” is evidence text, not closure. Acceptance is never closure.

## 7. Severity/classification/disposition separation

Preserve severity, defect class, blocker class and systemic provenance. LR-BLOCKER, FE-REQUIRED and DEFER-CANDIDATE are execution dispositions (Findings §8), not severity or closure states. Never downgrade for acceleration or correction cost.

## 8. Event-ID rules

Follow [Review Log](docs/02-first-edition-review/FIRST_EDITION_REVIEW_LOG.md) §1. Derive the next FE-EV ID from canonical event headings; allocate once, ascending, never reuse. One integration owner allocates event IDs during parallel work. Index rows and references are not additional events.

## 9. Historical evidence immutability

Accepted historical events are append-only: never edit, delete, reorder, collapse or fabricate them. Correct superseded evidence through an explicit new record. Preserve point-in-time counts and baseline identities; distinguish them from current derived summaries.

## 10. Current lifecycle vocabulary

Chapter stages remain Draft → Technical Review → Editorial Review → Educational Review → Practical Validation → Publication Review → Approved. Review phases, chapter maturity, Part releases and edition readiness are distinct. Read [CURRENT_SPRINT.md](CURRENT_SPRINT.md) for the current authorised activity; no stage advances by implication.

## 11. Manifest/baseline handling

Record actual pre/post populations and blob identities under Review Plan §13 and §18. Historical Part and Phase-F baselines remain immutable. Learning-Ready and Phase-K baselines are separate. Manifests are evidence of identity, not semantic proof; unexplained drift stops the affected scope.

## 12. Protected surfaces

Treat chapters, Part READMEs, templates, quantitative rules/tools, accepted event bodies, CHANGELOG and release artefacts as protected unless expressly included in the task's frozen allow-list. Release/tag operations require explicit authorisation.

## 13. Correction-scope rules

Freeze exact paths before editing. No silent scope expansion, incidental cleanup, finding remediation inside a governance-only task, or new requirements inferred from placeholders. Record unresolved owner decisions without fabricating approval.

## 14. Validation-gate rules

**AUTOMATION PROVES INVARIANTS.**
**INDEPENDENT REVIEW PROVES MEANING.**

Run deterministic checks appropriate to the authorised diff. Automated PASS cannot substitute for required independent semantic review. Preserve quantitative semantics unless separately authorised for specialist re-acceptance.

## 15. Closure requirements

Require correction evidence, independent verification of the exact changed baseline and all affected manifestations, and explicit canonical closure recording. Preserve systemic membership and acceptance controls (Review Plan §7; Findings §7.9). An author self-check closes nothing.

## 16. Commit/staging rules

Respect task-specific no-stage/no-commit/no-push instructions. When staging is authorised, prefer explicit paths; controlled review packages require explicit path staging and a scope check. Never blanket-stage a controlled package with `git add .` or `git add -A`.

## 17. Learning-Ready vs First Edition distinction

LEARNING-READY RC is an additional intermediate study gate under Quality Gates, with PASS or BLOCKED. It is not a chapter status, Phase J/K approval, publication approval or a release. Preserve Phase I/J/K/L: v0.16.0 = First Edition Review milestone; v1.0.0 = formal First Edition publication. FTR correction authorship requires fresh independent verification before use.
