<script setup lang="ts">
import { chooseLocale, useTranslation } from "../i18n";
import { isLocale, localeIds, SUPPORTED_LOCALES } from "../i18n/locales";

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
  <div>
    <label class="visually-hidden" for="language">{{ t("language.label") }}</label>
    <select id="language" :value="locale" @change="onChange">
      <option v-for="id in localeIds" :key="id" :value="id">{{ SUPPORTED_LOCALES[id] }}</option>
    </select>
  </div>
</template>
