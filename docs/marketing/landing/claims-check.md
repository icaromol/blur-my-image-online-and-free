# Claims check (BMI-084)

Every factual claim in the landing copy, with where it appears and what proves it. First checked 2026-11-22 against the working tree on branch `feat/scaffold-and-proxy`; revised the same day after two reviewer reads and decision D-032.

## What changed, read this first

**The study (PoPETs 2016, Hill, Zhou, Saul, Shacham).** No reviewer could read the body of the PDF; the second reviewer extracted only the abstract. So the figures "blur radii of up to 45 px" and "blocks close to the size of the letters", the claim that the study recovered email addresses, and the advice "blocks bigger than the characters" are **not confirmed and are out of the copy**. The only study sentence on the landing is the one the abstract supports: "A 2016 study recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels; its authors concluded that pixelation and blur are not viable ways to redact text." The README's "roughly 20 px" is also not what the paper says, and the copy never used it after review.

**D-032 (Ícaro's direct answers to Q-021).**
- The home is the app's screen with the copy underneath: no page of its own, no "open the editor" button, no hero. `home.md` was about 850 words of static text under the editor (1,091 after the critique, see below), in `index.html` outside the element the app mounts in.
- The FAQ states both link limits and **not** the one-hour Vercel log. The log, the sentence "Like any host, Vercel sees your IP address on every request to the site", and "our code logs nothing" are out of the landing (the README keeps the log). Removed claims: #22, #56, and the "logs nothing" half of #21.
- The face page no longer opens with "no automatic detection". The home page has no detection statement at all. D-033 extends this: the plate and screenshot heroes do not open with it either. Their FAQs answer "does it find the plate / the text for me?" once ("You paint the area yourself; the editor doesn't pick it for you").
- Silence on phones and analytics stays.
- The three use pages were on hold (Q-024) until 2026-11-23; see the next section.

**Q-024 and the critique (Ícaro's direct answers in BLU-21, 2026-11-23).**
- Q-024: the three use pages stay, small, each with the editor, linked from the home. Their CTA is the editor's drop zone; the "Open the editor" buttons and `[EDITOR-URL]` are gone from them.
- The ten changes of section D of `.local/landing-improvements.md` are applied (BMI-084). New sentences and their sources: #1, #3, #6, #7, #8, #10, #23, #33, #38, #39, #42, #50 (wider "Where"), and #68 to #70 (new). Title and meta lengths in #51 were recounted by script.
- Not applied and not dropped, because Ícaro approved only section D: C1-9, C1-10, C1-11, C2-3, C4-1, C4-2 and the "Constraints worth revisiting".

**Later review rounds (same day).**
- The link-size FAQ cites no error text, because BMI-087 changes the message: "Over the limit, loading stops; download the image and open the file instead." (#32).
- The plate page says only that carsales blurs plates in listing photos automatically to make cloning harder. No reason is given for sellers (#48 removed). The Jalopnik link is not cited and not dead: it redirects (301) to a live 2015 article, "Why Do We Always Blur License Plates On The Internet?" (Doug DeMuro), which argues that covering plates is unnecessary (#67).
- "Yet" is gone from "no solid box" (a solid box is in `Later`, BMI-104; "yet" would read as a promise).
- No advice that a stronger setting protects (#64). The in-app warning and README:58 were corrected by D-033 and BMI-088 and no longer conflict with these pages.

**The mockup (BLU-66, Ícaro's answer in BLU-21 on 2026-11-23 at 22:23).**
- New on the home page: the four cards under the hero (section 2), the Paste > Blur > Download stepper (section 3) and "Use it your way" with three cards (section 4). New claims: #71 to #78. #12 moved from the effects note to the shortcuts card and gained redo.
- The mockup sentences that break the rules are not used ("forever", "No files are uploaded" without scope, "No limits", "sensitive information", "Remove personal data", "select the area", "12 px", the dash in "it's that simple"). The list is in `.local/landing-mockup/feedback.md`.
- The before-and-after preview (BMI-127) and zoom come after v1 (Ícaro) and are not on the page.

**Also dropped from the home page for length:** #2, #8's FAQ copy, #25 (the e2e description), #28, #37 (the app's warning is not quoted).

How to read the tables. "README:78" is line 78 of `README.md`. Code paths are repo-relative. Claim numbers are stable; a removed claim keeps its number and is marked **Removed**. Advice sentences ("paint a little past the edge") are judgments, not facts, and are not listed.

Files: H = `home.md`, P = `use-blur-license-plate.md`, S = `use-pixelate-screenshot.md`, F = `use-blur-face.md`, SD = `structured-data.md`.

## Product behavior

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 1 | Free, no account, no watermark ("Free" also in the home title, without "forever") | H title, meta, static subhead, FAQ cost; P, S, F meta and hero; SD description | README:3. The app's export hint says "No metadata, no watermark" (`src/i18n/messages/en.json`:57) |
| 2 | **Removed.** Nothing to install, it runs in the browser | none (was the home closing) | README:3 |
| 3 | Four ways to load: file picker, drop anywhere on the page, paste with Ctrl+V or Cmd+V, link. On Windows the paste is Ctrl+V, on a Mac Cmd+V | H step 1, "What people hide" (screenshot line); S, including the FAQ "on Windows or Mac"; P; F | README:13-18 |
| 4 | Opens whatever the browser can decode: PNG, JPEG, WebP, GIF (first frame), AVIF, BMP in all current browsers | H step 1 | README:20 |
| 5 | **Blur entire image** applies the effect to every pixel; **Brush** paints only where you drag; **Eraser** brings back the original pixels. The labels are the app's own | H step 2, static subhead ("or blur the whole image") | README:24-26; `en.json`:27-31 |
| 6 | Each stroke keeps the effect and intensity selected when painted; one image can mix a light Gaussian blur on the background and pixelation on an area such as a face | H step 2, "What people hide" (face line); P "Several plates"; F "Several faces" | README:28 (its example is a license plate; the face is another use of the same mechanism, not a separate claim) |
| 7 | Export as PNG, JPG, JPEG or WebP; JPG and JPEG are the same format and the choice sets the extension; original resolution; file named `<name>-blurred.<ext>` | H step 3, "What people hide" (plate line), FAQ "Will it make my image smaller?"; P hero subhead (original resolution) and step 5; S; F | README:30; `en.json`:57 ("Original resolution.") |
| 8 | An image larger than the graphics card can handle is scaled down and the editor says so before you start | H step 3, FAQ "Will it make my image smaller?"; P FAQ | README:101; `en.json`:60 |
| 9 | Intensity 1 to 100, scaled to the shorter side, so a setting looks the same on a 600 px screenshot and a 6000 px photo | H effects; P | README:52 |
| 10 | Gaussian: smooth, even softening, for backgrounds, soft focus, whole image. Pixelate: square blocks of averaged color, for faces, plates, names in screenshots, not for text that must stay secret. Motion: streaks in one direction, implied movement | H effects table (the Pixelate row carries the caveat since the critique, C1-4), "What people hide" (Pixelate for a screenshot and a plate); P; S; F | README:46-48. "Names in screenshots" is not in README:47; it is a use example for C1-4, proved by README:17 (paste a screenshot) and README:25 (the Brush paints any area). The caveat is README:47 ("not for text that must stay secret") |
| 11 | Motion angle 0 to 180 degrees | H effects table | README:53 |
| 12 | `B` brush, `E` eraser, `[` and `]` brush size, Ctrl/Cmd+Z undo | H shortcuts card in "Use it your way" (moved from the effects note by BLU-66; see #76); P steps 3-4; S step 4; F steps 3-4 | README:54, 64-71; `src/ui/shortcuts.ts`:32-60 |
| 13 | The single-key shortcuts work while the image has keyboard focus | P step 3; F step 3; H shortcuts card (back on H since BLU-66, see #76) | README:73; `src/ui/shortcuts.ts`:43-44 |
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
| 23 | Exported files carry no EXIF: GPS coordinates, timestamps, camera model dropped | H privacy, FAQ "Does the downloaded file keep location data?"; P; S; F | README:79; `e2e/exif.spec.ts`:132 (EXIF, GPS and XMP dropped, per the reviewer for PNG, JPG and WebP) |
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
| 33 | The code is public on GitHub under the MIT license | H FAQ ("public on GitHub" is the link since the critique; the duplicated GitHub line at the end is gone) | `LICENSE`:1; research.md section 3; verified by the reviewer |
| 34 | Issues and pull requests are welcome | H FAQ | README:200 |
| 35 | You can run your own copy; the README has the commands | H FAQ | README:155-160, 137-149 |
| 36 | The cost line | H FAQ | README:3; see #57 |

## Blur is not redaction

The study is PoPETs 2016, Hill, Zhou, Saul and Shacham (`crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf`). **No reviewer read the body of the PDF; the abstract on the study's page was the source.** I did not open it either.

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 37 | The app's warning is not quoted on H. F quotes only its first sentence (#63) | none on H | `effects.warning` in `en.json`:51, which now reads "Blur and pixelate don't reliably hide text. For anything secret, cover it with a solid box in another editor, or leave it out." (corrected by D-033 and BMI-088) |
| 38 | The study recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels; its authors concluded that pixelation and blur are not viable ways to redact text | H redaction, FAQ "Can blurred or pixelated text be read again?" (short form: "recovered pixelated and blurred text"); S; P; F (conclusion only) | Abstract of the study, read by the second reviewer. Body unread. Replaces every number and the README's "roughly 20 px" |
| 39 | Tools such as Unredacter rebuild pixelated text by rendering guesses in the same font and comparing them | H redaction, FAQ "Can blurred or pixelated text be read again?" (short form); S FAQ | Bishop Fox post (2022-02-15), `bishopfox.com/blog/unredacter-tool-never-pixelation`, reviewer-verified. The post's advice is to use black bars covering the whole text |
| 40 | Neither effect guarantees that the text cannot be read again (the study recovered blurred text as well as pixelated, so the risk applies to Gaussian too) | S "Pixelate or Gaussian"; the same sentence for a plate on P "Pixelate or blur" | Same abstract (#38) |
| 41 | **Removed.** A light effect is easier to undo than a heavy one | none | Came from a figure no one confirmed |
| 42 | For anything that must stay secret, cover it with a solid box in another editor, or leave it out | H redaction, FAQ "Can blurred or pixelated text be read again?", "What people hide" (screenshot line points to the redaction section); S; P | The Bishop Fox post's conclusion (black bars over the whole text, reviewer-verified); README:58 prefers a solid box |
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
| 50 | carsales, an Australian marketplace, blurs number plates in listing photos automatically to make cloning harder ("number plates" is the page's one use of the UK and Australian word, C2-2) | P "A marketplace that blurs plates" | `business.carsales.com.au/insights/auto-industry-news/carsales-innovation-tackles-number-plate-cloning/`, reviewer-verified |

## Wording and markup

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 51 | Title and meta lengths: home 54 and 148 (after the critique; were 48 and 135); plate 54 and 137; screenshot 53 and 151; face 45 and 129 | Head tags | Home counted by script on 2026-11-23 (`python3 -c 'print(len("..."))'`); the others counted by hand here and by script by the reviewer. Limits: under 60 and under 155 |
| 68 | "To start, drop an image anywhere on this page or press Ctrl+V (Cmd+V on a Mac)." Drop and paste work while the reader is scrolled into the static copy; the use pages' closing CTAs say the same | H closing line; P, S, F closing CTA notes | `src/ui/App.vue`:97-102 registers `paste`, `dragover` and `drop` on `window`. **Not checked:** whether the editor comes into view after a drop or paste from the bottom of the page. That check is BMI-085's (home.md, "Before this goes live" item 4) |
| 69 | "Blur or pixelate an image, or just the parts you paint." | H meta; SD description | README:3 ("blur all of it or paint over the parts you want hidden"); the app's tagline "Blur all of an image or just the parts you paint." (`en.json`:4) |
| 70 | Static H1 "Blur or pixelate part of an image, in your browser" and the subhead "Paint over a name in a screenshot, a license plate or a face, or blur the whole image." | H "Above the editor" | README:3 (in your browser, paint over parts, blur all of it); README:17 (paste a screenshot); README:47 (faces and plates). The H1 text is seo.md's proposal; where it sits is BMI-085's call |
| 52 | `WebApplication` fields; `MultimediaApplication` is a valid category | SD | `en.json`:3, :66; README:3; the category is on Google's list (reviewer-verified). Not eligible for the software app rich result |

## The cards, the stepper and "Use it your way" (BLU-66)

| # | Claim | Where | Proof |
| --- | --- | --- | --- |
| 71 | Card "Private by design": "Image files you open, drop or paste never leave your device." (exact) and "A link can pass once through our server.", linked to `#the-exception-links` | H section 2 | #17 (D-010, README:3); #20 and #21 (README:78, 103; `src/input/url.ts`:68-109). "Can": only when the image's server refuses or the link is http://. Replaces the mockup's "No files are uploaded", which had no scope |
| 72 | Card "Fast and simple": "Blur the whole image or just the parts you paint." and "Effects run on your graphics card. Nothing to install." | H section 2 | README:3 ("blur all of it or paint over the parts you want hidden", "in your browser"); `en.json`:4 (the app's tagline); README:97 ("GPU rendering. Effects run as WebGL fragment shaders"). No speed figure is stated; "Fast" is the card title Ícaro approved and the lines say only what runs where |
| 73 | Card "Works with any image": "Whatever your browser can decode, including PNG, JPEG, WebP, AVIF, BMP and the first frame of a GIF." and "Download as PNG, JPG or WebP at the original resolution." | H section 2 | #4 (README:20); #7 (README:30; `en.json`:57, "Original resolution."). JPEG is left out of the export list because JPG is the same format (README:30). The title's "any" is Ícaro's and not literal (HEIC outside Safari doesn't open, README:192; very large images are scaled down, #8); the line names the formats README:20 lists, and "including" keeps it from reading as the only ones (the browser decides). Open choice in `home.md`, PM note 6. Replaces the mockup's "No limits" |
| 74 | Card "Free and open source": "No account, no watermark, no paid version." and "The code is public under the MIT license.", linked to the repository | H section 2 | #1 (README:3); #57; #33 (`LICENSE`:1, repository public). No "forever" (hosting may change). Replaces the mockup's "Use it, share it, improve it" |
| 75 | Stepper, Paste > Blur > Download: "Paste an image with Ctrl+V (Cmd+V on a Mac), drop a file, choose one or paste a link." / "Paint over what you want hidden, or blur the entire image." / "Save it as PNG, JPG or WebP at the original resolution." | H section 3, over the three approved steps | #3 (README:13-18, all four ways named under the label "Paste"); #5 (README:24-26); #7 (README:30). The scale-down exception (#8) is in the long step 3 right under the stepper |
| 76 | Shortcuts card: `B` brush, `E` eraser, `[` and `]` brush size, Ctrl+Z (Cmd+Z) undo, Ctrl+Shift+Z (Cmd+Shift+Z) redo; "The single keys work while the image has focus: click it or move to it with Tab." Title "Shortcuts from Photoshop" | H section 4 | README:62 ("Shortcuts follow Photoshop's defaults where one exists"), 64-71 (table, redo at :71), 73 (focus rule, "while the image has keyboard focus"); `src/ui/EditorCanvas.vue`:65-70 (`keydown` is handled only on `.canvas-host`, so the single keys stop when focus leaves the image); `src/ui/shortcuts.ts`:40 (Shift turns undo into redo), :46 (single keys only without modifiers). External source for the title (Adobe's default keyboard shortcuts page, `helpx.adobe.com/photoshop/using/default-keyboard-shortcuts.html`): external source not read (HTTP 403 on 2026-11-23), so the title rests on README:62 only. Takes the place of the effects note (#12) |
| 77 | MCP card: "By design, from devs to devs." (Ícaro's words); an MCP server for agents is in development and not available yet ("in development" is Ícaro's word, D-043 in BLU-21, and not a fact verified in the repository: the spec says "Nothing is implemented", and the default of Q-028 is the spec only); the privacy notes on the page cover the web app only; link to the public spec | H section 4 | D-037 (direction decided, scope not closed); `docs/product/specs/mcp-for-agents.md` ("Only this outline exists. Nothing is implemented"), public on `main` (the repository is public). No tool, date or privacy rule for the MCP is stated (D-037: the web app's promise and the MCP's stay apart). The spec's non-goal "no claim on the landing about the MCP before the privacy statement exists" is raised for the PM in `home.md`, PM note 7. When the MCP page exists, the link changes to it and this row is re-checked |
| 78 | GitHub card: "Ask for a feature or report a bug", "Pull requests are welcome too.", "New features have to be about blurring an image.", link to the repository's issues | H section 4 | README:200 ("Issues and pull requests are welcome"); README:206 ("New features need to fit the one-job scope above"); README:9-32 (the one job). Same source as #34 |

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
| Any tool, date, input type or privacy rule for the MCP | Nothing is built (D-037, `specs/mcp-for-agents.md`); the card says only "in development, not available yet" (#77) |
| The before-and-after preview and zoom | After v1 (Ícaro, BLU-66). Zoom exists in the mockup only |
| "No limits", "any image" as a literal promise | Caps exist: 100 MiB direct, about 4.2 MiB through the proxy, the graphics card's size (#8, #29, #30). "Works with any image" stays only as Ícaro's card title, scoped by its lines (#73) |
| "Select the area", any selection tool | The editor has the brush only (README:24-26) |
| Intensity in px | It runs from 1 to 100 (README:52) |
| The app's URL | D-016. `[HOME-URL]` (JSON-LD, canonical). `[EDITOR-URL]` is no longer used: since Q-024 every page carries the editor |
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
6. **The MCP card (#77).** When the MCP page exists, the link changes to it and the card is re-read against the MCP's own privacy statement.
