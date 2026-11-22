export const SUPPORTED_LOCALES = {
  en: "English",
  "pt-BR": "Português (Brasil)",
} as const;

export type Locale = keyof typeof SUPPORTED_LOCALES;

export const DEFAULT_LOCALE: Locale = "en";

export const localeIds = Object.keys(SUPPORTED_LOCALES) as Locale[];

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && Object.hasOwn(SUPPORTED_LOCALES, value);
}

function baseLanguage(tag: string): string {
  return tag.split("-")[0].toLowerCase();
}

export function resolveLocale(
  saved: string | null | undefined,
  browserLanguages: readonly string[],
): Locale {
  if (isLocale(saved)) return saved;
  for (const tag of browserLanguages) {
    const exact = localeIds.find(
      (id) => id.toLowerCase() === tag.toLowerCase(),
    );
    if (exact) return exact;
    const sameLanguage = localeIds.find(
      (id) => baseLanguage(id) === baseLanguage(tag),
    );
    if (sameLanguage) return sameLanguage;
  }
  return DEFAULT_LOCALE;
}
