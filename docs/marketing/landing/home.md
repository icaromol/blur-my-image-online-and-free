# Home page copy: the text under the editor

> **Internal notes. Not for the page.** Everything from this line to the first `---` and the final "Notes for the PM" section are working notes. BMI-078 and BMI-085 must not publish them.

- **Shape (D-032, Q-021 closed by Ícaro):** the home is the app's own screen. The hero is the editor with its drop zone. This file is the plain text that sits **under** the editor: static HTML inside `index.html`, **outside** the element the app mounts in, so a crawler reads it without JavaScript and the JavaScript budget does not change. There is no hero of its own, no "open the editor" button, no separate page.
- **Persona:** P1, the work screenshot redactor (primary). A1 reads the privacy section to check it.
- **Target queries:** `blur part of image online`, `blur image online` (cluster D in seo.md).
- **Head tags go in `index.html`:** title 54 characters, meta description 148 characters (below, counted by script). One `WebApplication` block goes in the same file (see `structured-data.md`).
- **Length:** the page copy below, from "Blur part of an image in three steps" to the closing line, is 1,091 words (Python `split()` after removing link targets; the version before the critique was 854 by the same count). The count leaves out the head tags, the H1 block and the footer links.
- **Use-case pages (Q-024, answered by Ícaro on 2026-11-23):** they stay, three small pages, each with the editor, linked from the home. The home links them from "What people hide with it" and from the footer.
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
| `#how-it-works` | Blur part of an image in three steps (the id stays `#how-it-works`) |
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

## Blur part of an image in three steps

### 1. Load an image

Choose a file in the drop zone, drop one anywhere on the page, paste with Ctrl+V (Cmd+V on a Mac), or paste a link. Whatever your browser can decode opens: PNG, JPEG, WebP, GIF (first frame only), AVIF and BMP in all current browsers.

### 2. Blur it

**Blur entire image** applies the effect to every pixel. **Brush** paints it only where you drag. **Eraser** brings back the original pixels. Each stroke keeps the effect and intensity you had selected when you painted it, so one image can carry a light Gaussian blur on the background and pixelation on a face.

### 3. Download it

Pick PNG, JPG, JPEG or WebP (JPG and JPEG are the same format; the choice sets the extension). The file keeps the original resolution and is named `<name>-blurred.<ext>`. If the image is larger than your graphics card can handle, the editor scales it down and tells you before you start.

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

Shortcuts: `B` brush, `E` eraser, `[` and `]` brush size, Ctrl+Z (Cmd+Z) undo.

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
