---
status: draft
channels: linkedin, bluesky, mastodon
image: marketing/social/out/2026-11-30-safari-webp-silent-png-square.png
persona: P1
type: build-in-public update (browser quirk)
---

## linkedin

Ask Safari for a WebP with canvas.toBlob('image/webp') and you get a PNG back. No exception, no warning. Safari can decode WebP, so loading works. It just can't encode it that way.

I'm building a browser blur tool that exports PNG, JPG or WebP, so I'm designing around this. PNG and JPEG will use the browser's native toBlob. WebP will use toBlob where the browser can encode it. For Safari, the app will feature-detect the problem and lazy-load jSquash's WebP encoder (libwebp compiled to WebAssembly) only in the browsers that need it. Everyone else never downloads it.

If you skip the check, the file you hand someone isn't the format they picked, and nothing tells you. So the end-to-end test does what Safari does. It patches toBlob to hand back a PNG when asked for WebP, then checks the downloaded file still has a WebP header. It runs on Chromium, Firefox and WebKit, and real Safari gets checked by hand before a release.

Safari came up in another decision too. I considered Canvas 2D's ctx.filter = 'blur()' and rejected it. It only does gaussian blur, and caniuse lists Safari on iOS as unsupported through 26.5, so it would have needed a second code path anyway.

## bluesky

Ask Safari for a WebP with canvas.toBlob('image/webp') and you get a PNG, with no error. The blur tool I'm building will feature-detect that and lazy-load jSquash's WebP encoder (libwebp compiled to WebAssembly) only in browsers that need it.

## mastodon

Safari can decode WebP, but canvas.toBlob('image/webp') silently returns a PNG there. No error, no warning.

In the blur tool I'm building, PNG and JPEG export will use the browser's native toBlob, and so will WebP where the browser can encode it. For Safari, the app will feature-detect the problem and lazy-load jSquash's WebP encoder (libwebp compiled to WebAssembly) only in browsers that need it.

#webdev #WebAssembly

## image

Headline: Ask Safari for WebP. Get PNG.
Line: No error, no warning.
(10 words. Template `tip`, format `square`. No URL, no handle in the footer.)

Visual: two lines in the mono font, "requested: image/webp" above "received: image/png", with an arrow between them. Nothing else.

Alt text (Bluesky, Mastodon; adjust to the render): Two lines of code. The first reads requested image/webp. The second reads received image/png.

## notes (not for publishing)

BLOCKING before publish: Ícaro reproduces toBlob('image/webp') in a current Safari and rechecks the caniuse 'unsupported through 26.5' figure.

Counts: Bluesky about 253 of 300. Mastodon about 424 of 500 including hashtags. LinkedIn about 1,330 of 3,000. Counted by hand after the review edits, so recount in Buffer.

Sources
- Safari decodes WebP, `toBlob('image/webp')` silently returns a PNG there, feature-detect, lazy-load @jsquash/webp (WebAssembly build of libwebp) only for those browsers: README, "How it works", paragraph "Export". The README links [@jsquash/webp](https://github.com/jamsinclair/jSquash). Table row "WebP fallback" says "loaded only where native encoding is missing".
- PNG and JPEG use native `canvas.toBlob`, WebP uses it where the browser can encode: same paragraph.
- Export formats PNG, JPG, JPEG, WebP: README, step 3.
- ctx.filter rejected (gaussian only, caniuse lists iOS Safari as unsupported through 26.5, second code path): README, line after the tech stack table.
- The fallback test: `e2e/export.spec.ts` lines 34-55. It adds an init script that replaces `HTMLCanvasElement.prototype.toBlob` so a request for `image/webp` is passed on as `image/png` (the code comment says "Behave like Safari"), opens an image, exports WebP, and asserts the downloaded bytes 8 to 12 read `WEBP` and the size matches. It is a stub, so it runs the same way in every engine. WebKit in Playwright is not Safari. `docs/quality.md` line 44 says "The Safari WebP fallback is exercised by stubbing `toBlob`."
- Where it runs: `docs/quality.md`, "Supported browsers" and "CI" tables. Playwright on Chromium for every PR, on Firefox and WebKit on `main`. Real Safari (macOS and iOS) is checked by hand before a release.
- jSquash: `src/export/encode.ts` imports `@jsquash/webp/encode` and calls `encode(pixels, { quality })` on the canvas pixels. The README describes it as a WebAssembly build of libwebp; the post says "jSquash's WebP encoder (libwebp compiled to WebAssembly)".

Could not verify
- The Safari behaviour has no linked source in the README and I couldn't test it, so it rests on the README alone. The README names no Safari version. The post says "Safari" without one, as the README does. Ícaro should reproduce it in a current Safari before this goes out.
- The detection method, now checked in `src/export/encode.ts` lines 49-61 (`supportsNativeWebp`): it calls `toBlob` with `image/webp` on a 1x1 canvas and reports native support only if the returned `blob.type` is `image/webp`. The result is cached, and a rejected call counts as unsupported. The posts say only "feature-detect the problem". Add "by encoding a 1x1 canvas and checking the blob type" if a developer audience wants the method.
- The caniuse claim ("unsupported through 26.5") is the README's, with no link. Recheck it on caniuse the day before posting, since Safari versions move.
- Remaining limit on the test: it simulates Safari's behaviour with a stub, so it shows the fallback path works, not that real Safari behaves as described. That is why the Safari reproduction above blocks publishing.
- The posts still say "the app will" for the fallback, as in the earlier draft, because the README status is "planning". The code for it exists on the branch, so Ícaro can switch to the present tense if it has shipped by the post date.

Alternatives (pick one of each)
- LinkedIn hook. A: the current "Ask Safari for a WebP..." (shows the quirk in one sentence). B: "Safari can decode WebP but can't encode it through canvas.toBlob, and it doesn't tell you." Reason: states the cause first, which suits readers who already know the API.
- Image headline. A: "Ask Safari for WebP. Get PNG." B: "toBlob('image/webp') returns a PNG." Reason: B is exact and searchable, A reads without knowing the API.
- Closing ask, optional, none by default. A: "If you've hit this in production, I'd like to know how you found it." Reason: a real question for developers, and replies are the success measure. B: "If your fix was different, I'm interested." Reason: lower pressure.

Not claimed
- Any size, speed or browser-share figure for the WebAssembly encoder or Safari. The README gives none.
- That the fallback exists. It's written as the plan.
