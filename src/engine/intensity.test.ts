import { describe, expect, it } from "vitest";
import { MAX_RADIUS_FRACTION, radiusFor } from "./intensity";

describe("radiusFor", () => {
  it("scales with the shorter side of the image", () => {
    expect(radiusFor(100, { width: 6000, height: 4000 })).toBe(
      4000 * MAX_RADIUS_FRACTION,
    );
    expect(radiusFor(100, { width: 600, height: 400 })).toBe(
      400 * MAX_RADIUS_FRACTION,
    );
  });

  it("looks the same relative to image size at any resolution", () => {
    const small = radiusFor(40, { width: 600, height: 400 });
    const large = radiusFor(40, { width: 6000, height: 4000 });
    expect(large / small).toBeCloseTo(10);
  });

  it("clamps intensity to the 1 to 100 range", () => {
    const size = { width: 1000, height: 1000 };
    expect(radiusFor(0, size)).toBe(radiusFor(1, size));
    expect(radiusFor(250, size)).toBe(radiusFor(100, size));
  });
});
