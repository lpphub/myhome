import { FrownOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Result } from "antd"
import { useEffect, useState } from "react"
import { logger } from "@/utils/logger"

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // 记录错误日志
    logger.error("应用程序错误:", error)
  }, [error])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-5 relative overflow-hidden animate-gradient"
      style={{
        background: "linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab)",
        backgroundSize: "400% 400%",
        animation: "gradientShift 15s ease infinite",
      }}
    >
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>

      <div className="max-w-2xl w-full bg-white/95 backdrop-blur-lg rounded-[20px] p-10 text-center transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
        <div
          className="text-5xl text-red-500 mb-5"
          style={{ animation: "float 3s ease-in-out infinite" }}
        >
          <FrownOutlined />
        </div>

        <Result
          status="error"
          title="哎呀，出现了一些问题"
          subTitle="应用程序遇到了意外错误，请尝试刷新页面或联系技术支持。"
          extra={[
            <div key="buttons" className="flex gap-3 justify-center mt-6">
              <Button
                type="primary"
                icon={<ReloadOutlined />}
                onClick={resetErrorBoundary}
                size="large"
              >
                重新加载
              </Button>
              <Button onClick={() => window.location.reload()} size="large">
                刷新页面
              </Button>
              <Button type="link" onClick={() => setShowDetails(!showDetails)}>
                {showDetails ? "隐藏详情" : "显示详情"}
              </Button>
            </div>,
          ]}
        />

        {showDetails && (
          <div className="bg-gray-100 rounded-lg p-4 m-5 text-left">
            <h4 className="mb-2">错误信息:</h4>
            <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words max-h-50 overflow-y-auto">
              {error.message}
            </pre>
            {error.stack && (
              <>
                <h4 className="mt-4 mb-2">堆栈跟踪:</h4>
                <pre className="text-xs text-gray-600 whitespace-pre-wrap break-words max-h-50 overflow-y-auto">
                  {error.stack}
                </pre>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
