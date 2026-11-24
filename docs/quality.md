# Quality standard

What a change has to meet before it merges. CI enforces most of it; the rest is review. [CONTRIBUTING.md](../CONTRIBUTING.md) covers the workflow, this file covers the bar.

## TypeScript

- Strict mode everywhere, in three projects: app (DOM), server (Node) and configs plus e2e. `pnpm check` runs `vue-tsc --build` over all three.
- Every project also sets `noUncheckedIndexedAccess` and `noImplicitOverride`.
- No `any`, no non-null assertions (`!`). Narrow the type or handle the missing value.
- `import type` for type-only imports (`verbatimModuleSyntax`).

## Biome

One tool for lint, format and import order. `pnpm check` runs it with `--error-on-warnings`, so a warning fails CI.

- Preset: recommended.
- On top of it: `noExplicitAny`, `noNonNullAssertion`, `noFloatingPromises`, `noMisusedPromises`, `noUndeclaredDependencies`, `noImportCycles`, no barrel files (import from the module that defines the thing).
- `noConsole` in `server/proxy/**`. The proxy logs nothing, which is a privacy promise.
- File names: kebab-case for `.ts`, PascalCase for `.vue`.
- Markdown and `.claude/` are not checked by Biome.

## Folder boundaries

Import restrictions are set per folder in `biome.json`, so a violation fails `pnpm check`.

| Folder | May not import |
| --- | --- |
| `src/engine/` | `vue`, `src/ui/`, `src/input/`, `src/export/` |
| `src/input/`, `src/export/` | `vue`, `pixi.js`, `src/engine/` |
| `src/**` | Node built-ins (`node:*`) |
| `server/**` | `src/**` |
| `server/proxy/**` except `node-fetch.ts` | Node built-ins, `undici` |

The point: the engine is plain TypeScript around PixiJS, the UI never reaches into rendering details, and `server/proxy/app.ts` stays on web-standard APIs so it runs on Vercel, Cloudflare and Node. Node-only code lives in `server/proxy/node-fetch.ts` and is injected by the entry files.

## Tests

| Layer | Tool | Required for |
| --- | --- | --- |
| Unit | Vitest | Engine math, history and undo, brush geometry, input decisions, export mapping, every branch of the proxy |
| End to end | Playwright | The four load methods (picker, drop, paste, URL), the CORS to proxy fallback, the four export formats, the Safari WebP fallback, accessibility checks |

- Remote URLs in e2e are mocked with `page.route`. The proxy refuses `localhost` by design, so a real URL test would test the network instead of the app.
- The Safari WebP fallback is exercised by stubbing `toBlob`.
- No Vue component unit tests and no screenshot tests. Components are covered through e2e; pixel comparisons across GPUs are noise.
- A bug fix comes with a test that fails without the fix.
- `forbidOnly` is on in CI; a leftover `.only` fails the run.

### How the e2e server and port are chosen

- Every run, local or CI, builds the app and starts its own `vite preview` through `scripts/e2e-server.mjs`. It is plain Node using vite's API, so the same command works under `sh` and `cmd.exe`.
- The server takes a free port. Playwright treats the run as ready only when that process prints its `Local:` address, and exports the port as `E2E_PORT` for `baseURL` and the workers. A foreign process that opens a port in the meantime is never mistaken for the server.
- `reuseExistingServer` is off everywhere: a run never attaches to a server it did not start. Setting `E2E_PORT` yourself pins the port, and the run fails with "Port … is already in use" if something listens there.
- Each run builds into its own directory under the OS temp dir instead of `dist/`, so several runs can go at once. It is removed when the server stops normally (`SIGTERM`/`SIGINT`, which Playwright sends at the end of a run on Linux, macOS and WSL). A killed run, or any run on Windows where Playwright cannot signal the server, leaves it in the temp dir.
- Each run also writes to its own `test-results/<id>/` (failure context, traces, `.last-run.json`), so a run never wipes another run's results. The folders pile up there (git-ignored); delete `test-results/` when you like. Set `E2E_OUTPUT_DIR` to pin one, for example to use `--last-failed`.
- The HTML report stays in `playwright-report/`, where CI uploads it from. CI behaves as before otherwise: a fresh server and one retry.

### Coverage

`pnpm test:coverage` enforces thresholds on `src/engine/**` and `server/proxy/**` only:

| Lines | Functions | Statements | Branches |
| --- | --- | --- | --- |
| 90% | 90% | 90% | 85% |

WebGL-only files are excluded because they cannot run in the unit environment; Playwright covers them. There is no global threshold, since a project-wide number rewards testing easy code.

## Accessibility

Target: WCAG 2.2 AA.

- `e2e/a11y.spec.ts` runs axe-core with the `wcag22aa` tag against the loaded and the empty states. Zero violations.
- **Single-key shortcuts (`B`, `E`, `[`, `]`) work only while the image canvas has focus** (WCAG 2.1.4). `Ctrl/Cmd` shortcuts can stay global.
- A click without a drag paints one dab, so painting never requires dragging (WCAG 2.5.7).
- Every control is reachable and operable by keyboard, has a visible focus state and an accessible name. Names come from the i18n messages, in every language.
- Color is never the only signal, and text contrast meets AA.

## Performance

Measured in CI by size-limit on the brotli size of the build output (`pnpm size`).

| Budget | Limit |
| --- | --- |
| Initial JavaScript | 50 kB |
| All JavaScript except the WebP encoder | 199 kB |

The first budget (35 kB) was measured before i18n existed. Vue's runtime is about 26 kB brotli and vue-i18n's runtime about 16 kB, so no initial bundle with both fits in 35 kB; petite-vue-i18n would still land near 38 kB. Precompiling the messages took the initial bundle from 47 to 43 kB. On 2026-11-24 Ícaro raised the limits from 45 and 195 kB to 50 and 199 kB for the editor's layout (BMI-098: the icon set, the tool rail and the editor's top row), which measured 47.15 kB initial and 196.51 kB total with every control kept. The lazy chunk was measured twice: no gain the first time (46.73 vs 46.67), and with the top row 47.45 vs 49.22, still over 45 and with a total near 202 kB; Ícaro chose the simple build (D-047). The limits sit about 2.5 to 3 kB above the measured sizes, so any growth is a decision, not drift.

How the budget stays reachable:

- The UI loads the renderer with `await import("../engine/renderer")` and `import type` for types, so PixiJS is not in the initial bundle.
- UI code does not statically import `effects.ts`, which pulls PixiJS in.
- `@jsquash/webp` is loaded only through `import()`, only where native WebP encoding is missing.
- The i18n message files are compiled at build time (`@intlify/unplugin-vue-i18n`), so vue-i18n's message compiler is not shipped.

Lighthouse and Core Web Vitals are checked by hand before a release. CI runners vary too much for a hard gate.

## Supported browsers

The latest two versions of Chrome, Edge, Firefox and Safari, plus iOS Safari and Android Chrome. The build uses Vite's default target and no polyfills.

| Where | What runs |
| --- | --- |
| Every PR | Playwright on Chromium |
| `main` | Playwright on Firefox and WebKit, and the Docker build with a smoke test |
| A PR that changes anything besides documentation | Playwright on Firefox and WebKit too |
| A PR that changes the `Dockerfile`, `.dockerignore`, `package.json`, `pnpm-lock.yaml` or `pnpm-workspace.yaml` | The Docker build with a smoke test too |
| By hand, before a release | Real Safari (macOS and iOS), and Firefox's default WebP/AVIF download |

A PR counts as documentation-only when every changed file is under `docs/`, `marketing/`, `brand/` or `.claude/`, ends in `.md`, or is `LICENSE`. Every other change, including `src/`, `e2e/`, `package.json`, `pnpm-lock.yaml` and the workflows, runs the Firefox and WebKit job.

In Firefox the e2e turns off the internal viewer for WebP and AVIF (`browser.download.viewableInternally.enabledTypes = ""` in `playwright.config.ts`), so downloads fire a download event. That means Firefox's default behaviour when downloading a WebP is not covered and is checked by hand before a release.

## Errors and user messages

- Every failure the user can cause or hit (unsupported file, image too large, blocked URL, network failure, export failure) ends in a visible message. Nothing fails silently and nothing is left to the console.
- Messages say what happened and what to do next, in plain language. No stack traces, error codes or internal names.
- All user-facing text comes from the i18n message files, in English and pt-BR. No literal strings in components.
- The proxy returns a stable machine-readable `error` code in JSON. The client carries it as a `CodedError` and maps each code to a localized message.
- Never include the image URL or image data in a message that could be logged or reported.
- Errors are not swallowed: catch where you can act and show a message, otherwise let them propagate. An empty `catch` is a bug.
- The proxy and the page log nothing. Remove any `console.*` before merging.

## Definition of Done

A change is done when:

1. `pnpm check`, `pnpm test:coverage`, `pnpm build`, `pnpm build:server` and `pnpm size` pass locally, and `pnpm test:e2e` passes if it touches loading, painting or export.
2. New behavior has tests at the layer listed above; a bug fix has a regression test.
3. No new dependency without an accepted issue. A new dependency has a license on the allowlist (`node scripts/check-licenses.mjs`), no `pnpm audit` finding at high severity, and is not reachable from the initial bundle unless it has to be.
4. No analytics, tracking, cookies or network request carrying image data (`node scripts/check-dist.mjs` checks the build).
5. User-facing text exists in both languages.
6. README and `docs/` are updated if behavior, shortcuts, privacy or the proxy changed.
7. The PR title follows Conventional Commits and the PR does one thing.

## Conventions

- **Branches:** `type/short-description`, using the Conventional Commits type: `feat/radial-blur`, `fix/paste-from-safari`, `docs/proxy-env-vars`.
- **Commits:** anything inside a branch. The history on `main` is the PR titles.
- **PR title:** [Conventional Commits](https://www.conventionalcommits.org/), `type: description`, imperative, lowercase, no period. It becomes the squash commit and the changelog line.
- **Merging:** squash merge only. Never edit `CHANGELOG.md` or the `version` in `package.json`; release-please does it from the titles.
- **Comments:** none unless the reason is not obvious from the code. Explain why, never what.
- **Dependencies:** pnpm with a frozen lockfile. New versions younger than 7 days are refused (`minimumReleaseAge`), and no dependency may run install scripts.

## CI

| Job | Runs on | What it does |
| --- | --- | --- |
| Verify | Every PR and `main` | Frozen install, `check`, `test:coverage`, `build`, dist check, `build:server`, `size`, `pnpm audit --audit-level=high`, license check |
| E2E (Chromium) | Every PR and `main` | Playwright with axe, report uploaded on failure |
| E2E (Firefox, WebKit) | `main`, and every PR except one that only changes documentation | Same suite on the other engines, under `xvfb-run` because headless Firefox has no WebGL without a display |
| Docker | `main`, and a PR that changes the `Dockerfile`, `.dockerignore`, `package.json`, `pnpm-lock.yaml` or `pnpm-workspace.yaml` | Builds the image, starts it, expects `/` to answer 200 and `/api/image` without a same-origin header to answer 403 |

Workflows have read-only permissions, pin every action to a full commit SHA and do not persist credentials. `.github/workflows/security.yml` audits dependencies weekly and runs zizmor on any PR that touches a workflow.

## Project layout

```
src/
  main.ts               entry: i18n, app mount
  errors.ts             coded errors the UI turns into messages
  image-size.ts         image dimension type shared by input, engine and ui
  input/                file picker, drag and drop, paste, URL loader, decoding
  engine/
    effect-catalog.ts   effect ids and controls, no PixiJS, read by the UI
    effect-params.ts    effect parameter math (radius, block size), unit tested
    effects.ts          builds each effect's PixiJS filter
    motion-blur-filter.ts  custom motion blur filter
    brush-geometry.ts   brush dab and stroke geometry
    history.ts          operation list, undo and redo
    intensity.ts        intensity in source-image pixels
    load-renderer.ts    lazy import of the renderer chunk
    renderer.ts         PixiJS renderer, loaded on demand with pixi.js/unsafe-eval
  export/               format encoders and download
  ui/                   Vue components, editor state, keyboard shortcuts
  i18n/                 locale detection, message files (en, pt-BR)
server/
  proxy/
    app.ts              Hono app: GET /api/image (web-standard APIs only)
    address.ts          pure IP classification (ipaddr.js)
    image-type.ts       allowlist and file-signature check
    config.ts           limits and allowed origins from the environment
    node-fetch.ts       Node-only fetch that pins the connection to the validated IP
  entries/
    node.ts             static site and proxy in one process, used by Docker
api/
  image.ts              Vercel entry, wraps server/proxy/app.ts
e2e/                    Playwright specs and helpers
scripts/
  check-licenses.mjs    dependency license allowlist
  check-dist.mjs        fails if the build contains analytics or tracking
docs/
  quality.md            this file
  hosting.md            where it runs, costs, how to move
  research.md           competitor and technique research
  product/              backlog, status, decisions, feature specs
  marketing/            audience, channels
.github/
  workflows/            ci.yml, security.yml, release-please.yml
  dependabot.yml
security-headers.ts     page CSP and security headers, single source for every host
vercel.json             same headers (kept in sync by a test), maxDuration for api/image.ts
Dockerfile
pnpm-workspace.yaml     supply-chain settings
```
