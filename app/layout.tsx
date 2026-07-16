import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "天机接口｜今日赛博求签",
  description: "选择此刻所问之事，抽取属于今天的一支签。天机不会替你决定，只会照亮尚未被看见的线索。",
  keywords: ["赛博求签", "今日运势", "互动网页", "天机接口"],
  icons: { icon: "./favicon.svg" },
  openGraph: {
    title: "天机接口｜向未知借一束光",
    description: "每日一签，照见心中已有的答案。",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
