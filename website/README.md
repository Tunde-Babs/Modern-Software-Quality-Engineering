# MSQE portal — WEB-2

Local-only Astro + TypeScript foundation. Static output is intended for a later
Cloudflare Pages integration; this package does not configure or deploy hosting.
Canonical URL identity is `https://msqe.dev`. The future `www` redirect belongs to
WEB-5. Every page is labelled as a preview and emits `noindex, nofollow`; production
indexing policy requires a later authorized change.

## Run

Use Node >=22.12.0 and npm. Commands below run from the repository root:

```sh
npm --prefix website ci
npm --prefix website run dev
npm --prefix website run check
npm --prefix website run test
npm --prefix website run build
npm --prefix website run verify
npm --prefix website run preview
```

`check` runs Astro diagnostics and TypeScript. `verify` runs those checks, the
Node test suite, a fresh static build, and an HTML/link smoke check. Output is in
`website/dist/`. Reports are generated in ignored `website/artifacts/`:
`link-report.json` and `source-preservation.json`. Astro CLI telemetry is disabled
by the scripts. Script environment syntax targets POSIX shells (including this
macOS environment). No deployment command exists.

Astro 7's development server is managed in the background. To stop it:

```sh
cd website
ASTRO_TELEMETRY_DISABLED=1 npx --no-install astro dev stop
```

## Canonical-source boundary

The only selected source files are:

- `book/part-01-foundations/chapters/chapter-01-what-is-modern-software-quality-engineering.md`
- `diagrams/chapter-01-quality-engineering-model.md`

They are read directly at build time. There are no copied/generated chapter
Markdown files, frontmatter changes, manuscript edits, or governance exports.
The chapter alone exercises tables, lists, blockquotes, emphasis, inline code,
text/Gherkin fences, footnotes, and references. The linked existing diagram adds
a resource relationship, Mermaid source and canonical textual interpretation.

`src/lib/content/registry.ts` discovers canonical chapter filenames across all
Parts without publishing them. The explicit two-entry registry is the publication
allow-list. Chapter routes derive from Part and chapter filenames:
`/handbook/part-NN/chapter-NN-topic/`. Duplicate sources/routes and malformed
chapter routes fail. WEB-3 can select discovered entries after content/link review;
it does not require 137 manually copied chapter files.

`src/lib/content/loader.ts` parses Markdown with remark/GFM. It reads the eight
required metadata fields from the existing table, rejects missing/duplicate fields,
and cross-checks filename/H1/metadata chapter numbers plus the Part number. It
requires one leading H1 and validates heading levels. The metadata table remains
in its original instructional position; the shell also presents a short summary.

## Rendering and link contract

The pipeline is Markdown AST → HTML AST → explicit link validation → HTML
sanitization → trusted accessibility attributes → static HTML. No MDX, raw-HTML
execution, browser Markdown renderer, or remote assets are enabled. Unsafe URL
schemes fail, as do unregistered images, missing source files, directory escapes,
unreviewed internal destinations and unresolved selected-page fragments. HTTP(S)
references stay intact. Source-relative links resolve from the canonical source's
original directory, never from `website/`.

Heading IDs use `section-` plus a deterministic GitHub slug, including collision
suffixes. Source fragments can use their ordinary GitHub heading slug; the adapter
maps them to the namespaced ID. Generated footnote IDs/backlinks and their accessible
label are preserved and validated. Tables gain column header scope and labelled,
keyboard-focusable overflow containers. Code remains selectable, escaped plain
text in labelled keyboard-focusable regions. Syntax highlighting is deferred.

Four link occurrences in Chapter 1 target three existing files outside WEB-2:

- Lab 1 — From Testing a Feature to Engineering Quality (two occurrences)
- Case Study 1 — Quality Beyond Test Execution
- Chapter 2 — The Evolution from QA to Quality Engineering

These exact omissions are enumerated in `deferredSources`, checked for file
existence, rendered with their original label plus “not available in this preview”,
and reported by verification. They have no invented public href. Any new omission
fails until explicitly reviewed. To publish a deferred source in WEB-3, add its
validated registry entry and remove its deferral; then validate its own links.
Previous/next uses full discovery order but links only to published neighbours,
so it never jumps silently across omitted chapters.

## Shell, status and accessibility

Five static routes: home, handbook index, Chapter 1, resources index, and the
Quality System Model. The shell includes landmarks, a skip link, breadcrumb,
current-page/location semantics, and a collapsible labelled TOC. Primary navigation
stays visible and wraps on mobile; unavailable destinations are disabled text.
Native anchors and disclosure controls require no client JavaScript.

Plain CSS uses a small token system, a 72ch reading column, responsive layout,
visible focus, table/code overflow regions, reduced-motion handling, and a restrained
light palette. Dark mode, theme persistence and copy-code controls are deliberately
omitted. No cookies, tracking, analytics, authentication, backend, or learner data
collection is introduced. The build smoke test rejects script, iframe and form tags.

`src/lib/status.ts` holds the founder-authorized WEB-2 v0.16.0 / Learning-Ready
Controlled RC wording independently of historical declaration records. Its optional
provenance is deliberately null until an approved public provenance target exists.
Chapter Draft/source-version metadata remains distinct from portal readiness.
The footer says “Reuse terms are being finalized.” No manuscript license is asserted.

Mermaid is escaped source only, labelled as such before the resource. Its full
canonical textual interpretation remains directly afterward. No graphical diagram
is claimed. Safe build-time diagram rendering is deferred to WEB-3.

The architecture targets WCAG 2.2 AA. Automated structure checks are not a
conformance claim. Live browser/keyboard, screen-reader, 320px reflow, 200% text,
focus visibility and visual review must be completed during independent verification.
No browser was available to this implementation session.

## Verification boundaries

Tests authenticate 275 protected tracked files against base
`10e79997f48c3f84c16487aa2601d89d6b680985` using Git blob hashes, check protected
path/mode differences, and reject nonignored untracked files in protected scopes.
Existing ignored build/dependency files under `code/` are outside the committed
source baseline and were not modified by this work.

The implementation author runs deterministic tests only. These checks do not
constitute independent semantic verification, Learning-Ready approval, or First
Edition approval. Keep the complete package unstaged, uncommitted and unpushed
until fresh independent WEB-2 verification.

## Deferred work

- WEB-3: remaining chapters, 12 Part indexes, expanded resources/asset contracts,
  all internal cross-links, graphical Mermaid rendering and development-time source
  watch/invalidation (restart the dev server after canonical edits).
- WEB-4: Pagefind integration using `data-pagefind-body` and `data-pagefind-ignore`,
  full SEO/sitemap/indexing policy and broader accessibility verification.
- WEB-5: Cloudflare Pages, production headers, www redirect, DNS and deployment.

Framework reference: [Astro configuration](https://docs.astro.build/en/reference/configuration-reference/).
Rendering reference: [remark-rehype](https://github.com/remarkjs/remark-rehype).
