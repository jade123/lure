import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "满格收纳小屋｜微信小游戏",
  description: "旋转并摆放不同形状的物品，在有限步数内将柜格完整填满。",
};

export default function GamePromotionPage() {
  return (
    <main className="game-page">
      <header className="game-page-header">
        <a className="brand" href="/" aria-label="返回雷强博客首页">
          雷强博客
        </a>
        <a className="game-back" href="/">
          返回首页
        </a>
      </header>

      <section className="game-landing" aria-labelledby="game-title">
        <div className="game-art">
          <img
            src="/full-grid-home-banner.png"
            alt="满格收纳小屋游戏画面"
            width="1200"
            height="630"
          />
        </div>

        <div className="game-details">
          <p className="game-label">微信小游戏 · 免费游玩</p>
          <h1 id="game-title">满格收纳小屋</h1>
          <p className="game-lead">
            旋转不同形状的物品，在有限步数内把柜格刚好填满。每局只需几分钟，越往后越烧脑。
          </p>

          <div className="game-code-card">
            <img
              src="/full-grid-home-code.jpg"
              alt="满格收纳小屋微信小程序码"
              width="258"
              height="258"
            />
            <div>
              <strong>微信扫码开始挑战</strong>
              <p>电脑访问：打开微信扫一扫</p>
              <p>手机微信访问：长按小程序码识别</p>
              <p>也可在微信搜索“满格收纳小屋”</p>
            </div>
          </div>

          <p className="game-note">无需下载 · 自动保存闯关进度</p>
        </div>
      </section>
    </main>
  );
}
