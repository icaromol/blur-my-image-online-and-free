# Pre-launch plan, from 2026-11-22 to launch

No launch date exists yet (see the questions at the end), so timing is tied to backlog milestones, not dates. The README says pre-release (v1 is built, not deployed), the repo is private and there is no hosted URL. Until the milestones below land, public text is "I'm building this", has no link and never says "try it" or "open source". Language is English only (Q-002 default).

## Milestones that unlock work

| Milestone | Backlog ID | Unlocks |
| --- | --- | --- |
| Deployed, URL exists | BMI-003 | Publishing site pages, Search Console, directory submissions that need a URL, "try it" posts |
| README status line matches what shipped | BMI-051 | Present-tense feature claims ("it blurs...") in any public copy |
| Repo public (`gh repo view --json visibility` returns PUBLIC) | BMI-050 | The words "open source", the repo link, Show HN, Privacy Guides, GitHub as a channel |

Show HN and the Reddit posts should wait for BMI-050, so that "try it" and "read the code" are both true on the day.

## Actions, in priority order

### 1. Keyword map and page briefs (start now)

- **Persona:** P1 first, then P2 and P3. **Channel:** Google search, through use-case pages on the site.
- **For:** blur tools are found through search (Semrush: about 49% of blur.me's traffic is Google organic, see audience.md), and pages compound. This is the only action that reaches P2 and P3 without ads.
- **Agent:** `seo-specialist`. **Output:** `docs/marketing/seo/keyword-map.md` and `docs/marketing/seo/page-briefs.md`.
- **Scope:** queries from the persona sections of audience.md, one brief per page (P1 "blur text in screenshot" and "pixelate text in image" first), title and meta for the home page (replaces the static English description in `index.html`), and the cost of prerendering use-case pages for a Vue single-page app. That sizing is what Q-001 needs before BMI-050.
- **Worked when:** briefs reviewed by the strategist before the deploy. After BMI-003, Search Console impressions and clicks per target query. No volume data exists yet; the map must say so and rank by intent until Search Console has numbers.

### 2. Home page and P1 use-case page copy (starts when action 1 delivers briefs)

- **Persona:** P1. **Channel:** the site.
- **For:** the page that receives search traffic on day one. Written now so the deploy isn't waiting on text.
- **Agent:** `copywriter`. **Output:** `docs/marketing/copy/home.md` and `docs/marketing/copy/use-case-blur-screenshot.md`.
- **Rules:** every claim comes from the README. The URL-loading exception (stateless proxy, Vercel's 1-hour request log) is stated where privacy is claimed. No phone claim: the README doesn't describe touch use and quality.md has real-device testing as a manual step before release. No "open source" until BMI-050.
- **Publishes:** after BMI-003 and BMI-051. **Worked when:** Search Console click-through per page in the first 30 days.

### 3. Build-in-public posts (start now, in parallel with action 1)

- **Persona:** P1 and A1. **Channels:** LinkedIn, Bluesky, Mastodon (the only approved keys in channels.md).
- **For:** the audience has to exist before launch day, and A1 recommendations take weeks to form. Cadence is the Building row of channels.md (1, 2 and 2 a week).
- **Agents:** `copywriter` writes the posts, `designer` the images, `social-publisher` creates Buffer drafts that Ícaro approves. **Output:** `marketing/social/posts/2026-11-*.md` and `.json`, first four ideas. The dates in the post file names (24, 26, 28 and 30 November) are IDs, not schedule dates; the schedule follows the cadence above and is set when the drafts are queued.
- **Mastodon is blocked:** Mastodon versions are not queued until Ícaro decides decision 4 in channels.md (he rewrites them in his own words, or picks a server and a disclosure approach). channels.md says mastodon.social requires disclosure of generative-AI use and infosec.exchange bans AI-operated accounts, and decision 4 has no recommendation.
- **Ideas, all backed by the README or its linked studies:** blur is not redaction (PETS 2016, recovered pixelated and blurred text, authors concluded neither is viable for redaction); why edits are an operation list so painting twice at 40 stays 40; canvas export drops EXIF; Safari's `toBlob('image/webp')` silently returns a PNG. Wording is "I'm building", not "it does".
- **Worked when:** replies from people outside Ícaro's network (five from strangers by the 31 January 2027 review, the channels.md threshold, a judgment call), follows, and Buffer insights written down before the 30-day window drops them.

### 4. Launch kit (research and drafts now, posting later)

- **Persona:** P1, A1, plus P2 on Reddit. **Channels:** Hacker News, Reddit, dev.to, Privacy Guides, tool directories, all manual.
- **For:** directory listings and a launch day with the community rules already read. Directories compound; most of the rest is a single day.
- **Agent:** `launch-community`. **Output:** `docs/marketing/launch/calendar.md` (sequence keyed to BMI-003 and BMI-050), `docs/marketing/launch/directories.md` (each directory's submission rules, checked, not assumed), `docs/marketing/launch/drafts.md` (Show HN, r/webdev Showoff Saturday, r/InternetIsBeautiful, Privacy Guides Project Showcase) and an outline for one dev.to article. Ícaro writes the article himself (dev.to bans AI-assisted promotion).
- **Posts at:** directories after BMI-003; HN, Reddit, Privacy Guides after BMI-050.
- **Worked when:** drafts pass the rules in channels.md. After launch, GitHub stars, the repo's own traffic referrers, Search Console branded queries ("blur my image"), replies on each thread.

### 5. Site and repo preview image (tagline settled by D-010)

- **Persona:** P1 and A1, who check a link preview before clicking. **Channel:** link previews and the GitHub social preview.
- **For:** BMI-050 lists a repo social preview image, and the site needs an OG image at BMI-003.
- **Agent:** `designer`. **Output:** `marketing/social/templates/og.html` and `marketing/social/posts/og-image.json`. The render goes to `marketing/social/out/` (git-ignored), so the git-owner session places it in the site and repo.
- **Worked when:** it's present at BMI-003 and checked off in BMI-050. No analytics measure applies.

## What can start now and what waits

- **Now:** actions 1 and 3 together, then 2 as soon as briefs exist, then 4 (drafting) and 5.
- **Waits for BMI-003:** publishing action 2, directory submissions, Search Console setup, any post with a link.
- **Waits for BMI-051:** present-tense feature claims.
- **Waits for BMI-050:** "open source", the repo link, Show HN, Reddit launch posts, Privacy Guides, dev.to article if it links the code.

## Questions for Ícaro

1. **Target launch date.** None in the docs. It sets how many weeks of posts to queue (Buffer holds 10 per channel).
2. **Soft-live window.** After BMI-003 the site can be live while the repo is still private. Should it be indexed from then, with no announcement? I recommend yes, because search pages gain from age. The alternative is `noindex` until BMI-050.
3. **Domain.** None chosen (hosting.md has none). It decides the Bluesky handle and which property Search Console verifies. Is a `*.vercel.app` URL acceptable at launch?
4. **English tagline.** Settled by D-010: "…Image files never leave your device." (`src/i18n/messages/en.json:4`).
5. **Keyword volume.** Public sources have none. May the seo-specialist use a Google or Bing Keyword Planner account, with no ad spend, to get volume ranges before launch?
6. **Accounts.** The five decisions in channels.md (personal or project handles, Mastodon server, AI-drafted posts, Reddit and HN history) are still open. This plan assumes the recommendations, except decision 4 (AI-drafted posts: Ícaro rewrites the Mastodon versions in his own words, or picks a server and a disclosure approach), which has no recommendation and **blocks Mastodon**: no Mastodon version is queued until Ícaro decides it. Reddit and HN accounts need real participation starting now to have history by launch.

## Corrections audience.md needed

Applied in b1ee611.
