import type { Metadata } from "next";
import Link from "next/link";
import { BookOpenText, Search, ScrollText } from "lucide-react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tangshi300",
  description: "每日学习一首唐诗",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <div className="app-shell">
          <header className="site-header">
            <Link href="/" className="brand" aria-label="Tangshi300 首页">
              <span className="brand-mark">唐</span>
              <span>
                <strong>Tangshi300</strong>
                <small>每日一诗</small>
              </span>
            </Link>
            <nav className="site-nav" aria-label="主导航">
              <Link href="/" title="今日推荐">
                <BookOpenText size={18} />
                <span>今日</span>
              </Link>
              <Link href="/search" title="搜索唐诗">
                <Search size={18} />
                <span>搜索</span>
              </Link>
              <Link href="/review-book" title="复习册">
                <ScrollText size={18} />
                <span>复习册</span>
              </Link>
            </nav>
          </header>
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
