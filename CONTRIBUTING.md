# Contributing

Thanks for helping. This project has one maintainer, so a small, focused pull request that fits the scope below gets reviewed fastest. By taking part you agree to the [Code of Conduct](CODE_OF_CONDUCT.md).

## Scope and privacy

**One job.** The app loads an image, blurs it and exports it. A change belongs here if it makes one of those three steps better. Cropping, resizing, rotating, other filters, text, accounts, cloud storage and batch processing are out of scope (see the README's [Backlog](README.md#backlog)).

**Privacy is not negotiable.** Images are decoded, edited and encoded in the browser. A change must not add analytics, tracking, cookies, an upload step, or any network request that carries image data. The only server code is the URL proxy, and it stores nothing. A change that weakens a privacy promise in the [README](README.md#privacy) will be declined however useful it is.

## When to open an issue first

| Your change | Open an issue first? |
| --- | --- |
| Typo, broken link, small docs fix | No, send the PR |
| Bug fix | No if the fix is obvious and small. Otherwise yes, with the steps to reproduce |
| New effect, new tool, new input or export format | Yes, and wait for the `accepted` label |
| Change to a keyboard shortcut, default setting or the look of the editor | Yes |
| Anything touching the URL proxy, the CSP or other security headers, or privacy behavior | Yes. For a vulnerability, use the [private report](SECURITY.md) instead |
| New dependency, or a change to the architecture | Yes. Architecture decisions are discussed in the issue and recorded in `docs/` |
| New language | Yes, it is small. See [docs/product/specs/i18n.md](docs/product/specs/i18n.md) |

A feature pull request with no accepted issue will probably be closed, and the time you spent is the real cost of that. Ask first.

## Setup

You need Node.js 24, pnpm and [gitleaks](https://github.com/gitleaks/gitleaks). The pre-commit hook refuses to run without gitleaks.

```bash
corepack enable                 # picks the pnpm version pinned in package.json
mise use -g gitleaks@8.30.1     # or: brew install gitleaks
pnpm install                    # also installs the git hooks through husky
pnpm exec playwright install chromium   # once, for the end-to-end tests
pnpm dev                        # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm check` | Biome lint and format check, then `vue-tsc --build` |
| `pnpm test` | Unit tests (Vitest) |
| `pnpm test:e2e` | Playwright, against a production build served by `vite preview` |
| `pnpm build` | Production build in `dist/` |
| `pnpm build:server` | Build the Node entry for the Docker image |

Run `pnpm check` and `pnpm test` before you push. Run `pnpm test:e2e` when you touch loading, painting or export.

## Branches

Branch from `main`, one branch per change, named after the Conventional Commits type: `feat/radial-blur`, `fix/paste-from-safari`, `docs/proxy-env-vars`. From a fork, the same names apply.

## Pre-commit hook

`.husky/pre-commit` runs on every commit and stops it on failure:

1. `gitleaks` scans the staged changes for secrets.
2. `biome check --staged` lints and checks formatting on the staged files only. Fix with `pnpm exec biome check --write <files>`.
3. `vue-tsc --build` type-checks, but only when the commit stages a `.ts`, `.mts`, `.cts` or `.vue` file, `package.json` or a `tsconfig*.json`.

Do not skip the hook with `--no-verify`. If it fails on something you did not change, say so in the PR.

## Commits and pull requests

The repository uses **squash merge only**. The **pull request title** becomes the commit on `main`, so that is the one line that has to be right. It follows [Conventional Commits](https://www.conventionalcommits.org/): `type: short description` in the imperative, lowercase, no period. Commits inside your branch can say anything.

[release-please](https://github.com/googleapis/release-please) reads those titles on `main` to pick the next version and write the changelog, so you never edit `CHANGELOG.md` or the `version` in `package.json`. A release is made in two steps: release-please opens a release pull request with the next version and the changelog, and the release only goes out when the maintainer merges that pull request.

| Type | Use it for | Effect on the release |
| --- | --- | --- |
| `feat` | A user-visible capability: effect, input, format, shortcut | Minor bump. Listed under Features |
| `fix` | A bug fix, including `fix(deps)` for dependency bumps that close a vulnerability | Patch bump. Listed under Bug Fixes |
| `perf` | Same output, faster or lighter | Patch bump. Listed under Performance Improvements |
| `revert` | Undoing an earlier change | Patch bump. Listed under Reverts |
| `docs`, `refactor`, `test`, `build`, `ci`, `chore`, `style` | No change a user can see | No release on their own, not in the changelog |
| Any type with `!` (`feat!:`) or a `BREAKING CHANGE:` footer | A change to the public surface (see below) | Minor bump while the version is below 1.0.0, major after |

The public surface is: the inputs, effects, export formats and shortcuts, the privacy guarantees, the proxy's environment variables, the `/api/image` route, and the Docker port and entry file. Versions stay at `0.y.z` until everything in the README ships, then `1.0.0`.

In the PR description say what changed and why, link the issue, and tick the template's checklist. Keep one change per PR, even when two fixes touch the same file.

## Adding an effect

Only after the issue is `accepted`.

1. Add one entry to `src/engine/effects.ts`: its id, its controls, and a function that builds the PixiJS filter from the intensity and the image size. Intensity is defined in source-image pixels, not screen pixels, so preview and export match.
2. Add its label (and its warning text, if it has one) to every file in `src/i18n/messages/`. Both `en` and `pt-BR` are required.
3. Add a unit test next to the effect and, if it changes what the user sees, an end-to-end case.
4. Put a before/after screenshot in the PR description, made from a public or synthetic image.

Nothing else should need to change. If it does, mention it in the PR so the architecture can be fixed rather than worked around.

## Reporting bugs

Use the bug form. The most useful report has the steps, your browser and OS, and the image's format and dimensions. **Do not attach images with real people, documents, plates or any private data**, and do not paste a private URL: reproduce with a public or synthetic image, or describe the file. Images attached to a public issue are public. Reports that need more information get the `needs-info` label and are closed after 14 days without an answer.

Security problems go to the [private report](SECURITY.md), never to a public issue.

## Licensing

The project is [MIT](LICENSE). By submitting a contribution you agree that it is licensed under the same terms (inbound equals outbound). There is no CLA and no sign-off line to add.

## How decisions are made

The maintainer decides, in public, in the issue or PR. The criteria, in order:

1. Privacy: does it keep every image on the device?
2. Scope: does it serve load, blur or export?
3. Maintenance cost: what does it cost to keep working across browsers and dependencies?
4. How common the feature is in the tools and research the README cites.

Architecture decisions start as an issue, and the result is written down in `docs/`. Saying no is part of keeping a one-person project alive; a closed issue labeled `out-of-scope` is not a judgment of your idea.

Issues and pull requests get a first reply within 7 days. Triage happens weekly.

## You answer for your contribution

Use whatever tools you like. You answer for every line you submit: you have read it, you can explain it, you ran it, and you have the right to license it. A pull request that cannot be explained by its author will be closed.
