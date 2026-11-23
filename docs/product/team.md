# Team and lanes

Who works on what, and the rules that keep them from colliding. Since 2026-11-23 the team runs as agents in Paperclip: the Orquestrador reads this file and hands out work as Paperclip tasks assigned to the agents below. Names are the agents' names in Paperclip; check the company's agent list when they change.

## The five lanes

Each lane has owned paths, and no two lanes write the same file at the same time.

| Lane | Takes work from | Owns (writes) | Agent | Model |
| --- | --- | --- | --- | --- |
| **ui** | Backlog items in E2 (input), E3 (effects, editing), E4 (export), E5 (i18n), plus BMI-061 and BMI-068 | `src/**`, `e2e/` feature specs for the above | Dev UI | sonnet |
| **server** | BMI-062 to BMI-065, BMI-014 follow-ups | `server/**`, `api/**`, `Dockerfile`, `.dockerignore`, `vercel.json`, `security-headers.ts` and its test | Dev Server | sonnet |
| **quality** | BMI-060, BMI-066, BMI-067, BMI-069 and the CI items | Config and tooling (`biome.json`, `tsconfig*.json`, `scripts/`, `.github/workflows/`), cross-cutting e2e (`a11y`, `privacy`, `exif`), `docs/quality.md`, `docs/hosting.md`, `README.md` | Dev Quality | sonnet |
| **marketing** | `docs/marketing/plans/` and `/marketing` requests | `docs/marketing/**`, `marketing/**`, `brand/**` | Estrategista de marketing, Estrategista de canais, SEO, Copywriter, Designer, Lançamento e comunidade, Publicador social, routed as in `.claude/skills/marketing/SKILL.md` | opus for the strategists, Copywriter and Designer; sonnet for the others |
| **reviewer** | Every finished item from the other lanes, before it goes to Git | Nothing (read-only) | Revisor | opus |

Marketing never publishes. The most it produces is Buffer drafts that Ícaro approves, and it follows the privacy and "no open source claim until public" rules in its skill.

## Shared-file lock

These files get written by more than one lane's work. Only one lane may touch each at a time; the dispatcher records the holder on the board and releases it when the item is handed to the git owner.

`package.json`, `pnpm-lock.yaml`, `vite.config.ts`, `playwright.config.ts`, `src/main.ts`, `README.md`

When a lane needs one that another lane holds, its item waits. A lane can still take other eligible work.

## Vercel

Nobody runs `vercel deploy` from the working tree: it uploads git-ignored files (`.local/`, `.claude/settings.local.json`) as the deployment's source. Git sends what is committed, and the Git integration makes the deployments (D-016).

Fork PRs: Git fork protection is on, so a fork PR's build waits for a team member and gets no environment variables first. Authorize a fork PR's deployment only after reading its diff, above all `vercel.json`, `api/`, `server/` and `package.json`: authorizing runs the fork's code in the build with the variables. The same rule goes into `docs/hosting.md` (BMI-073).

## Temporary worktrees

A temporary git worktree gets its own `node_modules` (a clean `pnpm install --frozen-lockfile` in it), never a symlink to the shared one: pnpm rewrites the links of a symlinked `node_modules` to point into the worktree, and removing the worktree then breaks the shared tree (it happened on 2026-11-22, around 18:03 to 18:06, and `-5b` repaired it). Remove the worktree before the next gate run, and check that no link in `node_modules` points outside the repository.

## Not lanes

| Who | Role |
| --- | --- |
| **Orquestrador** (the dispatcher) | Hands out work as Paperclip tasks, verifies results, keeps `dispatch.md`. Never runs git, never cuts scope, never publishes |
| **Git** | The only agent that runs git write commands and acts on GitHub. Receives exact file lists and conventional commit messages with no AI attribution. Also owns CI runs, PRs and the repo settings Ícaro authorizes |
| **PM/PO** | The only writer of `backlog.md`, `status.md`, `decisions.md` and `specs/`. Grooms items, applies statuses from git, takes scope questions to Ícaro |
| **Ícaro** | Scope, priorities that change scope, anything outward-facing (publishing, Vercel and GitHub settings, purchases), the Q-### questions in `decisions.md`, pausing and resuming agents |

Before 2026-11-23 these roles were Claude Code sessions (`-75` the dispatcher, `-5b` the git owner, `-aa` the orchestrator); the older entries in `status.md` and `decisions.md` use those names.

## Handoff protocol

1. Worker reports → the Orquestrador re-runs verification itself.
2. The Revisor reads the diff and returns a verdict.
3. The Orquestrador sends Git: exact file list (flagging any shared file that also carries another lane's changes), suggested conventional-commit message, no AI attribution.
4. The Orquestrador tells the PM/PO; the PM/PO sets the backlog status: `Review` once committed on a branch, `Done` only once merged to `main`.

## Escalation

Blockers, scope questions and anything outward-facing go to Ícaro as a question on the Paperclip task and under "Needs Ícaro" in [dispatch.md](dispatch.md), each with a recommendation and a default that applies if he doesn't answer. Scope is never the default.
