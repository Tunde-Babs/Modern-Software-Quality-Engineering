# Reviewing CI feedback

The repository workflow `.github/workflows/playwright-atlas.yml` runs on companion pushes/PRs and manual dispatch. It uses Ubuntu 24.04, Node.js 24.20.0, the committed lockfile and Playwright-managed Chromium/Firefox. Repository permission is read-only. No deployment or release operation exists in this workflow.

Run the same checks locally from this companion:

```sh
npm ci
npx playwright install chromium firefox
npm run verify
npm run test:browsers
```

`verify` type-checks, executes the bridge and runs all 27 completed learner labs, all 27 solution labs and the simulator/workspace regressions in Chromium. The browser command runs Lab 18 in Chromium and Firefox. The test runner has zero retries and refuses an unknown server on its configured port. A failing validation retains its failing exit status; artifact upload does not turn it into success.

The complete-track report is uploaded before the browser-project run can replace it. Artifacts `atlas-complete-track` and `atlas-browser-projects` include reports, attachments and traces and are retained for 14 days. The Lab 16 files explicitly retain traces on passing runs to support investigation. View a downloaded report with `npx playwright show-report <directory>` or a trace with `npx playwright show-trace <trace.zip>`.

Visual references are the committed, inspected 64 × 24 two-colour indicator images. CI compares them; it never runs `--update-snapshots`. They deliberately exclude platform-font rendering and do not establish whole-page visual correctness. Accessibility results cover the inspected DOM states and need manual follow-up.

A local PASS, an authored workflow and an observed Actions PASS are distinct evidence. Record the actual Actions run URL and status when available. Logs can reveal test data; real integrations would need a deliberate redaction and secret-handling policy. The supplied simulator uses fictional credentials and disposable in-memory data only.

Labs 25–27 add 36 focused learner/solution checks for API mocking, advanced fixtures and POM/COM; run `npm run test:advanced` for that selection. Their runtime HAR outputs and automatic fixture evidence remain report artifacts, not committed user/session data.
