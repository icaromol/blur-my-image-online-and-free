# Backlog

Single source of truth for work items. Statuses, priority and size are defined in `.claude/skills/pm/SKILL.md`. Current iteration and log live in [status.md](status.md); decisions in [decisions.md](decisions.md).

Last synced with the code: 2026-11-22. Committed on `feat/scaffold-and-proxy` (PR #1, draft, not merged). `Review` means committed on that branch, not merged to `main`.

## Milestone v1

Everything the README describes, plus i18n (D-001). Ships when every `Must` is `Done`.

Progress: 0 of 45 `Must` done, 40 in review, 2 in progress (BMI-066, 070), 0 ready, 3 idea (BMI-003, 050, 073). Also BMI-074 (`Should`, `Done`).

### E1. Foundation

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-001 | Scaffold: Vue 3 + Vite + TS, Biome, Vitest, Playwright, husky pre-commit | Must | M | Review | |
| BMI-002 | CI: check, unit, e2e, Docker build on every PR; Dependabot | Must | S | Review | BMI-001 |
| BMI-003 | Deploy to Vercel Hobby (static site + `/api/image` function); Git integration, production on every merge to `main` (D-005); project creation half done (MCP 403, CLI created it unverified, Git link pending); see tooling.md | Must | S | Idea | BMI-001, BMI-014 |
| BMI-004 | Docker image (static site + proxy on Node) built in CI as the exit path | Must | S | Review | BMI-014 |

### E2. Input

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-010 | Load via file picker | Must | S | Review | BMI-001 |
| BMI-011 | Load via drag and drop anywhere on the page | Must | S | Review | BMI-010 |
| BMI-012 | Load via paste (`Ctrl/Cmd+V` with an image on the clipboard) | Must | S | Review | BMI-010 |
| BMI-013 | Load via URL field and via pasting a copied link; direct CORS first, proxy fallback | Must | M | Review | BMI-014 |
| BMI-014 | URL proxy `/api/image`: Hono, SSRF checks per redirect, `image/*` only, `MAX_BYTES`, timeout, cross-site rejection | Must | M | Review | |
| BMI-015 | Large images: read `MAX_TEXTURE_SIZE`, downscale to fit, tell the user before editing | Must | S | Review | BMI-010 |

### E3. Effects and editing

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-020 | Operation list + PixiJS renderer, whole-image operations | Must | M | Review | BMI-001 |
| BMI-021 | Gaussian effect, intensity 1–100 relative to the image's shorter side | Must | S | Review | BMI-020 |
| BMI-022 | Pixelate effect + "blur is not redaction" warning next to it | Must | S | Review | BMI-020 |
| BMI-023 | Motion effect + angle control (0–180°) | Must | S | Review | BMI-020 |
| BMI-024 | Effect selector in the toolbar | Must | S | Review | BMI-022 |
| BMI-025 | Brush: paint the current effect + intensity as a mask; strokes with the same setting don't compound; `B` shortcut | Must | L | Review | BMI-020 |
| BMI-026 | Eraser: restore original pixels; `E` shortcut | Must | M | Review | BMI-025 |
| BMI-027 | Brush size from toolbar and `[` / `]` | Must | S | Review | BMI-025 |
| BMI-028 | Undo / redo as a pointer in the operation list; `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z` | Must | M | Review | BMI-020 |

### E4. Export

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-030 | Export PNG at original resolution | Must | S | Review | BMI-020 |
| BMI-031 | Export JPG / JPEG (user picks extension), transparency flattened on white, quality 0.92 | Must | S | Review | BMI-030 |
| BMI-032 | Export WebP; feature-detect Safari's silent PNG fallback and lazy-load `@jsquash/webp` | Must | M | Review | BMI-030 |
| BMI-033 | Export guarantees: output equals preview at full resolution, no EXIF in any format (e2e) | Must | S | Review | BMI-031, BMI-032 |

### E5. Internationalization — spec: [specs/i18n.md](specs/i18n.md)

Built before any more UI work so new screens are born translated (D-001).

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-040 | i18n foundation: vue-i18n, `src/i18n/`, typed keys, lazy-loaded locales, key-parity test | Must | M | Review | BMI-001 |
| BMI-041 | Locale resolution (saved → browser → `en`), switcher, `<html lang>`, persisted choice | Must | S | Review | BMI-040 |
| BMI-042 | Translate the existing UI to `pt-BR`; effect labels from message keys | Must | S | Review | BMI-040 |
| BMI-043 | Errors as codes: client and proxy codes mapped to translated messages | Must | S | Review | BMI-040 |
| BMI-044 | Locale-aware number formatting and plurals | Must | S | Review | BMI-040 |

### E7. Quality, security and community — source: D-004 (`.local/standards/`, not committed)

Approved package from three research reports (quality and CI, security baseline, community and governance). The reports were written against commit `5eae8fc` and the code has moved; each item is re-checked against current files when picked up. Re-check item details in the reports, not here.

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-060 | Quality bar: stricter tsconfig flags, Biome rules and per-folder import boundaries, kebab-case file names, coverage thresholds on `src/engine` and `server/proxy`, `docs/quality.md` linked from README | Must | M | Review | BMI-001 |
| BMI-061 | Performance budget: lazy-load the engine so initial JS stays ≤ 45 kB brotli (D-009), `size-limit` in CI, WebP encoder only via `import()` | Must | S | Review | BMI-040, BMI-002 |
| BMI-062 | Proxy hardening A: one middleware sets `no-store`, `nosniff`, CORP, `Referrer-Policy`, sandbox CSP on every response; image type allowlist with file-signature check, mismatch → 415 | Must | M | Review | BMI-014 |
| BMI-063 | Proxy hardening B: default ports only, reject URL credentials, block `::/96`, fixed outbound headers, validate `ALLOWED_ORIGINS` at startup | Must | M | Review | BMI-014 |
| BMI-064 | Proxy platform: `maxDuration: 15`, Docker base image pinned by digest, shared `security-headers.ts` on static responses, split `ssrf.ts` into pure `address.ts` + Node-only `node-fetch.ts` | Must | M | Review | BMI-062 |
| BMI-065 | Page security headers and CSP: `pixi.js/unsafe-eval`, single `security-headers.ts`, Vite preview and Vercel config, Playwright runs under the real CSP, remote fetch with `credentials: "omit"` and no referrer | Must | M | Review | BMI-003, BMI-064 |
| BMI-066 | Supply chain: `pnpm-workspace.yaml` safety settings, Dependabot cooldown, CI `pnpm audit`, license and dist checks, `security.yml` | Must | S | In progress | BMI-002 |
| BMI-067 | Privacy tests: e2e (same-origin requests only, no cookies, no CSP violations), EXIF/GPS sentinel check on PNG/JPG/WebP including the jsquash path, proxy privacy test | Must | M | Review | BMI-033, BMI-062 |
| BMI-068 | Accessibility: axe e2e at WCAG 2.2 AA; single-key shortcuts (`B`, `E`, `[`, `]`) only while the canvas has focus; a click without drag paints one dab | Must | M | Review | BMI-025 |
| BMI-069 | README honesty and sync: privacy and proxy text says Vercel's request log keeps the image URL, IP and user agent for 1 hour; shortcut focus rule; contributing links; layout tree; new scripts | Must | S | Review | BMI-068 |
| BMI-070 | Community files: `CONTRIBUTING.md`, issue forms, PR template, labels, merge settings, saved replies | Must | M | In progress | |
| BMI-071 | Releases: release-please config and workflow, Conventional Commits check on the PR title | Must | S | Review | BMI-002 |
| BMI-072 | `CODE_OF_CONDUCT.md` (Contributor Covenant 3.0) and `SECURITY.md`; `SECURITY.md` uses GitHub private reporting (no email); the code of conduct contact is set (D-007, edit waiting for the git owner's commit) | Must | S | Review | |
| BMI-073 | Manual platform settings checklist for Ícaro (GitHub Actions and security, Vercel 2FA, WAF rate-limit rule, toolbar and analytics off, env vars); each README or hosting claim that only the platform can make true is checked or reworded: 1-hour request-log retention, the 4.5 MB body limit, the rate-limit rule and usage alerts | Must | S | Idea | BMI-003 |
| BMI-074 | Find the cause of the unexplained Chromium e2e failure of 2026-11-22: repeat the suite, capture the report and trace, fix the cause or show N green runs | Should | S | Done | BMI-067 |

### E6. Launch readiness

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-050 | Go-public checklist (see details): audit, README matches what shipped, merge PR #1, flip public, then GitHub protections | Must | M | Idea | all v1 items, BMI-070 to BMI-073 |
| BMI-051 | README status line and content match what shipped | Must | S | Review | BMI-040 |
| BMI-052 | Pre-flip audit run, read-only: full-history gitleaks, third-party license notices in the build, `check-dist` and `check-licenses`, README claims checked against the code; findings recorded in [audits/2026-11-22-pre-flip.md](audits/2026-11-22-pre-flip.md) | Must | S | Review | BMI-072 |

## Later (post-v1)

From the README backlog, in the README's order. Not scheduled. Moving any of these into v1 needs Ícaro's yes.

| ID | Item | Type | Status |
| --- | --- | --- | --- |
| BMI-100 | Radial blur, spin | Effect | Idea |
| BMI-101 | Zoom blur | Effect | Idea |
| BMI-102 | Tilt-shift | Effect | Idea |
| BMI-103 | Lens blur / bokeh | Effect | Idea |
| BMI-104 | Solid box for real redaction | Effect | Idea |
| BMI-105 | Box blur | Effect | Idea |
| BMI-106 | Surface / Smart blur (edge-preserving) | Effect | Idea |
| BMI-107 | Iris and Field blur | Effect | Idea |
| BMI-108 | Path blur and Shape blur | Effect | Idea |
| BMI-120 | Invert brush: blur everything except what you paint | Feature | Idea |
| BMI-121 | Brush hardness / feather | Feature | Idea |
| BMI-122 | Automatic face detection | Feature | Idea |
| BMI-123 | JPEG / WebP quality slider | Feature | Idea |
| BMI-124 | HEIC input outside Safari | Feature | Idea |
| BMI-125 | Tiled rendering above `MAX_TEXTURE_SIZE` | Feature | Idea |
| BMI-126 | Copy result to clipboard | Feature | Idea |
| BMI-130 | Property tests (fast-check) for URL and IP parsing | Quality | Idea |
| BMI-131 | OpenSSF badge, signed commits, Trusted Types, COEP | Security | Idea |
| BMI-132 | App version in the UI and in the bug form | Community | Idea |
| BMI-133 | `GOVERNANCE.md`, `CODEOWNERS`, second admin, Discussions, interaction limits, area labels | Community | Idea |
| BMI-134 | e2e decode coverage for GIF, AVIF and BMP (PNG only today) | Quality | Idea |
| BMI-135 | Playwright config: don't silently reuse another process's server on port 4173 outside CI (`reuseExistingServer`); no evidence yet that this caused the 2026-11-22 failure (BMI-074) | Quality | Idea |

Next free IDs: v1 `BMI-005`, `BMI-016`, `BMI-029`, `BMI-034`, `BMI-045`, `BMI-053`, `BMI-075`; later effects `BMI-109`, features `BMI-127`, other later `BMI-136`.

---

## Item details

Only items that are `Ready` or `In progress` need full detail here. Others get it when groomed.

### BMI-074 — unexplained e2e failure

**Result (2026-11-22, run by the quality lane, summary checked by PM):** 10 consecutive full Chromium runs with `--retries=0`, all 35/35 (17 to 23 s, 8 workers); one run with `CI=1` (`retries: 1`, no server reuse), 35/35 with no test passing only on retry; 6 extra runs with `--workers=1` and `--workers=20`, all green. Port 4173 was free before each run and no other Playwright or Vite process was running. **The original failure is still unexplained.** It is not called flaky and not called resolved. Ruled out for the loop: a port conflict during it, the worker count, test order, and the missing retry in CI. Not ruled out, and without evidence: another session's server on port 4173 at the moment of the failing run (`reuseExistingServer` reuses a foreign server without a warning), a rare timing issue, or a different working tree that day. If it happens again, run at once with `--reporter=list,html --trace=retain-on-failure` to keep the error. Nothing to commit or merge: logs are in `.local/bmi-074/`, outside git. Marked `Done` on that basis; it adds no code, so there's nothing to merge into `main`.

As a maintainer, I want to know why one local run of `pnpm test:e2e` failed on 2026-11-22 so that a real defect or a fragile setup doesn't surface when PR #1 is merged and CI runs the suite.

What is known: on 2026-11-22 the PM ran `pnpm test:e2e` (Chromium, 35 tests, 8 workers) three times in a row on `feat/scaffold-and-proxy`. The first run exited 1 and the next two passed 35/35. The error text of the first run wasn't captured, so **the cause is unknown**: a test defect, the app, or the environment are all still possible. One thing worth checking, not a finding: `playwright.config.ts` has `reuseExistingServer: !process.env.CI` on the fixed port 4173, and several sessions share this machine. CI runs with `retries: 1`, which would hide a test that fails once and passes on the retry.

Added as a `Should` verification of work already in `Review` (BMI-067, BMI-001). It adds no feature and cuts nothing. Adding an item to the milestone is Ícaro's call, so he can veto it. Marked `Ready` because it only reads and measures; the PM doesn't consider the diagnosis part a scope change.

- [x] 10 consecutive full Chromium runs with `retries` forced to 0 (for example a shell loop around `pnpm test:e2e --retries=0`), with `trace: "retain-on-failure"` and the HTML report kept for any failing run; no other session runs the suite or a preview server on port 4173 during the loop. Record the command, the number of runs and each failure's test name and error.
- [x] If a run fails: the root cause is found and fixed (in the test or the app) and the loop passes 10 times again. If the cause is the shared port or `reuseExistingServer`, the fix is in `playwright.config.ts`.
- [x] If all 10 runs pass: report that the original failure is still unexplained, and say what was ruled out. Don't call it flaky or resolved.
- [x] Also run the loop once with `CI=1` so the CI settings (`retries: 1`, no server reuse) are exercised, and report any test that passes only on retry.
- [x] Lane: quality (read-only unless a fix is needed). `playwright.config.ts` is a shared-file lock: take it before editing.

### BMI-003 — Deploy: criteria added

Asked for by marketing through the dispatcher; refines this item, not a new one. Ícaro can veto it.

- [ ] The page carries Open Graph and Twitter card meta tags (title, description, image, URL) so a shared link shows a preview. The tags use the final wording from D-010 (same as BMI-051). The OG image can now be made: the English tagline is decided.

### BMI-002 — CI and Dependabot

As a maintainer, I want every PR checked automatically so that a broken build never reaches `main`.

- [ ] GitHub Actions workflow on PR and push to `main`: `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm test`, `pnpm test:e2e` (Chromium + WebKit), `docker build`.
- [ ] Dependabot for npm and GitHub Actions, weekly.
- [ ] `main` branch protection requires the workflow to pass.

Expanded by D-004 (design in `.local/standards/quality.md`, CI design section):

- [ ] Job **Verify** on every PR and `main`: frozen install, check, coverage, build, build:server, size, `pnpm audit --audit-level=high`, license and dist checks.
- [ ] Job **E2E (Chromium)** on every PR; Firefox and WebKit, and the Docker build with a smoke test, on `main` only.
- [ ] Workflows: `contents: read`, `persist-credentials: false`, actions pinned by full SHA, timeouts, concurrency cancel.
- [ ] Required checks on `main` can't be enforced while the repo is private on the Free plan: the ruleset is part of BMI-050.

The workflow landed as `08d2384` and Dependabot (npm, GitHub Actions, Docker, weekly, with cooldown) as `a61f693`; the first PR run passed Verify and E2E (Chromium). The required-checks ruleset can only be enforced after the repo goes public, so it is a BMI-050 step. `Review` until PR #1 merges.

### BMI-011 — Drag and drop

As a user, I want to drop an image anywhere on the page so that I don't have to aim for a small target.

- [ ] Dropping an image file anywhere loads it, same as the file picker.
- [ ] A visible drop overlay appears while dragging a file over the page.
- [ ] Dropping a non-image shows the translated `decode_failed` error.
- [ ] Dropping several files loads the first image and ignores the rest.
- [ ] E2E covers a drop.

### BMI-012 — Paste an image

As a user, I want to paste a screenshot with `Ctrl/Cmd+V` so that I skip saving it to a file first.

- [ ] Pasting with an image on the clipboard loads it.
- [ ] Pasting while focus is in a text field (the URL field) doesn't hijack normal text paste.
- [ ] E2E covers a paste.

### BMI-040 to BMI-044 — i18n

User stories and acceptance criteria are in [specs/i18n.md](specs/i18n.md), requirements R1 to R5.


### BMI-050 — Go-public checklist

Ordered, from `.local/standards/community.md` and `security.md` (D-004). Every line needs Ícaro's go before the repo flips.

Before the flip:
- [ ] Full-history gitleaks re-run is clean.
- [ ] `SECURITY.md` and `CODE_OF_CONDUCT.md` committed with the contact from D-007 (`CODE_OF_CONDUCT.md` in `c5b3bce`).
- [x] `CLAUDE.md` and `.claude/` stay in the repo (D-008, 2026-11-22). The provenance and license of the skills under `.claude/` (brandkit, design-taste-frontend, no-ai-slop) is still unstated; this decision doesn't cover it.
- [ ] Third-party license notices in the bundle; README status line and contributing links updated (BMI-051).
- [ ] Repo description, topics, social preview image; 3 to 5 good first issues.

At the flip, in order: flip public → private vulnerability reporting, push protection, CodeQL default → ruleset on `main` (no force push or deletion, PR required, required checks, linear history) → fork PR workflows need approval → scorecard and dependency-review workflows → confirm Vercel Git fork protection.

### E7 progress notes (2026-11-22, earlier; the later notes below supersede these where they differ)

What is committed on `feat/scaffold-and-proxy`, and what is still open per item:

- **BMI-002 CI:** `ci.yml` is written but not committed; the git-owner session commits it once `test:coverage` and `size` exist in `package.json`.
- **BMI-060 quality bar:** `docs/quality.md` is in (`a61f693`). Still open: tsconfig flags, Biome rules and folder boundaries, coverage thresholds, kebab-case rename.
- **BMI-066 supply chain:** Dependabot, `security.yml`, `scripts/check-licenses.mjs` and `scripts/check-dist.mjs` are in (`a61f693`, `48b1f3d`). Still open: `pnpm-workspace.yaml` with `minimumReleaseAge: 10080`, `trustPolicy: no-downgrade`, `strictDepBuilds`, `blockExoticSubdeps` and an empty `allowBuilds`. **Target date 2026-11-28, no exception list.** It can't go in earlier: 40 packages already in the lockfile are younger than 7 days, and the newest (`undici` 8.13.1) turns 7 days old around 2026-11-27 22:00 UTC. Until then pnpm 12's default (1 day) applies. Draft: `.local/standards/drafts/pnpm-workspace.yaml` (git-ignored).
- **BMI-070 community files:** `CONTRIBUTING.md`, issue forms and the PR template are in (`4c15265`). Still open: labels, merge settings (squash only, delete branch on merge, suggest updating PR branches) and saved replies, all done in GitHub's settings.
- **BMI-071 releases:** release-please config, manifest and workflow are in (`4c15265`). The Conventional Commits check on the PR title landed in `76325bb`. Nothing open in the repo; the first tagged release is part of BMI-050.
- **BMI-072:** `CODE_OF_CONDUCT.md` and `SECURITY.md` are in with the `<CONDUCT_CONTACT>` placeholder; replaced by the contact in D-007 (Q-003 closed, 2026-11-22), edit pending the git owner's commit.
- **BMI-040 to BMI-044 i18n:** committed as `ba6343f`. Ícaro reviewed `pt-BR.json` and changed the tagline and the drop overlay text (`bbb060c`), so the review condition on BMI-042 is met. It stays `Review` like the rest until PR #1 is merged to `main`. The `define` flags in `vite.config.ts` and the default `locale: "en-US"` in `playwright.config.ts` ride along with the frontend session's config commit.

### E7 progress, later on 2026-11-22

Committed on `feat/scaffold-and-proxy` by the git-owner session: the frontend standards package (`533f624`), page headers in the Node entry (`6bea2a7`), layout doc (`120f89b`) on top of the earlier community and CI files. PM spot-checked each item in the code (greps for the key behaviors, plus running `pnpm size`), but did not audit every acceptance criterion; the reviewer lane or the PR review does that.

- **BMI-060 → Review.** Biome strict rules and folder boundaries, tsconfig flags, coverage thresholds, `docs/quality.md` linked from the README.
- **BMI-061 stays `In progress`.** The engine loads lazily, but `pnpm size` fails: initial JS is 43.21 kB brotli against a 35 kB budget, and all JS except the WebP encoder is 192.22 kB against 180 kB. Ícaro chose to precompile the i18n messages to cut it (D-006). BMI-002 (`ci.yml`) is on hold until `pnpm size` is green.
- **BMI-062, 063, 064 → Review.** Security headers on every proxy response, image type allowlist with 415, fixed outbound headers, `address.ts` split from `node-fetch.ts`, Docker base image pinned by digest, `maxDuration: 15`, Node entry applying the page headers.
- **BMI-065 → Review.** `security-headers.ts` as the single source, `vercel.json` kept in sync by a test, e2e running under the CSP, `credentials: "omit"` on remote fetches.
- **BMI-067 → Review.** Privacy e2e (same-origin, no cookies, no CSP violations), metadata stripping e2e for PNG, JPEG and both WebP encoders, proxy privacy checks in `app.test.ts`.
- **BMI-068 → Review.** axe at WCAG 2.2 AA, single-key shortcuts only with image focus, a click without drag paints one dab.
- **BMI-069 → Review.** README states the Vercel request-log caveat and the shortcut focus rule.

### BMI-060 — committed (2026-11-22)

The server tsconfig flags (`noUncheckedIndexedAccess`, `noImplicitOverride`) landed as `5642e7b` on top of `533f624`. `Review` until PR #1 merges to `main`.

- [x] `tsconfig.server.json` sets both flags and `pnpm check` passes with them.
- [x] Committed by the git owner (`5642e7b`).

### BMI-061 — committed (2026-11-22)

Committed as `e2e0eb6`: i18n messages precompiled (47.0 → 43.2 kB initial). Ícaro accepted budgets of 45 kB initial and 195 kB total instead of 35 / 180 kB (D-009, relayed). `Review` until PR #1 merges to `main`. Owner was the frontend session (D-006).

- [x] `pnpm size` passes: initial JS ≤ 45 kB brotli and all JS except the WebP encoder ≤ 195 kB (PM re-ran 2026-11-22: 43.21 and 192.22 kB).
- [x] i18n messages precompiled at build time (`e2e0eb6`); `pt-BR` still loads as its own chunk; Chromium e2e passes (PM ran 2026-11-22: 35/35 on the second and third runs; the first run failed and was not diagnosed).
- [x] The WebP encoder is loaded only through `import()` (`src/export/encode.ts`), and the renderer and effect code load through `import()` in `src/engine/load-renderer.ts` (reported by `-cc`, PM spot-checked both lines).

### BMI-052 — pre-flip audit run

Split out of BMI-050 so a worker can do the read-only part. It doesn't depend on BMI-070: what's left there is GitHub settings, which a read-only audit doesn't need (dispatcher's question, 2026-11-22). Flipping the repo public stays with Ícaro under BMI-050.

- [ ] `gitleaks` over the full history of every branch is clean (report the command and the commit count).
- [ ] `dist/licenses.md` exists after `pnpm build` and lists every package bundled into the shipped client; `scripts/check-licenses.mjs` and `scripts/check-dist.mjs` pass.
- [ ] Each claim in the README (formats, shortcuts, privacy, proxy limits, effects, languages) is checked against the code and the e2e specs; every mismatch is reported with file and line, not silently fixed.
- [ ] No file under the repo, committed or not, contains the maintainer's email, a token or a Vercel team identifier.
- [ ] Report written to the dispatcher; no files changed.

### BMI-051 — README and docs match what shipped

Committed as `5117278` (`README.md`, `docs/hosting.md`, `index.html`), verified by the dispatcher and approved by the opus reviewer; PM spot-checked README lines 3, 30 and `index.html` line 6 and found no "open source" wording left in README or hosting.md. `Review` until PR #1 merges to `main`.

Reopened by D-010 and committed as `758fc6b` (`README.md`, `index.html`, `en.json`, `pt-BR.json`); verified by the dispatcher (check, 229 unit tests, e2e 35/35, size 43.24 / 192.26 kB) and approved by the opus reviewer. PM confirmed the commit touches those four files on the branch. `Review` until PR #1 merges to `main`.

- [x] `README.md` line 3 and the `index.html` meta description say "Image files you open, drop or paste never leave your device."
- [x] `app.tagline` in `en.json` ("…Image files never leave your device.") and `pt-BR.json` ("…Os arquivos de imagem nunca saem do seu navegador.").
- [x] `README.md` line 99: "at the loaded image's resolution" and "The blur size is defined in source-image pixels, never screen pixels".

Done after `Review`:
- Ícaro read and approved the `pt-BR` tagline as committed (relayed by `-aa`, 2026-11-22; the reviewer's "Seus arquivos…" variant is not used). Logged in D-010.

Marketing text that quoted the old tagline or the provisional sentence now matches D-010: `cb39247` (audience and three posts) and `ad82c2e` (pre-launch plan), approved by the opus reviewer after Ícaro's direct yes for those lines (relayed by `-aa`). PM spot-checked that the plan marks the tagline as settled by D-010 and found no old wording left under `docs/marketing` or `marketing`. Nothing open on this item except the merge of PR #1.

- [x] The status line says pre-release (v1 built and under review, not deployed) and no longer "planning, nothing implemented". It keeps marketing in its pre-launch posture: no "try it now" until BMI-003 gives a live URL. The live wording is set at go-public (BMI-050).
- [x] The proxy portability sentence says `app.ts` is platform-neutral, Vercel and Node ship, and Cloudflare would need its own fetch and entry.
- [x] The export text says the format is chosen from a list (PNG, JPG, JPEG, WebP) and the file is named `<name>-blurred.<ext>`.
- [x] "Adding a language" mentions the `SUPPORTED_LOCALES` entry as well as the message file.
- [x] The Motion description matches the code (a local edge-clamped filter, not stock pixi-filters).
- [x] The pre-commit description says Biome and `vue-tsc` on staged files.
- [x] The Docker-build-in-CI claim is conditional on `ci.yml` and on `main`, or `ci.yml` is committed first.
- [x] `docs/hosting.md` matches the code: `export const GET` in `api/image.ts`, `PROXY_TIMEOUT_MS`, a fixed 3 redirects, Worker entry and DoH resolver marked deferred.
- [x] The privacy claim in `README.md` line 3 and in the `index.html` meta description carries the URL-proxy exception: the reviewer's suggested wording is "Images you open, drop or paste never leave your device." Final wording follows Ícaro's answer on the en / pt-BR tagline (open, see status.md); this item doesn't decide it. `index.html` is outside the quality lane's owned paths, so the dispatcher coordinates it with whoever holds that file.
- [x] `docs/hosting.md` line 43 ("For a free open source tool") makes an open-source claim in a tracked doc while the repo is private. Reword it neutrally, or leave it for the go-public step; the rule is that no public-facing text says "open source" before BMI-050 flips the repo. Found by the reviewer, 2026-11-22.
- [x] The export sentence in `README.md` line 30 ("Export it at the original resolution") says that the original resolution is kept, which isn't true for an image downscaled to the GPU limit (README line 101, the `downscaled` message). It states the exception.
- [x] Privacy wording: the ambiguity was reported by the reviewer. Superseded by D-010: the final wording and the tagline edits are the open criteria above, and the translation files may now be edited.
- [x] Out of scope here: claims only Vercel can make true (see BMI-073).
