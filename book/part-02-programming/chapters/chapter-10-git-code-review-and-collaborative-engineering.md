# Chapter 10 — Git, Code Review, and Collaborative Engineering

## Metadata

| Field | Value |
|---|---|
| Part | Part II — Programming for Quality Engineers |
| MQE-BOK domain | Domain 2 — Programming for Quality Engineers |
| Chapter | 10 |
| Audience | Experienced Software QA Engineers, Test Automation Engineers, SDETs, and aspiring Quality Engineers |
| Prerequisites | Chapters 1–9, especially bounded change, diagnostics, and behaviour-preserving refactoring |
| Estimated study time | 155 minutes, plus the practical exercise |
| Version | 0.1.0 |
| Status | Draft |

## Opening Quote

> **MSQE principle:** A change becomes useful engineering evidence when another person can understand its intent, inspect its scope, and reproduce its validation.

## Opening Story

The following illustrative scenario concerns a Quality Engineer who has improved a utility that produces a release-quality summary. The change fixes an ambiguous retry classification, extracts a small helper, updates the utility's configuration, and reformats several unrelated files. Locally, the utility compiles and the example run looks correct. The engineer opens a review request titled “fix stuff.”

The reviewer has a hard task. Is the retry behaviour intentionally different? Did the configuration change alter an operational policy? Is the helper a refactor or a new feature? Which files are formatting noise? What evidence covers the failure path? The code may be sound, but the change is difficult to reason about because its history and explanation do not preserve its intent.

The engineer takes a smaller route. They separate the retry classification from the unrelated cleanup, inspect the staged snapshot, record a meaningful commit message, and ask the reviewer to focus on the changed failure contract and its tests. The review becomes a technical conversation about observable behaviour rather than a search for hidden scope. This chapter explains the collaboration practices that make that outcome repeatable.

## Why This Chapter Matters

Quality Engineering utilities are team software. A parser, fixture generator, diagnostic tool, reporting component, or automation helper becomes part of a delivery system as soon as another person relies on its output or needs to change it. Its source history, diffs, review discussion, and recovery path then matter alongside its immediate result.

Git and review practice do not make code correct by themselves. They make intent, scope, and validation inspectable. That is especially important for Quality Engineers because their code often shapes the evidence used in release, incident, and risk decisions. A confusing change can reduce confidence even when a test suite is green.

This is not a complete Git manual, a prescribed branching model, or a CI/CD chapter. It teaches the subset of collaborative source-control practice needed to make bounded Quality Engineering changes understandable and recoverable. Chapter 9 focused on changing code safely. Chapter 11 will focus on evidence that the changed utility behaves as intended.

## Learning Objectives

By the end of this chapter, you should be able to:

- explain the relationship among a repository, working tree, staging area, commit, branch, review request, and integrated history;
- use the staging area as a proposed commit snapshot rather than a file queue;
- plan branches and commits that communicate a coherent engineering intent;
- inspect a diff for scope, behaviour, evidence, and accidental content before requesting review;
- prepare a pull request or merge request that states the problem, change, validation, risks, and review focus;
- review Quality Engineering changes for failure semantics, maintainability, data boundaries, diagnostics, and evidence as well as compilation; and
- respond constructively to review feedback, conflicts, and recovery needs in a shared repository.

## Collaboration Is Part of the Utility's Contract

A utility's code contract describes inputs, outputs, effects, and failures. Its collaboration contract answers related questions for other engineers: What change is being proposed? Why is it needed? What does the author believe is unchanged? What evidence supports the claim? How can the change be inspected, discussed, integrated, or safely backed out?

These questions are not administration around “real” engineering. They reduce the chance that a correct local change becomes an incorrect integrated change. They also allow reviewers to use their domain knowledge. A developer may notice an ownership concern; an operations specialist may notice a diagnostic disclosure risk; a QA Engineer may notice that a retry changes a test's meaning.

The practical objective is not to create a perfect history. It is to preserve enough context for the next decision. A short-lived exploration can be messy. The history presented for review should be coherent enough that a colleague can identify the problem, inspect the implementation, understand validation, and challenge remaining risk.

## A Practical Mental Model of Git

Git is a distributed version-control system: a repository records snapshots and their relationships, and each clone has local history. This chapter needs only the model that connects a local edit to a shared engineering decision.

| Layer | What it represents | Question to ask |
|---|---|---|
| **Repository** | The recorded project history, including commits and branches. | Which earlier decision or state am I comparing with? |
| **Working tree** | The files currently checked out and edited locally. | What have I changed while investigating or implementing? |
| **Staging area** | The precise content proposed for the next commit. | Is this the exact snapshot I intend to record? |
| **Commit** | A named historical snapshot with a relationship to earlier commits. | What coherent engineering claim does this snapshot make? |
| **Branch** | A lightweight line of development that points to a sequence of commits. | What focused work is isolated from the shared base? |
| **Pull request / merge request** | A hosted review discussion comparing a proposed branch with a target branch. | Can others understand and assess this proposed integration? |
| **Integrated history** | The record after an agreed change is combined with its target branch. | Can a future maintainer recover the decision and change boundary? |

The flow is therefore conceptual rather than ceremonial:

```text
working files → proposed staged snapshot → commit → branch history → review → integration
```

The [Pro Git explanation of recording changes](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository) makes an important distinction: a file can be modified in the working tree and separately have earlier content staged. Staging is not merely “files waiting to be committed.” It selects the content of the next snapshot. If a file changes after staging, inspect and stage the intended version again; do not assume the working copy and the proposed commit are identical.

### Inspect content, not only filenames

`git status` shows a useful inventory, but a list of filenames does not show what a commit will claim. A diff reveals added and removed content. The exact local commands are less important than their questions:

```bash
git status
git diff
git diff --staged
```

Read the unstaged diff to decide what belongs in the next change. Read the staged diff to confirm the proposed snapshot. Look for generated output, fixture data, temporary diagnostics, unrelated formatting, configuration changes, secrets, and accidental API changes. A green build does not tell you that the right content was staged.

For a quality utility, this inspection is itself an evidence boundary. If a review request says “preserve retry semantics,” its staged diff should not also replace a configuration format or silently alter a failure message. If those changes are required together, say why explicitly and make the validation reflect their interaction.

## Commits Preserve Engineering Intent

A **commit** records a snapshot and its place in history. In a collaborative project, it is also a compact statement of intent: a future reader should be able to infer what changed, why it mattered, and where to begin inspecting evidence. Commit history is not a substitute for design documentation or a review request; it is durable context when the immediate discussion is no longer open.

### Prefer coherence over arbitrary smallness

A focused commit groups changes that must be understood together. It does not mean every edit must be reduced to a single line, nor that every team must use the same commit-message convention. The useful question is whether a reviewer can describe the commit's purpose and assess its evidence without simultaneously reasoning about unrelated changes.

Consider the following possible changes:

- a retry classification change and tests for that classification;
- a behaviour-preserving rename and the characterization test that protects it;
- an unrelated formatter sweep;
- a dependency upgrade;
- a configuration-policy change.

The first two may be coherent when the tests directly establish the claimed behaviour. The last three often deserve separate treatment because they introduce different risks and review questions. Combining a refactor, new feature, dependency update, configuration change, and formatting sweep does not always make a change wrong, but it makes it harder to decide which difference caused an outcome or needs approval.

### Write messages that name the engineering decision

A weak message such as `fix stuff` requires a future reader to open the diff before they can even identify the decision. A message such as `fix retry classification for non-retryable failures` communicates the affected rule and the intended distinction. It does not need to reproduce every implementation detail.

Useful messages are precise enough to guide inspection and modest enough not to make unsupported claims. For example:

```text
test: characterize quality-summary threshold boundary
refactor: make quality-summary threshold handling explicit
fix: preserve invalid-input classification after retry stops
docs: record validation scope for report fixture
```

Choose the convention used by the repository when one exists. Prefixes can be helpful, but a conventional prefix does not make a vague message useful. If an organisation uses issue identifiers or release references, include them only when they improve traceability and do not expose sensitive information.

### History supports investigation and recovery

When a quality report changes unexpectedly, history can show when a rule, fixture, default, or error category changed. When an integration must be reversed, a coherent commit is easier to identify and assess. This does not make history a blame system. It gives a team evidence about how the system evolved and a narrower place to investigate.

## Branches Create a Bounded Place to Work

A **branch** is a lightweight line of development. It allows an engineer to make and review a focused proposal without placing unfinished work directly on the shared target branch. Branch names should reveal purpose, not encode an organisation-wide taxonomy. `feature/improve-quality-summary` and `feature/add-timeout-diagnostics` tell collaborators more than `updates2`.

Before creating or continuing a branch, state its change boundary:

- What problem will this branch solve?
- Which utility, contract, or evidence path is in scope?
- What is explicitly out of scope?
- What validation will be relevant before review?
- Which target branch or supported baseline is the proposal compared with?

Focused branches reduce long-lived divergence. A branch that remains open while the target branch evolves may become harder to integrate and review because its assumptions age. Synchronise with the target branch using the team's agreed practice, inspect the resulting diff, and rerun relevant validation. Do not adopt a named workflow—such as Git Flow—only because it is familiar; branch policy should fit the team's release, review, and ownership model.

### Synchronise deliberately, then validate the result

Synchronising a branch is not a mechanical pre-review task. It may introduce other engineers' changes into the proposed state, alter dependency resolution, expose a conflict, or invalidate assumptions that were true when the work began. Treat the resulting branch as a new candidate for inspection rather than assuming its earlier local validation still answers every question.

After synchronisation, compare the branch with the intended target, read the complete final diff, and rerun the checks relevant to the combined result. A summary utility may still compile while its configuration fixture or failure-category expectation has changed underneath it. If synchronisation expands the review scope materially, explain that in the review request, separate the work where practical, or seek a new decision about the now-combined change. The aim is not to make branches perfectly current at every minute; it is to make the state submitted for integration honest, understandable, and supported by current evidence.

### Merge and rebase describe different history choices

Both merge and rebase can bring branch work together conceptually, but they produce different histories. A **merge** combines branch histories and may create a merge commit. A **rebase** replays a branch's commits onto a new base, changing the identities of those commits. The [official `git rebase` documentation](https://git-scm.com/docs/git-rebase) describes it as reapplying commits on top of another base.

Neither is universally superior. A team may use merge commits to preserve the visible integration topology, squash changes to present one coherent final decision, or rebase private work before review to reduce divergence. The safe rule is social as well as technical: understand the repository's conventions before rewriting history that other people may have based work on. For shared history, prefer reviewable, recoverable actions over clever recovery commands.

## Traceability Should Answer a Change Question

**Traceability** is the ability to connect an engineering decision to relevant context, implementation, validation, and later outcome. It is useful only when it helps someone answer a real question. A release identifier, issue reference, branch name, commit, review request, test output, and incident note can all contribute to traceability, but a long list of identifiers does not automatically make a change understandable.

For a Quality Engineer, useful traceability often connects four facts:

1. the quality risk or decision that motivated the change;
2. the code, configuration, or fixture rule that was altered;
3. the validation that supports the claimed behaviour; and
4. the known limits, operational effect, or follow-up decision.

For example, a report counts a duration exactly at a threshold as slow. A meaningful trail identifies that policy in the review request, points to the boundary test, and separates it from a later product decision to use a different threshold. It does not require a reviewer to reconstruct the policy from a generic commit ID alone.

Use links and identifiers according to local policy. Avoid inserting customer names, credentials, sensitive URLs, or confidential incident details into public branch names, commit messages, fixtures, or review descriptions. If sensitive context is necessary for a decision, reference an approved internal record at the appropriate level of abstraction and keep the code history safe to share with the people who need to maintain it.

Traceability also has a limit. A commit message cannot replace a quality strategy; a test result cannot explain why a policy was chosen; a review approval cannot prove an operational outcome. The goal is a navigable chain of evidence, not a claim that one artifact explains everything.

## A Review Request Is an Evidence Packet

A **pull request** (PR) or **merge request** (MR) is a collaboration mechanism that compares proposed branch changes with a target branch and hosts review discussion. The name differs by platform; the engineering purpose is the same. It should not force reviewers to infer the problem solely from the diff.

A strong review request gives a reviewer enough context to make a responsible decision:

| Element | What it should answer |
|---|---|
| Problem | What observed risk, defect, uncertainty, or maintenance cost prompted the change? |
| Intent | What outcome is expected, and what is deliberately not changing? |
| Change | Which responsibilities, interfaces, configuration, or behaviour changed? |
| Evidence | What checks, examples, tests, or reasoning support the claim? |
| Risks and limits | What is still uncertain, untested, deferred, or operationally sensitive? |
| Validation | How did the author check the final proposed state? |
| Review focus | Which decision or part of the diff most needs expert scrutiny? |

This structure is an MSQE teaching aid, not an industry standard or mandatory PR template. It turns a review request into a useful extension of the quality strategy: reviewers can see what evidence exists, where it is bounded, and what judgement remains.

The Delivery 4 companion includes an [illustrative PR description](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/pull-request-description.md). It states the threshold policy, the test evidence, and the limit of its characterization claim. It does not pretend to be a live hosted review or an actual repository commit.

### Reviewability starts before the request is opened

Authors make review easier by planning a bounded change, using names that reveal domain decisions, separating generated output from source, and adding tests that state observable behaviour. Reviewers make it easier by reading the stated intent before debating style and by asking questions that expose risk. Both roles should inspect the final diff, not only an intermediate commit or a local editor view.

## Review Quality Engineering Code as Engineering Code

Compilation is useful evidence: it checks a limited set of language-level assumptions. It cannot establish that a utility produces correct evidence, preserves failure meaning, handles a boundary safely, or has a reviewable scope. Review the code in the context of the decision it supports.

| Review dimension | Questions for a Quality Engineering change |
|---|---|
| Correctness | Does the implementation satisfy the stated rule for relevant normal and negative cases? |
| Failure semantics | Are invalid input, dependency failure, timeout, and unexpected results distinguishable where callers need that distinction? |
| Maintainability | Are responsibilities, names, dependencies, and policy values clear enough for the next bounded change? |
| Testability | Are inputs, time, I/O, and dependencies visible enough to test meaningful behaviour? |
| Data boundaries | Is external or fixture data validated before trusted logic uses it? Is identity and de-duplication deliberate? |
| Security and privacy | Could source, tests, fixtures, logs, or error messages disclose secrets or sensitive data? |
| Diagnostics | Would a failure give a safe, useful operation name, context, and category? |
| Concurrency and timing | Are ordering, timeout, retry, cancellation, or shared-state assumptions explicit and appropriate? |
| Scope | Does the diff include only the declared change, or are unrelated policies hidden with it? |
| Evidence | Do tests and validation support the stated claim, and do they state their limits? |

This is not a generic style-guide checklist. Apply dimensions that matter to the change. A local pure transformation may not have concurrency concerns. A polling utility should make them central. The goal is proportionate review, not a ritual that produces comments on every line.

### Ask questions that improve the decision

Useful review feedback is specific about the observed risk and invites evidence or explanation. “Could a non-retryable configuration error be retried here?” is more useful than “this feels wrong.” “The test observes the helper call count but not the public result; can we assert the timeout context?” helps align the test with its contract.

Comments on naming or formatting can be valid when they affect comprehension, consistency, or future change. They should not bury a more important behaviour, data, or operational concern. If a comment is optional, label it as such rather than making a personal preference appear to be a release blocker.

## Receive Feedback as Engineering Evidence

Review feedback is about a proposed change, not the author's identity. That distinction makes it easier to examine a comment without reflexively accepting or rejecting it. A reviewer may find a real risk, identify an ambiguity in the request, or prefer an alternative whose trade-offs deserve discussion.

Use a deliberate response cycle:

1. Restate the technical concern in your own words if it is ambiguous.
2. Inspect the relevant code, contract, and evidence before replying.
3. Explain the decision and trade-off, not merely the implementation preference.
4. Update source, tests, documentation, or validation when the concern changes the proposed behaviour or evidence.
5. State any remaining disagreement or risk clearly and seek the appropriate owner when the decision exceeds the review's scope.

Constructive disagreement is possible. For example, an author may explain that a timeout message intentionally omits raw dependency text while retaining a controlled error category and elapsed time. A reviewer may then ask for a test that proves the omission. The conversation moves from assertion to evidence. The [Google Engineering Practices review guides](https://google.github.io/eng-practices/review/) provide additional role-specific guidance for code authors and reviewers.

The companion's [fictional review comments and responses](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/review-comments.md) illustrate this pattern. They are examples, not a script and not evidence of a real review.

## Resolve Conflicts by Restoring the Intended Behaviour

A **merge conflict** occurs when Git cannot automatically combine competing edits. It does not tell you which version is correct. It tells you that a human must reconcile two intended changes.

Imagine one branch changes the quality summary so a duration equal to the threshold counts as slow, while another branch renames the threshold and changes its unit. Selecting “ours” or “theirs” without understanding both changes can silently lose a policy decision. The safe approach is:

1. Read the surrounding code and the purpose of both changes.
2. Identify the required final behaviour, interfaces, and configuration units.
3. Resolve content according to that final behaviour, not according to branch ownership.
4. Remove conflict markers and inspect the complete result and diff.
5. Rerun the relevant validation, including boundary and configuration checks where applicable.
6. Explain any non-obvious resolution in the review request or commit context.

Conflicts can expose a missing shared decision rather than a text-editing problem. If two branches encode incompatible retry policy, pause and agree the policy before forcing an integration. A clean conflict resolution that chooses an unexamined value is not a safe outcome.

## Recovery Should Preserve Shared Trust

When a committed change must be undone, distinguish between making a new corrective change and rewriting or removing historical commits. A **revert** conceptually creates a new commit that counteracts an earlier committed change. In a shared repository, that is often easier for collaborators to inspect and recover from than deleting or altering the branch history they already use.

History rewriting can have legitimate uses on private, unpublished work. It becomes risky when others have based work, reviews, or release evidence on the existing commits. Follow the team's conventions, state the recovery intent, inspect the resulting diff, and rerun validation. Do not treat recovery commands as a substitute for understanding what behaviour the system needs after the change.

## Engineering Perspective

Collaborative source control makes quality work more reliable when it preserves the relationship among a change, its evidence, and the decision it supports. A bounded branch and coherent commit reduce the search space. A review request makes assumptions inspectable. A meaningful review introduces additional perspectives before integration. A safe recovery path limits the impact when evidence changes.

Experienced QA Engineers already use much of this reasoning in a different form: they define a scope, distinguish observed from assumed behaviour, seek reproducible evidence, and communicate residual risk. Modern Quality Engineering applies those habits to the code and history that create quality evidence. The contributor is responsible not only for “making the test pass,” but also for making the proposed change understandable to a team.

## Industry Perspective

Git's staged snapshot model and branch history are documented in the open [Pro Git book](https://git-scm.com/book/en/v2). Hosted pull-request systems add review and discussion around branch comparison; [GitHub's pull-request documentation](https://docs.github.com/en/pull-requests/reference/pull-requests) is one implementation example. These sources describe tools and platform concepts. MSQE does not prescribe a host, branching model, merge policy, or commit-message format; teams should adopt conventions that improve their own traceability, reviewability, and recovery.

## Common Misconceptions and Pitfalls

### “The staging area is just a list of files waiting to be committed.”

It is the proposed content snapshot. A file can contain staged and unstaged changes at the same time. Inspect the staged diff before recording the commit.

### “A green build means the change is ready for review.”

Compilation and a passing run are limited evidence. Review scope, failure semantics, data boundaries, diagnostics, and the relevance of tests to the stated claim.

### “Every commit must contain exactly one tiny concern.”

Aim for coherent, reviewable change, not arbitrary fragmentation. Tests and the source change they directly establish may belong together.

### “Rebase is always cleaner than merge.”

They express different history choices. Follow team conventions and avoid rewriting shared history without understanding the collaboration impact.

### “A merge conflict is solved by choosing our version.”

Conflict markers identify competing text, not correct behaviour. Understand both intents, resolve the desired result, then validate it.

### “Review comments are proof that the author made a mistake.”

They are engineering feedback on a proposed decision. A good response clarifies, changes evidence where needed, or explains a reasoned trade-off.

## Summary

Git and code review make Quality Engineering changes communicable, inspectable, and recoverable. The working tree contains local edits; the staging area represents the proposed commit snapshot; commits and branches preserve a focused development history; and a review request makes the change, evidence, and remaining risk visible to collaborators.

Reviewability is an engineering property. It improves when a change has coherent scope, a useful history, explicit validation, and a clear request for scrutiny. Conflicts and recovery demand the same discipline: understand intended behaviour, inspect the final result, and validate before treating the work as integrated. The next chapter makes the testing evidence behind that collaboration more deliberate.

## Key Takeaways

- A staged change is the proposed content of the next commit, not merely a set of files.
- Diffs are evidence: inspect both unstaged work and the staged snapshot for accidental scope.
- Commits and branches should make a coherent engineering decision easier to understand and recover.
- Pull requests and merge requests should state the problem, intent, change, evidence, risks, validation, and review focus.
- Review Quality Engineering code for semantics, boundaries, diagnostics, testability, and evidence—not only whether it compiles.
- Treat review feedback as a technical input, respond with evidence, and record material decisions.
- Resolve conflicts according to desired final behaviour; use recoverable shared-history practices when backing out a change.

## Review Questions

1. How does the staging area differ from the working tree, and why does the distinction matter to a reviewer?
2. What makes a commit coherent without requiring it to be arbitrarily small?
3. Which information should a reviewer be able to find in a pull-request description before reading every line of the diff?
4. Why might a quality utility require review dimensions beyond compilation and style?
5. How would you distinguish a merge conflict from a disagreement about intended behaviour?
6. What risks arise when a shared branch's history is rewritten without team agreement?
7. How can a QA Engineer's existing evidence and risk skills improve code review?

## Interview Questions

1. Describe how you would prepare a small Quality Engineering change for peer review.
2. What do you inspect before committing or approving an automation utility change?
3. How would you respond if a reviewer questioned your retry or timeout semantics?
4. Explain merge, rebase, and revert conceptually, including when shared-history safety matters.
5. How do you keep a change reviewable when it includes a refactor and a defect fix?

## Practical Exercise

### Prepare a Reviewable Quality Engineering Change

Use the Delivery 4 companion's quality-summary utility, a focused subset of the Delivery 3 companion, or a comparable local utility. Treat the work as a simulated branch contribution. Do not use private repository data, credentials, or a real production issue.

1. Define the problem, intended behaviour, explicit non-goals, likely risks, and validation plan in a short change plan.
2. Plan a coherent branch name and commit sequence. Explain why each proposed commit belongs together and identify which snapshot must be inspected before it is committed.
3. Make one focused utility change or use the companion's illustrative change. Inspect the working and staged diffs. Record diff-review notes covering scope, interfaces, tests, generated content, and sensitive data.
4. Write a pull-request or merge-request description that states the problem, intent, change, evidence, limits, validation, and requested review focus.
5. Respond to two fictional review comments: one about a behavioural boundary and one about failure, diagnostics, data, or maintainability. Explain whether each response changes code, tests, or documentation.
6. Rerun the relevant validation and record the final result and remaining risk. If your exercise uses a real repository, follow its branching and review conventions rather than manufacturing history.

### Expected Deliverables

- A change plan with in-scope and out-of-scope work.
- A proposed branch name and meaningful commit sequence.
- Diff-review notes and a validation record.
- A review request with evidence boundaries and reviewer focus.
- Two review-response rationales that distinguish technical feedback from personal preference.

### Portfolio Candidate

This can be a portfolio candidate when repository-specific details, customer data, internal URLs, and private identifiers are removed. Preserve the problem, decision, evidence, review feedback, and residual-risk statement rather than publishing sensitive source history.

## Practical Resources

- [Delivery 4 Collaborative and Tested Quality Utilities](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/README.md) — deterministic utility tests and illustrative change, commit, PR, and review artifacts.
- [Illustrative Change Plan](../../../code/part-02-programming/delivery-04-collaborative-tested-utilities/docs/change-plan.md) — a bounded change with explicit non-goals and review focus.

## Further Reading

- Scott Chacon and Ben Straub. [Pro Git](https://git-scm.com/book/en/v2) — open reference for Git concepts and workflows.
- Google Engineering Practices. [Code Review Developer Guide](https://google.github.io/eng-practices/review/developer/) and [Reviewer Guide](https://google.github.io/eng-practices/review/reviewer/).
- Git. [Reference documentation](https://git-scm.com/docs) — consult this before using unfamiliar recovery or history-editing operations.
- GitHub Docs. [Pull requests](https://docs.github.com/en/pull-requests) — an implementation-specific reference for hosted review concepts.

## References

[^pro-git]: Scott Chacon and Ben Straub. [Pro Git, 2nd edition](https://git-scm.com/book/en/v2). Apress, 2014. Accessed 2026-08-09.

[^git-rebase]: Git. [git-rebase Documentation](https://git-scm.com/docs/git-rebase). Accessed 2026-08-09.

[^github-pr]: GitHub. [Pull requests](https://docs.github.com/en/pull-requests/reference/pull-requests). Accessed 2026-08-09.

[^google-review]: Google. [Engineering Practices: Code Review](https://google.github.io/eng-practices/review/). Accessed 2026-08-09.

## Chapter Checklist

Before moving on, confirm that you can:

- [ ] Explain the repository, working-tree, staging-area, commit, branch, review, and integration layers.
- [ ] Inspect a staged snapshot rather than assuming the working copy is the commit content.
- [ ] Plan a coherent, reviewable branch and commit sequence for a Quality Engineering change.
- [ ] Write a review request that makes intent, validation, limits, and review focus visible.
- [ ] Review a quality utility for behaviour, failure semantics, boundaries, diagnostics, scope, and evidence.
- [ ] Respond constructively to review feedback with a technical rationale and updated evidence where needed.
- [ ] Resolve a conflict based on the desired final behaviour and rerun relevant validation.
- [ ] Distinguish a shared-history recovery decision from private experimentation.
