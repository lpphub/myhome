import { QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, theme } from "antd"
import zhCN from "antd/locale/zh_CN"
import React from "react"
import ReactDOM from "react-dom/client"
import { queryClient } from "@/api/query-client"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { startMockService } from "@/mocks/browser"
import { antdWarmTheme } from "@/styles/theme"
import { App } from "./App"

// 启动 Mock 服务（仅在开发环境）
startMockService()

// 使用暖调主题
const antdThemeConfig = {
  ...antdWarmTheme,
  algorithm: theme.defaultAlgorithm,
}

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Failed to find the root element")
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antdThemeConfig} locale={zhCN}>
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
