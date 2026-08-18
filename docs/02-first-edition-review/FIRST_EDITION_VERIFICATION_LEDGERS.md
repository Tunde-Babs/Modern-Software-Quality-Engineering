# First Edition Verification Ledgers

| Field | Value |
| --- | --- |
| **Project** | Modern Software Quality Engineering (MSQE) |
| **Milestone** | v0.16.0 — First Edition Review |
| **Document type** | Review artefact 3 of 4 — **Evidence** |
| **Authority** | [`FIRST_EDITION_REVIEW_PLAN.md`](FIRST_EDITION_REVIEW_PLAN.md) §13.1, §13.2 |
| **Lifecycle** | Populated Phase F |
| **State** | **F-L1 and F-L2 populated (Parts I–V). Batches L3–L5 and transversals T1–T6 not started** |
| **Owner** | Tunde Ajala |

> This is a **governance artefact**, not a manuscript chapter. It carries no chapter-style status.

> **This artefact records all verification records, including passes** — not only defects. A passing verification is evidence and belongs here; a defect additionally receives a finding in `FIRST_EDITION_FINDINGS.md`.

> **F-L1 and F-L2 evidence is recorded below for Parts I–V.** All populations outside L1 and L2 remain `NOT CHECKED`. Transversal-owned ledgers (§1 Source, §2 Numerical, §3 Terminology, §4 Concept, §5 Progression, §6 Dependency) carry **batch-local L1 evidence only**; none is transversally complete, because T1–T6 have not run.

---

## 0. Verification status vocabulary

Every ledger row carries exactly one status from this closed set:

| Status | Meaning |
| --- | --- |
| **`NOT CHECKED`** | The item is in the population but has not been inspected. **The F0 initial state for every item.** |
| **`PASS`** | Inspected; no defect found. **Requires evidence that an inspection actually occurred.** |
| **`FAIL`** | Inspected; defect found. **Must carry a finding ID.** |
| **`NOT APPLICABLE`** | The check does not apply to this item, with the reason stated |
| **`DEFERRED`** | Inspection deliberately postponed, with destination and trigger |
| **`BLOCKED`** | Inspection attempted but impossible, with the obstacle stated |

> **A status is never `PASS` merely because no issue is currently known.** Plan §5.4: *"For a 'no defect found' outcome, the evidence field must demonstrate that an inspection actually occurred."* A bare *"reviewed / no defect"* does not satisfy the control and does not count toward coverage.

**Structural-scan evidence (plan §5.4).** Where the method is a structural scan, the evidence field must establish that **the scan actually ran against the named object**. Any one suffices: tool or check name **with** version or script revision · command or check identifier · output or saved-report reference · result digest or hash · a reproducible result summary tied to the inspected object. **A bare `scan clean` is explicitly insufficient.**

**Sampling (plan §8).** Where a ledger's population is sampled, all six controls are declared **before selection**: population and size · sample size · selection method (with seed or strata) · risk variables where risk-weighted · rationale · reproducibility. **No post-hoc sample justification.** A category may not score above 80% of its weight without a declared sample size.

---

## 1. Source Verification Ledger

**Level 7 · Transversal T2.** Population at plan time: **378 footnote definitions across 210 distinct URLs**. **Census — no sampling.**

**Verification levels:** `PRIMARY-FULL` (full text inspected) · `PRIMARY-PARTIAL` (abstract or excerpt) · `METADATA` (registry-confirmed) · `SECONDARY` (corroborated indirectly) · `UNVERIFIED`.

**Four binding rules (plan §7 / L7):**

1. **HTTP accessibility is not source validity.** A 200 proves a URL resolves, nothing more.
2. **A 403 is not link rot.** ISO, ACM, IEEE, JSTOR and BMJ block automated clients by design. **A valid publisher URL is never replaced on this basis.**
3. **Verification level is recorded as achieved, never as intended.**
4. **Claim–source alignment is the primary test** — a real, live, correctly cited source that does not support the sentence citing it is a defect invisible to every link checker.

A source is verified **once** and its result reused; **claim alignment is assessed per citation**, because the same source may be cited correctly in one Part and overreached in another.

**L1 population reconciled: 110 footnote definitions across 22 chapters (Part I 66, Part II 44), 69 distinct URLs in definitions. This reconciles exactly with the plan §5.2 figure of 110 citations for L1.** Edition population 378/210 remains `NOT CHECKED` outside L1.

| Row ID | Scope | Source / claim | Verification level | Access result | Claim–source alignment | Limitation | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SRC-L1-01 | I ch01–03, 06, 08, 09 · `[^iso25010]`, `[^iso25010current]` | ISO/IEC 25010:2023 — Product quality model. Manuscript claims **nine** product-quality characteristics: functional suitability, performance efficiency, compatibility, interaction capability, reliability, security, maintainability, flexibility, safety | `SECONDARY` | iso.org returns **HTTP 403** — bot protection, **not link rot** (plan L7 rule 2). URL form `standard/78176.html` well-formed and consistent with siblings | **ALIGNED** — the nine names and the count match the 2023 edition; *interaction capability* correctly replaces *usability* and *flexibility* replaces *portability*; *safety* correctly added | Full standard text is paywalled; not inspected. Verification recorded as achieved, not intended | `PASS` | — |
| SRC-L1-02 | I ch03 · `[^iso25010legacy]` | ISO/IEC 25010:2011 described as **withdrawn**, eight characteristics incl. usability and portability | `SECONDARY` | 403 as above | **ALIGNED** — the 2011 eight-characteristic set and its withdrawal are correctly stated | Paywalled | `PASS` | — |
| SRC-L1-03 | I ch02 L61, L90 · ch03 L58 · `[^iso9000]` | **ISO 9000:2026 — Quality management — Fundamentals and vocabulary** | `SECONDARY` | iso.org 403; corroborated via ANSI, BSI, CEN and iTeh catalogue records | **ALIGNED** — investigated as a suspected fabricated edition and the hypothesis was **falsified**. ISO 9000:2026 is the real **fifth edition**, published May 2026, cancelling and replacing ISO 9000:2015. The title change from *"Quality management **systems** — Fundamentals and vocabulary"* to *"Quality management — Fundamentals and vocabulary"* is a genuine change in this edition and the manuscript reproduces it correctly. The non-standard URL form `iso.org/standard/9000` is the form ISO itself publishes for this record | Paywalled; edition verified from catalogue records rather than standard text | `PASS` | — |
| SRC-L1-04 | I ch06 L347 · `[^iso12207]` | **ISO/IEC/IEEE 12207:2026**, "Published April 2026" | `SECONDARY` | iso.org 403; corroborated via ANSI, IEEE Xplore, IEC and iTeh records | **ALIGNED** — 12207:2026 is real, published **29 April 2026**, cancelling and replacing 12207:2017. URL `standard/90219.html` is correct | Paywalled | `PASS` | — |
| SRC-L1-05 | I ch01, 02, 03 · `[^swebok]` and Further Reading | SWEBOK Guide **v4.0**, IEEE Computer Society | `SECONDARY` | computer.org URL well-formed | **ALIGNED** — SWEBOK v4.0 released **15 October 2024** by IEEE CS, 18 knowledge areas | Guide text not inspected in full | `PASS` | — |
| SRC-L1-06 | I · `[^iso29119]`, `[^iso25030]`, `[^iso25041]`, `[^iso25000]` | ISO/IEC/IEEE 29119-1:2022 · ISO/IEC 25030:2019 · ISO/IEC 25041:2012 · ISO/IEC 25000:2014 | `METADATA` | All URLs use the well-formed `standard/<id>.html` catalogue pattern; iso.org 403 | Designator, edition year and title consistent with the SQuaRE/29119 series as cited | Registry-level confirmation only; claim-level alignment not individually verified against standard text | `PASS` | — |
| SRC-L1-07 | II ch10 (4 keys), ch11 (2 keys) | `pro-git`, `git-rebase`, `github-pr`, `google-review`, `meszaros`, `feathers` | `NOT APPLICABLE` | n/a | **CANNOT BE ASSESSED** — these definitions carry **no in-body citation marker**, so there is no claim to align a source to | Six of L1's 110 citations are unattached | `FAIL` | **FE-L1-003** |
| SRC-L1-08 | L1 remainder — 104 of 110 definitions | Non-standards sources (Fowler, Google eng-practices, MDN, TypeScript docs, NIST, OWASP, DORA, SRE book, etc.) | `NOT CHECKED` | — | — | Individual claim–source alignment for the non-standards population is **transversal T2 work** and was not completed by L1 | `NOT CHECKED` | — |

---

## 2. Numerical Verification Ledger

**Level 8 · Transversal T3.** Population: **1,169 Tier-1 candidates** (plan §6.4 active census — **no Part exempt**) plus **1,516 Tier-2 candidates** triaged per chapter into claim or identifier; confirmed Tier-2 claims join this ledger. **Code-fence numerics (310) and inline-code candidates (366) are separate populations**, reviewed where technically relevant, and are neither Tier 1 nor Tier 2.

> **Population figures refreshed at F-IR4C.** The C4-era figures previously stated here — Tier-1 1,213, Tier-2 1,511, code-fence 186 — are **superseded** (plan §6.5) and must not be used operationally. **All four populations are enumerable** from `python3 tools/quantitative_census.py --detail`, which emits Part, path, line, population, class and matched text for every candidate. The L1 and L2 rows below were written against the C4-era census and are retained as the historical record of those batches; **F-IR3 confirmed that every candidate in the current census is covered by them — L1 20/20 and L2 19/19** (NUM-IR3-05).

**Method:** recompute with **exact rational arithmetic**; test **every displayed intermediate as written**; apply **rounding-aware comparison** (`ROUND_HALF_UP` to the displayed precision).

> **The dual verdict is mandatory.** `ARITHMETIC: PASS / INFERENCE: FAIL` must be expressible. **A correct calculation can support an invalid conclusion.**

**Inference tests:** is the denominator defined? did the population change mid-window? is a proxy treated as the construct? does a percentage change conceal a mix shift? is a correlation stated as cause?

**L1 population.** Accepted census: Tier-1 **23**, Tier-2 **43**, code-fence **32**. This review enumerated the **union** of two independent classifier runs — 23 spans — and verified all of them. **Six are version strings, not quantitative claims (FE-L1-006); the genuine Tier-1 population is 17, and all 17 were recomputed.**

| Row ID | Part·Ch·Line | Class | Claim as written | Recomputed / tested | **ARITHMETIC** | **INFERENCE** | Inference test applied | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NUM-L1-01 | I·1·73 | `pct` | "complete **95%** of requests within 300 ms at the agreed peak workload, excluding client-network time" | Proportion target, no computation | **PASS** | **PASS** | Population defined (*authenticated catalogue searches*); workload stated (*agreed peak*); exclusion stated (*client-network time*). No undefined denominator | `PASS` | — |
| NUM-L1-02 | I·1·73 | `unit` | "within **300 ms**" | Threshold, no computation | **PASS** | **PASS** | Bound to the same defined population as NUM-L1-01 | `PASS` | — |
| NUM-L1-03 | I·1·419 | `pct` | "A team reports **95%** automated-test coverage but customers still encounter critical failures" | No computation — interview prompt | **PASS** | **PASS** | Deliberately poses coverage-as-proxy invalidity; proxy is **not** treated as the construct | `PASS` | — |
| NUM-L1-04 | I·3·159 | `pct` | "**95%** of a defined class of booking requests complete within an agreed time under expected peak demand" | Proportion target | **PASS** | **PASS** | Population explicitly *"a defined class"*; workload stated | `PASS` | — |
| NUM-L1-05 | I·6·24 | `dec` | "a **1.2**-second timeout—the maximum wait" | 1.2 s vs observed 1.5 s | **PASS** | **PASS** | 1.5 > 1.2 ⇒ timeout fires. Consistent | `PASS` | — |
| NUM-L1-06 | I·6·24 | `unit` | "Some responses arrive at **1.5 seconds**" | See NUM-L1-05 | **PASS** | **PASS** | Retry-amplification chain checked: client timeout does **not** cancel server-side work; pool exhaustion follows; health checks pass while system fails. Causally sound. Explicitly framed *"illustrative scenario"*, so not presented as measurement | `PASS` | — |
| NUM-L1-07 | I·7·423 | `unit` | "move from QA gatekeeping to Quality Engineering enablement in **90 days**" | Interview prompt | **PASS** | **PASS** | No inference drawn | `PASS` | — |
| NUM-L1-08 | I·8·282 | `unit` | "A useful QA-to-QE roadmap spans **12–24 months**" | Range | **PASS** | **PASS** | Stated as *"useful"* guidance, not a measured finding; hedged | `PASS` | — |
| NUM-L1-09..12 | I·10·407–410 | `unit` ×4 | Time-horizon table: 0–**6 months** · 6–**18 months** · 18–**36 months** · 36–**60 months** | Boundary continuity checked | **PASS** | **PASS** | Contiguous, non-overlapping, monotonically increasing; shared endpoints are the conventional form. No gap | `PASS` | — |
| NUM-L1-13 | II·1·209 | `unit` | "a policy might say that an execution over **750 milliseconds** is slow for a particular environment" | Threshold | **PASS** | **PASS** | Explicitly framed as **policy, not fact** — the chapter's policy/mechanism distinction | `PASS` | — |
| NUM-L1-14 | II·3·379 | `unit` | "It cannot prove … that **750 milliseconds** is an acceptable threshold" | Threshold | **PASS** | **PASS** | Exemplary: states the limit of what the evidence supports | `PASS` | — |
| NUM-L1-15..16 | II·11·103 | `unit` ×2 | "assert a timeout at **200 milliseconds** of virtual time without waiting **200 milliseconds** in the real world" | Fake-clock semantics | **PASS** | **PASS** | Virtual vs wall-clock time correctly distinguished; no claim that real elapsed time is measured | `PASS` | — |
| NUM-L1-17 | II·12·121 | `unit` | "If an execution of exactly **500 milliseconds** is 'slow,' encode and test `durationMs >= slowThresholdMs`. If it is not slow, encode and test `>`" | Boundary logic evaluated both ways | **PASS** | **PASS** | Inclusive boundary ⇒ `>=`; exclusive ⇒ `>`. **Logically correct in both branches** | `PASS` | — |
| NUM-L1-18..23 | I·1·435 · I·2·347 · I·2·363 · I·3·423 · I·3·441 · I·10·519 | `dec` ×6 | `4.0` (SWEBOK Version 4.0) ×5 · `1.1` (SSDF Version 1.1) ×1 | Not quantitative claims | **NOT APPLICABLE** | **NOT APPLICABLE** | Version strings captured from retained link text and footnote-definition lines | `NOT APPLICABLE` | **FE-L1-006** |
| NUM-L1-T2 | L1 Tier-2 | — | 43 accepted Tier-2 candidates | Triage not completed | — | — | Tier-2 per-chapter triage is **transversal T3** work; L1 confirmed no Tier-2 candidate was promoted to a Tier-1 claim | `NOT CHECKED` | — |
| NUM-L1-CF | L1 code-fence | — | 32 accepted code-fence numerics | Reviewed as part of executable verification (see §6 note) rather than as claims | — | — | Plan §6.2: code-fence numerics are neither Tier 1 nor Tier 2 | `NOT APPLICABLE` | — |

**L2 population.** Accepted census: Tier-1 **29**, Tier-2 **94**, code-fence **66**. **Enumerated independently of the unresolved FE-L1-005 instrument** by an over-inclusive sweep (fenced code removed only) yielding **130 raw candidates**, each manually adjudicated against the PASS-0 exclusions. **20 genuine Tier-1 quantitative claims identified and all 20 recomputed.** Part IV (2) and Part V (4) match the accepted census exactly; Part III returns 14 against 23.

| Row ID | Part·Ch·Line | Class | Claim as written | Recomputed / tested | **ARITHMETIC** | **INFERENCE** | Inference test applied | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| NUM-L2-01..03 | III·1·22, 154, 160 | `thou` ×3 | "**1,842** automated checks have passed" · "The **1,842** passing checks are not meaningless" · "Twelve is not inherently better than **1,842**" | Value identical at all three occurrences — **no drift** | **PASS** | **PASS** | The chapter's entire argument is that a large pass count does not establish decision-relevant evidence. Explicitly framed *"illustrative scenario… fictional subscription service"*, so not presented as measurement | `PASS` | — |
| NUM-L2-04 | III·1·259 | `thou` | Exercise evidence table: "Pricing-rule checks \| **1,800** checks passed" | Cross-checked against the opening story's 1,842 total | **PASS** | **PASS** | Consistency test: the opening story states *"most passing checks exercise the pricing calculator"*; 1,800 of 1,842 is **97.7%**, which satisfies "most". **No contradiction between the two figures** | `PASS` | — |
| NUM-L2-05..08 | III·1·255 · III·2·199, 284 · III·4·291 · III·6·275 | `pct` | "**10%** of subscriptions" / "**10%** staged rollout" ×4 | Identical scenario parameter across four chapters | **PASS** | **PASS** | Population defined in each instance (subscriptions / release). No rate is derived from it, so no denominator risk | `PASS` | — |
| NUM-L2-09..10 | III·5·118 | `unit` ×2 | "A session may be **30 minutes**, **90 minutes**, or another proportionate interval" | Range statement | **PASS** | **PASS** | Explicitly open-ended (*"or another proportionate interval; the length should fit…"*), so no false precision | `PASS` | — |
| NUM-L2-11..12 | III·12·92, 94 | `unit` ×2 | "subscriptions expired no more than **30 days** ago" · "expires after **48 hours** unless a valid settled event is processed first" | Capstone scenario rules; boundary conditions checked for mutual consistency | **PASS** | **PASS** | Both are stated rules with explicit qualifying conditions; neither is presented as measured data | `PASS` | — |
| NUM-L2-13 | III·12·464 | `unit` | "Timebox an initial pass to **90 minutes**" | Instruction | **PASS** | **PASS** | No inference drawn | `PASS` | — |
| NUM-L2-14 | IV·8·101 | `thou` | "Avoid claims such as *"the API handles **1,000** requests"* without the endpoint, payload, duration, concurrency, and success definition" | Anti-example | **PASS** | **PASS** | **Exemplary** — the quantity is presented precisely to teach that an undefined population and denominator invalidate a capacity claim | `PASS` | — |
| NUM-L2-15 | IV·8·208 | `unit` | "*"All APIs must respond within **200 milliseconds**"* is not a reliable requirement" | Anti-example | **PASS** | **PASS** | **Exemplary** — teaches that a context-free threshold is not a requirement; enumerates four operation types with materially different timing needs | `PASS` | — |
| NUM-L2-16..17 | V·8·82, 386 | `unit` ×2 | "attempt 2 passed after **47 seconds**" (twice, same scenario) | Value identical at both occurrences — **no drift** | **PASS** | **PASS** | Used to support a *"dependency or environment hypothesis"*, explicitly held as hypothesis rather than conclusion | `PASS` | — |
| NUM-L2-18 | V·10·22 | `thou` | "Its automation dashboard shows **4,000** checks, a number leaders proudly cite in planning meetings" | Illustrative scenario | **PASS** | **PASS** | The paragraph's point is that suite size conceals cost and duplicate evidence — count explicitly rejected as a health proxy | `PASS` | — |
| NUM-L2-19 | V·11·124 | `unit` | "The panel also displays *"updated **14 seconds** ago."* The timestamp causes an expected difference" | Visual-diff scenario | **PASS** | **PASS** | Correctly identifies a dynamic timestamp as a source of expected visual difference requiring masking | `PASS` | — |
| NUM-L2-EXC | III·1,2,3,4,5,6,9,12 · IV·6,7,10 · V·11 | — | Version strings and URL date fragments — ISTQB `v4.0.1`→`0.1`, `2024/11`, `2016/05`, `2015/04`, OAuth `2.0`, AsyncAPI `3.1.0`→`1.0`, WCAG `2.2`, DOI `10.6028` | Not quantitative claims | **NOT APPLICABLE** | **NOT APPLICABLE** | All occur inside footnote-definition lines (E5), link targets/URLs (E3/E4) or chapter metadata rows (E7) | `NOT APPLICABLE` | — |
| NUM-L2-META | all 34 chapters | — | `Estimated study time \| NNN minutes` and `Version \| 0.1.0` | Not claims | **NOT APPLICABLE** | **NOT APPLICABLE** | Chapter metadata rows, excluded by **E7** | `NOT APPLICABLE` | — |
| NUM-L2-T2 | L2 Tier-2 | — | 94 accepted Tier-2 candidates | Triage not completed | — | — | Per-chapter Tier-2 triage is **transversal T3** work; L2 confirmed no Tier-2 candidate required promotion to Tier-1 | `NOT CHECKED` | — |
| NUM-IR1-01 | edition | — | **Instrument validation, Phase F-IR1.** Adversarial suite of **36 cases** spanning percentages, currency, all time units, storage, request rates, slash ratios, clock times, ISO/RFC designators, versions, dates, DOIs, URLs, link targets, footnote definitions and references, metadata rows, chapter headings, section numbers, ports, bare identifiers, inline code, fenced code, compound durations and repeated identical claims | **35 PASS / 1 FAIL on first run.** The single failure — `12/2024` admitted as a `ratio` — was a **defect in the implementation against a rule §6.2 already stated correctly**, and was corrected. **36/36 PASS after correction** | — | — | Both directions tested per §6.3: exclusions for suppression, inclusion classes for contamination | `PASS` | **FE-L1-005** |
| NUM-IR1-02 | edition | — | **Determinism.** Repeated execution of `tools/quantitative_census.py` | Aggregate output SHA-256 identical across runs (`07b1e3a6…`); `--json` output identical across runs (`329c16ba…`) | — | — | Row order fixed; no wall-clock, randomness or filesystem-order dependence | `PASS` | **FE-L1-005** |
| NUM-IR1-03 | edition | — | **Census recomputation.** Tier-1 **1,169** · Tier-2 **1,516** · code-fence **310** · inline-code **366** · words **651,161** | Recomputed from manuscript content with no hard-coded totals. Words reconcile **exactly** with the C4-era figure for all twelve Parts | — | — | Supersedes Tier-1 1,213 / Tier-2 1,511 / code-fence 186 (§6.5) | `PASS` | **FE-L1-005** |
| NUM-IR1-04 | III | — | **Part III forensic reconciliation.** Accepted 23 versus 14 genuine | Full candidate census for Part III is **67**: **14** prose candidates · **27** on footnote-definition lines (E5) · **24** in chapter metadata rows (E7) · **2** in link targets (E3/E4). Switchable re-implementation yields **14** with the full pipeline and **22** with E5 disabled. **23 is not reachable under any configuration of the ten documented exclusions** | — | — | Eight of the nine-item gap are ISTQB `v4.0.1` → `0.1` version strings on footnote-definition lines; **the ninth is not attributable to any documented configuration** | `PASS` | **FE-L1-005** |
| NUM-IR1-05 | V | — | **Part V stability.** Accepted 4 versus recomputed 3 | The difference is a single `47 seconds` inside an **inline code span** in `chapter-08` — a quoted diagnostic message containing a genuine duration. Under the corrected specification it is excluded from Tier 1 by E2 and **reported in the new inline-code candidate population** (§6.2.3), where Level 8 will adjudicate it. **It is no longer silently lost** | — | — | Part IV is unchanged at 2 under both the old and the corrected method | `PASS` | — |
| NUM-IR3-01 | edition | — | **Independent match-level reproduction, Phase F-IR3.** Reviewer authored neither F-IR1 nor F-IR1B; read plan §6 before the implementation and froze results before opening it | A classifier written independently and compared row-by-row against `tools/quantitative_census.py` on the full tuple (Part, path, line, tier, class, text) with occurrence multiplicity preserved: **2,685 rows against 2,685 rows, 0 canonical-only, 0 independent-only.** All 60 Part-level fields and all five batch aggregates reproduce exactly | — | — | Aggregate agreement explicitly rejected as sufficient; the comparison is match-level | `PASS` | **FE-L1-005** |
| NUM-IR3-02 | edition | — | **Independent E11 verification, Phase F-IR3** | **28/28 boundary cases** derived from the committed §6.1.1 rule, reproducing its worked table exactly. Fragmentation property confirmed: E11 cannot manufacture a numeric fragment absent from source. Repository-wide, **51** four-digit years reach Tier-2. **The decomposition recorded at F-IR3 — 49 numeric + 2 alphanumeric — is SUPERSEDED and must not be used operationally**; it counted distinct lexical forms against a denominator of occurrences. The **active** decomposition, measured independently at F-IR4 and recorded at plan §6.1.1, is **40 occurrences in numeric constructs + 11 occurrences in alphanumeric identifiers = 51**, the latter spanning six forms (`archive-2024`, `fulfilment-2026-02`, `v2026-02-P`, `v2026-03-EU`, `v2026-03-US`, `CMU/SEI-2000-TR-004`). **Counts are occurrences, not distinct forms.** Reconciled at **F-IR4E**; the total 51, the 28/28 boundary-case result and this row's verdict are unaffected | — | — | Range, both boundary sets, asymmetric `%`, start/end-of-text, and interaction with E3/E4/E5/E7/E10/E12 and both auxiliary populations | `PASS` | **FE-L1-005** |
| NUM-IR3-03 | edition | — | **Independent adversarial suite, Phase F-IR3.** Constructed independently of the F-IR1/F-IR2/F-IR1B cases | **38 cases, 38 PASS.** Percentage · currency · unit · per-unit · slash ratio · decimal · large count · clock time · calendar year · ISO date · month/year · version · ISO/RFC designators · DOI · URL · HTTP status with and without trigger · port · chapter heading · section number · footnote definition and reference · metadata row with non-metadata control · inline code · fenced code · compound duration · repeated value · year with trailing punctuation · year in numeric construct | — | — | Both directions per plan §6.3: exclusions for suppression, inclusion classes for contamination | `PASS` | **FE-L1-005** |
| NUM-IR3-04 | edition | — | **Specification completeness, Phase F-IR3.** Can the census be derived from the committed §6.1/§6.2 text alone? | **NO.** An implementation written from the committed text returned Tier-1 **1,179** · Tier-2 **1,801** · inline-code **233** against the accepted 1,169 / 1,516 / 366. **Eight under-specified decision points each move the census**, jointly spanning Tier-1 1,154–1,231 and Tier-2 1,459–1,795. Word count (651,161) and code-fence (310) reproduced with no guessing | — | — | The accepted figures were reachable only by searching an interpretation space against the published totals, which is not reproduction | **`FAIL`** | **FE-L1-005** |
| NUM-IR3-05 | edition | — | **Retrospective batch coverage, Phase F-IR3** | Every current Tier-1 candidate mapped to an existing ledger row: **L1 20/20**, **L2 19/19**. The L1 ledger is a superset — three of its six `dec` rows sat on footnote-definition lines and are correctly absent from the corrected census. The Part V inline `47 seconds` at `V·8·82` was substantively reviewed at NUM-L2-16..17 | — | — | No supplemental review required for either batch | `PASS` | — |
| NUM-IR4C-01 | edition | — | **Census invariance under the F-IR4C specification and traceability correction** | Re-run after all edits: **Tier-1 1,169 · Tier-2 1,516 · code-fence 310 · inline-code 366 · words 651,161**, every Part and batch figure unchanged. **Tier-1/Tier-2-only detail digest unchanged at `c84fe3df90c114584c5454493156f4c6baed84ccd43f70e2e129e276b69066e5`**, so the prose match population is byte-identical | — | — | The specification was completed to describe existing behaviour; no classification rule was altered | `PASS` | **FE-L1-005** |
| NUM-IR4C-02 | edition | — | **Four-population enumerability, Phase F-IR4C** | `--detail` now emits **1,169 + 1,516 + 310 + 366 = 3,361** rows carrying Part, path, line, population, class and matched text; `--json` carries the same under `candidates`. Verified directly: Part V inline `47 seconds` at `chapter-08` L82; Part IX 135 and Part X 171 inline rows; code-fence rows in Parts I, II, IV, VI, VIII and X. Determinism re-confirmed across three runs of each mode | — | — | Plan §6.2.4 — *a reviewer must never be required to discover the candidate population by hand* — now holds for **all four** populations rather than two | `PASS` | **FE-L1-005** |
| NUM-IR4C-03 | edition | — | **C4-1 / C4-3 disposition, measured at Phase F-IR4C** | **C4-3 RESOLVED:** 0 clock forms survive PASS 0, against 40 recorded at C4. **C4-1 PARTIALLY RESOLVED, remains open (P3):** 0 millisecond fragments remain; the letter-adjacent version class (`v4.0a` → `4.0`) is eliminated, but **14 of 147 `dec` candidates** are still space-separated version numbers (`Version 4.0`, `Framework 2.0`, `OAuth 2.0`) | — | — | Both are unintended consequences of the F-IR1 correction, detected at F-IR3 and recorded so the carried-forward register states what is now true. **Phase C4 did not repair either** | `PASS` | — |
| NUM-L2-CF | L2 code-fence | — | 66 accepted code-fence numerics | Part IV contains **4 code blocks** (2 `text` diagrams, 2 `http` examples); Parts III and V contain none | — | — | Plan §6.2: neither Tier 1 nor Tier 2. **The accepted figure of 66 is not reproducible from the 4 blocks present** — recorded under FE-L1-005, code-fence counting being undefined in §6.1 | `NOT APPLICABLE` | **FE-L1-005** |

---

## 3. Terminology Register

**Level 6 · Transversal T1.** **Census** of standards claims; census of terms appearing in **three or more Parts**.

**Bidirectional test:**

- **SAME TERM → DIFFERENT MEANING** — collect definitions across Parts; verdict `CONSISTENT` / `CONTEXTUAL` / **`INCONSISTENT`**.
- **DIFFERENT TERM → SAME CONCEPT** — cluster synonyms; verdict `INTENTIONAL` / **`UNDECLARED`**.

> Both are separated from legitimate contextual variation by one test: **is the variation stated in the text?** Stated is contextual; unstated is a defect.

**Only standards the repository actually cites are checked. No standards dependency is invented.** Each standards claim records standard, edition, claim, verification level and limitation; where only secondary verification is possible the claim is **narrowed** and the limitation carried openly.

**Batch-local L1 evidence only. The census of terms appearing in three or more Parts is transversal T1 work and has not run.**

| Row ID | Term / standards claim | Parts observed | Verdict | Variation stated in text? | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- |
| TRM-L1-01 | Quality Engineering · Quality Assurance · Quality Control · testing | I (ch01 table, ch02) | **CONSISTENT** within L1 — each defined by its *primary question*, *typical activities* and *limitation when used alone*; QE stated to include testing and possibly QA/QC | **Yes** — ch01 line 82 states explicitly *"Their boundaries differ across organisations, so teams should establish shared meanings."* Stated variation is contextual, not a defect (plan L6 test) | `PASS` | — |
| TRM-L1-02 | product-quality characteristic vs engineering capability (observability, testability, deployability) | I ch01, 02, 03, 04, 06, 08, 09 | **CONSISTENT** — every one of the seven occurrences keeps observability/testability/deployability **outside** the ISO/IEC 25010 characteristic set. ch06 additionally rules resilience out as *"not a tenth ISO/IEC 25010 characteristic"*, consistent with the stated count of nine | Yes | `PASS` | — |
| TRM-L1-03 | ISO/IEC 25010 characteristic count | I ch01, 03, 06 | **CONSISTENT** — "nine" stated in ch01 L61 and ch03 L125/L330/L338; the enumerated names match; the 2011 eight-characteristic set is contrasted, not conflated | Yes | `PASS` | — |
| TRM-L1-04 | `null` vs `undefined` vs omitted property | II ch02, 03, 07, 12 | **CONSISTENT** — omission means "not supplied", `null` means "known to have no value"; ch02 requires the domain meaning to be documented rather than used interchangeably | Yes | `PASS` | — |
| TRM-L1-05 | Cross-Part terminology census (terms in ≥3 Parts) | — | — | — | `NOT CHECKED` — **transversal T1** | — |
| TRM-L2-01 | **oracle** | IV ch01, V ch01 | **B — intentional reinforcement** — defined **verbatim identically** in both: *"the source of expectation used to judge an observation"* | n/a — identical | `PASS` | — |
| TRM-L2-02 | **automated check** | III ch07, V ch01 | **D — harmless variation** — *"an executable mechanism that stimulates or observes a selected condition and compares the observation with an oracle"* vs *"a programmatic mechanism that performs or observes a selected interaction and compares an observation with an expectation"*. Semantically identical; *oracle* is separately defined as the source of expectation, so the two wordings agree | Yes | `PASS` | — |
| TRM-L2-03 | **escaped defect** | III ch11, V… IV ch09 | **D — harmless variation.** III defines by detection boundary — *"discovered after the intended pre-release detection boundary"* — and **its own next sentence supplies the evidence framing**: *"It means the quality system did not expose or prevent the condition."* IV restates that evidence framing for the API context. **Investigated as possible conceptual drift (class G) and the hypothesis was falsified** — Part III bridges both readings explicitly | Yes | `PASS` | — |
| TRM-L2-04 | **concurrency** | IV ch08, V ch07 | **D — harmless variation** — *"overlapping work in progress"* vs *"more than one unit of work makes progress over an overlapping period"* | Yes | `PASS` | — |
| TRM-L2-05 | **feedback latency** | III ch10, V ch09 | **D — harmless variation** — *"time between a meaningful change or condition and evidence reaching someone who can act on it"* vs *"time between a relevant change or question and the arrival of usable evidence"* | Yes | `PASS` | — |
| TRM-L2-06 | **evidence boundary** · **suite health** | III ch06/ch10, V ch06/ch10 | **A — progressive deepening** — each is stated generally in Part III and applied to the automation-system context in Part V without redefining it | Yes | `PASS` | — |
| TRM-L2-07 | Cross-Part terminology census across Parts I–XII | — | — | — | `NOT CHECKED` — **transversal T1** | — |

---

## 4. Concept Consistency Matrix

**Level 5 · Transversal T1.** **Census** of every concept appearing in **three or more Parts** with definitional or instructional weight. **Concept selection is evidence-driven from occurrence data, not from a pre-supplied list.**

**Cell classification:**

| Class | Meaning | Evidence required |
| --- | --- | --- |
| **A** | progressive deepening | quote both; show the extension |
| **B** | intentional reinforcement | quote the signpost |
| **C** | contextual reinterpretation | quote both; show the lens is stated |
| **D** | harmless terminology variation | quote both; show semantic identity |
| **E** | unnecessary duplication | quote both; show no added value |
| **F** | contradictory definition | **quote both verbatim; state the logical conflict** |
| **G** | conceptual drift | quote three or more points showing the trajectory |
| **H** | later teaching invalidating earlier | quote both; show what breaks |

> **Every non-D cell carries a Part and chapter citation. F, G and H require verbatim quotation of both sides — no paraphrase.** Ownership is recorded per concept: which Part **owns** the definition, which merely **uses** it. **A concept with two owners is a candidate E or F.**

**Batch-local L1 evidence only. Concept selection must be evidence-driven from edition-wide occurrence data (transversal T1); that census has not run, so no cell is classified for Parts III–XII.**

| Row ID | Concept | Owning Part (observed) | I | II | Class within L1 | Evidence | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CON-L1-01 | Quality as a system property | I ch01 (owner) | defines | uses | **A — progressive deepening** | ch01 *"Quality as a System Property"*; ch06 extends it to cross-service failure propagation without redefining it | `PASS` | — |
| CON-L1-02 | Evidence (as distinct from test results) | I ch01 (owner) | defines | uses | **A — progressive deepening** | Part I frames evidence for decisions; Part II ch01/ch03 turn execution records into evidence and state explicitly what the code *cannot* prove | `PASS` | — |
| CON-L1-03 | Policy vs mechanism | II ch01 (owner) | — | defines and reuses | **B — intentional reinforcement** | ch01 L209 introduces it; ch03 L379 and ch12 L121 reuse it for threshold decisions with a signposted callback | `PASS` | — |
| CON-L1-04 | Observability | I ch02 (owner) | defines | — | **D — harmless variation** | ch02 L166 and ch01 L67 give semantically identical definitions in different words; both state it is a capability, not a 25010 characteristic | `PASS` | — |
| CON-L1-05 | Full concept census across Parts I–XII | — | — | — | — | — | `NOT CHECKED` — **transversal T1** | — |
| CON-L2-01 | Evidence boundary / claim bounding | III (owner) → IV, V | — | — | **A — progressive deepening** | III establishes the boundary concept; IV applies it to the API boundary; V applies it to automation boundaries. No Part redefines it | `PASS` | — |
| CON-L2-02 | Automation as evidence mechanism, not proof | III ch07 (owner) → V (owner of the system view) | — | — | **A — progressive deepening** | III bounds what an automated check establishes; V extends to the automation *system* as a product. Ownership is cleanly split and stated | `PASS` | — |
| CON-L2-03 | Atlas Commerce organisational identity | III, IV, V — **no single owner** | — | — | **AMBIGUITY** (L15) | Three descriptors, one per Part, each internally consistent, none reconciled. **A recurring case with three identities is a candidate for the plan's "two owners" caution** | `FAIL` | **FE-L2-003** |
| CON-L2-04 | Full concept census across Parts I–XII | — | — | — | — | — | `NOT CHECKED` — **transversal T1** | — |

---

## 5. QA → QE Progression Matrix

**Level 9 · Transversal T4.** **Census — 19 capability dimensions × 12 Parts = 228 cells.**

Per cell: **level** (`Not addressed` / `Introduced` / `Developed` / `Applied` / `Integrated`), **evidence** (chapter plus quotation), **prerequisite**.

**Derived analyses, all required:** prerequisite trace · monotonicity · abandonment · difficulty gradient · circularity · **QA/QE dichotomy audit**.

**Batch-local L1 evidence only. The 19-dimension × 12-Part census is transversal T4 and has not run; 0 of 19 dimensions are traced across all twelve Parts.**

| Row ID | Observation | Evidence | Status | Finding ID |
| --- | --- | --- | --- | --- |
| PRG-L1-01 | Part I establishes the QA→QE shift explicitly rather than assuming it | ch02 is dedicated to the evolution and states it is **not** a replacement sequence (first review question, ch02); ch08 defines the role by responsibilities rather than title | `PASS` | — |
| PRG-L1-02 | Part II builds engineering capability rather than teaching syntax for its own sake | Every chapter frames code as a quality instrument — ch01 *programming as a QE practice*; ch11 *testing the utility itself*; ch12 capstone produces a portfolio toolkit. Scope boundaries are stated (ch06: *"does not attempt an event-loop internals course, distributed-systems design, SRE practice, or an API-automation framework"*) | `PASS` | — |
| PRG-L1-03 | Prerequisite integrity across the I→II boundary | Part II README declares TypeScript as primary implementation language and states its own prerequisites; no Part II chapter was found to depend on a capability that neither Part I nor an earlier Part II chapter introduces | `PASS` | — |
| PRG-L1-04 | Exercise progression (Level 16) | Census: **197 review questions, 173 interview questions, 22/22 practical exercises**. Declared sample — first review question of each of the 22 chapters, stratified by chapter, deterministic, reproducible: **22/22 pass the copy-adjacent-prose test** (each requires a reason, distinction or judgement, not restatement) and **22/22 pass the untaught-capability test** | `PASS` | — |
| PRG-L1-05 | 19-dimension progression matrix | — | `NOT CHECKED` — **transversal T4**; L16 completion also requires T4 | — |
| PRG-L2-01 | The II→III→IV→V progression is stated and honoured | Part III README opens by positioning itself against Parts I and II and states it *"does not restart testing education from zero"*. Part IV positions itself on Part III's evidence reasoning; Part V ch02 states *"Part II established the foundations for readable, modular, testable, diagnostic code. Part III established…"*. Chapter-level Prerequisites metadata in all 34 chapters names specific prior chapters and Parts | `PASS` | — |
| PRG-L2-02 | No unexplained capability jump found at the batch boundaries | Each Part's chapter-1 prerequisites resolve to material already delivered: III ch01 requires Parts I–II; IV ch01 requires *"quality evidence, typed data, asynchronous behaviour, and service testing"* (Parts I–III); V ch01 requires *"programming, test strategy, evidence, APIs, and asynchronous behaviour"* (Parts I–IV) | `PASS` | — |
| PRG-L2-03 | Scope collisions / duplicated ownership | **None found.** Ownership is explicitly partitioned and signposted: III ch09 owns service/API **testing strategy** while IV owns **API quality engineering**; III ch07 owns automated-check reliability while V owns the automation **system**; V ch09 explicitly defers to *"Part III Chapter 10 on regression strategy"* in its own prerequisites | `PASS` | — |
| PRG-L2-04 | Exercise progression (Level 16), batch-local | Census: **292 review questions, 183 interview questions, 34/34 practical exercises**. Declared sample — first review question of each of the 34 chapters, stratified by chapter, deterministic, reproducible: **34/34 pass the copy-adjacent-prose test** and **34/34 pass the untaught-capability test**. Questions demand distinctions (*"Why is a test condition different from a test case?"*, *"What can a `202 Accepted` response establish, and what does it leave unknown?"*) rather than restatement | `PASS` | — |
| PRG-L2-05 | 19-dimension progression matrix | — | `NOT CHECKED` — **transversal T4** | — |

---

## 6. Cross-Part Dependency Matrix

**Levels 3, 10, 15, 19 · Transversals T4, T5.** Records every declared cross-Part handoff, deferral and dependency, and whether it was **delivered**.

> Plan §4 Level 3: **independently re-derive; never accept the README's self-description.** An **undelivered declared handoff** is a named defect class.

**Level 15 (Atlas continuity) classification — scope Parts III–XII:** **`EVOLUTION`** (signposted) · **`CONTEXTUAL VARIATION`** (different lens, no conflict) · **`AMBIGUITY`** (under-specified — record, do not force) · **`CONTRADICTION`** (facts cannot both hold).

**Level 19 (technical contradiction) classification:** **`CONTRADICTION`** — statements cannot both be true **under the same stated conditions** · **`CONTEXT-DEPENDENT TRADE-OFF`** — they hold under **different stated conditions**.

> **Operational test:** is the differentiating condition **stated in the text**? Stated is a legitimate trade-off. **Unstated is a contradiction in effect even if reconcilable in principle** — the defect is the missing condition, and the correction is usually to state it, not to delete one side.

**Batch-local L1 evidence only. Edition-wide pairwise contradiction analysis (L19) and Atlas continuity (L15) are transversal T5 and have not run.**

| Row ID | Type | Scope | Delivered / classification | Evidence | Status | Finding ID |
| --- | --- | --- | --- | --- | --- | --- |
| DEP-L1-01 | Part I declared assets | Part I README | **Delivered** | All declared assets exist: Lab 1, 3 case studies, 8 worksheets/workshop, diagram library. **27/27 local links in the README resolve.** Re-derived from the filesystem, not accepted from the README's self-description (plan L3) | `PASS` | — |
| DEP-L1-02 | Part I declared exclusion | Part I README *Supporting Code* | **Honoured** | *"Supporting code intentionally deferred to later technical parts."* No code directory exists for Part I; `code/` contains only `part-02-programming` | `PASS` | — |
| DEP-L1-03 | Part II declared companions | Part II README Delivery Plan, Deliveries 1–5 | **Delivered and executable** | Five companion projects present. **Executable verification: `tsc --noEmit` exit 0 on all five; `node --test` 13/13 pass (delivery-04) and 26/26 pass (capstone) = 39/39; deterministic validation suites pass for deliveries 02 and 03; delivery-01 runs and emits its documented report shape.** Run on Node v18.20.8 | `PASS` | — |
| DEP-L1-04 | Part II declared release state | Part II README lines 115, 123 | **NOT honoured** | README states the v0.5.0 tag and GitHub Release *"remain pending"*; tag `v0.5.0` exists at `f71d284`, dated 2026-08-09 | `FAIL` | **FE-L1-001** |
| DEP-L1-05 | Part I README chapter-list labelling | Part I README | **Divergent** | Heading *"## Planned Chapters"* lists ten delivered chapters; README records no review event or gate | `FAIL` | **FE-L1-007** |
| DEP-L1-06 | L19 technical-contradiction pass within L1 | Parts I–II | **No contradiction found** | Recurring subjects compared pairwise within the batch — ISO/IEC 25010 characteristic set and count; capability-vs-characteristic boundary; policy-vs-mechanism; `null`/`undefined`. Each pair holds under the same stated conditions. Edition-wide comparison is T5 | `PASS` | — |
| DEP-L1-07 | Atlas recurring-case continuity | — | — | `NOT APPLICABLE` — plan §4 L15 scopes Atlas to **Parts III–XII**; **Parts I–II are legitimately outside the case and their absence is not a continuity failure** | `NOT APPLICABLE` | — |
| DEP-L2-01 | Part III–V declared companion assets | Parts III, IV, V | **Honoured** | Each Part directory contains **only `chapters/`** — no labs, code, diagrams, case studies or worksheets — and `code/` contains only `part-02-programming`. All three READMEs state this accurately: III *"all Part III companion assets remain out of scope"*; IV *"No Part IV laboratories, diagrams, case studies, companion code… have been created"*; V *"Companion implementation, Lab 1, Lab 2, diagrams, case studies, CI configuration… remain deferred"*. **Deferred assets clearly labelled deferred are not defects** | `PASS` | — |
| DEP-L2-02 | Part README navigation | Parts III, IV, V | **Resolves** | Part III README: **15/15 local links resolve**. Parts IV and V READMEs contain no local links to break | `PASS` | — |
| DEP-L2-03 | Part III–V declared release state | Parts III, IV, V | **NOT honoured** | Eight false current-state statements; tags `v0.6.0`/`v0.7.0`/`v0.8.0` all exist (2026-08-10) | `FAIL` | **FE-L2-001** |
| DEP-L2-04 | Atlas continuity (L15), batch-local | Parts III–V | **AMBIGUITY** | Descriptor differs by Part — III *"subscription service"*, IV *"retailer"*, V *"online retailer"* — each internally 100% consistent, none reconciled. Persona continuity partial: Priya/Marcus in III; **Dele spans IV and V**; Ravi in V | `FAIL` | **FE-L2-003** |
| DEP-L2-05 | L19 technical-contradiction pass within L2 | Parts III–V | **No contradiction found** | Recurring normative subjects compared pairwise within the batch — test-level vs evidence-boundary framing, automation determinism, oracle definition, escaped-defect definition, API idempotency. Every pair holds under the same stated conditions, and where framings differ the differentiating condition **is stated in the text** | `PASS` | — |
| DEP-L2-06 | Edition-wide Atlas and contradiction analysis | — | — | — | `NOT CHECKED` — **transversal T5** | — |

---

## 7. Coverage Control Matrix

**Plan §5.4.** Not a seventh ledger — this is the **coverage exit control**, maintained throughout Phase F. Sections 1–6 above are the six ledgers required by plan §13.2 and are complete as specified.

> **137/137 chapter coverage on both axes is mandatory.**

**A cell counts as complete only when it records all six fields:**

| Field | Content |
| --- | --- |
| **Inspection status** | inspected / not-inspected / blocked |
| **Method** | e.g. recomputation, citation verification, standards cross-check, claim sampling, structural scan |
| **Object / population** | what was inspected and its size |
| **Evidence or reference** | recomputed value, verification level, claim inspected, or **ledger row ID** |
| **Result** | defect found / no defect found |
| **Finding ID** | where a defect was found |

> **The purpose is auditability, not paperwork volume.** A ledger row ID is sufficient where a ledger row exists. Quotation is required only where no other artefact captures the inspection.

**Axis coverage summary at F0:**

| L2-01 | III | 1 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 3,935 words, 4 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 4 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-02 | III | 2 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 3,811 words, 4 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 4 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-03 | III | 3 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,211 words, 6 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 6 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-04 | III | 4 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,413 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | defect found | FE-L2-002 |
| L2-05 | III | 5 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,149 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-06 | III | 6 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,714 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-07 | III | 7 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,608 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-08 | III | 8 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,965 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-09 | III | 9 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,119 words, 4 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 4 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-10 | III | 10 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 3,851 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-11 | III | 11 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 3,098 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-12 | III | 12 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 6,867 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 5 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | defect found | FE-L2-004 FE-L2-005 |
| L2-13 | IV | 1 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,480 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 5 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-14 | IV | 2 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,977 words, 7 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 7 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-15 | IV | 3 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,331 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-16 | IV | 4 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,115 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-17 | IV | 5 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,697 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-18 | IV | 6 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,320 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 5 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-19 | IV | 7 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,954 words, 4 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 4 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-20 | IV | 8 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,900 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 5 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-21 | IV | 9 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,965 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 5 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-22 | IV | 10 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 6,072 words, 8 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 8 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-23 | V | 1 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,998 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-24 | V | 2 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,772 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 2 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-25 | V | 3 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 6,373 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 2 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-26 | V | 4 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 6,496 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-27 | V | 5 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 6,435 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 5 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-28 | V | 6 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,741 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 2 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-29 | V | 7 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,864 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-30 | V | 8 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 6,317 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 2 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-31 | V | 9 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 4,525 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 3 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-32 | V | 10 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,020 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 2 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-33 | V | 11 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 5,010 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 5 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |
| L2-34 | V | 12 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance + over-inclusive numeric sweep | chapter, 6,645 words, 1 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: header/delimiter cell-count parity; fence parity balanced; local links all resolve; footnote reconciliation 1 defs vs body markers; status `Draft` conforms to plan §2.3; numeric sweep adjudicated against PASS-0 exclusions | no defect found | — |

| Axis | Unit | Complete | Total | Note |
| --- | --- | --- | --- | --- |
| Longitudinal | chapters | **56** | **137** | **L1 22/22 complete** · **L2 34/34 complete** · L3 0/33 · L4 0/24 · L5 0/24 |
| Transversal T1 | chapters | **0** | 137 | |
| Transversal T2 | chapters | **0** | 137 | |
| Transversal T3 | chapters | **0** | 137 | |
| Transversal T4 | chapters | **0** | 137 | Requires L9, L10 **and L16** each inspected |
| Transversal T5 | chapters | **0** | **115** | **Parts III–XII only** — Parts I–II are legitimately outside the Atlas case |
| Transversal T6 | chapters | **0** | 137 | |

**Longitudinal axis: L1 22 / 22 and L2 34 / 34 — cumulative 56 / 137 chapters inspected with valid six-field records.** Transversal axis: 0 / 137 on every transversal.

| Row ID | Part | Ch | Inspection status | Method | Object / population | Evidence | Result | Finding ID |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| L1-01 | I | 1 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 4,940 words, 4 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 4 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-02 | I | 2 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,720 words, 7 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 7 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-03 | I | 3 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,580 words, 8 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 8 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-04 | I | 4 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,948 words, 6 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 6 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-004 FE-L1-002 |
| L1-05 | I | 5 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,864 words, 6 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 6 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-06 | I | 6 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 7,037 words, 9 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 9 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-07 | I | 7 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,733 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 5 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-08 | I | 8 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,072 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 5 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-09 | I | 9 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 7,453 words, 6 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 6 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-10 | I | 10 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 7,574 words, 10 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 10 defs vs body markers; status value `Technical Review Ready` tested against plan §2.3 seven-stage model | defect found | FE-L1-002 |
| L1-11 | II | 1 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 4,693 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-12 | II | 2 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,650 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | defect found | FE-L1-004 |
| L1-13 | II | 3 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,390 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-14 | II | 4 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,614 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-15 | II | 5 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 6,910 words, 10 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 10 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-16 | II | 6 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 3,653 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-17 | II | 7 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 3,211 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-18 | II | 8 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 2,681 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 2 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-19 | II | 9 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 2,774 words, 2 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 2 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | no defect found | — |
| L1-20 | II | 10 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,046 words, 4 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 4 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | defect found | FE-L1-003 |
| L1-21 | II | 11 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 5,517 words, 5 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 5 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | defect found | FE-L1-003 |
| L1-22 | II | 12 | inspected | structural scan v1 + full read + footnote reconciliation + status conformance | chapter, 7,957 words, 3 footnote definitions | heading-order check: 1 H1, 0 jumps; table check: 0 malformed; fence parity: balanced; local links: all resolve; footnote reconciliation: 3 defs vs body markers; status value `Draft` tested against plan §2.3 seven-stage model | defect found | FE-L1-004 |

---

## 8. Level execution routing (plan §5.3)

**Every level and supporting pass has exactly one declared execution route. No level or pass is unassigned.**

| Level | Route | Ledger section |
| --- | --- | --- |
| 1 — Repository and governance integrity | Longitudinal | §7 coverage; governance evidence in findings |
| 2 — Whole-book architecture | Longitudinal | §6 |
| 3 — Part architecture | Longitudinal | §6 |
| 4 — Chapter integrity | Longitudinal | §7 coverage |
| 5 — Cross-Part conceptual consistency | **T1** | §4 |
| 6 — Terminology and standards consistency | **T1** | §3 |
| 7 — Evidence and citation integrity | **T2** | §1 |
| 8 — Numerical and analytical integrity | **T3** | §2 |
| 9 — Pedagogical progression | **T4** | §5 |
| 10 — Professional applicability | **T4** | §6 |
| 11 — Editorial consistency and accessibility | **T6** | §7 coverage |
| 12 — Publication readiness | Gate phase | gate record |
| 13 — Final First Edition Quality Gate | Gate phase | gate record |
| **15 — Atlas continuity** (supporting) | **T5** | §6 |
| **16 — Exercise progression** (supporting) | **T4** | §5 |
| **19 — Technical contradiction** (supporting) | **T5** | §6 |

> **Levels 14, 17 and 18 do not exist and must not be invented.** A supporting pass is not a lesser obligation: each has an execution route, an exit criterion, and the same correctness threshold as a numbered level. **Any coverage structure built for only 13 dimensions is incomplete.**

---

## 9. Accessibility objective checks (plan §10)

Census across all 137 chapters, reported as a **distinct subsection** of the Editorial Consistency Report so accessibility receives a named minimum rather than competing informally for category 7's weight. Executed under **Level 11 / T6**; recorded in §7 above.

| Check | Population | Complete | L1 result (22 chapters) |
| --- | --- | --- | --- |
| Heading-order integrity | 137 | **56** | **PASS** — L1 22/22 and L2 34/34: exactly 1 H1 per chapter, **0 level jumps** across all 56 |
| Table-header presence | 137 | **56** | L1 **PASS** (0 malformed). L2 **1 FAIL** — III ch04 L190 header/delimiter cell-count mismatch (**FE-L2-002**); the other 33 pass |
| Descriptive link text | 137 | **56** | **PASS** — vague-link-text check v1: **0 occurrences** across all 56 |
| Image alt-text presence | 137 | **0** | **NOT APPLICABLE** — the image population is **zero** across both L1 and L2; no `![...]()` occurs in any of the 56 chapters. Recorded as N/A with reason, **not** as PASS |

> **Judgement-dependent accessibility** — contrast, alt-text sufficiency, reading level — **remains out of scope while no authoritative accessibility standard exists.** Plan §9: **Level 11 does not score against absent standards.** The standard's absence is a **Governance Integrity** matter (category 8), dispositioned at Phase E, and is **never an editorial deduction**.

---

**Last Updated:** 2026-08-16 (F-IR1)
