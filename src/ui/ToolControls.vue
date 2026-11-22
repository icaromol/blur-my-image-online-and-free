<script setup lang="ts">
import { MAX_BRUSH, MIN_BRUSH, type Tool } from "./editor";

defineProps<{ disabled: boolean; canUndo: boolean; canRedo: boolean }>();
defineEmits<{ blurEntire: []; undo: []; redo: [] }>();

const tool = defineModel<Tool>("tool", { required: true });
const brushSize = defineModel<number>("brushSize", { required: true });
</script>

<template>
  <fieldset class="group">
    <legend>Apply</legend>
    <button type="button" class="primary" :disabled="disabled" @click="$emit('blurEntire')">Blur entire image</button>

    <div class="segmented">
      <button type="button" :aria-pressed="tool === 'brush'" aria-keyshortcuts="B" title="Brush (B)" @click="tool = 'brush'">
        Brush
      </button>
      <button
        type="button"
        :aria-pressed="tool === 'eraser'"
        aria-keyshortcuts="E"
        title="Eraser (E)"
        @click="tool = 'eraser'"
      >
        Eraser
      </button>
    </div>

    <div class="slider">
      <span><label for="brush-size">Brush size</label> <output for="brush-size">{{ brushSize }} px</output></span>
      <input
        id="brush-size"
        v-model.number="brushSize"
        type="range"
        :min="MIN_BRUSH"
        :max="MAX_BRUSH"
        aria-keyshortcuts="[ ]"
        title="Smaller [ / larger ]"
      />
    </div>

    <div class="row">
      <button type="button" :disabled="!canUndo" aria-keyshortcuts="Control+Z Meta+Z" title="Undo (Ctrl+Z)" @click="$emit('undo')">
        Undo
      </button>
      <button
        type="button"
        :disabled="!canRedo"
        aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z"
        title="Redo (Ctrl+Shift+Z)"
        @click="$emit('redo')"
      >
        Redo
      </button>
    </div>
  </fieldset>
</template>
