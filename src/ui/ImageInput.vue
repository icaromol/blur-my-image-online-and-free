<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { useTranslation } from "../i18n";
import { parseImageUrl } from "../input/url";
import AppIcon from "./AppIcon.vue";
import { link as linkIcon, load as loadIcon, openImage } from "./icons";

defineProps<{ compact: boolean; loading: boolean }>();
const emit = defineEmits<{ file: [file: File]; url: [url: URL]; invalid: [code: string] }>();

const { t } = useTranslation();
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
    emit("invalid", "invalid_link");
    return;
  }
  emit("url", url);
  link.value = "";
}
</script>

<template>
  <section class="input" :class="{ compact }" :aria-label="t('input.region')">
    <button type="button" class="drop-zone" @click="picker?.click()">
      <AppIcon v-if="compact" :icon="openImage" />
      <span class="drop-title">{{ compact ? t("input.chooseAnother") : t("input.choose") }}</span>
      <span v-if="!compact" class="drop-hint">{{ t("input.hint") }}</span>
    </button>
    <input
      ref="picker"
      type="file"
      accept="image/*"
      class="visually-hidden"
      :aria-label="t('input.fileLabel')"
      tabindex="-1"
      @change="onPick"
    />

    <form class="url-form" @submit.prevent="onSubmit">
      <label class="visually-hidden" for="image-url">{{ t("input.urlLabel") }}</label>
      <span class="url-field">
        <AppIcon v-if="compact" :icon="linkIcon" class="link-icon" />
        <input
          id="image-url"
          v-model="link"
          type="url"
          inputmode="url"
          :placeholder="t('input.urlPlaceholder')"
          autocomplete="off"
          :disabled="loading"
          aria-describedby="image-url-notice"
        />
      </span>
      <button
        type="submit"
        :disabled="loading || !link.trim()"
        :aria-label="loading ? t('input.loading') : t('input.load')"
        :data-tip="compact ? t('input.load') : undefined"
      >
        <template v-if="!compact">{{ loading ? t("input.loading") : t("input.load") }}</template>
        <span v-else-if="loading" class="spinner" />
        <AppIcon v-else :icon="loadIcon" />
      </button>
    </form>
    <p id="image-url-notice" class="url-notice">{{ t("input.linkNotice") }}</p>
  </section>
</template>

<style scoped>
.input {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
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

.url-field {
  position: relative;
  display: flex;
  flex: 1;
  min-width: 0;
}

.url-field input {
  flex: 1;
  min-width: 0;
}

.link-icon {
  position: absolute;
  top: 50%;
  left: 10px;
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  transform: translateY(-50%);
}

.link-icon + input {
  padding-left: 36px;
}

.compact .drop-zone {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .spinner {
    animation-duration: 3s;
  }
}

.url-notice {
  margin: 0;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
