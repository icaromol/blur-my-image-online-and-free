# Status

Updated: 2026-11-22

## Milestone: v1

0 of 48 `Must` done · 42 in review · 4 in progress · 2 ready · 0 blocked. Plus BMI-074 (`Should`, `Done`): unexplained e2e failure, still unexplained. Full list in [backlog.md](backlog.md).

## Now

**Iteration goal (2026-11-23 → 2026-11-29):** merge the scaffold and proxy, put CI in place, and make the app bilingual before any new screen is built.

| ID | Item | Owner | Status |
| --- | --- | --- | --- |
| BMI-001, 004, 010, 014, 020, 021, 030 | Scaffold, proxy, Docker, file picker, gaussian, PNG export (branch `feat/scaffold-and-proxy`) | git-owner session | Review |
| BMI-002 | CI + Dependabot | git-owner session | In progress, on hold until `pnpm size` is green |
| BMI-040 | i18n foundation | git-owner session committed `b010671` | Review |
| BMI-041 | Locale resolution + switcher | same commit | Review |
| BMI-042 | Translate existing UI (now ~5 components + effect and export labels; re-size to M) | same commit | Review |
| BMI-043 | Errors as codes | same commit | Review |
| BMI-044 | Number formatting + plurals | same commit | Review |

**Committed (`43525ae`, PR #2):** drag and drop, paste, URL loading, Pixelate, Motion, brush, eraser, undo/redo, JPG/JPEG/WebP export and large images, with unit and e2e specs. `Review` until PR #2 is merged and the checks are green.

## i18n: committed (`b010671`)

BMI-040 to BMI-044 are built over the committed UI (D-003) and verified by PM on 2026-11-22: `vue-tsc` clean, 218 unit tests, build, 26 e2e (including `pt-BR` and language-switch specs). `Review` until PR #2 is merged. New UI text goes into `src/i18n/messages/*.json`, never inline.

Open on this item:
- BMI-044: no file-size string exists in the app yet, so the "4,4 MB" case has nothing to format. Dimensions, angle, intensity and brush size use locale formatting. Revisit when a size is first shown.
- `index.html` keeps a static English meta description (not covered by the spec); matters for Q-001.
- Heads-up: `pnpm check` currently fails on two format errors in another session's files (`security-headers.test.ts`, the coverage block in `vite.config.ts`). None are in i18n files.

## Standards package (D-004)

New epic E7 (BMI-060 to BMI-073): quality bar, proxy hardening, CSP and headers, supply chain, privacy tests, accessibility, community files, releases. Grooming comes after i18n lands, because BMI-061 and BMI-068 touch the same components. Written to `Idea` for now; each item gets acceptance criteria from `.local/standards/*.md` when groomed. The reports are in a git-ignored folder, so the only durable record is the backlog and D-004.

**Dated item:** `pnpm-workspace.yaml` supply-chain settings go in on **2026-11-28** (BMI-066), after the newest locked package turns 7 days old.

## Next

In order, after i18n. Build order, not a scope cut: all of it is v1. Most of the items below already exist on the PR and need review and merge, not building.

1. BMI-003 (Vercel project, preview deployment) and BMI-070 (GitHub settings) in parallel with the BMI-050 pre-flip checks
2. BMI-050: flip, protections, CodeRabbit app, PR #2 out of draft, corrections (D-013)
3. Merge PR #2 after CodeRabbit's corrections with green checks; the first production deploy follows (D-005)

## Blocked / waiting on Ícaro

Only items that block something. Questions with a default in force are in decisions.md and don't wait.

- **Nothing waits on a question to Ícaro right now.** Tagline and privacy wording, Q-009 and Q-010 are decided (D-010, D-015, D-016); the WAF rule and the bypass revocation are done.
- **D-004 and D-006 to D-019** were relayed by other sessions, not heard directly. They stay in force unless Ícaro objects.

## Log

### 2026-11-22 (new PM session, handoff)

- **BMI-079's gate passed** (run by `-75` on the committed state): `pnpm check` clean, 299 tests, e2e 41/41 with the axe contrast rule evaluated on the notice in both themes (5.93:1 light, 7.14:1 dark), size 43.61 of 45 kB. **BMI-081 is delivered** and with the opus reviewer, not committed: a 429 or a Vercel deny header becomes a "too many requests" error, and a plain 403 without that header stays the generic one so the app never claims it falsely; no change to the proxy. The `pt-BR` text needs Ícaro's eyes before the merge; the quality lane is writing the shared-address and usage-alert sentences in one pass. Size room is down to 1.31 kB.

- **BMI-079 is `Review`:** the notice under the link field is committed as `88a920a` and the README's privacy section cites it (`107808f`). PM confirmed the texts in both languages are Ícaro's exact words, the `aria-describedby` association and the new unit and e2e tests; the gate result (check, tests, e2e, contrast, size) is `-75`'s to report. BMI-081 can start now that the message files are free.

- **BMI-080 is `Review`:** `34f304f` (README and `docs/hosting.md`) says the 30 per 60 s limit exists only on Vercel and that the proxy code and the image have none, and records the 40-GET WAF test. PM confirmed the commit and the sentences. The usage-alert sentence (BMI-073) is not in it and is still the lane's one task.

- Ícaro's answers, relayed by `-aa`: Vercel 2FA is on; usage notifications are on (his word; nobody can read either). **Speed Insights and analytics: he did not confirm them off.** He wants metrics on the hosted site, nothing of it in the open-source code, and may keep the project running with it later. Q-018 asks him how; nothing changes in Vercel or in the code meanwhile (default: everything off). Facts relayed by `-aa`: Hobby is for personal non-commercial use, so any revenue needs Pro or another host (Docker is the tested exit); Web Analytics is cookieless, served from the site's own domain, 50,000 events a month on Hobby and pauses when exceeded. The promise to keep them off is in the README (line 80), `docs/tooling.md`, BMI-003 and `e2e/privacy.spec.ts`; turning any on needs his decision, the README, the CSP and the privacy test updated. BMI-073's remaining task is the quality lane's wording of the usage-alert sentence.

- **BMI-077 is `Review` again:** the locale-race fix is committed as `785982f`, approved by the reviewer and verified by the dispatcher (295 tests, e2e 37/37, size 43.54 of 45 kB and 192.56 of 195 kB). In progress now: BMI-079 (ui, the link notice) and BMI-080 (quality, docs); BMI-081 waits for BMI-079 because both touch the message files.

- **`-f2` read back Ícaro's Vercel work** (read-only): PR comments off, Ignored Build Step as set, WAF rule enabled with no pending changes and its test as `-aa` said (40 GETs, the 31st denied, the block gone about 63 s later), bypass secret gone, fork protection on, Toolbar and Web Analytics off, Hobby plan. **Unverifiable by anyone but him:** usage alerts (the API doesn't show them; Hobby has no Spend Management, a limit that is hit pauses the project with no bill), the account's 2FA, and the Speed Insights toggle. BMI-073 is `Ready` for the lane's one task: reword the usage-alert sentence to what is true.

- **D-028 (Ícaro, relayed by `-aa`): a privacy notice next to the link field**, with his wording in `en` and `pt-BR` (BMI-079, `Must`, ui lane, in PR #2; `Must` goes to 48). CodeRabbit found that the app had no such notice while the public answer on the `pt-BR.json` comment said it did: that answer and PM's reply draft were wrong (PM hadn't checked), `-5b` corrects the answer. Also BMI-080 (docs: the 30 per 60 s limit exists only on Vercel; the WAF test: 40 GETs, the 31st denied, the block lifted by itself) and BMI-081 (how the front reacts when the WAF denies with plain "Forbidden"; shared addresses), both `Should`. Ícaro says he finished BMI-073 and turned off the Vercel comments: `-f2` reads back what it can; BMI-073 waits for that. After BMI-079 and BMI-080 PR #2 needs a fourth CodeRabbit round and `-aa`'s go.

- **CodeRabbit rounds 2 and 3 finished** (per `-5b`): the third, on `5f671ed`, found one new Minor finding, in `src/i18n/index.ts`: a stale locale load can win over the latest choice (the reviewer had spotted the same race and it wasn't tracked). A correction inside the README's scope, added to BMI-077, which is `In progress` again for it (ui lane, tests, no lock files, size budget still to pass). Everything else is answered or fixed.

- Incident, repaired (`-5b`, around 18:03 to 18:06): running `pnpm check` in temporary worktrees whose `node_modules` was a symlink made pnpm re-point the shared `node_modules` at the worktrees; removing them broke biome and other modules for a few minutes, and the pre-commit hook failed meanwhile. `-5b` repaired it with a forced frozen install and removed only the broken links: 0 broken links, none pointing to `/tmp`, `pnpm check` clean, 293 tests passing; `package.json` and the lockfile were not touched. Rule added to `team.md`: temporary worktrees get their own `node_modules`, never a symlink to the shared one. A lane that saw a biome or module-not-found failure in that window can rerun.

- **BMI-075 (brand kit) is `Review`:** the original lettering, vectorized, is committed as `abc7410` on the local branch `feat/brand-kit` (28 files in the kit, about 109 KB), approved by the reviewer in two rounds; it is not on the shared feature branch and not pushed. Its PR comes after the merge of PR #2; applying it to the site is BMI-078. PM checked the commit and files, not the logos' renders.

- **BMI-077 is `Review` again, complete:** server `9828aa7`, quality `745c2fa` then `42fc557` (the SPDX parser swap), ui `b3ca37f` and `0209c48` (the 100 MiB cap), all local on the feature branch, verified and approved by the reviewer. PM confirmed the commits and the cap constant in `src/input/url.ts`. Next: `-aa` gives the push; `-5b` posts the last two PR replies; CodeRabbit's second round; then the merge with green checks. The brand kit (BMI-075, SVGs being redone) and its site application (BMI-078) are separate PRs after that merge.

- BMI-077's two new deliveries are approved by the opus reviewer (per `-75`): the SPDX parser swap (D-026; production allowlist unchanged, tested) and the direct-fetch size cap of **100 MiB** (104,857,600 bytes; PM wrote "100 MB" earlier, the number was always this one). Commits are requested from `-5b`. Reviewer's product note, recorded as the `Later` idea BMI-137: on phones the real ceiling is decoding memory, not the cap, so a very large compressed file can end in `decode_failed`, and a body just under the cap is held whole in a Blob. A lower, device-aware cap or a clearer message is Ícaro's to decide, later. The designer (BMI-075) works in `/tmp/brand-work`, outside the shared tree.

- D-027 (Ícaro, relayed by `-aa`) closes Q-016: the wordmark is his original lettering, vectorized with a mature tool (potrace or equivalent) and compared with the original at small sizes; the two-tone blue (`#0d62b8` on light, `#7cc4ff` on dark) and the icons are accepted. BMI-075 is `In progress` again to redo the SVGs; applying the brand to the site is the new BMI-078, a PR of its own after the merge of PR #2; the kit is its own PR (`feat/brand-kit`). The app's color theme stays for later.

- `-5b` moved the brand kit to the local branch `feat/brand-kit` (`2a8d07a`) and pushed the feature branch without it (fast-forward); the 11 local commits changed hash and the ones cited in these docs were corrected from his map. CodeRabbit reviewed 91 of 140 files (under its limit of 100); a second round is running. The PR reply draft stays with `-5b`, to post only on `-aa`'s order.

- Ícaro's answers, relayed by `-aa`: D-025 (release-please: close and reopen the first release PR by hand, no new secret; the direct fetch gets a timeout **and a size cap**, 100 MiB set by PM with the reason in BMI-077, error `too_large`; the tagline stays as approved) and D-026 (CC-BY-3.0 accepted for development tools only, so the prepared SPDX parser swap goes in with the dev-only rule explicit). Q-015 and Q-017 closed. BMI-077 is `In progress` again for the cap and the parser swap. Q-016 (brand kit) goes to him after he sees the kit in `.local/brand-preview/`.

- Per `-aa`, from Ícaro: D-024, the Vercel pull-request comments are turned off (he flips the dashboard toggle; `-5b` deletes the comment on PR #2). CodeRabbit's review came out line by line, so the open-source plan covers it. **The brand kit (`2a8d07a`, 29 files) stays out of PR #2** and gets a PR of its own after the merge, so that PR #2 stays under CodeRabbit's limit. For the PR comments: `-5b` posts, with text PM drafts into a file in `.local/`, answers only where we refuse or explain (the three of Q-015 and the `app.ts` finding); the rest are resolved by the commits. The draft waits for Ícaro's answer on Q-015.

- **BMI-077 is `Review`:** all nine corrections are committed and approved by the opus reviewer: quality `745c2fa` (the hand-written license evaluator while Q-017 is open), server `9828aa7`, ui `b3ca37f` (gate: check, 280 tests, e2e 36/36, size). The three findings that need Ícaro are Q-015. BMI-073 is `Blocked` on Ícaro's own actions (Vercel 2FA, usage alerts). Watch item: 1.5 kB left under the initial JavaScript budget (43.48 of 45 kB) and 2.5 kB under the total (192.5 of 195 kB). Open: someone answers each CodeRabbit comment on PR #2 (`-aa` names who), then the push and the merge.

- BMI-077, the license-check fix: the maintained SPDX parser PM chose pulls in a CC-BY-3.0 data package that the development allowlist doesn't allow. New Q-017 for Ícaro (recommendation: allow CC-BY-3.0 for development tools only; default meanwhile: keep the hand-written evaluator, no policy change).

- **CodeRabbit finished PR #2:** 12 findings (2 Major, 8 Minor, 3 Trivial counting two outside the diff; per `-5b`, and PM read the inline comments). Tracked as BMI-077 (`Must`, `Ready`; the `Must` count goes to 47): nine corrections for the ui, server and quality lanes, among them the two Major ones (the license check ignoring parentheses; a stale image load replacing the current one). Three need Ícaro (Q-015): a token for release-please PRs (credential), a size cap on the direct fetch, and the tagline wording (his wording from D-010). BMI-075 (brand kit, `2a8d07a`) is `Review`; its three design choices are Q-016.

- CodeRabbit is now reviewing PR #2 ("Review in progress", per `-5b`): the `.coderabbit.yaml` of `57e170d` filters out `docs/`, `marketing/`, `.claude/`, markdown and `public/`, so the file count fits the free plan. D-023 closes Q-013. Findings that change scope go to Ícaro; the rest are corrections on the branch; the merge only after them and with green checks.

- CodeRabbit's skip was the free plan's 100-file limit, not a private-repo one. `-aa`, `-f5` and `-5b` are trying path filters (option A of Q-013) first. The maintainer rule for fork PRs is in `team.md` and goes into `docs/hosting.md` (BMI-073). New Q-014: the Vercel bot's public comment on PR #2 carries the project ID and team slug; recommendation: turn off the Vercel PR comments and delete the existing one, both with Ícaro's go.

- Vercel Git fork protection is on (read-only check by `-f2`, not tested with a real fork PR): a fork PR's build waits for a team member and gets no environment variables first; the three proxy variables exist only in production and preview, as sensitive. A maintainer rule goes into `docs/hosting.md` (BMI-073): read the diff, above all `vercel.json`, `api/`, `server/` and `package.json`, before authorizing a fork PR's deployment.

- **CodeRabbit skipped PR #2 for size** (per `-5b`: 134 files against the free plan's limit of 100; PM counts 136 between `main` and the branch, about 100 of them app code and about 35 not). Ícaro's condition was a merge only after CodeRabbit's corrections, so Q-013 asks him how the PR gets its review: path filters, a split into smaller PRs, accepting no review, or a paid plan. Default: PR #2 stays a draft and unmerged.

- **Repo public, app live, no announcement.** Ícaro confirmed the flip directly in `-5b`'s session; `-aa` checked it without a login. Ruleset `main` is active with no bypass and requires Verify, E2E (Chromium) and the Conventional Commits title; private vulnerability reporting, secret scanning and push protection are on; fork PR approval covers all external contributors. The app answers at `https://blurmyimage.vercel.app` (a feature-branch build; the URL is not in the README or any marketing text). PR #2 stays a draft until `-aa` says; CodeRabbit reviews it as a draft (`drafts: true` in the `.coderabbit.yaml` that goes through PR #2). BMI-076 (scorecard and dependency-review workflows, a split of BMI-050's list, after the merge) is new: `Must` goes from 45 to 46; CodeQL also waits for the merge; Vercel fork protection is `-f2`'s read-only check.

- **The repository is public** (by `-5b`; PM read `visibility: PUBLIC`, the description, 11 topics, the active ruleset on `main` and secret scanning plus push protection as enabled). Per `-5b`: vulnerability reporting on, fork PR approval for all external contributors; CodeQL not possible yet (`main` has no code); no scorecard or dependency-review workflow exists. `main` now takes changes only through PRs. Remaining on BMI-050: `.coderabbit.yaml`, PR #2 out of draft with a CodeRabbit review, corrections, merge, then CodeQL, the two workflows (Q-012 for scorecard), Vercel fork protection, good first issues and the first release. Residual: pre-rewrite SHAs fetchable (accepted), local backup tags and the hash map hold the old address on disk only.

- D-022 (Ícaro, relayed by `-aa`): the two logos are his and may be published under MIT; Q-011 closed. BMI-075 may start from the shape of his symbol and from his wordmark; a free-font redraw is optional. The record says only "created by Ícaro".

- D-021 (Ícaro, relayed by `-aa`): he accepts that the pre-rewrite commits stay reachable by full hash until GitHub's garbage collection (no Support request, no new repo); his two GitHub e-mail toggles ("Keep my email addresses private", "Block command line pushes that expose my email") are on (a screenshot sent to `-aa`; PM hasn't seen it); BMI-075 and E8 are confirmed as described. Q-011 was answered the next hour: D-022.

- D-020 (Ícaro's request, relayed by `-aa`): a visual identity, minimalist, black and white with blue as the accent. New epic E8 and BMI-075 (`Should`, `Ready`, marketing lane with the designer): vector logos, a minimal palette, favicon, OG base, marketing CSS and a guide; the app theme is a later ui item. Q-011 asks where the two logos come from (a decision for him; the raw PNGs are never committed and the wordmark is redrawn in an OFL font meanwhile).

- PR #2 (draft, `feat/scaffold-and-proxy` to `main`, same head `32c4e77`, title and body of #1 plus "Replaces #1") replaces PR #1, which stays closed with a comment pointing to it. Per `-aa`: the merge only after CodeRabbit's corrections and with green checks, and the PR stays in draft until `-aa` says. "PR #1" in the entries below, written before this, means this PR.

- **History rewrite done and verified** (`-5b` ran it, `-aa` verified: only the no-reply address on the remote, 87 commits, trees identical to the backup, `main` pushed with the Ignored Build Step skipping the build, alias intact). Hashes in `docs/product/` corrected from the map. **PR #1 was closed by GitHub during the push** and can't be reopened; a new PR replaces it, and "PR #1" in these docs means the PR for `feat/scaffold-and-proxy` until the new number exists. `-aa` gave `-5b` the go to flip after `gitleaks` at the new HEAD, the new PR and the description and topics (applied). PM checked that `refs/pull/1/head` points at the new head and that no remote ref holds an old hash; old commits may stay reachable by hash until GitHub's garbage collection, a low residual risk.

- Read back by `-f2` (per `-aa`): the WAF rate-limit rule is published and active (30 requests per 60 s per IP, deny for 1 minute, 0 pending changes); the bypass secret is gone from the project's API (Ícaro revoked it); `ALLOWED_ORIGINS` lists the new domain from the next deploy. The 13 test requests never reached the limit, so that it fires is not proven (new optional check on BMI-003). Preconditions of `-aa`'s go for the flip: the WAF is done; only the verified rewrite is left.

- Per `-aa`: the push of the rewritten `main` is released to `-5b` (D-019 executed); the WAF rule blocks only the flip, not the `main` push. `-f2` checks after the push that Vercel skipped the build. The new domain stays in the product docs as is (Ícaro's side, via `-aa`).

- Per `-aa`: `-f2` read back the Ignored Build Step and it matches (D-019 done); `-5b` may now push the rewritten `main`. `ALLOWED_ORIGINS` is to list the new domain (`-f2`, BMI-003). Still open on BMI-003: the WAF rule published and the bypass secret revoked, both Ícaro's, and the `og:url` / `og:image` domain swap (ui lane).

- Per `-aa`, from Ícaro: the Ignored Build Step is saved in the dashboard (D-019 executed, `-f2` still reads it back), and the project's main domain is now `https://blurmyimage.vercel.app` (PM read 200; the old `blur-my-image.vercel.app` answers 307 to it). The URL stays out of the README and marketing until he says. `index.html` still has the old domain in `og:url` and `og:image`: added to BMI-003 for the ui lane; `-f2` also checks `ALLOWED_ORIGINS` against the new domain. Buffer: Ícaro connected X, a LinkedIn page and a LinkedIn profile, not the three channels of `docs/marketing/channels.md`; `-aa` is guiding the choice and nothing is recorded as in use until he confirms.

- D-019 not executed: `-f2`'s environment denied the Ignored Build Step change, so it is Ícaro's to set in the dashboard. The value reads `None`; production is not protected until he does, and `-5b` holds the push of `main`. Needs Ícaro now: the Ignored Build Step and the WAF rule publish, both in the Vercel dashboard.

- D-019 (relayed by `-aa`): `-f2` sets the Vercel Ignored Build Step to `test ! -f package.json` before `-5b` pushes the rewritten `main`; without it the push would deploy the repository root statically, taking the site down and serving `/CLAUDE.md` and `/docs/*.md` by URL. `-5b` waits for `-f2`'s read-back; Ícaro sets it in the dashboard if `-f2`'s environment blocks it.

- BMI-050: `-aa`'s go for the flip now waits on two things, the rewrite verified and the WAF rule published and read back as active by `-f2`. The rule is still staged; it needs Ícaro to publish it or to allow the permission for `-f2`. No new decision from him is needed.

- **Correction to D-016:** the WAF rule is decided but **not published**. `-f2`'s environment denied `vercel firewall publish` (the CLI gate doesn't take a relayed authorization) and `-f2` didn't work around it, so the rule is staged and `/api/image` has no rate limit. Ícaro publishes it in the dashboard or allows the permission. The deployment with the uploaded files is removed (404). Open on BMI-003 and BMI-073 as a pre-merge item.

- D-018 (relayed by `-aa`): the fallback Ícaro accepted in advance took effect. `-f5` confirmed CodeRabbit's Free plan on a private repo only summarizes; the open-source plan reviews line by line. Final order: rewrite, flip (only with `-aa`'s explicit go after `-5b`'s report), protections, `.coderabbit.yaml`, PR #1 ready with `@coderabbitai review`, corrections, merge. D-017's order is superseded. The public `main` carries the old README from the flip until the merge.

- Ícaro's answers, relayed by `-aa`: D-015 (rewrite the history to his GitHub no-reply address before the flip; `-5b` executes and gives the hash map), D-016 (Q-010: publish the WAF rule and keep the site up; remove the deployment with the uploaded ignored files; he revokes the bypass secret; the URL stays out of the README and marketing until he says) and D-017 (new order: rewrite, PR #1 out of draft, private CodeRabbit review, corrections, merge, then flip with `-aa`'s go). Q-009 and Q-010 closed. BMI-050 rewritten for the new order. `team.md` records that nobody runs `vercel deploy` from the working tree. New asks to the executors: settle the Vercel effect of pushing a rewritten `main` (5 commits, no app) and set the repo `user.email` before any new commit.

- BMI-003's OG tags part is done: `0f0a8ed` (nine tags and `public/og-image.png`, approved by the reviewer, committed locally, not pushed). Left on BMI-003: the Q-010 items, the WAF rule, the bypass secret and the link unfurl check after a production deploy.

- **Q-010 opened (cause found: the first Git deployment of the project was promoted to production by the Vercel Git integration; `-f2` ran no `--prod`):** the production alias already serves a feature-branch deployment (per `-f2`, since 16:06; PM got 200 with the app and its CSP), the WAF rate-limit rule is still unpublished, and `-f2`'s local `vercel deploy` uploaded git-ignored files to Vercel. Hobby building from a private repo is proven (all 6 PR deployments `READY`). No Vercel action and no marketing post about the URL until Ícaro answers.

- BMI-003's OG tags part is `Ready` for `-cc`: the OG image is approved by the reviewer and verified by the dispatcher. New `Later` item BMI-136 (the marketing brand CSS imports Google Fonts at render time; the app is not affected).

- BMI-003: `d5e4a4d` committed the `vercel.json` preset. The commit status of `229349c` shows Vercel "Deployment has completed", which suggests Hobby builds from the private repo; `-f2` confirms. A `CodeRabbit` status ("Review skipped: draft pull request") also already appears on the PR, so the CodeRabbit app may already be installed on the private repo; `-f5` confirms what it covers, because D-013's order assumed it needs the repo public.

- BMI-003 (`-f2`'s report, not re-checked by PM): Vercel project confirmed and linked to the repo, env vars set, Toolbar and Web Analytics off, preview deployment checked (app, headers, CSP, proxy behavior). Waiting on Ícaro: publish the staged WAF rate-limit rule, revoke the "Protection Bypass for Automation" secret that `vercel curl` created, and the first Git deployment to prove that Hobby builds from a private repo. Production URL for Q-005 was `https://blur-my-image.vercel.app` (since replaced as the main domain by `https://blurmyimage.vercel.app`); it goes into the README and settings at go-live. BMI-003 is `In progress` until these are done and `vercel.json` is committed.

- Pre-flip scan (dispatcher, read-only): gitleaks over all branches, 64 commits, clean; license and dist checks pass; no AI trailer in the history. One finding: every commit carries the maintainer's own address as author and committer, which becomes public at the flip. Opened as Q-009 (keep, or rewrite the history first; the address isn't written in the docs). The flip waits for the answer. Repo description and topics are drafted and with the reviewer; the OG image is still in production.

- D-014 (Ícaro: "posso publicar" the three skills, relayed by `-aa`) closed Q-008; the origin stays undocumented and nothing leaves the history. BMI-073 split by when each part matters: only the merge of PR #1 (first production deploy) needs it, not the flip, so BMI-050's dependency changed; BMI-073 is `Ready`. Squash message set to the PR title by `-5b` (`2839348`).

- BMI-070 (D-011): `-5b` read the GitHub settings back and found squash-only, delete branch on merge, update branch and the labels already applied. One setting from the approved community package was still off: the default squash message (PR body instead of the PR title); added to BMI-070 and handed to `-5b`. Saved replies stay Ícaro's.

- Ícaro's go-ahead, relayed by `-aa`: D-011 (apply the BMI-070 GitHub settings, `-5b`), D-012 (BMI-003 `Ready`, `-f2` creates and deploys the Vercel project) and D-013 (go public is a yes, with CodeRabbit on PR #1 before the merge: pre-flip checks, flip, protections, CodeRabbit app, PR out of draft, corrections, merge). BMI-050 → `In progress` with the new order. The flip waits for `-aa`'s go to `-5b` and for Q-008 (origin and license of three skills under `.claude/`, in the history since the initial commit). Merging PR #1 starts the first production deploy once BMI-003 is done (D-005).

- BMI-051's marketing criterion closed: `7ddf40f` and `0d37933` align the marketing text with D-010. BMI-051 has nothing open except the merge of PR #1. No item is `Ready` for any lane; BMI-066 waits for 2026-11-28.

- Ícaro approved the committed `pt-BR` tagline (D-010, relayed by `-aa`) and authorized the last marketing copy round. The pre-merge read is done. What needs him now: merging PR #1 when he wants, BMI-070 (GitHub settings) and the BMI-050 go. Still on the board for him, with defaults in force: Q-006, BMI-003 (creating the Vercel project) and the BMI-073 checklist.

- BMI-051 → `Review` again (`ccef665`, D-010 wording in README, `index.html`, `en.json`, `pt-BR.json`). Still open and not blocking `Review`: Ícaro reads the `pt-BR` tagline before the merge (optional reviewer alternative "Seus arquivos de imagem…"), and marketing quotes the final wording.

- D-010 (Ícaro: "ajustar tudo", relayed by `-aa`): README, `index.html` and both taglines say "Image files … never leave your device", consistent with the URL proxy exception. BMI-051 → `In progress` again, with the new criteria; BMI-003's OG image is unblocked. `en.json` and `pt-BR.json` may be edited, through the ui lane.

- BMI-074 → `Done` (verification, nothing to merge): 10 runs with `--retries=0`, one with `CI=1` and 6 with 1 and 20 workers all passed 35/35. The cause of the first failing run stays **unknown**. The `reuseExistingServer` risk went to `Later` as BMI-135. Nobody has to hold off e2e anymore.

- BMI-051 → `Review` (`04dfa46`, verified by the dispatcher, approved by the reviewer; PM spot-checked the README, hosting and `index.html` lines). BMI-074 is `In progress` in the quality lane; nobody runs e2e or a preview on port 4173 meanwhile. Follow-ups: final privacy wording (Ícaro) and `README.md` line 99 wording.

- BMI-074 added (`Should`, `Ready`, quality lane) at the orchestrator's request: the cause of the first failing local e2e run is unknown, and the item repeats the suite with the trace captured. It is a verification of work in `Review`; Ícaro can veto the addition. `5d55a72` committed the D-009 docs.

- Later the same day: D-009 (Ícaro accepts the 45 / 195 kB budgets, relayed by `-aa`) closed Q-007. BMI-061 → `Review` after PM ran `pnpm size` (43.21 / 192.22 kB) and the Chromium e2e (35/35; the first run failed for an unknown reason, the next two passed). BMI-002 → `Review`: `ci.yml` (`9279a65`), Dependabot (`1efaf03`) and a green first PR run; the required-checks ruleset stays a BMI-050 step. Ícaro confirmed through `-aa` that the conduct contact is his own choice, aware it will be public; not asked again.

- The PM session changed after the previous one hit its account limit (back 2026-11-26). Git owner is now `-5b`, dispatcher `-75`, frontend `-cc`, server `-f2`, orchestrator `-aa`. Not verified by PM beyond `ListAgents`.
- D-007 (code of conduct contact set, Q-003 closed) and D-008 (`CLAUDE.md` and `.claude/` stay) logged from Ícaro's direct answers to `-aa`. Both edits to `CODE_OF_CONDUCT.md` and the reverted `.gitignore` are waiting on `-5b`. BMI-050 stays `Idea`; BMI-051, PR #1 and his go remain.
- BMI-060 → `Review` (`f5036ad`). BMI-061 stays `In progress`: `9025852` raised the budgets to 45 / 195 kB, which loosens its criterion, so the question went to Ícaro (Q-007). BMI-002 still shows `In progress`; its workflow is committed (`9279a65`) and the PR checks Verify and E2E (Chromium) pass, but the PM hasn't been told by the dispatcher or git owner that it's done, so it's unchanged.
- BMI-051 gained the privacy-wording criterion (README line 3, `index.html` meta description) without deciding the tagline. BMI-003 gained a meta-tags criterion at marketing's request. PR #1 is still a draft, mergeable.
- BMI-051 → `In progress` (quality lane, assigned by the new dispatcher `-75`; `README.md` and `docs/hosting.md` have uncommitted changes). `d6f67e1` committed the conduct contact; the `.gitignore` edit no longer shows in `git status`. Nothing is `Ready` now.

### 2026-11-22 (pre-flip audit)

- BMI-052 finished (read-only). PM re-ran gitleaks (38 commits, no leaks) and spot-checked the README lines. Record in `docs/product/audits/2026-11-22-pre-flip.md`; BMI-052 is `Review`, not `Done`, because that record merges with PR #1. Its license criterion was reworded to the shipped client.
- Findings A, B, D, E became criteria on BMI-051 (now `Ready`, quality lane, also owns `docs/hosting.md`). Platform-only claims went to BMI-073. GIF/AVIF/BMP e2e is BMI-134 (Later). Finding C is Q-006, default: nothing added to v1.
- Dispatcher also reports (not verified by PM): Ícaro approved the marketing plan, the `audience.md` corrections are done and in review, SEO, post copy and the launch kit are being worked.

### 2026-11-22 (BMI-052 unblocked)

- BMI-052's dependency on BMI-070 dropped (the remaining GitHub settings don't affect a read-only audit); it depends on BMI-072 only, which is `Review`. Dispatcher reports BMI-060 finished, re-verified and reviewed with no findings, awaiting the git owner's commit id; stays `In progress` until then.

### 2026-11-22 (dispatcher started, groomed on its request)

- Dispatcher reports it started (session `blur-my-image-online-and-free-ad`): heartbeat every 30 minutes, lives as long as its session, and BMI-060 is assigned to the quality lane. Not verified by PM.
- E7 re-checked against the code. BMI-060 back to `In progress` (server tsconfig flags exist in the working tree, not committed). BMI-061 stays with the frontend session (size budget, D-006). New `BMI-052` (read-only pre-flip audit run, split from BMI-050) is `Ready`. The `ui` and `server` lanes have nothing eligible: every v1 feature is committed and in `Review`, and what remains is merging PR #1, CI, the Vercel project and the go-public steps.

### 2026-11-22 (PM agent)

- Added the `pm` agent (`.claude/agents/pm.md`) to run beside the dispatcher: the PM is the only writer of `backlog.md`, `status.md`, `decisions.md` and `specs/`; the dispatcher writes `dispatch.md` only and reports item states to the PM by message. `dispatcher.md`, `team.md` and the `/pm` skill updated to match.

### 2026-11-22 (E7 landed)

- Git-owner session committed the frontend standards package (`6039522`), Node entry headers (`a49e2ac`) and the layout doc (`f1cca03`). BMI-060, 062, 063, 064, 065, 067, 068, 069 → `Review`; BMI-061 `In progress`.
- `pnpm size` is red (43.21 kB against 35 kB initial JS). D-006: Ícaro chose to precompile the i18n messages. BMI-002 waits for it.

### 2026-11-22 (dispatcher)

- Added the `dispatcher` agent (`.claude/agents/dispatcher.md`), the five-lane team (`docs/product/team.md`) and its board (`docs/product/dispatch.md`). Not started and not tested: it spawns workers and sets its own recurring trigger when run with `claude --agent dispatcher`.

### 2026-11-22 (pt-BR reviewed)

- Ícaro corrected two `pt-BR` strings, committed as `fbf8779`. BMI-042's review condition is met; the item stays `Review` until PR #1 merges to `main`.

### 2026-11-22 (answers from Ícaro)

- D-005 (production deploys on every merge to `main`) recorded; Q-004 closed. Q-001, Q-002, Q-003 now carry a recommendation and a default. Q-005: no Vercel project exists yet. New `docs/tooling.md` lists the MCP servers and how we use them.

### 2026-11-22 (i18n committed)

- `b010671` committed i18n (23 files). BMI-040 to BMI-044 → `Review`. The git-owner session staged `package.json` and the lockfile with only `vue-i18n`; the `vite.config.ts` defines and the `playwright.config.ts` locale wait for the frontend session's config commit. Pre-commit now checks a snapshot of what's staged (`6244efd`).

### 2026-11-22 (i18n done, pending commit)

- BMI-040 to BMI-044 implemented by a Sonnet subagent, reviewed and re-verified by PM (check on i18n files, tests, build, e2e). Not committed yet.
- Git-owner and frontend sessions notified to resume their held work.

### 2026-11-22 (E7 progress)

- Committed by the git-owner session: community files, code of conduct, security policy, issue forms, release-please (`83b5515`); Dependabot, security workflow, license and bundle scripts, `docs/quality.md` (`1efaf03`, `6217fc6`). BMI-072 → `Review`; BMI-060, 066, 070, 071 and BMI-002 → `In progress`, details in the backlog.
- BMI-066: `pnpm-workspace.yaml` dated 2026-11-28.

### 2026-11-22 (standards package)

- Git-owner session relayed the standards package. Logged as D-004; epic E7 added (14 items, `Idea`); BMI-002 and BMI-050 expanded; Q-003 to Q-005 opened.

### 2026-11-22 (i18n kickoff)

- `43525ae` committed the editor onto PR #1; `9e857ee` committed the docs sync. 14 items moved to `Review`.
- D-003: Ícaro agreed to build i18n now over the committed UI. BMI-040 to BMI-044 moved to `In progress`.

### 2026-11-22 (later)

- `82bb806` landed the status log update on `feat/scaffold-and-proxy`.
- Synced backlog with the working tree: 14 items moved to `In progress`. Nothing marked `Done`: no tests were run by PM and nothing is merged.
- Flagged the i18n ordering risk above.

### 2026-11-22

- PM set up: backlog, status, decisions and the i18n spec in `docs/product/`, PM skill in `.claude/skills/pm/`.
- D-001: i18n with `en` + `pt-BR` enters v1, built before more UI. D-002: vue-i18n.
- Scaffold, proxy, Docker, file picker, gaussian and PNG export exist on `feat/scaffold-and-proxy` → `Review`. Draft PR #1.
- PM docs committed as `f259261` on `feat/scaffold-and-proxy` (lands on `main` with PR #1).
- BMI-002: the CI draft is being updated with the quality checks another agent is finishing; the git-owner session will report when it's in.
