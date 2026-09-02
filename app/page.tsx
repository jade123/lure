"use client";

import { useEffect, useState } from "react";
import videoItems from "../public/videos.json";

type VideoItem = {
  videoUrl: string;
  posterUrl: string;
  title: string;
  date: string;
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(`${date}T12:00:00+08:00`));
}

function VideoStill({
  item,
  className = "",
  priority = false,
}: {
  item: VideoItem;
  className?: string;
  priority?: boolean;
}) {
  return (
    <div className={`video-still ${className}`}>
      <img
        src={item.posterUrl}
        alt=""
        width="1280"
        height="720"
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "low"}
        decoding="async"
      />
      <span className="play-mark" aria-hidden="true">
        <i />
      </span>
    </div>
  );
}

export default function Home() {
  const [active, setActive] = useState<VideoItem | null>(null);
  const [showGamePromo, setShowGamePromo] = useState(true);

  useEffect(() => {
    setShowGamePromo(sessionStorage.getItem("game-promo-dismissed") !== "1");
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

  const sortedVideos = [...(videoItems as VideoItem[])].sort((a, b) =>
    b.date.localeCompare(a.date),
  );
  const featured = sortedVideos[0];
  const archive = sortedVideos.slice(1);

  const dismissGamePromo = () => {
    sessionStorage.setItem("game-promo-dismissed", "1");
    setShowGamePromo(false);
  };

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
          <a href="/game/">小游戏</a>
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
              <VideoStill item={featured} className="featured-still" priority />
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
            <h1>第一条记录，正在路上</h1>
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
            <article className="video-card" key={item.videoUrl}>
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
        <span className="footer-brand">雷强博客</span>
        <div className="footer-legal">
          <span>记录每一次真实的抛投</span>
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noreferrer">
            粤ICP备2026121805号-1
          </a>
        </div>
      </footer>

      {showGamePromo && (
        <aside className="game-promo-float" aria-label="小游戏推荐">
          <a href="/game/" aria-label="进入满格收纳小屋小游戏介绍页">
            <img
              src="/full-grid-home-thumb.jpg"
              alt=""
              width="480"
              height="252"
              loading="lazy"
              decoding="async"
            />
            <span>
              <small>微信小游戏</small>
              <strong>满格收纳小屋</strong>
              <em>免费挑战 · 立即进入 →</em>
            </span>
          </a>
          <button type="button" onClick={dismissGamePromo} aria-label="关闭小游戏推荐">
            ×
          </button>
        </aside>
      )}

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
            <video src={active.videoUrl} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </main>
  );
}
