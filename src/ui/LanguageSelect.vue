<script setup lang="ts">
import { chooseLocale, useTranslation } from "../i18n";
import { isLocale, localeIds, SUPPORTED_LOCALES } from "../i18n/locales";
import AppIcon from "./AppIcon.vue";
import { chevronDown, language } from "./icons";

defineProps<{ iconOnly?: boolean }>();

const { t, locale } = useTranslation();

async function onChange(event: Event) {
  const select = event.target as HTMLSelectElement;
  const chosen = select.value;
  if (!isLocale(chosen)) return;
  // Only the latest choice may put the select back; an overtaken one leaves the newer choice alone.
  if (!(await chooseLocale(chosen)) && select.value === chosen)
    select.value = locale.value;
}
</script>

<template>
  <div class="language" :class="{ 'icon-only': iconOnly }" data-tip-below :data-tip="iconOnly ? t('language.label') : undefined">
    <label class="visually-hidden" for="language">{{ t("language.label") }}</label>
    <AppIcon :icon="language" class="globe" />
    <select id="language" :value="locale" @change="onChange">
      <option v-for="id in localeIds" :key="id" :value="id">{{ SUPPORTED_LOCALES[id] }}</option>
    </select>
    <AppIcon :icon="chevronDown" class="chevron" />
  </div>
</template>

<style scoped>
.language {
  position: relative;
  display: flex;
  align-items: center;
}

select {
  padding-right: 32px;
  padding-left: 36px;
  appearance: none;
}

.globe,
.chevron {
  position: absolute;
  color: var(--text-muted);
  pointer-events: none;
}

.globe {
  left: 10px;
}

.chevron {
  right: 8px;
  width: 16px;
  height: 16px;
}

@media (min-width: 720px) {
  .icon-only::after,
  .icon-only::before {
    display: none;
  }
}

/* Closed, the select shows only the globe; the open list still names every language. */
@media (max-width: 719px) {
  .icon-only select {
    width: 44px;
    padding: 0;
    border-color: transparent;
    background: transparent;
    color: transparent;
  }

  .icon-only select option {
    color: var(--text);
  }

  .icon-only .globe {
    left: 12px;
  }

  .icon-only .chevron {
    display: none;
  }
}

@media (max-width: 719px) and (forced-colors: active) {
  .icon-only select {
    forced-color-adjust: none;
  }
}
</style>
