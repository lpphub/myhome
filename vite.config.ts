import { resolve } from "node:path"
import React from "@vitejs/plugin-react"
import UnoCSS from "unocss/vite"
import { defineConfig, loadEnv } from "vite"

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量
  const env = loadEnv(mode, process.cwd(), "")

  return {
    plugins: [React(), UnoCSS()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: 3000,
      open: true,
      // 仅在非 mock 模式下使用代理
      proxy:
        env.VITE_ENABLE_MOCK !== "true"
          ? {
              "/api": {
                target: env.VITE_API_BASE_URL,
                changeOrigin: true,
                rewrite: path => path.replace(/^\/api/, ""),
              },
            }
          : undefined,
    },
  }
})
