# Spec: an editable effect stack

Status: **after v1, after the preview modes** (D-031, decided by Ícaro, relayed by `-aa`, 2026-11-22). Asked for by him as "duplicate before the effect", unlimited undo, and overlapping images and effects. Not in PR #2. What "overlapping images" means is a future question (Q-020) and has its own spec.

## Problem

Ícaro wants to go back as far as he likes and to layer effects. The idea of copying the pixels before every effect doesn't scale in memory: each snapshot of a large image is the size of the image in RGBA, and real editors cap the history (the Telerik image editor, per `-aa`'s research, caps it at 512 MB by default).

## What the code already is (PM read it; not run)

The README decided "operations, not pixels: original image plus an ordered list of operations, undo as a pointer". `History` holds `Action`s and a pointer; `toOperations` makes `Operation`s (`effect` with settings and a mask that is `"whole"` or a list of strokes, or `restore` with strokes); the `Renderer` replays them into render textures and appends incrementally when it can. So **unlimited undo already exists as far as memory goes**: the list is small (settings and stroke points), the original is kept once, and nothing is deleted until a new action replaces the redo tail.

## What is new

The stack as something the user edits, as in the smart filters of Photoshop: each effect is an item with parameters that can still be changed, its own mask (the brush already makes masks), a switch to turn it off and on, a position that can be changed, deletion, and "duplicate this effect or step".

## Proposed model (to discuss, not to build yet)

- **Layer item**: `{ id, kind: "effect" | "restore", settings, mask, enabled, opacity }`; `mask` is `"whole"` or strokes in source-image pixels, as today.
- **The stack** is an ordered list of items; the current `History` becomes a record of changes to the stack (add, edit, reorder, toggle, delete, duplicate), and undo keeps moving a pointer over those changes.
- **Rendering**: the renderer replays the enabled items in order. **Checkpoints**: it keeps the rendered result after some items (for example every few items) as render textures to avoid replaying from the start; a memory ceiling drops the oldest checkpoints, and a drop only slows the next edit, never loses an edit. The checkpoint interval is PM's suggestion; no source found.
- **Overlapping images** (a second image over the first) is a larger idea than effects: a second source texture, a transform and a blend. It is **out of this spec** and would be its own spec.

## Cost and limits

GPU memory is the limit: the renderer already keeps four textures at the image's size, and every checkpoint adds one. On a phone the large-image rule (`MAX_TEXTURE_SIZE` and the downscale) stays, and the checkpoint count must scale down with the image size. Editing an old item invalidates the checkpoints after it, so the cost of an edit grows with how early it is. Measure before choosing the interval.

## Requirements if it goes ahead

An item list that is keyboard operable and labelled; reordering by keyboard; `en` and `pt-BR`; the export equals the applied stack; undo and redo still work across stack edits; the 100 megapixel and phone memory cases don't crash (the checkpoint ceiling).

## Open questions

Q-019 was answered (D-031: after v1). Still open for the spec: v1 or later; whether "unlimited undo" is satisfied by what exists, which already has no cap; whether editing an effect after the fact is what he wants (the new part); whether overlapping images should be a separate idea.
