import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  decodeImage: vi.fn(),
  fetchImage: vi.fn(),
  encodeImage: vi.fn(),
  downloadBlob: vi.fn(),
  renderer: {
    maxTextureSize: 4096,
    canvas: new EventTarget(),
    contextLost: false,
    setImage: vi.fn(),
    render: vi.fn(),
    toCanvas: vi.fn(() => ({})),
    destroy: vi.fn(),
  },
}));

vi.mock("../engine/load-renderer", () => ({
  loadRenderer: async () => mocks.renderer,
}));
vi.mock("../input/decode", () => ({ decodeImage: mocks.decodeImage }));
vi.mock("../input/url", () => ({ fetchImage: mocks.fetchImage }));
vi.mock("../export/encode", async (original) => ({
  ...(await original<typeof import("../export/encode")>()),
  encodeImage: mocks.encodeImage,
}));
vi.mock("../export/download", async (original) => ({
  ...(await original<typeof import("../export/download")>()),
  downloadBlob: mocks.downloadBlob,
}));

import { useEditor } from "./editor";

function deferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

function decoded() {
  return { bitmap: { width: 10, height: 10, close: vi.fn() } };
}

const blob = new Blob(["x"]);

beforeEach(() => {
  vi.clearAllMocks();
  mocks.renderer.contextLost = false;
  mocks.renderer.canvas = new EventTarget();
  vi.stubGlobal("requestAnimationFrame", () => 0);
  vi.stubGlobal("cancelAnimationFrame", () => {});
});

describe("opening images", () => {
  it("drops a slower, older load that finishes after a newer one", async () => {
    const slow = deferred<ReturnType<typeof decoded>>();
    const older = decoded();
    const newer = decoded();
    mocks.decodeImage
      .mockImplementationOnce(() => slow.promise)
      .mockResolvedValueOnce(newer);
    const editor = useEditor();

    const first = editor.open(blob, "older.png");
    await vi.waitFor(() => expect(mocks.decodeImage).toHaveBeenCalledOnce());
    await editor.open(blob, "newer.png");
    slow.resolve(older);
    await first;

    expect(editor.fileName.value).toBe("newer.png");
    expect(mocks.renderer.setImage).toHaveBeenCalledOnce();
    expect(mocks.renderer.setImage).toHaveBeenCalledWith(newer.bitmap);
    expect(older.bitmap.close).toHaveBeenCalledOnce();
  });

  it("drops an older load that fails after a newer one succeeded", async () => {
    const slow = deferred<ReturnType<typeof decoded>>();
    mocks.decodeImage
      .mockImplementationOnce(() => slow.promise)
      .mockResolvedValueOnce(decoded());
    const editor = useEditor();

    const first = editor.open(blob, "older.png");
    await vi.waitFor(() => expect(mocks.decodeImage).toHaveBeenCalledOnce());
    await editor.open(blob, "newer.png");
    slow.reject(new Error("boom"));
    await first;

    expect(editor.error.value).toBe("");
    expect(editor.fileName.value).toBe("newer.png");
  });

  it("drops a link whose fetch finishes after a file was opened", async () => {
    const fetching = deferred<Blob>();
    mocks.fetchImage.mockImplementationOnce(() => fetching.promise);
    mocks.decodeImage.mockResolvedValue(decoded());
    const editor = useEditor();

    const link = editor.openUrl(new URL("https://images.test/slow.png"));
    expect(editor.loading.value).toBe(true);
    await editor.open(blob, "file.png");
    expect(editor.loading.value).toBe(false);
    fetching.resolve(blob);
    await link;

    expect(editor.fileName.value).toBe("file.png");
    expect(mocks.renderer.setImage).toHaveBeenCalledOnce();
    expect(editor.loading.value).toBe(false);
  });

  it("keeps the spinner for the newest link when an older link finishes", async () => {
    const olderFetch = deferred<Blob>();
    const newerFetch = deferred<Blob>();
    mocks.fetchImage
      .mockImplementationOnce(() => olderFetch.promise)
      .mockImplementationOnce(() => newerFetch.promise);
    mocks.decodeImage.mockResolvedValue(decoded());
    const editor = useEditor();

    const older = editor.openUrl(new URL("https://images.test/older.png"));
    const newer = editor.openUrl(new URL("https://images.test/newer.png"));
    olderFetch.resolve(blob);
    await older;
    expect(editor.loading.value).toBe(true);
    expect(editor.fileName.value).toBe("");

    newerFetch.resolve(blob);
    await newer;
    expect(editor.loading.value).toBe(false);
    expect(editor.fileName.value).toBe("newer.png");
  });
});

describe("download", () => {
  it("names the file and picks the format as they were when it started", async () => {
    mocks.decodeImage.mockResolvedValue(decoded());
    const encoding = deferred<Blob>();
    mocks.encodeImage.mockImplementationOnce(() => encoding.promise);
    const editor = useEditor();
    await editor.open(blob, "first.png");

    const saving = editor.download();
    editor.format.value = "webp";
    await editor.open(blob, "second.png");
    const encoded = new Blob(["encoded"]);
    encoding.resolve(encoded);
    await saving;

    expect(mocks.encodeImage).toHaveBeenCalledWith(expect.anything(), "png");
    expect(mocks.downloadBlob).toHaveBeenCalledWith(
      encoded,
      "first-blurred.png",
    );
  });

  it("refuses while the WebGL context is lost and downloads again after", async () => {
    mocks.decodeImage.mockResolvedValue(decoded());
    mocks.encodeImage.mockResolvedValue(new Blob(["encoded"]));
    const editor = useEditor();
    await editor.open(blob, "photo.png");

    mocks.renderer.contextLost = true;
    await editor.download();
    expect(editor.error.value).toBe("webgl_context_lost");
    expect(mocks.renderer.toCanvas).not.toHaveBeenCalled();
    expect(mocks.downloadBlob).not.toHaveBeenCalled();

    mocks.renderer.contextLost = false;
    await editor.download();
    expect(editor.error.value).toBe("");
    expect(mocks.downloadBlob).toHaveBeenCalledOnce();
  });
});

describe("WebGL context loss", () => {
  it("refuses to open a file while the context is lost and keeps the open image", async () => {
    const original = { width: 12000, height: 6000 };
    mocks.decodeImage.mockResolvedValue({
      ...decoded(),
      originalSize: original,
    });
    const editor = useEditor();
    await editor.open(blob, "first.png");
    const notice = {
      original,
      scaled: { width: 10, height: 10 },
      max: 4096,
    };
    expect(editor.notice.value).toEqual(notice);

    mocks.renderer.contextLost = true;
    await editor.open(blob, "second.png");

    expect(editor.error.value).toBe("webgl_context_lost");
    expect(editor.fileName.value).toBe("first.png");
    expect(editor.notice.value).toEqual(notice);
    expect(mocks.decodeImage).toHaveBeenCalledOnce();
    expect(mocks.renderer.setImage).toHaveBeenCalledOnce();
  });

  it("refuses a link while the context is lost without fetching it", async () => {
    mocks.decodeImage.mockResolvedValue(decoded());
    const editor = useEditor();
    await editor.open(blob, "first.png");

    mocks.renderer.contextLost = true;
    await editor.openUrl(new URL("https://images.test/other.png"));

    expect(editor.error.value).toBe("webgl_context_lost");
    expect(editor.fileName.value).toBe("first.png");
    expect(editor.loading.value).toBe(false);
    expect(mocks.fetchImage).not.toHaveBeenCalled();
  });

  it("shows an error when the context is lost and clears it when restored", async () => {
    mocks.decodeImage.mockResolvedValue(decoded());
    const editor = useEditor();
    await editor.open(blob, "photo.png");

    mocks.renderer.canvas.dispatchEvent(new Event("webglcontextlost"));
    expect(editor.error.value).toBe("webgl_context_lost");

    mocks.renderer.canvas.dispatchEvent(new Event("webglcontextrestored"));
    expect(editor.error.value).toBe("");
  });

  it("keeps an unrelated error when the context is restored", async () => {
    mocks.decodeImage.mockResolvedValue(decoded());
    const editor = useEditor();
    await editor.open(blob, "photo.png");

    editor.error.value = "decode_failed";
    mocks.renderer.canvas.dispatchEvent(new Event("webglcontextrestored"));
    expect(editor.error.value).toBe("decode_failed");
  });
});
