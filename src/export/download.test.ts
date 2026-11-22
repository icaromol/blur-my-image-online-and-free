import { describe, expect, it } from "vitest";
import { exportFileName } from "./download";

describe("exportFileName", () => {
  it("replaces the source extension", () => {
    expect(exportFileName("holiday.jpeg", "png")).toBe("holiday-blurred.png");
  });

  it("keeps dots inside the name", () => {
    expect(exportFileName("scan.2026.11.webp", "png")).toBe(
      "scan.2026.11-blurred.png",
    );
  });

  it("falls back to a default name", () => {
    expect(exportFileName("", "png")).toBe("image-blurred.png");
    expect(exportFileName(".png", "png")).toBe("image-blurred.png");
  });
});
