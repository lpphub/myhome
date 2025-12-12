import { Button } from "antd"

export function ErrorBoundaryTest() {
  const handleThrowError = () => {
    throw new Error("这是一个测试错误，用于验证错误边界功能")
  }

  const handleThrowAsyncError = async () => {
    // 模拟异步错误
    await Promise.reject(new Error("这是一个异步错误测试"))
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>错误边界测试</h2>
      <p>点击以下按钮测试错误边界功能：</p>
      <Button type="primary" danger onClick={handleThrowError} style={{ marginRight: 10 }}>
        抛出同步错误
      </Button>
      <Button type="primary" danger onClick={handleThrowAsyncError}>
        抛出异步错误
      </Button>
    </div>
  )
}
