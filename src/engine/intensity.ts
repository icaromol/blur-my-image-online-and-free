export const MIN_INTENSITY = 1;
export const MAX_INTENSITY = 100;

// At intensity 100 the radius is this fraction of the image's shorter side.
export const MAX_RADIUS_FRACTION = 0.05;

export interface ImageSize {
  width: number;
  height: number;
}

export function clampIntensity(intensity: number): number {
  return Math.min(MAX_INTENSITY, Math.max(MIN_INTENSITY, intensity));
}

// Radius in source-image pixels, so preview and export match at any zoom.
export function radiusFor(intensity: number, size: ImageSize): number {
  const shorterSide = Math.min(size.width, size.height);
  return (
    (clampIntensity(intensity) / MAX_INTENSITY) *
    MAX_RADIUS_FRACTION *
    shorterSide
  );
}
