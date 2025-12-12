import { Layout } from "antd"

const { Sider } = Layout

export function AppSider() {
  return (
    <Sider
      width={200}
      className="bg-white shadow-md hide-on-mobile"
      style={{
        position: "fixed",
        left: 0,
        top: 64,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <div className="h-16 flex items-center justify-center px-4">
        <span className="text-lg font-semibold text-gray-800 truncate">收纳管理系统</span>
      </div>
    </Sider>
  )
}
