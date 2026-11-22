import { Application, type Filter, Rectangle, Sprite, Texture } from "pixi.js";
import { effects } from "./effects";
import type { Operation } from "./operations";

export class Renderer {
  private sprite: Sprite | null = null;
  private filters: Filter[] = [];

  private constructor(private readonly app: Application) {}

  static async create(): Promise<Renderer> {
    const app = new Application();
    await app.init({
      preference: "webgl",
      autoStart: false,
      backgroundAlpha: 0,
      width: 1,
      height: 1,
    });
    return new Renderer(app);
  }

  get canvas(): HTMLCanvasElement {
    return this.app.canvas;
  }

  setImage(image: ImageBitmap): void {
    this.clearImage();
    this.sprite = new Sprite(Texture.from(image));
    this.app.stage.addChild(this.sprite);
    this.app.renderer.resize(image.width, image.height);
    this.render([]);
  }

  // Operations run in order: each one blurs the result of the previous ones.
  render(operations: readonly Operation[]): void {
    if (!this.sprite) return;
    const size = {
      width: this.sprite.texture.width,
      height: this.sprite.texture.height,
    };
    for (const filter of this.filters) filter.destroy();
    this.filters = operations.map((op) =>
      effects[op.effect].createFilter(op.intensity, size),
    );
    this.sprite.filters = this.filters;
    this.app.render();
  }

  // Full-resolution copy of the current result, independent of how the canvas is displayed.
  toCanvas(): HTMLCanvasElement {
    if (!this.sprite) throw new Error("No image loaded");
    const { width, height } = this.sprite.texture;
    return this.app.renderer.extract.canvas({
      target: this.app.stage,
      frame: new Rectangle(0, 0, width, height),
    }) as HTMLCanvasElement;
  }

  destroy(): void {
    this.clearImage();
    this.app.destroy(true);
  }

  private clearImage(): void {
    for (const filter of this.filters) filter.destroy();
    this.filters = [];
    this.sprite?.destroy({ texture: true, textureSource: true });
    this.sprite = null;
  }
}
