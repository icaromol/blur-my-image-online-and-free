# Hosting

Where v1 runs, what it costs, and how to move it without a rewrite. Researched November 2026. Plan limits change often, so check the linked pages before relying on a number.

## What actually costs server resources

All image work happens in the browser. Only two things touch a server:

| Piece | What it consumes | Weight |
| --- | --- | --- |
| Static site (Vite build) | Bandwidth, once per new visitor (then browser cache) | Low. Assuming a 0.5 to 1 MB bundle with Vue and PixiJS, 100 GB covers roughly 100k to 200k first visits a month |
| `/api/image` proxy | One invocation plus the image bytes in and out, per URL load that fails CORS | The only real risk, mostly from abuse |

Cost grows with visits, not with image size, because edited images never reach the server.

## Options compared

| Option | Cost | Relevant limits | Commercial use (ads, donations) | Proxy |
| --- | --- | --- | --- | --- |
| **Vercel Hobby** | Free | 100 GB transfer, 1M function invocations, 4 h Active CPU per month. Over the limit the project **pauses**, no bill | **Not allowed.** Ads count as commercial; donations are disputed | Node function, 4.5 MB body limit |
| **Vercel Open Source Program** | US$3,600 credits over 12 months | Selective, quarterly cohorts | Allowed | Same as Pro |
| **Vercel Pro** | US$20 per seat per month | Much higher, overage billed | Allowed | Same |
| **Cloudflare Workers Free** | Free | Static asset requests free and unlimited. 100k Worker requests per day, 10 ms CPU per request | Allowed | Worker `fetch`. Cannot fetch bare IPs or reach private networks without a VPC binding, which already blocks most SSRF |
| **Netlify Free** | Free | 300 credits a month; bandwidth costs 20 credits per GB (about 15 GB). Over the limit the site pauses | Allowed | Functions |
| **VPS + Docker** | From about €4 to €5 a month | Whatever the machine handles | Allowed | Full control |
| GitHub Pages | Free | Static only | n/a | **None.** URL loading would work only for CORS-enabled images |

On a VPS, Coolify or Dokploy give a Vercel-like dashboard on top of Docker. Hetzner raised prices twice in 2026 (April and June) and its cheapest instances have been reported out of stock, so compare providers at the time.

## Decision

Start on **Vercel Hobby**. It costs nothing, it pauses instead of billing, and the project fits its non-commercial rule today.

Write the proxy so that leaving Vercel means swapping one entry file (see [Portable layout](#portable-layout)), and build the Docker image in CI from day one so the exit path is tested before it's needed.

## Vercel Hobby caveats

1. **Non-commercial only.** Adding ads, and possibly a donation button, requires Pro or moving off. This is the most likely migration trigger, before traffic.
2. **The image proxy can be abused.** Anyone could use `/api/image` as a free proxy and drain the quota. Hobby allows 3 custom firewall rules, only 1 of them a rate limit. A community thread from October 2026 also reports that choosing a 429 response for that rule opens a Pro upgrade prompt. Defenses that don't depend on the platform:
   - reject requests whose `Sec-Fetch-Site` isn't `same-origin` or whose `Origin` is another site,
   - enforce the size cap and a fetch timeout,
   - spend the one WAF rate-limit rule on `/api/image`.
3. **Hitting a limit takes the site down**, in most cases until 30 days have passed. For a free open source tool that's better than a surprise bill, but monitor usage.
4. **The 4.5 MB cap belongs to Vercel, not the product.** Keep it in configuration.

## Portable layout

The frontend is a static Vite SPA and runs anywhere. All platform coupling is in the proxy, so isolate it:

```
src/                       frontend, no platform imports
server/
  proxy/
    app.ts                 Hono app: GET /api/image?url=  (standard Request/Response/fetch only)
    ssrf.ts                IP and redirect validation; takes an injected resolver
    config.ts              MAX_BYTES, MAX_REDIRECTS, TIMEOUT_MS from env
    resolvers/
      node.ts              node:dns/promises (Vercel, Docker)
      doh.ts               DNS over HTTPS (Cloudflare Workers has no node:dns)
  entries/
    node.ts                @hono/node-server + serveStatic('dist'), used by Docker
    worker.ts              export default app, for Cloudflare
api/
  image.ts                 handle(app) from hono/vercel, for Vercel
Dockerfile
vercel.json                (wrangler.toml only when moving to Cloudflare)
```

Rules:

- **Hono on web-standard APIs.** The same `app.ts` runs on Vercel (`handle(app)`), Cloudflare (`export default app`) and Node (`@hono/node-server`). Moving means changing an entry file of a few lines.
- **The proxy URL is configuration** (`VITE_PROXY_URL`, default `/api/image`), so static hosting and the proxy can live on different hosts, for example static on Cloudflare and the proxy on a VPS.
- **No Vercel-only products** (Blob, Marketplace KV, Image Optimization, Global Config). The app needs none of them.
- **Security headers defined once.** A single `headers.ts` produces `vercel.json` headers and the `_headers` file Cloudflare and Netlify read; `entries/node.ts` applies the same values.
- **SSRF in layers.** On Node, pin the connection to the IP that passed validation (custom `lookup` on the undici dispatcher) so DNS rebinding can't swap it. Workers can't pin, but there is no private network to reach from there.
- **One test suite for every target.** Proxy unit tests run against bare `app.ts` (`app.request(...)` in Vitest). Playwright runs against the Docker image in CI.

### Dockerfile sketch

Serves the static build and the proxy from one process.

```dockerfile
FROM node:24-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build && pnpm build:server

FROM node:24-slim
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/dist-server ./dist-server
COPY --from=build /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist-server/entries/node.js"]
```

## When to move, and where

| Trigger | Recommended target |
| --- | --- |
| Ads or donations | **Cloudflare Workers Free** (commercial use allowed, unlimited static) or apply to the Vercel Open Source Program |
| Bandwidth above about 100 GB a month | Cloudflare (static becomes free) |
| Proxy above 100k requests a day, or more control needed | Proxy on a VPS with Docker, static stays on Cloudflare |
| Staying on Vercel with a budget | Pro, US$20 a month |

Cloudflare is the cheapest next step. A VPS only pays off when the proxy itself needs control.

## Sources

- [Vercel Hobby plan](https://vercel.com/docs/plans/hobby)
- [Vercel fair use policy](https://vercel.com/docs/limits/fair-use-policy)
- [Is Vercel free? Hobby in 2026 (DEV)](https://dev.to/abhijais1/is-vercel-free-what-the-hobby-plan-covers-in-2026-2ke)
- [Donations on the Hobby plan (Vercel Community)](https://community.vercel.com/t/donations-on-the-hobby-plan/50665)
- [Vercel Open Source Program](https://vercel.com/open-source-program) and [docs](https://vercel.com/docs/open-source-program)
- [Vercel WAF rate limiting](https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting) and [custom rules](https://vercel.com/docs/vercel-waf/custom-rules)
- [Hobby firewall 429 opens Pro upgrade (Vercel Community)](https://community.vercel.com/t/hobby-firewall-selecting-429-opens-pro-upgrade-despite-documented-allowance/50801.md)
- [Cloudflare Workers limits](https://developers.cloudflare.com/workers/platform/limits), [pricing](https://developers.cloudflare.com/workers/platform/pricing/), [static assets billing](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations)
- [Cloudflare Workers known issues (no fetch by IP)](https://developers.cloudflare.com/workers/platform/known-issues/) and [VPC Networks changelog](https://developers.cloudflare.com/changelog/post/2026-05-21-vpc-networks-cloudflare-wan/)
- [Netlify pricing update, April 2026](https://www.netlify.com/changelog/2026-04-14-pricing-updates-april-2026/) and [credit-based plans](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/)
- [Hono web standard](https://hono.dev/concepts/web-standard) and [adapter helper](https://hono.dev/docs/helpers/adapter)
- [Hetzner price increase (Tom's Hardware)](https://www.tomshardware.com/tech-industry/hetzner-to-raise-prices-by-up-to-37-percent-from-april-1), [heise: up to 200 percent](https://heise.de/-11333037)
- [Coolify vs Dokploy (getdeploying)](https://getdeploying.com/guides/coolify-vs-dokploy)
