# Team and lanes

Who works on what, and the rules that keep them from colliding. The [dispatcher agent](../../.claude/agents/dispatcher.md) reads this file every tick. Edit it to change the team: the five lanes below are the PM's default, since none were specified.

## The five lanes

Workers are background subagents the dispatcher spawns. Each lane has owned paths, and no two lanes write the same file at the same time.

| Lane | Takes work from | Owns (writes) | Worker | Model |
| --- | --- | --- | --- | --- |
| **ui** | Backlog items in E2 (input), E3 (effects, editing), E4 (export), E5 (i18n), plus BMI-061 and BMI-068 | `src/**`, `e2e/` feature specs for the above | `general-purpose` | sonnet |
| **server** | BMI-062 to BMI-065, BMI-014 follow-ups | `server/**`, `api/**`, `Dockerfile`, `.dockerignore`, `vercel.json`, `security-headers.ts` and its test | `general-purpose` | sonnet |
| **quality** | BMI-060, BMI-066, BMI-067, BMI-069 | Config and tooling (`biome.json`, `tsconfig*.json`, `scripts/`), cross-cutting e2e (`a11y`, `privacy`, `exif`), `docs/quality.md`, `README.md` | `general-purpose` | sonnet |
| **marketing** | `docs/marketing/plans/` and `/marketing` requests. If no plan exists, the dispatcher asks `marketing-strategist` for one, once | `docs/marketing/**`, `marketing/**` | The marketing agents, routed as in `.claude/skills/marketing/SKILL.md` | sonnet |
| **reviewer** | Every finished item from the other lanes, before it goes to the git owner | Nothing (read-only) | `general-purpose` | opus |

Marketing never publishes. The most it produces is Buffer drafts that Ícaro approves, and it follows the privacy and "no open source claim until public" rules in its skill.

## Shared-file lock

These files get written by more than one lane's work. Only one lane may touch each at a time; the dispatcher records the holder on the board and releases it when the item is handed to the git owner.

`package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `playwright.config.ts`, `src/main.ts`, `README.md`

When a lane needs one that another lane holds, its item waits. A lane can still take other eligible work.

## Not lanes

| Who | Role |
| --- | --- |
| **Git owner**: the interactive session that commits (currently named `ci-main-branch-decisions`; names change, confirm with `ListAgents`) | The only one who runs git. Receives file lists and commit messages. Also owns CI (BMI-002), PR #1 and repo settings |
| **Ícaro** | Scope, priorities that change scope, anything outward-facing (publishing, Vercel and GitHub settings, purchases), the Q-### questions in `decisions.md` |
| **PM** (`claude --agent pm`; name the session `pm` with `/rename` so the dispatcher can message it) | The only writer of `backlog.md`, `status.md`, `decisions.md` and `specs/`. Grooms items, applies the statuses the dispatcher reports, takes scope questions to Ícaro. The dispatcher writes `dispatch.md` only |
| Other interactive sessions (for example the frontend session) | Not controlled by the dispatcher. It may message them with a request and never assumes they act on it |

## Handoff protocol

1. Worker reports → dispatcher re-runs verification itself.
2. Reviewer reads the diff and returns a verdict.
3. Dispatcher sends the git owner: exact file list (flagging any shared file that also carries another lane's changes), suggested conventional-commit message, no AI attribution.
4. Dispatcher tells the PM; the PM sets the backlog status: `Review` once committed on a branch, `Done` only once merged to `main`.

## Escalation

Blockers, scope questions and anything outward-facing go under "Needs Ícaro" in [dispatch.md](dispatch.md), each with a recommendation and a default that applies if he doesn't answer. Scope is never the default.
