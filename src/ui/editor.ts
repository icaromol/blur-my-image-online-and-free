import { computed, reactive, ref, shallowRef } from "vue";
import type { EffectSettings } from "../engine/effects";
import {
  History,
  type Point,
  type Stroke,
  toOperations,
} from "../engine/history";
import { Renderer } from "../engine/renderer";
import { downloadBlob, exportFileName } from "../export/download";
import {
  type ExportFormat,
  encodeImage,
  exportFormats,
} from "../export/encode";
import { decodeImage } from "../input/decode";
import { fetchImage } from "../input/url";

export type Tool = "brush" | "eraser";

export const MIN_BRUSH = 4;
export const MAX_BRUSH = 400;

const PROXY_URL = import.meta.env.VITE_PROXY_URL || "/api/image";

function message(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

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
  const notice = ref("");

  const canUndo = computed(() => revision.value >= 0 && history.canUndo);
  const canRedo = computed(() => revision.value >= 0 && history.canRedo);

  let activeStroke: Stroke | null = null;
  let frame = 0;

  async function start(): Promise<HTMLCanvasElement | null> {
    try {
      renderer.value = await Renderer.create();
      return renderer.value.canvas;
    } catch {
      error.value =
        "Your browser couldn't start WebGL, which this app needs to render effects.";
      return null;
    }
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

  async function open(blob: Blob, name: string): Promise<void> {
    const instance = renderer.value;
    if (!instance) return;
    error.value = "";
    notice.value = "";
    try {
      const max = instance.maxTextureSize;
      const { bitmap, originalSize } = await decodeImage(blob, max);
      instance.setImage(bitmap);
      if (originalSize) {
        notice.value =
          `This image is ${originalSize.width} × ${originalSize.height} px, larger than your graphics card ` +
          `can handle (${max} px per side). It was scaled down to ${bitmap.width} × ${bitmap.height} px, ` +
          "and the download will be that size.";
      }
      history.clear();
      activeStroke = null;
      fileName.value = name;
      hasImage.value = true;
      commit();
    } catch (e) {
      error.value = message(e);
    }
  }

  async function openUrl(url: URL): Promise<void> {
    loading.value = true;
    error.value = "";
    try {
      await open(await fetchImage(url, PROXY_URL), fileNameFromUrl(url));
    } catch (e) {
      error.value = message(e);
    } finally {
      loading.value = false;
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
    try {
      const blob = await encodeImage(instance.toCanvas(), format.value);
      downloadBlob(
        blob,
        exportFileName(fileName.value, exportFormats[format.value].extension),
      );
    } catch (e) {
      error.value = message(e);
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
