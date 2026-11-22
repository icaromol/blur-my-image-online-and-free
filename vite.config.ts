import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [vue()],
  // jSquash loads its WebAssembly with import.meta.url, which pre-bundling would break.
  optimizeDeps: { exclude: ["@jsquash/webp"] },
  test: {
    include: ["src/**/*.test.ts", "server/**/*.test.ts"],
  },
});
