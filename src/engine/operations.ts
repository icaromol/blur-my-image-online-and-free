import type { EffectId } from "./effects";

// One edit step. Every operation covers the whole image for now; brush masks come later.
export interface Operation {
  effect: EffectId;
  intensity: number;
}
