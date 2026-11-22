import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./messages/pt-BR.json", () => {
  throw new Error("Failed to fetch dynamically imported module");
});

import { chooseLocale, i18n, setLocale } from "./index";

const STORAGE_KEY = "locale";

const page = { documentElement: { lang: "en" }, title: "Blur My Image" };
const saved = new Map<string, string>();
const storage = {
  getItem: (key: string) => saved.get(key) ?? null,
  setItem: (key: string, value: string) => void saved.set(key, value),
};

beforeEach(() => {
  vi.stubGlobal("document", page);
  vi.stubGlobal("localStorage", storage);
});

afterEach(() => {
  vi.unstubAllGlobals();
  saved.clear();
});

describe("a locale file that fails to load", () => {
  it("keeps the current locale, language and title, and setLocale resolves", async () => {
    await expect(setLocale("pt-BR")).resolves.toBe(false);

    expect(i18n.global.locale.value).toBe("en");
    expect(page.documentElement.lang).not.toBe("pt-BR");
    expect(page.documentElement.lang).toBe("en");
    expect(page.title).toBe("Blur My Image");
  });

  it("isn't saved as the user's choice", async () => {
    await expect(chooseLocale("pt-BR")).resolves.toBe(false);

    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(i18n.global.locale.value).toBe("en");
  });
});
