// Fails when the production build contains analytics or tracking code.
// The privacy promise is "no analytics, no tracking pixels"; this keeps a dependency from breaking it silently.
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";

const FORBIDDEN = [
  "google-analytics",
  "googletagmanager",
  "googlesyndication",
  "doubleclick",
  "analytics.google",
  "plausible",
  "segment.com",
  "segment.io",
  "cdn.segment",
  "mixpanel",
  "posthog",
  "hotjar",
  "fullstory",
  "heap-analytics",
  "heapanalytics",
  "amplitude.com",
  "matomo",
  "clarity.ms",
  "sentry.io",
  "datadoghq",
  "newrelic",
  "_vercel/insights",
  "_vercel/speed-insights",
  "vercel-scripts.com",
  "sendBeacon",
];

function* files(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) yield* files(path);
    else yield path;
  }
}

let scanned = 0;
const hits = [];
try {
  for (const path of files(DIST)) {
    const text = readFileSync(path).toString("latin1");
    scanned++;
    for (const needle of FORBIDDEN) {
      if (text.toLowerCase().includes(needle.toLowerCase())) {
        hits.push(`${path}: ${needle}`);
      }
    }
  }
} catch (error) {
  console.error(
    `Cannot read ${DIST}/ (run "pnpm build" first): ${error.message}`,
  );
  process.exit(2);
}

if (scanned === 0) {
  console.error(`${DIST}/ is empty (run "pnpm build" first).`);
  process.exit(2);
}
if (hits.length > 0) {
  console.error(
    `Analytics or tracking references found in the build:\n${hits.join("\n")}`,
  );
  process.exit(1);
}
console.log(`Dist check passed: ${scanned} files, no analytics references.`);
