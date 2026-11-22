<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { parseImageUrl } from "../input/url";

defineProps<{ compact: boolean; loading: boolean }>();
const emit = defineEmits<{ file: [file: File]; url: [url: URL]; invalid: [message: string] }>();

const picker = useTemplateRef<HTMLInputElement>("picker");
const link = ref("");

function onPick(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  input.value = "";
  if (file) emit("file", file);
}

function onSubmit() {
  const url = parseImageUrl(link.value);
  if (!url) {
    emit("invalid", "Enter an http or https link to an image.");
    return;
  }
  emit("url", url);
  link.value = "";
}
</script>

<template>
  <section class="input" :class="{ compact }" aria-label="Open an image">
    <button type="button" class="drop-zone" @click="picker?.click()">
      <span class="drop-title">{{ compact ? "Open another image" : "Choose an image" }}</span>
      <span v-if="!compact" class="drop-hint">or drop it anywhere, or paste it with Ctrl+V</span>
    </button>
    <input
      ref="picker"
      type="file"
      accept="image/*"
      class="visually-hidden"
      aria-label="Image file"
      tabindex="-1"
      @change="onPick"
    />

    <form class="url-form" @submit.prevent="onSubmit">
      <label class="visually-hidden" for="image-url">Image URL</label>
      <input
        id="image-url"
        v-model="link"
        type="url"
        inputmode="url"
        placeholder="Paste an image link"
        autocomplete="off"
        :disabled="loading"
      />
      <button type="submit" :disabled="loading || !link.trim()">{{ loading ? "Loading…" : "Load" }}</button>
    </form>
  </section>
</template>

<style scoped>
.input {
  display: grid;
  gap: 12px;
}

.drop-zone {
  display: grid;
  gap: 4px;
  place-items: center;
  align-content: center;
  min-height: 220px;
  padding: 24px;
  border: 2px dashed var(--border-strong);
  border-radius: var(--radius);
  background: var(--surface);
  color: var(--text);
  cursor: pointer;
}

.drop-zone:hover {
  border-color: var(--accent);
}

.compact .drop-zone {
  min-height: 0;
  padding: 10px 12px;
  border-width: 1px;
  border-style: solid;
}

.drop-title {
  font-weight: 600;
}

.drop-hint {
  color: var(--text-muted);
  font-size: 0.9rem;
}

.url-form {
  display: flex;
  gap: 8px;
}

.url-form input {
  flex: 1;
  min-width: 0;
}
</style>
