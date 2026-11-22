import { parseImageUrl } from "./url";

export type ClipboardInput =
  | { kind: "file"; file: File }
  | { kind: "url"; url: URL };

type ClipboardData = Pick<DataTransfer, "files" | "getData">;

export function readClipboard(data: ClipboardData): ClipboardInput | null {
  const file = Array.from(data.files).find((f) => f.type.startsWith("image/"));
  if (file) return { kind: "file", file };
  const url = parseImageUrl(data.getData("text/plain"));
  return url ? { kind: "url", url } : null;
}
