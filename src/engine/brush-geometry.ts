import type { Point } from "./history";

export interface DisplayBox {
  left: number;
  top: number;
  width: number;
}

// The canvas holds the image at full resolution and is scaled down by CSS, so pointer
// positions and the on-screen brush size convert to source-image pixels with one factor.
export function imageScale(imageWidth: number, box: DisplayBox): number {
  return box.width > 0 ? imageWidth / box.width : 1;
}

export function toImagePoint(
  clientX: number,
  clientY: number,
  imageWidth: number,
  box: DisplayBox,
): Point {
  const scale = imageScale(imageWidth, box);
  return { x: (clientX - box.left) * scale, y: (clientY - box.top) * scale };
}

export function brushDiameter(
  screenSize: number,
  imageWidth: number,
  box: DisplayBox,
): number {
  return screenSize * imageScale(imageWidth, box);
}
