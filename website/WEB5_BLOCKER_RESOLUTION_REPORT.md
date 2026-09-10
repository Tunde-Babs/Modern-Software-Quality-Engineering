# WEB-5B blocker-resolution report

Date: 2026-09-10. Correction author: Codex. This is implementation and author-check evidence, not independent verification or canonical closure.

**B — WEB-5 BLOCKER RESOLUTION INCOMPLETE; FOUNDER/EVIDENCE DECISION REQUIRED**

The founder's license policy is implemented and all five frozen HTTP-404 references have authoritative replacements. Website validation passes. A complete launch-ready conclusion is withheld: the immutable MSQE baseline detects the authorized manuscript changes, and follow-up found an unresolved HTTPS accessibility question for xUnit Test Patterns among the previously unverified URLs. No baseline constants were changed and no deployment occurred.

## 1. Founder license decision

The authoritative founder clarification supplies **Babatunde Ajala** and **Copyright © 2026 Babatunde Ajala** for original content and software. Educational content: CC BY 4.0. Software/tooling: Apache License, Version 2.0. No alternative license or invented entity was used.

## 2. License architecture

- Root [LICENSE](../LICENSE) assigns the two licenses by portion and documents precedence/boundaries; it does not offer either license for the entire repository.
- [LICENSE-CONTENT](../LICENSE-CONTENT) incorporates the [official CC BY 4.0 legal code](https://creativecommons.org/licenses/by/4.0/legalcode.en) by reference and separately links its [human-readable summary](https://creativecommons.org/licenses/by/4.0/). This is the explicitly permitted terms/reference arrangement, not a paraphrased legal license.
- [LICENSE-CODE](../LICENSE-CODE) is the full, byte-for-byte [official Apache License 2.0 text](https://www.apache.org/licenses/LICENSE-2.0.txt), downloaded with HTTP 200. The standard appendix remains unmodified; the project's copyright notice is in root LICENSE.
- No custom restriction, noncommercial requirement, share-alike requirement or extra attribution condition was introduced.

CC endpoints denied Python requests with 403, but the official legal code and deed were retrievable through the web tool; the published-link Node check also retrieved the public license destinations. No 403 was presented as proof of a missing license.

## 3. Exact scopes and mixed-file decisions

The controlling rules are in root LICENSE; the following summarizes their application to inspected repository structure.

| Portion | License |
|---|---|
| Original handbook prose, exercises, worksheets, case studies, reference annotations, diagrams, lab instructions and teaching slides in book/, diagrams/, labs/, references/, research/, slides/ | CC-BY-4.0 |
| Original Markdown prose throughout the repository, including root documentation, docs/ learning and governance records, templates/, code project READMEs and code/**/docs/*.md, website documentation/reports | CC-BY-4.0 |
| Documentary plain-text records such as the controlled docs/ manifest | CC-BY-4.0 |
| Actual executable examples inside teaching documents; source code, scripts, tests, configuration, lockfiles, fixtures and automation data wherever located | Apache-2.0 |
| tools/, tests/, code/ source/configuration/fixtures, website source/scripts/tests/configuration, .gitignore; machine-readable website/evidence/ records | Apache-2.0 |
| Original comments and docstrings in software | Apache-2.0 |
| Original prose in Astro/HTML/JavaScript UI files | CC-BY-4.0 |
| Markup, styles, runtime logic and scripts in those mixed UI files | Apache-2.0 |
| Original diagrams including Mermaid, pseudocode, non-executable illustrative examples and output | CC-BY-4.0 |
| Original favicon.svg / favicon.ico artwork | CC-BY-4.0; no trademark grant is added |
| Rendered handbook code/prose and generated search output | Retain the respective source/software/dependency rights; rendering does not relicense content |
| Third-party or separately licensed material, including standard license texts | Its own rights and terms; excluded from the MSQE grants |

The directory name alone is not the classifier: code/**/docs contains teaching artifacts, and website/src/pages/license.astro contains both learner guidance and implementation. A Markdown fence alone is not evidence that text is software. Empty placeholder roots are not claimed as delivered resources. Rules apply only to material for which the founder holds copyright; no new claim of third-party ownership is made. No currently inspected mixed portion is silently assigned to both licenses.

## 4. Attribution treatment

Practical attribution: **Modern Software Quality Engineering (MSQE) by Babatunde Ajala, licensed under CC BY 4.0.** Guidance asks reusers to include the source and license links, retain supplied copyright/required notices, and identify changes as required by the standard terms.

Root README's active Author field was normalized from Tunde Ajala to Babatunde Ajala. Its newly added licensing section uses the full name. New public website attribution uses the full name. Historical governance owner fields and immutable evidence retain their original wording. No repository-wide name replacement occurred.

## 5. Third-party-content boundary and public communication

Root LICENSE, LICENSE-CONTENT and `/license/` distinguish original MSQE material from third-party citations, standards, quotations, trademarks, external works, screenshots, code, assets, dependencies and separately licensed material. A link or citation does not grant rights in the cited work.

The shared footer replaces the pending-license message with a short split-license indication and a link to `/license/`. The dedicated page carries the attribution and rights boundary, avoiding chapter-body clutter. It is excluded from Pagefind. MSQE v0.16.0 and LEARNING-READY — CONTROLLED RC are retained. No First Edition or v1.0.0 completion is claimed.

## 6–9. Frozen five-URL population, occurrences, dispositions and evidence

Reconstructed before repository edits from WEB4_IMPLEMENTATION_REPORT.md §15, the existing generated `artifacts/external-links.json` and exact canonical source matches. The immutable snapshot is [frozen-links.json](evidence/web5/frozen-links.json).

Exactly **5 unique broken URLs / 12 published occurrences**. All five original destinations returned HTTP 404 in WEB-4 GET probes. Four OWASP URLs also returned 404 through this task's web lookup; the obsolete OpenSSF path was not retrievable there. Search-cache copies of OWASP pages were not mistaken for successful live endpoints.

There are **14 canonical source occurrences in 10 files**: 12 in eight chapters, plus two Part README occurrences whose reference sections are not rendered publicly. The two extra source occurrences do not expand the five-URL defect population. All 14 corrections are strictly URL substitutions.
### URL 1: openssf.org

Original: `https://openssf.org/best-practices/`

Failure: GET HTTP 404; original final URL `https://openssf.org/best-practices/`. Original provider: Open Source Security Foundation (OpenSSF).

**Disposition A — REPLACE WITH VERIFIED AUTHORITATIVE URL.**

Replacement: [https://best.openssf.org/](https://best.openssf.org/)

The official OpenSSF Best Practices Working Group resource catalogue lists its guides, education and project-evaluation resources. It is an authoritative destination for this broad best-practice reference; no unsupported claim of a redirect from the obsolete path is made.

Evidence: replacement retrieved with HTTP 200 using direct network requests and in the complete post-correction published inventory. The two exact OWASP document bodies were also checked through their official raw source URLs. Verification date: 2026-09-10. Live master/project URLs may evolve; this is a current official-source correction, not a claim of an immutable archive.

Instructional claim/context: OpenSSF best-practice resources inform bounded supply-chain and credential-boundary review in infrastructure-as-code work; security-control design remains Part X. The chapter lists this as further reading, not a quoted normative claim.

Published occurrences: **1**.

| Public page | Visible citation label |
|---|---|
| `/handbook/part-07/chapter-04-infrastructure-as-code-change-evidence-review-and-drift/` | OpenSSF Best Practices |

All canonical source occurrences (pre/post line numbers unchanged):

- `book/part-07-cloud-devops/README.md:308`

  `- **Security-sensitive delivery boundaries:** [NIST SP 800-218, Secure Software Development Framework](https://csrc.nist.gov/pubs/sp/800/218/final) and [OpenSSF best-practice resources](https://openssf.org/best-practices/) may inform a narrow supply-chain or credential-boundary claim. Security control design remains Part X.`

- `book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md:287`

  `- [OpenSSF Best Practices](https://openssf.org/best-practices/)`

### URL 2: owasp.org

Original: `https://owasp.org/API-Security/editions/2023/en/0x03-introduction/`

Failure: GET HTTP 404; original final URL `https://owasp.org/API-Security/editions/2023/en/0x03-introduction`. Original provider: OWASP Foundation.

**Disposition A — REPLACE WITH VERIFIED AUTHORITATIVE URL.**

Replacement: [https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0x03-introduction.md](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0x03-introduction.md)

Exact English Introduction source of the 2023 edition in the OWASP-owned API-Security repository. The title and edition match; the text explicitly describes the document as awareness guidance.

Evidence: replacement retrieved with HTTP 200 using direct network requests and in the complete post-correction published inventory. The two exact OWASP document bodies were also checked through their official raw source URLs. Verification date: 2026-09-10. Live master/project URLs may evolve; this is a current official-source correction, not a claim of an immutable archive.

Instructional claim/context: OWASP API Security Top 10 supplies awareness and coverage prompts for threat/workload modelling and input/output/dependency/configuration trust. The manuscript expressly avoids treating it as complete risk analysis or compliance proof.

Published occurrences: **4**.

| Public page | Visible citation label |
|---|---|
| `/handbook/part-10/chapter-02-workload-threat-and-measurement-models/` | OWASP API Security Top 10 |
| `/handbook/part-10/chapter-02-workload-threat-and-measurement-models/` | OWASP API Security Top 10 — 2023 |
| `/handbook/part-10/chapter-09-input-output-dependencies-secrets-and-configuration-trust/` | OWASP API Security Top 10 |
| `/handbook/part-10/chapter-09-input-output-dependencies-secrets-and-configuration-trust/` | OWASP API Security Top 10 — 2023 |

All canonical source occurrences (pre/post line numbers unchanged):

- `book/part-10-performance-security/chapters/chapter-02-workload-threat-and-measurement-models.md:299`

  `- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x03-introduction/)`

- `book/part-10-performance-security/chapters/chapter-02-workload-threat-and-measurement-models.md:305`

  `[^owasp-api]: OWASP Foundation. [OWASP API Security Top 10 — 2023](https://owasp.org/API-Security/editions/2023/en/0x03-introduction/). 2023. Accessed 2026-08-12.`

- `book/part-10-performance-security/chapters/chapter-09-input-output-dependencies-secrets-and-configuration-trust.md:268`

  `- [OWASP API Security Top 10](https://owasp.org/API-Security/editions/2023/en/0x03-introduction/)`

- `book/part-10-performance-security/chapters/chapter-09-input-output-dependencies-secrets-and-configuration-trust.md:274`

  `[^owasp-api]: OWASP Foundation. [OWASP API Security Top 10 — 2023](https://owasp.org/API-Security/editions/2023/en/0x03-introduction/). 2023. Accessed 2026-08-12.`

### URL 3: owasp.org

Original: `https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/`

Failure: GET HTTP 404; original final URL `https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization`. Original provider: OWASP Foundation.

**Disposition A — REPLACE WITH VERIFIED AUTHORITATIVE URL.**

Replacement: [https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md](https://github.com/OWASP/API-Security/blob/master/editions/2023/en/0xa1-broken-object-level-authorization.md)

Exact English API1:2023 Broken Object Level Authorization source in the same OWASP-owned repository. It explains object authorization checks and risk; this is the cited resource, not a related substitute.

Evidence: replacement retrieved with HTTP 200 using direct network requests and in the complete post-correction published inventory. The two exact OWASP document bodies were also checked through their official raw source URLs. Verification date: 2026-09-10. Live master/project URLs may evolve; this is a current official-source correction, not a claim of an immutable archive.

Instructional claim/context: Object-level authorization is an API security risk requiring defensive review of access to individual objects; the manuscript does not claim complete API-security assurance.

Published occurrences: **1**.

| Public page | Visible citation label |
|---|---|
| `/handbook/part-04/chapter-06-identity-at-the-boundary-authentication-authorization-and-safe-behaviour/` | API1:2023 — Broken Object Level Authorization |

All canonical source occurrences (pre/post line numbers unchanged):

- `book/part-04-api-engineering/chapters/chapter-06-identity-at-the-boundary-authentication-authorization-and-safe-behaviour.md:378`

  `[^owasp-api1]: OWASP Foundation. [API1:2023 — Broken Object Level Authorization](https://owasp.org/API-Security/editions/2023/en/0xa1-broken-object-level-authorization/). Accessed 2026-08-10.`

### URL 4: owasp.org

Original: `https://owasp.org/www-project-api-security/`

Failure: GET HTTP 404; original final URL `https://owasp.org/www-project-api-security`. Original provider: OWASP Foundation.

**Disposition A — REPLACE WITH VERIFIED AUTHORITATIVE URL.**

Replacement: [https://github.com/OWASP/API-Security](https://github.com/OWASP/API-Security)

The OWASP-owned API-Security project repository identifies itself as the API Security Project and hosts its editions and project documentation. It is the official project location when the public project URL returns 404.

Evidence: replacement retrieved with HTTP 200 using direct network requests and in the complete post-correction published inventory. The two exact OWASP document bodies were also checked through their official raw source URLs. Verification date: 2026-09-10. Live master/project URLs may evolve; this is a current official-source correction, not a claim of an immutable archive.

Instructional claim/context: The API capstone uses OWASP API guidance for bounded security awareness about ownership, cross-tenant denial and returned representations, not comprehensive security assurance.

Published occurrences: **1**.

| Public page | Visible citation label |
|---|---|
| `/handbook/part-04/chapter-10-capstone-api-quality-strategy-and-evidence-portfolio/` | OWASP API Security Project |

All canonical source occurrences (pre/post line numbers unchanged):

- `book/part-04-api-engineering/README.md:348`

  `- OWASP Foundation, [OWASP API Security Project](https://owasp.org/www-project-api-security/), as security-awareness guidance rather than a complete security-testing method;`

- `book/part-04-api-engineering/chapters/chapter-10-capstone-api-quality-strategy-and-evidence-portfolio.md:393`

  `[^owasp-api]: OWASP Foundation. [OWASP API Security Project](https://owasp.org/www-project-api-security/). Accessed 2026-08-10.`

### URL 5: owasp.org

Original: `https://owasp.org/www-project-application-security-verification-standard/`

Failure: GET HTTP 404; original final URL `https://owasp.org/www-project-application-security-verification-standard`. Original provider: OWASP Foundation.

**Disposition A — REPLACE WITH VERIFIED AUTHORITATIVE URL.**

Replacement: [https://github.com/OWASP/ASVS](https://github.com/OWASP/ASVS)

The OWASP-owned ASVS repository identifies Application Security Verification Standard and supplies the standard and release information. References here are to ASVS generically, not to a numbered requirement or fixed edition; no title, author or date change is needed.

Evidence: replacement retrieved with HTTP 200 using direct network requests and in the complete post-correction published inventory. The two exact OWASP document bodies were also checked through their official raw source URLs. Verification date: 2026-09-10. Live master/project URLs may evolve; this is a current official-source correction, not a claim of an immutable archive.

Instructional claim/context: ASVS provides verification questions for authentication/access controls and security evidence; it is not a legal requirement or proof that a system is secure. The capstone retains it as further reading.

Published occurrences: **5**.

| Public page | Visible citation label |
|---|---|
| `/handbook/part-10/chapter-08-authentication-authorization-sessions-and-api-boundaries/` | OWASP Application Security Verification Standard |
| `/handbook/part-10/chapter-08-authentication-authorization-sessions-and-api-boundaries/` | Application Security Verification Standard |
| `/handbook/part-10/chapter-10-security-evidence-findings-verification-and-residual-risk/` | OWASP Application Security Verification Standard |
| `/handbook/part-10/chapter-10-security-evidence-findings-verification-and-residual-risk/` | Application Security Verification Standard |
| `/handbook/part-10/chapter-12-capstone-performance-security-strategy-and-evidence-portfolio/` | OWASP Application Security Verification Standard |

All canonical source occurrences (pre/post line numbers unchanged):

- `book/part-10-performance-security/chapters/chapter-08-authentication-authorization-sessions-and-api-boundaries.md:311`

  `- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)`

- `book/part-10-performance-security/chapters/chapter-08-authentication-authorization-sessions-and-api-boundaries.md:317`

  `[^owasp-asvs]: OWASP Foundation. [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/). Accessed 2026-08-12.`

- `book/part-10-performance-security/chapters/chapter-10-security-evidence-findings-verification-and-residual-risk.md:327`

  `- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)`

- `book/part-10-performance-security/chapters/chapter-10-security-evidence-findings-verification-and-residual-risk.md:332`

  `[^owasp-asvs]: OWASP Foundation. [Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/). Accessed 2026-08-12.`

- `book/part-10-performance-security/chapters/chapter-12-capstone-performance-security-strategy-and-evidence-portfolio.md:493`

  `- [OWASP Application Security Verification Standard](https://owasp.org/www-project-application-security-verification-standard/)`

All five receive exactly one disposition, A. No B/C/D disposition is concealed or treated as automatic launch readiness. Claims, reference titles, authors, publication/access dates, chapter prose and reference ordering are unchanged.

## 10. Exact canonical mutations and source preservation

[canonical-mutations.json](evidence/web5/canonical-mutations.json) records each exact path, before/after Git blob and counted old→new substitution. Website preservation now authenticates against the required WEB-5B commit and reconstructs expected manuscript bytes from immutable Git text plus those exact substitutions. Unlisted changes, prose changes, different URLs, mode changes, staging and licensing-file hash drift fail. Added adversarial tests prove that unrelated prose or unreplaced URLs are rejected.

This replaces WEB-4's website-only authorization assumption; it does **not** waive or modify the separate MSQE baseline checker. Of 276 protected source objects, 265 remain byte-identical; 10 have the frozen URL transformations and LICENSE has the founder-authorized content. Root README is separately authenticated by its reviewed file hash. No tools/, tests/, historical evidence, baseline constants or declaration manifest changed.

| Canonical path | Before Git blob | After Git blob |
|---|---|---|
| `book/part-04-api-engineering/README.md` | `be9ac29a2e0d14f87ce33870840157f5b89e785b` | `24e9ad7b7dc28f0a8f391e83f3d2d2c9d4d2071d` |
| `book/part-04-api-engineering/chapters/chapter-06-identity-at-the-boundary-authentication-authorization-and-safe-behaviour.md` | `3150773cb1d7dcb12d414b80c4bd21f95b8e8614` | `23e59a67d919d4b4464571290c345010c1ea45b6` |
| `book/part-04-api-engineering/chapters/chapter-10-capstone-api-quality-strategy-and-evidence-portfolio.md` | `9725be7fc1b04565f42d2054e9d263f772b32de9` | `afbcbd7326e6e57e28a702351adfb1f41689dd8f` |
| `book/part-07-cloud-devops/README.md` | `de562bb12f6e87ed9d15701f0a22abe0ef28ee2b` | `5ef31709c622244798b058071c1f191e43d0a32f` |
| `book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md` | `b5789ea73776831f62e5d40646e9134981a65573` | `673e84a0c6a4661ace5cb1477c8362f2fcbce9c8` |
| `book/part-10-performance-security/chapters/chapter-02-workload-threat-and-measurement-models.md` | `3b609546c25283f1417036c1ca3c8d12421ec784` | `3c56d42c3e0e7d482d19af105d1c238af0789eac` |
| `book/part-10-performance-security/chapters/chapter-08-authentication-authorization-sessions-and-api-boundaries.md` | `a1e18ed2b14cc847fa90315ed748073aaf0dbbac` | `6e228153c6764230da544bb5be394b305c6b0797` |
| `book/part-10-performance-security/chapters/chapter-09-input-output-dependencies-secrets-and-configuration-trust.md` | `4d9af001836e014b5ef9a767fc9657a303879c9c` | `458ab6f91ddbf40200727af5bafe462d525064a6` |
| `book/part-10-performance-security/chapters/chapter-10-security-evidence-findings-verification-and-residual-risk.md` | `d47b638b5916a1cfd72a0269346c4373b15f6b81` | `6516d14d40b78828a00761f26b9d49c790b7774d` |
| `book/part-10-performance-security/chapters/chapter-12-capstone-performance-security-strategy-and-evidence-portfolio.md` | `ecb5d156c16af5c5113e0db7a2c2364b048e7dc9` | `a53b841a7bc9b3bb86219b097f2aa7cf5f3245f0` |

## 11. Complete external-link post-correction census

Command: `npm --prefix website run links -- --online` — exit 0.

Snapshot time: `2026-09-10T16:24:49.421Z`. Scope: all external HTTP(S) anchors in generated main content; exact URLs retained, HTTP probes omit fragments. Six workers, 12-second request timeouts, redirects followed, HEAD with GET fallback for error responses. Repeated visible references count separately. Footer duplicates are outside the scanner's documented main-content scope; the footer's new link is internal and checked by build smoke.

| Classification | Unique URLs |
|---|---:|
| VALID | 169 |
| REDIRECT | 19 |
| BROKEN | 0 |
| UNVERIFIED | 25 |
| Total | 213 |

**63 domains / 747 published occurrences.** Compared with WEB-4: +3 URLs, +3 domains, +3 occurrences. Five one-for-one replacements preserve the citation count; the licensing page adds three official license destinations. Replacements introduce best.openssf.org while openssf.org disappears from the published domain set; existing github.com remains. The three newly referenced license domains account for the net domain increase.

Complete reviewable inventory: [external-links-after.json](evidence/web5/external-links-after.json), including all page occurrences, status/error, redirect destination, timing and per-unverified follow-up evidence. `UNVERIFIED` is the report label for the scanner's `TIMEOUT/UNVERIFIED`, without changing underlying outcomes.

The 25 unverified URLs comprise 24 HTTP 403 responses and one transport failure. Follow-up:

- Fifteen official ISO catalogue URLs were retrieved through the web tool and matched their records. Withdrawn/superseded records still exist; this task does not assert edition currency or paid full-text access.
- Seven DOI references were confirmed by the official Crossref metadata API (all 200 after retrying initial 429 responses sequentially). This verifies identifier identity, not access to the publisher's full text.
- The exact INCOSE PDF was retrievable through the web tool (95 pages).
- An official ACM publication identifies the exact Code of Ethics destination; the destination still denies the automated request.
- **`https://xunitpatterns.com/` remains unresolved:** the inventory reports fetch failure and a separate Python probe reports connection refused. `http://xunitpatterns.com/` returns 200 and identifies the book site, but this does not verify HTTPS. Two published occurrences are in `/handbook/part-02/chapter-11-testing-quality-engineering-utilities/`; source lines 412 and 424. This is outside the frozen five-URL correction scope and was not silently changed or downgraded to HTTP. An evidence/scope decision is required before asserting no inaccessible instructional destination remains.

Thus there are **zero HTTP-classified broken URLs and zero remaining failures among the five corrected URLs**, but a universal zero-unresolved-accessibility claim is withheld. No full-text access, remote-fragment validity or timeless URL health is claimed.

## 12. Website validation and search

| Command/check | Result |
|---|---|
| `npm --prefix website ci` | Exit 0; 341 packages installed; lockfile unchanged |
| `npm --prefix website run check` | Exit 0; zero errors/warnings/hints |
| `npm --prefix website run build` | Exit 0; static build and Pagefind |
| `npm --prefix website run verify` | Exit 0; 39 tests pass, zero fail; type check, build and smoke pass |
| Targeted existing Playwright suite | 4 pass / 0 fail; desktop/mobile home, representative search and load-failure/favicon/resource checks |
| New licensing-page local Chrome QA | Desktop 1440×1000, mobile 375×812, CSS 200% scale; zero horizontal overflow, zero automated WCAG violations, skip-link focus works |
| `npm --prefix website audit --json` | Exit 0; zero known vulnerabilities |

The 37 prior website tests remain, plus two WEB-5B tests for exact authorized source transformations and licensing boundaries. Final visual review prompted using the existing page container and preserving spaces before inline license links; the final package was rebuilt and verified after that correction. Automated accessibility checks are bounded checks, not a comprehensive accessibility certification.

Search exercised Playwright, API testing, data quality, observability, AI quality, metamorphic testing, security, performance and quality engineering (plus a quoted phrase, empty input and no-result case). Relevant results were found, invalid search/404 destinations excluded, and only loopback requests observed. Search-load failure remained actionable; both favicons resolved; resources remained inert.

| Feature/count | WEB-4 | WEB-5B |
|---|---:|---:|
| HTML pages | 261 | 262 |
| Pagefind pages | 258 | 258 |
| Chapters / Parts | 137 / 12 | 137 / 12 |
| Resources including collections | 105 | 105 |
| Learning paths (QA Foundations) | 1 | 1 |
| Internal links/fragments checked | 13,319 | 13,587 |
| Broken internal destinations | 0 | 0 |
| References preserved | 378/378 | 378/378 |
| Sitemap URLs | 259 | 260 |

One licensing page adds one HTML/sitemap entry and is excluded from search. The footer licensing link appears on all 262 pages; existing shared navigation on the new page accounts for the remaining internal-link increase (268 total). The URL corrections change no reference count. Existing 404 recovery, canonical metadata, favicon, SEO and robots controls remain verified.

No login, analytics, tracking, ads, payment, learner-data collection or backend was introduced. Every page remains `noindex, nofollow`; robots remains disallow-all. No production-indexing environment flag was enabled. Local loopback previews only; no hosting/DNS/Cloudflare changes.

## 13–14. MSQE regression and controlled-baseline consequence

`PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p test_first_edition_gate.py -v`: **35 PASS / 0 FAIL / 0 ERROR**, exit 0.

`PYTHONDONTWRITEBYTECODE=1 python3 tools/first_edition_gate.py --profile baseline --format json`:

- Before corrections: **7 PASS**, exit 0 — [baseline-before.json](evidence/web5/baseline-before.json).
- After corrections: **5 PASS / 2 FAIL / 0 ERROR**, exit 1 — [baseline-after.json](evidence/web5/baseline-after.json).
- Only `chapter_manifest` and `part_readme_manifest` fail, only for working-tree blob identity. HEAD/index still match the accepted references; populations remain 137 and 12. Event integrity, finding lifecycle, fast-track allocation and both diff-hygiene checks pass.

| Population | Accepted / HEAD / index digest | Working-tree digest |
|---|---|---|
| chapter_manifest | `7e252ff0c38d4d1d1e4b7af1cdc9a664f934a8b4e60cad0c0c7b08406010dd22` | `eef1f42eef30a1ebb089ea929844ebfcb69e733c845209fbbc00adea41ba5657` |
| part_readme_manifest | `6b80e69f00bf06497d8fe7a8432ff6a9af8672861abf2332ebdb5bcedc6a5907` | `eafd4ba0fc55275cf8bcd9094a225e408ab22d43e019d76319ce1897b1c11451` |

Review Plan §18.4 states that future content/lifecycle changes require separately authorized baseline evolution. §18.3 requires independent review and separate freeze authorization. Existing permission for these URL corrections does not authorize rewriting the checker constants or frozen declaration manifest. They remain byte-identical. Author checks cannot reaccept the changed baseline. **Stop before any baseline evolution; no artificial gate PASS was manufactured.**

## 15. Exact changed-path scope

The allowlist was frozen before repository edits and is retained in [allowed-paths.json](evidence/web5/allowed-paths.json). It contains 29 exact paths. Final tracked modifications plus untracked files must equal this list; generated ignored artifacts are not package additions.

- `LICENSE`
- `LICENSE-CODE`
- `LICENSE-CONTENT`
- `README.md`
- `book/part-04-api-engineering/README.md`
- `book/part-04-api-engineering/chapters/chapter-06-identity-at-the-boundary-authentication-authorization-and-safe-behaviour.md`
- `book/part-04-api-engineering/chapters/chapter-10-capstone-api-quality-strategy-and-evidence-portfolio.md`
- `book/part-07-cloud-devops/README.md`
- `book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md`
- `book/part-10-performance-security/chapters/chapter-02-workload-threat-and-measurement-models.md`
- `book/part-10-performance-security/chapters/chapter-08-authentication-authorization-sessions-and-api-boundaries.md`
- `book/part-10-performance-security/chapters/chapter-09-input-output-dependencies-secrets-and-configuration-trust.md`
- `book/part-10-performance-security/chapters/chapter-10-security-evidence-findings-verification-and-residual-risk.md`
- `book/part-10-performance-security/chapters/chapter-12-capstone-performance-security-strategy-and-evidence-portfolio.md`
- `website/README.md`
- `website/WEB5_BLOCKER_RESOLUTION_REPORT.md`
- `website/evidence/web5/allowed-paths.json`
- `website/evidence/web5/baseline-after.json`
- `website/evidence/web5/baseline-before.json`
- `website/evidence/web5/canonical-mutations.json`
- `website/evidence/web5/external-links-after.json`
- `website/evidence/web5/frozen-links.json`
- `website/evidence/web5/license-file-hashes.json`
- `website/src/layouts/Base.astro`
- `website/src/pages/license.astro`
- `website/src/pages/sitemap.xml.ts`
- `website/tests/build-smoke.ts`
- `website/tests/preservation.ts`
- `website/tests/web5-licenses.test.ts`

The only active author-name normalization is root README. The only canonical learning mutations are the 14 recorded URL substitutions in 10 files. No chapter prose, authors, reference titles, dates, quantitative rules, lifecycle status or historical evidence changed.

## 16. Remaining production blockers

1. **Controlled-baseline decision:** the authorized URL corrections require fresh independent verification and separately authorized baseline evolution/reacceptance before the immutable gate can pass. This implementation must not imply the accepted Learning-Ready content manifest automatically covers the changed manuscripts.
2. **External accessibility evidence:** resolve or explicitly disposition the xUnit Test Patterns HTTPS failure (two occurrences) under a separately bounded scope. The HTTP result is evidence for a possible remedy, not authorization to alter a sixth URL or proof that HTTPS works.
3. **Fresh independent WEB-5 verification** remains mandatory for the exact unstaged package. The implementation author provides no independent score, approval or closure.

License-owner ambiguity is resolved. The five frozen 404 references have evidence-backed A dispositions. The 24 access-denied URLs remain visibly UNVERIFIED with supporting source/identifier evidence; they are not hidden or artificially counted as PASS.

## 17. Repository state and artifact integrity

Branch: `feature/web-5-launch-blockers`. HEAD: `c2401d4a8a9164d71bfb160508df89957ecf5aec`. Tracking divergence at start and finish: 0 ahead / 0 behind the local tracking reference (no remote freshness claim). Starting worktree was clean. Final package is **UNSTAGED / UNCOMMITTED / UNPUSHED**. No branch switch, commit, push, tag, release, deployment or baseline rewrite occurred.

`git diff --check`: PASS. Exact changed-path set: checked against the frozen 29-path allowlist. Staged diff empty. Official Apache download and LICENSE-CODE have identical SHA-256; [license-file-hashes.json](evidence/web5/license-file-hashes.json) records the three license files and normalized root README for review. Each canonical before/after blob is recorded above and in JSON.

Ignored `website/artifacts/` contains regenerated build, source, reference, external-link and browser reports. Stable frozen/source/HTTP/baseline evidence is included under website/evidence/web5 for the review package; ignored artifacts do not establish independent acceptance. Runtime dependency files and lockfiles were not edited.

## 18. Recommended next action and decision

Have a fresh independent reviewer rederive the exact URL/source, license-scope and changed-byte evidence from this package. Obtain a bounded decision for the xUnit HTTPS issue and separately authorize the required controlled-baseline evolution through existing governance; do not change constants merely to turn the gate green. Re-run the time-sensitive link check before any later launch authorization.

**B — WEB-5 BLOCKER RESOLUTION INCOMPLETE; FOUNDER/EVIDENCE DECISION REQUIRED.**

The implemented license and five-reference correction package is reviewable, but the remaining evidence/baseline conditions prevent the complete launch-blocker verdict. Work stops here without deployment.


---

# MSQE — WEB-5BF1 xUnit Reference Correction Report

2026-09-10 · Additive follow-up to the preserved WEB-5B report above. Correction authorship only; no independent score or baseline acceptance is asserted.

## 1. Executive verdict

**A — WEB-5BF1 XUNIT CORRECTION COMPLETE; ALL CONFIRMED EXTERNAL-REFERENCE BLOCKERS RESOLVED; READY FOR FRESH INDEPENDENT WEB-5BV2**

Exactly two founder-approved HTTPS→HTTP substitutions were made in Part II Chapter 11. The original five corrections and accepted licensing remain intact. All required website commands exit 0; 39 website tests and 35 MSQE tests pass. The unchanged baseline gate returns the expected 5 PASS / 2 FAIL, exit 1. Baseline evolution remains a separately controlled next step.

## 2. Preflight/candidate authentication

Branch: `feature/web-5-launch-blockers`. HEAD: `c2401d4a8a9164d71bfb160508df89957ecf5aec`. Local tracking divergence: 0 ahead / 0 behind. Staging was empty; the existing candidate was deliberately unstaged.

Before editing, the 29-path candidate's actual raw-file hashes were serialized as lexically sorted `path:raw-file-SHA256` lines with LF after every line, including the last. Computed SHA-256:

`0390b3141d2896000d633a90cbe81003ee60a4b44cf3ba62436b5c0f77c03c9b`

This exactly matches the supplied independently accepted candidate. [f1-continuity.json](evidence/web5/f1-continuity.json) preserves the incoming per-path hashes, the frozen eight-path F1 allowlist and the complete 35-path candidate inventory. An all-tracked/untracked-file preflight snapshot was also used for the final protected-boundary comparison.

## 3. WEB-5BV xUnit reconstruction

History remains **WEB-5B → WEB-5BV Decision B → WEB-5BF1**. WEB-5B discovered an unresolved HTTPS transport issue outside its five-URL scope. The supplied WEB-5BV independent evidence adjudicated `https://xunitpatterns.com/` as **D — GENUINELY BROKEN; AUTHORITATIVE REPLACEMENT EXISTS; WEB-5 BLOCKING** after curl, urllib and Chrome connection refusals. It independently confirmed HTTP 200 and the title `index at XUnitPatterns.com`, corroborated through Gerard Meszaros's weblog and Martin Fowler's book page. These independent findings are attributed to the supplied verification; F1 does not claim to have authored that independent review.

Source: `book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md`. The exact two occurrences are line 412 (Further Reading) and line 424 (bibliographic reference). The page is `/handbook/part-02/chapter-11-testing-quality-engineering-utilities/`.

## 4. Founder-approved disposition

The founder explicitly approved replacing `https://xunitpatterns.com/` with `http://xunitpatterns.com/` in those two occurrences only. F1's implemented disposition is **A — replace with the verified authoritative same-site HTTP URL**.

**HTTP ONLY / AUTHORITATIVE LEGACY SITE.** This maintenance distinction is recorded in the F1 evidence; no new text was inserted into the chapter or reference label. HTTPS is not a condition for accepting the specifically approved remedy. No repository-wide substitution occurred.

## 5. Exact two-occurrence correction

| Line | Context | Exact change |
|---|---|---|
| 412 | Further Reading: Gerard Meszaros. xUnit Test Patterns. | `https://xunitpatterns.com/` → `http://xunitpatterns.com/` |
| 424 | Gerard Meszaros. xUnit Test Patterns. Addison-Wesley, 2007. Accessed 2026-08-09. | `https://xunitpatterns.com/` → `http://xunitpatterns.com/` |

Before Git blob: `20a3d8ee426fb1da1dfb31d88b7c15dc1adab215`.

After Git blob: `ed8f6dfa137f7e0b6310eac4b3400d0600afe102`.

[f1-canonical-mutations.json](evidence/web5/f1-canonical-mutations.json) records the counted substitution. Byte comparison proves that reversing only these two replacements restores the incoming chapter exactly. Title, author, publisher, year, access date, prose, exercises, metadata and heading structure are unchanged. Independently rendered pre/post chapter ASTs also differ only in the two destinations; metadata and TOC compare equal.

## 6. F1 changed paths

Exactly **8 paths relative to the incoming candidate**:

- `book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md` — two approved canonical URL substitutions.
- `website/WEB5_BLOCKER_RESOLUTION_REPORT.md` — this additive F1 report; incoming report retained byte-for-byte as prefix.
- `website/evidence/web5/baseline-f1.json` — new unmodified-gate output and final controlled digests.
- `website/evidence/web5/external-links-f1.json` — new full post-F1 inventory; earlier inventory preserved.
- `website/evidence/web5/f1-canonical-mutations.json` — new exact two-substitution record.
- `website/evidence/web5/f1-continuity.json` — new incoming authentication and exact path inventories.
- `website/evidence/web5/f1-validation.json` — new coupled validation, browser, probe and census evidence.
- `website/tests/preservation.ts` — one-line inclusion of the exact F1 transformation evidence; no blanket exemption.

Six are new paths relative to the 29-path candidate; two existing candidate files change (the report and source-preservation test). The chapter is one of those six newly changed paths relative to HEAD, although it already existed in the repository. No permanent test case was added: the existing source-authentication test now applies the F1 transformation too.

## 7. Original five-correction preservation

Replayed the original frozen substitutions against HEAD and compared exact current file bytes and recorded after-blobs. All **14 substitutions across 10 canonical files** remain exactly accepted. The old canonical-mutations and frozen-links evidence files remain byte-identical. Combined with F1: **16 substitutions across 11 canonical files**. None of the five accepted replacement destinations changed.

## 8. xUnit destination validation

Three direct checks confirm the approved destination:

| Method | Status | Final URL / identity |
|---|---|---|
| Python urllib GET | 200 | `http://xunitpatterns.com/`; title `index at XUnitPatterns.com`; body identifies xUnit and Meszaros |
| curl GET with redirect following | 200, exit 0 | `http://xunitpatterns.com/`, no error |
| Complete Node external-link inventory | VALID, 200 | `http://xunitpatterns.com/`, two published occurrences |

No redirect to a different site was required. The web retrieval tool attempted HTTPS despite the requested HTTP URL and failed; that result is not used as a test of the approved HTTP endpoint. Browser inspection was restricted to the isolated localhost MSQE chapter; no browser navigation to an external site occurred. Direct probe data is preserved in [f1-validation.json](evidence/web5/f1-validation.json).

## 9. External-link final census

`npm --prefix website run links -- --online`: exit 0. Probe time: `2026-09-10T17:08:02.994Z`.

| Measure | Final |
|---|---:|
| Unique URLs | 213 |
| Domains | 63 |
| Published main-content occurrences | 747 |
| VALID | 170 |
| REDIRECT | 19 |
| BROKEN | 0 |
| UNVERIFIED | 24 |

One HTTPS URL was exchanged for the same host's HTTP URL, preserving the total URL/domain/occurrence census. Compared with the independently adjudicated pre-F1 state, xUnit moves from the sole confirmed BROKEN destination to VALID. All other URL strings, occurrence pages and labels compare equal to the prior inventory. **Zero confirmed materially broken instructional URLs remain.**

[external-links-f1.json](evidence/web5/external-links-f1.json) retains every URL, occurrence, HTTP outcome and redirect/error detail. `UNVERIFIED` normalizes the scanner's `TIMEOUT/UNVERIFIED` label without changing outcomes. Remote fragments and future accessibility are not claimed.

## 10. Remaining unverified references

The same **24 URL identities** remain UNVERIFIED (403 access denials); no edits were made to any of them. WEB-5BV established no additional materially broken instructional reference in this set. Their previous evidence remains unchanged in external-links-after.json and is carried forward as prior accepted evidence in the F1 inventory. No new reclassification to PASS was forced and no broader reference remediation was performed.

## 11. Website validation

| Command | Result |
|---|---|
| `npm --prefix website ci` | Exit 0; dependency and lockfile bytes unchanged |
| `npm --prefix website run check` | Exit 0 |
| `npm --prefix website run build` | Exit 0 |
| `npm --prefix website run verify` | Exit 0; 39 PASS / 0 FAIL |

No tests added; final permanent website test count remains **39**. The preserved checks enforce the new chapter transformation as precisely as the original ten files; unrelated prose/URL mutations remain disallowed.

Build smoke: **262 HTML pages, 258 Pagefind pages, 137 chapters, 12 Parts, 105 resource pages including collections, one QA Foundations path, 260 sitemap URLs, 13,587 checked internal destinations, zero broken internal destinations, 378/378 references preserved**. These counts are unchanged from WEB-5B. No backend or production-indexing change occurred.

## 12. Public chapter/browser check

Inspected only `http://127.0.0.1:4326/handbook/part-02/chapter-11-testing-quality-engineering-utilities/` in isolated local Chrome, with external browser requests blocked. Desktop 1440×1000 and mobile 375×812 both pass:

- Exactly two `xUnit Test Patterns` anchors, both with the approved HTTP destination; zero old HTTPS anchors.
- Further-reading context: `Gerard Meszaros. xUnit Test Patterns.`
- Bibliographic context: `Gerard Meszaros. xUnit Test Patterns. Addison-Wesley, 2007. Accessed 2026-08-09.`
- Exactly one `user-content-fn-meszaros` reference block; the separate further-reading entry is intentional, not an added duplicate.
- No horizontal overflow; one H1; skip-link and main-content focus work; zero automated WCAG A/AA violations under the existing tag set.
- Visual review of desktop/mobile reference screenshots found no layout regression. Browser requests were localhost-only.

The temporary browser check initially assumed both anchors were list items; the renderer correctly uses an uncited-reference block for the bibliography. The temporary selector was corrected and both checks passed; no product change was made for that harness issue. Automated accessibility evidence is limited to the tested page/viewports.

## 13. MSQE regression

`PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p test_first_edition_gate.py -v`: **35 PASS / 0 FAIL / 0 ERROR**, exit 0. Existing MSQE tests were not edited.

## 14. Baseline-gate result

`PYTHONDONTWRITEBYTECODE=1 python3 tools/first_edition_gate.py --profile baseline --format json`: **5 PASS / 2 FAIL / 0 ERROR**, exit 1, as expected before baseline evolution.

Only `chapter_manifest` and `part_readme_manifest` fail, in the working-tree layer. HEAD and index remain at the original accepted hashes. Event integrity, finding lifecycle, fast-track allocation and both diff-hygiene checks pass. No gate constants, rules or protected manifest were changed. Full output: [baseline-f1.json](evidence/web5/baseline-f1.json).

## 15. Final controlled manifests

Computed using the existing algorithm: SHA-256 of lexically sorted `path:Git-blob` records with final LF, over the on-disk controlled populations. Values were calculated, not inferred.

| Population / stage | Digest |
|---|---|
| 137 chapters — OLD accepted / HEAD / index | `7e252ff0c38d4d1d1e4b7af1cdc9a664f934a8b4e60cad0c0c7b08406010dd22` |
| 137 chapters — pre-F1 WEB-5B | `eef1f42eef30a1ebb089ea929844ebfcb69e733c845209fbbc00adea41ba5657` |
| 137 chapters — FINAL WEB-5BF1 | `176539f62ef89a7d0fbc99ddb98d20b852eff18103d67dda4aab4b93f4d17f02` |
| 12 Part READMEs — OLD accepted / HEAD / index | `6b80e69f00bf06497d8fe7a8432ff6a9af8672861abf2332ebdb5bcedc6a5907` |
| 12 Part READMEs — WEB-5B and FINAL F1 | `eafd4ba0fc55275cf8bcd9094a225e408ab22d43e019d76319ce1897b1c11451` |

Populations remain 137 and 12. The Part README candidate digest is unchanged by F1.

## 16. Baseline-evolution requirement

**BASELINE EVOLUTION STILL REQUIRED.**

**FINAL BASELINE EVOLUTION MUST USE THE POST-WEB-5BF1 MANIFESTS.**

The supplied WEB-5BV accepted the justification for baseline evolution. This F1 task does not execute that evolution or reopen the decision. A fresh independent **WEB-5BV2 must approve the final values** before separately authorized baseline updates. The pre-F1 chapter digest must not be used for the final candidate.

## 17. Licensing preservation

LICENSE, LICENSE-CONTENT, LICENSE-CODE, root README, website README and all public license/layout surfaces remain byte-identical to the authenticated incoming candidate. Retained: **Copyright © 2026 Babatunde Ajala**, educational CC BY 4.0, software Apache-2.0 and the third-party rights boundary. No accepted attribution or license decision was reopened.

## 18. Protected-boundary result

The exact F1 delta equals the frozen eight-path allowlist. **27 of 29 incoming candidate files remain byte-identical**; the other two contain only the coupled source-check inclusion and the additive report. The original report is an exact byte prefix of this file. All other incoming tracked/untracked repository files outside the F1 allowlist are preserved, apart from ignored runtime/build outputs regenerated by the required commands.

The only additional manuscript mutation is Part II Chapter 11, exactly two URL substitutions. Source code for the gate, tests/test_first_edition_gate.py, declaration manifest, historical governance evidence and baseline constants remain unchanged. `git diff --check`: PASS. No hidden scope expansion.

## 19. Complete candidate state

The combined candidate is **35 changed/new paths relative to HEAD**: the prior 29-path package plus six newly changed paths. Exact complete inventory and incoming hashes: [f1-continuity.json](evidence/web5/f1-continuity.json). Exact canonical inventory: the preserved canonical-mutations.json plus f1-canonical-mutations.json. Final correction census: **16 URL substitutions / 11 canonical files**.

This is a reviewable unstaged candidate, not an independently approved checkpoint. The original 29-path accepted hash remains historical pre-F1 authentication; it is not presented as the current package hash.

## 20. Repository mutation state

**UNSTAGED / UNCOMMITTED / UNPUSHED.** Branch and HEAD unchanged; local tracking divergence remains 0/0. No deployment, production indexing, Cloudflare/DNS changes, baseline update, tag or release. No login, analytics, tracking, advertising, payment, learner-data collection or backend was introduced. Isolated localhost previews used for validation were stopped after inspection.

## 21. Final decision

**A — WEB-5BF1 XUNIT CORRECTION COMPLETE; ALL CONFIRMED EXTERNAL-REFERENCE BLOCKERS RESOLVED; READY FOR FRESH INDEPENDENT WEB-5BV2**

This is the correction-author completion verdict. It does not self-award independent verification or authorize production launch.

## 22. Exact recommended next action

Commission fresh independent **WEB-5BV2** on this exact 35-path unstaged candidate. Reauthenticate the incoming WEB-5B continuity and F1 delta, validate both generated HTTP references, rerun the complete link inventory and required regressions, and approve the post-F1 controlled manifest values above. Then handle baseline evolution in its separately authorized governance step. Do not deploy or update constants within F1.


---

# MSQE — WEB-5BR Launch-Blocker Closure Preparation Report

2026-09-10. Additive closure-author record. All preceding WEB-5B/BV/BF1 history is preserved. Current state is stated here and in the active governance/website records.

## 1. Executive verdict

**STOP — ARCHITECTURE-BASED CHECKPOINT-LAYER LIMITATION; INDEPENDENT ADJUDICATION REQUIRED.**

The exact independently accepted candidate is authenticated. License and all confirmed external-reference blockers are recorded CLOSED / INDEPENDENTLY VERIFIED. The approved final baseline expectations are applied, all 39 website tests and 35 MSQE tests pass, and the corrected working-tree manifests match. However, the unchanged gate necessarily rejects old HEAD/index manifests: **5 PASS / 2 FAIL, exit 1**. Under WEB-5BR §§15–16, work stops before any further functional change or checkpoint. No 7/7 PASS or unconditional successful-closure verdict is claimed.

## 2. Preflight

Branch `feature/web-5-launch-blockers`; HEAD `c2401d4a8a9164d71bfb160508df89957ecf5aec`; local tracking divergence 0 ahead / 0 behind. Index clean, accepted candidate unstaged and uncommitted. `git diff --check` PASS. No branch, ref, staging, checkpoint or push action performed.

## 3. Incoming WEB-5BV2 package authentication

Loaded `/private/tmp/msqe-web5bv2-fresh/candidate-fingerprint.txt`, independently enumerated actual tracked modifications and nonignored untracked files, and required exact set equality. **35/35 raw-file SHA-256 matches; no extra or missing path.** Lexical `path:raw-file-SHA256` records with LF after every record reproduce:

`39f234bf009109e4ca162a44bf94651805cafb8a22b6aedb07dce304753a3976`

[br-acceptance.json](evidence/web5/br-acceptance.json) retains the authoritative verifier report, fingerprint, incoming per-file hashes, independently reproduced manifests and frozen closure allowlist. This records supplied independent authority; it does not manufacture reviewer independence for this closure author.

## 4. Acceptance evidence chain

- **WEB-5B:** dual-license and original five-reference correction authorship, 14 substitutions / 10 files.
- **WEB-5BV:** accepted licensing and original five; independently established xUnit HTTPS as remaining blocker; **Decision B** retained.
- **WEB-5BF1:** exactly two approved xUnit HTTPS→HTTP substitutions in one additional chapter; total 16 / 11.
- **WEB-5BV2:** **21 PASS / 0 FAIL / 0 INCOMPLETE, Decision A**; license and all confirmed reference blockers closed, final baseline evolution approved.
- **WEB-5BR:** unscored closure recording and approved expectation evolution; stopped at the documented checkpoint-layer limitation. WEB-5BCV remains future independent verification/adjudication.

xUnit is not retrospectively inserted into the original five population. No failed or superseded result was rewritten.

## 5. License closure

**LICENSE BLOCKER: CLOSED / INDEPENDENTLY VERIFIED** by supplied WEB-5BV2. Copyright © 2026 Babatunde Ajala. Original educational material: CC BY 4.0. Original software/tooling: Apache License 2.0. Third-party material retains its respective rights/licenses. Standard texts, identification, scope and attribution bytes are unchanged. No additional restriction was introduced.

## 6. External-reference closure

**ORIGINAL FIVE BROKEN REFERENCES: CLOSED / INDEPENDENTLY VERIFIED.**

**xUnit HTTPS blocker: CLOSED / INDEPENDENTLY VERIFIED.**

Accepted final correction census: **16 URL substitutions / 11 canonical files**. xUnit remains **HTTP ONLY / AUTHORITATIVE LEGACY SITE** at its approved same-site destination. Zero confirmed materially broken instructional URLs. Remaining 24: **UNVERIFIED / NOT ESTABLISHED BROKEN**, not universally available or forced to PASS.

## 7. Final controlled manifests

Before editing constants, a fresh calculation hashed raw files with Git blob headers and SHA-1, then SHA-256 over lexical `path:Git-blob` records with final LF, matching the existing algorithm. Values were checked against the **WEB-5BV2 report §§16–18**, not accepted from correction-author assertions alone.

| Population / stage | Digest |
|---|---|
| 137 chapters — OLD accepted | `7e252ff0c38d4d1d1e4b7af1cdc9a664f934a8b4e60cad0c0c7b08406010dd22` |
| 137 chapters — pre-F1 WEB-5B | `eef1f42eef30a1ebb089ea929844ebfcb69e733c845209fbbc00adea41ba5657` |
| 137 chapters — FINAL BF1 / approved BV2 / BR working tree | `176539f62ef89a7d0fbc99ddb98d20b852eff18103d67dda4aab4b93f4d17f02` |
| 12 Part READMEs — OLD accepted | `6b80e69f00bf06497d8fe7a8432ff6a9af8672861abf2332ebdb5bcedc6a5907` |
| 12 Part READMEs — FINAL approved / BR working tree | `eafd4ba0fc55275cf8bcd9094a225e408ab22d43e019d76319ce1897b1c11451` |

Counts remain 137 / 12. All three layers are recorded in br-baseline.json.

## 8. Deterministic checker evolution

Only `CHAPTER_DIGEST` and `PART_DIGEST` assignment values changed in `tools/first_edition_gate.py`. A full-file comparison against HEAD with precisely those two replacements proves there is no other checker mutation. Algorithm, counts, HEAD/index/working-tree checks, scope, lifecycle, event integrity, allocation, exit semantics and coverage remain unchanged. No WEB-5 special case, suppression or layer exemption exists.

The evolution is **APPROVED / APPLIED TO WORKING-TREE CHECKER EXPECTATIONS**. This does not imply a checkpoint or a gate PASS.

## 9. Test evolution

No MSQE test rewrite was necessary; all **35 existing tests** remain byte-identical. `test_baseline_evolution_preserves_all_layer_checks` already proves that evolved expectations reject stale HEAD/index, and separately reject a stale manifest in each of the three layers. Existing mismatch/population, symlink, conflict, lifecycle, scope and negative checks remain intact.

The directly coupled website preservation helper accepts only exact reviewed raw hashes for the four authorized non-website closure files. Its new br-source-hashes.json preserves that fixed scope; all other protected bytes, 16 exact manuscript substitutions, mode changes and clean-index requirements remain checked. This is website candidate authentication, not an exemption in the MSQE gate. The website suite remains 39 tests.

## 10. Governance/current-state recording

Inspected AGENTS.md, Review Plan §§13.1/18, Review Log §1 and the earlier baseline-evolution record FE-EV-046. The plan separates immutable events from method/current expectations; authorized baseline evolution has a canonical event record. Derived the maximum from event headings: 47. Added **exactly FE-EV-048**, plus its one matching index row. All FE-EV-001–047 event bodies/index rows are byte-preserved. The checker confirms 48 matching continuous body/index IDs.

Review Plan §18.8 records current approved expectations and the retained layer semantics without rewriting historical §18.4 acceptance. CURRENT_SPRINT.md now has an active WEB-5BR section explicitly distinguishing the retained historical sprint record. Website README and PRODUCTION_READINESS.md replace stale active pending-license/current-blocker wording.

Active state: WEB-4 integrated/accepted; WEB-5BV2 independently verified; license and confirmed external-reference blockers closed; approved final expectation evolution applied; closure stopped for independent checkpoint-layer adjudication. No edition stage, finding severity/allocation, historical declaration manifest or First Edition completion changed.

## 11. WEB5 blocker-report update

This 26-section BR record is appended to the exact incoming report bytes. Earlier B/BF1 decisions, discovery and evidence remain intact. Current closure state supersedes their pending-action wording without altering historical statements. Next step is narrow independent WEB-5BCV with explicit checkpoint-layer adjudication.

## 12. External-link state

Reused the authenticated, independently accepted WEB-5BV2 inventory, as authorized by §12. No canonical link changed in BR and no new network probe is represented as having occurred.

**213 URLs / 63 domains / 747 main-content occurrences: 170 VALID, 19 REDIRECT, 0 BROKEN, 24 UNVERIFIED.** The existing external-links-f1.json and all prior reference evidence retain their incoming hashes. Website build still contains the approved HTTP xUnit links. This is the accepted time-stamped link state, not a guarantee of ongoing remote availability or remote-fragment validity.

## 13. Website validation

| Required command | Result |
|---|---|
| `npm --prefix website ci` | Exit 0 |
| `npm --prefix website run check` | Exit 0 |
| `npm --prefix website run build` | Exit 0 |
| `npm --prefix website run verify` | Exit 0; 39 PASS / 0 FAIL |

Build smoke: 262 HTML pages, 258 Pagefind documents, 137 chapters, 12 Parts, 105 resource pages including collections, 260 sitemap URLs, 13,587 internal links/fragments, **zero broken internal destinations**, 378/378 references preserved. `/license/` and the corrected Part II Chapter 11 build. No browser/UI source change occurred; prior independently accepted browser evidence remains applicable. Build verifies noindex, robots, static-only scripts/forms, favicon and metadata. Command evidence and census: [br-validation.json](evidence/web5/br-validation.json).

## 14. MSQE regression

`PYTHONDONTWRITEBYTECODE=1 python3 -m unittest discover -s tests -p test_first_edition_gate.py -v`: **35 PASS / 0 FAIL / 0 ERROR**, exit 0. No permanent tests added or removed.

## 15. Baseline-gate result

Executed the required text command and retained machine-readable output from the same deterministic profile: `PYTHONDONTWRITEBYTECODE=1 python3 tools/first_edition_gate.py --profile baseline`.

**5 PASS / 2 FAIL / 0 ERROR — exit 1.** Exact failures: chapter_manifest and part_readme_manifest, **HEAD and index only**. Working-tree counts/digests equal the new expected values. Other five checks pass, including event integrity at 48/48. [br-baseline.json](evidence/web5/br-baseline.json) retains all expected/observed layers.

The existing `manifest_check` compares each layer to one accepted digest; it has no dirty-candidate exemption. HEAD/index deliberately remain old under this task's no-stage/no-checkpoint instructions. Therefore 7/7 cannot be obtained in this repository state without changing those layers or weakening the checker. Neither is authorized. This is the architecture-based limitation expressly anticipated by §§15–16 and §24. **STOP for independent adjudication; do not represent FAIL as PASS.**

## 16. Canonical mutation preservation

Every one of the 11 corrected files matches its authenticated WEB-5BV2 raw hash. Replaying the accepted 14 original plus two F1 URL substitutions against HEAD reproduces each whole file exactly. **16/16 preserved; zero new manuscript changes**. Part README and chapter candidate digests are unchanged by BR.

## 17. License preservation

LICENSE, LICENSE-CONTENT, LICENSE-CODE, root README author attribution and public license/layout files match incoming raw hashes exactly. Apache standard text unchanged; CC BY identification and Babatunde Ajala attribution unchanged. Only active/current-state prose outside standard license texts was reconciled.

## 18. Security/privacy

No login, analytics, tracking, advertising, payments, learner-data collection or backend introduced. Dependencies/lockfiles, runtime source and deployment configuration remain unchanged; no secrets or production workflow added. Existing verified static-only security/privacy behavior is preserved.

## 19. Deployment boundary

**WEB-5 DEPLOYMENT: NOT STARTED.** msqe.dev is NOT yet live under this project launch record; no live infrastructure audit was performed. Production indexing remains disabled. No Cloudflare/DNS/nameserver action, production deployment, GitHub Action, merge, tag, release, checkpoint or push occurred. Local builds only.

## 20. Closure-delta paths

Exactly 12 paths relative to the authenticated 35-path incoming candidate:

- `CURRENT_SPRINT.md`
- `docs/02-first-edition-review/FIRST_EDITION_REVIEW_LOG.md`
- `docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md`
- `tools/first_edition_gate.py`
- `website/PRODUCTION_READINESS.md`
- `website/README.md`
- `website/WEB5_BLOCKER_RESOLUTION_REPORT.md`
- `website/evidence/web5/br-acceptance.json`
- `website/evidence/web5/br-baseline.json`
- `website/evidence/web5/br-source-hashes.json`
- `website/evidence/web5/br-validation.json`
- `website/tests/preservation.ts`

Four are non-website authority/checker files authenticated by br-source-hashes.json. Three incoming candidate files change: website README, source-preservation helper, and the additive report. Nine newly changed/new paths expand the complete candidate to 44. Tests/test_first_edition_gate.py remains unchanged.

## 21. Complete final candidate

Exactly 44 changed/new paths relative to HEAD. The complete set is the union of the authenticated incoming 35 and the frozen closure delta; no extra or missing path:

- `CURRENT_SPRINT.md`
- `LICENSE`
- `LICENSE-CODE`
- `LICENSE-CONTENT`
- `README.md`
- `book/part-02-programming/chapters/chapter-11-testing-quality-engineering-utilities.md`
- `book/part-04-api-engineering/README.md`
- `book/part-04-api-engineering/chapters/chapter-06-identity-at-the-boundary-authentication-authorization-and-safe-behaviour.md`
- `book/part-04-api-engineering/chapters/chapter-10-capstone-api-quality-strategy-and-evidence-portfolio.md`
- `book/part-07-cloud-devops/README.md`
- `book/part-07-cloud-devops/chapters/chapter-04-infrastructure-as-code-change-evidence-review-and-drift.md`
- `book/part-10-performance-security/chapters/chapter-02-workload-threat-and-measurement-models.md`
- `book/part-10-performance-security/chapters/chapter-08-authentication-authorization-sessions-and-api-boundaries.md`
- `book/part-10-performance-security/chapters/chapter-09-input-output-dependencies-secrets-and-configuration-trust.md`
- `book/part-10-performance-security/chapters/chapter-10-security-evidence-findings-verification-and-residual-risk.md`
- `book/part-10-performance-security/chapters/chapter-12-capstone-performance-security-strategy-and-evidence-portfolio.md`
- `docs/02-first-edition-review/FIRST_EDITION_REVIEW_LOG.md`
- `docs/02-first-edition-review/FIRST_EDITION_REVIEW_PLAN.md`
- `tools/first_edition_gate.py`
- `website/PRODUCTION_READINESS.md`
- `website/README.md`
- `website/WEB5_BLOCKER_RESOLUTION_REPORT.md`
- `website/evidence/web5/allowed-paths.json`
- `website/evidence/web5/baseline-after.json`
- `website/evidence/web5/baseline-before.json`
- `website/evidence/web5/baseline-f1.json`
- `website/evidence/web5/br-acceptance.json`
- `website/evidence/web5/br-baseline.json`
- `website/evidence/web5/br-source-hashes.json`
- `website/evidence/web5/br-validation.json`
- `website/evidence/web5/canonical-mutations.json`
- `website/evidence/web5/external-links-after.json`
- `website/evidence/web5/external-links-f1.json`
- `website/evidence/web5/f1-canonical-mutations.json`
- `website/evidence/web5/f1-continuity.json`
- `website/evidence/web5/f1-validation.json`
- `website/evidence/web5/frozen-links.json`
- `website/evidence/web5/license-file-hashes.json`
- `website/src/layouts/Base.astro`
- `website/src/pages/license.astro`
- `website/src/pages/sitemap.xml.ts`
- `website/tests/build-smoke.ts`
- `website/tests/preservation.ts`
- `website/tests/web5-licenses.test.ts`

## 22. Closure candidate fingerprint

After finalizing all candidate files, write every raw-file SHA-256 in lexical `path:raw-file-SHA256` records, including a final LF, to:

`/private/tmp/msqe-web5br-closure/candidate-fingerprint.txt`

The SHA-256 of those exact records is in `/private/tmp/msqe-web5br-closure/PACKAGE_SHA256.txt` and the final handoff message. These fingerprint artifacts are outside the repository/candidate to avoid a self-referential report or manifest hash. The fingerprint includes this final report and every BR evidence file; no candidate file is omitted. This is author evidence; fresh WEB-5BCV must authenticate it.

## 23. Protected-boundary result

**332 tracked files outside the complete authorized candidate: 332 exact byte matches to HEAD / 0 unauthorized mismatches.** Actual tracked modifications plus nonignored untracked files equal the 44-path union. No hidden nonignored additions. The 32 incoming candidate files outside the three directly coupled BR edits retain their incoming hashes. Original report bytes are an exact prefix, historical event bodies/index rows are preserved, and all 11 manuscript files and standard license texts remain accepted bytes. `git diff --check` PASS.

## 24. Repository mutation state

**UNSTAGED / UNCOMMITTED / UNPUSHED.** HEAD unchanged at c2401d4a8a9164d71bfb160508df89957ecf5aec; index clean and still old committed content; local tracking divergence 0/0. Working tree contains approved corrected content and evolved checker expectations. No checkpoint, tag, release, merge or deployment. No gate-layer suppression.

## 25. Final decision

**STOP — WEB-5BR CHECKPOINT-LAYER LIMITATION REQUIRES INDEPENDENT ADJUDICATION.**

License and confirmed external-reference blockers are independently closed; approved final baseline evolution is applied. Website and MSQE regressions pass. The candidate is reviewable for narrow WEB-5BCV, but an unconditional successful 7/7 closure verdict is withheld because the real gate exits 1. Section 24's architecture-based escalation route is invoked; this author does not change layer semantics to obtain PASS.

## 26. Exact recommended next action

Have fresh narrow independent **WEB-5BCV** authenticate the 44-path fingerprint, rederive the exact two-constant checker diff and unchanged 16/11 correction population, verify the supplied acceptance chain and sole event/index addition, and adjudicate the expected HEAD/index failures. If accepted, obtain a separate explicit checkpoint authorization and then re-run the unchanged all-layer gate when HEAD/index/working tree all contain the approved final content. Do not checkpoint or deploy in WEB-5BR, and do not waive stale-layer detection.
