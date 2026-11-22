import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { createProxyApp } from "../proxy/app.js";
import { loadConfig } from "../proxy/config.js";
import { publicOnlyFetch } from "../proxy/node-fetch.js";

const app = createProxyApp({
  config: loadConfig(process.env),
  fetch: publicOnlyFetch,
});

app.use("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
