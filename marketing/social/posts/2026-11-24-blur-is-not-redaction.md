---
status: draft
channels: linkedin, bluesky, mastodon
image: marketing/social/out/2026-11-24-blur-is-not-redaction-square.png
persona: P1 (LinkedIn), A1 (Bluesky, Mastodon)
type: blur-vs-redaction explainer, build-in-public
---

## linkedin

A 2016 PoPETs paper by Hill, Zhou, Saul and Shacham used hidden Markov models to recover pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels. Its authors conclude that pixelation and blur are not viable ways to redact text.

Bishop Fox describes Unredacter, a tool that renders guesses in the same font and size and compares each one with the pixelated image. Its write-up recommends black bars that cover the whole text.

If you paste screenshots into support tickets, a blur over a customer's email address may not hide it, even though it looks like it does.

I'm building a browser tool that blurs or pixelates part of an image. It will warn about this. It won't have a solid box in v1. For a password, a document number or anything that must stay secret, cover it with a solid box in another editor or leave it out of the image.

## bluesky

Blurred or pixelated text isn't always hidden. A 2016 PoPETs paper recovered both with hidden Markov models, and its authors say neither is a viable way to redact text. The blur tool I'm building will warn about this. For a secret, use a solid box in another editor.

## mastodon

A 2016 PoPETs paper recovered pixelated and blurred text with hidden Markov models. Its authors conclude neither is a viable way to redact text.

Bishop Fox describes Unredacter, which renders guesses in the same font and compares them with the pixelated image.

I'm building a blur tool that will warn about this. The app won't have a solid box in v1. For a password or document number, use one in another editor or leave it out.

#privacy #infosec

## image

Headline: Blur is not redaction.
Line: Researchers recovered blurred and pixelated text.
(10 words. Template `tip`, format `square`. No URL, no handle in the footer.)

Visual: one line of made-up text (not a real name or email) shown twice. Left: pixelated, labeled "pixelated". Right: covered by a solid black bar, labeled "solid box". No numbers, no app UI.

Alt text (Bluesky, Mastodon; adjust to the render): Two copies of the same line of made-up text. One is pixelated. The other is covered by a solid black bar.

## notes (not for publishing)

BLOCKING before publish:
- Ícaro approves in Buffer. Nothing is queued or published.
- The Mastodon version stays out of the queue until Ícaro decides item 4 in `docs/marketing/channels.md` ("AI-drafted posts"): either he rewrites it in his own words or it carries an AI disclosure. mastodon.social requires disclosure, and infosec.exchange says "LLM and AI operated accounts are not permitted", so item 3 (which server) matters too.

Counts (measured after the last edit): Bluesky 266 of 300. Mastodon 449 of 500, counting the hashtag line and the blank lines between paragraphs (144 + 115 + 167 characters for the three paragraphs, 17 for the hashtags, 6 for the gaps). Bluesky and Mastodon were measured exactly with grep line-length patterns, not estimated, and the Mastodon figure is after the last edit. An earlier reviewer measurement of 466 and 283 was taken before the warning edit. LinkedIn about 860 of 3,000 by hand, and a grep confirms no line in the file reaches 500 characters, so it is far under the limit. Recount in Buffer before scheduling.

Sources
- The paper: the 2016 PoPETs study linked in the README, section "Blur is not redaction" ([PDF](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf)). Title and authors (Hill, Zhou, Saul, Shacham), hidden Markov models, and "across typefaces, font sizes, grid sizes and noise levels" come from the abstract as read by two reviewers and from the README paragraph. The authors' conclusion that pixelation and blur are not viable for redacting text is the same paragraph.
- Unredacter: the [Bishop Fox post](https://bishopfox.com/blog/unredacter-tool-never-pixelation), as read by the reviewers: renders guesses in the same font and size and compares them with the pixelated image, and recommends black bars covering the whole text. README says the same ("rebuild pixelated text by rendering guesses in the same font and comparing them").
- Solid box advice ("cover it with a solid box in another editor or leave it out of the image"): README, same section. "Won't have a solid box in v1": README Backlog, "Solid box for real redaction", listed under "Not in v1".
- App warning: the posts say only that the app will warn that blur and pixelate don't reliably hide text, the gist of the reviewer-approved warning. They don't quote it or say which effects show it, which is a copy choice. The wording is decided (Ícaro approved the pt-BR text) and the app shows the warning with every effect (Q-025).
- "PoPETs" and "2016" come from the paper's URL and the README link. channels.md used "PETS" for the same study; the posts now use the full venue name.

Could not verify
- No reviewer read the body of the PDF. Every statement about the paper is the abstract's or the README's. The posts don't say whether "recognizable" means to a person or to software, give no figure, and don't claim the method works on every blur setting.
- The warning's wording and placement are decided (Ícaro approved the pt-BR text; the app shows it with every effect, Q-025). Recheck the one sentence about the warning in the LinkedIn version, and the "will warn about this" lines, against the shipped text before publishing.

Alternatives (pick one of each)
- LinkedIn hook. A: the current first paragraph (names the paper and its authors, so a reader can look it up). B: "Pixelated text can be rebuilt by rendering guesses in the same font and comparing them with the image. Bishop Fox describes a tool that does it." Reason: leads with the mechanism, shorter, but names no paper until the next paragraph.
- Image headline. A: "Blur is not redaction." (plain, matches the README section title). B: "Pixelated is not hidden." Reason: says what the viewer will see in the picture, but "hidden" is looser than "redaction".
- Closing ask, optional on LinkedIn, none by default (the no-ai-slop rules say to end on the last point). A: "If your team has a rule for screenshots that go into tickets, I'd like to know what it says." Reason: specific, and replies from strangers are the success measure in channels.md. B: "I'm still deciding how loud the warning should be. Tell me if it would stop you." Reason: asks for a decision, but the README doesn't leave that open, so use it only if Ícaro agrees it is.

Not claimed
- Any number from the study, any recommended blur or pixel strength, or any guarantee that a setting is safe.
- That the app has a solid box. It doesn't, and the posts say so.
- "Never uploaded" or any privacy claim. This post is about blur strength, and the README's URL-loading proxy exception would need to sit next to it.
- The app's domain, metrics, or analytics of any kind.
