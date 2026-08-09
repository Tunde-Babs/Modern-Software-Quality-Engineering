# Illustrative Expected Commit Plan

> **Teaching fixture:** These are proposed commits for a review exercise. They are not commits that this repository created.

The order separates evidence from the structural change while keeping each commit coherent. Teams may use another sensible order or commit-message convention.

1. `test: characterize quality summary outcomes and threshold boundary`
   - Adds normal, boundary, invalid-input, and characterization tests.
   - Lets a reviewer inspect the behaviour claim before reviewing the refactor.

2. `refactor: make quality-summary threshold handling explicit`
   - Adds named validation and state-counting responsibilities.
   - Preserves the public result shape and threshold policy documented by the first commit.

3. `docs: record validation and review scope for quality summary`
   - Adds the change plan and pull-request context.
   - Contains no source or policy change.

Before each commit, inspect the staged snapshot—not merely the list of changed files—to confirm that only the intended content is included. The commits are focused, but they do not claim that every useful change must be split into the smallest possible unit.
