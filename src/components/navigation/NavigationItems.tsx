import { Sparkles } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/utils'

export interface NavItem {
  id: string
  label: string
  path: string
}

export const navItems: NavItem[] = [
  { id: 'home', label: '首页', path: '/' },
  { id: 'tags', label: '便签墙', path: '/tags' },
  { id: 'notes', label: '随时记', path: '/notes' },
]

interface NavigationItemsProps {
  currentPage: string
  variant?: 'desktop' | 'mobile'
}

export const NavigationItems = memo(function NavigationItems({
  currentPage,
  variant = 'desktop',
}: NavigationItemsProps) {
  const isDesktop = variant === 'desktop'

  return isDesktop ? (
    <div className='hidden md:flex justify-center gap-1'>
      {navItems.map(item => {
        const active = currentPage === item.id

        return (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              'group relative flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors',
              active
                ? 'bg-coral-100 text-coral-700'
                : 'text-foreground hover:bg-honey-50 hover:text-coral-400'
            )}
          >
            {active && (
              <div className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full' />
            )}

            <span>{item.label}</span>

            {active && <Sparkles className='w-3 h-3 text-coral-500 opacity-100' />}
          </Link>
        )
      })}
    </div>
  ) : (
    <div className='md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/85 backdrop-blur-xl border-t border-honey-100/80 flex justify-around'>
      {navItems.map(item => {
        const active = currentPage === item.id

        return (
          <Link
            key={item.id}
            to={item.path}
            className={cn(
              'relative flex flex-col items-center px-3 py-2 text-xs font-medium rounded-lg',
              active ? 'text-coral-700 bg-coral-50' : 'text-foreground hover:text-honey-600'
            )}
          >
            {active && (
              <div className='absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-coral-500 rounded-full' />
            )}

            <span className='mt-1'>{item.label}</span>
          </Link>
        )
      })}
    </div>
  )
})
NavigationItems.displayName = 'NavigationItems'
