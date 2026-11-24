# Editor layout direction (BMI-098)

The layout Dev UI builds for BMI-098: where every control of the editor goes once an image is open, which icon it uses, and how it behaves on a phone, a tablet and a desktop. It follows Ícaro's reference (the editor of his mockup, D-043, and his picture of 2026-11-24 05:26Z): a left rail of rounded tool cards with an outline icon and a short label, the image in the middle, icon-only undo and redo under the image, and a right panel with the intensity card and the full-width Download button.

Nothing of the app is dropped, merged or hidden. The checklist at the end lists every control and where it went.

## Files

| Path | What it is |
| --- | --- |
| `icons/*.svg` | The 23 editor icons, one file each, drawn for this kit (no icon library) |
| `icons/contact-sheet.png` | Every icon at 48, 24 and 20 px on the light and dark surfaces |
| `editor-proposal.html` | Static, responsive mock of this layout (not app code), with the app's colors and the kit's spacing tokens |
| `scripts/build-icon-sheet.mjs` | Rewrites `icons/contact-sheet.png` |
| `scripts/render-editor-proposal.mjs` | Renders the mock at 390, 820 and 1366 px wide, light and dark, into a folder you pass |

Regenerate: `node brand/scripts/build-icon-sheet.mjs` and `node brand/scripts/render-editor-proposal.mjs .local/home-review/<date>`. Both need Playwright (already a dev dependency).

The renders set Liberation Sans in place of `system-ui`, because on the Linux machine that renders them `system-ui` is DejaVu Sans, much wider than Segoe UI or San Francisco. The app keeps `--font-ui`. The demo image is an illustration drawn by the mock (a lake and a boat whose painted name is covered). Its pixelate and motion effects are drawn by the mock, not by the app's renderer.

## Icons

Style, from Ícaro's reference picture (outline icons on rounded cards): 24 px grid, 1.5 px stroke, round caps and joins, no fill except where the fill is the meaning (intensity, pixelate, the entire-image area, the preview half), `currentColor` only. Pixelate echoes the logo's mark: blocks of one color at several opacities.

The home (`home-direction.md`) draws its marketing sections with pixel glyphs and square blocks. Those are the home's identity accents (dividers, stepper, effect demos, the dark blocks), not a rule for the editor, which follows Ícaro's reference. Question 6.

Shown at 20 or 22 px in the app; 18 px in the panel's field headings; 16 px next to the warning. Always `aria-hidden="true"`: the button or label around the icon carries the name.

| File | Used for |
| --- | --- |
| `tool-brush.svg` | Brush card |
| `tool-eraser.svg` | Eraser card |
| `blur-entire.svg` | Entire image card (Blur entire image) |
| `effect-gaussian.svg` | Gaussian card |
| `effect-pixelate.svg` | Pixelate card |
| `effect-motion.svg` | Motion card |
| `undo.svg`, `redo.svg` | Undo and redo under the image |
| `intensity.svg` | Intensity heading |
| `angle.svg` | Angle heading (Motion only) |
| `brush-size.svg` | Brush size heading |
| `warning.svg` | The redaction warning |
| `format.svg` | Format heading |
| `download.svg` | Download button |
| `open-image.svg` | Open another image button |
| `link.svg` | Inside the image link field |
| `load.svg` | Load button of the link field |
| `theme-light.svg`, `theme-dark.svg`, `theme-system.svg` | Theme button (light or dark state) and, optionally, beside the three menu items |
| `language.svg` | Language select |
| `chevron-down.svg` | Closed selects (Language, Format) |
| `preview-split.svg` | Reserved for the preview toggle of BMI-127. Not used in v1 |

There is no zoom icon: zoom is BMI-129, after v1 (D-043). The GitHub link in the header uses GitHub's own mark, copied unchanged from `@primer/octicons` 19.42.0, `build/svg/mark-github-16.svg` (MIT), rather than redrawn. It is not part of this set and has no file in `icons/`; the path lives in `scripts/render-editor-proposal.mjs` for the mock, and Dev UI copies it from the same file of the same version.

The project's frontend rules usually prefer an icon library to hand-drawn SVG. This set is drawn by hand because BMI-098 asked for icons in the brand's own style without a library, and the app has no icon dependency.

## Layout

Three zones, in this reading and keyboard order: the **rail** (choose how and what to apply), the **stage** (the image and the bar under it), the **panel** (settings, then export, then opening another image). The header above them is BMI-097's (logo, theme, language, GitHub).

### Desktop, 1100 px and wider (render: `editor-proposal-1366-*.png`)

| Zone | Width | Content, top to bottom |
| --- | --- | --- |
| Header | full, 64 px tall | Horizontal logo (black on light, white on dark), then on the right: theme button, language select, GitHub link |
| Rail | 96 px, surface color, hairline on the right | Caption "Apply", cards Brush, Eraser, Entire image; hairline; caption "Effect", cards Gaussian, Pixelate, Motion |
| Stage | the rest, background color | Messages (error, large-image notice) above the image; the image, rounded 12 px; the bar under the image |
| Panel | 320 px, surface color, hairline on the left | Settings card (Intensity, Angle when Motion is on, the warning); Brush size card; hairline; Format row, Download button, export hint; hairline; Open another image button, link field with Load, link notice |

The image is fitted to the stage and the viewport height, as today. At 1366 by 768 with Pixelate or Gaussian the panel fits the screen; with Motion (one more slider) its last block, opening another image, ends about 20 px (English) to 40 px (pt-BR) below the fold. Build the panel with `overflow-y: auto` inside the viewport height so Download stays above the fold and the panel scrolls on its own.

### Tablet, 720 to 1099 px (render: `editor-proposal-820-*.png`)

- Header as on desktop.
- Rail on the left, 88 px wide, same cards.
- Stage to its right; the bar under the image.
- The panel moves under the image, in two columns: left, the Settings card and the Brush size card; right, the Export card (Format, Download, hint) and the Open card. Each sits in its own card because the panel has no surface of its own here.
- Every target is 44 px (tablets are touch screens).

### Phone, below 720 px (render: `editor-proposal-390-*.png`)

- Header 56 px: logo (17 px tall, about 144 px wide, above the 120 px minimum of `README.md`), theme button, language select, GitHub link, each 44 by 44 px. The language select shows only the globe while closed; it stays a native `<select>` with its visible label hidden and its accessible name "Language", so the open list still shows every language by name.
- The rail becomes two rows of three cards **above** the image, so the keyboard order (rail, image, panel) stays the reading order: row "Apply" (Brush, Eraser, Entire image), row "Effect" (Gaussian, Pixelate, Motion). The caption sits on the left of each row. Cards are 56 px tall and about 93 px wide.
- The image, full width (358 px at 390), then the bar under it.
- The panel stacks: Settings, Brush size, Export, Open.
- Every target is at least 44 px; Download is 52 px tall.

Below 720 px the rail sits above the image instead of under it because the order of the DOM can't change between layouts without duplicating controls, and keyboard and screen reader order has to follow what the eye sees (WCAG 2.4.3).

## Every control

Labels are the existing locale keys unless marked **new**. "Icon only" controls always have an accessible name and a tooltip on hover and on keyboard focus.

| Control | Where | Shows | Accessible name | Tooltip | Keys |
| --- | --- | --- | --- | --- | --- |
| Brush | Rail, Apply | Icon + label `toolbar.brush`, key letter B in the corner | `toolbar.brush` | `toolbar.brushTitle` ("Brush (B)") | `aria-keyshortcuts="B"` |
| Eraser | Rail, Apply | Icon + label `toolbar.eraser`, key letter E | `toolbar.eraser` | `toolbar.eraserTitle` | `E` |
| Blur entire image | Rail, Apply | Icon + label **`toolbar.blurEntireShort`**: "Entire image" / "Imagem inteira" | `toolbar.blurEntire` ("Blur entire image"), which contains the visible label (WCAG 2.5.3) | `toolbar.blurEntire` | |
| Effect: Gaussian, Pixelate, Motion | Rail, Effect, a radio group | Icon + label `effects.<id>.label` | the label; group named by `toolbar.effect`, described by the warning | none needed | arrow keys inside the group |
| Intensity | Panel, Settings card | Icon, label `toolbar.intensity`, value, slider | `toolbar.intensity` | | |
| Angle | Panel, Settings card, under Intensity, only with Motion | Icon, label `toolbar.angle`, value `toolbar.angleValue`, slider | `toolbar.angle` | | |
| Redaction warning | Panel, Settings card, always visible with every effect (D-034) | Warning icon + `effects.warning` | | | |
| Brush size | Panel, its own card | Icon, label `toolbar.brushSize`, value `toolbar.brushSizeValue`, slider | `toolbar.brushSize` | `toolbar.brushSizeTitle` | `[` and `]` (canvas focus) |
| Undo | Bar under the image, left | Icon only | `toolbar.undo` | `toolbar.undoTitle` ("Undo (Ctrl+Z)") | `Ctrl/Cmd+Z` |
| Redo | Bar under the image, after Undo | Icon only | `toolbar.redo` | `toolbar.redoTitle` | `Ctrl/Cmd+Shift+Z` |
| Format | Panel, Export | Icon, label `export.format`, a compact select (PNG, JPG, JPEG, WebP) | `export.format` (now visible, not visually hidden) | | |
| Download | Panel, Export, full width, accent color | Download icon + `export.download` | `export.download` | | |
| Export hint | Under Download | `export.hint` | | | |
| Open another image | Panel, Open, full width, secondary style | Icon + `input.chooseAnother` | `input.chooseAnother` | | |
| Image link field | Panel, Open | Link icon inside the field, placeholder `input.urlPlaceholder` | `input.urlLabel` | | |
| Load | Right of the link field | Icon only (arrow) | `input.load`; while loading, `input.loading` and a spinner in place of the arrow | `input.load` | Enter in the field |
| Link notice | Under the link field | `input.linkNotice` | | | |
| Theme | Header | Sun or moon icon (as today), menu of `theme.light`, `theme.dark`, `theme.system` | `theme.label` | `theme.label` | as today |
| Language | Header | Globe + language name + chevron; globe only on phones | `language.label` | `language.label` on phones | |
| GitHub | Header | GitHub mark, icon only | **`app.github`**: "Blur My Image on GitHub" | `app.github` | |
| Image (canvas) | Stage | the image, brush cursor ring | `canvas.label` | | `B`, `E`, `[`, `]` while focused |
| Error and large-image notice | Stage, above the image, full stage width | as today (`role="alert"`, `role="status"`) | | | |
| Drop overlay | Whole page | as today | | | |
| Ctrl/Cmd+V paste, drop anywhere | Page | unchanged | | | |

The legends "Apply" and "Effect" stay, as the rail's small group captions (`toolbar.apply`, `toolbar.effect`). The legend "Export" (`export.legend`) names the Export block for assistive technology (a `<section aria-labelledby>` or a visually hidden heading); it isn't shown, since the Download button says it.

### New locale keys

| Key | en | pt-BR |
| --- | --- | --- |
| `toolbar.blurEntireShort` | Entire image | Imagem inteira |
| `app.github` | Blur My Image on GitHub | Blur My Image no GitHub |

Those are the only new strings. Every other label, tooltip and name already exists in `src/i18n/messages/en.json` and `pt-BR.json`. The pt-BR renders (`editor-proposal-*-ptbr.png`, from `.local/home-review/2026-11-24/tools/ptbr-check.mjs`) show every pt-BR label fitting at 390, 820 and 1366 px; "Imagem inteira" and, on desktop, "Movimento" are the longest card labels.

## States

- **Selected card** (the current tool and the current effect, one of each): background `color-mix(accent 11%, surface)` on light and 14% on dark, a 1.5 px accent border, accent icon and label, label bold. The border carries the state beyond color. Brush or Eraser use `aria-pressed`, the effects `role="radio"` with `aria-checked` (or the native radio inputs of today, visually hidden).
- **Entire image** is an action: it has hover and focus states and never stays selected.
- **Hover** on cards and icon buttons: the background color of the page (`--bg`).
- **Keyboard focus**: the app's 2 px accent outline, offset 2 px, on every control, and the tooltip of an icon-only control opens with it.
- **Disabled** undo or redo (nothing to undo or redo): muted icon at 55% opacity, `disabled`, no tooltip. Shown in the light renders (redo).
- **Tooltip**: dark bubble on light (`#0f1115`, text `#f2f3f5`), light bubble on dark, 12.5 px, 8 px above the control with a small arrow; it appears after a short delay on hover and immediately on focus; Escape closes it (WCAG 1.4.13). Native `title` alone does not count: it doesn't show on focus.
- **Sliders**: native `<input type="range">` with `accent-color: var(--accent)`, as today. The mock draws them by hand only to render them the same on every machine.

## Reserved places (render: `editor-proposal-*-light-reserved.png`)

The bar under the image is a three-column grid: undo and redo on the left, then two empty places.

- **Center: the preview toggle of BMI-127** (after v1, D-031, D-043), 168 px wide on desktop and tablet, 44 px on phones, where its `preview-split` icon goes. In preview mode Ícaro wants the image cut in half, before and after, with the intensity and the Download above the two halves; the stage already has the full width for the two halves, and the panel can move above them then.
- **Right: zoom, BMI-129** (after v1, D-043), 132 px wide, 44 px on phones.

In v1 both places are empty space with no control, no disabled button and no "coming soon" (BMI-098's criterion). The dashed outlines exist only in the annotated renders.

## Contrast (WCAG 2.2 AA)

Computed with the WCAG relative luminance, rounded down; every pair passes.

| Theme | Pair | Background | Ratio |
| --- | --- | --- | --- |
| light | selected label and icon `#0d62b8` | selected tint `#e4eef7` | 5.17:1 |
| light | selected card border `#0d62b8` | surface `#ffffff` | 6.07:1 |
| light | card label `#0f1115` | surface | 18.89:1 |
| light | captions, key letters, hints `#454c5c` | surface | 8.60:1 |
| light | warning `#7a4b00` | surface | 7.41:1 |
| light | control borders `#454c5c` | surface | 8.60:1 |
| light | Download label `#ffffff` | `#0d62b8` | 6.07:1 |
| light | tooltip `#f2f3f5` | `#0f1115` | 17.01:1 |
| light | focus ring `#0d62b8` | stage `#eceef2` | 5.23:1 |
| dark | selected label and icon `#7cc4ff` | selected tint `#263340` | 6.86:1 |
| dark | selected card border `#7cc4ff` | surface `#181b21` | 9.19:1 |
| dark | card label `#f2f3f5` | surface | 15.53:1 |
| dark | captions, key letters, hints `#9aa1ad` | surface | 6.63:1 |
| dark | warning `#f2c470` | surface | 10.59:1 |
| dark | control borders `#9aa1ad` | surface | 6.63:1 |
| dark | Download label `#0f1115` | `#7cc4ff` | 10.07:1 |
| dark | tooltip `#0f1115` | `#f2f3f5` | 17.01:1 |
| dark | focus ring `#7cc4ff` | stage `#0f1115` | 10.07:1 |

Form controls (selects, the link field, Open another image, the undo and redo group) use the strong border (`--border-strong`), so their edges pass 3:1. The hairlines between zones and around cards are decoration.

## Spacing and type

The kit's tokens in `tokens.css` (`--space-1` to `--space-5`, `--gutter`, `--step--1`, `--font-ui`), the same scale as the home. Fixed sizes that are part of the controls: header 64 px (56 on phones), rail cards 72 px tall (56 on phones), icon buttons 40 px on desktop and 44 px on touch, Download 48 px (52 on phones), card labels 12 px (11.5 on phones), captions 10.5 px uppercase. Radii: 8 px controls, 10 px cards and buttons, 12 px panels and the image, as in Ícaro's reference (question 6).

## Notes for Dev UI

- The icons go inline in the Vue templates (or in one small component that maps a name to its SVG), with no new package. The initial JS had 0.17 kB left after BMI-144 (BMI-098's budget criterion); the 22 icons used in v1 are 7.5 kB of SVG as files and about 1.1 kB gzipped (less once the shared attributes sit on one wrapper), so they will likely need the editor's lazy chunk. If it doesn't fit, the budget goes to Ícaro with the numbers (Q-029); no icon or control is dropped to fit.
- The theme listener: if the header isn't mounted everywhere, see BMI-098's criterion about `theme.ts`.
- The README's account of the controls changes where a control moved: the effects are now in the side rail next to the tools, Download and the format are in the right panel, undo and redo under the image.

## Questions for Ícaro

None of these is a cut; each has a default that applies if he doesn't answer.

1. **Effects in the rail.** His reference shows Pixelate and Blur in the rail next to Brush and Eraser, and D-043 allowed the effects in the panel. This proposal puts all three effects in the rail, under a small "Effect" caption, so the rail matches the picture and the panel keeps only the settings and the Download. Default: rail.
2. **Rail captions "Apply" and "Effect".** Two small words that explain why two cards are selected at once (one tool, one effect). Default: keep them.
3. **GitHub link in the header.** It is in his reference and isn't in the app today; it links to the repository the home already links to. Default: add it with BMI-097's header.
4. **Language as a globe on phones.** The closed select shows only the globe below 720 px so the header fits; the open list still names every language. Default: globe.
5. **Visible labels in the panel.** BMI-098's criterion asks for icons instead of words for the options. The rail and the bar under the image follow it (short labels on the cards, undo and redo icon only), but the panel keeps visible text next to its icons on Intensity, Brush size, Format, Download and Open another image. His reference shows "Blur intensity" and "Download" as text, and a slider needs a visible label to say what it changes. Default: keep the visible labels.
6. **Editor style against home style.** The editor uses outline icons and rounded cards (10 px cards, 12 px panels and image) because his reference for it (`.local/home-review/2026-11-24/icaro-editor-ref-0526.png`) does. The home (`home-direction.md`) draws its marketing sections with pixel glyphs and square blocks, and the home turns into the editor on the same page. Default: the editor and the drop zone follow his reference, and the home's glyphs and square blocks stay identity accents of the marketing sections (dividers, stepper, effect demos, the dark blocks). The other way would be pixel glyphs and square cards in the editor too.
