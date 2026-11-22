---
status: draft
channels: linkedin, bluesky, mastodon
image: marketing/social/out/2026-11-28-canvas-export-drops-exif-square.png
persona: A1 (Bluesky, Mastodon), P1 (LinkedIn)
type: privacy tip, build-in-public
---

## linkedin

Canvas export writes pixels only, so a file exported from a canvas has no EXIF. In the blur tool I'm building, that means the camera model, the timestamps and the GPS coordinates from the original photo are dropped on export.

I'm treating that as a feature. Say you hide the plate in a car listing photo. A tool that keeps the metadata could still publish where the photo was taken.

Two limits, so nobody reads more into this than it says. EXIF will be gone, but the picture won't be: a face or a house number you didn't cover is still in the pixels. And I haven't shipped anything yet, so there's nothing to test today. Once there's a build, the check takes a minute. Export a photo that has GPS data and open the result in any EXIF viewer.

## bluesky

Canvas export writes pixels only, so the blur tool I'm building will export files with no EXIF. Camera model, timestamps and GPS coordinates from the original get dropped. A face or a plate you didn't cover is still in the pixels.

## mastodon

Canvas export writes pixels only, so the blur tool I'm building will export files with no EXIF. Camera model, timestamps and GPS coordinates from the original get dropped.

A face or a plate you didn't cover is still in the pixels. Once there's a build, the check is to export a photo with GPS data and open the result in any EXIF viewer.

#privacy #infosec

## image

Headline: Canvas export drops EXIF.
Line: No camera model, timestamps or GPS.
(10 words. Template `tip`, format `square`. No URL, no handle in the footer.)

Visual: a file card with three metadata rows (camera model, timestamp, GPS) struck through, next to a clean pixel grid. Use placeholder values only, never a real location.

Alt text (Bluesky, Mastodon; adjust to the render): A photo file card listing camera model, timestamp and GPS location, each crossed out, beside a plain grid of pixels.

## notes (not for publishing)

Counts: Bluesky about 230 of 300. Mastodon about 365 of 500 including hashtags. LinkedIn about 870 of 3,000. Counted by hand.

Sources
- "Exported files contain no EXIF metadata. Camera model, timestamps and GPS coordinates from the original are dropped, because canvas export writes pixels only": README, section "Privacy", third bullet.
- Export through the canvas (PNG, JPEG, WebP): README, "How it works", paragraph "Export".

Could not verify
- The README states the canvas-export fact without a linked source, and I had no way to test it. The post says it for canvas export in general, as the README does. It makes no claim about any specific browser or about colour profiles or orientation data.
- "A tool that keeps the metadata could still publish where the photo was taken" is general knowledge about GPS in EXIF, not a README sentence. It names no tool.
- The EXIF-viewer check is my suggestion for how a reader can verify the claim. The README doesn't describe it. It's written as "once there's a build" because the README status is "planning".

Alternatives (pick one of each)
- LinkedIn hook. A: the current first sentence. B: "A photo can carry its camera model, timestamps and GPS coordinates. A canvas can't." Reason: shorter and shows the contrast at once, but it is a bit more of a slogan.
- Image headline. A: "Canvas export drops EXIF." B: "Pixels only." Reason: B is stronger as a visual but is meaningless without the body text.
- Closing ask, optional, none by default. A: "If you teach people to strip metadata before sharing photos, I'd like to know what you tell them to check." Reason: aimed at A1, the safety trainers. B: "Tell me which metadata I've forgotten." Reason: invites correction, but could read as fishing.

Not claimed
- "Anonymous", "secure" or any claim that EXIF removal protects a person in the photo. audience.md bans those words and the post says what's left in the pixels.
- "Never uploaded". The README has an exception (loading by URL through a proxy), and this post is about metadata, not upload.
