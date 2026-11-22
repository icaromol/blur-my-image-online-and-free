---
status: draft
channels: linkedin, bluesky, mastodon
image: marketing/social/out/2026-11-26-operation-list-square.png
persona: P1
type: build-in-public update (engineering decision)
---

## linkedin

Paint a blur brush over the same spot twice at intensity 40. What should you get?

If a tool edits the pixels in place, the second pass blurs the output of the first, and the spot ends up past 40. I didn't want that in the blur tool I'm building, so the plan is that it never edits the source image.

It will keep the original plus an ordered list of operations. Each operation is an effect, its settings and a mask, which is either the whole image or the brush strokes painted with those settings. To render, it runs the list in order, blurring the current result and compositing it through the mask. A second stroke at the same setting adds to the mask, so painting twice at 40 stays at 40.

Undo gets cheaper too. Undo and redo move a pointer along the list, which costs far less memory than storing a full-resolution snapshot after every step. Photoshop uses the same model for a Smart Filter with a layer mask.

The list also has to produce the exported file, so the export will render the same operations at full resolution. That's why intensity is defined in source-image pixels and never screen pixels. What you see zoomed out has to be what ends up in the file.

## bluesky

Paint a blur brush over the same spot twice at intensity 40 and you should get 40, not 80. I'm building a blur tool so that edits are an ordered list of operations on an untouched original. A second stroke at the same setting will add to a mask, and undo will move a pointer.

## mastodon

Painting a blur brush over the same spot twice at intensity 40 should give 40, not 80.

I'm building a blur tool that never edits the original image. It will keep an ordered list of operations, each with an effect, its settings and a mask. A second stroke at the same setting will add to the mask, so the blur won't be applied twice. Undo and redo will move a pointer along the list.

#webdev #WebGL

## image

Headline: Painted twice at 40 stays 40.
Line: Edits are an operation list.
(11 words. Template `tip`, format `square`. No URL, no handle in the footer.)

Visual: left, two brush strokes crossing the same spot, labeled "40" and "40". Right, one box, "result: 40" (not 80). Plain boxes and arrows in the brand style, no screenshots of an app that doesn't exist yet.

Alt text (Bluesky, Mastodon; adjust to the render): Diagram of two overlapping brush strokes, each labeled intensity 40, resulting in one blur labeled intensity 40.

## notes (not for publishing)

Counts: Bluesky about 281 of 300 (tight; recount in Buffer and cut "untouched" if it goes over). Mastodon about 400 of 500. LinkedIn about 1,350 of 3,000. Counted by hand.

Sources
- Original plus ordered list, operation = effect + parameters + mask ("whole image" or the brush strokes painted with that setting), render in order, undo and redo move a pointer, memory versus snapshots, "painting over the same spot twice with intensity 40 gives intensity 40, not 80": README, "How it works", paragraph "Operations, not pixels".
- Photoshop Smart Filter with a layer mask: the same README paragraph. The README gives no link for it.
- Export renders the same list at full resolution, intensity in source-image pixels, "What you see zoomed out is what you get in the file": README, "How it works", paragraph "Preview equals export".

Could not verify
- "If a tool edits the pixels in place, the second pass blurs the output of the first" is my reasoning from the README's "keeps brush strokes from compounding". The README doesn't state it. I worded it as a conditional and didn't name any editor.
- The README names no downside of the operation list. channels.md asks for the trade-off to be spelled out on LinkedIn. I wrote the one consequence the README states (export must re-render the list, so intensity is in source pixels) and did not invent a cost. If Ícaro has a real one (for example, render time on many operations), add it.
- Photoshop comparison is the README's own claim. Remove it if you want every line to link to a source.

Alternatives (pick one of each)
- LinkedIn hook. A: the current question. B: "Painting twice at intensity 40 should give 40, not 80. Here is the data model that makes that true in the blur tool I'm building." Reason: states the answer first, for readers who skim.
- Image headline. A: "Painted twice at 40 stays 40." B: "Undo is a pointer, not a snapshot." Reason: B is the more surprising engineering detail, A is easier to grasp without context.
- Closing ask, optional, none by default. A: "If you've built an editor with undo, I'd like to know whether you went with snapshots or a list." Reason: invites peers, which matches the audience for this post. B: "Questions about the model are welcome." Reason: lower pressure, but weaker.

Not claimed
- Anything about the GPU shaders, PixiJS or speed. The README describes them but they aren't what this post is about.
