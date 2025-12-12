import { QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, theme } from "antd"
import zhCN from "antd/locale/zh_CN"
import React from "react"
import ReactDOM from "react-dom/client"
import { queryClient } from "@/api/query-client"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { App } from "./App"

// Ant Design 主题配置
const antdTheme = {
  algorithm: theme.defaultAlgorithm,
  token: {
    colorPrimary: "#3b82f6",
    borderRadius: 8,
    fontSize: 14,
  },
  components: {
    Layout: {
      headerBg: "#ffffff",
      siderBg: "#ffffff",
    },
  },
}

const rootElement = document.getElementById("root")

if (!rootElement) {
  throw new Error("Failed to find the root element")
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ConfigProvider theme={antdTheme} locale={zhCN}>
          <App />
        </ConfigProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  </React.StrictMode>
)
