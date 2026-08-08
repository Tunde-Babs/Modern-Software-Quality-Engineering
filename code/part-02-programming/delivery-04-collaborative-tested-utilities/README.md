# Delivery 4 — Collaborative and Tested Quality Utilities

This companion project supports Part II, Chapters 10 and 11. It is a deliberately small TypeScript utility with review artifacts and deterministic tests. It demonstrates how a Quality Engineer can make a bounded code change, communicate it for review, and produce evidence for normal, boundary, failure, asynchronous, and refactoring behaviour.

The project is a teaching fixture. Its pull-request materials describe an **illustrative proposed change**; they are not a record of commits made in this repository.

## Scope

The source code summarises quality observations and contains small polling and retry utilities. The tests use injected virtual time rather than real waiting and do not make network calls. They are evidence for the specified behaviours, not a claim of production readiness or complete coverage.

## Structure

```text
src/                 Utility code and an illustrative executable run
test/                Unit, boundary, asynchronous, error, and characterization tests
docs/                Illustrative change-plan, commit-plan, PR, and review artifacts
package.json         Minimal TypeScript and Node test-runner configuration
```

## Run Locally

Use a current Node.js installation with npm:

```bash
npm install
npm run check
npm test
npm run start
```

`npm test` compiles the TypeScript and runs the built-in Node.js test runner. The suite has no real delays: `DeterministicClock` is a fake clock that advances virtual time when polling or retry code asks to sleep.

## Evidence Boundaries

- Unit and table-driven tests check summary results and invalid thresholds.
- A boundary test establishes that a duration equal to the slow threshold is treated as slow.
- Asynchronous tests cover polling success, timeout context, retry success, non-retryable invalid input, and bounded retry exhaustion.
- A characterization test compares the legacy teaching fixture to the refactored summary over representative inputs. It documents observed behaviour; it does not prove that the legacy behaviour is universally correct.
- The error test deliberately checks that the public retry message excludes a raw dependency marker. The marker is a harmless teaching value, not a secret.

See [docs/change-plan.md](docs/change-plan.md), [docs/expected-commit-plan.md](docs/expected-commit-plan.md), [docs/pull-request-description.md](docs/pull-request-description.md), and [docs/review-comments.md](docs/review-comments.md) for the collaboration artifacts used in Chapter 10.

## Related Chapters

- [Chapter 10 — Git, Code Review, and Collaborative Engineering](../../../book/part-02-programming/chapters/chapter-10-git-code-review-and-collaborative-engineering.md)
- [Chapter 11 — Testing Quality Engineering Utilities](../../../book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md)
