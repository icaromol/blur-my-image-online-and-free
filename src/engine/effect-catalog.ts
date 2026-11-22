// What the UI needs to know about each effect, without loading PixiJS. The filters that
// render them live in effects.ts, keyed by the same ids.

export const effectCatalog = {
  gaussian: { hasAngle: false },
  pixelate: { hasAngle: false },
  motion: { hasAngle: true },
} as const satisfies Record<string, { hasAngle: boolean }>;

export type EffectId = keyof typeof effectCatalog;

export const effectIds = Object.keys(effectCatalog) as EffectId[];

export interface EffectSettings {
  effect: EffectId;
  intensity: number;
  // Degrees, 0 to 180. Only effects with `hasAngle` read it.
  angle: number;
}

export function sameSettings(a: EffectSettings, b: EffectSettings): boolean {
  if (a.effect !== b.effect || a.intensity !== b.intensity) return false;
  return !effectCatalog[a.effect].hasAngle || a.angle === b.angle;
}
