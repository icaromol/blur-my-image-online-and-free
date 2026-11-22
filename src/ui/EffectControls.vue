<script setup lang="ts">
import { computed } from "vue";
import { type EffectId, effectCatalog, effectIds } from "../engine/effect-catalog";
import { MAX_INTENSITY, MIN_INTENSITY } from "../engine/intensity";
import { type MessageKey, useTranslation } from "../i18n";

const { t, n } = useTranslation();
const effect = defineModel<EffectId>("effect", { required: true });
const intensity = defineModel<number>("intensity", { required: true });
const angle = defineModel<number>("angle", { required: true });

const definition = computed(() => effectCatalog[effect.value]);
</script>

<template>
  <fieldset class="group">
    <legend>{{ t("toolbar.effect") }}</legend>
    <div class="segmented" role="radiogroup" :aria-label="t('toolbar.effect')">
      <label v-for="id in effectIds" :key="id" :class="{ selected: effect === id }">
        <input v-model="effect" type="radio" name="effect" :value="id" />
        {{ t(`effects.${id}.label`) }}
      </label>
    </div>
    <p v-if="definition.hasWarning" class="warning">{{ t(`effects.${effect}.warning` as MessageKey) }}</p>

    <div class="slider">
      <span><label for="intensity">{{ t("toolbar.intensity") }}</label> <output for="intensity">{{ n(intensity) }}</output></span>
      <input id="intensity" v-model.number="intensity" type="range" :min="MIN_INTENSITY" :max="MAX_INTENSITY" />
    </div>

    <div v-if="definition.hasAngle" class="slider">
      <span><label for="angle">{{ t("toolbar.angle") }}</label> <output for="angle">{{ t("toolbar.angleValue", { angle: n(angle) }) }}</output></span>
      <input id="angle" v-model.number="angle" type="range" min="0" max="180" />
    </div>
  </fieldset>
</template>
