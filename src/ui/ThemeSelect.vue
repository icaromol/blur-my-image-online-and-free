<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref } from "vue";
import { useTranslation } from "../i18n";
import { applyTheme, chooseTheme, systemDark, type Theme, theme, themes } from "./theme";

const { t } = useTranslation();
const open = ref(false);
const root = ref<HTMLElement | null>(null);
const button = ref<HTMLButtonElement | null>(null);
const items = ref<HTMLElement[]>([]);
const media = systemDark();

function followSystem() {
  if (theme.value === "system") applyTheme();
}

function onPointerDown(event: PointerEvent) {
  if (!root.value?.contains(event.target as Node)) open.value = false;
}

onMounted(() => {
  media.addEventListener("change", followSystem);
  window.addEventListener("pointerdown", onPointerDown);
});
onBeforeUnmount(() => {
  media.removeEventListener("change", followSystem);
  window.removeEventListener("pointerdown", onPointerDown);
});

async function show(index: number) {
  open.value = true;
  await nextTick();
  items.value[(index + themes.length) % themes.length]?.focus();
}

function close() {
  open.value = false;
  button.value?.focus();
}

function choose(chosen: Theme) {
  chooseTheme(chosen);
  close();
}

function onButtonClick() {
  if (open.value) open.value = false;
  else void show(themes.indexOf(theme.value));
}

function onButtonKeydown(event: KeyboardEvent) {
  if (event.key === "ArrowDown") void show(themes.indexOf(theme.value));
  else if (event.key === "ArrowUp") void show(-1);
  else return;
  event.preventDefault();
}

function onMenuKeydown(event: KeyboardEvent) {
  const current = items.value.indexOf(document.activeElement as HTMLElement);
  if (event.key === "ArrowDown") void show(current + 1);
  else if (event.key === "ArrowUp") void show(current - 1);
  else if (event.key === "Home") void show(0);
  else if (event.key === "End") void show(-1);
  else if (event.key === "Escape") close();
  else if (event.key === "Tab") open.value = false;
  else return;
  if (event.key !== "Tab") event.preventDefault();
}
</script>

<template>
  <div ref="root" class="theme">
    <button
      id="theme-button"
      ref="button"
      type="button"
      class="trigger"
      aria-haspopup="menu"
      :aria-expanded="open"
      aria-controls="theme-menu"
      :aria-label="t('theme.label')"
      @click="onButtonClick"
      @keydown="onButtonKeydown"
    >
      <svg class="sun" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
      </svg>
      <svg class="moon" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    </button>
    <div
      v-show="open"
      id="theme-menu"
      class="menu"
      role="menu"
      aria-labelledby="theme-button"
      @keydown="onMenuKeydown"
    >
      <button
        v-for="option in themes"
        :key="option"
        ref="items"
        type="button"
        role="menuitemradio"
        tabindex="-1"
        :aria-checked="theme === option"
        @click="choose(option)"
      >
        {{ t(`theme.${option}`) }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.theme {
  position: relative;
}

.trigger {
  display: grid;
  place-items: center;
  width: 36px;
  padding: 0;
}

.trigger .moon,
:root.dark .trigger .sun {
  display: none;
}

:root.dark .trigger .moon {
  display: block;
}

.menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 10;
  display: grid;
  min-width: 140px;
  padding: 4px;
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  background: var(--surface);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.2);
}

.menu button {
  border-color: transparent;
  text-align: left;
}

.menu button:hover,
.menu button:focus-visible {
  background: var(--bg);
}

.menu button[aria-checked="true"] {
  border-color: var(--accent);
  box-shadow: inset 0 0 0 1px var(--accent);
  font-weight: 600;
}
</style>
