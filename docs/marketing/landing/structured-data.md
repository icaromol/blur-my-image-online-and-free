# Structured data (home page only)

- **Page:** the home, which is the app's own screen (D-032): one page, `index.html`. No other page carries markup, including the use pages if they stay (Q-024).
- **Type:** one `WebApplication` block, as seo.md recommends. No `FAQPage`, no `HowTo`, no `aggregateRating`, no `review`.
- **For:** BMI-085, which puts it in the static head of `index.html` as `<script type="application/ld+json">`.
- **Nothing is published.** The block holds the marker `[HOME-URL]` on purpose and must not ship with it.

## Two markers, not one

The copy files use two markers, because there are two possible addresses:

- `[EDITOR-URL]` is where an "Open the editor" button points. Since D-032 the home has no such button (the editor is the screen), so only the on-hold use pages still use it. It never appears in this JSON.
- `[HOME-URL]` is the home page's own address. It is the `url` below and, at build time, the canonical link. With the landing and the editor on one screen the two addresses are probably the same; the marker stays split until the owner decides the address.

Neither is a real address. D-016 keeps the app's address out of marketing text until the maintainer says.

## The block

```json
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Blur My Image",
  "url": "[HOME-URL]",
  "description": "Blur or pixelate an image in your browser. Free, no account, no watermark. Image files you open, drop or paste never leave your device.",
  "applicationCategory": "MultimediaApplication",
  "browserRequirements": "Requires a browser with WebGL",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}
```

## What I chose and why

| Field | Choice | Why |
| --- | --- | --- |
| `name` | "Blur My Image" | The product's name in `src/i18n/messages/en.json` line 3. |
| `url` | `[HOME-URL]` | BMI-085 replaces it with the canonical home URL at build time, after the owner decides the address (seo.md decision 3). The page must not ship while the marker is in it. |
| `description` | Identical to the meta description (135 characters) | One wording to keep true. It contains the D-010 sentence unchanged. |
| `applicationCategory` | `MultimediaApplication` | It is a valid value on Google's list of application categories (checked by the reviewer). It also fits better than the alternatives, since the app edits images. |
| `browserRequirements` | "Requires a browser with WebGL" | True: the app shows "Your browser couldn't start WebGL, which this app needs to render effects." (`en.json` line 66). |
| `offers.price` | `"0"` | True: the README says "Free, no account, no watermark". It is not invented. Google's software app page requires `offers.price` and says to use `0` for an app available without payment (seo.md, read 2026-11-22). The markup makes the same statement as the page copy and nothing more: it does not say "forever". Change it together with the copy if that ever stops being true. |
| `offers.priceCurrency` | `"USD"` | A formality. Zero is zero in any currency, but the Offer type wants one. No price is charged in any currency. |

The page is not eligible for Google's software app rich result, because that needs `aggregateRating` or `review` and none exists. The block only describes the page.

## What is not in the block, and why

| Left out | Why |
| --- | --- |
| `operatingSystem` | "Any" would claim every system, phones included, and phones are not tested (audience.md, README). The page is silent on phones, so the markup is too. |
| `aggregateRating`, `review` | None exist. They are never made up. |
| `FAQPage` | Google's documentation says the FAQ rich result is no longer shown (seo.md, read 2026-11-22). The FAQ stays on the page as visible text. |
| `HowTo` | Google stopped showing it (seo.md, 2023 changes). The three steps stay on the page as text. |
| `license`, `sameAs`, `creator`, `screenshot` | Not needed for what the block is for. `screenshot` would need an asset that does not exist yet. Keep it minimal. |
| `featureList`, `softwareVersion` | The feature list would repeat the page and could drift from it. There is no released version to name (README: pre-release). |

## Checks before shipping

1. Replace `[HOME-URL]` with the canonical home URL, the same one used in `<link rel="canonical">`, after the owner decides the address.
2. Validate the JSON with a schema validator. I did not run one.
3. Confirm the inline block does not trip the CSP. A `ld+json` script is data and should not be blocked, but seo.md says this was not tested. The e2e suite runs under the real CSP, so add the page there.
4. Keep `description` equal to the meta description if either changes.
