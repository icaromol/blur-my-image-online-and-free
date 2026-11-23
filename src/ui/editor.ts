import { computed, reactive, ref, shallowRef } from "vue";
import type { EffectSettings } from "../engine/effect-catalog";
import {
  History,
  type Point,
  type Stroke,
  toOperations,
} from "../engine/history";
import { loadRenderer, type Renderer } from "../engine/load-renderer";
import { errorCode } from "../errors";
import { downloadBlob, exportFileName } from "../export/download";
import {
  type ExportFormat,
  encodeImage,
  exportFormats,
} from "../export/encode";
import type { ImageSize } from "../image-size";
import { decodeImage } from "../input/decode";
import { fetchImage } from "../input/url";

export type Tool = "brush" | "eraser";

export const MIN_BRUSH = 4;
export const MAX_BRUSH = 400;

export interface DownscaleNotice {
  original: ImageSize;
  scaled: ImageSize;
  max: number;
}

const PROXY_URL = import.meta.env.VITE_PROXY_URL || "/api/image";

function fileNameFromUrl(url: URL): string {
  return decodeURIComponent(url.pathname.split("/").pop() ?? "") || "image";
}

export function useEditor() {
  const renderer = shallowRef<Renderer | null>(null);
  const history = new History();
  // History is a plain object; bumping this makes computed values re-read it.
  const revision = ref(0);

  const settings = reactive<EffectSettings>({
    effect: "gaussian",
    intensity: 50,
    angle: 0,
  });
  const tool = ref<Tool>("brush");
  const brushSize = ref(40);
  const format = ref<ExportFormat>("png");

  const fileName = ref("");
  const hasImage = ref(false);
  const loading = ref(false);
  const error = ref("");
  const notice = ref<DownscaleNotice | null>(null);

  const canUndo = computed(() => revision.value >= 0 && history.canUndo);
  const canRedo = computed(() => revision.value >= 0 && history.canRedo);

  let activeStroke: Stroke | null = null;
  let frame = 0;

  // The renderer chunk loads after first paint. An image opened before it arrives waits
  // for it instead of being dropped.
  let ready: Promise<Renderer | null> | null = null;

  function start(): Promise<Renderer | null> {
    ready ??= loadRenderer().then(
      (instance) => {
        renderer.value = instance;
        return instance;
      },
      () => {
        error.value = "webgl_unavailable";
        return null;
      },
    );
    return ready;
  }

  function renderNow(): void {
    cancelAnimationFrame(frame);
    frame = 0;
    renderer.value?.render(toOperations(history.active));
  }

  function scheduleRender(): void {
    frame ||= requestAnimationFrame(renderNow);
  }

  function commit(): void {
    revision.value++;
    renderNow();
  }

  // A slower, older load must not replace a newer one.
  let latestLoad = 0;

  async function show(id: number, blob: Blob, name: string): Promise<void> {
    const instance = await start();
    if (!instance) {
      if (id === latestLoad) error.value = "webgl_unavailable";
      return;
    }
    if (id !== latestLoad) return;
    error.value = "";
    notice.value = null;
    try {
      const max = instance.maxTextureSize;
      const { bitmap, originalSize } = await decodeImage(blob, max);
      if (id !== latestLoad) {
        bitmap.close();
        return;
      }
      instance.setImage(bitmap);
      if (originalSize) {
        notice.value = {
          original: originalSize,
          scaled: { width: bitmap.width, height: bitmap.height },
          max,
        };
      }
      history.clear();
      activeStroke = null;
      fileName.value = name;
      hasImage.value = true;
      commit();
    } catch (e) {
      if (id === latestLoad) error.value = errorCode(e);
    }
  }

  function open(blob: Blob, name: string): Promise<void> {
    loading.value = false;
    return show(++latestLoad, blob, name);
  }

  async function openUrl(url: URL): Promise<void> {
    const id = ++latestLoad;
    loading.value = true;
    error.value = "";
    try {
      await show(id, await fetchImage(url, PROXY_URL), fileNameFromUrl(url));
    } catch (e) {
      if (id === latestLoad) error.value = errorCode(e);
    } finally {
      if (id === latestLoad) loading.value = false;
    }
  }

  function blurEntireImage(): void {
    if (!hasImage.value) return;
    history.push({ kind: "whole", settings: { ...settings } });
    commit();
  }

  function beginStroke(point: Point, diameter: number): void {
    if (!hasImage.value) return;
    activeStroke = { diameter, points: [point] };
    history.push(
      tool.value === "eraser"
        ? { kind: "erase", stroke: activeStroke }
        : { kind: "brush", settings: { ...settings }, stroke: activeStroke },
    );
    commit();
  }

  function extendStroke(point: Point): void {
    if (!activeStroke) return;
    activeStroke.points.push(point);
    scheduleRender();
  }

  function endStroke(): void {
    if (!activeStroke) return;
    activeStroke = null;
    renderNow();
  }

  function undo(): void {
    if (activeStroke || !history.undo()) return;
    commit();
  }

  function redo(): void {
    if (activeStroke || !history.redo()) return;
    commit();
  }

  function resizeBrush(factor: number): void {
    brushSize.value = Math.round(
      Math.min(MAX_BRUSH, Math.max(MIN_BRUSH, brushSize.value * factor)),
    );
  }

  async function download(): Promise<void> {
    const instance = renderer.value;
    if (!instance || !hasImage.value) return;
    error.value = "";
    const chosen = format.value;
    const name = exportFileName(
      fileName.value,
      exportFormats[chosen].extension,
    );
    try {
      downloadBlob(await encodeImage(instance.toCanvas(), chosen), name);
    } catch (e) {
      error.value = errorCode(e);
    }
  }

  function stop(): void {
    cancelAnimationFrame(frame);
    renderer.value?.destroy();
    renderer.value = null;
  }

  return {
    renderer,
    settings,
    tool,
    brushSize,
    format,
    fileName,
    hasImage,
    loading,
    error,
    notice,
    canUndo,
    canRedo,
    start,
    stop,
    open,
    openUrl,
    blurEntireImage,
    beginStroke,
    extendStroke,
    endStroke,
    undo,
    redo,
    resizeBrush,
    download,
  };
}

export type Editor = ReturnType<typeof useEditor>;
