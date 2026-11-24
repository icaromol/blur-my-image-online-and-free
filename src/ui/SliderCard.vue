<script setup lang="ts">
import AppIcon from "./AppIcon.vue";

defineProps<{ id: string; icon: string; label: string; value: string; min: number; max: number; title?: string; keyshortcuts?: string }>();

const model = defineModel<number>({ required: true });
</script>

<template>
  <div class="field">
    <span class="field-head"><AppIcon :icon="icon" class="field-icon" /><label :for="id">{{ label }}</label> <output :for="id">{{ value }}</output></span>
    <input :id="id" v-model.number="model" type="range" :min="min" :max="max" :title="title" :aria-keyshortcuts="keyshortcuts" />
  </div>
</template>

<style scoped>
.field {
  display: grid;
  gap: 8px;
}

.field-head {
  display: flex;
  align-items: center;
  gap: 8px;
}

.field-head label {
  font-weight: 600;
}

.field-head output {
  margin-left: auto;
  font-variant-numeric: tabular-nums;
}

.field-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

input {
  width: 100%;
  min-height: 24px;
  accent-color: var(--accent);
}
</style>
