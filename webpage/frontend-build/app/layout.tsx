import type { Metadata } from "next";
import "./globals.css";
import { AnalyticsProvider } from "../src/context/AnalyticsContext";
import { RoleProvider } from "../src/context/RoleContext";
import { RealtimeProvider } from "../src/context/RealtimeContext";

export const metadata: Metadata = {
  title: "模型工坊 - 创作者AI平台",
  description: "服务模型创作者与制作者的 AI 模型孵化、授权与变现平台"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <AnalyticsProvider>
          <RoleProvider>
            <RealtimeProvider>{children}</RealtimeProvider>
          </RoleProvider>
        </AnalyticsProvider>
      </body>
    </html>
  );
}
