export type ProxyConfig = {
  maxBytes: number;
  maxRedirects: number;
  timeoutMs: number;
  allowedOrigins: string[];
};

// Just under Vercel's 4.5 MB function response limit, which also counts headers.
const DEFAULT_MAX_BYTES = 4_400_000;

function positiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`Expected a positive integer, got "${value}"`);
  }
  return parsed;
}

function parseOrigins(value: string | undefined): string[] {
  const origins = (value ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  for (const origin of origins) {
    if (!URL.canParse(origin) || new URL(origin).origin !== origin) {
      throw new Error(
        `ALLOWED_ORIGINS entry is not a bare origin: "${origin}"`,
      );
    }
  }
  return origins;
}

export function loadConfig(
  env: Record<string, string | undefined>,
): ProxyConfig {
  return {
    maxBytes: positiveInt(env.MAX_BYTES, DEFAULT_MAX_BYTES),
    maxRedirects: 3,
    timeoutMs: positiveInt(env.PROXY_TIMEOUT_MS, 10_000),
    allowedOrigins: parseOrigins(env.ALLOWED_ORIGINS),
  };
}
