import { mkdir, writeFile } from "node:fs/promises";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("export", Date.now().toString());
const { default: worker } = await import(workerUrl.href);

const routes = [
  { pathname: "/", output: "../dist/client/index.html" },
  { pathname: "/game", output: "../dist/client/game/index.html" },
];

for (const route of routes) {
  const response = await worker.fetch(
    new Request(`http://www.lure.red${route.pathname}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );

  if (!response.ok) {
    throw new Error(`Static export failed for ${route.pathname} with ${response.status}`);
  }

  const output = new URL(route.output, import.meta.url);
  await mkdir(new URL("./", output), { recursive: true });
  await writeFile(output, await response.text());
  console.log(`Exported ${route.pathname} to ${output.pathname}`);
}
