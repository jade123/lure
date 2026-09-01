import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptsDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(scriptsDir);
const sourceDir = process.env.LURE_VIDEO_DIR || join(homedir(), "Desktop", "视频");
const outputDir = join(projectDir, "public", "posters");
const videos = JSON.parse(readFileSync(join(projectDir, "public", "videos.json"), "utf8"));
const extractor = join(scriptsDir, "extract-video-frame.swift");

mkdirSync(outputDir, { recursive: true });

let generated = 0;
let skipped = 0;

for (const video of videos) {
  const sourceName = decodeURIComponent(new URL(video.videoUrl).pathname.split("/").pop());
  const posterName = decodeURIComponent(new URL(video.posterUrl, "http://localhost").pathname.split("/").pop());
  const source = join(sourceDir, sourceName);
  const output = join(outputDir, posterName);

  if (!existsSync(source)) {
    console.warn(`跳过（本地未找到）：${sourceName}`);
    skipped += 1;
    continue;
  }

  execFileSync("swift", [extractor, source, output], { stdio: "inherit" });
  generated += 1;
}

console.log(`封面完成：生成 ${generated} 张，跳过 ${skipped} 张。`);
