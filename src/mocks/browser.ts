import { setupWorker } from 'msw/browser'
import { handlers } from './handlers'

// 创建 MSW worker 实例
export const worker = setupWorker(...handlers)

// 启动 mock 服务
export async function startMockService() {
  // 只在开发环境下启动
  if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_MOCK === 'true') {
    await worker.start({
      onUnhandledRequest: 'warn',
    })
    console.log('🚀 Mock Service Worker started')
  }
}