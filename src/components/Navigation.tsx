import { Archive, Heart, Home, LogOut, Settings, Sparkles, Tag, User } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '@/hooks'
import { AVATAR_SVGS } from '@/pages/profile/components/Avatars'
import { env } from '@/utils/env'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  path: string
}

const navItems: NavItem[] = [
  { id: 'home', label: '首页', icon: Home, path: '/landing' },
  { id: 'spaces', label: '我的空间', icon: Archive, path: '/' },
  { id: 'tags', label: '便签墙', icon: Tag, path: '/tags' },
]

/* --------------------------------
 * Logo（左侧：max-content）
 * -------------------------------- */
const NavigationLogo = () => (
  <Link to='/' className='flex items-center gap-3 hover:opacity-80 transition-opacity max-w-60'>
    <div className='relative shrink-0'>
      <div className='w-10 h-10 bg-linear-to-br from-coral-400 to-coral-600 rounded-lg flex items-center justify-center shadow-lg'>
        <Home className='w-5 h-5 text-white' />
      </div>
      <div className='absolute -top-1 -right-1 w-4 h-4 bg-linear-to-br from-honey-400 to-honey-600 rounded-full flex items-center justify-center'>
        <Heart className='w-2 h-2 text-white' />
      </div>
    </div>

    <div className='min-w-0'>
      <h1 className='text-lg font-bold text-foreground truncate'>{env.APP_NAME}</h1>
      <p className='text-xs text-foreground truncate'>{env.APP_TITLE || '温馨记录小助手'}</p>
    </div>
  </Link>
)

/* --------------------------------
 * Desktop Nav（中间：1fr）
 * -------------------------------- */
const DesktopNav = ({ currentPage }: { currentPage: string }) => (
  <div className='hidden md:flex justify-center gap-1'>
    {navItems.map(item => {
      const active = currentPage === item.id

      return (
        <Link
          key={item.id}
          to={item.path}
          className={`group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
            active
              ? 'bg-coral-100 text-coral-700'
              : 'text-foreground hover:bg-honey-50 hover:text-coral-400'
          }`}
        >
          {active && (
            <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full' />
          )}

          <div className={`p-1.5 rounded-lg ${active ? 'bg-white/70' : 'group-hover:bg-white/40'}`}>
            <item.icon
              className={`w-4 h-4 ${active ? 'text-coral-600' : 'group-hover:text-honey-600'}`}
            />
          </div>

          <span>{item.label}</span>

          <Sparkles
            className={`w-3 h-3 ${
              active ? 'text-coral-500 opacity-100' : 'opacity-0 text-transparent'
            }`}
          />
        </Link>
      )
    })}
  </div>
)

/* --------------------------------
 * Mobile Nav
 * -------------------------------- */
const MobileNav = ({ currentPage }: { currentPage: string }) => (
  <div className='md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/85 backdrop-blur-xl border-t border-honey-100/80 flex justify-around'>
    {navItems.map(item => {
      const active = currentPage === item.id

      return (
        <Link
          key={item.id}
          to={item.path}
          className={`relative flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg ${
            active ? 'text-coral-700 bg-coral-50' : 'text-foreground hover:text-honey-600'
          }`}
        >
          {active && (
            <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full' />
          )}

          <div className={`p-2 rounded-lg mb-1 ${active ? 'bg-coral-100' : ''}`}>
            <item.icon className='w-4 h-4' />
          </div>

          <span>{item.label}</span>
        </Link>
      )
    })}
  </div>
)

/* --------------------------------
 * User Menu（右侧：固定）
 * -------------------------------- */
const NavActions = ({ onLogout, onProfile }: { onLogout: () => void; onProfile: () => void }) => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])

  return (
    <div ref={ref} className='relative w-full flex justify-end'>
      <button
        type='button'
        onClick={() => setOpen(v => !v)}
        className='flex items-center gap-2 p-2.5 rounded-lg hover:bg-honey-50 transition-colors'
      >
        <div className='w-8 h-8 rounded-full flex items-center justify-center overflow-hidden bg-linear-to-br from-honey-400 to-coral-400'>
          {user?.avatar ? (
            <div className='w-full h-full flex items-center justify-center'>
              {AVATAR_SVGS[user.avatar]}
            </div>
          ) : (
            <User className='w-4 h-4 text-white' />
          )}
        </div>

        <span className='hidden sm:block text-sm font-medium max-w-24 truncate'>
          {user?.name || '用户'}
        </span>
      </button>

      <div
        className={`absolute right-0 top-full mt-2 w-32 rounded-lg bg-white border border-honey-200 shadow-lg transition-all ${
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
      >
        <div className='p-2'>
          <button
            type='button'
            onClick={() => {
              onProfile()
              setOpen(false)
            }}
            className='w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 rounded-md'
          >
            <Settings className='w-4 h-4' />
            设置
          </button>

          <button
            type='button'
            onClick={() => {
              onLogout()
              setOpen(false)
            }}
            className='w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md'
          >
            <LogOut className='w-4 h-4' />
            退出登录
          </button>
        </div>
      </div>
    </div>
  )
}

/* --------------------------------
 * Main Navigation
 * -------------------------------- */
export default function Navigation() {
  const location = useLocation()
  const navigate = useNavigate()
  const { logout } = useAuth()

  const currentPage = location.pathname === '/' ? 'spaces' : location.pathname.slice(1)

  return (
    <>
      <nav className='fixed top-0 inset-x-0 z-40 bg-white/85 backdrop-blur-xl border-b border-honey-100/80'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div
            className='
        h-16 items-center
        flex justify-between
        md:grid md:grid-cols-[max-content_1fr_160px]
      '
          >
            {/* 左侧 Logo */}
            <NavigationLogo />

            {/* 桌面中间导航 */}
            <DesktopNav currentPage={currentPage} />

            {/* 右侧用户区 */}
            <NavActions
              onLogout={() => {
                logout()
                navigate('/login')
              }}
              onProfile={() => navigate('/profile')}
            />
          </div>
        </div>
      </nav>

      <MobileNav currentPage={currentPage} />
    </>
  )
}
