---
status: draft
channels: linkedin, bluesky, mastodon
image: marketing/social/out/2026-11-30-safari-webp-silent-png-square.png
persona: P1
type: build-in-public update (browser quirk)
---

## linkedin

Ask Safari for a WebP with canvas.toBlob('image/webp') and you get a PNG back. No exception, no warning. Safari can decode WebP, so loading works. It just can't encode it that way.

I'm building a browser blur tool that exports PNG, JPG or WebP, so I'm designing around this. PNG and JPEG will use the browser's native toBlob. WebP will use toBlob where the browser can encode it. For Safari, the app will feature-detect the problem and lazy-load @jsquash/webp, a WebAssembly build of libwebp, only in the browsers that need it. Everyone else never downloads it.

If you skip the check, the file you hand someone isn't the format they picked, and nothing tells you. That kind of bug only shows up when a test runs in the right browser, so the end-to-end tests in my plan cover export and run on WebKit as well as Chromium and Firefox.

Safari came up in another decision too. I considered Canvas 2D's ctx.filter = 'blur()' and rejected it. It only does gaussian blur, and caniuse lists Safari on iOS as unsupported through 26.5, so it would have needed a second code path anyway.

## bluesky

Ask Safari for a WebP with canvas.toBlob('image/webp') and you get a PNG, with no error. The blur tool I'm building will feature-detect that and lazy-load jSquash, a WebAssembly build of libwebp, only in browsers that need it.

## mastodon

Safari can decode WebP, but canvas.toBlob('image/webp') silently returns a PNG there. No error, no warning.

In the blur tool I'm building, PNG and JPEG export will use the browser's native toBlob, and so will WebP where the browser can encode it. For Safari, the app will feature-detect the problem and lazy-load jSquash, a WebAssembly build of libwebp, only in browsers that need it.

#webdev #WebAssembly

## image

Headline: Ask Safari for WebP. Get PNG.
Line: No error, no warning.
(10 words. Template `tip`, format `square`. No URL, no handle in the footer.)

Visual: two lines in the mono font, "requested: image/webp" above "received: image/png", with an arrow between them. Nothing else.

Alt text (Bluesky, Mastodon; adjust to the render): Two lines of code. The first reads requested image/webp. The second reads received image/png.

## notes (not for publishing)

Counts: Bluesky about 237 of 300. Mastodon about 408 of 500 including hashtags. LinkedIn about 1,250 of 3,000. Counted by hand.

Sources
- Safari decodes WebP, `toBlob('image/webp')` silently returns a PNG there, feature-detect, lazy-load @jsquash/webp (WebAssembly build of libwebp) only for those browsers: README, "How it works", paragraph "Export". The README links [@jsquash/webp](https://github.com/jamsinclair/jSquash). Table row "WebP fallback" says "loaded only where native encoding is missing".
- PNG and JPEG use native `canvas.toBlob`, WebP uses it where the browser can encode: same paragraph.
- Export formats PNG, JPG, JPEG, WebP: README, step 3.
- ctx.filter rejected (gaussian only, caniuse lists iOS Safari as unsupported through 26.5, second code path): README, line after the tech stack table.
- End-to-end tests on Chromium, Firefox and WebKit, covering paste, URL load and export: README, tech stack table (Playwright row) and the `pnpm test:e2e:all` line under "Development".

Could not verify
- The Safari behaviour has no linked source in the README and I couldn't test it, so it rests on the README alone. The README names no Safari version. The post says "Safari" without one, as the README does. Ícaro should reproduce it in a current Safari before this goes out.
- The README doesn't say how the feature detection works. The post doesn't guess.
- The caniuse claim ("unsupported through 26.5") is the README's, with no link. Recheck it on caniuse the day before posting, since Safari versions move.
- "That kind of bug only shows up when a test runs in the right browser" is a general statement, not a README line.
- The WebKit run is a script listed in the README for a project whose status is "planning". The post says "in my plan".

Alternatives (pick one of each)
- LinkedIn hook. A: the current "Ask Safari for a WebP..." (shows the quirk in one sentence). B: "Safari can decode WebP but can't encode it through canvas.toBlob, and it doesn't tell you." Reason: states the cause first, which suits readers who already know the API.
- Image headline. A: "Ask Safari for WebP. Get PNG." B: "toBlob('image/webp') returns a PNG." Reason: B is exact and searchable, A reads without knowing the API.
- Closing ask, optional, none by default. A: "If you've hit this in production, I'd like to know how you found it." Reason: a real question for developers, and replies are the success measure. B: "If your fix was different, I'm interested." Reason: lower pressure.

Not claimed
- Any size, speed or browser-share figure for the WebAssembly encoder or Safari. The README gives none.
- That the fallback exists. It's written as the plan.
