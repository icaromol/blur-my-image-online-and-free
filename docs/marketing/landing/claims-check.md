# Claims check (BMI-084)

Every factual claim in the landing copy, with where it appears and what proves it. First checked 2026-11-22 against the working tree on branch `feat/scaffold-and-proxy`; revised the same day after two reviewer reads and decision D-032.

## What changed, read this first

**The study (PoPETs 2016, Hill, Zhou, Saul, Shacham).** No reviewer could read the body of the PDF; the second reviewer extracted only the abstract. So the figures "blur radii of up to 45 px" and "blocks close to the size of the letters", the claim that the study recovered email addresses, and the advice "blocks bigger than the characters" are **not confirmed and are out of the copy**. The only study sentence on the landing is the one the abstract supports: "A 2016 study recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels; its authors concluded that pixelation and blur are not viable ways to redact text." The README's "roughly 20 px" is also not what the paper says, and the copy never used it after review.

**D-032 (Ícaro's direct answers to Q-021).**
- The home is the app's screen with the copy underneath: no page of its own, no "open the editor" button, no hero. `home.md` is about 900 words of static text under the editor, in `index.html` outside the element the app mounts in.
- The FAQ states both link limits and **not** the one-hour Vercel log. The log, the sentence "Like any host, Vercel sees your IP address on every request to the site", and "our code logs nothing" are out of the landing (the README keeps the log). Removed claims: #22, #56, and the "logs nothing" half of #21.
- The face page no longer opens with "no automatic detection". The home page has no detection statement at all. D-033 extends this: the plate and screenshot heroes do not open with it either. Their FAQs answer "does it find the plate / the text for me?" once ("You paint the area yourself; the editor doesn't pick it for you").
- Silence on phones and analytics stays.
- The three use pages are on hold (Q-024). They received only the clean-ups listed here and the markers.

**Later review rounds (same day).**
- The link-size FAQ cites no error text, because BMI-087 changes the message: "Over the limit, loading stops; download the image and open the file instead." (#32).
- The plate page says only that carsales blurs plates in listing photos automatically to make cloning harder. No reason is given for sellers (#48 removed). The Jalopnik link is not cited and not dead: it redirects (301) to a live 2015 article, "Why Do We Always Blur License Plates On The Internet?" (Doug DeMuro), which argues that covering plates is unnecessary (#67).
- "Yet" is gone from "no solid box" (a solid box is in `Later`, BMI-104; "yet" would read as a promise).
- No advice that a stronger setting protects (#64). The in-app warning and README:58 were corrected by D-033 and BMI-088 and no longer conflict with these pages.

**Also dropped from the home page for length:** #2, #8's FAQ copy, #25 (the e2e description), #28, #37 (the app's warning is not quoted).

How to read the tables. "README:78" is line 78 of `README.md`. Code paths are repo-relative. Claim numbers are stable; a removed claim keeps its number and is marked **Removed**. Advice sentences ("paint a little past the edge") are judgments, not facts, and are not listed.

Files: H = `home.md`, P = `use-blur-license-plate.md`, S = `use-pixelate-screenshot.md`, F = `use-blur-face.md`, SD = `structured-data.md`.

## Product behavior

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 1 | Free, no account, no watermark | H meta, FAQ cost; P, S, F meta and hero; SD description | README:3. The app's export hint says "No metadata, no watermark" (`src/i18n/messages/en.json`:57) |
| 2 | **Removed.** Nothing to install, it runs in the browser | none (was the home closing) | README:3 |
| 3 | Four ways to load: file picker, drop anywhere on the page, paste with Ctrl+V or Cmd+V, link | H step 1; S; P; F | README:13-18 |
| 4 | Opens whatever the browser can decode: PNG, JPEG, WebP, GIF (first frame), AVIF, BMP in all current browsers | H step 1 | README:20 |
| 5 | **Blur entire image** applies the effect to every pixel; **Brush** paints only where you drag; **Eraser** brings back the original pixels. The labels are the app's own | H step 2 | README:24-26; `en.json`:27-31 |
| 6 | Each stroke keeps the effect and intensity selected when painted; one image can mix a light Gaussian blur on the background and pixelation on an area such as a face | H step 2; P "Several plates"; F "Several faces" | README:28 (its example is a license plate; the face is another use of the same mechanism, not a separate claim) |
| 7 | Export as PNG, JPG, JPEG or WebP; JPG and JPEG are the same format and the choice sets the extension; original resolution; file named `<name>-blurred.<ext>` | H step 3; P step 5; S; F | README:30 |
| 8 | An image larger than the graphics card can handle is scaled down and the editor says so before you start | H step 3; P FAQ | README:101; `en.json`:60 |
| 9 | Intensity 1 to 100, scaled to the shorter side, so a setting looks the same on a 600 px screenshot and a 6000 px photo | H effects; P | README:52 |
| 10 | Gaussian: smooth, even softening, for backgrounds, soft focus, whole image. Pixelate: square blocks of averaged color, for hiding faces, plates, screen content. Motion: streaks in one direction, implied movement | H effects table; P; S; F | README:46-48 |
| 11 | Motion angle 0 to 180 degrees | H effects table | README:53 |
| 12 | `B` brush, `E` eraser, `[` and `]` brush size, Ctrl/Cmd+Z undo | H effects note; P steps 3-4; S step 4; F steps 3-4 | README:54, 64-71; `src/ui/shortcuts.ts`:32-60 |
| 13 | The single-key shortcuts work while the image has keyboard focus | P step 3; F step 3 (no longer on H) | README:73; `src/ui/shortcuts.ts`:43-44 |
| 14 | You paint the area yourself; the editor doesn't pick it for you. It blurs what you paint, or the whole image if you choose Blur entire image | P FAQ and S FAQ, once each, in the body (D-033). **Not on H, not in any hero, and not stated on F**: F "You choose the faces" only describes the brush ("blurs the pixels under your brush, or the whole image if you pick Blur entire image… if you miss a face, it stays visible"), which is a description of the tool, not a detection claim | README:190 lists "Automatic face detection" as backlog; README:24; `grep -i detect src/` (non-test files) returns nothing. The earlier draft that said nothing is blurred unless you paint it was false and is gone |
| 15 | Images only, not video | P FAQ; F FAQ | README:3 and 28-30 describe images only |
| 16 | A solid box is not in the editor | H redaction; S FAQ | README:180 |

## Privacy and links

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 17 | "Image files you open, drop or paste never leave your device." (exact) | H privacy, FAQ (wording close), meta; P, S, F hero | `docs/product/decisions.md`, decision D-010 (the privacy wording); README:3; `index.html`:6 |
| 18 | The browser decodes, edits and exports; no upload step, no server-side storage | H privacy; F | README:77 |
| 19 | The notice "Links are fetched through our server. Files you open, drop or paste never leave your browser." (exact) | H privacy; P; S; F | `en.json`:20; README:78 |
| 20 | For an https link, the browser first asks the image's own server; if that allows it, the image comes straight to the browser. An http:// link always goes through the proxy | H privacy, FAQ; S | README:103; `src/input/url.ts`:54-55, 68-91. The CSP `connect-src 'self' https:` (`security-headers.ts`:11-12; the comment says "anything else goes through the same-origin proxy") blocks a direct http fetch, so `fetch` throws and `url.ts`:77-81 falls through to the proxy. Reviewer-verified |
| 21 | If the image's server refuses, or the link is http://, the image passes once through our proxy, which streams the bytes back and doesn't keep a copy of the image | H privacy; P; S; F | README:78, 103, 111; `src/input/url.ts`:89-109. The half "our code logs nothing" is **removed** (D-032) |
| 22 | **Removed (D-032).** Vercel keeps a runtime log for one hour (method, path and query, status, user agent, IP) | none | README:78, which keeps the statement |
| 23 | Exported files carry no EXIF: GPS coordinates, timestamps, camera model dropped | H privacy; P; S; F | README:79; `e2e/exif.spec.ts`:132 (EXIF, GPS and XMP dropped, per the reviewer for PNG, JPG and WebP) |
| 24 | The page's security policy allows requests to other https sites, so the check shows behavior, not a lock | H "Check it yourself" | `security-headers.ts`:12 (`connect-src 'self' https:`) |
| 25 | **Removed.** `e2e/privacy.spec.ts` as the automated version of the check | none | `e2e/privacy.spec.ts`:38-63 |
| 26 | Files from the site's own address can show in the Network tab | H "Check it yourself" | `src/ui/editor.ts`:65-70; `src/engine/load-renderer.ts`:6 (code loaded after first paint); `src/ui/App.vue`:103 |
| 27 | A clean Network tab covers only the session in which you checked | H "Check it yourself" | Logical limit; research.md section 2 |
| 28 | **Removed.** "It must be an http or https link to an image" | none | `en.json`:65, 76 |
| 29 | Direct-fetch cap 100 MiB, 104,857,600 bytes | H FAQ | `src/input/url.ts`:18, 60; `src/input/url.test.ts`:180 |
| 30 | Proxy cap 4,400,000 bytes, about 4.2 MiB (4,400,000 / 1,048,576 = 4.196) | H FAQ | `server/proxy/config.ts`:9; README:108 |
| 31 | Which cap applies depends on whether the browser can fetch the file directly or the link goes through the proxy | H FAQ | `src/input/url.ts`:68-109; see #20 |
| 32 | Over the limit, loading stops; download the image and open the file instead. No error text is quoted, because BMI-087 (not yet committed) changes the generic message | H FAQ | `src/input/url.ts`:25, 41-45 (direct: declared size or stream over the cap raises `too_large`); `server/proxy/app.ts`:76 (stream cut at the cap), :205 (413 `too_large`). Whatever message the user then sees, loading does not complete. The advice to download and open the file is the app's own for `too_large` (`en.json`:77) |
| 53 | Ctrl+V with a link copied loads the link | H FAQ paste | README:18 |
| 54 | Entries starting with `blob:` are the browser handing the finished file to your downloads | H "Check it yourself" | `src/export/download.ts`:7 |
| 55 | Browser extensions can add requests of their own | H "Check it yourself" | General browser behavior, supplied by the reviewer; no repo source. The earlier "a private window usually keeps them out" is out of the home copy |
| 56 | **Removed (D-032).** Like any host, Vercel sees your IP address on every request to the site | none | General hosting fact |
| 57 | There is no paid version | H FAQ cost | README:3 ("Free"); no paid tier in README, backlog or D-029 |
| 60 | The README has a privacy section with the full details | H exception | README:75 (`## Privacy`), link anchor `#privacy` |
| 61 | The static copy sits in `index.html` outside the element the app mounts in, so a crawler reads it without JavaScript | notes in H | D-032; seo.md section 3 (`index.html` is one `<div id="app">`, copy added outside it). A design instruction for BMI-085, not a product claim |

## Source, license, cost

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 33 | The code is public on GitHub under the MIT license | H FAQ, closing | `LICENSE`:1; research.md section 3; verified by the reviewer |
| 34 | Issues and pull requests are welcome | H FAQ | README:200 |
| 35 | You can run your own copy; the README has the commands | H FAQ | README:155-160, 137-149 |
| 36 | The cost line | H FAQ | README:3; see #57 |

## Blur is not redaction

The study is PoPETs 2016, Hill, Zhou, Saul and Shacham (`crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf`). **No reviewer read the body of the PDF; the abstract on the study's page was the source.** I did not open it either.

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 37 | The app's warning is not quoted on H. F quotes only its first sentence (#63) | none on H | `effects.warning` in `en.json`:51, which now reads "Blur and pixelate don't reliably hide text. For anything secret, cover it with a solid box in another editor, or leave it out." (corrected by D-033 and BMI-088) |
| 38 | The study recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels; its authors concluded that pixelation and blur are not viable ways to redact text | H; S; P; F (conclusion only) | Abstract of the study, read by the second reviewer. Body unread. Replaces every number and the README's "roughly 20 px" |
| 39 | Tools such as Unredacter rebuild pixelated text by rendering guesses in the same font and comparing them | H; S FAQ | Bishop Fox post (2022-02-15), `bishopfox.com/blog/unredacter-tool-never-pixelation`, reviewer-verified. The post's advice is to use black bars covering the whole text |
| 40 | Neither effect guarantees that the text cannot be read again (the study recovered blurred text as well as pixelated, so the risk applies to Gaussian too) | S "Pixelate or Gaussian"; the same sentence for a plate on P "Pixelate or blur" | Same abstract (#38) |
| 41 | **Removed.** A light effect is easier to undo than a heavy one | none | Came from a figure no one confirmed |
| 42 | For anything that must stay secret, cover it with a solid box in another editor, or leave it out | H; S; P | The Bishop Fox post's conclusion (black bars over the whole text, reviewer-verified); README:58 prefers a solid box |
| 43 | A plate is text, so the text study applies | P | Logic: a plate is made of characters |
| 44 | The research is about text, not faces, so the page cannot say how a blur holds up on a face | F | The study is about text (#38) |
| 45 | Cropping removes the pixels, so there is nothing to recover | F; P | Logic. "In another editor", because the editor has no crop (README:196) |
| 46 | "We can't promise a blurred face is unrecognizable. People who know the person may still recognize them." | F, once | A hedge, not a finding; audience.md:72 cites a Buffalo paper that nobody has opened and the page doesn't cite it |
| 47 | Redaction means the information is gone; blur and pixelation can sometimes be reversed | S FAQ | Definition, plus #38 and #39 |
| 58 | **Removed.** The study recovered email addresses | none | Not in the abstract |
| 59 | **Removed.** Pixelate with blocks bigger than the characters | none | Derived from the unconfirmed block-size finding |
| 63 | The editor's warning begins "Blur and pixelate don't reliably hide text." Only this first sentence is quoted; the second sentence is about text that must stay secret and doesn't apply to faces | F "Which effect for a face" | `effects.warning` in `src/i18n/messages/en.json`:51 (the warning as it stands in the working tree, D-033). The face page gives no intensity advice: "high intensity" is gone because the study doesn't support intensity as protection |
| 64 | **Removed.** "Raise the intensity" (plate steps and section, screenshot step and FAQ), "heavy pixelation", "bigger blocks help": any wording that suggests a stronger setting protects | none (was P, S) | The study doesn't support intensity as protection; D-033 removed it from the README. The pages now give neutral interface steps ("Select Pixelate.") |
| 65 | Pixelate is the effect meant for hiding plates; Gaussian softens evenly | P "Pixelate or blur" | README:46-47 |
| 66 | A solid box or a crop in another editor is the cover for a screenshot value that must stay secret; the study is the reason | S FAQ | #38, #42 |
| 62 | Pixelation makes text harder to read; it does not make it safe | H redaction | Follows from #38; the first half is the plain meaning of the effect |

## Claims relayed or checked by the reviewer

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 48 | **Removed.** "Plate cloning is the reason sellers give most often", and any other claim about why sellers hide plates | none | No source: no research on sellers and no ranking of reasons exists. The page now states only what carsales does (#50) |
| 49 | **Removed.** The Autotrader link | none | Could not be opened; the summary says it advises against covering the plate |
| 67 | The Jalopnik link is not cited. It redirects (301) to a live 2015 article, "Why Do We Always Blur License Plates On The Internet?" (Doug DeMuro), which argues covering plates is unnecessary | none | Reviewer-verified. Not a source for any reason to blur, and not dead |
| 50 | carsales, an Australian marketplace, blurs plates in listing photos automatically to make cloning harder | P "A marketplace that blurs plates" | `business.carsales.com.au/insights/auto-industry-news/carsales-innovation-tackles-number-plate-cloning/`, reviewer-verified |

## Wording and markup

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 51 | Title and meta lengths: home 48 and 135; plate 54 and 137; screenshot 53 and 151; face 45 and 129 | Head tags | Counted by hand here and by script by the reviewer. Limits: under 60 and under 155 |
| 52 | `WebApplication` fields; `MultimediaApplication` is a valid category | SD | `en.json`:3, :66; README:3; the category is on Google's list (reviewer-verified). Not eligible for the software app rich result |

## Claims deliberately left out

| Left out | Why |
| --- | --- |
| Phones, "mobile-friendly", `operatingSystem: Any` | README makes no phone claim. D-032: silence |
| Analytics, cookies, tracking, "no tracking" (README:80) | Under decision (D-029, BMI-082). D-032: silence |
| The one-hour Vercel log, Vercel seeing the visitor's IP, "our code logs nothing" | D-032: not wanted on the landing. The README keeps them. Never add "no logs" or "we keep nothing" for links |
| "Keeps nothing", "logs nothing" or "stores nothing" about the proxy | More than the truth: the proxy code doesn't store the image, but Vercel's standard request log keeps the path (with the image URL), IP and user agent (README:78). Write only what the code does: the proxy doesn't keep a copy of the image. README:111 ("stores nothing about the image and logs nothing itself") stays, because it is limited to the image and the code and the log is stated in the README's Privacy section (line 78) |
| Any detection statement as a page opener, and any detection statement at all on the home page and the face page | D-032 (face opener), D-033 (not an opener on any page); the home FAQ question was cut with it. P and S answer it once in their FAQ. If the owner wants it as an opener, the PM asks (Q-024) |
| "Free forever", "unlimited" | Hosting may change (hosting.md) |
| "Secure", "anonymous", "irreversible", "100% private", "military-grade", "secure redaction" | Blur can be reversed (#38) |
| "Never leaves your device" without the scope | D-010 |
| "Enforced by CSP" | The CSP allows https requests; the page says so (#24) |
| Any number from the 2016 study, "roughly 20 px", "blocks bigger than the characters", "email addresses recovered" | Unconfirmed (see top) |
| "Use a high intensity" as advice for secrets, or any advice that a stronger setting protects | The study doesn't support it (#64). The app's warning and README:58 were corrected (D-033, BMI-088) |
| Blur background, invert brush, solid box, radial, tilt-shift, batch, HEIC | Backlog (README:174-194) |
| "Crop it out" as something this editor does | No crop in the editor (README:196) |
| Anything legal about plates or faces | Not a legal source |
| Why sellers hide plates (any reason, including cloning as the most common) | No source (#48) |
| An error message text in the link-size FAQ | BMI-087 changes it (#32) |
| "Yet" after "no solid box" | Reads as a promise; a solid box is in `Later` (BMI-104) |
| The Buffalo face-recognition paper, the techpolicy.press article | Nobody opened them |
| User counts, ratings, reviews, testimonials | None exist |
| The app's URL | D-016. `[EDITOR-URL]` (use pages only) and `[HOME-URL]` (JSON-LD, canonical) |
| "Works offline", "no server at all" | A server exists for links |
| Support promises | README names only GitHub issues |
| Rate limit numbers | Platform detail (README:110) |
| OS screenshot shortcuts | No source opened |
| `FAQPage`, `HowTo`, `aggregateRating`, `review` | seo.md; no ratings exist |

## Things to re-check later

1. **BMI-082 (hosted metrics).** "Check it yourself" says no request should carry the image and avoids "no POST" for that reason. Re-read it when metrics are built.
2. **The two link caps (#29, #30)** are constants in code.
3. **The repository** stays public and MIT (#33).
4. **The app's warning and README:58** were corrected (D-033, BMI-088). If they change again, re-read #37, #42 and #63.
5. **The study body.** If anyone reads the PDF, the numbers could return with their context; until then the landing carries none.
