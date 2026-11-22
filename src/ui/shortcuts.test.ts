import { describe, expect, it } from "vitest";
import { canvasCommandFor, globalCommandFor } from "./shortcuts";

type Key = Parameters<typeof globalCommandFor>[0];

const key = (name: string, extra: Partial<Key> = {}): Key => ({
  key: name,
  ctrlKey: false,
  metaKey: false,
  shiftKey: false,
  altKey: false,
  target: null,
  ...extra,
});

const urlField = { tagName: "INPUT", type: "url" } as unknown as EventTarget;
const slider = { tagName: "INPUT", type: "range" } as unknown as EventTarget;

describe("globalCommandFor", () => {
  it("maps undo and redo with Ctrl or Cmd", () => {
    expect(globalCommandFor(key("z", { ctrlKey: true }))).toBe("undo");
    expect(globalCommandFor(key("z", { metaKey: true }))).toBe("undo");
    expect(globalCommandFor(key("Z", { ctrlKey: true, shiftKey: true }))).toBe(
      "redo",
    );
  });

  it("leaves Ctrl+Z to a text field being typed in", () => {
    expect(
      globalCommandFor(key("z", { ctrlKey: true, target: urlField })),
    ).toBeNull();
  });

  it("still works from a focused slider", () => {
    expect(globalCommandFor(key("z", { ctrlKey: true, target: slider }))).toBe(
      "undo",
    );
  });

  it("ignores single keys and other combinations", () => {
    expect(globalCommandFor(key("b"))).toBeNull();
    expect(globalCommandFor(key("z"))).toBeNull();
    expect(globalCommandFor(key("y", { ctrlKey: true }))).toBeNull();
    expect(
      globalCommandFor(key("z", { ctrlKey: true, altKey: true })),
    ).toBeNull();
  });
});

describe("canvasCommandFor", () => {
  it("maps the tool and brush size keys", () => {
    expect(canvasCommandFor(key("b"))).toBe("brush");
    expect(canvasCommandFor(key("E"))).toBe("eraser");
    expect(canvasCommandFor(key("["))).toBe("smaller");
    expect(canvasCommandFor(key("]"))).toBe("larger");
  });

  it("ignores modified keys and unrelated keys", () => {
    expect(canvasCommandFor(key("b", { ctrlKey: true }))).toBeNull();
    expect(canvasCommandFor(key("b", { altKey: true }))).toBeNull();
    expect(canvasCommandFor(key("x"))).toBeNull();
  });
});
