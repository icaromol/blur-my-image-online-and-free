import { afterEach, describe, expect, it, vi } from "vitest";
import initScript from "../../public/theme-init.js?raw";
import { isDark, parseTheme, savedTheme, themes } from "./theme";

afterEach(() => vi.unstubAllGlobals());

describe("parseTheme", () => {
  it("accepts the three themes and falls back to system", () => {
    for (const theme of themes) expect(parseTheme(theme)).toBe(theme);
    expect(parseTheme(null)).toBe("system");
    expect(parseTheme("")).toBe("system");
    expect(parseTheme("sepia")).toBe("system");
    expect(parseTheme("Dark")).toBe("system");
  });
});

describe("savedTheme", () => {
  it("reads the stored choice", () => {
    vi.stubGlobal("localStorage", { getItem: () => "dark" });
    expect(savedTheme()).toBe("dark");
  });

  it("uses system when storage throws", () => {
    vi.stubGlobal("localStorage", {
      getItem: () => {
        throw new DOMException("denied", "SecurityError");
      },
    });
    expect(savedTheme()).toBe("system");
  });
});

describe("the script that runs before the first paint", () => {
  function run(stored: string | null | "throws", systemPrefersDark: boolean) {
    const toggle = vi.fn();
    const run = new Function(
      "localStorage",
      "matchMedia",
      "document",
      initScript,
    );
    run(
      {
        getItem: () => {
          if (stored === "throws") throw new DOMException("denied");
          return stored;
        },
      },
      () => ({ matches: systemPrefersDark }),
      { documentElement: { classList: { toggle } } },
    );
    return toggle.mock.calls[0];
  }

  const cases: (string | null | "throws")[] = [
    ...themes,
    null,
    "sepia",
    "throws",
  ];
  for (const stored of cases) {
    for (const systemPrefersDark of [false, true]) {
      it(`agrees with isDark for ${stored} and a ${systemPrefersDark ? "dark" : "light"} system`, () => {
        const theme = stored === "throws" ? "system" : parseTheme(stored);
        expect(run(stored, systemPrefersDark)).toEqual([
          "dark",
          isDark(theme, systemPrefersDark),
        ]);
      });
    }
  }
});
