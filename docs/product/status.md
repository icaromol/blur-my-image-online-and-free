# Status

Updated: 2026-11-22

## Milestone: v1

0 of 44 `Must` done · 36 in review · 4 in progress · 0 blocked. Full list in [backlog.md](backlog.md).

## Now

**Iteration goal (2026-11-23 → 2026-11-29):** merge the scaffold and proxy, put CI in place, and make the app bilingual before any new screen is built.

| ID | Item | Owner | Status |
| --- | --- | --- | --- |
| BMI-001, 004, 010, 014, 020, 021, 030 | Scaffold, proxy, Docker, file picker, gaussian, PNG export (branch `feat/scaffold-and-proxy`) | git-owner session | Review |
| BMI-002 | CI + Dependabot | git-owner session | In progress, on hold until `pnpm size` is green |
| BMI-040 | i18n foundation | git-owner session committed `ba6343f` | Review |
| BMI-041 | Locale resolution + switcher | same commit | Review |
| BMI-042 | Translate existing UI (now ~5 components + effect and export labels; re-size to M) | same commit | Review |
| BMI-043 | Errors as codes | same commit | Review |
| BMI-044 | Number formatting + plurals | same commit | Review |

**Committed (`bdcccbe`, PR #1):** drag and drop, paste, URL loading, Pixelate, Motion, brush, eraser, undo/redo, JPG/JPEG/WebP export and large images, with unit and e2e specs. `Review` until PR #1 is merged and the checks are green.

## i18n: committed (`ba6343f`)

BMI-040 to BMI-044 are built over the committed UI (D-003) and verified by PM on 2026-11-22: `vue-tsc` clean, 218 unit tests, build, 26 e2e (including `pt-BR` and language-switch specs). `Review` until PR #1 is merged. New UI text goes into `src/i18n/messages/*.json`, never inline.

Open on this item:
- BMI-044: no file-size string exists in the app yet, so the "4,4 MB" case has nothing to format. Dimensions, angle, intensity and brush size use locale formatting. Revisit when a size is first shown.
- `index.html` keeps a static English meta description (not covered by the spec); matters for Q-001.
- Heads-up: `pnpm check` currently fails on two format errors in another session's files (`security-headers.test.ts`, the coverage block in `vite.config.ts`). None are in i18n files.

## Standards package (D-004)

New epic E7 (BMI-060 to BMI-073): quality bar, proxy hardening, CSP and headers, supply chain, privacy tests, accessibility, community files, releases. Grooming comes after i18n lands, because BMI-061 and BMI-068 touch the same components. Written to `Idea` for now; each item gets acceptance criteria from `.local/standards/*.md` when groomed. The reports are in a git-ignored folder, so the only durable record is the backlog and D-004.

**Dated item:** `pnpm-workspace.yaml` supply-chain settings go in on **2026-11-28** (BMI-066), after the newest locked package turns 7 days old.

## Next

In order, after i18n. Build order, not a scope cut: all of it is v1. Most of the items below already exist on the PR and need review and merge, not building.

1. Merge PR #1 once checks are green; BMI-002 (CI) in parallel
2. BMI-003: deploy
3. BMI-050, BMI-051: audit, README matches what shipped, go public

## Blocked / waiting on Ícaro

Only items that block something. Questions with a default in force are in decisions.md and don't wait.

- **en/pt-BR tagline differ** since `bbb060c`: `pt-BR` says "…ou como quiser. Ela nunca sai do seu navegador.", `en` still says "…or only the parts you paint… your device". The git-owner session is asking Ícaro whether `en` follows. PM doesn't touch `en.json`.
- **Q-003:** a project mailbox for the code of conduct. Blocks BMI-050 only. Recommendation in decisions.md.
- **D-004** was relayed by the git-owner session, not heard directly. Stays in force unless Ícaro objects.

## Log

### 2026-11-22 (E7 landed)

- Git-owner session committed the frontend standards package (`533f624`), Node entry headers (`6bea2a7`) and the layout doc (`120f89b`). BMI-060, 062, 063, 064, 065, 067, 068, 069 → `Review`; BMI-061 `In progress`.
- `pnpm size` is red (43.21 kB against 35 kB initial JS). D-006: Ícaro chose to precompile the i18n messages. BMI-002 waits for it.

### 2026-11-22 (dispatcher)

- Added the `dispatcher` agent (`.claude/agents/dispatcher.md`), the five-lane team (`docs/product/team.md`) and its board (`docs/product/dispatch.md`). Not started and not tested: it spawns workers and sets its own recurring trigger when run with `claude --agent dispatcher`.

### 2026-11-22 (pt-BR reviewed)

- Ícaro corrected two `pt-BR` strings, committed as `bbb060c`. BMI-042's review condition is met; the item stays `Review` until PR #1 merges to `main`.

### 2026-11-22 (answers from Ícaro)

- D-005 (production deploys on every merge to `main`) recorded; Q-004 closed. Q-001, Q-002, Q-003 now carry a recommendation and a default. Q-005: no Vercel project exists yet. New `docs/tooling.md` lists the MCP servers and how we use them.

### 2026-11-22 (i18n committed)

- `ba6343f` committed i18n (23 files). BMI-040 to BMI-044 → `Review`. The git-owner session staged `package.json` and the lockfile with only `vue-i18n`; the `vite.config.ts` defines and the `playwright.config.ts` locale wait for the frontend session's config commit. Pre-commit now checks a snapshot of what's staged (`eb8cef8`).

### 2026-11-22 (i18n done, pending commit)

- BMI-040 to BMI-044 implemented by a Sonnet subagent, reviewed and re-verified by PM (check on i18n files, tests, build, e2e). Not committed yet.
- Git-owner and frontend sessions notified to resume their held work.

### 2026-11-22 (E7 progress)

- Committed by the git-owner session: community files, code of conduct, security policy, issue forms, release-please (`4c15265`); Dependabot, security workflow, license and bundle scripts, `docs/quality.md` (`a61f693`, `48b1f3d`). BMI-072 → `Review`; BMI-060, 066, 070, 071 and BMI-002 → `In progress`, details in the backlog.
- BMI-066: `pnpm-workspace.yaml` dated 2026-11-28.

### 2026-11-22 (standards package)

- Git-owner session relayed the standards package. Logged as D-004; epic E7 added (14 items, `Idea`); BMI-002 and BMI-050 expanded; Q-003 to Q-005 opened.

### 2026-11-22 (i18n kickoff)

- `bdcccbe` committed the editor onto PR #1; `f661044` committed the docs sync. 14 items moved to `Review`.
- D-003: Ícaro agreed to build i18n now over the committed UI. BMI-040 to BMI-044 moved to `In progress`.

### 2026-11-22 (later)

- `0be65bc` landed the status log update on `feat/scaffold-and-proxy`.
- Synced backlog with the working tree: 14 items moved to `In progress`. Nothing marked `Done`: no tests were run by PM and nothing is merged.
- Flagged the i18n ordering risk above.

### 2026-11-22

- PM set up: backlog, status, decisions and the i18n spec in `docs/product/`, PM skill in `.claude/skills/pm/`.
- D-001: i18n with `en` + `pt-BR` enters v1, built before more UI. D-002: vue-i18n.
- Scaffold, proxy, Docker, file picker, gaussian and PNG export exist on `feat/scaffold-and-proxy` → `Review`. Draft PR #1.
- PM docs committed as `0008a01` on `feat/scaffold-and-proxy` (lands on `main` with PR #1).
- BMI-002: the CI draft is being updated with the quality checks another agent is finishing; the git-owner session will report when it's in.
