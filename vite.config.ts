import { fileURLToPath } from "node:url";
import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";
import { pageHeaders } from "./security-headers.ts";

export default defineConfig({
  plugins: [
    vue(),
    // Compiles the message files at build time, so the bundle ships vue-i18n's runtime
    // without its message compiler. Also sets the __VUE_I18N_*__ feature flags.
    VueI18nPlugin({
      include: [
        fileURLToPath(new URL("./src/i18n/messages/**", import.meta.url)),
      ],
      runtimeOnly: true,
      dropMessageCompiler: true,
      compositionOnly: true,
      fullInstall: false,
    }),
  ],
  // jSquash loads its WebAssembly with import.meta.url, which pre-bundling would break.
  optimizeDeps: { exclude: ["@jsquash/webp"] },
  // Playwright runs against `vite preview`, so e2e tests run under the real CSP.
  preview: { headers: { ...pageHeaders } },
  build: { license: { fileName: "licenses.md" } },
  test: {
    include: ["src/**/*.test.ts", "server/**/*.test.ts", "*.test.ts"],
    coverage: {
      provider: "v8",
      include: ["src/engine/**", "server/proxy/**"],
      // WebGL code (and the lazy import that loads it) can't run under Node; e2e covers it.
      exclude: [
        "**/*.test.ts",
        "src/engine/renderer.ts",
        "src/engine/effects.ts",
        "src/engine/motion-blur-filter.ts",
        "src/engine/load-renderer.ts",
      ],
      thresholds: { lines: 90, functions: 90, statements: 90, branches: 85 },
    },
  },
});
