import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ConfigProvider, theme } from "antd"
import zhCN from "antd/locale/zh_CN"
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterProvider } from "react-router"
import { router } from "./router"
import "@unocss/reset/normalize.css"
import "uno.css"
import "./styles/global.css"

// 创建 QueryClient 实例
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
})

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={antdTheme} locale={zhCN}>
        <RouterProvider router={router} />
      </ConfigProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
