"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, BookOpenText, CalendarDays, ChevronDown, Home, Menu, User } from "lucide-react";

const navItems = [
  { href: "/", label: "首页", icon: Home, key: "home" },
  { href: "/search", label: "诗库", icon: BookOpenText, key: "library" },
  { href: "/", label: "学习", icon: BookOpen, key: "learn" },
  { href: "/review-book", label: "复习册", icon: CalendarDays, key: "review" },
  { href: "#profile", label: "我的", icon: User, key: "profile" },
];

function activeKey(pathname: string) {
  if (pathname === "/review-book") return "review";
  if (pathname === "/search" || (pathname.startsWith("/poems/") && !pathname.endsWith("/test"))) return "library";
  if (pathname.startsWith("/poems/") && pathname.endsWith("/test")) return "learn";
  return "home";
}

export function AppNavigation() {
  const pathname = usePathname();
  const current = activeKey(pathname);

  return (
    <>
      <header className="app-header">
        <Link href="/" className="brand-wordmark" aria-label="Tangshi300 首页">
          <span>Tangshi</span>
          <strong>300</strong>
          <em>唐诗三百</em>
        </Link>
        <nav className="desktop-nav" aria-label="主导航">
          {navItems.map(({ href, label, icon: Icon, key }) => (
            <Link className={current === key ? "is-active" : ""} href={href} key={key}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
        <div className="account-menu" id="profile">
          <span className="avatar-painting" aria-hidden="true" />
          <ChevronDown size={16} aria-hidden="true" />
        </div>
        <button className="mobile-menu-button" type="button" aria-label="打开菜单">
          <Menu size={24} />
        </button>
      </header>
      <nav className="bottom-tabs" aria-label="移动端主导航">
        {navItems.map(({ href, label, icon: Icon, key }) => (
          <Link className={current === key ? "is-active" : ""} href={href} key={key}>
            <Icon size={21} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
