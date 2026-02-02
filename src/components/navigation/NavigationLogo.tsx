import { Heart, Home } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router'
import { env } from '@/utils/env'

export const NavigationLogo = memo(() => (
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
))
NavigationLogo.displayName = 'NavigationLogo'
