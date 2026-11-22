# Decisions

Newest first. Each decision says what was decided, why, who decided and what it affects. Product scope decisions are Ícaro's.

## Open questions

Each question carries a recommendation and the default in force, so work doesn't wait on an answer. Ícaro overrides by saying so; no reply needed to keep the default.

### Q-001 — Localized URLs for SEO?

Default in force: **detection only** (built in BMI-041). `resolveLocale()` can take a URL source in front of it later.

Options: detection only, or a URL per locale (`/pt-br/`, `hreflang`, prerendered landing pages) so Portuguese pages can rank in Brazil.

Recommendation: decide together with the SEO work before launch (BMI-050), with `seo-specialist` sizing the prerender cost. Nothing in v1 gets harder either way.

### Q-002 — Marketing in Portuguese?

Default in force: **English only**, as the marketing skill says. The app itself is bilingual.

Recommendation: launch in English; once the app has real visits, add Portuguese posts and a Portuguese listing aimed at Brazilian communities, scoped by `marketing-strategist`. Keeps launch effort on one language.

### Q-006 — Do the Docker image and server bundle need license notices?

Audit finding C: `dist-server/node.js` bundles hono, `@hono/node-server`, ipaddr.js and undici, and the Dockerfile ships it, but only the client build emits `licenses.md`.

Default in force: **nothing added to v1.** The image is built in CI as an exit path and not published, and a hosted function isn't a distributed copy. The client bundle, which is distributed to browsers, already carries its notices.

Recommendation: before any Docker image is published or pulled by anyone else, add server-bundle notices (the same mechanism, written to `dist-server/`). It's cheap and removes the question. Adding it to v1 is Ícaro's call; say so and it becomes a `Should` item for the server lane.

### Q-005 — Hosted URL

The URL doesn't exist yet. Checked 2026-11-22 through the Vercel MCP: the Vercel account has one team and no project for this repo. Creating the project in BMI-003 produces the `*.vercel.app` URL. Then the README, the repo website field and the bug form get it. Not blocking before BMI-003. See [../tooling.md](../tooling.md).

## Decisions

### D-010 — Privacy wording and tagline say "image files" and match the URL proxy exception (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it ("ajustar tudo", PM did not hear it directly): the README and the `index.html` meta description say "Image files you open, drop or paste never leave your device." The `en` tagline changes to the same idea (for example "…Image files never leave your device."), and the `pt-BR` tagline is made consistent with the URL proxy exception. Translation files may be edited for this, through the ui lane. The final `pt-BR` wording is proposed by the PM and the worker and shown to Ícaro before the merge, since he corrected `pt-BR` strings before (`bbb060c`).
**Why:** "Images you open, drop or paste never leave your device" is ambiguous because opening a link goes through the proxy; the `en` tagline ("It never leaves your device") and the `pt-BR` one ("Ela nunca sai do seu navegador") state no exception at all.
**Decided by:** Ícaro, per the orchestrator session. Reversible. He then read and approved the committed `pt-BR` tagline (`758fc6b`) as it is, "Desfoque a imagem inteira ou como quiser. Os arquivos de imagem nunca saem do seu navegador.", and said not to switch to "Seus arquivos…" (relayed by `-aa`, 2026-11-22).
**Affects:** BMI-051 (criteria reopened), BMI-003 (meta tags and OG image use the final wording), `src/i18n/messages/en.json` and `pt-BR.json` line 4, `README.md` line 3, `index.html` line 6. Settles the "en vs pt-BR tagline" question that had been open since `bbb060c`.

### D-009 — Bundle budgets set to 45 kB initial and 195 kB total (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it (PM did not hear it directly): Ícaro accepts the `size-limit` budgets of 45 kB initial JavaScript and 195 kB for all JavaScript except the WebP encoder (brotli), replacing 35 kB and 180 kB. Closes Q-007.
**Why:** Vue (~26 kB) and vue-i18n's runtime (~16 kB) alone exceed 35 kB, so the old figure, measured before i18n existed, can't be met. The limits sit just above the measured 43.21 and 192.22 kB, so any growth is a visible decision. No feature is dropped. The README states no size figure; the budget came from the D-004 package.
**Decided by:** Ícaro, per the orchestrator session. Reversible.
**Affects:** BMI-061 (criterion rewritten to the new numbers), `docs/quality.md`, D-006 (which aimed at 35 kB).

### D-008 — `CLAUDE.md` and `.claude/` stay in the repo (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it (PM did not hear it directly): `CLAUDE.md` and `.claude/` stay in the repository. The `.gitignore` edit that ignored both is reverted by the git owner. This settles D-004 item 3.
**Why:** it was the mandatory "decide before going public" item; Ícaro chose to keep them. A minute earlier he had told the CodeRabbit session `-f5` it could remove them, then made keeping them his final answer.
**Decided by:** Ícaro, per the orchestrator session. Reversible while the repo is private. Once it is public, anything already in the history stays there unless the history is rewritten.
**Affects:** BMI-050 (checklist item closed), `.gitignore`. Licensing and provenance of the skills under `.claude/` (brandkit, design-taste-frontend, no-ai-slop) was the reason the item existed; this decision doesn't answer that, so BMI-052's audit record still lists it.

### D-007 — Code of conduct contact is set (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it: the `CODE_OF_CONDUCT.md` contact is the email address Ícaro named, replacing `<CONDUCT_CONTACT>`. The edit was made at 15:01 on his request through the `-f5` session; the git owner commits it. Closes Q-003. The address is deliberately not written in these docs.
**Why:** the placeholder blocked BMI-050. `SECURITY.md` needs no address (GitHub private vulnerability reporting).
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-050 (placeholder line removed from the checklist), BMI-072 (note updated), BMI-052 (the "no email in the repo" check now has this one intended exception, the conduct contact).

### D-006 — Precompile the i18n messages to meet the size budget (2026-11-22)

**Decision**, as reported by the frontend session (`implementar-v1-editor-pixi`) and passed on by the git-owner session (neither PM nor git owner heard it directly): vue-i18n messages are precompiled at build time instead of compiled in the browser, to bring the initial JavaScript under the 35 kB budget. The frontend session implements it.
**Why:** `pnpm size` fails at 43.21 kB brotli against 35 kB, and the message compiler that ships with the runtime build is the largest piece Ícaro can remove without dropping a feature.
**Decided by:** Ícaro, per the frontend session, which asked him.
**Affects:** BMI-061, BMI-040 (follow-up), BMI-002 (CI waits for `pnpm size` to pass).

### D-005 — Production deploys on every merge to `main` (2026-11-22)

**Decision:** production deploys automatically when a PR is squash-merged to `main`, through Vercel's Git integration. Release tags (release-please, BMI-071) only version and changelog; they don't gate deploys.
**Why:** one maintainer, squash-only merges and CI that must pass before merge make `main` always releasable. Gating on tags adds a manual step with no review benefit. The security report also wants deploys through the Git integration, so no deploy token sits in GitHub.
**Decided by:** PM, from the community report's recommendation, resolving the former Q-004. Reversible; Ícaro can overrule.
**Affects:** BMI-003, BMI-071.

### D-004 — Quality, security and community standards package (2026-11-22)

**Decision**, as relayed by the git-owner session from `.local/standards/decisions.md` (Ícaro's answers; PM has not heard them directly, confirmation requested):
1. The proxy stays `GET /api/image?url=…`. No switch to POST. The README privacy text becomes honest: our code logs nothing, but Vercel's runtime log keeps the request path including the image URL, client IP and user agent for 1 hour on Hobby.
2. Single-key shortcuts (`B`, `E`, `[`, `]`) work only while the image canvas has focus (WCAG 2.1.4). `Ctrl/Cmd` shortcuts stay global. The README says so.
3. `CLAUDE.md` and `.claude/`: no change now. Deciding is a mandatory item on the go-public checklist. *Settled by D-008: they stay.*
4. The rest of the three reports is approved: community files, quality bar, CI, security headers and CSP, supply-chain settings, proxy fixes, privacy tests. Response targets: 7 days for issues and conduct reports, 7 days to acknowledge security reports.
5. License stays MIT. v1 scope is the full README; nothing is cut without Ícaro's direct yes.

**Why:** hardening and standards before the repo goes public, without changing the product's three-step scope.
**Decided by:** Ícaro, per the git-owner session.
**Affects:** backlog epic E7 (BMI-060 to BMI-073), BMI-002 (expanded), BMI-050 (go-public checklist), README shortcuts and privacy text. Item 2 changes a behavior the README currently describes as global: the README is updated in BMI-069.

### D-003 — i18n sequencing after the editor was built first (2026-11-22)

**Decision:** the editor UI was committed (`bdcccbe`) before i18n existed, with English strings hard-coded. Ícaro agreed to build i18n now over the existing UI: BMI-040 to BMI-044 in one pass, then every later story ships its `pt-BR` strings from the start.
**Why:** the committed UI is small enough to translate in one change, and the parity test (BMI-040) stops it from regressing.
**Decided by:** Ícaro ("ok prossiga, estou de acordo").
**Affects:** BMI-040 to BMI-044. Not answered by this decision: whether other sessions must pause adding UI strings meanwhile.

### D-002 — vue-i18n for internationalization (2026-11-22)

**Decision:** use vue-i18n v11 in Composition API mode, `en` bundled as fallback, other locales lazy-loaded, typed keys from `en.json`.
**Why:** it's the official Intlify library for Vue 3 and actively maintained (11.4.23 published 2026-11-19). It covers plurals, number formatting and lazy loading, so nothing is written from scratch. No i18n library was in the project yet.
**Decided by:** PM, under the engineering principles in CLAUDE.md (mature library first). Reversible until BMI-040 is merged.
**Affects:** BMI-040 to BMI-044, [specs/i18n.md](specs/i18n.md).

### D-001 — i18n in v1 with English and Brazilian Portuguese (2026-11-22)

**Decision:** v1 ships in `en` and `pt-BR`. The i18n structure is built before any further UI work, and from then on every UI story includes the `pt-BR` strings.
**Why:** adding languages after the UI grows means a refactor across every component. Today there are a dozen strings.
**Decided by:** Ícaro.
**Affects:** README (Languages section), backlog epic E5, Definition of Done.

### D-000 — Earlier decisions, recorded for reference (2026-11-22)

Made before this log existed. Details live in the linked docs.

- **MIT license kept.** Decided by Ícaro.
- **Repo stays private until a pre-release audit** (BMI-050). Marketing doesn't say "open source" until it's public.
- **Hosting on Vercel Hobby, Docker image as the tested exit path.** [docs/hosting.md](../hosting.md).
- **PixiJS 8 + pixi-filters over Canvas 2D `ctx.filter`.** Canvas filters only do gaussian and don't work on iOS Safari. [README, Tech stack](../../README.md#tech-stack).
- **Operations, not pixels:** original image + ordered operation list, undo as a pointer. [README, How it works](../../README.md#how-it-works).
- **One session owns git.** Other sessions hand it file lists and commit messages.
