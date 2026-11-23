// Playwright's webServer command: builds into a private directory and serves it with
// `vite preview`. Plain Node, so the same command runs under sh and cmd.exe.
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { build, preview } from "vite";

const outDir = mkdtempSync(join(tmpdir(), "bmi-e2e-"));
let server;

process.on("exit", () => rmSync(outDir, { recursive: true, force: true }));

const stop = async (code) => {
  await server?.close();
  process.exit(code);
};
process.on("SIGTERM", () => stop(0));
process.on("SIGINT", () => stop(0));

try {
  await build({ logLevel: "warn", build: { outDir, emptyOutDir: true } });
  server = await preview({
    build: { outDir },
    preview: { port: Number(process.env.E2E_PORT ?? 0), strictPort: true },
  });
  server.printUrls();
} catch (error) {
  console.error(error);
  await stop(1);
}
