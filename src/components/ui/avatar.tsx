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
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像1</title>
      <circle cx='50' cy='50' r='50' fill='#FFE4C4' />
      <circle cx='50' cy='40' r='20' fill='#FFDAB9' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <path d='M 43 48 Q 50 55 57 48' stroke='#333' strokeWidth='2' fill='none' />
      <ellipse cx='50' cy='70' rx='25' ry='15' fill='#FFB6C1' />
    </svg>
  ),
  'avatar-2': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像2</title>
      <circle cx='50' cy='50' r='50' fill='#E6E6FA' />
      <circle cx='50' cy='40' r='20' fill='#FFF8DC' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <circle cx='50' cy='47' r='2' fill='#FFB6C1' />
      <path d='M 35 65 Q 50 75 65 65' stroke='#8B4513' strokeWidth='3' fill='none' />
      <circle cx='30' cy='40' r='12' fill='#8B4513' opacity='0.9' />
      <circle cx='70' cy='40' r='12' fill='#8B4513' opacity='0.9' />
    </svg>
  ),
  'avatar-3': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像3</title>
      <circle cx='50' cy='50' r='50' fill='#98FB98' />
      <circle cx='50' cy='40' r='20' fill='#FFFACD' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <path d='M 43 48 Q 50 52 57 48' stroke='#333' strokeWidth='2' fill='none' />
      <path
        d='M 30 35 L 25 25 M 35 30 L 32 20 M 70 35 L 75 25 M 65 30 L 68 20'
        stroke='#32CD32'
        strokeWidth='3'
        fill='none'
      />
    </svg>
  ),
  'avatar-4': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像4</title>
      <circle cx='50' cy='50' r='50' fill='#FFA07A' />
      <circle cx='50' cy='40' r='20' fill='#FFEFD5' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <circle cx='44' cy='46' r='2' fill='#FF69B4' />
      <circle cx='56' cy='46' r='2' fill='#FF69B4' />
      <path d='M 40 55 Q 50 62 60 55' stroke='#333' strokeWidth='2' fill='none' />
      <rect x='35' y='20' width='30' height='20' rx='5' fill='#FF6347' />
    </svg>
  ),
  'avatar-5': (
    <svg viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg' className='w-full h-full'>
      <title>卡通头像5</title>
      <circle cx='50' cy='50' r='50' fill='#DDA0DD' />
      <circle cx='50' cy='40' r='20' fill='#F0E68C' />
      <circle cx='43' cy='37' r='3' fill='#333' />
      <circle cx='57' cy='37' r='3' fill='#333' />
      <path d='M 43 48 Q 50 53 57 48' stroke='#333' strokeWidth='2' fill='none' />
      <circle cx='38' cy='45' r='3' fill='#FFB6C1' opacity='0.5' />
      <circle cx='62' cy='45' r='3' fill='#FFB6C1' opacity='0.5' />
      <path d='M 28 70 Q 50 85 72 70' stroke='#9370DB' strokeWidth='4' fill='none' />
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
