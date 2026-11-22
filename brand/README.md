# Blur My Image brand kit

Black and white with one blue accent. The mark is a block of grey pixels that darken into a solid bar, which is what the Pixelate effect does to an image.

Origin of the logos: created by Ícaro, the maintainer.

## Files

| Path | What it is |
| --- | --- |
| `logos/logo-horizontal-*.svg` | Mark and wordmark on one line |
| `logos/logo-stacked-*.svg` | Mark beside the wordmark set in three lines |
| `logos/mark-*.svg` | The mark alone |
| `favicon/favicon.svg` | Simplified mark, 4 x 4 blocks, follows `prefers-color-scheme` |
| `favicon/icon-16.png`, `icon-32.png`, `icon-48.png` | Dark rounded tile with the reverse mark, fallback for browsers without SVG favicons |
| `favicon/apple-touch-icon-180.png`, `icon-192.png`, `icon-512.png` | Full-bleed dark tile, for the home screen and web app manifest |
| `tokens.css`, `tokens.json` | Colors and fonts |
| `contrast.md` | WCAG 2.2 contrast of every color pair in use |
| `OFL.txt` | License of the wordmark font |
| `scripts/` | Generators for the SVGs, the PNGs and `contrast.md` |

Color suffixes: `black` and `blue` are for light backgrounds, `white` and `blue-reverse` for dark ones. In `blue` the bar is `#0d62b8`, in `blue-reverse` it is `#7cc4ff`. The blue differs because `#7cc4ff` has only 1.87:1 against white, and `#0d62b8` has 6.07:1 (ratios are rounded down, as in `contrast.md`).

## Which logo to use

- Horizontal is the default: page headers, README, link previews, slide footers.
- Stacked is for squarer spaces such as a profile image, a poster or a title card.
- The mark alone is for places that already say the name next to it (a toolbar, an avatar, a sticker). Don't use it as the only identifier on a first visit.
- Black or white when the surface already has color. Blue when the logo is the one accent on a plain light or dark surface.
- Don't put the blue bar on a colored photo or on any background that isn't white, near-white (`#eceef2`) or the black token (`#0f1115`).

## Clear space

Keep free space of 2x on all four sides, where x is the width of the bar (one block). In the horizontal logo `x` is one fifth of the mark's height.

## Minimum size

| Logo | Minimum width on screen | Minimum in print |
| --- | --- | --- |
| Horizontal | 120 px | 30 mm |
| Stacked | 80 px | 20 mm |
| Mark alone | 32 px | 8 mm |

Below these sizes the lightest blocks blur together and the letters close up. For the mark, use `favicon/favicon.svg` (4 x 4 blocks) below 32 px.

## What not to do

- Don't redraw, re-space or re-color the letters, and don't type the name in another font next to the mark.
- Don't recolor the grey blocks. They are the logo color at 14% to 92% opacity, so they fade the same way on any background.
- Don't add outlines, shadows, glow or gradients.
- Don't stretch, rotate or crop the logo, and don't swap the blue bar for another color.
- Don't put the black logo on a dark surface or the white one on a light surface.
- Don't use the favicon mark where there is room for the full mark.

## Colors and fonts

Everything is in `tokens.css` (`tokens.json` has the same values). `marketing/social/templates/brand.css` imports it, so the social templates and the OG image change when the tokens change. The app doesn't import it yet.

| Token | Value | Role |
| --- | --- | --- |
| `--color-black` | `#0f1115` | Background, ink |
| `--color-white` | `#ffffff` | Reverse logo, light backgrounds |
| `--grey-900` | `#181b21` | Surface on dark |
| `--grey-700` | `#454c5c` | Secondary text on light |
| `--grey-400` | `#9aa1ad` | Secondary text on dark |
| `--grey-100` | `#eceef2` | Paper, light panels |
| `--grey-50` | `#f2f3f5` | Text on dark |
| `--blue-on-dark` | `#7cc4ff` | Accent on dark |
| `--blue-on-light` | `#0d62b8` | Accent on light |

The only fonts are Liberation Sans (headlines and text) and Liberation Mono (labels). Contrast ratios are in `contrast.md`; regenerate it with `node brand/scripts/contrast.mjs`.

## Font and license

The wordmark letters are outlines of Liberation Sans Bold 2.1.5, licensed under the SIL Open Font License 1.1 (`OFL.txt`). The SVGs contain paths, not text, so no font needs to be installed to show them. The font files are not in the repository. Rendering the social templates needs Liberation Sans and Liberation Mono installed (`fonts-liberation` on Debian and Ubuntu); the browser falls back to Arimo, Arial or Helvetica without them, and the layout then changes slightly.

The mark and the layout follow the maintainer's original logo. The letters do not: the original wordmark is a heavier face, and these were redrawn with an open font so the kit has a license that is clear. A different weight or font is a decision for the maintainer.

## Regenerating

`node brand/scripts/build-logos.mjs` rewrites every SVG in `logos/` and `favicon/` and the PNGs in `favicon/`. It reads the font from `/usr/share/fonts/truetype/liberation/` and uses Playwright for the PNGs. `brand/source/` holds the maintainer's raw PNGs; they are not tracing sources and are never committed.

## Known limits

- `favicon.svg` is transparent. With a light OS theme and a dark browser tab strip the dark blocks are hard to see. The PNG tiles don't have this problem.
- Older Safari versions ignore SVG favicons, so they need the PNG tiles and the 180 px apple-touch icon.
- There is no `.ico` file.
