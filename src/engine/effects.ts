import { BlurFilter, type Filter } from "pixi.js";
import { PixelateFilter } from "pixi-filters";
import type { ImageSize } from "../image-size";
import type { EffectId, EffectSettings } from "./effect-catalog";
import {
  gaussianRadius,
  motionKernelSize,
  motionVelocity,
  pixelateBlockSize,
} from "./effect-params";
import { EdgeClampedMotionBlurFilter } from "./motion-blur-filter";

// WebGL filters for each effect. The numbers they use come from effect-params.ts, which is
// unit tested; this file only runs in a browser and is covered by the e2e tests.
export const effectFilters: Record<
  EffectId,
  (settings: EffectSettings, size: ImageSize) => Filter
> = {
  gaussian(settings, size) {
    const filter = new BlurFilter({
      strength: gaussianRadius(settings, size),
      quality: 4,
    });
    filter.repeatEdgePixels = true;
    return filter;
  },
  pixelate(settings, size) {
    const filter = new PixelateFilter(pixelateBlockSize(settings, size));
    filter.padding = 0;
    return filter;
  },
  motion(settings, size) {
    const velocity = motionVelocity(settings, size);
    return new EdgeClampedMotionBlurFilter({
      velocity,
      kernelSize: motionKernelSize(Math.hypot(velocity.x, velocity.y)),
    });
  },
};
