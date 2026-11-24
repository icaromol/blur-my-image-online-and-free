<script setup lang="ts">
import { computed } from "vue";
import { type EffectId, effectCatalog } from "../engine/effect-catalog";
import { MAX_INTENSITY, MIN_INTENSITY } from "../engine/intensity";
import { useTranslation } from "../i18n";
import AppIcon from "./AppIcon.vue";
import { angle as angleIcon, intensity as intensityIcon, warning } from "./icons";
import SliderCard from "./SliderCard.vue";

const { t, n } = useTranslation();
const props = defineProps<{ effect: EffectId }>();
const intensity = defineModel<number>("intensity", { required: true });
const angle = defineModel<number>("angle", { required: true });

const hasAngle = computed(() => effectCatalog[props.effect].hasAngle);
</script>

<template>
  <div class="box">
    <SliderCard id="intensity" v-model="intensity" :icon="intensityIcon" :label="t('toolbar.intensity')" :value="n(intensity)" :min="MIN_INTENSITY" :max="MAX_INTENSITY" />
    <SliderCard
      v-if="hasAngle"
      id="angle"
      v-model="angle"
      :icon="angleIcon"
      :label="t('toolbar.angle')"
      :value="t('toolbar.angleValue', { angle: n(angle) })"
      :min="0"
      :max="180"
    />
    <p id="effects-warning" class="warning">
      <AppIcon :icon="warning" class="warning-icon" />
      <span>{{ t("effects.warning") }}</span>
    </p>
  </div>
</template>

<style scoped>
.warning {
  display: flex;
  gap: 8px;
  margin: 0;
  color: var(--warning-text);
  font-size: 0.85rem;
}

.warning-icon {
  width: 16px;
  height: 16px;
  margin-top: 2px;
}
</style>
