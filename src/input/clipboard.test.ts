import { describe, expect, it } from "vitest";
import { readClipboard } from "./clipboard";

function clipboard(files: File[], text = "") {
  return { files: files as unknown as FileList, getData: () => text };
}

describe("readClipboard", () => {
  it("prefers an image file", () => {
    const image = new File([""], "shot.png", { type: "image/png" });
    expect(
      readClipboard(clipboard([image], "https://example.com/a.png")),
    ).toEqual({ kind: "file", file: image });
  });

  it("ignores files that aren't images", () => {
    const text = new File([""], "notes.txt", { type: "text/plain" });
    expect(readClipboard(clipboard([text]))).toBeNull();
  });

  it("reads an http or https link from text", () => {
    const result = readClipboard(
      clipboard([], "  https://example.com/cat.jpg \n"),
    );
    expect(result?.kind === "url" && result.url.href).toBe(
      "https://example.com/cat.jpg",
    );
  });

  it("ignores text that isn't a link", () => {
    expect(readClipboard(clipboard([], "hello world"))).toBeNull();
    expect(readClipboard(clipboard([], "javascript:alert(1)"))).toBeNull();
  });
});
