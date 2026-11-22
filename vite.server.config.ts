import { defineConfig } from "vite";

// Bundles the Node server with its dependencies so the Docker image needs no node_modules.
export default defineConfig({
  ssr: { noExternal: true },
  build: {
    ssr: "server/entries/node.ts",
    outDir: "dist-server",
    emptyOutDir: true,
  },
});
