# Limitations and Residual Risk

The capstone is intentionally local and deterministic. Its fictional evidence models a narrow quality-reporting workflow, not a complete delivery platform.

| Area | Current boundary | Residual risk in a real integration |
| --- | --- | --- |
| Data contract | Local JSON fixture with runtime validation | An upstream contract could evolve; versioning and contract tests may be required. |
| Retry | Simulated, idempotent read only | A real dependency needs ownership, backoff policy, rate-limit behaviour, and idempotency evidence before retry. |
| Diagnostics | Controlled local output | Production diagnostics need privacy classification, retention policy, correlation standards, and secure storage. |
| File output | Local path configured by fixture | Concurrent writers, permissions, atomic publication, and retention are out of scope. |
| Time | Virtual deterministic clock | Real clocks can drift and distributed readiness may have more states and cancellation requirements. |

These are not defects hidden by the project; they are explicit reasons to gather more context before extending the design.
