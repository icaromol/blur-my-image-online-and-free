# Channels

Where to post for personas P1, P2, P3 and A1 from [audience.md](audience.md), how often, and in what format. Researched 22 November 2026. The product is in planning (see the [README](../../README.md)), so until there is a working build the posts are build-in-public updates, not "try it now".

## Summary

- Start with three Buffer channels: **LinkedIn, Bluesky and Mastodon.** All three reach P1 or A1, all three accept scheduled posts through Buffer, and together they fill the Buffer Free plan.
- P2 (private sellers) and P3 (parents and school volunteers) can't be reached on social media without ads or an existing following. Search reaches them; that work belongs to `seo-specialist`. Pinterest and YouTube Shorts are the candidates for them after launch, once there are use-case pages to link to.
- Hacker News, Reddit, dev.to and the Privacy Guides forum are manual only, and most of them belong on launch day.
- Three platform rules on AI-drafted content affect how we work; they are under [Decisions for the maintainer](#decisions-for-the-maintainer).

## Buffer constraints

Buffer's [pricing page](https://buffer.com/pricing) says the Free plan lets you "Connect up to 3 channels" and adds that "Channels will be locked if you exceed the three-channel limit for the Free plan." Other limits that matter here:

- **10 scheduled posts per channel** at a time. Buffer's help page puts it as ["10 per channel, up to 30 total if you have 3 channels connected"](https://support.buffer.com/article/643-how-many-posts-can-i-schedule-in-advance). A published post frees its slot.
- **Drafts** are ["available on every plan, including Free"](https://support.buffer.com/article/595-features-available-on-each-buffer-plan). Neither page says whether drafts count toward the 10-post queue. Check this in the account the first time the queue fills up.
- **One user**, and post insights keep only a **30-day history** on Free. Export or note the numbers before each review date or they're gone.
- **Lifetime limit of 8 connections per social network** ([features page](https://support.buffer.com/article/595-features-available-on-each-buffer-plan)). Swapping a channel in and out repeatedly uses these up.
- Buffer lists Facebook groups and personal Instagram profiles as channels it can't publish to automatically ([pricing page](https://buffer.com/pricing)).

Channel names used in post packages (`marketing/social/posts/*.md`) and by `social-publisher`:

| Package key | Buffer channel | Status |
| --- | --- | --- |
| `linkedin` | LinkedIn profile | In use |
| `bluesky` | Bluesky profile | In use |
| `mastodon` | Mastodon profile | In use |

Any other channel key is not approved for queuing until this file lists it as in use.

## Evidence by persona

### P1, work screenshot redactor

The best source is the [Stack Overflow Developer Survey 2025, "Community platforms"](https://survey.stackoverflow.co/2025/technology/#1-community-platforms) question ("Which community platforms have you utilized considerably or consistently in the past year?"). Share of professional developers:

| Platform | Professional developers |
| --- | --- |
| Stack Overflow | 85.5% |
| GitHub (public) | 67.5% |
| YouTube | 60.3% |
| Reddit | 53.6% |
| Discord | 37.3% |
| LinkedIn | 38.1% |
| Hacker News | 20.4% |
| X | 17.0% |
| Dev.to | 12.3% |
| Bluesky | 10.8% |
| Mastodon | write-in only, 0.2% |

Two caveats. The survey is run by Stack Overflow, so its own row is inflated by who answers. And it covers developers, not support agents, QA testers or technical writers, who are part of P1 too. For them the only evidence found is general: [Pew's 2026 fact sheet](https://www.pewresearch.org/internet/fact-sheet/social-media/) shows 51% of US college graduates use LinkedIn, against 31% of all adults. Nothing found measures where support agents in particular spend time online.

Of the Buffer-supported channels, LinkedIn reaches the most developers without needing video. Stack Overflow, GitHub, Discord and Hacker News are not posting channels for a product account.

### P2, private seller, and P3, careful parent or school volunteer

[Pew's 2026 fact sheet](https://www.pewresearch.org/internet/fact-sheet/social-media/) (5,511 US adults, January to June 2026) shows where these age groups are: YouTube 91% and Facebook 78% of adults 30 to 49; Facebook 77% of women against 63% of men. Pew no longer reports Pinterest. Pinterest itself reported [661 million monthly users in Q3 2026](https://socialmediatoday.com/news/pinterest-reports-solid-user-growth-in-q3/873274).

The reach problem is that these people use Facebook and YouTube for everything, and a new account with no followers reaches almost none of them. Facebook groups (school, parents, car sellers) are where they talk, and Buffer can't post to groups automatically. [audience.md](audience.md#what-the-research-could-and-could-not-answer) already notes that blur tools are found through search (Semrush: about 49% of blur.me's traffic is Google organic). So for P2 and P3, the plan is search first, and social only as a way to put how-to content where people search inside a platform: Pinterest pins and YouTube Shorts that link to use-case pages. That needs a live site, so it waits until after launch.

### A1, press-freedom advocate

- A survey of 460+ UK and US journalists by Fire on the Hill and Mercury Analytics (December 2024 to January 2025) found 76% had an X account, 25% Bluesky, 17% Threads and 9% Mastodon. Only 36% of those on X had posted in the past month, against 75% of those on Bluesky ([CMOtech report](https://cmotech.uk/story/journalists-shift-from-x-to-bluesky-amid-policy-concerns)). The sample is small and the survey was commissioned by a PR agency.
- Pew found the share of US news influencers with a Bluesky account rose from 21% to 43% between Election Day 2024 and March 2025, while 82% were still on X ([Pew, May 2025](https://www.pewresearch.org/short-reads/2025/05/29/bluesky-has-caught-on-with-many-news-influencers-but-x-remains-popular/)).
- Mastodon's security and open source servers are small but active. Monthly active users read from each server's public API on 22 November 2026: infosec.exchange 10,594, hachyderm.io 7,508, fosstodon.org 7,139, mastodon.social 265,688.
- No 2026 data on journalists' Bluesky or Mastodon use was found. Muck Rack's [State of Journalism 2026](https://muckrack.com/stateofjournalism/) has platform figures, but the PDF couldn't be read for this study.

A1 cares about local processing, EXIF removal and honesty about blur's limits. Those are technical posts, and the people who share them are on Bluesky and Mastodon more than anywhere Buffer reaches.

## Channel table

| Channel | Personas | Evidence | Format | Posting | Buffer | Priority |
| --- | --- | --- | --- | --- | --- | --- |
| LinkedIn (personal profile) | P1 | [SO 2025: 38.1% of pro devs](https://survey.stackoverflow.co/2025/technology/#1-community-platforms) | Text up to 3,000 chars plus one image | Automatable | Yes, profiles and pages | Now |
| Bluesky | P1, A1 | [SO 2025: 10.8%](https://survey.stackoverflow.co/2025/technology/#1-community-platforms); [journalists 25%, 75% active](https://cmotech.uk/story/journalists-shift-from-x-to-bluesky-amid-policy-concerns) | Text up to 300 chars plus image | Automatable | Yes | Now |
| Mastodon | A1, P1 | [Journalists 9%](https://cmotech.uk/story/journalists-shift-from-x-to-bluesky-amid-policy-concerns); server MAU above | Text up to 500 chars, image with alt text, hashtags | Automatable, with replies by hand | Yes | Now |
| X | P1, A1 | [SO 2025: 17.0%](https://survey.stackoverflow.co/2025/technology/#1-community-platforms); journalists 76% with accounts, 36% active | Text up to 280 chars plus image | Automatable | Yes | Review in January (see rejected) |
| YouTube Shorts | P2, P3, P1 | [Pew 2026: 84% of adults](https://www.pewresearch.org/internet/fact-sheet/social-media/); SO 2025: 60.3% | Vertical demo under 60 s | Automatable | Yes (Shorts only) | After launch |
| Pinterest | P2, P3 | [661M monthly users](https://socialmediatoday.com/news/pinterest-reports-solid-user-growth-in-q3/873274) | Vertical how-to pin linking to a use-case page | Automatable | Yes | After launch |
| Threads | P3 | No persona-specific evidence found | Text plus image | Automatable | Yes | Skip |
| Facebook page | P2, P3 | [Pew 2026: 70% of adults](https://www.pewresearch.org/internet/fact-sheet/social-media/) | Image post | Automatable for pages, not groups | Pages yes, groups no | Skip |
| Instagram, TikTok | P3 (creators are out of scope) | Pew 2026: 51% and 37% | Image or short video | Automatable | Yes | Skip |
| Hacker News | P1, A1 | [SO 2025: 20.4%](https://survey.stackoverflow.co/2025/technology/#1-community-platforms) | Show HN link post | Manual only | No | Launch day |
| Reddit | P1, P2 | [SO 2025: 53.6%](https://survey.stackoverflow.co/2025/technology/#1-community-platforms) | Text or link post in the right subreddit | Manual only | No | Launch day |
| dev.to | P1 | [SO 2025: 12.3%](https://survey.stackoverflow.co/2025/technology/#1-community-platforms); competitors launched there ([audience.md](audience.md#what-frustrates-people-with-current-tools)) | Long technical article | Manual only | No | Now, written by hand |
| Privacy Guides forum | A1 | Project Showcase category | Forum post | Manual only | No | After launch |
| GitHub | P1, A1 | SO 2025: 67.5% | README, releases | Manual only | No | When the repo is public |

## Recommended starting mix

1. **LinkedIn, personal profile.** It has the largest P1 share of any channel Buffer can post to without video, and support leads, QA and technical writers are there as well as developers. A personal profile already has a network; a new company page starts at zero. Watch the tone: LinkedIn is where AI-sounding posts are most common and most criticised ([Forbes, August 2026](https://www.forbes.com/sites/jodiecook/2026/08/10/what-linkedins-ai-slop-crackdown-means-for-your-posts/)), so the no-ai-slop LinkedIn module applies to every post.
2. **Bluesky.** Smaller developer share than X, but it is where journalists and news writers are actively posting, which serves A1, and its [community guidelines](https://bsky.social/about/support/community-guidelines) ask only that commercial content be disclosed and that you don't spam. Our reading is that a free tool with no ads or paid tier isn't commercial content in that sense.
3. **Mastodon.** The smallest audience of the three. It's here because the people who check whether a "no upload" claim is true (infosec, open source and digital-safety people) are on it, and one share from that group is worth more to this product than raw reach. Mastodon has no algorithmic feed; posts are found through follows and hashtag search ([Mastodon docs](https://docs.joinmastodon.org/user/network/)), so hashtags and replies do the work an algorithm does elsewhere.

### What was rejected and why

- **X.** It has more developers than Bluesky (17.0% against 10.8%) and more journalists with accounts. It loses on two counts: journalists there post far less often (36% active against 75% on Bluesky, in the one survey found), and with only three Buffer slots, Bluesky and Mastodon reach the privacy-minded part of the audience more directly. X's [automation rules](https://help.x.com/en/rules-and-policies/x-automation) say "You are ultimately responsible for the actions taken with your account, or by applications associated with your account." The page blocked fetching, so its exact rules on scheduling and duplicate posts weren't checked; Buffer supports X, and vendor summaries read the rules as allowing scheduled original posts. Revisit at the January review if Bluesky underperforms.
- **YouTube Shorts.** 60% of developers and 84% of US adults use YouTube, so on reach alone it would be first. It needs a video for every post, and before launch there is nothing to film. Strong candidate after launch.
- **Pinterest.** Good fit for P2 and P3 how-to searches ("hide license plate in photo"), but every pin needs a page to link to.
- **Facebook, Instagram, Threads, TikTok.** No evidence that a new account with no followers reaches P2 or P3 there without paid promotion. Facebook groups, where those people actually talk, can't be automated.

Adding YouTube or Pinterest after launch means dropping one of the three, or moving to a paid Buffer plan.

## Manual channels

These never go through Buffer. Drafts and timing belong to `launch-community`.

### Hacker News

[Guidelines](https://news.ycombinator.com/newsguidelines.html): "Please don't use HN primarily for promotion. It's ok to post your own stuff part of the time, but the primary use of the site should be for curiosity." And: "Don't solicit upvotes, comments, or submissions."

[Show HN rules](https://news.ycombinator.com/showhn.html): "Show HN is for something you've made that other people can play with." "If your work isn't ready for users to try out, please don't do a Show HN." "Please make it easy for users to try your thing out, ideally without barriers such as signups or emails." Also "Don't post landing pages or fundraisers."

When: Show HN only once the tool works in a browser with no sign-up. Before that, a technical write-up (for example, on recovering pixelated text) can go up as an ordinary submission, but only if the account also takes part in other threads. Don't ask anyone to upvote.

### Reddit

Reddit's sitewide [Rule 2](https://redditinc.com/policies/reddit-rules): "Abide by community rules. Participate authentically in communities where you have a personal interest, and do not spam or engage in disruptive behaviors (including content manipulation) that interfere with Reddit communities."

Reddit blocks automated fetching, so the subreddit rules below come from mirrors and secondary sources. Read each sidebar on reddit.com before posting.

| Subreddit | Personas | Rule as reported | Source |
| --- | --- | --- | --- |
| r/webdev | P1 | Sharing a project "is limited to Showoff Saturday. If you post such content on any other day, it will be removed." Mods also remove Showoff posts that read like ads | [Unofficial mirror](https://r-weld.vercel.app/r/webdev), [removal example](https://yomotherboard.com/question/why-was-my-free-front-end-website-removed-from-showoff-saturday/) |
| r/InternetIsBeautiful | P1, P2, P3 | Follows the 90/10 rule: accounts that mostly advertise their own work can't post | [Mirror](https://lr.eu.psf.lt/r/internetisbeautiful) |
| r/SideProject | P1 | Feedback-focused; no written self-promotion rule found | [Hive Index](https://thehiveindex.com/communities/r-sideproject) |
| r/privacy, r/sysadmin, r/UsedCars | A1, P1, P2 | Current rules not found | Check the sidebar |

When: launch day for r/webdev (if it's a Saturday, otherwise the next one) and r/InternetIsBeautiful. Posts come from an account with a real history in those communities, not a fresh project account.

### dev.to

[Terms, section 11](https://dev.to/terms): content should be "not designed primarily for the purposes of promotion or creating backlinks". The [AI guidelines](https://dev.to/guidelines-for-ai-assisted-articles-on-dev) say AI-assisted articles must not "Promote any business, program, or course (including your own)."

When: during the build, one article whenever a technical decision is worth explaining (the operation-list model, the Safari WebP fallback, the SSRF checks in the URL proxy). Because of the AI rule, the maintainer writes these himself.

### Privacy Guides forum

The [Project Showcase category](https://discuss.privacyguides.net/t/guidelines-for-posting-about-my-privacy-focused-project/36766) "is the only section in which you as a developer are allowed to promote your own projects." A reply in that thread says developers must first contact the Privacy Guides team to verify themselves. Unless Privacy Guides recommends the tool, don't mention it in other threads.

When: after launch and after the repo is public. This audience will want to read the code.

## Cadence and content

Sized for one person writing and approving every post. Each idea gets written once and adapted per channel, never pasted unchanged.

| Period | LinkedIn | Bluesky | Mastodon |
| --- | --- | --- | --- |
| Building (now until launch) | 1 a week | 2 a week | 2 a week |
| Launch week | 2 | 1 a day, 5 days | 1 a day, 5 days |
| After launch | 1 a week | 2 to 3 a week | 2 to 3 a week |

At these rates, the 10-post Buffer queue per channel holds about five weeks for Bluesky and Mastodon and ten for LinkedIn.

Content types, and where each one goes:

| Type | Example from the spec | LinkedIn | Bluesky | Mastodon |
| --- | --- | --- | --- | --- |
| Build-in-public update | Why edits are stored as an operation list instead of changed pixels; why Safari needs a WebAssembly WebP encoder | Yes, with the trade-off spelled out | Short version with a screenshot | Short version with a screenshot |
| Blur-vs-redaction explainer | The [PETS 2016 study](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf): text stayed readable below roughly 20 px blur or mosaic blocks | Yes, aimed at support and QA leads | Yes | Yes, this is the A1 post |
| Privacy tip | Canvas export drops EXIF, so GPS coordinates don't leave with the photo; plate cloning in car listings | Occasionally | Yes | Yes |
| Use-case demo | Paste a screenshot, pixelate a name, download | After a working build | After a working build | After a working build |

Rules for every post until the repo is public:

- Don't call it open source and don't link the repository.
- Don't say "try it" or link to a site that doesn't exist. Before launch, posts have no link. The goal is follows and replies.
- Write alt text for every image. Screen-reader users are part of every audience here, and a post about privacy tools that skips accessibility undercuts itself.
- Mastodon: two or three topical hashtags, such as `#privacy`, `#webdev`, `#infosec`. Replies are written by the maintainer, never automated.

## How to tell whether a channel works

Measures that don't need tracking on the site:

- **Replies and comments from people outside the maintainer's existing network.** The main signal before launch.
- **Follows and reposts**, from each platform and from Buffer's insights (30-day history on Free, so record them before each review).
- **Link clicks** reported by the platform or Buffer, once posts carry links.
- **Google Search Console** after launch: impressions and clicks for use-case pages, and whether branded searches ("blur my image") grow after launch posts.
- **Referrers**: the README promises no analytics cookies and no tracking pixels. Whether to add a cookieless, aggregate referrer count is a product decision; until then, rely on the platform-side numbers above.

Review dates:

- **31 January 2027**, after about eight weeks of build-in-public. A channel with fewer than five replies from strangers over the period gets dropped or swapped (X is the first candidate to replace Bluesky; YouTube or Pinterest replace whichever channel loses after launch). The threshold of five is a judgment call for a pre-launch project, not an industry benchmark.
- **30 days after launch**: same check, plus Search Console and link clicks.

## Decisions for the maintainer

1. **Personal or project accounts.** The recommendation is personal accounts for LinkedIn, Bluesky and Mastodon: build-in-public reads as a person, LinkedIn pages start at zero, and HN and Reddit expect the maker to post. Reserve a project handle (for example `blurmyimage`) on each anyway, so nobody else takes it.
2. **Bluesky handle.** A domain handle (`@blurmyimage.<domain>`) once the domain is chosen. There is no domain in [hosting.md](../hosting.md) yet.
3. **Mastodon server.** Each candidate has a catch. Rules quoted from each server's public rules API (`/api/v1/instance/rules`, read 22 November 2026):
   - fosstodon.org is invite only, and its rules say "DO NOT use automated tools to post without also monitoring and/or interacting from your account."
   - infosec.exchange needs approval, limits automated public posts to one an hour, and says "LLM and AI operated accounts are not permitted."
   - hachyderm.io needs approval, and project accounts must be "visibly approved."
   - mastodon.social is open, but its rules say "use of generative AI must be disclosed."
   A personal account on infosec.exchange or hachyderm.io fits A1 best, as long as the maintainer writes the replies himself.
4. **AI-drafted posts.** Our posts are drafted by agents and approved by the maintainer. dev.to bans AI-assisted articles that promote your own project, and mastodon.social requires disclosure. Either the maintainer rewrites posts for those two in his own words, or they carry a disclosure. Bluesky and LinkedIn have no such rule ([Bluesky](https://bsky.social/about/support/community-guidelines), [LinkedIn](https://www.linkedin.com/legal/professional-community-policies)).
5. **Reddit and HN accounts.** Launch posts need accounts with real history in those communities. If the maintainer doesn't have them, start taking part now, not on launch week.
