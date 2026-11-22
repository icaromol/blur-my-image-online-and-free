# Landing page research (BMI-084, research part)

Research for the landing page copy: who the competing pages are, what people searching each intent need to see, what converts, and what the product can honestly say. Every page below was read on 22 November 2026 with a fetch tool that returns a summary of the page text, not the rendered page. Short phrases are quoted; everything else is paraphrased. The app's URL is not used anywhere in this file; where a link to the app would go, the marker is `[EDITOR-URL]` (earlier `[APP-URL]`). Since D-032 the landing is the editor's own screen with the copy underneath, so the editor and the home page share one address; `[EDITOR-URL]` and `[HOME-URL]` name the same thing and this file uses `[EDITOR-URL]`.

## Method and limits

- **Self-reported claims.** Each competitor's privacy statement is what its page says. Nobody's network traffic was tested, so "client-side" below means "the page claims client-side".
- **Text only.** The fetch returns text, so the layout of each hero (inline drop zone or a button that opens an editor) was not seen. That needs a visual pass in a browser.
- **Tool pages only.** Privacy policies linked from those pages were not read. A page that says nothing about uploads may say more in its policy.
- **No search volume.** As in [audience.md](../audience.md), no public source gives monthly volumes for these queries. Section 2 ranks nothing by volume.
- **Not read:** Canva's blur page (HTTP 403) and blur.me's license plate blog post (HTTP 410). Canva is therefore absent from the table. Other tools that appeared only in search results and were not fetched: Spyne, PixelBin, Img2Go. They are not described here.

## 1. Competitors

Nineteen pages from 18 sites were read. The rows are grouped by what the page is for.

### Editors that happen to have a blur page

| Page (read 2026-11-22) | Hero promise | Privacy handling | Asks of the user | Does well | Does badly |
| --- | --- | --- | --- | --- | --- |
| [Kapwing, Blur Image](https://www.kapwing.com/tools/blur/image) | "Blur text, faces, or entire images online." | Says nothing about uploads or retention; describes itself as cloud-based | Free exports carry a watermark; Pro removes it; prices not on the page | Names text and faces as the job | Silent on privacy; a watermark on an image you are about to publish |
| [Adobe Express, Blur](https://www.adobe.com/express/feature/image/effect/blur) | "Blur an image for free in minutes." | Says nothing about storage or deletion | Free plan, sign-in link, no limits listed | Brand trust, mobile and desktop upload | One blur type applied to the whole image; no privacy words at all |
| [Picsart, Blur Image](https://picsart.com/photo-effects/blur-image/) | "Blur your image online for free" | Says nothing; the meta description mentions "Conceal sensitive details" | Button opens the full editor; paid plans listed | Mentions the sensitive-details use | Hands off to a full editor; silent on what happens to the file |
| [Pixlr, Blur Image Online](https://pixlr.com/tools/blur-tool) | "Blur Image Online For Free": "upload, blur, and download" | Says nothing | Log-in button; some features may need a subscription | Three-verb promise | Silent on privacy; unclear whether an account is needed |
| [Fotor, Blur Image](https://www.fotor.com/features/blur-image/) | "Blur Image Online for Free" | Says photos are "automatically deleted from our server in 24 hours" and not shared with third parties | Standard editor free; AI auto-blur needs Pro | Gives a number for retention | The number admits a server copy exists for a day |
| [CapCut, Blur Images Online](https://www.capcut.com/tools/blur-image-online) | "Blur Images Online for Free" | Says nothing | Sign-up button; claims no watermark and "unlimited images" | States the no-watermark and no-limit terms plainly | Silent on privacy |

### Tools built for hiding things (faces, plates, screenshots)

| Page (read 2026-11-22) | Hero promise | Privacy handling | Asks of the user | Does well | Does badly |
| --- | --- | --- | --- | --- | --- |
| [BlurMe](https://www.blur.me/) | "Blur faces in videos & photos. Choose which faces stay visible." AI finds faces, plates and personal details | Uploads. Guest files deleted after "about one day"; encrypted in transit and at rest; not used for AI training | Free to start; account to keep files; batch needs Pro; free limits not listed | The most specific retention and no-training statements of any upload tool read | Retention is approximate; a hero about video and faces for someone who wants to hide one plate |
| [TechSmith, AI blur image](https://www.techsmith.com/tools/ai-blur-image/) | "Blur an image online for free" | Says it does not keep images on its servers and deletes them after download | Uploader shows a cap of 4 uploads a day; a Solid option carries a premium icon; upsell to Snagit | Says plainly that a solid shape is the most secure option | Paywalls the safest option and caps the free use |
| [Onlinetools.com, License Plate Blurrer](https://onlinetools.com/image/blur-license-plate-in-image) | "Image License Plate Blurrer", "World's Simplest Image Tool" | "All conversions and calculations are done in your browser"; no input data goes to its servers. Also discloses Google Analytics, StatCounter and IP logging | Sign-in links; free for personal use, commercial use needs a paid plan | Plain, specific statement of local processing, with the analytics disclosed | The hero says nothing about the job or the privacy; the disclosure sits in fine print |
| [WaveSpeed, License Plate Blur](https://wavespeed.ai/free-tools/license-plate-blur) | "Hide license plates in photos with manual rectangles" | Hero badges say "Local processing" and "No upload"; the FAQ repeats it | No sign-up, no watermark; up to 8 photos, 40 MB and 12 megapixels each | Privacy claim in the hero, exact limits, no account | Rectangles only (no brush); a search engine summary reported a contradicting FAQ on a sister page, which I could not reproduce |
| [WaveSpeed, Blur Faces](https://wavespeed.ai/free-tools/blur-faces-in-photo) | "Blur Faces in Photo", "Automatic, private and free" | "Your photos stay in your browser"; "never uploaded" | No sign-up; up to 50 photos and 50 MP each | Automatic detection with a local-processing claim | Gives no technical detail on how processing stays local |
| [Cloudinary, Blur License Plate](https://cloudinary.com/tools/blur-license-plate) | "Blur License Plate": draw boxes over plates, faces or details | The page says edits happen "inside your browser" yet shows an "Uploading photo..." status; no deletion or retention statement | No account for the tool; JPG, PNG or WebP up to 20 MB; described as ad-free | Clear, narrow job | Mixed signals on the one question that matters (read from page text; I did not watch the network) |
| [Watermarkly, Blur License Plates](https://watermarkly.com/blur-license-plate/) | "Blur License Plates Online & for Free" | Says processing runs on the device and files are not sent to its servers; notes that importing from cloud drives or a pasted link does pull files in | No account; free version limits images per batch | Discloses the import exception | No deletion policy described; price not on the page |
| [Supademo, Image Blur Tool](https://supademo.com/tools/online-image-blur-tool) | "Free Online Image Blur Tool": "Hide emails, pricing, personal data, and credentials in seconds" | "Images are processed locally in your browser" (FAQ); not uploaded except when you create a shareable link | No signup, no watermark, no limits stated | The only screenshot-specific hero read; discloses its one exception | Retention of shareable links not addressed |
| [iLoveIMG, Blur Face](https://www.iloveimg.com/blur-face) | "Easily anonymize faces in images with a blur effect." | Not stated; offers import from Google Drive and Dropbox | Login and sign-up links; no prices on the page | Familiar brand | "Anonymize" is an overclaim; silent on what happens to the file |

### Single-purpose client-side tools

| Page (read 2026-11-22) | Hero promise | Privacy handling | Asks of the user | Does well | Does badly |
| --- | --- | --- | --- | --- | --- |
| [Blurimage.io](https://blurimage.io/) | "Blur Image Online": "Paint a soft blur, pixelate a face, or blur the whole background with eight styles." | "Nothing is uploaded to a server, ever." No deletion policy needed or described | No account, no watermark, free; JPEG, PNG, WebP in | Closest to this product: brush, pixelate, many styles, invert mode, no upload | An absolute "ever" with no way to check it on the page; no redaction warning in the text read |
| [Designrevision, Pixelate Image](https://designrevision.com/tools/pixelate-image) | "Pixelate Image, Blocky Mosaic Effect, Free" | Local in the browser, not uploaded or stored | No signup, no limits stated | Says pixelation "isn't cryptographically secure" and recommends heavier blocks or solid colour | Hero sells an effect, not the privacy job |
| [Abacktools, Image Pixelator](https://abacktools.com/tools/image/utilities/image-pixelator) | "Image Pixelator" | Canvas API in the browser; "never uploaded", stored or sent | No signup; block size 1 to 256 px; free | Specific mechanism named (Canvas API); FAQ warns that blocks under 10 px may be partly reconstructed | Warning is buried in the FAQ; generic hero |
| [PineTools, Blur image](https://pinetools.com/blur-image) | "Blur image online" | Not stated; only a cookie notice and a policy link | Nothing stated | Minimal | Says nothing about privacy, limits or price |

### Reading of the patterns

1. **Silence is the most common privacy position.** Of the 19 pages, 7 say nothing about what happens to the file (Kapwing, Adobe Express, Picsart, Pixlr, CapCut, iLoveIMG, PineTools). Three state a server copy and a deletion time (Fotor, BlurMe, TechSmith). Eight claim local processing (Onlinetools.com, both WaveSpeed pages, Watermarkly, Supademo, Blurimage.io, Designrevision, Abacktools). One sends mixed signals (Cloudinary).
2. **"No upload" is already common among single-purpose tools.** This confirms the line in audience.md that the claim alone won't set the product apart. What none of the local-processing pages offered in the text I read is a way to check the claim (a DevTools step, a code link, a scope statement).
3. **Exceptions are rare and, when stated, read as honest.** Supademo (shareable link), Watermarkly (imports) and Onlinetools.com (analytics) each disclose one. Those are the three pages whose privacy text reads most believable, which supports putting the link exception up front rather than in a footnote.
4. **Absolute wording invites suspicion.** "Nothing is uploaded to a server, ever" and "anonymize" are the claims a P1 or A1 reader can't confirm. This is my reading, not measured.
5. **Redaction honesty is nearly absent.** Only Designrevision, Abacktools (FAQ) and TechSmith (solid shape) say anything about blur or pixelation being weak for secrets. None of the pages read mentions the recovery research.
6. **Face intent is dominated by "automatic"; plate pages are mixed.** BlurMe, WaveSpeed's face page and iLoveIMG lead with automatic detection; BlurMe also detects plates, while the other plate pages read (Onlinetools.com, WaveSpeed, Cloudinary) use manual rectangles. This product has a brush and no detection (section 4). My first recommendation was to say that early; D-032 says Ícaro doesn't want it opening the face section.
7. **Free terms are stated unevenly.** Watermark and sign-up are mentioned on only a minority of pages (Kapwing's watermark, CapCut's "without any watermarks", WaveSpeed, Supademo, Blurimage.io). Stating "no account, no watermark" up front is cheap and still distinguishing against Kapwing.

## 2. Search intent per persona

No search volume exists in any source I found, so the order below follows audience.md's persona ranking, not demand. How to get numbers: Google Search Console once the pages are live, and Google Ads Keyword Planner or Bing Keyword Planner before that (the same recommendation as audience.md).

Context for all five: how people are taught to check "no upload" claims. The guides that surfaced are self-published and vendor-written, so they show the method people are taught, not evidence of how many do it: [DEV Community on verifying with DevTools and CSP](https://dev.to/szp2005/making-files-never-leave-your-browser-verifiable-with-devtools-and-csp-4n99), [How to verify privacy claims yourself](https://plain-tools.vercel.app/blog/how-to-verify-privacy-claims-yourself). Their shared advice: state exactly what the claim covers, give a short Network tab procedure, link the code. They also note that a clean Network tab only covers the operation you ran.

### Pixelate a screenshot (P1 and the everyday screenshot sharers)

- **Situation.** A screenshot of a chat, order page, dashboard or bug report is about to go into Jira, Slack, a forum or a dispute. [Support teams treat screenshots as a PII path](https://www.supportbench.com/?p=25698) (source cited in audience.md).
- **Fear.** "Does this upload company data to a stranger?" and "Will the text still be readable?"
- **Proof they need.** A scoped privacy sentence, a way to check it (DevTools Network tab, source on GitHub), and a visible warning that pixelated text can sometimes be recovered. Competitors that claim local processing give no check; Designrevision and Abacktools show that an honest warning is possible on a tool page.
- **First screen.** Paste or drop prompt as the first thing, the D-010 sentence, and "no account, no watermark". Mention `Ctrl+V` since P1 lives in the clipboard. Don't promise automatic text detection.

### Hide an email or a number in a screenshot (P1, same pages as above)

- **Situation.** A specific string (email, phone, account or order number, a name) in an otherwise shareable image.
- **Fear.** Same as above, plus "is a small block enough?" [Convertandedit warns that blur can still leak short strings](https://convertandedit.com/blog/support-screenshot-redaction-workflow/) (vendor blog, cited in audience.md); the README cites the 2016 PETS study.
- **Proof they need.** The same, plus the practical rule from the README: for anything that must stay secret, cover it with a solid box in another editor or leave it out of the image (this product has no solid box yet). No advice about intensity: the study doesn't support one.
- **First screen.** The same screen as the screenshot page with the nouns changed. Supademo's hero ("emails, pricing, personal data, and credentials") is the nearest competitor line; ours should be specific about what the tool does (brush a name or number, pixelate it) rather than copy the list.

### Blur a license plate (P2, private sellers)

- **Situation.** Photos of a car for a listing. [carsales in Australia blurs plates in listing photos automatically, citing number plate cloning](https://business.carsales.com.au/insights/auto-industry-news/carsales-innovation-tackles-number-plate-cloning/) (verified by a reviewer). Other motives (scams, bots scraping plates) are unverified: the Autotrader article audience.md cited now shows "page unavailable" and, by its search summary (not read), advises against covering the plate; the Jalopnik link audience.md cited redirects (301) to a live 2015 article, "Why Do We Always Blur License Plates On The Internet?" (Doug DeMuro), which argues that covering plates is unnecessary. Neither supports a reason to cover a plate and neither is used as a source here.
- **Fear.** "Will it add a watermark to photos I'm about to publish?", "Will it make my photo smaller?", "Is the plate still readable?"
- **Proof they need.** No account, no watermark, original resolution (README "Large images" wording), and a before and after example.
- **First screen.** The job in their words (plate, listing photo), the three steps, and the free terms. Competitors on this query use rectangles or AI detection; the brush is our difference and should be shown, not just named. Phone use is unproven (section 4) so don't pitch "from your phone".

### Blur a face (P3, parents and school volunteers; also A1)

- **Situation.** A group or event photo with a child or bystander who shouldn't be shown ([district rules](https://procedure.washk12.org/letters/Admin/A171), via audience.md).
- **Fear.** "Is a blurred face really unrecognizable?" and, for the photo itself, "where does a picture of a child go?"
- **Proof they need.** The scoped privacy sentence plus the caveat that a blurred face can still be recognized by people who know the child (audience.md cites the [Clemson study](https://cse.buffalo.edu/~hongxinh/papers/CV-COPS2017.pdf)).
- **First screen.** *(Superseded by D-032 on the "no automatic detection" opener: Ícaro doesn't want it at the start of the face section; the rest stands.)* Say within the first screen that you paint the faces yourself and there is no automatic detection. The top competitor pages for this intent lead with "automatic" (BlurMe, WaveSpeed, iLoveIMG), so a reader who arrives expecting detection will leave without that sentence. The pitch is control and privacy: the brush covers several faces in one pass, and the file stays on the device. This is a reading of the competitor heroes, not tested on users.

### Generic "blur image online" (no single persona; mostly creators)

- **Situation.** Softening a background, a thumbnail, a stylized look.
- **Competition.** Adobe Express, Picsart, Kapwing, Fotor, Pixlr and CapCut all lead this query on the pages read, each with a free promise and silence about privacy.
- **Fear.** Little privacy fear; the worries are watermark, sign-up and quality.
- **First screen.** Don't compete on aesthetics, in line with audience.md (creators are not targeted in v1). Use the generic query only for visitors who are already on the page for another reason. Don't promise "blur background": the invert brush is on the backlog, so the only route today is painting over the background by hand or blurring the whole image.

## 3. Conversion patterns for a free single-purpose tool

Evidence here is thin. I found no conversion benchmarks for free single-purpose tool pages. What follows combines the one study found, the competitor pages read, and judgment. Treat the recommendations as hypotheses to check in Search Console and with referrer counts, not as measured results.

**What a first screen should do.**
- **The product usable above the fold.** [NN/g's 2018 eye-tracking study](https://www.nngroup.com/articles/scrolling-and-attention/) (read 2026-11-22) found about 57% of viewing time above the fold and 74% in the first two screenfuls, down from 80% above the fold in 2010. It is a general study, not about tools. For a three-step tool, a drop and paste zone in the first screen means the visitor can do the job without scrolling. Whether the competitors do this wasn't visible in text; the fetch of Picsart and Kapwing suggested a button that opens an editor, which adds a step.
- **One sentence for the job, one for the privacy scope.** The H1 says what you can do; the line under it is the D-010 sentence, exactly.
- **Free terms visible without a click.** "No account, no watermark", because Kapwing's watermark and sign-up walls are named as frustrations in audience.md.
- **Link next to the drop zone.** Paste a link is a fourth input; the link notice must sit under that field (as the app already does) and be repeated on the page.

**Proof elements** (each exists today; none are claims we'd have to invent):
- A before and after image of a screenshot with a name pixelated (to be produced; no asset exists yet).
- The DevTools check: open the Network tab, load an image from a file, and see no upload. Scoped to files, with the link exception stated beside it. The app's CSP is `connect-src 'self' https:` (`security-headers.ts`), so the policy doesn't forbid outgoing requests; the check proves behavior, not a browser-enforced rule. Don't write "enforced by CSP".
- A link to the public repo (MIT). Verified public and MIT on 22 November 2026 ([GitHub](https://github.com/icaromol/blur-my-image-online-and-free)).
- The blur-is-not-redaction warning, on the page and not only in the app.
- No fake social proof: no user count, no ratings, no "trusted by". None exist.

**FAQ content that matters** (questions drawn from the personas' objections):
- Does it upload my image? (D-010 sentence, then the link exception.)
- How do I check that? (DevTools procedure, link to code.)
- Is a blurred or pixelated image safe for secrets? (The warning, with the study.)
- Does it find faces or text for me? (No.)
- Is it really free, with no watermark or account?
- What formats and sizes does it take, and does it shrink my photo? (README wording.)
- What does "through our server" mean for a link? (The notice, plus the one-hour request log from the README. Superseded by D-032: the log is not wanted in the FAQ; it stays in the README.)
- Is it open source?
Note for structured data: Google's documentation says the FAQ rich result "is no longer shown in Google Search results" (read 2026-11-22; the page puts the end date at 7 May 2026 and records the doc removal on 15 June 2026). FAQ markup earns no rich result any more. The FAQ is still worth writing for readers and for long-tail queries, but it is not a reason to add markup. [Google's software app documentation](https://developers.google.com/search/docs/appearance/structured-data/software-app) (read 2026-11-22) lists `name`, `offers.price` and one of `aggregateRating` or `review` as required, and supports `WebApplication`. We have no ratings or reviews and must not invent them, so the app rich result isn't available honestly. I did not test eligibility. SEO should decide whether plain `WebApplication` markup without those is worth adding.

**Calls to action.** One action, the tool itself. For the page: the drop zone is the CTA, and a secondary text link to the repo for the people who want to verify. Avoid sign-up, newsletter and download prompts, which contradict the product. Funding (BMI-083) is a separate decision and not part of this page.

**What pages like this get wrong about privacy** (from section 1):
- Saying nothing, so a reader with sensitive images has to guess (7 of 19).
- Absolute wording ("ever", "anonymize") with nothing to check.
- A local-processing claim next to evidence of an upload step (Cloudinary), or next to analytics in fine print (Onlinetools.com).
- Stating deletion after N hours as if it were a privacy feature, when it means a copy exists on their server.
- Hiding a real exception. The ones that disclose it (Supademo, Watermarkly) read more credibly.
- Treating blur as safe for text.

## 4. What the product can honestly claim today

Sources: [README.md](../../../README.md), `src/input/url.ts`, `src/i18n/messages/en.json` and decisions D-010, D-016 and D-025 in `docs/product/decisions.md`. The README labels itself pre-release and the site is not deployed at the time of writing (status line), so nothing here promises availability.

### Can claim

| Claim | Basis |
| --- | --- |
| Three effects: Gaussian (smooth), Pixelate (square blocks), Motion (streaks, angle 0 to 180 degrees) | README "Blur effects" |
| Intensity 1 to 100, scaled to the image's shorter side so the setting looks the same on a small and a large image | README "Controls" |
| Blur the whole image, or paint with a brush; eraser restores the original pixels; each stroke keeps the effect and intensity chosen at that moment, so one image can have a light gaussian blur on the background and pixelation on a face | README "Blur it" |
| Undo and redo; shortcuts `B`, `E`, `[`, `]`, `Ctrl/Cmd+Z`, `Ctrl/Cmd+Shift+Z`, `Ctrl/Cmd+V` | README "Keyboard shortcuts" |
| Load by file picker, drag and drop, paste (`Ctrl+V`) or link | README "Load an image" |
| Opens whatever the browser can decode: PNG, JPEG, WebP, GIF (first frame), AVIF and BMP in all current browsers | README |
| Saves as PNG, JPG or WebP at the original resolution; if the image is larger than the graphics card limit it is scaled down, and the app says so before editing | README "Export" and "Large images" |
| Exported files carry no EXIF (camera model, timestamps, GPS) | README "Privacy" |
| No account, no watermark, free | README intro |
| Image files you open, drop or paste never leave your device | D-010 (final wording), README line 3 |
| Links are fetched through our server, files you open, drop or paste never leave your browser | The app's notice, `en.json` line 20 |
| Open source, MIT, public repository | LICENSE; the repository page read on 22 November 2026 |
| Blur is not redaction: blurred and pixelated text can sometimes be recovered, and the 2016 study's authors concluded neither is viable for redacting text; for a secret, cover it with a solid box in another editor or leave it out (this editor has no solid box yet). No advice about intensity: the earlier "heavy pixelate as a minimum" was removed from the README (D-033) because the study doesn't support it. The app warns with every effect that blur and pixelate don't reliably hide text; the wording of the warning's own second sentence is the owner's to change (Q-023) and the copy must not quote it | README "Blur is not redaction"; the app shows a warning with every effect (Q-025) |
| English and Brazilian Portuguese interface | README "Languages" (marketing stays English, Q-002) |

### The link exception, stated precisely

The first thing to see is that the "100 MiB cap on links" is only half the picture. What the code does:

1. For a link, the browser first makes a direct request to the image's own server. Our server isn't involved. `MAX_DIRECT_BYTES` in `src/input/url.ts` is 104,857,600 bytes (100 MiB) and a larger file gets the `too_large` error (D-025).
2. If that server refuses cross-origin access, the image goes once through the proxy. There the cap is `MAX_BYTES`, default 4,400,000 bytes (about 4.2 MiB), per the README and `server/proxy/config.ts`.
3. The proxy keeps nothing and our code logs nothing, but the README says Vercel keeps its standard request log for one hour, including the image URL and the visitor's IP.

So "links up to 100 MiB" is true only for hosts that allow direct access, and is misleading as a flat statement. The README doesn't mention the 100 MiB figure at all. A safe form is to leave the number out of the hero and, if it appears in the FAQ, give both numbers and the reason. Also, backlog item BMI-137 records that on phones the real ceiling for big files is decoding memory, which is another reason not to put a size promise in the hero.

### Must not claim

| Don't say | Why |
| --- | --- |
| "Detects faces", "automatic", "finds text" or "finds plates" | Automatic face detection is on the README backlog, not built |
| "Secure redaction", "anonymize", "irreversible", "unrecoverable", "100% private/anonymous", "military-grade" | Blur and pixelate can be reversed; audience.md bans these words |
| "Never leaves your device" with no scope, or "nothing is ever uploaded" | Links go through the server; D-010 exists to prevent this |
| "Enforced by CSP", "your browser blocks uploads" | The CSP allows `connect-src https:`; the check shows behavior |
| "No logs", "we keep nothing" applied to links | Vercel's one-hour request log holds the URL and IP |
| Anything about analytics, tracking, cookies or metrics, including "no tracking" or "no analytics cookies" | The README line exists today, but hosted analytics is under decision (D-029 and the backlog item that changes README line 80). The page must not carry a claim that could become false. Wording waits for that decision |
| "Works on phones" or "mobile-friendly" | audience.md and README: unproven until real-device testing and a README line |
| "Blur background", "invert brush", "solid box", "radial", "tilt-shift", "batch", "HEIC" | Backlog items |
| "Works offline", "no server at all" | Not in the README; I didn't check for a service worker, so treat as unproven |
| "Free forever", "unlimited" | Hosting may change; audience.md bans it |
| User counts, ratings, stars, testimonials, "trusted by" | None exist |
| Phone, chat or email support promises | The README describes no support channel (GitHub issues only, under Contributing); do not imply any |
| The app's URL | D-016: stays out of marketing until the maintainer says; use `[EDITOR-URL]` |

## 5. Open questions for the maintainer

Answered by Ícaro in D-032 (2026-11-22); the questions and my recommendations are kept as they were asked.

1. **Where does the page live.** Is the landing page its own page with a link to the app, or the app's own screen with the copy below it? It changes the first-screen advice (a drop zone in the hero is only possible if it is the app). *(Answered by D-032: the app's screen with the copy underneath; the hero has the editor's drop zone.)*
2. **Link sizes in the copy.** State both caps (100 MiB direct, 4.4 MB through the server) in the FAQ, or leave sizes out of the page? I recommend FAQ only. *(Answered by D-032: the FAQ states both.)*
3. **The one-hour request log.** Include it in the FAQ next to the link notice (the README says it; audience.md says state it wherever URL loading is mentioned)? I recommend yes. *(Superseded by D-032: not wanted in the FAQ; it stays in the README.)*
4. **Say "no automatic detection" on the face section?** I recommend yes. *(Superseded by D-032: not wanted at the start of the face section.)*
5. **Phone claim.** Has real-device testing been done? Until it has, the page stays silent. *(D-032: silence about phones.)*
6. **Analytics line.** What will the page say about analytics once the hosted-analytics decision is made? Until then it says nothing. *(D-032: silence about analytics.)*

## 6. Personas: what holds, what the research changes

audience.md is not edited. These are proposed changes for the strategist to make once the maintainer has seen them.

**Still holds**
- **P1 (primary).** The pages read show tools built for this exact job: Supademo's hero targets screenshots with emails, pricing and credentials, and TechSmith pitches auto-redaction of visible text. The job exists and has competitors. The P1 words (blur screenshot, pixelate text, hide sensitive info) match those heroes.
- **"No upload alone won't set us apart."** Confirmed: 8 of the 19 pages claim local processing. The remaining differentiators are a way to verify, an honestly stated exception, brush plus eraser plus three effects, and a visible redaction warning.
- **Frustration 2 (watermarks and sign-up walls).** Kapwing's watermark on free exports is confirmed on its own page today. Canva's account requirement and BlurMe's $9.99 price in audience.md were not re-verified (Canva returned 403; BlurMe's page read doesn't list prices).
- **A1.** Nothing read contradicts it. The Supademo, Watermarkly and Onlinetools.com disclosures show exceptions stated plainly are a recognised pattern, which fits A1's reaction to overclaiming.
- **P2 and P3 reachable through search.** Plate and face queries return dedicated pages, consistent with audience.md's reading that blur tools are found by search.

**What the research changes (proposals)**
- **P3 and P2 get a new objection: "Does it find the faces or the plate for me?"** Competitor heroes for face intent lead with automatic detection, and some plate tools detect plates too. Answer: no, you paint them; the brush covers several faces in one pass. Add it to both personas' objections and to the "Don't say" column of the pillars.
- **P1's proof needs a scope caveat the file already half has.** audience.md says the Network tab "shows no POST and no request to another site". The CSP is `connect-src 'self' https:`, so it's a behavioral check, not an enforced rule, and a clean tab covers only the action run. Add that wording to the objection answer.
- **The positioning's "strips location metadata on export" holds** but the pillar line about "no analytics cookies" should be re-checked against the hosted-analytics decision before the landing copy goes out.
- **Segment 2 (everyday screenshot sharers) has no proof of intent separate from P1 yet.** The research found no source for a distinct query set. The same page serves both; nothing changes, but the "Primary by volume" label is still an inference, as audience.md says.
- **Link caps.** The persona text about URL loading doesn't mention the 100 MiB direct cap or that the proxy cap is 4.4 MB; add it if the FAQ states sizes.
