# Blur My Image

Blur an image in your browser. Load it, blur all of it or paint over the parts you want hidden, download it. Free, no account, no watermark. Image files you open, drop or paste never leave your device.

> **Status: pre-release.** v1 is built and under review. It is not deployed yet. This README is the spec for v1.

## What it does

One job, three steps.

**1. Load an image**, any of four ways:

| Method | How |
| --- | --- |
| File picker | Click the drop zone and choose a file |
| Drag and drop | Drop a file anywhere on the page |
| Paste | `Ctrl+V` / `Cmd+V` with an image on the clipboard |
| URL | Paste a link into the URL field, or press `Ctrl+V` with a link copied |

Accepted formats are whatever your browser can decode: PNG, JPEG, WebP, GIF (first frame), AVIF and BMP in all current browsers.

**2. Blur it.**

- **Blur entire image** applies the current effect to every pixel.
- **Brush** paints the effect onto only the areas you drag over.
- **Eraser** removes the effect from an area and brings back the original pixels.

Each stroke uses the effect type and intensity selected at the moment you paint it, so one image can have a light gaussian blur on the background and heavy pixelation on a license plate.

**3. Export it** at the original resolution, or at the downscaled size if the image was larger than the GPU limit (see [Large images](#how-it-works)). You choose the format from a list: PNG, JPG, JPEG or WebP. JPG and JPEG are the same format; the list sets the file extension. The file is named `<name>-blurred.<ext>`, where `<name>` is the original file name without its extension (for a link, the last part of the URL path; `image` if there is none).

That is the whole product. Features that don't serve those three steps go to the [backlog](#backlog) or get dropped.

## Languages

The interface is available in English and Brazilian Portuguese. It follows your browser's language on first visit (any Portuguese variant gets `pt-BR`, everything else gets English), and the language picker in the header overrides it. Your choice is remembered in this browser.

Adding a language means adding one message file and one entry in `SUPPORTED_LOCALES` (`src/i18n/locales.ts`); see [docs/product/specs/i18n.md](docs/product/specs/i18n.md).

## Blur effects

v1 ships the three effects people reach for most. The ranking comes from comparing what Photoshop, Illustrator and the free online blur tools all have in common (details in [docs/research.md](docs/research.md)).

| Effect | What it looks like | Typical use | Photoshop equivalent |
| --- | --- | --- | --- |
| **Gaussian** | Smooth, even softening | Backgrounds, soft-focus, whole-image blur | Filter > Blur > Gaussian Blur |
| **Pixelate** | Square blocks of averaged color | Hiding faces, plates, screen content | Filter > Pixelate > Mosaic |
| **Motion** | Streaks in one direction | Implied movement, stylized blur | Filter > Blur > Motion Blur |

Controls:

- **Intensity** is a 1 to 100 slider. It maps to a radius (or block size, for Pixelate) proportional to the image's shorter side, so the same setting looks the same on a 600 px screenshot and a 6000 px photo.
- **Angle** (Motion only) sets the streak direction, 0 to 180 degrees.
- **Brush size** is adjustable from the toolbar or with `[` and `]`.

### Blur is not redaction

Blurred and pixelated text can sometimes be recovered. A [2016 study](https://crysp.petsymposium.org/popets/2016/popets-2016-0047.pdf) found text stayed recognizable unless the blur radius or mosaic block size exceeded roughly 20 px, and tools such as [Unredacter](https://bishopfox.com/blog/unredacter-tool-never-pixelation) reconstruct pixelated text by brute force. To hide a password, a document number or anything that must stay secret, use heavy Pixelate as a minimum and prefer a solid box (on the backlog). The app shows this warning next to the Pixelate option.

## Keyboard shortcuts

Shortcuts follow Photoshop's defaults where one exists.

| Key | Action |
| --- | --- |
| `Ctrl/Cmd+V` | Paste an image or image URL |
| `B` | Brush |
| `E` | Eraser |
| `[` / `]` | Smaller / larger brush |
| `Ctrl/Cmd+Z` | Undo |
| `Ctrl/Cmd+Shift+Z` | Redo |

`B`, `E`, `[` and `]` work while the image has keyboard focus: click it or move to it with `Tab`. Single-key shortcuts that fire anywhere get in the way of screen reader and speech input users ([WCAG 2.1.4](https://www.w3.org/WAI/WCAG22/Understanding/character-key-shortcuts.html)). The `Ctrl/Cmd` shortcuts work anywhere on the page, except `Ctrl/Cmd+Z` inside a text field, which undoes typing there.

## Privacy

- Images are decoded, edited and encoded in your browser. There is no upload step and no server-side storage.
- The single exception is loading by URL when the remote server doesn't allow cross-origin access. Then the image passes once through a stateless proxy (see [How it works](#how-it-works)). The proxy streams the bytes back and keeps nothing. Our code logs nothing. Vercel keeps its own runtime log of requests to the function (method, path and query string, which holds the image URL, status, user agent and client IP) for 1 hour on the Hobby plan.
- Exported files contain no EXIF metadata. Camera model, timestamps and GPS coordinates from the original are dropped, because canvas export writes pixels only.
- No analytics cookies, no tracking pixels.

## How it works

```
input (file / drop / paste / URL)
        │
        ▼
  ImageBitmap  ──►  operation list  ──►  WebGL renderer (PixiJS)  ──►  canvas on screen
                    [{effect, intensity,                │
                      angle, mask}, ...]                └──►  full-resolution render  ──►  encoder  ──►  download
```

**Operations, not pixels.** The app never edits the source image in place. It keeps the original plus an ordered list of operations. Each operation is an effect, its parameters and a mask: either "whole image" or the brush strokes painted with that setting. Rendering runs the list in order. For each operation it blurs the current result and composites it through the mask. Undo and redo move a pointer in that list, which costs far less memory than storing a full-resolution snapshot per step.

This is the same model Photoshop uses for a Smart Filter with a layer mask, and it keeps brush strokes from compounding: painting over the same spot twice with intensity 40 gives intensity 40, not 80.

**GPU rendering.** Effects run as WebGL fragment shaders through [PixiJS](https://pixijs.com/) v8 and [pixi-filters](https://github.com/pixijs/filters). PixiJS provides the gaussian blur; pixi-filters provides Pixelate. Motion extends the pixi-filters motion blur filter (`EdgeClampedMotionBlurFilter` in `src/engine/motion-blur-filter.ts`) and swaps its shader for a copy that clamps samples to the image edge, so streaks repeat the edge pixels instead of fading to transparent. pixi-filters also has Radial, Zoom, Tilt-Shift and Kawase blur, which covers most of the backlog without writing shaders from scratch. While you paint, the blurred version for the current setting is already rendered, so a stroke only updates a mask texture.

**Preview equals export.** The blur size is defined in source-image pixels, never screen pixels, and the export renders the same operation list at the loaded image's resolution. What you see zoomed out is what you get in the file.

**Large images.** The maximum size is the GPU's `MAX_TEXTURE_SIZE`, read at runtime. Larger images are downscaled to fit, and the app says so before you start editing.

**Loading by URL.** The browser first tries a direct CORS request. If the server refuses, the canvas would be tainted and export would throw a `SecurityError`, so the request goes through `/api/image`, a small [Hono](https://hono.dev/) app that:

- accepts only `http` and `https` URLs on their default ports (80 and 443), with no username or password,
- resolves the hostname and refuses private, loopback and link-local addresses (SSRF protection), re-checking after each redirect, with at most 3 redirects,
- accepts only PNG, JPEG, GIF, WebP, AVIF and BMP content types, checks the file's first bytes against the declared type, and re-labels the response with the canonical type for the format rather than passing the upstream header through,
- caps the response size with a configurable limit (`MAX_BYTES`, default 4,400,000 bytes, below the 4.5 MB response body limit Vercel documents for Functions, which doesn't apply to streamed responses, so the proxy refuses a larger image itself) and times out slow fetches,
- rejects cross-site callers (`Sec-Fetch-Site` / `Origin` checks),
- relies on those header checks only to stop other websites from using the proxy. A script can forge them, so scripted abuse is limited by a rate-limit rule on `/api/image` in the Vercel firewall plus usage alerts, both set up at deploy time,
- stores nothing about the image and logs nothing itself.

`app.ts` is platform-neutral: it takes a `fetch` function and uses only web-standard `Request` and `Response`. Vercel (`api/image.ts`) and Node in Docker (`server/entries/node.ts`) ship today. Cloudflare Workers would need its own fetch (the Node one in `node-fetch.ts` relies on `node:dns`) and its own entry file. See [docs/hosting.md](docs/hosting.md).

**Export.** PNG and JPEG use the browser's native `canvas.toBlob`. JPEG has no transparency, so transparent pixels are flattened onto white. WebP uses `toBlob` where the browser can encode it. Safari can decode WebP but `toBlob('image/webp')` silently returns a PNG there, so the app feature-detects this and lazy-loads [@jsquash/webp](https://github.com/jamsinclair/jSquash), a WebAssembly build of libwebp, only for those browsers. JPEG and WebP use quality 0.92.

## Tech stack

| Area | Choice | Why |
| --- | --- | --- |
| UI | Vue 3 + TypeScript | Small surface, reactive state for a single-screen app |
| Build | Vite | Standard for Vue, fast dev server |
| Rendering | PixiJS 8 + pixi-filters | Maintained WebGL engine with the blur filters already written |
| WebP fallback | @jsquash/webp | libwebp in WASM, loaded only where native encoding is missing |
| i18n | vue-i18n | Official Vue i18n library; typed keys, plurals and number formatting, locales loaded on demand |
| URL proxy | Hono, deployed as one Vercel Function | The only server code; web-standard APIs keep it portable |
| Lint + format | Biome | One tool, one config |
| Unit tests | Vitest | |
| E2E tests | Playwright | Real browser checks for paste, URL load and export |
| Package manager | pnpm | |
| Hosting | Vercel Hobby | Free for a non-commercial project; pauses instead of billing. Docker image built and smoke-tested by `ci.yml` on `main` as the tested exit path ([docs/hosting.md](docs/hosting.md)) |

Canvas 2D's `ctx.filter = 'blur()'` was considered and rejected: it only provides gaussian blur, and caniuse lists Safari on iOS as unsupported through 26.5, so it would need a second code path anyway.

## Development

Requires Node.js 24 and pnpm.

```bash
pnpm install
pnpm dev            # dev server at http://localhost:5173
pnpm check          # Biome (warnings fail) and type check
pnpm test           # unit tests
pnpm test:coverage  # unit tests with coverage thresholds for src/engine and server/proxy
pnpm build          # production build in dist/, with third-party licenses in dist/licenses.md
pnpm size           # bundle size budgets (run after build)
pnpm test:e2e       # Playwright on Chromium, against the production build under the real CSP
pnpm test:e2e:all   # Playwright on Chromium, Firefox and WebKit
```

Playwright needs its browsers once: `pnpm exec playwright install --with-deps chromium` (or without `chromium` for all three).

The quality bar (TypeScript and Biome rules, folder boundaries, required tests, coverage, accessibility, bundle budgets, supported browsers) is in [docs/quality.md](docs/quality.md).

The URL proxy runs locally through `vercel dev`. To run the whole app as it would run off Vercel:

```bash
docker build -t blur-my-image .
docker run -p 3000:3000 blur-my-image   # static site + proxy at http://localhost:3000
```

### Project layout

The folder tree and the import rules between folders are in [docs/quality.md](docs/quality.md#project-layout). In short: `src/` is the browser app (`input/`, `engine/`, `export/`, `ui/`, `i18n/`), `server/` and `api/` are the URL proxy, and `security-headers.ts` holds the page's security headers for every host.

The frontend reads the proxy location from `VITE_PROXY_URL` (default `/api/image`), so static hosting and the proxy can be split across platforms.

Adding an effect means adding its id and controls to `src/engine/effect-catalog.ts`, the function that builds its PixiJS filter to `src/engine/effects.ts` (numbers such as radius or block size go in `src/engine/effect-params.ts`, which is unit tested), and its label in each file under `src/i18n/messages/`. The catalog stays free of PixiJS so the UI can read it without loading the renderer. Nothing else should need to change.

## Backlog

Not in v1. Ordered by how often the effect or feature shows up across the tools surveyed.

**Effects**

1. Radial blur, spin (Photoshop: Radial Blur > Spin, Blur Gallery > Spin Blur)
2. Zoom blur (Photoshop: Radial Blur > Zoom)
3. Tilt-shift (Blur Gallery > Tilt-Shift)
4. Lens blur / bokeh, simulated shallow depth of field
5. Solid box for real redaction
6. Box blur
7. Surface / Smart blur, edge-preserving smoothing
8. Iris and Field blur, focus point with falloff
9. Path blur and Shape blur

**Features**

- Invert brush: blur everything except what you paint (background blur)
- Brush hardness / feather control
- Automatic face detection
- JPEG / WebP quality slider
- HEIC input outside Safari
- Tiled rendering for images above `MAX_TEXTURE_SIZE`
- Copy result to clipboard

**Out of scope:** crop, resize, rotate, filters other than blur, text, accounts, cloud storage, batch processing. Other tools do these well.

## Contributing

Issues and pull requests are welcome. Before opening a PR:

1. Run `pnpm check` and `pnpm test`. The pre-commit hook runs gitleaks and Biome on the staged files, plus `vue-tsc` when the commit stages a TypeScript or Vue file, `package.json` or a `tsconfig*.json`.
2. Keep one change per PR.
3. If you add an effect, include a before/after screenshot in the PR description.

New features need to fit the one-job scope above. Open an issue first if you're unsure.

## License

[MIT](LICENSE)
