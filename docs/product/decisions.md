# Decisions

Newest first. Each decision says what was decided, why, who decided and what it affects. Product scope decisions are Ícaro's.

## Open questions

### Q-001 — Localized URLs for SEO?

Should Portuguese pages live under their own URL (`/pt-br/`, with `hreflang` tags and prerendered landing pages per locale), or does the app only detect the language in the browser?

- **Detection only:** simplest. Google indexes one English version; Brazilian searches ("desfocar imagem online") land on English pages.
- **URL per locale:** Portuguese landing pages can rank in Brazil. Needs prerendering per locale and a route prefix.

PM recommendation: build detection now (BMI-041) with `resolveLocale()` designed so a URL source can sit in front of it, and decide this with the SEO work before launch. Nothing in v1 gets harder either way.

Needs: Ícaro. Input from `seo-specialist`.

### Q-002 — Marketing in Portuguese?

The marketing skill says public copy is English-only. With the app in `pt-BR`, do we also write Portuguese copy, landing pages and community posts for Brazil?

Needs: Ícaro. Input from `marketing-strategist`.

### Q-003 — Contact address for the code of conduct and SECURITY.md

A dedicated alias is recommended, the same one for both. Until chosen, files keep the `<CONDUCT_CONTACT>` placeholder, which blocks BMI-050.

Needs: Ícaro.

### Q-004 — When does production deploy?

On every merge to `main` (recommended in the community report) or only on release tags.

Needs: Ícaro. Affects BMI-003 and BMI-071.

### Q-005 — Hosted URL

The repo website field, README and bug-report form need the production URL. Not known yet.

Needs: Ícaro, after BMI-003.

## Decisions

### D-004 — Quality, security and community standards package (2026-11-22)

**Decision**, as relayed by the git-owner session from `.local/standards/decisions.md` (Ícaro's answers; PM has not heard them directly, confirmation requested):
1. The proxy stays `GET /api/image?url=…`. No switch to POST. The README privacy text becomes honest: our code logs nothing, but Vercel's runtime log keeps the request path including the image URL, client IP and user agent for 1 hour on Hobby.
2. Single-key shortcuts (`B`, `E`, `[`, `]`) work only while the image canvas has focus (WCAG 2.1.4). `Ctrl/Cmd` shortcuts stay global. The README says so.
3. `CLAUDE.md` and `.claude/`: no change now. Deciding is a mandatory item on the go-public checklist.
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
