# Spec: page-view and speed metrics on the hosted site only

Status: decided by Ícaro (D-029), to be built after PR #2 merges, in a PR of its own. Nothing here enters PR #2.

## Problem

The hosted site gives the maintainer no numbers: how many people visit and how fast the page loads. Ícaro wants Vercel's Web Analytics and Speed Insights on the **hosted** deployment, with nothing of them in the open-source code path and nothing in the Docker image. Today the project promises the opposite everywhere: the README says "No analytics cookies, no tracking pixels" (line 80), `docs/tooling.md` and BMI-003 say to keep both off, and `e2e/privacy.spec.ts` proves the page makes only same-origin requests and sets no cookies.

## Goals

- The hosted build counts page views and Web Vitals through Vercel, never images, file names or image URLs.
- A build that is not the hosted one (a clone, `pnpm build`, the Docker image, Vite preview) contains no analytics code and makes no third-party request, and the existing privacy e2e keeps proving that.
- The README, the in-app notice and `docs/hosting.md` say what is true about the hosted site.

## Non-goals

- Analytics of any other company, ads, or any tracking inside the editor (no events on blur, brush or export).
- Changing the privacy promise about images: files the user opens, drops or pastes never leave the browser.

## What the documentation says (read 2026-11-22; PM, not tested)

- **Web Analytics**: no third-party cookies; a visitor is identified by a hash of the incoming request and the session is discarded after 24 hours; it stores the URL, the referrer, geolocation (country, region, city), device and browser. Hobby: 50,000 events a month, and collection pauses after the grace period and can resume after 7 days.
- **Speed Insights**: anonymous, nothing that would let Vercel rebuild a browsing session; stores route, URL, network speed, browser, device, country and the Web Vital. Hobby: 10,000 events over the last 30 days, shared across the team. **The page doesn't say whether it uses cookies.** So the README's line 80 can't stay as it is on Vercel's word alone: either an experiment on a preview with both on shows no `Set-Cookie` and an empty `document.cookie`, or the sentence changes.
- **How they get into the page**: both are enabled with a package (`@vercel/analytics`, MIT, and `@vercel/speed-insights`) that injects a script; version 2 builds the script URL from a random seed Vercel generates at build time, so the path isn't a fixed `/_vercel/insights/...`. The docs read don't show a dashboard-only way for a plain Vite page. Hobby is for "personal or non-commercial use" (Terms, section 4).

## Requirements

1. **Off by default in the code.** A build-time flag, set only in the hosted project's environment, decides whether the analytics module is loaded. Without it, the packages aren't imported and no bytes of them are in the bundle (the build is checked for it).
2. **Lazy and small.** The code loads through a dynamic `import()` behind that flag, after the page is interactive, so the initial JavaScript budget (1.31 kB of room, D-009) isn't touched in the default build and the hosted build stays within it or the budget question goes to Ícaro first.
3. **No image data.** `beforeSend` removes the query string and any URL that could carry a link; the page URL has no secrets, but a pasted link must never reach an event. No custom events.
4. **CSP changed on purpose.** (PM checked `security-headers.ts`: `connect-src` is `'self' https:` and `script-src` is `'self' 'wasm-unsafe-eval'`, so an analytics intake over https is **not** blocked by the connect policy today; the strict policy alone proves nothing about third parties, and the privacy e2e is the real proof.) `security-headers.ts` allows only what the hosted build needs (the script and intake paths, same origin if the seed paths are first-party) and the Docker and default builds keep the strict policy; a test pins both.
5. **The privacy e2e keeps its meaning.** `e2e/privacy.spec.ts` still runs against the default build and proves same-origin only and no cookies. A second case runs against the hosted-flag build and lists exactly which extra requests are allowed.
6. **Honest text.** README (privacy section and line 80), the app's notice (one line, `en` and `pt-BR`, Ícaro corrects the `pt-BR`) and `docs/hosting.md`: the hosted site counts visits and speed, never images; clones and the Docker image do not; Hobby's limits (events pause the collection, never the app).
7. **Hobby fair use.** The hosted site stays non-commercial. Any revenue other than donations needs Pro or another host (BMI-083).

## How to test

Unit: the flag off loads nothing; on loads once. Build: the default bundle contains no `vercel` analytics string. e2e: privacy spec on both builds. Manual, on a preview with the flag on: the network list, `Set-Cookie`, `document.cookie`, the dashboard shows a page view and no image URL.

## Open questions (before building)

- Whether Speed Insights sets cookies (answered by the experiment above).
- Whether a plain-HTML script tag or the package is the supported way for this setup, and how the build-time seed reaches a Vite page.
- Whether Ícaro wants the app's one-line notice shown on the hosted site only or on every build (the default build has no analytics, so the line would be false there).
