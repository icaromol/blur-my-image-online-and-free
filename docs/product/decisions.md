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

## Decisions

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
