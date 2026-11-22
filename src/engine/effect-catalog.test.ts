import { describe, expect, it } from "vitest";
import { effectIds, sameSettings } from "./effect-catalog";

describe("effectIds", () => {
  it("lists the three v1 effects", () => {
    expect(effectIds).toEqual(["gaussian", "pixelate", "motion"]);
  });
});

describe("sameSettings", () => {
  it("compares the angle only for motion", () => {
    expect(
      sameSettings(
        { effect: "motion", intensity: 5, angle: 0 },
        { effect: "motion", intensity: 5, angle: 1 },
      ),
    ).toBe(false);
    expect(
      sameSettings(
        { effect: "gaussian", intensity: 5, angle: 0 },
        { effect: "gaussian", intensity: 5, angle: 1 },
      ),
    ).toBe(true);
  });

  it("treats a different effect or intensity as a new setting", () => {
    const base = { effect: "gaussian", intensity: 5, angle: 0 } as const;
    expect(sameSettings(base, { ...base, intensity: 6 })).toBe(false);
    expect(sameSettings(base, { ...base, effect: "pixelate" })).toBe(false);
  });
});
