import { describe, expect, it } from "vitest";
import type { EffectSettings } from "./effects";
import { type Action, History, type Stroke, toOperations } from "./history";

const light: EffectSettings = { effect: "gaussian", intensity: 20, angle: 0 };
const heavy: EffectSettings = { effect: "pixelate", intensity: 90, angle: 0 };
const stroke = (x: number): Stroke => ({ diameter: 10, points: [{ x, y: 0 }] });

describe("toOperations", () => {
  it("merges consecutive strokes with the same setting into one mask", () => {
    const a = stroke(1);
    const b = stroke(2);
    const ops = toOperations([
      { kind: "brush", settings: light, stroke: a },
      { kind: "brush", settings: { ...light }, stroke: b },
    ]);
    expect(ops).toEqual([{ kind: "effect", settings: light, mask: [a, b] }]);
  });

  it("starts a new operation when the setting changes", () => {
    const ops = toOperations([
      { kind: "brush", settings: light, stroke: stroke(1) },
      { kind: "brush", settings: heavy, stroke: stroke(2) },
      { kind: "brush", settings: light, stroke: stroke(3) },
    ]);
    expect(ops.map((op) => op.kind === "effect" && op.settings.effect)).toEqual(
      ["gaussian", "pixelate", "gaussian"],
    );
  });

  it("ignores the angle for effects that don't use it", () => {
    const ops = toOperations([
      { kind: "brush", settings: light, stroke: stroke(1) },
      { kind: "brush", settings: { ...light, angle: 90 }, stroke: stroke(2) },
    ]);
    expect(ops).toHaveLength(1);
  });

  it("treats a different motion angle as a new setting", () => {
    const motion: EffectSettings = {
      effect: "motion",
      intensity: 50,
      angle: 0,
    };
    const ops = toOperations([
      { kind: "brush", settings: motion, stroke: stroke(1) },
      { kind: "brush", settings: { ...motion, angle: 45 }, stroke: stroke(2) },
    ]);
    expect(ops).toHaveLength(2);
  });

  it("keeps whole-image operations separate and in order", () => {
    const ops = toOperations([
      { kind: "whole", settings: light },
      { kind: "whole", settings: light },
      { kind: "brush", settings: light, stroke: stroke(1) },
    ]);
    expect(
      ops.map((op) => op.kind === "effect" && op.mask === "whole"),
    ).toEqual([true, true, false]);
  });

  it("groups consecutive eraser strokes into one restore operation", () => {
    const a = stroke(1);
    const b = stroke(2);
    const ops = toOperations([
      { kind: "whole", settings: light },
      { kind: "erase", stroke: a },
      { kind: "erase", stroke: b },
    ]);
    expect(ops[1]).toEqual({ kind: "restore", mask: [a, b] });
  });
});

describe("History", () => {
  const actionAt = (x: number): Action => ({
    kind: "erase",
    stroke: stroke(x),
  });

  it("undoes and redoes by moving a pointer", () => {
    const history = new History();
    history.push(actionAt(1));
    history.push(actionAt(2));
    expect(history.undo()).toBe(true);
    expect(history.active).toHaveLength(1);
    expect(history.redo()).toBe(true);
    expect(history.active).toHaveLength(2);
    expect(history.redo()).toBe(false);
  });

  it("drops the redo tail when a new action is pushed", () => {
    const history = new History();
    history.push(actionAt(1));
    history.push(actionAt(2));
    history.undo();
    history.push(actionAt(3));
    expect(history.canRedo).toBe(false);
    expect(
      history.active.map((a) => a.kind === "erase" && a.stroke.points[0].x),
    ).toEqual([1, 3]);
  });

  it("reports nothing to undo on a fresh history", () => {
    const history = new History();
    expect(history.canUndo).toBe(false);
    expect(history.undo()).toBe(false);
  });
});
