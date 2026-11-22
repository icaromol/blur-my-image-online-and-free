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

### Q-023 — The in-app redaction warning promises too much

The app's own warning (`en.json` line 47, `pt-BR.json` line 47) says: "Pixelated text can sometimes be recovered. For passwords or document numbers, use a high intensity." The opus reviewer read the 2016 study (PoPETs, Hill, Zhou, Saul and Shacham) and found no absolute safe threshold: mosaic accuracy falls as the grid nears the letters' size, and it recovered 24 px text up to a Gaussian radius of 45 px; its authors concluded that pixelation and blur aren't viable for redacting text. Bishop Fox's Unredacter post describes a search that renders guesses in the same font, and recommends black bars. So "use a high intensity" gives the same weak assurance as the README's false "roughly 20 px". It is the product's own text in two languages, so Ícaro decides, and it touches BMI-104 (a solid box, today in `Later`).

Options: (a) reword now, no new feature: say that blur and pixelation aren't safe ways to hide text that must stay secret and that covering it or cropping it out is; (b) as (a), and move BMI-104 (the solid box) into v1 so the app offers what the warning recommends; (c) leave the sentence.

Recommendation: (a) now, since a warning that overstates safety is a defect in the promise the product makes; and put (b) to him as a separate scope question, because adding the solid box to v1 changes the milestone. Default in force: **(c) until he answers**, with the fix to the README and the research notes going ahead (BMI-086), because those are plain factual errors.

### Q-022 — When may the app's URL be public: canonical, sitemap, README, marketing?

D-016 says the URL stays out of the README and marketing until Ícaro says. Meanwhile `index.html` already carries it (`og:url` and `og:image`, on the repository that is public now), and the landing pages need the real host for `canonical` and `sitemap.xml` (decision 3 of `docs/marketing/landing/seo.md`, read through `-75`; PM hasn't read the file). So the URL is already discoverable, and the question is when it stops being a secret to the places that matter.

Recommendation: release it with the go-live, in one step after the merge of PR #2: the first production deploy of the final build, the landing pages (BMI-085) and the README/marketing line, with the canonical and the sitemap built from the same host. Before that nothing changes. Default in force: the URL stays out of the README and marketing, `canonical` and `sitemap.xml` aren't built, and no post cites it.

### Q-021 — Five choices for the landing page copy (BMI-084)

The strategist's research (`docs/marketing/landing/research.md`: 19 pages from 18 sites, with URL and date) leaves five choices for Ícaro; the dispatcher follows the strategist's recommendation in the draft until he answers. (1) Is the landing a **page of its own** with a button to the editor, or the app's screen with the copy underneath? It decides whether the hero has a drop zone. Recommended: a page of its own. (2) The FAQ states **both link limits**: 100 MiB for the browser's direct fetch and about 4.2 MiB (`MAX_BYTES`, 4,400,000 bytes) when the link goes through our proxy; the README names only the second. Recommended: yes, in the FAQ only, not in the hero. (3) The FAQ states Vercel's **1-hour request log** (already in the README). Recommended: yes. (4) The face section says "**no automatic detection**", since searches for faces and plates are dominated by auto-detection tools and the product has a brush. Recommended: yes, said up front. (5) The page says **nothing about phones** until a test on a real device, and **nothing about analytics** until BMI-082 is decided and built. Recommended: both.

Default in force: the strategist's recommendations, in the draft only; nothing is published.

### Q-020 — What does "overlapping images" mean? (a future spec, blocks nothing)

Ícaro's request mentioned overlapping images and effects (relayed by `-aa`). The effect stack (BMI-128) is about effects; a second image placed over the first is a different, larger feature: a second source texture, a position and scale, a blend. Question for him, for later: what did he mean, a second picture over the first (a sticker, a logo, a pasted patch), or only effects on top of each other? Recommendation: ask when the effect stack comes up, then write its own spec. Default: not in `specs/effect-stack.md`, no item.

### Q-006 — Do the Docker image and server bundle need license notices?

Audit finding C: `dist-server/node.js` bundles hono, `@hono/node-server`, ipaddr.js and undici, and the Dockerfile ships it, but only the client build emits `licenses.md`.

Default in force: **nothing added to v1.** The image is built in CI as an exit path and not published, and a hosted function isn't a distributed copy. The client bundle, which is distributed to browsers, already carries its notices.

Recommendation: before any Docker image is published or pulled by anyone else, add server-bundle notices (the same mechanism, written to `dist-server/`). It's cheap and removes the question. Adding it to v1 is Ícaro's call; say so and it becomes a `Should` item for the server lane.

### Q-005 — Hosted URL

The URL is now `https://blurmyimage.vercel.app` (200), set by Ícaro as the project's main domain on 2026-11-22, per `-aa`; the earlier `https://blur-my-image.vercel.app` answers 307 to it (PM read both with a plain `GET`). The README, the repo website field and the bug form get it only when Ícaro says (D-016). Not blocking.

## Decisions

### D-031 — Preview modes and the editable effect stack come after v1, in that order (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer, closing Q-019: BMI-127 (preview: before and after, and no preview) and BMI-128 (the editable effect stack) come **after v1**, in this order: before and after first, the stack last. It is only an order; nothing he asked for was cut. The JavaScript cost of the preview is measured before any implementation (today's room is 1.31 kB). The meaning of "overlapping images" is a future question (Q-020) and blocks nothing.
**Why:** v1 is the README plus i18n, already built and under review; the two ideas change the renderer and the undo model.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-127, BMI-128, `specs/preview-modes.md`, `specs/effect-stack.md`.

### D-030 — The rate-limit message in `pt-BR` is approved; `ossf/scorecard-action` is allowed (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers: (1) the `pt-BR` text of the rate-limit message is approved as proposed, "Muitas solicitações vindas da sua rede agora. Tente de novo em cerca de um minuto." (`en`: "Too many requests from your network right now. Try again in about a minute."), so the pre-merge read of it is done. (2) Closes Q-012: `ossf/scorecard-action` is added to the Actions allowlist, pinned by SHA like the others; `-5b` applies the setting, and the scorecard workflow is written after the merge, in a PR of its own with the dependency-review workflow (BMI-076). **Correction (2026-11-22, per `-5b`): decided, not executed.** `-5b`'s environment blocked the write to the Actions allowlist (a security classifier, "Undermining Oversight") and `-5b` did not work around it. What is ready: `ossf/scorecard-action` v2.6.0 is an annotated tag pointing to commit `23f22cd43608bae7a1f1fa2603d7314dee9538a5` (verified by `-5b` as an ancestor of the official repository's main); the list today has 4 patterns ending in `@*` and `github_owned_allowed` true, and the update replaces the whole list, so it must carry those 4 plus the new one. Ícaro allows it directly in `-5b`'s session, or sets it himself in the repository's Actions settings.
**Why:** the message and the allowlist were the last two answers waiting on him; the scorecard action is the OpenSSF project's own.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-081 (the `pt-BR` read is done), BMI-076 (the scorecard half no longer waits), the repo's Actions settings.

### D-029 — Hosted-only metrics, and sponsorship and donations first (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-018: (1) Vercel Web Analytics and Speed Insights go on the **hosted deployment only**: nothing in the open-source code path, nothing in the Docker image, off by default in the code. His conditions: the README and the privacy text say what is true (the hosted site counts visits and speed, never images); the README's line 80, "No analytics cookies, no tracking pixels", stays only if Vercel's documentation confirms that Speed Insights uses no cookies, otherwise the sentence changes; the CSP and `e2e/privacy.spec.ts` change on purpose and keep proving that the open-source and Docker builds make no third-party request; one line in the app says it; PM checks whether a package or only a script is needed (the JavaScript budget has 1.31 kB of room). It is specified in `specs/hosted-analytics.md` and built after the merge of PR #2, in a PR of its own; nothing of it enters PR #2. (2) Monetization: **sponsorship and donations first**, GitHub Sponsors or Open Collective with no third-party script on the site; **no ads**.
**Why:** he wants numbers from the hosted site without touching the code people clone, and a way to fund the project that doesn't track anyone.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-082 (the metrics), BMI-083 (funding), README line 80, `docs/tooling.md`, BMI-003's "keep them off" line, `e2e/privacy.spec.ts`, `security-headers.ts`.

### D-028 — A privacy notice next to the link field; the rate limit and the WAF finding (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers: the app gets a notice under the link field, with his wording. `en`: "Links are fetched through our server. Files you open, drop or paste never leave your browser." `pt-BR`: "Links são buscados pelo nosso servidor. Arquivos que você abre, solta ou cola nunca saem do seu navegador." The taglines don't change. It goes into PR #2 and changes no scope: the README already says links go through the proxy. Context: CodeRabbit checked and the app had no such notice, while the public answer on the `pt-BR.json` comment said it had; that answer was wrong, `-5b` corrects it, and PM's reply draft carried the same mistake (corrected). He also says he did everything of BMI-073 and turned off the Vercel comments (D-024 done).
**Why:** the claim "files never leave your browser" needs the exception for links said where the user pastes a link, not only in the README.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-079 (the notice), BMI-080 (docs on the rate limit), BMI-081 (the deny's message), BMI-073, the README privacy text.

### D-027 — Brand kit: his original lettering, the two-tone blue and the icons are accepted (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-016: (1) the wordmark is **his original lettering**, vectorized from `brand/source/logo-horizontal.png` (1983x793); Liberation Sans stays for running text only. The designer redoes the SVGs (horizontal and stacked, four colorways each) and touches the mark only if it has to change; vectorizing uses a mature tool (potrace or an equivalent) and the result is compared side by side with the original at small sizes. (2) The blue is two tones, `#0d62b8` on light backgrounds and `#7cc4ff` on dark ones, as the only accent: accepted. (3) The icons (favicon, apple-touch, 192, 512), as drawn now with a dark background and a light blue bar: accepted. (4) Applying the identity to the site (`index.html`, `public/`, the OG image) is a PR of its own after the merge of PR #2; the kit is a PR of its own too (`feat/brand-kit`), not part of #2. The app's color theme is still to be decided with him later.
**Why:** it is his logo and his brand, and D-022 lets the kit start from it.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-075 (criteria changed), BMI-078 (new), `brand/README.md` (the note about the Liberation wordmark becomes history; `OFL.txt` stays while Liberation is used for text).

### D-026 — CC-BY-3.0 accepted for development tools only, so the license check can use a maintained SPDX parser (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer, closing Q-017: CC-BY-3.0 is accepted **for development tools only**, which lets `spdx-expression-parse` bring `spdx-exceptions` (a CC-BY-3.0 data package). Neither is shipped to the client or to the Docker image. The swap that was prepared goes in, and the dev-only rule is explicit in the check: a production dependency under CC-BY-3.0 still fails.
**Why:** the project prefers the maintained library over a hand-written evaluator, and the allowance changes nothing in what ships.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-077 (the license check), `scripts/check-licenses.mjs`, `package.json` and `pnpm-lock.yaml` (lock files).

### D-025 — Answers on the three CodeRabbit findings that needed Ícaro (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-015: (1) **release-please**: the first release PR is closed and reopened by hand to start its checks; the workflow stays as it is and no new secret is created. (2) **Direct fetch**: it gets a timeout **and a size cap** (his choice, against PM's recommendation of a timeout only; his choice stands). PM sets the value, with a reason, in BMI-077, and the error uses the existing `too_large` i18n code in `en` and `pt-BR`. (3) **Tagline**: kept as he approved it (D-010); the PR answer says the README and the meta description carry the exception for links. (PM first wrote "and the app's own notice" here and in the reply draft without checking: the app had no such notice, CodeRabbit found it, and D-028 adds it.)
**Why:** each is his call: a credential, a limit that can refuse an image, and his own wording.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-077, PR #2 (answers only where we refuse or explain).

### D-024 — Turn off the Vercel pull-request comments (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer, closing Q-014: the Vercel comments on pull requests are turned off. Ícaro flips the toggle in the Vercel dashboard (Project Settings, Git); `-5b` deletes the existing comment on PR #2, already ordered by `-aa`. Previews and the GitHub status check stay.
**Why:** the bot's public comment on PR #2 carried the project ID and the team slug, and it comments on every PR.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** PR #2, team.md's Vercel notes.

### D-023 — Path filters let CodeRabbit review PR #2 (2026-11-22)

**Decision**, taken by `-aa`, `-f5` and `-5b` as option A of the former Q-013 (PM's recommendation, tried first on `-aa`'s word; PM hasn't seen the file): the committed `.coderabbit.yaml` (`57e170d`) uses path filters that take `docs/`, `marketing/`, `.claude/`, markdown and `public/` out of the review, while code, security and CI files stay in, and `drafts: true`. CodeRabbit's status on PR #2 went from "skipped" (134 files over the free plan's limit of 100) to "Review in progress". Ícaro's condition, a merge only after CodeRabbit's corrections, is met by this route and stays in force; he can overrule the filters.
**Why:** the file count was the only thing that stopped the review, and the filtered files are text and assets, not code.
**Decided by:** `-aa` with `-f5` and `-5b`, under Ícaro's order (D-018), not by Ícaro himself. Reversible. Result: the review came out line by line, so the open-source plan covers PR #2 (per `-aa`; reading the CodeRabbit dashboard is still Ícaro's).
**Affects:** BMI-050 (the review step), PR #2. Closes Q-013.

### D-022 — The logos are Ícaro's and may be published under MIT (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer ("licença minha", PM did not hear it directly), closing Q-011: the two logos are his and may be published under the repo's MIT license. He didn't name the tool they came from, so the record says only "created by Ícaro". The brand kit may start from the shape of his symbol and from his wordmark; redrawing the wordmark in a free font (SIL OFL) for a clean vector is the designer's call, not required by license.
**Why:** it settles whether the raster logos can be redrawn and published.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-075 (criteria loosened accordingly), `brand/README.md`. PM did not check the wordmark's typeface; if it comes from a commercial font, that font's own license is a separate matter from the logo's.

### D-021 — Old commit hashes stay reachable: risk accepted; the e-mail toggles are on (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers (PM did not hear them directly): (1) the pre-rewrite commits may stay reachable by their full hash on GitHub until it garbage-collects them, and he **accepts the risk**: no request to GitHub Support and no new repository; (2) the two e-mail settings of his GitHub account, "Keep my email addresses private" and "Block command line pushes that expose my email", are **on** (he sent `-aa` a screenshot; PM hasn't seen it); (3) BMI-075 and the E8 epic are fine as described.
**Why:** the old hashes aren't linked from any ref (PM checked `refs/pull/1/head` and the branches), so reaching them takes the full hash; a repository replacement or a Support request wasn't worth that. The two toggles stop a future commit from exposing the old address.
**Decided by:** Ícaro, per the orchestrator session. Irreversible once the repo is public.
**Affects:** D-015 (its residual risk is now an accepted one), BMI-050, BMI-075.

### D-020 — Visual identity for the product (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct request (PM did not hear it directly): the product gets a visual identity, minimalist, black and white with blue as the accent, built from the two logos he added. It enters v1 by his order, as BMI-075 (`Should`, so the `Must` count doesn't change). It covers vector logos, a minimal palette, favicon, the OG image base, the marketing templates' CSS and a short guide. Applying the identity inside the app (theme, components) is a separate item for the ui lane, groomed later with him; `src/**` isn't touched here.
**Why:** he wants a consistent identity for the repo, the OG image and the posts before launch.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-075 (new), Q-011, `marketing/social/templates/brand.css`, the OG image, `.gitignore` (the raw sources).

### D-019 — Ignored Build Step on the Vercel project before the rewritten `main` is pushed (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer (PM did not hear it directly): before `-5b` pushes the rewritten `main`, `-f2` sets the project's Ignored Build Step to `test ! -f package.json`. A tree with no `package.json` (today's `main`) is skipped and the live site stays; a tree with the app builds as usual, also after the merge. `-5b` pushes `main` only after `-f2` reads the value back. `-f2`'s environment denied the change (a PATCH of `commandForIgnoringBuildStep`, "Destructive or Unwanted Actions"), and a relayed authorization doesn't change that, so **the execution is Ícaro's** (he saved it in the dashboard, 2026-11-22, per `-aa`; the read-back by `-f2` is still to come): Project Settings, Git, Ignored Build Step, Custom, command `test ! -f package.json`, Save. Read back by `-f2` right after the denial: the value is `None`, so production is **not protected yet**, and `-5b` must not push `main` until `-f2` reads the new value back. This replaces any earlier acceptance of the site going down, which was given without the exposure below.
**Why:** pushing `main` would otherwise trigger a static deployment of the repository root (no app, no build), taking the site down and serving files such as `/CLAUDE.md` and `/docs/*.md` by URL.
**Decided by:** Ícaro, per the orchestrator session. Reversible.
**Affects:** BMI-050 (a step before pushing the rewritten `main`), BMI-003 and BMI-073 (a Vercel project setting), D-015.

### D-018 — Final order: rewrite, flip, protections, CodeRabbit config, review, merge (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`), the fallback Ícaro had accepted in advance: `-f5` confirmed that on the CodeRabbit Free plan with a private repo CodeRabbit only writes a summary and does no line-by-line review; the open-source plan, for a public repo, does review. So the order of D-017 changes to: (1) rewrite the commits (D-015); (2) flip the repo to public, only with `-aa`'s explicit go, after `-5b`'s report on the rewrite; (3) the BMI-050 protections; (4) `.coderabbit.yaml` committed; (5) PR #1 out of draft and `@coderabbitai review`; (6) the corrections; (7) merge. Supersedes D-017's order; D-015, D-016 and the rest of D-013 stand.
**Why:** a code review before the merge needs a public repo; Ícaro chose the order with this fallback foreseen.
**Decided by:** Ícaro, per the orchestrator session (PM did not hear it directly).
**Affects:** BMI-050 (reordered again), BMI-073, README on `main`: the public `main` shows the old README ("planning, nothing implemented") from the flip until PR #1 merges, which PM flagged before and Ícaro's order accepts. No review comments exist yet, so the history rewrite loses nothing.

### D-017 — New order for going public: rewrite, review privately, merge, then flip (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer (PM did not hear it directly), revising the order in D-013 (its premise, that CodeRabbit reviews private PRs, didn't hold; D-018 changes the order again): (1) rewrite the history to the GitHub no-reply address (D-015); (2) PR #1 comes out of draft; (3) CodeRabbit reviews it while the repo is still private (a `CodeRabbit` status already shows on the PR); (4) its corrections are made; (5) PR #1 is merged; (6) only then the repo flips to public, with `-aa`'s go, so the public `main` is born with the new README. The merge stays the first "official" production deploy. The repo description and topics drafted in `docs/marketing/repo-metadata.md` are approved and `-5b` applies them.
**Why:** CodeRabbit turned out to review private PRs, so the flip no longer has to come before the review, and a flip after the merge doesn't show the old README on `main`.
**Decided by:** Ícaro, per the orchestrator session. Reversible until the flip.
**Affects:** BMI-050 (checklist reordered again), BMI-073 (the pre-merge items), D-013 (its order is superseded; the rest of it stands).

### D-016 — Vercel: publish the rate-limit rule, keep the site up, remove the uploaded-files deployment (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answers, closing Q-010: (a) the WAF rule on `/api/image` (30 requests per 60 s per IP, deny for 1 minute) is to be published and the site **stays up** (**decided, not executed**: see the correction below); its URL does not go into the README or any marketing text until he says; (b) the deployment that carries the files uploaded by `-f2`'s local deploy is removed, by `-f2`, and only that one (done and read back: it answers 404); (c) revoking the "Protection Bypass for Automation" secret is his own action in the Vercel dashboard; (d) confirmed that Hobby builds from a private repo. The other finding, the author address of the commits, was decided in D-015.
**Correction (2026-11-22, from `-aa`):** the rule was **not** published. `-f2`'s environment denied `vercel firewall publish` (the CLI's approval gate doesn't accept an authorization relayed by another session) and `-f2` did not work around it. The rule stays staged and `/api/image` has no rate limit. Ícaro decided to publish it; he publishes it himself in the Vercel dashboard (Firewall, Review changes, Publish) or allows the permission in `-f2`'s environment. Nothing here says "published" until `-f2` reads the active rule back. **Update (2026-11-22, from `-aa`):** done and read back. The rule "Rate limit image proxy" is published and active on `/api/image` (30 requests per 60 s per IP, deny for 1 minute, 0 pending changes), the bypass secret no longer appears in the project's API (Ícaro revoked it; `-f2` only checked that it is gone), and `ALLOWED_ORIGINS` lists the new domain from the next deploy. Caveat: `-f2`'s 13 test requests never reached the limit, so that the deny fires above 30 requests per 60 s is not proven.
**Why:** the proxy had no rate limit while reachable; the uploaded copy held internal handoff notes. Background: the project's first Git deployment was promoted to production by the Vercel Git integration (`-f2`, read-only evidence), not by a CLI deploy, so the alias has served a feature-branch build since 16:06.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-003, BMI-073, Q-005 (the URL stays out of the README until he says), D-013, `team.md` (nobody runs `vercel deploy` from the working tree).

### D-015 — Rewrite the history to the GitHub no-reply address before the flip (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro's direct answer, closing Q-009: the commits are rewritten to his GitHub no-reply address before the flip. `-5b` does it with a backup, a verification and `--force-with-lease`, and gives PM the old-to-new hash map so the docs can be corrected. The address isn't written in these docs.
**Why:** the author address would be public in every commit once the repo is public.
**Decided by:** Ícaro, per the orchestrator session. Irreversible for the old hashes.
**Executed and verified (2026-11-22, `-5b` and `-aa`):** every commit on the remote now carries only the no-reply address (87 commits; every tree identical to the backup; `main` has the same tree), pushed with the Ignored Build Step in place (the `main` push built nothing, the alias stayed, no `.md` file was served). The old-to-new hash map is in `.local/rewrite-map-old-new.txt` (outside git) and the hashes cited in `docs/product/` were corrected from it. PR #1 was **closed by GitHub during the push** (the branch and `main` had no common history for a few seconds) and the API can't reopen it, so a new PR replaces it. Residual risk, low: the pre-rewrite commits may stay reachable by their full hash on GitHub until it garbage-collects them. PM checked that `refs/pull/1/head` now points at the new head (`32c4e77`) and that no remote ref holds an old hash. Ícaro accepted this residual risk (D-021).
**Affects:** every commit hash cited in `docs/product/` and `docs/marketing/`, PR #1 (force-push, checks rerun), BMI-050. Two things to settle before pushing: `main` holds 5 of the commits and has no app in it, so pushing a rewritten `main` makes the Vercel Git integration build a production deployment from an app-less tree while the site is meant to stay up; and the repo's `user.email` must be the no-reply address first, or the next commit exposes the old one. `-5b` and `-f2` settle the first with Ícaro's go (one option is turning off deployment creation on the project while `main` is pushed, then back on).

### D-014 — The three `.claude/` skills may be published (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer ("posso publicar"): `brandkit`, `design-taste-frontend` and `no-ai-slop` stay in the repo and go public with it. Nothing is removed from the history. Closes Q-008.
**Why:** it was the one open item that blocked the flip. The exact origin of the three skills is still not documented: their `SKILL.md` files state no author, source or license, and the claim that they can be published is Ícaro's own. The PM recorded that, and did not verify it.
**Decided by:** Ícaro, per the orchestrator session. Irreversible in practice once the repo is public: the history stays public unless it is rewritten.
**Affects:** BMI-050 (the skills item, Q-008, is closed and the flip no longer waits on it; the flip still waits on Q-009, the author address), D-008. Note: this entry originally shared the label Q-008 with the author-address question; that one is now Q-009, and IDs are not reused.

### D-013 — Go public: yes, with CodeRabbit before the merge (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answers to it (PM did not hear them directly): the go-public of BMI-050 is a **yes**. He wants CodeRabbit to review PR #1 before it's merged, and the free CodeRabbit only works on public repos, so the order of BMI-050 changes to: pre-flip checklist, flip, protections, CodeRabbit app installed (Ícaro's action), PR #1 out of draft (CodeRabbit ignores drafts), CodeRabbit's corrections, merge. The merge is authorized by him only after those corrections and with green checks. The flip itself happens only when `-aa` gives `-5b` the go, and Q-008 (origin and license of three skills) was open when this was recorded; D-014 closed it.
**Why:** a second reviewer on the largest PR before it lands on `main`. It reorders the checklist and cuts nothing.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-050 (checklist rewritten; the order is superseded by D-017), PR #1, D-005 (merging to `main` triggers the first production deploy once BMI-003 is done), BMI-003. Executed by `-5b` (git and GitHub), Ícaro (installing the CodeRabbit app), `-f5` (CodeRabbit session).

### D-012 — Create the Vercel project and deploy (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro ("Faça"): BMI-003 goes ahead, `Ready`. The project is created, linked to the GitHub repo through Vercel's Git integration and deployed, by `-f2` with the Vercel actions Ícaro authorized. If linking to GitHub needs the Vercel app authorized in the browser, `-f2` tells `-aa`.
**Why:** it unblocks the hosted URL (Q-005), the preview deployments on PRs and BMI-073.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-003, BMI-073, Q-005, D-005. A denied Vercel or GitHub action is recorded and reported; nobody works around it with another credential.

### D-011 — Apply the GitHub repository settings (2026-11-22)

**Decision**, as relayed by `-aa` from Ícaro ("Faça"): the GitHub settings of BMI-070 are applied: labels, squash-only merges, delete branch on merge, suggest updating PR branches. `-5b` executes them. Saved replies are a per-user GitHub setting, not a repository one, so they stay Ícaro's to add by hand.
**Why:** they keep the history linear and the PR flow tidy before the repo is public.
**Decided by:** Ícaro, per the orchestrator session.
**Affects:** BMI-070.

### D-010 — Privacy wording and tagline say "image files" and match the URL proxy exception (2026-11-22)

**Decision**, as relayed by the orchestrator session (`-aa`) from Ícaro's direct answer to it ("ajustar tudo", PM did not hear it directly): the README and the `index.html` meta description say "Image files you open, drop or paste never leave your device." The `en` tagline changes to the same idea (for example "…Image files never leave your device."), and the `pt-BR` tagline is made consistent with the URL proxy exception. Translation files may be edited for this, through the ui lane. The final `pt-BR` wording is proposed by the PM and the worker and shown to Ícaro before the merge, since he corrected `pt-BR` strings before (`fbf8779`).
**Why:** "Images you open, drop or paste never leave your device" is ambiguous because opening a link goes through the proxy; the `en` tagline ("It never leaves your device") and the `pt-BR` one ("Ela nunca sai do seu navegador") state no exception at all.
**Decided by:** Ícaro, per the orchestrator session. Reversible. He then read and approved the committed `pt-BR` tagline (`ccef665`) as it is, "Desfoque a imagem inteira ou como quiser. Os arquivos de imagem nunca saem do seu navegador.", and said not to switch to "Seus arquivos…" (relayed by `-aa`, 2026-11-22).
**Affects:** BMI-051 (criteria reopened), BMI-003 (meta tags and OG image use the final wording), `src/i18n/messages/en.json` and `pt-BR.json` line 4, `README.md` line 3, `index.html` line 6. Settles the "en vs pt-BR tagline" question that had been open since `fbf8779`.

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

**Decision:** the editor UI was committed (`43525ae`) before i18n existed, with English strings hard-coded. Ícaro agreed to build i18n now over the existing UI: BMI-040 to BMI-044 in one pass, then every later story ships its `pt-BR` strings from the start.
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
