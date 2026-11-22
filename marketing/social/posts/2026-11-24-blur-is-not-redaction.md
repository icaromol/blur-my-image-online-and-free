---
status: draft
channels: linkedin, bluesky, mastodon
image: marketing/social/out/2026-11-24-blur-is-not-redaction-square.png
persona: P1 (LinkedIn), A1 (Bluesky, Mastodon)
type: blur-vs-redaction explainer, build-in-public
---

## linkedin

A 2016 PETS study found that blurred or pixelated text stayed recognizable unless the blur radius, or the mosaic block size, went past roughly 20 px.

Tools such as Unredacter go further and reconstruct pixelated text by brute force.

If you paste screenshots into support tickets, that changes what a light blur over a customer's email address is worth. It looks like it hides the address. Below that threshold, the study found the text was still recognizable.

I'm building a browser tool that blurs or pixelates part of an image, and this is what I'm designing around. Next to the Pixelate option the app will show a warning that blur is not redaction. For a password or a document number, the advice will be heavy pixelate as a minimum and a solid box once I've built one. The solid box isn't built yet. It's on the backlog.

## bluesky

Blurred text isn't always hidden. A 2016 PETS study found it stayed recognizable unless the blur radius or mosaic block size went past roughly 20 px. I'm building a blur tool that will warn about this next to Pixelate. A solid box is on the backlog.

## mastodon

A 2016 PETS study found blurred or pixelated text stayed recognizable unless the blur radius or mosaic block size went past roughly 20 px. Tools like Unredacter rebuild pixelated text by brute force.

I'm building a blur tool that will warn about this next to the Pixelate option. The advice will be heavy pixelate as a minimum for anything sensitive, and a solid box once I've built it. It's on the backlog.

#privacy #infosec

## image

Headline: Blur is not redaction.
Line: Text stayed recognizable below about 20 px.
(11 words. Template `tip`, format `square`. No URL, no handle in the footer.)

Visual: one line of made-up text (not a real name or email) shown twice, pixelated with small blocks on the left (still legible) and large blocks on the right (not legible). Label each side with its block size in px.

Alt text (Bluesky, Mastodon; adjust to the render): Two copies of the same line of text. The one pixelated with small blocks can still be read. The one pixelated with large blocks can't.

## notes (not for publishing)

Counts: Bluesky about 253 of 300. Mastodon about 410 of 500 including hashtags. LinkedIn about 1,050 of 3,000. Counted by hand, so recount in Buffer.

Sources
- Roughly 20 px, "radius or block size exceeded": README, section "Blur is not redaction", which links the [2016 study](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf).
- Unredacter and "brute force": same README section, linking [Bishop Fox](https://bishopfox.com/blog/unredacter-tool-never-pixelation).
- Warning next to Pixelate, "heavy Pixelate as a minimum", solid box "(on the backlog)": same README section and the Backlog list ("Solid box for real redaction").
- "PETS 2016" label: channels.md uses it for the same study.

Could not verify
- I couldn't open the PDF. Every statement about the study is the README's paraphrase. The post doesn't name the title or authors, and doesn't say whether "recognizable" means to a person or to software, because the README doesn't say.
- Intensity in the app is a 1 to 100 slider scaled to the image's shorter side (README), not a pixel count. The post doesn't connect the 20 px figure to a slider value. That mapping is a product question for Ícaro before the warning text is final.

Alternatives (pick one of each)
- LinkedIn hook. A: the current first line (specific number and source, nothing to rewrite). B: "Unredacter reconstructs pixelated text by brute force, and a 2016 PETS study put the line for blurred text at roughly 20 px." Reason: leads with the tool name that P1 can look up.
- Image headline. A: "Blur is not redaction." (plain, matches the README section title). B: "Is your blur above 20 px?" Reason: a question gets a reply, but it hints at a pixel rule the slider doesn't map to (see above).
- Closing ask, optional on LinkedIn, none by default (the no-ai-slop rules say to end on the last point). A: "If your team has a rule for screenshots that go into tickets, I'd like to know what it says." Reason: specific, and replies from strangers are the success measure in channels.md. B: "I'm still deciding how loud the warning should be. Tell me if it would stop you." Reason: asks for a decision, but the README doesn't leave that open, so use it only if Ícaro agrees it is.

Not claimed
- "Never uploaded" or any privacy claim. This post is about blur strength, and the README's URL-loading proxy exception would need to sit next to it.
