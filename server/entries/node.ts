import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { pageHeaders } from "../../security-headers.js";
import { createProxyApp } from "../proxy/app.js";
import { loadConfig } from "../proxy/config.js";
import { publicOnlyFetch } from "../proxy/node-fetch.js";

const app = createProxyApp({
  config: loadConfig(process.env),
  fetch: publicOnlyFetch,
});

app.use("*", async (c, next) => {
  if (!c.req.path.startsWith("/api/")) {
    for (const [name, value] of Object.entries(pageHeaders))
      c.header(name, value);
  }
  await next();
});

// Unknown API paths get the proxy's JSON 404, not the SPA shell.
app.all("/api/*", (c) => c.notFound());

app.use("*", serveStatic({ root: "./dist" }));
app.get("*", serveStatic({ path: "./dist/index.html" }));

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`Listening on http://localhost:${info.port}`);
});
