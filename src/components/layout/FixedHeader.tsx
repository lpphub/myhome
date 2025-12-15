import { LogoutOutlined, UserOutlined } from "@ant-design/icons"
import { Avatar, Button, Dropdown, Typography } from "antd"
import { useNavigate } from "react-router"
import { useUserStore } from "@/stores/userStore"
import { warmTheme } from "@/styles/theme"

const { Title } = Typography

export function FixedHeader() {
  const navigate = useNavigate()
  const { userInfo, clearTokens, clearUserInfo } = useUserStore()

  const handleLogout = () => {
    clearTokens()
    clearUserInfo()
    navigate("/signin")
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
    <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-[#E8E6E3] z-50">
      <div className="max-w-[1200px] mx-auto px-8 h-full flex items-center justify-between">
        {/* Logo */}
        <div>
          <Title
            level={3}
            className="m-0"
            style={{
              color: warmTheme.colors.primary,
              fontWeight: warmTheme.typography.fontWeight.medium,
            }}
          >
            我的家
          </Title>
        </div>

        {/* Navigation Menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            onClick={() => navigate("/dashboard")}
          >
            首页
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            onClick={() => console.log("设备页面")}
          >
            设备
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            onClick={() => console.log("场景页面")}
          >
            场景
          </button>
          <button
            type="button"
            className="text-gray-600 hover:text-gray-900 transition-colors font-medium"
            onClick={() => console.log("设置页面")}
          >
            设置
          </button>
        </nav>

        {/* User Menu */}
        <Dropdown
          menu={{
            items: userMenuItems,
          }}
          placement="bottomRight"
          arrow
        >
          <Button type="text" className="flex items-center space-x-2 hover:bg-gray-50">
            <Avatar
              size="small"
              icon={<UserOutlined />}
              style={{ backgroundColor: warmTheme.colors.primary }}
            />
            <span className="text-gray-700">{userInfo?.username || "用户"}</span>
          </Button>
        </Dropdown>
      </div>
    </header>
  )
}
