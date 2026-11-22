# Landing page SEO (BMI-084, SEO part)

> Structure pending Q-024: page-by-page sections below assume separate use pages; D-032 makes the home the app screen with the copy below.

Written 2026-11-22 for the copywriter and for BMI-078 (the page build, ui lane). English only (Q-002). Nothing here is published. Two address markers are used, because they can differ: `[EDITOR-URL]` is the address the call-to-action button opens (the editor), and `[HOME-URL]` is the address of the landing page itself, the one that goes in the canonical tag, the sitemap and the JSON-LD.

## What this file can and cannot say

- **No search volumes and no difficulty scores.** None of the public sources read for this file states a monthly volume for these queries, and `audience.md` says no keyword data exists yet. Every volume judgment below is "unknown, needs Search Console or a keyword tool". The tools that would answer it: Google Search Console after launch (real impressions per query), Google Keyword Planner or Bing Keyword Planner before.
- **Evidence used, and its limits.** Three kinds, each marked where it appears:
  - `[AC]` Google autocomplete, read from `suggestqueries.google.com` on 2026-11-22 (language en, country US, no account). It shows which phrasings exist and how many continuations Google offers, not how often anyone searches. A query with ten suggestions has more phrasing variety than one with two. That is all it proves.
  - `[SERP]` a page title or heading that appeared in the results of a web search on 2026-11-22.
  - `[FAQ-seen]` a question on a competitor's FAQ, read on the competitor's page on 2026-11-22.
- **"People Also Ask" was not seen.** The search tool I had returns result lists, not the PAA box, and a direct fetch of Bing's result page returned unrelated pages. So no question below is labelled PAA. Questions are `[AC]`, `[FAQ-seen]`, or `[inferred]` (my guess at what a person would ask, not seen anywhere). Replace the inferred ones with PAA and Search Console queries once someone can look at a real browser SERP.
- **Rankings are a snapshot** from one search, one country, one day, with no personalization control. Treat the "who ranks" lists as examples of the format, not as a position report.

## 1. Keyword map

Personas are P1 (work screenshot redactor), P2 (private seller), P3 (parent or school volunteer), A1 (press-freedom advocate), from `docs/marketing/audience.md`.

### Cluster A. Blur a license plate (P2, secondary persona)

- **Primary phrase:** `blur license plate`
- **Intent:** do it now. A few variants are "learn".
- **Volume:** unknown, needs Search Console or a keyword tool.

| Variant or question | Seen | Notes |
| --- | --- | --- |
| blur license plate in photo | `[AC]` | The photo variant is our target. |
| blur license plate online free | `[AC]` | |
| blur a license plate / blur out a license plate | `[AC]` | |
| blur number plate, blur number plate in photo | `[AC]` | UK and Australian wording. Same page, no separate page. |
| hide license plate in photo, hide number plate in photos | `[AC]` | |
| pixelate license plate in image | `[SERP]` | Title of an onlinetools.com page. |
| why hide license plate in photos, why blur license plate in photos | `[AC]` | Learn intent. Answer in a section, not a page. |
| blur license plate in video, capcut, davinci resolve, premiere pro, iphone | `[AC]` | **Not served.** The app edits images, and phone support is unproven. These dominate the autocomplete list, so expect much of the head term's traffic to be video editors. |
| blur license plate in photoshop | `[AC]` | Competitor is Photoshop. Not served. |
| Are plates detected automatically? | `[FAQ-seen]` WaveSpeed | Answer is no. |
| How to blur multiple plates in one photo? | `[FAQ-seen]` Cloudinary | |
| What is the difference between blur and pixelate? | `[FAQ-seen]` Cloudinary | |
| Is it legal to show a plate in a photo? | `[inferred]` | **Do not answer on the page** (section 4). |

**SERP:** tool pages with the tool on the page (Cloudinary, onlinetools.com, WaveSpeed, Watermarkly, Pixelbin, Spyne, Plate Recognizer, Kapwing), vendor how-to posts (blur.me blog, YouCam Perfect, MiniTool), video-editor tutorials (a university wiki page on DaVinci Resolve), one Apple Discussions thread. The winning format is a page whose H1 is the task, a working tool above the fold, three or four steps and a short FAQ. Two of them make the same privacy claim we would: WaveSpeed says "Done in your browser. Your images are not uploaded", and onlinetools.com says "All conversions and calculations are done in your browser using JavaScript". Both are manual (draw a box). Spyne and BlurMe sell automatic plate detection, which we don't have.

### Cluster B. Blur or pixelate text in a screenshot (P1 primary, P2 secondary)

- **Primary phrase:** `blur text in screenshot`. This beats `pixelate screenshot` on the one measure we have: autocomplete returned nine continuations for the first and two for the second `[AC]`. That is phrasing variety, not volume.
- **Intent:** mixed. People who want a tool now, and people who want to know how on their device (Windows, Mac, iPhone, Android).
- **Volume:** unknown, needs Search Console or a keyword tool.

| Variant or question | Seen | Notes |
| --- | --- | --- |
| blur text in screenshot windows / mac / iphone / android | `[AC]` | OS and phone modifiers. We can serve the browser on a desktop. Phone is unproven (audience.md), so no phone claims. |
| how to blur out text in screenshot | `[AC]` | |
| how to hide name in screenshots, how to hide text in screenshot | `[AC]` | The persona phrase "hide name in screenshot" exists. |
| redact screenshot, redact info from screenshot, redact text in screenshot | `[AC]` | The P1 word. Our honest answer is "blur is not redaction", so this wording needs care. |
| censor screenshot | `[AC]` | |
| can you pixelate a picture | `[AC]` | A question form. |
| pixelate screenshot online | `[SERP]` | I searched this phrase. Evernote, Fotor, Canva and a Chrome extension came back. |
| blur email in screenshot, blur phone number in screenshot, hide email in screenshot | not seen | No autocomplete continuation for any of the three. The task phrasing exists in `audience.md` but Google offered nothing. Use as body text, not as a target. |
| how to see blurred text on screenshot | `[AC]` | The opposite intent (recover text). **Not served.** The page may say plainly that pixelated text can sometimes be recovered, with the study cited, and says nothing about how. |

**SERP** for "blur out email address in screenshot", "how to blur text in a screenshot windows" and "pixelate screenshot online": TechSmith (several posts and Snagit tutorials), Setapp, Zight, Xnapper, Evernote, Groovypost, Icecream Apps, a dozen Chrome extensions (Secret Blur, Email Blurrer, BlurShot, others), Canva and Fotor feature pages. The winning format here is a **tutorial with OS-specific steps**, written by a company that sells a screenshot app. Plain browser tools are the minority. That is the opening: a tool plus a short tutorial on one page. TechSmith's own advice in these posts is to use a solid box for anything that must be hidden for certain, which matches our warning.

### Cluster C. Blur a face in a photo (P3 secondary, A1 amplifier)

- **Primary phrase:** `blur face in photo`
- **Intent:** do it now.
- **Volume:** unknown, needs Search Console or a keyword tool.

| Variant or question | Seen | Notes |
| --- | --- | --- |
| blur face in photo online free, blur faces in photos online free | `[AC]` | |
| blur faces in pictures, blur faces in photo free | `[AC]` | |
| how do I blur out faces in a photo, how to blur faces in a photo | `[AC]` | Question forms. |
| pixelate face in photo, pixelate face online | `[AC]` | |
| blur faces in photos iphone, google pixel, samsung | `[AC]` | **Not served** (phone support unproven). |
| blur faces in photoshop | `[AC]` | Not served. |
| blur face in video, blur faces in video online free | `[AC]` | **Not served.** Video dominates the list. |
| Does it blur every face automatically? | `[inferred]` | The honest answer is no. |

**SERP:** automatic detection tools lead (Cloudinary Face Blur, iLoveIMG, Img2Go, WaveSpeed, Watermarkly, Uploadcare, SnapEdit), then how-to articles (Adobe Express, Filmora, MakeTechEasier). Most upload the photo. WaveSpeed claims local processing. The format is a tool page whose headline promise is "automatic". We cannot make that promise (no face detection, BMI-122 is a backlog idea). We compete on a different promise: you choose what is hidden, and the file stays in your browser. Expect this page to attract the people who don't need automation: one face, a few faces, a screenshot with a profile picture. State the cost plainly on the page (painting a crowd takes longer). (as an opener this is superseded by D-032 and D-033: the objection is answered in the body, not as an opener; if the owner wants it as an opener the PM asks, Q-024.)

### Cluster D. Generic: blur image online, blur part of image (home page)

- **Primary phrase:** `blur image online`
- **Intent:** do it now.
- **Volume:** unknown, needs Search Console or a keyword tool.

| Variant | Seen |
| --- | --- |
| blur image online free, blur image online brush, blur image online tool, blur image online website | `[AC]` |
| blur image online part | `[AC]` |
| blur part of image, blur part of image online, blur part of image online free | `[AC]` |
| blur part of image iphone, photoshop, powerpoint, canva, davinci resolve, premiere pro, preview | `[AC]`, mostly not served |
| blur image online background, blur background online | `[AC]`, **not served** (background blur needs the inverted brush, BMI-120, backlog) |

**SERP:** general editors and big brands (Adobe Express, Canva, Picsart, Fotor, Pixlr, PicMonkey, FotoJet, Kapwing, CapCut), single-purpose small tools (Pinetools, Wallpapers.com, Cocoshot, Coderstool, IPVoid, Blur.me). This is the crowded head term, owned by brands with large domains. A new domain is unlikely to win it early. Difficulty: unknown, needs a keyword tool; the brand list above is the only evidence. "Blur part of image online" is closer to what the brush does and is the better phrase for the home page's H2s and body text.

### Cluster E. Pixelate image (home page, secondary)

- **Primary phrase:** `pixelate image online`
- **Intent:** mostly a different job. Autocomplete for `pixelate image` shows pixel art and crafts: "with grid", "generator", "ai", "for crochet" `[AC]`. The privacy reader is a minority of that list.
- **Volume:** unknown, needs Search Console or a keyword tool.
- **SERP:** Cloudinary, Wallpapers.com, Adobe, Canva, Filestack, Fotor, CodeItBro, Blur.me. Mixed between "turn a photo into pixel art" tools and "hide something" tools.
- **Decision for the page:** use "pixelate" naturally where the product does it (hide a face, a plate, text), and don't chase "pixel art generator", "crochet" or "grid". The product has block-size pixelation, not a pixel-art generator.

### Cluster F. Trust and learn: is blur redaction? (explainer, optional)

- **Phrases:** can pixelated text be recovered, blur is not redaction.
- **Intent:** learn. Seen: the PETS 2016 paper, Bitdefender, Bishop Fox, Hackaday, Dark Reading, ITPro and Schneier all rank for that search `[SERP]`. No autocomplete continuation for "is pixelating text safe" or "can blurred text be recovered".
- **Use:** a section on each use-case page, written with the study cited. Whether to make it a page of its own is a decision (section 4). It would serve A1 and P1 and could earn genuine links from safety guides. It would not bring much search traffic by itself, judging from the empty autocomplete (evidence is weak, volume unknown).

### Cluster G. "No upload" (a trust line, not a target)

`blur image without uploading` and `blur faces in photos no upload` returned no autocomplete suggestions `[AC]`. The SERP for "blur image no upload runs in browser" is dev.to posts and Product Hunt launches, so the claim is common among small tools (`audience.md` already says so). Use the privacy sentence as a trust line on every page. Don't build a page around it.

### Where each cluster goes

| Cluster | Page | Why |
| --- | --- | --- |
| D, E | Home | Generic task, brand queries, the tool itself |
| A | Use-case page: license plate | One intent, one page |
| B | Use-case page: screenshot | Includes email, name, number: same tool, same warning, so one page, not three |
| C | Use-case page: face | One intent, one page |
| F | A section on each page; optional page later | |
| G | Not a page | |

Pages for "hide an email", "hide a phone number" and "pixelate a name" would be near-duplicates of the screenshot page, and autocomplete gave no support for them. Don't make them. One page per distinct intent, no pages per OS, city or country.

## 2. Use-case pages

### Common rules

- English only. No hreflang. The static page text isn't run through vue-i18n (Q-002).
- Plain, true claims only. What the product does today, from the README: three effects (Gaussian, Pixelate, Motion), intensity 1 to 100, brush, eraser, undo, load by file, drop, paste or URL, export as PNG, JPG, JPEG or WebP at the original resolution (or the downscaled size if the image is larger than the GPU limit), EXIF dropped on export, no account, no watermark.
- **No face detection.** You paint the area. Say so in plain words on the face page and on every page where it could be assumed. For the face section this was superseded by D-032: the owner doesn't want this opener there. Superseded by D-033 for all three pages: the objection is answered in the body, not as an opener. If the owner wants it as an opener the PM asks, Q-024.
- **No redaction guarantee.** Pixelated or blurred text can sometimes be recovered (a 2016 study recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels; its authors concluded that pixelation and blur are not viable ways to redact text.). The app warns with every effect that blur and pixelate don't reliably hide text. A solid box is not in the app yet (README backlog), so no page says "use a solid box in the app".
- **Privacy sentence** (D-010, keep exact): "Image files you open, drop or paste never leave your device." **Link exception**, same wording as the app's notice: "Links are fetched through our server. Files you open, drop or paste never leave your browser." Put the link sentence wherever the page mentions loading by URL, and in the privacy section of each page. The README says the proxy doesn't keep the image. On the landing, say only that ("doesn't keep a copy of the image"), in the privacy section, not in the hero. Never write "keeps nothing", "logs nothing" or "stores nothing" about the proxy (rule in claims-check.md). Vercel's standard request log: superseded by D-032: the landing doesn't mention it; the README keeps it.
- **Don't write** "free forever", "unlimited", "100% private", "anonymous", "secure redaction", "automatic", "AI", "works on your phone" (unproven). "Open source" is allowed now that the repo is public and MIT (backlog BMI-084).
- **The tool** appears on every page above the fold (decision 1 in section 4 asks the maintainer to confirm). Evidence: every tool page that ranks for the plate cluster has the tool on the page.
- **Title format** is `Task | Blur My Image`. All four titles below are under 60 characters, counted with a script.

### Home page

| Item | Proposal |
| --- | --- |
| Title (48) | `Blur or Pixelate an Image Online \| Blur My Image` |
| Meta description (135) | `Blur or pixelate an image in your browser. Free, no account, no watermark. Image files you open, drop or paste never leave your device.` This is `index.html` line 6 with the headline words added. It already satisfies D-010. |
| H1 | `Blur or pixelate part of an image, in your browser` (the app's own `<h1>` is "Blur My Image", `src/ui/App.vue` line 121, and only exists after JavaScript runs) |
| H2s | How it works (the README's three steps) / What you can blur: a face, a plate, text in a screenshot (each links to its page) / What stays on your device / Blur is not redaction / Questions |
| FAQ | What does it cost? (No account, no watermark. Don't say "free forever".) / Does it upload my image? / Which formats work? / Can I load an image from a link? / Is pixelated text safe to share? / How do I paste a screenshot? |
| Links out | The three use-case pages, each from its "what you can blur" line |

### Page 1: blur a license plate

Slug suggestion: `/blur-license-plate/`. Persona P2. Cluster A.

| Item | Proposal |
| --- | --- |
| Title (54) | `Blur a License Plate in a Photo Online \| Blur My Image` |
| Meta (137) | `Paint over a license plate to pixelate or blur it. No account, no watermark. Image files you open, drop or paste never leave your device.` |
| H1 | `Blur a license plate in a photo` |

H2 outline:
1. How to blur a license plate (load the photo, choose Pixelate, set the intensity, paint over the plate, download). Steps match the README. Mention the keyboard shortcuts only if the copywriter has room.
2. Pixelate or blur for a plate? (Pixelate is the README's pick for plates and faces. Don't present any intensity as protection; link to the "Blur is not redaction" section below.)
3. Several plates in one photo (paint each one. Each stroke uses the effect and intensity selected when you paint it.)
4. Why people hide plates when they sell a car (plate cloning, with carsales as the only verified source: it blurs plates in listing photos automatically for that reason, per `audience.md`. Autotrader was not opened and its summary advises against covering the plate, and the Jalopnik link redirects (301) to a live 2015 article, "Why Do We Always Blur License Plates On The Internet?" (Doug DeMuro), which argues that covering plates is unnecessary. That is a fact to know, not a source for a reason to blur, so cite neither. "Scams" and "bots that scrape plates" have no source and stay out, or go in marked unverified. Facts only, no legal framing.)
5. What happens to your photo (privacy sentence, link exception, EXIF dropped on export, no watermark)
6. Blur is not redaction (the 2016 study's finding as worded in the rules above, the in-app warning, the PETS study and Unredacter links from the README)
7. Questions
8. Other things people hide: a face (link to page 3), text in a screenshot (link to page 2)

FAQ questions the page should answer:
- Does it find the plate by itself? No, you paint it. `[FAQ-seen]` (WaveSpeed, Cloudinary state the same about their manual tools.)
- Can I blur more than one plate? `[FAQ-seen]`
- Should I pixelate or blur a plate? `[FAQ-seen]`
- Can someone undo the blur? Sometimes. The app's warning says blur and pixelate don't reliably hide text, and a plate is text. For anything that must stay secret, cover it with a solid box in another editor or leave it out. `[inferred]`
- Does the photo get uploaded? `[inferred]`
- Does the file keep the GPS location? No, export drops EXIF. `[inferred]`
- Does it work on video? No, images only. `[AC]` (video variants are the top autocomplete)
- Will it shrink my photo? Original resolution unless the image is bigger than the GPU limit, then the app tells you first. `[inferred]` (README "Large images")
- Not on the page: a question about the law.

### Page 2: blur or pixelate text in a screenshot

Slug suggestion: `/blur-text-in-screenshot/`. The user brief says "pixelate a screenshot"; I recommend leading with "blur text" because it has more phrasing variety in autocomplete (nine continuations against two) and the page says "pixelate" in the first step anyway. If the maintainer prefers `/pixelate-screenshot/`, nothing else changes. Personas P1 and P2. Cluster B.

| Item | Proposal |
| --- | --- |
| Title (53) | `Blur or Pixelate Text in a Screenshot \| Blur My Image` |
| Meta (151) | `Paste a screenshot, paint over a name or number and pixelate it. No account, no watermark. Image files you open, drop or paste never leave your device.` |
| H1 | `Blur or pixelate text in a screenshot` |

H2 outline:
1. Paste, paint, download (`Ctrl+V` or `Cmd+V` with the screenshot on the clipboard, Pixelate, brush over the name, email or number, download. The tool and the 3 steps. This is the persona's shortcut, so lead with it.)
2. Hide an email address, a name or a number (what to cover: the field plus a margin; one paragraph. Don't pad this out into one page per data type.)
3. Is pixelated text safe? (the honest section: sometimes recoverable, the 2016 study's finding as worded in the rules above, and the only advice the product can give truthfully: cover a secret with a solid box in another editor, or leave it out. Quote the first sentence of the app's warning only ("Blur and pixelate don't reliably hide text."); the second sentence ("For anything secret, cover it with a solid box in another editor, or leave it out.") is true and may be quoted in internal notes; the pt-BR is approved (Q-025). No intensity advice. Nothing on how to recover text.)
4. Pixelate or Gaussian for text (Pixelate gives square blocks, Gaussian a smooth softening, as the README's effects table says. Neither is presented as safe for a secret. No intensity advice.)
5. What happens to the screenshot (privacy sentence, link exception, EXIF dropped, no watermark. Name the check: open DevTools, Network tab, no request carries the image; `audience.md` P1 has the exact description. State it only after BMI-003 is live and someone has run it.)
6. Questions
7. Other things people hide: a face, a plate (links)

FAQ questions:
- How do I blur text in a screenshot? `[AC]` family
- How do I blur a screenshot on Windows or Mac? `[AC]`. Answer: in a browser, with the steps above. The page doesn't cover the OS tools. It doesn't promise phone support.
- Can I paste a screenshot directly? Yes, `Ctrl+V` or `Cmd+V`. `[inferred]`
- Is a pixelated screenshot safe to share? Not for passwords or document numbers. `[AC]` ("redact screenshot" family)
- Can pixelated text be read again? Sometimes. `[inferred]`; the "see blurred text" autocomplete shows people ask the reverse.
- Does the screenshot get uploaded? `[inferred]`
- What is the difference between blur and redaction? `[inferred]`
- Which formats can I save? PNG, JPG, JPEG or WebP. `[inferred]`

### Page 3: blur a face

Slug suggestion: `/blur-face-in-photo/`. Personas P3 and A1. Cluster C.

| Item | Proposal |
| --- | --- |
| Title (45) | `Blur a Face in a Photo Online \| Blur My Image` |
| Meta (129) | `Paint over faces to pixelate or blur them. No account, no watermark. Image files you open, drop or paste never leave your device.` |
| H1 | `Blur a face in a photo` |

H2 outline:
1. How to blur a face (load, Pixelate, paint over the face, download)
2. You choose the faces: there is no automatic detection (what that means: nothing is blurred that you didn't paint, and a crowd takes longer. Say it in the first screen, not the FAQ, so people who want automatic leave early and the rest trust the page.) (superseded by D-032 and D-033: the objection is answered in the body, not as an opener; if the owner wants it as an opener the PM asks, Q-024)
3. How well does a blurred face hide someone (no intensity advice. People who know the person may still recognize them. `audience.md` cites a Buffalo paper (`cse.buffalo.edu/~hongxinh/papers/CV-COPS2017.pdf`) for this caveat. I did not re-read it for this file, so the copywriter must open it before quoting any number. A search result titled "AI can rebuild blurred faces" (techpolicy.press) also came up and was not read.)
4. Several faces in one photo (one brush, several strokes, the same intensity or different ones)
5. What happens to the photo (privacy sentence, link exception, EXIF dropped)
6. Blur is not redaction
7. Questions
8. Other things people hide: a plate, text in a screenshot (links)

FAQ questions:
- Does it blur faces automatically? No. `[FAQ-seen]` on competitors (WaveSpeed, Uploadcare, Cloudinary answer yes for theirs.) (D-032 says the owner doesn't want the detection notice at the start of the face section or in the FAQ; the objection is answered in the body, D-033. The PM asks if the landing needs it, Q-024.)
- How do I blur several faces? `[AC]` family
- Can a blurred face still be recognized? `[inferred]`
- Pixelate or blur for faces? `[inferred]`
- Is the photo uploaded? `[inferred]`
- Does it remove location data? `[inferred]`
- Does it work for video? No. `[AC]`
- Can I undo a stroke or restore a face I covered by mistake? Yes: eraser, and undo. `[inferred]`

### Internal links

| From | To | Anchor idea (copywriter decides the final text) |
| --- | --- | --- |
| Home | Plate page | "blur a license plate" |
| Home | Screenshot page | "pixelate a name or number in a screenshot" |
| Home | Face page | "blur a face" |
| Each use-case page | Home | "Blur My Image" in the header, and the page's own tool CTA |
| Plate page | Face page, Screenshot page | in the "Other things people hide" section |
| Screenshot page | Plate page, Face page | same |
| Face page | Plate page, Screenshot page | same |

All links are plain `<a href>` in the static HTML, with descriptive anchors, in the body and in one shared footer. No site-wide keyword-rich footer. Every page links to every other page, which is four pages, so it needs nothing more.

## 3. Technical SEO notes for BMI-078 (ui lane)

Current state, read from the repo on 2026-11-22:

- `index.html` is the whole page: one `<div id="app">`, a `<title>` of just "Blur My Image", a meta description, Open Graph and Twitter tags (lines 5 to 15), no canonical, no structured data. The built `dist/index.html` has the same head, so every word of body content appears only after JavaScript runs.
- `public/` holds only `og-image.png`. There is no `robots.txt` and no `sitemap.xml`.
- `src/main.ts` runs `await setLocale(...)` before `createApp(App).mount("#app")`. `src/i18n/index.ts` line 46 sets `document.documentElement.lang`.
- `vercel.json` sends the CSP and other headers to every path except `/api/`.
- The bundle: `dist/assets/index-*.js` is 131,589 bytes raw. The brief says about 43 kB brotli. My own gzip -9 of the same file is 48,544 bytes. The size-limit budget for it is 45 kB. The lazy engine chunks (PixiJS and its renderers, excluding the WebP encoder and the pt-BR messages) add up to 569,030 bytes raw (165,858 gzip) as an upper bound, since not every chunk loads on every browser.

### Prerendering: what the landing and use-case pages need

The landing text must be in the HTML the server sends. Google says it runs JavaScript ("an evergreen version of Chromium") but queues rendering until "Google's resources allow", recommends server-side or pre-rendering because it "helps users and crawlers" and notes that "not all bots can run JavaScript" ([Google, JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics), read 2026-11-22). Social-card fetchers and other crawlers are the ones to worry about most: the tags they read must be in the static head. The Open Graph tags already are.

Options, simplest first. CLAUDE.md asks for the simplest implementation that solves the need and for mature libraries.

| Option | What it is | For | Against |
| --- | --- | --- | --- |
| **A. Vite multi-page, hand-written HTML** (recommended) | Four HTML files (`index.html` and three use-case pages) as Vite inputs. Each has its own static `<title>`, meta, canonical, Open Graph, JSON-LD and the page text, plus the same `<div id="app">` and `main.ts` for the tool | No new dependency. Content is real HTML with no hydration step. English only, so no i18n in the page text. The tool is unchanged | Four HTML files to keep consistent (shared header, footer and privacy block get copied or templated). Page text lives outside Vue |
| B. `vite-ssg` | Static-site generation for Vue 3. Version 28.3.0, published 2026-02-05 per the npm registry, whose peer dependencies list Vite up to `^8.0.0-0`. Needs `vue-router` and `@unhead/vue` for several pages (the `vite-ssg/single-page` build needs only `@unhead/vue`) | Landing text as Vue components, shared layout, `useHead()` for per-page tags | Adds three packages and a router to a one-screen app. Hydration has to work with the PixiJS tool and the i18n startup. Last release was nine months before this review, so check activity first |
| C. Playwright prerender script | Run the built app in the repo's existing Playwright and save the HTML | No new dependency | Custom script to maintain. The saved HTML would contain the app's own DOM, with the tool's state in it |
| D. Leave it client-rendered | Today's state | Nothing to build | Page content is invisible to anything that doesn't run JS, and indexing of a new domain relies on the render queue |

Whichever is chosen, the **title tag, meta description, canonical and Open Graph tags per page must be in the static head**, not set by Vue after load.

Specific things the build needs to get right:

1. **One `<h1>` per page, in the static HTML, with the page's phrase.** The app's `<h1>` ("Blur My Image") at `src/ui/App.vue` line 121 would be a second `<h1>`. Demote it (a `<p>` or a logo element) on the pages that carry a static H1, or accept two. This is the ui lane's call.
2. **`lang`.** `src/i18n/index.ts` line 46 sets `<html lang>` to the visitor's locale after load. A Portuguese-speaking visitor would get `lang="pt-BR"` on an English landing page. Give the static content its own `lang="en"`, or stop the landing pages from changing the root `lang`. The unit and e2e tests for the locale race (BMI-077) may touch this.
3. **First paint.** `main.ts` awaits the locale load before mounting. English is the default; the pt-BR messages are a separate chunk (`dist/assets/pt-BR-*.js`, 5,409 bytes), so a Portuguese visitor pays one extra request before the tool appears. Static landing text doesn't wait for it. The tool area should reserve its height so the late mount doesn't shift the page (CLS).
4. **Canonical.** Each page gets one absolute, self-referencing `<link rel="canonical">` in the static head, equal to its public URL, with one host and one form of trailing slash. Google prefers the canonical in the HTML and warns against changing it with JavaScript ([same Google page](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)). `og:url` in `index.html` line 8 is hard-coded to the home page and must be per page, matching the canonical. Whether Vercel serves `/blur-license-plate` and `/blur-license-plate/` as one URL depends on the project's `trailingSlash` and `cleanUrls` settings. Check the Vercel docs and test with `curl -I`.
5. **`robots.txt`** in `public/`: allow everything, `Disallow: /api/` (the proxy shouldn't be crawled, and every crawler hit costs a function call against the 30 requests per 60 s limit), and a `Sitemap:` line. `robots.txt` manages crawling; it doesn't keep a page out of Google ([Google, robots.txt intro](https://developers.google.com/search/docs/crawling-indexing/robots/intro), read 2026-11-22), so don't use it for that.
6. **`sitemap.xml`** in `public/`, four absolute URLs with a real `lastmod` for each. Four pages need no generator. It depends on the real host (decision 3 below).
7. **Status codes.** With no SPA rewrite in `vercel.json`, an unknown path should return a real 404. I did not check the live site. If a rewrite is ever added for the router, Google's guidance for single-page apps is a redirect to a URL that returns 404 or a `noindex` meta tag on the error view.
8. **Open Graph per page.** Reuse `og-image.png` or make one per page (designer). Keep `og:title` and `og:description` equal to the page's title and meta unless there is a reason. `og:image:alt` today describes a sample order sheet with a painted blur over the address, which fits the screenshot page best.
9. **Headers.** The CSP in `vercel.json` has `script-src 'self'`, which controls scripts that run. A `<script type="application/ld+json">` block is data and is not executed, so inline JSON-LD should not be blocked. I did not test it. The repo's e2e suite runs under the real CSP, so add a check that the page loads with no CSP violation. `Cross-Origin-Resource-Policy: same-origin` also applies to `og-image.png`; link-preview crawlers fetch directly and are unaffected, but a site that embeds the image from a browser would be blocked. Not tested.

### Structured data: which types fit

| Type | Use it? | Basis |
| --- | --- | --- |
| `WebApplication` (a `SoftwareApplication` subtype) | **Yes, on the home page, minimal.** Fields: `name`, `url`, `description` (same as the meta), `applicationCategory`, `operatingSystem` ("Any"), `offers` with `price: 0` | Google's software app page says "For mobile applications and web applications, Google also supports `MobileApplication` and `WebApplication`", and requires `name`, `offers.price` ("If the app is available without payment, set `offers.price` to `0`") and one of `aggregateRating` or `review` ([Google, software app structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app), read 2026-11-22) |
| `aggregateRating` or `review` | **No.** | We have no ratings and must not make any up. Without one of them the page can't qualify for the software app rich result, so the markup only describes the page. Fine, it costs little. `price: 0` states "free", so it needs removing if hosting or pricing changes |
| `FAQPage` | **Skip, or low priority.** | Google's changelog: on 2026-05-08, "This feature will no longer appear in Google Search starting May 7, 2026", and on 2026-06-15, "The FAQ rich result feature is no longer shown in Google Search results" ([Google Search Central, updates](https://developers.google.com/search/updates), read 2026-11-22). Before that, since 2023, it was limited to well-known government and health sites ([Google, 2023-08-08](https://developers.google.com/search/blog/2023/08/howto-faq-changes)). Search Engine Roundtable (2026-05-11) reports Search Console reporting ended in June 2026 and quotes John Mueller saying no changes are needed ([article](https://www.seroundtable.com/google-drops-faq-rich-results-41298.html), read 2026-11-22). Existing markup does no harm, but nothing in Google Search shows it. Whether other search engines use it, I did not verify |
| `HowTo` | **No.** | Google stopped showing How-to rich results on desktop on 2023-09-13 and dropped the report and test support ([Google, 2023-08-08, updated 2023-09-14](https://developers.google.com/search/blog/2023/08/howto-faq-changes)). The current HowTo documentation page returned a 404 when fetched on 2026-11-22 |

The FAQ stays on the page as visible text, because it answers real questions for the reader, not because of markup. BMI-084's copy list includes "structured data"; the recommendation for that item is the one `WebApplication` block on the home page and nothing else.

### Core Web Vitals risks

Google's "good" targets: LCP within 2.5 seconds, INP under 200 milliseconds, CLS under 0.1 ([Google, Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals), read 2026-11-22). There is no field data (the site has no traffic and no analytics by design), so every risk below is a thing to measure with Lighthouse or PageSpeed Insights after the build, not a result. PageSpeed Insights shows field data only once enough real visits exist.

- **LCP.** The largest element today appears only after the 131 kB script has been downloaded, parsed and run, then the locale awaited, then Vue mounted. With static landing text and a text hero (no hero image), LCP becomes the static headline or paragraph and does not wait on the bundle. A hero image or screenshot would be the LCP element instead; give it dimensions, load it with high priority and size it for mobile. There is no web font to wait for: `style.css` uses `system-ui`.
- **CLS.** The tool mounts into an empty `#app` after load. If static text sits below it, the text jumps down when the tool appears. Reserve the tool's height in the static CSS. Also check that the `.editing` layout (`App.vue` line 117) does not shift the landing text when an image is loaded.
- **INP.** The 569 kB raw (166 kB gzip) engine loads lazily when the first image is opened, so the first interaction after loading an image can include a network fetch and WebGL setup. That moment may count against INP. It can be softened by starting the engine import when the file picker opens or on pointer-down over the drop zone, which is the ui lane's call. Not measured.
- **Initial JS.** About 43 kB brotli (the brief) is small for a Vue and vue-i18n app. The budget is 45 kB, so there is about 2 kB of headroom. Anything the landing adds in JavaScript (a router, a head manager, a carousel) spends it. This is the argument for option A above: no new runtime code.
- **Bytes outside the bundle.** The CSS is 5.3 kB. `og-image.png` is not loaded by pages, only by link previews. A hero image would be the biggest new asset and should be AVIF or WebP at the sizes shown.
- **Third-party scripts.** None, by the privacy promise. Hosted metrics are BMI-082 (off by default, a build flag on the hosted project only, lazy). If enabled, they load after first paint and don't affect LCP. Re-measure when they land.

## 4. Risks, things not to do, and decisions

### Don't

- **Keyword stuffing.** Each page uses its phrase in the title, H1 and naturally in the body. No lists of "also searched" phrases, no hidden text, no repeated phrase blocks, no per-device or per-city pages. Variants in section 1 are phrasings to cover in plain sentences, not terms to insert.
- **Doorway or near-duplicate pages.** Three use-case pages exist because they are three tasks with three audiences. The shared sections (privacy, blur is not redaction) should be short and phrased for each page's context so the pages don't read as copies.
- **Claim "free forever", "unlimited" or "always free".** The README says "Free, no account, no watermark", and `audience.md` bans "unlimited forever" because hosting may change (Vercel Hobby pauses over its limits and is for non-commercial use; D-029 and BMI-083 are open on funding). "Free, no account, no watermark" is fine today. `offers.price: 0` in the markup is the same statement, so change them together if it ever stops being true.
- **Claim it blurs faces, plates or text automatically.** No detection of any kind exists (README backlog: "Automatic face detection"). Competitors' headline promise on the face and plate SERPs is automatic. Don't echo it, not in a title, a meta or an FAQ answer, and not with "smart" or "AI" wording.
- **Say anything legal about license plates.** No "it is legal to", "you must blur", "you are required", no privacy-law references, no country rules. One search result said rules differ by country and in many places a plate in a photo is not illegal, but that was a summary of a vendor blog, not a legal source, and the product shouldn't carry it. The reasons-to-blur section stays on plate cloning, with the carsales source.
- **Say "secure", "anonymous", "private by default", "military-grade", "irreversible", "redacted"** or anything that implies blur is redaction (`audience.md`, A1 "what loses them").
- **Promise phone support.** Autocomplete shows many phone-modified phrasings for every cluster. The README doesn't claim phone support and `audience.md` says not to until real-device testing is done.
- **Promise video, background blur or HEIC.** None exists. Video variants are the largest part of the plate and face autocomplete lists. A single FAQ line ("images only, no video") is the right amount of attention.
- **Use `[HOME-URL]` in a canonical, sitemap or JSON-LD before the owner decides** (D-016: the URL stays out of README and marketing text until Ícaro says; see decision 3).
- **Buy links or place them in bulk.** Directory listings and real mentions only.

### Decisions for the maintainer

1. **Tool on each use-case page, or link to the home page?** Recommendation: the tool on each page, so someone who searched "blur a license plate" can start without another click. All the ranking plate pages I read do it. Cost: four HTML entries each loading the same bundle (no extra download after the first page, since the assets are shared).
2. **Screenshot page slug and lead phrase.** Recommendation: `/blur-text-in-screenshot/`, because autocomplete variety is higher for "blur text in screenshot" than for "pixelate screenshot". Search Console should settle it after launch.
3. **The public address.** The pages need absolute canonical and sitemap URLs, and `index.html` already has fixed `og:url` and `og:image` values with the project's own domain (lines 8 and 11) while D-016 says the address stays out of README and marketing text until Ícaro says. Decide when it goes public. Also decide whether a custom domain comes first: the host Vercel provides works, but moving later means redirects and starting the URL history again. `docs/hosting.md` has no domain yet.
4. **Prerender approach.** Recommendation: option A, Vite multi-page, hand-written static HTML. Switch to `vite-ssg` only if the landing grows into something that needs components or content in several places.
5. **Structured data.** Recommendation: one `WebApplication` block on the home page; no `FAQPage`, no `HowTo`, no ratings.
6. **Close Q-001** as "no localized URLs" under Q-002 (English only for marketing). No hreflang, no `/pt-br/` pages. The in-app locale detection stays.
7. **Plate legality.** Recommendation: leave it out of every page. Confirm.
8. **A fourth page, "blur is not redaction".** Recommendation: not now. Each use-case page carries the explanation. Revisit if Search Console shows impressions for "can pixelated text be recovered" or if A1 communities ask for something to link to.
9. **Search Console.** The marketing skill allows it. Someone with the owner's account has to verify the site (a meta tag or an HTML file in `public/`, neither is a tracking script). It is the only source of real query data and the first thing to set up when the site is public.
10. **Lead with "face" or hold it back?** The face SERP is led by automatic tools, so this page is the hardest to rank and the most likely to disappoint people who want automatic. I recommend keeping it, since it serves P3 and A1 and the "you choose" promise is true, and asking again with Search Console data after launch. This is not a cut of scope, only an expectation.

## 5. What I could not verify

- Any search volume, difficulty score, click-through rate or position. No source gave one, and none is stated.
- "People Also Ask" boxes and "related searches". Not retrievable with the tools used. Questions are labelled by where they were actually seen.
- Autocomplete is a US, English, signed-out sample on one day. It was not run for the UK or Australia, where "number plate" is the usual phrase.
- Competitor page text came through a summarizing fetch and web search, so titles, H1s and FAQ lists are as reported by that fetch (Cloudinary's title tag was not shown). The privacy claims are the vendors' own and were not tested. Kapwing's blur page was reached at `/tools/blur/image`; the Evernote and Cloudinary pages were reached by the URLs in the sources.
- The Buffalo paper on face recognition and the techpolicy.press article on rebuilt blurred faces were not read.
- Whether inline JSON-LD passes the page's CSP, whether the live site returns real 404s, whether Vercel preview deployments send `noindex`, how Vercel treats trailing slashes for new static pages, and Core Web Vitals for the current build. All need a deployed build and a test.
- Whether Google or Bing still read `FAQPage` markup for anything other than the removed rich result. Mueller's remark that no change is needed is reported secondhand.
- `vite-ssg`'s current maintenance (the npm registry shows the last release on 2026-02-05, and the GitHub page didn't show release or commit dates) and its behavior with PixiJS and Vue 3.5. Not tested.
- The file-size numbers: the README's proxy cap (`MAX_BYTES` 4,400,000 bytes) and the direct-fetch cap in `src/input/url.ts` (`MAX_DIRECT_BYTES`, 104,857,600 bytes, 100 MiB) are in the code. No page in this file quotes either number, so the copywriter should check with the maintainer before putting one on the site.

## Sources

All read 2026-11-22.

- Google, [JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics)
- Google, [Software app structured data](https://developers.google.com/search/docs/appearance/structured-data/software-app)
- Google Search Central, [Updates](https://developers.google.com/search/updates) (FAQ entries of 2026-05-08 and 2026-06-15)
- Google, [Changes to HowTo and FAQ rich results, 2023-08-08](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- Search Engine Roundtable, [Google drops FAQ rich results, 2026-05-11](https://www.seroundtable.com/google-drops-faq-rich-results-41298.html)
- Google, [Core Web Vitals](https://developers.google.com/search/docs/appearance/core-web-vitals)
- Google, [robots.txt introduction](https://developers.google.com/search/docs/crawling-indexing/robots/intro)
- npm registry, `vite-ssg` 28.3.0: `https://registry.npmjs.org/vite-ssg`; GitHub, [antfu-collective/vite-ssg](https://github.com/antfu-collective/vite-ssg)
- Google autocomplete: `suggestqueries.google.com/complete/search` (client=firefox, hl=en, gl=us), about 40 queries across the clusters above
- Competitor pages: [WaveSpeed license plate blur](https://wavespeed.ai/free-tools/license-plate-blur), [Cloudinary blur license plate](https://cloudinary.com/tools/blur-license-plate), [onlinetools.com](https://onlinetools.com/image/blur-license-plate-in-image), [Kapwing blur image](https://www.kapwing.com/tools/blur/image), [Blur.me blur image](https://www.blur.me/blur-image/), [Evernote pixelate screenshot](https://evernote.com/image-annotation/pixelate-screenshot-on-the-web)
- Web searches for: blur license plate online free; pixelate screenshot online; blur face in photo online; blur out email address in screenshot; blur image online; pixelate image online; how to blur text in a screenshot windows; how to blur out a license plate in a photo; can pixelated text be recovered blur not redaction
- Repo: `README.md`, `docs/marketing/audience.md`, `docs/marketing/channels.md`, `docs/product/decisions.md` (D-010, D-016, Q-001, Q-002), `docs/product/backlog.md` (BMI-084), `index.html`, `vercel.json`, `vite.config.ts`, `package.json`, `src/main.ts`, `src/i18n/index.ts`, `src/ui/App.vue`, `src/input/url.ts`, `dist/`
