# Dispatch board

The dispatcher's memory between ticks. Only the dispatcher agent edits this file. Lanes, owners and rules are in [team.md](team.md).

Status: **Running** in session `blur-my-image-online-and-free-75` (took over from `-ad` on 2026-11-22, handoff by `-aa`). The trigger is session-only: if this session ends, the loop ends. This session was not started with `claude --agent dispatcher`; it follows the same definition.

## Trigger

| Field | Value |
| --- | --- |
| Heartbeat id | `3eef7853` (CronCreate, recurring) |
| Interval | 30 min (`17,47 * * * *`); auto-expires after 30 days |
| Created | 2026-11-22 15:1x, tick 1 of this session (the `-ad` heartbeat `89127110` died with its session) |
| Last tick | 2026-11-22 (tick 37, this session) |
| Next tick | on a worker result or a message; otherwise the next heartbeat |
| Quiet ticks in a row | 0 (tick 37: BMI-088, BMI-086 and BMI-084 delivered and committed locally; waiting on `-aa` for the push) |

## Lanes

Workers from the `-ad` session are all dead; nothing below is carried over from it.

| Lane | State | Item | Worker id | Started | Files held |
| --- | --- | --- | --- | --- | --- |
| ui | Idle (tick 37). BMI-088 delivered and read by the opus reviewer: the redaction warning shows with every effect (`effects.warning`, one key, pt-BR approved by Ícaro), plus the D-034 a11y add-on (`aria-describedby="effects-warning"` on the effects radiogroup only, one test of the link). Committed locally as `c00002d`. Gates re-run by me on the tree at `ec54b1f`: `pnpm check` clean, 307 tests, build, e2e 50/50, size 43.8 of 45 kB initial and 192.96 of 195 kB total (thin headroom). Not mine yet: BMI-078 (brand kit on the site), only after the PR #2 merge and the kit's own PR; BMI-087 (`url.ts`, `url.test.ts`, `download_interrupted`) stays uncommitted until after the PR #2 merge. Executor `-cc` on stand-by | | | | |
| server | Idle (tick 31). BMI-077 server tests committed (`9828aa7`). The rate-limit burst proof (BMI-003) waits for `-aa`'s direct yes. Executor `-f2` on stand-by | | | | |
| quality | Idle (tick 37). BMI-086 (study wording, intensity advice, README) committed locally as `a3f312f`; README line 78 (http:// links always use the proxy, proxy "doesn't keep a copy of the image") committed as `ec54b1f`. BMI-077 SPDX swap committed earlier (`42fc557`). Queued: BMI-076 scorecard and dependency-review workflows, only after the PR #2 merge (scorecard also waits on Q-012) | | | | |
| marketing | Idle (tick 37). BMI-084 drafts and research delivered and committed locally as `2b1492d` (`docs/marketing/landing/`: home, three use-case pages, structured data, claims check, research, SEO). Draft only, on hold for Q-024 (use pages); nothing published; the app URL stays out of the text (markers `[EDITOR-URL]`, `[HOME-URL]`). Rule added to `claims-check.md`: never write "keeps nothing", "logs nothing" or "stores nothing" about the proxy; say only that it doesn't keep a copy of the image. Another critique (`.local/landing-improvements.md`) is with `-aa` for Ícaro and is NOT applied. Brand kit (BMI-075) is on `feat/brand-kit`, outside PR #2 | | | | |
| reviewer | Idle. Reads the next finished item before `-5b` | | | | |

Marketing queue after the verdict (the plan was approved by Ícaro with "prossiga"): action 1 SEO, action 4 launch kit, then action 2 page copy (after the SEO briefs), action 3 images (designer, after copy), Buffer drafts (only once accounts are connected), action 5 OG image (blocked by the English tagline).

Not assigned to anyone:
- BMI-066 (`In progress`): the only gap left is `pnpm-workspace.yaml`, dated **2026-11-28** (lockfile packages younger than 7 days). Gets assigned on or after that date.
- BMI-070 (`In progress`): what's left is GitHub settings (labels, merge settings, saved replies). That's Ícaro's job, not a lane's.
- BMI-002 and BMI-061: moved to `Review` by the PM (committed on the branch, waiting for the PM's docs commit). Q-007 is closed: D-009 accepts the 45 / 195 kB budgets, as relayed by `-aa` through the PM. PM measured `pnpm size` at 43.21 / 45 kB and 192.22 / 195 kB, and e2e Chromium 35/35 twice; its first run failed undiagnosed, possibly a port 4173 clash with another session's preview, so watch for intermittent e2e.

## Shared-file lock

| File | Held by | Since |
| --- | --- | --- |
| `README.md` | quality lane, BMI-051 | tick 1 |

## Waiting on the git owner (`-5b`)

| Item | Files | Commit message sent | Committed |
| --- | --- | --- | --- |
| BMI-060 | `tsconfig.server.json`, `server/proxy/*` | sent earlier | `f5036ad` |
| Marketing plan, `audience.md`, 4 posts | `docs/marketing/plans/`, `docs/marketing/audience.md`, `marketing/social/posts/` | committed by `-5b` on `-aa`'s order before the review | `b1ee611`, `39f93cf` (pushed). Reviewer verdict pending; fixes go in a new commit, no rewrite |
| `audience.md`, redaction post, Safari post | the three files the reviewer approved after the correction round | tick 2: `docs(marketing): correct the privacy, network and test claims in the audience file and two posts` | `8c7896e` (pushed, on top of `b1ee611` and `39f93cf`) |
| BMI-051 (D-010 wording) | `README.md`, `index.html`, `src/i18n/messages/en.json`, `src/i18n/messages/pt-BR.json` | tick 4: `docs: say image files never leave the device in the README, meta description and taglines` | `ccef665` (pushed); verified (check, 229 tests, e2e 35/35), reviewer approved, PM told. The pt-BR tagline must be read by Ícaro before the PR #1 merge (optional reviewer wording: "Seus arquivos de imagem") |
| Marketing final round | `audience.md`, `2026-11-26-operation-list.md`, `2026-11-28-canvas-export-drops-exif.md`, `2026-11-30-safari-webp-silent-png.md` | tick 5: `docs(marketing): align the drafts with the built pre-release and the final privacy wording` | `7ddf40f` (pushed); reviewer approved; PM told. The plan file waits for Ícaro's yes on 3 lines |
| Marketing plan (3 lines + earlier fixes) | `docs/marketing/plans/2026-11-pre-launch.md` | tick 6: `docs(marketing): drop the open tagline question and the stale status from the pre-launch plan` | `0d37933` (pushed); reviewer approved; PM told so it can close BMI-051's marketing criterion |
| `docs/product/dispatch.md` | this file | after this rewrite is stable | `2f0731b` (the board has been edited since; the next commit is asked when a tick leaves it stable) |
| BMI-051 | `README.md`, `docs/hosting.md`, `index.html` | tick 2: `docs: sync the README and hosting guide with the shipped code` | `04dfa46` (pushed); PM told |
| BMI-088, BMI-086, BMI-084, README:78 | warning in every effect with the aria link; study wording and advice; landing drafts; http:// sentence | tick 37: four commits in order | `c00002d`, `a3f312f`, `2b1492d`, `ec54b1f` (local only, not pushed; the push waits on `-aa`, the 5th CodeRabbit round and the clean-copy check) |


## Decisions in force (relayed by `-aa` from Ícaro's direct answers, tick 12)

- Q-009: the 64 commits are rewritten to the GitHub no-reply address. `-5b` executes with a backup and a verification (same trees before and after, gitleaks clean), then force-pushes with `--force-with-lease`. Hashes cited in the docs change. **The dispatcher assigns nothing new until `-5b` says the rewrite is done**; the BMI-073 worker is committed first.
- Q-010: `-f2` publishes the WAF rule (30 requests per 60 s per IP, deny 1 min) and deletes only the deployment that uploaded the ignored files. The site stays up. The URL stays out of the README and marketing until Ícaro says. Revoking the Protection Bypass for Automation is Ícaro's.
- Rule: nobody runs `vercel deploy` from the working tree; Git sends what is committed.
- Vercel facts read back by `-f2` (tick 14, read-only): the project's Ignored Build Step is `test ! -f package.json` for all branches, so a push of the rewritten `main` (which has no `package.json`) skips the build and doesn't replace the production alias, while feature-branch previews keep building; after the PR #1 merge `main` has a `package.json` and builds production. Untested until a `main` push happens. Main domain is `blurmyimage.vercel.app` (the old alias answers 307); `ALLOWED_ORIGINS` was switched to it and applies from the next deploy; the current production runs on the default. `-5b` has not been told to push: that signal comes from `-aa` after the WAF.
- BMI-050 order: rewrite, PR #1 ready for review, private CodeRabbit review, corrections, merge, flip (only on `-aa`'s go).

## Needs Ícaro

| Item | What's needed | Recommendation | Default if no answer |
| --- | --- | --- | --- |
| BMI-050 (go public) | Remaining: BMI-051 (README), merge of PR #1, his go. The `CLAUDE.md` / `.claude/` question is settled (D-008) and the conduct contact is set (D-007) | Merge PR #1 once review is done | Repo stays private |
| Commit author email (Q-009, open, blocks the flip; the skills question Q-008 is closed by D-014) | All 64 commits carry the same author and committer email (an address on a company domain, not the code-of-conduct contact). It is git metadata and becomes public at the flip. Rewriting history is the only way to change it, and would change the hashes of PR #1 | Ask now; after the flip it can't be undone. Keep it unless Ícaro objects | Nothing is rewritten; the flip waits for `-aa`'s go anyway |
| BMI-003 Vercel (urgent, read-only report by `-f2`, tick 10) | (1) A PRODUCTION deployment already exists, from a feature-branch commit (target=production, aliases `blur-my-image.vercel.app` and a team alias): the app and proxy answer publicly with no login, against D-013. The WAF rate-limit rule is still only staged. Choose: publish the rule now, and/or take the production alias down or roll back until the PR #1 merge, or leave it. (2) The `vercel deploy` from the working tree uploaded 307 files vs 148 tracked, including `.local/`, `.claude/settings.local.json`, `coverage/` and local `dist/`; none answers by URL (404) and no `.env*` went up, but they sit as source of a team-visible deployment. Approve removing that deployment (less urgent: the dispatcher ran gitleaks over those folders, masked, and found no leaks; `settings.local.json` holds only permissions and one MCP server name; the scan doesn't see sensitive text without a credential shape). The PM opened this as Q-010: no Vercel action until Ícaro answers. (3) Revoke the "Protection Bypass for Automation" that `vercel curl` created. (4) Hobby builds a private repo: proven by 6 Git deploys, all READY | (1) publish the WAF rule today; decide the rest knowing the app is public already. (2) remove the uploaded deployment after checking for secrets. (3) revoke it | Nothing is deleted or published; `-f2` is told not to act without a direct yes |
| Publish blockers on the posts | (a) Mastodon: channels.md decision 4 (AI-disclosure rule) before any Mastodon version is queued. (b) The "roughly 20 px" figure in the blur-is-not-redaction post: someone must read popets-2016-0047 (sections 4 to 6) and say whether it holds and whether "recognizable" means people or software; a search snippet suggests it may be wrong. (c) The Safari `toBlob('image/webp')` check in a real Safari and the caniuse figure | Ícaro reads the paper and tests Safari before any post is queued | Posts stay drafts; nothing is queued |
| Privacy wording | The provisional sentence "Images you open, drop or paste never leave your device." (README:3, `index.html:6`) is ambiguous: pasting a link or loading a URL goes through `/api/image`. Smallest fix: "Image files you open, drop or paste never leave your device." The in-app tagline `en.json:4` ("It never leaves your device") has the same gap. Part of the open en / pt-BR tagline question | Use "Image files…" in README, `index.html` and the English tagline | The provisional sentence stays |
| Marketing | Launch date, domain, final English tagline (en and pt-BR differ since `fbf8779`), the 5 account decisions in `docs/marketing/channels.md`, create accounts and connect Buffer, Buffer timezone | Index from BMI-003; `*.vercel.app` until a domain exists | Work continues on the plan's recommendations; OG image and Buffer drafts wait |
| Q-006 | Server-bundle license notices | Recommendation is in `decisions.md` | Default in force: nothing added |
| BMI-070 | Applied and read back by `-5b` (nothing to change): squash-only merges, delete branch on merge, update branch, 12 labels. Open: (a) saved replies (out-of-scope, needs-info, feature PR without issue) are per-user GitHub settings with no API, so you create them in the interface; (b) the squash commit message default is title + PR body, `community.md` asks for the PR title only: the PM says that is already in the package you approved (D-004) and became a BMI-070 criterion, so `-5b` may apply it and read it back; reversible if you object | Do (a) when convenient; say so if you don't want (b) | (a) stays open, doesn't block code; (b) applied by `-5b` |

## Requests to other sessions

| To | Request | Sent | Answer |
| --- | --- | --- | --- |
| `-aa` | Did the plan and `audience.md` pass the reviewer? | tick 1 | No re-approval; treat as unreviewed, review what is committed |
| `-73` (PM) | Item states after the handoff, what is `Ready` | tick 1 | Only BMI-051 was `Ready` (now `In progress`); BMI-061 waits for Q-007; nothing else eligible. BMI-051 gained a criterion on the "never leaves your device" wording (README:3, `index.html:6`). The PM wants the commit id when BMI-051 lands |
| `-cc` | `index.html:6` meta description: same provisional wording as README:3 (the PM's BMI-051 criterion; outside the quality lane's paths) | tick 1 | pending |

## Peer sessions

`-aa` orchestrator, `-5b` git owner, `-73` PM, `-cc` frontend executor (stand-by), `-f2` server executor (stand-by), `-f5` CodeRabbit (waits on Ícaro for BMI-050), `buffer-social-media-setup` (waits on Ícaro's accounts). Old sessions (`ci-main-branch-decisions`, `implementar-v1-editor-pixi`, `pm-docs-status-update`, `-ad`) are locked until 2026-11-26 and get no work from this board.

## Tick log

Newest first, one line per tick that changed something.

- 2026-11-22 tick 40 (session `-75`): shared tree is back on `main` (`081fa59`). `-5b` opened three PRs: #4 `fix/proxied-download-error` (BMI-087; Ícaro reads the new pt-BR string before the merge), #5 `docs/post-merge-status` (the docs/product batch and this board) and #6 `feat/brand-kit` (BMI-075). Open and not ours: Dependabot #3 (Node 26; BMI-091 done, not merged, Q-026 with Ícaro). BMI-089 (Must, quality): the worker reproduced all 15 Firefox failures locally with the lockfile's Firefox 159.0 and no display, three causes: (1) no WebGL in headless Firefox, PixiJS falls back to Canvas2D and skips every filter, so the app exports the image UNBLURRED with no error (a real product bug, privacy); (2) Firefox opens a downloaded WebP in a tab instead of firing a download event; (3) Firefox ignores `clipboardData` in `new ClipboardEvent("paste")`. PM split it: BMI-092 (Must, ui, top priority, PR A: `src/engine/renderer.ts` `preference: ["webgl"]` plus a regression test that fails without the fix) and BMI-089 (PR B: Firefox pref in `playwright.config.ts`, `e2e/input.spec.ts`, `xvfb-run` in `ci.yml`). The worker writes the regression test in the clone (`/tmp/bmi-089/repo`, traces in `.local/bmi-089/`), checks WebP download in a real headed Firefox without the pref, and proves context loss after start; the opus reviewer reads the diff and looks for any other silent-fallback path. `-cc` applies PR A on a branch from `main` once the diff is approved. Order on the tree, one at a time: PR A, then PR B, then BMI-090 and BMI-076 (each its own branch), BMI-082 last.
- 2026-11-22 tick 39 (session `-75`): PR #2 is MERGED (squash `081fa59` on `main`, 23:46Z); Verify, E2E Chromium and the title checks were green. The shared tree is still on `feat/scaffold-and-proxy` with BMI-087 uncommitted (`url.ts`, `url.test.ts`, `download_interrupted` in the two JSON files). Nothing assigned yet: new branches from `main` are `-5b`'s move (shared tree), and the PM has not yet moved the "after the merge" items. Asked `-5b` to sync to `main` and open the BMI-087 branch, and the PM to confirm the states of BMI-076, 082, 084 and 087. Not mine: Dependabot PR #3 (node 26-slim bump).
- 2026-11-22 tick 38 (session `-75`): `-aa` gave the push go to `-5b`. Scope for PR #2 clarified by `-aa` (Ícaro: "fix, push everything, then merge"): `docs/product/*` and this board go in; only BMI-087 (`url.ts`, `url.test.ts`, `download_interrupted` in the two JSON files) stays out, on its own branch after the merge. The README:47 and :58 wording is accepted by Ícaro, no objection pending. The board commit is `c470a5e`. PM applied the states: BMI-088 and BMI-086 in `Review`, BMI-084 drafts committed and waiting on Q-024. Left to do: clean copy, push, 5th CodeRabbit round, merge. Landing critique `.local/landing-improvements.md` stays unapplied until Ícaro answers.
- 2026-11-22 tick 37 (session `-75`): BMI-088 (warning in every effect, plus the D-034 aria link), BMI-086 and BMI-084 approved by the opus reviewer after final re-reads and committed locally by `-5b` (`c00002d`, `a3f312f`, `2b1492d`, `ec54b1f`). The proxy "keeps nothing" claim was corrected in the landing drafts and README:78. I re-ran the gates on the committed tree (check, 307 tests, build, e2e 50/50, size 43.8 and 192.96 kB). No push: `-aa`'s call. Still outside PR #2: BMI-087, `docs/product/*`.
- 2026-11-22 tick 3 (session `-75`): BMI-074 finished and verified: 10 of 10 runs green with `--retries=0`, `CI=1` run green, cause of the original failure still unexplained; e2e quiet request lifted. Quality lane idle.
- 2026-11-22 tick 2 (session `-75`): BMI-051 committed (`04dfa46`) after one rework round and a reviewer re-read; PM moved it to `Review`. Reviewer read the marketing files, one rework round, three files approved and committed (`8c7896e`), three still stale in wording and blocked (second review). BMI-074 started and finished the same tick window.
- 2026-11-22 tick 1 (session `-75`): took over from `-ad`. Heartbeat `3eef7853` created. Marketing files were already committed (`b1ee611`, `39f93cf`), so the reviewer reads the committed versions. BMI-051 assigned to quality (README lock taken). `-cc` and `-f2` on stand-by.
- Earlier ticks 1 to 7 belonged to the `-ad` session. They covered BMI-060 (done, `f5036ad`), BMI-052 (audit done, findings groomed into BMI-051 and Q-006), the marketing plan and the `audience.md` corrections.
