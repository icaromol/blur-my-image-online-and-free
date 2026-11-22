<script setup lang="ts">
import { useTranslation } from "../i18n";
import { MAX_BRUSH, MIN_BRUSH, type Tool } from "./editor";

const { t, n } = useTranslation();
defineProps<{ disabled: boolean; canUndo: boolean; canRedo: boolean }>();
defineEmits<{ blurEntire: []; undo: []; redo: [] }>();

const tool = defineModel<Tool>("tool", { required: true });
const brushSize = defineModel<number>("brushSize", { required: true });
</script>

<template>
  <fieldset class="group">
    <legend>{{ t("toolbar.apply") }}</legend>
    <button type="button" class="primary" :disabled="disabled" @click="$emit('blurEntire')">{{ t("toolbar.blurEntire") }}</button>

    <div class="segmented">
      <button type="button" :aria-pressed="tool === 'brush'" aria-keyshortcuts="B" :title="t('toolbar.brushTitle', { key: 'B' })" @click="tool = 'brush'">
        {{ t("toolbar.brush") }}
      </button>
      <button
        type="button"
        :aria-pressed="tool === 'eraser'"
        aria-keyshortcuts="E"
        :title="t('toolbar.eraserTitle', { key: 'E' })"
        @click="tool = 'eraser'"
      >
        {{ t("toolbar.eraser") }}
      </button>
    </div>

    <div class="slider">
      <span><label for="brush-size">{{ t("toolbar.brushSize") }}</label> <output for="brush-size">{{ t("toolbar.brushSizeValue", { size: n(brushSize) }) }}</output></span>
      <input
        id="brush-size"
        v-model.number="brushSize"
        type="range"
        :min="MIN_BRUSH"
        :max="MAX_BRUSH"
        aria-keyshortcuts="[ ]"
        :title="t('toolbar.brushSizeTitle', { smaller: '[', larger: ']' })"
      />
    </div>

    <div class="row">
      <button type="button" :disabled="!canUndo" aria-keyshortcuts="Control+Z Meta+Z" :title="t('toolbar.undoTitle', { shortcut: 'Ctrl+Z' })" @click="$emit('undo')">
        {{ t("toolbar.undo") }}
      </button>
      <button
        type="button"
        :disabled="!canRedo"
        aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z"
        :title="t('toolbar.redoTitle', { shortcut: 'Ctrl+Shift+Z' })"
        @click="$emit('redo')"
      >
        {{ t("toolbar.redo") }}
      </button>
    </div>
  </fieldset>
</template>
