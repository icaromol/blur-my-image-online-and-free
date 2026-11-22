# Status

Updated: 2026-11-22

## Milestone: v1

0 of 30 `Must` done · 7 in review · 14 in progress (uncommitted) · 0 blocked. Full list in [backlog.md](backlog.md).

## Now

**Iteration goal (2026-11-23 → 2026-11-29):** merge the scaffold and proxy, put CI in place, and make the app bilingual before any new screen is built.

| ID | Item | Owner | Status |
| --- | --- | --- | --- |
| BMI-001, 004, 010, 014, 020, 021, 030 | Scaffold, proxy, Docker, file picker, gaussian, PNG export (branch `feat/scaffold-and-proxy`) | git-owner session | Review |
| BMI-002 | CI + Dependabot | git-owner session | Ready |
| BMI-040 | i18n foundation | — | Ready |
| BMI-041 | Locale resolution + switcher | — | Ready |
| BMI-042 | Translate existing UI (now ~5 components + effect and export labels; re-size to M) | — | Ready, waits for UI commit |
| BMI-043 | Errors as codes | — | Ready |
| BMI-044 | Number formatting + plurals | — | Ready |

**Working tree, not committed (found 2026-11-22):** another session has built drag and drop, paste, URL loading, Pixelate, Motion, brush, eraser, undo/redo, JPG/JPEG/WebP export and large-image handling, with unit and e2e specs (`src/ui/`, `src/engine/`, `src/input/`, `src/export/`, `e2e/`). All of it is `In progress` until committed and green.

## Risk: UI built before i18n

D-001 put i18n first so new screens would be born translated. The UI above was built without it: English strings are hard-coded in five new components, in `effects.ts` labels and in `encode.ts` labels. BMI-042 is now bigger than the `S` it was sized at. Proposed order, which is sequencing and not a cut: BMI-040 and BMI-041 (new files only, no conflicts) can start now; BMI-042 to BMI-044 wait until the current UI work is committed so two sessions don't edit the same components. Needs Ícaro's call on whether to also freeze new UI strings until BMI-040 lands.

## Next

In order, once the items above are merged. This is build order, not a scope cut: all of it is v1.

1. BMI-011, BMI-012: drag and drop, paste
2. BMI-022, BMI-023, BMI-024: Pixelate, Motion, effect selector
3. BMI-028: undo / redo
4. BMI-025, BMI-026, BMI-027: brush, eraser, brush size
5. BMI-013, BMI-015: URL loading, large images
6. BMI-031, BMI-032, BMI-033: JPG, WebP, export guarantees
7. BMI-003: deploy
8. BMI-050, BMI-051: audit, go public

## Blocked / waiting on Ícaro

- **Q-001** Localized URLs for SEO? Not blocking now; needed before launch.
- **Q-002** Portuguese marketing? Not blocking development.
- **BMI-042** needs Ícaro to review the `pt-BR` strings before it's `Done`.

## Log

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
