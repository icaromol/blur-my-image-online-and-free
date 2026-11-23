import { randomUUID } from "node:crypto";
import { defineConfig, devices } from "@playwright/test";

// Workers re-evaluate this file and inherit the env, so `||=` keeps one dir per run (an empty value counts as unset).
process.env.E2E_OUTPUT_DIR ||= `test-results/${randomUUID().slice(0, 8)}`;

export default defineConfig({
  testDir: "e2e",
  outputDir: process.env.E2E_OUTPUT_DIR,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // The html report is what CI uploads when a run fails; `github` adds inline annotations.
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  use: {
    baseURL: `http://localhost:${process.env.E2E_PORT}`,
    locale: "en-US",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "node scripts/e2e-server.mjs",
    // Ready only when our own server prints its address; Playwright exports the group as E2E_PORT.
    wait: { stdout: /Local:\s+https?:\/\/\S+?:(?<e2e_port>\d+)\// },
    reuseExistingServer: false,
    gracefulShutdown: { signal: "SIGTERM", timeout: 5000 },
  },
});
