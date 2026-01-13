import { cva, type VariantProps } from 'class-variance-authority'
import { User } from 'lucide-react'
import type { ReactElement } from 'react'
import * as React from 'react'
import { cn } from '@/lib/utils'

const avatarVariants = cva(
  'relative shrink-0 overflow-hidden rounded-full flex items-center justify-center bg-linear-to-br from-honey-400 to-coral-400',
  {
    variants: {
      size: {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-12 h-12 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
)

const AVATAR_SVGS: Record<string, ReactElement> = {
  'avatar-1': (
    <svg
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full h-full'
      role='img'
      aria-label='头像1'
    >
      <defs>
        <linearGradient id='grad1-1' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#A8E6CF' />
          <stop offset='100%' stopColor='#88D8B0' />
        </linearGradient>
      </defs>
      <circle cx='50' cy='50' r='50' fill='url(#grad1-1)' />
      <circle cx='50' cy='44' r='18' fill='#FFFFFF' />
      <circle cx='44' cy='42' r='3' fill='#2D3436' />
      <circle cx='56' cy='42' r='3' fill='#2D3436' />
      <path
        d='M 44 52 Q 50 58 56 52'
        stroke='#2D3436'
        strokeWidth='2.5'
        strokeLinecap='round'
        fill='none'
      />
      <ellipse cx='50' cy='76' rx='14' ry='9' fill='#FFFFFF' opacity='0.6' />
    </svg>
  ),
  'avatar-2': (
    <svg
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full h-full'
      role='img'
      aria-label='头像2'
    >
      <defs>
        <linearGradient id='grad2-1' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#FFEAA7' />
          <stop offset='100%' stopColor='#FDCB6E' />
        </linearGradient>
      </defs>
      <circle cx='50' cy='50' r='50' fill='url(#grad2-1)' />
      <circle cx='50' cy='44' r='20' fill='#FFFFFF' />
      <circle cx='43' cy='42' r='3' fill='#2D3436' />
      <circle cx='57' cy='42' r='3' fill='#2D3436' />
      <circle cx='50' cy='50' r='5' fill='#FF7675' />
      <path
        d='M 43 56 Q 50 62 57 56'
        stroke='#2D3436'
        strokeWidth='2.5'
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  ),
  'avatar-3': (
    <svg
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full h-full'
      role='img'
      aria-label='头像3'
    >
      <defs>
        <linearGradient id='grad3-1' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#A29BFE' />
          <stop offset='100%' stopColor='#6C5CE7' />
        </linearGradient>
      </defs>
      <circle cx='50' cy='50' r='50' fill='url(#grad3-1)' />
      <circle cx='50' cy='46' r='19' fill='#FFFFFF' />
      <ellipse cx='43' cy='44' rx='5' ry='6' fill='#2D3436' />
      <ellipse cx='57' cy='44' rx='5' ry='6' fill='#2D3436' />
      <path
        d='M 44 54 Q 50 60 56 54'
        stroke='#FFFFFF'
        strokeWidth='2.5'
        strokeLinecap='round'
        fill='none'
      />
      <circle cx='35' cy='30' r='6' fill='#FFFFFF' opacity='0.4' />
      <circle cx='65' cy='28' r='4' fill='#FFFFFF' opacity='0.3' />
    </svg>
  ),
  'avatar-4': (
    <svg
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full h-full'
      role='img'
      aria-label='头像4'
    >
      <defs>
        <linearGradient id='grad4-1' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#FAB1A0' />
          <stop offset='100%' stopColor='#FF7675' />
        </linearGradient>
      </defs>
      <circle cx='50' cy='50' r='50' fill='url(#grad4-1)' />
      <circle cx='50' cy='44' r='18' fill='#FFFFFF' />
      <circle cx='44' cy='42' r='2.5' fill='#2D3436' />
      <circle cx='56' cy='42' r='2.5' fill='#2D3436' />
      <path
        d='M 44 51 Q 50 57 56 51'
        stroke='#2D3436'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
      />
      <path
        d='M 38 64 Q 42 68 46 64'
        stroke='#FFFFFF'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
      />
      <path
        d='M 54 64 Q 58 68 62 64'
        stroke='#FFFFFF'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
      />
    </svg>
  ),
  'avatar-5': (
    <svg
      viewBox='0 0 100 100'
      xmlns='http://www.w3.org/2000/svg'
      className='w-full h-full'
      role='img'
      aria-label='头像5'
    >
      <defs>
        <linearGradient id='grad5-1' x1='0%' y1='0%' x2='100%' y2='100%'>
          <stop offset='0%' stopColor='#81ECEC' />
          <stop offset='100%' stopColor='#00CEC9' />
        </linearGradient>
      </defs>
      <circle cx='50' cy='50' r='50' fill='url(#grad5-1)' />
      <circle cx='50' cy='46' r='17' fill='#FFFFFF' />
      <circle cx='45' cy='44' r='2' fill='#2D3436' />
      <circle cx='55' cy='44' r='2' fill='#2D3436' />
      <path
        d='M 45 52 Q 50 56 55 52'
        stroke='#2D3436'
        strokeWidth='2'
        strokeLinecap='round'
        fill='none'
      />
      <circle cx='30' cy='60' r='5' fill='#FFFFFF' opacity='0.5' />
      <circle cx='70' cy='58' r='3' fill='#FFFFFF' opacity='0.4' />
      <circle cx='60' cy='25' r='4' fill='#FFFFFF' opacity='0.3' />
    </svg>
  ),
}

export type AvatarKey = 'avatar-1' | 'avatar-2' | 'avatar-3' | 'avatar-4' | 'avatar-5'

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  src?: string
  name?: string
}

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, name, ...props }, ref) => {
    const isBuiltInAvatar = src && src in AVATAR_SVGS
    const isExternalUrl = src && !isBuiltInAvatar

    return (
      <div ref={ref} className={cn(avatarVariants({ size, className }))} {...props}>
        {isExternalUrl ? (
          <img src={src} alt={name} className='w-full h-full object-cover' />
        ) : isBuiltInAvatar ? (
          <div className='w-full h-full flex items-center justify-center'>
            {AVATAR_SVGS[src as AvatarKey]}
          </div>
        ) : name ? (
          <span className='text-white font-medium'>{name.charAt(0).toUpperCase()}</span>
        ) : (
          <User className='w-1/2 h-1/2 text-white' />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'

const AVATAR_KEYS = Object.keys(AVATAR_SVGS) as AvatarKey[]

export { Avatar, avatarVariants, AVATAR_SVGS, AVATAR_KEYS }
