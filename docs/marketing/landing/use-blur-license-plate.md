# Use page: blur a license plate

> **DRAFT, on hold: Q-024.** Whether the three use-case pages stay is Ícaro's open question. Nothing here is built or reworked beyond three clean-ups and the URL markers: the D-032 removal of the 1-hour Vercel log, the study wording (no numbers, no email claim), and the removal of any advice that a stronger setting protects.

> **Internal notes. Not for the page.** The notes below and the final "Choices for the owner" section must not be published.

- **Persona:** P2, the private seller (secondary): someone posting photos of a car, not technical, a few times a year.
- **Page:** `/blur-license-plate/` (slug from seo.md; BMI-078 confirms).
- **Target query:** `blur license plate in photo`. Also covered in plain sentences: blur number plate, hide license plate in photo.
- **Limits:** title 54 characters (limit 59), meta description 137 characters (limit 154).
- **Structure:** seo.md "Page 1". Title, meta and H1 are the brief's, unchanged.
- **Markers:** `[EDITOR-URL]` is the editor button's target. Not a real address.
- **Shared sections are short on purpose.** The redaction explanation lives on the home page (`/#blur-is-not-redaction`); this page gives two sentences and a link. FAQ answers are written for plates.
- **Detection:** decided: not an opener (D-033). The hero no longer says it. The answer is in the FAQ, once ("Does it find the plate by itself?"). If the owner wants it as an opener, the PM asks (Q-024).
- **Left out on purpose:** anything legal about plates, video, phones, claims of automatic detection. Sources: `claims-check.md`.

---

## Head tags

**Title** (54): `Blur a License Plate in a Photo Online | Blur My Image`

**Meta description** (137): `Paint over a license plate to pixelate or blur it. No account, no watermark. Image files you open, drop or paste never leave your device.`

---

## Hero

# Blur a license plate in a photo

Paint over the plate with the brush, pixelate it or blur it, and download the photo. No account, no watermark.

Image files you open, drop or paste never leave your device.

**Button:** [Open the editor]([EDITOR-URL])

---

## How to blur a license plate

1. Open the photo. Choose the file, drop it on the page or paste it with Ctrl+V (Cmd+V on a Mac).
2. Select Pixelate.
3. Select Brush. Set its size from the toolbar, or with `[` and `]` while the photo has focus, and drag over the plate.
4. If you paint outside the plate, the Eraser brings back the original pixels. Ctrl+Z (Cmd+Z) undoes.
5. Choose PNG, JPG, JPEG or WebP and download. The file is named `<name>-blurred.<ext>`, so a photo called `car.jpg` downloads as `car-blurred.jpg`.

---

## Pixelate or blur for a plate

Pixelate turns the plate into square blocks of averaged color. Gaussian softens it evenly. Pixelate is the effect meant for hiding plates. Neither effect guarantees that the plate cannot be read again.

Intensity is scaled to the photo's shorter side, so a setting that works on a 600 px photo gives the same look on a 6000 px one.

---

## Several plates in one photo

Paint each plate. Every stroke uses the effect and intensity selected at the moment you paint it, so the plates get one effect and the rest of the photo stays as it was. A parking lot photo with six plates has six plates to paint.

---

## A marketplace that blurs plates

carsales, an Australian marketplace, [blurs plates in listing photos automatically](https://business.carsales.com.au/insights/auto-industry-news/carsales-innovation-tackles-number-plate-cloning/) to make cloning harder.

---

## What happens to your photo

Image files you open, drop or paste never leave your device. Your browser does the blurring and the export, and the exported file has no EXIF metadata: the GPS coordinates, timestamp and camera model of the original are gone. It carries no watermark.

A photo loaded from a link is the exception: "Links are fetched through our server. Files you open, drop or paste never leave your browser." The image can pass once through a proxy that doesn't keep a copy of the image. To keep the photo off our server, save it and open the file.

---

## Blur is not redaction

A plate is text, and a [2016 study](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf) recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels, and its authors concluded that pixelation and blur are not viable ways to redact text. If a plate must not be read, crop it out or cover it with a solid box in another editor. [More on this, with sources](/#blur-is-not-redaction).

---

## Questions

### Does it find the plate by itself?

No. You paint the area yourself; the editor doesn't pick it for you. It blurs what you paint, or the whole image if you choose **Blur entire image**.

### Can I blur more than one plate?

Yes. Paint each plate with the brush, and use the eraser if a stroke goes wrong. Different plates can get different settings.

### Should I pixelate or blur a plate?

Pixelate. It is the effect meant for hiding plates.

### Can someone undo the blur?

Sometimes: the 2016 study linked above recovered pixelated and blurred text. Cropping the plate out in another editor removes it.

### Is the photo uploaded?

Not a file you open, drop or paste. A link to the photo is the exception, explained above.

### Does the file keep the GPS location?

No. The export drops EXIF metadata, which includes GPS coordinates, timestamps and the camera model. The picture itself still shows whatever is in it, such as a street sign or a house number.

### Does it work on video?

No. It works on images.

### Will it shrink my photo?

No, unless the photo is larger than your graphics card can handle. Then the editor tells you before you start and the download is the scaled size.

---

## Other things people hide

[Blur a face](/blur-face-in-photo/) if the photo shows a person. [Pixelate a name or number in a screenshot](/blur-text-in-screenshot/) for a chat, an order page or a bug report. Back to [Blur My Image](/).

---

## Closing call to action

Open the photo, pixelate the plate, download.

**Button:** [Open the editor]([EDITOR-URL])

---

## Choices for the owner (internal, not for the page)

**Headline (H1)**

| Option | Text | Reason |
| --- | --- | --- |
| A (used) | Blur a license plate in a photo | The brief's H1, and the exact phrase of the target query. |
| B | Blur a number plate or license plate in a photo | Covers the UK and Australian wording in the H1. Longer, and the page body already uses both words. |
| C | Hide a license plate in a photo | The `hide` variants also appear in autocomplete. "Hide" promises more than blur can keep, so it fits the page less well. |

**Button text**

| Option | Text | Reason |
| --- | --- | --- |
| A (used) | Open the editor | Accurate, and the same on every page. |
| B | Blur your photo | Names the task. It suggests an instant result. |
| C | Choose a photo | The first action in the editor. Reads like a file picker on this page. |
