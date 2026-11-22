import { afterEach, describe, expect, it, vi } from "vitest";
import { decodeImage, fitWithin } from "./decode";

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

describe("decodeImage", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("turns a failed resize into decode_failed and releases the source bitmap", async () => {
    const source = { width: 12000, height: 6000, close: vi.fn() };
    vi.stubGlobal(
      "createImageBitmap",
      vi
        .fn()
        .mockResolvedValueOnce(source)
        .mockRejectedValueOnce(new Error("out of memory")),
    );

    await expect(decodeImage(new Blob(["x"]), 8192)).rejects.toMatchObject({
      code: "decode_failed",
    });
    expect(source.close).toHaveBeenCalledOnce();
  });

  it("returns the resized bitmap and releases the source bitmap", async () => {
    const source = { width: 12000, height: 6000, close: vi.fn() };
    const resized = { width: 8192, height: 4096, close: vi.fn() };
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn().mockResolvedValueOnce(source).mockResolvedValueOnce(resized),
    );

    await expect(decodeImage(new Blob(["x"]), 8192)).resolves.toEqual({
      bitmap: resized,
      originalSize: { width: 12000, height: 6000 },
    });
    expect(source.close).toHaveBeenCalledOnce();
    expect(resized.close).not.toHaveBeenCalled();
  });
});
