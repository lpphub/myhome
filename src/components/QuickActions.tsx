import { Button, Col, Row, Space } from "antd"
import { BulbOutlined, FireOutlined, LockOutlined, WifiOutlined } from "@ant-design/icons"
import { motion } from "motion/react"

export function QuickActions() {
  const actions = [
    { icon: <BulbOutlined />, label: "全部照明", color: "bg-orange-100 text-orange-600" },
    { icon: <LockOutlined />, label: "安防模式", color: "bg-blue-100 text-blue-600" },
    { icon: <WifiOutlined />, label: "网络控制", color: "bg-green-100 text-green-600" },
    { icon: <FireOutlined />, label: "温度调节", color: "bg-red-100 text-red-600" },
  ]

  return (
    <Space direction="vertical" size="middle" className="w-full">
      {actions.map((action, index) => (
        <motion.div
          key={action.label}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 + index * 0.1 }}
        >
          <Button
            size="large"
            className="w-full h-16 flex items-center justify-start"
            onClick={() => console.log(`${action.label} clicked`)}
          >
            <Space size="middle">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${action.color}`}>
                {action.icon}
              </div>
              <span className="text-base">{action.label}</span>
            </Space>
          </Button>
        </motion.div>
      ))}
    </Space>
  )
}