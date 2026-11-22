import { describe, expect, it } from "vitest";
import { loadConfig } from "./config.js";

describe("loadConfig ALLOWED_ORIGINS", () => {
  it("parses a comma-separated list of bare origins", () => {
    expect(
      loadConfig({
        ALLOWED_ORIGINS: "https://a.example, http://localhost:5173",
      }).allowedOrigins,
    ).toEqual(["https://a.example", "http://localhost:5173"]);
  });

  it.each([
    "null",
    "https://a.example/path",
    "https://a.example/",
    "a.example",
    "*",
    "https://a.example,*",
  ])("throws for %j", (entry) => {
    expect(() => loadConfig({ ALLOWED_ORIGINS: entry })).toThrow();
  });

  it("ignores empty entries instead of rejecting them", () => {
    expect(
      loadConfig({ ALLOWED_ORIGINS: "https://a.example," }).allowedOrigins,
    ).toEqual(["https://a.example"]);
    expect(loadConfig({ ALLOWED_ORIGINS: "," }).allowedOrigins).toEqual([]);
  });
});
