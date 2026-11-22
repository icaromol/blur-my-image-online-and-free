import { readFile } from "node:fs/promises";
import { expect, type Page, test } from "@playwright/test";
import { download } from "./helpers";

const SENTINEL = "BMI-METADATA-SENTINEL-7f3a";

// TIFF structure for an EXIF block: IFD0 with ImageDescription (the sentinel) and a pointer
// to a GPS IFD with GPSLatitudeRef and GPSLatitude. Little-endian.
function exifSegment(): Buffer {
  const description = Buffer.from(`${SENTINEL}\0`, "latin1");
  const ifd0 = 8;
  const gpsIfd = ifd0 + 2 + 2 * 12 + 4;
  const latitude = gpsIfd + 2 + 2 * 12 + 4;
  const descriptionAt = latitude + 24;
  const tiff = Buffer.alloc(descriptionAt + description.length);
  tiff.write("II", 0, "latin1");
  tiff.writeUInt16LE(42, 2);
  tiff.writeUInt32LE(ifd0, 4);

  const entry = (
    at: number,
    tag: number,
    type: number,
    count: number,
    value: number,
  ) => {
    tiff.writeUInt16LE(tag, at);
    tiff.writeUInt16LE(type, at + 2);
    tiff.writeUInt32LE(count, at + 4);
    tiff.writeUInt32LE(value, at + 8);
  };
  tiff.writeUInt16LE(2, ifd0);
  entry(ifd0 + 2, 0x010e, 2, description.length, descriptionAt); // ImageDescription, ASCII
  entry(ifd0 + 14, 0x8825, 4, 1, gpsIfd); // GPSInfo IFD pointer, LONG
  tiff.writeUInt32LE(0, ifd0 + 26);

  tiff.writeUInt16LE(2, gpsIfd);
  entry(gpsIfd + 2, 0x0001, 2, 2, 0); // GPSLatitudeRef "N", inline
  tiff.write("N\0", gpsIfd + 2 + 8, "latin1");
  entry(gpsIfd + 14, 0x0002, 5, 3, latitude); // GPSLatitude, 3 RATIONALs
  tiff.writeUInt32LE(0, gpsIfd + 26);
  [38, 1, 53, 1, 1234, 100].forEach((n, i) => {
    tiff.writeUInt32LE(n, latitude + i * 4);
  });
  description.copy(tiff, descriptionAt);

  return app1(Buffer.concat([Buffer.from("Exif\0\0", "latin1"), tiff]));
}

function xmpSegment(): Buffer {
  const xml = `<x:xmpmeta xmlns:x="adobe:ns:meta/"><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"><rdf:Description xmlns:dc="http://purl.org/dc/elements/1.1/" dc:description="${SENTINEL}"/></rdf:RDF></x:xmpmeta>`;
  return app1(Buffer.from(`http://ns.adobe.com/xap/1.0/\0${xml}`, "latin1"));
}

function app1(payload: Buffer): Buffer {
  const header = Buffer.from([0xff, 0xe1, 0, 0]);
  header.writeUInt16BE(payload.length + 2, 2);
  return Buffer.concat([header, payload]);
}

// A plain JPEG from the browser, with EXIF (including GPS) and XMP inserted after its APP0.
async function jpegWithMetadata(page: Page): Promise<Buffer> {
  const base64 = await page.evaluate(async () => {
    const canvas = new OffscreenCanvas(64, 48);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("No 2D context");
    ctx.fillStyle = "#3a6";
    ctx.fillRect(0, 0, 64, 48);
    const bytes = new Uint8Array(
      await (await canvas.convertToBlob({ type: "image/jpeg" })).arrayBuffer(),
    );
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  });
  const jpeg = Buffer.from(base64, "base64");
  const app0Length =
    jpeg[2] === 0xff && jpeg[3] === 0xe0 ? jpeg.readUInt16BE(4) + 2 : 0;
  const head = jpeg.subarray(0, 2 + app0Length);
  return Buffer.concat([
    head,
    exifSegment(),
    xmpSegment(),
    jpeg.subarray(head.length),
  ]);
}

function pngChunkTypes(png: Buffer): string[] {
  const types: string[] = [];
  for (let at = 8; at + 8 <= png.length; ) {
    const length = png.readUInt32BE(at);
    types.push(png.toString("latin1", at + 4, at + 8));
    at += 12 + length;
  }
  return types;
}

function webpChunkTypes(webp: Buffer): string[] {
  const types: string[] = [];
  for (let at = 12; at + 8 <= webp.length; ) {
    const length = webp.readUInt32LE(at + 4);
    types.push(webp.toString("latin1", at, at + 4));
    at += 8 + length + (length % 2);
  }
  return types;
}

function expectNoMetadata(file: Buffer) {
  expect(file.includes(SENTINEL)).toBe(false);
  expect(file.includes("Exif\0\0")).toBe(false);
  expect(file.includes("http://ns.adobe.com/xap")).toBe(false);
}

async function openFixture(page: Page) {
  const fixture = await jpegWithMetadata(page);
  expect(fixture.includes(SENTINEL)).toBe(true);
  await page.getByLabel("Image file").setInputFiles({
    name: "photo.jpg",
    mimeType: "image/jpeg",
    buffer: fixture,
  });
  await expect(
    page.getByRole("button", { name: "Blur entire image" }),
  ).toBeEnabled();
}

async function exportAs(page: Page, format: string): Promise<Buffer> {
  await page.getByLabel("Format").selectOption(format);
  return readFile(await (await download(page)).path());
}

test("exports drop EXIF, GPS and XMP metadata from the source photo", async ({
  page,
}) => {
  await page.goto("/");
  await openFixture(page);

  const png = await exportAs(page, "png");
  expectNoMetadata(png);
  expect(
    pngChunkTypes(png).filter((t) =>
      ["eXIf", "tEXt", "iTXt", "zTXt"].includes(t),
    ),
  ).toEqual([]);

  const jpg = await exportAs(page, "jpg");
  expectNoMetadata(jpg);

  const webp = await exportAs(page, "webp");
  expectNoMetadata(webp);
  expect(
    webpChunkTypes(webp).filter((t) => t === "EXIF" || t === "XMP "),
  ).toEqual([]);
});

test("the WebAssembly WebP encoder writes no metadata either", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.toBlob;
    HTMLCanvasElement.prototype.toBlob = function (callback, type, quality) {
      return original.call(
        this,
        callback,
        type === "image/webp" ? "image/png" : type,
        quality,
      );
    };
  });
  await page.goto("/");
  await openFixture(page);
  const webp = await exportAs(page, "webp");
  expect(webp.toString("latin1", 8, 12)).toBe("WEBP");
  expectNoMetadata(webp);
  expect(
    webpChunkTypes(webp).filter((t) => t === "EXIF" || t === "XMP "),
  ).toEqual([]);
});
