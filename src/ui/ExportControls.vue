<script setup lang="ts">
import { type ExportFormat, exportFormats } from "../export/encode";
import { useTranslation } from "../i18n";

const { t } = useTranslation();
defineProps<{ disabled: boolean }>();
defineEmits<{ download: [] }>();

const format = defineModel<ExportFormat>("format", { required: true });
const formatIds = Object.keys(exportFormats) as ExportFormat[];
</script>

<template>
  <fieldset class="group">
    <legend>{{ t("export.legend") }}</legend>
    <div class="row">
      <label class="visually-hidden" for="export-format">{{ t("export.format") }}</label>
      <select id="export-format" v-model="format">
        <option v-for="id in formatIds" :key="id" :value="id">{{ exportFormats[id].label }}</option>
      </select>
      <button type="button" class="primary grow" :disabled="disabled" @click="$emit('download')">{{ t("export.download") }}</button>
    </div>
    <p class="hint">{{ t("export.hint") }}</p>
  </fieldset>
</template>
