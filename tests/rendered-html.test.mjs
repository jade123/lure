import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, { headers: { accept: "text/html" } }),
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
  assert.match(html, /小游戏/);
  assert.match(html, /game-promo-float/);
  assert.doesNotMatch(html, /game-promo-wrap/);
  assert.doesNotMatch(html, /<video\b|\/media\/|\/assets\/videos\//);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("renders the game promotion landing page", async () => {
  const response = await render("/game");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /满格收纳小屋/);
  assert.match(html, /微信扫码开始挑战/);
  assert.match(html, /full-grid-home-code\.jpg/);
  assert.match(html, /rel="canonical" href="http:\/\/www\.lure\.red\/game\/"/);
});

test("ships video data without starter preview files", async () => {
  const videos = JSON.parse(await readFile(new URL("../public/videos.json", import.meta.url), "utf8"));
  assert.ok(videos.length >= 1);
  assert.ok(
    videos.every(
      (item) =>
        item.videoUrl.startsWith("http://cnd.lure.red/jade/assets/videos/") &&
        item.videoUrl.endsWith("-15Mbps.mp4") &&
        item.posterUrl.startsWith("/posters/") &&
        item.title &&
        /^\d{4}-\d{2}-\d{2}$/.test(item.date),
    ),
  );
  await Promise.all(
    videos.map((item) => access(new URL(`../public${item.posterUrl}`, import.meta.url))),
  );
  await assert.rejects(access(new URL("../app/_sites-preview/SkeletonPreview.tsx", import.meta.url)));
  await access(new URL("../public/og.png", import.meta.url));
});

test("keeps the trial site and CDN on HTTP", async () => {
  const config = await readFile(new URL("../app/site-config.ts", import.meta.url), "utf8");
  assert.match(config, /SITE_URL = "http:\/\/www\.lure\.red"/);
  const videos = JSON.parse(await readFile(new URL("../public/videos.json", import.meta.url), "utf8"));
  assert.ok(videos.every((item) => item.videoUrl.startsWith("http://")));
});
