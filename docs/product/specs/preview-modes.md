# Spec: preview modes (live, before and after, none)

Status: **after v1, first of the two** (D-031, decided by Ícaro, relayed by `-aa`, 2026-11-22). Asked for by him; not in PR #2. **The JavaScript cost is measured before any implementation**: the room under the initial budget is 1.31 kB, and the roughly 1 kB for a before and after divider in this spec is PM's unmeasured estimate.

## Problem

Ícaro asked for a way to see the result in different ways: compare the original with the result, and a mode without preview in which the image is not re-rendered while the controls move, only when the change is applied, which helps on large images.

## What the code does today (PM read it, 2026-11-22; not run)

- Edits are `Action`s (a whole-image effect, a brush stroke, an eraser stroke) in a `History` that moves a pointer. `toOperations` turns the active actions into `Operation`s with masks, and `Renderer.render(operations)` draws them into render textures: `base`, `source`, `mask` and `result`, where `result` is what is on screen and what is exported.
- A whole-image effect is applied by a button (`blurEntireImage` in `src/ui/editor.ts`), and the brush paints as it moves. Moving the effect, intensity or angle controls does not render the whole image today, so a live preview of the settings (the image changing while a slider moves) does not exist yet; the closest thing to "no preview" is how whole-image effects already behave.
- The renderer appends one operation incrementally when it can and re-renders everything otherwise.

## Interpretation to confirm (the questions are in Q-019)

Three modes, chosen by the user and remembered:

1. **Live**: while a slider moves, the whole image shows the effect with those settings, before it is applied.
2. **Before and after**: the original and the current result side by side, as a sliding divider, or "hold to see the original" (a button or a key).
3. **Off**: the controls change nothing on screen until the user applies; for big images where each frame is expensive.

## Requirements if it goes ahead

- The three modes in `en` and `pt-BR` (no inline text), the choice persisted like the language.
- Keyboard and screen reader: the divider is operable with the arrow keys, has a label and a value, and "hold to see the original" has a keyboard equivalent that doesn't need a long press; WCAG 2.2 AA, checked by the axe e2e.
- The export always equals the applied result, never the preview (the existing "preview equals export" promise).
- Cost: a live mode renders once per slider change, so it needs a limit on large images (render at a reduced size while dragging, final size on release; or fall back to Off above a size). PM's estimate, **unmeasured**: a before and after divider is a small component and CSS, around 1 kB brotli; it loads through a dynamic `import()` when the mode is chosen, so the initial JavaScript (1.31 kB of room, D-009) isn't touched. The live mode adds renderer code, not a library, and must be measured before it is approved.

## How to test

Unit: the mode state and its persistence. e2e: each mode on a small image, the divider by keyboard, the export equal in all three modes. Manual: a large image (above 8 megapixels) in Live and in Off, on a phone-sized viewport.

## Open questions

Q-019 was answered (D-031: after v1). Still open for the spec: whether this is v1 or later; whether "before and after" is a divider, a hold, or both; whether Live should exist at all, since today effects apply on a button; the large-image rule.
