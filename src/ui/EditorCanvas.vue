<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import { brushDiameter, toImagePoint } from "../engine/brush-geometry";
import type { Point } from "../engine/history";
import { useTranslation } from "../i18n";
import { type CanvasCommand, canvasCommandFor } from "./shortcuts";

const props = defineProps<{ canvas: HTMLCanvasElement; brushSize: number }>();
const emit = defineEmits<{
  strokeStart: [point: Point, diameter: number];
  strokeMove: [point: Point];
  strokeEnd: [];
  command: [command: CanvasCommand];
}>();

const { t } = useTranslation();

const host = useTemplateRef<HTMLDivElement>("host");
const cursor = ref<{ x: number; y: number } | null>(null);
let pointerId: number | null = null;

onMounted(() => host.value?.prepend(props.canvas));

function toImage(event: PointerEvent): Point {
  return toImagePoint(event.clientX, event.clientY, props.canvas.width, props.canvas.getBoundingClientRect());
}

function trackCursor(event: PointerEvent) {
  const rect = host.value?.getBoundingClientRect();
  if (rect) cursor.value = { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function onDown(event: PointerEvent) {
  if (event.button !== 0 || pointerId !== null) return;
  pointerId = event.pointerId;
  props.canvas.setPointerCapture(event.pointerId);
  emit("strokeStart", toImage(event), brushDiameter(props.brushSize, props.canvas.width, props.canvas.getBoundingClientRect()));
}

function onMove(event: PointerEvent) {
  trackCursor(event);
  if (event.pointerId !== pointerId) return;
  for (const coalesced of event.getCoalescedEvents?.() ?? [event]) emit("strokeMove", toImage(coalesced));
}

function onKeydown(event: KeyboardEvent) {
  const command = canvasCommandFor(event);
  if (!command) return;
  event.preventDefault();
  emit("command", command);
}

function onUp(event: PointerEvent) {
  if (event.pointerId !== pointerId) return;
  pointerId = null;
  emit("strokeEnd");
}
</script>

<template>
  <div class="canvas-frame">
    <!-- biome-ignore-start lint/a11y/noNoninteractiveTabindex: role="application" is a focusable widget; the image needs focus for its single-key shortcuts (WCAG 2.1.4). -->
    <div
      ref="host"
      class="canvas-host"
      tabindex="0"
      role="application"
      :aria-label="t('canvas.label')"
      aria-keyshortcuts="B E [ ]"
      @keydown="onKeydown"
      @pointerdown="onDown"
      @pointermove="onMove"
      @pointerup="onUp"
      @pointercancel="onUp"
      @pointerleave="cursor = null"
    >
      <div
        v-if="cursor"
        class="brush-cursor"
        aria-hidden="true"
        :style="{ width: `${brushSize}px`, height: `${brushSize}px`, left: `${cursor.x}px`, top: `${cursor.y}px` }"
      />
    </div>
    <!-- biome-ignore-end lint/a11y/noNoninteractiveTabindex: see above -->
  </div>
</template>

<style scoped>
/* Lets the suppression comments sit inside one root element without affecting layout. */
.canvas-frame {
  display: contents;
}

.canvas-host {
  position: relative;
  display: inline-block;
  max-width: 100%;
  line-height: 0;
  cursor: none;
  touch-action: none;
  user-select: none;
}

.canvas-host :deep(canvas) {
  display: block;
  max-width: 100%;
  max-height: calc(100vh - 140px);
  width: auto;
  height: auto;
  background: repeating-conic-gradient(var(--checker) 0% 25%, transparent 0% 50%) 50% / 16px 16px;
}

.canvas-host:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

.brush-cursor {
  position: absolute;
  border: 1px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #000;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
