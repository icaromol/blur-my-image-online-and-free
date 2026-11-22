import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";
import { pageHeaders } from "./security-headers";

export default defineConfig({
  plugins: [vue()],
  // jSquash loads its WebAssembly with import.meta.url, which pre-bundling would break.
  optimizeDeps: { exclude: ["@jsquash/webp"] },
  // Playwright runs against `vite preview`, so e2e tests run under the real CSP.
  preview: { headers: { ...pageHeaders } },
  build: { license: { fileName: "licenses.md" } },
  define: {
    __VUE_I18N_FULL_INSTALL__: false,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
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
