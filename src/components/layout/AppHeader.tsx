import { LogoutOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Dropdown, Layout, Space, Switch, Typography } from "antd"
import { useAppStore } from "@/stores"

const { Header } = Layout
const { Title } = Typography

export function AppHeader() {
  const { theme, setTheme } = useAppStore()

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    window.location.href = "/signin"
  }

  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "个人资料",
    },
    {
      type: "divider" as const,
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "退出登录",
      onClick: handleLogout,
    },
  ]

  return (
    <Header className="flex-between px-4 md:px-6 shadow-sm bg-white">
      <Title level={3} className="m-0 text-primary">
        我的家 - 家庭物品收纳管理
      </Title>
      <Space size="middle">
        <span>主题:</span>
        <Switch
          checked={theme === "dark"}
          onChange={checked => setTheme(checked ? "dark" : "light")}
          checkedChildren="暗"
          unCheckedChildren="明"
        />
        <Dropdown
          menu={{
            items: userMenuItems,
          }}
          placement="bottomRight"
          arrow
        >
          <Button type="text" icon={<Avatar size="small" icon={<UserOutlined />} />}>
            用户
          </Button>
        </Dropdown>
      </Space>
    </Header>
  )
}
