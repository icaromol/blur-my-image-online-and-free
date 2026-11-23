// Must load before any PixiJS renderer is created: replaces the shader code PixiJS would
// otherwise build with new Function, which the page CSP (no 'unsafe-eval') blocks.
import "pixi.js/unsafe-eval";
import {
  Application,
  Container,
  type Filter,
  Graphics,
  RenderTexture,
  Sprite,
  Texture,
  type WebGLRenderer,
} from "pixi.js";
import type { ImageSize } from "../image-size";
import { effectFilters } from "./effects";
import type { Operation, Stroke } from "./history";

interface Targets {
  // Input of the operation being edited.
  base: RenderTexture;
  // Base with the operation's effect applied (unused for restore, which reads the original).
  source: RenderTexture;
  // White where the operation applies.
  mask: RenderTexture;
  // What is on screen and what gets exported.
  result: RenderTexture;
}

const MASK_COLOR = 0xffffff;

// Renders an operation list. Each operation blurs the current result and composites it back
// through its mask. The last operation's base, source and mask stay cached, so a brush stroke
// that extends it only draws into the mask and composites again.
export class Renderer {
  private original: Texture | null = null;
  private image: ImageBitmap | null = null;
  private targets: Targets | null = null;
  private readonly display = new Sprite();
  private rendered: readonly Operation[] = [];
  private drawnPoints = new WeakMap<Stroke, number>();

  private constructor(private readonly app: Application<WebGLRenderer>) {
    app.stage.addChild(this.display);
  }

  static async create(): Promise<Renderer> {
    const app = new Application<WebGLRenderer>();
    await app.init({
      // An array, not a string: a string lets PixiJS fall back to a Canvas2D renderer that
      // skips every filter, so the app would export the image unblurred.
      preference: ["webgl"],
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

  get maxTextureSize(): number {
    const { gl } = this.app.renderer;
    return gl.getParameter(gl.MAX_TEXTURE_SIZE);
  }

  get size(): ImageSize | null {
    return this.image && { width: this.image.width, height: this.image.height };
  }

  // Takes ownership of the bitmap and closes it when replaced.
  setImage(image: ImageBitmap): void {
    this.releaseImage();
    const { width, height } = image;
    this.image = image;
    this.original = Texture.from(image);
    const create = () => RenderTexture.create({ width, height });
    this.targets = {
      base: create(),
      source: create(),
      mask: create(),
      result: create(),
    };
    this.app.renderer.resize(width, height);
    this.render([]);
  }

  render(operations: readonly Operation[]): void {
    if (!this.targets || !this.original) return;
    const previous = this.rendered;
    const last = operations.at(-1);

    if (
      last &&
      operations.length === previous.length &&
      sameOperations(operations, previous, operations.length - 1)
    ) {
      const before = previous.at(-1);
      if (before && extendsOperation(last, before)) {
        this.drawMask(last);
        this.composite(last);
      } else {
        this.renderAll(operations);
      }
    } else if (
      last &&
      operations.length === previous.length + 1 &&
      sameOperations(operations, previous, previous.length)
    ) {
      this.apply(last);
    } else {
      this.renderAll(operations);
    }

    this.rendered = operations;
    this.display.texture = this.targets.result;
    this.app.render();
  }

  // Full-resolution copy of the current result, independent of how the canvas is displayed.
  toCanvas(): HTMLCanvasElement {
    if (!this.targets) throw new Error("No image loaded");
    return this.app.renderer.extract.canvas(
      this.targets.result,
    ) as HTMLCanvasElement;
  }

  destroy(): void {
    this.releaseImage();
    this.app.destroy(true, { children: true });
  }

  private renderAll(operations: readonly Operation[]): void {
    if (!this.targets || !this.original) return;
    this.drawnPoints = new WeakMap();
    this.draw(new Sprite(this.original), this.targets.result);
    for (const operation of operations) this.apply(operation);
  }

  private apply(operation: Operation): void {
    if (!this.targets || !this.original) return;
    const targets = this.targets;
    // The previous result becomes this operation's base; the old base is free to overwrite.
    [targets.base, targets.result] = [targets.result, targets.base];

    if (operation.kind === "effect") {
      const filter = effectFilters[operation.settings.effect](
        operation.settings,
        targets.base,
      );
      this.draw(new Sprite(targets.base), targets.source, [filter]);
      filter.destroy();
    }
    if (operation.mask !== "whole") {
      this.app.renderer.render({
        container: new Container(),
        target: targets.mask,
        clear: true,
        clearColor: [0, 0, 0, 0],
      });
      this.drawMask(operation);
    }
    this.composite(operation);
  }

  private composite(operation: Operation): void {
    if (!this.targets || !this.original) return;
    const { base, source, mask, result } = this.targets;
    const top = new Sprite(
      operation.kind === "restore" ? this.original : source,
    );
    if (operation.mask === "whole") {
      this.draw(top, result);
      return;
    }
    const scene = new Container();
    const maskSprite = new Sprite(mask);
    top.mask = maskSprite;
    scene.addChild(new Sprite(base), top, maskSprite);
    this.draw(scene, result);
  }

  private drawMask(operation: Operation): void {
    if (!this.targets || operation.mask === "whole") return;
    const graphics = new Graphics();
    for (const stroke of operation.mask) {
      const drawn = this.drawnPoints.get(stroke) ?? 0;
      if (drawn >= stroke.points.length) continue;
      drawStroke(graphics, stroke, drawn);
      this.drawnPoints.set(stroke, stroke.points.length);
    }
    this.app.renderer.render({
      container: graphics,
      target: this.targets.mask,
      clear: false,
    });
    graphics.destroy();
  }

  private draw(
    container: Container,
    target: RenderTexture,
    filters?: Filter[],
  ): void {
    if (filters) container.filters = filters;
    this.app.renderer.render({
      container,
      target,
      clear: true,
      clearColor: [0, 0, 0, 0],
    });
    container.destroy({ children: true });
  }

  private releaseImage(): void {
    if (this.targets)
      for (const texture of Object.values(this.targets)) texture.destroy(true);
    this.targets = null;
    this.original?.destroy(true);
    this.original = null;
    this.image?.close();
    this.image = null;
    this.rendered = [];
    this.display.texture = Texture.EMPTY;
  }
}

// Draws the points from `from` on, joined to the point before so segments connect.
function drawStroke(graphics: Graphics, stroke: Stroke, from: number): void {
  const [first, ...rest] = stroke.points.slice(Math.max(0, from - 1));
  if (!first) return;
  // A click without a drag paints one dab.
  if (stroke.points.length === 1) {
    graphics.circle(first.x, first.y, stroke.diameter / 2).fill(MASK_COLOR);
    return;
  }
  graphics.moveTo(first.x, first.y);
  for (const point of rest) graphics.lineTo(point.x, point.y);
  graphics.stroke({
    width: stroke.diameter,
    color: MASK_COLOR,
    cap: "round",
    join: "round",
  });
}

function sameOperations(
  a: readonly Operation[],
  b: readonly Operation[],
  count: number,
): boolean {
  for (let i = 0; i < count; i++) {
    const left = a[i];
    const right = b[i];
    if (!left || !right || !sameOperation(left, right)) return false;
  }
  return true;
}

function sameOperation(a: Operation, b: Operation): boolean {
  if (a.kind !== b.kind) return false;
  if (a.kind === "effect" && b.kind === "effect" && a.settings !== b.settings)
    return false;
  if (a.mask === "whole" || b.mask === "whole") return a.mask === b.mask;
  return (
    a.mask.length === b.mask.length &&
    a.mask.every((stroke, i) => stroke === b.mask[i])
  );
}

// True when `next` is `previous` with more strokes or more points; only the new parts need drawing.
function extendsOperation(next: Operation, previous: Operation): boolean {
  if (
    next.kind !== previous.kind ||
    next.mask === "whole" ||
    previous.mask === "whole"
  )
    return false;
  if (
    next.kind === "effect" &&
    previous.kind === "effect" &&
    next.settings !== previous.settings
  )
    return false;
  const before = previous.mask;
  return (
    next.mask.length >= before.length &&
    before.every((stroke, i) => stroke === next.mask[i])
  );
}
