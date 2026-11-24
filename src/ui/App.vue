<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, shallowRef, useTemplateRef } from "vue";
import { errorKey, useTranslation } from "../i18n";
import { readClipboard } from "../input/clipboard";
import EditorHeader from "./EditorHeader.vue";
import EditorMessages from "./EditorMessages.vue";
import EditorWorkspace from "./EditorWorkspace.vue";
import { useEditor } from "./editor";
import ImageInput from "./ImageInput.vue";
import LanguageSelect from "./LanguageSelect.vue";
import { type Command, globalCommandFor } from "./shortcuts";
import ThemeSelect from "./ThemeSelect.vue";

const { t, locale } = useTranslation();
const editor = useEditor();
const { tool, hasImage, loading, error, notice } = editor;
const canvas = shallowRef<HTMLCanvasElement | null>(null);
const root = useTemplateRef<HTMLElement>("root");
const dragging = ref(false);
const errorText = computed(() => (error.value ? t(errorKey(error.value)) : ""));
let dragDepth = 0;

// Escape closes a tooltip that is showing; moving the pointer or the focus brings tooltips back (WCAG 1.4.13).
const tipsOff = ref(false);
const showTips = () => {
  tipsOff.value = false;
};

async function reveal() {
  await nextTick();
  root.value?.scrollIntoView({ block: "start" });
  // Opening swaps the home's controls for the editor's, which drops focus on the body.
  if (!root.value?.contains(document.activeElement))
    root.value?.querySelector<HTMLElement>('[role="application"]')?.focus({ preventScroll: true });
}

let opening = 0;

async function openFile(file: File) {
  const op = ++opening;
  await editor.open(file, file.name);
  if (op === opening) await reveal();
}

async function openUrl(url: URL) {
  const op = ++opening;
  await reveal();
  await editor.openUrl(url);
  if (op === opening) await reveal();
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
  if (event.key === "Escape") tipsOff.value = true;
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
  window.addEventListener("pointermove", showTips);
  window.addEventListener("focusin", showTips);
  window.addEventListener("dragenter", onDragEnter);
  window.addEventListener("dragleave", onDragLeave);
  window.addEventListener("dragover", onDragOver);
  window.addEventListener("drop", onDrop);
  canvas.value = (await editor.start())?.canvas ?? null;
});

onBeforeUnmount(() => {
  window.removeEventListener("paste", onPaste);
  window.removeEventListener("keydown", onKeydown);
  window.removeEventListener("pointermove", showTips);
  window.removeEventListener("focusin", showTips);
  window.removeEventListener("dragenter", onDragEnter);
  window.removeEventListener("dragleave", onDragLeave);
  window.removeEventListener("dragover", onDragOver);
  window.removeEventListener("drop", onDrop);
  editor.stop();
});
</script>

<template>
  <div ref="root" class="layout" :class="{ editing: hasImage, 'tips-off': tipsOff }" :lang="locale">
    <div v-if="!hasImage" class="topbar">
      <p class="tagline">{{ t("app.tagline") }}</p>
      <div class="preferences">
        <LanguageSelect />
        <ThemeSelect />
      </div>
    </div>
    <EditorHeader v-else />

    <ImageInput v-if="!hasImage" :compact="false" :loading="loading" @file="openFile" @url="openUrl" @invalid="error = $event" />

    <EditorMessages v-if="!(hasImage && canvas)" :error="errorText" :notice="notice" />

    <EditorWorkspace v-if="hasImage && canvas" :editor="editor" :canvas="canvas" @command="runCommand">
      <template #messages>
        <EditorMessages :error="errorText" :notice="notice" />
      </template>
      <template #input>
        <ImageInput compact :loading="loading" @file="openFile" @url="openUrl" @invalid="error = $event" />
      </template>
    </EditorWorkspace>

    <div v-if="dragging" class="drop-overlay" aria-hidden="true">{{ t("app.dropOverlay") }}</div>
  </div>
</template>

<style scoped>
.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 16px;
}

.topbar {
  display: contents;
}

.preferences {
  position: absolute;
  top: var(--space-4);
  right: var(--gutter);
  display: flex;
  align-items: center;
  gap: 8px;
}

.tagline {
  margin: 0;
  color: var(--text-muted);
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
</style>
