import { type EffectSettings, sameSettings } from "./effect-catalog";

export interface Point {
  x: number;
  y: number;
}

// Points and diameter are in source-image pixels.
export interface Stroke {
  diameter: number;
  points: Point[];
}

export type Action =
  | { kind: "whole"; settings: EffectSettings }
  | { kind: "brush"; settings: EffectSettings; stroke: Stroke }
  | { kind: "erase"; stroke: Stroke };

export type Mask = "whole" | readonly Stroke[];

export type Operation =
  | { kind: "effect"; settings: EffectSettings; mask: Mask }
  | { kind: "restore"; mask: readonly Stroke[] };

// Consecutive strokes with the same setting share one mask, so painting the same spot
// twice at intensity 40 gives 40, not 80.
export function toOperations(actions: readonly Action[]): Operation[] {
  const operations: Operation[] = [];
  for (const action of actions) {
    const last = operations.at(-1);
    if (action.kind === "whole") {
      operations.push({
        kind: "effect",
        settings: action.settings,
        mask: "whole",
      });
    } else if (action.kind === "brush") {
      if (
        last?.kind === "effect" &&
        last.mask !== "whole" &&
        sameSettings(last.settings, action.settings)
      ) {
        operations[operations.length - 1] = {
          ...last,
          mask: [...last.mask, action.stroke],
        };
      } else {
        operations.push({
          kind: "effect",
          settings: action.settings,
          mask: [action.stroke],
        });
      }
    } else if (last?.kind === "restore") {
      operations[operations.length - 1] = {
        kind: "restore",
        mask: [...last.mask, action.stroke],
      };
    } else {
      operations.push({ kind: "restore", mask: [action.stroke] });
    }
  }
  return operations;
}

// Undo and redo move a pointer; nothing is deleted until a new action replaces the redo tail.
export class History {
  private actions: Action[] = [];
  private pointer = 0;

  get active(): readonly Action[] {
    return this.actions.slice(0, this.pointer);
  }

  get canUndo(): boolean {
    return this.pointer > 0;
  }

  get canRedo(): boolean {
    return this.pointer < this.actions.length;
  }

  clear(): void {
    this.actions = [];
    this.pointer = 0;
  }

  push(action: Action): void {
    this.actions = [...this.actions.slice(0, this.pointer), action];
    this.pointer = this.actions.length;
  }

  undo(): boolean {
    if (!this.canUndo) return false;
    this.pointer--;
    return true;
  }

  redo(): boolean {
    if (!this.canRedo) return false;
    this.pointer++;
    return true;
  }
}
