<script setup lang="ts">
import { chooseLocale, useTranslation } from "../i18n";
import { isLocale, localeIds, SUPPORTED_LOCALES } from "../i18n/locales";

const { t, locale } = useTranslation();

function onChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value;
  if (isLocale(value)) void chooseLocale(value);
}
</script>

<template>
  <div>
    <label class="visually-hidden" for="language">{{ t("language.label") }}</label>
    <select id="language" :value="locale" @change="onChange">
      <option v-for="id in localeIds" :key="id" :value="id">{{ SUPPORTED_LOCALES[id] }}</option>
    </select>
  </div>
</template>
