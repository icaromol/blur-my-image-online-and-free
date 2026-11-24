import { ref } from "vue";

export const themes = ["light", "dark", "system"] as const;
export type Theme = (typeof themes)[number];

// public/theme-init.js applies the stored choice before the first paint with the same rule.
const STORAGE_KEY = "theme";

export function parseTheme(value: string | null): Theme {
  return themes.find((theme) => theme === value) ?? "system";
}

export function savedTheme(): Theme {
  try {
    return parseTheme(localStorage.getItem(STORAGE_KEY));
  } catch {
    return "system";
  }
}

export const systemDark = () => matchMedia("(prefers-color-scheme: dark)");

export function isDark(theme: Theme, systemPrefersDark: boolean): boolean {
  return theme === "dark" || (theme === "system" && systemPrefersDark);
}

export const theme = ref<Theme>(savedTheme());

// Colors jump to the new theme: transitions are off until the new styles have been computed.
export function applyTheme() {
  const root = document.documentElement;
  root.classList.add("theme-switching");
  root.classList.toggle("dark", isDark(theme.value, systemDark().matches));
  getComputedStyle(root).getPropertyValue("color");
  setTimeout(() => root.classList.remove("theme-switching"), 1);
}

export function chooseTheme(chosen: Theme) {
  theme.value = chosen;
  applyTheme();
  try {
    localStorage.setItem(STORAGE_KEY, chosen);
  } catch {
    // Private mode: the choice just doesn't persist.
  }
}
