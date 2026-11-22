export function exportFileName(sourceName: string, extension: string): string {
  const base = sourceName.replace(/\.[^.]*$/, "").trim() || "image";
  return `${base}-blurred.${extension}`;
}

export function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
