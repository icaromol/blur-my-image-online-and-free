// The only way the UI reaches the renderer. PixiJS is large, so it loads after the first
// paint instead of in the initial bundle; Biome forbids the UI from importing renderer.ts.
export type Renderer = import("./renderer").Renderer;

export async function loadRenderer(): Promise<Renderer> {
  const { Renderer } = await import("./renderer");
  return Renderer.create();
}
