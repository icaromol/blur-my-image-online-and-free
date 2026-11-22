export type GlobalCommand = "undo" | "redo";
export type CanvasCommand = "brush" | "eraser" | "smaller" | "larger";
export type Command = GlobalCommand | CanvasCommand;

type Key = Pick<
  KeyboardEvent,
  "key" | "ctrlKey" | "metaKey" | "shiftKey" | "altKey" | "target"
>;

const TEXT_INPUT_TYPES = new Set([
  "text",
  "url",
  "search",
  "email",
  "password",
  "number",
]);

function isTyping(target: EventTarget | null): boolean {
  if (!target || typeof target !== "object") return false;
  const element = target as Partial<HTMLElement & HTMLInputElement>;
  if (element.isContentEditable) return true;
  if (element.tagName === "TEXTAREA" || element.tagName === "SELECT")
    return true;
  return (
    element.tagName === "INPUT" && TEXT_INPUT_TYPES.has(element.type ?? "text")
  );
}

// Ctrl/Cmd shortcuts work anywhere on the page, except while typing, so a text field keeps
// its own undo.
export function globalCommandFor(event: Key): GlobalCommand | null {
  if (
    isTyping(event.target) ||
    event.altKey ||
    !(event.ctrlKey || event.metaKey)
  )
    return null;
  if (event.key.toLowerCase() !== "z") return null;
  return event.shiftKey ? "redo" : "undo";
}

// Single-key shortcuts (Photoshop's keys) are only read while the image has focus, so they
// never fire for screen reader or speech input users elsewhere on the page (WCAG 2.1.4).
export function canvasCommandFor(event: Key): CanvasCommand | null {
  if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey)
    return null;
  switch (event.key.toLowerCase()) {
    case "b":
      return "brush";
    case "e":
      return "eraser";
    case "[":
      return "smaller";
    case "]":
      return "larger";
    default:
      return null;
  }
}
