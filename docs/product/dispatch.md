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
| quality | Working | BMI-051 README and `docs/hosting.md` match what shipped (`Ready`) | a29bb58a286ac3260 (sonnet) | tick 1 | `README.md`, `docs/hosting.md` (README is on the shared-file lock) |
| marketing | Held: waiting for the reviewer verdict on the committed plan, `audience.md` and posts. SEO (`docs/marketing/seo/`) and the launch kit (`docs/marketing/launch/`) don't exist on disk: their workers died, so they must run again once the plan is cleared | | | | |
| reviewer | Working | Pre-launch plan, `audience.md` and the 4 posts, already committed in `d8baa89` and `5987c2a` | ae5c2d7d8b655ddee (opus, read-only) | tick 1 | none |

Marketing queue after the verdict (the plan was approved by Ícaro with "prossiga"): action 1 SEO, action 4 launch kit, then action 2 page copy (after the SEO briefs), action 3 images (designer, after copy), Buffer drafts (only once accounts are connected), action 5 OG image (blocked by the English tagline).

Not assigned to anyone:
- BMI-066 (`In progress`): the only gap left is `pnpm-workspace.yaml`, dated **2026-11-28** (lockfile packages younger than 7 days). Gets assigned on or after that date.
- BMI-070 (`In progress`): what's left is GitHub settings (labels, merge settings, saved replies). That's Ícaro's job, not a lane's.
- BMI-002 (`In progress`): owned by the git-owner session; `ci.yml` is committed and green.
- BMI-061 (`In progress`): the frontend executor's item (D-006), not a lane's.

## Shared-file lock

| File | Held by | Since |
| --- | --- | --- |
| `README.md` | quality lane, BMI-051 | tick 1 |

## Waiting on the git owner (`-5b`)

| Item | Files | Commit message sent | Committed |
| --- | --- | --- | --- |
| BMI-060 | `tsconfig.server.json`, `server/proxy/*` | sent earlier | `5642e7b` |
| Marketing plan, `audience.md`, 4 posts | `docs/marketing/plans/`, `docs/marketing/audience.md`, `marketing/social/posts/` | committed by `-5b` on `-aa`'s order before the review | `d8baa89`, `5987c2a` (pushed). Reviewer verdict pending; fixes go in a new commit, no rewrite |
| `docs/product/dispatch.md` | this file | after this rewrite is stable | pending |

## Needs Ícaro

| Item | What's needed | Recommendation | Default if no answer |
| --- | --- | --- | --- |
| BMI-050 (go public) | Remaining: BMI-051 (README), merge of PR #1, his go. The `CLAUDE.md` / `.claude/` question is settled (D-008) and the conduct contact is set (D-007) | Merge PR #1 once review is done | Repo stays private |
| Marketing | Launch date, domain, final English tagline (en and pt-BR differ since `bbb060c`), the 5 account decisions in `docs/marketing/channels.md`, create accounts and connect Buffer, Buffer timezone | Index from BMI-003; `*.vercel.app` until a domain exists | Work continues on the plan's recommendations; OG image and Buffer drafts wait |
| Q-006, Q-007 | Server-bundle license notices; accept the 45 / 195 kB bundle budgets | Recommendations are in `decisions.md` | Defaults in force: nothing added; budgets stay |
| BMI-070 | GitHub settings: labels, squash-only merges, delete branch on merge, saved replies | Do them when convenient; they don't block code | Stays `In progress` |

## Requests to other sessions

| To | Request | Sent | Answer |
| --- | --- | --- | --- |
| `-aa` | Did the plan and `audience.md` pass the reviewer? | tick 1 | No re-approval; treat as unreviewed, review what is committed |
| `-73` (PM) | Item states after the handoff, what is `Ready` | tick 1 | pending |

## Peer sessions

`-aa` orchestrator, `-5b` git owner, `-73` PM, `-cc` frontend executor (stand-by), `-f2` server executor (stand-by), `-f5` CodeRabbit (waits on Ícaro for BMI-050), `buffer-social-media-setup` (waits on Ícaro's accounts). Old sessions (`ci-main-branch-decisions`, `implementar-v1-editor-pixi`, `pm-docs-status-update`, `-ad`) are locked until 2026-11-26 and get no work from this board.

## Tick log

Newest first, one line per tick that changed something.

- 2026-11-22 tick 1 (session `-75`): took over from `-ad`. Heartbeat `3eef7853` created. Marketing files were already committed (`d8baa89`, `5987c2a`), so the reviewer reads the committed versions. BMI-051 assigned to quality (README lock taken). `-cc` and `-f2` on stand-by.
- Earlier ticks 1 to 7 belonged to the `-ad` session. They covered BMI-060 (done, `5642e7b`), BMI-052 (audit done, findings groomed into BMI-051 and Q-006), the marketing plan and the `audience.md` corrections.
