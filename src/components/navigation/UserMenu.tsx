import { LogOut, Settings } from 'lucide-react'
import { memo, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Avatar } from '@/components/ui/avatar'
import { useAuth, useClickOutside } from '@/hooks'
import { cn } from '@/lib/utils'

export const UserMenu = memo(function UserMenu() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setOpen(false), open)

  return (
    <div ref={ref} className='relative w-full flex justify-end'>
      <button
        type='button'
        onClick={() => setOpen(v => !v)}
        className='flex items-center gap-2 p-2.5 rounded-lg hover:text-coral-400 transition-colors'
      >
        <Avatar src={user?.avatar} name={user?.name} size='sm' />

        <span className='hidden sm:block text-sm font-medium max-w-24 truncate'>
          {user?.name || 'user'}
        </span>
      </button>

      <div
        className={cn(
          'absolute right-0 top-full mt-1 w-36 rounded-lg bg-white border border-honey-200 shadow-lg transition-all',
          open ? 'opacity-100 visible' : 'opacity-0 invisible'
        )}
      >
        <div className='p-2'>
          <button
            type='button'
            onClick={() => {
              navigate('/profile')
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
              logout()
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
})
UserMenu.displayName = 'UserMenu'
