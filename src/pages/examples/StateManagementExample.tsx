import { useQuery } from "@tanstack/react-query"
import { Button, Card, Col, Divider, Row, Space, Typography } from "antd"
import { useAppStore, useCounterStore } from "@/stores"

const { Title, Text } = Typography

// 模拟 API 函数
const fetchData = async () => {
  // 模拟网络请求
  await new Promise(resolve => setTimeout(resolve, 1000))
  return {
    message: "数据加载成功",
    timestamp: new Date().toLocaleString(),
    randomValue: Math.floor(Math.random() * 1000),
  }
}

export function StateManagementExample() {
  // Zustand hooks
  const { count, increment, decrement, reset } = useCounterStore()
  const { theme, sidebarCollapsed, toggleSidebar, setTheme } = useAppStore()

  // TanStack Query hook
  const {
    data: queryData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["example-data", count],
    queryFn: fetchData,
    enabled: count > 2, // 只有当 count > 2 时才执行查询
  })

  return (
    <div className="space-y-4">
      <Title level={2}>状态管理与数据获取示例</Title>

      {/* Zustand Counter 示例 */}
      <Card title="Zustand Counter Store">
        <Space direction="vertical" size="large" className="w-full">
          <Text strong>当前计数: {count}</Text>
          <Space>
            <Button type="primary" onClick={increment}>
              增加 (+)
            </Button>
            <Button onClick={decrement} disabled={count === 0}>
              减少 (-)
            </Button>
            <Button danger onClick={reset}>
              重置
            </Button>
          </Space>
          <Text type="secondary">Counter 会持久化到 localStorage，刷新页面后仍然保留</Text>
        </Space>
      </Card>

      {/* Zustand App Settings 示例 */}
      <Card title="Zustand App Store">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text strong>主题: {theme}</Text>
            <Space>
              <Button
                type={theme === "light" ? "primary" : "default"}
                onClick={() => setTheme("light")}
              >
                浅色
              </Button>
              <Button
                type={theme === "dark" ? "primary" : "default"}
                onClick={() => setTheme("dark")}
              >
                深色
              </Button>
            </Space>
          </Col>
          <Col span={8}>
            <Text strong>侧边栏: {sidebarCollapsed ? "收起" : "展开"}</Text>
            <Button onClick={toggleSidebar}>切换状态</Button>
          </Col>
        </Row>
      </Card>

      <Divider />

      {/* TanStack Query 示例 */}
      <Card title="TanStack Query">
        <Space direction="vertical" size="large">
          <Text>
            <Text strong>条件查询:</Text> 只有当计数 {">"} 2 时才获取数据
          </Text>

          <Space>
            <Text type="secondary">
              当前计数: {count} {count <= 2 && "(需要 > 2 才会查询)"}
            </Text>
            <Button onClick={() => refetch()} loading={isLoading} disabled={count <= 2}>
              重新获取数据
            </Button>
          </Space>

          {isLoading && <Text type="secondary">正在加载数据...</Text>}

          {error && <Text type="danger">获取数据失败: {error.message}</Text>}

          {queryData && (
            <Card size="small" className="bg-gray-50">
              <Text strong>查询结果:</Text>
              <ul>
                <li>消息: {queryData.message}</li>
                <li>时间: {queryData.timestamp}</li>
                <li>随机值: {queryData.randomValue}</li>
              </ul>
            </Card>
          )}
        </Space>
      </Card>

      {/* 特性说明 */}
      <Card title="集成特性说明">
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Text strong>Zustand 5.0.9</Text>
            <ul>
              <li>轻量级状态管理</li>
              <li>TypeScript 友好</li>
              <li>持久化中间件</li>
              <li>DevTools 集成</li>
            </ul>
          </Col>
          <Col span={8}>
            <Text strong>TanStack Query 5.90.12</Text>
            <ul>
              <li>服务器状态管理</li>
              <li>缓存和后台更新</li>
              <li>并行查询</li>
              <li>乐观更新</li>
            </ul>
          </Col>
          <Col span={8}>
            <Text strong>React Router 7.10.1</Text>
            <ul>
              <li>客户端路由</li>
              <li>代码分割</li>
              <li>数据预加载</li>
              <li>搜索参数</li>
            </ul>
          </Col>
        </Row>
      </Card>
    </div>
  )
}
