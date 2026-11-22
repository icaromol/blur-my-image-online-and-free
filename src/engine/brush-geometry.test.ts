import { describe, expect, it } from "vitest";
import { brushDiameter, imageScale, toImagePoint } from "./brush-geometry";

const box = { left: 100, top: 50, width: 500 };

describe("brush geometry", () => {
  it("scales by image width over displayed width", () => {
    expect(imageScale(2000, box)).toBe(4);
    expect(imageScale(250, box)).toBe(0.5);
  });

  it("maps a pointer position to source-image pixels", () => {
    expect(toImagePoint(100, 50, 2000, box)).toEqual({ x: 0, y: 0 });
    expect(toImagePoint(350, 100, 2000, box)).toEqual({ x: 1000, y: 200 });
  });

  it("keeps the on-screen brush size when the image is shown smaller", () => {
    expect(brushDiameter(40, 2000, box)).toBe(160);
  });

  it("falls back to 1:1 before the canvas has a size", () => {
    expect(imageScale(2000, { left: 0, top: 0, width: 0 })).toBe(1);
  });
});
