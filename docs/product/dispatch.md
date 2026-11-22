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
| Quiet ticks in a row | 0 |

## Lanes

Workers from the `-ad` session are all dead; nothing below is carried over from it.

| Lane | State | Item | Worker id | Started | Files held |
| --- | --- | --- | --- | --- | --- |
| ui | Idle: nothing eligible. Every v1 UI item is `Review`. BMI-061's size work landed in `e2e0eb6`; the PM still has it `In progress` pending Q-007. Executor `-cc` is on stand-by | | | | |
| server | Idle: nothing eligible. BMI-062 to BMI-065 are `Review`. Executor `-f2` is on stand-by | | | | |
| quality | BMI-051 worker finished after one rework round (reviewer F1 to F5, plus the PM's two added criteria: `hosting.md:43`, `README:30`). Dispatcher verified: `pnpm check` green, diff read. `index.html:6` done by `-cc`. Narrow re-read by the reviewer running; then the git owner | BMI-051 README, `docs/hosting.md`, `index.html` (`In progress`) | a29bb58a286ac3260 (sonnet, done); reviewer a50590f618067f3ba (opus) | tick 1 | `README.md`, `docs/hosting.md` (README on the shared-file lock), `index.html` |
| quality | Working (tick 4): BMI-051 reopened by D-010 (Ícaro's "ajustar tudo", via `-aa` and the PM). Worker edits only `README.md`: line 3 → "Image files you open, drop or paste never leave your device.", line 99 → "at the loaded image's resolution". The ui executor `-cc` takes `index.html:6`, `en.json` and `pt-BR.json` line 4 (taglines); the pt-BR text goes to Ícaro through the PM before merge. Marketing text citing the old tagline waits for the marketing fix round. Earlier in tick 3: BMI-074 finished and verified by the dispatcher against the logs. 10 of 10 runs with `--retries=0` green (35/35, 17 to 23 s), `CI=1` run green with no retry, 6 extra runs with 1 and 20 workers green. **The original failure is still unexplained** (not called flaky, not called resolved); port clash, worker count and ordering were ruled out for this commit. No files changed, nothing to commit. Logs in `.local/bmi-074/` (git-ignored). Port 4173 is free and the e2e quiet request is lifted | | ac7c6075de9b019c8 (done) | | |
| marketing | Tick 6: Ícaro's direct yes (via `-aa`) covered the 3 plan lines; copywriter edited them, reviewer approved the plan. File list sent to `-5b` (plan, then this board). Nothing is eligible after that: SEO and the launch kit stay held for lack of a `Ready` item; Buffer drafts need connected accounts and the three publish blockers. Earlier, tick 5: reviewer approved `audience.md` and the 3 posts of the final round (4 files sent to `-5b`; redaction post unchanged). `docs/marketing/plans/2026-11-pre-launch.md` has 3 stale lines D-010 created (question 4, action 5 heading, one sentence after it) and stays uncommitted until Ícaro's direct yes (asked through `-aa`); his earlier "sim" covered the 9 lines only. SEO and the launch kit remain held. Earlier: tick 4: unblocked. Ícaro's direct "sim" (given to `-aa`, relayed) authorizes one last small round on the 9 stale lines; copywriter running, then the reviewer re-reads, then a new commit via `-5b`. Same round swaps the provisional privacy sentence in `audience.md` for the D-010 wording; pt-BR is not quoted until Ícaro confirms it. Earlier note, kept for context: blocked after the second review (rework round used): reviewer second pass approved `audience.md`, the redaction post and the Safari post (sent to `-5b` for a new commit), but the plan, the operation-list post and the EXIF post still say "planning" or "no build yet" in 9 places. They're stale wording that appeared when BMI-051 landed, not new false product claims. Under "Needs Ícaro": a last small fix round. The "roughly 20 px" figure still can't be checked (the agent couldn't read popets-2016-0047; this machine has no PDF text tool; a PDF copy is in the session's tool-results folder). SEO and the launch kit stay held | Fix rounds | ab950d5e312ecf881 and a9542a0219b098834 (done); reviewer ae5c2d7d8b655ddee (done) | tick 2 | `docs/marketing/plans/2026-11-pre-launch.md`, `marketing/social/posts/2026-11-26-*`, `2026-11-28-*` until committed |
| reviewer | Working | Pre-launch plan, `audience.md` and the 4 posts, already committed in `d8baa89` and `5987c2a` | ae5c2d7d8b655ddee (opus, read-only) | tick 1 | none |

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
| Marketing plan (3 lines + earlier fixes) | `docs/marketing/plans/2026-11-pre-launch.md` | tick 6: `docs(marketing): drop the open tagline question and the stale status from the pre-launch plan` | pending; reviewer approved |
| `docs/product/dispatch.md` | this file | after this rewrite is stable | `0de1b97` (the board has been edited since; the next commit is asked when a tick leaves it stable) |
| BMI-051 | `README.md`, `docs/hosting.md`, `index.html` | tick 2: `docs: sync the README and hosting guide with the shipped code` | `5117278` (pushed); PM told |

## Needs Ícaro

| Item | What's needed | Recommendation | Default if no answer |
| --- | --- | --- | --- |
| BMI-050 (go public) | Remaining: BMI-051 (README), merge of PR #1, his go. The `CLAUDE.md` / `.claude/` question is settled (D-008) and the conduct contact is set (D-007) | Merge PR #1 once review is done | Repo stays private |
| Marketing blocked: stale wording | Second review found 9 stale lines: plan line 3 ("README still says planning"); EXIF post lines 15, 25, 51 ("nothing to test today", "once there's a build"); operation-list post lines 13, 39, 57 ("the plan is that it never edits the source", "an app that doesn't exist yet", "intensity is in source pixels"); optional redaction post line 27 wording | One more small fix round by the copywriter on those lines, re-read by the reviewer, then commit | Files stay uncommitted; nothing is queued either way |
| Publish blockers on the posts | (a) Mastodon: channels.md decision 4 (AI-disclosure rule) before any Mastodon version is queued. (b) The "roughly 20 px" figure in the blur-is-not-redaction post: someone must read popets-2016-0047 (sections 4 to 6) and say whether it holds and whether "recognizable" means people or software; a search snippet suggests it may be wrong. (c) The Safari `toBlob('image/webp')` check in a real Safari and the caniuse figure | Ícaro reads the paper and tests Safari before any post is queued | Posts stay drafts; nothing is queued |
| Privacy wording | The provisional sentence "Images you open, drop or paste never leave your device." (README:3, `index.html:6`) is ambiguous: pasting a link or loading a URL goes through `/api/image`. Smallest fix: "Image files you open, drop or paste never leave your device." The in-app tagline `en.json:4` ("It never leaves your device") has the same gap. Part of the open en / pt-BR tagline question | Use "Image files…" in README, `index.html` and the English tagline | The provisional sentence stays |
| Marketing | Launch date, domain, final English tagline (en and pt-BR differ since `bbb060c`), the 5 account decisions in `docs/marketing/channels.md`, create accounts and connect Buffer, Buffer timezone | Index from BMI-003; `*.vercel.app` until a domain exists | Work continues on the plan's recommendations; OG image and Buffer drafts wait |
| Q-006 | Server-bundle license notices | Recommendation is in `decisions.md` | Default in force: nothing added |
| BMI-070 | GitHub settings: labels, squash-only merges, delete branch on merge, saved replies | Do them when convenient; they don't block code | Stays `In progress` |

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
