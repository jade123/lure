# 雷强博客

`www.lure.red` 的视频博客源码。首页使用本地视频封面，用户点击后才从腾讯云 CDN 加载所选视频。

站点与视频域名集中配置在 `app/site-config.ts`。当前试运行配置为 HTTP 网站配合 HTTP CDN。

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
