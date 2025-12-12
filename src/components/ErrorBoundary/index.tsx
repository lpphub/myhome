import type { ErrorInfo } from "react"
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary"
import { ErrorFallback } from "./ErrorFallback"

// 错误日志函数
function logErrorToService(error: Error, info: ErrorInfo) {
  // 在生产环境，这里可以将错误发送到错误监控服务
  // 例如 Sentry, LogRocket 等
  console.group("🚨 应用程序错误")
  console.error("错误:", error)
  console.info("组件堆栈:", info.componentStack || "无堆栈信息")
  console.groupEnd()

  // 示例：发送到错误监控服务
  // if (import.meta.env.PROD) {
  //   Sentry.captureException(error, {
  //     contexts: {
  //       react: {
  //         componentStack: info.componentStack,
  //       },
  //     },
  //   })
  // }
}

// 错误边界组件属性
interface ErrorBoundaryProps {
  children: React.ReactNode
  FallbackComponent?: React.ComponentType<{ error: Error; resetErrorBoundary: () => void }>
  onError?: (error: Error, info: ErrorInfo) => void
}

// 全局错误边界组件
export function ErrorBoundary({
  children,
  FallbackComponent = ErrorFallback,
  onError = logErrorToService,
}: ErrorBoundaryProps) {
  return (
    <ReactErrorBoundary
      FallbackComponent={FallbackComponent}
      onError={onError}
      onReset={() => {
        // 重置时可以清理一些状态
        window.scrollTo(0, 0)
      }}
    >
      {children}
    </ReactErrorBoundary>
  )
}

// 导出默认的错误回退组件
export { ErrorFallback } from "./ErrorFallback"
