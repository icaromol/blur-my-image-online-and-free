# Research: blur effects, competitors and browser constraints

Collected November 2026 to decide what v1 ships and what goes to the backlog. Sources are listed at the end.

## 1. Photoshop

Photoshop splits blur across three places.

**Filter > Blur** (classic filters, applied to a layer or selection):

| Filter | What it does |
| --- | --- |
| Average | Fills the selection with its average color. Useful for color sampling, not for blurring |
| Blur / Blur More | Fixed small blur with no controls |
| Box Blur | Averages neighbors in a square kernel. Faster than gaussian, slightly blockier |
| Gaussian Blur | Bell-curve weighted average. The default blur everywhere. Live preview on canvas since Photoshop 24.0 (October 2022) |
| Lens Blur | Simulates a narrow depth of field, optionally driven by a depth map. Produces bokeh shapes |
| Motion Blur | Blurs along one direction with angle and distance |
| Radial Blur | Two modes: Spin (concentric circles) and Zoom (radial lines from a center) |
| Shape Blur | Uses a custom shape as the kernel |
| Smart Blur | Blurs while preserving edges, with radius, threshold and quality |
| Surface Blur | Edge-preserving blur used for skin and noise smoothing |

**Filter > Blur Gallery** (on-canvas widgets with live preview):

| Filter | What it does |
| --- | --- |
| Field Blur | Pins with different blur amounts, interpolated across the image |
| Iris Blur | Keeps an elliptical area sharp, blurs outside with a falloff |
| Tilt-Shift | Sharp band with blur above and below, the "miniature" look |
| Path Blur | Motion blur along a drawn path |
| Spin Blur | Rotational blur around a point, like spinning wheels |

**Filter > Pixelate > Mosaic** is not filed under Blur but is the standard tool for hiding faces and plates.

**Blur tool** (toolbar, `R`): a brush with a Strength setting that blurs where you paint. Strokes compound: painting the same spot again blurs it more. Pros typically use a Gaussian Blur Smart Filter plus a painted mask instead, which gives a uniform, re-editable result. Blur My Image follows the mask approach.

## 2. Illustrator

Illustrator's **Effect > Blur** menu has three entries, all raster effects borrowed from Photoshop. They render at the document's raster effects resolution, even on vector objects.

| Effect | Controls |
| --- | --- |
| Gaussian Blur | Radius |
| Radial Blur | Spin (degrees) or Zoom (amount 1 to 100), plus a draggable center |
| Smart Blur | Radius, threshold, quality; Edge Only and Overlay Edge modes |

Illustrator adds nothing beyond Photoshop's set. It confirms Gaussian and Radial as the core two.

## 3. Free online tools

| Tool | Blur types | Brush | Notes |
| --- | --- | --- | --- |
| Pixlr | Blur brush | Yes, adjustable size | Full editor around it |
| Blurimage.io | Gaussian, motion, radial, pixelate, noise | Yes, size and strength | Closest to this project's scope |
| Photopea | Full Photoshop set | Yes | Photoshop clone, ads, steep learning curve |
| PineTools | Gaussian / pixelate on a rectangle | No | Fast, minimal |
| Ezgif | Blur, pixelate | No | Only one with GIF support |
| BlurMe | Blur, pixelate, AI face detection | Yes | Freemium, from $9.99/mo |
| Kapwing | Face blur, pixelate | Partial | Video-first editor |

Observations that shaped the spec:

- Gaussian and pixelate appear in every tool. Motion is the next most common, then radial.
- Brush-based blur is expected; rectangle-only tools feel limited.
- Several tools produce a weak blur that leaves faces or text readable. Pixelate with a large block size is the safer default for privacy.
- Automatic face detection is mostly a paid feature.

### Resulting priority

| Rank | Effect | Why |
| --- | --- | --- |
| 1 | Gaussian | Default in Photoshop, Illustrator and every online tool |
| 2 | Pixelate | The privacy use case, present in every online tool |
| 3 | Motion | Next most common in Photoshop and online tools |
| Backlog | Radial spin, zoom, tilt-shift, lens, box, surface/smart, iris/field, path, shape | Lower frequency or narrower use |
| Dropped | Average, Blur, Blur More | No controls or not a blur in practice |

## 4. Blur and pixelation as redaction

Neither is secure for text. Pixelation averages blocks, so tools like Bishop Fox's Unredacter render guesses in the same font and compare them with the pixelated text. Gaussian blur is a known linear operation and can be partly reversed. Hill et al. (PoPETs 2016) recovered pixelated and blurred text across typefaces, font sizes, grid sizes and noise levels, and concluded that pixelation and blur are not viable ways to redact text. Security researchers recommend opaque boxes. Hence the warning in the UI and the solid box in the backlog.

## 5. Browser constraints

| Capability | Status | Consequence |
| --- | --- | --- |
| `CanvasRenderingContext2D.filter` | Shipped in Chromium and Firefox. Caniuse lists Safari on iOS as unsupported through 26.5 | Not used. Effects run as WebGL shaders instead |
| WebGL 2 | All current browsers | Rendering engine |
| `toBlob('image/png')`, `'image/jpeg'` | All browsers | Native export |
| `toBlob('image/webp')` | Chromium, Firefox. Safari returns a PNG instead | Feature-detect with a 1×1 canvas, lazy-load @jsquash/webp in Safari |
| Cross-origin images | Taint the canvas unless the server sends `Access-Control-Allow-Origin`; `toBlob` then throws `SecurityError` | Try CORS first, fall back to a self-hosted proxy |
| Vercel Function response body | 4.5 MB max | Cap for URL-loaded images that need the proxy |

## 6. Libraries checked

| Library | Version (Nov 2026) | Verdict |
| --- | --- | --- |
| pixi.js | 8.23.0 | Used. Maintained WebGL renderer, built-in BlurFilter |
| pixi-filters | 6.1.5 | Used. Pixelate, MotionBlur, RadialBlur, ZoomBlur, TiltShift, KawaseBlur |
| @jsquash/webp | 1.5.0 | Used, Safari only. libwebp compiled to WASM |
| stackblur-canvas | 3.0.1 | Rejected. CPU-only gaussian approximation; fast, but every other effect would need custom CPU code |
| glfx.js | 0.0.4 | Rejected. Unmaintained |

## Sources

- John Paul Caponigro, [A Grand Overview of Photoshop's Blur Filters](https://www.johnpaulcaponigro.com/blog/?p=41160)
- Adobe, [Blur Gallery](https://helpx.adobe.com/ie/photoshop/using/blur-gallery.html)
- Adobe, [Illustrator effects summary](https://helpx.adobe.com/illustrator/using/summary-effects.html)
- Pluralsight, [A Handy Guide to Figuring Out Blurs in Photoshop](https://www.pluralsight.com/blog/architecture/handy-guide-figuring-blurs-photoshop)
- Softpicker, [How to Pixelate Image Online Free in 2026](https://softpicker.com/how-to-pixelate-image-online-free/)
- BlurMe, [Online Blur Tools: Complete Guide + Comparison](https://www.blur.me/blog/blur-online-complete-guide/) (vendor-written)
- Pixlr, [Blur tool](https://pixlr.com/tools/blur-tool)
- Hill, Zhou, Saul, Shacham, [On the (In)effectiveness of Mosaicing and Blurring as Tools for Document Redaction](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf), PoPETs 2016
- Bishop Fox, [Unredacter: never use pixelation](https://bishopfox.com/blog/unredacter-tool-never-pixelation)
- Dark Reading, [Pixelating Text Leads to Information Leakage](https://darkreading.com/vulnerabilities-threats/pixelating-text-leads-to-information-leakage-warns-firm)
- caniuse, [CanvasRenderingContext2D.filter](https://caniuse.com/mdn-api_canvasrenderingcontext2d_filter)
- caniuse, [toBlob type image/webp](https://caniuse.com/mdn-api_htmlcanvaselement_toblob_type_parameter_webp)
- WebKit, [Bug 226950: Canvas can't export its data to image/webp](https://bugs.webkit.org/show_bug.cgi?id=226950)
- MDN, [Use cross-origin images in a canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_enabled_image)
- Vercel, [Functions limitations](https://vercel.com/docs/functions/limitations#request-body-size)
