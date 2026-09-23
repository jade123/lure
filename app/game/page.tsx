import type { Metadata } from "next";
import Link from "next/link";
import { games } from "../games";

export const metadata: Metadata = {
  title: "我的微信小游戏｜雷强博客",
  description: "实况路亚打黑、满格收纳小屋与这张图不对劲，三款免费微信小游戏。",
  alternates: { canonical: "/game/" },
  openGraph: {
    title: "我的微信小游戏｜雷强博客",
    description: "第一视角雷强模拟与轻松收纳闯关，微信扫码即可游玩。",
    url: "/game/",
    type: "website",
    images: [
      {
        url: "/live-lure-cover.jpg",
        width: 1200,
        height: 675,
        alt: "实况路亚打黑游戏画面",
      },
    ],
  },
};

export default function GamesPage() {
  return (
    <main className="game-page">
      <header className="game-page-header">
        <Link className="brand" href="/" aria-label="返回雷强博客首页">
          雷强博客
        </Link>
        <Link className="game-back" href="/">
          返回首页
        </Link>
      </header>

      <section className="games-page-intro" aria-labelledby="games-page-title">
        <p>MY MINI GAMES</p>
        <h1 id="games-page-title">我做的微信小游戏</h1>
        <span>不用下载，微信扫码就能玩。</span>
      </section>

      <div className="games-page-list">
        {games.map((game, index) => (
          <section className="game-detail-card" id={game.slug} key={game.slug}>
            <div className="game-detail-art">
              <img
                src={game.cover}
                alt={`${game.name}游戏画面`}
                width="1200"
                height="675"
                loading={index === 0 ? "eager" : "lazy"}
                decoding="async"
              />
            </div>

            <div className="game-detail-copy">
              <p className="game-label">微信小游戏 · 免费游玩</p>
              <h2>{game.name}</h2>
              <strong>{game.label}</strong>
              <p className="game-detail-description">{game.description}</p>

              {game.directUrl ? (
                <a className="game-direct-button" href={game.directUrl}>
                  微信内直接打开
                </a>
              ) : null}

              {game.qrCode ? (
                <a
                  className={`game-qr-card game-qr-${game.qrFormat}`}
                  href={game.qrCode}
                  aria-label={`查看${game.name}小程序码`}
                >
                  <img
                    src={game.qrCode}
                    alt={`${game.name}微信小程序码`}
                    width={game.qrFormat === "wide" ? "1086" : "258"}
                    height={game.qrFormat === "wide" ? "400" : "258"}
                    loading="lazy"
                    decoding="async"
                  />
                  <span>
                    <b>微信扫码开始游戏</b>
                    <small>电脑：打开微信扫一扫</small>
                    <small>手机微信：点开后长按识别</small>
                    <small>也可搜索“{game.name}”</small>
                  </span>
                </a>
              ) : (
                <div className="game-search-card">
                  <span aria-hidden="true">微信</span>
                  <div>
                    <b>在微信中搜索</b>
                    <strong>{game.name}</strong>
                    <small>打开微信，下拉进入小程序搜索即可游玩</small>
                  </div>
                </div>
              )}
            </div>
          </section>
        ))}
      </div>

      <p className="games-page-note">三款游戏均已正式上线 · 无需下载安装</p>
    </main>
  );
}
