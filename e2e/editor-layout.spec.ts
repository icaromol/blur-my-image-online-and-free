import { expect, type Locator, type Page, test } from "@playwright/test";
import { HEIGHT, makePng, openImage, paint } from "./helpers";

const layouts = {
  phone: { width: 390, height: 844 },
  tablet: { width: 820, height: 1180 },
  desktop: { width: 1366, height: 768 },
};

const box = async (locator: ReturnType<Page["locator"]>) => {
  const rect = await locator.boundingBox();
  if (!rect) throw new Error("Not visible");
  return rect;
};

const tooltipOf = (target: Locator) =>
  target.evaluate((el) => {
    const style = getComputedStyle(el, "::after");
    return {
      text: style.content.replace(/ \/ ""$/, ""),
      opacity: style.opacity,
    };
  });

const tooltip = (page: Page, name: string) =>
  tooltipOf(page.getByRole("button", { name }));

// The bubble is a pseudo-element, so its box comes from the resolved left and width of the ::after.
const tooltipEdges = (target: Locator) =>
  target.evaluate((el) => {
    const style = getComputedStyle(el, "::after");
    const rect = el.getBoundingClientRect();
    const left = rect.left + Number.parseFloat(style.left);
    return {
      left,
      right: left + Number.parseFloat(style.width),
      cardRight: rect.right,
    };
  });

async function openAnyLocale(page: Page) {
  await page.getByLabel(/Image file|Arquivo de imagem/).setInputFiles({
    name: "edge.png",
    mimeType: "image/png",
    buffer: await makePng(page, "edge"),
  });
  await expect(page.locator("canvas")).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/");
});

const applyGroup = (page: Page) => page.getByRole("group", { name: "Apply" });
const effectGroup = (page: Page) =>
  page.getByRole("radiogroup", { name: "Effect" });

test("the rail picks one tool at a time and keeps the selection in the accent", async ({
  page,
}) => {
  await openImage(page, "edge");
  const rail = applyGroup(page);
  const brush = rail.getByRole("button", { name: "Brush" });
  const eraser = rail.getByRole("button", { name: "Eraser" });
  await expect(brush).toHaveAttribute("aria-pressed", "true");
  await expect(eraser).toHaveAttribute("aria-pressed", "false");
  const accent = await brush.evaluate(
    (el) => getComputedStyle(el).borderTopColor,
  );
  expect(accent).not.toBe("rgba(0, 0, 0, 0)");

  await eraser.click();
  await expect(eraser).toHaveAttribute("aria-pressed", "true");
  await expect(brush).toHaveAttribute("aria-pressed", "false");
  expect(
    await eraser.evaluate((el) => getComputedStyle(el).borderTopColor),
  ).toBe(accent);

  await rail.getByRole("button", { name: "Blur entire image" }).click();
  await expect(eraser).toHaveAttribute("aria-pressed", "true");
});

test("the effects sit in the rail: one effect is selected next to the tool", async ({
  page,
}) => {
  await openImage(page, "edge");
  const effects = effectGroup(page);
  await expect(effects.getByRole("radio", { name: "Gaussian" })).toBeChecked();
  await effects.getByText("Pixelate", { exact: true }).click();
  await expect(effects.getByRole("radio", { name: "Pixelate" })).toBeChecked();
  await expect(
    effects.getByRole("radio", { name: "Gaussian" }),
  ).not.toBeChecked();
  await expect(
    applyGroup(page).getByRole("button", { name: "Brush" }),
  ).toHaveAttribute("aria-pressed", "true");
  await expect(page.getByRole("slider", { name: "Angle" })).toHaveCount(0);
  await effects.getByText("Motion", { exact: true }).click();
  await expect(page.getByRole("slider", { name: "Angle" })).toBeVisible();
});

test("every rail card shows an icon with its label", async ({ page }) => {
  await openImage(page, "edge");
  const cards = applyGroup(page).getByRole("button");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toHaveAccessibleName(/^Brush$/);
  await expect(cards.nth(1)).toHaveAccessibleName(/^Eraser$/);
  await expect(cards.nth(2)).toHaveAccessibleName(/^Blur entire image$/);
  await expect(cards.nth(2)).toHaveText("Entire image");
  for (const card of await cards.all()) {
    await expect(card.locator("svg")).toHaveCount(1);
    await expect(card).not.toHaveText("");
  }
  for (const label of await effectGroup(page).locator("label").all()) {
    await expect(label.locator("svg")).toHaveCount(1);
    await expect(label).not.toHaveText("");
  }
});

for (const [locale, names] of [
  [
    "en-US",
    {
      undo: "Undo",
      redo: "Redo",
      tip: "Undo (Ctrl+Z)",
      github: "Blur My Image on GitHub",
      theme: "Theme",
      language: "Language",
      entire: "Blur entire image",
    },
  ],
  [
    "pt-BR",
    {
      undo: "Desfazer",
      redo: "Refazer",
      tip: "Desfazer (Ctrl+Z)",
      github: "Blur My Image no GitHub",
      theme: "Tema",
      language: "Idioma",
      entire: "Desfocar a imagem inteira",
    },
  ],
] as const) {
  test.describe(`icon-only buttons in ${locale}`, () => {
    test.use({ locale });

    test("undo and redo have a name and no visible text", async ({ page }) => {
      await openAnyLocale(page);
      const bar = page.getByRole("button", { name: names.undo });
      await expect(bar).toBeVisible();
      for (const name of [names.undo, names.redo]) {
        const button = page.getByRole("button", { name });
        await expect(button).toHaveText("");
        await expect(button.locator("svg")).toHaveCount(1);
        await expect(button).toHaveAttribute("aria-label", name);
      }
    });

    test("the tooltip shows on hover and on keyboard focus", async ({
      page,
    }) => {
      await openAnyLocale(page);
      await paint(page, [20, HEIGHT / 2], [80, HEIGHT / 2]);
      const undo = page.getByRole("button", { name: names.undo });
      await expect(undo).toBeEnabled();

      expect((await tooltip(page, names.undo)).opacity).toBe("0");
      await undo.hover();
      await expect
        .poll(() => tooltip(page, names.undo))
        .toEqual({ text: `"${names.tip}"`, opacity: "1" });

      await page.mouse.move(0, 0);
      await expect
        .poll(async () => (await tooltip(page, names.undo)).opacity)
        .toBe("0");
      await page.getByRole("application").focus();
      await page.keyboard.press("Tab");
      await expect(undo).toBeFocused();
      await expect
        .poll(() => tooltip(page, names.undo))
        .toEqual({ text: `"${names.tip}"`, opacity: "1" });

      await page.keyboard.press("Escape");
      await expect
        .poll(async () => (await tooltip(page, names.undo)).opacity)
        .toBe("0");
    });

    test("a disabled undo and redo show no tooltip", async ({ page }) => {
      await openAnyLocale(page);
      for (const name of [names.undo, names.redo]) {
        const button = page.getByRole("button", { name });
        await expect(button).toBeDisabled();
        await button.hover({ force: true });
        await page.waitForTimeout(700);
        expect((await tooltip(page, name)).opacity).toBe("0");
      }
    });

    test("the GitHub link has its exact name and a tip that Escape closes", async ({
      page,
    }) => {
      await openAnyLocale(page);
      const github = page
        .locator("#app header")
        .getByRole("link", { name: names.github, exact: true });
      await expect(github).toBeVisible();
      await expect(github).toHaveAttribute("data-tip", names.github);
      const shown = { text: `"${names.github}"`, opacity: "1" };

      await github.hover();
      await expect.poll(() => tooltipOf(github)).toEqual(shown);
      await page.keyboard.press("Escape");
      await expect
        .poll(async () => (await tooltipOf(github)).opacity)
        .toBe("0");

      await page.mouse.move(0, 0);
      await page.getByRole("button", { name: names.theme }).focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expect(github).toBeFocused();
      await expect.poll(() => tooltipOf(github)).toEqual(shown);
      await page.keyboard.press("Escape");
      await expect
        .poll(async () => (await tooltipOf(github)).opacity)
        .toBe("0");
    });

    test("the theme button has a tip", async ({ page }) => {
      await openAnyLocale(page);
      const theme = page
        .locator("#app header")
        .getByRole("button", { name: names.theme });
      await theme.hover();
      await expect
        .poll(() => tooltipOf(theme))
        .toEqual({ text: `"${names.theme}"`, opacity: "1" });
    });

    test("the language control has a tip on a phone and none beside its name", async ({
      page,
    }) => {
      await openAnyLocale(page);
      const wrapper = page.locator("#app header .language");
      const display = () =>
        wrapper.evaluate((el) => getComputedStyle(el, "::after").display);
      expect(await display()).toBe("none");

      await page.setViewportSize(layouts.phone);
      await expect.poll(display).not.toBe("none");
      await wrapper.hover();
      await expect
        .poll(() => tooltipOf(wrapper))
        .toEqual({ text: `"${names.language}"`, opacity: "1" });
    });

    test("the tips carry an empty alternative text, so a screen reader does not read them", async ({
      page,
    }) => {
      await page.setViewportSize(layouts.phone);
      await openAnyLocale(page);
      for (const target of [
        page.locator("#app header .language"),
        page.getByRole("button", { name: names.undo }),
      ])
        expect(
          await target.evaluate(
            (el) => getComputedStyle(el, "::after").content,
          ),
        ).toMatch(/^".+" \/ ""$/);
      await expect(page.locator("#app header")).toMatchAriaSnapshot(`
        - img "Blur My Image"
        - button "${names.theme}"
        - combobox "${names.language}"
        - link "${names.github}"
      `);
    });

    test("a rail tip opens to the right of its card, inside the screen", async ({
      page,
    }) => {
      await page.setViewportSize(layouts.desktop);
      await openAnyLocale(page);
      const card = page.getByRole("button", { name: names.entire });
      await card.hover();
      await expect.poll(async () => (await tooltipOf(card)).opacity).toBe("1");
      const edges = await tooltipEdges(card);
      expect(edges.left).toBeGreaterThanOrEqual(edges.cardRight);
      expect(edges.right).toBeLessThanOrEqual(layouts.desktop.width);
    });

    for (const width of [320, 390]) {
      test(`the last rail tip stays inside a ${width} px screen`, async ({
        page,
      }) => {
        await page.setViewportSize({ width, height: 844 });
        await openAnyLocale(page);
        const card = page.getByRole("button", { name: names.entire });
        await card.focus();
        await expect
          .poll(async () => (await tooltipOf(card)).opacity)
          .toBe("1");
        const edges = await tooltipEdges(card);
        expect(edges.left).toBeGreaterThanOrEqual(0);
        expect(edges.right).toBeLessThanOrEqual(width);
      });
    }
  });
}

test("the keyboard order follows the layout: tools and effects, image, undo and redo, then the panel", async ({
  page,
}) => {
  await openImage(page, "edge");
  await paint(page, [20, HEIGHT / 2], [80, HEIGHT / 2]);
  await page.getByRole("button", { name: "Brush" }).focus();
  const order: string[] = [];
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press("Tab");
    order.push(
      await page.evaluate(() => {
        const el = document.activeElement;
        if (el instanceof HTMLInputElement && el.type === "radio")
          return `radio:${el.value}`;
        return (
          el?.getAttribute("role") ||
          el?.getAttribute("aria-label") ||
          el?.textContent?.replace(/^[BE] /, "").trim() ||
          ""
        );
      }),
    );
  }
  expect(order).toEqual([
    "Eraser",
    "Blur entire image",
    "radio:gaussian",
    "application",
    "Undo",
    "",
  ]);
});

for (const [name, size] of [
  ["a phone", layouts.phone],
  ["a touch tablet", layouts.tablet],
] as const) {
  test.describe(`touch targets on ${name}`, () => {
    test.use({ viewport: size, hasTouch: true });

    test("every control is at least 44 px", async ({ page }) => {
      await openImage(page, "edge");
      await page.locator("#app").getByText("Motion", { exact: true }).click();
      const controls = page
        .locator("#app")
        .locator(
          "a, button, select, input[type=range], input[type=url], label.tool-card",
        );
      expect(await controls.count()).toBeGreaterThan(15);
      for (const control of await controls.all()) {
        const rect = await control.boundingBox();
        if (!rect) continue;
        expect(rect.height, await control.innerHTML()).toBeGreaterThanOrEqual(
          44,
        );
        expect(rect.width, await control.innerHTML()).toBeGreaterThanOrEqual(
          44,
        );
      }
    });
  });
}

for (const [name, size] of Object.entries(layouts)) {
  test.describe(`${name} layout`, () => {
    test.use({ viewport: size });

    test("places the rail, the image, the bar and the panel", async ({
      page,
    }) => {
      await openImage(page, "edge");
      const apply = await box(applyGroup(page));
      const effects = await box(effectGroup(page));
      const canvas = await box(page.locator("canvas"));
      const undo = await box(page.getByRole("button", { name: "Undo" }));
      const download = await box(
        page.getByRole("button", { name: "Download" }),
      );

      expect(undo.y).toBeGreaterThan(canvas.y + canvas.height - 1);
      expect(effects.y).toBeGreaterThan(apply.y);
      if (name === "phone") {
        expect(effects.y + effects.height).toBeLessThanOrEqual(canvas.y);
        expect(download.y).toBeGreaterThan(undo.y);
      } else {
        expect(apply.x + apply.width).toBeLessThanOrEqual(canvas.x);
        expect(effects.x + effects.width).toBeLessThanOrEqual(canvas.x);
      }
      if (name === "desktop")
        expect(download.x).toBeGreaterThanOrEqual(canvas.x + canvas.width);
      else expect(download.y).toBeGreaterThan(undo.y);
    });

    test("the language and theme pickers stay on screen with an image open", async ({
      page,
    }) => {
      await openImage(page, "edge");
      await expect(page.getByLabel("Language")).toBeInViewport();
      await expect(
        page.getByRole("button", { name: "Theme" }),
      ).toBeInViewport();
    });

    test("the page does not scroll sideways", async ({ page }) => {
      await openImage(page, "edge");
      await page.locator("#app").getByText("Motion", { exact: true }).click();
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth -
          document.documentElement.clientWidth,
      );
      expect(overflow).toBe(0);
    });
  });
}

const stage = (page: Page) => page.locator(".stage");
const notice = (page: Page) =>
  page
    .getByRole("status")
    .filter({ hasText: "larger than your graphics card" });

// A strip one pixel wider than the graphics card allows: it opens scaled down and shows the notice.
async function openOversized(page: Page) {
  const max = await page.evaluate(() => {
    const gl = document.createElement("canvas").getContext("webgl2");
    return Number(gl?.getParameter(gl.MAX_TEXTURE_SIZE));
  });
  await page.getByLabel("Image file").setInputFiles({
    name: "huge.png",
    mimeType: "image/png",
    buffer: await makePng(page, "edge", max + 1, 8),
  });
  await expect(notice(page)).toBeVisible();
}

const rejectFile = (page: Page) =>
  page.getByLabel("Image file").setInputFiles({
    name: "notes.png",
    mimeType: "image/png",
    buffer: Buffer.from("hello"),
  });

for (const [name, size] of Object.entries(layouts)) {
  test.describe(`editor messages on ${name}`, () => {
    test.use({ viewport: size });

    for (const [kind, locate, show] of [
      ["the error", (page: Page) => page.getByRole("alert"), rejectFile],
      ["the reduced-image notice", notice, openOversized],
    ] as const) {
      test(`${kind} sits at the top of the stage, above the image, and the rail stays put`, async ({
        page,
      }) => {
        await openImage(page, "edge");
        const before = await box(applyGroup(page));
        await show(page);

        const message = locate(page);
        await expect(message).toBeVisible();
        await expect(stage(page).locator(message)).toHaveCount(1);
        const area = await box(stage(page));
        const rect = await box(message);
        const canvas = await box(page.locator("canvas"));
        expect(rect.y).toBeLessThanOrEqual(area.y + 24);
        expect(rect.y + rect.height).toBeLessThanOrEqual(canvas.y);
        expect(rect.x).toBeLessThan(area.x + 32);
        expect(rect.x + rect.width).toBeGreaterThan(area.x + area.width - 32);
        expect(await box(applyGroup(page))).toEqual(before);
      });
    }
  });
}

test("the Download button stays in view at 1366 × 768 with the notice showing", async ({
  page,
}) => {
  await page.setViewportSize(layouts.desktop);
  await openImage(page, "edge");
  await openOversized(page);
  await expect(page.getByRole("button", { name: "Download" })).toBeInViewport();
});

test("with no image the message stays right below the open area, outside the stage", async ({
  page,
}) => {
  await rejectFile(page);
  const alert = page.getByRole("alert");
  await expect(alert).toBeVisible();
  await expect(stage(page)).toHaveCount(0);
  const input = await box(page.getByRole("region", { name: "Open an image" }));
  expect((await box(alert)).y).toBeGreaterThanOrEqual(
    input.y + input.height - 1,
  );
});

// The home clips overflow-x, so scrollWidth can't see cut content: compare each box's right edge.
for (const locale of ["en", "pt-BR"]) {
  test(`nothing runs past the right edge at 320 px in ${locale}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width: 320, height: 640 });
    await page.addInitScript((l) => localStorage.setItem("locale", l), locale);
    await page.goto("/");
    await openAnyLocale(page);
    await page
      .locator("#app")
      .getByText(/Motion|Movimento/, { exact: true })
      .click();
    const past = await page.evaluate(() =>
      [...document.querySelectorAll("#app, #app *")]
        .filter((el) => el.getBoundingClientRect().right > innerWidth + 0.5)
        .map((el) => `${el.tagName.toLowerCase()}.${el.className}`),
    );
    expect(past).toEqual([]);
    const logo = await box(page.locator("#app header .logo"));
    expect(logo.width).toBeGreaterThanOrEqual(120);
  });
}

test("with an image open the hero's logo is gone and the h1 stays for assistive technology", async ({
  page,
}) => {
  await expect(page.locator(".hero .logo")).toBeVisible();
  await openImage(page, "edge");
  await expect(page.locator(".hero .logo")).toBeHidden();
  await expect(page.getByRole("heading", { level: 1 })).toHaveCount(1);
  expect((await box(page.locator("#app header"))).y).toBeLessThan(32);
});

test("in forced colors the editor's logo keeps its color and the phone language shows only its globe", async ({
  page,
  browserName,
}) => {
  await page.setViewportSize(layouts.phone);
  await page.emulateMedia({ forcedColors: "active" });
  await openImage(page, "edge");
  const logo = page.locator("#app header .logo");
  if (browserName !== "webkit") {
    expect(
      await logo.evaluate((el) => getComputedStyle(el).forcedColorAdjust),
    ).toBe("none");
  }
  expect(
    await logo.evaluate((el) => getComputedStyle(el).backgroundColor),
  ).not.toBe("rgba(0, 0, 0, 0)");
  const select = page.locator("#app header select");
  if (browserName !== "webkit") {
    expect(
      await select.evaluate((el) => getComputedStyle(el).forcedColorAdjust),
    ).toBe("none");
  }
  expect(await select.evaluate((el) => getComputedStyle(el).color)).toBe(
    "rgba(0, 0, 0, 0)",
  );
});

test("the editor's top row has the logo, the theme, the language and the GitHub link", async ({
  page,
}) => {
  await openImage(page, "edge");
  const header = page.locator("#app header");
  await expect(
    header.getByRole("img", { name: "Blur My Image" }),
  ).toBeVisible();
  await expect(header.getByRole("button", { name: "Theme" })).toBeVisible();
  await expect(header.getByLabel("Language")).toBeVisible();
  const github = header.getByRole("link", {
    name: "Blur My Image on GitHub",
    exact: true,
  });
  await expect(github).toHaveAttribute(
    "href",
    "https://github.com/icaromol/blur-my-image-online-and-free",
  );
  await expect(github).toHaveAttribute("rel", "noopener");
});

test("on a phone the language shows only its globe but keeps its name and every language", async ({
  page,
}) => {
  await page.setViewportSize(layouts.phone);
  await openImage(page, "edge");
  const language = page
    .locator("#app")
    .locator("header")
    .getByLabel("Language");
  expect((await box(language)).width).toBe(44);
  await expect(language.locator("option")).toHaveText([
    "English",
    "Português (Brasil)",
  ]);
});

test("on the home the phone language keeps its bordered select and has no tip", async ({
  page,
}) => {
  await page.setViewportSize(layouts.phone);
  const wrapper = page.locator("#app .language");
  await expect(wrapper).toBeVisible();
  await expect(wrapper).not.toHaveAttribute("data-tip");
  expect((await box(wrapper.locator("select"))).width).toBeGreaterThan(44);
  expect(
    await wrapper
      .locator("select")
      .evaluate((el) => getComputedStyle(el).borderTopColor),
  ).not.toBe("rgba(0, 0, 0, 0)");
});

test("the editor's logo is a static file drawn in the theme's text color", async ({
  page,
}) => {
  await openImage(page, "edge");
  const logo = page
    .locator("#app header")
    .getByRole("img", { name: "Blur My Image" });
  const mask = await logo.evaluate(
    (el) =>
      getComputedStyle(el).maskImage || getComputedStyle(el).webkitMaskImage,
  );
  expect(mask).toContain("/logo-horizontal.svg");
  const file = await page.request.get("/logo-horizontal.svg");
  expect(file.ok()).toBe(true);
  expect(file.headers()["content-type"]).toContain("image/svg+xml");

  const color = () =>
    logo.evaluate((el) => getComputedStyle(el).backgroundColor);
  await page.emulateMedia({ colorScheme: "light" });
  await expect.poll(color).toBe("rgb(15, 17, 21)");
  await page.emulateMedia({ colorScheme: "dark" });
  await expect.poll(color).toBe("rgb(242, 243, 245)");
});
