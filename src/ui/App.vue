<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from "vue";
import { errorKey, useTranslation } from "../i18n";
import { readClipboard } from "../input/clipboard";
import EditorCanvas from "./EditorCanvas.vue";
import EffectControls from "./EffectControls.vue";
import ExportControls from "./ExportControls.vue";
import { useEditor } from "./editor";
import ImageInput from "./ImageInput.vue";
import LanguageSelect from "./LanguageSelect.vue";
import { type Command, globalCommandFor } from "./shortcuts";
import ThemeSelect from "./ThemeSelect.vue";
import ToolControls from "./ToolControls.vue";

const { t, n, locale } = useTranslation();
const editor = useEditor();
const { settings, tool, brushSize, format, hasImage, loading, error, notice, canUndo, canRedo } = editor;
const canvas = shallowRef<HTMLCanvasElement | null>(null);
const root = useTemplateRef<HTMLElement>("root");
const dragging = ref(false);
const errorText = computed(() => (error.value ? t(errorKey(error.value)) : ""));
let dragDepth = 0;

async function reveal() {
  await nextTick();
  root.value?.scrollIntoView({ block: "start" });
}

async function openFile(file: File) {
  await editor.open(file, file.name);
  await reveal();
}

async function openUrl(url: URL) {
  await reveal();
  await editor.openUrl(url);
  await reveal();
}

function onPaste(event: ClipboardEvent) {
  if (!event.clipboardData) return;
  const input = readClipboard(event.clipboardData);
  if (!input) return;
  const typing = event.target instanceof HTMLInputElement && event.target.type !== "range";
  // A link pasted into the URL field stays there until the user presses Load.
  if (typing && input.kind === "url") return;
  event.preventDefault();
  if (input.kind === "file") void openFile(input.file);
  else void openUrl(input.url);
}

function runCommand(command: Command) {
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

function onKeydown(event: KeyboardEvent) {
  const command = globalCommandFor(event);
  if (!command) return;
  event.preventDefault();
  runCommand(command);
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
  if (file) void openFile(file);
  else {
    error.value = "file_not_image";
    void reveal();
  }
}

onMounted(async () => {
  window.addEventListener("paste", onPaste);
  window.addEventListener("keydown", onKeydown);
  window.addEventListener("dragenter", onDragEnter);
  window.addEventListener("dragleave", onDragLeave);
  window.addEventListener("dragover", onDragOver);
  window.addEventListener("drop", onDrop);
  canvas.value = (await editor.start())?.canvas ?? null;
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
  <div ref="root" class="layout" :class="{ editing: hasImage }" :lang="locale">
    <div class="preferences">
      <LanguageSelect />
      <ThemeSelect />
    </div>
    <p class="tagline">{{ t("app.tagline") }}</p>

    <div class="controls">
      <ImageInput
        :compact="hasImage"
        :loading="loading"
        @file="openFile"
        @url="openUrl"
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
    </div>

    <div class="stage">
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
        @command="runCommand"
      />
    </div>

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

.preferences {
  position: absolute;
  top: 16px;
  right: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tagline {
  margin: 0;
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

/* On narrow screens the image comes right after the tagline, above the controls. */
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

  .layout.editing .tagline {
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
