"use client";

import { useEffect, useState } from "react";
import videoItems from "../public/videos.json";
import { games } from "./games";

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
          <a href="#games">小游戏</a>
          <a href="#douyin">关注抖音</a>
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

      <section id="games" className="games-showcase" aria-labelledby="games-title">
        <div className="section-heading games-heading">
          <div>
            <p className="section-kicker">MY MINI GAMES</p>
            <h2 id="games-title">我的微信小游戏</h2>
          </div>
          <a href="/game/">查看游戏与小程序码</a>
        </div>

        <div className="games-grid">
          {games.map((game, index) => (
            <a className="game-home-card" href={`/game/#${game.slug}`} key={game.slug}>
              <div className="game-home-art">
                <img
                  src={game.cover}
                  alt={`${game.name}游戏画面`}
                  width="1200"
                  height="675"
                  loading="lazy"
                  decoding="async"
                />
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="game-home-copy">
                <p>{game.label}</p>
                <h3>{game.name}</h3>
                <small>{game.highlight}</small>
                <strong>
                  {game.qrCode ? "微信扫码游玩" : "微信搜索游玩"} <i aria-hidden="true">→</i>
                </strong>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section id="douyin" className="douyin-follow" aria-labelledby="douyin-title">
        <div className="douyin-copy">
          <p className="douyin-kicker">抖音追更</p>
          <h2 id="douyin-title">在抖音，继续看真实雷强实战</h2>
          <p className="douyin-lead">
            短视频更新更快。水草区搜索、扬竿中鱼和装备细节，都会第一时间发在抖音。
          </p>
          <div className="douyin-account">
            <span>DOUYIN</span>
            <strong>@路亚码农</strong>
            <small>抖音号：385933823</small>
          </div>
          <div className="douyin-actions">
            <a href="/douyin-luyamanong.jpg" download>
              保存抖音码
            </a>
            <p>保存图片后，打开抖音扫一扫</p>
          </div>
        </div>

        <a
          className="douyin-code"
          href="/douyin-luyamanong.jpg"
          aria-label="查看路亚码农抖音账号二维码"
        >
          <img
            src="/douyin-luyamanong.jpg"
            alt="路亚码农抖音账号二维码，抖音号 385933823"
            width="1125"
            height="1680"
            loading="lazy"
            decoding="async"
          />
          <span>扫码关注 · 看更多实战片段</span>
        </a>
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
          <a href="#games" aria-label="查看我的三款微信小游戏">
            <img
              src="/live-lure-cover.jpg"
              alt=""
              width="1920"
              height="1080"
              loading="lazy"
              decoding="async"
            />
            <span>
              <small>我的微信小游戏</small>
              <strong>3 款游戏，免费游玩</strong>
              <em>打黑 · 收纳 · 找茬益智 →</em>
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
            {/* Video logs are recorded outdoors and do not include a separate caption track. */}
            {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
            <video src={active.videoUrl} controls autoPlay playsInline />
          </div>
        </div>
      )}
    </main>
  );
}
