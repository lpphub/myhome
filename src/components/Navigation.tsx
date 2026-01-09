import { Archive, Heart, Home, LogOut, Settings, Sparkles, Tag, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/hooks'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
  description: string
}

const navItems: NavItem[] = [
  {
    id: 'spaces',
    label: '我的空间',
    icon: Archive,
    path: '/',
    description: '空间管理',
  },
  {
    id: 'tags',
    label: '便签墙',
    icon: Tag,
    path: '/tags',
    description: '便签管理',
  },
]

// NavigationLogo 组件
const NavigationLogo = () => {
  return (
    <Link to='/' className='flex items-center space-x-3 hover:opacity-80 transition-opacity'>
      <div className='relative'>
        <div className='w-10 h-10 bg-linear-to-br from-coral-400 to-coral-600 rounded-lg flex items-center justify-center shadow-lg'>
          <Home className='w-5 h-5 text-white' />
        </div>
        <div className='absolute -top-1 -right-1 w-4 h-4 bg-linear-to-br from-honey-400 to-honey-600 rounded-full flex items-center justify-center'>
          <Heart className='w-2 h-2 text-white' />
        </div>
      </div>
      <div className='sm:block'>
        <h1 className='text-lg font-bold text-foreground'>AI记录</h1>
        <p className='text-xs text-foreground'>温馨记录小助手</p>
      </div>
    </Link>
  )
}

// DesktopNav 组件
const DesktopNav = ({ currentPage }: { currentPage: string }) => {
  return (
    <div className='hidden md:flex items-center space-x-1'>
      {navItems.map(item => {
        const isActive = currentPage === item.id
        return (
          <Link
            key={item.id}
            to={item.path}
            className={`group flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors relative ${
              isActive
                ? 'bg-coral-100 text-coral-700'
                : 'text-foreground hover:bg-honey-50 hover:text-honey-700'
            }`}
          >
            {/* 活跃状态的装饰点 */}
            {isActive && (
              <div className='absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full' />
            )}

            <div className='flex items-center space-x-2'>
              {/* 图标 */}
              <div
                className={`p-1.5 rounded-lg ${
                  isActive ? 'bg-white/70' : 'group-hover:bg-white/40'
                }`}
              >
                <item.icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-coral-600' : 'group-hover:text-honey-600'
                  }`}
                />
              </div>

              {/* 文字 */}
              <span className='font-medium'>{item.label}</span>

              {/* 活跃状态的装饰 */}
              {isActive && <Sparkles className='w-3 h-3 text-coral-500' />}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// MobileNav 组件
const MobileNav = ({ currentPage }: { currentPage: string }) => {
  return (
    <div className='md:hidden fixed bottom-0 left-0 right-0 z-50'>
      <div className='bg-white/85 backdrop-blur-xl border-t border-honey-100/80'>
        <div className='flex justify-around'>
          {navItems.map(item => {
            const isActive = currentPage === item.id
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg transition-colors relative ${
                  isActive ? 'text-coral-700 bg-coral-50' : 'text-foreground hover:text-honey-600'
                }`}
              >
                {/* 活跃指示器 */}
                {isActive && (
                  <div className='absolute -top-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full' />
                )}

                <div className={`p-2 rounded-lg mb-1 ${isActive ? 'bg-coral-100' : ''}`}>
                  <item.icon className={`h-4 w-4 ${isActive ? 'text-coral-600' : ''}`} />
                </div>
                <span className='text-xs'>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// NavActions 组件
const NavActions = ({ handleLogout }: { handleLogout: () => void }) => {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  return (
    <div className='flex items-center space-x-2'>
      {/* 设置按钮 */}
      <button
        type='button'
        className='p-2.5 text-foreground hover:text-coral-500 hover:bg-honey-50 rounded-lg transition-colors'
      >
        <Settings className='w-5 h-5' />
      </button>

      {/* 用户信息下拉菜单 兼容移动端 */}
      <div className='relative group' ref={menuRef}>
        <button
          type='button'
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='flex items-center space-x-2 p-2.5 text-foreground hover:bg-honey-50 rounded-lg transition-colors'
        >
          <div className='w-8 h-8 bg-linear-to-br from-honey-400 to-coral-400 rounded-full flex items-center justify-center'>
            <User className='w-4 h-4 text-white' />
          </div>
          <span className='hidden sm:block text-sm font-medium'>
            {user?.name?.split('@')[0] || '用户'}
          </span>
        </button>

        {/* 下拉菜单 */}
        <div
          className={`absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-honey-200 transition-all duration-200 ${
            isMenuOpen
              ? 'opacity-100 visible'
              : 'opacity-0 invisible group-hover:opacity-100 group-hover:visible'
          }`}
        >
          <div className='p-2'>
            <button
              type='button'
              onClick={() => {
                handleLogout()
                setIsMenuOpen(false)
              }}
              className='w-full flex items-center space-x-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer'
            >
              <LogOut className='w-4 h-4' />
              <span>退出登录</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const getCurrentPage = () => {
    const path = location.pathname
    if (path === '/' || path === '') return 'spaces'
    return path.slice(1)
  }

  const currentPage = getCurrentPage()

  const handleLogout = async () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* 顶部导航栏 */}
      <nav className='fixed top-0 left-0 right-0 w-screen z-40 bg-white/85 backdrop-blur-xl border-b border-honey-100/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16'>
            {/* Logo 区域 */}
            <NavigationLogo />

            {/* 主导航项 */}
            <DesktopNav currentPage={currentPage} />

            {/* 右侧操作区 */}
            <NavActions handleLogout={handleLogout} />
          </div>
        </div>
      </nav>

      {/* 移动端底部导航栏 */}
      <MobileNav currentPage={currentPage} />
    </>
  )
}

export default Navigation
