# Blur My Image brand kit

The logo is black or white, nothing else. Blue is the accent color of the landing page, interface details and brand materials, never of the logo. The mark is a block of grey pixels that darken into a solid bar, which is what the Pixelate effect does to an image.

Origin of the logos: created by Ícaro, the maintainer.

## Files

| Path | What it is |
| --- | --- |
| `logos/logo-horizontal-black.svg`, `logo-horizontal-white.svg` | Mark and wordmark on one line |
| `logos/logo-stacked-black.svg`, `logo-stacked-white.svg` | Mark beside the wordmark set in three lines |
| `logos/mark-black.svg`, `mark-white.svg` | The mark alone |
| `favicon/favicon.svg` | Simplified mark, 4 x 4 blocks, black in a light color scheme and white in a dark one (`prefers-color-scheme`) |
| `favicon/icon-16.png`, `icon-32.png`, `icon-48.png` | Dark rounded tile with the white mark, fallback for browsers without SVG favicons |
| `favicon/apple-touch-icon-180.png`, `icon-192.png`, `icon-512.png` | Full-bleed dark tile with the white mark, for the home screen and web app manifest |
| `tokens.css`, `tokens.json` | Colors and fonts |
| `contrast.md` | WCAG 2.2 contrast of every color pair in use |
| `OFL.txt` | License of the Liberation fonts used for running text in the social templates |
| `scripts/` | `build-logos.mjs` (SVGs and PNGs), `vectorize-wordmark.mjs` and its output `wordmark-paths.json` (the lettering), `contrast.mjs` |

Color suffixes: `black` (letters, blocks and bar in `#0f1115`) is for light backgrounds, `white` (all `#ffffff`) for dark ones. There are no other colorways.

## Which logo to use

- Horizontal is the default: page headers, README, link previews, slide footers.
- Stacked is for squarer spaces such as a profile image, a poster or a title card.
- The mark alone is for places that already say the name next to it (a toolbar, an avatar, a sticker). Don't use it as the only identifier on a first visit.
- Black on light backgrounds, white on dark ones. Pick the one with more contrast against the surface.
- For a touch of color, put the blue in what sits around the logo (accent text, a link, an interface detail), not in the logo.

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
- Don't color the logo, or the bar alone, blue or any other color. The logo is black or white only.
- Don't stretch, rotate or crop the logo.
- Don't put the black logo on a dark surface or the white one on a light surface.
- Don't use the favicon mark where there is room for the full mark.

## Colors and fonts

Everything is in `tokens.css` (`tokens.json` has the same values). `marketing/social/templates/brand.css` imports it, so the social templates and the OG image change when the tokens change. The app doesn't import it yet.

| Token | Value | Role |
| --- | --- | --- |
| `--color-black` | `#0f1115` | Background, ink |
| `--color-white` | `#ffffff` | White logo, light backgrounds |
| `--grey-900` | `#181b21` | Surface on dark |
| `--grey-700` | `#454c5c` | Secondary text on light |
| `--grey-400` | `#9aa1ad` | Secondary text on dark |
| `--grey-100` | `#eceef2` | Paper, light panels |
| `--grey-50` | `#f2f3f5` | Text on dark |
| `--blue-on-dark` | `#7cc4ff` | Accent on dark: landing page, interface details, brand materials |
| `--blue-on-light` | `#0d62b8` | Accent on light: landing page, interface details, brand materials |

There are two blues because `#7cc4ff` has only 1.87:1 against white and `#0d62b8` has 6.07:1 (ratios rounded down, as in `contrast.md`). Neither is a logo color.

The only fonts are Liberation Sans (headlines and text) and Liberation Mono (labels). Contrast ratios are in `contrast.md`; regenerate it with `node brand/scripts/contrast.mjs`.

## Lettering, mark and fonts

The lettering of "Blur My Image" is the maintainer's own, vectorized from his raw PNGs (`logo-horizontal.png` for the horizontal logo, `logo-stacked.png` for the stacked one, kept in `brand/source/` and never committed). The SVGs contain only paths: no raster image, no text and no font.

The mark is redrawn as plain rectangles: 5 x 5 equal blocks, 14 grey blocks and the solid bar. It sits in the same place and at the same size relative to the lettering as in the original files. The horizontal original draws the mark slightly wider than tall; here it is square, as in the stacked original.

Liberation Sans and Liberation Mono (2.1.5, SIL Open Font License 1.1, `OFL.txt`) are used only as live text in the social templates and the OG image. The font files are not in the repository. Rendering those templates needs `fonts-liberation` installed (Debian and Ubuntu); without it the browser falls back to Arimo, Arial or Helvetica and the layout changes slightly.

## Regenerating

- `node brand/scripts/build-logos.mjs` rewrites every SVG in `logos/` and `favicon/` and the PNGs in `favicon/` from `scripts/wordmark-paths.json`. It needs Playwright for the PNGs and no font.
- `vectorize-wordmark.mjs` turns the raw PNGs into `wordmark-paths.json`. It loads the `potrace` npm package (2.1.8, GPL-2.0) from a folder outside the repository; it is not a dependency, and its license covers the tool, not the paths it produces. Run it with `npm install potrace@2.1.8` in a folder outside the repository, then `TRACE_MODULES=<that folder>/node_modules node brand/scripts/vectorize-wordmark.mjs`. It also needs `brand/source/` and `jimp`, which `potrace` installs.
  - Potrace runs on a 4x upscale of the PNG with a light blur. The script then re-fits straight edges as exact vertical, horizontal or diagonal lines, aligns baselines and cap lines, rebuilds sharp corners, refits the curves (cubic fit, 0.35 px tolerance) and winds the holes of B, a, g and e opposite to the outlines, so the paths fill correctly without `fill-rule`.
  - Checked at source size against the raw PNGs: no pixel of the SVG is more than 1 px from the original outline. Also compared side by side at 80, 120, 200 and 500 px wide (horizontal) and 80, 200 and 320 px wide (stacked); the holes of B, a, g and e are open in both colors.

## Known limits

- `favicon.svg` is transparent. With a light OS theme and a dark browser tab strip the dark blocks are hard to see. The PNG tiles don't have this problem.
- Older Safari versions ignore SVG favicons, so they need the PNG tiles and the 180 px apple-touch icon.
- There is no `.ico` file.
