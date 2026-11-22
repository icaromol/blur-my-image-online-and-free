import { describe, expect, it } from "vitest";
import { commandFor } from "./shortcuts";

const press = (
  key: string,
  extra: Partial<Parameters<typeof commandFor>[0]> = {},
) =>
  commandFor({
    key,
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    altKey: false,
    target: null,
    ...extra,
  });

describe("commandFor", () => {
  it("maps the tool and brush size keys", () => {
    expect(press("b")).toBe("brush");
    expect(press("E")).toBe("eraser");
    expect(press("[")).toBe("smaller");
    expect(press("]")).toBe("larger");
  });

  it("maps undo and redo with Ctrl or Cmd", () => {
    expect(press("z", { ctrlKey: true })).toBe("undo");
    expect(press("z", { metaKey: true })).toBe("undo");
    expect(press("Z", { ctrlKey: true, shiftKey: true })).toBe("redo");
  });

  it("ignores keys while typing in a text field", () => {
    const urlField = {
      tagName: "INPUT",
      type: "url",
    } as unknown as EventTarget;
    expect(press("b", { target: urlField })).toBeNull();
    expect(press("z", { ctrlKey: true, target: urlField })).toBeNull();
  });

  it("still works on a focused slider", () => {
    const slider = {
      tagName: "INPUT",
      type: "range",
    } as unknown as EventTarget;
    expect(press("e", { target: slider })).toBe("eraser");
  });

  it("ignores unrelated keys and modifiers", () => {
    expect(press("x")).toBeNull();
    expect(press("b", { ctrlKey: true })).toBeNull();
    expect(press("b", { altKey: true })).toBeNull();
  });
});
