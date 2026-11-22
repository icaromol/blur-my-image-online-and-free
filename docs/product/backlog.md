# Backlog

Single source of truth for work items. Statuses, priority and size are defined in `.claude/skills/pm/SKILL.md`. Current iteration and log live in [status.md](status.md); decisions in [decisions.md](decisions.md).

Last synced with the code: 2026-11-22. Committed on `feat/scaffold-and-proxy` (PR #2, draft, not merged; it replaced PR #1, which GitHub closed during the history rewrite). `Review` means committed on that branch, not merged to `main`.

## Milestone v1

Everything the README describes, plus i18n (D-001). Ships when every `Must` is `Done`.

Progress: 0 of 48 `Must` done, 43 in review, 4 in progress (BMI-003, 050, 066, 070), 1 ready (BMI-076, after the merge), 0 blocked. Also BMI-074 (`Should`, `Done`), BMI-075 (`Should`, `Review`), BMI-078 (`Should`, `Idea`), BMI-080 and BMI-081 (`Should`, `Review`).

### E1. Foundation

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-001 | Scaffold: Vue 3 + Vite + TS, Biome, Vitest, Playwright, husky pre-commit | Must | M | Review | |
| BMI-002 | CI: check, unit, e2e, Docker build on every PR; Dependabot | Must | S | Review | BMI-001 |
| BMI-003 | Deploy to Vercel Hobby (static site + `/api/image` function); Git integration, production on every merge to `main` (D-005); authorized by D-012; see tooling.md and the details below | Must | S | In progress | BMI-001, BMI-014 |
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

Approved package from three research reports (quality and CI, security baseline, community and governance). The reports were written against commit `fd5cf16` and the code has moved; each item is re-checked against current files when picked up. Re-check item details in the reports, not here.

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
| BMI-073 | Manual platform settings checklist for Ícaro (GitHub Actions and security, Vercel 2FA, WAF rate-limit rule, toolbar and analytics off, env vars); each README or hosting claim that only the platform can make true is checked or reworded: 1-hour request-log retention, the 4.5 MB body limit, the rate-limit rule and usage alerts | Must | S | Review | BMI-003 |
| BMI-074 | Find the cause of the unexplained Chromium e2e failure of 2026-11-22: repeat the suite, capture the report and trace, fix the cause or show N green runs | Should | S | Done | BMI-067 |

### E8. Brand identity: D-020

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-075 | Brand kit: vector logos (his original lettering, vectorized; black, white, blue accent), minimal palette with contrast checked, favicon, OG image base, marketing CSS, short guide; app theme not included | Should | M | Review | |
| BMI-078 | Apply the brand to the site: favicon and apple-touch icon in `public/`, the link tags in `index.html`, the new OG image; in a PR of its own after the merge of PR #2 and the kit | Should | S | Idea | BMI-075, the merge of PR #2 |

### E6. Launch readiness

| ID | Item | Priority | Size | Status | Depends on |
| --- | --- | --- | --- | --- | --- |
| BMI-050 | Go-public checklist (see details; order set by D-018): rewrite history, flip, protections, CodeRabbit config, review, corrections, merge | Must | M | In progress | BMI-070, BMI-072; the merge also needs BMI-073 |
| BMI-051 | README status line and content match what shipped | Must | S | Review | BMI-040 |
| BMI-052 | Pre-flip audit run, read-only: full-history gitleaks, third-party license notices in the build, `check-dist` and `check-licenses`, README claims checked against the code; findings recorded in [audits/2026-11-22-pre-flip.md](audits/2026-11-22-pre-flip.md) | Must | S | Review | BMI-072 |
| BMI-076 | Scorecard and dependency-review workflows (split out of BMI-050's post-flip list): `.github/workflows/`, actions pinned by SHA, in a PR of their own after the merge of PR #2 | Must | S | Ready | the merge of PR #2 |
| BMI-077 | Address CodeRabbit's findings on PR #2: nine corrections in the ui, server and quality lanes; Ícaro's three answers added (D-025, D-026); a locale-race fix added after round 3 | Must | M | Review | the CodeRabbit review of PR #2 |
| BMI-079 | Privacy notice under the link field (his wording, `en` and `pt-BR`), associated with the field for assistive tech, with unit and e2e tests; README privacy text states it | Must | S | Review | |
| BMI-080 | Document that the 30 requests per 60 s rate limit exists only on Vercel (WAF) and that anyone running Node or Docker must put their own limit in front; record the WAF test result in the docs | Should | S | Review | |
| BMI-081 | The Vercel WAF deny comes back as plain text "Forbidden", not the proxy's JSON: see how the front reacts, propose a "too many requests" message with an i18n code, and note that a shared IP (school, carrier NAT) can hit the limit | Should | S | Review | |

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
| BMI-136 | Marketing templates: `marketing/social/templates/brand.css` imports Google Fonts at render time (a network request on every render, for the `tip.html` template); self-host the font or drop the import. Only matters if `tip.html` is used; the app is not affected | Quality | Idea |
| BMI-137 | Image loading by link on phones: the real ceiling is decoding memory, not the 100 MiB cap (a compressed file of tens of MB can exceed 100 megapixels, over 400 MB as RGBA, and end in `decode_failed`; a body just under the cap sits whole in a Blob, kept in RAM on iOS Safari and able to reload the tab); a lower or device-aware cap, or a clearer message when decoding fails on a very large file | Quality | Idea |
| BMI-135 | Playwright config: don't silently reuse another process's server on port 4173 outside CI (`reuseExistingServer`); no evidence yet that this caused the 2026-11-22 failure (BMI-074) | Quality | Idea |

Next free IDs: v1 `BMI-005`, `BMI-016`, `BMI-029`, `BMI-034`, `BMI-045`, `BMI-053`, `BMI-082`; later effects `BMI-109`, features `BMI-127`, other later `BMI-138`.

---

## Item details

Only items that are `Ready` or `In progress` need full detail here. Others get it when groomed.

### BMI-074 — unexplained e2e failure

**Result (2026-11-22, run by the quality lane, summary checked by PM):** 10 consecutive full Chromium runs with `--retries=0`, all 35/35 (17 to 23 s, 8 workers); one run with `CI=1` (`retries: 1`, no server reuse), 35/35 with no test passing only on retry; 6 extra runs with `--workers=1` and `--workers=20`, all green. Port 4173 was free before each run and no other Playwright or Vite process was running. **The original failure is still unexplained.** It is not called flaky and not called resolved. Ruled out for the loop: a port conflict during it, the worker count, test order, and the missing retry in CI. Not ruled out, and without evidence: another session's server on port 4173 at the moment of the failing run (`reuseExistingServer` reuses a foreign server without a warning), a rare timing issue, or a different working tree that day. If it happens again, run at once with `--reporter=list,html --trace=retain-on-failure` to keep the error. Nothing to commit or merge: logs are in `.local/bmi-074/`, outside git. Marked `Done` on that basis; it adds no code, so there's nothing to merge into `main`.

As a maintainer, I want to know why one local run of `pnpm test:e2e` failed on 2026-11-22 so that a real defect or a fragile setup doesn't surface when PR #2 is merged and CI runs the suite.

What is known: on 2026-11-22 the PM ran `pnpm test:e2e` (Chromium, 35 tests, 8 workers) three times in a row on `feat/scaffold-and-proxy`. The first run exited 1 and the next two passed 35/35. The error text of the first run wasn't captured, so **the cause is unknown**: a test defect, the app, or the environment are all still possible. One thing worth checking, not a finding: `playwright.config.ts` has `reuseExistingServer: !process.env.CI` on the fixed port 4173, and several sessions share this machine. CI runs with `retries: 1`, which would hide a test that fails once and passes on the retry.

Added as a `Should` verification of work already in `Review` (BMI-067, BMI-001). It adds no feature and cuts nothing. Adding an item to the milestone is Ícaro's call, so he can veto it. Marked `Ready` because it only reads and measures; the PM doesn't consider the diagnosis part a scope change.

- [x] 10 consecutive full Chromium runs with `retries` forced to 0 (for example a shell loop around `pnpm test:e2e --retries=0`), with `trace: "retain-on-failure"` and the HTML report kept for any failing run; no other session runs the suite or a preview server on port 4173 during the loop. Record the command, the number of runs and each failure's test name and error.
- [x] If a run fails: the root cause is found and fixed (in the test or the app) and the loop passes 10 times again. If the cause is the shared port or `reuseExistingServer`, the fix is in `playwright.config.ts`.
- [x] If all 10 runs pass: report that the original failure is still unexplained, and say what was ruled out. Don't call it flaky or resolved.
- [x] Also run the loop once with `CI=1` so the CI settings (`retries: 1`, no server reuse) are exercised, and report any test that passes only on retry.
- [x] Lane: quality (read-only unless a fix is needed). `playwright.config.ts` is a shared-file lock: take it before editing.

### BMI-075 — Brand kit

As the maintainer, I want one visual identity (minimalist, black and white, blue as the accent) so that the repo, the link preview and the posts look like one product.

Requested by Ícaro (D-020, relayed by `-aa`) and confirmed as described by him (D-021). **The kit does not go into PR #2** (`-aa`, 2026-11-22): its 29 files would push the PR back over CodeRabbit's limit of 100. It goes in a PR of its own after the merge of PR #2; the commit was moved off the feature branch to `feat/brand-kit` (done by `-5b`, 2026-11-22), and nothing from it reaches `public/` or `index.html`. Committed as `2a8d07a` on the local branch `feat/brand-kit`, off PR #2 (29 files, `brand/` without `source/`, `brand.css` and `og.html`), verified by the dispatcher and approved by the opus reviewer after one correction round; `Review`. Ícaro answered the three design choices (D-027): his original lettering is vectorized instead of the Liberation redraw, so the SVGs are redone (`In progress`); the two-tone blue and the icons are accepted. Putting the favicon in `public/`, linking it from `index.html` and the new OG image are BMI-078, a PR of its own after the merge of PR #2. Lane: marketing, with the designer. Source: the two raw logos in `brand/source/` (stacked 1254x1254, horizontal 1983x793): raster, off-white background, compression artifacts. The logos are Ícaro's and may be published under MIT (D-022).

- [x] Vector logos as SVG (D-027): the wordmark is Ícaro's **original lettering**, vectorized from `brand/source/logo-horizontal.png` (1983x793) with a mature tool (potrace or an equivalent) and compared side by side with the original at small sizes; horizontal and stacked versions, four colorways each (black, white reverse, and the two blue tones); the pixel mark changes only if it has to. Liberation Sans Bold is used for running text only (the guide's note about a Liberation wordmark is history; `OFL.txt` stays while the font is used for text).
- [x] A minimal palette: black, white, greys and one blue accent. Every foreground and background pair actually used has its WCAG AA contrast checked and written down. The tokens live in one file.
- [x] Favicon: an SVG and PNG sizes, produced under `brand/`. Putting them in `public/` and linking them from `index.html` is a small follow-up for the ui lane (`-cc`), because both belong to that lane.
- [x] The OG image base and `marketing/social/templates/brand.css` use the new tokens, replacing the provisional CSS. The OG image stays 1200x630 and readable at small sizes, and the new render is reviewed before it replaces the committed `public/og-image.png`.
- [x] A short `brand/README.md`: when to use each logo, clear space, minimum size, what not to do, where the tokens are.
- [x] `src/**` is not touched. Applying the identity in the app is a separate ui-lane item, groomed later with Ícaro, who decides the app's theme.
- [x] The raw PNGs (about 1.9 MB) are never committed; only the SVGs and the final derived files are, and `brand/source/` is git-ignored so a stray `git add` can't take it (`-5b` adds the ignore rule). Git history is permanent.
- [x] `brand/README.md` records the origin as "created by Ícaro", published under MIT (D-022), and no tool or typeface name unless he gives one.
- [x] The no-ai-slop rules apply to all text; the kit is reviewed by the opus reviewer before the commit list goes to `-5b`. No commit before that list.

**Delivered (2026-11-22, per `-75`; PM confirmed the commit and the files on the branch, not the rendered logos):** `abc7410` on the local branch `feat/brand-kit` (on top of `2a8d07a`; 14 files changed; the kit has 28 files and about 109 KB; no `brand/source/`), approved by the opus reviewer in two rounds. The first found the counters of B, a, g and e filled in because the SVGs set no fill rule; the designer reversed the direction of the holes, so the result is the same under `nonzero` and `evenodd` (shown pixel by pixel) and doesn't depend on the consumer's fill-rule support. The wordmark is Ícaro's original lettering vectorized with potrace 2.1.8 (GPL-2.0, an npm package installed outside the repo; the license covers the tool, not its output paths); `brand/README.md` describes it only in its "Regenerating" section and says the logos were "created by Ícaro"; `wordmark-paths.json` is the only trace of the lettering in the repo, and `vectorize-wordmark.mjs` can't run without the raw PNGs, which stay out of git. Checked by the dispatcher by reading the repo and the commit, without running the script: nothing in `src/`, `server/` or `api/` imports `brand/`, Vite has no entry there, Vitest and the tsconfigs don't include it, and Biome does lint and format it (`pnpm check` passed with it, 118 files); the Dockerfile's `COPY . .` puts `brand/` in the build context but the final stage copies only `dist` and `dist-server`, so a `.dockerignore` line for `brand/` is cosmetic and optional (server lane, nothing to do now). On the GPL point: the GPL FAQ says a program's output isn't covered by its license unless the program copies parts of itself into it; the paths come from Ícaro's bitmap and a cleanup pass of the kit's own, so the sentence that the license covers the tool and not its output is reasonable. That is a technical reading, not legal advice, and Ícaro has said the logo is his and publishable under MIT. Applied in a temporary worktree, so the shared tree never left the feature branch. `Review`: the commit lives in `feat/brand-kit`, local only, and goes into a PR of its own after the merge of PR #2. Putting it on the site is BMI-078.

### BMI-003 — Deploy to Vercel

As a user, I want the app at a public URL so that I can use it without installing anything; as the maintainer, I want production to follow `main` without a manual step.

Authorized by Ícaro (D-012, relayed). Report from `-f2`, 2026-11-22 (full evidence went to the dispatcher; PM did not re-check it): criteria 2, 3 and 5 done on the preview deployment, 1 done except one point, 4 and 6 waiting, 7 not started. Executor: `-f2`, with the Vercel actions he authorized. Current state and the earlier 403 are in [../tooling.md](../tooling.md). Nothing may use another credential to get around a denied step: record it and report to `-aa`.

- [x] A Vercel project (`blur-my-image`) exists and is confirmed by a read-only check; `createDeployments` was `disabled` and is now `enabled`.
- [x] Hobby deploys from a private repo: proven. `-f2` reports the Git-integration deployments of the 6 commits of PR #2 all `READY`, `229349c` and `d5e4a4d` serve the app and `/api/image` answers 200 on both. (`-f2` also corrects its earlier report: the `framework: vite` preset wasn't needed for the build to pass.)
- [x] The project is linked to the GitHub repo through Vercel's Git integration: production deploys on merge to `main` (D-005), PRs get preview deployments. If the link needs the Vercel app authorized in the browser, `-f2` asks `-aa` (that step is Ícaro's).
- [x] `MAX_BYTES`, `PROXY_TIMEOUT_MS` and `ALLOWED_ORIGINS` are set (production and preview) as in `docs/hosting.md`.
- [x] Vercel Toolbar and Web Analytics are off (Speed Insights not reported).
- [x] One WAF rate-limit rule on `/api/image`: "Rate limit image proxy", 30 requests per 60 s per IP, deny for 1 minute, published and active with 0 pending changes, read back by `-f2` (per `-aa`, 2026-11-22). Caveat: `-f2` made 13 test GETs (all answered 403 by the proxy itself) and never reached the limit, so that the deny actually fires above 30 requests per 60 s is **not proven**.
- [x] A preview deployment of `feat/scaffold-and-proxy` loads the app (app 200, security headers and CSP present, `/api/image` 200 for an image, 403 for cross-site and internal IPs, 415 for HTML), the `/api/image` proxy answers, and the security headers and CSP from `security-headers.ts` are present on the response. Nothing is promoted to production by hand: the first production deploy is the merge of PR #2 (D-013).
- [ ] The production URL is `https://blurmyimage.vercel.app` (the project's main domain since 2026-11-22; `https://blur-my-image.vercel.app` redirects to it with a 307). It goes into the README, the repo website field and the bug-report form (Q-005) only when Ícaro says (D-016), not before. The preview URL carries the team slug and never goes into a repo file.
- [ ] The page carries Open Graph and Twitter card meta tags (title, description, image, URL), with the final wording from D-010. The OG image comes from marketing's action 5, unblocked now that the English tagline is decided.

Open on BMI-003 after the live-alias finding (decided in D-016; the site stays up, its URL stays out of the README and marketing until Ícaro says):
- [x] The WAF rate-limit rule is published and read back as active (see above). It was first denied in `-f2`'s environment; Ícaro published it himself.
- [x] The "Protection Bypass for Automation" secret is revoked by Ícaro; `-f2` checked that it no longer appears in the project's API (existence only).
- [x] The private team deployment built from `-f2`'s local working-tree upload (307 files, including `.local/` and `.claude/settings.local.json` as source) is removed, by `-f2`, only that deployment; read back, it answers 404. Nothing secret was found in it (scans by `-f2` and the dispatcher).
- [x] Ignored Build Step `test ! -f package.json`: saved by Ícaro in the dashboard and read back by `-f2`, which reports it matches (per `-aa`, 2026-11-22). `-5b` may push the rewritten `main` (D-019); the WAF rule and the revoked bypass secret are still open.
- [x] `ALLOWED_ORIGINS` (only origins, no secret) lists the new main domain, updated by `-f2`; the old domain only redirects. It takes effect on the next deploy, so the proxy's answer to a request made from the new domain is checked after that deploy.
- [x] The rate limit fires: `-f2`'s test, 40 GETs, the 31st denied (`x-vercel-mitigated: deny`), a block of about a minute that lifted by itself (per `-aa`; PM didn't see the output).
- [ ] `index.html` `og:url` and `og:image` still point at the old domain, which now redirects; change them to `https://blurmyimage.vercel.app` (ui lane, `-cc`; the og tags criteria above are otherwise done). Checked in the tracked files: these two lines are the only place the old domain appears outside `docs/product/`; neither the README nor `marketing/` cites any URL. Ícaro's rule (D-016) keeps the URL out of the README and marketing; `index.html` carries it in the OG tags on purpose.
- [x] Decision on the production deployment that serves the alias from the feature branch: it stays up (D-016).
- [ ] The real production build replaces it with the merge of PR #2, the first official production deploy.

Two more things from the report. A "Protection Bypass for Automation" secret was created on the project by `vercel curl`, and `-f2` couldn't revoke it (reading the secret was denied): Ícaro revokes it in the Vercel dashboard (BMI-073). `vercel.json` gained `"framework": "vite"`, committed as `d5e4a4d` by `-5b` (requested by the dispatcher). The push of the docs commit just before it had already triggered a preview without the preset.

### BMI-003, OG tags part — Ready for the ui lane (`-cc`)

The OG image is approved by the opus reviewer and verified by the dispatcher (marketing's action 5). It is rendered by `node marketing/social/render.mjs marketing/social/posts/og-image.json` into `marketing/social/out/` (git-ignored). The 1280x640 render is for GitHub's social preview only (uploaded by hand by Ícaro).

- [x] `index.html` has `og:title`, `og:description`, `og:image`, `og:url`, `og:type` and `twitter:card` (`summary_large_image`). `og:url` and `og:image` are absolute (first on `https://blur-my-image.vercel.app`, the main domain at the time; swapped to `https://blurmyimage.vercel.app`, approved by the reviewer, commit requested from `-5b`).
- [x] `og:description` is the privacy sentence from D-010, the same as the README and the meta description.
- [x] The 1200x630 PNG (`og-image-og-1200x630.png`) is copied to `public/` (for example `public/og-image.png`) and committed by `-5b`; the page serves it.
- [x] `pnpm check`, unit tests, e2e and `pnpm size` still pass; no file contains the Vercel preview URL.
- [x] The CSP in `security-headers.ts` is not loosened; the image is only fetched by crawlers, not by the app.

Done by `-cc` and approved by the opus reviewer, 2026-11-22; committed locally as `0f0a8ed` (`index.html` and `public/og-image.png`; PM confirmed the nine tags and the file, not yet pushed): nine tags in `index.html` (`og:type`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`, `twitter:card`), `public/og-image.png` 1200x630, check, 229 tests and size green, no preview URL or team slug in the repo.

Added after the reviewer's two notes, for after the first production deploy that serves the final build:
- Checked read-only by `-f2` on the preview of `39c28d3` (source Git, `READY`): `/` carries the nine tags with the D-010 sentence and an absolute `og:image`; `/og-image.png` answers 200, `image/png`, 97,630 bytes, 1200x630, with CORP `same-origin` and `nosniff`. Until the production alias is updated by the merge of PR #2, it still serves the first deployment (`339c4ff`), where `/og-image.png` is a 404: a link card made from the alias today has no image. So the real unfurl waits for the first production deploy of the final build.
- [ ] A real link unfurl is checked (Facebook Sharing Debugger, LinkedIn Post Inspector or a Slack message, by Ícaro): the image shows. The `vercel.json` CORP `same-origin` header applies to the PNG; crawlers fetch server-side and shouldn't be affected, but that is an assumption until tested. If one fails, the fix is a header rule giving `/og-image.png` CORP `cross-origin`, nothing else loosened.
- [ ] `twitter:card` has no `twitter:image` and falls back to `og:image` according to X's documentation as the reviewer knows it; untested, so the same check covers X.

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

The workflow landed as `9279a65` and Dependabot (npm, GitHub Actions, Docker, weekly, with cooldown) as `1efaf03`; the first PR run passed Verify and E2E (Chromium). The required-checks ruleset can only be enforced after the repo goes public, so it is a BMI-050 step. `Review` until PR #2 merges.

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


### BMI-073 — platform settings, split by when they matter

**Wording problem found 2026-11-22:** the sentences the lane committed in `a9f8966` say "no usage alert is set up, so the owner has to check usage on the Vercel dashboard" (`docs/hosting.md` caveat 3) and "Usage alerts are still planned, not set up" (the rate-limit paragraph), but Ícaro says he turned the usage notifications on. They assert what nobody can verify and contradict his word. PM's instruction was to promise no alerts, not to say there are none. The fix is a new commit: say only that Hobby pauses the project when a limit is hit, with no bill, that the project doesn't depend on any alert, and that the owner can check usage on the Vercel dashboard; neither "set up" nor "not set up".

Status: **Review** (2026-11-22): the wording task is done, `e3922a7` (see the end of this section). `-f2` read back, read-only, what the API shows: Vercel PR comments off (`onPullRequest` and `onCommit` false); the Ignored Build Step is `test ! -f package.json`; the WAF rule is enabled with no pending changes (`/api/image`, fixed window 30 requests per 60 s per IP, deny for 1 minute), and its test (40 GETs, the first 30 answered by the proxy with its 403 `forbidden_origin`, the 31st on denied with `x-vercel-mitigated: deny` and the body "Forbidden", the block gone about 63 s later) agrees; the bypass secret is gone; fork protection is on; the Toolbar and Web Analytics are off; the team plan is Hobby. **Nobody can read** the usage alerts (the API doesn't expose them, and Hobby has no Spend Management: a limit that is hit pauses the project, with no bill, and usage emails are account notifications set in the dashboard), the account's 2FA, or whether Speed Insights is off (its object carries an id but no on or off date). Ícaro says he did them; he confirms those three by eye (Settings, Notifications; Security; the project's Speed Insights toggle). What is left for a lane: the README and `docs/hosting.md` sentence on usage alerts is reworded to what is true (Hobby pauses the project when a limit is hit; nothing promises alerts the maintainer's account may or may not send), with BMI-080.

Not everything here has to be done before the repo is public. The flip doesn't depend on Vercel. What matters is the first official production deploy, the merge of PR #2 (D-005, D-017), which now comes before the flip. Split, nothing dropped:

Before the merge of PR #2 (the real build goes to production; the alias already serves an earlier build, D-016):
- [x] Vercel account: 2FA on (Ícaro, by hand; his word, nobody can read it).
- [x] The "Protection Bypass for Automation" secret that `vercel curl` created is revoked (Ícaro; existence checked by `-f2`).
- [x] The WAF rate-limit rule on `/api/image` is published and active (read back by `-f2`).
- [x] Vercel project settings from BMI-003 (read back by `-f2`, 2026-11-22): the environment variables, the WAF rate-limit rule, the Toolbar and Web Analytics off. Usage notifications are on (Ícaro's word; nobody can read them). **Speed Insights is not confirmed off**: Ícaro wants page-view metrics on the hosted site, so the decision is Q-018 and nothing changes meanwhile.
- [x] Each README or `docs/hosting.md` claim that only the platform can make true is checked against the platform, or reworded (quality lane). Two parts:
  - Ready now, no Vercel setting needed: the 1-hour request-log retention on Hobby and the 4.5 MB request and response body limit, checked against Vercel's current documentation (cite the page and the date) and against what `docs/hosting.md` and the README say; reworded where they differ.
  - Done by the quality lane and approved by the opus reviewer (commit requested from `-5b`; PM didn't re-check the Vercel citations): the 1-hour log retention and the 4.5 MB body limit (streamed responses excepted) agree with Vercel's documentation, and `MAX_BYTES` 4,400,000 matches `config.ts` and `app.ts`.
  - Three small follow-ups from the reviewer, same kind of work: (1) `docs/hosting.md` says to keep `MAX_BYTES` "below 4.5 MB"; since the limit doesn't apply to streaming, either drop "below 4.5 MB" or give the reason. (2) The README's sentence that "the proxy refuses a larger image itself" is exact only when the size is declared: it is a 413 when the declared size is over the cap, and an aborted stream when an undeclared body passes it (the client sees a failed download); reword. (3) The comment in `server/proxy/config.ts` above `DEFAULT_MAX_BYTES` ("Just under Vercel's 4.5 MB function response limit, which also counts headers") contradicts the documentation; correct the comment (server lane, comment only, no behavior change).
  - Done by the quality and server lanes, approved by the reviewer (commits requested from `-5b`): the `hosting.md` wording, the README sentence on a 413 and an aborted stream, the rate-limit sentence ("active, 30 requests per 60 seconds per IP", not promising that it fires) and the `config.ts` comment. Two small wording follow-ups from the reviewer, same file: the README's "an aborted stream when an undeclared body passes it" is narrower than the code, because `limitBytes` also cuts a body with a declared size under the cap that grows past it, so it says "when the body grows past it"; and the "scripted abuse meets a rule… active at" sentence reads harshly, so it becomes "runs into a rate-limit rule… set to 30 requests per 60 seconds per IP".
  - New, from `-f2` and the dispatcher: a short maintainer rule in `docs/hosting.md`, without the app URL: authorize a fork PR's deployment on Vercel only after reading its diff, above all `vercel.json`, `api/`, `server/` and `package.json`, because authorizing runs the fork's code in the build with the environment variables. Quality lane, doc only; `CONTRIBUTING.md` is for contributors and doesn't carry it.
  - One test to back the README sentence (reviewer, via the dispatcher; server lane, test only, no behavior change): `server/proxy/app.test.ts` covers a declared `Content-Length` over the cap (413) and an undeclared body that passes it (aborted stream), but not a body that declares a size under the cap and then sends more bytes, which `limitBytes` cuts and the README now describes ("when the body grows past it"). Add that case, for example declare 8 bytes and send 17 and expect `arrayBuffer()` to reject.
  - Still open on this item: the usage-alert claim (the README says "planned") until the alerts are set.
  - Checkable now: the rate-limit claim (the rule is active and the test shows it fires, BMI-003) and the usage-alert claim, worded only with what is true: Hobby pauses the project when a limit is hit, with no bill, and nothing promises alerts (Ícaro turned usage notifications on, but nobody can read that setting). The README must not claim analytics are off beyond what Q-018 leaves; line 80 ("No analytics cookies, no tracking pixels") stays true while everything is off.

After the flip, which now follows the merge (they only exist on a public repo; they are the BMI-050 list):
- [x] (done in BMI-050, except what waits for the merge: CodeQL, and BMI-076 for the two workflows) GitHub Actions and security settings: private vulnerability reporting, push protection, CodeQL default, fork PR workflows needing approval, the `main` ruleset, scorecard and dependency-review.

Closed on the PM side (2026-11-22): the usage-alert sentence is committed as `e3922a7` (`docs/hosting.md`, caveat 3, one line), approved by the opus reviewer: it says neither that an alert exists nor that it doesn't ("The project does not depend on any usage alert, and the owner can see the usage on the Vercel dashboard"), agrees with the plan table and with the README's "pauses instead of billing", and `grep -i alert` finds only that line in the README and `docs/hosting.md` (PM confirmed). Ícaro's own items are done by his word (Vercel 2FA, usage notifications; nobody can read them). Left outside this item: whether Speed Insights is off is Q-018 (his decision on page-view metrics); CodeQL waits for the merge of PR #2 and the scorecard and dependency-review workflows are BMI-076. `Review` until PR #2 merges.

### BMI-070 — what is left (D-011)

Community files are in. Left is GitHub settings, which `-5b` applies now (D-011): labels, squash-only merges, delete branch on merge, suggest updating PR branches.

- [x] Labels created; squash-only merges, delete-branch-on-merge and "suggest updating PR branches" are on. `-5b` read them back with `gh api` and found them already applied (labels: accepted, accessibility, bug, documentation, duplicate, effect, enhancement, good first issue, help wanted, needs-info, needs-triage, out-of-scope).
- [ ] The default squash commit message is the pull request title only (`squash_merge_commit_message` is `PR_BODY` today; the title-only value is `BLANK`). It is in the approved community package ("default message 'Pull request title'", D-004) and `CONTRIBUTING.md` already tells contributors the PR title becomes the commit on `main`; release-please and the title check depend on it. Applied by `-5b` with `gh api`, then read back.
- [ ] Saved replies added by Ícaro by hand (a per-user setting, not available through the repo API).

### BMI-077 — CodeRabbit's findings on PR #2

CodeRabbit reviewed PR #2 on 2026-11-22: one review, 10 inline comments and 2 outside the diff (12 findings: 2 Major, 8 Minor, 3 Trivial counting the two outside the diff, per `-5b`). PM read the inline comments on GitHub. The merge waits for these (D-013, D-018). Each fix goes on the branch, each finding gets an answer on the PR (fixed, or why not), and findings that change scope go to Ícaro (Q-015), never applied silently. None of the fixes touches a shared-lock file.

Corrections inside what the README already promises (no scope change):
- [x] **Major**, quality lane: `scripts/check-licenses.mjs` drops parentheses when it evaluates a license expression, so `(MIT OR Apache-2.0) AND GPL-3.0-only` passes on `MIT`. Keep the grouping and operator precedence (CodeRabbit suggests a parser such as `spdx-expression-parse`; check the project's dependencies first) and add a test that rejects that expression.
  - Delivered by the quality lane, in the opus reviewer's hands (2026-11-22, per `-75`): a hand-written SPDX evaluator of about 40 lines (grouping, `AND` before `OR`, `WITH` counted as the base license, a malformed expression fails closed) and 21 new tests in `check-licenses.test.ts` at the repo root; `(MIT OR Apache-2.0) AND GPL-3.0-only` is rejected; the real tree still passes (49 production, 148 total). It also turns lower-case `or` and `and` into errors.
  - **PM's decision:** use a maintained SPDX parser instead of the hand-written one, under the project's rule to prefer a mature library and to write from scratch only for an explicit reason (CLAUDE.md, principles 5 and 6), and because this is a license-policy gate. `spdx-expression-parse` isn't in the tree, so it becomes a direct dev dependency: pick a version published at least 7 days ago, check that a clean `pnpm install --frozen-lockfile` still passes (no build script, `allowBuilds` untouched), keep the 21 tests as the specification, and keep only the small evaluation of the allowlist over the parsed expression. `package.json` and `pnpm-lock.yaml` are lock files: the dispatcher takes the lock for it. The parser decides about lower-case operators.
  - Was blocked on a policy question (Q-017), answered by D-026: CC-BY-3.0 is accepted for development tools only; the prepared parser swap goes in (see below).
- [x] **Major**, ui lane: `src/ui/editor.ts` around line 106 (outside the diff): a slower, older image load can replace the current one. A load that is no longer the latest is dropped.
- [x] **Minor**, ui lane: `src/ui/editor.ts` line 178: the download reads the file name after the encode `await`; another load can change it meanwhile, so the name can belong to another image. Read it before the await.
- [x] **Minor**, ui lane: `src/ui/editor.ts` line 189 (outside the diff): the export format is read after encoding starts; snapshot it before.
- [x] **Minor**, ui lane: `src/i18n/index.ts`: a failed dynamic import of a locale makes `setLocale` reject, and `src/main.ts` awaits it before mounting, leaving a blank page. Keep the current locale and mount.
- [x] **Minor**, ui lane: `src/input/decode.ts`: the resize `createImageBitmap` has no error handling, so a failure shows the generic error and leaks the source bitmap. Turn it into `decode_failed` and release the bitmap.
- [x] **Minor**, ui lane: `src/input/url.ts`: a timeout on the direct fetch (the size cap is Q-015, part 2).
  - Delivered by `-cc` as `AbortSignal.timeout(10_000)` on the whole request, body included; the opus reviewer found that too tight: on a 2 Mbit/s mobile link 10 s reads about 2.5 MB, so a normal 5 to 8 MB photo from a site that allows CORS would fail with the wrong message ("the site took too long"), in a case that works today, and the direct path would be stricter than the proxy fallback. **PM's decision (the reviewer's design):** the 10 s timeout covers only the wait for the response headers (an `AbortController` with `setTimeout`, cleared once the headers arrive), plus a long total cap, `AbortSignal.any([headers.signal, AbortSignal.timeout(60_000)])`, to revisit if Ícaro sets a size cap (Q-015). The "hangs on the body" test stays valid against the long limit. A timeout does **not** fall back to the proxy: a refused CORS request fails fast as a `TypeError`, the proxy has the same 10 s budget and would double the wait, and the fallback would spend the WAF quota. This is the timeout-only default of Q-015, with a better shape; it adds no size limit.
- [x] **Minor**, ui lane (found by the reviewer, outside CodeRabbit's list): `src/ui/LanguageSelect.vue` line 16: after a `chooseLocale` that fails, the `<select>` keeps showing the new choice because `:value="locale"` didn't change, a silent mismatch. `chooseLocale` returns a boolean and, on `false`, the select goes back to the current locale.
- [x] **Trivial**, server lane, tests only: `server/proxy/app.test.ts` adds redirect-hop cases for each guard the first hop enforces (port, credentials, internal addresses); `server/proxy/config.test.ts` adds `*` and `https://a.example,*` to the `ALLOWED_ORIGINS` rejection cases.
  - Delivered by `-f2`, in review (per `-75`): 9 first-hop redirect cases and 1 later-hop case pass (`app.ts` already re-checks every hop), `*` and `https://a.example,*` are rejected, and a one-line comment in `app.ts` says the WAF rate limit is the limit for non-browser clients.
  - **PM's decision on empty entries:** keep the behavior. `parseOrigins` drops empty entries, so `https://a.example,` is `["https://a.example"]` and `,` is no origin at all; neither widens access, and rejecting would make a stray trailing comma break a deployment's variable. The test that documents "empty entries are ignored, not accepted as origins" replaces the rejection case; no change to `server/proxy/config.ts`.
- [x] **Trivial**, no code: `server/proxy/app.ts`: the same-origin gate doesn't stop a non-browser client that sends the header, so the rate limit is what limits it. Answer on the PR: the WAF rule (30 requests per 60 s per IP) is that limit. If the code comment or `docs/hosting.md` doesn't say this, add one sentence.

All of it is committed on the branch (local, not pushed until `-aa` says), each commit verified by the dispatcher and approved by the opus reviewer (2026-11-22); PM confirmed the five commits exist and that `src/input/url.ts` carries `MAX_DIRECT_BYTES = 104_857_600`: server `9828aa7` (redirect-hop and `ALLOWED_ORIGINS` tests, the `app.ts` comment); quality `745c2fa` (the hand-written license evaluator) replaced by `42fc557` (the `spdx-expression-parse` swap: `package.json`, the lockfile with three packages and no install scripts, CC-BY-3.0 allowed for development tools only and tested); ui `b3ca37f` (the three `editor.ts` fixes, `i18n/index.ts`, `decode.ts`, the two-phase timeout, `LanguageSelect.vue` and their tests) and `0209c48` (the 100 MiB cap, with `too_large`). `Review` until PR #2 merges. Still to post on the PR: the replies for the license check and the direct fetch, after these commits are pushed.

Decided by Ícaro (D-025, D-026; relayed by `-aa`), now part of this item:
- [x] **Size cap on the direct fetch** (`src/input/url.ts`, ui lane): **100 MiB, 104,857,600 bytes**, on top of the timeouts already there. Why this number: the cap exists to refuse an absurd download, not an image the app opens today. The editor has no size limit on local files and downscales anything above the GPU's `MAX_TEXTURE_SIZE`, so a normal phone photo (3 to 12 MB), a high-resolution JPEG or a large PNG screenshot (up to about 60 MB) must pass; 100 MiB is about 23 times the proxy's `MAX_BYTES` (4,400,000, a limit that exists for Vercel's response rules, and which the direct path doesn't share) and well above those files. On the 60 s total timeout, a 100 MiB body also needs about 14 Mbit/s to finish, so a slow link hits the timeout first, which is coherent. When the response declares a `Content-Length` above the cap it is refused before any body is read; without one, the body is counted as it streams and aborted at the cap. The error is the existing `too_large` code, already translated in `en` and `pt-BR`. Tests: a declared size above the cap, an undeclared body that passes it, one just under it that loads, and the timeout case still valid.
- [x] **License check with a maintained SPDX parser** (quality lane): the prepared swap to `spdx-expression-parse` (and `spdx-exceptions`, CC-BY-3.0) goes in; the rule "CC-BY-3.0 only for development tools" is explicit in `scripts/check-licenses.mjs` and tested (a production dependency under CC-BY-3.0 fails). `package.json` and `pnpm-lock.yaml` are lock files; a clean `pnpm install --frozen-lockfile` is checked on a clean copy before the commit.
- [x] **release-please**: the first release PR is closed and reopened by hand to start its checks; no secret, workflow unchanged. Noted for the maintainer, nothing to build.
- [x] **Tagline**: unchanged, as Ícaro approved it; the PR answer explains.

The checks (Verify, E2E Chromium, Conventional Commits title) must be green after the fixes. Who answers each CodeRabbit comment on the PR is for `-aa` to name: `-5b` doesn't answer PR comments today, and the lanes don't run GitHub actions. Each answer says what was fixed, or why not.

Added after CodeRabbit's third round (2026-11-22, per `-5b` and `-75`; PM didn't read the comment): one new finding, Minor, and no other. The race was already noticed by the opus reviewer when it approved the ui commit (a slow first load of `pt-BR` can finish after the user picked `en`; only on the first `pt-BR` load; it didn't block then and was not tracked).
- [x] **Minor**, ui lane: `src/i18n/index.ts` around line 36: stale locale loads must not win. If a language switch is still loading and the user picks another, the older load can finish last and apply its locale, page title and saved preference while the select shows the newer choice. `setLocale` keeps a counter of the latest selection and returns `false` for a superseded one, so `chooseLocale` doesn't persist it and `LanguageSelect.vue` returns to the active locale. Tests: in `set-locale.test.ts`, a slow load overtaken by a fast one (the last choice wins, and it is the saved preference), plus the existing failed-load case; one e2e case in `e2e/i18n.spec.ts` if it can be made stable (not required). No lock files; the initial JavaScript budget has 1.5 kB of room, and `pnpm size` still has to pass.
  - Delivered as `785982f` (`src/i18n/index.ts`, `LanguageSelect.vue`, `set-locale.test.ts`, `e2e/i18n.spec.ts`; PM confirmed the commit and its four files), approved by the opus reviewer (three runs in random order; paths with 1, 2 and 3 selections; a stable e2e) and verified by the dispatcher: 295 tests, e2e 37/37, size 43.54 of 45 kB and 192.56 of 195 kB. The reviewer's note: the guard in `LanguageSelect` (it puts the select back only if it still shows that call's choice) can only be observed with a third language loaded on demand, so with `en` and `pt-BR` it has no test of its own.
### BMI-079 — Privacy notice under the link field

As a user pasting a link, I want to be told that the link goes through a server so that I don't assume the "never leaves your browser" promise covers it. D-028 (relayed from Ícaro): `en` "Links are fetched through our server. Files you open, drop or paste never leave your browser."; `pt-BR` "Links são buscados pelo nosso servidor. Arquivos que você abre, solta ou cola nunca saem do seu navegador." Lane ui, in PR #2, no new scope (the README already says links go through the proxy). Goes together with the locale-race fix already in BMI-077.

- [x] The notice sits under the link field, in both locales, from the message files (no inline text), with a style that matches the rest of the page.
- [x] Assistive tech: the text is tied to the field (`aria-describedby`), not only visual; the axe e2e still passes at WCAG 2.2 AA, with the contrast checked.
- [x] A unit test for the component and an e2e that finds the notice in `en` and `pt-BR`.
- [x] The README's privacy text mentions the notice, and the key-parity test, `pnpm check`, the unit and e2e suites and `pnpm size` pass (1.5 kB of room in the initial JavaScript).

Delivered as `88a920a` (`en.json`, `pt-BR.json`, `ImageInput.vue`, `image-input.test.ts` and `e2e/link-notice.spec.ts`) and `107808f` (the README's privacy section cites the notice). PM confirmed the commits, the exact texts in both message files, `aria-describedby="image-url-notice"` on the field and the new unit and e2e tests. Gate run by the dispatcher on the committed state (per `-75`): `pnpm check` clean (105 files), 299 tests, Chromium e2e 41/41, including `e2e/link-notice.spec.ts` with the axe `color-contrast` rule run on `#image-url-notice` in both themes (and the test confirms the rule was evaluated), and the existing WCAG 2.2 AA test on the start screen; contrast measured by the dispatcher and the reviewer: 5.93:1 in the light theme (`#5f5f5a` on `#f6f6f4`) and 7.14:1 in the dark one (`#a3a39d` on `#161615`); size 43.61 of 45 kB initial and 192.68 of 195 kB total; no new dependency. `Review` until PR #2 merges.

### BMI-080 — The rate limit is Vercel's, not the proxy's

The 30 requests per 60 s limit is a WAF rule on Vercel; the proxy code has none. Quality lane, docs only, in PR #2.

- [x] `README.md` and `docs/hosting.md` say that the limit exists only on Vercel and that anyone running the Node entry or the Docker image has to put their own limit in front.
- [x] The result of the WAF test is recorded in `docs/hosting.md`: 40 GETs, the 31st was denied (`x-vercel-mitigated: deny`), the block lasted about a minute and lifted by itself (per `-aa`; the test was run by `-f2`).
- [x] No claim says the proxy limits requests by itself.

Delivered as `34f304f` (`README.md`, `docs/hosting.md`; PM confirmed the commit and that the diff says the rule exists only on Vercel, that the proxy code has no limit of its own, that the image has none either, and records the 40-GET test). Approved by the reviewer, per `-75`. `Review` until PR #2 merges. It does not touch the usage-alert sentence of BMI-073.

### BMI-081 — What the user sees when the rate limit denies

When the WAF denies, Vercel answers with plain text "Forbidden", not the proxy's JSON error, so the front may show only a generic error. Ui lane. A shared address (a school, a carrier NAT) can reach 30 requests per minute for several people.

- [x] Read how `src/input/url.ts` and the error mapping handle a non-JSON 403 from `/api/image` (a cross-site 403 from the proxy is JSON with a code); describe what the user sees today.
- [x] Propose a message for "too many requests" through an i18n error code, `en` and `pt-BR` (Ícaro corrects `pt-BR` strings, so the proposal is shown to him before it merges), and the change that tells the two 403s apart; no new library.
- [x] A test for the denied case, and a sentence in `docs/hosting.md` about shared addresses. If telling the two apart needs a change in the proxy's contract, stop and ask before doing it.

Delivered by `-cc` and verified by the dispatcher (2026-11-22, per `-75`; not committed yet, with the opus reviewer; PM hasn't read the code): `src/input/url.ts` turns a proxy answer with status 429, or with the header `x-vercel-mitigated: deny`, into the error `rate_limited`, checked before the body is read; a plain-text 403 without that header stays `load_failed`, so the app never says "too many requests" by mistake; the proxy's own JSON 403 with its code works as before; nothing changes in `server/` or in the proxy's contract. Proposed messages, for Ícaro to correct the `pt-BR` before the merge: `en` "Too many requests from your network right now. Try again in about a minute."; `pt-BR` "Muitas solicitações vindas da sua rede agora. Tente de novo em cerca de um minuto." Gate: check clean, 303 tests, e2e 42/42, size 43.69 of 45 kB initial (1.31 kB of room) and 192.8 of 195 kB. The quality lane writes the shared-address sentence in `docs/hosting.md` in one pass with the usage-alert sentence of BMI-073.

Committed (2026-11-22, local on the feature branch): `3aa1445` (`url.ts`, `url.test.ts`, `en.json`, `pt-BR.json`, `e2e/input.spec.ts`) and `a9f8966` (README and `docs/hosting.md`: the shared-address sentence, and that the app recognizes the block only when the proxy is on the same origin). Gate on the last state, per `-75`: check clean in 105 files, 303 tests, e2e 42/42, size 43.69 of 45 kB initial (1.31 kB of room) and 192.8 of 195 kB. The reviewer's decisions: the `429` branch stays (the proxy never returns 429; Vercel Hobby denies with a 403 plus the header because a 429 opens an upgrade notice; a limiter of one's own usually answers 429 or 503); a `x-vercel-mitigated` header with another value (such as `challenge`, from attack or bot modes) stays `load_failed`, so the app never says "too many requests" falsely; the recognition holds only with the proxy on the same origin, which is documented. Two optional observations not applied, no urgency: cancel the response body in the block branch (as `readDirect` does) and rewrite the "plain text" comment in `url.ts` near line 96. The `pt-BR` text still needs Ícaro's eyes before the merge (the reviewer's variation: "Tente de novo daqui a um minuto"). `Review` until PR #2 merges.

### BMI-076 — Scorecard and dependency-review workflows

Split out of BMI-050's post-flip list (same scope, now trackable; the `Must` count goes from 45 to 46). Quality lane, in a PR of its own after the merge of PR #2: `main` takes changes only through PRs, the workflows need the code on `main`, and PR #2 shouldn't grow. Not assignable before that merge.

- [ ] A dependency-review workflow on pull requests, using `actions/dependency-review-action` (a GitHub action, allowed), pinned by full SHA, `permissions` minimal, `persist-credentials: false`, timeout, concurrency, like the existing workflows.
- [ ] A scorecard workflow with `ossf/scorecard-action`, pinned by SHA, only once Ícaro adds it to the Actions allowlist (Q-012); until then the item is half done on purpose.
- [ ] Both pass the existing workflow audit (zizmor) and appear as checks without being added to the required ones unless Ícaro says.

### BMI-050 — Go-public checklist

Ícaro's answer is yes (D-013). Order set by D-018 (relayed by `-aa`): rewrite the history, flip with `-aa`'s explicit go, protections, `.coderabbit.yaml`, PR #2 ready with a CodeRabbit review, corrections, merge. CodeRabbit's Free plan does no line-by-line review on a private repo; the open-source plan, for a public one, does. The public `main` shows the old README until PR #2 merges.

Before the flip (repo private):
- [x] Full-history `gitleaks` over every branch clean: 64 commits, 2026-11-22 (quality lane, re-run by the dispatcher). `check-licenses` and `check-dist` pass; no token, Vercel identifier, `.env` or `.local/` tracked; no AI trailer. Run again after the rewrite.
- [x] `SECURITY.md` and `CODE_OF_CONDUCT.md` committed with the contact from D-007 (`d6f67e1`). `CLAUDE.md` and `.claude/` stay (D-008) and the three skills may be published (D-014).
- [x] Third-party license notices in the bundle (BMI-052); README status line, contributing links and wording match what shipped (BMI-051, `Review`).
- [x] The Vercel project's Ignored Build Step is `test ! -f package.json` and `-f2` read it back (D-019); the `main` push built nothing and the alias stayed.
- [x] History rewritten to the GitHub no-reply address (D-015), executed by `-5b` and verified by `-aa` on 2026-11-22: only the no-reply address on the remote (87 commits), trees identical to the backup, `main` pushed after the Ignored Build Step (the build was skipped, the alias stayed). Old-to-new hash map in `.local/rewrite-map-old-new.txt`; hashes in `docs/product/` corrected from it (PM). PR #1 was closed by GitHub during the push and can't be reopened; PR #2 (draft, `feat/scaffold-and-proxy` to `main`, same head) replaces it. Everything below that says PR #2 means the PR for this branch. `-aa` gave `-5b` the flip go, conditional on `gitleaks` at the new HEAD, the new PR opened and the description and topics applied (done by `-5b`: description A and 11 topics).
- [x] Repo description and topics (approved, D-017) applied by `-5b` (per `-5b`: description A and 11 topics; PM hasn't read them back). The social preview image is uploaded by hand by Ícaro.
- [ ] BMI-070 settings (D-011 applied; saved replies by Ícaro, not blocking).
- [x] The WAF rate-limit rule on `/api/image` is published and `-f2` read the active rule back (2026-11-22). It was moved ahead of the flip because the proxy address is easy to find once the repo is public.
- [x] `-5b` reported on the rewrite to `-aa`, who verified it.

The flip:
- [x] The new PR is open (PR #2, draft, replaces the closed PR #1) and `-aa` gave `-5b` the go.
- [x] **The repository is public** (2026-11-22, by `-5b`; Ícaro confirmed the flip directly in `-5b`'s session; `-aa` confirmed it without a login and PM read `visibility: PUBLIC`, the description and 11 topics, and the secret-scanning settings). Ruleset `main` is active with no bypass and requires Verify, E2E (Chromium) and the Conventional Commits title; private vulnerability reporting is on. The URL stays out of the README and marketing until Ícaro says (D-016).

After the flip, in this order (state per `-5b`, partly read back by PM):
- [x] Vulnerability reporting, secret scanning and push protection are on (PM read secret scanning and push protection as enabled; the private-reporting switch isn't in that response, so it rests on `-5b`'s word). Dependabot security updates are enabled.
- [ ] CodeQL default setup: only after the merge of PR #2, since `main` has no code today.
- [x] Ruleset on `main` active (PM read it): a pull request is required for every change to `main`.
- [x] Fork PR workflows need approval from all external contributors (per `-5b`).
- [ ] Scorecard and dependency-review workflows: tracked as BMI-076, in a PR of their own after the merge so PR #2 doesn't grow.
- [x] Vercel Git fork protection is on (`gitForkProtection` true, read by `-f2`, read-only, 2026-11-22): a fork PR's build waits for a team member's authorization and gets no environment variables before it. `MAX_BYTES`, `PROXY_TIMEOUT_MS` and `ALLOWED_ORIGINS` exist only in production and preview, as sensitive, with no branch scope. Not tested with a real fork PR.
- [ ] `.coderabbit.yaml` committed on the feature branch, so it goes through PR #2 (configuration only, no secret, `drafts: true` so CodeRabbit reviews while the PR is a draft; `-f5` proposes it, the quality lane commits through `-5b`).
- [ ] BMI-073 pre-merge items done (Vercel 2FA, usage alerts, the platform claims checked; the bypass secret is revoked and the WAF rule is active).
- [x] CodeRabbit reviewed PR #2 line by line after the filters (per `-aa`; the open-source plan covers it; reading the dashboard is Ícaro's) while the PR was a draft (`drafts: true`). Original line: It first skipped the PR for size (134 files against the free plan's 100); the `.coderabbit.yaml` of `57e170d` filters out `docs/`, `marketing/`, `.claude/`, markdown and `public/`, and the status now reads "Review in progress" (D-023, per `-5b`). The PR leaves draft only when `-aa` says; the merge needs green checks, because `main` requires them.
- [ ] CodeRabbit's review answered and the corrections committed, checks green. Findings that change scope go to Ícaro, never applied silently.
- [ ] Merge PR #2 (authorized by Ícaro only after the line above). It is the first official production deploy (D-005, D-013); the items in `Review` become `Done` against `main`; the link unfurl check of BMI-003 follows.
- [ ] 3 to 5 good first issues, and the first tagged release (BMI-071).

Residual, recorded: the pre-rewrite SHAs may stay fetchable on GitHub (accepted, D-021); the local `backup/pre-rewrite-*` tags and `.local/rewrite-map-old-new.txt` still hold the old address, on disk only (no tag is on the remote); the repo's public `main` shows the old README until the merge.

### E7 progress notes (2026-11-22, earlier; the later notes below supersede these where they differ)

What is committed on `feat/scaffold-and-proxy`, and what is still open per item:

- **BMI-002 CI:** `ci.yml` is written but not committed; the git-owner session commits it once `test:coverage` and `size` exist in `package.json`.
- **BMI-060 quality bar:** `docs/quality.md` is in (`1efaf03`). Still open: tsconfig flags, Biome rules and folder boundaries, coverage thresholds, kebab-case rename.
- **BMI-066 supply chain:** Dependabot, `security.yml`, `scripts/check-licenses.mjs` and `scripts/check-dist.mjs` are in (`1efaf03`, `6217fc6`). Still open: `pnpm-workspace.yaml` with `minimumReleaseAge: 10080`, `trustPolicy: no-downgrade`, `strictDepBuilds`, `blockExoticSubdeps` and an empty `allowBuilds`. **Target date 2026-11-28, no exception list.** It can't go in earlier: 40 packages already in the lockfile are younger than 7 days, and the newest (`undici` 8.13.1) turns 7 days old around 2026-11-27 22:00 UTC. Until then pnpm 12's default (1 day) applies. Draft: `.local/standards/drafts/pnpm-workspace.yaml` (git-ignored).
- **BMI-070 community files:** `CONTRIBUTING.md`, issue forms and the PR template are in (`83b5515`). Still open: labels, merge settings (squash only, delete branch on merge, suggest updating PR branches) and saved replies, all done in GitHub's settings.
- **BMI-071 releases:** release-please config, manifest and workflow are in (`83b5515`). The Conventional Commits check on the PR title landed in `a7880c6`. Nothing open in the repo; the first tagged release is part of BMI-050.
- **BMI-072:** `CODE_OF_CONDUCT.md` and `SECURITY.md` are in with the `<CONDUCT_CONTACT>` placeholder; replaced by the contact in D-007 (Q-003 closed, 2026-11-22), edit pending the git owner's commit.
- **BMI-040 to BMI-044 i18n:** committed as `b010671`. Ícaro reviewed `pt-BR.json` and changed the tagline and the drop overlay text (`fbf8779`), so the review condition on BMI-042 is met. It stays `Review` like the rest until PR #2 is merged to `main`. The `define` flags in `vite.config.ts` and the default `locale: "en-US"` in `playwright.config.ts` ride along with the frontend session's config commit.

### E7 progress, later on 2026-11-22

Committed on `feat/scaffold-and-proxy` by the git-owner session: the frontend standards package (`6039522`), page headers in the Node entry (`a49e2ac`), layout doc (`f1cca03`) on top of the earlier community and CI files. PM spot-checked each item in the code (greps for the key behaviors, plus running `pnpm size`), but did not audit every acceptance criterion; the reviewer lane or the PR review does that.

- **BMI-060 → Review.** Biome strict rules and folder boundaries, tsconfig flags, coverage thresholds, `docs/quality.md` linked from the README.
- **BMI-061 stays `In progress`.** The engine loads lazily, but `pnpm size` fails: initial JS is 43.21 kB brotli against a 35 kB budget, and all JS except the WebP encoder is 192.22 kB against 180 kB. Ícaro chose to precompile the i18n messages to cut it (D-006). BMI-002 (`ci.yml`) is on hold until `pnpm size` is green.
- **BMI-062, 063, 064 → Review.** Security headers on every proxy response, image type allowlist with 415, fixed outbound headers, `address.ts` split from `node-fetch.ts`, Docker base image pinned by digest, `maxDuration: 15`, Node entry applying the page headers.
- **BMI-065 → Review.** `security-headers.ts` as the single source, `vercel.json` kept in sync by a test, e2e running under the CSP, `credentials: "omit"` on remote fetches.
- **BMI-067 → Review.** Privacy e2e (same-origin, no cookies, no CSP violations), metadata stripping e2e for PNG, JPEG and both WebP encoders, proxy privacy checks in `app.test.ts`.
- **BMI-068 → Review.** axe at WCAG 2.2 AA, single-key shortcuts only with image focus, a click without drag paints one dab.
- **BMI-069 → Review.** README states the Vercel request-log caveat and the shortcut focus rule.

### BMI-060 — committed (2026-11-22)

The server tsconfig flags (`noUncheckedIndexedAccess`, `noImplicitOverride`) landed as `f5036ad` on top of `6039522`. `Review` until PR #2 merges to `main`.

- [x] `tsconfig.server.json` sets both flags and `pnpm check` passes with them.
- [x] Committed by the git owner (`f5036ad`).

### BMI-061 — committed (2026-11-22)

Watch (2026-11-22, per `-75`): after the BMI-077 fixes the margin under the budgets is 43.48 of 45 kB initial (1.5 kB left) and 192.5 of 195 kB total (2.5 kB left). The next UI feature will need attention; any raise of the budgets is Ícaro's (D-009).

Committed as `9025852`: i18n messages precompiled (47.0 → 43.2 kB initial). Ícaro accepted budgets of 45 kB initial and 195 kB total instead of 35 / 180 kB (D-009, relayed). `Review` until PR #2 merges to `main`. Owner was the frontend session (D-006).

- [x] `pnpm size` passes: initial JS ≤ 45 kB brotli and all JS except the WebP encoder ≤ 195 kB (PM re-ran 2026-11-22: 43.21 and 192.22 kB).
- [x] i18n messages precompiled at build time (`9025852`); `pt-BR` still loads as its own chunk; Chromium e2e passes (PM ran 2026-11-22: 35/35 on the second and third runs; the first run failed and was not diagnosed).
- [x] The WebP encoder is loaded only through `import()` (`src/export/encode.ts`), and the renderer and effect code load through `import()` in `src/engine/load-renderer.ts` (reported by `-cc`, PM spot-checked both lines).

### BMI-052 — pre-flip audit run

Split out of BMI-050 so a worker can do the read-only part. It doesn't depend on BMI-070: what's left there is GitHub settings, which a read-only audit doesn't need (dispatcher's question, 2026-11-22). Flipping the repo public stays with Ícaro under BMI-050.

- [ ] `gitleaks` over the full history of every branch is clean (report the command and the commit count).
- [ ] `dist/licenses.md` exists after `pnpm build` and lists every package bundled into the shipped client; `scripts/check-licenses.mjs` and `scripts/check-dist.mjs` pass.
- [ ] Each claim in the README (formats, shortcuts, privacy, proxy limits, effects, languages) is checked against the code and the e2e specs; every mismatch is reported with file and line, not silently fixed.
- [ ] No file under the repo, committed or not, contains the maintainer's email, a token or a Vercel team identifier.
- [ ] Report written to the dispatcher; no files changed.

### BMI-051 — README and docs match what shipped

Committed as `04dfa46` (`README.md`, `docs/hosting.md`, `index.html`), verified by the dispatcher and approved by the opus reviewer; PM spot-checked README lines 3, 30 and `index.html` line 6 and found no "open source" wording left in README or hosting.md. `Review` until PR #2 merges to `main`.

Reopened by D-010 and committed as `ccef665` (`README.md`, `index.html`, `en.json`, `pt-BR.json`); verified by the dispatcher (check, 229 unit tests, e2e 35/35, size 43.24 / 192.26 kB) and approved by the opus reviewer. PM confirmed the commit touches those four files on the branch. `Review` until PR #2 merges to `main`.

- [x] `README.md` line 3 and the `index.html` meta description say "Image files you open, drop or paste never leave your device."
- [x] `app.tagline` in `en.json` ("…Image files never leave your device.") and `pt-BR.json` ("…Os arquivos de imagem nunca saem do seu navegador.").
- [x] `README.md` line 99: "at the loaded image's resolution" and "The blur size is defined in source-image pixels, never screen pixels".

Done after `Review`:
- Ícaro read and approved the `pt-BR` tagline as committed (relayed by `-aa`, 2026-11-22; the reviewer's "Seus arquivos…" variant is not used). Logged in D-010.

Marketing text that quoted the old tagline or the provisional sentence now matches D-010: `7ddf40f` (audience and three posts) and `0d37933` (pre-launch plan), approved by the opus reviewer after Ícaro's direct yes for those lines (relayed by `-aa`). PM spot-checked that the plan marks the tagline as settled by D-010 and found no old wording left under `docs/marketing` or `marketing`. Nothing open on this item except the merge of PR #2.

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
