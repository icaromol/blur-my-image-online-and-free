import { describe, expect, it } from "vitest";
import { fitWithin } from "./decode";

describe("fitWithin", () => {
  it("keeps images that already fit", () => {
    expect(fitWithin({ width: 4000, height: 3000 }, 8192)).toEqual({
      width: 4000,
      height: 3000,
    });
  });

  it("scales the longer side down to the limit and keeps the aspect ratio", () => {
    expect(fitWithin({ width: 12000, height: 6000 }, 8192)).toEqual({
      width: 8192,
      height: 4096,
    });
    expect(fitWithin({ width: 3000, height: 20000 }, 4096)).toEqual({
      width: 614,
      height: 4096,
    });
  });

  it("never returns a zero dimension", () => {
    expect(fitWithin({ width: 100000, height: 1 }, 1000)).toEqual({
      width: 1000,
      height: 1,
    });
  });
});
