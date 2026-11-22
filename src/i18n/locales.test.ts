import { describe, expect, it } from "vitest";
import { resolveLocale } from "./locales";

describe("resolveLocale", () => {
  it("prefers a saved supported choice over the browser", () => {
    expect(resolveLocale("pt-BR", ["en-US"])).toBe("pt-BR");
    expect(resolveLocale("en", ["pt-BR"])).toBe("en");
  });

  it("ignores a saved value that isn't supported", () => {
    expect(resolveLocale("fr", ["pt-BR"])).toBe("pt-BR");
    expect(resolveLocale("toString", [])).toBe("en");
  });

  it("matches the browser language exactly", () => {
    expect(resolveLocale(null, ["pt-BR"])).toBe("pt-BR");
    expect(resolveLocale(null, ["pt-br"])).toBe("pt-BR");
    expect(resolveLocale(null, ["en"])).toBe("en");
  });

  it("maps pt and pt-PT to pt-BR", () => {
    expect(resolveLocale(null, ["pt"])).toBe("pt-BR");
    expect(resolveLocale(null, ["pt-PT"])).toBe("pt-BR");
  });

  it("maps English variants to en", () => {
    expect(resolveLocale(null, ["en-US"])).toBe("en");
    expect(resolveLocale(null, ["en-GB"])).toBe("en");
  });

  it("walks the browser list in order", () => {
    expect(resolveLocale(null, ["fr", "pt-PT", "en"])).toBe("pt-BR");
    expect(resolveLocale(null, ["en-US", "pt-BR"])).toBe("en");
  });

  it("falls back to en for unsupported languages or an empty list", () => {
    expect(resolveLocale(null, ["fr-FR", "de"])).toBe("en");
    expect(resolveLocale(undefined, [])).toBe("en");
  });
});
