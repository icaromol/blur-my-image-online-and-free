import type { ImageSize } from "../image-size";

export const MIN_INTENSITY = 1;
export const MAX_INTENSITY = 100;

export function clampIntensity(intensity: number): number {
  return Math.min(MAX_INTENSITY, Math.max(MIN_INTENSITY, intensity));
}

// Length in source-image pixels, proportional to the image's shorter side, so the same
// intensity looks the same on a 600 px screenshot and a 6000 px photo, at any zoom.
export function scaledLength(
  intensity: number,
  size: ImageSize,
  maxFraction: number,
): number {
  const shorterSide = Math.min(size.width, size.height);
  return (
    (clampIntensity(intensity) / MAX_INTENSITY) * maxFraction * shorterSide
  );
}
