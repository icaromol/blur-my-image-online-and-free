import { createProxyApp } from "../server/proxy/app.js";
import { loadConfig } from "../server/proxy/config.js";
import { publicOnlyFetch } from "../server/proxy/ssrf.js";

const app = createProxyApp({
  config: loadConfig(process.env),
  fetch: publicOnlyFetch,
});

export const GET = (request: Request) => app.fetch(request);
