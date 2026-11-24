<script setup lang="ts">
import { type ExportFormat, exportFormats } from "../export/encode";
import { useTranslation } from "../i18n";
import AppIcon from "./AppIcon.vue";
import { download, format as formatIcon } from "./icons";

const { t } = useTranslation();
defineEmits<{ download: [] }>();

const format = defineModel<ExportFormat>("format", { required: true });
const formatIds = Object.keys(exportFormats) as ExportFormat[];
</script>

<template>
  <section class="export" aria-labelledby="export-legend">
    <h2 id="export-legend" class="visually-hidden">{{ t("export.legend") }}</h2>
    <div class="format">
      <AppIcon :icon="formatIcon" class="format-icon" />
      <label for="export-format">{{ t("export.format") }}</label>
      <select id="export-format" v-model="format">
        <option v-for="id in formatIds" :key="id" :value="id">{{ exportFormats[id].label }}</option>
      </select>
    </div>
    <button type="button" class="primary download" @click="$emit('download')">
      <AppIcon :icon="download" />
      {{ t("export.download") }}
    </button>
    <p class="hint">{{ t("export.hint") }}</p>
  </section>
</template>

<style scoped>
.export {
  display: grid;
  gap: 12px;
}

.format {
  display: flex;
  align-items: center;
  gap: 8px;
}

.format label {
  font-weight: 600;
}

.format select {
  margin-left: auto;
  font-weight: 600;
}

.format-icon {
  width: 18px;
  height: 18px;
  color: var(--text-muted);
}

.download {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  min-height: 48px;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
}

.hint {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.8rem;
}
</style>
