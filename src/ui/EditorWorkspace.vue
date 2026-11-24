<script setup lang="ts">
import { useTranslation } from "../i18n";
import AppIcon from "./AppIcon.vue";
import EditorCanvas from "./EditorCanvas.vue";
import EffectSettings from "./EffectSettings.vue";
import ExportControls from "./ExportControls.vue";
import { type Editor, MAX_BRUSH, MIN_BRUSH } from "./editor";
import { brushSize as brushSizeIcon, redo, undo } from "./icons";
import SliderCard from "./SliderCard.vue";
import type { CanvasCommand, Command } from "./shortcuts";
import ToolRail from "./ToolRail.vue";

const props = defineProps<{ editor: Editor; canvas: HTMLCanvasElement }>();
defineEmits<{ command: [command: Command | CanvasCommand] }>();

const { t, n } = useTranslation();
const { settings, tool, brushSize, format, canUndo, canRedo } = props.editor;
</script>

<template>
  <div class="workspace">
    <div class="rail">
      <ToolRail v-model:tool="tool" v-model:effect="settings.effect" @blur-entire="editor.blurEntireImage" />
    </div>

    <div class="stage">
      <slot name="messages" />
      <div class="frame">
        <EditorCanvas
          :canvas="canvas"
          :brush-size="brushSize"
          @stroke-start="editor.beginStroke"
          @stroke-move="editor.extendStroke"
          @stroke-end="editor.endStroke"
          @command="$emit('command', $event)"
        />
        <div class="bar">
          <div class="history">
            <button type="button" class="icon-button" :disabled="!canUndo" :aria-label="t('toolbar.undo')" aria-keyshortcuts="Control+Z Meta+Z" :data-tip="t('toolbar.undoTitle', { shortcut: 'Ctrl+Z' })" @click="editor.undo">
              <AppIcon :icon="undo" />
            </button>
            <button type="button" class="icon-button" :disabled="!canRedo" :aria-label="t('toolbar.redo')" aria-keyshortcuts="Control+Shift+Z Meta+Shift+Z" :data-tip="t('toolbar.redoTitle', { shortcut: 'Ctrl+Shift+Z' })" @click="editor.redo">
              <AppIcon :icon="redo" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="col">
        <EffectSettings v-model:intensity="settings.intensity" v-model:angle="settings.angle" :effect="settings.effect" />
        <div class="box">
          <SliderCard
            id="brush-size"
            v-model="brushSize"
            :icon="brushSizeIcon"
            :label="t('toolbar.brushSize')"
            :value="t('toolbar.brushSizeValue', { size: n(brushSize) })"
            :min="MIN_BRUSH"
            :max="MAX_BRUSH"
            keyshortcuts="[ ]"
            :title="t('toolbar.brushSizeTitle', { smaller: '[', larger: ']' })"
          />
        </div>
      </div>
      <div class="col">
        <div class="part">
          <ExportControls v-model:format="format" @download="editor.download" />
        </div>
        <div class="part">
          <slot name="input" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--bg);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.08);
}

.rail {
  padding: 12px 16px;
  border-bottom: 1px solid var(--line);
  border-radius: 12px 12px 0 0;
  background: var(--surface);
}

.stage {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: 12px;
  min-width: 0;
  padding: 16px 16px 8px;
}

.frame {
  display: grid;
  gap: 12px;
  justify-self: center;
  max-width: 100%;
}

/* Undo and redo sit at the left of the bar. The centre and the right end stay empty for the preview toggle (BMI-127) and the zoom (BMI-129), both after v1. */
.bar {
  display: flex;
  align-items: center;
}

.history {
  display: inline-flex;
  gap: 2px;
  padding: 2px;
  border: 1px solid var(--border-strong);
  border-radius: 10px;
  background: var(--surface);
}

.panel {
  display: grid;
  gap: 12px;
  padding: 8px 16px 24px;
}

.col {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: 12px;
}

.part {
  padding: 16px;
  border: 1px solid var(--line);
  border-radius: 12px;
  background: var(--surface);
}

@media (min-width: 720px) {
  .workspace {
    grid-template-columns: 88px minmax(0, 1fr);
  }

  .rail {
    grid-row: 1 / span 2;
    padding: 16px 6px;
    border-right: 1px solid var(--line);
    border-bottom: 0;
    border-radius: 12px 0 0 12px;
  }

  .stage {
    padding: 16px 16px 8px;
  }

  .panel {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    align-items: start;
  }
}

@media (min-width: 1100px) {
  .workspace {
    grid-template-columns: 96px minmax(0, 1fr) 320px;
  }

  .rail {
    grid-row: auto;
  }

  .stage {
    padding: 24px 24px 16px;
  }

  .panel {
    grid-template-columns: minmax(0, 1fr);
    max-height: calc(100vh - 32px);
    padding: 16px;
    border-left: 1px solid var(--line);
    border-radius: 0 12px 12px 0;
    background: var(--surface);
    overflow-y: auto;
  }

  .col {
    gap: 12px;
  }

  .part {
    padding: 12px 0 0;
    border: 0;
    border-top: 1px solid var(--line);
    border-radius: 0;
  }
}
</style>
