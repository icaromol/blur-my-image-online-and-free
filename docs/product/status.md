# Status

Updated: 2026-11-22

## Milestone: v1

0 of 44 `Must` done · 21 in review · 5 in progress (i18n) · 0 blocked. Full list in [backlog.md](backlog.md).

## Now

**Iteration goal (2026-11-23 → 2026-11-29):** merge the scaffold and proxy, put CI in place, and make the app bilingual before any new screen is built.

| ID | Item | Owner | Status |
| --- | --- | --- | --- |
| BMI-001, 004, 010, 014, 020, 021, 030 | Scaffold, proxy, Docker, file picker, gaussian, PNG export (branch `feat/scaffold-and-proxy`) | git-owner session | Review |
| BMI-002 | CI + Dependabot | git-owner session | Ready |
| BMI-040 | i18n foundation | Sonnet subagent (PM reviews) | In progress |
| BMI-041 | Locale resolution + switcher | same agent | In progress |
| BMI-042 | Translate existing UI (now ~5 components + effect and export labels; re-size to M) | same agent | In progress |
| BMI-043 | Errors as codes | same agent | In progress |
| BMI-044 | Number formatting + plurals | same agent | In progress |

**Committed (`bdcccbe`, PR #1):** drag and drop, paste, URL loading, Pixelate, Motion, brush, eraser, undo/redo, JPG/JPEG/WebP export and large images, with unit and e2e specs. `Review` until PR #1 is merged and the checks are green.

## i18n in progress

The editor was committed before i18n, with English strings hard-coded (D-003). BMI-040 to BMI-044 are being built together over the committed UI. Any UI text added while this runs adds to the translation work: add it to the message files, not inline.

## Standards package (D-004)

New epic E7 (BMI-060 to BMI-073): quality bar, proxy hardening, CSP and headers, supply chain, privacy tests, accessibility, community files, releases. Grooming comes after i18n lands, because BMI-061 and BMI-068 touch the same components. Written to `Idea` for now; each item gets acceptance criteria from `.local/standards/*.md` when groomed. The reports are in a git-ignored folder, so the only durable record is the backlog and D-004.

## Next

In order, after i18n. Build order, not a scope cut: all of it is v1. Most of the items below already exist on the PR and need review and merge, not building.

1. Merge PR #1 once checks are green; BMI-002 (CI) in parallel
2. BMI-003: deploy
3. BMI-050, BMI-051: audit, README matches what shipped, go public

## Blocked / waiting on Ícaro

- **D-004** was relayed by the git-owner session. Please confirm it directly (especially the single-key shortcut change).
- **Q-003** contact address, **Q-004** deploy on every merge to `main`?, **Q-005** hosted URL: see decisions.md.
- **Q-001** Localized URLs for SEO? Not blocking now; needed before launch.
- **Q-002** Portuguese marketing? Not blocking development.
- **BMI-042** needs Ícaro to review the `pt-BR` strings before it's `Done`.

## Log

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
