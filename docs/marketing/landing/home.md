# Home page copy: the text under the editor

> **Internal notes. Not for the page.** Everything from this line to the first `---` and the final "Notes for the PM" section are working notes. BMI-078 and BMI-085 must not publish them.

- **Shape (D-032, Q-021 closed by Ícaro):** the home is the app's own screen. The hero is the editor with its drop zone. This file is the plain text that sits **under** the editor: static HTML inside `index.html`, **outside** the element the app mounts in, so a crawler reads it without JavaScript and the JavaScript budget does not change. There is no hero of its own, no "open the editor" button, no separate page.
- **Persona:** P1, the work screenshot redactor (primary). A1 reads the privacy section to check it.
- **Target queries:** `blur part of image online`, `blur image online` (cluster D in seo.md).
- **Head tags go in `index.html`:** title 54 characters, meta description 148 characters (below, counted by script). One `WebApplication` block goes in the same file (see `structured-data.md`).
- **Length:** the page copy below, from "At a glance" (the four cards) to the closing line, is 1,334 words (Python `split()` after removing link targets and the "For BMI-085" notes). From "Blur part of an image in three steps" to the closing line it is 1,226; it was 1,091 before the cards, the stepper and "Use it your way" (BLU-66), and 854 before the critique, by the same count. The count leaves out the head tags, the H1 block and the footer links.
- **Use-case pages (Q-024, answered by Ícaro on 2026-11-23):** they stay, three small pages, each with the editor, linked from the home. The home links them from "What people hide with it" and from the footer.
- **Mockup (BLU-66, Ícaro's answer in BLU-21 on 2026-11-23 at 22:23):** the layout of his external mockup is approved: the four cards under the hero (section 2), "How it works" as a Paste > Blur > Download stepper (section 3) and "Use it your way" with three cards (section 4). Images and the list of mockup sentences that may not go on the page: `.local/landing-mockup/`. The text here replaces the mockup's text. The before-and-after preview (BMI-127) and zoom come after v1 and are not on the page.
- **Markers:** the editor is above the copy, so this file has no `[EDITOR-URL]`. `[HOME-URL]` is the page's own address, used only in the JSON-LD and the canonical. Neither is a real address.
- **Sources for every sentence:** `claims-check.md`.

### Before this goes live

1. Someone runs the "Check it yourself" steps on the deployed site and confirms what the Network tab shows (seo.md asks for this before the check is stated).
2. Confirm the repository is still public and MIT on the day.
3. When BMI-082 (hosted metrics) is built, re-read "Check it yourself". It says no request should carry the image and avoids "no POST" for that reason.
4. **The closing line needs a scroll to the editor (BMI-085).** `src/ui/App.vue`:97-102 registers `paste` and `drop` on `window`, so dropping or pasting with Ctrl+V works from anywhere on the page. From reading the code, the expected answer is that the image loads **off-screen**: there is no `scrollIntoView` or `scrollTo` anywhere in `src/ui`, and the `.layout` in `App.vue` stays in normal flow (the only fixed element is the drag overlay). The closing line goes live only together with a scroll to the editor, built in BMI-085. Without that scroll, the line waits. The same applies to the CTA notes of the three use pages, which rely on the same thing: `use-blur-license-plate.md`:129, `use-pixelate-screenshot.md`:131 and `use-blur-face.md`:132.

### For BMI-085: anchor ids to keep

| Id | Heading |
| --- | --- |
| `#at-a-glance` | At a glance (visually hidden; the four cards) |
| `#how-it-works` | Blur part of an image in three steps (the id stays `#how-it-works`; the stepper and the three steps) |
| `#use-it-your-way` | Use it your way |
| `#what-people-hide` | What people hide with it |
| `#what-stays-on-your-device` | What stays on your device |
| `#the-exception-links` | The exception: links |
| `#check-it-yourself` | Check it yourself |
| `#blur-is-not-redaction` | Blur is not redaction |
| `#questions` | Questions |

The `#blur-is-not-redaction` and `#check-it-yourself` ids are also what the use pages link to.

---

## Head tags (go in `index.html`)

**Title** (54): `Blur or Pixelate an Image Online, Free | Blur My Image`

**Meta description** (148): `Blur or pixelate an image, or just the parts you paint. Free, no account, no watermark. Image files you open, drop or paste never leave your device.`

**Open Graph:** `og:title` equal to the title (`Blur or Pixelate an Image Online, Free | Blur My Image`, 54), `og:description` equal to the meta description.

Counted with `python3 -c 'print(len("..."))'` on each string.

---

## Above the editor (static, in `index.html`)

> **For BMI-085.** Two lines of static text over the app, not a page of their own and not a button: the editor stays the hero (D-032). BMI-085 confirms that the drop zone stays in the first screen at common desktop heights, and decides whether the app's own `<h1>` ("Blur My Image", `src/ui/App.vue`:121) becomes a `<p>`, so the page has one H1. The app's tagline ("Blur all of an image or just the parts you paint. Image files never leave your device.") stays under these lines and carries the privacy sentence. If the ui lane wants one line only, drop the supporting line and keep the H1.

# Blur or pixelate part of an image, in your browser

Paint over a name in a screenshot, a license plate or a face, or blur the whole image. Free, no account, no watermark.

---

## Copy under the editor

> **For BMI-085 (section 2, the four cards).** Four cards in one row on desktop, as in Ícaro's mockup (`.local/landing-mockup/1-hero-and-cards.png`), each with its icon. "At a glance" is a visually hidden `<h2>`, so the card titles can be `<h3>` without skipping a level. Each card is a title and two lines; the line break between them is part of the layout.

## At a glance

### Private by design

Image files you open, drop or paste never leave your device.
A link can pass once through our server. [How links load](#the-exception-links)

### Fast and simple

Blur the whole image or just the parts you paint.
Effects run on your graphics card. Nothing to install.

### Works with any image

Whatever your browser can decode, including PNG, JPEG, WebP, AVIF, BMP and the first frame of a GIF.
Download as PNG, JPG or WebP at the original resolution.

### Free and open source

No account, no watermark, no paid version.
The code is public under the MIT license. [View on GitHub](https://github.com/icaromol/blur-my-image-online-and-free)

> **For BMI-085 (section 3, the stepper).** The heading keeps the id `#how-it-works`. The stepper is an ordered list (`<ol>`) drawn as Paste > Blur > Download, so it still reads as three steps without CSS. The long text of each step stays right under the stepper, as the three `<h3>` below, in normal flow (no accordion, no tabs), so crawlers and screen readers get it without JavaScript.

## Blur part of an image in three steps

1. **Paste.** Paste an image with Ctrl+V (Cmd+V on a Mac), drop a file, choose one or paste a link.
2. **Blur.** Paint over what you want hidden, or blur the entire image.
3. **Download.** Save it as PNG, JPG or WebP at the original resolution.

### 1. Load an image

Choose a file in the drop zone, drop one anywhere on the page, paste with Ctrl+V (Cmd+V on a Mac), or paste a link. Whatever your browser can decode opens: PNG, JPEG, WebP, GIF (first frame only), AVIF and BMP in all current browsers.

### 2. Blur it

**Blur entire image** applies the effect to every pixel. **Brush** paints it only where you drag. **Eraser** brings back the original pixels. Each stroke keeps the effect and intensity you had selected when you painted it, so one image can carry a light Gaussian blur on the background and pixelation on a face.

### 3. Download it

Pick PNG, JPG, JPEG or WebP (JPG and JPEG are the same format; the choice sets the extension). The file keeps the original resolution and is named `<name>-blurred.<ext>`. If the image is larger than your graphics card can handle, the editor scales it down and tells you before you start.

## Use it your way

> **For BMI-085 (section 4, three cards).** Three cards in one row, as in Ícaro's mockup (`.local/landing-mockup/4-use-it-your-way.png`), with the mockup's eyebrow line ("More than just a tool") left out. The MCP card links to the public spec for now. **When the MCP page exists, the link changes to that page**; the card's text is re-checked then, and nothing on it may promise a tool, a date or a privacy rule for the MCP (D-037).

### An MCP server for agents

By design, from devs to devs. It is in development and not available yet. The privacy notes on this page cover the web app only. [Read the MCP spec](https://github.com/icaromol/blur-my-image-online-and-free/blob/main/docs/product/specs/mcp-for-agents.md)

### Shortcuts from Photoshop

`B` brush, `E` eraser, `[` and `]` brush size, Ctrl+Z (Cmd+Z) undo, Ctrl+Shift+Z (Cmd+Shift+Z) redo. The single keys work while the image has focus: click it or move to it with Tab.

### Ask for a feature or report a bug

Pull requests are welcome too. New features have to be about blurring an image. [Open an issue on GitHub](https://github.com/icaromol/blur-my-image-online-and-free/issues)

## What people hide with it

**[A name or an email address in a screenshot](/blur-text-in-screenshot/).** Paste the screenshot with Ctrl+V (Cmd+V on a Mac), choose Pixelate and paint over the text. For a password or anything that must stay secret, read [Blur is not redaction](#blur-is-not-redaction) first.

**[A license plate in a car photo](/blur-license-plate/).** Choose Pixelate and paint over the plate. The download keeps the photo's original resolution.

**[A face in a group photo](/blur-face-in-photo/).** Paint over each face you want hidden. Each stroke keeps the effect and intensity you chose, so every face can get its own setting.

## The three effects

Intensity runs from 1 to 100 and is scaled to the image's shorter side, so a setting looks the same on a 600 px screenshot and a 6000 px photo.

| Effect | What it looks like | What it is for |
| --- | --- | --- |
| Gaussian | Smooth, even softening | Backgrounds, soft focus, the whole image |
| Pixelate | Square blocks of averaged color | Faces, plates, names in screenshots. Not for text that must stay secret |
| Motion | Streaks in one direction, angle 0 to 180 degrees | Implied movement, a stylized blur |

## What stays on your device

Image files you open, drop or paste never leave your device. Your browser decodes, edits and exports them. There is no upload step and no server-side storage. The exported file has no EXIF metadata (camera model, timestamps and GPS coordinates are dropped) and no watermark.

### The exception: links

> Links are fetched through our server. Files you open, drop or paste never leave your browser.

For an https link, your browser first asks the image's own server for the file. If that server allows it, the image comes straight to your browser. If it refuses, or the link is http://, the image passes once through a small proxy on our server, which streams the bytes back and doesn't keep a copy of the image. To keep a file off our server, save the image and open the file. The [privacy section of the README](https://github.com/icaromol/blur-my-image-online-and-free#privacy) has the full details.

### Check it yourself

1. In a private window (extensions can add requests of their own), open your browser's developer tools and select the Network tab.
2. Clear the list. Open an image from a file, paint on it and download it.
3. Read the requests. None should carry your image. Look for requests that are not GET and for requests to other websites. Files from this site's own address can appear, and so can entries starting with `blob:`, which are your browser handing the finished file to your downloads.

A clean Network tab covers only what you did in that session. The page's security policy still allows requests to other https sites, so the check shows what the page did, not what it could do. The source is public on GitHub if you want to read how files are loaded and exported.

## Blur is not redaction

Blurred and pixelated text can sometimes be recovered. A [2016 study](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf) recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels; its authors concluded that pixelation and blur are not viable ways to redact text. Tools such as [Unredacter](https://bishopfox.com/blog/unredacter-tool-never-pixelation) rebuild pixelated text by rendering guesses in the same font and comparing them.

For a password, a document number or anything that must stay secret, cover it with a solid box in another editor, or leave it out of the image. This editor has no solid box.

## Questions

### Does it upload my image?

Not a file you open, drop or paste. A link is the exception: an http:// link always goes through our server, and an https link does when the image's own server refuses direct access. See [the exception for links](#the-exception-links).

### Can blurred or pixelated text be read again?

Sometimes. A 2016 study recovered pixelated and blurred text, and tools such as Unredacter rebuild pixelated text. For anything that must stay secret, cover it with a solid box in another editor, or leave it out of the image. [Why, with sources](#blur-is-not-redaction).

### Will it make my image smaller?

No. The download keeps the original resolution. The one exception is an image larger than your graphics card can handle: the editor scales it down and tells you before you start.

### Does the downloaded file keep location data?

No. The export drops EXIF metadata, including GPS coordinates, timestamps and the camera model. Anything visible in the picture stays visible.

### What does it cost?

Nothing. There is no paid version, no account and no watermark.

### How big can an image loaded from a link be?

100 MiB (104,857,600 bytes) when your browser fetches the image directly; 4,400,000 bytes (about 4.2 MiB) when it goes through our proxy. Over the limit, loading stops; download the image and open the file instead.

### How do I paste a screenshot?

Copy the screenshot to your clipboard and press Ctrl+V (Cmd+V on a Mac) on this page. You can also press Ctrl+V with a link copied.

### Is it open source?

Yes. The code is [public on GitHub](https://github.com/icaromol/blur-my-image-online-and-free) under the MIT license, and issues and pull requests are welcome. You can also run your own copy; the README has the commands.

To start, drop an image anywhere on this page or press Ctrl+V (Cmd+V on a Mac).

---

## Footer links (no heading on the page)

- [Blur a license plate in a photo](/blur-license-plate/)
- [Blur or pixelate text in a screenshot](/blur-text-in-screenshot/)
- [Blur a face in a photo](/blur-face-in-photo/)

---

## Notes for the PM (internal, not for the page)

**What D-032 changed here.** The page of its own and the "Open the editor" buttons are gone; the copy is shorter and starts at "How it works". The 1-hour Vercel log, the sentence "Like any host, Vercel sees your IP address on every request to the site" and the question "What gets logged when I load a link?" are removed. The question "Does it find faces, plates or text for me?" is removed too. The link-limit FAQ stays and states both caps.

**FAQ length.** "Will it shrink my photo" and "Is pixelated text safe" are back (as "Will it make my image smaller?" and "Can blurred or pixelated text be read again?"), with a third question on location data: the critique's change C1-3, approved by Ícaro on 2026-11-23. The FAQ has eight questions. "Which formats" stays out; step 1 and step 3 answer it.

**Open for the PM:**

1. **Detection.** D-032 says the face section does not open with "no automatic detection". I also removed the FAQ question about whether the editor finds faces, plates or text, because it was the same notice in another place. Nothing on the home page claims automatic detection. If Ícaro wants the notice somewhere, ask him.
2. **Link privacy without the log.** With the log out, the page no longer says "our code logs nothing" either, since that line alone would suggest no logs exist. It points to the README privacy section for details. Never add "no logs" or "we keep nothing" for links to this page.
3. **Use-case pages.** Q-024 is answered: the pages stay. "What people hide with it" links each line to its page, and the footer has the three links (`/blur-license-plate/`, `/blur-text-in-screenshot/`, `/blur-face-in-photo/`). BMI-078 confirms the slugs.
4. **Hero image.** None is needed now: the editor is the hero. The before-and-after screenshot is optional.
5. **The in-app warning (BMI-088).** Not quoted on this page.

**What BLU-66 changed (the mockup).**

- **Section 2, the four cards.** Titles are Ícaro's, from the mockup. Each mockup line that broke a rule was replaced: "No files are uploaded" by the scoped sentence plus the link exception (`#the-exception-links`); "JPG, PNG, WebP and more. No limits." by the real format list and the export formats; "Use it, share it, improve it" by the cost line and the MIT license. "Forever" is nowhere.
- **Section 3, the stepper.** The labels are Ícaro's: Paste > Blur > Download. Step 1 still names all four ways in (paste, drop, choose, link), even under the label "Paste". Each stepper line is the short form of the approved step; the three long steps stay word for word right under the stepper. Their headings ("1. Load an image", "2. Blur it", "3. Download it") stay as approved, though they don't repeat the stepper labels; see choice 2 below.
- **Section 4, "Use it your way".** Three cards in Ícaro's choices: the MCP (in development, linked to the public spec), the keyboard shortcuts and GitHub issues. The mockup's four cards ("Protect your privacy", "Create clean screenshots", "Built for developers", "Open source") are not used: two of them break the rules ("sensitive information", "Remove personal data") and the other two repeat section 2.
- **The "Shortcuts:" line moved.** It was the last line of "The three effects": "Shortcuts: `B` brush, `E` eraser, `[` and `]` brush size, Ctrl+Z (Cmd+Z) undo." All of it is now in the shortcuts card, which adds redo (Ctrl+Shift+Z, Cmd+Shift+Z) and the focus rule for the single keys (README:73). Nothing was lost; the line is gone from the effects section so the page doesn't say it twice.
- **Out of the page, as Ícaro decided:** the before-and-after preview (BMI-127) and zoom (after v1). The mockup's "12 px" intensity and "select the area" are not used either.

**Open for the PM (BLU-66):**

6. **"Works with any image" is Ícaro's title, and "any" is not literally true.** HEIC opens only in Safari, and an image bigger than the graphics card can handle is scaled down. The card's two lines say exactly which formats open, so the title is kept as approved. If Ícaro wants a title that is true on its own, the option is "Works with common formats" (see choice 1).
7. **The MCP spec says "no claim on the landing about the MCP before the privacy statement exists"** (`specs/mcp-for-agents.md`, Non-goals). Ícaro asked for the card directly, so it is written, and it makes no claim about what the MCP does: it says the server is in development, not available, and that the page's privacy notes cover only the web app (D-037 keeps the two promises apart). The PM should update that non-goal so the spec and the page agree. Until the MCP page exists, the card links to the spec; then the link changes to the page, and the card is re-checked against the MCP's own privacy statement.
8. **Hero text from the mockup.** "Online, free and open source forever." and "Blur or pixelate any image, right in your browser." are not better than the approved H1 and subhead: the first has "forever", the second "any" and no "part of an image". The H1 and subhead stay. The mockup's logo-as-title over the drop zone is the same `<h1>` question BMI-085 already has (see "Above the editor").

**Choices for BLU-66 (alternatives for the user).**

Choice 1: the format card title.

| Option | Text | Reason |
| --- | --- | --- |
| A (used, Ícaro's) | Works with any image | Ícaro's approved card; the two lines below give the exact list. |
| B | Works with common formats | True on its own, with no reliance on the lines below. |
| C | Opens what your browser opens | Says the real rule (README:20), but reads less plainly at a glance. |

Choice 2: the step headings under the stepper.

| Option | Text | Reason |
| --- | --- | --- |
| A (used, approved) | 1. Load an image / 2. Blur it / 3. Download it | The approved headings; "Load" covers all four ways in, not only paste. |
| B | 1. Paste / 2. Blur / 3. Download | Repeats the stepper word for word; "Paste" undersells the drop, the file picker and the link. |
| C | 1. Paste or load an image / 2. Blur it / 3. Download it | Ties step 1 to the stepper label and keeps the other ways in. |

Choice 3: the MCP card title.

| Option | Text | Reason |
| --- | --- | --- |
| A (used) | An MCP server for agents | Says what it is and who it is for; Ícaro's phrase "by design, from devs to devs" opens the text. |
| B | An MCP server, from devs to devs | Ícaro's words in the title; a reader who doesn't know MCP gets no hint of what it is for. |
| C | Blur My Image for agents (in development) | Puts the status in the title; longer, and the word MCP, the one developers search for, moves to the body. |

Choice 4: the link text on the GitHub card (the card's CTA).

| Option | Text | Reason |
| --- | --- | --- |
| A (used) | Open an issue on GitHub | Says where the click goes and what happens there. |
| B | Request a feature or report a bug | Repeats the card's title; the reader doesn't learn it is GitHub until the page loads. |
| C | See open issues | Invites reading before writing, so fewer duplicate issues; weaker as a call to act. |

**Headline choices.** The static H1 is seo.md's proposal, approved with the critique (C1-2). How it sits next to the app's own `<h1>` is BMI-085's call (see "Above the editor"). Two alternatives, in case the layout check changes the answer:

| Option | Text | Reason |
| --- | --- | --- |
| A (used, approved) | Blur or pixelate part of an image, in your browser | Carries "part of an image", the target phrase, and says where the work happens. |
| B | Blur part of an image online | Shorter and closer to the query `blur part of image online`; loses "pixelate" and "in your browser". |
| C | Blur or pixelate the parts of an image you choose | Says the reader paints the area; longer, and the target phrase is split. |

**Closing line choices.**

| Option | Text | Reason |
| --- | --- | --- |
| A (used, approved) | To start, drop an image anywhere on this page or press Ctrl+V (Cmd+V on a Mac). | Tells the reader they can start from where they are, with the two fastest ways in. |
| B | Drop an image anywhere on this page to start. | One action only; drops the paste route P1 uses most. |
| C | Copy a screenshot and press Ctrl+V (Cmd+V on a Mac) to start. | Written for P1 alone; says nothing to someone with a photo file. |
