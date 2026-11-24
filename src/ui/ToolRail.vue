<script setup lang="ts">
import { type EffectId, effectIds } from "../engine/effect-catalog";
import { useTranslation } from "../i18n";
import AppIcon from "./AppIcon.vue";
import type { Tool } from "./editor";
import { blurEntire, effectGaussian, effectMotion, effectPixelate, toolBrush, toolEraser } from "./icons";

const { t } = useTranslation();
defineEmits<{ blurEntire: [] }>();

const tool = defineModel<Tool>("tool", { required: true });
const effect = defineModel<EffectId>("effect", { required: true });

const effectIcons: Record<EffectId, string> = { gaussian: effectGaussian, pixelate: effectPixelate, motion: effectMotion };
</script>

<template>
  <div class="tools">
    <!-- biome-ignore lint/a11y/useSemanticElements: a fieldset can't take the grid layout the caption needs on a phone. -->
    <div class="group" role="group" aria-labelledby="rail-apply">
      <p id="rail-apply" class="caption">{{ t("toolbar.apply") }}</p>
      <div class="tool-cards">
        <button type="button" class="tool-card" :aria-pressed="tool === 'brush'" :aria-label="t('toolbar.brush')" aria-keyshortcuts="B" :data-tip="t('toolbar.brushTitle', { key: 'B' })" @click="tool = 'brush'">
          <kbd data-key="B" aria-hidden="true" />
          <AppIcon :icon="toolBrush" />
          {{ t("toolbar.brush") }}
        </button>
        <button type="button" class="tool-card" :aria-pressed="tool === 'eraser'" :aria-label="t('toolbar.eraser')" aria-keyshortcuts="E" :data-tip="t('toolbar.eraserTitle', { key: 'E' })" @click="tool = 'eraser'">
          <kbd data-key="E" aria-hidden="true" />
          <AppIcon :icon="toolEraser" />
          {{ t("toolbar.eraser") }}
        </button>
        <button type="button" class="tool-card" :aria-label="t('toolbar.blurEntire')" :data-tip="t('toolbar.blurEntire')" @click="$emit('blurEntire')">
          <AppIcon :icon="blurEntire" />
          {{ t("toolbar.blurEntireShort") }}
        </button>
      </div>
    </div>

    <div class="group" role="radiogroup" aria-labelledby="rail-effect" aria-describedby="effects-warning">
      <p id="rail-effect" class="caption">{{ t("toolbar.effect") }}</p>
      <div class="tool-cards">
        <label v-for="id in effectIds" :key="id" class="tool-card" :class="{ selected: effect === id }">
          <input v-model="effect" type="radio" name="effect" :value="id" />
          <AppIcon :icon="effectIcons[id]" />
          {{ t(`effects.${id}.label`) }}
        </label>
      </div>
    </div>
  </div>
</template>

<style scoped>
.tools {
  display: grid;
  align-content: start;
  gap: 16px;
}

.group {
  display: grid;
  gap: 6px;
  min-width: 0;
}

.group + .group {
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

.caption {
  margin: 0 0 2px;
  color: var(--text-muted);
  font-size: 0.66rem;
  font-weight: 700;
  letter-spacing: 0.07em;
  text-align: center;
  text-transform: uppercase;
}

.tool-cards {
  display: grid;
  gap: 6px;
}

.tool-card {
  position: relative;
  display: grid;
  justify-items: center;
  align-content: center;
  gap: 5px;
  min-height: 72px;
  padding: 8px 2px;
  border: 1px solid transparent;
  border-radius: 10px;
  background: transparent;
  color: var(--text);
  font-size: 0.75rem;
  line-height: 1.15;
  text-align: center;
  cursor: pointer;
}

.tool-card .app-icon {
  width: 22px;
  height: 22px;
}

.tool-card:hover {
  background: var(--bg);
}

.tool-card[aria-pressed="true"],
.tool-card.selected {
  border-color: var(--accent);
  background: color-mix(in srgb, var(--accent) 12%, var(--surface));
  box-shadow: inset 0 0 0 0.5px var(--accent);
  color: var(--accent);
  font-weight: 700;
}

.tool-card input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.tool-card:focus-within {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

kbd::after {
  content: attr(data-key);
}

kbd {
  position: absolute;
  top: 4px;
  right: 5px;
  color: var(--text-muted);
  font-family: inherit;
  font-size: 0.6rem;
  font-weight: 600;
  line-height: 1;
}

.tool-card[aria-pressed="true"] kbd {
  color: var(--accent);
}

@media (min-width: 720px) {
  .tool-card[data-tip]::after {
    top: 50%;
    bottom: auto;
    left: calc(100% + 8px);
    transform: translateY(-50%);
  }

  .tool-card[data-tip]::before {
    top: 50%;
    bottom: auto;
    left: calc(100% + 3px);
    border: 5px solid transparent;
    border-right-color: var(--text);
    border-left: 0;
    transform: translateY(-50%);
  }
}

@media (max-width: 719px) {
  .tools {
    gap: 12px;
  }

  .group {
    grid-template-columns: 58px minmax(0, 1fr);
    align-items: center;
    gap: 8px;
  }

  .group + .group {
    padding-top: 12px;
  }

  .caption {
    margin: 0;
    text-align: left;
  }

  .tool-cards {
    grid-template-columns: repeat(3, 1fr);
  }

  .tool-card {
    min-height: 56px;
    padding: 6px 2px;
    gap: 4px;
    font-size: 0.72rem;
  }

  .tool-card .app-icon {
    width: 20px;
    height: 20px;
  }

  .tool-card[data-tip]:last-child::after {
    right: 0;
    left: auto;
    transform: none;
  }
}
</style>
