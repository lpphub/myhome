import { setupWorker } from "msw/browser"
import { env } from "@/utils/env"
import { handlers } from "./handlers"

// 创建 MSW worker 实例
export const worker = setupWorker(...handlers)

// 启动 mock 服务
export async function startMockService() {
  // 只在开发环境下启动
  if (env.IS_DEV && env.ENABLE_MOCK) {
    await worker.start({
      onUnhandledRequest: "bypass",
    })
    console.log("🚀 Mock Service Worker started")
  }
}
