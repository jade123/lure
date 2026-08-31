import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("renders the finished Chinese video site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /雷强博客/);
  assert.match(html, /全部视频/);
  assert.match(html, /粤ICP备2026121805号-1/);
  assert.match(html, /傍晚窗口期，水草边的一竿/);
  assert.match(html, /\/posters\/1788083767245\.MOV\.jpg/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships video data without starter preview files", async () => {
  const videos = JSON.parse(await readFile(new URL("../public/videos.json", import.meta.url), "utf8"));
  assert.ok(videos.length >= 1);
  assert.ok(videos.every((item) => item.file && item.title && /^\d{4}-\d{2}-\d{2}$/.test(item.date)));
  await Promise.all(
    videos.map((item) => access(new URL(`../public/posters/${item.file}.jpg`, import.meta.url))),
  );
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  await access(new URL("../public/og.png", import.meta.url));
});
