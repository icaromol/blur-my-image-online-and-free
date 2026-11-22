export type Command =
  | "brush"
  | "eraser"
  | "smaller"
  | "larger"
  | "undo"
  | "redo";

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

// Photoshop's defaults where one exists.
export function commandFor(event: Key): Command | null {
  if (isTyping(event.target) || event.altKey) return null;
  const key = event.key.toLowerCase();
  if (event.ctrlKey || event.metaKey) {
    if (key === "z") return event.shiftKey ? "redo" : "undo";
    return null;
  }
  if (event.shiftKey) return null;
  switch (key) {
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
