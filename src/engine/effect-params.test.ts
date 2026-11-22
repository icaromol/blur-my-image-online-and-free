import { describe, expect, it } from "vitest";
import {
  gaussianRadius,
  motionKernelSize,
  motionVelocity,
  pixelateBlockSize,
} from "./effect-params";

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

describe("motionVelocity", () => {
  const size = { width: 2000, height: 1000 };

  it("points right at 0 degrees with a length of 10% of the shorter side at intensity 100", () => {
    const v = motionVelocity(
      { effect: "motion", intensity: 100, angle: 0 },
      size,
    );
    expect(v.x).toBeCloseTo(100);
    expect(v.y).toBeCloseTo(0);
  });

  it("turns counterclockwise on screen, so 90 degrees points up", () => {
    const v = motionVelocity(
      { effect: "motion", intensity: 100, angle: 90 },
      size,
    );
    expect(v.x).toBeCloseTo(0);
    expect(v.y).toBeCloseTo(-100);
  });
});

describe("gaussianRadius", () => {
  it("reaches 5% of the shorter side at intensity 100", () => {
    expect(
      gaussianRadius(
        { effect: "gaussian", intensity: 100, angle: 0 },
        { width: 3000, height: 2000 },
      ),
    ).toBe(100);
  });
});
