import type { Metadata } from "next";
import { AppNavigation } from "@/components/AppNavigation";
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
          <AppNavigation />
          <main>{children}</main>
        </div>
      </body>
    </html>
  );
}
