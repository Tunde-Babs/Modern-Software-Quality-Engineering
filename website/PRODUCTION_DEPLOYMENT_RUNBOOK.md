# MSQE production deployment runbook — NOT EXECUTED

Target: `https://msqe.dev`. Identity: MSQE v0.16.0 /
LEARNING-READY — CONTROLLED RC. This runbook is for a later authorized task.
WEB-5D ends before infrastructure mutation; fresh independent WEB-5DV is next.

## PRE-DEPLOYMENT

1. Obtain independent WEB-5DV acceptance of the exact candidate. Record branch,
   reviewed commit, clean worktree/index and live upstream identity. Checkpoint
   and push only under separate authorization; no force-push or release/tag.
2. Run the default and production validations in PRODUCTION_READINESS.md.
   Require original 39 tests plus ten output checks, complete internal-link
   validation with zero broken destinations, and production browser checks.
   Run the unchanged 35 MSQE regressions and baseline 7/7 gate.
3. Record reviewed build census, known-good production deployment ID (if any),
   account/zone identity, current DNS, certificate state, redirect settings and
   the first-launch fallback. Do not assume a previous Pages deployment exists.
4. Obtain authorization for the actual project/Git/domain/DNS/HTTPS/indexing
   operations. Retain unrelated DNS records. Keep indexing disabled initially.

## DEPLOY

1. Create a Cloudflare Pages project using Git integration to the MSQE repository.
   Select `feature/web-5-production-deployment` at the separately checkpointed,
   independently verified candidate. Do not select main/develop or merge them.
2. Choose Astro/static, v3 image, repository root and `website/dist` output.
   Use this exact build command:

   ```sh
   node website/scripts/check-toolchain.mjs && npm --prefix website ci --include=dev && npm --prefix website run build
   ```

3. Set `NODE_VERSION=24.20.0`, `SKIP_DEPENDENCY_INSTALL=1` in both environments.
   Leave `MSQE_INDEXING` unset initially and in every preview. npm must be 11.19.0;
   the script stops before installation if the selected image does not provide
   it. Revalidate any toolchain provisioning change; do not assume `NPM_VERSION`
   controls v3. No website secret or runtime binding is required.
4. Build the authorized commit. Save deployment ID, commit, logs and environment
   scope. Confirm 262 HTML pages, 258 indexed documents and a 260-URL sitemap.
   Disable analytics/script injection and unneeded automatic branch deployment.

## DOMAIN

1. Associate `msqe.dev` through Pages Custom domains; confirm the zone is in the
   same account and uses Cloudflare nameservers. Follow the wizard's actual apex
   DNS target. If a nameserver migration is needed, stop for its separately
   scoped authorization; do not infer permission from this preparation.
2. Provision proxied www DNS and certificate coverage. Configure a Bulk Redirect
   from `www.msqe.dev` to `https://msqe.dev`, 301, preserving query string and path
   suffix with subpath matching; keep nested-subdomain matching off.
3. Redirect the production project.pages.dev alias to the apex using the supported
   Pages Bulk Redirect mechanism. Retain nonindexable branch/hash preview hosts.
   Test both `/` and `/handbook/?q=api`, including HTTP entry points.

## HTTPS

1. Wait for active valid certificates for apex and www. Verify chain and hostname.
2. Enable Always Use HTTPS under the authorized zone task; keep valid TLS and
   check all redirect chains for loops and retained paths/queries.
3. Confirm committed headers on successful pages, assets and missing routes.
   HSTS is apex-only `max-age=86400`, without preload/includeSubDomains. Local
   HTTP tests did not prove HSTS enforcement or certificate configuration.

## INDEXING

1. Confirm canonical URLs, sitemap, host redirects, no injected scripts, and
   successful public-domain QA before changing production indexing.
2. With explicit launch authorization, set `MSQE_INDEXING=production` in the
   production environment only, and rebuild the exact approved commit.
3. Require `index, follow` on 260 public pages; search and 404 stay
   `noindex, nofollow`. Require production robots `Allow: /` and
   `Disallow: /search/`. Verify 260 unique apex sitemap URLs and no conflicting
   `X-Robots-Tag` on indexable apex responses. Previews stay noindex.

## POST-DEPLOYMENT QA

Complete PRODUCTION_ACCEPTANCE_CHECKLIST.md, record actual URLs, response headers,
statuses, browser errors, network inventory and deployment identity. Exercise all
nine search queries and pagination on desktop/mobile; keyboard navigation,
license links, representative chapters/resources, QA Foundations and 404 recovery.
Verify no stale Pagefind index, broken links, mixed content or injected tracking.
Retain the evidence and known-good deployment ID. Live QA cannot be pre-marked PASS.

## ROLLBACK

For an existing known-good production deployment, use Pages → Deployments → All
deployments → the target deployment's actions menu → **Rollback to this deployment**.
Confirm its ID/commit before applying; preview deployments are not rollback targets.
This changes the served deployment without destructive Git history changes.
Pause automatic deployment of the bad candidate under the incident authorization,
then repeat domain, headers, robots, search and navigation checks. Correct the
candidate through a normal reviewed commit; never reset/rewrite shared Git history.

Cloudflare's [rollback procedure](https://developers.cloudflare.com/pages/configuration/rollbacks/)
restores deployment assets, not all independently managed DNS, redirect, TLS or
environment settings. Restore separately changed settings from the recorded
pre-change inventory if needed and authorized. Browser HSTS persists until expiry.

**First launch:** there may be no prior production deployment. Before cutover,
agree and record a fallback (for example, keep the domain unlaunched or serve an
authorized noindex maintenance deployment). If the first build fails before
cutover, leave DNS/domain unchanged. If failure occurs after cutover, execute
that agreed fallback; do not invent a previous deployment or delete the project.
