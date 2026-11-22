# Status

Updated: 2026-11-22

## Milestone: v1

0 of 45 `Must` done · 40 in review · 2 in progress · 0 ready · 0 blocked. Plus BMI-074 (`Should`, `Done`): unexplained e2e failure, still unexplained. Full list in [backlog.md](backlog.md).

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

- **Tagline and privacy wording:** decided, see D-010. The final `pt-BR` text is shown to Ícaro before the merge (BMI-051).
- **BMI-050 (go public)** still needs: BMI-051 (README and docs match what shipped), PR #1 merged, and Ícaro's direct go. Q-003 and the `CLAUDE.md` question are closed (D-007, D-008).
- **D-004, D-006, D-007, D-008, D-009** were relayed by other sessions, not heard directly. They stay in force unless Ícaro objects.

## Log

### 2026-11-22 (new PM session, handoff)

- BMI-051's marketing criterion closed: `cb39247` and `ad82c2e` align the marketing text with D-010. BMI-051 has nothing open except the merge of PR #1. No item is `Ready` for any lane; BMI-066 waits for 2026-11-28.

- Ícaro approved the committed `pt-BR` tagline (D-010, relayed by `-aa`) and authorized the last marketing copy round. The pre-merge read is done. What needs him now: merging PR #1 when he wants, BMI-070 (GitHub settings) and the BMI-050 go. Still on the board for him, with defaults in force: Q-006, BMI-003 (creating the Vercel project) and the BMI-073 checklist.

- BMI-051 → `Review` again (`758fc6b`, D-010 wording in README, `index.html`, `en.json`, `pt-BR.json`). Still open and not blocking `Review`: Ícaro reads the `pt-BR` tagline before the merge (optional reviewer alternative "Seus arquivos de imagem…"), and marketing quotes the final wording.

- D-010 (Ícaro: "ajustar tudo", relayed by `-aa`): README, `index.html` and both taglines say "Image files … never leave your device", consistent with the URL proxy exception. BMI-051 → `In progress` again, with the new criteria; BMI-003's OG image is unblocked. `en.json` and `pt-BR.json` may be edited, through the ui lane.

- BMI-074 → `Done` (verification, nothing to merge): 10 runs with `--retries=0`, one with `CI=1` and 6 with 1 and 20 workers all passed 35/35. The cause of the first failing run stays **unknown**. The `reuseExistingServer` risk went to `Later` as BMI-135. Nobody has to hold off e2e anymore.

- BMI-051 → `Review` (`5117278`, verified by the dispatcher, approved by the reviewer; PM spot-checked the README, hosting and `index.html` lines). BMI-074 is `In progress` in the quality lane; nobody runs e2e or a preview on port 4173 meanwhile. Follow-ups: final privacy wording (Ícaro) and `README.md` line 99 wording.

- BMI-074 added (`Should`, `Ready`, quality lane) at the orchestrator's request: the cause of the first failing local e2e run is unknown, and the item repeats the suite with the trace captured. It is a verification of work in `Review`; Ícaro can veto the addition. `a3840a9` committed the D-009 docs.

- Later the same day: D-009 (Ícaro accepts the 45 / 195 kB budgets, relayed by `-aa`) closed Q-007. BMI-061 → `Review` after PM ran `pnpm size` (43.21 / 192.22 kB) and the Chromium e2e (35/35; the first run failed for an unknown reason, the next two passed). BMI-002 → `Review`: `ci.yml` (`08d2384`), Dependabot (`a61f693`) and a green first PR run; the required-checks ruleset stays a BMI-050 step. Ícaro confirmed through `-aa` that the conduct contact is his own choice, aware it will be public; not asked again.

- The PM session changed after the previous one hit its account limit (back 2026-11-26). Git owner is now `-5b`, dispatcher `-75`, frontend `-cc`, server `-f2`, orchestrator `-aa`. Not verified by PM beyond `ListAgents`.
- D-007 (code of conduct contact set, Q-003 closed) and D-008 (`CLAUDE.md` and `.claude/` stay) logged from Ícaro's direct answers to `-aa`. Both edits to `CODE_OF_CONDUCT.md` and the reverted `.gitignore` are waiting on `-5b`. BMI-050 stays `Idea`; BMI-051, PR #1 and his go remain.
- BMI-060 → `Review` (`5642e7b`). BMI-061 stays `In progress`: `e2e0eb6` raised the budgets to 45 / 195 kB, which loosens its criterion, so the question went to Ícaro (Q-007). BMI-002 still shows `In progress`; its workflow is committed (`08d2384`) and the PR checks Verify and E2E (Chromium) pass, but the PM hasn't been told by the dispatcher or git owner that it's done, so it's unchanged.
- BMI-051 gained the privacy-wording criterion (README line 3, `index.html` meta description) without deciding the tagline. BMI-003 gained a meta-tags criterion at marketing's request. PR #1 is still a draft, mergeable.
- BMI-051 → `In progress` (quality lane, assigned by the new dispatcher `-75`; `README.md` and `docs/hosting.md` have uncommitted changes). `c5b3bce` committed the conduct contact; the `.gitignore` edit no longer shows in `git status`. Nothing is `Ready` now.

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
