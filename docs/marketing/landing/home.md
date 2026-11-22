# Home page copy: the text under the editor

> **Internal notes. Not for the page.** Everything from this line to the first `---` and the final "Notes for the PM" section are working notes. BMI-078 and BMI-085 must not publish them.

- **Shape (D-032, Q-021 closed by Ícaro):** the home is the app's own screen. The hero is the editor with its drop zone. This file is the plain text that sits **under** the editor: static HTML inside `index.html`, **outside** the element the app mounts in, so a crawler reads it without JavaScript and the JavaScript budget does not change. There is no hero of its own, no "open the editor" button, no separate page.
- **Persona:** P1, the work screenshot redactor (primary). A1 reads the privacy section to check it.
- **Target queries:** `blur part of image online`, `blur image online` (cluster D in seo.md).
- **Head tags go in `index.html`:** title 48 characters, meta description 135 characters (below). One `WebApplication` block goes in the same file (see `structured-data.md`).
- **Length:** the page copy below, from "How it works" to the closing line, is about 850 words (849 by the reviewer's count).
- **Markers:** the editor is above the copy, so this file has no `[EDITOR-URL]`. `[HOME-URL]` is the page's own address, used only in the JSON-LD and the canonical. Neither is a real address.
- **Sources for every sentence:** `claims-check.md`.

### Before this goes live

1. Someone runs the "Check it yourself" steps on the deployed site and confirms what the Network tab shows (seo.md asks for this before the check is stated).
2. Confirm the repository is still public and MIT on the day.
3. When BMI-082 (hosted metrics) is built, re-read "Check it yourself". It says no request should carry the image and avoids "no POST" for that reason.

### For BMI-085: anchor ids to keep

| Id | Heading |
| --- | --- |
| `#how-it-works` | How it works |
| `#what-stays-on-your-device` | What stays on your device |
| `#the-exception-links` | The exception: links |
| `#check-it-yourself` | Check it yourself |
| `#blur-is-not-redaction` | Blur is not redaction |
| `#questions` | Questions |

The `#blur-is-not-redaction` and `#check-it-yourself` ids are also what the use-page drafts link to, if those pages stay (Q-024).

---

## Head tags (go in `index.html`)

**Title** (48): `Blur or Pixelate an Image Online | Blur My Image`

**Meta description** (135): `Blur or pixelate an image in your browser. Free, no account, no watermark. Image files you open, drop or paste never leave your device.`

**Open Graph:** `og:title` equal to the title, `og:description` equal to the meta description.

---

## Copy under the editor

## How it works

### 1. Load an image

Choose a file in the drop zone, drop one anywhere on the page, paste with Ctrl+V (Cmd+V on a Mac), or paste a link. Whatever your browser can decode opens: PNG, JPEG, WebP, GIF (first frame only), AVIF and BMP in all current browsers.

### 2. Blur it

**Blur entire image** applies the effect to every pixel. **Brush** paints it only where you drag. **Eraser** brings back the original pixels. Each stroke keeps the effect and intensity you had selected when you painted it, so one image can carry a light Gaussian blur on the background and pixelation on a face.

### 3. Download it

Pick PNG, JPG, JPEG or WebP (JPG and JPEG are the same format; the choice sets the extension). The file keeps the original resolution and is named `<name>-blurred.<ext>`. If the image is larger than your graphics card can handle, the editor scales it down and tells you before you start.

## The three effects

Intensity runs from 1 to 100 and is scaled to the image's shorter side, so a setting looks the same on a 600 px screenshot and a 6000 px photo.

| Effect | What it looks like | What it is for |
| --- | --- | --- |
| Gaussian | Smooth, even softening | Backgrounds, soft focus, the whole image |
| Pixelate | Square blocks of averaged color | Hiding faces, plates and screen content |
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

### What does it cost?

Nothing. There is no paid version, no account and no watermark.

### How big can an image loaded from a link be?

100 MiB (104,857,600 bytes) when your browser fetches the image directly; 4,400,000 bytes (about 4.2 MiB) when it goes through our proxy. Over the limit, loading stops; download the image and open the file instead.

### How do I paste a screenshot?

Copy the screenshot to your clipboard and press Ctrl+V (Cmd+V on a Mac) on this page. You can also press Ctrl+V with a link copied.

### Is it open source?

Yes. The code is public on GitHub under the MIT license, and issues and pull requests are welcome. You can also run your own copy; the README has the commands.

The code is on [GitHub](https://github.com/icaromol/blur-my-image-online-and-free).

---

## Notes for the PM (internal, not for the page)

**What D-032 changed here.** The page of its own and the "Open the editor" buttons are gone; the copy is shorter and starts at "How it works". The 1-hour Vercel log, the sentence "Like any host, Vercel sees your IP address on every request to the site" and the question "What gets logged when I load a link?" are removed. The question "Does it find faces, plates or text for me?" is removed too. The link-limit FAQ stays and states both caps.

**Questions cut for length.** "Which formats", "Will it shrink my photo" and "Is pixelated text safe" were in the earlier FAQ. Their answers are in step 1, step 3 and the redaction section directly above, so the FAQ keeps five questions. Add them back if the PM wants a longer FAQ.

**Open for the PM:**

1. **Detection.** D-032 says the face section does not open with "no automatic detection". I also removed the FAQ question about whether the editor finds faces, plates or text, because it was the same notice in another place. Nothing on the home page claims automatic detection. If Ícaro wants the notice somewhere, ask him.
2. **Link privacy without the log.** With the log out, the page no longer says "our code logs nothing" either, since that line alone would suggest no logs exist. It points to the README privacy section for details. Never add "no logs" or "we keep nothing" for links to this page.
3. **Use-case pages.** The home page has no "What you can blur" section and no links to the three pages, because Q-024 is open. If they stay, add a short section with one line per page and the footer links (`/blur-license-plate/`, `/blur-text-in-screenshot/`, `/blur-face-in-photo/`), about 60 words.
4. **Hero image.** None is needed now: the editor is the hero. The before-and-after screenshot is optional.
5. **The in-app warning (BMI-088).** Not quoted on this page.

**Headline choices.** The H1 of the screen belongs to the app. seo.md proposed "Blur or pixelate part of an image, in your browser" as the page H1; the app's own `<h1>` is "Blur My Image" (`src/ui/App.vue` line 121). Whether to change it, or add a static H1 above the app, is BMI-085's call.
