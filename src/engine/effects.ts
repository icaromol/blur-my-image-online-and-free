import { BlurFilter, type Filter } from "pixi.js";
import { type ImageSize, radiusFor } from "./intensity";

export interface EffectDefinition {
  label: string;
  createFilter(intensity: number, size: ImageSize): Filter;
}

export const effects = {
  gaussian: {
    label: "Gaussian",
    createFilter(intensity, size) {
      const filter = new BlurFilter({
        strength: radiusFor(intensity, size),
        quality: 4,
      });
      filter.repeatEdgePixels = true;
      return filter;
    },
  },
} satisfies Record<string, EffectDefinition>;

export type EffectId = keyof typeof effects;
