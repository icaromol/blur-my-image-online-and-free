<script setup lang="ts">
import { onMounted, ref, useTemplateRef } from "vue";
import type { Point } from "../engine/history";

const props = defineProps<{ canvas: HTMLCanvasElement; brushSize: number }>();
const emit = defineEmits<{ strokeStart: [point: Point, diameter: number]; strokeMove: [point: Point]; strokeEnd: [] }>();

const host = useTemplateRef<HTMLDivElement>("host");
const cursor = ref<{ x: number; y: number } | null>(null);
let pointerId: number | null = null;

onMounted(() => host.value?.prepend(props.canvas));

// The canvas holds the image at full resolution and is scaled down by CSS.
function imageScale(): number {
  const rect = props.canvas.getBoundingClientRect();
  return rect.width > 0 ? props.canvas.width / rect.width : 1;
}

function toImage(event: PointerEvent): Point {
  const rect = props.canvas.getBoundingClientRect();
  const scale = imageScale();
  return { x: (event.clientX - rect.left) * scale, y: (event.clientY - rect.top) * scale };
}

function trackCursor(event: PointerEvent) {
  const rect = host.value?.getBoundingClientRect();
  if (rect) cursor.value = { x: event.clientX - rect.left, y: event.clientY - rect.top };
}

function onDown(event: PointerEvent) {
  if (event.button !== 0 || pointerId !== null) return;
  pointerId = event.pointerId;
  props.canvas.setPointerCapture(event.pointerId);
  emit("strokeStart", toImage(event), props.brushSize * imageScale());
}

function onMove(event: PointerEvent) {
  trackCursor(event);
  if (event.pointerId !== pointerId) return;
  for (const coalesced of event.getCoalescedEvents?.() ?? [event]) emit("strokeMove", toImage(coalesced));
}

function onUp(event: PointerEvent) {
  if (event.pointerId !== pointerId) return;
  pointerId = null;
  emit("strokeEnd");
}
</script>

<template>
  <div
    ref="host"
    class="canvas-host"
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
</template>

<style scoped>
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

.brush-cursor {
  position: absolute;
  border: 1px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 1px #000;
  transform: translate(-50%, -50%);
  pointer-events: none;
}
</style>
