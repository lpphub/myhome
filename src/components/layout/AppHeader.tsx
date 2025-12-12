import { Layout, Space, Switch, Typography } from "antd"
import { useAppStore } from "@/stores"

const { Header } = Layout
const { Title } = Typography

export function AppHeader() {
  const { theme, setTheme } = useAppStore()

  return (
    <Header className="flex-between px-4 md:px-6 shadow-sm bg-white">
      <Title level={3} className="m-0 text-primary">
        我的家 - 家庭物品收纳管理
      </Title>
      <Space>
        <span>主题:</span>
        <Switch
          checked={theme === "dark"}
          onChange={checked => setTheme(checked ? "dark" : "light")}
          checkedChildren="暗"
          unCheckedChildren="明"
        />
      </Space>
    </Header>
  )
}
