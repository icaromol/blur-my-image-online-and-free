import { createI18n, useI18n } from "vue-i18n";
import { DEFAULT_LOCALE, type Locale } from "./locales";
import en from "./messages/en.json";

export type MessageSchema = typeof en;

type Paths<T> = {
  [K in keyof T & string]: T[K] extends string ? K : `${K}.${Paths<T[K]>}`;
}[keyof T & string];

export type MessageKey = Paths<MessageSchema>;

const STORAGE_KEY = "locale";

export const i18n = createI18n<{ message: MessageSchema }, string, false>({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: { en },
});

const loaders = import.meta.glob<{ default: MessageSchema }>([
  "./messages/*.json",
  "!./messages/en.json",
]);

export async function loadLocale(locale: Locale): Promise<void> {
  if (i18n.global.availableLocales.includes(locale)) return;
  const load = loaders[`./messages/${locale}.json`];
  if (load) i18n.global.setLocaleMessage(locale, (await load()).default);
}

export async function setLocale(locale: Locale): Promise<void> {
  await loadLocale(locale);
  i18n.global.locale.value = locale;
  document.documentElement.lang = locale;
  document.title = i18n.global.t("app.title");
}

export function savedLocale(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function chooseLocale(locale: Locale): Promise<void> {
  await setLocale(locale);
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Private mode: the choice just doesn't persist.
  }
}

export function errorKey(code: string): MessageKey {
  return Object.hasOwn(en.errors, code)
    ? (`errors.${code}` as MessageKey)
    : "errors.unknown";
}

// vue-i18n's own t() accepts any string, so a typo in a key would only show up at runtime.
export function useTranslation() {
  const { t, n, locale } = useI18n();
  return {
    t: (key: MessageKey, named?: Record<string, unknown>) =>
      named ? t(key, named) : t(key),
    n,
    locale,
  };
}
