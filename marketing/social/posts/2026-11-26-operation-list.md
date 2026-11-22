---
status: draft
channels: linkedin, bluesky, mastodon
image: marketing/social/out/2026-11-26-operation-list-square.png
persona: P1
type: build-in-public update (engineering decision)
---

## linkedin

Paint a blur brush over the same spot twice at intensity 40. What should you get?

If a tool edits the pixels in place, the second pass blurs the output of the first, and the spot ends up past 40. I didn't want that in the blur tool I'm building, so I built it to never edit the source image.

It will keep the original plus an ordered list of operations. Each operation is an effect, its settings and a mask, which is either the whole image or the brush strokes painted with those settings. To render, it runs the list in order, blurring the current result and compositing it through the mask. A stroke made right after another at the same setting joins the same mask, so painting twice at 40 stays at 40. Photoshop's Smart Filters with a filter mask work in a similar way.

Undo gets cheaper too. Undo and redo move a pointer along the edit history, which costs far less memory than storing a full-resolution snapshot after every step.

The list also has to produce the exported file, so the export will render the same operations at full resolution. That's why the blur size is computed in source-image pixels, as a share of the image's shorter side, never in screen pixels. What you see zoomed out has to be what ends up in the file.

## bluesky

Paint a blur brush over the same spot twice at intensity 40 and you should get 40, not 80. I'm building a blur tool that keeps the original and an ordered list of operations. A stroke right after another at the same setting joins its mask, and undo moves a pointer along the edit history.

## mastodon

Painting a blur brush over the same spot twice at intensity 40 should give 40, not 80.

I'm building a blur tool that never edits the original image. It will keep an ordered list of operations, each with an effect, its settings and a mask. A stroke made right after another at the same setting will join the same mask, so the blur won't be applied twice. Undo and redo will move a pointer along the edit history.

#webdev

## image

Headline: Painted twice at 40 stays 40.
Line: Edits are an operation list.
(11 words. Template `tip`, format `square`. No URL, no handle in the footer.)

Visual: left, two brush strokes crossing the same spot, labeled "40" and "40". Right, one box, "result: 40" (not 80). Plain boxes and arrows in the brand style, no app screenshots before deploy (a diagram explains this better).

Alt text (Bluesky, Mastodon; adjust to the render): Diagram of two overlapping brush strokes, each labeled intensity 40, resulting in one blur labeled intensity 40.

## notes (not for publishing)

Counts: Bluesky about 288 of 300 (tight; recount in Buffer and cut "right" or "the" if it goes over). Mastodon about 450 of 500 with the one hashtag. LinkedIn about 1,450 of 3,000. Counted by hand after the review edits, so recount.

Sources
- Original plus ordered list, operation = effect + parameters + mask ("whole image" or the brush strokes painted with that setting), render in order, undo and redo move a pointer, memory versus snapshots, "painting over the same spot twice with intensity 40 gives intensity 40, not 80": README, "How it works", paragraph "Operations, not pixels".
- Strokes share a mask only when consecutive: `src/engine/history.ts` lines 25-45, `toOperations` merges a brush stroke into the previous operation only when that operation is a brush effect with the same settings (`sameSettings`). Any other action in between starts a new operation. The README paragraph states the result for the simple case ("40, not 80") and doesn't mention the condition.
- Undo and redo move a pointer over the edit history (the `History` class, `history.ts` lines 65-101); the operation list is rebuilt from the active actions by `toOperations`. The README says "in that list", which the code doesn't match exactly, so the post says "edit history".
- Photoshop comparison: README "Operations, not pixels" follow-on paragraph says "the same model Photoshop uses for a Smart Filter with a layer mask". The post softens it to "work in a similar way" and uses Adobe's term "filter mask" for the Smart Filter mask, which is not the README's wording. The README gives no link.
- Blur size: `src/engine/intensity.ts`, `scaledLength` returns a length in source-image pixels proportional to the image's shorter side, from an intensity of 1 to 100. Preview matches export: README "Preview equals export" (the README says "intensity is defined in source-image pixels"; the code is more exact, so the post follows the code).
- Export renders the same list at full resolution, "What you see zoomed out is what you get in the file": README, "How it works", paragraph "Preview equals export".

Could not verify
- "If a tool edits the pixels in place, the second pass blurs the output of the first" is my reasoning from the README's "keeps brush strokes from compounding". The README doesn't state it. I worded it as a conditional and didn't name any editor.
- The README names no downside of the operation list. channels.md asks for the trade-off to be spelled out on LinkedIn. I wrote the one consequence the README states (export must re-render the list, so the blur size is in source pixels) and did not invent a cost. If Ícaro has a real one (for example, render time on many operations), add it.
- Photoshop comparison is the README's own claim, softened. Remove it if you want every line to link to a source.
- Hashtag #WebGL dropped (the post doesn't mention WebGL and the notes exclude GPU topics). Only #webdev is left on Mastodon.

Alternatives (pick one of each)
- LinkedIn hook. A: the current question. B: "Painting twice at intensity 40 should give 40, not 80. Here is the data model that makes that true in the blur tool I'm building." Reason: states the answer first, for readers who skim.
- Image headline. A: "Painted twice at 40 stays 40." B: "Undo is a pointer, not a snapshot." Reason: B is the more surprising engineering detail, A is easier to grasp without context.
- Closing ask, optional, none by default. A: "If you've built an editor with undo, I'd like to know whether you went with snapshots or a list." Reason: invites peers, which matches the audience for this post. B: "Questions about the model are welcome." Reason: lower pressure, but weaker.

Not claimed
- Anything about the GPU shaders, PixiJS or speed. The README describes them but they aren't what this post is about.
