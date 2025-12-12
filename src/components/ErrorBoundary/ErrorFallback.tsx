import { FrownOutlined, ReloadOutlined } from "@ant-design/icons"
import { Button, Result } from "antd"
import { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"

// 错误图标动画
const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
`

// 背景动画
const bgAnimation = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`

// 样式化容器
const ErrorContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: ${bgAnimation} 15s ease infinite;
  padding: 20px;
`

// 错误卡片容器
const ErrorCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  text-align: center;
  transform: translateY(0);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
  }
`

// 错误图标样式
const ErrorIcon = styled.div`
  font-size: 80px;
  color: #ff4d4f;
  margin-bottom: 20px;
  animation: ${floatAnimation} 3s ease-in-out infinite;
`

// 错误详情样式
const ErrorDetails = styled.div`
  background: #f5f5f5;
  border-radius: 8px;
  padding: 16px;
  margin: 20px 0;
  text-align: left;

  pre {
    margin: 0;
    font-size: 12px;
    color: #666;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 200px;
    overflow-y: auto;
  }
`

// 按钮组样式
const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 24px;
`

interface ErrorFallbackProps {
  error: Error
  resetErrorBoundary: () => void
}

export function ErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // 在开发环境打印错误到控制台
    console.error("应用程序错误:", error)
  }, [error])

  return (
    <ErrorContainer>
      <ErrorCard>
        <ErrorIcon>
          <FrownOutlined />
        </ErrorIcon>

        <Result
          status="error"
          title="哎呀，出现了一些问题"
          subTitle="应用程序遇到了意外错误，请尝试刷新页面或联系技术支持。"
          extra={[
            <ButtonGroup key="buttons">
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
            </ButtonGroup>,
          ]}
        />

        {showDetails && (
          <ErrorDetails>
            <h4>错误信息:</h4>
            <pre>{error.message}</pre>
            {error.stack && (
              <>
                <h4 style={{ marginTop: 16 }}>堆栈跟踪:</h4>
                <pre>{error.stack}</pre>
              </>
            )}
          </ErrorDetails>
        )}
      </ErrorCard>
    </ErrorContainer>
  )
}
