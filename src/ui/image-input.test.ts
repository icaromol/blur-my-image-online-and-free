import { describe, expect, it } from "vitest";
import { createSSRApp } from "vue";
import { renderToString } from "vue/server-renderer";
import { i18n, loadLocale } from "../i18n";
import type { Locale } from "../i18n/locales";
import ImageInput from "./ImageInput.vue";

async function render(locale: Locale, compact: boolean): Promise<string> {
  await loadLocale(locale);
  i18n.global.locale.value = locale;
  const app = createSSRApp(ImageInput, { compact, loading: false });
  app.use(i18n);
  return renderToString(app);
}

function describedBy(html: string): { id: string; text: string } {
  const field = /<input[^>]*id="image-url"[^>]*>/.exec(html)?.[0] ?? "";
  const id = /aria-describedby="([^"]+)"/.exec(field)?.[1] ?? "";
  const target = new RegExp(`<[^>]+id="${id}"[^>]*>([^<]*)<`).exec(html);
  return { id, text: target?.[1] ?? "" };
}

describe("the notice under the link field", () => {
  const notices: [Locale, string][] = [
    [
      "en",
      "Links are fetched through our server. Files you open, drop or paste never leave your browser.",
    ],
    [
      "pt-BR",
      "Links são buscados pelo nosso servidor. Arquivos que você abre, solta ou cola nunca saem do seu navegador.",
    ],
  ];

  // `compact` is the layout App uses while an image is open.
  for (const compact of [false, true]) {
    for (const [locale, text] of notices) {
      it(`is the field's description in ${locale}${compact ? " with an image open" : ""}`, async () => {
        const description = describedBy(await render(locale, compact));

        expect(description.id).not.toBe("");
        expect(description.text).toBe(text);
      });
    }
  }
});
