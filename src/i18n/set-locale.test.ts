import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const STORAGE_KEY = "locale";

const page = { documentElement: { lang: "en" }, title: "Blur My Image" };
const saved = new Map<string, string>();
const storage = {
  getItem: (key: string) => saved.get(key) ?? null,
  setItem: (key: string, value: string) => void saved.set(key, value),
};

function deferred() {
  let resolve!: () => void;
  const promise = new Promise<void>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

// Loads a fresh copy of the module with the pt-BR file mocked by `load`. The page and storage
// stubs go in afterwards because vue-i18n inspects the real environment while it loads.
async function importWithPortuguese(load: () => Promise<unknown>) {
  vi.resetModules();
  vi.doMock("./messages/pt-BR.json", load);
  const module = await import("./index");
  vi.stubGlobal("document", page);
  vi.stubGlobal("localStorage", storage);
  return module;
}

const portuguese = { default: { app: { title: "Borre Minha Imagem" } } };

beforeEach(() => {
  page.documentElement.lang = "en";
  page.title = "Blur My Image";
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.doUnmock("./messages/pt-BR.json");
  saved.clear();
});

describe("a locale file that fails to load", () => {
  const failing = async () => {
    throw new Error("Failed to fetch dynamically imported module");
  };

  it("keeps the current locale, language and title, and setLocale resolves", async () => {
    const { i18n, setLocale } = await importWithPortuguese(failing);

    await expect(setLocale("pt-BR")).resolves.toBe(false);

    expect(i18n.global.locale.value).toBe("en");
    expect(page.documentElement.lang).not.toBe("pt-BR");
    expect(page.documentElement.lang).toBe("en");
    expect(page.title).toBe("Blur My Image");
  });

  it("isn't saved as the user's choice", async () => {
    const { chooseLocale, i18n } = await importWithPortuguese(failing);

    await expect(chooseLocale("pt-BR")).resolves.toBe(false);

    expect(storage.getItem(STORAGE_KEY)).toBeNull();
    expect(i18n.global.locale.value).toBe("en");
  });
});

describe("choosing a language", () => {
  it("applies and saves a locale that loads", async () => {
    const { chooseLocale, i18n } = await importWithPortuguese(
      async () => portuguese,
    );

    await expect(chooseLocale("pt-BR")).resolves.toBe(true);

    expect(i18n.global.locale.value).toBe("pt-BR");
    expect(page.documentElement.lang).toBe("pt-BR");
    expect(page.title).toBe("Borre Minha Imagem");
    expect(storage.getItem(STORAGE_KEY)).toBe("pt-BR");
  });

  it("lets the last choice win when an earlier, slower one finishes after it", async () => {
    const gate = deferred();
    const { chooseLocale, i18n } = await importWithPortuguese(async () => {
      await gate.promise;
      return portuguese;
    });

    const slow = chooseLocale("pt-BR");
    await expect(chooseLocale("en")).resolves.toBe(true);
    gate.resolve();

    await expect(slow).resolves.toBe(false);
    expect(i18n.global.locale.value).toBe("en");
    expect(page.documentElement.lang).toBe("en");
    expect(page.title).toBe("Blur My Image");
    expect(storage.getItem(STORAGE_KEY)).toBe("en");
  });
});
