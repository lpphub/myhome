import { Button, Space } from "antd"
import { BulbOutlined, FireOutlined, LockOutlined, WifiOutlined } from "@ant-design/icons"
import { motion } from "motion/react"
import { warmTheme } from "@/styles/theme"

export function QuickActions() {
  const actions = [
    {
      icon: <BulbOutlined />,
      label: "全部照明",
      bgColor: "#FEF7E0",
      iconColor: "#D4A574",
    },
    {
      icon: <LockOutlined />,
      label: "安防模式",
      bgColor: "#F0F7FF",
      iconColor: "#8B9DC3",
    },
    {
      icon: <WifiOutlined />,
      label: "网络控制",
      bgColor: "#F0F9F4",
      iconColor: "#7BA05B",
    },
    {
      icon: <FireOutlined />,
      label: "温度调节",
      bgColor: "#FEF0F0",
      iconColor: "#C97064",
    },
  ]

  return (
    <Space direction="vertical" size="middle" className="w-full">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 + index * 0.05, duration: 0.3 }}
        >
          <Button
            size="large"
            className="w-full h-14 flex items-center justify-start hover:border-[#C9A87C] transition-colors"
            style={{
              borderRadius: warmTheme.borderRadius.small,
              border: `1px solid ${warmTheme.colors.border}`,
              backgroundColor: "transparent",
              padding: "0 16px",
            }}
            onClick={() => console.log(`${action.label} clicked`)}
          >
            <Space size="middle">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{
                  backgroundColor: action.bgColor,
                  color: action.iconColor,
                }}
              >
                {action.icon}
              </div>
              <span
                style={{
                  color: warmTheme.colors.textPrimary,
                  fontSize: warmTheme.typography.fontSize.base,
                  fontWeight: warmTheme.typography.fontWeight.normal,
                }}
              >
                {action.label}
              </span>
            </Space>
          </Button>
        </motion.div>
      ))}
    </Space>
  )
}
