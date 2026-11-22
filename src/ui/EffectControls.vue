<script setup lang="ts">
import { computed } from "vue";
import { type EffectDefinition, type EffectId, effectIds, effects } from "../engine/effects";
import { MAX_INTENSITY, MIN_INTENSITY } from "../engine/intensity";

const effect = defineModel<EffectId>("effect", { required: true });
const intensity = defineModel<number>("intensity", { required: true });
const angle = defineModel<number>("angle", { required: true });

const definition = computed<EffectDefinition>(() => effects[effect.value]);
</script>

<template>
  <fieldset class="group">
    <legend>Effect</legend>
    <div class="segmented" role="radiogroup" aria-label="Effect">
      <label v-for="id in effectIds" :key="id" :class="{ selected: effect === id }">
        <input v-model="effect" type="radio" name="effect" :value="id" />
        {{ effects[id].label }}
      </label>
    </div>
    <p v-if="definition.warning" class="warning">{{ definition.warning }}</p>

    <div class="slider">
      <span><label for="intensity">Intensity</label> <output for="intensity">{{ intensity }}</output></span>
      <input id="intensity" v-model.number="intensity" type="range" :min="MIN_INTENSITY" :max="MAX_INTENSITY" />
    </div>

    <div v-if="definition.hasAngle" class="slider">
      <span><label for="angle">Angle</label> <output for="angle">{{ angle }}°</output></span>
      <input id="angle" v-model.number="angle" type="range" min="0" max="180" />
    </div>
  </fieldset>
</template>
