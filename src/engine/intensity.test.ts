import { describe, expect, it } from "vitest";
import { scaledLength } from "./intensity";

describe("scaledLength", () => {
  it("scales with the shorter side of the image", () => {
    expect(scaledLength(100, { width: 6000, height: 4000 }, 0.05)).toBe(200);
    expect(scaledLength(100, { width: 400, height: 600 }, 0.05)).toBe(20);
  });

  it("looks the same relative to image size at any resolution", () => {
    const small = scaledLength(40, { width: 600, height: 400 }, 0.05);
    const large = scaledLength(40, { width: 6000, height: 4000 }, 0.05);
    expect(large / small).toBeCloseTo(10);
  });

  it("clamps intensity to the 1 to 100 range", () => {
    const size = { width: 1000, height: 1000 };
    expect(scaledLength(0, size, 0.05)).toBe(scaledLength(1, size, 0.05));
    expect(scaledLength(250, size, 0.05)).toBe(scaledLength(100, size, 0.05));
  });
});
