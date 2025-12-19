import {
  Archive,
  Camera,
  Heart,
  Home,
  LogOut,
  Plus,
  Search,
  Settings,
  Sparkles,
  Tag,
  User,
} from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  description: string
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: '首页',
    icon: Home,
    path: '/',
    description: '家庭收纳控制中心',
  },
  {
    id: 'spaces',
    label: '收纳空间',
    icon: Archive,
    path: '/spaces',
    description: '房屋平面图',
  },
  {
    id: 'items',
    label: '物品收藏',
    icon: Camera,
    path: '/items',
    description: '物品收藏展示',
  },
  {
    id: 'tags',
    label: '分类标签',
    icon: Tag,
    path: '/tags',
    description: '分类标签管理',
  },
]

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const getCurrentPage = () => {
    const path = location.pathname
    if (path === '/' || path === '') return 'dashboard'
    return path.slice(1) // 移除前导斜杠
  }

  const currentPage = getCurrentPage()

  const handleLogout = async () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* 顶部导航栏 - 温馨小型设计 */}
      <nav className='fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-honey-100/80 shadow-[0_1px_3px_-1px_rgba(0,0,0,0.04),0_1px_2px_-1px_rgba(0,0,0,0.02)]'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo 区域 - 小巧设计 */}
            <Link
              to='/'
              className='flex items-center space-x-3 hover:opacity-80 transition-opacity'
            >
              <div className='relative'>
                <div className='w-10 h-10 bg-gradient-to-br from-coral-400 to-coral-600 rounded-2xl flex items-center justify-center shadow-lg'>
                  <Home className='w-5 h-5 text-white' />
                </div>
                <div className='absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-honey-400 to-honey-600 rounded-full flex items-center justify-center'>
                  <Heart className='w-2 h-2 text-white' />
                </div>
              </div>
              <div className='hidden sm:block'>
                <h1 className='text-lg font-bold text-warmGray-800'>家庭收纳小助手</h1>
                <p className='text-xs text-warmGray-600'>温馨收纳助手</p>
              </div>
            </Link>

            {/* 主导航项 - 水平排列 */}
            <div className='hidden md:flex items-center space-x-1'>
              {navItems.map((item, index) => {
                const isActive = currentPage === item.id
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`
                      group flex items-center px-4 py-2 text-sm font-medium rounded-2xl transition-all duration-300 relative
                      ${
                        isActive
                          ? 'bg-gradient-to-r from-coral-100 to-coral-200 text-coral-700 shadow-md transform scale-105'
                          : 'text-warmGray-600 hover:bg-honey-50 hover:text-honey-700 hover:shadow-sm'
                      }
                    `}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {/* 活跃状态的装饰点 */}
                    {isActive && (
                      <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full animate-pulse'></div>
                    )}

                    <div className='flex items-center space-x-2'>
                      {/* 图标 */}
                      <div
                        className={`
                        p-1.5 rounded-xl transition-all duration-300
                        ${isActive ? 'bg-white/60' : 'group-hover:bg-white/40'}
                      `}
                      >
                        <item.icon
                          className={`w-4 h-4 transition-all duration-300 ${
                            isActive ? 'text-coral-600' : 'group-hover:text-honey-600'
                          }`}
                        />
                      </div>

                      {/* 文字 */}
                      <span className='font-medium'>{item.label}</span>

                      {/* 活跃状态的装饰 */}
                      {isActive && <Sparkles className='w-3 h-3 text-coral-500 animate-pulse' />}
                    </div>
                  </Link>
                )
              })}
            </div>

            {/* 右侧操作区 */}
            <div className='flex items-center space-x-2'>
              {/* 搜索按钮 */}
              <button
                type='button'
                className='p-2.5 text-warmGray-500 hover:text-honey-600 hover:bg-honey-50 rounded-xl transition-all duration-300 group'
              >
                <Search className='w-5 h-5 group-hover:scale-110 transition-transform' />
              </button>

              {/* 设置按钮 */}
              <button
                type='button'
                className='p-2.5 text-warmGray-500 hover:text-honey-600 hover:bg-honey-50 rounded-xl transition-all duration-300 group'
              >
                <Settings className='w-5 h-5 group-hover:rotate-45 transition-transform' />
              </button>

              {/* 用户信息下拉菜单 */}
              <div className='relative group'>
                <button
                  type='button'
                  className='flex items-center space-x-2 p-2.5 text-warmGray-700 hover:bg-honey-50 rounded-xl transition-all duration-300'
                >
                  <div className='w-8 h-8 bg-gradient-to-br from-honey-400 to-coral-400 rounded-full flex items-center justify-center'>
                    <User className='w-4 h-4 text-white' />
                  </div>
                  <span className='hidden sm:block text-sm font-medium'>
                    {user?.name || user?.email?.split('@')[0] || '用户'}
                  </span>
                </button>

                {/* 下拉菜单 */}
                <div className='absolute right-0 mt-2 w-40 bg-white rounded-xl shadow-warm-lg border border-honey-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-2'>
                  <div className='p-2'>
                    <button
                      type='button'
                      onClick={handleLogout}
                      className='w-full flex items-center space-x-2 px-3 py-2 text-sm text-semantic-danger hover:bg-semantic-danger/10 rounded-lg transition-colors cursor-pointer'
                    >
                      <LogOut className='w-4 h-4' />
                      <span>退出登录</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* 移动端底部导航栏 */}
      <div className='md:hidden fixed bottom-0 left-0 right-0 z-50'>
        <div className='bg-white/85 backdrop-blur-xl border-t border-honey-100/80 shadow-[0_-1px_3px_-1px_rgba(0,0,0,0.04),0_-1px_2px_-1px_rgba(0,0,0,0.02)] px-3 py-2'>
          <div className='flex justify-around'>
            {navItems.map(item => {
              const isActive = currentPage === item.id
              return (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`
                    flex flex-col items-center px-3 py-2 text-xs font-medium rounded-2xl transition-all duration-300 relative
                    ${
                      isActive
                        ? 'text-coral-700 bg-coral-50 shadow-md scale-105'
                        : 'text-warmGray-600 hover:text-honey-600 hover:bg-honey-50'
                    }
                  `}
                >
                  {/* 活跃指示器 */}
                  {isActive && (
                    <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full animate-pulse'></div>
                  )}

                  <div
                    className={`
                    p-2 rounded-xl mb-1 transition-all duration-300
                    ${
                      isActive
                        ? 'bg-gradient-to-br from-coral-100 to-coral-200'
                        : 'group-hover:bg-white/60'
                    }
                  `}
                  >
                    <item.icon className={`h-4 w-4 ${isActive ? 'text-coral-600' : ''}`} />
                  </div>
                  <span className='text-xs'>{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default Navigation
