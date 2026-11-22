import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { pageHeaders } from "./security-headers";

interface VercelConfig {
  headers: { source: string; headers: { key: string; value: string }[] }[];
  functions: Record<string, { maxDuration?: number }>;
}

const vercel = JSON.parse(
  readFileSync(new URL("./vercel.json", import.meta.url), "utf8"),
) as VercelConfig;

describe("vercel.json", () => {
  it("sends exactly the shared page headers on every non-API path", () => {
    const pages = vercel.headers.find(
      (rule) => rule.source === "/((?!api/).*)",
    );
    const expected = Object.entries(pageHeaders).map(([key, value]) => ({
      key,
      value,
    }));
    // On failure, paste `expected` into vercel.json.
    expect(pages?.headers).toEqual(expected);
  });

  it("caps the image proxy at 15 seconds", () => {
    expect(vercel.functions["api/image.ts"]?.maxDuration).toBe(15);
  });
});

describe("page CSP", () => {
  const csp = pageHeaders["Content-Security-Policy"] ?? "";

  it("never allows eval or inline script", () => {
    expect(csp).not.toMatch(/'unsafe-eval'|'unsafe-inline'/);
  });

  it("denies framing, plugins and form posts", () => {
    for (const directive of [
      "frame-ancestors 'none'",
      "object-src 'none'",
      "form-action 'none'",
      "base-uri 'none'",
    ]) {
      expect(csp).toContain(directive);
    }
  });
});
