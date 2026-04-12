import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
  title: "特价机票发现平台",
  description: "聚合国内特价机票，透明比价，发现最低价航班",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-gray-50 font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-100 bg-white py-5 text-center text-xs text-gray-400">
          数据来源：飞常准 · 参考价，以实际购票平台为准 · © 2026 特价机票
        </footer>
      </body>
    </html>
  );
}
