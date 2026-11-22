<script setup lang="ts">
import { type ExportFormat, exportFormats } from "../export/encode";

defineProps<{ disabled: boolean }>();
defineEmits<{ download: [] }>();

const format = defineModel<ExportFormat>("format", { required: true });
const formatIds = Object.keys(exportFormats) as ExportFormat[];
</script>

<template>
  <fieldset class="group">
    <legend>Export</legend>
    <div class="row">
      <label class="visually-hidden" for="export-format">Format</label>
      <select id="export-format" v-model="format">
        <option v-for="id in formatIds" :key="id" :value="id">{{ exportFormats[id].label }}</option>
      </select>
      <button type="button" class="primary grow" :disabled="disabled" @click="$emit('download')">Download</button>
    </div>
    <p class="hint">Original resolution. No metadata, no watermark.</p>
  </fieldset>
</template>
