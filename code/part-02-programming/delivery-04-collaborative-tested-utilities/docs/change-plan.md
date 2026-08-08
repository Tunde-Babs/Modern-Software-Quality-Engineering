# Illustrative Change Plan — Make Quality-Summary Evidence Reviewable

> **Teaching fixture:** This is an illustrative proposed change plan for Chapter 10. It does not describe a real production system or Git history.

## Problem

The quality-summary utility aggregates execution states and slow endpoints. Its earlier loop worked, but validation and state counting were embedded together. A reviewer had to infer the slow-threshold contract and could not easily see which behaviours were intentionally preserved by the refactor.

## Intent

Make the threshold contract and aggregation responsibilities easier to inspect without changing the supported result shape or the threshold-boundary policy.

## Proposed Scope

- Retain the existing `QualitySummary` result shape.
- Validate that `slowThresholdMs` is finite and non-negative before aggregation.
- Extract state counting into a named helper.
- Add tests for normal output, the equality boundary, and invalid thresholds.
- Add characterization checks comparing the legacy teaching fixture and current implementation over representative observations.

## Explicit Non-Goals

- Do not change the definition of a slow endpoint.
- Do not alter retry or polling policy.
- Do not add a dependency, configuration format, reporting channel, or formatting-only sweep.
- Do not claim universal equivalence between the two summary implementations.

## Risk and Evidence Plan

| Risk | Evidence planned |
|---|---|
| A threshold boundary changes unintentionally | Test a duration exactly equal to the threshold. |
| State counts or endpoint de-duplication regress | Unit test a mixed observation set with a repeated endpoint. |
| Invalid configuration enters aggregation | Table-driven tests for negative, `NaN`, and infinite thresholds. |
| Refactor changes known behaviour | Characterization comparisons over a stated representative input set. |
| Async behavior is accidentally affected | No async source changes; existing deterministic async tests remain green. |

## Review Focus

Reviewers should verify that the change remains bounded, that the equality boundary is explicit, that invalid input uses the existing controlled error category, and that the tests make their evidence limit clear.

## Validation Plan

Run `npm run check`, `npm test`, inspect the final diff, and read the test names and failures as evidence. No external services, credentials, or real waiting are required.
