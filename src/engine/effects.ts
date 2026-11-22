import { BlurFilter, type Filter } from "pixi.js";
import { PixelateFilter } from "pixi-filters";
import { type ImageSize, scaledLength } from "./intensity";
import { EdgeClampedMotionBlurFilter } from "./motionBlurFilter";

export interface EffectSettings {
  effect: EffectId;
  intensity: number;
  // Degrees, 0 to 180. Only effects with `hasAngle` read it.
  angle: number;
}

export interface EffectDefinition {
  hasAngle: boolean;
  hasWarning?: boolean;
  createFilter(settings: EffectSettings, size: ImageSize): Filter;
}

// Fraction of the image's shorter side reached at intensity 100.
const GAUSSIAN_MAX_RADIUS = 0.05;
const PIXELATE_MAX_BLOCK = 0.08;
const MOTION_MAX_LENGTH = 0.1;
const MOTION_MAX_SAMPLES = 127;

export function motionKernelSize(length: number): number {
  const samples = Math.min(MOTION_MAX_SAMPLES, Math.max(5, Math.ceil(length)));
  return samples % 2 === 0 ? samples + 1 : samples;
}

export function pixelateBlockSize(
  settings: EffectSettings,
  size: ImageSize,
): number {
  return Math.max(
    2,
    Math.round(scaledLength(settings.intensity, size, PIXELATE_MAX_BLOCK)),
  );
}

export const effects = {
  gaussian: {
    hasAngle: false,
    createFilter(settings, size) {
      const filter = new BlurFilter({
        strength: scaledLength(settings.intensity, size, GAUSSIAN_MAX_RADIUS),
        quality: 4,
      });
      filter.repeatEdgePixels = true;
      return filter;
    },
  },
  pixelate: {
    hasAngle: false,
    hasWarning: true,
    createFilter(settings, size) {
      const filter = new PixelateFilter(pixelateBlockSize(settings, size));
      filter.padding = 0;
      return filter;
    },
  },
  motion: {
    hasAngle: true,
    createFilter(settings, size) {
      const length = scaledLength(settings.intensity, size, MOTION_MAX_LENGTH);
      const radians = (settings.angle * Math.PI) / 180;
      return new EdgeClampedMotionBlurFilter({
        // Canvas y grows downwards; negate so positive angles go counterclockwise.
        velocity: {
          x: Math.cos(radians) * length,
          y: -Math.sin(radians) * length,
        },
        kernelSize: motionKernelSize(length),
      });
    },
  },
} satisfies Record<string, EffectDefinition>;

export type EffectId = keyof typeof effects;

export const effectIds = Object.keys(effects) as EffectId[];

export function sameSettings(a: EffectSettings, b: EffectSettings): boolean {
  if (a.effect !== b.effect || a.intensity !== b.intensity) return false;
  return !effects[a.effect].hasAngle || a.angle === b.angle;
}
