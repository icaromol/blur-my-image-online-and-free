# Audience and personas

Who uses a free browser blur tool, why, and which of those people to reach first. Researched November 2026. Every claim below links to its source; where the evidence is thin, the text says so.

## What the research could and could not answer

- **No search-volume numbers.** Public sources don't publish monthly volumes for "blur image", "pixelate image" or "blur face". The ranking of segments below is inferred from behavior evidence (surveys, platform policies, competitor positioning), not from keyword data. Replace it with real numbers from Google Search Console once the site is live, and from Google Ads Keyword Planner or Bing Keyword Planner before that.
- **No demographics for competitor sites.** Similarweb and Semrush pages for blur.me, Pixelied and others give traffic sources, not age or gender. The one useful signal: [Semrush shows blur.me gets about 49% of its traffic from Google organic and 24% direct](https://pl.semrush.com/website/blur.me/overview). Blur tools are found through search, not social.

## Why people blur images

Five motives show up across sources. Each maps to one effect in v1.

| Motive | Typical image | Effect | Evidence |
| --- | --- | --- | --- |
| Hide data in a screenshot before sharing it | Chat, order page, dashboard, bug report | Pixelate | Support teams treat screenshots as a PII leak path: [unredacted screenshots attached to tickets create extra copies of customer data](https://www.supportbench.com/?p=25698); [BrowserStack's bug capture can't hide data, so redaction has to happen before upload](https://www.browserstack.com/docs/bug-capture/reports/sensitive-info) |
| Hide a license plate or address in a sales listing | Car, flat, house photo | Pixelate | [carsales in Australia now blurs plates in listing photos automatically, citing number plate cloning](https://business.carsales.com.au/insights/auto-industry-news/carsales-innovation-tackles-number-plate-cloning/), which shows the demand is real. Other motives (scams, bots scraping plates) are **unverified**: the Autotrader article earlier cited here now shows "page unavailable" and, by its search summary (not read), advises against covering the plate; the Jalopnik link earlier cited here redirects (301) to a live 2015 article, "Why Do We Always Blur License Plates On The Internet?" (Doug DeMuro), which argues that covering plates is unnecessary. Neither supports a reason to cover a plate |
| Hide a child's or bystander's face before posting | Family, school, event photo | Pixelate or Gaussian | [19% of US parents cover their children's faces](https://www.hostingadvice.com/studies/parents-use-of-social-media-statistics/); [only 5% of Germans do it in holiday photos (YouGov for eco, June 2025)](https://international.eco.de/presse/holiday-photos-only-5-per-cent-blur-childrens-faces/), so the habit is growing from a small base |
| Protect a person in a published photo | Protest, news, source photo | Pixelate plus metadata removal | [Newsrooms routinely blur vulnerable people](https://verificationhandbook.com/book/chapter9.1.php); [RSF tells journalists to strip metadata and prefer offline tools](https://resources.rsf.org/work-with-open-source-intelligence-part-1-extracting-information-from-online-images/); [Fstoppers: blur faces and strip metadata from protest photos](https://fstoppers.com/hacks/how-blur-faces-and-strip-metadata-your-protest-photos-and-why-you-should-do-it-491839) |
| Make a photo look better | Portrait background, product shot, thumbnail | Gaussian, Motion | Every mass-market editor sells this: [Canva](https://www.canva.com/features/photo-blur/), [Picsart](https://picsart.com/photo-effects/blur-image/), [Adobe Express](https://www.adobe.com/express/feature/image/effect/blur) |

The first four motives are about privacy. That's the ground this product can own, because the image never leaves the device (except when loaded by URL, which goes through a proxy; see the "Private by construction" pillar) and the export drops EXIF. The fifth motive is the biggest market, and Canva and Adobe already own it.

## What frustrates people with current tools

1. **Uploading a sensitive image to a stranger's server.** It's the most repeated reason people build their own blur tools: ["I got tired of uploading sensitive images to random websites"](https://dev.to/wplacetool/i-got-tired-of-uploading-sensitive-images-to-random-websites-so-i-built-a-local-only-blur-tool-581l), ["most tools required uploading the image, which isn't ideal for privacy"](https://dev.to/atharvtathe/i-built-a-simple-tool-to-pixelate-images-instantly-free-no-upload-required-2o34). The many look-alike launches ([BlurPrivacy](https://www.producthunt.com/products/blurprivacy), [Image Blur Editor](https://www.producthunt.com/products/image-blur-editor/reviews)) confirm the demand. The market is also crowded with that claim, so "no upload" alone won't set us apart.
2. **Watermarks, sign-up walls and daily limits.** [Kapwing watermarks free exports](https://www.kapwing.com/tools/blur/image); [Canva requires an account and limits free downloads](https://www.datanumen.com/blogs/11-best-blur-picture-tools-free); [BlurMe is freemium from $9.99 a month](https://www.blur.me/blog/blur-online-complete-guide/).
3. **A weak blur that leaves text readable.** Several free tools blur too little (see [research.md](../research.md#3-online-blur-tools)). [Redaction guides warn that blur can still leak short strings](https://convertandedit.com/blog/support-screenshot-redaction-workflow/).
4. **Too much editor for one task.** Photopea and Canva are full editors; most of these jobs take ten seconds.

## Segments, ranked

The ranking weighs three things: how often the person needs the tool, how much the no-upload promise matters to them, and whether we can reach them without paying for ads.

| # | Segment | Frequency | No-upload matters | Reachable through | Priority |
| --- | --- | --- | --- | --- | --- |
| 1 | Work screenshot redactors: support, QA, developers, PMs, technical writers | Weekly | Very high: company data, often a policy rule | Search, dev.to, Hacker News, Reddit (r/sysadmin, r/webdev), GitHub | **Primary** |
| 2 | Everyday screenshot sharers: chats, receipts, bank pages for social posts or disputes | Occasional, very large group | Medium: the concern is real but rarely put into words | Search ("blur text in screenshot", "pixelate name") | **Primary by volume**, served by the same pages as #1 |
| 3 | Private sellers and small agents: cars, rentals, real estate | Per listing | Medium | Search ("blur license plate"), seller forums, r/askcarsales | **Secondary** |
| 4 | Parents and school or club comms volunteers | Monthly | High: images of children | Search, parenting and school-admin groups | **Secondary** |
| 5 | Journalists, activists, researchers | Bursts | Very high, plus EXIF removal | Press-freedom and OSINT circles, Mastodon, newsletters | **Amplifier**: small group, but its recommendations carry trust |
| 6 | Creators wanting an aesthetic blur | Frequent | Low | Search, TikTok, YouTube | **Not targeted in v1.** Canva owns it; we still rank on "blur background" pages if they convert |

## Personas

Fictional composites built from the evidence above. Use them to check whether a piece of copy speaks to someone real.

### P1. The work screenshot redactor (primary)

- **Who:** support agent, QA tester, developer or technical writer, 22 to 45, desktop, Chrome or Firefox. Pastes screenshots into Jira, Zendesk, Slack, GitHub issues or docs several times a week.
- **Job to be done:** "When I need to share a screenshot that shows customer or company data, I want to hide those parts in seconds, so I can send it without breaking policy or leaking anything."
- **Today:** Snagit or Greenshot if the company pays, a black box in Paint, or the first search result, often feeling uneasy about uploading.
- **What wins them:** `Ctrl+V` straight from the clipboard, brush-on pixelate, keyboard shortcuts, nothing uploaded and a way to verify it (no request uploads the image: after the page loads, the DevTools Network tab shows no POST and no request to another site, only the app's own code files, because PixiJS loads after first paint and the WebP encoder loads on Safari export; **after BMI-050 only:** open source code they can read, since the repo is private until then and "open source" can't be said before it's public). Honesty that blur isn't redaction reads as competence to this group.
- **Objections:** "How do I know it doesn't upload?" → a DevTools network check, once the site is live (BMI-003). **After BMI-050 only:** add "and the code is open source". The check applies to images opened from a file, drop or paste, and has one expected exception: loading by URL goes through the proxy (see the "Private by construction" pillar). Two limits to state with it, so the check isn't oversold: the page's security policy is `connect-src 'self' https:` (`security-headers.ts`), which doesn't block sending data over https, so the check shows what the page did during the action you ran, not a rule the browser enforces; and a link starting with `http://` can't be fetched directly under that policy, so it always goes through the proxy. "Will it leave text readable?" → it can: the app warns with every effect that blur and pixelate don't reliably hide text. For a secret, cover it with a solid box in another editor or leave it out of the image.
- **Words they search:** blur screenshot, pixelate text in image, redact screenshot online, hide sensitive info in image, blur part of image.

### P2. The private seller (secondary)

- **Who:** someone selling a car or renting out a flat, 25 to 60, often on a phone, does it a few times a year. Not technical.
- **Job to be done:** "When I post photos of my car or home, I want to hide the plate, house number or family photos on the wall, so strangers can't use them."
- **Today:** a thumb over the plate, an emoji sticker, or a phone editor's markup tool.
- **What wins them:** three steps, no account, no watermark on photos they're about to publish. "Works on a phone" is **unproven**: the README doesn't state it. Don't claim it until real-device testing is done and a README line exists.
- **Objections:** "Is it really free?" → no watermark and no account, stated up front. "Will it shrink my photo?" → exports at the original resolution unless the image is larger than the graphics card can handle; then the app says so before you start and the download is the scaled size (README "Large images"). "Does it find the plate for me?" → no. Some plate tools detect plates automatically (BlurMe among the pages read in [landing/research.md](landing/research.md); the other plate pages read use manual rectangles), and this product has a brush, not detection (automatic detection is on the README backlog). Honest answer: you paint over the plate yourself, which takes a few seconds per photo. This is persona understanding, not a line for the page's opening.
- **Words they search:** blur license plate, hide number plate in photo, blur part of a picture, blur house number.

### P3. The careful parent or school volunteer (secondary)

- **Who:** parent sharing family photos, or a teacher or volunteer who runs a school, club or team account. Phone first. [District rules often require blurring students without a media release](https://procedure.washk12.org/letters/Admin/A171).
- **Job to be done:** "When I post a group photo, I want to blur the kids who can't be shown, so I can share the moment without breaking a rule or a parent's trust."
- **Today:** emoji stickers, cropping people out, or not posting at all.
- **What wins them:** the photo of a child never goes to a server when it's opened from a file, dropped or pasted (loading by URL goes through the proxy, see the "Private by construction" pillar); the brush covers several faces in one pass; no app to install. "Works on a phone" is **unproven** here too: the README doesn't state it, so don't claim it until real-device testing is done and a README line exists.
- **Objections:** "Is a blurred face really unrecognizable?" → say when a face is still recognizable, to people who know the child, and give no promise that it isn't ([the Clemson study's caveat](https://cse.buffalo.edu/~hongxinh/papers/CV-COPS2017.pdf)). "Does it find the faces for me?" → no. Searches for faces are dominated by tools that lead with automatic detection (BlurMe, WaveSpeed and iLoveIMG among the pages read in [landing/research.md](landing/research.md)), so some visitors will expect it. This product has a brush, not detection (automatic detection is on the README backlog). Honest answer: you paint the faces yourself, and one pass of the brush can cover several. This is persona understanding, not a line for the page's opening.
- **Words they search:** blur faces in photo, blur kids' faces, hide face in picture, emoji over face alternative.

### A1. The press-freedom advocate (amplifier)

- **Who:** journalist, OSINT researcher or digital-safety trainer. Writes guides and keeps lists of recommended tools.
- **Why they matter:** few in number, but one mention in a safety guide brings steady, trusting traffic.
- **What wins them:** local processing, EXIF stripped on export, a candid explanation of blur's limits with sources. **After BMI-050 only:** open source, since the repo is private until then and "open source" can't be said before it's public. Local processing has one exception to state plainly to this group: URL loading goes through the proxy (see the "Private by construction" pillar).
- **What loses them:** any overstated security claim. Never call the tool "secure redaction" or "anonymization."

## Positioning

**For** people who need to hide part of an image before sharing it, **Blur My Image** is a browser tool that blurs or pixelates in three steps. **Unlike** Canva, Kapwing or upload-based blur sites, it never uploads the image (except when loaded by URL, which goes through a proxy; see the "Private by construction" pillar), needs no account, adds no watermark and strips location metadata on export.

One-line version: *Blur or pixelate any part of an image. Image files you open, drop or paste never leave your device.* The scope ("open, drop or paste") is what keeps the line true, because loading by URL goes through the proxy (see the "Private by construction" pillar). This is the final wording from decision D-010 (`docs/product/decisions.md`). The English tagline now ends "Image files never leave your device." (`src/i18n/messages/en.json`, line 4). The pt-BR tagline is confirmed too, but marketing is English only (Q-002), so it isn't quoted here.

## Messaging pillars

| Pillar | Proof that exists today (README) | Don't say |
| --- | --- | --- |
| Private by construction | Processing in the browser; EXIF dropped on export; no analytics cookies today (README line 80; see "The analytics line" below). One exception, per the README: loading by URL when the remote server doesn't allow cross-origin access sends the image once through a stateless proxy that keeps nothing and whose code logs nothing, but Vercel keeps its standard request log (method, path including the image URL, status, IP, user agent) for 1 hour. State this wherever URL loading or "never leaves your device" is mentioned, except the landing (D-032): there Vercel's 1-hour log is left out on purpose and stays in the README | "100% anonymous", "military-grade", "secure redaction", or "never leaves your device" with no mention of the URL-loading exception |
| Free without catches | No account, no watermark; original resolution unless the image is larger than the graphics card can handle, in which case the app says so before you start and the download is the scaled size | "unlimited forever" (hosting may change) |
| Fast for one job | Paste, brush, download; Photoshop shortcuts | "the most powerful editor" |
| Honest about limits | The app warns with every effect that blur and pixelate don't reliably hide text (its exact wording may still change, so copy doesn't quote it); the README cites the PETS 2016 study | Any implication that blurred text is unrecoverable |
| Analytics and tracking | Nothing to claim: the README's "No analytics cookies, no tracking pixels" is true of the code today and is kept out of marketing (see "The analytics line") | Any analytics or tracking claim worded more strongly than the README line that BMI-082 produces |

### The analytics line

Checked against D-029 and `docs/product/specs/hosted-analytics.md` (BMI-082). D-030 is about the rate-limit message and the scorecard action, not analytics; D-029 is the analytics decision. Ícaro decided that Vercel Web Analytics and Speed Insights go on the hosted deployment only, built in a PR of its own after PR #2 merges, with nothing in the open-source code path or the Docker image.

- **Until BMI-082 is built:** the README sentence "No analytics cookies, no tracking pixels" is true of the code, but it may change (D-029 keeps it only if Speed Insights is shown to set no cookies). Marketing copy leaves it out, so no published page carries a line that the next PR can make false. The pillar's other proofs (browser processing, EXIF dropped) are not affected.
- **After BMI-082:** the README line stays only if Vercel's documentation or a preview test shows that Speed Insights sets no cookies (the spec records that Vercel's page doesn't say, so this is open); otherwise the sentence changes. What the pillar can then say is what the README and the app's notice say: the hosted site counts visits and speed, never images; clones and the Docker image don't. Per the spec's reading of Vercel's documentation (not tested), Web Analytics stores the page URL, the referrer, country, region and city, device and browser, and has no third-party cookies.
- **What the pillar can't say at any point:** "no tracking", "no analytics" or "we don't collect anything" about the hosted site once BMI-082 exists; "no cookies" before the preview test shows none; or any claim about visitor numbers or usage.

## How to keep this file current

- After launch, replace the inferred ranking with Search Console queries grouped by segment.
- Add any objection that shows up twice in feedback, issues or community threads.
- Put new evidence in the table it supports, with a link, and remove any claim that loses its source.

## Sources

Linked inline. Also see [research.md](../research.md) for the competitor and redaction research that underlies this file.
