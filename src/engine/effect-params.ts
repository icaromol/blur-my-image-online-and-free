import type { ImageSize } from "../image-size";
import type { EffectSettings } from "./effect-catalog";
import { scaledLength } from "./intensity";

// Fraction of the image's shorter side reached at intensity 100.
const GAUSSIAN_MAX_RADIUS = 0.05;
const PIXELATE_MAX_BLOCK = 0.08;
const MOTION_MAX_LENGTH = 0.1;
const MOTION_MAX_SAMPLES = 127;

export function gaussianRadius(
  settings: EffectSettings,
  size: ImageSize,
): number {
  return scaledLength(settings.intensity, size, GAUSSIAN_MAX_RADIUS);
}

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

// Motion length and direction in source-image pixels. Canvas y grows downwards, so the
// y component is negated to make positive angles turn counterclockwise.
export function motionVelocity(
  settings: EffectSettings,
  size: ImageSize,
): { x: number; y: number } {
  const length = scaledLength(settings.intensity, size, MOTION_MAX_LENGTH);
  const radians = (settings.angle * Math.PI) / 180;
  return { x: Math.cos(radians) * length, y: -Math.sin(radians) * length };
}
