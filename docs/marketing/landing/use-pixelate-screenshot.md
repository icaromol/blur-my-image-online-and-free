# Use page: blur or pixelate text in a screenshot

> **DRAFT, on hold: Q-024.** Whether the three use-case pages stay is Ícaro's open question. Nothing here is built or reworked beyond three clean-ups and the URL markers: the D-032 removal of the 1-hour Vercel log, the study wording (no numbers, no email claim), and the removal of any advice that a stronger setting protects.

> **Internal notes. Not for the page.** The notes below and the final "Choices for the owner" section must not be published.

- **Persona:** P1, the work screenshot redactor (primary), and everyday screenshot sharers (P2 secondary).
- **Page:** `/blur-text-in-screenshot/`. The file name says "pixelate screenshot" because that was the brief; seo.md recommends leading with "blur text in a screenshot" (nine autocomplete continuations against two, which is phrasing variety, not volume). The page leads with it in the title and H1 and says "pixelate" in the first step.
- **Target query:** `blur text in screenshot`. Also covered in plain sentences: hide name in screenshot, redact screenshot.
- **Limits:** title 53 characters (limit 59), meta description 151 characters (limit 154).
- **Structure:** seo.md "Page 2". Title, meta and H1 are the brief's, unchanged.
- **Markers:** `[EDITOR-URL]` is the editor button's target. Not a real address.
- **Anchor id for BMI-085:** the heading "When pixelated text can still be read" must get the id `#when-pixelated-text-can-still-be-read`.
- **Shared sections are short on purpose.** The full redaction explanation lives on the home page (`/#blur-is-not-redaction`). FAQ answers are written for screenshots.
- **Detection:** decided: not an opener (D-033). The hero no longer says it. The answer is in the FAQ, once ("Does it find the text for me?"). If the owner wants it as an opener, the PM asks (Q-024).
- **Left out on purpose:** phones, OS-specific screenshot tools, how to recover text, claims of automatic detection. Sources: `claims-check.md`.
- **Before this goes live:** the "Check it yourself" steps on the home page must have been run on the live site (seo.md), and re-read when BMI-082 is built.

---

## Head tags

**Title** (53): `Blur or Pixelate Text in a Screenshot | Blur My Image`

**Meta description** (151): `Paste a screenshot, paint over a name or number and pixelate it. No account, no watermark. Image files you open, drop or paste never leave your device.`

---

## Hero

# Blur or pixelate text in a screenshot

Copy the screenshot, press Ctrl+V (Cmd+V on a Mac) in the editor, paint over the name, email address or number, and download it. No account, no watermark.

Image files you open, drop or paste never leave your device.

**Button:** [Open the editor]([EDITOR-URL])

---

## Paste, paint, download

1. Copy the screenshot to your clipboard and open the editor.
2. Press Ctrl+V (Cmd+V on a Mac). The screenshot opens.
3. Select Pixelate.
4. Select Brush and drag over the name, email address or number. The Eraser puts back the original pixels where you painted too much, and Ctrl+Z (Cmd+Z) undoes.
5. Choose PNG, JPG, JPEG or WebP and download. The file is named `<name>-blurred.<ext>`.

If the screenshot is already a file, drop it anywhere on the page or choose it from the drop zone.

---

## Hide an email address, a name or a number

Paint over the whole value and a little past its edges, so no letters stick out at the ends. Then look at the rest of the screenshot. Names turn up in places you stopped seeing: a browser tab, an avatar, the address bar, a line in the footer.

An email address and an order number get the same treatment.

---

## When pixelated text can still be read

A [2016 study](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf) recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels; its authors concluded that pixelation and blur are not viable ways to redact text. Pixelation makes text harder to read; for anything that must stay secret, cover it with a solid box in another editor, or leave it out. [More on this, with sources](/#blur-is-not-redaction).

---

## Pixelate or Gaussian for text

Pixelate replaces the text with square blocks of averaged color. Gaussian smooths it. Pixelate is the effect for hiding screen content, and Gaussian is the one for backgrounds and soft focus. Neither effect guarantees that the text cannot be read again.

---

## What happens to the screenshot

Image files you open, drop or paste never leave your device. A screenshot pasted from your clipboard is decoded, edited and exported by your browser. The exported file has no EXIF metadata and no watermark.

Loading by link is the exception: "Links are fetched through our server. Files you open, drop or paste never leave your browser." An http:// link always goes through our proxy, and so does an https link whose server refuses direct access. The proxy doesn't keep a copy of the image. To keep the screenshot off our server, paste it or open the file instead.

To see it for yourself, open your browser's developer tools in a private window, select the Network tab, and paste a screenshot. No request should carry the image. The steps and their limits are on the home page under [Check it yourself](/#check-it-yourself).

---

## Questions

### How do I blur text in a screenshot?

Paste it into the editor with Ctrl+V (Cmd+V on a Mac), select Pixelate, paint over the text with the Brush and download. The steps are above.

### How do I blur a screenshot on Windows or Mac?

In a browser, with the steps above. This page does not cover the screenshot tools built into either system.

### Can I paste a screenshot directly?

Yes. Ctrl+V or Cmd+V with the screenshot on the clipboard. You can also drop a file anywhere on the page.

### Is a pixelated screenshot safe to share?

Not for anything that must stay secret. Cover that with a solid box in another editor, or leave it out. The study in the section above is the reason.

### Can pixelated text be read again?

Sometimes. The study above recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels. Tools such as [Unredacter](https://bishopfox.com/blog/unredacter-tool-never-pixelation) do it by rendering guesses in the same font and comparing them.

### What is the difference between blur and redaction?

Blur and pixelation change how text looks and can sometimes be reversed. Redaction means the information is gone. A solid box is the closest to that, and the editor does not have one.

### Does the screenshot get uploaded?

Not when you paste it, drop it or open it as a file. Links are the exception: see "What happens to the screenshot" above.

### Which formats can I save?

PNG, JPG, JPEG or WebP. JPG and JPEG are the same format; the choice sets the file extension.

### Does it find the text for me?

No. You paint the area yourself; the editor doesn't pick it for you. It blurs what you paint, or the whole image if you choose **Blur entire image**.

---

## Other things people hide

[Blur a license plate in a photo](/blur-license-plate/) for a car listing. [Blur a face](/blur-face-in-photo/) for a group photo. Back to [Blur My Image](/).

---

## Closing call to action

Paste the screenshot, pixelate the name, download.

**Button:** [Open the editor]([EDITOR-URL])

---

## Choices for the owner (internal, not for the page)

**Headline (H1)**

| Option | Text | Reason |
| --- | --- | --- |
| A (used) | Blur or pixelate text in a screenshot | The brief's H1. "Blur text in screenshot" has the widest autocomplete variety and "pixelate" matches the first step. |
| B | Pixelate a name or number in a screenshot | The persona's own nouns. It is narrower and loses the generic "text" phrase. |
| C | Hide text in a screenshot | Matches `hide text in screenshot`. "Hide" suggests a guarantee that the redaction section then has to take back. |

**Button text**

| Option | Text | Reason |
| --- | --- | --- |
| A (used) | Open the editor | Accurate, and the same on every page. |
| B | Paste a screenshot | Names the first action, which is the fastest path for this reader. The button opens the editor first, then the paste happens. |
| C | Blur your screenshot | Names the task. It suggests an instant result. |
