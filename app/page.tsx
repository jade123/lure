import videoItems from "../public/videos.json";

type VideoItem = {
  file: string;
  title: string;
  date: string;
};

const VIDEO_BASE = "http://cnd.lure.red/jade/assets/videos/";

function fileUrl(file: string) {
  return `${VIDEO_BASE}${encodeURIComponent(file)}`;
}

function posterUrl(file: string) {
  return `/posters/${encodeURIComponent(file)}.jpg`;
}

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
        src={posterUrl(item.file)}
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
  const sortedVideos = [...(videoItems as VideoItem[])].sort((a, b) =>
    b.date.localeCompare(a.date),
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
            <a
              className="featured-media"
              href={fileUrl(featured.file)}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`播放：${featured.title}`}
            >
              <VideoStill item={featured} className="featured-still" priority />
            </a>
            <div className="featured-copy">
              <p className="eyebrow">最新发布</p>
              <h1>{featured.title}</h1>
              <p className="featured-date">{formatDate(featured.date)}</p>
              <a
                className="primary-button"
                href={fileUrl(featured.file)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="button-play" aria-hidden="true" />
                播放视频
              </a>
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
            <article className="video-card" key={item.file}>
              <a
                className="card-media"
                href={fileUrl(item.file)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`播放：${item.title}`}
              >
                <VideoStill item={item} />
              </a>
              <a
                className="card-copy"
                href={fileUrl(item.file)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="card-index">{String(index + 2).padStart(2, "0")}</span>
                <span>
                  <strong>{item.title}</strong>
                  <small>{formatDate(item.date)}</small>
                </span>
              </a>
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

    </main>
  );
}
