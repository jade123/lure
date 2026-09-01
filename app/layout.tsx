import type { Metadata } from "next";
import "./globals.css";
import { SITE_URL } from "./site-config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "雷强博客｜真实雷强作钓视频",
  description: "记录每一次真实的抛投，分享雷强实战、钓场观察与水边故事。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "雷强博客",
    description: "记录每一次真实的抛投。",
    url: SITE_URL,
    siteName: "雷强博客",
    locale: "zh_CN",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "雷强博客" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "雷强博客",
    description: "记录每一次真实的抛投。",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
