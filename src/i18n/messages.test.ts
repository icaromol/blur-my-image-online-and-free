import { describe, expect, it } from "vitest";
import proxySource from "../../server/proxy/app.ts?raw";
import { effectIds } from "../engine/effects";
import { errorKey } from "./index";
import { localeIds } from "./locales";
import en from "./messages/en.json";

type Tree = { [key: string]: string | Tree };

const files = import.meta.glob<Tree>("./messages/*.json", {
  eager: true,
  import: "default",
});

function flatten(tree: Tree, prefix = ""): Map<string, string> {
  const result = new Map<string, string>();
  for (const [key, value] of Object.entries(tree)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") result.set(path, value);
    else for (const [p, v] of flatten(value, path)) result.set(p, v);
  }
  return result;
}

const source = flatten(en);

describe("message files", () => {
  it("has one file per supported locale", () => {
    expect(Object.keys(files).sort()).toEqual(
      localeIds.map((id) => `./messages/${id}.json`).sort(),
    );
  });

  for (const id of localeIds) {
    describe(id, () => {
      const messages = flatten(files[`./messages/${id}.json`]);

      it("has every key en.json has", () => {
        const missing = [...source.keys()].filter((key) => !messages.has(key));
        expect(missing).toEqual([]);
      });

      it("has no key en.json doesn't have", () => {
        const extra = [...messages.keys()].filter((key) => !source.has(key));
        expect(extra).toEqual([]);
      });

      it("has no empty string", () => {
        const empty = [...messages].filter(([, v]) => v.trim() === "");
        expect(empty).toEqual([]);
      });
    });
  }

  it("has a label for every effect", () => {
    const missing = effectIds.filter(
      (id) => !source.has(`effects.${id}.label`),
    );
    expect(missing).toEqual([]);
  });
});

describe("error codes", () => {
  const proxyCodes = [
    ...new Set(
      [
        ...proxySource.matchAll(/ProxyError\(\s*\d+,\s*"(\w+)"/g),
        ...proxySource.matchAll(/error:\s*"(\w+)"/g),
      ].map((match) => match[1]),
    ),
  ];

  it("finds the proxy's codes in its source", () => {
    expect(proxyCodes).toContain("forbidden_origin");
    expect(proxyCodes).toContain("too_large");
    expect(proxyCodes.length).toBeGreaterThanOrEqual(10);
  });

  it("has an errors.* key for every proxy code", () => {
    const missing = proxyCodes.filter((code) => !source.has(`errors.${code}`));
    expect(missing).toEqual([]);
  });

  it("maps an unknown code to errors.unknown", () => {
    expect(errorKey("no_such_code")).toBe("errors.unknown");
    expect(errorKey("constructor")).toBe("errors.unknown");
    expect(errorKey("too_large")).toBe("errors.too_large");
  });
});
