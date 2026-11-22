<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, shallowRef } from "vue";
import { errorKey, useTranslation } from "../i18n";
import { readClipboard } from "../input/clipboard";
import EditorCanvas from "./EditorCanvas.vue";
import EffectControls from "./EffectControls.vue";
import ExportControls from "./ExportControls.vue";
import { useEditor } from "./editor";
import ImageInput from "./ImageInput.vue";
import LanguageSelect from "./LanguageSelect.vue";
import { commandFor } from "./shortcuts";
import ToolControls from "./ToolControls.vue";

const { t, n } = useTranslation();
const editor = useEditor();
const { settings, tool, brushSize, format, hasImage, loading, error, notice, canUndo, canRedo } = editor;
const canvas = shallowRef<HTMLCanvasElement | null>(null);
const dragging = ref(false);
const errorText = computed(() => (error.value ? t(errorKey(error.value)) : ""));
let dragDepth = 0;

function openFile(file: File) {
  void editor.open(file, file.name);
}

function onPaste(event: ClipboardEvent) {
  if (!event.clipboardData) return;
  const input = readClipboard(event.clipboardData);
  if (!input) return;
  const typing = event.target instanceof HTMLInputElement && event.target.type !== "range";
  // A link pasted into the URL field stays there until the user presses Load.
  if (typing && input.kind === "url") return;
  event.preventDefault();
  if (input.kind === "file") openFile(input.file);
  else void editor.openUrl(input.url);
}

function onKeydown(event: KeyboardEvent) {
  const command = commandFor(event);
  if (!command) return;
  event.preventDefault();
  switch (command) {
    case "brush":
    case "eraser":
      tool.value = command;
      break;
    case "smaller":
      editor.resizeBrush(0.8);
      break;
    case "larger":
      editor.resizeBrush(1.25);
      break;
    case "undo":
      editor.undo();
      break;
    case "redo":
      editor.redo();
      break;
  }
}

function hasFiles(event: DragEvent): boolean {
  return event.dataTransfer?.types.includes("Files") ?? false;
}

function onDragEnter(event: DragEvent) {
  if (!hasFiles(event)) return;
  dragDepth++;
  dragging.value = true;
}

function onDragLeave(event: DragEvent) {
  if (!hasFiles(event)) return;
  dragDepth = Math.max(0, dragDepth - 1);
  if (dragDepth === 0) dragging.value = false;
}

function onDragOver(event: DragEvent) {
  if (hasFiles(event)) event.preventDefault();
}

function onDrop(event: DragEvent) {
  if (!hasFiles(event)) return;
  event.preventDefault();
  dragDepth = 0;
  dragging.value = false;
  const file = Array.from(event.dataTransfer?.files ?? []).find((f) => f.type.startsWith("image/"));
  if (file) openFile(file);
  else error.value = "file_not_image";
}

onMounted(async () => {
  canvas.value = await editor.start();
  window.addEventListener("paste", onPaste);
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("dragenter", onDragEnter);
  window.addEventListener("dragleave", onDragLeave);
  window.addEventListener("dragover", onDragOver);
  window.addEventListener("drop", onDrop);
});

onBeforeUnmount(() => {
  window.removeEventListener("paste", onPaste);
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("dragenter", onDragEnter);
  window.removeEventListener("dragleave", onDragLeave);
  window.removeEventListener("dragover", onDragOver);
  window.removeEventListener("drop", onDrop);
  editor.stop();
});
</script>

<template>
  <div class="layout" :class="{ editing: hasImage }">
    <header class="header">
      <div class="title">
        <h1>{{ t("app.title") }}</h1>
        <LanguageSelect />
      </div>
      <p class="tagline">{{ t("app.tagline") }}</p>
    </header>

    <aside class="controls">
      <ImageInput
        :compact="hasImage"
        :loading="loading"
        @file="openFile"
        @url="editor.openUrl"
        @invalid="error = $event"
      />
      <template v-if="hasImage">
        <EffectControls
          v-model:effect="settings.effect"
          v-model:intensity="settings.intensity"
          v-model:angle="settings.angle"
        />
        <ToolControls
          v-model:tool="tool"
          v-model:brush-size="brushSize"
          :disabled="!hasImage"
          :can-undo="canUndo"
          :can-redo="canRedo"
          @blur-entire="editor.blurEntireImage"
          @undo="editor.undo"
          @redo="editor.redo"
        />
        <ExportControls v-model:format="format" :disabled="!hasImage" @download="editor.download" />
      </template>
    </aside>

    <main class="stage">
      <p v-if="error" role="alert" class="message error">{{ errorText }}</p>
      <p v-if="notice" role="status" class="message notice">
        {{
          t("notice.downscaled", {
            width: n(notice.original.width),
            height: n(notice.original.height),
            max: n(notice.max),
            scaledWidth: n(notice.scaled.width),
            scaledHeight: n(notice.scaled.height),
          })
        }}
      </p>
      <EditorCanvas
        v-if="canvas"
        v-show="hasImage"
        :canvas="canvas"
        :brush-size="brushSize"
        @stroke-start="editor.beginStroke"
        @stroke-move="editor.extendStroke"
        @stroke-end="editor.endStroke"
      />
    </main>

    <div v-if="dragging" class="drop-overlay" aria-hidden="true">{{ t("app.dropOverlay") }}</div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  gap: 16px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.header h1 {
  margin: 0;
  font-size: 1.4rem;
}

.tagline {
  margin: 4px 0 0;
  color: var(--text-muted);
}

.controls {
  display: grid;
  gap: 16px;
  align-content: start;
}

.stage {
  display: grid;
  gap: 12px;
  justify-items: center;
  align-content: start;
  min-width: 0;
}

.layout:not(.editing) .stage:empty {
  display: none;
}

/* On narrow screens the image comes right after the header, above the controls. */
.layout.editing .stage {
  order: 1;
}

.layout.editing .controls {
  order: 2;
}

.message {
  justify-self: stretch;
  margin: 0;
  padding: 10px 12px;
  border-radius: var(--radius);
}

.error {
  background: var(--error-bg);
  color: var(--error-text);
}

.notice {
  background: var(--notice-bg);
  color: var(--text);
}

.drop-overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: color-mix(in srgb, var(--accent) 20%, transparent);
  border: 4px dashed var(--accent);
  color: var(--text);
  font-size: 1.5rem;
  font-weight: 600;
  pointer-events: none;
}

@media (min-width: 900px) {
  .layout.editing {
    grid-template-columns: 300px 1fr;
    grid-template-rows: auto 1fr;
  }

  .layout.editing .header {
    grid-column: 1 / -1;
  }

  .layout.editing .controls {
    grid-column: 1;
    grid-row: 2;
  }

  .layout.editing .stage {
    grid-column: 2;
    grid-row: 2;
  }

  .layout:not(.editing) {
    max-width: 640px;
  }
}
</style>
