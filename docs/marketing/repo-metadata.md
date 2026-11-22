# GitHub repo metadata (BMI-050, pre-flip draft)

- **Persona:** P1 (work screenshot redactor), with A1 (press-freedom advocate) as the reader who checks the wording.
- **Channel:** the GitHub repository sidebar, search results and link previews. The git owner applies it. **Applied on GitHub: candidate A of section 1** (without "open source"), by the git owner. Candidate C and the open-source variants were not applied. Section 3 only after the repo is public.
- **Target query:** none. Topics carry the search terms.
- **Limits:** description at most 350 characters. Topics: at most 20, each lowercase letters, numbers and hyphens, at most 50 characters. Website field: a URL.
- **Product status:** README says pre-release (v1 built, not deployed), so none of the texts say the tool is live, and none has a URL or "try it".
- **Privacy wording:** follows D-010. "Image files you open, drop or paste never leave your device." The URL-loading proxy exception lives in the README's Privacy section, which is where the repo page links to. A 350-character field has no room for it, and the scoped wording ("image files you open, drop or paste") is what keeps the line true.
- **Character counts** (A 210, B 266, C 316, A open-source 237, C open-source 343) were recounted word by word. C's last sentence was rewritten after the review round (it used to be 281 and 308) and counted by hand again. A, B and A open-source are well below 350; C open-source is within 7 characters of it. Confirm with `wc -m` before pasting.

## 1. Description candidates (without "open source")

These are safe to apply at any time, including while the repo is private.

**A. Concrete task, P1's words (210 characters). APPLIED on GitHub.**

> Blur or pixelate any part of an image in your browser. Paste a screenshot, paint over the email address, download it. Free, no account, no watermark. Image files you open, drop or paste never leave your device.

Checks: browser tool (README intro); paste (Ctrl+V, README step 1); brush paints over areas (step 2); download (step 3); free, no account, no watermark (README intro); last sentence is the D-010 line word for word.

**B. Feature list and stack, for developers (266 characters)**

> Browser tool to blur or pixelate parts of a screenshot or photo. Paste an image to load, brush over what to hide, download as PNG, JPG or WebP. Exports carry no EXIF data. Image files you open, drop or paste never leave your device. Built with Vue, PixiJS and WebGL.

Checks: paste loads an image (README step 1; "paste" covers Ctrl+V and Cmd+V); export formats PNG, JPG, JPEG, WebP (README step 3); EXIF dropped on export (README Privacy); Vue 3, PixiJS 8 and WebGL shaders (README tech stack and How it works).

**C. Includes the limit, for A1 (316 characters). Not applied.**

> Blur or pixelate parts of an image in your browser. Gaussian, pixelate and motion effects, painted on with a brush. Exports drop EXIF metadata. Image files you open, drop or paste never leave your device. Blur and pixelation don't reliably hide text. For a secret, use a solid box in another editor, or leave it out.

Checks: the three effects (README Blur effects); EXIF (README Privacy); the last two sentences restate README "Blur is not redaction" (the study's authors concluded that pixelation and blur are not viable ways to redact text; "cover it with a solid box in another editor or leave it out of the image"). No advice about intensity: the earlier "use heavy pixelate as a minimum" was removed from the README (D-033) because the study doesn't support it.

## 2. Recommended pick

**A**, and it is the one applied on GitHub. It names a real job (a screenshot, an email address) in the words P1 searches with, carries the D-010 line unchanged, and fits one screen of search results. The blur-is-not-redaction note is in the README, and the app warns with every effect that blur and pixelate don't reliably hide text. If the user wants the limit visible on the repo page itself, C is the one to use.

## 3. Open-source variants (only after BMI-050 makes the repo public)

Use one of these only if the repo is public when the text is applied. `gh repo view --json visibility` must return `PUBLIC`.

**A, with "open source" (237 characters)**

> Blur or pixelate any part of an image in your browser. Paste a screenshot, paint over the email address, download it. Free, no account, no watermark. Image files you open, drop or paste never leave your device. Open source, MIT licensed.

**C, with "open source" (343 characters). Not applied.**

> Blur or pixelate parts of an image in your browser. Gaussian, pixelate and motion effects, painted on with a brush. Exports drop EXIF metadata. Image files you open, drop or paste never leave your device. Blur and pixelation don't reliably hide text. For a secret, use a solid box in another editor, or leave it out. Open source, MIT licensed.

Why it holds: the README License section says MIT and `LICENSE` exists in the repo root. Once the code is readable, this also gives P1 and A1 the second half of their check (read the code, plus the DevTools Network tab).

Note: the skills question that D-014 closes (it calls it Q-008) is closed: `brandkit`, `design-taste-frontend` and `no-ai-slop` go public with the repo. Their SKILL.md files state no author or license, and their origin is not verified. "MIT licensed" refers to the root `LICENSE` and stays accurate for the project.

## 4. Topics (11)

```
blur-image
pixelate
gaussian-blur
screenshot
privacy
browser-based
no-upload
webgl
pixijs
vue
typescript
```

Checked against the product:

| Topic | Why it is true |
| --- | --- |
| blur-image | The one job of the product |
| pixelate | One of the three effects |
| gaussian-blur | One of the three effects, and the name people search |
| screenshot | The P1 use case; README and audience lead with screenshots. Images in any format the browser decodes also work |
| privacy | Local processing, EXIF dropped, no analytics cookies (README Privacy) |
| browser-based | Decode, edit and encode happen in the browser |
| no-upload | Files from open, drop or paste are never uploaded. A link goes through the proxy only when the remote server blocks cross-origin requests; the proxy fetches the image and keeps nothing. A topic has no room for the exception, so the README carries it. If the git owner prefers no wording risk, swap for `client-side` |
| webgl | Effects run as WebGL fragment shaders |
| pixijs | PixiJS 8 renders the effects |
| vue | Vue 3 UI |
| typescript | TypeScript across the code |

Considered and left out:

| Topic | Reason |
| --- | --- |
| image-editor | Too broad. The README says the product does one job and lists crop, resize and rotate as out of scope |
| blur-faces, face-blur | No face detection in v1 (it is on the backlog). A user can paint over a face, but the topic implies a feature |
| redaction, redact | A1 rule: never call it redaction. The README states blur is not redaction |
| open-source | Not before the flip. After the flip it adds little, since GitHub shows the license |
| mobile, pwa, ios | Phone use is unproven (audience.md says so) |
| hono, vite, vercel | True, but nobody searches for a blur tool with them, and they use up topic slots |

## 5. Website field

**Status note (22 November 2026):** the reviewer reports that the repository's "About" homepage field currently shows the app's domain. This file did not set it and I did not verify it. Putting the URL in public places is the owner's call (Q-005, D-016), so this file doesn't change it. Nothing else from this file is applied on GitHub besides candidate A. The paragraph below is what this file recommended when the field was still empty.

Leave it empty. The hosted URL does not exist until BMI-003 creates the Vercel project (Q-005). When it does, the git owner sets the website field to that URL, with no tracking parameters, in the same change that puts it in the README. Until then an empty field is correct. Do not put the repo URL, a placeholder or a `localhost` address there.

## Not verified

- Topic search volume is not verified. No keyword data exists yet (audience.md, "What the research could and could not answer"). The topics are chosen from the persona search words and the stack, not from volumes.
- GitHub's topic rules (lowercase, hyphens, at most 50 characters, at most 20 topics) are written from memory of GitHub's documentation and were not checked against a live page.
