# Use page: blur a face

> **DRAFT. Q-024 answered by Ícaro on 2026-11-23:** the page stays, small, with the editor on it, linked from the home. Changes so far: the D-032 removals (the 1-hour Vercel log, the "no automatic detection" opener), the study wording (no numbers), the removal of any advice that a stronger setting protects, and the drop zone as the CTA (critique C4-3). The critique's C4-1 and C4-2 were not approved and are not applied.

> **Internal notes. Not for the page.** The notes below and the final "Choices for the owner" section must not be published.

- **Persona:** P3, the careful parent or school volunteer (secondary). A1, the press-freedom advocate, reads the same page for the limits.
- **Page:** `/blur-face-in-photo/` (slug from seo.md; BMI-078 confirms).
- **Target query:** `blur face in photo`. Also covered in plain sentences: blur faces in pictures, pixelate face in photo.
- **Limits:** title 45 characters (limit 59), meta description 129 characters (limit 154).
- **Structure:** seo.md "Page 3". Title, meta and H1 are the brief's, unchanged.
- **CTA (Q-024):** the page carries the editor, so the drop zone is the call to action. There is no "Open the editor" button and no `[EDITOR-URL]` on this page.
- **The face SERP is led by "automatic" tools**, but Ícaro did not want the face section to open with "no automatic detection" (D-032). The hero says only that you paint each face with the brush. If the page needs the detection notice, the PM asks him again; it is not added here.
- **Not read, so not cited:** the Buffalo face-recognition paper and the techpolicy.press article. The recognition caveat appears once, as a limit of this tool, not as a finding from either.
- **Shared sections are short on purpose.** The redaction explanation lives on the home page (`/#blur-is-not-redaction`). FAQ answers are written for faces.
- **Left out on purpose:** phones, video, anything legal about photographing or publishing faces, "anonymize". Sources: `claims-check.md`.

---

## Head tags

**Title** (45): `Blur a Face in a Photo Online | Blur My Image`

**Meta description** (129): `Paint over faces to pixelate or blur them. No account, no watermark. Image files you open, drop or paste never leave your device.`

---

## Hero

# Blur a face in a photo

Paint over each face you want hidden, pixelate or blur it, and download the photo. No account, no watermark.

You paint each face with the brush.

Image files you open, drop or paste never leave your device.

**Editor:** the editor with its drop zone sits here, under the hero text. No button.

---

## How to blur a face

1. Open the photo. Choose the file, drop it on the page or paste it with Ctrl+V (Cmd+V on a Mac).
2. Select the effect, Pixelate or Gaussian.
3. Select Brush, set its size from the toolbar (or with `[` and `]` while the photo has focus), and paint over the face.
4. Paint a little past the edge of the face. If you cover too much, the Eraser brings back the original pixels. Ctrl+Z (Cmd+Z) undoes.
5. Choose PNG, JPG, JPEG or WebP and download. The file is named `<name>-blurred.<ext>`.

---

## You choose the faces

The editor blurs the pixels under your brush, or the whole image if you pick **Blur entire image**. If you miss a face at the back of a group, it stays visible, so check the whole photo before you download.

A crowd takes a while to paint by hand; one face or a profile picture takes seconds.

---

## Which effect for a face

Pick the effect that makes the face hard to recognize: Pixelate turns it into square blocks, Gaussian softens it evenly. We can't promise a blurred face is unrecognizable. People who know the person may still recognize them. The editor says the same kind of thing about text: with every effect, it warns that blur and pixelate don't reliably hide text.

If a person must not be identifiable at all, crop them out in another editor, or leave the photo out. Cropping removes the pixels, so there is nothing left to recover.

---

## Several faces in one photo

Use one brush and as many strokes as you need. Every stroke keeps the effect and intensity selected when you painted it, so each face can get its own setting or all of them the same.

---

## What happens to the photo

Your browser decodes, edits and exports the photo. There is no upload step and no server-side storage, so a photo of a child opened from a file, dropped on the page or pasted from the clipboard stays on your device.

The exported file has no EXIF metadata, so the GPS coordinates, timestamp and camera model of the original are dropped. No watermark. The picture still shows what is in it, such as a school sign or a team shirt.

Links are the exception: "Links are fetched through our server. Files you open, drop or paste never leave your browser." A photo loaded by link can pass once through our proxy, which doesn't keep a copy of the image. For a photo of a child, save it and open the file instead.

---

## Blur is not redaction

The research on blur is about text, not faces: a [2016 study](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf) concluded that pixelation and blur are not viable ways to redact text, so this page cannot say how a blur holds up on a face. [More on this, with sources](/#blur-is-not-redaction).

---

## Questions

### How do I blur several faces?

Paint each one. A stroke keeps the effect and intensity you had selected when you painted it, and you can give each face its own.

### Can a blurred face still be recognized?

It can be, and nothing here guarantees otherwise. Cropping the person out in another editor removes the pixels.

### Should I pixelate or blur a face?

Pixelate. It is the effect meant for obscuring faces. Gaussian softens evenly, which suits backgrounds.

### Is the photo uploaded?

Not a file you open, drop or paste. A link to the photo is the exception, explained above.

### Does it remove location data?

From the file, yes: the export drops EXIF metadata, which includes GPS coordinates. It does not hide anything visible in the picture.

### Does it work on video?

No. It works on images.

### Can I undo a stroke or bring back a face I covered by mistake?

Yes. The Eraser removes the effect where you drag and brings back the original pixels, and Ctrl+Z (Cmd+Z) undoes.

---

## Other things people hide

[Blur a license plate in a photo](/blur-license-plate/) for a car listing. [Pixelate a name or number in a screenshot](/blur-text-in-screenshot/) for a chat or an order page. Back to [Blur My Image](/).

---

## Closing call to action

Open the photo, paint each face, download.

**CTA:** no button. The drop zone at the top of the page is the action; dropping a file or pasting with Ctrl+V also works from here (`src/ui/App.vue`:97-102).

---

## Choices for the owner (internal, not for the page)

**Headline (H1)**

| Option | Text | Reason |
| --- | --- | --- |
| A (used) | Blur a face in a photo | The brief's H1, and the exact phrase of the target query. |
| B | Blur the faces you choose in a photo | Puts "you choose" in the H1. Longer, and the target phrase is split. |
| C | Blur faces in a photo, by hand | Says the manual part in three words. "By hand" can read as a drawback. |

**Button text.** No button since Q-024: the page carries the editor, and its drop zone is the CTA (critique C4-3).
