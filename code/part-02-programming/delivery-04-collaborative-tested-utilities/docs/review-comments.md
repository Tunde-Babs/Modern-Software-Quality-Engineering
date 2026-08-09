# Illustrative Review Comments and Responses

> **Teaching fixture:** The comments and responses below are fictional. They show how to discuss engineering risk, not a required script for review conversations.

## Comment 1 — Boundary Policy

**Reviewer:** “The implementation treats a duration equal to `slowThresholdMs` as slow. Is that intentional, or should only values above the threshold be counted?”

**Author response:** “It is intentional. The existing utility used `>=`, so changing it would be a behaviour change rather than a refactor. I added a boundary test with `durationMs: 500` and `slowThresholdMs: 500` to make that policy visible. If product policy requires a strict ‘above’ interpretation later, I will propose that separately with an updated decision and test.”

**Why this is useful:** The response separates a current preservation claim from a possible future policy change and points to specific evidence.

## Comment 2 — Failure Disclosure

**Reviewer:** “The retry helper retains the caught error as a cause. Could the terminal message expose a raw dependency response?”

**Author response:** “The terminal message is constructed only from the operation name, bounded attempt count, and retry outcome. The test uses a harmless internal marker and asserts that the public message excludes it. The cause remains available to local error handling where appropriate, but callers should rely on the controlled category and context rather than render arbitrary dependency text.”

**Why this is useful:** The response acknowledges the risk, explains the boundary, and cites a test instead of treating the concern as personal preference.

## Review Outcome to Record

Before integration, the author should confirm the final staged and branch diff, rerun the stated validation, update the review request if its scope changed, and record any remaining risk. Agreement on a review comment is not a substitute for checking the integrated result.
