import { describe, expect, it } from "vitest";
import { motionKernelSize, pixelateBlockSize, sameSettings } from "./effects";

describe("motionKernelSize", () => {
  it("is odd and at least 5", () => {
    expect(motionKernelSize(0)).toBe(5);
    expect(motionKernelSize(12)).toBe(13);
    expect(motionKernelSize(13)).toBe(13);
  });

  it("caps the number of samples", () => {
    expect(motionKernelSize(5000)).toBe(127);
  });
});

describe("pixelateBlockSize", () => {
  it("never goes below 2 px blocks", () => {
    expect(
      pixelateBlockSize(
        { effect: "pixelate", intensity: 1, angle: 0 },
        { width: 100, height: 100 },
      ),
    ).toBe(2);
  });

  it("scales with the shorter side", () => {
    expect(
      pixelateBlockSize(
        { effect: "pixelate", intensity: 100, angle: 0 },
        { width: 2000, height: 1000 },
      ),
    ).toBe(80);
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
});
