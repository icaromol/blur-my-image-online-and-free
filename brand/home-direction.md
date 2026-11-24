# Home page: design direction

For BMI-097 (PR #27). Keeps the palette in `tokens.css`, the system font stack and the logo. Changes the spacing, the layout of every section and the visual identity. The copy is the approved copy in `docs/marketing/landing/home.md`, word for word.

Renders of this direction (390, 820 and 1366 px wide, light, plus the first screen in dark) and the static prototype they come from are in `.local/home-review/2026-11-24/`: `proposal-*.png`, `proposal/index.html`, `proposal/landing.css`. The prototype's CSS is written to be ported to `src/ui/landing.css`.

**Design read:** a single-page utility whose first screen is the tool, for people who hide data in work screenshots (P1), in a precise, monochrome, pixel-grid language taken from the mark. No images except the three effect demos, no web font, no JavaScript.

## 1. What reads as generic in the current home

Each item is what the page does now and what replaces it.

| # | Now | Why it reads as a template | Replacement |
| --- | --- | --- | --- |
| 1 | Outline icons at 28 px (lock, bolt, picture, shield with check, code brackets, keyboard, chat bubble), 1.5 px stroke, round caps, one per feature card and section | The same stock subjects in the same spot as every generated landing page; on the marketing sections nothing ties them to this product. The tell is the stock feature-card row, not outline icons as such: the editor keeps outline icons (below) | On the home's marketing sections: pixel glyphs drawn on the mark's grid (7 x 7 or smaller), solid blocks, some with the mark's fade on the left edge. Section 3.2. The editor (BMI-098) follows Ícaro's reference and keeps outline icons and rounded cards (`editor-direction.md`); the glyphs are an identity accent of the home, not a ban on that style. Question 6 |
| 2 | Logo, H1, paragraph and the app all centered in a 760 px column; at 1366 px the right third of the screen is empty | Centered stack hero is the default output; it wastes the width P1 has on a desktop | Split first screen from 1024 px: logo, H1 and lede on the left (6 of 12 columns), the drop zone on the right (6 columns). One left-aligned column below 1024 |
| 3 | Dashed border drop zone with bold text in the middle | The default file-upload widget | Solid 1 px border on a faint checkerboard (the transparency grid of image editors), "Choose an image" drawn as the page's one filled button |
| 4 | Every section is the same `h2` plus grey paragraph stack, 46 rem wide, left-aligned in a 1100 px box | One layout repeated eight times; nothing tells the reader which part matters | Each section gets its own layout family: bento, track, index rows, gallery, text plus side panel, full-bleed band, rail plus accordion. Section 4 |
| 5 | Four equal cards in a row: icon, title, two lines | The "four features" row | Bento: "Private by design" is the large dark cell, the product's main promise; the other three are surface cells of different sizes |
| 6 | Stepper with numbered blue circles and "›" between cards | Numbered-circle steppers are a UI-kit default | One bordered track split in three; each step marked by a tally of 1, 2 and 3 blocks in the mark's ramp (light to solid); pixel chevrons on the dividers. The long text of each step sits in the same column under it on desktop |
| 7 | Plain bordered table for the three effects | A data table where the reader needs to see what the effect does | Three figures: the same sample image with one brush stroke of each effect, and the table's two columns as labeled lines under each |
| 8 | Eight FAQ questions as `h3` plus paragraph, all open | Long undifferentiated block at the end | Native `<details>`, heading in a sticky left rail on desktop, a pixel plus that loses its vertical stroke when open. The text stays in the HTML |
| 9 | 1 px rule between the editor and the copy, and no separation between sections | Generic divider | Section divider: four blocks of the mark's ramp, then a hairline (CSS gradients, no markup) |
| 10 | Blockquote with a thin blue left border | Default Markdown styling | The exception callout: the mark's bar as its left edge, with its blocks fading out before it |
| 11 | "Blur is not redaction", the warning that matters most, looks like every other section | Equal weight for unequal content | The one dark band on the page, with a graphic of pixelated lines next to the same lines as solid boxes, which is the advice in the text |
| 12 | Side padding fixed at 16 px, gaps fixed at 12, 32 and 48 px | Same density on a 360 px phone and a 1920 px screen; cramped on phones, loose and narrow on desktop | Fluid spacing scale and page gutter (section 2) |
| 13 | H1 at 1.25 to 1.75 rem, smaller than the logo; `h2` 1.4 rem everywhere | Flat hierarchy | Fluid type scale; H1 32 to 56 px; section headings 24 to 40 px |
| 14 | Language and theme controls float at the top right, unrelated to the content | Leftover position | Same controls, aligned to the page gutter; below 1024 px they get their own row above the logo, so they never cover it |
| 15 | Closing line as a bold paragraph | Ends the page on a footnote | Large statement with keycaps for Ctrl+V and Cmd+V, next to the mark |
| 16 | The mark narrower than the original (square 40 px blocks against 44 x 39.6), the middle columns too dark and the block next to the bar grey instead of solid | The logo looked "close but off" | Rebuilt from the raw PNGs with `measure-mark.mjs`. Comparison: `.local/home-review/2026-11-24/logo-compare.png` |

## 2. Spacing, type and widths

All values grow linearly from 360 to 1920 px wide and stop at both ends. The tokens are in `tokens.css` and `tokens.json`; the CSS column is what `tokens.css` holds. Values in px, rounded to one decimal.

### Spacing

| Token | 360 | 390 | 768 | 1024 | 1366 | 1920 | Use |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `--space-1` | 4 | 4 | 4 | 4 | 4 | 4 | Gaps inside a label or a list of labels |
| `--space-2` | 8 | 8 | 8 | 8 | 8 | 8 | Input and button groups, paragraph spacing inside a cell |
| `--space-3` | 12 | 12.1 | 13 | 13.7 | 14.6 | 16 | Gaps between cells, between a heading and its text |
| `--space-4` | 16 | 16.2 | 18.1 | 19.4 | 21.2 | 24 | Between blocks of a section, summary padding |
| `--space-5` | 24 | 24.3 | 28.2 | 30.8 | 34.3 | 40 | Cell padding, grid column gap, below a section heading |
| `--space-6` | 32 | 32.6 | 40.4 | 45.6 | 52.6 | 64 | Between a heading block and its content, inside the hero |
| `--space-7` | 48 | 49.2 | 64.7 | 75.2 | 89.3 | 112 | Between sections, band padding |
| `--space-8` | 64 | 65.8 | 89.1 | 104.9 | 125.9 | 160 | Bottom of the page |
| `--gutter` | 20 | 20.8 | 31.5 | 38.7 | 48.4 | 64 | Left and right page margin |

CSS: `--space-3: clamp(0.75rem, 0.6923rem + 0.256vw, 1rem)`, `--space-4: clamp(1rem, 0.8846rem + 0.513vw, 1.5rem)`, `--space-5: clamp(1.5rem, 1.2692rem + 1.026vw, 2.5rem)`, `--space-6: clamp(2rem, 1.5385rem + 2.051vw, 4rem)`, `--space-7: clamp(3rem, 2.0769rem + 4.103vw, 7rem)`, `--space-8: clamp(4rem, 2.6154rem + 6.154vw, 10rem)`, `--gutter: clamp(1.25rem, 0.6154rem + 2.821vw, 4rem)`.

### Widths

- `--page-max: 75rem` (1200 px). Content box: `width: min(100% - 2 * var(--gutter), var(--page-max))`, centered. At 1366 px the box is 1200 px with 83 px each side; at 390 px it is 348 px.
- `--measure: 66ch` for running text (the long steps on tablet and phone, the privacy text, FAQ answers).
- Grid: 12 columns from 1024 px, column gap `--space-5`. Tablet (768 to 1023) uses 2 or 3 columns per section; phone is one column.
- Breakpoints: `48rem` (768) and `64rem` (1024). Nothing else.

### Type

Font: `--font-ui` (system-ui stack, the current font) and `--font-ui-mono` for keycaps, code and the small labels in the effects. No web font.

| Token | 360 | 390 | 768 | 1024 | 1366 | 1920 | Use | Line height |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `--step--1` | 14 | 14 | 14.3 | 14.4 | 14.6 | 15 | Notes, hints, labels | 1.6 |
| `--step-0` | 16 | 16 | 16.5 | 16.9 | 17.3 | 18 | Body | 1.6 |
| `--step-1` | 18 | 18.1 | 19 | 19.7 | 20.6 | 22 | `h3`, lede, callout | 1.15 (headings), 1.5 (text) |
| `--step-2` | 24 | 24.3 | 28.2 | 30.8 | 34.3 | 40 | `h2`, step verbs, closing line | 1.1 |
| `--step-3` | 32 | 32.5 | 38.3 | 42.2 | 47.5 | 56 | H1, the band heading | 1.06 |

Headings are bold (700), letter spacing -0.015em (`h3`), -0.025em (`h2`), -0.03em (H1). `text-wrap: balance` on headings and `pretty` on paragraphs. The H1 is capped at 17ch, so it breaks as "Blur or pixelate / part of an image, / in your browser" at every width from 390 px up.

### Shape

Two zones, two rules. **The home's identity blocks** (the bento cells, the step track, the effect figures, the "Blur is not redaction" band and the "Check it yourself" panel) are square, like the mark's blocks; they are accents of the marketing sections. **The app** (the drop zone, which becomes the editor on the same page, and the editor itself) follows Ícaro's reference: rounded cards and panels, 10 px for cards and 12 px for panels, the drop zone and the image, as in `editor-direction.md`. The renders in `.local/home-review/2026-11-24/` still draw the drop zone square; the port uses 12 px. On both, things you press (buttons, inputs, selects, keycaps) keep the app's `--radius` of 8 px (4 px for keycaps and inline code). No shadows. Question 6.

## 3. Identity devices

Everything below comes from the mark: grey blocks of the logo color at rising opacity that end in a solid bar.

### 3.1 The ramp

Four tokens on the page color: `--ramp-1` (16%), `--ramp-2` (34%), `--ramp-3` (66%) of the text color, and `--ramp-4` (the text color), via `color-mix()`. They are the mark's opacities rounded, so they follow the theme. Used by:

- **Section divider**: four 8 px blocks in ramp order, then a 1 px hairline to the right edge. A `::before` on the section, CSS gradients only.
- **Stepper tally**: Paste has one block (`--ramp-2`), Blur two (`--ramp-2`, `--ramp-3`), Download three, the last one solid and twice as wide, like the bar. The image goes from pixels to done.
- **Exception callout**: the bar as the left edge, its blocks fading to the left of it.
- **"Works with any image" cell**: a checkerboard (transparency grid) in `--ramp-1` on the right 45% of the cell, masked so it fades out to the left like the mark.

### 3.2 Pixel glyphs

Inline SVG, `fill: currentColor`, one `<rect>` per block, `shape-rendering: crispEdges`, `aria-hidden="true"`. 5 px blocks (a 7 x 7 glyph is 35 px), 12 px blocks in the dark cell. Each replaces an outline icon:

| Where | Glyph | Grid |
| --- | --- | --- |
| Private by design | Closed lock, its left column at 34% | 7 x 7 |
| Fast and simple | Lightning bolt | 7 x 7 |
| Works with any image | Picture frame with a mountain and a 66% sun | 7 x 5 |
| Free and open source | `< >`, the left bracket at 34% and the right one solid | 7 x 5 |
| An MCP server for agents | Plug | 7 x 7 |
| Shortcuts from Photoshop | The keys B, E, [ and ] as keycaps (no glyph) | |
| Ask for a feature or report a bug | Speech bubble | 7 x 7 |
| Stepper dividers | Chevron, fading from the left | 3 x 5 |
| FAQ | Plus that becomes a minus when open, 15 px, CSS only | |

The block patterns are in `.local/home-review/2026-11-24/tools/build-proposal.mjs` (`G`). The mark itself, not a glyph, sits next to the closing line.

### 3.3 Checkerboard

The drop zone and the "any image" cell use the transparency checkerboard of image editors (24 px squares at 4% of the text color, 5% in dark). It says "canvas" without a picture.

### 3.4 One dark element per screen

The palette has no second accent, so emphasis comes from the ink color: the "Private by design" cell and the "Blur is not redaction" band are the only dark surfaces on the light page (`--color-black` with `--grey-50` text, `--grey-400` secondary text and `--blue-on-dark` links, all in `contrast.md`). In the dark theme both become `--grey-900` with a 1 px `--grey-700` border.

### 3.5 Effect demos

Three images of the same sample order sheet (the fictional order and contact data of the OG image), each with one round brush stroke over the email and phone rows: Gaussian, Pixelate, Motion. The renders use stand-ins drawn with a canvas script. **For the real page, export them from the app** with the same sample at one intensity, as WebP, 720 x 372 (aim for about 20 KB each), `loading="lazy"`, `width` and `height` set. They are same-origin files below the first screen, so they add no request to the first load and no JavaScript.

## 4. Sections

Order and anchor ids stay as in `home.md`. "Desktop" is 1024 px and up, "tablet" 768 to 1023, "phone" below 768.

### First screen: logo, H1, lede and the app

- **Desktop**: 12-column grid. Left, columns 1 to 6: logo at up to 34 rem (544 px) wide, then H1, then the lede in `--text-muted` at `--step-1`, max 36ch. Right, columns 7 to 12: the app (`#app`): its tagline in 600 weight, the drop zone (`min-height: clamp(15rem, 10rem + 14vw, 22rem)`), the link form and its note. Top padding `--space-7`. Language and theme controls at the top right, inside the gutter.
- **Tablet and phone**: one column, left-aligned, in DOM order. Top padding leaves a row for the controls (`--space-4 + 2.5rem + --space-5`). Logo up to the full column width.
- **Dark**: page `--color-black`, drop zone `--grey-900`, borders `--grey-400`, button `--blue-on-dark` with black text.
- **The app's own styles** (drop zone, button look of "Choose an image", tagline weight, the controls row) live in `App.vue` and `ImageInput.vue`; the prototype shows them as proposed.
- **When an image is loaded**: the app already sets `.layout.editing`. CSS only: `.hero-grid:has(.layout.editing)` switches to one column so the editor gets the full width, with the static header above it. No JavaScript is needed.
- **No layout shift on mount**: `#app` keeps a `min-height` equal to the empty state. Re-measure it per breakpoint after the restyle (it is now a column on desktop, not the full width).

### At a glance (the four cards)

- **Desktop**: bento on the 12-column grid. "Private by design" is the dark cell, columns 1 to 5, both rows, with a 84 px lock at the top and the title at `--step-2` at the bottom. Row 1: "Fast and simple" (columns 6 to 8), "Free and open source" (9 to 12). Row 2: "Works with any image" (6 to 12), with the fading checkerboard.
- **Tablet**: two columns. Dark cell across the top with the lock on the left; "Fast" and "Free" side by side; "Works with any image" across the bottom.
- **Phone**: one column in the same order: dark cell, Fast, Formats, Free.
- Gaps `--space-3`, cell padding `--space-5`. The `<ul>` order does not change; placement is CSS grid.

### Blur part of an image in three steps

- **Desktop**: the stepper is one bordered track of three equal cells, hairlines between them, a pixel chevron on each divider. Each cell: tally, verb at `--step-2`, short line in `--text-muted`. Under the track, the three long steps (`h3` plus paragraph) sit in the same three columns, so each long text is under its step. Done with CSS only on the current markup: the `.prose` block becomes `grid-template-rows: auto auto; grid-auto-flow: column`.
- **Tablet**: track in three columns; long steps in one column at `--measure`.
- **Phone**: track as three rows with hairlines between them, chevrons hidden; long steps in one column.

### Use it your way

- **Desktop and tablet**: index rows, not cards. Each row: the glyph (or the four keycaps) in a 72 px column, the title, then the text with its link. Desktop column widths: 72 px, 5 fr, 7 fr. A solid rule above the first row, hairlines between rows.
- **Phone**: glyph, title and text stacked in each row.

### The three effects

- **Desktop and tablet**: three figures in a row. Image with a hairline border, then the effect name as `h3`, then two labeled lines: "What it looks like" and "What it is for" in `--font-ui-mono` at `--step--1`, the values in body text. The Pixelate warning ("Not for text that must stay secret") in 600 weight.
- **Phone**: the three figures stacked.
- The intensity paragraph stays under the heading.

### What stays on your device

- **Desktop**: text column (columns 1 to 7): heading, paragraph, "The exception: links" with the callout and its paragraph. "Check it yourself" is a bordered panel in columns 8 to 12, `position: sticky` at `--space-5`, with square counters (text color background, page color numbers, mono) and the closing paragraph at `--step--1`.
- **Tablet and phone**: text first, then the panel, full width.

### Blur is not redaction

- **All sizes**: full-bleed dark band, padding `--space-7`. Heading at `--step-3`. The first paragraph in `--grey-400`, the second (what to do instead) in `--grey-50` at `--step-1`, so the advice is the brightest text in the band.
- **Desktop**: text in columns 1 to 7, the pixelated-lines-and-solid-boxes graphic in columns 9 to 12.
- **Tablet and phone**: graphic under the text, at most `clamp(12rem, 4rem + 20vw, 30rem)` wide.

### Questions

- **Desktop**: heading sticky in columns 1 to 4; the eight questions as `<details>` in columns 5 to 12, a solid rule on top and hairlines between them. The first question is open on load.
- **Tablet and phone**: heading, then the list.
- Each `<summary>` holds the existing `h3`, so the heading outline does not change.

### Closing line

- **Desktop**: the mark (56 to 88 px) on the left, the line at `--step-2` bold, max 24ch, on the right; `Ctrl+V` and `Cmd+V` as keycaps.
- **Tablet and phone**: the mark above the line.

## 5. Accessibility and budget

- Every text and UI pair is in `contrast.md` and passes AA in both themes. The ramp blocks, glyphs and graphics are decorative (`aria-hidden`, or CSS backgrounds) and carry no meaning that the text does not.
- Focus: 2 px `--accent` outline, 3 px offset, on everything focusable, including `summary`.
- `<details>` and `position: sticky` need no JavaScript. The only motion is the FAQ marker, inside `prefers-reduced-motion: no-preference`.
- New CSS features: `color-mix()`, `:has()`, `text-wrap`, CSS masks. All are in current Chrome, Edge, Firefox and Safari; where `text-wrap` is missing, headings wrap normally.
- The JavaScript budget does not change: everything here is HTML and CSS.

## 6. Open questions for Ícaro

1. **Split first screen.** His approved mockup centers the logo, the line and the drop zone. This direction puts the drop zone on the right from 1024 px up, because the centered column is what leaves the empty right third at 1366 px. If he prefers the centered version, the rest of the direction still applies.
2. **"Use it your way" as rows.** The mockup has three cards in a row; rows read better with texts of different length and keep the page from having three card grids. Same content.
3. **The effects table.** It becomes three figures with the same text. The column header "Effect" is not repeated, since each figure's heading is the effect name. Everything else in the table is on the page.
4. **"What people hide with it" and the footer links** are in `home.md` but not on the current page, so they are not in the renders either. BMI-099 adds it (Q-024); the renders leave it out only because the current page doesn't have it yet. When the three use-case pages exist, the section fits as a short list under the effects.
5. **Stacked logo columns.** The stacked original draws its five columns at slightly different widths; the redraw keeps them equal, like the horizontal original.
6. **Home style against editor style.** The home's marketing sections use pixel glyphs and square blocks; the editor, on the same page once an image is open, uses outline icons and rounded cards because Ícaro's own reference for it (`.local/home-review/2026-11-24/icaro-editor-ref-0526.png`) does. Default: the editor and the drop zone follow his reference (outline icons, rounded cards), and the glyphs and square blocks stay as the home's identity accents (dividers, stepper, effect demos, the dark blocks). The other way would be pixel glyphs and square cards in the editor too.
