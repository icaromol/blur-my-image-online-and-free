# Dispatch board

The dispatcher's memory between ticks. Only the dispatcher agent edits this file. Lanes, owners and rules are in [team.md](team.md).

Status: **Running** in session `blur-my-image-online-and-free-75` (took over from `-ad` on 2026-11-22, handoff by `-aa`). The trigger is session-only: if this session ends, the loop ends. This session was not started with `claude --agent dispatcher`; it follows the same definition.

## Trigger

| Field | Value |
| --- | --- |
| Heartbeat id | `3eef7853` (CronCreate, recurring) |
| Interval | 30 min (`17,47 * * * *`); auto-expires after 30 days |
| Created | 2026-11-22 15:1x, tick 1 of this session (the `-ad` heartbeat `89127110` died with its session) |
| Last tick | 2026-11-22 (tick 1, this session) |
| Next tick | 2026-11-22 15:21, or earlier on a worker result or a message |
| Quiet ticks in a row | 1 (tick 11: nothing to assign; BMI-073 is `Ready` but its worker part waits on BMI-003, which is `In progress`, and the rest is Ícaro's; no worker running; every peer idle except `-aa`) |

## Lanes

Workers from the `-ad` session are all dead; nothing below is carried over from it.

| Lane | State | Item | Worker id | Started | Files held |
| --- | --- | --- | --- | --- | --- |
| ui | Frozen until the rewrite is done. Queued for right after: small BMI-003 item for `-cc`: change `og:url` and `og:image` in `index.html` to the new main domain (the old alias redirects, preview crawlers prefer the final URL); no other change; check, tests, size green; commit via `-5b`; push only after the rewrite. The new domain stays out of the README and marketing until Ícaro says. Executor `-cc` on stand-by | BMI-003 (OG URLs) | | | `index.html` |
| server | Frozen until the rewrite is done. Queued for right after: BMI-073 (3) the comment at `server/proxy/config.ts:8` says the 4.5 MB limit "counts headers", which the docs don't say; fix the comment only, no behavior change. Executor `-f2` has one more queued item, not blocking the flip: prove that the rate limit fires (a burst of more than 30 requests in 60 s against our own `/api/image`, with a request the proxy already rejects); it generates traffic against the live service, so it waits for `-aa`'s direct yes and the end of the freeze. Otherwise `-f2` is on stand-by (Q-010 actions need a direct yes, not a relay through the dispatcher) | BMI-073 (3) | | | `server/proxy/config.ts` |
| quality | Frozen until `-5b` says the history rewrite (Q-009) is done. BMI-073 first part done and reviewed (commit requested before the rewrite). Queued for right after: BMI-073 (1) `hosting.md` "below 4.5 MB" wording, (2) README sentence: "a 413 when the declared size is over the cap, and an aborted stream when an undeclared body passes it". The WAF rule is now published and active (read back by `-f2`, via `-aa`), so the rate-limit claim can be checked after the freeze: the text may say only "an active rule of 30 requests per 60 s per IP", since that the deny fires is not proven; the usage-alert claim still waits | BMI-073 (rest) | | | `README.md`, `docs/hosting.md` |
| marketing | Idle (tick 9): OG and GitHub social preview image done, verified by the dispatcher (check, byte-identical re-render, no external requests) and approved by the reviewer after one rework round; files go to `-5b`. Repo description and topics: committed (`50db392`), applying them waits for `-aa`'s OK to `-5b`. Posts remain drafts; publish blockers stand (PETS 20 px, Safari, Mastodon decision 4). SEO and launch kit have no `Ready` item. Open for the PM: `brand.css` still `@import`s Google Fonts, so `tip.html` renders hit the network | | a079d9a6d72f8217f (designer, done) | | |
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
| BMI-060 | `tsconfig.server.json`, `server/proxy/*` | sent earlier | `5642e7b` |
| Marketing plan, `audience.md`, 4 posts | `docs/marketing/plans/`, `docs/marketing/audience.md`, `marketing/social/posts/` | committed by `-5b` on `-aa`'s order before the review | `d8baa89`, `5987c2a` (pushed). Reviewer verdict pending; fixes go in a new commit, no rewrite |
| `audience.md`, redaction post, Safari post | the three files the reviewer approved after the correction round | tick 2: `docs(marketing): correct the privacy, network and test claims in the audience file and two posts` | `aa397c5` (pushed, on top of `d8baa89` and `5987c2a`) |
| BMI-051 (D-010 wording) | `README.md`, `index.html`, `src/i18n/messages/en.json`, `src/i18n/messages/pt-BR.json` | tick 4: `docs: say image files never leave the device in the README, meta description and taglines` | `758fc6b` (pushed); verified (check, 229 tests, e2e 35/35), reviewer approved, PM told. The pt-BR tagline must be read by Ícaro before the PR #1 merge (optional reviewer wording: "Seus arquivos de imagem") |
| Marketing final round | `audience.md`, `2026-11-26-operation-list.md`, `2026-11-28-canvas-export-drops-exif.md`, `2026-11-30-safari-webp-silent-png.md` | tick 5: `docs(marketing): align the drafts with the built pre-release and the final privacy wording` | `cb39247` (pushed); reviewer approved; PM told. The plan file waits for Ícaro's yes on 3 lines |
| Marketing plan (3 lines + earlier fixes) | `docs/marketing/plans/2026-11-pre-launch.md` | tick 6: `docs(marketing): drop the open tagline question and the stale status from the pre-launch plan` | `ad82c2e` (pushed); reviewer approved; PM told so it can close BMI-051's marketing criterion |
| `docs/product/dispatch.md` | this file | after this rewrite is stable | `0de1b97` (the board has been edited since; the next commit is asked when a tick leaves it stable) |
| BMI-051 | `README.md`, `docs/hosting.md`, `index.html` | tick 2: `docs: sync the README and hosting guide with the shipped code` | `5117278` (pushed); PM told |


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
| Marketing | Launch date, domain, final English tagline (en and pt-BR differ since `bbb060c`), the 5 account decisions in `docs/marketing/channels.md`, create accounts and connect Buffer, Buffer timezone | Index from BMI-003; `*.vercel.app` until a domain exists | Work continues on the plan's recommendations; OG image and Buffer drafts wait |
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

- 2026-11-22 tick 3 (session `-75`): BMI-074 finished and verified: 10 of 10 runs green with `--retries=0`, `CI=1` run green, cause of the original failure still unexplained; e2e quiet request lifted. Quality lane idle.
- 2026-11-22 tick 2 (session `-75`): BMI-051 committed (`5117278`) after one rework round and a reviewer re-read; PM moved it to `Review`. Reviewer read the marketing files, one rework round, three files approved and committed (`aa397c5`), three still stale in wording and blocked (second review). BMI-074 started and finished the same tick window.
- 2026-11-22 tick 1 (session `-75`): took over from `-ad`. Heartbeat `3eef7853` created. Marketing files were already committed (`d8baa89`, `5987c2a`), so the reviewer reads the committed versions. BMI-051 assigned to quality (README lock taken). `-cc` and `-f2` on stand-by.
- Earlier ticks 1 to 7 belonged to the `-ad` session. They covered BMI-060 (done, `5642e7b`), BMI-052 (audit done, findings groomed into BMI-051 and Q-006), the marketing plan and the `audience.md` corrections.
