"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type VideoItem = {
  file: string;
  title: string;
  date: string;
};

const COS_BASE =
  "https://companyweb-1310747364.cos.ap-guangzhou.myqcloud.com/jade/assets/videos/";

function fileUrl(file: string) {
  return `${COS_BASE}${encodeURIComponent(file)}`;
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00+08:00`));
}

function formatDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const minutes = Math.floor(seconds / 60);
  const rest = Math.floor(seconds % 60);
  return `${minutes}:${rest.toString().padStart(2, "0")}`;
}

function VideoStill({
  item,
  className = "",
}: {
  item: VideoItem;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [duration, setDuration] = useState("");

  const showFrame = () => {
    const video = ref.current;
    if (!video) return;
    setDuration(formatDuration(video.duration));
    video.currentTime = Math.min(2, Math.max(0, video.duration / 12));
  };

  return (
    <div className={`video-still ${ready ? "is-ready" : ""} ${className}`}>
      <video
        ref={ref}
        src={fileUrl(item.file)}
        muted
        playsInline
        preload="metadata"
        onLoadedMetadata={showFrame}
        onSeeked={() => setReady(true)}
        aria-hidden="true"
      />
      <span className="still-shimmer" aria-hidden="true" />
      <span className="play-mark" aria-hidden="true">
        <i />
      </span>
      {duration && <span className="duration">{duration}</span>}
    </div>
  );
}

export default function Home() {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [active, setActive] = useState<VideoItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/videos.json")
      .then((response) => {
        if (!response.ok) throw new Error("视频清单读取失败");
        return response.json() as Promise<VideoItem[]>;
      })
      .then((items) => setVideos(items))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!active) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActive(null);
    };
    document.body.classList.add("modal-open");
    window.addEventListener("keydown", close);
    return () => {
      document.body.classList.remove("modal-open");
      window.removeEventListener("keydown", close);
    };
  }, [active]);

  const sortedVideos = useMemo(
    () => [...videos].sort((a, b) => b.date.localeCompare(a.date)),
    [videos],
  );
  const featured = sortedVideos[0];
  const archive = sortedVideos.slice(1);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="雷强博客首页">
          雷强博客
        </a>
        <nav aria-label="主导航">
          <a className="nav-active" href="#videos">
            全部视频
          </a>
        </nav>
      </header>

      <section id="top" className="hero" aria-label="最新发布">
        {featured ? (
          <>
            <button
              className="featured-media"
              onClick={() => setActive(featured)}
              aria-label={`播放：${featured.title}`}
            >
              <VideoStill item={featured} className="featured-still" />
            </button>
            <div className="featured-copy">
              <p className="eyebrow">最新发布</p>
              <h1>{featured.title}</h1>
              <p className="featured-date">{formatDate(featured.date)}</p>
              <button className="primary-button" onClick={() => setActive(featured)}>
                <span className="button-play" aria-hidden="true" />
                播放视频
              </button>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <p className="eyebrow">雷强博客</p>
            <h1>{loading ? "正在读取视频" : "第一条记录，正在路上"}</h1>
            <p>水边见，下一竿见。</p>
          </div>
        )}
      </section>

      <section id="videos" className="archive" aria-labelledby="archive-title">
        <div className="section-heading">
          <div>
            <p className="section-kicker">VIDEO LOG</p>
            <h2 id="archive-title">全部视频</h2>
          </div>
          <p>{sortedVideos.length ? `共 ${sortedVideos.length} 条记录` : "等待更新"}</p>
        </div>

        <div className="video-grid">
          {archive.map((item, index) => (
            <article className="video-card" key={item.file}>
              <button
                className="card-media"
                onClick={() => setActive(item)}
                aria-label={`播放：${item.title}`}
              >
                <VideoStill item={item} />
              </button>
              <button className="card-copy" onClick={() => setActive(item)}>
                <span className="card-index">{String(index + 2).padStart(2, "0")}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{formatDate(item.date)}</small>
                </span>
              </button>
            </article>
          ))}
        </div>
      </section>

      <footer>
        <span>雷强博客</span>
        <span>记录每一次真实的抛投</span>
      </footer>

      {active && (
        <div className="player-modal" role="dialog" aria-modal="true" aria-label={active.title}>
          <button
            className="modal-backdrop"
            aria-label="关闭播放器"
            onClick={() => setActive(null)}
          />
          <div className="player-panel">
            <div className="player-heading">
              <div>
                <p>{formatDate(active.date)}</p>
                <h2>{active.title}</h2>
              </div>
              <button className="close-button" onClick={() => setActive(null)} aria-label="关闭">
                ×
              </button>
            </div>
            <video src={fileUrl(active.file)} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </main>
  );
}
