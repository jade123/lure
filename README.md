# 雷强博客

`www.lure.red` 的视频博客源码。首页直接从腾讯云 COS 播放视频，并在浏览器中定位到视频开头约 2 秒作为封面，不要求单独上传封面图片。

## 视频更新

视频存放在：

```text
companyweb-1310747364/jade/assets/videos/
```

展示清单位于 `public/videos.json`。每项包含 COS 文件名、展示标题与拍摄日期；更新清单后重新部署即可。

推荐文件名：

```text
标题-2026-08-31.mp4
```

## 本地运行

```bash
npm install
npm run dev
npm test
```

需要 Node.js 22 或更高版本。
