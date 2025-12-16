import { FileText, Home, LogOut, Settings } from "lucide-react"
import { motion } from "motion/react"
import { useNavigate } from "react-router"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    toast.success("已退出登录")
    navigate("/login")
  }

  const getUserInitial = (username: string) => {
    return username.charAt(0).toUpperCase()
  }

  const menuItems = [
    { icon: Home, label: "首页", active: true },
    { icon: FileText, label: "空间", active: false },
    { icon: Settings, label: "收纳", active: false },
    { icon: Settings, label: "标签", active: false },
  ]

  return (
    <div className="min-h-screen bg-[#faf9f7]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-light text-[#3d3d3d]">我的主页</h1>
            </div>

            <div className="flex items-center space-x-4">
              {user && (
                <>
                  <div className="flex items-center space-x-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#c9a87c] text-white flex items-center justify-center font-medium">
                        {getUserInitial(user.name)}
                      </div>
                    )}
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-[#3d3d3d]">{user.name}</p>
                      {user.role && <p className="text-xs text-gray-500">{user.role}</p>}
                    </div>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
                    title="退出登录"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline">退出</span>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-light text-[#3d3d3d] mb-2">
            欢迎回来，{user?.name}！
          </h2>
          <p className="text-gray-600">今天是个美好的一天，让我们开始工作吧。</p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[
            { label: "项目数量", value: "12", change: "+2" },
            { label: "任务完成", value: "89%", change: "+5%" },
            { label: "团队成员", value: "6", change: "0" },
            { label: "本月活跃", value: "24天", change: "+2天" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
              <p className="text-2xl font-light text-[#3d3d3d] mt-2">{stat.value}</p>
              <p className="text-sm text-green-600 mt-2">{stat.change}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-medium text-[#3d3d3d] mb-4">最近项目</h3>
              <div className="space-y-4">
                {[1, 2, 3].map(item => (
                  <div
                    key={item}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium text-[#3d3d3d]">项目 {item}</h4>
                      <p className="text-sm text-gray-600">项目描述信息...</p>
                    </div>
                    <span className="text-sm text-[#c9a87c]">查看详情 →</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-medium text-[#3d3d3d] mb-4">快捷操作</h3>
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <button
                    key={index}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      item.active ? "bg-[#c9a87c] text-white" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white rounded-lg shadow-sm p-6"
            >
              <h3 className="text-lg font-medium text-[#3d3d3d] mb-4">用户信息</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">用户ID</span>
                  <span className="text-[#3d3d3d]">#{user?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">用户名</span>
                  <span className="text-[#3d3d3d]">{user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">角色</span>
                  <span className="text-[#3d3d3d]">{user?.role || "用户"}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
