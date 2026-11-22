// Single source for the page's security headers. Used by `vite preview` (so Playwright runs
// under the real CSP), the Node entry for Docker and, through security-headers.test.ts,
// kept in sync with vercel.json. The /api/image proxy sets its own stricter headers.

const contentSecurityPolicy = [
  "default-src 'none'",
  // WebAssembly for the @jsquash/webp fallback; PixiJS runs without eval via pixi.js/unsafe-eval.
  "script-src 'self' 'wasm-unsafe-eval'",
  "style-src 'self'",
  "img-src 'self' blob: data:",
  // Direct CORS loads of https image URLs; anything else goes through the same-origin proxy.
  "connect-src 'self' https:",
  "font-src 'self'",
  "worker-src 'self'",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'none'",
  "frame-ancestors 'none'",
].join("; ");

const deniedFeatures = [
  "accelerometer",
  "autoplay",
  "camera",
  "clipboard-read",
  "display-capture",
  "geolocation",
  "gyroscope",
  "hid",
  "magnetometer",
  "microphone",
  "midi",
  "payment",
  "publickey-credentials-get",
  "serial",
  "usb",
  "xr-spatial-tracking",
];

const permissionsPolicy = [
  ...deniedFeatures.map((feature) => `${feature}=()`),
  "clipboard-write=(self)",
  "fullscreen=(self)",
].join(", ");

export const pageHeaders: Readonly<Record<string, string>> = {
  "Content-Security-Policy": contentSecurityPolicy,
  "Permissions-Policy": permissionsPolicy,
  "Referrer-Policy": "no-referrer",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  // No includeSubDomains: not every subdomain of a future custom domain is known to be HTTPS.
  "Strict-Transport-Security": "max-age=63072000",
};
