import { Loader2 } from 'lucide-react'
import type React from 'react'

interface ButtonProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'warm' | 'coral' | 'lavender'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void
  disabled?: boolean
  className?: string
  type?: 'button' | 'submit' | 'reset'
  decorative?: boolean
  loading?: boolean
  style?: React.CSSProperties
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  className = '',
  type = 'button',
  decorative = false,
  loading = false,
  style = {},
}) => {
  // 基础样式类
  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-2xl
    transition-all duration-300 ease-out focus:outline-none focus:ring-2
    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
    disabled:transform-none relative overflow-hidden group
  `

  // 变体样式
  const variantClasses = {
    primary: `
      bg-gradient-to-r from-honey-500 to-honey-600 text-white
      hover:from-honey-600 hover:to-honey-700 hover:shadow-warm-lg
      hover:scale-105 active:scale-95 focus:ring-honey-300
    `,
    secondary: `
      bg-gradient-to-r from-cream-100 to-cream-200 text-honey-700
      hover:from-cream-200 hover:to-cream-300 hover:text-honey-800
      hover:shadow-warm-md hover:scale-102 focus:ring-honey-300
    `,
    ghost: `
      text-warmGray-700 hover:text-honey-700 hover:bg-white/60
      hover:shadow-soft focus:ring-honey-300
    `,
    warm: `
      bg-gradient-to-r from-honey-400 to-coral-400 text-white
      hover:from-honey-500 hover:to-coral-500 hover:shadow-warm-lg
      hover:scale-105 focus:ring-coral-300
    `,
    coral: `
      bg-gradient-to-r from-coral-500 to-coral-600 text-white
      hover:from-coral-600 hover:to-coral-700 hover:shadow-warm-lg
      hover:scale-105 focus:ring-coral-300
    `,
    lavender: `
      bg-gradient-to-r from-lavender-500 to-lavender-600 text-white
      hover:from-lavender-600 hover:to-lavender-700 hover:shadow-warm-lg
      hover:scale-105 focus:ring-lavender-300
    `,
  }

  // 尺寸样式
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[36px]',
    md: 'px-6 py-3 text-sm min-h-[44px]',
    lg: 'px-8 py-4 text-base min-h-[52px]',
    xl: 'px-10 py-5 text-lg min-h-[60px]',
  }

  // 组合样式
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      style={style}
    >
      {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}

      <span className='relative z-10 flex items-center'>
        {children}

        {decorative && !disabled && (
          <span
            aria-hidden
            className='absolute inset-0 bg-white/20 rounded-full scale-0 group-hover:scale-150 transition-transform duration-500'
          />
        )}
      </span>
    </button>
  )
}

export default Button
