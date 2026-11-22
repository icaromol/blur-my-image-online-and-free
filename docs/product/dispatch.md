# Dispatch board

The dispatcher's memory between ticks. Only the dispatcher agent edits this file. Lanes, owners and rules are in [team.md](team.md).

Status: **Not started.** Run `claude --agent dispatcher` in a dedicated terminal to start it. It creates its own trigger on the first tick.

## Trigger

| Field | Value |
| --- | --- |
| Heartbeat id | none yet |
| Interval | none yet |
| Created | never |
| Last tick | never |
| Next tick | never |

## Lanes

| Lane | State | Item | Worker id | Started | Files held |
| --- | --- | --- | --- | --- | --- |
| ui | Idle: not started | | | | |
| server | Idle: not started | | | | |
| quality | Idle: not started | | | | |
| marketing | Idle: not started | | | | |
| reviewer | Idle: not started | | | | |

## Shared-file lock

| File | Held by | Since |
| --- | --- | --- |
| (none) | | |

## Waiting on the git owner

| Item | Files | Commit message sent | Committed |
| --- | --- | --- | --- |
| (none) | | | |

## Needs Ícaro

| Item | What's needed | Recommendation | Default if no answer |
| --- | --- | --- | --- |
| (none) | | | |

## Tick log

Newest first, one line per tick that changed something.

- (no ticks yet)
